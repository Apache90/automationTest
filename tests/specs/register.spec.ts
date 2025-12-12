import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { allure } from 'allure-playwright';
import { AllureBusinessConfig } from '../config/AllureBusinessConfig';

// EPIC: Autenticación de Usuarios  
test.describe('🔐 Autenticación - Registro de Usuario', () => {
  
  test.beforeEach(() => {
    allure.epic("🔐 Autenticación de Usuarios");
    allure.feature("Registro de Usuarios");
  });

  test('Registro exitoso', async ({ page }) => {
    allure.story("Creación de Cuenta");
    allure.description('Verifica que un usuario pueda registrarse exitosamente con datos válidos');
    allure.severity('critical');

    const registerPage = new RegisterPage(page);

    await registerPage.navigate();

    await registerPage.completarFormulario({
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: '36874896',
      genero: 'Hombre',
      fechaNacimiento: '1990-10-05',
      email: `juanlester+${Date.now()}@gmail.com`,
      password: '1234567',
      repetirPassword: '1234567',
      fotoPath: 'tests/assets/foto-ejemplo.png',
    });

    await registerPage.clickCrearCuenta();

    // Esperar un poco para que se procese el registro
    await page.waitForTimeout(3000);

    // Verificar registro exitoso con el nuevo modal
    await registerPage.verificarRegistroExitoso();
  });

  test('Error cuando las contraseñas no coinciden', async ({ page }) => {

    allure.label('owner', 'Emir Segovia');
    allure.severity('high');
    allure.feature('Register');
    allure.story('Validaciones en registro de cuenta');

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.completarFormulario({
      nombre: 'Lucía',
      apellido: 'Gómez',
      dni: '34887963',
      genero: 'Mujer',
      fechaNacimiento: '1995-06-15',
      email: `lucia+${Date.now()}@gmail.com`,
      password: '1234567',
      repetirPassword: '7654321',
      fotoPath: 'tests/assets/foto-ejemplo.png',
    });

    await registerPage.clickCrearCuenta();
    await registerPage.esperarModalConTextoEsperado('Las contraseñas no coinciden.');
  });

  test('Error cuando no se ingresa email', async ({ page }) => {

    allure.label('owner', 'Emir Segovia');
    allure.severity('high');
    allure.feature('Register');
    allure.story('Validaciones en registro de cuenta');

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.completarFormulario({
      nombre: 'Carlos',
      apellido: 'Ruiz',
      dni: '32765498',
      genero: 'Hombre',
      fechaNacimiento: '1988-04-23',
      password: '1234567',
      repetirPassword: '1234567',
      fotoPath: 'tests/assets/foto-ejemplo.png',
    });

    await registerPage.clickCrearCuenta();
    await registerPage.esperarModalConTextoEsperado('Se necesita un email para el registro');
  });

  test('Error cuando no se ingresa contraseña', async ({ page }) => {

    allure.label('owner', 'Emir Segovia');
    allure.severity('high');
    allure.feature('Register');
    allure.story('Validaciones en registro de cuenta');

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.completarFormulario({
      nombre: 'Ana',
      apellido: 'Martínez',
      dni: '35987652',
      genero: 'Mujer',
      fechaNacimiento: '1992-11-09',
      email: `ana+${Date.now()}@gmail.com`,
      repetirPassword: '1234567',
      fotoPath: 'tests/assets/foto-ejemplo.png',
    });

    await registerPage.clickCrearCuenta();
    await registerPage.esperarModalConTextoEsperado('La contraseña debe tener al menos 6 caracteres.');
  });

  test('Error cuando no se carga una imagen', async ({ page }) => {

    allure.label('owner', 'Emir Segovia');
    allure.severity('high');
    allure.feature('Register');
    allure.story('Validaciones en registro de cuenta');

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.completarFormulario({
      nombre: 'Roberto',
      apellido: 'Salas',
      dni: '30111222',
      genero: 'Hombre',
      fechaNacimiento: '1985-03-12',
      email: `roberto+${Date.now()}@gmail.com`,
      password: '1234567',
      repetirPassword: '1234567',
    });

    await registerPage.clickCrearCuenta();
    await registerPage.esperarModalConTextoEsperado('La foto es requerida');
  });

  test('Error cuando se ingresa formato incorrecto de email', async ({ page }) => {

    allure.label('owner', 'Emir Segovia');
    allure.severity('high');
    allure.feature('Register');
    allure.story('Validaciones en registro de cuenta');

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.completarFormulario({
      nombre: 'Pedro',
      apellido: 'González',
      dni: '33456789',
      genero: 'Hombre',
      fechaNacimiento: '1993-07-20',
      email: 'emailinvalido', // Email con formato incorrecto
      password: '1234567',
      repetirPassword: '1234567',
      fotoPath: 'tests/assets/foto-ejemplo.png',
    });

    await registerPage.clickCrearCuenta();
    await registerPage.esperarModalConTextoEsperado('Debes ingresar un mail con formato válido');
  });

  test('Error cuando el email ya está registrado', async ({ page }) => {
    allure.label('owner', 'Emir Segovia');
    allure.severity('critical');
    allure.feature('Register');
    allure.story('Validaciones en registro de cuenta');

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.completarFormulario({
      nombre: 'Emir',
      apellido: 'Valles',
      dni: '30111222',
      genero: 'Hombre',
      fechaNacimiento: '1985-03-12',
      email: 'emirvalles90@gmail.com', // Email ya registrado
      password: '1234567',
      repetirPassword: '1234567',
      fotoPath: 'tests/assets/foto-ejemplo.png',
    });

    await registerPage.clickCrearCuenta();
    await registerPage.esperarModalConTextoEsperado("El email 'emirvalles90@gmail.com' ya está registrado.");
  });
});
