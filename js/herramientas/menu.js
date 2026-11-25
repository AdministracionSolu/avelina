// Herramienta «menu» de Avelina: carta de restaurante o cafetería para imprimir o mandar por WhatsApp.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// modos: restaurante (por defecto), cafeteria, digital
// Salidas: PDF carta o media carta (vectorial) y PNG; QR opcional hacia la liga que pegue la persona.
// Los diseños viven en menu-disenos.js y se cargan bajo demanda.

import {
  h, campo, textos as unirTextos, avisar, descargar, estado, lienzoABlob, PIE, opcionesChip, boton, asegurarEstilos,
  nombreArchivo, leerImagen,
} from './_comun.js';
import { pdf, lienzo, lienzoDeVarias, imagen, encajar, partir, ancho, modulos } from './_pdf.js';
import { generarQR } from './_qr-codificador.js';

const ID = 'menu';

export const TEXTOS = {
  diseno: 'Diseño',
  formato: 'Tamaño',
  formatos: { carta: 'Carta', media: 'Media carta', celular: 'Imagen para celular' },
  negocio: 'Nombre del lugar',
  sub: 'Frase debajo del nombre (opcional)',
  info: 'Dirección, teléfono y horario (opcional)',
  logo: 'Logo (opcional)',
  quitarLogo: 'Quitar logo',
  secciones: 'Secciones y platillos',
  seccion: (n) => `Sección ${n}`,
  tituloSeccion: 'Nombre de la sección',
  plato: 'Platillo',
  precio: 'Precio',
  precioAyuda: 'Escribe 85 o un texto como «Ch $40 · Gde $55».',
  desc: 'Descripción (opcional)',
  foto: 'Foto',
  fotoQuitar: 'Quitar foto',
  subir: 'Subir',
  bajar: 'Bajar',
  quitar: 'Quitar',
  agregarPlato: 'Agregar platillo',
  agregarSeccion: 'Agregar sección',
  enBlanco: 'Empezar en blanco',
  qr: 'Agregar un QR al final del menú',
  qrUrl: 'Liga a la que lleva el QR',
  qrUrlAyuda: 'Pega la liga de tu menú en línea, tu página o tu WhatsApp.',
  qrTexto: 'Texto junto al QR',
  qrTextoDef: 'Escanea para ver el menú en tu celular',
  qrLargo: 'La liga es demasiado larga para un QR. Usa una más corta.',
  vista: 'Vista previa',
  pdf: 'Descargar PDF',
  png: 'Descargar imagen',
  descargado: 'Listo. Revisa tus descargas.',
  paginas: (n) => `${n} ${n === 1 ? 'página' : 'páginas'}`,
  guardado: 'Tu menú se guarda sólo en este navegador. Las fotos no salen de tu equipo.',
  fotoMal: 'No se pudo abrir esa imagen. Prueba con JPG o PNG.',
};

