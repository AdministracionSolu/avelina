# Contrato de las páginas para artistas de avelina.com.mx

24-nov-2026, decisión de Diego: avelina.com.mx lleva la misma estrategia de páginas fijas que Aliviane y Pilsi, pero
**sólo con lo que le sirve a músicos y artistas** y escrito para ellos. Son **82 páginas** (`lista.json`): QR, link
de WhatsApp, flyers y carteles de tocada, redes, logos, paletas, cobros, cotización y factura, aviso de privacidad,
dominio y sitio web, Google, marketing y marca. Quedan fuera las de restaurantes, tiendas y giros que no son de artistas.

Cada página cierra con el bloque de venta en voz de Ave: hace sitios para artistas desde Pilsi, **$1,500 con dominio
incluido** y $99 al mes. «Pide una demo» lleva a `pilsi.art/demo?c=av-<slug>` (Ave la ve en el admin de Pilsi →
Demos, marcada «avelina.com.mx»). Ese bloque lo pone `lib.mjs`: no se escribe en el JSON.

Generar: `node fuente/paginas-web/generar.mjs` (escribe `<carpeta>/<slug>/index.html`, `paginas_sitemap.txt` y
pone el sitemap al día; `fuente/build.py` suma esa lista cuando rehace el sitio). Pruebas:
`node fuente/paginas-web/probar.mjs [--solo a,b]`. Ver: `node fuente/paginas-web/generar.mjs --borradores /tmp/x`.

## Reglas que no se rompen

1. **Nunca se menciona Aliviane** ni sus datos ni su portafolio (La Ola, Comprafin, Makatea, SignSolú, Solú, Agroqs,
   Rodrigo, el 311 122 3365, diego@). **Pilsi sí se puede nombrar**: es de Ave.
2. **Texto propio.** Hay tres versiones del mismo tema en tres dominios: Aliviane (`~/aliviane/fijas/paginas/<id>.json`),
   Pilsi (`~/pilsi-espejo/paginas-fijas/paginas/<id>.json`) y ésta. La prueba truena si esta comparte más de 25% de
   sus frases de 5 palabras con cualquiera de las otras dos (sin contar tablas).
3. **Para artistas de principio a fin.** El ejemplo, los pasos y las preguntas piensan en quien toca, canta, compone,
   pinta, ilustra, tatúa, fotografía o baila. Un QR es para el flyer de la tocada, una cotización es para una boda o un
   evento, un logo es para la banda o el estudio, una factura es por honorarios de un show. Mismos datos y mismas
   fuentes que la página base. Nada que no sea cierto para un artista.
4. **Voz.** Tuteo, español de México (Avelina es sólo México). La primera persona de Ave sólo para lo que es verdad:
   es cantautora, canta y toca guitarra, sube covers, escribe cartas, lleva Pilsi y hace sitios para artistas. **No
   inventes anécdotas** («yo pegué este QR en mi tocada»). Si dudas, escribe en segunda persona.
5. **Escritura de Ave:** encabezados sin punto final, sin raya larga, sin punto y coma, sin signos de admiración, sin
   enumeraciones de tres cosas separadas por comas al cierre de frase. Frases de 8 a 15 palabras, una coma por frase.

## Campos

Mismo formato que Pilsi (`~/pilsi-espejo/paginas-fijas/CONTRATO.md`) y Aliviane (`~/aliviane/fijas/CONTRATO.md`):
`id, slug, molde, cabeza, busquedas, categoria, categoriaApp, herramienta, fuentes, serp` se copian de Aliviane.
`relacionadas`: 3 a 6 ids **de `lista.json` de Avelina** (la de Aliviane trae ids que aquí no existen).
Redactados de nuevo: `title` (≤ 58, empieza con la cabeza), `h1`, `description` (140-160), `resumen`, `respuesta`,
`cuerpo`, `faqs`, `venta.puente`, `venta.aviso`, `venta.titulo`, `venta.tituloCorto`. `artista` es opcional aquí
(toda la página ya es para artistas); si lo usas, que sea un segundo ejemplo de otra disciplina.
Fechas `creada`/`actualizado`/`publicacion` = `"2026-11-24"`, `revisada` = `"2026-11"` si lleva cifras.
`nota` = «Tercera versión (artistas) de la página de Aliviane, 24-nov-2026».

Ligas internas con `[texto](id:<otra>)` o a páginas de Avelina que existen (`/quien-soy/`, `/covers/`, `/guitarra/`,
`/afinador-de-guitarra/`, `/musica/`, `/contacto/`). A Pilsi: `https://pilsi.art/paquetes` o `https://pilsi.art/directorio`.
