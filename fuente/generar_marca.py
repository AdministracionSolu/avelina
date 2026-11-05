#!/usr/bin/env python3
"""Genera las texturas, los marcos y el «Avelina» bordado. Todo se dibuja aquí con código:
no usa ninguna imagen de referencia. Uso: python3 fuente/generar_marca.py  (pide pillow y numpy).
Solo hace falta correrlo si cambias el trazo o una textura; el sitio usa los archivos ya generados."""
import json, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(RAIZ, "img", "marca")
rng = np.random.default_rng(7); random.seed(7)
def hexrgb(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)
def rampa(v, *cs):
    v = np.clip(v, 0, 1)[..., None]; n = len(cs) - 1; out = np.zeros(v.shape[:-1] + (3,))
    for i in range(n):
        a, b = i / n, (i + 1) / n
        m = ((v >= a) & (v <= b)).astype(float); t = (v - a) / (b - a)
        out = out * (1 - m) + m * (hexrgb(cs[i]) * (1 - t) + hexrgb(cs[i + 1]) * t)
    return out
def ruido(n, escala, h=None):
    """Ruido suave que se repite sin costuras."""
    h = h or n; f = rng.normal(size=(h, n)); F = np.fft.fft2(f)
    ky = np.fft.fftfreq(h)[:, None] * h; kx = np.fft.fftfreq(n)[None, :] * n
    F *= np.exp(-(kx**2 + ky**2) / (2 * (max(n, h) / escala) ** 2))
    r = np.fft.ifft2(F).real; return (r - r.min()) / (r.max() - r.min())
def trama(n=768, paso=4):
    """Tejido liso: hilos que pasan por arriba y por abajo, cada uno un poco distinto."""
    y, x = np.mgrid[0:n, 0:n]; ix, iy = x // paso, y // paso
    fx, fy = (x % paso + .5) / paso, (y % paso + .5) / paso
    k = n // paso; gx = rng.normal(0, 1, k); gy = rng.normal(0, 1, k)
    arriba = (ix + iy) % 2 == 0
    perfil = np.where(arriba, np.sin(fx * np.pi), np.sin(fy * np.pi)) * np.where(arriba, .75 + .25 * np.sin(fy * np.pi), .75 + .25 * np.sin(fx * np.pi))
    grosor = np.where(arriba, gx[ix % k], gy[iy % k]) * .09
    nudos = (ruido(n, 120) - .5) * .12 + (ruido(n, 6) - .5) * .28
    return np.clip(.22 + .62 * perfil + grosor + nudos, 0, 1)
def guarda(a, nombre, q=78):
    Image.fromarray(np.clip(a, 0, 255).astype("uint8")).save(os.path.join(M, nombre), quality=q, method=6)

def telas():
    t = trama(768, 4); guarda(rampa(t, "#cdbf a4".replace(" ", ""), "#e9dfca", "#f8f2e4"), "lino.webp")
    t = trama(768, 3); guarda(rampa(t * .9 + ruido(768, 12) * .1, "#3d0710", "#6d0f1b", "#96202c"), "vino.webp")
    t = trama(768, 3); guarda(rampa(t * .9 + ruido(768, 12) * .1, "#101f55", "#1d3580", "#3453a8"), "cobalto.webp")
    t = trama(512, 4); guarda(rampa(t, "#8d8d8d", "#d9d9d9", "#ffffff"), "trama.webp", 72)

def papel():
    n = 900; base = ruido(n, 260) * .5 + ruido(n, 40) * .3 + ruido(n, 8) * .2
    a = rampa(base, "#efe6d2", "#f7f0e0", "#fdf9ee"); im = Image.fromarray(a.astype("uint8")); d = ImageDraw.Draw(im, "RGBA")
    for _ in range(260):
        x, y = random.uniform(0, n), random.uniform(0, n); an = random.uniform(0, 6.3); L = random.uniform(8, 34)
        c = random.choice([(150, 118, 70, 110), (120, 92, 58, 90), (190, 165, 120, 120)])
        pts = [(x + math.cos(an + i * .12) * L * i / 5, y + math.sin(an + i * .12) * L * i / 5) for i in range(6)]
        for dx in (-n, 0, n):
            for dy in (-n, 0, n): d.line([(p + dx, q + dy) for p, q in pts], fill=c, width=1)
    im.save(os.path.join(M, "papel.webp"), quality=80, method=6)

