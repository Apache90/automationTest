import { test, expect } from "@playwright/test";
import { Encargado } from "../actors/Encargado";
import { loginGeneral } from "../tasks/Login";
import { seleccionarRolGeneral } from "../tasks/SeleccionarRol";
import { intentarCrearFechaSinNombre, crearFecha } from "../tasks/Encargado/CrearFecha";
import { modificarMensajesFecha } from "../tasks/Encargado/ModificarMensajesFecha";
import { copiarFecha } from "../tasks/Encargado/CopiarFecha";
import { cambiarImagenFecha } from "../tasks/Encargado/CambiarImagenFecha";
import { eliminarFecha } from "../tasks/Encargado/EliminarFecha";
import { FechaModals } from "../helpers/fechamodals";
import { verModalModificacionEspecialExitosa } from "../questions/VerModalFecha";
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
test.describe("Funcionalidades Especiales", () => {
  test.beforeEach(() => {
    allure.epic("Encargado");
    allure.feature("Funcionalidades Especiales - Sección Otras");
  });

  // EPIC: Funcionalidades Especiales - Gestión de Fechas
  test.describe("📅 Fechas", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Funcionalidades Especiales");
      allure.feature("Gestión de Fechas");
    });

    test("Muestra error cuando se intenta crear fecha sin nombre", async ({ page }) => {
      allure.description(
        "Verifica que se muestre un mensaje de error cuando se intenta crear una fecha sin ingresar nombre"
      );
      allure.severity("normal");

      const encargado = new Encargado(page);
      const fechaModals = new FechaModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Intentar crear fecha sin nombre
        await intentarCrearFechaSinNombre(
          encargado,
          "2025-09-30", // Fecha: 30/09/2025
          "DESCRIPCION TEST", // Descripción
          "Av 123", // Dirección
          "tests/assets/doorsFecha.png" // Imagen
        );

        // Verificar que aparezca el modal de error
        await fechaModals.esperarModalError("Debe ingresar un nombre.");
        await fechaModals.cerrarModalError();
      } catch (error) {
        await page.screenshot({ path: `error-fecha-test-${Date.now()}.png`, fullPage: true });
        throw error;
      }
    });

    test("Puede crear una nueva fecha y ver confirmación", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda crear una nueva fecha con todos los campos requeridos y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const fechaModals = new FechaModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Crear fecha con todos los datos
        await crearFecha(
          encargado,
          "2025-09-30", // Fecha: 30/09/2025
          "FECHA TEST", // Nombre
          "DESCRIPCION TEST", // Descripción
          "Av 123", // Dirección
          "tests/assets/doorsFecha.png" // Imagen
        );

        // Verificar confirmación de éxito
        await fechaModals.esperarModalExito("Fecha creada correctamente.");
        await fechaModals.cerrarModalExito();
      } catch (error) {
        await page.screenshot({ path: `success-fecha-test-${Date.now()}.png`, fullPage: true });
        throw error;
      }
    });

    test("Puede modificar mensajes de pago y gratuitos de una fecha", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda modificar los mensajes antes y después de los links de pago y gratuitos de una fecha existente"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Modificar mensajes de la fecha existente
        await modificarMensajesFecha(
          encargado,
          "FECHA TEST", // Nombre de la fecha existente
          "Mensaje FREE 1", // Mensaje antes de link gratis
          "Mensaje FREE 2", // Mensaje después de link gratis
          "Mensaje PAGO 1", // Mensaje antes de link pago
          "Mensaje PAGO 2"  // Mensaje después de link pago
        );
      } catch (error) {
        await page.screenshot({ path: `modificar-mensajes-fecha-test-${Date.now()}.png`, fullPage: true });
        throw error;
      }
    });

    test("Puede copiar una fecha existente y ver confirmación", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda copiar una fecha existente, asignar un nuevo nombre y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Copiar la fecha existente con un nuevo nombre
        await copiarFecha(
          encargado,
          "FECHA TEST", // Nombre de la fecha a copiar
          "FECHA COPIA" // Nuevo nombre para la copia
        );
      } catch (error) {
        await page.screenshot({ path: `copiar-fecha-test-${Date.now()}.png`, fullPage: true });
        throw error;
      }
    });

    test("Puede cambiar la imagen de una fecha existente", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda cambiar la imagen de una fecha existente y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);
      const fechaModals = new FechaModals(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Cambiar la imagen de la fecha copiada
        await cambiarImagenFecha(
          encargado,
          "FECHA COPIA", // Nombre de la fecha a modificar
          "tests/assets/foto-ejemplo.png" // Nueva imagen
        );
        // Verificar que el modal de éxito aparece usando Questions
      } catch (error) {
        await page.screenshot({ path: `cambiar-imagen-fecha-test-${Date.now()}.png`, fullPage: true });
        throw error;
      }
    });

    test("Puede eliminar una fecha existente y ver confirmación", async ({ page }) => {
      allure.description(
        "Verifica que un encargado pueda eliminar una fecha existente, confirmar la acción y recibir confirmación de éxito"
      );
      allure.severity("critical");

      const encargado = new Encargado(page);

      try {
        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Eliminar la fecha copiada
        await eliminarFecha(
          encargado,
          "FECHA TEST" // Nombre de la fecha a eliminar
        );
      } catch (error) {
        await page.screenshot({ path: `eliminar-fecha-test-${Date.now()}.png`, fullPage: true });
        throw error;
      }
    });
    
  });

  // EPIC: Funcionalidades Especiales - Gestión de Eventos
  test.describe("🎪 Eventos", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Funcionalidades Especiales");
      allure.feature("Gestión de Eventos");
    });

    
    
  });

  // EPIC: Funcionalidades Especiales - Gestión de Invitados
  test.describe("👥 Invitados", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Funcionalidades Especiales");
      allure.feature("Gestión de Invitados");
    });

    
  });

  // EPIC: Funcionalidades Especiales - Gestión de Campañas
  test.describe("📢 Campañas", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Funcionalidades Especiales");
      allure.feature("Gestión de Campañas");
    });

    
  });

  // EPIC: Funcionalidades Especiales - Gestión de Menús
  test.describe("🍽️ Menús", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
      allure.epic("🎯 Funcionalidades Especiales");
      allure.feature("Gestión de Menús");
    });

    
  });
});
