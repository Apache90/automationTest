import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposVendedoresModal } from "../../helpers/gruposmodals";

export async function eliminarGrupoVendedores(
  encargado: Encargado,
  nombreGrupo: string
) {
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

  // Desplegar el grupo por nombre
  const grupoItem = page.locator('div.list ul li .item-title', { hasText: nombreGrupo });
  await grupoItem.click();
  await page.waitForTimeout(500);

  // Hacer click en "Eliminar grupo"
  const botonEliminarGrupo = page.locator('a.button', { hasText: 'Eliminar grupo' });
  await botonEliminarGrupo.click();

  // Confirmar eliminación en el modal
  await grupoModal.confirmarEliminacionGrupoVendedores();
}