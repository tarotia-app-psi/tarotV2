
// ==========================================
// CONFIGURACIÓN GLOBAL DE TAROTIA (v2.0)
// ==========================================

// Estado centralizado — no uses window.* directamente
const AppState = {
    esUsuarioPremium: false,
    modoFisicoActivo: false,
    estiloSeleccionado: 'magico',
    loading: false,
    abortController: null
};

// Contexto de lectura activa
let ultimasCartasElegidasContexto = null;
let ultimaLecturaGuardadaContexto = "";

// API: En producción real, esto debería venir de una variable de entorno
// o de un endpoint de configuración. Por ahora, ofuscación básica.
const API_BASE = (() => {
    const partes = ['tarot', '613b', 'onrender', 'com'];
    return `https://${partes.join('-')}.${partes[2]}.${partes[3]}`;
})();

const API_URL = API_BASE;

// Helpers de estado
function setLoading(valor) {
    AppState.loading = valor;
    document.body.style.cursor = valor ? 'wait' : 'default';
}

function cancelarRequestActiva() {
    if (AppState.abortController) {
        AppState.abortController.abort();
        AppState.abortController = null;
    }
}

function crearAbortController() {
    cancelarRequestActiva();
    AppState.abortController = new AbortController();
    return AppState.abortController;
}
