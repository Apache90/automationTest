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
    this.seccionQRs = page.locator('a.item-link[href="/manager/71/cuponesqr/QR"]');
    this.seccionQRsPago = page.locator("label.svelte-1x3l73x", { hasText: "QR's Pago" });
    this.botonAgregarCuponQR = page.locator('a[href="/manager/71/nuevocuponqr/QR"] i.material-icons');
    this.botonAgregarCuponQRPago = page.locator('a[href="/manager/71/nuevocuponqr/Pago_QR"] i.material-icons');
    this.mensajeSinCupones = page.locator(".item-inner", { hasText: "No tenés cupones." });
  }

  async navegarASeccionQRs() {
    await this.seccionQRs.click();
    await this.page.waitForURL("**/#!/manager/71/cuponesqr/QR");
  }

  async navegarASeccionQRsPago() {
    await this.seccionQRsPago.click();
    await this.page.waitForURL("**/#!/manager/71/cuponesqr/Pago_QR");
  }

  async clickAgregarNuevoCuponQR() {
    await this.botonAgregarCuponQR.click();
    await this.page.waitForURL("**/#!/manager/71/nuevocuponqr/QR");
  }

  async clickAgregarNuevoCuponQRPago() {
    await this.botonAgregarCuponQRPago.click();
    await this.page.waitForURL("**/#!/manager/71/nuevocuponqr/Pago_QR");
  }

  async buscarCuponPorNombre(nombre: string) {
    const cupon = this.page
      .locator(".grid-container", { hasText: nombre });
    await expect(cupon).toBeVisible({ timeout: 5000 });
    return cupon;
  }

  async clickEditarCupon(cupon: Locator) {
    const botonEditar = cupon.locator('a[href^="/manager/71/modificarcuponqr/"]');
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
    const botonGestionarGrupos = this.page.locator('a[href="/manager/71/modificargrupocupon/QR"] i.fa-ticket');
    await expect(botonGestionarGrupos).toBeVisible({ timeout: 5000 });
    await botonGestionarGrupos.click();
    await this.page.waitForURL("**/#!/manager/71/modificargrupocupon/QR");
  }

  async clickGestionarGruposQRPago() {
    // Click en el botón para gestionar grupos de QR Pago
    const botonGestionarGrupos = this.page.locator('a[href="/manager/71/modificargrupocupon/Pago_QR"] i.fa-ticket');
    await expect(botonGestionarGrupos).toBeVisible({ timeout: 5000 });
    await botonGestionarGrupos.click();
    await this.page.waitForURL("**/#!/manager/71/modificargrupocupon/Pago_QR");
  }
}