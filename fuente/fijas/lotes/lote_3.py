"""Lote 3: covers de boleros, Natalia, Mon Laferte y La Quinta Estación (sin letra, espera video)."""
from _comun import cover, artista

WP = lambda t, u: {"t": f"{t}, Wikipedia en español", "url": "https://es.wikipedia.org/wiki/" + u}

cover("besame-mucho", "besame mucho", "Bésame mucho", "Consuelo Velázquez", ["Consuelo Velázquez"],
 "Bésame mucho: quién la escribió, su historia y mi cover",
 "Bésame mucho la escribió Consuelo Velázquez muy joven y es la canción más grabada del español. Su historia, sus versiones famosas y mi cover a guitarra.",
 "Bésame mucho es un bolero de la compositora mexicana Consuelo Velázquez. La escribió hacia 1932, cuando tenía unos 16 años, y se publicó en 1940. En 1999 se le reconoció como la canción más grabada en español.",
 "El bolero de Consuelo Velázquez, la canción más grabada del español.",
 [["Autora", "Consuelo Velázquez (1916 a 2005)"], ["Escrita", "Hacia 1932"], ["Publicada", "1940"], ["Primer intérprete", "Emilio Tuero"],
  ["Récord", "La canción más grabada en español, reconocida en 1999"]],
 [{"h2": "La escribió una adolescente", "bloques": [
   "Consuelo Velázquez era pianista. Escribió Bésame mucho hacia 1932, cuando tenía unos 16 años.",
   "Se dice que la melodía se inspiró en Quejas, o la maja y el ruiseñor, una pieza para piano de Enrique Granados.",
   "Para conocer más de ella, mira la página de [Consuelo Velázquez](/consuelo-velazquez/)."]},
  {"h2": "Las versiones que la hicieron mundial", "bloques": [
   {"lista": ["Andy Russell la llevó al lugar 8 de Billboard en Estados Unidos, en 1944.", "Lucho Gatica y Pedro Infante grabaron dos de las versiones más conocidas en español.",
              "Ray Conniff la hizo instrumental en 1960.", "The Beatles la grabaron en 1962. Salió hasta 1995, en Anthology 1."]},
   "También sale en la película de Disney Los tres caballeros, de 1944."]}],
 [{"q": "¿Quién escribió Bésame mucho?", "a": "La compositora mexicana Consuelo Velázquez, hacia 1932."},
  {"q": "¿Cuál es la canción más grabada en español?", "a": "Bésame mucho. Se le reconoció así en 1999."}],
 [WP("Bésame mucho", "B%C3%A9same_mucho")],
 ["consuelo-velazquez", "sabor-a-mi", "historia-de-un-amor", "contigo-aprendi", "canciones-de-amor-en-espanol"],
 credito="Bolero de Consuelo Velázquez. Aquí no va la letra: es de su autora.")

artista("consuelo-velazquez", "consuelo velázquez", "Consuelo Velázquez",
 "Consuelo Velázquez: quién fue la autora de Bésame mucho",
 "Consuelo Velázquez, la pianista y compositora mexicana que escribió Bésame mucho de adolescente. Su vida, su canción más famosa y mi cover a guitarra.",
 "Consuelo Velázquez fue una pianista y compositora mexicana, nacida en 1916 y muerta en 2005. Escribió Bésame mucho hacia 1932, todavía adolescente. Esa canción es la más grabada en español.",
 "La pianista mexicana que escribió Bésame mucho.",
 ["Le decían Consuelito. Fue pianista y compositora de boleros.",
  "Su canción más famosa la escribió muy joven, hacia 1932. Se publicó en 1940 y la cantó primero Emilio Tuero."],
 [["[Bésame mucho](/besame-mucho/)", "1940", "La canción más grabada en español"]],
 [["Bésame mucho (publicada en 1940)", "Su obra más conocida, grabada en decenas de idiomas."]],
 ["Mi cover de Bésame mucho va a guitarra y voz. Cuando lo suba, aparece aquí y en la [página de la canción](/besame-mucho/)."],
 [{"q": "¿Quién fue Consuelo Velázquez?", "a": "Una pianista y compositora mexicana, autora de Bésame mucho."},
  {"q": "¿A qué edad escribió Bésame mucho?", "a": "Hacia los 16 años, alrededor de 1932."}],
 [WP("Bésame mucho", "B%C3%A9same_mucho")],
 ["besame-mucho", "sabor-a-mi", "historia-de-un-amor", "contigo-aprendi"])

