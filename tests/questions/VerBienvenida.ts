import { expect, Page } from '@playwright/test';

/**
 * Verifica la bienvenida general para cualquier actor y selector.
 * @param page Instancia de Playwright Page del actor.
 * @param selector Selector CSS del elemento de bienvenida.
 * @param textoEsperado Texto que debe estar visible en la bienvenida.
 */
export async function verBienvenidaGeneral(
  page: Page,
  selector: string,
  textoEsperado: string
) {
  const titulo = page.locator(selector, { hasText: textoEsperado });
  await expect(titulo).toBeVisible();
}