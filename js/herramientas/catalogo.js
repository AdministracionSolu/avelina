// Herramienta «catalogo» de Avelina: catálogo de productos para mandar por WhatsApp.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// Salidas: PDF carta con botón «Pedir por WhatsApp» en cada producto (liga que funciona en el PDF),
// PNG del catálogo completo y una tarjeta PNG por producto. Nada sale del equipo.

import {
  h, campo, textos as unirTextos, avisar, descargar, estado, lienzoABlob, PIE, opcionesChip, boton, asegurarEstilos,
  nombreArchivo, leerImagen, selectorColor, numeroWhatsApp, ligaWhatsApp, contraste,
} from './_comun.js';
import { pdf, lienzo, lienzoDeVarias, imagen, encajar, partir, recortar, CARTA } from './_pdf.js';

const ID = 'catalogo';

export const TEXTOS = {
  diseno: 'Acomodo',
  disenos: { cuadricula: 'Seis por hoja', lista: 'Lista con foto grande' },
  color: 'Color',
  negocio: 'Nombre de tu negocio',
  sub: 'Frase debajo del nombre (opcional)',
  lada: 'Lada',
  whatsapp: 'Tu WhatsApp para pedidos',
  whatsappAyuda: 'Cada producto lleva un botón que abre tu chat con el pedido escrito.',
  whatsappMal: 'Revisa el número. En México son 10 dígitos.',
  mensaje: 'Mensaje del pedido',
  mensajeDef: 'Hola, quiero pedir',
  logo: 'Logo (opcional)',
  quitarLogo: 'Quitar logo',
  productos: 'Productos',
  producto: (n) => `Producto ${n}`,
  nombre: 'Nombre del producto',
  precio: 'Precio',
  desc: 'Descripción (opcional)',
  foto: 'Foto',
  fotoQuitar: 'Quitar foto',
  subir: 'Subir', bajar: 'Bajar', quitar: 'Quitar',
  pngProducto: 'Imagen de este producto',
  agregar: 'Agregar producto',
  enBlanco: 'Empezar en blanco',
  pedir: 'Pedir por WhatsApp',
  sinFoto: 'Sin foto',
  vista: 'Vista previa',
  pdf: 'Descargar PDF',
  png: 'Descargar imagen del catálogo',
  descargado: 'Listo. Revisa tus descargas.',
  paginas: (n, p) => `${n} ${n === 1 ? 'producto' : 'productos'} en ${p} ${p === 1 ? 'hoja' : 'hojas'}.`,
  guardado: 'Tu catálogo se guarda sólo en este navegador. Las fotos no salen de tu equipo.',
  fotoMal: 'No se pudo abrir esa imagen. Prueba con JPG o PNG.',
};

const EJEMPLO = {
  negocio: 'Velas Luna', sub: 'Velas de soya hechas a mano en Puebla', lada: '52', whatsapp: '', mensaje: '',
  diseno: 'cuadricula', color: '#2F4A3A', logo: null,
  productos: [
    ['Vela de lavanda', '180', 'Frasco de vidrio de 200 g. Dura unas 40 horas.'],
    ['Vela de canela y naranja', '180', 'Aroma cálido para la temporada de frío.'],
    ['Set de tres velas mini', '320', 'Lavanda, vainilla y eucalipto en caja de regalo.'],
    ['Vela en lata de viaje', '120', 'Lata de 120 g con tapa. Aroma a elegir.'],
  ],
};
const nuevoProducto = (n = '', p = '', d = '') => ({ nombre: n, precio: p, desc: d, foto: null });

