"""Lote 5: Ha*Ash, Sin Bandera, Jesse & Joy, Selena, Julieta Venegas y La Quinta Estación (sin letra, espera video)."""
from _comun import cover, artista

WP = lambda t, u: {"t": f"{t}, Wikipedia en español", "url": "https://es.wikipedia.org/wiki/" + u}
HA = WP("Ha*Ash", "Ha*Ash")

artista("ha-ash", "canciones de ha ash", "Ha*Ash",
 "Canciones de Ha*Ash: discos, éxitos y covers a guitarra",
 "Canciones de Ha*Ash: el dúo de Hanna y Ashley, de Lake Charles, sus discos de 2003 a 2024 y éxitos como Perdón, perdón y Lo aprendí de ti. Con mis covers.",
 "Ha*Ash es el dúo de las hermanas Hanna y Ashley Pérez, de Lake Charles, Luisiana. Se formó en 2002. Sus canciones más buscadas son Perdón, perdón, Lo aprendí de ti y Ex de verdad.",
 "El dúo de Hanna y Ashley: sus discos y sus canciones más buscadas.",
 ["Hanna nació el 25 de junio de 1985 y Ashley el 27 de enero de 1987. El dúo nació en Lake Charles, Luisiana.",
  "Su disco en vivo Primera fila, hecho realidad, de 2014, trajo varias de sus canciones más famosas."],
 [["Te dejo en libertad", "2011", "La más importante del disco A tiempo"], ["[Perdón, perdón](/perdon-perdon-ha-ash/)", "2014", "Primer sencillo de Primera fila"],
  ["[Lo aprendí de ti](/lo-aprendi-de-ti-ha-ash/)", "2015", "Segundo sencillo de Primera fila"], ["[Ex de verdad](/ex-de-verdad-ha-ash/)", "", "Versión a dúo con Axel"]],
 [["Ha*Ash (2003)", "Su debut."], ["Mundos opuestos (2005)", ""], ["Habitación doble (2008)", ""], ["A tiempo (2011)", ""], ["Primera fila, hecho realidad (2014)", "En vivo."],
  ["30 de febrero (2017)", ""], ["Haashtag (2022)", ""], ["Haashville (2024)", "Su disco más reciente al revisar esta página."]],
 ["Mis covers de ellas van a guitarra y voz."],
 [{"q": "¿De dónde son Ha*Ash?", "a": "De Lake Charles, Luisiana, Estados Unidos."}, {"q": "¿Cómo se llaman las de Ha*Ash?", "a": "Hanna Nicole Pérez y Ashley Grace Pérez."}],
 [HA], ["perdon-perdon-ha-ash", "lo-aprendi-de-ti-ha-ash", "ex-de-verdad-ha-ash", "la-quinta-estacion", "canciones-de-desamor"])

for slug, cab, can, ficha, txt, faq in [
 ("perdon-perdon-ha-ash", "ha * ash perdón perdón", "Perdón, perdón",
  [["Dúo", "Ha*Ash"], ["Salida", "22 de septiembre de 2014"], ["Disco", "Primera fila, hecho realidad (2014)"], ["Lugar en el disco", "Primer sencillo"]],
  ["Abrió la etapa de Primera fila, el disco en vivo que las llevó a otro nivel en México.", "Mi versión va a guitarra y voz."],
  {"q": "¿De qué disco es Perdón, perdón?", "a": "De Primera fila, hecho realidad, de 2014."}),
 ("lo-aprendi-de-ti-ha-ash", "ha * ash lo aprendí de ti", "Lo aprendí de ti",
  [["Dúo", "Ha*Ash"], ["Salida", "6 de marzo de 2015"], ["Disco", "Primera fila, hecho realidad (2014)"], ["Lugar en el disco", "Segundo sencillo"]],
  ["Salió después de Perdón, perdón, del mismo disco en vivo.", "Mi versión va a guitarra y voz."],
  {"q": "¿De qué disco es Lo aprendí de ti?", "a": "De Primera fila, hecho realidad. Salió como sencillo el 6 de marzo de 2015."}),
 ("ex-de-verdad-ha-ash", "ex de verdad", "Ex de verdad",
  [["Dúo", "Ha*Ash"], ["Invitado", "Axel"], ["Origen", "Versión a dúo de su canción No te quiero nada"]],
  ["Ex de verdad es la versión a dúo con el cantante Axel de No te quiero nada, de Ha*Ash.", "Salió después del disco Primera fila, hecho realidad."],
  {"q": "¿Con quién canta Ha*Ash Ex de verdad?", "a": "Con el cantante Axel."})]:
    cover(slug, cab, can, "Ha*Ash", [], f"{can} de Ha*Ash: historia y mi cover",
          f"{can}, de Ha*Ash: cuándo salió, de qué disco es y su historia, sin la letra. Con mi cover a guitarra y voz y más canciones del dúo Ha*Ash.",
          f"{can} es una canción del dúo Ha*Ash, de las hermanas Hanna y Ashley Pérez. {txt[0]} Aquí está su historia y mi versión a guitarra.",
          f"La canción de Ha*Ash, su disco y su historia.", ficha,
          [{"h2": "La canción", "bloques": txt[1:] + ["Mira el resto en [Ha*Ash](/ha-ash/)."]}], [faq], [HA],
          ["ha-ash", "perdon-perdon-ha-ash" if slug != "perdon-perdon-ha-ash" else "lo-aprendi-de-ti-ha-ash", "canciones-de-desamor", "canciones-para-karaoke-mujer", "la-quinta-estacion"],
          credito="Canción de Ha*Ash. Aquí no va la letra: es de sus autores.")

