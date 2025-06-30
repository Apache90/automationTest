import { test, expect } from '@playwright/test';
import { Encargado } from '../actors/Encargado';
import { loginGeneral } from '../tasks/Login';
import { seleccionarRolGeneral } from '../tasks/SeleccionarRol';
import { verBienvenidaGeneral } from '../questions/VerBienvenida';
import { agregarNuevoVendedor } from '../tasks/Encargado/AgregarNuevoVendedor';
import { agregarNuevoCanjeador } from '../tasks/Encargado/AgregarNuevoCanjeador';
import { agregarNuevoSupervisor } from '../tasks/Encargado/AgregarNuevoSupervisor';
import { VendedorModal } from '../helpers/vendedormodals';
import { CanjeadorModal } from '../helpers/canjeadormodals';
import { SupervisorModal } from '../helpers/supervisormodals';
import { EliminarVendedorPorEmail } from '../tasks/Encargado/EliminarVendedorPorEmail';
import { EliminarCanjeadorPorEmail } from '../tasks/Encargado/EliminarCanjeadorPorEmail';
import { EliminarSupervisorPorEmail } from '../tasks/Encargado/EliminarSupervisorPorEmail';
import { allure } from 'allure-playwright';

test.describe.configure({ mode: 'serial' });

test.describe('Flujo de Encargado', () => {
  test.beforeEach(() => {
    allure.epic('Encargado');
    allure.feature('Gestión de Personal');
  });

  test('El Encargado puede iniciar sesión y ver su bienvenida', async ({ page }) => {
    allure.story('Autenticación');
    allure.severity('blocker');
    
    const encargado = new Encargado(page);

    await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
    await seleccionarRolGeneral(encargado);
    await verBienvenidaGeneral(encargado.page, 'h1.bienvenido-principal', 'TEST [SOLO EMIR]');
  });

  test.describe('Gestión de Vendedores', () => {
    test.beforeEach(() => {
      allure.story('Vendedores');
    });

    const email = 'vendedor1@gmail.com';

    test('Puede agregar un nuevo vendedor y ver confirmación', async ({ page }) => {
      allure.description('Agrega un nuevo vendedor y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);
      const modal = new VendedorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);
      await agregarNuevoVendedor(encargado, email);

      // Espera y cierra el modal de éxito usando el helper
      await modal.esperarModalExito();
      await modal.cerrarModalExito();

      // Verificar si el email aparece en la lista
      const emailEnLista = page.locator(`.item-content span:text("${email}")`);
      await expect(emailEnLista).toBeVisible({ timeout: 5000 });
    });

    test('Muestra mensaje si el vendedor ya posee el rol indicado', async ({ page }) => {
      allure.description('Verifica el mensaje de error cuando se intenta agregar un vendedor con rol existente');
      allure.severity('normal');
      
      const encargado = new Encargado(page);
      const modal = new VendedorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Click en sección "Vendedores"
      const seccionVendedores = page.locator('label.svelte-1x3l73x', { hasText: 'Vendedores' });
      await seccionVendedores.click();

      // Click en botón "+"
      const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
      await botonAgregar.click();

      // Completar y confirmar en modal
      await modal.completarEmailYConfirmar(email);

      // Usar el helper para esperar y cerrar el modal de error
      await modal.esperarModalError('El usuario ya posee el rol indicado.');
      await modal.cerrarModalError();
    });

    test('Puede eliminar un vendedor existente y ver confirmación', async ({ page }) => {
      allure.description('Elimina un vendedor existente y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);
      const modal = new VendedorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Click en sección "Vendedores"
      const seccionVendedores = page.locator('label.svelte-1x3l73x', { hasText: 'Vendedores' });
      await seccionVendedores.click();

      // Eliminar vendedor por email
      await EliminarVendedorPorEmail(encargado, email);

      // Confirmar en el modal de eliminación
      await modal.confirmarEliminacionVendedor();

      // Esperar y cerrar el modal de éxito
      await modal.esperarModalEliminacionExitosa();

      // Verificar que el email ya no está en la lista
      const emailEnLista = page.locator('.item-footer span', { hasText: email });
      await expect(emailEnLista).toHaveCount(0);
    });
  });

  test.describe('Gestión de Canjeadores', () => {
    test.beforeEach(() => {
      allure.story('Canjeadores');
    });

    const email = 'canjeador1@gmail.com';

    test('Puede agregar un nuevo canjeador y ver confirmación', async ({ page }) => {
      allure.description('Agrega un nuevo canjeador y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);
      const modal = new CanjeadorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);
      await agregarNuevoCanjeador(encargado, email);

      // Espera y cierra el modal de éxito usando el helper
      await modal.esperarModalExito();
      await modal.cerrarModalExito();

      // Verificar si el email aparece en la lista
      const emailEnLista = page.locator(`.item-content span:text("${email}")`);
      await expect(emailEnLista).toBeVisible({ timeout: 5000 });
    });

    test('Muestra mensaje si el canjeador ya posee el rol indicado', async ({ page }) => {
      allure.description('Verifica el mensaje de error cuando se intenta agregar un canjeador con rol existente');
      allure.severity('normal');
      
      const encargado = new Encargado(page);
      const modal = new CanjeadorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Click en sección "Canjeadores"
      const seccionCanjeadores = page.locator('label.svelte-1x3l73x', { hasText: 'Canjeadores' });
      await seccionCanjeadores.click();

      // Click en botón "+"
      const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
      await botonAgregar.click();

      // Completar y confirmar en modal
      await modal.completarEmailYConfirmar(email);

      // Usar el helper para esperar y cerrar el modal de error
      await modal.esperarModalError('El usuario ya posee el rol indicado.');
      await modal.cerrarModalError();
    });

    test('Puede eliminar un canjeador existente y ver confirmación', async ({ page }) => {
      allure.description('Elimina un canjeador existente y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);
      const modal = new CanjeadorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Click en sección "Canjeadores"
      const seccionCanjeadores = page.locator('label.svelte-1x3l73x', { hasText: 'Canjeadores' });
      await seccionCanjeadores.click();

      // Eliminar canjeador por email
      await EliminarCanjeadorPorEmail(encargado, email);

      // Confirmar en el modal de eliminación
      await modal.confirmarEliminacionCanjeador();

      // Esperar y cerrar el modal de éxito
      await modal.esperarModalEliminacionExitosa();

      // Verificar que el email ya no está en la lista
      const emailEnLista = page.locator('.item-footer span', { hasText: email });
      await expect(emailEnLista).toHaveCount(0);
    });
  });
  
  test.describe('Gestión de Supervisores', () => {
    test.beforeEach(() => {
      allure.story('Supervisores');
    });

    const email = 'supervisor1@gmail.com';

    test('Puede agregar un nuevo supervisor y ver confirmación', async ({ page }) => {
      allure.description('Agrega un nuevo supervisor y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);
      const modal = new SupervisorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);
      await agregarNuevoSupervisor(encargado, email);

      // Espera y cierra el modal de éxito usando el helper
      await modal.esperarModalExito();
      await modal.cerrarModalExito();

      // Verificar si el email aparece en la lista
      const emailEnLista = page.locator(`.item-content span:text("${email}")`);
      await expect(emailEnLista).toBeVisible({ timeout: 5000 });
    });

    test('Muestra mensaje si el supervisor ya posee el rol indicado', async ({ page }) => {
      allure.description('Verifica el mensaje de error cuando se intenta agregar un supervisor con rol existente');
      allure.severity('normal');
      
      const encargado = new Encargado(page);
      const modal = new SupervisorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Click en sección "Supervisores"
      const seccionSupervisores = page.locator('label.svelte-1x3l73x', { hasText: 'Supervisores' });
      await seccionSupervisores.click();

      // Click en botón "+"
      const botonAgregar = page.locator('.custom-fab a .btn-menuSeller');
      await botonAgregar.click();

      // Completar y confirmar en modal
      await modal.completarEmailYConfirmar(email);

      // Usar el helper para esperar y cerrar el modal de error
      await modal.esperarModalError('El usuario ya posee el rol indicado.');
      await modal.cerrarModalError();
    });

    test('Puede eliminar un supervisor existente y ver confirmación', async ({ page }) => {
      allure.description('Elimina un supervisor existente y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);
      const modal = new SupervisorModal(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Click en sección "Supervisores"
      const seccionSupervisores = page.locator('label.svelte-1x3l73x', { hasText: 'Supervisores' });
      await seccionSupervisores.click();

      // Eliminar supervisor por email
      await EliminarSupervisorPorEmail(encargado, email);

      // Confirmar en el modal de eliminación
      await modal.confirmarEliminacionSupervisor();

      // Esperar y cerrar el modal de éxito
      await modal.esperarModalEliminacionExitosa();

      // Verificar que el email ya no está en la lista
      const emailEnLista = page.locator('.item-footer span', { hasText: email });
      await expect(emailEnLista).toHaveCount(0);
    });
  });

  test.describe('Gestión de Cupones', () => {
    test.beforeEach(() => {
      allure.story('Cupones');
      allure.feature('Gestión de Cupones');
    });

    test('Muestra error cuando no se ingresa el nombre del cupón', async ({ page }) => {
      allure.description('Verifica que se muestre un error cuando no se ingresa el nombre del cupón');
      allure.severity('high');
      
      const encargado = new Encargado(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Navegar a la sección DNI's
      const seccionDNIs = page.locator('a.item-link[href="/manager/71/cuponesdni/DNI"]');
      await seccionDNIs.click();
      await page.waitForURL('**/#!/manager/71/cuponesdni/DNI');

      // Click en botón agregar nuevo cupón
      const botonAgregarCupon = page.locator('a[href="/manager/71/nuevocupondni/DNI"] i.material-icons');
      await botonAgregarCupon.click();
      await page.waitForURL('**/#!/manager/71/nuevocupondni/DNI');

      // NO completar el nombre, solo descripción
      const descripcionInput = page.locator('input[name="descripcion"][placeholder="Descripcion"]');
      await descripcionInput.fill('TEST DESCRIBE');

      // Seleccionar icono
      const smartSelect = page.locator('a.item-link.smart-select');
      await smartSelect.click();
      
      const iconoRayo = page.locator('label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])');
      await iconoRayo.click();
      
      // Múltiples estrategias para cerrar el modal del selector de iconos
      try {
        // Estrategia 1: Botón Close específico
        const closeButton = page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'icono\']"]');
        if (await closeButton.isVisible({ timeout: 2000 })) {
          await closeButton.click();
        }
      } catch (error) {
        console.log('Estrategia 1 falló, intentando estrategia 2...');
      }
      
      try {
        // Estrategia 2: Usar Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (error) {
        console.log('Estrategia 2 falló, intentando estrategia 3...');
      }
      
      try {
        // Estrategia 3: Click en el backdrop para cerrar
        const backdrop = page.locator('.dialog-backdrop');
        if (await backdrop.isVisible({ timeout: 1000 })) {
          await backdrop.click();
        }
      } catch (error) {
        console.log('Estrategia 3 falló, continuando...');
      }

      // Esperar a que se cierre cualquier modal superpuesto
      await page.waitForTimeout(2000);

      // Seleccionar todos los días de la semana
      const diasSemana = page.locator('.block .button');
      const count = await diasSemana.count();
      for (let i = 0; i < count; i++) {
        await diasSemana.nth(i).click();
      }

      // Intentar crear cupón sin nombre
      const crearCuponBtn = page.locator('a.button.button-fill', { hasText: 'CREAR CUPÓN' });
      await crearCuponBtn.click({ force: true });

      // Esperar que aparezca el modal específico con la estructura exacta
      const modalError = page.locator('.dialog.dialog-buttons-1.modal-in');
      await expect(modalError).toBeVisible({ timeout: 10000 });
      
      // Verificar que el texto "Nombre es requerido" aparece en el modal
      await expect(modalError.locator('.dialog-text')).toContainText('Nombre es requerido');
      
      // Hacer clic en el botón OK dentro del modal para cerrarlo
      await modalError.locator('span.dialog-button', { hasText: 'OK' }).click();
    });

    test('Puede crear un nuevo cupón DNI y ver confirmación', async ({ page }) => {
      allure.description('Crea un nuevo cupón DNI y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Navegar a la sección DNI's
      const seccionDNIs = page.locator('a.item-link[href="/manager/71/cuponesdni/DNI"]');
      await seccionDNIs.click();
      await page.waitForURL('**/#!/manager/71/cuponesdni/DNI');

      // Click en botón agregar nuevo cupón
      const botonAgregarCupon = page.locator('a[href="/manager/71/nuevocupondni/DNI"] i.material-icons');
      await botonAgregarCupon.click();
      await page.waitForURL('**/#!/manager/71/nuevocupondni/DNI');

      // Completar formulario de cupón
      await page.locator('input[name="nombre"][placeholder="Nombre"]').fill('DNI FREE');
      await page.locator('input[name="descripcion"][placeholder="Descripcion"]').fill('TEST DESCRIBE');

      // Seleccionar icono
      await page.locator('a.item-link.smart-select').click();
      await page.locator('label.item-radio.item-radio-icon-start.item-content:has(input[value="fa-bolt"])').click();
      await page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'icono\']"]').click();

      // Seleccionar todos los días de la semana
      const diasSemana = page.locator('.block .button');
      const count = await diasSemana.count();
      for (let i = 0; i < count; i++) {
        await diasSemana.nth(i).click();
      }

      // Click en crear cupón
      const crearCuponBtn = page.locator('a.button.button-fill', { hasText: 'CREAR CUPÓN' });
      await crearCuponBtn.click({ force: true });

      // Esperar y verificar el modal de éxito
      const modalExito = page.locator('.dialog.dialog-buttons-1.modal-in');
      await expect(modalExito).toBeVisible({ timeout: 10000 });
      await expect(modalExito.locator('.dialog-text')).toContainText('Cupón creado correctamente.');
      await modalExito.locator('span.dialog-button', { hasText: 'OK' }).click();
      await expect(modalExito).not.toBeVisible({ timeout: 5000 });
    });

    test('Puede editar un cupón DNI y ver confirmación', async ({ page }) => {
      allure.description('Edita un cupón DNI existente y verifica la confirmación');
      allure.severity('critical');
      
      const encargado = new Encargado(page);

      await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
      await seleccionarRolGeneral(encargado);

      // Navegar a la sección DNI's
      const seccionDNIs = page.locator('a.item-link[href="/manager/71/cuponesdni/DNI"]');
      await seccionDNIs.click();
      await page.waitForURL('**/#!/manager/71/cuponesdni/DNI');

      // Identificar el cupón por su nombre y hacer clic en editar
      const cupon = page.locator('.grid-container .item-header', { hasText: 'DNI FREE' }).locator('xpath=ancestor::div[contains(@class, "grid-container")]');
      await expect(cupon).toBeVisible({ timeout: 5000 });
      await cupon.locator('a[href^="/manager/71/modificarcupondni/DNI/"] i.fa-pencil').click();

      // Esperar redirección y modificar
      await page.waitForURL('**/manager/71/modificarcupondni/DNI/**');
      await page.locator('input[name="nombre"]').fill('DNI FREE 2');
      await page.locator('a.button.button-fill', { hasText: 'Modificar Cupón' }).click();

      // Esperar y verificar el modal de éxito
      const modalExito = page.locator('.dialog.dialog-buttons-1.modal-in');
      await expect(modalExito).toBeVisible({ timeout: 10000 });
      await expect(modalExito.locator('.dialog-text')).toContainText('Cupón modificado correctamente.');
      await modalExito.locator('span.dialog-button', { hasText: 'OK' }).click();

      // Verificar redirección
      await expect(page).toHaveURL('https://doorsticketsdev.com/#!/manager/71/cuponesdni/DNI', { timeout: 5000 });
    });
  });
});