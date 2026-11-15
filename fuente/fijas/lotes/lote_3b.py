"""Lote 3, segunda parte: listas de canciones (título y artista, nunca letra), guitarra y carta a mano."""
from _comun import guarda

NOTA_LISTA = {"nota": "Sólo títulos y artistas. Las letras son de sus autores y no se copian aquí."}
def lista(slug, cabeza, title, desc, h1, resumen, resp, filas, extra, faq, hermanas, cab=("Canción", "Artista", "Para cuándo")):
    guarda({"slug": slug, "tipo": "lista", "coleccion": "canciones-para", "cabeza": cabeza, "title": title, "description": desc, "h1": h1, "resumen": resumen,
            "respuesta": resp, "secciones": [{"h2": "La lista", "bloques": [{"tabla": {"cab": list(cab), "filas": filas}}, NOTA_LISTA]}] + extra,
            "faq": faq, "hermanas": hermanas})

lista("canciones-tristes-para-llorar", "playlist spotify tristes", "Canciones tristes para llorar: playlist en español",
 "Canciones tristes para llorar en español, de boleros a Mon Laferte, con artista y de qué duelen. Para armar tu playlist en Spotify o escucharlas a guitarra.",
 "Canciones tristes para llorar", "Canciones tristes en español, con artista y de qué duele cada una.",
 "Una buena canción triste dice en voz alta lo que uno no puede. Aquí van las tristes en español que estoy grabando a guitarra y voz, con su artista. Cada una tiene su página con su historia.",
 [["[Tu falta de querer](/tu-falta-de-querer-mon-laferte/)", "Mon Laferte", "Una infidelidad que no se supera"], ["[Amor eterno](/amor-eterno/)", "Juan Gabriel", "Un duelo por una madre"],
  ["[Historia de un amor](/historia-de-un-amor/)", "Carlos Eleta Almarán", "Un amor que se fue para siempre"], ["[Si no te hubieras ido](/si-no-te-hubieras-ido/)", "Marco Antonio Solís", "Extrañar a quien se fue"],
  ["[Déjenme llorar](/dejenme-llorar-carla-morrison/)", "Carla Morrison", "Pedir permiso para estar triste"], ["[El sol no regresa](/el-sol-no-regresa-la-quinta-estacion/)", "La Quinta Estación", "Un desamor que oscurece todo"],
  ["[Por qué me haces llorar](/por-que-me-haces-llorar-juan-gabriel/)", "Juan Gabriel", "Un amor que lastima"], ["[La llorona](/la-llorona/)", "Tradicional de Tehuantepec", "Para llorar a lo mexicano"]],
 [{"h2": "Cómo armar tu playlist", "bloques": [{"pasos": ["Empieza con dos o tres canciones que te gusten de verdad.", "Agrega una que te haga llorar fuerte, para soltarlo.",
   "Cierra con una más calmada. Llorar también es para sentirse mejor después."]},
   "Si quieres escribir lo que sientes, una carta ayuda. Mira la [carta de despedida](/carta-de-despedida/)."]}],
 [{"q": "¿Cuál es la canción más triste en español?", "a": "Depende de qué duela. Para un duelo, Amor eterno. Para una infidelidad, Tu falta de querer."}],
 ["canciones-de-desamor", "carta-de-despedida", "tu-falta-de-querer-mon-laferte", "amor-eterno", "canciones-de-amor-en-espanol"])

lista("canciones-de-desamor", "canciones de desamor", "Canciones de desamor en español para soltar a alguien",
 "Canciones de desamor en español, de Mon Laferte a La Quinta Estación y Ha*Ash, con artista y momento. Las que estoy grabando a guitarra y voz, sin letra.",
 "Canciones de desamor", "Canciones de desamor en español, por etapa de la ruptura.",
 "Las canciones de desamor acompañan cada etapa de una ruptura. Aquí van por momento, de la tristeza al enojo y a soltar. Son las que estoy grabando a guitarra y voz.",
 [["[Tu falta de querer](/tu-falta-de-querer-mon-laferte/)", "Mon Laferte", "Cuando todavía duele"], ["[Me muero](/me-muero-la-quinta-estacion/)", "La Quinta Estación", "Cuando lo extrañas"],
  ["[Ex de verdad](/ex-de-verdad-ha-ash/)", "Ha*Ash", "Cuando ya decidiste soltar"], ["[Perdón, perdón](/perdon-perdon-ha-ash/)", "Ha*Ash", "Cuando te toca reconocer tu parte"],
  ["[Kilómetros](/kilometros-sin-bandera/)", "Sin Bandera", "Cuando la distancia rompió todo"], ["[Si tú me quisieras](/si-tu-me-quisieras-mon-laferte/)", "Mon Laferte", "Cuando no te quisieron igual"]],
 [{"h2": "Después de la canción", "bloques": ["A veces ayuda escribir lo que no dijiste. Una carta que no se manda también sirve. Mira la [carta de despedida](/carta-de-despedida/)."]}],
 [{"q": "¿Qué canción escucho después de una ruptura?", "a": "Una que diga lo que sientes hoy. Al principio, una triste. Después, una para soltar."}],
 ["canciones-tristes-para-llorar", "carta-de-despedida", "tu-falta-de-querer-mon-laferte", "la-quinta-estacion", "ha-ash"])

