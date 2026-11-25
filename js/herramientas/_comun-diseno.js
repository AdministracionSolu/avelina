// Piezas comunes de los motores de diseño de Avelina (editor-diseno y logo).
// Todo corre en el navegador. Las tipografías son trazos (fuentes/<id>.js): así el texto sale igual
// en pantalla, en PNG, en PDF vectorial y en SVG, sin depender de las letras instaladas en el equipo.
// Ninguna función de aquí hace peticiones a otros sitios.

import { PIE, hexARgb } from './_comun.js';
import { generarQR } from './_qr-codificador.js';

// ---------- tipografías ----------
// [id, nombre visible, familia] (todas OFL; licencias en fuentes/LICENCIAS.txt)
export const FUENTES = [
  ['archivo-400', 'Archivo', 'palo seco'],
  ['archivo-700', 'Archivo negrita', 'palo seco'],
  ['archivo-angosta', 'Archivo angosta', 'palo seco'],
  ['outfit-300', 'Outfit ligera', 'geométrica'],
  ['outfit-600', 'Outfit', 'geométrica'],
  ['bricolage', 'Bricolage', 'palo seco'],
  ['anton', 'Anton', 'angosta'],
  ['bigshoulders', 'Big Shoulders', 'angosta'],
  ['fraunces', 'Fraunces', 'con remate'],
  ['fraunces-300', 'Fraunces ligera', 'con remate'],
  ['instrument', 'Instrument Serif', 'con remate'],
  ['instrument-it', 'Instrument cursiva', 'con remate'],
  ['cinzel', 'Cinzel', 'con remate'],
  ['italiana', 'Italiana', 'con remate'],
  ['zilla', 'Zilla Slab', 'egipcia'],
  ['alfa', 'Alfa Slab', 'egipcia'],
  ['baloo', 'Baloo', 'redonda'],
  ['caveat', 'Caveat', 'a mano'],
  ['pinyon', 'Pinyon Script', 'caligráfica'],
  ['fraktur', 'Unifraktur', 'gótica'],
];
export const NOMBRE_FUENTE = Object.fromEntries(FUENTES.map(([id, n]) => [id, n]));

const cacheFuentes = new Map();
export function cargarFuente(id) {
  if (!NOMBRE_FUENTE[id]) id = 'archivo-400';
  if (!cacheFuentes.has(id)) {
    const url = new URL(`../../fuentes/${id}.js`, import.meta.url).href;
    const p = import(url).then((m) => preparar(id, m.default));
    p.catch(() => cacheFuentes.delete(id));
    cacheFuentes.set(id, p);
  }
  return cacheFuentes.get(id);
}
export function cargarFuentes(ids) {
  return Promise.all([...new Set(ids)].map(cargarFuente)).then((l) => Object.fromEntries(l.map((f) => [f.id, f])));
}

function preparar(id, f) {
  f.id = id;
  f.p2 = new Map();
  return f;
}

function sinAcento(c) {
  const b = c.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return b.length === 1 ? b : null;
}
function glifo(f, c) {
  let g = f.g[c];
  if (g) return g;
  const b = sinAcento(c);
  if (b && f.g[b]) return f.g[b];
  if (c === '\t') return f.g[' '];
  const sup = { '²': '2', '³': '3', '¹': '1' }[c];
  if (sup && f.g[sup]) return f.g[sup];
  return null;
}
function kern(f, a, b) {
  if (!a) return 0;
  let k = f.k[a + b];
  if (k == null) {
    const a2 = sinAcento(a) || a; const b2 = sinAcento(b) || b;
    k = f.k[a2 + b2] || 0;
  }
  return k;
}

// Ancho de una palabra en unidades de la fuente (sin el espaciado final).
function anchoPalabra(f, s, track) {
  let x = 0, prev = '';
  for (const c of s) {
    const g = glifo(f, c);
    if (!g) continue;
    x += kern(f, prev, c) + g[0] + track;
    prev = c;
  }
  return s.length ? x - track : 0;
}

