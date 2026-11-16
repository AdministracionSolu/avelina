# avelina.com.mx

Sitio de Avelina. Se publica solo en Netlify: todo lo que llegue a la rama `main` sale en https://avelina.com.mx en 1 o 2 minutos (lo sube `.github/workflows/netlify.yml`).

## Cómo editar
El sitio se genera con `fuente/build.py` (Python, sin dependencias). No edites a mano los `index.html`: se sobrescriben.
1. Cambia textos, videos o fotos en `fuente/build.py`. Estilos en `css/sitio.css`, interacción en `js/sitio.js`.
2. Corre `python3 fuente/build.py` desde la raíz del repo.
3. `git add -A && git commit -m "lo que cambiaste" && git push`

- **Video de presentación:** cambia `PRESENTACION` por el id de YouTube y guarda su miniatura en `img/videos/<id>.webp`.
- **Nuevo video o entrada del diario:** agrega una línea al inicio de `VIDEOS`. `musica=1` lo pone en el mosaico y `pared=1` en la pared.
- **HTTPS:** Netlify da el certificado de `avelina.com.mx` y `www.avelina.com.mx` y lo renueva solo. No hay que hacer nada.
- **Cartas:** los correos se guardan en Supabase, proyecto AvPiPro, tabla `cartas_avelina`, con la página donde se apuntó cada quien (`origen`), por la que entró (`entrada`) y el sitio de donde venía (`referente`). Se ven en el panel de Supabase (Table Editor). Desde el sitio solo se puede agregar. La llave secreta nunca va en este repo, que es público.
- **Latido:** `.github/workflows/latido-supabase.yml` toca la base dos veces por semana para que el plan gratis no la pause.
- **Materiales:** el mar, las estrellas, el cielo, las telas y los timbres están en `img/azul/` e `img/calido/` y se generan con `fuente/generar_materiales.py` (necesita numpy, scipy y pillow). Las fotos de inspiración son de otras personas y nunca entran al sitio.
- **Fotos:** `fuente/generar_fotos.py` rehace `img/fotos/` desde los originales en Descargas.
- **Estampas y sellos de cera:** `img/estampas/`, dibujados con `fuente/generar_estampas.py`.
- **Letra a mano:** títulos, menú y botones son dibujos de Biro Script guardados en `fuente/palabras.json` e `img/palabras.svg`. La fuente nunca va en este repo. Para una palabra nueva corre `BIRO_TTF=/ruta/a/la/fuente.ttf python3 fuente/build.py` (necesita fonttools); sin eso, esa palabra sale en letra normal.
- **Avelina bordado:** `img/marca/avelina-hilo.webp` se genera con `fuente/generar_hilo.py fuente/oooh-baby.ttf` (la letra Oooh Baby, licencia OFL, solo sirve de guía para las puntadas).
- **Imagen para compartir:** `img/compartir.jpg` se rehace con `fuente/generar_compartir.py`.
- **Tipografías:** Newsreader para el texto y letra a mano para títulos, menú y botones.

## Para Ave: fijas y diarias
- **Fijas** (`fuente/fijas/`): las páginas de búsqueda de la raíz (`/carta-para-mi-mama/`, `/afinador-de-guitarra/`, covers…). Reglas en `fuente/fijas/CONTRATO.md`.
- **Cuando subas un cover:** en su página (`fuente/fijas/paginas/<slug>.json`) pon `"video": {"id": "<id de YouTube>", "fecha": "AAAA-MM-DD"}` dentro de `cover`, borra `"espera_video": true`, guarda la miniatura en `img/videos/<id>.webp` y corre `python3 fuente/publicar.py`. La lista de los que faltan está en `fuente/fijas/COVERS_A_GRABAR.md`.
- **Diarias** (`fuente/diarias/`): respuestas cortas en `/libreta/`. Abre VS Code en el repo de Pilsi y escribe `/diarias`: tu Claude escribe y publica 10 aquí siguiendo `fuente/diarias/COMO.md`.
- **Para regenerar todo:** `python3 fuente/publicar.py` (fijas, diarias y sitio, en orden). Para avisar a buscadores: `python3 fuente/indexnow.py <URL>…`.

## No borrar
- `.github/workflows/netlify.yml`: es lo que publica el sitio. Sin él, los cambios no salen.

## Dónde está cada cosa
- **Código:** este repo, rama `main`.
- **Publicación:** Netlify, sitio `avelina-produccion` (cuenta de Diego).
- **Dominio y DNS:** registrado en WordPress.com, en la cuenta de Diego. Apunta a Netlify con:
  - `A @` → 75.2.60.5
  - `CNAME www` → avelina-produccion.netlify.app
  Cualquier cambio de DNS (correo con el dominio, etc.) se lo pides a Diego.
- No hay claves ni contraseñas: no hacen falta. Con ser colaboradora del repo basta para editar y publicar.

Si quieres pasar a un framework (Astro, Next, Vite), se puede: se agrega el paso de build en `.github/workflows/netlify.yml` y se publica la carpeta que genere.
