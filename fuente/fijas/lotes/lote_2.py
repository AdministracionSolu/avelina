"""Lote 2: afinadores, cartas y cumpleaños, Silvana Estrada, Caloncho, La llorona y listas."""
from _comun import guarda, artista, cover

FREC = {"Wikipedia, frecuencias con La 440 Hz": "https://en.wikipedia.org/wiki/Piano_key_frequencies"}
def fuente_frec(): return [{"t": "Piano key frequencies, Wikipedia (frecuencias con La 440 Hz)", "url": "https://en.wikipedia.org/wiki/Piano_key_frequencies"}]
def pasos_afinar(inst, n):
    return {"pasos": [f"Acerca el teléfono a tu {inst} y busca un lugar sin ruido.", "Toca el botón para encender el micrófono y da permiso.",
                      "Toca una sola cuerda al aire y déjala sonar.", "Si la aguja va a la izquierda, aprieta la clavija. Si va a la derecha, aflójala.",
                      f"Repite con las {n} cuerdas y da una segunda vuelta al final."]}

def afinador(slug, cabeza, inst, title, desc, h1, resp, cuerdas, tabla, extra, faq, fuentes, hermanas, n):
    guarda({"slug": slug, "tipo": "herramienta", "coleccion": "afinador", "cabeza": cabeza, "title": title, "description": desc, "h1": h1,
            "resumen": f"Afina tu {inst} con el micrófono del celular o de oído.", "respuesta": resp,
            "secciones": [{"h2": "Afina aquí", "bloques": [{"herramienta": {"tipo": "afinador", "nombre": inst, "cuerdas": cuerdas}},
                                                           {"nota": "El sonido se analiza en tu teléfono. No se graba ni se manda a ningún lado."}]},
                          {"h2": f"Las notas del {inst}", "bloques": tabla},
                          {"h2": "Cómo usar el afinador", "bloques": [pasos_afinar(inst, n), "Si no quieres usar el micrófono, toca un botón de cuerda. Suena su nota y afinas de oído."]}] + extra,
            "faq": faq + [{"q": "¿Es gratis?", "a": "Sí. Funciona en el navegador, sin cuenta y sin descargar nada."}],
            "fuentes": fuentes + fuente_frec(), "hermanas": hermanas})

afinador("afinador-de-ukulele", "afinador de ukelele", "ukulele",
 "Afinador de ukulele online gratis con tu micrófono",
 "Afinador de ukulele online y gratis: Sol, Do, Mi, La con el micrófono del celular o de oído. Te dice si cada cuerda está alta o baja. Afina aquí en un minuto.",
 "Afinador de ukulele",
 "El ukulele se afina Sol, Do, Mi, La, de la cuerda de arriba a la de abajo. Enciende el micrófono, toca una cuerda y sigue la aguja. Al centro, está afinada.",
 [["Sol", "G4", 392.0, "4ª"], ["Do", "C4", 261.63, "3ª"], ["Mi", "E4", 329.63, "2ª"], ["La", "A4", 440.0, "1ª"]],
 [{"tabla": {"cab": ["Cuerda", "Nota", "En inglés", "Frecuencia"], "filas": [["4ª, la de arriba", "Sol", "G4", "392.00 Hz"], ["3ª", "Do", "C4", "261.63 Hz"], ["2ª", "Mi", "E4", "329.63 Hz"], ["1ª, la de abajo", "La", "A4", "440.00 Hz"]]}},
  "La cuerda Sol suena más aguda que la Do. Es la afinación más común del ukulele soprano, concierto y tenor."],
 [{"h2": "Ya afinado, ¿qué toco?", "bloques": ["Empieza con Do, Sol, La menor y Fa. Están en la tabla de [acordes de ukulele](/acordes-de-ukulele/) con el traste de cada cuerda."]}],
 [{"q": "¿Cómo se afina un ukulele?", "a": "Sol, Do, Mi, La, de la cuerda de arriba a la de abajo."},
  {"q": "¿Por qué la cuerda de arriba suena aguda?", "a": "Porque la cuerda Sol va una octava arriba de lo esperado. Así se afina el ukulele tradicional."}],
 [{"t": "Ukulele, Wikipedia en inglés", "url": "https://en.wikipedia.org/wiki/Ukulele"}, {"t": "Standard tuning, Wikipedia", "url": "https://en.wikipedia.org/wiki/Standard_tuning"}],
 ["acordes-de-ukulele", "afinador-de-guitarra", "afinador-de-bajo", "afinador-de-violin", "como-afinar-una-guitarra"], 4)

