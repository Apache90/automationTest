import { Page, expect } from "@playwright/test";

export class LimitacionesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navegarAVendedores() {
    // Navegar a la sección de vendedores
    await this.page.locator('label', { hasText: "Vendedores" }).click();
    await expect(this.page).toHaveURL(/vendedores/);
    await this.page.waitForLoadState("networkidle");
  }

  async clickLimitacionesVendedor(emailVendedor: string) {
    // Buscar el vendedor por email y hacer click en el ícono de limitaciones
    const vendedorContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-footer span', { hasText: emailVendedor })
    });
    
    // Click en el icono de limitaciones (fa-ticket)
    const botonLimitaciones = vendedorContainer.locator('a:has(i.fa-light.fa-ticket)');
    await expect(botonLimitaciones).toBeVisible({ timeout: 5000 });
    await botonLimitaciones.click();
    
    // Verificar que estamos en la página de limitaciones del vendedor
    await expect(this.page).toHaveURL(/limitaciones/);
    await this.page.waitForLoadState("networkidle");
  }

  async clickCrearNuevaLimitacion() {
    // En la página de limitaciones del vendedor, buscar el botón "add" específico
    const botonAdd = this.page.getByRole('link', { name: 'add' });
    await expect(botonAdd).toBeVisible({ timeout: 5000 });
    await botonAdd.click();
    
    // Verificar que estamos en la página de nueva limitación
    await expect(this.page).toHaveURL(/nuevalimitacion/);
    await this.page.waitForLoadState("networkidle");
  }

  async seleccionarFecha(fecha: string = "27/08/2025") {
    // Click en el campo de fecha
    const campoFecha = this.page.locator('input[type="text"][placeholder*="01/02/2000 - 31/01/2051"]');
    await expect(campoFecha).toBeVisible({ timeout: 5000 });
    await campoFecha.click();
    
    // Esperar que aparezca el calendario
    const calendario = this.page.locator('.calendar.calendar-modal.modal-in');
    await expect(calendario).toBeVisible({ timeout: 5000 });
    
    // Seleccionar el día 27 (dos veces para rango desde-hasta)
    const dia27 = calendario.locator('.calendar-day[data-date="2025-7-27"]');
    await expect(dia27).toBeVisible({ timeout: 5000 });
    await dia27.click(); // Primera selección (desde)
    await dia27.click(); // Segunda selección (hasta)
    
    // Click en "Listo"
    const botonListo = calendario.locator('a.button.calendar-close', { hasText: 'Listo' });
    await expect(botonListo).toBeVisible({ timeout: 5000 });
    await botonListo.click();
    
    // Esperar que el calendario se cierre
    await expect(calendario).not.toBeVisible({ timeout: 5000 });
  }

  async seleccionarCupon(nombreCupon: string) {
    // Click en el selector de cupón
    const selectorCupon = this.page.locator('a.item-link.smart-select:has(.item-title:has-text("Cupón"))');
    await expect(selectorCupon).toBeVisible({ timeout: 5000 });
    await selectorCupon.click();
    
    // Esperar que aparezca el modal de selección
    const modal = this.page.locator('.page.smart-select-page');
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Buscar y seleccionar el cupón específico - usar texto exacto para evitar matches múltiples
    const cuponOption = modal.locator('.item-title').filter({ hasText: new RegExp(`^${nombreCupon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\(`) });
    await expect(cuponOption).toBeVisible({ timeout: 10000 });
    
    // Click en el label completo para seleccionar el cupón
    // En interfaces modernas, hacer click en el label es más confiable que en el radio button oculto
    const labelElement = cuponOption.locator('xpath=ancestor::label');
    await labelElement.click();
    
    // Click en "Close" para confirmar la selección
    const botonClose = modal.locator('a.link.popup-close', { hasText: 'Close' });
    await expect(botonClose).toBeVisible({ timeout: 5000 });
    await botonClose.click();
    
    // Esperar que el modal se cierre
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  }

  async ingresarCantidad(cantidad: string) {
    // Ingresar la cantidad en el campo correspondiente
    const campoCantidad = this.page.locator('input[name="cantidad"][type="number"]');
    await expect(campoCantidad).toBeVisible({ timeout: 5000 });
    await campoCantidad.fill(cantidad);
  }

  async seleccionarTodosLosDias() {
    // Seleccionar todos los días de la semana
    const diasSemana = [
      'i.fa-solid.fa-l', // Lunes
      'i.fa-solid.fa-m', // Martes
      'i.fa-solid.fa-x', // Miércoles
      'i.fa-solid.fa-j', // Jueves
      'i.fa-solid.fa-v', // Viernes
      'i.fa-solid.fa-s', // Sábado
      'i.fa-solid.fa-d'  // Domingo
    ];
    
    for (const dia of diasSemana) {
      const botonDia = this.page.locator(`a.button:has(${dia})`);
      await expect(botonDia).toBeVisible({ timeout: 5000 });
      await botonDia.click();
      await this.page.waitForTimeout(200); // Pequeña pausa entre clicks
    }
  }

  async clickCrearLimitacion() {
    // Click en el botón "CREAR LIMITACIÓN"
    const botonCrear = this.page.locator('a.btn-agregarLimitaciones.button.button-fill', { hasText: 'CREAR LIMITACIÓN' });
    await expect(botonCrear).toBeVisible({ timeout: 5000 });
    await botonCrear.click();
  }

  async esperarModalExito() {
    // Esperar el modal de éxito
    const modal = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Verificar que contiene el título y mensaje de éxito
    await expect(modal.locator('.dialog-title')).toContainText('Excelente!');
    await expect(modal.locator('.dialog-text')).toContainText('Limitación añadida correctamente.');
    
    // Cerrar el modal
    await modal.locator('.dialog-button', { hasText: 'OK' }).click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
    
    // Verificar que regresamos a la página de limitaciones del vendedor
    await expect(this.page).toHaveURL(/limitaciones\/$/);
  }
}
