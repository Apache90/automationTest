import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposCuponesModal } from "../../helpers/gruposcuponesmodals";

export async function agregarCuponAGrupoDni(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar directamente a la sección DNI's usando el enlace correcto
  await page.locator('a[href="/manager/71/cuponesdni/DNI"]').click();
  await expect(page).toHaveURL(/cuponesdni\/DNI/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Hacer click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/DNI"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/DNI/);
  await page.waitForTimeout(500);

  // Encontrar el grupo por nombre y desplegarlo si no está abierto
  const grupoItem = page.locator('.list.accordion-list ul li.accordion-item').filter({
    has: page.locator('.item-title', { hasText: nombreGrupo })
  });

  await expect(grupoItem).toBeVisible({ timeout: 5000 });

  // Verificar si el grupo ya está desplegado
  const isOpen = await grupoItem.locator('.accordion-item-content').isVisible();
  if (!isOpen) {
    // Hacer click en el grupo para desplegarlo
    await grupoItem.locator('a.item-link').click();
    await page.waitForTimeout(500);
  }

  // Hacer click en "Agregar cupon/es"
  await grupoItem.locator('.accordion-item-content li').filter({
    has: page.locator('a.list-button', { hasText: 'Agregar cupon/es' })
  }).locator('a.list-button').click();

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

export async function agregarCuponAGrupoDniPago(
  encargado: Encargado,
  nombreGrupo: string,
  nombreCupon: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar directamente a la sección DNI's usando el enlace correcto
  await page.locator('a[href="/manager/71/cuponesdni/Pago_DNI"]').click();
  await expect(page).toHaveURL(/cuponesdni\/Pago_DNI/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Hacer click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/Pago_DNI"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/Pago_DNI/);
  await page.waitForTimeout(500);

  // Encontrar el grupo por nombre y desplegarlo si no está abierto
  const grupoItem = page.locator('.list.accordion-list ul li.accordion-item').filter({
    has: page.locator('.item-title', { hasText: nombreGrupo })
  });

  await expect(grupoItem).toBeVisible({ timeout: 5000 });

  // Verificar si el grupo ya está desplegado
  const isOpen = await grupoItem.locator('.accordion-item-content').isVisible();
  if (!isOpen) {
    // Hacer click en el grupo para desplegarlo
    await grupoItem.locator('a.item-link').click();
    await page.waitForTimeout(500);
  }

  // Hacer click en "Agregar cupon/es"
  await grupoItem.locator('.accordion-item-content li').filter({
    has: page.locator('a.list-button', { hasText: 'Agregar cupon/es' })
  }).locator('a.list-button').click();

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

