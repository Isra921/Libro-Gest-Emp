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
        'assets/data/navegacion.json': {
            "marca": {
                        "titulo": "ESCOM · Polilibro académico",
                        "subtitulo": "Gestión Empresarial",
                        "url": "index.html",
                        "logo_izq": {
                                    "src": "assets/img/IPNb.png",
                                    "alt": "Instituto Politécnico Nacional",
                                    "clase": "brand-logo--ipn"
                        },
                        "logo_der": {
                                    "src": "assets/img/ESCOMB.png",
                                    "alt": "Escuela Superior de Cómputo",
                                    "clase": "brand-logo--escom"
                        }
            },
            "boton_menu": "Abrir navegación",
            "enlaces": [
                        {
                                    "texto": "Inicio",
                                    "icono": "fa-home",
                                    "url": "index.html"
                        },
                        {
                                    "texto": "Plan de Estudios",
                                    "icono": "fa-file-lines",
                                    "modal": "plan-estudios"
                        },
                        {
                                    "texto": "Unidades",
                                    "icono": "fa-book-open",
                                    "url": "unidades.html"
                        },
                        {
                                    "texto": "Actividades",
                                    "icono": "fa-list-check",
                                    "modal": "actividades"
                        },
                        {
                                    "texto": "Referencias",
                                    "icono": "fa-bookmark",
                                    "url": "referencias.html",
                                    "con_unidad": true
                        },
                        {
                                    "texto": "Glosario",
                                    "icono": "fa-book",
                                    "modal": "glosario"
                        },
                        {
                                    "texto": "Autores",
                                    "icono": "fa-users",
                                    "modal": "autores"
                        }
            ]
},
        'assets/data/unidades-data.json': {
            "titulo": "Unidades temáticas",
            "descripcion": "Programa académico oficial de Gestión empresarial (Ingeniería en Sistemas Computacionales, plan 2020) de la Escuela Superior de Cómputo (ESCOM - IPN).",
            "unidades": [
                "unidad-01",
                "unidad-02",
                "unidad-03",
                "unidad-04",
                "unidad-05"
            ]
        },
        'assets/data/unidades/unidad-01.json': {
            "id": "unidad-01",
            "numero": 1,
            "titulo": "Aspectos básicos de la gestión empresarial",
            "descripcion": "Analiza la gestión empresarial con base en su clasificación y constitucional legal.",
            "lema": "Las organizaciones · Administración · Gestión empresarial · Diferencias entre administrar y gestionar",
            "duracion_horas": 5.5,
            "video": {
                "titulo": "TODO: Video de la Unidad (Opcional)",
                "url": "",
                "enlace": "",
                "referencia": "TODO: Cita en formato APA del video."
            },
            "introduccion": [
                "TODO: Párrafo 1 de introducción a la Unidad I de Gestión Empresarial.",
                "TODO: Párrafo 2 sobre la relevancia del marco teórico y práctico en el perfil de egreso en ESCOM."
            ],
            "recorrido": "TODO: Descripción general de la ruta de aprendizaje a través de los temas de esta unidad.",
            "competencias": [
                "Analiza la gestión empresarial con base en su clasificación y constitucional legal."
            ],
            "temas": [
                {
                    "numero": "1.1",
                    "nombre": "Las organizaciones",
                    "sintesis": "1.1.1 Clasificación · 1.1.2 Constitución legal de acuerdo con la Ley de Sociedades Mercantiles y la Ley de Sociedades Civiles",
                    "icono": "fa-building",
                    "url": "unidades/unidad-01/temas/tema-01-01.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 1.1",
                        "url": "unidades/unidad-01/actividades/actividad-1-1.html"
                    }
                },
                {
                    "numero": "1.2",
                    "nombre": "Administración",
                    "sintesis": "1.2.1 Objetivo de la administración",
                    "icono": "fa-briefcase",
                    "url": "",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 1.2",
                        "url": ""
                    }
                },
                {
                    "numero": "1.3",
                    "nombre": "Gestión empresarial",
                    "sintesis": "1.3.1 Objetivo de la gestión empresarial · 1.3.2 Funciones básicas · 1.3.3 Clasificación",
                    "icono": "fa-diagram-project",
                    "url": "",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 1.3",
                        "url": ""
                    }
                },
                {
                    "numero": "1.4",
                    "nombre": "Diferencias entre administrar y gestionar",
                    "icono": "fa-scale-balanced",
                    "url": "",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 1.4",
                        "url": ""
                    }
                }
            ],
            "actividad_final": {
                "nombre": "Actividad final: Caso integrador Novatech Solutions",
                "descripcion": "Simulador interactivo sobre constitución legal, proceso administrativo y diferencias entre administrar y gestionar en una empresa de software.",
                "url": "unidades/unidad-01/actividades/actividad-final.html"
            }
        },
        'assets/data/unidades/unidad-02.json': {
            "id": "unidad-02",
            "numero": 2,
            "titulo": "Gestión estratégica en las empresas de innovación tecnológica",
            "descripcion": "Aplica la gestión estratégica en las empresas de innovación tecnológica con base en las diferentes herramientas, la filosofía y su cultura organizacional.",
            "lema": "Competitividad · Filosofía corporativa · Estrategia y cultura organizacional · Herramientas de gestión estratégica",
            "duracion_horas": 17.5,
            "video": {
                "titulo": "TODO: Video de la Unidad (Opcional)",
                "url": "",
                "enlace": "",
                "referencia": "TODO: Cita en formato APA del video."
            },
            "introduccion": [
                "TODO: Párrafo 1 de introducción a la Unidad II de Gestión Empresarial.",
                "TODO: Párrafo 2 sobre la gestión estratégica en las empresas de innovación tecnológica."
            ],
            "recorrido": "TODO: Descripción general de la ruta de aprendizaje a través de los temas de esta unidad.",
            "competencias": [
                "Aplica la gestión estratégica en las empresas de innovación tecnológica con base en las diferentes herramientas, la filosofía y su cultura organizacional."
            ],
            "temas": [
                {
                    "numero": "2.1",
                    "nombre": "Factores de competitividad que afectan la gestión empresarial",
                    "icono": "fa-chart-line",
                    "url": "unidades/unidad-02/temas/tema-02-01.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 2.1",
                        "url": "unidades/unidad-02/actividades/actividad-2-1.html"
                    }
                },
                {
                    "numero": "2.2",
                    "nombre": "Filosofía corporativa de empresas de innovación tecnológica",
                    "icono": "fa-compass",
                    "url": "",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 2.2",
                        "url": ""
                    }
                },
                {
                    "numero": "2.3",
                    "nombre": "Estrategia y cultura organizacional de empresas de innovación tecnológica",
                    "icono": "fa-chess",
                    "url": "",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 2.3",
                        "url": ""
                    }
                },
                {
                    "numero": "2.4",
                    "nombre": "Implementación de la estrategia, planes, programas, presupuestos y procedimientos",
                    "sintesis": "2.4.1 Cuadro de mando integral",
                    "icono": "fa-list-check",
                    "url": "",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 2.4",
                        "url": ""
                    }
                },
                {
                    "numero": "2.5",
                    "nombre": "Herramientas de gestión estratégica",
                    "sintesis": "2.5.1 Análisis FODA y desarrollo de estrategias · 2.5.2 Modelos de negocio · 2.5.3 Modelo de Diamante de Porter · 2.5.4 Plan comercial · 2.5.5 Plan maestro",
                    "icono": "fa-toolbox",
                    "url": "",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 2.5",
                        "url": ""
                    }
                }
            ],
            "actividad_final": {
                "nombre": "Actividad final: Caso integrador DataSecure México",
                "descripcion": "Simulador interactivo sobre análisis FODA de competitividad, formulación de filosofía corporativa y diseño del Cuadro de Mando Integral.",
                "url": "unidades/unidad-02/actividades/actividad-final.html"
            }
        },
        'assets/data/unidades/unidad-03.json': {
            "id": "unidad-03",
            "numero": 3,
            "titulo": "Gestión operativa de la empresa",
            "descripcion": "Integra la gestión operativa en la empresa, con base en su estructura organizacional y la innovación tecnológica.",
            "lema": "Arquitectura, Innovación y Operaciones para la Ventaja Competitiva",
            "duracion_horas": 24,
            "video": {
                "titulo": "TODO: Video de la Unidad (Opcional)",
                "url": "",
                "enlace": "",
                "referencia": "TODO: Cita en formato APA del video."
            },
            "introduccion": [
                "TODO: Párrafo 1 de introducción a la Unidad III de Gestión Empresarial.",
                "TODO: Párrafo 2 sobre la gestión operativa de la empresa."
            ],
            "recorrido": "En esta unidad recorrerás cuatro temas que explican cómo opera una empresa en su día a día. Comenzarás con la estructura organizacional, que define quién hace qué y cómo se coordina el trabajo; seguirás con la innovación y la tecnología como fuentes de valor y competitividad; después verás cómo manejar el cambio y reducir la resistencia con los modelos de Lewin y Kotter; y cerrarás con las herramientas de gestión operativa, como los diagramas de Gantt, Pareto e Ishikawa, el ciclo PHVA, las 5S, Kanban y los KPI, que sirven para planear, controlar y mejorar continuamente los procesos. Cada tema incluye un recurso interactivo y una actividad para comprobar tu comprensión.",
            "competencias": [
                "Integra la gestión operativa en la empresa, con base en su estructura organizacional y la innovación tecnológica."
            ],
            "temas": [
                {
                    "numero": "3.1",
                    "nombre": "Estructura Organizacional",
                    "sintesis": "La base estructural que distribuye responsabilidades y coordina esfuerzos.",
                    "icono": "fa-sitemap",
                    "url": "unidades/unidad-03/temas/tema-03-01.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 3.1",
                        "url": "unidades/unidad-03/actividades/actividad-3-1.html"
                    }
                },
                {
                    "numero": "3.2",
                    "nombre": "Innovación y Tecnología",
                    "sintesis": "Los impulsos que perciben el entorno, procesan datos y generan nuevas formas de crear valor.",
                    "icono": "fa-lightbulb",
                    "url": "unidades/unidad-03/temas/tema-03-02.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 3.2",
                        "url": "unidades/unidad-03/actividades/actividad-3-2.html"
                    }
                },
                {
                    "numero": "3.3",
                    "nombre": "Manejo de Cambio e Innovación",
                    "sintesis": "La capacidad adaptativa para flexionarse y transformarse ante presiones externas e internas.",
                    "icono": "fa-arrows-rotate",
                    "url": "unidades/unidad-03/temas/tema-03-03.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 3.3",
                        "url": "unidades/unidad-03/actividades/actividad-3-3.html"
                    }
                },
                {
                    "numero": "3.4",
                    "nombre": "Herramientas de Gestión Operativa",
                    "sintesis": "El pulso táctico y las herramientas que mantienen la eficiencia y la mejora continua.",
                    "icono": "fa-gears",
                    "url": "unidades/unidad-03/temas/tema-03-04.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 3.4",
                        "url": "unidades/unidad-03/actividades/actividad-3-4.html"
                    }
                }
            ],
            "actividad_final": {
                "nombre": "Actividad final: Caso integrador LogiExpress",
                "descripcion": "Simulador interactivo sobre diseño de estructura organizacional, gestión del cambio y reingeniería de procesos de negocio.",
                "url": "unidades/unidad-03/actividades/actividad-final.html"
            }
        },
        'assets/data/unidades/unidad-04.json': {
            "id": "unidad-04",
            "numero": 4,
            "titulo": "Gestión del Capital Humano y la Calidad",
            "descripcion": "Capital humano como activo estratégico, marco normativo de las relaciones laborales en México, fundamentos de la calidad y herramientas para gestionar el talento y mejorar los procesos.",
            "lema": "El capital humano ejecuta, el marco normativo estabiliza y la calidad total eleva: tres engranes de la competitividad sostenible.",
            "duracion_horas": 24,
            "video": {
                "titulo": "",
                "url": "",
                "enlace": "",
                "referencia": ""
            },
            "introduccion": [
                "Las organizaciones compiten hoy con tecnología, capital y procesos que pueden copiarse con relativa facilidad. Lo que no se copia tan fácil es el talento, la creatividad y el compromiso de las personas que integran la empresa, ni una cultura que busca hacer bien las cosas desde la primera vez. Por eso esta unidad reúne dos campos que suelen estudiarse por separado: la gestión del capital humano y la gestión de la calidad.",
                "Primero se analiza el capital humano como el conjunto de conocimientos, habilidades, actitudes y valores que generan valor económico, y el ciclo con el que la empresa atrae, desarrolla, evalúa y retiene a su gente. Después se revisa el marco normativo que regula las relaciones laborales en México, desde el artículo 123 constitucional y la Ley Federal del Trabajo hasta los contratos y la resolución de conflictos. Con esa base se estudia la calidad, su evolución y sus sistemas de gestión, y se cierra con las herramientas concretas que permiten medir y mejorar tanto el desempeño de las personas como el de los procesos."
            ],
            "recorrido": "Avanza del capital humano al marco legal que lo protege, luego a la calidad como filosofía de gestión y, al final, a las herramientas que integran ambos campos.",
            "objetivo": "Analiza la gestión del capital humano, el marco normativo de las relaciones laborales y los fundamentos y herramientas de la calidad para proponer acciones que mejoren la productividad y la competitividad de una organización.",
            "competencias": [
                "Explica el capital humano como activo estratégico y describe los procesos de su gestión.",
                "Identifica las fuentes, principios, sujetos y condiciones del marco normativo laboral mexicano.",
                "Distingue el control, el aseguramiento y la gestión de la calidad total, así como el ciclo PHVA y la norma ISO 9001.",
                "Selecciona herramientas de gestión del talento y de la calidad para diagnosticar y resolver problemas organizacionales."
            ],
            "material_apoyo": [
                {
                    "nombre": "Escape room: Capital humano (Genially)",
                    "url": "https://view.genially.com/66ac21972184a29d288e79ee/interactivecontent-escape-roomcapital-humano"
                },
                {
                    "nombre": "Breakout: Marco normativo laboral (Genially)",
                    "url": "https://view.genially.com/66b45295dff4fdba8748aa18/interactivecontent-breakout-marconormativo-de-las-relaciones-laborales"
                },
                {
                    "nombre": "Escape game: Calidad (Genially)",
                    "url": "https://view.genially.com/66bed427e0a3b3144f1c4041/interactivecontent-escape-gamecalidad-en-la-gestion-empresarial"
                },
                {
                    "nombre": "Breakout: Herramientas de gestión (Genially)",
                    "url": "https://view.genially.com/66c7a8e905479a6f7c36b0c3/interactivecontent-breakoutherramientas-de-gestion-del-capital-humano-yde-calidad"
                }
            ],
            "temas": [
                {
                    "numero": "4.1",
                    "nombre": "Capital Humano",
                    "sintesis": "Concepto, componentes e importancia del capital humano; su gestión, la motivación, el clima laboral y su relación con la competitividad.",
                    "icono": "fa-user-graduate",
                    "url": "unidades/unidad-04/temas/tema-04-01.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 4.1",
                        "url": "unidades/unidad-04/actividades/actividad-4-1.html"
                    }
                },
                {
                    "numero": "4.2",
                    "nombre": "Marco Normativo de las Relaciones Laborales",
                    "sintesis": "Fuentes y principios del derecho laboral en México, sujetos, contrato y condiciones de trabajo, derechos, obligaciones, terminación y relaciones colectivas.",
                    "icono": "fa-scale-balanced",
                    "url": "unidades/unidad-04/temas/tema-04-02.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 4.2",
                        "url": "unidades/unidad-04/actividades/actividad-4-2.html"
                    }
                },
                {
                    "numero": "4.3",
                    "nombre": "La Calidad",
                    "sintesis": "Concepto y evolución de la calidad, sus dimensiones, control y aseguramiento, calidad total, mejora continua y normas ISO.",
                    "icono": "fa-award",
                    "url": "unidades/unidad-04/temas/tema-04-03.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 4.3",
                        "url": "unidades/unidad-04/actividades/actividad-4-3.html"
                    }
                },
                {
                    "numero": "4.4",
                    "nombre": "Herramientas de Gestión del Capital Humano y de Calidad",
                    "sintesis": "Análisis de puestos, evaluación 360°, siete herramientas básicas, Seis Sigma, Lean, 5S y la integración de ambos campos.",
                    "icono": "fa-screwdriver-wrench",
                    "url": "unidades/unidad-04/temas/tema-04-04.html",
                    "actividad": {
                        "nombre": "Actividad de aprendizaje 4.4",
                        "url": "unidades/unidad-04/actividades/actividad-4-4.html"
                    }
                }
            ],
            "actividad_final": {
                "nombre": "Actividad final: Caso integrador Manufacturas Tonatiuh",
                "descripcion": "Asume el papel de consultor en una empresa con alta rotación, conflictos laborales y defectos en producción: diagnostica, decide conforme a la ley y diseña un plan de mejora.",
                "url": "unidades/unidad-04/actividades/actividad-final.html"
            }
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
            ],
            "actividad_final": {
                "nombre": "Actividad final: Caso integrador Kopix Cloud Systems",
                "descripcion": "Simulador interactivo sobre formalización jurídica y PI, sustentabilidad corporativa sin greenwashing y tecnologías emergentes.",
                "url": "unidades/unidad-05/actividades/actividad-final.html"
            }
        }
    }
};
