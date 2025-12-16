import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly root: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // La app (Svelte + Framework7) deja múltiples páginas renderizadas en el DOM.
        // Nos interesa únicamente la página activa de login.
        this.root = page.locator('.login-page.page.page-current[data-name="login"]');

        // Evitar match exacto por acentos (el HTML usa caracteres combinados como "Electrónico" y "Contraseña").
        this.emailInput = this.root.getByPlaceholder(/Ingresar\s+Correo/i);
        this.passwordInput = this.root.getByPlaceholder(/Ingresar\s+Contras/i);
        this.loginButton = this.root.locator('a.doors-button.button', { hasText: /Ingresar/i });
    }

    async navigate() {
        await this.page.goto('https://stg.doorstickets.com/#!/login/');
        await this.waitForReady();
    }

    async login(email: string, password: string) {
        await this.waitForReady();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL('**/#!/selectrole/', { timeout: 20000 });
    }

    private async waitForReady() {
        await this.root.waitFor({ state: 'visible', timeout: 20000 });
        await this.page.waitForFunction(
            () => {
                const root = document.querySelector('.login-page.page.page-current[data-name="login"]');
                if (!root) return false;
                const email = root.querySelector('input[type="text"]');
                const pass = root.querySelector('input[type="password"]');
                return Boolean(email && pass);
            },
            undefined,
            { timeout: 20000 }
        );
        await this.emailInput.waitFor({ state: 'visible', timeout: 20000 });
        await this.passwordInput.waitFor({ state: 'visible', timeout: 20000 });
    }

    async getEmailError() {
        return this.emailInput.locator('xpath=ancestor::*[1]//div[contains(@class, "item-input-error-message")]');
    }

    async getPasswordError() {
        return this.passwordInput.locator('xpath=ancestor::*[1]//div[contains(@class, "item-input-error-message")]');
    }
    
}
