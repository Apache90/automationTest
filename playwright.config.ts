import { defineConfig, devices } from '@playwright/test';
import { TestConfig } from './tests/config/TestConfig';

export default defineConfig({
  testDir: './tests/specs',
  
  // Remover testMatch para evitar conflictos con scripts personalizados
  // testMatch: TestConfig.testOrder,
  
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
  
  /* Reporter to use */
  reporter: [
    ['list'], // List reporter
    // Configuración detallada para Allure
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }],
    // Comentario limpio: HTML reporter desactivado
    // ['html']
  ],

  /* Shared settings for all the projects below */
  use: {
    locale: 'es-ES',
    baseURL: 'https://doorsticketdev.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Añadir video para mejor depuración
    video: 'on-first-retry'
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

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
