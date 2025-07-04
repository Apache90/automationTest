import { Page } from '@playwright/test';
import { CuponModals } from '../helpers/CuponModals';

export async function verErrorNombreRequerido(page: Page) {
  const cuponModals = new CuponModals(page);
  await cuponModals.esperarModalError("Nombre es requerido");
  await cuponModals.cerrarModalError();
}

export async function verErrorDiaRequerido(page: Page) {
  const cuponModals = new CuponModals(page);
  await cuponModals.esperarModalError("Debe seleccionar algun día para que la limitación funcione");
  await cuponModals.cerrarModalError();
}

export async function verErrorPrecioRequerido(page: Page) {
  const cuponModals = new CuponModals(page);
  await cuponModals.esperarModalError("El precio debe ser mayor a 0");
  await cuponModals.cerrarModalError();
}