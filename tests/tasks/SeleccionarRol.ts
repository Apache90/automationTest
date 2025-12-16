import { Encargado } from '../actors/Encargado';
import { Vendedor } from '../actors/Vendedor';
/**
 * Selecciona el rol general de un actor (Encargado o Vendedor) en la aplicación.
 * @param {Encargado | Vendedor} actor - El actor que seleccionará su rol.
 * @throws {Error} Si el tipo de actor no es soportado.
 */
export async function seleccionarRolGeneral(actor: Encargado | Vendedor) {
  let link;
  await actor.page.waitForURL('**/#!/selectrole/**', { timeout: 20000 });
  await actor.page.getByRole('heading', { name: /Selecciona tu rol/i }).waitFor({ state: 'visible', timeout: 20000 });
  if (actor instanceof Encargado) {
    link = actor.page.getByRole('link', { name: /Encargado\s+TEST \[SOLO EMIR\]/i });
    await link.click({ timeout: 20000 });
    await actor.page.waitForURL('**/#!/manager/71/**', { timeout: 20000 });
  } else if (actor instanceof Vendedor) {
    link = actor.page.getByRole('link', { name: /Vendedor\s+TEST \[SOLO EMIR\]/i });
    await link.click({ timeout: 20000 });
    await actor.page.waitForURL('**/#!/vendedor/71/**', { timeout: 20000 });
  } else {
    throw new Error('Tipo de actor no soportado');
  }
}