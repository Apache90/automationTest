import { Encargado } from '../../actors/Encargado';
import { expect } from '@playwright/test';

/**
 * Elimina un rol de usuario (Vendedor, Canjeador, etc.) buscándolo por su email.
 * Esta tarea es genérica y funciona para cualquier sección de roles.
 * @param encargado El actor Encargado que realiza la acción.
 * @param email El email del usuario a eliminar.
 */
export async function eliminarRolPorEmail(encargado: Encargado, email: string) {
  const { page } = encargado;

  // 1. Localiza el contenedor del item de la lista que incluye el email.
  const itemContainer = page.locator('.grid-container, .row', { hasText: email }).first();
  await expect(itemContainer).toBeVisible({ timeout: 5000 });

  // 2. Dentro de ese contenedor, localiza el ícono de la papelera y haz clic.
  const botonEliminar = itemContainer.locator('i.fa-trash');
  await expect(botonEliminar).toBeVisible();
  await botonEliminar.click();
}