"""Lote 4: foránea, cartas y cumpleaños que faltaban (textos originales)."""
from _comun import guarda

def k(para, texto, firma=""): return {"carta": {"para": para, "texto": texto, "firma": firma}}
def carta(slug, cabeza, col, title, desc, h1, resumen, resp, postal, grupos, como, faq, hermanas):
    secs = [{"h2": "Escríbela y mándala como postal", "bloques": [{"herramienta": dict(tipo="postal", **postal)}, "Toca «Usar esta carta» en cualquiera de abajo y se pasa a la postal."]}]
    secs += [{"h2": h, "bloques": b} for h, b in grupos]
    if como: secs.append({"h2": "Cómo escribir la tuya", "bloques": como})
    guarda({"slug": slug, "tipo": "carta", "coleccion": col, "cabeza": cabeza, "title": title, "description": desc, "h1": h1, "resumen": resumen,
            "respuesta": resp, "secciones": secs, "faq": faq + [{"q": "¿La postal se guarda en algún lado?", "a": "No. Se arma en tu teléfono y sólo sale si tú la mandas."}],
            "hermanas": hermanas})

guarda({"slug": "foranea", "tipo": "marca", "coleccion": "marca", "cabeza": "foranea",
 "title": "Foránea: qué significa y cómo se vive lejos de casa",
 "description": "Foránea o foráneo: qué significa, de dónde viene la palabra y por qué en México así se les dice a quienes estudian o trabajan lejos de casa. Mis cartas.",
 "h1": "Foránea", "resumen": "Qué significa foránea y por qué mis cartas se llaman así.",
 "respuesta": "Foráneo quiere decir que es de fuera, de otro lugar. En México se les dice foráneos a quienes viven lejos de su ciudad para estudiar o trabajar. Yo soy foránea en Monterrey, y por eso mis cartas se llaman Cartas de una foránea.",
 "revisada": "2026-11-15",
 "secciones": [
  {"h2": "Qué significa foráneo", "bloques": [
   "Los diccionarios lo dan como forastero o extraño, alguien que es de fuera. Viene del latín forāneus, que sale de forās, afuera.",
   "Es pariente de forastero. Wiktionary también la liga con huraño, que viene de la misma raíz."]},
  {"h2": "Cómo se usa en México", "bloques": [
   "En México, foráneo es sobre todo el estudiante que llega de otra ciudad. Se dice en las universidades, en las casas de asistencia y entre amigos.",
   {"lista": ["Ser foránea es rentar un cuarto, aprender a cocinar sola y llamar a casa cada noche.",
              "Es volver en vacaciones y sentir que el pueblo cambió, o que una cambió.",
              "Es hacer familia con otros foráneos."]}]},
  {"h2": "Mis Cartas de una foránea", "bloques": [
   "Nací en un pueblo pequeño de Sonora, en una familia de campo, caballos y vacas. Hoy soy foránea en Monterrey.",
   "En mi canción [Country girl](/musica/) cuento que no pertenezco a la ciudad, sino al campo. Las Cartas de una foránea son lo que escribo desde aquí.",
   "Si te apuntas al final de esta página, te escribo cuando haya canción nueva."]},
  {"h2": "Para quien está lejos de casa", "bloques": [
   {"lista": [["Escribe a tu familia.", "Una carta pesa más que un mensaje. Mira la [carta para mi mamá](/carta-para-mi-mama/)."],
              ["Ten algo de tu tierra contigo.", "Una canción, una receta o una foto en la pared."],
              ["Busca a otros foráneos.", "Casi siempre hay más gente lejos de casa de lo que crees."]]},
   "Para los mexicanos lejos de casa hay una canción que funciona como himno. Mira [Cielito lindo](/cielito-lindo/)."]}],
 "faq": [{"q": "¿Qué significa foránea?", "a": "Que es de fuera, de otro lugar. En México se dice de quien vive lejos de su ciudad para estudiar o trabajar."},
         {"q": "¿Foráneo y forastero son lo mismo?", "a": "Son muy parecidos. Los dos vienen de forās, que en latín quiere decir afuera."}],
 "fuentes": [{"t": "Foráneo, Wiktionary", "url": "https://es.wiktionary.org/wiki/for%C3%A1neo"}, {"t": "Foráneo, EcuRed", "url": "https://www.ecured.cu/For%C3%A1neo"}],
 "hermanas": ["carta-para-mi-mama", "cielito-lindo", "cartas-de-amor", "caloncho", "cantautores"]})

