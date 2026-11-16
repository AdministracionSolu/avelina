#!/usr/bin/env python3
"""Fijas de avelina.com.mx. Sin dependencias: sólo la biblioteca estándar de Python.

  python3 fuente/fijas/generar.py           pruebas + escribe SÓLO las publicadas (/<slug>/index.html) y el sitemap
  python3 fuente/fijas/generar.py --vista   además escribe TODAS (borradores incluidos) en fuente/fijas/_vista/ (ignorada por git)
  python3 fuente/fijas/generar.py --pruebas sólo corre las pruebas

Las reglas están en fuente/fijas/CONTRATO.md. Si una prueba truena, no se escribe nada."""
import datetime, glob, html, json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))
BASE = "https://avelina.com.mx"
HOY = datetime.date.today().isoformat()
VISTA = "--vista" in sys.argv
MARCA_GEN = "<!-- fija:generada -->"
e = html.escape

# ---------- lo que se comparte con el sitio (se lee de build.py sin ejecutarlo)
_b = open(os.path.join(RAIZ, "fuente/build.py"), encoding="utf-8").read()
CARTAS_DESTINO = re.search(r'CARTAS_DESTINO = "([^"]+)"', _b).group(1)
CARTAS_LLAVE = re.search(r'CARTAS_LLAVE = "([^"]+)"', _b).group(1)
YT = "https://www.youtube.com/@AvelinaMartinetMolina"
REDES = [("Instagram", "https://www.instagram.com/avelinaa.mar/"), ("TikTok", "https://www.tiktok.com/@avelinamm7"), ("YouTube", YT)]
NAV = [("/musica/", "Música"), ("/videos/", "Videos"), ("/diario/", "Diario"), ("/album/", "Álbum"), ("/quien-soy/", "Quién soy"), ("/contacto/", "Contacto")]
RUTAS_SITIO = {"/", "/musica/", "/videos/", "/diario/", "/album/", "/quien-soy/", "/contacto/", "/privacidad/", "/contacto/#cartas"}
PALABRAS = json.load(open(os.path.join(RAIZ, "fuente/palabras.json"), encoding="utf-8"))
sys.path.insert(0, os.path.join(RAIZ, "fuente"))
import puertas
PIE_PUERTAS = puertas.pie(HOY)
MESES = "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split()

COLECCIONES = {  # índice de cada colección: se publica solo cuando tiene 3 o más fijas publicadas
    "covers": ("covers", "Covers", "Canciones de otras voces que quiero cantar, con su historia y mi versión."),
    "cartas": ("cartas", "Cartas", "Cartas para escribir a mano o mandar como postal desde el celular."),
    "cumpleanos": ("cumpleanos", "Cumpleaños", "Felicitaciones, postales y canciones para cumpleaños."),
    "afinador": ("afinadores", "Afinadores", "Afinadores con el micrófono del celular, sin descargar nada."),
    "guitarra": ("guitarra", "Guitarra y canto", "Acordes, canciones y ejercicios para empezar."),
    "canciones-para": ("canciones-para", "Canciones para cada momento", "Listas de canciones para dedicar, llorar o celebrar."),
    "marca": ("cartas-de-una-foranea", "Cartas de una foránea", "Lo que escribo lejos de casa, la escena de cantautores y la música indie de México."),
    "fe": ("fe", "Fe", "Reflexiones de fe con sus textos y videos."),
}

def bi(t):
    """Letra a mano sólo si TODAS las palabras ya están dibujadas; si no, texto normal."""
    ps = t.split()
    if not all(p in PALABRAS for p in ps): return e(t)
    import hashlib
    sv = " ".join(f'<svg class="biro" style="width:{PALABRAS[p]["w"] / 1000:.3f}em" aria-hidden="true"><use href="/img/palabras.svg#p{hashlib.sha1(p.encode()).hexdigest()[:9]}"/></svg>' for p in ps)
    return f'<span class="vh">{e(t)}</span>{sv}'

def ver(ruta):
    import hashlib
    p = os.path.join(RAIZ, ruta)
    return hashlib.sha1(open(p, "rb").read()).hexdigest()[:8] if os.path.exists(p) else "0"

# ---------- texto: [ligas](/ruta/), **negritas** y nada más
LIGA = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
NO_PUBLICADAS = set()  # slugs de fijas sin publicar: en el sitio real su liga se vuelve texto (no se liga a un 404)
def _liga(m):
    u, x = m.group(2), m.group(1)
    if u.split("#")[0].strip("/") in NO_PUBLICADAS: return x
    return f'<a href="{u}"{" target=_blank rel=noopener" if u.startswith("http") else ""}>{x}</a>'
