// Herramienta «logo» de Avelina: creador de logotipos, isotipos e imagotipos.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// Símbolos propios en logo/simbolos.js; letras como trazos (fuentes/), así el SVG sale igual en cualquier equipo.

import {
  h, campo, textos as unirTextos, avisar, descargar, estado, boton, asegurarEstilos, selectorColor,
  opcionesChip, nombreArchivo,
} from './_comun.js';
import {
  cargarFuentes, componer, pintarCara, destinoCanvas, destinoSVG, transformarD, asegurarCSS, mezclar, esOscuro,
  FUENTES, limites, zip,
} from './_comun-diseno.js';

const ID = 'logo';

export const TEXTOS = {
  cargando: 'Cargando el creador de logos…',
  fallo: 'No se pudo cargar el creador. Recarga la página.',
  nombre: 'Nombre de tu negocio',
  nombreEjemplo: 'Tacos El Güero',
  giro: 'Giro',
  lema: 'Frase debajo del nombre (opcional)',
  lemaEjemplo: 'Desde 1987',
  propuestas: 'Propuestas',
  otras: 'Ver otras propuestas',
  elige: 'Elige una propuesta y ajústala abajo.',
  ajustes: 'Ajusta tu logo',
  disposicion: 'Acomodo',
  disp: { horizontal: 'Símbolo y nombre', vertical: 'Símbolo arriba', logotipo: 'Sólo nombre', isotipo: 'Sólo símbolo', emblema: 'Sello', escudo: 'Escudo', monograma: 'Iniciales' },
  simbolo: 'Símbolo',
  tipografia: 'Tipografía',
  mayus: 'Todo en mayúsculas',
  espaciado: 'Espacio entre letras',
  tamSimbolo: 'Tamaño del símbolo',
  marco: 'Marco de las iniciales',
  marcos: { circulo: 'Círculo', cuadro: 'Cuadro', rombo: 'Rombo', nada: 'Sin marco' },
  relieve: 'Relieve',
  colores: 'Colores',
  cPrim: 'Símbolo y detalles',
  cSec: 'Nombre',
  cFondo: 'Fondo de muestra',
  claro: 'Sobre fondo claro',
  oscuro: 'Sobre fondo oscuro',
  descargar: 'Descargar',
  svg: 'SVG',
  svgOscuro: 'SVG para fondo oscuro',
  png: (n) => `PNG ${n} px`,
  pngOscuro: 'PNG para fondo oscuro',
  perfil: 'Foto de perfil 1080',
  paquete: 'Todo en ZIP',
  gif: 'GIF animado',
  video: (t) => `Video ${t}`,
  svgAnimado: 'SVG animado',
  repetir: 'Repetir animación',
  ayudaDesc: 'El PNG sale con fondo transparente. El SVG se agranda sin perder calidad y sirve para imprenta.',
  ayudaAnim: 'El GIF y el video sirven para historias y para tu página. El SVG animado sirve en páginas web.',
  pie: 'Poner «Hecho con Avelina · avelina.com.mx» debajo del logo',
  preparando: 'Preparando tu archivo…',
  animando: (p) => `Armando la animación… ${p}%`,
  listo: 'Listo. Revisa tus descargas.',
  error: 'No se pudo armar el archivo.',
  vista: (n) => `Logo de ${n}`,
};

