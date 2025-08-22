import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";

export async function eliminarCuponDeGrupoQr(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;

  // Navegar directamente a la sección QR
  await page.locator('a[href="/manager/71/cuponesqr/QR"]').click();
  await expect(page).toHaveURL(/cuponesqr\/QR/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Desplegar el grupo usando el selector específico
  await page.getByText(`${nombreGrupo} Acciones`).click();
  await page.waitForTimeout(500);

  // Click en el primer elemento del cupón (contenido del swipeout)
  await page.locator('.swipeout-content > .item-content > .item-inner').first().click();
  await page.waitForTimeout(500);

  // Click en el botón de eliminar usando el selector de CodeGen
  await page.locator('.fa-light.fa-trash > div > .button').first().click();
  await page.waitForTimeout(500);

  // Verificar que aparece el modal de confirmación
  const modalConfirmacion = page.locator('.dialog.custom-dialog-background');
  await expect(modalConfirmacion).toBeVisible();
  
  // Verificar el texto del modal
  await expect(page.locator('.btnCustomDialogSubtitle')).toHaveText('¿Esta seguro que quiere eliminar este cupón del grupo?');

  // Confirmar eliminación en el modal
  await page.getByText('Confirmar').click();
  await page.waitForTimeout(500);

  // Verificar modal de éxito
  const modalExito = page.locator('.dialog.modal-in');
  await expect(modalExito).toBeVisible();
  await expect(page.locator('.dialog-text')).toHaveText('Cupón eliminado del grupo con éxito');

  // Cerrar el modal de éxito
  await page.getByText('OK').click();
  await page.waitForTimeout(500);
}

export async function eliminarCuponDeGrupoQrPago(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;

  // Navegar directamente a la sección QR Pago
  await page.locator('a[href="/manager/71/cuponesqr/Pago_QR"]').click();
  await expect(page).toHaveURL(/cuponesqr\/Pago_QR/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Desplegar el grupo usando el selector específico
  await page.getByText(`${nombreGrupo} Acciones`).click();
  await page.waitForTimeout(500);

  // Click en el primer elemento del cupón (contenido del swipeout)
  await page.locator('.swipeout-content > .item-content > .item-inner').first().click();
  await page.waitForTimeout(500);

  // Click en el botón de eliminar usando el selector de CodeGen
  await page.locator('.fa-light.fa-trash > div > .button').first().click();
  await page.waitForTimeout(500);

  // Verificar que aparece el modal de confirmación
  const modalConfirmacion = page.locator('.dialog.custom-dialog-background');
  await expect(modalConfirmacion).toBeVisible();
  
  // Verificar el texto del modal
  await expect(page.locator('.btnCustomDialogSubtitle')).toHaveText('¿Esta seguro que quiere eliminar este cupón del grupo?');

  // Confirmar eliminación en el modal
  await page.getByText('Confirmar').click();
  await page.waitForTimeout(500);

  // Verificar modal de éxito
  const modalExito = page.locator('.dialog.modal-in');
  await expect(modalExito).toBeVisible();
  await expect(page.locator('.dialog-text')).toHaveText('Cupón eliminado del grupo con éxito');

  // Cerrar el modal de éxito
  await page.getByText('OK').click();
  await page.waitForTimeout(500);
}