def md(t):
    t = e(t, quote=False)
    t = LIGA.sub(_liga, t)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
def plano(t): return re.sub(r"\*\*", "", LIGA.sub(lambda m: m.group(1), t))

def fecha_larga(f):
    y, m, d = map(int, f.split("-")); return f"{d} de {MESES[m - 1]} de {y}"
def mes_largo(f):
    y, m = map(int, f.split("-")[:2]); return f"{MESES[m - 1]} de {y}"

# ---------- datos
def cargar():
    ps = []
    for f in sorted(glob.glob(os.path.join(AQUI, "paginas", "*.json"))):
        try: p = json.load(open(f, encoding="utf-8"))
        except Exception as x: raise SystemExit(f"JSON roto en {f}: {x}")
        p["_archivo"] = os.path.basename(f)
        if sin_video(p): p = mientras_no_hay_video(p)
        ps.append(p)
    return ps
# Un cover o artista sin video SÍ se publica (Diego, 15-nov): la postal dice que mi versión viene pronto y liga a las cartas.
# El JSON se escribe para cuando ya hay video; mientras no lo hay, estas frases se cambian al generar para no prometer
# un video que no existe. Al poner cover.video.id la página queda completa sola.
SIN_VIDEO = {
    "Esta página cuenta su historia y lleva mi versión en video.": "Esta página cuenta su historia, y mi versión en video viene pronto.",
    "Aquí va mi versión en video y su historia.": "Aquí va su historia, y mi versión en video viene pronto.",
    "Aquí está su historia y mi versión a guitarra.": "Aquí está su historia, y mi versión a guitarra viene pronto.",
    "Manda después el enlace de mi versión, temprano en la mañana.": "Cuando salga mi versión, manda también su enlace, temprano en la mañana.",
}
def sin_video(p): return bool(p.get("cover")) and not (p["cover"].get("video") or {}).get("id")
def mientras_no_hay_video(x):
    if isinstance(x, str):
        for a, b in SIN_VIDEO.items(): x = x.replace(a, b)
        return x
    if isinstance(x, list): return [mientras_no_hay_video(y) for y in x]
    if isinstance(x, dict): return {k: (v if k in ("slug", "_archivo", "fuentes") else mientras_no_hay_video(v)) for k, v in x.items()}
    return x
def publicada(p): return not p.get("esqueleto") and p.get("estado") == "publicada" and p.get("publicar_desde", "0000") <= HOY and not p.get("espera_texto")

# ---------- pruebas que truenan
PROHIBIDAS = ["aquí podrás", "en esta sección", "solución que permite", "simple", "transparente", "sin sorpresas", "no te preocupes",
              "lo honesto", "sin rodeos", "con sinceridad", "honestamente", "no necesitas", "supabase", "anthropic", "claude", "stripe",
              "netlify", "resend", "evolution", "aws", "chatgpt", "inteligencia artificial", "algoritmo", "—", ";", "sin duda",
              "sumérgete", "descubre el poder", "en el mundo de", "a continuación", "cabe destacar", "es importante destacar", "en conclusión"]
INGLES = re.compile(r"\b(the|and|you|with|your|this|that|for|are)\b", re.I)
SLUG = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
TIPOS = {"cover", "artista", "herramienta", "carta", "lista", "guia", "marca", "fe", "indice"}
CAMPOS = ["slug", "estado", "tipo", "coleccion", "cabeza", "title", "description", "h1", "respuesta", "secciones", "hermanas"]

def textos(p):
    """Todo el texto visible de la página, para barrerlo."""
    out = [p.get("h1", ""), p.get("respuesta", ""), p.get("title", ""), p.get("description", "")]
    for s in p.get("secciones", []):
        out.append(s.get("h2", ""))
        for b in s.get("bloques", []): out += list(textos_bloque(b))
    for q in p.get("faq", []): out += [q["q"], q["a"]]
    if p.get("cover"): out += [p["cover"].get("nota", "")]
    return [plano(x) for x in out if x]
def textos_bloque(b):
    if isinstance(b, str): yield b; return
    for k, v in b.items():
        if k in ("lista", "pasos"): yield from (x if isinstance(x, str) else " ".join(x) for x in v)
        elif k == "tabla": yield from (" ".join(map(str, f)) for f in v["filas"] + [v["cab"]])
        elif k == "carta": yield v["texto"]; yield v.get("para", ""); yield v.get("firma", "")
        elif k == "nota": yield v
        elif k == "tarjetas": yield from (f"{t} {r}" for t, _, r in v)

