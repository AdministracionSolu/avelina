"""Lote 2, tercera parte: cartas y felicitaciones (textos originales, para copiar)."""
from _comun import guarda

def k(para, texto, firma=""): return {"carta": {"para": para, "texto": texto, "firma": firma}}
def carta(slug, cabeza, col, title, desc, h1, resumen, resp, postal, grupos, como, faq, hermanas):
    secs = [{"h2": "Escríbela y mándala como postal", "bloques": [{"herramienta": dict(tipo="postal", **postal)}, "Toca «Usar esta carta» en cualquiera de abajo y se pasa a la postal."]}]
    secs += [{"h2": h, "bloques": b} for h, b in grupos] + [{"h2": "Cómo escribir la tuya", "bloques": como}]
    guarda({"slug": slug, "tipo": "carta", "coleccion": col, "cabeza": cabeza, "title": title, "description": desc, "h1": h1, "resumen": resumen,
            "respuesta": resp, "secciones": secs, "faq": faq + [{"q": "¿La postal se guarda en algún lado?", "a": "No. Se arma en tu teléfono y sólo sale si tú la mandas."}],
            "hermanas": hermanas})

carta("carta-para-mi-novia", "una carta para mi novia", "cartas",
 "Carta para mi novia: 7 cartas bonitas para mandarle hoy",
 "Una carta para mi novia: siete cartas bonitas y largas para decirle lo que sientes, pedir perdón o celebrar. Cámbiala y mándala como postal por WhatsApp.",
 "Carta para mi novia", "Siete cartas para tu novia, de largas a notas de una línea.",
 "Una carta para tu novia funciona cuando dice algo que sólo tú sabes de ella. Aquí tienes siete, de largas a cortitas, para distintos momentos. Escoge una, ponle sus detalles y mándala como postal.",
 {"ocasion": "novia", "para": "Amor", "firma": "Tuyo", "texto": "Te escribo porque hay cosas que en persona se me atoran.\n\nMe gusta tu risa cuando no puedes parar, tu forma de cuidar a los tuyos y cómo me miras cuando crees que no me doy cuenta.\n\nGracias por elegirme."},
 [("Para decirle lo que sientes", [k("Amor,", "Desde que llegaste, mis días tienen un orden distinto. Primero pienso en ti y luego en lo demás.\n\nNo sé decir esto bonito, así que lo digo directo. Te quiero y me haces muy feliz.", "Tuyo"),
                                    k("Mi vida,", "Me encanta que seas tú en todos lados. Igual en una fiesta que en pijama un domingo.\n\nContigo no tengo que fingir nada. Eso vale más que cualquier regalo.", "Te amo")]),
  ("Larga, para que llore bonito", [k("Mi amor,", "Me acuerdo del día que nos conocimos. No sabía qué decir y tú me salvaste con una pregunta tonta.\n\nDesde entonces aprendí tus manías, tus miedos y tus canciones favoritas. Aprendí que te pones seria cuando algo te importa y que te ríes con los ojos.\n\nNo te prometo días perfectos. Te prometo estar en los buenos y en los difíciles.\n\nGracias por dejarme quererte.", "Tuyo, siempre")]),
  ("Para pedirle perdón", [k("Amor,", "Me equivoqué contigo y no quiero que pase de largo. Te debo una disculpa sin peros.\n\nLo siento. Voy a escucharte mejor.", "Perdóname")]),
  ("Para una fecha especial", [k("Mi amor,", "Hoy cumplimos un mes más y yo sigo igual de nervioso que al principio.\n\nQue sean muchos más. Contigo quiero todos.", "Tuyo")]),
  ("Notas cortitas para tu novia", [{"lista": ["Hoy también me gustas, como ayer.", "Eres mi parte favorita del día.", "Gracias por existir tan bonito.", "Te debo un abrazo largo. Cóbramelo hoy."]}])],
 [{"pasos": ["Empieza con un recuerdo concreto de los dos.", "Dile qué te gusta de ella con un ejemplo.", "Cuéntale qué cambió en ti desde que están juntos.", "Cierra con algo que quieras hacer con ella pronto."]},
  "Si la quieres creativa, escríbela en pedacitos y escóndelos en sus cosas. O júntala con una de las [canciones para dedicar a mi novia](/canciones-para-dedicar-a-mi-novia/)."],
 [{"q": "¿Qué le escribo a mi novia en una carta?", "a": "Un recuerdo de los dos, lo que te gusta de ella con ejemplos y un plan para pronto."},
  {"q": "¿Cómo hago una carta para que llore?", "a": "Dile algo que nunca le has dicho en voz alta, con un detalle que sólo ella entienda."}],
 ["carta-para-mi-novio", "cartas-de-amor", "carta-de-amor-a-mano", "carta-de-san-valentin", "canciones-para-dedicar-a-mi-novia", "feliz-cumpleanos-mi-amor"])

