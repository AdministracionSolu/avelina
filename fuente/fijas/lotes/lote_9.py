"""Lote 9: cinco listas (hijo, hija, amiga, cumpleaños, románticas de los 80) y el cancionero de guitarra. Sólo títulos, artistas y acordes."""
from _comun import guarda

NOTA = {"nota": "Sólo títulos y artistas. Las letras son de sus autores y no se copian aquí."}
def lista(slug, cabeza, title, desc, h1, resumen, resp, filas, extra, faq, hermanas, fuentes, cab=("Canción", "Artista", "Para cuándo"), col="canciones-para"):
    guarda({"slug": slug, "tipo": "lista", "coleccion": col, "cabeza": cabeza, "title": title, "description": desc, "h1": h1, "resumen": resumen,
            "respuesta": resp, "secciones": [{"h2": "La lista", "bloques": [{"tabla": {"cab": list(cab), "filas": filas}}, NOTA]}] + extra,
            "faq": faq, "hermanas": hermanas, "fuentes": fuentes})

HIJOS = [{"t": "Artistas que escribieron canciones a sus hijos, Panamá América", "url": "https://www.panamaamerica.com.pa/variedades/artistas-que-han-creado-canciones-con-letras-dedicadas-sus-hijos-1205555"},
         {"t": "Canciones para dedicar a tu hijo o hija, Canal Trece", "url": "https://canaltrece.com.co/noticias/canciones-para-dedicar-a-tu-hijo-o-hija-melodias-que-hablan-de-amor-infinito/"}]

lista("canciones-para-dedicar-a-un-hijo", "canciones para dedicar a un hijo", "Canciones para dedicar a un hijo: escritas por papás",
 "Canciones para dedicar a un hijo en español, muchas escritas por cantantes para sus propios hijos, como Capitán tapón o Sabrás. Con artista. Escoge la tuya.",
 "Canciones para dedicar a un hijo", "Canciones para un hijo, varias escritas por cantantes para los suyos.",
 "Las canciones para dedicar a un hijo que más pesan las escribieron papás y mamás para sus propios hijos. Alejandro Sanz escribió Capitán tapón para su hijo Dylan. David Bisbal escribió Sabrás para su hijo Matteo.",
 [["Capitán tapón", "Alejandro Sanz", "La escribió para su hijo Dylan"], ["Sabrás", "David Bisbal", "La escribió para su hijo Matteo"],
  ["De pies a cabeza", "Manuel Medrano", "Para un hijo pequeño"], ["Tu guardián", "Juanes", "Para decirle que lo cuidas"],
  ["Mi persona favorita", "Alejandro Sanz con Camila Cabello", "Para hijo o hija"], ["Que bonita es esta vida", "Jorge Celedón", "Para celebrar en familia"]],
 [{"h2": "Con unas palabras tuyas", "bloques": ["Una canción dice mucho, pero tus palabras dicen lo que sólo tú sabes. Junta las dos en una [carta de amor](/cartas-de-amor/) o en una tarjeta de cumpleaños.",
   "Si buscas una para tu hija, está la lista de [canciones para dedicar a mi hija](/canciones-para-dedicar-a-mi-hija/)."]}],
 [{"q": "¿Qué canción le dedico a mi hijo?", "a": "Una escrita por un papá para su hijo, como Capitán tapón o Sabrás. Pesan más porque nacieron así."}],
 ["canciones-para-dedicar-a-mi-hija", "canciones-para-dedicar", "canciones-para-mama", "canciones-para-papa"], HIJOS)

