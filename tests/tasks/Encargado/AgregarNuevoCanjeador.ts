import { Encargado } from '../../actors/Encargado';
import { CanjeadorModal } from '../../helpers/canjeadormodals';

export async function agregarNuevoCanjeador(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Canjeador"
  const seccionCanjeadores = page.locator('label.svelte-1x3l73x', { hasText: 'Canjeadores' });
  await seccionCanjeadores.click();

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
  await botonAgregar.click();

  // Completar y confirmar en modal
  const modal = new CanjeadorModal(page);
  await modal.completarEmailYConfirmar(email);
}