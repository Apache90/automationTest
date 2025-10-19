import { Encargado } from "../../actors/Encargado";
import { FechasPage } from "../../pages/FechasPage";
import { FechaEspecialPage } from "../../pages/FechaEspecialPage";
import { CrearFechaPage } from "../../pages/CrearFechaPage";
import { FechaModals } from "../../helpers/fechamodals";
import { expect } from '@playwright/test';

export async function cambiarImagenFecha(
  encargado: Encargado,
  nombreFecha: string,
  rutaImagen: string
): Promise<void> {
  const fechasPage = new FechasPage(encargado.page);
  const fechaEspecialPage = new FechaEspecialPage(encargado.page);
  const fechaModals = new FechaModals(encargado.page);
  
  // Usar CrearFechaPage para manejar la imagen porque ya funciona correctamente
  const crearFechaPage = new CrearFechaPage(encargado.page);

  // Navegar a la sección de Fechas
  await fechasPage.navegarASeccionFechas();
  await encargado.page.waitForLoadState("networkidle");

  // Buscar y hacer clic en "Ver" de la fecha específica
  await fechasPage.clickVerFecha(nombreFecha);
  await encargado.page.waitForLoadState("networkidle");

  // En la página de detalles, hacer clic en el botón de editar (FAB)
  await fechaEspecialPage.clickEditarFecha();
  await encargado.page.waitForLoadState("networkidle");

  // Cambiar la imagen usando el método que funciona de CrearFechaPage
  await crearFechaPage.subirImagen(rutaImagen);

  // Manejar spinner si existe
  await fechaModals.manejarSpinnerSiExiste();

  // Hacer clic en MODIFICAR FECHA
  const modificarBtn = encargado.page.locator('a.button.button-fill', { hasText: 'MODIFICAR FECHA' });
  await modificarBtn.scrollIntoViewIfNeeded();
  await modificarBtn.click({ force: true });

  // El modal de confirmación quedará visible para que el test lo verifique
}