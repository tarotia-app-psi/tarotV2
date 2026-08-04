// ==========================================
// SINTETIZADOR DE VOZ (v2.0)
// ==========================================

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[❌✨🔮🌗🌿🏆⚔️🪙🧙‍♂️💼🚀📚🔍🌓⏹️📡🔧⏳]/gu;

function limpiarTextoParaVoz(texto) {
    return texto
        .replace(EMOJI_REGEX, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function extraerSeccion(contenedor, inicioKeywords, finKeywords) {
    const elementos = contenedor.querySelectorAll('h3, p, li');
    let capturar = false;
    let texto = "";

    for (let i = 0; i < elementos.length; i++) {
        const el = elementos[i];
        const textoLimpio = el.innerText.toLowerCase();

        if (el.tagName === 'H3' && inicioKeywords.some(k => textoLimpio.includes(k))) {
            capturar = true;
            texto += " " + el.innerText;
            continue;
        }

        if (capturar && el.tagName === 'H3' && finKeywords.some(k => textoLimpio.includes(k))) {
            break;
        }

        if (capturar) texto += " " + el.innerText;
    }

    return texto.trim();
}

function reproducirVoz(tipo) {
    if (!window.speechSynthesis) {
        alert("Tu navegador no soporta síntesis de voz.");
        return;
    }
    
    window.speechSynthesis.cancel();
    
    const contenedor = document.getElementById('interpretation-text');
    if (!contenedor) return;

    let textoA_Leer = "";

    if (tipo === 'todo') {
        textoA_Leer = contenedor.innerText;
    } else if (tipo === 'conclusion') {
        textoA_Leer = extraerSeccion(
            contenedor,
            ['conclusión', 'síntesis', 'consejo final', 'resumen'],
            ['predicción', 'próximo', 'futuro']
        );
        if (!textoA_Leer) {
            const ps = contenedor.querySelectorAll('p, li');
            if (ps.length > 0) textoA_Leer = ps[ps.length - 1].innerText;
        }
    } else if (tipo === 'predicciones') {
        textoA_Leer = extraerSeccion(
            contenedor,
            ['predicciones', 'predicción', 'proyección', 'futuro'],
            ['conclusión', 'consejo', 'síntesis', 'resumen']
        );
        if (!textoA_Leer) {
            const ps = contenedor.querySelectorAll('p');
            if (ps.length >= 3) textoA_Leer = ps[ps.length - 2].innerText;
        }
    }

    if (!textoA_Leer.trim()) textoA_Leer = contenedor.innerText;

    textoA_Leer = limpiarTextoParaVoz(textoA_Leer);
    if (!textoA_Leer) return;

    const utterance = new SpeechSynthesisUtterance(textoA_Leer);
    utterance.lang = 'es-AR';
    utterance.rate = 1.05;
    utterance.pitch = 1.05;

    window.speechSynthesis.speak(utterance);
}
