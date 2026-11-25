// Diseños de arranque: tarjeta de lealtad o de sellos (9 × 5 cm, frente y casillas atrás).
import { iniciales } from './_piezas.js';

const campos = [
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'lema', etiqueta: 'Frase corta' },
  { id: 'premio', etiqueta: 'Premio', ayuda: 'Lo que gana al llenar la tarjeta.' },
  { id: 'regla', etiqueta: 'Cómo se gana un sello' },
  { id: 'telefono', etiqueta: 'WhatsApp o teléfono', tipo: 'tel' },
  { id: 'direccion', etiqueta: 'Dirección' },
  { id: 'web', etiqueta: 'Página o red social' },
];

// Rejilla de casillas. forma: 'circulo' | 'cuadro' | 'icono'
function casillas(k, o) {
  const n = Number(k.op.sellos) || 8;
  const filas = n > 6 ? 2 : 1, cols = Math.ceil(n / filas);
  const gap = o.gap, lado = Math.min((o.w - gap * (cols - 1)) / cols, (o.h - gap * (filas - 1)) / filas);
  const total = cols * lado + (cols - 1) * gap;
  const x0 = o.x + (o.w - total) / 2;
  const el = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols, f = Math.floor(i / cols);
    const x = x0 + c * (lado + gap), y = o.y + f * (lado + gap);
    const ultimo = i === n - 1;
    if (o.forma === 'cuadro') el.push(k.R(x, y, lado, lado, ultimo ? o.colorUltimo : null, { borde: o.color, grosor: o.grosor, radio: lado * 0.18 }));
    else el.push(k.E(x, y, lado, lado, ultimo ? o.colorUltimo : null, { borde: o.color, grosor: o.grosor }));
    if (o.icono && !ultimo) el.push(k.Ico(o.icono, x + lado * 0.28, y + lado * 0.28, lado * 0.44, o.colorIcono || o.color, { grosor: lado * 0.035 }));
    if (ultimo) el.push(k.Ico('regalo', x + lado * 0.25, y + lado * 0.24, lado * 0.5, o.colorRegalo, { grosor: lado * 0.045 }));
    else if (o.numeros) el.push(k.X(String(i + 1), { x: x + lado / 2, y: y + lado / 2, vy: 'centro', alin: 'centro', tam: lado * 0.34, color: o.colorIcono || o.color, fuente: 'extra' }));
  }
  return el;
}

