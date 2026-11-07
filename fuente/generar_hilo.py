#!/usr/bin/env python3
"""Borda el nombre Avelina puntada por puntada: hilo beige torcido y gastado, con luz, sombra y
pelusa, y un cabo suelto. La línea sale de una letra cursiva libre (OFL) y solo se usa como guía.
Necesita numpy, scipy, pillow y scikit-image. Uso: python3 fuente/generar_hilo.py fuente/oooh-baby.ttf."""
import math, os, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage as ni
from skimage.morphology import skeletonize
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 2800, 1200
HILO = [(0, "#6b5a44"), (.28, "#a8977c"), (.52, "#cfc1a5"), (.76, "#e6dcc5"), (1, "#f8f2e4")]
def rgb(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)
xs_ = [p for p, _ in HILO]; cs_ = np.array([rgb(c) for _, c in HILO])
def tono(L): return np.stack([np.interp(L, xs_, cs_[:, i]) for i in range(3)], -1)
def guia(ruta, texto="Avelina", tam=640):
    f = ImageFont.truetype(ruta, tam); im = Image.new("L", (W * 2, H * 2), 0); d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = d.textbbox((0, 0), texto, font=f); esc = 1
    d.text(((W * 2 - (x1 - x0)) / 2 - x0 - 120, (H * 2 - (y1 - y0)) / 2 - y0), texto, font=f, fill=255)
    m = np.asarray(im.resize((W, H), Image.LANCZOS), float) / 255
    et, n = ni.label(m > .35); tam = ni.sum(m > .35, et, range(1, n + 1))
    puntos = [c[::-1] for i, c in enumerate(ni.center_of_mass(m > .35, et, range(1, n + 1))) if tam[i] < 900]   # el punto de la i
    chico = np.isin(et, 1 + np.where(tam < 900)[0])
    return skeletonize(ni.binary_closing((m > .35) & ~chico, iterations=2)), puntos
def caminos(sk):
    """Convierte el esqueleto en tramos ordenados de puntos."""
    Y, X = np.nonzero(sk); pts = set(zip(Y.tolist(), X.tolist()))
    vec = lambda p: [(p[0] + a, p[1] + b) for a in (-1, 0, 1) for b in (-1, 0, 1) if (a or b) and (p[0] + a, p[1] + b) in pts]
    nodos = {p for p in pts if len(vec(p)) != 2}; usados = set(); tramos = []
    for n in sorted(nodos, key=lambda p: p[1]):
        for v in vec(n):
            if (n, v) in usados: continue
            t = [n, v]; usados.add((n, v)); prev, cur = n, v
            while cur not in nodos:
                nxt = [q for q in vec(cur) if q != prev and q not in t[-3:]]
                if not nxt: break
                prev, cur = cur, nxt[0]; t.append(cur)
            usados.add((t[-1], t[-2])); tramos.append(t)
    resto = pts - {p for t in tramos for p in t}
    while resto:
        c = resto.pop(); t = [c]
        while True:
            nxt = [q for q in vec(t[-1]) if q in resto]
            if not nxt: break
            resto.discard(nxt[0]); t.append(nxt[0])
        tramos.append(t)
    return [np.array(t, float)[:, ::-1] for t in tramos if len(t) > 30]
def suaviza(c, s=7):
    return np.c_[ni.gaussian_filter1d(c[:, 0], s, mode="nearest"), ni.gaussian_filter1d(c[:, 1], s, mode="nearest")]