carta("carta-de-amor-a-mano", "carta de amor con dibujos", "cartas",
 "Carta de amor con dibujos: cómo hacerla a mano",
 "Carta de amor con dibujos hecha a mano: qué papel usar, cómo doblarla como sobre, dibujos fáciles para decorarla y textos cortos para escribir. Hazla hoy.",
 "Carta de amor a mano, con dibujos", "Cómo hacer a mano una carta de amor con dibujos fáciles.",
 "Una carta de amor a mano se guarda por años. Necesitas una hoja, una pluma y diez minutos. Abajo está cómo doblarla, qué dibujar y qué escribir.",
 {"ocasion": "a-mano", "para": "Amor", "firma": "", "texto": "Esta carta la escribí a mano para que la guardes.\n\nCada letra chueca es porque me temblaba la mano pensando en ti.\n\nTe quiero."},
 [("Lo que necesitas", [{"lista": ["Una hoja blanca o de color, tamaño carta.", "Una pluma de tinta oscura y un lápiz.", "Plumones o colores para los dibujos.", "Opcional, un sello, un listón o una flor seca."]}]),
  ("Cómo doblarla como sobre", [{"pasos": ["Pon la hoja horizontal y dobla las dos esquinas de abajo hacia el centro.", "Dobla los lados hacia adentro, como un sobre.",
    "Dobla la parte de arriba en triángulo, como la tapa.", "Ciérrala con un corazón dibujado, una calcomanía o un listón."]}]),
  ("Dibujos fáciles para decorarla", [{"lista": [["Corazones en la esquina.", "Dos curvas y una punta. Haz uno grande y dos chicos."],
     ["Una golondrina o una paloma.", "Una curva como una m alargada. Es el ave que lleva cartas."], ["Estrellas pequeñas.", "Cinco puntas sin levantar el lápiz."],
     ["Un timbre en la esquina.", "Un cuadrito con bordes en zigzag y un dibujo adentro."], ["Una línea de olas abajo.", "Como si la carta viniera desde el mar."]]},
   "Estas son las figuras de mis postales en este sitio. Las aves, las estrellas y el mar."]),
  ("Textos cortos para escribir", [k("", "Esta carta tiene mi letra y mis dibujos porque quería que tuviera algo mío."), k("", "Guárdala. Un día la vamos a leer juntos y nos vamos a reír.")])],
 [{"pasos": ["Escribe primero en borrador para no tachar.", "Pasa el texto con pluma, despacio.", "Dibuja al final, en los espacios que sobren."]},
  "Si no tienes papel a la mano, usa la postal de arriba y guárdala como imagen. Más textos en [cartas de amor](/cartas-de-amor/)."],
 [{"q": "¿Qué dibujo una carta de amor?", "a": "Corazones, aves, estrellas o un timbre en la esquina. Cosas simples se ven bonitas hechas a mano."}],
 ["cartas-de-amor", "carta-para-mi-novio", "carta-para-mi-novia", "carta-de-san-valentin", "carta-para-mi-mama"])

