import { Page, Locator, expect } from '@playwright/test';

export class FechasPage {
  readonly page: Page;
  readonly seccionFechas: Locator;
  readonly botonAgregarFecha: Locator;
  readonly mensajeSinFechas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.seccionFechas = page.locator('a.item-link[href="/manager/71/fechas"]');
    this.botonAgregarFecha = page.locator('a[href="/manager/71/nuevafecha"] i.material-icons');
    this.mensajeSinFechas = page.locator("p", { hasText: "No hay fechas disponibles." });
  }

  async navegarASeccionFechas() {
    await this.seccionFechas.click();
    await this.page.waitForURL("**/#!/manager/71/fechas");
  }

  async clickAgregarNuevaFecha() {
    await this.botonAgregarFecha.click();
    await this.page.waitForURL("**/#!/manager/71/nuevafecha");
  }

  async buscarFechaPorNombre(nombre: string) {
    const fecha = this.page
      .locator(".grid-container .item-header", { hasText: nombre })
      .locator('xpath=ancestor::div[contains(@class, "grid-container")]');
    await expect(fecha).toBeVisible({ timeout: 5000 });
    return fecha;
  }

  async clickEditarFecha(fecha: Locator) {
    const botonEditar = fecha.locator('i.fa-edit');
    await expect(botonEditar).toBeVisible();
    await botonEditar.click();
  }

  async clickEliminarFecha(fecha: Locator) {
    const botonEliminar = fecha.locator('i.fa-trash');
    await expect(botonEliminar).toBeVisible();
    await botonEliminar.click();
  }

  async clickVerFecha(nombreFecha: string) {
    // Buscar el contenedor específico que contiene la fecha
    const fechaContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombreFecha })
    });
    
    // Click en el botón de ver (ojo)
    const botonVer = fechaContainer.locator('a[href*="/fechaespecial/"] i.fa-eye');
    await expect(botonVer).toBeVisible({ timeout: 10000 });
    await botonVer.click();
  }

  async clickCopiarFecha(nombreFecha: string) {
    // Buscar el contenedor específico que contiene la fecha
    const fechaContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombreFecha })
    });
    
    // Click en el botón de copiar usando la estructura real del HTML
    // Estructura: i.fa-copy > div > a.button
    const botonCopiar = fechaContainer.locator('i.fa-copy div a.button');
    await expect(botonCopiar).toBeVisible({ timeout: 10000 });
    await botonCopiar.click();
  }

  async verificarFechaEnLista(nombreFecha: string) {
    // Verificar que la fecha aparece en la lista usando un selector más específico
    // Buscar el elemento que contiene tanto la fecha como el nombre (evita duplicados)
    const fechaElement = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombreFecha })
    });
    await expect(fechaElement).toBeVisible({ timeout: 10000 });
    
    // Alternativamente, verificar específicamente el slot header que es único
    const fechaHeaderSlot = this.page.locator('div[slot="header"].item-header', { hasText: nombreFecha });
    await expect(fechaHeaderSlot).toBeVisible({ timeout: 10000 });
  }
}