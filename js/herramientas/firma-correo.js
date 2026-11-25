// Herramienta «firma-correo» de Avelina: firma de correo en HTML con 5 diseños.
// montar(contenedor, { modo: '' | 'gmail' | 'outlook', idioma: 'es-MX', textos })
// Copia con formato para Gmail y Outlook (HTML al portapapeles) y baja el .html. Sin red. Lo escrito se guarda en el equipo.

import {
  h, campo, textos as unirTextos, avisar, copiar, descargar, estado, boton, asegurarEstilos, opcionesChip,
  selectorColor, numeroWhatsApp, leerImagen, nombreArchivo,
} from './_comun.js';

const ID = 'firma-correo';
const CLAVE = 'avelina:firma-correo';

export const TEXTOS = {
  tus: 'Tus datos',
  nombre: 'Nombre', nombreEjemplo: 'Ana Ramírez',
  puesto: 'Puesto (opcional)', puestoEjemplo: 'Directora',
  negocio: 'Negocio (opcional)', negocioEjemplo: 'Pollos Ramírez',
  telefono: 'Teléfono (opcional)', telefonoEjemplo: '311 123 4567',
  whatsapp: 'WhatsApp (opcional)', whatsappEjemplo: '311 123 4567', whatsappAyuda: '10 dígitos. Sale como liga que abre el chat.',
  correo: 'Correo (opcional)', correoEjemplo: 'ana@pollosramirez.mx',
  sitio: 'Página (opcional)', sitioEjemplo: 'www.pollosramirez.mx',
  direccion: 'Dirección (opcional)', direccionEjemplo: 'Av. Juárez 120, Tepic, Nayarit',
  redes: 'Redes (opcional)', redesAyuda: 'Escribe tu usuario o pega la liga.',
  red: { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn', youtube: 'YouTube' },
  logo: 'Logo (opcional)',
  logoUrl: 'Liga de tu logo', logoUrlEjemplo: 'https://tunegocio.mx/logo.png',
  logoUrlAyuda: 'Si tu logo ya está en internet, pega su liga. Es lo que mejor funciona en Gmail.',
  logoSubir: 'O súbelo desde tu equipo',
  logoSubidoNota: 'Gmail no guarda imágenes subidas desde tu equipo. Para Gmail usa la liga de tu logo. En Outlook y Apple Mail sí funciona.',
  quitarLogo: 'Quitar logo',
  diseno: 'Diseño',
  disenos: { clasica: 'Clásica', barra: 'Con línea', compacta: 'Compacta', centrada: 'Centrada', tarjeta: 'Tarjeta' },
  color: 'Color',
  vista: 'Así se ve tu firma',
  copiar: 'Copiar firma',
  copiarCodigo: 'Copiar código HTML',
  bajar: 'Bajar .html',
  copiado: 'Firma copiada. Pégala en la configuración de tu correo.',
  copiadoCodigo: 'Código copiado.',
  noCopiado: 'No se pudo copiar. Selecciona la firma de la vista y cópiala.',
  faltaNombre: 'Escribe tu nombre para armar la firma.',
  gmailTitulo: 'Cómo pegarla en Gmail',
  gmailPasos: [
    'En Gmail da clic en el engrane de arriba a la derecha y luego en «Ver toda la configuración».',
    'En la pestaña «General» baja hasta «Firma» y da clic en «Crear nueva».',
    'Ponle un nombre y pega la firma en el cuadro con Ctrl + V (en Mac, Cmd + V).',
    'En «Valores predeterminados de firma» elígela para correos nuevos y respuestas.',
    'Baja hasta el final de la página y da clic en «Guardar cambios».',
  ],
  outlookTitulo: 'Cómo pegarla en Outlook',
  outlookPasos: [
    'En Outlook en la web o el Outlook nuevo, abre Configuración, luego «Cuentas» y «Firmas».',
    'Da clic en «Nueva firma», ponle nombre y pega la firma con Ctrl + V.',
    'Elige la firma para mensajes nuevos y respuestas, y da clic en «Guardar».',
    'En Outlook clásico para Windows entra a Archivo, Opciones, Correo y Firmas. Da clic en «Nueva», pega y acepta.',
  ],
  appleTitulo: 'Cómo pegarla en Apple Mail',
  applePasos: [
    'En Mail abre Ajustes y la pestaña «Firmas».',
    'Elige tu cuenta, da clic en el signo de más y pega la firma.',
    'Desmarca «Usar siempre el tipo de letra predeterminado» para que conserve el diseño.',
  ],
  pieArchivo: 'Hecho con Avelina · avelina.com.mx',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const limpio = (s, max = 120) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

function url(s) {
  s = limpio(s, 200).replace(/\s/g, '');
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return 'https://' + s.replace(/^\/+/, '');
}
function verSitio(u) {
  const s = u.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  return s;
}

const BASES = { facebook: 'https://www.facebook.com/', instagram: 'https://www.instagram.com/', tiktok: 'https://www.tiktok.com/@', linkedin: 'https://www.linkedin.com/in/', youtube: 'https://www.youtube.com/@' };
export function ligaRed(red, v) {
  v = limpio(v, 200).replace(/\s/g, '');
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(www\.)?[a-z0-9-]+\.[a-z]{2,}\//i.test(v)) return 'https://' + v;
  return BASES[red] + v.replace(/^@/, '');
}

function telLiga(n) {
  const d = String(n || '').replace(/[^\d+]/g, '');
  if (!d) return '';
  const solo = d.replace(/\D/g, '');
  return 'tel:' + (d.startsWith('+') ? '+' + solo : solo.length === 10 ? '+52' + solo : solo);
}
function telVer(n) {
  const s = String(n || '').replace(/\D/g, '');
  if (s.length === 10) return `${s.slice(0, 3)} ${s.slice(3, 6)} ${s.slice(6)}`;
  return limpio(n, 30);
}

// ---------- armado del HTML ----------
// Todo con tablas y estilos en línea: es lo que respetan Gmail y Outlook.
const FUENTE = 'Arial, Helvetica, sans-serif';
export function armarFirma(d, logoSrc) {
  const c = /^#[0-9a-f]{6}$/i.test(d.color || '') ? d.color : '#1F3A5F';
  const nombre = esc(limpio(d.nombre, 80));
  const puesto = esc(limpio(d.puesto, 80)), negocio = esc(limpio(d.negocio, 80));
  const cargo = [puesto, negocio].filter(Boolean).join(' · ');
  const a = (href, texto, color = '#333333') => `<a href="${esc(href)}" style="color:${color};text-decoration:none">${texto}</a>`;
  const lineas = [];
  const tel = limpio(d.telefono, 30), wa = numeroWhatsApp('52', d.whatsapp);
  const contacto = [];
  const nb = (s) => esc(s).replace(/ /g, '&nbsp;');
  if (tel) contacto.push(`Tel.&nbsp;${a(telLiga(tel), nb(telVer(tel)))}`);
  if (wa.valido) contacto.push(`WhatsApp&nbsp;${a('https://wa.me/' + wa.completo, nb(telVer(wa.local)))}`);
  if (contacto.length) lineas.push(contacto.join('&nbsp;&nbsp;· '));
  const correo = limpio(d.correo, 120).replace(/\s/g, '');
  if (correo && /^[^@]+@[^@]+\.[^@]+$/.test(correo)) lineas.push(a('mailto:' + correo, esc(correo)));
  const sitio = url(d.sitio);
  if (sitio) lineas.push(a(sitio, esc(verSitio(sitio)), c));
  const dir = esc(limpio(d.direccion, 120));
  if (dir) lineas.push(`<span style="color:#666666">${dir}</span>`);
  const redes = Object.keys(BASES).map((r) => [r, ligaRed(r, (d.redes || {})[r])]).filter(([, l]) => l);
  const lineaRedes = redes.length ? redes.map(([r, l]) => a(l, esc(TEXTOS.red[r]), c)).join('&nbsp;&nbsp;· ') : '';

  const logo = (ancho) => (logoSrc ? `<img src="${esc(logoSrc)}" alt="${negocio || nombre}" width="${ancho}" style="display:block;width:${ancho}px;max-width:${ancho}px;height:auto;border:0">` : '');
  const fs = (tam, col = '#333333', extra = '') => `font-family:${FUENTE};font-size:${tam}px;line-height:1.45;color:${col};${extra}`;
  const nombreHtml = (tam) => `<span style="${fs(tam, '#111111', 'font-weight:bold')}">${nombre}</span>`;
  const cargoHtml = cargo ? `<br><span style="${fs(13, '#666666')}">${cargo}</span>` : '';
  const cuerpo = (tam = 13) => lineas.concat(lineaRedes ? [lineaRedes] : []).map((l) => `<span style="${fs(tam)}">${l}</span>`).join('<br>');
  const tabla = (dentro, extra = '') => `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;${extra}">${dentro}</table>`;

  switch (d.diseno) {
    case 'barra':
      return tabla(`<tr><td style="padding:0 0 8px 0">${nombreHtml(18)}${cargoHtml}</td></tr>` +
        `<tr><td style="padding:0 0 10px 0">${tabla(`<tr><td width="48" height="3" style="background:${c};font-size:0;line-height:0;height:3px;width:48px">&nbsp;</td></tr>`)}</td></tr>` +
        `<tr><td style="padding:0">${cuerpo()}</td></tr>` +
        (logoSrc ? `<tr><td style="padding:12px 0 0 0">${logo(110)}</td></tr>` : ''));
    case 'compacta': {
      const datos = lineas.concat(lineaRedes ? [lineaRedes] : []).join('&nbsp;&nbsp;· ');
      return tabla(`<tr>${logoSrc ? `<td valign="middle" style="padding:0 12px 0 0">${logo(48)}</td>` : ''}` +
        `<td valign="middle" style="padding:0"><span style="${fs(14, '#111111', 'font-weight:bold')}">${nombre}</span>` +
        (cargo ? `<span style="${fs(13, '#666666')}"> &nbsp;|&nbsp; ${cargo}</span>` : '') +
        (datos ? `<br><span style="${fs(12)}">${datos}</span>` : '') + '</td></tr>');
    }
    case 'centrada':
      return tabla((logoSrc ? `<tr><td align="center" style="padding:0 0 10px 0">${logo(100)}</td></tr>` : '') +
        `<tr><td align="center" style="padding:0 0 8px 0;text-align:center">${nombreHtml(17)}${cargoHtml}</td></tr>` +
        `<tr><td align="center" style="padding:8px 0 0 0;border-top:1px solid ${c};text-align:center">${cuerpo()}</td></tr>`, 'margin:0');
    case 'tarjeta':
      return tabla(`<tr><td width="6" style="background:${c};width:6px;font-size:0;line-height:0">&nbsp;</td>` +
        `<td valign="top" style="padding:14px 18px;border-top:1px solid #dddddd;border-bottom:1px solid #dddddd">${nombreHtml(16)}${cargoHtml}<br><br>${cuerpo(12)}</td>` +
        (logoSrc ? `<td valign="middle" style="padding:14px 18px;border:1px solid #dddddd;border-left:0">${logo(90)}</td>` : '') + '</tr>');
    default: // clásica
      return tabla(`<tr>${logoSrc ? `<td valign="top" style="padding:2px 16px 0 0">${logo(90)}</td>` : ''}` +
        `<td valign="top" style="padding:0 0 0 14px;border-left:2px solid ${c}">${nombreHtml(16)}${cargoHtml}` +
        (lineas.length || lineaRedes ? `<br><span style="font-size:6px;line-height:6px">&nbsp;</span><br>${cuerpo()}` : '') + '</td></tr>');
  }
}

export function firmaTexto(d) {
  const out = [limpio(d.nombre, 80), [limpio(d.puesto, 80), limpio(d.negocio, 80)].filter(Boolean).join(' · ')];
  if (limpio(d.telefono)) out.push('Tel. ' + telVer(d.telefono));
  const wa = numeroWhatsApp('52', d.whatsapp);
  if (wa.valido) out.push('WhatsApp https://wa.me/' + wa.completo);
  if (limpio(d.correo)) out.push(limpio(d.correo));
  if (url(d.sitio)) out.push(verSitio(url(d.sitio)));
  if (limpio(d.direccion)) out.push(limpio(d.direccion));
  for (const r of Object.keys(BASES)) { const l = ligaRed(r, (d.redes || {})[r]); if (l) out.push(`${TEXTOS.red[r]} ${l}`); }
  return out.filter(Boolean).join('\n');
}

// Logo subido: lo reduce a 240 px de ancho como máximo para que el correo no pese.
async function logoPequeno(archivo) {
  const { img } = await leerImagen(archivo);
  const k = Math.min(1, 240 / img.naturalWidth, 240 / img.naturalHeight);
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(img.naturalWidth * k));
  c.height = Math.max(1, Math.round(img.naturalHeight * k));
  const x = c.getContext('2d');
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, c.width, c.height);
  let s = c.toDataURL('image/png');
  if (s.length > 40000) {
    const b = document.createElement('canvas');
    b.width = c.width; b.height = c.height;
    const y = b.getContext('2d');
    y.fillStyle = '#ffffff'; y.fillRect(0, 0, b.width, b.height); y.drawImage(c, 0, 0);
    s = b.toDataURL('image/jpeg', 0.85);
  }
  return s;
}

