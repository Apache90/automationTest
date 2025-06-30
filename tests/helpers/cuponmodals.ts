import { Page, Locator, expect } from '@playwright/test';

export class CuponModal {
    readonly page: Page;
    readonly modal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator('.dialog.dialog-buttons-1.modal-in');
    }

    async esperarModalExitoCupon() {
        await expect(this.modal).toBeVisible({ timeout: 5000 });
        await expect(this.modal).toContainText('Cupón creado correctamente.');
    }

    async esperarModalError(mensaje: string) {
        await expect(this.modal).toBeVisible({ timeout: 5000 });
        
        // Verificar título DOORS
        const dialogTitle = this.page.locator('.dialog-title', { hasText: 'DOORS' });
        await expect(dialogTitle).toBeVisible();
        
        // Verificar el mensaje específico
        const dialogText = this.page.locator('.dialog-text', { hasText: mensaje });
        await expect(dialogText).toBeVisible();
    }

    async cerrarModalExito() {
        const botonOK = this.page.locator('.dialog-buttons span.dialog-button', { hasText: 'OK' });
        await botonOK.click();
        await expect(this.modal).not.toBeVisible({ timeout: 3000 });
    }

    async cerrarModalError() {
        const botonOK = this.page.locator('.dialog-buttons span.dialog-button', { hasText: 'OK' });
        await botonOK.click();
        await expect(this.modal).not.toBeVisible({ timeout: 3000 });
    }
}