// ---------- estilos por modo ----------
const PALETAS = [
  ['#C2410C', '#1E1B16'], ['#0F766E', '#12343B'], ['#1D4ED8', '#0F172A'], ['#B4536A', '#3A2420'], ['#C9973A', '#15201B'],
  ['#7C3AED', '#1F1A2E'], ['#E4572E', '#141414'], ['#2A9D8F', '#264653'], ['#9B2C2C', '#2F241C'], ['#3A6EA5', '#22201C'],
  ['#B08D57', '#151515'], ['#16A34A', '#14281D'], ['#DB2777', '#2A1020'], ['#0EA5E9', '#0B2537'], ['#F59E0B', '#1C1917'], ['#111111', '#111111'],
];
const MONO = [['#111111', '#111111'], ['#6B7280', '#111827'], ['#8C6E54', '#2B2B2B'], ['#3F6212', '#1A2E05'], ['#1E3A8A', '#1E3A8A'], ['#9F1239', '#111111']];
const P_BARBERIA = [['#9B2C2C', '#151515'], ['#B08D57', '#151515'], ['#1F3A5F', '#111111'], ['#111111', '#111111'], ['#2F4F3E', '#151515'], ['#C2410C', '#1C1917']];
const P_CARNE = [['#9B2C2C', '#1C1917'], ['#B91C1C', '#111111'], ['#7C2D12', '#1C1917'], ['#111111', '#111111'], ['#B08D57', '#2B1D14']];
const P_COMIDA = [['#C2410C', '#1E1B16'], ['#9B2C2C', '#2F241C'], ['#C9973A', '#15201B'], ['#2F6B4F', '#1E1B16'], ['#B45309', '#292524'], ['#BE123C', '#1C1917']];
const P_UNAS = [['#B4536A', '#3A2420'], ['#DB2777', '#2A1020'], ['#C08497', '#4A3034'], ['#9D4EDD', '#2A1B3D'], ['#D4A373', '#3A2A1E'], ['#111111', '#111111']];
const P_OBRA = [['#F59E0B', '#1C1917'], ['#EA580C', '#1F2937'], ['#1D4ED8', '#0F172A'], ['#FACC15', '#111111'], ['#475569', '#0F172A'], ['#B91C1C', '#111827']];
const P_TRANSPORTE = [['#1D4ED8', '#0F172A'], ['#EA580C', '#0F172A'], ['#0EA5E9', '#0B2537'], ['#16A34A', '#14281D'], ['#DC2626', '#111111'], ['#F59E0B', '#1C1917']];
const P_ROPA = [['#111111', '#111111'], ['#8C6E54', '#2B2B2B'], ['#B4536A', '#3A2420'], ['#3F6212', '#1A2E05'], ['#1E3A8A', '#1E3A8A'], ['#B08D57', '#151515']];
const TODAS = ['bricolage', 'fraunces', 'outfit-600', 'archivo-angosta', 'zilla', 'instrument', 'cinzel', 'baloo', 'alfa', 'italiana', 'anton', 'outfit-300'];
export const ESTILOS = {
  general: { giro: 'taqueria', fuentes: TODAS, disp: ['horizontal', 'vertical', 'horizontal', 'logotipo', 'emblema', 'monograma', 'vertical', 'horizontal'] },
  minimalista: { giro: 'otro', fuentes: ['outfit-300', 'archivo-400', 'fraunces-300', 'italiana', 'instrument', 'outfit-600'], disp: ['horizontal', 'logotipo', 'vertical', 'monograma'], paletas: MONO, escala: 0.7, espaciado: 140 },
  '3d': { giro: 'otro', fuentes: ['anton', 'bricolage', 'baloo', 'alfa', 'archivo-angosta', 'bigshoulders'], disp: ['horizontal', 'vertical', 'logotipo'], relieve: true },
  letras: { giro: 'otro', fuentes: ['cinzel', 'fraunces', 'instrument', 'italiana', 'bricolage', 'alfa', 'fraktur', 'pinyon'], disp: ['monograma', 'monograma', 'logotipo', 'monograma'] },
  restaurante: { giro: 'restaurante', fuentes: ['fraunces', 'zilla', 'alfa', 'caveat', 'instrument', 'cinzel'], disp: ['horizontal', 'vertical', 'emblema', 'vertical'], paletas: P_COMIDA },
  ropa: { giro: 'ropa', fuentes: ['italiana', 'cinzel', 'instrument-it', 'outfit-300', 'pinyon', 'fraunces-300'], disp: ['logotipo', 'vertical', 'monograma', 'horizontal'], espaciado: 120, paletas: P_ROPA },
  camisetas: { giro: 'camisetas', fuentes: ['fraktur', 'alfa', 'anton', 'bigshoulders', 'caveat', 'zilla'], disp: ['emblema', 'vertical', 'emblema', 'logotipo'], paletas: P_BARBERIA },
  unas: { giro: 'unas', fuentes: ['pinyon', 'italiana', 'instrument-it', 'outfit-300', 'caveat', 'fraunces-300'], disp: ['vertical', 'horizontal', 'logotipo', 'emblema'], paletas: P_UNAS },
  barberia: { giro: 'barberia', fuentes: ['alfa', 'fraktur', 'zilla', 'bigshoulders', 'cinzel', 'anton'], disp: ['emblema', 'vertical', 'emblema', 'horizontal'], paletas: P_BARBERIA },
  carniceria: { giro: 'carniceria', fuentes: ['alfa', 'zilla', 'anton', 'bigshoulders', 'fraunces'], disp: ['emblema', 'horizontal', 'vertical'], paletas: P_CARNE },
  constructora: { giro: 'constructora', fuentes: ['archivo-angosta', 'bigshoulders', 'archivo-700', 'outfit-600', 'anton'], disp: ['horizontal', 'vertical', 'horizontal', 'logotipo'], paletas: P_OBRA },
  transporte: { giro: 'transporte', fuentes: ['bigshoulders', 'archivo-angosta', 'anton', 'archivo-700', 'bricolage'], disp: ['horizontal', 'vertical', 'horizontal', 'emblema'], paletas: P_TRANSPORTE },
  futbol: { giro: 'futbol', fuentes: ['bigshoulders', 'anton', 'alfa', 'fraktur', 'zilla'], disp: ['escudo', 'escudo', 'emblema', 'vertical'] },
  animado: { giro: 'cafeteria', fuentes: TODAS, disp: ['horizontal', 'vertical', 'horizontal', 'emblema'], animado: true },
};
const EJEMPLOS = {
  general: ['Tacos El Güero', 'Desde 1987'], minimalista: ['Norte Estudio', ''], '3d': ['Dulcería Pop', ''], letras: ['Mariana Leal', 'Abogada'],
  restaurante: ['La Cazuela', 'Cocina de Oaxaca'], ropa: ['Valentina', 'Boutique'], camisetas: ['Barrio Bravo', 'Hecho en GDL'], unas: ['Nails by Fer', 'Studio'],
  barberia: ['Don Chuy', 'Barbería'], carniceria: ['El Corral', 'Carnes finas'], constructora: ['Grupo Pilar', 'Construcción'], transporte: ['Fletes Rápidos', 'Del Norte'],
  futbol: ['Deportivo Juárez', 'F.C. 2026'], animado: ['Café Barrio', 'Coatepec'],
};

// ---------- azar con semilla ----------
function azar(semilla) {
  let a = 2166136261;
  for (const c of String(semilla)) a = Math.imul(a ^ c.charCodeAt(0), 16777619);
  return () => { a = Math.imul(a ^ (a >>> 15), 2246822507); a = Math.imul(a ^ (a >>> 13), 3266489909); a ^= a >>> 16; return (a >>> 0) / 4294967296; };
}

const iniciales = (s) => {
  const p = String(s || '').split(/\s+/).filter((w) => w && !/^(de|del|la|las|el|los|y|&)$/i.test(w));
  return (p.length > 1 ? p.slice(0, 2).map((w) => w[0]).join('') : (p[0] || 'A').slice(0, 1)).toUpperCase();
};

