import { expect, Page } from '@playwright/test';

/**
 * Verifica que una fecha específica esté visible en la lista de fechas.
 * @param page Instancia de Playwright Page del actor.
 * @param nombreFecha Nombre de la fecha que debe estar visible.
 */
export async function verFechaCreada(
  page: Page,
  nombreFecha: string
) {
  const fechaElement = page.locator('.grid-container').filter({
    has: page.locator('.item-header', { hasText: nombreFecha })
  });
  await expect(fechaElement).toBeVisible({ timeout: 10000 });
}

/**
 * Verifica que una fecha específica NO esté visible en la lista de fechas.
 * @param page Instancia de Playwright Page del actor.
 * @param nombreFecha Nombre de la fecha que NO debe estar visible.
 */
export async function verFechaEliminada(
  page: Page,
  nombreFecha: string
) {
  const fechaElement = page.locator('.grid-container').filter({
    has: page.locator('.item-header', { hasText: nombreFecha })
  });
  await expect(fechaElement).not.toBeVisible({ timeout: 5000 });
}