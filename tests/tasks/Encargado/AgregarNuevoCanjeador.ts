import { Encargado } from '../../actors/Encargado';
import { CanjeadorModal } from '../../helpers/canjeadormodals';

export async function agregarNuevoCanjeador(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Canjeadores" (nuevo layout de menú)
  const seccionCanjeadores = page.locator('a.item-link[href="/manager/71/canjeadores/"]');
  await seccionCanjeadores.waitFor({ state: 'visible', timeout: 20000 });
  await seccionCanjeadores.click();
  await page.waitForURL('**/#!/manager/71/canjeadores/**', { timeout: 20000 });

  // Click en botón "+" (FAB)
  const pageCurrent = page.locator('.page.page-current');
  const botonAgregar = pageCurrent.locator('.custom-fab.fab.fab-right-bottom a, .custom-fab.fab.fab-right-bottom').first();
  await botonAgregar.waitFor({ state: 'visible', timeout: 20000 });
  await botonAgregar.scrollIntoViewIfNeeded();
  await botonAgregar.click({ force: true });

  // Completar y confirmar en modal
  const modal = new CanjeadorModal(page);
  await modal.completarEmailYConfirmar(email);
}