carta("carta-de-despedida", "carta de despedida", "cartas",
 "Carta de despedida: 5 cartas para decir adiós con cariño",
 "Carta de despedida para un amor que termina, una amiga que se va lejos o un compañero de trabajo. Cinco cartas para decir adiós con cariño. Mándala como postal.",
 "Carta de despedida", "Cinco cartas para despedirte de alguien con cariño.",
 "Una carta de despedida cierra algo con cariño, aunque duela. Aquí tienes cinco, para una pareja, una amiga que se muda o un compañero de trabajo. Cámbiala y mándala como postal.",
 {"ocasion": "despedida", "para": "", "firma": "", "texto": "Te escribo para decir adiós como se debe.\n\nGracias por lo que fuimos. Me llevo lo bonito y te deseo lo mejor.\n\nCuídate mucho."},
 [("Para un amor que termina", [k("", "No te escribo para pedirte que te quedes. Te escribo para darte las gracias por lo que fuimos.\n\nAprendí mucho contigo, hasta en lo que dolió. Te deseo un camino bonito, aunque ya no sea a mi lado.\n\nAdiós, con cariño.", ""),
                                 k("", "Nos quisimos mucho y no alcanzó. No es culpa de nadie.\n\nMe quedo con tu risa y con lo que me enseñaste. Lo demás lo dejo ir.", "")]),
  ("Para una amiga que se va lejos", [k("Amiga,", "Te vas a otra ciudad y aquí se queda un hueco con tu forma. Me da gusto por ti y me duele por mí.\n\nVe y comete el mundo. Aquí te espero con café cuando vuelvas.", "Tu amiga")]),
  ("Para un compañero de trabajo", [k("", "Fue un gusto trabajar contigo. Gracias por tu paciencia, tus ideas y tu buen humor en los días pesados.\n\nMucho éxito en lo que sigue.", "")]),
  ("La que no se manda", [k("", "A veces la carta de despedida es para una misma. Escribe todo lo que no dijiste, léelo en voz alta y guárdalo.\n\nNo hace falta mandarla para que sirva.", "")])],
 [{"pasos": ["Agradece algo concreto.", "Di lo que te llevas de esa persona.", "Desea algo bueno para su camino.", "Cierra corto, sin reproches."]},
  "Si estás en medio de una ruptura, mira también las [canciones de desamor](/canciones-de-desamor/)."],
 [{"q": "¿Cómo escribo una carta de despedida?", "a": "Agradece, di lo que te llevas y desea algo bueno. Sin reproches y corta."}],
 ["canciones-de-desamor", "canciones-tristes-para-llorar", "carta-para-una-amiga", "cartas-de-amor", "foranea"])

carta("cartas-para-amiga-secreta", "cartas para amiga secreta", "cartas",
 "Cartas para amiga secreta: 6 cartas sin revelar quién eres",
 "Cartas para amiga secreta: seis cartas cortas y divertidas para mandar sin revelar quién eres, más pistas para el día del intercambio. Mándala como postal.",
 "Cartas para amiga secreta", "Seis cartas y pistas para tu amiga secreta.",
 "Una carta para tu amiga secreta tiene que emocionarla sin delatarte. Aquí tienes seis cartas cortas y pistas para cada semana. Al final, una carta para el día que te revelas.",
 {"ocasion": "amiga-secreta", "para": "Amiga secreta", "firma": "Tu amiga secreta", "texto": "Hola, amiga secreta.\n\nNo sabes quién soy, pero yo sí sé que hoy necesitas una sonrisa. Aquí está.\n\nNos vemos pronto. Tal vez ya me viste."},
 [("Para la primera semana", [k("Hola,", "Me tocaste a ti y me dio mucho gusto. Te voy a dejar pistas, a ver si me descubres.\n\nPista uno, me gusta el café.", "Tu amiga secreta")]),
  ("Para la segunda semana", [k("Hola otra vez,", "¿Ya sospechas? Te doy otra pista. Hoy te vi y no me reconociste.", "Tu amiga secreta"),
                               k("Amiga secreta,", "Que tengas un día tan bonito como tu risa en el recreo.", "Ya sabes quién, o no")]),
  ("Para el 14 de febrero", [k("Para ti,", "Feliz día del amor y la amistad. Gracias por ser una persona que da gusto tener cerca.", "Tu amiga secreta")]),
  ("Para el día que te revelas", [k("Sorpresa,", "Era yo. Me divertí mucho dejándote cartas y viéndote adivinar.\n\nOjalá esto sea el principio de una amistad de verdad.", "")])],
 [{"pasos": ["No escribas con tu letra de siempre. Usa la postal del celular.", "Da pistas reales pero vagas.", "Cierra con algo amable sobre ella."]}],
 [{"q": "¿Qué le escribo a mi amiga secreta?", "a": "Algo amable, una pista sobre ti y una pregunta para que adivine."}],
 ["carta-del-dia-del-amor-y-la-amistad", "carta-para-una-amiga", "carta-para-mi-mejor-amiga", "feliz-cumpleanos-amiga"])

