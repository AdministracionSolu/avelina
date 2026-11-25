// Herramienta «lector-qr» de Avelina: lee códigos QR con la cámara o desde una foto.
// montar(contenedor, { modo: 'camara' | 'lector' | 'wifi', idioma: 'es-MX', textos })
// Usa el lector del navegador cuando existe; si no, js/vendor/jsQR.min.js (Apache-2.0), que se carga sólo si hace falta.
// Nada sale del equipo y nunca abre una liga solo: la muestra con un botón.

import { h, textos as unirTextos, avisar, copiar, descargar, estado, boton, asegurarEstilos, leerImagen } from './_comun.js';

const ID = 'lector-qr';

export const TEXTOS = {
  tituloCamara: 'Apunta la cámara al código',
  tituloWifi: 'Lee el QR de una red wifi',
  abrirCamara: 'Abrir cámara',
  detener: 'Detener cámara',
  subir: 'Subir foto del código',
  arrastra: 'También puedes arrastrar la foto aquí o pegarla con Ctrl + V.',
  buscando: 'Buscando un código…',
  sinCamara: 'No pudimos abrir la cámara. Revisa el permiso del navegador o sube una foto del código.',
  sinCamaraEquipo: 'Este equipo no tiene cámara disponible. Sube una foto del código.',
  noLeido: 'No encontramos un código en la foto. Prueba con una foto más cerca, derecha y con buena luz.',
  leyendo: 'Leyendo la foto…',
  privado: 'La imagen no sale de tu equipo.',
  resultado: 'Lo que dice el código',
  tipos: { liga: 'Liga', whatsapp: 'Liga de WhatsApp', wifi: 'Red wifi', telefono: 'Teléfono', correo: 'Correo', sms: 'Mensaje SMS', contacto: 'Contacto', ubicacion: 'Ubicación', texto: 'Texto' },
  abrirLiga: 'Abrir liga',
  abrirWhatsApp: 'Abrir en WhatsApp',
  revisaLiga: 'Revisa que la dirección sea la que esperas antes de abrirla.',
  sitio: 'Sitio',
  red: 'Nombre de la red',
  clave: 'Contraseña',
  seguridad: 'Seguridad',
  sinClave: 'Sin contraseña',
  oculta: 'Red oculta',
  si: 'Sí',
  copiarClave: 'Copiar contraseña',
  copiarRed: 'Copiar nombre',
  conectar: 'Para conectarte, busca la red en el wifi de tu equipo y pega la contraseña.',
  noEsWifi: 'Este código no es de una red wifi. Esto es lo que dice.',
  numero: 'Número',
  llamar: 'Llamar',
  para: 'Para',
  asunto: 'Asunto',
  mensaje: 'Mensaje',
  escribir: 'Escribir correo',
  mandarSms: 'Mandar mensaje',
  nombre: 'Nombre',
  empresa: 'Empresa',
  telefono: 'Teléfono',
  correoC: 'Correo',
  pagina: 'Página',
  bajarContacto: 'Guardar contacto (.vcf)',
  coordenadas: 'Coordenadas',
  verMapa: 'Ver en el mapa',
  copiar: 'Copiar',
  copiarTodo: 'Copiar todo',
  copiado: 'Copiado.',
  noCopiado: 'No se pudo copiar. Selecciona el texto y cópialo.',
  otro: 'Leer otro código',
};

// ---------- interpretar el contenido ----------
// Separa «CLAVE:valor;» respetando las barras invertidas de escape (formato WIFI y MECARD).
function camposConEscape(cuerpo) {
  const out = {};
  let k = '', v = '', enValor = false;
  for (let i = 0; i < cuerpo.length; i++) {
    const ch = cuerpo[i];
    if (ch === '\\' && i + 1 < cuerpo.length) { if (enValor) v += cuerpo[++i]; else k += cuerpo[++i]; continue; }
    if (!enValor && ch === ':') { enValor = true; continue; }
    if (ch === ';') {
      if (k) { const kk = k.trim().toUpperCase(); if (kk in out) out[kk] += '\n' + v; else out[kk] = v; }
      k = ''; v = ''; enValor = false; continue;
    }
    if (enValor) v += ch; else k += ch;
  }
  if (k) out[k.trim().toUpperCase()] = v;
  return out;
}

