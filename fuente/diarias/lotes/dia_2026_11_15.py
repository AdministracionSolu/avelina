#!/usr/bin/env python3
"""Primeras 10 diarias de Avelina (15-nov-2026), para probar COMO.md. Escribe fuente/diarias/paginas/<slug>.json."""
import json, os
AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = "2026-11-15"
W = lambda t, u: {"t": t, "url": u}
D = []

D.append(dict(slug="canciones-faciles-para-cantar", cola="canciones-faciles-para-cantar", busqueda="canciones fáciles para cantar",
 variantes=["canciones fáciles para karaoke", "canciones bonitas para cantar", "música para cantar karaoke"],
 title="Canciones fáciles para cantar en karaoke o con amigos",
 description="Siete canciones fáciles para cantar en español, en karaoke o con amigos: pocas notas altas y coros que todos se saben. Con su artista y por qué funcionan.",
 h1="Canciones fáciles para cantar", resumen="Siete en español con pocas notas altas y coros que todos se saben.",
 respuesta="Una canción es fácil de cantar cuando tiene pocas notas altas, un ritmo tranquilo y un coro que ya te sabes. Aquí van siete en español que cumplen con eso, con su artista y por qué funcionan.",
 secciones=[
  {"h2": "Siete que salen bien aunque nunca hayas cantado", "bloques": [{"tabla": {"cab": ["Canción", "Artista", "Por qué es fácil"], "filas": [
   ["[Cielito lindo](/cielito-lindo/)", "Quirino Mendoza y Cortés, 1882", "El coro lo canta todo el salón contigo"],
   ["[Como la flor](/como-la-flor-selena/)", "Selena, 1992", "Ritmo de cumbia y notas cómodas"],
   ["[Limón y sal](/limon-y-sal-julieta-venegas/)", "Julieta Venegas, 2006", "Una melodía corta que se repite"],
   ["[Ex de verdad](/ex-de-verdad-ha-ash/)", "Ha*Ash con Axel", "Es a dúo y cada quien canta su parte"],
   ["[Amárrame](/amarrame-mon-laferte/)", "Mon Laferte con Juanes, 2017", "Cumbia lenta para cantar a dos voces"],
   ["[Eres para mí](/eres-para-mi-julieta-venegas/)", "Julieta Venegas con Anita Tijoux, 2007", "Las estrofas son casi habladas"],
   ["[Nunca es suficiente](/nunca-es-suficiente/)", "Natalia Lafourcade, 2015", "En cumbia, con Los Ángeles Azules, se canta suave"]]}}]},
  {"h2": "Cómo escoger la tuya", "bloques": [{"lista": [
   "Tararéala completa sin música. Si llegas al final sin forzar la garganta, es tu canción.",
   "Si el coro te queda alto, busca la pista en un tono más bajo.",
   "Escoge una que se sepa la mesa. El coro de los demás te sostiene.",
   "Calienta la voz cinco minutos antes con los [ejercicios de vocalización](/vocalizacion/)."]},
   "Si tocas guitarra, hay [canciones fáciles en guitarra](/canciones-faciles-en-guitarra/) para acompañarte mientras cantas. Y si ya te animaste con todo, la lista completa está en [canciones para karaoke](/canciones-para-karaoke/)."]}],
 ligas=["canciones-para-karaoke", "vocalizacion", "canciones-faciles-en-guitarra"],
 fuentes=[W("Cielito lindo, Wikipedia en español", "https://es.wikipedia.org/wiki/Cielito_lindo"), W("Como la flor, Wikipedia en español", "https://es.wikipedia.org/wiki/Como_la_flor"),
          W("Limón y sal (canción), Wikipedia en español", "https://es.wikipedia.org/wiki/Lim%C3%B3n_y_sal_(canci%C3%B3n)"), W("Amárrame, Wikipedia en español", "https://es.wikipedia.org/wiki/Am%C3%A1rrame"),
          W("Nunca es suficiente, Wikipedia en español", "https://es.wikipedia.org/wiki/Nunca_es_suficiente")]))

