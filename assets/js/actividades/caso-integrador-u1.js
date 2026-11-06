/**
 * CASO INTEGRADOR · UNIDAD I (unidades/unidad-01/actividades/actividad-final.html)
 * Tema: Aspectos básicos de la gestión empresarial
 * Caso: Novatech Solutions (Constitución legal, proceso administrativo y dilemas administrar vs gestionar)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'caso-integrador-u1';

  var DATOS_CASO = {
    etapa1: {
      titulo: 'Constitución Legal y Elección de Sociedad Mercantil',
      preguntas: [
        {
          id: 'sociedad',
          planteamiento: '1. Los 3 socios aportan capitales distintos y buscan limitar su responsabilidad patrimonial al capital aportado sin arriesgar sus bienes personales ante terceros. ¿Qué forma societaria es la más idónea bajo la LGSM?',
          opciones: [
            { id: 'sa', texto: 'Sociedad Anónima de Capital Variable (S.A. de C.V.)', correcta: true, retro: '¡Correcto! En la S.A., la responsabilidad de los socios se limita al pago de sus acciones y el capital se divide en títulos negociables, protegiendo su patrimonio personal.' },
            { id: 'snc', texto: 'Sociedad en Nombre Colectivo', correcta: false, retro: 'Incorrecto. En este tipo de sociedad, todos los socios responden de manera subsidiaria, ilimitada y solidaria de las obligaciones sociales, arriesgando su patrimonio personal.' },
            { id: 'pf', texto: 'Mantenerse como personas físicas con actividad empresarial individuales', correcta: false, retro: 'Incorrecto. No crea una entidad jurídica independiente ni separa el patrimonio personal del negocio, además de dificultar contratos corporativos conjuntos.' }
          ]
        },
        {
          id: 'tramite_se',
          planteamiento: '2. ¿Cuál es el primer trámite legal indispensable ante el Gobierno Federal para reservar el nombre de la empresa?',
          opciones: [
            { id: 'mua', texto: 'Solicitud de autorización de uso de denominación o razón social ante la Secretaría de Economía (portal MUA)', correcta: true, retro: '¡Correcto! La Secretaría de Economía es la autoridad facultada para verificar y autorizar que no exista otra sociedad con un nombre idéntico o confusamente similar.' },
            { id: 'sat', texto: 'Inscripción directa en el RFC ante el SAT', correcta: false, retro: 'Incorrecto. El SAT requiere como requisito previo la escritura constitutiva debidamente formalizada con la denominación autorizada.' },
            { id: 'imss', texto: 'Alta patronal ante el Instituto Mexicano del Seguro Social', correcta: false, retro: 'Incorrecto. El alta patronal ocurre después de constituida la persona moral y cuando se contratan trabajadores.' }
          ]
        },
        {
          id: 'formalizacion',
          planteamiento: '3. Una vez autorizada la denominación y redactados los estatutos sociales, ¿ante qué instancia se debe protocolizar el acta constitutiva para otorgarle fe pública y validez frente a terceros?',
          opciones: [
            { id: 'fedatario', texto: 'Ante fedatario público (Notario o Corredor Público) e inscripción posterior en el Registro Público de Comercio (RPC)', correcta: true, retro: '¡Correcto! El fedatario formaliza la escritura o póliza constitutiva y la inscripción en el RPC le otorga personalidad jurídica plena frente a terceros.' },
            { id: 'profeco', texto: 'Ante la Procuraduría Federal del Consumidor (PROFECO)', correcta: false, retro: 'Incorrecto. PROFECO defiende derechos del consumidor, no formaliza sociedades mercantiles.' },
            { id: 'sep', texto: 'Ante la Secretaría de Educación Pública (SEP)', correcta: false, retro: 'Incorrecto. La SEP es una entidad educativa y no interviene en la constitución de personas morales mercantiles.' }
          ]
        },
        {
          id: 'tributario',
          planteamiento: '4. ¿Qué trámite posterior a la protocolización es estrictamente obligatorio para poder emitir Comprobantes Fiscales Digitales (CFDI) a su cliente corporativo?',
          opciones: [
            { id: 'rfc_efirma', texto: 'Tramitación del RFC de la persona moral y certificado de e.firma ante el Servicio de Administración Tributaria (SAT)', correcta: true, retro: '¡Correcto! El RFC y la e.firma de la sociedad son indispensables para habilitar el buzón tributario y timbrar facturas electrónicas válidas (CFDI).' },
            { id: 'patente', texto: 'Registro obligatorio de patente ante el Instituto Mexicano de la Propiedad Industrial (IMPI)', correcta: false, retro: 'Incorrecto. El registro de patentes o marcas es un derecho optativo de propiedad industrial, no una obligación para facturar fiscalmente.' }
          ]
        }
      ]
    },
    etapa2: {
      titulo: 'Proceso Administrativo: 4 Fases',
      problemas: [
        {
          id: 'p1',
          texto: 'Fijar como meta anual captar 20 clientes corporativos, estimar los ingresos requeridos y definir el presupuesto anual de servidores en la nube.',
          correcta: 'planeacion',
          retro: 'Corresponde a Planeación: fija objetivos, metas, estrategias y asigna presupuestos antes de ejecutar la acción.'
        },
        {
          id: 'p2',
          texto: 'Diseñar el organigrama, dividir las tareas en departamentos (Desarrollo, Soporte, Ventas) y especificar las responsabilidades de cada puesto.',
          correcta: 'organizacion',
          retro: 'Corresponde a Organización: estructura y divide el trabajo, agrupa funciones y asigna recursos y líneas de autoridad.'
        },
        {
          id: 'p3',
          texto: 'Motivar a los ingenieros de software, liderar las reuniones de sincronización diaria y mantener canales de comunicación abiertos y transparentes.',
          correcta: 'direccion',
          retro: 'Corresponde a Dirección: guía, lidera, motiva y orienta los esfuerzos del capital humano hacia los objetivos organizacionales.'
        },
        {
          id: 'p4',
          texto: 'Revisar semanalmente el cumplimiento de sprints de desarrollo mediante KPIs de entregas y aplicar medidas correctivas si se observan desviaciones.',
          correcta: 'control',
          retro: 'Corresponde a Control: mide y evalúa el desempeño real contra los estándares planificados para corregir desviaciones.'
        }
      ],
      opciones: [
        { valor: 'planeacion', texto: '1. Planeación (Objetivos, metas y presupuestos)' },
        { valor: 'organizacion', texto: '2. Organización (Estructura, funciones y recursos)' },
        { valor: 'direccion', texto: '3. Dirección (Liderazgo, motivación y comunicación)' },
        { valor: 'control', texto: '4. Control (Métricas, evaluación y corrección)' }
      ]
    },
    etapa3: {
      titulo: 'Dilemas Gerenciales: Administrar vs. Gestionar',
      casos: [
        {
          id: 'd1',
          texto: 'Supervisar el registro de asistencia diaria de los colaboradores y programar el pago puntual de la nómina quincenal conforme a la ley.',
          correcta: 'administrar',
          retro: 'Administrar: Enfoque operativo orientado al orden interno, seguimiento de normas y optimización rutinaria de los recursos.'
        },
        {
          id: 'd2',
          texto: 'Detectar un nicho desatendido en el sector de farmacias comunitarias y reorientar el desarrollo del software para crear una funcionalidad especializada antes que la competencia.',
          correcta: 'gestionar',
          retro: 'Gestionar: Enfoque estratégico, innovador y proactivo enfocado en visualizar oportunidades externas y asumir riesgos calculados.'
        },
        {
          id: 'd3',
          texto: 'Actualizar los inventarios de equipos de cómputo y verificar que las licencias de software cumplan el presupuesto asignado en el manual interno.',
          correcta: 'administrar',
          retro: 'Administrar: Ejecución disciplinada de procedimientos establecidos y salvaguarda de recursos existentes.'
        },
        {
          id: 'd4',
          texto: 'Negociar una alianza de co-branding con una incubadora de negocios de prestigio para acelerar la expansión comercial en tres nuevos estados.',
          correcta: 'gestionar',
          retro: 'Gestionar: Liderazgo hacia el entorno exterior, articulación de redes de valor y toma de decisiones para el crecimiento estratégico.'
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
    cargarEstadoGuardado();
    renderizarEtapa1();
    renderizarEtapa2();
    renderizarEtapa3();
    actualizarAvance();
    vincularEventos();
  }

  function cargarEstadoGuardado() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var guardado = JSON.parse(raw);
        if (guardado && typeof guardado === 'object') {
          estado = guardado;
        }
      }
    } catch (e) {
      console.warn('No se pudo leer localStorage:', e);
    }
  }

  function guardarEstado() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
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
      resEl.querySelector('strong').textContent = totalPts + ' / 12 pts (Completado)';
      mostrarResumenFinal(totalPts);
    }
  }

  // --- ETAPA 1 ---
  function renderizarEtapa1() {
    var cont = document.getElementById('contenedor-etapa-1');
    if (!cont) return;

    var html = '<div class="ci-decisions">';
    DATOS_CASO.etapa1.preguntas.forEach(function (p, pIdx) {
      html += '<fieldset class="ci-decision" data-pregunta="' + p.id + '">';
      html += '<legend><span class="ci-num">' + (pIdx + 1) + '</span> ' + p.planteamiento + '</legend>';
      html += '<div class="ci-decision__options" style="display:flex; flex-direction:column; gap:8px;">';
      p.opciones.forEach(function (op) {
        html += '<label class="ci-check" style="display:flex; align-items:flex-start; gap:10px; cursor:pointer;">';
        html += '<input type="radio" name="' + p.id + '" value="' + op.id + '">';
        html += '<span>' + op.texto + '</span>';
        html += '</label>';
      });
      html += '</div>';
      html += '</fieldset>';
    });
    html += '</div>';
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

    var respuestas = {};
    var faltantes = 0;
    DATOS_CASO.etapa1.preguntas.forEach(function (p) {
      var sel = cont.querySelector('input[name="' + p.id + '"]:checked');
      if (sel) {
        respuestas[p.id] = sel.value;
      } else {
        faltantes++;
      }
    });

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Por favor responde las 4 preguntas antes de comprobar.</p></div>';
      return;
    }

    var puntos = 0;
    var listHtml = '<ul class="ci-feedback__list">';

    DATOS_CASO.etapa1.preguntas.forEach(function (p) {
      var elegida = respuestas[p.id];
      var optObj = p.opciones.find(function (o) { return o.id === elegida; });
      var fs = cont.querySelector('fieldset[data-pregunta="' + p.id + '"]');

      if (optObj && optObj.correcta) {
        puntos++;
        if (fs) fs.style.borderColor = 'var(--success)';
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div><strong>Pregunta:</strong> ' + optObj.retro + '</div></li>';
      } else {
        if (fs) fs.style.borderColor = 'var(--danger)';
        var msg = optObj ? optObj.retro : 'Sin respuesta.';
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div><strong>Pregunta:</strong> ' + msg + '</div></li>';
      }
    });
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
    DATOS_CASO.etapa2.problemas.forEach(function (prob, idx) {
      html += '<div class="ci-match__row" data-problema="' + prob.id + '">';
      html += '<div class="ci-match__problem"><span class="ci-num">' + (idx + 1) + '</span> <span>' + prob.texto + '</span></div>';
      html += '<select id="etapa2-sel-' + prob.id + '" aria-label="Fase del proceso administrativo para acción ' + (idx + 1) + '">';
      html += '<option value="">-- Selecciona la fase del proceso administrativo --</option>';
      DATOS_CASO.etapa2.opciones.forEach(function (op) {
        html += '<option value="' + op.valor + '">' + op.texto + '</option>';
      });
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
    var respuestas = {};
    var faltantes = 0;

    DATOS_CASO.etapa2.problemas.forEach(function (prob) {
      var sel = document.getElementById('etapa2-sel-' + prob.id);
      var val = sel ? sel.value : '';
      respuestas[prob.id] = val;
      if (!val) faltantes++;
    });

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Asigna la fase administrativa a cada una de las 4 acciones.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa2.problemas.forEach(function (prob) {
      var sel = document.getElementById('etapa2-sel-' + prob.id);
      var val = respuestas[prob.id];
      if (val === prob.correcta) {
        puntos++;
        if (sel) { sel.classList.add('is-correct'); sel.classList.remove('is-wrong'); }
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + prob.retro + '</div></li>';
      } else {
        if (sel) { sel.classList.add('is-wrong'); sel.classList.remove('is-correct'); }
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + prob.retro + '</div></li>';
      }
    });
    listHtml += '</ul>';

    var claseAlerta = puntos === 4 ? 'a-feedback--correct' : (puntos >= 2 ? 'a-feedback--warning' : 'a-feedback--wrong');
    fb.innerHTML = '<div class="a-feedback ' + claseAlerta + '"><p><strong>Puntuación: ' + puntos + ' / 4</strong></p>' + listHtml + '</div>';

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
    DATOS_CASO.etapa3.casos.forEach(function (c, idx) {
      html += '<fieldset class="ci-decision" data-dilema="' + c.id + '">';
      html += '<legend><span class="ci-num">' + (idx + 1) + '</span> ' + c.texto + '</legend>';
      html += '<div class="ci-decision__options">';
      html += '<label class="ci-check"><input type="radio" name="' + c.id + '" value="administrar"> <span><i class="fas fa-clipboard-check"></i> Administrar (rutina / eficiencia interna)</span></label>';
      html += '<label class="ci-check"><input type="radio" name="' + c.id + '" value="gestionar"> <span><i class="fas fa-lightbulb"></i> Gestionar (estrategia / cambio / oportunidad)</span></label>';
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
    var respuestas = {};
    var faltantes = 0;

    DATOS_CASO.etapa3.casos.forEach(function (c) {
      var sel = cont.querySelector('input[name="' + c.id + '"]:checked');
      if (sel) {
        respuestas[c.id] = sel.value;
      } else {
        faltantes++;
      }
    });

    if (faltantes > 0 && !silencioso) {
      fb.innerHTML = '<div class="a-feedback a-feedback--warning"><p><i class="fas fa-exclamation-triangle"></i> Diagnostica las 4 situaciones indicando si corresponden a Administrar o Gestionar.</p></div>';
      return;
    }

    var listHtml = '<ul class="ci-feedback__list">';
    DATOS_CASO.etapa3.casos.forEach(function (c) {
      var val = respuestas[c.id];
      var fs = cont.querySelector('fieldset[data-dilema="' + c.id + '"]');
      if (val === c.correcta) {
        puntos++;
        if (fs) fs.style.borderColor = 'var(--success)';
        listHtml += '<li class="is-correct"><i class="fas fa-check-circle"></i> <div>' + c.retro + '</div></li>';
      } else {
        if (fs) fs.style.borderColor = 'var(--danger)';
        listHtml += '<li class="is-wrong"><i class="fas fa-times-circle"></i> <div>' + c.retro + '</div></li>';
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
    var pct = Math.round((total / 12) * 100);
    var mensaje = '';
    if (pct >= 85) {
      mensaje = '¡Excelente desempeño gerencial! Has demostrado dominio riguroso de la constitución legal, las 4 fases del proceso administrativo y la distinción analítica entre administrar y gestionar en empresas tecnológicas.';
    } else if (pct >= 60) {
      mensaje = 'Buen trabajo. Lograste estructurar legal y funcionalmente a Novatech Solutions, aunque convendría repasar algunos detalles específicos del marco societario o del proceso administrativo.';
    } else {
      mensaje = 'Actividad completada. Te sugerimos revisar los temas 1.1 a 1.4 de la Unidad I y reintentar las etapas para consolidar tus competencias gerenciales.';
    }

    var html = '<div class="a-card" style="border: 2px solid var(--accent); background: linear-gradient(180deg, var(--u-inset), var(--surface));">';
    html += '<h2 class="a-card__title"><i class="fas fa-award" aria-hidden="true"></i> Dictamen Final del Caso: Novatech Solutions</h2>';
    html += '<p style="font-size:1.1rem; margin-bottom:12px;">Calificación global: <strong>' + total + ' / 12 puntos (' + pct + ' %)</strong></p>';
    html += '<ul class="ci-summary">';
    html += '<li><span>Etapa 1 (Constitución legal):</span> <strong>' + (estado.etapa1 ? estado.etapa1.puntos : 0) + ' / 4</strong></li>';
    html += '<li><span>Etapa 2 (Proceso administrativo):</span> <strong>' + (estado.etapa2 ? estado.etapa2.puntos : 0) + ' / 4</strong></li>';
    html += '<li><span>Etapa 3 (Administrar vs Gestionar):</span> <strong>' + (estado.etapa3 ? estado.etapa3.puntos : 0) + ' / 4</strong></li>';
    html += '</ul>';
    html += '<p style="color:var(--text-soft); line-height:1.6;">' + mensaje + '</p>';
    html += '<div style="margin-top:20px; display:flex; flex-wrap:wrap; gap:12px;">';
    html += '<a class="u-btn u-btn--primary" href="../../unidad-02/index.html">Ir a la Unidad II <i class="fas fa-arrow-right" aria-hidden="true"></i></a>';
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
