"""Lote 2, segunda parte: Silvana Estrada, Caloncho, La llorona, canciones para mamá, cartas y cumpleaños."""
from _comun import guarda, artista, cover

WP = lambda t, u: {"t": f"{t}, Wikipedia en español", "url": "https://es.wikipedia.org/wiki/" + u}

artista("silvana-estrada", "silvana estrada", "Silvana Estrada",
 "Silvana Estrada: canciones, discos y covers a guitarra",
 "Silvana Estrada: la cantautora veracruzana del cuatro venezolano, sus discos de 2017 a 2025 y su Latin Grammy a mejor nuevo artista. Con mis covers.",
 "Silvana Estrada es una cantautora mexicana de Veracruz que toca el cuatro venezolano. Nació el 15 de abril de 1997. En 2022 ganó el Latin Grammy a mejor nuevo artista, compartido con Ángela Álvarez.",
 "La cantautora veracruzana del cuatro venezolano.",
 ["Estudió jazz en la Universidad Veracruzana. Toca el cuatro venezolano, el piano y la trompeta.",
  "Vivió en Nueva York, donde grabó con el músico de jazz Charlie Hunter. Después se mudó a la Ciudad de México.",
  "Wikipedia en español da dos lugares de nacimiento, Coatepec y Xalapa, los dos en Veracruz."],
 [["Marchita", "2022", "Canción que da nombre a su disco"], ["Tristeza", "", "Sencillo"], ["Te guardo", "", "Sencillo"],
  ["[Como un pájaro](/como-un-pajaro-silvana-estrada/)", "", "Sencillo"], ["Milagro y desastre", "", "Nominada al Grammy en 2024, en música global"]],
 [["Lo sagrado (2017)", "Con Charlie Hunter. Se volvió a lanzar en 2020."], ["Marchita (2022)", "El disco con el que ganó el Latin Grammy a mejor nuevo artista."],
  ["Abrazo (2022)", "EP."], ["Vendrán suaves lluvias (2025)", "Su disco más reciente al revisar esta página."]],
 ["Silvana está en mi lista de inspiraciones en [quién soy](/quien-soy/). Mis covers de ella van a guitarra y voz.",
  "Mis covers que más se escucharon en TikTok incluyen canciones suyas. Cada una tiene su página."],
 [{"q": "¿De dónde es Silvana Estrada?", "a": "De Veracruz. Wikipedia en español la ubica en Coatepec y en Xalapa."},
  {"q": "¿Qué instrumento toca Silvana Estrada?", "a": "El cuatro venezolano, una guitarra pequeña de cuatro cuerdas. También toca piano y trompeta."}],
 [WP("Silvana Estrada", "Silvana_Estrada")],
 ["como-un-pajaro-silvana-estrada", "natalia-lafourcade", "carla-morrison", "kevin-kaarl", "amor-eterno"])

