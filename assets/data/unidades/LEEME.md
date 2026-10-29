# Cómo editar una unidad · Gestión Empresarial (ESCOM - IPN)

Cada unidad temática tiene **un solo archivo JSON principal**: `assets/data/unidades/unidad-XX.json`.
La página `unidades/unidad-XX/index.html` y la tarjeta correspondiente en `unidades.html` se generan solas a partir de ese archivo. **No es necesario modificar el HTML base de la portada de la unidad.**

## Campos en `assets/data/unidades/unidad-XX.json`

| Campo | Descripción | Ejemplo / Formato |
|---|---|---|
| `numero` | Número arábigo de la unidad (el numeral romano I, II, III se calcula solo). | `1` |
| `titulo` | Título oficial de la unidad. | `"Introducción a la Gestión Empresarial"` |
| `descripcion` | Texto breve que aparece en la tarjeta del catálogo `unidades.html`. | `"Fundamentos conceptuales, evolución y modelos organizacionales..."` |
| `lema` | Subtítulo que se muestra bajo el encabezado principal de la unidad. | `"Bases teóricas y herramientas de diagnóstico..."` |
| `duracion_horas` | Solo el número de horas lectivas estimadas. | `24.0` |
| `introduccion` | Array con los párrafos introductorios. | `["Párrafo 1...", "Párrafo 2..."]` |
| `recorrido` | Breve texto que orienta la secuencia pedagógica de los temas. | `"En esta unidad explorarás..."` |
| `competencias` | Lista de competencias específicas a desarrollar en la unidad. | `["Analiza...", "Diseña..."]` |
| `temas` | Lista de temas de la unidad (ver estructura abajo). | `[ { ... }, { ... } ]` |
| `actividad_final` | `nombre`, `descripcion` y `url` de la actividad integradora. | `{ "nombre": "...", "url": "..." }` |
| `video` | Objeto opcional (`titulo`, `url` embed de YouTube, `enlace`, `referencia` APA). Si no hay video, dejar `url: ""`. | `{ "titulo": "", "url": "" }` |

### Estructura de cada tema en el JSON

```json
{
  "numero": "1.1",
  "nombre": "Conceptos Fundamentales de la Gestión Empresarial",
  "sintesis": "Una línea que resume el tema para la tarjeta y el temario.",
  "url": "unidades/unidad-01/temas/tema-01-01.html",
  "actividad": {
    "nombre": "Actividad de aprendizaje 1.1",
    "url": "unidades/unidad-01/actividades/actividad-1-1.html"
  }
}
```

> **Nota:** Si un tema aún está en redacción y no tiene archivo HTML, deja `"url": ""`. El sistema lo marcará automáticamente como **Próximamente** y su actividad se deshabilitará de forma segura.

---

## Cómo crear y redactar un nuevo tema

1. Copia la plantilla de `unidades/unidad-01/temas/tema-01-01.html` y renómbrala (ej. `tema-01-02.html`).
2. En la etiqueta `<body>` ajusta:
   ```html
   <body class="u-body" data-root="../../../" data-unidad="unidad-01" data-tema="1.2">
   ```
3. Modifica `<title>`, el subtítulo de la unidad y el encabezado `<h1>`.
4. Llena tu contenido dentro de `<div class="t-prose">`:
   - Párrafo de idea central: `<p class="t-lead">`
   - Secciones y subtemas: `<section id="sec-1" data-toc="1.2.1 Título del subtema">`
   - Figuras con zoom:
     ```html
     <figure class="t-figure" data-ampliable>
       <figcaption><span class="t-figure__titulo">Título de la figura</span></figcaption>
       <div class="t-figure__media"><img src="../../../assets/img/tu-imagen.png" alt="Descripción"></div>
       <p class="t-figure__nota"><em>Nota.</em> Elaboración propia basada en...</p>
     </figure>
     ```
   - Cuadros de nota y conceptos:
     ```html
     <aside class="t-callout t-callout--info">
       <p class="t-callout__title"><i class="fas fa-lightbulb"></i> Concepto Clave</p>
       <p>Explicación del concepto...</p>
     </aside>
     ```
5. Actualiza los botones de navegación inferior (`<nav class="t-pager">`) para enlazar al tema anterior y siguiente.
