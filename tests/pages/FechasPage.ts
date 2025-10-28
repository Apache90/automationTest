import { Page, Locator, expect } from '@playwright/test';

export class FechasPage {
  readonly page: Page;
  readonly seccionFechas: Locator;
  readonly botonAgregarFecha: Locator;
  readonly mensajeSinFechas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.seccionFechas = page.locator('a.item-link[href="/manager/71/fechas"]');
    this.botonAgregarFecha = page.locator('a[href="/manager/71/nuevafecha"] i.material-icons');
    this.mensajeSinFechas = page.locator("p", { hasText: "No hay fechas disponibles." });
  }

  async navegarASeccionFechas() {
    await this.seccionFechas.click();
    await this.page.waitForURL("**/#!/manager/71/fechas");
  }

  async clickAgregarNuevaFecha() {
    await this.botonAgregarFecha.click();
    await this.page.waitForURL("**/#!/manager/71/nuevafecha");
  }

  async buscarFechaPorNombre(nombre: string) {
    // Buscar el contenedor .grid-container que contiene el header con el nombre de la fecha
    const fecha = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombre })
    });
    await expect(fecha).toBeVisible({ timeout: 5000 });
    return fecha.first();
  }

  async clickEditarFecha(fecha: Locator) {
    // Algunos entornos usan distintos iconos/clases para el botón de editar.
    // Probar una serie de selectores comunes hasta encontrar uno visible.
    const candidatos = [
      'i.fa-edit',
      'i.fa-pencil',
      'i.fa-pencil-alt',
      'i.fa-pencil-square',
      'i.material-icons',
      'a[href*="/modificarfecha/"]',
      'button[title*="Modificar"]',
      'a.button:has-text("MODIFICAR")',
      'a.button:has-text("Editar")',
      'button:has-text("Editar")'
    ];

    for (const sel of candidatos) {
      const el = fecha.locator(sel);
      const count = await el.count();
      if (count > 0) {
        try {
          await expect(el.first()).toBeVisible({ timeout: 3000 });
          await el.first().click();
          return;
        } catch (e) {
          // continuar con el siguiente candidato
        }
      }
    }

    // Si no se encontró ninguno, lanzar error con contexto para debugging
    throw new Error('No se encontró el botón de editar dentro del contenedor de la fecha');
  }

  async clickEliminarFecha(fecha: Locator) {
    const botonEliminar = fecha.locator('i.fa-trash');
    await expect(botonEliminar).toBeVisible();
    await botonEliminar.click();
  }

  async clickEliminarFechaPorNombre(nombreFecha: string) {
    // Buscar el contenedor específico que contiene la fecha
    const fechaContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombreFecha })
    });
    
    // Click en el botón de eliminar (trash) usando la estructura del HTML proporcionado
    // Estructura: i.fa-light.fa-trash > div > a.button
    const botonEliminar = fechaContainer.locator('i.fa-light.fa-trash div a.button');
    await expect(botonEliminar).toBeVisible({ timeout: 10000 });
    await botonEliminar.click();
  }

  async clickVerFecha(nombreFecha: string) {
    // Buscar el contenedor específico que contiene la fecha
    const fechaContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombreFecha })
    });
    
    // Click en el botón de ver (ojo)
    const botonVer = fechaContainer.locator('a[href*="/fechaespecial/"] i.fa-eye');
    await expect(botonVer).toBeVisible({ timeout: 10000 });
    await botonVer.click();
  }

  async clickCopiarFecha(nombreFecha: string) {
    // Buscar el contenedor específico que contiene la fecha
    const fechaContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombreFecha })
    });
    
    // Click en el botón de copiar usando la estructura real del HTML
    // Estructura: i.fa-copy > div > a.button
    const botonCopiar = fechaContainer.locator('i.fa-copy div a.button');
    await expect(botonCopiar).toBeVisible({ timeout: 10000 });
    await botonCopiar.click();
  }

  async verificarFechaEnLista(nombreFecha: string) {
    // Verificar que la fecha aparece en la lista usando un selector más específico
    // Buscar el elemento que contiene tanto la fecha como el nombre (evita duplicados)
    const fechaElement = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-header', { hasText: nombreFecha })
    });
    await expect(fechaElement).toBeVisible({ timeout: 10000 });
    
    // Alternativamente, verificar específicamente el slot header que es único
    const fechaHeaderSlot = this.page.locator('div[slot="header"].item-header', { hasText: nombreFecha });
    await expect(fechaHeaderSlot).toBeVisible({ timeout: 10000 });
  }
}