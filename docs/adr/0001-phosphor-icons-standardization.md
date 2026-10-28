# ADR 0001: Estandarización de Iconografía con Phosphor Icons (`@phosphor-icons/web`)

* **Estado:** Aceptado
* **Fecha:** 2026-10-28
* **Decisores:** Equipo de Arquitectura y Desarrollo Frontend
* **Contexto Técnico:** Astro v7 (SSG & Cloudflare Server Island), Tailwind CSS v4, Preact Islands

---

## 1. Contexto del Problema

Antes de esta migración, la iconografía del proyecto presentaba una arquitectura fragmentada y acumulaba deuda técnica significativa en varios frentes:

1. **SVGs sueltos inyectados dinámicamente con `set:html`:**
   - En `src/assets/icons/` existían múltiples archivos SVG individuales (`book.svg`, `chart.svg`, `cloud.svg`, `database.svg`, `globe.svg`, `lightbulb.svg`, `link.svg`, `monitor.svg`, `refresh.svg`).
   - Estos archivos se importaban en [ServicesSection.astro](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/components/ServicesSection.astro) usando la sintaxis cruda de Vite `?raw` y se mapeaban en un diccionario estático en memoria (`iconMap`).
   - Para su renderizado en [ServiceCard.astro](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/components/ServiceCard.astro), se empleaba la directiva `set:html={icon}` de Astro, lo cual representaba un riesgo de inyección HTML/XSS innecesario y obligaba a manipular strings de SVG crudos.

2. **Riesgo y dependencia de CDNs externos:**
   - Determinadas páginas de aterrizaje (como landings de ventas) habían llegado a depender de enlaces a CDNs externos (ej. `cdn.jsdelivr.net`) para cargar hojas de estilo de fuentes de iconos, lo que introducía puntos únicos de fallo en red (SPOF), latencias externas impredecibles y problemas de cumplimiento de privacidad/GDPR.

3. **Inconsistencia entre Astro y Preact Islands:**
   - Componentes interactivos como el formulario de contacto [ContactForm.tsx](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/components/ContactForm.tsx) mantenían SVGs inline hardcodeados con paths y animaciones CSS manuales (ej. el spinner de carga), duplicando estilos y rompiendo la coherencia visual del sistema de diseño.

4. **Falta de tipado e i18n simétrico en el catálogo de servicios:**
   - [services.json](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/data/services.json) utilizaba identificadores semánticos arbitrarios (`monitor`, `refresh`, `link`) que dependían de un diccionario manual en el componente de presentación. Si un servicio cambiaba de nombre de icono en un idioma (`es` vs `en`), el renderizado fallaba silenciosamente o quedaba en blanco.

---

## 2. Alternativas Evaluadas

Se analizaron formalmente tres opciones técnicas principales:

| Criterio | Opción A: `@phosphor-icons/web` (Elegida) | Opción B: `astro-icon` | Opción C: Componentes dedicados (`phosphor-astro` / `@phosphor-icons/react`) |
| :--- | :--- | :--- | :--- |
| **Arquitectura de Renderizado** | Clases CSS utilitarias (`<i class="ph ph-*"></i>`) respaldadas por web fonts (.woff2) | Componente Astro (`<Icon name="..." />`) que inyecta sprites SVG en tiempo de compilación | Wrappers de componentes en formato JSX/TSX o Astro |
| **Compatibilidad con Preact** | **100% nativa**: La misma sintaxis de clases `<i class="ph-bold ...">` funciona en TSX sin hydration adicional | **Incompatible dentro de TSX**: Los componentes `.astro` no pueden ser importados dentro de islas Preact | **Fragmentada**: Obliga a instalar dos paquetes distintos (`phosphor-astro` para Astro y `@phosphor-icons/react` para Preact) |
| **Impacto en Client Hydration** | **Cero bytes JS**: Todo se gestiona mediante CSS estático y web fonts | Cero JS en Astro, pero no soluciona el icono de carga en Preact sin JS extra | Aumento innecesario en el tamaño del bundle JS en islas Preact |
| **Seguridad de Renderizado** | **Máxima**: Se elimina por completo `set:html`; interpolación segura de atributos class | **Alta**: Inyección segura de SVGs compilados | **Alta**: Componentes virtuales seguros |
| **Manejo de Assets y Bundling** | **100% Local**: Vite empaqueta fuentes `.woff2` con hashes inmutables | Generación de sprites SVG locales | SVG inline embebidos en el código generado |

