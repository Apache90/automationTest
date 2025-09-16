import { Encargado } from '../../actors/Encargado';
import { CanjeadorModal } from '../../helpers/canjeadormodals';

export async function agregarNuevoCanjeador(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Canjeadores" - nuevo selector
  const seccionCanjeadores = page.locator('li.item-input.svelte-1x3l73x a[href*="/canjeadores/"]');
  await seccionCanjeadores.click();

  // Esperar que la página cargue
  await page.waitForLoadState("networkidle");

  // Click en botón "+" - nuevo selector
  const botonAgregar = page.locator('.custom-fab.fab.fab-right-bottom a');
  await botonAgregar.click();

  // Completar y confirmar en modal
  const modal = new CanjeadorModal(page);
  await modal.completarEmailYConfirmar(email);
}