const EJEMPLOS = {
  restaurante: {
    diseno: 'clasico', formato: 'carta',
    nombre: 'Fonda Doña Lupe', sub: 'Cocina mexicana casera',
    info: 'Av. Hidalgo 210, Centro · Tel. 33 1234 5678 · Lunes a sábado de 9 a 18 h',
    secciones: [
      ['Desayunos', [['Chilaquiles verdes con pollo', '95', 'Totopos en salsa verde con crema, queso fresco y cebolla morada.'],
        ['Huevos a la mexicana', '80', 'Con frijoles refritos y tortillas hechas a mano.'],
        ['Molletes', '70', 'Bolillo con frijoles, queso gratinado y pico de gallo.']]],
      ['Comida corrida', [['Sopa del día', '45', ''], ['Enchiladas suizas', '120', 'Tres enchiladas de pollo con salsa verde cremosa, gratinadas.'],
        ['Carne en su jugo', '140', 'Con frijoles de la olla, tocino y cebolla asada.']]],
      ['Bebidas', [['Agua fresca de temporada', '35', 'Medio litro.'], ['Café de olla', '30', ''], ['Refresco', '30', '']]],
    ],
  },
  cafeteria: {
    diseno: 'cafeteria', formato: 'media',
    nombre: 'Café La Esquina', sub: 'Café de especialidad y pan del día',
    info: 'Calle Morelos 45 · Abierto todos los días de 8 a 21 h',
    secciones: [
      ['Café caliente', [['Americano', '45', ''], ['Capuchino', '60', 'Con leche entera, deslactosada o de avena.'], ['Latte', '65', ''], ['Café de olla', '40', 'Con canela y piloncillo.']]],
      ['Fríos', [['Frappé de moka', '75', ''], ['Cold brew', '70', 'Reposado en frío durante 18 horas.']]],
      ['Para acompañar', [['Concha', '25', ''], ['Croissant de mantequilla', '45', ''], ['Pan de elote', '40', 'Hecho en casa cada mañana.']]],
    ],
  },
  digital: {
    diseno: 'moderno', formato: 'celular',
    nombre: 'Tacos El Güero', sub: 'Al pastor, suadero y campechanos',
    info: 'Pedidos por WhatsApp al 33 1234 5678',
    secciones: [
      ['Tacos', [['Al pastor', '22', 'Con piña, cebolla y cilantro.'], ['Suadero', '24', ''], ['Campechano', '26', 'Suadero con longaniza.'],
        ['Gringa', '65', 'Tortilla de harina con pastor y queso.']]],
      ['Bebidas', [['Horchata', '30', 'Medio litro.'], ['Jamaica', '30', 'Medio litro.'], ['Refresco', '28', '']]],
    ],
  },
};

function ejemplo(modo) {
  const e = EJEMPLOS[modo];
  return {
    diseno: e.diseno, formato: e.formato, nombre: e.nombre, sub: e.sub, info: e.info, logo: null,
    qr: { activo: false, url: '', texto: '' },
    secciones: e.secciones.map(([titulo, platos]) => ({ titulo, platos: platos.map(([nombre, precio, desc]) => ({ nombre, precio, desc, foto: null })) })),
  };
}

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

// ---------- maquetación ----------
const FORMATOS = {
  carta: { w: 612, h: 792, m: 44, k: 1 },
  media: { w: 396, h: 612, m: 30, k: 0.86 },
  celular: { w: 360, h: 0, m: 22, k: 0.92 },
};

