import { Page, Locator, expect } from '@playwright/test';

export class FechaModals {
  readonly page: Page;
  readonly modalError: Locator;
  readonly modalExito: Locator;
  readonly modalConfirmacion: Locator;
  readonly spinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
    this.modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
    this.modalConfirmacion = page.locator(".dialog.modal-in");
    this.spinner = page.locator(".preloader, .spinner, .loading-indicator");
  }

  async esperarModalError(mensaje: string) {
    console.log(`Esperando modal de error con mensaje: "${mensaje}"`);

    try {
      // Intentar esperar el modal con timeout aumentado
      await expect(this.modalError).toBeVisible({ timeout: 15000 });
      await expect(this.modalError.locator(".dialog-title")).toContainText("DOORS");
      await expect(this.modalError.locator(".dialog-text")).toContainText(mensaje);
      console.log("Modal de error encontrado correctamente");
    } catch (error) {
      console.error("Error al esperar modal:", error);
      // Tomar captura del estado actual
      await this.page.screenshot({ path: `error-modal-not-found-${Date.now()}.png`, fullPage: true });

      // Log para debugging
      console.log("Estado actual de la página:");
      console.log(`URL: ${this.page.url()}`);
      console.log(`Botones disponibles: ${await this.page.locator('a.button.button-fill').count()}`);

      // Re-lanzar el error
      throw error;
    }
  }

  async cerrarModalError() {
    await this.modalError.locator("span.dialog-button", { hasText: "OK" }).click();
  }

  async esperarModalExito(mensaje = "Fecha creada correctamente.") {
    await expect(this.modalExito).toBeVisible({ timeout: 10000 });
    await expect(this.modalExito.locator(".dialog-title")).toContainText("Excelente!");
    await expect(this.modalExito.locator(".dialog-text")).toContainText(mensaje);
  }

  async cerrarModalExito() {
    await this.modalExito.locator("span.dialog-button", { hasText: "OK" }).click();
    await expect(this.modalExito).not.toBeVisible({ timeout: 5000 });
  }

  async esperarModalModificacionExitosa() {
    await expect(this.modalExito).toBeVisible({ timeout: 10000 });
    await expect(this.modalExito.locator(".dialog-text")).toContainText("Fecha modificada correctamente.");
  }

  async esperarModalEliminacionExitosa() {
    await expect(this.modalExito).toBeVisible({ timeout: 5000 });
    await expect(this.modalExito.locator(".dialog-text")).toContainText("Fecha eliminada con éxito");
  }

  async confirmarEliminacion() {
    await expect(this.modalConfirmacion).toBeVisible({ timeout: 5000 });
    await expect(this.modalConfirmacion).toContainText("¿Estás seguro que deseas eliminar esta fecha?");
    await this.modalConfirmacion.locator("span.dialog-button", { hasText: "Confirmar" }).click();
  }

  async manejarSpinnerSiExiste() {
    if (await this.spinner.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(this.spinner).toBeHidden({ timeout: 10000 });
    }
  }
}