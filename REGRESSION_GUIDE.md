# Guía de Regresión y Optimización - Doors Ticket Automation

## 🎯 Objetivo
Esta guía documenta las mejores prácticas para ejecutar regresiones completas y mantener el código de automatización optimizado usando el patrón Screenplay con Playwright.

## 🏗️ Arquitectura del Proyecto

### Patrón Screenplay Implementado
- **Actors**: Representan los usuarios del sistema (Encargado, Vendedor)
- **Tasks**: Acciones de alto nivel que los actores pueden realizar
- **Questions**: Verificaciones que los actores pueden hacer
- **Pages**: Representación de las páginas web (Page Object Model)
- **Abilities**: Capacidades que tienen los actores (BrowseTheWeb)
- **Helpers**: Funciones utilitarias centralizadas
- **Config**: Configuración global del proyecto

### Estructura de Carpetas Optimizada
```
tests/
├── actors/          # Definición de usuarios del sistema
├── tasks/           # Acciones de negocio de alto nivel  
│   └── Encargado/   # Tasks específicas del Encargado
├── questions/       # Verificaciones y assertions
├── pages/           # Page Objects
├── abilities/       # Capacidades de los actores
├── helpers/         # Funciones utilitarias centralizadas
├── config/          # Configuración centralizada (TestConfig.ts)
├── base/            # Clases base para tests (BaseTestSuite.ts)
└── specs/           # Archivos de pruebas
scripts/             # Scripts de automatización y runners
```

## 🔄 Configuración para Regresión

### 1. Ejecución Serial Obligatoria
- **Configuración Global**: `fullyParallel: false` y `workers: 1` en `playwright.config.ts`
- **Configuración por Suite**: Cada `describe` usa `test.describe.configure({ mode: "serial" })`
- **Razón**: Los tests tienen dependencias de estado y flujo entre ellos
- **Beneficio**: Evita conflictos de datos y garantiza orden de ejecución

### 2. Orden de Ejecución Actualizado (Crítico)
1. `register.spec.ts` - **Registro de usuarios** (debe ir primero)
2. `login.spec.ts` - **Base de autenticación** (depende del registro)
3. `encargadoFlujoCupones.spec.ts` - **Gestión de cupones** (usa roles creados)
4. `encargadoFlujoGrupos.spec.ts` - **Gestión de grupos** (organiza cupones y usuarios)
5. `encargadoFlujoRoles.spec.ts` - **Gestión de roles** (crea usuarios necesarios)
6. `vendedor-flujo.spec.ts` - **Flujos de vendedor** (⚠️ temporalmente excluido)

> **⚠️ IMPORTANTE**: Este orden es crítico debido a las dependencias de datos entre tests.

### 3. Scripts NPM Disponibles
```bash
# 🌟 RECOMENDADO: Regresión con orden específico (FUNCIONAL ✅)
npm run regression:ordered

# Regresión estándar de Playwright (todos los tests)
npm run test:regression

# Regresión con runner personalizado avanzado (con métricas)
npm run regression:custom

# Tests en modo debug (paso a paso)
npm run test:debug

# Tests con interfaz visual (para ver ejecución)
npm run test:headed

# Test específico por patrón
npm run test:specific -- "nombre-del-test"
```

> **✅ SCRIPT VALIDADO**: `npm run regression:ordered` está funcionando correctamente y ejecuta los 64 tests en el orden específico.

## 🛠️ Mejoras Implementadas

### 1. Helper Centralizado (`CommonHelpers.ts`) 🔧
- **Manejo de errores**: Captura automática de screenshots y HTML en fallos
- **Gestión de diálogos**: Configuración automática para manejar popups inesperados
- **Limpieza de datos**: Limpia localStorage/sessionStorage entre tests
- **Validaciones**: Helpers para verificar URLs y estado de página
- **Screenshots**: Función centralizada para capturas con nombre descriptivo

**Ejemplo de uso:**
```typescript
// En cualquier test
await CommonHelpers.takeScreenshot(page, 'estado-inicial');
await CommonHelpers.waitForPageLoad(page);
```