SB = WP("Sin Bandera", "Sin_Bandera")
artista("sin-bandera", "canciones de sin bandera", "Sin Bandera",
 "Canciones de Sin Bandera: discos, éxitos y covers",
 "Canciones de Sin Bandera: el dúo de Noel Schajris y Leonel García, sus discos de 2001 a 2026 y éxitos como Entra en mi vida y Kilómetros. Con mis covers.",
 "Sin Bandera es el dúo del argentino Noel Schajris y el mexicano Leonel García, formado en la Ciudad de México en 2000. Su primer sencillo fue Entra en mi vida, en 2001. Ganaron dos Latin Grammy a mejor álbum de dúo o grupo vocal.",
 "El dúo de Noel Schajris y Leonel García: discos y éxitos.",
 ["Se separaron en 2007 y volvieron en noviembre de 2015, con gira y disco nuevo.",
  "Leonel García también escribió con Natalia Lafourcade [Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/)."],
 [["Entra en mi vida", "2001", "Primer sencillo"], ["[Kilómetros](/kilometros-sin-bandera/)", "", "Segundo sencillo del primer disco"], ["Sirena", "", "Tercer sencillo del primer disco"],
  ["Amor real", "2003", "Tema de la telenovela del mismo nombre"], ["En ésta no", "2016", "Primer sencillo de su regreso"]],
 [["Sin Bandera (2001)", "Latin Grammy a mejor álbum de dúo o grupo vocal."], ["De viaje (2003)", "Otro Latin Grammy en la misma categoría."], ["Mañana (2005)", ""], ["Pasado (2006)", ""],
  ["Una última vez (2016)", "El de su regreso."], ["Frecuencia (2022)", ""], ["Escenas (2026)", "Su disco más reciente al revisar esta página."]],
 ["Sus baladas caben a guitarra y voz. Mis covers de ellos van a ir apareciendo aquí."],
 [{"q": "¿Quiénes son Sin Bandera?", "a": "Noel Schajris, de Argentina, y Leonel García, de México."}],
 [SB], ["kilometros-sin-bandera", "jesse-y-joy", "ha-ash", "canciones-de-amor-en-espanol", "hasta-la-raiz-natalia-lafourcade"])

