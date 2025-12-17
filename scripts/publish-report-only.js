#!/usr/bin/env node

/**
 * Script para SOLO generar reporte Allure y publicar a GitHub Pages
 * (Asume que ya se ejecutaron los tests)
 * Uso: npm run publish:report
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const TEMP_REPORT_DIR = path.join(os.homedir(), 'temp-allure');
const CURRENT_DATE = new Date().toISOString().split('T')[0];

function q(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function uniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

class ReportPublisher {
  
  async publishReport() {
    const initialBranch = await this.getCurrentBranchOptional();

    try {
      console.log('📊 Iniciando generación y publicación de reportes...\n');
      
      // Verificar que existen resultados de tests
      await this.checkTestResults();
      
      // Generar reporte Allure
      await this.generateAllureReport();
      
      // Publicar a GitHub Pages
      await this.publishToGitHubPages();
      
      console.log('\n✅ Reporte publicado exitosamente!');
      console.log('🌐 Disponible en: https://apache90.github.io/automationTest/');
      
    } catch (error) {
      console.error('\n❌ Error en la publicación:', error.message);
      await this.cleanup();
      // No usar process.exit() aquí: impediría ejecutar el finally y volver a main.
      process.exitCode = 1;
    } finally {
      // Intentar siempre volver a main. Si falla (locks en Windows / worktree), no romper el script.
      await this.execCommandOptional('git checkout main');
    }
  }

  async checkTestResults() {
    console.log('🔍 Verificando resultados de tests...');
    
    if (!fs.existsSync('allure-results')) {
      throw new Error('❌ No se encontraron resultados de tests en allure-results/\n   Ejecuta primero: npm run run:tests');
    }
    
    const files = fs.readdirSync('allure-results');
    if (files.length === 0) {
      throw new Error('❌ El directorio allure-results/ está vacío\n   Ejecuta primero: npm run run:tests');
    }
    
    console.log(`✅ Encontrados ${files.length} archivos de resultados`);
  }

  async generateAllureReport() {
    console.log('\n📊 Generando reporte Allure...');
    
    // Copiar categories.json si existe
    if (fs.existsSync('categories.json')) {
      fs.copyFileSync('categories.json', 'allure-results/categories.json');
      console.log('📁 Categories.json copiado');
    }
    
    // Generar reporte
    try {
      await this.execCommand('npx allure generate allure-results --clean -o allure-report');
      console.log('✅ Reporte Allure generado');
    } catch (error) {
      console.log('⚠️  Intentando con comando alternativo...');
      await this.execCommand('npm run allure:generate');
      console.log('✅ Reporte Allure generado (método alternativo)');
    }
  }

  async publishToGitHubPages() {
    console.log('\n🌐 Publicando a GitHub Pages...');

    // Preparar directorio temporal
    await this.prepareReportCopy();

    // Publicar sin cambiar de rama (evita locks en Windows)
    await this.publishWithWorktree();

    // Limpiar temporal
    await this.cleanup();
  }

  async prepareReportCopy() {
    console.log('📂 Preparando copia del reporte...');
    
    // Remover directorio temporal si existe
    if (fs.existsSync(TEMP_REPORT_DIR)) {
      fs.rmSync(TEMP_REPORT_DIR, { recursive: true, force: true });
    }
    
    // Crear y copiar
    fs.mkdirSync(TEMP_REPORT_DIR, { recursive: true });
    await this.copyDirectory('allure-report', TEMP_REPORT_DIR);
    
    console.log(`✅ Reporte copiado a temporal`);
  }

  async publishWithWorktree() {
    const worktreeDir = path.join(os.tmpdir(), uniqueId('gh-pages-worktree'));
    const publishBranch = uniqueId('__publish-gh-pages');

    console.log('🧩 Publicando usando git worktree (sin checkout)...');

    // Traer referencia remota si existe. Si no existe, el push creará gh-pages.
    await this.execCommandOptional('git fetch origin gh-pages');

    const hasRemote = await this.hasRemoteBranch('origin/gh-pages');
    const startPoint = hasRemote ? 'origin/gh-pages' : 'HEAD';

    // Crear/actualizar rama temporal en el commit base
    await this.execCommand(`git branch -f ${publishBranch} ${startPoint}`);

    // Crear worktree
    await this.execCommand(`git worktree add -f ${q(worktreeDir)} ${publishBranch}`);

    try {
      await this.updateGhPagesContentAt(worktreeDir);
      await this.commitAndPushFrom(worktreeDir, { hasRemote });
    } finally {
      // Siempre limpiar worktree y rama temporal
      await this.execCommandOptional(`git worktree remove -f ${q(worktreeDir)}`);
      await this.execCommandOptional(`git branch -D ${publishBranch}`);
    }
  }

  async updateGhPagesContentAt(targetDir) {
    console.log('🧹 Actualizando contenido de gh-pages (worktree)...');

    // Archivos esenciales que NO se borran
    const filesToKeep = ['.git', '.nojekyll', 'index.md'];

    // Crear .nojekyll
    const noJekyllPath = path.join(targetDir, '.nojekyll');
    if (!fs.existsSync(noJekyllPath)) {
      fs.writeFileSync(noJekyllPath, '');
      console.log('📄 Archivo .nojekyll creado');
    }

    // Crear index.md
    const indexMdPath = path.join(targetDir, 'index.md');
    if (!fs.existsSync(indexMdPath)) {
      const indexContent = `# Automation Test Reports\n\nEste sitio contiene los reportes de automatización.\n\n[Ver Reporte Allure](./index.html)\n\n*Última actualización: ${CURRENT_DATE}*`;
      fs.writeFileSync(indexMdPath, indexContent);
      console.log('📄 Archivo index.md creado');
    }

    // Limpieza total (salvo esenciales)
    const items = fs.readdirSync(targetDir);
    for (const item of items) {
      if (!filesToKeep.includes(item)) {
        fs.rmSync(path.join(targetDir, item), { recursive: true, force: true });
      }
    }

    // Copiar nuevo reporte
    await this.copyDirectory(TEMP_REPORT_DIR, targetDir);

    console.log('✅ Contenido actualizado');
  }

  async commitAndPushFrom(worktreeDir, { hasRemote }) {
    console.log('📤 Subiendo cambios a GitHub...');

    await this.execCommandIn(worktreeDir, 'git add -A');

    try {
      await this.execCommandIn(worktreeDir, `git commit -m "Actualizar reportes Allure - ${CURRENT_DATE}"`);
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('ℹ️  No hay cambios en el reporte para subir');
        return;
      }
      throw error;
    }

    // Empujar el HEAD del worktree hacia la rama gh-pages remota.
    // Esto evita non-fast-forward siempre que partamos de origin/gh-pages.
    const pushCmd = hasRemote
      ? 'git push origin HEAD:gh-pages'
      : 'git push -u origin HEAD:gh-pages';

    await this.execCommandIn(worktreeDir, pushCmd);
    console.log('✅ Cambios subidos a GitHub Pages');
  }

  async cleanup() {
    console.log('🧹 Limpiando archivos temporales...');
    
    if (fs.existsSync(TEMP_REPORT_DIR)) {
      fs.rmSync(TEMP_REPORT_DIR, { recursive: true, force: true });
    }
  }

  async copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return;
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  execCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`${error.message}\n${stderr}`));
        } else {
          if (stdout) console.log(stdout.trim());
          resolve(stdout);
        }
      });
    });
  }

  async ensureNodeModules() {
    console.log('🔍 Verificando dependencias...');
    
    if (!fs.existsSync('node_modules')) {
      console.log('📦 Instalando dependencias...');
      await this.execCommand('npm install');
      console.log('✅ Dependencias restauradas');
    } else {
      console.log('✅ Dependencias ya disponibles');
    }
  }

  async getCurrentBranchOptional() {
    try {
      const result = await this.execCommand('git branch --show-current');
      return result.trim() || null;
    } catch {
      return null;
    }
  }

  async hasRemoteBranch(remoteRef) {
    try {
      await this.execCommand(`git rev-parse --verify ${remoteRef}`);
      return true;
    } catch {
      return false;
    }
  }

  async execCommandOptional(command) {
    try {
      return await this.execCommand(command);
    } catch {
      return null;
    }
  }

  execCommandIn(cwd, command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`${error.message}\n${stderr}`));
        } else {
          if (stdout) console.log(stdout.trim());
          resolve(stdout);
        }
      });
    });
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const publisher = new ReportPublisher();
  publisher.publishReport().catch(console.error);
}

module.exports = { ReportPublisher };