// Arma las líneas de un texto. Devuelve tamaños en unidades del diseño.
export function componer(f, o) {
  let tam = o.tam;
  let texto = String(o.texto ?? '');
  if (o.mayus) texto = texto.toLocaleUpperCase('es-MX');
  const parrafos = texto.replace(/\r/g, '').split('\n').map((p) => p.trim().split(/\s+/).filter(Boolean));
  const track = ((o.espaciado || 0) / 1000) * f.u;
  const inter = o.interlinea || 1.18;
  const esp = (f.g[' '] ? f.g[' '][0] : f.u * 0.25) + track;
  const max = o.maxLineas || 99;
  const minTam = o.minTam || o.tam * 0.45;
  let lineas;
  for (let intento = 0; intento < 40; intento++) {
    const s = tam / f.u;
    const anchoU = o.w ? o.w / s : Infinity;
    lineas = [];
    let partida = false;
    for (const pal of parrafos) {
      let actual = [], ancho = 0;
      for (const w of pal) {
        const aw = anchoPalabra(f, w, track);
        if (aw > anchoU) partida = true;
        if (actual.length && ancho + esp + aw > anchoU) {
          lineas.push({ palabras: actual, ancho });
          actual = [w]; ancho = aw;
        } else {
          ancho += (actual.length ? esp : 0) + aw;
          actual.push(w);
        }
      }
      lineas.push({ palabras: actual, ancho });
    }
    const altoT = (f.c / f.u) * tam + (lineas.length - 1) * tam * inter;
    const cabe = !partida && lineas.length <= max && (!o.h || altoT <= o.h);
    if (cabe || o.ajustar === false || tam <= minTam) break;
    tam = Math.max(minTam, tam * 0.94);
  }
  const s = tam / f.u;
  const capT = (f.c / f.u) * tam;
  const altoT = capT + (lineas.length - 1) * tam * inter;
  const corridas = [];
  let y0 = o.y;
  if (o.vy === 'abajo') y0 = o.y - altoT;
  else if (o.vy === 'centro') y0 = o.y - altoT / 2;
  let minX = Infinity, maxX = -Infinity;
  lineas.forEach((l, i) => {
    const anchoD = l.ancho * s;
    const caja = o.w || anchoD;
    let x = o.x;
    if (o.alin === 'centro') x = o.x + (caja - anchoD) / 2;
    else if (o.alin === 'der') x = o.x + caja - anchoD;
    if (!o.w && o.alin === 'centro') x = o.x - anchoD / 2;
    if (!o.w && o.alin === 'der') x = o.x - anchoD;
    const base = y0 + capT + i * tam * inter;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x + anchoD);
    let cx = 0, prev = '';
    l.palabras.forEach((w, j) => {
      if (j) { cx += esp; prev = ' '; }
      for (const c of w) {
        const g = glifo(f, c);
        if (!g) continue;
        cx += kern(f, prev, c);
        if (g[1]) corridas.push({ d: g[1], m: [s, 0, 0, s, x + cx * s, base] });
        cx += g[0] + track;
        prev = c;
      }
    });
  });
  if (!isFinite(minX)) { minX = o.x; maxX = o.x + (o.w || 0); }
  const desc = tam * 0.22;
  return {
    corridas, tam, lineas: lineas.length,
    caja: { x: minX, y: y0, w: maxX - minX, h: altoT + desc },
    alto: altoT, base: y0 + altoT,
  };
}

// Ancho de un texto de una línea (unidades del diseño).
export function medirLinea(f, texto, tam, espaciado = 0) {
  const track = (espaciado / 1000) * f.u;
  return (anchoPalabra(f, String(texto), track) * tam) / f.u;
}

