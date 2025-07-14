import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"].svelte-17frlf4');
        this.loginButton = page.getByRole('link', { name: 'Ingresar' });
    }

    async navigate() {
        await this.page.goto('https://doorsticketsdev.com/#!/login/');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getEmailError() {
        return this.emailInput.locator('xpath=ancestor::*[1]//div[contains(@class, "item-input-error-message")]');
    }

    async getPasswordError() {
        return this.passwordInput.locator('xpath=ancestor::*[1]//div[contains(@class, "item-input-error-message")]');
    }
    
}
