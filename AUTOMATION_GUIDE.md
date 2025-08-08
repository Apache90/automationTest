# 🚀 Automation Testing - Guía Completa

> **Framework**: Playwright + TypeScript | **Patrón**: Screenplay | **Reportes**: Allure | **CI/CD**: GitHub Pages

---

## 📋 **COMANDOS PRINCIPALES**

### ✨ Proceso Recomendado (2 Comandos)

```bash
# 1️⃣ Ejecutar tests en orden específico
npm run run:tests

# 2️⃣ Generar reporte y publicar a GitHub Pages
npm run publish:report
```

### 🔄 Proceso Todo-en-Uno (Alternativo)

```bash
# Ejecuta tests + genera reporte + publica (puede ser lento)
npm run regression:and:publish
```

---

## 🏗️ **ARQUITECTURA DEL PROYECTO**

### Patrón Screenplay Implementado
- **Actors**: Usuarios del sistema (`Encargado`, `Vendedor`)
- **Tasks**: Acciones de alto nivel (`CrearCuponDNI`, `Login`)
- **Questions**: Verificaciones (`VerBienvenida`, `VerConfirmacionCupon`)
- **Pages**: Page Objects (`LoginPage`, `CuponesDniPage`)
- **Abilities**: Capacidades (`BrowseTheWeb`)
- **Helpers**: Utilidades centralizadas (`CommonHelpers`)

### Estructura de Carpetas
```
tests/
├── actors/           # Definición de usuarios
├── tasks/            # Acciones de negocio
│   └── Encargado/    # Tasks específicas
├── questions/        # Verificaciones
├── pages/            # Page Objects
├── abilities/        # Capacidades de actores
├── helpers/          # Utilidades centralizadas
├── config/           # Configuración (TestConfig.ts)
├── base/             # Clases base (BaseTestSuite.ts)
└── specs/            # Archivos de pruebas

scripts/              # Scripts de automatización
```

---

## 📊 **ORDEN DE TESTS (CRÍTICO)**

Los tests **DEBEN** ejecutarse en este orden debido a dependencias de datos:

1. **`register.spec.ts`** - Registro de usuarios (debe ir primero)
2. **`login.spec.ts`** - Autenticación (depende del registro)
3. **`encargadoFlujoRoles.spec.ts`** - Gestión de roles (crea usuarios necesarios)
4. **`encargadoFlujoCupones.spec.ts`** - Gestión de cupones (usa roles creados)
5. **`encargadoFlujoGrupos.spec.ts`** - Gestión de grupos (organiza cupones y usuarios)

> ⚠️ **`vendedor-flujo.spec.ts`** está temporalmente excluido

---

## 🛠️ **CONFIGURACIÓN**

### Ejecución Serial Obligatoria
- **Global**: `fullyParallel: false` y `workers: 1` en `playwright.config.ts`
- **Por Suite**: Cada `describe` usa `test.describe.configure({ mode: "serial" })`
- **Razón**: Evita conflictos de datos entre tests dependientes

### Archivos de Configuración Clave
- **`playwright.config.ts`**: Configuración principal de Playwright
- **`tests/config/TestConfig.ts`**: Credenciales, URLs, timeouts centralizados
- **`tests/helpers/CommonHelpers.ts`**: Funciones reutilizables
- **`tests/base/BaseTestSuite.ts`**: Setup común para todos los tests

---

## 🧪 **COMANDOS DISPONIBLES**

### Ejecución de Tests
```bash
# Tests ordenados (recomendado)
npm run run:tests

# Tests con visualización
npm run test:headed

# Tests en modo debug
npm run test:debug

# Test específico
npm run test:specific -- "nombre-del-test"

# Tests estándar de Playwright
npm run test:regression
```

### Reportes y Publicación
```bash
# Generar y publicar reporte (requiere tests ejecutados)
npm run publish:report

# Solo generar reporte local
npm run allure:report

# Limpiar reportes
npm run allure:clean
```

### Desarrollo
```bash
# Regresión ordenada sin publicar
npm run regression:ordered

# Proceso completo automatizado
npm run regression:and:publish
```

---

## 📊 **REPORTES**

### Ubicaciones
- **Resultados**: `allure-results/` (datos JSON)
- **Reporte HTML**: `allure-report/` (local)
- **GitHub Pages**: https://apache90.github.io/automationTest/
- **Screenshots**: `test-results/` (fallos)

### Tipos de Reportes
1. **Playwright Report**: Automático con cada ejecución
2. **Allure Report**: Detallado con métricas avanzadas
3. **Console Logs**: Tiempo real durante ejecución

---

## 🌐 **GITHUB PAGES**

### Configuración (Una sola vez)
1. Ve a tu repositorio: `https://github.com/Apache90/automationTest`
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: `gh-pages` / (root)
5. Save

### Estructura de Ramas
- **`main`**: Código fuente, tests, scripts, documentación
- **`gh-pages`**: Solo reporte Allure HTML (auto-generado)

### URL del Reporte
```
https://apache90.github.io/automationTest/
```

---

## 🔧 **MEJORES PRÁCTICAS**

