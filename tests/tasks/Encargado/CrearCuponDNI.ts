import { expect } from '@playwright/test';
import { Encargado } from '../../actors/Encargado';
import { CuponesDniPage } from '../../pages/CuponesDniPage';
import { CrearCuponDniPage } from '../../pages/CrearCuponDniPage';
import { CuponModals } from '../../helpers/CuponModals';
import { GruposCuponesModal } from "../../helpers/gruposcuponesmodals";




export async function crearCuponDni(
  encargado: Encargado,
  nombre: string,
  descripcion: string,
  seleccionarDias = true
) {
  const page = encargado.page;
  const cuponesDniPage = new CuponesDniPage(page);
  const crearCuponPage = new CrearCuponDniPage(page);

  // Navegar a la sección DNI's
  await cuponesDniPage.navegarASeccionDNIs();

  // Click en botón agregar nuevo cupón
  await cuponesDniPage.clickAgregarNuevoCuponDNI();

  // Completar formulario
  await crearCuponPage.completarFormularioDni(nombre, descripcion, seleccionarDias);

  // Click en crear cupón
  await crearCuponPage.clickCrearCupon();
}

export async function crearGrupoCuponesDni(encargado: Encargado) {
  const page = encargado.page;
  const cuponesDniPage = new CuponesDniPage(page);
  const grupoModal = new GruposCuponesModal(page);
  const cuponModals = new CuponModals(page);

  // Navegar a la sección DNI's solo una vez al inicio
  await cuponesDniPage.navegarASeccionDNIs();

  // Crear primer cupón
  await cuponesDniPage.clickAgregarNuevoCuponDNI();
  const crearCuponPage = new CrearCuponDniPage(page);
  await crearCuponPage.completarFormularioDni("DNI GRUPO TEST", "Test descripcion", true);
  await crearCuponPage.clickCrearCupon();

  await cuponModals.esperarModalExito("Cupón creado correctamente.");
  await cuponModals.cerrarModalExito();

  // Esperar que la página esté lista antes de continuar
  await page.waitForTimeout(1000);
  await page.waitForLoadState("networkidle");

  // Crear segundo cupón (sin navegar nuevamente)
  await cuponesDniPage.clickAgregarNuevoCuponDNI();
  await crearCuponPage.completarFormularioDni("DNI GRUPO TEST 2", "Test descripcion", true);
  await crearCuponPage.clickCrearCupon();

  await cuponModals.esperarModalExito("Cupón creado correctamente.");
  await cuponModals.cerrarModalExito();

  // Esperar que la página esté lista antes de continuar
  await page.waitForTimeout(1000);
  await page.waitForLoadState("networkidle");

  // Ir a gestionar grupos
  await cuponesDniPage.clickGestionarGrupos();

  // Click en botón "+" para crear grupo
  const botonMasGrupo = page.locator('.custom-fab.fab-right-bottom > a:not([href])');
  await expect(botonMasGrupo).toBeVisible({ timeout: 5000 });
  await botonMasGrupo.click();

  // Seleccionar cupón "DNI GRUPO TEST"
  await grupoModal.seleccionarCupon("DNI GRUPO TEST");

  // Ingresar nombre del grupo y confirmar
  await grupoModal.ingresarNombreGrupo("GRUPO CUPONES DNI");

  // Esperar confirmación
  await grupoModal.esperarModalExito("GRUPO CUPONES DNI");

  // Validar grupo en la lista
  const grupoEnLista = page.locator('.list.accordion-list ul li.accordion-item .item-title', { hasText: "GRUPO CUPONES DNI" });
  await expect(grupoEnLista).toBeVisible({ timeout: 5000 });
}

export async function crearGrupoCuponesDniPago(encargado: Encargado) {
  const page = encargado.page;
  const cuponesDniPage = new CuponesDniPage(page);
  const grupoModal = new GruposCuponesModal(page);
  const cuponModals = new CuponModals(page);

  // Navegar a la sección DNI's solo una vez al inicio
  await cuponesDniPage.navegarASeccionDNIsPago();

  // Crear primer cupón
  await cuponesDniPage.clickAgregarNuevoCuponDNIPago();
  const crearCuponPage = new CrearCuponDniPage(page);
  await crearCuponPage.completarFormularioDniPago("DNI PAGO GRUPO TEST", "Test descripcion", "20", true);
  await crearCuponPage.clickCrearCupon();

  await cuponModals.esperarModalExito("Cupón creado correctamente.");
  await cuponModals.cerrarModalExito();

  // Esperar que la página esté lista antes de continuar
  await page.waitForTimeout(1000);
  await page.waitForLoadState("networkidle");

  // Crear segundo cupón (sin navegar nuevamente)
  await cuponesDniPage.clickAgregarNuevoCuponDNIPago();
  await crearCuponPage.completarFormularioDniPago("DNI PAGO GRUPO TEST 2", "Test descripcion", "20", true);
  await crearCuponPage.clickCrearCupon();

  await cuponModals.esperarModalExito("Cupón creado correctamente.");
  await cuponModals.cerrarModalExito();

  // Esperar que la página esté lista antes de continuar
  await page.waitForTimeout(1000);
  await page.waitForLoadState("networkidle");

  // Ir a gestionar grupos
  await cuponesDniPage.clickGestionarGruposDniPago();

  // Click en botón "+" para crear grupo
  const botonMasGrupo = page.locator('.custom-fab.fab-right-bottom > a:not([href])');
  await expect(botonMasGrupo).toBeVisible({ timeout: 5000 });
  await botonMasGrupo.click();

  // Seleccionar cupón "DNI GRUPO TEST"
  await grupoModal.seleccionarCupon("DNI PAGO GRUPO TEST");

  // Ingresar nombre del grupo y confirmar
  await grupoModal.ingresarNombreGrupo("GRUPO CUPONES PAGO");

  // Esperar confirmación
  await grupoModal.esperarModalExito("GRUPO CUPONES PAGO");

  // Validar grupo en la lista
  const grupoEnLista = page.locator('.list.accordion-list ul li.accordion-item .item-title', { hasText: "GRUPO CUPONES PAGO" });
  await expect(grupoEnLista).toBeVisible({ timeout: 5000 });
}