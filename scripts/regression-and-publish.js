#!/usr/bin/env node

/**
 * Script completo: Ejecuta regresión ordenada + genera reporte Allure + publica a GitHub Pages
 * Uso: npm run regression:and:publish
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Configuración
const TEMP_REPORT_DIR = path.join(os.homedir(), 'temp-allure');
const CURRENT_DATE = new Date().toISOString().split('T')[0];

function q(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function uniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

class RegressionPublisher {
  
  async runComplete() {
    const initialBranch = await this.getCurrentBranchOptional();

    try {
      console.log('🚀 Iniciando proceso completo de regresión y publicación...\n');
      
      // Paso 1: Guardar cambios actuales
      await this.saveCurrentChanges();
      
      // Paso 2: Ejecutar regresión ordenada
      await this.runRegression();
      
      // Paso 3: Generar reporte Allure
      await this.generateAllureReport();
      
      // Paso 4: Publicar a GitHub Pages
      await this.publishToGitHubPages();
      
      console.log('\n✅ Proceso completado exitosamente!');
      console.log('📊 Reporte disponible en GitHub Pages');
      
    } catch (error) {
      console.error('\n❌ Error en el proceso:', error.message);
      await this.cleanup();
      // No usar process.exit() aquí: impediría ejecutar el finally y volver a main.
      process.exitCode = 1;
    } finally {
      // Intentar siempre volver a main. Si falla, no romper el script.
      await this.execCommandOptional('git checkout main');
    }
  }

  async saveCurrentChanges() {
    console.log('💾 Guardando cambios actuales...');

    // No forzar checkout de rama (evita problemas por locks en Windows).
    await this.execCommand('git add .');
    
    try {
      await this.execCommand(`git commit -m "Actualización antes de generar reportes - ${CURRENT_DATE}"`);
    } catch (error) {
      console.log('ℹ️  No hay cambios para commitear');
    }
  }

  async runRegression() {
    console.log('\n🧪 Ejecutando regresión ordenada...');
    
    const testOrder = [
      'register.spec.ts',
      'login.spec.ts', 
      'encargadoFlujoCupones.spec.ts',
      'encargadoFlujoRoles.spec.ts',
      'encargadoFlujoGrupos.spec.ts'
    ];

    const testFiles = testOrder.map(file => `tests/specs/${file}`).join(' ');
    const command = `npx playwright test ${testFiles} --workers=1 --reporter=line,allure-playwright`;
    
    console.log(`🔧 Ejecutando: ${command}`);
    
    try {
      await this.execCommand(command);
      console.log('✅ Regresión completada exitosamente');
    } catch (error) {
      console.log('⚠️  Regresión completada con algunos fallos, continuando...');
      // Continuamos aunque haya fallos para generar el reporte
    }
  }

  async generateAllureReport() {
    console.log('\n📊 Generando reporte Allure...');
    
    // Copiar categories.json si existe
    if (fs.existsSync('categories.json')) {
      if (!fs.existsSync('allure-results')) {
        fs.mkdirSync('allure-results', { recursive: true });
      }
      fs.copyFileSync('categories.json', 'allure-results/categories.json');
      console.log('📁 Categories.json copiado');
    }
    
    // Generar reporte usando npx (no requiere instalación global)
    try {
      await this.execCommand('npx allure generate allure-results --clean -o allure-report');
      console.log('✅ Reporte Allure generado');
    } catch (error) {
      console.log('⚠️  Intentando con comando alternativo...');
      // Fallback usando el script npm local
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
    
    console.log(`✅ Reporte copiado a: ${TEMP_REPORT_DIR}`);
  }

  async publishWithWorktree() {
    const worktreeDir = path.join(os.tmpdir(), uniqueId('gh-pages-worktree'));
    const publishBranch = uniqueId('__publish-gh-pages');

    console.log('🧩 Publicando usando git worktree (sin checkout)...');

    await this.execCommandOptional('git fetch origin gh-pages');

    const hasRemote = await this.hasRemoteBranch('origin/gh-pages');
    const startPoint = hasRemote ? 'origin/gh-pages' : 'HEAD';

    await this.execCommand(`git branch -f ${publishBranch} ${startPoint}`);
    await this.execCommand(`git worktree add -f ${q(worktreeDir)} ${publishBranch}`);

    try {
      await this.updateGhPagesContentAt(worktreeDir);
      await this.commitAndPushFrom(worktreeDir, { hasRemote });
    } finally {
      await this.execCommandOptional(`git worktree remove -f ${q(worktreeDir)}`);
      await this.execCommandOptional(`git branch -D ${publishBranch}`);
    }
  }

  async updateGhPagesContentAt(targetDir) {
    console.log('🧹 Actualizando contenido de gh-pages (worktree)...');

    const filesToKeep = ['.git', '.nojekyll', 'index.md'];

    const noJekyllPath = path.join(targetDir, '.nojekyll');
    if (!fs.existsSync(noJekyllPath)) {
      fs.writeFileSync(noJekyllPath, '');
      console.log('📄 Archivo .nojekyll creado');
    }

    const indexMdPath = path.join(targetDir, 'index.md');
    if (!fs.existsSync(indexMdPath)) {
      const indexContent = `# Automation Test Reports\n\nEste sitio contiene los reportes de automatización.\n\n[Ver Reporte Allure](./index.html)\n\n*Última actualización: ${CURRENT_DATE}*`;
      fs.writeFileSync(indexMdPath, indexContent);
    }

    const items = fs.readdirSync(targetDir);
    for (const item of items) {
      if (!filesToKeep.includes(item)) {
        fs.rmSync(path.join(targetDir, item), { recursive: true, force: true });
      }
    }

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

  async getCurrentBranchOptional() {
    try {
      const result = await this.execCommand('git branch --show-current');
      return result.trim() || null;
    } catch {
      return null;
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const publisher = new RegressionPublisher();
  publisher.runComplete().catch(console.error);
}

module.exports = { RegressionPublisher };
