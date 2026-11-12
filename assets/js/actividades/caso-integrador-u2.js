/**
 * CASO INTEGRADOR · UNIDAD II (unidades/unidad-02/actividades/actividad-final.html)
 * Tema: Gestión estratégica en las empresas de innovación tecnológica
 * Caso: DataSecure México (FODA, Filosofía Corporativa y Cuadro de Mando Integral)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'caso-integrador-u2';

  var DATOS_CASO = {
    etapa1: {
      titulo: 'Diagnóstico de Competitividad y Matriz FODA',
      factores: [
        {
          id: 'f1',
          texto: 'Equipo de ingenieros con certificaciones internacionales (CISSP, OSCP) y conocimiento profundo de la normativa mexicana de protección de datos.',
          correcta: 'fortaleza',
          retro: 'Fortaleza (Interna): Capacidad técnica distintiva y talento calificado que otorga ventaja competitiva.'
        },
        {
          id: 'f2',
          texto: 'Carencia de un esquema formal de retención de talento que ha generado una rotación del 25 % en puestos sénior en el último año.',
          correcta: 'debilidad',
          retro: 'Debilidad (Interna): Limitación operativa y de recursos humanos que vulnera la estabilidad interna de la empresa.'
        },
        {
          id: 'f3',
          texto: 'Aumento del 180 % en regulaciones obligatorias de ciberseguridad y protección de datos para clínicas y hospitales en México.',
          correcta: 'oportunidad',
          retro: 'Oportunidad (Externa): Tendencia regulatoria y de mercado favorable que abre un nicho de negocio en expansión.'
        },
        {
          id: 'f4',
          texto: 'Entrada de proveedores transnacionales que comercializan licencias de seguridad estandarizadas a tarifas subsidiadas agresivas.',
          correcta: 'amenaza',
          retro: 'Amenaza (Externa): Riesgo del entorno competitivo exterior que puede restar participación de mercado.'
        }
      ],
      estrategia: {
        id: 'estrategia_cruce',
        pregunta: '¿Cuál es la estrategia ofensiva (FO / Maxi-Maxi) óptima que debe priorizar DataSecure cruzando sus Fortalezas con las Oportunidades del mercado?',
        opciones: [
          { id: 'fo', texto: 'Desarrollar soluciones empaquetadas de auditoría y blindaje normativo para el sector salud con acompañamiento técnico local y personalizado.', correcta: true, retro: '¡Correcto! Utiliza la fortaleza del talento certificado para conquistar la oportunidad regulatoria del sector salud antes que competidores estandarizados.' },
          { id: 'guerra_precios', texto: 'Reducir los precios un 50 % para competir directamente contra las empresas transnacionales en licencias masivas.', correcta: false, retro: 'Incorrecto. Entrar en guerra de precios sin economías de escala deteriora los márgenes y no aprovecha el valor técnico especializado.' },
          { id: 'ignorar', texto: 'Suspender las auditorías de ciberseguridad y dedicarse únicamente al soporte técnico de computadoras de escritorio.', correcta: false, retro: 'Incorrecto. Abandonar el giro tecnológico central elimina la propuesta de valor y las capacidades instaladas.' }
        ]
      }
    },
    etapa2: {
      titulo: 'Filosofía y Cultura Organizacional',
      elementos: [
        {
          id: 'mision',
          texto: 'Proteger la continuidad de los negocios y la privacidad digital de organizaciones mexicanas mediante soluciones avanzadas de ciberseguridad, rigor ético y talento humano de alto nivel.',
          correcta: 'mision',
          retro: 'Misión: Define la razón de ser, el propósito presente, a quién sirve, qué necesidad satisface y cómo genera valor.'
        },
        {
          id: 'vision',
          texto: 'Ser para 2030 la firma mexicana líder en innovación y ciberseguridad en América Latina, reconocida como el estándar de confianza digital para empresas de alta tecnología.',
          correcta: 'vision',
          retro: 'Visión: Proyecta la aspiración futura a largo plazo, guiando el rumbo inspirador y estratégico de la empresa.'
        },
        {
          id: 'valores',
          texto: 'Confidencialidad absoluta, integridad inquebrantable, excelencia técnica, colaboración transparente y responsabilidad social frente al riesgo cibernético.',
          correcta: 'valores',
          retro: 'Valores: Principios éticos, convicciones y normas de conducta que rigen la cultura organizacional y las decisiones del personal.'
        }
      ]
    },
    etapa3: {
      titulo: 'Cuadro de Mando Integral (Balanced Scorecard)',
      objetivos: [
        {
          id: 'bsc_fin',
          texto: 'Incrementar el margen de utilidad operativa al 28 % y lograr una facturación anual de \$12 millones MXN con contratos recurrentes.',
          correcta: 'financiera',
          retro: 'Perspectiva Financiera: Mide el rendimiento de las inversiones, rentabilidad, crecimiento de ingresos y valor para los accionistas.'
        },
        {
          id: 'bsc_cli',
          texto: 'Alcanzar una calificación neta de satisfacción del cliente (CSAT) del 95 % y reducir la tasa de deserción de cuentas clave a menos del 5 %.',
          correcta: 'clientes',
          retro: 'Perspectiva de Clientes: Mide la satisfacción, retención, adquisición y lealtad del mercado objetivo.'
        },
        {
          id: 'bsc_proc',
          texto: 'Automatizar las pruebas de vulnerabilidad para acortar el tiempo promedio de entrega de informes técnicos de 10 a 3 días hábiles.',
          correcta: 'procesos',
          retro: 'Perspectiva de Procesos Internos: Identifica los procesos clave de innovación y operación que deben sobresalir para satisfacer clientes y accionistas.'
        },
        {
          id: 'bsc_apr',
          texto: 'Capacitar a todo el personal técnico en arquitecturas Zero Trust y certificar anualmente al menos a 4 líderes en gestión de incidentes.',
          correcta: 'aprendizaje',
          retro: 'Perspectiva de Aprendizaje y Crecimiento: Mide la infraestructura humana, las competencias tecnológicas y el clima laboral para impulsar el cambio y mejora continua.'
        }
      ]
    }
  };

  var estado = {
    etapa1: null,
    etapa2: null,
    etapa3: null
  };

  function inicializar() {
    cargarEstado();
    renderizarEtapa1();
    renderizarEtapa2();
    renderizarEtapa3();
    actualizarAvance();
    vincularEventos();
  }

  function cargarEstado() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var g = JSON.parse(raw);
        if (g && typeof g === 'object') estado = g;
      }
    } catch (e) {
      console.warn('Error localStorage:', e);
    }
  }

  function guardarEstado() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch (e) {
      console.warn('Error save localStorage:', e);
    }
  }

  function actualizarAvance() {
    var resueltas = 0;
    if (estado.etapa1 && estado.etapa1.completada) resueltas++;
    if (estado.etapa2 && estado.etapa2.completada) resueltas++;
    if (estado.etapa3 && estado.etapa3.completada) resueltas++;

    var pct = Math.round((resueltas / 3) * 100);
    var barra = document.getElementById('barraAvance');
    var texto = document.getElementById('textoAvance');
    if (barra) barra.style.width = pct + '%';
    if (texto) texto.textContent = resueltas + ' de 3 etapas resueltas (' + pct + ' %)';

    var resEl = document.getElementById('ultimoResultado');
    if (resEl && resueltas === 3) {
      var totalPts = (estado.etapa1.puntos || 0) + (estado.etapa2.puntos || 0) + (estado.etapa3.puntos || 0);
      resEl.hidden = false;
      resEl.querySelector('strong').textContent = totalPts + ' / 11 pts (Completado)';
      mostrarResumenFinal(totalPts);
    }
  }

  // --- ETAPA 1 ---
  function renderizarEtapa1() {
    var cont = document.getElementById('contenedor-etapa-1');
    if (!cont) return;

    var html = '<div class="ci-match">';
    DATOS_CASO.etapa1.factores.forEach(function (f, idx) {
      var valPrevio = (estado.etapa1 && estado.etapa1.respuestas && estado.etapa1.respuestas.foda) ? estado.etapa1.respuestas.foda[f.id] : '';
      html += '<div class="ci-match__row">';
      html += '<div class="ci-match__problem"><span class="ci-num">' + (idx + 1) + '</span> <span>' + f.texto + '</span></div>';
      html += '<select id="etapa1-foda-' + f.id + '" aria-label="Clasificación FODA ' + (idx + 1) + '">';
      html += '<option value="">-- Selecciona cuadrante FODA --</option>';
      html += '<option value="fortaleza"' + (valPrevio === 'fortaleza' ? ' selected' : '') + '>Fortaleza (Interno Positivo)</option>';
      html += '<option value="debilidad"' + (valPrevio === 'debilidad' ? ' selected' : '') + '>Debilidad (Interno Negativo)</option>';
      html += '<option value="oportunidad"' + (valPrevio === 'oportunidad' ? ' selected' : '') + '>Oportunidad (Externo Positivo)</option>';
      html += '<option value="amenaza"' + (valPrevio === 'amenaza' ? ' selected' : '') + '>Amenaza (Externo Negativo)</option>';
      html += '</select>';
      html += '</div>';
    });
    html += '</div>';

    // Pregunta de estrategia
    var est = DATOS_CASO.etapa1.estrategia;
    var estPrevio = (estado.etapa1 && estado.etapa1.respuestas) ? estado.etapa1.respuestas.estrategia : '';
    html += '<fieldset class="ci-decision" style="margin-top:16px;">';
    html += '<legend><span class="ci-num">5</span> ' + est.pregunta + '</legend>';
    html += '<div class="ci-decision__options" style="display:flex; flex-direction:column; gap:8px;">';
    est.opciones.forEach(function (op) {
      var chk = (estPrevio === op.id) ? ' checked' : '';
      html += '<label class="ci-check"><input type="radio" name="etapa1_estrategia" value="' + op.id + '"' + chk + '> <span>' + op.texto + '</span></label>';
    });
    html += '</div>';
    html += '</fieldset>';

    cont.innerHTML = html;

    if (estado.etapa1 && estado.etapa1.completada) {
      validarEtapa1(true);
    }
  }

  function validarEtapa1(silencioso) {
    var cont = document.getElementById('contenedor-etapa-1');
    var fb = document.getElementById('feedback-etapa-1');
    var btnComprobar = document.querySelector('[data-comprobar="1"]');
    var btnReintentar = document.querySelector('[data-reintentar="1"]');
    var stageCard = document.getElementById('etapa-1');

    var puntos = 0;
    var faltantes = 0;
    var respuestas = { foda: {}, estrategia: '' };

    DATOS_CASO.etapa1.factores.forEach(function (f) {
      var sel = document.getElementById('etapa1-foda-' + f.id);
      var val = sel ? sel.value : '';
      respuestas.foda[f.id] = val;
      if (!val) faltantes++;
    });

    var radioEst = cont.querySelector('input[name="etapa1_estrategia"]:checked');
    if (radioEst) {
      respuestas.estrategia = radioEst.value;
    } else {
      faltantes++;
    }

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Clasifica los 4 factores FODA y selecciona la estrategia ofensiva.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa1.factores.forEach(function (f) {
      var sel = document.getElementById('etapa1-foda-' + f.id);
      var val = respuestas.foda[f.id];
      if (val === f.correcta) {
        puntos++;
        if (sel) { sel.classList.add('is-correct'); sel.classList.remove('is-wrong'); }
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + f.retro + '</div></li>';
      } else {
        if (sel) { sel.classList.add('is-wrong'); sel.classList.remove('is-correct'); }
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + f.retro + '</div></li>';
      }
    });

    var optEst = DATOS_CASO.etapa1.estrategia.opciones.find(function (o) { return o.id === respuestas.estrategia; });
    if (optEst && optEst.correcta) {
      puntos++;
      listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div><strong>Estrategia FODA:</strong> ' + optEst.retro + '</div></li>';
    } else {
      var msg = optEst ? optEst.retro : 'Sin respuesta de estrategia.';
      listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div><strong>Estrategia FODA:</strong> ' + msg + '</div></li>';
    }
    listHtml += '</ul>';

    var claseAlerta = puntos === 5 ? 'a-feedback--correct' : (puntos >= 3 ? 'a-feedback--warning' : 'a-feedback--wrong');
    fb.innerHTML = '<div class="a-feedback ' + claseAlerta + '"><p><strong>Puntuación: ' + puntos + ' / 5</strong></p>' + listHtml + '</div>';

    estado.etapa1 = { completada: true, puntos: puntos, respuestas: respuestas };
    guardarEstado();
    actualizarAvance();

    if (stageCard) stageCard.classList.add('is-done');
    if (btnComprobar) btnComprobar.hidden = true;
    if (btnReintentar) btnReintentar.hidden = false;
  }

  function reintentarEtapa1() {
    estado.etapa1 = null;
    guardarEstado();
    renderizarEtapa1();
    document.getElementById('feedback-etapa-1').innerHTML = '';
    var stageCard = document.getElementById('etapa-1');
    if (stageCard) stageCard.classList.remove('is-done');
    document.querySelector('[data-comprobar="1"]').hidden = false;
    document.querySelector('[data-reintentar="1"]').hidden = true;
    actualizarAvance();
  }

  // --- ETAPA 2 ---
  function renderizarEtapa2() {
    var cont = document.getElementById('contenedor-etapa-2');
    if (!cont) return;

    var html = '<div class="ci-match">';
    DATOS_CASO.etapa2.elementos.forEach(function (elem, idx) {
      var valPrevio = (estado.etapa2 && estado.etapa2.respuestas) ? estado.etapa2.respuestas[elem.id] : '';
      html += '<div class="ci-match__row">';
      html += '<div class="ci-match__problem"><span class="ci-num">' + (idx + 1) + '</span> <span>' + elem.texto + '</span></div>';
      html += '<select id="etapa2-filo-' + elem.id + '" aria-label="Componente de filosofía para enunciado ' + (idx + 1) + '">';
      html += '<option value="">-- ¿A qué componente corresponde? --</option>';
      html += '<option value="mision"' + (valPrevio === 'mision' ? ' selected' : '') + '>Misión (Propósito y razón de ser presente)</option>';
      html += '<option value="vision"' + (valPrevio === 'vision' ? ' selected' : '') + '>Visión (Aspiración de futuro a largo plazo)</option>';
      html += '<option value="valores"' + (valPrevio === 'valores' ? ' selected' : '') + '>Valores (Principios éticos y de conducta)</option>';
      html += '</select>';
      html += '</div>';
    });
    html += '</div>';
    cont.innerHTML = html;

    if (estado.etapa2 && estado.etapa2.completada) {
      validarEtapa2(true);
    }
  }

  function validarEtapa2(silencioso) {
    var cont = document.getElementById('contenedor-etapa-2');
    var fb = document.getElementById('feedback-etapa-2');
    var btnComprobar = document.querySelector('[data-comprobar="2"]');
    var btnReintentar = document.querySelector('[data-reintentar="2"]');
    var stageCard = document.getElementById('etapa-2');

    var puntos = 0;
    var faltantes = 0;
    var respuestas = {};

    DATOS_CASO.etapa2.elementos.forEach(function (elem) {
      var sel = document.getElementById('etapa2-filo-' + elem.id);
      var val = sel ? sel.value : '';
      respuestas[elem.id] = val;
      if (!val) faltantes++;
    });

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Asigna el componente de filosofía a los 3 enunciados.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa2.elementos.forEach(function (elem) {
      var sel = document.getElementById('etapa2-filo-' + elem.id);
      var val = respuestas[elem.id];
      if (val === elem.correcta) {
        puntos++;
        if (sel) { sel.classList.add('is-correct'); sel.classList.remove('is-wrong'); }
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + elem.retro + '</div></li>';
      } else {
        if (sel) { sel.classList.add('is-wrong'); sel.classList.remove('is-correct'); }
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + elem.retro + '</div></li>';
      }
    });
    listHtml += '</ul>';

    var claseAlerta = puntos === 3 ? 'a-feedback--correct' : (puntos >= 2 ? 'a-feedback--warning' : 'a-feedback--wrong');
    fb.innerHTML = '<div class="a-feedback ' + claseAlerta + '"><p><strong>Puntuación: ' + puntos + ' / 3</strong></p>' + listHtml + '</div>';

    estado.etapa2 = { completada: true, puntos: puntos, respuestas: respuestas };
    guardarEstado();
    actualizarAvance();

    if (stageCard) stageCard.classList.add('is-done');
    if (btnComprobar) btnComprobar.hidden = true;
    if (btnReintentar) btnReintentar.hidden = false;
  }

  function reintentarEtapa2() {
    estado.etapa2 = null;
    guardarEstado();
    renderizarEtapa2();
    document.getElementById('feedback-etapa-2').innerHTML = '';
    var stageCard = document.getElementById('etapa-2');
    if (stageCard) stageCard.classList.remove('is-done');
    document.querySelector('[data-comprobar="2"]').hidden = false;
    document.querySelector('[data-reintentar="2"]').hidden = true;
    actualizarAvance();
  }

  // --- ETAPA 3 ---
  function renderizarEtapa3() {
    var cont = document.getElementById('contenedor-etapa-3');
    if (!cont) return;

    var html = '<div class="ci-match">';
    DATOS_CASO.etapa3.objetivos.forEach(function (obj, idx) {
      var valPrevio = (estado.etapa3 && estado.etapa3.respuestas) ? estado.etapa3.respuestas[obj.id] : '';
      html += '<div class="ci-match__row">';
      html += '<div class="ci-match__problem"><span class="ci-num">' + (idx + 1) + '</span> <span>' + obj.texto + '</span></div>';
      html += '<select id="etapa3-bsc-' + obj.id + '" aria-label="Perspectiva BSC para objetivo ' + (idx + 1) + '">';
      html += '<option value="">-- Selecciona la perspectiva del BSC --</option>';
      html += '<option value="financiera"' + (valPrevio === 'financiera' ? ' selected' : '') + '>1. Perspectiva Financiera</option>';
      html += '<option value="clientes"' + (valPrevio === 'clientes' ? ' selected' : '') + '>2. Perspectiva de Clientes</option>';
      html += '<option value="procesos"' + (valPrevio === 'procesos' ? ' selected' : '') + '>3. Perspectiva de Procesos Internos</option>';
      html += '<option value="aprendizaje"' + (valPrevio === 'aprendizaje' ? ' selected' : '') + '>4. Perspectiva de Aprendizaje y Crecimiento</option>';
      html += '</select>';
      html += '</div>';
    });
    html += '</div>';
    cont.innerHTML = html;

    if (estado.etapa3 && estado.etapa3.completada) {
      validarEtapa3(true);
    }
  }

  function validarEtapa3(silencioso) {
    var cont = document.getElementById('contenedor-etapa-3');
    var fb = document.getElementById('feedback-etapa-3');
    var btnComprobar = document.querySelector('[data-comprobar="3"]');
    var btnReintentar = document.querySelector('[data-reintentar="3"]');
    var stageCard = document.getElementById('etapa-3');

    var puntos = 0;
    var faltantes = 0;
    var respuestas = {};

    DATOS_CASO.etapa3.objetivos.forEach(function (obj) {
      var sel = document.getElementById('etapa3-bsc-' + obj.id);
      var val = sel ? sel.value : '';
      respuestas[obj.id] = val;
      if (!val) faltantes++;
    });

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Asigna la perspectiva del Balanced Scorecard a los 4 objetivos.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa3.objetivos.forEach(function (obj) {
      var sel = document.getElementById('etapa3-bsc-' + obj.id);
      var val = respuestas[obj.id];
      if (val === obj.correcta) {
        puntos++;
        if (sel) { sel.classList.add('is-correct'); sel.classList.remove('is-wrong'); }
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + obj.retro + '</div></li>';
      } else {
        if (sel) { sel.classList.add('is-wrong'); sel.classList.remove('is-correct'); }
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + obj.retro + '</div></li>';
      }
    });
    listHtml += '</ul>';

    var claseAlerta = puntos === 4 ? 'a-feedback--correct' : (puntos >= 2 ? 'a-feedback--warning' : 'a-feedback--wrong');
    fb.innerHTML = '<div class="a-feedback ' + claseAlerta + '"><p><strong>Puntuación: ' + puntos + ' / 4</strong></p>' + listHtml + '</div>';

    estado.etapa3 = { completada: true, puntos: puntos, respuestas: respuestas };
    guardarEstado();
    actualizarAvance();

    if (stageCard) stageCard.classList.add('is-done');
    if (btnComprobar) btnComprobar.hidden = true;
    if (btnReintentar) btnReintentar.hidden = false;
  }

  function reintentarEtapa3() {
    estado.etapa3 = null;
    guardarEstado();
    renderizarEtapa3();
    document.getElementById('feedback-etapa-3').innerHTML = '';
    var stageCard = document.getElementById('etapa-3');
    if (stageCard) stageCard.classList.remove('is-done');
    document.querySelector('[data-comprobar="3"]').hidden = false;
    document.querySelector('[data-reintentar="3"]').hidden = true;
    actualizarAvance();
  }

  function mostrarResumenFinal(total) {
    var seccResumen = document.getElementById('seccion-resumen-final');
    if (!seccResumen) return;

    seccResumen.hidden = false;
    var pct = Math.round((total / 11) * 100);
    var mensaje = '';
    if (pct >= 85) {
      mensaje = '¡Excelente visión estratégica! Has diseñado con solidez el diagnóstico FODA, formulado una filosofía de innovación tecnológica y estructurado un Cuadro de Mando Integral equilibrado.';
    } else if (pct >= 60) {
      mensaje = 'Buen trabajo de planeación estratégica. Conviene reforzar la diferenciación entre las 4 perspectivas del Balanced Scorecard para asegurar un despliegue operativo impecable.';
    } else {
      mensaje = 'Actividad completada. Te recomendamos repasar los temas de competitividad, filosofía corporativa y Cuadro de Mando Integral de la Unidad II.';
    }

    var html = '<div class="a-card" style="border: 2px solid var(--accent); background: linear-gradient(180deg, var(--u-inset), var(--surface));">';
    html += '<h2 class="a-card__title"><i class="fas fa-award" aria-hidden="true"></i> Dictamen Estratégico: DataSecure México</h2>';
    html += '<p style="font-size:1.1rem; margin-bottom:12px;">Calificación global: <strong>' + total + ' / 11 puntos (' + pct + ' %)</strong></p>';
    html += '<ul class="ci-summary">';
    html += '<li><span>Etapa 1 (FODA y estrategia):</span> <strong>' + (estado.etapa1 ? estado.etapa1.puntos : 0) + ' / 5</strong></li>';
    html += '<li><span>Etapa 2 (Filosofía corporativa):</span> <strong>' + (estado.etapa2 ? estado.etapa2.puntos : 0) + ' / 3</strong></li>';
    html += '<li><span>Etapa 3 (Cuadro de Mando Integral):</span> <strong>' + (estado.etapa3 ? estado.etapa3.puntos : 0) + ' / 4</strong></li>';
    html += '</ul>';
    html += '<p style="color:var(--text-soft); line-height:1.6;">' + mensaje + '</p>';
    html += '<div style="margin-top:20px; display:flex; flex-wrap:wrap; gap:12px;">';
    html += '<a class="u-btn u-btn--primary" href="../../unidad-03/index.html">Ir a la Unidad III <i class="fas fa-arrow-right" aria-hidden="true"></i></a>';
    html += '<a class="u-btn a-btn--ghost" href="../../../unidades.html"><i class="fas fa-book-open" aria-hidden="true"></i> Catálogo de unidades</a>';
    html += '</div>';
    html += '</div>';

    seccResumen.innerHTML = html;
  }

  function vincularEventos() {
    var b1 = document.querySelector('[data-comprobar="1"]');
    if (b1) b1.addEventListener('click', function () { validarEtapa1(false); });
    var r1 = document.querySelector('[data-reintentar="1"]');
    if (r1) r1.addEventListener('click', reintentarEtapa1);

    var b2 = document.querySelector('[data-comprobar="2"]');
    if (b2) b2.addEventListener('click', function () { validarEtapa2(false); });
    var r2 = document.querySelector('[data-reintentar="2"]');
    if (r2) r2.addEventListener('click', reintentarEtapa2);

    var b3 = document.querySelector('[data-comprobar="3"]');
    if (b3) b3.addEventListener('click', function () { validarEtapa3(false); });
    var r3 = document.querySelector('[data-reintentar="3"]');
    if (r3) r3.addEventListener('click', reintentarEtapa3);
  }

  document.addEventListener('DOMContentLoaded', inicializar);
})();
