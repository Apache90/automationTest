import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Helper centralizado para funciones comunes utilizadas en múltiples tests
 */
export class CommonHelpers {
  
  /**
   * Maneja errores de test de forma consistente
   */
  static async reportTestError(error: any, page: Page, testInfo: string): Promise<void> {
    console.error(`Error en test "${testInfo}":`, error.message);
    
    // Capturar screenshot en caso de error
    await allure.attachment('Screenshot on Error', await page.screenshot(), 'image/png');
    
    // Capturar el HTML de la página para debugging
    const htmlContent = await page.content();
    await allure.attachment('Page HTML on Error', htmlContent, 'text/html');
    
    throw error;
  }

  /**
   * Configura el manejo global de diálogos para una página
   */
  static setupDialogHandler(page: Page): void {
    page.on('dialog', async dialog => {
      console.log(`Diálogo inesperado: ${dialog.message()}`);
      await dialog.accept();
    });
  }

  /**
   * Espera a que la página esté completamente cargada
   */
  static async waitForPageLoad(page: Page, timeout: number = 10000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Función helper para limpiar datos entre tests si es necesario
   */
  static async cleanupBetweenTests(page: Page): Promise<void> {
    // Limpiar localStorage
    await page.evaluate(() => localStorage.clear());
    
    // Limpiar sessionStorage
    await page.evaluate(() => sessionStorage.clear());
    
    // Cerrar cualquier modal que pueda estar abierto
    try {
      const modal = page.locator('.modal, .dialog');
      if (await modal.isVisible()) {
        const closeButton = page.locator('.close, .cancel, [data-dismiss="modal"]').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
        }
      }
    } catch (error) {
      // Ignorar si no hay modales
    }
  }

  /**
   * Función para tomar screenshot con nombre descriptivo
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await allure.attachment(name, await page.screenshot(), 'image/png');
  }

  /**
   * Función para validar que estamos en la página correcta
   */
  static async validatePageUrl(page: Page, expectedUrl: string): Promise<boolean> {
    const currentUrl = page.url();
    return currentUrl.includes(expectedUrl);
  }
}
