#!/usr/bin/env python3
"""Arma fuente/diarias/cola.csv y cola_fuera.csv desde la pestaña «Motor diario» del planificador de Avelina.
Se corrió una vez el 15-nov-2026. NO se vuelve a correr encima de una cola con avances: la cola viva la
rellena rellenar_cola.py (ver COMO.md, «Rellenar la cola»).

  /usr/local/bin/python3 fuente/diarias/armar_cola.py "<ruta del xlsx>"

Agrupa por intención: las búsquedas que piden lo mismo van en UNA fila = UNA diaria (GRUPOS, hecho a mano).
Fuera (cola_fuera.csv, con su razón): lo que ya contesta una fija, los cruces Pilsi-Avelina (decide Diego),
la agenda y los directorios de Monterrey (caducan y no hay datos de Ave) y lo que no cabe en su voz.
Truena si una búsqueda de la pestaña queda sin destino o en dos lugares."""
import csv, os, sys, unicodedata
import openpyxl

AQUI = os.path.dirname(os.path.abspath(__file__))
XLSX = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Desktop/Pilsi/Avelina - Planificador fijas y diarias (15-nov-2026).xlsx")

def n(s):
    s = unicodedata.normalize("NFD", s.lower()); return "".join(c for c in s if unicodedata.category(c) != "Mn").strip()

