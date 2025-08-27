import { expect, Page } from "@playwright/test";

export class LimitacionesPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navegarALimitacionesVendedor(emailVendedor: string) {
    // Navegar a la sección de vendedores
    await this.page.locator('a[href="/manager/71/vendedores/"]').click();
    await expect(this.page).toHaveURL(/vendedores/);
    await this.page.waitForLoadState("networkidle");

    // Buscar el vendedor por email y hacer click en el ícono de limitaciones
    const vendedorContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-footer span').filter({ hasText: emailVendedor })
    });

    await expect(vendedorContainer).toBeVisible({ timeout: 5000 });

    // Click en el ícono de ticket (limitaciones) del vendedor
    const iconoLimitaciones = vendedorContainer.locator('a[href*="/limitaciones/"] i.fa-light.fa-ticket');
    await expect(iconoLimitaciones).toBeVisible({ timeout: 5000 });
    await iconoLimitaciones.click();

    // Verificar que estamos en la página de limitaciones
    await expect(this.page).toHaveURL(/limitaciones/);
    await this.page.waitForLoadState("networkidle");
  }

  async clickNuevaLimitacion() {
    // Click en el botón flotante "+" para crear nueva limitación
    const botonNuevaLimitacion = this.page.locator('.custom-fab.fab-right-bottom a[href*="/nuevalimitacion/"]');
    await expect(botonNuevaLimitacion).toBeVisible({ timeout: 5000 });
    await botonNuevaLimitacion.click();

    // Verificar que estamos en la página de nueva limitación
    await expect(this.page).toHaveURL(/nuevalimitacion/);
    await this.page.waitForLoadState("networkidle");
  }

  async seleccionarFecha(fecha: string = "27/08/2025") {
    // Click en el campo de fecha para abrir el calendario
    const campoFecha = this.page.locator('input[placeholder*="01/02/2000 - 31/01/2051"]');
    await expect(campoFecha).toBeVisible({ timeout: 5000 });
    await campoFecha.click();

    // Esperar a que aparezca el calendario
    const calendario = this.page.locator('.calendar.calendar-modal.calendar-range.modal-in');
    await expect(calendario).toBeVisible({ timeout: 5000 });

    // Seleccionar el día 27 dos veces (desde-hasta)
    const dia27 = this.page.locator('.calendar-day[data-date="2025-7-27"]');
    await expect(dia27).toBeVisible({ timeout: 5000 });
    
    // Primera selección (desde)
    await dia27.click();
    await this.page.waitForTimeout(500);
    
    // Segunda selección (hasta)
    await dia27.click();
    await this.page.waitForTimeout(500);

    // Click en "Listo" para confirmar la selección
    const botonListo = this.page.locator('.calendar-close', { hasText: 'Listo' });
    await expect(botonListo).toBeVisible({ timeout: 5000 });
    await botonListo.click();

    // Verificar que la fecha se estableció correctamente
    await expect(campoFecha).toHaveValue(`${fecha} - ${fecha}`);
  }

  async seleccionarCupon(nombreCupon: string) {
    // Verificar si el cupón ya está seleccionado en el selector de cupón específico
    const itemAfterCupon = this.page.locator('.item-link.smart-select').filter({
      has: this.page.locator('.item-title', { hasText: 'Cupón' })
    }).locator('.item-after');
    
    const textoActual = await itemAfterCupon.textContent();
    
    if (textoActual && textoActual.includes(nombreCupon)) {
      console.log(`El cupón "${nombreCupon}" ya está seleccionado`);
      return;
    }

    // Click en el selector de cupón específico (el que tiene el texto "Cupón" en el item-title)
    const selectorCupon = this.page.locator('.item-link.smart-select').filter({
      has: this.page.locator('.item-title', { hasText: 'Cupón' })
    });
    await expect(selectorCupon).toBeVisible({ timeout: 5000 });
    await selectorCupon.click();

    // Esperar a que aparezca el modal smart-select
    const smartSelectPage = this.page.locator('.page.smart-select-page');
    await expect(smartSelectPage).toBeVisible({ timeout: 5000 });

    // Seleccionar el cupón específico - hacer click en el label del radio button
    const cuponOption = this.page.locator('label.item-radio').filter({
      has: this.page.locator('.item-title', { hasText: nombreCupon })
    });
    
    await expect(cuponOption).toBeVisible({ timeout: 5000 });
    await cuponOption.click();

    // Cerrar el modal específico de cupones
    const closeButton = this.page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'cupon\']"]');
    await closeButton.click();

    // Verificar que el cupón se seleccionó
    await expect(itemAfterCupon).toContainText(nombreCupon);
  }

  async ingresarCantidad(cantidad: string) {
    // Ingresar la cantidad en el campo numérico
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
      const botonDia = this.page.locator(dia).locator('xpath=ancestor::a[contains(@class, "button")]');
      await expect(botonDia).toBeVisible({ timeout: 5000 });
      await botonDia.click();
      await this.page.waitForTimeout(200); // Pequeña pausa entre clicks
    }
  }

  async clickCrearLimitacion() {
    // Click en el botón "CREAR LIMITACIÓN"
    const botonCrear = this.page.locator('.btn-agregarLimitaciones.button.button-fill', { hasText: 'CREAR LIMITACIÓN' });
    await expect(botonCrear).toBeVisible({ timeout: 5000 });
    await botonCrear.click();
  }

  async verificarEnPaginaLimitaciones() {
    // Verificar que estamos de vuelta en la página de limitaciones del vendedor
    await expect(this.page).toHaveURL(/limitaciones/);
    await this.page.waitForLoadState("networkidle");
  }
}
