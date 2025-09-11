import { test, expect } from "@playwright/test";
import { Encargado } from "../actors/Encargado";
import { loginGeneral } from "../tasks/Login";
import { seleccionarRolGeneral } from "../tasks/SeleccionarRol";
import { agregarNuevoVendedor } from "../tasks/Encargado/AgregarNuevoVendedor";
import { agregarNuevoCanjeador } from "../tasks/Encargado/AgregarNuevoCanjeador";
import { agregarNuevoSupervisor } from "../tasks/Encargado/AgregarNuevoSupervisor";
import { VendedorModal } from "../helpers/vendedormodals";
import { CanjeadorModal } from "../helpers/canjeadormodals";
import { SupervisorModal } from "../helpers/supervisormodals";
import { EliminarVendedorPorEmail } from "../tasks/Encargado/EliminarVendedorPorEmail";
import { EliminarCanjeadorPorEmail } from "../tasks/Encargado/EliminarCanjeadorPorEmail";
import { EliminarSupervisorPorEmail } from "../tasks/Encargado/EliminarSupervisorPorEmail";
import { crearLimitacionVendedor } from "../tasks/Encargado/CrearLimitacionVendedor";
import { eliminarLimitacionVendedor } from "../tasks/Encargado/EliminarLimitacionVendedor";
import { allure } from "allure-playwright";
import { AllureBusinessConfig } from "../config/AllureBusinessConfig";

// Configuración global para manejar diálogos inesperados
test.beforeEach(async ({ page }) => {
  // Manejar diálogos inesperados
  page.on('dialog', async dialog => {
    console.log(`Diálogo inesperado: ${dialog.message()}`);
    await dialog.accept();
  });

});