// ---------- escena del logo ----------
// Unidades: el símbolo mide 100. Devuelve elementos sin acomodar y su caja.
export function armarLogo(p, F, SIM, o = {}) {
  const prim = o.oscuro ? claroDe(p.prim) : p.prim;
  const sec = o.oscuro ? claroDe(p.sec, true) : p.sec;
  const fN = F[p.fuente] || F['archivo-700'];
  const fL = F['archivo-400'];
  const S = 100 * (p.escala || 1);
  const nombre = p.nombre || ' ';
  const sim = SIM[p.simbolo] || SIM.destello;
  const el = [];
  const simbolo = (x, y, lado, color = prim) => ({ tipo: 'forma', d: sim.d, x, y, w: lado, h: lado, color, regla: sim.par ? 'evenodd' : 'nonzero', rol: 's' });
  const txt = (texto, tam, f, color, extra) => Object.assign({ tipo: 'texto', texto, tam, fuente: f.id, color, espaciado: p.espaciado || 0, mayus: p.mayus, ajustar: false }, extra);
  const capDe = (f, tam) => (f.c / f.u) * tam;
  const lemaTam = 0.36;

  if (p.disp === 'horizontal' || p.disp === 'logotipo') {
    const conSim = p.disp === 'horizontal';
    const tam = conSim ? 50 : 70;
    const cap = capDe(fN, tam);
    const capL = p.lema ? capDe(fL, tam * lemaTam) : 0;
    const hb = cap + (p.lema ? tam * 0.34 + capL : 0);
    const x = conSim ? S + 26 : 0;
    const y0 = conSim ? S / 2 - hb / 2 : 0;
    if (conSim) el.push(simbolo(0, 0, S));
    el.push(txt(nombre, tam, fN, sec, { x, y: y0, rol: 'n' }));
    if (p.lema) el.push(Object.assign(txt(p.lema, tam * lemaTam, fL, prim, { x: x + 2, y: y0 + cap + tam * 0.34, rol: 'm', mayus: true }), { espaciado: 200 }));
  } else if (p.disp === 'vertical') {
    const tam = 44;
    el.push(simbolo(-S / 2, 0, S));
    const y = S + 30;
    el.push(txt(nombre, tam, fN, sec, { x: 0, y, alin: 'centro', rol: 'n' }));
    if (p.lema) el.push(Object.assign(txt(p.lema, tam * lemaTam, fL, prim, { x: 0, y: y + capDe(fN, tam) + tam * 0.36, alin: 'centro', rol: 'm', mayus: true }), { espaciado: 260 }));
  } else if (p.disp === 'isotipo') {
    el.push(simbolo(0, 0, 100));
  } else if (p.disp === 'monograma') {
    const ini = iniciales(nombre);
    const R = 70;
    const marco = p.marco || 'circulo';
    if (marco === 'circulo') el.push({ tipo: 'elipse', x: -R, y: -R, w: 2 * R, h: 2 * R, color: null, borde: prim, grosor: 3, rol: 's' });
    if (marco === 'cuadro') el.push({ tipo: 'rect', x: -R * 0.9, y: -R * 0.9, w: R * 1.8, h: R * 1.8, color: null, borde: prim, grosor: 3, rol: 's' });
    if (marco === 'rombo') el.push({ tipo: 'forma', d: `M0 ${-R * 1.1}L${R * 1.1} 0L0 ${R * 1.1}L${-R * 1.1} 0Z`, color: null, borde: prim, grosor: 3, junta: 'miter', rol: 's' });
    const tamI = ini.length > 1 ? 66 : 84;
    el.push(txt(ini, tamI, fN, prim, { x: 0, y: 0, vy: 'centro', alin: 'centro', rol: 's', espaciado: ini.length > 1 ? -20 : 0, mayus: false }));
    const y = R * 1.1 + 34;
    const fM = /pinyon|fraktur|caveat/.test(p.fuente) ? fL : fN;
    el.push(Object.assign(txt(nombre, 22, fM, sec, { x: 0, y, alin: 'centro', rol: 'n', mayus: true }), { espaciado: Math.max(220, p.espaciado || 0) }));
    if (p.lema) el.push(Object.assign(txt(p.lema, 11, fL, prim, { x: 0, y: y + capDe(fM, 22) + 12, alin: 'centro', rol: 'm', mayus: true }), { espaciado: 300 }));
  } else if (p.disp === 'emblema') {
    const R = 110;
    el.push({ tipo: 'elipse', x: -R, y: -R, w: 2 * R, h: 2 * R, color: prim, rol: 's' });
    el.push({ tipo: 'elipse', x: -R + 9, y: -R + 9, w: 2 * R - 18, h: 2 * R - 18, color: null, borde: o.oscuro ? '#111111' : '#FFFFFF', grosor: 2.2, rol: 's' });
    const blanco = o.oscuro ? '#111111' : '#FFFFFF';
    el.push(simbolo(-34, -40, 68, blanco));
    el.push(...textoArco(fN, String(nombre).toLocaleUpperCase('es-MX'), 22, Math.max(80, p.espaciado || 0), 0, 0, R - 40, false, blanco, 'n'));
    if (p.lema) el.push(...textoArco(fL, String(p.lema).toLocaleUpperCase('es-MX'), 13, 200, 0, 0, R - 34, true, blanco, 'm'));
    else el.push({ tipo: 'forma', d: SIM.destello.d, x: -9, y: 52, w: 18, h: 18, color: blanco, rol: 'm' });
  } else if (p.disp === 'escudo') {
    const w = 190, hgt = 220;
    const esc = (k) => transformarD(SIM.escudo.d, [w * k / 80, 0, 0, hgt * k / 92, -w * k / 2 - (w * k / 80) * 10, -(hgt * k / 92) * 4 + hgt * (1 - k) * 0.4]);
    el.push({ tipo: 'forma', d: esc(1), color: prim, rol: 's' });
    el.push({ tipo: 'forma', d: esc(0.9), color: o.oscuro ? '#1A1A1A' : '#FFFFFF', rol: 's' });
    const bandaY = hgt * 0.42;
    el.push({ tipo: 'rect', x: -w / 2 + 6, y: bandaY, w: w - 12, h: 44, color: prim, rol: 's' });
    el.push(simbolo(-36, 16, 72, sec));
    el.push(txt(String(nombre).toLocaleUpperCase('es-MX'), 28, fN, o.oscuro ? '#111111' : '#FFFFFF', { x: -w / 2 + 14, w: w - 28, y: bandaY + 22, vy: 'centro', alin: 'centro', rol: 'n', ajustar: true, maxLineas: 1, minTam: 10, mayus: false }));
    if (p.lema) el.push(txt(p.lema, 16, fN, sec, { x: 0, y: bandaY + 62, alin: 'centro', rol: 'm' }));
    else el.push({ tipo: 'forma', d: SIM.estrella.d, x: -12, y: bandaY + 58, w: 24, h: 24, color: prim, rol: 'm' });
  }
  if (p.relieve) {
    const sombras = [];
    const prof = 6;
    const tono = (c) => (esOscuro(c) ? mezclar(prim, '#FFFFFF', esOscuro(prim) ? 0.55 : 0.1) : mezclar(c, o.oscuro ? '#FFFFFF' : '#000000', 0.42));
    for (let i = prof; i >= 1; i--) for (const e of el) sombras.push(desplazar(e, i * 0.8, i * 0.8, tono(e.color || e.borde || prim)));
    el.unshift(...sombras);
  }
  return el;
}

