import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { cerrarModalSiExiste } from '../helpers/loginmodals';
import { CommonHelpers } from '../helpers/CommonHelpers';
import { TestConfig } from '../config/TestConfig';
import { allure } from 'allure-playwright';
import { AllureBusinessConfig } from '../config/AllureBusinessConfig';

// EPIC: Autenticación de Usuarios
test.describe('🔐 Autenticación - Inicio de Sesión', () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
        // Aplicar etiquetas de negocio
        allure.epic("🔐 Autenticación de Usuarios");
        allure.feature("Inicio de Sesión");
        
        // Configurar manejo de diálogos
        CommonHelpers.setupDialogHandler(page);
        
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        
        // Esperar a que la página cargue completamente
        await CommonHelpers.waitForPageLoad(page);
    });

    test('Debe mostrar error si no se ingresa el email', async ({ page }) => {
        allure.story("Validación de Credenciales");
        allure.description('Verifica que se muestre un error cuando el campo email está vacío');
        allure.severity('critical');

        const loginPage = new LoginPage(page);

        await loginPage.passwordInput.fill('123456');
        await loginPage.emailInput.fill('algo');
        await loginPage.emailInput.fill('');
        await loginPage.emailInput.blur();

        await loginPage.loginButton.click();
        await cerrarModalSiExiste(page);

        const emailError = await loginPage.getEmailError();
        await expect(emailError).toBeVisible({ timeout: 7000 });
    });

    test('Debe mostrar error si no se ingresa la contraseña', async ({ page }) => {
        const loginPage = new LoginPage(page);

        allure.label('owner', 'Emir Valles');
        allure.severity('critical');
        allure.feature('Login');
        allure.story('Validación de campos vacíos');

        await loginPage.emailInput.fill('emirvalles90@gmail.com');
        await loginPage.passwordInput.fill('algo');
        await loginPage.passwordInput.fill('');
        await loginPage.passwordInput.blur();

        await loginPage.loginButton.click();
        await cerrarModalSiExiste(page);

        const passwordError = await loginPage.getPasswordError();
        await expect(passwordError).toBeVisible({ timeout: 7000 });
    });

    test('Debe mostrar mensaje de error si el email no contiene "@"', async ({ page }) => {
        const loginPage = new LoginPage(page);

        allure.label('owner', 'Emir Valles');
        allure.severity('minor');
        allure.feature('Login');
        allure.story('Formato de email inválido');

        await loginPage.emailInput.fill('emirvalles90gmail.com');
        await loginPage.emailInput.blur();

        const emailError = await loginPage.getEmailError();
        await expect(emailError).toBeVisible({ timeout: 5000 });
    });

    test('Debe mostrar error si el email es correcto pero la contraseña incorrecta', async ({ page }) => {
        const loginPage = new LoginPage(page);

        allure.label('owner', 'Emir Valles');
        allure.severity('normal');
        allure.feature('Login');

        allure.story('Credenciales inválidas');

        await loginPage.login('emirvalles90@gmail.com', 'contrasenaIncorrecta');
        await cerrarModalSiExiste(page);
    });

    test('Debe mostrar error si la contraseña es correcta pero el email incorrecto', async ({ page }) => {
        const loginPage = new LoginPage(page);

        allure.label('owner', 'Emir Valles');
        allure.severity('normal');
        allure.feature('Login');
        allure.story('Credenciales inválidas');

        await loginPage.login('correo-invalido@gmail.com', '123456');
        await cerrarModalSiExiste(page);
    });

    test('Debe redirigir al select role si el login es exitoso', async ({ page }) => {
        const loginPage = new LoginPage(page);

        allure.label('owner', 'Emir Valles');
        allure.severity('blocker');
        allure.feature('Login');
        allure.story('Autenticación exitosa');

        await loginPage.login('emirvalles90@gmail.com', '123456');

        await expect(page).toHaveURL(/\/#!\/selectrole\/$/, { timeout: 7000 });
    });

    test('Debe mostrar modal al hacer clic en "Olvide mi Contraseña"', async ({ page }) => {
        const loginPage = new LoginPage(page);

        allure.label('owner', 'Emir Valles');
        allure.severity('normal');
        allure.feature('Login');
        allure.story('Olvide mi Contraseña');

        const forgotPasswordLink = page.locator('a.button', { hasText: 'Olvide mi Contraseña' });
        await forgotPasswordLink.click();

        const modalTitle = page.locator('.dialog-title .btnCustomDialogTitle');
        await expect(modalTitle).toContainText('DOORS');

        const modalSubtitle = page.locator('.dialog-text .btnCustomDialogSubtitle');
        await expect(modalSubtitle).toContainText('Ingresa tu correo para recuperar tu contraseña');

        const emailInput = page.locator('#inputValue');
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveAttribute('placeholder', 'Ingresa tu correo');
    });

});
