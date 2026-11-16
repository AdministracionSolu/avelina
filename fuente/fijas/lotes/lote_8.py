"""Lote 8: Natalia Lafourcade, Kevin Kaarl, Silvana Estrada, Julieta Venegas, clásicos y Daniela Spalla (sin letra, espera video)."""
from _comun import cover, artista

WP = lambda t, u, l="es": {"t": f"{t}, Wikipedia en {'español' if l == 'es' else 'inglés'}", "url": f"https://{l}.wikipedia.org/wiki/" + u}
MIA = lambda a, l: {"h2": "Mi versión", "bloques": [f"Mi versión va a guitarra y voz. Mira el resto en [{a}](/{l}/)."]}
MIA2 = {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz, como todo lo mío."]}

# ---- Natalia Lafourcade
cover("lo-que-construimos-natalia-lafourcade", "lo que construimos", "Lo que construimos", "Natalia Lafourcade", ["Natalia Lafourcade"],
 "Lo que construimos de Natalia Lafourcade: historia y cover",
 "Lo que construimos, de Natalia Lafourcade: cuándo salió, de qué disco es y quién dirigió su video. La historia de la canción sin la letra y mi cover a guitarra.",
 "Lo que construimos es una canción de Natalia Lafourcade que salió como sencillo el 13 de septiembre de 2015. Es el tercer sencillo de su disco Hasta la raíz. Habla del final de una relación.",
 "El tercer sencillo de Hasta la raíz, sobre un amor que termina.",
 [["Autora", "Natalia Lafourcade"], ["Sencillo", "13 de septiembre de 2015"], ["Disco", "Hasta la raíz (2015)"], ["Lugar en el disco", "Tercer sencillo"],
  ["Video", "Dirigido por Alonso Ruizpalacios, el director de Güeros"]],
 [{"h2": "El disco", "bloques": ["Hasta la raíz salió el 17 de marzo de 2015. Antes salieron [Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/) y [Nunca es suficiente](/nunca-es-suficiente/).",
   {"lista": ["Latin Grammy a mejor álbum alternativo, 2015.", "Grammy a mejor álbum latino de rock, urbano o alternativo, 2016."]}]},
  MIA("Natalia Lafourcade", "natalia-lafourcade")],
 [{"q": "¿De qué disco es Lo que construimos?", "a": "De Hasta la raíz, de 2015. Fue su tercer sencillo."},
  {"q": "¿De qué trata Lo que construimos?", "a": "Del final de una relación y de lo que queda de ella."}],
 [WP("Hasta la raíz", "Hasta_la_Ra%C3%ADz", "en"), {"t": "Lo que construimos, Metalocus", "url": "https://www.metalocus.es/es/noticias/eco-del-amor-perdido-lo-que-construimos-por-natalia-lafourcade"}],
 ["natalia-lafourcade", "hasta-la-raiz-natalia-lafourcade", "nunca-es-suficiente", "canciones-de-desamor", "canciones-tristes-para-llorar"],
 credito="Canción de Natalia Lafourcade. Aquí no va la letra: es de su autora.")

cover("en-el-2000-natalia-lafourcade", "natalia lafourcade en el 2000", "En el 2000", "Natalia Lafourcade", ["Natalia Lafourcade"],
 "En el 2000 de Natalia Lafourcade: historia y mi cover",
 "En el 2000, de Natalia Lafourcade: el sencillo de su primer disco, de 2002, quién lo produjo y cuántos premios buscó. Su historia sin la letra y mi cover.",
 "En el 2000 es una canción de Natalia Lafourcade de 2002. Fue el segundo sencillo de su primer disco, que lleva su nombre. Con ese disco compitió por cuatro Latin Grammy en 2003.",
 "El sencillo del primer disco de Natalia Lafourcade.",
 [["Autora", "Natalia Lafourcade"], ["Año", "2002"], ["Disco", "Natalia Lafourcade (2002)"], ["Lugar en el disco", "Segundo sencillo"],
  ["Producción del disco", "Áureo Baqueiro y Loris Ceroni"]],
 [{"h2": "El disco", "bloques": ["Su primer disco salió el 8 de julio de 2002. Llegó al número uno de discos en México y fue platino y oro.",
   "En 2003 compitió por cuatro Latin Grammy, uno de ellos a mejor nuevo artista."]},
  MIA("Natalia Lafourcade", "natalia-lafourcade")],
 [{"q": "¿De qué disco es En el 2000?", "a": "Del primer disco de Natalia Lafourcade, de 2002, que lleva su nombre."}],
 [WP("Natalia Lafourcade (álbum)", "Natalia_Lafourcade_(%C3%A1lbum)")],
 ["natalia-lafourcade", "lo-que-construimos-natalia-lafourcade", "nunca-es-suficiente", "canciones-para-karaoke-mujer"],
 credito="Canción de Natalia Lafourcade. Aquí no va la letra: es de su autora.")

cover("amor-de-mis-amores", "amor de mis amores", "Amor, amor de mis amores", "Natalia Lafourcade", ["María Teresa Lara"],
 "Amor de mis amores: el bolero y la versión de Natalia",
 "Amor de mis amores: quién la escribió, cómo la grabaron Natalia Lafourcade y Devendra Banhart en su homenaje a Agustín Lara y mi cover a guitarra. Sin la letra.",
 "Amor, amor de mis amores es una canción del repertorio de Agustín Lara. En los créditos del disco de Natalia Lafourcade aparece a nombre de María Teresa Lara. Natalia la grabó en 2012 con Devendra Banhart.",
 "La canción del repertorio de Agustín Lara que Natalia cantó con Devendra Banhart.",
 [["Autora en créditos", "María Teresa Lara"], ["Versión más buscada", "Natalia Lafourcade con Devendra Banhart"], ["Disco", "Mujer divina, homenaje a Agustín Lara (2012)"],
  ["Lugar en el disco", "Canción 9"]],
 [{"h2": "El homenaje", "bloques": ["Mujer divina salió el 18 de septiembre de 2012. Es el disco de Natalia dedicado a las canciones de Agustín Lara.",
   {"lista": ["Ganó el Latin Grammy a mejor álbum alternativo en 2013.", "También ganó el de mejor video musical de larga duración.",
              "Sus sencillos fueron La fugitiva, Limosna, Mujer divina y Aventurera."]}]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Hay más boleros en [Sabor a mí](/sabor-a-mi/) y [Bésame mucho](/besame-mucho/)."]}],
 [{"q": "¿Quién canta Amor de mis amores con Natalia Lafourcade?", "a": "Devendra Banhart, en el disco Mujer divina, de 2012."},
  {"q": "¿Quién escribió Amor de mis amores?", "a": "Los créditos del disco de Natalia dicen María Teresa Lara. Es del repertorio de Agustín Lara."}],
 [WP("Mujer divina, homenaje a Agustín Lara", "Mujer_Divina_%E2%80%93_Homenaje_a_Agust%C3%ADn_Lara", "en")],
 ["natalia-lafourcade", "sabor-a-mi", "besame-mucho", "historia-de-un-amor", "canciones-de-amor-en-espanol"],
 credito="Canción del repertorio de Agustín Lara, a nombre de María Teresa Lara. Aquí no va la letra.")

# ---- Kevin Kaarl
KK = WP("Kevin Kaarl", "Kevin_Kaarl")
CKK = "Canción de Kevin Kaarl. Aquí no va la letra: es de su autor."
cover("san-lucas-kevin-kaarl", "san lucas kevin kaarl", "San Lucas", "Kevin Kaarl", ["Kevin Kaarl"],
 "San Lucas de Kevin Kaarl: historia y mi cover a guitarra",
 "San Lucas, de Kevin Kaarl: de qué disco es, cuándo salió y cómo llegó al número uno de YouTube en México. Su historia sin la letra y mi cover a guitarra.",
 "San Lucas es una canción de Kevin Kaarl, el cantautor de Meoqui, Chihuahua. Da nombre a su disco corto del 7 de noviembre de 2019. Llegó al número uno del top de canciones de YouTube en México.",
 "La canción de Kevin Kaarl que llegó al número uno de YouTube en México.",
 [["Autor", "Kevin Kaarl"], ["Disco", "San Lucas (EP, 7 de noviembre de 2019)"], ["Video", "2020"], ["Lugar en México", "Número 1 del top 100 de YouTube"]],
 [{"h2": "Quién la canta", "bloques": ["Kevin Kaarl nació el 15 de mayo de 2000 en Meoqui, Chihuahua. Su hermano gemelo, Bryan, toca la trompeta en sus conciertos.",
   "Su video con la letra en pantalla pasó de 30 millones de vistas."]},
  MIA("Kevin Kaarl", "kevin-kaarl")],
 [{"q": "¿De dónde es Kevin Kaarl?", "a": "De Meoqui, Chihuahua. Después se fue a estudiar a la ciudad de Chihuahua."},
  {"q": "¿De qué disco es San Lucas?", "a": "Del disco corto San Lucas, de 2019."}],
 [KK], ["kevin-kaarl", "colapso-kevin-kaarl", "ed-maverick", "musica-indie", "canciones-de-desamor"], credito=CKK)

cover("colapso-kevin-kaarl", "kevin kaarl colapso", "Colapso", "Kevin Kaarl", ["Kevin Kaarl"],
 "Colapso de Kevin Kaarl: historia y mi cover a guitarra",
 "Colapso, de Kevin Kaarl: de qué disco es, cuándo salió y cuántas vistas tiene su video. La historia de la canción sin la letra y mi cover a guitarra y voz.",
 "Colapso es una canción de Kevin Kaarl de 2019. Salió como sencillo de su primer disco, Hasta el fin del mundo. Su video con la letra en pantalla pasó de 116 millones de vistas.",
 "El sencillo de Hasta el fin del mundo, su primer disco.",
 [["Autor", "Kevin Kaarl"], ["Año", "2019"], ["Disco", "Hasta el fin del mundo (2019)"], ["Vistas del video con letra", "Más de 116 millones"]],
 [{"h2": "El disco", "bloques": ["Hasta el fin del mundo fue su primer disco. Ese mismo año sacó el disco corto [San Lucas](/san-lucas-kevin-kaarl/).",
   "Su música es de guitarra y voz, con folk."]},
  MIA("Kevin Kaarl", "kevin-kaarl")],
 [{"q": "¿De qué disco es Colapso?", "a": "De Hasta el fin del mundo, el primer disco de Kevin Kaarl, de 2019."}],
 [KK], ["kevin-kaarl", "san-lucas-kevin-kaarl", "ed-maverick", "musica-indie", "canciones-tristes-para-llorar"], credito=CKK)

# ---- Silvana Estrada
cover("como-un-pajaro-silvana-estrada", "como un pajaro silvana estrada", "Como un pájaro", "Silvana Estrada", ["Silvana Estrada"],
 "Como un pájaro de Silvana Estrada: historia y mi cover",
 "Como un pájaro, de Silvana Estrada: cuándo salió, cómo la escribió en la pandemia y de qué disco es. La historia de la canción sin la letra y mi cover.",
 "Como un pájaro es una canción de Silvana Estrada que salió el 28 de mayo de 2025. La escribió en la pandemia, en noches sin dormir. Fue el primer sencillo de su disco Vendrán suaves lluvias.",
 "La canción de Silvana Estrada sobre el silencio y la soledad.",
 [["Autora", "Silvana Estrada"], ["Sencillo", "28 de mayo de 2025"], ["Disco", "Vendrán suaves lluvias (2025)"], ["Lugar en el disco", "Primer sencillo"]],
 [{"h2": "Cómo nació", "bloques": ["Fue su primera canción nueva desde Qué problema, de 2023.",
   "Silvana contó cómo la hizo en el programa Song Exploder, en su episodio 309."]},
  MIA("Silvana Estrada", "silvana-estrada")],
 [{"q": "¿De qué disco es Como un pájaro?", "a": "De Vendrán suaves lluvias, el segundo disco de Silvana Estrada, de 2025."}],
 [{"t": "Como un pájaro, Rolling Stone en Español", "url": "https://es.rollingstone.com/?p=131415"},
  {"t": "Silvana Estrada, Song Exploder", "url": "https://songexploder.net/silvana-estrada"}, WP("Silvana Estrada", "Silvana_Estrada")],
 ["silvana-estrada", "natalia-lafourcade", "cantautores", "canciones-tristes-para-llorar"],
 credito="Canción de Silvana Estrada. Aquí no va la letra: es de su autora.")

# ---- Julieta Venegas
cover("eres-para-mi-julieta-venegas", "eres para mi julieta venegas", "Eres para mí", "Julieta Venegas", ["Julieta Venegas", "Ana Tijoux"],
 "Eres para mí de Julieta Venegas: historia y mi cover",
 "Eres para mí, de Julieta Venegas con Anita Tijoux: quién la escribió, cuándo salió y hasta dónde llegó en las listas. Su historia sin la letra y mi cover.",
 "Eres para mí es una canción de Julieta Venegas con la chilena Anita Tijoux. Salió como sencillo el 1 de enero de 2007 y es del disco Limón y sal. Llegó al número uno en México.",
 "La canción de Julieta Venegas con Anita Tijoux, número uno en México.",
 [["Autoras", "Julieta Venegas y Ana Tijoux"], ["Sencillo", "1 de enero de 2007"], ["Disco", "Limón y sal (2006)"], ["Producción", "Cachorro López y Julieta Venegas"],
  ["Listas", "Número 1 en México, 2 en España"]],
 [{"h2": "El disco", "bloques": ["Limón y sal salió el 30 de mayo de 2006 en México. Eres para mí fue su tercer sencillo, después de Me voy y [Limón y sal](/limon-y-sal-julieta-venegas/).",
   "También llegó al número uno de pop latino en la radio de Estados Unidos."]},
  MIA("Julieta Venegas", "julieta-venegas")],
 [{"q": "¿Con quién canta Julieta Venegas Eres para mí?", "a": "Con la cantante chilena Ana Tijoux, que también la escribió."}],
 [WP("Limón y sal", "Lim%C3%B3n_y_Sal", "en")],
 ["julieta-venegas", "limon-y-sal-julieta-venegas", "canciones-para-dedicar-a-mi-novio", "canciones-de-amor-en-espanol"],
 credito="Canción de Julieta Venegas y Ana Tijoux. Aquí no va la letra.")

# ---- Clásicos
cover("palabras-tristes-los-yonics", "palabras tristes los yonics", "Palabras tristes", "Los Yonic's", ["Xavier Santos"],
 "Palabras tristes de Los Yonic's: historia y mi cover",
 "Palabras tristes: quién la escribió en 1968, cuándo la hicieron famosa Los Yonic's y su versión con Mon Laferte. La historia sin la letra y mi cover.",
 "Palabras tristes es una canción de Xavier Santos, compuesta en 1968. Los Yonic's la grabaron en 1980 y la volvieron un éxito fuera de México. En 2016 Mon Laferte grabó una versión nueva con ellos.",
 "La balada de Xavier Santos que hicieron famosa Los Yonic's.",
 [["Autor", "Xavier Santos"], ["Compuesta", "1968"], ["Versión famosa", "Los Yonic's, 1980"], ["Versión nueva", "Mon Laferte con Los Yonic's Zamacona, 2016"]],
 [{"h2": "Con Mon Laferte", "bloques": ["En octubre de 2016 salió su versión con Mon Laferte, de tono melancólico y muy distinta de la original.",
   "Mira más de ella en [Mon Laferte](/mon-laferte/)."]}, MIA2],
 [{"q": "¿Quién escribió Palabras tristes?", "a": "Xavier Santos, en 1968."}, {"q": "¿Cuándo la grabaron Los Yonic's?", "a": "En 1980."}],
 [{"t": "Palabras tristes con Mon Laferte, LOS40 México", "url": "https://los40.com.mx/los40/2016/10/18/musicanueva/1476825292_072959.html"},
  {"t": "Las mejores canciones de Los Yonic's, UnoTV", "url": "https://www.unotv.com/entretenimiento/los-yonics-estas-son-sus-mejores-canciones/"}],
 ["canciones-tristes-para-llorar", "canciones-de-desamor", "mon-laferte", "canciones-romanticas-de-los-80-en-espanol"],
 credito="Canción de Xavier Santos. Aquí no va la letra.")

cover("por-que-me-haces-llorar-juan-gabriel", "por que me haces llorar juan gabriel", "¿Por qué me haces llorar?", "Juan Gabriel", ["Juan Gabriel"],
 "Por qué me haces llorar de Juan Gabriel: historia y cover",
 "¿Por qué me haces llorar?, de Juan Gabriel: de qué disco es, quién la escribió y quién la produjo. La historia de la canción sin la letra y mi cover a guitarra.",
 "¿Por qué me haces llorar? es una canción de Juan Gabriel, escrita por él. Viene en su disco Juan Gabriel, que salió el 4 de mayo de 2010. Es la canción 6 del disco.",
 "La canción ranchera de Juan Gabriel del disco de 2010.",
 [["Autor", "Juan Gabriel"], ["Disco", "Juan Gabriel (2010)"], ["Salida del disco", "4 de mayo de 2010"], ["Lugar en el disco", "Canción 6"], ["Producción", "Juan Gabriel"]],
 [{"h2": "El disco", "bloques": ["Todas las canciones del disco son suyas y él mismo lo produjo. Salió con Fonovisa.",
   "Del mismo autor es [Amor eterno](/amor-eterno/)."]}, MIA2],
 [{"q": "¿De qué disco es Por qué me haces llorar?", "a": "Del disco Juan Gabriel, de 2010."}],
 [WP("Juan Gabriel (álbum)", "Juan_Gabriel_(album)", "en")],
 ["amor-eterno", "canciones-tristes-para-llorar", "canciones-de-desamor", "si-no-te-hubieras-ido"], credito="Canción de Juan Gabriel. Aquí no va la letra.")

cover("tristes-recuerdos-antonio-aguilar", "tristes recuerdos antonio aguilar", "Tristes recuerdos", "Antonio Aguilar", ["Catarino Lara Benavides"],
 "Tristes recuerdos de Antonio Aguilar: historia y mi cover",
 "Tristes recuerdos, la canción que hizo famosa Antonio Aguilar: quién la escribió, de dónde era su autor y otras versiones. Sin la letra y con mi cover.",
 "Tristes recuerdos es una canción ranchera que hizo famosa Antonio Aguilar. La escribió Catarino Lara Benavides, de Juchipila, Zacatecas. La versión de Aguilar la llevó por toda América Latina.",
 "La ranchera de Catarino Lara Benavides que hizo famosa Antonio Aguilar.",
 [["Autor", "Catarino Lara Benavides"], ["Origen del autor", "Juchipila, Zacatecas"], ["Versión famosa", "Antonio Aguilar"], ["Otra versión", "Lucero"]],
 [{"h2": "No es Triste recuerdo", "bloques": ["Antonio Aguilar también tiene Triste recuerdo, en singular, y una película de 1991 con ese nombre. Son otra cosa."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Hay más rancheras en [Si no te hubieras ido](/si-no-te-hubieras-ido/) y [Amor eterno](/amor-eterno/)."]}],
 [{"q": "¿Quién escribió Tristes recuerdos?", "a": "Catarino Lara Benavides, de Juchipila, Zacatecas, según Mariachi Semblanza."}],
 [{"t": "Tristes recuerdos, Mariachi Semblanza", "url": "https://www.mariachi-semblanza.com/en/etiquetas/lucero-en"},
  {"t": "Triste recuerdo, AllMusic", "url": "https://www.allmusic.com/album/triste-recuerdo-mw0002633987"}],
 ["canciones-tristes-para-llorar", "amor-eterno", "si-no-te-hubieras-ido", "canciones-de-desamor"], credito="Canción de Catarino Lara Benavides. Aquí no va la letra.")

# ---- Daniela Spalla
artista("daniela-spalla", "daniela spalla", "Daniela Spalla",
 "Daniela Spalla: canciones, discos y mis covers a guitarra",
 "Daniela Spalla: la cantautora de Córdoba, Argentina, que vive en México desde 2013, sus discos y canciones como Te alejas más de mí. Con mis covers.",
 "Daniela Spalla es una cantautora de Córdoba, Argentina, que vive en la Ciudad de México desde 2013. Llegó a México invitada por Ximena Sariñana. Compitió por el Latin Grammy a mejor nuevo artista.",
 "La cantautora argentina que hizo su carrera en México.",
 ["Empezó a cantar y tocar guitarra en la escuela, en Córdoba. Su primer disco, Desvel, salió en 2005.",
  "En 2010 sacó el disco corto Magma, con Ximena Sariñana. Ximena la invitó a presentarlo en México.",
  "Con Ahora vienen por nosotros, de 2014, compitió por el Latin Grammy a mejor nuevo artista."],
 [["Folk japonés", "2014", "Sencillo de Ahora vienen por nosotros"], ["Te alejas más de mí", "2020", "Con Esteman"],
  ["Lejos de la ciudad", "2024", "Después la grabó con Camilo"]],
 [["Desvel (2005)", "Su primer disco."], ["Magma (2010)", "EP, con Ximena Sariñana."], ["Ahora vienen por nosotros (2014)", ""], ["Camas separadas (2018)", ""],
  ["Puro teatro (2020)", "Lo produjo Adán Jodorowsky."], ["Dara (2023)", ""], ["Spalla (2024)", "EP."], ["Amorío (2025)", "Con Esteman."]],
 ["Mis covers de ella van a guitarra y voz. Si te gusta su música, mira también [Ximena Sariñana](/ximena-sarinana/)."],
 [{"q": "¿De dónde es Daniela Spalla?", "a": "De Córdoba, Argentina. Vive en la Ciudad de México desde 2013."},
  {"q": "¿Quién llevó a Daniela Spalla a México?", "a": "Ximena Sariñana, que la invitó a presentar su disco Magma."}],
 [{"t": "Daniela Spalla, biografía en Qobuz", "url": "https://www.qobuz.com/us-en/interpreter/daniela-spalla/1889178"},
  {"t": "Daniela Spalla, La Tercera", "url": "https://www.latercera.com/culto/2022/01/11/la-cantante-argentina-daniela-spalla-debuta-con-show-estelar-en-chile-me-gustaria-juntarme-a-escribir-con-javiera-mena/"}],
 ["ximena-sarinana", "carla-morrison", "silvana-estrada", "cantautores", "canciones-de-desamor"])
print("lote 8")