lista("canciones-de-amor-en-espanol", "musica romantica en español", "Música romántica en español: boleros y canciones de amor",
 "Música romántica en español, de los boleros de siempre a Natalia Lafourcade y Carla Morrison, con artista y para qué momento. Las que estoy grabando a guitarra.",
 "Música romántica en español", "Canciones de amor en español, de boleros a cantautoras de hoy.",
 "La música romántica en español va del bolero a las cantautoras de hoy. Aquí juntamos las dos épocas, con su artista y para qué momento va cada canción. Todas las estoy grabando a guitarra y voz.",
 [["[Bésame mucho](/besame-mucho/)", "Consuelo Velázquez", "El bolero más grabado del español"], ["[Sabor a mí](/sabor-a-mi/)", "Álvaro Carrillo", "Para una cena de dos"],
  ["[Contigo aprendí](/contigo-aprendi/)", "Armando Manzanero", "Para dedicar en una boda"], ["[Historia de un amor](/historia-de-un-amor/)", "Carlos Eleta Almarán", "Para los nostálgicos"],
  ["[Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/)", "Natalia Lafourcade", "Para un amor que se queda"], ["[Nunca es suficiente](/nunca-es-suficiente/)", "Natalia Lafourcade", "Para bailar despacio"],
  ["[Te regalo](/te-regalo-carla-morrison/)", "Carla Morrison", "Para una dedicatoria íntima"], ["[Eres para mí](/eres-para-mi-julieta-venegas/)", "Julieta Venegas", "Para una pareja alegre"]],
 [{"h2": "Baladas y boleros", "bloques": ["El bolero es la raíz de casi toda la balada romántica en español. Si te gustan los de siempre, mira también las [canciones románticas de los 80](/canciones-romanticas-de-los-80-en-espanol/)."]}],
 [{"q": "¿Cuál es la canción de amor más famosa en español?", "a": "Bésame mucho, de Consuelo Velázquez. En 1999 se reconoció como la más grabada del idioma."}],
 ["canciones-para-dedicar", "canciones-para-boda", "besame-mucho", "sabor-a-mi", "cartas-de-amor", "canciones-romanticas-de-los-80-en-espanol"])

lista("canciones-para-boda", "canciones para boda", "Canciones para boda en español, momento por momento",
 "Canciones para boda en español: para la entrada, el primer baile y la cena, con artista. Boleros y canciones de hoy que estoy grabando a guitarra y voz.",
 "Canciones para boda", "Canciones de boda en español por momento de la fiesta.",
 "Para una boda conviene escoger una canción por momento. Una para la entrada, otra para el primer baile y varias para la cena. Aquí van en español, con su artista.",
 [["[Contigo aprendí](/contigo-aprendi/)", "Armando Manzanero", "Entrada de la novia"], ["[Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/)", "Natalia Lafourcade", "Entrada o ceremonia civil"],
  ["[Nunca es suficiente](/nunca-es-suficiente/)", "Natalia Lafourcade", "Primer baile"], ["[Bésame mucho](/besame-mucho/)", "Consuelo Velázquez", "Primer baile clásico"],
  ["[Sabor a mí](/sabor-a-mi/)", "Álvaro Carrillo", "Cena"], ["[Eres para mí](/eres-para-mi-julieta-venegas/)", "Julieta Venegas", "Salida de los novios"]],
 [{"h2": "Cómo escogerlas", "bloques": [{"pasos": ["Haz una lista de los momentos de la boda.", "Escoge una canción por momento, con calma.", "Escucha la canción completa antes de decidir.",
   "Pásale la lista a quien toque o ponga la música, con el orden y los tiempos."]}]}],
 [{"q": "¿Qué canción va para el primer baile?", "a": "Una que los dos sientan suya. Entre las clásicas en español, Bésame mucho y Nunca es suficiente."}],
 ["canciones-de-amor-en-espanol", "contigo-aprendi", "nunca-es-suficiente", "carta-para-mi-novio", "carta-para-mi-novia"],
 cab=("Canción", "Artista", "Momento"))