lista("canciones-para-dedicar-a-mi-hija", "canciones para dedicar a mi hija", "Canciones para dedicar a mi hija: escritas para hijas",
 "Canciones para dedicar a tu hija en español, varias escritas por cantantes para sus hijas, como Mi princesa o Si tuviera que elegir. Con artista. Dedícala.",
 "Canciones para dedicar a mi hija", "Canciones para una hija, varias escritas por cantantes para las suyas.",
 "Muchas canciones para una hija las escribieron cantantes para sus propias hijas. Ricardo Montaner escribió Si tuviera que elegir para Evaluna, en 2002. David Bisbal escribió Mi princesa para su hija Ella.",
 [["Si tuviera que elegir", "Ricardo Montaner", "Para su hija Evaluna, de 2002"], ["Mi princesa", "David Bisbal", "Para su hija Ella"],
  ["Yo te esperaba", "Alejandra Guzmán", "Para su hija Frida Sofía, de 1992"], ["Índigo", "Camilo y Evaluna", "Para su hija Índigo"],
  ["Princesa", "Natti Natasha", "Para su hija Vida, la escribió Romeo Santos"], ["Mi persona favorita", "Alejandro Sanz con Camila Cabello", "Para su hija Alma"],
  ["Manuela", "Alejandro Sanz", "Para su hija Manuela"]],
 [{"h2": "Para su cumpleaños", "bloques": ["Si es para su cumpleaños, junta la canción con un mensaje. Hay ideas en [carta para mi hija](/carta-para-mi-hija/)."]}],
 [{"q": "¿Qué canción le dedico a mi hija?", "a": "Si tiene pocos años, Mi princesa. Si ya es grande, Si tuviera que elegir."}],
 ["carta-para-mi-hija", "canciones-para-dedicar-a-un-hijo", "canciones-para-dedicar", "canciones-para-mama"], HIJOS)

lista("canciones-para-una-amiga", "canciones para una amiga", "Canciones para una amiga: para dedicar en español",
 "Canciones para una amiga en español: Amiga mía, Amigas, Mejores amigos y otras de amistad para dedicar a tu mejor amiga, con artista. Escoge y mándala.",
 "Canciones para una amiga", "Canciones de amistad para dedicar a una amiga.",
 "La canción para una amiga más conocida en español es Amiga mía, de Alejandro Sanz. Para la amistad entre mujeres está Amigas, de Pastora Soler. Abajo hay más, con su artista.",
 [["Amiga mía", "Alejandro Sanz", "Para una amiga de años"], ["Amigas", "Pastora Soler", "Para tus amigas de siempre"],
  ["Mejores amigos", "Yera con Morat", "Para tu mejor amiga"], ["Siempre estaré ahí", "Maldita Nerea", "Para una amiga en un mal momento"],
  ["Hay un amigo en mí", "Tony Cruz", "Para reír juntas"], ["Amigos para siempre", "Los Manolos", "Para una amistad de toda la vida"]],
 [{"h2": "Con una carta", "bloques": ["Una canción con dos líneas tuyas se vuelve un regalo. Hay ideas en [carta para una amiga](/carta-para-una-amiga/) y [carta para mi mejor amiga](/carta-para-mi-mejor-amiga/)."]}],
 [{"q": "¿Qué canción le dedico a mi mejor amiga?", "a": "Amiga mía, de Alejandro Sanz, es la clásica. Para algo más alegre, Mejores amigos, de Yera con Morat."}],
 ["carta-para-una-amiga", "carta-para-mi-mejor-amiga", "feliz-cumpleanos-amiga", "canciones-para-dedicar"],
 [{"t": "Canciones sobre la amistad, Bodas.net", "url": "https://www.bodas.net/articulos/canciones-sobre-la-amistad--c9545"}])

