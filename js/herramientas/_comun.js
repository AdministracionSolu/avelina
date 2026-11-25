// Piezas comunes de las herramientas gratis de Avelina.
// Todo corre en el navegador: ninguna función de aquí hace peticiones de red.

export const PIE = 'Hecho con Avelina · avelina.com.mx';

// Carga css/herramientas.css una sola vez si la página no lo trae.
export function asegurarEstilos() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[data-ah-css], link[href*="herramientas.css"]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas.css', import.meta.url).href;
  l.dataset.ahCss = '1';
  document.head.appendChild(l);
}

// Crea un elemento: h('div', {class: 'x', onclick: fn}, hijo1, 'texto', ...)
export function h(etiqueta, attrs, ...hijos) {
  const el = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'value') { el.value = v; if (etiqueta === 'input') el.setAttribute('value', v); }
    else if (k in el && k !== 'list' && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of hijos.flat()) if (c != null && c !== false) el.append(c);
  return el;
}

let cuenta = 0;
export const idUnico = (base) => `ah-${base}-${++cuenta}`;

// Campo con etiqueta visible. tipo: 'text' | 'textarea' | 'select' | 'color' | ...
export function campo(etiqueta, control, ayuda) {
  const id = control.id || (control.id = idUnico('c'));
  const kids = [h('label', { for: id, class: 'ah-etiqueta', text: etiqueta }), control];
  if (ayuda) {
    const a = h('p', { class: 'ah-ayuda', id: id + '-a', text: ayuda });
    control.setAttribute('aria-describedby', a.id);
    kids.push(a);
  }
  return h('div', { class: 'ah-campo' }, kids);
}

export function textos(defecto, opciones) {
  return Object.assign({}, defecto, (opciones && opciones.textos) || {});
}

export function avisar(contenedor, herramienta, accion) {
  contenedor.dispatchEvent(new CustomEvent('avelina:resultado', {
    bubbles: true, detail: { herramienta, accion },
  }));
}

export function descargar(blob, nombre) {
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: nombre, hidden: true });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (e) {
    const t = h('textarea', { value: texto, readonly: true, style: 'position:fixed;opacity:0;top:0;left:0' });
    document.body.appendChild(t);
    t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    t.remove();
    return ok;
  }
}

// Línea de estado para lectores de pantalla y para la vista.
export function estado() {
  const el = h('p', { class: 'ah-estado', role: 'status', 'aria-live': 'polite' });
  let t;
  el.decir = (msg, ms = 2600) => {
    el.textContent = msg;
    clearTimeout(t);
    if (ms) t = setTimeout(() => { el.textContent = ''; }, ms);
  };
  return el;
}

export function lienzoABlob(canvas) {
  return new Promise((ok) => canvas.toBlob(ok, 'image/png'));
}

export function leerImagen(archivo) {
  return new Promise((ok, mal) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => ok({ img, url: fr.result });
      img.onerror = mal;
      img.src = fr.result;
    };
    fr.onerror = mal;
    fr.readAsDataURL(archivo);
  });
}

// Escribe el pie gris en un lienzo, centrado, en la franja de abajo.
export function pintarPie(ctx, ancho, y, tam) {
  ctx.save();
  ctx.fillStyle = '#8c8c8c';
  ctx.font = `${tam}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(PIE, ancho / 2, y);
  ctx.restore();
}

// ---------- color ----------
export function hexARgb(hex) {
  let s = String(hex).trim().replace(/^#/, '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(s)) return null;
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbAHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function canalLineal(v) {
  v /= 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function luminancia(rgb) {
  return 0.2126 * canalLineal(rgb[0]) + 0.7152 * canalLineal(rgb[1]) + 0.0722 * canalLineal(rgb[2]);
}

export function contraste(hexA, hexB) {
  const a = luminancia(hexARgb(hexA) || [0, 0, 0]);
  const b = luminancia(hexARgb(hexB) || [255, 255, 255]);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function normalizarHex(v) {
  const rgb = hexARgb(v);
  return rgb ? rgbAHex(...rgb) : null;
}

// Selector de color: muestra + campo HEX que se sincronizan.
export function selectorColor(etiqueta, valor, alCambiar) {
  const id = idUnico('color');
  const muestra = h('input', { type: 'color', value: valor.toLowerCase(), 'aria-label': etiqueta + ' (muestra)', class: 'ah-color-muestra' });
  const texto = h('input', { type: 'text', id, value: valor.toUpperCase(), class: 'ah-input ah-color-hex', maxlength: 7, spellcheck: false, autocomplete: 'off', inputmode: 'text' });
  muestra.addEventListener('input', () => { texto.value = muestra.value.toUpperCase(); alCambiar(texto.value); });
  texto.addEventListener('input', () => {
    const n = normalizarHex(texto.value);
    texto.setAttribute('aria-invalid', n ? 'false' : 'true');
    if (n) { muestra.value = n.toLowerCase(); alCambiar(n); }
  });
  const caja = h('div', { class: 'ah-campo' },
    h('label', { for: id, class: 'ah-etiqueta', text: etiqueta }),
    h('div', { class: 'ah-color' }, muestra, texto));
  caja.fijar = (v) => { const n = normalizarHex(v); if (n) { texto.value = n; muestra.value = n.toLowerCase(); } };
  return caja;
}

// Fila de opciones tipo «chips» con radios reales (teclado y lector de pantalla).
export function opcionesChip(nombreGrupo, etiqueta, lista, valor, alCambiar) {
  const nombre = idUnico(nombreGrupo);
  const caja = h('fieldset', { class: 'ah-chips' }, h('legend', { class: 'ah-etiqueta', text: etiqueta }));
  for (const [v, txt] of lista) {
    const r = h('input', { type: 'radio', name: nombre, value: v, checked: v === valor, class: 'ah-chip-radio' });
    r.addEventListener('change', () => r.checked && alCambiar(v));
    caja.append(h('label', { class: 'ah-chip' }, r, h('span', { text: txt })));
  }
  caja.fijar = (v) => { for (const r of caja.querySelectorAll('input')) r.checked = r.value === v; };
  return caja;
}

// ---------- WhatsApp ----------
// Deja sólo dígitos. Con lada 52 acepta 10 dígitos, +52, 52 o 521 al frente.
export function numeroWhatsApp(lada, numero) {
  const l = String(lada || '52').replace(/\D/g, '') || '52';
  let n = String(numero || '').replace(/\D/g, '');
  if (n.startsWith('00')) n = n.slice(2);
  if (l === '52') {
    if (n.length === 13 && n.startsWith('521')) n = n.slice(3);
    else if (n.length === 12 && n.startsWith('52')) n = n.slice(2);
    else if (n.length === 11 && n.startsWith('1')) n = n.slice(1);
    return { valido: n.length === 10, completo: '52' + n, local: n };
  }
  if (n.startsWith(l) && n.length > l.length + 6) n = n.slice(l.length);
  return { valido: n.length >= 6 && n.length + l.length <= 15, completo: l + n, local: n };
}

export function ligaWhatsApp(completo, mensaje) {
  const m = String(mensaje || '').trim();
  return 'https://wa.me/' + completo + (m ? '?text=' + encodeURIComponent(m) : '');
}

export function boton(texto, onclick, clase = 'ah-boton') {
  return h('button', { type: 'button', class: clase, onclick, text: texto });
}

export function nombreArchivo(base) {
  const s = String(base || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return s || 'archivo';
}
