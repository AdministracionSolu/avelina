#!/usr/bin/env python3
"""Diarias de avelina.com.mx: páginas cortas que contestan UNA búsqueda larga y viven en /libreta/<slug>/.
Sin dependencias: reutiliza el molde y las pruebas de las fijas (fuente/fijas/generar.py).

  python3 fuente/diarias/generar.py            pruebas + escribe SÓLO las publicadas, el índice /libreta/ y el sitemap
  python3 fuente/diarias/generar.py --pruebas  sólo corre las pruebas
  python3 fuente/publicar.py                   lo normal: fijas + diarias + sitio, en ese orden

Una diaria = un archivo: fuente/diarias/paginas/<slug>.json. Se publica si "estado": "publicada" y "fecha" es hoy o antes
(hora de la Ciudad de México). Reglas completas en fuente/diarias/COMO.md. Si una prueba truena, no se escribe nada."""
import datetime, glob, json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))
sys.path.insert(0, os.path.join(RAIZ, "fuente", "fijas"))
import generar as F  # noqa: E402  (molde, md, pruebas de texto y bloques de las fijas)

try:
    from zoneinfo import ZoneInfo
    HOY = datetime.datetime.now(ZoneInfo("America/Mexico_City")).date().isoformat()
except Exception:
    HOY = datetime.date.today().isoformat()
SECCION = "libreta"
NOMBRE = "La libreta"
F.COLECCIONES[SECCION] = (SECCION, NOMBRE, "Respuestas cortas, una pregunta a la vez.")
CAMPOS = ["slug", "estado", "fecha", "busqueda", "title", "description", "h1", "respuesta", "secciones", "ligas", "fuentes"]
FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")
LETRA_CAMPOS = ("letra", "estrofa", "coro", "lyrics", "verso")
COMILLAS = [r"«([^»]+)»", r"“([^”]+)”", r'"([^"]+)"']


def cargar():
    ds = []
    for f in sorted(glob.glob(os.path.join(AQUI, "paginas", "*.json"))):
        try: d = json.load(open(f, encoding="utf-8"))
        except Exception as x: raise SystemExit(f"JSON roto en {f}: {x}")
        d["_archivo"] = os.path.basename(f); ds.append(d)
    return ds


def publicada(d): return d.get("estado") == "publicada" and FECHA.match(d.get("fecha", "")) and d["fecha"] <= HOY


def llaves(x):
    if isinstance(x, dict):
        for k, v in x.items(): yield k; yield from llaves(v)
    elif isinstance(x, list):
        for v in x: yield from llaves(v)


