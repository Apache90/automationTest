import { LoginPage } from '../pages/LoginPage';
import { Encargado } from '../actors/Encargado';
import { Vendedor } from '../actors/Vendedor';

export async function loginGeneral(actor:  any, email: string, password: string) {
  const loginPage = new LoginPage(actor.page);
  await loginPage.navigate();
  await loginPage.login(email, password);
}