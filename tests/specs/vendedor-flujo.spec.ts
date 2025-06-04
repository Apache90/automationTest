import { test } from '@playwright/test';
import { Vendedor } from '../actors/Vendedor';
import { loginComoVendedor } from '../tasks/Login';
import { seleccionarRolVendedor } from '../tasks/SeleccionarRol';
import { verBienvenidaVendedor } from '../questions/VerBienvenida';

test.describe('Flujo de Vendedor', () => {
  test('El Vendedor puede iniciar sesión y ver su bienvenida', async ({ page }) => {
    const vendedor = new Vendedor(page);

    await loginComoVendedor(vendedor, 'emirvalles90@gmail.com', '123456');
    await seleccionarRolVendedor(vendedor);
    await verBienvenidaVendedor(vendedor);
  });
  
});

