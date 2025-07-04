import { Page } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesQrPage } from '../../pages/CuponesQrPage';
import { ModificarCuponPage } from '../../pages/ModificarCuponPage';

export async function editarCuponQr(
  encargado: Encargado,
  nombreActual: string,
  nuevoNombre: string,
  esQrPago = false
) {
  const page = encargado.page;
  const cuponesQrPage = new CuponesQrPage(page);
  const modificarCuponPage = new ModificarCuponPage(page);
  
  // Navegar a la sección QR's correspondiente
  if (esQrPago) {
    await cuponesQrPage.navegarASeccionQRsPago();
  } else {
    await cuponesQrPage.navegarASeccionQRs();
  }
  
  // Buscar el cupón por su nombre
  const cupon = await cuponesQrPage.buscarCuponPorNombre(nombreActual);
  
  // Click en editar
  await cuponesQrPage.clickEditarCupon(cupon);
  
  // Modificar el nombre
  await modificarCuponPage.modificarNombre(nuevoNombre);
  
  // Click en modificar cupón
  await modificarCuponPage.clickModificarCupon();
}