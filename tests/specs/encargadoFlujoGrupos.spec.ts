import { test, expect } from "@playwright/test";
import { Encargado } from "../actors/Encargado";
import { loginGeneral } from "../tasks/Login";
import { seleccionarRolGeneral } from "../tasks/SeleccionarRol";
import { agregarNuevoVendedorGrupo } from "../tasks/Encargado/AgregarNuevoGrupoVendedores";
import { GruposVendedoresModal } from "../helpers/gruposmodals";
import { VendedorModal } from "../helpers/vendedormodals";


import { allure } from "allure-playwright";

test.describe("Gestión de Grupos de Vendedores", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(() => {
        allure.epic("Encargado");
        allure.feature("Gestión de Grupos de Vendedores");
        allure.story("Creación de grupos");
    });

    test("Puede crear un grupo de vendedores y ver confirmación", async ({ page }) => {
        allure.description("Verifica que un encargado pueda crear un grupo de vendedores seleccionando varios y recibiendo confirmación de éxito");
        allure.severity("critical");

        const encargado = new Encargado(page);
        const grupoModal = new GruposVendedoresModal(page);
        const modal = new VendedorModal(page);

        // Login y selección de rol
        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Ir a sección Vendedores y agregar dos vendedores
        await agregarNuevoVendedorGrupo(encargado, "vendedor1@gmail.com");
        await agregarNuevoVendedorGrupo(encargado, "vendedor2@gmail.com");
        await page.waitForTimeout(500);

        // Ir a sección Grupos de Vendedores
        await page.locator('h1.bienvenido + a[href="/manager/71/vendedores/grupos/"]').click();
        await expect(page).toHaveURL(/vendedores\/grupos/);
        await page.waitForTimeout(500);

        // Click en el botón "+" flotante para crear grupo (solo el que NO tiene un <div> hijo)
        const botonMasGrupo = page.locator('.custom-fab.fab-right-bottom > a:has(> i.material-icons:has-text("add"))').filter({
            hasNot: page.locator('div')
        });
        await expect(botonMasGrupo).toBeVisible({ timeout: 5000 });
        await botonMasGrupo.click();

        // Seleccionar vendedores en el modal
        await grupoModal.seleccionarVendedores(["vendedor1@gmail.com", "vendedor2@gmail.com"]);

        // Ingresar nombre del grupo y confirmar
        await grupoModal.ingresarNombreGrupo("GRUPO VENDEDORES");

        // Esperar confirmación y cerrar modal
        await grupoModal.esperarConfirmacion("GRUPO VENDEDORES");
    });
});