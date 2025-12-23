import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";

export async function eliminarCuponDeGrupoDni(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;

  // Navegar directamente a la sección DNI's (sin hardcodear el id del manager)
  await page.locator('a[href$="/cuponesdni/DNI"]').click();
  await expect(page).toHaveURL(/cuponesdni\/DNI/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Click en el grupo usando el selector de CodeGen
  await page.getByText(`${nombreGrupo} Acciones`).click();
  await page.waitForTimeout(500);

  // Click en el primer elemento del cupón (contenido del swipeout)
  await page.locator('.swipeout-content > .item-content > .item-inner').first().click();
  await page.waitForTimeout(500);

  // Click en el botón de eliminar usando el selector de CodeGen
  await page.locator('.fa-light.fa-trash > div > .button').first().click();

  // Confirmar eliminación en el modal (selector específico para evitar clicks ambiguos)
  const modalConfirmacion = page.locator('.dialog.dialog-buttons-1.custom-dialog-background.modal-in');
  await expect(modalConfirmacion).toBeVisible({ timeout: 10000 });
  await expect(modalConfirmacion.locator('.btnCustomDialogSubtitle')).toContainText('eliminar este cupón del grupo', { timeout: 10000 });
  await modalConfirmacion.locator('span.dialog-button', { hasText: 'Confirmar' }).click();
  await expect(modalConfirmacion).toBeHidden({ timeout: 10000 });

  // Verificar modal de éxito y cerrarlo (apuntar al modal que contiene el texto de éxito)
  const modalExito = page.locator('.dialog.dialog-buttons-1.modal-in', {
    has: page.locator('.dialog-text', { hasText: 'Cupón eliminado del grupo con éxito' }),
  });
  await expect(modalExito).toBeVisible({ timeout: 10000 });
  await modalExito.locator('span.dialog-button', { hasText: 'OK' }).click();
  await expect(modalExito).toBeHidden({ timeout: 10000 });
  await page.waitForTimeout(500);
}

export async function eliminarCuponDeGrupoDniPago(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;

  // Navegar directamente a la sección DNI's
  await page.locator('a[href$="/cuponesdni/Pago_DNI"]').click();
  await expect(page).toHaveURL(/cuponesdni\/Pago_DNI/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  await page.getByText(`${nombreGrupo} Acciones`).click();
  await page.waitForTimeout(500);

  // Click en el primer elemento del cupón (contenido del swipeout)
  await page.locator('.swipeout-content > .item-content > .item-inner').first().click();
  await page.waitForTimeout(500);
  await page.locator('.fa-light.fa-trash > div > .button').first().click();

  // Confirmar eliminación en el modal (selector específico para evitar clicks ambiguos)
  const modalConfirmacion = page.locator('.dialog.dialog-buttons-1.custom-dialog-background.modal-in');
  await expect(modalConfirmacion).toBeVisible({ timeout: 10000 });
  await expect(modalConfirmacion.locator('.btnCustomDialogSubtitle')).toContainText('eliminar este cupón del grupo', { timeout: 10000 });
  await modalConfirmacion.locator('span.dialog-button', { hasText: 'Confirmar' }).click();
  await expect(modalConfirmacion).toBeHidden({ timeout: 10000 });

  // Verificar modal de éxito y cerrarlo
  const modalExito = page.locator('.dialog.dialog-buttons-1.modal-in', {
    has: page.locator('.dialog-text', { hasText: 'Cupón eliminado del grupo con éxito' }),
  });
  await expect(modalExito).toBeVisible({ timeout: 10000 });
  await modalExito.locator('span.dialog-button', { hasText: 'OK' }).click();
  await expect(modalExito).toBeHidden({ timeout: 10000 });
  await page.waitForTimeout(500);
}