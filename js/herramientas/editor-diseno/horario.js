// Diseños de arranque: horario de atención (para la puerta, el mostrador o redes).
import { renglones, partir, enLinea } from './_piezas.js';

const campos = [
  { id: 'titulo', etiqueta: 'Título' },
  { id: 'dias', etiqueta: 'Días y horas', tipo: 'area', filas: 5, ayuda: 'Un renglón por día. Separa el día y la hora con una barra: Lunes | 9:00 a 18:00' },
  { id: 'nota', etiqueta: 'Nota', tipo: 'area', filas: 2 },
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'telefono', etiqueta: 'Teléfono o WhatsApp', tipo: 'tel' },
  { id: 'direccion', etiqueta: 'Dirección' },
];

const filas = (k) => renglones(k.d.dias).map(partir);

// Tabla de días: o {x,y,w,tam,color,colorHora,linea,sep,puntos}
function tabla(k, o) {
  const el = [];
  let y = o.y;
  for (const [dia, hora] of filas(k)) {
    const a = k.X(dia, { x: o.x, y, w: hora ? o.w * 0.48 : o.w, tam: o.tam, color: o.color, fuente: o.fuenteDia || 'texto', id: 'dias', campo: 'dias', maxLineas: 1, mayus: o.mayus, espaciado: o.espaciado || 0 });
    const b = hora ? k.X(hora, { x: o.x + o.w * 0.4, y, w: o.w * 0.6, tam: o.tam, color: o.colorHora || o.color, fuente: o.fuenteHora || 'extra', alin: 'der', id: 'dias', campo: 'dias', maxLineas: 1 }) : null;
    el.push(a, b);
    const alto = k.medir(a).alto;
    if (o.linea) el.push(k.L(o.x, y + alto + o.tam * 0.75, o.x + o.w, y + alto + o.tam * 0.75, o.linea, o.grosor || o.tam * 0.05, { id: 'dias' }));
    y += alto + (o.sep ?? o.tam * 1.5);
  }
  return { el, y };
}

