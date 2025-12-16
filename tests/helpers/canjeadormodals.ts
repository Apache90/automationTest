import { Page, Locator, expect } from '@playwright/test';

export class CanjeadorModal {
    readonly page: Page;
    readonly modal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator('.dialog.modal-in');
    }

    async completarEmailYConfirmar(email: string) {
        await expect(this.modal).toBeVisible({ timeout: 20000 });

        const input = this.modal.locator('#inputEmailCanjeador');
        await input.fill(email);
        
        // Seleccionar tipo de escaneo (QR y DNI por defecto)
        const scanTypeBoth = this.modal.locator('input[type="radio"][value="BOTH"]');
        await scanTypeBoth.check();
        
        // Click en confirmar
        const confirmar = this.modal.locator('.dialog-buttons .dialog-button', { hasText: 'Confirmar' });
        await confirmar.click();
    }

    async esperarModalExito() {
        await expect(this.modal).toBeVisible({ timeout: 20000 });
        await expect(this.modal).toContainText('Nuevo Canjeador agregado correctamente');
    }

    async cerrarModalExito() {
        const botonCerrar = this.modal.locator('.dialog-button', { hasText: 'OK' });
        await botonCerrar.click();
    }

    async esperarModalError(mensaje: string) {
        await expect(this.modal).toBeVisible({ timeout: 20000 });
        await expect(this.modal).toContainText(mensaje);
    }

    async cerrarModalError() {
        const botonCerrar = this.modal.locator('.dialog-button', { hasText: 'OK' });
        await botonCerrar.click();
    }

    async confirmarEliminacionCanjeador() {
        // Espera el modal de confirmación de eliminación
        await expect(this.modal).toContainText('¿Estás seguro que deseas eliminar este Canjeador?');
        const confirmar = this.modal.locator('.dialog-button', { hasText: 'Confirmar' });
        await confirmar.click();
    }

    async esperarModalEliminacionExitosa() {
        await expect(this.modal).toContainText('Canjeador quitado correctamente.');
        const ok = this.modal.locator('.dialog-button', { hasText: 'OK' });
        await ok.click();
    }

    async editarTipoEscaneo(tipoEscaneo: 'QR' | 'DNI' | 'BOTH') {
        // Esperar que el modal de edición aparezca
        await expect(this.modal).toBeVisible({ timeout: 20000 });
        await expect(this.modal).toContainText('Editar Canjeador');
        
        // Seleccionar el tipo de escaneo
        const radioButton = this.modal.locator(`input[type="radio"][value="${tipoEscaneo}"]`);
        await radioButton.check();
        
        // Click en confirmar
        const confirmar = this.modal.locator('.dialog-buttons .dialog-button', { hasText: 'Confirmar' });
        await confirmar.click();
        
        // Esperar modal de éxito
        await this.esperarModalActualizacionExitosa();
    }

    async esperarModalActualizacionExitosa() {
        await expect(this.modal).toBeVisible({ timeout: 20000 });
        await expect(this.modal).toContainText('Actualizado correctamente.');
        
        // Click en OK para cerrar
        const botonOK = this.modal.locator('.dialog-button', { hasText: 'OK' });
        await botonOK.click();
    }
}