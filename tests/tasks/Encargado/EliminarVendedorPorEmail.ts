import { Encargado } from '../../actors/Encargado';

export async function EliminarVendedorPorEmail(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Ubica el vendedor por el email en el footer y sube al <li> contenedor
  const emailFooter = page.locator('.item-footer', { hasText: email }).first();
  await emailFooter.waitFor({ state: 'visible', timeout: 20000 });

  // El layout nuevo es un grid de tarjetas; las acciones (incl. borrar) están fuera del <li>
  // dentro de un contenedor `.vendor-actions`, pero siempre dentro de `.vendor-card`.
  const vendorCard = emailFooter.locator('xpath=ancestor::*[contains(@class,"vendor-card")][1]');
  await vendorCard.waitFor({ state: 'visible', timeout: 20000 });

  const botonEliminar = vendorCard.locator('.action-trigger:has(i.fa-trash) a.button').first();
  await botonEliminar.waitFor({ state: 'visible', timeout: 20000 });
  await botonEliminar.click();
}