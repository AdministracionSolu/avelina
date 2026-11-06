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
- **Cartas:** los correos se guardan en Supabase, proyecto AvPiPro, tabla `cartas_avelina`. Se ven en el panel de Supabase (Table Editor). Desde el sitio solo se puede agregar. La llave secreta nunca va en este repo, que es público.
- **Latido:** `.github/workflows/latido-supabase.yml` toca la base dos veces por semana para que el plan gratis no la pause.
- **Materiales:** el mar, las estrellas, el cielo, las telas y los timbres están en `img/azul/` e `img/calido/` y se generan con `fuente/generar_materiales.py` (necesita numpy, scipy y pillow). Las fotos de inspiración son de otras personas y nunca entran al sitio.
- **Fotos:** `fuente/generar_fotos.py` rehace `img/fotos/` desde los originales en Descargas.
- **Tipografías:** Amatic SC y Newsreader suplen a Glypher y Karumbi del manual. Si tienes los archivos de las originales, se cambian en `css/sitio.css`.

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
