import { Page, expect } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesQrPage } from '../../pages/CuponesQrPage';
import { CrearCuponQrPage } from '../../pages/CrearCuponQrPage';
import { CuponModals } from '../../helpers/cuponmodals';
import { GruposCuponesModal } from "../../helpers/gruposcuponesmodals";

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

export async function crearGrupoCuponesQrPago(encargado: Encargado) {
  const page = encargado.page;
  const cuponesQrPage = new CuponesQrPage(page);
  const grupoModal = new GruposCuponesModal(page);
  const cuponModals = new CuponModals(page);

  // Navegar a la sección QRsPago solo una vez al inicio
  await cuponesQrPage.navegarASeccionQRsPago();

  // Crear primer cupón QRPago
  await cuponesQrPage.clickAgregarNuevoCuponQRPago();
  const crearCuponPage = new CrearCuponQrPage(page);
  await crearCuponPage.completarFormularioQrPago("QR $ GRUPO TEST", "Test descripcion QR $", "100", "50", true);
  
  // Subir foto (usando la foto de ejemplo de los assets)
  await crearCuponPage.subirFoto("tests/assets/foto-ejemplo.png");
  
  // Manejar spinner si existe
  await cuponModals.manejarSpinnerSiExiste();
  
  // Manejar modal de foto requerida si aparece
  await cuponModals.manejarModalFotoRequeridaSiAparece();
  
  await crearCuponPage.clickCrearCupon();

  await cuponModals.esperarModalExito("Cupón creado correctamente.");
  await cuponModals.cerrarModalExito();

  // Esperar que la página esté lista antes de continuar
  await page.waitForTimeout(1000);
  await page.waitForLoadState("networkidle");

  // Crear segundo cupón QRPago (sin navegar nuevamente)
  await cuponesQrPage.clickAgregarNuevoCuponQRPago();
  await crearCuponPage.completarFormularioQrPago("QR $ GRUPO TEST 2", "Test descripcion QR $ 2", "150", "30", true);
  
  // Subir foto para el segundo cupón
  await crearCuponPage.subirFoto("tests/assets/foto-ejemplo.png");
  
  // Manejar spinner si existe
  await cuponModals.manejarSpinnerSiExiste();
  
  // Manejar modal de foto requerida si aparece
  await cuponModals.manejarModalFotoRequeridaSiAparece();
  
  await crearCuponPage.clickCrearCupon();

  await cuponModals.esperarModalExito("Cupón creado correctamente.");
  await cuponModals.cerrarModalExito();

  // Esperar que la página esté lista antes de continuar
  await page.waitForTimeout(1000);
  await page.waitForLoadState("networkidle");

  // Ir a gestionar grupos
  await cuponesQrPage.clickGestionarGruposQRPago();

  // Click en botón "+" para crear grupo
  const botonMasGrupo = page.locator('.custom-fab.fab-right-bottom > a:not([href])');
  await expect(botonMasGrupo).toBeVisible({ timeout: 5000 });
  await botonMasGrupo.click();

  // Seleccionar cupón "QR $ GRUPO TEST"
  await grupoModal.seleccionarCupon("QR $ GRUPO TEST");

  // Ingresar nombre del grupo y confirmar
  await grupoModal.ingresarNombreGrupo("GRUPO DE CUPONES QRS $");

  // Esperar confirmación
  await grupoModal.esperarModalExito("GRUPO DE CUPONES QRS $");

  // Validar grupo en la lista
  const grupoEnLista = page.locator('.list.accordion-list ul li.accordion-item .item-title', { hasText: "GRUPO DE CUPONES QRS $" });
  await expect(grupoEnLista).toBeVisible({ timeout: 5000 });
}