carta("carta-para-mi-hija", "la carta más bonita para mi hija", "cartas",
 "La carta más bonita para mi hija: 5 cartas de mamá o papá",
 "La carta más bonita para tu hija: cinco cartas de mamá o papá para su cumpleaños, sus 15 años, su graduación o un día difícil. Cámbiala y mándala como postal.",
 "Carta para mi hija", "Cinco cartas de mamá o papá para tu hija.",
 "La carta más bonita para una hija le dice lo que ve en ella y lo que le desea. Aquí tienes cinco para momentos distintos, de mamá o de papá. Cambia los detalles y dásela a mano o como postal.",
 {"ocasion": "hija", "para": "Hija", "firma": "Mamá", "texto": "Hija:\n\nVerte crecer es lo más bonito que me ha pasado. Eres valiente, buena y tuya.\n\nSiempre voy a estar aquí."},
 [("Para su cumpleaños", [k("Mi niña,", "Hoy cumples años y yo vuelvo al día en que te cargué por primera vez. Desde entonces aprendí más de ti que tú de mí.\n\nFeliz cumpleaños. Te quiero con todo lo que soy.", "Mamá")]),
  ("Para sus 15 años", [k("Hija,", "Hoy empiezas una etapa nueva y te miro con orgullo. Vas a equivocarte y a acertar, y en las dos cosas te voy a acompañar.\n\nNunca dejes de ser tú.", "Papá")]),
  ("Para su graduación", [k("Hija,", "Lo lograste. Cada desvelo y cada duda valieron la pena.\n\nEste título es tuyo. El orgullo es mío.", "Mamá")]),
  ("Para un día difícil", [k("Hija,", "Hoy te duele algo y quisiera quitártelo. No puedo, pero puedo quedarme contigo mientras pasa.\n\nEres más fuerte de lo que crees.", "Papá")]),
  ("Cortita", [k("", "De todo lo que he hecho en la vida, lo mejor eres tú.")])],
 [{"pasos": ["Recuerda un momento de cuando era chica.", "Dile lo que ves en ella hoy, con un ejemplo.", "Deséale algo para su camino."]},
  "Si quieres sumar música, mira [canciones para dedicar a mi hija](/canciones-para-dedicar-a-mi-hija/)."],
 [{"q": "¿Qué le escribo a mi hija?", "a": "Un recuerdo de cuando era chica, lo que admiras de ella hoy y un deseo para su camino."}],
 ["canciones-para-dedicar-a-mi-hija", "carta-para-mi-mama", "feliz-cumpleanos-sobrina", "cartas-de-amor"])

