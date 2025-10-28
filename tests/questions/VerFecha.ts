import { expect } from "@playwright/test";
import { FechasPage } from "../pages/FechasPage";

/**
 * Question: Verificar que una fecha fue creada correctamente
 * @param fechasPage - Página de fechas para realizar verificaciones
 * @param nombreFecha - Nombre de la fecha a verificar
 */
export async function verFechaCreada(fechasPage: FechasPage, nombreFecha: string): Promise<void> {
  await fechasPage.verificarFechaEnLista(nombreFecha);
}

/**
 * Question: Verificar que una fecha fue eliminada correctamente
 * @param fechasPage - Página de fechas para realizar verificaciones
 * @param nombreFecha - Nombre de la fecha que debería estar eliminada
 */
export async function verFechaEliminada(fechasPage: FechasPage, nombreFecha: string): Promise<void> {
  // Verificar que la fecha NO aparece en la lista
  const fechaElement = fechasPage.page.locator('.grid-container').filter({
    has: fechasPage.page.locator('.item-header', { hasText: nombreFecha })
  });
  await expect(fechaElement).not.toBeVisible({ timeout: 5000 });
}