import { expect } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { GruposCuponesModal } from '../../helpers/gruposcuponesmodals';

export async function agregarCuponAGrupoQrPago(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar directamente a la sección QR's Pago usando el enlace correcto
  await page.locator('a[href="/manager/71/cuponesqr/Pago_QR"]').click();
  await expect(page).toHaveURL(/cuponesqr\/Pago_QR/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Hacer click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/Pago_QR"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/Pago_QR/);
  await page.waitForTimeout(500);

  // Buscar y expandir el grupo específico
  const grupoItem = page.locator('.accordion-item .item-title', { hasText: nombreGrupo });
  await expect(grupoItem).toBeVisible({ timeout: 5000 });
  
  const grupoAccordion = grupoItem.locator('xpath=ancestor::li[contains(@class, "accordion-item")]');
  
  // Verificar si ya está abierto
  const isOpen = await grupoAccordion.getAttribute('class');
  if (!isOpen?.includes('accordion-item-opened')) {
    await grupoItem.click();
    await page.waitForTimeout(500);
  }

  // Click en el botón "Agregar cupón" dentro del acordeón
  const botonAgregarCupon = page.locator('a.list-button', { hasText: 'Agregar cupon/es' });
  await expect(botonAgregarCupon).toBeVisible({ timeout: 5000 });
  await botonAgregarCupon.click();

  // Esperar a que aparezca el modal de seleccionar cupones
  const modal = page.locator('.dialog.dialog-buttons-1.modal-in');
  await expect(modal).toBeVisible({ timeout: 5000 });
  await expect(modal.locator('.dialog-title')).toContainText('Seleccionar cupones');

  // Hacer click en el selector para abrir la lista de cupones
  await modal.locator('.item-link.smart-select.smart-select-init').click();

  // Esperar a que aparezca el popover con la lista de cupones (selector más genérico)
  await page.waitForSelector('.popover.smart-select-popover.modal-in', { state: 'visible', timeout: 10000 });

  // Usar un selector más genérico para la lista de cupones
  const listaCupones = page.locator('.popover.smart-select-popover.modal-in .list');
  await expect(listaCupones).toBeVisible({ timeout: 5000 });

  // Seleccionar el cupón específico por su checkbox usando el texto exacto
  const cuponLabel = page.getByText(nombreCupon, { exact: true }).locator('xpath=ancestor::label[contains(@class, "item-checkbox")]');
  await expect(cuponLabel).toBeVisible({ timeout: 5000 });
  await cuponLabel.click();

  // Hacer click en OK para confirmar la selección
  await modal.locator('.dialog-button', { hasText: 'OK' }).click();
}
