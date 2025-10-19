import { expect, Page } from '@playwright/test';

/**
 * Verifica que aparezca un modal de error con el mensaje específico.
 * @param page Instancia de Playwright Page del actor.
 * @param mensajeError Mensaje de error que debe aparecer en el modal.
 */
export async function verModalError(
  page: Page,
  mensajeError: string
) {
  const modal = page.locator(".dialog.dialog-buttons-1.modal-in");
  await expect(modal).toBeVisible({ timeout: 15000 });
  await expect(modal.locator(".dialog-title")).toContainText("DOORS");
  await expect(modal.locator(".dialog-text")).toContainText(mensajeError);
}

/**
 * Verifica que aparezca un modal de éxito con el mensaje específico.
 * @param page Instancia de Playwright Page del actor.
 * @param mensajeExito Mensaje de éxito que debe aparecer en el modal (opcional).
 */
export async function verModalExito(
  page: Page,
  mensajeExito: string = "Fecha creada correctamente."
) {
  const modal = page.locator(".dialog.dialog-buttons-1.modal-in");
  await expect(modal).toBeVisible({ timeout: 10000 });
  await expect(modal.locator(".dialog-title")).toContainText("Excelente!");
  await expect(modal.locator(".dialog-text")).toContainText(mensajeExito);
}

/**
 * Verifica que aparezca el modal de eliminación exitosa.
 * @param page Instancia de Playwright Page del actor.
 */
export async function verModalEliminacionExitosa(
  page: Page
) {
  const modal = page.locator(".dialog.dialog-buttons-1.modal-in");
  await expect(modal).toBeVisible({ timeout: 5000 });
  await expect(modal.locator(".dialog-text")).toContainText("Fecha eliminada con éxito");
}

/**
 * Verifica que aparezca el modal de copia exitosa.
 * @param page Instancia de Playwright Page del actor.
 */
export async function verModalCopiaExitosa(
  page: Page
) {
  const modal = page.locator(".dialog.dialog-buttons-1.modal-in");
  await expect(modal).toBeVisible({ timeout: 10000 });
  await expect(modal.locator(".dialog-title")).toContainText("DOORS");
  await expect(modal.locator(".dialog-text")).toContainText("Fecha duplicada con éxito");
}

/**
 * Verifica que aparezca el modal de modificación especial exitosa.
 * @param page Instancia de Playwright Page del actor.
 */
export async function verModalModificacionEspecialExitosa(
  page: Page
) {
  const modal = page.locator(".dialog.dialog-buttons-1.modal-in");
  await expect(modal).toBeVisible({ timeout: 10000 });
  await expect(modal.locator(".dialog-title")).toContainText("Excelente!");
  await expect(modal.locator(".dialog-text")).toContainText("Fecha especial modificada correctamente.");
}