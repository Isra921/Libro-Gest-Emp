// ==========================================================================
// CASO INTEGRADOR · UNIDAD IV (unidades/unidad-04/actividades/actividad-final.html)
// Cuatro etapas independientes: relacionar problema-herramienta, decidir si una
// medida procede legalmente, seleccionar los defectos vitales (Pareto) y
// ordenar un plan PHVA. El resultado se guarda como "resultadoActividad:4.final".
// Depende de: unidades-ui.js
// ==========================================================================

(function () {
    const UI = UnidadesUI;
    const CLAVE_RESULTADO = 'resultadoActividad:4.final';
    const UMBRAL_APROBADO = 70;

    const HERRAMIENTAS = [
        'Encuesta de clima organizacional',
        'Programa de inducción',
        'Diagnóstico de necesidades de capacitación (DNC)',
        'Análisis y descripción de puestos',
        'Evaluación de 360 grados'
    ];

    const PROBLEMAS = [
        {
            texto: 'La rotación anual llegó a 35 % y en las entrevistas de salida se menciona un mal ambiente de trabajo.',
            respuesta: 'Encuesta de clima organizacional',
            explicacion: 'La encuesta de clima mide la satisfacción del personal y detecta qué mejorar del ambiente para reducir la rotación.'
        },
        {
            texto: 'Los operadores recién contratados desconocen las normas de la planta y sus funciones.',
            respuesta: 'Programa de inducción',
            explicacion: 'La inducción integra a los nuevos colaboradores a la cultura, normas y funciones de la empresa.'
        },
        {
            texto: 'Los supervisores no saben interpretar las gráficas de control que exige el área de calidad.',
            respuesta: 'Diagnóstico de necesidades de capacitación (DNC)',
            explicacion: 'El DNC mide la brecha entre las competencias requeridas y las reales para diseñar la capacitación.'
        },
        {
            texto: 'Nadie tiene claro quién es responsable de liberar un lote terminado: cortadores y supervisores se culpan entre sí.',
            respuesta: 'Análisis y descripción de puestos',
            explicacion: 'Documentar funciones y responsabilidades de cada cargo elimina las ambigüedades en la distribución de tareas.'
        }
    ];

    const MEDIDAS = [
        {
            texto: 'Pedir a los trabajadores que firmen un acuerdo para renunciar al aguinaldo de este año a cambio de conservar el empleo.',
            procede: false,
            explicacion: 'No procede: por el principio de irrenunciabilidad, cualquier pacto en el que el trabajador renuncie a derechos mínimos no tiene validez.'
        },
        {
            texto: 'Resolver el reclamo por horas extra acudiendo primero a la instancia de conciliación.',
            procede: true,
            explicacion: 'Procede: la conciliación es el paso previo antes de llevar el conflicto a los tribunales laborales.'
        },
        {
            texto: 'Despedir a un operador con bajo rendimiento sin una causa prevista en la ley y sin pagarle indemnización.',
            procede: false,
            explicacion: 'No procede: un despido injustificado obliga al patrón a indemnizar al trabajador.'
        },
        {
            texto: 'Dotar al personal de corte de equipo de protección conforme a la NOM de seguridad e higiene aplicable.',
            procede: true,
            explicacion: 'Procede: garantizar condiciones seguras es una obligación del patrón; las NOM regulan la seguridad y salud en el trabajo.'
        },
        {
            texto: 'Pagar a las operadoras un salario menor que a los operadores que realizan exactamente la misma función.',
            procede: false,
            explicacion: 'No procede: viola el principio de igualdad y no discriminación y la igualdad de trato entre quienes realizan funciones parecidas.'
        }
    ];

    const DEFECTOS = [
        { nombre: 'Costura desviada', cantidad: 96 },
        { nombre: 'Manchas en la tela', cantidad: 64 },
        { nombre: 'Botón flojo', cantidad: 16 },
        { nombre: 'Etiqueta de talla errónea', cantidad: 12 },
        { nombre: 'Hilo suelto', cantidad: 8 },
        { nombre: 'Otros', cantidad: 4 }
    ];
    const VITALES = ['Costura desviada', 'Manchas en la tela'];

    const PHVA = [
        'Planear: fijar la meta de reducir 50 % la costura desviada y analizar sus causas con un diagrama de Ishikawa.',
        'Hacer: capacitar a los operadores y ajustar las máquinas en una línea piloto.',
        'Verificar: medir los defectos con una gráfica de control durante cuatro semanas.',
        'Actuar: estandarizar el método en todas las líneas e incluir el indicador de calidad en la evaluación del desempeño.'
    ];

    const estado = {
        resultados: {},
        respuestaOrden: [],
        ordenMezclado: []
    };

    function mezclar(lista) {
        const copia = [...lista];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    const $ = selector => document.querySelector(selector);

    // ---------- Etapa 1 ----------

    function dibujarEtapa1() {
        const opciones = mezclar(HERRAMIENTAS);
        $('#match').innerHTML = PROBLEMAS.map((p, i) => `
            <div class="ci-match__row">
                <label class="ci-match__problem" for="herr-${i}"><span class="ci-num">${i + 1}</span>${UI.esc(p.texto)}</label>
                <select id="herr-${i}" data-indice="${i}">
                    <option value="">Selecciona una herramienta…</option>
                    ${opciones.map(h => `<option value="${UI.esc(h)}">${UI.esc(h)}</option>`).join('')}
                </select>
            </div>`).join('');
        $('#match').addEventListener('change', () => habilitar(1));
    }

    function completaEtapa1() {
        return [...document.querySelectorAll('#match select')].every(s => s.value);
    }

    function comprobarEtapa1() {
        const selects = [...document.querySelectorAll('#match select')];
        const detalle = selects.map((s, i) => {
            const correcto = s.value === PROBLEMAS[i].respuesta;
            s.classList.add(correcto ? 'is-correct' : 'is-wrong');
            s.disabled = true;
            return { correcto, texto: correcto ? PROBLEMAS[i].explicacion : `Lo indicado era <strong>${UI.esc(PROBLEMAS[i].respuesta)}</strong>. ${UI.esc(PROBLEMAS[i].explicacion)}` };
        });
        return detalle;
    }

    // ---------- Etapa 2 ----------

    function dibujarEtapa2() {
        $('#decisiones').innerHTML = MEDIDAS.map((m, i) => `
            <fieldset class="ci-decision">
                <legend><span class="ci-num">${i + 1}</span>${UI.esc(m.texto)}</legend>
                <div class="ci-decision__options">
                    <label class="a-option"><input type="radio" name="medida-${i}" value="true"><span>Procede</span></label>
                    <label class="a-option"><input type="radio" name="medida-${i}" value="false"><span>No procede</span></label>
                </div>
            </fieldset>`).join('');
        $('#decisiones').addEventListener('change', () => habilitar(2));
    }

    function completaEtapa2() {
        return MEDIDAS.every((_, i) => document.querySelector(`input[name="medida-${i}"]:checked`));
    }

    function comprobarEtapa2() {
        return MEDIDAS.map((m, i) => {
            const elegido = document.querySelector(`input[name="medida-${i}"]:checked`);
            const correcto = (elegido.value === 'true') === m.procede;
            document.querySelectorAll(`input[name="medida-${i}"]`).forEach(input => {
                input.disabled = true;
                const opcion = input.closest('.a-option');
                opcion.classList.add('is-locked');
                if ((input.value === 'true') === m.procede) opcion.classList.add('is-correct');
                else if (input.checked) opcion.classList.add('is-wrong');
            });
            return { correcto, texto: UI.esc(m.explicacion) };
        });
    }

    // ---------- Etapa 3 ----------

    function dibujarEtapa3() {
        const filas = mezclar(DEFECTOS).map(d => `
            <label class="ci-check">
                <input type="checkbox" value="${UI.esc(d.nombre)}">
                <span class="ci-check__name">${UI.esc(d.nombre)}</span>
                <span class="ci-check__count">${d.cantidad}</span>
            </label>`).join('');
        $('#pareto').innerHTML = `
            <div class="ci-sheet" role="group" aria-label="Hoja de verificación: defectos del último mes">
                <div class="ci-sheet__head"><span>Defecto</span><span>Frecuencia</span></div>
                ${filas}
                <div class="ci-sheet__total"><span>Total</span><span>${DEFECTOS.reduce((s, d) => s + d.cantidad, 0)}</span></div>
            </div>
            <div class="ci-chart" id="graficaPareto" hidden></div>`;
        $('#pareto').addEventListener('change', () => habilitar(3));
    }

    function completaEtapa3() {
        return document.querySelectorAll('#pareto input:checked').length > 0;
    }

    function graficaPareto() {
        const total = DEFECTOS.reduce((s, d) => s + d.cantidad, 0);
        const maximo = DEFECTOS[0].cantidad;
        let acumulado = 0;
        const barras = DEFECTOS.map(d => {
            acumulado += d.cantidad;
            const pct = Math.round((acumulado / total) * 100);
            const vital = VITALES.includes(d.nombre);
            return `
                <div class="ci-bar${vital ? ' is-vital' : ''}">
                    <span class="ci-bar__label">${UI.esc(d.nombre)}</span>
                    <span class="ci-bar__track"><span class="ci-bar__fill" style="width:${(d.cantidad / maximo) * 100}%"></span></span>
                    <span class="ci-bar__value">${d.cantidad} · ${pct} % acum.</span>
                </div>`;
        }).join('');
        const grafica = $('#graficaPareto');
        grafica.innerHTML = `<p class="ci-chart__title">Diagrama de Pareto: frecuencia y porcentaje acumulado</p>${barras}`;
        grafica.hidden = false;
    }

    function comprobarEtapa3() {
        const elegidos = [...document.querySelectorAll('#pareto input:checked')].map(i => i.value);
        document.querySelectorAll('#pareto input').forEach(input => {
            input.disabled = true;
            const vital = VITALES.includes(input.value);
            if (vital) input.closest('.ci-check').classList.add('is-correct');
            else if (input.checked) input.closest('.ci-check').classList.add('is-wrong');
        });
        graficaPareto();
        const exacto = elegidos.length === VITALES.length && VITALES.every(v => elegidos.includes(v));
        return [{
            correcto: exacto,
            texto: exacto
                ? 'Costura desviada y manchas en la tela suman 160 de 200 defectos (80 %): son los pocos vitales que conviene atacar primero.'
                : 'Los pocos vitales son <strong>costura desviada</strong> y <strong>manchas en la tela</strong>: juntos suman 160 de 200 defectos, es decir, el 80 %. Los demás son los muchos triviales.'
        }];
    }

    // ---------- Etapa 4 ----------

    function dibujarOrden() {
        const colocados = estado.respuestaOrden.map((indice, pos) =>
            `<button class="a-segment" type="button" data-colocado="${pos}">${UI.esc(estado.ordenMezclado[indice])}</button>`).join('');
        const disponibles = estado.ordenMezclado.map((texto, i) => estado.respuestaOrden.includes(i) ? '' :
            `<button class="a-segment" type="button" data-segmento="${i}">${UI.esc(texto)}</button>`).join('');
        $('#phva').innerHTML = `
            <div class="a-order__answer ci-order" id="ordenRespuesta" role="group" data-vacio="Aquí aparecerá tu plan" aria-label="Tu plan">${colocados}</div>
            <div class="a-order__bank ci-order" role="group" aria-label="Acciones disponibles">${disponibles}</div>`;
        habilitar(4);
    }

    function dibujarEtapa4() {
        estado.ordenMezclado = mezclar(PHVA);
        estado.respuestaOrden = [];
        dibujarOrden();
    }

    function iniciarEventosEtapa4() {
        $('#phva').addEventListener('click', e => {
            const boton = e.target.closest('button');
            if (!boton || boton.disabled) return;
            if (boton.dataset.segmento !== undefined) estado.respuestaOrden.push(Number(boton.dataset.segmento));
            else if (boton.dataset.colocado !== undefined) estado.respuestaOrden.splice(Number(boton.dataset.colocado), 1);
            dibujarOrden();
        });
    }

    function completaEtapa4() {
        return estado.respuestaOrden.length === PHVA.length;
    }

    function comprobarEtapa4() {
        const elegido = estado.respuestaOrden.map(i => estado.ordenMezclado[i]);
        document.querySelectorAll('#phva .a-segment').forEach(b => { b.disabled = true; });
        return elegido.map((texto, pos) => {
            const correcto = texto === PHVA[pos];
            return {
                correcto,
                texto: correcto
                    ? `Paso ${pos + 1} correcto: ${UI.esc(texto.split(':')[0])}.`
                    : `En el paso ${pos + 1} va <strong>${UI.esc(PHVA[pos].split(':')[0])}</strong>: ${UI.esc(PHVA[pos].split(': ')[1])}`
            };
        });
    }

    // ---------- Flujo general ----------

    const ETAPAS = {
        1: { dibujar: dibujarEtapa1, completa: completaEtapa1, comprobar: comprobarEtapa1 },
        2: { dibujar: dibujarEtapa2, completa: completaEtapa2, comprobar: comprobarEtapa2 },
        3: { dibujar: dibujarEtapa3, completa: completaEtapa3, comprobar: comprobarEtapa3 },
        4: { dibujar: dibujarEtapa4, completa: completaEtapa4, comprobar: comprobarEtapa4 }
    };

    function habilitar(n) {
        const boton = document.querySelector(`[data-comprobar="${n}"]`);
        if (boton && !boton.hidden) boton.disabled = !ETAPAS[n].completa();
    }

    function comprobar(n) {
        if (!ETAPAS[n].completa()) return;
        const detalle = ETAPAS[n].comprobar();
        const aciertos = detalle.filter(d => d.correcto).length;
        estado.resultados[n] = { aciertos, total: detalle.length };

        const todo = aciertos === detalle.length;
        document.querySelector(`[data-retro="${n}"]`).innerHTML = `
            <div class="a-feedback${todo ? '' : ' is-wrong'}">
                <span class="a-feedback__icon"><i class="fas ${todo ? 'fa-check' : 'fa-circle-info'}" aria-hidden="true"></i></span>
                <div>
                    <p class="a-feedback__title">Etapa ${n} · ${aciertos} de ${detalle.length} correctas</p>
                    <ul class="ci-feedback__list">
                        ${detalle.map(d => `<li class="${d.correcto ? 'is-correct' : 'is-wrong'}"><i class="fas ${d.correcto ? 'fa-check' : 'fa-xmark'}" aria-hidden="true"></i> <span>${d.texto}</span></li>`).join('')}
                    </ul>
                </div>
            </div>`;
        document.querySelector(`[data-comprobar="${n}"]`).hidden = true;
        document.querySelector(`[data-reintentar="${n}"]`).hidden = false;
        document.getElementById(`etapa-${n}`).classList.add('is-done');
        actualizarAvance();
    }

    function reintentar(n) {
        const seccion = document.getElementById(`etapa-${n}`);
        const contenedor = seccion.querySelector('#match, #decisiones, #pareto, #phva');
        const nuevo = contenedor.cloneNode(false);
        contenedor.replaceWith(nuevo);
        delete estado.resultados[n];
        seccion.classList.remove('is-done');
        document.querySelector(`[data-retro="${n}"]`).innerHTML = '';
        document.querySelector(`[data-reintentar="${n}"]`).hidden = true;
        const boton = document.querySelector(`[data-comprobar="${n}"]`);
        boton.hidden = false;
        boton.disabled = true;
        ETAPAS[n].dibujar();
        if (n === 4) iniciarEventosEtapa4();
        actualizarAvance();
    }

    function actualizarAvance() {
        const resueltas = Object.keys(estado.resultados).length;
        $('#barraAvance').style.width = `${(resueltas / 4) * 100}%`;
        $('#textoAvance').textContent = `${resueltas} de 4 etapas resueltas`;
        document.querySelectorAll('#listaEtapas li').forEach((li, i) => li.classList.toggle('is-done', Boolean(estado.resultados[i + 1])));
        if (resueltas === 4) mostrarResultado();
        else $('#resultadoFinal').hidden = true;
    }

    function mostrarResultado() {
        const valores = Object.values(estado.resultados);
        const aciertos = valores.reduce((s, r) => s + r.aciertos, 0);
        const total = valores.reduce((s, r) => s + r.total, 0);
        const porcentaje = Math.round((aciertos / total) * 100);
        UI.guardarPreferencia(CLAVE_RESULTADO, porcentaje);
        mostrarUltimoResultado();

        const nombres = ['Diagnóstico del capital humano', 'Marco normativo', 'Análisis de Pareto', 'Plan PHVA'];
        const caja = $('#resultadoFinal');
        caja.innerHTML = `
            <div class="a-result${porcentaje < UMBRAL_APROBADO ? ' is-low' : ''}" id="resultado" tabindex="-1">
                <span class="a-result__icon"><i class="fas ${porcentaje >= UMBRAL_APROBADO ? 'fa-trophy' : 'fa-book-open-reader'}" aria-hidden="true"></i></span>
                <p class="a-result__score" id="resTitulo">${porcentaje} %</p>
                <p class="a-result__detail">${aciertos} de ${total} decisiones correctas</p>
                <ul class="ci-summary">
                    ${nombres.map((nombre, i) => `<li><span>${nombre}</span><strong>${estado.resultados[i + 1].aciertos}/${estado.resultados[i + 1].total}</strong></li>`).join('')}
                </ul>
                <p class="a-result__text">${porcentaje >= UMBRAL_APROBADO
                    ? 'Tu dictamen para Manufacturas Tonatiuh es sólido: integraste la gestión del talento, el cumplimiento legal y las herramientas de calidad.'
                    : 'Revisa las etapas con errores y los temas relacionados; puedes reintentar cada etapa por separado.'}</p>
                <p class="a-result__text"><strong>Evidencia sugerida:</strong> redacta un dictamen de una cuartilla con las herramientas elegidas, las medidas que sí proceden, los defectos prioritarios y el plan PHVA, y entrégalo conforme a los lineamientos de tu profesor.</p>
            </div>`;
        caja.hidden = false;
        document.getElementById('resultado').focus();
    }

    function mostrarUltimoResultado() {
        const chip = document.getElementById('ultimoResultado');
        const valor = UI.leerPreferencia(CLAVE_RESULTADO, null);
        if (!chip || valor === null) return;
        chip.querySelector('strong').textContent = `${valor} %`;
        chip.hidden = false;
    }

    document.addEventListener('DOMContentLoaded', () => {
        Object.values(ETAPAS).forEach(etapa => etapa.dibujar());
        iniciarEventosEtapa4();
        document.querySelectorAll('[data-comprobar]').forEach(b => b.addEventListener('click', () => comprobar(Number(b.dataset.comprobar))));
        document.querySelectorAll('[data-reintentar]').forEach(b => b.addEventListener('click', () => reintentar(Number(b.dataset.reintentar))));
        mostrarUltimoResultado();
    });
})();
