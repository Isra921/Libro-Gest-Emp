/**
 * SIMULADOR LOGÍSTICO Y LABORATORIO DE CASOS - UNIDAD 2
 * Empresa: "Moda ESIT" (Almacenes, Inventarios, EOQ, Valuación y Cubicaje)
 * Escuela Superior de Ingeniería Textil (ESIT - IPN)
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'esit_logistica_u2_sim';

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
  // ETAPA 1: MODELO EOQ Y ANÁLISIS DE SENSIBILIDAD
  // ==========================================
  const inputEoq = document.getElementById('u2-calc-eoq');
  const inputRop = document.getElementById('u2-calc-rop');
  const inputOrders = document.getElementById('u2-calc-orders');
  const btnCheckEoq = document.getElementById('btn-check-eoq');
  const feedbackEoq = document.getElementById('feedback-u2-eoq');

  // Sliders de sensibilidad
  const sliderS = document.getElementById('u2-slider-s');
  const sliderH = document.getElementById('u2-slider-h');
  const valS = document.getElementById('u2-val-s');
  const valH = document.getElementById('u2-val-h');
  const kpiDynEoq = document.getElementById('u2-dyn-eoq');
  const kpiDynCost = document.getElementById('u2-dyn-cost');
  const kpiDynOrders = document.getElementById('u2-dyn-orders');

  function actualizarSensibilidadEoq() {
    if (!sliderS || !sliderH) return;
    const D = 48000; // Demanda anual
    const S = parseFloat(sliderS.value);
    const H = parseFloat(sliderH.value);

    valS.textContent = `$${S.toLocaleString('es-MX')} MXN`;
    valH.textContent = `$${H.toFixed(2)} MXN`;

    const eoqOpt = Math.round(Math.sqrt((2 * D * S) / H));
    const numOrd = (D / eoqOpt).toFixed(1);
    // Costo Total = (D/Q)*S + (Q/2)*H
    const orderCost = (D / eoqOpt) * S;
    const holdingCost = (eoqOpt / 2) * H;
    const totalCost = Math.round(orderCost + holdingCost);

    kpiDynEoq.textContent = `${eoqOpt.toLocaleString('es-MX')} kg`;
    kpiDynCost.textContent = `$${totalCost.toLocaleString('es-MX')} MXN`;
    kpiDynOrders.textContent = `${numOrd} órdenes/año`;
  }

  [sliderS, sliderH].forEach(ctrl => {
    if (ctrl) ctrl.addEventListener('input', actualizarSensibilidadEoq);
  });

  if (btnCheckEoq) {
    btnCheckEoq.addEventListener('click', () => {
      const eoqVal = parseFloat(inputEoq.value);
      const ropVal = parseFloat(inputRop.value);
      const ordersVal = parseFloat(inputOrders.value);

      // EOQ exacto: sqrt(2 * 48000 * 1200 / 4.50) = sqrt(25,600,000) = 5,059.64 -> aprox 5060 kg
      const eoqOk = Math.abs(eoqVal - 5060) <= 25;
      // ROP = d * L = (48000 / 300) * 5 = 160 * 5 = 800 kg
      const ropOk = Math.abs(ropVal - 800) <= 10;
      // Orders = 48000 / 5060 = 9.48 órdenes (aprox 9 a 10)
      const ordersOk = Math.abs(ordersVal - 9.5) <= 0.6;

      feedbackEoq.style.display = 'block';

      if (eoqOk && ropOk && ordersOk) {
        feedbackEoq.className = 'sim-feedback-inline is-correct';
        feedbackEoq.innerHTML = `
          <i class="fas fa-check-circle fa-2x"></i>
          <div>
            <strong>¡Cálculo del Lote Económico 100% Preciso!</strong><br>
            • <strong>EOQ Óptimo: 5,060 kg</strong> por pedido (equilibrio donde el costo de ordenar iguala al de mantener).<br>
            • <strong>Punto de Reorden (ROP): 800 kg</strong> (se debe emitir la nueva orden cuando el inventario caiga a este nivel para evitar quiebres durante los 5 días de lead time).<br>
            • <strong>Frecuencia: 9.5 órdenes al año</strong> (aproximadamente una orden cada 31 días hábiles).
          </div>
        `;
        document.getElementById('step-btn-1').classList.add('is-completed');
      } else {
        feedbackEoq.className = 'sim-feedback-inline is-wrong';
        feedbackEoq.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>Revisión técnica requerida:</strong><br>
            ${!eoqOk ? '• <em>EOQ:</em> Aplica la fórmula raíz( (2 × 48,000 × 1,200) / 4.50 ). El resultado es cercano a 5,060 kg.<br>' : '• <em>EOQ:</em> Correcto.<br>'}
            ${!ropOk ? '• <em>ROP:</em> Demanda diaria d = 48,000 / 300 días = 160 kg/día. ROP = 160 × 5 días.<br>' : '• <em>ROP:</em> Correcto.<br>'}
            ${!ordersOk ? '• <em>Órdenes/año:</em> Demanda anual / EOQ = 48,000 / 5,060 ≈ 9.5 órdenes.<br>' : '• <em>Órdenes/año:</em> Correcto.<br>'}
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 2: VALUACIÓN DE LOTES QUÍMICOS
  // ==========================================
  const selectMetodo = document.getElementById('u2-select-metodo');
  const btnEvalValuacion = document.getElementById('btn-eval-valuacion');
  const feedbackValuacion = document.getElementById('feedback-u2-valuacion');

  if (btnEvalValuacion) {
    btnEvalValuacion.addEventListener('click', () => {
      const metodo = selectMetodo.value;
      feedbackValuacion.style.display = 'block';

      if (metodo === 'peps') {
        feedbackValuacion.className = 'sim-feedback-inline is-correct';
        feedbackValuacion.innerHTML = `
          <i class="fas fa-shield-halved fa-2x"></i>
          <div>
            <strong>¡Excelente selección ingenieril! (Método PEPS / FIFO)</strong><br>
            Al consumir primero los 200 kg del <em>Lote 1 (Azul Marino)</em> que tenían solo 15 días de vida útil remanente y completar con 150 kg del <em>Lote 2</em>, se logró:<br>
            • Cero merma por descomposición química o apelmazamiento.<br>
            • Costo de despacho asignado a producción: (200 kg × $120) + (150 kg × $140) = <strong>$45,000 MXN</strong>.<br>
            • Cumplimiento con auditorías de calidad textil y trazabilidad de lotes.
          </div>
        `;
        document.getElementById('step-btn-2').classList.add('is-completed');
      } else if (metodo === 'ueps') {
        feedbackValuacion.className = 'sim-feedback-inline is-wrong';
        feedbackValuacion.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>¡Alerta Crítica! Pérdida económica por caducidad (Método UEPS / LIFO)</strong><br>
            Al tomar las últimas entradas (Lote 3 y Lote 2), el <strong>Lote 1 quedó estancado en bodega y venció a los 15 días</strong>.<br>
            • Consecuencia: <strong>Pérdida de $24,000 MXN</strong> en tambos de colorante reactivo descompuesto.<br>
            • En ingeniería textil y manejo de sustancias químicas, el método UEPS está estrictamente desaconsejado debido a la degradación de principios activos.
          </div>
        `;
      } else {
        feedbackValuacion.className = 'sim-feedback-inline is-wrong';
        feedbackValuacion.innerHTML = `
          <i class="fas fa-info-circle fa-2x"></i>
          <div>
            <strong>Costo Promedio Ponderado: Parcialmente viable contablemente pero riesgoso físicamente</strong><br>
            Aunque diluye el costo unitario a $142.14 MXN/kg, si en la operación física del almacén no se acompaña de una política estricta de rotación PEPS (FIFO), el lote más antiguo corre alto riesgo de caducar. Selecciona PEPS para asegurar la rotación física del inventario.
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 3: OPTIMIZADOR DE CUBICAJE Y PALETIZADO
  // ==========================================
  const btnCheckCubicaje = document.getElementById('btn-check-cubicaje');
  const feedbackCubicaje = document.getElementById('feedback-u2-cubicaje');

  if (btnCheckCubicaje) {
    btnCheckCubicaje.addEventListener('click', () => {
      const capas = parseFloat(document.getElementById('u2-calc-capas').value);
      const cajasTarima = parseFloat(document.getElementById('u2-calc-cajas-tarima').value);
      const tarimasLote = parseFloat(document.getElementById('u2-calc-tarimas-lote').value);
      const pesoTarima = parseFloat(document.getElementById('u2-calc-peso-tarima').value);

      // Capas: (165 - 15) / 25 = 150 / 25 = 6 capas
      const capasOk = Math.abs(capas - 6) === 0;
      // Cajas por tarima: Patrón estándar 10 cajas/capa x 6 capas = 60 cajas (o 9 cajas/capa x 6 = 54)
      const cajasOk = (cajasTarima >= 54 && cajasTarima <= 60);
      // Tarimas para 8,000 prendas (8,000 / 25 = 320 cajas):
      // Si 60 cajas/tarima: 320 / 60 = 5.33 -> 6 tarimas
      // Si 54 cajas/tarima: 320 / 54 = 5.92 -> 6 tarimas
      const tarimasOk = Math.abs(tarimasLote - 6) === 0;
      // Peso bruto: (60 cajas x 12 kg) + 25 kg = 745 kg (o 54x12+25 = 673 kg)
      const pesoOk = (pesoTarima >= 650 && pesoTarima <= 760);

      feedbackCubicaje.style.display = 'block';

      if (capasOk && cajasOk && tarimasOk && pesoOk) {
        feedbackCubicaje.className = 'sim-feedback-inline is-correct';
        feedbackCubicaje.innerHTML = `
          <i class="fas fa-boxes-stacked fa-2x"></i>
          <div>
            <strong>¡Cálculo de Cubicaje y Paletizado Aprobado!</strong><br>
            • <strong>6 capas de altura</strong> (aprovechando 1.50 m de carga útil + 0.15 m de tarima = 1.65 m máximo).<br>
            • <strong>${cajasTarima} cajas por tarima</strong> (${cajasTarima * 25} prendas por tarima).<br>
            • <strong>6 tarimas requeridas</strong> para consolidar las 8,000 prendas de algodón en 320 cajas.<br>
            • <strong>${pesoTarima} kg de peso bruto por tarima</strong> (perfectamente seguro, dentro del límite de 1,000 kg).
          </div>
        `;
        document.getElementById('step-btn-3').classList.add('is-completed');
      } else {
        feedbackCubicaje.className = 'sim-feedback-inline is-wrong';
        feedbackCubicaje.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>Verifica tus dimensiones y conversiones:</strong><br>
            ${!capasOk ? '• <em>Capas:</em> (Altura máxima 165 cm - Altura de tarima 15 cm) / Altura de caja 25 cm = 150 / 25 = 6 capas.<br>' : '• <em>Capas:</em> Correcto (6 capas).<br>'}
            ${!cajasOk ? '• <em>Cajas/tarima:</em> Multiplica cajas por capa (entre 9 y 10) × 6 capas = entre 54 y 60 cajas.<br>' : '• <em>Cajas/tarima:</em> Correcto.<br>'}
            ${!tarimasOk ? '• <em>Tarimas para el lote:</em> 8,000 prendas / 25 prendas por caja = 320 cajas totales. Divide 320 entre tus cajas por tarima y redondea al entero superior (6 tarimas).<br>' : '• <em>Tarimas:</em> Correcto (6 tarimas).<br>'}
            ${!pesoOk ? '• <em>Peso bruto:</em> (Cajas por tarima × 12 kg) + 25 kg de peso de la tarima.<br>' : '• <em>Peso bruto:</em> Correcto.<br>'}
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

  const btnGuardarDictamen = document.getElementById('btn-guardar-dictamen-u2');
  if (btnGuardarDictamen) {
    btnGuardarDictamen.addEventListener('click', () => {
      const textoDictamen = document.getElementById('u2-dictamen-texto').value;
      const dataToSave = {
        fecha: new Date().toISOString(),
        unidad: 'unidad-02',
        caso: 'Moda ESIT',
        dictamen: textoDictamen,
        puntaje: document.getElementById('u2-score-circle').textContent
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      alert('¡Dictamen técnico y memoria de cubicaje guardados en tu navegador!');
      document.getElementById('step-btn-4').classList.add('is-completed');
    });
  }

  const btnImprimir = document.getElementById('btn-imprimir-u2');
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

    const selectedStrat = document.querySelector('input[name="u2-strat"]:checked');
    if (selectedStrat && selectedStrat.value === 'opt_racks_peps') {
      puntos += 25;
    } else if (selectedStrat) {
      puntos += 10;
    }

    const circle = document.getElementById('u2-score-circle');
    if (circle) circle.textContent = `${puntos}`;

    const scoreTitle = document.getElementById('u2-score-title');
    if (scoreTitle) {
      if (puntos >= 90) scoreTitle.textContent = 'Dictamen Sobresaliente de Almacenes';
      else if (puntos >= 70) scoreTitle.textContent = 'Dictamen Aprobado con Observaciones';
      else scoreTitle.textContent = 'Dictamen en Desarrollo';
    }
  }

  // Inicializar
  actualizarSensibilidadEoq();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const obj = JSON.parse(saved);
      const txt = document.getElementById('u2-dictamen-texto');
      if (txt && obj.dictamen) txt.value = obj.dictamen;
    }
  } catch (err) {
    console.warn(err);
  }
});