### Para Desarrollo de Tests
```typescript
// ✅ Usar helpers centralizados
await CommonHelpers.setupDialogHandler(page);
await CommonHelpers.waitForPageLoad(page);

// ✅ Configurar serial mode
test.describe("Mi Suite", () => {
  test.describe.configure({ mode: "serial" });
});

// ✅ Usar configuración centralizada
const { email, password } = TestConfig.credentials.encargado;

// ✅ Manejo de errores
try {
  await someAction();
} catch (error) {
  await CommonHelpers.reportTestError(error, page, "Test description");
}
```

### Para Ejecución
1. **Limpiar antes**: `npm run allure:clean`
2. **Usar orden específico**: `npm run run:tests`
3. **Revisar resultados** antes de publicar
4. **Publicar reportes**: `npm run publish:report`

### Para Mantenimiento
1. **Actualizar TestConfig** cuando cambien URLs/credenciales
2. **Mantener orden de tests** en `TestConfig.testOrder`
3. **Revisar helpers** para funciones comunes nuevas
4. **Validar dependencias** entre tests

---

## 🚨 **TROUBLESHOOTING**

### Tests que fallan por timing
```typescript
// Usar timeouts específicos
await CommonHelpers.waitForPageLoad(page, TestConfig.timeouts.navigation);
await page.waitForSelector('.element', { timeout: TestConfig.timeouts.default });
```

### Modales que interfieren
```typescript
// Limpieza automática en BaseTestSuite o manual
await CommonHelpers.cleanupBetweenTests(page);
```

### Tests intermitentes (flaky)
```typescript
// Verificar serial mode en TODOS los describe
test.describe.configure({ mode: "serial" });
```

### GitHub Pages 404
1. Verificar configuración en repositorio
2. Confirmar que rama `gh-pages` existe
3. Verificar archivo `.nojekyll` en gh-pages
4. Esperar 2-5 minutos tras publicación

### Playwright "desaparece"
```bash
# Reinstalar dependencias
npm install
npx playwright install
```

---

## 📈 **FLUJO DE TRABAJO RECOMENDADO**

### Desarrollo Diario
```bash
# 1. Desarrollo de tests
npm run test:headed              # Ver ejecución

# 2. Debug específico
npm run test:debug              # Paso a paso
npm run test:specific -- "login" # Test individual
```

### Regresión Completa
```bash
# 1. Ejecutar todos los tests
npm run run:tests

# 2. Revisar resultados en allure-results/

# 3. Si todo OK, publicar
npm run publish:report

# 4. Verificar en: https://apache90.github.io/automationTest/
```

### CI/CD Automatizado
```bash
# Un solo comando para pipeline completo
npm run regression:and:publish
```

---

## 📊 **MÉTRICAS Y OBJETIVOS**

- **Total tests**: ~64 tests
- **Tiempo estimado**: 20-30 minutos regresión completa
- **Tasa de éxito objetivo**: >95%
- **Browser**: Chrome (configurado en playwright.config.ts)
- **Workers**: 1 (ejecución serial obligatoria)
- **Timeouts**: Configurados por tipo en TestConfig.ts

---

## 🔄 **PROCESO TÉCNICO DETALLADO**

### `npm run run:tests` hace:
1. ✅ Ejecuta tests en orden: register → login → roles → cupones → grupos
2. ✅ Genera resultados en `allure-results/`
3. ✅ Captura screenshots de fallos
4. ✅ NO genera reporte HTML
5. ✅ NO publica nada

### `npm run publish:report` hace:
1. ✅ Verifica que existan resultados de tests
2. ✅ Copia `categories.json` a `allure-results/`
3. ✅ Genera reporte HTML con `npx allure generate`
4. ✅ Cambia a rama `gh-pages`
5. ✅ Preserva `.nojekyll`, `index.md`, `.git`, `node_modules`
6. ✅ Copia reporte HTML a `gh-pages`
7. ✅ Commit y push a `origin/gh-pages`
8. ✅ Vuelve a rama `main`
9. ✅ Limpia archivos temporales

---

## 🎯 **COMANDOS DE INICIO RÁPIDO**

```bash
# 🌟 REGRESIÓN COMPLETA (Método recomendado)
npm run run:tests && npm run publish:report

# 🔧 DESARROLLO
npm run test:headed              # Con visualización
npm run test:debug              # Con debugging

# 📊 SOLO REPORTES
npm run allure:report           # Local
npm run publish:report          # GitHub Pages

# 🧹 LIMPIEZA
npm run allure:clean           # Limpiar reportes
```

---

## 📚 **RECURSOS**

- **Repositorio**: https://github.com/Apache90/automationTest
- **Reportes Live**: https://apache90.github.io/automationTest/
- **Playwright Docs**: https://playwright.dev/
- **Allure Docs**: https://docs.qameta.io/allure/
- **Screenplay Pattern**: https://serenity-js.org/handbook/design/screenplay-pattern/

---

*Última actualización: Agosto 8, 2025*  
*Framework: Playwright 1.53.2 + TypeScript + Allure*
