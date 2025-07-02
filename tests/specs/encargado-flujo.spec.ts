import { test, expect } from "@playwright/test";
import { Encargado } from "../actors/Encargado";
import { loginGeneral } from "../tasks/Login";
import { seleccionarRolGeneral } from "../tasks/SeleccionarRol";
import { verBienvenidaGeneral } from "../questions/VerBienvenida";
import { agregarNuevoVendedor } from "../tasks/Encargado/AgregarNuevoVendedor";
import { agregarNuevoCanjeador } from "../tasks/Encargado/AgregarNuevoCanjeador";
import { agregarNuevoSupervisor } from "../tasks/Encargado/AgregarNuevoSupervisor";
import { VendedorModal } from "../helpers/vendedormodals";
import { CanjeadorModal } from "../helpers/canjeadormodals";
import { SupervisorModal } from "../helpers/supervisormodals";
import { EliminarVendedorPorEmail } from "../tasks/Encargado/EliminarVendedorPorEmail";
import { EliminarCanjeadorPorEmail } from "../tasks/Encargado/EliminarCanjeadorPorEmail";
import { EliminarSupervisorPorEmail } from "../tasks/Encargado/EliminarSupervisorPorEmail";
import { allure } from "allure-playwright";

test.describe.configure({ mode: "serial" });

