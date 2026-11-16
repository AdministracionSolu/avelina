"""Lote 7: siete canciones de Carla Morrison y tres de Mon Laferte (sin letra, espera video)."""
import json, os
from _comun import cover, AQUI

WP = lambda t, u, l="es": {"t": f"{t}, Wikipedia en {'español' if l == 'es' else 'inglés'}", "url": f"https://{l}.wikipedia.org/wiki/" + u}
CM, CM_EN = WP("Carla Morrison", "Carla_Morrison"), WP("Carla Morrison", "Carla_Morrison", "en")
DL = WP("Déjenme llorar", "D%C3%A9jenme_llorar")
ASD = WP("Amor supremo desnudo", "Amor_Supremo_Desnudo", "en")
CRED = "Canción de Carla Morrison. Aquí no va la letra: es de su autora."
HC = ["carla-morrison", "canciones-de-desamor", "canciones-tristes-para-llorar", "canciones-de-amor-en-espanol"]

def carla(slug, cab, can, title, desc, resp, resumen, ficha, secciones, faq, fuentes, hermanas, credito=CRED):
    cover(slug, cab, can, "Carla Morrison", ["Carla Morrison"] if credito == CRED else [], title, desc, resp, resumen, ficha,
          secciones + [{"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Mira sus otras canciones en [Carla Morrison](/carla-morrison/)."]}],
          faq, fuentes, hermanas, credito=credito)

carla("dejenme-llorar-carla-morrison", "carla morrison dejenme llorar", "Déjenme llorar",
 "Déjenme llorar de Carla Morrison: historia y mi cover",
 "Déjenme llorar, de Carla Morrison: cuándo salió, de qué disco es y los dos Latin Grammy que ganó en 2012. Su historia sin la letra y mi cover a guitarra.",
 "Déjenme llorar es una canción de Carla Morrison que salió como sencillo el 27 de noviembre de 2011. Da nombre a su primer disco de estudio, de marzo de 2012. Ganó el Latin Grammy a mejor canción alternativa en 2012.",
 "La canción que le dio a Carla Morrison su primer Latin Grammy.",
 [["Autora", "Carla Morrison"], ["Sencillo", "27 de noviembre de 2011"], ["Disco", "Déjenme llorar (2012), canción 11"],
  ["Producción del disco", "Carla Morrison, Juan Manuel Torreblanca y Andrés Landon"], ["Premio", "Latin Grammy a mejor canción alternativa (2012)"]],
 [{"h2": "El disco", "bloques": ["Déjenme llorar fue su primer disco de estudio después de dos discos cortos. Todas sus canciones son de ella.",
   {"lista": ["Ganó el Latin Grammy a mejor álbum alternativo en 2012.", "La canción también compitió por canción del año.",
              "El disco fue platino en México, según la AMPROFON.", "En 2013 compitió por un Grammy en música latina alternativa."]}]}],
 [{"q": "¿Quién escribió Déjenme llorar?", "a": "Carla Morrison. Todas las canciones del disco son suyas."},
  {"q": "¿Qué premio ganó Déjenme llorar?", "a": "El Latin Grammy a mejor canción alternativa, en 2012."}],
 [DL, CM], ["carla-morrison", "eres-tu-carla-morrison", "disfruto-carla-morrison", "canciones-tristes-para-llorar", "canciones-de-desamor"])

carla("eres-tu-carla-morrison", "eres tu carla morrison", "Eres tú",
 "Eres tú de Carla Morrison: historia y mi cover",
 "Eres tú, de Carla Morrison: cuándo salió como sencillo, de qué disco es y dónde más sonó. Su historia sin la letra y mi cover a guitarra y voz. Escúchala.",
 "Eres tú es una canción de amor de Carla Morrison. Salió como sencillo el 3 de octubre de 2012 y viene en su disco Déjenme llorar. Es una de sus canciones más escuchadas.",
 "La canción de amor de Carla Morrison del disco Déjenme llorar.",
 [["Autora", "Carla Morrison"], ["Sencillo", "3 de octubre de 2012"], ["Disco", "Déjenme llorar (2012), canción 6"], ["Lugar en el disco", "Tercer sencillo"]],
 [{"h2": "La canción", "bloques": ["Salió después de Déjenme llorar y Hasta la piel, los dos primeros sencillos del disco.",
   "En 2016 sonó en un capítulo de la serie animada Trollhunters.",
   "Si la quieres dedicar, mira [canciones para dedicar a mi novio](/canciones-para-dedicar-a-mi-novio/)."]}],
 [{"q": "¿De qué disco es Eres tú?", "a": "De Déjenme llorar, el primer disco de estudio de Carla Morrison, de 2012."}],
 [DL, CM], ["carla-morrison", "te-regalo-carla-morrison", "canciones-para-dedicar-a-mi-novio", "canciones-de-amor-en-espanol", "dejenme-llorar-carla-morrison"])

