"""Lote 6: listas para dedicar, música para estudiar, vocalización, cantautores, música indie y las mañanitas (sin letra)."""
from _comun import guarda, cover

NOTA = {"nota": "Sólo títulos y artistas. Las letras son de sus autores y no se copian aquí."}
def lista(slug, cabeza, title, desc, h1, resumen, resp, filas, extra, faq, hermanas, fuentes=None, cab=("Canción", "Artista", "Para cuándo")):
    p = {"slug": slug, "tipo": "lista", "coleccion": "canciones-para", "cabeza": cabeza, "title": title, "description": desc, "h1": h1, "resumen": resumen,
         "respuesta": resp, "secciones": [{"h2": "La lista", "bloques": [{"tabla": {"cab": list(cab), "filas": filas}}, NOTA]}] + extra, "faq": faq, "hermanas": hermanas}
    if fuentes: p["fuentes"] = fuentes
    guarda(p)

lista("canciones-para-papa", "canciones para papá", "Canciones para papá: las más dedicadas en el Día del Padre",
 "Canciones para papá en español: Mi viejo, Ese que me dio la vida y otras que más se dedican en el Día del Padre, con artista y año. Escoge y dedícala.",
 "Canciones para papá", "Las canciones para papá que más se dedican en el Día del Padre.",
 "La canción para papá más dedicada en español es Mi viejo, de Piero, de 1969. Le siguen Ese que me dio la vida, de Alejandro Sanz, y La meta de mi viaje, de Laura Pausini. Abajo está la lista con su artista.",
 [["Mi viejo", "Piero", "El clásico, salió en 1969"], ["Ese que me dio la vida", "Alejandro Sanz", "De hijo a papá, de 1995"], ["La meta de mi viaje", "Laura Pausini", "Para agradecerle el camino"],
  ["Papá cuéntame otra vez", "Ismael Serrano", "Para papás con historias"], ["Cuando yo quería ser grande", "Alejandro Fernández", "Con mariachi"], ["Padre mío", "Julio Jaramillo", "Para los nostálgicos"]],
 [{"h2": "Para mandársela", "bloques": ["Junta la canción con unas palabras tuyas. Hay mensajes para papá en [feliz cumpleaños para hombre](/feliz-cumpleanos-para-hombre/)."]}],
 [{"q": "¿Cuál es la canción más famosa para papá?", "a": "Mi viejo, de Piero, de 1969. Es la que más se repite en las listas del Día del Padre."}],
 ["canciones-para-mama", "feliz-cumpleanos-para-hombre", "canciones-para-dedicar", "canciones-para-dedicar-a-un-hijo"],
 [{"t": "Canciones para el Día del Padre, El Imparcial", "url": "https://www.elimparcial.com/espectaculos/2026/06/21/canciones-para-el-dia-del-padre-15-temas-para-dedicar-y-celebrar-a-papa-este-2026/"},
  {"t": "Canciones del Día del Padre, Canal Trece", "url": "https://canaltrece.com.co/noticias/canciones-del-dia-del-padre-letra/"},
  {"t": "Canciones para el Día del Padre, Billboard", "url": "https://www.billboard.com/lists/canciones-dia-del-padre-lista/alejandro-fernandez-cuando-yo-queria-ser-grande-2"}])