cover("historia-de-un-amor", "historia de un amor", "Historia de un amor", "Carlos Eleta Almarán", ["Carlos Eleta Almarán"],
 "Historia de un amor: su historia real y mi cover",
 "Historia de un amor es un bolero panameño de Carlos Eleta Almarán, de 1955. Para quién la escribió, la película con Libertad Lamarque y mi cover. Léela.",
 "Historia de un amor es un bolero del panameño Carlos Eleta Almarán, de 1955. La escribió para su hermano Fernando, después de la muerte de su esposa. Es la canción de Panamá más grabada en el mundo.",
 "El bolero panameño que Carlos Eleta escribió para su hermano.",
 [["Autor", "Carlos Eleta Almarán (1918 a 2013)"], ["Año", "1955"], ["País", "Panamá"], ["Género", "Bolero"], ["En el cine", "Historia de un amor (1956), con Libertad Lamarque"]],
 [{"h2": "Para quién la escribió", "bloques": [
   "Carlos Eleta la escribió para su hermano Fernando. La esposa de Fernando, Mercedes, acababa de morir.",
   "Por eso es una canción de duelo, aunque muchos la canten como de amor perdido."]},
  {"h2": "Las versiones más famosas", "bloques": [
   {"lista": ["Libertad Lamarque, en 1955, y en la película de 1956.", "Los Panchos, Lucho Gatica y Pedro Infante.", "Marco Antonio Solís, Julio Iglesias y Luis Miguel.",
              "Dalida, en francés, y Nana Mouskouri, en inglés.", "Pérez Prado, en mambo."]}]}],
 [{"q": "¿Quién escribió Historia de un amor?", "a": "El panameño Carlos Eleta Almarán, en 1955."},
  {"q": "¿Para quién es Historia de un amor?", "a": "Para su hermano Fernando, tras la muerte de su esposa Mercedes."}],
 [WP("Historia de un amor", "Historia_de_un_amor")],
 ["besame-mucho", "sabor-a-mi", "amor-eterno", "contigo-aprendi", "canciones-tristes-para-llorar"],
 credito="Bolero de Carlos Eleta Almarán (1955). Aquí no va la letra: es de su autor.")

cover("contigo-aprendi", "contigo aprendi", "Contigo aprendí", "Armando Manzanero", ["Armando Manzanero"],
 "Contigo aprendí, de Armando Manzanero: historia y cover",
 "Contigo aprendí es de Armando Manzanero, el compositor yucateco de Somos novios y Esta tarde vi llover. Quién fue, sus canciones y mi cover a guitarra.",
 "Contigo aprendí es una de las canciones más conocidas de Armando Manzanero. Manzanero fue un compositor y cantante mexicano nacido en Mérida, Yucatán, en 1935. Murió en la Ciudad de México en 2020.",
 "Una de las canciones de Armando Manzanero que se conocen en todo el mundo.",
 [["Autor", "Armando Manzanero"], ["Nacimiento del autor", "7 de diciembre de 1935, Mérida, Yucatán"], ["Muerte del autor", "28 de diciembre de 2020, Ciudad de México"]],
 [{"h2": "Quién fue Armando Manzanero", "bloques": [
   "Fue compositor, pianista y cantante. Sus canciones las grabaron cantantes de todo el mundo.",
   "Wikipedia en español pone Contigo aprendí junto a sus otras canciones más conocidas fuera de México."]},
  {"h2": "Sus canciones más conocidas", "bloques": [{"lista": ["Contigo aprendí", "Somos novios", "Esta tarde vi llover", "Adoro"]}]},
  {"h2": "Mi versión", "bloques": ["Es una canción para dedicar, de esas que caben en una boda. Mira [canciones para boda](/canciones-para-boda/)."]}],
 [{"q": "¿Quién escribió Contigo aprendí?", "a": "Armando Manzanero, compositor mexicano de Mérida, Yucatán."}],
 [WP("Armando Manzanero", "Armando_Manzanero")],
 ["besame-mucho", "sabor-a-mi", "historia-de-un-amor", "canciones-para-boda", "canciones-de-amor-en-espanol"],
 credito="Canción de Armando Manzanero. Aquí no va la letra: es de su autor.")

