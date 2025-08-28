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

  async modificarNombreGrupoCupones(nuevoNombre: string) {
    // Esperar el modal de modificar nombre
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('Doorstickets');

    if (nuevoNombre) {
      // Llenar el input con el nuevo nombre
      await this.page.locator('#inputValue').fill(nuevoNombre);
    }

    // Hacer click en "Confirmar"
    await modal.locator('.dialog-button', { hasText: 'Confirmar' }).click();
  }

  async esperarModalErrorSinNombre(mensaje: string) {
    // Esperar el modal de error
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('DOORS');
    await expect(modal.locator('.dialog-text')).toContainText(mensaje);

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
  }

  async esperarModalExitoModificacion(mensaje: string) {
    // Esperar el modal de éxito
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('DOORS');
    await expect(modal.locator('.dialog-text')).toContainText(mensaje);

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
  }

  async esperarModalExitoCuponAgregado() {
    // Esperar el modal de éxito al agregar cupón
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('DOORS');
    await expect(modal.locator('.dialog-text')).toContainText('Cupón agregado correctamente');

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
  }

  async confirmarEliminacionCuponDeGrupo() {
    // Esperar el modal de confirmación
    const modalConfirmacion = this.page.locator('.dialog.dialog-buttons-1.custom-dialog-background.modal-in');
    await expect(modalConfirmacion).toBeVisible({ timeout: 5000 });
    await expect(modalConfirmacion.locator('.dialog-title .btnCustomDialogTitle')).toContainText('DOORS');
    await expect(modalConfirmacion.locator('.dialog-text .btnCustomDialogSubtitle')).toContainText('¿Esta seguro que quiere eliminar este cupón del grupo?');

    // Click en "Confirmar"
    await modalConfirmacion.locator('.dialog-button', { hasText: 'Confirmar' }).click();
  }

  async esperarModalExitoCuponEliminado() {
    // Esperar el modal de éxito al eliminar cupón
    const modal = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('DOORS');
    await expect(modal.locator('.dialog-text')).toContainText('Cupón eliminado del grupo con éxito');

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
  }

  async esperarModalExitoGrupoEliminado() {
    const modal = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('DOORS');
    await expect(modal.locator('.dialog-text')).toContainText('Grupo eliminado con éxito');
    await modal.locator('.dialog-button', { hasText: 'OK' }).click();
  }

  async confirmarEliminacionGrupoCupones() {
    // Esperar el modal de confirmación
    const modalConfirmacion = this.page.locator('.dialog.modal-in');
    await expect(modalConfirmacion).toBeVisible({ timeout: 5000 });
    
    // Confirmar eliminación
    const botonConfirmar = modalConfirmacion.locator('.dialog-button', { hasText: 'Confirmar' });
    await botonConfirmar.click();
    
    // Esperar que aparezca el modal de éxito
    const modalExito = this.page.locator('.dialog.modal-in');
    await expect(modalExito).toBeVisible({ timeout: 5000 });
    await expect(modalExito.locator('.dialog-text')).toContainText('Grupo eliminado con éxito');
    
    // Cerrar modal de éxito
    await modalExito.locator('.dialog-button', { hasText: 'OK' }).click();
  }
  
}