lista("canciones-para-dedicar", "canciones para dedicar", "Canciones para dedicar: de amor, amistad y familia",
 "Canciones para dedicar a tu pareja, a una amiga o a tu familia, en español, con artista y para qué momento. Clásicos y cantautoras a guitarra.",
 "Canciones para dedicar", "Canciones para dedicar por persona y por momento.",
 "Una canción para dedicar funciona cuando dice algo que tú no sabes decir. Aquí van por persona, para pareja, mamá o un amor que terminó. Todas las estoy grabando a guitarra y voz.",
 [["[Te regalo](/te-regalo-carla-morrison/)", "Carla Morrison", "Para tu pareja"], ["[Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/)", "Natalia Lafourcade", "Para un amor que se queda"],
  ["[Eres para mí](/eres-para-mi-julieta-venegas/)", "Julieta Venegas", "Para tu pareja, alegre"], ["[Bésame mucho](/besame-mucho/)", "Consuelo Velázquez", "Para tu pareja, clásica"],
  ["[Amor eterno](/amor-eterno/)", "Juan Gabriel", "Para recordar a mamá"], ["[Kilómetros](/kilometros-sin-bandera/)", "Sin Bandera", "Para un amor a distancia"],
  ["[Tu falta de querer](/tu-falta-de-querer-mon-laferte/)", "Mon Laferte", "Para un amor que terminó"]],
 [{"h2": "Por persona", "bloques": [{"lista": ["[Para mi novio](/canciones-para-dedicar-a-mi-novio/)", "[Para mi novia](/canciones-para-dedicar-a-mi-novia/)", "[Para mamá](/canciones-para-mama/)", "[Para papá](/canciones-para-papa/)"]}]},
  {"h2": "Dedícala con una carta", "bloques": ["Una canción sola se pierde entre mensajes. Con una [carta de amor](/cartas-de-amor/) se vuelve un regalo."]}],
 [{"q": "¿Qué canción le dedico a alguien?", "a": "Una que diga lo que sientes hoy. Piensa en la persona y en el momento, y escoge de la lista."}],
 ["canciones-para-dedicar-a-mi-novio", "canciones-para-dedicar-a-mi-novia", "canciones-para-mama", "cartas-de-amor", "canciones-de-amor-en-espanol"])

lista("canciones-para-dedicar-a-mi-novio", "cancion para dedicar a un hombre", "Canciones para dedicar a mi novio o a un hombre",
 "Canciones para dedicar a tu novio o a un hombre, en español: para enamorarlo, para un aniversario o para la distancia. Con artista y para qué momento. Escoge.",
 "Canciones para dedicar a mi novio", "Canciones para dedicar a tu novio, por momento.",
 "Para dedicarle una canción a tu novio, piensa en qué quieres decirle hoy. Aquí van por momento, del aniversario a la distancia, con su artista. Mándala junto con una carta y pesa más.",
 [["[Te regalo](/te-regalo-carla-morrison/)", "Carla Morrison", "Para decirle te quiero"], ["[Eres tú](/eres-tu-carla-morrison/)", "Carla Morrison", "Para un aniversario"],
  ["[Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/)", "Natalia Lafourcade", "Para un amor que echó raíz"], ["[Nunca es suficiente](/nunca-es-suficiente/)", "Natalia Lafourcade", "Para bailar con él"],
  ["[Eres para mí](/eres-para-mi-julieta-venegas/)", "Julieta Venegas", "Para un amor alegre"], ["[Kilómetros](/kilometros-sin-bandera/)", "Sin Bandera", "Si están lejos"]],
 [{"h2": "Con una carta", "bloques": ["Escribe dos líneas sobre por qué esa canción te recuerda a él. Hay ejemplos en [carta para mi novio](/carta-para-mi-novio/)."]}],
 [{"q": "¿Qué canción le dedico a mi novio?", "a": "Una que diga lo que sientes hoy. Para un aniversario, Eres tú. Para la distancia, Kilómetros."}],
 ["carta-para-mi-novio", "canciones-para-dedicar-a-mi-novia", "canciones-para-dedicar", "cartas-de-amor", "feliz-cumpleanos-mi-amor"])

lista("canciones-para-dedicar-a-mi-novia", "cancion para dedicar a mi novia", "Canciones para dedicar a mi novia: por momento",
 "Canciones para dedicar a tu novia en español: para decirle que la quieres, para un aniversario, para bailar o si están lejos. Con artista. Escoge y dedícala.",
 "Canciones para dedicar a mi novia", "Canciones para dedicar a tu novia, por momento.",
 "Para dedicarle una canción a tu novia, escoge la que diga lo que tú no te atreves. Aquí van por momento, con su artista. Mándala con una carta corta y se vuelve un regalo.",
 [["[Bésame mucho](/besame-mucho/)", "Consuelo Velázquez", "Para una cena de los dos"], ["[Sabor a mí](/sabor-a-mi/)", "Álvaro Carrillo", "Para decirle que se queda en ti"],
  ["[Contigo aprendí](/contigo-aprendi/)", "Armando Manzanero", "Para agradecerle lo que te enseñó"], ["[Nunca es suficiente](/nunca-es-suficiente/)", "Natalia Lafourcade", "Para bailar"],
  ["[Limón y sal](/limon-y-sal-julieta-venegas/)", "Julieta Venegas", "Para quererla como es"], ["[Kilómetros](/kilometros-sin-bandera/)", "Sin Bandera", "Si están lejos"]],
 [{"h2": "Con una carta", "bloques": ["Escribe por qué esa canción te recuerda a ella. Hay ejemplos en [carta para mi novia](/carta-para-mi-novia/)."]}],
 [{"q": "¿Qué canción le dedico a mi novia?", "a": "Para algo clásico, Bésame mucho. Para bailar, Nunca es suficiente."}],
 ["carta-para-mi-novia", "canciones-para-dedicar-a-mi-novio", "canciones-para-dedicar", "cartas-de-amor", "canciones-para-boda"])

