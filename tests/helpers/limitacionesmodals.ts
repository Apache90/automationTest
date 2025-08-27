import { expect, Page } from "@playwright/test";

export class LimitacionesModal {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async esperarModalExitoLimitacionCreada() {
    // Esperar el modal de éxito
    const modal = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('Excelente!');
    await expect(modal.locator('.dialog-text')).toContainText('Limitación añadida correctamente.');

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
  }

  async seleccionarCuponEnModal(nombreCupon: string) {
    // Esperar a que aparezca el modal smart-select
    const smartSelectPage = this.page.locator('.page.smart-select-page');
    await expect(smartSelectPage).toBeVisible({ timeout: 5000 });

    // Buscar y seleccionar el cupón por su nombre exacto
    const cuponLabel = this.page.locator('.item-radio').filter({
      hasText: nombreCupon
    }).locator('label');
    
    await expect(cuponLabel).toBeVisible({ timeout: 5000 });
    await cuponLabel.click();

    // Cerrar el modal smart-select
    const closeButton = this.page.locator('.link.popup-close');
    await closeButton.click();
  }

  async esperarModalError(textoError: string) {
    const modal = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-text')).toContainText(textoError);
  }

  async cerrarModalError() {
    const botonOk = this.page.locator('.dialog-button', { hasText: 'OK' });
    await botonOk.click();
  }
}