carta("feliz-cumpleanos-para-dedicar", "feliz cumpleaños para dedicar", "cumpleanos",
 "Feliz cumpleaños para dedicar: mensajes y postal gratis",
 "Feliz cumpleaños para dedicar a quien quieras: mensajes cortos, largos, cristianos y graciosos, más una postal para mandar por WhatsApp. Escoge y mándala.",
 "Feliz cumpleaños para dedicar", "Mensajes de cumpleaños para cualquier persona y una postal.",
 "Para dedicar un feliz cumpleaños, escoge un mensaje que suene a ti y agrégale su nombre. Aquí tienes cortos, largos y graciosos. Escríbelo en la postal y mándalo por WhatsApp.",
 {"ocasion": "cumple", "para": "", "firma": "", "texto": "Feliz cumpleaños.\n\nQue este año te traiga salud, risa y gente bonita alrededor.\n\nUn abrazo grande."},
 [("Cortos", [k("", "Feliz cumpleaños. Que este año sea tan bueno como tú."), k("", "Hoy se celebra que existes. Feliz cumple."), k("", "Que la vida te devuelva todo lo bueno que das.")]),
  ("Largos", [k("", "Feliz cumpleaños. Que este año traiga respuestas a lo que te preocupa y sorpresas a lo que ni imaginas.\n\nGracias por estar en mi vida. Celébralo en grande.", "")]),
  ("Graciosos", [k("", "Feliz cumpleaños. Ya no cuento tus años, cuento tus anécdotas, que son más."), k("", "Un año más sabio. Bueno, un año más.")]),
  ("Por persona", [{"lista": ["[Feliz cumpleaños, mamá](/feliz-cumpleanos-mama/)", "[Feliz cumpleaños, mi amor](/feliz-cumpleanos-mi-amor/)", "[Feliz cumpleaños, amiga](/feliz-cumpleanos-amiga/)",
                                "[Feliz cumpleaños, sobrina](/feliz-cumpleanos-sobrina/)", "[Feliz cumpleaños, madrina](/feliz-cumpleanos-madrina/)", "[Feliz cumpleaños para hombre](/feliz-cumpleanos-para-hombre/)"]}])],
 ["Agrega su nombre y un recuerdo del año. Para la imagen, usa el [feliz cumpleaños en letra bonita](/feliz-cumpleanos-en-letra-bonita/)."],
 [{"q": "¿Qué escribo para felicitar a alguien?", "a": "Su nombre, un deseo para su año y un gracias. Con eso basta."}],
 ["feliz-cumpleanos-en-letra-bonita", "feliz-cumpleanos-mama", "feliz-cumpleanos-amiga", "las-mananitas", "canciones-para-cumpleanos"])

carta("feliz-cumpleanos-madrina", "feliz cumple madrina", "cumpleanos",
 "Feliz cumpleaños madrina: mensajes de ahijada y ahijado",
 "Feliz cumpleaños, madrina: mensajes de ahijada o ahijado para agradecerle que te acompañe desde niño. Cortos y largos. Cámbialos y mándalos como postal.",
 "Feliz cumpleaños, madrina", "Mensajes de ahijada o ahijado para tu madrina.",
 "Una madrina es la familia que tus papás escogieron para ti. Para su cumpleaños, agradécele algo que hizo por ti. Aquí tienes mensajes cortos y largos para mandar como postal.",
 {"ocasion": "cumple-madrina", "para": "Madrina", "firma": "Tu ahijada", "texto": "Feliz cumpleaños, madrina.\n\nGracias por estar desde el primer día, en las fotos y en las que no hay fotos.\n\nTe quiero mucho."},
 [("Cortos", [k("", "Feliz cumpleaños a mi madrina, mi segunda mamá."), k("", "Madrina, gracias por quererme como propia. Feliz cumpleaños.")]),
  ("Largos", [k("Madrina,", "Mis papás te escogieron hace años y no pudieron escoger mejor. Has estado en mis cumpleaños, en mis tropiezos y en mis logros.\n\nHoy es tu día. Que te llenen de cariño como tú me llenas a mí.", "Tu ahijada"),
              k("Madrina,", "Gracias por los consejos, los regaños a tiempo y los abrazos de siempre.\n\nFeliz cumpleaños. Te quiero mucho.", "Tu ahijado")])],
 None,
 [{"q": "¿Qué le escribo a mi madrina en su cumpleaños?", "a": "Un gracias por algo concreto que hizo por ti y un deseo para su año."}],
 ["feliz-cumpleanos-sobrina", "feliz-cumpleanos-mama", "feliz-cumpleanos-para-dedicar", "las-mananitas"])

