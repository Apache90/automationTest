import { expect } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { FechasPage } from '../../pages/FechasPage';
import { FechaModals } from '../../helpers/fechamodals';

export async function copiarFecha(
  encargado: Encargado,
  nombreFechaOriginal: string,
  nombreFechaCopia: string
) {
  const page = encargado.page;
  const fechasPage = new FechasPage(page);
  const fechaModals = new FechaModals(page);

  // Navegar a la sección Fechas
  await fechasPage.navegarASeccionFechas();

  // Click en el botón de copiar de la fecha específica
  await fechasPage.clickCopiarFecha(nombreFechaOriginal);

  // Esperar y confirmar el primer modal de confirmación
  const modalConfirmacion = page.locator('.dialog.modal-in').filter({
    hasText: '¿Está seguro de que quiere duplicar esta fecha?'
  });
  await expect(modalConfirmacion).toBeVisible({ timeout: 10000 });
  
  const botonConfirmar = modalConfirmacion.locator('span.dialog-button', { hasText: 'Confirmar' });
  await botonConfirmar.click();

  // Esperar el modal para ingresar el nuevo nombre
  const modalNombre = page.locator('.dialog.modal-in').filter({
    hasText: 'Escribe un nuevo nombre para la fecha'
  });
  await expect(modalNombre).toBeVisible({ timeout: 10000 });

  // Ingresar el nuevo nombre
  const inputNombre = page.locator('input#inputValue[placeholder="Ingresa nuevo nombre"]');
  await inputNombre.fill(nombreFechaCopia);

  // Confirmar el nuevo nombre
  const botonConfirmarNombre = modalNombre.locator('span.dialog-button', { hasText: 'Confirmar' });
  await botonConfirmarNombre.click();

  // Esperar el modal de éxito
  await fechaModals.esperarModalCopiaExitosa();
  await fechaModals.cerrarModalExito();

  // Verificar que la nueva fecha aparece en la lista
  await fechasPage.verificarFechaEnLista(nombreFechaCopia);
}