cover("si-no-te-hubieras-ido", "si no te hubieras ido", "Si no te hubieras ido", "Marco Antonio Solís", ["Marco Antonio Solís"],
 "Si no te hubieras ido: quién la cantó primero y mi cover",
 "Si no te hubieras ido es de Marco Antonio Solís, pero la grabó primero Marisela en 1984. Su versión de 1999, la de Maná en vivo y mi cover a guitarra.",
 "Si no te hubieras ido es una canción de Marco Antonio Solís. La primera en grabarla fue Marisela, en 1984. Solís la grabó en 1999 y Maná la llevó al número uno en 2008.",
 "La canción de Marco Antonio Solís que grabó primero Marisela.",
 [["Autor", "Marco Antonio Solís"], ["Primera grabación", "Marisela, disco Sin él (1984)"], ["Versión de Solís", "Trozos de mi alma (1999), número 4 en Billboard"],
  ["Versión de Maná", "Arde el cielo (2008), número 1 en Billboard Hot Latin Songs"]],
 [{"h2": "La grabó primero Marisela", "bloques": [
   "Marco Antonio Solís coescribió y coprodujo el disco Sin él, de Marisela, en 1984. Ahí salió esta canción por primera vez.",
   "Quince años después la grabó él mismo para Trozos de mi alma. Su versión sonó en la película Y tu mamá también."]},
  {"h2": "Otras versiones", "bloques": [
   {"lista": ["Maná, en vivo, en 2008.", "David Bisbal y Juan Luis Guerra, en 2017.", "Bruno e Marrone, en portugués, en 2003.", "Yuridia, Reik y Chiquis Rivera, entre otros."]}]}],
 [{"q": "¿Quién escribió Si no te hubieras ido?", "a": "Marco Antonio Solís."},
  {"q": "¿Quién la cantó primero?", "a": "Marisela, en su disco Sin él, de 1984."}],
 [WP("Si no te hubieras ido", "Si_no_te_hubieras_ido")],
 ["historia-de-un-amor", "amor-eterno", "canciones-tristes-para-llorar", "canciones-de-desamor", "tu-falta-de-querer-mon-laferte"])

cover("hasta-la-raiz-natalia-lafourcade", "hasta la raiz", "Hasta la raíz", "Natalia Lafourcade", ["Natalia Lafourcade", "Leonel García"],
 "Hasta la raíz de Natalia Lafourcade: historia y mi cover",
 "Hasta la raíz la escribieron Natalia Lafourcade y Leonel García y salió en 2015. Su riff de huapango, sus premios, sus certificaciones y mi cover. Léela.",
 "Hasta la raíz es una canción de Natalia Lafourcade y Leonel García. Salió el 6 de enero de 2015 y dio nombre a su disco. Ganó el Latin Grammy a mejor canción alternativa.",
 "La canción de Natalia Lafourcade y Leonel García, con riff de huapango.",
 [["Autores", "Natalia Lafourcade y Leonel García"], ["Salida", "6 de enero de 2015, Sony Music"], ["Disco", "Hasta la raíz (2015)"], ["Premio", "Latin Grammy a mejor canción alternativa"],
  ["Certificación en México", "Cinco veces diamante más platino y oro (AMPROFON)"]],
 [{"h2": "Cómo se hizo", "bloques": [
   "La grabó en 2014 con Cachorro López como coproductor. Fue su primera canción inédita desde el disco Hu hu hu.",
   "El riff de guitarra es de huapango y lo toca Leonel García. Por eso suena tan mexicana aunque sea pop.",
   "El video se grabó en una sola toma continua y salió el 14 de abril de 2015."]},
  {"h2": "La más versionada de Natalia", "bloques": ["Wikipedia la cuenta como su canción con más versiones. La han grabado Susana Baca, Los Saviñón y Laura Pausini, entre otros.",
   "Mi versión va a guitarra y voz. Mira las demás de ella en [Natalia Lafourcade](/natalia-lafourcade/)."]}],
 [{"q": "¿Quién escribió Hasta la raíz?", "a": "Natalia Lafourcade y Leonel García."},
  {"q": "¿Qué premio ganó Hasta la raíz?", "a": "El Latin Grammy a mejor canción alternativa."}],
 [WP("Hasta la raíz (canción)", "Hasta_la_ra%C3%ADz_(canci%C3%B3n)")],
 ["natalia-lafourcade", "nunca-es-suficiente", "lo-que-construimos-natalia-lafourcade", "canciones-para-boda", "foranea"])

