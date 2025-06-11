import { Encargado } from '../../actors/Encargado';

export async function EliminarCanjeadorPorEmail(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Encuentra el <li> que contiene el email
  const liCanjeador = page.locator('li.swipeout', { hasText: email });
  await liCanjeador.waitFor({ state: 'visible', timeout: 5000 });

  // Encuentra el índice de ese <li> en la lista
  const allLis = page.locator('li.swipeout');
  const count = await allLis.count();
  let index = -1;
  for (let i = 0; i < count; i++) {
    const text = await allLis.nth(i).innerText();
    if (text.includes(email)) {
      index = i;
      break;
    }
  }
  if (index === -1) throw new Error('No se encontró el canjeador con el email: ' + email);

  // En la columna de acciones, busca el botón de eliminar en la misma posición
  const botonEliminar = page.locator('i.fa-light.fa-trash').nth(index).locator('div > a.button');
  await botonEliminar.click();
}