import { Encargado } from '../../actors/Encargado';

export async function EliminarSupervisorPorEmail(encargado: Encargado, email: string) {
  const { page } = encargado;

  const emailNode = page.getByText(email, { exact: true }).first();
  await emailNode.waitFor({ state: 'visible', timeout: 20000 });

  // Layout esperado (según DOM provisto): todo el row vive en un `div.grid-container ...`
  const supervisorRow = emailNode.locator('xpath=ancestor::div[contains(@class,"grid-container")][1]');
  await supervisorRow.waitFor({ state: 'visible', timeout: 20000 });

  // Botón eliminar: <i class="fa-light fa-trash"> ... <a class="button" href="#"> ...
  const botonEliminar = supervisorRow
    .locator('i.fa-trash a.button, i.fa-light.fa-trash a.button, i.fa-trash a[href="#"], i.fa-light.fa-trash a[href="#"]')
    .first();

  await botonEliminar.waitFor({ state: 'visible', timeout: 20000 });
  await botonEliminar.scrollIntoViewIfNeeded();
  await botonEliminar.click({ force: true });
}