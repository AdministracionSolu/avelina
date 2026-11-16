# Contrato de las fijas de avelina.com.mx

Las fijas son páginas de búsqueda que viven en la raíz del sitio (`/carta-para-mi-mama/`, `/afinador-de-guitarra/`…).
Todo se arma con Python de la biblioteca estándar. Nada de esta carpeta (`fuente/`) se publica: la Action de Netlify la excluye.

## Archivos
| Archivo | Qué es |
|---|---|
| `paginas/<slug>.json` | Los datos y el texto de una fija. El nombre del archivo es su slug. |
| `generar.py` | Corre las pruebas y escribe el HTML de las **publicadas** + el sitemap. `--vista` escribe todas en `_vista/` (ignorada por git). |
| `agrupar.py` | Agrupa `avelina_SIEMPRE.csv` en páginas → `LISTA_CONSTRUIR.csv` y `descartadas_construccion.csv`. Truena si una cabeza queda sin destino. |
| `esqueletos.py` | Crea un JSON esqueleto por cada página de la lista que aún no se escribe (aparta el slug). |
| `reportes.py` | Rehace `COVERS_A_GRABAR.md` y `AVANCE.md`. |
| `fijas_sitemap.txt` | Lo escribe `generar.py`; `build.py` lo lee para no borrar las fijas del sitemap. |
| `/css/fijas.css`, `/js/afinador.js`, `/js/postal.js`, `/js/letra-bonita.js` | Estilo y herramientas. Cada página carga sólo el JS que usa. |
| `/fonts/oooh-baby.ttf` | Letra OFL del generador de letra bonita (licencia en `fonts/oooh-baby-licencia.txt`). |

## La bandera de publicación
Una fija se escribe en `/<slug>/index.html` y entra al sitemap **sólo si** se cumplen todas:
- `"estado": "publicada"` (lo pone quien publica, después de que Diego diga «publica»),
- `"publicar_desde"` vacío o una fecha de hoy o antes,
- no es esqueleto ni tiene `espera_texto` (un cover o artista **sin video sí se publica**, ver abajo),
- todas sus hermanas también están publicadas (si no, la liga daría 404 y la prueba truena).

Un borrador no genera HTML: la ruta da 404 y no aparece en el sitemap. Si una página publicada vuelve a borrador,
`generar.py` borra su HTML (sólo borra archivos con la marca `<!-- fija:generada -->`).
El índice de cada colección (`/covers/`, `/cartas/`, `/afinadores/`…) se arma solo y se publica cuando tiene 3 fijas publicadas.

Para publicar: cambia `estado`, corre `python3 fuente/fijas/generar.py`, revisa, commit y push a `main`.
Después de publicar: Search Console, IndexNow (la llave ya está en la raíz) y ligar la nueva fija desde una página ya indexada.

## Campos de una página
Obligatorios: `slug, estado, tipo, coleccion, cabeza, title, description, h1, respuesta, secciones, hermanas`.
Opcionales: `variantes, volumen, revisada (AAAA-MM-DD), resumen, faq, fuentes, cover, espera_video, espera_texto, publicar_desde`.
- `tipo`: cover, artista, herramienta, carta, lista, guia, marca, fe.
- `secciones`: `[{"h2": "...", "bloques": [...]}]`. Un bloque es texto, o `{"lista": [...]}`, `{"pasos": [...]}`,
  `{"tabla": {"cab": [...], "filas": [[...]]}}`, `{"carta": {"para", "texto", "firma"}}`, `{"nota": "..."}`,
  `{"herramienta": {"tipo": "afinador" | "postal" | "letra-bonita", ...}}`.
- Dentro del texto sólo hay `[texto](/ruta/)` y `**negritas**`.
- `cover`: `{"cancion", "artista", "compositor": [...], "credito", "nota", "video": {"id", "fecha", "cancion"}}`. Sin `video`, la página
  lleva `"espera_video": true` y **sí se publica** (decisión de Diego, 15-nov). `video.cancion` sólo hace falta en páginas de artista.

