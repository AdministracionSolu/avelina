// Herramienta «favicon» de Avelina: de una imagen, letras o emoji a favicon.ico (16, 32 y 48),
// apple-touch-icon 180, PNG 192 y 512, manifiesto y el bloque <link> para pegar. ZIP con todo.
// montar(contenedor, { modo: '' , idioma: 'es-MX', textos }). Todo en el navegador, sin red.

import {
  h, campo, textos as unirTextos, avisar, copiar, descargar, estado, boton, asegurarEstilos, opcionesChip,
  selectorColor, leerImagen, lienzoABlob,
} from './_comun.js';

const ID = 'favicon';

export const TEXTOS = {
  origen: 'Hazlo con',
  origenes: { letras: 'Letras', emoji: 'Emoji', imagen: 'Imagen' },
  letras: 'Letras (1 o 2)', letrasEjemplo: 'PR',
  emoji: 'Emoji', emojiAyuda: 'Pega o escribe un emoji.',
  imagen: 'Tu imagen', imagenAyuda: 'Un logo cuadrado y sencillo se ve mejor en tamaño pequeño.',
  letra: 'Letra',
  letrasTipos: { sans: 'Recta', serif: 'Con remate', mono: 'Máquina', redonda: 'Redonda' },
  forma: 'Forma del fondo',
  formas: { cuadrado: 'Cuadrado', redondeado: 'Redondeado', circulo: 'Círculo', ninguno: 'Sin fondo' },
  fondo: 'Color de fondo', texto: 'Color de las letras',
  margen: 'Margen',
  titulo: 'Título de tu página (para la vista)', tituloEjemplo: 'Pollos Ramírez',
  vista: 'Así se ve en la pestaña',
  tamanos: 'Tamaños',
  celular: 'En la pantalla del celular',
  zip: 'Bajar todo en ZIP',
  ico: 'Bajar favicon.ico',
  png: 'Bajar PNG 512',
  codigo: 'Código para tu página',
  codigoAyuda: 'Sube los archivos a la raíz de tu página y pega esto dentro de <head>.',
  copiarCodigo: 'Copiar código',
  copiado: 'Código copiado.',
  noCopiado: 'No se pudo copiar. Selecciona el código y cópialo.',
  noImagen: 'No pudimos abrir esa imagen. Prueba con PNG, JPG o SVG.',
  nombreApp: 'Mi negocio',
  otraPestana: 'Nueva pestaña',
  pieZip: 'Hecho con Avelina · avelina.com.mx',
};

const FAMILIAS = {
  sans: '"Helvetica Neue", Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", Courier, monospace',
  redonda: '"Arial Rounded MT Bold", "Varela Round", "Trebuchet MS", sans-serif',
};
const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

// ---------- dibujo ----------
function trazarForma(ctx, forma, n) {
  ctx.beginPath();
  if (forma === 'circulo') ctx.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2);
  else if (forma === 'redondeado') {
    const r = n * 0.22;
    ctx.moveTo(r, 0); ctx.arcTo(n, 0, n, n, r); ctx.arcTo(n, n, 0, n, r); ctx.arcTo(0, n, 0, 0, r); ctx.arcTo(0, 0, n, 0, r); ctx.closePath();
  } else ctx.rect(0, 0, n, n);
}

