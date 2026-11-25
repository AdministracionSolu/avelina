// PDF propio de las herramientas de Avelina: vectorial, sin librerías y sin red.
// Una «escena» es una página en puntos (1 pt = 1/72 in, y hacia abajo) con una lista de piezas:
//   { t: 'rect', x, y, w, h, relleno?, trazo?, grosor?, radio? }
//   { t: 'rects', lista: [[x, y, w, h], …], relleno } (un solo relleno, sin costuras entre piezas que se tocan)
//   { t: 'linea', x1, y1, x2, y2, color?, grosor?, guiones? }
//   { t: 'circulo', cx, cy, r, relleno?, trazo?, grosor? }
//   { t: 'texto', x, y (línea base), s, f, tam, color?, ancla? ('i' | 'c' | 'd') }
//   { t: 'img', x, y, w, h, im, radio? } (im sale de imagen(); radio recorta las esquinas)
//   { t: 'liga', x, y, w, h, url } (sólo en el PDF)
// La misma escena sale en PDF (pdf()) y en lienzo para PNG (lienzo()).

export const CARTA = { w: 612, h: 792 };
export const MEDIA_CARTA = { w: 396, h: 612 };

// Anchos de las 14 fuentes base (1/1000 em), códigos WinAnsi 32-255 en base 36.
const M = {
  h: '7q7q9vfgfgopij5b9999atg87q997q7qfgfgfgfgfgfgfgfgfgfg7q7qg8g8g8fgs7ijijk2k2ijgzlmk27qdwijfgn5k2lmijlmk2ijgzk2ijq8ijijgz7q7q7qd1fg99fgfgdwfgfg7qfgfg6666dw66n5fgfgfgfg99dw7qfgdwk2dwdwdw9a789ag800fg0066fg99rsfgfg99rsij99rs00gz0000666699999qfgrs99rsdw99q800dwij7q99fgfgfgfg78fg99khaafgg899kh99b4g8999999fgex7q9999a5fgn6n6n6gzijijijijijijrsk2ijijijij7q7q7q7qk2k2lmlmlmlmlmg8lmk2k2k2k2ijijgzfgfgfgfgfgfgopdwfgfgfgfg7q7q7q7qfgfgfgfgfgfgfgg8gzfgfgfgfgdwfgdw',
  hb: '7q99d6fgfgopk26m9999atg87q997q7qfgfgfgfgfgfgfgfgfgfg9999g8g8g8gzr3k2k2k2k2ijgzlmk27qfgk2gzn5k2lmijlmk2ijgzk2ijq8ijijgz997q99g8fg99fggzfggzfg99gzgz7q7qfg7qopgzgzgzgzatfg99gzfglmfgfgdwat7satg800fg007qfgdwrsfgfg99rsij99rs00gz00007q7qdwdw9qfgrs99rsfg99q800dwij7q99fgfgfgfg7sfg99khaafgg899kh99b4g8999999gzfg7q9999a5fgn6n6n6gzk2k2k2k2k2k2rsk2ijijijij7q7q7q7qk2k2lmlmlmlmlmg8lmk2k2k2k2ijijgzfgfgfgfgfgfgopfgfgfgfgfg7q7q7q7qgzgzgzgzgzgzgzg8gzgzgzgzgzfggzfg',
  t: '6y99bcdwdwn5lm509999dwfo6y996y7qdwdwdwdwdwdwdwdwdwdw7q7qfofofoccplk2ijijk2gzfgk2k299atk2gzopk2k2fgk2ijfggzk2k2q8k2k2gz997q99d1dw99ccdwccdwcc99dwdw7q7qdw7qlmdwdwdwdw99at7qdwdwk2dwdwccdc5kdcf100dw0099dwccrsdwdw99rsfg99op00gz00009999cccc9qdwrs99r8at99k200cck26y99dwdwdwdw5kdw99l47odwfo99l499b4fo8c8c99dwcl6y998c8mdwkukukucck2k2k2k2k2k2opijgzgzgzgz99999999k2k2k2k2k2k2k2fok2k2k2k2k2k2fgdwccccccccccccijcccccccccc7q7q7q7qdwdwdwdwdwdwdwfodwdwdwdwdwdwdwdw',
  tb: '6y99ffdwdwrsn57q9999dwfu6y996y7qdwdwdwdwdwdwdwdwdwdw9999fufufudwpuk2ijk2k2ijgzlmlmatdwlmijq8k2lmgzlmk2fgijk2k2rsk2k2ij997q99g5dw99dwfgccfgcc99dwfg7q99fg7qn5fgdwfgfgccat99fgdwk2dwdwccay64ayeg00dw0099dwdwrsdwdw99rsfg99rs00ij00009999dwdw9qdwrs99rsat99k200cck26y99dwdwdwdw64dw99kr8cdwfu99kr99b4fu8c8c99fgf06y998c96dwkukukudwk2k2k2k2k2k2rsk2ijijijijatatatatk2k2lmlmlmlmlmfulmk2k2k2k2k2gzfgdwdwdwdwdwdwk2cccccccccc7q7q7q7qdwfgdwdwdwdwdwfudwfgfgfgfgdwfgdw',
  ti: '6y99bodwdwn5lm5y9999dwir6y996y7qdwdwdwdwdwdwdwdwdwdw9999iririrdwpkgzgzijk2gzgzk2k299ccijfgn5ijk2gzk2gzdwfgk2gzn5gzfgfgat7qatbqdw99dwdwccdwcc7qdwdw7q7qcc7qk2dwdwdwdwatat7qdwccijccccatb47nb4f100dw0099dwfgopdwdw99rsdw99q800fg00009999fgfg9qdwop99r8at99ij00atfg6yatdwdwdwdw7ndw99l47odwir99l499b4ir8c8c99dwej6y998c8mdwkukukudwgzgzgzgzgzgzopijgzgzgzgz99999999k2ijk2k2k2k2k2irk2k2k2k2k2fggzdwdwdwdwdwdwdwijcccccccccc7q7q7q7qdwdwdwdwdwdwdwirdwdwdwdwdwccdwcc',
  tbi: '6yatffdwdwn5lm7q9999dwfu6y996y7qdwdwdwdwdwdwdwdwdwdw9999fufufudwn4ijijijk2ijijk2lmatdwijgzopk2k2gzk2ijfggzk2ijopijgzgz997q99fudw99dwdwccdwcc99dwfg7q7qdw7qlmfgdwdwdwatat7qfgccijdwccat9o649ofu00dw0099dwdwrsdwdw99rsfg99q800gz00009999dwdw9qdwrs99rsat99k200atgz6yatdwdwdwdw64dw99kr7edwgu99kr99b4fu8c8c99g0dw6y998c8cdwkukukudwijijijijijijq8ijijijijijatatatatk2k2k2k2k2k2k2fuk2k2k2k2k2gzgzdwdwdwdwdwdwdwk2cccccccccc7q7q7q7qdwfgdwdwdwdwdwfudwfgfgfgfgccdwcc',
};

