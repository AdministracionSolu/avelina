// Herramienta «slogan» de Avelina: slogans por giro y beneficio, con filtro por tono.
// montar(contenedor, { modo: '' | <giro de slogan-plantillas.js>, idioma: 'es-MX', textos })
// Plantillas propias (slogan-plantillas.js, se carga al montar). Sin red. Favoritos en el equipo.

import { h, campo, textos as unirTextos, avisar, copiar, descargar, estado, boton, asegurarEstilos, opcionesChip } from './_comun.js';

const ID = 'slogan';
const CLAVE = 'avelina:slogan:favoritos';

export const TEXTOS = {
  nombre: 'Nombre de tu negocio (opcional)',
  nombreEjemplo: 'Casa Ramírez',
  giro: 'Giro',
  beneficio: 'Lo que más cuidas',
  beneficioAyuda: 'Lo que tus clientes valoran de ti.',
  varios: 'Varios a la vez',
  ciudad: 'Ciudad (opcional)',
  ciudadEjemplo: 'Tepic',
  tono: 'Tono',
  tonos: { todos: 'Todos', cercano: 'Cercano', directo: 'Directo', divertido: 'Divertido', elegante: 'Elegante', tradicional: 'Tradicional' },
  generar: 'Dame slogans',
  mas: 'Otros slogans',
  cargando: 'Preparando slogans…',
  titulo: 'Slogans para tu negocio',
  copiar: 'Copiar',
  copiado: 'Copiado.',
  noCopiado: 'No se pudo copiar. Selecciona el texto y cópialo.',
  guardar: 'Guardar',
  guardado: 'Guardado',
  quitar: 'Quitar',
  copiarTodos: 'Copiar todos',
  bajar: 'Bajar lista',
  favoritos: 'Tus favoritos',
  favoritosVacio: 'Toca «Guardar» en los que te gusten. Se quedan en este equipo.',
  copiarFavoritos: 'Copiar favoritos',
  bajarFavoritos: 'Bajar favoritos',
  borrarFavoritos: 'Borrar favoritos',
  archivo: 'slogans-para-tu-negocio',
  pieArchivo: 'Hecho con Avelina · avelina.com.mx',
};

