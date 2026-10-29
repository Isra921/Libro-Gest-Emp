# Polilibro Digital Interactivo: Gestión Empresarial
### Escuela Superior de Cómputo (ESCOM) — Instituto Politécnico Nacional (IPN)

Plantilla y arquitectura base para el recurso educativo digital de la unidad de aprendizaje **Gestión Empresarial**. Este repositorio contiene la infraestructura completa (HTML5 semántico, CSS3 modular, motores JavaScript y estructura de datos en JSON) configurada como una **plantilla limpia libre de contenido teórico**, lista para la redacción y maquetación colaborativa por parte de un equipo de trabajo de 4 personas.

---

## 🚀 Inicio Rápido (Cómo Ejecutar el Proyecto Localmente)

Dado que el polilibro carga datos mediante peticiones asíncronas (`fetch` sobre archivos `.json`), **debe ejecutarse a través de un servidor HTTP local** para evitar bloqueos de políticas CORS en el navegador (`file://`).

### Opción 1: Visual Studio Code + Live Server (Recomendado)
1. Abre la carpeta del proyecto en VS Code.
2. Instala la extensión **Live Server** (de Ritwick Dey).
3. Haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"** (o presiona `Alt + L, Alt + O`).
4. Se abrirá automáticamente en tu navegador en `http://127.0.0.1:5500/index.html`.

### Opción 2: Python (Servidor Rápido por Consola)
Si tienes Python instalado, ejecuta en la terminal de la raíz del proyecto:
```bash
# Python 3
python -m http.server 8000
```
Luego abre tu navegador en `http://localhost:8000`.

### Opción 3: Node.js (npx serve / http-server)
```bash
npx serve .
# o
npx http-server -c-1
```

---

## 👥 Guía de Distribución y Roles para el Equipo (4 Integrantes)

Para trabajar de forma organizada sin conflictos en Git, se sugiere la siguiente repartición de responsabilidades:

| Integrante | Rol Asignado | Archivos Principales a su Cargo |
|---|---|---|
| **Integrante 1** | **Unidad 1: Introducción a la Gestión Empresarial** | `assets/data/unidades/unidad-01.json`<br>`unidades/unidad-01/temas/*.html`<br>`assets/data/preguntas/unidad-01/*.json`<br>`unidades/unidad-01/referencias.html` |
| **Integrante 2** | **Unidad 2: Planeación Estratégica y Organización** | `assets/data/unidades/unidad-02.json`<br>`unidades/unidad-02/temas/*.html`<br>`assets/data/preguntas/unidad-02/*.json`<br>`unidades/unidad-02/referencias.html` |
| **Integrante 3** | **Unidad 3: Dirección, Liderazgo y Control Gerencial** | `assets/data/unidades/unidad-03.json`<br>`unidades/unidad-03/temas/*.html`<br>`assets/data/preguntas/unidad-03/*.json`<br>`unidades/unidad-03/referencias.html` |
| **Integrante 4** | **Coordinación General, Portada, Glosario y Evaluación** | `index.html` (bienvenida y modales)<br>`assets/data/glosario.json`<br>`assets/data/autores.json`<br>`assets/data/plan-estudios.json`<br>`assets/data/examen-diagnostico.json` |

---

## 📂 Dónde Editar Cada Elemento del Proyecto

### 1. ¿Cómo editar la información general y portada de una unidad?
> **Regla de oro:** No es necesario editar el HTML de la portada de la unidad (`unidades/unidad-XX/index.html`). 
- Abre `assets/data/unidades/unidad-XX.json`.
- Edita el `titulo`, `lema`, `duracion_horas`, `introduccion`, `competencias` y la lista de `temas`.
- La portada de la unidad y su tarjeta en `unidades.html` se generan automáticamente.

### 2. ¿Cómo redactar o agregar un nuevo tema?
1. Dirígete a la carpeta `unidades/unidad-XX/temas/`.
2. Duplica la plantilla `tema-01-01.html` (o el tema base correspondiente) y renómbralo siguiendo la convención: `tema-XX-YY.html` (ej. `tema-01-02.html`).
3. En la etiqueta `<body>`, actualiza los atributos de datos:
   ```html
   <body class="u-body" data-root="../../../" data-unidad="unidad-01" data-tema="1.2">
   ```