export default {
  archivo: 'horario',
  formatos: [
    { id: 'carta', nombre: 'Carta', ancho: 215.9, alto: 279.4, u: 'mm' },
    { id: 'media-carta', nombre: 'Media carta', ancho: 139.7, alto: 215.9, u: 'mm' },
    { id: 'redes', nombre: 'Para redes 1080 × 1350', ancho: 1080, alto: 1350, u: 'px' },
  ],
  campos,
  imagenes: ['logo'],
  qr: true,
  disenos: [
    {
      id: 'tabla', nombre: 'Tabla',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FAF6EF', tinta: '#1F1A14', acento: '#A0522D', suave: '#EFE6D6' },
      ejemplo: {
        titulo: 'Horario de atención', dias: 'Lunes | 9:00 a 19:00\nMartes | 9:00 a 19:00\nMiércoles | 9:00 a 19:00\nJueves | 9:00 a 19:00\nViernes | 9:00 a 20:00\nSábado | 10:00 a 15:00\nDomingo | Cerrado',
        nota: 'Días festivos abrimos de 10:00 a 14:00', negocio: 'Farmacia San Martín', telefono: '311 214 8803', direccion: 'Av. México 45 Norte, Tepic',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 10;
        const el = k.encajar((z) => {
          const e = [];
          let y = m;
          e.push(k.logo ? k.I('logo', W / 2 - u * 15, y, u * 30, u * 14) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 4, fuente: 'extra', alin: 'centro', mayus: true, espaciado: 200, color: p.acento, maxLineas: 1 }));
          y += k.logo ? u * 22 : u * 12;
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 11 * z, fuente: 'titulo', alin: 'centro', maxLineas: 2, interlinea: 1 });
          e.push(tt); y += k.medir(tt).h + u * 10 * z;
          const t = tabla(k, { x: m, y, w: W - 2 * m, tam: u * 4.8 * z, color: p.tinta, linea: k.mezclar(p.tinta, p.fondo, 0.82), sep: u * 6 * z });
          e.push(...t.el); y = t.y + u * 3;
          const n = k.T('nota', { x: m, y, w: W - 2 * m, tam: u * 3.8 * z, alin: 'centro', color: p.acento, maxLineas: 2 });
          e.push(n); if (n) y += k.medir(n).h;
          return { el: e, y };
        }, H - m - u * 12);
        const qr = k.Q(W - m - u * 12, H - m - u * 12, u * 12);
        el.push(enLinea(k, ['telefono', 'direccion'], { x: m + (qr ? u * 14 : 0), y: H - m, vy: 'abajo', w: W - 2 * m - (qr ? u * 28 : 0), tam: u * 3.3, alin: 'centro', maxLineas: 2, color: k.mezclar(p.tinta, p.fondo, 0.3) }), qr);
        return [{ el }];
      },
    },
    {
      id: 'reloj', nombre: 'Con reloj',
      fuentes: { titulo: 'archivo-700', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#14213D', tinta: '#FFFFFF', acento: '#FCA311', suave: '#1F2F52' },
      ejemplo: {
        titulo: 'Nuestro horario', dias: 'Lunes a viernes | 8:00 a 20:00\nSábado | 8:00 a 16:00\nDomingo | 9:00 a 14:00',
        nota: 'Servicio a domicilio hasta 30 minutos antes de cerrar', negocio: 'Lavado de Autos Splash', telefono: '662 301 4478',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 10;
        const el = k.encajar((z) => {
          const e = [];
          let y = m + u * 4;
          e.push(k.Ico('reloj', m, y, u * 18 * z, p.acento, { grosor: u * 1.5 * z }));
          y += u * 26 * z;
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 12 * z, fuente: 'titulo', maxLineas: 2, interlinea: 1 });
          e.push(tt); y += k.medir(tt).h + u * 10 * z;
          for (const [d, h] of filas(k)) {
            const a = k.X(d, { x: m, y, w: W - 2 * m, tam: u * 4 * z, color: p.acento, fuente: 'extra', mayus: true, espaciado: 80, id: 'dias', campo: 'dias', maxLineas: 1 });
            const b = k.X(h, { x: m, y: y + u * 6.5 * z, w: W - 2 * m, tam: u * 8 * z, fuente: 'titulo', id: 'dias', campo: 'dias', maxLineas: 1 });
            e.push(a, b);
            y += u * 6.5 * z + (b ? k.medir(b).h : 0) + u * 7 * z;
          }
          const n = k.T('nota', { x: m, y, w: W * 0.7, tam: u * 3.8 * z, maxLineas: 3, color: k.mezclar(p.tinta, p.fondo, 0.3) });
          e.push(n); if (n) y += k.medir(n).h;
          return { el: e, y };
        }, H - m - u * 14);
        const qr = k.Q(W - m - u * 16, H - m - u * 16, u * 16, { sobre: p.fondo });
        el.push(k.R(0, H - u * 4, W, u * 4, p.acento),
          k.T('negocio', { x: m, y: H - m - u * 7, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 4.4, fuente: 'extra', maxLineas: 1 }),
          k.T('telefono', { x: m, y: H - m - u * 1, w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 3.6, maxLineas: 1 }), qr);
        el.push(k.logo ? k.I('logo', W - m - u * 26, m, u * 26, u * 14, { ax: 1, ay: 0 }) : null);
        return [{ el }];
      },
    },
    {
      id: 'tarjetas', nombre: 'Por día',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#1D2B28', acento: '#2E8B74', suave: '#EAF4F1' },
      ejemplo: {
        titulo: 'Horario de consulta', dias: 'Lunes | 10:00 a 14:00\nMartes | 16:00 a 20:00\nMiércoles | 10:00 a 14:00\nJueves | 16:00 a 20:00\nViernes | 10:00 a 14:00\nSábado | Sólo con cita',
        nota: 'Urgencias por WhatsApp', negocio: 'Dra. Ana Lucía Zamudio · Pediatría', telefono: '228 107 6634', direccion: 'Torre Médica Ánimas, consultorio 312',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const el = k.encajar((z) => {
          const e = [];
          let y = m;
          e.push(k.logo ? k.I('logo', m, y, u * 28, u * 12, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 3.8, fuente: 'extra', color: p.acento, maxLineas: 2 }));
          y += u * 12;
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 9.5 * z, fuente: 'titulo', maxLineas: 2, interlinea: 1 });
          e.push(tt); y += k.medir(tt).h + u * 7 * z;
          const fs = filas(k);
          const cols = 2, gap = u * 3, cw = (W - 2 * m - gap) / cols, ch = u * 18 * z;
          fs.forEach(([d, h], i) => {
            const x = m + (i % cols) * (cw + gap), yy = y + Math.floor(i / cols) * (ch + gap);
            e.push(k.R(x, yy, cw, ch, p.suave, { radio: u * 2, id: 'dias' }));
            e.push(k.X(d, { x: x + u * 4, y: yy + u * 4 * z, w: cw - u * 8, tam: u * 3.6 * z, color: p.acento, fuente: 'extra', id: 'dias', campo: 'dias', maxLineas: 1 }));
            e.push(k.X(h || '', { x: x + u * 4, y: yy + u * 10 * z, w: cw - u * 8, tam: u * 4.4 * z, id: 'dias', campo: 'dias', maxLineas: 1 }));
          });
          y += Math.ceil(fs.length / cols) * (ch + gap) + u * 4;
          const n = k.T('nota', { x: m, y, w: W - 2 * m, tam: u * 3.8 * z, fuente: 'extra', maxLineas: 2 });
          e.push(n); if (n) y += k.medir(n).h;
          return { el: e, y };
        }, H - m - u * 14);
        const qr = k.Q(W - m - u * 14, H - m - u * 14, u * 14);
        el.push(...k.contactos({ x: m, y: H - m - u * 11, w: W - 2 * m - (qr ? u * 18 : 0), tam: u * 3.3, color: p.tinta, colorIco: p.acento, campos: ['telefono', 'direccion'], sep: u * 1.4 }).el, qr);
        return [{ el }];
      },
    },
    {
      id: 'pizarron', nombre: 'Pizarrón',
      fuentes: { titulo: 'caveat', texto: 'caveat', extra: 'caveat' },
      paleta: { fondo: '#232B26', tinta: '#F4F1E8', acento: '#F7C873', suave: '#2E3832' },
      ejemplo: {
        titulo: 'Horario', dias: 'Lunes a jueves | 8 am a 9 pm\nViernes y sábado | 8 am a 11 pm\nDomingo | 9 am a 6 pm',
        nota: 'Desayunos hasta la 1 pm', negocio: 'Café Tlaquepaque', telefono: '33 3639 2210',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 10;
        const el = [k.R(u * 3, u * 3, W - u * 6, H - u * 6, null, { borde: '#8A6A44', grosor: u * 2.2 })];
        el.push(...k.encajar((z) => {
          const e = [];
          let y = m + u * 2;
          e.push(k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 7 * z, alin: 'centro', color: p.acento, maxLineas: 1 }));
          y += u * 12 * z;
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 22 * z, fuente: 'titulo', alin: 'centro', maxLineas: 1 });
          e.push(tt); y += k.medir(tt).h + u * 10 * z;
          for (const [d, h] of filas(k)) {
            const a = k.X(d, { x: m, y, w: W - 2 * m, tam: u * 7 * z, alin: 'centro', color: p.acento, id: 'dias', campo: 'dias', maxLineas: 1 });
            const b = k.X(h, { x: m, y: y + u * 9 * z, w: W - 2 * m, tam: u * 9 * z, alin: 'centro', id: 'dias', campo: 'dias', maxLineas: 1 });
            e.push(a, b);
            y += u * 9 * z + (b ? k.medir(b).h : 0) + u * 8 * z;
          }
          const n = k.T('nota', { x: m, y, w: W - 2 * m, tam: u * 6.5 * z, alin: 'centro', maxLineas: 2 });
          e.push(n); if (n) y += k.medir(n).h;
          return { el: e, y };
        }, H - m - u * 10));
        el.push(k.T('telefono', { x: m, y: H - m, vy: 'abajo', w: W - 2 * m, tam: u * 6, alin: 'centro', color: p.acento, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'franja', nombre: 'Franja lateral',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F2EFE8', tinta: '#151515', acento: '#D7263D', suave: '#151515' },
      ejemplo: {
        titulo: 'Horario', dias: 'Lunes a viernes | 7:00 a 21:00\nSábado | 8:00 a 14:00\nDomingo | Cerrado',
        nota: 'Clases de spinning a las 7, 9 y 19 h', negocio: 'Gimnasio Titán', telefono: '871 330 2194', direccion: 'Calz. Colón 1440, Torreón',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 9;
        const fw = W * 0.2;
        const claro = k.oscuro(p.acento) ? '#FFFFFF' : '#151515';
        const el = [k.R(0, 0, fw, H, p.acento)];
        const tt = k.T('titulo', { x: fw / 2, y: H - m, vy: 'abajo', tam: fw * 0.62, fuente: 'titulo', mayus: true, color: claro, alin: 'centro', maxLineas: 1 });
        // el título va de pie en la franja: una letra por renglón
        if (tt) { tt.texto = tt.texto.toUpperCase().split('').join('\n'); tt.interlinea = 0.92; tt.w = fw; tt.x = 0; tt.maxLineas = 20; tt.h = H - 2 * m; tt.y = H / 2; tt.vy = 'centro'; tt.tam = Math.min(fw * 0.62, (H - 2 * m) / Math.max(1, tt.texto.split('\n').length) / 0.92); }
        el.push(tt);
        const x = fw + m, w = W - x - m;
        el.push(...k.encajar((z) => {
          const e = [];
          let y = m;
          e.push(k.logo ? k.I('logo', x, y, u * 30, u * 14, { ax: 0, ay: 0 }) : k.T('negocio', { x, y, w, tam: u * 8 * z, fuente: 'titulo', mayus: true, maxLineas: 2, interlinea: 0.95 }));
          y += k.logo ? u * 24 : u * 26 * z;
          for (const [d, h] of filas(k)) {
            const a = k.X(d, { x, y, w, tam: u * 4.2 * z, fuente: 'extra', mayus: true, espaciado: 60, id: 'dias', campo: 'dias', maxLineas: 1 });
            const b = k.X(h, { x, y: y + u * 7 * z, w, tam: u * 11 * z, fuente: 'titulo', color: p.acento, id: 'dias', campo: 'dias', maxLineas: 1 });
            e.push(a, b);
            y += u * 7 * z + (b ? k.medir(b).h : 0) + u * 8 * z;
          }
          const n = k.T('nota', { x, y, w, tam: u * 3.8 * z, maxLineas: 3 });
          e.push(n); if (n) y += k.medir(n).h;
          return { el: e, y };
        }, H - m - u * 14));
        const qr = k.Q(W - m - u * 14, H - m - u * 14, u * 14);
        el.push(enLinea(k, ['telefono', 'direccion'], { x, y: H - m, vy: 'abajo', w: w - (qr ? u * 18 : 0), tam: u * 3.4, maxLineas: 2 }), qr);
        return [{ el }];
      },
    },
  ],
};
