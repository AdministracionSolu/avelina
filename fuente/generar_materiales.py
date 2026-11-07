#!/usr/bin/env python3
"""Genera los materiales del sitio en img/azul/ e img/calido/. Todo se dibuja aquí con código:
las fotos de inspiración son de otras personas y nunca entran al sitio. Las aves son las
golondrinas del manual de Avelina (img/marca/golondrinas.png).
Necesita numpy, scipy y pillow. Uso: python3 fuente/generar_materiales.py  (desde la raíz del repo)."""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage as ni
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAL = os.path.join(RAIZ, "img/azul"); os.makedirs(SAL, exist_ok=True)
def rgb(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)
# Tonos medidos en las fotos azules de la carpeta de inspiración, del más oscuro al papel.
CIANO = [(0, "#0f2350"), (.22, "#1c356d"), (.42, "#1c4776"), (.6, "#457298"), (.76, "#7ea0b5"), (.9, "#bdccca"), (1, "#ece6d6")]
def tono(L, escala=CIANO):
    xs = [p for p, _ in escala]; cs = np.array([rgb(c) for _, c in escala])
    return np.stack([np.interp(L, xs, cs[:, i]) for i in range(3)], -1)
def ruido(h, w, beta, semilla, ax=1.0, ay=1.0):
    """Ruido espectral: por construcción se repite sin costuras."""
    r = np.random.default_rng(semilla)
    fy = np.fft.fftfreq(h)[:, None] * h * ay; fx = np.fft.fftfreq(w)[None, :] * w * ax
    f = np.sqrt(fx**2 + fy**2); f[0, 0] = 1
    z = np.fft.ifft2(np.fft.fft2(r.standard_normal((h, w))) / f**beta).real
    return (z - z.mean()) / z.std()