D.append(dict(slug="aprender-a-cantar-desde-cero", cola="aprender-a-cantar-desde-cero", busqueda="aprender a cantar desde cero",
 variantes=["aprender a cantar", "cómo cantar bien", "cómo cantar mejor"],
 title="Aprender a cantar desde cero: por dónde empezar",
 description="Cómo aprender a cantar desde cero: un plan de cuatro semanas para calentar la voz, respirar, grabarte y escoger canciones, y cómo cuidar tu voz mientras.",
 h1="Aprender a cantar desde cero", resumen="Un plan de cuatro semanas y cómo cuidar la voz mientras aprendes.",
 respuesta="Para aprender a cantar desde cero empieza por calentar la voz, respirar desde abajo y cantar canciones de pocas notas. Grábate con el celular y escúchate al día siguiente. Practica poco y seguido, y para si te duele o te raspa.",
 secciones=[
  {"h2": "Un plan de cuatro semanas", "bloques": [{"pasos": [
   "**Semana 1.** Calienta diez minutos al día con los [ejercicios de vocalización](/vocalizacion/) y canta una sola canción fácil, siempre la misma.",
   "**Semana 2.** Respira con el abdomen. Pon una mano abajo de las costillas y siente cómo se infla al tomar aire. Canta frases largas sin subir los hombros.",
   "**Semana 3.** Grábate cantando esa canción y escúchate al día siguiente, con oídos frescos. Anota en qué parte se te va la nota.",
   "**Semana 4.** Pasa a una canción con un poco más de rango, de la lista de [canciones para karaoke](/canciones-para-karaoke/)."]},
   "Quince o veinte minutos diarios rinden más que dos horas el fin de semana. La voz se cansa como cualquier músculo."]},
  {"h2": "Cuida tu voz mientras aprendes", "bloques": [{"lista": [
   "Toma agua durante el día.", "Descansa bien. El cansancio del cuerpo se nota en la voz.",
   "No cantes cuando estés ronca o ronco, ni cuando estés enferma o enfermo.", "No fumes y aléjate del humo.",
   "Si la ronquera no se quita, ve con un médico o con un especialista en voz."]}]},
  {"h2": "Si quieres acompañarte con guitarra", "bloques": [
   "Yo canto lo que escribo, a guitarra y voz. Si quieres hacer lo mismo, empieza con [cómo tocar guitarra](/como-tocar-guitarra/) y afina siempre antes de cantar, porque una guitarra desafinada te jala la nota."]}],
 ligas=["vocalizacion", "canciones-para-karaoke", "como-tocar-guitarra"],
 fuentes=[W("Cuidando su voz, NIDCD (Institutos Nacionales de la Salud de EE. UU.)", "https://www.nidcd.nih.gov/es/espanol/cuidando-su-voz"),
          W("Cómo cuidar la voz, NIDCD", "https://www.nidcd.nih.gov/es/about/como-cuidar-la-voz-version-de-texto")]))

