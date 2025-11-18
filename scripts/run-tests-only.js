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
      'tests/specs/encargadoFlujoCupones.spec.ts',
      'tests/specs/encargadoFlujoGrupos.spec.ts',
      'tests/specs/encargadoFlujoRoles.spec.ts'
    ];
    
    // Rastrear resultados
    this.results = [];
    this.totalPassed = 0;
    this.totalFailed = 0;
  }

  async runTests() {
    try {
      console.log('🧪 Iniciando ejecución de tests ordenados...\n');
      
      // Verificar que los archivos de test existen
      await this.verifyTestFiles();
      
      // Ejecutar tests en orden
      await this.executeOrderedTests();
      
    } catch (error) {
      console.error('\n💥 Error crítico en la ejecución:', error.message);
      process.exit(1);
    }
  }
  
  showSummary(totalDuration) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN FINAL DE EJECUCIÓN');
    console.log('='.repeat(60));
    
    console.log(`⏱️  Tiempo total: ${totalDuration} segundos`);
    console.log(`📁 Archivos ejecutados: ${this.results.length}/${this.testOrder.length}`);
    console.log(`✅ Archivos exitosos: ${this.totalPassed}`);
    console.log(`❌ Archivos con fallos: ${this.totalFailed}`);
    
    const successRate = ((this.totalPassed / this.results.length) * 100).toFixed(1);
    console.log(`📈 Tasa de éxito: ${successRate}%`);
    
    console.log('\n📋 Detalle por archivo:');
    this.results.forEach((result, index) => {
      const icon = result.status === 'PASSED' ? '✅' : '❌';
      console.log(`   ${index + 1}. ${icon} ${result.name} (${result.duration}s)`);
      if (result.status === 'FAILED' && result.error) {
        console.log(`      └─ Error: ${result.error}`);
      }
    });
    
    console.log('\n📊 Resultados disponibles en: allure-results/');
    console.log('📝 Para generar reporte: npm run publish:report');
    
    if (this.totalFailed > 0) {
      console.log('\n⚠️  Algunos tests fallaron, pero se ejecutaron todos.');
      process.exit(1); // Código de salida 1 para indicar que hubo fallos
    } else {
      console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');
      process.exit(0);
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
    
    console.log(`📋 Orden de ejecución:`);
    this.testOrder.forEach((test, index) => {
      const testName = test.replace('tests/specs/', '').replace('.spec.ts', '');
      console.log(`   ${index + 1}. ${testName}`);
    });
    console.log('');
    
    // Ejecutar cada archivo de test secuencialmente
    for (let i = 0; i < this.testOrder.length; i++) {
      const testFile = this.testOrder[i];
      const testName = testFile.replace('tests/specs/', '').replace('.spec.ts', '');
      
      console.log(`🔄 [${i + 1}/${this.testOrder.length}] Ejecutando: ${testName}`);
      
      const command = 'npx';
      const args = [
        'playwright', 'test',
        '--workers=1',
        '--reporter=line,allure-playwright',
        '--project=chromium',
        testFile
      ];
      
      const testStartTime = Date.now();
      
      try {
        await this.runCommand(command, args);
        const testDuration = Math.round((Date.now() - testStartTime) / 1000);
        
        console.log(`✅ Completado: ${testName} (${testDuration}s)\n`);
        this.results.push({ name: testName, status: 'PASSED', duration: testDuration });
        this.totalPassed++;
        
      } catch (error) {
        const testDuration = Math.round((Date.now() - testStartTime) / 1000);
        
        console.log(`❌ Fallos en: ${testName} (${testDuration}s) - Continuando con el siguiente...\n`);
        this.results.push({ name: testName, status: 'FAILED', duration: testDuration, error: error.message });
        this.totalFailed++;
      }
    }
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    // Mostrar resumen final
    this.showSummary(duration);
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
