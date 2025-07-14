import { Page, Locator, expect } from '@playwright/test';

export class CuponesDniPage {
  readonly page: Page;
  readonly seccionDNIs: Locator;
  readonly seccionDNIsPago: Locator;
  readonly botonAgregarCuponDNI: Locator;
  readonly botonAgregarCuponDNIPago: Locator;
  readonly mensajeSinCupones: Locator;
  readonly botonGestionarGrupos: Locator;

  constructor(page: Page) {
    this.page = page;
    this.seccionDNIs = page.locator('a.item-link[href="/manager/71/cuponesdni/DNI"]');
    this.seccionDNIsPago = page.locator('a.item-link[href="/manager/71/cuponesdni/Pago_DNI"]');
    this.botonAgregarCuponDNI = page.locator('a[href="/manager/71/nuevocupondni/DNI"] i.material-icons');
    this.botonAgregarCuponDNIPago = page.locator('a[href="/manager/71/nuevocupondni/Pago_DNI"] i.material-icons');
    this.mensajeSinCupones = page.locator("p", { hasText: "No hay cupones disponibles." });
    this.botonGestionarGrupos = page.locator('a[title="Gestionar grupos"]');
  }

  async navegarASeccionDNIs() {
    await this.seccionDNIs.click();
    await this.page.waitForURL("**/#!/manager/71/cuponesdni/DNI");
  }

  async navegarASeccionDNIsPago() {
    await this.seccionDNIsPago.click();
    await this.page.waitForURL("**/#!/manager/71/cuponesdni/Pago_DNI");
  }

  async clickAgregarNuevoCuponDNI() {
    await this.botonAgregarCuponDNI.click();
    await this.page.waitForURL("**/#!/manager/71/nuevocupondni/DNI");
  }

  async clickAgregarNuevoCuponDNIPago() {
    await this.botonAgregarCuponDNIPago.click();
    await this.page.waitForURL("**/#!/manager/71/nuevocupondni/Pago_DNI");
  }

  async buscarCuponPorNombre(nombre: string) {
    const cupon = this.page
      .locator(".grid-container .item-header", { hasText: nombre })
      .locator('xpath=ancestor::div[contains(@class, "grid-container")]');
    await expect(cupon).toBeVisible({ timeout: 5000 });
    return cupon;
  }

  async clickEditarCupon(cupon: Locator, tipo: 'DNI' | 'Pago_DNI') {
    const botonEditar = cupon.locator(`a[href^="/manager/71/modificarcupondni/${tipo}/"] i.fa-pencil`);
    await expect(botonEditar).toBeVisible({ timeout: 5000 });

    // Obtener el href exacto para debuggear
    const href = await botonEditar.locator('xpath=ancestor::a').getAttribute('href');
    console.log(`URL de edición: ${href}`);

    await botonEditar.click();

    // Esperar a que aparezca el formulario de edición en lugar de esperar por URL específica
    const tituloEdicion = this.page.locator('h1:has-text("Modificar Cupón")');
    await expect(tituloEdicion).toBeVisible({ timeout: 10000 });

    // Esperar un poco para asegurar que el formulario esté completamente cargado
    await this.page.waitForTimeout(1000);
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
    await expect(this.mensajeSinCupones).toBeVisible();
    await expect(this.mensajeSinCupones).toHaveText("No hay cupones disponibles.");
  }

  async clickGestionarGrupos() {
    await this.botonGestionarGrupos.click();
    await this.page.waitForURL("**/modificargrupocupon/DNI");
  }
}