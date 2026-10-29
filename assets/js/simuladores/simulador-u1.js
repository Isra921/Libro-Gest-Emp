/**
 * SIMULADOR LOGÍSTICO Y LABORATORIO DE CASOS - UNIDAD 1
 * Empresa: "Textiles del Centro"
 * Escuela Superior de Ingeniería Textil (ESIT - IPN)
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'esit_logistica_u1_sim';

  // Control de Etapas / Stepper
  const stepBtns = document.querySelectorAll('.sim-step-btn');
  const panels = document.querySelectorAll('.sim-panel');

  function activarEtapa(etapaIndex) {
    stepBtns.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === etapaIndex);
    });
    panels.forEach((p, idx) => {
      p.classList.toggle('is-active', idx === etapaIndex);
    });
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
  // ETAPA 1: DIAGNÓSTICO CAUSAL DE INCIDENTES
  // ==========================================
  const formE1 = document.getElementById('form-u1-e1');
  const feedbackE1 = document.getElementById('feedback-u1-e1');
  const scoreBadgeE1 = document.getElementById('score-u1-e1');

  if (formE1) {
    formE1.addEventListener('submit', (e) => {
      e.preventDefault();
      const p1 = document.getElementById('u1-inc-1').value;
      const p2 = document.getElementById('u1-inc-2').value;
      const p3 = document.getElementById('u1-inc-3').value;
      const p4 = document.getElementById('u1-inc-4').value;
      const p5 = document.getElementById('u1-inc-5').value;

      let correctas = 0;
      if (p1 === 'sc_supply') correctas++;
      if (p2 === 'log_interna') correctas++;
      if (p3 === 'log_interna') correctas++;
      if (p4 === 'log_distrib') correctas++;
      if (p5 === 'sc_cliente') correctas++;

      const pct = Math.round((correctas / 5) * 100);
      feedbackE1.style.display = 'block';
      if (pct >= 80) {
        feedbackE1.className = 'sim-feedback-inline is-correct';
        feedbackE1.innerHTML = `
          <i class="fas fa-circle-check fa-lg"></i>
          <div>
            <strong>¡Excelente diagnóstico causal! (${correctas}/5 correctas - ${pct}%)</strong><br>
            Has diferenciado con precisión las fallas de logística interna (manejo de almacén y preparación de pedidos) de las disrupciones de cadena de suministro integral (acuerdos con proveedores de algodón y relaciones B2B con tiendas departamentales).
          </div>
        `;
        document.getElementById('step-btn-1').classList.add('is-completed');
      } else {
        feedbackE1.className = 'sim-feedback-inline is-wrong';
        feedbackE1.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-lg"></i>
          <div>
            <strong>Diagnóstico preliminar incompleto (${correctas}/5 correctas - ${pct}%)</strong><br>
            Recuerda: la <em>Logística Interna</em> abarca el flujo dentro de las instalaciones (WIP en pasillos, errores de surtido en empaque); la <em>Cadena de Suministro</em> integra los eslabones externos (proveedores de fibra y clientes departamentales). Revisa tus elecciones e intenta nuevamente.
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 2: SIMULADOR DE TRADE-OFF LOGÍSTICO
  // ==========================================
  const sliderService = document.getElementById('u1-slider-service');
  const sliderStock = document.getElementById('u1-slider-stock');
  const selectFreight = document.getElementById('u1-select-freight');
  const selectPicking = document.getElementById('u1-select-picking');

  const valService = document.getElementById('u1-val-service');
  const valStock = document.getElementById('u1-val-stock');

  // KPI elements
  const kpiTotal = document.getElementById('u1-kpi-total');
  const kpiOtif = document.getElementById('u1-kpi-otif');
  const kpiPenalties = document.getElementById('u1-kpi-penalties');
  const kpiInvCost = document.getElementById('u1-kpi-inv');
  const kpiTransCost = document.getElementById('u1-kpi-trans');

  // Meter segments
  const segInv = document.getElementById('u1-seg-inv');
  const segTrans = document.getElementById('u1-seg-trans');
  const segPen = document.getElementById('u1-seg-pen');

  // Status badge
  const statusBadge = document.getElementById('u1-sim-status');

  let activeStressScenario = 'normal';

  function calcularTradeOff() {
    if (!sliderService || !sliderStock) return;

    const targetService = parseFloat(sliderService.value);
    const stockDays = parseFloat(sliderStock.value);
    const freightType = selectFreight.value;
    const pickingType = selectPicking.value;

    valService.textContent = `${targetService}%`;
    valStock.textContent = `${stockDays} días`;

    // Base mensual: 10,000 prendas producidas
    const BASE_UNITS = 10000;
    const UNIT_VALUE = 180; // $180 MXN por playera

    // 1. Costo de Mantenimiento de Inventario:
    // A más días de stock de seguridad, mayor inventario promedio
    // Costo de posesión aprox 2% mensual del valor
    let invHoldingCost = Math.round((BASE_UNITS * (stockDays / 30) * UNIT_VALUE) * 0.022);

    // 2. Costo de Transporte:
    let freightCostPerUnit = (freightType === 'standard') ? 12 : (freightType === 'hybrid') ? 22 : 38;
    let transportCost = BASE_UNITS * freightCostPerUnit;

    // 3. Eficiencia de Picking y Preparación:
    let pickingErrorRate = (pickingType === 'manual') ? 0.09 : (pickingType === 'barcode') ? 0.015 : 0.003;
    let pickingCost = (pickingType === 'manual') ? 15000 : (pickingType === 'barcode') ? 24000 : 38000;

    // 4. Vulnerabilidad y penalizaciones según stock vs nivel de servicio deseado
    // Si queremos 98% pero solo tenemos 5 días de stock, se generan roturas!
    let minDaysRequired = (targetService - 75) * 0.7; // Ej: 95% -> (20)*0.7 = 14 días
    let stockGap = Math.max(0, minDaysRequired - stockDays);

    let stressFactor = 1.0;
    if (activeStressScenario === 'demand_spike') stressFactor = 1.6;
    if (activeStressScenario === 'port_delay') stressFactor = 1.4;

    let stockoutOrders = Math.round(BASE_UNITS * (stockGap * 0.018 * stressFactor));
    let pickingErrors = Math.round(BASE_UNITS * pickingErrorRate);
    let failedOrders = stockoutOrders + pickingErrors;

    // OTIF Real resultante:
    let realOtif = Math.max(50, Math.min(99.4, 100 - ((failedOrders / BASE_UNITS) * 100)));

    // Penalizaciones económicas ($120 por cada prenda devuelta/tardía + pérdida de margen)
    let penaltyCost = Math.round(failedOrders * 135);

    // Costo Logístico Total
    let totalLogisticsCost = invHoldingCost + transportCost + pickingCost + penaltyCost;

    // Actualizar UI
    kpiTotal.textContent = `$${totalLogisticsCost.toLocaleString('es-MX')} MXN`;
    kpiOtif.textContent = `${realOtif.toFixed(1)}%`;
    kpiPenalties.textContent = `$${penaltyCost.toLocaleString('es-MX')}`;
    kpiInvCost.textContent = `$${invHoldingCost.toLocaleString('es-MX')}`;
    kpiTransCost.textContent = `$${(transportCost + pickingCost).toLocaleString('es-MX')}`;

    // Meter bar widths
    let pInv = Math.max(5, (invHoldingCost / totalLogisticsCost) * 100);
    let pTrans = Math.max(5, ((transportCost + pickingCost) / totalLogisticsCost) * 100);
    let pPen = Math.max(0, (penaltyCost / totalLogisticsCost) * 100);

    segInv.style.width = `${pInv}%`;
    segTrans.style.width = `${pTrans}%`;
    segPen.style.width = `${pPen}%`;

    // Diagnóstico de Equilibrio Óptimo
    if (realOtif >= 93 && totalLogisticsCost <= 295000 && penaltyCost <= 40000) {
      statusBadge.className = 'sim-badge sim-badge--success';
      statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Configuración Óptima Encontrada';
      document.getElementById('step-btn-2').classList.add('is-completed');
    } else if (penaltyCost > 90000) {
      statusBadge.className = 'sim-badge sim-badge--danger';
      statusBadge.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Crisis de Penalizaciones (OTIF Bajo)';
    } else if (totalLogisticsCost > 380000) {
      statusBadge.className = 'sim-badge sim-badge--warning';
      statusBadge.innerHTML = '<i class="fas fa-money-bill-wave"></i> Sobrecosto por Fletes Excesivos';
    } else {
      statusBadge.className = 'sim-badge sim-badge--info';
      statusBadge.innerHTML = '<i class="fas fa-sliders"></i> Ajustando Equilibrio Logístico';
    }

    actualizarPuntajeGlobal();
  }

  [sliderService, sliderStock, selectFreight, selectPicking].forEach(ctrl => {
    if (ctrl) ctrl.addEventListener('input', calcularTradeOff);
  });

  // Botones de Escenario de Estrés
  document.querySelectorAll('.sim-scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sim-scenario-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeStressScenario = btn.dataset.scenario;
      calcularTradeOff();
    });
  });

  // ==========================================
  // ETAPA 3: LABORATORIO DE CÁLCULO DE KPIS
  // ==========================================
  // Datos reales del dataset de la tabla:
  // 10 pedidos.
  // Pedidos a tiempo y completos (OTIF): Pedidos 101, 102, 104, 106, 107, 108, 110 (7 de 10 = 70.0%)
  // Prendas pedidas: 500+300+800+400+1200+600+750+900+350+1000 = 6800 prendas
  // Prendas entregadas completas: 500+300+720+400+1050+600+750+900+310+1000 = 6530 prendas (6530/6800 = 96.02%)
  // Lead time promedio prometido vs real: Promedio real = (3+2+5+4+6+3+2+4+5+3) / 10 = 3.7 días

  const btnCheckKpis = document.getElementById('btn-check-kpis');
  const feedbackKpis = document.getElementById('feedback-u1-kpis');

  if (btnCheckKpis) {
    btnCheckKpis.addEventListener('click', () => {
      const inputOtif = parseFloat(document.getElementById('u1-calc-otif').value);
      const inputFill = parseFloat(document.getElementById('u1-calc-fill').value);
      const inputLead = parseFloat(document.getElementById('u1-calc-lead').value);

      const otifOk = Math.abs(inputOtif - 70.0) <= 1.0;
      const fillOk = Math.abs(inputFill - 96.0) <= 1.0;
      const leadOk = Math.abs(inputLead - 3.7) <= 0.2;

      feedbackKpis.style.display = 'block';

      if (otifOk && fillOk && leadOk) {
        feedbackKpis.className = 'sim-feedback-inline is-correct';
        feedbackKpis.innerHTML = `
          <i class="fas fa-check-circle fa-2x"></i>
          <div>
            <strong>¡Cálculos de KPIs 100% Exactos!</strong><br>
            • <strong>OTIF: 70.0%</strong> (7 de 10 pedidos cumplieron fecha y cantidad íntegra simultáneamente).<br>
            • <strong>Fill Rate: 96.0%</strong> (6,530 prendas entregadas de 6,800 pedidas). Demuestra que aunque el volumen entregado fue alto, la experiencia del cliente falló en el 30% de las órdenes.<br>
            • <strong>Lead Time Promedio: 3.7 días</strong> frente al objetivo contractual de 3.0 días.
          </div>
        `;
        document.getElementById('step-btn-3').classList.add('is-completed');
      } else {
        feedbackKpis.className = 'sim-feedback-inline is-wrong';
        feedbackKpis.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>Discrepancia en la auditoría de indicadores:</strong><br>
            ${!otifOk ? '• <em>OTIF:</em> Recuerda que una orden solo cuenta si la entrega fue "A tiempo" = Sí Y "Completa" = Sí (cuenta cuántas de las 10 filas cumplen ambos criterios).<br>' : '• <em>OTIF:</em> Correcto.<br>'}
            ${!fillOk ? '• <em>Fill Rate:</em> Suma la columna de piezas entregadas y divídela entre la suma de piezas pedidas × 100.<br>' : '• <em>Fill Rate:</em> Correcto.<br>'}
            ${!leadOk ? '• <em>Lead Time:</em> Suma los días de ciclo real de los 10 pedidos y divide entre 10.<br>' : '• <em>Lead Time:</em> Correcto.<br>'}
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

  const btnGuardarDictamen = document.getElementById('btn-guardar-dictamen-u1');
  if (btnGuardarDictamen) {
    btnGuardarDictamen.addEventListener('click', () => {
      const textoDictamen = document.getElementById('u1-dictamen-texto').value;
      const dataToSave = {
        fecha: new Date().toISOString(),
        unidad: 'unidad-01',
        caso: 'Textiles del Centro',
        dictamen: textoDictamen,
        puntaje: document.getElementById('u1-score-circle').textContent
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      alert('¡Dictamen técnico y resultados de simulación guardados exitosamente en tu navegador!');
      document.getElementById('step-btn-4').classList.add('is-completed');
    });
  }

  const btnImprimir = document.getElementById('btn-imprimir-u1');
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // PUNTAJE GLOBAL DINÁMICO
  // ==========================================
  function actualizarPuntajeGlobal() {
    let puntos = 0;

    // Etapa 1: hasta 25 pts
    if (document.getElementById('step-btn-1').classList.contains('is-completed')) {
      puntos += 25;
    } else if (feedbackE1 && feedbackE1.classList.contains('is-correct')) {
      puntos += 25;
    }

    // Etapa 2: hasta 25 pts
    if (document.getElementById('step-btn-2').classList.contains('is-completed')) {
      puntos += 25;
    } else {
      puntos += 15; // avance parcial
    }

    // Etapa 3: hasta 25 pts
    if (document.getElementById('step-btn-3').classList.contains('is-completed')) {
      puntos += 25;
    }

    // Etapa 4: hasta 25 pts
    const selectedStrat = document.querySelector('input[name="u1-strat"]:checked');
    if (selectedStrat && selectedStrat.value === 'opt_sla_gs1') {
      puntos += 25;
    } else if (selectedStrat) {
      puntos += 10;
    }

    const circle = document.getElementById('u1-score-circle');
    if (circle) circle.textContent = `${puntos}`;

    const scoreTitle = document.getElementById('u1-score-title');
    if (scoreTitle) {
      if (puntos >= 90) scoreTitle.textContent = 'Dictamen Sobresaliente (Acreditado)';
      else if (puntos >= 70) scoreTitle.textContent = 'Dictamen Aprobado con Observaciones';
      else scoreTitle.textContent = 'Dictamen en Desarrollo (Requiere ajustes)';
    }
  }

  // Inicializar cálculo en carga
  calcularTradeOff();

  // Restaurar si existe en localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const obj = JSON.parse(saved);
      const txt = document.getElementById('u1-dictamen-texto');
      if (txt && obj.dictamen) txt.value = obj.dictamen;
    }
  } catch (err) {
    console.warn('No se pudo cargar almacenamiento previo:', err);
  }
});