carta("carta-para-mi-mejor-amiga", "carta para mi mejor amiga", "cartas",
 "Carta para mi mejor amiga: 6 cartas que la hagan llorar",
 "Carta para mi mejor amiga: seis cartas para agradecerle años de amistad, felicitarla o decirle que la extrañas. Cámbiala y mándala como postal por WhatsApp.",
 "Carta para mi mejor amiga", "Seis cartas para la amiga de toda la vida.",
 "Una carta para tu mejor amiga se escribe con años de recuerdos. Aquí tienes seis cartas para agradecerle, felicitarla o decirle que la extrañas. Ponle sus detalles y mándala como postal.",
 {"ocasion": "mejor-amiga", "para": "Amiga", "firma": "Tu persona favorita", "texto": "Eres la primera a la que le cuento todo, lo bueno y lo vergonzoso.\n\nGracias por conocerme tan bien y quedarte igual.\n\nTe quiero muchísimo."},
 [("Para agradecerle tantos años", [k("Amiga,", "Llevamos tantos años juntas que ya no me acuerdo de mi vida sin ti. Me viste en todas mis versiones, hasta en las que no me caía bien a mí misma.\n\nGracias por quedarte en cada una. Eres mi familia elegida.", "Tu amiga de siempre"),
                                   k("Amiga,", "Nos hemos reído de todo, hasta de lo que dolía. Eso es lo que más te agradezco.\n\nContigo los días feos pesan la mitad.", "Te quiero")]),
  ("Para que llore bonito", [k("Mi mejor amiga,", "Si un día te sientes sola, lee esto. Hay alguien que te admira, que presume de ti y que daría lo que fuera por verte bien.\n\nEsa soy yo. Desde el primer día y hasta el último.", "Tuya")]),
  ("Para cuando están lejos", [k("Amiga,", "Ahora vivimos en ciudades distintas y me cuesta. Ya no hay cafés espontáneos ni tardes en tu cuarto.\n\nPero cada audio tuyo me devuelve a casa. La distancia no nos queda grande.", "Desde lejos")]),
  ("Para su cumpleaños", [k("Amiga,", "Feliz cumpleaños a la persona que mejor me conoce. Que este año te dé tanto como tú das.\n\nAquí estoy para celebrarlo contigo, como siempre.", "Tu mejor amiga")]),
  ("Cortita", [k("", "Gracias por ser mi lugar seguro. Te quiero, amiga.")])],
 [{"pasos": ["Elige un recuerdo que sólo ustedes dos entiendan.", "Dile qué has aprendido de ella.", "Agradécele un momento difícil en el que estuvo.", "Cierra con un plan para las dos."]},
  "Si quieres algo más ligero, mira las cartas para [una amiga](/carta-para-una-amiga/)."],
 [{"q": "¿Qué le escribo a mi mejor amiga?", "a": "Un recuerdo de las dos, lo que aprendiste de ella y un gracias por un momento difícil."}],
 ["carta-para-una-amiga", "feliz-cumpleanos-amiga", "carta-del-dia-del-amor-y-la-amistad", "canciones-para-una-amiga", "cartas-para-amiga-secreta"])

carta("carta-de-san-valentin", "carta de san valentin", "cartas",
 "Carta de San Valentín: 6 cartas para el 14 de febrero",
 "Carta de San Valentín para tu novio, novia o pareja: seis cartas para el 14 de febrero, largas y cortas. Cámbiala y mándala como postal por WhatsApp. Gratis.",
 "Carta de San Valentín", "Seis cartas para el 14 de febrero en pareja.",
 "Una carta de San Valentín vale más que cualquier regalo si habla de ustedes. Aquí tienes seis para el 14 de febrero, de largas a cortitas. Escoge una, cámbiala y mándala como postal.",
 {"ocasion": "san-valentin", "para": "Mi Valentín", "firma": "", "texto": "Feliz 14 de febrero.\n\nNo necesito un día para quererte, pero hoy aprovecho para decírtelo por escrito. Eres lo más bonito que me ha pasado.\n\nTe quiero."},
 [("Para tu pareja", [k("Amor,", "Este es otro 14 de febrero a tu lado y todavía me sorprendes. Me sorprende lo fácil que es quererte.\n\nGracias por los días comunes, que contigo nunca lo son. Feliz San Valentín.", "Tuya"),
                       k("Mi vida,", "Hoy todo el mundo regala flores. Yo te regalo esta carta, que dura más.\n\nTe elegiría otra vez, en cualquier ciudad y en cualquier año.", "Te amo")]),
  ("Si es su primer San Valentín", [k("Hola, tú,", "Es nuestro primer 14 de febrero y no sé bien cómo se hace esto. Lo que sí sé es que me gusta mucho estar contigo.\n\nQue sea el primero de muchos.", "")]),
  ("Si están lejos", [k("Amor,", "Este 14 de febrero nos toca de lejos. Te mando esta carta para que la abras a la hora que sea de este lado.\n\nCuando nos veamos, celebramos todos los que nos debemos.", "Desde lejos")]),
  ("Cortitas", [k("", "Mi plan favorito de San Valentín eres tú."), k("", "Feliz 14. Gracias por hacer bonito lo de todos los días.")])],
 [{"pasos": ["Recuerda su primer 14 de febrero juntos o su primera cita.", "Dile algo que te gusta de este año con él o con ella.", "Cierra con un plan para el día."]},
  "Si es para una amiga, mira la [carta del día del amor y la amistad](/carta-del-dia-del-amor-y-la-amistad/)."],
 [{"q": "¿Qué escribo en una carta de San Valentín?", "a": "Un recuerdo de los dos, algo que te gusta de este año juntos y un plan para el día."}],
 ["cartas-de-amor", "carta-para-mi-novio", "carta-para-mi-novia", "carta-del-dia-del-amor-y-la-amistad", "carta-de-amor-a-mano"])