### 2. Configuración Centralizada (`TestConfig.ts`) ⚙️
- **Credenciales**: Gestión centralizada de usuarios de prueba
- **URLs**: Todas las URLs de la aplicación en un lugar
- **Timeouts**: Configuración de timeouts específicos por tipo de operación
- **Selectores**: Selectores comunes reutilizables
- **Orden de Tests**: Define el orden crítico de ejecución

**Ejemplo de uso:**
```typescript
import { TestConfig } from '../config/TestConfig';

// Usar credenciales centralizadas
await loginPage.login(TestConfig.credentials.encargado.email, TestConfig.credentials.encargado.password);

// Usar timeouts específicos
await page.waitForSelector('.modal', { timeout: TestConfig.timeouts.modal });
```

### 3. Base Test Suite (`BaseTestSuite.ts`) 🏗️
- **Setup común**: Configuración que todos los tests necesitan
- **Manejo de fallos**: Captura automática en caso de errores
- **Logging**: Información detallada de ejecución por suite
- **Hooks centralizados**: beforeEach y afterEach optimizados

### 4. Runners Personalizados 🏃‍♂️

#### `regression-ordered.js` (Recomendado)
- **Simple y efectivo**: Ejecuta tests en el orden correcto
- **Output claro**: Muestra progreso y resultados
- **Manejo de errores**: Continúa aunque algunos tests fallen

#### `regression-runner.ts` (Avanzado)
- **Métricas detalladas**: Tiempo de ejecución por test
- **Reportes JSON**: Genera `regression-report.json` con estadísticas
- **Gestión completa**: Limpieza, ejecución y reporte integral

## 📋 Mejores Prácticas

### Para Desarrollo de Tests 👨‍💻
1. **Usar CommonHelpers**: Siempre usar funciones del helper para tareas repetitivas
   ```typescript
   // ✅ Correcto
   await CommonHelpers.setupDialogHandler(page);
   await CommonHelpers.waitForPageLoad(page);
   
   // ❌ Evitar duplicar código
   page.on('dialog', async dialog => { ... });
   ```

2. **Configurar serial mode**: En describe blocks que tienen dependencias
   ```typescript
   test.describe("Gestión de Cupones", () => {
     test.describe.configure({ mode: "serial" }); // ✅ Crítico
   });
   ```

3. **Usar TestConfig**: Para credenciales, URLs y configuraciones
   ```typescript
   // ✅ Centralizado
   const { email, password } = TestConfig.credentials.encargado;
   
   // ❌ Hardcodeado
   const email = 'test@example.com';
   ```

4. **Implementar manejo de errores**: Con try-catch y reportTestError
   ```typescript
   try {
     await someAction();
   } catch (error) {
     await CommonHelpers.reportTestError(error, page, "Descripción del test");
   }
   ```

5. **Logging descriptivo**: Para facilitar debugging
   ```typescript
   console.log(`🧪 Iniciando test: ${testInfo.title}`);
   ```

### Para Ejecución de Regresión 🔄
1. **Limpiar antes de ejecutar**: `npm run allure:clean`
2. **Usar orden específico**: `npm run regression:ordered` (recomendado)
3. **Revisar reportes**: Tanto Playwright como Allure
4. **Validar métricas**: Tasa de éxito > 95%
5. **Investigar fallos**: Usar screenshots y logs para debug

### Para Mantenimiento 🔧
1. **Actualizar TestConfig**: Cuando cambien URLs, credenciales o selectores
2. **Mantener orden de tests**: Actualizar `TestConfig.testOrder` si se agregan specs
3. **Revisar helpers**: Agregar nuevas funciones comunes cuando sea necesario
4. **Validar dependencias**: Asegurar que el orden de tests sigue siendo correcto

## 🚨 Problemas Comunes y Soluciones

### 1. Tests que fallan por timing ⏱️
- **Problema**: Tests fallan porque elementos no están listos
- **Solución**: Usar timeouts específicos de TestConfig
- **Helper**: `CommonHelpers.waitForPageLoad(page, timeout)`
- **Ejemplo**:
  ```typescript
  await CommonHelpers.waitForPageLoad(page, TestConfig.timeouts.navigation);
  await page.waitForSelector('.button', { timeout: TestConfig.timeouts.default });
  ```

