# avelina.com.mx

Sitio de Avelina. Se publica solo con GitHub Pages: todo lo que llegue a la rama `main` sale en https://avelina.com.mx en 1 o 2 minutos.

## Cómo editar
El sitio se genera con `fuente/build.py` (Python, sin dependencias). No edites a mano los `index.html`: se sobrescriben.
1. Cambia textos, videos o fotos en `fuente/build.py`. Estilos en `css/sitio.css`, interacción en `js/sitio.js`.
2. Corre `python3 fuente/build.py` desde la raíz del repo.
3. `git add -A && git commit -m "lo que cambiaste" && git push`

- **Video de presentación:** cambia `PRESENTACION` por el id de YouTube y guarda su miniatura en `img/videos/<id>.webp`.
- **Nuevo video o entrada del diario:** agrega una línea al inicio de `VIDEOS`. `musica=1` lo pone en el mosaico y `pared=1` en la pared.
- **HTTPS:** cuando el certificado funcione, cambia `BASE` a `https://www.avelina.com.mx` y vuelve a generar.
- **Tipografías:** Amatic SC y Newsreader suplen a Glypher y Karumbi del manual. Si tienes los archivos de las originales, se cambian en `css/sitio.css`.

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
