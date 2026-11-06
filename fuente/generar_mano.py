#!/usr/bin/env python3
"""Crea fonts/avelina-mano.woff2 desde Nothing You Could Do (Kimberly Geswein, licencia OFL):
letras más angostas y cada letra vuelta a trazar con la textura seca de un lápiz.
Necesita fonttools, brotli, numpy, scipy, pillow y scikit-image.
Uso: python3 fuente/generar_mano.py  (desde la raíz del repo)."""
import os, tempfile
import numpy as np
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ni
from skimage import measure
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANGOSTA, ESPACIO = .82, .84
LETRAS = "".join(chr(c) for c in range(32, 127)) + "áéíóúüñÁÉÍÓÚÜÑ¿¡·…–—“”‘’"
ORIGEN = os.path.join(RAIZ, "fuente/nothing-you-could-do.ttf")
op = subset.Options(); op.layout_features = []; op.hinting = False; op.notdef_outline = True
f = TTFont(ORIGEN); s = subset.Subsetter(op); s.populate(text=LETRAS); s.subset(f)
gs = f.getGlyphSet(); glyf, hm = f["glyf"], f["hmtx"]; nuevos = {}
for n in f.getGlyphOrder():
    p = TTGlyphPen(gs); gs[n].draw(TransformPen(p, (ANGOSTA, 0, 0, 1, 0, 0))); nuevos[n] = p.glyph()
for n, g in nuevos.items():
    glyf[n] = g; a, l = hm[n]; hm[n] = (round(a * ANGOSTA), round(l * ANGOSTA))
for n in ("space", "uni00A0"):
    if n in hm.metrics: hm[n] = (round(hm[n][0] * ESPACIO), 0)
for t in ("GPOS", "GSUB", "kern", "gasp", "hdmx", "VDMX", "LTSH", "fpgm", "prep", "cvt "):
    if t in f: del f[t]
tmp = os.path.join(tempfile.mkdtemp(), "base.ttf"); f.save(tmp)
upm = f["head"].unitsPerEm; R = 640                     # píxeles por em para volver a trazar
base = ImageFont.truetype(tmp, R); cmap = f.getBestCmap(); k = upm / R
def lapiz(ch, semilla):
    W, H, X0, Y0 = int(R * 2.4), int(R * 2.1), int(R * .6), int(R * 1.35)
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).text((X0, Y0), ch, font=base, fill=255, anchor="ls")
    m = np.asarray(im, float) / 255
    if m.max() == 0: return None
    r = np.random.default_rng(semilla)
    def grano(sig):
        z = ni.gaussian_filter(r.standard_normal((H, W)), sig); return z / z.std()
    # orilla seca: el borde tiembla y se abre en pequeños dientes del papel
    campo = ni.gaussian_filter(m, 3.4)
    borde = (campo > .31 + .1 * grano(7) + .09 * grano(2.2)) & (campo > .14)
    # la mina se salta el grano del papel, más cerca de las orillas
    dentro = ni.distance_transform_edt(borde); cerca = np.clip(1 - dentro / 15, .22, 1)
    huecos = grano(1.9) > (2.05 - .7 * cerca) ; rayas = ni.gaussian_filter(r.standard_normal((H, W)), (1, 6)); rayas = rayas / rayas.std() > 2.3
    t = borde & ~huecos & ~rayas
    t = ni.binary_opening(t, iterations=1)
    et, n = ni.label(t, structure=np.ones((3, 3)))              # sin polvo suelto alrededor de la letra
    if n:
        tam = ni.sum(t, et, range(1, n + 1)); t = np.isin(et, 1 + np.where(tam >= 90)[0])
    return t, X0, Y0
hechos = set()
for c, n in cmap.items():
    if n in hechos or chr(c).isspace() or c == 0xA0: continue
    hechos.add(n); res = lapiz(chr(c), c)
    if res is None: continue
    t, X0, Y0 = res; p = TTGlyphPen(None); puntos = 0
    for q in measure.find_contours(np.pad(t, 1).astype(float), .5, positive_orientation="high"):
        if len(q) < 8: continue
        q = measure.approximate_polygon(q, .75)
        if len(q) < 4: continue
        xy = [(round((b - 1 - X0) * k), round((Y0 - (a - 1)) * k)) for a, b in q[:-1]]
        p.moveTo(xy[0]); [p.lineTo(v) for v in xy[1:]]; p.closePath(); puntos += len(xy)
    glyf[n] = p.glyph()
for r in f["name"].names:
    nuevo = {1: "Avelina Mano", 3: "Avelina Mano Regular", 4: "Avelina Mano", 6: "AvelinaMano-Regular", 16: "Avelina Mano"}.get(r.nameID)
    if nuevo: r.string = nuevo
f.flavor = "woff2"; f.save(os.path.join(RAIZ, "fonts/avelina-mano.woff2"))
f.flavor = None; f.save(os.environ.get("MANO_TTF", tmp + ".fin.ttf"))
print(os.path.getsize(os.path.join(RAIZ, "fonts/avelina-mano.woff2")) // 1024, "KB")