carla("disfruto-carla-morrison", "carla morrison disfruto", "Disfruto",
 "Disfruto de Carla Morrison: historia y mi cover",
 "Disfruto, de Carla Morrison: cuándo salió, de qué disco es y quién la usó en 2020. La historia de la canción sin la letra y mi cover a guitarra y voz.",
 "Disfruto es una canción de Carla Morrison que salió como sencillo el 10 de marzo de 2013. Es el cuarto sencillo de su disco Déjenme llorar. En 2020, Nicky Jam usó un fragmento en una canción suya, con permiso de Carla.",
 "El cuarto sencillo de Déjenme llorar.",
 [["Autora", "Carla Morrison"], ["Sencillo", "10 de marzo de 2013"], ["Disco", "Déjenme llorar (2012), canción 10"], ["Lugar en el disco", "Cuarto sencillo"]],
 [{"h2": "La canción", "bloques": ["Fue el último sencillo de Déjenme llorar, el disco que le dio dos Latin Grammy."]}],
 [{"q": "¿De qué disco es Disfruto?", "a": "De Déjenme llorar, de 2012. Salió como sencillo en 2013."}],
 [DL, CM], ["carla-morrison", "dejenme-llorar-carla-morrison", "eres-tu-carla-morrison", "canciones-de-amor-en-espanol"])

carla("compartir-carla-morrison", "compartir carla morrison", "Compartir",
 "Compartir de Carla Morrison: historia y mi cover",
 "Compartir, de Carla Morrison: de qué disco es, quién lo produjo y cuándo salió su video. La historia de la canción sin la letra y mi cover a guitarra y voz.",
 "Compartir es una canción de Carla Morrison de 2010. Viene en su disco corto Mientras tú dormías, que produjo Natalia Lafourcade. Fue de sus primeros videos.",
 "La canción de Carla Morrison que produjo Natalia Lafourcade.",
 [["Autora", "Carla Morrison"], ["Año", "2010"], ["Disco", "Mientras tú dormías (EP, 2010)"], ["Producción del disco", "Natalia Lafourcade"],
  ["Otra versión", "Acústica, en el EP Jugando en serio (2013)"]],
 [{"h2": "La canción", "bloques": ["Mientras tú dormías fue su segundo disco corto. Compitió por el Latin Grammy a mejor álbum alternativo en 2011.",
   "En 2013 la volvió a grabar en acústico para Jugando en serio. Mira quién la produjo en [Natalia Lafourcade](/natalia-lafourcade/)."]}],
 [{"q": "¿Quién produjo Compartir?", "a": "Natalia Lafourcade produjo el disco Mientras tú dormías, donde viene la canción."}],
 [CM, CM_EN], ["carla-morrison", "natalia-lafourcade", "eres-tu-carla-morrison", "canciones-de-amor-en-espanol"])

carla("te-regalo-carla-morrison", "te regalo carla morrison", "Te regalo",
 "Te regalo de Carla Morrison: historia y mi cover",
 "Te regalo, de Carla Morrison: cuándo salió, de qué disco es y quién hizo su video. La historia de la canción sin la letra y mi cover a guitarra y voz.",
 "Te regalo es una canción de Carla Morrison que salió como sencillo el 9 de julio de 2017. Es una de las dos canciones nuevas de Amor supremo desnudo. Llegó al lugar 2 en ventas digitales de España.",
 "La canción nueva de Amor supremo desnudo, de 2017.",
 [["Autora", "Carla Morrison"], ["Sencillo", "9 de julio de 2017"], ["Disco", "Amor supremo desnudo (2017)"], ["Producción", "Carla Morrison y Alejandro Jiménez"],
  ["Video", "Dirigido por Broducers"]],
 [{"h2": "El disco", "bloques": ["Amor supremo desnudo salió el 9 de junio de 2017. Trae en acústico las canciones de Amor supremo, de 2015, y dos nuevas.",
   "Las nuevas son Dime mentiras y Te regalo. El disco compitió por un Latin Grammy en 2018.",
   "Para dedicarla, mira [canciones para dedicar](/canciones-para-dedicar/)."]}],
 [{"q": "¿De qué disco es Te regalo?", "a": "De Amor supremo desnudo, de 2017. Es una de sus dos canciones nuevas."}],
 [ASD, CM], ["carla-morrison", "eres-tu-carla-morrison", "canciones-para-dedicar", "canciones-para-dedicar-a-mi-novio", "canciones-de-amor-en-espanol"])

