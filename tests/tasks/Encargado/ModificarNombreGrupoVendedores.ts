import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposVendedoresModal } from "../../helpers/gruposmodals";

export async function modificarNombreGrupoVendedores(encargado: Encargado, nombreActual: string, nuevoNombre: string) {
  const { page } = encargado;
  const grupoModal = new GruposVendedoresModal(page);

  // Solo haz click en "Vendedores" si NO estás ya en la sección
  const heading = page.locator('h1', { hasText: 'Vendedores' });
  if (!(await heading.isVisible())) {
    const seccionVendedores = page.locator('label.svelte-1x3l73x', { hasText: 'Vendedores' });
    await seccionVendedores.click();
    await page.waitForTimeout(500);
  }

  // Ir a sección Grupos de Vendedores
  await page.locator('h1.bienvenido + a[href="/manager/71/vendedores/grupos/"]').click();
  await expect(page).toHaveURL(/vendedores\/grupos/);
  await page.waitForTimeout(500);

  // Abrir el grupo por nombre
  await page.locator('div.list ul li .item-title', { hasText: nombreActual }).click();

  // Click en "Modificar nombre"
  await page.locator('a.list-button', { hasText: "Modificar nombre" }).click();

  // Ingresar nuevo nombre y confirmar
  await grupoModal.modificarNombreGrupo(nuevoNombre);
}
export async function modificarNombreGrupoVacio(encargado: Encargado, nombreActual: string) {
  const { page } = encargado;
  const grupoModal = new GruposVendedoresModal(page);

  // Solo haz click en "Vendedores" si NO estás ya en la sección
  const heading = page.locator('h1', { hasText: 'Vendedores' });
  if (!(await heading.isVisible())) {
    const seccionVendedores = page.locator('label.svelte-1x3l73x', { hasText: 'Vendedores' });
    await seccionVendedores.click();
    await page.waitForTimeout(500);
  }

  // Ir a sección Grupos de Vendedores
  await page.locator('h1.bienvenido + a[href="/manager/71/vendedores/grupos/"]').click();
  await expect(page).toHaveURL(/vendedores\/grupos/);
  await page.waitForTimeout(500);

  // Abrir el grupo por nombre
  await page.locator('div.list ul li .item-title', { hasText: nombreActual }).click();

  // Click en "Modificar nombre"
  await page.locator('a.list-button', { hasText: "Modificar nombre" }).click();

  // No ingresar nombre y confirmar
  await grupoModal.modificarNombreGrupo("");
}