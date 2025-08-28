import { Page, Locator, expect } from "@playwright/test";

export class GruposVendedoresModal {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async seleccionarVendedores(emails: string[]) {
    // Abre el select de vendedores
    await this.page.locator('a.smart-select').click();

    for (const email of emails) {
      // Haz click en el label que contiene el email
      const label = this.page.locator('label.item-checkbox', { hasText: email });
      await label.click();
    }
    // Click en el botón OK para cerrar el popover
    await this.page.locator('.dialog-button, button, a', { hasText: 'OK' }).first().click();
  }

  async modificarNombreGrupo(nuevoNombre: string) {
    await this.page.locator('#inputValue').fill(nuevoNombre);
    await this.page.locator('.dialog-button', { hasText: 'Confirmar' }).click();
  }

  async esperarModalExito(mensaje: string) {
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-text')).toContainText(mensaje);
    await modal.locator('.dialog-button', { hasText: 'OK' }).click();
  }

  async esperarModalError(mensaje: string) {
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-text')).toContainText(mensaje);
    await modal.locator('.dialog-button', { hasText: 'OK' }).click();
  }

  async ingresarNombreGrupo(nombre: string) {
    await this.page.locator('#inputValue').fill(nombre);
    await this.page.locator('.dialog-button', { hasText: 'Confirmar' }).click();
  }

  async esperarConfirmacion(nombre: string) {
    await expect(this.page.locator('.dialog.modal-in')).toContainText(`Grupo de vendedores: ${nombre}, agregado correctamente.`);
    await this.page.locator('.dialog-button', { hasText: 'OK' }).click();
  }

  async confirmarEliminacionVendedor() {
    // Esperar el modal de confirmación de eliminación
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-text')).toContainText('¿Estás seguro que deseas eliminar este Vendedor?');

    // Hacer click en "Confirmar"
    const confirmar = modal.locator('.dialog-button', { hasText: 'Confirmar' });
    await confirmar.click();
  }

  async esperarModalEliminacionVendedorExitosa() {
    // Esperar el modal de éxito
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-text')).toContainText('Vendedor retirado con éxito');

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
  }

  async esperarModalEliminacionGrupoExitosa() {
    // Esperar el modal de éxito
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('DOORS');
    await expect(modal.locator('.dialog-text')).toContainText('Grupo eliminado con éxito');

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
  }

  async esperarModalErrorSinVendedores(mensaje: string) {
    // Esperar el modal de error
    const modal = this.page.locator('.dialog.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator('.dialog-title')).toContainText('DOORS');
    await expect(modal.locator('.dialog-text')).toContainText(mensaje);

    // Hacer click en "OK"
    const ok = modal.locator('.dialog-button', { hasText: 'OK' });
    await ok.click();
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

  async confirmarEliminacionGrupoVendedores() {
    // Esperar el modal de confirmación antes de eliminar
    const modalConfirmacion = this.page.locator('.dialog.dialog-buttons-1.custom-dialog-background.modal-in');
    await expect(modalConfirmacion).toBeVisible({ timeout: 5000 });
    await expect(modalConfirmacion.locator('.dialog-title .btnCustomDialogTitle')).toContainText('DOORS');
    await expect(modalConfirmacion.locator('.dialog-text .btnCustomDialogSubtitle')).toContainText('¿Estás seguro que deseas eliminar este grupo?');

    // Click en "Confirmar"
    await modalConfirmacion.locator('.dialog-button', { hasText: 'Confirmar' }).click();
  }
}