lista("canciones-para-cumpleanos", "canciones para cumpleaños", "Canciones para cumpleaños: además de las mañanitas",
 "Canciones para cumpleaños en español: para la fiesta, para dedicar y para el video de fotos. Con artista y para qué momento, además de las mañanitas.",
 "Canciones para cumpleaños", "Canciones de cumpleaños para cantar, bailar o dedicar.",
 "Para un cumpleaños en México se cantan primero las mañanitas. Después vienen las de fiesta, como Fiesta de cumpleaños, de María Daniela y su Sonido Lasser. Abajo hay más, para cada momento.",
 [["[Las mañanitas](/las-mananitas/)", "Tradicional", "Para despertar al festejado"], ["Cumpleaños feliz", "Parchís", "Para la hora del pastel, salió en 1981"],
  ["Fiesta de cumpleaños", "María Daniela y su Sonido Lasser", "Para bailar"], ["El cumpleaños", "Fobia", "Para la fiesta con amigos"],
  ["Cumpleaños total", "Los Planetas", "Para la fiesta con amigos"], ["[Amor eterno](/amor-eterno/)", "Juan Gabriel", "Para recordar a mamá en su cumpleaños"]],
 [{"h2": "Para el video de fotos", "bloques": ["Para niños funciona la música alegre y fácil de cantar. Para tu pareja o tus papás, una más emotiva.",
   "Si lo vas a subir a redes, usa música con permiso de uso o una versión propia."]},
  {"h2": "Con un mensaje", "bloques": ["Junta la canción con un mensaje. Hay ideas en [feliz cumpleaños para dedicar](/feliz-cumpleanos-para-dedicar/) y en [mañanitas para WhatsApp](/mananitas-para-whatsapp/)."]}],
 [{"q": "¿Qué canción se canta en un cumpleaños en México?", "a": "Las mañanitas, al despertar o antes del pastel. Después sigue Cumpleaños feliz."}],
 ["las-mananitas", "feliz-cumpleanos-para-dedicar", "mananitas-para-whatsapp", "feliz-cumpleanos-mama", "feliz-cumpleanos-amiga"],
 [{"t": "Adiós a las mañanitas, Chilango", "url": "https://www.chilango.com/que-hacer/musica/adios-a-las-mananitas/"},
  {"t": "Canciones para videos de cumpleaños, Filmora", "url": "https://filmora.wondershare.es/family-n-personal/birthday-video-songs.html"},
  {"t": "Happy birthday in Spanish, Don Quijote", "url": "https://www.donquijote.org/spanish-culture/traditions/happy-birthday-in-spanish/"}], col="cumpleanos")

lista("canciones-romanticas-de-los-80-en-espanol", "canciones de los 80 español", "Canciones de los 80 en español: baladas románticas",
 "Canciones de los 80 en español: las baladas románticas de Emmanuel, Franco de Vita, Miguel Bosé, Pandora y José José, con su año. Escoge la tuya y dedícala.",
 "Canciones románticas de los 80 en español", "Las baladas en español de los 80, con su año.",
 "Las baladas en español de los 80 siguen en todas las fiestas. Te amo, de Franco de Vita, llegó al lugar 2 de Billboard en 1989. Aquí van con su artista y su año.",
 [["Amor, amor", "José José", "1980"], ["Eres", "José María Napoleón", "1980"], ["[Palabras tristes](/palabras-tristes-los-yonics/)", "Los Yonic's", "1980"],
  ["Te amaré", "Miguel Bosé", "1982"], ["Cómo te va mi amor", "Pandora", "1985"], ["Te quiero", "Hombres G", "1986"],
  ["Tú y yo", "Emmanuel", "1988"], ["Te amo", "Franco de Vita", "1988"]],
 [{"h2": "A guitarra", "bloques": ["Casi todas caben a guitarra y voz. Mira cómo empezar en [canciones fáciles en guitarra](/canciones-faciles-en-guitarra/).",
   "Carla Morrison grabó Amor, amor de José José en 2013. Su historia está en [Amor, amor](/amor-amor-carla-morrison/)."]}],
 [{"q": "¿Cuál es la balada en español más famosa de los 80?", "a": "Te amo, de Franco de Vita, es de las que más llegaron. Fue lugar 2 de Billboard en 1989."}],
 ["canciones-de-amor-en-espanol", "palabras-tristes-los-yonics", "amor-amor-carla-morrison", "canciones-para-boda", "historia-de-un-amor"],
 [{"t": "Canciones de amor de los 80, N+", "url": "https://www.nmas.com.mx/entretenimiento/canciones-amor-de-los-80-para-dedicar-14-de-febrero-lista-ingles-espanol/"},
  {"t": "Amor amor (álbum de José José), Wikipedia en inglés", "url": "https://en.wikipedia.org/wiki/Amor_Amor_(Jos%C3%A9_Jos%C3%A9_album)"},
  {"t": "Palabras tristes, LOS40 México", "url": "https://los40.com.mx/los40/2016/10/18/musicanueva/1476825292_072959.html"}], cab=("Canción", "Artista", "Año"))

