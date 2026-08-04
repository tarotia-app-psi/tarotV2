
// ==========================================
// NÚCLEO DE LA TIRADA (v2.0)
// ==========================================

const URL_BASE_CARTAS = "https://tarotia-app-psi.github.io/tarot-app/cartas/";
const CARTA_REVERSO = URL_BASE_CARTAS + "reverso_filosofico.jpg";

function formatearNombreCarta(nombre) {
    return nombre.toLowerCase().trim().replace(/ /g, "_");
}

function crearImagenCarta(nombre) {
    const img = document.createElement('img');
    img.src = `${URL_BASE_CARTAS}${formatearNombreCarta(nombre)}.jpg`;
    img.alt = nombre;
    img.className = 'img-carta-tarot';
    img.onerror = function() {
        this.src = CARTA_REVERSO;
    };
    return img;
}

// ==========================================
// CARTA DEL DÍA (Determinística por fecha)
// ==========================================

function tirarCartaDiaria() {
    const btn = document.getElementById('btn-carta-diaria');
    if (btn) btn.disabled = true;
    
    if (typeof arcanosCompleto === 'undefined' || !Array.isArray(arcanosCompleto)) {
        alert("Error: El mazo no está cargado.");
        if (btn) btn.disabled = false;
        return;
    }

    // Usar la fecha como seed para que sea la misma carta todo el día
    const hoy = new Date();
    const seed = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate();
    const idx = seed % arcanosCompleto.length;
    const carta = arcanosCompleto[idx];
    
    const significados = {
        "El Loco": "Hoy es día de nuevos comienzos. Atrevete a dar el primer paso sin miedo.",
        "El Mago": "Tenés todos los recursos. Es momento de manifestar tus deseos.",
        "La Sacerdotisa": "Escuchá tu intuición. Hay sabiduría oculta esperando ser revelada.",
        "La Emperatriz": "Abundancia y creatividad fluyen hacia vos. Nutrite y dejate nutrir.",
        "El Emperador": "Estructura y disciplina. Tomá el control de tu situación con firmeza.",
        "El Papa": "Buscá guía espiritual o consejo de alguien de confianza.",
        "Los Enamorados": "Las decisiones del corazón están en juego. Elegí con amor.",
        "El Carro": "Determinación y victoria. Avanzá con fuerza hacia tu meta.",
        "La Justicia": "La verdad sale a la luz. Actuá con integridad.",
        "El Ermitaño": "Momento de introspección. La respuesta está dentro tuyo.",
        "La Rueda de la Fortuna": "Los ciclos cambian. Preparate para una nueva etapa.",
        "La Fuerza": "Tu coraje interior es más poderoso de lo que creés. Dominá con amor.",
        "El Colgado": "Cambio de perspectiva. A veces hay que soltar para avanzar.",
        "La Muerte": "Fin de una etapa. Renacimiento y transformación profunda.",
        "La Templanza": "Equilibrio y paciencia. Mezclá los opuestos con sabiduría.",
        "El Diablo": "Ataduras que te limitan. Es momento de liberarte.",
        "La Torre": "Cambio abrupto pero necesario. Confiá en la reconstrucción.",
        "La Estrella": "Esperanza y sanación. Tu luz brilla en la oscuridad.",
        "La Luna": "Ilusiones y miedos. Mirá más allá de lo evidente.",
        "El Sol": "Éxito y alegría. Hoy brilla la claridad en tu camino.",
        "El Juicio": "Despertar espiritual. Respondé al llamado de tu alma.",
        "El Mundo": "Culminación y realización. Un ciclo se cierra con éxito."
    };
    
    // Para cartas menores, mensaje genérico por palo
    let mensaje = significados[carta];
    if (!mensaje) {
        if (carta.includes('Bastos')) mensaje = "Acción y energía creativa. Movete con pasión hoy.";
        else if (carta.includes('Copas')) mensaje = "Emociones y relaciones fluídas. Abrí tu corazón.";
        else if (carta.includes('Espadas')) mensaje = "Claridad mental. Tomá decisiones con la mente despejada.";
        else if (carta.includes('Oros')) mensaje = "Materialización y estabilidad. Confiá en tu esfuerzo.";
        else mensaje = "El universo tiene un mensaje especial para vos hoy.";
    }
    
    setTimeout(() => {
        alert(`✨ Tu carta del día es ${carta}:\n\n${mensaje}`);
        if (btn) btn.disabled = false;
    }, 400);
}

