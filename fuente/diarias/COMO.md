# Cómo escribir y publicar las diarias de Avelina

**Para el Claude de Ave.** Lo llama el comando `/diarias` del repo de Pilsi, que trabaja con este repo en `../avelina`.
Cada vez que se corre: **10 diarias de Avelina, publicadas**, tomadas en orden de `fuente/diarias/cola.csv`.
Todo con Python de la biblioteca estándar (`python3`), `git`, `curl` y `openssl`. Nada de pago.

## Qué es una diaria (y qué no)

- Contesta **una sola búsqueda larga** de la cola (columna `intencion`), en **150 a 900 palabras**. Es más corta que una fija.
- Vive en **`/libreta/<slug>/`** (la sección «La libreta»). Un archivo por página: `fuente/diarias/paginas/<slug>.json`.
- Liga a **2 o 3 fijas publicadas** (empieza por `fijas_sugeridas` de la cola). Nunca a una página sin publicar.
- No repite una fija. Si la búsqueda ya la contesta una fija (su cabeza o una variante), no se escribe: en la cola va
  `estado` = `fuera` con la razón en `nota`.

## Paso a paso

1. **Al día.** `cd ../avelina && git pull`. Si no existe: `gh repo clone AdministracionSolu/avelina ../avelina`.
2. **¿Alcanza la cola?** Cuenta las filas con `estado` = `pendiente` en `fuente/diarias/cola.csv`. Si hay **menos de 30**,
   rellénala primero (sección «Rellenar la cola»).
3. **Toma las 10 primeras pendientes**, en orden. Antes de escribir cada una, salta (y marca `fuera` con su razón) las que:
   ya contesta una fija, piden letra de una canción, son de alabanzas o de fe, piden agenda o directorio de lugares
   (conciertos, bares, clases cerca de mí) o contratar a alguien (eso decide Diego). Toma la siguiente para completar 10.
4. **Investiga.** Lee 2 o 3 fuentes buenas (Wikipedia, el sitio del artista, prensa seria, una institución de salud para
   la voz). Anota cada dato con su URL. **Si un dato no tiene fuente, no va.** Lee también la fija a la que vas a ligar:
   muchas ya traen datos con fuente (`fuente/fijas/paginas/<slug>.json`).
5. **Escribe el JSON** en `fuente/diarias/paginas/<slug>.json` (molde abajo). El `slug` es el de la cola.
6. **Pruebas.** `python3 fuente/diarias/generar.py --pruebas`. Si truena, arregla y repite. No se publica con errores.
7. **Publica.** `python3 fuente/publicar.py` (regenera fijas, diarias, portada, pies y sitemap, en ese orden).
8. **Cola al día.** En `cola.csv`, a cada una: `estado` = `publicada`, `publicada` = la fecha, `nota` = `/libreta/<slug>/`.
9. **Sube.** `git add -A && git commit -m "Diarias <fecha>: 10 en la libreta" && git push` (en `main`; Netlify publica solo
   en 1 o 2 minutos).
10. **Comprueba en vivo** cuando termine el despliegue (`gh run list --limit 1` dice `completed success`): cada URL nueva
    responde 200 (`curl -s -o /dev/null -w "%{http_code}" https://avelina.com.mx/libreta/<slug>/`) y aparece en
    `https://avelina.com.mx/sitemap.xml`.
11. **Avisa a IndexNow:** `python3 fuente/indexnow.py https://avelina.com.mx/libreta/<slug>/ …` (las 10 y `/libreta/`).
12. **Search Console (opcional, si Ave está presente):** pedir indexación de las 10 con su cuenta (el cupo es de unas
    10 por día).
13. Anota el día en la bitácora (`docs/motor/diarias/BITACORA.md` del repo de Pilsi) y dile a Ave qué publicaste, con las ligas.

## Su voz

- **Primera persona, cálida y directa,** como quien escribe una carta. Frases cortas. Instrucciones directas («Escoge»,
  «Grábate»), nunca «no necesitas…». De tú.
- Ave es **cantautora**, nacida en un pueblo pequeño de **Sonora**, de familia de campo, y hoy **foránea en Monterrey**.
  Toca guitarra desde niña, sus canciones nacen **improvisando** sola con la guitarra y **canta lo que escribe**. Sube
  covers a guitarra y voz a su canal de YouTube. Le inspiran Kevin Kaarl, Ed Maverick, Carla Morrison, Sleeping At Last,
  Natalia Lafourcade y Silvana Estrada. **Eso es todo lo que se sabe de ella.**
- **Nada inventado sobre Ave:** ni gustos, ni recuerdos, ni opiniones, ni que canta tal canción o en tal evento. Si
  quieres meter su voz, usa sólo lo de arriba. Si no cabe, la diaria va sin primera persona y está bien.
