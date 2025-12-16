import { Encargado } from '../../actors/Encargado';
import { VendedorModal } from '../../helpers/vendedormodals';

export async function agregarNuevoVendedor(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Click en sección "Vendedores"
  const seccionVendedores = page.locator('a.item-link[href="/manager/71/vendedores/"]');
  await seccionVendedores.waitFor({ state: 'visible', timeout: 20000 });
  await seccionVendedores.click();
  await page.waitForURL('**/#!/manager/71/vendedores/**', { timeout: 20000 });

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab .btn-menuSeller.button').first();
  await botonAgregar.waitFor({ state: 'visible', timeout: 20000 });
  await botonAgregar.click();

  // Completar y confirmar en modal
  const modal = new VendedorModal(page);
  await modal.completarEmailYConfirmar(email);
}