// Dibuja el ícono maestro (cuadrado de n px). st: { origen, letras, emoji, img, familia, forma, fondo, texto, margen }
export function dibujar(st, n = 512, { fondoObligado } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const ctx = c.getContext('2d');
  // El ícono del celular va cuadrado y sin transparencia: el sistema le redondea las esquinas.
  const forma = fondoObligado ? 'cuadrado' : st.forma;
  const colorFondo = st.forma === 'ninguno' && fondoObligado ? '#FFFFFF' : st.fondo;
  if (forma !== 'ninguno') {
    trazarForma(ctx, forma, n);
    ctx.fillStyle = colorFondo;
    ctx.fill();
    ctx.save();
    trazarForma(ctx, forma, n);
    ctx.clip();
  } else ctx.save();
  const margen = Math.max(0, Math.min(0.4, (st.margen ?? 14) / 100));
  const caja = n * (1 - 2 * margen);
  if (st.origen === 'imagen' && st.img) {
    const w = st.img.naturalWidth || st.img.width, hh = st.img.naturalHeight || st.img.height;
    const k = Math.min(caja / w, caja / hh);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(st.img, (n - w * k) / 2, (n - hh * k) / 2, w * k, hh * k);
  } else {
    const s = st.origen === 'emoji' ? [...(st.emoji || '')].slice(0, 8).join('') : [...String(st.letras || '').trim()].slice(0, 2).join('');
    if (s) {
      const fam = st.origen === 'emoji' ? EMOJI : FAMILIAS[st.familia] || FAMILIAS.sans;
      const peso = st.origen === 'emoji' ? '' : 'bold ';
      ctx.font = `${peso}100px ${fam}`;
      const m = ctx.measureText(s);
      const aw = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width);
      const ah = (m.actualBoundingBoxAscent || 72) + (m.actualBoundingBoxDescent || 0);
      const k = Math.min(caja / Math.max(1, aw), caja / Math.max(1, ah));
      const tam = 100 * k;
      ctx.font = `${peso}${tam}px ${fam}`;
      const m2 = ctx.measureText(s);
      const izq = m2.actualBoundingBoxLeft || 0, der = m2.actualBoundingBoxRight || m2.width;
      const arr = m2.actualBoundingBoxAscent || tam * 0.72, aba = m2.actualBoundingBoxDescent || 0;
      ctx.fillStyle = st.texto;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.fillText(s, (n - (izq + der)) / 2 + izq, (n - (arr + aba)) / 2 + arr);
    }
  }
  ctx.restore();
  return c;
}

// Reduce por mitades para que el ícono pequeño no salga rasposo.
export function reducir(origen, n) {
  let src = origen;
  while (src.width / 2 >= n * 1.5) {
    const m = document.createElement('canvas');
    m.width = m.height = Math.round(src.width / 2);
    const x = m.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(src, 0, 0, m.width, m.height);
    src = m;
  }
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const x = c.getContext('2d');
  x.imageSmoothingQuality = 'high';
  x.drawImage(src, 0, 0, n, n);
  return c;
}

// ---------- ICO real con mapas de bits de 32 bits (16, 32 y 48) ----------
export function crearIco(lienzos) {
  const imgs = lienzos.map((c) => {
    const n = c.width;
    const datos = c.getContext('2d').getImageData(0, 0, n, n).data;
    const filaMascara = Math.ceil(n / 32) * 4;
    const tam = 40 + n * n * 4 + filaMascara * n;
    const b = new Uint8Array(tam);
    const dv = new DataView(b.buffer);
    dv.setUint32(0, 40, true); dv.setInt32(4, n, true); dv.setInt32(8, n * 2, true);
    dv.setUint16(12, 1, true); dv.setUint16(14, 32, true); dv.setUint32(16, 0, true); dv.setUint32(20, n * n * 4 + filaMascara * n, true);
    let o = 40;
    for (let y = n - 1; y >= 0; y--) {
      for (let x = 0; x < n; x++) {
        const i = (y * n + x) * 4;
        b[o++] = datos[i + 2]; b[o++] = datos[i + 1]; b[o++] = datos[i]; b[o++] = datos[i + 3];
      }
    }
    // Máscara AND: un bit por píxel, 1 = transparente.
    for (let y = n - 1; y >= 0; y--) {
      for (let x = 0; x < n; x++) if (datos[(y * n + x) * 4 + 3] === 0) b[o + (x >> 3)] |= 0x80 >> (x & 7);
      o += filaMascara;
    }
    return { n, b };
  });
  const cab = 6 + 16 * imgs.length;
  const total = cab + imgs.reduce((s, x) => s + x.b.length, 0);
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  dv.setUint16(0, 0, true); dv.setUint16(2, 1, true); dv.setUint16(4, imgs.length, true);
  let pos = cab;
  imgs.forEach((im, k) => {
    const e = 6 + 16 * k;
    out[e] = im.n >= 256 ? 0 : im.n; out[e + 1] = im.n >= 256 ? 0 : im.n; out[e + 2] = 0; out[e + 3] = 0;
    dv.setUint16(e + 4, 1, true); dv.setUint16(e + 6, 32, true); dv.setUint32(e + 8, im.b.length, true); dv.setUint32(e + 12, pos, true);
    out.set(im.b, pos);
    pos += im.b.length;
  });
  return new Blob([out], { type: 'image/x-icon' });
}