D.append(dict(slug="canciones-para-el-vals-de-boda", cola="canciones-para-el-vals-de-boda", busqueda="canciones para el vals de boda",
 variantes=["canciones para el vals", "vals para boda", "canciones de vals para boda"],
 title="Canciones para el vals de boda: clásicos y en español",
 description="Canciones para el vals de boda: Sobre las olas y El Danubio azul, los valses de siempre, y boleros en español para el primer baile. Con autor y año.",
 h1="Canciones para el vals de boda", resumen="Los valses de siempre y boleros en español para el primer baile.",
 respuesta="Para el vals de boda los clásicos son Sobre las olas, del mexicano Juventino Rosas, y El Danubio azul, de Johann Strauss hijo. Si prefieren una canción con voz para el primer baile, funcionan boleros como Bésame mucho o Sabor a mí.",
 secciones=[
  {"h2": "Los valses de siempre", "bloques": [{"tabla": {"cab": ["Pieza", "Autor", "Dato"], "filas": [
   ["Sobre las olas", "Juventino Rosas, mexicano", "La compuso hacia 1885 y se publicó en 1888"],
   ["El Danubio azul", "Johann Strauss hijo", "Se estrenó el 13 de febrero de 1867. En Hispanoamérica es muy usado en bodas y XV años"]]}}]},
  {"h2": "Con voz y en español, para el primer baile", "bloques": [{"tabla": {"cab": ["Canción", "Autor", "Dato"], "filas": [
   ["[Bésame mucho](/besame-mucho/)", "Consuelo Velázquez", "Se publicó en 1940"],
   ["[Sabor a mí](/sabor-a-mi/)", "Álvaro Carrillo", "Bolero de 1959"],
   ["[Historia de un amor](/historia-de-un-amor/)", "Carlos Eleta Almarán", "Bolero de 1955"],
   ["[Nunca es suficiente](/nunca-es-suficiente/)", "Natalia Lafourcade", "De 2015, para un primer baile más actual"]]}}]},
  {"h2": "Cómo armar el momento", "bloques": [{"lista": [
   "Corten la pieza a dos o tres minutos. Un vals completo se hace largo para los invitados.",
   "Ensayen la entrada y la vuelta final. Lo de en medio puede ser libre.",
   "Pásenle al DJ o al grupo el orden exacto: vals, baile con los papás y luego abrir pista."]},
   "Para la ceremonia y la cena, la lista completa está en [canciones para boda](/canciones-para-boda/)."]}],
 ligas=["canciones-para-boda", "besame-mucho", "sabor-a-mi"],
 fuentes=[W("Sobre las olas, Wikipedia en español", "https://es.wikipedia.org/wiki/Sobre_las_olas"), W("El Danubio azul, Wikipedia en español", "https://es.wikipedia.org/wiki/El_Danubio_azul"),
          W("Bésame mucho, Wikipedia en español", "https://es.wikipedia.org/wiki/B%C3%A9same_mucho"), W("Sabor a mí, Wikipedia en español", "https://es.wikipedia.org/wiki/Sabor_a_m%C3%AD"),
          W("Historia de un amor, Wikipedia en español", "https://es.wikipedia.org/wiki/Historia_de_un_amor")]))

D.append(dict(slug="que-es-un-cover", cola="que-es-un-cover", busqueda="qué es un cover en música",
 variantes=["cover significado en español", "covers en español", "cover música"],
 title="Qué es un cover en música y qué significa en español",
 description="Qué es un cover: otra persona canta o graba una canción que ya existe. De dónde viene la palabra, en qué se distingue de un arreglo y covers famosos en español.",
 h1="Qué es un cover", resumen="Qué significa, de dónde viene la palabra y ejemplos en español.",
 respuesta="Un cover es una nueva interpretación o grabación de una canción hecha por alguien distinto de quien la grabó primero. En español también se le dice versión. Yo subo covers a guitarra y voz a mi canal de YouTube, además de mis canciones.",
 secciones=[
  {"h2": "De dónde viene la palabra", "bloques": [
   "Cover empezó como jerga de las disqueras de Estados Unidos. Era la grabación rival de una canción que parecía éxito en otro sello.",
   "A mediados del siglo pasado cada disquera sacaba su propia versión de la canción del momento. Con los años el cover dejó de ser competencia y se volvió una forma de hacer tuya una canción."]},
  {"h2": "Original, cover y arreglo", "bloques": [{"lista": [
   ["Original:", "la primera grabación, casi siempre de quien la escribió o la estrenó."],
   ["Cover o versión:", "otra persona la canta o la graba con su estilo."],
   ["Arreglo:", "la misma canción con otros instrumentos o en otro ritmo. Pasó con [Nunca es suficiente](/nunca-es-suficiente/), que en 2018 salió en cumbia con Los Ángeles Azules."]]}]},
  {"h2": "Covers famosos en español", "bloques": [
   "Muchas canciones que hoy creemos de un artista son covers. [Sabor a mí](/sabor-a-mi/) la escribió Álvaro Carrillo en 1959 y Luis Miguel la grabó en 1997. [La bikina](/la-bikina/) es de Rubén Fuentes, de 1964, y Luis Miguel la grabó en vivo en Monterrey en 2000.",
   "[Bésame mucho](/besame-mucho/), de Consuelo Velázquez, se reconoció en 1999 como la canción más grabada en español."]}],
 ligas=["mon-laferte", "carla-morrison", "natalia-lafourcade"],
 fuentes=[W("Versión (música), Wikipedia en español", "https://es.wikipedia.org/wiki/Versi%C3%B3n_(m%C3%BAsica)"), W("Sabor a mí, Wikipedia en español", "https://es.wikipedia.org/wiki/Sabor_a_m%C3%AD"),
          W("La bikina, Wikipedia en español", "https://es.wikipedia.org/wiki/La_bikina"), W("Bésame mucho, Wikipedia en español", "https://es.wikipedia.org/wiki/B%C3%A9same_mucho"),
          W("Mi canal de YouTube", "https://www.youtube.com/@AvelinaMartinetMolina")]))