export default {
  archivo: 'tarjeta-lealtad',
  formatos: [
    { id: 'tarjeta', nombre: '9 × 5 cm', ancho: 90, alto: 50, u: 'mm' },
  ],
  caras: ['Frente', 'Casillas'],
  campos,
  opciones: [{ id: 'sellos', etiqueta: 'Número de sellos', lista: [['6', '6'], ['8', '8'], ['10', '10'], ['12', '12']], defecto: '10' }],
  imagenes: ['logo'],
  qr: true,
  hoja: true,
  disenos: [
    {
      id: 'cafe', nombre: 'Cafetería',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F3ECE2', tinta: '#3B2A20', acento: '#3B2A20', suave: '#C8A27A' },
      ejemplo: { negocio: 'Café Barrio', lema: 'Tostado en Coatepec', premio: 'Tu décimo café va por nuestra cuenta', regla: 'Un sello por cada bebida', telefono: '228 118 9034', direccion: 'Calle Xalapeños Ilustres 41, Xalapa' },
      dibujar(k) {
        const { W, H, u, p } = k, s = W / 90;
        const frente = [
          k.R(0, 0, W, H, p.acento),
          k.logo ? k.I('logo', 25 * s, 9 * s, 40 * s, 20 * s) : k.T('negocio', { x: 6 * s, y: 22 * s, vy: 'centro', w: 78 * s, tam: 9 * s, fuente: 'titulo', alin: 'centro', color: p.fondo, maxLineas: 2, interlinea: 1 }),
          k.T('lema', { x: 6 * s, y: 36 * s, w: 78 * s, tam: 2.3 * s, alin: 'centro', mayus: true, espaciado: 200, color: p.suave, maxLineas: 1 }),
        ];
        const atras = [
          k.T('premio', { x: 6 * s, y: 5.5 * s, w: 78 * s, tam: 3.4 * s, fuente: 'titulo', alin: 'centro', maxLineas: 2 }),
          ...casillas(k, { x: 7 * s, y: 13 * s, w: 76 * s, h: 25 * s, gap: 2.2 * s, color: p.tinta, grosor: 0.3 * s, icono: 'taza', colorIcono: p.suave, colorUltimo: p.suave, colorRegalo: p.tinta }),
          k.T('regla', { x: 6 * s, y: 42 * s, w: 78 * s, tam: 2.1 * s, alin: 'centro', maxLineas: 1, color: k.mezclar(p.tinta, p.fondo, 0.35) }),
        ];
        return [{ el: frente, fondo: p.acento }, { el: atras }];
      },
    },
    {
      id: 'barberia', nombre: 'Barbería',
      fuentes: { titulo: 'alfa', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#151515', tinta: '#F1EDE4', acento: '#B08D57', suave: '#262626' },
      ejemplo: { negocio: 'Barbería Don Chuy', lema: 'Corte y barba desde 1998', premio: 'Llena la tarjeta y tu corte es gratis', regla: 'Un sello por cada corte', telefono: '81 1830 4472', web: '@barberiadonchuy' },
      dibujar(k) {
        const { W, H, p } = k, s = W / 90;
        const frente = [
          k.R(4 * s, 4 * s, 82 * s, 42 * s, null, { borde: p.acento, grosor: 0.35 * s }),
          k.logo ? k.I('logo', 30 * s, 10 * s, 30 * s, 18 * s) : k.T('negocio', { x: 8 * s, y: 22 * s, vy: 'centro', w: 74 * s, tam: 7 * s, fuente: 'titulo', alin: 'centro', mayus: true, maxLineas: 2, interlinea: 1 }),
          k.T('lema', { x: 8 * s, y: 36 * s, w: 74 * s, tam: 2.3 * s, alin: 'centro', color: p.acento, maxLineas: 1 }),
        ];
        const atras = [
          k.T('premio', { x: 6 * s, y: 5.5 * s, w: 78 * s, tam: 3.2 * s, fuente: 'titulo', alin: 'centro', mayus: true, maxLineas: 2, color: p.acento }),
          ...casillas(k, { x: 8 * s, y: 13.5 * s, w: 74 * s, h: 24 * s, gap: 2.4 * s, color: p.acento, grosor: 0.35 * s, forma: 'cuadro', icono: 'tijeras', colorIcono: k.mezclar(p.acento, p.fondo, 0.5), colorUltimo: p.acento, colorRegalo: p.fondo }),
          k.T('regla', { x: 6 * s, y: 42 * s, w: 78 * s, tam: 2.1 * s, alin: 'centro', maxLineas: 1 }),
        ];
        return [{ el: frente }, { el: atras }];
      },
    },
    {
      id: 'estetica', nombre: 'Estética',
      fuentes: { titulo: 'instrument-it', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FBF3F0', tinta: '#5A3A3A', acento: '#D8A7A7', suave: '#F1DCDC' },
      ejemplo: { negocio: 'Salón Bambú', lema: 'Cortes · Color · Uñas', premio: 'Al llenarla, tu tratamiento capilar es gratis', regla: 'Un sello por cada visita de $300 o más', telefono: '442 330 1928' },
      dibujar(k) {
        const { W, H, p } = k, s = W / 90;
        const frente = [
          k.E(52 * s, -14 * s, 52 * s, 52 * s, p.suave),
          k.logo ? k.I('logo', 8 * s, 8 * s, 30 * s, 14 * s, { ax: 0, ay: 0 }) : null,
          k.T('negocio', { x: 8 * s, y: 32 * s, vy: 'abajo', w: 60 * s, tam: 8 * s, fuente: 'titulo', maxLineas: 2, interlinea: 1 }),
          k.T('lema', { x: 8 * s, y: 37 * s, w: 70 * s, tam: 2.2 * s, mayus: true, espaciado: 160, color: k.mezclar(p.tinta, p.fondo, 0.3), maxLineas: 1 }),
        ];
        const atras = [
          k.T('premio', { x: 7 * s, y: 6 * s, w: 76 * s, tam: 3.6 * s, fuente: 'titulo', maxLineas: 2 }),
          ...casillas(k, { x: 7 * s, y: 15 * s, w: 76 * s, h: 22 * s, gap: 2.6 * s, color: p.acento, grosor: 0.3 * s, numeros: true, colorIcono: p.acento, colorUltimo: p.suave, colorRegalo: p.tinta }),
          k.T('regla', { x: 7 * s, y: 42 * s, w: 76 * s, tam: 2.1 * s, maxLineas: 1 }),
        ];
        return [{ el: frente }, { el: atras }];
      },
    },
    {
      id: 'taqueria', nombre: 'Taquería',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFFFFF', tinta: '#1C1C1C', acento: '#E63946', suave: '#FFD6A5' },
      ejemplo: { negocio: 'Tacos Los Cuates', lema: 'Pastor · Suadero · Campechanos', premio: 'Llena la tarjeta y llévate 5 tacos gratis', regla: 'Un sello por cada orden', telefono: '55 2918 3361', direccion: 'Eje Central 410, CDMX' },
      dibujar(k) {
        const { W, H, p } = k, s = W / 90;
        const claro = k.oscuro(p.acento) ? '#FFFFFF' : '#1C1C1C';
        const frente = [
          k.R(0, 0, W, 33 * s, p.acento),
          k.logo ? k.I('logo', 6 * s, 5 * s, 24 * s, 23 * s, { ax: 0 }) : null,
          k.T('negocio', { x: (k.logo ? 34 : 6) * s, y: 17 * s, vy: 'centro', w: (k.logo ? 50 : 78) * s, tam: 10 * s, fuente: 'titulo', mayus: true, color: claro, maxLineas: 2, interlinea: 0.95 }),
          k.T('lema', { x: 6 * s, y: 38 * s, w: 78 * s, tam: 2.4 * s, fuente: 'extra', maxLineas: 1 }),
          k.T('direccion', { x: 6 * s, y: 43 * s, w: 78 * s, tam: 2.1 * s, maxLineas: 1, color: k.mezclar(p.tinta, p.fondo, 0.4) }),
        ];
        const atras = [
          k.T('premio', { x: 6 * s, y: 5.5 * s, w: 78 * s, tam: 3.8 * s, fuente: 'titulo', mayus: true, maxLineas: 2 }),
          ...casillas(k, { x: 6 * s, y: 14 * s, w: 78 * s, h: 24 * s, gap: 2 * s, color: p.tinta, grosor: 0.3 * s, numeros: true, colorIcono: k.mezclar(p.tinta, p.fondo, 0.6), colorUltimo: p.suave, colorRegalo: p.acento }),
          k.T('regla', { x: 6 * s, y: 42.5 * s, w: 78 * s, tam: 2.1 * s, maxLineas: 1 }),
        ];
        return [{ el: frente }, { el: atras }];
      },
    },
    {
      id: 'minimo', nombre: 'Mínimo',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#111111', acento: '#2B59C3', suave: '#E8EEFA' },
      ejemplo: { negocio: 'Lavandería Espuma', lema: 'Lavado por kilo', premio: 'La carga número 10 va gratis', regla: 'Un sello por cada carga de 5 kg', telefono: '999 284 1107', web: 'lavanderiaespuma.mx' },
      dibujar(k) {
        const { W, H, p } = k, s = W / 90;
        const ini = iniciales(k.d.negocio) || 'A';
        const frente = [
          k.logo ? k.I('logo', 6 * s, 6 * s, 18 * s, 18 * s, { ax: 0, ay: 0 }) : k.R(6 * s, 6 * s, 12 * s, 12 * s, p.acento, { radio: 2 * s }),
          k.logo ? null : k.X(ini, { x: 12 * s, y: 12 * s, vy: 'centro', alin: 'centro', tam: 5 * s, fuente: 'titulo', color: '#FFFFFF' }),
          k.T('negocio', { x: 6 * s, y: 40 * s, vy: 'abajo', w: 78 * s, tam: 6 * s, fuente: 'titulo', maxLineas: 2, interlinea: 1 }),
          k.T('lema', { x: 6 * s, y: 43.5 * s, w: 50 * s, tam: 2.3 * s, color: p.acento, maxLineas: 1 }),
          k.T('telefono', { x: 50 * s, y: 43.5 * s, w: 34 * s, tam: 2.3 * s, alin: 'der', maxLineas: 1 }),
        ];
        const atras = [
          k.R(0, 0, W, H, p.suave),
          k.T('premio', { x: 6 * s, y: 6 * s, w: 78 * s, tam: 3.4 * s, fuente: 'titulo', maxLineas: 2 }),
          ...casillas(k, { x: 6 * s, y: 15 * s, w: 78 * s, h: 22 * s, gap: 2.4 * s, color: p.acento, grosor: 0.3 * s, colorUltimo: p.acento, colorRegalo: '#FFFFFF' }),
          k.T('regla', { x: 6 * s, y: 42 * s, w: 78 * s, tam: 2.1 * s, maxLineas: 1, color: k.mezclar(p.tinta, p.suave, 0.3) }),
        ];
        return [{ el: frente }, { el: atras }];
      },
    },
  ],
};
