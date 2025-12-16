import { Encargado } from '../../actors/Encargado';
import { CanjeadorModal } from '../../helpers/canjeadormodals';

export async function editarTipoEscaneoCanjeador(encargado: Encargado, email: string, tipoEscaneo: 'QR' | 'DNI' | 'BOTH') {
  const { page } = encargado;

  // Click en sección "Canjeadores"
  const seccionCanjeadores = page.locator('a.item-link[href="/manager/71/canjeadores/"]');
  await seccionCanjeadores.waitFor({ state: 'visible', timeout: 20000 });
  await seccionCanjeadores.click();
  await page.waitForURL('**/#!/manager/71/canjeadores/**', { timeout: 20000 });

  // Buscar el canjeador por email en la estructura específica
  const canjeadorRow = page.locator('.grid-container.divisor-item').filter({
    has: page.locator('.item-footer', { hasText: email })
  });
  
  await canjeadorRow.waitFor({ state: 'visible', timeout: 10000 });
  
  // Click en el botón de editar usando el selector más específico
  const botonEditar = canjeadorRow.locator('button[aria-label="Editar canjeador"]');
  await botonEditar.click();

  // Usar el modal helper para completar la edición
  const modal = new CanjeadorModal(page);
  await modal.editarTipoEscaneo(tipoEscaneo);
}