import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  
  // Usar glob patterns estándar para encontrar tests
  testMatch: '**/*.spec.ts',
  
  // Añadir timeouts explícitos
  timeout: 60000, // 60 segundos para timeout global
  expect: {
    timeout: 10000 // 10 segundos para las aserciones
  },
  
  /* Run tests in files in parallel - DISABLED for regression to avoid conflicts */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry settings - fixed to 0 to avoid inconsistencias */
  retries: 0,
  
  /* Workers settings - Force 1 worker for serial execution */
  workers: 1,
  
  /* Reporter to use - Configuración corregida */
  reporter: [
    ['list'], // List reporter por defecto
    ['html', { open: 'never' }], // HTML reporter local
    // Allure reporter - configuración completa y correcta
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false
    }]
  ],

  /* Shared settings for all the projects below */
  use: {
    locale: 'es-ES',
    baseURL: 'https://doorsticketdev.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    // Configuraciones adicionales para estabilidad
    actionTimeout: 15000,
    navigationTimeout: 30000
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Configuración para VS Code Test Runner */
  // Para ejecutar desde VS Code: Ctrl+Shift+P -> "Test: Run Test at Cursor"
  // Para debug desde VS Code: Ctrl+Shift+P -> "Test: Debug Test at Cursor"
  
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
