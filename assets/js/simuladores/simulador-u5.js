/**
 * SIMULADOR LOGÍSTICO Y LABORATORIO DE CASOS - UNIDAD 5
 * Empresa: "Innovación Textil ESIT" (Transformación Digital, RFID vs Código de Barras y Red Omnicanal)
 * Escuela Superior de Ingeniería Textil (ESIT - IPN)
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'esit_logistica_u5_sim';

  // Stepper
  const stepBtns = document.querySelectorAll('.sim-step-btn');
  const panels = document.querySelectorAll('.sim-panel');

  function activarEtapa(etapaIndex) {
    stepBtns.forEach((btn, idx) => btn.classList.toggle('is-active', idx === etapaIndex));
    panels.forEach((p, idx) => p.classList.toggle('is-active', idx === etapaIndex));
  }

  stepBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.step, 10) - 1;
      activarEtapa(idx);
    });
  });

  document.querySelectorAll('[data-next-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextIdx = parseInt(btn.dataset.nextStep, 10) - 1;
      if (nextIdx < stepBtns.length) {
        activarEtapa(nextIdx);
        window.scrollTo({ top: document.querySelector('.sim-container').offsetTop - 90, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // ETAPA 1: ARQUITECTURA DE SISTEMAS INTEGRADOS
  // ==========================================
  const formSistemas = document.getElementById('form-u5-sistemas');
  const feedbackSistemas = document.getElementById('feedback-u5-sistemas');

  if (formSistemas) {
    formSistemas.addEventListener('submit', (e) => {
      e.preventDefault();
      const s1 = document.getElementById('u5-rol-1').value; // Reserva stock en CEDIS -> WMS
      const s2 = document.getElementById('u5-rol-2').value; // Facturación y contabilidad -> ERP
      const s3 = document.getElementById('u5-rol-3').value; // Selección de paquetería y ruteo -> TMS
      const s4 = document.getElementById('u5-rol-4').value; // Explosión de insumos de confección -> MRP

      let correctas = 0;
      if (s1 === 'wms') correctas++;
      if (s2 === 'erp') correctas++;
      if (s3 === 'tms') correctas++;
      if (s4 === 'mrp') correctas++;

      feedbackSistemas.style.display = 'block';

      if (correctas === 4) {
        feedbackSistemas.className = 'sim-feedback-inline is-correct';
        feedbackSistemas.innerHTML = `
          <i class="fas fa-network-wired fa-2x"></i>
          <div>
            <strong>¡Arquitectura Tecnológica Perfectamente Mapeada! (4/4 Correctas)</strong><br>
            • <strong>WMS:</strong> Controla el inventario físico en tiempo real, ubicaciones de pasillo/rack y listas de picking.<br>
            • <strong>ERP:</strong> Centraliza la contabilidad, cuentas por cobrar y sincroniza los balances financieros.<br>
            • <strong>TMS:</strong> Optimiza las tarifas de transporte, consolida carga y monitorea guías de última milla.<br>
            • <strong>MRP:</strong> Calcula los requerimientos netos de rollos de tela y avíos para la fábrica.
          </div>
        `;
        document.getElementById('step-btn-1').classList.add('is-completed');
      } else {
        feedbackSistemas.className = 'sim-feedback-inline is-wrong';
        feedbackSistemas.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>Revisa la delimitación de funciones de los sistemas: (${correctas}/4 correctas)</strong><br>
            Recuerda: el WMS se especializa en la gestión física dentro del almacén; el TMS en fletes y paqueterías de transporte; el ERP en la gestión financiera/corporativa y el MRP en planear materiales de confección.
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 2: CALCULADORA DE ROI: RFID VS CÓDIGO DE BARRAS
  // ==========================================
  const sliderPrendas = document.getElementById('u5-slider-prendas');
  const sliderInversion = document.getElementById('u5-slider-inv');
  const lblPrendas = document.getElementById('u5-val-prendas');
  const lblInversion = document.getElementById('u5-val-inv');

  const kpiAhorroHoras = document.getElementById('u5-kpi-ahorro-horas');
  const kpiBeneficioNeto = document.getElementById('u5-kpi-beneficio-neto');
  const kpiPayback = document.getElementById('u5-kpi-payback');

  function calcularRoiRfid() {
    if (!sliderPrendas || !sliderInversion) return;

    const prendasMes = parseInt(sliderPrendas.value, 10);
    const inversionTotal = parseInt(sliderInversion.value, 10);

    lblPrendas.textContent = `${prendasMes.toLocaleString('es-MX')} prendas/mes`;
    lblInversion.textContent = `$${inversionTotal.toLocaleString('es-MX')} MXN`;

    // Parámetros técnicos:
    // Con Código de barras: 1 operario lee 250 prendas/hora.
    // Horas de conteo manual = prendasMes / 250
    const horasBarra = prendasMes / 250;
    // Con RFID masivo: pórtico lee 15,000 prendas/hora.
    const horasRfid = prendasMes / 15000;
    const horasAhorradasMes = Math.round(horasBarra - horasRfid);

    // Costo hora-hombre promedio en almacén = $65 MXN (incluyendo cargas sociales)
    const ahorroManoObraMes = horasAhorradasMes * 65;

    // Ahorro por reducción de errores de despacho y devoluciones (3.5% error en barra vs 0.2% en RFID)
    // Costo promedio de procesar una devolución por prenda errónea = $90 MXN
    const prendasSalvadas = prendasMes * (0.035 - 0.002);
    const ahorroDevolucionesMes = Math.round(prendasSalvadas * 90);

    // Sobrecosto de consumibles: tag RFID cuesta $1.10 MXN vs etiqueta papel $0.15 MXN (Diferencia = $0.95 MXN/prenda)
    const sobrecostoTagsMes = prendasMes * 0.95;

    // Beneficio Neto Mensual:
    const beneficioNetoMes = Math.round((ahorroManoObraMes + ahorroDevolucionesMes) - sobrecostoTagsMes);

    // Período de Recuperación (Payback Period en meses)
    let mesesPayback = (beneficioNetoMes > 0) ? (inversionTotal / beneficioNetoMes).toFixed(1) : 'Inviable';

    kpiAhorroHoras.textContent = `${horasAhorradasMes.toLocaleString('es-MX')} hrs/mes`;
    kpiBeneficioNeto.textContent = `$${beneficioNetoMes.toLocaleString('es-MX')} MXN/mes`;
    kpiPayback.textContent = `${mesesPayback} meses`;

    if (beneficioNetoMes > 0 && parseFloat(mesesPayback) <= 18) {
      document.getElementById('step-btn-2').classList.add('is-completed');
    }

    actualizarPuntajeGlobal();
  }

  [sliderPrendas, sliderInversion].forEach(ctrl => {
    if (ctrl) ctrl.addEventListener('input', calcularRoiRfid);
  });

  // ==========================================
  // ETAPA 3: SIMULADOR DE RED OMNICANAL
  // ==========================================
  const selRedOmnicanal = document.getElementById('u5-sel-red');
  const btnEvalRed = document.getElementById('btn-eval-red');
  const feedbackRed = document.getElementById('feedback-u5-red');

  if (btnEvalRed) {
    btnEvalRed.addEventListener('click', () => {
      const red = selRedOmnicanal.value;
      feedbackRed.style.display = 'block';

      if (red === 'hibrida_ship') {
        feedbackRed.className = 'sim-feedback-inline is-correct';
        feedbackRed.innerHTML = `
          <i class="fas fa-store-slash fa-2x"></i>
          <div>
            <strong>¡Estrategia Omnicanal de Máximo Rendimiento! (Red Híbrida Ship-from-Store + CEDIS Central)</strong><br>
            • <strong>Tiempo de Entrega: Menos de 24 horas</strong> en ciudades con tiendas físicas aprovechando el inventario de piso.<br>
            • <strong>Reducción del Costo de Última Milla:</strong> Hasta 40% menor al despachar desde la tienda más cercana al cliente en lugar de cruzar el país desde planta.<br>
            • <strong>Optimización de Inventario:</strong> Disminuye las rebajas de fin de temporada liquidando prendas desde las tiendas mediante pedidos web.
          </div>
        `;
        document.getElementById('step-btn-3').classList.add('is-completed');
      } else if (red === 'centralizada') {
        feedbackRed.className = 'sim-feedback-inline is-wrong';
        feedbackRed.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>Red Centralizada desde Fábrica: Lenta e Ineficiente para E-commerce</strong><br>
            Aunque el costo de almacenamiento es bajo, los envíos a clientes foráneos tardan de 4 a 6 días hábiles con fletes costosos, provocando un 38% de abandono de carritos en el sitio web de la marca deportiva.
          </div>
        `;
      } else {
        feedbackRed.className = 'sim-feedback-inline is-wrong';
        feedbackRed.innerHTML = `
          <i class="fas fa-info-circle fa-2x"></i>
          <div>
            <strong>3 CEDIS Regionales Tradicionales: Costo de Capital Elevado</strong><br>
            Requiere triplicar el stock de seguridad en cada centro de distribución, elevando considerablemente los costos financieros de almacenamiento para una empresa mediana sin alcanzar la inmediatez de la red de tiendas.
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 4: DICTAMEN TÉCNICO Y EVALUACIÓN
  // ==========================================
  const decisionCards = document.querySelectorAll('.sim-decision-card');
  decisionCards.forEach(card => {
    card.addEventListener('click', () => {
      decisionCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      actualizarPuntajeGlobal();
    });
  });

  const btnGuardarDictamen = document.getElementById('btn-guardar-dictamen-u5');
  if (btnGuardarDictamen) {
    btnGuardarDictamen.addEventListener('click', () => {
      const textoDictamen = document.getElementById('u5-dictamen-texto').value;
      const dataToSave = {
        fecha: new Date().toISOString(),
        unidad: 'unidad-05',
        caso: 'Innovación Textil ESIT',
        dictamen: textoDictamen,
        puntaje: document.getElementById('u5-score-circle').textContent
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      alert('¡Dictamen técnico de Industria 4.0 y modernización digital guardado exitosamente!');
      document.getElementById('step-btn-4').classList.add('is-completed');
    });
  }

  const btnImprimir = document.getElementById('btn-imprimir-u5');
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      window.print();
    });
  }

  function actualizarPuntajeGlobal() {
    let puntos = 0;
    if (document.getElementById('step-btn-1').classList.contains('is-completed')) puntos += 25;
    if (document.getElementById('step-btn-2').classList.contains('is-completed')) puntos += 25;
    if (document.getElementById('step-btn-3').classList.contains('is-completed')) puntos += 25;

    const selectedStrat = document.querySelector('input[name="u5-strat"]:checked');
    if (selectedStrat && selectedStrat.value === 'opt_rfid_omnicanal') {
      puntos += 25;
    } else if (selectedStrat) {
      puntos += 10;
    }

    const circle = document.getElementById('u5-score-circle');
    if (circle) circle.textContent = `${puntos}`;

    const scoreTitle = document.getElementById('u5-score-title');
    if (scoreTitle) {
      if (puntos >= 90) scoreTitle.textContent = 'Dictamen Sobresaliente de Transformación Digital';
      else if (puntos >= 70) scoreTitle.textContent = 'Dictamen Aprobado con Observaciones';
      else scoreTitle.textContent = 'Dictamen en Desarrollo';
    }
  }

  calcularRoiRfid();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const obj = JSON.parse(saved);
      const txt = document.getElementById('u5-dictamen-texto');
      if (txt && obj.dictamen) txt.value = obj.dictamen;
    }
  } catch (err) {
    console.warn(err);
  }
});
