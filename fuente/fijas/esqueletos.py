#!/usr/bin/env python3
"""Crea paginas/<slug>.json como esqueleto para cada fila de LISTA_CONSTRUIR.csv que aún no tenga archivo.
Un esqueleto no se escribe ni se publica: sólo aparta el slug para que las hermanas se puedan ligar."""
import csv, json, os
AQUI = os.path.dirname(os.path.abspath(__file__))
n = 0
for f in csv.DictReader(open(os.path.join(AQUI, "LISTA_CONSTRUIR.csv"), encoding="utf-8")):
    p = os.path.join(AQUI, "paginas", f["slug"] + ".json")
    if os.path.exists(p): continue
    json.dump({"slug": f["slug"], "esqueleto": True, "estado": "borrador", "tipo": f["tipo"], "coleccion": f["coleccion"], "cabeza": f["cabeza"],
               "variantes": [v.strip() for v in f["variantes"].split(";") if v.strip()], "volumen": int(f["volumen"])},
              open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1); n += 1
print(f"{n} esqueletos nuevos")
