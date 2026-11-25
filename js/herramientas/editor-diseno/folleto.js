// Diseños de arranque: folleto tríptico (hoja carta horizontal, exterior e interior).
// Exterior: [solapa | contraportada | portada]. Interior: [nosotros | servicios | servicios].
import { renglones, partir, lista } from './_piezas.js';

const campos = [
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'titulo', etiqueta: 'Título de portada', tipo: 'area', filas: 2 },
  { id: 'lema', etiqueta: 'Frase de portada' },
  { id: 'nosotros', etiqueta: 'Quiénes somos', tipo: 'area', filas: 4 },
  { id: 'servicios', etiqueta: 'Servicios', tipo: 'area', filas: 5, ayuda: 'Uno por renglón: Nombre | descripción corta' },
  { id: 'beneficios', etiqueta: 'Por qué elegirnos (uno por renglón)', tipo: 'area', filas: 3 },
  { id: 'horario', etiqueta: 'Horario' },
  { id: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
  { id: 'whatsapp', etiqueta: 'WhatsApp', tipo: 'tel' },
  { id: 'correo', etiqueta: 'Correo' },
  { id: 'web', etiqueta: 'Página o red social' },
  { id: 'direccion', etiqueta: 'Dirección', tipo: 'area', filas: 2 },
];

const T = { nosotros: 'Quiénes somos', servicios: 'Lo que hacemos', beneficios: 'Por qué elegirnos', contacto: 'Visítanos' };

