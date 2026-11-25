// Codificadores de códigos de barras propios: EAN-13, EAN-8, UPC-A, CODE128, CODE39 e ITF.
// codificar(formato, texto, {verificador39}) -> {ok, modulos:'1010…', guardas:[[ini,fin]], textos, quietoIzq, quietoDer, valor, aviso}
// Sin dependencias y sin red.

const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const R = L.map((p) => p.replace(/./g, (c) => (c === '1' ? '0' : '1')));
const G = R.map((p) => p.split('').reverse().join(''));
const PARIDAD = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

// Dígito verificador GS1 (EAN, UPC, ITF-14): pesos 3 y 1 desde la derecha.
export function digitoGS1(sinVerificador) {
  let s = 0;
  const d = String(sinVerificador);
  for (let i = d.length - 1, w = 3; i >= 0; i--, w = 4 - w) s += (+d[i]) * w;
  return (10 - (s % 10)) % 10;
}

function revisarGS1(digitos, largo, nombre) {
  const d = String(digitos).replace(/[\s-]/g, '');
  if (!/^\d+$/.test(d)) return { error: 'soloDigitos' };
  if (d.length === largo - 1) {
    const c = digitoGS1(d);
    return { valor: d + c, calculado: c };
  }
  if (d.length === largo) {
    const c = digitoGS1(d.slice(0, -1));
    if (c !== +d[largo - 1]) return { error: 'verificador', esperado: c, valor: d.slice(0, -1) + c };
    return { valor: d, correcto: c };
  }
  return { error: 'largo', largo, nombre };
}

function ean(valor13, upc) {
  const d = valor13;
  let m = '101';
  const par = PARIDAD[+d[0]];
  for (let i = 1; i <= 6; i++) m += (par[i - 1] === 'L' ? L : G)[+d[i]];
  m += '01010';
  for (let i = 7; i <= 12; i++) m += R[+d[i]];
  m += '101';
  const guardas = [[0, 3], [45, 50], [92, 95]];
  const textos = [];
  if (upc) {
    guardas.push([3, 10], [85, 92]);
    textos.push({ x: -2, t: d[1], ancho: 'fuera-izq' });
    for (let i = 2; i <= 6; i++) textos.push({ x: 3 + 7 * (i - 1) + 3.5, t: d[i] });
    for (let i = 7; i <= 11; i++) textos.push({ x: 50 + 7 * (i - 7) + 3.5, t: d[i] });
    textos.push({ x: 97, t: d[12], ancho: 'fuera-der' });
    return { modulos: m, guardas, textos, quietoIzq: 9, quietoDer: 9 };
  }
  textos.push({ x: -3, t: d[0], ancho: 'fuera-izq' });
  for (let i = 1; i <= 6; i++) textos.push({ x: 3 + 7 * (i - 1) + 3.5, t: d[i] });
  for (let i = 7; i <= 12; i++) textos.push({ x: 50 + 7 * (i - 7) + 3.5, t: d[i] });
  return { modulos: m, guardas, textos, quietoIzq: 11, quietoDer: 7 };
}

function ean8(d) {
  let m = '101';
  for (let i = 0; i < 4; i++) m += L[+d[i]];
  m += '01010';
  for (let i = 4; i < 8; i++) m += R[+d[i]];
  m += '101';
  const textos = [];
  for (let i = 0; i < 4; i++) textos.push({ x: 3 + 7 * i + 3.5, t: d[i] });
  for (let i = 4; i < 8; i++) textos.push({ x: 36 + 7 * (i - 4) + 3.5, t: d[i] });
  return { modulos: m, guardas: [[0, 3], [31, 36], [64, 67]], textos, quietoIzq: 7, quietoDer: 7 };
}

// Anchos alternados barra/espacio -> cadena de módulos.
function anchosAModulos(anchos, arranque = '1') {
  let s = '', c = arranque;
  for (const w of anchos) { s += c.repeat(w); c = c === '1' ? '0' : '1'; }
  return s;
}

// ---------- CODE128 ----------
const C128 = ('212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 ' +
  '123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 ' +
  '111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 ' +
  '231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 ' +
  '141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 ' +
  '124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 ' +
  '311141 411131 211412 211214 211232 2331112').split(' ');

export const PATRONES_128 = C128;

function corridaDigitos(s, i) {
  let k = i;
  while (k < s.length && s.charCodeAt(k) >= 48 && s.charCodeAt(k) <= 57) k++;
  return k - i;
}

function code128(s) {
  if (!s.length) return { error: 'vacio' };
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (c < 32 || c > 126) return { error: 'caracter', caracter: ch };
  }
  const v = [];
  let i = 0;
  let set;
  const r0 = corridaDigitos(s, 0);
  if (r0 >= 4 || (r0 === s.length && r0 % 2 === 0)) { set = 'C'; v.push(105); } else { set = 'B'; v.push(104); }
  while (i < s.length) {
    if (set === 'C') {
      if (corridaDigitos(s, i) >= 2) { v.push(+s.substr(i, 2)); i += 2; continue; }
      v.push(100); set = 'B';
      continue;
    }
    const r = corridaDigitos(s, i);
    if (r >= 6 || (r >= 4 && i + r === s.length)) {
      if (r % 2 === 1) { v.push(s.charCodeAt(i) - 32); i++; }
      v.push(99); set = 'C';
      continue;
    }
    v.push(s.charCodeAt(i) - 32);
    i++;
  }
  let suma = v[0];
  for (let k = 1; k < v.length; k++) suma += k * v[k];
  v.push(suma % 103);
  v.push(106);
  const modulos = v.map((x) => anchosAModulos(C128[x].split('').map(Number))).join('');
  return { modulos, guardas: [], textos: [{ x: null, t: s }], quietoIzq: 10, quietoDer: 10, verificador: suma % 103 };
}

