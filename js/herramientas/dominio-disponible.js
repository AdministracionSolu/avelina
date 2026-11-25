// Herramienta «dominio-disponible» de Avelina: busca si un dominio está libre.
// montar(contenedor, { modo: '', idioma: 'es-MX', textos })
// Única herramienta con red: consulta desde el navegador el registro público (RDAP) cuando la extensión lo tiene
// y, si no (.mx y .com.mx), los servidores del dominio por DNS sobre HTTPS. No hay servidor de Avelina ni se guarda nada.
// Acepta ?dominio=… en la dirección para llegar con la búsqueda hecha.

import { h, campo, textos as unirTextos, avisar, copiar, estado, boton, asegurarEstilos } from './_comun.js';

const ID = 'dominio-disponible';

export const TEXTOS = {
  nombre: 'Nombre que quieres',
  nombreEjemplo: 'pollosramirez',
  nombreAyuda: 'Sin espacios. Puedes escribirlo con su terminación, como pollosramirez.mx.',
  terminaciones: 'Terminaciones',
  buscar: 'Buscar',
  buscando: 'Buscando…',
  invalido: 'Usa sólo letras, números y guiones, sin espacios. No puede empezar ni terminar con guion.',
  ajustado: 'Lo escribimos sin acentos, sin ñ y sin espacios',
  resultados: 'Resultados',
  estados: { libre: 'Libre', probable: 'Probablemente libre', ocupado: 'Ocupado', error: 'No se pudo revisar' },
  explica: {
    libre: 'El registro público dice que nadie lo tiene.',
    probable: 'No tiene servidores. Confirma al comprarlo, puede estar apartado.',
    ocupado: 'Ya tiene dueño.',
    error: 'Revisa tu conexión e intenta de nuevo.',
  },
  desde: 'Registrado desde',
  vence: 'vence',
  copiar: 'Copiar',
  copiado: 'Copiado.',
  noCopiado: 'No se pudo copiar.',
  variantes: 'Otras opciones parecidas',
  variantesNota: 'Revisamos variantes en .com.mx y .mx.',
  privado: 'La consulta va directo de tu navegador al registro público. No guardamos lo que buscas.',
  cierre: 'Si haces tu página con Avelina, el dominio ya viene incluido.',
};

export const TERMINACIONES = ['.com.mx', '.mx', '.com', '.net', '.org', '.shop', '.store', '.online'];
const PREDETERMINADAS = ['.com.mx', '.mx', '.com'];

// Registro público (RDAP) por terminación. Todos permiten consultas desde el navegador.
export const RDAP = {
  com: 'https://rdap.verisign.com/com/v1/',
  net: 'https://rdap.verisign.com/net/v1/',
  org: 'https://rdap.publicinterestregistry.org/rdap/',
  shop: 'https://rdap.gmoregistry.net/rdap/',
  store: 'https://rdap.radix.host/rdap/',
  online: 'https://rdap.radix.host/rdap/',
};
const DOH = ['https://cloudflare-dns.com/dns-query', 'https://dns.google/resolve'];

// ---------- nombre ----------
// Devuelve { base, terminacion, ajustado, valido }.
export function normalizar(entrada) {
  let s = String(entrada || '').trim().toLowerCase();
  s = s.replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[/?#]/)[0];
  let terminacion = '';
  for (const t of TERMINACIONES) if (s.endsWith(t) && s.length > t.length) { terminacion = t; s = s.slice(0, -t.length); break; }
  if (!terminacion) {
    const m = s.match(/^(.+)(\.[a-z]{2,})$/);
    if (m && !m[1].includes('.')) { terminacion = m[2]; s = m[1]; }
  }
  const antes = s;
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'y').replace(/[\s_.]+/g, '').replace(/[^a-z0-9-]/g, '');
  const valido = s.length >= 1 && s.length <= 63 && !/^-|-$/.test(s) && !/^..--/.test(s);
  return { base: s, terminacion, ajustado: antes !== s, valido };
}

export function variantes(base) {
  const v = [`mi${base}`, `${base}mx`, `${base}oficial`, `somos${base}`];
  if (base.length > 8 && !base.includes('-')) v.push(base.slice(0, 4) + '-' + base.slice(4));
  return v.filter((x) => x.length <= 63);
}

