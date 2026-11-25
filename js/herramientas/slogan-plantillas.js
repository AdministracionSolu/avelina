// Plantillas del generador de slogans de Avelina (español de México, escritas aquí, no traducidas).
// Se carga bajo demanda desde slogan.js. Marcas: {N} nombre, {C} ciudad, {cosa}, {lugar}, {fav}, {arte}
// y las del beneficio: {sust} (sin artículo), {art} (con artículo), {frase}, {tu}, {verbo}, {mas}, {menos}, {adj}, {pregunta}.
// Una plantilla con {N} o {C} sólo sale si se escribió el nombre o la ciudad.
// «a,b|texto» limita la plantilla a esos beneficios.

export const BENEFICIOS = {
  rapidez: { etiqueta: 'Rapidez', sust: 'rapidez', art: 'la rapidez', frase: 'en minutos', tu: 'no esperas', verbo: 'te atiende rápido', mas: 'rapidez', menos: 'espera', adj: 'rápido', pregunta: '¿Tienes prisa?' },
  precio: { etiqueta: 'Buen precio', sust: 'precio justo', art: 'el precio justo', frase: 'a buen precio', tu: 'pagas lo justo', verbo: 'cuida tu bolsillo', mas: 'ahorro', menos: 'gasto', pregunta: '¿Buscas buen precio?' },
  calidad: { etiqueta: 'Calidad', sust: 'calidad', art: 'la calidad', frase: 'bien hecho', tu: 'recibes lo mejor', verbo: 'hace las cosas bien', mas: 'calidad', menos: 'pretextos', adj: 'bueno', pregunta: '¿Quieres lo mejor?' },
  sabor: { etiqueta: 'Sabor', sust: 'sabor de verdad', art: 'el sabor de verdad', frase: 'con sabor de casa', tu: 'comes rico', verbo: 'cocina con ganas', mas: 'sabor', menos: 'prisa', adj: 'rico', pregunta: '¿Se te antojó?' },
  atencion: { etiqueta: 'Buena atención', sust: 'buen trato', art: 'el buen trato', frase: 'con buen trato', tu: 'te sientes en casa', verbo: 'te recibe con gusto', mas: 'atención', menos: 'filas', adj: 'amable', pregunta: '¿Buscas quién te atienda bien?' },
  cercania: { etiqueta: 'Cerca de ti', sust: 'cercanía', art: 'la cercanía', frase: 'cerca de casa', tu: 'lo tienes a la vuelta', verbo: 'está a la vuelta', mas: 'cercanía', menos: 'vueltas', pregunta: '¿Lo necesitas ya?' },
  tradicion: { etiqueta: 'Tradición', sust: 'tradición', art: 'la tradición', frase: 'de toda la vida', tu: 'vuelves a lo de siempre', verbo: 'guarda la receta de siempre', mas: 'tradición', menos: 'modas', pregunta: '¿Extrañas lo de antes?' },
  frescura: { etiqueta: 'Fresco del día', sust: 'frescura', art: 'lo fresco', frase: 'fresco cada día', tu: 'llevas lo del día', verbo: 'surte fresco cada mañana', mas: 'frescura', menos: 'congelador', adj: 'fresco', pregunta: '¿Lo quieres fresco?' },
  variedad: { etiqueta: 'Variedad', sust: 'variedad', art: 'la variedad', frase: 'con mucho para escoger', tu: 'encuentras lo que buscas', verbo: 'tiene de todo', mas: 'opciones', menos: 'vueltas', pregunta: '¿Buscas algo en especial?' },
  estilo: { etiqueta: 'Estilo', sust: 'estilo propio', art: 'el estilo', frase: 'con estilo', tu: 'te ves como quieres', verbo: 'cuida tu estilo', mas: 'estilo', menos: 'esfuerzo', adj: 'bonito', pregunta: '¿Quieres verte bien?' },
  confianza: { etiqueta: 'Confianza', sust: 'confianza', art: 'la confianza', frase: 'de confianza', tu: 'vas a la segura', verbo: 'cumple lo que promete', mas: 'confianza', menos: 'dudas', pregunta: '¿Buscas a alguien de confianza?' },
  domicilio: { etiqueta: 'Servicio a domicilio', sust: 'comodidad', art: 'la comodidad', frase: 'hasta tu puerta', tu: 'lo recibes en casa', verbo: 'te lo lleva a casa', mas: 'comodidad', menos: 'vueltas', pregunta: '¿No quieres salir?' },
  mano: { etiqueta: 'Hecho a mano', sust: 'detalle', art: 'el detalle', frase: 'hecho a mano', tu: 'llevas algo único', verbo: 'cuida cada detalle', mas: 'detalle', menos: 'prisa', adj: 'único', pregunta: '¿Buscas algo único?' },
};

