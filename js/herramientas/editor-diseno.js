// Herramienta «editor-diseno» de Avelina: editor de piezas impresas y para redes.
// montar(contenedor, { modo, idioma: 'es-MX', textos, diseno?, formato? })
// diseno = id del diseño de arranque (p. ej. 'rifa' en flyer); formato = id de la medida de arranque.
// Los diseños de arranque de cada modo viven en editor-diseno/<archivo>.js y se cargan al montar.
// Todo pasa en el navegador: el texto se dibuja con trazos de fuentes/ y el PDF sale vectorial.

import {
  h, campo, textos as unirTextos, avisar, descargar, estado, boton, asegurarEstilos, leerImagen,
  selectorColor, opcionesChip, numeroWhatsApp, ligaWhatsApp, nombreArchivo, contraste,
} from './_comun.js';
import {
  cargarFuentes, componer, limites, pintarCara, destinoCanvas, destinoPDF, PDF, pngConPPP, zip,
  asegurarCSS, registroImagen, mezclar, esOscuro, FUENTES,
} from './_comun-diseno.js';
import { ICONOS } from './editor-diseno/_iconos.js';

const ID = 'editor-diseno';

// modo → archivo de diseños
export const MODOS = {
  'tarjeta-presentacion': 'tarjeta-presentacion', flyer: 'flyer', volante: 'flyer', cartel: 'cartel', poster: 'cartel',
  banner: 'lona', lona: 'lona', letrero: 'letrero', 'letrero-abierto-cerrado': 'letrero-abierto-cerrado',
  horario: 'horario', 'se-vende': 'se-vende', cupon: 'cupon', 'tarjeta-lealtad': 'tarjeta-lealtad',
  'portada-facebook': 'portada-facebook', 'post-instagram': 'post-instagram', 'iconos-destacadas': 'iconos-destacadas',
  folleto: 'folleto', 'tarjeta-digital': 'tarjeta-presentacion', rifa: 'flyer',
};
// Modos que abren en otra medida que la de su archivo de diseños.
const FORMATO_MODO = { 'tarjeta-digital': 'digital' };
// Piezas de imprenta: su PDF puede llevar 3 mm de sangrado y marcas de corte (apagado por omisión).
const CON_SANGRADO = ['tarjeta-presentacion', 'tarjeta-digital', 'tarjeta-lealtad', 'flyer', 'volante', 'cartel', 'poster', 'lona', 'banner', 'folleto'];
const SANGRADO = 3, MARGEN_CORTE = 10; // mm

export const TEXTOS = {
  cargando: 'Cargando el editor…',
  fallo: 'No se pudo cargar el editor. Recarga la página.',
  disenos: 'Elige un diseño',
  medida: 'Medida',
  ancho: 'Ancho (cm)',
  alto: 'Alto (cm)',
  cara: 'Cara que editas',
  textos: 'Tus datos',
  textosAyuda: 'Deja vacío lo que no quieras que salga.',
  imagenes: 'Logo y foto',
  logo: 'Tu logo',
  foto: 'Una foto',
  imagenAyuda: 'PNG o JPG. El archivo no sale de tu equipo.',
  quitar: 'Quitar',
  qr: 'Agregar un código QR',
  qrDestino: '¿A dónde lleva el QR?',
  qrWhatsapp: 'A tu WhatsApp',
  qrLiga: 'A una liga',
  qrLigaCampo: 'Liga del QR',
  qrSinNumero: 'Escribe tu WhatsApp en tus datos para armar el QR.',
  colores: 'Colores',
  combinaciones: 'Combinaciones',
  fondo: 'Fondo',
  tinta: 'Texto',
  acento: 'Acento',
  suave: 'Segundo fondo',
  tipografias: 'Tipografías',
  fTitulo: 'Para títulos',
  fTexto: 'Para el resto',
  delDiseno: 'La del diseño',
  pie: 'Poner «Hecho con Avelina · avelina.com.mx» al pie',
  sangrado: 'PDF para imprenta con 3 mm de sangrado y marcas de corte',
  sangradoAyuda: (m) => `PDF de ${m} más 3 mm de sangrado por lado, con marcas de corte.`,
  folio: 'Folio consecutivo',
  folioActivar: 'Numerar cada pieza con folio consecutivo',
  folioInicio: 'Primer número',
  folioHojas: 'Cuántas hojas o páginas bajar',
  folioAyuda: 'Cada descarga sigue la numeración. El número que sigue se guarda en este equipo.',
  folioSigue: (n) => `El siguiente número es ${n}.`,
  mover: 'Mover y cambiar tamaño',
  moverAyuda: 'Arrastra un texto o una imagen en la vista. En celular, tócalo y usa los botones.',
  nada: 'Nada elegido',
  arriba: 'Subir', abajo: 'Bajar', izq: 'Mover a la izquierda', der: 'Mover a la derecha',
  menos: 'Más chico', mas: 'Más grande', reiniciar: 'Regresar a su lugar', todo: 'Todo a su lugar',
  editarTexto: 'Editar este texto',
  descargar: 'Descargar',
  png: 'Descargar PNG',
  pdf: 'Descargar PDF',
  hoja: 'Hoja carta para imprimir',
  zip: 'Todas las caras en ZIP',
  pngAyuda: (w, h, ppp) => `PNG de ${w} × ${h} px` + (ppp ? ` a ${ppp} ppp.` : '.'),
  pdfAyuda: (m) => `PDF del tamaño real: ${m}.`,
  hojaAyuda: (n) => `${n} por hoja con marcas de corte. Si imprimes por los dos lados, la segunda hoja ya viene acomodada.`,
  preparando: 'Preparando tu archivo…',
  listo: 'Listo. Revisa tus descargas.',
  error: 'No se pudo armar el archivo. Prueba con una medida más chica.',
  vistaDe: 'Vista previa',
  guia: 'Las líneas punteadas no salen en el archivo.',
  persona: ' · La figura gris mide 1.70 m',
  mueve: (n) => `Mover ${n}`,
};

const NOMBRES_ESPECIALES = { logo: 'Logo', foto: 'Foto', qr: 'Código QR', numero: 'Número' };
const MAX_AREA = 36e6;
const LADO_MAX = 16000;

// Combinaciones de color que funcionan en casi cualquier diseño.
export const PALETAS = [
  { fondo: '#F4EFE6', tinta: '#1E1B16', acento: '#C2410C', suave: '#E7DDCB' },
  { fondo: '#FFFFFF', tinta: '#111111', acento: '#1D4ED8', suave: '#EEF1F6' },
  { fondo: '#15201B', tinta: '#F2EEE3', acento: '#D9B45B', suave: '#22312A' },
  { fondo: '#FBF3EE', tinta: '#3A2420', acento: '#B4536A', suave: '#F2E1D9' },
  { fondo: '#0F172A', tinta: '#F8FAFC', acento: '#F59E0B', suave: '#1E293B' },
  { fondo: '#FFF8E7', tinta: '#2B2118', acento: '#0F766E', suave: '#F3E6C4' },
  { fondo: '#F2F2F0', tinta: '#0B0B0B', acento: '#0B0B0B', suave: '#E2E2DE' },
  { fondo: '#1F2A44', tinta: '#FFFFFF', acento: '#E4572E', suave: '#2C3A5C' },
];