carla("contigo-carla-morrison", "contigo carla morrison", "Contigo",
 "Contigo de Carla Morrison: historia y mi cover",
 "Contigo, de Carla Morrison: cuándo salió su video, quién lo dirigió y en qué disco quedó. La historia de la canción sin la letra y mi cover a guitarra y voz.",
 "Contigo es una canción de Carla Morrison de 2021. Su video salió el 21 de septiembre de 2021 y lo dirigió el francés Colin Solal Cardo. Es parte de El renacimiento, su disco de 2022.",
 "La canción de 2021 que abrió el camino a El renacimiento.",
 [["Autora", "Carla Morrison"], ["Video", "21 de septiembre de 2021"], ["Dirección del video", "Colin Solal Cardo"], ["Disco", "El renacimiento (2022)"]],
 [{"h2": "El disco", "bloques": ["El renacimiento salió por partes antes de completarse en 2022. Compitió por el Latin Grammy a mejor álbum vocal pop.",
   "Del mismo disco es Encontrarme, que compitió por canción del año en el Latin Grammy de 2022."]}],
 [{"q": "¿De qué disco es Contigo?", "a": "De El renacimiento, de 2022. El video salió en 2021."}],
 [CM], ["carla-morrison", "te-regalo-carla-morrison", "canciones-de-amor-en-espanol", "canciones-para-dedicar-a-mi-novia"])

carla("amor-amor-carla-morrison", "amor amor carla morrison", "Amor, amor",
 "Amor, amor de Carla Morrison: historia y mi cover",
 "Amor, amor en la voz de Carla Morrison: la canción de José José que grabó en un tributo de 2013, quién la escribió y de qué disco es. Sin letra y con mi cover.",
 "Amor, amor no es de Carla Morrison: es una canción de José José, de su disco de 1980. Carla la grabó en 2013 para el disco José José: un tributo 2. La escribió Rafael Pérez Botija.",
 "La canción de José José que Carla Morrison grabó en 2013.",
 [["Autor", "Rafael Pérez Botija"], ["Original", "José José, disco Amor amor (1980)"], ["Versión de Carla", "José José: un tributo 2 (2013)"],
  ["Otros en el tributo", "Natalia Lafourcade, Moderatto, Los Claxons y Panteón Rococó"]],
 [{"h2": "La original", "bloques": ["José José sacó el disco Amor amor el 16 de octubre de 1980, con el sello Ariola. La canción dio nombre al disco."]},
  {"h2": "El tributo", "bloques": ["En noviembre de 2013 salió una segunda parte del tributo a José José, con cantantes de rock y pop mexicano."]}],
 [{"q": "¿Quién canta Amor, amor original?", "a": "José José, en 1980. Carla Morrison la grabó en 2013."},
  {"q": "¿Quién escribió Amor, amor?", "a": "Rafael Pérez Botija."}],
 [WP("Amor amor (álbum de José José)", "Amor_Amor_(Jos%C3%A9_Jos%C3%A9_album)", "en"), WP("Un tributo (a José José)", "Un_Tributo_(a_Jos%C3%A9_Jos%C3%A9)", "en"),
  {"t": "Reseña del tributo, Zeta Tijuana", "url": "https://zetatijuana.com/2014/01/ya-es-disco-de-oro/"}],
 ["carla-morrison", "canciones-romanticas-de-los-80-en-espanol", "canciones-de-amor-en-espanol", "historia-de-un-amor"],
 credito="Canción de Rafael Pérez Botija, grabada por José José. Aquí no va la letra.")

# ---- Mon Laferte
ML = WP("Mon Laferte", "Mon_Laferte")
CML = "Canción de Mon Laferte. Aquí no va la letra: es de sus autores."

