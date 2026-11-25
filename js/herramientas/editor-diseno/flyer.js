// Diseños de arranque: flyer y volante (media carta, carta y para redes).
// Todo se mide con W, H y u (1 % del lado corto) para que funcione en las tres medidas.

const campos = [
  { id: 'titulo', etiqueta: 'Título', tipo: 'area', filas: 2 },
  { id: 'subtitulo', etiqueta: 'Subtítulo' },
  { id: 'oferta', etiqueta: 'Precio, oferta o dato grande' },
  { id: 'detalles', etiqueta: 'Detalles (uno por renglón)', tipo: 'area', filas: 4 },
  { id: 'fecha', etiqueta: 'Fecha, horario o vigencia' },
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
  { id: 'whatsapp', etiqueta: 'WhatsApp', tipo: 'tel' },
  { id: 'direccion', etiqueta: 'Dirección', tipo: 'area', filas: 2 },
  { id: 'web', etiqueta: 'Página o red social' },
];

const renglones = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);

// Lista de detalles con viñeta propia (cuadrito, número o raya).
function lista(k, o) {
  const r = renglones(k.d.detalles);
  const out = [];
  let y = o.y;
  r.forEach((txt, i) => {
    const marca = o.marca === 'numero' ? String(i + 1).padStart(2, '0') : null;
    const hueco = o.tam * (marca ? 2.2 : 1.4);
    const el = k.X(txt, { x: o.x + hueco, y, w: o.w - hueco, tam: o.tam, color: o.color, fuente: o.fuente || 'texto', maxLineas: 3, id: 'detalles', campo: 'detalles', interlinea: 1.22 });
    const m = k.medir(el);
    if (marca) out.push(k.X(marca, { x: o.x, y, tam: o.tam * 0.82, color: o.colorMarca, fuente: 'extra', id: 'detalles' }));
    else if (o.marca === 'raya') out.push(k.R(o.x, y + m.alto / 2 - o.tam * 0.06, o.tam * 0.8, o.tam * 0.12, o.colorMarca, { id: 'detalles' }));
    else out.push(k.R(o.x, y + m.alto / 2 - o.tam * 0.2, o.tam * 0.4, o.tam * 0.4, o.colorMarca, { id: 'detalles' }));
    out.push(el);
    y += m.h + (o.sep ?? o.tam * 0.7);
  });
  return { el: out, y };
}

// Pie de contacto en una línea o dos.
function pieContacto(k, o) {
  return k.contactos(Object.assign({ campos: ['whatsapp', 'telefono', 'direccion', 'web'] }, o));
}

// Hoja de boletos de rifa con talón, numerados en serie (k.folio). Sólo en el modo «rifa».
function boleto(k, x, y, w, h, num) {
  const { p } = k, pad = h * 0.11, tw = w * 0.3, gris = k.mezclar(p.tinta, p.fondo, 0.45);
  const bx = x + tw + pad, lado = h * 0.34, bw = w - tw - 2 * pad - lado - pad * 0.6;
  const el = [k.R(x, y, w, h, null, { borde: gris, grosor: h * 0.008, radio: h * 0.04 }),
    k.R(x, y, tw, h, p.suave, { radio: h * 0.04 }),
    k.L(x + tw, y + pad * 0.4, x + tw, y + h - pad * 0.4, gris, h * 0.012, { guiones: [h * 0.04, h * 0.03] })];
  const tx = x + pad * 0.8, tw2 = tw - pad * 1.6;
  el.push(k.X('No. ' + num, { x: tx, y: y + pad, w: tw2, tam: h * 0.13, fuente: 'titulo', color: p.acento, maxLineas: 1, id: 'numero' }));
  for (const [txt, yy] of [['Nombre', 0.44], ['Teléfono', 0.7]]) {
    el.push(k.X(txt, { x: tx, y: y + h * yy, w: tw2, tam: h * 0.065, color: gris, maxLineas: 1, id: 'numero' }));
    el.push(k.L(tx, y + h * (yy + 0.17), tx + tw2, y + h * (yy + 0.17), gris, h * 0.008));
  }
  el.push(k.T('titulo', { x: bx, y: y + pad, w: bw, tam: h * 0.15, fuente: 'titulo', maxLineas: 1 }));
  el.push(k.T('detalles', { x: bx, y: y + h * 0.33, w: bw, tam: h * 0.068, maxLineas: 3, interlinea: 1.15 }));
  el.push(k.X([k.d.negocio, k.d.whatsapp || k.d.telefono].filter(Boolean).join(' · '), { x: bx, y: y + h - pad - h * 0.13, vy: 'abajo', w: bw, tam: h * 0.06, color: gris, maxLineas: 1, id: 'negocio', campo: 'negocio' }));
  el.push(k.X([k.d.oferta, k.d.fecha].filter(Boolean).join(' · '), { x: bx, y: y + h - pad, vy: 'abajo', w: bw, tam: h * 0.08, fuente: 'extra', color: p.acento, maxLineas: 1, id: 'oferta', campo: 'oferta' }));
  const lx = x + w - pad - lado;
  el.push(k.X(num, { x: lx - pad, y: y + pad, w: lado + pad, tam: h * 0.13, fuente: 'titulo', alin: 'der', color: p.acento, maxLineas: 1, id: 'numero' }));
  el.push(k.qr ? k.Q(lx, y + h - pad - lado, lado) : k.I('logo', lx, y + h - pad - lado, lado, lado));
  return el;
}

