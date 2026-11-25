// Diseños de arranque: letrero de abierto y cerrado (dos caras para imprimir y enmicar).
import { renglones, partir } from './_piezas.js';

const campos = [
  { id: 'abierto', etiqueta: 'Palabra del lado abierto' },
  { id: 'msjAbierto', etiqueta: 'Frase del lado abierto' },
  { id: 'cerrado', etiqueta: 'Palabra del lado cerrado' },
  { id: 'msjCerrado', etiqueta: 'Frase del lado cerrado' },
  { id: 'horario', etiqueta: 'Horario (un renglón por día o grupo de días)', tipo: 'area', filas: 3 },
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'telefono', etiqueta: 'WhatsApp o teléfono', tipo: 'tel' },
];

const base = {
  abierto: 'Abierto', msjAbierto: 'Pásale, ya te atendemos', cerrado: 'Cerrado', msjCerrado: 'Regresamos mañana',
};

// Dibuja las dos caras con la misma función: lado(k, abierto?) → elementos y fondo.
const dos = (lado) => (k) => [
  Object.assign({ nombre: 'Abierto' }, lado(k, true)),
  Object.assign({ nombre: 'Cerrado' }, lado(k, false)),
];

function horario(k, o) {
  const out = [];
  let y = o.y;
  for (const r of renglones(k.d.horario)) {
    const [a, b] = partir(r);
    const ea = k.X(a, { x: o.x, y, w: b ? o.w * 0.55 : o.w, tam: o.tam, color: o.color, id: 'horario', campo: 'horario', maxLineas: 1, alin: o.alin && !b ? o.alin : 'izq' });
    const eb = b ? k.X(b, { x: o.x + o.w * 0.5, y, w: o.w * 0.5, tam: o.tam, color: o.color, fuente: 'extra', alin: 'der', id: 'horario', campo: 'horario', maxLineas: 1 }) : null;
    out.push(ea, eb);
    y += o.tam * 1.7;
  }
  return { el: out, y };
}

