// Diseños de arranque: cartel y póster (carta, tabloide y 60 × 90 cm).
import { lista, enLinea } from './_piezas.js';

const campos = [
  { id: 'titulo', etiqueta: 'Título', tipo: 'area', filas: 2 },
  { id: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'area', filas: 2 },
  { id: 'fecha', etiqueta: 'Fecha y hora' },
  { id: 'dato', etiqueta: 'Precio o dato grande' },
  { id: 'detalles', etiqueta: 'Detalles (uno por renglón)', tipo: 'area', filas: 3 },
  { id: 'negocio', etiqueta: 'Quién organiza' },
  { id: 'direccion', etiqueta: 'Lugar o dirección', tipo: 'area', filas: 2 },
  { id: 'whatsapp', etiqueta: 'WhatsApp o teléfono', tipo: 'tel' },
  { id: 'web', etiqueta: 'Página o red social' },
];

export default (modo) => ({
  archivo: modo === 'poster' ? 'poster' : 'cartel',
  formatos: [
    { id: 'carta', nombre: 'Carta', ancho: 215.9, alto: 279.4, u: 'mm' },
    { id: 'tabloide', nombre: 'Tabloide', ancho: 279.4, alto: 431.8, u: 'mm' },
    { id: '60x90', nombre: '60 × 90 cm', ancho: 600, alto: 900, u: 'mm' },
  ],
  campos,
  imagenes: ['logo', 'foto'],
  qr: true,
  disenos: [
    {
      id: 'tipografico', nombre: 'Letra grande',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F7D23E', tinta: '#111111', acento: '#111111', suave: '#111111' },
      ejemplo: {
        titulo: 'Venta de garage', subtitulo: 'Muebles, ropa, juguetes y herramienta. Todo en buen estado.', fecha: 'Sábado 22 y domingo 23 · 8 am a 3 pm', dato: 'Desde $10',
        negocio: 'Familia Ortega', direccion: 'Privada Los Pinos 14, Col. Jardines, Saltillo', whatsapp: '844 219 3307',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const pie = H - m - u * 14;
        const el = k.encajar((z) => {
          const e = [];
          let y = m;
          const f = k.T('fecha', { x: m, y, w: W - 2 * m, tam: u * 4.6 * z, fuente: 'extra', mayus: true, espaciado: 30, maxLineas: 2 });
          e.push(f); if (f) y += k.medir(f).h + u * 3;
          e.push(k.R(m, y, W - 2 * m, u * 1.2, p.acento)); y += u * 5;
          const tt = k.T('titulo', { x: m - u * 0.6, y, w: W - 2 * m, tam: u * 40 * z, fuente: 'titulo', mayus: true, maxLineas: 4, interlinea: 0.88 });
          e.push(tt); y += k.medir(tt).h + u * 5;
          if (k.foto) { e.push(k.I('foto', m, y, W - 2 * m, H * 0.2)); y += H * 0.2 + u * 5; }
          const d = k.T('dato', { x: m, y, w: W - 2 * m, tam: u * 12 * z, fuente: 'titulo', mayus: true, maxLineas: 1 });
          e.push(d); if (d) y += k.medir(d).h + u * 4;
          const st = k.T('subtitulo', { x: m, y, w: W * 0.75, tam: u * 4.6 * z, maxLineas: 3 });
          e.push(st); if (st) y += k.medir(st).h + u * 3;
          const l = lista(k, { x: m, y, w: W - 2 * m, tam: u * 4 * z, color: p.tinta, colorMarca: p.acento });
          e.push(...l.el);
          return { el: e, y: l.y };
        }, pie - u * 3);
        const qr = k.Q(W - m - u * 16, H - m - u * 16, u * 16);
        el.push(k.R(m, pie, W - 2 * m - (qr ? u * 20 : 0), u * 0.5, p.acento),
          enLinea(k, ['direccion'], { x: m, y: pie + u * 3.5, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 3.6, fuente: 'extra', maxLineas: 1 }),
          enLinea(k, ['whatsapp', 'web', 'negocio'], { x: m, y: pie + u * 9, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 3.3, maxLineas: 1 }), qr,
          k.logo ? k.I('logo', W - m - u * 22, m, u * 22, u * 12, { ax: 1, ay: 0 }) : null);
        return [{ el }];
      },
    },
    {
      id: 'reticula', nombre: 'Retícula',
      fuentes: { titulo: 'archivo-700', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F2F0EB', tinta: '#141414', acento: '#E23D28', suave: '#FFFFFF' },
      ejemplo: {
        titulo: 'Clases de natación verano 2026', subtitulo: 'Niños de 4 a 12 años. Grupos de 6 alumnos por instructor.', fecha: 'Del 6 de julio al 14 de agosto', dato: '$1,450 al mes',
        detalles: 'Lunes, miércoles y viernes\nAlberca techada a 29 °C\nInscripción con certificado médico',
        negocio: 'Club Acuático Delfines', direccion: 'Av. Universidad 2300, Hermosillo', whatsapp: '662 410 8823', web: 'delfineshmo.mx',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const col = (W - 2 * m) / 2;
        const el = [];
        el.push(k.R(0, 0, W, H * 0.5, k.foto ? p.fondo : p.acento));
        if (k.foto) el.push(k.I('foto', 0, 0, W, H * 0.5));
        const blanco = k.oscuro(p.acento) ? '#FFFFFF' : '#141414';
        const tt = k.T('titulo', { x: m, y: H * 0.5 - u * 6, vy: 'abajo', w: W - 2 * m, tam: u * 14, fuente: 'titulo', maxLineas: 4, interlinea: 0.98, h: H * 0.5 - u * 26, color: k.foto ? '#FFFFFF' : blanco });
        if (k.foto && tt) { const ht = k.medir(tt).h; el.push(k.R(0, H * 0.5 - u * 12 - ht, W, ht + u * 12, p.acento, { id: 'titulo' })); }
        el.push(tt);
        el.push(k.logo ? k.I('logo', m, m, u * 24, u * 12, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y: m, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', color: k.foto ? '#FFFFFF' : blanco, maxLineas: 1 }));
        el.push(...k.encajar((z) => {
          const e = [];
          let y = H * 0.5 + u * 7;
          const f = k.T('fecha', { x: m, y, w: col - u * 4, tam: u * 4.4 * z, fuente: 'extra', maxLineas: 3 });
          const d = k.T('dato', { x: m + col, y, w: col, tam: u * 7 * z, fuente: 'titulo', color: p.acento, maxLineas: 2 });
          e.push(f, d);
          y += Math.max(f ? k.medir(f).h : 0, d ? k.medir(d).h : 0) + u * 6;
          const st = k.T('subtitulo', { x: m, y, w: col - u * 4, tam: u * 3.8 * z, maxLineas: 5 });
          const l = lista(k, { x: m + col, y, w: col, tam: u * 3.6 * z, color: p.tinta, colorMarca: p.acento, marca: 'raya' });
          e.push(st, ...l.el);
          return { el: e, y: Math.max(st ? y + k.medir(st).h : y, l.y) };
        }, H - m - u * 16));
        const qr = k.Q(W - m - u * 15, H - m - u * 15, u * 15);
        el.push(k.L(m, H - m - u * 13, W - m, H - m - u * 13, p.tinta, u * 0.3),
          enLinea(k, ['direccion'], { x: m, y: H - m - u * 9, w: W - 2 * m - (qr ? u * 19 : 0), tam: u * 3.2, fuente: 'extra', maxLineas: 1 }),
          enLinea(k, ['whatsapp', 'web'], { x: m, y: H - m - u * 4, w: W - 2 * m - (qr ? u * 19 : 0), tam: u * 3.2, maxLineas: 1 }), qr);
        if (qr) qr.y = H - m - u * 12;
        if (qr) { qr.w = u * 12; qr.x = W - m - u * 12; }
        return [{ el }];
      },
    },
    {
      id: 'elegante', nombre: 'Elegante',
      fuentes: { titulo: 'fraunces-300', texto: 'instrument', extra: 'archivo-400' },
      paleta: { fondo: '#1C1A17', tinta: '#EFE6D6', acento: '#C9A86A', suave: '#2A2723' },
      ejemplo: {
        titulo: 'Cata de vinos mexicanos', subtitulo: 'Seis etiquetas del Valle de Guadalupe con quesos de Querétaro', fecha: 'Jueves 4 de diciembre · 8 pm', dato: '$690 por persona',
        negocio: 'La Cava de San Ángel', direccion: 'Calle Madero 8, San Ángel, CDMX', whatsapp: '55 2918 4406',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 9;
        const el = [k.R(u * 4, u * 4, W - u * 8, H - u * 8, null, { borde: p.acento, grosor: u * 0.25 })];
        el.push(...k.encajar((z) => {
          const e = [];
          let y = m + u * 6;
          e.push(k.logo ? k.I('logo', W / 2 - u * 14, y, u * 28, u * 14) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 3.2, fuente: 'extra', alin: 'centro', mayus: true, espaciado: 300, color: p.acento, maxLineas: 1 }));
          y += k.logo ? u * 22 : u * 16;
          if (k.foto) { e.push(k.I('foto', W / 2 - u * 26, y, u * 52, u * 52, { radio: 'circulo' })); y += u * 60; }
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 15 * z, fuente: 'titulo', alin: 'centro', maxLineas: 4, interlinea: 1.02 });
          e.push(tt); y += k.medir(tt).h + u * 7;
          e.push(k.L(W / 2 - u * 8, y, W / 2 + u * 8, y, p.acento, u * 0.3)); y += u * 7;
          const st = k.T('subtitulo', { x: m * 1.5, y, w: W - 3 * m, tam: u * 5.4 * z, alin: 'centro', maxLineas: 3, interlinea: 1.2 });
          e.push(st); if (st) y += k.medir(st).h + u * 6;
          const l = lista(k, { x: m * 1.5, y, w: W - 3 * m, tam: u * 4 * z, marca: 'nada', alin: 'centro', color: p.tinta });
          e.push(...l.el);
          return { el: e, y: l.y };
        }, H - m - u * (k.qr ? 46 : 32)));
        const qr = k.Q(W / 2 - u * 7, H - m - u * 42, u * 14);
        el.push(
          k.T('fecha', { x: m, y: H - m - u * 24, w: W - 2 * m, tam: u * 5.5, fuente: 'titulo', alin: 'centro', color: p.acento, maxLineas: 1 }),
          k.T('dato', { x: m, y: H - m - u * 16, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', alin: 'centro', mayus: true, espaciado: 200, maxLineas: 1 }),
          enLinea(k, ['direccion', 'whatsapp', 'web'], { x: m, y: H - m - u * 9, w: W - 2 * m, tam: u * 3, fuente: 'extra', alin: 'centro', color: k.mezclar(p.tinta, p.fondo, 0.3) }));
        el.push(qr);
        return [{ el }];
      },
    },
    {
      id: 'bloques', nombre: 'Bloques',
      fuentes: { titulo: 'bricolage', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFF4E8', tinta: '#2B1B17', acento: '#D9480F', suave: '#2F6B4F' },
      ejemplo: {
        titulo: 'Feria del mole', subtitulo: 'Doce cocineras de Milpa Alta, música en vivo y talleres para niños', fecha: '15 y 16 de noviembre', dato: 'Entrada libre',
        detalles: 'Mole poblano, verde y almendrado\nTamales y atole de la región\nVenta de pasta de mole por kilo',
        negocio: 'Comité de feria San Pedro Atocpan', direccion: 'Explanada principal, San Pedro Atocpan, CDMX', web: '@feriadelmole',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const blanco = k.oscuro(p.acento) ? '#FFFFFF' : p.tinta;
        const blanco2 = k.oscuro(p.suave) ? '#FFFFFF' : p.tinta;
        const alto1 = H * 0.42;
        const el = [k.R(0, 0, W, alto1, p.acento)];
        if (k.foto) el.push(k.I('foto', W * 0.55, 0, W * 0.45, alto1));
        el.push(k.E(W * (k.foto ? 0.4 : 0.62), alto1 - W * 0.22, W * 0.44, W * 0.44, p.suave));
        el.push(k.T('titulo', { x: m, y: alto1 - u * 8, vy: 'abajo', w: W * (k.foto ? 0.5 : 0.82), tam: u * 17, fuente: 'titulo', maxLineas: 3, interlinea: 0.92, h: alto1 - u * 30, color: blanco }));
        el.push(k.T('fecha', { x: m, y: m, w: W * 0.6, tam: u * 5, fuente: 'extra', color: blanco, maxLineas: 2 }));
        el.push(k.T('dato', { x: W * 0.665, y: alto1 + W * 0.06, w: W * 0.3, tam: u * 5, fuente: 'titulo', alin: 'centro', color: blanco2, maxLineas: 2 }));
        el.push(...k.encajar((z) => {
          const e = [];
          let y = alto1 + u * 8;
          const st = k.T('subtitulo', { x: m, y, w: W * 0.55, tam: u * 5 * z, fuente: 'titulo', maxLineas: 4, interlinea: 1.1 });
          e.push(st); if (st) y += k.medir(st).h + u * 8;
          const l = lista(k, { x: m, y, w: W - 2 * m, tam: u * 4 * z, color: p.tinta, colorMarca: p.acento, marca: 'punto' });
          e.push(...l.el);
          return { el: e, y: l.y };
        }, H - m - u * 20));
        const qr = k.Q(W - m - u * 16, H - m - u * 16, u * 16);
        el.push(k.logo ? k.I('logo', W - m - u * 24, m, u * 24, u * 12, { ax: 1, ay: 0 }) : null,
          k.T('negocio', { x: m, y: H - m - u * 14, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 3.6, fuente: 'extra', maxLineas: 1 }),
          enLinea(k, ['direccion', 'whatsapp', 'web'], { x: m, y: H - m - u * 8, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 3.2 }), qr);
        return [{ el }];
      },
    },
    {
      id: 'inscripciones', nombre: 'Inscripciones',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#1B1F3B', acento: '#3D5AFE', suave: '#EEF0FF' },
      ejemplo: {
        titulo: 'Inscripciones abiertas', subtitulo: 'Primaria con inglés diario, robótica y comedor. Grupos de 22 alumnos.', fecha: 'Ciclo escolar 2027-2028', dato: 'Sin cuota de inscripción en noviembre',
        detalles: 'Visitas guiadas de lunes a viernes\nBeca por hermanos\nTransporte escolar en Zapopan',
        negocio: 'Colegio Nuevo Horizonte', direccion: 'Av. Patria 1890, Zapopan, Jal.', whatsapp: '33 3812 9047', web: 'nuevohorizonte.edu.mx',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const el = [k.R(0, 0, W * 0.035, H, p.acento)];
        el.push(...k.encajar((z) => {
          const e = [];
          let y = m;
          e.push(k.logo ? k.I('logo', m, y, u * 30, u * 14, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 4, fuente: 'extra', color: p.acento, maxLineas: 1 }));
          y += k.logo ? u * 22 : u * 14;
          const f = k.T('fecha', { x: m, y, w: W - 2 * m, tam: u * 4 * z, mayus: true, espaciado: 120, maxLineas: 1 });
          e.push(f); if (f) y += u * 8;
          const tt = k.T('titulo', { x: m - u * 0.4, y, w: W - 2 * m, tam: u * 15 * z, fuente: 'titulo', maxLineas: 3, interlinea: 0.98 });
          e.push(tt); y += k.medir(tt).h + u * 6;
          if (k.foto) { e.push(k.I('foto', m, y, W - 2 * m, H * 0.24, { radio: u * 3 })); y += H * 0.24 + u * 6; }
          const st = k.T('subtitulo', { x: m, y, w: W * 0.78, tam: u * 4.6 * z, maxLineas: 3 });
          e.push(st); if (st) y += k.medir(st).h + u * 6;
          const d = k.T('dato', { x: m + u * 5, y: y + u * 5, w: W - 2 * m - u * 10, tam: u * 4.4 * z, fuente: 'extra', color: p.acento, maxLineas: 2 });
          if (d) { const hd = k.medir(d).h; e.push(k.R(m, y, W - 2 * m, hd + u * 10, p.suave, { radio: u * 2, id: 'dato' }), d); y += hd + u * 16; }
          const l = lista(k, { x: m, y, w: W - 2 * m, tam: u * 4 * z, color: p.tinta, colorMarca: p.acento, marca: 'punto' });
          e.push(...l.el);
          return { el: e, y: l.y };
        }, H - m - u * 16));
        const qr = k.Q(W - m - u * 16, H - m - u * 16, u * 16);
        el.push(enLinea(k, ['whatsapp', 'web'], { x: m, y: H - m - u * 13, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 3.6, fuente: 'extra', maxLineas: 1 }),
          enLinea(k, ['direccion'], { x: m, y: H - m - u * 7, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 3.4, maxLineas: 1 }), qr);
        return [{ el }];
      },
    },
  ],
});