function claroDe(c, texto) {
  if (!esOscuro(c)) return c;
  return texto ? '#F5F3EE' : mezclar(c, '#FFFFFF', 0.55);
}

function desplazar(e, dx, dy, color) {
  const c = Object.assign({}, e, { rol: e.rol });
  delete c._c;
  if (c.color) c.color = color;
  if (c.borde) c.borde = color;
  if (c.tipo === 'forma' && !c.w) c.d = transformarD(c.d, [1, 0, 0, 1, dx, dy]);
  else { c.x += dx; c.y += dy; }
  return c;
}

// Texto sobre un arco (arriba en sentido del reloj, abajo legible de izquierda a derecha).
function textoArco(f, texto, tam, espaciado, cx, cy, r, abajo, color, rol) {
  const s = tam / f.u, track = (espaciado / 1000) * f.u;
  const gl = [];
  let x = 0;
  for (const c of texto) {
    const g = f.g[c] || f.g[c.normalize('NFD')[0]];
    if (!g) continue;
    gl.push({ g, x, adv: g[0] });
    x += g[0] + track;
  }
  const L = (x - track) * s;
  const cap = (f.c / f.u) * tam;
  const out = [];
  for (const { g, x: gx, adv } of gl) {
    if (!g[1]) continue;
    const centro = (gx + adv / 2) * s - L / 2;
    const rr = abajo ? r + cap : r;
    const fi = abajo ? Math.PI / 2 - centro / rr : -Math.PI / 2 + centro / rr;
    const th = abajo ? fi - Math.PI / 2 : fi + Math.PI / 2;
    const px = cx + rr * Math.cos(fi), py = cy + rr * Math.sin(fi);
    const co = Math.cos(th), si = Math.sin(th);
    const ox = (-adv / 2) * s;
    const m = [s * co, s * si, -s * si, s * co, px + ox * co, py + ox * si];
    out.push({ tipo: 'forma', d: transformarD(g[1], m), color, rol });
  }
  return out;
}

// Caja de todos los elementos.
function cajaDe(el, F) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const e of el) {
    const b = limites(e, F);
    if (!b) continue;
    const g = e.borde ? (e.grosor || 0) / 2 : 0;
    x0 = Math.min(x0, b.x - g); y0 = Math.min(y0, b.y - g); x1 = Math.max(x1, b.x + b.w + g); y1 = Math.max(y1, b.y + b.h + g);
  }
  if (!isFinite(x0)) return { x: 0, y: 0, w: 100, h: 100 };
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// Escena lista para pintar: elementos + marco con aire + pie opcional.
function escena(p, F, SIM, o = {}) {
  const el = armarLogo(p, F, SIM, o);
  const c = cajaDe(el, F);
  const aire = Math.max(c.w, c.h) * (o.aire ?? 0.08);
  let { x, y, w, h: alto } = { x: c.x - aire, y: c.y - aire, w: c.w + 2 * aire, h: c.h + 2 * aire };
  if (o.pie) {
    const tam = Math.max(c.w, c.h) * 0.03;
    const t = { tipo: 'texto', texto: 'Hecho con Avelina · avelina.com.mx', tam, fuente: 'archivo-400', color: '#8C8C8C', x: c.x + c.w / 2, y: y + alto + tam * 0.2, alin: 'centro', ajustar: false };
    el.push(t);
    alto += tam * 2.2;
  }
  if (o.cuadrado) { const l = Math.max(w, alto) * 1.25; x -= (l - w) / 2; y -= (l - alto) / 2; w = l; alto = l; }
  return { el, x, y, w, h: alto };
}

export function svgLogo(p, F, SIM, o = {}) {
  const e = escena(p, F, SIM, o);
  const b = destinoSVG();
  pintarCara(b, { ancho: e.w, alto: e.h, fondo: null, el: e.el }, { fuentes: F });
  const r = (v) => Math.round(v * 100) / 100;
  const ancho = o.px || 1000, alto = Math.round((ancho * e.h) / e.w);
  const fondo = o.fondo ? `<rect x="${r(e.x)}" y="${r(e.y)}" width="${r(e.w)}" height="${r(e.h)}" fill="${o.fondo}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(e.x)} ${r(e.y)} ${r(e.w)} ${r(e.h)}" width="${ancho}" height="${alto}">` +
    (o.titulo ? `<title>${String(o.titulo).replace(/[<&>]/g, '')}</title>` : '') + fondo + b.partes.join('') + '</svg>';
}

function lienzoLogo(p, F, SIM, o) {
  const e = escena(p, F, SIM, o);
  const lado = o.lado || 1024;
  const k = lado / Math.max(e.w, e.h);
  const c = document.createElement('canvas');
  c.width = Math.round(e.w * k); c.height = Math.round(e.h * k);
  const ctx = c.getContext('2d');
  if (o.fondo) { ctx.fillStyle = o.fondo; ctx.fillRect(0, 0, c.width, c.height); }
  ctx.setTransform(k, 0, 0, k, -e.x * k, -e.y * k);
  pintarCara(destinoCanvas(ctx), { ancho: e.w, alto: e.h, fondo: null, el: e.el }, { fuentes: F });
  return c;
}
const aBlob = (c) => new Promise((ok) => c.toBlob(ok, 'image/png'));