const BOLETOS = {
  id: 'boletos', nombre: 'Boletos numerados',
  folio: { cifras: 3, siempre: true },
  fuentes: { titulo: 'bricolage', texto: 'archivo-400', extra: 'archivo-700' },
  paleta: { fondo: '#FFFFFF', tinta: '#2A1F3D', acento: '#7C3AED', suave: '#F2E3C6' },
  ejemplo: {
    titulo: 'Gran rifa', oferta: 'Boleto $50', fecha: 'Sorteo el 12 de diciembre',
    detalles: '1er lugar · Pantalla de 55 pulgadas\n2º lugar · Bicicleta de montaña\n3er lugar · Despensa de $1,500',
    negocio: 'Comité de padres · ST 54', whatsapp: '999 341 2286',
  },
  dibujar(k) {
    const { W, H, u } = k, px = k.unidad === 'px';
    const cols = !px && W > 180 ? 2 : 1, filas = px ? 3 : 5, m = u * 3.5, g = u * 2.2;
    const cw = (W - 2 * m - (cols - 1) * g) / cols, ch = (H - 2 * m - (filas - 1) * g) / filas;
    const el = [];
    for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) el.push(...boleto(k, m + c * (cw + g), m + f * (ch + g), cw, ch, k.folio(f * cols + c)));
    return [{ el }];
  },
};

