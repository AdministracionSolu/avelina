// Diseños de arranque: publicaciones para Instagram (cuadrada, vertical e historia).
import { lista, enLinea } from './_piezas.js';

const campos = [
  { id: 'titulo', etiqueta: 'Título', tipo: 'area', filas: 2 },
  { id: 'subtitulo', etiqueta: 'Texto de apoyo', tipo: 'area', filas: 2 },
  { id: 'oferta', etiqueta: 'Precio u oferta' },
  { id: 'detalles', etiqueta: 'Lista (uno por renglón)', tipo: 'area', filas: 3 },
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'usuario', etiqueta: 'Tu usuario', ayuda: '@tunegocio' },
  { id: 'whatsapp', etiqueta: 'WhatsApp', tipo: 'tel' },
];

// En historias, Instagram tapa arriba y abajo: el contenido va entre las guías.
const zona = (k) => (k.formato === 'historia' ? { y0: 250, y1: k.H - 340 } : { y0: 0, y1: k.H });

export default {
  archivo: 'post-instagram',
  formatos: [
    { id: 'cuadrado', nombre: 'Cuadrada 1080', ancho: 1080, alto: 1080, u: 'px' },
    { id: 'vertical', nombre: 'Vertical 1080 × 1350', ancho: 1080, alto: 1350, u: 'px' },
    { id: 'historia', nombre: 'Historia 1080 × 1920', ancho: 1080, alto: 1920, u: 'px', guias: (W, H) => [{ x1: 0, y1: 250, x2: W, y2: 250 }, { x1: 0, y1: H - 340, x2: W, y2: H - 340 }] },
  ],
  campos,
  imagenes: ['logo', 'foto'],
  qr: false,
  disenos: [
    {
      id: 'promo', nombre: 'Promoción',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FF6B35', tinta: '#1A1A1A', acento: '#FFFFFF', suave: '#1A1A1A' },
      ejemplo: { titulo: 'Jueves de alitas', subtitulo: 'Búfalo, mango habanero y BBQ', oferta: '$99 la orden', negocio: 'Wings & Beer La Esquina', usuario: '@wingslaesquina', whatsapp: '614 220 1185' },
      dibujar(k) {
        const { W, u, p } = k, m = u * 8, z = zona(k);
        const el = [];
        if (k.foto) el.push(k.I('foto', 0, z.y0, W, (z.y1 - z.y0) * 0.45));
        let y = k.foto ? z.y0 + (z.y1 - z.y0) * 0.45 + u * 6 : z.y0 + m;
        if (!k.foto) { el.push(k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', mayus: true, espaciado: 140, maxLineas: 1 })); y += u * 12; }
        const bloque = [
          k.T('titulo', { x: m - u * 0.5, w: W - 2 * m, tam: u * (k.foto ? 15 : 21), fuente: 'titulo', mayus: true, maxLineas: 3, interlinea: 0.9, sep: u * 4 }),
          k.T('subtitulo', { x: m, w: W * 0.75, tam: u * 4.6, maxLineas: 3, sep: u * 6 }),
        ];
        k.flujo(y, bloque);
        el.push(...bloque);
        const of = k.T('oferta', { x: m + u * 4, y: z.y1 - m - u * 18 + u * 5, w: W * 0.6, tam: u * 8, fuente: 'titulo', mayus: true, color: p.fondo, maxLineas: 1 });
        if (of) { const mw = k.medir(of).w; el.push(k.R(m, z.y1 - m - u * 18, mw + u * 8, u * 18, p.suave, { id: 'oferta' }), of); }
        el.push(enLinea(k, ['usuario', 'whatsapp'], { x: W * 0.5, y: z.y1 - m, vy: 'abajo', w: W * 0.5 - m, tam: u * 3.4, alin: 'der', fuente: 'extra', maxLineas: 2, sep: '\n' }));
        el.push(k.logo ? k.I('logo', W - m - u * 20, z.y0 + m, u * 20, u * 12, { ax: 1, ay: 0 }) : null);
        return [{ el }];
      },
    },
    {
      id: 'frase', nombre: 'Frase',
      fuentes: { titulo: 'fraunces-300', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#EFE7DA', tinta: '#2A2420', acento: '#8C5E3C', suave: '#E2D6C3' },
      ejemplo: { titulo: 'El pan bueno se hace despacio', subtitulo: 'Masa madre de 48 horas. Horneamos todos los días a las 7.', negocio: 'Panadería Cardumen', usuario: '@panaderiacardumen' },
      dibujar(k) {
        const { W, u, p } = k, m = u * 11, z = zona(k);
        const el = [k.R(u * 4, z.y0 + u * 4, W - u * 8, z.y1 - z.y0 - u * 8, null, { borde: p.acento, grosor: u * 0.2 })];
        const cy = (z.y0 + z.y1) / 2;
        el.push(k.X('“', { x: W / 2, y: cy - u * 30, vy: 'centro', alin: 'centro', tam: u * 22, fuente: 'titulo', color: p.acento }));
        el.push(k.T('titulo', { x: m, y: cy, vy: 'centro', w: W - 2 * m, tam: u * 9.5, fuente: 'titulo', alin: 'centro', maxLineas: 4, interlinea: 1.12 }));
        el.push(k.T('subtitulo', { x: m * 1.3, y: cy + u * 22, w: W - 2.6 * m, tam: u * 3.6, alin: 'centro', maxLineas: 3, color: k.mezclar(p.tinta, p.fondo, 0.3) }));
        el.push(enLinea(k, ['negocio', 'usuario'], { x: m, y: z.y1 - m, vy: 'abajo', w: W - 2 * m, tam: u * 3.2, alin: 'centro', mayus: true, espaciado: 160, fuente: 'extra', color: p.acento, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'lista', nombre: 'Lista de precios',
      fuentes: { titulo: 'zilla', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#16302B', tinta: '#F3EFE4', acento: '#E9C46A', suave: '#1F3F38' },
      ejemplo: { titulo: 'Nuestros servicios', detalles: 'Corte de cabello | $150\nCorte y barba | $230\nAfeitado clásico | $120\nTinte de barba | $180', negocio: 'Barbería Los Reyes', usuario: '@barberialosreyes', whatsapp: '81 1209 8834', subtitulo: 'Agenda por WhatsApp' },
      dibujar(k) {
        const { W, u, p } = k, m = u * 9, z = zona(k);
        const el = [];
        let y = z.y0 + m;
        el.push(k.logo ? k.I('logo', m, y, u * 24, u * 12, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', mayus: true, espaciado: 160, color: p.acento, maxLineas: 1 }));
        y += u * 12;
        const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 10, fuente: 'titulo', maxLineas: 2, interlinea: 1 });
        el.push(tt); y += k.medir(tt).h + u * 9;
        const filas = String(k.d.detalles || '').split('\n').map((s) => s.trim()).filter(Boolean);
        const alto = Math.min(u * 13, (z.y1 - y - u * 22) / Math.max(1, filas.length));
        for (const f of filas) {
          const [a, b] = f.split(/\s*[|·]\s*/);
          el.push(k.X(a, { x: m, y, w: W * 0.6, tam: Math.min(u * 5, alto * 0.42), id: 'detalles', campo: 'detalles', maxLineas: 1 }));
          el.push(k.X(b || '', { x: W * 0.6, y, w: W * 0.4 - m, tam: Math.min(u * 5, alto * 0.42), fuente: 'extra', alin: 'der', color: p.acento, id: 'detalles', campo: 'detalles', maxLineas: 1 }));
          el.push(k.L(m, y + alto * 0.62, W - m, y + alto * 0.62, p.suave, u * 0.3, { id: 'detalles' }));
          y += alto;
        }
        el.push(enLinea(k, ['subtitulo', 'whatsapp', 'usuario'], { x: m, y: z.y1 - m, vy: 'abajo', w: W - 2 * m, tam: u * 3.4, maxLineas: 2 }));
        return [{ el }];
      },
    },
    {
      id: 'foto', nombre: 'Foto con marco',
      fuentes: { titulo: 'bricolage', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFFFFF', tinta: '#161616', acento: '#3A86FF', suave: '#EDF2FB' },
      ejemplo: { titulo: 'Nueva colección de lentes', subtitulo: 'Armazones desde $690 con examen de la vista incluido', negocio: 'Óptica Mirada', usuario: '@opticamirada', oferta: 'Desde $690' },
      dibujar(k) {
        const { W, u, p } = k, m = u * 7, z = zona(k);
        const alto = z.y1 - z.y0;
        const fh = alto * 0.62;
        const el = [k.foto ? k.I('foto', m, z.y0 + m, W - 2 * m, fh - m) : k.R(m, z.y0 + m, W - 2 * m, fh - m, p.suave)];
        if (!k.foto) el.push(k.T('oferta', { x: m, y: z.y0 + fh / 2 + m / 2, vy: 'centro', w: W - 2 * m, tam: u * 16, fuente: 'titulo', alin: 'centro', color: p.acento, maxLineas: 1 }));
        const bloque = [
          k.T('titulo', { x: m, w: W - 2 * m, tam: u * 8, fuente: 'titulo', maxLineas: 2, interlinea: 1, sep: u * 3 }),
          k.T('subtitulo', { x: m, w: W - 2 * m, tam: u * 3.8, maxLineas: 2 }),
        ];
        k.flujo(z.y0 + fh + u * 5, bloque);
        el.push(...bloque);
        el.push(enLinea(k, ['negocio', 'usuario'], { x: m, y: z.y1 - m, vy: 'abajo', w: W - 2 * m, tam: u * 3.2, fuente: 'extra', color: p.acento, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'aviso', nombre: 'Aviso',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#1D3557', tinta: '#F1FAEE', acento: '#E63946', suave: '#457B9D' },
      ejemplo: { titulo: 'Cerramos del 24 al 26 de diciembre', subtitulo: 'Regresamos el sábado 27 en horario normal. Felices fiestas.', negocio: 'Tlapalería Hermanos Ruiz', usuario: '@tlapaleriaruiz' },
      dibujar(k) {
        const { W, u, p } = k, m = u * 10, z = zona(k);
        const el = [k.R(m, z.y0 + m, u * 14, u * 2.2, p.acento)];
        el.push(k.T('negocio', { x: m, y: z.y0 + m + u * 8, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', maxLineas: 1, color: k.mezclar(p.tinta, p.fondo, 0.25) }));
        el.push(k.T('titulo', { x: m, y: (z.y0 + z.y1) / 2, vy: 'centro', w: W - 2 * m, tam: u * 11, fuente: 'titulo', maxLineas: 4, interlinea: 1.04 }));
        el.push(k.T('subtitulo', { x: m, y: z.y1 - m, vy: 'abajo', w: W * 0.72, tam: u * 4.2, maxLineas: 3 }));
        el.push(k.logo ? k.I('logo', W - m - u * 18, z.y1 - m - u * 12, u * 18, u * 12, { ax: 1, ay: 1 }) : null);
        return [{ el }];
      },
    },
    {
      id: 'servicios', nombre: 'Servicios',
      fuentes: { titulo: 'instrument', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#F7EFEA', tinta: '#3D2B2B', acento: '#A35C5C', suave: '#EAD8CF' },
      ejemplo: { titulo: 'Lo que hacemos por tus uñas', detalles: 'Acrílico y gelish\nPedicure spa\nDiseños a mano\nRetiro sin dañar la uña', negocio: 'Nails by Fer', usuario: '@nailsbyfer', whatsapp: '55 3311 4920' },
      dibujar(k) {
        const { W, u, p } = k, m = u * 10, z = zona(k);
        const el = [k.E(W * 0.55, z.y0 - W * 0.15, W * 0.6, W * 0.6, p.suave)];
        const bloque = [k.T('titulo', { x: m, w: W * 0.72, tam: u * 10, fuente: 'titulo', maxLineas: 3, interlinea: 1.02 })];
        const y = k.flujo(z.y0 + m + u * 8, bloque);
        el.push(...bloque);
        const l = lista(k, { x: m, y: y + u * 4, w: W - 2 * m, tam: u * 4.8, color: p.tinta, colorMarca: p.acento, marca: 'numero', sep: u * 3.5 });
        el.push(...l.el);
        el.push(enLinea(k, ['negocio', 'usuario', 'whatsapp'], { x: m, y: z.y1 - m, vy: 'abajo', w: W - 2 * m, tam: u * 3.2, fuente: 'extra', color: p.acento, maxLineas: 1 }));
        return [{ el }];
      },
    },
  ],
};