lista("canciones-para-karaoke", "canciones para karaoke", "Canciones para karaoke en español: fáciles y en grupo",
 "Canciones para karaoke en español, fáciles y para cantar en grupo, de boleros a pop, con su nivel. Las que estoy grabando a guitarra. Escoge la tuya.",
 "Canciones para karaoke", "Canciones de karaoke en español, con su nivel.",
 "Para el karaoke, escoge una canción que conozcas completa y que todos puedan corear. Aquí van en español, con su nivel. Hay una lista aparte para [voz de mujer](/canciones-para-karaoke-mujer/).",
 [["[Cielito lindo](/cielito-lindo/)", "Quirino Mendoza y Cortés", "Fácil, la corea todo el mundo"], ["[La bikina](/la-bikina/)", "Rubén Fuentes", "Media"],
  ["[Amárrame](/amarrame-mon-laferte/)", "Mon Laferte con Juanes", "Fácil, a dúo"], ["[Como la flor](/como-la-flor-selena/)", "Selena", "Fácil"],
  ["[Ex de verdad](/ex-de-verdad-ha-ash/)", "Ha*Ash con Axel", "Fácil, a dúo"], ["[Si no te hubieras ido](/si-no-te-hubieras-ido/)", "Marco Antonio Solís", "Media"],
  ["[Amor eterno](/amor-eterno/)", "Juan Gabriel", "Difícil, pide mucha voz"]],
 [{"h2": "Antes de cantar", "bloques": ["Calienta la voz unos minutos. Hay ejercicios en [vocalización](/vocalizacion/)."]}],
 [{"q": "¿Qué canción canto en el karaoke si nunca he cantado?", "a": "Una que todos coreen, como Cielito lindo. Así no cantas solo."}],
 ["canciones-para-karaoke-mujer", "vocalizacion", "cielito-lindo", "la-bikina"], cab=("Canción", "Artista", "Nivel"))

guarda({"slug": "musica-para-estudiar", "tipo": "lista", "coleccion": "canciones-para", "cabeza": "musica para estudiar",
 "title": "Música para estudiar: canciones tranquilas a guitarra",
 "description": "Música para estudiar y concentrarte: canciones tranquilas a guitarra y voz, sin batería, para leer o trabajar. Mis videos en orden, uno detrás de otro.",
 "h1": "Música para estudiar", "resumen": "Canciones tranquilas a guitarra y voz para estudiar o trabajar.",
 "respuesta": "Para estudiar ayuda la música tranquila, sin batería ni cambios bruscos. Aquí van mis videos a guitarra y voz, en orden para escucharlos uno detrás de otro.",
 "secciones": [
  {"h2": "Mis canciones tranquilas", "bloques": [{"tabla": {"cab": ["Canción", "Dónde está"], "filas": [
   ["Improvisando", "[Videos](/videos/)"], ["Country girl", "[Música](/musica/)"], ["corazón", "[Música](/musica/)"], ["Dos almas", "[Música](/musica/)"],
   ["Valentina", "[Música](/musica/)"], ["estrellas y mar", "[Música](/musica/)"], ["Renunciación", "[Música](/musica/)"], ["Eso y más", "[Música](/musica/)"]]}},
   {"nota": "Todos están en mi canal de YouTube, @AvelinaMartinetMolina."}]},
  {"h2": "Cómo usar la música para concentrarte", "bloques": [{"lista": [
   ["Pon el volumen bajo.", "Que acompañe, no que te jale."], ["Prueba bloques de 25 minutos.", "Una lista de unas seis canciones dura más o menos eso."],
   ["Para leer, mejor sin letra o con letra suave.", "Las canciones a guitarra y voz cansan menos que las de mucha producción."]]}]},
  {"h2": "Improvisando", "bloques": ["Improvisando lo grabé una noche, ya cansada, antes de dormir. Estaba terminando el semestre.",
   "Lo puedes ver en [videos](/videos/)."]}],
 "faq": [{"q": "¿Qué música es buena para estudiar?", "a": "Música tranquila y sin cambios bruscos, a volumen bajo. La acústica, de guitarra y voz, suele funcionar bien."}],
 "hermanas": ["canciones-de-amor-en-espanol", "cantautores", "musica-indie", "foranea"]})