export function interpretar(texto) {
  const s = String(texto ?? '');
  const t = s.trim();
  if (/^WIFI:/i.test(t)) {
    const c = camposConEscape(t.slice(5));
    const tipo = (c.T || '').toUpperCase();
    return { tipo: 'wifi', red: c.S || '', clave: c.P || '', seguridad: tipo === 'NOPASS' || (!tipo && !c.P) ? '' : tipo === 'WEP' ? 'WEP' : tipo === 'SAE' ? 'WPA3' : 'WPA/WPA2', oculta: /^true$/i.test(c.H || ''), crudo: s };
  }
  if (/^(https?:\/\/)/i.test(t)) {
    let host = '';
    try { host = new URL(t).hostname; } catch (e) { host = ''; }
    if (host) {
      const wa = /(^|\.)wa\.me$|(^|\.)whatsapp\.com$/i.test(host);
      return { tipo: wa ? 'whatsapp' : 'liga', url: t, host, crudo: s };
    }
  }
  if (/^www\.[^\s]+\.[a-z]{2,}/i.test(t) && !/\s/.test(t)) return { tipo: 'liga', url: 'https://' + t, host: t.split('/')[0], crudo: s };
  if (/^tel:/i.test(t)) return { tipo: 'telefono', numero: decodeURIComponent(t.slice(4)), crudo: s };
  if (/^mailto:/i.test(t)) {
    const [dir, q = ''] = t.slice(7).split('?');
    const p = new URLSearchParams(q);
    return { tipo: 'correo', para: decodeURIComponent(dir), asunto: p.get('subject') || '', mensaje: p.get('body') || '', crudo: s };
  }
  if (/^MATMSG:/i.test(t)) {
    const c = camposConEscape(t.slice(7));
    return { tipo: 'correo', para: c.TO || '', asunto: c.SUB || '', mensaje: c.BODY || '', crudo: s };
  }
  if (/^(SMSTO|SMS):/i.test(t)) {
    const r = t.replace(/^(SMSTO|SMS):/i, '');
    const i = r.indexOf(':');
    return { tipo: 'sms', numero: i >= 0 ? r.slice(0, i) : r, mensaje: i >= 0 ? r.slice(i + 1) : '', crudo: s };
  }
  if (/^geo:/i.test(t)) {
    const m = t.slice(4).match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (m) return { tipo: 'ubicacion', lat: m[1], lon: m[2], crudo: s };
  }
  if (/^BEGIN:VCARD/i.test(t)) {
    const lineas = t.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
    const c = { tipo: 'contacto', nombre: '', empresa: '', telefonos: [], correos: [], paginas: [], crudo: s };
    const des = (v) => v.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1');
    for (const l of lineas) {
      const i = l.indexOf(':');
      if (i < 0) continue;
      const k = l.slice(0, i).split(';')[0].toUpperCase(), v = des(l.slice(i + 1));
      if (k === 'FN') c.nombre = v;
      else if (k === 'N' && !c.nombre) c.nombre = v.split(';').filter(Boolean).reverse().join(' ');
      else if (k === 'ORG') c.empresa = v.replace(/;/g, ' ');
      else if (k === 'TEL') c.telefonos.push(v);
      else if (k === 'EMAIL') c.correos.push(v);
      else if (k === 'URL') c.paginas.push(v);
    }
    return c;
  }
  if (/^MECARD:/i.test(t)) {
    const c = camposConEscape(t.slice(7));
    return { tipo: 'contacto', nombre: (c.N || '').split(',').reverse().join(' ').trim(), empresa: c.ORG || '', telefonos: (c.TEL || '').split('\n').filter(Boolean), correos: (c.EMAIL || '').split('\n').filter(Boolean), paginas: (c.URL || '').split('\n').filter(Boolean), crudo: s };
  }
  return { tipo: 'texto', texto: s, crudo: s };
}

// ---------- decodificar ----------
let detectorNativo;
async function nativo() {
  if (detectorNativo !== undefined) return detectorNativo;
  detectorNativo = null;
  try {
    if ('BarcodeDetector' in self) {
      const f = await self.BarcodeDetector.getSupportedFormats();
      if (f.includes('qr_code')) detectorNativo = new self.BarcodeDetector({ formats: ['qr_code'] });
    }
  } catch (e) { detectorNativo = null; }
  return detectorNativo;
}
let jsqr;
function cargarJsQR() {
  if (!jsqr) {
    jsqr = import(new URL('../vendor/jsQR.min.js', import.meta.url).href).then(() => self.jsQR).catch(() => { jsqr = null; return null; });
  }
  return jsqr;
}