// ---------- ZIP sin compresión ----------
let tablaCRC;
function crc32(bytes) {
  if (!tablaCRC) {
    tablaCRC = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; tablaCRC[n] = c >>> 0; }
  }
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = tablaCRC[(c ^ bytes[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export async function crearZip(archivos) {
  const enc = new TextEncoder();
  const partes = [], central = [];
  let pos = 0;
  const d = new Date();
  const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const fecha = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  for (const a of archivos) {
    const datos = typeof a.datos === 'string' ? enc.encode(a.datos) : new Uint8Array(await a.datos.arrayBuffer());
    const nombre = enc.encode(a.nombre);
    const crc = crc32(datos);
    const l = new DataView(new ArrayBuffer(30));
    l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x0800, true); l.setUint16(10, hora, true); l.setUint16(12, fecha, true);
    l.setUint32(14, crc, true); l.setUint32(18, datos.length, true); l.setUint32(22, datos.length, true); l.setUint16(26, nombre.length, true);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(12, hora, true);
    c.setUint16(14, fecha, true); c.setUint32(16, crc, true); c.setUint32(20, datos.length, true); c.setUint32(24, datos.length, true);
    c.setUint16(28, nombre.length, true); c.setUint32(42, pos, true);
    partes.push(new Uint8Array(l.buffer), nombre, datos);
    central.push(new Uint8Array(c.buffer), nombre);
    pos += 30 + nombre.length + datos.length;
  }
  const tamC = central.reduce((s, x) => s + x.length, 0);
  const f = new DataView(new ArrayBuffer(22));
  f.setUint32(0, 0x06054b50, true); f.setUint16(8, archivos.length, true); f.setUint16(10, archivos.length, true);
  f.setUint32(12, tamC, true); f.setUint32(16, pos, true);
  return new Blob([...partes, ...central, new Uint8Array(f.buffer)], { type: 'application/zip' });
}

export const CODIGO = [
  '<link rel="icon" href="/favicon.ico" sizes="48x48">',
  '<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  '<link rel="manifest" href="/site.webmanifest">',
].join('\n');

export function manifiesto(nombre, color) {
  return JSON.stringify({
    name: nombre, short_name: nombre.slice(0, 12),
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
    theme_color: color, background_color: '#ffffff', display: 'standalone',
  }, null, 2) + '\n';
}

function cssPropio() {
  if (document.querySelector('link[data-ah-css-favicon]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/favicon.css', import.meta.url).href;
  l.setAttribute('data-ah-css-favicon', '1');
  document.head.appendChild(l);
}

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const st = { origen: 'letras', letras: 'A', emoji: '🌮', img: null, familia: 'sans', forma: 'redondeado', fondo: '#1F3A5F', texto: '#FFFFFF', margen: 14, titulo: '' };

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah afv', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);
  const est = estado();

  const letras = h('input', { type: 'text', class: 'ah-input afv-letras', maxlength: 4, value: st.letras, placeholder: t.letrasEjemplo, autocomplete: 'off' });
  letras.addEventListener('input', () => { st.letras = letras.value; pintar(); });
  const emoji = h('input', { type: 'text', class: 'ah-input afv-letras', maxlength: 16, value: st.emoji, autocomplete: 'off' });
  emoji.addEventListener('input', () => { st.emoji = emoji.value; pintar(); });
  const archivo = h('input', { type: 'file', class: 'ah-archivo', accept: 'image/png,image/jpeg,image/webp,image/svg+xml,image/gif' });
  archivo.addEventListener('change', async () => {
    const f = archivo.files && archivo.files[0];
    if (!f) return;
    try { st.img = (await leerImagen(f)).img; st.origen = 'imagen'; chipsOrigen.fijar('imagen'); mostrarOrigen(); pintar(); } catch (e) { est.decir(t.noImagen, 5000); }
  });
  const cLetras = campo(t.letras, letras), cEmoji = campo(t.emoji, emoji, t.emojiAyuda), cImagen = campo(t.imagen, archivo, t.imagenAyuda);
  const chipsFam = opcionesChip('familia', t.letra, Object.entries(t.letrasTipos), st.familia, (v) => { st.familia = v; pintar(); });
  const chipsOrigen = opcionesChip('origen', t.origen, Object.entries(t.origenes), st.origen, (v) => { st.origen = v; mostrarOrigen(); pintar(); });
  const chipsForma = opcionesChip('forma', t.forma, Object.entries(t.formas), st.forma, (v) => { st.forma = v; selFondo.hidden = v === 'ninguno'; pintar(); });
  const selFondo = selectorColor(t.fondo, st.fondo, (v) => { st.fondo = v; pintar(); });
  const selTexto = selectorColor(t.texto, st.texto, (v) => { st.texto = v; pintar(); });
  const rango = h('input', { type: 'range', class: 'ah-rango', min: 0, max: 30, value: st.margen });
  const valor = h('span', { class: 'ah-valor', text: st.margen + '%' });
  rango.addEventListener('input', () => { st.margen = +rango.value; valor.textContent = rango.value + '%'; pintar(); });
  const cMargen = h('div', { class: 'ah-campo' }, h('label', { class: 'ah-etiqueta', for: rango.id = 'afv-m-' + Math.random().toString(36).slice(2) }, t.margen, valor), rango);
  const titulo = h('input', { type: 'text', class: 'ah-input', placeholder: t.tituloEjemplo, maxlength: 60, autocomplete: 'off' });
  titulo.addEventListener('input', () => { st.titulo = titulo.value; pintarTitulo(); });

  function mostrarOrigen() {
    cLetras.hidden = st.origen !== 'letras';
    chipsFam.hidden = st.origen !== 'letras';
    selTexto.hidden = st.origen !== 'letras';
    cEmoji.hidden = st.origen !== 'emoji';
    cImagen.hidden = st.origen !== 'imagen';
  }

  raiz.append(h('div', { class: 'ah-columna' }, chipsOrigen, cLetras, cEmoji, cImagen, chipsFam, chipsForma,
    h('div', { class: 'ah-fila' }, selFondo, selTexto), cMargen, campo(t.titulo, titulo)));

  // Vista: pestañas estilo Windows en claro y oscuro, tamaños reales y la pantalla del celular.
  const icono16 = [h('img', { alt: '', width: 16, height: 16 }), h('img', { alt: '', width: 16, height: 16 })];
  const textoPestana = [h('span', { class: 'afv-tab-titulo' }), h('span', { class: 'afv-tab-titulo' })];
  const pestana = (k, clase) => h('div', { class: 'afv-barra ' + clase, 'aria-hidden': 'true' },
    h('div', { class: 'afv-tab' }, icono16[k], textoPestana[k], h('span', { class: 'afv-x', text: '×' })),
    h('div', { class: 'afv-tab afv-tab-otra' }, h('span', { class: 'afv-punto' }), h('span', { class: 'afv-tab-titulo', text: t.otraPestana })),
    h('span', { class: 'afv-ventana', text: '—  ☐  ✕' }));
  const muestras = [16, 32, 48, 180].map((n) => h('figure', { class: 'afv-muestra' }, h('img', { alt: `${n} × ${n}`, width: Math.min(n, 96), height: Math.min(n, 96), class: n <= 48 ? 'afv-pixel' : '' }), h('figcaption', { text: `${n} px` })));
  const iconoCel = h('img', { alt: '', width: 60, height: 60, class: 'afv-cel-img' });
  const nombreCel = h('span', { class: 'afv-cel-nombre' });
  const codigo = h('pre', { class: 'ah-salida afv-codigo', text: CODIGO, tabindex: '0' });

  const bZip = boton(t.zip, bajarZip);
  const bIco = boton(t.ico, async () => { descargar(crearIco([16, 32, 48].map((n) => reducir(maestro, n))), 'favicon.ico'); avisar(contenedor, ID, 'descargar'); }, 'ah-boton ah-boton-2');
  const bPng = boton(t.png, async () => { descargar(await lienzoABlob(reducir(maestro, 512)), 'icon-512.png'); avisar(contenedor, ID, 'descargar'); }, 'ah-boton ah-boton-2');
  const bCodigo = boton(t.copiarCodigo, async () => {
    const ok = await copiar(CODIGO);
    est.decir(ok ? t.copiado : t.noCopiado);
    if (ok) avisar(contenedor, ID, 'copiar');
  }, 'ah-boton ah-boton-2');

  raiz.append(h('div', { class: 'ah-vista' },
    h('h3', { class: 'ah-titulo-vista', text: t.vista }), pestana(0, 'afv-claro'), pestana(1, 'afv-oscuro'),
    h('h3', { class: 'ah-titulo-vista', text: t.tamanos }), h('div', { class: 'afv-muestras' }, ...muestras),
    h('h3', { class: 'ah-titulo-vista', text: t.celular }), h('div', { class: 'afv-cel', 'aria-hidden': 'true' }, h('div', { class: 'afv-cel-app' }, iconoCel, nombreCel)),
    h('div', { class: 'ah-acciones' }, bZip, bIco, bPng), est,
    h('h3', { class: 'ah-titulo-vista', text: t.codigo }), h('p', { class: 'ah-nota', text: t.codigoAyuda }), codigo,
    h('div', { class: 'ah-acciones' }, bCodigo)));

  let maestro = null;
  let tPintar;
  function pintar() {
    clearTimeout(tPintar);
    tPintar = setTimeout(pintarYa, 40);
  }
  function pintarYa() {
    maestro = dibujar(st, 512);
    const u16 = reducir(maestro, 16).toDataURL();
    for (const i of icono16) i.src = u16;
    [16, 32, 48].forEach((n, k) => { muestras[k].querySelector('img').src = reducir(maestro, n).toDataURL(); });
    const apple = reducir(dibujar(st, 512, { fondoObligado: true }), 180).toDataURL();
    muestras[3].querySelector('img').src = apple;
    iconoCel.src = apple;
    pintarTitulo();
  }
  function pintarTitulo() {
    const s = (st.titulo || '').trim() || t.nombreApp;
    for (const x of textoPestana) x.textContent = s;
    nombreCel.textContent = s.length > 12 ? s.slice(0, 11) + '…' : s;
  }

  async function bajarZip() {
    const nombre = (st.titulo || '').trim() || t.nombreApp;
    const conFondo = dibujar(st, 512, { fondoObligado: true });
    const archivos = [
      { nombre: 'favicon.ico', datos: crearIco([16, 32, 48].map((n) => reducir(maestro, n))) },
      { nombre: 'apple-touch-icon.png', datos: await lienzoABlob(reducir(conFondo, 180)) },
      { nombre: 'icon-192.png', datos: await lienzoABlob(reducir(maestro, 192)) },
      { nombre: 'icon-512.png', datos: await lienzoABlob(reducir(maestro, 512)) },
      { nombre: 'site.webmanifest', datos: manifiesto(nombre, st.forma === 'ninguno' ? '#ffffff' : st.fondo) },
      { nombre: 'codigo-para-head.txt', datos: CODIGO + '\n\n' + t.pieZip + '\n' },
    ];
    descargar(await crearZip(archivos), 'favicon.zip');
    avisar(contenedor, ID, 'descargar');
  }

  mostrarOrigen();
  pintarYa();
  return { destruir() { contenedor.textContent = ''; } };
}
