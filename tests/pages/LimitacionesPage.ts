import { Page, expect, Locator } from "@playwright/test";

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

  async seleccionarFecha(fecha: string = "15/09/2025") {
    // Click en el campo de fecha
    const campoFecha = this.page.locator('input[type="text"][placeholder*="01/02/2000 - 31/01/2051"]');
    await expect(campoFecha).toBeVisible({ timeout: 5000 });
    await campoFecha.click();
    
    // Esperar que aparezca el calendario
    const calendario = this.page.locator('.calendar.calendar-modal.modal-in');
    await expect(calendario).toBeVisible({ timeout: 5000 });
    
    // Parsear la fecha para obtener día, mes y año
    const [dia, mes, año] = fecha.split('/');
    const mesNumero = parseInt(mes);
    const añoNumero = parseInt(año);
    const diaNumero = parseInt(dia);
    
    // Esperar un momento para que el calendario se estabilice
    await this.page.waitForTimeout(500);
    
    // Navegar al año correcto usando los selectores reales
    await this.navegarAñoCalendario(calendario, añoNumero);
    
    // Navegar al mes correcto usando los selectores reales
    await this.navegarMesCalendario(calendario, mesNumero);
    
    // Seleccionar el día específico usando el formato data-date correcto
    const diaSelector = `.calendar-day[data-date="${añoNumero}-${mesNumero}-${diaNumero}"]:not(.calendar-day-prev):not(.calendar-day-next)`;
    const diaElement = calendario.locator(diaSelector);
    
    await expect(diaElement).toBeVisible({ timeout: 10000 });
    
    // Seleccionar el día (dos veces para rango desde-hasta)
    await diaElement.click({ force: true }); // Primera selección (desde)
    await this.page.waitForTimeout(200);
    await diaElement.click({ force: true }); // Segunda selección (hasta)
    
    // Click en "Listo"
    const botonListo = calendario.locator('a.button.calendar-close', { hasText: 'Listo' });
    await expect(botonListo).toBeVisible({ timeout: 5000 });
    await botonListo.click();
    
    // Esperar que el calendario se cierre
    await expect(calendario).not.toBeVisible({ timeout: 5000 });
  }

  async navegarAñoCalendario(calendario: Locator, añoObjetivo: number) {
    // Obtener el año actual mostrado usando el selector correcto
    const añoActual = await calendario.locator('.current-year-value').textContent();
    const añoActualNum = parseInt(añoActual?.trim() || '2025');
    
    if (añoActualNum === añoObjetivo) return;
    
    // Navegar al año objetivo usando los botones correctos
    const diferencia = añoObjetivo - añoActualNum;
    const boton = diferencia > 0 ? '.calendar-next-year-button' : '.calendar-prev-year-button';
    const clicks = Math.abs(diferencia);
    
    for (let i = 0; i < clicks; i++) {
      await calendario.locator(boton).click();
      await this.page.waitForTimeout(300);
    }
  }

  async navegarMesCalendario(calendario: Locator, mesObjetivo: number) {
    // Mapeo de nombres de meses a números
    const mesesNombres = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                         'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    // Obtener el mes actual usando el selector correcto
    const mesActualTexto = await calendario.locator('.current-month-value').textContent();
    const mesActualNum = mesesNombres.findIndex(m => mesActualTexto?.toLowerCase().includes(m)) + 1;
    
    if (mesActualNum === mesObjetivo) return;
    
    // Navegar al mes objetivo
    const diferencia = mesObjetivo - mesActualNum;
    let clicks = Math.abs(diferencia);
    let boton = '.calendar-next-month-button';
    
    if (diferencia < 0) {
      boton = '.calendar-prev-month-button';
    } else if (diferencia > 6) {
      // Es más corto ir hacia atrás
      boton = '.calendar-prev-month-button';
      clicks = 12 - diferencia;
    }
    
    for (let i = 0; i < clicks; i++) {
      await calendario.locator(boton).click();
      await this.page.waitForTimeout(300);
    }
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

  async clickEliminarLimitacion(nombreCupon: string) {
    // Determinar qué sección desplegar basándose en el nombre del cupón
    let seccionTexto = "";
    if (nombreCupon.includes("DNI PAGO") || nombreCupon.includes("DNI'S PAGO")) {
      seccionTexto = "DNI'S PAGO";
    } else if (nombreCupon.includes("DNI")) {
      seccionTexto = "DNI'S";
    } else if (nombreCupon.includes("QR") && nombreCupon.includes("$")) {
      seccionTexto = "QR'S PAGO";
    } else if (nombreCupon.includes("QR")) {
      seccionTexto = "QR'S";
    }
    
    if (seccionTexto) {
      // Hacer click en la sección correspondiente para desplegarla usando un selector más específico
      const seccionCupon = this.page.locator(`.couponType.svelte-9yezak`).filter({ hasText: new RegExp(`^${seccionTexto}\\s+Cantidad\\s+Acciones`) });
      await expect(seccionCupon).toBeVisible({ timeout: 5000 });
      await seccionCupon.click();
      
      // Esperar un momento para que se despliegue
      await this.page.waitForTimeout(1000);
    }
    
    // Buscar el componente que contiene la limitación específica
    const limitacionContainer = this.page.locator('.grid-container').filter({
      has: this.page.locator('.item-title', { hasText: nombreCupon })
    });
    
    await expect(limitacionContainer).toBeVisible({ timeout: 5000 });
    
    // Buscar el botón de eliminar (icono trash) - usar un selector más simple basado en el HTML real
    const botonEliminar = limitacionContainer.locator('.margin-horizontal i.f7-icons:has-text("trash")').locator('xpath=following-sibling::div//a');
    
    // Si no encuentra con el selector anterior, probar alternativas
    if (!(await botonEliminar.isVisible())) {
      // Alternativa 1: buscar directamente el enlace después del icono trash
      const botonEliminarAlt1 = limitacionContainer.locator('i.f7-icons:has-text("trash") + div a');
      if (await botonEliminarAlt1.isVisible()) {
        await botonEliminarAlt1.click();
        return;
      }
      
      // Alternativa 2: buscar cualquier enlace cerca del icono trash
      const botonEliminarAlt2 = limitacionContainer.locator('.margin-horizontal:has(i.f7-icons:has-text("trash")) a');
      if (await botonEliminarAlt2.isVisible()) {
        await botonEliminarAlt2.click();
        return;
      }
      
      // Alternativa 3: hacer click directamente en el div que contiene el enlace invisible
      const divConEnlace = limitacionContainer.locator('i.f7-icons:has-text("trash") + div');
      if (await divConEnlace.isVisible()) {
        await divConEnlace.click();
        return;
      }
    } else {
      await botonEliminar.click();
    }
  }

  async confirmarEliminacionLimitacion() {
    // Esperar el modal de confirmación
    const modalConfirmacion = this.page.locator('.dialog.dialog-buttons-1.custom-dialog-background.modal-in');
    await expect(modalConfirmacion).toBeVisible({ timeout: 5000 });
    
    // Verificar contenido del modal
    await expect(modalConfirmacion.locator('.dialog-title')).toContainText('DOORS');
    await expect(modalConfirmacion.locator('.dialog-text')).toContainText('¿Estás seguro que deseas eliminar esta limitación?');
    
    // Click en "Confirmar"
    const botonConfirmar = modalConfirmacion.locator('.dialog-button', { hasText: 'Confirmar' });
    await expect(botonConfirmar).toBeVisible({ timeout: 5000 });
    await botonConfirmar.click();
    
    // Esperar que el modal de confirmación se cierre
    await expect(modalConfirmacion).not.toBeVisible({ timeout: 5000 });
  }

  async esperarModalEliminacionExitosa() {
    // Esperar el modal de éxito
    const modalExito = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modalExito).toBeVisible({ timeout: 5000 });
    
    // Verificar contenido del modal de éxito
    await expect(modalExito.locator('.dialog-title')).toContainText('DOORS');
    await expect(modalExito.locator('.dialog-text')).toContainText('¡Limitación eliminada correctamente!');
    
    // Click en "OK" para cerrar
    const botonOK = modalExito.locator('.dialog-button', { hasText: 'OK' });
    await expect(botonOK).toBeVisible({ timeout: 5000 });
    await botonOK.click();
    
    // Esperar que el modal se cierre
    await expect(modalExito).not.toBeVisible({ timeout: 5000 });
  }
}
