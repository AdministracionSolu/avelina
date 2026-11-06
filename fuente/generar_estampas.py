#!/usr/bin/env python3
"""Dibuja las estampas de cada canción y los sellos de cera. Son dibujos propios: las fotos de
inspiración son de otras personas y nunca entran al sitio. Las aves salen del manual de Avelina.
Necesita numpy, scipy y pillow. Uso: python3 fuente/generar_estampas.py  (desde la raíz del repo)."""
import math, os, random, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage as ni
from generar_materiales import ruido, rgb, tono, golondrinas, grabado, RAIZ
SAL = os.path.join(RAIZ, "img/estampas"); os.makedirs(SAL, exist_ok=True)
W, H = 800, 1000; K = 2           # K: se dibuja al doble y se reduce para que las líneas queden finas
AZUL, ROJO, VINO, OCRE = "#1c356d", "#b3261e", "#5b201d", "#b8863a"
CIELO = "#8fb0dc"
def lienzo(): im = Image.new("L", (W * K, H * K), 0); return im, ImageDraw.Draw(im)
def P(x, y): return (x * K, y * K)
def poli(d, pts, f=255): d.polygon([P(*p) for p in pts], fill=f)
def linea(d, pts, w=3, f=255): d.line([P(*p) for p in pts], fill=f, width=int(w * K), joint="curve")
def disco(d, x, y, r, f=255): d.ellipse([*P(x - r, y - r), *P(x + r, y + r)], fill=f)
def ola(y, amp, per, fase=0, x0=46, x1=754): return [(x, y + amp * math.sin((x + fase) / per * math.tau)) for x in range(x0, x1 + 1, 6)]
def rayado(m, paso=9, angulo=.5, grueso=.5):
    """Tinta de línea, como un grabado: rayas dentro de la forma."""
    a = np.asarray(m, float) / 255; h, w = a.shape; Y, X = np.mgrid[0:h, 0:w].astype(float)
    f = (X * math.cos(angulo) + Y * math.sin(angulo)) / (paso * K)
    return Image.fromarray(((((f % 1) < grueso) * a) * 255).astype("uint8"))
def ave(i, tam, giro, espejo=False):
    aves = golondrinas(); g = aves[i % len(aves)]
    if espejo: g = g.transpose(Image.FLIP_LEFT_RIGHT)
    f = tam * K / max(g.size)
    return g.resize((int(g.width * f), int(g.height * f)), Image.LANCZOS).rotate(giro, expand=True, resample=Image.BICUBIC)
def pega(capa, g, x, y, f=255): capa.paste(f, (int(x * K - g.width / 2), int(y * K - g.height / 2)), g)
def paloma(n, tam, giro=0, espejo=False):
    g = Image.open(os.path.join(RAIZ, f"img/marca/paloma-{n}.png")).convert("RGBA").split()[3]
    if espejo: g = g.transpose(Image.FLIP_LEFT_RIGHT)
    f = tam * K / max(g.size); g = g.resize((int(g.width * f), int(g.height * f)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.6)).point(lambda v: 255 if v > 90 else 0)
    return g.rotate(giro, expand=True, resample=Image.BICUBIC)
def estrella(d, x, y, r, f=255, g=0):
    poli(d, [(x + (r if i % 2 == 0 else r * .42) * math.cos(g + i * math.pi / 5 - math.pi / 2), y + (r if i % 2 == 0 else r * .42) * math.sin(g + i * math.pi / 5 - math.pi / 2)) for i in range(10)], f)
def sobre(d, x, y, w, h, f=255, q=0):
    poli(d, [(x, y), (x + w, y), (x + w, y + h), (x, y + h)], f)
    linea(d, [(x, y), (x + w / 2, y + h * .58), (x + w, y)], 6, q); linea(d, [(x, y + h), (x + w * .4, y + h * .44)], 4, q); linea(d, [(x + w, y + h), (x + w * .6, y + h * .44)], 4, q)

ARRIBA, ABAJO, IZQ, DER = 46, 760, 46, 754     # el dibujo vive aquí; abajo queda el renglón del título
def papel(semilla, viejo=.5):
    a = tono(np.clip(.55 + .1 * ruido(H, W, 1.7, semilla), 0, 1), [(0, "#d8c9a6"), (.5, "#efe5cd"), (1, "#f8f1df")])
    Y, X = np.mgrid[0:H, 0:W].astype(float)
    orilla = np.minimum.reduce([X, Y, W - X, H - Y]); manchas = np.exp(-orilla / 70) * (.55 + .5 * ruido(H, W, 1.6, semilla + 1))
    return a * (1 - viejo * .32 * np.clip(manchas, 0, 1))[..., None] + rgb("#a57b3f") * (viejo * .32 * np.clip(manchas, 0, 1))[..., None]