4. Actualiza en el HTML:
   - `<title>` y `<p class="u-eyebrow">`
   - `<h1 class="t-title">`
   - `<p class="t-lead">` (idea central o resumen del tema)
   - Las secciones dentro de `<div class="t-prose">` con su atributo `data-toc="Título"` para el índice lateral interactivo.
5. Da de alta la URL del nuevo tema en `assets/data/unidades/unidad-XX.json` en el campo `"url": "unidades/unidad-XX/temas/tema-XX-YY.html"`.

### 3. ¿Cómo insertar figuras, diagramas y tablas con zoom modal?
Utiliza la clase semántica `.t-figure` con el atributo `data-ampliable`:
```html
<figure class="t-figure" data-ampliable>
  <figcaption><span class="t-figure__titulo">Título descriptivo de la figura</span></figcaption>
  <div class="t-figure__media">
    <img src="../../../assets/img/mi-diagrama.png" alt="Descripción de accesibilidad">
  </div>
  <p class="t-figure__nota"><em>Nota.</em> Fuente de la figura o elaboración propia basada en...</p>
</figure>
```
> **Nota:** La numeración de figuras (*Figura 1.1, Figura 1.2...*) se numera **automáticamente** por JavaScript. No escribas "Figura X.X" en el título.

### 4. ¿Cómo insertar cuadros de notas y conceptos destacados?
```html
<aside class="t-callout t-callout--info">
  <p class="t-callout__title"><i class="fas fa-lightbulb"></i> Concepto Clave</p>
  <p>Texto explicativo del concepto o definición importante.</p>
</aside>
```

### 5. ¿Cómo agregar palabras al Glosario?
Abre `assets/data/glosario.json`, ubica la unidad correspondiente (`unidad-01`, `unidad-02`, etc.) y añade el objeto con tu término:
```json
{
  "termino": "Planeación Estratégica",
  "definicion": "Proceso sistemático mediante el cual una organización establece sus directrices a largo plazo..."
}
```

### 6. ¿Cómo crear preguntas para las actividades formativas?
Abre `assets/data/preguntas/unidad-XX/actividad-XX-YY.json` y añade reactivos:
```json
[
  {
    "id": 1,
    "type": "opcion_multiple",
    "question": "¿Pregunta sobre el tema?",
    "options": [
      "Opción correcta",
      "Distractor 1",
      "Distractor 2",
      "Distractor 3"
    ],
    "answer": "Opción correcta",
    "explicacion": "Retroalimentación formativa que explica por qué es correcta."
  },
  {
    "id": 2,
    "type": "verdadero_falso",
    "statement": "Enunciado que el estudiante debe evaluar como verdadero o falso.",
    "answer": true,
    "explicacion": "Explicación formativa."
  }
]
```

### 7. ¿Cómo agregar referencias bibliográficas (Formato APA)?
Abre `unidades/unidad-XX/referencias.html` y añade un bloque `<article class="r-card">` dentro de `<div class="r-grid" id="rGrid">`:
```html
<article class="r-card" data-category="libros">
  <div class="r-card__top">
    <span class="r-badge r-badge--libro"><i class="fas fa-book"></i> Libro</span>
    <span class="r-card__unit-tag">Tema 1.1</span>
  </div>
  <div class="r-card__body">
    <p class="r-card__citation">
      Apellido, N. (Año). <em>Título del libro</em> (edición). Editorial.
    </p>
    <p class="r-card__desc">
      Breve resumen del contenido y relevancia para la unidad.
    </p>
  </div>
  <div class="r-card__actions">
    <button type="button" class="r-btn-copy" aria-label="Copiar cita APA"><i class="fas fa-copy"></i> Cita APA</button>
  </div>
</article>
```

---

## 🏛️ Estructura del Repositorio

