#!/usr/bin/env node
// Pruebas de las páginas para artistas de avelina.com.mx. Truena (código 1) si algo falla. Ver fuente/paginas-web/CONTRATO.md.
//   node fuente/paginas-web/probar.mjs              todas las páginas
//   node fuente/paginas-web/probar.mjs --estricto   los avisos también truenan
//   node fuente/paginas-web/probar.mjs --solo a,b   sólo esas páginas (para quien escribe un lote)
//
// Presupuesto de peso: ningún HTML servido > 60 KB; ningún JS de página (en línea) > 60 KB;
// ningún motor js/herramientas/*.js > 60 KB (sin contar js/vendor/).
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, PUB, MOLDES, CARPETA, RESERVADAS, EXTERNAS, cargarPaginas, contexto, renderPagina, ruta, publicada, hoyCDMX, largo,
  textoVisible, textoPropio, palabras, motorExiste, TRABAJOS, dependenciasMotor, dependenciasSinPublicar, ACCIONES_AVISO, tejas } from './lib.mjs';

const estricto = process.argv.includes('--estricto');
const hoy = hoyCDMX();
const errores = [], avisos = [];
const mal = (p, m) => errores.push(`${p?.id || '-'}: ${m}`);
const ojo = (p, m) => (estricto ? errores : avisos).push(`${p?.id || '-'}: ${m}`);

const iSolo = process.argv.indexOf('--solo');
const SOLO = iSolo >= 0 ? new Set(process.argv[iSolo + 1].split(',')) : null;
const todas = cargarPaginas();
const paginas = todas;
const revisar = (p) => !SOLO || SOLO.has(p.id);
const LISTA = path.join(RAIZ, 'fuente', 'paginas-web', 'lista.json');
const lista = fs.existsSync(LISTA) ? JSON.parse(fs.readFileSync(LISTA, 'utf8')) : [];
const idsPlan = new Set([...lista.map((l) => l.id), ...paginas.map((p) => p.id), ...Object.keys(EXTERNAS)]);
// Lo que Aliviane publicó con el mismo id: el texto de Pilsi no puede ser copia (dominios distintos, texto propio).
const DIR_ALIVIANE = process.env.ALIVIANE_FIJAS || path.join(process.env.HOME || '', 'aliviane', 'fijas', 'paginas');
// En Avelina sí se nombra Pilsi (es de Ave). Nunca Aliviane ni los negocios de su portafolio.
const DIR_PILSI = process.env.PILSI_FIJAS || path.join(process.env.HOME || '', 'pilsi-espejo', 'paginas-fijas', 'paginas');
const CANDADO = ['aliviane', '3111223365', '311 122 3365', '523111223365', 'diego@', 'solufintech', 'makatea', 'comprafin', 'signsol', 'agroqs', 'rodrigo'];
// Choques de ruta en todo el plan (lista + páginas).
{
  const vistas = new Map();
  for (const l of [...lista, ...paginas.filter((p) => !lista.some((l) => l.id === p.id))]) {
    const r = ruta(l);
    if (vistas.has(r) && vistas.get(r) !== l.id) errores.push(`${l.id}: choque de ruta ${r} con ${vistas.get(r)} (plan)`);
    vistas.set(r, l.id);
    if (!CARPETA[l.molde] && RESERVADAS.includes(l.slug)) errores.push(`${l.id}: el slug choca con una carpeta del sitio (plan)`);
    const enLista = lista.find((x) => x.id === l.id);
    if (enLista && paginas.some((p) => p.id === l.id && (p.slug !== enLista.slug || p.molde !== enLista.molde))) errores.push(`${l.id}: slug o molde distinto al de fijas/lista.json`);
  }
}
const ctxTodo = contexto(paginas, { borradores: true, hoy });
const ctxPub = contexto(paginas, { borradores: false, hoy });

const LARGOS = { herramienta: [500, 1000], guia: [1500, 2800], servicio: [1300, 2000], 'por-giro': [900, 1500],
  'por-ciudad': [900, 1500], plantilla: [1100, 2000], comparativa: [1400, 2400] };
