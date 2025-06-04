import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly formRegistro: Locator;
  readonly nombreInput: Locator;
  readonly apellidoInput: Locator;
  readonly dniInput: Locator;
  readonly generoSelect: Locator;
  readonly fechaNacimientoInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repetirPasswordInput: Locator;
  readonly crearCuentaBtn: Locator;
  readonly subtituloRegistro: Locator;
  readonly fileInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Localizar el formulario de registro específicamente
    this.formRegistro = page.locator('.contenedor-form form');

    // Localizadores de cada campo del formulario
    this.nombreInput = this.formRegistro.locator('input[name="nombre"]');
    this.apellidoInput = this.formRegistro.locator('input[name="apellido"]');
    this.dniInput = this.formRegistro.locator('input[name="dni"]');
    this.generoSelect = this.formRegistro.locator('select[name="gender"]');
    this.fechaNacimientoInput = this.formRegistro.locator('input[type="date"]');
    this.emailInput = this.formRegistro.locator('input[placeholder="Ingresar Correo Electrónico"]');
    this.passwordInput = this.formRegistro.locator('input[name="password"]');
    this.repetirPasswordInput = this.formRegistro.locator('input[name="password2"]');
    this.crearCuentaBtn = this.page.locator('a.btn-crear.button, button.btn-crear.button');

    // Subtítulo visible en la pantalla de registro
    this.subtituloRegistro = page.locator('p.subtitle', {
      hasText: 'Coloca tus datos para crear tu cuenta.',
    });

    // Input para cargar archivo (foto)
    this.fileInput = this.formRegistro.locator('input[type="file"]');
  }

  // Método para navegar a la página de registro
  async navigate() {
    await this.page.goto('https://doorsticketsdev.com/');
    await this.page.locator('a.doors-button-outline', { hasText: 'Registrarse' }).click();
    await this.page.waitForURL('**/#!/register/');
  }

  // Completa el formulario de registro con los campos que se pasen como argumento
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
    // Completa solo los campos que estén definidos
    if (campos.nombre) await this.nombreInput.fill(campos.nombre);
    if (campos.apellido) await this.apellidoInput.fill(campos.apellido);
    if (campos.dni) await this.dniInput.fill(campos.dni);
    if (campos.genero) await this.generoSelect.selectOption({ label: campos.genero });
    if (campos.fechaNacimiento) await this.fechaNacimientoInput.fill(campos.fechaNacimiento);
    if (campos.email) await this.emailInput.fill(campos.email);
    if (campos.password) await this.passwordInput.fill(campos.password);
    if (campos.repetirPassword) await this.repetirPasswordInput.fill(campos.repetirPassword);

    // Si se proporcionó una imagen, la sube y cierra el popup
    if (campos.fotoPath) {
      await this.fileInput.setInputFiles(campos.fotoPath);

      const popup = this.page.locator('.popup-avatar-picker');
      if (await popup.isVisible()) {
        const terminarBtn = popup.locator('a', { hasText: 'Terminado' });
        if (await terminarBtn.isVisible()) {
          await terminarBtn.click();
        } else {
          const closeBtn = popup.locator('.popup-close');
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
          }
        }

        // Esperar un breve tiempo para que se aplique la animación de cierre
        await this.page.waitForTimeout(1000);
      }

    }
  }

  async clickCrearCuenta() {
    await this.crearCuentaBtn.click();
  }

  // Devuelve un locator para el mensaje de error asociado a un campo específico
  async getErrorLocatorPorNombreCampo(nombreCampo: string): Promise<Locator> {
    return this.formRegistro.locator(`input[name="${nombreCampo}"]`)
      .locator('xpath=parent::div//div[contains(@class, "item-input-error-message")]');
  }

  // Espera a que se muestre un modal con un texto específico
  async esperarModalConTextoEsperado(textoEsperado: string) {
    const modal = this.page.locator('.dialog-inner', { hasText: textoEsperado });
    await expect(modal).toBeVisible({ timeout: 5000 });
  }

}