// Arma las dos caras con un estilo. e: {cab: 'banda'|'linea'|'numero', portada: 'bloque'|'foto'|'aire'|'circulo'}
function triptico(e) {
  return (k) => {
    const { W, H, u, p } = k;
    const pw = W / 3, m = u * 6;
    const claroDe = (c) => (k.oscuro(c) ? '#FFFFFF' : '#151515');
    const cabeza = (x, y, texto, n) => {
      const w = pw - 2 * m;
      if (e.cab === 'banda') return [k.R(x - m, y - u * 3, pw, u * 10, p.suave), k.X(texto, { x, y, w, tam: u * 4, fuente: 'extra', mayus: true, espaciado: 120, color: claroDe(p.suave), maxLineas: 1 })];
      if (e.cab === 'numero') return [k.X(String(n).padStart(2, '0'), { x, y, tam: u * 9, fuente: 'titulo', color: p.acento }), k.X(texto, { x, y: y + u * 12, w, tam: u * 5.4, fuente: 'titulo', maxLineas: 1 })];
      return [k.X(texto, { x, y, w, tam: u * 5.6, fuente: 'titulo', maxLineas: 1 }), k.R(x, y + u * 8, u * 10, u * 0.8, p.acento)];
    };
    const desde = e.cab === 'banda' ? u * 13 : e.cab === 'numero' ? u * 26 : u * 15;
    const guias = [{ x1: pw, y1: 0, x2: pw, y2: H }, { x1: 2 * pw, y1: 0, x2: 2 * pw, y2: H }];

    // ---- exterior ----
    const ext = [];
    // solapa: beneficios
    const xa = m;
    ext.push(...cabeza(xa, m, T.beneficios, 3));
    ext.push(...lista(k, { x: xa, y: m + desde, w: pw - 2 * m, tam: u * 3.6, campo: 'beneficios', color: p.tinta, colorMarca: p.acento, marca: e.cab === 'numero' ? 'raya' : 'punto', sep: u * 3 }).el);
    // contraportada: contacto
    const xb = pw + m;
    ext.push(...cabeza(xb, m, T.contacto, 4));
    const c = k.contactos({ x: xb, y: m + desde, w: pw - 2 * m, tam: u * 3.3, color: p.tinta, colorIco: p.acento, campos: ['telefono', 'whatsapp', 'correo', 'web', 'direccion', 'horario'], sep: u * 2.2, maxLineas: 3 });
    ext.push(...c.el);
    ext.push(k.Q(xb, Math.max(c.y + u * 4, H - m - u * 26), u * 22));
    // portada
    const xc = 2 * pw;
    const tinta = e.portada === 'bloque' ? claroDe(p.acento) : p.tinta;
    if (e.portada === 'bloque') ext.push(k.R(xc, 0, pw, H, p.acento));
    if (e.portada === 'foto') ext.push(k.foto ? k.I('foto', xc, 0, pw, H * 0.48) : k.R(xc, 0, pw, H * 0.48, p.suave));
    if (e.portada === 'circulo') ext.push(k.foto ? k.I('foto', xc + pw / 2 - u * 22, u * 18, u * 44, u * 44, { radio: 'circulo' }) : k.E(xc + pw / 2 - u * 22, u * 18, u * 44, u * 44, p.suave));
    const centrado = e.portada === 'aire' || e.portada === 'circulo';
    const al = centrado ? 'centro' : 'izq';
    const yLogo = e.portada === 'foto' ? H * 0.48 + m : m + u * 2;
    ext.push(k.logo ? k.I('logo', xc + m, yLogo, pw - 2 * m, u * (e.portada === 'circulo' ? 9 : 14), { ax: centrado ? 0.5 : 0, ay: 0 }) : k.T('negocio', { x: xc + m, y: yLogo, w: pw - 2 * m, tam: u * 3.8, fuente: 'extra', mayus: true, espaciado: 140, alin: al, color: e.portada === 'bloque' ? tinta : p.acento, maxLineas: 2 }));
    const yt = e.portada === 'foto' ? H * 0.48 + m + u * 13 : e.portada === 'circulo' ? u * 67 : H * 0.4;
    const port = [
      k.T('titulo', { x: xc + m, w: pw - 2 * m, tam: u * 9, fuente: 'titulo', maxLineas: 4, interlinea: 1.02, alin: al, color: tinta, h: H - yt - m - u * 18, sep: u * 4 }),
      k.T('lema', { x: xc + m, w: pw - 2 * m, tam: u * 3.6, alin: al, color: e.portada === 'bloque' ? tinta : k.mezclar(p.tinta, p.fondo, 0.3), maxLineas: 3 }),
    ];
    k.flujo(yt, port);
    ext.push(...port);

    // ---- interior ----
    const int = [];
    int.push(...cabeza(m, m, T.nosotros, 1));
    int.push(k.T('nosotros', { x: m, y: m + desde, w: pw - 2 * m, tam: u * 3.6, maxLineas: 18, interlinea: 1.45, h: H - m * 2 - desde - u * 30 }));
    if (k.foto && e.portada !== 'foto') int.push(k.I('foto', m, H - m - u * 40, pw - 2 * m, u * 40));
    const sv = renglones(k.d.servicios).map(partir);
    const mitad = Math.ceil(sv.length / 2);
    int.push(...cabeza(pw + m, m, T.servicios, 2));
    [sv.slice(0, mitad), sv.slice(mitad)].forEach((grupo, j) => {
      const x = pw * (1 + j) + m;
      int.push(...k.encajar((z) => {
        const out = [];
        let y = m + desde;
        grupo.forEach(([nombre, desc]) => {
          const a = k.X(nombre, { x, y, w: pw - 2 * m, tam: u * 4.4 * z, fuente: 'extra', color: p.acento, id: 'servicios', campo: 'servicios', maxLineas: 2 });
          const ha = k.medir(a).h;
          const b = k.X(desc, { x, y: y + ha + u * 1.2 * z, w: pw - 2 * m, tam: u * 3.3 * z, id: 'servicios', campo: 'servicios', maxLineas: 4, interlinea: 1.35 });
          out.push(a, b);
          y += ha + u * 1.2 * z + (b ? k.medir(b).h : 0) + u * 6 * z;
        });
        return { el: out, y };
      }, H - m - u * 4));
    });
    if (e.portada === 'bloque') int.push(k.R(2 * pw, H - u * 4, pw, u * 4, p.acento), k.R(0, H - u * 4, pw, u * 4, p.acento));
    return [{ nombre: 'Exterior', el: ext, guias }, { nombre: 'Interior', el: int, guias }];
  };
}