carta("feliz-cumpleanos-para-hombre", "cumpleaños feliz para hombre", "cumpleanos",
 "Feliz cumpleaños para hombre: mensajes para él",
 "Feliz cumpleaños para hombre: mensajes para tu papá, tu hermano, tu amigo o un compañero, cortos y largos, serios y graciosos. Mándalos como postal por WhatsApp",
 "Feliz cumpleaños para hombre", "Mensajes de cumpleaños para papá, hermano, amigo o compañero.",
 "Para felicitar a un hombre, piensa quién es para ti. No es igual un papá que un compañero de trabajo. Aquí tienes mensajes por persona, para mandar como postal.",
 {"ocasion": "cumple-hombre", "para": "", "firma": "", "texto": "Feliz cumpleaños.\n\nQue este año te traiga buenas noticias, buena salud y buenos amigos alrededor.\n\nUn abrazo."},
 [("Para tu papá", [k("Papá,", "Feliz cumpleaños al hombre que me enseñó a no rendirme. Gracias por cada sacrificio que nunca contaste.\n\nTe quiero mucho.", "")]),
  ("Para tu hermano", [k("Hermano,", "Feliz cumpleaños. Gracias por defenderme, aunque también me hayas molestado toda la vida.\n\nQue sea un gran año.", "")]),
  ("Para un amigo", [k("", "Feliz cumpleaños, amigo. Que este año te dé tantas buenas historias como las que ya nos debemos.")]),
  ("Para un compañero de trabajo", [k("", "Feliz cumpleaños. Que tengas un excelente día y un mejor año.")]),
  ("Graciosos", [k("", "Feliz cumpleaños. Tranquilo, las canas dan experiencia."), k("", "Un año más y sigues igual de guapo. Bueno, casi.")])],
 None,
 [{"q": "¿Qué le escribo a un hombre en su cumpleaños?", "a": "Depende de quién es para ti. A un papá, un gracias. A un amigo, un recuerdo. A un compañero, algo breve y amable."}],
 ["feliz-cumpleanos-para-dedicar", "feliz-cumpleanos-mi-amor", "canciones-para-papa", "las-mananitas"])

carta("feliz-cumpleanos-para-mi", "cumpleaños feliz para mi", "cumpleanos",
 "Feliz cumpleaños para mí: frases para mi cumpleaños",
 "Feliz cumpleaños para mí: frases para tu propio cumpleaños, para una historia de Instagram o para escribirte una carta. Agradece tu año y empieza el que sigue.",
 "Feliz cumpleaños para mí", "Frases y una carta para tu propio cumpleaños.",
 "En tu cumpleaños también se vale escribirte a ti. Aquí tienes frases para una historia y una carta para leerte. Dale gracias a tu año y pide algo para el que empieza.",
 {"ocasion": "cumple-yo", "para": "Para mí", "firma": "Yo", "texto": "Feliz cumpleaños a mí.\n\nGracias por no rendirte este año, aunque hubo días en que quisiste.\n\nQue el que empieza te trate bonito."},
 [("Frases para tu historia", [{"lista": ["Hoy cumplo años y me tengo cariño.", "Un año más de aprender a quererme.", "Gracias, vida, por un año más.", "Hoy celebro a la persona que sobrevivió todo lo de este año."]}]),
  ("Una carta para ti", [k("Querida yo,", "Este año aprendiste a pedir ayuda, a decir que no y a empezar de nuevo. No fue poco.\n\nSigue así, con calma. Lo mejor todavía no llega.", "Yo")])],
 ["Escríbete como le escribirías a tu mejor amiga. Para la imagen, pon tu nombre en [letra bonita](/feliz-cumpleanos-en-letra-bonita/)."],
 [{"q": "¿Qué pongo en mi cumpleaños en redes?", "a": "Una frase corta de gratitud y una foto tuya. Con eso basta."}],
 ["feliz-cumpleanos-en-letra-bonita", "feliz-cumpleanos-para-dedicar", "canciones-para-cumpleanos", "frases-de-fin-de-ano"])
print("lote 4")
