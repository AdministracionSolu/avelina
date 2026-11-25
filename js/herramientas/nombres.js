// Herramienta «nombres» de Avelina: ideas de nombre para un negocio, por giro y estilo.
// montar(contenedor, { modo: 'general' | 'tiendas' | 'ropa' | 'restaurante' | 'polleria' | 'barberia'
//   | 'salon-de-belleza' | 'comida-rapida' | 'variedades', idioma: 'es-MX', textos })
// Reglas y bancos propios (nombres-bancos.js, se carga al montar). Sin red. Favoritos en el equipo.

import { h, campo, textos as unirTextos, avisar, copiar, descargar, estado, boton, asegurarEstilos, opcionesChip } from './_comun.js';

const ID = 'nombres';
const CLAVE = 'avelina:nombres:favoritos';

export const TEXTOS = {
  giro: 'Giro de tu negocio',
  claves: 'Palabras que te gustan (opcional)',
  clavesAyuda: 'Separa con comas. Ejemplo: leña, rancho, abuela.',
  clavesEjemplo: 'leña, rancho',
  apellido: 'Tu apellido o nombre (opcional)',
  apellidoAyuda: 'Lo usamos en el estilo «con apellido».',
  apellidoEjemplo: 'Ramírez',
  estilo: 'Estilo',
  estilos: { todos: 'Todos', corto: 'Cortos', espanol: 'En español', juego: 'Juego de palabras', apellido: 'Con apellido', elegante: 'Elegantes' },
  generar: 'Dame ideas',
  mas: 'Más ideas',
  cargando: 'Preparando ideas…',
  titulo: 'Ideas para tu negocio',
  sinApellido: 'Escribe tu apellido o nombre para ver ideas con él.',
  copiar: 'Copiar',
  copiado: 'Copiado.',
  noCopiado: 'No se pudo copiar. Selecciona el nombre y cópialo.',
  guardar: 'Guardar',
  guardado: 'Guardado',
  copiarTodas: 'Copiar todas',
  bajarTodas: 'Bajar lista',
  favoritos: 'Tus favoritos',
  favoritosVacio: 'Toca «Guardar» en los nombres que te gusten. Se quedan en este equipo.',
  copiarFavoritos: 'Copiar favoritos',
  bajarFavoritos: 'Bajar favoritos',
  borrarFavoritos: 'Borrar favoritos',
  quitar: 'Quitar',
  dominioCorto: 'Dominio corto',
  dominioCabe: 'Cabe como dominio',
  dominioLargo: 'Largo para dominio',
  dominioNota: 'Revisa si el dominio está libre antes de decidir.',
  verDominio: 'Ver si está libre',
  ligaDominio: '',
  archivo: 'nombres-para-tu-negocio',
  pieArchivo: 'Hecho con Avelina · avelina.com.mx',
};

// ---------- utilidades de texto ----------
const sinAcentos = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
// Para revisar groserías: minúsculas sin acentos, pero la ñ se queda (año no es ano).
const paraRevisar = (s) => String(s).toLowerCase().replace(/ñ/g, '\u0001').normalize('NFD')
  .replace(/[̀-ͯ]/g, '').replace(/\u0001/g, 'ñ');
const llave = (s) => sinAcentos(s).toLowerCase().replace(/[^a-z0-9ñ]+/g, ' ').trim();
const MENORES = new Set(['de', 'del', 'la', 'el', 'y', 'e', 'en', 'con', 'a', 'al', 'los', 'las', 'para', 'por', 'un', 'una']);
function titulo(s) {
  return String(s).trim().split(/\s+/).map((p, i) => {
    const m = p.toLowerCase();
    if (i > 0 && MENORES.has(m)) return m;
    return m.charAt(0).toUpperCase() + m.slice(1);
  }).join(' ');
}
const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Dominio: sin acentos, la ñ pasa a n, sin espacios ni signos.
export function dominioDe(nombre) {
  return sinAcentos(String(nombre).replace(/&/g, ' y ')).toLowerCase().replace(/[^a-z0-9]+/g, '');
}
export function calificarDominio(base) {
  if (!base || base.length > 63) return 'largo';
  if (base.length <= 12) return 'corto';
  if (base.length <= 20) return 'cabe';
  return 'largo';
}