lista("canciones-para-karaoke-mujer", "cancion para karaoke mujer", "Canciones para karaoke de mujer en español",
 "Canciones para karaoke de mujer en español, de Mon Laferte a La Quinta Estación y Ha*Ash, con artista y qué tan difícil es cada una. Escoge la tuya y canta.",
 "Canciones para karaoke de mujer", "Canciones de karaoke para voz de mujer, con su nivel.",
 "Para el karaoke conviene una canción que conozcas completa y que no suba demasiado. Aquí van canciones en español para voz de mujer, con su nivel. Son de las que estoy grabando a guitarra.",
 [["[Tu falta de querer](/tu-falta-de-querer-mon-laferte/)", "Mon Laferte", "Difícil, pide fuerza"], ["[Me muero](/me-muero-la-quinta-estacion/)", "La Quinta Estación", "Media"],
  ["[El sol no regresa](/el-sol-no-regresa-la-quinta-estacion/)", "La Quinta Estación", "Media"], ["[Ex de verdad](/ex-de-verdad-ha-ash/)", "Ha*Ash", "Fácil, ideal a dúo"],
  ["[Amárrame](/amarrame-mon-laferte/)", "Mon Laferte", "Fácil, para que bailen"], ["[Limón y sal](/limon-y-sal-julieta-venegas/)", "Julieta Venegas", "Fácil"],
  ["[La bikina](/la-bikina/)", "Rubén Fuentes", "Media, para el final"]],
 [{"h2": "Cómo no quedarte sin voz", "bloques": [{"lista": [["Calienta antes.", "Unos minutos de ejercicios bastan. Mira los de [vocalización](/vocalizacion/)."],
   ["Escoge tu tono.", "Si la máquina deja bajar el tono, bájalo uno o dos."], ["Toma agua al tiempo.", "Lo frío y el alcohol secan la garganta."]]}]}],
 [{"q": "¿Qué canción canto en el karaoke si no canto bien?", "a": "Una fácil y conocida, como Ex de verdad o Limón y sal. Que la gente la cante contigo."}],
 ["canciones-para-karaoke", "vocalizacion", "tu-falta-de-querer-mon-laferte", "la-quinta-estacion", "ha-ash"], cab=("Canción", "Artista", "Nivel"))

# Guitarra
C = lambda n, c, d, dedos: [n, c, d, dedos]
guarda({"slug": "acordes-de-guitarra-para-principiantes", "tipo": "guia", "coleccion": "guitarra", "cabeza": "acordes de guitarra para principiantes",
 "title": "Acordes de guitarra para principiantes: los 15 básicos",
 "description": "Acordes de guitarra para principiantes: tabla con los 15 básicos, qué cuerda pisar en qué traste, el orden para aprenderlos y cómo cambiar sin parar.",
 "h1": "Acordes de guitarra para principiantes", "resumen": "Los 15 acordes básicos de la guitarra y en qué orden aprenderlos.",
 "respuesta": "Para empezar en la guitarra bastan unos pocos acordes abiertos. Con Sol, Re, Mi menor y Do ya se tocan muchísimas canciones. Abajo están los 15 básicos con el traste de cada cuerda.",
 "revisada": "2026-11-15",
 "secciones": [
  {"h2": "Cómo leer la tabla", "bloques": ["Los seis números van de la sexta cuerda, la más gruesa, a la primera, la más delgada. Cada número es el traste que pisas.",
   "El 0 es cuerda al aire. La x es cuerda que no se toca. Por ejemplo, Do es x 3 2 0 1 0."]},
  {"h2": "Los 15 acordes básicos", "bloques": [{"tabla": {"cab": ["Acorde", "Cifrado", "Trastes de la 6ª a la 1ª", "Dificultad"], "filas": [
   C("Mi menor", "Em", "0 2 2 0 0 0", "Muy fácil"), C("La menor", "Am", "x 0 2 2 1 0", "Fácil"), C("Mi", "E", "0 2 2 1 0 0", "Fácil"), C("La", "A", "x 0 2 2 2 0", "Fácil"),
   C("Re", "D", "x x 0 2 3 2", "Fácil"), C("Re menor", "Dm", "x x 0 2 3 1", "Fácil"), C("Do", "C", "x 3 2 0 1 0", "Media"), C("Sol", "G", "3 2 0 0 0 3", "Media"),
   C("Mi séptima", "E7", "0 2 0 1 0 0", "Fácil"), C("La séptima", "A7", "x 0 2 0 2 0", "Fácil"), C("Re séptima", "D7", "x x 0 2 1 2", "Fácil"), C("Sol séptima", "G7", "3 2 0 0 0 1", "Media"),
   C("Do séptima", "C7", "x 3 2 3 1 0", "Media"), C("Si séptima", "B7", "x 2 1 2 0 2", "Media"), C("Fa", "F", "1 3 3 2 1 1", "Difícil, lleva cejilla")]}}]},
  {"h2": "En qué orden aprenderlos", "bloques": [{"pasos": ["Mi menor y La menor. Usan dos y tres dedos y suenan bonito desde el primer día.",
   "Mi y La. Son primos de los anteriores.", "Re y Do. Aquí los dedos empiezan a estirarse.", "Sol. Con Sol, Re, Mi menor y Do ya tocas cientos de canciones.",
   "Los séptimos, para canciones rancheras y boleros.", "Fa al final, cuando tengas fuerza para la cejilla."]}]},
  {"h2": "Cómo cambiar de acorde sin parar", "bloques": [{"lista": [["Practica de dos en dos.", "Mi menor a Do, Do a Sol, Sol a Re. Un minuto cada par."],
   ["Mueve todos los dedos juntos.", "No pongas un dedo a la vez. Piensa en la forma completa."], ["Rasguea aunque no salga perfecto.", "El ritmo importa más que un acorde limpio al principio."]]},
   "Antes de tocar, afina con el [afinador de guitarra](/afinador-de-guitarra/). Una guitarra desafinada hace que todo suene mal."]}],
 "faq": [{"q": "¿Cuál es el acorde más fácil de la guitarra?", "a": "Mi menor. Se pisa con dos dedos en el traste 2."},
         {"q": "¿Cuántos acordes necesito para tocar canciones?", "a": "Con cuatro, Sol, Re, Mi menor y Do, ya tocas muchísimas canciones."}],
 "fuentes": [{"t": "Guitar chord, Wikipedia en inglés", "url": "https://en.wikipedia.org/wiki/Guitar_chord"}],
 "hermanas": ["como-tocar-guitarra", "canciones-faciles-en-guitarra", "afinador-de-guitarra", "acordes-de-ukulele", "como-afinar-una-guitarra"]})