def probar(ps):
    errores, avisos = [], []
    slugs = [p.get("slug") for p in ps]
    existentes = {d for d in os.listdir(RAIZ) if os.path.isdir(os.path.join(RAIZ, d)) and not os.path.exists(os.path.join(RAIZ, d, "index.html"))} | set()
    reservadas = {"musica", "videos", "diario", "album", "quien-soy", "contacto", "privacidad", "en", "css", "js", "img", "fonts", "fuente", "libreta"} | {c[0] for c in COLECCIONES.values()}
    pubs = {p["slug"] for p in ps if publicada(p)}
    for p in ps:
        s, err = p.get("slug", "?"), lambda m: errores.append(f"{p['_archivo']}: {m}")
        if p["_archivo"] != f"{s}.json": err("el archivo debe llamarse <slug>.json")
        if p.get("esqueleto"):
            if p.get("estado") == "publicada": err("un esqueleto no se publica")
            continue
        for c in CAMPOS:
            if c not in p: err(f"falta «{c}»")
        if not SLUG.match(s or ""): err(f"slug inválido «{s}»")
        if slugs.count(s) > 1: err(f"slug repetido «{s}»")
        if s in reservadas: err(f"slug choca con una ruta del sitio «{s}»")
        if p.get("tipo") not in TIPOS: err(f"tipo desconocido «{p.get('tipo')}»")
        if p.get("coleccion") not in COLECCIONES: err(f"colección desconocida «{p.get('coleccion')}»")
        if p.get("estado") not in ("borrador", "publicada"): err("estado debe ser borrador o publicada")
        t, d = p.get("title", ""), p.get("description", "")
        if len(t) > 58: err(f"title de {len(t)} caracteres (máximo 58)")
        if t.endswith("."): err("title con punto final")
        if not 140 <= len(d) <= 160: err(f"description de {len(d)} caracteres (140 a 160)")
        cab = p.get("cabeza", "").lower()
        if cab and not re.sub(r"[^a-z0-9ñ ]", "", strip(t.lower())).startswith(re.sub(r"[^a-z0-9ñ ]", "", strip(cab))[:12]):
            avisos.append(f"{s}: el title no empieza con la cabeza «{cab}»")
        for h in [p.get("h1", "")] + [x.get("h2", "") for x in p.get("secciones", [])]:
            if h.endswith("."): err(f"encabezado con punto final «{h}»")
        r = p.get("respuesta", "")
        if not 2 <= len([x for x in re.split(r"(?<=[.!?])\s+", r) if x]) <= 4: err("la respuesta de arriba lleva 2 a 4 frases")
        hs = p.get("hermanas", [])
        if not 3 <= len(hs) <= 6: err(f"da {len(hs)} ligas a hermanas (3 a 6)")
        for h in hs:
            if h not in slugs: err(f"hermana inexistente «{h}»")
            if h == s: err("se liga a sí misma")
        # ligas internas dentro del texto
        for x in json.dumps(p, ensure_ascii=False).split('"'):
            for m in LIGA.finditer(x):
                u = m.group(2)
                if u.startswith("http"): continue
                base = u.split("?")[0]
                if base not in RUTAS_SITIO and base.strip("/") not in slugs and base.strip("/").split("#")[0] not in slugs:
                    err(f"liga interna rota «{u}»")
        todo = textos(p)
        for x in todo:
            xl = x.lower()
            for w in PROHIBIDAS:
                if re.search(r"(?<![a-záéíóúñ])" + re.escape(w) + r"(?![a-záéíóúñ])", xl) if w[0].isalpha() else w in xl:
                    err(f"palabra prohibida «{w}» en «{x[:60]}…»")
            if len(INGLES.findall(x)) >= 3: err(f"texto en otro idioma: «{x[:60]}…»")
            for f in re.split(r"(?<=[.!?])\s+", x):
                if len(f.split()) > 28: avisos.append(f"{s}: frase de {len(f.split())} palabras «{f[:50]}…»")
        # ninguna letra de canción ajena
        if p.get("tipo") in ("cover", "artista", "lista") or p.get("cover"):
            for x in todo:
                for q in re.findall(r"«([^»]+)»", x):
                    if len(q.split()) > 7: err(f"cita larga entre comillas en página de canciones (¿letra ajena?): «{q[:50]}»")
            if any(k in p for k in ("letra", "estrofa", "coro")): err("una página de cover no lleva letra")
        if p.get("tipo") == "cover" and not p.get("cover"): err("un cover lleva el bloque «cover» (canción, artista y video)")
        if p.get("cover") and not p["cover"].get("video") and not p.get("espera_video"): err("cover sin video: marca espera_video")
        if p.get("cover", {}).get("video") and not os.path.exists(os.path.join(RAIZ, f'img/videos/{p["cover"]["video"]["id"]}.webp')):
            err(f'falta la miniatura img/videos/{p["cover"]["video"]["id"]}.webp')
        if p.get("espera_video") and not sin_video(p): err("ya tiene video: quita espera_video")
        if sin_video(p):  # nunca un reproductor vacío ni la promesa de un video que no existe
            for x in textos(p):
                for w in ("lleva mi versión en video", "dale play a mi versión", "aquí está mi versión", "aquí va mi versión en video"):
                    if w in x.lower() and "cuando esté lista" not in x.lower(): err(f"sin video, el texto promete un video que no existe: «{x[:60]}»")
        if p.get("estado") == "publicada":
            if p.get("espera_texto"): err("no se publica: espera texto de Ave")
            if not p.get("fuentes") and p.get("tipo") in ("cover", "artista", "fe"): err("no se publica sin fuentes")
            if len([h for h in hs if h in pubs]) < 3: err("publicada con menos de 3 hermanas publicadas (1.7 pide de 3 a 6)")
        for f in p.get("fuentes", []):
            if not f.get("url", "").startswith("https://"): err(f"fuente sin URL https «{f.get('t')}»")
    return errores, avisos
