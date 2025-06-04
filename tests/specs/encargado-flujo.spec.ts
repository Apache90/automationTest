import { test } from '@playwright/test';
import { Encargado } from '../actors/Encargado';
import { loginComoEncargado } from '../tasks/Login';
import { seleccionarRolEncargado } from '../tasks/SeleccionarRol';
import { verBienvenida } from '../questions/VerBienvenida';

test.describe('Flujo de Encargado', () => {
  test('El Encargado puede iniciar sesión y ver su bienvenida', async ({ page }) => {
    const encargado = new Encargado(page);

    await loginComoEncargado(encargado, 'emirvalles90@gmail.com', '123456');
    await seleccionarRolEncargado(encargado);
    await verBienvenida(encargado, 'TEST [SOLO EMIR]');
  });

});
