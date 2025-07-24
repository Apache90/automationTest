import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";

export async function eliminarVendedorDeGrupo(
  encargado: Encargado,
  nombreGrupo: string,
  emailVendedor: string
) {
  const { page } = encargado;

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

  // Buscar el vendedor específico por email en el grupo desplegado
  const grupoAccordion = page.locator('div.list ul li.accordion-item-opened');
  const vendedorContainer = grupoAccordion.locator('.grid-container.vendedor-item', { hasText: emailVendedor });
  
  // Hacer click en el botón de eliminar (icono de trash)
  const botonEliminar = vendedorContainer.locator('.col-10 .fa-trash a.button');
  await botonEliminar.click();
}