cover("kilometros-sin-bandera", "sin bandera kilómetros", "Kilómetros", "Sin Bandera", [],
 "Kilómetros de Sin Bandera: historia y mi cover",
 "Kilómetros, de Sin Bandera: de qué disco es, quiénes son Noel Schajris y Leonel García y por qué se dedica a amores a distancia. Con mi cover a guitarra.",
 "Kilómetros es una balada de Sin Bandera, el dúo de Noel Schajris y Leonel García. Fue el segundo sencillo de su primer disco, Sin Bandera. Su título habla de distancia.",
 "La balada de Sin Bandera para amores a distancia.",
 [["Dúo", "Sin Bandera"], ["Disco", "Sin Bandera (2001)"], ["Lugar en el disco", "Segundo sencillo"]],
 [{"h2": "Para amores a distancia", "bloques": ["Mi versión va a guitarra y voz.",
   "Si estás lejos de alguien, también te puede servir una [carta de amor](/cartas-de-amor/)."]}],
 [{"q": "¿De qué disco es Kilómetros?", "a": "Del primer disco de Sin Bandera, de 2001."}], [SB],
 ["sin-bandera", "canciones-de-desamor", "cartas-de-amor", "canciones-de-amor-en-espanol"], credito="Canción de Sin Bandera. Aquí no va la letra.")

artista("jesse-y-joy", "canciones de jesse y joy", "Jesse & Joy",
 "Canciones de Jesse & Joy: discos, éxitos y covers",
 "Canciones de Jesse & Joy: los hermanos Huerta de la Ciudad de México, sus discos de 2006 a 2025 y éxitos como Espacio sideral, Llegaste tú y ¡Corre!. Covers.",
 "Jesse & Joy es el dúo de los hermanos Jesse y Joy Huerta, formado en la Ciudad de México en 2005. Debutaron en 2006 con Espacio sideral. Tienen un Grammy y seis Latin Grammy.",
 "El dúo de los hermanos Huerta: discos y éxitos.",
 ["Ganaron el Latin Grammy a mejor nuevo artista en 2007 y cuatro más en 2012.", "En 2017 ganaron el Grammy a mejor álbum de pop latino por Un besito más.",
  "Según Wikipedia en español, Jesse dejó el dúo en septiembre de 2026."],
 [["Espacio sideral", "2006", "Primer sencillo"], ["Llegaste tú", "2008", "Del EP Esto es lo que soy"], ["¡Corre!", "2011", "De ¿Con quién se queda el perro?"], ["Me voy", "2011", "Del mismo disco"]],
 [["Esta es mi vida (2006)", ""], ["Electricidad (2009)", ""], ["¿Con quién se queda el perro? (2011)", ""], ["Un besito más (2015)", "Grammy a mejor álbum de pop latino."],
  ["Aire (2020)", ""], ["Clichés (2022)", ""], ["Lo que nos faltó decir (2025)", "Su disco más reciente al revisar esta página."]],
 ["Mis covers de ellos van a ir apareciendo aquí."],
 [{"q": "¿Quiénes son Jesse & Joy?", "a": "Los hermanos Jesse y Joy Huerta, de la Ciudad de México."}],
 [WP("Jesse & Joy", "Jesse_%26_Joy")], ["sin-bandera", "ha-ash", "julieta-venegas", "canciones-de-desamor"])

cover("como-la-flor-selena", "como la flor", "Como la flor", "Selena", ["A. B. Quintanilla", "Pete Astudillo"],
 "Como la flor de Selena: su historia y mi cover",
 "Como la flor de Selena: quién la escribió, cómo nació en 20 minutos en un hotel de Texas y por qué cerró su último concierto. Con mi cover a guitarra. Léela.",
 "Como la flor es una cumbia tejana de Selena que salió como sencillo el 2 de octubre de 1992. La escribieron su hermano AB Quintanilla y Pete Astudillo. Fue la última canción de su último concierto, en 1995.",
 "La cumbia de Selena que cerró su último concierto.",
 [["Intérprete", "Selena"], ["Autores", "A. B. Quintanilla y Pete Astudillo"], ["Salida", "2 de octubre de 1992"], ["Disco", "Entre a mi mundo, segundo sencillo"],
  ["Género", "Cumbia tejana, con toques de reggae y pop"], ["Certificación", "Nueve veces platino latino (RIAA)"]],
 [{"h2": "Cómo nació", "bloques": ["A. B. Quintanilla tuvo la idea en 1982, al ver a una familia vender flores de plástico iluminadas en Sacramento.",
   "La melodía salió en 1992 en un hotel de Bryan, Texas. La música se compuso en unos 20 minutos."]},
  {"h2": "Lo que logró", "bloques": [{"lista": ["Canción del año regional mexicano en Premios Lo Nuestro 1993.", "Lugar 6 en Hot Latin Songs de Billboard.",
   "Cerró su último concierto, en Bryan, Texas, el 19 de marzo de 1995.", "Jennifer Lopez la cantó en la película Selena, de 1997."]}]}],
 [{"q": "¿Quién escribió Como la flor?", "a": "A. B. Quintanilla y Pete Astudillo."}, {"q": "¿Cuándo salió Como la flor?", "a": "El 2 de octubre de 1992."}],
 [WP("Como la flor", "Como_la_flor")], ["canciones-tristes-para-llorar", "canciones-de-desamor", "canciones-para-karaoke-mujer", "la-bikina"],
 credito="Canción de A. B. Quintanilla y Pete Astudillo. Aquí no va la letra.")

