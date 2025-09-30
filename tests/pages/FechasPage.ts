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
}