import { Page, expect, Locator } from "@playwright/test";

export class LimitacionesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navegarAVendedores() {
    // Navegar a la sección de vendedores
    // (evitar hardcode de /manager/71; el id puede variar por usuario/entorno)
    const linkVendedores = this.page
      .locator('a.item-link[href$="/vendedores/"]')
      .or(this.page.locator('a.item-link:has(.item-title:has-text("Vendedores"))'));

    await expect(linkVendedores.first()).toBeVisible({ timeout: 20000 });
    await linkVendedores.first().click();

    await expect(this.page).toHaveURL(/\/#!\/manager\/(\d+)\/vendedores(\/|$)/, { timeout: 20000 });
    await this.page.waitForLoadState("networkidle");
  }

  async clickLimitacionesVendedor(emailVendedor: string) {
    // Buscar el vendedor por email y hacer click en el ícono/link de limitaciones.
    // La UI puede renderizar el email en distintos contenedores (no siempre .item-footer span).
    await expect(this.page.getByRole('heading', { name: /Vendedores/i })).toBeVisible({ timeout: 20000 });
    const emailText = this.page.getByText(emailVendedor, { exact: true });
    await expect(emailText).toBeVisible({ timeout: 20000 });

    // IMPORTANTE: NO usar contenedores grandes como .vendor-grid porque contienen
    // varios emails y terminaríamos clickeando el primer link de limitaciones.
    const cardVendedor = this.page.locator('.vendor-card', {
      has: this.page.locator('.vendor-email', { hasText: emailVendedor }),
    });

    if (await cardVendedor.count()) {
      const linkLimitaciones = cardVendedor
        .first()
        .locator('a[href*="/vendedores/"][href$="/limitaciones/"]')
        .first();

      await expect(linkLimitaciones).toBeVisible({ timeout: 20000 });
      await linkLimitaciones.click();
    } else {
      // Fallback (layout viejo tipo lista): buscar el ancestro más cercano que contenga el link.
      const contenedorVendedor = emailText.locator(
        'xpath=ancestor::*[self::div or self::li][.//a[contains(@href,"/vendedores/") and contains(@href,"/limitaciones/")]][1]'
      );

      const linkLimitaciones = contenedorVendedor
        .locator('a[href*="/vendedores/"][href$="/limitaciones/"]')
        .first();

      await expect(contenedorVendedor).toBeVisible({ timeout: 20000 });
      await expect(linkLimitaciones).toBeVisible({ timeout: 20000 });
      await linkLimitaciones.click();
    }

    // Verificar que estamos en la página de limitaciones del vendedor
    await expect(this.page).toHaveURL(/\/#!\/manager\/(\d+)\/vendedores\/[^/]+\/limitaciones(\/|$)/, { timeout: 20000 });
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

  async seleccionarFechaEdicion(fecha: string = "15/09/2025") {
    // Click en el campo de fecha en modo edición (selector diferente)
    const campoFecha = this.page.locator('input[type="text"]')
      .or(this.page.locator('input[placeholder*="periodo de vigencia"]'))
      .or(this.page.locator('input[placeholder*="fecha"]'))
      .first();
    
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

  async ingresarCantidadEdicion(cantidad: string) {
    // Ingresar la cantidad en el campo correspondiente (modo edición)
    const campoCantidad = this.page.locator('input[name="cantidad"]')
      .or(this.page.locator('input[type="number"]'))
      .first();
    
    await expect(campoCantidad).toBeVisible({ timeout: 5000 });
    await campoCantidad.clear();
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

  async deseleccionarDia(dia: string) {
    // Mapeo de letras de días a iconos
    const mapeoDias: { [key: string]: string } = {
      'L': 'i.fa-solid.fa-l', // Lunes
      'M': 'i.fa-solid.fa-m', // Martes
      'X': 'i.fa-solid.fa-x', // Miércoles
      'J': 'i.fa-solid.fa-j', // Jueves
      'V': 'i.fa-solid.fa-v', // Viernes
      'S': 'i.fa-solid.fa-s', // Sábado
      'D': 'i.fa-solid.fa-d'  // Domingo
    };

    const iconoDia = mapeoDias[dia.toUpperCase()];
    if (!iconoDia) {
      throw new Error(`Día no válido: ${dia}. Use L, M, X, J, V, S, D`);
    }

    // Buscar el botón que contiene el icono específico y que esté activo
    const botonDia = this.page.locator(`a.button:has(${iconoDia})`);
    await expect(botonDia).toBeVisible({ timeout: 5000 });
    
    // Solo hacer click si el botón está activo (tiene la clase activa)
    const clases = await botonDia.getAttribute('class');
    if (clases && clases.includes('activo')) {
      await botonDia.click();
      await this.page.waitForTimeout(200); // Pequeña pausa después del click
    }
  }

  async clickCrearLimitacion() {
    // Click en el botón "CREAR LIMITACIÓN"
    const botonCrear = this.page.locator('a.btn-agregarLimitaciones.button.button-fill', { hasText: 'CREAR LIMITACIÓN' });
    await expect(botonCrear).toBeVisible({ timeout: 5000 });
    await botonCrear.click();
  }

  async clickGuardarCambios() {
    // Click en el botón "MODIFICAR LIMITACIÓN" para guardar cambios
    const botonModificar = this.page.locator('a.btn-modificarLimitaciones.button', { hasText: 'MODIFICAR LIMITACIÓN' });
    
    await expect(botonModificar).toBeVisible({ timeout: 5000 });
    await botonModificar.click();
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

  async esperarModalModificacionExitosa() {
    // Esperar el modal de modificación exitosa
    const modal = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Verificar que contiene el título y mensaje de éxito para modificación
    await expect(modal.locator('.dialog-title')).toContainText('Excelente!');
    await expect(modal.locator('.dialog-text')).toContainText('Limitación modificada correctamente!');
    
    // Cerrar el modal
    await modal.locator('.dialog-button', { hasText: 'OK' }).click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
    
    // Verificar que regresamos a la página de limitaciones del vendedor
    await expect(this.page).toHaveURL(/limitaciones\/$/);
  }

  async clickEditarLimitacion(nombreLimitacion: string) {
    // Determinar qué sección desplegar basándose en el nombre de la limitación
    let seccionTexto = "";
    if (nombreLimitacion.includes("DNI PAGO") || nombreLimitacion.includes("DNI'S PAGO")) {
      seccionTexto = "DNI'S PAGO";
    } else if (nombreLimitacion.includes("DNI")) {
      seccionTexto = "DNI'S";
    } else if (nombreLimitacion.includes("QR") && nombreLimitacion.includes("$")) {
      seccionTexto = "QR'S PAGO";
    } else if (nombreLimitacion.includes("QR")) {
      seccionTexto = "QR'S";
    }

    const headingLimitaciones = this.page.getByRole('heading', { name: /Limitaciones/i });
    await expect(headingLimitaciones).toBeVisible({ timeout: 20000 });

    // Scopear al "page" correcto (en SPA conviven varias vistas en el DOM)
    let scope = headingLimitaciones.locator('xpath=ancestor::*[contains(@class,"page")][1]');
    if ((await scope.count()) === 0) {
      scope = this.page.locator('.page').filter({ has: headingLimitaciones }).first();
    }

    const textoLimitacion = scope.getByText(nombreLimitacion).first();
    const textoVisibleAntes = (await textoLimitacion.count()) > 0 && await textoLimitacion.isVisible();

    // Desplegar la sección correspondiente solo si hace falta
    if (seccionTexto && !textoVisibleAntes) {
      const seccionCupon = scope
        .locator('.couponType')
        .filter({ has: scope.locator('.hdr-title', { hasText: seccionTexto }) })
        .first()
        .or(scope.locator('.couponType').filter({ hasText: seccionTexto }).first());

      await expect(seccionCupon).toBeVisible({ timeout: 20000 });
      await seccionCupon.click();
      await this.page.waitForTimeout(500);
    }

    await expect(textoLimitacion).toBeVisible({ timeout: 20000 });

    // Igual que con eliminar: priorizar .limit-row (ahí viven las acciones)
    const limitacionRow = textoLimitacion.locator('xpath=ancestor::*[contains(@class,"limit-row")][1]');
    const limitacionContainerFallback = textoLimitacion.locator(
      'xpath=ancestor::*[self::li or contains(@class,"grid-container")][1]'
    );
    const limitacionContainer = (await limitacionRow.count()) > 0 ? limitacionRow : limitacionContainerFallback;

    await expect(limitacionContainer).toBeVisible({ timeout: 20000 });
    await limitacionContainer.scrollIntoViewIfNeeded();

    // Botón editar (pencil): puede aparecer como texto "pencil" + link href="#".
    const actionWrapPencil = limitacionContainer.locator('.action-wrap').filter({ hasText: 'pencil' }).first();
    const linkPencil = actionWrapPencil.locator('a.button').first().or(actionWrapPencil.locator('a[href="#"]').first());

    if ((await linkPencil.count()) > 0) {
      await linkPencil.click({ force: true, timeout: 20000 });
    } else {
      // Fallback: link siguiente al texto "pencil" dentro de la fila
      const linkPencilCercano = limitacionContainer.locator('xpath=.//*[normalize-space()="pencil"]/following::a[1]');
      await expect(linkPencilCercano.first()).toBeAttached({ timeout: 20000 });
      await linkPencilCercano.first().click({ force: true, timeout: 20000 });
    }

    await this.page.waitForLoadState('networkidle');
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
    
    const headingLimitaciones = this.page.getByRole('heading', { name: /Limitaciones/i });
    await expect(headingLimitaciones).toBeVisible({ timeout: 20000 });

    // Tomar el contenedor de la página a partir del heading (no depender de page-current;
    // a veces conviven varias páginas en DOM).
    let scope = headingLimitaciones.locator('xpath=ancestor::*[contains(@class,"page")][1]');
    if ((await scope.count()) === 0) {
      scope = this.page.locator('.page').filter({ has: headingLimitaciones }).first();
    }

    const textoLimitacion = scope.getByText(nombreCupon).first();
    const textoVisibleAntes = (await textoLimitacion.count()) > 0 && await textoLimitacion.isVisible();

    // Si la sección está colapsada, el texto puede no estar visible. Solo toggleamos si hace falta.
    if (seccionTexto && !textoVisibleAntes) {
      // Expandir la sección correspondiente (sin depender de clases svelte)
      const seccionCupon = scope
        .locator('.couponType')
        .filter({ has: scope.locator('.hdr-title', { hasText: seccionTexto }) })
        .first()
        .or(scope.locator('.couponType').filter({ hasText: seccionTexto }).first());

      await expect(seccionCupon).toBeVisible({ timeout: 20000 });
      await seccionCupon.click();
      await this.page.waitForTimeout(500);
    }

    await expect(textoLimitacion).toBeVisible({ timeout: 20000 });

    // Contenedor de la limitación:
    // IMPORTANTE: en el layout nuevo el texto vive dentro de un <li> (limit-main) pero
    // las acciones (pencil/trash) viven fuera, dentro de .limit-row. Si nos quedamos en <li>
    // nunca vamos a encontrar los botones. Por eso priorizamos .limit-row.
    const limitacionRow = textoLimitacion.locator('xpath=ancestor::*[contains(@class,"limit-row")][1]');
    const limitacionContainerFallback = textoLimitacion.locator(
      'xpath=ancestor::*[self::li or contains(@class,"grid-container")][1]'
    );
    const limitacionContainer = (await limitacionRow.count()) > 0 ? limitacionRow : limitacionContainerFallback;

    await expect(limitacionContainer).toBeVisible({ timeout: 20000 });
    await limitacionContainer.scrollIntoViewIfNeeded();

    const modalConfirmacion = this.page.locator('.dialog.dialog-buttons-1.custom-dialog-background.modal-in');
    const modalSeAbrio = async () => (await modalConfirmacion.count()) > 0 && await modalConfirmacion.isVisible();
    const intentarClickYVerificarModal = async (target: Locator) => {
      if ((await target.count()) === 0) return false;
      await target.first().click({ force: true, timeout: 20000 });
      try {
        await modalConfirmacion.waitFor({ state: 'visible', timeout: 2500 });
        return true;
      } catch {
        return await modalSeAbrio();
      }
    };

    // Botón eliminar (trash): en algunos snapshots el árbol accesible muestra
    // "text: trash" + un "link" (href="#") sin exponer el <i.f7-icons>.
    // Por eso NO dependemos de i.f7-icons; buscamos el action-wrap que contiene el texto "trash".
    const actionWrapTrash = limitacionContainer.locator('.action-wrap').filter({ hasText: 'trash' }).first();

    // Estrategia 1: click en el overlay/link dentro del action-wrap (preferir a.button)
    const linkTrash = actionWrapTrash.locator('a.button').first().or(actionWrapTrash.locator('a[href="#"]').first());
    if (await intentarClickYVerificarModal(linkTrash)) return;

    // Estrategia 2: click en el contenedor action-wrap
    if (await intentarClickYVerificarModal(actionWrapTrash)) return;

    // Estrategia 3: XPath cerca del texto "trash" dentro de la fila (link siguiente)
    const linkTrashCercano = limitacionContainer.locator(
      'xpath=.//*[normalize-space()="trash"]/following::a[1]'
    );
    if (await intentarClickYVerificarModal(linkTrashCercano)) return;

    // Último recurso: dispatchEvent (bypass de actionability/overlays)
    try {
      await linkTrash.dispatchEvent('click');
      if (await modalSeAbrio()) return;
    } catch {
      // no-op
    }
    try {
      await linkTrashCercano.dispatchEvent('click');
      if (await modalSeAbrio()) return;
    } catch {
      // no-op
    }
    await actionWrapTrash.dispatchEvent('click');
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

  // ========== MÉTODOS PARA EXPORTAR LIMITACIONES ==========

  async clickExportarLimitaciones() {
    // Buscar el botón "EXPORTAR LIMITACIONES"
    const botonExportar = this.page.locator('a.btn-exportarLimitaciones.button', { hasText: 'EXPORTAR LIMITACIONES' });
    await expect(botonExportar).toBeVisible({ timeout: 5000 });
    await botonExportar.click();
    
    // Esperar que aparezca el modal de exportación
    const modalExportar = this.page.locator('.popupcopiarlimitaciones.popup.modal-in');
    await expect(modalExportar).toBeVisible({ timeout: 5000 });
    await expect(modalExportar.locator('.title')).toContainText('Copiar limitaciones');
  }

  async seleccionarVendedoresDestino(vendedores: string[]) {
    // Click en el smart select de vendedores
    const smartSelectVendedores = this.page.locator('.item-link.smart-select').filter({
      has: this.page.locator('.item-title', { hasText: 'Seleccione vendedores' })
    });
    await expect(smartSelectVendedores).toBeVisible({ timeout: 5000 });
    await smartSelectVendedores.click();
    
    // Esperar que aparezca el modal de selección
    await this.page.waitForTimeout(1000); // Esperar a que se abra el modal
    
    // Seleccionar cada vendedor por email
    for (const vendedor of vendedores) {
      // Buscar el checkbox por el texto del vendedor usando el patrón específico del HTML
      const labelVendedor = this.page.locator(`label.item-checkbox.item-checkbox-icon-start.item-content:has(.item-title:has-text("${vendedor}"))`);
      
      if (await labelVendedor.isVisible()) {
        await labelVendedor.click();
        await this.page.waitForTimeout(500); // Pausa entre selecciones
      } else {
        // Fallback: buscar por contenido parcial
        const labelVendedorFallback = this.page.locator(`label.item-checkbox:has-text("${vendedor}")`);
        if (await labelVendedorFallback.isVisible()) {
          await labelVendedorFallback.click();
          await this.page.waitForTimeout(500);
        }
      }
    }
    
    // Cerrar el modal de vendedores usando el selector exacto del HTML
    const botonCerrarVendedores = this.page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'vendedores\']"]');
    await expect(botonCerrarVendedores).toBeVisible({ timeout: 5000 });
    await botonCerrarVendedores.click();
    await this.page.waitForTimeout(1000); // Esperar a que se cierre el modal
  }

  async seleccionarCuponesAExportar(cupones: string[]) {
    // Click en el smart select de cupones
    const smartSelectCupones = this.page.locator('.item-link.smart-select').filter({
      has: this.page.locator('.item-title', { hasText: 'Seleccione cupones' })
    });
    await expect(smartSelectCupones).toBeVisible({ timeout: 5000 });
    await smartSelectCupones.click();
    
    // Esperar que aparezca el modal de selección de cupones
    await this.page.waitForTimeout(1000); // Esperar a que se abra el modal
    
    // Seleccionar todos los cupones especificados usando el patrón específico del HTML
    for (const cupon of cupones) {
      const labelCupon = this.page.locator(`label.item-checkbox.item-checkbox-icon-start.item-content:has(.item-title:has-text("${cupon}"))`);
      await expect(labelCupon).toBeVisible({ timeout: 5000 });
      await labelCupon.click();
      await this.page.waitForTimeout(500); // Pausa entre selecciones
    }
    
    // Cerrar el modal de cupones usando el selector exacto del HTML
    const botonCerrarCupones = this.page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'cupones\']"]');
    await expect(botonCerrarCupones).toBeVisible({ timeout: 5000 });
    await botonCerrarCupones.click();
    await this.page.waitForTimeout(1000); // Esperar a que se cierre el modal
  }

  async confirmarExportacionLimitaciones() {
    // Click en el botón "EXPORTAR LIMITACIONES" final
    const botonConfirmarExportacion = this.page.locator('a.btn-cerrarSesion.button', { hasText: 'EXPORTAR LIMITACIONES' });
    await expect(botonConfirmarExportacion).toBeVisible({ timeout: 5000 });
    await botonConfirmarExportacion.click();
  }

  async esperarModalExportacionExitosa() {
    // Esperar el modal de éxito
    const modalExito = this.page.locator('.dialog.dialog-buttons-1.modal-in');
    await expect(modalExito).toBeVisible({ timeout: 5000 });
    
    // Verificar contenido del modal de éxito
    await expect(modalExito.locator('.dialog-title')).toContainText('Excelente!');
    await expect(modalExito.locator('.dialog-text')).toContainText('Limitaciones exportadas correctamente.');
    
    // Click en "OK" para cerrar
    const botonOK = modalExito.locator('.dialog-button', { hasText: 'OK' });
    await expect(botonOK).toBeVisible({ timeout: 5000 });
    await botonOK.click();
    
    // Esperar que el modal se cierre
    await expect(modalExito).not.toBeVisible({ timeout: 5000 });
  }

  async volverAtrasDesdeDetalles() {
    // Esperar que no haya modales activos antes de hacer click
    await this.page.waitForTimeout(2000);
    
    // Cerrar cualquier modal que pueda estar abierto
    const modalBackdrop = this.page.locator('.dialog-backdrop');
    if (await modalBackdrop.isVisible()) {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(1000);
    }
    
    // Intentar múltiples estrategias para hacer click en "Volver atrás"
    try {
      // Estrategia 1: Click forzado en el primer botón backbutton
      const botonVolver = this.page.locator('button.backbutton').first();
      await botonVolver.click({ force: true });
    } catch (error) {
      try {
        // Estrategia 2: Usar getByText para encontrar el botón
        const botonVolverTexto = this.page.getByText('Volver atrás').first();
        await botonVolverTexto.click({ force: true });
      } catch (error2) {
        // Estrategia 3: Navegar directamente mediante URL
        const currentUrl = this.page.url();
        const baseUrl = currentUrl.replace(/\/limitaciones\/.*$/, '/');
        await this.page.goto(baseUrl);
      }
    }
    
    // Verificar que volvemos a la lista de vendedores
    await expect(this.page).toHaveURL(/vendedores\/?$/);
    await this.page.waitForLoadState("networkidle");
  }

  async verificarLimitacionesExportadas(emailVendedorDestino: string) {
    // Buscar el vendedor destino y hacer click en sus limitaciones
    await this.clickLimitacionesVendedor(emailVendedorDestino);
    
    // Verificar que aparece al menos una sección de cupones exportada (DNI'S PAGO como ejemplo)
    const seccionCupon = this.page.locator('.couponType').filter({
      has: this.page.locator('div:has-text("DNI\'S PAGO")')
    });
    
    // Si encontramos la sección de cupones, la exportación fue exitosa
    await expect(seccionCupon).toBeVisible({ timeout: 10000 });
  }
}