const FUENTES = {
  h: ['Helvetica', 'h', ''], hb: ['Helvetica-Bold', 'hb', 'bold '], hi: ['Helvetica-Oblique', 'h', 'italic '],
  hbi: ['Helvetica-BoldOblique', 'hb', 'italic bold '],
  t: ['Times-Roman', 't', ''], tb: ['Times-Bold', 'tb', 'bold '], ti: ['Times-Italic', 'ti', 'italic '],
  tbi: ['Times-BoldItalic', 'tbi', 'italic bold '],
};
const FAMILIA = { h: 'Helvetica, Arial, sans-serif', t: '"Times New Roman", Times, serif' };
const tablas = {};
function tabla(k) {
  if (!tablas[k]) {
    const s = M[k], a = new Uint16Array(224);
    for (let i = 0; i < 224; i++) a[i] = parseInt(s.substr(i * 2, 2), 36);
    tablas[k] = a;
  }
  return tablas[k];
}

// Unicode → byte WinAnsi (cp1252). Lo que no existe pierde el acento o sale como «?».
const ESPECIALES = { 0x20ac: 0x80, 0x201a: 0x82, 0x201e: 0x84, 0x2026: 0x85, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2122: 0x99, 0x2039: 0x8b, 0x203a: 0x9b, 0x2030: 0x89 };
export function aWinAnsi(s) {
  const out = [];
  for (const ch of String(s)) {
    let c = ch.codePointAt(0);
    if (c === 9 || c === 10 || c === 13) c = 32;
    if ((c >= 32 && c < 127) || (c >= 160 && c <= 255)) out.push(c);
    else if (ESPECIALES[c]) out.push(ESPECIALES[c]);
    else {
      const b = ch.normalize('NFD').charCodeAt(0);
      out.push(b >= 32 && b < 127 ? b : 63);
    }
  }
  return out;
}