class Tela:
    def __init__(s): s.c = np.zeros((H, W, 3)); s.a = np.zeros((H, W)); s.rr = random.Random(3)
    def puntada(s, x, y, ang, largo, ancho, brillo=1, desgaste=.3):
        r = int(largo / 2 + ancho + 4); x0, y0 = int(x) - r, int(y) - r; x1, y1 = x0 + 2 * r, y0 + 2 * r
        if x0 < 0 or y0 < 0 or x1 >= W or y1 >= H: return
        Y, X = np.mgrid[y0:y1, x0:x1].astype(float); dx, dy = X - x, Y - y; ca, sa = math.cos(ang), math.sin(ang)
        u = (dx * ca + dy * sa) / (largo / 2); v = dx * -sa + dy * ca
        hw = ancho / 2 * np.sqrt(np.clip(1 - u**4, 0, 1)) + 1e-3; vn = v / hw
        den = np.clip(1.25 - np.abs(vn) * 1, 0, 1) * (np.abs(u) < 1) * (np.abs(vn) < 1)
        z = np.sqrt(np.clip(1 - vn**2, 0, 1))
        # luz de arriba a la izquierda sobre un cordón redondo
        lx, ly = -.55, -.7; nx, ny = -sa * vn, ca * vn
        dif = np.clip(nx * lx + ny * ly + z * .62, 0, 1)
        fase = s.rr.uniform(0, 6.28); tor = (u * largo / 2 * .62 + v * 1.0)
        hebra = .5 + .5 * np.sin(tor / (ancho * .3) * math.tau / 2 + fase)            # las fibras torcidas del hilo
        fino = .5 + .5 * np.sin(tor / (ancho * .105) + fase * 2)
        L = (.2 + .72 * dif) * (.56 + .34 * hebra + .14 * fino) * (.72 + .28 * np.sqrt(np.clip(1 - np.abs(u)**3, 0, 1))) * brillo
        col = tono(np.clip(L, 0, 1)); al = np.clip(den * 3, 0, 1)
        raya = np.sin(tor / (ancho * .16) + fase * 3) + .9 * np.random.randn(*al.shape)
        al = al * (1 - (raya > 1.5 - desgaste * 1.1 - .7 * np.abs(vn)))                  # hebras gastadas que faltan
        A = al[..., None]; s.c[y0:y1, x0:x1] = s.c[y0:y1, x0:x1] * (1 - A) + col * A; s.a[y0:y1, x0:x1] = np.maximum(s.a[y0:y1, x0:x1], al)
    def borda(s, c, paso, largo, ancho, inclina=.2):
        d = np.r_[0, np.cumsum(np.hypot(*np.diff(c, axis=0).T))]; t = 0
        # el desgaste cambia a lo largo del hilo: tramos enteros y tramos casi rotos
        fase = s.rr.uniform(0, 99); onda = lambda q, f: math.sin(q / f + fase) * .6 + math.sin(q / (f * .37) + fase * 2) * .4
        while t < d[-1]:
            x, y = np.interp(t, d, c[:, 0]), np.interp(t, d, c[:, 1])
            x2, y2 = np.interp(t + 3, d, c[:, 0]), np.interp(t + 3, d, c[:, 1]); a = math.atan2(y2 - y, x2 - x) + s.rr.uniform(-.09, .09)
            gasto = min(1, max(0, .42 + .5 * onda(t, 70) + s.rr.uniform(-.14, .14)))
            sucio = .8 + .2 * onda(t, 150) + s.rr.uniform(-.1, .08)
            w = ancho * (1 - .34 * gasto) * s.rr.uniform(.88, 1.08); l = largo * s.rr.uniform(.88, 1.1)
            if gasto > .68 and s.rr.random() < .6:                # el hilo se abre en dos hebras
                nx, ny = -math.sin(a), math.cos(a); o = ancho * s.rr.uniform(.26, .42)
                for sg in (-1, 1): s.puntada(x + sg * o * nx, y + sg * o * ny, a + inclina + sg * .1, l, w * .55, sucio * s.rr.uniform(.85, 1.05), gasto)
            else:
                s.puntada(x + s.rr.uniform(-1.1, 1.1), y + s.rr.uniform(-1.1, 1.1), a + inclina, l, w, sucio, gasto)
            t += paso * s.rr.uniform(.9, 1.12)
    def pelusa(s, c, n, alcance):
        im = Image.new("L", (W * 2, H * 2), 0); d = ImageDraw.Draw(im)
        for _ in range(n):
            x, y = c[s.rr.randrange(len(c))]; a = s.rr.uniform(0, 6.28); x += alcance * .6 * math.cos(a); y += alcance * .6 * math.sin(a); l = s.rr.uniform(4, 15); pts = []
            for i in range(5): pts.append((x * 2, y * 2)); a += s.rr.gauss(0, .4); x += l / 4 * math.cos(a); y += l / 4 * math.sin(a)
            d.line(pts, fill=s.rr.randint(60, 170), width=1)
        return np.asarray(im.resize((W, H), Image.LANCZOS), float) / 255