def strip(t):
    import unicodedata
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")

# ---------- piezas
def bloque(b):
    if isinstance(b, str): return f"<p>{md(b)}</p>"
    if "lista" in b:
        li = "".join(f"<li>{md(x)}</li>" if isinstance(x, str) else f"<li><b>{md(x[0])}</b> <span>{md(x[1])}</span></li>" for x in b["lista"])
        return f'<ul class="f-lista">{li}</ul>'
    if "pasos" in b: return '<ol class="f-pasos">' + "".join(f"<li>{md(x)}</li>" for x in b["pasos"]) + "</ol>"
    if "tabla" in b:
        t = b["tabla"]; cab = "".join(f"<th scope=col>{e(c)}</th>" for c in t["cab"])
        fil = "".join("<tr>" + "".join(f"<td>{md(str(c))}</td>" for c in f) + "</tr>" for f in t["filas"])
        return f'<div class="f-tabla"><table><thead><tr>{cab}</tr></thead><tbody>{fil}</tbody></table></div>'
    if "carta" in b:
        c = b["carta"]; para = f'<p class="para">{e(c["para"])}</p>' if c.get("para") else ""
        cuerpo = "".join(f"<p>{md(x)}</p>" for x in c["texto"].split("\n\n"))
        firma = f'<p class="firma">{e(c["firma"])}</p>' if c.get("firma") else ""
        usar = f'<button class="f-usar" type="button" data-usar>Usar esta carta</button>' if b.get("usar", True) else ""
        return f'<figure class="f-carta">{para}{cuerpo}{firma}{usar}</figure>'
    if "nota" in b: return f'<p class="f-nota">{md(b["nota"])}</p>'
    if "tarjetas" in b:  # postales de un índice: [título, ruta, resumen]
        return '<div class="f-hermanas f-postales">' + "".join(f'<a class="f-hermana" href="{e(u)}"><span class="f-timbre" aria-hidden="true"></span><b>{e(t)}</b><span>{e(r)}</span></a>' for t, u, r in b["tarjetas"]) + "</div>"
    if "herramienta" in b: return herramienta(b["herramienta"])
    raise SystemExit(f"bloque desconocido {b}")

