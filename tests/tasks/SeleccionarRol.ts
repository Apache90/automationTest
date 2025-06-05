import { Encargado } from '../actors/Encargado';
import { Vendedor } from '../actors/Vendedor';
/**
 * Selecciona el rol general de un actor (Encargado o Vendedor) en la aplicación.
 * @param {Encargado | Vendedor} actor - El actor que seleccionará su rol.
 * @throws {Error} Si el tipo de actor no es soportado.
 */
export async function seleccionarRolGeneral(actor: Encargado | Vendedor) {
  let link;
  if (actor instanceof Encargado) {
    link = actor.page.getByRole('link', { name: 'Encargado TEST [SOLO EMIR]' });
    await link.click();
    await actor.page.waitForURL('https://doorsticketsdev.com/#!/manager/71/');
  } else if (actor instanceof Vendedor) {
    link = actor.page.getByRole('link', { name: 'Vendedor TEST [SOLO EMIR]' });
    await link.click();
    await actor.page.waitForURL('https://doorsticketsdev.com/#!/vendedor/71/');
  } else {
    throw new Error('Tipo de actor no soportado');
  }
}