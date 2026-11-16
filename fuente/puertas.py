"""Ligas de entrada a las secciones de fijas y diarias: en la portada (postales) y en el pie de TODAS las páginas.

Una sección sólo aparece si su índice está publicado (nunca se liga a un 404):
- índices de fijas: 3 o más fijas publicadas de esa colección (misma regla que fuente/fijas/generar.py),
- la libreta (diarias): 1 o más diarias publicadas con fecha de hoy o antes (fuente/diarias/generar.py).
La usan fuente/build.py, fuente/fijas/generar.py y fuente/diarias/generar.py. Sin dependencias."""
import datetime, glob, html, json, os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
e = html.escape

# (ruta, nombre, frase, colección de fijas o "diarias")
SECCIONES = [
    ("/cartas/", "Cartas", "Para escribir a mano o mandar como postal.", "cartas"),
    ("/cumpleanos/", "Cumpleaños", "Felicitaciones, postales y mañanitas.", "cumpleanos"),
    ("/canciones-para/", "Canciones para cada momento", "Para dedicar, llorar o celebrar.", "canciones-para"),
    ("/covers/", "Covers", "Canciones de otras voces y su historia.", "covers"),
    ("/guitarra/", "Guitarra y canto", "Acordes y canciones para empezar.", "guitarra"),
    ("/afinadores/", "Afinadores", "Con el micrófono del celular.", "afinador"),
    ("/cartas-de-una-foranea/", "Cartas de una foránea", "Lo que escribo lejos de casa.", "marca"),
    ("/libreta/", "La libreta", "Respuestas cortas, una pregunta a la vez.", "diarias"),
]
TIMBRES = ["/img/calido/timbre-sol.webp", "/img/azul/timbre.webp"]
SELLOS = ["/img/estampas/sello-vino.webp", "/img/estampas/sello-azul.webp", "/img/estampas/sello-oro.webp"]


def _json(patron):
    for f in sorted(glob.glob(os.path.join(RAIZ, patron))):
        try: yield json.load(open(f, encoding="utf-8"))
        except Exception: continue


def vivas(hoy=None):
    """Rutas de índice que están publicadas hoy."""
    hoy = hoy or datetime.date.today().isoformat()
    cuenta = {}
    for p in _json("fuente/fijas/paginas/*.json"):
        if not p.get("esqueleto") and p.get("estado") == "publicada" and p.get("publicar_desde", "0000") <= hoy and not p.get("espera_texto"):
            cuenta[p.get("coleccion")] = cuenta.get(p.get("coleccion"), 0) + 1
    for d in _json("fuente/diarias/paginas/*.json"):
        if d.get("estado") == "publicada" and d.get("fecha", "9999") <= hoy:
            cuenta["diarias"] = cuenta.get("diarias", 0) + 1
    return [s for s in SECCIONES if cuenta.get(s[3], 0) >= (1 if s[3] == "diarias" else 3)]


def pie(hoy=None):
    """Renglón de ligas para el pie de todas las páginas."""
    v = vivas(hoy)
    if not v: return ""
    return '<nav class="pie-puertas" aria-label="Cartas, canciones y afinadores">' + "".join(f'<a href="{r}">{e(n)}</a>' for r, n, _, _ in v) + "</nav>"


def portada(titulo="Cartas, canciones y afinadores", sub="Lo que escribo y preparo para que lo uses: cartas, listas, covers y afinadores.", hoy=None):
    """Postales de la portada hacia cada índice."""
    v = vivas(hoy)
    if not v: return ""
    tarjetas = "".join(
        f'<a class="puerta" href="{r}"><span class="puerta-timbre" style="background-image:url({TIMBRES[i % 2]})" aria-hidden="true"></span>'
        f'<span class="puerta-sello" style="background-image:url({SELLOS[i % 3]})" aria-hidden="true"></span>'
        f'<b>{e(n)}</b><span>{e(f)}</span></a>' for i, (r, n, f, _) in enumerate(v))
    return f'<section class="papel puertas-sec"><div class="ancho"><h2>{e(titulo)}</h2><p class="lead">{e(sub)}</p><div class="puertas">{tarjetas}</div></div></section>'