// ==========================================
// PROCESAR TIRADA COMPLETA
// ==========================================

async function procesarTiradaCompleta(tema, preguntaEspecifica = null) {
    if (AppState.loading) return; // Evitar doble click
    
    cancelarRequestActiva();
    setLoading(true);
    ocultarTodasLasPantallas();
    
    const screenResult = document.getElementById('screen-result');
    if (!screenResult) {
        setLoading(false);
        return;
    }
    
    mostrarPantalla('screen-result');

    const titleEl = document.getElementById('reading-theme-title');
    const textEl = document.getElementById('interpretation-text');
    
    if (titleEl) titleEl.innerText = `Consultando Oráculo: Eje ${tema}`;
    if (textEl) {
        textEl.innerHTML = `<p class='loading-cosmico'>✨ Conectando con los planos superiores del Tarot... Interpretando arquetipos...</p>`;
    }
    
    document.getElementById('voice-controls')?.classList.add('hidden');
    document.getElementById('contenedor-repregunta')?.classList.add('hidden');

    let a, b, c, d;

    if (AppState.modoFisicoActivo) {
        const c1 = document.getElementById('fisico-carta1')?.value;
        const c2 = document.getElementById('fisico-carta2')?.value;
        const c3 = document.getElementById('fisico-carta3')?.value;
        const c4 = document.getElementById('fisico-carta4')?.value;

        if (!c1 || !c2 || !c3 || !c4) {
            if (textEl) {
                textEl.innerHTML = `<p style='color:var(--error); text-align:center;'>❌ Error: Seleccioná las 4 cartas físicas antes de continuar.</p>`;
            }
            setLoading(false);
            return;
        }
        [a, b, c, d] = [c1, c2, c3, c4];
    } else {
        if (typeof arcanosCompleto === 'undefined' || !Array.isArray(arcanosCompleto)) {
            if (textEl) {
                textEl.innerHTML = `<p style='color:var(--error); text-align:center;'>Error: Mazo de arcanos no cargado.</p>`;
            }
            setLoading(false);
            return;
        }
        let baraja = [...arcanosCompleto];
        let elegidas = [];
        for (let i = 0; i < 4; i++) {
            let idx = Math.floor(Math.random() * baraja.length);
            elegidas.push(baraja.splice(idx, 1)[0]);
        }
        [a, b, c, d] = elegidas;
    }

    // Renderizar cartas con animación
    const nombres = { a, b, c, d };
    const idsNombres = ['name-a', 'name-b', 'name-c', 'name-d'];
    const idsImgs = ['img-a', 'img-b', 'img-c', 'img-d'];
    
    idsNombres.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.innerText = Object.values(nombres)[i];
    });
    
    idsImgs.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = '';
            el.appendChild(crearImagenCarta(Object.values(nombres)[i]));
        }
    });
    
    ultimasCartasElegidasContexto = { a, b, c, d };

    try {
        const controller = crearAbortController();
        
        const response = await fetch(`${API_URL}/tirada`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                tema: tema,
                pregunta: preguntaEspecifica, 
                a: a, b: b, c: c, d: d,
                estilo: AppState.estiloSeleccionado
            })
        });

        if (!response.ok) {
            if (response.status === 429) throw new Error("RATE_LIMIT");
            if (response.status >= 500) throw new Error("SERVER_ERROR");
            throw new Error(`HTTP ${response.status}`);
        }

        const datos = await response.json();

        if (datos.lectura) {
            if (textEl) textEl.innerHTML = datos.lectura;
            ultimaLecturaGuardadaContexto = datos.lectura;

            if (AppState.estiloSeleccionado !== 'manual') {
                document.getElementById('voice-controls')?.classList.remove('hidden');
            }

            if (AppState.esUsuarioPremium) {
                document.getElementById('contenedor-repregunta')?.classList.remove('hidden');
                const textRepregunta = document.getElementById('texto-repregunta');
                if (textRepregunta) textRepregunta.value = "";
            }
            
            if (AppState.modoFisicoActivo) {
                if (typeof registrarUsoTiradaFisica === 'function') {
                    registrarUsoTiradaFisica();
                }
            }
            
            if (typeof guardarEnHistorialLocal === 'function') {
                guardarEnHistorialLocal(tema, { a, b, c, d }, datos.lectura);
            }
        } else {
            throw new Error("Respuesta vacía del servidor");
        }

    } catch (err) {
        console.error("Error en tirada:", err);
        
        let mensajeError = "❌ La tormenta magnética interrumpió la conexión espiritual.";
        let esRetryable = false;
        
        if (err.name === 'AbortError') {
            mensajeError = "⏹️ Consulta cancelada.";
        } else if (err.message === 'RATE_LIMIT') {
            mensajeError = "⏳ Demasiadas consultas. Esperá un momento y probá de nuevo.";
            esRetryable = true;
        } else if (err.message === 'SERVER_ERROR') {
            mensajeError = "🔧 El servidor está descansando. Probá en unos segundos.";
            esRetryable = true;
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            mensajeError = "📡 Sin conexión a internet. Verificá tu red.";
            esRetryable = true;
        }
        
        if (textEl) {
            textEl.innerHTML = `
                <p style='color:var(--error); text-align:center; padding: 20px;'>
                    ${mensajeError}
                </p>
                ${esRetryable ? `<button onclick="procesarTiradaCompleta('${tema}', ${preguntaEspecifica ? `'${preguntaEspecifica.replace(/'/g, "\\'")}'` : 'null'})" style="margin-top:10px;">🔄 Reintentar</button>` : ''}
            `;
        }
    } finally {
        setLoading(false);
    }
}

// ==========================================
// ENVÍO DE RE-PREGUNTA PREMIUM
// ==========================================

async function enviarRepreguntaServidor() {
    const textoDuda = document.getElementById('texto-repregunta')?.value.trim();
    if (!textoDuda) {
        alert("🧙‍♂️ Escribe tu duda antes de enviársela al oráculo.");
        return;
    }

    const btn = document.getElementById('btn-enviar-repregunta');
    if (!btn) return;
    
    btn.disabled = true;
    const textoOriginal = btn.innerText;
    btn.innerText = "Consultando al plano sutil... 🔮";

    const contenedorTexto = document.getElementById('interpretation-text');

    try {
        const controller = crearAbortController();
        
        const response = await fetch(`${API_URL}/repregunta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                cartas: ultimasCartasElegidasContexto,
                lecturaAnterior: ultimaLecturaGuardadaContexto,
                repregunta: textoDuda,
                estilo: AppState.estiloSeleccionado
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const datos = await response.json();

        if (datos.respuesta && contenedorTexto) {
            const nuevaSeccion = document.createElement('div');
            nuevaSeccion.className = 'reading-section';
            
            nuevaSeccion.innerHTML = `
                <h3>🔮 Respuesta de Tara a tu Duda:</h3>
                <p>${datos.respuesta}</p>
            `;
            
            contenedorTexto.appendChild(nuevaSeccion);
            
            const textRepregunta = document.getElementById('texto-repregunta');
            if (textRepregunta) textRepregunta.value = "";
            
            nuevaSeccion.scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error("Respuesta inválida del oráculo");
        }
    } catch (error) {
        console.error("Error en re-pregunta:", error);
        if (error.name !== 'AbortError') {
            alert("Hubo un corte en los planos sutiles. Intenta de nuevo.");
        }
    } finally {
        if (btn) {
            btn.innerText = textoOriginal;
            btn.disabled = false;
        }
    }
}

// ==========================================
// INICIALIZAR SELECTS DE MAZO FÍSICO
// ==========================================

function inicializarYMostrarPantallaFisica() {
    if (typeof arcanosCompleto === 'undefined') {
        console.error("arcanosCompleto no está definido");
        return;
    }
    
    const selects = [
        document.getElementById('fisico-carta1'),
        document.getElementById('fisico-carta2'),
        document.getElementById('fisico-carta3'),
        document.getElementById('fisico-carta4')
    ];
    
    selects.forEach(select => {
        if (!select) return;
        select.innerHTML = '';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '— Seleccioná una carta —';
        select.appendChild(defaultOpt);
        
        arcanosCompleto.forEach(carta => {
            const opt = document.createElement('option');
            opt.value = carta;
            opt.textContent = carta;
            select.appendChild(opt);
        });
    });
    
    mostrarPantalla('screen-fisico');
}