const MXN = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
export function textoPrecio(v) {
  const s = String(v ?? '').trim();
  if (!s) return '';
  if (/^\$?\s*[\d,]+(\.\d{1,2})?$/.test(s)) {
    const n = parseFloat(s.replace(/[$,\s]/g, ''));
    return '$' + (Number.isInteger(n) ? MXN.format(n) : n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }
  return s;
}

export function ligaPedido(st, p) {
  const n = numeroWhatsApp(st.lada, st.whatsapp);
  if (!n.valido) return '';
  const precio = textoPrecio(p.precio);
  return ligaWhatsApp(n.completo, `${(st.mensaje || '').trim() || TEXTOS.mensajeDef}: ${p.nombre}${precio ? ` (${precio})` : ''}`);
}

// ---------- maquetación ----------
const TINTA = '#1A1A1A', GRIS = '#6B6B6B';

function boton1(pz, x, y, w, hh, ac, url, t) {
  const sobre = contraste(ac, '#FFFFFF') >= 3 ? '#FFFFFF' : TINTA;
  pz.push({ t: 'rect', x, y, w, h: hh, relleno: ac, radio: 4 });
  pz.push({ t: 'texto', x: x + w / 2, y: y + hh / 2 + 3.4, s: t.pedir, f: 'hb', tam: 9.5, color: sobre, ancla: 'c' });
  pz.push({ t: 'liga', x, y, w, h: hh, url });
}

export function maquetarCatalogo(st, t = TEXTOS, im = {}) {
  const W = CARTA.w, H = CARTA.h, M = 40;
  const ac = st.color || '#2F4A3A';
  const prods = st.productos.filter((p) => (p.nombre || '').trim());
  const lista = st.diseno === 'lista';
  const cols = lista ? 1 : 2, filas = lista ? 4 : 3;
  const paginas = [];
  const num = numeroWhatsApp(st.lada, st.whatsapp);
  const total = Math.max(1, Math.ceil(prods.length / (cols * filas)));
  for (let pg = 0; pg < total; pg++) {
    const pz = [];
    paginas.push({ w: W, h: H, piezas: pz });
    let y = M;
    const T = (x, yy, s, f, tam, color = TINTA, ancla = 'i') => pz.push({ t: 'texto', x, y: yy, s, f, tam, color, ancla });
    // Cabecera
    let x = M;
    if (im.logo) {
      const e = encajar(im.logo, M, y, 90, 46, 'i');
      pz.push({ t: 'img', ...e, im: im.logo });
      x = e.x + e.w + 14;
    }
    T(x, y + 20, recortar(st.negocio || '', 'hb', 20, W - M - x - 150), 'hb', 20);
    if (st.sub) T(x, y + 37, recortar(st.sub, 'h', 10, W - M - x - 150), 'h', 10, GRIS);
    if (num.valido) {
      T(W - M, y + 18, 'WhatsApp', 'h', 8.5, GRIS, 'd');
      T(W - M, y + 33, '+' + num.completo.replace(/^52(\d{2})(\d{4})(\d{4})$/, '52 $1 $2 $3'), 'hb', 11, ac, 'd');
    }
    y += 58;
    pz.push({ t: 'linea', x1: M, y1: y, x2: W - M, y2: y, color: ac, grosor: 1.4 });
    y += 18;
    // Tarjetas
    const gap = 18, cw = (W - 2 * M - gap * (cols - 1)) / cols, ch = (H - y - 40 - gap * (filas - 1)) / filas;
    prods.slice(pg * cols * filas, (pg + 1) * cols * filas).forEach((p, i) => {
      const cx = M + (i % cols) * (cw + gap), cy = y + Math.floor(i / cols) * (ch + gap);
      const url = ligaPedido(st, p);
      const precio = textoPrecio(p.precio);
      let fx, fy, fw, fh, tx, ty, tw;
      if (lista) { fw = fh = ch; fx = cx; fy = cy; tx = cx + fw + 18; ty = cy; tw = cw - fw - 18; }
      else { fw = cw; fh = ch * 0.46; fx = cx; fy = cy; tx = cx; ty = cy + fh + 10; tw = cw; }
      const foto = p.foto && im.foto && im.foto(p.foto, fw / fh);
      if (foto) pz.push({ t: 'img', x: fx, y: fy, w: fw, h: fh, im: foto, radio: 4 });
      else pz.push({ t: 'rect', x: fx, y: fy, w: fw, h: fh, relleno: '#F1F1EF', radio: 4 });
      let yy = ty + 14;
      for (const r of partir(p.nombre, 'hb', 12, tw - (lista ? 0 : 70)).slice(0, 2)) { T(tx, yy, r, 'hb', 12); yy += 15; }
      if (precio) {
        if (lista) { T(tx, yy + 4, precio, 'hb', 15, ac); yy += 22; }
        else T(cx + cw, ty + 14, precio, 'hb', 12, ac, 'd');
      }
      const lineas = Math.max(0, Math.floor((cy + ch - (url ? 34 : 4) - yy) / 12));
      const ds = p.desc ? partir(p.desc, 'h', 9, tw) : [];
      ds.slice(0, lineas).forEach((r, k) => T(tx, yy + 2 + k * 12, k === lineas - 1 && ds.length > lineas ? recortar(r + '…', 'h', 9, tw) : r, 'h', 9, GRIS));
      if (url) boton1(pz, tx, cy + ch - 26, Math.min(tw, 160), 26, ac, url, t);
    });
    T(W / 2, H - 18, PIE, 'h', 7, '#8C8C8C', 'c');
    if (total > 1) T(W - M, H - 18, `${pg + 1} / ${total}`, 'h', 7, '#8C8C8C', 'd');
  }
  return paginas;
}

// Tarjeta 4:5 de un producto (1080 × 1350 px a escala 3).
export function maquetarTarjeta(st, p, t = TEXTOS, im = {}) {
  const W = 360, H = 450, M = 22, ac = st.color || '#2F4A3A';
  const pz = [];
  const T = (x, y, s, f, tam, color = TINTA, ancla = 'i') => pz.push({ t: 'texto', x, y, s, f, tam, color, ancla });
  const foto = p.foto && im.foto && im.foto(p.foto, W / 270);
  if (foto) pz.push({ t: 'img', x: 0, y: 0, w: W, h: 270, im: foto });
  else pz.push({ t: 'rect', x: 0, y: 0, w: W, h: 270, relleno: '#F1F1EF' });
  let y = 300;
  for (const r of partir(p.nombre || '', 'hb', 19, W - 2 * M).slice(0, 2)) { T(M, y, r, 'hb', 19); y += 22; }
  const precio = textoPrecio(p.precio);
  if (precio) { T(M, y + 6, precio, 'hb', 22, ac); y += 30; }
  for (const r of partir(p.desc || '', 'h', 10, W - 2 * M).slice(0, 2)) { y += 4; T(M, y + 8, r, 'h', 10, GRIS); y += 10; }
  pz.push({ t: 'rect', x: 0, y: H - 46, w: W, h: 46, relleno: ac });
  const sobre = contraste(ac, '#FFFFFF') >= 3 ? '#FFFFFF' : TINTA;
  T(M, H - 26, recortar(st.negocio || '', 'hb', 11, W - 2 * M - 130), 'hb', 11, sobre);
  const n = numeroWhatsApp(st.lada, st.whatsapp);
  if (n.valido) T(W - M, H - 26, 'WhatsApp ' + n.local.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1 $2 $3'), 'h', 10, sobre, 'd');
  T(W / 2, H - 10, PIE, 'h', 6, sobre, 'c');
  return { w: W, h: H, piezas: pz };
}

// ---------- guardado ----------
const CLAVE = 'avelina-catalogo';
function leer() { try { return JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { return null; } }
function guardar(v) { try { localStorage.setItem(CLAVE, JSON.stringify(v)); return true; } catch (e) { return false; } }
function aDataUrl(img, max, tipo = 'image/jpeg') {
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL(tipo, 0.85);
}

// ---------- herramienta ----------
export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const base0 = { ...EJEMPLO, productos: EJEMPLO.productos.map((x) => nuevoProducto(...x)) };
  const st = Object.assign(base0, leer() || {});
  const crudas = new Map(), recortes = new Map();
  const im = {
    logo: null, logoUrl: null,
    foto(url, r) {
      const el = crudas.get(url);
      if (!el) return null;
      const k = url.length + ':' + url.slice(-40) + ':' + r.toFixed(3);
      if (!recortes.has(k)) recortes.set(k, imagen(el, { maxPx: 900, proporcion: r }));
      return recortes.get(k);
    },
  };

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah acat', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const cargarImg = (url, opc) => new Promise((ok) => {
    const i = new Image();
    i.onload = () => ok(imagen(i, opc));
    i.onerror = () => ok(null);
    i.src = url;
  });
  async function asegurarImagenes() {
    if ((st.logo || null) !== im.logoUrl) { im.logoUrl = st.logo || null; im.logo = st.logo ? await cargarImg(st.logo, { maxPx: 600 }) : null; }
    for (const p of st.productos) {
      if (!p.foto || crudas.has(p.foto)) continue;
      const el = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = p.foto; });
      if (el) crudas.set(p.foto, el);
    }
  }
  // Cada foto se recorta al centro según la caja donde va (cuadrícula, lista o tarjeta).
  const est = estado();
  let tGuardar, tPintar, turno = 0;
  const persistir = () => {
    clearTimeout(tGuardar);
    tGuardar = setTimeout(() => {
      if (!guardar(st)) guardar({ ...st, logo: null, productos: st.productos.map((p) => ({ ...p, foto: null })) });
    }, 500);
  };
  const cambio = () => { persistir(); clearTimeout(tPintar); tPintar = setTimeout(pintar, 160); };

  const entrada = (obj, k, etq, o = {}) => {
    const el = o.area ? h('textarea', { class: 'ah-input', rows: 2 }) : h('input', { type: o.tipo || 'text', class: 'ah-input', autocomplete: o.auto || 'off', inputmode: o.tec });
    el.value = obj[k] || '';
    if (o.ph) el.placeholder = o.ph;
    el.addEventListener('input', () => { obj[k] = el.value; cambio(); if (o.alCambiar) o.alCambiar(); });
    if (o.sinCampo) { el.setAttribute('aria-label', etq); return el; }
    return campo(etq, el, o.ayuda);
  };
  const archivo = (alCargar, etq) => {
    const a = h('input', { type: 'file', accept: 'image/*', class: 'ah-archivo', 'aria-label': etq });
    a.addEventListener('change', async () => {
      const f = a.files[0];
      if (!f) return;
      try { await alCargar((await leerImagen(f)).img); } catch (e) { est.decir(t.fotoMal, 5000); }
      a.value = '';
    });
    return a;
  };

  const chips = opcionesChip('acomodo', t.diseno, Object.entries(t.disenos), st.diseno, (v) => { st.diseno = v; cambio(); });
  const color = selectorColor(t.color, st.color, (v) => { st.color = v; cambio(); });
  const errNum = h('p', { class: 'ah-error', hidden: true, text: t.whatsappMal });
  const revisarNum = () => { errNum.hidden = !st.whatsapp.trim() || numeroWhatsApp(st.lada, st.whatsapp).valido; };
  const ladaC = entrada(st, 'lada', t.lada, { tec: 'numeric', alCambiar: revisarNum });
  const numC = entrada(st, 'whatsapp', t.whatsapp, { tipo: 'tel', tec: 'tel', auto: 'tel-national', ph: '33 1234 5678', ayuda: t.whatsappAyuda, alCambiar: revisarNum });
  const logoCaja = h('div', { class: 'acat-logo' });
  const pintarLogo = () => {
    logoCaja.textContent = '';
    if (st.logo) logoCaja.append(h('img', { src: st.logo, alt: '' }), boton(t.quitarLogo, () => { st.logo = null; cambio(); pintarLogo(); }, 'ah-liga'));
  };
  pintarLogo();
  const mensajeC = entrada(st, 'mensaje', t.mensaje, { ph: t.mensajeDef });

  const lista = h('div', { class: 'acat-lista' });
  function pintarLista() {
    lista.textContent = '';
    st.productos.forEach((p, i) => {
      const nom = `${t.producto(i + 1).toLowerCase()}`;
      const mover = (b) => { if (b < 0 || b >= st.productos.length) return; [st.productos[i], st.productos[b]] = [st.productos[b], st.productos[i]]; cambio(); pintarLista(); };
      const fotoCaja = h('div', { class: 'acat-foto' });
      const pintarFoto = () => {
        fotoCaja.textContent = '';
        if (p.foto) fotoCaja.append(h('img', { src: p.foto, alt: '' }), boton(t.fotoQuitar, () => { p.foto = null; cambio(); pintarFoto(); }, 'ah-liga'));
        else fotoCaja.append(h('label', { class: 'acat-foto-btn' }, h('span', { text: '+ ' + t.foto }),
          archivo(async (img) => { p.foto = aDataUrl(img, 900); cambio(); pintarFoto(); }, `${t.foto} del ${nom}`)));
      };
      pintarFoto();
      const mini = (txt, et, fn) => h('button', { type: 'button', class: 'acat-btn', 'aria-label': `${et} ${nom}`, text: txt, onclick: fn });
      lista.append(h('fieldset', { class: 'acat-prod' },
        h('legend', { class: 'ah-etiqueta', text: t.producto(i + 1) }),
        h('div', { class: 'acat-fila' }, entrada(p, 'nombre', `${t.nombre}, ${nom}`, { sinCampo: true, ph: t.nombre }),
          entrada(p, 'precio', `${t.precio}, ${nom}`, { sinCampo: true, ph: t.precio })),
        entrada(p, 'desc', `${t.desc}, ${nom}`, { sinCampo: true, area: true, ph: t.desc }),
        h('div', { class: 'acat-fila3' }, fotoCaja,
          h('div', { class: 'acat-mini' },
            boton(t.pngProducto, async () => {
              await asegurarImagenes();
              descargar(await lienzoABlob(lienzo(maquetarTarjeta(st, p, t, im), 3)), `${nombreArchivo(p.nombre || 'producto')}.png`);
              est.decir(t.descargado); avisar(contenedor, ID, 'descargar');
            }, 'ah-liga acat-png'),
            mini('↑', t.subir, () => mover(i - 1)), mini('↓', t.bajar, () => mover(i + 1)),
            mini('×', t.quitar, () => { st.productos.splice(i, 1); cambio(); pintarLista(); })))));
    });
  }
  pintarLista();

  const columna = h('div', { class: 'ah-columna' },
    chips, color, entrada(st, 'negocio', t.negocio), entrada(st, 'sub', t.sub),
    h('div', { class: 'ah-fila ah-fila-lada' }, ladaC, numC), errNum, mensajeC,
    h('div', { class: 'ah-campo' }, h('span', { class: 'ah-etiqueta', text: t.logo }),
      archivo(async (img) => { st.logo = aDataUrl(img, 600, 'image/png'); cambio(); pintarLogo(); }, t.logo), logoCaja),
    h('h3', { class: 'ah-titulo-vista', text: t.productos }), lista,
    h('div', { class: 'ah-acciones' },
      boton('+ ' + t.agregar, () => { st.productos.push(nuevoProducto()); cambio(); pintarLista(); lista.lastChild.querySelector('input').focus(); }, 'ah-boton ah-boton-2'),
      boton(t.enBlanco, () => { st.productos = [nuevoProducto()]; cambio(); pintarLista(); }, 'ah-liga')));

  const hojas = h('div', { class: 'acat-hojas' });
  const cuenta = h('p', { class: 'ah-nota' });
  const escenas = async () => { await asegurarImagenes(); return maquetarCatalogo(st, t, im); };
  const base = () => `catalogo-${nombreArchivo(st.negocio || 'productos')}`;
  const bPdf = boton(t.pdf, async () => {
    descargar(pdf(await escenas(), { titulo: st.negocio || 'Catálogo', autor: st.negocio }), base() + '.pdf');
    est.decir(t.descargado); avisar(contenedor, ID, 'descargar');
  });
  const bPng = boton(t.png, async () => {
    descargar(await lienzoABlob(lienzoDeVarias(await escenas(), 2)), base() + '.png');
    est.decir(t.descargado); avisar(contenedor, ID, 'descargar');
  }, 'ah-boton ah-boton-2');
  raiz.append(columna, h('div', { class: 'ah-vista' },
    h('h3', { class: 'ah-titulo-vista', text: t.vista }), hojas, cuenta,
    h('div', { class: 'ah-acciones' }, bPdf, bPng), est, h('p', { class: 'ah-nota', text: t.guardado })));

  async function pintar() {
    const yo = ++turno;
    const es = await escenas();
    if (yo !== turno) return;
    hojas.textContent = '';
    for (const e of es) {
      const c = lienzo(e, 1.5);
      c.className = 'acat-hoja';
      c.setAttribute('role', 'img');
      c.setAttribute('aria-label', `${t.vista}: ${st.negocio}`);
      hojas.append(c);
    }
    cuenta.textContent = t.paginas(st.productos.filter((p) => (p.nombre || '').trim()).length, es.length);
  }
  revisarNum();
  const listo = pintar();
  raiz.acat = {
    st, listo, pintar, escenas, pdfBlob: async () => pdf(await escenas()),
    pngBlob: async () => lienzoABlob(lienzoDeVarias(await escenas(), 2)),
    tarjetaBlob: async (i) => { await asegurarImagenes(); return lienzoABlob(lienzo(maquetarTarjeta(st, st.productos[i], t, im), 3)); },
  };
  return { destruir() { clearTimeout(tGuardar); clearTimeout(tPintar); contenedor.textContent = ''; } };
}

function cssPropio() {
  if (document.querySelector('link[data-acat-css], link[href*="herramientas/catalogo.css"]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/catalogo.css', import.meta.url).href;
  l.dataset.acatCss = '1';
  document.head.appendChild(l);
}
