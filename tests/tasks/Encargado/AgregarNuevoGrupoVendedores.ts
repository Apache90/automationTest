import { expect } from "@playwright/test";
import { Encargado } from '../../actors/Encargado';
import { VendedorModal } from '../../helpers/vendedormodals';
import { GruposVendedoresModal } from '../../helpers/gruposmodals';

export async function agregarNuevoVendedorGrupo(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Solo haz click en "Vendedores" si NO estás ya en la sección
  const heading = page.locator('h1', { hasText: 'Vendedores' });
  if (!(await heading.isVisible())) {
    const seccionVendedores = page.locator('label.svelte-1x3l73x', { hasText: 'Vendedores' });
    await seccionVendedores.click();
    await page.waitForTimeout(500);
  }

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab a').first();
  await botonAgregar.click();
  await page.waitForTimeout(500);

  // Completar y confirmar en modal
  const modal = new VendedorModal(page);
  await modal.completarEmailYConfirmar(email);

  // Esperar y cerrar modal de éxito
  await modal.esperarModalExito();
  await modal.cerrarModalExito();
  await page.waitForTimeout(500);
}

export async function agregarVendedorAGrupo(
  encargado: Encargado,
  grupo: string,
  email: string,
  nombreVendedor: string = "Emir Segovia" // Puedes parametrizar el nombre si lo necesitas
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

  // Desplegar grupo por nombre
  const grupoItem = page.locator('div.list ul li .item-title', { hasText: grupo });
  await grupoItem.click();

  // Click en "Agregar vendedor/es"
  await page.locator('a.list-button', { hasText: "Agregar vendedor/es" }).click();

  // Seleccionar vendedor por email y confirmar
  await grupoModal.seleccionarVendedores([email]);
  // Esperar modal de éxito
  await grupoModal.esperarModalExito("Vendedor agregado correctamente");

  // Buscar el <li class="swipeout"> que contenga el email
  const grupoAccordion = page.locator('div.list ul li.accordion-item-opened');
  const vendedorLi = grupoAccordion.locator('li.swipeout', { hasText: email });

  // Dentro de ese <li>, buscar el nombre
  const nombreVendedorLocator = vendedorLi.locator('div.item-header[slot="header"]', { hasText: nombreVendedor });
  await expect(nombreVendedorLocator).toBeVisible({ timeout: 5000 });
}