// Bloque principal
test.describe("Gestión de Roles", () => {
  test.beforeEach(() => {
    allure.epic("Encargado");
    allure.feature("Gestión de Roles");
  });

  // Subsección de Vendedores
  // EPIC: Roles Especializados - Gestión de Vendedores
  test.describe("👥 Gestión de Vendedores", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Roles Especializados");
      allure.feature("Gestión de Vendedores");
    });

    const email = "vendedor3@gmail.com";

    // Story: Gestión Básica de Vendedores
    test.describe("Gestión Básica de Vendedores", () => {
      test("Puede agregar un nuevo vendedor y ver confirmación", async ({ page }) => {
        allure.story("Creación de Vendedores");
        allure.description("Verifica que un encargado pueda agregar un nuevo vendedor al sistema y recibir confirmación de éxito");
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new VendedorModal(page);

        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Agregar nuevo vendedor
        await agregarNuevoVendedor(encargado, email);

        // Espera y cierra el modal de éxito usando el helper
        await modal.esperarModalExito();
        await modal.cerrarModalExito();

        // Verificar si el email aparece en la lista
        const emailEnLista = page.locator('.item-content', { hasText: email })
          .locator('span', { hasText: email });
        await expect(emailEnLista).toBeVisible({ timeout: 10000 });
      });

      test("Muestra mensaje si el vendedor ya posee el rol indicado", async ({ page }) => {
        allure.story("Validación de Vendedores");
        allure.description("Verifica que se muestre un mensaje de error cuando se intenta agregar un vendedor con rol ya existente");
        allure.severity("normal");

        const encargado = new Encargado(page);
        const modal = new VendedorModal(page);

        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Click en sección "Vendedores" con selector más robusto
        const seccionVendedores = page.locator('label', { hasText: "Vendedores" });
        await seccionVendedores.click();
        await page.waitForTimeout(1000);

        // Click en botón "+" con selector más robusto
        const botonAgregar = page.locator('.custom-fab a').first();
        await botonAgregar.scrollIntoViewIfNeeded();
        await botonAgregar.click();
        await page.waitForTimeout(1000);

        // Completar y confirmar en modal
        await modal.completarEmailYConfirmar(email);

        // Usar el helper para esperar y cerrar el modal de error
        await modal.esperarModalError("El usuario ya posee el rol indicado.");
        await modal.cerrarModalError();
      });

      // Story: 🆔 Limitaciones de Cupones DNI
      test.describe("🆔 Limitaciones de Cupones DNI", () => {
        test("Puede crear limitación DNI para vendedor y ver confirmación", async ({ page }) => {
          allure.story("🆔 Limitaciones de Cupones DNI");
          allure.description("Verifica que un encargado pueda crear una limitación DNI para un vendedor específico");
          allure.severity("critical");

          const encargado = new Encargado(page);

          // Login y selección de rol
          await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
          await page.waitForLoadState("networkidle");
          await seleccionarRolGeneral(encargado);
          await page.waitForLoadState("networkidle");

          // Crear limitación DNI
          await crearLimitacionVendedor(encargado, "vendedor3@gmail.com", "DNI GRUPO TEST", "5");
        });

        test("Puede eliminar limitación DNI de vendedor y ver confirmación", async ({ page }) => {
          allure.story("🆔 Limitaciones de Cupones DNI");
          allure.description("Verifica que un encargado pueda eliminar una limitación DNI asignada a un vendedor específico");
          allure.severity("critical");

          const encargado = new Encargado(page);

          // Login y selección de rol
          await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
          await page.waitForLoadState("networkidle");
          await seleccionarRolGeneral(encargado);
          await page.waitForLoadState("networkidle");

          // Eliminar limitación DNI
          await eliminarLimitacionVendedor(encargado, "vendedor3@gmail.com", "DNI GRUPO TEST");
        });
      });

      // Story: 💳 Limitaciones de Cupones DNI con Pago
      test.describe("💳 Limitaciones de Cupones DNI con Pago", () => {
        test("Puede crear limitación DNI Pago para vendedor y ver confirmación", async ({ page }) => {
          allure.story("💳 Limitaciones de Cupones DNI con Pago");
          allure.description("Verifica que un encargado pueda crear una limitación DNI Pago para un vendedor específico");
          allure.severity("critical");

          const encargado = new Encargado(page);

          // Login y selección de rol
          await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
          await page.waitForLoadState("networkidle");
          await seleccionarRolGeneral(encargado);
          await page.waitForLoadState("networkidle");

          // Crear limitación DNI Pago
          await crearLimitacionVendedor(encargado, "vendedor3@gmail.com", "DNI PAGO GRUPO TEST", "3");
        });
      });

      // Story: 📱 Limitaciones de Cupones QR
      test.describe("📱 Limitaciones de Cupones QR", () => {
        test("Puede crear limitación QR para vendedor y ver confirmación", async ({ page }) => {
          allure.story("📱 Limitaciones de Cupones QR");
          allure.description("Verifica que un encargado pueda crear una limitación QR para un vendedor específico");
          allure.severity("critical");

          const encargado = new Encargado(page);

          // Login y selección de rol
          await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
          await page.waitForLoadState("networkidle");
          await seleccionarRolGeneral(encargado);
          await page.waitForLoadState("networkidle");

          // Crear limitación QR
          await crearLimitacionVendedor(encargado, "vendedor3@gmail.com", "QR GRUPO TEST", "10");
        });
      });

      // Story: 💰 Limitaciones de Cupones QR con Pago
      test.describe("💰 Limitaciones de Cupones QR con Pago", () => {
        test("Puede crear limitación QR Pago para vendedor y ver confirmación", async ({ page }) => {
          allure.story("💰 Limitaciones de Cupones QR con Pago");
          allure.description("Verifica que un encargado pueda crear una limitación QR Pago para un vendedor específico");
          allure.severity("critical");

          const encargado = new Encargado(page);

          // Login y selección de rol
          await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
          await page.waitForLoadState("networkidle");
          await seleccionarRolGeneral(encargado);
          await page.waitForLoadState("networkidle");

          // Crear limitación QR Pago
          await crearLimitacionVendedor(encargado, "vendedor3@gmail.com", "QR $ GRUPO TEST", "7");
        });
      });

      test("Puede eliminar un vendedor existente y ver confirmación", async ({ page }) => {
        allure.story("Eliminación de Vendedores");
        allure.description("Verifica que un encargado pueda eliminar un vendedor existente y recibir confirmación de la operación");
        allure.severity("critical");

        const encargado = new Encargado(page);
        const modal = new VendedorModal(page);

        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Click en sección "Vendedores" con selector más robusto
        const seccionVendedores = page.locator('label', { hasText: "Vendedores" });
        await seccionVendedores.click();
        await page.waitForTimeout(1000);

        // Eliminar vendedor por email
        await EliminarVendedorPorEmail(encargado, email);

        // Confirmar en el modal de eliminación
        await modal.confirmarEliminacionVendedor();

        // Esperar y cerrar el modal de éxito
        await modal.esperarModalEliminacionExitosa();
      });
    });
  });

  // EPIC: Roles Especializados - Canjeadores
  test.describe("🎯 Gestión de Canjeadores", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Roles Especializados");
      allure.feature("Gestión de Canjeadores");
    });

    const email = "canjeador1@gmail.com";

    test("Puede agregar un nuevo canjeador y ver confirmación", async ({ page }) => {
      allure.story("Creación de Canjeadores");
      allure.description("Verifica que un encargado pueda agregar un nuevo canjeador al sistema y recibir confirmación de éxito");
      allure.severity("critical");

      const encargado = new Encargado(page);
      const modal = new CanjeadorModal(page);

      // Login y selección de rol
      await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
      await page.waitForLoadState("networkidle");
      await seleccionarRolGeneral(encargado);
      await page.waitForLoadState("networkidle");

      try {
        // Agregar nuevo canjeador
        await agregarNuevoCanjeador(encargado, email);

        // Espera y cierra el modal de éxito usando el helper
        await modal.esperarModalExito();
        await modal.cerrarModalExito();

        // Verificar si el email aparece en la lista
        const emailEnLista = page.locator('.item-content', { hasText: email })
          .locator('span', { hasText: email });
        await expect(emailEnLista).toBeVisible({ timeout: 10000 });
      } catch (error) {
        console.log("Error en la prueba de agregar canjeador:", error);
        await page.screenshot({ path: 'error-agregar-canjeador.png', fullPage: true });
        throw error;
      }
    });

    test("Muestra mensaje si el canjeador ya posee el rol indicado", async ({ page }) => {
      allure.story("Validación de Canjeadores");
      allure.description("Verifica que se muestre un mensaje de error cuando se intenta agregar un canjeador con rol ya existente");
      allure.severity("normal");

      const encargado = new Encargado(page);
      const modal = new CanjeadorModal(page);

      // Login y selección de rol
      await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
      await page.waitForLoadState("networkidle");
      await seleccionarRolGeneral(encargado);
      await page.waitForLoadState("networkidle");

      // Click en sección "Canjeadores" con selector más robusto
      const seccionCanjeadores = page.locator('label', { hasText: "Canjeadores" });
      await seccionCanjeadores.click();
      await page.waitForTimeout(1000);

      // Click en botón "+" con selector más robusto
      const botonAgregar = page.locator('.custom-fab a').first();
      await botonAgregar.scrollIntoViewIfNeeded();
      await botonAgregar.click();
      await page.waitForTimeout(1000);

      // Completar y confirmar en modal
      await modal.completarEmailYConfirmar(email);

      // Usar el helper para esperar y cerrar el modal de error
      await modal.esperarModalError("El usuario ya posee el rol indicado.");
      await modal.cerrarModalError();
    });

    test("Puede eliminar un canjeador existente y ver confirmación", async ({ page }) => {
      allure.story("Eliminación de Canjeadores");
      allure.description("Verifica que un encargado pueda eliminar un canjeador existente y recibir confirmación de la operación");
      allure.severity("critical");

      const encargado = new Encargado(page);
      const modal = new CanjeadorModal(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Click en sección "Canjeadores" con selector más robusto
        const seccionCanjeadores = page.locator('label', { hasText: "Canjeadores" });
        await seccionCanjeadores.click();
        await page.waitForTimeout(1000); // Espera explícita

        // Eliminar canjeador por email
        await EliminarCanjeadorPorEmail(encargado, email);

        // Confirmar en el modal de eliminación
        await modal.confirmarEliminacionCanjeador();

        // Esperar y cerrar el modal de éxito
        await modal.esperarModalEliminacionExitosa();

        // Verificar que el email ya no está en la lista con un timeout más amplio
        const emailEnLista = page.locator('.item-footer span, .item-content span', { hasText: email });
        await expect(emailEnLista).toHaveCount(0, { timeout: 10000 });
      } catch (error) {
        console.log("Error en la prueba de eliminar canjeador:", error);
        // Tomar captura de pantalla en caso de error
        await page.screenshot({ path: 'error-eliminar-canjeador.png', fullPage: true });
        throw error;
      }
    });
  });

  // EPIC: Roles Especializados - Supervisores
  test.describe("🎯 Gestión de Supervisores", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Roles Especializados");
      allure.feature("Gestión de Supervisores");
    });

    const email = "supervisor1@gmail.com";

    test("Puede agregar un nuevo supervisor y ver confirmación", async ({ page }) => {
      allure.story("Creación de Supervisores");
      allure.description("Verifica que un encargado pueda agregar un nuevo supervisor al sistema y recibir confirmación de éxito");
      allure.severity("critical");
      allure.description(
        "Verifica que un encargado pueda agregar un nuevo supervisor al sistema y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const modal = new SupervisorModal(page);

      // Login y selección de rol
      await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
      await page.waitForLoadState("networkidle");
      await seleccionarRolGeneral(encargado);
      await page.waitForLoadState("networkidle");

      try {
        // Agregar nuevo supervisor
        await agregarNuevoSupervisor(encargado, email);

        // Espera y cierra el modal de éxito usando el helper
        await modal.esperarModalExito();
        await modal.cerrarModalExito();

        // Verificar si el email aparece en la lista
        const emailEnLista = page.locator('.item-content', { hasText: email })
          .locator('span', { hasText: email });
        await expect(emailEnLista).toBeVisible({ timeout: 10000 });
      } catch (error) {
        console.log("Error en la prueba de agregar supervisor:", error);
        // Tomar captura de pantalla en caso de error
        await page.screenshot({ path: 'error-agregar-supervisor.png', fullPage: true });
        throw error;
      }
    });

    test("Muestra mensaje si el supervisor ya posee el rol indicado", async ({ page }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta agregar un supervisor con rol ya existente"
      );
      allure.severity("normal");

      const encargado = new Encargado(page);
      const modal = new SupervisorModal(page);

      // Login y selección de rol
      await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
      await page.waitForLoadState("networkidle");
      await seleccionarRolGeneral(encargado);
      await page.waitForLoadState("networkidle");

      // Click en sección "Supervisores" con selector más robusto
      const seccionSupervisores = page.locator('label', { hasText: "Supervisores" });
      await seccionSupervisores.click();
      await page.waitForTimeout(1000); // Espera explícita

      // Click en botón "+" con selector más robusto
      const botonAgregar = page.locator('.custom-fab a').first();
      await botonAgregar.scrollIntoViewIfNeeded();
      await botonAgregar.click();
      await page.waitForTimeout(1000); // Espera explícita

      // Completar y confirmar en modal
      await modal.completarEmailYConfirmar(email);

      // Usar el helper para esperar y cerrar el modal de error
      await modal.esperarModalError("El usuario ya posee el rol indicado.");
      await modal.cerrarModalError();
    });

    test("Puede eliminar un supervisor existente y ver confirmación", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda eliminar un supervisor existente y recibir confirmación de la operación"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const modal = new SupervisorModal(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Click en sección "Supervisores" con selector más robusto
        const seccionSupervisores = page.locator('label', { hasText: "Supervisores" });
        await seccionSupervisores.click();
        await page.waitForTimeout(1000); // Espera explícita

        // Eliminar supervisor por email
        await EliminarSupervisorPorEmail(encargado, email);

        // Confirmar en el modal de eliminación
        await modal.confirmarEliminacionSupervisor();

        // Esperar y cerrar el modal de éxito
        await modal.esperarModalEliminacionExitosa();

        // Verificar que el email ya no está en la lista con un timeout más amplio
        const emailEnLista = page.locator('.item-footer span, .item-content span', { hasText: email });
        await expect(emailEnLista).toHaveCount(0, { timeout: 10000 });
      } catch (error) {
        console.log("Error en la prueba de eliminar supervisor:", error);
        // Tomar captura de pantalla en caso de error
        await page.screenshot({ path: 'error-eliminar-supervisor.png', fullPage: true });
        throw error;
      }
    });
  });

});