import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { GruposVendedoresModal } from "../../helpers/gruposmodals";

export async function intentarCrearGrupoSinNombre(encargado: Encargado) {
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

  // Click en el botón "+" flotante para crear grupo
  const botonMasGrupo = page.locator('.custom-fab.fab-right-bottom > a:has(> i.material-icons:has-text("add"))').filter({
    hasNot: page.locator('div')
  });
  await expect(botonMasGrupo).toBeVisible({ timeout: 5000 });
  await botonMasGrupo.click();

  // Usar el helper para seleccionar vendedores (esto manejará el modal correctamente)
  await grupoModal.seleccionarVendedores(["vendedor2@gmail.com"]);

  // Esperar el modal de nombre del grupo
  const modalNombre = page.locator('.dialog.modal-in');
  await expect(modalNombre).toBeVisible({ timeout: 5000 });
  await expect(modalNombre.locator('.dialog-title')).toContainText('Nombre del Grupo');

  // No llenar el input (dejar vacío) y hacer click en Confirmar
  const confirmarButton = modalNombre.locator('.dialog-button', { hasText: 'Confirmar' });
  await confirmarButton.click();
}