# slug: (intención = la búsqueda que contesta, [búsquedas de la pestaña que agrupa], [2-3 fijas publicadas a las que liga])
GRUPOS = {
 # ---- cantar
 "aprender-a-cantar-desde-cero": ("aprender a cantar desde cero", ["aprender a cantar", "aprender a cantar desde cero", "aprendiendo a cantar desde cero", "como cantar bien", "como cantar mejor"], ["vocalizacion", "canciones-para-karaoke", "como-tocar-guitarra"]),
 "canciones-faciles-para-cantar": ("canciones fáciles para cantar", ["canciones faciles para cantar", "canciones bonitas para cantar", "musica para cantar", "cancion facil para cantar en karaoke", "cancion facil para karaoke", "musica para cantar karaoke", "cantos con karaoke", "pista para cantar"], ["canciones-para-karaoke", "canciones-faciles-en-guitarra", "vocalizacion"]),
 "canciones-para-cantar-en-pareja": ("canciones para cantar en pareja", ["cancion para cantar en pareja"], ["canciones-para-karaoke", "canciones-de-amor-en-espanol", "canciones-para-boda"]),
 "canciones-para-cantar-a-todo-pulmon": ("canciones para cantar a todo pulmón", ["canciones para cantar a todo pulmon"], ["canciones-para-karaoke", "canciones-de-desamor", "canciones-tristes-para-llorar"]),
 "canciones-faciles-en-ingles-para-cantar": ("canciones fáciles en inglés para cantar", ["canciones faciles en ingles para cantar"], ["canciones-para-karaoke", "vocalizacion"]),
 "canciones-espanolas-para-cantar": ("canciones españolas para cantar", ["canciones españolas para cantar"], ["canciones-para-karaoke", "la-quinta-estacion", "canciones-para-karaoke-mujer"]),
 "canciones-para-bailar-y-cantar": ("canciones para bailar y cantar", ["bailar y cantar"], ["canciones-para-karaoke", "canciones-para-boda"]),
 # ---- bodas
 "canciones-para-bailar-con-papa-en-la-boda": ("canciones para bailar con papá en la boda", ["canciones para bailar con papa en la boda", "canciones para baile con papa en boda"], ["canciones-para-boda", "canciones-para-papa", "canciones-para-dedicar-a-mi-hija"]),
 "cancion-para-bailar-con-mama-en-la-boda": ("canción para bailar con mamá en la boda", ["cancion para bailar con mama en boda"], ["canciones-para-boda", "canciones-para-mama", "canciones-para-dedicar-a-un-hijo"]),
 "cancion-para-bailar-con-mi-hija-en-su-boda": ("canción para bailar con mi hija en su boda", ["cancion para bailar con mi hija en su boda"], ["canciones-para-boda", "canciones-para-dedicar-a-mi-hija", "canciones-para-papa"]),
 "cancion-para-bailar-con-mi-hijo-en-su-boda": ("canción para bailar con mi hijo en su boda", ["canción para bailar con mi hijo en su boda"], ["canciones-para-boda", "canciones-para-dedicar-a-un-hijo", "canciones-para-mama"]),
 "canciones-para-el-vals-de-boda": ("canciones para el vals de boda", ["canciones para el vals de boda", "canciones para el vals", "vals para boda"], ["canciones-para-boda", "canciones-de-amor-en-espanol", "canciones-romanticas-de-los-80-en-espanol"]),
 "cancion-para-entrada-de-novios": ("canción para la entrada de los novios", ["cancion para entrada de novios"], ["canciones-para-boda", "canciones-de-amor-en-espanol"]),
 "canciones-para-bailar-en-una-boda": ("canciones para bailar en una boda", ["cancion para bailar en boda", "temazos para bodas"], ["canciones-para-boda", "canciones-para-karaoke", "como-la-flor-selena"]),
 "cancion-para-recien-casados": ("canción para recién casados", ["cancion para recien casados"], ["canciones-para-boda", "canciones-de-amor-en-espanol", "cartas-de-amor"]),
 "canciones-para-boda-en-ingles": ("canciones para boda en inglés", ["canciones para boda en inglés"], ["canciones-para-boda", "canciones-de-amor-en-espanol"]),
 "canciones-para-despedida-de-soltera": ("canciones para despedida de soltera", ["canciones para despedida de soltera"], ["canciones-para-boda", "canciones-para-karaoke-mujer", "canciones-para-una-amiga"]),
 "canciones-para-invitaciones-de-boda": ("canciones para invitaciones de boda", ["canciones para invitaciones de boda"], ["canciones-para-boda", "canciones-de-amor-en-espanol"]),
 "canciones-para-pedir-matrimonio": ("canciones para pedir matrimonio", ["canciones para pedir matrimonio"], ["canciones-para-boda", "canciones-para-dedicar-a-mi-novia", "cartas-de-amor"]),
 # ---- covers y artistas (contexto, sin letra)
 "que-es-un-cover": ("qué es un cover en música", ["cover significado en español", "covered español", "cover musica", "covers en español"], ["mon-laferte", "carla-morrison", "natalia-lafourcade"]),
 "de-todas-las-flores-natalia-lafourcade": ("de todas las flores natalia lafourcade", ["de todas las flores", "natalia lafourcade de todas las flores"], ["natalia-lafourcade", "hasta-la-raiz-natalia-lafourcade", "lo-que-construimos-natalia-lafourcade"]),
 "discos-de-natalia-lafourcade": ("discos de natalia lafourcade", ["albumes de natalia lafourcade"], ["natalia-lafourcade", "hasta-la-raiz-natalia-lafourcade", "en-el-2000-natalia-lafourcade"]),
 "natalia-lafourcade-y-juan-gabriel": ("natalia lafourcade y juan gabriel", ["juan gabriel y natalia lafourcade"], ["natalia-lafourcade", "amor-eterno", "por-que-me-haces-llorar-juan-gabriel"]),
 "natalia-lafourcade-y-los-angeles-azules": ("natalia lafourcade y los ángeles azules", ["los angeles azules y natalia lafourcade"], ["nunca-es-suficiente", "natalia-lafourcade"]),
 "los-macorinos": ("los macorinos", ["los macorinos"], ["natalia-lafourcade", "amor-de-mis-amores", "la-llorona"]),
 "mi-tierra-veracruzana": ("mi tierra veracruzana", ["mi tierra veracruzana"], ["natalia-lafourcade", "cielito-lindo"]),
 "mujer-divina-natalia-lafourcade": ("mujer divina natalia lafourcade", ["mujer divina natalia lafourcade"], ["natalia-lafourcade", "amor-de-mis-amores"]),
 "natalia-y-la-forquetina": ("natalia y la forquetina", ["natalia y la forquetina"], ["natalia-lafourcade", "en-el-2000-natalia-lafourcade"]),
 "gaston-lafourcade": ("gastón lafourcade", ["gastón lafourcade"], ["natalia-lafourcade"]),
 "mon-laferte-vol-1": ("mon laferte vol. 1", ["mon laferte mon laferte vol 1"], ["mon-laferte", "tu-falta-de-querer-mon-laferte", "si-tu-me-quisieras-mon-laferte"]),
 "discografia-de-mon-laferte": ("discografía de mon laferte", ["discografia de mon laferte"], ["mon-laferte", "mi-buen-amor-mon-laferte", "antes-de-ti-mon-laferte"]),
 "canciones-de-mon-laferte-para-dedicar": ("canciones de mon laferte para dedicar", ["canciones de mon laferte para dedicar", "mon laferte canciones de amor"], ["mon-laferte", "canciones-para-dedicar", "mi-buen-amor-mon-laferte"]),
 "mon-laferte-y-juanes": ("mon laferte y juanes", ["juanes y mon laferte"], ["amarrame-mon-laferte", "mon-laferte"]),
 "mon-laferte-y-bunbury": ("mon laferte y bunbury", ["bunbury y mon laferte"], ["mon-laferte", "tu-falta-de-querer-mon-laferte"]),
 "mon-laferte-y-natalia-lafourcade": ("mon laferte y natalia lafourcade", ["natalia lafourcade y mon laferte"], ["mon-laferte", "natalia-lafourcade"]),
 "mon-laferte-y-carla-morrison": ("mon laferte y carla morrison", ["carla morrison y mon laferte"], ["mon-laferte", "carla-morrison"]),
 "mon-laferte-y-joel-orta": ("mon laferte y joel orta", ["mon laferte y joel orta"], ["mon-laferte"]),
 "mon-laferte-sigue-viva": ("mon laferte sigue viva", ["mon laferte sigue viva"], ["mon-laferte"]),
 "mon-laferte-metal": ("mon laferte metal", ["mon laferte metal"], ["mon-laferte"]),
 "monserrat-bustamante": ("monserrat bustamante", ["monserrat bustamante"], ["mon-laferte"]),
 "inventame-mon-laferte": ("invéntame mon laferte", ["inventame mon laferte"], ["mon-laferte", "tu-falta-de-querer-mon-laferte"]),
 "carla-morrison-exitos": ("carla morrison éxitos", ["carla morrison exitos"], ["carla-morrison", "eres-tu-carla-morrison", "te-regalo-carla-morrison"]),
 "carla-morrison-que-lloro": ("carla morrison que lloro", ["carla morrison que lloro"], ["carla-morrison", "dejenme-llorar-carla-morrison"]),
 "devuelvete-carla-morrison": ("devuélvete carla morrison", ["devuelvete carla morrison"], ["carla-morrison"]),
 "diamante-carla-morrison": ("diamante carla morrison", ["diamante carla morrison"], ["carla-morrison"]),
 "dime-mentiras-carla-morrison": ("dime mentiras carla morrison", ["dime mentiras carla morrison"], ["carla-morrison"]),
 "natalia-jimenez-la-quinta-estacion": ("natalia jiménez la quinta estación", ["natalia jimenez la quinta estacion"], ["la-quinta-estacion", "el-sol-no-regresa-la-quinta-estacion", "me-muero-la-quinta-estacion"]),
 "que-te-queria-la-quinta-estacion": ("que te quería la quinta estación", ["que te queria"], ["la-quinta-estacion"]),
 "marchita-silvana-estrada": ("marchita silvana estrada", ["marchita silvana estrada"], ["silvana-estrada", "como-un-pajaro-silvana-estrada"]),
 "dime-silvana-estrada": ("dime silvana estrada", ["dime silvana estrada"], ["silvana-estrada"]),
 "te-guardo-silvana-estrada": ("te guardo silvana estrada", ["te guardo silvana estrada"], ["silvana-estrada"]),
 "un-rayo-de-luz-silvana-estrada": ("un rayo de luz silvana estrada", ["un rayo de luz silvana estrada"], ["silvana-estrada"]),
 "andrea-bejar": ("andrea bejar", ["andrea bejar"], ["cantautores", "musica-indie"]),
 "julieta-venegas-en-monterrey": ("julieta venegas monterrey", ["julieta venegas mty"], ["julieta-venegas"]),
 "la-llorona-chavela-vargas": ("la llorona chavela vargas", ["la llorona chavela vargas"], ["la-llorona"]),
 "vete-kevin-kaarl": ("vete kevin kaarl", ["vete kevin kaarl"], ["kevin-kaarl", "san-lucas-kevin-kaarl", "colapso-kevin-kaarl"]),
 # ---- escena
 "cantantes-de-monterrey": ("cantantes de monterrey", ["cantantes de monterrey"], ["cantautores", "musica-indie", "foranea"]),
 "cantantes-mexicanas-actuales": ("cantantes mexicanas actuales", ["cantantes mexicanas actuales"], ["cantautores", "natalia-lafourcade", "silvana-estrada"]),
 "que-es-una-cantautora": ("qué es una cantautora", ["cantautora"], ["cantautores", "foranea"]),
}

