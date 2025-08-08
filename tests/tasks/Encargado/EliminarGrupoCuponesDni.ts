import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposCuponesModal } from "../../helpers/gruposcuponesmodals";

export async function eliminarGrupoCuponesDni(
  encargado: Encargado,
  nombreGrupo: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar a la sección de cupones DNI
  await page.locator('a[href="/manager/71/cuponesdni/DNI"]').click();
  await expect(page).toHaveURL(/cuponesdni\/DNI/);
  await page.waitForLoadState("networkidle");

  // Click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/DNI"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/DNI/);
  await page.waitForLoadState("networkidle");

  // Desplegar el grupo por nombre
  const grupoItem = page.locator('.accordion-item .item-title', { hasText: nombreGrupo });
  await expect(grupoItem).toBeVisible({ timeout: 5000 });
  await grupoItem.click();
  await page.waitForTimeout(500);

  // Click en "Eliminar grupo"
  const botonEliminarGrupo = page.locator('a.list-button.color-red', { hasText: 'Eliminar grupo' });
  await expect(botonEliminarGrupo).toBeVisible({ timeout: 5000 });
  await botonEliminarGrupo.click();

  // Esperar y cerrar modal de éxito
  await grupoModal.esperarModalExitoGrupoEliminado();

  // Verificar que ya no existe el grupo (SIN INFORMACIÓN PARA MOSTRAR)
  const sinInfo = page.locator('.item-title', { hasText: 'SIN INFORMACIÓN PARA MOSTRAR' });
  await expect(sinInfo).toBeVisible({ timeout: 5000 });
}

export async function eliminarGrupoCuponesDniPago(
  encargado: Encargado,
  nombreGrupo: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar a la sección de cupones DNI
  await page.locator('a[href="/manager/71/cuponesdni/Pago_DNI"]').click();
  await expect(page).toHaveURL(/cuponesdni\/Pago_DNI/);
  await page.waitForLoadState("networkidle");

  // Click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/Pago_DNI"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/Pago_DNI/);
  await page.waitForLoadState("networkidle");

  // Desplegar el grupo por nombre
  const grupoItem = page.locator('.accordion-item .item-title', { hasText: nombreGrupo });
  await expect(grupoItem).toBeVisible({ timeout: 5000 });
  await grupoItem.click();
  await page.waitForTimeout(500);

  // Click en "Eliminar grupo"
  const botonEliminarGrupo = page.locator('a.list-button.color-red', { hasText: 'Eliminar grupo' });
  await expect(botonEliminarGrupo).toBeVisible({ timeout: 5000 });
  await botonEliminarGrupo.click();

  // Esperar y cerrar modal de éxito
  await grupoModal.esperarModalExitoGrupoEliminado();

  // Verificar que ya no existe el grupo (SIN INFORMACIÓN PARA MOSTRAR)
  const sinInfo = page.locator('.item-title', { hasText: 'SIN INFORMACIÓN PARA MOSTRAR' });
  await expect(sinInfo).toBeVisible({ timeout: 5000 });
}