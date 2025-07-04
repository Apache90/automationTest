import { Page } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesDniPage } from '../../pages/CuponesDniPage';
import { CuponesQrPage } from '../../pages/CuponesQrPage';
import { CuponModals } from '../../helpers/CuponModals';

export async function eliminarCupon(
  encargado: Encargado,
  nombre: string,
  tipo: 'DNI' | 'Pago_DNI' | 'QR' | 'Pago_QR'
) {
  const page = encargado.page;
  const cuponModals = new CuponModals(page);
  
  if (tipo === 'DNI' || tipo === 'Pago_DNI') {
    const cuponesDniPage = new CuponesDniPage(page);
    
    // Navegar a la sección correspondiente
    if (tipo === 'DNI') {
      await cuponesDniPage.navegarASeccionDNIs();
    } else {
      await cuponesDniPage.navegarASeccionDNIsPago();
    }
    
    // Buscar el cupón y eliminarlo
    const cupon = await cuponesDniPage.buscarCuponPorNombre(nombre);
    await cuponesDniPage.clickEliminarCupon(cupon);
    
  } else { // QR o Pago_QR
    const cuponesQrPage = new CuponesQrPage(page);
    
    // Navegar a la sección correspondiente
    if (tipo === 'QR') {
      await cuponesQrPage.navegarASeccionQRs();
    } else {
      await cuponesQrPage.navegarASeccionQRsPago();
    }
    
    // Buscar el cupón y eliminarlo
    const cupon = await cuponesQrPage.buscarCuponPorNombre(nombre);
    await cuponesQrPage.clickEliminarCupon(cupon);
  }
  
  // Confirmar eliminación
  await cuponModals.confirmarEliminacion();
}