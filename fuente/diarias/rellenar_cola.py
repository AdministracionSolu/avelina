#!/usr/bin/env python3
"""Rellena fuente/diarias/cola.csv cuando le quedan menos de 30 pendientes. Nunca inventa volumen.

  python3 fuente/diarias/rellenar_cola.py            agrega candidatas (Search Console + autocompletado)
  python3 fuente/diarias/rellenar_cola.py --ver      sólo muestra lo que agregaría

De dónde salen las búsquedas nuevas:
1. Search Console de avelina.com.mx (últimos 28 días), con la cuenta de servicio de sólo lectura
   ~/.secretos/avelina/search-console-lector.json. Entran las consultas de 4 palabras o más, con 10+ impresiones,
   que no son ya cabeza o variante de una fija o de la cola. Volumen = impresiones de Search Console (se anota así).
   Si no está el archivo, se salta este paso y lo dice.
2. Autocompletado de Google (México, español) a partir de las cabezas de las fijas publicadas: una llamada cada 3 s,
   máximo 40 llamadas. Volumen vacío: el autocompletado no da volumen y no se inventa.
Las candidatas entran como "pendiente" al final de la cola, con su fuente. Después, quien escribe revisa que la
intención quepa en la voz de Ave (cartas, canciones, covers, guitarra, cantar). Lo que no quepa: estado "fuera".
Usa curl y openssl del sistema (sin librerías)."""
import base64, csv, glob, json, os, re, subprocess, sys, time, unicodedata, datetime

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))
LLAVE = os.path.expanduser("~/.secretos/avelina/search-console-lector.json")
SITIO = "https://avelina.com.mx/"
VER = "--ver" in sys.argv
NO_CABE = re.compile(r"cristian|alabanza|biblia|oraci[oó]n|dios|letra|lyrics|descargar|mp3|karaoke cristiano|cerca de mi|precio|clases|serenata|concierto|boletos", re.I)


def n(s):
    """Normaliza y ordena las palabras: «mon laferte antes de ti» = «antes de ti mon laferte»."""
    s = unicodedata.normalize("NFD", s.lower()); s = re.sub(r"[^a-z0-9ñ ]", " ", "".join(c for c in s if unicodedata.category(c) != "Mn"))
    return " ".join(sorted(s.split()))


def curl(*a):
    return subprocess.run(["curl", "-s", "--max-time", "30", *a], capture_output=True, text=True).stdout


def ya_tomadas():
    t = set()
    for f in glob.glob(os.path.join(RAIZ, "fuente/fijas/paginas/*.json")):
        p = json.load(open(f, encoding="utf-8")); t |= {n(x) for x in [p.get("cabeza", "")] + p.get("variantes", [])}
    for r in csv.DictReader(open(os.path.join(AQUI, "cola.csv"), encoding="utf-8")):
        t |= {n(x) for x in r["busquedas"].split(";")} | {n(r["intencion"])}
    if os.path.exists(os.path.join(AQUI, "cola_fuera.csv")):
        t |= {n(r["busqueda"]) for r in csv.DictReader(open(os.path.join(AQUI, "cola_fuera.csv"), encoding="utf-8"))}
    return t


def token_search_console():
    k = json.load(open(LLAVE, encoding="utf-8"))
    b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=").decode()
    ahora = int(time.time())
    cab = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    cuerpo = b64(json.dumps({"iss": k["client_email"], "scope": "https://www.googleapis.com/auth/webmasters.readonly",
                             "aud": "https://oauth2.googleapis.com/token", "iat": ahora, "exp": ahora + 3600}).encode())
    pem = os.path.join(AQUI, ".llave-temporal.pem")
    try:
        fd = os.open(pem, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600); os.write(fd, k["private_key"].encode()); os.close(fd)
        firma = subprocess.run(["openssl", "dgst", "-sha256", "-sign", pem], input=f"{cab}.{cuerpo}".encode(), capture_output=True).stdout
    finally:
        if os.path.exists(pem): os.remove(pem)
    jwt = f"{cab}.{cuerpo}.{b64(firma)}"
    r = json.loads(curl("-X", "POST", "https://oauth2.googleapis.com/token", "-d", "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer", "-d", f"assertion={jwt}") or "{}")
    if "access_token" not in r: raise SystemExit(f"Search Console no dio token: {r.get('error_description') or r}")
    return r["access_token"]