guarda({"slug": "vocalizacion", "tipo": "guia", "coleccion": "guitarra", "cabeza": "vocalizacion",
 "title": "Vocalización: 8 ejercicios para calentar la voz",
 "description": "Vocalización para principiantes: ocho ejercicios para calentar la voz antes de cantar, en diez minutos, y cuidados para no lastimar la garganta. Empieza hoy.",
 "h1": "Vocalización", "resumen": "Ocho ejercicios para calentar la voz en diez minutos.",
 "respuesta": "Vocalizar es calentar la voz antes de cantar, como se estira antes de correr. Con diez minutos de ejercicios suaves basta. Abajo están ocho, en orden, de lo más fácil a lo más difícil.",
 "secciones": [
  {"h2": "Los 8 ejercicios, en orden", "bloques": [{"pasos": [
   "Respira por la nariz en cuatro tiempos y saca el aire en ocho con una s larga. Repite cinco veces.",
   "Haz vibrar los labios, como un motorcito, subiendo y bajando de tono.",
   "Tararea con la boca cerrada, una m larga, sintiendo cosquillas en la cara.",
   "Haz una sirena suave con la u, de grave a agudo y de regreso.",
   "Canta cinco notas que suben y bajan con la vocal a.",
   "Repite las cinco notas con i, e, o y u.",
   "Canta mi, me, ma, mo, mu en una sola nota, articulando bien.",
   "Termina con una canción suave que conozcas, a media voz."]}]},
  {"h2": "Cuidados para la voz", "bloques": [{"lista": [
   ["Toma agua a temperatura ambiente.", "Lo muy frío y el alcohol resecan la garganta."], ["No fuerces las notas altas.", "Si duele o raspa, para."],
   ["Duerme bien.", "La voz cansada se nota primero en los agudos."], ["Calienta siempre.", "Antes de un ensayo, del karaoke o de grabar."]]}]},
  {"h2": "Para después", "bloques": ["Cuando ya calentaste, prueba una de las [canciones para karaoke](/canciones-para-karaoke/). Si tocas guitarra, afina antes con el [afinador](/afinador-de-guitarra/)."]}],
 "faq": [{"q": "¿Qué es vocalizar?", "a": "Calentar la voz con ejercicios suaves antes de cantar."}, {"q": "¿Cuánto tiempo hay que vocalizar?", "a": "Unos diez minutos antes de cantar."}],
 "hermanas": ["canciones-para-karaoke", "canciones-para-karaoke-mujer", "como-tocar-guitarra", "afinador-de-guitarra"]})

