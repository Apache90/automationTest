import { Page } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesDniPage } from '../../pages/CuponesDniPage';
import { CrearCuponDniPage } from '../../pages/CrearCuponDniPage';
import { CuponModals } from '../../helpers/CuponModals';


export async function crearCuponDniPago(
  encargado: Encargado,
  nombre: string,
  descripcion: string,
  precio: string,
  seleccionarDias = true
) {
  const page = encargado.page;
  const cuponesDniPage = new CuponesDniPage(page);
  const crearCuponPage = new CrearCuponDniPage(page);
  
  // Navegar a la sección DNI's Pago
  await cuponesDniPage.navegarASeccionDNIsPago();
  
  // Click en botón agregar nuevo cupón
  await cuponesDniPage.clickAgregarNuevoCuponDNIPago();
  
  // Completar formulario
  await crearCuponPage.completarFormularioDniPago(nombre, descripcion, precio, seleccionarDias);
  
  // Click en crear cupón
  await crearCuponPage.clickCrearCupon();
}
