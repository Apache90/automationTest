import { Encargado } from '../../actors/Encargado';
import { SupervisorModal } from '../../helpers/supervisormodals';

export async function agregarNuevoSupervisor(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Ir a "Supervisores" (nuevo layout de menú)
  const seccionSupervisores = page.locator('a.item-link[href="/manager/71/supervisores/"]');
  await seccionSupervisores.waitFor({ state: 'visible', timeout: 20000 });
  await seccionSupervisores.click();
  await page.waitForURL('**/#!/manager/71/supervisores/**', { timeout: 20000 });

  // Click en botón "+" (FAB)
  const pageCurrent = page.locator('.page.page-current');
  const botonAgregar = pageCurrent.locator('.custom-fab.fab.fab-right-bottom .btn-menuSeller.button').first();
  await botonAgregar.waitFor({ state: 'visible', timeout: 20000 });
  await botonAgregar.scrollIntoViewIfNeeded();
  await botonAgregar.click({ force: true });

  // Completar y confirmar en modal
  const modal = new SupervisorModal(page);
  await modal.completarEmailYConfirmar(email);
}