### 2. Modales que interfieren entre tests 🪟
- **Problema**: Modales abiertos contaminan tests siguientes
- **Solución**: Usar limpieza automática entre tests
- **Helper**: `CommonHelpers.cleanupBetweenTests(page)`
- **Configuración**: Automático en BaseTestSuite
- **Manual**: Llamar en beforeEach si es necesario

### 3. Tests intermitentes (flaky) 🔄
- **Problema**: Tests fallan de forma inconsistente
- **Solución**: Verificar configuración serial
- **Validación**: Todos los describe blocks deben tener:
  ```typescript
  test.describe.configure({ mode: "serial" });
  ```
- **Debug**: Usar `npm run test:headed` para ver ejecución visual

### 4. Datos contaminados entre tests 🗃️
- **Problema**: Un test modifica datos que afectan otros tests
- **Solución**: Implementar cleanup específico
- **Helper**: Funciones de limpieza en CommonHelpers
- **Estrategia**: 
  - Limpiar localStorage/sessionStorage
  - Cerrar modales abiertos
  - Validar estado inicial esperado

### 5. Dependencias de orden no respetadas 📋
- **Problema**: Tests fallan cuando se ejecutan en orden diferente
- **Solución**: Usar `regression:ordered` que respeta el orden crítico
- **Validación**: Verificar que TestConfig.testOrder esté actualizado
- **Debug**: Ejecutar tests individuales para identificar dependencias

### 6. Credenciales o URLs incorrectas 🔐
- **Problema**: Tests fallan por configuración incorrecta
- **Solución**: Centralizar en TestConfig.ts
- **Mantenimiento**: Actualizar una sola vez en TestConfig
- **Validación**: Verificar que todos los tests usen TestConfig

### 7. Script de regresión no ejecuta 🔧
- **Problema**: `npm run regression:ordered` falla con errores de módulo
- **Solución**: El script usa CommonJS (ya corregido)
- **Validación**: Debe mostrar el orden de ejecución antes de iniciar
- **Output esperado**: 
  ```
  🚀 Iniciando regresión ordenada...
  📋 Orden de ejecución:
    1. register.spec.ts
    2. login.spec.ts
    ...
  ```

## 📊 Monitoreo y Reportes

### Playwright Reports (Automático) 📋
- **Ubicación**: `test-results/`
- **Generación**: Automática con cada ejecución
- **Contenido**: Resultados detallados, screenshots de fallos, traces
- **Acceso**: Se abre automáticamente en browser tras la ejecución

### Allure Reports (Detallado) 📈
- **Ubicación**: `allure-results/` → `allure-report/`
- **Comandos**: 
  ```bash
  npm run allure:report    # Generar y abrir
  npm run allure:generate  # Solo generar
  npm run allure:open      # Solo abrir existente
  ```
- **Contenido**: Métricas avanzadas, trends, categorización de errores
- **Configuración**: Incluye `categories.json` para clasificar fallos

### Regression Report (Personalizado) 📄
- **Ubicación**: `regression-report.json`
- **Generado por**: `npm run regression:custom` (runner avanzado)
- **Contenido**: 
  ```json
  {
    "timestamp": "2025-08-08T...",
    "summary": {
      "total": 5,
      "passed": 4,
      "failed": 1,
      "successRate": 80
    },
    "details": [...]
  }
  ```

### Logs en Consola (Tiempo Real) 🖥️
- **Ubicación**: Output directo en terminal
- **Generado por**: Todos los runners
- **Contenido**: Progreso en tiempo real, errores inmediatos

## 🔧 Configuración de IDE

### VS Code Extensions Recomendadas 🔌
- **Playwright Test for VS Code**: Debug y ejecución integrada
- **TypeScript Importer**: Auto-imports optimizados
- **Error Lens**: Errores inline en tiempo real
- **GitLens**: Control de versiones avanzado
- **Allure Report**: Visualización de reportes Allure