def guarda(a, nombre, q=70):
    Image.fromarray(np.clip(a, 0, 255).astype("uint8")).save(os.path.join(SAL, nombre), quality=q, method=6)
    print(nombre, os.path.getsize(os.path.join(SAL, nombre)) // 1024, "KB")

def doblez(sh, W, H, xs, ys, semilla):
    """Dobleces de un papel que estuvo guardado: sombra suave y línea gastada."""
    Y, X = np.mgrid[0:H, 0:W].astype(float); rot = ruido(H, W, 1.1, semilla)
    gasto = np.zeros((H, W))
    for x0 in xs:
        d = X - x0 - ruido(H, W, 1.6, semilla + 1)[:, :1] * 1.5
        sh = sh + .1 * (d / 46) * np.exp(-(d / 46)**2) - .05 * np.exp(-(d / 12)**2)
        gasto = np.maximum(gasto, np.exp(-(d / 1.3)**2))
    for y0 in ys:
        d = Y - y0 - ruido(H, W, 1.6, semilla + 2)[:1, :] * 1.5
        sh = sh + .08 * (d / 34) * np.exp(-(d / 34)**2) - .04 * np.exp(-(d / 10)**2)
        gasto = np.maximum(gasto, np.exp(-(d / 1.2)**2))
    return sh + gasto * np.clip(.55 + .4 * rot, 0, 1) * .26

MAR = [(0, "#10264f"), (.2, "#1b3263"), (.38, "#2a4674"), (.55, "#55708f"), (.72, "#8c9ba6"), (.88, "#c9c8bb"), (1, "#ece6d6")]
def mar(W=3600, H=1800, semilla=7):
    e = W / 2400; W0, H0 = 2400, 1200       # la composición se piensa en 2400 y se imprime más grande
    hy = int(H0 * .15)                      # horizonte
    Y, X = np.mgrid[0:H, 0:W].astype(float); Y /= e; X /= e
    t = np.clip((Y - hy) / (H0 - hy), 0, 1)
    s = .08 + t**1.35                       # perspectiva: lejos todo se comprime
    n1 = ruido(1024, 2048, 1.7, semilla, ax=2.1); n2 = ruido(1024, 2048, 1.15, semilla + 1, ax=1.5)
    u = (X - W0 / 2) / (.5 + s); v = 520 * np.log(s / .08 + 1)
    def muestra(n, a, b): return ni.map_coordinates(n, [(b % 1024), (a % 2048)], order=1, mode="wrap")
    alt = muestra(n1, u * .34, v) + .5 * muestra(n2, u * .9, v * 2.1)
    gy = np.gradient(ni.gaussian_filter(alt, (1.5 * e, 3 * e)), axis=0)
    gy = gy / (np.abs(gy).mean() + 1e-6)
    L = .3 + .03 * gy * (.5 + t) + .055 * alt
    # lavado de espuma en la orilla, abajo
    orilla = np.clip((t - .8) / .2, 0, 1)**1.4
    parches = np.clip(muestra(n2, u * 1.6, v * 2.4) * .7 + .5, 0, 1)
    L = L + orilla * (.1 + .3 * parches)
    # olas largas que revientan, de lejos a cerca
    for k, (ty, alto, fuerza, cubre) in enumerate([(.09, 8, .24, .5), (.2, 12, .3, .7), (.34, 18, .36, .5), (.5, 26, .44, .8), (.7, 34, .46, .75)]):
        yc = hy + ty * (H0 - hy) + ruido(8, W, 2.1, semilla + 10 + k)[0] * (12 + 50 * ty)
        pres = np.clip(ruido(8, W, 2.6, semilla + 20 + k)[0] * .5 + cubre, 0, 1)
        d = Y - yc[None, :]
        L = L - .17 * np.exp(-np.clip(d, 0, None) / (alto * 1.6)) * (d > 0) * (.4 + .6 * pres[None, :])          # cara oscura
        L = L + .07 * np.exp(-np.clip(-d, 0, None) / (alto * 2.6)) * (d <= 0) * (.4 + .6 * pres[None, :])        # lomo que sube
        fino = muestra(n2, u * 2.2 + k * 91, v * 4) * .55 + ruido(H, W, .8, semilla + 30 + k) * .36
        lengua = np.exp(-((d + alto * .25 + alto * .34 * fino) / (alto * .6))**2)
        cola = np.exp(-np.clip(d - alto * .3, 0, None) / (alto * 1.5)) * (d > 0) * np.clip(fino + .25, 0, 1)      # espuma que cae
        encaje = np.clip(.62 + .75 * ruido(H, W, .95, semilla + 70 + k), .12, 1.15)
        L = L + fuerza * np.clip(lengua * (1.05 + .9 * fino) + .4 * cola, 0, 1.2) * encaje * pres[None, :]
    # cielo gastado
    cielo = .44 - .07 * (Y / hy) + .035 * ruido(H, W, 1.9, semilla + 40)
    mezcla = np.clip((Y - hy) / 5 + .5, 0, 1)
    L = cielo * (1 - mezcla) + L * mezcla
    L = np.where(L > .56, .56 + (L - .56) * .62, L)            # la espuma no se quema
    L = L + .045 * ruido(H, W, 2.0, semilla + 41)              # manchas de la impresión
    L = doblez(L, W, H, [W * .5, W * .25, W * .75], [H * .4, H * .78], semilla + 50)
    L = ni.gaussian_filter(L, .5)
    L = L + ni.gaussian_filter(np.random.default_rng(semilla + 60).normal(0, .03, L.shape), .6)  # grano de papel fino
    final = tono(np.clip(L, 0, .97), MAR)
    guarda(final, "mar.webp", 80)
    Image.fromarray(final.astype("uint8")).resize((1800, 900), Image.LANCZOS).save(os.path.join(SAL, "mar-chico.webp"), quality=78, method=6)

def estrella(c, r, giro, rr):
    p = []
    for i in range(10):
        a = giro + i * math.pi / 5 - math.pi / 2
        q = r * (1 if i % 2 == 0 else .42 + rr.uniform(-.03, .03)) * rr.uniform(.93, 1.06)
        p.append((c[0] + q * math.cos(a), c[1] + q * math.sin(a)))
    return p
def estrellas(N=1400, semilla=3):
    k = 2; M = N * k; rr = random.Random(semilla)
    base = .3 + .045 * ruido(N, N, 1.7, semilla) + .018 * ruido(N, N, .9, semilla + 1)
    fondo = tono(np.clip(base, 0, 1), [(0, "#14264f"), (.3, "#273c64"), (.5, "#34497a"), (1, "#526997")])
    # papel de estrellas recortadas
    mascara = Image.new("L", (M, M), 0); sombra = Image.new("L", (M, M), 0)
    d = ImageDraw.Draw(mascara); ds = ImageDraw.Draw(sombra); puestos = []
    for _ in range(700):
        x, y = rr.uniform(0, N), rr.uniform(0, N)
        r = rr.choice([6, 7, 7, 8, 9, 10, 12, 15, 19])
        ok = all(min(abs(x - a), N - abs(x - a))**2 + min(abs(y - b), N - abs(y - b))**2 > (r + c + 118)**2 for a, b, c in puestos)
        if ok:
            puestos.append((x, y, r))
            pol0 = estrella((x, y), r, rr.uniform(-.5, .5), rr)
            for ox in (-N, 0, N):
                for oy in (-N, 0, N):
                    pol = [((a + ox) * k, (b + oy) * k) for a, b in pol0]
                    d.polygon(pol, fill=255); ds.polygon([(a + 3, b + 4) for a, b in pol], fill=255)
    m = np.asarray(mascara.resize((N, N), Image.LANCZOS), float) / 255
    sb = np.asarray(sombra.resize((N, N), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2)), float) / 255
    # veta del papel de las estrellas
    veta = ruido(N, N, 1.1, semilla + 2, ax=.25, ay=5)
    papel = tono(np.clip(.55 + .16 * veta, 0, 1), [(0, "#6f7486"), (.5, "#9fa2a2"), (1, "#c3c0b0")])
    a = fondo * (1 - .35 * sb[..., None])
    a = a * (1 - m[..., None]) + papel * m[..., None]
    # polvo de estrellas
    r = np.random.default_rng(semilla + 3); polvo = np.zeros((N, N))
    ys, xs = r.integers(0, N, 620), r.integers(0, N, 620); polvo[ys, xs] = r.uniform(.3, .8, 620)
    p2 = ni.gaussian_filter(polvo, .6, mode="wrap") * 2.4
    a = a + np.clip(p2, 0, 1)[..., None] * (rgb("#ece6d6") - a) * .6
    a = a + r.normal(0, 3.2, (N, N, 1))
    guarda(a, "estrellas.webp", 82)