export function ancho(s, f = 'h', tam = 10) {
  const a = tabla(FUENTES[f][1]);
  let w = 0;
  for (const c of aWinAnsi(s)) w += a[c - 32] || 500;
  return (w / 1000) * tam;
}

// Parte un texto en renglones que caben en «max». Respeta saltos de línea y corta palabras larguísimas.
export function partir(s, f, tam, max) {
  const renglones = [];
  for (const parrafo of String(s ?? '').split('\n')) {
    let actual = '';
    for (let palabra of parrafo.split(/ +/)) {
      while (ancho(palabra, f, tam) > max && palabra.length > 1) {
        let k = palabra.length - 1;
        while (k > 1 && ancho(palabra.slice(0, k), f, tam) > max) k--;
        if (actual) { renglones.push(actual); actual = ''; }
        renglones.push(palabra.slice(0, k));
        palabra = palabra.slice(k);
      }
      const prueba = actual ? actual + ' ' + palabra : palabra;
      if (ancho(prueba, f, tam) <= max || !actual) actual = prueba;
      else { renglones.push(actual); actual = palabra; }
    }
    renglones.push(actual);
  }
  return renglones;
}

export function recortar(s, f, tam, max) {
  s = String(s ?? '');
  if (ancho(s, f, tam) <= max) return s;
  while (s.length > 1 && ancho(s + '…', f, tam) > max) s = s.slice(0, -1);
  return s.trimEnd() + '…';
}

// Pasa una imagen (img o canvas) a JPEG sobre un fondo liso. «proporcion» (ancho/alto) recorta al centro.
export function imagen(fuente, { maxPx = 1400, fondo = '#ffffff', calidad = 0.88, proporcion = 0 } = {}) {
  let sw = fuente.naturalWidth || fuente.width, sh = fuente.naturalHeight || fuente.height, sx = 0, sy = 0;
  if (proporcion) {
    if (sw / sh > proporcion) { const n = sh * proporcion; sx = (sw - n) / 2; sw = n; }
    else { const n = sw / proporcion; sy = (sh - n) / 2; sh = n; }
  }
  const k = Math.min(1, maxPx / Math.max(sw, sh));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(sw * k));
  c.height = Math.max(1, Math.round(sh * k));
  const ctx = c.getContext('2d');
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(fuente, sx, sy, sw, sh, 0, 0, c.width, c.height);
  const b64 = c.toDataURL('image/jpeg', calidad).split(',')[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { el: c, bytes, w: c.width, h: c.height };
}

// Encaja una imagen en una caja sin deformarla. Devuelve {x, y, w, h}.
export function encajar(im, x, y, w, h, alinear = 'c') {
  const r = Math.min(w / im.w, h / im.h);
  const ww = im.w * r, hh = im.h * r;
  const ox = alinear === 'i' ? 0 : alinear === 'd' ? w - ww : (w - ww) / 2;
  return { x: x + ox, y: y + (h - hh) / 2, w: ww, h: hh };
}

// Módulos de un QR (de _qr-codificador.js) como rectángulos dentro de un cuadro de «lado» pt.
export function modulos(q, x, y, lado, color = '#000000') {
  const m = lado / q.tam, piezas = [];
  for (let fy = 0; fy < q.tam; fy++) {
    for (let fx = 0; fx < q.tam; fx++) {
      if (!q.modulos[fy * q.tam + fx]) continue;
      let k = fx;
      while (k + 1 < q.tam && q.modulos[fy * q.tam + k + 1]) k++;
      piezas.push([x + fx * m, y + fy * m, (k - fx + 1) * m, m]);
      fx = k;
    }
  }
  return [{ t: 'rects', lista: piezas, relleno: color }];
}

