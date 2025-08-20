import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposCuponesModal } from "../../helpers/gruposcuponesmodals";

export async function modificarNombreGrupoCuponesQr(
  encargado: Encargado,
  nombreActual: string,
  nuevoNombre: string
) {
  const { page } = encargado;
  const grupoModal = new GruposCuponesModal(page);

  // Navegar directamente a la sección QR's usando el enlace correcto
  await page.locator('a[href="/manager/71/cuponesqr/QR"]').click();
  await expect(page).toHaveURL(/cuponesqr\/QR/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Hacer click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/QR"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/QR/);
  await page.waitForTimeout(500);

  // Desplegar el grupo por nombre si no está abierto
  const grupoItem = page.locator('.accordion-item .item-title', { hasText: nombreActual });
  const grupoAccordion = grupoItem.locator('xpath=ancestor::li[contains(@class, "accordion-item")]');
  
  // Verificar si ya está abierto
  const isOpen = await grupoAccordion.getAttribute('class');
  if (!isOpen?.includes('accordion-item-opened')) {
    await grupoItem.click();
    await page.waitForTimeout(500);
  }

  // Hacer click en "Modificar nombre"
  await page.locator('a.list-button', { hasText: 'Modificar nombre' }).click();

  // Ingresar nuevo nombre y confirmar
  await grupoModal.modificarNombreGrupoCupones(nuevoNombre);
}

export async function modificarNombreGrupoCuponesQrVacio(
  encargado: Encargado,
  nombreActual: string
) {
  const { page } = encargado;

  // Navegar directamente a la sección QR's usando el enlace correcto
  await page.locator('a[href="/manager/71/cuponesqr/QR"]').click();
  await expect(page).toHaveURL(/cuponesqr\/QR/);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Hacer click en el ícono de gestionar grupos
  await page.locator('a[href="/manager/71/modificargrupocupon/QR"] i.fa-light.fa-ticket').click();
  await expect(page).toHaveURL(/modificargrupocupon\/QR/);
  await page.waitForTimeout(500);

  // Desplegar el grupo por nombre si no está abierto
  const grupoItem = page.locator('.accordion-item .item-title', { hasText: nombreActual });
  const grupoAccordion = grupoItem.locator('xpath=ancestor::li[contains(@class, "accordion-item")]');
  
  // Verificar si ya está abierto
  const isOpen = await grupoAccordion.getAttribute('class');
  if (!isOpen?.includes('accordion-item-opened')) {
    await grupoItem.click();
    await page.waitForTimeout(500);
  }

  // Hacer click en "Modificar nombre"
  await page.locator('a.list-button', { hasText: 'Modificar nombre' }).click();

  // Dejar vacío el campo y confirmar
  const inputModal = page.locator('input#inputValue');
  await inputModal.clear();
  await page.locator('.dialog-button', { hasText: 'Confirmar' }).click();
}
