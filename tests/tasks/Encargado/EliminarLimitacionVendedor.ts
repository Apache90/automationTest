import { Encargado } from "../../actors/Encargado";
import { LimitacionesPage } from "../../pages/LimitacionesPage";

export async function eliminarLimitacionVendedor(
  encargado: Encargado,
  emailVendedor: string,
  nombreCupon: string
) {
  const limitacionesPage = new LimitacionesPage(encargado.page);

  // Navegar a la sección de vendedores
  await limitacionesPage.navegarAVendedores();

  // Click en el ícono de limitaciones del vendedor específico
  await limitacionesPage.clickLimitacionesVendedor(emailVendedor);

  // Click en eliminar limitación
  await limitacionesPage.clickEliminarLimitacion(nombreCupon);

  // Confirmar eliminación en el modal
  await limitacionesPage.confirmarEliminacionLimitacion();

  // Esperar confirmación de éxito
  await limitacionesPage.esperarModalEliminacionExitosa();
}