guarda({"slug": "cantautores", "tipo": "guia", "coleccion": "marca", "cabeza": "cantautores",
 "title": "Cantautores: qué es y cantautoras mexicanas de hoy",
 "description": "Qué es un cantautor y quiénes son las cantautoras y cantautores mexicanos de hoy, de Natalia Lafourcade a Kevin Kaarl, con sus discos. Y por qué yo soy una.",
 "h1": "Cantautores y cantautoras mexicanas", "resumen": "Qué es un cantautor y las cantautoras mexicanas que me inspiran.",
 "respuesta": "Un cantautor es quien canta las canciones que escribe. En México hay una generación fuerte de cantautoras y cantautores, de Natalia Lafourcade a Silvana Estrada. Yo también soy cantautora: canto lo que escribo.",
 "secciones": [
  {"h2": "Qué es un cantautor", "bloques": ["La palabra junta cantante y autor. Es quien escribe la letra y la música de sus canciones y además las canta.",
   "Muchos tocan su propio instrumento, casi siempre guitarra o piano."]},
  {"h2": "Cantautoras y cantautores mexicanos de hoy", "bloques": [{"tabla": {"cab": ["Artista", "De dónde es", "Para empezar"], "filas": [
   ["[Natalia Lafourcade](/natalia-lafourcade/)", "Ciudad de México y Coatepec", "Hasta la raíz (2015)"], ["[Carla Morrison](/carla-morrison/)", "Tecate, Baja California", "Déjenme llorar (2012)"],
   ["[Silvana Estrada](/silvana-estrada/)", "Veracruz", "Marchita (2022)"], ["[Julieta Venegas](/julieta-venegas/)", "Tijuana", "Sí (2003)"],
   ["[Kevin Kaarl](/kevin-kaarl/)", "Meoqui, Chihuahua", "San Lucas (2019)"], ["[Ed Maverick](/ed-maverick/)", "Delicias, Chihuahua", "Mix pa' llorar en tu cuarto (2018)"],
   ["[Caloncho](/caloncho/)", "Ciudad Obregón, Sonora", "Fruta II (2015)"], ["[Ximena Sariñana](/ximena-sarinana/)", "Guadalajara", "Mediocre (2008)"]]}},
   "También vive en México la cantautora chilena [Mon Laferte](/mon-laferte/), desde 2007."]},
  {"h2": "Yo, cantautora", "bloques": ["Me llamo Avelina Martinet Molina. Nací en un pueblo pequeño de Sonora y hoy soy foránea en Monterrey.",
   "Mis canciones nacen improvisando, sola con mi guitarra. Me inspiran Kevin Kaarl, Ed Maverick, Carla Morrison, Sleeping At Last, Natalia Lafourcade y Silvana Estrada.",
   "Escúchalas en [música](/musica/)."]}],
 "faq": [{"q": "¿Qué es un cantautor?", "a": "Quien canta las canciones que él mismo escribe."}, {"q": "¿Quiénes son las cantautoras mexicanas más conocidas?", "a": "Entre las de hoy, Natalia Lafourcade, Julieta Venegas, Carla Morrison y Silvana Estrada."}],
 "hermanas": ["natalia-lafourcade", "carla-morrison", "silvana-estrada", "kevin-kaarl", "musica-indie", "foranea"]})

guarda({"slug": "musica-indie", "tipo": "guia", "coleccion": "marca", "cabeza": "musica indie",
 "title": "Música indie: qué es y artistas mexicanos para empezar",
 "description": "Qué es la música indie, de dónde viene la palabra y artistas mexicanos de folk e indie para empezar, de Kevin Kaarl a Ed Maverick, con su disco más conocido.",
 "h1": "Música indie", "resumen": "Qué es la música indie y artistas mexicanos para empezar.",
 "respuesta": "Indie viene de independiente. Al principio era la música que salía sin una disquera grande, y hoy también nombra un sonido íntimo y hecho a mano. En México hay una escena fuerte de folk indie, de Kevin Kaarl a Ed Maverick.",
 "secciones": [
  {"h2": "Qué es la música indie", "bloques": ["La palabra viene del inglés independent. Nació para la música que se graba y se publica sin una disquera grande detrás.",
   "Con el tiempo se volvió también un estilo. Canciones sencillas, voces cercanas, guitarras y grabaciones caseras."]},
  {"h2": "Folk indie mexicano para empezar", "bloques": [{"tabla": {"cab": ["Artista", "Para empezar", "Dato"], "filas": [
   ["[Kevin Kaarl](/kevin-kaarl/)", "San Lucas", "Folk e indie folk de Chihuahua"], ["[Ed Maverick](/ed-maverick/)", "Fuentes de Ortiz", "Su primer disco salió con un sello independiente"],
   ["[Caloncho](/caloncho/)", "Palmar", "Pop con reggae y música tropical"], ["[Silvana Estrada](/silvana-estrada/)", "Marchita", "Canción con cuatro venezolano"],
   ["[Carla Morrison](/carla-morrison/)", "Déjenme llorar", "Latin Grammy a mejor álbum alternativo"]]}}]},
  {"h2": "Mi música", "bloques": ["Toco a guitarra y voz y subo mis canciones a mi canal. Mira mi [baúl de videos](/videos/) o escucha mis canciones en [música](/musica/)."]}],
 "faq": [{"q": "¿Qué significa indie?", "a": "Viene de independiente. Es la música que se publica sin una disquera grande, y por extensión un estilo íntimo."}],
 "hermanas": ["cantautores", "kevin-kaarl", "ed-maverick", "caloncho", "musica-para-estudiar"]})