// ---------- geometría (rutas absolutas M L C Q Z) ----------
const r2 = (v) => Math.round(v * 100) / 100;
const K = 0.5522847498;
export function rectD(x, y, w, h, r = 0) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  if (!r) return `M${r2(x)} ${r2(y)}L${r2(x + w)} ${r2(y)}L${r2(x + w)} ${r2(y + h)}L${r2(x)} ${r2(y + h)}Z`;
  const c = r * (1 - K);
  return `M${r2(x + r)} ${r2(y)}L${r2(x + w - r)} ${r2(y)}C${r2(x + w - c)} ${r2(y)} ${r2(x + w)} ${r2(y + c)} ${r2(x + w)} ${r2(y + r)}` +
    `L${r2(x + w)} ${r2(y + h - r)}C${r2(x + w)} ${r2(y + h - c)} ${r2(x + w - c)} ${r2(y + h)} ${r2(x + w - r)} ${r2(y + h)}` +
    `L${r2(x + r)} ${r2(y + h)}C${r2(x + c)} ${r2(y + h)} ${r2(x)} ${r2(y + h - c)} ${r2(x)} ${r2(y + h - r)}` +
    `L${r2(x)} ${r2(y + r)}C${r2(x)} ${r2(y + c)} ${r2(x + c)} ${r2(y)} ${r2(x + r)} ${r2(y)}Z`;
}
export function elipseD(x, y, w, h) {
  const rx = w / 2, ry = h / 2, cx = x + rx, cy = y + ry, kx = rx * K, ky = ry * K;
  return `M${r2(cx)} ${r2(y)}C${r2(cx + kx)} ${r2(y)} ${r2(x + w)} ${r2(cy - ky)} ${r2(x + w)} ${r2(cy)}` +
    `C${r2(x + w)} ${r2(cy + ky)} ${r2(cx + kx)} ${r2(y + h)} ${r2(cx)} ${r2(y + h)}` +
    `C${r2(cx - kx)} ${r2(y + h)} ${r2(x)} ${r2(cy + ky)} ${r2(x)} ${r2(cy)}` +
    `C${r2(x)} ${r2(cy - ky)} ${r2(cx - kx)} ${r2(y)} ${r2(cx)} ${r2(y)}Z`;
}
export const circD = (cx, cy, r) => elipseD(cx - r, cy - r, 2 * r, 2 * r);
export function poliD(pts, cerrar = true) {
  return pts.map((p, i) => (i ? 'L' : 'M') + r2(p[0]) + ' ' + r2(p[1])).join('') + (cerrar ? 'Z' : '');
}
// Arco de a0 a a1 (radianes, sentido horario en pantalla). mover=false continúa la ruta.
export function arcoD(cx, cy, r, a0, a1, mover = true) {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 2)));
  const paso = (a1 - a0) / n;
  const k = (4 / 3) * Math.tan(paso / 4);
  let s = (mover ? 'M' : 'L') + r2(cx + r * Math.cos(a0)) + ' ' + r2(cy + r * Math.sin(a0));
  for (let i = 0; i < n; i++) {
    const t0 = a0 + i * paso, t1 = t0 + paso;
    const p0 = [Math.cos(t0), Math.sin(t0)], p1 = [Math.cos(t1), Math.sin(t1)];
    s += 'C' + r2(cx + r * (p0[0] - k * p0[1])) + ' ' + r2(cy + r * (p0[1] + k * p0[0])) + ' ' +
      r2(cx + r * (p1[0] + k * p1[1])) + ' ' + r2(cy + r * (p1[1] - k * p1[0])) + ' ' +
      r2(cx + r * p1[0]) + ' ' + r2(cy + r * p1[1]);
  }
  return s;
}

// Lee una ruta absoluta (M L H V C Q Z) en una lista de [comando, ...números].
export function leerD(d) {
  const t = String(d).match(/[MLHVCQZmlhvcqz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || [];
  const out = [];
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0;
  const num = () => parseFloat(t[i++]);
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const ax = (v) => (rel ? x + v : v), ay = (v) => (rel ? y + v : v);
    if (C === 'Z') { out.push(['Z']); x = sx; y = sy; continue; }
    if (C === 'M') { x = ax(num()); y = ay(num()); sx = x; sy = y; out.push(['M', x, y]); cmd = rel ? 'l' : 'L'; }
    else if (C === 'L') { x = ax(num()); y = ay(num()); out.push(['L', x, y]); }
    else if (C === 'H') { x = ax(num()); out.push(['L', x, y]); }
    else if (C === 'V') { y = ay(num()); out.push(['L', x, y]); }
    else if (C === 'C') { const a = [ax(num()), ay(num()), ax(num()), ay(num()), ax(num()), ay(num())]; x = a[4]; y = a[5]; out.push(['C', ...a]); }
    else if (C === 'Q') { const a = [ax(num()), ay(num()), ax(num()), ay(num())]; x = a[2]; y = a[3]; out.push(['Q', ...a]); }
    else i++;
  }
  return out;
}
const ap = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
// Aplica una matriz a una ruta y devuelve la ruta nueva (para SVG y para encajar formas).
export function transformarD(d, m, dec = 2) {
  const f = (v) => { const p = 10 ** dec; return String(Math.round(v * p) / p); };
  let s = '';
  for (const c of leerD(d)) {
    if (c[0] === 'Z') { s += 'Z'; continue; }
    s += c[0];
    const pts = [];
    for (let i = 1; i < c.length; i += 2) pts.push(ap(m, c[i], c[i + 1]).map(f).join(' '));
    s += pts.join(' ');
  }
  return s.replace(/ -/g, '-');
}
export function encajarD(d, x, y, w, h, caja = 100) {
  return transformarD(d, [w / caja, 0, 0, h / caja, x, y]);
}
// Caja que ocupa una ruta (aproxima curvas por sus puntos de control).
export function cajaD(d) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of leerD(d)) for (let i = 1; i < c.length; i += 2) {
    x0 = Math.min(x0, c[i]); x1 = Math.max(x1, c[i]); y0 = Math.min(y0, c[i + 1]); y1 = Math.max(y1, c[i + 1]);
  }
  return isFinite(x0) ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : { x: 0, y: 0, w: 0, h: 0 };
}

