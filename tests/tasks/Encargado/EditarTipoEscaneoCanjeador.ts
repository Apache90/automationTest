import { Encargado } from '../../actors/Encargado';
import { CanjeadorModal } from '../../helpers/canjeadormodals';

export async function editarTipoEscaneoCanjeador(encargado: Encargado, email: string, tipoEscaneo: 'QR' | 'DNI' | 'BOTH') {
  const { page } = encargado;

  // Click en sección "Canjeadores"
  const seccionCanjeadores = page.locator('li.item-input.svelte-1x3l73x a[href*="/canjeadores/"]');
  await seccionCanjeadores.click();

  // Esperar que la página cargue
  await page.waitForLoadState("networkidle");

  // Buscar el canjeador por email en la estructura específica
  const canjeadorRow = page.locator('.grid-container.divisor-item.svelte-6fg2y1').filter({
    has: page.locator('.item-footer span', { hasText: email })
  });
  
  await canjeadorRow.waitFor({ state: 'visible', timeout: 10000 });
  
  // Click en el botón de editar usando el selector más específico
  const botonEditar = canjeadorRow.locator('button[aria-label="Editar canjeador"]');
  await botonEditar.click();

  // Usar el modal helper para completar la edición
  const modal = new CanjeadorModal(page);
  await modal.editarTipoEscaneo(tipoEscaneo);
}