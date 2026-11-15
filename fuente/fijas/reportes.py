#!/usr/bin/env python3
"""Rehace COVERS_A_GRABAR.md y AVANCE.md a partir de paginas/*.json. Uso: python3 fuente/fijas/reportes.py"""
import glob, json, os
AQUI = os.path.dirname(os.path.abspath(__file__))
ps = [json.load(open(f, encoding="utf-8")) for f in sorted(glob.glob(os.path.join(AQUI, "paginas", "*.json")))]
ps.sort(key=lambda p: -p.get("volumen", 0))

# Covers: todo lo de canciones ajenas que espera un video de Ave
cv = [p for p in ps if p["tipo"] in ("cover", "artista") and not (p.get("cover") or {}).get("video")]
L = ["# Covers que Ave tiene que grabar", "",
     "Ordenados por búsquedas al mes en México (cabeza + variantes, Planificador de Google Ads, nov-2026).",
     "Una página de cover no se publica hasta que su video esté en YouTube. Las de artista se publican con el video de",
     "cualquiera de sus canciones. Guitarra y voz, como todo lo suyo. **Nunca se pone la letra en el sitio.**", "",
     "Cuando suba uno: agrega en la página `\"cover\": {..., \"video\": {\"id\": \"<id de YouTube>\", \"fecha\": \"AAAA-MM-DD\"}}`, guarda",
     "la miniatura en `img/videos/<id>.webp`, quita `espera_video` y corre `python3 fuente/fijas/generar.py`.", "",
     "| # | Qué grabar | Artista o canción | Búsquedas al mes | Página | Escrita |", "|---|---|---|---|---|---|"]
for i, p in enumerate(cv, 1):
    que = (p.get("cover") or {}).get("cancion") or ("cualquier canción de " + p["cabeza"].replace("canciones de ", "")) if p["tipo"] == "artista" else (p.get("cover") or {}).get("cancion", p["cabeza"])
    L.append(f"| {i} | {que} | {p['cabeza']} | {p.get('volumen', 0):,} | /{p['slug']}/ | {'no (esqueleto)' if p.get('esqueleto') else 'sí'} |")
open(os.path.join(AQUI, "COVERS_A_GRABAR.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")

# Avance
est = lambda p: "esqueleto" if p.get("esqueleto") else ("espera video" if p.get("espera_video") else "espera texto de Ave" if p.get("espera_texto") else p["estado"])
from collections import Counter
c = Counter(est(p) for p in ps); t = Counter((p["tipo"], est(p)) for p in ps)
A = ["# Avance de las fijas de Avelina", "", "Se rehace con `python3 fuente/fijas/reportes.py`. Quien retome: sigue con el esqueleto de más volumen",
     "(tabla de abajo), lee el top 3 si la cabeza es de 10K o más, escribe su JSON y corre `generar.py --vista`.", "",
     "| Estado | Páginas |", "|---|---|"] + [f"| {k} | {v} |" for k, v in c.most_common()] + ["", "| Tipo | Estado | Páginas |", "|---|---|---|"] + \
    [f"| {a} | {b} | {v} |" for (a, b), v in sorted(t.items())] + ["", "## Esqueletos por escribir (de mayor a menor volumen)", ""] + \
    [f"- {p['slug']} ({p['tipo']}, {p.get('volumen', 0):,})" for p in ps if p.get("esqueleto")]
open(os.path.join(AQUI, "AVANCE.md"), "w", encoding="utf-8").write("\n".join(A) + "\n")
print(f"covers por grabar: {len(cv)} · " + ", ".join(f"{k}: {v}" for k, v in c.items()))