export default {
  archivo: 'folleto',
  formatos: [{ id: 'carta', nombre: 'Tríptico carta', ancho: 279.4, alto: 215.9, u: 'mm' }],
  caras: ['Exterior', 'Interior'],
  campos,
  imagenes: ['logo', 'foto'],
  qr: true,
  disenos: [
    {
      id: 'clinica', nombre: 'Clínica',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#1D3340', acento: '#1F8A8A', suave: '#E3F2F1' },
      ejemplo: {
        negocio: 'Clínica Dental Sonríe', titulo: 'Tu sonrisa en manos de especialistas', lema: 'Atención para toda la familia en Querétaro',
        nosotros: 'Somos un equipo de cuatro dentistas con especialidad. Atendemos desde 2011 en el centro de Querétaro. Cada tratamiento empieza con una revisión completa y un presupuesto por escrito.',
        servicios: 'Limpieza dental | Revisión y limpieza con ultrasonido en una sola cita\nOrtodoncia | Brackets metálicos, estéticos y alineadores\nEndodoncia | Tratamiento de conductos con anestesia local\nImplantes | Valoración con radiografía panorámica\nBlanqueamiento | Resultados en una o dos sesiones\nOdontopediatría | Atención para niños desde el primer diente',
        beneficios: 'Presupuesto por escrito antes de empezar\nPagos a meses con tarjeta\nEstacionamiento para pacientes\nCitas en sábado',
        horario: 'Lunes a sábado de 9:00 a 19:00', telefono: '442 212 4480', whatsapp: '442 318 7702', correo: 'citas@clinicasonrie.mx', direccion: 'Av. Zaragoza 108, Centro, Querétaro',
      },
      dibujar: triptico({ cab: 'linea', portada: 'foto' }),
    },
    {
      id: 'restaurante', nombre: 'Restaurante',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F6EFE3', tinta: '#2F241C', acento: '#9B2C2C', suave: '#E9DCC7' },
      ejemplo: {
        negocio: 'Fonda Las Cazuelas', titulo: 'Cocina de Oaxaca en el centro de Puebla', lema: 'Banquetes para 20 a 200 personas',
        nosotros: 'Abrimos en 2008 con las recetas de la abuela Tomasa. Hacemos el mole, las tlayudas y las tortillas en casa todos los días. Atendemos comidas familiares, bautizos y eventos de empresa.',
        servicios: 'Comida corrida | De lunes a viernes, con sopa, guisado y agua\nMole negro | Por kilo o en porciones para eventos\nTlayudas | Con tasajo, cecina o chorizo\nBanquetes | Menú de tres tiempos con meseros\nPedidos | Entregas en oficinas del centro',
        beneficios: 'Ingredientes traídos de Oaxaca\nSalón privado para 60 personas\nFactura electrónica',
        horario: 'Martes a domingo de 13:00 a 21:00', telefono: '222 246 1180', whatsapp: '222 390 4421', web: '@fondalascazuelas', direccion: 'Calle 3 Sur 702, Centro, Puebla',
      },
      dibujar: triptico({ cab: 'banda', portada: 'bloque' }),
    },
    {
      id: 'despacho', nombre: 'Despacho',
      fuentes: { titulo: 'instrument', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FBFAF7', tinta: '#1B2230', acento: '#7A5C2E', suave: '#ECE6DA' },
      ejemplo: {
        negocio: 'Contadores Ibarra & Asociados', titulo: 'Contabilidad y declaraciones sin multas', lema: 'Personas físicas, RESICO y empresas',
        nosotros: 'Llevamos la contabilidad de 180 clientes en Monterrey y su zona metropolitana. Te asignamos un contador fijo que conoce tu negocio. Recibes cada mes un resumen claro de lo que pagaste y por qué.',
        servicios: 'Contabilidad mensual | Registro, declaraciones y acuse cada mes\nDeclaración anual | Personas físicas y morales\nNómina | Recibos timbrados y cálculo de cuotas IMSS\nFacturación | Te ayudamos a emitir y cancelar CFDI\nTrámites SAT | e.firma, constancia y aclaraciones',
        beneficios: 'Un contador fijo para tu cuenta\nReporte mensual por WhatsApp\nCitas en línea o en oficina',
        horario: 'Lunes a viernes de 9:00 a 18:00', telefono: '81 8344 2190', whatsapp: '81 1290 7743', correo: 'hola@ibarracontadores.mx', direccion: 'Av. Constitución 2050, Obispado, Monterrey',
      },
      dibujar: triptico({ cab: 'numero', portada: 'aire' }),
    },
    {
      id: 'escuela', nombre: 'Escuela',
      fuentes: { titulo: 'bricolage', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFFFFF', tinta: '#22223B', acento: '#F2545B', suave: '#FFE8D6' },
      ejemplo: {
        negocio: 'Escuela de Música Allegro', titulo: 'Aprende a tocar desde la primera clase', lema: 'Niños desde 5 años, jóvenes y adultos',
        nosotros: 'Somos una escuela de música en Mérida con 12 maestros titulados. Las clases son individuales o en grupos de cuatro. Cada semestre damos un recital para que los alumnos toquen en público.',
        servicios: 'Guitarra | Acústica y eléctrica, desde cero\nPiano | Lectura de partitura y repertorio\nCanto | Técnica vocal y respiración\nBatería | Ritmo y coordinación\nViolín | Clases individuales de 45 minutos',
        beneficios: 'Clase muestra sin costo\nInstrumentos para practicar en la escuela\nRecital cada semestre',
        horario: 'Lunes a sábado de 10:00 a 20:00', telefono: '999 925 4410', whatsapp: '999 340 1188', web: 'allegromerida.mx', direccion: 'Calle 47 número 512, Centro, Mérida',
      },
      dibujar: triptico({ cab: 'banda', portada: 'circulo' }),
    },
  ],
};