// ---------- color ----------
function rgb(hex) {
  let s = String(hex || '#000').replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const n2 = (v) => (Math.round(v * 100) / 100).toString();
const colorPdf = (hex, op) => rgb(hex).map((v) => n2(v / 255)).join(' ') + ' ' + op;

// ---------- PDF ----------
const K = 0.5523;
function trazoRect(p, H) {
  const { x, w, h } = p, y = H - p.y - p.h, r = Math.min(p.radio || 0, w / 2, h / 2);
  if (!r) return `${n2(x)} ${n2(y)} ${n2(w)} ${n2(h)} re`;
  const c = r * K;
  return `${n2(x + r)} ${n2(y)} m ${n2(x + w - r)} ${n2(y)} l ${n2(x + w - r + c)} ${n2(y)} ${n2(x + w)} ${n2(y + r - c)} ${n2(x + w)} ${n2(y + r)} c ` +
    `${n2(x + w)} ${n2(y + h - r)} l ${n2(x + w)} ${n2(y + h - r + c)} ${n2(x + w - r + c)} ${n2(y + h)} ${n2(x + w - r)} ${n2(y + h)} c ` +
    `${n2(x + r)} ${n2(y + h)} l ${n2(x + r - c)} ${n2(y + h)} ${n2(x)} ${n2(y + h - r + c)} ${n2(x)} ${n2(y + h - r)} c ` +
    `${n2(x)} ${n2(y + r)} l ${n2(x)} ${n2(y + r - c)} ${n2(x + r - c)} ${n2(y)} ${n2(x + r)} ${n2(y)} c h`;
}
function trazoCirculo(p, H) {
  const { cx, r } = p, cy = H - p.cy, c = r * K;
  return `${n2(cx + r)} ${n2(cy)} m ${n2(cx + r)} ${n2(cy + c)} ${n2(cx + c)} ${n2(cy + r)} ${n2(cx)} ${n2(cy + r)} c ` +
    `${n2(cx - c)} ${n2(cy + r)} ${n2(cx - r)} ${n2(cy + c)} ${n2(cx - r)} ${n2(cy)} c ` +
    `${n2(cx - r)} ${n2(cy - c)} ${n2(cx - c)} ${n2(cy - r)} ${n2(cx)} ${n2(cy - r)} c ` +
    `${n2(cx + c)} ${n2(cy - r)} ${n2(cx + r)} ${n2(cy - c)} ${n2(cx + r)} ${n2(cy)} c h`;
}
function pintar(p, trazo) {
  let s = '';
  if (p.relleno) s += colorPdf(p.relleno, 'rg') + ' ';
  if (p.trazo) s += colorPdf(p.trazo, 'RG') + ` ${n2(p.grosor || 1)} w `;
  return s + trazo + (p.relleno && p.trazo ? ' B' : p.relleno ? ' f' : ' S') + '\n';
}
const hex = (bytes) => bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
const literal = (s) => '(' + String(s).replace(/[^\x20-\x7e]/g, '').replace(/[()\\]/g, '\\$&') + ')';
function utf16(s) {
  let o = 'feff';
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c > 0xffff) continue;
    o += c.toString(16).padStart(4, '0');
  }
  return '<' + o + '>';
}