afinador("afinador-de-bajo", "afinador de bajo", "bajo",
 "Afinador de bajo online gratis: Mi, La, Re, Sol",
 "Afinador de bajo eléctrico de 4 cuerdas, online y gratis: Mi, La, Re, Sol con el micrófono del celular o de oído. Te dice si cada cuerda está alta o baja.",
 "Afinador de bajo",
 "El bajo de cuatro cuerdas se afina Mi, La, Re, Sol, de la más gruesa a la más delgada. Suena una octava abajo de las cuatro cuerdas graves de la guitarra. Toca una cuerda y sigue la aguja.",
 [["Mi", "E1", 41.2, "4ª"], ["La", "A1", 55.0, "3ª"], ["Re", "D2", 73.42, "2ª"], ["Sol", "G2", 98.0, "1ª"]],
 [{"tabla": {"cab": ["Cuerda", "Nota", "En inglés", "Frecuencia"], "filas": [["4ª, la más gruesa", "Mi", "E1", "41.20 Hz"], ["3ª", "La", "A1", "55.00 Hz"], ["2ª", "Re", "D2", "73.42 Hz"], ["1ª, la más delgada", "Sol", "G2", "98.00 Hz"]]}},
  "Un bajo de cinco cuerdas suma una cuerda Si grave, B0, de unos 30.87 Hz."],
 [{"h2": "Si el micrófono no capta el bajo", "bloques": [
   {"lista": [["Las notas graves cuestan más a los celulares.", "Acerca el teléfono a la bocina del amplificador o al cuerpo del bajo."],
              ["Toca con fuerza media y deja sonar.", "Lee la aguja uno o dos segundos después del golpe."],
              ["Usa el armónico del traste 12.", "Suena una octava arriba y el micrófono lo capta mejor. Compáralo con el botón de la cuerda."]]}]}],
 [{"q": "¿Cómo se afina un bajo de 4 cuerdas?", "a": "Mi, La, Re, Sol, de la cuerda más gruesa a la más delgada."},
  {"q": "¿El bajo se afina igual que la guitarra?", "a": "Sí, con las mismas notas que las cuatro cuerdas graves de la guitarra, pero una octava abajo."}],
 [{"t": "Bass guitar, Wikipedia en inglés", "url": "https://en.wikipedia.org/wiki/Bass_guitar"}],
 ["afinador-de-guitarra", "afinador-de-bajo-quinto", "afinador-de-ukulele", "como-afinar-una-guitarra"], 4)