const PROHIBIDAS = ['aquí podrás', 'aqui podras', 'en esta sección', 'solución que permite', 'simple', 'simples', 'transparente',
  'sin sorpresas', 'no te preocupes', 'lo honesto', 'sin rodeos', 'con sinceridad', 'honestamente', 'sin letras chicas',
  'te llamamos', 'garantizamos el primer lugar', 'primer lugar en google', 'germinar', 'germina'];
const STACK = ['supabase', 'anthropic', 'claude', 'stripe', 'netlify', 'resend', 'aws', 'amazon web services', 'evolution api', 'openai', 'chatgpt', 'codex', 'github'];
const INGLES = ['the', 'and', 'with', 'your', 'free', 'download', 'click', 'here', 'tool', 'generator', 'create', 'template', 'upload',
  'share', 'copy', 'seamless', 'hassle-free', 'simply', 'honestly', 'learn more', 'get started', 'sign up', 'loading', 'error'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DIA = /^\d{4}-\d{2}-\d{2}$/;

// ---------- Datos ----------
const ids = new Map(), rutas = new Map();
for (const p of paginas) {
  if (!revisar(p)) { ids.set(p.id, p); rutas.set(ruta(p), p.id); continue; }
  if (p._archivo !== p.id + '.json') mal(p, `el archivo se llama ${p._archivo}; debe ser <id>.json`);
  if (ids.has(p.id)) mal(p, 'id repetido'); ids.set(p.id, p);
  if (!SLUG.test(p.slug || '')) mal(p, `slug inválido «${p.slug}»`);
  if (!MOLDES.includes(p.molde)) mal(p, `molde inválido «${p.molde}»`);
  const r = ruta(p);
  if (rutas.has(r)) mal(p, `choque de ruta ${r} con ${rutas.get(r)}`); rutas.set(r, p.id);
  if (!CARPETA[p.molde] && RESERVADAS.includes(p.slug)) mal(p, `el slug «${p.slug}» choca con una carpeta o archivo del sitio`);
  if (!CARPETA[p.molde] && fs.existsSync(path.join(PUB, p.slug)) && !fs.existsSync(path.join(PUB, p.slug, 'index.html'))) mal(p, `ya existe public/${p.slug} en el repo`);
  if (p.artista && (!p.artista.titulo || !Array.isArray(p.artista.texto))) mal(p, 'artista debe ser { titulo, texto: [párrafos] }');
  else if (p.artista && palabras(p.artista.texto.join(" ")) < 45) mal(p, `artista con ${palabras(p.artista.texto.join(' '))} palabras (mín. 45)`);
  for (const b of [...(p.cuerpo || []), ...(p.artista ? [{ h2: p.artista.titulo }] : [])]) for (const k of ['h2', 'h3']) if (b[k] && /[.]$/.test(b[k].trim())) mal(p, `encabezado con punto final «${b[k]}»`);
  if (/[.]$/.test((p.h1 || '').trim())) mal(p, 'h1 con punto final');
  for (const k of ['cabeza', 'title', 'h1', 'description', 'creada', 'actualizado']) if (!p[k]) mal(p, `falta ${k}`);
  if (!Array.isArray(p.busquedas)) mal(p, 'busquedas debe ser lista');
  if (p.publicacion !== null && !DIA.test(p.publicacion || '')) mal(p, 'publicacion debe ser null o AAAA-MM-DD');
  if (!DIA.test(p.creada || '') || !DIA.test(p.actualizado || '')) mal(p, 'creada y actualizado en AAAA-MM-DD');
  if (p.revisada && !/^\d{4}-\d{2}$/.test(p.revisada)) mal(p, 'revisada en AAAA-MM');
  if (largo(p.title) > 58) mal(p, `title de ${largo(p.title)} caracteres (máx. 58)`);
  if (/[.]$/.test(p.title || '')) mal(p, 'title con punto final');
  const nTit = (p.title || '').toLowerCase(), nCab = (p.cabeza || '').toLowerCase();
  const sinAcento = (s) => s.normalize('NFD').replace(/\p{M}/gu, '');
  // cabeza_titulo: excepciones declaradas cuando la cabeza de la lista es torpe (ver CONTRATO): el title puede empezar con una de ellas.
  if (p.cabeza_titulo !== undefined && (!Array.isArray(p.cabeza_titulo) || !p.cabeza_titulo.length || p.cabeza_titulo.some((x) => typeof x !== 'string' || !x.trim()))) mal(p, 'cabeza_titulo debe ser una lista de textos');
  const cabezas = [nCab, ...(Array.isArray(p.cabeza_titulo) ? p.cabeza_titulo : []).map((x) => String(x).toLowerCase())];
  if (!cabezas.some((c) => sinAcento(nTit).startsWith(sinAcento(c)))) ojo(p, `el title no empieza con la búsqueda cabeza «${p.cabeza}»${p.cabeza_titulo ? ' ni con su cabeza_titulo' : ''}`);
  const d = largo(p.description);
  if (d < 140 || d > 160) mal(p, `description de ${d} caracteres (140-160)`);
  if (!p.venta?.puente) mal(p, 'falta venta.puente (frase que conecta el tema con el negocio)');
  for (const t of p.venta?.trabajos || []) if (!TRABAJOS[t]) mal(p, `trabajo desconocido ${t}`);
  if (p.molde === 'herramienta' && !p.herramienta?.id) mal(p, 'herramienta sin herramienta.id');
  // herramienta.opciones: objeto; ligas a otras fijas con «id:<página>» (el generador las apaga si no está publicada).
  if (p.herramienta?.opciones !== undefined) {
    const o = p.herramienta.opciones;
    if (!o || typeof o !== 'object' || Array.isArray(o)) mal(p, 'herramienta.opciones debe ser un objeto');
    else {
      if ('modo' in o || 'idioma' in o) mal(p, 'herramienta.opciones no lleva modo ni idioma (van en herramienta.modo)');
      const recorrer = (v, donde) => {
        if (typeof v === 'string') {
          if (v.startsWith('id:') && !idsPlan.has(v.slice(3))) mal(p, `${donde} liga a «${v.slice(3)}», que no existe ni en la lista`);
          const r = v.split(/[?#]/)[0];
          if (!v.startsWith('id:') && [...lista, ...paginas].some((x) => ruta(x) === r)) mal(p, `${donde} liga a una fija con «${v}»: usa «id:<página>» para que se apague si no está publicada`);
        } else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) recorrer(x, `${donde}.${k}`);
      };
      recorrer(o, 'herramienta.opciones');
    }
  }
  if ((p.respuesta || []).length < 1) mal(p, 'falta respuesta (2 a 4 frases bajo el H1)');
  const rel = p.relacionadas || [];
  if (rel.length < 3 || rel.length > 6) mal(p, `da ${rel.length} ligas a hermanas (3 a 6)`);
  for (const r2 of rel) { if (r2 === p.id) mal(p, 'se liga a sí misma'); else if (!idsPlan.has(r2)) mal(p, `relacionada «${r2}» no existe ni en la lista`); }
  if (publicada(p, hoy)) {
    const vivas = rel.filter((x) => ctxPub.visibleId.has(x));
    if (vivas.length < 3) mal(p, `publicada con ${vivas.length} relacionadas publicadas (mín. 3)`);
    if (p.herramienta?.id && !motorExiste(p.herramienta.id)) mal(p, `publicada sin motor js/herramientas/${p.herramienta.id}.js`);
    if (!p.serp?.length) ojo(p, 'sin «serp» (top 3 leído antes de escribir)');
  }
  for (const f of p.faqs || []) {
    const primera = (f.respuesta || '').split(/(?<=[.!?])\s/)[0];
    if (palabras(primera) > 12) ojo(p, `la pregunta «${f.pregunta}» no abre con la respuesta corta («${primera.slice(0, 50)}…»)`);
  }
}

// ---------- HTML servido ----------
function frases(texto) { return texto.split(/(?<=[.!?])\s+(?=[¿¡A-ZÁÉÍÓÚÑ0-9«$])/u).map((s) => s.trim()).filter(Boolean); }

const shingles = new Map();
for (const p of paginas) {
  if (!(p.cuerpo || []).length) continue;
  const w = textoPropio(p).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').match(/[a-z0-9ñ]+/g) || [];
  const s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(' '));
  shingles.set(p.id, s);
}

for (const p of paginas) {
  if (!revisar(p)) continue;
  let html;
  try { html = renderPagina(p, publicada(p, hoy) ? ctxPub : ctxTodo); } catch (e) { mal(p, e.message); continue; }
  const kb = Buffer.byteLength(html) / 1024;
  if (kb > 60) mal(p, `HTML de ${kb.toFixed(1)} KB (máx. 60)`);
  const js = (html.match(/<script(?![^>]*ld\+json)[^>]*>[\s\S]*?<\/script>/g) || []).join('');
  if (Buffer.byteLength(js) / 1024 > 60) mal(p, 'JS en línea > 60 KB');
  if (/aggregateRating/i.test(html)) mal(p, 'lleva aggregateRating');
  if (!html.includes('<html lang="es-MX">')) mal(p, 'sin lang es-MX');
  { const bajo = html.toLowerCase(); for (const w of CANDADO) if (bajo.includes(w)) mal(p, `CANDADO: el HTML trae «${w}»`); }
  if (/(^|[^\p{L}])sol[uú]([^\p{L}]|$)/iu.test(textoVisible(html))) mal(p, 'CANDADO: nombra a Solú');
  { const fa = path.join(DIR_ALIVIANE, p.id + '.json');
    if (fs.existsSync(fa)) { const a = JSON.parse(fs.readFileSync(fa, 'utf8')); const sa = tejas(textoPropio(a, { sinTablas: true })); const sp = tejas(textoPropio(p, { sinTablas: true }));
      let c = 0; for (const x of sp) if (sa.has(x)) c++; const r = sp.size ? c / sp.size : 0;
      if (r > 0.25) mal(p, `copia de Aliviane: comparte ${(100 * r).toFixed(0)}% de sus frases de 5 palabras (máx. 25%)`); } }
  { const fp = path.join(DIR_PILSI, p.id + '.json');
    if (fs.existsSync(fp)) { const a = JSON.parse(fs.readFileSync(fp, 'utf8')); const sa = tejas(textoPropio(a, { sinTablas: true })); const sp = tejas(textoPropio(p, { sinTablas: true }));
      let c = 0; for (const x of sp) if (sa.has(x)) c++; const r = sp.size ? c / sp.size : 0;
      if (r > 0.25) mal(p, `copia de Pilsi: comparte ${(100 * r).toFixed(0)}% de sus frases de 5 palabras (máx. 25%)`); } }
  const visible = textoVisible(html);
  const meta = [p.title, p.description, ...(html.match(/alt="[^"]*"/g) || [])].join(' ');
  const todo = (visible + ' ' + meta).toLowerCase();
  for (const w of PROHIBIDAS) if (new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'u').test(todo)) mal(p, `palabra prohibida «${w}»`);
  for (const w of STACK) if (new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'u').test(todo)) mal(p, `nombra el stack «${w}»`);
  for (const w of INGLES) if (new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'u').test(todo)) mal(p, `texto en inglés «${w}»`);
  if (/;/.test(visible)) mal(p, 'punto y coma en el texto');
  if (/—/.test(visible + p.title + p.description)) mal(p, 'raya larga en el texto');
  if (/\*\*|\]\(/.test(visible)) mal(p, 'markdown literal en el texto');
  const ventas = (html.match(/<section class="venta"[\s\S]*?<\/section>/g) || []).map(textoVisible).join(' ');
  if (/[^0-9]:[^0-9/]/.test(ventas.replace(/https?:\/\/\S+/g, ''))) mal(p, 'dos puntos en el texto de venta');
  if (/!/.test(visible)) mal(p, 'signo de admiración en el texto');
  // Escritura: frases de 8 a 15 palabras, una coma. Truena > 25 palabras o > 2 comas; avisa fuera de rango.
  const propio = textoPropio(p);
  let largas = 0, cortas = 0, comas = 0, n = 0;
  for (const linea of propio.split('\n')) for (const f of frases(linea)) {
    const k = palabras(f); if (k < 3) continue; n++;
    const c = (f.replace(/\d,\d/g, '').match(/,/g) || []).length;
    if (k > 25) mal(p, `frase de ${k} palabras: «${f.slice(0, 70)}…»`);
    else if (k > 15) largas++;
    else if (k < 8 && !/[?]$/.test(f)) cortas++;
    if (c > 2) mal(p, `frase con ${c} comas: «${f.slice(0, 70)}…»`); else if (c === 2) comas++;
  }
  if (n && (largas + comas) / n > 0.2) ojo(p, `${largas} frases de más de 15 palabras y ${comas} con dos comas de ${n}`);
  const total = palabras(propio);
  const [mn, mx] = LARGOS[p.molde] || [0, 1e9];
  if ((p.cuerpo || []).length && (total < mn || total > mx)) (publicada(p, hoy) ? mal : ojo)(p, `${total} palabras propias (molde ${p.molde}: ${mn}-${mx})`);
  if (!(p.cuerpo || []).length && publicada(p, hoy)) mal(p, 'publicada sin cuerpo');
  // Cifras: un número con % o «millones» pide fuentes.
  if (/\d+\s?%|millones/.test(propio) && !(p.fuentes || []).length) ojo(p, 'tiene cifras (% o millones) y no tiene fuentes');
  // ≥60% propio: comparte a lo más 40% de sus frases de 5 palabras con cualquier hermana.
  const s = shingles.get(p.id);
  if (s && s.size > 50) for (const [otro, s2] of shingles) {
    if (otro === p.id) continue;
    let c = 0; for (const x of s) if (s2.has(x)) c++;
    if (c / s.size > 0.4) mal(p, `comparte ${(100 * c / s.size).toFixed(0)}% del texto con ${otro} (máx. 40%)`);
  }
}