// Generador pseudoaleatorio con semilla (pruebas repetibles).
function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const elegir = (r, lista) => lista[Math.floor(r() * lista.length)];
function barajar(r, lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- gramática ----------
const EL_FEMENINO = new Set(['ala', 'ancla', 'agua', 'aguila', 'alma', 'hacha', 'arpa', 'aula']);
function sust(s) {
  const [p, g] = s.split('|');
  return { p, g: g || generoDe(p) };
}
function generoDe(p) {
  const w = sinAcentos(p).toLowerCase().split(' ').pop();
  if (/(dia|mapa|planeta|clima|tema|sofa)$/.test(w)) return 'm';
  return /(a|cion|sion|dad|tad|tud|umbre|is)$/.test(w) ? 'f' : 'm';
}
const articulo = (n) => (n.g === 'f' && !EL_FEMENINO.has(sinAcentos(n.p).toLowerCase()) ? 'La' : 'El');
function adjetivo(a, g) {
  const [m, f] = a.split('|');
  return g === 'f' ? (f || m) : m;
}

// ---------- filtros ----------
export function crearFiltro(bancos) {
  const fuertes = bancos.GROSERIAS.fuertes, palabras = new Set(bancos.GROSERIAS.palabras);
  const marcas = bancos.MARCAS.map((m) => ' ' + llave(m) + ' ');
  return (nombre) => {
    const t = paraRevisar(nombre).split(/[^a-zñ0-9]+/).filter(Boolean);
    for (const w of t) {
      if (palabras.has(w)) return false;
      for (const f of fuertes) if (w.includes(f)) return false;
    }
    const k = ' ' + llave(nombre) + ' ';
    for (const m of marcas) if (k.includes(m) || ' el' + k === m || ' la' + k === m) return false;
    return true;
  };
}

// Pronunciable: sin tres consonantes seguidas (salvo las de siempre) ni vocales repetidas.
function pronunciable(s) {
  const w = sinAcentos(s).toLowerCase();
  if (/([aeiou])\1/.test(w) || /(.)\1\1/.test(w)) return false;
  const sinGrupos = w.replace(/(ch|ll|rr|tr|br|cr|dr|fr|gr|pr|bl|cl|fl|gl|pl|ns|st)/g, 'C');
  return !/[bcdfghjklmnñpqrstvwxyzC]{3}/.test(sinGrupos);
}

// ---------- generadores por estilo ----------
function palabrasClave(texto) {
  return String(texto || '').split(/[,;\n]+/).map((s) => s.trim()).filter((s) => s && s.length <= 30).slice(0, 6).map(titulo);
}

function estiloEspanol(b, C, claves, r) {
  const nombres = b.sust.map(sust).concat(claves.map((p) => ({ p, g: generoDe(p) })));
  const adjs = b.adj.concat(C.adj);
  const temas = b.temas.concat(claves.filter((c) => !c.includes(' ')));
  const out = [];
  for (const n of nombres) {
    out.push(`${articulo(n)} ${n.p} ${adjetivo(elegir(r, adjs), n.g)}`);
    out.push(`${articulo(n)} ${n.p} ${adjetivo(elegir(r, adjs), n.g)}`);
    out.push(`${articulo(n)} ${n.p} de ${elegir(r, C.lugares)}`);
    out.push(`${elegir(r, b.giro)} ${articulo(n)} ${n.p}`);
    if (r() < 0.35) out.push(`${n.g === 'f' ? 'Doña' : 'Don'} ${n.p}`);
    if (r() < 0.3) out.push(`Mi ${n.p} ${adjetivo(elegir(r, adjs), n.g)}`);
  }
  for (let i = 0; i < temas.length; i++) {
    const a = temas[i], c = elegir(r, temas);
    if (a !== c) out.push(`${a} y ${c}`);
    out.push(`Casa ${a}`);
  }
  return out;
}

function estiloCorto(b, C, claves, r) {
  const raices = b.raices.concat(claves.map((c) => paraRevisar(c).replace(/[^a-zñ]/g, '').slice(0, 5)).filter((x) => x.length >= 3));
  const out = [];
  for (const raiz of raices) {
    for (const fin of barajar(r, C.finales).slice(0, 5)) {
      let base = raiz;
      if (/[aeiou]$/.test(base) && /^[aeiouí]/.test(fin)) base = base.slice(0, -1);
      const w = base + fin;
      if (w.length >= 4 && w.length <= 9 && pronunciable(w)) out.push(mayus(w));
    }
  }
  for (const t of b.temas) if (!t.includes(' ') && t.length <= 8) out.push(t);
  for (const c of claves) if (!c.includes(' ') && c.length <= 9) out.push(c);
  return out;
}

function estiloJuego(b, C, claves, r) {
  const out = b.juegos.slice();
  const bases = b.temas.concat(b.sust.map((s) => s.split('|')[0]), claves.filter((c) => !c.includes(' ')));
  for (const a of bases) {
    if (a.includes(' ')) continue;
    const al = paraRevisar(a);
    for (const rem of C.remates) {
      const rl = paraRevisar(rem);
      for (const k of [3, 2]) {
        if (al.length > k + 1 && rl.length > k + 1 && al.endsWith(rl.slice(0, k)) && al !== rl) {
          const w = mayus(al + rem.slice(k).toLowerCase());
          if (w.length <= 12) out.push(w);
          break;
        }
      }
    }
    if (r() < 0.25) {
      const n = sust(a);
      out.push(`${n.g === 'f' ? 'Pura' : 'Puro'} ${a}`);
    }
  }
  return out;
}

function estiloApellido(b, C, A) {
  if (!A) return [];
  return b.apellido.map((p) => p.replace('{A}', A)).concat([`Casa ${A}`, `${A} y Familia`, `El Rincón de ${A}`]);
}

function estiloElegante(b, C, claves, r) {
  const out = [];
  const el = barajar(r, C.elegante);
  const giros = b.giro.filter((g) => !g.includes(' '));
  const objetos = b.sust.map(sust).filter((n) => !n.p.includes(' '));
  for (let i = 0; i < el.length; i++) {
    const e = el[i], e2 = el[(i + 7) % el.length];
    out.push(`${elegir(r, giros)} ${e}`);
    if (i % 2 === 0) out.push(`${e} y ${e2}`);
    if (i % 3 === 0) out.push(`Casa ${e}`);
    if (C.materiales.includes(e)) out.push(`${elegir(r, objetos).p} de ${e}`);
  }
  for (const c of claves) out.push(`${c} ${elegir(r, el)}`);
  return out;
}

// Devuelve [{ nombre, estilo }] sin repetidos y sin los que ya se vieron.
export function generarNombres(bancos, { giro = 'general', claves = '', apellido = '', estilo = 'todos', cantidad = 36, semilla = Date.now(), vistos = new Set() } = {}) {
  const b = bancos.GIROS[giro] || bancos.GIROS.general;
  const C = bancos.COMUN;
  const r = azar(semilla);
  const cl = palabrasClave(claves);
  const A = titulo(String(apellido || '').replace(/[^\p{L}\s'.-]/gu, '').slice(0, 30));
  const filtro = crearFiltro(bancos);
  const fuentes = {
    corto: () => estiloCorto(b, C, cl, r),
    espanol: () => estiloEspanol(b, C, cl, r),
    juego: () => estiloJuego(b, C, cl, r),
    apellido: () => estiloApellido(b, C, A),
    elegante: () => estiloElegante(b, C, cl, r),
  };
  const lista = estilo === 'todos' ? Object.keys(fuentes) : [estilo];
  const porEstilo = {};
  const vistosAhora = new Set();
  for (const e of lista) {
    porEstilo[e] = [];
    for (let nombre of barajar(r, fuentes[e]())) {
      nombre = nombre.replace(/\s+/g, ' ').trim().replace(/ de el /g, ' del ').replace(/ a el /g, ' al ');
      const k = llave(nombre);
      if (!k || vistosAhora.has(k) || vistos.has(k) || nombre.length > 34 || !filtro(nombre)) continue;
      vistosAhora.add(k);
      porEstilo[e].push({ nombre, estilo: e });
    }
  }
  // Reparte en orden: uno de cada estilo, hasta llenar.
  const out = [];
  let quedan = true;
  while (out.length < cantidad && quedan) {
    quedan = false;
    for (const e of lista) {
      const x = porEstilo[e].shift();
      if (x) { out.push(x); quedan = true; if (out.length >= cantidad) break; }
    }
  }
  return out;
}

// ---------- favoritos ----------
function leerFavoritos() { try { const v = JSON.parse(localStorage.getItem(CLAVE) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch (e) { return []; } }
function guardarFavoritos(v) { try { localStorage.setItem(CLAVE, JSON.stringify(v.slice(0, 300))); } catch (e) { /* sin acceso */ } }

function cssPropio() {
  if (document.querySelector('link[data-ah-css-nombres]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/nombres.css', import.meta.url).href;
  l.setAttribute('data-ah-css-nombres', '1');
  document.head.appendChild(l);
}

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const modo = String(opciones.modo || 'general');
  const st = { giro: modo, claves: '', apellido: '', estilo: 'todos' };
  let bancos = null;
  let vistos = new Set();
  let actuales = [];
  let favoritos = leerFavoritos();

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-una ahn', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const selGiro = h('select', { class: 'ah-input' });
  const claves = h('input', { type: 'text', class: 'ah-input', placeholder: t.clavesEjemplo, autocomplete: 'off', maxlength: 120 });
  const apellido = h('input', { type: 'text', class: 'ah-input', placeholder: t.apellidoEjemplo, autocomplete: 'family-name', maxlength: 30 });
  const chips = opcionesChip('estilo', t.estilo, Object.entries(t.estilos), st.estilo, (v) => { st.estilo = v; nuevaTanda(true); });
  const bGenerar = boton(t.generar, () => nuevaTanda(false));
  selGiro.addEventListener('change', () => { st.giro = selGiro.value; nuevaTanda(true); });
  claves.addEventListener('change', () => { st.claves = claves.value; nuevaTanda(true); });
  apellido.addEventListener('change', () => { st.apellido = apellido.value; nuevaTanda(true); });
  for (const el of [claves, apellido]) {
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); st.claves = claves.value; st.apellido = apellido.value; nuevaTanda(true); } });
  }

  const formulario = h('div', { class: 'ah-columna ahn-form' },
    h('div', { class: 'ahn-fila' }, campo(t.giro, selGiro), campo(t.claves, claves, t.clavesAyuda), campo(t.apellido, apellido, t.apellidoAyuda)),
    chips,
    h('div', { class: 'ah-acciones' }, bGenerar));

  const est = estado();
  const nota = h('p', { class: 'ah-nota', text: t.cargando });
  const lista = h('ul', { class: 'ahn-lista', 'aria-live': 'polite' });
  const bCopiarTodas = boton(t.copiarTodas, async () => {
    const ok = await copiar(actuales.map((x) => x.nombre).join('\n'));
    est.decir(ok ? t.copiado : t.noCopiado);
    if (ok) avisar(contenedor, ID, 'copiar');
  }, 'ah-boton ah-boton-2');
  const bBajarTodas = boton(t.bajarTodas, () => bajar(actuales.map((x) => x.nombre), t.archivo), 'ah-boton ah-boton-2');
  const resultados = h('section', { class: 'ah-vista ahn-resultados' },
    h('div', { class: 'ahn-cabeza' }, h('h3', { class: 'ah-titulo-vista', text: t.titulo }),
      h('div', { class: 'ah-acciones' }, bCopiarTodas, bBajarTodas)),
    nota, lista, est);

  const favLista = h('ul', { class: 'ahn-favs' });
  const favVacio = h('p', { class: 'ah-nota', text: t.favoritosVacio });
  const favTitulo = h('h3', { class: 'ah-titulo-vista' });
  const favAcciones = h('div', { class: 'ah-acciones' },
    boton(t.copiarFavoritos, async () => {
      const ok = await copiar(favoritos.join('\n'));
      est.decir(ok ? t.copiado : t.noCopiado);
      if (ok) avisar(contenedor, ID, 'copiar');
    }, 'ah-boton ah-boton-2'),
    boton(t.bajarFavoritos, () => bajar(favoritos, t.archivo + '-favoritos'), 'ah-boton ah-boton-2'),
    boton(t.borrarFavoritos, () => { favoritos = []; guardarFavoritos(favoritos); pintarFavoritos(); pintarLista(); }, 'ah-liga'));
  const favs = h('section', { class: 'ah-vista ahn-favoritos' }, favTitulo, favVacio, favLista, favAcciones);
  raiz.append(formulario, resultados, favs);

  function bajar(nombres, archivo) {
    if (!nombres.length) return;
    const lineas = nombres.map((n) => { const d = dominioDe(n); return d ? `${n} · ${d}.mx · ${d}.com.mx` : n; });
    descargar(new Blob([lineas.join('\r\n') + '\r\n\r\n' + t.pieArchivo + '\r\n'], { type: 'text/plain;charset=utf-8' }), archivo + '.txt');
    avisar(contenedor, ID, 'descargar');
  }

  function esFavorito(n) { return favoritos.includes(n); }
  function alternarFavorito(n) {
    if (esFavorito(n)) favoritos = favoritos.filter((x) => x !== n); else favoritos.unshift(n);
    guardarFavoritos(favoritos);
    pintarFavoritos();
  }

  function fila(n, enFavoritos) {
    const d = dominioDe(n);
    const cal = calificarDominio(d);
    const etiquetaDom = cal === 'corto' ? t.dominioCorto : cal === 'cabe' ? t.dominioCabe : t.dominioLargo;
    const bCopiar = boton(t.copiar, async () => {
      const ok = await copiar(n);
      est.decir(ok ? t.copiado + ' ' + n : t.noCopiado);
      if (ok) avisar(contenedor, ID, 'copiar');
    }, 'ah-liga');
    bCopiar.setAttribute('aria-label', t.copiar + ' ' + n);
    const dom = h('p', { class: 'ahn-dominio' + (cal === 'largo' ? ' ahn-largo' : '') },
      h('span', { text: `${d}.mx · ${d}.com.mx` }), h('span', { class: 'ahn-tag', text: etiquetaDom }));
    if (t.ligaDominio && cal !== 'largo') {
      dom.append(h('a', { class: 'ah-liga ahn-ver', href: t.ligaDominio + (t.ligaDominio.includes('?') ? '&' : '?') + 'dominio=' + encodeURIComponent(d), text: t.verDominio }));
    }
    let bFav;
    if (enFavoritos) {
      bFav = boton(t.quitar, () => { alternarFavorito(n); pintarLista(); }, 'ah-liga');
      bFav.setAttribute('aria-label', t.quitar + ' ' + n);
    } else {
      const fav = esFavorito(n);
      bFav = h('button', { type: 'button', class: 'ahn-fav', 'aria-pressed': String(fav), text: fav ? '★ ' + t.guardado : '☆ ' + t.guardar });
      bFav.setAttribute('aria-label', t.guardar + ' ' + n);
      bFav.addEventListener('click', () => {
        alternarFavorito(n);
        const ya = esFavorito(n);
        bFav.setAttribute('aria-pressed', String(ya));
        bFav.textContent = ya ? '★ ' + t.guardado : '☆ ' + t.guardar;
      });
    }
    return h('li', { class: 'ahn-item' }, h('p', { class: 'ahn-nombre', text: n }), dom, h('div', { class: 'ahn-botones' }, bFav, bCopiar));
  }

  function pintarLista() {
    lista.textContent = '';
    for (const x of actuales) lista.append(fila(x.nombre, false));
    const faltaApellido = st.estilo === 'apellido' && !titulo(st.apellido);
    nota.hidden = !faltaApellido && actuales.length > 0;
    nota.textContent = faltaApellido ? t.sinApellido : bancos ? '' : t.cargando;
    bCopiarTodas.disabled = bBajarTodas.disabled = !actuales.length;
  }

  function pintarFavoritos() {
    favTitulo.textContent = `${t.favoritos} (${favoritos.length})`;
    favLista.textContent = '';
    for (const n of favoritos) favLista.append(fila(n, true));
    favVacio.hidden = favoritos.length > 0;
    favAcciones.hidden = !favoritos.length;
  }

  function nuevaTanda(reiniciar) {
    if (!bancos) return;
    if (reiniciar) vistos = new Set();
    st.claves = claves.value;
    st.apellido = apellido.value;
    let tanda = generarNombres(bancos, { ...st, vistos, semilla: (opciones.semilla || Date.now()) + vistos.size });
    if (tanda.length < 6 && vistos.size) { vistos = new Set(); tanda = generarNombres(bancos, { ...st, vistos, semilla: (opciones.semilla || Date.now()) + 7 }); }
    for (const x of tanda) vistos.add(llave(x.nombre));
    actuales = tanda;
    bGenerar.textContent = t.mas;
    pintarLista();
  }

  pintarFavoritos();
  pintarLista();
  const listo = import('./nombres-bancos.js').then((m) => {
    bancos = m;
    for (const [id, g] of Object.entries(m.GIROS)) selGiro.append(h('option', { value: id, text: g.etiqueta, selected: id === st.giro }));
    if (!m.GIROS[st.giro]) st.giro = 'general';
    selGiro.value = st.giro;
    nuevaTanda(true);
  });
  return { listo, destruir() { contenedor.textContent = ''; } };
}