// ---------- color ----------
export function mezclar(a, b, t) {
  const A = hexARgb(a) || [0, 0, 0], B = hexARgb(b) || [255, 255, 255];
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
}
export function esOscuro(hex) {
  const c = hexARgb(hex) || [255, 255, 255];
  return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2] < 140;
}

// ---------- QR como ruta ----------
const cacheQR = new Map();
export function rutaQR(texto) {
  if (cacheQR.has(texto)) return cacheQR.get(texto);
  let q;
  try { q = generarQR(texto, { nivel: 'M' }); } catch (e) { return null; }
  let d = '';
  for (let y = 0; y < q.tam; y++) for (let x = 0; x < q.tam; x++) {
    if (!q.modulos[y * q.tam + x]) continue;
    let k = x;
    while (k + 1 < q.tam && q.modulos[y * q.tam + k + 1]) k++;
    d += `M${x} ${y}L${k + 1} ${y}L${k + 1} ${y + 1}L${x} ${y + 1}Z`;
    x = k;
  }
  const r = { d, tam: q.tam };
  if (cacheQR.size > 30) cacheQR.clear();
  cacheQR.set(texto, r);
  return r;
}

// ---------- pintar una cara en cualquier destino ----------
// Elementos (unidades del diseño):
//  rect {x,y,w,h,color,borde,grosor,radio}  elipse {x,y,w,h,color,borde,grosor}
//  linea {x1,y1,x2,y2,color,grosor,guiones,cap}  forma {d,caja?,x,y,w,h,color,borde,grosor,regla,cap,junta}
//  texto {texto,x,y,w,tam,fuente,color,alin,vy,interlinea,espaciado,mayus,maxLineas,h}
//  imagen {src,x,y,w,h,ajuste:'cubrir'|'contener',radio}  qr {datos,x,y,w,color,fondo}
export function rutaDe(el) {
  if (el.tipo === 'rect') return rectD(el.x, el.y, el.w, el.h, el.radio || 0);
  if (el.tipo === 'elipse') return elipseD(el.x, el.y, el.w, el.h);
  if (el.tipo === 'linea') return `M${r2(el.x1)} ${r2(el.y1)}L${r2(el.x2)} ${r2(el.y2)}`;
  if (el.tipo === 'forma') return el.w ? encajarD(el.d, el.x, el.y, el.w, el.h, el.caja || 100) : el.d;
  return '';
}

export function limites(el, fuentes) {
  if (el.tipo === 'texto') {
    const f = fuentes[el.fuente];
    if (!f) return null;
    return (el._c || (el._c = componer(f, el))).caja;
  }
  if (el.tipo === 'linea') {
    const g = (el.grosor || 0) / 2;
    return { x: Math.min(el.x1, el.x2) - g, y: Math.min(el.y1, el.y2) - g, w: Math.abs(el.x2 - el.x1) + 2 * g, h: Math.abs(el.y2 - el.y1) + 2 * g };
  }
  if (el.tipo === 'qr') return { x: el.x, y: el.y, w: el.w, h: el.w };
  if (el.tipo === 'forma' && !el.w) return cajaD(el.d);
  return { x: el.x, y: el.y, w: el.w, h: el.h };
}

