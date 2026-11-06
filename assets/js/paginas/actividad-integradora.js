/**
 * EVALUACIÓN FINAL INTEGRADORA - POLILIBRO DE GESTIÓN EMPRESARIAL
 * Escuela Superior de Cómputo (ESCOM - IPN)
 * Articula las 5 unidades de la materia con navegación libre, preservación de estado,
 * retroalimentación formativa y desglose analítico de rendimiento por unidad temática.
 */

(function () {
  const RUTA_BANCO = 'assets/data/preguntas/evaluacion-integradora.json';

  let bancoDatos = null;
  let preguntasActivas = [];
  let respuestasUsuario = {}; // idPregunta -> indiceOpcion
  let indiceActual = 0;
  let evaluacionFinalizada = false;

  // Elementos DOM
  const dom = {
    cargando: document.getElementById('eval-cargando'),
    error: document.getElementById('eval-error'),
    contenedor: document.getElementById('eval-contenedor'),
    mapaPreguntas: document.getElementById('eval-mapa-preguntas'),
    numeroPregunta: document.getElementById('eval-num-pregunta'),
    badgeUnidad: document.getElementById('eval-badge-unidad'),
    textoEnunciado: document.getElementById('eval-enunciado'),
    listaOpciones: document.getElementById('eval-opciones'),
    btnAnterior: document.getElementById('eval-btn-anterior'),
    btnSiguiente: document.getElementById('eval-btn-siguiente'),
    btnFinalizar: document.getElementById('eval-btn-finalizar'),
    barraProgreso: document.getElementById('eval-barra-progreso'),
    textoProgreso: document.getElementById('eval-texto-progreso'),
    panelResultados: document.getElementById('eval-resultados'),
    panelPregunta: document.getElementById('eval-panel-pregunta'),
    scorePorcentaje: document.getElementById('eval-score-porcentaje'),
    scoreAciertos: document.getElementById('eval-score-aciertos'),
    scoreMensaje: document.getElementById('eval-score-mensaje'),
    desgloseUnidades: document.getElementById('eval-desglose-unidades'),
    revisionLista: document.getElementById('eval-revision-lista'),
    btnReiniciar: document.getElementById('eval-btn-reiniciar'),
    alertaPendientes: document.getElementById('eval-alerta-pendientes'),
    bannerU2: document.getElementById('banner-u2-pendiente')
  };

  /** Carga inicial del banco JSON */
  async function inicializar() {
    try {
      if (dom.cargando) dom.cargando.hidden = false;
      const respuesta = await DataManager.getArchivo(RUTA_BANCO);
      bancoDatos = respuesta;

      // Recopilar preguntas de unidades disponibles
      preguntasActivas = [];
      bancoDatos.unidades.forEach(u => {
        if (u.disponible && Array.isArray(u.preguntas)) {
          preguntasActivas.push(...u.preguntas);
        }
      });

      if (!preguntasActivas.length) {
        throw new Error('No hay preguntas disponibles en el banco integrador.');
      }

      reiniciarEstado();
      renderizarMapa();
      mostrarPregunta(0);

      if (dom.cargando) dom.cargando.hidden = true;
      if (dom.contenedor) dom.contenedor.hidden = false;
    } catch (err) {
      console.error('[Evaluación Integradora]', err);
      if (dom.cargando) dom.cargando.hidden = true;
      if (dom.error) {
        dom.error.hidden = false;
        const msg = dom.error.querySelector('.eval-error-msg');
        if (msg) msg.textContent = err.message || 'Error al cargar la evaluación integradora.';
      }
    }
  }

  function reiniciarEstado() {
    respuestasUsuario = {};
    indiceActual = 0;
    evaluacionFinalizada = false;
    if (dom.panelResultados) dom.panelResultados.hidden = true;
    if (dom.panelPregunta) dom.panelPregunta.hidden = false;
    if (dom.btnFinalizar) dom.btnFinalizar.hidden = false;
    actualizarProgreso();
  }

  /** Renderiza los botones de salto rápido (1, 2, 3...) */
  function renderizarMapa() {
    if (!dom.mapaPreguntas) return;
    dom.mapaPreguntas.innerHTML = '';

    preguntasActivas.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'eval-map-btn';
      btn.textContent = idx + 1;
      btn.setAttribute('aria-label', `Ir a la pregunta ${idx + 1}`);
      btn.dataset.indice = idx;

      btn.addEventListener('click', () => {
        mostrarPregunta(idx);
      });

      dom.mapaPreguntas.appendChild(btn);
    });

    actualizarEstilosMapa();
  }

  function actualizarEstilosMapa() {
    if (!dom.mapaPreguntas) return;
    const botones = dom.mapaPreguntas.querySelectorAll('.eval-map-btn');
    botones.forEach((btn, idx) => {
      const p = preguntasActivas[idx];
      const respondida = respuestasUsuario[p.id] !== undefined;
      const esActual = idx === indiceActual;

      btn.classList.toggle('is-current', esActual);
      btn.classList.toggle('is-answered', respondida && !esActual);
    });
  }

  /** Muestra la pregunta según su índice */
  function mostrarPregunta(idx) {
    if (idx < 0 || idx >= preguntasActivas.length) return;
    indiceActual = idx;
    const p = preguntasActivas[idx];

    if (dom.numeroPregunta) dom.numeroPregunta.textContent = `Pregunta ${idx + 1} de ${preguntasActivas.length}`;
    if (dom.badgeUnidad) dom.badgeUnidad.textContent = p.unidad_nombre || 'Gestión Empresarial';
    if (dom.textoEnunciado) dom.textoEnunciado.textContent = p.enunciado;

    // Renderizar opciones
    if (dom.listaOpciones) {
      dom.listaOpciones.innerHTML = '';
      p.opciones.forEach((opcionTexto, opcIdx) => {
        const item = document.createElement('li');
        item.className = 'eval-option-item';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `pregunta-${p.id}`;
        radio.id = `opc-${p.id}-${opcIdx}`;
        radio.value = opcIdx;
        radio.checked = respuestasUsuario[p.id] === opcIdx;

        const label = document.createElement('label');
        label.htmlFor = `opc-${p.id}-${opcIdx}`;
        label.className = 'eval-option-label';

        const letra = String.fromCharCode(65 + opcIdx);
        label.innerHTML = `<span class="eval-option-letter">${letra}</span> <span class="eval-option-text">${opcionTexto}</span>`;

        // Evento de selección
        const seleccionar = () => {
          respuestasUsuario[p.id] = opcIdx;
          radio.checked = true;
          actualizarSeleccionOpciones();
          actualizarEstilosMapa();
          actualizarProgreso();
        };

        radio.addEventListener('change', seleccionar);
        item.addEventListener('click', seleccionar);

        item.appendChild(radio);
        item.appendChild(label);
        dom.listaOpciones.appendChild(item);
      });

      actualizarSeleccionOpciones();
    }

    // Botones de navegación
    if (dom.btnAnterior) {
      dom.btnAnterior.disabled = idx === 0;
    }
    if (dom.btnSiguiente) {
      dom.btnSiguiente.hidden = idx === preguntasActivas.length - 1;
    }

    actualizarEstilosMapa();
  }

  function actualizarSeleccionOpciones() {
    if (!dom.listaOpciones) return;
    const p = preguntasActivas[indiceActual];
    const items = dom.listaOpciones.querySelectorAll('.eval-option-item');
    items.forEach((item, opcIdx) => {
      const seleccionado = respuestasUsuario[p.id] === opcIdx;
      item.classList.toggle('is-selected', seleccionado);
    });
  }

  function actualizarProgreso() {
    const respondidas = Object.keys(respuestasUsuario).length;
    const total = preguntasActivas.length;
    const porcentaje = total > 0 ? Math.round((respondidas / total) * 100) : 0;

    if (dom.barraProgreso) dom.barraProgreso.style.width = `${porcentaje}%`;
    if (dom.textoProgreso) {
      dom.textoProgreso.textContent = `${respondidas} de ${total} reactivos respondidos (${porcentaje}%)`;
    }
  }

  /** Finaliza la evaluación y genera reporte analítico */
  function evaluar() {
    const total = preguntasActivas.length;
    const respondidas = Object.keys(respuestasUsuario).length;

    if (respondidas < total) {
      const faltantes = total - respondidas;
      const confirma = confirm(`Tienes ${faltantes} reactivo(s) sin responder. ¿Deseas finalizar y calificar la evaluación de todas formas?`);
      if (!confirma) return;
    }

    evaluacionFinalizada = true;
    let aciertosGlobales = 0;

    // Desglose por unidad
    const estadisticasUnidades = {};
    bancoDatos.unidades.forEach(u => {
      estadisticasUnidades[u.id] = {
        nombre: u.nombre,
        disponible: u.disponible,
        mensaje_pendiente: u.mensaje_pendiente || null,
        total: 0,
        aciertos: 0
      };
    });

    preguntasActivas.forEach(p => {
      const respUser = respuestasUsuario[p.id];
      const esCorrecta = respUser !== undefined && respUser === p.respuesta_correcta;

      if (esCorrecta) aciertosGlobales++;

      if (estadisticasUnidades[p.unidad_id]) {
        estadisticasUnidades[p.unidad_id].total++;
        if (esCorrecta) estadisticasUnidades[p.unidad_id].aciertos++;
      }
    });

    const porcentajeGlobal = Math.round((aciertosGlobales / total) * 100);

    // Ocultar pregunta y mostrar resultados
    if (dom.panelPregunta) dom.panelPregunta.hidden = true;
    if (dom.panelResultados) dom.panelResultados.hidden = false;

    if (dom.scorePorcentaje) dom.scorePorcentaje.textContent = `${porcentajeGlobal}%`;
    if (dom.scoreAciertos) {
      dom.scoreAciertos.textContent = `${aciertosGlobales} de ${total} aciertos`;
    }

    // Mensaje cualitativo
    if (dom.scoreMensaje) {
      if (porcentajeGlobal >= 90) {
        dom.scoreMensaje.innerHTML = `<span style="color: #22c55e;"><i class="fas fa-medal"></i> ¡Desempeño Sobresaliente!</span> Demuestras un dominio profundo de los aspectos teóricos, operativos, humanos y tecnológicos de la gestión empresarial.`;
      } else if (porcentajeGlobal >= 70) {
        dom.scoreMensaje.innerHTML = `<span style="color: #38bdf8;"><i class="fas fa-thumbs-up"></i> ¡Competencia Lograda!</span> Cuentas con bases sólidas para la toma de decisiones gerenciales. Te sugerimos repasar los reactivos con oportunidad de mejora.`;
      } else {
        dom.scoreMensaje.innerHTML = `<span style="color: #f59e0b;"><i class="fas fa-arrows-rotate"></i> ¡Continúa reforzando!</span> Revisa la retroalimentación formativa de cada unidad y vuelve a intentar la evaluación para afianzar tus competencias.`;
      }
    }

    // Renderizar desglose por unidades
    if (dom.desgloseUnidades) {
      dom.desgloseUnidades.innerHTML = '';
      bancoDatos.unidades.forEach(u => {
        const est = estadisticasUnidades[u.id];
        const card = document.createElement('div');
        card.className = 'eval-unit-score-card';

        if (!est.disponible) {
          card.innerHTML = `
            <div class="eval-unit-head">
              <span class="eval-unit-badge is-pending"><i class="fas fa-clock"></i> Pendiente</span>
              <h4 class="eval-unit-name">${est.nombre}</h4>
            </div>
            <p class="eval-unit-pending-msg">
              <i class="fas fa-info-circle"></i> ${est.mensaje_pendiente || 'Contenido pendiente de entrega por el equipo de desarrollo.'}
            </p>
          `;
        } else {
          const porc = est.total > 0 ? Math.round((est.aciertos / est.total) * 100) : 0;
          const claseColor = porc >= 70 ? 'is-good' : 'is-warning';
          card.innerHTML = `
            <div class="eval-unit-head">
              <span class="eval-unit-badge ${claseColor}">${porc}% (${est.aciertos}/${est.total})</span>
              <h4 class="eval-unit-name">${est.nombre}</h4>
            </div>
            <div class="eval-unit-meter">
              <div class="eval-unit-fill" style="width: ${porc}%;"></div>
            </div>
          `;
        }
        dom.desgloseUnidades.appendChild(card);
      });
    }

    // Renderizar revisión detallada de preguntas
    if (dom.revisionLista) {
      dom.revisionLista.innerHTML = '';
      preguntasActivas.forEach((p, idx) => {
        const respUser = respuestasUsuario[p.id];
        const esCorrecta = respUser !== undefined && respUser === p.respuesta_correcta;
        const respLetra = respUser !== undefined ? String.fromCharCode(65 + respUser) : 'Sin respuesta';
        const corrLetra = String.fromCharCode(65 + p.respuesta_correcta);

        const cardRev = document.createElement('article');
        cardRev.className = `eval-rev-item ${esCorrecta ? 'is-correct' : 'is-wrong'}`;

        cardRev.innerHTML = `
          <header class="eval-rev-head">
            <span class="eval-rev-num">Reactivo ${idx + 1}</span>
            <span class="eval-rev-unit">${p.unidad_nombre}</span>
            <span class="eval-rev-status ${esCorrecta ? 'is-correct' : 'is-wrong'}">
              <i class="fas ${esCorrecta ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${esCorrecta ? 'Acierto' : 'Incorrecta'}
            </span>
          </header>
          <p class="eval-rev-statement"><strong>${p.enunciado}</strong></p>
          <div class="eval-rev-comparison">
            <p><strong>Tu respuesta:</strong> <span class="${esCorrecta ? 'text-success' : 'text-danger'}">(${respLetra}) ${respUser !== undefined ? p.opciones[respUser] : 'No seleccionada'}</span></p>
            ${!esCorrecta ? `<p><strong>Respuesta esperada:</strong> <span class="text-success">(${corrLetra}) ${p.opciones[p.respuesta_correcta]}</span></p>` : ''}
          </div>
          <div class="eval-rev-feedback">
            <i class="fas fa-lightbulb"></i> <strong>Explicación formativa:</strong> ${p.explicacion}
          </div>
        `;

        dom.revisionLista.appendChild(cardRev);
      });
    }

    // Scroll arriba hacia los resultados
    window.scrollTo({ top: dom.panelResultados.offsetTop - 80, behavior: 'smooth' });
  }

  // Event Listeners de navegación
  if (dom.btnAnterior) {
    dom.btnAnterior.addEventListener('click', () => {
      if (indiceActual > 0) mostrarPregunta(indiceActual - 1);
    });
  }

  if (dom.btnSiguiente) {
    dom.btnSiguiente.addEventListener('click', () => {
      if (indiceActual < preguntasActivas.length - 1) mostrarPregunta(indiceActual + 1);
    });
  }

  if (dom.btnFinalizar) {
    dom.btnFinalizar.addEventListener('click', evaluar);
  }

  if (dom.btnReiniciar) {
    dom.btnReiniciar.addEventListener('click', () => {
      reiniciarEstado();
      renderizarMapa();
      mostrarPregunta(0);
      window.scrollTo({ top: dom.contenedor.offsetTop - 80, behavior: 'smooth' });
    });
  }

  // Teclado accesible
  document.addEventListener('keydown', (e) => {
    if (evaluacionFinalizada) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' && indiceActual < preguntasActivas.length - 1) {
      mostrarPregunta(indiceActual + 1);
    } else if (e.key === 'ArrowLeft' && indiceActual > 0) {
      mostrarPregunta(indiceActual - 1);
    }
  });

  // Inicio al cargar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }
})();