def cianotipo():
    """Mar impreso en azul sobre papel doblado."""
    W, H = 1800, 1100; y, x = np.mgrid[0:H, 0:W].astype(float); u, w = x / W, y / H
    g1, g2, g3 = ruido(W, 420, H) - .5, ruido(W, 160, H) - .5, ruido(W, 60, H) - .5
    yy = w + g1 * .16 + g2 * .05 + np.sin(u * 9 + g1 * 6) * .012
    yl = w + g1 * .05; v = .17 + .07 * np.sin(yl * 170 + g1 * 5) + .035 * np.sin(yl * 520 + g2 * 5)
    for c, gro, fuerza in ((.34, .012, .55), (.47, .017, .95), (.60, .02, .8), (.73, .022, .65), (.86, .03, .5)):
        lado = np.clip((np.sin(u * 5 + c * 40 + g1 * 9) + .35) * 1.6, 0, 1)
        d_ = (yy - c - np.sin(u * 13 + c * 30) * .018) / gro
        espuma = np.exp(-d_ ** 2) * lado * (.6 + 1.2 * ruido(W, 45, H)) + np.clip(d_, 0, 5) / 5 * np.exp(-np.clip(d_, 0, 9) / 2.4) * lado * .8
        v += espuma * fuerza
    v += np.clip((w - .78) * 2.4, 0, 1) * (.35 + .45 * ruido(W, 70, H)) + np.clip((.22 - w) * 2.2, 0, 1) * .4
    v += (ruido(W, 300, H) - .5) * .12 + (ruido(W, 8, H) - .5) * .07
    for fx in (.33, .67):
        v += np.exp(-((u - fx) * W / 2.0) ** 2) * .2 - np.exp(-((u - fx - .003) * W / 6) ** 2) * .06
    for fy in (.26, .52, .78):
        v += np.exp(-((w - fy) * H / 2.0) ** 2) * .22 - np.exp(-((w - fy - .004) * H / 6) ** 2) * .06
    guarda(rampa(v, "#0a1a5c", "#17358f", "#3e6bb4", "#b4c8dc", "#f1ebdc"), "cianotipo.webp", 74)

def estrella(d, cx, cy, r, c, gi=0):
    p = []
    for i in range(10):
        rr = r * (1 if i % 2 == 0 else random.uniform(.36, .46)); an = gi + i * math.pi / 5 - math.pi / 2
        p.append((cx + math.cos(an) * rr * random.uniform(.93, 1.08), cy + math.sin(an) * rr * random.uniform(.93, 1.08)))
    d.polygon(p, fill=c)