export function pintarCara(b, cara, rec) {
  const { fuentes = {}, imagenes = {} } = rec;
  if (cara.fondo) b.relleno(rectD(0, 0, cara.ancho, cara.alto), cara.fondo);
  for (const el of cara.el) {
    if (!el || el.oculto) continue;
    const t = el.tipo;
    if (t === 'texto') {
      const f = fuentes[el.fuente];
      if (!f) continue;
      const c = el._c || (el._c = componer(f, el));
      for (const r of c.corridas) b.relleno(r.d, el.color, 'nonzero', r.m);
    } else if (t === 'imagen') {
      const im = imagenes[el.src];
      if (!im) continue;
      const r = im.w / im.h;
      let w = el.w, h = el.h;
      if ((el.ajuste === 'cubrir') === (r > el.w / el.h)) w = h * r; else h = w / r;
      const x = el.x + (el.w - w) * (el.ax ?? 0.5), y = el.y + (el.h - h) * (el.ay ?? 0.5);
      const recorte = el.ajuste === 'cubrir' || el.radio ? (el.radio === 'circulo' ? elipseD(el.x, el.y, el.w, el.h) : rectD(el.x, el.y, el.w, el.h, el.radio || 0)) : null;
      b.imagen(im, x, y, w, h, recorte);
    } else if (t === 'qr') {
      const q = rutaQR(el.datos);
      if (!q) continue;
      const m = el.fondo ? 2 : 0;
      const k = el.w / (q.tam + 2 * m);
      if (el.fondo) b.relleno(rectD(el.x, el.y, el.w, el.w), el.fondo);
      b.relleno(q.d, el.color || '#000000', 'nonzero', [k, 0, 0, k, el.x + m * k, el.y + m * k]);
    } else {
      const d = rutaDe(el);
      if (el.color && t !== 'linea') b.relleno(d, el.color, el.regla || 'nonzero');
      if (el.borde || t === 'linea') b.trazo(d, el.borde || el.color, el.grosor || 1, el);
    }
  }
  if (rec.pie) {
    const f = fuentes['archivo-400'];
    if (f) {
      const tam = rec.pieTam || Math.min(cara.ancho, cara.alto) * 0.022;
      const c = componer(f, { texto: PIE, x: cara.ancho / 2, y: cara.alto - tam * 0.75, vy: 'abajo', tam, alin: 'centro', ajustar: false });
      for (const r of c.corridas) b.relleno(r.d, '#8C8C8C', 'nonzero', r.m);
    }
  }
}

// ---------- destino: lienzo ----------
export function destinoCanvas(ctx) {
  const cache = new Map();
  const p2 = (d) => {
    let p = cache.get(d);
    if (!p) { p = new Path2D(d); if (cache.size > 4000) cache.clear(); cache.set(d, p); }
    return p;
  };
  return {
    relleno(d, color, regla, m) {
      ctx.save();
      if (m) ctx.transform(...m);
      ctx.fillStyle = color;
      ctx.fill(p2(d), regla === 'evenodd' ? 'evenodd' : 'nonzero');
      ctx.restore();
    },
    trazo(d, color, grosor, o = {}) {
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = grosor;
      ctx.lineCap = o.cap || 'butt'; ctx.lineJoin = o.junta || 'miter';
      if (o.guiones) ctx.setLineDash(o.guiones);
      ctx.stroke(p2(d));
      ctx.restore();
    },
    imagen(im, x, y, w, h, recorte) {
      ctx.save();
      if (recorte) ctx.clip(p2(recorte));
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(im.img, x, y, w, h);
      ctx.restore();
    },
  };
}

// ---------- destino: SVG ----------
export function destinoSVG() {
  const partes = [];
  const est = (o) => `stroke-linecap="${o.cap || 'butt'}" stroke-linejoin="${o.junta || 'miter'}"` + (o.guiones ? ` stroke-dasharray="${o.guiones.join(' ')}"` : '');
  return {
    partes,
    relleno(d, color, regla, m) {
      partes.push(`<path d="${m ? transformarD(d, m) : d}" fill="${color}"${regla === 'evenodd' ? ' fill-rule="evenodd"' : ''}/>`);
    },
    trazo(d, color, grosor, o = {}) {
      partes.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(grosor)}" ${est(o)}/>`);
    },
    imagen(im, x, y, w, h) {
      if (im.url) partes.push(`<image href="${im.url}" x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" preserveAspectRatio="none"/>`);
    },
  };
}