D.append(dict(slug="canciones-para-bailar-con-papa-en-la-boda", cola="canciones-para-bailar-con-papa-en-la-boda", busqueda="canciones para bailar con papá en la boda",
 variantes=["canción para bailar con papá en boda", "canciones para baile con papá en boda"],
 title="Canciones para bailar con papá en la boda, en español",
 description="Canciones para bailar con papá en la boda: Mi viejo de Piero y las que los papás escribieron a sus hijas, como Si tuviera que elegir. Con artista y consejos.",
 h1="Canciones para bailar con papá en la boda", resumen="Mi viejo y canciones que los papás escribieron para sus hijas.",
 respuesta="La canción en español más conocida para bailar con papá es Mi viejo, de Piero, de 1969. También funcionan las que un papá escribió para su hija, como Si tuviera que elegir de Ricardo Montaner. Escojan una que dure poco y que los dos conozcan.",
 secciones=[
  {"h2": "La lista", "bloques": [{"tabla": {"cab": ["Canción", "Artista", "Por qué"], "filas": [
   ["Mi viejo", "Piero", "De 1969, la canción de hijos a papá más conocida"],
   ["Si tuviera que elegir", "Ricardo Montaner", "La escribió para su hija Evaluna, de 2002"],
   ["Mi princesa", "David Bisbal", "Para su hija Ella"],
   ["Mi persona favorita", "Alejandro Sanz con Camila Cabello", "Para su hija Alma"],
   ["Ese que me dio la vida", "Alejandro Sanz", "De 1995, de hijo a papá"],
   ["Cuando yo quería ser grande", "Alejandro Fernández", "Con mariachi"]]}}]},
  {"h2": "Para que salga bonito", "bloques": [{"lista": [
   "Bailen dos minutos. Pidan que la canción baje despacio y que luego entre mamá o el resto de la familia.",
   "Si papá no baila, que sea un abrazo con una vuelta lenta. Nadie mira los pies.",
   "Díganle antes cuál es. A muchos papás les gana el llanto si los agarra de sorpresa."]},
   "Hay más en [canciones para papá](/canciones-para-papa/) y en [canciones para dedicar a mi hija](/canciones-para-dedicar-a-mi-hija/). Para el baile con mamá, mira [canciones para mamá](/canciones-para-mama/)."]}],
 ligas=["canciones-para-boda", "canciones-para-papa", "canciones-para-dedicar-a-mi-hija"],
 fuentes=[W("Canciones para el Día del Padre, El Imparcial", "https://www.elimparcial.com/espectaculos/2026/06/21/canciones-para-el-dia-del-padre-15-temas-para-dedicar-y-celebrar-a-papa-este-2026/"),
          W("Canciones del Día del Padre, Canal Trece", "https://canaltrece.com.co/noticias/canciones-del-dia-del-padre-letra/"),
          W("Artistas que escribieron canciones a sus hijos, Panamá América", "https://www.panamaamerica.com.pa/variedades/artistas-que-han-creado-canciones-con-letras-dedicadas-sus-hijos-1205555"),
          W("Canciones para el Día del Padre, Billboard", "https://www.billboard.com/lists/canciones-dia-del-padre-lista/alejandro-fernandez-cuando-yo-queria-ser-grande-2")]))

