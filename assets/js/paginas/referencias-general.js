// ==========================================================================
// REFERENCIAS GENERALES (referencias.html, en la raíz)
// Reúne en una sola vista las referencias de todas las unidades. No hay una
// segunda lista que mantener: lee las tarjetas <article class="r-card"> de cada
// unidades/unidad-XX/referencias.html (en el orden de unidades-data.json).
// - Filtros por unidad y por tipo de recurso, y búsqueda sin acentos.
// - Las referencias repetidas en varias unidades se muestran una sola vez.
// - "Copiar lista APA" copia las referencias visibles en orden alfabético.
// - Acepta ?unidad=unidad-XX para abrir filtrada (lo usa el menú desde una unidad).
// Depende de: data-manager.js, unidades-ui.js
// ==========================================================================

(function () {
    const UI = UnidadesUI;
    const TODAS = 'todas';
    const TODOS = 'todos';
    const MS_AVISO_COPIADO = 2000;

    const CATEGORIAS = {
        libros: { texto: 'Libros de texto', icono: 'fa-book' },
        articulos: { texto: 'Artículos', icono: 'fa-newspaper' },
        normativa: { texto: 'Normativa', icono: 'fa-scale-balanced' },
        web: { texto: 'Recursos web', icono: 'fa-globe' }
    };

    const estado = { unidad: TODAS, categoria: TODOS, consulta: '' };

    const normalizar = texto => String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

    /** Texto con el que se ordena alfabéticamente (APA: por autor o, si no hay, por título). */
    const claveOrden = tarjeta => normalizar(tarjeta.querySelector('.r-card__citation')?.textContent);

    async function tarjetasDeUnidad(unidad) {
        const respuesta = await fetch(DataManager.urlReferencias(unidad.id));
        if (!respuesta.ok) return [];
        const documento = new DOMParser().parseFromString(await respuesta.text(), 'text/html');
        return [...documento.querySelectorAll('#rGrid .r-card')];
    }

    /** Une las tarjetas de todas las unidades; una referencia repetida acumula sus unidades. */
    function combinar(listas, unidades) {
        const porCita = new Map();
        listas.forEach((tarjetas, i) => {
            const unidad = unidades[i];
            tarjetas.forEach(original => {
                const clave = claveOrden(original);
                if (!clave) return;
                const etiqueta = `Unidad ${UI.romano(unidad.numero)}`;
                if (porCita.has(clave)) {
                    const existente = porCita.get(clave);
                    existente.dataset.unidades += ` ${unidad.id}`;
                    existente.querySelector('.r-card__unit-tag').textContent += ` · ${etiqueta}`;
                    return;
                }
                const tarjeta = document.importNode(original, true);
                tarjeta.dataset.unidades = unidad.id;
                const tema = tarjeta.querySelector('.r-card__unit-tag');
                if (tema) tema.textContent = `${etiqueta} · ${tema.textContent.trim()}`;
                // Rutas relativas escritas para unidades/unidad-XX/: se ajustan a la raíz.
                tarjeta.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href');
                    if (!DataManager.PATRON_URL_ABSOLUTA.test(href) && !href.startsWith('#')) {
                        a.setAttribute('href', DataManager.ruta(`unidades/${unidad.id}/${href}`));
                    }
                });
                porCita.set(clave, tarjeta);
            });
        });
        return [...porCita.values()].sort((a, b) => claveOrden(a).localeCompare(claveOrden(b), 'es'));
    }

    function botonFiltro({ grupo, valor, texto, icono, activo }) {
        return `<button type="button" class="r-filter-btn${activo ? ' is-active' : ''}" data-grupo="${grupo}" data-valor="${UI.esc(valor)}" aria-pressed="${activo}">
            ${icono ? `<i class="fas ${icono}" aria-hidden="true"></i> ` : ''}${UI.esc(texto)} <span class="r-count">0</span>
        </button>`;
    }

    function dibujarFiltros(unidades, tarjetas) {
        const categorias = Object.keys(CATEGORIAS).filter(c => tarjetas.some(t => t.dataset.category === c));
        document.getElementById('filtroUnidad').innerHTML = [
            botonFiltro({ grupo: 'unidad', valor: TODAS, texto: 'Todas', icono: 'fa-layer-group', activo: estado.unidad === TODAS }),
            ...unidades.map(u => botonFiltro({ grupo: 'unidad', valor: u.id, texto: `Unidad ${UI.romano(u.numero)}`, activo: estado.unidad === u.id }))
        ].join('');
        document.getElementById('filtroTipo').innerHTML = [
            botonFiltro({ grupo: 'categoria', valor: TODOS, texto: 'Todos', icono: 'fa-border-all', activo: true }),
            ...categorias.map(c => botonFiltro({ grupo: 'categoria', valor: c, texto: CATEGORIAS[c].texto, icono: CATEGORIAS[c].icono, activo: false }))
        ].join('');
    }

    const deUnidad = (t, unidad) => unidad === TODAS || t.dataset.unidades.split(' ').includes(unidad);
    const deCategoria = (t, categoria) => categoria === TODOS || t.dataset.category === categoria;
    const coincide = (t, consulta) => !consulta || normalizar(t.textContent).includes(consulta);

    function aplicar(tarjetas, unidades) {
        let visibles = 0;
        tarjetas.forEach(t => {
            const ver = deUnidad(t, estado.unidad) && deCategoria(t, estado.categoria) && coincide(t, estado.consulta);
            t.hidden = !ver;
            if (ver) visibles++;
        });

        // Conteos: cada grupo se cuenta respetando el otro filtro y la búsqueda.
        document.querySelectorAll('[data-grupo="unidad"]').forEach(b => {
            b.querySelector('.r-count').textContent = tarjetas.filter(t => deUnidad(t, b.dataset.valor) && deCategoria(t, estado.categoria) && coincide(t, estado.consulta)).length;
        });
        document.querySelectorAll('[data-grupo="categoria"]').forEach(b => {
            b.querySelector('.r-count').textContent = tarjetas.filter(t => deUnidad(t, estado.unidad) && deCategoria(t, b.dataset.valor) && coincide(t, estado.consulta)).length;
        });

        document.getElementById('rEmpty').hidden = visibles > 0;
        const unidad = unidades.find(u => u.id === estado.unidad);
        document.getElementById('resumenReferencias').textContent = unidad
            ? `${UI.plural(visibles, 'referencia', 'referencias')} de la Unidad ${UI.romano(unidad.numero)}: ${unidad.titulo}`
            : `${UI.plural(visibles, 'referencia', 'referencias')} de ${UI.plural(unidades.length, 'unidad', 'unidades')}`;
    }

    async function copiar(texto, boton, textoOriginal) {
        try {
            await navigator.clipboard.writeText(texto);
        } catch (error) {
            const area = document.createElement('textarea');
            area.value = texto;
            document.body.append(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
        boton.classList.add('is-copied');
        boton.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> ¡Copiado!';
        setTimeout(() => {
            boton.classList.remove('is-copied');
            boton.innerHTML = textoOriginal;
        }, MS_AVISO_COPIADO);
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const grid = document.getElementById('rGrid');
        const parametro = new URLSearchParams(location.search).get('unidad');

        try {
            const unidades = await DataManager.getUnidades();
            const listas = await Promise.all(unidades.map(u => tarjetasDeUnidad(u).catch(() => [])));
            const tarjetas = combinar(listas, unidades);
            if (unidades.some(u => u.id === parametro)) estado.unidad = parametro;

            grid.replaceChildren(...tarjetas);
            grid.setAttribute('aria-busy', 'false');
            dibujarFiltros(unidades, tarjetas);
            aplicar(tarjetas, unidades);

            document.querySelector('.r-toolbar').addEventListener('click', e => {
                const boton = e.target.closest('[data-grupo]');
                if (!boton) return;
                estado[boton.dataset.grupo] = boton.dataset.valor;
                document.querySelectorAll(`[data-grupo="${boton.dataset.grupo}"]`).forEach(b => {
                    const activo = b === boton;
                    b.classList.toggle('is-active', activo);
                    b.setAttribute('aria-pressed', String(activo));
                });
                aplicar(tarjetas, unidades);
            });

            document.getElementById('searchRef').addEventListener('input', e => {
                estado.consulta = normalizar(e.target.value);
                aplicar(tarjetas, unidades);
            });

            grid.addEventListener('click', e => {
                const boton = e.target.closest('.r-btn-copy');
                if (!boton) return;
                const cita = boton.closest('.r-card').querySelector('.r-card__citation').textContent.replace(/\s+/g, ' ').trim();
                copiar(cita, boton, '<i class="fas fa-copy" aria-hidden="true"></i> Cita APA');
            });

            const copiarLista = document.getElementById('copiarLista');
            copiarLista.addEventListener('click', () => {
                const citas = tarjetas.filter(t => !t.hidden)
                    .map(t => t.querySelector('.r-card__citation').textContent.replace(/\s+/g, ' ').trim());
                copiar(citas.join('\n\n'), copiarLista, copiarLista.innerHTML);
            });
        } catch (error) {
            UI.mostrarError(grid, error);
        }
    });
})();
