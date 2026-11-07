#!/usr/bin/env python3
"""Rehace img/fotos/ desde los originales de Avelina (Descargas) con buena calidad.
Necesita pillow. Uso: python3 fuente/generar_fotos.py  (desde la raíz del repo)."""
import io, os
from PIL import Image, ImageCms
Image.MAX_IMAGE_PIXELS = None
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEN = os.path.expanduser("~/Downloads")
FOTOS = {"tarde": 6, "guitarra": 11, "vestido": 8, "puerta": 4, "botas": 12, "casa": 7}
def srgb(im):
    icc = im.info.get("icc_profile")
    if icc:
        try:
            im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), ImageCms.createProfile("sRGB"), outputMode="RGB")
        except Exception as e: print("sin convertir perfil", e)
    return im.convert("RGB")
if os.environ.get("TODO"):
  for n, k in FOTOS.items():
    im = srgb(Image.open(f"{ORIGEN}/avelina-{k}.jpg"))
    for sufijo, lado, q in (("", 2600, 84), ("-chica", 1200, 82)):
      c = im.copy(); c.thumbnail((lado, lado), Image.LANCZOS)
      p = os.path.join(RAIZ, f"img/fotos/{n}{sufijo}.webp"); c.save(p, quality=q, method=6)
      print(n + sufijo, c.size, os.path.getsize(p) // 1024, "KB")

# Portada: las fotos de guitarra solo existen pequeñas (unos 600 px). En vez de estirarlas, van
# como una impresión con su borde de papel sobre un fondo cálido, y así se ven nítidas.
from PIL import ImageDraw, ImageFilter
import numpy as np
INSPO = os.path.expanduser("~/Downloads/fotos inspo web/")
GUITARRA = {"guitarra-muro": ("a39f48f2-1711-4777-8c31-81504ebcfde0.JPG", (.012, .012, .975, .985), 1.6), "guitarra-luz": ("ff64676a-b2f5-42d0-b253-a69898c91add.JPG", (.012, .012, .975, .985), -1.4),
            "guitarra-risa": ("5c1c7b1a-c744-4f05-8b15-2e022910db92.JPG", (.012, .012, .965, .985), 1.2), "guitarra-sol": ("dbd61ddd-2804-4ef2-90d6-0825720d5924.JPG", (.012, .012, .968, .985), -1.7)}
W, H = 2400, 1500
for n, (f, c, giro) in GUITARRA.items():
    im = Image.open(INSPO + f).convert("RGB"); w, h = im.size
    im = im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    alto = 1100; ancho = int(im.width * alto / im.height)
    g = im.resize((ancho, alto), Image.LANCZOS).filter(ImageFilter.UnsharpMask(3, 55, 2))
    b = 30; hoja = Image.new("RGBA", (ancho + 2 * b, alto + 2 * b), "#f6efdf"); hoja.paste(g, (b, b))
    hoja = hoja.rotate(giro, expand=True, resample=Image.BICUBIC)
    # fondo: la luz de la foto, muy oscura, sin fingir que es la pared
    t = np.asarray(im.resize((1, 1), Image.BOX), float)[0, 0]; Y, X = np.mgrid[0:H, 0:W].astype(float)
    luz = np.exp(-(((X - 1560) / 1250)**2 + ((Y - 620) / 1000)**2))
    fondo = (t * .13)[None, None, :] + (t * .42)[None, None, :] * luz[..., None]
    fondo = Image.fromarray(np.clip(fondo, 0, 255).astype("uint8")).convert("RGBA")
    x, y = 1560 - hoja.width // 2, (H - hoja.height) // 2
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sombra.paste((0, 0, 0, 170), (x + 14, y + 22), hoja.split()[3]); sombra = sombra.filter(ImageFilter.GaussianBlur(24))
    fondo = Image.alpha_composite(fondo, sombra); fondo.alpha_composite(hoja, (x, y))
    a = np.asarray(fondo.convert("RGB"), float) + np.random.default_rng(1).normal(0, 2.2, (H, W, 1))
    p = os.path.join(RAIZ, f"img/fotos/{n}.webp"); Image.fromarray(np.clip(a, 0, 255).astype("uint8")).save(p, quality=84, method=6); print(n, os.path.getsize(p) // 1024, "KB")
    # en celular la foto llena la pantalla
    alto_m = 1560; m = im.resize((int(im.width * alto_m / im.height), alto_m), Image.LANCZOS).filter(ImageFilter.UnsharpMask(3, 50, 2))
    x = max((m.width - 760) // 2, 0); m = m.crop((x, 0, x + 760, alto_m))
    m.save(os.path.join(RAIZ, f"img/fotos/{n}-movil.webp"), quality=84, method=6)
