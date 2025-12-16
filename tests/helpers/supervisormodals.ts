import { Page, Locator, expect } from '@playwright/test';

export class SupervisorModal {
    readonly page: Page;
    readonly modal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator('.dialog.modal-in');
    }

    async completarEmailYConfirmar(email: string) {
        await expect(this.modal).toBeVisible({ timeout: 20000 });
        const input = this.modal.locator('#inputValue');
        const confirmar = this.modal.locator('.dialog-buttons .dialog-button', { hasText: 'Confirmar' });

        await input.fill(email);
        await confirmar.click();
    }

    async esperarModalExito() {
        await expect(this.modal).toBeVisible({ timeout: 20000 });
        await expect(this.modal).toContainText(/Nuevo\s+Supervisor\s+agregado\s+correctamente\.?/i);
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

    async confirmarEliminacionSupervisor() {
        // Espera el modal de confirmación de eliminación
        await expect(this.modal).toContainText('¿Estás seguro que deseas eliminar este Supervisor?');
        const confirmar = this.modal.locator('.dialog-button', { hasText: 'Confirmar' });
        await confirmar.click();
    }

    async esperarModalEliminacionExitosa() {
        await expect(this.modal).toContainText('Supervisor quitado correctamente.');
        const ok = this.modal.locator('.dialog-button', { hasText: 'OK' });
        await ok.click();
    }
}