export function maquetarMenu(st, d, im = {}) {
  const F = FORMATOS[st.formato] || FORMATOS.carta;
  const W = F.w, k = F.k, M = F.m + (d.marco ? 10 : 0);
  const largo = !F.h;
  const H = F.h || 100000;
  const cols = st.formato === 'carta' ? d.columnas : 1;
  const gap = 28 * k, cw = (W - 2 * M - gap * (cols - 1)) / cols;
  const abajo = H - M - 22;
  const ac = st.acento || d.acento;
  const sobreAc = d.cabecera === 'banda' ? '#FFFFFF' : d.tinta;
  const paginas = [];
  let pz, col, y, topCol;
  const T = (x, yy, s, f, tam, color = d.tinta, ancla = 'i') => pz.push({ t: 'texto', x, y: yy, s, f, tam, color, ancla });
  const L = (x1, y1, x2, y2, color, grosor = 0.7, guiones) => pz.push({ t: 'linea', x1, y1, x2, y2, color, grosor, guiones });
  const colX = () => M + col * (cw + gap);

  function marco() {
    if (d.marco === 'doble') {
      pz.push({ t: 'rect', x: 16, y: 16, w: W - 32, h: (largo ? 0 : H) - 32, trazo: ac, grosor: 1, marco: 1 });
      pz.push({ t: 'rect', x: 20, y: 20, w: W - 40, h: (largo ? 0 : H) - 40, trazo: ac, grosor: 0.4, marco: 1 });
    } else if (d.marco === 'simple') pz.push({ t: 'rect', x: 16, y: 16, w: W - 32, h: (largo ? 0 : H) - 32, trazo: d.suave, grosor: 0.8, marco: 1 });
    else if (d.marco === 'franjas') {
      pz.push({ t: 'rect', x: 0, y: 0, w: W, h: 9, relleno: ac }, { t: 'rect', x: 0, y: 9, w: W, h: 4, relleno: d.acento2 || ac });
    }
  }

  function cabecera() {
    y = M + (d.marco === 'franjas' ? 8 : 0);
    const tTam = 30 * k;
    if (d.cabecera === 'banda') {
      const lineas = partir(st.nombre || '', d.fTitulo, tTam, W - 2 * M - (im.logo ? 90 : 0));
      const alto = 36 + lineas.length * tTam * 1.1 + (st.sub ? 18 * k : 0);
      pz.push({ t: 'rect', x: 0, y: 0, w: W, h: alto + 6, relleno: ac });
      if (im.logo) {
        pz.push({ t: 'rect', x: W - M - 74, y: 18, w: 74, h: alto - 30, relleno: '#FFFFFF', radio: 4 });
        const e = encajar(im.logo, W - M - 70, 22, 66, alto - 38);
        pz.push({ t: 'img', ...e, im: im.logo });
      }
      y = 22;
      for (const r of lineas) { y += tTam; T(M, y, r, d.fTitulo, tTam, sobreAc); y += tTam * 0.1; }
      if (st.sub) { y += 16 * k; T(M, y, st.sub, d.fSub, 11 * k, sobreAc); }
      y = alto + 6 + 30 * k;
      return;
    }
    const izq = d.cabecera === 'izquierda';
    const xc = izq ? M : W / 2, an = izq ? 'i' : 'c';
    if (im.logo) {
      const lw = 130 * k, lh = 62 * k;
      const e = encajar(im.logo, izq ? M : W / 2 - lw / 2, y, lw, lh, izq ? 'i' : 'c');
      pz.push({ t: 'img', ...e, im: im.logo });
      y += lh + 8;
    }
    for (const r of partir(st.nombre || '', d.fTitulo, tTam, W - 2 * M)) { y += tTam; T(xc, y, r, d.fTitulo, tTam, d.tinta, an); y += tTam * 0.12; }
    if (st.sub) { y += 16 * k; T(xc, y, st.sub, d.fSub, 11.5 * k, izq ? ac : d.suave, an); }
    y += 14 * k;
    if (izq) L(M, y, W - M, y, d.tinta, 1.4);
    else L(W / 2 - 30, y, W / 2 + 30, y, ac, 1.2);
    y += 26 * k;
  }

  function nuevaPagina() {
    pz = [];
    paginas.push({ w: W, h: F.h, fondo: d.fondo, piezas: pz });
    marco();
    if (paginas.length === 1) cabecera();
    else y = M + (d.marco === 'franjas' ? 8 : 0);
    topCol = y;
    col = 0;
  }

  // Bloques: se miden antes de ponerlos para no partirlos.
  const tSec = 13.5 * k, tPlato = 10.5 * k, tDesc = 8.6 * k, tPrecio = 10.5 * k;
  const altoSeccion = () => (d.seccion === 'banda' ? 22 * k : tSec * 1.2) + 14 * k;
  function seccion(s, x, y0) {
    const tit = d.seccion === 'banda' || d.seccion === 'mayus' ? s.toUpperCase() : s;
    if (d.seccion === 'banda') {
      pz.push({ t: 'rect', x, y: y0, w: cw, h: 22 * k, relleno: ac });
      T(x + 8, y0 + 15 * k, tit, d.fSeccion, 11 * k, '#FFFFFF');
    } else if (d.seccion === 'lineas') {
      const yb = y0 + tSec;
      const w = ancho(tit, d.fSeccion, tSec);
      T(x + cw / 2, yb, tit, d.fSeccion, tSec, ac, 'c');
      if (cw - w > 40) {
        L(x, yb - tSec * 0.33, x + cw / 2 - w / 2 - 10, yb - tSec * 0.33, ac, 0.6);
        L(x + cw / 2 + w / 2 + 10, yb - tSec * 0.33, x + cw, yb - tSec * 0.33, ac, 0.6);
      }
    } else if (d.seccion === 'mayus') {
      T(x, y0 + tSec, tit, d.fSeccion, tSec, ac);
      L(x, y0 + tSec + 6, x + 26, y0 + tSec + 6, ac, 2);
    } else {
      T(x, y0 + tSec, tit, d.fSeccion, tSec * 1.1, ac);
      L(x, y0 + tSec + 6, x + cw, y0 + tSec + 6, d.suave, 0.5);
    }
  }
  function plato(p, x, y0, dibujar) {
    const foto = p.foto && im.fotos && im.fotos.get(p.foto);
    const fl = 48 * k, tx = x + (foto ? fl + 10 : 0), tw = cw - (foto ? fl + 10 : 0);
    const precio = textoPrecio(p.precio);
    const pw = precio ? ancho(precio, d.fPrecio, tPrecio) : 0;
    const junto = d.precio === 'junto';
    const nombres = partir(p.nombre || '', d.fPlato, tPlato, junto ? tw : tw - pw - 14);
    let yy = y0 + tPlato;
    nombres.forEach((r, i) => {
      if (dibujar) T(tx, yy + i * tPlato * 1.25, r, d.fPlato, tPlato);
    });
    const yUlt = yy + (nombres.length - 1) * tPlato * 1.25;
    if (precio && dibujar) {
      if (junto) {
        const fin = ancho(nombres[nombres.length - 1], d.fPlato, tPlato);
        if (fin + pw + 12 <= tw) T(tx + fin + 10, yUlt, precio, d.fPrecio, tPrecio, ac);
        else T(tx, yUlt + tPlato * 1.25, precio, d.fPrecio, tPrecio, ac);
      } else {
        T(x + cw, yy, precio, d.fPrecio, tPrecio, d.precio === 'puntos' ? d.tinta : ac, 'd');
        if (d.precio === 'puntos') {
          const fin = tx + ancho(nombres[0], d.fPlato, tPlato) + 5;
          if (x + cw - pw - 5 - fin > 8) L(fin, yy - 1.5, x + cw - pw - 5, yy - 1.5, d.suave, 0.8, [0.8, 2.6]);
        }
      }
    }
    yy = yUlt + (junto && precio && ancho(nombres[nombres.length - 1], d.fPlato, tPlato) + pw + 12 > tw ? tPlato * 1.25 : 0);
    if (p.desc) {
      yy += 2;
      for (const r of partir(p.desc, d.fDesc, tDesc, tw)) { yy += tDesc * 1.35; if (dibujar) T(tx, yy, r, d.fDesc, tDesc, d.suave); }
    }
    if (foto && dibujar) pz.push({ t: 'img', x, y: y0, w: fl, h: fl, im: foto, radio: d.foto === 'circulo' ? fl / 2 : 3 });
    return Math.max(yy - y0 + 4, foto ? fl + 2 : 0) + 13 * k;
  }

  let objetivo = 0;
  function lugar(alto) {
    const lim = objetivo && col < cols - 1 && paginas.length === 1 ? objetivo : abajo;
    if (y + alto <= lim || y === topCol) return;
    if (col < cols - 1) { col++; y = topCol; return; }
    nuevaPagina();
  }

  // Pie del menú (QR e información): se calcula antes para reservar su lugar.
  const qrLado = 70 * k;
  const infoLineas = st.info ? partir(st.info, 'h', 8.5 * k, W - 2 * M) : [];
  const conQr = !!im.qr;
  const altoPie = (conQr ? qrLado + 22 : 0) + infoLineas.length * 12 * k + 10;

  const visibles = st.secciones.map((s) => ({ s, platos: s.platos.filter((p) => (p.nombre || '').trim() || (p.precio || '').trim()) }))
    .filter((x) => x.platos.length || (x.s.titulo || '').trim());
  nuevaPagina();
  if (cols > 1) {
    // Reparte el contenido parejo entre columnas si cabe en la primera hoja.
    let total = 0;
    for (const { s, platos } of visibles) {
      total += ((s.titulo || '').trim() ? altoSeccion() : 0) + 14 * k;
      for (const p of platos) total += plato(p, 0, 0, false);
    }
    if (total / cols <= abajo - altoPie - topCol - 30) objetivo = topCol + total / cols + 24 * k;
  }
  for (const { s, platos } of visibles) {
    const hs = (s.titulo || '').trim() ? altoSeccion() : 0;
    const todo = hs + platos.reduce((a, p) => a + plato(p, 0, 0, false), 0);
    const limCol = (objetivo && col < cols - 1 && paginas.length === 1 ? objetivo : abajo) - topCol;
    lugar(todo <= limCol * 0.9 ? todo : hs + (platos[0] ? plato(platos[0], 0, 0, false) : 0));
    if (hs) { seccion(s.titulo.trim(), colX(), y); y += hs; }
    for (const p of platos) {
      const alto = plato(p, 0, 0, false);
      lugar(alto);
      plato(p, colX(), y, true);
      y += alto;
    }
    y += 14 * k;
  }

  // Pie del menú a lo ancho al final de la última página.
  const yMax = () => Math.max(...pz.filter((p) => p.t === 'texto' || p.t === 'img').map((p) => p.y + (p.h || 0)), topCol);
  let yPie = Math.max(y, yMax() + 10) + 8;
  if (cols > 1) yPie = yMax() + 22;
  if (!largo && yPie + altoPie > abajo) { nuevaPagina(); yPie = topCol; }
  if (!largo) yPie = Math.max(yPie, abajo - altoPie);
  y = yPie;
  if (conQr) {
    pz.push({ t: 'rect', x: W / 2 - qrLado / 2 - 5, y: y - 5, w: qrLado + 10, h: qrLado + 10, relleno: '#FFFFFF', radio: 3 });
    pz.push(...modulos(im.qr, W / 2 - qrLado / 2, y, qrLado, '#000000'));
    y += qrLado + 16;
    T(W / 2, y, st.qr.texto || TEXTOS.qrTextoDef, 'hb', 8.5 * k, d.tinta, 'c');
    y += 6;
  }
  for (const r of infoLineas) { y += 12 * k; T(W / 2, y, r, 'h', 8.5 * k, d.suave, 'c'); }
  y += 10;

  const altoFinal = largo ? Math.ceil(y + M + 6) : F.h;
  paginas.forEach((p) => {
    p.h = altoFinal;
    for (const q of p.piezas) if (q.marco) q.h = altoFinal - 2 * q.y;
    p.piezas.push({ t: 'texto', x: W / 2, y: altoFinal - (d.marco === 'franjas' ? 20 : d.marco ? 28 : 14), s: PIE, f: 'h', tam: 6.5, color: d.suave, ancla: 'c' });
    if (d.marco === 'franjas') p.piezas.push({ t: 'rect', x: 0, y: altoFinal - 9, w: W, h: 9, relleno: d.acento2 || ac });
  });
  return paginas;
}

