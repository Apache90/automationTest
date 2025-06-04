import { Page, expect } from '@playwright/test';

export async function cerrarModalSiExiste(page: Page) {
    const modal = page.locator('.dialog-text', { hasText: 'Mail o Contraseña Erroneos' });

    await expect(modal, 'El modal con mensaje de error no apareció').toBeVisible({ timeout: 3000 });

    const closeButton = page.locator('.dialog-button', { hasText: 'OK' });
    await closeButton.click();
}