D.append(dict(slug="canciones-para-bailar-en-una-boda", cola="canciones-para-bailar-en-una-boda", busqueda="canciones para bailar en una boda",
 variantes=["canción para bailar en boda", "temazos para bodas"],
 title="Canciones para bailar en una boda: cumbias y clásicos",
 description="Canciones para bailar en una boda y abrir pista: cumbias que todos corean, pop en español y mariachi para el final. Con artista, año y cómo ordenar la noche.",
 h1="Canciones para bailar en una boda", resumen="Cumbias para abrir pista y cómo ordenar la noche.",
 respuesta="Para abrir pista en una boda funcionan las cumbias que todos corean, como Como la flor de Selena o Nunca es suficiente con Los Ángeles Azules. Después del vals, pon primero las que conocen todas las edades y deja las más nuevas para más noche.",
 secciones=[
  {"h2": "Para abrir pista", "bloques": [{"tabla": {"cab": ["Canción", "Artista", "Dato"], "filas": [
   ["[Como la flor](/como-la-flor-selena/)", "Selena", "Cumbia de 1992"],
   ["[Nunca es suficiente](/nunca-es-suficiente/)", "Natalia Lafourcade con Los Ángeles Azules", "Su versión en cumbia es de 2018"],
   ["[Amárrame](/amarrame-mon-laferte/)", "Mon Laferte con Juanes", "Cumbia de 2017"],
   ["[Limón y sal](/limon-y-sal-julieta-venegas/)", "Julieta Venegas", "De 2006, llegó al número uno de Latin Pop Songs de Billboard"],
   ["[Cielito lindo](/cielito-lindo/)", "Quirino Mendoza y Cortés", "Para el final, con todos cantando"],
   ["[La bikina](/la-bikina/)", "Rubén Fuentes", "Para la hora del mariachi"]]}}]},
  {"h2": "Cómo ordenar la noche", "bloques": [{"pasos": [
   "Vals y baile con los papás.", "Cumbias que conocen todas las edades, para llenar la pista.",
   "Pop en español para los amigos de los novios.", "Mariachi o canciones para corear al final."]},
   "Guarda dos o tres lentas para que descanse la pista. Las de cada momento de la ceremonia están en [canciones para boda](/canciones-para-boda/), y las que todos se saben, en [canciones para karaoke](/canciones-para-karaoke/)."]}],
 ligas=["canciones-para-boda", "canciones-para-karaoke", "como-la-flor-selena"],
 fuentes=[W("Como la flor, Wikipedia en español", "https://es.wikipedia.org/wiki/Como_la_flor"), W("Nunca es suficiente, Wikipedia en español", "https://es.wikipedia.org/wiki/Nunca_es_suficiente"),
          W("Amárrame, Wikipedia en español", "https://es.wikipedia.org/wiki/Am%C3%A1rrame"), W("Limón y sal (canción), Wikipedia en español", "https://es.wikipedia.org/wiki/Lim%C3%B3n_y_sal_(canci%C3%B3n)"),
          W("La bikina, Wikipedia en español", "https://es.wikipedia.org/wiki/La_bikina")]))

