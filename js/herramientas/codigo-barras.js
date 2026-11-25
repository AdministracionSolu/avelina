// Herramienta «codigo-barras» de Avelina.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// modos: ean13 (por defecto), ean8, upca, code128, code39, itf, hoja (abre la hoja de etiquetas)

import { codificar, FORMATOS } from './_barras-codificador.js';
import { pdf } from './_pdf.js';
import {
  h, campo, textos as unirTextos, avisar, descargar, estado, lienzoABlob, PIE, opcionesChip, boton,
  asegurarEstilos, nombreArchivo,
} from './_comun.js';

export { codificar };

const ID = 'codigo-barras';

export const TEXTOS = {
  formato: 'Tipo de código',
  nombres: { ean13: 'EAN-13', ean8: 'EAN-8', upca: 'UPC-A', code128: 'CODE128', code39: 'CODE39', itf: 'ITF' },
  valor: 'Número o texto',
  ayudas: {
    ean13: '12 dígitos y sale el verificador, o los 13 para revisarlo. En México empiezan con 750.',
    ean8: '7 dígitos y sale el verificador, o los 8 para revisarlo.',
    upca: '11 dígitos y sale el verificador, o los 12 para revisarlo.',
    code128: 'Letras, números y signos. Sirve para inventario, folios y envíos.',
    code39: 'Mayúsculas, números y - . $ / + % y espacio.',
    itf: 'Sólo números. Con 13 dígitos sale el ITF-14 de caja con su verificador.',
  },
  ejemplos: { ean13: '750123456789', ean8: '7501234', upca: '03600029145', code128: 'SKU-00125', code39: 'ALMACEN 12', itf: '1750123456789' },
  verificador39: 'Agregar carácter de control',
  calculado: (c) => `Dígito verificador calculado: ${c}. Ya va en el código.`,
  correcto: (c) => `El dígito verificador ${c} es correcto.`,
  errVerificador: (c, v) => `El último dígito debería ser ${c}. El código correcto es ${v}.`,
  errLargo: (n, l) => `${n} lleva ${l - 1} o ${l} dígitos.`,
  errDigitos: 'Este tipo de código sólo lleva números.',
  errCaracter: (c) => `Este tipo de código no acepta «${c}».`,
  ceroIzq: 'Se agregó un 0 al inicio. Este código lleva un número par de dígitos.',
  ejemplo: 'Es un ejemplo. Escribe tu número y cambia al momento.',
  ajustes: 'Tamaño',
  anchoBarra: 'Grosor de la barra más delgada',
  alto: 'Alto de las barras',
  numeros: 'Mostrar los números debajo',
  vista: 'Vista previa',
  png: 'Descargar PNG',
  svg: 'Descargar SVG',
  descargado: 'Listo. Revisa tus descargas.',
  hoja: 'Hoja de etiquetas para imprimir',
  hojaNota: 'Hoja tamaño carta. Mide tus etiquetas y elige la medida igual.',
  medida: 'Medida de la etiqueta',
  medidas: {
    e30: '30 por hoja · 6.7 × 2.5 cm (medida 5160)',
    e80: '80 por hoja · 4.4 × 1.3 cm (medida 5167)',
    e10: '10 por hoja · 10.2 × 5.1 cm (medida 5163)',
    e21: '21 por hoja · 6.4 × 3.8 cm',
  },
  lista: 'Códigos de la hoja, uno por renglón (opcional)',
  listaAyuda: 'Si lo dejas vacío, se repite el código de arriba.',
  cantidad: 'Cuántas etiquetas',
  pdf: 'Descargar PDF',
  imprimir: 'Imprimir',
  errLista: (n, v) => `El renglón ${n} («${v}») no sirve para este tipo de código.`,
  hojaLista: (n, p) => `${n} etiquetas en ${p} ${p === 1 ? 'hoja' : 'hojas'}.`,
  hojaVacia: 'Escribe un código arriba o una lista aquí.',
  pruebalo: 'Antes de imprimir muchas, imprime una hoja y pásala por tu lector.',
};

