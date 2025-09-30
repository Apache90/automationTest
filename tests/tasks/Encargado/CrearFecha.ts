import { expect } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { FechasPage } from '../../pages/FechasPage';
import { CrearFechaPage } from '../../pages/CrearFechaPage';
import { FechaModals } from '../../helpers/fechamodals';

export async function crearFecha(
  encargado: Encargado,
  fecha: string,
  nombre: string,
  descripcion: string,
  direccion: string,
  rutaImagen: string
) {
  const page = encargado.page;
  const fechasPage = new FechasPage(page);
  const crearFechaPage = new CrearFechaPage(page);
  const fechaModals = new FechaModals(page);

  // Navegar a la sección Fechas
  await fechasPage.navegarASeccionFechas();

  // Click en botón agregar nueva fecha
  await fechasPage.clickAgregarNuevaFecha();

  // Completar formulario
  await crearFechaPage.completarFormularioFecha(fecha, nombre, descripcion, direccion);

  // Subir imagen
  await crearFechaPage.subirImagen(rutaImagen);

  // Manejar spinner si existe
  await fechaModals.manejarSpinnerSiExiste();

  // Click en crear fecha
  await crearFechaPage.clickCrearFecha();
}

// Función específica para probar error de nombre vacío
export async function intentarCrearFechaSinNombre(
  encargado: Encargado,
  fecha: string,
  descripcion: string,
  direccion: string,
  rutaImagen: string
) {
  const page = encargado.page;
  const fechasPage = new FechasPage(page);
  const crearFechaPage = new CrearFechaPage(page);
  const fechaModals = new FechaModals(page);

  // Navegar a la sección Fechas
  await fechasPage.navegarASeccionFechas();

  // Click en botón agregar nueva fecha
  await fechasPage.clickAgregarNuevaFecha();

  // Completar formulario SIN NOMBRE (string vacío)
  await crearFechaPage.completarFormularioFecha(fecha, "", descripcion, direccion);

  // Subir imagen
  await crearFechaPage.subirImagen(rutaImagen);

  // Manejar spinner si existe
  await fechaModals.manejarSpinnerSiExiste();

  // Click en crear fecha
  await crearFechaPage.clickCrearFecha();
}