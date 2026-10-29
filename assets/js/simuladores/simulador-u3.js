/**
 * SIMULADOR LOGÍSTICO Y LABORATORIO DE CASOS - UNIDAD 3
 * Empresa: "Confecciones ESIT" (Compras, Selección de Proveedores y Matriz Multicriterio)
 * Escuela Superior de Ingeniería Textil (ESIT - IPN)
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'esit_logistica_u3_sim';

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
  // ETAPA 1: BOM Y REQUERIMIENTOS NETOS
  // ==========================================
  const btnCheckBom = document.getElementById('btn-check-bom');
  const feedbackBom = document.getElementById('feedback-u3-bom');

  if (btnCheckBom) {
    btnCheckBom.addEventListener('click', () => {
      const inputTela = parseFloat(document.getElementById('u3-calc-tela').value);
      const inputCintas = parseFloat(document.getElementById('u3-calc-cintas').value);
      const inputCierres = parseFloat(document.getElementById('u3-calc-cierres').value);

      // 12,000 prendas x 2.50 m x 1.04 (4% merma) = 31,200 m brutos - 4,200 m disponible = 27,000 m
      const telaOk = Math.abs(inputTela - 27000) <= 100;
      // 12,000 x 3.0 m = 36,000 m brutos - 6,000 m disponible = 30,000 m
      const cintasOk = Math.abs(inputCintas - 30000) <= 100;
      // 12,000 x 1 cierre = 12,000 brutos - 2,500 en stock = 9,500 cierres
      const cierresOk = Math.abs(inputCierres - 9500) <= 20;

      feedbackBom.style.display = 'block';

      if (telaOk && cintasOk && cierresOk) {
        feedbackBom.className = 'sim-feedback-inline is-correct';
        feedbackBom.innerHTML = `
          <i class="fas fa-check-circle fa-2x"></i>
          <div>
            <strong>¡Explosión de Materiales (MRP) 100% Precisa!</strong><br>
            • <strong>Mezclilla 14 oz: 27,000 metros</strong> netos a ordenar (considerando 31,200 m brutos con merma del 4% y descontando 4,200 m en stock).<br>
            • <strong>Cinta reflejante 3M: 30,000 metros</strong> netos a ordenar (36,000 m necesarios - 6,000 m en stock).<br>
            • <strong>Cierres reforzados 65 cm: 9,500 piezas</strong> netas a ordenar (12,000 necesarios - 2,500 en bodega).<br>
            Se evita compras excesivas de inventario inmovilizado y se garantiza abasto sin paros en línea de confección.
          </div>
        `;
        document.getElementById('step-btn-1').classList.add('is-completed');
      } else {
        feedbackBom.className = 'sim-feedback-inline is-wrong';
        feedbackBom.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>Revisa tus balances de materiales:</strong><br>
            ${!telaOk ? '• <em>Tela:</em> Demanda bruta = 12,000 prendas × 2.50 m × 1.04 (merma) = 31,200 m. Resta el stock disponible (4,200 m) = 27,000 m.<br>' : '• <em>Tela:</em> Correcto (27,000 m).<br>'}
            ${!cintasOk ? '• <em>Cintas:</em> Demanda bruta = 12,000 × 3.0 m = 36,000 m. Resta stock disponible (6,000 m) = 30,000 m.<br>' : '• <em>Cintas:</em> Correcto (30,000 m).<br>'}
            ${!cierresOk ? '• <em>Cierres:</em> 12,000 piezas - 2,500 en almacén = 9,500 piezas.<br>' : '• <em>Cierres:</em> Correcto (9,500 piezas).<br>'}
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 2: MATRIZ MULTICRITERIO DE PROVEEDORES
  // ==========================================
  const wCalidad = document.getElementById('u3-w-calidad');
  const wLead = document.getElementById('u3-w-lead');
  const wPrecio = document.getElementById('u3-w-precio');
  const wFlex = document.getElementById('u3-w-flex');
  const wCert = document.getElementById('u3-w-cert');

  const lblWCalidad = document.getElementById('u3-val-calidad');
  const lblWLead = document.getElementById('u3-val-lead');
  const lblWPrecio = document.getElementById('u3-val-precio');
  const lblWFlex = document.getElementById('u3-val-flex');
  const lblWCert = document.getElementById('u3-val-cert');
  const lblWSuma = document.getElementById('u3-val-suma');

  // Calificaciones técnicas base (Escala 1 a 10)
  // Proveedor A (Textiles del Bajío - Nacional)
  const scoreA = { calidad: 8.5, lead: 7.5, precio: 8.0, flex: 8.0, cert: 8.0 };
  // Proveedor B (Denim Import Asia - Barato pero riesgoso)
  const scoreB = { calidad: 6.5, lead: 4.0, precio: 10.0, flex: 5.0, cert: 6.0 };
  // Proveedor C (Mezclillas del Norte - JIT Alta Calidad)
  const scoreC = { calidad: 9.8, lead: 10.0, precio: 6.5, flex: 9.5, cert: 10.0 };

  const totalA = document.getElementById('u3-score-prov-a');
  const totalB = document.getElementById('u3-score-prov-b');
  const totalC = document.getElementById('u3-score-prov-c');
  const winnerBadge = document.getElementById('u3-winner-badge');

  function calcularMatrizMulticriterio() {
    if (!wCalidad || !wLead) return;

    const pCalidad = parseFloat(wCalidad.value);
    const pLead = parseFloat(wLead.value);
    const pPrecio = parseFloat(wPrecio.value);
    const pFlex = parseFloat(wFlex.value);
    const pCert = parseFloat(wCert.value);

    lblWCalidad.textContent = `${pCalidad}%`;
    lblWLead.textContent = `${pLead}%`;
    lblWPrecio.textContent = `${pPrecio}%`;
    lblWFlex.textContent = `${pFlex}%`;
    lblWCert.textContent = `${pCert}%`;

    const suma = pCalidad + pLead + pPrecio + pFlex + pCert;
    lblWSuma.textContent = `${suma}%`;
    lblWSuma.style.color = (suma === 100) ? 'var(--primary)' : '#ef4444';

    // Normalizar a base 1.0
    const fC = pCalidad / 100;
    const fL = pLead / 100;
    const fP = pPrecio / 100;
    const fF = pFlex / 100;
    const fCe = pCert / 100;

    const pA = (scoreA.calidad * fC + scoreA.lead * fL + scoreA.precio * fP + scoreA.flex * fF + scoreA.cert * fCe).toFixed(2);
    const pB = (scoreB.calidad * fC + scoreB.lead * fL + scoreB.precio * fP + scoreB.flex * fF + scoreB.cert * fCe).toFixed(2);
    const pC = (scoreC.calidad * fC + scoreC.lead * fL + scoreC.precio * fP + scoreC.flex * fF + scoreC.cert * fCe).toFixed(2);

    totalA.textContent = pA;
    totalB.textContent = pB;
    totalC.textContent = pC;

    if (suma === 100) {
      if (parseFloat(pC) > parseFloat(pA) && parseFloat(pC) > parseFloat(pB)) {
        winnerBadge.className = 'sim-badge sim-badge--success';
        winnerBadge.innerHTML = '<i class="fas fa-trophy"></i> Proveedor Seleccionado: Proveedor C (Mezclillas del Norte - Calidad & JIT)';
        document.getElementById('step-btn-2').classList.add('is-completed');
      } else if (parseFloat(pB) >= parseFloat(pA) && parseFloat(pB) >= parseFloat(pC)) {
        winnerBadge.className = 'sim-badge sim-badge--danger';
        winnerBadge.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Alerta: El Proveedor B gana por precio pero tiene alto riesgo de rotura y defecto';
      } else {
        winnerBadge.className = 'sim-badge sim-badge--info';
        winnerBadge.innerHTML = '<i class="fas fa-check-circle"></i> Proveedor Seleccionado: Proveedor A (Nacional Equilibrado)';
        document.getElementById('step-btn-2').classList.add('is-completed');
      }
    } else {
      winnerBadge.className = 'sim-badge sim-badge--warning';
      winnerBadge.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Ajusta las ponderaciones para que sumen exactamente 100%';
    }

    actualizarPuntajeGlobal();
  }

  [wCalidad, wLead, wPrecio, wFlex, wCert].forEach(ctrl => {
    if (ctrl) ctrl.addEventListener('input', calcularMatrizMulticriterio);
  });

  // ==========================================
  // ETAPA 3: SIMULADOR DE NEGOCIACIÓN SLA
  // ==========================================
  const selAql = document.getElementById('u3-sel-aql');
  const selPenalizacion = document.getElementById('u3-sel-penalizacion');
  const selCredito = document.getElementById('u3-sel-credito');
  const btnEvalSla = document.getElementById('btn-eval-sla');
  const feedbackSla = document.getElementById('feedback-u3-sla');

  if (btnEvalSla) {
    btnEvalSla.addEventListener('click', () => {
      const aql = selAql.value;
      const pen = selPenalizacion.value;
      const cred = selCredito.value;

      feedbackSla.style.display = 'block';

      if (aql === '1.0' && pen === '1.5' && cred === '30') {
        feedbackSla.className = 'sim-feedback-inline is-correct';
        feedbackSla.innerHTML = `
          <i class="fas fa-handshake-angle fa-2x"></i>
          <div>
            <strong>¡Acuerdo de Nivel de Servicio (SLA) Balanceado y Exitoso!</strong><br>
            • <strong>AQL 1.0%:</strong> Blindaje técnico estricto adecuado para uniformes de seguridad industrial (Pemex/CFE).<br>
            • <strong>Penalización del 1.5% diario:</strong> Incentivo disuasorio suficiente para priorizar nuestros despachos sin que el proveedor rechace la firma del contrato.<br>
            • <strong>Crédito comercial a 30 días:</strong> Mantiene la liquidez de Confecciones ESIT mientras convalida el cobro de facturas con los clientes corporativos.
          </div>
        `;
        document.getElementById('step-btn-3').classList.add('is-completed');
      } else {
        feedbackSla.className = 'sim-feedback-inline is-wrong';
        feedbackSla.innerHTML = `
          <i class="fas fa-scale-unbalanced fa-2x"></i>
          <div>
            <strong>Condiciones de negociación desbalanceadas:</strong><br>
            ${aql !== '1.0' ? '• <em>AQL:</em> Para uniformes con requisitos normativos estrictos de resistencia, un AQL superior a 1.0% tolera demasiados defectos en hilatura o teñido.<br>' : ''}
            ${pen === '0' ? '• <em>Penalización:</em> Si no hay penalización por retraso (0%), el proveedor postergará tus órdenes cuando se sature su planta.<br>' : ''}
            ${pen === '3.0' ? '• <em>Penalización:</em> 3.0% diario es excesivo y los fabricantes textiles rechazarán la propuesta en mesa de negociación.<br>' : ''}
            ${cred === 'contado' ? '• <em>Pago:</em> El pago de contado descapitaliza a la empresa; busca condiciones estándar de 30 días de crédito.<br>' : ''}
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

  const btnGuardarDictamen = document.getElementById('btn-guardar-dictamen-u3');
  if (btnGuardarDictamen) {
    btnGuardarDictamen.addEventListener('click', () => {
      const textoDictamen = document.getElementById('u3-dictamen-texto').value;
      const dataToSave = {
        fecha: new Date().toISOString(),
        unidad: 'unidad-03',
        caso: 'Confecciones ESIT',
        dictamen: textoDictamen,
        puntaje: document.getElementById('u3-score-circle').textContent
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      alert('¡Dictamen técnico de compras y evaluación multicriterio guardados con éxito!');
      document.getElementById('step-btn-4').classList.add('is-completed');
    });
  }

  const btnImprimir = document.getElementById('btn-imprimir-u3');
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

    const selectedStrat = document.querySelector('input[name="u3-strat"]:checked');
    if (selectedStrat && selectedStrat.value === 'opt_dual_sourcing') {
      puntos += 25;
    } else if (selectedStrat) {
      puntos += 10;
    }

    const circle = document.getElementById('u3-score-circle');
    if (circle) circle.textContent = `${puntos}`;

    const scoreTitle = document.getElementById('u3-score-title');
    if (scoreTitle) {
      if (puntos >= 90) scoreTitle.textContent = 'Dictamen Sobresaliente de Abastecimiento';
      else if (puntos >= 70) scoreTitle.textContent = 'Dictamen Aprobado con Observaciones';
      else scoreTitle.textContent = 'Dictamen en Desarrollo';
    }
  }

  // Inicializar
  calcularMatrizMulticriterio();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const obj = JSON.parse(saved);
      const txt = document.getElementById('u3-dictamen-texto');
      if (txt && obj.dictamen) txt.value = obj.dictamen;
    }
  } catch (err) {
    console.warn(err);
  }
});
