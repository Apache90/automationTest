# 🚀 Proceso de Testing y Publicación Automatizada

## 📋 Comandos Principales Actualizados

### ✨ Proceso Completo Automatizado (RECOMENDADO)

```bash
# 🎯 Regresión completa + Allure + GitHub Pages
npm run regression:and:publish

# 🧪 Tests estándar + Allure + GitHub Pages  
npm run test:and:publish
```

### 📊 Solo Reportes (Manual)

```bash
# Limpiar reportes anteriores
npm run allure:clean

# Ejecutar tests ordenados
npm run regression:ordered

# Generar reporte Allure
npm run allure:report
```

## 🔧 Lo que hace el proceso automatizado

### `npm run regression:and:publish` ejecuta:

1. **💾 Guarda cambios actuales**
   ```bash
   git checkout main
   git add .
   git commit -m "Actualización antes de reportes - YYYY-MM-DD"
   ```

2. **🧪 Ejecuta regresión ordenada**
   - ✅ register.spec.ts (Registro de usuarios)
   - ✅ login.spec.ts (Autenticación) 
   - ✅ encargadoFlujoRoles.spec.ts (Gestión de roles)
   - ✅ encargadoFlujoCupones.spec.ts (Gestión de cupones)
   - ✅ encargadoFlujoGrupos.spec.ts (Gestión de grupos)

3. **📊 Genera reporte Allure**
   ```bash
   copy categories.json allure-results\categories.json
   npx allure generate allure-results --clean -o allure-report
   ```

4. **🌐 Publica a GitHub Pages**
   - Cambia a rama `gh-pages`
   - Copia reporte preservando `.nojekyll` e `index.md`
   - Commit y push automático
   - Vuelve a rama `main`

5. **🧹 Limpia archivos temporales**

## 🛠️ Configuración Inicial Requerida

### 1. Verificar dependencias instaladas
```bash
# Verificar que Playwright está configurado
npx playwright install

# Verificar que allure-playwright funciona
npm list allure-playwright
```

### 2. Configurar GitHub Pages
- En tu repositorio GitHub → Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages` / (root)

### 3. Crear rama gh-pages (primera vez)
```bash
git checkout -b gh-pages
echo "" > .nojekyll
git add .nojekyll
git commit -m "Initial gh-pages setup"
git push origin gh-pages
git checkout main
```

## 📈 Beneficios del Proceso Automatizado

- ✅ **Consistencia**: Siempre el mismo orden de tests
- ✅ **Automatización**: Un comando para todo el proceso
- ✅ **Preservación**: Mantiene configuración de GitHub Pages
- ✅ **Seguridad**: Guarda cambios antes de ejecutar
- ✅ **Limpieza**: No deja archivos temporales
- ✅ **Reportes**: Genera reportes detallados con Allure

## 🚨 Troubleshooting

### Error: "allure command not found"
El script usa `npx allure` que no requiere instalación global.

### Error: "gh-pages branch not found"
```bash
git checkout -b gh-pages
git push origin gh-pages
git checkout main
```

### Error: "No hay cambios para commit"
Es normal, el proceso continúa normalmente.

### Reporte no se ve en GitHub Pages
- Verificar que hay archivo `.nojekyll` en gh-pages
- Esperar unos minutos para la actualización
- Verificar configuración de Pages en GitHub

## 📊 URLs del Reporte

Después de ejecutar el proceso, tu reporte estará disponible en:
```
https://apache90.github.io/automationtest/
```

## 🔄 Proceso Manual (Si prefieres control total)

```bash
# 1. Preparar
git checkout main && git add . && git commit -m "Pre-test commit"

# 2. Ejecutar tests
npm run regression:ordered

# 3. Generar Allure
copy categories.json allure-results\categories.json
npx allure generate allure-results --clean -o allure-report

# 4. Publicar a gh-pages (manual)
$reportTemp = "$env:USERPROFILE\temp-allure"
Remove-Item -Path $reportTemp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path $reportTemp -ItemType Directory -Force
Copy-Item -Path "allure-report\*" -Destination $reportTemp -Recurse -Force

git checkout gh-pages
Get-ChildItem -Exclude .nojekyll,index.md,.git | Remove-Item -Recurse -Force
Copy-Item -Path "$reportTemp\*" -Destination "." -Recurse

git add .
git commit -m "Actualizar reportes Allure - $(Get-Date -Format 'yyyy-MM-dd')"
git push origin gh-pages
git checkout main
Remove-Item -Path $reportTemp -Recurse -Force
```
