import { Page } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesQrPage } from '../../pages/CuponesQrPage';
import { CrearCuponQrPage } from '../../pages/CrearCuponQrPage';
import { CuponModals } from '../../helpers/CuponModals';

export async function crearCuponQr(
  encargado: Encargado,
  nombre: string,
  descripcion: string,
  rutaFoto: string,
  seleccionarDia = true
) {
  const page = encargado.page;
  const cuponesQrPage = new CuponesQrPage(page);
  const crearCuponPage = new CrearCuponQrPage(page);
  const cuponModals = new CuponModals(page);
  
  // Navegar a la sección QR's
  await cuponesQrPage.navegarASeccionQRs();
  
  // Click en botón agregar nuevo cupón
  await cuponesQrPage.clickAgregarNuevoCuponQR();
  
  // Completar formulario
  await crearCuponPage.completarFormularioQr(nombre, descripcion, seleccionarDia);
  
  // Subir foto
  await crearCuponPage.subirFoto(rutaFoto);
  
  // Manejar modal de foto requerida si aparece
  await cuponModals.manejarModalFotoRequeridaSiAparece();
  
  // Click en crear cupón
  await crearCuponPage.clickCrearCupon();
}