guarda({"slug": "como-tocar-guitarra", "tipo": "guia", "coleccion": "guitarra", "cabeza": "como tocar guitarra",
 "title": "Cómo tocar guitarra desde cero: plan de 4 semanas",
 "description": "Cómo tocar guitarra desde cero: qué guitarra usar, cómo afinarla, los primeros acordes y un plan de cuatro semanas con 15 minutos al día. Empieza hoy.",
 "h1": "Cómo tocar guitarra", "resumen": "Un plan de cuatro semanas para aprender guitarra desde cero.",
 "respuesta": "Para aprender guitarra desde cero, practica 15 minutos al día y empieza por afinar y cuatro acordes. En cuatro semanas puedes acompañar tu primera canción. Abajo está el plan, semana por semana.",
 "secciones": [
  {"h2": "Lo que necesitas", "bloques": [{"lista": [["Una guitarra acústica o clásica.", "La clásica tiene cuerdas de nailon, más suaves para los dedos."],
   ["Un afinador.", "El [afinador de guitarra](/afinador-de-guitarra/) de este sitio usa el micrófono del celular."], ["Una púa, si quieres.", "También puedes rasguear con los dedos."]]}]},
  {"h2": "Plan de cuatro semanas", "bloques": [{"tabla": {"cab": ["Semana", "Qué practicar", "Meta"], "filas": [
   ["1", "Afinar, postura y los acordes Mi menor y La menor", "Cambiar entre los dos sin mirar"], ["2", "Re y Do, y un rasgueo abajo, abajo, arriba", "Cuatro acordes con ritmo"],
   ["3", "Sol y cambios de dos en dos", "Sol, Re, Mi menor, Do sin parar"], ["4", "Tu primera canción completa", "Tocarla de inicio a fin"]]}},
   "Los dedos duelen la primera semana. Es normal y se pasa cuando se forma el callo."]},
  {"h2": "Postura", "bloques": [{"pasos": ["Siéntate derecho y apoya la guitarra en la pierna.", "El pulgar de la mano izquierda va detrás del mástil, no encima.",
   "Pisa la cuerda cerca del traste, con la punta del dedo.", "Rasguea sobre la boca de la guitarra, con la muñeca suelta."]}]},
  {"h2": "Cómo aprendí yo", "bloques": ["La guitarra me acompaña desde niña. Mis momentos favoritos son sola con ella, improvisando y dejando salir lo que siento.",
   "Puedes verme así en mi video [Improvisando](/videos/), intentando componer una canción antes de dormir."]}],
 "faq": [{"q": "¿Cuánto tiempo tarda en aprender guitarra?", "a": "Con 15 minutos al día, en unas cuatro semanas acompañas tu primera canción sencilla."},
         {"q": "¿Puedo aprender solo?", "a": "Sí. Con constancia, un afinador y canciones fáciles se avanza mucho."}],
 "hermanas": ["acordes-de-guitarra-para-principiantes", "canciones-faciles-en-guitarra", "afinador-de-guitarra", "como-afinar-una-guitarra", "acordes-de-ukulele"]})
print("lote 3b")
