import { Page, Locator, expect } from '@playwright/test';

export class RegisterModal {
  readonly page: Page;
  readonly modal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('.dialog-inner');
  }

  async esperarTextoEsperado(textoEsperado: string) {
    await expect(this.modal).toContainText(textoEsperado, { timeout: 5000 });
  }

  async cerrarSiEsPosible() {
    const closeBtn = this.modal.locator('.dialog-button'); // Ajustar si hay botón de cerrar
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  }
}