D.append(dict(slug="mon-laferte-vol-1", cola="mon-laferte-vol-1", busqueda="mon laferte vol. 1",
 variantes=["mon laferte vol 1", "vol 1 mon laferte"],
 title="Mon Laferte Vol. 1: canciones, año y certificaciones",
 description="Mon Laferte, Vol. 1: el disco de 2015 con Tu falta de querer, Amor completo, Tormento y Si tú me quisieras. Sus canciones, sencillos y certificaciones.",
 h1="Mon Laferte, Vol. 1", resumen="El disco de 2015 con Tu falta de querer: canciones, sencillos y certificaciones.",
 respuesta="Mon Laferte, Vol. 1 es el disco de 2015 que trae Tu falta de querer, Amor completo, Tormento y Si tú me quisieras. Lo produjo ella misma y lo publicó Universal Music México. En México tiene certificación de diamante más oro.",
 secciones=[
  {"h2": "Datos del disco", "bloques": [{"tabla": {"cab": ["Dato", "Mon Laferte, Vol. 1"], "filas": [
   ["Año", "2015 (Wikipedia da dos fechas: 31 de enero y 21 de agosto)"], ["Producción", "Mon Laferte"],
   ["Sello", "Universal Music México"], ["Duración", "41 minutos y 59 segundos"], ["Canciones", "12, contando Bonita como pista extra"],
   ["Certificación en México", "Diamante más oro (AMPROFON)"], ["Certificación en Chile", "Cuatro veces platino"]]}}]},
  {"h2": "Sus sencillos", "bloques": [{"tabla": {"cab": ["Sencillo", "Salió", "Certificación en México"], "filas": [
   ["Tormento", "3 de enero de 2015", "Oro"], ["Amor completo", "31 de julio de 2015", "Platino"],
   ["[Tu falta de querer](/tu-falta-de-querer-mon-laferte/)", "14 de octubre de 2015", "Diamante"],
   ["[Si tú me quisieras](/si-tu-me-quisieras-mon-laferte/)", "8 de mayo de 2016", "Platino"]]}}]},
  {"h2": "Las demás canciones", "bloques": [
   "El disco también trae El cristal, El diablo, La visita, Un alma en pena, Salvador, Malagradecido y una pieza corta de menos de un minuto. Si tú me quisieras se agregó cuando Universal lo reeditó.",
   "Para el resto de su carrera, sus discos y sus premios, mira la página de [Mon Laferte](/mon-laferte/)."]}],
 ligas=["mon-laferte", "tu-falta-de-querer-mon-laferte", "si-tu-me-quisieras-mon-laferte"],
 fuentes=[W("Mon Laferte, Vol. 1, Wikipedia en inglés", "https://en.wikipedia.org/wiki/Mon_Laferte,_Vol._1"), W("Mon Laferte, Wikipedia en español", "https://es.wikipedia.org/wiki/Mon_Laferte")]))

D.append(dict(slug="cancion-para-entrada-de-novios", cola="cancion-para-entrada-de-novios", busqueda="canción para la entrada de los novios",
 variantes=["canción para entrada de novios", "canciones para entradas de novios"],
 title="Canción para la entrada de novios: clásicas y en español",
 description="Canción para la entrada de los novios: el Coro nupcial de Wagner, el Canon de Pachelbel y la Marcha de Mendelssohn, más opciones en español. Con autor y año.",
 h1="Canción para la entrada de los novios", resumen="Las clásicas de entrada y salida, y opciones en español.",
 respuesta="Para la entrada de la novia las clásicas son el Coro nupcial de Wagner y el Canon de Pachelbel. Para la salida de los novios suena la Marcha nupcial de Mendelssohn. Si la quieren en español, Contigo aprendí o Hasta la raíz acompañan muy bien esa caminata.",
 secciones=[
  {"h2": "Las clásicas", "bloques": [{"tabla": {"cab": ["Pieza", "Autor", "Dato"], "filas": [
   ["Coro nupcial", "Richard Wagner", "De la ópera Lohengrin, de 1850. Suele sonar cuando entra la novia"],
   ["Canon en re", "Johann Pachelbel", "De alrededor de 1680, muy usado en bodas"],
   ["Marcha nupcial", "Felix Mendelssohn", "De 1842. Se volvió famosa en una boda real de 1858"]]}}]},
  {"h2": "En español", "bloques": [{"tabla": {"cab": ["Canción", "Artista", "Momento"], "filas": [
   ["[Contigo aprendí](/contigo-aprendi/)", "Armando Manzanero", "Entrada de la novia"],
   ["[Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/)", "Natalia Lafourcade", "Entrada o ceremonia civil"],
   ["[Eres para mí](/eres-para-mi-julieta-venegas/)", "Julieta Venegas", "Salida, ya casados"]]}}]},
  {"h2": "Para que la caminata cuadre", "bloques": [{"lista": [
   "Midan el pasillo. Casi siempre basta de un minuto a minuto y medio de canción.",
   "Pidan que empiece en la parte más bonita, no en la introducción.",
   "En ceremonias chicas o al aire libre, una versión a guitarra y voz se escucha clara sin bocinas grandes."]},
   "Para el vals, la cena y la fiesta, mira [canciones para boda](/canciones-para-boda/)."]}],
 ligas=["canciones-para-boda", "contigo-aprendi", "hasta-la-raiz-natalia-lafourcade"],
 fuentes=[W("Coro nupcial, Wikipedia en español", "https://es.wikipedia.org/wiki/Coro_nupcial"), W("Canon de Pachelbel, Wikipedia en español", "https://es.wikipedia.org/wiki/Canon_de_Pachelbel"),
          W("Marcha nupcial (Mendelssohn), Wikipedia en español", "https://es.wikipedia.org/wiki/Marcha_nupcial_(Mendelssohn)"), W("Armando Manzanero, Wikipedia en español", "https://es.wikipedia.org/wiki/Armando_Manzanero"),
          W("Hasta la raíz (canción), Wikipedia en español", "https://es.wikipedia.org/wiki/Hasta_la_ra%C3%ADz_(canci%C3%B3n)")]))