cover("mi-buen-amor-mon-laferte", "mi buen amor mon laferte", "Mi buen amor", "Mon Laferte", ["Mon Laferte", "Anthony López"],
 "Mi buen amor de Mon Laferte: historia y mi cover",
 "Mi buen amor, de Mon Laferte con Enrique Bunbury: quién la escribió, cuándo salió y de qué disco es. Su historia sin la letra y mi cover a guitarra.",
 "Mi buen amor es una canción de Mon Laferte que canta con Enrique Bunbury. Salió como sencillo el 8 de agosto de 2017 y es del disco La trenza. La escribió con Anthony López.",
 "El dueto de Mon Laferte con Enrique Bunbury, de La trenza.",
 [["Autores", "Mon Laferte y Anthony López"], ["Con", "Enrique Bunbury"], ["Sencillo", "8 de agosto de 2017"], ["Disco", "La trenza (2017)"],
  ["Lugar en México", "11 en la lista general de Monitor Latino y 2 en la de pop"]],
 [{"h2": "La canción", "bloques": ["La trenza salió el 28 de abril de 2017. Del mismo disco es [Amárrame](/amarrame-mon-laferte/), con Juanes.",
   "El video usa tomas de la gira de Amárrame."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Mira el resto en [Mon Laferte](/mon-laferte/)."]}],
 [{"q": "¿Con quién canta Mon Laferte Mi buen amor?", "a": "Con el español Enrique Bunbury."},
  {"q": "¿De qué disco es Mi buen amor?", "a": "De La trenza, de 2017."}],
 [WP("Mi buen amor", "Mi_buen_amor"), ML], ["mon-laferte", "amarrame-mon-laferte", "tu-falta-de-querer-mon-laferte", "canciones-de-desamor"], credito=CML)

cover("si-tu-me-quisieras-mon-laferte", "mon laferte si tu me quisieras", "Si tú me quisieras", "Mon Laferte", ["Mon Laferte"],
 "Si tú me quisieras de Mon Laferte: historia y mi cover",
 "Si tú me quisieras, de Mon Laferte: de qué disco es, su disco de oro y la noche que la cantó con Juanes en los Latin Grammy. Sin la letra y con mi cover.",
 "Si tú me quisieras es una canción de Mon Laferte de 2015. Viene en su disco Mon Laferte, vol. 1, el mismo de Tu falta de querer. En enero de 2017 recibió disco de oro por 30,000 descargas.",
 "La canción de Mon Laferte, vol. 1 que cantó con Juanes en los Latin Grammy.",
 [["Intérprete", "Mon Laferte"], ["Año", "2015"], ["Disco", "Mon Laferte, vol. 1"], ["Certificación", "Disco de oro, 26 de enero de 2017"]],
 [{"h2": "La canción", "bloques": ["En los Latin Grammy de 2016, Mon la cantó con Juanes en la guitarra.",
   "Su compañera de disco es [Tu falta de querer](/tu-falta-de-querer-mon-laferte/), la que la dio a conocer."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Mira el resto en [Mon Laferte](/mon-laferte/)."]}],
 [{"q": "¿De qué disco es Si tú me quisieras?", "a": "De Mon Laferte, vol. 1, de 2015."}],
 [ML], ["mon-laferte", "tu-falta-de-querer-mon-laferte", "amarrame-mon-laferte", "canciones-de-desamor", "canciones-tristes-para-llorar"], credito=CML)

cover("antes-de-ti-mon-laferte", "antes de ti mon laferte", "Antes de ti", "Mon Laferte", ["Mon Laferte"],
 "Antes de ti de Mon Laferte: historia y mi cover",
 "Antes de ti, de Mon Laferte: cuándo salió, su versión en japonés y su nominación a canción del año en el Latin Grammy 2018. Sin la letra y con mi cover.",
 "Antes de ti es un sencillo de Mon Laferte que salió el 2 de febrero de 2018. Compitió por canción del año en el Latin Grammy de 2018. Ella misma dirigió el primer video.",
 "El sencillo de 2018 que compitió por canción del año.",
 [["Intérprete", "Mon Laferte"], ["Sencillo", "2 de febrero de 2018"], ["Premio", "Nominada a canción del año, Latin Grammy 2018"],
  ["Video", "Dirigido por Mon Laferte, nominado a video del año en los MTV MIAW"]],
 [{"h2": "En japonés", "bloques": ["El 4 de mayo de 2018 salió una versión en japonés. Las dos salieron juntas en un disco de vinilo."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Mira el resto en [Mon Laferte](/mon-laferte/)."]}],
 [{"q": "¿Cuándo salió Antes de ti?", "a": "El 2 de febrero de 2018, como sencillo."}],
 [ML, {"t": "Antes de ti, ficha en MusicBrainz", "url": "https://musicbrainz.org/search?query=Antes+de+ti+Mon+Laferte&type=recording"}],
 ["mon-laferte", "tu-falta-de-querer-mon-laferte", "mi-buen-amor-mon-laferte", "canciones-de-desamor"], credito=CML)

# Corrección: Antes de ti no es del disco Norma (Wikipedia en inglés: lista de Norma, 10 canciones).
r = os.path.join(AQUI, "paginas", "mon-laferte.json")
p = json.load(open(r, encoding="utf-8"))
for s in p["secciones"]:
    for b in s["bloques"]:
        if isinstance(b, dict) and "tabla" in b:
            for f in b["tabla"]["filas"]:
                if f[0].startswith("[Antes de ti]"): f[2] = "Sencillo, nominada a canción del año en el Latin Grammy"
json.dump(p, open(r, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("lote 7")
