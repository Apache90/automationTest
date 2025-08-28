import { test, expect } from "@playwright/test";
import { Encargado } from "../actors/Encargado";
import { loginGeneral } from "../tasks/Login";
import { seleccionarRolGeneral } from "../tasks/SeleccionarRol";
import { agregarNuevoVendedorGrupo, agregarVendedorAGrupo } from "../tasks/Encargado/AgregarNuevoGrupoVendedores";
import { GruposVendedoresModal } from "../helpers/gruposmodals";
import { VendedorModal } from "../helpers/vendedormodals";
import { modificarNombreGrupoVendedores, modificarNombreGrupoVacio } from "../tasks/Encargado/ModificarNombreGrupoVendedores";
import { allure } from "allure-playwright";
import { crearGrupoCuponesDni, crearGrupoCuponesDniPago } from "../tasks/Encargado/CrearCuponDNI";
import { crearGrupoCuponesQr } from "../tasks/Encargado/CrearCuponQr";
import { crearGrupoCuponesQrPago } from "../tasks/Encargado/CrearCuponQrPago";
import { modificarNombreGrupoCuponesQr, modificarNombreGrupoCuponesQrVacio } from "../tasks/Encargado/ModificarNombreGrupoCuponesQr";
import { modificarNombreGrupoCuponesQrPago, modificarNombreGrupoCuponesQrPagoVacio } from "../tasks/Encargado/ModificarNombreGrupoCuponesQrPago";
import { agregarCuponAGrupoQr } from "../tasks/Encargado/AgregarCuponAGrupoQr";
import { agregarCuponAGrupoQrPago } from "../tasks/Encargado/AgregarCuponAGrupoQrPago";
import { eliminarCuponDeGrupoQr, eliminarCuponDeGrupoQrPago } from "../tasks/Encargado/EliminarCuponDeGrupoQr";
import { eliminarVendedorDeGrupo } from "../tasks/Encargado/EliminarVendedorDeGrupo";
import { eliminarGrupoVendedores } from "../tasks/Encargado/EliminarGrupoVendedores";
import { intentarCrearGrupoSinVendedores } from "../tasks/Encargado/IntentarCrearGrupoSinVendedores";
import { intentarCrearGrupoSinNombre } from "../tasks/Encargado/IntentarCrearGrupoSinNombre";
import { modificarNombreGrupoCuponesDni, modificarNombreGrupoCuponesDniPagoVacio, modificarNombreGrupoCuponesDniVacio, modificarNombreGrupoCuponesDniPago } from "../tasks/Encargado/ModificarNombreGrupoCuponesDni";
import { agregarCuponAGrupoDni, agregarCuponAGrupoDniPago } from "../tasks/Encargado/AgregarCuponAGrupoDni";
import { eliminarCuponDeGrupoDni, eliminarCuponDeGrupoDniPago } from "../tasks/Encargado/EliminarCuponDeGrupoDni";
import { GruposCuponesModal } from "../helpers/gruposcuponesmodals";
import { eliminarGrupoCuponesDni, eliminarGrupoCuponesDniPago } from "../tasks/Encargado/EliminarGrupoCuponesDni";
import { eliminarGrupoCuponesQr, eliminarGrupoCuponesQrPago } from "../tasks/Encargado/EliminarGrupoCuponesQr";

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

    test("Puede eliminar un vendedor del grupo y ver confirmación", async ({ page }) => {
        allure.description("Verifica que un encargado pueda eliminar un vendedor de un grupo y reciba confirmación de éxito");
        allure.severity("critical");

        const encargado = new Encargado(page);
        const grupoModal = new GruposVendedoresModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Eliminar vendedor del grupo
        await eliminarVendedorDeGrupo(encargado, "GRUPO MODIFICADO", "emirvalles90@gmail.com");

        // Confirmar eliminación en el modal
        await grupoModal.confirmarEliminacionVendedor();

        // Esperar modal de éxito
        await grupoModal.esperarModalEliminacionVendedorExitosa();

        // Verificar que el vendedor ya no está en el grupo
        const grupoAccordion = page.locator('div.list ul li.accordion-item-opened');
        const vendedorLi = grupoAccordion.locator('li.swipeout', { hasText: "emirvalles90@gmail.com" });
        await expect(vendedorLi).toHaveCount(0, { timeout: 5000 });
    });

    test("Puede eliminar un grupo de vendedores y ver confirmación", async ({ page }) => {
        allure.description("Verifica que un encargado pueda eliminar un grupo de vendedores completo y reciba confirmación de éxito");
        allure.severity("critical");

        const encargado = new Encargado(page);
        const grupoModal = new GruposVendedoresModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Eliminar grupo completo
        await eliminarGrupoVendedores(encargado, "GRUPO MODIFICADO");

        // Esperar modal de éxito
        await grupoModal.esperarModalEliminacionGrupoExitosa();

        // Verificar que se muestra el mensaje de no hay grupos
        await expect(page.locator('.item-title', { hasText: "No tenés grupo de Vendedores." })).toBeVisible({ timeout: 5000 });
    });

    test("Muestra error si no se selecciona vendedor al crear grupo", async ({ page }) => {
        allure.description("Verifica que se muestre un error si no se selecciona ningún vendedor al crear un grupo");
        allure.severity("normal");

        const encargado = new Encargado(page);
        const grupoModal = new GruposVendedoresModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Intentar crear grupo sin seleccionar vendedores
        await intentarCrearGrupoSinVendedores(encargado);

        // Esperar modal de error
        await grupoModal.esperarModalErrorSinVendedores("Debe seleccionar al menos un vendedor sin grupo.");
    });

    test("Muestra error si no se ingresa nombre al crear grupo", async ({ page }) => {
        allure.description("Verifica que se muestre un error si no se ingresa nombre al crear un grupo de vendedores");
        allure.severity("normal");

        const encargado = new Encargado(page);
        const grupoModal = new GruposVendedoresModal(page);

        await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
        await page.waitForLoadState("networkidle");
        await seleccionarRolGeneral(encargado);
        await page.waitForLoadState("networkidle");

        // Intentar crear grupo sin ingresar nombre
        await intentarCrearGrupoSinNombre(encargado);

        // Esperar modal de error
        await grupoModal.esperarModalErrorSinNombre("Debe ingresar un nombre para poder crear el grupo.");
    });

});