def golondrinas():
    """Separa las golondrinas del manual, una por una, ya suavizadas."""
    im = Image.open(os.path.join(RAIZ, "img/marca/golondrinas.png")).convert("RGBA")
    al = np.asarray(im.split()[3], float)
    et, n = ni.label(ni.binary_closing(al > 110, iterations=2)); aves = []
    for i, sl in enumerate(ni.find_objects(et)):
        if (et[sl] == i + 1).sum() < 900: continue
        c = np.where(et[sl] == i + 1, al[sl], 0)
        g = Image.fromarray(c.astype("uint8")).resize((c.shape[1] * 4, c.shape[0] * 4), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
        aves.append(g.point(lambda v: 255 if v > 118 else 0).filter(ImageFilter.GaussianBlur(1)))
    return aves

def cielo(N=2800, semilla=11):
    e = N // 1400; aves = golondrinas()
    nube = ruido(N, N, 1.75, semilla)
    # nubes impresas con punto de tinta
    Y, X = np.mgrid[0:N, 0:N].astype(float); p = 2 * math.pi * 112 / N  # entero de ciclos: sigue sin costuras
    trama = (np.sin((X + Y) * p) * np.sin((X - Y) * p)) * .5 + .5
    dens = np.clip((nube + .1) / 1.8, 0, 1)
    punto = np.clip((dens - trama * .9) * 3, 0, 1)
    L = .33 + .12 * ni.gaussian_filter(punto, 1.2 * e, mode="wrap") + .05 * ruido(N, N, 1.2, semilla + 1)
    a = tono(np.clip(L, 0, 1))
    capa = Image.new("L", (N, N), 0)
    rr = random.Random(semilla + 2)
    # bandada en la franja derecha del azulejo: el texto del diario queda libre a la izquierda
    for x, y, tam, op in [(1030, 90, 190, 235), (1190, 330, 140, 200), (930, 400, 115, 150), (1080, 610, 230, 235), (950, 880, 125, 165), (1180, 950, 160, 215), (1040, 1180, 150, 180)]:
        x, y, tam = x * e, y * e, tam * e
        g = rr.choice(aves); f = tam / max(g.size)
        g = g.resize((int(g.width * f), int(g.height * f)), Image.LANCZOS).rotate(rr.uniform(-24, 24), expand=True, resample=Image.BICUBIC)
        g = g.point(lambda v: v * op // 255)
        capa.paste(Image.composite(g, capa.crop((x, y, x + g.width, y + g.height)), g), (x, y))
    m = np.asarray(capa, float) / 255
    borron = ni.gaussian_filter(m, 1.2 * e) * (.82 + .18 * np.clip(ruido(N, N, .8, semilla + 3), -1, 1))
    a = a * (1 - borron[..., None]) + tono(np.clip(.9 + .03 * ruido(N, N, 1, semilla + 4), 0, 1)) * borron[..., None]
    r = np.random.default_rng(semilla + 5)
    guarda(a + ni.gaussian_filter(r.normal(0, 4, (N, N)), .6)[..., None], "cielo.webp", 78)

def grabado(mascara, semilla):
    """Tinta de grabado: líneas finas dentro de la golondrina, como un buril."""
    h, w = mascara.shape; Y, X = np.mgrid[0:h, 0:w].astype(float)
    dist = ni.distance_transform_edt(mascara > .5); dist = dist / (dist.max() + 1)
    fase = (X * .62 + Y * .78) + 7 * np.sin(X / 37 + semilla) + 5 * np.sin(Y / 29)
    linea = .5 + .5 * np.sin(fase * math.tau / 6.5)
    grueso = np.clip(1.05 - dist * 1.25 + .1 * ruido(h, w, 1.5, semilla), .12, 1)
    return (linea < grueso).astype(float) * mascara

def timbre(W=360, H=430, semilla=31):
    """Pinceladas de agua para el timbre de las cartas."""
    k = 2; rr = random.Random(semilla); im = Image.new("RGB", (W * k, H * k), "#14305f"); d = ImageDraw.Draw(im)
    tonos = ["#14305f", "#1c356d", "#1c4776", "#274f8c", "#2c4696", "#3f7ab7", "#457298", "#2e5f62", "#7ea0b5"]
    for _ in range(4200):
        x, y = rr.uniform(0, W * k), rr.uniform(0, H * k); l = rr.uniform(14, 60); a = rr.gauss(0, .4) + .25 * math.sin(y / 90)
        c = rr.choices(tonos, [5, 6, 6, 4, 4, 2, 2, 1, 1])[0]
        d.line([(x, y), (x + l * math.cos(a), y + l * math.sin(a))], fill=c, width=rr.randint(5, 13))
    for cx, cy, r in [(.68, .24, 72), (.34, .72, 88)]:
        cx *= W * k; cy *= H * k
        for _ in range(240):
            a, q = rr.uniform(0, math.tau), rr.uniform(.15, 1) * r
            x, y = cx + q * math.cos(a), cy + q * .62 * math.sin(a)
            d.line([(x, y), (x + 20 * math.cos(a), y + 12 * math.sin(a))], fill=rr.choice(["#ffffff", "#e9eefb", "#c6cedd", "#8f9cbe"]), width=rr.randint(5, 11))
        for _ in range(26):
            d.line([(cx + rr.gauss(0, 9), cy + rr.gauss(0, 5)), (cx + rr.gauss(0, 9), cy + rr.gauss(0, 5))], fill=rr.choice(["#f2b45a", "#ffb76d"]), width=5)
    im = im.filter(ImageFilter.GaussianBlur(1.2)).resize((W, H), Image.LANCZOS)
    perfora(im, "timbre.webp", SAL)

def perfora(im, nombre, carpeta):
    """Papel de timbre con su orilla perforada alrededor de la imagen."""
    W, H = im.size; m, paso, r = 30, 28, 9
    TW, TH = ((W + 2 * m) // paso) * paso, ((H + 2 * m) // paso) * paso
    hoja = Image.new("RGBA", (TW * 2, TH * 2), "#fbf8ee"); al = Image.new("L", hoja.size, 255); da = ImageDraw.Draw(al)
    for x in range(0, TW + 1, paso):
        for y in (0, TH): da.ellipse([(x - r) * 2, (y - r) * 2, (x + r) * 2, (y + r) * 2], fill=0)
    for y in range(0, TH + 1, paso):
        for x in (0, TW): da.ellipse([(x - r) * 2, (y - r) * 2, (x + r) * 2, (y + r) * 2], fill=0)
    hoja.putalpha(al); hoja = hoja.resize((TW, TH), Image.LANCZOS)
    hoja.paste(im.crop((0, 0, TW - 2 * m, TH - 2 * m)), (m, m))
    hoja.save(os.path.join(carpeta, nombre), quality=82, method=6)
    print(nombre, os.path.getsize(os.path.join(carpeta, nombre)) // 1024, "KB")

def rasgado(W=3200, H=112, semilla=41, color="#fff7e0"):
    """Orilla rasgada del papel crema: se pone encima del azul, sin costura al repetirse."""
    n = ruido(8, W, 1.45, semilla)[0]; fino = ruido(8, W, .85, semilla + 1)[0]
    orilla = 52 + 17 * n + 3.6 * fino
    Y = np.arange(H)[:, None]
    cuerpo = np.clip((Y - orilla[None, :] + .6) / 1.2, 0, 1)
    fibra_alto = 10 + 4.8 * np.abs(ruido(8, W, 1.0, semilla + 2)[0])
    fibra = np.clip((Y - (orilla - fibra_alto)[None, :] + .6) / 1.2, 0, 1) * (ruido(H, W, .7, semilla + 3) > -.7)
    a = np.zeros((H, W, 4)); c = rgb(color); blanco = rgb("#fffdf7")
    a[..., :3] = blanco * (1 - cuerpo[..., None]) + c * cuerpo[..., None]
    a[..., 3] = 255 * np.maximum(cuerpo, fibra * .92)
    Image.fromarray(a.astype("uint8"), "RGBA").save(os.path.join(SAL, "rasgado.png"), optimize=True)
    print("rasgado.png", os.path.getsize(os.path.join(SAL, "rasgado.png")) // 1024, "KB")

CAL = os.path.join(RAIZ, "img/calido"); os.makedirs(CAL, exist_ok=True)
def guarda_c(a, nombre, q=72):
    Image.fromarray(np.clip(a, 0, 255).astype("uint8")).save(os.path.join(CAL, nombre), quality=q, method=6)
    print(nombre, os.path.getsize(os.path.join(CAL, nombre)) // 1024, "KB")
def trama(N, paso=3.0):
    """Hilos de una tela de libro: urdimbre y trama. Paso entero de ciclos para no dejar costura."""
    c = round(N / paso); Y, X = np.mgrid[0:N, 0:N].astype(float)
    return np.sin(X * math.tau * c / N), np.sin(Y * math.tau * c / N)
def tela(N, semilla, escala, luz=.5, arrugas=26):
    u, v = trama(N); h = ruido(N, N, .9, semilla + 1, ax=.2, ay=3); w = ruido(N, N, .9, semilla + 2, ax=3, ay=.2)
    L = luz + .07 * ruido(N, N, 1.8, semilla) + .025 * u * v + .03 * h + .03 * w
    im = Image.new("L", (N, N), 0); d = ImageDraw.Draw(im); rr = random.Random(semilla + 3)
    for _ in range(arrugas):       # gastado en los dobleces de la tela
        x, y = rr.uniform(0, N), rr.uniform(0, N); a = rr.uniform(0, math.tau); pts = []
        for i in range(9):
            pts.append((x, y)); a += rr.gauss(0, .22); q = rr.uniform(10, 34); x += q * math.cos(a); y += q * math.sin(a)
        for ox in (-N, 0, N):
            for oy in (-N, 0, N):
                d.line([(p + ox, q + oy) for p, q in pts], fill=rr.randint(70, 190), width=rr.choice([1, 1, 2]))
    g = np.asarray(im.filter(ImageFilter.GaussianBlur(.9)), float) / 255
    L = L + .34 * g * np.clip(.65 + .5 * ruido(N, N, .9, semilla + 4), 0, 1)
    return tono(np.clip(L, 0, 1), escala)
VINO = [(0, "#2f0b0a"), (.35, "#4d1715"), (.5, "#5b201d"), (.7, "#6b3f39"), (1, "#a98a78")]
ROJO = [(0, "#5a1512"), (.32, "#8e2420"), (.5, "#9b302a"), (.68, "#a13932"), (.85, "#c98a72"), (1, "#e6d3b4")]
BEIGE = [(0, "#9c8560"), (.35, "#c9b48c"), (.55, "#dccba7"), (.75, "#e8dcc0"), (1, "#f3ecd9")]
def facetas(w, h, n, semilla, luz=(-.6, -.8)):
    """Arrugas de papel: pequeños planos inclinados que se encuentran en crestas."""
    from scipy.spatial import cKDTree
    r = np.random.default_rng(semilla); pts = np.c_[r.uniform(-40, w + 40, n), r.uniform(-40, h + 40, n)]
    Y, X = np.mgrid[0:h, 0:w]; d, i = cKDTree(pts).query(np.c_[X.ravel(), Y.ravel()], k=2)
    t = r.normal(0, 1, (n, 2)) @ np.array(luz); plano = t[i[:, 0]].reshape(h, w); borde = (d[:, 1] - d[:, 0]).reshape(h, w)
    return plano, borde
def fibras(w, h, n, semilla):
    rr = random.Random(semilla); im = Image.new("L", (w, h), 128); d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y, a, l = rr.uniform(0, w), rr.uniform(0, h), rr.uniform(0, math.tau), rr.uniform(8, 34)
        d.line([(x, y), (x + l * math.cos(a), y + l * math.sin(a) * .8)], fill=rr.choice([96, 108, 146, 160]), width=1)
    return (np.asarray(im.filter(ImageFilter.GaussianBlur(.7)), float) - 128) / 128
def papel_viejo(W=3000, H=1600, semilla=51):
    w, h = W // 2, H // 2
    p1, b1 = facetas(w, h, 70, semilla); p2, b2 = facetas(w, h, 620, semilla + 1)
    zona = np.clip(.45 + .55 * ruido(h, w, 2.1, semilla + 2), .12, 1)       # hay partes lisas y partes muy arrugadas
    L = (.05 * ni.gaussian_filter(p1, 3) + .022 * ni.gaussian_filter(p2, 1.6)) * zona
    c1, c2 = np.exp(-(b1 / 1.7)**2), np.exp(-(b2 / 1.3)**2)
    L = L + zona * (.085 * c1 + .03 * c2) - zona * (.06 * np.roll(c1, 2, 0) + .02 * np.roll(c2, 1, 0))
    L = ni.zoom(L, 2, order=1)[:H, :W]
    L = .62 + L + .016 * ruido(H, W, 2.2, semilla + 3) + .02 * ruido(H, W, .7, semilla + 4) + .022 * fibras(W, H, 42000, semilla + 5)
    # dobleces de carta: dos horizontales y uno vertical, gastados en la cresta
    Y, X = np.mgrid[0:H, 0:W].astype(float)
    for d, g in ((X - W * .5 + 5 * ruido(H, W, 2, semilla + 6), .06), (Y - H * .34 + 5 * ruido(H, W, 2, semilla + 7), .05), (Y - H * .68 + 5 * ruido(H, W, 2, semilla + 8), .05)):
        L = L + .05 * (d / 60) * np.exp(-(d / 60)**2) + g * np.exp(-(d / 1.6)**2) * np.clip(.55 + .6 * ruido(H, W, 1.0, semilla + 9), 0, 1)
    a = tono(np.clip(L, 0, 1), BEIGE)
    # el tiempo: tono más cálido por manchas y hacia las orillas, y puntitos de oxidación
    orilla = np.exp(-np.minimum(Y, H - Y) / 150) * .5 + np.exp(-np.minimum(X, W - X) / 240) * .35
    calido = np.clip(.07 * ruido(H, W, 2.3, semilla + 10) + .1 + orilla * .5, 0, .34)[..., None]
    a = a * (1 - calido) + (a * rgb("#d9b67e") / 232) * calido
    r = np.random.default_rng(semilla + 11); pecas = np.zeros((H, W)); pecas[r.integers(0, H, 240), r.integers(0, W, 240)] = 1
    a = a * (1 - .3 * np.clip(ni.gaussian_filter(pecas, 2.6) * 42, 0, 1))[..., None] + rgb("#8a5f32") * (.3 * np.clip(ni.gaussian_filter(pecas, 2.6) * 42, 0, 1))[..., None]
    # renglones muy tenues, que siguen las arrugas del papel
    yy = Y + 7 * ruido(H, W, 2.3, semilla + 12); renglon = np.exp(-(((yy + 20) % 72 - 36) / 1.2)**2) * .1 * np.clip(.85 + .5 * ruido(H, W, 1.2, semilla + 13), .15, 1)
    a = a * (1 - renglon[..., None]) + rgb("#6f7a8a") * renglon[..., None]
    guarda_c(a, "papel-viejo.webp", 90)
    N = 900; b = tono(np.clip(.62 + .02 * ruido(N, N, 2, semilla + 20) + .011 * ruido(N, N, .75, semilla + 21) + .014 * fibras(N, N, 7000, semilla + 22), 0, 1), [(0, "#cfc2a4"), (.5, "#ece2cb"), (.7, "#f4ecda"), (1, "#fbf6ea")])
    guarda_c(b, "papel-postal.webp", 84)
    # orilla rasgada: máscara que corta la hoja misma, para que el papel no tenga costura
    W, H = 3200, 112; n = ruido(8, W, 1.45, semilla + 9)[0]; fino = ruido(8, W, .85, semilla + 10)[0]
    orilla = 52 + 17 * n + 3.6 * fino; Yv = np.arange(H)[:, None]
    al = np.clip((Yv - orilla[None, :] + .6) / 1.2, 0, 1) * 255
    for nombre, m in (("orilla-arriba.png", al), ("orilla-abajo.png", np.roll(al[::-1], 900, 1))):
        o = np.zeros((H, W, 4), "uint8"); o[..., 3] = m.astype("uint8")
        Image.fromarray(o, "RGBA").save(os.path.join(CAL, nombre), optimize=True); print(nombre, os.path.getsize(os.path.join(CAL, nombre)) // 1024, "KB")
def timbre_sol(W=360, H=430, semilla=91):
    """Timbre: sol de oro estampado en tela roja."""
    a = tela(max(W, H), semilla, ROJO, .45, 10)[:H, :W]
    k = 3; im = Image.new("L", (W * k, H * k), 0); d = ImageDraw.Draw(im); cx, cy = W * k * .5, H * k * .46; R = 62 * k
    for i in range(16):
        t = i / 16 * math.tau + .1; d.line([(cx + R * 1.2 * math.cos(t), cy + R * 1.2 * math.sin(t)), (cx + 900 * math.cos(t), cy + 900 * math.sin(t))], fill=255, width=2 * k)
    d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=255)
    m = np.asarray(im.resize((W, H), Image.LANCZOS), float) / 255
    oro = tono(np.clip(.55 + .22 * ruido(H, W, 1.2, semilla + 1), 0, 1), [(0, "#a07a3c"), (.5, "#e5b771"), (1, "#f4e0a6")])
    a = a * (1 - m[..., None]) + oro * m[..., None]
    perfora(Image.fromarray(np.clip(a, 0, 255).astype("uint8")), "timbre-sol.webp", CAL)

if __name__ == "__main__":
    mar(); estrellas(); cielo(); timbre(); rasgado(); papel_viejo(); timbre_sol()
