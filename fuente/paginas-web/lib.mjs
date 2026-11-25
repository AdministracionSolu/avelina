// Piezas comunes del generador de las páginas para artistas de avelina.com.mx (generar.mjs y probar.mjs).
// Herramientas, guías, plantillas y servicio pensados para músicos y artistas. Misma base que las de Pilsi.
// Sin dependencias: sólo Node. Ver fuente/paginas-web/CONTRATO.md.
//
// Las páginas se escriben en <carpeta>/<slug>/index.html en la raíz del sitio. La cabecera y el pie se
// toman tal cual de una fija ya generada (afinador-de-guitarra), así siempre van iguales al resto del sitio.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PUB = RAIZ;
export const DIR_PAGINAS = path.join(RAIZ, 'fuente', 'paginas-web', 'paginas');
export const SITIO = 'https://avelina.com.mx';
export const PILSI = 'https://pilsi.art';
export const WHATSAPP = '526341130286'; // el de Ave (el mismo de Pilsi)
export const CORREO = 'info@pilsi.art';
// Precios de Ave (src/routes/paquetes.tsx). Si cambian allá, cambian aquí.
export const PRECIO = { sitio: 1500, mensual: 99, completo: 5000 };

export const MOLDES = ['herramienta', 'guia', 'servicio', 'por-giro', 'por-ciudad', 'plantilla', 'comparativa'];
export const CARPETA = { herramienta: 'herramientas', guia: 'guias', servicio: '', plantilla: 'plantillas',
  comparativa: 'comparar', 'por-giro': 'paginas-web', 'por-ciudad': 'diseno-web' };
export const COLECCIONES = {
  herramientas: { molde: 'herramienta', nombre: 'Herramientas para músicos', h1: 'Herramientas gratis para músicos y artistas',
    title: 'Herramientas gratis para músicos y artistas | Avelina',
    description: 'QR para tu música, link de WhatsApp, flyers de tocada, logos y paletas para tu portada. Gratis, sin registro y sin marca de agua, desde tu celular.',
    intro: 'Funcionan en tu navegador, sin cuenta y sin marca de agua. Las junté para quien toca, canta, pinta o crea.' },
  guias: { molde: 'guia', nombre: 'Guías para artistas', h1: 'Guías para artistas que quieren su sitio',
    title: 'Guías para artistas y músicos en internet | Avelina',
    description: 'Guías cortas para músicos y artistas. Cómo tener tu sitio, qué es un dominio, cómo salir en Google y cómo mover tu música en redes y WhatsApp.',
    intro: 'Pasos y ejemplos para que tu música o tu obra se encuentre en internet.' },
  plantillas: { molde: 'plantilla', nombre: 'Plantillas para artistas', h1: 'Plantillas y formatos gratis para artistas',
    title: 'Plantillas y formatos gratis para artistas | Avelina',
    description: 'Ejemplos de sitios de artistas, formato de cotización para tus tocadas y plantillas para redes. Llénalos en línea y bájalos sin dejar tu correo.',
    intro: 'Formatos listos para llenar y bajar, sin dejar tu correo.' },
};
// Carpetas y archivos que ya existen en public/ o rutas del sitio: ningún servicio puede usar estos nombres.
// Lo que ya existe en la raíz, menos las carpetas que escribe este mismo generador (servicios).
const PROPIAS = (() => { try { return JSON.parse(fs.readFileSync(path.join(RAIZ, 'fuente', 'paginas-web', 'lista.json'), 'utf8')).filter((l) => l.molde === 'servicio').map((l) => l.slug); } catch { return []; } })();
export const RESERVADAS = fs.readdirSync(RAIZ).filter((f) => !f.startsWith('.') && !PROPIAS.includes(f)).concat(['herramientas', 'guias', 'plantillas', 'comparar', 'paginas-web', 'diseno-web']);

// Páginas que ya existen en Pilsi (rutas de TanStack) y que las fijas pueden ligar por id.
// Siempre cuentan como publicadas.
export const EXTERNAS = {};