// Devuelve un Blob application/pdf con una página por escena.
export function pdf(escenas, { titulo = '', autor = '' } = {}) {
  const objs = [];
  const nuevo = (v) => { objs.push(v); return objs.length; };
  const catalogo = nuevo(null), paginas = nuevo(null);
  const fuentes = {}, imagenes = new Map(), kids = [];
  for (const e of escenas) {
    const H = e.h;
    let c = '';
    const usadas = {}, ims = {}, ligas = [];
    if (e.fondo && e.fondo.toLowerCase() !== '#ffffff') c += colorPdf(e.fondo, 'rg') + ` 0 0 ${n2(e.w)} ${n2(H)} re f\n`;
    for (const p of e.piezas) {
      if (p.t === 'rect') c += pintar(p, trazoRect(p, H));
      else if (p.t === 'circulo') c += pintar(p, trazoCirculo(p, H));
      else if (p.t === 'rects') c += colorPdf(p.relleno || '#000000', 'rg') + '\n' + p.lista.map(([x, y, w, hh]) => `${n2(x)} ${n2(H - y - hh)} ${n2(w)} ${n2(hh)} re`).join('\n') + '\nf\n';
      else if (p.t === 'linea') {
        c += `${colorPdf(p.color || '#000000', 'RG')} ${n2(p.grosor || 1)} w ${p.guiones ? '[' + p.guiones.join(' ') + '] 0 d ' : ''}` +
          `${n2(p.x1)} ${n2(H - p.y1)} m ${n2(p.x2)} ${n2(H - p.y2)} l S${p.guiones ? ' [] 0 d' : ''}\n`;
      } else if (p.t === 'texto') {
        if (p.s == null || p.s === '') continue;
        const f = FUENTES[p.f || 'h'];
        if (!fuentes[f[0]]) fuentes[f[0]] = { n: 'F' + (Object.keys(fuentes).length + 1) };
        usadas[fuentes[f[0]].n] = f[0];
        const w = ancho(p.s, p.f || 'h', p.tam);
        const x = p.ancla === 'c' ? p.x - w / 2 : p.ancla === 'd' ? p.x - w : p.x;
        c += `${colorPdf(p.color || '#000000', 'rg')} BT /${fuentes[f[0]].n} ${n2(p.tam)} Tf ${n2(x)} ${n2(H - p.y)} Td <${hex(aWinAnsi(p.s))}> Tj ET\n`;
      } else if (p.t === 'img' && p.im) {
        if (!imagenes.has(p.im)) imagenes.set(p.im, { n: 'Im' + (imagenes.size + 1) });
        const r = imagenes.get(p.im);
        ims[r.n] = p.im;
        const clip = p.radio ? trazoRect(p, H) + ' W n ' : '';
        c += `q ${clip}${n2(p.w)} 0 0 ${n2(p.h)} ${n2(p.x)} ${n2(H - p.y - p.h)} cm /${r.n} Do Q\n`;
      } else if (p.t === 'liga' && p.url) ligas.push(p);
    }
    objs.push({ e, c, usadas, ims, ligas });
    kids.push(objs.length);
  }
  // Fuentes e imágenes se escriben una vez y se comparten entre páginas.
  for (const [nombre, f] of Object.entries(fuentes)) {
    f.obj = nuevo(`<< /Type /Font /Subtype /Type1 /BaseFont /${nombre} /Encoding /WinAnsiEncoding >>`);
  }
  for (const [im, r] of imagenes) {
    r.obj = nuevo({ dict: `<< /Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.bytes.length} >>`, bytes: im.bytes });
  }
  const porNombre = {};
  for (const f of Object.values(fuentes)) porNombre[f.n] = f.obj;
  const imPorNombre = {};
  for (const r of imagenes.values()) imPorNombre[r.n] = r.obj;
  for (const k of kids) {
    const { e, c, usadas, ims, ligas } = objs[k - 1];
    const cont = nuevo({ dict: `<< /Length ${c.length} >>`, texto: c });
    const fr = Object.keys(usadas).map((n) => `/${n} ${porNombre[n]} 0 R`).join(' ');
    const xr = Object.keys(ims).map((n) => `/${n} ${imPorNombre[n]} 0 R`).join(' ');
    const annots = ligas.map((l) => nuevo(`<< /Type /Annot /Subtype /Link /Rect [${n2(l.x)} ${n2(e.h - l.y - l.h)} ${n2(l.x + l.w)} ${n2(e.h - l.y)}] /Border [0 0 0] /A << /S /URI /URI ${literal(l.url)} >> >>`));
    objs[k - 1] = `<< /Type /Page /Parent ${paginas} 0 R /MediaBox [0 0 ${n2(e.w)} ${n2(e.h)}] /Resources << /Font << ${fr} >> /XObject << ${xr} >> >> /Contents ${cont} 0 R` +
      (annots.length ? ` /Annots [${annots.map((a) => a + ' 0 R').join(' ')}]` : '') + ' >>';
  }
  objs[catalogo - 1] = `<< /Type /Catalog /Pages ${paginas} 0 R >>`;
  objs[paginas - 1] = `<< /Type /Pages /Kids [${kids.map((k) => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
  const info = nuevo(`<< /Producer (Avelina - avelina.com.mx)${titulo ? ' /Title ' + utf16(titulo) : ''}${autor ? ' /Author ' + utf16(autor) : ''} >>`);

  const trozos = [];
  let largo = 0;
  const poner = (x) => {
    if (typeof x === 'string') { const b = new Uint8Array(x.length); for (let i = 0; i < x.length; i++) b[i] = x.charCodeAt(i) & 255; x = b; }
    trozos.push(x); largo += x.length;
  };
  poner('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');
  const offs = [];
  objs.forEach((o, i) => {
    offs[i] = largo;
    poner(`${i + 1} 0 obj\n`);
    if (typeof o === 'string') poner(o);
    else { poner(o.dict + '\nstream\n'); poner(o.bytes || o.texto); poner('\nendstream'); }
    poner('\nendobj\n');
  });
  const xref = largo;
  let x = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const o of offs) x += String(o).padStart(10, '0') + ' 00000 n \n';
  poner(x + `trailer\n<< /Size ${objs.length + 1} /Root ${catalogo} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(trozos, { type: 'application/pdf' });
}

