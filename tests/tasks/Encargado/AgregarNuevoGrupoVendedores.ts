import { Encargado } from '../../actors/Encargado';
import { VendedorModal } from '../../helpers/vendedormodals';

export async function agregarNuevoVendedorGrupo(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Solo haz click en "Vendedores" si NO estás ya en la sección
  const heading = page.locator('h1', { hasText: 'Vendedores' });
  if (!(await heading.isVisible())) {
    const seccionVendedores = page.locator('label.svelte-1x3l73x', { hasText: 'Vendedores' });
    await seccionVendedores.click();
    await page.waitForTimeout(500);
  }

  // Click en botón "+"
  const botonAgregar = page.locator('.custom-fab a').first();
  await botonAgregar.click();
  await page.waitForTimeout(500);

  // Completar y confirmar en modal
  const modal = new VendedorModal(page);
  await modal.completarEmailYConfirmar(email);

  // Esperar y cerrar modal de éxito
  await modal.esperarModalExito();
  await modal.cerrarModalExito();
  await page.waitForTimeout(500);
}