test.describe("Gestion de Grupos de Cupones", () => {
    

    test.beforeEach(() => {
        allure.epic("Encargado");
        allure.feature("Gestion de Grupos de Cupones");
        allure.story("Creación de grupos");
    });

    test.describe("Grupo DNIsFree", () => {
        test.describe.configure({ mode: "serial" });

        test("Puede crear un grupo de cupones DNI y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda crear un grupo de cupones DNI y recibir confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            await crearGrupoCuponesDni(encargado);
        });

        test("Muestra error si no se ingresa nombre al modificar grupo de cupones DNI", async ({ page }) => {
            allure.description("Verifica que se muestre un error si no se ingresa nombre al modificar el grupo de cupones DNI");
            allure.severity("normal");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Intentar modificar nombre sin ingresar nuevo nombre
            await modificarNombreGrupoCuponesDniVacio(encargado, "GRUPO CUPONES DNI");

            // Esperar modal de error
            await grupoModal.esperarModalErrorSinNombre("Nuevo nombre de grupo es requerido");
        });

        test("Puede modificar el nombre del grupo de cupones DNI y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda modificar el nombre de un grupo de cupones DNI y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Modificar nombre del grupo
            await modificarNombreGrupoCuponesDni(encargado, "GRUPO CUPONES DNI", "GRUPO CUPONES DNI 2");

            // Esperar modal de éxito
            await grupoModal.esperarModalExitoModificacion("Grupo modificado con éxito");

            // Verificar que el nombre se cambió en la lista
            const grupoEnLista = page.locator('.list.accordion-list ul li.accordion-item .item-title', { hasText: "GRUPO CUPONES DNI 2" });
            await expect(grupoEnLista).toBeVisible({ timeout: 5000 });
        });

        test("Puede agregar un nuevo cupón a un grupo de cupones DNI y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda agregar un nuevo cupón a un grupo de cupones DNI existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Agregar cupón al grupo
            await agregarCuponAGrupoDni(encargado, "GRUPO CUPONES DNI 2", "DNI GRUPO TEST 2");

            // Verificar modal de éxito
            await grupoModal.esperarModalExitoCuponAgregado();
        });

        test("Puede eliminar un cupón de un grupo de cupones DNI y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un cupón de un grupo de cupones DNI existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar cupón del grupo
            await eliminarCuponDeGrupoDni(encargado, "GRUPO CUPONES DNI 2", "DNI GRUPO TEST");
        });

        test("Puede eliminar un grupo de cupones DNI y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un grupo de cupones DNI y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar grupo
            await eliminarGrupoCuponesDni(encargado, "GRUPO CUPONES DNI 2");
        });


    });

    test.describe("Grupo DNIsPago", () => {
        test.describe.configure({ mode: "serial" });
        
        test("Puede crear un grupo de cupones DNIsPago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda crear un grupo de cupones DNIsPago y recibir confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            await crearGrupoCuponesDniPago(encargado);
        });

        test("Muestra error si no se ingresa nombre al modificar grupo de cupones DNIsPago", async ({ page }) => {
            allure.description("Verifica que se muestre un error si no se ingresa nombre al modificar el grupo de cupones DNIsPago");
            allure.severity("normal");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Intentar modificar nombre sin ingresar nuevo nombre
            await modificarNombreGrupoCuponesDniPagoVacio(encargado, "GRUPO CUPONES DNI PAGO");

            // Esperar modal de error
            await grupoModal.esperarModalErrorSinNombre("Nuevo nombre de grupo es requerido");
        });

        test("Puede modificar el nombre del grupo de cupones DNIsPago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda modificar el nombre de un grupo de cupones DNI y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Modificar nombre del grupo
            await modificarNombreGrupoCuponesDniPago(encargado, "GRUPO CUPONES DNI", "GRUPO CUPONES DNI 2");

            // Esperar modal de éxito
            await grupoModal.esperarModalExitoModificacion("Grupo modificado con éxito");

            // Verificar que el nombre se cambió en la lista
            const grupoEnLista = page.locator('.list.accordion-list ul li.accordion-item .item-title', { hasText: "GRUPO CUPONES DNI 2" });
            await expect(grupoEnLista).toBeVisible({ timeout: 5000 });
        });

        test("Puede agregar un nuevo cupón a un grupo de cupones DNIsPago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda agregar un nuevo cupón a un grupo de cupones DNIsPago existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Agregar cupón al grupo
            await agregarCuponAGrupoDniPago(encargado, "GRUPO CUPONES DNI 2", "DNI PAGO GRUPO TEST 2");

            // Verificar modal de éxito
            await grupoModal.esperarModalExitoCuponAgregado();
        });

        test("Puede eliminar un cupón de un grupo de cupones DNIsPago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un cupón de un grupo de cupones DNIsPago existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar cupón del grupo
            await eliminarCuponDeGrupoDniPago(encargado, "GRUPO CUPONES DNI 2", "DNI PAGO GRUPO TEST");
        });

        test("Puede eliminar un grupo de cupones DNIsPago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un grupo de cupones DNIsPago y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar grupo
            await eliminarGrupoCuponesDniPago(encargado, "GRUPO CUPONES DNI 2");
        });


    });

    test.describe("Grupo QRs", () => {
        test.describe.configure({ mode: "serial" });

        test("Puede crear un grupo de cupones QR y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda crear un grupo de cupones QR y recibir confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            await crearGrupoCuponesQr(encargado);
        });

        test("Puede modificar el nombre del grupo de cupones QR y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda modificar el nombre de un grupo de cupones QR y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Modificar nombre del grupo
            await modificarNombreGrupoCuponesQr(encargado, "GRUPO DE CUPONES QRS", "GRUPO QRS MODIF");

            // Esperar modal de éxito
            await grupoModal.esperarModalExitoModificacion("Grupo modificado con éxito");

            // Verificar que el nombre se cambió en la lista
            const grupoEnLista = page.locator('.list.accordion-list ul li.accordion-item .item-title', { hasText: "GRUPO QRS MODIF" });
            await expect(grupoEnLista).toBeVisible({ timeout: 5000 });
        });

        test("Muestra error si no se ingresa nombre al modificar grupo de cupones QR", async ({ page }) => {
            allure.description("Verifica que se muestre un error si no se ingresa nombre al modificar el grupo de cupones QR");
            allure.severity("normal");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Intentar modificar nombre sin ingresar nuevo nombre
            await modificarNombreGrupoCuponesQrVacio(encargado, "GRUPO QRS MODIF");

            // Esperar modal de error
            await grupoModal.esperarModalErrorSinNombre("Nuevo nombre de grupo es requerido");
        });

        test("Puede agregar un nuevo cupón a un grupo de cupones QR y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda agregar un nuevo cupón a un grupo de cupones QR existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Agregar cupón al grupo
            await agregarCuponAGrupoQr(encargado, "GRUPO QRS MODIF", "QR GRUPO TEST 2");

            // Verificar modal de éxito
            await grupoModal.esperarModalExitoCuponAgregado();
        });

        test("Puede eliminar un cupón de un grupo de cupones QR y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un cupón de un grupo de cupones QR existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar cupón del grupo
            await eliminarCuponDeGrupoQr(encargado, "GRUPO QRS MODIF", "QR GRUPO TEST");
        });

        test("Puede eliminar un grupo de cupones QR y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un grupo de cupones QR y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar grupo
            await eliminarGrupoCuponesQr(encargado, "GRUPO QRS MODIF");
        });


    });

    test.describe("Grupo QRsPago", () => {
        test.describe.configure({ mode: "serial" });

        test("Puede crear un grupo de cupones QR Pago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda crear un grupo de cupones QR Pago y recibir confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            await crearGrupoCuponesQrPago(encargado);
        });

        test("Puede modificar el nombre del grupo de cupones QR Pago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda modificar el nombre de un grupo de cupones QR Pago y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Modificar nombre del grupo
            await modificarNombreGrupoCuponesQrPago(encargado, "GRUPO DE CUPONES QRS $", "GRUPO QRS $ MODIF");

            // Esperar modal de éxito
            await grupoModal.esperarModalExitoModificacion("Grupo modificado con éxito");

            // Verificar que el nombre se cambió en la lista
            const grupoEnLista = page.locator('.list.accordion-list ul li.accordion-item .item-title', { hasText: "GRUPO QRS $ MODIF" });
            await expect(grupoEnLista).toBeVisible({ timeout: 5000 });
        });

        test("Muestra error si no se ingresa nombre al modificar grupo de cupones QR Pago", async ({ page }) => {
            allure.description("Verifica que se muestre un error si no se ingresa nombre al modificar el grupo de cupones QR Pago");
            allure.severity("normal");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Intentar modificar nombre sin ingresar nuevo nombre
            await modificarNombreGrupoCuponesQrPagoVacio(encargado, "GRUPO QRS $ MODIF");

            // Esperar modal de error
            await grupoModal.esperarModalErrorSinNombre("Nuevo nombre de grupo es requerido");
        });

        test("Puede agregar un nuevo cupón a un grupo de cupones QR Pago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda agregar un nuevo cupón a un grupo de cupones QR Pago existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Agregar cupón al grupo
            await agregarCuponAGrupoQrPago(encargado, "GRUPO QRS $ MODIF", "QR $ GRUPO TEST 2");

            // Verificar modal de éxito
            await grupoModal.esperarModalExitoCuponAgregado();
        });

        test("Puede eliminar un cupón de un grupo de cupones QR Pago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un cupón de un grupo de cupones QR Pago existente y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar cupón del grupo
            await eliminarCuponDeGrupoQrPago(encargado, "GRUPO QRS $ MODIF", "QR $ GRUPO TEST");
        });

        test("Puede eliminar un grupo de cupones QR Pago y ver confirmación", async ({ page }) => {
            allure.description("Verifica que un encargado pueda eliminar un grupo de cupones QR Pago y reciba confirmación de éxito");
            allure.severity("critical");

            const encargado = new Encargado(page);
            const grupoModal = new GruposCuponesModal(page);

            // Login y selección de rol
            await loginGeneral(encargado, "emirvalles90@gmail.com", "123456");
            await page.waitForLoadState("networkidle");
            await seleccionarRolGeneral(encargado);
            await page.waitForLoadState("networkidle");

            // Eliminar grupo
            await eliminarGrupoCuponesQrPago(encargado, "GRUPO QRS $ MODIF");
        });

    });
});