import { spawn } from 'child_process';
import { TestConfig } from '../tests/config/TestConfig';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Runner personalizado para ejecutar regresión completa en orden específico
 */
class RegressionRunner {
  private testDir = './tests/specs';
  private results: Array<{file: string, status: 'passed' | 'failed', duration: number}> = [];

  async runRegression(): Promise<void> {
    console.log('🚀 Iniciando regresión completa...\n');
    
    // Limpiar resultados previos
    this.cleanPreviousResults();
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const testFile of TestConfig.testOrder) {
      console.log(`📝 Ejecutando: ${testFile}`);
      const startTime = Date.now();
      
      try {
        const result = await this.runSingleTestFile(testFile);
        const duration = Date.now() - startTime;
        
        if (result.success) {
          console.log(`✅ ${testFile} - PASSED (${duration}ms)`);
          this.results.push({file: testFile, status: 'passed', duration});
          passedTests++;
        } else {
          console.log(`❌ ${testFile} - FAILED (${duration}ms)`);
          this.results.push({file: testFile, status: 'failed', duration});
          failedTests++;
        }
        totalTests++;
      } catch (error) {
        console.error(`💥 Error ejecutando ${testFile}:`, error);
        failedTests++;
        totalTests++;
      }
      
      // Pequeña pausa entre archivos de test para estabilidad
      await this.delay(2000);
    }

    this.generateReport(totalTests, passedTests, failedTests);
  }

  private async runSingleTestFile(testFile: string): Promise<{success: boolean, output: string}> {
    return new Promise((resolve) => {
      const process = spawn('npx', ['playwright', 'test', `tests/specs/${testFile}`, '--workers=1'], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        resolve({
          success: code === 0,
          output: output
        });
      });
    });
  }

  private cleanPreviousResults(): void {
    try {
      if (fs.existsSync('./allure-results')) {
        fs.rmSync('./allure-results', { recursive: true, force: true });
      }
      if (fs.existsSync('./test-results')) {
        fs.rmSync('./test-results', { recursive: true, force: true });
      }
    } catch (error) {
      console.warn('No se pudieron limpiar resultados previos:', error);
    }
  }

  private generateReport(total: number, passed: number, failed: number): void {
    console.log('\n📊 RESUMEN DE REGRESIÓN');
    console.log('========================');
    console.log(`Total tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success rate: ${((passed/total)*100).toFixed(2)}%`);
    
    console.log('\n📋 DETALLES POR ARCHIVO:');
    this.results.forEach(result => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.file} (${result.duration}ms)`);
    });

    // Generar reporte JSON
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: { total, passed, failed, successRate: (passed/total)*100 },
      details: this.results
    };

    fs.writeFileSync('./regression-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Reporte guardado en: regression-report.json');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const runner = new RegressionRunner();
  runner.runRegression().catch(console.error);
}

export { RegressionRunner };
