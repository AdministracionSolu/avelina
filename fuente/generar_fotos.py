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
for n, k in FOTOS.items():
    im = srgb(Image.open(f"{ORIGEN}/avelina-{k}.jpg"))
    for sufijo, lado, q in (("", 2600, 84), ("-chica", 1200, 82)):
        c = im.copy(); c.thumbnail((lado, lado), Image.LANCZOS)
        p = os.path.join(RAIZ, f"img/fotos/{n}{sufijo}.webp"); c.save(p, quality=q, method=6)
        print(n + sufijo, c.size, os.path.getsize(p) // 1024, "KB")
