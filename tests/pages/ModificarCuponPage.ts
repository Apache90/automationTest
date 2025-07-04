import { Page, Locator } from '@playwright/test';

export class ModificarCuponPage {
  readonly page: Page;
  readonly nombreInput: Locator;
  readonly precioInput: Locator;
  readonly modificarCuponBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nombreInput = page.locator('.item-content:has(.item-label:text("Nombre")) input[name="nombre"][placeholder="Nombre"]');
    this.precioInput = page.locator('input[name="precio"]');
    this.modificarCuponBtn = page.locator("a.button.button-fill", { hasText: "Modificar Cupón" });
  }

  async modificarNombre(nuevoNombre: string) {
    await this.nombreInput.fill(nuevoNombre);
  }

  async modificarPrecio(nuevoPrecio: string) {
    await this.precioInput.fill(nuevoPrecio);
  }

  async clickModificarCupon() {
    await this.modificarCuponBtn.click();
  }
}