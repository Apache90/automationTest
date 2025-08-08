import { test } from '@playwright/test';
import { CommonHelpers } from '../helpers/CommonHelpers';

/**
 * Base Test Suite que proporciona configuración común para todos los test suites
 */
export class BaseTestSuite {
  
  /**
   * Configuración común para todos los test suites
   */
  static setupSuite(suiteName: string) {
    test.beforeEach(async ({ page }) => {
      // Configurar manejo de diálogos
      CommonHelpers.setupDialogHandler(page);
      
      // Limpiar datos entre tests
      await CommonHelpers.cleanupBetweenTests(page);
      
      console.log(`🧪 Iniciando test en suite: ${suiteName}`);
    });

    test.afterEach(async ({ page }, testInfo) => {
      // Capturar screenshot si el test falló
      if (testInfo.status !== testInfo.expectedStatus) {
        await CommonHelpers.takeScreenshot(page, `failed-${testInfo.title}`);
      }
      
      console.log(`✅ Test completado: ${testInfo.title} - Status: ${testInfo.status}`);
    });
  }

  /**
   * Configuración para suites que requieren login
   */
  static setupAuthenticatedSuite(suiteName: string, userType: 'encargado' | 'vendedor' = 'encargado') {
    this.setupSuite(suiteName);
    
    // Configuración adicional para tests autenticados
    test.beforeEach(async ({ page }) => {
      // Validar que tenemos las credenciales necesarias
      console.log(`🔐 Configurando autenticación para: ${userType}`);
      
      // Aquí podrías agregar lógica para manejar tokens, cookies, etc.
    });
  }

  /**
   * Configuración para suites que requieren datos específicos
   */
  static setupDataDependentSuite(suiteName: string, dataRequirements: string[]) {
    this.setupSuite(suiteName);
    
    test.beforeEach(async () => {
      console.log(`📊 Validando requisitos de datos: ${dataRequirements.join(', ')}`);
      // Aquí podrías agregar lógica para validar/preparar datos necesarios
    });
  }
}