NOTAS_ES = {"C": "Do", "C#": "Do#", "D": "Re", "D#": "Re#", "E": "Mi", "F": "Fa", "F#": "Fa#", "G": "Sol", "G#": "Sol#", "A": "La", "A#": "La#", "B": "Si"}
def herramienta(h):
    k = h["tipo"]
    if k == "afinador":
        cuerdas = h["cuerdas"]  # [["Mi", "E2", 82.41, "6ª"], ...]
        bt = "".join(f'<button type="button" class="cuerda" data-f="{f}" data-n="{e(n)}"><b>{e(n)}</b><small>{e(c)} · {e(sci)}</small></button>' for n, sci, f, c in cuerdas)
        return f'''<div class="afinador" data-instrumento="{e(h.get('nombre', ''))}">
<div class="af-ventana"><div class="af-barra"><span>Afinador</span><span class="af-cuadros" aria-hidden="true"><i></i><i></i><i></i></span></div>
<div class="af-pantalla"><p class="af-nota" aria-live="polite">—</p><p class="af-hz">Toca el botón y luego una cuerda</p>
<div class="af-escala" aria-hidden="true"><span class="af-aguja"></span><span class="af-centro"></span></div>
<p class="af-cents"><span>bemol</span><span>afinada</span><span>sostenido</span></p></div>
<div class="af-botones"><button type="button" class="boton af-escuchar">Encender el micrófono</button></div>
<p class="af-ayuda">O toca una cuerda abajo para oír su nota y afinar de oído.</p>
<div class="af-cuerdas">{bt}</div></div></div>'''.replace("—", "·")
    if k == "postal":
        return f'''<div class="postal-gen" data-tipo="{e(h.get('ocasion', ''))}">
<form class="pg-form" onsubmit="return false"><label>Para<input name="para" maxlength="40" value="{e(h.get('para', ''))}" autocomplete="off"></label>
<label>Tu carta<textarea name="texto" rows="7" maxlength="900">{e(h.get('texto', ''))}</textarea></label>
<label>Firma<input name="firma" maxlength="40" value="{e(h.get('firma', ''))}" autocomplete="off"></label></form>
<div class="pg-vista" aria-live="polite"><span class="pg-timbre" aria-hidden="true"></span><p class="pg-para"></p><div class="pg-texto"></div><p class="pg-firma"></p></div>
<p class="pg-acciones"><button type="button" class="boton pg-imagen">Guardar como imagen</button><button type="button" class="boton boton-claro pg-copiar">Copiar el texto</button><a class="boton boton-claro pg-whatsapp" href="https://wa.me/" target="_blank" rel="noopener">Mandar por WhatsApp</a></p>
<p class="f-nota">Lo que escribes se queda en tu teléfono. No se guarda en ningún lado.</p></div>'''
    if k == "letra-bonita":
        return f'''<div class="letra-gen"><form class="lg-form" onsubmit="return false"><label>Texto<input name="texto" maxlength="40" value="{e(h.get('texto', 'Feliz cumpleaños'))}"></label>
<label>Nombre<input name="nombre" maxlength="30" value="" placeholder="Valeria" autocomplete="off"></label>
<fieldset class="lg-papel"><legend>Papel</legend><label><input type="radio" name="papel" value="crema" checked> Crema</label><label><input type="radio" name="papel" value="noche"> Azul noche</label><label><input type="radio" name="papel" value="durazno"> Durazno</label></fieldset></form>
<canvas class="lg-lienzo" width="1080" height="1080" aria-label="Vista previa de tu texto en letra bonita"></canvas>
<p class="pg-acciones"><button type="button" class="boton lg-imagen">Guardar como imagen</button></p></div>'''
    raise SystemExit(f"herramienta desconocida {k}")

def video(v, titulo):
    vid = v["id"]
    return f'<div class="marco"><button class="lite" type="button" data-id="{vid}" aria-label="Reproducir video: {e(titulo)}"><img src="/img/videos/{vid}.webp" alt="" loading="lazy"><span class="play" aria-hidden="true"></span></button></div>'
def bloque_cover(p):
    """La postal del cover. Con video: el reproductor. Sin video: una nota en mi voz de que mi versión viene pronto,
    con liga a las Cartas de una foránea de esta misma página (así el correo guarda de qué página llegó)."""
    c = p["cover"]; artista = p["tipo"] == "artista"
    nota = c.get("nota", "")
    espera = any(w in nota for w in ("viene en camino", "van a vivir", "aparece aquí"))  # notas escritas para la espera
    if not sin_video(p):
        izq = video(c["video"], f'{c["video"].get("cancion") or c["cancion"]} cover de Avelina')
        lead = nota if nota and not espera else (f'Mi cover de {c["video"]["cancion"]}, a guitarra y voz.' if c["video"].get("cancion") else "Mi versión, a guitarra y voz.")
    else:
        quien = c.get("artista") or c["cancion"]
        viene = f"Mis covers de {quien} a guitarra y voz vienen pronto." if artista else f'Mi versión de {c["cancion"]} a guitarra y voz viene pronto.'
        izq = f'''<div class="f-espera"><span class="pg-timbre" aria-hidden="true"></span><p class="f-espera-t">{e(viene)}</p>
<p>El día que salga te escribo en las Cartas de una foránea.</p><a class="enlace" href="#cartas">Avísame cuando salga</a></div>'''
        lead = nota if nota and not espera else ""
        lead = lead or ("Mientras, aquí te cuento quién es y cuáles son sus canciones." if artista else "Mientras, aquí te cuento su historia.")
    autor = f'<p><small>{e(c["credito"])}</small></p>' if c.get("credito") else ""
    return f'''<section class="lienzo mar f-cover"><div class="ancho"><div class="postal"><div class="postal-foto">{izq}</div>
<div class="postal-dorso"><span class="estampilla" aria-hidden="true"></span><h2>{e(c["cancion"])}</h2><p class="lead">{md(lead)}</p>{autor}</div></div></div></section>'''