// Lee un lienzo (canvas). Devuelve el texto o null.
export async function leerLienzo(lienzo, { sinNativo = false } = {}) {
  const d = sinNativo ? null : await nativo();
  if (d) {
    try {
      const r = await d.detect(lienzo);
      if (r && r.length) return r[0].rawValue;
    } catch (e) { /* sigue con el respaldo */ }
  }
  const lector = await cargarJsQR();
  if (!lector) return null;
  const ctx = lienzo.getContext('2d', { willReadFrequently: true });
  const im = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
  const r = lector(im.data, im.width, im.height, { inversionAttempts: 'attemptBoth' });
  return r ? r.data : null;
}

// Una foto puede venir enorme o con el código pequeño: prueba en varios tamaños.
export async function leerImagenQR(img, o = {}) {
  const w0 = img.naturalWidth || img.width, h0 = img.naturalHeight || img.height;
  for (const max of [1200, 800, 1800, 500]) {
    const k = Math.min(1, max / Math.max(w0, h0));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w0 * k));
    c.height = Math.max(1, Math.round(h0 * k));
    const x = c.getContext('2d', { willReadFrequently: true });
    x.fillStyle = '#ffffff';
    x.fillRect(0, 0, c.width, c.height);
    x.drawImage(img, 0, 0, c.width, c.height);
    const r = await leerLienzo(c, o);
    if (r != null) return r;
    if (k === 1) break;
  }
  return null;
}

