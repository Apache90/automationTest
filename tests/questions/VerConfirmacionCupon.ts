import { Page, expect } from '@playwright/test';
import { CuponModals } from '../helpers/CuponModals';
import { CuponesDniPage } from '../pages/CuponesDniPage';
import { CuponesQrPage } from '../pages/CuponesQrPage';

export async function verConfirmacionCreacion(page: Page) {
  const cuponModals = new CuponModals(page);
  await cuponModals.esperarModalExito("Cupón creado correctamente.");
  await cuponModals.cerrarModalExito();
}

export async function verConfirmacionModificacion(page: Page) {
  const cuponModals = new CuponModals(page);
  await cuponModals.esperarModalExito("Cupón modificado correctamente.");
  await cuponModals.cerrarModalExito();
}

export async function verConfirmacionEliminacion(page: Page) {
  const cuponModals = new CuponModals(page);
  await cuponModals.esperarModalEliminacionExitosa();
  await cuponModals.cerrarModalExito();
}

export async function verificarCuponEliminado(page: Page, nombre: string, tipo: 'DNI' | 'Pago_DNI' | 'QR' | 'Pago_QR') {
  if (tipo === 'DNI' || tipo === 'Pago_DNI') {
    const cuponesDniPage = new CuponesDniPage(page);
    await cuponesDniPage.verificarCuponEliminado(nombre);
    
    // Verificar mensaje si no hay más cupones
    try {
      await cuponesDniPage.verificarNoHayCupones();
    } catch (error) {
      // Ignorar si hay otros cupones
    }
  } else {
    const cuponesQrPage = new CuponesQrPage(page);
    await cuponesQrPage.verificarCuponEliminado(nombre);
    
    // Verificar mensaje si no hay más cupones
    try {
      await cuponesQrPage.verificarNoHayCupones();
    } catch (error) {
      // Ignorar si hay otros cupones
    }
  }
}