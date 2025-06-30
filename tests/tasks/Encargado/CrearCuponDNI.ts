import { Encargado } from '../../actors/Encargado';

export async function crearCuponDNI(
  encargado: Encargado, 
  nombre: string, 
  descripcion: string, 
  icono: string = 'fa-bolt'
) {
  const { page } = encargado;

  // Navegar a la sección DNI's
  const seccionDNIs = page.locator('a.item-link[href="/manager/71/cuponesdni/DNI"]');
  await seccionDNIs.click();
  await page.waitForURL('**/#!/manager/71/cuponesdni/DNI');

  // Click en botón agregar nuevo cupón
  const botonAgregarCupon = page.locator('a[href="/manager/71/nuevocupondni/DNI"] i.material-icons');
  await botonAgregarCupon.click();
  await page.waitForURL('**/#!/manager/71/nuevocupondni/DNI');

  // Completar formulario
  await page.locator('input[name="nombre"][placeholder="Nombre"]').fill(nombre);
  await page.locator('input[name="descripcion"][placeholder="Descripcion"]').fill(descripcion);

  // Seleccionar icono
  const smartSelect = page.locator('a.item-link.smart-select');
  await smartSelect.click();
  
  // Selector mejorado para el icono
  const iconoSeleccionado = page.locator(`label.item-radio.item-radio-icon-start.item-content:has(input[value="${icono}"])`);
  await iconoSeleccionado.click();
  
  // Cerrar el modal del selector de iconos usando el botón Close específico
  const closeButton = page.locator('a.link.popup-close[data-popup=".smart-select-popup[data-select-name=\'icono\']"]');
  await closeButton.click();

  // Seleccionar todos los días de la semana
  const diasSemana = page.locator('.block .button');
  const count = await diasSemana.count();
  for (let i = 0; i < count; i++) {
    await diasSemana.nth(i).click();
  }

  // Crear cupón
  const crearCuponBtn = page.locator('a.button.button-fill', { hasText: 'CREAR CUPÓN' });
  await crearCuponBtn.click();
}