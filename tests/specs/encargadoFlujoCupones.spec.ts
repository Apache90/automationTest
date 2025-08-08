import { test, Page } from "@playwright/test"; import { Encargado } from "../actors/Encargado";
import { loginGeneral } from "../tasks/Login";
import { seleccionarRolGeneral } from "../tasks/SeleccionarRol";
import { allure } from "allure-playwright";
import { CuponesDniPage } from "../pages/CuponesDniPage";
import { CrearCuponDniPage } from "../pages/CrearCuponDniPage";
import { CuponModals } from "../helpers/CuponModals";
import { ModificarCuponPage } from "../pages/ModificarCuponPage";
import { CuponesQrPage } from "../pages/CuponesQrPage";
import { CrearCuponQrPage } from "../pages/CrearCuponQrPage";
import { crearCuponDni } from "../tasks/Encargado/CrearCuponDNI";
import { crearCuponDniPago } from "../tasks/Encargado/CrearCuponDNIPago";
import { crearCuponQr } from "../tasks/Encargado/CrearCuponQR";
import { crearCuponQrPago } from "../tasks/Encargado/CrearCuponQRPago";

async function reportTestError(error: any, page: Page, testInfo: string) {
  console.error(`Error en test "${testInfo}":`, error.message);
}

// Hook global para manejar diálogos
test.beforeEach(async ({ page }) => {
  page.on('dialog', async dialog => {
    console.log(`Diálogo inesperado: ${dialog.message()}`);
    await dialog.accept();
  });
});

