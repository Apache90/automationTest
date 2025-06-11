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
test.describe.configure({ mode: 'serial' });

test.describe('Flujo de Encargado', () => {
  test('El Encargado puede iniciar sesión y ver su bienvenida', async ({ page }) => {
    const encargado = new Encargado(page);

    await loginGeneral(encargado, 'emirvalles90@gmail.com', '123456');
    await seleccionarRolGeneral(encargado);
    await verBienvenidaGeneral(encargado.page, 'h1.bienvenido-principal', 'TEST [SOLO EMIR]');
  });

  //VENDEDORES
  test('Puede agregar un nuevo vendedor y ver confirmación', async ({ page }) => {
    const encargado = new Encargado(page);
    const modal = new VendedorModal(page);
    const email = 'vendedor1@gmail.com';

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
    const encargado = new Encargado(page);
    const modal = new VendedorModal(page);
    const email = 'vendedor1@gmail.com';

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
    const encargado = new Encargado(page);
    const modal = new VendedorModal(page);
    const email = 'vendedor1@gmail.com';

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

  //CANJEADORES
  test('Puede agregar un nuevo canjeador y ver confirmación', async ({ page }) => {
    const encargado = new Encargado(page);
    const modal = new CanjeadorModal(page);
    const email = 'canjeador1@gmail.com';

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
    const encargado = new Encargado(page);
    const modal = new CanjeadorModal(page);
    const email = 'canjeador1@gmail.com';

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
    const encargado = new Encargado(page);
    const modal = new CanjeadorModal(page);
    const email = 'canjeador1@gmail.com';

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
  
  //SUPERVISORES
  test('Puede agregar un nuevo supervisor y ver confirmación', async ({ page }) => {
    const encargado = new Encargado(page);
    const modal = new SupervisorModal(page);
    const email = 'supervisor1@gmail.com';

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
    const encargado = new Encargado(page);
    const modal = new SupervisorModal(page);
    const email = 'supervisor1@gmail.com';

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
    const encargado = new Encargado(page);
    const modal = new SupervisorModal(page);
    const email = 'supervisor1@gmail.com';

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

  //

});