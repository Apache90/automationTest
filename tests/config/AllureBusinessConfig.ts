/**
 * Configuración de dominios de negocio para reportes Allure
 * Organiza los tests por contexto empresarial real
 */
export const AllureBusinessConfig = {
  EPICS: {
    AUTHENTICATION: "🔐 Autenticación de Usuarios",
    VENDOR_MANAGEMENT: "👥 Gestión de Vendedores", 
    SPECIALIZED_ROLES: "🎯 Roles Especializados"
  },

  FEATURES: {
    // Epic: Autenticación
    USER_REGISTRATION: "Registro de Usuarios",
    USER_LOGIN: "Inicio de Sesión",
    
    // Epic: Gestión de Vendedores
    COUPONS_QR: "Cupones QR",
    COUPONS_QR_PAYMENT: "Cupones QR con Pago",
    COUPONS_DNI: "Cupones DNI", 
    COUPONS_DNI_PAYMENT: "Cupones DNI con Pago",
    VENDOR_LIMITATIONS: "Limitaciones de Vendedores",
    VENDOR_GROUPS: "Grupos de Vendedores",
    
    // Epic: Roles Especializados
    SUPERVISOR_MANAGEMENT: "Gestión de Supervisores",
    VALIDATOR_MANAGEMENT: "Gestión de Canjeadores"
  },

  STORIES: {
    // Autenticación
    ACCOUNT_CREATION: "Creación de Cuenta",
    LOGIN_VALIDATION: "Validación de Credenciales",
    
    // Cupones QR
    QR_CREATION: "Creación de Cupones QR",
    QR_MODIFICATION: "Modificación de Cupones QR",
    QR_DELETION: "Eliminación de Cupones QR",
    
    // Cupones QR con Pago
    QR_PAYMENT_CREATION: "Creación de Cupones QR con Pago",
    QR_PAYMENT_MODIFICATION: "Modificación de Cupones QR con Pago",
    
    // Cupones DNI
    DNI_CREATION: "Creación de Cupones DNI",
    DNI_MODIFICATION: "Modificación de Cupones DNI",
    DNI_DELETION: "Eliminación de Cupones DNI",
    
    // Cupones DNI con Pago
    DNI_PAYMENT_CREATION: "Creación de Cupones DNI con Pago",
    
    // Limitaciones
    LIMITATION_ASSIGNMENT: "Asignación de Limitaciones",
    LIMITATION_REMOVAL: "Eliminación de Limitaciones",
    
    // Supervisores
    SUPERVISOR_CREATION: "Creación de Supervisores", 
    SUPERVISOR_DELETION: "Eliminación de Supervisores",
    
    // Canjeadores
    VALIDATOR_CREATION: "Creación de Canjeadores",
    VALIDATOR_DELETION: "Eliminación de Canjeadores"
  },

  // Mapping de tests a contextos de negocio
  TEST_CONTEXTS: {
    "login.spec.ts": {
      epic: "AUTHENTICATION",
      feature: "USER_LOGIN",
      stories: ["LOGIN_VALIDATION"]
    },
    "register.spec.ts": {
      epic: "AUTHENTICATION", 
      feature: "USER_REGISTRATION",
      stories: ["ACCOUNT_CREATION"]
    },
    "encargadoFlujoRoles.spec.ts": {
      epic: "VENDOR_MANAGEMENT",
      feature: "VENDOR_LIMITATIONS",
      stories: ["LIMITATION_ASSIGNMENT", "LIMITATION_REMOVAL"]
    },
    "encargadoFlujoCupones.spec.ts": {
      epic: "VENDOR_MANAGEMENT",
      features: ["COUPONS_QR", "COUPONS_QR_PAYMENT", "COUPONS_DNI", "COUPONS_DNI_PAYMENT"],
      stories: ["QR_CREATION", "QR_PAYMENT_CREATION", "DNI_CREATION", "DNI_PAYMENT_CREATION"]
    }
  }
};

/**
 * Helper para aplicar etiquetas Allure consistentes
 */
export class AllureBusinessLabels {
  static applyLabels(testFile: string, testName: string) {
    const context = AllureBusinessConfig.TEST_CONTEXTS[testFile];
    if (!context) return;

    // Aplicar Epic
    if (context.epic) {
      const epicName = AllureBusinessConfig.EPICS[context.epic];
      // allure.epic(epicName);
    }

    // Aplicar Feature(s)
    if (context.feature) {
      const featureName = AllureBusinessConfig.FEATURES[context.feature];
      // allure.feature(featureName);
    }

    // Aplicar Story basada en el nombre del test
    this.applyStoryByTestName(testName);
  }

  private static applyStoryByTestName(testName: string) {
    // Lógica para mapear nombres de test a stories
    if (testName.includes('crear') && testName.includes('QR')) {
      // allure.story(AllureBusinessConfig.STORIES.QR_CREATION);
    }
    // ... más mappings
  }
}
