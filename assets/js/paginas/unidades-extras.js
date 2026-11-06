// ==========================================================================
// CATÁLOGO DE UNIDADES · Complementos (unidades.html)
// Se carga después de unidades-catalogo.js y no modifica su lógica: cuando las
// tarjetas ya están dibujadas (aria-busy="false") les agrega estado de la unidad,
// temas enlazados, avance del alumno, acceso al primer tema y el buscador.
// Depende de: data-manager.js, unidades-ui.js, unidades-catalogo.js
// ==========================================================================

(function () {
    const UI = UnidadesUI;
    const PREFIJO_RESULTADO = 'resultadoActividad:';

    const normalizar = texto => String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    function avance(unidad) {
        const claves = UI.actividades(unidad).filter(a => a.disponible).map(a => a.numero);
        if (unidad.actividad_final && unidad.actividad_final.url) claves.push(`${unidad.numero}.final`);
        const hechas = claves.filter(c => UI.leerPreferencia(PREFIJO_RESULTADO + c, null) !== null).length;
        return { hechas, total: claves.length };
    }

    function chipEstado(temas, disponibles) {
        if (!disponibles.length) return '<span class="u-chip u-unit-status is-dev"><i class="fas fa-hammer" aria-hidden="true"></i> En desarrollo</span>';
        if (disponibles.length < temas.length) return `<span class="u-chip u-unit-status is-partial"><i class="fas fa-circle-half-stroke" aria-hidden="true"></i> ${disponibles.length} de ${temas.length} temas</span>`;
        return '<span class="u-chip u-unit-status is-ready"><i class="fas fa-circle-check" aria-hidden="true"></i> Completa</span>';
    }

    function temaMini(tema) {
        const numero = `<span class="u-topic-mini__num">${UI.esc(tema.numero)}</span>`;
        if (tema.url) {
            return `<a class="u-topic-mini__link" href="${UI.esc(DataManager.ruta(tema.url))}">${numero}<span>${UI.esc(tema.nombre)}</span></a>`;
        }
        return `${numero}<span>${UI.esc(tema.nombre)} <small class="u-pending-label">Próximamente</small></span>`;
    }

    function completarTarjeta(tarjeta, unidad) {
        const temas = UI.lista(unidad.temas);
        const disponibles = temas.filter(t => t.url);

        tarjeta.dataset.busqueda = normalizar([unidad.titulo, unidad.descripcion, ...temas.map(t => t.nombre)].join(' '));

        const cabecera = tarjeta.querySelector('.u-unit-card__head');
        const chips = document.createElement('div');
        chips.className = 'u-unit-card__chips';
        cabecera.querySelectorAll(':scope > .u-chip').forEach(chip => chips.append(chip));
        chips.insertAdjacentHTML('beforeend', chipEstado(temas, disponibles));
        cabecera.append(chips);

        tarjeta.querySelectorAll('.u-topic-mini > li').forEach((li, i) => {
            if (!temas[i]) return;
            li.innerHTML = temaMini(temas[i]);
            li.classList.toggle('is-pending', !temas[i].url);
        });

        const pie = tarjeta.querySelector('.u-unit-card__foot');
        const cta = pie.querySelector('.u-unit-card__cta');
        const { hechas, total } = avance(unidad);
        if (total) {
            const porcentaje = Math.round((hechas / total) * 100);
            cta.insertAdjacentHTML('beforebegin', `
                <div class="u-unit-progress">
                    <div class="u-unit-progress__text"><span>Tu avance</span><strong>${hechas} de ${total} actividades</strong></div>
                    <div class="u-unit-progress__track" role="progressbar" aria-label="Avance en las actividades de la unidad" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje}">
                        <span class="u-unit-progress__bar" style="width:${porcentaje}%"></span>
                    </div>
                </div>`);
        }
        const acciones = document.createElement('div');
        acciones.className = 'u-unit-card__actions';
        cta.replaceWith(acciones);
        acciones.append(cta);
        if (disponibles[0]) {
            acciones.insertAdjacentHTML('beforeend',
                `<a class="u-unit-card__secondary" href="${UI.esc(DataManager.ruta(disponibles[0].url))}">Comenzar tema ${UI.esc(disponibles[0].numero)} <i class="fas fa-arrow-right" aria-hidden="true"></i></a>`);
        }
    }

    function iniciarBuscador(grid) {
        const campo = document.getElementById('buscarUnidad');
        const vacio = document.getElementById('sinResultados');
        if (!campo) return;
        campo.addEventListener('input', () => {
            const consulta = normalizar(campo.value.trim());
            let visibles = 0;
            grid.querySelectorAll('.u-unit-card').forEach(tarjeta => {
                const coincide = !consulta || (tarjeta.dataset.busqueda || '').includes(consulta);
                tarjeta.hidden = !coincide;
                if (coincide) visibles++;
            });
            if (vacio) vacio.hidden = visibles > 0;
        });
    }

    async function completar(grid) {
        if (!grid.querySelector('.u-unit-card')) return;
        try {
            const unidades = await DataManager.getUnidades();
            grid.dataset.total = String(unidades.length);
            unidades.forEach(unidad => {
                const tarjeta = document.getElementById(`titulo-${unidad.id}`)?.closest('.u-unit-card');
                if (tarjeta) completarTarjeta(tarjeta, unidad);
            });
            iniciarBuscador(grid);
        } catch (error) {
            console.error(error);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const grid = document.getElementById('grid-unidades');
        if (!grid) return;
        if (grid.getAttribute('aria-busy') === 'false') {
            completar(grid);
            return;
        }
        const observador = new MutationObserver(() => {
            if (grid.getAttribute('aria-busy') !== 'false') return;
            observador.disconnect();
            completar(grid);
        });
        observador.observe(grid, { attributes: true, attributeFilter: ['aria-busy'] });
    });
})();
