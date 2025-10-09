import { expect } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { FechasPage } from '../../pages/FechasPage';
import { FechaEspecialPage } from '../../pages/FechaEspecialPage';
import { ModificarFechaPage } from '../../pages/ModificarFechaPage';
import { FechaModals } from '../../helpers/fechamodals';

export async function modificarMensajesFecha(
  encargado: Encargado,
  nombreFecha: string,
  mensajePregratis: string,
  mensajePostgratis: string,
  mensajePrepago: string,
  mensajePostpago: string
) {
  const page = encargado.page;
  const fechasPage = new FechasPage(page);
  const fechaEspecialPage = new FechaEspecialPage(page);
  const modificarFechaPage = new ModificarFechaPage(page);
  const fechaModals = new FechaModals(page);

  // Navegar a la sección Fechas
  await fechasPage.navegarASeccionFechas();

  // Click en el botón de ver la fecha específica
  await fechasPage.clickVerFecha(nombreFecha);

  // Esperar a estar en la página de fecha especial
  await page.waitForLoadState("networkidle");

  // Click en el botón de editar
  await fechaEspecialPage.clickEditarFecha();

  // Esperar a estar en la página de modificar fecha
  await page.waitForLoadState("networkidle");

  // Completar los mensajes
  await modificarFechaPage.completarMensajes(
    mensajePregratis,
    mensajePostgratis,
    mensajePrepago,
    mensajePostpago
  );

  // Click en modificar fecha
  await modificarFechaPage.clickModificarFecha();

  // Esperar y manejar el modal de éxito
  await fechaModals.esperarModalEspecialModificacionExitosa();
  await fechaModals.cerrarModalExito();

  // Verificar que regresamos a la página de fecha especial
  await page.waitForLoadState("networkidle");

  // Construir los mensajes esperados
  const mensajeFreeEsperado = `${mensajePregratis} %LINK% ${mensajePostgratis}`;
  const mensajePagoEsperado = `${mensajePrepago} %LINK% ${mensajePostpago}`;

  // Verificar que los mensajes se muestran correctamente
  await fechaEspecialPage.verificarMensajeFree(mensajeFreeEsperado);
  await fechaEspecialPage.verificarMensajePago(mensajePagoEsperado);
}