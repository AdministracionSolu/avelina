#!/usr/bin/env node
// Generador de las páginas para artistas de avelina.com.mx. Ver fuente/paginas-web/CONTRATO.md.
//
//   node fuente/paginas-web/generar.mjs                      escribe en public/ SÓLO lo publicado (publicacion <= hoy CDMX):
//                                                       public/<carpeta>/<slug>/index.html e índices, y la lista
//                                                       src/fijas/estaticas.json que lee el sitemap. Borra lo que dejó de estar publicado.
//   node fuente/paginas-web/generar.mjs --borradores <dir>   escribe TODO (con noindex) en <dir>, fuera del repo, con copia
//                                                       de public/ para verlo con un servidor local.
//   --hoy AAAA-MM-DD                                    fecha de corte (por omisión, hoy en CDMX).
//
// Corre las pruebas antes: node fuente/paginas-web/probar.mjs
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, PUB, SITIO, cargarPaginas, contexto, renderPagina, renderIndice, ruta, hoyCDMX, dependenciasMotor,
  dependenciasSinPublicar } from './lib.mjs';

const args = process.argv.slice(2);
const val = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const dirBorradores = val('--borradores');
const hoy = val('--hoy') || hoyCDMX();

const paginas = cargarPaginas();
const ctx = contexto(paginas, { borradores: !!dirBorradores, hoy });

function escribir(base, rel, contenido) {
  const f = path.join(base, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, contenido);
  return rel;
}

if (dirBorradores) {
  const base = path.resolve(dirBorradores);
  if (base === RAIZ || base.startsWith(RAIZ + path.sep)) { console.error('--borradores debe ser un directorio fuera del repo'); process.exit(1); }
  fs.mkdirSync(base, { recursive: true });
  for (const rel of ['img', 'js', 'css', 'fuentes', 'fonts', 'afinador-de-guitarra']) {
    const o = path.join(PUB, rel);
    if (fs.existsSync(o)) fs.cpSync(o, path.join(base, rel), { recursive: true });
  }
  for (const p of ctx.visibles) escribir(base, ruta(p).slice(1) + 'index.html', renderPagina(p, ctx));
  for (const ind of Object.values(ctx.indices)) escribir(base, ind.carpeta + '/index.html', renderIndice(ind, ctx));
  const motores = [...new Set(ctx.visibles.map((p) => p.herramienta?.id).filter(Boolean))];
  for (const id of motores) {
    const { archivos, carpetas } = dependenciasMotor(id);
    for (const rel of [...archivos, ...carpetas]) {
      if (fs.existsSync(path.join(base, rel)) || !fs.existsSync(path.join(PUB, rel))) continue;
      fs.cpSync(path.join(PUB, rel), path.join(base, rel), { recursive: true });
    }
  }
  console.log(`borradores: ${ctx.visibles.length} páginas y ${Object.keys(ctx.indices).length} índices en ${base}`);
  process.exit(0);
}

{
  const malos = [];
  for (const id of new Set(ctx.visibles.map((p) => p.herramienta?.id).filter(Boolean))) {
    const fuera = dependenciasSinPublicar(id);
    if (fuera.length) malos.push(`${id}: ${fuera.slice(0, 8).join(', ')}${fuera.length > 8 ? '…' : ''}`);
  }
  if (malos.length) { console.error('No se generó nada. Motores publicados que cargan archivos sin git add en public/:\n  ' + malos.join('\n  ')); process.exit(1); }
}

const MANIFIESTO = path.join(RAIZ, 'fuente', 'paginas-web', 'generadas.json');
const antes = fs.existsSync(MANIFIESTO) ? JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8')) : [];
const ahora = [];
for (const p of ctx.visibles) ahora.push(escribir(PUB, ruta(p).slice(1) + 'index.html', renderPagina(p, ctx)));
for (const ind of Object.values(ctx.indices)) ahora.push(escribir(PUB, ind.carpeta + '/index.html', renderIndice(ind, ctx)));

const permitidas = new Set(['herramientas', 'guias', 'plantillas', 'comparar', 'paginas-web', 'diseno-web', ...paginas.filter((p) => p.molde === 'servicio').map((p) => p.slug)]);
for (const rel of antes) {
  if (ahora.includes(rel)) continue;
  if (!rel.endsWith('/index.html') || !permitidas.has(rel.split('/')[0])) continue;
  const f = path.join(PUB, rel);
  if (fs.existsSync(f)) { fs.unlinkSync(f); let d = path.dirname(f); while (d !== PUB && fs.readdirSync(d).length === 0) { fs.rmdirSync(d); d = path.dirname(d); } }
}
fs.writeFileSync(MANIFIESTO, JSON.stringify(ahora.sort(), null, 1) + '\n');

// Sitemap: lista propia que fuente/build.py suma al rehacer el sitio, y el sitemap.xml de hoy al día.
const urls = [];
for (const ind of Object.values(ctx.indices)) urls.push([`${SITIO}/${ind.carpeta}/`, ind.items.map((p) => p.actualizado).sort().pop()]);
for (const p of [...ctx.visibles].sort((a, b) => ruta(a).localeCompare(ruta(b)))) urls.push([SITIO + ruta(p), p.actualizado]);
fs.writeFileSync(path.join(RAIZ, 'fuente', 'paginas-web', 'paginas_sitemap.txt'), urls.map((u) => u.join('\t')).join('\n') + '\n');
{
  const SM = path.join(RAIZ, 'sitemap.xml');
  const viejo = fs.readFileSync(SM, 'utf8');
  const nuestras = new Set([...paginas.map((p) => SITIO + ruta(p)), ...['herramientas', 'guias', 'plantillas'].map((c) => `${SITIO}/${c}/`)]);
  const otras = (viejo.match(/<url>[\s\S]*?<\/url>/g) || []).filter((u) => !nuestras.has((u.match(/<loc>([^<]+)<\/loc>/) || [])[1]));
  const nuevo = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${otras.join('')}${urls.map(([u, f]) => `<url><loc>${u}</loc><lastmod>${f}</lastmod></url>`).join('')}</urlset>\n`;
  if (nuevo !== viejo) fs.writeFileSync(SM, nuevo);
}

console.log(`publicadas: ${ctx.visibles.length} de ${paginas.length} · índices: ${Object.keys(ctx.indices).join(', ') || 'ninguno'} · corte ${hoy}`);