export const TRABAJOS = {
  avelina: { nombre: 'Avelina', url: 'avelina.com.mx', texto: 'Mi sitio, con mi música, mis covers y mis cartas' },
  pilsi: { nombre: 'Pilsi', url: 'pilsi.art', texto: 'Directorio de talento creativo con perfiles y talleres' },
};
export const TRABAJOS_DEFECTO = ['avelina', 'pilsi'];

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const mesAnio = (am) => { const [a, m] = am.split('-'); return `${MESES[+m - 1]} de ${a}`; };

export function cargarPaginas() {
  if (!fs.existsSync(DIR_PAGINAS)) return [];
  return fs.readdirSync(DIR_PAGINAS).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const p = JSON.parse(fs.readFileSync(path.join(DIR_PAGINAS, f), 'utf8'));
    p._archivo = f;
    return p;
  });
}

export const ruta = (p) => '/' + (CARPETA[p.molde] ? CARPETA[p.molde] + '/' : '') + p.slug + '/';
export const publicada = (p, hoy) => !!p.publicacion && p.publicacion <= hoy;
export const hoyCDMX = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
export const motorExiste = (id) => !!id && fs.existsSync(path.join(PUB, 'js', 'herramientas', id + '.js'));

// Todo lo que un motor carga (relativo a public/), siguiendo sus import, import() y new URL('…', import.meta.url).
export function dependenciasMotor(id) {
  const archivos = new Set(['css/herramientas.css']), carpetas = new Set(), faltan = new Set();
  const pendientes = [`js/herramientas/${id}.js`];
  const RE = [/\bfrom\s*['"](\.{1,2}\/[^'"]+)['"]/g, /\bimport\s*\(\s*['"`](\.{1,2}\/[^'"`]+)['"`]\s*\)/g,
    /new URL\(\s*(['"`])([^'"`]+)\1\s*,\s*import\.meta\.url/g];
  while (pendientes.length) {
    const rel = pendientes.pop();
    if (archivos.has(rel)) continue;
    archivos.add(rel);
    const abs = path.join(PUB, rel);
    if (!fs.existsSync(abs)) { faltan.add(rel); continue; }
    if (!rel.endsWith('.js')) continue;
    const src = fs.readFileSync(abs, 'utf8');
    for (const re of RE) for (const m of src.matchAll(re)) {
      const ref = m[2] ?? m[1];
      if (ref.includes('${')) {
        const dir = path.posix.normalize(path.posix.join(path.posix.dirname(rel), ref.slice(0, ref.indexOf('${')).replace(/[^/]*$/, '')));
        carpetas.add(dir.replace(/\/?$/, '/'));
        if (!fs.existsSync(path.join(PUB, dir))) faltan.add(dir + '/');
        continue;
      }
      const dest = path.posix.normalize(path.posix.join(path.posix.dirname(rel), ref.split(/[?#]/)[0]));
      if (!archivos.has(dest)) pendientes.push(dest);
    }
  }
  for (const f of archivos) if (!fs.existsSync(path.join(PUB, f))) faltan.add(f);
  return { archivos: [...archivos].sort(), carpetas: [...carpetas].sort(), faltan: [...faltan].sort() };
}

// Lo que se publica: lo que git rastrea dentro de public/ (sin el prefijo public/).
let _publicables = null;
export function archivosPublicables() {
  if (_publicables) return _publicables;
  let lista = [];
  try { lista = execFileSync('git', ['-C', RAIZ, 'ls-files', '-z'], { encoding: 'utf8', maxBuffer: 64 << 20 }).split('\0').filter(Boolean); } catch (e) { lista = []; }
  _publicables = new Set(lista.filter((f) => !/^(README\.md|CNAME|\.nojekyll|fuente\/.*|\.github\/.*)$/.test(f)));
  return _publicables;
}
export function dependenciasSinPublicar(id) {
  const pub = archivosPublicables();
  const { archivos, carpetas } = dependenciasMotor(id);
  const fuera = archivos.filter((f) => !pub.has(f));
  for (const d of carpetas) {
    const enDisco = fs.existsSync(path.join(PUB, d)) ? fs.readdirSync(path.join(PUB, d)).map((f) => d + f) : [];
    if (!enDisco.length) fuera.push(d);
    for (const f of enDisco) if (!pub.has(f)) fuera.push(f);
  }
  return fuera;
}

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const tituloFinal = (p) => (p.title + ' | Avelina').length <= 58 ? p.title + ' | Avelina' : p.title;
export const largo = (s) => [...String(s || '')].length;

export function ligaWhatsApp(p) {
  const tema = p.venta?.tema || p.h1;
  const texto = p.venta?.mensaje || `Hola Ave, vi «${tema}» en avelina.com.mx y quiero una demo de mi sitio. (ref av-${p.slug})`;
  const final = texto.includes(`av-${p.slug}`) ? texto : `${texto} (ref av-${p.slug})`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(final)}`;
}
export const ligaDemo = (p) => `${PILSI}/demo?c=av-${p.slug}`;
export const ligaPaquetes = (p) => `${PILSI}/paquetes?c=av-${p.slug}`;

export function contexto(paginas, { borradores = false, hoy = hoyCDMX() } = {}) {
  const visibles = paginas.filter((p) => borradores || publicada(p, hoy));
  const porId = new Map(paginas.map((p) => [p.id, p]));
  const visibleId = new Set(visibles.map((p) => p.id));
  const indices = {};
  for (const [carpeta, c] of Object.entries(COLECCIONES)) {
    const items = visibles.filter((p) => p.molde === c.molde);
    if (items.length) indices[carpeta] = { ...c, carpeta, items };
  }
  return { borradores, hoy, paginas, visibles, porId, visibleId, indices };
}

// Ruta de un id: fija visible o página externa de Pilsi. '' si no se puede ligar.
export function rutaDeId(id, ctx) {
  if (EXTERNAS[id]) return EXTERNAS[id].ruta;
  const q = ctx.porId.get(id);
  return q && ctx.visibleId.has(q.id) ? ruta(q) : '';
}

export function md(s, ctx) {
  let t = esc(s);
  t = t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, txt, url) => {
    if (url.startsWith('id:')) {
      const r = rutaDeId(url.slice(3), ctx);
      return r ? `<a href="${r}">${txt}</a>` : txt;
    }
    const ext = /^https?:/.test(url);
    return `<a href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${txt}</a>`;
  });
  return t;
}

// Marca de Avelina: la cabecera, el pie, sitio.css y fijas.css salen del sitio. Esto sólo viste el cuerpo (.pw).
const CSS = `.pw-ancha .ah-herramienta:empty{min-height:var(--reserva,900px)}
.pw p{margin:0 0 16px}.pw ul,.pw ol{padding-left:22px;margin:0 0 18px}.pw li{margin:0 0 8px}
.pw a{color:var(--mar)}
.pw .tabla{overflow-x:auto;margin:8px 0 22px}.pw table{border-collapse:collapse;width:100%;font-size:16px}.pw th{text-align:left;font-weight:600;background:var(--crema)}.pw th,.pw td{padding:11px 13px;vertical-align:top}.pw tbody tr:nth-child(even){background:var(--papel)}
.pw .pasos{list-style:none;padding:0;counter-reset:p;display:grid;gap:20px}.pw .pasos li{counter-increment:p;margin:0}.pw .pasos li::before{content:counter(p,decimal-leading-zero);display:block;color:var(--naranja);font-size:15px;margin-bottom:4px}.pw .pasos b{display:block;font-size:21px;font-weight:600;margin-bottom:2px}
.pw-ancha{width:min(1040px,100%);margin:0 auto}.pw-ancha .herramienta-zona{margin:28px 0 10px}.pw-ancha .ah-hueco{border:2px dashed var(--cielo);padding:48px 20px;text-align:center}
.pw-ancha .ah{--ah-fondo:var(--papel);--ah-panel:var(--carton);--ah-campo:#fff;--ah-texto:var(--hondo);--ah-gris:#4a5a80;--ah-borde:var(--cielo);--ah-borde-fuerte:var(--noche);--ah-error:var(--vino);--ah-sans:var(--texto);border:1px solid var(--cielo)}
.pw-ancha .aviso{background:var(--crema);padding:16px 20px;margin:18px 0 0;border-radius:6px}.pw-ancha .aviso p{margin:0}
.pw .artista{background:var(--crema);padding:clamp(20px,4vw,34px);margin:54px 0;border-radius:6px}.pw .artista h2{margin-top:0}.pw .artista p:last-child{margin-bottom:0}
.pw .artista .sello{display:inline-block;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:var(--vino);margin-bottom:10px}
.pw details{padding:16px 0;border-bottom:1px solid var(--cielo)}.pw summary{cursor:pointer;font-size:20px;color:var(--noche)}.pw details p{margin:10px 0 0}
.pw .venta{background:var(--noche);color:var(--papel);padding:clamp(22px,4vw,40px);margin:60px 0;border-radius:6px}.pw .venta h2{margin-top:0;color:var(--crema)}.pw .venta p{margin:.8rem 0}.pw .venta a{color:var(--crema)}.pw .venta .puente{font-size:21px}
.pw .para-artistas{border-left:3px solid var(--naranja);padding-left:14px}
.pw .precio-linea b{font-family:var(--mano);font-size:34px;color:var(--oro);margin-right:6px;font-weight:500}
.pw .acciones{display:flex;flex-wrap:wrap;align-items:center;gap:14px 24px;margin:22px 0 4px}
.pw .venta .boton-pw{display:inline-block;background:var(--naranja);color:#fff;padding:13px 22px;border-radius:999px;font-weight:600;text-decoration:none}
.pw .liga{text-decoration:underline;text-underline-offset:4px}.pw .alterno{font-size:16px;opacity:.85;margin:16px 0 0}
.pw .trabajos{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:24px 0 6px}.pw .trabajos figure{margin:0}
.pw .ventana{border-radius:6px;overflow:hidden;background:#fff}.pw .ventana-barra{display:flex;justify-content:space-between;padding:6px 10px;font-size:11px;color:#555;background:#e9e9e7}.pw .trabajos figcaption{font-size:15px;margin-top:8px}.pw .trabajos figcaption b{display:block}
.pw .relacionadas{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;padding:0;list-style:none}.pw .relacionadas a{display:block;height:100%;padding:16px 18px;background:var(--papel);border:1px solid var(--cielo);border-radius:6px;text-decoration:none;color:var(--noche)}.pw .relacionadas a span{display:block;font-size:15px;opacity:.8;margin-top:4px}
.pw .fuentes{font-size:15px;opacity:.8}
@media(max-width:720px){.pw .trabajos{grid-template-columns:1fr 1fr}}`;

// Cabecera, pie y hojas del sitio, tomados de una fija ya generada.
let _chrome = null;
function chrome() {
  if (_chrome) return _chrome;
  const h = fs.readFileSync(path.join(RAIZ, 'afinador-de-guitarra', 'index.html'), 'utf8');
  const corta = (a, b) => { const i = h.indexOf(a), j = h.indexOf(b, i); if (i < 0 || j < 0) throw new Error('no encontré ' + a + ' en afinador-de-guitarra'); return h.slice(i, j + b.length); };
  const hojas = (h.match(/<link rel="stylesheet" href="\/css\/(sitio|fijas)\.css[^"]*">/g) || []).join('');
  const js = (h.match(/<script src="\/js\/sitio\.js[^"]*" defer><\/script>/) || [''])[0];
  _chrome = { cabecera: corta('<header class="barra">', '</header>'), pie: corta('<footer>', '</footer>'), hojas, js };
  return _chrome;
}

function cabecera() { return chrome().cabecera; }

function pie() { return chrome().pie; }

function head({ titulo, descripcion, canon, og, ld, noindex }) {
  const c = chrome();
  return `<!doctype html>
<!-- pagina-web:generada -->
<html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title><meta name="description" content="${esc(descripcion)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}<meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descripcion)}"><meta property="og:image" content="${og}"><meta property="og:url" content="${canon}"><meta property="og:type" content="article"><meta property="og:locale" content="es_MX"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1c356d"><link rel="icon" href="/img/favicon.png"><link rel="canonical" href="${canon}">
${c.hojas}<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${c.js}
</head>`;
}

export function imagenOg() { return `${SITIO}/img/compartir.jpg`; }

function bloque(b, p, ctx) {
  if (b.h2) return `<h2>${md(b.h2, ctx)}</h2>`;
  if (b.h3) return `<h3>${md(b.h3, ctx)}</h3>`;
  if (b.p) return `<p>${md(b.p, ctx)}</p>`;
  if (b.ul) return `<ul>${b.ul.map((x) => `<li>${md(x, ctx)}</li>`).join('')}</ul>`;
  if (b.ol) return `<ol>${b.ol.map((x) => `<li>${md(x, ctx)}</li>`).join('')}</ol>`;
  if (b.pasos) return `<ol class="pasos">${b.pasos.map((x) => `<li><b>${md(x.titulo, ctx)}</b>${md(x.texto, ctx)}</li>`).join('')}</ol>`;
  if (b.tabla) {
    const t = b.tabla;
    return `<div class="tabla"><table>${t.titulo ? `<caption class="fecha">${md(t.titulo, ctx)}</caption>` : ''}<thead><tr>${t.columnas.map((c) => `<th>${md(c, ctx)}</th>`).join('')}</tr></thead><tbody>${t.filas.map((f) => `<tr>${f.map((c) => `<td>${md(c, ctx)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if (b.venta) return venta(p, ctx, { corta: true });
  if (b.trabajos) return trabajos(p);
  throw new Error(`${p.id}: bloque desconocido ${JSON.stringify(b).slice(0, 80)}`);
}

function trabajos(p) {
  const ids = (p.venta?.trabajos?.length ? p.venta.trabajos : TRABAJOS_DEFECTO).slice(0, 2);
  return `<div class="trabajos">${ids.map((id) => {
    const t = TRABAJOS[id];
    if (!t) throw new Error(`${p.id}: trabajo desconocido ${id}`);
    return `<figure><div class="ventana"><div class="ventana-barra"><span>${t.url}</span><span aria-hidden="true">─□✕</span></div><img src="/img/trabajos/${id}.jpg" alt="Página de ${esc(t.nombre)} en computadora" width="720" height="450" loading="lazy" decoding="async"></div><figcaption><b>${esc(t.nombre)}</b>${esc(t.texto)}</figcaption></figure>`;
  }).join('')}</div>`;
}

// Empuje 1 a artistas: bloque propio de cada página (p.artista), con su ejemplo para quien crea.
function artista(p, ctx) {
  const a = p.artista;
  if (!a?.texto?.length) return '';
  return `<section class="artista"><span class="sello">Para tu música o tu obra</span>
<h2>${md(a.titulo, ctx)}</h2>
${a.texto.map((x) => `<p>${md(x, ctx)}</p>`).join('')}
</section>`;
}

// Bloque de venta en voz de Ave: ella hace sitios para artistas desde Pilsi.
export function venta(p, ctx, { corta = false, id = '' } = {}) {
  const v = p.venta || {};
  const titulo = corta ? (v.tituloCorto || 'Tu sitio de artista con tu dominio') : (v.titulo || '¿Te hago tu sitio de artista?');
  const precio = `<p class="precio-linea"><b>$1,500</b> con tu dominio incluido. Después $99 al mes con tu sitio al día y los cambios que pidas.</p>`;
  const pilsi = `<p class="para-artistas">Hago sitios para músicos y artistas desde <a href="${PILSI}/?c=av-${p.slug}">Pilsi</a>. Tu sitio lleva tu música, tu obra o tu agenda, y tu perfil sale destacado en el directorio.</p>`;
  return `<section class="venta"${id ? ` id="${id}"` : ''} data-venta>
<h2>${esc(titulo)}</h2>
<p class="puente">${md(v.puente, ctx)}</p>
${precio}
${pilsi}
${corta ? '' : trabajos(p)}
<div class="acciones"><a class="boton-pw" href="${ligaDemo(p)}">Pide una demo</a><a class="liga" href="${ligaWhatsApp(p)}" target="_blank" rel="noopener">Escríbeme por WhatsApp</a><a class="liga" href="${ligaPaquetes(p)}">Ver paquetes</a></div>
${corta ? '' : `<p class="alterno">Antes de que pagues te enseño una muestra de tu sitio.</p>`}
</section>`;
}

export const ACCIONES_AVISO = ['descargar', 'copiar', 'leer', 'consultar'];

export function opcionesMotor(p, ctx) {
  const resolver = (v) => {
    if (typeof v === 'string' && v.startsWith('id:')) return rutaDeId(v.slice(3), ctx);
    if (Array.isArray(v)) return v.map(resolver);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolver(x)]));
    return v;
  };
  return resolver(p.herramienta?.opciones || {});
}

const RESERVA_MOTOR = { 'visor-cfdi': 270, 'lector-qr': 260, 'dominio-disponible': 360 };
function herramienta(p, ctx) {
  const h = p.herramienta;
  if (!h?.id) return '';
  if (!motorExiste(h.id)) {
    if (!ctx.borradores) throw new Error(`${p.id}: el motor public/js/herramientas/${h.id}.js no existe; no se puede publicar`);
    return `<div class="herramienta-zona"><div class="ah-herramienta ah-hueco" data-herramienta="${esc(h.id)}" data-modo="${esc(h.modo || '')}"><p>La herramienta aparece aquí.</p></div></div>`;
  }
  const opciones = JSON.stringify({ ...opcionesMotor(p, ctx), modo: h.modo || undefined, idioma: 'es-MX' }).replace(/</g, '\\u003c');
  const reserva = RESERVA_MOTOR[h.id] ? ` style="--reserva:${RESERVA_MOTOR[h.id]}px"` : '';
  return `<div class="herramienta-zona"><link rel="stylesheet" href="/css/herramientas.css"><div class="ah-herramienta" data-herramienta="${esc(h.id)}" data-modo="${esc(h.modo || '')}"${reserva}></div>
<script type="module">import{montar}from"/js/herramientas/${h.id}.js";montar(document.querySelector('.ah-herramienta'),${opciones});</script></div>
<aside class="aviso" id="aviso-venta" hidden><p>${md(p.venta?.aviso || p.venta?.puente, ctx)} <a href="${ligaDemo(p)}">Pide tu demo</a></p></aside>
<script>document.addEventListener('avelina:resultado',function(e){var a=document.getElementById('aviso-venta');if(a&&e.detail&&${JSON.stringify(ACCIONES_AVISO)}.indexOf(e.detail.accion)>=0)a.hidden=false});</script>`;
}

function faqs(p, ctx) {
  if (!p.faqs?.length) return '';
  return `<h2>Preguntas frecuentes</h2>${p.faqs.map((f) => `<details><summary>${esc(f.pregunta)}</summary><p>${md(f.respuesta, ctx)}</p></details>`).join('')}`;
}

function relacionadas(p, ctx) {
  const items = (p.relacionadas || []).map((id) => {
    if (EXTERNAS[id]) return { ruta: EXTERNAS[id].ruta, h1: EXTERNAS[id].h1, resumen: EXTERNAS[id].resumen };
    const q = ctx.porId.get(id);
    return q && ctx.visibleId.has(q.id) ? { ruta: ruta(q), h1: q.h1, resumen: q.resumen || q.description.split('. ')[0] } : null;
  }).filter(Boolean);
  if (!items.length) return '';
  const titulo = p.molde === 'herramienta' ? 'Otras herramientas gratis' : 'También te puede servir';
  return `<h2>${titulo}</h2><ul class="relacionadas">${items.map((q) => `<li><a href="${q.ruta}">${esc(q.h1)}<span>${esc(q.resumen)}</span></a></li>`).join('')}</ul>`;
}

const textoPlano = (s) => String(s || '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

export function jsonLd(p, ctx) {
  const url = SITIO + ruta(p);
  const migas = [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO + '/' }];
  const col = Object.values(ctx.indices).find((i) => i.molde === p.molde);
  if (col) migas.push({ '@type': 'ListItem', position: 2, name: col.nombre, item: `${SITIO}/${col.carpeta}/` });
  migas.push({ '@type': 'ListItem', position: migas.length + 1, name: p.h1, item: url });
  const org = { '@type': 'Person', '@id': SITIO + '/#avelina', name: 'Avelina Martinet Molina', url: SITIO + '/quien-soy/' };
  const g = [
    { '@type': 'BreadcrumbList', itemListElement: migas },
    { '@type': 'WebPage', '@id': url, url, name: p.title, description: p.description, inLanguage: 'es-MX',
      datePublished: p.publicacion || p.creada, dateModified: p.actualizado, isPartOf: { '@type': 'WebSite', name: 'Avelina', url: SITIO + '/' }, author: org,
      primaryImageOfPage: imagenOg(p) },
  ];
  if (p.faqs?.length) g.push({ '@type': 'FAQPage', mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.pregunta,
    acceptedAnswer: { '@type': 'Answer', text: textoPlano(f.respuesta) } })) });
  if (p.molde === 'herramienta' || p.herramienta?.id) g.push({ '@type': 'WebApplication', name: p.h1, url, applicationCategory: p.categoriaApp || 'BusinessApplication',
    operatingSystem: 'Cualquiera con navegador', inLanguage: 'es-MX', isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'MXN' }, provider: org });
  if (['servicio', 'por-giro', 'por-ciudad'].includes(p.molde)) {
    const area = p.servicio?.ciudad ? { '@type': 'City', name: p.servicio.ciudad } : { '@type': 'Country', name: 'México' };
    g.push({ '@type': 'Service', name: p.servicio?.nombre || p.h1, serviceType: p.servicio?.tipo || 'Diseño de páginas web', provider: org, areaServed: area,
      offers: [{ '@type': 'Offer', name: 'Página web con dominio incluido', price: String(PRECIO.sitio), priceCurrency: 'MXN' },
        { '@type': 'Offer', name: 'Sitio completo', price: String(PRECIO.completo), priceCurrency: 'MXN' }] });
  }
  return { '@context': 'https://schema.org', '@graph': g };
}

export function renderPagina(p, ctx) {
  const url = SITIO + ruta(p);
  const col = Object.values(ctx.indices).find((i) => i.molde === p.molde);
  const migas = `<nav class="migas" aria-label="Migas"><a href="/?c=f-${p.slug}">Inicio</a>${col ? ` › <a href="/${col.carpeta}/">${col.nombre}</a>` : ''} › <span>${esc(p.h1)}</span></nav>`;
  const fecha = p.revisada ? `<p class="fecha">Revisada en ${mesAnio(p.revisada)}</p>` : '';
  const respuesta = `<div class="respuesta">${(p.respuesta || []).map((x) => `<p>${md(x, ctx)}</p>`).join('')}</div>`;
  const cuerpo = (p.cuerpo || []).map((b) => bloque(b, p, ctx)).join('\n');
  const conVentaArriba = ['servicio', 'por-giro', 'por-ciudad'].includes(p.molde);
  const fuentes = p.fuentes?.length ? `<p class="fuentes">Fuentes: ${p.fuentes.map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.texto)}</a>`).join(' · ')}</p>` : '';
  const zonaHerramienta = herramienta(p, ctx);
  const main = `<main><section class="lienzo primera f-arriba"><div class="ancho">${migas}
<h1 class="f-h1">${esc(p.h1)}</h1>${(p.respuesta || []).map((x) => `<p class="lead">${md(x, ctx)}</p>`).join('')}${fecha}</div></section>
${zonaHerramienta ? `<section class="papel f-cuerpo"><div class="ancho"><div class="pw-ancha">${zonaHerramienta}</div></div></section>` : ''}
<section class="papel f-cuerpo"><div class="ancho"><div class="f-texto pw">
${conVentaArriba ? venta(p, ctx, { corta: true, id: 'precio' }) : ''}
${cuerpo}
${artista(p, ctx)}
${faqs(p, ctx)}
${venta(p, ctx, { id: 'demo' })}
${relacionadas(p, ctx)}
${fuentes}
</div></div></section></main>`;
  return `${head({ titulo: tituloFinal(p), descripcion: p.description, canon: url, og: imagenOg(p), ld: jsonLd(p, ctx), noindex: ctx.borradores && !publicada(p, ctx.hoy) })}
<body class="p-fija t-herramienta">
${cabecera(ctx, p.slug)}
${main}
${pie(ctx, p.slug)}
</body>
</html>
`;
}

export function renderIndice(ind, ctx) {
  const url = `${SITIO}/${ind.carpeta}/`;
  const grupos = new Map();
  for (const p of [...ind.items].sort((a, b) => a.h1.localeCompare(b.h1, 'es'))) {
    const k = p.categoria || 'Más';
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(p);
  }
  const orden = [...grupos.keys()].sort((a, b) => (a === 'Más') - (b === 'Más') || a.localeCompare(b, 'es'));
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO + '/' }, { '@type': 'ListItem', position: 2, name: ind.nombre, item: url }] },
    { '@type': 'CollectionPage', '@id': url, url, name: ind.title, description: ind.description, inLanguage: 'es-MX',
      mainEntity: { '@type': 'ItemList', itemListElement: ind.items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITIO + ruta(p), name: p.h1 })) } },
  ] };
  const cuerpo = orden.map((k) => `${grupos.size > 1 ? `<h2>${esc(k)}</h2>` : ''}<ul class="relacionadas">${grupos.get(k).map((p) => `<li><a href="${ruta(p)}">${esc(p.h1)}<span>${esc(p.resumen || p.description.split('. ')[0])}</span></a></li>`).join('')}</ul>`).join('\n');
  return `${head({ titulo: ind.title, descripcion: ind.description, canon: url, og: imagenOg(), ld, noindex: ctx.borradores })}
<body class="p-fija">
${cabecera(ctx, ind.carpeta)}
<main><section class="lienzo primera f-arriba"><div class="ancho"><nav class="f-migas" aria-label="Estás en"><a href="/">Inicio</a></nav>
<h1 class="f-h1">${esc(ind.h1)}</h1><p class="lead">${esc(ind.intro)}</p></div></section>
<section class="papel f-cuerpo"><div class="ancho"><div class="f-texto pw">
${cuerpo}
</div></div></section>
</main>
${pie(ctx, ind.carpeta)}
</body>
</html>
`;
}

export function textoVisible(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<head>[\s\S]*?<\/head>/, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

// Texto propio de la página: respuesta, cuerpo, bloque de artista y preguntas. sinTablas para comparar contra Aliviane.
export function textoPropio(p, { sinTablas = false } = {}) {
  const partes = [...(p.respuesta || [])];
  for (const b of p.cuerpo || []) {
    for (const k of ['h2', 'h3', 'p']) if (b[k]) partes.push(b[k]);
    for (const k of ['ul', 'ol']) if (b[k]) partes.push(...b[k]);
    if (b.pasos) for (const x of b.pasos) partes.push(x.titulo + '. ' + x.texto);
    if (b.tabla && !sinTablas) { partes.push(...b.tabla.columnas); for (const f of b.tabla.filas) partes.push(...f); }
  }
  if (p.artista) partes.push(p.artista.titulo || '', ...(p.artista.texto || []));
  for (const f of p.faqs || []) partes.push(f.pregunta, f.respuesta);
  return partes.map(textoPlano).join('\n');
}
export const palabras = (s) => (String(s).match(/[\p{L}\p{N}$%][\p{L}\p{N},.$%'-]*/gu) || []).length;

// Frases de 5 palabras (para medir texto copiado).
export function tejas(texto) {
  const w = texto.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').match(/[a-z0-9ñ]+/g) || [];
  const s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(' '));
  return s;
}