// ---------- dibujo en primitivas (px) ----------
// Devuelve {w, h, rects:[[x,y,w,h]], textos:[{x,y,tam,t,ancla}]}
export function dibujar(cod, { modulo = 2, alto = 100, numeros = true } = {}) {
  const m = modulo;
  const conTexto = numeros && cod.textos.length;
  const esGS1 = cod.textos.length > 1;
  const tam = esGS1 ? 9.5 * m : Math.max(12, Math.min(9 * m, 22));
  const izq = cod.quietoIzq * m;
  const largo = cod.modulos.length * m;
  const W = izq + largo + cod.quietoDer * m;
  const alargar = conTexto && esGS1 ? tam * 0.55 : 0;
  const H = alto + (conTexto ? (esGS1 ? tam * 0.75 : tam * 1.35) : 0) + m * 2;
  const rects = [];
  const enGuarda = (x) => cod.guardas.some(([a, b]) => x >= a && x < b);
  const s = cod.modulos;
  for (let x = 0; x < s.length; x++) {
    if (s[x] !== '1') continue;
    let k = x;
    while (k + 1 < s.length && s[k + 1] === '1' && enGuarda(k + 1) === enGuarda(x)) k++;
    rects.push([izq + x * m, m, (k - x + 1) * m, alto + (enGuarda(x) ? alargar : 0)]);
    x = k;
  }
  const textos = [];
  if (conTexto) {
    if (esGS1) {
      const y = m + alto + tam * 0.72;
      for (const tx of cod.textos) {
        if (tx.ancho === 'fuera-izq') textos.push({ x: izq - m * 2, y, tam, t: tx.t, ancla: 'end' });
        else if (tx.ancho === 'fuera-der') textos.push({ x: izq + largo + m * 2, y, tam, t: tx.t, ancla: 'start' });
        else textos.push({ x: izq + tx.x * m, y, tam, t: tx.t, ancla: 'middle' });
      }
    } else {
      textos.push({ x: W / 2, y: m + alto + tam * 1.05, tam, t: cod.textos[0].t, ancla: 'middle' });
    }
  }
  return { w: W, h: H, rects, textos };
}

const FUENTE = 'Helvetica, Arial, sans-serif';
const escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r2 = (v) => Math.round(v * 100) / 100;

function svgDe(d, titulo) {
  const anc = { start: 'start', middle: 'middle', end: 'end' };
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(d.w)} ${r2(d.h)}" width="${r2(d.w)}" height="${r2(d.h)}" shape-rendering="crispEdges"` +
    (titulo ? ` role="img" aria-label="${escXml(titulo)}"` : '') + `><rect width="100%" height="100%" fill="#FFFFFF"/><path fill="#000000" d="`;
  s += d.rects.map(([x, y, w, hh]) => `M${r2(x)} ${r2(y)}h${r2(w)}v${r2(hh)}h-${r2(w)}z`).join('');
  s += '"/>';
  for (const t of d.textos) {
    s += `<text x="${r2(t.x)}" y="${r2(t.y)}" font-family="${FUENTE}" font-size="${r2(t.tam)}" text-anchor="${anc[t.ancla]}" fill="#000000">${escXml(t.t)}</text>`;
  }
  return s + '</svg>';
}

function lienzoDe(d, escala) {
  const pieAlto = Math.round(16 * escala);
  const c = document.createElement('canvas');
  c.width = Math.ceil(d.w * escala);
  c.height = Math.ceil(d.h * escala) + pieAlto;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#000';
  for (const [x, y, w, hh] of d.rects) {
    const x0 = Math.round(x * escala), x1 = Math.round((x + w) * escala);
    ctx.fillRect(x0, Math.round(y * escala), x1 - x0, Math.round(hh * escala));
  }
  ctx.textBaseline = 'alphabetic';
  for (const t of d.textos) {
    ctx.font = `${t.tam * escala}px ${FUENTE}`;
    ctx.textAlign = t.ancla === 'middle' ? 'center' : t.ancla === 'end' ? 'right' : 'left';
    ctx.fillText(t.t, t.x * escala, t.y * escala);
  }
  let tamPie = 9 * escala;
  ctx.font = `${tamPie}px ${FUENTE}`;
  while (tamPie > 6 && ctx.measureText(PIE).width > c.width * 0.94) { tamPie -= 1; ctx.font = `${tamPie}px ${FUENTE}`; }
  ctx.fillStyle = '#8c8c8c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(PIE, c.width / 2, c.height - pieAlto / 2);
  return c;
}

// ---------- hoja carta (612 × 792 pt) ----------
const HOJAS = {
  e30: { cols: 3, filas: 10, w: 189, h: 72, x0: 13.5, y0: 36, dx: 198, dy: 72 },
  e80: { cols: 4, filas: 20, w: 126, h: 36, x0: 21.6, y0: 36, dx: 147.6, dy: 36 },
  e10: { cols: 2, filas: 5, w: 288, h: 144, x0: 11.25, y0: 36, dx: 301.5, dy: 144 },
  e21: { cols: 3, filas: 7, w: 180, h: 108, x0: 18, y0: 18, dx: 198, dy: 108 },
};