carta("carta-del-dia-del-amor-y-la-amistad", "carta para el dia del amor y la amistad", "cartas",
 "Carta para el día del amor y la amistad: 6 para amigas",
 "Carta para el día del amor y la amistad: seis cartas para tu amiga, tu mejor amiga o tu grupo, para el 14 de febrero. Cámbiala y mándala como postal gratis.",
 "Carta para el día del amor y la amistad", "Seis cartas de amistad para el 14 de febrero.",
 "El 14 de febrero en México también es de la amistad. Aquí tienes seis cartas para tu amiga, tu mejor amiga o tu grupo. Cámbialas y mándalas como postal desde el celular.",
 {"ocasion": "amistad", "para": "Amiga", "firma": "Tu amiga", "texto": "Feliz día del amor y la amistad.\n\nEste 14 de febrero te escribo a ti, que me quieres sin pedir nada a cambio.\n\nGracias por ser mi amiga."},
 [("Para tu amiga", [k("Amiga,", "Hoy celebran a las parejas, pero yo celebro lo nuestro. Una amistad que aguanta horarios, cambios y malas rachas.\n\nFeliz día del amor y la amistad.", "Tu amiga"),
                      k("Amiga,", "Gracias por las tardes de chisme, los consejos que no pedí y los abrazos que sí necesitaba.\n\nEste 14 de febrero es tuyo.", "Con cariño")]),
  ("Para tu grupo de amigas", [k("A mis amigas,", "Somos un desastre organizado y no las cambiaría por nada.\n\nGracias por ser mi casa cuando estoy lejos de la mía. Feliz 14 de febrero.", "Su amiga")]),
  ("Para tu amigo secreto", [k("Para ti,", "No sabes quién soy y eso lo hace divertido. Sólo sé que mereces un día bonito.\n\nFeliz día del amor y la amistad.", "Tu amiga secreta"), "Hay más ideas en [cartas para amiga secreta](/cartas-para-amiga-secreta/)."]),
  ("Cortitas", [k("", "Las amigas como tú se cuentan con una mano. Feliz 14."), k("", "Gracias por quererme en mis peores días. Feliz día de la amistad.")])],
 [{"pasos": ["Recuerda un momento de su amistad.", "Dile una cualidad suya con ejemplo.", "Cierra con un plan para celebrar juntas."]}],
 [{"q": "¿El 14 de febrero también es de la amistad?", "a": "Sí. En México se celebra como día del amor y la amistad."}],
 ["carta-para-una-amiga", "carta-para-mi-mejor-amiga", "cartas-para-amiga-secreta", "carta-de-san-valentin", "canciones-para-una-amiga"])

