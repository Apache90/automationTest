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

class ReportPublisher {
  
  async publishReport() {
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
      process.exit(1);
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
    
    // Cambiar a gh-pages
    await this.switchToGhPages();
    
    // Limpiar y copiar reporte
    await this.updateGhPagesContent();
    
    // Commit y push
    await this.commitAndPush();
    
    // Volver a main
    await this.execCommand('git checkout main');
    
    // Verificar y restaurar dependencias
    await this.ensureNodeModules();
    
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

  async switchToGhPages() {
    console.log('🔄 Cambiando a rama gh-pages...');
    
    try {
      // Intentar cambiar a gh-pages existente
      await this.execCommand('git checkout gh-pages');
      console.log('✅ Cambiado a rama gh-pages existente');
    } catch (error) {
      try {
        // Si falla, intentar crear la rama
        console.log('📝 Creando nueva rama gh-pages...');
        await this.execCommand('git checkout -b gh-pages');
        
        // Crear .nojekyll para GitHub Pages
        fs.writeFileSync('.nojekyll', '');
        await this.execCommand('git add .nojekyll');
        await this.execCommand('git commit -m "Initial gh-pages setup"');
        await this.execCommand('git push origin gh-pages');
        console.log('✅ Rama gh-pages creada y configurada');
      } catch (createError) {
        // Si también falla crear, intentar forzar el checkout
        console.log('🔄 Intentando forzar checkout a gh-pages...');
        await this.execCommand('git checkout gh-pages --force');
        console.log('✅ Forzado checkout a gh-pages');
      }
    }
  }

  async updateGhPagesContent() {
    console.log('🧹 Actualizando contenido de gh-pages...');
    
    // SEGURIDAD: Verificar que estamos en gh-pages
    const currentBranch = await this.getCurrentBranch();
    if (currentBranch !== 'gh-pages') {
      throw new Error(`❌ PELIGRO: Intentando limpiar en rama ${currentBranch}. Solo se permite en gh-pages`);
    }
    
    // Crear .nojekyll si no existe
    if (!fs.existsSync('.nojekyll')) {
      fs.writeFileSync('.nojekyll', '');
      console.log('📄 Archivo .nojekyll creado');
    }
    
    // Crear index.md si no existe
    if (!fs.existsSync('index.md')) {
      const indexContent = `# Automation Test Reports

Este sitio contiene los reportes de automatización.

[Ver Reporte Allure](./index.html)

*Última actualización: ${CURRENT_DATE}*`;
      
      fs.writeFileSync('index.md', indexContent);
      console.log('📄 Archivo index.md creado');
    }
    
    // LIMPIEZA SELECTIVA: Solo borrar archivos específicos de reportes anteriores
    const reportFilesToRemove = [
      'app.js', 'favicon.ico', 'history', 'plugins', 'styles.css',
      'export', 'data', 'widgets'
    ];
    
    for (const file of reportFilesToRemove) {
      if (fs.existsSync(file)) {
        fs.rmSync(file, { recursive: true, force: true });
        console.log(`🗑️  Eliminado: ${file}`);
      }
    }
    
    // También limpiar archivos .html antiguos (excepto index.md)
    const htmlFiles = fs.readdirSync('.').filter(f => 
      f.endsWith('.html') && f !== 'index.html'
    );
    
    for (const htmlFile of htmlFiles) {
      fs.rmSync(htmlFile, { force: true });
      console.log(`🗑️  Eliminado HTML anterior: ${htmlFile}`);
    }
    
    // Copiar nuevo reporte
    await this.copyDirectory(TEMP_REPORT_DIR, '.');
    
    console.log('✅ Contenido actualizado de forma segura');
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
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const publisher = new ReportPublisher();
  publisher.publishReport().catch(console.error);
}

module.exports = { ReportPublisher };
