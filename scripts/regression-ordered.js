#!/usr/bin/env node

/**
 * Script de regresión simplificado que ejecuta tests en el orden correcto
 * Uso: npm run regression:ordered
 */

const { spawn } = require('child_process');
const path = require('path');

const testOrder = [
  'register.spec.ts',           // Registro de usuarios
  'login.spec.ts',             // Base de autenticación  
  'encargadoFlujoRoles.spec.ts',      // Gestión de roles
  'encargadoFlujoCupones.spec.ts',    // Gestión de cupones
  'encargadoFlujoGrupos.spec.ts'      // Gestión de grupos
  // 'vendedor-flujo.spec.ts' - Pendiente de incluir
];

console.log('🚀 Iniciando regresión ordenada...\n');
console.log('📋 Orden de ejecución:');
testOrder.forEach((test, index) => {
  console.log(`  ${index + 1}. ${test}`);
});
console.log('\n⚠️  Nota: vendedor-flujo.spec.ts está temporalmente excluido\n');

// Crear comando para ejecutar todos los tests en orden
const testFiles = testOrder.map(file => `tests/specs/${file}`).join(' ');
const command = `npx playwright test ${testFiles} --workers=1 --reporter=line`;

console.log(`🔧 Ejecutando: ${command}\n`);

const childProcess = spawn(command, [], {
  stdio: 'inherit',
  shell: true,
  cwd: path.resolve(__dirname, '..')
});

childProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Regresión completada exitosamente');
    console.log('📊 Para ver reportes detallados: npm run allure:report');
  } else {
    console.log(`\n❌ Regresión completada con errores (código: ${code})`);
    console.log('🔍 Revisa los logs anteriores para más detalles');
  }
});

childProcess.on('error', (error) => {
  console.error('💥 Error ejecutando regresión:', error);
  process.exit(1);
});