def _deshilacha(s, p, dirv, ancho):
    """Punta del cabo abierta en fibras sueltas."""
    a0 = math.atan2(dirv[1], dirv[0])
    for i in range(9):
        a = a0 + s.rr.uniform(-.55, .55); x, y = p; n = s.rr.randint(5, 13)
        for k in range(n):
            s.puntada(x, y, a, ancho * .95, ancho * .2, s.rr.uniform(.8, 1.05), .7); a += s.rr.gauss(0, .16); x += ancho * .6 * math.cos(a); y += ancho * .6 * math.sin(a)
Tela.deshilacha = _deshilacha
def cabo(p0, semilla=2):
    """Hilo suelto que sale de la última letra."""
    r = random.Random(semilla); x, y = p0; pts = [(x, y)]
    guia_ = [(x + 60, y + 14), (x + 130, y - 14), (x + 205, y + 16), (x + 262, y + 74), (x + 330, y + 96), (x + 400, y + 66)]
    q = np.array(pts + guia_, float); t = np.linspace(0, len(q) - 1, 420); return np.c_[np.interp(t, range(len(q)), q[:, 0]), np.interp(t, range(len(q)), q[:, 1])]
def hilo(ruta, salida, ancho=8):
    sk, puntos = guia(ruta); tr = [suaviza(c) for c in caminos(sk)]; tr.sort(key=lambda c: c[:, 0].min())
    t = Tela()
    for x, y in puntos:                        # nudo francés
        for i in range(7): t.puntada(x + 3 * math.cos(i * .9), y + 3 * math.sin(i * .9), i * .9 + 1.3, ancho * 1.5, ancho * .95, t.rr.uniform(.88, 1.08))
    for c in tr: t.borda(c, ancho * 1.0, ancho * 2.5, ancho)
    final = max(tr, key=lambda c: c[:, 0].max()); fin = final[np.argmax(final[:, 0])]
    suelto = suaviza(cabo(fin), 16); t.borda(suelto, ancho * .6, ancho * 1.7, ancho * .8, .16)
    todo = np.vstack(tr + [suelto]); p = t.pelusa(todo, 2200, ancho * .8)
    fin_cabo = suelto[-1]; t.deshilacha(fin_cabo, suelto[-1] - suelto[-30], ancho)
    # puntas abiertas del cabo
    a = np.clip(t.a, 0, 1); col = t.c
    k = (p * .62)[..., None]; col = col * (1 - k * (a[..., None] < .5)) + rgb("#ece0c6") * k * (a[..., None] < .5); a = np.maximum(a, p * .62)
    sombra = ni.gaussian_filter(np.roll(a, (5, 4), (0, 1)), 3.2) * .55; contacto = ni.gaussian_filter(a, 1.4) * .4; sa = np.maximum(sombra, contacto)
    salida_a = a + sa * (1 - a); C = (col * a[..., None] + rgb("#150c06") * (sa * (1 - a))[..., None]) / np.maximum(salida_a, 1e-4)[..., None]
    o = np.dstack([np.clip(C, 0, 255), salida_a * 255]).astype("uint8"); im = Image.fromarray(o, "RGBA")
    caja = im.getbbox(); im = im.crop((max(caja[0] - 6, 0), max(caja[1] - 6, 0), min(caja[2] + 6, W), min(caja[3] + 6, H)))
    im.save(salida, quality=88, method=6); print(os.path.basename(salida), im.size, os.path.getsize(salida) // 1024, "KB")
if __name__ == "__main__":
    hilo(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, "img/marca/avelina-hilo.webp"))
