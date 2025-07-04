import { Page } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesDniPage } from '../../pages/CuponesDniPage';
import { ModificarCuponPage } from '../../pages/ModificarCuponPage';

export async function editarCuponDni(
  encargado: Encargado,
  nombreActual: string,
  nuevoNombre: string,
  tipo: 'DNI' | 'Pago_DNI'
) {
  const page = encargado.page;
  const cuponesDniPage = new CuponesDniPage(page);
  const modificarCuponPage = new ModificarCuponPage(page);
  
  // Navegar a la sección DNI's correspondiente
  if (tipo === 'DNI') {
    await cuponesDniPage.navegarASeccionDNIs();
  } else {
    await cuponesDniPage.navegarASeccionDNIsPago();
  }
  
  // Buscar el cupón por su nombre
  const cupon = await cuponesDniPage.buscarCuponPorNombre(nombreActual);
  
  // Click en editar
  await cuponesDniPage.clickEditarCupon(cupon, tipo);
  
  // Modificar el nombre
  await modificarCuponPage.modificarNombre(nuevoNombre);
  
  // Click en modificar cupón
  await modificarCuponPage.clickModificarCupon();
}