export default (modo) => ({
  archivo: modo === 'volante' ? 'volante' : 'flyer',
  formatos: [
    { id: 'media-carta', nombre: 'Media carta', ancho: 139.7, alto: 215.9, u: 'mm' },
    { id: 'carta', nombre: 'Carta', ancho: 215.9, alto: 279.4, u: 'mm' },
    { id: 'redes', nombre: 'Para redes 1080 × 1350', ancho: 1080, alto: 1350, u: 'px' },
  ],
  formatoInicial: modo === 'volante' ? 'media-carta' : 'carta',
  campos,
  imagenes: ['logo', 'foto'],
  qr: true,
  disenos: [
    {
      id: 'panaderia', nombre: 'Promoción',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F4EBDD', tinta: '#2B1D14', acento: '#C2410C', suave: '#E9D9C0' },
      ejemplo: {
        titulo: 'Martes de conchas', subtitulo: 'Recién salidas del horno a las 7 de la mañana', oferta: '2 × 1',
        detalles: 'Vainilla, chocolate y nata\nPedidos de 50 piezas para fiestas\nPan de muerto desde el 15 de octubre',
        fecha: 'Todos los martes de noviembre', negocio: 'Panadería La Espiga', whatsapp: '33 2190 4471', direccion: 'Av. Hidalgo 1532, Col. Ladrón de Guevara, Guadalajara',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const fotoH = k.foto ? H * 0.34 : 0;
        const qr = k.Q(W - m - u * 18, H - m - u * 18, u * 18);
        const c = pieContacto(k, { x: m, y: H - m - u * 13, w: W - 2 * m - (qr ? u * 22 : 0), tam: u * 3.2, color: p.tinta, colorIco: p.acento, campos: ['whatsapp', 'telefono', 'direccion'] });
        const f = k.T('fecha', { x: m, y: H - m - u * 21, w: W - 2 * m - (qr ? u * 22 : 0), tam: u * 4, fuente: 'extra', color: p.acento, maxLineas: 1 });
        const arriba = k.encajar((z) => {
          const el = [];
          if (k.foto) el.push(k.I('foto', 0, 0, W, fotoH));
          let y = k.foto ? fotoH + u * 6 : m;
          el.push(k.logo ? k.I('logo', m, y, u * 26, u * 12, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y, w: W * 0.6, tam: u * 3.4, fuente: 'extra', mayus: true, espaciado: 140, color: p.acento }));
          y += u * 12;
          const ofT = k.T('oferta', { x: 0, y: 0, tam: u * 11 * z, fuente: 'titulo', maxLineas: 1, color: '#FFFFFF' });
          const d = ofT ? Math.max(u * 28 * z, k.medir(ofT).w + u * 8 * z) : 0;
          if (ofT) { ofT.x = W - m - d; ofT.w = d; ofT.alin = 'centro'; ofT.y = y + d / 2; ofT.vy = 'centro'; el.push(k.E(W - m - d, y, d, d, p.acento, { id: 'oferta' }), ofT); }
          const tt = k.T('titulo', { x: m, y: y + u * 2, w: W - 2 * m - (d ? d + u * 4 : 0), tam: u * 12 * z, fuente: 'titulo', maxLineas: 3, interlinea: 1 });
          el.push(tt);
          y = Math.max(y + u * 2 + k.medir(tt).h, y + d) + u * 5 * z;
          const st = k.T('subtitulo', { x: m, y, w: W * 0.72, tam: u * 4 * z, maxLineas: 3 });
          el.push(st); if (st) y += k.medir(st).h + u * 5 * z;
          el.push(k.L(m, y, W - m, y, k.mezclar(p.tinta, p.fondo, 0.7), u * 0.25)); y += u * 5 * z;
          const l = lista(k, { x: m, y, w: W - 2 * m, tam: u * 3.9 * z, color: p.tinta, colorMarca: p.acento });
          el.push(...l.el);
          return { el, y: l.y };
        }, H - m - u * 25);
        return [{ el: [...arriba, f, ...c.el, qr] }];
      },
    },
    {
      id: 'fiesta', nombre: 'Fiesta',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#141414', tinta: '#F4F1EA', acento: '#FF5A36', suave: '#262626' },
      ejemplo: {
        titulo: 'Noche de cumbia', subtitulo: 'Sonido La Conga en vivo y DJ Toño', oferta: 'Cover $150',
        detalles: 'Mujeres gratis antes de las 11\nCubetas de 6 en $280\nEstacionamiento vigilado',
        fecha: 'Sábado 29 de noviembre · 9 pm', negocio: 'Salón Los Arcos', whatsapp: '55 4410 2387', direccion: 'Calz. Ermita Iztapalapa 2210, CDMX',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const banda = u * 20;
        const tinta2 = k.oscuro(p.acento) ? '#FFFFFF' : '#141414';
        const pie = [
          k.R(0, H - banda, W, banda, p.acento, { id: 'pie' }),
          k.T('negocio', { x: m, y: H - banda / 2 - u, vy: 'centro', w: W * 0.45, tam: u * 5.5, fuente: 'titulo', mayus: true, color: tinta2, maxLineas: 2, interlinea: 0.95 }),
          ...k.contactos({ x: W * 0.48, y: H - banda + u * 4.5, w: W * 0.52 - m, tam: u * 2.9, color: tinta2, campos: ['whatsapp', 'direccion'], alin: 'der', sep: u * 1.2 }).el,
        ];
        const qr = k.Q(W - m - u * 18, H - banda - u * 24, u * 18, { sobre: p.fondo });
        const arriba = k.encajar((z) => {
          const el = [];
          let y = m;
          if (k.foto) { el.push(k.I('foto', 0, 0, W, H * 0.38)); y = H * 0.38 + u * 5; }
          const f = k.T('fecha', { x: m, y, w: W - 2 * m, tam: u * 4.2 * z, fuente: 'extra', mayus: true, espaciado: 60, color: p.acento, maxLineas: 2 });
          el.push(f); if (f) y += k.medir(f).h + u * 4 * z;
          const tt = k.T('titulo', { x: m - u * 0.5, y, w: W - 2 * m, tam: u * (k.foto ? 20 : 28) * z, fuente: 'titulo', mayus: true, maxLineas: 3, interlinea: 0.92 });
          el.push(tt); y += k.medir(tt).h + u * 4 * z;
          const st = k.T('subtitulo', { x: m, y, w: W - 2 * m, tam: u * 4.4 * z, maxLineas: 2 });
          el.push(st); if (st) y += k.medir(st).h + u * 5 * z;
          const of = k.T('oferta', { x: m, y, w: W - 2 * m, tam: u * 8 * z, fuente: 'titulo', mayus: true, color: p.acento, maxLineas: 1 });
          el.push(of); if (of) y += k.medir(of).h + u * 4 * z;
          const l = lista(k, { x: m, y, w: W - 2 * m - (qr ? u * 22 : 0), tam: u * 3.6 * z, color: p.tinta, colorMarca: p.acento, marca: 'raya' });
          el.push(...l.el);
          return { el, y: l.y };
        }, H - banda - u * 5);
        return [{ el: [...arriba, ...pie, qr] }];
      },
    },
    {
      id: 'informativo', nombre: 'Informativo',
      fuentes: { titulo: 'archivo-700', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFFFFF', tinta: '#0F2A3D', acento: '#0F766E', suave: '#E6F2F0' },
      ejemplo: {
        titulo: 'Jornada de vacunación antirrábica', subtitulo: 'Trae a tu perro o gato con su cartilla. Si no tiene, te damos una.', oferta: '$0',
        detalles: 'Mascotas de más de 3 meses\nCon correa o en transportadora\nDesparasitación a $80\nRevisión general sin costo',
        fecha: 'Domingo 23 de noviembre · 9:00 a 14:00', negocio: 'Clínica Veterinaria San Roque', telefono: '477 712 0938', whatsapp: '477 233 8810', direccion: 'Blvd. López Mateos 2104, León, Gto.',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const qr = k.Q(W - m - u * 18, H - m - u * 18, u * 18);
        const c = pieContacto(k, { x: m, y: H - m - u * 17, w: W - 2 * m - (qr ? u * 22 : 0), tam: u * 3.2, color: p.tinta, colorIco: p.acento, campos: ['telefono', 'whatsapp', 'direccion'], sep: u * 1.3 });
        const arriba = k.encajar((z) => {
          const el = [k.R(0, 0, W, u * 5, p.acento)];
          let y = u * 11;
          el.push(k.logo ? k.I('logo', m, y, u * 30, u * 12, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', color: p.acento }));
          y += k.logo ? u * 18 : u * 10;
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 9.5 * z, fuente: 'titulo', maxLineas: 3, interlinea: 1.04 });
          el.push(tt); y += k.medir(tt).h + u * 4 * z;
          const st = k.T('subtitulo', { x: m, y, w: W - 2 * m, tam: u * 4.1 * z, maxLineas: 3, color: k.mezclar(p.tinta, p.fondo, 0.2) });
          el.push(st); if (st) y += k.medir(st).h + u * 6 * z;
          if (k.d.detalles) {
            const caja = y;
            const l = lista(k, { x: m + u * 6, y: y + u * 6 * z, w: W - 2 * m - u * 12, tam: u * 3.9 * z, color: p.tinta, colorMarca: p.acento, marca: 'numero', sep: u * 2.6 * z });
            el.push(k.R(m, caja, W - 2 * m, l.y - caja + u * 3 * z, p.suave, { id: 'detalles' }), ...l.el);
            y = l.y + u * 9 * z;
          }
          const of = k.T('oferta', { x: m, y, tam: u * 11 * z, fuente: 'titulo', color: p.acento, maxLineas: 1 });
          el.push(of);
          const ow = of ? k.medir(of).w + u * 5 : 0;
          const f = k.T('fecha', { x: m + ow, y: y + (of ? u * 0.5 : 0), w: W - 2 * m - ow, tam: u * 4 * z, fuente: 'extra', maxLineas: 2 });
          el.push(f);
          y += Math.max(of ? k.medir(of).h : 0, f ? k.medir(f).h : 0);
          return { el, y };
        }, H - m - u * 23);
        return [{ el: [...arriba, ...c.el, qr] }];
      },
    },
    {
      id: 'futbol', nombre: 'Torneo',
      fuentes: { titulo: 'bigshoulders', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#0E3B2E', tinta: '#F3F4EE', acento: '#E8F15A', suave: '#145240' },
      ejemplo: {
        titulo: 'Torneo relámpago fútbol 7', subtitulo: 'Categoría libre y veteranos. Cupo para 16 equipos.', oferta: '$1,200 por equipo',
        detalles: 'Arbitraje incluido\nTrofeo y medallas a los 3 primeros\nPremio de $8,000 al campeón',
        fecha: 'Inscripciones hasta el 30 de noviembre', negocio: 'Unidad Deportiva Morelos', whatsapp: '614 220 9134', direccion: 'Av. Tecnológico 4100, Chihuahua',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 9;
        const linea = k.mezclar(p.fondo, p.tinta, 0.13), g = u * 0.5, b = u * 4;
        const cancha = [
          k.R(b, b, W - 2 * b, H - 2 * b, null, { borde: linea, grosor: g }),
          k.R(W / 2 - u * 22, b, u * 44, u * 13, null, { borde: linea, grosor: g }),
          k.R(W / 2 - u * 22, H - b - u * 13, u * 44, u * 13, null, { borde: linea, grosor: g }),
        ];
        const pie = [
          k.T('negocio', { x: m, y: H - m - u * 12, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', alin: 'centro', maxLineas: 1 }),
          k.X([k.d.whatsapp || k.d.telefono, k.d.direccion].filter(Boolean).join(' · '), { x: m, y: H - m - u * 6, w: W - 2 * m, tam: u * 3.1, alin: 'centro', id: 'whatsapp', campo: 'whatsapp', maxLineas: 1 }),
        ];
        const arriba = k.encajar((z) => {
          const el = [];
          let y = u * 20;
          if (k.foto) { el.push(k.I('foto', b + g, b + g, W - 2 * b - 2 * g, H * 0.28)); y = H * 0.28 + u * 10; }
          else if (k.logo) { el.push(k.I('logo', W / 2 - u * 10, u * 4.5, u * 20, u * 12)); }
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m, tam: u * 16 * z, fuente: 'titulo', mayus: true, alin: 'centro', maxLineas: 3, interlinea: 0.9 });
          el.push(tt); y += k.medir(tt).h + u * 4 * z;
          const st = k.T('subtitulo', { x: m * 1.4, y, w: W - 2.8 * m, tam: u * 4 * z, alin: 'centro', maxLineas: 2 });
          el.push(st); if (st) y += k.medir(st).h + u * 6 * z;
          const of = k.T('oferta', { x: m, y, w: W - 2 * m, tam: u * 7 * z, fuente: 'titulo', mayus: true, alin: 'centro', color: p.acento, maxLineas: 1 });
          el.push(of); if (of) y += k.medir(of).h + u * 5 * z;
          for (const txt of renglones(k.d.detalles)) { const e = k.X(txt, { x: m, y, w: W - 2 * m, tam: u * 3.7 * z, alin: 'centro', id: 'detalles', campo: 'detalles', maxLineas: 2 }); el.push(e); y += k.medir(e).h + u * 2 * z; }
          y += u * 4 * z;
          const f = k.T('fecha', { x: m, y, w: W - 2 * m, tam: u * 4 * z, fuente: 'extra', alin: 'centro', color: p.acento, mayus: true, espaciado: 40, maxLineas: 2 });
          el.push(f); if (f) y += k.medir(f).h;
          return { el, y };
        }, H - m - u * 17);
        return [{ el: [...cancha, ...arriba, ...pie, k.Q(W - b - u * 20, b + u * 4, u * 16, { sobre: p.fondo })] }];
      },
    },
    {
      id: 'rifa', nombre: 'Rifa',
      fuentes: { titulo: 'bricolage', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFF6E5', tinta: '#2A1F3D', acento: '#7C3AED', suave: '#F2E3C6' },
      ejemplo: {
        titulo: 'Gran rifa', subtitulo: 'Para la graduación de la generación 2026 de la Secundaria Técnica 54', oferta: 'Boleto $50',
        detalles: '1er lugar · Pantalla de 55 pulgadas\n2º lugar · Bicicleta de montaña\n3er lugar · Despensa de $1,500',
        fecha: 'Sorteo el 12 de diciembre', negocio: 'Comité de padres · ST 54', whatsapp: '999 341 2286', direccion: 'Calle 60 x 47, Centro, Mérida',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const bx = m, by = m, bw = W - 2 * m, bh = H - 2 * m, ix = bx + u * 7, iw = bw - u * 14;
        const corte = by + bh * 0.56;
        const el = [
          k.R(bx, by, bw, bh, p.suave, { radio: u * 3 }),
          k.E(bx - u * 4, corte - u * 4, u * 8, u * 8, p.fondo), k.E(bx + bw - u * 4, corte - u * 4, u * 8, u * 8, p.fondo),
          k.L(bx + u * 7, corte, bx + bw - u * 7, corte, k.mezclar(p.tinta, p.suave, 0.55), u * 0.4, { guiones: [u * 1.6, u * 1.4] }),
        ];
        el.push(...k.encajar((z) => {
          const e = [];
          let y = by + u * 9;
          if (k.foto) { e.push(k.I('foto', ix, y, iw, bh * 0.2, { radio: u * 2 })); y += bh * 0.2 + u * 6; }
          const n = k.T('negocio', { x: ix, y, w: iw, tam: u * 3.2, fuente: 'extra', mayus: true, espaciado: 120, color: p.acento, maxLineas: 1 });
          e.push(n); if (n) y += u * 7;
          const tt = k.T('titulo', { x: ix - u * 0.5, y, w: iw, tam: u * (k.foto ? 14 : 19) * z, fuente: 'titulo', maxLineas: 2, interlinea: 0.95 });
          e.push(tt); y += k.medir(tt).h + u * 4 * z;
          const st = k.T('subtitulo', { x: ix, y, w: iw, tam: u * 4 * z, maxLineas: 3 });
          e.push(st); if (st) y += k.medir(st).h;
          return { el: e, y };
        }, corte - u * 6));
        const pieY = by + bh - u * 16;
        el.push(...k.encajar((z) => {
          const e = [];
          let y = corte + u * 7;
          const of = k.T('oferta', { x: ix, y, w: iw, tam: u * 7.5 * z, fuente: 'titulo', color: p.acento, maxLineas: 1 });
          e.push(of); if (of) y += k.medir(of).h + u * 4 * z;
          const l = lista(k, { x: ix, y, w: iw, tam: u * 3.7 * z, color: p.tinta, colorMarca: p.acento });
          e.push(...l.el);
          return { el: e, y: l.y };
        }, pieY - u * 2));
        const qr = k.Q(bx + bw - u * 7 - u * 15, by + bh - u * 21, u * 15, { sobre: p.suave });
        el.push(k.T('fecha', { x: ix, y: pieY, w: iw - (qr ? u * 18 : 0), tam: u * 4, fuente: 'extra', maxLineas: 1 }));
        el.push(k.X([k.d.whatsapp || k.d.telefono, k.d.direccion].filter(Boolean).join(' · '), { x: ix, y: pieY + u * 6.5, w: iw - (qr ? u * 18 : 0), tam: u * 3, id: 'whatsapp', campo: 'whatsapp', maxLineas: 2 }), qr);
        return [{ el }];
      },
    },
    {
      id: 'comida', nombre: 'Comida del día',
      fuentes: { titulo: 'zilla', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#1F2A1E', tinta: '#F5EFE0', acento: '#E9A23B', suave: '#2B3A29' },
      ejemplo: {
        titulo: 'Comida corrida', subtitulo: 'Sopa, guisado del día, arroz, frijoles y agua fresca', oferta: '$95',
        detalles: 'Lunes · Mole poblano\nMartes · Chiles rellenos\nMiércoles · Pozole rojo\nJueves · Tinga de pollo\nViernes · Pescado a la veracruzana',
        fecha: 'De lunes a viernes · 1:00 a 5:00 pm', negocio: 'Cocina Doña Lupe', whatsapp: '228 145 7702', direccion: 'Calle Zaragoza 18, Centro, Xalapa',
      },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const qr = k.Q(W - m - u * 18, H - m - u * 18, u * 18);
        const f = k.T('fecha', { x: m, y: H - m - u * 19, w: W - 2 * m - (qr ? u * 22 : 0), tam: u * 4, fuente: 'extra', color: p.acento, maxLineas: 1 });
        const c = pieContacto(k, { x: m, y: H - m - u * 11, w: W - 2 * m - (qr ? u * 22 : 0), tam: u * 3.2, color: p.tinta, colorIco: p.acento, campos: ['whatsapp', 'direccion'], sep: u * 1.2 });
        const arriba = k.encajar((z) => {
          const el = [];
          let y = m;
          if (k.foto) { el.push(k.I('foto', 0, 0, W, H * 0.3)); y = H * 0.3 + u * 6; }
          el.push(k.logo ? k.I('logo', m, y, u * 26, u * 12, { ax: 0, ay: 0 }) : k.T('negocio', { x: m, y, w: W - 2 * m, tam: u * 3.6, fuente: 'extra', mayus: true, espaciado: 160, color: p.acento, maxLineas: 1 }));
          y += k.logo ? u * 17 : u * 10;
          const of = k.T('oferta', { x: W - m - u * 34, y, w: u * 34, tam: u * 15 * z, fuente: 'titulo', alin: 'der', color: p.acento, maxLineas: 1 });
          const ow = of ? k.medir(of).w + u * 6 : 0;
          const tt = k.T('titulo', { x: m, y, w: W - 2 * m - ow, tam: u * 12 * z, fuente: 'titulo', maxLineas: 2, interlinea: 0.98 });
          el.push(tt, of); y += Math.max(k.medir(tt).h, of ? k.medir(of).h : 0) + u * 3 * z;
          const st = k.T('subtitulo', { x: m, y, w: W - 2 * m, tam: u * 4 * z, maxLineas: 2, color: k.mezclar(p.tinta, p.fondo, 0.25) });
          el.push(st); if (st) y += k.medir(st).h + u * 6 * z;
          for (const txt of renglones(k.d.detalles)) {
            const partes = txt.split(/\s*[·|:]\s*/);
            const b = partes.length > 1 ? partes.slice(1).join(' · ') : partes[0];
            const ea = k.X(partes.length > 1 ? partes[0] : '', { x: m, y: y + u * 0.3 * z, w: W * 0.28, tam: u * 3.4 * z, fuente: 'extra', color: p.acento, mayus: true, espaciado: 60, id: 'detalles', campo: 'detalles', maxLineas: 1 });
            const eb = k.X(b, { x: m + (ea ? W * 0.3 : 0), y, w: W - 2 * m - (ea ? W * 0.3 : 0), tam: u * 4.1 * z, id: 'detalles', campo: 'detalles', maxLineas: 2 });
            const hh = k.medir(eb).h;
            el.push(ea, eb, k.L(m, y + hh + u * 1.2 * z, W - m, y + hh + u * 1.2 * z, p.suave, u * 0.3, { id: 'detalles' }));
            y += hh + u * 3.4 * z;
          }
          return { el, y };
        }, H - m - u * 23);
        return [{ el: [...arriba, f, ...c.el, qr] }];
      },
    },
    ...(modo === 'rifa' ? [BOLETOS] : []),
  ],
});