// ---------- animación ----------
// Separa el nombre en letras sueltas para animarlas.
function porLetras(el, F) {
  const out = [];
  for (const e of el) {
    if (e.tipo === 'texto' && e.rol === 'n') {
      const f = F[e.fuente];
      const c = componer(f, e);
      for (const r of c.corridas) out.push({ tipo: 'forma', d: transformarD(r.d, r.m), color: e.color, rol: 'n' });
    } else out.push(e);
  }
  return out;
}
const sal = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const suave = (t) => 1 - Math.pow(1 - t, 3);
const lim = (v) => Math.max(0, Math.min(1, v));
export const DURACION = 4.2;
function estadoEn(t, i, rol, cajaS) {
  if (rol === 's') { const q = lim(t / 0.9); return { a: lim(q * 3), s: sal(q), r: -(1 - suave(q)) * 60, cx: cajaS.x + cajaS.w / 2, cy: cajaS.y + cajaS.h / 2 }; }
  if (rol === 'n') { const q = lim((t - 0.55 - i * 0.055) / 0.5); return { a: q, dy: (1 - suave(q)) * 14 }; }
  const q = lim((t - 1.5) / 0.6); return { a: q, dy: 0 };
}

function svgAnimado(p, F, SIM, o) {
  const e = escena(p, F, SIM, o);
  const el = porLetras(e.el, F);
  const r = (v) => Math.round(v * 100) / 100;
  const grupos = { s: [], n: [], m: [] };
  for (const x of el) {
    const b = destinoSVG();
    pintarCara(b, { ancho: 1, alto: 1, fondo: null, el: [x] }, { fuentes: F });
    (grupos[x.rol] || grupos.m).push(b.partes.join(''));
  }
  const css = '.s{transform-box:fill-box;transform-origin:center;animation:s .9s cubic-bezier(.3,1.5,.5,1) both}' +
    '.n{animation:n .5s cubic-bezier(.2,.8,.3,1) both}.m{animation:m .6s ease-out 1.5s both}' +
    '@keyframes s{from{transform:scale(0) rotate(-60deg)}to{transform:none}}' +
    '@keyframes n{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes m{from{opacity:0}to{opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.s,.n,.m{animation:none}}';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(e.x)} ${r(e.y)} ${r(e.w)} ${r(e.h)}" width="1000" height="${Math.round((1000 * e.h) / e.w)}"><style>${css}</style>` +
    (o.fondo ? `<rect x="${r(e.x)}" y="${r(e.y)}" width="${r(e.w)}" height="${r(e.h)}" fill="${o.fondo}"/>` : '') +
    `<g class="s">${grupos.s.join('')}</g>` + grupos.n.map((g, i) => `<g class="n" style="animation-delay:${(0.55 + i * 0.055).toFixed(3)}s">${g}</g>`).join('') +
    `<g class="m">${grupos.m.join('')}</g></svg>`;
}

// Pinta un cuadro de la animación en un lienzo.
function cuadro(ctx, anim, t) {
  const { e, el, k, F, fondo, cajaS } = anim;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = fondo; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  let i = 0;
  const b = destinoCanvas(ctx);
  for (const x of el) {
    const st = estadoEn(t, x.rol === 'n' ? i++ : 0, x.rol || 'm', cajaS);
    if (st.a <= 0) continue;
    ctx.save();
    ctx.setTransform(k, 0, 0, k, -e.x * k + anim.ox, -e.y * k + anim.oy);
    ctx.globalAlpha = st.a;
    if (x.rol === 's') { ctx.translate(st.cx, st.cy); ctx.rotate((st.r * Math.PI) / 180); ctx.scale(st.s, st.s); ctx.translate(-st.cx, -st.cy); }
    else ctx.translate(0, st.dy || 0);
    pintarCara(b, { ancho: 1, alto: 1, fondo: null, el: [x] }, { fuentes: F });
    ctx.restore();
  }
}
function prepararAnim(p, F, SIM, o, lado) {
  const e = escena(p, F, SIM, Object.assign({ aire: 0.14 }, o, { cuadrado: false }));
  const el = porLetras(e.el, F);
  const W = lado, H = Math.round(lado * 0.75);
  const k = Math.min(W / e.w, H / e.h) * 0.92;
  const cajaS = cajaDe(el.filter((x) => x.rol === 's'), F);
  return { e, el, k, F, fondo: o.fondo || '#FFFFFF', cajaS, W, H, ox: (W - e.w * k) / 2, oy: (H - e.h * k) / 2 };
}

// ---------- montar ----------
export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  asegurarCSS(ID);
  const t = unirTextos(TEXTOS, opciones);
  const modo = ESTILOS[opciones.modo] ? opciones.modo : 'general';
  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ahl', lang: opciones.idioma || 'es-MX', 'data-modo': modo });
  const aviso = h('p', { class: 'ah-nota', text: t.cargando });
  raiz.append(aviso);
  contenedor.append(raiz);
  let vivo = true;
  import(new URL('./logo/simbolos.js', import.meta.url).href).then((m) => {
    if (!vivo) return;
    raiz.textContent = '';
    armar(contenedor, raiz, m, modo, t);
  }).catch((e) => { aviso.textContent = t.fallo; console.error(e); });
  return { destruir() { vivo = false; contenedor.textContent = ''; } };
}