afinador("afinador-de-bajo-quinto", "afinador de bajo quinto", "bajo quinto",
 "Afinador de bajo quinto online: La, Re, Sol, Do, Fa",
 "Afinador de bajo quinto online y gratis: cinco órdenes La, Re, Sol, Do, Fa, con sus octavas, por micrófono o de oído. Afina las diez cuerdas aquí en minutos.",
 "Afinador de bajo quinto",
 "El bajo quinto tiene diez cuerdas en cinco órdenes, afinadas La, Re, Sol, Do y Fa. Los órdenes de La y Re llevan una cuerda una octava abajo. Afina cada cuerda por separado con el micrófono o de oído.",
 [["La grave", "A1", 55.0, "5º orden"], ["La", "A2", 110.0, "5º orden"], ["Re grave", "D2", 73.42, "4º orden"], ["Re", "D3", 146.83, "4º orden"],
  ["Sol", "G2", 98.0, "3er orden"], ["Do", "C3", 130.81, "2º orden"], ["Fa", "F3", 174.61, "1er orden"]],
 [{"tabla": {"cab": ["Orden", "Cuerdas", "Notas", "Frecuencias"], "filas": [
   ["5º, el más grave", "Par en octava", "La (A2) y La grave (A1)", "110.00 y 55.00 Hz"], ["4º", "Par en octava", "Re (D3) y Re grave (D2)", "146.83 y 73.42 Hz"],
   ["3º", "Par al unísono", "Sol (G2)", "98.00 Hz"], ["2º", "Par al unísono", "Do (C3)", "130.81 Hz"], ["1º", "Par al unísono", "Fa (F3)", "174.61 Hz"]]}},
  "Es la afinación que da Wikipedia en inglés. Algunos músicos usan variantes, sobre todo en el orden de Sol."],
 [{"h2": "Afinar las cuerdas dobles", "bloques": [
   {"pasos": ["Afina primero la cuerda delgada de cada par.", "Toca juntas las dos cuerdas del par.", "Si oyes un temblor o una ondulación, mueve la segunda clavija poco a poco.",
              "Cuando el temblor desaparece, el par está afinado."]},
   "El bajo quinto se usa en la música regional mexicana con acordeón, en polkas, corridos y redovas."]}],
 [{"q": "¿Cómo se afina un bajo quinto?", "a": "La, Re, Sol, Do, Fa, del orden más grave al más agudo. Los órdenes de La y Re llevan octava."},
  {"q": "¿Cuántas cuerdas tiene un bajo quinto?", "a": "Diez, en cinco pares llamados órdenes."}],
 [{"t": "Bajo quinto, Wikipedia en inglés", "url": "https://en.wikipedia.org/wiki/Bajo_quinto"}, {"t": "Bajo quinto, Wikipedia en español", "url": "https://es.wikipedia.org/wiki/Bajo_quinto"}],
 ["afinador-de-bajo", "afinador-de-guitarra", "como-afinar-una-guitarra", "afinador-de-ukulele"], 10)

afinador("afinador-de-violin", "afinadores de violin", "violín",
 "Afinador de violín online gratis: Sol, Re, La, Mi",
 "Afinador de violín online y gratis: Sol, Re, La, Mi con el micrófono del celular o tocando cada nota de referencia. Te dice si la cuerda está alta o baja.",
 "Afinador de violín",
 "El violín se afina Sol, Re, La, Mi, de la cuerda más grave a la más aguda. La cuerda La va en 440 Hz y es la que se afina primero. Toca cada cuerda y sigue la aguja.",
 [["Sol", "G3", 196.0, "4ª"], ["Re", "D4", 293.66, "3ª"], ["La", "A4", 440.0, "2ª"], ["Mi", "E5", 659.26, "1ª"]],
 [{"tabla": {"cab": ["Cuerda", "Nota", "En inglés", "Frecuencia"], "filas": [["4ª, la más grave", "Sol", "G3", "196.00 Hz"], ["3ª", "Re", "D4", "293.66 Hz"], ["2ª", "La", "A4", "440.00 Hz"], ["1ª, la más aguda", "Mi", "E5", "659.26 Hz"]]}},
  "Las cuerdas van separadas por quintas."],
 [{"h2": "Clavijas y afinadores finos", "bloques": ["Para cambios grandes usa las clavijas, con cuidado y poco a poco. Para ajustes pequeños usa los afinadores finos del cordal.",
   "Puntea la cuerda con el dedo o tócala con el arco. El micrófono capta mejor una nota larga con arco."]}],
 [{"q": "¿Cómo se afina un violín?", "a": "Sol, Re, La, Mi, de la cuerda más grave a la más aguda. Empieza por La, en 440 Hz."}],
 [{"t": "Standard tuning, Wikipedia (violín Sol Re La Mi)", "url": "https://en.wikipedia.org/wiki/Standard_tuning"}],
 ["afinador-de-guitarra", "afinador-de-ukulele", "afinador-de-bajo", "como-afinar-una-guitarra"], 4)

