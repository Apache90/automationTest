import { expect } from "@playwright/test";
import { FechaModals } from "../helpers/fechamodals";

/**
 * Question: Verificar que aparece modal de error en fechas
 * @param fechaModals - Helper de modales de fecha
 * @param mensajeEsperado - Mensaje de error esperado
 */
export async function verModalError(fechaModals: FechaModals, mensajeEsperado: string): Promise<void> {
  await fechaModals.esperarModalError(mensajeEsperado);
}

/**
 * Question: Verificar que aparece modal de éxito en fechas
 * @param fechaModals - Helper de modales de fecha
 * @param mensajeEsperado - Mensaje de éxito esperado
 */
export async function verModalExito(fechaModals: FechaModals, mensajeEsperado: string): Promise<void> {
  await fechaModals.esperarModalExito(mensajeEsperado);
}

/**
 * Question: Verificar que aparece modal de éxito específico para modificación especial
 * @param fechaModals - Helper de modales de fecha
 * @param mensajeEsperado - Mensaje de éxito esperado para modificación especial
 */
export async function verModalModificacionEspecialExitosa(fechaModals: FechaModals, mensajeEsperado: string): Promise<void> {
  await fechaModals.esperarModalExito(mensajeEsperado);
}