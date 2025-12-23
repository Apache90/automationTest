import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly registrarseLink: Locator;
  
  // PASO 1: Datos personales
  readonly fileInput: Locator;
  readonly nombreInput: Locator;
  readonly apellidoInput: Locator;
  readonly dniInput: Locator;
  readonly generoSelect: Locator;
  readonly fechaNacimientoInput: Locator;
  readonly siguienteBtn: Locator;
  
  // PASO 2: Acceso
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repetirPasswordInput: Locator;
  readonly crearCuentaBtn: Locator;
  
  // Indicadores de pasos
  readonly paso1Indicator: Locator;
  readonly paso2Indicator: Locator;

  constructor(page: Page) {
    this.page = page;

    // Botón de registrarse en login
    this.registrarseLink = page.locator('a.doors-button-outline.button[href="/register/"]');

    // PASO 1: Datos personales
    // Usar .page-current[data-name="register"] que identifica únicamente la página de registro activa
    this.fileInput = page.locator('.page-current[data-name="register"] input[type="file"][accept="image/png,image/gif,image/jpeg"]');
    this.nombreInput = page.locator('.page-current[data-name="register"] input[type="text"][placeholder="Ingresar Nombre"]');
    this.apellidoInput = page.locator('.page-current[data-name="register"] input[type="text"][placeholder="Ingresar Apellido"]');
    this.dniInput = page.locator('.page-current[data-name="register"] input[type="number"][placeholder="Ingresar DNI"]');
    this.generoSelect = page.locator('.page-current[data-name="register"] select[required][data-validate="true"]');
    this.fechaNacimientoInput = page.locator('.page-current[data-name="register"] input[type="date"][required]');
    this.siguienteBtn = page.locator('.page-current[data-name="register"] a.btn-crear.button[href="#"]', { hasText: 'Siguiente' });

    // PASO 2: Acceso (estos elementos aparecen después de hacer clic en "Siguiente")
    // Usar .page-current[data-name="register"] que identifica únicamente la página de registro activa
    this.emailInput = page.locator('.page-current[data-name="register"] input[type="email"]');
    this.passwordInput = page.locator('.page-current[data-name="register"] input[type="password"]').first();
    this.repetirPasswordInput = page.locator('.page-current[data-name="register"] input[type="password"]').nth(1);
    this.crearCuentaBtn = page.locator('.page-current[data-name="register"] a.btn-crear.button', { hasText: 'Crear Mi Cuenta' });

    // Indicadores de pasos
    this.paso1Indicator = page.locator('.page-current[data-name="register"] div.svelte-met81b.active', { hasText: '1. Datos personales' });
    this.paso2Indicator = page.locator('.page-current[data-name="register"] div.svelte-met81b.active', { hasText: '2. Acceso' });
  }

  // Método para navegar a la página de registro
  async navigate() {
    await this.page.goto('https://www.doorstickets.com/#!/login/');
    await this.registrarseLink.click();
    await this.page.waitForURL('**/#!/register/');
    await this.page.waitForLoadState('networkidle');
    
    // Verificar que estamos en el paso 1
    await expect(this.paso1Indicator).toBeVisible();
  }

  // Completa el PASO 1: Datos personales
  async completarDatosPersonales(campos: {
    nombre?: string;
    apellido?: string;
    dni?: string;
    genero?: string;
    fechaNacimiento?: string;
    fotoPath?: string;
  }) {
    // Si se proporcionó una imagen, la sube primero
    if (campos.fotoPath) {
      await this.fileInput.setInputFiles(campos.fotoPath);
      await this.page.waitForTimeout(1000); // Esperar a que se cargue la imagen
      
      // Cerrar el popup de avatar si aparece
      const popup = this.page.locator('.popup-avatar-picker');
      if (await popup.isVisible()) {
        // Hacer clic en el botón "Terminado"
        const terminadoBtn = this.page.locator('.popup-avatar-picker a.popup-avatar-picker-crop-image', { hasText: 'Terminado' });
        await terminadoBtn.click();
        await this.page.waitForTimeout(500); // Esperar a que se cierre el popup
      }
    }

    // Completa solo los campos que estén definidos
    if (campos.nombre) await this.nombreInput.fill(campos.nombre);
    if (campos.apellido) await this.apellidoInput.fill(campos.apellido);
    if (campos.dni) await this.dniInput.fill(campos.dni);
    
    if (campos.genero) {
      // Mapeo de valores de género
      const generoMap: { [key: string]: string } = {
        'Hombre': 'M',
        'Masculino': 'M',
        'Mujer': 'F',
        'Femenino': 'F',
        'No me siento identificado': 'X',
        'X': 'X'
      };
      const valorGenero = generoMap[campos.genero] || campos.genero;
      await this.generoSelect.selectOption(valorGenero);
    }
    
    if (campos.fechaNacimiento) await this.fechaNacimientoInput.fill(campos.fechaNacimiento);
  }

  // Hacer clic en "Siguiente" para pasar al paso 2
  async clickSiguiente() {
    // Asegurarse de que el botón "Siguiente" esté visible antes de hacer clic
    await this.siguienteBtn.waitFor({ state: 'visible' });
    
    // Hacer scroll al botón si es necesario
    await this.siguienteBtn.scrollIntoViewIfNeeded();
    
    // Hacer clic usando force para evitar interceptaciones
    await this.siguienteBtn.click({ force: true });
    
    // Esperar a que el paso 2 esté activo
    await this.page.waitForTimeout(2000);
    await expect(this.paso2Indicator).toBeVisible({ timeout: 10000 });
  }

  // Completa el PASO 2: Datos de acceso
  async completarDatosAcceso(campos: {
    email?: string;
    password?: string;
    repetirPassword?: string;
  }) {
    // Esperar extra para que Svelte complete el renderizado
    await this.page.waitForTimeout(2000);
    
    // Verificar que el paso 2 esté activo
    await this.paso2Indicator.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Paso 2 activo');
    
    // Esperar a que el formulario del paso 2 esté visible
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Formulario paso 2 renderizado');
    
    // Llenar email usando JavaScript evaluate para manejar Svelte
    if (campos.email) {
      await this.page.evaluate((email) => {
        const registerPage = document.querySelector('.page-current[data-name="register"]');
        if (registerPage) {
          const emailInput = registerPage.querySelector('input[type="email"]') as HTMLInputElement;
          if (emailInput) {
            emailInput.value = email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            emailInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }, campos.email);
      console.log('✓ Email ingresado');
    }
    
    // Llenar password usando JavaScript evaluate
    if (campos.password) {
      await this.page.evaluate((password) => {
        const registerPage = document.querySelector('.page-current[data-name="register"]');
        if (registerPage) {
          const passwordInputs = registerPage.querySelectorAll('input[type="password"]');
          // El primer input de password es "Ingresar Contraseña"
          const passwordInput = passwordInputs[0] as HTMLInputElement;
          if (passwordInput) {
            passwordInput.value = password;
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }, campos.password);
      console.log('✓ Contraseña ingresada');
    }
    
    // Llenar repetir password usando JavaScript evaluate
    if (campos.repetirPassword) {
      await this.page.evaluate((repetirPassword) => {
        const registerPage = document.querySelector('.page-current[data-name="register"]');
        if (registerPage) {
          const passwordInputs = registerPage.querySelectorAll('input[type="password"]');
          // El segundo input de password es "Repetir Contraseña"
          const repetirInput = passwordInputs[1] as HTMLInputElement;
          if (repetirInput) {
            repetirInput.value = repetirPassword;
            repetirInput.dispatchEvent(new Event('input', { bubbles: true }));
            repetirInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }, campos.repetirPassword);
      console.log('✓ Repetir contraseña ingresada');
    }
  }

  // Método combinado para completar todo el formulario (mantener compatibilidad con tests existentes)
  async completarFormulario(campos: {
    nombre?: string;
    apellido?: string;
    dni?: string;
    genero?: string;
    fechaNacimiento?: string;
    email?: string;
    password?: string;
    repetirPassword?: string;
    fotoPath?: string;
  }) {
    // Paso 1: Datos personales
    await this.completarDatosPersonales({
      nombre: campos.nombre,
      apellido: campos.apellido,
      dni: campos.dni,
      genero: campos.genero,
      fechaNacimiento: campos.fechaNacimiento,
      fotoPath: campos.fotoPath
    });

    // Hacer clic en "Siguiente" para ir al paso 2
    await this.clickSiguiente();

    // Paso 2: Datos de acceso
    await this.completarDatosAcceso({
      email: campos.email,
      password: campos.password,
      repetirPassword: campos.repetirPassword
    });
  }

  // Hacer clic en "Crear Mi Cuenta" (paso 2)
  async clickCrearCuenta() {
    // Esperar a que el botón esté disponible después de llenar los inputs
    await this.page.waitForTimeout(1000);
    
    // Buscar el botón de crear cuenta usando JavaScript para manejar el renderizado de Svelte
    await this.page.evaluate(() => {
      const registerPage = document.querySelector('.page-current[data-name="register"]');
      if (registerPage) {
        const buttons = Array.from(registerPage.querySelectorAll('.actions-row a.btn-crear.button'));
        const crearBtn = buttons.find(btn => btn.textContent?.includes('Crear Mi Cuenta')) as HTMLElement;
        if (crearBtn) {
          crearBtn.click();
        }
      }
    });
    
    console.log('✓ Clic en Crear Mi Cuenta');
  }

  // Espera a que se muestre un modal con un texto específico
  async esperarModalConTextoEsperado(textoEsperado: string) {
    const modal = this.page.locator('.dialog-inner', { hasText: textoEsperado });
    await expect(modal).toBeVisible({ timeout: 10000 });
  }

  // Verificar modal de éxito
  async verificarRegistroExitoso() {
    // Esperar a que aparezca cualquier modal
    await this.page.waitForSelector('.dialog.modal-in', { state: 'visible', timeout: 15000 });
    
    // Verificar si es el modal de éxito
    const modalExito = this.page.locator('.dialog-inner', {
      hasText: 'Registro completado correctamente'
    });
    
    await expect(modalExito).toBeVisible({ timeout: 5000 });
  }
}
