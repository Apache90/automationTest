import { Page, Locator, expect } from '@playwright/test';

export class ModificarFechaPage {
  readonly page: Page;
  readonly mensajePregratisTextarea: Locator;
  readonly mensajePostgratisTextarea: Locator;
  readonly mensajePrepagoTextarea: Locator;
  readonly mensajePostpagoTextarea: Locator;
  readonly modificarFechaBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mensajePregratisTextarea = page.locator('textarea[name="pregratis"][placeholder="..."]');
    this.mensajePostgratisTextarea = page.locator('textarea[name="postgratis"][placeholder="..."]');
    this.mensajePrepagoTextarea = page.locator('textarea[name="prepago"][placeholder="..."]');
    this.mensajePostpagoTextarea = page.locator('textarea[name="postpago"][placeholder="..."]');
    this.modificarFechaBtn = page.locator('a.button.button-fill', { hasText: 'MODIFICAR FECHA' });
  }

  async completarMensajes(
    mensajePregratis: string,
    mensajePostgratis: string,
    mensajePrepago: string,
    mensajePostpago: string
  ) {
    // Completar mensaje antes de link gratis
    await this.mensajePregratisTextarea.fill(mensajePregratis);
    
    // Completar mensaje después de link gratis
    await this.mensajePostgratisTextarea.fill(mensajePostgratis);
    
    // Completar mensaje antes de link pago
    await this.mensajePrepagoTextarea.fill(mensajePrepago);
    
    // Completar mensaje después de link pago
    await this.mensajePostpagoTextarea.fill(mensajePostpago);
  }

  async clickModificarFecha() {
    await this.modificarFechaBtn.scrollIntoViewIfNeeded();
    await this.modificarFechaBtn.click({ force: true });
  }
}