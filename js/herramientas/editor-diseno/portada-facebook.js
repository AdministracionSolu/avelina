// Diseños de arranque: portada de Facebook (1640 × 624 px).
// En celular Facebook recorta los lados: lo importante va dentro de la zona punteada.
import { renglones, enLinea } from './_piezas.js';

const campos = [
  { id: 'titulo', etiqueta: 'Nombre o frase principal' },
  { id: 'lema', etiqueta: 'Frase corta' },
  { id: 'servicios', etiqueta: 'Servicios o productos (uno por renglón)', tipo: 'area', filas: 3 },
  { id: 'whatsapp', etiqueta: 'WhatsApp', tipo: 'tel' },
  { id: 'direccion', etiqueta: 'Ciudad o dirección' },
  { id: 'web', etiqueta: 'Página web' },
];

// Zona que se ve en celular (centro, proporción 16:9 sobre la altura completa).
const segura = (W, H) => { const w = Math.round((H * 16) / 9); return { x: (W - w) / 2, w }; };

export default {
  archivo: 'portada-facebook',
  formatos: [
    { id: 'fb', nombre: '1640 × 624 px', ancho: 1640, alto: 624, u: 'px', guias: (W, H) => { const s = segura(W, H); return [{ x1: s.x, y1: 0, x2: s.x, y2: H }, { x1: s.x + s.w, y1: 0, x2: s.x + s.w, y2: H }]; } },
  ],
  campos,
  imagenes: ['logo', 'foto'],
  qr: false,
  disenos: [
    {
      id: 'centrado', nombre: 'Centrado',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F2EADF', tinta: '#2C2018', acento: '#9E4A2F', suave: '#E4D5C1' },
      ejemplo: { titulo: 'Cocina Doña Chela', lema: 'Comida casera desde 1994', servicios: 'Comida corrida\nBanquetes\nPedidos para oficinas', whatsapp: '33 2810 4471', direccion: 'Tlaquepaque, Jalisco' },
      dibujar(k) {
        const { W, H, u, p } = k;
        const s = segura(W, H);
        const el = [];
        if (k.foto) el.push(k.I('foto', 0, 0, s.x + u * 8, H), k.I('foto', s.x + s.w - u * 8, 0, W - s.x - s.w + u * 8, H));
        else el.push(k.R(0, 0, s.x - u * 4, H, p.suave), k.R(s.x + s.w + u * 4, 0, W - s.x - s.w - u * 4, H, p.suave));
        el.push(k.T('lema', { x: s.x, y: u * 18, w: s.w, tam: u * 4.4, alin: 'centro', mayus: true, espaciado: 260, color: p.acento, maxLineas: 1 }));
        el.push(k.T('titulo', { x: s.x + u * 6, y: H * 0.47, vy: 'centro', w: s.w - u * 12, tam: u * 17, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 1 }));
        el.push(k.X(renglones(k.d.servicios).join('  ·  '), { x: s.x + u * 4, y: H * 0.66, w: s.w - u * 8, tam: u * 4.4, alin: 'centro', id: 'servicios', campo: 'servicios', maxLineas: 1 }));
        el.push(enLinea(k, ['whatsapp', 'direccion', 'web'], { x: s.x, y: H - u * 14, vy: 'abajo', w: s.w, tam: u * 3.6, alin: 'centro', fuente: 'extra', maxLineas: 1, color: p.acento }));
        return [{ el }];
      },
    },
    {
      id: 'foto-derecha', nombre: 'Foto a la derecha',
      fuentes: { titulo: 'archivo-700', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#0E1B2C', tinta: '#FFFFFF', acento: '#4CC9F0', suave: '#18304F' },
      ejemplo: { titulo: 'Clima y refrigeración en Mérida', lema: 'Instalación, mantenimiento y reparación', servicios: 'Minisplit\nCámaras de refrigeración\nPólizas para negocios', whatsapp: '999 310 4482', web: 'climasdelsureste.mx' },
      dibujar(k) {
        const { W, H, u, p } = k;
        const s = segura(W, H);
        const el = [];
        const corte = s.x + s.w * 0.62;
        el.push(k.foto ? k.I('foto', corte, 0, W - corte, H) : k.R(corte, 0, W - corte, H, p.suave));
        if (!k.foto) for (let i = 0; i < 6; i++) el.push(k.E(corte + u * 10 + i * u * 9, H * 0.5 - u * 30 + i * u * 4, u * 60, u * 60, null, { borde: p.acento, grosor: u * 0.35 }));
        const x = s.x + u * 4, w = corte - x - u * 8;
        el.push(k.T('lema', { x, y: u * 16, w, tam: u * 3.6, color: p.acento, fuente: 'extra', maxLineas: 1 }));
        el.push(k.T('titulo', { x, y: u * 26, w, tam: u * 9, fuente: 'titulo', maxLineas: 3, interlinea: 1.05 }));
        el.push(k.X(renglones(k.d.servicios).join('  ·  '), { x, y: H - u * 26, w, tam: u * 3.4, id: 'servicios', campo: 'servicios', maxLineas: 2, color: k.mezclar(p.tinta, p.fondo, 0.25) }));
        el.push(enLinea(k, ['whatsapp', 'web'], { x, y: H - u * 14, vy: 'abajo', w, tam: u * 3.6, fuente: 'extra', maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'letras', nombre: 'Letras grandes',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F7C948', tinta: '#141414', acento: '#141414', suave: '#141414' },
      ejemplo: { titulo: 'Mudanzas El Rápido', lema: 'Fletes locales y foráneos', servicios: 'Mudanzas\nFletes\nEmbalaje', whatsapp: '55 4120 3398', direccion: 'Toda la CDMX y Edomex' },
      dibujar(k) {
        const { W, H, u, p } = k;
        const s = segura(W, H);
        const claro = k.oscuro(p.suave) ? '#FFFFFF' : '#141414';
        const el = [k.R(0, H - u * 22, W, u * 22, p.suave)];
        el.push(k.T('titulo', { x: s.x, y: H * 0.37, vy: 'centro', w: s.w, tam: u * 22, fuente: 'titulo', mayus: true, alin: 'centro', maxLineas: 2, interlinea: 0.9, h: H * 0.5 }));
        el.push(k.T('lema', { x: s.x, y: H - u * 33, vy: 'abajo', w: s.w, tam: u * 4.6, fuente: 'extra', alin: 'centro', maxLineas: 1 }));
        el.push(enLinea(k, ['whatsapp', 'direccion'], { x: s.x, y: H - u * 11, vy: 'centro', w: s.w, tam: u * 4.4, alin: 'centro', fuente: 'extra', color: claro, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'franjas', nombre: 'Franjas',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#22313F', acento: '#F25F5C', suave: '#70C1B3' },
      ejemplo: { titulo: 'Guardería Pequeños Pasos', lema: 'Cuidado y estimulación de 6 meses a 4 años', servicios: 'Horario extendido\nAlimentación incluida\nCámaras en salones', whatsapp: '81 1122 9087', direccion: 'San Nicolás de los Garza' },
      dibujar(k) {
        const { W, H, u, p } = k;
        const s = segura(W, H);
        const el = [];
        const colores = [p.acento, p.suave, '#FFE066', p.acento, p.suave];
        colores.slice(0, 3).forEach((c, i) => el.push(k.R((W / 3) * i, H - u * 5, W / 3, u * 5, c)));
        if (k.logo) el.push(k.I('logo', s.x + s.w / 2 - u * 12, u * 10, u * 24, u * 12));
        el.push(k.T('titulo', { x: s.x + u * 4, y: H * 0.44, vy: 'centro', w: s.w - u * 8, tam: u * 11, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 1 }));
        el.push(k.T('lema', { x: s.x + u * 4, y: H * 0.62, w: s.w - u * 8, tam: u * 4.2, alin: 'centro', maxLineas: 2 }));
        el.push(enLinea(k, ['whatsapp', 'direccion'], { x: s.x, y: H - u * 14, vy: 'abajo', w: s.w, tam: u * 3.6, alin: 'centro', fuente: 'extra', color: p.acento, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'oscuro', nombre: 'Oscuro elegante',
      fuentes: { titulo: 'cinzel', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#121212', tinta: '#EDE6DA', acento: '#BFA06A', suave: '#1C1C1C' },
      ejemplo: { titulo: 'Notaría Pública 27', lema: 'Lic. Arturo Méndez Salas', servicios: 'Escrituras\nTestamentos\nPoderes', whatsapp: '477 210 4490', direccion: 'León, Guanajuato' },
      dibujar(k) {
        const { W, H, u, p } = k;
        const s = segura(W, H);
        const el = [k.L(s.x + u * 10, H * 0.32, s.x + s.w - u * 10, H * 0.32, p.acento, u * 0.25), k.L(s.x + u * 10, H * 0.7, s.x + s.w - u * 10, H * 0.7, p.acento, u * 0.25)];
        if (k.foto) el.push(k.I('foto', 0, 0, s.x - u * 4, H), k.I('foto', s.x + s.w + u * 4, 0, W - s.x - s.w - u * 4, H));
        el.push(k.T('lema', { x: s.x, y: H * 0.32 - u * 6, vy: 'abajo', w: s.w, tam: u * 4, alin: 'centro', color: p.acento, maxLineas: 1 }));
        el.push(k.T('titulo', { x: s.x + u * 8, y: H * 0.51, vy: 'centro', w: s.w - u * 16, tam: u * 11, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 1.05 }));
        el.push(k.X(renglones(k.d.servicios).join('  ·  '), { x: s.x, y: H * 0.7 + u * 6, w: s.w, tam: u * 3.6, alin: 'centro', mayus: true, espaciado: 160, id: 'servicios', campo: 'servicios', maxLineas: 1 }));
        el.push(enLinea(k, ['whatsapp', 'direccion'], { x: s.x, y: H - u * 10, vy: 'abajo', w: s.w, tam: u * 3.4, alin: 'centro', maxLineas: 1, color: k.mezclar(p.tinta, p.fondo, 0.35) }));
        return [{ el }];
      },
    },
  ],
};