// Bloque para Gestión de Cupones
test.describe("Gestión de Cupones", () => {
  test.beforeEach(() => {
    allure.epic("Encargado");
    allure.feature("Gestión de Cupones");
  });

  // Subsección de DNIs
  test.describe("DNIs", () => {

    // Configuración para ejecutar pruebas en serie
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.story("Cupones DNI's Free");
    });

    test("Muestra error cuando no se ingresa el nombre del cupón de tipo DNI", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI sin nombre"
      );
      allure.severity("high");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const crearCuponDniPage = new CrearCuponDniPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección DNI's
        await cuponesDniPage.navegarASeccionDNIs();

        // Clic en botón agregar nuevo cupón
        await cuponesDniPage.clickAgregarNuevoCuponDNI();

        // Completar formulario sin nombre
        await crearCuponDniPage.completarFormularioDni("", "TEST DESCRIPCION", true);

        // Intentar crear cupón sin nombre
        await crearCuponDniPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Nombre es requerido");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error cuando no se ingresa el nombre del cupón de tipo DNI");
        throw error;
      }
    });

    test("Muestra error cuando no se selecciona un día para el cupón DNI", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI sin seleccionar un día de la semana"
      );
      allure.severity("normal");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const crearCuponDniPage = new CrearCuponDniPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección DNI's
        await cuponesDniPage.navegarASeccionDNIs();

        // Clic en botón agregar nuevo cupón
        await cuponesDniPage.clickAgregarNuevoCuponDNI();

        // Completar formulario sin seleccionar días
        await crearCuponDniPage.completarFormularioDni("DNI FREE", "Test descripcion", false);

        // Espera un poco antes de hacer clic
        await page.waitForTimeout(500);

        // Intentar crear cupón sin seleccionar días
        await crearCuponDniPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Debe seleccionar algun día para que la limitación funcione");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de día en DNI");
        throw error;
      }
    });

    test("Puede crear un nuevo cupón DNI y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda crear un nuevo cupón DNI gratuito y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Crear cupón DNI
        await crearCuponDni(encargado, "DNI FREE", "TEST DESCRIPCION", true);

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón creado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al crear cupón DNI");
        throw error;
      }
    });


    test("Puede editar un cupón DNI y ver confirmación", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda editar un cupón DNI existente y recibir confirmación de la modificación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const modificarCuponPage = new ModificarCuponPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a DNI's
        await cuponesDniPage.navegarASeccionDNIs();

        // Buscar el cupón por su nombre
        const cupon = await cuponesDniPage.buscarCuponPorNombre("DNI FREE");

        // Click en editar
        await cuponesDniPage.clickEditarCupon(cupon, "DNI");

        // Espera un poco antes de hacer clic
        await page.waitForTimeout(500);

        // Modificar el nombre
        await modificarCuponPage.modificarNombre("DNI FREE 2");

        // Click en modificar cupón
        await modificarCuponPage.clickModificarCupon();

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón modificado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al editar cupón DNI");
        throw error;
      }
    });



    test("Puede eliminar un cupón DNI y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda eliminar un cupón DNI existente y recibir confirmación de la eliminación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a DNI's
        await cuponesDniPage.navegarASeccionDNIs();

        // Buscar el cupón por su nombre
        const cupon = await cuponesDniPage.buscarCuponPorNombre("DNI FREE 2");

        // Click en eliminar
        await cuponesDniPage.clickEliminarCupon(cupon);

        // Confirmar eliminación
        await cuponModals.confirmarEliminacion();

        // Verificar confirmación
        await cuponModals.esperarModalEliminacionExitosa();
        await cuponModals.cerrarModalExito();

        // Verificar que el cupón ha sido eliminado
        await cuponesDniPage.verificarCuponEliminado("DNI FREE 2");
      } catch (error) {
        await reportTestError(error, page, "Error al eliminar cupón DNI");
        throw error;
      }
    });
  });

  // Subsección de DNI's Pago
  test.describe("DNIsPago", () => {
    // Configuración para ejecutar pruebas en serie
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.story("Cupones DNIsPago");
    });

    test("Muestra error cuando no se ingresa el nombre del cupón de pago", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI Pago sin nombre"
      );
      allure.severity("high");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const crearCuponDniPage = new CrearCuponDniPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección DNI's Pago
        await cuponesDniPage.navegarASeccionDNIsPago();

        // Clic en botón agregar nuevo cupón
        await cuponesDniPage.clickAgregarNuevoCuponDNIPago();

        // Completar formulario sin nombre
        await crearCuponDniPage.completarFormularioDniPago("", "Test descripcion", "20", true);

        // Intentar crear cupón sin nombre
        await crearCuponDniPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Nombre es requerido");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de nombre en DNI Pago");
        throw error;
      }
    });

    test("Muestra error cuando no se selecciona un día para el cupón de pago", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI Pago sin seleccionar un día de la semana"
      );
      allure.severity("normal");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const crearCuponDniPage = new CrearCuponDniPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección DNI's Pago
        await cuponesDniPage.navegarASeccionDNIsPago();

        // Clic en botón agregar nuevo cupón
        await cuponesDniPage.clickAgregarNuevoCuponDNIPago();

        // Completar formulario sin seleccionar días
        await crearCuponDniPage.completarFormularioDniPago("DNI $", "Test descripcion", "20", false);

        // Espera un poco antes de hacer clic
        await page.waitForTimeout(500);

        // Intentar crear cupón sin seleccionar días
        await crearCuponDniPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Debe seleccionar algun día para que la limitación funcione");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de día en DNI Pago");
        throw error;
      }
    });

    test("Muestra error cuando no se ingresa un precio para el cupón de pago", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI Pago sin precio o con precio cero"
      );
      allure.severity("high");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const crearCuponDniPage = new CrearCuponDniPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección DNI's Pago
        await cuponesDniPage.navegarASeccionDNIsPago();

        // Clic en botón agregar nuevo cupón
        await cuponesDniPage.clickAgregarNuevoCuponDNIPago();

        // Completar formulario con precio 0
        await crearCuponDniPage.completarFormularioDniPago("DNI $", "Test descripcion", "0", true);

        // Espera un poco antes de hacer clic
        await page.waitForTimeout(500);

        // Intentar crear cupón con precio 0
        await crearCuponDniPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("El precio debe ser mayor a 0");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de precio en DNI Pago");
        throw error;
      }
    });

    test("Puede crear un nuevo cupón DNI Pago y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda crear un nuevo cupón DNI Pago y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Crear cupón DNI Pago
        await crearCuponDniPago(encargado, "DNI $", "Test descripcion", "20", true);

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón creado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al crear cupón DNI Pago");
        throw error;
      }
    });

    test("Puede editar un cupón DNI Pago y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda editar un cupón DNI Pago existente y recibir confirmación de la modificación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const modificarCuponPage = new ModificarCuponPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a DNI's Pago
        await cuponesDniPage.navegarASeccionDNIsPago();

        // Buscar el cupón por su nombre
        const cupon = await cuponesDniPage.buscarCuponPorNombre("DNI $");

        // Click en editar
        await cuponesDniPage.clickEditarCupon(cupon, "Pago_DNI");

        // Modificar el nombre y precio
        await modificarCuponPage.modificarNombre("DNI $ 2");
        await modificarCuponPage.modificarPrecio("25");

        // Click en modificar cupón
        await modificarCuponPage.clickModificarCupon();

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón modificado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al editar cupón DNI Pago");
        throw error;
      }
    });

    test("Puede eliminar un cupón DNI Pago y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda eliminar un cupón DNI Pago existente y recibir confirmación de la eliminación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesDniPage = new CuponesDniPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a DNI's Pago
        await cuponesDniPage.navegarASeccionDNIsPago();

        // Buscar el cupón por su nombre
        const cupon = await cuponesDniPage.buscarCuponPorNombre("DNI $ 2");

        // Click en eliminar
        await cuponesDniPage.clickEliminarCupon(cupon);

        // Confirmar eliminación
        await cuponModals.confirmarEliminacion();

        // Verificar confirmación
        await cuponModals.esperarModalEliminacionExitosa();
        await cuponModals.cerrarModalExito();

        // Verificar que el cupón ha sido eliminado
        await cuponesDniPage.verificarCuponEliminado("DNI $ 2");
      } catch (error) {
        await reportTestError(error, page, "Error al eliminar cupón DNI Pago");
        throw error;
      }
    });
  });

  // Subsección de QR's
  test.describe("QR's", () => {

    // Configuración para ejecutar pruebas en serie
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.story("Cupones QR's Consumibles y Virales");
    });

    test("Muestra error cuando no se ingresa el nombre del cupón QR", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón QR sin nombre"
      );
      allure.severity("high");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const crearCuponQrPage = new CrearCuponQrPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección QR's
        await cuponesQrPage.navegarASeccionQRs();

        // Clic en botón agregar nuevo cupón
        await cuponesQrPage.clickAgregarNuevoCuponQR();

        // Completar formulario sin nombre
        await crearCuponQrPage.completarFormularioQr("", "Test describe", true);

        // Subir foto
        await crearCuponQrPage.subirFoto("tests/assets/foto-ejemplo.png");

        // Manejar spinner si existe
        await cuponModals.manejarSpinnerSiExiste();

        // Manejar modal de foto requerida si aparece
        await cuponModals.manejarModalFotoRequeridaSiAparece();

        // Intentar crear cupón sin nombre
        await crearCuponQrPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Nombre es requerido");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de nombre en QR");
        throw error;
      }
    });

    test("Muestra error cuando no se selecciona un día para el cupón QR", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón QR sin seleccionar un día de la semana"
      );
      allure.severity("normal");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const crearCuponQrPage = new CrearCuponQrPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección QR's
        await cuponesQrPage.navegarASeccionQRs();

        // Clic en botón agregar nuevo cupón
        await cuponesQrPage.clickAgregarNuevoCuponQR();

        // Completar formulario sin seleccionar días
        await crearCuponQrPage.completarFormularioQr("QR CONSUMIBLE", "Test describe", false);

        // Subir foto
        await crearCuponQrPage.subirFoto("tests/assets/foto-ejemplo.png");

        // Manejar spinner si existe
        await cuponModals.manejarSpinnerSiExiste();

        // Manejar modal de foto requerida si aparece
        await cuponModals.manejarModalFotoRequeridaSiAparece();

        // Intentar crear cupón sin seleccionar días
        await crearCuponQrPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Debe seleccionar algun día para que la limitación funcione");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de día en QR");
        throw error;
      }
    });

    test("Puede crear un nuevo cupón QR y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda crear un nuevo cupón QR y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Crear cupón QR
        await crearCuponQr(
          encargado,
          "QR CONSUMIBLE",
          "Test describe",
          "tests/assets/foto-ejemplo.png"
        );

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón creado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al crear cupón QR");
        throw error;
      }
    });

    test("Puede editar un cupón QR y ver confirmación", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda editar un cupón QR existente y recibir confirmación de la modificación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const modificarCuponPage = new ModificarCuponPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a QR's
        await cuponesQrPage.navegarASeccionQRs();

        // Buscar el cupón por su nombre
        const cupon = await cuponesQrPage.buscarCuponPorNombre("QR CONSUMIBLE");

        // Click en editar
        await cuponesQrPage.clickEditarCupon(cupon);

        // Modificar el nombre
        await modificarCuponPage.modificarNombre("QR CONSUMIBLE EDIT");

        // Click en modificar cupón
        await modificarCuponPage.clickModificarCupon();

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón modificado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al editar cupón QR");
        throw error;
      }
    });

    test("Puede eliminar un cupón QR y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda eliminar un cupón QR existente y recibir confirmación de la eliminación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a QR's
        await cuponesQrPage.navegarASeccionQRs();

        // Buscar el cupón por su nombre
        const cupon = await cuponesQrPage.buscarCuponPorNombre("QR CONSUMIBLE EDIT");

        // Click en eliminar
        await cuponesQrPage.clickEliminarCupon(cupon);

        // Confirmar eliminación
        await cuponModals.confirmarEliminacion();

        // Verificar confirmación
        await cuponModals.esperarModalEliminacionExitosa();
        await cuponModals.cerrarModalExito();

        // Verificar que el cupón ha sido eliminado
        await cuponesQrPage.verificarCuponEliminado("QR CONSUMIBLE EDIT");
      } catch (error) {
        await reportTestError(error, page, "Error al eliminar cupón QR");
        throw error;
      }
    });
  });

  // Subsección de QR's Pago
  test.describe("QR's Pago", () => {

    // Configuración para ejecutar pruebas en serie
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.story("Cupones QR's Pago");
    });

    test("Muestra error cuando no se ingresa el nombre del cupón QR Pago", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón QR Pago sin nombre"
      );
      allure.severity("high");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const crearCuponQrPage = new CrearCuponQrPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección QR's Pago
        await cuponesQrPage.navegarASeccionQRsPago();

        // Clic en botón agregar nuevo cupón
        await cuponesQrPage.clickAgregarNuevoCuponQRPago();

        // Completar formulario sin nombre
        await crearCuponQrPage.completarFormularioQrPago("", "Test describe", "20", "5", true);

        // Subir foto
        await crearCuponQrPage.subirFoto("tests/assets/foto-ejemplo.png");

        // Manejar spinner si existe
        await cuponModals.manejarSpinnerSiExiste();

        // Manejar modal de foto requerida si aparece
        await cuponModals.manejarModalFotoRequeridaSiAparece();

        // Intentar crear cupón sin nombre
        await crearCuponQrPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Nombre es requerido");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de nombre en QR Pago");
        throw error;
      }
    });

    test("Muestra error cuando no se selecciona un día para el cupón QR Pago", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón QR Pago sin seleccionar un día"
      );
      allure.severity("normal");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const crearCuponQrPage = new CrearCuponQrPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección QR's Pago
        await cuponesQrPage.navegarASeccionQRsPago();

        // Clic en botón agregar nuevo cupón
        await cuponesQrPage.clickAgregarNuevoCuponQRPago();

        // Completar formulario sin seleccionar días
        await crearCuponQrPage.completarFormularioQrPago("QR'S PAGO $", "Test describe", "20", "5", false);

        // Subir foto
        await crearCuponQrPage.subirFoto("tests/assets/foto-ejemplo.png");

        // Manejar spinner si existe
        await cuponModals.manejarSpinnerSiExiste();

        // Manejar modal de foto requerida si aparece
        await cuponModals.manejarModalFotoRequeridaSiAparece();

        // Intentar crear cupón sin seleccionar días
        await crearCuponQrPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("Debe seleccionar algun día para que la limitación funcione");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de día en QR Pago");
        throw error;
      }
    });

    test("Muestra error cuando no se ingresa un precio para el cupón QR Pago", async ({
      page,
    }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón QR Pago sin precio o con precio cero"
      );
      allure.severity("high");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const crearCuponQrPage = new CrearCuponQrPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a sección QR's Pago
        await cuponesQrPage.navegarASeccionQRsPago();

        // Clic en botón agregar nuevo cupón
        await cuponesQrPage.clickAgregarNuevoCuponQRPago();

        // Completar formulario con precio 0
        await crearCuponQrPage.completarFormularioQrPago("QR'S PAGO $", "Test describe", "0", "5", true);

        // Subir foto
        await crearCuponQrPage.subirFoto("tests/assets/foto-ejemplo.png");

        // Manejar spinner si existe
        await cuponModals.manejarSpinnerSiExiste();

        // Manejar modal de foto requerida si aparece
        await cuponModals.manejarModalFotoRequeridaSiAparece();

        // Intentar crear cupón con precio 0
        await crearCuponQrPage.clickCrearCupon();

        // Verificar error
        await cuponModals.esperarModalError("El precio debe ser mayor a 0");
        await cuponModals.cerrarModalError();
      } catch (error) {
        await reportTestError(error, page, "Error en test de validación de precio en QR Pago");
        throw error;
      }
    });

    test("Puede crear un nuevo cupón QR Pago y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda crear un nuevo cupón QR Pago y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Crear cupón QR Pago
        await crearCuponQrPago(
          encargado,
          "QR'S PAGO $",
          "Test describe",
          "20",
          "5",
          "tests/assets/foto-ejemplo.png"
        );

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón creado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al crear cupón QR Pago");
        throw error;
      }
    });

    test("Puede editar un cupón QR Pago y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda editar un cupón QR Pago existente y recibir confirmación de la modificación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const modificarCuponPage = new ModificarCuponPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a QR's Pago
        await cuponesQrPage.navegarASeccionQRsPago();

        // Buscar el cupón por su nombre
        const cupon = await cuponesQrPage.buscarCuponPorNombre("QR'S PAGO $");

        // Click en editar
        await cuponesQrPage.clickEditarCupon(cupon);

        // Modificar el nombre
        await modificarCuponPage.modificarNombre("QR'S PAGO EDIT");

        // Click en modificar cupón
        await modificarCuponPage.clickModificarCupon();

        // Verificar confirmación
        await cuponModals.esperarModalExito("Cupón modificado correctamente.");
        await cuponModals.cerrarModalExito();
      } catch (error) {
        await reportTestError(error, page, "Error al editar cupón QR Pago");
        throw error;
      }
    });

    test("Puede eliminar un cupón QR Pago y ver confirmación", async ({
      page,
    }) => {
      allure.description(
        "Verifica que un encargado pueda eliminar un cupón QR Pago existente y recibir confirmación de la eliminación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const cuponesQrPage = new CuponesQrPage(page);
      const cuponModals = new CuponModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Navegar a QR's Pago
        await cuponesQrPage.navegarASeccionQRsPago();

        // Buscar el cupón por su nombre
        const cupon = await cuponesQrPage.buscarCuponPorNombre("QR'S PAGO EDIT");

        // Click en eliminar
        await cuponesQrPage.clickEliminarCupon(cupon);

        // Confirmar eliminación
        await cuponModals.confirmarEliminacion();

        // Verificar confirmación
        await cuponModals.esperarModalEliminacionExitosa();
        await cuponModals.cerrarModalExito();

        // Verificar que el cupón ha sido eliminado
        await cuponesQrPage.verificarCuponEliminado("QR'S PAGO EDIT");
      } catch (error) {
        await reportTestError(error, page, "Error al eliminar cupón QR Pago");
        throw error;
      }
    });
  });
  
});