const sinAcentos = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const llave = (s) => sinAcentos(s).toLowerCase().replace(/[^a-z0-9ñ]+/g, ' ').trim();
const mayus = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const limpio = (s, max) => String(s || '').replace(/\s+/g, ' ').replace(/[{}<>]/g, '').trim().slice(0, max);

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
function barajar(r, lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Rellena una plantilla. Devuelve null si le falta un dato o queda repetitiva.
const COMUNES = new Set(['para', 'como', 'todo', 'todos', 'aquí', 'pero', 'tus', 'con']);
function rellenar(pl, g, b, nombre, ciudad, bid) {
  const barra = pl.indexOf('|');
  if (barra > 0) {
    if (!pl.slice(0, barra).split(',').includes(bid)) return null;
    pl = pl.slice(barra + 1);
  }
  if (pl.includes('{N}') && !nombre) return null;
  if (pl.includes('{C}') && !ciudad) return null;
  const [lugar, gen] = g.lugar;
  const v = {
    N: nombre, C: ciudad, cosa: g.cosa, arte: g.arte, lugar, Lugar: mayus(lugar), fav: gen === 'f' ? 'favorita' : 'favorito',
  };
  for (const k of ['sust', 'art', 'frase', 'tu', 'verbo', 'mas', 'menos', 'adj', 'pregunta']) {
    v[k] = b[k];
    v[mayus(k)] = b[k] && mayus(b[k]);
  }
  let falta = false;
  let s = pl.replace(/\{(\w+)\}/g, (_, k) => { if (!v[k]) falta = true; return v[k] || ''; });
  if (falta) return null;
  s = mayus(s.replace(/\s+/g, ' ').trim());
  // Que no repita palabras de peso (siempre, casa…) ni deje «a el».
  const palabras = llave(s).split(' ').filter((w) => w.length > 3 && !COMUNES.has(w));
  if (new Set(palabras).size !== palabras.length) return null;
  return s.replace(/ a el /g, ' al ').replace(/ de el /g, ' del ');
}

// Devuelve [{ texto, tono }] sin repetidos.
export function generarSlogans(P, { giro = 'general', beneficio = 'varios', nombre = '', ciudad = '', tono = 'todos', cantidad = 30, semilla = Date.now(), vistos = new Set() } = {}) {
  const g = P.GIROS[giro] || P.GIROS.general;
  const r = azar(semilla);
  const N = limpio(nombre, 40), C = limpio(ciudad, 30);
  const bens = beneficio !== 'varios' && P.BENEFICIOS[beneficio] ? [beneficio] : barajar(r, g.beneficios).slice(0, 3);
  const tonos = tono === 'todos' ? Object.keys(P.PLANTILLAS) : [tono];
  const porTono = {};
  const ya = new Set();
  for (const tn of tonos) {
    const cand = [];
    for (const s of g.propios[tn] || []) cand.push(s);
    for (const pl of P.PLANTILLAS[tn]) {
      if (!g.comida && P.SOLO_COMIDA.has(pl)) continue;
      for (const bid of bens) { const s = rellenar(pl, g, P.BENEFICIOS[bid], N, C, bid); if (s) cand.push(s); }
    }
    porTono[tn] = [];
    for (const s of barajar(r, cand)) {
      const k = llave(s);
      if (ya.has(k) || vistos.has(k)) continue;
      ya.add(k);
      porTono[tn].push({ texto: s, tono: tn });
    }
  }
  const out = [];
  let quedan = true;
  while (out.length < cantidad && quedan) {
    quedan = false;
    for (const tn of tonos) {
      const x = porTono[tn].shift();
      if (x) { out.push(x); quedan = true; if (out.length >= cantidad) break; }
    }
  }
  return out;
}

function leerFavoritos() { try { const v = JSON.parse(localStorage.getItem(CLAVE) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch (e) { return []; } }
function guardarFavoritos(v) { try { localStorage.setItem(CLAVE, JSON.stringify(v.slice(0, 300))); } catch (e) { /* sin acceso */ } }

function cssPropio() {
  if (document.querySelector('link[data-ah-css-slogan]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/slogan.css', import.meta.url).href;
  l.setAttribute('data-ah-css-slogan', '1');
  document.head.appendChild(l);
}

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const st = { giro: String(opciones.modo || 'general'), beneficio: 'varios', nombre: '', ciudad: '', tono: 'todos' };
  let P = null;
  let vistos = new Set();
  let actuales = [];
  let favoritos = leerFavoritos();

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-una ahs', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const nombre = h('input', { type: 'text', class: 'ah-input', placeholder: t.nombreEjemplo, autocomplete: 'organization', maxlength: 40 });
  const selGiro = h('select', { class: 'ah-input' });
  const selBen = h('select', { class: 'ah-input' });
  const ciudad = h('input', { type: 'text', class: 'ah-input', placeholder: t.ciudadEjemplo, autocomplete: 'address-level2', maxlength: 30 });
  const chips = opcionesChip('tono', t.tono, Object.entries(t.tonos), st.tono, (v) => { st.tono = v; tanda(true); });
  const bGenerar = boton(t.generar, () => tanda(false));
  selGiro.addEventListener('change', () => { st.giro = selGiro.value; llenarBeneficios(); tanda(true); });
  selBen.addEventListener('change', () => { st.beneficio = selBen.value; tanda(true); });
  for (const el of [nombre, ciudad]) {
    el.addEventListener('change', () => tanda(true));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); tanda(true); } });
  }

  raiz.append(h('div', { class: 'ah-columna' },
    h('div', { class: 'ahs-fila' }, campo(t.nombre, nombre), campo(t.giro, selGiro), campo(t.beneficio, selBen, t.beneficioAyuda), campo(t.ciudad, ciudad)),
    chips, h('div', { class: 'ah-acciones' }, bGenerar)));

  const est = estado();
  const nota = h('p', { class: 'ah-nota', text: t.cargando });
  const lista = h('ul', { class: 'ahs-lista', 'aria-live': 'polite' });
  const bCopiarTodos = boton(t.copiarTodos, () => copiarTexto(actuales.map((x) => x.texto).join('\n')), 'ah-boton ah-boton-2');
  const bBajar = boton(t.bajar, () => bajar(actuales.map((x) => x.texto), t.archivo), 'ah-boton ah-boton-2');
  raiz.append(h('section', { class: 'ah-vista ahs-resultados' },
    h('div', { class: 'ahs-cabeza' }, h('h3', { class: 'ah-titulo-vista', text: t.titulo }), h('div', { class: 'ah-acciones' }, bCopiarTodos, bBajar)),
    nota, lista, est));

  const favTitulo = h('h3', { class: 'ah-titulo-vista' });
  const favVacio = h('p', { class: 'ah-nota', text: t.favoritosVacio });
  const favLista = h('ul', { class: 'ahs-lista' });
  const favAcciones = h('div', { class: 'ah-acciones' },
    boton(t.copiarFavoritos, () => copiarTexto(favoritos.join('\n')), 'ah-boton ah-boton-2'),
    boton(t.bajarFavoritos, () => bajar(favoritos, t.archivo + '-favoritos'), 'ah-boton ah-boton-2'),
    boton(t.borrarFavoritos, () => { favoritos = []; guardarFavoritos(favoritos); pintarFavoritos(); pintarLista(); }, 'ah-liga'));
  raiz.append(h('section', { class: 'ah-vista ahs-favoritos' }, favTitulo, favVacio, favLista, favAcciones));

  async function copiarTexto(s, aviso) {
    if (!s) return;
    const ok = await copiar(s);
    est.decir(ok ? (aviso || t.copiado) : t.noCopiado);
    if (ok) avisar(contenedor, ID, 'copiar');
  }
  function bajar(lineas, archivo) {
    if (!lineas.length) return;
    descargar(new Blob([lineas.join('\r\n') + '\r\n\r\n' + t.pieArchivo + '\r\n'], { type: 'text/plain;charset=utf-8' }), archivo + '.txt');
    avisar(contenedor, ID, 'descargar');
  }
  function alternar(s) {
    if (favoritos.includes(s)) favoritos = favoritos.filter((x) => x !== s); else favoritos.unshift(s);
    guardarFavoritos(favoritos);
    pintarFavoritos();
  }
  function fila(s, enFav, tono) {
    const bCopiar = boton(t.copiar, () => copiarTexto(s, t.copiado + ' ' + s), 'ah-liga');
    bCopiar.setAttribute('aria-label', t.copiar + ': ' + s);
    let bFav;
    if (enFav) {
      bFav = boton(t.quitar, () => { alternar(s); pintarLista(); }, 'ah-liga');
      bFav.setAttribute('aria-label', t.quitar + ': ' + s);
    } else {
      const ya = favoritos.includes(s);
      bFav = h('button', { type: 'button', class: 'ahs-fav', 'aria-pressed': String(ya), text: ya ? '★ ' + t.guardado : '☆ ' + t.guardar });
      bFav.setAttribute('aria-label', t.guardar + ': ' + s);
      bFav.addEventListener('click', () => {
        alternar(s);
        const si = favoritos.includes(s);
        bFav.setAttribute('aria-pressed', String(si));
        bFav.textContent = si ? '★ ' + t.guardado : '☆ ' + t.guardar;
      });
    }
    return h('li', { class: 'ahs-item' }, h('p', { class: 'ahs-texto', text: s }),
      h('div', { class: 'ahs-pie' }, tono ? h('span', { class: 'ahs-tono', text: t.tonos[tono] || tono }) : null, h('div', { class: 'ahs-botones' }, bFav, bCopiar)));
  }
  function pintarLista() {
    lista.textContent = '';
    for (const x of actuales) lista.append(fila(x.texto, false, x.tono));
    nota.hidden = !!actuales.length;
    bCopiarTodos.disabled = bBajar.disabled = !actuales.length;
  }
  function pintarFavoritos() {
    favTitulo.textContent = `${t.favoritos} (${favoritos.length})`;
    favLista.textContent = '';
    for (const s of favoritos) favLista.append(fila(s, true));
    favVacio.hidden = favoritos.length > 0;
    favAcciones.hidden = !favoritos.length;
  }
  function llenarBeneficios() {
    const g = P.GIROS[st.giro] || P.GIROS.general;
    selBen.textContent = '';
    selBen.append(h('option', { value: 'varios', text: t.varios }));
    for (const id of g.beneficios) selBen.append(h('option', { value: id, text: P.BENEFICIOS[id].etiqueta }));
    st.beneficio = 'varios';
  }
  function tanda(reiniciar) {
    if (!P) return;
    if (reiniciar) vistos = new Set();
    const base = { ...st, nombre: nombre.value, ciudad: ciudad.value };
    const semilla = (opciones.semilla || Date.now()) + vistos.size;
    let l = generarSlogans(P, { ...base, vistos, semilla });
    if (l.length < 6 && vistos.size) { vistos = new Set(); l = generarSlogans(P, { ...base, vistos, semilla: semilla + 3 }); }
    for (const x of l) vistos.add(llave(x.texto));
    actuales = l;
    bGenerar.textContent = t.mas;
    pintarLista();
  }

  pintarFavoritos();
  pintarLista();
  const listo = import('./slogan-plantillas.js').then((m) => {
    P = m;
    if (!P.GIROS[st.giro]) st.giro = 'general';
    for (const [id, g] of Object.entries(P.GIROS)) selGiro.append(h('option', { value: id, text: g.etiqueta, selected: id === st.giro }));
    selGiro.value = st.giro;
    llenarBeneficios();
    tanda(true);
  });
  return { listo, destruir() { contenedor.textContent = ''; } };
}
