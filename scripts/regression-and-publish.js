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

class RegressionPublisher {
  
  async runComplete() {
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
      process.exit(1);
    }
  }

  async saveCurrentChanges() {
    console.log('💾 Guardando cambios actuales...');
    
    await this.execCommand('git checkout main');
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
    const command = `npx playwright test ${testFiles} --workers=1`;
    
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
    
    // Cambiar a gh-pages
    await this.switchToGhPages();
    
    // Limpiar y copiar reporte
    await this.updateGhPagesContent();
    
    // Commit y push
    await this.commitAndPush();
    
    // Volver a main
    await this.execCommand('git checkout main');
    
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

  async switchToGhPages() {
    console.log('🔄 Cambiando a rama gh-pages...');
    
    try {
      await this.execCommand('git checkout gh-pages');
    } catch (error) {
      console.log('📝 Creando rama gh-pages...');
      await this.execCommand('git checkout -b gh-pages');
    }
  }

  async updateGhPagesContent() {
    console.log('🧹 Actualizando contenido de gh-pages...');
    
    // Crear .nojekyll si no existe
    if (!fs.existsSync('.nojekyll')) {
      fs.writeFileSync('.nojekyll', '');
      console.log('📄 Archivo .nojekyll creado');
    }
    
    // Guardar archivos importantes
    const filesToKeep = ['.nojekyll', 'index.md', '.git'];
    const tempKeep = path.join(os.tmpdir(), 'gh-pages-keep');
    
    if (fs.existsSync(tempKeep)) {
      fs.rmSync(tempKeep, { recursive: true, force: true });
    }
    fs.mkdirSync(tempKeep, { recursive: true });
    
    // Guardar archivos a mantener
    for (const file of filesToKeep) {
      if (fs.existsSync(file)) {
        const isDir = fs.statSync(file).isDirectory();
        if (isDir) {
          await this.copyDirectory(file, path.join(tempKeep, file));
        } else {
          fs.copyFileSync(file, path.join(tempKeep, file));
        }
      }
    }
    
    // Limpiar todo
    const items = fs.readdirSync('.');
    for (const item of items) {
      if (!filesToKeep.includes(item)) {
        const itemPath = path.resolve(item);
        fs.rmSync(itemPath, { recursive: true, force: true });
      }
    }
    
    // Copiar reporte
    await this.copyDirectory(TEMP_REPORT_DIR, '.');
    
    // Restaurar archivos importantes
    for (const file of filesToKeep) {
      const keepPath = path.join(tempKeep, file);
      if (fs.existsSync(keepPath)) {
        const isDir = fs.statSync(keepPath).isDirectory();
        if (isDir) {
          await this.copyDirectory(keepPath, file);
        } else {
          fs.copyFileSync(keepPath, file);
        }
      }
    }
    
    // Limpiar temporal
    fs.rmSync(tempKeep, { recursive: true, force: true });
    
    console.log('✅ Contenido actualizado');
  }

  async commitAndPush() {
    console.log('📤 Subiendo cambios a GitHub...');
    
    await this.execCommand('git add .');
    
    try {
      await this.execCommand(`git commit -m "Actualizar reportes Allure - ${CURRENT_DATE}"`);
      await this.execCommand('git push origin gh-pages');
      console.log('✅ Cambios subidos a GitHub Pages');
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('ℹ️  No hay cambios en el reporte para subir');
      } else {
        throw error;
      }
    }
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
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const publisher = new RegressionPublisher();
  publisher.runComplete().catch(console.error);
}

module.exports = { RegressionPublisher };