```text
Libro-Gest-Emp/
├── index.html                  # Portada general, bienvenida y ventanas modales principales
├── unidades.html               # Catálogo interactivo de unidades temáticas (tarjetas/lista)
├── 404.html                    # Página de error 404 personalizada con rutas institucionales
├── README.md                   # Documentación general y guía técnica para el equipo
│
├── assets/
│   ├── css/                    # Hojas de estilo modular (accesibilidad WCAG AAA, paleta ESCOM/IPN)
│   │   ├── variables.css       # Token maestro HSL (--verde-h: 208) y colores semánticos
│   │   ├── global.css          # Estructura del sitio, tipografía y resets
│   │   ├── comun.css           # Punto de entrada y estilos transversales
│   │   ├── inicio.css          # Estilos del hero y bienvenida de index.html
│   │   ├── unidad.css          # Estilos de la portada de unidad
│   │   ├── tema.css            # Estilos del artículo del tema, TOC lateral y figuras
│   │   ├── actividad.css       # Estilos de los cuestionarios y simuladores
│   │   └── ...                 # Estilos específicos de modales y componentes
│   │
│   ├── js/                     # Motores JavaScript modulares y accesibles
│   │   ├── data-manager.js     # Cargador centralizado de archivos JSON con caché
│   │   ├── nav-global.js       # Componente de navegación superior institucional
│   │   ├── componentes.js      # Registro y renderizado de componentes
│   │   ├── ventana-modal.js    # Motor de modales con gestión de foco y teclado
│   │   ├── visor-figuras.js    # Visor interactivo de figuras con zoom
│   │   └── paginas/            # Controladores específicos de cada vista
│   │
│   ├── data/                   # Contenidos y estructuras en formato JSON
│   │   ├── navegacion.json     # Configuración del menú y logotipos institucionales
│   │   ├── plan-estudios.json  # Información oficial del programa académico
│   │   ├── unidades-data.json  # Catálogo maestro de unidades registradas
│   │   ├── autores.json        # Fichas del equipo de desarrollo y asesores
│   │   ├── glosario.json       # Términos clasificados por unidad temática
│   │   ├── actividades.json    # Catálogo de actividades y casos integradores
│   │   ├── examen-diagnostico.json # Banco de preguntas del examen inicial
│   │   ├── unidades/           # Archivos JSON individuales de cada unidad temática
│   │   │   ├── LEEME.md        # Documentación de campos de la unidad
│   │   │   ├── unidad-01.json  # Configuración y temas de la Unidad I
│   │   │   ├── unidad-02.json  # Configuración y temas de la Unidad II
│   │   │   └── unidad-03.json  # Configuración y temas de la Unidad III
│   │   └── preguntas/          # Bancos de reactivos para las actividades formativas
│   │
│   └── img/                    # Logotipos oficiales (IPNb.png, ESCOMB.png, etc.)
│
└── unidades/                   # Páginas web de las unidades temáticas
    ├── unidad-01/
    │   ├── index.html          # Portada de la Unidad I
    │   ├── referencias.html    # Acervo bibliográfico de la Unidad I
    │   ├── temas/              # Artículos de contenido teórico
    │   │   └── tema-01-01.html # Plantilla del tema 1.1
    │   └── actividades/        # Evaluaciones y casos de la Unidad I
    │       ├── actividad-1-1.html
    │       └── actividad-final.html
    ├── unidad-02/              # Estructura idéntica para la Unidad II
    └── unidad-03/              # Estructura idéntica para la Unidad III
```

---

## 📌 Reglas de Conservación y Buenas Prácticas
1. **No modificar la lógica de los scripts en `assets/js/`**: El visor de figuras, los modales y el sistema de navegación dependen de clases y atributos específicos (`data-root`, `data-unidad`, `data-tema`).
2. **Respetar las rutas relativas (`data-root`)**:
   - Raíz (`index.html`, `unidades.html`): `data-root=""`
   - Nivel unidad (`unidades/unidad-01/index.html`): `data-root="../../"`
   - Nivel tema/actividad (`unidades/unidad-01/temas/tema-01-01.html`): `data-root="../../../"`
3. **Validar sintaxis JSON**: Asegúrate de que las comas en los archivos `.json` no queden colgando al final de los arrays u objetos para evitar errores de sintaxis en `fetch()`.

---

## 📜 Licencia y Atribución
Este material académico ha sido desarrollado con fines estrictamente educativos por la comunidad de la **Escuela Superior de Cómputo (ESCOM)** del **Instituto Politécnico Nacional (IPN)**, distribuido bajo licencia [Creative Commons Atribución-NoComercial-SinDerivadas 4.0 Internacional (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/).