def hermanas(p, porslug, vista):
    cards = []
    for h in p["hermanas"]:
        if not vista and h in NO_PUBLICADAS: continue
        q = porslug[h]
        if q.get("esqueleto"): cards.append(f'<a class="f-hermana" href="{ruta(h, vista)}"><b>{e(q["cabeza"].capitalize())}</b><span>(por escribir)</span></a>'); continue
        cards.append(f'<a class="f-hermana" href="{ruta(h, vista)}"><b>{e(q["h1"])}</b><span>{e(q.get("resumen") or q["description"][:90].rsplit(" ", 1)[0] + "…")}</span></a>')
    return f'<section class="papel f-sigue"><div class="ancho"><h2>Sigue leyendo</h2><div class="f-hermanas">{"".join(cards)}</div></div></section>'

def cartas_form():
    return f'''<section class="cartas f-cartas" id="cartas"><div class="ancho"><h2>{bi("Cartas de una foránea")}</h2><p class="lead">Cuando haya canción nueva, te escribo antes que a nadie.</p>
<form class="sobre" data-destino="{CARTAS_DESTINO}" data-llave="{CARTAS_LLAVE}" data-idioma="es" data-ok="Ya vas en camino a la lista. Te escribo pronto." data-error="No se pudo enviar. Inténtalo otra vez.">
<span class="timbre" aria-hidden="true"><img src="/img/marca/paloma-1.png" alt=""></span>
<label for="correo-cartas">{bi("Tu correo")}</label>
<div class="renglon"><span aria-hidden="true">Para:</span><input id="correo-cartas" type="email" name="correo" required autocomplete="email" inputmode="email" placeholder="tu@correo.com"></div>
<input class="trampa" type="text" name="sitio" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="boton" type="submit">{bi("Quiero las cartas")}</button><p class="aviso-form" role="status"></p></form>
<p class="pie">Solo uso tu correo para mandarte las cartas. <a href="/privacidad/">Aviso de privacidad</a></p></div></section>'''

def ruta(slug, vista): return f"/fuente/fijas/_vista/{slug}/" if vista else f"/{slug}/"

