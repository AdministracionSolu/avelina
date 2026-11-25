// Diseños de arranque: lona y banner (medidas en metros, pendón vertical y banner para web).
import { renglones, enLinea } from './_piezas.js';

const campos = [
  { id: 'titulo', etiqueta: 'Título', tipo: 'area', filas: 2 },
  { id: 'subtitulo', etiqueta: 'Subtítulo' },
  { id: 'dato', etiqueta: 'Precio, oferta o dato grande' },
  { id: 'servicios', etiqueta: 'Servicios o productos (uno por renglón)', tipo: 'area', filas: 4 },
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'telefono', etiqueta: 'Teléfono o WhatsApp', tipo: 'tel' },
  { id: 'direccion', etiqueta: 'Dirección' },
  { id: 'web', etiqueta: 'Página o red social' },
];

export default (modo) => ({
  archivo: modo === 'banner' ? 'banner' : 'lona',
  formatos: [
    { id: '3x1', nombre: '3 × 1 m', ancho: 3000, alto: 1000, u: 'mm' },
    { id: '2x1', nombre: '2 × 1 m', ancho: 2000, alto: 1000, u: 'mm' },
    { id: 'pendon', nombre: 'Pendón 0.8 × 2 m', ancho: 800, alto: 2000, u: 'mm' },
    { id: 'web', nombre: 'Para web 1200 × 628', ancho: 1200, alto: 628, u: 'px' },
    { id: 'medida', nombre: 'A tu medida', ancho: 1500, alto: 1000, u: 'mm', medida: true },
  ],
  formatoInicial: modo === 'banner' ? '2x1' : '3x1',
  campos,
  imagenes: ['logo', 'foto'],
  qr: true,
  disenos: [
    {
      id: 'telefono', nombre: 'Teléfono grande',
      fuentes: { titulo: 'archivo-angosta', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFFFFF', tinta: '#121212', acento: '#D62828', suave: '#F1F1F1' },
      ejemplo: {
        negocio: 'Plomería y Gas Hernández', titulo: 'Plomería y gas', subtitulo: 'Servicio a domicilio en todo Monterrey',
        servicios: 'Fugas de agua y gas\nCalentadores y boilers\nDestape de drenaje\nInstalación de tinacos', telefono: '81 1934 5520', direccion: 'Av. Ruiz Cortines 4410, Monterrey',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const blanco = k.oscuro(p.acento) ? '#FFFFFF' : '#121212';
        const el = [];
        if (k.horizontal) {
          const izq = W * 0.58;
          el.push(k.R(izq, 0, W - izq, H, p.acento));
          el.push(k.logo ? k.I('logo', m, m, u * 40, u * 18, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y: m, w: izq - 2 * m, tam: u * 6, fuente: 'extra', color: p.acento, maxLineas: 1 }));
          el.push(k.T('titulo', { x: m - u, y: u * 30, w: izq - 2 * m, tam: u * 30, fuente: 'titulo', mayus: true, maxLineas: 2, interlinea: 0.9, h: u * 46 }));
          el.push(k.T('subtitulo', { x: m, y: H - m - u * 6, vy: 'abajo', w: izq - 2 * m, tam: u * 6, maxLineas: 2 }));
          const sv = renglones(k.d.servicios);
          let y = m + u * 2;
          const tamS = Math.min(u * 6.5, (H - u * 44 - m) / Math.max(1, sv.length) / 1.55);
          sv.forEach((s) => { const e = k.X(s, { x: izq + m, y, w: W - izq - 2 * m, tam: tamS, color: blanco, id: 'servicios', campo: 'servicios', maxLineas: 1 }); el.push(e); y += tamS * 1.55; });
          const qr = k.Q(W - m - u * 22, H - m - u * 22, u * 22, { sobre: p.acento });
          el.push(k.T('telefono', { x: izq + m, y: H - m - u * 3, vy: 'abajo', w: W - izq - 2 * m - (qr ? u * 26 : 0), tam: u * 16, fuente: 'titulo', color: blanco, maxLineas: 1 }), qr);
          el.push(k.T('direccion', { x: izq + m, y: H - m - u * 23, vy: 'abajo', w: W - izq - 2 * m, tam: u * 4.5, color: blanco, maxLineas: 1 }));
        } else {
          el.push(k.R(0, H * 0.62, W, H * 0.38, p.acento));
          el.push(k.logo ? k.I('logo', m, m, u * 50, u * 22, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y: m, w: W - 2 * m, tam: u * 7, fuente: 'extra', color: p.acento, maxLineas: 2 }));
          const bloque = [k.T('titulo', { x: m - u, w: W - 2 * m, tam: u * 34, fuente: 'titulo', mayus: true, maxLineas: 3, interlinea: 0.9, h: H * 0.3, sep: u * 8 }), k.T('subtitulo', { x: m, w: W - 2 * m, tam: u * 8, maxLineas: 3 })];
          k.flujo(u * 38, bloque);
          el.push(...bloque);
          let y = H * 0.62 + m;
          for (const s of renglones(k.d.servicios)) { const e = k.X(s, { x: m, y, w: W - 2 * m, tam: u * 7, color: blanco, id: 'servicios', campo: 'servicios', maxLineas: 1 }); el.push(e); y += u * 11; }
          el.push(k.T('telefono', { x: m, y: H - m, vy: 'abajo', w: W - 2 * m, tam: u * 20, fuente: 'titulo', color: blanco, maxLineas: 1 }));
        }
        return [{ el }];
      },
    },
    {
      id: 'apertura', nombre: 'Gran apertura',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#14342B', tinta: '#F4EDE0', acento: '#F2B544', suave: '#1D4639' },
      ejemplo: {
        titulo: 'Gran apertura', subtitulo: 'Café de Veracruz tostado aquí mismo', dato: 'Sábado 6 de diciembre',
        negocio: 'Café La Molienda', telefono: '228 190 4472', direccion: 'Calle Enríquez 52, Centro, Xalapa', web: '@cafelamolienda',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const el = [k.R(u * 3, u * 3, W - u * 6, H - u * 6, null, { borde: p.acento, grosor: u * 0.6 })];
        if (k.horizontal) {
          const fw = k.foto ? W * 0.36 : 0;
          if (k.foto) el.push(k.I('foto', W - fw - u * 7, u * 7, fw, H - u * 14));
          const cx = (W - fw - (k.foto ? u * 7 : 0)) / 2, ancho = W - fw - 2 * m - (k.foto ? u * 10 : 0);
          el.push(k.logo ? k.I('logo', cx - u * 20, m, u * 40, u * 18) : k.T('negocio', { x: cx - ancho / 2, y: m + u * 2, w: ancho, tam: u * 5, fuente: 'extra', alin: 'centro', mayus: true, espaciado: 300, color: p.acento, maxLineas: 1 }));
          el.push(k.T('titulo', { x: cx - ancho / 2, y: H * 0.52, vy: 'centro', w: ancho, tam: u * 30, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 0.95, h: u * 44 }));
          el.push(k.T('dato', { x: cx - ancho / 2, y: H * 0.76, w: ancho, tam: u * 6.5, fuente: 'extra', alin: 'centro', color: p.acento, maxLineas: 1 }));
          el.push(enLinea(k, ['subtitulo'], { x: cx - ancho / 2, y: u * 24, w: ancho, tam: u * 6.5, alin: 'centro', maxLineas: 1 }));
          el.push(enLinea(k, ['telefono', 'direccion', 'web'], { x: cx - ancho / 2, y: H - m, vy: 'abajo', w: ancho, tam: u * 5, alin: 'centro', maxLineas: 1 }));
        } else {
          let y = m + u * 4;
          el.push(k.logo ? k.I('logo', W / 2 - u * 25, y, u * 50, u * 22) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 6, fuente: 'extra', alin: 'centro', mayus: true, espaciado: 200, color: p.acento, maxLineas: 2 }));
          if (k.foto) el.push(k.I('foto', m, H * 0.56, W - 2 * m, H * 0.3));
          el.push(k.T('titulo', { x: m, y: H * 0.3, vy: 'centro', w: W - 2 * m, tam: u * 30, fuente: 'titulo', alin: 'centro', maxLineas: 3, interlinea: 0.95, h: H * 0.3 }));
          el.push(k.T('subtitulo', { x: m, y: H * 0.47, w: W - 2 * m, tam: u * 6, alin: 'centro', maxLineas: 2 }));
          el.push(k.T('dato', { x: m, y: k.foto ? H * 0.88 : H * 0.62, w: W - 2 * m, tam: u * 8, fuente: 'extra', alin: 'centro', color: p.acento, maxLineas: 2 }));
          el.push(enLinea(k, ['telefono', 'direccion', 'web'], { x: m, y: H - m, vy: 'abajo', w: W - 2 * m, tam: u * 4.5, alin: 'centro', maxLineas: 3, sep: '\n' }));
        }
        return [{ el }];
      },
    },
    {
      id: 'promocion', nombre: 'Promoción',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFE14D', tinta: '#111111', acento: '#111111', suave: '#FFFFFF' },
      ejemplo: {
        dato: '30%', titulo: 'En todas las llantas', subtitulo: 'Alineación y balanceo gratis en la compra de 4', servicios: 'Hasta el 31 de diciembre',
        negocio: 'Llantera El Güero', telefono: '871 288 6142', direccion: 'Blvd. Revolución 1880, Torreón',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const el = [];
        const claro = k.oscuro(p.acento) ? '#FFFFFF' : '#111111';
        if (k.horizontal) {
          const d = k.T('dato', { x: m - u * 1, y: H * 0.5, vy: 'centro', tam: u * 74, fuente: 'titulo', maxLineas: 1, w: W * 0.42, h: H - 2 * m });
          const dw = d ? k.medir(d).w : 0;
          el.push(d);
          const x2 = m + dw + u * 8, w2 = W - x2 - m;
          el.push(k.T('titulo', { x: x2, y: m + u * 6, w: w2, tam: u * 15, fuente: 'titulo', mayus: true, maxLineas: 2, interlinea: 0.95, h: u * 32 }));
          el.push(k.T('subtitulo', { x: x2, y: u * 48, w: w2, tam: u * 7, maxLineas: 2 }));
          el.push(enLinea(k, ['servicios'], { x: x2, y: u * 68, w: w2, tam: u * 5.5, fuente: 'extra', maxLineas: 1 }));
          el.push(k.R(0, H - u * 18, W, u * 18, p.acento));
          el.push(k.T('negocio', { x: m, y: H - u * 9, vy: 'centro', w: W * 0.4, tam: u * 7, fuente: 'titulo', mayus: true, color: claro, maxLineas: 1 }));
          el.push(enLinea(k, ['telefono', 'direccion'], { x: W * 0.4, y: H - u * 9, vy: 'centro', w: W * 0.6 - m, tam: u * 5, alin: 'der', color: claro, fuente: 'extra', maxLineas: 1 }));
        } else {
          el.push(k.T('dato', { x: m, y: m, w: W - 2 * m, tam: u * 60, fuente: 'titulo', alin: 'centro', maxLineas: 1 }));
          el.push(k.T('titulo', { x: m, y: H * 0.38, w: W - 2 * m, tam: u * 16, fuente: 'titulo', alin: 'centro', mayus: true, maxLineas: 3, interlinea: 0.95 }));
          el.push(k.T('subtitulo', { x: m, y: H * 0.62, w: W - 2 * m, tam: u * 6, alin: 'centro', maxLineas: 3 }));
          el.push(enLinea(k, ['servicios'], { x: m, y: H * 0.74, w: W - 2 * m, tam: u * 5, fuente: 'extra', alin: 'centro' }));
          el.push(k.R(0, H - u * 40, W, u * 40, p.acento));
          el.push(k.T('negocio', { x: m, y: H - u * 33, w: W - 2 * m, tam: u * 9, fuente: 'titulo', alin: 'centro', mayus: true, color: claro, maxLineas: 1 }));
          el.push(enLinea(k, ['telefono', 'direccion'], { x: m, y: H - u * 19, w: W - 2 * m, tam: u * 5.5, alin: 'centro', color: claro, fuente: 'extra', sep: '\n', maxLineas: 3 }));
        }
        el.push(k.logo ? k.I('logo', W - m - u * 30, m, u * 30, u * 16, { ax: 1, ay: 0 }) : null);
        return [{ el }];
      },
    },
    {
      id: 'foto', nombre: 'Con foto',
      fuentes: { titulo: 'bricolage', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F6F1EA', tinta: '#22201C', acento: '#3A6EA5', suave: '#DCE6F0' },
      ejemplo: {
        titulo: 'Clases de inglés para niños', subtitulo: 'Grupos de 8 · De 5 a 12 años', dato: 'Clase muestra sin costo',
        servicios: 'Lunes a viernes por la tarde\nSábados de 9 a 1', negocio: 'Kids English House', telefono: '444 210 7731', web: 'kidsenglishhouse.mx',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const el = [];
        const claro = k.oscuro(p.acento) ? '#FFFFFF' : '#111111';
        if (k.horizontal) {
          const fw = W * 0.42;
          el.push(k.foto ? k.I('foto', W - fw, 0, fw, H) : k.R(W - fw, 0, fw, H, p.suave));
          if (!k.foto) el.push(k.E(W - fw / 2 - u * 30, H / 2 - u * 30, u * 60, u * 60, p.acento), k.T('dato', { x: W - fw / 2 - u * 26, y: H / 2, vy: 'centro', w: u * 52, tam: u * 8, fuente: 'titulo', alin: 'centro', color: claro, maxLineas: 3 }));
          const w2 = W - fw - 2 * m;
          el.push(k.logo ? k.I('logo', m, m, u * 36, u * 16, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y: m, w: w2, tam: u * 5.5, fuente: 'extra', color: p.acento, maxLineas: 1 }));
          el.push(k.T('titulo', { x: m, y: u * 28, w: w2, tam: u * 17, fuente: 'titulo', maxLineas: 3, interlinea: 0.95, h: u * 40 }));
          el.push(k.T('subtitulo', { x: m, y: u * 72, w: w2, tam: u * 5.5, maxLineas: 1 }));
          if (k.foto) el.push(k.T('dato', { x: m, y: u * 81, w: w2, tam: u * 5.5, fuente: 'extra', color: p.acento, maxLineas: 1 }));
          el.push(enLinea(k, ['telefono', 'web'], { x: m, y: H - m + u * 2, vy: 'abajo', w: w2, tam: u * 4.4, fuente: 'extra', maxLineas: 1 }));
        } else {
          el.push(k.foto ? k.I('foto', 0, 0, W, H * 0.45) : k.R(0, 0, W, H * 0.45, p.suave));
          if (!k.foto) el.push(k.T('dato', { x: m, y: H * 0.225, vy: 'centro', w: W - 2 * m, tam: u * 10, fuente: 'titulo', alin: 'centro', color: p.acento, maxLineas: 3 }));
          el.push(k.logo ? k.I('logo', m, H * 0.45 + m, u * 50, u * 20, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y: H * 0.45 + m, w: W - 2 * m, tam: u * 7, fuente: 'extra', color: p.acento, maxLineas: 2 }));
          el.push(k.T('titulo', { x: m, y: H * 0.56, w: W - 2 * m, tam: u * 18, fuente: 'titulo', maxLineas: 4, interlinea: 0.95, h: H * 0.2 }));
          el.push(k.T('subtitulo', { x: m, y: H * 0.8, w: W - 2 * m, tam: u * 6, maxLineas: 2 }));
          el.push(enLinea(k, ['telefono', 'web'], { x: m, y: H - m, vy: 'abajo', w: W - 2 * m, tam: u * 6, fuente: 'extra', sep: '\n', maxLineas: 2 }));
        }
        return [{ el }];
      },
    },
    {
      id: 'evento', nombre: 'Celebración',
      fuentes: { titulo: 'instrument-it', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#F7EDE6', tinta: '#4A2C2A', acento: '#B5654A', suave: '#EBD8CC' },
      ejemplo: {
        titulo: 'Felicidades, generación 2026', subtitulo: 'Licenciatura en Enfermería', dato: 'Con orgullo, sus familias',
        negocio: 'Universidad del Valle de Atemajac', direccion: '', telefono: '',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 10;
        const el = [k.R(0, 0, W, H, p.suave), k.R(u * 5, u * 5, W - u * 10, H - u * 10, p.fondo)];
        const ancho = W - 2 * m - (k.foto && k.horizontal ? W * 0.3 : 0);
        if (k.foto) el.push(k.horizontal ? k.I('foto', W - m - W * 0.28, m, W * 0.28, H - 2 * m, { radio: u * 3 }) : k.I('foto', W / 2 - u * 30, m, u * 60, u * 60, { radio: 'circulo' }));
        const y0 = k.horizontal ? m : (k.foto ? m + u * 70 : m + u * 10);
        el.push(k.T('subtitulo', { x: m, y: y0, w: ancho, tam: u * (k.horizontal ? 5 : 6), alin: 'centro', mayus: true, espaciado: 260, color: p.acento, maxLineas: 2 }));
        el.push(k.T('titulo', { x: m, y: k.horizontal ? H * 0.5 : (k.foto ? y0 + u * 70 : H * 0.42), vy: 'centro', w: ancho, tam: u * (k.horizontal ? 24 : 26), fuente: 'titulo', alin: 'centro', maxLineas: 3, interlinea: 1, h: k.horizontal ? H * 0.5 : H * 0.4 }));
        el.push(k.T('dato', { x: m, y: H - m - u * (k.horizontal ? 12 : 30), w: ancho, tam: u * (k.horizontal ? 5 : 6), fuente: 'extra', alin: 'centro', maxLineas: 2 }));
        el.push(enLinea(k, ['negocio', 'telefono', 'direccion', 'web'], { x: m, y: H - m, vy: 'abajo', w: ancho, tam: u * 3.8, alin: 'centro', maxLineas: 2, color: p.acento }));
        el.push(k.logo ? k.I('logo', (k.horizontal ? m + ancho / 2 : W / 2) - u * 14, k.horizontal ? H - m - u * 30 : H - m - u * 52, u * 28, u * 14) : null);
        return [{ el }];
      },
    },
  ],
});
