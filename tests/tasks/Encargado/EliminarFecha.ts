import { Encargado } from "../../actors/Encargado";
import { FechasPage } from "../../pages/FechasPage";
import { FechaModals } from "../../helpers/fechamodals";

/**
 * Task: Eliminar una fecha existente
 * @param encargado - Actor que realiza la acción
 * @param nombreFecha - Nombre de la fecha a eliminar
 */
export async function eliminarFecha(
  encargado: Encargado,
  nombreFecha: string
): Promise<void> {
  const page = encargado.page;
  const fechasPage = new FechasPage(page);
  const fechaModals = new FechaModals(page);

  // Navegar a la sección de fechas
  await fechasPage.navegarASeccionFechas();
  await page.waitForLoadState("networkidle");

  // Buscar la fecha específica y hacer clic en eliminar
  await fechasPage.clickEliminarFechaPorNombre(nombreFecha);
  
  // Confirmar la eliminación en el modal
  await fechaModals.confirmarEliminacion();
  
  // Esperar que aparezca el modal de éxito y cerrarlo
  await fechaModals.esperarModalEliminacionExitosa();
  await fechaModals.cerrarModalExito();
}