# ---- Cancionero: sólo nombres de acordes (no la letra), verificados en LaCuerda el 15-nov-2026
LC = lambda t, u: {"t": f"{t}, acordes en LaCuerda", "url": "https://acordes.lacuerda.net/" + u}
guarda({"slug": "canciones-faciles-en-guitarra", "tipo": "lista", "coleccion": "guitarra", "cabeza": "canciones faciles en guitarra",
 "title": "Canciones fáciles en guitarra: cancionero con acordes",
 "description": "Canciones fáciles en guitarra en español, ordenadas por número de acordes: de 3 a 9, con su tono y los acordes que usa cada una. Empieza por la más fácil.",
 "h1": "Canciones fáciles en guitarra", "resumen": "Un cancionero ordenado de la más fácil a la más difícil, con sus acordes.",
 "respuesta": "Las canciones más fáciles en guitarra usan tres acordes. Aquí van ordenadas de menos a más acordes, con su tono. Empieza por las de tres y sube cuando cambies sin parar.",
 "secciones": [
  {"h2": "El cancionero", "bloques": [{"tabla": {"cab": ["Canción", "Acordes", "Tono"], "filas": [
    ["[San Lucas](/san-lucas-kevin-kaarl/), Kevin Kaarl", "Em, G, C", "Mi menor"],
    ["[Como la flor](/como-la-flor-selena/), Selena", "A, D, E", "La"],
    ["[Tristes recuerdos](/tristes-recuerdos-antonio-aguilar/), Antonio Aguilar", "G, C, D7", "Sol"],
    ["[Palabras tristes](/palabras-tristes-los-yonics/), Los Yonic's", "C, C7, F, G", "Do"],
    ["[Como un pájaro](/como-un-pajaro-silvana-estrada/), Silvana Estrada", "D, G, A, A7, Bm, Em, Em7, E, E7", "Re"]]}},
   {"nota": "Sólo acordes, revisados en LaCuerda el 15 de noviembre de 2026. La letra es de sus autores y no va aquí."}]},
  {"h2": "Cómo usar el cancionero", "bloques": [{"pasos": [
    "Afina primero. Usa el [afinador de guitarra](/afinador-de-guitarra/) con el micrófono de tu celular.",
    "Aprende los acordes de la canción uno por uno. Están dibujados en [acordes de guitarra para principiantes](/acordes-de-guitarra-para-principiantes/).",
    "Cambia entre dos acordes sin cantar hasta que no pares.",
    "Pon la canción original y toca un rasgueo por acorde.",
    "Cuando salga, canta encima."]}]},
  {"h2": "Por qué estas primero", "bloques": [
    "San Lucas y Como la flor usan tres acordes y nada más. Son las mejores para empezar.",
    "Tristes recuerdos y Palabras tristes agregan un acorde con séptima. Ese sonido es el de la música ranchera y las baladas viejas.",
    "Como un pájaro ya pide acordes menores con séptima. Déjala para cuando cambies rápido."]},
  {"h2": "Mis versiones", "bloques": ["Cada canción tiene su página con su historia. Ahí va a vivir mi versión a guitarra y voz cuando la grabe."]}],
 "faq": [{"q": "¿Cuál es la canción más fácil en guitarra?", "a": "Una de tres acordes, como San Lucas, de Kevin Kaarl, con Em, G y C."},
         {"q": "¿Aquí está la letra?", "a": "No. Aquí van los acordes y el tono. La letra es de sus autores."}],
 "hermanas": ["acordes-de-guitarra-para-principiantes", "como-tocar-guitarra", "afinador-de-guitarra", "como-afinar-una-guitarra", "san-lucas-kevin-kaarl"],
 "fuentes": [LC("San Lucas", "kevin_kaarl/san_lucas"), LC("Como la flor", "selena/como_la_flor"), LC("Tristes recuerdos", "antonio_aguilar/tristes_recuerdos"),
             LC("Palabras tristes", "yonics/palabras_tristes"), LC("Como un pájaro", "silvana_estrada/como_un_pajaro")]})
print("lote 9")