// ---------- destino: PDF (vectorial) ----------
const n3 = (v) => { const r = Math.round(v * 1000) / 1000; return String(Object.is(r, -0) ? 0 : r); };
function opsPDF(d) {
  let s = '', cx = 0, cy = 0;
  for (const c of leerD(d)) {
    if (c[0] === 'M') { s += `${n3(c[1])} ${n3(c[2])} m `; cx = c[1]; cy = c[2]; }
    else if (c[0] === 'L') { s += `${n3(c[1])} ${n3(c[2])} l `; cx = c[1]; cy = c[2]; }
    else if (c[0] === 'C') { s += c.slice(1).map(n3).join(' ') + ' c '; cx = c[5]; cy = c[6]; }
    else if (c[0] === 'Q') {
      const [qx, qy, x, y] = c.slice(1);
      s += [cx + (2 / 3) * (qx - cx), cy + (2 / 3) * (qy - cy), x + (2 / 3) * (qx - x), y + (2 / 3) * (qy - y), x, y].map(n3).join(' ') + ' c ';
      cx = x; cy = y;
    } else s += 'h ';
  }
  return s;
}
const n6 = (v) => (Math.abs(v) < 1e-6 ? "0" : String(parseFloat(v.toPrecision(6))));
const rgbPDF = (hex) => (hexARgb(hex) || [0, 0, 0]).map((v) => n3(v / 255)).join(' ');

export function destinoPDF(pdf) {
  let s = '';
  const imgs = new Map();
  const b = {
    relleno(d, color, regla, m) {
      s += 'q ' + (m ? m.map(n6).join(' ') + ' cm ' : '') + rgbPDF(color) + ' rg ' + opsPDF(d) + (regla === 'evenodd' ? 'f*' : 'f') + ' Q\n';
    },
    trazo(d, color, grosor, o = {}) {
      const cap = { round: 1, square: 2 }[o.cap] || 0, junta = { round: 1, bevel: 2 }[o.junta] || 0;
      s += `q ${rgbPDF(color)} RG ${n3(grosor)} w ${cap} J ${junta} j ` + (o.guiones ? `[${o.guiones.map(n3).join(' ')}] 0 d ` : '') + opsPDF(d) + 'S Q\n';
    },
    imagen(im, x, y, w, h, recorte) {
      let nombre = imgs.get(im);
      if (!nombre) { nombre = pdf.imagen(im); imgs.set(im, nombre); }
      s += 'q ' + (recorte ? opsPDF(recorte) + 'W n ' : '') + `${n3(w)} 0 0 ${n3(-h)} ${n3(x)} ${n3(y + h)} cm /${nombre} Do Q\n`;
    },
    texto: () => s,
    agregar(t) { s += t; },
  };
  return b;
}

const enc = new TextEncoder();
async function desinflar(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  const cs = new CompressionStream('deflate');
  const r = new Response(new Blob([bytes]).stream().pipeThrough(cs));
  return new Uint8Array(await r.arrayBuffer());
}

