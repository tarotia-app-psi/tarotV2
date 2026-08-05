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

// ==========================================
// CONFIGURACIÓN DE API (Servidor Backend)
// ==========================================
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://tarotia-backend.onrender.com';

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