cover("limon-y-sal-julieta-venegas", "julieta venegas limon y sal", "Limón y sal", "Julieta Venegas", ["Julieta Venegas", "Jorge Villamizar"],
 "Limón y sal de Julieta Venegas: historia y mi cover",
 "Limón y sal de Julieta Venegas, escrita con Jorge Villamizar de Bacilos: cuándo salió, su número uno en Billboard y su video con un hombre lobo. Mi cover.",
 "Limón y sal es una canción de Julieta Venegas que escribió con Jorge Villamizar, de Bacilos. Salió el 30 de agosto de 2006 como segundo sencillo del disco del mismo nombre. Llegó al número uno de Latin Pop Songs de Billboard.",
 "La canción de Julieta Venegas con Jorge Villamizar, número uno en Billboard.",
 [["Autores", "Julieta Venegas y Jorge Villamizar"], ["Producción", "Cachorro López y Julieta Venegas"], ["Salida", "30 de agosto de 2006"], ["Disco", "Limón y sal (2006)"],
  ["Lugar en Billboard", "Número 1 en Latin Pop Songs"]],
 [{"h2": "El video", "bloques": ["Lo dirigió Picky Tallarico, el mismo de Me voy. Julieta es un personaje de cuento que se casa con un hombre lobo.",
   "En 2008 la grabó otra vez en su MTV Unplugged."]},
  {"h2": "Mi versión", "bloques": ["Mi versión va a guitarra y voz. Mira otras fáciles de cantar en [canciones para karaoke de mujer](/canciones-para-karaoke-mujer/)."]}],
 [{"q": "¿Quién escribió Limón y sal?", "a": "Julieta Venegas y Jorge Villamizar, de Bacilos."}],
 [WP("Limón y sal (canción)", "Lim%C3%B3n_y_sal_(canci%C3%B3n)")], ["julieta-venegas", "eres-para-mi-julieta-venegas", "canciones-para-karaoke-mujer", "canciones-de-amor-en-espanol"])

cover("me-muero-la-quinta-estacion", "me muero la quinta estacion", "Me muero", "La Quinta Estación", [],
 "Me muero de La Quinta Estación: historia y mi cover",
 "Me muero, de La Quinta Estación: de qué disco es, el Latin Grammy de El mundo se equivoca y quién es Natalia Jiménez. Con mi cover a guitarra y voz. Léela.",
 "Me muero es una canción de La Quinta Estación que salió como sencillo en 2006. Es del disco El mundo se equivoca, que ganó el Latin Grammy en 2007. La canta Natalia Jiménez.",
 "La canción de La Quinta Estación de 2006.",
 [["Grupo", "La Quinta Estación"], ["Voz", "Natalia Jiménez"], ["Año", "2006"], ["Disco", "El mundo se equivoca (2006)"],
  ["Premio del disco", "Latin Grammy a mejor álbum vocal pop de dúo o grupo (2007)"]],
 [{"h2": "El disco", "bloques": ["El mundo se equivoca también trae Tu peor error. Ganó el Latin Grammy a mejor álbum vocal pop de dúo o grupo en 2007.",
   "Mira el resto en [La Quinta Estación](/la-quinta-estacion/)."]}],
 [{"q": "¿De qué disco es Me muero?", "a": "De El mundo se equivoca, de 2006."}], [WP("La Quinta Estación", "La_Quinta_Estaci%C3%B3n")],
 ["la-quinta-estacion", "el-sol-no-regresa-la-quinta-estacion", "canciones-de-desamor", "canciones-para-karaoke-mujer"], credito="Canción de La Quinta Estación. Aquí no va la letra.")
print("lote 5")