D.append(dict(slug="canciones-de-mon-laferte-para-dedicar", cola="canciones-de-mon-laferte-para-dedicar", busqueda="canciones de mon laferte para dedicar",
 variantes=["mon laferte canciones de amor"],
 title="Canciones de Mon Laferte para dedicar, según el tono",
 description="Canciones de Mon Laferte para dedicar: Amárrame para bailar, Mi buen amor a dúo con Bunbury y Tu falta de querer para una ruptura. Seis, con su año y su dato.",
 h1="Canciones de Mon Laferte para dedicar", resumen="Seis canciones suyas, según el tono de lo que quieres decir.",
 respuesta="Si vas a dedicar una canción de Mon Laferte, escoge por el tono. Amárrame es una cumbia para bailar, Mi buen amor es un dueto con Enrique Bunbury y Tu falta de querer es para cuando duele una ruptura. Abajo están seis, con su año.",
 secciones=[
  {"h2": "Seis para dedicar", "bloques": [{"tabla": {"cab": ["Canción", "Año", "Dato"], "filas": [
   ["[Amárrame](/amarrame-mon-laferte/)", "2017", "Cumbia con Juanes, ganó el Latin Grammy a mejor canción alternativa"],
   ["[Mi buen amor](/mi-buen-amor-mon-laferte/)", "2017", "A dúo con Enrique Bunbury, del disco La trenza"],
   ["[Antes de ti](/antes-de-ti-mon-laferte/)", "2018", "Compitió por canción del año en el Latin Grammy"],
   ["Amor completo", "2015", "Del disco Mon Laferte, Vol. 1, platino en México"],
   ["[Si tú me quisieras](/si-tu-me-quisieras-mon-laferte/)", "2015", "Del mismo disco, platino en México"],
   ["[Tu falta de querer](/tu-falta-de-querer-mon-laferte/)", "2015", "Ella contó que nació de una ruptura"]]}}]},
  {"h2": "Cómo dedicarla", "bloques": [{"lista": [
   "Manda la canción con una línea tuya, no sólo la liga.",
   "Antes de mandar una de desamor, piensa si de verdad quieres que la escuche esa persona.",
   "Si quieres escribir algo más largo, aquí hay [cartas de amor](/cartas-de-amor/) para tomar ideas."]},
   "Hay más de otros artistas en [canciones para dedicar](/canciones-para-dedicar/), y toda su historia en [Mon Laferte](/mon-laferte/)."]}],
 ligas=["mon-laferte", "canciones-para-dedicar", "cartas-de-amor"],
 fuentes=[W("Mon Laferte, Wikipedia en español", "https://es.wikipedia.org/wiki/Mon_Laferte"), W("Amárrame, Wikipedia en español", "https://es.wikipedia.org/wiki/Am%C3%A1rrame"),
          W("Mi buen amor, Wikipedia en español", "https://es.wikipedia.org/wiki/Mi_buen_amor"), W("Tu falta de querer, Wikipedia en español", "https://es.wikipedia.org/wiki/Tu_falta_de_querer"),
          W("Mon Laferte, Vol. 1, Wikipedia en inglés", "https://en.wikipedia.org/wiki/Mon_Laferte,_Vol._1")]))

