/**
 * SIMULADOR LOGÍSTICO Y LABORATORIO DE CASOS - UNIDAD 4
 * Empresa: "Exportaciones Textiles ESIT" (Transporte Internacional, Incoterms e Integración Aduanera T-MEC)
 * Escuela Superior de Ingeniería Textil (ESIT - IPN)
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'esit_logistica_u4_sim';

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
  // ETAPA 1: CUBICAJE Y PESO VOLUMÉTRICO
  // ==========================================
  const btnCheckCubicaje4 = document.getElementById('btn-check-cubicaje4');
  const feedbackCubicaje4 = document.getElementById('feedback-u4-cubicaje');

  if (btnCheckCubicaje4) {
    btnCheckCubicaje4.addEventListener('click', () => {
      const inputVol = parseFloat(document.getElementById('u4-calc-vol').value);
      const inputVolAereo = parseFloat(document.getElementById('u4-calc-vol-aereo').value);
      const inputPesoTasable = parseFloat(document.getElementById('u4-calc-peso-tasable').value);

      // 800 cajas x (0.50 x 0.40 x 0.40) = 800 x 0.08 = 64.0 m3
      const volOk = Math.abs(inputVol - 64.0) <= 0.5;
      // Peso volumétrico IATA: (50 x 40 x 40 / 6000) = 13.333 kg/caja x 800 = 10,666.67 kg
      const aereoOk = Math.abs(inputVolAereo - 10667) <= 50;
      // Peso tasable aéreo = max(8000 kg báscula, 10667 kg volumétrico) = 10667 kg
      const tasableOk = Math.abs(inputPesoTasable - 10667) <= 50;

      feedbackCubicaje4.style.display = 'block';

      if (volOk && aereoOk && tasableOk) {
        feedbackCubicaje4.className = 'sim-feedback-inline is-correct';
        feedbackCubicaje4.innerHTML = `
          <i class="fas fa-check-circle fa-2x"></i>
          <div>
            <strong>¡Cálculo de Cubicaje y Flete 100% Exacto!</strong><br>
            • <strong>Volumen Total: 64.0 m³</strong> (llena un contenedor marítimo de 40' High Cube o una caja seca de 53').<br>
            • <strong>Peso Volumétrico Aéreo: 10,667 kg</strong> (frente a 8,000 kg de peso real en báscula).<br>
            • <strong>Peso Tasable: 10,667 kg</strong>. La aerolínea cobrará por volumen y no por peso, haciendo que el flete aéreo sea extremadamente costoso para prendas abultadas.
          </div>
        `;
        document.getElementById('step-btn-1').classList.add('is-completed');
      } else {
        feedbackCubicaje4.className = 'sim-feedback-inline is-wrong';
        feedbackCubicaje4.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>Revisa tus cálculos de flete volumétrico:</strong><br>
            ${!volOk ? '• <em>Volumen:</em> 800 cajas × (0.50 m × 0.40 m × 0.40 m) = 64.0 m³.<br>' : '• <em>Volumen:</em> Correcto (64 m³).<br>'}
            ${!aereoOk ? '• <em>Peso Volumétrico Aéreo:</em> Aplica la fórmula IATA: (50 × 40 × 40) / 6,000 = 13.333 kg por caja × 800 cajas ≈ 10,667 kg.<br>' : '• <em>Peso Volumétrico:</em> Correcto.<br>'}
            ${!tasableOk ? '• <em>Peso Tasable:</em> En flete de carga se cobra el mayor entre el peso báscula (8,000 kg) y el peso volumétrico (10,667 kg).<br>' : '• <em>Peso Tasable:</em> Correcto.<br>'}
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 2: RUTA CRÍTICA Y VENTANA TEMPORAL
  // ==========================================
  const selModoTransporte = document.getElementById('u4-sel-modo');
  const chkContingencia = document.getElementById('u4-chk-contingencia');
  const btnEvalRuta = document.getElementById('btn-eval-ruta');
  const feedbackRuta = document.getElementById('feedback-u4-ruta');

  if (btnEvalRuta) {
    btnEvalRuta.addEventListener('click', () => {
      const modo = selModoTransporte.value;
      const hayContingencia = chkContingencia.checked;

      feedbackRuta.style.display = 'block';

      if (modo === 'carretero') {
        const tiempoTotal = hayContingencia ? 10 : 7;
        feedbackRuta.className = 'sim-feedback-inline is-correct';
        feedbackRuta.innerHTML = `
          <i class="fas fa-truck-fast fa-2x"></i>
          <div>
            <strong>¡Estrategia Óptima Seleccionada! (Terrestre FTL Directo CDMX-Laredo-Montreal)</strong><br>
            • <strong>Tiempo de tránsito: ${tiempoTotal} días</strong> (ampliamente dentro de la ventana de 30 días).<br>
            • <strong>Costo del flete: $8,400 USD</strong> ($1.05 USD por chamarra).<br>
            • <strong>Ventaja clave:</strong> Servicio puerta a puerta sin transbordos marítimos ni maniobras portuarias riesgosas, eliminando el riesgo de multas por entrega tardía.
          </div>
        `;
        document.getElementById('step-btn-2').classList.add('is-completed');
      } else if (modo === 'maritimo') {
        const tiempoTotal = hayContingencia ? 33 : 24;
        if (hayContingencia) {
          feedbackRuta.className = 'sim-feedback-inline is-wrong';
          feedbackRuta.innerHTML = `
            <i class="fas fa-ship fa-2x"></i>
            <div>
              <strong>¡Incumplimiento de Contrato! Penalizaciones activadas</strong><br>
              Debido a demoras de atraque en Veracruz y clima en el Atlántico Norte, el tiempo subió a <strong>${tiempoTotal} días</strong> (excediendo el límite de 30 días).<br>
              • Consecuencia: <strong>3 días de retraso = $1,500 USD en penalizaciones</strong> contractuales más afectación de la reputación internacional de la empresa.
            </div>
          `;
        } else {
          feedbackRuta.className = 'sim-feedback-inline is-wrong';
          feedbackRuta.innerHTML = `
            <i class="fas fa-info-circle fa-2x"></i>
            <div>
              <strong>Ruta muy ajustada (24 días de 30 posibles)</strong><br>
              Aunque el flete es el más económico ($4,600 USD), tiene un colchón de solo 6 días ante contingencias portuarias o aduaneras. Activa la casilla de contingencia climática para ver el riesgo real.
            </div>
          `;
        }
      } else {
        feedbackRuta.className = 'sim-feedback-inline is-wrong';
        feedbackRuta.innerHTML = `
          <i class="fas fa-plane-slash fa-2x"></i>
          <div>
            <strong>Sobrecosto No Justificado: Aéreo Express ($24,500 USD)</strong><br>
            Aunque llega en 4 días, representa más de $3.06 USD por prenda únicamente en flete, erosionando el 65% del margen de utilidad de la exportación. Solo debe utilizarse en emergencias extremas.
          </div>
        `;
      }
      actualizarPuntajeGlobal();
    });
  }

  // ==========================================
  // ETAPA 3: SIMULADOR DE INCOTERMS 2020
  // ==========================================
  const selIncoterm = document.getElementById('u4-sel-incoterm');
  const btnEvalIncoterm = document.getElementById('btn-eval-incoterm');
  const feedbackIncoterm = document.getElementById('feedback-u4-incoterm');

  if (btnEvalIncoterm) {
    btnEvalIncoterm.addEventListener('click', () => {
      const inc = selIncoterm.value;
      feedbackIncoterm.style.display = 'block';

      if (inc === 'cip' || inc === 'cif') {
        feedbackIncoterm.className = 'sim-feedback-inline is-correct';
        feedbackIncoterm.innerHTML = `
          <i class="fas fa-file-contract fa-2x"></i>
          <div>
            <strong>¡Excelente selección de Incoterm® 2020! (CIP Montreal / CIF)</strong><br>
            • <strong>Transferencia de Costo:</strong> El vendedor (ESIT México) paga el flete internacional y el seguro de carga hasta Montreal.<br>
            • <strong>Transferencia de Riesgo:</strong> El riesgo se transfiere al comprador en el momento en que la mercancía se entrega al primer transportista.<br>
            • <strong>Despacho aduanal de importación en Canadá:</strong> Queda a cargo del comprador canadiense, evitando que la empresa mexicana tenga que registrarse fiscalmente en Canadá.
          </div>
        `;
        document.getElementById('step-btn-3').classList.add('is-completed');
      } else if (inc === 'ddp') {
        feedbackIncoterm.className = 'sim-feedback-inline is-wrong';
        feedbackIncoterm.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>DDP (Delivered Duty Paid): Excesivo riesgo tributario</strong><br>
            Bajo DDP, la empresa mexicana tendría que pagar el GST/HST canadiense y actuar como importador de registro en Canadá, lo cual requiere establecimiento permanente o agente aduanal local con costos desproporcionados.
          </div>
        `;
      } else if (inc === 'exw') {
        feedbackIncoterm.className = 'sim-feedback-inline is-wrong';
        feedbackIncoterm.innerHTML = `
          <i class="fas fa-triangle-exclamation fa-2x"></i>
          <div>
            <strong>EXW (En Fábrica): No competitivo comercialmente</strong><br>
            Bajo EXW, el comprador canadiense tendría que encargarse de recoger en CDMX y realizar el despacho aduanero mexicano de exportación. Grandes corporativos no aceptan este término para pedidos B2B internacionales.
          </div>
        `;
      } else {
        feedbackIncoterm.className = 'sim-feedback-inline is-info';
        feedbackIncoterm.innerHTML = `
          <i class="fas fa-info-circle fa-2x"></i>
          <div>
            <strong>FOB (Free On Board Veracruz): Término exclusivamente marítimo</strong><br>
            Si se elige transporte carretero directo a Canadá, la ICC recomienda usar FCA (Free Carrier) en lugar de FOB, ya que FOB está reservado para carga sobre la borda del buque marítimo.
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

  const btnGuardarDictamen = document.getElementById('btn-guardar-dictamen-u4');
  if (btnGuardarDictamen) {
    btnGuardarDictamen.addEventListener('click', () => {
      const textoDictamen = document.getElementById('u4-dictamen-texto').value;
      const dataToSave = {
        fecha: new Date().toISOString(),
        unidad: 'unidad-04',
        caso: 'Exportaciones Textiles ESIT',
        dictamen: textoDictamen,
        puntaje: document.getElementById('u4-score-circle').textContent
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      alert('¡Dictamen técnico de comercio exterior y cubicaje guardado con éxito!');
      document.getElementById('step-btn-4').classList.add('is-completed');
    });
  }

  const btnImprimir = document.getElementById('btn-imprimir-u4');
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

    const selectedStrat = document.querySelector('input[name="u4-strat"]:checked');
    if (selectedStrat && selectedStrat.value === 'opt_exp_def') {
      puntos += 25;
    } else if (selectedStrat) {
      puntos += 10;
    }

    const circle = document.getElementById('u4-score-circle');
    if (circle) circle.textContent = `${puntos}`;

    const scoreTitle = document.getElementById('u4-score-title');
    if (scoreTitle) {
      if (puntos >= 90) scoreTitle.textContent = 'Dictamen Sobresaliente de Tráfico y Aduanas';
      else if (puntos >= 70) scoreTitle.textContent = 'Dictamen Aprobado con Observaciones';
      else scoreTitle.textContent = 'Dictamen en Desarrollo';
    }
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const obj = JSON.parse(saved);
      const txt = document.getElementById('u4-dictamen-texto');
      if (txt && obj.dictamen) txt.value = obj.dictamen;
    }
  } catch (err) {
    console.warn(err);
  }
});
