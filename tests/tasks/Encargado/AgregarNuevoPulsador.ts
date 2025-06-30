import { Encargado } from '../../actors/Encargado';
import { PulsadorModal } from '../../helpers/pulsadormodals';

export async function agregarNuevoPulsador(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Pulsadores"
  const seccionPulsadores = page.locator('label.svelte-1x3l73x', { hasText: 'Pulsadores' });
  await seccionPulsadores.click();

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
  await botonAgregar.click();

  // Completar y confirmar en modal
  const modal = new PulsadorModal(page);
  await modal.completarEmailYConfirmar(email);
}