// ---------- guardado ----------
const CLAVE = 'avelina-menu-';
function leer(k) { try { return JSON.parse(localStorage.getItem(CLAVE + k) || 'null'); } catch (e) { return null; } }
function guardar(k, v) { try { localStorage.setItem(CLAVE + k, JSON.stringify(v)); return true; } catch (e) { return false; } }

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
  const modo = EJEMPLOS[opciones.modo] ? opciones.modo : 'restaurante';
  const st = Object.assign(ejemplo(modo), leer(modo) || {});
  let DIS = null;
  const im = { logo: null, logoUrl: null, fotos: new Map(), qr: null };

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah amenu', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const cargarImg = (url, max) => new Promise((ok) => {
    const i = new Image();
    i.onload = () => ok(imagen(i, { maxPx: max, proporcion: max === 400 ? 1 : 0 }));
    i.onerror = () => ok(null);
    i.src = url;
  });
  async function asegurarImagenes() {
    if ((st.logo || null) !== im.logoUrl) { im.logoUrl = st.logo || null; im.logo = st.logo ? await cargarImg(st.logo, 700) : null; }
    for (const s of st.secciones) for (const p of s.platos) {
      if (p.foto && !im.fotos.has(p.foto)) im.fotos.set(p.foto, await cargarImg(p.foto, 400));
    }
  }

  let tGuardar;
  const persistir = () => {
    clearTimeout(tGuardar);
    tGuardar = setTimeout(() => {
      if (!guardar(modo, st)) {
        const sinFotos = JSON.parse(JSON.stringify(st));
        sinFotos.secciones.forEach((s) => s.platos.forEach((p) => { p.foto = null; }));
        guardar(modo, sinFotos);
      }
    }, 500);
  };

  // Columna de datos
  const entrada = (obj, k, etq, o = {}) => {
    const el = o.area ? h('textarea', { class: 'ah-input', rows: o.filas || 2 }) : h('input', { type: 'text', class: 'ah-input', autocomplete: 'off', inputmode: o.tec });
    el.value = obj[k] || '';
    el.addEventListener('input', () => { obj[k] = el.value; cambio(); });
    return o.sinCampo ? (el.setAttribute('aria-label', etq), el.placeholder = o.ph || '', el) : campo(etq, el, o.ayuda);
  };
  const archivo = (alCargar) => {
    const a = h('input', { type: 'file', accept: 'image/*', class: 'ah-archivo' });
    a.addEventListener('change', async () => {
      const f = a.files[0];
      if (!f) return;
      try { await alCargar((await leerImagen(f)).img); } catch (e) { est.decir(t.fotoMal, 5000); }
      a.value = '';
    });
    return a;
  };

  const chipsDiseno = h('div');
  const chipsFormato = opcionesChip('formato', t.formato, Object.entries(t.formatos), st.formato, (v) => { st.formato = v; cambio(); });
  const logoIn = archivo(async (img) => { st.logo = aDataUrl(img, 700, 'image/png'); cambio(); pintarLogo(); });
  const logoCaja = h('div', { class: 'amenu-logo' });
  function pintarLogo() {
    logoCaja.textContent = '';
    if (st.logo) logoCaja.append(h('img', { src: st.logo, alt: '' }), boton(t.quitarLogo, () => { st.logo = null; cambio(); pintarLogo(); }, 'ah-liga'));
  }
  pintarLogo();

  const listaSecciones = h('div', { class: 'amenu-secciones' });
  function pintarSecciones() {
    listaSecciones.textContent = '';
    st.secciones.forEach((s, i) => {
      const mover = (arr, a, b) => { if (b < 0 || b >= arr.length) return; [arr[a], arr[b]] = [arr[b], arr[a]]; cambio(); pintarSecciones(); };
      const caja = h('fieldset', { class: 'amenu-seccion' },
        h('legend', { class: 'ah-etiqueta', text: t.seccion(i + 1) }),
        h('div', { class: 'amenu-fila-sec' },
          entrada(s, 'titulo', t.tituloSeccion, { sinCampo: true, ph: t.tituloSeccion }),
          h('div', { class: 'amenu-mini' },
            boton('↑', () => mover(st.secciones, i, i - 1), 'amenu-btn'),
            boton('↓', () => mover(st.secciones, i, i + 1), 'amenu-btn'),
            boton('×', () => { st.secciones.splice(i, 1); cambio(); pintarSecciones(); }, 'amenu-btn'))));
      caja.querySelectorAll('.amenu-btn').forEach((b, n) => b.setAttribute('aria-label', `${[t.subir, t.bajar, t.quitar][n]} ${t.seccion(i + 1).toLowerCase()}`));
      s.platos.forEach((p, j) => {
        const nombreP = `${t.plato.toLowerCase()} ${j + 1} de ${s.titulo || t.seccion(i + 1).toLowerCase()}`;
        const fotoCaja = h('div', { class: 'amenu-foto' });
        const pintarFoto = () => {
          fotoCaja.textContent = '';
          if (p.foto) fotoCaja.append(h('img', { src: p.foto, alt: '' }), boton(t.fotoQuitar, () => { p.foto = null; cambio(); pintarFoto(); }, 'ah-liga'));
          else {
            const a = archivo(async (img) => { p.foto = aDataUrl(img, 600); cambio(); pintarFoto(); });
            a.setAttribute('aria-label', `${t.foto} del ${nombreP}`);
            fotoCaja.append(h('label', { class: 'amenu-foto-btn' }, h('span', { text: '+ ' + t.foto }), a));
          }
        };
        pintarFoto();
        const fila = h('div', { class: 'amenu-plato' },
          h('div', { class: 'amenu-plato-1' },
            entrada(p, 'nombre', `${t.plato} ${j + 1}`, { sinCampo: true, ph: t.plato }),
            entrada(p, 'precio', `${t.precio} del ${nombreP}`, { sinCampo: true, ph: t.precio, tec: 'text' })),
          entrada(p, 'desc', `${t.desc} del ${nombreP}`, { sinCampo: true, area: true, filas: 1, ph: t.desc }),
          h('div', { class: 'amenu-plato-3' }, fotoCaja,
            h('div', { class: 'amenu-mini' },
              boton('↑', () => mover(s.platos, j, j - 1), 'amenu-btn'),
              boton('↓', () => mover(s.platos, j, j + 1), 'amenu-btn'),
              boton('×', () => { s.platos.splice(j, 1); cambio(); pintarSecciones(); }, 'amenu-btn'))));
        fila.querySelectorAll('.amenu-plato-3 .amenu-btn').forEach((b, n) => b.setAttribute('aria-label', `${[t.subir, t.bajar, t.quitar][n]} ${nombreP}`));
        caja.append(fila);
      });
      caja.append(boton('+ ' + t.agregarPlato, () => {
        s.platos.push({ nombre: '', precio: '', desc: '', foto: null });
        cambio(); pintarSecciones();
        listaSecciones.children[i].querySelectorAll('.amenu-plato input')[s.platos.length * 2 - 2]?.focus();
      }, 'ah-boton ah-boton-2 amenu-agregar'));
      listaSecciones.append(caja);
    });
  }
  pintarSecciones();

  const qrChk = h('input', { type: 'checkbox', checked: st.qr.activo });
  const qrUrl = entrada(st.qr, 'url', t.qrUrl, { ayuda: t.qrUrlAyuda, tec: 'url' });
  const qrTexto = entrada(st.qr, 'texto', t.qrTexto);
  qrTexto.querySelector('input').placeholder = t.qrTextoDef;
  const qrError = h('p', { class: 'ah-error', hidden: true, text: t.qrLargo });
  const qrCampos = h('div', { class: 'ah-grupo', hidden: !st.qr.activo }, qrUrl, qrTexto, qrError);
  qrChk.addEventListener('change', () => { st.qr.activo = qrChk.checked; qrCampos.hidden = !qrChk.checked; cambio(); });

  const columna = h('div', { class: 'ah-columna' },
    chipsDiseno, chipsFormato,
    entrada(st, 'nombre', t.negocio), entrada(st, 'sub', t.sub), entrada(st, 'info', t.info, { area: true }),
    h('div', { class: 'ah-campo' }, h('span', { class: 'ah-etiqueta', text: t.logo }), logoIn, logoCaja),
    h('h3', { class: 'ah-titulo-vista', text: t.secciones }), listaSecciones,
    h('div', { class: 'ah-acciones' },
      boton('+ ' + t.agregarSeccion, () => { st.secciones.push({ titulo: '', platos: [{ nombre: '', precio: '', desc: '', foto: null }] }); cambio(); pintarSecciones(); }, 'ah-boton ah-boton-2'),
      boton(t.enBlanco, () => {
        st.secciones = [{ titulo: '', platos: [{ nombre: '', precio: '', desc: '', foto: null }] }];
        st.nombre = st.sub = st.info = '';
        cambio(); pintarSecciones();
        columna.querySelectorAll('.ah-input').forEach((el, n) => { if (n < 3) el.value = ''; });
      }, 'ah-liga')),
    h('label', { class: 'ah-check' }, qrChk, h('span', { text: t.qr })), qrCampos);

  // Vista y descargas
  const hojas = h('div', { class: 'amenu-hojas' });
  const cuenta = h('p', { class: 'ah-nota' });
  const est = estado();
  const escenas = async () => {
    await asegurarImagenes();
    im.qr = null;
    qrError.hidden = true;
    if (st.qr.activo && st.qr.url.trim()) {
      try { im.qr = generarQR(st.qr.url.trim(), { nivel: 'M' }); } catch (e) { qrError.hidden = false; }
    }
    return maquetarMenu(st, DIS.find((x) => x.id === st.diseno) || DIS[0], im);
  };
  const escala = () => (st.formato === 'celular' ? 3 : st.formato === 'media' ? 2.6 : 2);
  const base = () => `menu-${nombreArchivo(st.nombre || 'menu')}-${st.formato}`;
  const bPdf = boton(t.pdf, async () => {
    descargar(pdf(await escenas(), { titulo: st.nombre || 'Menú', autor: st.nombre }), base() + '.pdf');
    est.decir(t.descargado); avisar(contenedor, ID, 'descargar');
  });
  const bPng = boton(t.png, async () => {
    descargar(await lienzoABlob(lienzoDeVarias(await escenas(), escala())), base() + '.png');
    est.decir(t.descargado); avisar(contenedor, ID, 'descargar');
  }, 'ah-boton ah-boton-2');
  const vista = h('div', { class: 'ah-vista' },
    h('h3', { class: 'ah-titulo-vista', text: t.vista }), hojas, cuenta,
    h('div', { class: 'ah-acciones' }, bPdf, bPng), est, h('p', { class: 'ah-nota', text: t.guardado }));
  raiz.append(columna, vista);

  let tPintar, turno = 0;
  async function pintar() {
    if (!DIS) return;
    const yo = ++turno;
    const es = await escenas();
    if (yo !== turno) return;
    hojas.textContent = '';
    for (const e of es) {
      const c = lienzo(e, 1.5);
      c.className = 'amenu-hoja';
      c.setAttribute('role', 'img');
      c.setAttribute('aria-label', `${t.vista}: ${st.nombre}`);
      hojas.append(c);
    }
    cuenta.textContent = t.paginas(es.length);
  }
  function cambio() {
    persistir();
    clearTimeout(tPintar);
    tPintar = setTimeout(pintar, 160);
  }

  const listo = import('./menu-disenos.js').then(({ DISENOS }) => {
    DIS = DISENOS;
    chipsDiseno.replaceWith(opcionesChip('diseno', t.diseno, DIS.map((x) => [x.id, x.nombre]), st.diseno, (v) => { st.diseno = v; cambio(); }));
    return pintar();
  });

  raiz.amenu = { st, escenas, listo, pintar, pdfBlob: async () => pdf(await escenas()), pngBlob: async () => lienzoABlob(lienzoDeVarias(await escenas(), escala())) };
  return { destruir() { clearTimeout(tGuardar); clearTimeout(tPintar); contenedor.textContent = ''; } };
}

function cssPropio() {
  if (document.querySelector('link[data-amenu-css], link[href*="herramientas/menu.css"]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/menu.css', import.meta.url).href;
  l.dataset.amenuCss = '1';
  document.head.appendChild(l);
}
