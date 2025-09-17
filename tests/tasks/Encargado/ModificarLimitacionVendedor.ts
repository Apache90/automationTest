import { Encargado } from "../../actors/Encargado";
import { LimitacionesPage } from "../../pages/LimitacionesPage";

export async function modificarLimitacionVendedor(
  encargado: Encargado,
  emailVendedor: string,
  nombreLimitacion: string,
  nuevaFecha: string,
  nuevaFechaFin: string,
  nuevaCantidad: string,
  diasADeseleccionar: string[] = []
) {
  const limitacionesPage = new LimitacionesPage(encargado.page);

  // Navegar a la sección de vendedores
  await limitacionesPage.navegarAVendedores();

  // Click en el ícono de limitaciones del vendedor específico
  await limitacionesPage.clickLimitacionesVendedor(emailVendedor);

  // Buscar y hacer click en la limitación específica a editar
  await limitacionesPage.clickEditarLimitacion(nombreLimitacion);

  // Modificar la fecha usando el método específico para edición
  // Si las fechas son iguales, usar el formato de fecha única
  if (nuevaFecha === nuevaFechaFin) {
    await limitacionesPage.seleccionarFechaEdicion(nuevaFecha);
  } else {
    // Para rangos de fechas, usar el formato DD/MM/YYYY - DD/MM/YYYY
    await limitacionesPage.seleccionarFechaEdicion(`${nuevaFecha} - ${nuevaFechaFin}`);
  }

  // Modificar la cantidad
  await limitacionesPage.ingresarCantidadEdicion(nuevaCantidad);

  // Deseleccionar días específicos si se proporcionaron
  if (diasADeseleccionar.length > 0) {
    for (const dia of diasADeseleccionar) {
      await limitacionesPage.deseleccionarDia(dia);
    }
  }

  // Guardar los cambios
  await limitacionesPage.clickGuardarCambios();

  // Esperar confirmación usando el método específico para modificaciones
  await limitacionesPage.esperarModalModificacionExitosa();
}