def probar(ds, fijas):
    errores, avisos = [], []
    pub_fijas = {p["slug"] for p in fijas if F.publicada(p)}
    todas_fijas = {p["slug"] for p in fijas}
    slugs = [d.get("slug") for d in ds]
    for d in ds:
        s = d.get("slug", "?")
        err = lambda m: errores.append(f"diarias/{d['_archivo']}: {m}")
        if d["_archivo"] != f"{s}.json": err("el archivo debe llamarse <slug>.json")
        for c in CAMPOS:
            if c not in d: err(f"falta «{c}»")
        if not F.SLUG.match(s or ""): err(f"slug inválido «{s}»")
        if slugs.count(s) > 1: err(f"slug repetido «{s}»")
        if s in todas_fijas: err(f"«{s}» ya es una fija: una diaria contesta otra búsqueda")
        if d.get("estado") not in ("borrador", "publicada"): err("estado debe ser borrador o publicada")
        if not FECHA.match(d.get("fecha", "")): err("fecha AAAA-MM-DD")
        t, de = d.get("title", ""), d.get("description", "")
        if len(t) > 58: err(f"title de {len(t)} caracteres (máximo 58)")
        if t.endswith("."): err("title con punto final")
        if not 140 <= len(de) <= 160: err(f"description de {len(de)} caracteres (140 a 160)")
        for h in [d.get("h1", "")] + [x.get("h2", "") for x in d.get("secciones", [])]:
            if h.endswith("."): err(f"encabezado con punto final «{h}»")
        if not 1 <= len(d.get("secciones", [])) <= 4: err("una diaria lleva de 1 a 4 secciones")
        if not 2 <= len([x for x in re.split(r"(?<=[.!?])\s+", d.get("respuesta", "")) if x]) <= 4: err("la respuesta de arriba lleva 2 a 4 frases")
        ls = d.get("ligas", [])
        if not 2 <= len(ls) <= 3: err(f"liga a {len(ls)} fijas (2 a 3)")
        for l in ls:
            if l not in todas_fijas: err(f"liga a una fija que no existe «{l}»")
            elif d.get("estado") == "publicada" and l not in pub_fijas: err(f"liga a una fija sin publicar «{l}»")
        for x in json.dumps(d, ensure_ascii=False).split('"'):
            for m in F.LIGA.finditer(x):
                u = m.group(2)
                if u.startswith("http"): continue
                base = u.split("?")[0].split("#")[0]
                ok = base in F.RUTAS_SITIO or base.strip("/") in todas_fijas or (base.startswith(f"/{SECCION}/") and base.strip("/").split("/")[-1] in slugs)
                if not ok: err(f"liga interna rota «{u}»")
                elif d.get("estado") == "publicada" and base.strip("/") in todas_fijas and base.strip("/") not in pub_fijas: err(f"liga a una fija sin publicar «{u}»")
        todo = F.textos(d)
        palabras = sum(len(F.plano(x).split()) for x in todo)
        if not 150 <= palabras <= 900: err(f"{palabras} palabras: una diaria lleva de 150 a 900 (más corta que una fija)")
        for x in todo:
            xl = x.lower()
            for w in F.PROHIBIDAS:
                if re.search(r"(?<![a-záéíóúñ])" + re.escape(w) + r"(?![a-záéíóúñ])", xl) if w[0].isalpha() else w in xl:
                    err(f"palabra prohibida «{w}» en «{x[:60]}…»")
            if len(F.INGLES.findall(x)) >= 3: err(f"texto en otro idioma: «{x[:60]}…»")
            for f in re.split(r"(?<=[.!?])\s+", x):
                if len(f.split()) > 28: avisos.append(f"{s}: frase de {len(f.split())} palabras «{f[:50]}…»")
            # cero letra ajena: ninguna cita de más de 7 palabras, con ninguna clase de comillas
            for pat in COMILLAS:
                for q in re.findall(pat, x):
                    if len(q.split()) > 7: err(f"cita larga entre comillas (¿letra ajena?): «{q[:50]}»")
        if any(k in LETRA_CAMPOS for k in llaves(d)): err("una diaria nunca lleva letra de canción (campo letra/estrofa/coro)")
        if not d.get("fuentes"): err("sin fuentes")
        for f in d.get("fuentes", []):
            if not f.get("url", "").startswith("https://"): err(f"fuente sin URL https «{f.get('t')}»")
    return errores, avisos


def como_fija(d):
    """La diaria en el formato que entiende el molde de las fijas."""
    q = dict(d)
    q.update(slug=f"{SECCION}/{d['slug']}", coleccion=SECCION, tipo="diaria", hermanas=d["ligas"], publicada_el=d["fecha"],
             revisada=d.get("revisada", d["fecha"]), cabeza=d["busqueda"])
    return q


def html_diaria(d, porslug):
    h = F.pagina(como_fija(d), porslug)
    h = re.sub(r'<p class="f-revisada">[^<]*</p>', f'<p class="f-revisada">Escrita el {F.fecha_larga(d["fecha"])}</p>', h, count=1)
    return h.replace(f'/musica/?c=f-{SECCION}/{d["slug"]}', f'/musica/?c=d-{d["slug"]}').replace("<h2>Sigue leyendo</h2>", "<h2>Para seguir</h2>")


