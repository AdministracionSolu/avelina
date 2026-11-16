#!/usr/bin/env python3
"""Avisa a IndexNow (Bing, Yandex, Seznam, Naver…) de URL nuevas o cambiadas de avelina.com.mx, en tandas.

  python3 fuente/indexnow.py https://avelina.com.mx/libreta/x/ https://avelina.com.mx/libreta/y/
  python3 fuente/indexnow.py --archivo lista.txt          (una URL por renglón)

La llave es pública y vive en la raíz del sitio (cb9e8168a9e013f78c0d86fa92e9d158.txt). Usa curl (no depende de los
certificados de Python). 200 o 202 = recibido. Sólo manda URL que ya respondan 200 en vivo: avisar antes del despliegue no sirve."""
import json, subprocess, sys, time

LLAVE = "cb9e8168a9e013f78c0d86fa92e9d158"
HOST = "avelina.com.mx"
TANDA = 50

urls = sys.argv[1:]
if urls[:1] == ["--archivo"]:
    urls = [u.strip() for u in open(urls[1], encoding="utf-8") if u.strip()]
urls = [u for u in dict.fromkeys(urls) if u.startswith(f"https://{HOST}/")]
if not urls: raise SystemExit("sin URL de https://avelina.com.mx/")
for i in range(0, len(urls), TANDA):
    lote = urls[i:i + TANDA]
    cuerpo = json.dumps({"host": HOST, "key": LLAVE, "keyLocation": f"https://{HOST}/{LLAVE}.txt", "urlList": lote})
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", "https://api.indexnow.org/indexnow",
                        "-H", "Content-Type: application/json; charset=utf-8", "--data-binary", cuerpo], capture_output=True, text=True)
    print(f"tanda {i // TANDA + 1}: {len(lote)} URL → {r.stdout}")
    if i + TANDA < len(urls): time.sleep(5)
