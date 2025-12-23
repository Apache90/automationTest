import { Page, Locator, expect } from '@playwright/test';

export class CuponesQrPage {
  readonly page: Page;
  readonly seccionQRs: Locator;
  readonly seccionQRsPago: Locator;
  readonly botonAgregarCuponQR: Locator;
  readonly botonAgregarCuponQRPago: Locator;
  readonly mensajeSinCupones: Locator;

  constructor(page: Page) {
    this.page = page;
    // Evitar hardcodear el id del manager (ej: 71) para que no rompa si cambia el entorno/datos.
    this.seccionQRs = page.locator('a.item-link[href$="/cuponesqr/QR"]');
    this.seccionQRsPago = page.locator('a.item-link[href$="/cuponesqr/Pago_QR"]');

    // Clickear el <a> del FAB (más estable que apuntar al <i> interno)
    this.botonAgregarCuponQR = page.locator('div.custom-fab.fab-right-bottom a[href$="/nuevocuponqr/QR"]');
    this.botonAgregarCuponQRPago = page.locator('div.custom-fab.fab-right-bottom a[href$="/nuevocuponqr/Pago_QR"]');
    this.mensajeSinCupones = page.locator(".item-inner", { hasText: "No tenés cupones." });
  }

  async navegarASeccionQRs() {
    await this.seccionQRs.click();
    await expect(this.page).toHaveURL(/cuponesqr\/QR/);
  }

  async navegarASeccionQRsPago() {
    await expect(this.seccionQRsPago).toBeVisible({ timeout: 15000 });
    await this.seccionQRsPago.click();
    await expect(this.page).toHaveURL(/cuponesqr\/Pago_QR/);
  }

  async clickAgregarNuevoCuponQR() {
    await expect(this.page.locator(".preloader, .spinner, .loading-indicator")).toBeHidden({ timeout: 10000 });

    await expect(this.botonAgregarCuponQR).toBeVisible({ timeout: 15000 });
    await this.botonAgregarCuponQR.click();
    await expect(this.page).toHaveURL(/nuevocuponqr\/QR/);
  }

  async clickAgregarNuevoCuponQRPago() {
    await expect(this.page.locator(".preloader, .spinner, .loading-indicator")).toBeHidden({ timeout: 10000 });

    await expect(this.botonAgregarCuponQRPago).toBeVisible({ timeout: 15000 });
    await this.botonAgregarCuponQRPago.click();
    await expect(this.page).toHaveURL(/nuevocuponqr\/Pago_QR/);
  }

  async buscarCuponPorNombre(nombre: string) {
    const cupon = this.page
      .locator(".grid-container", { hasText: nombre });
    await expect(cupon).toBeVisible({ timeout: 5000 });
    return cupon;
  }

  async clickEditarCupon(cupon: Locator) {
    const botonEditar = cupon.locator('a[href*="/modificarcuponqr/"]');
    await expect(botonEditar).toBeVisible({ timeout: 5000 });
    await botonEditar.click();
  }

  async clickEliminarCupon(cupon: Locator) {
    const botonEliminar = cupon.locator("i.fa-trash div a.button");
    await botonEliminar.click();
  }

  async verificarCuponEliminado(nombre: string) {
    const cuponEliminado = this.page.locator(".grid-container .item-header", { hasText: nombre });
    await expect(cuponEliminado).toHaveCount(0, { timeout: 5000 });
  }

  async verificarNoHayCupones() {
    await expect(this.mensajeSinCupones).toBeVisible({ timeout: 5000 });
  }

  async clickGestionarGruposQR() {
    // Click en el botón para gestionar grupos de QR
    const botonGestionarGrupos = this.page.locator('a[href$="/modificargrupocupon/QR"] i.fa-ticket');
    await expect(botonGestionarGrupos).toBeVisible({ timeout: 5000 });
    await botonGestionarGrupos.click();
    await expect(this.page).toHaveURL(/modificargrupocupon\/QR/);
  }

  async clickGestionarGruposQRPago() {
    // Click en el botón para gestionar grupos de QR Pago
    const botonGestionarGrupos = this.page.locator('a[href$="/modificargrupocupon/Pago_QR"] i.fa-ticket');
    await expect(botonGestionarGrupos).toBeVisible({ timeout: 5000 });
    await botonGestionarGrupos.click();
    await expect(this.page).toHaveURL(/modificargrupocupon\/Pago_QR/);
  }
}