import { Encargado } from "../../actors/Encargado";
import { FechasPage } from "../../pages/FechasPage";
import { FechaModals } from "../../helpers/fechamodals";
import { verModalEliminacionExitosa } from "../../questions/VerModalFecha";
import { verFechaEliminada } from "../../questions/VerFecha";
import { expect } from '@playwright/test';

export async function eliminarFecha(
  encargado: Encargado,
  nombreFecha: string
): Promise<void> {
  const fechasPage = new FechasPage(encargado.page);
  const fechaModals = new FechaModals(encargado.page);

  // Navegar a la sección de Fechas
  await fechasPage.navegarASeccionFechas();
  await encargado.page.waitForLoadState("networkidle");

  // Buscar y hacer clic en "Eliminar" de la fecha específica
  await fechasPage.clickEliminarFecha(nombreFecha);

  // Confirmar eliminación en el modal de confirmación
  await fechaModals.confirmarEliminacion();

  // Esperar y verificar el modal de eliminación exitosa usando Questions
  await verModalEliminacionExitosa(encargado.page);
  await fechaModals.cerrarModalExito();

  // Verificar que la fecha ya no aparece en la lista usando Questions
  await encargado.page.waitForLoadState("networkidle");
  await verFechaEliminada(encargado.page, nombreFecha);
}