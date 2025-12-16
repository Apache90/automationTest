import { Encargado } from '../../actors/Encargado';

export async function EliminarCanjeadorPorEmail(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Layout actual: filas tipo grid con footer que contiene el email.
  const canjeadorRow = page.locator('.grid-container.divisor-item').filter({
    has: page.locator('.item-footer', { hasText: email })
  }).first();

  await canjeadorRow.waitFor({ state: 'visible', timeout: 20000 });

  // Trigger de eliminación (prioriza overlay clickeable; fallback al icono)
  const overlayEliminar = canjeadorRow.locator('.action-trigger:has(i.fa-trash) a.button, .action-trigger:has(i.fa-light.fa-trash) a.button').first();
  if (await overlayEliminar.count()) {
    await overlayEliminar.click();
    return;
  }

  const iconoEliminar = canjeadorRow.locator('i.fa-trash, i.fa-light.fa-trash').first();
  await iconoEliminar.click();
}