carta("feliz-cumpleanos-amiga", "cumpleaños feliz amiga", "cumpleanos",
 "Feliz cumpleaños amiga: mensajes bonitos y postal",
 "Feliz cumpleaños, amiga: mensajes cortos, largos y graciosos para felicitar a tu amiga o a tu mejor amiga. Cámbialos y mándalos como postal por WhatsApp.",
 "Feliz cumpleaños, amiga", "Mensajes de cumpleaños para tu amiga, listos para mandar.",
 "Para felicitar a tu amiga, junta un recuerdo del año y un deseo para el que empieza. Aquí tienes mensajes cortos, largos y graciosos. Escoge uno, cámbialo y mándalo como postal.",
 {"ocasion": "cumple-amiga", "para": "Amiga", "firma": "Tu amiga", "texto": "Feliz cumpleaños, amiga.\n\nQue este año te traiga todo lo que te mereces, que es muchísimo.\n\nGracias por otro año de risas. Te quiero."},
 [("Mensajes cortos", [k("", "Feliz cumpleaños a mi persona favorita para chismear."), k("", "Que cumplas muchos más y que yo esté en todos. Feliz cumple, amiga."), k("", "Un año más de ser increíble. Feliz cumpleaños.")]),
  ("Mensajes largos", [k("Amiga,", "Hoy cumples años y yo celebro haberte encontrado. Gracias por cada plática a deshoras y por cada vez que me hiciste reír cuando no quería.\n\nQue este año te trate bonito. Si no, aquí estoy para ayudarte a cobrárselo.", "Tu amiga"),
                       k("Amiga,", "Otro año a tu lado y sigo aprendiendo de ti. De tu valor, de tu paciencia y de tu forma de querer.\n\nFeliz cumpleaños. Te mereces todo.", "Con cariño")]),
  ("Mensajes graciosos", [k("", "Feliz cumpleaños. Tranquila, sigues sin aparentar la edad que tienes, aparentas una mejor."), k("", "Otro año de soportarme. Te mereces un premio, y yo te lo doy, un abrazo.")])],
 ["Usa un recuerdo de este año, aunque sea pequeño. Si es tu amiga de toda la vida, mira también la [carta para mi mejor amiga](/carta-para-mi-mejor-amiga/).",
  "Para la imagen de su historia, escribe su nombre en [letra bonita](/feliz-cumpleanos-en-letra-bonita/)."],
 [{"q": "¿Qué le escribo a mi amiga en su cumpleaños?", "a": "Un recuerdo del año, un gracias y un deseo para el que empieza."}],
 ["carta-para-una-amiga", "carta-para-mi-mejor-amiga", "feliz-cumpleanos-en-letra-bonita", "las-mananitas", "canciones-para-cumpleanos"])

carta("feliz-cumpleanos-sobrina", "cumpleaños feliz sobrina", "cumpleanos",
 "Feliz cumpleaños sobrina: mensajes de tía y tío",
 "Feliz cumpleaños, sobrina: mensajes de tía o tío para niña, adolescente o adulta, cortos y largos. Cámbialos y mándalos como postal por WhatsApp. Gratis.",
 "Feliz cumpleaños, sobrina", "Mensajes de cumpleaños de tía o tío para tu sobrina.",
 "Para felicitar a tu sobrina, piensa en su edad. A una niña le gusta un mensaje alegre y a una adulta uno que la haga sentir orgullosa. Aquí tienes mensajes para cada etapa, listos para mandar como postal.",
 {"ocasion": "cumple-sobrina", "para": "Sobrina", "firma": "Tu tía", "texto": "Feliz cumpleaños, sobrina hermosa.\n\nVerte crecer es de las cosas más bonitas que me ha dado la vida. Que este año esté lleno de risas y sueños.\n\nTe quiero mucho."},
 [("Para una sobrina niña", [k("Mi sobrinita,", "Hoy cumples años y ya estás más grande que la última vez que te vi. Que tu pastel sea enorme y tus regalos también.\n\nTe quiero hasta la luna.", "Tu tía"),
                              k("", "Feliz cumpleaños a la princesa más valiente de la familia. Te quiero mucho.")]),
  ("Para una sobrina adolescente", [k("Sobrina,", "Ya no eres la niña que cargaba, y me encanta la persona que estás siendo. Sigue siendo tú, aunque a veces cueste.\n\nAquí tienes una tía para lo que necesites. Feliz cumpleaños.", "Tu tía")]),
  ("Para una sobrina adulta", [k("Sobrina,", "Verte convertida en una mujer tan fuerte me llena de orgullo. Que este año te traiga todo lo que estás construyendo.\n\nFeliz cumpleaños.", "Tu tío")]),
  ("Mensajes cortos", [k("", "Feliz cumpleaños, sobrina. Eres el orgullo de la familia."), k("", "Que cumplas muchos más, sobrina querida. Un abrazo grande.")])],
 ["Agrega un recuerdo de cuando era chica. A las sobrinas les encanta saber cómo las ve la familia."],
 [{"q": "¿Qué le escribo a mi sobrina en su cumpleaños?", "a": "Un recuerdo de cuando era chica, algo que admires de ella hoy y un deseo para su año."}],
 ["feliz-cumpleanos-amiga", "feliz-cumpleanos-madrina", "feliz-cumpleanos-para-dedicar", "feliz-cumpleanos-en-letra-bonita", "las-mananitas"])
print("lote 2c: cartas")