def imprime(a, capa, color, semilla, corrido=(0, 0), carga=.96):
    m = np.asarray(capa.resize((W, H), Image.LANCZOS), float) / 255
    m = np.roll(m, corrido, (0, 1))
    tinta = np.clip(carga + .13 * ruido(H, W, .9, semilla) - .3 * (ruido(H, W, .55, semilla + 1) > 1.9), 0, 1)
    k = (m * tinta)[..., None]
    return a * (1 - k) + rgb(color) * k
def estampa(nombre, capas, anio, semilla):
    a = papel(semilla)
    for i, (capa, color) in enumerate(capas):
        a = imprime(a, capa, color, semilla + 10 * i, corrido=(i * 2, -i * 3))
    # marco fino y año, como la denominación de un timbre
    marco, dm = lienzo(); dm.rectangle([*P(IZQ - 12, ARRIBA - 12), *P(DER + 12, 940)], outline=255, width=3 * K)
    a = imprime(a, marco, capas[0][1], semilla + 90)
    im = Image.fromarray(np.clip(a + np.random.default_rng(semilla).normal(0, 1.8, (H, W, 1)), 0, 255).astype("uint8"))
    if anio:
        f = ImageFont.truetype(os.environ["NEWSREADER_TTF"], 62); d = ImageDraw.Draw(im)
        c = tuple(rgb(capas[-1][1]).astype(int)) ; x = 62; y = 54
        caja = d.textbbox((x, y), anio, font=f); d.rectangle([caja[0] - 12, caja[1] - 8, caja[2] + 12, caja[3] + 10], fill="#f4ecd9"); d.text((x, y), anio, fill=c, font=f)
    im.save(os.path.join(SAL, nombre + ".webp"), quality=86, method=6); print(nombre, os.path.getsize(os.path.join(SAL, nombre + ".webp")) // 1024, "KB")

def campo():
    a, da = lienzo(); b, db = lienzo(); c, dc = lienzo()
    disco(db, 540, 250, 92)
    for i in range(22):
        t = math.pi + i / 21 * math.pi; linea(db, [(540 + 112 * math.cos(t), 250 + 112 * math.sin(t)), (540 + 196 * math.cos(t), 250 + 196 * math.sin(t))], 5)
    for y, amp, per, fase in [(450, 34, 620, 40), (540, 46, 760, 300), (640, 38, 540, 120)]:
        h, dh = lienzo(); poli(dh, ola(y, amp, per, fase) + [(DER, ABAJO), (IZQ, ABAJO)]); dc.rectangle([0, 0, 0, 0]); c.paste(0, (0, 0), h)
        a.paste(0, (0, 0), h); a.paste(255, (0, 0), rayado(h, 9 + (640 - y) // 40, .05 + (y - 450) / 700, .52)); linea(da, ola(y, amp, per, fase), 5)
    for x in range(90, 720, 74):                # cerca del rancho
        y = 640 + 38 * math.sin((x + 120) / 540 * math.tau); linea(da, [(x, y - 62), (x, y + 10)], 7)
    linea(da, [(x, 640 + 38 * math.sin((x + 120) / 540 * math.tau) - 44) for x in range(90, 680, 8)], 4); linea(da, [(x, 640 + 38 * math.sin((x + 120) / 540 * math.tau) - 22) for x in range(90, 680, 8)], 4)
    pega(a, ave(1, 150, 8), 220, 240); pega(a, ave(3, 90, -6), 340, 150)
    return [(a, AZUL), (b, ROJO)]
def guitarra():
    a, da = lienzo(); b, db = lienzo(); g, dg = lienzo()
    disco(dg, 400, 560, 150); disco(dg, 400, 360, 112)
    poli(dg, [(300, 400), (500, 400), (540, 520), (260, 520)])
    r = rayado(g, 8, 1.1, .6); a.paste(255, (0, 0), r)
    o, do = lienzo(); disco(do, 400, 560, 150); disco(do, 400, 360, 112)
    borde = np.asarray(o.filter(ImageFilter.MaxFilter(9)), int) - np.asarray(o, int)
    a.paste(255, (0, 0), Image.fromarray(np.clip(borde, 0, 255).astype("uint8")))
    disco(da, 400, 430, 58, 0); disco(da, 400, 430, 46); disco(da, 400, 430, 40, 0)
    poli(da, [(372, 330), (428, 330), (420, 70), (380, 70)], 0); poli(da, [(378, 340), (422, 340), (416, 70), (384, 70)])
    poli(da, [(372, 70), (428, 70), (436, ARRIBA), (364, ARRIBA)])
    poli(da, [(330, 610), (470, 610), (470, 632), (330, 632)])
    for x in (388, 396, 404, 412): linea(da, [(x, 60), (x, 620)], 1.6, 0)
    for k in range(4):
        linea(db, ola(200 + k * 150, 22, 260, k * 90, IZQ, 320), 5); linea(db, ola(200 + k * 150, 22, 260, k * 90 + 120, 490, DER), 5)
    return [(a, AZUL), (b, ROJO)]
def corazon():
    a, da = lienzo(); b, db = lienzo()
    pts = [(400 + 17.5 * 16 * math.sin(t)**3, 400 - 17.5 * (13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))) for t in np.linspace(0, math.tau, 200)]
    poli(db, pts); rr = random.Random(5)
    for _ in range(5):
        x, y = rr.uniform(240, 560), rr.uniform(240, 460); t = rr.uniform(0, 6); q = []
        for i in range(12): q.append((x, y)); t += rr.gauss(0, .5); x += 26 * math.cos(t); y += 26 * math.sin(t)
        linea(db, q, 2.4, 0)
    for k in range(4): linea(da, ola(150 + k * 26, 8, 110, k * 30, 470, DER), 4)
    da.ellipse([*P(90, 90), *P(290, 290)], outline=255, width=4 * K); da.ellipse([*P(120, 120), *P(260, 260)], outline=255, width=3 * K)
    return [(b, ROJO), (a, AZUL)]
def almas():
    a, da = lienzo(); poli(da, [(IZQ, ARRIBA), (DER, ARRIBA), (DER, ABAJO), (IZQ, ABAJO)])
    pega(a, paloma(2, 340, 12), 280, 300, 0); pega(a, paloma(2, 340, -14, True), 520, 500, 0)
    for k in range(5): linea(da, [(150 + x, 690 + 26 * math.sin(x / 70 + k) + k * 8) for x in range(0, 500, 8)], 3, 0)
    return [(a, CIELO)]
def rosa():
    a, da = lienzo(); b, db = lienzo(); cx, cy = 400, 300
    pet, dp = lienzo()
    for r, n, g in [(205, 7, .2), (150, 6, .7), (100, 5, .1)]:
        for i in range(n):
            t = g + i / n * math.tau; disco(dp, cx + r * .55 * math.cos(t), cy + r * .5 * math.sin(t), r * .52)
    db.bitmap((0, 0), rayado(pet, 7, .9, .68), fill=255)
    for r in (205, 150, 100, 58, 26):
        for i in range(9):
            t0 = i / 9 * math.tau + r; linea(db, [(cx + r * .98 * math.cos(t0 + j / 12 * .62), cy + r * .92 * math.sin(t0 + j / 12 * .62)) for j in range(13)], 5.5)
    linea(da, [(400 + 14 * math.sin(y / 60), y) for y in range(490, ABAJO, 6)], 11)
    for x, y, s in [(250, 610, -1), (550, 660, 1)]:
        h, dh = lienzo(); poli(dh, [(400, y + 40), (400 + s * 70, y - 46), (x, y - 40), (x + s * -20, y + 2), (400 + s * 90, y + 26)]); a.paste(255, (0, 0), rayado(h, 7, .3 * s + 1, .6))
        linea(da, [(400, y + 40), (x, y - 34)], 4)
    return [(a, AZUL), (b, ROJO)]
def notas():
    a, da = lienzo(); b, db = lienzo()
    for k in range(5): linea(da, ola(330 + k * 42, 62, 720, 80), 4)
    for x, n in [(150, 2), (300, 0), (440, 3), (590, 1)]:
        y = 330 + n * 42 + 62 * math.sin((x + 80) / 720 * math.tau)
        db.ellipse([*P(x - 34, y - 24), *P(x + 34, y + 24)], fill=255); linea(db, [(x + 30, y), (x + 30, y - 190)], 8)
    linea(db, [(330, 330 + 62 * math.sin(380 / 720 * math.tau) - 190), (470, 330 + 3 * 42 + 62 * math.sin(520 / 720 * math.tau) - 190)], 20)
    pega(a, ave(0, 190, 10), 560, 150); pega(a, ave(2, 170, -8), 230, 650)
    return [(a, AZUL), (b, ROJO)]
def noche_mar():
    a, da = lienzo(); poli(da, [(IZQ, ARRIBA), (DER, ARRIBA), (DER, ABAJO), (IZQ, ABAJO)]); rr = random.Random(9)
    for x, y, r in [(180, 170, 44), (380, 120, 22), (560, 200, 60), (660, 110, 20), (300, 300, 30), (470, 380, 26), (640, 360, 34), (140, 390, 22)]:
        estrella(da, x, y, r, 0, rr.uniform(-.4, .4))
    for k in range(9):
        y = 480 + k * 32; linea(da, ola(y, 11 + k * 2.4, 160 + k * 30, k * 70), 4 + k * .5, 0)
    return [(a, AZUL)]
def adios():
    a, da = lienzo(); b, db = lienzo(); poli(db, [(IZQ, ARRIBA), (DER, ARRIBA), (DER, ABAJO), (IZQ, ABAJO)])
    disco(db, 400, 500, 170, 0)
    for k in range(8): linea(db, ola(530 + k * 30, 7 + k * 2, 180 + k * 26, k * 60), 5 + k * .4, 0)
    pega(b, ave(1, 300, 14), 300, 230, 0)
    for k in range(7):
        y = 530 + k * 34; linea(da, ola(y, 6 + k * 2, 170 + k * 26, k * 50 + 40), 3)
    return [(b, VINO), (a, AZUL)]
def bandada():
    a, da = lienzo(); b, db = lienzo(); rr = random.Random(4)
    for k in range(6): linea(db, [(IZQ + x, 170 + k * 100 + 40 * math.sin(x / 120 + k) - x * .1) for x in range(0, 708, 8)], 2.6)
    for i, (x, y, t, g) in enumerate([(210, 610, 230, 14), (430, 520, 200, 2), (620, 400, 180, -6), (280, 340, 170, 12), (500, 220, 150, -10), (660, 130, 110, 0), (140, 170, 110, 20)]):
        m = np.asarray(ave(i, t, g), float) / 255; gr = Image.fromarray((grabado(m, i * 3 + 1) * 255).astype("uint8"))
        pega(a, ave(i, t, g), x, y, 0); pega(a, gr, x, y)
        db_m = ave(i, t, g); b.paste(0, (int(x * K - db_m.width / 2), int(y * K - db_m.height / 2)), db_m)
    return [(a, AZUL), (b, ROJO)]
def carta():
    a, da = lienzo(); b, db = lienzo(); sobre(da, 130, 300, 540, 340); disco(db, 400, 490, 66); estrella(db, 400, 490, 34, 0)
    m = rayado(a, 8, .2, .34); pega(b, ave(2, 180, 6), 590, 170, 255); a2, d2 = lienzo(); d2.bitmap((0, 0), m, fill=255)
    linea(d2, [(130, 300), (670, 300), (670, 640), (130, 640), (130, 300)], 6); linea(d2, [(130, 300), (400, 497), (670, 300)], 6)
    for x in range(120, 500, 34): disco(d2, x, 210 + 90 * math.sin(x / 80), 4)
    return [(a2, AZUL), (b, ROJO)]
def pluma():
    a, da = lienzo(); b, db = lienzo()
    for k in range(7):
        y = 150 + k * 82; x0 = 90
        linea(da, [(x0 + i * 3.4, y + 12 * math.sin(i / 5.2) + 7 * math.sin(i / 1.9)) for i in range(0, 170 - k * 4)], 3.4)
    p, dp = lienzo(); poli(dp, [(690, 90), (720, 180), (640, 400), (500, 620), (470, 610), (520, 400), (610, 210)])
    a.paste(0, (0, 0), p); b.paste(255, (0, 0), rayado(p, 7, 1.1, .62)); linea(db, [(700, 110), (450, 690)], 7)
    return [(a, AZUL), (b, ROJO)]
def postales():
    a, da = lienzo(); b, db = lienzo()
    for x, y, g, c in [(150, 200, -.14, b), (260, 300, .1, a)]:
        q = []
        for px, py in [(0, 0), (390, 0), (390, 270), (0, 270)]:
            q.append((x + px * math.cos(g) - py * math.sin(g), y + px * math.sin(g) + py * math.cos(g)))
        h, dh = lienzo(); poli(dh, q); a.paste(0, (0, 0), h); b.paste(0, (0, 0), h); c.paste(255, (0, 0), rayado(h, 8, g + .8, .46)); ImageDraw.Draw(c).line([P(*p) for p in q + q[:1]], fill=255, width=6 * K)
    pega(a, ave(4, 190, 6), 250, 640); 
    for k in range(3): linea(db, ola(600 + k * 42, 12, 180, k * 40, 400, DER), 5)
    return [(a, AZUL), (b, ROJO)]
ESTAMPAS = [("country-girl", campo, "2026"), ("improvisando", guitarra, "2026"), ("corazon", corazon, "2025"), ("dos-almas", almas, "2025"), ("valentina", rosa, "2025"),
            ("me-encantaaaa", notas, "2025"), ("estrellas-y-mar", noche_mar, "2025"), ("renunciacion", adios, "2025"), ("eso-y-mas", bandada, "2025"),
            ("avisame", carta, ""), ("diario", pluma, ""), ("pared", postales, "")]

# ---------- sellos de cera, con relieve de verdad
def sello(nombre, motivo, rampa, semilla, N=720):
    Y, X = np.mgrid[0:N, 0:N].astype(float); cx = cy = N / 2; dx, dy = X - cx, Y - cy; R = np.hypot(dx, dy); T = np.arctan2(dy, dx); r0 = N * .4
    rr = random.Random(semilla); borde = r0 * (1 + sum(rr.uniform(.012, .04) * np.sin(T * k + rr.uniform(0, 6)) for k in (2, 3, 5, 7, 11)))
    d = (borde - R) / r0                                     # >0 dentro
    al = np.clip(d * r0 / 1.6 + .5, 0, 1)
    h = np.clip(d / .12, 0, 1)**.55 * 1.0                     # labio de cera que cae
    copa = np.clip((.7 * r0 - R) / (.05 * r0), 0, 1)
    h = h - .52 * copa                                        # el disco hundido por el sello
    h = h + .1 * np.exp(-((R - .715 * r0) / (.012 * r0))**2)  # anillo fino
    m = np.asarray(motivo(N), float) / 255
    h = h + .46 * ni.gaussian_filter(m, 3.2) + .12 * ni.gaussian_filter(m, 1.1)
    h = h + .018 * ruido(N, N, 1.9, semilla) + .0035 * ruido(N, N, 1.0, semilla + 1)
    h = ni.gaussian_filter(h, 1.3)
    gy, gx = np.gradient(h * 90); n = 1 / np.sqrt(gx**2 + gy**2 + 1); nx, ny, nz = -gx * n, -gy * n, n
    lx, ly, lz = -.5, -.62, .6; ll = math.sqrt(lx * lx + ly * ly + lz * lz); dif = np.clip((nx * lx + ny * ly + nz * lz) / ll, 0, 1)
    hx, hy, hz = lx / ll, ly / ll, lz / ll + 1; hn = math.sqrt(hx * hx + hy * hy + hz * hz); esp = np.clip((nx * hx + ny * hy + nz * hz) / hn, 0, 1)**46
    L = .16 + .68 * dif
    a = tono(np.clip(L, 0, 1), rampa) + 150 * esp[..., None] * .55
    out = np.dstack([np.clip(a, 0, 255), al * 255]).astype("uint8")
    Image.fromarray(out, "RGBA").resize((N * 2 // 3, N * 2 // 3), Image.LANCZOS).save(os.path.join(SAL, nombre + ".webp"), quality=88, method=6)
    print(nombre, os.path.getsize(os.path.join(SAL, nombre + ".webp")) // 1024, "KB")
def m_ave(N):
    im = Image.new("L", (N, N), 0); g = golondrinas()[0]; f = N * .46 / max(g.size); g = g.resize((int(g.width * f), int(g.height * f)), Image.LANCZOS).rotate(10, expand=True, resample=Image.BICUBIC)
    im.paste(255, ((N - g.width) // 2, (N - g.height) // 2), g); return im
def m_sol(N):
    im = Image.new("L", (N * 2, N * 2), 0); d = ImageDraw.Draw(im); c = N
    for i in range(16):
        t = i / 16 * math.tau; a, b = N * .15, N * (.47 if i % 2 == 0 else .38); pts = []
        for j in range(16):
            u = j / 15; q = a + (b - a) * u; w = .14 * (1 - u); s = .16 * math.sin(u * 5)
            pts.append((c + q * math.cos(t + w + s), c + q * math.sin(t + w + s)))
        for j in range(15, -1, -1):
            u = j / 15; q = a + (b - a) * u; w = .14 * (1 - u); s = .16 * math.sin(u * 5)
            pts.append((c + q * math.cos(t - w + s), c + q * math.sin(t - w + s)))
        d.polygon(pts, fill=255)
    d.ellipse([c - N * .17, c - N * .17, c + N * .17, c + N * .17], fill=255); d.ellipse([c - N * .115, c - N * .115, c + N * .115, c + N * .115], fill=0); d.ellipse([c - N * .085, c - N * .085, c + N * .085, c + N * .085], fill=255)
    return im.resize((N, N), Image.LANCZOS)
def m_mar(N):
    im = Image.new("L", (N * 2, N * 2), 0); d = ImageDraw.Draw(im); c = N; q = N * .5
    for k in range(4):
        y = c + N * .02 + k * N * .1; d.line([(c - q + i * 4, y + N * .03 * math.sin(i / 34 + k)) for i in range(int(q / 2))], fill=255, width=int(N * .03), joint="curve")
    for x, y, r in [(0, -.3, .13), (-.22, -.16, .07), (.22, -.17, .08)]:
        cx, cy, rr_ = c + x * N * 1.0 * .95, c + y * N * .9, r * N * 1.05
        d.polygon([(cx + (rr_ if i % 2 == 0 else rr_ * .42) * math.cos(i * math.pi / 5 - math.pi / 2), cy + (rr_ if i % 2 == 0 else rr_ * .42) * math.sin(i * math.pi / 5 - math.pi / 2)) for i in range(10)], fill=255)
    return im.resize((N, N), Image.LANCZOS)
def vuelo(W2=1400, H2=420):
    """Camino punteado de un ave mensajera que lleva una carta."""
    im = Image.new("L", (W2 * 2, H2 * 2), 0); d = ImageDraw.Draw(im); pts = []
    for i in range(0, 1000):
        u = i / 999; x = 40 + u * 1040; y = 300 - 190 * u + 62 * math.sin(u * 9.4) - 120 * math.exp(-((u - .46) / .07)**2) + 120 * math.exp(-((u - .54) / .07)**2)
        pts.append((x * 2, y * 2))
    largo = 0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        largo += math.hypot(x1 - x0, y1 - y0)
        if (largo % 46) < 24: d.line([(x0, y0), (x1, y1)], fill=255, width=7)
    g = golondrinas()[0]; f = 250 * 2 / max(g.size); g = g.transpose(Image.FLIP_LEFT_RIGHT).resize((int(g.width * f), int(g.height * f)), Image.LANCZOS).rotate(6, expand=True, resample=Image.BICUBIC)
    m = grabado(np.asarray(g, float) / 255, 7); x, y = 1140 * 2, 20 * 2
    im.paste(255, (x, y), Image.fromarray((m * 255).astype("uint8")))
    c = Image.new("L", (130, 90), 255); dc = ImageDraw.Draw(c); dc.rectangle([3, 3, 126, 86], fill=0); dc.line([(3, 3), (65, 52), (126, 3)], fill=255, width=6)
    q = Image.new("L", (130, 90), 255).rotate(-16, expand=True); c = c.rotate(-16, expand=True); im.paste(c, (x + 40, y + 260), q)
    al = im.resize((W2, H2), Image.LANCZOS); o = Image.new("RGBA", (W2, H2), "#1c356d"); o.putalpha(al)
    o.save(os.path.join(SAL, "vuelo.webp"), quality=86, method=6); print("vuelo", os.path.getsize(os.path.join(SAL, "vuelo.webp")) // 1024, "KB")
RAMPA_VINO = [(0, "#2a0605"), (.35, "#5f1313"), (.6, "#8c2020"), (.85, "#b34a3f"), (1, "#e09a86")]
RAMPA_ORO = [(0, "#4a3214"), (.35, "#8a6530"), (.6, "#b98f4e"), (.85, "#dcb978"), (1, "#f6e6b8")]
RAMPA_AZUL = [(0, "#0b1a3d"), (.35, "#1c356d"), (.6, "#2c5088"), (.85, "#5d84b4"), (1, "#c6d8ea")]
if __name__ == "__main__":
    for n, f, a in ESTAMPAS: estampa(n, f(), a, sum(map(ord, n)))
    sello("sello-vino", m_ave, RAMPA_VINO, 3); sello("sello-oro", m_sol, RAMPA_ORO, 8); sello("sello-azul", m_mar, RAMPA_AZUL, 13); vuelo()
