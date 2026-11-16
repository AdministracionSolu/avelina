#!/usr/bin/env python3
"""Agrupa avelina_SIEMPRE.csv en páginas por intención.
Escribe LISTA_CONSTRUIR.csv y descartadas_construccion.csv. Truena si una cabeza queda sin destino o en dos.
Uso: python3 fuente/fijas/agrupar.py"""
import csv, os, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTE = os.path.expanduser("~/material/planificador-pilsi-avelina-2026-11/avelina_SIEMPRE.csv")

def n(s):
    s = unicodedata.normalize("NFD", s.lower()); return "".join(c for c in s if unicodedata.category(c) != "Mn").strip()

# slug: (tipo, coleccion, [cabezas; la primera es la cabeza de la página])
P = {}
def pg(slug, tipo, col, *cab): P[slug] = (tipo, col, list(cab))

# ---- covers: artistas y canciones (sin letra, con lugar para el video de Ave)
pg("mon-laferte", "artista", "covers", "mon laferte", "canciones de mon laferte")
pg("tu-falta-de-querer-mon-laferte", "cover", "covers", "mon laferte tu falta de querer", "tu falta de querer")
pg("amarrame-mon-laferte", "cover", "covers", "amarrame mon laferte", "amarrame", "curame mon laferte")
pg("mi-buen-amor-mon-laferte", "cover", "covers", "mi buen amor mon laferte", "mi buen amor")
pg("si-tu-me-quisieras-mon-laferte", "cover", "covers", "mon laferte si tu me quisieras", "si tu me quisieras")
pg("antes-de-ti-mon-laferte", "cover", "covers", "antes de ti mon laferte")
pg("carla-morrison", "artista", "covers", "carla morrison", "canciones de carla morrison")
pg("amor-amor-carla-morrison", "cover", "covers", "amor amor carla morrison")
pg("dejenme-llorar-carla-morrison", "cover", "covers", "carla morrison dejenme llorar")
pg("disfruto-carla-morrison", "cover", "covers", "carla morrison disfruto")
pg("te-regalo-carla-morrison", "cover", "covers", "te regalo carla morrison")
pg("eres-tu-carla-morrison", "cover", "covers", "eres tu carla morrison")
pg("compartir-carla-morrison", "cover", "covers", "compartir carla morrison")
pg("contigo-carla-morrison", "cover", "covers", "contigo carla morrison")
pg("natalia-lafourcade", "artista", "covers", "natalia lafourcade", "canciones de natalia lafourcade", "lafourcade")
pg("hasta-la-raiz-natalia-lafourcade", "cover", "covers", "hasta la raiz")
pg("nunca-es-suficiente", "cover", "covers", "nunca es suficiente", "natalia lafourcade nunca es suficiente", "los ángeles azules nunca es suficiente")
pg("lo-que-construimos-natalia-lafourcade", "cover", "covers", "lo que construimos", "natalia lafourcade lo que construimos")
pg("en-el-2000-natalia-lafourcade", "cover", "covers", "natalia lafourcade en el 2000")
pg("amor-de-mis-amores", "cover", "covers", "amor de mis amores")
pg("kevin-kaarl", "artista", "covers", "kevin kaarl", "canciones de kevin kaarl")
pg("san-lucas-kevin-kaarl", "cover", "covers", "san lucas kevin kaarl")
pg("colapso-kevin-kaarl", "cover", "covers", "kevin kaarl colapso")
pg("silvana-estrada", "artista", "covers", "silvana estrada")
pg("como-un-pajaro-silvana-estrada", "cover", "covers", "como un pajaro silvana estrada")
pg("la-quinta-estacion", "artista", "covers", "la quinta estacion", "canciones de la quinta estacion")
pg("el-sol-no-regresa-la-quinta-estacion", "cover", "covers", "el sol no regresa la quinta estación", "el sol no regresa")
pg("me-muero-la-quinta-estacion", "cover", "covers", "me muero la quinta estacion")
pg("julieta-venegas", "artista", "covers", "julieta venegas", "canciones de julieta venegas", "venegas")
pg("limon-y-sal-julieta-venegas", "cover", "covers", "julieta venegas limon y sal", "limon y sal")
pg("eres-para-mi-julieta-venegas", "cover", "covers", "eres para mi julieta venegas")
pg("ximena-sarinana", "artista", "covers", "ximena sariñana", "canciones de ximena sariñana", "sariñana")
pg("ed-maverick", "artista", "covers", "ed maverick", "canciones de ed maverick")
pg("caloncho", "artista", "covers", "caloncho")
pg("ha-ash", "artista", "covers", "canciones de ha ash", "canciones de ha * ash")
pg("ex-de-verdad-ha-ash", "cover", "covers", "ex de verdad", "ha * ash ex de verdad")
pg("perdon-perdon-ha-ash", "cover", "covers", "ha * ash perdón perdón")
pg("lo-aprendi-de-ti-ha-ash", "cover", "covers", "ha * ash lo aprendí de ti")
pg("jesse-y-joy", "artista", "covers", "canciones de jesse y joy")
pg("sin-bandera", "artista", "covers", "canciones de sin bandera")
pg("kilometros-sin-bandera", "cover", "covers", "sin bandera kilómetros")
pg("daniela-spalla", "artista", "covers", "daniela spalla")
pg("amor-eterno", "cover", "covers", "amor eterno", "juan gabriel amor eterno", "rocío dúrcal amor eterno")
pg("cielito-lindo", "cover", "covers", "cielito lindo", "cielito lindo pedro infante")
pg("la-bikina", "cover", "covers", "la bikina", "la bikina luis miguel")
pg("la-llorona", "cover", "covers", "la llorona")
pg("sabor-a-mi", "cover", "covers", "sabor a mi", "luis miguel sabor a mí")
pg("besame-mucho", "cover", "covers", "besame mucho")
pg("consuelo-velazquez", "artista", "covers", "consuelo velázquez")
pg("historia-de-un-amor", "cover", "covers", "historia de un amor")
pg("como-la-flor-selena", "cover", "covers", "como la flor", "selena como la flor")
pg("contigo-aprendi", "cover", "covers", "contigo aprendi")
pg("si-no-te-hubieras-ido", "cover", "covers", "si no te hubieras ido", "marco antonio solís si no te hubieras ido")
pg("por-que-me-haces-llorar-juan-gabriel", "cover", "covers", "juan gabriel porque me haces llorar")
pg("palabras-tristes-los-yonics", "cover", "covers", "los yonic's palabras tristes")
pg("tristes-recuerdos-antonio-aguilar", "cover", "covers", "tristes recuerdos antonio aguilar")
# ---- herramientas: afinador (micrófono del navegador)
pg("afinador-de-guitarra", "herramienta", "afinador", "afinador de guitarra online", "afinador", "afinadores de guitarra acustica", "afinador cromatico", "afinador de google", "afinador guitar tuner", "afinador onlime", "ador de guitarra")
pg("como-afinar-una-guitarra", "herramienta", "afinador", "afinar guitarra", "afinando una guitarra", "afinación de guitarra acustica")
pg("afinador-de-ukulele", "herramienta", "afinador", "afinador de ukelele", "afinación ukelele", "afinador uke")
pg("afinador-de-bajo", "herramienta", "afinador", "afinador de bajo", "afinar el bajo")
pg("afinador-de-bajo-quinto", "herramienta", "afinador", "afinador de bajo quinto", "afinación bajo quinto", "afinando bajo quinto")
pg("afinador-de-violin", "herramienta", "afinador", "afinadores de violin")
# ---- guitarra y acordes
pg("acordes-de-ukulele", "guia", "guitarra", "acorde de ukelele", "acordes ukulele", "uke acordes", "ukelele acords", "acorde d en ukelele", "nota del ukelele", "tablatura ukulele")
pg("acordes-de-guitarra-para-principiantes", "guia", "guitarra", "acordes de guitarra para principiantes", "notas de musica guitarra", "guitarra facil")
pg("como-tocar-guitarra", "guia", "guitarra", "como tocar guitarra", "como aprender a tocar guitarra", "tocar una guitarra")
pg("canciones-faciles-en-guitarra", "lista", "guitarra", "canciones faciles en guitarra", "canciones en guitarra", "cancionero en guitarra", "cancionero con acordes de guitarra", "guitarra facil cancionero", "acordes de guitarra canciones")
pg("vocalizacion", "guia", "guitarra", "vocalizacion")
# ---- cartas (generador de postales en su estilo)
pg("carta-para-mi-mama", "carta", "cartas", "carta para la mamá", "carta para dia de la madre")
pg("carta-para-mi-novio", "carta", "cartas", "carta para mi novio", "carta bonita para mi novio", "carta de amor para mi novio", "cartas creativas para mi novio", "cartas de amor para mi novio creativas", "cartas para mi novio largas que hagan llorar")
pg("carta-para-mi-novia", "carta", "cartas", "una carta para mi novia", "carta bonita para mi novia", "carta de amor para mi novia", "carta para mi novia expresando lo que siento", "cartas creativas para mi novia", "ideas de cartas para mi novia", "cartas para mi novia largas que hagan llorar", "nota para mi novia")
pg("carta-para-una-amiga", "carta", "cartas", "carta para una amiga", "carta de amistad para una amiga", "carta especial para una amiga", "bonitas cartas para amigas")
pg("carta-para-mi-mejor-amiga", "carta", "cartas", "carta para mi mejor amiga", "cartas para tu mejor amiga que te hagan llorar")
pg("cartas-de-amor", "carta", "cartas", "cartas de amor", "carta de amor profundo", "cartas de amor para enamorar", "cartas de besos", "notas de amor", "tarjeta de amor", "palabra de amor bonita")
pg("carta-de-amor-a-mano", "carta", "cartas", "carta de amor con dibujos", "carta de amor a mano")
pg("carta-de-san-valentin", "carta", "cartas", "carta de san valentin", "carta para el 14 de febrero")
pg("carta-del-dia-del-amor-y-la-amistad", "carta", "cartas", "carta para el dia del amor y la amistad", "carta de san valentin para una amiga", "cartas para el 14 de febrero amistad", "cartas de la amistad")
pg("carta-de-despedida", "carta", "cartas", "carta de despedida")
pg("cartas-para-amiga-secreta", "carta", "cartas", "cartas para amiga secreta")
pg("carta-para-mi-hija", "carta", "cartas", "la carta más bonita para mi hija")
# ---- cumpleaños
pg("feliz-cumpleanos-en-letra-bonita", "herramienta", "cumpleanos", "cumpleaños feliz en letras", "feliz cumpleaños en letra bonita", "happy birthday letra bonita")
pg("feliz-cumpleanos-amiga", "carta", "cumpleanos", "cumpleaños feliz amiga")
pg("feliz-cumpleanos-mama", "carta", "cumpleanos", "cumpleaños feliz mama", "feliz cupleaños mama")
pg("feliz-cumpleanos-mi-amor", "carta", "cumpleanos", "cumpleaños feliz mi amor", "feliz cumpleaños mi amor letras bonitas", "cartas de amor de feliz cumpleaños")
pg("feliz-cumpleanos-sobrina", "carta", "cumpleanos", "cumpleaños feliz sobrina")
pg("feliz-cumpleanos-madrina", "carta", "cumpleanos", "feliz cumple madrina")
pg("feliz-cumpleanos-para-hombre", "carta", "cumpleanos", "cumpleaños feliz para hombre", "cumpleaños feliz para adulto")
pg("feliz-cumpleanos-para-mi", "carta", "cumpleanos", "cumpleaños feliz para mi")
pg("feliz-cumpleanos-para-dedicar", "carta", "cumpleanos", "feliz cumpleaños para dedicar")
pg("las-mananitas", "cover", "cumpleanos", "mañanitas de cunpleaños", "mañanitas para cumpleaños", "las mañanitas para felicitar", "las mañanitas feliz feliz cumpleanos", "las mañanitas para una persona muy especial")
pg("mananitas-para-whatsapp", "cover", "cumpleanos", "las mañanitas feliz cumpleaños para whatsapp", "mañanitas de cumpleaños para enviar por whatsapp")
pg("mananitas-para-mama", "cover", "cumpleanos", "mañanitas para mamá")
pg("las-mananitas-vicente-fernandez", "cover", "cumpleanos", "mañanitas vicente fernández", "mañanitas con alejandro fernandez")
pg("las-mananitas-en-guitarra", "guia", "cumpleanos", "las mañanitas en guitarra")
pg("canciones-para-cumpleanos", "lista", "cumpleanos", "canciones para cumpleaños", "cancion de cumpleños", "cancion de cunpleaño", "canciones para historia de instagram cumpleaños")
pg("feliz-cumpleanos-cristiano-para-mujer", "fe", "cumpleanos", "feliz cumpleaños cristianas para mujer", "versiculos de cumpleaños")
# ---- canciones para un momento (listas de canciones: título y artista, nunca letra)
pg("canciones-para-dedicar", "lista", "canciones-para", "canciones para dedicar", "cancion bonita para dedicar", "canciones de amor para dedicar")
pg("canciones-para-dedicar-a-mi-novio", "lista", "canciones-para", "cancion para dedicar a un hombre", "canciones para dedicar a mi novio", "cancion de amor para dedicar a un hombre")
pg("canciones-para-dedicar-a-mi-novia", "lista", "canciones-para", "cancion para dedicar a mi novia")
pg("canciones-para-mama", "lista", "canciones-para", "canciones para mama", "cancion para dedicar a mama", "canciones para el dia de las madres")
pg("canciones-para-dedicar-a-un-hijo", "lista", "canciones-para", "canciones para dedicar a un hijo", "canciones para dedicar a un hijo varon")
pg("canciones-para-dedicar-a-mi-hija", "lista", "canciones-para", "canciones para dedicar a mi hija", "cancion para una hija")
pg("canciones-para-una-amiga", "lista", "canciones-para", "canciones para una amiga", "canciones para dedicar a una amiga")
pg("canciones-para-papa", "lista", "canciones-para", "canciones para papá")
pg("canciones-tristes-para-llorar", "lista", "canciones-para", "playlist spotify tristes", "canciones tristes", "canciones para llorar", "canciones triste para llorar", "musica tristes", "playlist de spotify para llorar")
pg("canciones-de-desamor", "lista", "canciones-para", "canciones de desamor")
pg("canciones-de-amor-en-espanol", "lista", "canciones-para", "musica romantica en español", "canciones romanticas en español", "baladas en español", "canciones de amor en español", "cancion de amor en español")
pg("canciones-romanticas-de-los-80-en-espanol", "lista", "canciones-para", "canciones de los 80 español", "musica romantica de los 80 y 90 en español completas")
pg("canciones-para-boda", "lista", "canciones-para", "canciones para boda")
pg("canciones-para-karaoke", "lista", "canciones-para", "canciones para karaoke", "cancion para cantar en karaoke", "karaoke para cantar", "canciones para cantar")
pg("canciones-para-karaoke-mujer", "lista", "canciones-para", "cancion para karaoke mujer")
pg("musica-para-estudiar", "lista", "canciones-para", "musica para estudiar", "music para estudiar y concentrarse", "musica para concentrarse", "musica para concentrarse en el trabajo")
# ---- marca y escena
pg("foranea", "marca", "marca", "foranea", "foraneos")
pg("cantautores", "guia", "marca", "cantautores", "cantantes mexicanas")
pg("musica-indie", "guia", "marca", "musica indie")
# ---- fe: su serie de reflexiones (pide sus textos y videos; no se inventan)
pg("parabola-de-los-talentos", "fe", "fe", "parabola de los talentos", "mateo 25 14 30")
pg("dones-espirituales", "fe", "fe", "dones espirituales")
pg("proposito-de-vida", "fe", "fe", "proposito de vida", "cuál es el proposito de la vida")
pg("devocional-diario", "fe", "fe", "devocional diario", "devocional cristiano", "devocional diario cristiano")
pg("reflexiones-cristianas", "fe", "fe", "reflexiones cristianas", "reflexion cristiano", "reflexiones de dios", "reflexion del dia", "reflexión del día de hoy", "gracias dios reflexion")
pg("reflexiones-de-la-vida", "fe", "fe", "reflexion de vida", "reflecciones de la vida", "reflexion sobre la vida", "reflexiones cortas de la vida", "reflexiones de la vida cortos", "reflexiones cortas", "reflexiones de vida para seguir adelante", "reflexiones de la vida diaria con moraleja", "reflexiones positivas", "pensamientos de la vida")
pg("frases-de-dios", "fe", "fe", "frases de dios", "frases de diosito", "frases de dios bonitas", "frases de dios cortas", "amor frases de dios", "fortaleza frases de dios", "mensajes de dios", "mensajes de jesus", "palabras de dios de hoy", "dios te ama")
pg("frases-de-la-vida", "fe", "fe", "frases sabias de la vida", "frases bonitas de la vida", "frases cortas de la vida", "frases sobre la vida", "frases de la vida para reflexionar", "frases para la vida de reflexion", "frases de reflexion", "frases sabias de reflexión", "bonitas frases de reflexión", "frase corta de reflexion", "fraces de reflecion")
pg("frases-de-fe", "fe", "fe", "frases de fe", "frase de esperanza y fe", "frases cristianas", "frases cristianas cortas", "frases cristianas motivadoras")
pg("buenos-dias-dios-te-bendiga", "fe", "fe", "bueno dia dios te bendiga", "buenos dias dios", "buen dia dios te bendiga", "buenos días dios te bendiga siempre", "buenos días bendiciones de dios", "buen dia bendiciones", "dios bendiga tu dia", "mensajes de bendiciones para el dia de hoy", "buenos días feliz viernes bendiciones", "buenos días reflexión positiva", "reflexion frases bonitas de buenos dias", "versiculo buenos dias cristianos")
pg("gracias-dios-por-todo", "fe", "fe", "gracia dios por tus bendiciones", "gracias dios por todo", "dar gracias a dios por todo", "gracias dios por un dia mas", "frases de agradecimiento a dios", "oracion para dar gracias a dios", "oración de la mañana para dar gracias a dios", "oración de la noche para dar gracias a dios", "oración para dar gracias a dios por un nuevo día", "salmo para dar gracias a dios", "versículos de agradecimiento a dios por las bendiciones recibidas")
pg("versiculos-de-la-biblia-para-reflexionar", "fe", "fe", "versiculo de la biblia para reflexionar", "reflexion versiculos de la biblia cortos", "frases de la biblia", "frases de la biblia motivadoras", "versiculos de bendicion", "versículos de esperanza y ánimo", "frase biblicas de amor")
pg("oracion-cristiana-de-la-manana", "fe", "fe", "oracion cristiana de la mañana", "oracion para empezar el dia con la bendicion de dios", "oraciones cristianas", "dios ayudame", "con dios me acuesto con dios me levanto")
pg("reflexion-del-evangelio-de-hoy", "fe", "fe", "evangelio de hoy y su reflexión", "reflexión del evangelio del día de hoy")
pg("reflexiones-de-amor", "fe", "fe", "reflexiones de amor", "frase de reflexión de amor", "fraces de reflecion de amor", "frase de amor triste", "frases de amor de tik tok", "frases para pedir perdón que lleguen al corazón")
pg("frases-de-fin-de-ano", "fe", "fe", "reflexion frases de fin de año", "frases cristianas de año nuevo", "reflexiones frases de un año mas de vida")
# ---- alabanzas y sus artistas: DESCARTADAS (Ave no canta alabanzas, Diego 15-nov). Van a D abajo.
ALABANZAS = ['jesus adrian romero', 'jesus adrian', 'jesus a romero', 'adrian romero', 'jesus adrian romero canciones', 'jesús adrián romero sumérgeme', 'sumergeme', 'jesús adrián romero tú estás aqui', 'marcos witt', 'christine d clario', 'christine de clario', 'd clario', 'alabanza el alfarero', 'más allá del sol alabanza', 'alabanzas cristianas', 'alabanzas', 'alabanzas a dios', 'alabanzas al rey', 'alabanzas cristianas hermosas', 'alabanzas cristianas alegres', 'musica cristiana alegre', 'musica cristianas alegres', 'cancion de alabanza', 'cancion cristiana alabanza', 'cántico de alabanza', 'salmos de alabanza', 'musicas de dios', 'canción de diosito', 'alabanzas de adoración', 'musica cristiana de adoracion', 'canciones cristianas de adoración', 'canto cristiano de adoración', 'alabanzas cristianas de adoración', 'alabanzas cristianas hermosas de adoracion', 'las mejores canciones cristianas de adoración', 'cantos de adoracion', 'coro de adoracion', 'adoraciones cristianas', 'musica para orar', 'canciones cristianas', 'musica cristiana', 'cantos cristianos', 'himnos cristianos', 'cristianos', 'coro cristianos', 'coros de avivamientos', 'alabanza de adoracion viejitas']

