#!/usr/bin/env python3
"""Regenera todo lo publicable, en orden: fijas → diarias (la libreta) → sitio (portada, pies, sitemap).

  python3 fuente/publicar.py

Si una prueba truena, se detiene y no sigue. En la Mac de Diego toma el candado de build compartido con Pilsi
(~/material/planificador-pilsi-avelina-2026-11/.candado-build) para no correr dos builds a la vez; en otra
máquina ese candado no existe y no hace falta."""
import os, subprocess, sys, time

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANDADO = os.path.expanduser("~/material/planificador-pilsi-avelina-2026-11/.candado-build")
usa_candado = os.path.isdir(os.path.dirname(CANDADO))
if usa_candado:
    while True:
        try: os.mkdir(CANDADO); break
        except FileExistsError: print("esperando el candado de build…"); time.sleep(30)
try:
    for paso in ("fuente/fijas/generar.py", "fuente/diarias/generar.py", "fuente/build.py"):
        r = subprocess.run([sys.executable, os.path.join(RAIZ, paso)], cwd=RAIZ)
        if r.returncode: raise SystemExit(f"se detuvo en {paso}")
finally:
    if usa_candado: os.rmdir(CANDADO)
print("todo regenerado: revisa `git status`, commit y push a main")
