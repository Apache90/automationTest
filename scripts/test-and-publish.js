#!/usr/bin/env node

/**
 * Script simple: Tests + Allure + GitHub Pages
 * Uso: npm run test:and:publish
 */

const { RegressionPublisher } = require('./regression-and-publish.js');
const { exec } = require('child_process');

class SimpleTestPublisher extends RegressionPublisher {
  
  async runRegression() {
    console.log('\n🧪 Ejecutando tests estándar...');
    
    const command = 'npx playwright test --workers=1';
    console.log(`🔧 Ejecutando: ${command}`);
    
    try {
      await this.execCommand(command);
      console.log('✅ Tests completados exitosamente');
    } catch (error) {
      console.log('⚠️  Tests completados con algunos fallos, continuando...');
      // Continuamos aunque haya fallos para generar el reporte
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const publisher = new SimpleTestPublisher();
  publisher.runComplete().catch(console.error);
}