# Descartadas: cabeza -> razón
D = {
 "carta de spiderman para mi novio": "Personaje con marca registrada; no se dibuja ni se usa en una postal de Ave.",
 "letras te amo": "Busca letras decorativas «te amo» (imágenes); no cabe en la voz de cantautora y no tiene ángulo propio.",
 "canciones kar": "Búsqueda cortada sin intención clara («kar…»).",
 "me muero por besarte": "Título ambiguo: no se pudo atar a una sola canción ni a La Quinta Estación sin fuente.",
 "carla morrison valentina": "No hay fuente de una canción de Carla Morrison llamada así; choca con «Valentina» de Ave.",
 "los freddy's déjenme llorar": "Canción de Los Freddy's, distinta de la de Carla Morrison; artista sin relación con la marca.",
 "violeta venegas": "Intención dudosa: no hay artista con ese nombre en las fuentes; parece errata de Julieta Venegas y no se construye una página sobre una errata.",
 "ex de verdad ": "",
 "canciones faciles piano": "Piano no es su instrumento; la marca es guitarra y voz.",
 "nota de piano facil": "Piano no es su instrumento; la marca es guitarra y voz.",
 "serenata": "Cruce Pilsi-Avelina (contratación): no hay dato de que Ave dé serenatas. Decide Diego.",
 "clase de canto cerca de mi": "Cruce Pilsi-Avelina: Ave no da clases de canto (no hay dato). Decide Diego.",
 "clases de canto": "Cruce Pilsi-Avelina: Ave no da clases de canto (no hay dato). Decide Diego.",
 "rock indie": "Género que no es el suyo.",
 "mañanitas chistosas": "Pide parodias de la letra; no cabe en su voz.",
 "mañanitas chistosas para mujeres": "Pide parodias de la letra; no cabe en su voz.",
 "videos de cumpleañeros": "Intención de videos virales de terceros; sin ángulo propio.",
 "musica clasica para estudiar": "Música clásica instrumental: no es lo que Ave hace.",
 "cafes en monterrey": "Agenda o directorio de cafés sin datos verificados ni fechas de Ave; página que caduca.",
 "conciertos en monterrey": "Agenda de conciertos de otros artistas (marca ajena); Ave no tiene fechas publicadas.",
 "conciertos en monterrey hoy": "Agenda diaria de terceros; no es una fija y Ave no tiene fechas publicadas.",
 "evento en monterrey hoy": "Agenda diaria de terceros; no es una fija.",
 "eventos en monterrey": "Agenda de terceros; Ave no tiene fechas publicadas.",
 "eventos mty": "Agenda de terceros; Ave no tiene fechas publicadas.",
 "musica en vivo cerca de mi": "Directorio local en vivo; Ave no tiene fechas publicadas.",
 "que hacer en monterrey hoy": "Guía de ciudad sin relación con su música.",
 "musica para dormír": "Música instrumental para dormir; no es lo que Ave hace.",
 "música cristiana para dormir": "Música instrumental para dormir; no es lo que Ave hace.",
 "musica cristiana instrumental": "Instrumental: Ave canta, no hace música instrumental.",
 "adoraciones instrumentales": "Instrumental: Ave canta, no hace música instrumental.",
 "música cristiana que trae paz y tranquilidad": "Pide listas largas de reproducción instrumental; sin ángulo propio.",
 "corridos cristianos": "Género que no es el suyo.",
 "cumbias cristianas": "Género que no es el suyo.",
 "libreria cristiana cerca de mi": "Directorio de tiendas; sin relación con su música.",
 "cantos de adoración al santísimo": "Rezo católico (adoración eucarística): va con lo de rezos que decide Diego.",
 "salmo 91 cristiano": "Lectura bíblica completa: va con lo de rezos y lecturas que decide Diego.",
 "frases albert camus": "Citas de un autor ajeno; sin relación con la marca.",
 "séneca frases": "Citas de un autor ajeno; sin relación con la marca.",
 "frases de canciones": "Pide fragmentos de letras ajenas; prohibido.",
 "bonitas imagenes de dios": "Pide imágenes de banco; sin ángulo propio.",
 "frases con imagenes de dios": "Pide imágenes de banco; sin ángulo propio.",
 "imagenes de agradecimiento a dios": "Pide imágenes de banco; sin ángulo propio.",
 "imagenes de cristianismo": "Pide imágenes de banco; sin ángulo propio.",
 "imagenes de dios de buenas noches": "Pide imágenes de banco; sin ángulo propio.",
 "frases biblicas para lapidas": "Intención funeraria (lápidas); no cabe en la marca.",
 "reflexion frases de buenas noches": "Imágenes de buenas noches; sin ángulo propio.",
 "musica romantica de los 80 y 90 en español completas_": "",
 # títulos de sus canciones: el volumen es de canciones homónimas de otros
 "cancion del corazon": "El volumen es de canciones homónimas de otros artistas, no de «Corazón» de Ave.",
 "corazon cancion": "El volumen es de canciones homónimas de otros artistas, no de «Corazón» de Ave.",
 "dos almas": "El volumen es del bolero y de vinos con ese nombre, no de «Dos almas» de Ave. Su canción ya está en /musica/.",
 "eso y mas": "«Eso y más» es de Joan Sebastian; no se sabe si el video de Ave es cover o propia. Decide Diego con Ave.",
 "improvisando": "Palabra común; el volumen no es de su video. Su video ya está en /videos/.",
 "joan sebastian eso y más": "Canción de Joan Sebastian; se haría como cover sólo si Ave confirma que su «Eso y más» es esa canción.",
 "alejandro fernández eso y más": "Versión de otro artista; mismo caso que «eso y más».",
 "cancion de corazon": "Homónimas de otros artistas.",
 "escucharas mi corazón": "Canción de otro artista.",
 "eso y mas alejandro fernandez": "Versión de otro artista; mismo caso que «eso y más».",
 "eso y mas spotify": "Busca a Joan Sebastian en Spotify.",
 "la cancion del corazón": "Homónimas de otros artistas.",
 "renunciacion": "«Renunciación» es de otros autores (Javier Solís); no se sabe si el video de Ave es cover. Decide Diego con Ave.",
 "valentina cancion": "Homónimas de otros artistas; su «Valentina» ya está en /musica/.",
 "alessio puleo escucharas mi corazon": "Canción de otro artista.",
 "cancion dos almas": "Volumen mínimo (10-100); su canción ya está en /musica/.",
 "cancion renunciacion": "Volumen mínimo (10-100).",
 "con cada espacio de mi corazón": "Canción de otro artista.",
 "descargar eso y mas joan sebastian": "Descarga de una canción ajena.",
 "descargar joan sebastian eso y mas": "Descarga de una canción ajena.",
 "descargar musica de joan sebastian eso y mas": "Descarga de una canción ajena.",
 "eso y mas descargar": "Descarga de una canción ajena.",
 "estrellas y mar": "Volumen mínimo y el autocompletado lo ata a Kevin Kaarl; su video ya está en /musica/.",
 "la cancion corazon": "Homónimas de otros artistas.",
 "mi corazón herido": "Canción de otro artista.",
 "música corazón": "Homónimas de otros artistas.",
 "sebastián yatra eso y más": "Canción de otro artista.",
 "te odio con todo mi corazón": "Canción de otro artista.",
}
for _c in ALABANZAS: D[_c] = "Alabanza o artista de alabanzas: Ave no canta alabanzas (Diego, 15-nov)."
for _c in [k for k in D if "eso y m" in k or "renunciacion" in k]: D[_c] = "Fuera por decisión de Diego (15-nov): no se sabe si es cover o canción suya; no se pone."
for _c in ["eso y mas", "renunciacion", "joan sebastian eso y más"]: D[_c] = "Fuera por decisión de Diego (15-nov): no se sabe si es cover o canción suya; no se pone."
MARCA_RAZON = "Su nombre con la canción: volumen 0-10. Es identidad (base), no fija nueva: ya la cubren /musica/ y /videos/."

