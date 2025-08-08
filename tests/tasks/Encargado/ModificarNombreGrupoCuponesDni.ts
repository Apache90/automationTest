import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposCuponesModal } from "../../helpers/gruposcuponesmodals";

export async function modificarNombreGrupoCuponesDni(
  encargado: Encargado,
  nombreActual: string,
  nuevoNombre: string
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

export async function modificarNombreGrupoCuponesDniPago(
  encargado: Encargado,
  nombreActual: string,
  nuevoNombre: string
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

export async function modificarNombreGrupoCuponesDniVacio(
  encargado: Encargado,
  nombreActual: string
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

  // No ingresar nombre y confirmar (dejar vacío)
  await grupoModal.modificarNombreGrupoCupones("");
}

export async function modificarNombreGrupoCuponesDniPagoVacio(
  encargado: Encargado,
  nombreActual: string
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

  // No ingresar nombre y confirmar (dejar vacío)
  await grupoModal.modificarNombreGrupoCupones("");
}