function cssPropio() {
  if (document.querySelector('link[data-ah-css-lector-qr]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/lector-qr.css', import.meta.url).href;
  l.setAttribute('data-ah-css-lector-qr', '1');
  document.head.appendChild(l);
}

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const wifi = opciones.modo === 'wifi';
  const o = { sinNativo: !!opciones.sinNativo };

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-una alq', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const est = estado();
  const aviso = h('p', { class: 'ah-nota alq-aviso', role: 'status', 'aria-live': 'polite' });
  const video = h('video', { class: 'alq-video', playsinline: true, muted: true, autoplay: true, 'aria-hidden': 'true' });
  video.muted = true;
  video.setAttribute('playsinline', '');
  const marco = h('div', { class: 'alq-camara', hidden: true }, video, h('div', { class: 'alq-mira', 'aria-hidden': 'true' }));
  const archivo = h('input', { type: 'file', accept: 'image/*', class: 'alq-archivo', id: 'alq-f-' + Math.random().toString(36).slice(2) });
  const bCamara = boton(t.abrirCamara, () => (flujo ? detener() : abrirCamara()));
  const etiquetaSubir = h('label', { class: 'ah-boton ah-boton-2 alq-subir', for: archivo.id, tabindex: '0', role: 'button', text: t.subir });
  etiquetaSubir.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); archivo.click(); } });
  const zona = h('div', { class: 'alq-zona' },
    h('h3', { class: 'ah-titulo-vista', text: wifi ? t.tituloWifi : t.tituloCamara }),
    h('div', { class: 'ah-acciones' }, bCamara, etiquetaSubir, archivo),
    h('p', { class: 'ah-nota', text: t.arrastra + ' ' + t.privado }),
    marco, aviso);
  const salida = h('section', { class: 'alq-resultado', hidden: true, 'aria-live': 'polite' });
  raiz.append(zona, salida, est);

  // ---------- cámara ----------
  let flujo = null, bucle = 0, ocupado = false;
  async function abrirCamara() {
    aviso.textContent = '';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { aviso.textContent = t.sinCamaraEquipo; return; }
    try {
      flujo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    } catch (e) {
      flujo = null;
      aviso.textContent = e && (e.name === 'NotFoundError' || e.name === 'OverconstrainedError') ? t.sinCamaraEquipo : t.sinCamara;
      return;
    }
    video.srcObject = flujo;
    marco.hidden = false;
    bCamara.textContent = t.detener;
    aviso.textContent = t.buscando;
    try { await video.play(); } catch (e) { /* algunos navegadores ya lo reproducen */ }
    const lienzo = document.createElement('canvas');
    const ctx = lienzo.getContext('2d', { willReadFrequently: true });
    const id = ++bucle;
    const paso = async () => {
      if (id !== bucle || !flujo) return;
      if (!ocupado && video.readyState >= 2 && video.videoWidth) {
        ocupado = true;
        const k = Math.min(1, 900 / Math.max(video.videoWidth, video.videoHeight));
        lienzo.width = Math.round(video.videoWidth * k);
        lienzo.height = Math.round(video.videoHeight * k);
        ctx.drawImage(video, 0, 0, lienzo.width, lienzo.height);
        let r = null;
        try { r = await leerLienzo(lienzo, o); } catch (e) { r = null; }
        ocupado = false;
        if (r != null && id === bucle) { detener(); mostrar(r); return; }
      }
      setTimeout(paso, 220);
    };
    paso();
  }
  function detener() {
    bucle++;
    if (flujo) for (const p of flujo.getTracks()) p.stop();
    flujo = null;
    video.srcObject = null;
    marco.hidden = true;
    bCamara.textContent = t.abrirCamara;
    if (aviso.textContent === t.buscando) aviso.textContent = '';
  }

  // ---------- foto ----------
  async function leerArchivo(f) {
    if (!f || !/^image\//.test(f.type || 'image/')) return;
    detener();
    aviso.textContent = t.leyendo;
    let r = null;
    try { const { img } = await leerImagen(f); r = await leerImagenQR(img, o); } catch (e) { r = null; }
    if (r == null) { aviso.textContent = t.noLeido; return; }
    aviso.textContent = '';
    mostrar(r);
  }
  archivo.addEventListener('change', () => { leerArchivo(archivo.files && archivo.files[0]); archivo.value = ''; });
  raiz.addEventListener('dragover', (e) => { e.preventDefault(); raiz.classList.add('alq-encima'); });
  raiz.addEventListener('dragleave', () => raiz.classList.remove('alq-encima'));
  raiz.addEventListener('drop', (e) => { e.preventDefault(); raiz.classList.remove('alq-encima'); leerArchivo(e.dataTransfer.files && e.dataTransfer.files[0]); });
  const alPegar = (e) => {
    if (!contenedor.isConnected) { document.removeEventListener('paste', alPegar); return; }
    const it = [...(e.clipboardData ? e.clipboardData.items : [])].find((x) => x.type.startsWith('image/'));
    if (it) { e.preventDefault(); leerArchivo(it.getAsFile()); }
  };
  document.addEventListener('paste', alPegar);

  // ---------- resultado ----------
  function copiarBoton(texto, valor, clase = 'ah-boton ah-boton-2') {
    return boton(texto, async () => {
      const ok = await copiar(valor);
      est.decir(ok ? t.copiado : t.noCopiado);
      if (ok) avisar(contenedor, ID, 'copiar');
    }, clase);
  }
  const fila = (etq, valor, ...extra) => h('div', { class: 'alq-fila' }, h('dt', { text: etq }), h('dd', {}, h('span', { class: 'alq-valor', text: valor }), ...extra));
  const liga = (href, texto, clase = 'ah-boton') => h('a', { class: clase, href, target: '_blank', rel: 'noopener noreferrer', text: texto });

  function mostrar(texto) {
    const d = interpretar(texto);
    salida.textContent = '';
    salida.hidden = false;
    const cab = h('div', { class: 'alq-cabeza' }, h('h3', { class: 'ah-titulo-vista', text: t.resultado }), h('span', { class: 'alq-tipo', text: t.tipos[d.tipo] }));
    salida.append(cab);
    if (wifi && d.tipo !== 'wifi') salida.append(h('p', { class: 'ah-error', text: t.noEsWifi }));
    const dl = h('dl', { class: 'alq-datos' });
    const acciones = h('div', { class: 'ah-acciones' });
    if (d.tipo === 'wifi') {
      dl.append(fila(t.red, d.red, copiarBoton(t.copiarRed, d.red, 'ah-liga')));
      dl.append(fila(t.clave, d.clave || t.sinClave, d.clave ? copiarBoton(t.copiarClave, d.clave, 'ah-liga') : null));
      dl.append(fila(t.seguridad, d.seguridad || t.sinClave));
      if (d.oculta) dl.append(fila(t.oculta, t.si));
      salida.append(dl, h('p', { class: 'ah-nota', text: t.conectar }));
      if (d.clave) acciones.append(copiarBoton(t.copiarClave, d.clave, 'ah-boton'));
    } else if (d.tipo === 'liga' || d.tipo === 'whatsapp') {
      dl.append(fila(t.sitio, d.host));
      salida.append(dl, h('p', { class: 'alq-url', text: d.url }), h('p', { class: 'ah-nota', text: t.revisaLiga }));
      acciones.append(liga(d.url, d.tipo === 'whatsapp' ? t.abrirWhatsApp : t.abrirLiga), copiarBoton(t.copiar, d.url));
    } else if (d.tipo === 'telefono') {
      dl.append(fila(t.numero, d.numero));
      salida.append(dl);
      acciones.append(h('a', { class: 'ah-boton', href: 'tel:' + d.numero.replace(/[^\d+]/g, ''), text: t.llamar }), copiarBoton(t.copiar, d.numero));
    } else if (d.tipo === 'correo') {
      dl.append(fila(t.para, d.para));
      if (d.asunto) dl.append(fila(t.asunto, d.asunto));
      if (d.mensaje) dl.append(fila(t.mensaje, d.mensaje));
      salida.append(dl);
      const q = [];
      if (d.asunto) q.push('subject=' + encodeURIComponent(d.asunto));
      if (d.mensaje) q.push('body=' + encodeURIComponent(d.mensaje));
      acciones.append(h('a', { class: 'ah-boton', href: 'mailto:' + d.para + (q.length ? '?' + q.join('&') : ''), text: t.escribir }), copiarBoton(t.copiar, d.para));
    } else if (d.tipo === 'sms') {
      dl.append(fila(t.numero, d.numero));
      if (d.mensaje) dl.append(fila(t.mensaje, d.mensaje));
      salida.append(dl);
      acciones.append(h('a', { class: 'ah-boton', href: 'sms:' + d.numero + (d.mensaje ? '?body=' + encodeURIComponent(d.mensaje) : ''), text: t.mandarSms }), copiarBoton(t.copiar, d.numero));
    } else if (d.tipo === 'contacto') {
      if (d.nombre) dl.append(fila(t.nombre, d.nombre));
      if (d.empresa) dl.append(fila(t.empresa, d.empresa));
      for (const x of d.telefonos) dl.append(fila(t.telefono, x));
      for (const x of d.correos) dl.append(fila(t.correoC, x));
      for (const x of d.paginas) dl.append(fila(t.pagina, x));
      salida.append(dl);
      const vcf = /^BEGIN:VCARD/i.test(d.crudo.trim()) ? d.crudo.trim() : ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + d.nombre, ...d.telefonos.map((x) => 'TEL:' + x), ...d.correos.map((x) => 'EMAIL:' + x), 'END:VCARD'].join('\n');
      acciones.append(boton(t.bajarContacto, () => {
        descargar(new Blob([vcf.replace(/\r?\n/g, '\r\n') + '\r\n'], { type: 'text/vcard;charset=utf-8' }), (d.nombre || 'contacto').replace(/[^\p{L}\d]+/gu, '-').toLowerCase() + '.vcf');
        avisar(contenedor, ID, 'descargar');
      }), copiarBoton(t.copiarTodo, d.crudo));
    } else if (d.tipo === 'ubicacion') {
      dl.append(fila(t.coordenadas, `${d.lat}, ${d.lon}`));
      salida.append(dl);
      acciones.append(liga(`https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lon}#map=17/${d.lat}/${d.lon}`, t.verMapa), copiarBoton(t.copiar, `${d.lat}, ${d.lon}`));
    } else {
      salida.append(h('p', { class: 'alq-texto', text: d.texto }));
      acciones.append(copiarBoton(t.copiar, d.texto, 'ah-boton'));
    }
    acciones.append(boton(t.otro, () => { salida.hidden = true; salida.textContent = ''; abrirCamaraSiHabia(); }, 'ah-liga'));
    salida.append(acciones);
    avisar(contenedor, ID, 'leer');
    salida.scrollIntoView && salida.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  let usabaCamara = false;
  const abrirOriginal = abrirCamara;
  function abrirCamaraSiHabia() { if (usabaCamara) abrirOriginal(); }
  bCamara.addEventListener('click', () => { usabaCamara = true; });

  return {
    destruir() { detener(); document.removeEventListener('paste', alPegar); contenedor.textContent = ''; },
    leerTexto: mostrar,
  };
}
