// ==========================================
// CONTROL DE ACCESOS Y MUESTRAS FÍSICAS (v2.0)
// ==========================================

const MAX_MUESTRAS = 5;
const CLAVE_MUESTRAS = 'tarot_muestras_v2';

function obtenerMuestrasFisicasRestantes() {
    let muestras = localStorage.getItem(CLAVE_MUESTRAS);
    if (muestras === null) {
        localStorage.setItem(CLAVE_MUESTRAS, MAX_MUESTRAS.toString());
        return MAX_MUESTRAS;
    }
    return parseInt(muestras, 10) || 0;
}

function registrarUsoTiradaFisica() {
    if (AppState.esUsuarioPremium) return;
    let actuales = obtenerMuestrasFisicasRestantes();
    if (actuales > 0) {
        actuales--;
        localStorage.setItem(CLAVE_MUESTRAS, actuales.toString());
        actualizarBadgeMuestrasFisicas();
    }
}

function actualizarBadgeMuestrasFisicas() {
    const badge = document.getElementById('badge-fisico-muestra-prof');
    if (!badge) return;
    
    if (AppState.esUsuarioPremium) {
        badge.innerText = "Ilimitado ✨";
        badge.style.borderColor = "#a78bfa";
    } else {
        const restantes = obtenerMuestrasFisicasRestantes();
        badge.innerText = restantes > 0 ? `${restantes} Muestras` : "Agotado 🔒";
        badge.style.color = restantes > 0 ? '#ffd700' : '#ef4444';
    }
}

function verificarAccesoTarotista() {
    if (AppState.esUsuarioPremium) {
        AppState.modoFisicoActivo = false;
        if (typeof irAlEjeConsulta === 'function') irAlEjeConsulta('manual');
    } else {
        const codigo = prompt("✨ El Modo Tarotista es exclusivo de TarotIA Premium.\nIngresá tu código de acceso:");
        if (codigo && typeof canjearCodigoPremium === 'function') {
            canjearCodigoPremium(codigo);
        }
    }
}

function verificarAccesoFisico() {
    if (AppState.esUsuarioPremium) {
        AppState.modoFisicoActivo = true;
        if (typeof inicializarYMostrarPantallaFisica === 'function') {
            inicializarYMostrarPantallaFisica();
        }
        return;
    }
    
    const restantes = obtenerMuestrasFisicasRestantes();
    if (restantes <= 0) {
        alert("🔒 Tus muestras gratuitas de Mazo Físico se agotaron.\nAdquirí el Pase Premium para acceso ilimitado.");
        return;
    }
    
    AppState.modoFisicoActivo = true;
    if (typeof inicializarYMostrarPantallaFisica === 'function') {
        inicializarYMostrarPantallaFisica();
    }
}

function verificarAccesoTarotistaFisico() {
    if (!AppState.esUsuarioPremium) {
        const codigo = prompt("✨ El Modo Tarotista con Mazo Físico es exclusivo de TarotIA Premium.\nIngresá tu código de acceso:");
        if (codigo && typeof canjearCodigoPremium === 'function') {
            canjearCodigoPremium(codigo);
        }
        return;
    }
    
    AppState.modoFisicoActivo = true;
    AppState.estiloSeleccionado = 'manual';
    if (typeof inicializarYMostrarPantallaFisica === 'function') {
        inicializarYMostrarPantallaFisica();
    }
}

// Inicializar badge al cargar
document.addEventListener('DOMContentLoaded', () => {
    actualizarBadgeMuestrasFisicas();
});
