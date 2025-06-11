import { Encargado } from '../../actors/Encargado';
import { VendedorModal } from '../../helpers/vendedormodals';

export async function agregarNuevoVendedor(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Vendedores"
  const seccionVendedores = page.locator('label.svelte-1x3l73x', { hasText: 'Vendedores' });
  await seccionVendedores.click();

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
  await botonAgregar.click();

  // Completar y confirmar en modal
  const modal = new VendedorModal(page);
  await modal.completarEmailYConfirmar(email);
}