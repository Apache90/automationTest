import { expect } from "@playwright/test";
import { Encargado } from "../../actors/Encargado";
import { LimitacionesPage } from "../../pages/LimitacionesPage";
import { LimitacionesModal } from "../../helpers/limitacionesmodals";

export async function crearLimitacionVendedor(
  encargado: Encargado,
  emailVendedor: string,
  nombreCupon: string,
  cantidad: string = "10",
  fecha: string = "27/08/2025"
) {
  const { page } = encargado;
  const limitacionesPage = new LimitacionesPage(page);
  const limitacionesModal = new LimitacionesModal(page);

  // Navegar a las limitaciones del vendedor específico
  await limitacionesPage.navegarALimitacionesVendedor(emailVendedor);

  // Click en nueva limitación
  await limitacionesPage.clickNuevaLimitacion();

  // Seleccionar fecha (rango desde-hasta)
  await limitacionesPage.seleccionarFecha(fecha);

  // Seleccionar cupón
  await limitacionesPage.seleccionarCupon(nombreCupon);

  // Ingresar cantidad
  await limitacionesPage.ingresarCantidad(cantidad);

  // Seleccionar todos los días de la semana
  await limitacionesPage.seleccionarTodosLosDias();

  // Crear la limitación
  await limitacionesPage.clickCrearLimitacion();

  // Esperar modal de éxito y cerrarlo
  await limitacionesModal.esperarModalExitoLimitacionCreada();

  // Verificar que regresamos a la página de limitaciones
  await limitacionesPage.verificarEnPaginaLimitaciones();
}