// ---------- lienzo (PNG) ----------
export function lienzo(e, escala = 2) {
  const c = document.createElement('canvas');
  c.width = Math.round(e.w * escala);
  c.height = Math.round(e.h * escala);
  const ctx = c.getContext('2d');
  ctx.scale(escala, escala);
  ctx.fillStyle = e.fondo || '#ffffff';
  ctx.fillRect(0, 0, e.w, e.h);
  if ('fontKerning' in ctx) ctx.fontKerning = 'none';
  for (const p of e.piezas) {
    if (p.t === 'rect' || p.t === 'circulo') {
      ctx.beginPath();
      if (p.t === 'circulo') ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2);
      else if (p.radio && ctx.roundRect) ctx.roundRect(p.x, p.y, p.w, p.h, Math.min(p.radio, p.w / 2, p.h / 2));
      else ctx.rect(p.x, p.y, p.w, p.h);
      if (p.relleno) { ctx.fillStyle = p.relleno; ctx.fill(); }
      if (p.trazo) { ctx.strokeStyle = p.trazo; ctx.lineWidth = p.grosor || 1; ctx.stroke(); }
    } else if (p.t === 'rects') {
      ctx.beginPath();
      for (const [x, y, w, hh] of p.lista) ctx.rect(x, y, w, hh);
      ctx.fillStyle = p.relleno || '#000';
      ctx.fill();
    } else if (p.t === 'linea') {
      ctx.beginPath();
      ctx.setLineDash(p.guiones || []);
      ctx.moveTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.strokeStyle = p.color || '#000';
      ctx.lineWidth = p.grosor || 1;
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (p.t === 'texto') {
      if (p.s == null || p.s === '') continue;
      const f = FUENTES[p.f || 'h'];
      ctx.font = `${f[2]}${p.tam}px ${FAMILIA[(p.f || 'h')[0]]}`;
      ctx.fillStyle = p.color || '#000';
      ctx.textAlign = p.ancla === 'c' ? 'center' : p.ancla === 'd' ? 'right' : 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(p.s, p.x, p.y, ancho(p.s, p.f || 'h', p.tam) * 1.04 + 0.5);
    } else if (p.t === 'img' && p.im) {
      ctx.save();
      if (p.radio) {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(p.x, p.y, p.w, p.h, Math.min(p.radio, p.w / 2, p.h / 2)); else ctx.rect(p.x, p.y, p.w, p.h);
        ctx.clip();
      }
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(p.im.el, p.x, p.y, p.w, p.h);
      ctx.restore();
    }
  }
  return c;
}

// Varias escenas en un solo PNG, una debajo de otra.
export function lienzoDeVarias(escenas, escala = 2, separacion = 16) {
  if (escenas.length === 1) return lienzo(escenas[0], escala);
  const partes = escenas.map((e) => lienzo(e, escala));
  const c = document.createElement('canvas');
  c.width = Math.max(...partes.map((p) => p.width));
  c.height = partes.reduce((s, p) => s + p.height, 0) + separacion * escala * (partes.length - 1);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#d9d9d9';
  ctx.fillRect(0, 0, c.width, c.height);
  let y = 0;
  for (const p of partes) { ctx.drawImage(p, 0, y); y += p.height + separacion * escala; }
  return c;
}
