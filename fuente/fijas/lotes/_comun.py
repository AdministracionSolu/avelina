"""Ayudas para escribir páginas de lote sin repetir la estructura. Cada lote_N.py llama a guarda()."""
import json, os
AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def guarda(p):
    ruta = os.path.join(AQUI, "paginas", p["slug"] + ".json")
    viejo = json.load(open(ruta, encoding="utf-8")) if os.path.exists(ruta) else {}
    base = {k: viejo[k] for k in ("variantes", "volumen") if k in viejo}
    base.update({"estado": "borrador", "revisada": "2026-11-15"}); base.update(p)
    json.dump(base, open(ruta, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
def artista(slug, cabeza, nombre, title, description, respuesta, resumen, quien, tabla, discos, mio, faq, fuentes, hermanas, coleccion="covers"):
    guarda({"slug": slug, "espera_video": True, "tipo": "artista", "coleccion": coleccion, "cabeza": cabeza, "title": title, "description": description,
            "h1": nombre, "resumen": resumen, "respuesta": respuesta,
            "cover": {"cancion": f"Covers de {nombre}", "artista": nombre, "credito": f"Las canciones son de {nombre} y sus coautores. Aquí no va ninguna letra.",
                      "nota": f"Aquí van a vivir mis covers de {nombre}, a guitarra y voz."},
            "secciones": [{"h2": f"Quién es {nombre}", "bloques": quien},
                          {"h2": "Sus canciones más conocidas", "bloques": [{"tabla": {"cab": ["Canción", "Año", "Dato"], "filas": tabla}}]},
                          {"h2": "Sus discos", "bloques": [{"lista": discos}]},
                          {"h2": "Mis covers", "bloques": mio}],
            "faq": faq, "fuentes": fuentes, "hermanas": hermanas})
def cover(slug, cabeza, cancion, artista_, compositor, title, description, respuesta, resumen, ficha, secciones, faq, fuentes, hermanas, credito=None, coleccion="covers"):
    guarda({"slug": slug, "espera_video": True, "tipo": "cover", "coleccion": coleccion, "cabeza": cabeza, "title": title, "description": description,
            "h1": f"{cancion}, de {artista_}" if artista_ else cancion, "resumen": resumen, "respuesta": respuesta,
            "cover": {"cancion": cancion, "artista": artista_, "compositor": compositor,
                      "credito": credito or f"Canción de {artista_}. Aquí no va la letra: es de su autor.",
                      "nota": "Mi versión a guitarra y voz viene en camino. Cuando la suba, aparece aquí."},
            "secciones": [{"h2": "Ficha de la canción", "bloques": [{"tabla": {"cab": ["Dato", cancion], "filas": ficha}},
                          {"nota": "Datos de las fuentes del final, revisados el 15 de noviembre de 2026."}]}] + secciones,
            "faq": faq + [{"q": "¿Aquí está la letra?", "a": "No. Esta página cuenta su historia y lleva mi versión en video."}],
            "fuentes": fuentes, "hermanas": hermanas})
