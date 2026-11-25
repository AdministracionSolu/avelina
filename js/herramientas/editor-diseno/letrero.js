// Diseños de arranque: letrero o rótulo para la fachada del negocio (para llevar a rotular o imprimir en lona).
import { enLinea, iniciales } from './_piezas.js';

const campos = [
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'giro', etiqueta: 'Qué vendes o qué haces' },
  { id: 'lema', etiqueta: 'Frase corta' },
  { id: 'telefono', etiqueta: 'Teléfono o WhatsApp', tipo: 'tel' },
  { id: 'horario', etiqueta: 'Horario' },
  { id: 'web', etiqueta: 'Página o red social' },
];

export default {
  archivo: 'letrero',
  formatos: [
    { id: '240x60', nombre: '2.40 × 0.60 m', ancho: 2400, alto: 600, u: 'mm' },
    { id: '300x100', nombre: '3 × 1 m', ancho: 3000, alto: 1000, u: 'mm' },
    { id: '120x60', nombre: '1.20 × 0.60 m', ancho: 1200, alto: 600, u: 'mm' },
    { id: '100x100', nombre: '1 × 1 m', ancho: 1000, alto: 1000, u: 'mm' },
    { id: 'medida', nombre: 'A tu medida', ancho: 2000, alto: 800, u: 'mm', medida: true },
  ],
  campos,
  imagenes: ['logo'],
  qr: true,
  disenos: [
    {
      id: 'fachada', nombre: 'Fachada clásica',
      fuentes: { titulo: 'zilla', texto: 'archivo-700', extra: 'archivo-700' },
      paleta: { fondo: '#1F3A5F', tinta: '#FFFFFF', acento: '#F4C430', suave: '#1F3A5F' },
      ejemplo: { negocio: 'Ferretería Juárez', giro: 'Material eléctrico · Plomería · Pinturas', telefono: '492 128 3340', horario: 'Lunes a sábado 8:00 a 19:00', lema: 'Desde 1979' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const el = [k.R(u * 4, u * 4, W - u * 8, H - u * 8, null, { borde: p.acento, grosor: u * 1.2 })];
        const ancho = W - 2 * m;
        el.push(k.T('lema', { x: m, y: m, w: ancho, tam: u * 6, alin: 'centro', mayus: true, espaciado: 300, color: p.acento, maxLineas: 1 }));
        el.push(k.T('negocio', { x: m, y: H * 0.47, vy: 'centro', w: ancho, tam: u * (k.horizontal ? 40 : 22), fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 0.95, h: H * 0.5 }));
        el.push(k.T('giro', { x: m, y: H * 0.74, w: ancho, tam: u * 7, alin: 'centro', color: p.acento, maxLineas: 2 }));
        el.push(enLinea(k, ['telefono', 'horario', 'web'], { x: m, y: H - m, vy: 'abajo', w: ancho, tam: u * 5, alin: 'centro', fuente: 'texto', maxLineas: 1, color: p.tinta }));
        el.push(k.logo ? k.I('logo', m, H / 2 - u * 18, u * 36, u * 36) : null);
        return [{ el }];
      },
    },
    {
      id: 'logo-izquierda', nombre: 'Marca a la izquierda',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#1D1D1F', acento: '#E85D75', suave: '#FCE8EC' },
      ejemplo: { negocio: 'Nails Studio Ximena', giro: 'Uñas acrílicas · Gelish · Pedicure', telefono: '33 1188 4092', web: '@nailsximena' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 10;
        const el = [];
        const lado = k.horizontal ? H : W * 0.5;
        if (k.horizontal) {
          el.push(k.R(0, 0, lado, H, p.suave));
          el.push(k.logo ? k.I('logo', u * 12, u * 12, lado - u * 24, H - u * 24) : k.E(lado / 2 - u * 30, H / 2 - u * 30, u * 60, u * 60, p.acento));
          if (!k.logo) el.push(k.X(iniciales(k.d.negocio) || 'A', { x: lado / 2, y: H / 2, vy: 'centro', alin: 'centro', tam: u * 26, fuente: 'titulo', color: '#FFFFFF' }));
          const x = lado + m, w = W - x - m;
          el.push(k.T('negocio', { x, y: H * 0.42, vy: 'abajo', w, tam: u * 26, fuente: 'titulo', maxLineas: 2, interlinea: 0.95, h: H * 0.38 }));
          el.push(k.T('giro', { x, y: H * 0.52, w, tam: u * 7.5, color: p.acento, maxLineas: 2 }));
          el.push(enLinea(k, ['telefono', 'web', 'horario'], { x, y: H - m, vy: 'abajo', w, tam: u * 5.5, fuente: 'extra', maxLineas: 1 }));
        } else {
          el.push(k.logo ? k.I('logo', W / 2 - u * 25, m, u * 50, u * 30) : k.E(W / 2 - u * 16, m, u * 32, u * 32, p.acento));
          if (!k.logo) el.push(k.X(iniciales(k.d.negocio) || 'A', { x: W / 2, y: m + u * 16, vy: 'centro', alin: 'centro', tam: u * 14, fuente: 'titulo', color: '#FFFFFF' }));
          el.push(k.T('negocio', { x: m, y: H * 0.5, w: W - 2 * m, tam: u * 13, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 0.95, vy: 'centro' }));
          el.push(k.T('giro', { x: m, y: H * 0.66, w: W - 2 * m, tam: u * 5, alin: 'centro', color: p.acento, maxLineas: 2 }));
          el.push(enLinea(k, ['telefono', 'web', 'horario'], { x: m, y: H - m, vy: 'abajo', w: W - 2 * m, tam: u * 4.5, alin: 'centro', fuente: 'extra', maxLineas: 2 }));
        }
        return [{ el }];
      },
    },
    {
      id: 'franja', nombre: 'Franja de datos',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F5C518', tinta: '#111111', acento: '#111111', suave: '#111111' },
      ejemplo: { negocio: 'Taller El Chino', giro: 'Hojalatería y pintura', telefono: '656 410 2271', horario: 'Lunes a sábado 9 a 7', web: '' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const franja = H * 0.26;
        const claro = k.oscuro(p.acento) ? '#FFFFFF' : '#111111';
        const el = [k.R(0, H - franja, W, franja, p.acento)];
        el.push(k.T('negocio', { x: m, y: (H - franja) * 0.5 + u * 2, vy: 'centro', w: W - 2 * m - (k.logo ? u * 60 : 0), tam: u * 45, fuente: 'titulo', mayus: true, alin: k.logo ? 'izq' : 'centro', maxLineas: 2, interlinea: 0.9, h: H - franja - u * 14 }));
        el.push(k.logo ? k.I('logo', W - m - u * 50, u * 8, u * 50, H - franja - u * 16) : null);
        el.push(k.T('giro', { x: m, y: H - franja / 2, vy: 'centro', w: (W - 2 * m) * 0.55, tam: u * 9, fuente: 'titulo', mayus: true, color: claro, maxLineas: 1 }));
        el.push(enLinea(k, ['telefono', 'horario'], { x: m + (W - 2 * m) * 0.55, y: H - franja / 2, vy: 'centro', w: (W - 2 * m) * 0.45, tam: u * 7, alin: 'der', fuente: 'extra', color: claro, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'antiguo', nombre: 'Rótulo antiguo',
      fuentes: { titulo: 'fraunces', texto: 'fraunces-300', extra: 'archivo-700' },
      paleta: { fondo: '#203A2E', tinta: '#F1E6CF', acento: '#C79A4B', suave: '#203A2E' },
      ejemplo: { negocio: 'Panadería San Antonio', giro: 'Pan de dulce, bolillo y pasteles', lema: 'Fundada en 1952', telefono: '443 312 0921' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 12;
        const el = [
          k.R(u * 5, u * 5, W - u * 10, H - u * 10, null, { borde: p.acento, grosor: u * 0.8 }),
          k.R(u * 8, u * 8, W - u * 16, H - u * 16, null, { borde: p.acento, grosor: u * 0.3 }),
        ];
        el.push(k.T('lema', { x: m, y: m, w: W - 2 * m, tam: u * 6, alin: 'centro', fuente: 'texto', color: p.acento, maxLineas: 1 }));
        el.push(k.T('negocio', { x: m, y: H * 0.5, vy: 'centro', w: W - 2 * m, tam: u * (k.horizontal ? 36 : 20), fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 0.95, h: H * 0.46 }));
        const g = k.T('giro', { x: m, y: H - m, vy: 'abajo', w: W - 2 * m, tam: u * 6.5, alin: 'centro', fuente: 'texto', maxLineas: 2 });
        el.push(g);
        el.push(k.T('telefono', { x: m, y: H - m - u * 11, vy: 'abajo', w: W - 2 * m, tam: u * 5, fuente: 'extra', alin: 'centro', color: p.acento, maxLineas: 1 }));
        el.push(k.logo ? k.I('logo', u * 14, H / 2 - u * 18, u * 36, u * 36) : null);
        return [{ el }];
      },
    },
    {
      id: 'moderno', nombre: 'Moderno',
      fuentes: { titulo: 'bricolage', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#111111', tinta: '#F2F2F0', acento: '#7CDA8E', suave: '#111111' },
      ejemplo: { negocio: 'verde fresco', giro: 'Jugos, ensaladas y bowls', telefono: '999 201 7745', web: '@verdefresco.mid', horario: 'Abierto de 7 a 4' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 10;
        const el = [];
        const n = k.T('negocio', { x: m, y: H * 0.56, vy: 'abajo', w: W - 2 * m - u * 14, tam: u * 40, fuente: 'titulo', maxLineas: 2, interlinea: 0.92, h: H * 0.5 });
        el.push(n);
        const mm = k.medir(n);
        el.push(k.E(mm.x + mm.w + u * 3, H * 0.56 - u * 10, u * 10, u * 10, p.acento, { id: 'negocio' }));
        el.push(k.T('giro', { x: m, y: H * 0.64, w: W - 2 * m, tam: u * 8, color: p.acento, maxLineas: 2 }));
        el.push(enLinea(k, ['telefono', 'web', 'horario'], { x: m, y: H - m, vy: 'abajo', w: W - 2 * m, tam: u * 5, maxLineas: 1, color: k.mezclar(p.tinta, p.fondo, 0.25) }));
        el.push(k.logo ? k.I('logo', W - m - u * 40, m, u * 40, u * 24, { ax: 1, ay: 0 }) : null);
        return [{ el }];
      },
    },
  ],
};