// Plantillas por tono. Cada una se arma con un beneficio y el giro.
export const PLANTILLAS = {
  cercano: [
    'Aquí {tu}.', 'Como en casa, {frase}.', 'Tu {cosa}, {frase}.', 'Tu lugar de siempre, {frase}.', 'En {N} {tu}.',
    '{N}, tu {cosa} {frase}.', 'Pásale, aquí {tu}.', 'Hecho para ti, {frase}.', '{Lugar} de tu colonia, {frase}.',
    '{Lugar} de la familia en {C}.', 'Tus vecinos de {C} ya lo saben, aquí {tu}.',
  ],
  directo: [
    '{Sust}. Siempre.', '{Frase}. Sin vueltas.', 'Más {mas}, menos {menos}.', '{N}. {Verbo}.', '{Sust} que se nota.',
    'Tu {cosa}, {frase}. Así de fácil.', '{Frase}, cada día.', 'precio,rapidez,sabor,frescura,domicilio,atencion,calidad|En {C}, {frase}.', '{N}. {Sust} en {C}.',
  ],
  divertido: [
    '{Pregunta} Aquí {tu}.', 'Tan {adj} que vas a volver.', '{Sust} pa’ todos.', 'Ni le busques, aquí {tu}.',
    'Más {mas}, menos {menos} y cero pretextos.', 'Ya te la sabes, {N} {verbo}.', '{Pregunta} Ya sabes dónde.',
    'Tu {cosa} y tú, amor a primera vista.',
    'Si es en {C}, es con {N}.', 'Te va a gustar, {frase}.',
  ],
  elegante: [
    'calidad,mano,estilo,atencion|{Sust} en cada detalle.', 'El arte de {arte}.', 'calidad,sabor,atencion|{N}. {Sust} con estilo.', 'Donde {art} es costumbre.',
    '{Frase}, con elegancia.', 'Para quien sabe elegir.', '{N}, el arte de {arte}.', 'Lo mejor de {C}, {frase}.',
    'Detalles que se notan.',
  ],
  tradicional: [
    'confianza,precio,sabor,atencion,calidad,mano,frescura|Desde siempre, {frase}.', '{Lugar} de siempre, {frase}.', 'Tradición que se nota.',
    'Hecho como se hacía antes.', '{Lugar} de confianza en {C}.', 'Tu {cosa} de toda la vida.',
    'De {C} para tu mesa.', 'Con la receta de siempre.', 'precio,sabor,atencion|Lo de siempre, {frase}.', '{Lugar} {fav} de {C}.',
    'Generaciones que confían en {N}.', 'Como lo hacía la abuela.',
  ],
};

// Plantillas que sólo aplican a giros de comida.
export const SOLO_COMIDA = new Set(['De {C} para tu mesa.', 'Con la receta de siempre.', 'Como lo hacía la abuela.']);