def estrellas():
    n = 900; K = 2; a = rampa(ruido(n, 90) * .7 + ruido(n, 12) * .3, "#16245f", "#20327a", "#2d3b70")
    t = trama(n // 1 if n % 4 == 0 else 900, 3)[:n, :n, None]; a = a * (.86 + .22 * t)
    capa = Image.new("RGBA", (n * K, n * K), (0, 0, 0, 0)); d = ImageDraw.Draw(capa)
    puestos = []
    while len(puestos) < 46:
        x, y = random.uniform(0, n), random.uniform(0, n)
        if all(min(abs(x - p), n - abs(x - p)) ** 2 + min(abs(y - q), n - abs(y - q)) ** 2 > 90 ** 2 for p, q in puestos): puestos.append((x, y))
    for x, y in puestos:
        r = random.uniform(10, 19); c = random.choice([(232, 196, 110, 255), (247, 232, 190, 255), (214, 170, 84, 255)]); g = random.uniform(-.4, .4); st = random.getstate()
        for dx in (-n, 0, n):
            for dy in (-n, 0, n): random.setstate(st); estrella(d, (x + dx) * K, (y + dy) * K, r * K, c, g)
    for _ in range(300):
        x, y = random.uniform(0, n), random.uniform(0, n); r = random.uniform(.5, 1.5) * K
        d.ellipse([x * K - r, y * K - r, x * K + r, y * K + r], fill=(240, 228, 200, 170))
    capa = capa.resize((n, n), Image.LANCZOS); im = Image.fromarray(a.astype("uint8")).convert("RGBA"); im.alpha_composite(capa)
    im.convert("RGB").save(os.path.join(M, "estrellas-fondo.webp"), quality=80, method=6)

def marco_oro(nombre, ancho, alto_img=420):
    """Moldura dorada antigua: gallones torcidos, cuentas, inglete real, luz de arriba y pátina."""
    n = alto_img; y, x = np.mgrid[0:n, 0:n].astype(float)
    d = np.minimum(np.minimum(x, n - 1 - x), np.minimum(y, n - 1 - y)); u = np.clip(d / ancho, 0, 1)
    largo = np.where(np.minimum(x, n - 1 - x) < np.minimum(y, n - 1 - y), y, x)
    per = 420 / 30 if ancho > 50 else 420 / 42
    bocel = np.sin(np.clip(u / .46, 0, 1) * np.pi)
    gallon = (np.cos((largo + d * 1.1) / per * 2 * np.pi) * .5 + .5) * bocel
    cuenta = (np.cos(largo / (per * .62) * 2 * np.pi) * .5 + .5) ** .8 * np.exp(-((u - .64) / .075) ** 2)
    h = (bocel * 1.05 + gallon * .75 + cuenta * .85 + np.exp(-((u - .52) / .03) ** 2) * .35
         + np.exp(-((u - .76) / .03) ** 2) * .35 + np.clip((u - .80) / .2, 0, 1) * -.5 + np.exp(-((u - .95) / .035) ** 2) * .55)
    h = h + (ruido(n, 90) - .5) * .16 + (ruido(n, 14) - .5) * .10
    gy, gx = np.gradient(h * ancho * .22)
    nz = 1 / np.sqrt(gx**2 + gy**2 + 1); luz = (gx * .5 + gy * .62 + .58) * nz
    v = np.clip(.30 + luz * .72, 0, 1)
    hueco = np.clip(1 - h / .55, 0, 1); pat = np.clip(ruido(n, 40) * 1.7 - .55, 0, 1)
    v = v * (1 - hueco * .55) * (1 - pat * .22)
    v *= 1 - .20 * np.exp(-((u - .99) / .04) ** 2)
    a = rampa(v, "#1e1006", "#4c2f0d", "#8a6321", "#c49a44", "#ecd591")
    a = a * (.96 + .08 * (ruido(n, 30) - .5))[..., None]
    a[u >= 1] = hexrgb("#1b0a06"); guarda(a, nombre, 88)

def encaje():
    """Orilla de crochet: malla de hoyitos cuadrados y ondas por fuera."""
    n, b, K, paso = 360, 60, 4, 30
    im = Image.new("RGBA", (n * K, n * K), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = (247, 240, 224, 255)
    ini = 13; d.rectangle([ini * K, ini * K, (n - ini) * K, (n - ini) * K], fill=c)
    for i in range(0, n + 1, paso):
        for px, py in ((i, ini), (i, n - ini), (ini, i), (n - ini, i)):
            r = paso * .52 * K; d.ellipse([px * K - r, py * K - r, px * K + r, py * K + r], fill=c)
    celda = 7.5
    for gy in range(int(n / celda)):
        for gx in range(int(n / celda)):
            cx, cy = (gx + .5) * celda, (gy + .5) * celda; e = min(cx, cy, n - cx, n - cy)
            if 17 < e < b - 4 and not (gx % 8 in (0, 1) and gy % 8 in (0, 1)):
                r = 2.2 * K; d.rectangle([cx * K - r, cy * K - r, cx * K + r, cy * K + r], fill=(0, 0, 0, 0))
    d.rectangle([b * K, b * K, (n - b) * K, (n - b) * K], fill=(0, 0, 0, 0))
    im = im.resize((n, n), Image.LANCZOS); a = np.array(im).astype(float)
    a[..., :3] *= (.92 + .12 * ruido(n, 40))[..., None]; a[..., :3] = np.clip(a[..., :3], 0, 255)
    Image.fromarray(a.astype("uint8")).save(os.path.join(M, "encaje.webp"), quality=88, method=6)

# ---------- el hilo ----------
def catmull(pts, pasos=26):
    P = [pts[0]] + list(pts) + [pts[-1]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = map(np.array, P[i - 1:i + 3])
        for t in np.linspace(0, 1, pasos, endpoint=False):
            out.append(.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t ** 3))
    out.append(np.array(pts[-1], float)); return np.array(out, float)
TRAZO = [(-60, 452), (20, 438), (86, 392), (150, 300), (214, 178), (262, 84), (284, 150), (292, 232),
         (226, 236), (168, 262), (226, 282), (302, 270), (318, 338), (352, 372), (394, 330), (404, 262),
         (398, 240), (418, 300), (436, 362), (464, 310), (486, 244), (520, 262), (556, 292), (592, 262), (574, 226), (534, 240), (516, 300), (536, 356), (584, 366), (628, 326),
         (672, 240), (712, 136), (706, 78), (672, 92), (652, 190), (654, 310), (682, 366), (724, 340), (752, 262), (750, 322), (774, 366), (816, 336), (842, 256),
         (842, 312), (840, 366), (866, 292), (906, 248), (930, 282), (928, 340), (954, 368), (1000, 340), (1034, 276), (1092, 246), (1046, 238), (1012, 286), (1016, 348), (1052, 356), (1088, 306), (1102, 246),
         (1098, 326), (1124, 368), (1176, 342), (1250, 276), (1330, 316), (1400, 356), (1470, 300)]
PUNTO = [(762, 186), (768, 178), (776, 186), (768, 196), (760, 188), (770, 182)]
ANCHO_V, ALTO_V = 1410, 500
def hilo(capa, ruta, ancho, base, s0=0.0):
    """Dibuja un hilo torcido a lo largo de la ruta: hebras diagonales con luz y sombra."""
    d = ImageDraw.Draw(capa); seg = np.diff(ruta, axis=0); L = np.hypot(*seg.T); acum = s0
    hebra = ancho * .8
    for (p, v, l) in zip(ruta[:-1], seg, L):
        if l == 0: continue
        t = v / l; nrm = np.array([-t[1], t[0]])
        for k in range(max(1, int(l / .9))):
            q = p + t * k * .9; s = acum + k * .9; f = (s / hebra) % 1
            caras = 7
            for j in range(caras):
                w = (j + .5) / caras * 2 - 1; w2 = (j + 1.5) / caras * 2 - 1
                a = q + nrm * (w * ancho / 2) + t * (w * ancho * .45); b = q + nrm * (w2 * ancho / 2) + t * (w2 * ancho * .45)
                redondo = math.sqrt(max(0, 1 - w * w)); torsion = .86 + .14 * math.cos(((f + (w + 1) * .25) % 1) * 2 * math.pi)
                sh = (.55 + .55 * redondo) * torsion * (1.04 - .14 * w)
                c = tuple(int(np.clip(x * sh + (16 * redondo * torsion ** 6), 0, 255)) for x in base)
                d.line([tuple(a), tuple(b)], fill=c + (255,), width=2)
        acum += l
    return acum
def borda(nombre, base, ancho_px=2000, sombra=(36, 8, 8)):
    K = ancho_px / ANCHO_V; W, H = ancho_px, int(ALTO_V * K); gr = 15 * K
    ruta = catmull(TRAZO) * K; punto = catmull(PUNTO) * K
    capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    hilo(capa, ruta, gr, base); hilo(capa, punto, gr * .82, base)
    d = ImageDraw.Draw(capa)
    # puntadas chiquitas que sujetan el hilo a la tela
    seg = np.hypot(*np.diff(ruta, axis=0).T); s = np.cumsum(seg); proximo = 70 * K
    oscuro = tuple(int(x * .74) for x in base) + (255,)
    for i in range(len(s)):
        if s[i] >= proximo:
            t = ruta[i + 1] - ruta[i]; t /= np.hypot(*t) + 1e-6; n_ = np.array([-t[1], t[0]])
            a = ruta[i] + n_ * gr * .68 + t * gr * .2; b = ruta[i] - n_ * gr * .68 - t * gr * .2
            d.line([tuple(a), tuple(b)], fill=oscuro, width=max(2, int(gr * .09))); proximo += random.uniform(80, 130) * K
    # pelusa
    for i in range(0, len(ruta), 5):
        if random.random() < .5:
            p = ruta[i]; an = random.uniform(0, 6.3); r = gr * random.uniform(.5, .95)
            c = tuple(int(min(255, x * 1.15)) for x in base) + (120,)
            d.line([tuple(p + np.array([math.cos(an), math.sin(an)]) * gr * .35), tuple(p + np.array([math.cos(an), math.sin(an)]) * r)], fill=c, width=1)
    alfa = capa.split()[3]
    sh = Image.new("RGBA", (W, H), sombra + (0,)); sh.putalpha(alfa.point(lambda v: int(v * .55)).filter(ImageFilter.GaussianBlur(gr * .22)))
    fondo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fondo.alpha_composite(sh, (int(gr * .16), int(gr * .24))); fondo.alpha_composite(capa)
    fondo.save(os.path.join(M, nombre), quality=88, method=6, alpha_quality=92)
    return ruta / K, punto / K
def tira_hilo():
    """Hilo horizontal que se repite, para separar secciones."""
    W, H = 1200, 40; K = 1; xs = np.arange(-40, W + 41, 1.0)
    ys = 20 + np.sin(xs / W * 2 * np.pi * 3) * 7 + np.sin(xs / W * 2 * np.pi * 7) * 2.4
    ruta = np.c_[xs, ys]
    for nombre, base in (("hilo-vino.webp", (122, 20, 34)), ("hilo-crema.webp", (232, 214, 176)), ("hilo-oro.webp", (214, 166, 74))):
        c = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hilo(c, ruta, 6.5, base); c.save(os.path.join(M, nombre), quality=88, method=6, alpha_quality=90)
def svg_trazo(ruta, paso=9):
    p = ruta[::paso]; return "M" + " ".join(f"{x:.0f} {y:.0f}" for x, y in p)
if __name__ == "__main__":
    telas(); papel(); cianotipo(); estrellas(); encaje(); tira_hilo()
    marco_oro("marco-oro.webp", 70); marco_oro("marco-fino.webp", 38)
    r, p = borda("avelina-hilo.webp", (128, 20, 36)); borda("avelina-hilo-crema.webp", (240, 224, 190), 1200, (10, 5, 5))
    json.dump({"ruta": svg_trazo(r), "punto": svg_trazo(p, 6), "w": ANCHO_V, "h": ALTO_V}, open(os.path.join(RAIZ, "fuente", "trazo.json"), "w"))
    print("listo")