- **Nada inventado sobre nadie:** años, discos, premios, autores, todo con fuente.
- **Cero letra ajena.** Nunca se copia la letra de una canción, ni un pedazo. Puedes decir de qué trata con tus palabras.
  La prueba truena con cualquier cita de más de 7 palabras entre comillas y con un campo `letra`, `estrofa` o `coro`.
- Prohibido (la prueba truena): punto y coma, raya larga, «simple», «sin duda», «a continuación», «sumérgete»,
  «en el mundo de», «no necesitas», nombres de herramientas o de tecnología del sitio, y texto en inglés.
- Encabezados sin punto final. Sin listas de tres adjetivos separados por comas.

## Molde del JSON

```json
{
 "slug": "canciones-para-el-vals-de-boda",
 "estado": "publicada",
 "fecha": "2026-11-15",
 "cola": "canciones-para-el-vals-de-boda",
 "busqueda": "canciones para el vals de boda",
 "variantes": ["canciones para el vals", "vals para boda"],
 "title": "Canciones para el vals de boda: clásicos y en español",
 "description": "De 140 a 160 caracteres, empieza con la búsqueda y dice qué trae la página.",
 "h1": "Canciones para el vals de boda",
 "resumen": "Una línea para la tarjeta del índice.",
 "respuesta": "La respuesta directa, de 2 a 4 frases. Es lo primero que se lee.",
 "secciones": [
  {"h2": "Un encabezado sin punto", "bloques": ["Un párrafo con [liga a una fija](/canciones-para-boda/) y **negritas**.",
    {"lista": ["Un punto.", ["Con título:", "y explicación."]]},
    {"pasos": ["Primero.", "Después."]},
    {"tabla": {"cab": ["Canción", "Autor", "Dato"], "filas": [["[Bésame mucho](/besame-mucho/)", "Consuelo Velázquez", "Se publicó en 1940"]]}},
    {"nota": "Nota en cursiva."}]}
 ],
 "ligas": ["canciones-para-boda", "besame-mucho", "sabor-a-mi"],
 "fuentes": [{"t": "Sobre las olas, Wikipedia en español", "url": "https://es.wikipedia.org/wiki/Sobre_las_olas"}]
}
```

- `title`: 58 caracteres o menos, empieza con la búsqueda, sin punto final.
- `secciones`: de 1 a 4. `ligas`: de 2 a 3 slugs de fijas publicadas (salen abajo como «Para seguir»).
- Las ligas dentro del texto sólo pueden ir a rutas del sitio, a fijas o a otras diarias (`/libreta/<slug>/`).
- `faq` (opcional): `[{"q": "¿…?", "a": "…"}]`, sólo preguntas que de verdad contesta la página.
- El ejemplo completo de un día está en `fuente/diarias/lotes/dia_2026_11_15.py` (las primeras 10).

## La bandera de fecha

Una diaria se publica si `"estado": "publicada"` **y** `"fecha"` es hoy o antes (hora de la Ciudad de México). Con
fecha futura queda escrita pero sin HTML ni sitemap, y sale la primera vez que alguien corra `fuente/publicar.py` ese día
o después. Para quitar una: `"estado": "borrador"` y `publicar.py` borra su HTML.

## Rellenar la cola

`python3 fuente/diarias/rellenar_cola.py --ver` muestra candidatas; sin `--ver` las agrega al final de `cola.csv`.

- **Search Console:** con la cuenta de servicio de sólo lectura en `~/.secretos/avelina/search-console-lector.json`
  (la pide Diego si no está). Toma consultas de 4 palabras o más con 10 o más impresiones en 28 días que no tengan página.
  Su `volumen` son impresiones de Search Console y así queda anotado en `fuente`.
- **Autocompletado de Google:** a partir de las cabezas de las fijas publicadas, una llamada cada 3 segundos. Queda sin
  volumen: **nunca se inventa un volumen.**
- Ya filtra lo que existe (fijas, cola y `cola_fuera.csv`) y lo que no cabe (fe, letras, agenda, precios, clases).
  Revisa a mano las nuevas: una marca ajena (una tienda, otra página) o algo fuera de su voz se marca `fuera`.
  Agrupa las que piden lo mismo en una sola fila (`busquedas` separadas por « ; ») y llena `fijas_sugeridas`.

## Archivos

| Archivo | Qué es |
|---|---|
| `paginas/<slug>.json` | Una diaria |
| `generar.py` | Pruebas, HTML de las publicadas en `/libreta/<slug>/`, índice `/libreta/` y sitemap |
| `cola.csv` | Lo que falta escribir, en orden (`pendiente`, `publicada`, `fuera`) |
| `cola_fuera.csv` | Lo que se quedó fuera al armar la cola, con su razón |
| `armar_cola.py` | Armó la cola desde el planificador (15-nov-2026). No se vuelve a correr |
| `rellenar_cola.py` | Rellena la cola (Search Console y autocompletado) |
| `lotes/` | Los scripts con que se escribió cada día |
| `../publicar.py` | Regenera todo en orden |
| `../indexnow.py` | Aviso a IndexNow en tandas |
