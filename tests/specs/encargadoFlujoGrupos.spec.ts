import { test, expect } from "@playwright/test";
import { Encargado } from "../actors/Encargado";
import { loginGeneral } from "../tasks/Login";
import { seleccionarRolGeneral } from "../tasks/SeleccionarRol";
import { agregarNuevoVendedorGrupo, agregarVendedorAGrupo } from "../tasks/Encargado/AgregarNuevoGrupoVendedores";
import { GruposVendedoresModal } from "../helpers/gruposmodals";
import { VendedorModal } from "../helpers/vendedormodals";
import { modificarNombreGrupoVendedores, modificarNombreGrupoVacio } from "../tasks/Encargado/ModificarNombreGrupoVendedores";
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

    test("Puede modificar el nombre del grupo de vendedores y ver confirmación", async ({ page }) => {
        allure.description("Verifica que un encargado pueda modificar el nombre de un grupo de vendedores y reciba confirmación de éxito");
        allure.severity("critical");

        const encargado = new Encargado(page);
        const grupoModal = new GruposVendedoresModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        await modificarNombreGrupoVendedores(encargado, "GRUPO VENDEDORES", "GRUPO MODIFICADO");

        await grupoModal.esperarModalExito("Grupo modificado con éxito");
    });

    test("Muestra error si no se ingresa nombre al modificar grupo de vendedores", async ({ page }) => {
        allure.description("Verifica que se muestre un error si no se ingresa nombre al modificar el grupo de vendedores");
        allure.severity("normal");

        const encargado = new Encargado(page);
        const grupoModal = new GruposVendedoresModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        await modificarNombreGrupoVacio(encargado, "GRUPO MODIFICADO");

        await grupoModal.esperarModalError("Nuevo nombre de grupo es requerido");
    });

    test("Puede agregar un vendedor existente al grupo y ver confirmación", async ({ page }) => {
        allure.description("Verifica que un encargado pueda agregar un vendedor existente a un grupo y reciba confirmación de éxito");
        allure.severity("critical");

        const encargado = new Encargado(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Agregar vendedor al grupo
        await agregarVendedorAGrupo(encargado, "GRUPO MODIFICADO", "emirvalles90@gmail.com");

        // Buscar el <li class="swipeout"> que contenga el email
        const grupoAccordion = page.locator('div.list ul li.accordion-item-opened');
        const vendedorLi = grupoAccordion.locator('li.swipeout', { hasText: "emirvalles90@gmail.com" });

        // Dentro de ese <li>, buscar el nombre
        const nombreVendedor = vendedorLi.locator('div.item-header[slot="header"]', { hasText: "Emir Segovia" });
        await expect(nombreVendedor).toBeVisible({ timeout: 5000 });
    });

    //eliminar vendedor de grupo

    //eliminar grupo de vendedores

    //validacion de selector de vendedores

    //validacion de input de nombre de grupo
    
});