cover("nunca-es-suficiente", "nunca es suficiente", "Nunca es suficiente", "Natalia Lafourcade", ["Natalia Lafourcade", "Anthony López", "Daniela Azpiazu"],
 "Nunca es suficiente: de Natalia Lafourcade a la cumbia",
 "Nunca es suficiente es de Natalia Lafourcade y salió en 2015. Cómo llegó a la cumbia de Los Ángeles Azules, sus 2,000 millones de vistas y mi cover a guitarra.",
 "Nunca es suficiente es una canción de Natalia Lafourcade, de su disco Hasta la raíz de 2015. En 2018 salió en cumbia con Los Ángeles Azules. Ese video fue el primero mexicano en pasar los 2,000 millones de vistas en YouTube.",
 "La canción de Natalia que se volvió cumbia con Los Ángeles Azules.",
 [["Autores", "Natalia Lafourcade, Anthony López y Daniela Azpiazu"], ["Versión original", "Hasta la raíz (2015), segundo sencillo"], ["Versión en cumbia", "Los Ángeles Azules con Natalia, Esto sí es cumbia (2018)"],
  ["Certificación en México", "Diamante más platino (AMPROFON)"], ["Récord", "Primer video mexicano con 2,000 millones de vistas en YouTube"]],
 [{"h2": "Dos canciones en una", "bloques": [
   "La versión original es una balada del disco Hasta la raíz. Salió como segundo sencillo en 2015.",
   "La versión en cumbia se grabó en 2016 en Puerto Progreso, Yucatán, y salió el 20 de abril de 2018.",
   "Por eso unos la buscan como de Natalia y otros como de Los Ángeles Azules. Es la misma canción."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz, más cerca de la balada que de la cumbia.", "Mira otras de ella en [Natalia Lafourcade](/natalia-lafourcade/)."]}],
 [{"q": "¿Nunca es suficiente es de Natalia Lafourcade o de Los Ángeles Azules?", "a": "La escribió Natalia Lafourcade con Anthony López y Daniela Azpiazu. Los Ángeles Azules la grabaron en cumbia con ella en 2018."}],
 [WP("Nunca es suficiente", "Nunca_es_suficiente")],
 ["natalia-lafourcade", "hasta-la-raiz-natalia-lafourcade", "lo-que-construimos-natalia-lafourcade", "canciones-para-dedicar", "canciones-para-boda"])

cover("amarrame-mon-laferte", "amarrame mon laferte", "Amárrame", "Mon Laferte", ["Mon Laferte", "Anthony López"],
 "Amárrame de Mon Laferte y Juanes: historia y mi cover",
 "Amárrame, de Mon Laferte con Juanes, salió en 2017 y ganó el Latin Grammy a mejor canción alternativa. Su disco, su premio y mi cover a guitarra. Léela.",
 "Amárrame es una cumbia de Mon Laferte con Juanes que salió el 10 de febrero de 2017. Fue el primer sencillo del disco La trenza. Ganó el Latin Grammy a mejor canción alternativa.",
 "La cumbia de Mon Laferte con Juanes que ganó un Latin Grammy.",
 [["Artistas", "Mon Laferte con Juanes"], ["Autores", "Mon Laferte y Anthony López"], ["Salida", "10 de febrero de 2017"], ["Disco", "La trenza (2017), pista 5"],
  ["Premio", "Latin Grammy a mejor canción alternativa"], ["Certificación en México", "Diamante más doble platino y oro (AMPROFON)"]],
 [{"h2": "La canción", "bloques": ["Es una cumbia, con Juanes como invitado. Abrió el camino del disco La trenza, que salió el 28 de abril de 2017.",
   "Estuvo nominada a tres Latin Grammy, grabación del año, canción del año y canción alternativa. Ganó la última."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz.", "Mira las demás de ella en [Mon Laferte](/mon-laferte/)."]}],
 [{"q": "¿Quién canta Amárrame con Mon Laferte?", "a": "Juanes, el cantante colombiano."}, {"q": "¿De qué disco es Amárrame?", "a": "De La trenza, de 2017."}],
 [WP("Amárrame", "Am%C3%A1rrame")],
 ["mon-laferte", "tu-falta-de-querer-mon-laferte", "mi-buen-amor-mon-laferte", "si-tu-me-quisieras-mon-laferte", "canciones-para-karaoke-mujer"])

artista("la-quinta-estacion", "la quinta estacion", "La Quinta Estación",
 "La Quinta Estación: canciones, discos y covers a guitarra",
 "La Quinta Estación: el grupo de Madrid de Natalia Jiménez, sus discos de 2002 a 2009 y canciones como El sol no regresa y Me muero. Con mis covers.",
 "La Quinta Estación es un grupo de pop rock formado en Madrid en 2000. Su voz era Natalia Jiménez. Sus canciones más buscadas en México son El sol no regresa y Me muero.",
 "El grupo de Natalia Jiménez: sus discos y sus canciones.",
 ["La formaron en Madrid Natalia Jiménez, Ángel Reyero y Pablo Domínguez. Natalia cantaba y tocaba la armónica.",
  "Ganó un Latin Grammy en 2007 y un Grammy en 2010. Anunció su separación en febrero de 2010 y volvió a juntarse años después."],
 [["[El sol no regresa](/el-sol-no-regresa-la-quinta-estacion/)", "2004", "Sencillo de Flores de alquiler"], ["[Me muero](/me-muero-la-quinta-estacion/)", "2006", "Sencillo de El mundo se equivoca"],
  ["Tu peor error", "2006", "De El mundo se equivoca"]],
 [["Primera toma (2002)", "Su primer disco."], ["Flores de alquiler (2004)", "El de El sol no regresa."], ["Acústico (2005)", "En vivo."],
  ["El mundo se equivoca (2006)", "Latin Grammy a mejor álbum vocal pop de dúo o grupo."], ["Sin frenos (2009)", "Grammy a mejor álbum de pop latino."]],
 ["Uno de mis covers que más se escuchó en TikTok fue El sol no regresa. Cada canción tiene su página."],
 [{"q": "¿De dónde es La Quinta Estación?", "a": "De Madrid, España. Se formó en 2000."}, {"q": "¿Quién era la cantante de La Quinta Estación?", "a": "Natalia Jiménez."}],
 [WP("La Quinta Estación", "La_Quinta_Estaci%C3%B3n")],
 ["el-sol-no-regresa-la-quinta-estacion", "me-muero-la-quinta-estacion", "ha-ash", "canciones-para-karaoke-mujer", "canciones-de-desamor"])

cover("el-sol-no-regresa-la-quinta-estacion", "el sol no regresa la quinta estación", "El sol no regresa", "La Quinta Estación", [],
 "El sol no regresa, de La Quinta Estación: historia y cover",
 "El sol no regresa es de La Quinta Estación y salió en 2004 en Flores de alquiler. Quiénes eran, qué logró su disco y mi cover a guitarra y voz. Léela aquí.",
 "El sol no regresa es una canción de La Quinta Estación, el grupo madrileño de Natalia Jiménez. Salió como sencillo en 2004, del disco Flores de alquiler. Es de los covers míos que más se escucharon en TikTok.",
 "La canción de La Quinta Estación de 2004, con la voz de Natalia Jiménez.",
 [["Grupo", "La Quinta Estación"], ["Voz", "Natalia Jiménez"], ["Año", "2004"], ["Disco", "Flores de alquiler (2004)"]],
 [{"h2": "El grupo", "bloques": ["La Quinta Estación se formó en Madrid en 2000. Natalia Jiménez cantaba, Ángel Reyero tocaba la guitarra y Pablo Domínguez guitarra y bajo.",
   "Mira sus discos y premios en [La Quinta Estación](/la-quinta-estacion/)."]},
  {"h2": "Mi versión", "bloques": ["Mi cover de esta canción fue de los que más se escucharon en TikTok. La versión para el sitio va a guitarra y voz."]}],
 [{"q": "¿Quién canta El sol no regresa?", "a": "La Quinta Estación, con Natalia Jiménez en la voz."}, {"q": "¿De qué disco es?", "a": "De Flores de alquiler, de 2004."}],
 [WP("La Quinta Estación", "La_Quinta_Estaci%C3%B3n")],
 ["la-quinta-estacion", "me-muero-la-quinta-estacion", "canciones-de-desamor", "canciones-tristes-para-llorar", "canciones-para-karaoke-mujer"],
 credito="Canción de La Quinta Estación. Aquí no va la letra: es de sus autores.")
print("lote 3: covers")