function armar(contenedor, raiz, mod, modo, t) {
  const { SIMBOLOS: SIM, GIROS, ABSTRACTOS } = mod;
  const E = ESTILOS[modo];
  const [ejN, ejL] = EJEMPLOS[modo];
  const st = { nombre: ejN, lema: ejL, giro: E.giro, ronda: 0, props: [], sel: null, pie: true };
  let F = {};

  // ---------- datos ----------
  const iNombre = h('input', { type: 'text', class: 'ah-input', value: st.nombre, maxlength: 40, autocomplete: 'organization', placeholder: t.nombreEjemplo });
  const iLema = h('input', { type: 'text', class: 'ah-input', value: st.lema, maxlength: 40, autocomplete: 'off', placeholder: t.lemaEjemplo });
  const sGiro = h('select', { class: 'ah-input' }, GIROS.map(([id, n]) => h('option', { value: id, text: n })));
  sGiro.value = st.giro;
  const datos = h('div', { class: 'ahl-datos' }, campo(t.nombre, iNombre), campo(t.giro, sGiro), campo(t.lema, iLema));

  // ---------- propuestas ----------
  const rejilla = h('div', { class: 'ahl-propuestas', role: 'radiogroup', 'aria-label': t.propuestas });
  const bOtras = boton(t.otras, () => { st.ronda++; generar(true); }, 'ah-boton ah-boton-2');
  const bloqueProp = h('section', { class: 'ahl-bloque' },
    h('div', { class: 'ahl-cabeza' }, h('h3', { class: 'ahd-sub', text: t.propuestas }), bOtras),
    h('p', { class: 'ah-ayuda', text: t.elige }), rejilla);

  // ---------- ajustes ----------
  const cajaDisp = h('div');
  const cajaSim = h('div', { class: 'ahl-simbolos', role: 'radiogroup', 'aria-label': t.simbolo });
  const sFuente = h('select', { class: 'ah-input' }, FUENTES.map(([id, n, fam]) => h('option', { value: id, text: `${n} · ${fam}` })));
  const chkMayus = h('input', { type: 'checkbox' });
  const rEsp = h('input', { type: 'range', class: 'ah-rango', min: -40, max: 400, step: 10 });
  const rTam = h('input', { type: 'range', class: 'ah-rango', min: 0.5, max: 1.6, step: 0.05 });
  const cajaMarco = h('div');
  const chkRelieve = h('input', { type: 'checkbox' });
  const colPrim = selectorColor(t.cPrim, '#C2410C', (v) => cambiar({ prim: v }));
  const colSec = selectorColor(t.cSec, '#1E1B16', (v) => cambiar({ sec: v }));
  const colFondo = selectorColor(t.cFondo, '#FFFFFF', (v) => cambiar({ fondo: v }));
  sFuente.addEventListener('change', () => cambiar({ fuente: sFuente.value }));
  chkMayus.addEventListener('change', () => cambiar({ mayus: chkMayus.checked }));
  rEsp.addEventListener('input', () => cambiar({ espaciado: +rEsp.value }));
  rTam.addEventListener('input', () => cambiar({ escala: +rTam.value }));
  chkRelieve.addEventListener('change', () => cambiar({ relieve: chkRelieve.checked }));
  const filaTam = campo(t.tamSimbolo, rTam);
  const ajustes = h('section', { class: 'ahl-bloque ahl-ajustes' },
    h('h3', { class: 'ahd-sub', text: t.ajustes }),
    cajaDisp,
    h('div', { class: 'ah-campo' }, h('p', { class: 'ah-etiqueta', text: t.simbolo }), cajaSim),
    campo(t.tipografia, sFuente),
    h('label', { class: 'ah-check' }, chkMayus, h('span', { text: t.mayus })),
    campo(t.espaciado, rEsp), filaTam, cajaMarco,
    h('label', { class: 'ah-check' }, chkRelieve, h('span', { text: t.relieve })),
    h('div', { class: 'ahd-colores' }, colPrim, colSec, colFondo));

  // ---------- vista y descargas ----------
  const vClaro = h('div', { class: 'ahl-muestra', role: 'img' });
  const vOscuro = h('div', { class: 'ahl-muestra ahl-oscura', role: 'img' });
  const est = estado();
  const chkPie = h('input', { type: 'checkbox', checked: true });
  chkPie.addEventListener('change', () => { st.pie = chkPie.checked; });
  const acciones = h('div', { class: 'ah-acciones' },
    boton(t.svg, () => bajar('svg')), boton(t.png(1024), () => bajar('png1024'), 'ah-boton ah-boton-2'),
    boton(t.paquete, () => bajar('zip'), 'ah-boton ah-boton-2'));
  const mas = h('div', { class: 'ahl-mas' },
    ...[['png512', t.png(512)], ['png2048', t.png(2048)], ['svgOscuro', t.svgOscuro], ['pngOscuro', t.pngOscuro], ['perfil', t.perfil]]
      .map(([k, txt]) => boton(txt, () => bajar(k), 'ah-liga')));
  const anim = h('div', { class: 'ah-acciones', hidden: !E.animado });
  const vMime = typeof MediaRecorder !== 'undefined' ? (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ? 'video/mp4;codecs=avc1' : (MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : ''))) : '';
  if (E.animado) {
    anim.append(boton(t.gif, () => bajar('gif')), boton(t.svgAnimado, () => bajar('svgAnim'), 'ah-boton ah-boton-2'));
    if (vMime) anim.append(boton(t.video(vMime.includes('mp4') ? 'MP4' : 'WebM'), () => bajar('video'), 'ah-boton ah-boton-2'));
    anim.append(boton(t.repetir, () => pintarVista(true), 'ah-liga'));
  }
  const vista = h('section', { class: 'ahl-bloque ahl-vista' },
    h('div', { class: 'ahl-muestras' }, h('figure', {}, vClaro, h('figcaption', { text: t.claro })), h('figure', {}, vOscuro, h('figcaption', { text: t.oscuro }))),
    anim, acciones, mas,
    h('p', { class: 'ah-nota', text: E.animado ? t.ayudaAnim : t.ayudaDesc }),
    h('label', { class: 'ah-check' }, chkPie, h('span', { text: t.pie })), est);

  const abajo = h('div', { class: 'ahl-editor' }, ajustes, vista);
  raiz.append(datos, bloqueProp, abajo);

  // ---------- propuestas ----------
  function simbolosDe(giro) {
    const g = GIROS.find((x) => x[0] === giro);
    return [...new Set([...(g ? g[2] : []), ...ABSTRACTOS])].filter((s) => SIM[s]);
  }
  function generar(nuevaRonda) {
    const rnd = azar(`${st.giro}|${modo}|${st.ronda}`);
    const sims = simbolosDe(st.giro);
    const propios = (GIROS.find((x) => x[0] === st.giro) || [, , []])[2];
    const pal = E.paletas || PALETAS;
    const props = [];
    const fuentes = [...E.fuentes].sort(() => rnd() - 0.5);
    for (let i = 0; i < 12; i++) {
      const disp = E.disp[i % E.disp.length];
      const elegantes = ['destello', 'circulo-partido', 'anillo-punto', 'hojas', 'rombo', 'luna', 'estrella'];
      const simb = propios.length && i < propios.length * 2 ? propios[i % propios.length] : (st.giro === 'otro' ? sims : elegantes)[Math.floor(rnd() * (st.giro === 'otro' ? sims.length : elegantes.length))];
      const fuente = fuentes[i % fuentes.length];
      const [prim, sec] = pal[Math.floor(rnd() * pal.length)];
      const mayus = /pinyon|fraktur|caveat/.test(fuente) ? false : /anton|bigshoulders|archivo-angosta|cinzel|alfa/.test(fuente) ? true : (fuente === 'italiana' || fuente === 'outfit-300' ? rnd() < 0.7 : rnd() < 0.25);
      props.push({
        nombre: st.nombre, lema: st.lema, disp, simbolo: simb, fuente, prim, sec, fondo: '#FFFFFF', mayus,
        espaciado: E.espaciado ? E.espaciado : (mayus ? 60 : 0) + (/italiana|outfit-300/.test(fuente) ? 120 : 0),
        escala: E.escala || 1, relieve: !!E.relieve, marco: ['circulo', 'cuadro', 'rombo', 'nada'][i % 4],
      });
    }
    st.props = props;
    if (nuevaRonda || !st.sel) st.sel = Object.assign({}, props[0]);
    pintarPropuestas();
  }
  async function pintarPropuestas() {
    F = Object.assign(F, await cargarFuentes(['archivo-400', 'archivo-700', ...st.props.map((p) => p.fuente), st.sel.fuente]));
    rejilla.textContent = '';
    st.props.forEach((p, i) => {
      const b = h('button', { type: 'button', class: 'ahl-prop', role: 'radio', 'aria-checked': 'false', 'aria-label': `${t.propuestas} ${i + 1}: ${t.disp[p.disp]}` });
      b.innerHTML = svgLogo(p, F, SIM, { aire: 0.1 });
      b.addEventListener('click', () => { st.sel = Object.assign({}, p); marcar(); sincronizar(); pintarVista(); });
      rejilla.append(b);
    });
    marcar();
    sincronizar();
    pintarVista();
  }
  function marcar() {
    [...rejilla.children].forEach((b, i) => {
      const p = st.props[i];
      const si = ['disp', 'simbolo', 'fuente', 'prim'].every((k) => p[k] === st.sel[k]);
      b.setAttribute('aria-checked', String(si));
    });
  }

  // ---------- editor ----------
  function sincronizar() {
    const s = st.sel;
    cajaDisp.textContent = '';
    const disps = ['horizontal', 'vertical', 'logotipo', 'isotipo', 'emblema', 'monograma'].concat(modo === 'futbol' ? ['escudo'] : []);
    cajaDisp.append(opcionesChip('ahl-disp', t.disposicion, disps.map((d) => [d, t.disp[d]]), s.disp, (v) => cambiar({ disp: v })));
    cajaSim.textContent = '';
    for (const id of simbolosDe(st.giro).concat(Object.keys(SIM)).filter((v, i, a) => a.indexOf(v) === i && v !== 'escudo')) {
      const sim = SIM[id];
      const b = h('button', { type: 'button', class: 'ahl-sim', role: 'radio', 'aria-checked': String(id === s.simbolo), 'aria-label': sim.n, title: sim.n });
      b.innerHTML = `<svg viewBox="-6 -6 112 112" aria-hidden="true"><path d="${sim.d}" fill="currentColor"${sim.par ? ' fill-rule="evenodd"' : ''}/></svg>`;
      b.addEventListener('click', () => { cajaSim.querySelectorAll('.ahl-sim').forEach((x) => x.setAttribute('aria-checked', 'false')); b.setAttribute('aria-checked', 'true'); cambiar({ simbolo: id }); });
      cajaSim.append(b);
    }
    sFuente.value = s.fuente;
    chkMayus.checked = !!s.mayus;
    rEsp.value = s.espaciado || 0;
    rTam.value = s.escala || 1;
    chkRelieve.checked = !!s.relieve;
    colPrim.fijar(s.prim); colSec.fijar(s.sec); colFondo.fijar(s.fondo || '#FFFFFF');
    cajaMarco.textContent = '';
    if (s.disp === 'monograma') cajaMarco.append(opcionesChip('ahl-marco', t.marco, Object.entries(t.marcos), s.marco || 'circulo', (v) => cambiar({ marco: v })));
    filaTam.hidden = !(s.disp === 'horizontal' || s.disp === 'vertical');
  }
  async function cambiar(c) {
    Object.assign(st.sel, c);
    if (c.fuente) F = Object.assign(F, await cargarFuentes([c.fuente]));
    if (c.disp) sincronizar();
    marcar();
    pintarVista();
  }
  function pintarVista(replay) {
    const s = Object.assign({}, st.sel, { nombre: st.nombre, lema: st.lema });
    if (!F[s.fuente]) return;
    const titulo = t.vista(st.nombre);
    vClaro.style.background = s.fondo || '#FFFFFF';
    vClaro.innerHTML = E.animado ? svgAnimado(s, F, SIM, {}) : svgLogo(s, F, SIM, { titulo });
    vOscuro.innerHTML = E.animado && replay ? svgAnimado(s, F, SIM, { oscuro: true }) : svgLogo(s, F, SIM, { oscuro: true, titulo });
    vClaro.setAttribute('aria-label', titulo); vOscuro.setAttribute('aria-label', titulo);
  }

  // ---------- descargas ----------
  async function bajar(tipo) {
    const s = Object.assign({}, st.sel, { nombre: st.nombre, lema: st.lema });
    const base = 'logo-' + nombreArchivo(st.nombre);
    const o = { pie: st.pie, titulo: st.nombre };
    const oO = Object.assign({}, o, { oscuro: true });
    const svgB = (txt) => new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + txt], { type: 'image/svg+xml' });
    est.decir(t.preparando, 0);
    try {
      if (tipo === 'svg') descargar(svgB(svgLogo(s, F, SIM, o)), base + '.svg');
      else if (tipo === 'svgOscuro') descargar(svgB(svgLogo(s, F, SIM, oO)), base + '-fondo-oscuro.svg');
      else if (/^png\d+$/.test(tipo)) { const n = +tipo.slice(3); descargar(await aBlob(lienzoLogo(s, F, SIM, Object.assign({ lado: n }, o))), `${base}-${n}.png`); }
      else if (tipo === 'pngOscuro') descargar(await aBlob(lienzoLogo(s, F, SIM, Object.assign({ lado: 1024 }, oO))), base + '-fondo-oscuro.png');
      else if (tipo === 'perfil') descargar(await aBlob(lienzoLogo(s, F, SIM, Object.assign({ lado: 1080, cuadrado: true, fondo: s.fondo || '#FFFFFF' }, o))), base + '-perfil.png');
      else if (tipo === 'zip') {
        const a = [
          { nombre: base + '.svg', blob: svgB(svgLogo(s, F, SIM, o)) },
          { nombre: base + '-fondo-oscuro.svg', blob: svgB(svgLogo(s, F, SIM, oO)) },
        ];
        for (const n of [512, 1024, 2048]) a.push({ nombre: `${base}-${n}.png`, blob: await aBlob(lienzoLogo(s, F, SIM, Object.assign({ lado: n }, o))) });
        a.push({ nombre: base + '-fondo-oscuro-1024.png', blob: await aBlob(lienzoLogo(s, F, SIM, Object.assign({ lado: 1024 }, oO))) });
        a.push({ nombre: base + '-perfil-1080.png', blob: await aBlob(lienzoLogo(s, F, SIM, Object.assign({ lado: 1080, cuadrado: true, fondo: s.fondo || '#FFFFFF' }, o))) });
        descargar(await zip(a), base + '.zip');
      } else if (tipo === 'svgAnim') descargar(svgB(svgAnimado(s, F, SIM, Object.assign({ fondo: s.fondo }, o))), base + '-animado.svg');
      else if (tipo === 'gif' || tipo === 'video') {
        const an = prepararAnim(s, F, SIM, Object.assign({ fondo: s.fondo || '#FFFFFF' }, o), 640);
        const c = document.createElement('canvas'); c.width = an.W; c.height = an.H;
        const ctx = c.getContext('2d', { willReadFrequently: tipo === 'gif' });
        if (tipo === 'gif') {
          const { gifAnimado } = await import(new URL('./logo/_gif.js', import.meta.url).href);
          const fps = 15, n = Math.round(DURACION * fps);
          const cuadros = [];
          for (let i = 0; i < n; i++) {
            cuadro(ctx, an, i / fps);
            cuadros.push(ctx.getImageData(0, 0, an.W, an.H).data.slice());
            if (i % 8 === 0) { est.decir(t.animando(Math.round((i / n) * 60)), 0); await new Promise((ok) => setTimeout(ok, 0)); }
          }
          const colores = [s.fondo || '#FFFFFF', s.prim, s.sec, '#FFFFFF', '#111111', '#8C8C8C'];
          const blob = await gifAnimado(cuadros, an.W, an.H, Math.round(100 / fps), colores, (q) => est.decir(t.animando(60 + Math.round(q * 40)), 0));
          descargar(blob, base + '-animado.gif');
        } else {
          const flujo = c.captureStream(30);
          const rec = new MediaRecorder(flujo, { mimeType: vMime, videoBitsPerSecond: 4e6 });
          const partes = [];
          rec.ondataavailable = (ev) => ev.data.size && partes.push(ev.data);
          const fin = new Promise((ok) => { rec.onstop = ok; });
          cuadro(ctx, an, 0);
          rec.start();
          const t0 = performance.now();
          await new Promise((ok) => {
            const paso = () => { const tt = (performance.now() - t0) / 1000; cuadro(ctx, an, Math.min(tt, DURACION)); if (tt < DURACION + 0.3) requestAnimationFrame(paso); else ok(); };
            requestAnimationFrame(paso);
          });
          rec.stop();
          await fin;
          descargar(new Blob(partes, { type: vMime.split(';')[0] }), base + '-animado.' + (vMime.includes('mp4') ? 'mp4' : 'webm'));
        }
      }
      est.decir(t.listo);
      avisar(contenedor, ID, 'descargar');
    } catch (e) { console.error(e); est.decir(t.error, 6000); }
  }

  // ---------- entradas ----------
  let tm;
  const alEscribir = () => { clearTimeout(tm); tm = setTimeout(() => { st.nombre = iNombre.value.trim() || ' '; st.lema = iLema.value.trim(); generar(false); }, 220); };
  iNombre.addEventListener('input', alEscribir);
  iLema.addEventListener('input', alEscribir);
  sGiro.addEventListener('change', () => { st.giro = sGiro.value; st.ronda = 0; generar(true); });
  generar(true);
  raiz.ahl = { st, bajar, svg: () => vClaro.innerHTML };
}