// ---------- consultas ----------
async function conTiempo(url, opc = {}, ms = 9000) {
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const t = ctl ? setTimeout(() => ctl.abort(), ms) : 0;
  try { return await fetch(url, Object.assign({ signal: ctl && ctl.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' }, opc)); }
  finally { clearTimeout(t); }
}

async function porRdap(dominio, base) {
  const r = await conTiempo(base + 'domain/' + encodeURIComponent(dominio), { headers: { accept: 'application/rdap+json, application/json' } });
  if (r.status === 404) return { estado: 'libre', fuente: 'rdap' };
  if (r.ok) {
    let j = {};
    try { j = await r.json(); } catch (e) { j = {}; }
    const ev = (n) => ((j.events || []).find((e) => e.eventAction === n) || {}).eventDate || '';
    return { estado: 'ocupado', fuente: 'rdap', alta: ev('registration'), vence: ev('expiration') };
  }
  throw new Error('rdap ' + r.status);
}

async function dns(nombre, tipo) {
  let ultimo;
  for (const u of DOH) {
    try {
      const r = await conTiempo(`${u}?name=${encodeURIComponent(nombre)}&type=${tipo}`, { headers: { accept: 'application/dns-json' } });
      if (r.ok) return await r.json();
      ultimo = new Error('dns ' + r.status);
    } catch (e) { ultimo = e; }
  }
  throw ultimo || new Error('dns');
}

// Sin registro público usable: si el dominio no existe en DNS (NXDOMAIN) es probable que esté libre.
async function porDns(dominio) {
  const ns = await dns(dominio, 'NS');
  if (ns.Status === 3) return { estado: 'probable', fuente: 'dns' };
  if (ns.Status === 0) {
    if ((ns.Answer || []).some((a) => a.type === 2)) return { estado: 'ocupado', fuente: 'dns' };
    const soa = await dns(dominio, 'SOA');
    if (soa.Status === 3) return { estado: 'probable', fuente: 'dns' };
    return { estado: 'ocupado', fuente: 'dns' };
  }
  throw new Error('dns status ' + ns.Status);
}

export async function consultar(dominio) {
  const tld = dominio.split('.').pop();
  const base = RDAP[tld];
  if (base && !/\.com\.mx$/.test(dominio)) {
    try { return await porRdap(dominio, base); } catch (e) { /* sigue por DNS */ }
  }
  try { return await porDns(dominio); } catch (e) { return { estado: 'error' }; }
}

// Corre varias consultas con un límite para no saturar.
async function enParalelo(lista, fn, n = 4) {
  const out = new Array(lista.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, lista.length) }, async () => {
    while (i < lista.length) { const k = i++; out[k] = await fn(lista[k], k); }
  }));
  return out;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fechaCorta(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function cssPropio() {
  if (document.querySelector('link[data-ah-css-dominio-disponible]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/dominio-disponible.css', import.meta.url).href;
  l.setAttribute('data-ah-css-dominio-disponible', '1');
  document.head.appendChild(l);
}

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const elegidas = new Set(PREDETERMINADAS);

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-una add', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const entrada = h('input', { type: 'text', class: 'ah-input add-entrada', placeholder: t.nombreEjemplo, autocomplete: 'off', autocapitalize: 'none', spellcheck: false, inputmode: 'url', maxlength: 90 });
  const bBuscar = boton(t.buscar, () => buscar());
  const form = h('form', { class: 'add-form', role: 'search', onsubmit: (e) => { e.preventDefault(); buscar(); } },
    h('div', { class: 'add-busca' }, campo(t.nombre, entrada, t.nombreAyuda), bBuscar));
  bBuscar.type = 'submit';
  const fs = h('fieldset', { class: 'ah-chips add-tlds' }, h('legend', { class: 'ah-etiqueta', text: t.terminaciones }));
  for (const tl of TERMINACIONES) {
    const c = h('input', { type: 'checkbox', checked: elegidas.has(tl), class: 'ah-chip-radio' });
    c.addEventListener('change', () => { if (c.checked) elegidas.add(tl); else elegidas.delete(tl); });
    fs.append(h('label', { class: 'ah-chip' }, c, h('span', { text: tl })));
  }
  const aviso = h('p', { class: 'ah-nota', hidden: true });
  const error = h('p', { class: 'ah-error', hidden: true });
  const est = estado();
  const lista = h('ul', { class: 'add-lista', 'aria-live': 'polite' });
  const listaVar = h('ul', { class: 'add-lista' });
  const bloqueVar = h('div', { class: 'add-variantes', hidden: true },
    h('h3', { class: 'ah-titulo-vista', text: t.variantes }), h('p', { class: 'ah-nota', text: t.variantesNota }), listaVar);
  const salida = h('section', { class: 'ah-vista add-salida', hidden: true },
    h('h3', { class: 'ah-titulo-vista', text: t.resultados }), lista, bloqueVar, est,
    h('p', { class: 'add-cierre', text: t.cierre }));
  raiz.append(h('div', { class: 'ah-columna' }, form, fs, aviso, error, h('p', { class: 'ah-nota', text: t.privado })), salida);

  function fila(dominio) {
    const tag = h('span', { class: 'add-estado', text: t.buscando });
    const det = h('span', { class: 'add-detalle' });
    const li = h('li', { class: 'add-item add-pendiente' }, h('span', { class: 'add-dominio', text: dominio }), tag, det);
    li.poner = (r) => {
      li.className = 'add-item add-' + r.estado;
      li.dataset.estado = r.estado;
      tag.textContent = t.estados[r.estado];
      det.textContent = r.estado === 'ocupado' && r.alta
        ? `${t.desde} ${fechaCorta(r.alta)}${r.vence ? ', ' + t.vence + ' ' + fechaCorta(r.vence) : ''}.`
        : t.explica[r.estado];
      if (r.estado === 'libre' || r.estado === 'probable') {
        const b = boton(t.copiar, async () => {
          const ok = await copiar(dominio);
          est.decir(ok ? t.copiado + ' ' + dominio : t.noCopiado);
          if (ok) avisar(contenedor, ID, 'copiar');
        }, 'ah-liga');
        b.setAttribute('aria-label', t.copiar + ' ' + dominio);
        li.append(b);
      }
    };
    return li;
  }

  let turno = 0;
  async function buscar(valor) {
    if (valor != null) entrada.value = valor;
    const n = normalizar(entrada.value);
    error.hidden = n.valido;
    error.textContent = n.valido ? '' : t.invalido;
    entrada.setAttribute('aria-invalid', String(!n.valido));
    if (!n.valido) return;
    if (n.terminacion && TERMINACIONES.includes(n.terminacion)) {
      elegidas.add(n.terminacion);
      for (const l of fs.querySelectorAll('label')) if (l.textContent === n.terminacion) l.querySelector('input').checked = true;
    }
    aviso.hidden = !n.ajustado;
    aviso.textContent = n.ajustado ? `${t.ajustado}: ${n.base}` : '';
    const tlds = TERMINACIONES.filter((x) => elegidas.has(x));
    if (n.terminacion && !TERMINACIONES.includes(n.terminacion)) tlds.unshift(n.terminacion);
    if (!tlds.length) tlds.push('.com.mx');
    const mio = ++turno;
    salida.hidden = false;
    lista.textContent = '';
    listaVar.textContent = '';
    bloqueVar.hidden = true;
    bBuscar.disabled = true;
    const doms = tlds.map((x) => n.base + x);
    const filas = doms.map(fila);
    lista.append(...filas);
    const res = await enParalelo(doms, async (d, k) => { const r = await consultar(d); if (mio === turno) filas[k].poner(r); return r; });
    if (mio !== turno) return;
    bBuscar.disabled = false;
    avisar(contenedor, ID, 'consultar');
    if (res.some((r) => r.estado === 'ocupado')) {
      const vd = [];
      for (const v of variantes(n.base)) for (const tl of ['.com.mx', '.mx']) vd.push(v + tl);
      const fv = vd.map(fila);
      listaVar.append(...fv);
      bloqueVar.hidden = false;
      await enParalelo(vd, async (d, k) => { const r = await consultar(d); if (mio === turno) fv[k].poner(r); return r; });
    }
  }

  let inicial = '';
  try { inicial = new URLSearchParams(location.search).get('dominio') || ''; } catch (e) { inicial = ''; }
  if (inicial) buscar(inicial.slice(0, 90));
  return { destruir() { turno++; contenedor.textContent = ''; }, buscar };
}
