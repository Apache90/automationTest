import { Encargado } from '../actors/Encargado';

export async function EliminarVendedorPorEmail(encargado: Encargado, email: string) {
  const { page } = encargado;

  // Encuentra el <li> que contiene el email
  const liVendedor = page.locator('li.swipeout', { hasText: email });
  await liVendedor.waitFor({ state: 'visible', timeout: 5000 });

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
  if (index === -1) throw new Error('No se encontró el vendedor con el email: ' + email);

  // En la columna de acciones, busca el botón de eliminar en la misma posición
  const botonEliminar = page.locator('.col-30 .fa-trash').nth(index).locator('a.button');
  await botonEliminar.click();
}