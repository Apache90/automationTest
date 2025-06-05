import { test } from '@playwright/test';
import { Vendedor } from '../actors/Vendedor';
import { loginGeneral } from '../tasks/Login';
import { seleccionarRolGeneral } from '../tasks/SeleccionarRol';
import { verBienvenidaVendedor } from '../questions/VerBienvenida';

test.describe('Flujo de Vendedor', () => {
  test('El Vendedor puede iniciar sesión y ver su bienvenida', async ({ page }) => {
    const vendedor = new Vendedor(page);

    await loginGeneral(vendedor, 'emirvalles90@gmail.com', '123456');
    await seleccionarRolGeneral(vendedor);
    await verBienvenidaVendedor(vendedor);
  });
  
});

