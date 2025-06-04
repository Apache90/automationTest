import { LoginPage } from '../pages/LoginPage';
import { Encargado } from '../actors/Encargado';
import { Vendedor } from '../actors/Vendedor';

export async function loginComoEncargado(encargado: Encargado, email: string, password: string) {
  const loginPage = new LoginPage(encargado.page);
  await loginPage.navigate();
  await loginPage.login(email, password);
}

export async function loginComoVendedor(vendedor: Vendedor, email: string, password: string) {
  const loginPage = new LoginPage(vendedor.page);
  await loginPage.navigate();
  await loginPage.login(email, password);
}