function cssPropio() {
  if (document.querySelector('link[data-ah-css-firma-correo]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/firma-correo.css', import.meta.url).href;
  l.setAttribute('data-ah-css-firma-correo', '1');
  document.head.appendChild(l);
}

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const modo = opciones.modo === 'outlook' ? 'outlook' : opciones.modo === 'gmail' ? 'gmail' : '';
  let guardado = {};
  try { guardado = JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { guardado = {}; }
  const d = Object.assign({ nombre: '', puesto: '', negocio: '', telefono: '', whatsapp: '', correo: '', sitio: '', direccion: '', redes: {}, logoUrl: '', logoSubido: '', diseno: 'clasica', color: '#1F3A5F' }, guardado);
  d.redes = Object.assign({}, d.redes);

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah afc', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  let tGuardar;
  function cambio() {
    pintar();
    clearTimeout(tGuardar);
    tGuardar = setTimeout(() => { try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) { /* sin espacio */ } }, 400);
  }
  function texto(k, etiqueta, ph, o = {}) {
    const el = h('input', { type: o.tipo || 'text', class: 'ah-input', placeholder: ph, autocomplete: o.auto || 'off', inputmode: o.teclado, maxlength: o.max || 120, value: d[k] || '' });
    el.addEventListener('input', () => { d[k] = el.value; cambio(); });
    return campo(etiqueta, el, o.ayuda);
  }

  const redes = h('fieldset', { class: 'afc-redes' }, h('legend', { class: 'ah-etiqueta', text: t.redes }));
  for (const [r, nombre] of Object.entries(t.red)) {
    const el = h('input', { type: 'text', class: 'ah-input', placeholder: nombre, autocomplete: 'off', maxlength: 200, value: d.redes[r] || '', 'aria-label': nombre });
    el.addEventListener('input', () => { d.redes[r] = el.value; cambio(); });
    redes.append(el);
  }
  redes.append(h('p', { class: 'ah-ayuda', text: t.redesAyuda }));

  const logoUrl = h('input', { type: 'url', class: 'ah-input', placeholder: t.logoUrlEjemplo, autocomplete: 'off', inputmode: 'url', maxlength: 300, value: d.logoUrl || '' });
  logoUrl.addEventListener('input', () => { d.logoUrl = logoUrl.value; cambio(); });
  const archivo = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,image/svg+xml', class: 'ah-archivo' });
  const notaSubido = h('p', { class: 'ah-nota', text: t.logoSubidoNota });
  const bQuitar = boton(t.quitarLogo, () => { d.logoSubido = ''; d.logoUrl = ''; logoUrl.value = ''; archivo.value = ''; cambio(); }, 'ah-liga');
  archivo.addEventListener('change', async () => {
    const f = archivo.files && archivo.files[0];
    if (!f) return;
    try { d.logoSubido = await logoPequeno(f); cambio(); } catch (e) { est.decir(t.noCopiado); }
  });

  const col = h('div', { class: 'ah-columna' },
    h('h3', { class: 'ah-titulo-vista', text: t.tus }),
    texto('nombre', t.nombre, t.nombreEjemplo, { auto: 'name' }),
    h('div', { class: 'ah-fila' }, texto('puesto', t.puesto, t.puestoEjemplo, { auto: 'organization-title' }), texto('negocio', t.negocio, t.negocioEjemplo, { auto: 'organization' })),
    h('div', { class: 'ah-fila' }, texto('telefono', t.telefono, t.telefonoEjemplo, { tipo: 'tel', auto: 'tel', teclado: 'tel', max: 30 }),
      texto('whatsapp', t.whatsapp, t.whatsappEjemplo, { tipo: 'tel', teclado: 'tel', max: 30, ayuda: t.whatsappAyuda })),
    h('div', { class: 'ah-fila' }, texto('correo', t.correo, t.correoEjemplo, { tipo: 'email', auto: 'email' }), texto('sitio', t.sitio, t.sitioEjemplo, { auto: 'url', teclado: 'url' })),
    texto('direccion', t.direccion, t.direccionEjemplo, { auto: 'street-address' }),
    redes,
    h('fieldset', { class: 'afc-logo' }, h('legend', { class: 'ah-etiqueta', text: t.logo }),
      campo(t.logoUrl, logoUrl, t.logoUrlAyuda), campo(t.logoSubir, archivo), notaSubido, bQuitar));

  const chips = opcionesChip('diseno', t.diseno, Object.entries(t.disenos), d.diseno, (v) => { d.diseno = v; cambio(); });
  const color = selectorColor(t.color, d.color, (v) => { d.color = v; cambio(); });
  const vista = h('div', { class: 'afc-vista', 'aria-label': t.vista });
  const aviso = h('p', { class: 'ah-nota' });
  const est = estado();
  const bCopiar = boton(t.copiar, copiarFirma);
  const bCodigo = boton(t.copiarCodigo, async () => {
    const ok = await copiar(html);
    est.decir(ok ? t.copiadoCodigo : t.noCopiado);
    if (ok) avisar(contenedor, ID, 'copiar');
  }, 'ah-boton ah-boton-2');
  const bBajar = boton(t.bajar, () => {
    const doc = `<!doctype html>\n<html lang="es-MX">\n<head>\n<meta charset="utf-8">\n<title>${esc(limpio(d.nombre) || 'Firma')}</title>\n</head>\n<body style="margin:24px;background:#ffffff">\n${html}\n</body>\n</html>\n`;
    descargar(new Blob([doc], { type: 'text/html;charset=utf-8' }), 'firma-' + nombreArchivo(d.nombre || 'correo') + '.html');
    avisar(contenedor, ID, 'descargar');
  }, 'ah-boton ah-boton-2');

  const pasos = (titulo, lista, abierto) => h('details', { class: 'afc-pasos', open: abierto },
    h('summary', { text: titulo }), h('ol', {}, ...lista.map((p) => h('li', { text: p }))));
  const guias = modo === 'outlook'
    ? [pasos(t.outlookTitulo, t.outlookPasos, true), pasos(t.gmailTitulo, t.gmailPasos, false), pasos(t.appleTitulo, t.applePasos, false)]
    : [pasos(t.gmailTitulo, t.gmailPasos, modo === 'gmail'), pasos(t.outlookTitulo, t.outlookPasos, false), pasos(t.appleTitulo, t.applePasos, false)];

  raiz.append(col, h('div', { class: 'ah-vista' },
    h('h3', { class: 'ah-titulo-vista', text: t.vista }),
    chips, color, vista, aviso,
    h('div', { class: 'ah-acciones' }, bCopiar, bCodigo, bBajar), est,
    h('div', { class: 'afc-guias' }, ...guias)));

  let html = '';
  function pintar() {
    const src = d.logoSubido || (url(d.logoUrl) && /^https:\/\//i.test(url(d.logoUrl)) ? url(d.logoUrl) : '');
    notaSubido.hidden = !d.logoSubido;
    bQuitar.hidden = !d.logoSubido && !d.logoUrl;
    const hay = !!limpio(d.nombre);
    html = hay ? armarFirma(d, src) : '';
    vista.innerHTML = html;
    aviso.textContent = hay ? '' : t.faltaNombre;
    aviso.hidden = hay;
    for (const b of [bCopiar, bCodigo, bBajar]) b.disabled = !hay;
  }

  async function copiarFirma() {
    if (!html) return;
    let ok = false;
    try {
      if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([firmaTexto(d)], { type: 'text/plain' }),
        })]);
        ok = true;
      }
    } catch (e) { ok = false; }
    if (!ok) {
      // Respaldo: selecciona la vista y copia con el formato que pinta el navegador.
      const sel = getSelection();
      const r = document.createRange();
      r.selectNodeContents(vista);
      sel.removeAllRanges();
      sel.addRange(r);
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      sel.removeAllRanges();
    }
    est.decir(ok ? t.copiado : t.noCopiado, 5000);
    if (ok) avisar(contenedor, ID, 'copiar');
  }

  pintar();
  return { destruir() { contenedor.textContent = ''; }, html: () => html };
}
