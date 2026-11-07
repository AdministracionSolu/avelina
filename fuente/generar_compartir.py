#!/usr/bin/env python3
"""Imagen de 1200x630 que aparece al compartir el sitio: foto de guitarra y nombre bordado.
Necesita numpy y pillow. Uso: python3 fuente/generar_compartir.py  (desde la raíz del repo)."""
import os
import numpy as np
from PIL import Image, ImageFilter
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
foto = Image.open(os.path.expanduser("~/Downloads/fotos inspo web/a39f48f2-1711-4777-8c31-81504ebcfde0.JPG")).convert("RGB")
w, h = foto.size; foto = foto.crop((int(w * .012), int(h * .012), int(w * .975), int(h * .985)))
t = np.asarray(foto.resize((1, 1), Image.BOX), float)[0, 0]; Y, X = np.mgrid[0:H, 0:W].astype(float)
luz = np.exp(-(((X - 880) / 620)**2 + ((Y - 280) / 480)**2))
fondo = Image.fromarray(np.clip(t * .13 + (t * .4) * luz[..., None], 0, 255).astype("uint8")).convert("RGBA")
alto = 540; g = foto.resize((int(foto.width * alto / foto.height), alto), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 50, 2))
b = 13; hoja = Image.new("RGBA", (g.width + 2 * b, g.height + 2 * b), "#f6efdf"); hoja.paste(g, (b, b)); hoja = hoja.rotate(-1.6, expand=True, resample=Image.BICUBIC)
x, y = 815, (H - hoja.height) // 2
sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sombra.paste((0, 0, 0, 170), (x + 7, y + 11), hoja.split()[3]); sombra = sombra.filter(ImageFilter.GaussianBlur(12))
fondo = Image.alpha_composite(fondo, sombra); fondo.alpha_composite(hoja, (x, y))
n = Image.open(os.path.join(RAIZ, "img/marca/avelina-hilo.webp")).convert("RGBA"); e = 770 / n.width; n = n.resize((770, int(n.height * e)), Image.LANCZOS)
fondo.alpha_composite(n, (50, (H - n.height) // 2 - 10))
fondo.convert("RGB").save(os.path.join(RAIZ, "img/compartir.jpg"), quality=88, optimize=True); print("compartir", os.path.getsize(os.path.join(RAIZ, "img/compartir.jpg")) // 1024, "KB")
