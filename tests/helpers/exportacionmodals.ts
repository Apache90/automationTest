import { Page, expect } from '@playwright/test';

export class ExportacionModal {
  constructor(private page: Page) {}

  async esperarModalExportacion() {
    const modal = this.page.locator('.popupcopiarlimitaciones.popup.modal-in');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal.locator('.title')).toContainText('Copiar limitaciones');
  }

  async seleccionarVendedores(vendedores: string[]) {
    // Click en el smart select de vendedores
    const smartSelectVendedores = this.page.locator('.item-link.smart-select').filter({
      has: this.page.locator('.item-title', { hasText: 'Seleccione vendedores' })
    });
    await smartSelectVendedores.click();
    await this.page.waitForTimeout(1000);

    // Seleccionar vendedores
    for (const vendedor of vendedores) {
      const checkbox = this.page.locator(`label.item-checkbox:has-text("${vendedor}")`);
      if (await checkbox.isVisible()) {
        await checkbox.click();
        await this.page.waitForTimeout(300);
      }
    }

    // Cerrar modal de vendedores
    const botonCerrar = this.page.locator('a.link.popup-close[data-popup*="vendedores"]');
    await botonCerrar.click();
    await this.page.waitForTimeout(1000);
  }

  async seleccionarCupones(cupones: string[]) {
    // Click en el smart select de cupones
    const smartSelectCupones = this.page.locator('.item-link.smart-select').filter({
      has: this.page.locator('.item-title', { hasText: 'Seleccione cupones' })
    });
    await smartSelectCupones.click();
    await this.page.waitForTimeout(1000);

    // Seleccionar cupones
    for (const cupon of cupones) {
      const checkbox = this.page.locator(`label.item-checkbox:has-text("${cupon}")`);
      if (await checkbox.isVisible()) {
        await checkbox.click();
        await this.page.waitForTimeout(300);
      }
    }

    // Cerrar modal de cupones
    const botonCerrar = this.page.locator('a.link.popup-close[data-popup*="cupones"]');
    await botonCerrar.click();
    await this.page.waitForTimeout(1000);
  }

  async confirmarExportacion() {
    const botonExportar = this.page.locator('a.btn-cerrarSesion.button', { hasText: 'EXPORTAR LIMITACIONES' });
    await expect(botonExportar).toBeVisible({ timeout: 5000 });
    await botonExportar.click();
  }

  async esperarModalExito() {
    const modalExito = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modalExito).toBeVisible({ timeout: 10000 });
    await expect(modalExito.locator('.dialog-title')).toContainText('Excelente!');
    await expect(modalExito.locator('.dialog-text')).toContainText('Limitaciones exportadas correctamente.');
  }

  async cerrarModalExito() {
    const botonOK = this.page.locator('.dialog-button', { hasText: 'OK' });
    await expect(botonOK).toBeVisible({ timeout: 5000 });
    await botonOK.click();
    
    // Esperar que el modal se cierre
    const modal = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  }
}