# avelina.com.mx

Sitio de Avelina. Se publica solo con GitHub Pages: todo lo que llegue a la rama `main` sale en https://avelina.com.mx en 1 o 2 minutos.

## Cómo editar
1. Clona el repo en VS Code: `git clone https://github.com/AdministracionSolu/avelina.git`
2. Edita `index.html` (o agrega más páginas, CSS, imágenes; es un sitio estático).
3. `git add -A && git commit -m "lo que cambiaste" && git push`
4. Revisa el avance en la pestaña **Actions** del repo.

## No borrar
- `CNAME`: le dice a GitHub que el sitio vive en avelina.com.mx. Si se borra, el dominio deja de funcionar.

## Dónde está cada cosa
- **Código y publicación:** este repo (GitHub Pages, rama `main`, carpeta raíz).
- **Dominio y DNS:** registrado en WordPress.com, en la cuenta de Diego. Apunta a GitHub Pages con:
  - `A @` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  - `CNAME www` → administracionsolu.github.io
  Cualquier cambio de DNS (correo con el dominio, etc.) se lo pides a Diego.
- No hay claves ni contraseñas: no hacen falta. Con ser colaboradora del repo basta para editar y publicar.

Si quieres pasar a un framework (Astro, Next, Vite), se puede: hay que cambiar Pages a "GitHub Actions" en Settings → Pages y agregar el workflow de build.
