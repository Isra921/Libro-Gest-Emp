// ==========================================================================
// DATA MANAGER · Carga de datos de las unidades (JSON)
// --------------------------------------------------------------------------
// - Todas las rutas de los JSON se escriben desde la RAÍZ del sitio
//   (ej. "unidades/unidad-01/temas/tema-01-01.html").
// - Cada página indica en <body data-root="..."> cuántos niveles debe subir
//   para llegar a la raíz ("" en la raíz, "../../" dentro de unidades/unidad-XX/).
// - Guarda en caché cada archivo para no repetir peticiones fetch.
// - Incluye respaldo offline embebido para visualización local directa (file:///).
// ==========================================================================

class DataError extends Error {
    constructor(archivo, mensaje) {
        super(mensaje);
        this.name = 'DataError';
        this.archivo = archivo;
    }
}

const DataManager = {
    RUTA_CATALOGO: 'assets/data/unidades-data.json',
    CARPETA_UNIDADES: 'assets/data/unidades/',
    PATRON_PAGINA_UNIDAD: id => `unidades/${id}/index.html`,
    PATRON_URL_ABSOLUTA: /^(?:[a-z]+:)?\/\//i,

    _cache: new Map(),

    /** Prefijo relativo para llegar a la raíz del sitio desde la página actual. */
    raiz() {
        return document.body.dataset.root || '';
    },

    /** Convierte una ruta escrita desde la raíz en una ruta válida para esta página. */
    ruta(rutaDesdeRaiz) {
        if (!rutaDesdeRaiz) return '';
        if (this.PATRON_URL_ABSOLUTA.test(rutaDesdeRaiz) || rutaDesdeRaiz.startsWith('#')) {
            return rutaDesdeRaiz;
        }
        return `${this.raiz()}${rutaDesdeRaiz}`;
    },

    /** Descarga y valida un JSON. Si fetch falla (ej. por CORS al abrir con file:///), usa el respaldo embebido. */
    async _cargarJSON(rutaDesdeRaiz) {
        if (this._cache.has(rutaDesdeRaiz)) return this._cache.get(rutaDesdeRaiz);

        const promesa = (async () => {
            try {
                const url = this.ruta(rutaDesdeRaiz);
                const esWeb = typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http');
                const urlFetch = esWeb ? (url.includes('?') ? (url + '&v=2.2') : (url + '?v=2.2')) : url;
                const respuesta = await fetch(urlFetch);
                if (respuesta.ok) {
                    const texto = await respuesta.text();
                    return JSON.parse(texto);
                }
            } catch (error) {
                // Fetch falló (típicamente CORS en protocolo file:///). Proceder con respaldo embebido si existe.
            }

            if (DataManager.DATOS_EMBEBIDOS && DataManager.DATOS_EMBEBIDOS[rutaDesdeRaiz]) {
                return DataManager.DATOS_EMBEBIDOS[rutaDesdeRaiz];
            }

            throw new DataError(rutaDesdeRaiz,
                'No se pudo leer el archivo. Si abriste la página con doble clic, ábrela con un servidor local (por ejemplo, Live Server).');
        })();

        this._cache.set(rutaDesdeRaiz, promesa);
        promesa.catch(() => this._cache.delete(rutaDesdeRaiz));
        return promesa;
    },

    /** Datos generales del catálogo: título, descripción y orden de las unidades. */
    async getCatalogo() {
        return this._cargarJSON(this.RUTA_CATALOGO);
    },

    /** Datos completos de una unidad (assets/data/unidades/<id>.json). */
    async getUnidad(idUnidad) {
        return this._cargarJSON(`${this.CARPETA_UNIDADES}${idUnidad}.json`);
    },

    /** Todas las unidades, en el orden definido en el catálogo. */
    async getUnidades() {
        const catalogo = await this.getCatalogo();
        return Promise.all(catalogo.unidades.map(id => this.getUnidad(id)));
    },

    /** Cualquier otro JSON del sitio (ej. bancos de preguntas de las actividades). */
    async getArchivo(rutaDesdeRaiz) {
        return this._cargarJSON(rutaDesdeRaiz);
    },

    /** Ruta (ya ajustada a la página actual) hacia la página de una unidad. */
    urlUnidad(idUnidad) {
        return this.ruta(this.PATRON_PAGINA_UNIDAD(idUnidad));
    },

    /**
     * Ruta (ya ajustada a la página actual) hacia las referencias de una unidad.
     * La usa tema-plantilla.js ("Ver lista completa"); sin ella el índice lateral
     * y la navegación de los temas no se generaban desde el JSON.
     */
    urlReferencias(idUnidad) {
        return this.ruta(`unidades/${idUnidad}/referencias.html`);
    },

    /** Respaldo embebido de datos para que la interfaz funcione offline y bajo file:/// */
    DATOS_EMBEBIDOS: {
        'assets/data/unidades-data.json': {
            "titulo": "Unidades temáticas",
            "descripcion": "Programa académico oficial de Gestión Empresarial de la Escuela Superior de Cómputo (ESCOM - IPN).",
            "unidades": ["unidad-01", "unidad-02", "unidad-03", "unidad-04", "unidad-05"]
        },
        'assets/data/unidades/unidad-05.json': {
            "id": "unidad-05",
            "numero": 5,
            "titulo": "Tendencias en la gestión empresarial",
            "descripcion": "Aplica los aspectos legales, la responsabilidad social empresarial, la sustentabilidad y las habilidades digitales frente a las tecnologías emergentes como inteligencia artificial, computación en la nube, big data, blockchain e Internet de las cosas.",
            "lema": "Marco normativo, ética corporativa, desarrollo sostenible y vanguardia tecnológica para las organizaciones contemporáneas.",
            "duracion_horas": 12.0,
            "temas": [
                { "numero": "5.1", "nombre": "Aspectos Legales de la Empresa", "url": "unidades/unidad-05/temas/tema-05-01.html" },
                { "numero": "5.2", "nombre": "Responsabilidad Social y Sustentabilidad", "url": "unidades/unidad-05/temas/tema-05-02.html" },
                { "numero": "5.3", "nombre": "Habilidades Digitales", "url": "unidades/unidad-05/temas/tema-05-03.html" },
                { "numero": "5.4", "nombre": "Tecnologías y Tendencias Digitales", "url": "unidades/unidad-05/temas/tema-05-04.html" }
            ]
        }
    }
};