def de_search_console(tomadas):
    if not os.path.exists(LLAVE):
        print(f"(sin {LLAVE}: se salta Search Console)"); return []
    tok = token_search_console()
    hoy = datetime.date.today()
    q = json.dumps({"startDate": (hoy - datetime.timedelta(days=30)).isoformat(), "endDate": (hoy - datetime.timedelta(days=2)).isoformat(),
                    "dimensions": ["query"], "rowLimit": 1000})
    url = "https://www.googleapis.com/webmasters/v3/sites/" + SITIO.replace(":", "%3A").replace("/", "%2F") + "/searchAnalytics/query"
    r = json.loads(curl("-X", "POST", url, "-H", f"Authorization: Bearer {tok}", "-H", "Content-Type: application/json", "--data", q) or "{}")
    out = []
    for f in r.get("rows", []):
        c = f["keys"][0]
        if len(c.split()) >= 4 and f["impressions"] >= 10 and n(c) not in tomadas and not NO_CABE.search(c):
            out.append((c, int(f["impressions"]), "search console (impresiones 28 días)")); tomadas.add(n(c))
    print(f"Search Console: {len(r.get('rows', []))} consultas, {len(out)} candidatas")
    return out


def de_autocompletado(tomadas, maximo=40):
    semillas = []
    for f in sorted(glob.glob(os.path.join(RAIZ, "fuente/fijas/paginas/*.json"))):
        p = json.load(open(f, encoding="utf-8"))
        if p.get("estado") == "publicada": semillas.append((p.get("volumen", 0), p["cabeza"]))
    out = []
    for i, (_, s) in enumerate(sorted(semillas, reverse=True)[:maximo]):
        if i: time.sleep(3)
        txt = curl("-G", "https://suggestqueries.google.com/complete/search", "--data-urlencode", "client=firefox", "--data-urlencode", "hl=es",
                   "--data-urlencode", "gl=mx", "--data-urlencode", f"q={s} ")
        try: sug = json.loads(txt)[1]
        except Exception: continue
        for c in sug:
            if len(c.split()) >= 4 and n(c) not in tomadas and not NO_CABE.search(c):
                out.append((c, "", f"autocompletado de «{s}»")); tomadas.add(n(c))
    print(f"Autocompletado: {len(out)} candidatas")
    return out


def main():
    p = os.path.join(AQUI, "cola.csv")
    filas = list(csv.DictReader(open(p, encoding="utf-8"))); cols = list(filas[0].keys())
    pend = sum(r["estado"] == "pendiente" for r in filas)
    print(f"pendientes en la cola: {pend}")
    tomadas = ya_tomadas()
    maximo = int(sys.argv[sys.argv.index("--max") + 1]) if "--max" in sys.argv else 40
    nuevas = de_search_console(tomadas) + de_autocompletado(tomadas, maximo)
    if VER or not nuevas:
        for c, v, f in nuevas: print(f"  {c} · {v or 'sin volumen'} · {f}")
        return
    ultimo = max(int(r["orden"]) for r in filas)
    slugs = {r["slug"] for r in filas}
    for i, (c, v, f) in enumerate(nuevas, 1):
        s = re.sub(r"[^a-z0-9]+", "-", n(c)).strip("-")[:70]
        if s in slugs: continue
        slugs.add(s)
        filas.append(dict(orden=ultimo + i, slug=s, intencion=c, busquedas=c, volumen=v, familia="", tipo="", competencia="", fijas_sugeridas="",
                          fuente=f, estado="pendiente", publicada="", nota="revisar que quepa en su voz; fijas_sugeridas por llenar"))
    w = csv.DictWriter(open(p, "w", newline="", encoding="utf-8"), cols); w.writeheader(); w.writerows(filas)
    print(f"agregadas {len(nuevas)} a la cola")


if __name__ == "__main__": main()
