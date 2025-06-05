import { Encargado } from '../actors/Encargado';
import { Vendedor } from '../actors/Vendedor';
import { expect } from '@playwright/test';

export async function verBienvenida(encargado: Encargado, textoEsperado: string) {
  const titulo = encargado.page.locator('h1.bienvenido-principal');
  await expect(titulo).toHaveText(textoEsperado);
}

export async function verBienvenidaVendedor(vendedor: Vendedor) {
  const titulo = vendedor.page.locator('div.block-title.block-title-large', { hasText: 'TEST [SOLO EMIR]' });
  await expect(titulo).toBeVisible();
}