guarda({"slug": "como-afinar-una-guitarra", "tipo": "herramienta", "coleccion": "afinador", "cabeza": "afinar guitarra",
 "title": "Afinar guitarra paso a paso, con o sin afinador",
 "description": "Afinar la guitarra paso a paso: con afinador, de oído con el traste 5 o con notas de referencia. Las notas de cada cuerda y qué hacer si se desafina sola.",
 "h1": "Cómo afinar una guitarra",
 "resumen": "Tres formas de afinar la guitarra, paso a paso.",
 "respuesta": "Para afinar la guitarra, cada cuerda al aire tiene que sonar Mi, La, Re, Sol, Si, Mi, de la más gruesa a la más delgada. Lo más fácil es usar un afinador con el micrófono del celular. Sin afinador, se puede afinar de oído con el traste 5.",
 "secciones": [
  {"h2": "Afínala aquí con el micrófono", "bloques": [
   {"herramienta": {"tipo": "afinador", "nombre": "guitarra", "cuerdas": [["Mi", "E2", 82.41, "6ª"], ["La", "A2", 110.0, "5ª"], ["Re", "D3", 146.83, "4ª"], ["Sol", "G3", 196.0, "3ª"], ["Si", "B3", 246.94, "2ª"], ["Mi", "E4", 329.63, "1ª"]]}}]},
  {"h2": "Antes de empezar", "bloques": [{"lista": [
   ["Conoce la clavija de cada cuerda.", "Sigue la cuerda desde el puente hasta la cabeza para no girar la que no es."],
   ["Apretar sube la nota y aflojar la baja.", "Gira poco, un cuarto de vuelta o menos, y vuelve a tocar."],
   ["Afina subiendo.", "Si te pasaste, afloja abajo de la nota y vuelve a subir. Así la cuerda se queda en su lugar."]]}]},
  {"h2": "Forma 1. Con afinador", "bloques": [{"pasos": ["Enciende el micrófono en el afinador de arriba.", "Toca la sexta cuerda, la más gruesa, al aire.",
   "Gira la clavija hasta que la aguja quede al centro y diga Mi.", "Repite con La, Re, Sol, Si y Mi.", "Da una segunda vuelta, porque al tensar una cuerda las otras se mueven un poco."]}]},
  {"h2": "Forma 2. De oído, con el traste 5", "bloques": [
   "Sirve cuando no tienes afinador. Sólo necesitas que la sexta cuerda esté bien.",
   {"pasos": ["Pisa la sexta cuerda en el traste 5. Esa nota es La.", "Toca la quinta cuerda al aire y gírala hasta que suene igual.",
              "Pisa la quinta en el traste 5 y afina la cuarta al aire, Re.", "Pisa la cuarta en el traste 5 y afina la tercera al aire, Sol.",
              "Pisa la tercera en el traste 4, no en el 5, y afina la segunda al aire, Si.", "Pisa la segunda en el traste 5 y afina la primera al aire, Mi."]},
   "La única excepción es la segunda cuerda, que se compara con el traste 4. Si dos notas suenan con un temblor, todavía no están iguales."]},
  {"h2": "Forma 3. Con notas de referencia", "bloques": ["En el afinador de arriba, toca el botón de cada cuerda. Suena su nota y la imitas girando la clavija.",
   "Es la forma de entrenar el oído. Con el tiempo reconoces cuando una cuerda está un poco baja."]},
  {"h2": "Si se desafina sola", "bloques": [{"lista": [
   ["Cuerdas nuevas.", "Estiran durante los primeros días. Afínalas varias veces antes de tocar."],
   ["Cambios de clima.", "El calor y la humedad mueven la madera y las cuerdas."],
   ["Clavijas flojas.", "Si una cuerda baja siempre, revisa que la clavija no esté floja."]]}]}],
 "faq": [{"q": "¿Cuáles son las notas de la guitarra?", "a": "Mi, La, Re, Sol, Si, Mi, de la sexta cuerda a la primera."},
         {"q": "¿Se puede afinar sin afinador?", "a": "Sí. Con el método del traste 5, si tienes una cuerda de referencia bien afinada."},
         {"q": "¿Cada cuánto afino?", "a": "Cada vez que vayas a tocar. Toma un minuto con el afinador."}],
 "fuentes": [{"t": "Standard tuning, Wikipedia", "url": "https://en.wikipedia.org/wiki/Standard_tuning"}] + fuente_frec(),
 "hermanas": ["afinador-de-guitarra", "acordes-de-guitarra-para-principiantes", "como-tocar-guitarra", "canciones-faciles-en-guitarra", "afinador-de-ukulele"]})
print("lote 2: afinadores")
