import { Encargado } from '../../actors/Encargado';
import { SupervisorModal } from '../../helpers/supervisormodals';

export async function agregarNuevoSupervisor(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Supervisores"
  const seccionSupervisores = page.locator('label.svelte-1x3l73x', { hasText: 'Supervisores' });
  await seccionSupervisores.click();

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
  await botonAgregar.click();

  // Completar y confirmar en modal
  const modal = new SupervisorModal(page);
  await modal.completarEmailYConfirmar(email);
}