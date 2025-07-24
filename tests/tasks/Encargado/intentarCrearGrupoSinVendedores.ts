import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";

export async function intentarCrearGrupoSinVendedores(encargado: Encargado) {
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

  // Click en el botón "+" flotante para crear grupo
  const botonMasGrupo = page.locator('.custom-fab.fab-right-bottom > a:has(> i.material-icons:has-text("add"))').filter({
    hasNot: page.locator('div')
  });
  await expect(botonMasGrupo).toBeVisible({ timeout: 5000 });
  await botonMasGrupo.click();

  // Esperar el modal de selección de vendedores
  const modal = page.locator('.dialog.modal-in');
  await expect(modal).toBeVisible({ timeout: 5000 });
  await expect(modal.locator('.dialog-title')).toContainText('Seleccionar vendedores');

  // Hacer click en OK sin seleccionar vendedores
  const okButton = modal.locator('.dialog-button', { hasText: 'OK' });
  await okButton.click();
}