artista("caloncho", "caloncho", "Caloncho",
 "Caloncho: canciones, discos y covers a guitarra",
 "Caloncho: el cantautor de Ciudad Obregón, Sonora, sus discos de 2011 a 2024 y canciones como Palmar, Optimista y Bolita de pan. Con mis covers a guitarra.",
 "Caloncho es un cantautor mexicano nacido en Ciudad Obregón, Sonora, el 20 de diciembre de 1986. Mezcla pop, reggae, música tropical y folclórica. Sus canciones más conocidas son Palmar, Optimista y Bolita de pan.",
 "El cantautor sonorense: sus discos y sus canciones más conocidas.",
 ["Su nombre es Óscar Alfonso Castro Valenzuela. Su nombre artístico junta Óscar, Alfonso y un apodo que le dio su abuelo.",
  "Estudió Relaciones Internacionales en el Tecnológico de Monterrey, en Guadalajara. Canta en español, inglés y portugués.",
  "Lleva cuatro nominaciones al Latin Grammy, entre ellas mejor nuevo artista en 2014."],
 [["El derroche", "2015", "Sencillo de Fruta II"], ["Palmar", "2015", "De Fruta II, con una versión junto a Mon Laferte"], ["Optimista", "2017", "Sencillo de Bálsamo"],
  ["Brillo mío", "2017", "De Bálsamo"], ["Bolita de pan", "2019", "Del EP PA"], ["China chula", "2019", "Del EP PA"], ["Adolescentes", "2020", "De Malvadisco"]],
 [["Homeotermo (2011)", "EP."], ["Fruta (2013)", "EP. Ganó dos Indie-O Music Awards."], ["Fruta II (2015)", "Su primer disco largo."], ["Bálsamo (2017)", ""],
  ["Tiempo compartido (2019)", "Con David Aguilar, como Vacación."], ["Malvadisco (2021)", ""], ["Buen pez (2022)", ""], ["Tofu (2024)", "Su disco más reciente al revisar esta página."]],
 ["Caloncho nació en Sonora, igual que yo. Sus canciones son luminosas y caben muy bien a guitarra y voz.",
  "Si te gusta su lado tranquilo, mira también a [Ed Maverick](/ed-maverick/)."],
 [{"q": "¿De dónde es Caloncho?", "a": "De Ciudad Obregón, Sonora. Nació el 20 de diciembre de 1986."},
  {"q": "¿Caloncho cantó con Mon Laferte?", "a": "Sí. Hay una versión de Palmar con Mon Laferte, de 2015."}],
 [WP("Caloncho", "Caloncho")],
 ["ed-maverick", "kevin-kaarl", "mon-laferte", "julieta-venegas", "foranea"])

