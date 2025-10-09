import { Page, Locator, expect } from '@playwright/test';

export class FechaEspecialPage {
  readonly page: Page;
  readonly botonEditar: Locator;
  readonly mensajeFreeElement: Locator;
  readonly mensajePagoElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.botonEditar = page.locator('.custom-fab a[href*="/modificarfecha/"] i.material-icons');
    // Buscar el mensaje gratis usando el heading que lo precede y luego el div + p
    this.mensajeFreeElement = page.locator('h4:has-text("Vista previa de mensaje gratis:") + div p');
    // Buscar el mensaje pago usando el heading que lo precede y luego el div + p
    this.mensajePagoElement = page.locator('h4:has-text("Vista previa de mensaje pago:") + div p');
  }

  async clickEditarFecha() {
    await this.botonEditar.scrollIntoViewIfNeeded();
    await this.botonEditar.click();
  }

  async verificarMensajeFree(mensajeEsperado: string) {
    await expect(this.mensajeFreeElement).toBeVisible({ timeout: 10000 });
    await expect(this.mensajeFreeElement).toContainText(mensajeEsperado);
  }

  async verificarMensajePago(mensajeEsperado: string) {
    await expect(this.mensajePagoElement).toBeVisible({ timeout: 10000 });
    await expect(this.mensajePagoElement).toContainText(mensajeEsperado);
  }
}