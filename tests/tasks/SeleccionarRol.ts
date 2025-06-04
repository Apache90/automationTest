import { Encargado } from '../actors/Encargado';
import { Vendedor } from '../actors/Vendedor';

export async function seleccionarRolEncargado(encargado: Encargado) {
  const link = encargado.page.getByRole('link', { name: 'Encargado TEST [SOLO EMIR]' });
  await link.click();
  await encargado.page.waitForURL('https://doorsticketsdev.com/#!/manager/71/');
}

export async function seleccionarRolVendedor(vendedor: Vendedor) {
  const link = vendedor.page.getByRole('link', { name: 'Vendedor TEST [SOLO EMIR]' });
  await link.click();
  await vendedor.page.waitForURL('https://doorsticketsdev.com/#!/vendedor/71/');
}