// ---------- CODE39 ----------
const C39_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
const C39 = {
  0: 'nnnwwnwnn', 1: 'wnnwnnnnw', 2: 'nnwwnnnnw', 3: 'wnwwnnnnn', 4: 'nnnwwnnnw', 5: 'wnnwwnnnn', 6: 'nnwwwnnnn', 7: 'nnnwnnwnw',
  8: 'wnnwnnwnn', 9: 'nnwwnnwnn', A: 'wnnnnwnnw', B: 'nnwnnwnnw', C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn', F: 'nnwnwwnnn',
  G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn', K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww',
  O: 'wnnnwnnwn', P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn', S: 'nnwnnnwwn', T: 'nnnnwnwwn', U: 'wwnnnnnnw', V: 'nwwnnnnnw',
  W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn', Z: 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn',
  $: 'nwnwnwnnn', '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn',
};

function code39(texto, conVerificador) {
  const s = texto.toUpperCase();
  if (!s.length) return { error: 'vacio' };
  for (const ch of s) if (!C39_CHARS.includes(ch)) return { error: 'caracter', caracter: ch };
  let cuerpo = s;
  let verificador = null;
  if (conVerificador) {
    let suma = 0;
    for (const ch of s) suma += C39_CHARS.indexOf(ch);
    verificador = C39_CHARS[suma % 43];
    cuerpo += verificador;
  }
  const todo = '*' + cuerpo + '*';
  const partes = [...todo].map((ch) => anchosAModulos(C39[ch].split('').map((x) => (x === 'w' ? 3 : 1))));
  return { modulos: partes.join('0'), guardas: [], textos: [{ x: null, t: '*' + cuerpo + '*' }], quietoIzq: 10, quietoDer: 10, verificador };
}

// ---------- ITF (intercalado 2 de 5) ----------
const ITF = ['nnwwn', 'wnnnw', 'nwnnw', 'wwnnn', 'nnwnw', 'wnwnn', 'nwwnn', 'nnnww', 'wnnwn', 'nwnwn'];

function itf(texto) {
  let d = texto.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(d)) return { error: 'soloDigitos' };
  let aviso = null;
  let calculado = null;
  let correcto = null;
  if (d.length === 13) { calculado = digitoGS1(d); d += calculado; }
  else if (d.length === 14) {
    const c = digitoGS1(d.slice(0, 13));
    if (c !== +d[13]) return { error: 'verificador', esperado: c, valor: d.slice(0, 13) + c };
    correcto = c;
  } else if (d.length % 2 === 1) { d = '0' + d; aviso = 'ceroIzq'; }
  const w = (x) => (x === 'w' ? 3 : 1);
  let anchos = [1, 1, 1, 1];
  for (let i = 0; i < d.length; i += 2) {
    const a = ITF[+d[i]], b = ITF[+d[i + 1]];
    for (let k = 0; k < 5; k++) anchos.push(w(a[k]), w(b[k]));
  }
  anchos = anchos.concat([3, 1, 1]);
  return { modulos: anchosAModulos(anchos), guardas: [], textos: [{ x: null, t: d }], quietoIzq: 10, quietoDer: 10, valor: d, aviso, calculado, correcto };
}

export const FORMATOS = ['ean13', 'ean8', 'upca', 'code128', 'code39', 'itf'];

export function codificar(formato, texto, { verificador39 = false } = {}) {
  const t = String(texto || '').trim();
  if (!t) return { ok: false, error: 'vacio' };
  let r;
  switch (formato) {
    case 'ean8': {
      const g = revisarGS1(t, 8, 'EAN-8');
      if (g.error) return { ok: false, ...g };
      r = { ...ean8(g.valor), valor: g.valor, calculado: g.calculado, correcto: g.correcto };
      break;
    }
    case 'upca': {
      const g = revisarGS1(t, 12, 'UPC-A');
      if (g.error) return { ok: false, ...g };
      r = { ...ean('0' + g.valor, true), valor: g.valor, calculado: g.calculado, correcto: g.correcto };
      break;
    }
    case 'code128': r = code128(t); if (!r.error) r.valor = t; break;
    case 'code39': r = code39(t, verificador39); if (!r.error) r.valor = t.toUpperCase(); break;
    case 'itf': r = itf(t); break;
    default: {
      const g = revisarGS1(t, 13, 'EAN-13');
      if (g.error) return { ok: false, ...g };
      r = { ...ean(g.valor, false), valor: g.valor, calculado: g.calculado, correcto: g.correcto };
    }
  }
  if (r.error) return { ok: false, ...r };
  return { ok: true, formato, ...r };
}