// Coloca cada código dentro de su etiqueta. Devuelve páginas con primitivas en pt (y hacia abajo).
export function armarHoja(codigos, medida, numeros = true) {
  const L = HOJAS[medida] || HOJAS.e30;
  const porHoja = L.cols * L.filas;
  const paginas = [];
  codigos.forEach((cod, i) => {
    if (i % porHoja === 0) paginas.push({ rects: [], textos: [] });
    const p = paginas[paginas.length - 1];
    const k = i % porHoja;
    const ex = L.x0 + (k % L.cols) * L.dx, ey = L.y0 + Math.floor(k / L.cols) * L.dy;
    const pad = Math.min(8, L.h * 0.1);
    const base = dibujar(cod, { modulo: 1, alto: 40, numeros });
    const disponibleW = L.w - 2 * pad, disponibleH = L.h - 2 * pad;
    const esc = Math.min(disponibleW / base.w, 1.6);
    const altoBarras = Math.max(10, Math.min(disponibleH - (base.h - 40) * esc - 2, disponibleH * 0.75));
    const d = dibujar(cod, { modulo: esc, alto: altoBarras, numeros });
    const ox = ex + (L.w - d.w) / 2, oy = ey + (L.h - d.h) / 2;
    for (const [x, y, w, hh] of d.rects) p.rects.push([ox + x, oy + y, w, hh]);
    for (const t of d.textos) p.textos.push({ ...t, x: ox + t.x, y: oy + t.y });
  });
  return { paginas, porHoja };
}

// La hoja sale en PDF con el generador compartido _pdf.js (vectorial, sin librerías).
export function pdfDeHoja(paginas) {
  const ancla = { start: 'i', middle: 'c', end: 'd' };
  return pdf(paginas.map((p) => ({
    w: 612, h: 792,
    piezas: [
      { t: 'rects', lista: p.rects, relleno: '#000000' },
      ...p.textos.map((t) => ({ t: 'texto', x: t.x, y: t.y, s: t.t, f: 'h', tam: t.tam, color: '#000000', ancla: ancla[t.ancla] || 'i' })),
      { t: 'texto', x: 306, y: 780, s: PIE, f: 'h', tam: 7, color: '#8C8C8C', ancla: 'c' },
    ],
  })));
}

function svgDePagina(p) {
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792" width="8.5in" height="11in" shape-rendering="crispEdges"><path d="';
  s += p.rects.map(([x, y, w, hh]) => `M${r2(x)} ${r2(y)}h${r2(w)}v${r2(hh)}h-${r2(w)}z`).join('') + '"/>';
  for (const t of p.textos) {
    s += `<text x="${r2(t.x)}" y="${r2(t.y)}" font-family="${FUENTE}" font-size="${r2(t.tam)}" text-anchor="${t.ancla}">${escXml(t.t)}</text>`;
  }
  s += `<text x="306" y="780" font-family="${FUENTE}" font-size="7" text-anchor="middle" fill="#8c8c8c">${escXml(PIE)}</text>`;
  return s + '</svg>';
}

function imprimirPaginas(paginas) {
  const marco = h('iframe', { title: 'impresión', style: 'position:fixed;right:0;bottom:0;width:0;height:0;border:0' });
  document.body.appendChild(marco);
  const doc = marco.contentDocument;
  doc.open();
  doc.write('<!doctype html><html><head><meta charset="utf-8"><title>Etiquetas</title><style>@page{size:letter;margin:0}' +
    'html,body{margin:0;padding:0}svg{display:block;page-break-after:always;break-after:page}svg:last-child{page-break-after:auto;break-after:auto}</style></head><body>' +
    paginas.map(svgDePagina).join('') + '</body></html>');
  doc.close();
  setTimeout(() => {
    marco.contentWindow.focus();
    marco.contentWindow.print();
    setTimeout(() => marco.remove(), 60000);
  }, 250);
}

