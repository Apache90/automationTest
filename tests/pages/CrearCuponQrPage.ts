import { Page, Locator, expect } from '@playwright/test';

export class CrearCuponQrPage {
  readonly page: Page;
  readonly nombreInput: Locator;
  readonly descripcionInput: Locator;
  readonly iconoSelect: Locator;
  readonly iconoRayo: Locator;
  readonly iconoCloseButton: Locator;
  readonly diasSemana: Locator;
  readonly fileInput: Locator;
  readonly crearCuponBtn: Locator;
  readonly terminadoBtn: Locator;
  readonly popupCrop: Locator;
  
  // Solo para QR Pago
  readonly precioInput: Locator;
  readonly cantMaxInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nombreInput = page.locator('input[name="nombre"][placeholder="Nombre"]');
    this.descripcionInput = page.locator('input[name="descripcion"][placeholder="Descripción"]');
    this.iconoSelect = page.locator("a.item-link.smart-select");
    this.iconoRayo = page.locator('label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])');
    this.iconoCloseButton = page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'icono\']"]');
    this.diasSemana = page.locator(".block .button");
    this.fileInput = page.locator('center .avatar-picker input[type="file"]');
    this.crearCuponBtn = page.locator("a.button.button-fill", { hasText: "CREAR CUPÓN" });
    this.terminadoBtn = page.locator("a.link.popup-avatar-picker-crop-image", { hasText: "Terminado" });
    this.popupCrop = page.locator(".popup-avatar-picker");
    this.precioInput = page.locator('input[name="precio"]');
    this.cantMaxInput = page.locator('input[name="cantMaxCuponesVendidos"]');
  }

  async completarFormularioQr(nombre: string, descripcion: string, seleccionarDia = true) {
    if (nombre) await this.nombreInput.fill(nombre);
    await this.descripcionInput.fill(descripcion);
    await this.seleccionarIcono();
    
    if (seleccionarDia) {
      await this.seleccionarPrimerDia();
    }
  }

  async completarFormularioQrPago(nombre: string, descripcion: string, precio: string, cantMax: string, seleccionarDia = true) {
    if (nombre) await this.nombreInput.fill(nombre);
    await this.descripcionInput.fill(descripcion);
    await this.precioInput.fill(precio);
    await this.cantMaxInput.fill(cantMax);
    await this.seleccionarIcono();
    
    if (seleccionarDia) {
      await this.seleccionarPrimerDia();
    }
  }

  async seleccionarIcono() {
    await this.iconoSelect.click();
    await this.iconoRayo.click();
    await this.iconoCloseButton.click();
  }

  async seleccionarPrimerDia() {
    await this.diasSemana.first().click();
  }

  async subirFoto(rutaFoto: string) {
    await this.fileInput.setInputFiles(rutaFoto);
    await expect(this.terminadoBtn).toBeVisible({ timeout: 5000 });
    await this.terminadoBtn.click();
    await expect(this.popupCrop).not.toBeVisible({ timeout: 10000 });
  }

  async clickCrearCupon() {
    await this.crearCuponBtn.scrollIntoViewIfNeeded();
    await this.crearCuponBtn.click({ force: true });
  }
}