def indice(pubs):
    pubs = sorted(pubs, key=lambda d: (d["fecha"], d["slug"]), reverse=True)
    secs, mes = [], None
    for d in pubs:
        m = F.mes_largo(d["fecha"])
        if m != mes: secs.append({"h2": m.capitalize(), "bloques": [{"tarjetas": []}]}); mes = m
        secs[-1]["bloques"][0]["tarjetas"].append([d["h1"], f"/{SECCION}/{d['slug']}/", d.get("resumen") or d["description"][:90].rsplit(" ", 1)[0] + "…"])
    return {"slug": SECCION, "estado": "publicada", "tipo": "indice", "coleccion": SECCION, "cabeza": "la libreta", "title": f"{NOMBRE} · Avelina",
            "description": "La libreta de Avelina: respuestas cortas a una pregunta a la vez sobre canciones, covers, bodas y cantar, con la página larga donde lo cuento completo.",
            "h1": NOMBRE, "respuesta": "Aquí van respuestas cortas, una pregunta a la vez. Cada una te lleva a la página donde lo cuento completo.",
            "secciones": secs, "hermanas": [], "_archivo": SECCION}


def main():
    fijas = F.cargar()
    ds = cargar()
    errores, avisos = probar(ds, fijas)
    for a in avisos: print("aviso:", a)
    if errores:
        print("\n".join("ERROR: " + x for x in errores)); print(f"{len(errores)} errores: no se escribió nada."); sys.exit(1)
    pubs = [d for d in ds if publicada(d)]
    print(f"pruebas diarias: {len(ds)} escritas, {len(pubs)} publicadas hoy ({HOY}), 0 errores, {len(avisos)} avisos")
    if "--pruebas" in sys.argv: return
    porslug = {p["slug"]: p for p in fijas}
    F.NO_PUBLICADAS.clear(); F.NO_PUBLICADAS.update(p["slug"] for p in fijas if not F.publicada(p))
    vivos = {d["slug"] for d in pubs}
    for f in glob.glob(os.path.join(RAIZ, SECCION, "*", "index.html")):
        s = os.path.basename(os.path.dirname(f))
        if s not in vivos and F.MARCA_GEN in open(f, encoding="utf-8").read(200):
            os.remove(f); os.rmdir(os.path.dirname(f)); print("retirada (ya no está publicada):", s)
    for d in pubs: F.escribe(f"{SECCION}/{d['slug']}/index.html", html_diaria(d, porslug))
    ind = os.path.join(RAIZ, SECCION, "index.html")
    if pubs: F.escribe(f"{SECCION}/index.html", F.pagina(indice(pubs), porslug))
    elif os.path.exists(ind) and F.MARCA_GEN in open(ind, encoding="utf-8").read(200): os.remove(ind)
    lineas = ([f"{F.BASE}/{SECCION}/\t{max(d['fecha'] for d in pubs)}"] if pubs else []) + \
             [f"{F.BASE}/{SECCION}/{d['slug']}/\t{d.get('revisada', d['fecha'])}" for d in sorted(pubs, key=lambda x: x["slug"])]
    open(os.path.join(AQUI, "diarias_sitemap.txt"), "w", encoding="utf-8").write("\n".join(lineas) + ("\n" if lineas else ""))
    sm = open(os.path.join(RAIZ, "sitemap.xml"), encoding="utf-8").read()
    sm = re.sub(r"<url><loc>[^<]+/" + SECCION + r"/[^<]*</loc><lastmod>[^<]+</lastmod></url>", "", sm)
    extra = "".join(f"<url><loc>{u}</loc><lastmod>{f}</lastmod></url>" for u, f in (l.split("\t") for l in lineas))
    open(os.path.join(RAIZ, "sitemap.xml"), "w", encoding="utf-8").write(sm.replace("</urlset>", extra + "</urlset>"))
    print(f"diarias publicadas: {len(pubs)} · en espera (borrador o fecha futura): {len(ds) - len(pubs)}")


if __name__ == "__main__": main()