# búsqueda (normalizada) -> razón por la que NO es diaria
FUERA_FIJA = {  # misma intención que una fija publicada: se suma a ella, no se hace otra página
 "cancion hasta la raiz": "/hasta-la-raiz-natalia-lafourcade/", "cancion nunca es suficiente": "/nunca-es-suficiente/",
 "dejenme llorar": "/dejenme-llorar-carla-morrison/", "canciones de silvana estrada": "/silvana-estrada/",
 "canciones de caloncho": "/caloncho/", "ejercicio de vocalizacion": "/vocalizacion/", "ejercicio para vocalizar": "/vocalizacion/",
 "canciones para cantar en karaoke mujer": "/canciones-para-karaoke-mujer/", "cantautores mexicanos": "/cantautores/",
 "musica indie en espanol": "/musica-indie/", "exitos de mon laferte": "/mon-laferte/", "musica de mon laferte": "/mon-laferte/",
 "todas las canciones de mon laferte": "/mon-laferte/", "exitos de natalia lafourcade": "/natalia-lafourcade/",
 "lafourcade canciones": "/natalia-lafourcade/", "musica de natalia lafourcade": "/natalia-lafourcade/",
 "la 5 estacion": "/la-quinta-estacion/", "la 5a estacion": "/la-quinta-estacion/", "la 5ta estacion": "/la-quinta-estacion/",
 "la quinta estacion exitos": "/la-quinta-estacion/",
 "ejercicio para cantar": "/vocalizacion/", "ejercicios de canto": "/vocalizacion/", "canciones para cantar mujeres": "/canciones-para-karaoke-mujer/",
}
def razon_fuera(q, fila):
    k = n(q)
    if k in FUERA_FIJA: return f"Misma intención que la fija {FUERA_FIJA[k]}: se suma como variante, no se hace otra página."
    if fila[8] == "cruce-pilsi-avelina": return "Cruce Pilsi-Avelina (contratar cantante, clases, serenatas): decide Diego."
    if fila[3] == "en-vivo-monterrey": return "Agenda o directorio de lugares de terceros en Monterrey: caduca y Ave no tiene fechas publicadas."
    if "cristian" in k: return "Alabanzas: Ave no canta alabanzas (Diego, 15-nov)."
    return None