function guardar(clave, v) { try { localStorage.setItem(clave, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
function leer(clave) { try { return JSON.parse(localStorage.getItem(clave) || 'null'); } catch (e) { return null; } }

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  asegurarCSS(ID);
  const t = unirTextos(TEXTOS, opciones);
  const modo = MODOS[opciones.modo] ? opciones.modo : 'tarjeta-presentacion';
  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ahd', lang: opciones.idioma || 'es-MX', 'data-modo': modo });
  const aviso = h('p', { class: 'ah-nota', text: t.cargando });
  raiz.append(aviso);
  contenedor.append(raiz);
  let vivo = true;
  const url = new URL(`./editor-diseno/${MODOS[modo]}.js`, import.meta.url).href;
  import(url).then((m) => {
    if (!vivo) return;
    const def = m.default;
    const cfg = typeof def === 'function' ? def(modo) : def;
    raiz.textContent = '';
    armar(contenedor, raiz, cfg, modo, t, opciones);
  }).catch((e) => { aviso.textContent = t.fallo; console.error(e); });
  return { destruir() { vivo = false; contenedor.textContent = ''; } };
}

function armar(contenedor, raiz, cfg, modo, t, opciones) {
  const disenos = cfg.disenos;
  // opciones.diseno / opciones.formato: con qué abre la página (cada página guarda lo suyo aparte).
  const disIni = disenos.findIndex((d) => d.id === opciones.diseno);
  const hay = (id) => cfg.formatos.some((f) => f.id === id);
  const fmtIni = hay(opciones.formato) ? opciones.formato : hay(FORMATO_MODO[modo]) ? FORMATO_MODO[modo] : (cfg.formatoInicial || cfg.formatos[0].id);
  const clave = 'avelina-' + ID + '-' + modo + (disIni >= 0 ? '-' + opciones.diseno : '') + (opciones.formato ? '-' + opciones.formato : '');
  const previo = leer(clave) || {};
  const st = {
    dis: disenos.some((d) => d.id === previo.dis) ? disenos.findIndex((d) => d.id === previo.dis) : Math.max(0, disIni),
    formato: cfg.formatos.some((f) => f.id === previo.formato) ? previo.formato : fmtIni,
    medida: previo.medida || null,
    cara: 0,
    datos: {}, editados: new Set(previo.editados || []),
    paleta: previo.paleta || null,
    fuentes: previo.fuentes || { titulo: '', texto: '' },
    mov: {}, sel: null,
    imgs: {},
    qr: Object.assign({ activo: false, tipo: 'whatsapp', liga: '' }, previo.qr || {}),
    pie: previo.pie !== false,
    sangrado: !!previo.sangrado,
    op: Object.assign({}, previo.op || {}),
  };
  for (const o of cfg.opciones || []) if (st.op[o.id] == null) st.op[o.id] = o.defecto;
  // Folio consecutivo: cfg.folio (cupón, opcional) o dis.folio con siempre (boletos). k.folio(i) da el número i de la pieza.
  const claveFolio = clave + '-folio';
  const folioPrev = leer(claveFolio) || {};
  st.folio = { activo: !!folioPrev.activo, inicio: folioPrev.inicio >= 1 ? folioPrev.inicio : 1, hojas: 1 };
  let folioDesde = null, folioUsados = 0;
  const folioCfg = () => cfg.folio || disenos[st.dis].folio || null;
  const folioActivo = () => { const f = folioCfg(); return !!f && (!!f.siempre || st.folio.activo); };
  const folioTxt = (n) => { const f = folioCfg() || {}; return (f.prefijo || '') + String(n).padStart(f.cifras || 3, '0'); };
  const ejemplo = () => disenos[st.dis].ejemplo || {};
  for (const c of cfg.campos) st.datos[c.id] = st.editados.has(c.id) && previo.datos && c.id in previo.datos ? previo.datos[c.id] : (ejemplo()[c.id] ?? '');

  // ---------- controles ----------
  const columna = h('div', { class: 'ah-columna ahd-controles' });
  const vista = h('div', { class: 'ah-vista ahd-vista' });
  raiz.append(vista, columna);

  // diseños
  const grupoDis = h('fieldset', { class: 'ahd-disenos' }, h('legend', { class: 'ah-etiqueta', text: t.disenos }));
  const rejillaDis = h('div', { class: 'ahd-rejilla' });
  grupoDis.append(rejillaDis);
  const nombreGrupo = 'ahd-dis-' + Math.random().toString(36).slice(2, 7);
  const miniaturas = disenos.map((d, i) => {
    const r = h('input', { type: 'radio', name: nombreGrupo, value: String(i), checked: i === st.dis, class: 'ahd-dis-radio', 'aria-label': d.nombre });
    r.addEventListener('change', () => r.checked && elegirDiseno(i));
    const lienzo = h('canvas', { class: 'ahd-mini', 'aria-hidden': 'true' });
    const l = h('label', { class: 'ahd-dis' }, r, lienzo, h('span', { text: d.nombre }));
    rejillaDis.append(l);
    return lienzo;
  });

  // medida
  const formatoActual = () => {
    const f = cfg.formatos.find((x) => x.id === st.formato) || cfg.formatos[0];
    if (f.medida && st.medida) return Object.assign({}, f, st.medida);
    return f;
  };
  let chipsFormato = null;
  const cajaMedida = h('div', { class: 'ah-fila', hidden: true });
  if (cfg.formatos.length > 1) {
    chipsFormato = opcionesChip('ahd-formato', t.medida, cfg.formatos.map((f) => [f.id, f.nombre]), st.formato, (v) => {
      st.formato = v; st.mov = {}; st.sel = null; mostrarMedida(); todo();
    });
    const fm = cfg.formatos.find((f) => f.medida);
    if (fm) {
      const base = st.medida || { ancho: fm.ancho, alto: fm.alto };
      const ent = (k) => {
        const i = h('input', { type: 'number', class: 'ah-input', min: 10, max: 500, step: 1, inputmode: 'decimal', value: String(Math.round(base[k] / 10)) });
        i.addEventListener('input', () => {
          const v = parseFloat(i.value);
          if (!(v >= 5 && v <= 500)) return;
          st.medida = Object.assign({ ancho: fm.ancho, alto: fm.alto }, st.medida || {}, { [k]: v * 10 });
          todo();
        });
        return i;
      };
      cajaMedida.append(campo(t.ancho, ent('ancho')), campo(t.alto, ent('alto')));
    }
  }
  function mostrarMedida() { cajaMedida.hidden = !formatoActual().medida; }

  // caras
  const chipsCara = h('div', { class: 'ahd-caras' });

  // textos
  const camposEl = {};
  const bloqueTextos = h('div', { class: 'ah-grupo' }, h('h3', { class: 'ahd-sub', text: t.textos }), h('p', { class: 'ah-ayuda', text: t.textosAyuda }));
  for (const c of cfg.campos) {
    const attrs = { class: 'ah-input', value: st.datos[c.id] || '', autocomplete: 'off' };
    let el;
    if (c.tipo === 'area') el = h('textarea', Object.assign(attrs, { rows: c.filas || 3 }));
    else if (c.tipo === 'select') {
      el = h('select', { class: 'ah-input' }, c.lista.map(([v, txt]) => h('option', { value: v, text: txt })));
      el.value = st.datos[c.id] || c.lista[0][0];
    } else el = h('input', Object.assign(attrs, { type: c.tipo === 'tel' ? 'tel' : 'text', inputmode: c.tipo === 'tel' ? 'tel' : null, maxlength: c.max || 140 }));
    if (c.tipo === 'area') el.value = st.datos[c.id] || '';
    el.addEventListener('input', () => { st.datos[c.id] = el.value; st.editados.add(c.id); programar(); });
    el.addEventListener('change', () => { st.datos[c.id] = el.value; st.editados.add(c.id); programar(); });
    camposEl[c.id] = el;
    bloqueTextos.append(campo(c.etiqueta, el, c.ayuda));
  }

  // opciones del modo
  const bloqueOpciones = h('div', { class: 'ah-grupo' });
  for (const o of cfg.opciones || []) {
    bloqueOpciones.append(opcionesChip('ahd-op', o.etiqueta, o.lista, st.op[o.id], (v) => { st.op[o.id] = v; todo(); }));
  }

  // imágenes
  const bloqueImg = h('div', { class: 'ah-grupo' });
  const imgs = cfg.imagenes || ['logo'];
  if (imgs.length) bloqueImg.append(h('h3', { class: 'ahd-sub', text: t.imagenes }));
  for (const k of imgs) {
    const entrada = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,image/svg+xml', class: 'ah-archivo' });
    const bq = boton(t.quitar, () => { delete st.imgs[k]; entrada.value = ''; bq.hidden = true; todo(); }, 'ah-liga');
    bq.hidden = true;
    entrada.addEventListener('change', async () => {
      const a = entrada.files && entrada.files[0];
      if (!a) return;
      try {
        const { img, url } = await leerImagen(a);
        st.imgs[k] = await registroImagen(img, url);
        bq.hidden = false;
        todo();
      } catch (e) { est.decir(t.error); }
    });
    bloqueImg.append(h('div', { class: 'ah-campo' }, h('label', { class: 'ah-etiqueta', for: entrada.id = 'ahd-' + k + Math.random().toString(36).slice(2, 6), text: k === 'logo' ? t.logo : t.foto }), entrada, bq, h('p', { class: 'ah-ayuda', text: t.imagenAyuda })));
  }

  // QR
  const bloqueQR = h('div', { class: 'ah-grupo' });
  if (cfg.qr) {
    const chk = h('input', { type: 'checkbox', checked: st.qr.activo });
    const destino = opcionesChip('ahd-qr', t.qrDestino, [['whatsapp', t.qrWhatsapp], ['liga', t.qrLiga]], st.qr.tipo, (v) => { st.qr.tipo = v; ligaC.hidden = v !== 'liga'; todo(); });
    const liga = h('input', { type: 'url', class: 'ah-input', value: st.qr.liga, placeholder: 'https://', inputmode: 'url', autocomplete: 'off' });
    liga.addEventListener('input', () => { st.qr.liga = liga.value.trim(); programar(); });
    const ligaC = campo(t.qrLigaCampo, liga);
    const sub = h('div', { class: 'ah-grupo', hidden: !st.qr.activo }, destino, ligaC);
    ligaC.hidden = st.qr.tipo !== 'liga';
    chk.addEventListener('change', () => { st.qr.activo = chk.checked; sub.hidden = !chk.checked; todo(); });
    bloqueQR.append(h('label', { class: 'ah-check' }, chk, h('span', { text: t.qr })), sub);
  }

  // folio
  const bloqueFolio = h('div', { class: 'ah-grupo', hidden: true }, h('h3', { class: 'ahd-sub', text: t.folio }));
  const chkFolio = h('input', { type: 'checkbox', checked: st.folio.activo });
  const filaChkFolio = h('label', { class: 'ah-check' }, chkFolio, h('span', { text: t.folioActivar }));
  const numero = (v, max) => h('input', { type: 'number', class: 'ah-input', min: 1, max, step: 1, inputmode: 'numeric', value: String(v) });
  const entInicio = numero(st.folio.inicio, 999999), entHojas = numero(1, 50);
  const cajaFolio = h('div', { class: 'ah-fila' }, campo(t.folioInicio, entInicio), campo(t.folioHojas, entHojas));
  bloqueFolio.append(filaChkFolio, cajaFolio, h('p', { class: 'ah-ayuda', text: t.folioAyuda }));
  chkFolio.addEventListener('change', () => { st.folio.activo = chkFolio.checked; guardarFolio(); mostrarFolio(); todo(); });
  entInicio.addEventListener('input', () => { const v = parseInt(entInicio.value, 10); if (v >= 1 && v <= 999999) { st.folio.inicio = v; guardarFolio(); programar(); } });
  entHojas.addEventListener('input', () => { const v = parseInt(entHojas.value, 10); if (v >= 1 && v <= 50) st.folio.hojas = v; });
  function mostrarFolio() {
    const f = folioCfg();
    bloqueFolio.hidden = !f; filaChkFolio.hidden = !f || !!f.siempre; cajaFolio.hidden = !folioActivo();
    const c = cfg.folio && camposEl[cfg.folio.campo];
    if (c) c.disabled = folioActivo();
  }
  function guardarFolio() { guardar(claveFolio, { activo: st.folio.activo, inicio: st.folio.inicio }); }
  function avanzarFolio(n) { if (!n) return; st.folio.inicio += n; entInicio.value = String(st.folio.inicio); guardarFolio(); }

  // colores
  const bloqueColor = h('div', { class: 'ah-grupo' }, h('h3', { class: 'ahd-sub', text: t.colores }));
  const filaPaletas = h('div', { class: 'ahd-paletas', role: 'group', 'aria-label': t.combinaciones });
  const selColor = {};
  const roles = [['fondo', t.fondo], ['tinta', t.tinta], ['acento', t.acento], ['suave', t.suave]];
  const cajaSel = h('div', { class: 'ahd-colores' });
  for (const [k, txt] of roles) {
    selColor[k] = selectorColor(txt, paleta()[k], (v) => { st.paleta = Object.assign({}, paleta(), { [k]: v }); pintarPaletas(); programar(); });
    cajaSel.append(selColor[k]);
  }
  bloqueColor.append(filaPaletas, cajaSel);

  // tipografías
  const bloqueFuente = h('div', { class: 'ah-grupo' }, h('h3', { class: 'ahd-sub', text: t.tipografias }));
  const selF = {};
  for (const [rol, txt] of [['titulo', t.fTitulo], ['texto', t.fTexto]]) {
    const s = h('select', { class: 'ah-input' }, h('option', { value: '', text: t.delDiseno }), FUENTES.map(([id, n, fam]) => h('option', { value: id, text: `${n} · ${fam}` })));
    s.value = st.fuentes[rol] || '';
    s.addEventListener('change', () => { st.fuentes[rol] = s.value; todo(); });
    selF[rol] = s;
    bloqueFuente.append(campo(txt, s));
  }

  const chkPie = h('input', { type: 'checkbox', checked: st.pie });
  chkPie.addEventListener('change', () => { st.pie = chkPie.checked; todo(); });
  const chkSangrado = h('input', { type: 'checkbox', checked: st.sangrado });
  chkSangrado.addEventListener('change', () => { st.sangrado = chkSangrado.checked; programar(0); });
  const filaSangrado = h('label', { class: 'ah-check', hidden: true }, chkSangrado, h('span', { text: t.sangrado }));

  columna.append(grupoDis);
  if (chipsFormato) columna.append(chipsFormato, cajaMedida);
  columna.append(bloqueTextos);
  if ((cfg.opciones || []).length) columna.append(bloqueOpciones);
  columna.append(bloqueFolio);
  columna.append(bloqueImg, bloqueQR, bloqueColor, bloqueFuente, h('label', { class: 'ah-check' }, chkPie, h('span', { text: t.pie })));

  // ---------- vista ----------
  const lienzo = h('canvas', { class: 'ahd-lienzo', role: 'img', 'aria-label': t.vistaDe });
  const capa = h('div', { class: 'ahd-capa' });
  const marco = h('div', { class: 'ahd-marco' }, lienzo, capa);
  const persona = h('div', { class: 'ahd-persona', hidden: true, title: '1.70 m', 'aria-hidden': 'true' });
  persona.innerHTML = '<svg viewBox="0 0 430 1700" preserveAspectRatio="xMidYMax meet"><circle cx="215" cy="110" r="100" fill="#5a5a5a"/><path d="M95 260h240a60 60 0 0 1 60 60v520h-70v860h-90v-640h-40v640h-90v-860h-70v-520a60 60 0 0 1 60-60z" fill="#5a5a5a"/></svg>';
  const escenario = h('div', { class: 'ahd-escenario' }, persona, marco);
  const medidaTxt = h('p', { class: 'ah-nota ahd-medida' });
  const notaGuia = h('p', { class: 'ah-nota', text: t.guia, hidden: true });

  const selNombre = h('p', { class: 'ahd-sel', text: t.nada });
  const bt = (txt, lbl, fn) => h('button', { type: 'button', class: 'ah-boton ah-boton-2 ahd-mini-boton', 'aria-label': lbl, title: lbl, text: txt, onclick: fn });
  const paso = () => Math.min(dimW(), dimH()) * 0.01;
  const botonesMover = h('div', { class: 'ahd-mover' },
    bt('←', t.izq, () => mover(-paso(), 0)), bt('↑', t.arriba, () => mover(0, -paso())),
    bt('↓', t.abajo, () => mover(0, paso())), bt('→', t.der, () => mover(paso(), 0)),
    bt('−', t.menos, () => escalar(1 / 1.08)), bt('+', t.mas, () => escalar(1.08)));
  const bReiniciar = boton(t.reiniciar, () => { if (st.sel) { delete st.mov[st.sel]; todo(); } }, 'ah-liga');
  const bTodo = boton(t.todo, () => { st.mov = {}; todo(); }, 'ah-liga');
  const bEditar = boton(t.editarTexto, () => { const c = camposEl[st.sel]; if (c) c.focus(); }, 'ah-liga');
  const panelMover = h('details', { class: 'ahd-panel-mover' },
    h('summary', { text: t.mover }), h('p', { class: 'ah-ayuda', text: t.moverAyuda }), selNombre, botonesMover,
    h('div', { class: 'ahd-ligas' }, bEditar, bReiniciar, bTodo));

  const est = estado();
  const bPNG = boton(t.png, () => accion('png'));
  const bPDF = boton(t.pdf, () => accion('pdf'), 'ah-boton ah-boton-2');
  const bHoja = boton(t.hoja, () => accion('hoja'), 'ah-boton ah-boton-2');
  const bZIP = boton(t.zip, () => accion('zip'), 'ah-boton ah-boton-2');
  const ayudaDesc = h('p', { class: 'ah-nota ahd-ayuda-desc' });
  vista.append(chipsCara, escenario, medidaTxt, notaGuia, panelMover,
    h('div', { class: 'ah-acciones' }, bPNG, bPDF, bHoja, bZIP), filaSangrado, ayudaDesc, est);

  // ---------- estado derivado ----------
  function paleta() { return st.paleta || disenos[st.dis].paleta || PALETAS[0]; }
  function dimW() { return formatoActual().ancho; }
  function dimH() { return formatoActual().alto; }
  function rolFuente(dis, rol) {
    if (rol === 'titulo' || rol === 'texto') return st.fuentes[rol] || (dis.fuentes && dis.fuentes[rol]) || 'archivo-400';
    if (rol === 'extra') return (dis.fuentes && dis.fuentes.extra) || st.fuentes.titulo || 'archivo-700';
    return rol;
  }
  function qrTexto() {
    if (!cfg.qr || !st.qr.activo) return null;
    if (st.qr.tipo === 'liga') return st.qr.liga || null;
    const n = numeroWhatsApp('52', st.datos.whatsapp || st.datos.telefono || '');
    return n.valido ? ligaWhatsApp(n.completo) : null;
  }

  let fuentesCargadas = {};
  async function fuentesDe(dis) {
    const ids = ['archivo-400', rolFuente(dis, 'titulo'), rolFuente(dis, 'texto'), rolFuente(dis, 'extra')];
    const f = await cargarFuentes(ids);
    Object.assign(fuentesCargadas, f);
    return fuentesCargadas;
  }

  // Arma las caras de un diseño. datos/paleta propios para miniaturas.
  function escena(dis, datos, pal, fmt, conMov, presentes, qr) {
    const W = fmt.ancho, H = fmt.alto, u = Math.min(W, H) / 100;
    const fu = fuentesCargadas;
    const desde = folioDesde ?? st.folio.inicio;
    if (conMov && cfg.folio && cfg.folio.campo && folioActivo()) { datos = Object.assign({}, datos, { [cfg.folio.campo]: folioTxt(desde) }); folioUsados = Math.max(folioUsados, 1); }
    const res = (el) => { if (el && el.tipo === 'texto') el.fuente = rolFuente(dis, el.fuente || 'texto'); return el; };
    const k = {
      W, H, u, d: datos, p: pal, op: st.op, formato: fmt.id, unidad: fmt.u || 'mm',
      vertical: H > W * 1.08, horizontal: W > H * 1.08, ratio: W / H,
      logo: !!presentes.logo, foto: !!presentes.foto, qr,
      folio(i = 0) { folioUsados = Math.max(folioUsados, i + 1); return folioTxt(desde + i); },
      mezclar, oscuro: esOscuro,
      T(c, o) { const v = datos[c]; if (v == null || !String(v).trim()) return null; return Object.assign({ tipo: 'texto', id: c, campo: c, texto: String(v), fuente: 'texto', color: pal.tinta }, o); },
      X(texto, o) { if (!texto) return null; return Object.assign({ tipo: 'texto', texto: String(texto), fuente: 'texto', color: pal.tinta }, o); },
      R: (x, y, w, h2, color, o) => Object.assign({ tipo: 'rect', x, y, w, h: h2, color }, o),
      E: (x, y, w, h2, color, o) => Object.assign({ tipo: 'elipse', x, y, w, h: h2, color }, o),
      L: (x1, y1, x2, y2, color, grosor, o) => Object.assign({ tipo: 'linea', x1, y1, x2, y2, color, grosor: grosor || u * 0.3 }, o),
      F: (d, x, y, w, h2, color, o) => Object.assign({ tipo: 'forma', d, x, y, w, h: h2, color }, o),
      Ico: (n, x, y, s, color, o) => Object.assign({ tipo: 'forma', d: ICONOS[n] || ICONOS.estrella, x, y, w: s, h: s, color: null, borde: color, grosor: s * 0.085, cap: 'round', junta: 'round' }, o),
      I(src, x, y, w, h2, o) { if (!presentes[src]) return null; return Object.assign({ tipo: 'imagen', id: src, src, x, y, w, h: h2, ajuste: src === 'logo' ? 'contener' : 'cubrir' }, o); },
      Q(x, y, w, o = {}) {
        if (!qr) return null;
        const fondo = o.sobre || pal.fondo;
        const oscuroSobre = esOscuro(fondo);
        const tinta = o.color || (oscuroSobre ? '#111111' : (contraste(pal.tinta, fondo) > 4.5 ? pal.tinta : '#111111'));
        return { tipo: 'qr', id: 'qr', datos: qr, x, y, w, color: tinta, fondo: oscuroSobre ? '#FFFFFF' : (o.conFondo ? fondo : null) };
      },
      medir(el) { if (!el) return { x: 0, y: 0, w: 0, h: 0, alto: 0 }; res(el); const c = componer(fu[el.fuente] || fu['archivo-400'], el); return Object.assign({}, c.caja, { alto: c.alto, tam: c.tam, lineas: c.lineas, base: c.base }); },
      // Acomoda textos uno debajo de otro desde y. Devuelve la y final.
      flujo(y, lista, sep) {
        for (const el of lista) { if (!el) continue; el.y = y; el.vy = 'arriba'; const m = k.medir(el); y += m.h + (el.sep ?? sep ?? u * 2); }
        return y;
      },
      // Datos de contacto con su icono. o: {x,y,w,tam,color,colorIco,campos,sep,icono,alin,fuente}
      contactos(o) {
        const ICO = { telefono: 'telefono', whatsapp: 'whatsapp', correo: 'correo', web: 'web', direccion: 'ubicacion', horario: 'reloj', instagram: 'instagram', facebook: 'facebook' };
        const lista = (o.campos || ['telefono', 'whatsapp', 'correo', 'web', 'direccion']).filter((c) => datos[c] && String(datos[c]).trim());
        const out = [];
        let y = o.y;
        const ico = o.icono !== false;
        const s = o.tam * 1.25, hueco = ico ? s + o.tam * 0.7 : 0;
        const der = o.alin === 'der';
        for (const c of lista) {
          const tx = k.T(c, { x: der ? o.x : o.x + hueco, y, w: o.w - hueco, tam: o.tam, fuente: o.fuente || 'texto', color: o.color || pal.tinta, maxLineas: o.maxLineas || 2, alin: o.alin || 'izq', interlinea: 1.25, espaciado: o.espaciado || 0 });
          const m = k.medir(tx);
          const capT = k.medir(k.X('H', { x: 0, y: 0, tam: m.tam, fuente: tx.fuente })).alto;
          if (ico) out.push(k.Ico(ICO[c] || 'chat', der ? o.x + o.w - s : o.x, y + capT / 2 - s / 2, s, o.colorIco || o.color || pal.tinta, { id: c }));
          out.push(tx);
          y += m.h + (o.sep ?? o.tam * 0.55);
        }
        return { el: out, y };
      },
      // Prueba fn(f) con f cada vez más chico hasta que lo que arma termina antes de «limite».
      encajar(fn, limite) {
        let f = 1, r;
        for (let i = 0; i < 16; i++) { r = fn(f); if (r.y <= limite) break; f *= 0.94; }
        return r.el;
      },
      altoDe(lista, sep) { let y = 0; for (const el of lista) { if (!el) continue; const m = k.medir(Object.assign({}, el, { y: 0, vy: 'arriba' })); y += m.h + (el.sep ?? sep ?? u * 2); } return y - (sep ?? u * 2); },
    };
    let caras = dis.dibujar(k);
    if (!Array.isArray(caras)) caras = [caras];
    caras = caras.map((c, i) => ({
      nombre: c.nombre || (cfg.caras && cfg.caras[i]) || '', ancho: W, alto: H,
      fondo: c.fondo === undefined ? pal.fondo : c.fondo, guias: c.guias || [],
      el: c.el.flat(4).filter(Boolean).map(res),
    }));
    // Logo o QR que el diseño no acomodó: van a la esquina más libre.
    const todos = caras.flatMap((c) => c.el);
    const esquinaLibre = (cara, w, h2) => {
      const m = u * 5;
      const cands = [[m, m], [W - w - m, m], [m, H - h2 - m * 1.4], [W - w - m, H - h2 - m * 1.4]];
      const cajas = cara.el.filter((e) => e.tipo === 'texto' || e.tipo === 'imagen' || e.tipo === 'qr').map((e) => limites(e, fu)).filter(Boolean);
      let mejor = cands[0], menor = Infinity;
      for (const [x, y] of cands) {
        let a = 0;
        for (const b of cajas) a += Math.max(0, Math.min(x + w, b.x + b.w) - Math.max(x, b.x)) * Math.max(0, Math.min(y + h2, b.y + b.h) - Math.max(y, b.y));
        if (a < menor) { menor = a; mejor = [x, y]; }
      }
      return mejor;
    };
    if (presentes.logo && !todos.some((e) => e.src === 'logo')) {
      const w = u * 18, [x, y] = esquinaLibre(caras[0], w, w);
      caras[0].el.push(k.I('logo', x, y, w, w));
    }
    if (qr && !todos.some((e) => e.tipo === 'qr')) {
      const c = caras[caras.length > 1 && cfg.qrAtras ? 1 : 0];
      const w = u * 18, [x, y] = esquinaLibre(c, w, w);
      c.el.push(k.Q(x, y, w, { sobre: c.fondo }));
    }
    if (conMov) {
      for (const c of caras) for (const el of c.el) {
        const m = el.id && st.mov[el.id];
        if (!m) continue;
        delete el._c;
        const dx = m.dx || 0, dy = m.dy || 0, e = m.k || 1;
        if (el.tipo === 'linea') { el.x1 += dx; el.x2 += dx; el.y1 += dy; el.y2 += dy; continue; }
        el.x += dx; el.y += dy;
        if (e !== 1) {
          if (el.tipo === 'texto') { el.tam *= e; if (el.w) { const x0 = el.x, w0 = el.w; el.w *= e; if (el.alin === 'centro') el.x = x0 + (w0 - el.w) / 2; else if (el.alin === 'der') el.x = x0 + w0 - el.w; } }
          else if (el.w) { const cx = el.x + el.w / 2, cy = el.y + (el.h || el.w) / 2; el.w *= e; if (el.h) el.h *= e; el.x = cx - el.w / 2; el.y = cy - (el.h || el.w) / 2; }
        }
      }
    }
    return caras;
  }

  // ---------- pintar ----------
  let caras = [];
  let cajas = [];
  async function render() {
    const dis = disenos[st.dis];
    await fuentesDe(dis);
    const fmt = formatoActual();
    caras = piezaCon(st.folio.inicio);
    if (st.cara >= caras.length) st.cara = 0;
    pintarCaras();
    const cara = caras[st.cara];
    const ancho = Math.max(120, (escenario.clientWidth || 600) - 38);
    const altoMax = Math.max(260, Math.min(window.innerHeight * 0.68, 760));
    // Lonas y letreros: una persona de 1.70 m al lado para ver la escala.
    const conPersona = fmt.u !== 'px' && Math.max(cara.ancho, cara.alto) >= 700;
    const extraW = conPersona ? 560 : 0, altoRef = conPersona ? Math.max(cara.alto, 1700) : cara.alto;
    let esc = Math.min(ancho / (cara.ancho + extraW), altoMax / altoRef);
    if (!conPersona) esc = Math.min(ancho / cara.ancho, altoMax / cara.alto);
    const w = cara.ancho * esc, hh = cara.alto * esc;
    persona.hidden = !conPersona;
    if (conPersona) { persona.style.height = (1700 * esc) + 'px'; persona.style.width = (430 * esc) + 'px'; persona.style.marginRight = (130 * esc) + 'px'; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    lienzo.width = Math.round(w * dpr); lienzo.height = Math.round(hh * dpr);
    marco.style.width = w + 'px'; marco.style.height = hh + 'px';
    const ctx = lienzo.getContext('2d');
    const s = lienzo.width / cara.ancho;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, cara.ancho, cara.alto);
    pintarCara(destinoCanvas(ctx), cara, { fuentes: fuentesCargadas, imagenes: st.imgs, pie: st.pie });
    const guias = cara.guias.concat(fmt.guias ? fmt.guias(cara.ancho, cara.alto) : []);
    if (guias.length) {
      ctx.save();
      ctx.setLineDash([6 / s, 5 / s]);
      ctx.lineWidth = 1.2 / s;
      for (const g of guias) {
        ctx.strokeStyle = esOscuro(cara.fondo || '#ffffff') ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.55)';
        ctx.beginPath();
        if (g.w != null) ctx.rect(g.x, g.y, g.w, g.h); else { ctx.moveTo(g.x1, g.y1); ctx.lineTo(g.x2, g.y2); }
        ctx.stroke();
      }
      ctx.restore();
    }
    notaGuia.hidden = !guias.length;
    pintarCapa(cara, w / cara.ancho);
    pintarDatosDescarga(fmt, caras.length);
    guardar(clave, { dis: dis.id, formato: st.formato, medida: st.medida, datos: st.datos, editados: [...st.editados], paleta: st.paleta, fuentes: st.fuentes, qr: st.qr, pie: st.pie, sangrado: st.sangrado, op: st.op });
  }

  // Caras de la pieza con su primer folio en «desde»; caras.folios = cuántos números usa (0 sin folio).
  function piezaCon(desde) {
    folioDesde = desde; folioUsados = 0;
    const c = escena(disenos[st.dis], st.datos, paleta(), formatoActual(), true, st.imgs, qrTexto());
    c.folios = folioActivo() ? Math.max(1, folioUsados) : 0;
    folioDesde = null;
    return c;
  }

  function pintarCaras() {
    const nombres = caras.map((c) => c.nombre);
    const clave2 = nombres.join('|');
    if (chipsCara.dataset.k === clave2) { chipsCara.querySelectorAll('input').forEach((r, i) => { r.checked = i === st.cara; }); return; }
    chipsCara.dataset.k = clave2;
    chipsCara.textContent = '';
    if (caras.length < 2) return;
    chipsCara.append(opcionesChip('ahd-cara', t.cara, nombres.map((n, i) => [String(i), n || String(i + 1)]), String(st.cara), (v) => { st.cara = +v; st.sel = null; programar(); }));
  }

  function nombreDe(id) {
    if (NOMBRES_ESPECIALES[id]) return NOMBRES_ESPECIALES[id];
    const c = cfg.campos.find((x) => x.id === id);
    return c ? c.etiqueta : id;
  }

  function pintarCapa(cara, esc) {
    const grupos = new Map();
    for (const el of cara.el) {
      if (!el.id) continue;
      const b = limites(el, fuentesCargadas);
      if (!b || !(b.w > 0) || !(b.h > 0)) continue;
      const g = grupos.get(el.id);
      if (!g) grupos.set(el.id, { x0: b.x, y0: b.y, x1: b.x + b.w, y1: b.y + b.h });
      else { g.x0 = Math.min(g.x0, b.x); g.y0 = Math.min(g.y0, b.y); g.x1 = Math.max(g.x1, b.x + b.w); g.y1 = Math.max(g.y1, b.y + b.h); }
    }
    const enfocado = document.activeElement && capa.contains(document.activeElement) ? document.activeElement.dataset.id : null;
    capa.textContent = '';
    cajas = [];
    for (const [id, g] of grupos) {
      const b = h('button', {
        type: 'button', class: 'ahd-caja' + (st.sel === id ? ' ahd-elegida' : ''), 'data-id': id,
        'aria-label': t.mueve(nombreDe(id)), 'aria-pressed': String(st.sel === id),
        style: `left:${g.x0 * esc}px;top:${g.y0 * esc}px;width:${(g.x1 - g.x0) * esc}px;height:${(g.y1 - g.y0) * esc}px`,
      });
      arrastre(b, id, esc);
      capa.append(b);
      cajas.push(b);
      if (enfocado === id) b.focus({ preventScroll: true });
    }
    selNombre.textContent = st.sel && grupos.has(st.sel) ? nombreDe(st.sel) : t.nada;
    const hay = !!(st.sel && grupos.has(st.sel));
    botonesMover.querySelectorAll('button').forEach((b) => { b.disabled = !hay; });
    bReiniciar.hidden = !hay || !st.mov[st.sel];
    bEditar.hidden = !hay || !camposEl[st.sel];
    bTodo.hidden = !Object.keys(st.mov).length;
  }

  function elegir(id) {
    st.sel = id;
    panelMover.open = true;
    for (const b of cajas) { const si = b.dataset.id === id; b.classList.toggle('ahd-elegida', si); b.setAttribute('aria-pressed', String(si)); }
    selNombre.textContent = id ? nombreDe(id) : t.nada;
    botonesMover.querySelectorAll('button').forEach((b) => { b.disabled = !id; });
    bReiniciar.hidden = !id || !st.mov[id];
    bEditar.hidden = !id || !camposEl[id];
  }

  function arrastre(b, id, esc) {
    let ini = null;
    b.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      b.focus({ preventScroll: true });
      elegir(id);
      const m = st.mov[id] || {};
      ini = { x: e.clientX, y: e.clientY, dx: m.dx || 0, dy: m.dy || 0, movio: false };
      b.setPointerCapture(e.pointerId);
    });
    b.addEventListener('pointermove', (e) => {
      if (!ini) return;
      const dx = (e.clientX - ini.x) / esc, dy = (e.clientY - ini.y) / esc;
      if (!ini.movio && Math.hypot(e.clientX - ini.x, e.clientY - ini.y) < 3) return;
      ini.movio = true;
      st.mov[id] = Object.assign({}, st.mov[id], { dx: ini.dx + dx, dy: ini.dy + dy });
      programar(0);
    });
    const fin = () => { ini = null; };
    b.addEventListener('pointerup', fin);
    b.addEventListener('pointercancel', fin);
    b.addEventListener('click', () => elegir(id));
    b.addEventListener('keydown', (e) => {
      const p = paso() * (e.shiftKey ? 5 : 1);
      const mapa = { ArrowLeft: [-p, 0], ArrowRight: [p, 0], ArrowUp: [0, -p], ArrowDown: [0, p] };
      if (mapa[e.key]) { e.preventDefault(); elegir(id); mover(...mapa[e.key]); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); elegir(id); escalar(1.08); }
      else if (e.key === '-') { e.preventDefault(); elegir(id); escalar(1 / 1.08); }
      else if (e.key === 'Escape') { elegir(null); }
    });
  }
  function mover(dx, dy) {
    if (!st.sel) return;
    const m = st.mov[st.sel] || {};
    st.mov[st.sel] = Object.assign({}, m, { dx: (m.dx || 0) + dx, dy: (m.dy || 0) + dy });
    programar(0);
  }
  function escalar(f) {
    if (!st.sel) return;
    const m = st.mov[st.sel] || {};
    st.mov[st.sel] = Object.assign({}, m, { k: Math.max(0.3, Math.min(4, (m.k || 1) * f)) });
    programar(0);
  }

  // ---------- paletas ----------
  function pintarPaletas() {
    const pal = paleta();
    const lista = [disenos[st.dis].paleta, ...(disenos[st.dis].paletas || []), ...PALETAS].filter(Boolean);
    const vistos = new Set();
    filaPaletas.textContent = '';
    lista.forEach((p, i) => {
      const k2 = JSON.stringify(p);
      if (vistos.has(k2)) return;
      vistos.add(k2);
      const activa = ['fondo', 'tinta', 'acento', 'suave'].every((r) => (p[r] || '').toUpperCase() === (pal[r] || '').toUpperCase());
      const b = h('button', { type: 'button', class: 'ahd-paleta' + (activa ? ' ahd-activa' : ''), 'aria-pressed': String(activa), 'aria-label': `${t.combinaciones} ${i + 1}` },
        ...['fondo', 'suave', 'acento', 'tinta'].map((r) => h('span', { style: `background:${p[r]}` })));
      b.addEventListener('click', () => { st.paleta = i === 0 ? null : Object.assign({}, p); sincronizarColores(); pintarPaletas(); programar(); });
      filaPaletas.append(b);
    });
  }
  function sincronizarColores() { const p = paleta(); for (const [k] of roles) selColor[k].fijar(p[k]); }

  // ---------- miniaturas ----------
  let turnoMini = 0;
  async function pintarMiniaturas() {
    const turno = ++turnoMini;
    const fmt = formatoActual();
    for (let i = 0; i < disenos.length; i++) {
      const dis = disenos[i];
      await fuentesDe(dis);
      if (turno !== turnoMini) return;
      const pal = dis.paleta || PALETAS[0];
      const datos = Object.assign({}, dis.ejemplo || {});
      const cara = escena(dis, datos, pal, fmt, false, {}, null)[0];
      const c = miniaturas[i];
      const lado = 220;
      const k = Math.min(lado / cara.ancho, lado / cara.alto);
      c.width = Math.round(cara.ancho * k); c.height = Math.round(cara.alto * k);
      const ctx = c.getContext('2d');
      ctx.setTransform(k, 0, 0, k, 0, 0);
      pintarCara(destinoCanvas(ctx), cara, { fuentes: fuentesCargadas, imagenes: {}, pie: false });
      await new Promise((ok) => setTimeout(ok, 0));
    }
  }

  function elegirDiseno(i) {
    st.dis = i; st.mov = {}; st.sel = null; st.paleta = null;
    for (const c of cfg.campos) {
      if (st.editados.has(c.id)) continue;
      st.datos[c.id] = (disenos[i].ejemplo || {})[c.id] ?? '';
      camposEl[c.id].value = st.datos[c.id];
    }
    sincronizarColores();
    pintarPaletas();
    mostrarFolio();
    todo();
  }

  // ---------- descargas ----------
  function pppDe(fmt) {
    if (fmt.u === 'px') return null;
    const wIn = fmt.ancho / 25.4, hIn = fmt.alto / 25.4;
    let ppp = 300;
    ppp = Math.min(ppp, Math.sqrt(MAX_AREA / (wIn * hIn)), LADO_MAX / Math.max(wIn, hIn));
    return Math.max(30, Math.floor(ppp));
  }
  function pxDe(fmt) {
    if (fmt.u === 'px') return [fmt.ancho, fmt.alto, null];
    const ppp = pppDe(fmt);
    return [Math.round((fmt.ancho / 25.4) * ppp), Math.round((fmt.alto / 25.4) * ppp), ppp];
  }
  const fmtMedida = (fmt) => {
    const cm = (v) => (v >= 1000 ? (v / 1000).toLocaleString('es-MX', { maximumFractionDigits: 2 }) + ' m' : (v / 10).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + ' cm');
    return fmt.u === 'px' ? `${fmt.ancho} × ${fmt.alto} px` : `${cm(fmt.ancho)} × ${cm(fmt.alto)}`;
  };
  function hojaDe(fmt) {
    if (!cfg.hoja || fmt.u === 'px') return null;
    const L = [215.9, 279.4], m = 7, g = 3;
    let mejor = null;
    for (const [W, H] of [L, [L[1], L[0]]]) {
      const cols = Math.floor((W - 2 * m + g) / (fmt.ancho + g)), filas = Math.floor((H - 2 * m + g) / (fmt.alto + g));
      if (cols * filas > 0 && (!mejor || cols * filas > mejor.n)) mejor = { W, H, cols, filas, n: cols * filas };
    }
    return mejor;
  }
  function pintarDatosDescarga(fmt, n) {
    const [w, hh, ppp] = pxDe(fmt);
    medidaTxt.textContent = fmtMedida(fmt) + (fmt.u !== 'px' && Math.max(fmt.ancho, fmt.alto) >= 700 ? t.persona : '');
    const hoja = hojaDe(fmt);
    bPDF.hidden = fmt.u === 'px';
    filaSangrado.hidden = fmt.u === 'px' || !CON_SANGRADO.includes(modo);
    bHoja.hidden = !hoja;
    bZIP.hidden = n < 2;
    const partes = [t.pngAyuda(w, hh, ppp)];
    if (fmt.u !== 'px') partes.push(conSangrado(fmt) ? t.sangradoAyuda(fmtMedida(fmt)) : t.pdfAyuda(fmtMedida(fmt)));
    if (hoja) partes.push(t.hojaAyuda(hoja.n));
    ayudaDesc.textContent = partes.join(' ');
  }

  async function lienzoDe(cara, fmt) {
    const [w, hh] = pxDe(fmt);
    const c = document.createElement('canvas');
    c.width = w; c.height = hh;
    const ctx = c.getContext('2d');
    if (!ctx) throw new Error('lienzo');
    ctx.setTransform(w / cara.ancho, 0, 0, hh / cara.alto, 0, 0);
    if (!cara.fondo) ctx.clearRect(0, 0, cara.ancho, cara.alto);
    pintarCara(destinoCanvas(ctx), cara, { fuentes: fuentesCargadas, imagenes: st.imgs, pie: st.pie });
    return c;
  }
  function contenidoPDF(pdf, cara, k, conPie) {
    const b = destinoPDF(pdf);
    b.agregar(`q ${k} 0 0 ${-k} 0 ${cara.alto * k} cm\n`);
    pintarCara(b, cara, { fuentes: fuentesCargadas, imagenes: st.imgs, pie: conPie });
    b.agregar('Q\n');
    return b.texto();
  }
  const conSangrado = (fmt) => st.sangrado && fmt.u !== 'px' && CON_SANGRADO.includes(modo);
  // Copia de la cara con el fondo y lo que toca la orilla estirados SANGRADO mm hacia afuera.
  function caraSangrada(cara) {
    const b = SANGRADO, W = cara.ancho, H = cara.alto, e = 0.01;
    const el = cara.el.map((x) => {
      if (!x || x.oculto || !(x.w > 0) || !(x.h > 0) || !['rect', 'elipse', 'forma', 'imagen'].includes(x.tipo) || (x.tipo === 'imagen' && x.ajuste !== 'cubrir')) return x;
      const y = Object.assign({}, x);
      if (x.x <= e) { y.x -= b; y.w += b; }
      if (x.x + x.w >= W - e) y.w += b;
      if (x.y <= e) { y.y -= b; y.h += b; }
      if (x.y + x.h >= H - e) y.h += b;
      return y;
    });
    if (cara.fondo) el.unshift({ tipo: 'rect', x: -b, y: -b, w: W + 2 * b, h: H + 2 * b, color: cara.fondo });
    return Object.assign({}, cara, { fondo: null, el });
  }
  // Página del PDF con sangrado: margen de MARGEN_CORTE mm, TrimBox/BleedBox y marcas de corte fuera del sangrado.
  function paginaSangrada(pdf, cara, k) {
    const m = MARGEN_CORTE, b = SANGRADO, W = cara.ancho + 2 * m, H = cara.alto + 2 * m, n = (v) => (v * k).toFixed(2);
    let s = `q 1 0 0 1 ${n(m)} ${n(m)} cm\n` + contenidoPDF(pdf, caraSangrada(cara), k, st.pie) + 'Q\n0 0 0 RG 0.25 w ';
    const fin = m - b - 1;
    for (const x of [m, m + cara.ancho]) s += `${n(x)} 0 m ${n(x)} ${n(fin)} l S ${n(x)} ${n(H - fin)} m ${n(x)} ${n(H)} l S `;
    for (const y of [m, m + cara.alto]) s += `0 ${n(y)} m ${n(fin)} ${n(y)} l S ${n(W - fin)} ${n(y)} m ${n(W)} ${n(y)} l S `;
    const caja = (a) => `[${n(a)} ${n(a)} ${n(W - a)} ${n(H - a)}]`;
    pdf.pagina(W * k, H * k, s, [], `/TrimBox${caja(m)}/BleedBox${caja(m - b)}`);
  }
  function marcasHoja(hoja, fmt, k) {
    const m = 7, g = 3, largo = 5 * k, sep = 1.5 * k;
    const anchoT = hoja.cols * fmt.ancho + (hoja.cols - 1) * g, altoT = hoja.filas * fmt.alto + (hoja.filas - 1) * g;
    const x0 = (hoja.W - anchoT) / 2, y0 = (hoja.H - altoT) / 2;
    const pos = [];
    for (let f = 0; f < hoja.filas; f++) for (let c = 0; c < hoja.cols; c++) pos.push([x0 + c * (fmt.ancho + g), y0 + f * (fmt.alto + g), c, f]);
    let s = '0 0 0 RG 0.3 w ';
    const xs = new Set(), ys = new Set();
    for (let c = 0; c < hoja.cols; c++) { xs.add(x0 + c * (fmt.ancho + g)); xs.add(x0 + c * (fmt.ancho + g) + fmt.ancho); }
    for (let f = 0; f < hoja.filas; f++) { ys.add(y0 + f * (fmt.alto + g)); ys.add(y0 + f * (fmt.alto + g) + fmt.alto); }
    const H = hoja.H * k;
    for (const x of xs) {
      const X = (x * k).toFixed(2);
      s += `${X} ${(H - y0 * k + sep).toFixed(2)} m ${X} ${(H - y0 * k + sep + largo).toFixed(2)} l S `;
      s += `${X} ${(H - (y0 + altoT) * k - sep).toFixed(2)} m ${X} ${(H - (y0 + altoT) * k - sep - largo).toFixed(2)} l S `;
    }
    for (const y of ys) {
      const Y = (H - y * k).toFixed(2);
      s += `${(x0 * k - sep).toFixed(2)} ${Y} m ${(x0 * k - sep - largo).toFixed(2)} ${Y} l S `;
      s += `${((x0 + anchoT) * k + sep).toFixed(2)} ${Y} m ${((x0 + anchoT) * k + sep + largo).toFixed(2)} ${Y} l S `;
    }
    return { s, pos, m };
  }
  function pieHoja(hoja, k) {
    const f = fuentesCargadas['archivo-400'];
    const c = componer(f, { texto: 'Hecho con Avelina · avelina.com.mx', x: hoja.W / 2, y: hoja.H - 2.2, vy: 'abajo', tam: 2.4, alin: 'centro', ajustar: false });
    let s = `q ${k} 0 0 ${-k} 0 ${hoja.H * k} cm `;
    const b = destinoPDF(null);
    for (const r of c.corridas) b.relleno(r.d, '#8C8C8C', 'nonzero', r.m);
    return s + b.texto() + 'Q\n';
  }

  async function accion(tipo) {
    const fmt = formatoActual();
    const base = nombreArchivo((cfg.archivo || modo) + (cfg.campoNombre === null ? '' : '-' + (st.datos[cfg.campoNombre || cfg.campos[0].id] || '')));
    est.decir(t.preparando, 0);
    try {
      await render();
      const cf = caras.folios, hojas = cf ? st.folio.hojas : 1;
      let usados = cf;
      if (tipo === 'png') {
        const c = await lienzoDe(caras[st.cara], fmt);
        const blob = await pngConPPP(c, pxDe(fmt)[2]);
        descargar(blob, base + (caras.length > 1 ? '-' + nombreArchivo(caras[st.cara].nombre) : '') + '.png');
      } else if (tipo === 'zip') {
        const archivos = [];
        for (const cara of caras) {
          const c = await lienzoDe(cara, fmt);
          archivos.push({ nombre: base + '-' + nombreArchivo(cara.nombre) + '.png', blob: await pngConPPP(c, pxDe(fmt)[2]) });
        }
        descargar(await zip(archivos), base + '.zip');
      } else if (tipo === 'pdf') {
        const k = 72 / 25.4;
        const pdf = new PDF();
        for (let n = 0; n < hojas; n++) {
          for (const cara of n ? piezaCon(st.folio.inicio + n * cf) : caras) {
            if (conSangrado(fmt)) paginaSangrada(pdf, cara, k);
            else pdf.pagina(cara.ancho * k, cara.alto * k, contenidoPDF(pdf, cara, k, st.pie));
          }
        }
        usados = hojas * cf;
        descargar(await pdf.blob(base), base + '.pdf');
      } else if (tipo === 'hoja') {
        const hoja = hojaDe(fmt);
        const k = 72 / 25.4;
        const pdf = new PDF();
        const mk = marcasHoja(hoja, fmt, k), porHoja = mk.pos.length;
        for (let n = 0; n < hojas; n++) {
          // Con folio, cada lugar de la hoja lleva su número (y el reverso, el mismo número en el lugar espejo).
          const piezas = cf ? mk.pos.map((_, j) => piezaCon(st.folio.inicio + (n * porHoja + j) * cf)) : null;
          caras.forEach((cara, i) => {
            const unica = cf ? null : pdf.forma(cara.ancho * k, cara.alto * k, contenidoPDF(pdf, cara, k, false));
            const formas = unica ? [unica] : [];
            let s = mk.s;
            mk.pos.forEach(([x, y, c, f], j) => {
              const fm = unica || pdf.forma(cara.ancho * k, cara.alto * k, contenidoPDF(pdf, piezas[j][i], k, false));
              if (!unica) formas.push(fm);
              const xx = i % 2 === 1 ? mk.pos.find((p) => p[2] === hoja.cols - 1 - c && p[3] === f)[0] : x;
              s += `q 1 0 0 1 ${(xx * k).toFixed(2)} ${((hoja.H - y - fmt.alto) * k).toFixed(2)} cm /${fm} Do Q `;
            });
            if (st.pie) s += pieHoja(hoja, k);
            pdf.pagina(hoja.W * k, hoja.H * k, s, formas);
          });
        }
        usados = hojas * porHoja * cf;
        descargar(await pdf.blob(base), base + '-hoja-carta.pdf');
      }
      avanzarFolio(usados);
      est.decir(t.listo + (usados ? ' ' + t.folioSigue(folioTxt(st.folio.inicio)) : ''));
      if (usados) programar(0);
      avisar(contenedor, ID, 'descargar');
    } catch (e) {
      console.error(e);
      est.decir(t.error, 6000);
    }
  }

  // ---------- ciclo ----------
  let temporizador = 0;
  let enCurso = null;
  function programar(ms = 90) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { enCurso = render().catch((e) => console.error(e)); }, ms);
  }
  function todo() { programar(0); pintarMiniaturas(); }

  mostrarMedida();
  mostrarFolio();
  sincronizarColores();
  pintarPaletas();
  render().then(() => pintarMiniaturas());
  let anchoPrevio = 0;
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => { const w = escenario.clientWidth; if (Math.abs(w - anchoPrevio) > 4) { anchoPrevio = w; programar(60); } }).observe(escenario);
  }
  // Para pruebas automáticas.
  raiz.ahd = { st, accion, piezaCon, render: () => render(), caras: () => caras, pxDe: () => pxDe(formatoActual()), elegirDiseno, listo: () => enCurso };
}

