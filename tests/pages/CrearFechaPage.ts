import { Page, Locator, expect } from '@playwright/test';

export class CrearFechaPage {
  readonly page: Page;
  readonly fechaInput: Locator;
  readonly nombreInput: Locator;
  readonly descripcionTextarea: Locator;
  readonly direccionInput: Locator;
  readonly fileInput: Locator;
  readonly crearFechaBtn: Locator;
  readonly terminadoBtn: Locator;
  readonly popupCrop: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fechaInput = page.locator('input[type="date"][placeholder="Fecha..."]');
    this.nombreInput = page.locator('input[name="nombre"][type="text"][placeholder="Nombre"]');
    this.descripcionTextarea = page.locator('textarea[name="descripcion"][placeholder="Descripcion"]');
    this.direccionInput = page.locator('input[name="direccion"][type="text"][placeholder="direccion"]');
    this.fileInput = page.locator('center .avatar-picker input[type="file"]');
    this.crearFechaBtn = page.locator('a.button.button-fill', { hasText: 'CREAR FECHA' });
    this.terminadoBtn = page.locator('a.link.popup-avatar-picker-crop-image', { hasText: 'Terminado' });
    this.popupCrop = page.locator('.popup-avatar-picker');
  }

  async completarFormularioFecha(fecha: string, nombre: string, descripcion: string, direccion: string) {
    // Ingresar fecha
    await this.fechaInput.fill(fecha);
    
    // Ingresar nombre
    await this.nombreInput.fill(nombre);
    
    // Ingresar descripción
    await this.descripcionTextarea.fill(descripcion);
    
    // Ingresar dirección
    await this.direccionInput.fill(direccion);
  }

  async subirImagen(rutaImagen: string) {
    // Subir archivo de imagen
    await this.fileInput.setInputFiles(rutaImagen);
    
    // Esperar que aparezca el modal de crop
    await expect(this.popupCrop).toBeVisible({ timeout: 5000 });
    
    // Hacer clic en "Terminado" para completar el crop
    await expect(this.terminadoBtn).toBeVisible({ timeout: 5000 });
    await this.terminadoBtn.click();
    
    // Esperar que desaparezca el modal de crop
    await expect(this.popupCrop).not.toBeVisible({ timeout: 10000 });
  }

  async clickCrearFecha() {
    await this.crearFechaBtn.scrollIntoViewIfNeeded();
    await this.crearFechaBtn.click({ force: true });
  }
}