filas = list(csv.DictReader(open(FUENTE, encoding="utf-8")))
idx = {n(f["Búsqueda cabeza"]): f for f in filas}
usadas, lista, faltan = {}, [], []
for slug, (tipo, col, cabs) in P.items():
    fs = []
    for c in cabs:
        k = n(c)
        if k not in idx: faltan.append(f"{slug}: «{c}» no está en la lista")
        if k in usadas: faltan.append(f"«{c}» está en {usadas[k]} y en {slug}")
        usadas[k] = slug; fs.append(idx.get(k))
    fs = [f for f in fs if f]
    vol = sum(int(f["Con variantes"] or 0) for f in fs)
    var = []
    for f in fs[1:]: var.append(f["Búsqueda cabeza"])
    for f in fs: var += [v.strip() for v in f["Variantes"].split(";") if v.strip()]
    lista.append(dict(slug=slug, cabeza=fs[0]["Búsqueda cabeza"] if fs else cabs[0], variantes=" ; ".join(var), volumen=vol,
                      tipo=tipo, coleccion=col, familia=fs[0]["Familia"] if fs else "", n_cabezas=len(fs)))
desc = []
for f in filas:
    k = n(f["Búsqueda cabeza"])
    if k in usadas: continue
    r = D.get(f["Búsqueda cabeza"]) or D.get(k)
    if not r and f["Familia"] == "marca": r = MARCA_RAZON
    if not r: faltan.append(f"sin destino: «{f['Búsqueda cabeza']}» ({f['Familia']})"); continue
    desc.append(dict(cabeza=f["Búsqueda cabeza"], volumen=f["Con variantes"], familia=f["Familia"], razon=r))
if faltan:
    print("\n".join(faltan)); raise SystemExit(1)
lista.sort(key=lambda x: -x["volumen"])
for i, x in enumerate(lista, 1): x["orden"] = i
with open(os.path.join(AQUI, "LISTA_CONSTRUIR.csv"), "w", newline="", encoding="utf-8") as o:
    w = csv.DictWriter(o, ["orden", "slug", "cabeza", "volumen", "tipo", "coleccion", "familia", "n_cabezas", "variantes"]); w.writeheader(); w.writerows(lista)
desc.sort(key=lambda x: -int(x["volumen"] or 0))
with open(os.path.join(AQUI, "descartadas_construccion.csv"), "w", newline="", encoding="utf-8") as o:
    w = csv.DictWriter(o, ["cabeza", "volumen", "familia", "razon"]); w.writeheader(); w.writerows(desc)
print(f"{len(filas)} cabezas → {len(lista)} páginas ({sum(x['n_cabezas'] for x in lista)} cabezas) + {len(desc)} descartadas")
