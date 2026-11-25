// Herramienta «qr» de Avelina: generador de códigos QR estáticos.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// modos: link, whatsapp, wifi, texto, imagen, facebook, instagram, menu, telefono, correo, contacto

import { generarQR, QRDemasiadoLargo } from './_qr-codificador.js';
import {
  h, campo, textos as unirTextos, avisar, descargar, estado, lienzoABlob, leerImagen, PIE,
  selectorColor, opcionesChip, boton, contraste, normalizarHex, nombreArchivo, asegurarEstilos,
  numeroWhatsApp, ligaWhatsApp, idUnico,
} from './_comun.js';

export { generarQR };

const ID = 'qr';

export const TEXTOS = {
  tipo: 'Qué abre tu QR',
  tipos: {
    link: 'Liga', whatsapp: 'WhatsApp', wifi: 'Wifi', texto: 'Texto', facebook: 'Facebook',
    instagram: 'Instagram', menu: 'Menú', telefono: 'Llamada', correo: 'Correo', contacto: 'Contacto',
  },
  url: 'Liga de tu página',
  urlEjemplo: 'https://tunegocio.mx',
  menuUrl: 'Liga de tu menú',
  menuEjemplo: 'https://tunegocio.mx/menu',
  menuTexto: 'Escanea para ver el menú',
  lada: 'Lada',
  numero: 'Número de WhatsApp',
  numeroAyuda: '10 dígitos. Ejemplo 33 1234 5678.',
  numeroMal: 'Revisa el número. En México son 10 dígitos.',
  mensaje: 'Mensaje que ya va escrito (opcional)',
  mensajeEjemplo: 'Hola, quiero información',
  red: 'Nombre de la red (SSID)',
  clave: 'Contraseña',
  cifrado: 'Seguridad',
  cifrados: [['WPA', 'WPA o WPA2'], ['WEP', 'WEP'], ['nopass', 'Sin contraseña']],
  oculta: 'Es una red oculta',
  wifiAyuda: 'Escríbelos igual que en tu módem. Cuentan mayúsculas y espacios.',
  texto: 'Texto',
  textoEjemplo: 'Escribe lo que verá quien lo escanee',
  facebook: 'Tu página o usuario de Facebook',
  facebookEjemplo: 'tunegocio',
  instagram: 'Tu usuario de Instagram',
  instagramEjemplo: '@tunegocio',
  telefono: 'Teléfono',
  correo: 'Correo',
  asunto: 'Asunto (opcional)',
  cuerpo: 'Mensaje (opcional)',
  nombre: 'Nombre',
  empresa: 'Negocio (opcional)',
  sitio: 'Página (opcional)',
  logo: 'Logo o imagen al centro',
  logoAyuda: 'PNG o JPG. Tu imagen no sale de tu equipo.',
  logoQuitar: 'Quitar imagen',
  logoTam: 'Tamaño de la imagen',
  logoTams: [['0.16', 'Chica'], ['0.22', 'Mediana'], ['0.27', 'Grande']],
  ajustes: 'Colores y tamaño',
  colorQR: 'Color del QR',
  colorFondo: 'Color del fondo',
  tamPng: 'Tamaño del PNG',
  margen: 'Margen blanco',
  nivel: 'Corrección de errores',
  niveles: [['L', 'Baja · 7%'], ['M', 'Media · 15%'], ['Q', 'Alta · 25%'], ['H', 'Máxima · 30%']],
  nivelLogo: 'Con imagen al centro va en corrección máxima.',
  textoDebajo: 'Texto debajo del QR (opcional)',
  textoDebajoEjemplo: 'Escanea y escríbenos',
  pie: 'Agregar «Hecho con Avelina · avelina.com.mx» debajo',
  vista: 'Vista previa',
  ejemplo: 'Es un ejemplo. Escribe tus datos y cambia al momento.',
  noCaduca: 'Tu QR no caduca nunca. Lo que guarda va dentro del código y no pasa por nadie.',
  pruebalo: 'Escanéalo con tu celular antes de imprimirlo.',
  png: 'Descargar PNG',
  svg: 'Descargar SVG',
  descargado: 'Listo. Revisa tus descargas.',
  bajoContraste: 'Con estos colores algunos celulares no lo leen. Usa un QR oscuro sobre fondo claro.',
  invertido: 'El QR claro sobre fondo oscuro no lo leen todos los celulares.',
  largo: 'Es demasiado texto para un QR. Recórtalo.',
  modulos: (n) => `${n} × ${n} cuadros`,
};