## Covers sin video y cuando Ave sube el video
Mientras no hay video, la postal del cover no lleva reproductor: dice en su voz «Mi versión de <canción> a guitarra y voz
viene pronto» (en artistas: «Mis covers de <artista> … vienen pronto»), «El día que salga te escribo en las Cartas de una
foránea» y un botón **Avísame cuando salga** que baja a la forma de cartas de la misma página (así el correo guarda de
qué página llegó). No hay `VideoObject` en el marcado. El JSON se escribe pensando en el video ya puesto; `generar.py`
cambia al vuelo las frases de `SIN_VIDEO` (p. ej. «lleva mi versión en video» → «mi versión en video viene pronto») y
una prueba truena si queda alguna promesa de un video que no existe.

**Cuando Ave sube el video, la página se completa sola:**
1. En `paginas/<slug>.json` agrega `"video": {"id": "<id de YouTube>", "fecha": "AAAA-MM-DD"}` dentro de `cover`
   (en una página de artista agrega también `"cancion": "<qué canción cantó>"`) y **borra** `"espera_video": true`.
2. Guarda la miniatura en `img/videos/<id>.webp` (la prueba truena si falta).
3. `python3 fuente/fijas/generar.py`, commit y push. Sale el reproductor, el `VideoObject` y las frases originales del JSON.

## Pruebas que truenan (no se escribe nada si falla una)
- Slug válido, único, igual al nombre del archivo, sin chocar con rutas del sitio ni índices.
- Title de 58 caracteres o menos y sin punto final. Description de 140 a 160. Encabezados sin punto final.
- La respuesta de arriba con 2 a 4 frases. Entre 3 y 6 hermanas, todas existentes y nunca ella misma.
- Toda liga interna `[x](/ruta/)` apunta a una ruta del sitio o a una fija.
- Palabras prohibidas (muletillas de 1.4, el stack, «no necesitas», la raya larga y el punto y coma).
- Texto en inglés dentro de la página.
- **Ninguna letra de canción ajena**: en covers, artistas y listas truena cualquier cita entre comillas de más de 7
  palabras y cualquier campo `letra`, `estrofa` o `coro`. La regla de fondo es humana: nunca se copia una letra ajena,
  ni en partes.
- Publicada sin fuentes (cover, artista, fe) o con menos de 3 hermanas publicadas. Sin video: texto que prometa un video.
- Con video: falta la miniatura, o sigue marcada `espera_video`.
Avisos (no truenan): title que no empieza con la cabeza, frases de más de 28 palabras.

## Lo que lleva cada fija (molde 1.1 a 1.7)
- Title con la cabeza al principio. H1 corto. Respuesta de 2 a 4 frases, párrafo normal. «Revisada en» cuando hay cifras.
- Marcado: `BreadcrumbList`, `WebPage` (es-MX, fechas, autora), `FAQPage` sólo con las preguntas visibles,
  `WebApplication` precio 0 en herramientas, `MusicComposition` en covers y `VideoObject` cuando hay video. Nunca `aggregateRating`.
- Open Graph con `img/og/<slug>.jpg` si existe; si no, `img/compartir.jpg`.
- Al final, «Sigue leyendo» con sus hermanas, el botón a `/musica/?c=f-<slug>` (medición) y la forma de las Cartas de una foránea.
- Voz de Ave en primera persona sólo con lo que es cierto y tiene fuente (su bio, sus videos, sus canciones).
  **Nada inventado sobre Ave**: ni gustos, ni recuerdos, ni opiniones que ella no haya dicho.
- Diseño anti-IA: aire en vez de líneas, sin sombras nuevas, sin iconos de librería. La ventana del afinador lleva barra estilo Windows.
- Peso: cada fija es un archivo; el JS de herramientas pesa menos de 10 KB y sólo carga donde se usa.

## Vista previa
`python3 fuente/fijas/generar.py --vista` y luego `python3 -m http.server -d . 8765` desde la raíz:
`http://localhost:8765/fuente/fijas/_vista/<slug>/`. La vista lleva `noindex` y nunca sube a git.