// Por giro: cosa (lo que llevas), lugar [frase, género], arte (para «el arte de…»), beneficios que aplican
// y slogans escritos a mano por tono.
export const GIROS = {
  general: {
    etiqueta: 'Empresa o negocio en general', cosa: 'proyecto', lugar: ['el equipo', 'm'], arte: 'hacer bien las cosas', comida: false,
    beneficios: ['calidad', 'confianza', 'rapidez', 'atencion', 'precio', 'cercania'],
    propios: {
      cercano: ['Contigo en cada paso.', 'Tu negocio en buenas manos.', 'Trabajamos como si fuera nuestro.'],
      directo: ['Lo prometido, cumplido.', 'Resultados, no promesas.', 'Hacemos que pase.'],
      divertido: ['Nosotros le sabemos, tú relájate.', 'Problema que llega, problema que se va.'],
      elegante: ['Precisión en cada entrega.', 'Excelencia sin exceso.', 'Hecho con criterio.'],
      tradicional: ['Palabra que se cumple.', 'Años de trabajo bien hecho.', 'La seriedad de siempre.'],
    },
  },
  tiendas: {
    etiqueta: 'Tienda o abarrotes', cosa: 'mandado', lugar: ['la tiendita', 'f'], arte: 'tener lo que buscas', comida: false,
    beneficios: ['cercania', 'precio', 'variedad', 'atencion', 'frescura', 'domicilio'],
    propios: {
      cercano: ['Tu tiendita de la cuadra.', 'Aquí te conocemos por tu nombre.', 'Lo que te faltó, aquí está.'],
      directo: ['Todo para tu casa, en tu cuadra.', 'Abierto cuando lo necesitas.', 'Surtido completo, precio justo.'],
      divertido: ['Se te olvidó algo, ¿verdad?', 'El mandado sin salir de la colonia.', 'Fiado no, pero sí buen precio.'],
      elegante: ['Lo esencial, bien escogido.', 'Tu despensa, cuidada.'],
      tradicional: ['La tienda de la esquina, como siempre.', 'Atendiendo a la colonia por generaciones.'],
    },
  },
  ropa: {
    etiqueta: 'Tienda de ropa', cosa: 'estilo', lugar: ['la tienda', 'f'], arte: 'vestir bien', comida: false,
    beneficios: ['estilo', 'precio', 'calidad', 'variedad', 'atencion', 'mano'],
    propios: {
      cercano: ['Ropa que se siente tuya.', 'Vístete como eres.', 'Para cada día y cada ocasión.'],
      directo: ['Moda que te queda.', 'Tu talla, tu estilo, tu precio.', 'Estrena cada semana.'],
      divertido: ['El clóset lleno y la cartera contenta.', 'Te ves increíble, nomás decimos.', 'Nada que ponerte, se acabó.'],
      elegante: ['Elegancia que se lleva puesta.', 'Prendas con carácter.', 'Viste tu mejor versión.'],
      tradicional: ['Calidad que dura temporadas.', 'La moda de siempre, a tu medida.'],
    },
  },
  restaurante: {
    etiqueta: 'Restaurante o fonda', cosa: 'comida', lugar: ['la cocina', 'f'], arte: 'cocinar con calma', comida: true,
    beneficios: ['sabor', 'tradicion', 'precio', 'atencion', 'frescura', 'domicilio'],
    propios: {
      cercano: ['Sabor de casa, lejos de casa.', 'Siéntate, ya estás en casa.', 'La comida que extrañabas.'],
      directo: ['Comida casera, todos los días.', 'Buen sazón, buen precio.', 'Del comal a tu mesa.'],
      divertido: ['Barriga llena, corazón contento.', 'Ven con hambre, sal rodando.', 'Aquí la dieta empieza el lunes.'],
      elegante: ['Cocina con alma.', 'El sabor del tiempo.', 'Ingredientes nobles, cocina honesta.'],
      tradicional: ['El sazón de la abuela.', 'Recetas que pasan de mano en mano.', 'Como en el pueblo.'],
    },
  },
  polleria: {
    etiqueta: 'Pollería o pollos asados', cosa: 'pollo', lugar: ['la pollería', 'f'], arte: 'asar con paciencia', comida: true,
    beneficios: ['sabor', 'frescura', 'precio', 'rapidez', 'tradicion', 'domicilio'],
    propios: {
      cercano: ['El pollo del domingo, todos los días.', 'Pollo doradito para toda la familia.', 'Tu comida resuelta.'],
      directo: ['Pollo fresco, asado al momento.', 'Dorado al carbón, como en casa.', 'Al carbón, como debe ser.'],
      divertido: ['Pollo tan rico que te chupas los dedos.', 'Aquí el que manda es el pollo.', 'Hoy no cocinas, hoy hay pollo.'],
      elegante: ['El arte del buen asado.', 'Brasa, tiempo y sazón.'],
      tradicional: ['Adobado con la receta de la casa.', 'Al carbón, como antes.', 'Sabor de leña y tradición.'],
    },
  },
  barberia: {
    etiqueta: 'Barbería', cosa: 'corte', lugar: ['la barbería', 'f'], arte: 'un buen corte', comida: false,
    beneficios: ['estilo', 'atencion', 'precio', 'rapidez', 'calidad', 'tradicion'],
    propios: {
      cercano: ['Tu silla te espera.', 'Sales nuevo, entras como amigo.', 'Corte, plática y buen ambiente.'],
      directo: ['Corte limpio, barba perfecta.', 'Navaja, tijera y precisión.', 'Te ves bien, te sientes mejor.'],
      divertido: ['Pelo largo, problema corto.', 'Aquí no hay pelos en la lengua.', 'Barba que da envidia.'],
      elegante: ['El oficio del caballero.', 'Precisión en cada detalle.', 'Estilo al filo de la navaja.'],
      tradicional: ['Barbería como las de antes.', 'Navaja caliente y toalla tibia.', 'El oficio de siempre.'],
    },
  },
  'salon-de-belleza': {
    etiqueta: 'Salón de belleza o estética', cosa: 'look', lugar: ['el salón', 'm'], arte: 'consentirte', comida: false,
    beneficios: ['estilo', 'atencion', 'calidad', 'precio', 'confianza', 'mano'],
    propios: {
      cercano: ['Un rato para ti.', 'Sal sintiéndote tú.', 'Tu momento de consentirte.'],
      directo: ['Cabello, uñas y pestañas en un solo lugar.', 'Belleza que se nota.', 'Agenda hoy, brilla mañana.'],
      divertido: ['Despeinada nunca más.', 'Tu espejo nos va a agradecer.', 'Uñas listas para presumir.'],
      elegante: ['Belleza en cada detalle.', 'El arte de consentirte.', 'Elegancia que se nota.'],
      tradicional: ['La estética de confianza del barrio.', 'Manos expertas desde siempre.'],
    },
  },
  'comida-rapida': {
    etiqueta: 'Comida rápida, tacos o antojitos', cosa: 'antojo', lugar: ['el puesto', 'm'], arte: 'antojar', comida: true,
    beneficios: ['rapidez', 'sabor', 'precio', 'domicilio', 'frescura', 'atencion'],
    propios: {
      cercano: ['Tu antojo de cada día.', 'La parada obligada del barrio.', 'Para el antojo de media tarde.'],
      directo: ['Rápido, rico y bien servido.', 'Antojo resuelto en minutos.', 'Hecho al momento, para llevar.'],
      divertido: ['Con todo, ¿verdad?', 'Uno nunca es suficiente.', 'Échale salsa a tu día.', 'Hambre que llega, hambre que se va.'],
      elegante: ['Comida rápida, sabor sin prisa.', 'Antojo de autor.'],
      tradicional: ['Antojitos como en la feria.', 'La salsa de la casa, de siempre.'],
    },
  },
  variedades: {
    etiqueta: 'Tienda de variedades (de todo)', cosa: 'regalo', lugar: ['la tienda', 'f'], arte: 'encontrar de todo', comida: false,
    beneficios: ['variedad', 'precio', 'cercania', 'atencion', 'calidad', 'mano'],
    propios: {
      cercano: ['Lo que buscas está aquí.', 'Un detalle para cada quien.', 'Tu tienda de todo, a la vuelta.'],
      directo: ['De todo, en un solo lugar.', 'Si no está aquí, no existe.', 'Mil cosas a buen precio.'],
      divertido: ['Entras por una cosa y sales con diez.', 'Aquí hay de todo, hasta lo que no sabías.', 'Te advertimos, es difícil irse.'],
      elegante: ['Detalles que enamoran.', 'Lo bonito, bien escogido.'],
      tradicional: ['La tienda de todo, como antes.', 'Variedad de siempre en tu barrio.'],
    },
  },
};