### Configuración de Debug 🐛
```bash
# Debug paso a paso con breakpoints
npm run test:debug

# Ejecución visual para ver el browser
npm run test:headed

# Test específico en debug
npx playwright test tests/specs/login.spec.ts --debug
```

### Atajos Útiles en VS Code ⌨️
- `Ctrl+Shift+P` → "Playwright: Run Tests" para ejecutar desde VS Code
- `F5` → Debug con breakpoints configurados
- `Ctrl+`` → Terminal integrado para comandos npm

## 📝 Checklist para Nueva Regresión

### Antes de Ejecutar ✅
- [ ] **Limpiar resultados previos**: `npm run allure:clean`
- [ ] **Verificar configuración serial**: Todos los describe blocks tienen `mode: "serial"`
- [ ] **Validar orden de tests**: Confirmar que TestConfig.testOrder está actualizado
- [ ] **Comprobar credenciales**: Verificar que TestConfig tiene credenciales válidas

### Durante la Ejecución 🏃‍♂️
- [ ] **Ejecutar regresión ordenada**: `npm run regression:ordered`
- [ ] **Monitorear progreso**: Observar logs en tiempo real
- [ ] **Tomar notas**: Anotar cualquier comportamiento inusual

### Después de Ejecutar 📊
- [ ] **Revisar tasa de éxito**: Objetivo > 95%
- [ ] **Generar reporte Allure**: `npm run allure:report`
- [ ] **Analizar fallos**: Revisar screenshots y logs de tests fallidos
- [ ] **Documentar issues**: Crear tickets para fallos legítimos
- [ ] **Validar regression-report.json**: Si usaste `regression:custom`

### Criterios de Aceptación ✨
- ✅ **Tasa de éxito ≥ 95%**
- ✅ **Todos los tests críticos pasan** (login, register, roles)
- ✅ **No hay errores de timeout** excesivos
- ✅ **Reportes generados** correctamente
- ✅ **Performance aceptable** (< 30min total)

## 🚀 Comandos de Inicio Rápido

```bash
# 🎯 REGRESIÓN COMPLETA + PUBLICACIÓN (Automático)
npm run regression:and:publish

# 🧪 TESTS ESTÁNDAR + PUBLICACIÓN (Automático)  
npm run test:and:publish

# 🌟 REGRESIÓN ORDENADA (Solo tests)
npm run regression:ordered

# 🔧 DESARROLLO Y DEBUG
npm run test:headed              # Ver ejecución en browser
npm run test:debug              # Debug paso a paso
npm run test:specific -- "login" # Test específico

# 📊 REPORTES MANUALES
npm run allure:report           # Generar y abrir Allure
npm run allure:clean           # Limpiar reportes previos

# 🧪 TESTS INDIVIDUALES
npx playwright test tests/specs/login.spec.ts
npx playwright test tests/specs/register.spec.ts
```

## 🌐 Proceso Automatizado de Publicación

### Comando Todo-en-Uno (RECOMENDADO)
```bash
# Ejecuta: Tests → Allure → GitHub Pages
npm run regression:and:publish
```

**Este comando hace automáticamente:**
1. ✅ Guarda cambios actuales en main
2. ✅ Ejecuta regresión ordenada (64 tests)
3. ✅ Genera reporte Allure con categories.json
4. ✅ Publica reporte a GitHub Pages
5. ✅ Limpia archivos temporales

### Proceso Manual (Si necesitas control total)
```bash
# 1. Preparar branch main
git checkout main
git add .
git commit -m "Actualización antes de reportes"

# 2. Ejecutar tests con el orden correcto
npm run regression:ordered

# 3. Generar reporte Allure
copy categories.json allure-results\categories.json
npx allure generate allure-results --clean -o allure-report

# 4. Publicar a GitHub Pages
git checkout gh-pages
# ... (proceso manual de copia y commit)
```

## 📚 Recursos Adicionales

- **Documentación Playwright**: https://playwright.dev/
- **Patrón Screenplay**: https://serenity-js.org/handbook/design/screenplay-pattern/
- **Allure Framework**: https://docs.qameta.io/allure/
- **TypeScript**: https://www.typescriptlang.org/docs/
