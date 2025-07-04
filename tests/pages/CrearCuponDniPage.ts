import { Page, Locator } from '@playwright/test';

export class CrearCuponDniPage {
  readonly page: Page;
  readonly nombreInput: Locator;
  readonly descripcionInput: Locator;
  readonly iconoSelect: Locator;
  readonly iconoRayo: Locator;
  readonly iconoCloseButton: Locator;
  readonly diasSemana: Locator;
  readonly crearCuponBtn: Locator;
  
  // Solo para DNI Pago
  readonly precioInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nombreInput = page.locator('input[name="nombre"][placeholder="Nombre"]');
    this.descripcionInput = page.locator('input[name="descripcion"][placeholder="Descripcion"]');
    this.iconoSelect = page.locator("a.item-link.smart-select");
    this.iconoRayo = page.locator('label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])');
    this.iconoCloseButton = page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'icono\']"]');
    this.diasSemana = page.locator(".block .button");
    this.crearCuponBtn = page.locator("a.button.button-fill", { hasText: "CREAR CUPÓN" });
    this.precioInput = page.locator('input[name="precio"]');
  }

  async completarFormularioDni(nombre: string, descripcion: string, seleccionarDias = true) {
    if (nombre) await this.nombreInput.fill(nombre);
    await this.descripcionInput.fill(descripcion);
    await this.seleccionarIcono();
    
    if (seleccionarDias) {
      await this.seleccionarTodosLosDias();
    }
  }

  async completarFormularioDniPago(nombre: string, descripcion: string, precio: string, seleccionarDias = true) {
    if (nombre) await this.nombreInput.fill(nombre);
    await this.descripcionInput.fill(descripcion);
    await this.precioInput.fill(precio);
    await this.seleccionarIcono();
    
    if (seleccionarDias) {
      await this.seleccionarTodosLosDias();
    }
  }

  async seleccionarIcono() {
    await this.iconoSelect.click();
    await this.iconoRayo.click();
    await this.iconoCloseButton.click();
  }

  async seleccionarTodosLosDias() {
    const count = await this.diasSemana.count();
    for (let i = 0; i < count; i++) {
      await this.diasSemana.nth(i).click();
    }
  }

  async seleccionarPrimerDia() {
    await this.diasSemana.first().click();
  }

  async clickCrearCupon() {
    await this.crearCuponBtn.scrollIntoViewIfNeeded();
    await this.crearCuponBtn.click({ force: true });
  }
}