def marcado(p, url, crumbs):
    g = [{"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": BASE + u} for i, (n, u) in enumerate(crumbs)]},
         {"@type": "WebPage", "name": p["h1"], "url": url, "inLanguage": "es-MX", "description": p["description"],
          "datePublished": p.get("publicada_el", p.get("revisada", HOY)), "dateModified": p.get("revisada", HOY),
          "author": {"@type": "Person", "name": "Avelina Martinet Molina", "url": BASE + "/quien-soy/"}}]
    if p.get("faq"):
        g.append({"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q["q"], "acceptedAnswer": {"@type": "Answer", "text": plano(q["a"])}} for q in p["faq"]]})
    if p["tipo"] == "herramienta":
        g.append({"@type": "WebApplication", "name": p["h1"], "url": url, "applicationCategory": "MultimediaApplication", "operatingSystem": "Cualquiera con navegador",
                  "inLanguage": "es-MX", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "MXN"}})
    c = p.get("cover")
    if c and c.get("compositor"):
        g[1]["about"] = {"@type": "MusicComposition", "name": c["cancion"], "composer": [{"@type": "Person", "name": x} for x in c["compositor"]]}
    if c and not sin_video(p):
        v = c["video"]; g.append({"@type": "VideoObject", "name": f'{c["cancion"]} · cover de Avelina', "description": p["description"], "thumbnailUrl": f"{BASE}/img/videos/{v['id']}.webp",
                                  "uploadDate": v["fecha"], "embedUrl": f"https://www.youtube-nocookie.com/embed/{v['id']}"})
    return '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": g}, ensure_ascii=False) + "</script>"

def pagina(p, porslug, vista=False):
    slug = p["slug"]; url = f"{BASE}/{slug}/"
    col = COLECCIONES[p["coleccion"]]
    crumbs = [("Inicio", "/"), (col[1], f"/{col[0]}/"), (p["h1"], f"/{slug}/")] if p["tipo"] != "indice" else [("Inicio", "/"), (p["h1"], f"/{slug}/")]
    migas = " · ".join(f'<a href="{u if not vista else "#"}">{e(n)}</a>' for n, u in crumbs[:-1])
    fecha = f'<p class="f-revisada">Revisada en {mes_largo(p["revisada"])}</p>' if p.get("revisada") else ""
    arriba = f'''<section class="lienzo primera f-arriba"><div class="ancho"><nav class="f-migas" aria-label="Estás en">{migas}</nav>
<h1 class="f-h1">{e(p["h1"])}</h1><p class="lead">{md(p["respuesta"])}</p>{fecha}</div></section>'''
    cover = bloque_cover(p) if p.get("cover") else ""
    cuerpo = "".join(f'<h2>{e(s["h2"])}</h2>' + "".join(bloque(b) for b in s.get("bloques", [])) for s in p["secciones"])
    faq = ""
    if p.get("faq"):
        faq = "<h2>Preguntas frecuentes</h2>" + "".join(f"<details><summary>{e(q['q'])}</summary><p>{md(q['a'])}</p></details>" for q in p["faq"])
    fuentes = ""
    if p.get("fuentes"):
        fuentes = '<div class="f-fuentes"><h2>Fuentes</h2><ul>' + "".join(f'<li><a href="{e(f["url"])}" target="_blank" rel="noopener">{e(f["t"])}</a></li>' for f in p["fuentes"]) + "</ul></div>"
    venta = f'<p class="f-venta"><a class="boton" href="/musica/?c=f-{slug}">{bi("Escuchar")} mis canciones</a></p>'
    medio = f'<section class="papel f-cuerpo"><div class="ancho"><div class="f-texto">{cuerpo}{faq}{fuentes}{venta}</div></div></section>'
    js = [f'<script src="/js/sitio.js?v={ver("js/sitio.js")}" defer></script>']
    usa = json.dumps(p["secciones"], ensure_ascii=False)
    if '"afinador"' in usa: js.append(f'<script src="/js/afinador.js?v={ver("js/afinador.js")}" defer></script>')
    if '"postal"' in usa or '"carta"' in usa: js.append(f'<script src="/js/postal.js?v={ver("js/postal.js")}" defer></script>')
    if '"letra-bonita"' in usa: js.append(f'<script src="/js/letra-bonita.js?v={ver("js/letra-bonita.js")}" defer></script>')
    og = f"{BASE}/img/og/{slug}.jpg" if os.path.exists(os.path.join(RAIZ, f"img/og/{slug}.jpg")) else f"{BASE}/img/compartir.jpg"
    robots = '<meta name="robots" content="noindex">' if vista else ""
    nav = "".join(f'<a href="{u}">{bi(n)}</a>' for u, n in NAV)
    return f'''<!doctype html>
{MARCA_GEN}
<html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">{robots}
<title>{e(p["title"])}</title><meta name="description" content="{e(p["description"])}">
<meta property="og:title" content="{e(p["title"])}"><meta property="og:description" content="{e(p["description"])}"><meta property="og:image" content="{og}"><meta property="og:url" content="{url}"><meta property="og:type" content="article"><meta property="og:locale" content="es_MX"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1c356d"><link rel="icon" href="/img/favicon.png"><link rel="canonical" href="{url}">
<link rel="stylesheet" href="/css/sitio.css?v={ver("css/sitio.css")}"><link rel="stylesheet" href="/css/fijas.css?v={ver("css/fijas.css")}">{marcado(p, url, crumbs)}
{"".join(js)}</head>
<body class="p-fija t-{p["tipo"]}">
<header class="barra"><a class="logo" href="/"><img src="/img/marca/avelina-hilo.webp" alt="Avelina" width="1375" height="324"></a>
<details class="menu"><summary>{bi("Menú")}</summary><nav>{nav}</nav></details><nav class="nav-ancho" aria-label="Menú">{nav}</nav></header>
<main>{arriba}{cover}{medio}{hermanas(p, porslug, vista) if p["tipo"] != "indice" else ""}{cartas_form()}</main>
<footer><div class="ancho"><img src="/img/marca/avelina-hilo.webp" alt="" width="1375" height="324" loading="lazy"><p>{bi("canto lo que escribo")}</p>
<nav>{"".join(f'<a href="{h}" target="_blank" rel="noopener">{bi(n)}</a>' for n, h in REDES)}</nav>{PIE_PUERTAS}<small>© 2026 Avelina Martinet Molina · <a href="/privacidad/">Aviso de privacidad</a></small></div></footer>
</body></html>
'''

def indice(col, miembros):
    """Página índice de una colección, armada con sus fijas publicadas."""
    slug, nombre, txt = COLECCIONES[col]
    lista = [[m["h1"], f"/{m['slug']}/", m.get("resumen") or m["description"][:90].rsplit(" ", 1)[0] + "…"] for m in sorted(miembros, key=lambda x: -x.get("volumen", 0))]
    desc = (txt + " Todo lo escribe o lo prepara Avelina, cantautora de Monterrey que canta lo que escribe. Escoge y empieza.")[:160].rsplit(" ", 1)[0]
    return {"slug": slug, "estado": "publicada", "tipo": "indice", "coleccion": col, "cabeza": nombre.lower(), "title": f"{nombre} · Avelina", "description": desc,
            "h1": nombre, "respuesta": txt + " Todas las escribo o las preparo yo.", "secciones": [{"h2": "Todas", "bloques": [{"tarjetas": lista}]}],
            "hermanas": [m["slug"] for m in miembros[:6]], "_archivo": slug}

def escribe(ruta_rel, txt):
    p = os.path.join(RAIZ, ruta_rel); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, "w", encoding="utf-8").write(txt)

