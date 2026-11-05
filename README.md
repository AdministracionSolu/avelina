# avelina.com.mx

Sitio de Avelina. Se publica solo con GitHub Pages: todo lo que llegue a la rama `main` sale en https://avelina.com.mx en 1 o 2 minutos.

## Cómo editar
El sitio se genera con `fuente/build.py` (Python, sin dependencias). No edites a mano los `index.html`: se sobrescriben.
1. Cambia textos, videos o fotos en `fuente/build.py`. Estilos en `css/sitio.css`, interacción en `js/sitio.js`.
2. Corre `python3 fuente/build.py` desde la raíz del repo.
3. `git add -A && git commit -m "lo que cambiaste" && git push`

- **Video de presentación:** cambia `PRESENTACION` por el id de YouTube y guarda su miniatura en `img/videos/<id>.webp`.
- **Nuevo video o entrada del diario:** agrega una línea al inicio de `VIDEOS`. `mia=1` lo pone en Mis canciones y Mis letras, `musica=1` en Covers y `pared=1` en la pared.
- **Baúl de mi alma:** guarda `img/fotos/<nombre>.webp` y `<nombre>-chica.webp` y agrégalo a `BAUL`.
- **Marca:** el «Avelina» bordado, las telas y los marcos salen de `fuente/generar_marca.py` (pide pillow y numpy). Están dibujados con código y no usan imágenes de referencia, que son de otros autores.
- **HTTPS:** el dominio principal es `avelina.com.mx` (sin www), que tiene certificado válido. Si cambias `CNAME` a www, el sitio vuelve a marcar «no seguro» hasta que exista certificado para www.
- **Cartas:** los correos se guardan en Supabase, proyecto AvPiPro, tabla `cartas_avelina`. Se ven en el panel de Supabase (Table Editor). Desde el sitio solo se puede agregar. La llave secreta nunca va en este repo, que es público.
- **Latido:** `.github/workflows/latido-supabase.yml` toca la base dos veces por semana para que el plan gratis no la pause.
- **Tipografías:** Sedgwick Ave (títulos) y Kalam (textos), ambas gratis con licencia OFL, suplen a Belmonte Ballpoint. Si se compra Belmonte con licencia web, se agrega su `@font-face` y se cambian `--mano` y `--texto` en `css/sitio.css`.

## No borrar
- `CNAME`: le dice a GitHub que el sitio vive en avelina.com.mx. Si se borra, el dominio deja de funcionar.
- `.nojekyll`: hace que GitHub publique los archivos tal cual.

## Dónde está cada cosa
- **Código y publicación:** este repo (GitHub Pages, rama `main`, carpeta raíz).
- **Dominio y DNS:** registrado en WordPress.com, en la cuenta de Diego. Apunta a GitHub Pages con:
  - `A @` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  - `CNAME www` → administracionsolu.github.io
  Cualquier cambio de DNS (correo con el dominio, etc.) se lo pides a Diego.
- No hay claves ni contraseñas: no hacen falta. Con ser colaboradora del repo basta para editar y publicar.

Si quieres pasar a un framework (Astro, Next, Vite), se puede: hay que cambiar Pages a "GitHub Actions" en Settings → Pages y agregar el workflow de build.
