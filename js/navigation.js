
// ==========================================
// GESTIÓN DE PANTALLAS Y NAVEGACIÓN (v2.0)
// ==========================================

function ocultarTodasLasPantallas() {
    const pantallas = document.querySelectorAll('.screen');
    pantallas.forEach(p => {
        p.classList.add('hidden');
        p.style.display = 'none';
    });
}

function mostrarPantalla(idPantalla) {
    ocultarTodasLasPantallas();
    const pantalla = document.getElementById(idPantalla);
    if (pantalla) {
        pantalla.classList.remove('hidden');
        pantalla.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error(`La pantalla con ID '${idPantalla}' no existe.`);
    }
}

function seleccionarEstilo(estilo) {
    AppState.estiloSeleccionado = estilo;
    AppState.modoFisicoActivo = false;

    if (estilo === 'manual') {
        if (typeof verificarAccesoTarotista === 'function') {
            verificarAccesoTarotista();
        }
        return;
    }
    mostrarPantalla('screen-selector'); 
}

function irAlEjeConsulta(estilo = 'magico') {
    seleccionarEstilo(estilo);
}

function irAlEjeFisico() {
    AppState.modoFisicoActivo = true;
    mostrarPantalla('screen-selector');
}

// ==========================================
// RUTAS Y SUBPANTALLAS
// ==========================================

function volverAPortada() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    cancelarRequestActiva();
    AppState.modoFisicoActivo = false;
    mostrarPantalla('screen-portada');
}

function volverInicio() {
    volverAPortada();
}

function abrirModuloProfesional() {
    mostrarPantalla('screen-modulo-profesional');
}

function volverAlModuloProfesional() {
    mostrarPantalla('screen-modulo-profesional');
}

function abrirGuiaLectura() {
    mostrarPantalla('screen-guia-lectura');
}

function abrirPantallaPregunta() {
    if (!AppState.esUsuarioPremium) {
        alert("✨ La Pregunta Específica es exclusiva de TarotIA Premium.\nAdquirí tu pase para desbloquearla.");
        return;
    }
    mostrarPantalla('screen-pregunta');
}

// ==========================================
// UTILIDADES
// ==========================================

function pedirEmailAlUsuario() {
    const email = prompt("📧 Ingresa tu correo electrónico para vincular tu cuenta:");
    if (!email) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.trim())) {
        localStorage.setItem('tarotUserEmail', email.trim());
        alert(`¡Gracias! Tu correo (${email.trim()}) ha sido vinculado.`);
    } else {
        alert("❌ Por favor, ingresa un correo electrónico válido.");
    }
}

function ejecutarLecturaSegunModo(tema) {
    if (typeof procesarTiradaCompleta === 'function') {
        procesarTiradaCompleta(tema, null);
    }
}

function confirmarPreguntaYEjecutar() {
    const inputPregunta = document.getElementById('texto-pregunta-usuario');
    const preguntaText = inputPregunta ? inputPregunta.value.trim() : "";
    
    if (!preguntaText) {
        alert("✨ Por favor, escribe tu pregunta antes de continuar.");
        return;
    }

    if (typeof procesarTiradaCompleta === 'function') {
        procesarTiradaCompleta("Consulta Personalizada", preguntaText);
    }
}

// Inicializar contadores de caracteres
document.addEventListener('DOMContentLoaded', () => {
    const setupContador = (inputId, contadorId, max) => {
        const input = document.getElementById(inputId);
        const contador = document.getElementById(contadorId);
        if (!input || !contador) return;
        
        input.addEventListener('input', () => {
            contador.textContent = input.value.length;
            if (input.value.length >= max) {
                contador.style.color = '#ef4444';
            } else {
                contador.style.color = 'var(--muted-text)';
            }
        });
    };
    
    setupContador('texto-pregunta-usuario', 'contador-pregunta', 300);
    setupContador('texto-repregunta', 'contador-repregunta', 200);
});
