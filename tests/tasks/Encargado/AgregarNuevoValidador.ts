import { Encargado } from '../../actors/Encargado';
import { ValidadorModal } from '../../helpers/validadormodals';

export async function agregarNuevoValidador(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Validador"
  const seccionValidadores = page.locator('label.svelte-1x3l73x', { hasText: 'Validadores' });
  await seccionValidadores.click();

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
  await botonAgregar.click();

  // Completar y confirmar en modal
  const modal = new ValidadorModal(page);
  await modal.completarEmailYConfirmar(email);
}