cover("la-llorona", "la llorona", "La llorona", "", [],
 "La llorona: de dónde es la canción y mi cover",
 "La llorona es un son istmeño tradicional de Tehuantepec, Oaxaca. Su origen, las coplas de Andrés Henestrosa, la versión de Chavela Vargas y mi cover.",
 "La llorona es una canción popular mexicana del istmo de Tehuantepec, en Oaxaca. Es un son istmeño en compás de tres tiempos y no tiene un autor fijo. La versión de Chavela Vargas la llevó a todo el mundo.",
 "El son istmeño de Tehuantepec que cantó Chavela Vargas.",
 [["Origen", "Istmo de Tehuantepec, Oaxaca"], ["Género", "Son istmeño, en compás de 3/4"], ["Autor", "Tradicional, sin autor fijo"], ["Año", "Desconocido"],
  ["Versión más famosa", "Chavela Vargas"], ["En el cine", "Frida (2002), Hasta los huesos (2001) y Coco (2017)"]],
 [{"h2": "Una canción con cientos de coplas", "bloques": [
   "No hay una sola versión. Las coplas, los versos cortos que se cantan, se cuentan por cientos.",
   "La investigadora Flora Botton-Burlá juntó 121 coplas en 1992. El escritor oaxaqueño Andrés Henestrosa publicó las que oyó de niño y otras escritas por él.",
   "Su relación con la leyenda de La Llorona, la mujer que llora a sus hijos, no está clara. La canción y la leyenda son cosas distintas."]},
  {"h2": "Las versiones más famosas", "bloques": [
   {"lista": ["Chavela Vargas, la que la volvió conocida fuera de México.", "Lila Downs, Lola Beltrán, Lucha Villa y Eugenia León.",
              "Ely Guerra, Susana Harp y Ángela Aguilar.", "Joan Baez, Nana Mouskouri y Rosalía, fuera de México."]},
   "En la película Coco la cantan, en español, Angélica Vale y Marco Antonio Solís."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Si te gustan las canciones de siempre, mira también [Cielito lindo](/cielito-lindo/)."]}],
 [{"q": "¿Quién escribió La llorona?", "a": "Nadie en particular. Es una canción tradicional del istmo de Tehuantepec, con coplas de muchos autores."},
  {"q": "¿La llorona es de Oaxaca?", "a": "Sí. Nació en el istmo de Tehuantepec, Oaxaca, como son istmeño."}],
 [WP("La Llorona (canción)", "La_Llorona_(canci%C3%B3n)")],
 ["cielito-lindo", "amor-eterno", "la-bikina", "historia-de-un-amor", "besame-mucho"],
 credito="Canción tradicional del istmo de Tehuantepec. Aquí no va la letra.")

guarda({"slug": "canciones-para-mama", "tipo": "lista", "coleccion": "canciones-para", "cabeza": "canciones para mama",
 "title": "Canciones para mamá: las más dedicadas cada 10 de mayo",
 "description": "Canciones para mamá: las que más se dedican cada 10 de mayo en México, de Señora, señora a Amor eterno, con artista y para qué momento va cada una. Escoge.",
 "h1": "Canciones para mamá",
 "resumen": "Las canciones que más se dedican a mamá, con artista y momento.",
 "respuesta": "La canción más dedicada a mamá en México es Señora, señora, de Denisse de Kalafe. Le siguen clásicos como Madrecita querida y Amor eterno. Abajo está la lista con su artista y para qué momento va cada una.",
 "secciones": [
  {"h2": "Las más dedicadas el 10 de mayo", "bloques": [{"tabla": {"cab": ["Canción", "Artista", "Para cuándo"], "filas": [
   ["Señora, señora", "Denisse de Kalafe", "El 10 de mayo, la de siempre"], ["Madrecita querida", "Vicente Fernández", "Con mariachi, en la fiesta"],
   ["Mamá", "Timbiriche", "Para las que crecieron en los ochenta"], ["A la madre", "El Tri", "Para mamás rockeras"],
   ["Mi novia se me está poniendo vieja", "Ricardo Arjona", "De hijo a mamá, para emocionarla"],
   ["[Amor eterno](/amor-eterno/)", "Juan Gabriel", "Para recordar a una mamá que ya no está"]]}},
   {"nota": "Lista hecha con las que repiten N+, Vanguardia y El Universal en sus notas del Día de las Madres."}]},
  {"h2": "Para mandar por WhatsApp", "bloques": [
   "Una canción sola se pierde entre mensajes. Mándala con una carta corta y se vuelve un regalo.",
   {"pasos": ["Escoge la canción de la lista.", "Escribe una carta en la [postal para mamá](/carta-para-mi-mama/).", "Manda primero la postal y luego la canción."]}]},
  {"h2": "Para su cumpleaños", "bloques": ["En su cumpleaños van mejor las mañanitas. Mira [las mañanitas para mamá](/mananitas-para-mama/) y los [mensajes de feliz cumpleaños, mamá](/feliz-cumpleanos-mama/)."]},
  {"h2": "Si la extrañas", "bloques": ["Vivo lejos de mi familia, en Monterrey. Para quien está lejos, una canción y una carta acortan los kilómetros.",
   "Si tú también eres foránea, te escribo las [cartas de una foránea](/foranea/)."]}],
 "faq": [{"q": "¿Cuál es la canción más famosa para mamá?", "a": "Señora, señora, de Denisse de Kalafe. Es la que más se canta cada 10 de mayo en México."},
         {"q": "¿Amor eterno es para mamá?", "a": "Juan Gabriel la escribió por la muerte de su madre. Se dedica sobre todo para recordar a una mamá que ya no está."}],
 "fuentes": [{"t": "Las 10 mejores canciones para el Día de las Madres, N+", "url": "https://www.nmas.com.mx/tendencias/mejores-canciones-dia-de-las-madres-lista-baladas-rancheras-pop-para-dedicar-10-de-mayo/"},
             {"t": "Canciones emotivas para el Día de la Madre, Vanguardia", "url": "https://vanguardia.com.mx/vida/canciones-emotivas-para-celebrar-el-dia-de-la-madre-y-tocarle-el-corazon-NL15875686"},
             {"t": "Otras canciones para el 10 de mayo que no son Señora, señora, El Universal", "url": "https://www.eluniversal.com.mx/espectaculos/otras-canciones-para-celebrar-tu-mama-el-10-de-mayo-que-no-son-senora-senora/"}],
 "hermanas": ["carta-para-mi-mama", "feliz-cumpleanos-mama", "mananitas-para-mama", "amor-eterno", "canciones-para-papa", "canciones-para-dedicar"]})
print("lote 2b: covers y lista")
