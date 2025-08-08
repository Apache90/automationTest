/**
 * Configuración centralizada para todos los tests
 */
export const TestConfig = {
  // URLs de la aplicación
  urls: {
    base: 'https://doorsticketdev.com/',
    login: '/login',
    dashboard: '/dashboard'
  },

  // Credenciales para tests (considerar usar variables de entorno)
  credentials: {
    encargado: {
      email: 'emirvalles90@gmail.com',
      password: '123456'
    },
    vendedor: {
      email: 'emirvalles90@gmail.com', 
      password: '123456'
    }
  },

  // Timeouts específicos
  timeouts: {
    default: 10000,
    login: 15000,
    navigation: 20000,
    modal: 5000,
    api: 30000
  },

  // Selectores comunes
  selectors: {
    modal: {
      container: '.modal, .dialog',
      closeButton: '.close, .cancel, [data-dismiss="modal"], .dialog-button',
      okButton: '.dialog-button:has-text("OK")'
    },
    common: {
      loader: '.loading, .spinner',
      errorMessage: '.error, .alert-danger'
    }
  },

  // Orden de ejecución de tests para regresión
  testOrder: [
    'register.spec.ts',      // Registro de usuarios  
    'login.spec.ts',         // Base de autenticación
    'encargadoFlujoRoles.spec.ts',    // Gestión de roles
    'encargadoFlujoCupones.spec.ts',  // Gestión de cupones
    'encargadoFlujoGrupos.spec.ts'    // Gestión de grupos
    // 'vendedor-flujo.spec.ts' - Pendiente de incluir
  ],

  // Configuración de retry por tipo de test
  retryConfig: {
    login: 2,
    crud: 1,
    navigation: 1
  }
};