def main():
    ps = cargar()
    errores, avisos = probar(ps)
    for a in avisos: print("aviso:", a)
    if errores:
        print("\n".join("ERROR: " + x for x in errores)); print(f"{len(errores)} errores: no se escribió nada."); sys.exit(1)
    print(f"pruebas: {len([p for p in ps if not p.get('esqueleto')])} fijas escritas + {len([p for p in ps if p.get('esqueleto')])} esqueletos, 0 errores, {len(avisos)} avisos")
    if "--pruebas" in sys.argv: return
    porslug = {p["slug"]: p for p in ps}
    pubs = [p for p in ps if publicada(p)]
    # índices de colección: sólo con 3 o más publicadas
    for col in COLECCIONES:
        m = [p for p in pubs if p["coleccion"] == col]
        if len(m) >= 3:
            i = indice(col, m); porslug[i["slug"]] = i; pubs.append(i)
    # publicadas: HTML real; borradores: se borra cualquier HTML generado que hubiera quedado
    vivos = {p["slug"] for p in pubs}
    NO_PUBLICADAS.update(s for s in porslug if s not in vivos)
    for d in glob.glob(os.path.join(RAIZ, "*", "index.html")):
        s = os.path.basename(os.path.dirname(d))
        if s != "libreta" and s not in vivos and MARCA_GEN in open(d, encoding="utf-8").read(200):  # /libreta/ es de las diarias
            os.remove(d); os.rmdir(os.path.dirname(d)); print("retirada (ya no está publicada):", s)
    for p in pubs: escribe(f"{p['slug']}/index.html", pagina(p, porslug))
    # sitemap: lo del sitio + las fijas publicadas (build.py lee fijas_sitemap.txt para no borrarlas)
    lineas = [f"{BASE}/{p['slug']}/\t{p.get('revisada', HOY)}" for p in sorted(pubs, key=lambda x: x["slug"])]
    open(os.path.join(AQUI, "fijas_sitemap.txt"), "w", encoding="utf-8").write("\n".join(lineas) + ("\n" if lineas else ""))
    sm = open(os.path.join(RAIZ, "sitemap.xml"), encoding="utf-8").read()
    sm = re.sub(r"<url><loc>(?![^<]*/libreta/)[^<]+</loc><lastmod>[^<]+</lastmod></url>", "", sm)  # las fijas (las diarias de /libreta/ las pone fuente/diarias/generar.py)
    extra = "".join(f"<url><loc>{u}</loc><lastmod>{f}</lastmod></url>" for u, f in (l.split("\t") for l in lineas))
    open(os.path.join(RAIZ, "sitemap.xml"), "w", encoding="utf-8").write(sm.replace("</urlset>", extra + "</urlset>"))
    print(f"publicadas: {len(pubs)} · borradores: {len(ps) - len([p for p in pubs if p['tipo'] != 'indice'])}")
    if VISTA:
        import shutil
        shutil.rmtree(os.path.join(AQUI, "_vista"), ignore_errors=True)
        NO_PUBLICADAS.clear()
        for p in [q for q in ps if not q.get("esqueleto")]: escribe(f"fuente/fijas/_vista/{p['slug']}/index.html", pagina(p, porslug, vista=True).replace('href="/', 'href="/').replace(f'href="{BASE}', 'href="'))
        print(f"vista previa: {len(ps)} en fuente/fijas/_vista/ · python3 -m http.server -d {RAIZ} 8765 → http://localhost:8765/fuente/fijas/_vista/<slug>/")

if __name__ == "__main__": main()
