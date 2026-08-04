// ==========================================
// ALMACENAMIENTO E HISTORIAL LOCAL (v2.0)
// ==========================================

const CLAVE_HISTORIAL = 'tarotHistorial_v2';

function guardarEnHistorialLocal(tema, cartas, lecturaHtml) {
    try {
        let historial = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];
        const nuevaLectura = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            tema: tema,
            cartas: cartas,
            lectura: lecturaHtml
        };
        historial.unshift(nuevaLectura);
        if (historial.length > 20) historial = historial.slice(0, 20); 
        localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    } catch (e) {
        console.error("Error guardando historial:", e);
    }
}

function abrirHistorial() {
    ocultarTodasLasPantallas();
    
    const screenHistorial = document.getElementById('screen-historial');
    const contenedor = document.getElementById('lista-historial-contenedor');
    
    if (screenHistorial && contenedor) {
        contenedor.innerHTML = "";
        const historial = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];
        
        if (historial.length === 0) {
            contenedor.innerHTML = `<p class="historial-vacio">No poseés lecturas guardadas en este dispositivo.</p>`;
        } else {
            historial.forEach(item => {
                const bloque = document.createElement('div');
                bloque.className = 'history-item';
                
                bloque.innerHTML = `
                    <div class="history-header">
                        <span>📅 ${item.fecha}</span>
                        <span>🔮 Eje: ${escapeHtml(item.tema)}</span>
                    </div>
                    <p class="history-cartas">🃏 ${escapeHtml(item.cartas?.a || '')} • ${escapeHtml(item.cartas?.b || '')} • ${escapeHtml(item.cartas?.c || '')} • ${escapeHtml(item.cartas?.d || '')}</p>
                    <button class="btn-revisar-historial">Revisar Interpretación</button>
                `;

                bloque.querySelector('.btn-revisar-historial').addEventListener('click', () => {
                    cargarLecturaHistorial(item.lectura, item.tema);
                });

                contenedor.appendChild(bloque);
            });
        }
        mostrarPantalla('screen-historial');
    }
}

function cargarLecturaHistorial(lecturaHtml, tema) {
    ocultarTodasLasPantallas();
    
    const screenResult = document.getElementById('screen-result');
    if (screenResult) {
        const titleEl = document.getElementById('reading-theme-title');
        const textEl = document.getElementById('interpretation-text');
        
        if (titleEl) titleEl.innerText = `Historial: Eje ${tema}`;
        if (textEl) textEl.innerHTML = lecturaHtml;
        
        ['name-a', 'name-b', 'name-c', 'name-d'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = "Guardada";
        });
        
        ['img-a', 'img-b', 'img-c', 'img-d'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        
        document.getElementById('voice-controls')?.classList.add('hidden');
        document.getElementById('contenedor-repregunta')?.classList.add('hidden');
        
        mostrarPantalla('screen-result');
    }
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}