// PDF mínimo: páginas con contenido vectorial, imágenes y formularios (para hojas de corte).
export class PDF {
  constructor() { this.objs = []; this.pags = []; this.imgs = []; this.formas = []; this.pend = []; }
  obj(dic, flujo) { this.objs.push({ dic, flujo }); return this.objs.length; }
  // im: {img, w, h} → nombre de recurso. Se codifica al cerrar.
  imagen(im) {
    const nombre = 'Im' + (this.imgs.length + 1);
    const ref = this.obj(null);
    this.imgs.push({ nombre, ref, im });
    return nombre;
  }
  // Agrega una página de ancho × alto en puntos con su contenido (unidades ya en pt, y hacia arriba).
  // extra: entradas más del diccionario de la página (p. ej. /TrimBox y /BleedBox).
  pagina(ancho, alto, contenido, formas = [], extra = '') { this.pags.push({ ancho, alto, contenido, formas, extra }); }
  // Forma reutilizable (una tarjeta) de ancho × alto pt.
  forma(ancho, alto, contenido) {
    const nombre = 'Fm' + (this.formas.length + 1);
    const ref = this.obj(null);
    this.formas.push({ nombre, ref, ancho, alto, contenido });
    return nombre;
  }
  async codificarImagen(e) {
    const { im } = e;
    const max = 2400;
    const k = Math.min(1, max / Math.max(im.w, im.h));
    const w = Math.max(1, Math.round(im.w * k)), h = Math.max(1, Math.round(im.h * k));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(im.img, 0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h).data;
    const rgb = new Uint8Array(w * h * 3), a = new Uint8Array(w * h);
    let conAlfa = false;
    for (let i = 0, j = 0; i < px.length; i += 4, j++) {
      rgb[j * 3] = px[i]; rgb[j * 3 + 1] = px[i + 1]; rgb[j * 3 + 2] = px[i + 2]; a[j] = px[i + 3];
      if (px[i + 3] < 255) conAlfa = true;
    }
    const zr = await desinflar(rgb);
    if (!zr) {
      // Sin compresor: JPEG sobre blanco.
      const c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
      const x2 = c2.getContext('2d'); x2.fillStyle = '#fff'; x2.fillRect(0, 0, w, h); x2.drawImage(c, 0, 0);
      const jpg = new Uint8Array(await (await new Promise((ok) => c2.toBlob(ok, 'image/jpeg', 0.92))).arrayBuffer());
      this.objs[e.ref - 1] = { dic: `/Type/XObject/Subtype/Image/Width ${w}/Height ${h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode`, flujo: jpg };
      return;
    }
    let smask = '';
    if (conAlfa) {
      const za = await desinflar(a);
      const r = this.obj(`/Type/XObject/Subtype/Image/Width ${w}/Height ${h}/ColorSpace/DeviceGray/BitsPerComponent 8/Filter/FlateDecode`, za);
      smask = `/SMask ${r} 0 R`;
    }
    this.objs[e.ref - 1] = { dic: `/Type/XObject/Subtype/Image/Width ${w}/Height ${h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/FlateDecode${smask}`, flujo: zr };
  }
  async flujo(texto) {
    const b = enc.encode(texto);
    const z = await desinflar(b);
    return z ? { filtro: '/Filter/FlateDecode', datos: z } : { filtro: '', datos: b };
  }
  recursos(formas) {
    const x = this.imgs.map((i) => `/${i.nombre} ${i.ref} 0 R`).concat(formas.map((n) => { const f = this.formas.find((g) => g.nombre === n); return `/${n} ${f.ref} 0 R`; }));
    return x.length ? `/Resources<</XObject<<${x.join('')}>>>>` : '/Resources<<>>';
  }
  async blob(titulo) {
    for (const e of this.imgs) await this.codificarImagen(e);
    for (const f of this.formas) {
      const fl = await this.flujo(f.contenido);
      this.objs[f.ref - 1] = { dic: `/Type/XObject/Subtype/Form/BBox[0 0 ${n3(f.ancho)} ${n3(f.alto)}]${this.recursos([])}${fl.filtro}`, flujo: fl.datos };
    }
    const pagesRef = this.obj(null);
    const kids = [];
    for (const p of this.pags) {
      const fl = await this.flujo(p.contenido);
      const c = this.obj(fl.filtro.slice(0) || '', fl.datos);
      this.objs[c - 1].dic = fl.filtro;
      kids.push(this.obj(`/Type/Page/Parent ${pagesRef} 0 R/MediaBox[0 0 ${n3(p.ancho)} ${n3(p.alto)}]${p.extra || ''}${this.recursos(p.formas)}/Contents ${c} 0 R`));
    }
    this.objs[pagesRef - 1] = { dic: `/Type/Pages/Kids[${kids.map((k) => k + ' 0 R').join(' ')}]/Count ${kids.length}` };
    const cat = this.obj(`/Type/Catalog/Pages ${pagesRef} 0 R`);
    const info = this.obj(`/Producer(Avelina \\267 avelina.com.mx)/Title(${String(titulo || 'Diseño').replace(/[()\\]/g, '').replace(/[^\x20-\x7e]/g, (c) => ({ 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N' }[c] || ''))})`);
    const partes = [enc.encode('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')];
    let pos = partes[0].length;
    const offs = [];
    this.objs.forEach((o, i) => {
      offs.push(pos);
      let cab = `${i + 1} 0 obj\n<<${o.dic || ''}`;
      let b;
      if (o.flujo) {
        cab += `/Length ${o.flujo.length}>>\nstream\n`;
        const fin = '\nendstream\nendobj\n';
        b = [enc.encode(cab), o.flujo, enc.encode(fin)];
      } else b = [enc.encode(cab + '>>\nendobj\n')];
      for (const x of b) { partes.push(x); pos += x.length; }
    });
    let xref = `xref\n0 ${this.objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
    xref += `trailer\n<</Size ${this.objs.length + 1}/Root ${cat} 0 R/Info ${info} 0 R>>\nstartxref\n${pos}\n%%EOF\n`;
    partes.push(enc.encode(xref));
    return new Blob(partes, { type: 'application/pdf' });
  }
}

// ---------- PNG con resolución (pHYs) ----------
let tablaCRC;
export function crc32(bytes, crc = 0) {
  if (!tablaCRC) {
    tablaCRC = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; tablaCRC[n] = c >>> 0; }
  }
  crc = ~crc >>> 0;
  for (let i = 0; i < bytes.length; i++) crc = tablaCRC[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
  return ~crc >>> 0;
}
export async function pngConPPP(canvas, ppp) {
  const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
  if (!ppp || !blob) return blob;
  const b = new Uint8Array(await blob.arrayBuffer());
  const ppm = Math.round(ppp / 0.0254);
  const ch = new Uint8Array(21);
  const dv = new DataView(ch.buffer);
  dv.setUint32(0, 9); ch.set([112, 72, 89, 115], 4); dv.setUint32(8, ppm); dv.setUint32(12, ppm); ch[16] = 1;
  dv.setUint32(17, crc32(ch.subarray(4, 17)));
  return new Blob([b.subarray(0, 33), ch, b.subarray(33)], { type: 'image/png' });
}

// ---------- ZIP sin compresión (varios PNG en una descarga) ----------
export async function zip(archivos) {
  const partes = [], central = [];
  let pos = 0;
  const d = new Date();
  const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const fecha = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  for (const a of archivos) {
    const datos = new Uint8Array(await a.blob.arrayBuffer());
    const nombre = enc.encode(a.nombre);
    const crc = crc32(datos);
    const cab = new DataView(new ArrayBuffer(30));
    cab.setUint32(0, 0x04034b50, true); cab.setUint16(4, 20, true); cab.setUint16(6, 0x0800, true);
    cab.setUint16(10, hora, true); cab.setUint16(12, fecha, true); cab.setUint32(14, crc, true);
    cab.setUint32(18, datos.length, true); cab.setUint32(22, datos.length, true); cab.setUint16(26, nombre.length, true);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true);
    cen.setUint16(12, hora, true); cen.setUint16(14, fecha, true); cen.setUint32(16, crc, true);
    cen.setUint32(20, datos.length, true); cen.setUint32(24, datos.length, true); cen.setUint16(28, nombre.length, true);
    cen.setUint32(42, pos, true);
    partes.push(new Uint8Array(cab.buffer), nombre, datos);
    central.push(new Uint8Array(cen.buffer), nombre);
    pos += 30 + nombre.length + datos.length;
  }
  const tamC = central.reduce((s, x) => s + x.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, archivos.length, true); fin.setUint16(10, archivos.length, true);
  fin.setUint32(12, tamC, true); fin.setUint32(16, pos, true);
  return new Blob([...partes, ...central, new Uint8Array(fin.buffer)], { type: 'application/zip' });
}

// Carga un CSS propio de la herramienta (css/herramientas/<id>.css) una sola vez.
export function asegurarCSS(id) {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[data-ah-css-${id}]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL(`../../css/herramientas/${id}.css`, import.meta.url).href;
  l.setAttribute(`data-ah-css-${id}`, '1');
  document.head.appendChild(l);
}

// Imagen subida → registro con medidas (reduce las enormes para no ahogar el celular).
export async function registroImagen(img, url, max = 2400) {
  const k = Math.min(1, max / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  if (k >= 1) return { img, url, w: img.naturalWidth || img.width, h: img.naturalHeight || img.height };
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return { img: c, url: c.toDataURL('image/png'), w: c.width, h: c.height };
}