// Bloque principal
test.describe("Flujo de Encargado", () => {
  test.beforeEach(() => {
    // Epic principal definido una sola vez
    allure.epic("Encargado");
  });

  test("El Encargado puede iniciar sesión y ver su bienvenida", async ({
    page,
  }) => {
    allure.feature("Autenticación");
    allure.story("Inicio de Sesión");
    allure.description(
      "Verifica que un encargado pueda iniciar sesión correctamente y ver su mensaje de bienvenida personalizado"
    );
    allure.severity("blocker");

    const encargado = new Encargado(page);

    await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
    await seleccionarRolGeneral(encargado);
    await verBienvenidaGeneral(
      encargado.page,
      "h1.bienvenido-principal",
      "TEST [SOLO EMIR]"
    );
  });

  // Gestión de Roles
  test.describe("Gestión de Roles", () => {
    test.beforeEach(() => {
      allure.feature("Gestión de Roles");
    });

    // Subsección de Vendedores
    test.describe("Gestión de Vendedores", () => {
      test.beforeEach(() => {
        allure.story("Gestión de Vendedores");
      });

      const email = "vendedor1@gmail.com";

      test("Puede agregar un nuevo vendedor y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda agregar un nuevo vendedor al sistema y recibir confirmación de éxito"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new VendedorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);
        await agregarNuevoVendedor(encargado, email);

        // Espera y cierra el modal de éxito usando el helper
        await modal.esperarModalExito();
        await modal.cerrarModalExito();

        // Verificar si el email aparece en la lista
        const emailEnLista = page.locator(
          `.item-content span:text("${email}")`
        );
        await expect(emailEnLista).toBeVisible({ timeout: 5000 });
      });

      test("Muestra mensaje si el vendedor ya posee el rol indicado", async ({
        page,
      }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta agregar un vendedor con rol ya existente"
        );
        allure.severity("normal");

        const encargado = new Encargado(page);
        const modal = new VendedorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Click en sección "Vendedores"
        const seccionVendedores = page.locator("label.svelte-1x3l73x", {
          hasText: "Vendedores",
        });
        await seccionVendedores.click();

        // Click en botón "+"
        const botonAgregar = page.locator(".custom-fab a .btn-menuSeller");
        await botonAgregar.click();

        // Completar y confirmar en modal
        await modal.completarEmailYConfirmar(email);

        // Usar el helper para esperar y cerrar el modal de error
        await modal.esperarModalError("El usuario ya posee el rol indicado.");
        await modal.cerrarModalError();
      });

      test("Puede eliminar un vendedor existente y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda eliminar un vendedor existente y recibir confirmación de la operación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new VendedorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Click en sección "Vendedores"
        const seccionVendedores = page.locator("label.svelte-1x3l73x", {
          hasText: "Vendedores",
        });
        await seccionVendedores.click();

        // Eliminar vendedor por email
        await EliminarVendedorPorEmail(encargado, email);

        // Confirmar en el modal de eliminación
        await modal.confirmarEliminacionVendedor();

        // Esperar y cerrar el modal de éxito
        await modal.esperarModalEliminacionExitosa();

        // Verificar que el email ya no está en la lista
        const emailEnLista = page.locator(".item-footer span", {
          hasText: email,
        });
        await expect(emailEnLista).toHaveCount(0);
      });
    });

    // Subsección de Canjeadores
    test.describe("Gestión de Canjeadores", () => {
      test.beforeEach(() => {
        allure.story("Gestión de Canjeadores");
      });

      const email = "canjeador1@gmail.com";

      test("Puede agregar un nuevo canjeador y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda agregar un nuevo canjeador al sistema y recibir confirmación de éxito"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new CanjeadorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);
        await agregarNuevoCanjeador(encargado, email);

        // Espera y cierra el modal de éxito usando el helper
        await modal.esperarModalExito();
        await modal.cerrarModalExito();

        // Verificar si el email aparece en la lista
        const emailEnLista = page.locator(
          `.item-content span:text("${email}")`
        );
        await expect(emailEnLista).toBeVisible({ timeout: 5000 });
      });

      test("Muestra mensaje si el canjeador ya posee el rol indicado", async ({
        page,
      }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta agregar un canjeador con rol ya existente"
        );
        allure.severity("normal");

        const encargado = new Encargado(page);
        const modal = new CanjeadorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Click en sección "Canjeadores"
        const seccionCanjeadores = page.locator("label.svelte-1x3l73x", {
          hasText: "Canjeadores",
        });
        await seccionCanjeadores.click();

        // Click en botón "+"
        const botonAgregar = page.locator(".custom-fab a .btn-menuSeller");
        await botonAgregar.click();

        // Completar y confirmar en modal
        await modal.completarEmailYConfirmar(email);

        // Usar el helper para esperar y cerrar el modal de error
        await modal.esperarModalError("El usuario ya posee el rol indicado.");
        await modal.cerrarModalError();
      });

      test("Puede eliminar un canjeador existente y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda eliminar un canjeador existente y recibir confirmación de la operación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new CanjeadorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Click en sección "Canjeadores"
        const seccionCanjeadores = page.locator("label.svelte-1x3l73x", {
          hasText: "Canjeadores",
        });
        await seccionCanjeadores.click();

        // Eliminar canjeador por email
        await EliminarCanjeadorPorEmail(encargado, email);

        // Confirmar en el modal de eliminación
        await modal.confirmarEliminacionCanjeador();

        // Esperar y cerrar el modal de éxito
        await modal.esperarModalEliminacionExitosa();

        // Verificar que el email ya no está en la lista
        const emailEnLista = page.locator(".item-footer span", {
          hasText: email,
        });
        await expect(emailEnLista).toHaveCount(0);
      });
    });

    // Subsección de Supervisores
    test.describe("Gestión de Supervisores", () => {
      test.beforeEach(() => {
        allure.story("Gestión de Supervisores");
      });

      const email = "supervisor1@gmail.com";

      test("Puede agregar un nuevo supervisor y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda agregar un nuevo supervisor al sistema y recibir confirmación de éxito"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new SupervisorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);
        await agregarNuevoSupervisor(encargado, email);

        // Espera y cierra el modal de éxito usando el helper
        await modal.esperarModalExito();
        await modal.cerrarModalExito();

        // Verificar si el email aparece en la lista
        const emailEnLista = page.locator(
          `.item-content span:text("${email}")`
        );
        await expect(emailEnLista).toBeVisible({ timeout: 5000 });
      });

      test("Muestra mensaje si el supervisor ya posee el rol indicado", async ({
        page,
      }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta agregar un supervisor con rol ya existente"
        );
        allure.severity("normal");

        const encargado = new Encargado(page);
        const modal = new SupervisorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Click en sección "Supervisores"
        const seccionSupervisores = page.locator("label.svelte-1x3l73x", {
          hasText: "Supervisores",
        });
        await seccionSupervisores.click();

        // Click en botón "+"
        const botonAgregar = page.locator(".custom-fab a .btn-menuSeller");
        await botonAgregar.click();

        // Completar y confirmar en modal
        await modal.completarEmailYConfirmar(email);

        // Usar el helper para esperar y cerrar el modal de error
        await modal.esperarModalError("El usuario ya posee el rol indicado.");
        await modal.cerrarModalError();
      });

      test("Puede eliminar un supervisor existente y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda eliminar un supervisor existente y recibir confirmación de la operación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new SupervisorModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Click en sección "Supervisores"
        const seccionSupervisores = page.locator("label.svelte-1x3l73x", {
          hasText: "Supervisores",
        });
        await seccionSupervisores.click();

        // Eliminar supervisor por email
        await EliminarSupervisorPorEmail(encargado, email);

        // Confirmar en el modal de eliminación
        await modal.confirmarEliminacionSupervisor();

        // Esperar y cerrar el modal de éxito
        await modal.esperarModalEliminacionExitosa();

        // Verificar que el email ya no está en la lista
        const emailEnLista = page.locator(".item-footer span", {
          hasText: email,
        });
        await expect(emailEnLista).toHaveCount(0);
      });
    });
  });

  // Gestión de Cupones
  test.describe("Gestión de Cupones", () => {
    test.beforeEach(() => {
      allure.feature("Gestión de Cupones");
    });

    // Subsección de DNI's
    test.describe("DNI's", () => {
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

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's
        const seccionDNIs = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/DNI"]'
        );
        await seccionDNIs.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/DNI");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocupondni/DNI"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocupondni/DNI");

        // NO completar el nombre, solo descripción
        const descripcionInput = page.locator(
          'input[name="descripcion"][placeholder="Descripcion"]'
        );
        await descripcionInput.fill("TEST DESCRIBE");

        // Seleccionar icono
        const smartSelect = page.locator("a.item-link.smart-select");
        await smartSelect.click();

        const iconoRayo = page.locator(
          'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
        );
        await iconoRayo.click();

        // Cerrar el modal del selector de iconos
        const closeButton = page.locator(
          "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
        );
        await closeButton.click();

        // Seleccionar todos los días de la semana
        const diasSemana = page.locator(".block .button");
        const count = await diasSemana.count();
        for (let i = 0; i < count; i++) {
          await diasSemana.nth(i).click();
        }

        // Intentar crear cupón sin nombre
        const crearCuponBtn = page.locator("a.button.button-fill", {
          hasText: "CREAR CUPÓN",
        });
        await crearCuponBtn.click({ force: true });

        // Verificar el modal de error
        const modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalError).toBeVisible({ timeout: 10000 });
        await expect(modalError.locator(".dialog-text")).toContainText(
          "Nombre es requerido"
        );

        // Cerrar el modal de error
        await modalError
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
      });

      test("Muestra error cuando no se selecciona un día para el cupón DNI", async ({
        page,
      }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI sin seleccionar un día de la semana"
        );
        allure.severity("normal");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's (no pago)
        const seccionDNIs = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/DNI"]'
        );
        await seccionDNIs.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/DNI");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocupondni/DNI"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocupondni/DNI");

        // Completar nombre y descripción
        await page
          .locator('input[name="nombre"][placeholder="Nombre"]')
          .fill("DNI FREE");
        await page
          .locator('input[name="descripcion"][placeholder="Descripcion"]')
          .fill("Test description");

        // Seleccionar icono
        const smartSelect = page.locator("a.item-link.smart-select");
        await smartSelect.click();
        const iconoRayo = page.locator(
          'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
        );
        await iconoRayo.click();

        // Cerrar el modal del selector de iconos
        const closeButton = page.locator(
          "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
        );
        await closeButton.click();

        // Esperar un momento para asegurar que todos los elementos estén cargados
        await page.waitForTimeout(500);

        // Intentar crear cupón sin seleccionar días
        const crearCuponBtn = page.getByRole("link", { name: "CREAR CUPÓN" });
        await crearCuponBtn.scrollIntoViewIfNeeded();

        // Capturar diálogos que puedan aparecer
        page.once("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          await dialog.accept();
        });

        // Usar JavaScript para hacer clic directamente en el DOM
        await page.evaluate(() => {
          const buttons = Array.from(
            document.querySelectorAll<HTMLAnchorElement>("a.button.button-fill")
          );
          const createButton = buttons.find((btn) =>
            btn.textContent?.includes("CREAR CUPÓN")
          );
          if (createButton) createButton.click();
        });

        // Esperar para ver si aparece el modal
        const modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalError).toBeVisible({ timeout: 5000 });

        // Si llegamos aquí, el modal apareció, verificar el contenido
        await expect(modalError.locator(".dialog-text")).toContainText(
          "Debe seleccionar algun día para que la limitación funcione"
        );

        // Cerrar el modal
        await modalError
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
      });

      test("Puede crear un nuevo cupón DNI y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda crear un nuevo cupón DNI gratuito y recibir confirmación de éxito"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's
        const seccionDNIs = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/DNI"]'
        );
        await seccionDNIs.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/DNI");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocupondni/DNI"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocupondni/DNI");

        // Completar formulario de cupón
        await page
          .locator('input[name="nombre"][placeholder="Nombre"]')
          .fill("DNI FREE");
        await page
          .locator('input[name="descripcion"][placeholder="Descripcion"]')
          .fill("TEST DESCRIBE");

        // Seleccionar icono
        await page.locator("a.item-link.smart-select").click();
        await page
          .locator(
            'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
          )
          .click();
        await page
          .locator(
            "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
          )
          .click();

        // Seleccionar todos los días de la semana
        const diasSemana = page.locator(".block .button");
        const count = await diasSemana.count();
        for (let i = 0; i < count; i++) {
          await diasSemana.nth(i).click();
        }

        // Click en crear cupón
        const crearCuponBtn = page.locator("a.button.button-fill", {
          hasText: "CREAR CUPÓN",
        });
        await crearCuponBtn.click({ force: true });

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 10000 });
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón creado correctamente."
        );
        await modalExito
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
        await expect(modalExito).not.toBeVisible({ timeout: 5000 });
      });

      test("Puede editar un cupón DNI y ver confirmación", async ({ page }) => {
        allure.description(
          "Verifica que un encargado pueda editar un cupón DNI existente y recibir confirmación de la modificación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's
        const seccionDNIs = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/DNI"]'
        );
        await seccionDNIs.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/DNI");

        // Identificar el cupón por su nombre y hacer clic en editar
        const cupon = page
          .locator(".grid-container .item-header", { hasText: "DNI FREE" })
          .locator('xpath=ancestor::div[contains(@class, "grid-container")]');
        await expect(cupon).toBeVisible({ timeout: 5000 });
        await cupon
          .locator('a[href^="/manager/71/modificarcupondni/DNI/"] i.fa-pencil')
          .click();

        // Modificar el cupón
        await page.waitForURL("**/manager/71/modificarcupondni/DNI/**");
        await page.locator('input[name="nombre"]').fill("DNI FREE 2");
        await page
          .locator("a.button.button-fill", { hasText: "Modificar Cupón" })
          .click();

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 10000 });
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón modificado correctamente."
        );
        await modalExito
          .locator("span.dialog-button", { hasText: "OK" })
          .click();

        // Verificar redirección
        await expect(page).toHaveURL(
          "https://doorsticketsdev.com/#!/manager/71/cuponesdni/DNI",
          { timeout: 5000 }
        );
      });

      test("Puede eliminar un cupón DNI y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda eliminar un cupón DNI existente y recibir confirmación de la eliminación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's
        const seccionDNIs = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/DNI"]'
        );
        await seccionDNIs.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/DNI");

        // Identificar el cupón por su nombre y eliminarlo
        const cupon = page
          .locator(".grid-container .item-header", { hasText: "DNI FREE 2" })
          .locator('xpath=ancestor::div[contains(@class, "grid-container")]');
        await expect(cupon).toBeVisible({ timeout: 5000 });
        const botonEliminar = cupon.locator("i.fa-trash div a.button");
        await botonEliminar.click();

        // Confirmar eliminación
        const modalConfirmacion = page.locator(".dialog.modal-in");
        await expect(modalConfirmacion).toBeVisible({ timeout: 5000 });
        await expect(modalConfirmacion).toContainText(
          "¿Estás seguro que deseas eliminar esta lista?"
        );
        const botonConfirmar = modalConfirmacion.locator("span.dialog-button", {
          hasText: "Confirmar",
        });
        await botonConfirmar.click();

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 5000 });
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón eliminado con éxito"
        );
        const botonOK = modalExito.locator("span.dialog-button", {
          hasText: "OK",
        });
        await botonOK.click();

        // Verificar que el cupón ha sido eliminado
        const cuponEliminado = page.locator(".grid-container .item-header", {
          hasText: "DNI FREE 2",
        });
        await expect(cuponEliminado).toHaveCount(0, { timeout: 5000 });

        // Verificar el mensaje "No hay cupones disponibles"
        const mensajeSinCupones = page.locator("p", {
          hasText: "No hay cupones disponibles.",
        });
        await expect(mensajeSinCupones).toBeVisible();
        await expect(mensajeSinCupones).toHaveText(
          "No hay cupones disponibles."
        );
      });
    });

    // Subsección de DNI's Pago
    test.describe("DNI's Pago", () => {
      test.beforeEach(() => {
        allure.story("Cupones DNI's Pago");
      });

      test("Muestra error cuando no se ingresa el nombre del cupón de pago", async ({
        page,
      }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI Pago sin nombre"
        );
        allure.severity("high");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's Pago
        const seccionDNIsPago = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/Pago_DNI"]'
        );
        await seccionDNIsPago.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/Pago_DNI");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocupondni/Pago_DNI"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocupondni/Pago_DNI");

        // NO completar el nombre, solo descripción y precio
        const descripcionInput = page.locator(
          'input[name="descripcion"][placeholder="Descripcion"]'
        );
        await descripcionInput.fill("Test description");

        // Ingresar precio
        const precioInput = page.locator('input[name="precio"]');
        await precioInput.fill("20");

        // Seleccionar icono
        const smartSelect = page.locator("a.item-link.smart-select");
        await smartSelect.click();

        const iconoRayo = page.locator(
          'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
        );
        await iconoRayo.click();

        // Cerrar el modal del selector de iconos
        const closeButton = page.locator(
          "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
        );
        await closeButton.click();

        // Seleccionar todos los días de la semana
        const diasSemana = page.locator(".block .button");
        const count = await diasSemana.count();
        for (let i = 0; i < count; i++) {
          await diasSemana.nth(i).click();
        }

        // Intentar crear cupón sin nombre
        const crearCuponBtn = page.locator("a.button.button-fill", {
          hasText: "CREAR CUPÓN",
        });
        await crearCuponBtn.click({ force: true });

        // Verificar el modal de error
        const modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalError).toBeVisible({ timeout: 10000 });
        await expect(modalError.locator(".dialog-text")).toContainText(
          "Nombre es requerido"
        );

        // Cerrar el modal de error
        await modalError
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
      });

      test("Muestra error cuando no se selecciona un día para el cupón de pago", async ({
        page,
      }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI Pago sin seleccionar un día de la semana"
        );
        allure.severity("normal");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's Pago
        const seccionDNIsPago = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/Pago_DNI"]'
        );
        await seccionDNIsPago.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/Pago_DNI");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocupondni/Pago_DNI"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocupondni/Pago_DNI");

        // Completar nombre y descripción
        await page
          .locator('input[name="nombre"][placeholder="Nombre"]')
          .fill("DNI $");
        await page
          .locator('input[name="descripcion"][placeholder="Descripcion"]')
          .fill("Test description");

        // Seleccionar icono
        const smartSelect = page.locator("a.item-link.smart-select");
        await smartSelect.click();
        const iconoRayo = page.locator(
          'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
        );
        await iconoRayo.click();

        // Cerrar el modal del selector de iconos
        const closeButton = page.locator(
          "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
        );
        await closeButton.click();

        // Ingresar precio
        const precioInput = page.locator('input[name="precio"]');
        await precioInput.fill("20");

        // Esperar un momento para asegurar que todos los elementos estén cargados
        await page.waitForTimeout(500);

        // Intentar crear cupón sin seleccionar días
        const crearCuponBtn = page.getByRole("link", { name: "CREAR CUPÓN" });
        await crearCuponBtn.scrollIntoViewIfNeeded();

        // Capturar diálogos que puedan aparecer
        page.once("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          await dialog.accept();
        });

        // Usar JavaScript para hacer clic directamente en el DOM
        await page.evaluate(() => {
          const buttons = Array.from(
            document.querySelectorAll<HTMLAnchorElement>("a.button.button-fill")
          );
          const createButton = buttons.find((btn) =>
            btn.textContent?.includes("CREAR CUPÓN")
          );
          if (createButton) createButton.click();
        });

        // Esperar para ver si aparece el modal
        const modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalError).toBeVisible({ timeout: 5000 });

        // Si llegamos aquí, el modal apareció, verificar el contenido
        await expect(modalError.locator(".dialog-text")).toContainText(
          "Debe seleccionar algun día para que la limitación funcione"
        );

        // Cerrar el modal
        await modalError
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
      });

      test("Muestra error cuando no se ingresa un precio para el cupón de pago", async ({
        page,
      }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón DNI Pago sin precio o con precio cero"
        );
        allure.severity("high");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's Pago
        const seccionDNIsPago = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/Pago_DNI"]'
        );
        await seccionDNIsPago.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/Pago_DNI");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocupondni/Pago_DNI"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocupondni/Pago_DNI");

        // Completar nombre y descripción
        await page
          .locator('input[name="nombre"][placeholder="Nombre"]')
          .fill("DNI $");
        await page
          .locator('input[name="descripcion"][placeholder="Descripcion"]')
          .fill("Test description");

        // NO ingresar precio o ingresar 0
        const precioInput = page.locator('input[name="precio"]');
        await precioInput.fill("0");

        // Seleccionar icono
        const smartSelect = page.locator("a.item-link.smart-select");
        await smartSelect.click();

        const iconoRayo = page.locator(
          'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
        );
        await iconoRayo.click();

        // Cerrar el modal del selector de iconos
        const closeButton = page.locator(
          "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
        );
        await closeButton.click();

        // Seleccionar todos los días de la semana
        const diasSemana = page.locator(".block .button");
        const count = await diasSemana.count();
        for (let i = 0; i < count; i++) {
          await diasSemana.nth(i).click();
        }

        // Intentar crear cupón con precio 0
        const crearCuponBtn = page.locator("a.button.button-fill", {
          hasText: "CREAR CUPÓN",
        });
        await crearCuponBtn.click({ force: true });

        // Verificar el modal de error
        const modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalError).toBeVisible({ timeout: 10000 });
        await expect(modalError.locator(".dialog-text")).toContainText(
          "El precio debe ser mayor a 0"
        );

        // Cerrar el modal de error
        await modalError
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
      });

      test("Puede crear un nuevo cupón DNI Pago y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda crear un nuevo cupón DNI Pago y recibir confirmación de éxito"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's Pago
        const seccionDNIsPago = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/Pago_DNI"]'
        );
        await seccionDNIsPago.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/Pago_DNI");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocupondni/Pago_DNI"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocupondni/Pago_DNI");

        // Completar formulario de cupón
        await page
          .locator('input[name="nombre"][placeholder="Nombre"]')
          .fill("DNI $");
        await page
          .locator('input[name="descripcion"][placeholder="Descripcion"]')
          .fill("Test description");

        // Ingresar precio
        const precioInput = page.locator('input[name="precio"]');
        await precioInput.fill("20");

        // Seleccionar icono
        await page.locator("a.item-link.smart-select").click();
        await page
          .locator(
            'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
          )
          .click();
        await page
          .locator(
            "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
          )
          .click();

        // Seleccionar todos los días de la semana
        const diasSemana = page.locator(".block .button");
        const count = await diasSemana.count();
        for (let i = 0; i < count; i++) {
          await diasSemana.nth(i).click();
        }

        // Click en crear cupón
        const crearCuponBtn = page.locator("a.button.button-fill", {
          hasText: "CREAR CUPÓN",
        });
        await crearCuponBtn.click({ force: true });

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 10000 });
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón creado correctamente."
        );
        await modalExito
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
        await expect(modalExito).not.toBeVisible({ timeout: 5000 });
      });

      test("Puede editar un cupón DNI Pago y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda editar un cupón DNI Pago existente y recibir confirmación de la modificación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's Pago
        const seccionDNIsPago = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/Pago_DNI"]'
        );
        await seccionDNIsPago.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/Pago_DNI");

        // Identificar el cupón por su nombre y hacer clic en editar
        const cupon = page
          .locator(".grid-container .item-header", { hasText: "DNI $" })
          .locator('xpath=ancestor::div[contains(@class, "grid-container")]');
        await expect(cupon).toBeVisible({ timeout: 5000 });
        await cupon
          .locator(
            'a[href^="/manager/71/modificarcupondni/Pago_DNI/"] i.fa-pencil'
          )
          .click();

        // Modificar el cupón
        await page.waitForURL("**/manager/71/modificarcupondni/Pago_DNI/**");
        await page.locator('input[name="nombre"]').fill("DNI $ 2");

        // Modificar precio
        const precioInput = page.locator('input[name="precio"]');
        await precioInput.fill("25");

        await page
          .locator("a.button.button-fill", { hasText: "Modificar Cupón" })
          .click();

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 10000 });
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón modificado correctamente."
        );
        await modalExito
          .locator("span.dialog-button", { hasText: "OK" })
          .click();

        // Verificar redirección
        await expect(page).toHaveURL(
          "https://doorsticketsdev.com/#!/manager/71/cuponesdni/Pago_DNI",
          { timeout: 5000 }
        );
      });

      test("Puede eliminar un cupón DNI Pago y ver confirmación", async ({
        page,
      }) => {
        allure.description(
          "Verifica que un encargado pueda eliminar un cupón DNI Pago existente y recibir confirmación de la eliminación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección DNI's Pago
        const seccionDNIsPago = page.locator(
          'a.item-link[href="/manager/71/cuponesdni/Pago_DNI"]'
        );
        await seccionDNIsPago.click();
        await page.waitForURL("**/#!/manager/71/cuponesdni/Pago_DNI");

        // Identificar el cupón por su nombre y eliminarlo
        const cupon = page
          .locator(".grid-container .item-header", { hasText: "DNI $ 2" })
          .locator('xpath=ancestor::div[contains(@class, "grid-container")]');
        await expect(cupon).toBeVisible({ timeout: 5000 });
        const botonEliminar = cupon.locator("i.fa-trash div a.button");
        await botonEliminar.click();

        // Confirmar eliminación
        const modalConfirmacion = page.locator(".dialog.modal-in");
        await expect(modalConfirmacion).toBeVisible({ timeout: 5000 });
        await expect(modalConfirmacion).toContainText(
          "¿Estás seguro que deseas eliminar esta lista?"
        );
        const botonConfirmar = modalConfirmacion.locator("span.dialog-button", {
          hasText: "Confirmar",
        });
        await botonConfirmar.click();

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 5000 });
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón eliminado con éxito"
        );
        const botonOK = modalExito.locator("span.dialog-button", {
          hasText: "OK",
        });
        await botonOK.click();

        // Verificar que el cupón ha sido eliminado
        const cuponEliminado = page.locator(".grid-container .item-header", {
          hasText: "DNI $ 2",
        });
        await expect(cuponEliminado).toHaveCount(0, { timeout: 5000 });

        // Verificar el mensaje "No hay cupones disponibles" si no hay más cupones
        const mensajeSinCupones = page.locator("p", {
          hasText: "No hay cupones disponibles.",
        });
        if (await mensajeSinCupones.isVisible()) {
          await expect(mensajeSinCupones).toHaveText(
            "No hay cupones disponibles."
          );
        }
      });
    });

    // Subsección de QR's
    test.describe("QR's", () => {
      test.beforeEach(() => {
        allure.story("Cupones QR's Consumibles y Virales");
      });

      test("Muestra error cuando no se ingresa el nombre del cupón QR", async ({ page }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón QR sin nombre"
        );
        allure.severity("high");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección QR's
        const seccionQRs = page.locator(
          'a.item-link[href="/manager/71/cuponesqr/QR"]'
        );
        await seccionQRs.click();
        await page.waitForURL("**/#!/manager/71/cuponesqr/QR");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocuponqr/QR"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocuponqr/QR");

        // NO completar el nombre, solo descripción, icono, día y foto
        await page
          .locator('input[name="descripcion"][placeholder="Descripción"]')
          .fill("Test describe");

        // Seleccionar icono
        const smartSelect = page.locator("a.item-link.smart-select");
        await smartSelect.click();
        const iconoRayo = page.locator(
          'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
        );
        await iconoRayo.click();
        const closeButton = page.locator(
          "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
        );
        await closeButton.click();

        // Seleccionar un día (por ejemplo el primero)
        const dia = page.locator(".block .button").first();
        await dia.click();

        // Subir foto (usando el primer input dentro de avatar-picker)
        const fileInput = page
          .locator('.avatar-picker input[type="file"]')
          .first();
        await fileInput.setInputFiles("tests/assets/foto-ejemplo.png");

        // Hacer clic en el botón "Terminado"
        const terminadoBtn = page.locator(
          "a.link.popup-avatar-picker-crop-image",
          { hasText: "Terminado" }
        );
        await expect(terminadoBtn).toBeVisible({ timeout: 5000 });
        await terminadoBtn.click();

        // Esperar a que desaparezca el spinner de carga
        const spinner = page.locator(
          ".preloader, .spinner, .loading-indicator"
        );
        if (await spinner.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(spinner).toBeHidden({ timeout: 10000 });
        }

        // Esperar a que desaparezca el popup de crop
        const popup = page.locator(".popup-avatar-picker");
        await expect(popup).not.toBeVisible({ timeout: 10000 });

        // IMPORTANTE: Manejar el modal "La foto es requerida" si aparece
        const modalFotoRequerida = page.locator(".dialog-text", {
          hasText: "La foto es requerida",
        });

        // Si el modal aparece, cerrarlo haciendo clic en OK
        if (
          await modalFotoRequerida
            .isVisible({ timeout: 2000 })
            .catch(() => false)
        ) {
          console.log("Modal 'La foto es requerida' detectado. Cerrándolo...");
          await page
            .locator(".dialog-buttons span.dialog-button", { hasText: "OK" })
            .click();
          await page.waitForTimeout(1000); // Esperar a que el modal se cierre completamente
        }

        // click en crear cupón
        const crearCuponBtn = page.getByRole("link", { name: "CREAR CUPÓN" });
        await crearCuponBtn.scrollIntoViewIfNeeded();
        await crearCuponBtn.click({ force: true });

        // Verificar el modal de error - ahora debería mostrar el error de nombre requerido
        const modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalError).toBeVisible({ timeout: 10000 });
        await expect(modalError.locator(".dialog-text")).toContainText(
          "Nombre es requerido"
        );

        // Cerrar el modal de error
        await modalError
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
      });

      test("Muestra error cuando no se selecciona un día para el cupón QR", async ({ page }) => {
        allure.description(
          "Verifica que se muestre un mensaje de error cuando se intenta crear un cupón QR sin seleccionar un día de la semana"
        );
        allure.severity("normal");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección QR's
        const seccionQRs = page.locator(
          'a.item-link[href="/manager/71/cuponesqr/QR"]'
        );
        await seccionQRs.click();
        await page.waitForURL("**/#!/manager/71/cuponesqr/QR");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocuponqr/QR"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocuponqr/QR");

        // Completar nombre y descripción
        await page
          .locator('input[name="nombre"][placeholder="Nombre"]')
          .fill("QR CONSUMIBLE");
        await page
          .locator('input[name="descripcion"][placeholder="Descripción"]')
          .fill("Test describe");

        // Seleccionar icono
        const smartSelect = page.locator("a.item-link.smart-select");
        await smartSelect.click();
        const iconoRayo = page.locator(
          'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
        );
        await iconoRayo.click();
        const closeButton = page.locator(
          "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
        );
        await closeButton.click();

        // NO seleccionar días

        // NO seleccionar foto

        // Esperar un momento para asegurar que todos los elementos estén cargados
        await page.waitForTimeout(500);

        // CAMBIO: Usar el selector directo que funcionó en otros tests
        const crearCuponBtn = page.locator("a.button.button-fill", {
          hasText: "CREAR CUPÓN",
        });
        await crearCuponBtn.scrollIntoViewIfNeeded();

        // CAMBIO: Capturar diálogos que puedan aparecer
        page.once("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          await dialog.accept();
        });

        // CAMBIO: Usar JavaScript para hacer clic directamente en el DOM
        await page.evaluate(() => {
          const buttons = Array.from(
            document.querySelectorAll<HTMLAnchorElement>("a.button.button-fill")
          );
          const createButton = buttons.find((btn) =>
            btn.textContent?.includes("CREAR CUPÓN")
          );
          if (createButton) createButton.click();
        });

        // Verificar el modal de error
        const modalError = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalError).toBeVisible({ timeout: 10000 });
        await expect(modalError.locator(".dialog-text")).toContainText(
          "Debe seleccionar algun día para que la limitación funcione"
        );

        // Cerrar el modal de error
        await modalError
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
      });

      test("Puede crear un nuevo cupón QR y ver confirmación", async ({ page }) => {
        allure.description(
          "Verifica que un encargado pueda crear un nuevo cupón QR y recibir confirmación de éxito"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección QR's
        const seccionQRs = page.locator(
          'a.item-link[href="/manager/71/cuponesqr/QR"]'
        );
        await seccionQRs.click();
        await page.waitForURL("**/#!/manager/71/cuponesqr/QR");

        // Click en botón agregar nuevo cupón
        const botonAgregarCupon = page.locator(
          'a[href="/manager/71/nuevocuponqr/QR"] i.material-icons'
        );
        await botonAgregarCupon.click();
        await page.waitForURL("**/#!/manager/71/nuevocuponqr/QR");

        // Completar formulario de cupón
        await page
          .locator('input[name="nombre"][placeholder="Nombre"]')
          .fill("QR CONSUMIBLE");
        await page
          .locator('input[name="descripcion"][placeholder="Descripción"]')
          .fill("Test describe");

        // Seleccionar icono
        await page.locator("a.item-link.smart-select").click();
        await page
          .locator(
            'label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])'
          )
          .click();
        await page
          .locator(
            "a.link.popup-close[data-popup=\".smart-select-popup[data-select-name='icono']\"]"
          )
          .click();

        // Seleccionar un día (por ejemplo el primero)
        const dia = page.locator(".block .button").first();
        await dia.click();

        // Click en crear cupón
        const crearCuponBtn = page.getByRole("link", { name: "CREAR CUPÓN" });
        await crearCuponBtn.scrollIntoViewIfNeeded();
        await crearCuponBtn.click({ force: true });

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 10000 });
        await expect(modalExito.locator(".dialog-title")).toContainText(
          "Excelente!"
        );
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón creado correctamente."
        );

        // Cerrar el modal de éxito
        await modalExito
          .locator("span.dialog-button", { hasText: "OK" })
          .click();
        await expect(modalExito).not.toBeVisible({ timeout: 5000 });
      });

      test("Puede editar un cupón QR y ver confirmación", async ({ page }) => {
        allure.description(
          "Verifica que un encargado pueda editar un cupón QR existente y recibir confirmación de la modificación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección QR's
        const seccionQRs = page.locator(
          'a.item-link[href="/manager/71/cuponesqr/QR"]'
        );
        await seccionQRs.click();
        await page.waitForURL("**/#!/manager/71/cuponesqr/QR");

        // Buscar el grid-container que contiene el nombre del cupón
        const gridContainer = page.locator(".grid-container", {
          hasText: "QR CONSUMIBLE",
        });
        await expect(gridContainer).toBeVisible({ timeout: 5000 });

        // Buscar el botón de editar (ícono lápiz) en la columna de acciones
        const botonEditar = gridContainer.locator(
          'a[href^="/manager/71/modificarcuponqr/"]'
        );
        await expect(botonEditar).toBeVisible({ timeout: 5000 });
        await botonEditar.click();

        // Esperar a la vista de edición
        await page.waitForURL("**/manager/71/modificarcuponqr/**/QR");

        // Modificar el nombre
        const nombreInput = page.locator(
          'input[name="nombre"][placeholder="Nombre"]'
        );
        await expect(nombreInput).toBeVisible({ timeout: 5000 });
        await nombreInput.fill("QR CONSUMIBLE EDIT");

        // Click en el botón "Modificar Cupón"
        const btnModificar = page.locator("a.button.button-fill", {
          hasText: "Modificar Cupón",
        });
        await expect(btnModificar).toBeVisible({ timeout: 5000 });
        await btnModificar.click();

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 10000 });
        await expect(modalExito.locator(".dialog-title")).toContainText(
          "Excelente!"
        );
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón modificado correctamente."
        );

        // Cerrar el modal de éxito
        await modalExito
          .locator("span.dialog-button", { hasText: "OK" })
          .click();

        // Verificar redirección a la lista de cupones QR
        await expect(page).toHaveURL(
          "https://doorsticketsdev.com/#!/manager/71/cuponesqr/QR",
          { timeout: 5000 }
        );
      });

      test("Puede eliminar un cupón QR y ver confirmación", async ({ page }) => {
        allure.description(
          "Verifica que un encargado pueda eliminar un cupón QR existente y recibir confirmación de la eliminación"
        );
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await seleccionarRolGeneral(encargado);

        // Navegar a la sección QR's
        const seccionQRs = page.locator(
          'a.item-link[href="/manager/71/cuponesqr/QR"]'
        );
        await seccionQRs.click();
        await page.waitForURL("**/#!/manager/71/cuponesqr/QR");

        // Identificar el cupón por su nombre y eliminarlo
        const cupon = page
          .locator(".grid-container .item-header", {
            hasText: "QR CONSUMIBLE EDIT",
          })
          .locator('xpath=ancestor::div[contains(@class, "grid-container")]');
        await expect(cupon).toBeVisible({ timeout: 5000 });

        // Buscar el botón de eliminar (ícono de tacho) y hacer clic
        const botonEliminar = cupon.locator("i.fa-trash div a.button");
        await botonEliminar.click();

        // Confirmar eliminación en el modal
        const modalConfirmacion = page.locator(".dialog.modal-in");
        await expect(modalConfirmacion).toBeVisible({ timeout: 5000 });
        await expect(modalConfirmacion).toContainText(
          "¿Estás seguro que deseas eliminar esta lista?"
        );
        const botonConfirmar = modalConfirmacion.locator("span.dialog-button", {
          hasText: "Confirmar",
        });
        await botonConfirmar.click();

        // Verificar el modal de éxito
        const modalExito = page.locator(".dialog.dialog-buttons-1.modal-in");
        await expect(modalExito).toBeVisible({ timeout: 5000 });
        await expect(modalExito.locator(".dialog-text")).toContainText(
          "Cupón eliminado con éxito"
        );
        const botonOK = modalExito.locator("span.dialog-button", {
          hasText: "OK",
        });
        await botonOK.click();

        // Verificar que el cupón ha sido eliminado
        const cuponEliminado = page.locator(".grid-container .item-header", {
          hasText: "QR CONSUMIBLE EDITADO",
        });
        await expect(cuponEliminado).toHaveCount(0, { timeout: 5000 });

        // Verificar el mensaje "No hay cupones disponibles" si no hay más cupones
        const mensajeSinCupones = page.locator("p", {
          hasText: "No hay cupones disponibles.",
        });
        if (await mensajeSinCupones.isVisible()) {
          await expect(mensajeSinCupones).toHaveText(
            "No hay cupones disponibles."
          );
        }
      });
    });

    // Subsección de QR's Pago
    test.describe("QR's Pago", () => {
      test.beforeEach(() => {
        allure.story("Cupones QR's Pago");
      });

      // Tests para QR's Pago
    });
  });
});
