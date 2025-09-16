import { Encargado } from "../../actors/Encargado";
import { LimitacionesPage } from "../../pages/LimitacionesPage";
import { ExportacionModal } from "../../helpers/exportacionmodals";

export async function exportarLimitacionesVendedor(
    encargado: Encargado,
    emailVendedorOrigen: string,
    vendedoresDestino: string[],
    cupones: string[]
) {
    const limitacionesPage = new LimitacionesPage(encargado.page);
    const exportacionModal = new ExportacionModal(encargado.page);

    // Navegar a la sección de vendedores
    await limitacionesPage.navegarAVendedores();

    // Click en el ícono de limitaciones del vendedor origen
    await limitacionesPage.clickLimitacionesVendedor(emailVendedorOrigen);

    // Click en exportar limitaciones
    await limitacionesPage.clickExportarLimitaciones();

    // Esperar que aparezca el modal de exportación
    await exportacionModal.esperarModalExportacion();

    // Seleccionar vendedores destino
    await exportacionModal.seleccionarVendedores(vendedoresDestino);

    // Seleccionar cupones a exportar
    await exportacionModal.seleccionarCupones(cupones);

    // Confirmar exportación
    await exportacionModal.confirmarExportacion();

    // Esperar confirmación de éxito
    await exportacionModal.esperarModalExito();
    await exportacionModal.cerrarModalExito();


    await limitacionesPage.volverAtrasDesdeDetalles();

    // Solo verificar limitaciones exportadas si logramos volver atrás
    await limitacionesPage.verificarLimitacionesExportadas(vendedoresDestino[0]);

}