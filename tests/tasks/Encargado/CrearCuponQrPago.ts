import { Page } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesQrPage } from '../../pages/CuponesQrPage';
import { CrearCuponQrPage } from '../../pages/CrearCuponQrPage';
import { CuponModals } from '../../helpers/CuponModals';

export async function crearCuponQrPago(
  encargado: Encargado,
  nombre: string,
  descripcion: string,
  precio: string,
  cantMax: string,
  rutaFoto: string,
  seleccionarDia = true
) {
  const page = encargado.page;
  const cuponesQrPage = new CuponesQrPage(page);
  const crearCuponPage = new CrearCuponQrPage(page);
  const cuponModals = new CuponModals(page);
  
  // Navegar a la sección QR's Pago
  await cuponesQrPage.navegarASeccionQRsPago();
  
  // Click en botón agregar nuevo cupón
  await cuponesQrPage.clickAgregarNuevoCuponQRPago();
  
  // Completar formulario
  await crearCuponPage.completarFormularioQrPago(nombre, descripcion, precio, cantMax, seleccionarDia);
  
  // Subir foto
  await crearCuponPage.subirFoto(rutaFoto);
  
  // Manejar spinner si existe
  await cuponModals.manejarSpinnerSiExiste();
  
  // Manejar modal de foto requerida si aparece
  await cuponModals.manejarModalFotoRequeridaSiAparece();
  
  // Click en crear cupón
  await crearCuponPage.clickCrearCupon();
}