### Justificación de la Elección
Se seleccionó **`@phosphor-icons/web`** debido a que:
- Permite una única convención universal para todo el repositorio (funciona con idéntica sintaxis en templates puros de Astro y en componentes de cliente Preact).
- Garantiza **cero hydration de JavaScript**: no añade dependencias en runtime al cliente.
- Las fuentes web se empaquetan y optimizan automáticamente con Vite en la carpeta `dist/client/_astro/` bajo encabezados `Cache-Control` inmutables.
- Elimina vectores de vulnerabilidad al descartar de raíz `set:html`.

---

## 3. Decisión Adoptada

1. **Adopción de paquete local:** Instalar y versionar `@phosphor-icons/web` en [package.json](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/package.json).
2. **Importación de estilos en el bundle global:** Incluir en [global.css](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/styles/global.css) los pesos tipográficos requeridos por el sistema de diseño:
   ```css
   @import "@phosphor-icons/web/regular";
   @import "@phosphor-icons/web/bold";
   @import "@phosphor-icons/web/fill";
   ```
3. **Eliminación total de SVGs heredados:** Eliminar el directorio `src/assets/icons/` y los 9 archivos SVG sueltos.
4. **Estandarización del esquema de datos:** Actualizar [services.json](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/data/services.json) para que la propiedad `icon` almacene clases canónicas de Phosphor (`ph-desktop`, `ph-globe`, `ph-plugs-connected`, `ph-arrows-clockwise`, `ph-database`, `ph-lightbulb`, `ph-cloud-arrow-up`, `ph-chart-bar`, `ph-book-open`) garantizando simetría estricta 1:1 entre los catálogos `es` y `en`.
5. **Refactorización de componentes:**
   - [ServiceCard.astro](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/components/ServiceCard.astro): Renderiza `<i class={`ph ${icon} text-2xl`}></i>` sin `set:html`.
   - [ServicesSection.astro](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/components/ServicesSection.astro): Pasa el icono directamente sin tablas de mapeo ni imports `?raw`.
   - [ContactForm.tsx](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/components/ContactForm.tsx): Reemplaza el SVG de spinner inline por `<i class="ph-bold ph-circle-notch animate-spin text-base"></i>`.
6. **Erradicación de CDNs:** Prohibir el uso de CDNs externos (ej. jsDelivr) para iconografía en [sistemas-de-ventas.astro](file:///C:/Users/elvat/Documents/Dev/1_Trabajo/landing-consulting/src/pages/sistemas-de-ventas.astro) y cualquier otra página del sitio.

---

## 4. Consecuencias Técnicas

### Positivas
- **Seguridad Robusta:** Eliminación absoluta de `set:html` en el pipeline de iconos. Se previene la inyección de código arbitrario.
- **Rendimiento y Zero Hydration:** Cero impacto en el tiempo de ejecución de JavaScript en el cliente para iconos estáticos.
- **Autonomía y Resiliencia de Red:** Ninguna llamada hacia servidores o CDNs de terceros; el sitio es 100% autónomo y seguro frente a bloqueadores de rastreadores o caídas de CDNs.
- **Caché Inmutable:** Las fuentes de iconos (`.woff2`) reciben hashes de Vite y son cacheadas de forma inmutable por Cloudflare (`Cache-Control: public, max-age=31536000, immutable`).
- **Mantenibilidad y Simetría i18n:** El catálogo de servicios bilingüe es consistente y validado automáticamente mediante pruebas de regresión y caos.

### Consideraciones y Mitigaciones
- **Tamaño de fuentes web:** Al importar `regular`, `bold` y `fill`, se descargan las fuentes `.woff2` respectivas. Debido a que `.woff2` ofrece una compresión superior (pocos kilobytes) y se cachea de por vida en el navegador del cliente tras la primera visita, el impacto en Core Web Vitals (LCP/CLS) es insignificante y significativamente menor que importar múltiples SVGs duplicados o frameworks JS pesados.