// ---------- contenido de cada tipo ----------
function escWifi(s) { return String(s).replace(/([\\;,:"])/g, '\\$1'); }
function escVcard(s) { return String(s).replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n'); }

function conEsquema(u) {
  const s = String(u || '').trim();
  if (!s) return '';
  return /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : 'https://' + s;
}

function usuarioDe(v, dominio) {
  let s = String(v || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s) || s.includes(dominio)) return conEsquema(s);
  s = s.replace(/^@/, '').replace(/\s+/g, '');
  return s ? `https://www.${dominio}/${s}` + (dominio === 'instagram.com' ? '/' : '') : '';
}

// Devuelve el texto que se codifica (o '' si falta lo principal).
export function contenidoQR(tipo, d) {
  switch (tipo) {
    case 'whatsapp': {
      const n = numeroWhatsApp(d.lada, d.numero);
      return d.numero && n.valido ? ligaWhatsApp(n.completo, d.mensaje) : '';
    }
    case 'wifi':
      if (!d.red) return '';
      return `WIFI:T:${d.cifrado || 'WPA'};S:${escWifi(d.red)};` +
        (d.cifrado === 'nopass' ? '' : `P:${escWifi(d.clave || '')};`) + (d.oculta ? 'H:true;' : '') + ';';
    case 'texto': return String(d.texto || '');
    case 'facebook': return usuarioDe(d.facebook, 'facebook.com');
    case 'instagram': return usuarioDe(d.instagram, 'instagram.com');
    case 'telefono': {
      const t = String(d.telefono || '').replace(/[^\d+]/g, '');
      return t ? 'tel:' + t : '';
    }
    case 'correo': {
      const c = String(d.correo || '').trim();
      if (!c) return '';
      const q = [];
      if (d.asunto) q.push('subject=' + encodeURIComponent(d.asunto));
      if (d.cuerpo) q.push('body=' + encodeURIComponent(d.cuerpo));
      return 'mailto:' + c + (q.length ? '?' + q.join('&') : '');
    }
    case 'contacto': {
      if (!d.nombre && !d.telefono && !d.correo) return '';
      const l = ['BEGIN:VCARD', 'VERSION:3.0', `N:${escVcard(d.nombre || '')};;;;`, `FN:${escVcard(d.nombre || '')}`];
      if (d.empresa) l.push('ORG:' + escVcard(d.empresa));
      if (d.telefono) l.push('TEL;TYPE=CELL:' + String(d.telefono).replace(/[^\d+]/g, ''));
      if (d.correo) l.push('EMAIL:' + d.correo.trim());
      if (d.sitio) l.push('URL:' + conEsquema(d.sitio));
      l.push('END:VCARD');
      return l.join('\n');
    }
    case 'menu': return conEsquema(d.menuUrl);
    default: return conEsquema(d.url);
  }
}

// ---------- dibujo ----------
function escXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Medidas comunes en «módulos» para SVG y PNG.
function medidas(q, o) {
  const m = Math.max(0, o.margen ?? 4);
  const n = q.tam + 2 * m;
  const altoTexto = o.texto ? Math.max(2.4, n * 0.11) : 0;
  const altoPie = o.pie ? Math.max(1.6, n * 0.06) : 0;
  return { m, n, alto: n + altoTexto + altoPie, altoTexto, altoPie };
}

function cajaLogo(q, o, med) {
  if (!o.logo) return null;
  const lado = q.tam * (o.logo.proporcion || 0.22);
  const ini = med.m + (q.tam - lado) / 2;
  return { x: ini, y: ini, lado };
}

function encajar(img, caja) {
  const r = img.width / img.height || 1;
  let w = caja.lado, hh = caja.lado;
  if (r > 1) hh = w / r; else w = hh * r;
  return { x: caja.x + (caja.lado - w) / 2, y: caja.y + (caja.lado - hh) / 2, w, h: hh };
}

export function svgQR(q, o = {}) {
  const primer = normalizarHex(o.primer) || '#000000';
  const fondo = normalizarHex(o.fondo) || '#FFFFFF';
  const med = medidas(q, o);
  let d = '';
  for (let y = 0; y < q.tam; y++) {
    for (let x = 0; x < q.tam; x++) {
      if (!q.modulos[y * q.tam + x]) continue;
      let k = x;
      while (k + 1 < q.tam && q.modulos[y * q.tam + k + 1]) k++;
      d += `M${x + med.m} ${y + med.m}h${k - x + 1}v1h-${k - x + 1}z`;
      x = k;
    }
  }
  const px = o.tamPx ? ` width="${o.tamPx}" height="${Math.round(o.tamPx * med.alto / med.n)}"` : '';
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${med.n} ${fmt(med.alto)}"${px} shape-rendering="crispEdges"` +
    (o.titulo ? ` role="img" aria-label="${escXml(o.titulo)}"` : '') + '>' +
    `<rect width="${med.n}" height="${fmt(med.alto)}" fill="${fondo}"/><path fill="${primer}" d="${d}"/>`;
  const caja = cajaLogo(q, o, med);
  if (caja) {
    const pad = 0.6;
    s += `<rect x="${fmt(caja.x - pad)}" y="${fmt(caja.y - pad)}" width="${fmt(caja.lado + 2 * pad)}" height="${fmt(caja.lado + 2 * pad)}" fill="${fondo}"/>`;
    const e = encajar(o.logo.img, caja);
    s += `<image href="${o.logo.url}" x="${fmt(e.x)}" y="${fmt(e.y)}" width="${fmt(e.w)}" height="${fmt(e.h)}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  const fuente = 'font-family="Helvetica Neue, Arial, sans-serif" text-anchor="middle"';
  if (o.texto) {
    s += `<text x="${med.n / 2}" y="${fmt(med.n + med.altoTexto * 0.42)}" ${fuente} font-size="${fmt(med.altoTexto * 0.52)}" fill="${primer}" dominant-baseline="middle">${escXml(o.texto)}</text>`;
  }
  if (o.pie) {
    s += `<text x="${med.n / 2}" y="${fmt(med.alto - med.altoPie * 0.55)}" ${fuente} font-size="${fmt(med.altoPie * 0.5)}" fill="#8C8C8C" dominant-baseline="middle">${escXml(PIE)}</text>`;
  }
  return s + '</svg>';
}

function fmt(v) { return Math.round(v * 100) / 100; }

// Lienzo con módulos alineados a píxel entero (bordes nítidos al imprimir).
export function lienzoQR(q, o = {}) {
  const primer = normalizarHex(o.primer) || '#000000';
  const fondo = normalizarHex(o.fondo) || '#FFFFFF';
  const med = medidas(q, o);
  const esc = Math.max(1, Math.floor((o.tamPx || 1024) / med.n));
  const W = esc * med.n;
  const H = Math.round(esc * med.alto);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = primer;
  for (let y = 0; y < q.tam; y++) {
    for (let x = 0; x < q.tam; x++) {
      if (q.modulos[y * q.tam + x]) ctx.fillRect((x + med.m) * esc, (y + med.m) * esc, esc, esc);
    }
  }
  const caja = cajaLogo(q, o, med);
  if (caja) {
    const pad = 0.6;
    ctx.fillStyle = fondo;
    ctx.fillRect((caja.x - pad) * esc, (caja.y - pad) * esc, (caja.lado + 2 * pad) * esc, (caja.lado + 2 * pad) * esc);
    const e = encajar(o.logo.img, caja);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(o.logo.img, e.x * esc, e.y * esc, e.w * esc, e.h * esc);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (o.texto) {
    ctx.fillStyle = primer;
    let tam = med.altoTexto * 0.52 * esc;
    ctx.font = `500 ${tam}px "Helvetica Neue", Arial, sans-serif`;
    while (tam > 8 && ctx.measureText(o.texto).width > W * 0.92) {
      tam -= 1;
      ctx.font = `500 ${tam}px "Helvetica Neue", Arial, sans-serif`;
    }
    ctx.fillText(o.texto, W / 2, (med.n + med.altoTexto * 0.42) * esc);
  }
  if (o.pie) {
    ctx.fillStyle = '#8c8c8c';
    ctx.font = `${med.altoPie * 0.5 * esc}px "Helvetica Neue", Arial, sans-serif`;
    ctx.fillText(PIE, W / 2, (med.alto - med.altoPie * 0.55) * esc);
  }
  return c;
}

export async function pngQR(q, o) {
  return lienzoABlob(lienzoQR(q, o));
}

export function svgBlob(svg) {
  return new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + svg], { type: 'image/svg+xml' });
}

// Bloque reutilizable: vista previa + descargas, para otras herramientas (p. ej. whatsapp-link).
export function vistaQR(contenedor, { herramienta, textos: t = TEXTOS, nombre = 'qr' } = {}) {
  const vista = h('div', { class: 'ah-qr-lienzo' });
  const est = estado();
  let actual = null;
  let nombreActual = nombre;
  const bajarPng = boton(t.png, async () => {
    if (!actual) return;
    descargar(await pngQR(actual, { tamPx: 1024 }), nombreActual + '.png');
    est.decir(t.descargado);
    avisar(contenedor, herramienta, 'descargar');
  });
  const bajarSvg = boton(t.svg, () => {
    if (!actual) return;
    descargar(svgBlob(svgQR(actual, { tamPx: 1024 })), nombreActual + '.svg');
    est.decir(t.descargado);
    avisar(contenedor, herramienta, 'descargar');
  }, 'ah-boton ah-boton-2');
  const el = h('div', { class: 'ah-qr-vista' }, vista,
    h('p', { class: 'ah-nota', text: t.noCaduca }),
    h('div', { class: 'ah-acciones' }, bajarPng, bajarSvg), est);
  return {
    el,
    actualizar(texto, nombreArch) {
      nombreActual = nombreArch || nombre;
      actual = texto ? generarQR(texto, { nivel: 'M' }) : null;
      vista.innerHTML = actual ? svgQR(actual, { titulo: 'QR' }) : '';
      bajarPng.disabled = bajarSvg.disabled = !actual;
    },
  };
}

// ---------- herramienta completa ----------
const TIPOS = ['link', 'whatsapp', 'wifi', 'texto', 'menu', 'facebook', 'instagram', 'telefono', 'correo', 'contacto'];
const EJEMPLOS = {
  link: { url: 'https://avelina.com.mx' },
  whatsapp: { lada: '52', numero: '3312345678', mensaje: 'Hola, quiero información' },
  wifi: { red: 'Mi negocio', clave: 'contraseña123', cifrado: 'WPA' },
  texto: { texto: 'Hola' },
  menu: { menuUrl: 'https://tunegocio.mx/menu' },
  facebook: { facebook: 'tunegocio' },
  instagram: { instagram: 'tunegocio' },
  telefono: { telefono: '+523312345678' },
  correo: { correo: 'hola@tunegocio.mx' },
  contacto: { nombre: 'Ana López', telefono: '+523312345678' },
};

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  const t = unirTextos(TEXTOS, opciones);
  t.tipos = Object.assign({}, TEXTOS.tipos, (opciones.textos && opciones.textos.tipos) || {});
  const modo = opciones.modo || 'link';
  const conImagen = modo === 'imagen';
  let tipo = TIPOS.includes(modo) ? modo : 'link';

  const datos = {
    lada: '52', cifrado: 'WPA', margen: 4, tamPx: 1024, nivel: 'M',
    primer: '#000000', fondo: '#FFFFFF', pie: false,
    texto: '', textoDebajo: modo === 'menu' ? t.menuTexto : '',
    logo: null, logoProp: 0.22,
  };

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-qr', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  // Tipo
  const chips = opcionesChip('tipo', t.tipo, TIPOS.map((k) => [k, t.tipos[k]]), tipo, (v) => {
    tipo = v;
    if (v === 'menu' && !datos.textoDebajo) { datos.textoDebajo = t.menuTexto; txtDebajo.value = t.menuTexto; }
    pintarCampos();
    redibujar();
  });

  const camposEl = h('div', { class: 'ah-campos' });

  // Logo
  const archivoLogo = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,image/svg+xml', class: 'ah-archivo' });
  const quitarLogo = boton(t.logoQuitar, () => {
    datos.logo = null; archivoLogo.value = ''; quitarLogo.hidden = true; redibujar();
  }, 'ah-liga');
  quitarLogo.hidden = true;
  archivoLogo.addEventListener('change', async () => {
    const f = archivoLogo.files && archivoLogo.files[0];
    if (!f) return;
    try {
      const { img, url } = await leerImagen(f);
      datos.logo = { img, url };
      quitarLogo.hidden = false;
      redibujar();
    } catch (e) { est.decir(t.logoAyuda, 0); }
  });
  const tamLogo = opcionesChip('logo', t.logoTam, t.logoTams, String(datos.logoProp), (v) => { datos.logoProp = +v; redibujar(); });
  const campoLogo = h('div', { class: 'ah-grupo' }, campo(t.logo, archivoLogo, t.logoAyuda), quitarLogo, tamLogo);

  function entrada(clave, etiqueta, attrs = {}, ayuda) {
    const tag = attrs.multilinea ? 'textarea' : 'input';
    const a = Object.assign({ class: 'ah-input', autocomplete: 'off' }, attrs);
    delete a.multilinea;
    if (tag === 'input' && !a.type) a.type = 'text';
    const el = h(tag, a);
    el.value = datos[clave] || '';
    el.addEventListener('input', () => { datos[clave] = el.value; programar(); });
    return campo(etiqueta, el, ayuda);
  }

  const avisoNumero = h('p', { class: 'ah-error', hidden: true, text: t.numeroMal });

  function pintarCampos() {
    camposEl.textContent = '';
    const c = [];
    switch (tipo) {
      case 'whatsapp':
        c.push(h('div', { class: 'ah-fila ah-fila-lada' },
          entrada('lada', t.lada, { inputmode: 'numeric', maxlength: 4 }),
          entrada('numero', t.numero, { type: 'tel', inputmode: 'tel', placeholder: '33 1234 5678' }, t.numeroAyuda)),
        avisoNumero,
        entrada('mensaje', t.mensaje, { multilinea: true, rows: 3, placeholder: t.mensajeEjemplo }));
        break;
      case 'wifi': {
        const sel = h('select', { class: 'ah-input' }, t.cifrados.map(([v, x]) => h('option', { value: v, text: x })));
        sel.value = datos.cifrado;
        sel.addEventListener('change', () => { datos.cifrado = sel.value; claveCampo.hidden = sel.value === 'nopass'; redibujar(); });
        const claveCampo = entrada('clave', t.clave, { spellcheck: false });
        claveCampo.hidden = datos.cifrado === 'nopass';
        const oc = h('input', { type: 'checkbox', checked: !!datos.oculta });
        oc.addEventListener('change', () => { datos.oculta = oc.checked; redibujar(); });
        c.push(entrada('red', t.red, { spellcheck: false }, t.wifiAyuda), claveCampo, campo(t.cifrado, sel),
          h('label', { class: 'ah-check' }, oc, h('span', { text: t.oculta })));
        break;
      }
      case 'texto': c.push(entrada('texto', t.texto, { multilinea: true, rows: 4, placeholder: t.textoEjemplo })); break;
      case 'menu': c.push(entrada('menuUrl', t.menuUrl, { type: 'url', inputmode: 'url', placeholder: t.menuEjemplo })); break;
      case 'facebook': c.push(entrada('facebook', t.facebook, { placeholder: t.facebookEjemplo, spellcheck: false })); break;
      case 'instagram': c.push(entrada('instagram', t.instagram, { placeholder: t.instagramEjemplo, spellcheck: false })); break;
      case 'telefono': c.push(entrada('telefono', t.telefono, { type: 'tel', inputmode: 'tel', placeholder: '+52 33 1234 5678' })); break;
      case 'correo':
        c.push(entrada('correo', t.correo, { type: 'email', inputmode: 'email', placeholder: 'hola@tunegocio.mx' }),
          entrada('asunto', t.asunto), entrada('cuerpo', t.cuerpo, { multilinea: true, rows: 3 }));
        break;
      case 'contacto':
        c.push(entrada('nombre', t.nombre), entrada('telefono', t.telefono, { type: 'tel', inputmode: 'tel' }),
          entrada('correo', t.correo, { type: 'email', inputmode: 'email' }), entrada('empresa', t.empresa),
          entrada('sitio', t.sitio, { type: 'url', inputmode: 'url' }));
        break;
      default: c.push(entrada('url', t.url, { type: 'url', inputmode: 'url', placeholder: t.urlEjemplo }));
    }
    camposEl.append(...c);
    if (conImagen) camposEl.append(campoLogo);
    else ajusteLogo.append(campoLogo);
  }

  // Ajustes
  const cPrimer = selectorColor(t.colorQR, datos.primer, (v) => { datos.primer = v; redibujar(); });
  const cFondo = selectorColor(t.colorFondo, datos.fondo, (v) => { datos.fondo = v; redibujar(); });
  const selTam = h('select', { class: 'ah-input' }, [512, 1024, 2048, 4096].map((n) => h('option', { value: n, text: `${n} px` })));
  selTam.value = String(datos.tamPx);
  selTam.addEventListener('change', () => { datos.tamPx = +selTam.value; });
  const rangoMargen = h('input', { type: 'range', min: 0, max: 10, step: 1, class: 'ah-rango' });
  rangoMargen.value = String(datos.margen);
  const margenValor = h('output', { class: 'ah-valor', text: String(datos.margen) });
  rangoMargen.addEventListener('input', () => { datos.margen = +rangoMargen.value; margenValor.textContent = rangoMargen.value; redibujar(); });
  const selNivel = h('select', { class: 'ah-input' }, t.niveles.map(([v, x]) => h('option', { value: v, text: x })));
  selNivel.value = datos.nivel;
  selNivel.addEventListener('change', () => { datos.nivel = selNivel.value; redibujar(); });
  const notaNivel = h('p', { class: 'ah-ayuda', text: t.nivelLogo, hidden: true });
  const txtDebajo = h('input', { type: 'text', class: 'ah-input', placeholder: t.textoDebajoEjemplo, maxlength: 60 });
  txtDebajo.value = datos.textoDebajo;
  txtDebajo.addEventListener('input', () => { datos.textoDebajo = txtDebajo.value; programar(); });
  const chkPie = h('input', { type: 'checkbox' });
  chkPie.addEventListener('change', () => { datos.pie = chkPie.checked; redibujar(); });
  const ajusteLogo = h('div');
  const margenCampo = campo(t.margen, rangoMargen);
  margenCampo.querySelector('label').append(' ', margenValor);

  const ajustes = h('details', { class: 'ah-ajustes', open: true },
    h('summary', { text: t.ajustes }),
    h('div', { class: 'ah-fila' }, cPrimer, cFondo),
    h('div', { class: 'ah-fila' }, campo(t.tamPng, selTam), margenCampo),
    campo(t.nivel, selNivel), notaNivel,
    campo(t.textoDebajo, txtDebajo),
    h('label', { class: 'ah-check' }, chkPie, h('span', { text: t.pie })),
    ajusteLogo);

  // Vista
  const lienzo = h('div', { class: 'ah-qr-lienzo' });
  const notaEjemplo = h('p', { class: 'ah-ayuda', text: t.ejemplo });
  const avisoColor = h('p', { class: 'ah-error', hidden: true });
  const est = estado();
  let actual = null;
  let real = false;
  const bPng = boton(t.png, async () => {
    if (!actual || !real) return;
    descargar(await pngQR(actual, opcDibujo(datos.tamPx)), nombreBase() + '.png');
    terminado();
  });
  const bSvg = boton(t.svg, () => {
    if (!actual || !real) return;
    descargar(svgBlob(svgQR(actual, opcDibujo(datos.tamPx))), nombreBase() + '.svg');
    terminado();
  }, 'ah-boton ah-boton-2');
  function terminado() { est.decir(t.descargado); avisar(contenedor, ID, 'descargar'); }

  const vista = h('div', { class: 'ah-vista' },
    h('h3', { class: 'ah-titulo-vista', text: t.vista }), lienzo, notaEjemplo, avisoColor,
    h('div', { class: 'ah-acciones' }, bPng, bSvg), est,
    h('p', { class: 'ah-nota', text: t.noCaduca }),
    h('p', { class: 'ah-nota', text: t.pruebalo }));

  raiz.append(h('div', { class: 'ah-columna' }, chips, camposEl), vista, h('div', { class: 'ah-columna ah-columna-2' }, ajustes));

  function nombreBase() {
    const base = { wifi: datos.red, whatsapp: 'whatsapp-' + (datos.numero || ''), contacto: datos.nombre }[tipo];
    return 'qr-' + nombreArchivo(base || contenidoQR(tipo, datos).replace(/^(https?:\/\/|mailto:|tel:)/, '').replace(/^www\./, ''));
  }

  function opcDibujo(tamPx) {
    return {
      primer: datos.primer, fondo: datos.fondo, margen: datos.margen, tamPx, pie: datos.pie,
      texto: datos.textoDebajo.trim(), titulo: real ? 'QR' : t.ejemplo,
      logo: datos.logo ? { ...datos.logo, proporcion: datos.logoProp } : null,
    };
  }

  let temporizador;
  function programar() { clearTimeout(temporizador); temporizador = setTimeout(redibujar, 120); }

  function redibujar() {
    let contenido = contenidoQR(tipo, datos);
    avisoNumero.hidden = !(tipo === 'whatsapp' && datos.numero && !numeroWhatsApp(datos.lada, datos.numero).valido);
    real = !!contenido;
    if (!real) contenido = contenidoQR(tipo, Object.assign({}, datos, EJEMPLOS[tipo]));
    const nivel = datos.logo ? 'H' : datos.nivel;
    selNivel.disabled = !!datos.logo;
    notaNivel.hidden = !datos.logo;
    try {
      actual = generarQR(contenido, { nivel });
    } catch (e) {
      if (!(e instanceof QRDemasiadoLargo)) throw e;
      actual = null;
      real = false;
      lienzo.innerHTML = '';
      est.decir(t.largo, 0);
      bPng.disabled = bSvg.disabled = true;
      return;
    }
    lienzo.innerHTML = svgQR(actual, opcDibujo());
    lienzo.classList.toggle('ah-apagado', !real);
    notaEjemplo.hidden = real;
    bPng.disabled = bSvg.disabled = !real;
    const cr = contraste(datos.primer, datos.fondo);
    const oscuroSobreClaro = contraste(datos.primer, '#FFFFFF') >= contraste(datos.fondo, '#FFFFFF');
    avisoColor.hidden = cr >= 3 && oscuroSobreClaro;
    avisoColor.textContent = cr < 3 ? t.bajoContraste : t.invertido;
    if (est.textContent === t.largo) est.decir('');
  }

  pintarCampos();
  redibujar();
  return {
    destruir() { clearTimeout(temporizador); contenedor.textContent = ''; },
  };
}