D.append(dict(slug="de-todas-las-flores-natalia-lafourcade", cola="de-todas-las-flores-natalia-lafourcade", busqueda="de todas las flores natalia lafourcade",
 variantes=["de todas las flores"],
 title="De todas las flores de Natalia Lafourcade: el disco",
 description="De todas las flores, disco de Natalia Lafourcade de 2022: sus 12 canciones, quién lo produjo, sus cinco sencillos y los premios Grammy y Latin Grammy que ganó.",
 h1="De todas las flores", resumen="El disco de 2022: producción, sencillos y premios.",
 respuesta="De todas las flores es el disco de Natalia Lafourcade que salió el 28 de octubre de 2022. Son 12 canciones suyas, producidas por Adán Jodorowsky. Ganó el Latin Grammy a mejor álbum de cantautor en 2023 y el Grammy a mejor álbum latino de rock o alternativo en 2024.",
 secciones=[
  {"h2": "Datos del disco", "bloques": [{"tabla": {"cab": ["Dato", "De todas las flores"], "filas": [
   ["Salió", "28 de octubre de 2022"], ["Sello", "Sony Music México"], ["Producción", "Adán Jodorowsky"],
   ["Canciones", "12, todas suyas"], ["Grabación", "En cinta, en un pueblo de Texas cerca de El Paso"],
   ["Latin Grammy 2023", "Mejor álbum de cantautor"], ["Grammy 2024", "Mejor álbum latino de rock o alternativo"]]}}]},
  {"h2": "Sus sencillos", "bloques": [{"tabla": {"cab": ["Sencillo", "Salió"], "filas": [
   ["De todas las flores", "22 de septiembre de 2022"], ["Mi manera de querer", "26 de octubre de 2022"], ["Pasan los días", "30 de agosto de 2023"],
   ["María la Curandera", "8 de marzo de 2024"], ["Pajarito colibrí", "19 de abril de 2024"]]}}]},
  {"h2": "Por qué lo escucho", "bloques": [
   "Natalia Lafourcade es de las cantautoras que más me inspiran. Este es un disco de canciones propias, y eso es lo que yo busco: cantar lo que escribo.",
   "Sus canciones de antes, como [Hasta la raíz](/hasta-la-raiz-natalia-lafourcade/) y [Lo que construimos](/lo-que-construimos-natalia-lafourcade/), tienen su propia página, y toda su historia está en [Natalia Lafourcade](/natalia-lafourcade/)."]}],
 ligas=["natalia-lafourcade", "hasta-la-raiz-natalia-lafourcade", "lo-que-construimos-natalia-lafourcade"],
 fuentes=[W("De todas las flores, Wikipedia en español", "https://es.wikipedia.org/wiki/De_todas_las_flores"), W("De Todas las Flores, Wikipedia en inglés", "https://en.wikipedia.org/wiki/De_Todas_las_Flores"),
          W("Natalia Lafourcade, Wikipedia en español", "https://es.wikipedia.org/wiki/Natalia_Lafourcade")]))

for d in D:
    d = {"slug": d.pop("slug"), "estado": "publicada", "fecha": F, **d}
    json.dump(d, open(os.path.join(AQUI, "paginas", d["slug"] + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(D), "diarias escritas")