wb = openpyxl.load_workbook(XLSX, read_only=True)
filas = list(wb["Motor diario"].iter_rows(values_only=True))[1:]
idx = {n(f[0]): f for f in filas}
usadas, errores, cola, fuera = {}, [], [], []
for slug, (intencion, qs, fijas) in GRUPOS.items():
    fs = []
    for q in qs:
        k = n(q)
        if k not in idx: errores.append(f"{slug}: «{q}» no está en la pestaña"); continue
        if k in usadas: errores.append(f"«{q}» está en {usadas[k]} y en {slug}")
        usadas[k] = slug; fs.append(idx[k])
    busq = []
    for f in fs: busq += [f[0]] + [v.strip() for v in (f[9] or "").split(";") if v.strip()]
    vol = sum(int(f[2] or 0) for f in fs)
    cola.append(dict(slug=slug, intencion=intencion, busquedas=" ; ".join(dict.fromkeys(busq)), volumen=vol, familia=fs[0][3] if fs else "",
                     tipo=fs[0][6] if fs else "", competencia=fs[0][7] if fs else "", fijas_sugeridas=" ; ".join(f"/{x}/" for x in fijas),
                     fuente="planificador 15-nov-2026", estado="pendiente", publicada="", nota=""))
for f in filas:
    k = n(f[0])
    if k in usadas: continue
    r = razon_fuera(f[0], f)
    if not r: errores.append(f"sin destino: «{f[0]}» ({f[3]})"); continue
    fuera.append(dict(busqueda=f[0], volumen=f[2], razon=r))
if errores: print("\n".join(errores)); raise SystemExit(1)
cola.sort(key=lambda x: (-x["volumen"], x["slug"]))
for i, x in enumerate(cola, 1): x["orden"] = i
cols = ["orden", "slug", "intencion", "busquedas", "volumen", "familia", "tipo", "competencia", "fijas_sugeridas", "fuente", "estado", "publicada", "nota"]
with open(os.path.join(AQUI, "cola.csv"), "w", newline="", encoding="utf-8") as o:
    w = csv.DictWriter(o, cols); w.writeheader(); w.writerows(cola)
with open(os.path.join(AQUI, "cola_fuera.csv"), "w", newline="", encoding="utf-8") as o:
    w = csv.DictWriter(o, ["busqueda", "volumen", "razon"]); w.writeheader(); w.writerows(sorted(fuera, key=lambda x: -int(x["volumen"] or 0)))
print(f"{len(filas)} búsquedas → {len(cola)} diarias en la cola ({sum(len(GRUPOS[s][1]) for s in GRUPOS)} búsquedas) + {len(fuera)} fuera")
