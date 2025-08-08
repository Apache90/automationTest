#!/usr/bin/env node

/**
 * Script para SOLO ejecutar tests en orden específico
 * (NO genera reportes HTML ni publica)
 * Uso: npm run run:tests
 */

const { spawn } = require('child_process');
const fs = require('fs');

class TestRunner {
  
  constructor() {
    this.testOrder = [
      'tests/specs/register.spec.ts',
      'tests/specs/login.spec.ts', 
      'tests/specs/encargadoFlujoRoles.spec.ts',
      'tests/specs/encargadoFlujoCupones.spec.ts',
      'tests/specs/encargadoFlujoGrupos.spec.ts'
    ];
  }

  async runTests() {
    try {
      console.log('🧪 Iniciando ejecución de tests ordenados...\n');
      
      // Verificar que los archivos de test existen
      await this.verifyTestFiles();
      
      // Ejecutar tests en orden
      await this.executeOrderedTests();
      
      console.log('\n✅ Tests completados exitosamente!');
      console.log('📊 Resultados disponibles en: allure-results/');
      console.log('📝 Para generar reporte: npm run publish:report');
      
    } catch (error) {
      console.error('\n❌ Error en la ejecución:', error.message);
      process.exit(1);
    }
  }

  async verifyTestFiles() {
    console.log('🔍 Verificando archivos de test...');
    
    for (const testFile of this.testOrder) {
      if (!fs.existsSync(testFile)) {
        throw new Error(`❌ No se encontró el archivo: ${testFile}`);
      }
    }
    
    console.log(`✅ Verificados ${this.testOrder.length} archivos de test`);
  }

  async executeOrderedTests() {
    console.log('\n🏃‍♂️ Ejecutando tests en orden específico...\n');
    
    const startTime = Date.now();
    
    // Construcción del comando
    const testFiles = this.testOrder.join(' ');
    const command = 'npx';
    const args = [
      'playwright', 'test',
      '--workers=1',
      '--reporter=line,allure-playwright',
      '--project=chromium',
      ...this.testOrder
    ];
    
    console.log(`📋 Orden de ejecución:`);
    this.testOrder.forEach((test, index) => {
      const testName = test.replace('tests/specs/', '').replace('.spec.ts', '');
      console.log(`   ${index + 1}. ${testName}`);
    });
    console.log('');
    
    // Ejecutar comando
    await this.runCommand(command, args);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    console.log(`\n⏱️  Tiempo total: ${duration} segundos`);
  }

  runCommand(command, args) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Ejecutando: ${command} ${args.join(' ')}\n`);
      
      const process = spawn(command, args, {
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Comando falló con código: ${code}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Error ejecutando comando: ${error.message}`));
      });
    });
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const runner = new TestRunner();
  runner.runTests().catch(console.error);
}

module.exports = TestRunner;
