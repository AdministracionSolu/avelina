# Orden de publicación · fijas de Avelina

**15-nov-2026: Diego dijo «sube todas las fijas que ya hiciste».** Se publicaron las 112 escritas (olas 1 y 2, las que esperaban hermanas y los 60 covers y artistas, que salen con «mi versión viene pronto») más 7 índices. Sólo quedan sin publicar los esqueletos de abajo. Para publicar una ola: cambia `"estado": "publicada"` en sus JSON,
corre `python3 fuente/fijas/generar.py`, revisa el HTML servido (molde 1.9) y haz commit + push a `main`.
Una fija sólo se publica con 3 o más hermanas publicadas. Las ligas a páginas sin publicar salen como texto, nunca como 404.
Los índices de colección (`/cartas/`, `/afinadores/`, `/guitarra/`…) se publican solos al llegar a 3 fijas publicadas.

## Ola 1 · lista para publicar en cuanto Diego diga (no espera video ni texto de Ave)

Ordenadas por búsquedas al mes (cabeza + variantes). Se publican juntas porque se ligan entre sí.

| # | Página | Tipo | Búsquedas al mes |
|---|---|---|---|
| 1 | /afinador-de-guitarra/ | herramienta | 210,000 |
| 2 | /cartas-de-amor/ | carta | 81,000 |
| 3 | /carta-para-mi-mama/ | carta | 69,000 |
| 4 | /carta-para-mi-novio/ | carta | 60,000 |
| 5 | /feliz-cumpleanos-mama/ | carta | 60,000 |
| 6 | /carta-para-una-amiga/ | carta | 48,000 |
| 7 | /acordes-de-ukulele/ | guia | 39,000 |
| 8 | /feliz-cumpleanos-en-letra-bonita/ | herramienta | 39,000 |
| 9 | /feliz-cumpleanos-mi-amor/ | carta | 36,000 |
| 10 | /canciones-faciles-en-guitarra/ (nueva 15-nov, lote 9) | lista | 33,000 |
| 11 | /carta-para-mi-novia/ | carta | 33,000 |
| 12 | /feliz-cumpleanos-amiga/ | carta | 33,000 |
| 13 | /feliz-cumpleanos-sobrina/ | carta | 30,000 |
| 14 | /canciones-de-amor-en-espanol/ | lista | 24,000 |
| 15 | /carta-de-san-valentin/ | carta | 18,000 |
| 16 | /afinador-de-ukulele/ | herramienta | 15,000 |
| 17 | /canciones-para-cumpleanos/ (nueva 15-nov, lote 9) | lista | 15,000 |
| 18 | /canciones-para-mama/ | lista | 15,000 |
| 19 | /carta-del-dia-del-amor-y-la-amistad/ | carta | 15,000 |
| 20 | /carta-para-mi-mejor-amiga/ | carta | 15,000 |
| 21 | /canciones-para-dedicar/ | lista | 12,000 |
| 22 | /canciones-para-dedicar-a-mi-novio/ | lista | 12,000 |
| 23 | /canciones-para-dedicar-a-un-hijo/ (nueva 15-nov, lote 9) | lista | 12,000 |
| 24 | /como-tocar-guitarra/ | guia | 12,000 |
| 25 | /canciones-para-boda/ | lista | 9,600 |
| 26 | /acordes-de-guitarra-para-principiantes/ | guia | 9,000 |
| 27 | /afinador-de-bajo/ | herramienta | 9,000 |
| 28 | /afinador-de-bajo-quinto/ | herramienta | 9,000 |
| 29 | /carta-de-amor-a-mano/ | carta | 9,000 |
| 30 | /como-afinar-una-guitarra/ | herramienta | 9,000 |
| 31 | /canciones-para-dedicar-a-mi-hija/ (nueva 15-nov, lote 9) | lista | 6,000 |
| 32 | /canciones-para-una-amiga/ (nueva 15-nov, lote 9) | lista | 6,000 |
| 33 | /feliz-cumpleanos-para-hombre/ | carta | 6,000 |
| 34 | /afinador-de-violin/ | herramienta | 3,000 |
| 35 | /canciones-para-dedicar-a-mi-novia/ | lista | 3,000 |
| 36 | /canciones-para-papa/ | lista | 3,000 |
| 37 | /carta-para-mi-hija/ | carta | 3,000 |
| 38 | /cartas-para-amiga-secreta/ | carta | 3,000 |
| 39 | /feliz-cumpleanos-madrina/ | carta | 3,000 |
| 40 | /feliz-cumpleanos-para-dedicar/ | carta | 3,000 |
| 41 | /feliz-cumpleanos-para-mi/ | carta | 3,000 |

Total ola 1: 41 páginas, 1,032,600 búsquedas al mes.

## Escritas, pero aún sin 3 hermanas publicables

- /canciones-para-karaoke/ (lista, 27,600)
- /canciones-tristes-para-llorar/ (lista, 21,000)
- /musica-para-estudiar/ (lista, 15,000)
- /canciones-para-karaoke-mujer/ (lista, 6,900)
- /canciones-romanticas-de-los-80-en-espanol/ (lista, 6,000) · nueva 15-nov
- /cantautores/ (guia, 6,000)
- /foranea/ (marca, 6,000)
- /canciones-de-desamor/ (lista, 3,000)
- /carta-de-despedida/ (carta, 3,000)
- /musica-indie/ (guia, 3,000)
- /vocalizacion/ (guia, 3,000)

