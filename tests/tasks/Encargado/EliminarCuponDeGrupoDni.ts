import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";

export async function eliminarCuponDeGrupoDni(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;

  // Navegar directamente a la sección DNI's
  await page.locator('a[href="/manager/71/cuponesdni/DNI"]').click();
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

  // Confirmar eliminación en el modal
  await page.getByText('Confirmar').click();

  // Verificar modal de éxito y cerrarlo
  await page.getByText('OK').click();
  await page.waitForTimeout(500);
}

export async function eliminarCuponDeGrupoDniPago(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;

  // Navegar directamente a la sección DNI's
  await page.locator('a[href="/manager/71/cuponesdni/Pago_DNI"]').click();
  await expect(page).toHaveURL(/cuponesdni\/Pago_DNI/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  await page.getByText(`${nombreGrupo} Acciones`).click();
  await page.waitForTimeout(500);

  // Click en el primer elemento del cupón (contenido del swipeout)
  await page.locator('.swipeout-content > .item-content > .item-inner').first().click();
  await page.waitForTimeout(500);
  await page.locator('.fa-light.fa-trash > div > .button').first().click();

  // Confirmar eliminación en el modal
  await page.getByText('Confirmar').click();

  // Verificar modal de éxito y cerrarlo
  await page.getByText('OK').click();
  await page.waitForTimeout(500);
}