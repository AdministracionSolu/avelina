// Diseños de arranque: tarjeta de presentación (9 × 5 cm, frente y reverso).
// Coordenadas pensadas en milímetros de una tarjeta de 90 × 50; s escala a cualquier medida.

const campos = [
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'nombre', etiqueta: 'Tu nombre' },
  { id: 'puesto', etiqueta: 'Puesto o especialidad' },
  { id: 'lema', etiqueta: 'Frase corta', ayuda: 'Lo que haces en pocas palabras.' },
  { id: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
  { id: 'whatsapp', etiqueta: 'WhatsApp', tipo: 'tel' },
  { id: 'correo', etiqueta: 'Correo' },
  { id: 'web', etiqueta: 'Página web o red social' },
  { id: 'direccion', etiqueta: 'Dirección', tipo: 'area', filas: 2 },
];

const iniciales = (s) => String(s || '').replace(/^(lic|dra?|ing|arq|mtro|mtra)\.?\s+/i, '').split(/\s+/).filter((w) => w.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default {
  archivo: 'tarjeta',
  formatos: [
    { id: 'tarjeta', nombre: '9 × 5 cm', ancho: 90, alto: 50, u: 'mm' },
    { id: 'digital', nombre: 'Para WhatsApp', ancho: 1080, alto: 600, u: 'px' },
  ],
  caras: ['Frente', 'Reverso'],
  campos,
  imagenes: ['logo'],
  qr: true,
  qrAtras: true,
  hoja: true,
  disenos: [
    {
      id: 'despacho', nombre: 'Despacho',
      fuentes: { titulo: 'cinzel', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FBFAF7', tinta: '#1B2230', acento: '#8A6A3B', suave: '#ECE7DD' },
      ejemplo: {
        negocio: 'Arriaga & Leal', nombre: 'Lic. Mariana Leal Ortiz', puesto: 'Abogada litigante', lema: 'Derecho familiar y civil',
        telefono: '33 1847 2290', correo: 'mleal@arriagaleal.mx', web: 'arriagaleal.mx', direccion: 'Av. Chapultepec 480, piso 3\nGuadalajara, Jal.',
      },
      dibujar(k) {
        const s = k.W / 90, p = k.p;
        const frente = [
          k.R(0, 0, 2.2 * s, k.H, p.acento),
          k.logo ? k.I('logo', 9 * s, 8 * s, 22 * s, 12 * s, { ax: 0 }) : k.T('negocio', { x: 9 * s, y: 9 * s, w: 70 * s, tam: 5 * s, fuente: 'titulo', espaciado: 60, maxLineas: 2, color: p.tinta }),
          k.T('lema', { x: 9 * s, y: 23 * s, w: 70 * s, tam: 2.3 * s, color: p.acento, espaciado: 40 }),
          k.T('nombre', { x: 9 * s, y: 42 * s, vy: 'abajo', w: 72 * s, tam: 3.1 * s, fuente: 'extra', maxLineas: 1 }),
          k.T('puesto', { x: 9 * s, y: 44.2 * s, w: 72 * s, tam: 2.3 * s, color: k.mezclar(p.tinta, p.fondo, 0.35) }),
        ];
        const qr = k.Q(64 * s, 8 * s, 18 * s);
        const c = k.contactos({ x: 9 * s, y: 9 * s, w: (qr ? 50 : 72) * s, tam: 2.35 * s, color: p.tinta, colorIco: p.acento, sep: 1.6 * s });
        const reverso = [
          k.R(0, 0, k.W, k.H, p.suave),
          ...c.el, qr,
          k.T('negocio', { x: 9 * s, y: 44 * s, vy: 'abajo', w: 72 * s, tam: 2.2 * s, fuente: 'titulo', espaciado: 120, color: p.acento, id: 'negocio2' }),
        ];
        return [{ el: frente }, { el: reverso }];
      },
    },
    {
      id: 'ferreteria', nombre: 'Ferretería',
      fuentes: { titulo: 'archivo-angosta', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F5F1E8', tinta: '#141414', acento: '#F2B705', suave: '#141414' },
      ejemplo: {
        negocio: 'Ferretería La Tuerca', nombre: 'Jorge Villaseñor', puesto: 'Pedidos y cotizaciones', lema: 'Material eléctrico, plomería y herramienta',
        telefono: '81 8354 1172', whatsapp: '81 1290 4418', direccion: 'Calz. Madero 1120, Centro\nMonterrey, N.L.',
      },
      dibujar(k) {
        const s = k.W / 90, p = k.p;
        const banda = 21 * s;
        const frente = [
          k.R(0, k.H - banda, k.W, banda, p.acento),
          k.logo ? k.I('logo', 6 * s, 6 * s, 20 * s, 14 * s, { ax: 0, ay: 0 }) : null,
          k.T('nombre', { x: 6 * s, y: (k.logo ? 23 : 7) * s, w: 60 * s, tam: 3.4 * s, fuente: 'extra', maxLineas: 1 }),
          k.T('puesto', { x: 6 * s, y: (k.logo ? 27.6 : 11.6) * s, w: 60 * s, tam: 2.3 * s, color: k.mezclar(p.tinta, p.fondo, 0.3) }),
          k.T('negocio', { x: 6 * s, y: k.H - banda / 2, vy: 'centro', w: 78 * s, tam: 7.4 * s, fuente: 'titulo', mayus: true, maxLineas: 1, color: k.oscuro(p.acento) ? '#FFFFFF' : '#141414' }),
        ];
        const qr = k.Q(66 * s, 6 * s, 18 * s, { sobre: p.suave });
        const claro = k.oscuro(p.suave) ? '#F5F1E8' : '#141414';
        const c = k.contactos({ x: 6 * s, y: 7 * s, w: (qr ? 56 : 78) * s, tam: 2.5 * s, color: claro, colorIco: p.acento, sep: 1.7 * s });
        const reverso = [
          k.R(0, 0, k.W, k.H, p.suave),
          ...c.el, qr,
          k.T('lema', { x: 6 * s, y: 44 * s, vy: 'abajo', w: 78 * s, tam: 2.4 * s, color: p.acento, fuente: 'extra', maxLineas: 2 }),
        ];
        return [{ el: frente }, { el: reverso, fondo: p.suave }];
      },
    },
    {
      id: 'taqueria', nombre: 'Taquería',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F3EAD8', tinta: '#2A1A12', acento: '#B3261E', suave: '#B3261E' },
      ejemplo: {
        negocio: 'Tacos El Güero', lema: 'Pastor y suadero desde 1987', nombre: 'Ramón Ochoa', puesto: 'Pedidos para eventos',
        telefono: '222 241 3380', whatsapp: '222 118 6570', direccion: 'Calle 5 de Mayo 214, Centro\nPuebla, Pue.',
      },
      dibujar(k) {
        const s = k.W / 90, p = k.p;
        const frente = [
          k.logo ? k.I('logo', 35 * s, 5 * s, 20 * s, 12 * s) : k.E(41 * s, 6 * s, 8 * s, 8 * s, p.acento),
          k.T('negocio', { x: 8 * s, y: 26 * s, vy: 'centro', w: 74 * s, tam: 9 * s, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 1 }),
          k.L(36 * s, 37 * s, 54 * s, 37 * s, p.acento, 0.35 * s),
          k.T('lema', { x: 8 * s, y: 40 * s, w: 74 * s, tam: 2.3 * s, alin: 'centro', espaciado: 60, mayus: true, color: p.acento, fuente: 'extra' }),
        ];
        const fondo2 = p.suave;
        const tinta2 = k.oscuro(fondo2) ? '#F7EFE0' : p.tinta;
        const qr = k.Q(64 * s, 16 * s, 18 * s, { sobre: fondo2 });
        const c = k.contactos({ x: 8 * s, y: 19 * s, w: (qr ? 52 : 74) * s, tam: 2.4 * s, color: tinta2, colorIco: tinta2, sep: 1.6 * s });
        const reverso = [
          k.T('nombre', { x: 8 * s, y: 7 * s, w: 74 * s, tam: 4.4 * s, fuente: 'titulo', color: tinta2, maxLineas: 1 }),
          k.T('puesto', { x: 8 * s, y: 12.4 * s, w: 74 * s, tam: 2.3 * s, color: tinta2 }),
          ...c.el, qr,
        ];
        return [{ el: frente }, { el: reverso, fondo: fondo2 }];
      },
    },
    {
      id: 'estetica', nombre: 'Estética',
      fuentes: { titulo: 'instrument-it', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#F1E4DE', tinta: '#3B2A2A', acento: '#9C5B5B', suave: '#FBF6F3' },
      ejemplo: {
        negocio: 'Estética Valeria', nombre: 'Valeria Domínguez', puesto: 'Estilista y colorista', lema: 'Citas de martes a domingo',
        whatsapp: '55 3926 1048', web: '@esteticavaleria', direccion: 'Av. Coyoacán 1622, Del Valle\nCiudad de México',
      },
      dibujar(k) {
        const s = k.W / 90, p = k.p;
        const frente = [
          k.logo ? k.I('logo', 30 * s, 8 * s, 30 * s, 14 * s) : null,
          k.T('negocio', { x: 6 * s, y: (k.logo ? 33 : 25) * s, vy: 'centro', w: 78 * s, tam: (k.logo ? 6 : 9.5) * s, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 1 }),
          k.T('puesto', { x: 6 * s, y: 41 * s, w: 78 * s, tam: 2.2 * s, alin: 'centro', espaciado: 220, mayus: true, color: p.acento }),
        ];
        const qr = k.Q(66 * s, 25 * s, 16 * s, { sobre: p.suave });
        const c = k.contactos({ x: 8 * s, y: 25 * s, w: (qr ? 54 : 74) * s, tam: 2.35 * s, color: p.tinta, colorIco: p.acento, sep: 1.5 * s });
        const reverso = [
          k.T('nombre', { x: 8 * s, y: 8 * s, w: 74 * s, tam: 6 * s, fuente: 'titulo', maxLineas: 1 }),
          k.T('lema', { x: 8 * s, y: 16.5 * s, w: 74 * s, tam: 2.3 * s, color: p.acento }),
          k.L(8 * s, 21.5 * s, 82 * s, 21.5 * s, k.mezclar(p.acento, p.suave, 0.5), 0.2 * s),
          ...c.el, qr,
        ];
        return [{ el: frente }, { el: reverso, fondo: p.suave }];
      },
    },
    {
      id: 'consultorio', nombre: 'Consultorio',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#12343B', acento: '#2A9D8F', suave: '#E3F1EF' },
      ejemplo: {
        negocio: 'Consultorio Sonrisa Clara', nombre: 'Dra. Paola Ríos Treviño', puesto: 'Odontopediatra · Céd. 10293847', lema: 'Atención a niños desde el primer diente',
        telefono: '442 215 6634', whatsapp: '442 391 0827', correo: 'citas@sonrisaclara.mx', direccion: 'Blvd. Bernardo Quintana 210, int. 4\nQuerétaro, Qro.',
      },
      dibujar(k) {
        const s = k.W / 90, p = k.p;
        const panel = 30 * s;
        const ini = iniciales(k.d.nombre) || 'A';
        const frente = [
          k.R(0, 0, panel, k.H, p.suave),
          k.logo ? k.I('logo', 4 * s, 15 * s, panel - 8 * s, 20 * s) : k.E(5 * s, 15 * s, 20 * s, 20 * s, p.acento),
          k.logo ? null : k.X(ini, { x: 15 * s, y: 25 * s, vy: 'centro', tam: 7.5 * s, fuente: 'titulo', alin: 'centro', color: '#FFFFFF' }),
          k.T('nombre', { x: panel + 6 * s, y: 15 * s, w: 52 * s, tam: 3.6 * s, fuente: 'titulo', maxLineas: 2, interlinea: 1.1 }),
          k.T('puesto', { x: panel + 6 * s, y: 26 * s, w: 52 * s, tam: 2.3 * s, color: p.acento, maxLineas: 2 }),
          k.T('negocio', { x: panel + 6 * s, y: 42 * s, vy: 'abajo', w: 52 * s, tam: 2.3 * s, fuente: 'extra', color: k.mezclar(p.tinta, p.fondo, 0.25) }),
        ];
        const qr = k.Q(67 * s, 7 * s, 16 * s);
        const c = k.contactos({ x: 7 * s, y: 8 * s, w: (qr ? 56 : 76) * s, tam: 2.4 * s, color: p.tinta, colorIco: p.acento, sep: 1.7 * s });
        const reverso = [
          ...c.el, qr,
          k.R(0, k.H - 9 * s, k.W, 9 * s, p.suave),
          k.T('lema', { x: 7 * s, y: k.H - 4.5 * s, vy: 'centro', w: 76 * s, tam: 2.3 * s, color: p.tinta, maxLineas: 1 }),
        ];
        return [{ el: frente }, { el: reverso }];
      },
    },
    {
      id: 'taller', nombre: 'Taller',
      fuentes: { titulo: 'bigshoulders', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#111111', tinta: '#F2F2F0', acento: '#E4572E', suave: '#1E1E1E' },
      ejemplo: {
        negocio: 'Taller Hermanos Cázares', nombre: 'Luis Cázares', puesto: 'Mecánica general y afinación', lema: 'Diagnóstico por computadora',
        telefono: '664 682 4410', whatsapp: '664 309 1185', direccion: 'Blvd. Díaz Ordaz 3310, La Mesa\nTijuana, B.C.',
      },
      dibujar(k) {
        const s = k.W / 90, p = k.p;
        const frente = [
          k.logo ? k.I('logo', 6 * s, 6 * s, 18 * s, 12 * s, { ax: 0, ay: 0 }) : k.R(6 * s, 7 * s, 10 * s, 1.6 * s, p.acento),
          k.T('negocio', { x: 6 * s, y: 43 * s, vy: 'abajo', w: 78 * s, tam: 9 * s, fuente: 'titulo', mayus: true, maxLineas: 2, interlinea: 0.95 }),
          k.T('puesto', { x: 6 * s, y: (k.logo ? 21 : 12) * s, w: 60 * s, tam: 2.3 * s, color: p.acento, mayus: true, espaciado: 100, fuente: 'extra' }),
        ];
        const qr = k.Q(66 * s, 6 * s, 18 * s, { sobre: p.fondo });
        const c = k.contactos({ x: 6 * s, y: 19 * s, w: (qr ? 56 : 78) * s, tam: 2.4 * s, color: p.tinta, colorIco: p.acento, sep: 1.6 * s });
        const reverso = [
          k.T('nombre', { x: 6 * s, y: 7 * s, w: 56 * s, tam: 4 * s, fuente: 'extra', maxLineas: 1 }),
          k.T('lema', { x: 6 * s, y: 12.5 * s, w: 56 * s, tam: 2.3 * s, color: k.mezclar(p.tinta, p.fondo, 0.4) }),
          ...c.el, qr,
        ];
        return [{ el: frente }, { el: reverso }];
      },
    },
  ],
};