export default {
  archivo: 'letrero-abierto-cerrado',
  formatos: [
    { id: 'carta-h', nombre: 'Carta horizontal', ancho: 279.4, alto: 215.9, u: 'mm' },
    { id: 'carta-v', nombre: 'Carta vertical', ancho: 215.9, alto: 279.4, u: 'mm' },
    { id: 'media-h', nombre: 'Media carta', ancho: 215.9, alto: 139.7, u: 'mm' },
  ],
  caras: ['Abierto', 'Cerrado'],
  campos,
  imagenes: ['logo'],
  qr: false,
  disenos: [
    {
      id: 'grande', nombre: 'Palabra grande',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#1E8E5A', tinta: '#FFFFFF', acento: '#C8302E', suave: '#FFFFFF' },
      ejemplo: Object.assign({ horario: 'Lunes a viernes | 9:00 a 19:00\nSábado | 9:00 a 14:00', negocio: 'Papelería El Lápiz', telefono: '462 118 3390' }, base),
      dibujar: dos((k, ab) => {
        const { W, H, u, p } = k, m = u * 8;
        const fondo = ab ? p.fondo : p.acento;
        const el = [];
        el.push(k.T('negocio', { x: m, y: m, w: W - 2 * m, tam: u * 4.4, fuente: 'extra', mayus: true, espaciado: 160, alin: 'centro', maxLineas: 1 }));
        el.push(k.T(ab ? 'abierto' : 'cerrado', { x: m, y: H * 0.43, vy: 'centro', w: W - 2 * m, tam: u * 52, fuente: 'titulo', mayus: true, alin: 'centro', maxLineas: 1 }));
        el.push(k.T(ab ? 'msjAbierto' : 'msjCerrado', { x: m, y: H * 0.43 + u * 22, w: W - 2 * m, tam: u * 6, alin: 'centro', maxLineas: 2 }));
        const hh = horario(k, { x: W * 0.25, y: H - m - u * 4 - renglones(k.d.horario).length * u * 6.8, w: W * 0.5, tam: u * 4, color: p.tinta });
        el.push(...hh.el);
        return { fondo, el };
      }),
    },
    {
      id: 'colgante', nombre: 'Para colgar',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F6EFE3', tinta: '#2E2418', acento: '#2F6B4F', suave: '#B5452E' },
      ejemplo: Object.assign({ horario: 'Martes a domingo | 8:00 a 15:00', negocio: 'Café de la Esquina', telefono: '' }, base, { msjAbierto: 'Hay café recién hecho', msjCerrado: 'Volvemos el martes a las 8' }),
      dibujar: dos((k, ab) => {
        const { W, H, u, p } = k;
        const color = ab ? p.acento : p.suave;
        const claro = '#FFFFFF';
        const bx = W * 0.08, by = H * 0.2, bw = W * 0.84, bh = H * 0.72;
        const el = [
          k.L(W / 2, by, W * 0.3, u * 4, p.tinta, u * 0.6), k.L(W / 2, by, W * 0.7, u * 4, p.tinta, u * 0.6),
          k.E(W / 2 - u * 2.2, by - u * 4.4, u * 4.4, u * 4.4, p.tinta),
          k.R(bx, by, bw, bh, color, { radio: u * 4 }),
          k.E(W / 2 - u * 2, by + u * 4, u * 4, u * 4, p.fondo),
        ];
        el.push(k.T('negocio', { x: bx, y: by + u * 12, w: bw, tam: u * 4, alin: 'centro', mayus: true, espaciado: 200, color: claro, fuente: 'extra', maxLineas: 1 }));
        el.push(k.T(ab ? 'abierto' : 'cerrado', { x: bx + u * 6, y: by + bh * 0.42, vy: 'centro', w: bw - u * 12, tam: u * 28, fuente: 'titulo', alin: 'centro', color: claro, maxLineas: 1 }));
        el.push(k.T(ab ? 'msjAbierto' : 'msjCerrado', { x: bx + u * 6, y: by + bh * 0.42 + u * 14, w: bw - u * 12, tam: u * 5, alin: 'centro', color: claro, maxLineas: 2 }));
        const n = renglones(k.d.horario).length;
        el.push(...horario(k, { x: bx + bw * 0.2, y: by + bh - u * 8 - n * u * 6, w: bw * 0.6, tam: u * 3.6, color: claro }).el);
        return { el };
      }),
    },
    {
      id: 'punto', nombre: 'Punto de color',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#151515', acento: '#22A55B', suave: '#E5484D' },
      ejemplo: Object.assign({ horario: 'Lunes a sábado | 10:00 a 20:00', negocio: 'Óptica Visión Clara', telefono: '33 2210 4581' }, base, { msjAbierto: 'Examen de la vista sin cita', msjCerrado: 'Escríbenos y te apartamos tu cita' }),
      dibujar: dos((k, ab) => {
        const { W, H, u, p } = k, m = u * 10;
        const color = ab ? p.acento : p.suave;
        const el = [];
        const w = k.T(ab ? 'abierto' : 'cerrado', { x: 0, y: 0, tam: u * 24, fuente: 'titulo', maxLineas: 1, w: W - 2 * m - u * 22 });
        const mw = k.medir(w);
        const total = mw.w + u * 22;
        const x0 = (W - total) / 2;
        Object.assign(w, { x: x0 + u * 22, y: H * 0.42, vy: 'centro' });
        el.push(k.E(x0, H * 0.42 - u * 7.5, u * 15, u * 15, color, { id: ab ? 'abierto' : 'cerrado' }), w);
        el.push(k.T(ab ? 'msjAbierto' : 'msjCerrado', { x: m, y: H * 0.42 + u * 16, w: W - 2 * m, tam: u * 5.5, alin: 'centro', maxLineas: 2, color: k.mezclar(p.tinta, p.fondo, 0.25) }));
        el.push(k.L(W * 0.3, H * 0.72, W * 0.7, H * 0.72, k.mezclar(p.tinta, p.fondo, 0.85), u * 0.3));
        el.push(...horario(k, { x: W * 0.25, y: H * 0.72 + u * 6, w: W * 0.5, tam: u * 3.8, color: p.tinta }).el);
        el.push(k.T('negocio', { x: m, y: m, w: W - 2 * m, tam: u * 4, fuente: 'extra', alin: 'centro', maxLineas: 1 }));
        el.push(k.logo ? k.I('logo', W / 2 - u * 12, m - u * 2, u * 24, u * 10) : null);
        return { el };
      }),
    },
    {
      id: 'pizarron', nombre: 'Pizarrón',
      fuentes: { titulo: 'caveat', texto: 'caveat', extra: 'caveat' },
      paleta: { fondo: '#263A30', tinta: '#F3F0E6', acento: '#F6D365', suave: '#F28B82' },
      ejemplo: Object.assign({ horario: 'Lunes a sábado | 1 a 9 pm\nDomingo | 1 a 6 pm', negocio: 'Tortas Ahogadas Don José', telefono: '' }, base, { msjAbierto: 'Pásale, hay tortas ahogadas', msjCerrado: 'Ya nos fuimos. Mañana a la 1' }),
      dibujar: dos((k, ab) => {
        const { W, H, u, p } = k, m = u * 8;
        const el = [k.R(u * 3, u * 3, W - u * 6, H - u * 6, null, { borde: '#8A6A44', grosor: u * 2.4 })];
        el.push(k.T('negocio', { x: m, y: m + u * 2, w: W - 2 * m, tam: u * 7, fuente: 'extra', alin: 'centro', color: p.acento, maxLineas: 1 }));
        el.push(k.T(ab ? 'abierto' : 'cerrado', { x: m, y: H * 0.4, vy: 'centro', w: W - 2 * m, tam: u * 38, fuente: 'titulo', alin: 'centro', color: ab ? p.tinta : p.suave, maxLineas: 1 }));
        el.push(k.T(ab ? 'msjAbierto' : 'msjCerrado', { x: m, y: H * 0.4 + u * 16, w: W - 2 * m, tam: u * 7, alin: 'centro', maxLineas: 2 }));
        const n = renglones(k.d.horario).length;
        el.push(...horario(k, { x: W * 0.22, y: H - m - u * 4 - n * u * 9.5, w: W * 0.56, tam: u * 5.6, color: p.acento }).el);
        return { el };
      }),
    },
    {
      id: 'mitad', nombre: 'Mitad y mitad',
      fuentes: { titulo: 'archivo-angosta', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F3F0EA', tinta: '#141414', acento: '#0057B8', suave: '#141414' },
      ejemplo: Object.assign({ horario: 'Lunes a viernes | 8:00 a 18:00\nSábado | 8:00 a 13:00', negocio: 'Lavandería La Burbuja', telefono: '81 2207 9013' }, base, { msjAbierto: 'Recibimos ropa hasta las 5', msjCerrado: 'Deja tu mensaje por WhatsApp' }),
      dibujar: dos((k, ab) => {
        const { W, H, u, p } = k, m = u * 8;
        const color = ab ? p.acento : p.suave;
        const claro = k.oscuro(color) ? '#FFFFFF' : '#141414';
        const corte = H * 0.62;
        const el = [k.R(0, 0, W, corte, color)];
        el.push(k.T('negocio', { x: m, y: m, w: W - 2 * m, tam: u * 4.2, fuente: 'extra', color: claro, maxLineas: 1 }));
        el.push(k.T(ab ? 'abierto' : 'cerrado', { x: m - u, y: corte - u * 6, vy: 'abajo', w: W - 2 * m, tam: u * 40, fuente: 'titulo', mayus: true, color: claro, maxLineas: 1 }));
        el.push(k.T(ab ? 'msjAbierto' : 'msjCerrado', { x: m, y: corte + u * 7, w: W * 0.42, tam: u * 4.6, fuente: 'extra', maxLineas: 3 }));
        el.push(...horario(k, { x: W * 0.52, y: corte + u * 7.5, w: W * 0.48 - m, tam: u * 3.4, color: p.tinta }).el);
        el.push(k.T('telefono', { x: m, y: H - m, vy: 'abajo', w: W * 0.5, tam: u * 4, maxLineas: 1 }));
        el.push(k.logo ? k.I('logo', W - m - u * 24, m, u * 24, u * 12, { ax: 1, ay: 0 }) : null);
        return { el };
      }),
    },
  ],
};
