/**
 * CASO INTEGRADOR · UNIDAD III (unidades/unidad-03/actividades/actividad-final.html)
 * Tema: Gestión operativa de la empresa
 * Caso: LogiExpress (Estructura Organizacional, Manejo del Cambio y Reingeniería BPR)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'caso-integrador-u3';

  var DATOS_CASO = {
    etapa1: {
      titulo: 'Diagnóstico de Estructura Organizacional y Principios',
      fallas: [
        {
          id: 'f1',
          texto: 'Los choferes y despachadores reciben órdenes simultáneas y contradictorias del Director Comercial (atender pedidos urgentes) y del Director de Operaciones (respetar la carga máxima de los vehículos).',
          correcta: 'unidad_mando',
          retro: 'Violación del principio de Unidad de Mando: Cada subordinado debe ser responsable y recibir instrucciones de un único jefe directo para evitar confusión y conflicto de lealtades.'
        },
        {
          id: 'f2',
          texto: 'Una solicitud para reemplazar una llanta averiada en ruta requiere 6 firmas jerárquicas sucesivas, tardando hasta 5 horas en resolverse mientras la unidad queda inmovilizada.',
          correcta: 'jerarquizacion',
          retro: 'Exceso de niveles jerárquicos y tramo de control ineficiente: La estructura vertical excesiva frena la agilidad de respuesta y burocratiza la operación cotidiana.'
        },
        {
          id: 'f3',
          texto: 'El área de Mantenimiento y el área de Tráfico compran suministros y refacciones por duplicado a proveedores distintos sin ningún canal de cruce de información.',
          correcta: 'coordinacion',
          retro: 'Falta de Coordinación y Departamentalización armónica: Las unidades de la empresa operan como silos aislados sin integración funcional ni sincronización de esfuerzos.'
        }
      ],
      rediseno: {
        id: 'estructura_optima',
        pregunta: '¿Qué propuesta de rediseño estructural resuelve de raíz los problemas de mando y agilidad en LogiExpress?',
        opciones: [
          { id: 'matricial_agil', texto: 'Aplanar la jerarquía reduciendo niveles, definir un único responsable por zona operativa y establecer comités de coordinación interdepartamental con facultades de decisión ágiles.', correcta: true, retro: '¡Correcto! Descentraliza decisiones no estratégicas, restaura la unidad de mando local y derriba las barreras entre áreas funcionales.' },
          { id: 'mas_niveles', texto: 'Crear 3 nuevas gerencias intermedias de vigilancia para supervisar que los choferes obedezcan a ambos directores.', correcta: false, retro: 'Incorrecto. Añadir niveles jerárquicos agrava la burocracia, encarece la nómina y no resuelve la contradicción de órdenes.' },
          { id: 'eliminar_jefes', texto: 'Despedir a todos los jefes de departamento y permitir que cada conductor elija libremente sus horarios y rutas sin reporte alguno.', correcta: false, retro: 'Incorrecto. El desgobierno anárquico destruye la planeación operativa, el control de costos y la rendición de cuentas.' }
        ]
      }
    },
    etapa2: {
      titulo: 'Manejo del Cambio Organizacional (Modelo de Kurt Lewin)',
      acciones: [
        {
          id: 'a1',
          texto: 'Reunir a los supervisores y conductores en mesas de diálogo para explicar transparentemente por qué el método tradicional genera pérdidas, garantizar que nadie será despedido y mostrar cómo el software reducirá su jornada de tráfico.',
          correcta: 'descongelar',
          retro: 'Fase 1: Descongelamiento (Unfreezing) — Consiste en sensibilizar al personal, desarmar resistencias psicológicas y crear motivación y sentido de urgencia por el cambio.'
        },
        {
          id: 'a2',
          texto: 'Impartir sesiones prácticas de capacitación con dispositivos móviles en rutas piloto seleccionadas, asignando a los conductores más hábiles como facilitadores ("campeones del cambio") y dando soporte en vivo.',
          correcta: 'cambiar',
          retro: 'Fase 2: Movimiento o Cambio (Changing) — Proceso de aprendizaje activo donde se adoptan las nuevas tecnologías, conductas y métodos de trabajo.'
        },
        {
          id: 'a3',
          texto: 'Instituir una bonificación mensual por optimización de combustible lograda con el sistema, actualizar los manuales formales de procedimientos e incorporar las nuevas prácticas a la cultura de la empresa.',
          correcta: 'recongelar',
          retro: 'Fase 3: Recongelamiento (Refreezing) — Estabilización e institucionalización del cambio para que las nuevas rutinas se conviertan en la norma cotidiana permanente.'
        }
      ]
    },
    etapa3: {
      titulo: 'Reingeniería de Procesos de Negocio (BPR) y Optimización Tecnológica',
      decisiones: [
        {
          id: 'd1',
          texto: 'Eliminar el llenado manual de 3 bitácoras en papel que realizaban los choferes y sustituirlo por escaneo digital instantáneo con código QR en la aplicación móvil.',
          correcta: 'procede',
          retro: 'Procede: Elimina actividades burocráticas sin valor añadido, reduce errores humanos y acelera el tiempo de ciclo del proceso de entrega.'
        },
        {
          id: 'd2',
          texto: 'Mantener la revisión física obligatoria en papel de cada factura en caseta de salida además del escaneo digital, para que el guardia selle manualmente cada hoja.',
          correcta: 'no_procede',
          retro: 'No procede: Representa una redundancia innecesaria que perpetúa cuellos de botella y contradice el objetivo de la reingeniería de procesos.'
        },
        {
          id: 'd3',
          texto: 'Integrar mediante API el portal de pedidos del cliente con el algoritmo de ruteo inteligente, despachando la ruta óptima directamente al teléfono del chofer en tiempo real.',
          correcta: 'procede',
          retro: 'Procede: Optimización tecnológica clave que automatiza el flujo de valor de punta a punta sin intervención manual intermedia.'
        },
        {
          id: 'd4',
          texto: 'Empoderar al personal de reparto para tomar decisiones inmediatas de reintento de entrega o desvío por contingencia vial sin tener que esperar autorización previa del corporativo.',
          correcta: 'procede',
          retro: 'Procede: Principio fundamental de reingeniería (empowerment): situar la toma de decisiones donde el trabajo realmente se ejecuta para garantizar satisfacción del cliente.'
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
    DATOS_CASO.etapa1.fallas.forEach(function (f, idx) {
      var valPrevio = (estado.etapa1 && estado.etapa1.respuestas && estado.etapa1.respuestas.fallas) ? estado.etapa1.respuestas.fallas[f.id] : '';
      html += '<div class="ci-match__row">';
      html += '<div class="ci-match__problem"><span class="ci-num">' + (idx + 1) + '</span> <span>' + f.texto + '</span></div>';
      html += '<select id="etapa1-falla-' + f.id + '" aria-label="Principio organizacional afectado ' + (idx + 1) + '">';
      html += '<option value="">-- ¿Qué principio o deficiencia organizacional representa? --</option>';
      html += '<option value="unidad_mando"' + (valPrevio === 'unidad_mando' ? ' selected' : '') + '>1. Violación del principio de Unidad de Mando</option>';
      html += '<option value="jerarquizacion"' + (valPrevio === 'jerarquizacion' ? ' selected' : '') + '>2. Exceso de niveles jerárquicos y tramo de control ineficiente</option>';
      html += '<option value="coordinacion"' + (valPrevio === 'coordinacion' ? ' selected' : '') + '>3. Deficiencia de coordinación y departamentalización</option>';
      html += '</select>';
      html += '</div>';
    });
    html += '</div>';

    // Pregunta de rediseño
    var red = DATOS_CASO.etapa1.rediseno;
    var redPrevio = (estado.etapa1 && estado.etapa1.respuestas) ? estado.etapa1.respuestas.rediseno : '';
    html += '<fieldset class="ci-decision" style="margin-top:16px;">';
    html += '<legend><span class="ci-num">4</span> ' + red.pregunta + '</legend>';
    html += '<div class="ci-decision__options" style="display:flex; flex-direction:column; gap:8px;">';
    red.opciones.forEach(function (op) {
      var chk = (redPrevio === op.id) ? ' checked' : '';
      html += '<label class="ci-check"><input type="radio" name="etapa1_rediseno" value="' + op.id + '"' + chk + '> <span>' + op.texto + '</span></label>';
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
    var respuestas = { fallas: {}, rediseno: '' };

    DATOS_CASO.etapa1.fallas.forEach(function (f) {
      var sel = document.getElementById('etapa1-falla-' + f.id);
      var val = sel ? sel.value : '';
      respuestas.fallas[f.id] = val;
      if (!val) faltantes++;
    });

    var radioRed = cont.querySelector('input[name="etapa1_rediseno"]:checked');
    if (radioRed) {
      respuestas.rediseno = radioRed.value;
    } else {
      faltantes++;
    }

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Diagnostica los 3 problemas organizacionales y selecciona la propuesta de rediseño.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa1.fallas.forEach(function (f) {
      var sel = document.getElementById('etapa1-falla-' + f.id);
      var val = respuestas.fallas[f.id];
      if (val === f.correcta) {
        puntos++;
        if (sel) { sel.classList.add('is-correct'); sel.classList.remove('is-wrong'); }
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + f.retro + '</div></li>';
      } else {
        if (sel) { sel.classList.add('is-wrong'); sel.classList.remove('is-correct'); }
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + f.retro + '</div></li>';
      }
    });

    var optRed = DATOS_CASO.etapa1.rediseno.opciones.find(function (o) { return o.id === respuestas.rediseno; });
    if (optRed && optRed.correcta) {
      puntos++;
      listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div><strong>Rediseño estructural:</strong> ' + optRed.retro + '</div></li>';
    } else {
      var msg = optRed ? optRed.retro : 'Sin respuesta.';
      listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div><strong>Rediseño estructural:</strong> ' + msg + '</div></li>';
    }
    listHtml += '</ul>';

    var claseAlerta = puntos === 4 ? 'a-feedback--correct' : (puntos >= 2 ? 'a-feedback--warning' : 'a-feedback--wrong');
    fb.innerHTML = '<div class="a-feedback ' + claseAlerta + '"><p><strong>Puntuación: ' + puntos + ' / 4</strong></p>' + listHtml + '</div>';

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
    DATOS_CASO.etapa2.acciones.forEach(function (act, idx) {
      var valPrevio = (estado.etapa2 && estado.etapa2.respuestas) ? estado.etapa2.respuestas[act.id] : '';
      html += '<div class="ci-match__row">';
      html += '<div class="ci-match__problem"><span class="ci-num">' + (idx + 1) + '</span> <span>' + act.texto + '</span></div>';
      html += '<select id="etapa2-lewin-' + act.id + '" aria-label="Fase de Kurt Lewin para acción ' + (idx + 1) + '">';
      html += '<option value="">-- Selecciona la fase del modelo de Kurt Lewin --</option>';
      html += '<option value="descongelar"' + (valPrevio === 'descongelar' ? ' selected' : '') + '>Fase 1: Descongelamiento (Sensibilización y reducción de resistencia)</option>';
      html += '<option value="cambiar"' + (valPrevio === 'cambiar' ? ' selected' : '') + '>Fase 2: Movimiento o Cambio (Adopción de nuevas prácticas y tecnología)</option>';
      html += '<option value="recongelar"' + (valPrevio === 'recongelar' ? ' selected' : '') + '>Fase 3: Recongelamiento (Consolidación e institucionalización del nuevo estándar)</option>';
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

    DATOS_CASO.etapa2.acciones.forEach(function (act) {
      var sel = document.getElementById('etapa2-lewin-' + act.id);
      var val = sel ? sel.value : '';
      respuestas[act.id] = val;
      if (!val) faltantes++;
    });

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Asigna la fase de Kurt Lewin a las 3 acciones.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa2.acciones.forEach(function (act) {
      var sel = document.getElementById('etapa2-lewin-' + act.id);
      var val = respuestas[act.id];
      if (val === act.correcta) {
        puntos++;
        if (sel) { sel.classList.add('is-correct'); sel.classList.remove('is-wrong'); }
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + act.retro + '</div></li>';
      } else {
        if (sel) { sel.classList.add('is-wrong'); sel.classList.remove('is-correct'); }
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + act.retro + '</div></li>';
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

    var html = '<div class="ci-decisions">';
    DATOS_CASO.etapa3.decisiones.forEach(function (d, idx) {
      var valPrevio = (estado.etapa3 && estado.etapa3.respuestas) ? estado.etapa3.respuestas[d.id] : '';
      var chkProc = (valPrevio === 'procede') ? ' checked' : '';
      var chkNoProc = (valPrevio === 'no_procede') ? ' checked' : '';
      html += '<fieldset class="ci-decision" data-decision="' + d.id + '">';
      html += '<legend><span class="ci-num">' + (idx + 1) + '</span> ' + d.texto + '</legend>';
      html += '<div class="ci-decision__options">';
      html += '<label class="ci-check"><input type="radio" name="' + d.id + '" value="procede"' + chkProc + '> <span><i class="fas fa-check"></i> Procede (Alineado a Reingeniería BPR)</span></label>';
      html += '<label class="ci-check"><input type="radio" name="' + d.id + '" value="no_procede"' + chkNoProc + '> <span><i class="fas fa-xmark"></i> No procede (Redundancia / Burocracia)</span></label>';
      html += '</div>';
      html += '</fieldset>';
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

    DATOS_CASO.etapa3.decisiones.forEach(function (d) {
      var sel = cont.querySelector('input[name="' + d.id + '"]:checked');
      if (sel) {
        respuestas[d.id] = sel.value;
      } else {
        faltantes++;
      }
    });

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Dictamina las 4 decisiones operativas indicando si proceden o no proceden.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa3.decisiones.forEach(function (d) {
      var val = respuestas[d.id];
      var fs = cont.querySelector('fieldset[data-decision="' + d.id + '"]');
      if (val === d.correcta) {
        puntos++;
        if (fs) fs.style.borderColor = 'var(--success)';
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + d.retro + '</div></li>';
      } else {
        if (fs) fs.style.borderColor = 'var(--danger)';
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + d.retro + '</div></li>';
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
      mensaje = '¡Excelente gestión operativa! Lograste resolver la estructura organizacional, implementar el cambio con apego al factor humano y reestructurar los procesos operativos con tecnología de vanguardia.';
    } else if (pct >= 60) {
      mensaje = 'Buen desempeño gerencial. Conviene revisar los principios de organización y las etapas de reingeniería para optimizar al máximo las operaciones.';
    } else {
      mensaje = 'Actividad completada. Te recomendamos repasar los temas 3.1 a 3.4 de la Unidad III sobre estructura organizacional, manejo del cambio y reingeniería de procesos.';
    }

    var html = '<div class="a-card" style="border: 2px solid var(--accent); background: linear-gradient(180deg, var(--u-inset), var(--surface));">';
    html += '<h2 class="a-card__title"><i class="fas fa-award" aria-hidden="true"></i> Dictamen de Operaciones: LogiExpress</h2>';
    html += '<p style="font-size:1.1rem; margin-bottom:12px;">Calificación global: <strong>' + total + ' / 11 puntos (' + pct + ' %)</strong></p>';
    html += '<ul class="ci-summary">';
    html += '<li><span>Etapa 1 (Estructura y principios):</span> <strong>' + (estado.etapa1 ? estado.etapa1.puntos : 0) + ' / 4</strong></li>';
    html += '<li><span>Etapa 2 (Manejo del cambio):</span> <strong>' + (estado.etapa2 ? estado.etapa2.puntos : 0) + ' / 3</strong></li>';
    html += '<li><span>Etapa 3 (Reingeniería BPR):</span> <strong>' + (estado.etapa3 ? estado.etapa3.puntos : 0) + ' / 4</strong></li>';
    html += '</ul>';
    html += '<p style="color:var(--text-soft); line-height:1.6;">' + mensaje + '</p>';
    html += '<div style="margin-top:20px; display:flex; flex-wrap:wrap; gap:12px;">';
    html += '<a class="u-btn u-btn--primary" href="../../unidad-04/index.html">Ir a la Unidad IV <i class="fas fa-arrow-right" aria-hidden="true"></i></a>';
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
