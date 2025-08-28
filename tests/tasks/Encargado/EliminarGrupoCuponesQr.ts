import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposCuponesModal } from "../../helpers/gruposcuponesmodals";

export async function eliminarGrupoCuponesQr(
  encargado: Encargado,
  nombreGrupo: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar a la sección de cupones QR
  await page.locator('a[href="/manager/71/cuponesqr/QR"]').click();
  await expect(page).toHaveURL(/cuponesqr\/QR/);
  await page.waitForLoadState("networkidle");

  // Click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/QR"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/QR/);
  await page.waitForLoadState("networkidle");

  // Desplegar el grupo por nombre
  const grupoItem = page.locator('.accordion-item .item-title', { hasText: nombreGrupo });
  await expect(grupoItem).toBeVisible({ timeout: 5000 });
  await grupoItem.click();
  await page.waitForTimeout(500);

  // Click en "Eliminar grupo" - selector actualizado
  const botonEliminarGrupo = page.locator('a.button', { hasText: 'Eliminar grupo' });
  await expect(botonEliminarGrupo).toBeVisible({ timeout: 5000 });
  await botonEliminarGrupo.click();

  // Confirmar eliminación en el modal de confirmación
  await grupoModal.confirmarEliminacionGrupoCupones();

  // Verificar que ya no existe el grupo (SIN INFORMACIÓN PARA MOSTRAR)
  const sinInfo = page.locator('.item-title', { hasText: 'SIN INFORMACIÓN PARA MOSTRAR' });
  await expect(sinInfo).toBeVisible({ timeout: 5000 });
}

export async function eliminarGrupoCuponesQrPago(
  encargado: Encargado,
  nombreGrupo: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar a la sección de cupones QR Pago
  await page.locator('a[href="/manager/71/cuponesqr/Pago_QR"]').click();
  await expect(page).toHaveURL(/cuponesqr\/Pago_QR/);
  await page.waitForLoadState("networkidle");

  // Click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/Pago_QR"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/Pago_QR/);
  await page.waitForLoadState("networkidle");

  // Desplegar el grupo por nombre
  const grupoItem = page.locator('.accordion-item .item-title', { hasText: nombreGrupo });
  await expect(grupoItem).toBeVisible({ timeout: 5000 });
  await grupoItem.click();
  await page.waitForTimeout(500);

  // Click en "Eliminar grupo" - selector actualizado
  const botonEliminarGrupo = page.locator('a.button', { hasText: 'Eliminar grupo' });
  await expect(botonEliminarGrupo).toBeVisible({ timeout: 5000 });
  await botonEliminarGrupo.click();

  // Confirmar eliminación en el modal de confirmación
  await grupoModal.confirmarEliminacionGrupoCupones();

  // Verificar que ya no existe el grupo (SIN INFORMACIÓN PARA MOSTRAR)
  const sinInfo = page.locator('.item-title', { hasText: 'SIN INFORMACIÓN PARA MOSTRAR' });
  await expect(sinInfo).toBeVisible({ timeout: 5000 });
}