// ---------- herramienta ----------
export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  const t = unirTextos(TEXTOS, opciones);
  const modo = opciones.modo || 'ean13';
  let formato = FORMATOS.includes(modo) ? modo : 'ean13';
  const datos = { valor: '', modulo: 2, alto: 100, numeros: true, verificador39: false, medida: 'e30', lista: '', cantidad: '' };

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-barras', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const entrada = h('input', { type: 'text', class: 'ah-input', autocomplete: 'off', spellcheck: false });
  const campoValor = campo(t.valor, entrada, t.ayudas[formato]);
  const ayudaValor = campoValor.querySelector('.ah-ayuda');
  entrada.addEventListener('input', () => { datos.valor = entrada.value; programar(); });

  const chk39 = h('input', { type: 'checkbox' });
  chk39.addEventListener('change', () => { datos.verificador39 = chk39.checked; redibujar(); });
  const filaChk39 = h('label', { class: 'ah-check' }, chk39, h('span', { text: t.verificador39 }));

  const mensaje = h('p', { class: 'ah-ok', 'aria-live': 'polite' });

  const chips = opcionesChip('formato', t.formato, FORMATOS.map((f) => [f, t.nombres[f]]), formato, (v) => {
    formato = v;
    ayudaValor.textContent = t.ayudas[v];
    entrada.placeholder = t.ejemplos[v];
    entrada.inputMode = ['code128', 'code39'].includes(v) ? 'text' : 'numeric';
    redibujar();
  });
  entrada.placeholder = t.ejemplos[formato];
  entrada.inputMode = ['code128', 'code39'].includes(formato) ? 'text' : 'numeric';

  // Ajustes
  const selModulo = h('select', { class: 'ah-input' }, [1, 2, 3, 4].map((v) => h('option', { value: v, text: `${v} px` })));
  selModulo.value = String(datos.modulo);
  selModulo.addEventListener('change', () => { datos.modulo = +selModulo.value; redibujar(); });
  const rangoAlto = h('input', { type: 'range', min: 30, max: 300, step: 5, class: 'ah-rango' });
  rangoAlto.value = String(datos.alto);
  const altoValor = h('output', { class: 'ah-valor', text: `${datos.alto} px` });
  rangoAlto.addEventListener('input', () => { datos.alto = +rangoAlto.value; altoValor.textContent = `${datos.alto} px`; redibujar(); });
  const campoAlto = campo(t.alto, rangoAlto);
  campoAlto.querySelector('label').append(' ', altoValor);
  const chkNum = h('input', { type: 'checkbox', checked: true });
  chkNum.addEventListener('change', () => { datos.numeros = chkNum.checked; redibujar(); });

  // Hoja
  const selMedida = h('select', { class: 'ah-input' }, Object.entries(t.medidas).map(([k, x]) => h('option', { value: k, text: x })));
  selMedida.value = datos.medida;
  selMedida.addEventListener('change', () => { datos.medida = selMedida.value; resumenHoja(); });
  const lista = h('textarea', { class: 'ah-input', rows: 4, spellcheck: false });
  lista.addEventListener('input', () => { datos.lista = lista.value; resumenHoja(); });
  const cantidad = h('input', { type: 'number', class: 'ah-input', min: 1, max: 2000, inputmode: 'numeric' });
  cantidad.addEventListener('input', () => { datos.cantidad = cantidad.value; resumenHoja(); });
  const estHoja = h('p', { class: 'ah-nota', 'aria-live': 'polite' });
  const errHoja = h('p', { class: 'ah-error', hidden: true });
  const bPdf = boton(t.pdf, () => {
    const r = codigosHoja();
    if (!r) return;
    descargar(pdfDeHoja(armarHoja(r, datos.medida, datos.numeros).paginas), `etiquetas-${formato}.pdf`);
    est.decir(t.descargado);
    avisar(contenedor, ID, 'descargar');
  });
  const bImp = boton(t.imprimir, () => {
    const r = codigosHoja();
    if (!r) return;
    imprimirPaginas(armarHoja(r, datos.medida, datos.numeros).paginas);
    avisar(contenedor, ID, 'descargar');
  }, 'ah-boton ah-boton-2');

  const hoja = h('details', { class: 'ah-ajustes', open: modo === 'hoja' },
    h('summary', { text: t.hoja }),
    h('p', { class: 'ah-nota', text: t.hojaNota }),
    campo(t.medida, selMedida),
    campo(t.lista, lista, t.listaAyuda),
    campo(t.cantidad, cantidad),
    errHoja, estHoja,
    h('div', { class: 'ah-acciones' }, bPdf, bImp));

  const ajustes = h('details', { class: 'ah-ajustes', open: true },
    h('summary', { text: t.ajustes }),
    h('div', { class: 'ah-fila' }, campo(t.anchoBarra, selModulo), campoAlto),
    h('label', { class: 'ah-check' }, chkNum, h('span', { text: t.numeros })));

  // Vista
  const lienzo = h('div', { class: 'ah-barras-lienzo' });
  const notaEjemplo = h('p', { class: 'ah-ayuda', text: t.ejemplo });
  const est = estado();
  let actual = null;
  let real = false;
  const bPng = boton(t.png, async () => {
    if (!real) return;
    descargar(await lienzoABlob(lienzoDe(dibujar(actual, opcDibujo()), 3)), nombreBase() + '.png');
    est.decir(t.descargado);
    avisar(contenedor, ID, 'descargar');
  });
  const bSvg = boton(t.svg, () => {
    if (!real) return;
    const svg = svgDe(dibujar(actual, opcDibujo()));
    descargar(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + svg], { type: 'image/svg+xml' }), nombreBase() + '.svg');
    est.decir(t.descargado);
    avisar(contenedor, ID, 'descargar');
  }, 'ah-boton ah-boton-2');

  const vista = h('div', { class: 'ah-vista' },
    h('h3', { class: 'ah-titulo-vista', text: t.vista }), lienzo, notaEjemplo,
    h('div', { class: 'ah-acciones' }, bPng, bSvg), est, h('p', { class: 'ah-nota', text: t.pruebalo }));

  raiz.append(h('div', { class: 'ah-columna' }, chips, campoValor, filaChk39, mensaje), vista,
    h('div', { class: 'ah-columna ah-columna-2' }, ajustes, hoja));

  const opcDibujo = () => ({ modulo: datos.modulo, alto: datos.alto, numeros: datos.numeros });
  const nombreBase = () => `codigo-${formato}-${nombreArchivo(actual.valor)}`;
  const cod = (v) => codificar(formato, v, { verificador39: datos.verificador39 });

  function explicar(r) {
    switch (r.error) {
      case 'verificador': return t.errVerificador(r.esperado, r.valor);
      case 'largo': return t.errLargo(r.nombre, r.largo);
      case 'soloDigitos': return t.errDigitos;
      case 'caracter': return t.errCaracter(r.caracter);
      default: return '';
    }
  }

  function codigosHoja() {
    const renglones = datos.lista.split('\n').map((x) => x.trim()).filter(Boolean);
    const base = renglones.length ? renglones : (real ? [entrada.value] : []);
    if (!base.length) { errHoja.hidden = true; return null; }
    const cods = [];
    for (let i = 0; i < base.length; i++) {
      const r = cod(base[i]);
      if (!r.ok) {
        errHoja.hidden = false;
        errHoja.textContent = t.errLista(i + 1, base[i]) + ' ' + explicar(r);
        return null;
      }
      cods.push(r);
    }
    errHoja.hidden = true;
    const L = HOJAS[datos.medida];
    const porHoja = L.cols * L.filas;
    const n = Math.max(1, Math.min(2000, parseInt(datos.cantidad, 10) || (renglones.length > 1 ? cods.length : porHoja)));
    const todos = [];
    for (let i = 0; i < n; i++) todos.push(cods[i % cods.length]);
    return todos;
  }

  function resumenHoja() {
    const L = HOJAS[datos.medida];
    cantidad.placeholder = String(L.cols * L.filas);
    const r = codigosHoja();
    estHoja.textContent = r ? t.hojaLista(r.length, Math.ceil(r.length / (L.cols * L.filas))) : errHoja.hidden ? t.hojaVacia : '';
    bPdf.disabled = bImp.disabled = !r;
  }

  let temporizador;
  function programar() { clearTimeout(temporizador); temporizador = setTimeout(redibujar, 100); }

  function redibujar() {
    filaChk39.hidden = formato !== 'code39';
    const v = datos.valor.trim();
    let r = v ? cod(v) : null;
    real = !!(r && r.ok);
    mensaje.className = real ? 'ah-ok' : 'ah-error';
    if (r && !r.ok) mensaje.textContent = explicar(r);
    else if (r && r.calculado != null) mensaje.textContent = t.calculado(r.calculado);
    else if (r && r.correcto != null) mensaje.textContent = t.correcto(r.correcto);
    else if (r && r.aviso === 'ceroIzq') mensaje.textContent = t.ceroIzq;
    else mensaje.textContent = '';
    entrada.setAttribute('aria-invalid', String(!!(r && !r.ok)));
    if (!real) r = cod(t.ejemplos[formato]);
    actual = r;
    lienzo.innerHTML = svgDe(dibujar(r, opcDibujo()), real ? r.valor : t.ejemplo);
    lienzo.classList.toggle('ah-apagado', !real);
    notaEjemplo.hidden = real;
    bPng.disabled = bSvg.disabled = !real;
    resumenHoja();
  }

  redibujar();
  return { destruir() { clearTimeout(temporizador); contenedor.textContent = ''; } };
}
