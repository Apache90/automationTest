import { Page, Locator } from '@playwright/test';

export class RolesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async irASeccion(nombreSeccion: string) {
    // Selector más robusto que no depende de la clase svelte
    await this.page.locator('label.radio-label', { hasText: nombreSeccion }).click();
  }

  async clickAgregar() {
    await this.page.locator('.custom-fab a .btn-menuSeller').click();
  }

  getUsuarioEnLista(email: string): Locator {
    return this.page.locator('li.swipeout', { hasText: email });
  }
}