import { Encargado } from "../../actors/Encargado";
import { FechasPage } from "../../pages/FechasPage";
import { FechaEspecialPage } from "../../pages/FechaEspecialPage";
import { FechaModals } from "../../helpers/fechamodals";
import { CrearFechaPage } from "../../pages/CrearFechaPage";
import { ModificarFechaPage } from "../../pages/ModificarFechaPage";

/**
 * Task: Cambiar imagen de una fecha existente
 * @param encargado - Actor que realiza la acción
 * @param nombreFecha - Nombre de la fecha a modificar
 * @param rutaImagen - Ruta de la nueva imagen
 */
export async function cambiarImagenFecha(
  encargado: Encargado,
  nombreFecha: string,
  rutaImagen: string
): Promise<void> {
  const page = encargado.page;
  const fechasPage = new FechasPage(page);
  const fechaModals = new FechaModals(page);

  // Navegar a la sección de fechas
  await fechasPage.navegarASeccionFechas();
  await page.waitForLoadState("networkidle");

  // Ir a la vista de la fecha (detalle) y desde ahí click en editar —
  // esto es más robusto que depender del ícono de edición en la lista
  await fechasPage.clickVerFecha(nombreFecha);
  await page.waitForLoadState("networkidle");

  const fechaEspecialPage = new FechaEspecialPage(page);
  await fechaEspecialPage.clickEditarFecha();
  await page.waitForLoadState("networkidle");
  
  // Subir la nueva imagen usando el mismo flujo que la creación (maneja crop)
  const crearFechaPage = new CrearFechaPage(page);
  await crearFechaPage.subirImagen(rutaImagen);

  // Guardar los cambios (usamos el page object de modificación)
  const modificarFechaPage = new ModificarFechaPage(page);
  await modificarFechaPage.clickModificarFecha();
  
  // Esperar que aparezca el modal de confirmación y cerrarlo
  await fechaModals.esperarModalExito("Fecha especial modificada correctamente.");
  await fechaModals.cerrarModalExito();
}