# Las mañanitas: sin letra, esperan la versión de Ave
WPm = {"t": "Las mañanitas, Wikipedia en español", "url": "https://es.wikipedia.org/wiki/Las_ma%C3%B1anitas"}
for slug, cab, title, desc, resp, extra, herm in [
 ("mananitas-para-whatsapp", "las mañanitas feliz cumpleaños para whatsapp", "Mañanitas para WhatsApp: mándalas con una postal",
  "Mañanitas de cumpleaños para mandar por WhatsApp: mi versión a guitarra y voz y una postal con tu felicitación, listas para compartir desde el celular.",
  "Para mandar las mañanitas por WhatsApp, comparte un video con la canción y agrega una felicitación tuya. Aquí va a estar mi versión a guitarra y voz. Escribe tu mensaje en la postal y mándalo junto.",
  [{"h2": "Escribe tu felicitación", "bloques": [{"herramienta": {"tipo": "postal", "ocasion": "mananitas", "para": "", "firma": "", "texto": "Feliz cumpleaños.\n\nTe mando las mañanitas para que empieces tu día cantado.\n\nUn abrazo grande."}}]},
   {"h2": "Cómo mandarlas", "bloques": [{"pasos": ["Escribe tu felicitación en la postal.", "Toca Mandar por WhatsApp y escoge a la persona.", "Manda después el enlace de mi versión, temprano en la mañana."]}]}],
  ["las-mananitas", "mananitas-para-mama", "feliz-cumpleanos-para-dedicar", "feliz-cumpleanos-en-letra-bonita"]),
 ("mananitas-para-mama", "mañanitas para mamá", "Mañanitas para mamá: mi versión y una postal",
  "Mañanitas para mamá en su cumpleaños o el 10 de mayo: mi versión a guitarra y voz y una postal con tu mensaje para despertarla cantando. Mándaselas temprano.",
  "Las mañanitas para mamá se cantan temprano, para despertarla en su cumpleaños o el 10 de mayo. Aquí va a estar mi versión a guitarra y voz para mandársela. Junto escríbele una postal.",
  [{"h2": "Escríbele una postal", "bloques": [{"herramienta": {"tipo": "postal", "ocasion": "mananitas-mama", "para": "Mamá", "firma": "", "texto": "Buenos días, mamá.\n\nHoy te despierto con las mañanitas porque te lo mereces todo.\n\nTe quiero mucho."}},
    "Más mensajes en [feliz cumpleaños, mamá](/feliz-cumpleanos-mama/)."]}],
  ["las-mananitas", "feliz-cumpleanos-mama", "canciones-para-mama", "carta-para-mi-mama"]),
 ("las-mananitas-vicente-fernandez", "mañanitas vicente fernández", "Las mañanitas de Vicente Fernández y otras versiones",
  "Las mañanitas de Vicente Fernández, Alejandro Fernández y Pedro Infante: quiénes las grabaron, de dónde viene la canción y mi versión a guitarra y voz.",
  "Vicente Fernández y Alejandro Fernández están entre los intérpretes más conocidos de Las mañanitas, con mariachi. Pedro Infante grabó la versión atribuida a Alejandro Manzo Salceda. Aquí va a estar también mi versión a guitarra y voz.",
  [{"h2": "Quiénes las grabaron", "bloques": [{"lista": ["Pedro Infante, con la versión atribuida a Manzo. Es de las más populares.", "Vicente Fernández y Alejandro Fernández, con mariachi.",
     "Jorge Negrete, Javier Solís y José Alfredo Jiménez."]}, "La historia completa está en [las mañanitas](/las-mananitas/)."]}],
  ["las-mananitas", "mananitas-para-whatsapp", "cielito-lindo", "canciones-para-cumpleanos"]),
]:
    guarda({"slug": slug, "espera_video": True, "tipo": "cover", "coleccion": "cumpleanos", "cabeza": cab, "title": title, "description": desc,
            "h1": title.split(":")[0], "resumen": desc[:80].rsplit(" ", 1)[0] + "…", "respuesta": resp,
            "cover": {"cancion": "Las mañanitas", "artista": "Canción tradicional mexicana", "credito": "La versión más popular está registrada en la SACM. Aquí no va la letra.",
                      "nota": "Mi versión a guitarra y voz viene en camino."},
            "secciones": extra, "faq": [{"q": "¿Aquí está la letra de Las mañanitas?", "a": "No. Aquí va mi versión en video y su historia."}],
            "fuentes": [WPm], "hermanas": herm})
print("lote 6")
