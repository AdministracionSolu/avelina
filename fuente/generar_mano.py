#!/usr/bin/env python3
"""Crea fonts/avelina-mano.woff2 desde Nothing You Could Do (Kimberly Geswein, licencia OFL):
letras más angostas y espacios más cortos para acercarse a una letra de bolígrafo.
Necesita fonttools y brotli. Uso: python3 fuente/generar_mano.py  (desde la raíz del repo)."""
import os
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANGOSTA, ESPACIO = .82, .84
f = TTFont(os.path.join(RAIZ, "fuente/nothing-you-could-do.ttf")); gs = f.getGlyphSet(); glyf, hm = f["glyf"], f["hmtx"]; nuevos = {}
for n in f.getGlyphOrder():
    p = TTGlyphPen(gs); gs[n].draw(TransformPen(p, (ANGOSTA, 0, 0, 1, 0, 0))); nuevos[n] = p.glyph()
for n, g in nuevos.items():
    glyf[n] = g; a, l = hm[n]; hm[n] = (round(a * ANGOSTA), round(l * ANGOSTA))
for n in ("space", "uni00A0"):
    if n in hm.metrics: hm[n] = (round(hm[n][0] * ESPACIO), 0)
for t in ("fpgm", "prep", "cvt ", "hdmx", "VDMX", "LTSH", "gasp", "GPOS", "kern"):
    if t in f: del f[t]
for r in f["name"].names:
    nuevo = {1: "Avelina Mano", 3: "Avelina Mano Regular", 4: "Avelina Mano", 6: "AvelinaMano-Regular", 16: "Avelina Mano"}.get(r.nameID)
    if nuevo: r.string = nuevo
f.flavor = "woff2"; f.save(os.path.join(RAIZ, "fonts/avelina-mano.woff2"))
print(os.path.getsize(os.path.join(RAIZ, "fonts/avelina-mano.woff2")) // 1024, "KB")
