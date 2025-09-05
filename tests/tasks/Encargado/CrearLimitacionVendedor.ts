import { Encargado } from "../../actors/Encargado";
import { LimitacionesPage } from "../../pages/LimitacionesPage";

export async function crearLimitacionVendedor(
  encargado: Encargado,
  emailVendedor: string,
  nombreCupon: string,
  cantidad: string
) {
  const limitacionesPage = new LimitacionesPage(encargado.page);

  // Navegar a la sección de vendedores
  await limitacionesPage.navegarAVendedores();

  // Click en el ícono de limitaciones del vendedor específico
  await limitacionesPage.clickLimitacionesVendedor(emailVendedor);

  // Click en crear nueva limitación
  await limitacionesPage.clickCrearNuevaLimitacion();

  // Seleccionar fecha
  await limitacionesPage.seleccionarFecha("15/09/2025");

  // Seleccionar cupón
  await limitacionesPage.seleccionarCupon(nombreCupon);

  // Ingresar cantidad
  await limitacionesPage.ingresarCantidad(cantidad);

  // Seleccionar todos los días de la semana
  await limitacionesPage.seleccionarTodosLosDias();

  // Crear limitación
  await limitacionesPage.clickCrearLimitacion();

  // Esperar confirmación
  await limitacionesPage.esperarModalExito();
}