// ---------- Motores (presupuesto de peso) ----------
const dirMotores = path.join(PUB, 'js', 'herramientas');
if (fs.existsSync(dirMotores)) for (const f of fs.readdirSync(dirMotores)) {
  if (!f.endsWith('.js')) continue;
  const kb = fs.statSync(path.join(dirMotores, f)).size / 1024;
  if (kb > 60) mal(null, `js/herramientas/${f} pesa ${kb.toFixed(1)} KB (máx. 60 sin contar js/vendor/)`);
}

// ---------- Motores: todo lo que cargan existe y se publica ----------
{
  const porMotor = new Map();
  for (const p of paginas) if (p.herramienta?.id && motorExiste(p.herramienta.id)) {
    if (!porMotor.has(p.herramienta.id)) porMotor.set(p.herramienta.id, []);
    porMotor.get(p.herramienta.id).push(p);
  }
  for (const [id, ps] of porMotor) {
    // El aviso suave sale con «avelina:resultado» y una acción de ACCIONES_AVISO: el motor debe mandarla.
    const src = fs.readFileSync(path.join(PUB, 'js', 'herramientas', id + '.js'), 'utf8');
    const acciones = [...src.matchAll(/avisar\([^,]+,[^,]+,\s*'([a-z-]+)'\)/g)].map((m) => m[1]);
    if (!acciones.length) mal(ps[0], `el motor ${id} nunca avisa su resultado (avisar(contenedor, ID, 'descargar'|'copiar'|…)): el aviso suave no sale`);
    for (const a of new Set(acciones)) if (!ACCIONES_AVISO.includes(a)) mal(ps[0], `el motor ${id} avisa «${a}», que no está en ACCIONES_AVISO de lib.mjs: el aviso suave no sale con esa acción`);
    const { faltan } = dependenciasMotor(id);
    if (faltan.length) mal(null, `el motor ${id} carga lo que no existe: ${faltan.join(', ')}`);
    const fuera = dependenciasSinPublicar(id);
    if (!fuera.length) continue;
    const msg = `el motor ${id} carga ${fuera.length} archivos que no se publican (sin git add o en fijas/): ${fuera.slice(0, 5).join(', ')}`;
    const pubs = ps.filter((p) => publicada(p, hoy));
    if (pubs.length) mal(pubs[0], msg); else ojo(ps[0], msg);
  }
}

const pub = paginas.filter((p) => publicada(p, hoy)).length;
console.log(`${paginas.length} páginas (${pub} publicadas) · ${errores.length} errores · ${avisos.length} avisos`);
for (const a of avisos) console.log('  aviso  ' + a);
for (const e of errores) console.log('  ERROR  ' + e);
process.exit(errores.length ? 1 : 0);
