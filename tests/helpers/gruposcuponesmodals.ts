import { Page, expect } from "@playwright/test";

export class GruposCuponesModal {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async seleccionarCupon(nombreCupon: string) {
    // Abre el selector de cupones
    await this.page.locator('div.dialog-text .item-title', { hasText: "[Click aquí para seleccionar Cupones]" }).click();

    // Espera a que el popover esté visible
    await this.page.waitForSelector('.popover.smart-select-popover.modal-in', { state: 'visible', timeout: 5000 });

    // Selecciona el checkbox cuyo label sea exactamente el nombre del cupón
    const label = this.page.getByText(nombreCupon, { exact: true }).locator('xpath=ancestor::label[contains(@class, "item-checkbox")]');
    await label.click();

    // Cierra el selector
    await this.page.locator('.dialog-button', { hasText: "OK" }).click();
  }

  async ingresarNombreGrupo(nombreGrupo: string) {
    await this.page.locator('#inputValue').fill(nombreGrupo);
    await this.page.locator('.dialog-button', { hasText: "Confirmar" }).click();
  }

  async esperarModalExito(nombreGrupo: string) {
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-text')).toContainText(`Grupo de cupones: ${nombreGrupo}, agregado correctamente.`);
    await modal.locator('.dialog-button', { hasText: "OK" }).click();
  }
}