## Ola 2 · covers y artistas: se publican cuando Ave suba su video

Escritas y revisadas, sin letra. Cada una sale el día que su video esté en YouTube (ver `COVERS_A_GRABAR.md`).

| Página | Búsquedas al mes |
|---|---|
| /mon-laferte/ | 603,600 |
| /carla-morrison/ | 153,000 |
| /tu-falta-de-querer-mon-laferte/ | 96,000 |
| /cielito-lindo/ | 93,000 |
| /amor-eterno/ | 75,000 |
| /julieta-venegas/ | 69,000 |
| /sabor-a-mi/ | 63,000 |
| /natalia-lafourcade/ | 42,300 |
| /las-mananitas/ | 42,000 |
| /la-bikina/ | 36,000 |
| /ximena-sarinana/ | 36,000 |
| /ed-maverick/ | 33,000 |
| /kevin-kaarl/ | 33,000 |
| /las-mananitas-vicente-fernandez/ | 33,000 |
| /caloncho/ | 30,000 |
| /la-llorona/ | 30,000 |
| /silvana-estrada/ | 30,000 |
| /amarrame-mon-laferte/ | 12,000 |
| /nunca-es-suficiente/ | 12,000 |
| /ha-ash/ | 9,000 |
| /historia-de-un-amor/ | 9,000 |
| /mi-buen-amor-mon-laferte/ | 9,000 |
| /si-no-te-hubieras-ido/ | 9,000 |
| /si-tu-me-quisieras-mon-laferte/ | 9,000 |
| /sin-bandera/ | 9,000 |
| /el-sol-no-regresa-la-quinta-estacion/ | 6,300 |
| /besame-mucho/ | 6,000 |
| /como-la-flor-selena/ | 6,000 |
| /contigo-carla-morrison/ | 6,000 |
| /eres-tu-carla-morrison/ | 6,000 |
| /ex-de-verdad-ha-ash/ | 6,000 |
| /hasta-la-raiz-natalia-lafourcade/ | 6,000 |
| /jesse-y-joy/ | 6,000 |
| /la-quinta-estacion/ | 6,000 |
| /limon-y-sal-julieta-venegas/ | 6,000 |
| /lo-que-construimos-natalia-lafourcade/ | 6,000 |
| /mananitas-para-whatsapp/ | 6,000 |
| /san-lucas-kevin-kaarl/ | 6,000 |
| /te-regalo-carla-morrison/ | 6,000 |
| /colapso-kevin-kaarl/ | 3,300 |
| /disfruto-carla-morrison/ | 3,300 |
| /en-el-2000-natalia-lafourcade/ | 3,300 |
| /amor-amor-carla-morrison/ | 3,000 |
| /amor-de-mis-amores/ | 3,000 |
| /antes-de-ti-mon-laferte/ | 3,000 |
| /como-un-pajaro-silvana-estrada/ | 3,000 |
| /compartir-carla-morrison/ | 3,000 |
| /consuelo-velazquez/ | 3,000 |
| /contigo-aprendi/ | 3,000 |
| /daniela-spalla/ | 3,000 |
| /dejenme-llorar-carla-morrison/ | 3,000 |
| /eres-para-mi-julieta-venegas/ | 3,000 |
| /kilometros-sin-bandera/ | 3,000 |
| /lo-aprendi-de-ti-ha-ash/ | 3,000 |
| /mananitas-para-mama/ | 3,000 |
| /me-muero-la-quinta-estacion/ | 3,000 |
| /palabras-tristes-los-yonics/ | 3,000 |
| /perdon-perdon-ha-ash/ | 3,000 |
| /por-que-me-haces-llorar-juan-gabriel/ | 3,000 |
| /tristes-recuerdos-antonio-aguilar/ | 3,000 |

## Ola 3 · por escribir

Decisiones de Diego (15-nov): **las alabanzas y sus artistas se descartan** (Ave no canta alabanzas; están en
`descartadas_construccion.csv`). **«Eso y más» y «Renunciación» quedan fuera** de las fijas. **Fe** se queda en esqueleto,
sin escribir y sin publicar, hasta que Ave conteste (pregunta en `docs/motor/PREGUNTAS_PARA_AVE.md` del repo pilsi).
Queda también /las-mananitas-en-guitarra/ (se arma con los acordes que toque Ave en su video).

Nota del lote 7: «curame mon laferte» no es una canción (no aparece en Wikipedia, MusicBrainz ni la prensa). Se unió como variante a /amarrame-mon-laferte/.

## Antes de cada ola

1. Diego ve 5 páginas de cada molde (regla del 15-oct). Las muestras están en el PDF del escritorio.
2. Imagen para WhatsApp por página (`img/og/<slug>.jpg`); sin ella sale `img/compartir.jpg`.
3. Prueba en celular del afinador (permiso de micrófono) y de la postal (WhatsApp, guardar imagen).
4. Después de publicar: Search Console, IndexNow y ligar la ola desde una página ya indexada (inicio o /musica/).
