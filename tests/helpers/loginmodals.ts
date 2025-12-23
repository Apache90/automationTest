import { Page, expect } from '@playwright/test';

export async function cerrarModalSiExiste(page: Page) {
    const dialog = page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(dialog, 'El modal de error no apareció').toBeVisible({ timeout: 7000 });

    await expect(
        dialog.locator('.dialog-text'),
        'El modal apareció pero el texto no coincide'
    ).toHaveText(/Mail\s+o\s+Contraseña\s+Erroneos/i, { timeout: 7000 });

    await dialog.locator('.dialog-button', { hasText: 'OK' }).click();
    await expect(dialog).toBeHidden({ timeout: 7000 });
}
