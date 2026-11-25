// Codificador de QR propio (ISO/IEC 18004), versiones 1 a 40, niveles L, M, Q y H.
// Modos numérico, alfanumérico y bytes (UTF-8). Sin dependencias y sin red.
// generarQR(texto, {nivel:'M', versionMin:1, mascara:-1}) -> {tam, version, nivel, modulos: Uint8Array(tam*tam)}

const NIVELES = { L: 0, M: 1, Q: 2, H: 3 };
const BITS_FORMATO = [1, 0, 3, 2]; // L, M, Q, H

// Codewords de corrección por bloque y número de bloques, por nivel (L, M, Q, H) y versión (1-40).
const ECC_POR_BLOQUE = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const BLOQUES = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

const ALFANUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

function modulosCrudos(v) {
  let r = (16 * v + 128) * v + 64;
  if (v >= 2) {
    const n = Math.floor(v / 7) + 2;
    r -= (25 * n - 10) * n - 55;
    if (v >= 7) r -= 36;
  }
  return r;
}

function codewordsDatos(v, nivel) {
  return Math.floor(modulosCrudos(v) / 8) - ECC_POR_BLOQUE[nivel][v] * BLOQUES[nivel][v];
}

function utf8(texto) {
  return Array.from(new TextEncoder().encode(texto));
}

// Elige el modo más compacto para todo el texto (un solo segmento).
function segmento(texto) {
  if (/^[0-9]*$/.test(texto)) return { modo: 1, bitsCuenta: [10, 12, 14], cuenta: texto.length, escribir: numerico(texto) };
  if ([...texto].every((c) => ALFANUM.includes(c))) return { modo: 2, bitsCuenta: [9, 11, 13], cuenta: texto.length, escribir: alfanum(texto) };
  const b = utf8(texto);
  return { modo: 4, bitsCuenta: [8, 16, 16], cuenta: b.length, escribir: (bb) => b.forEach((x) => bb.poner(x, 8)) };
}

function numerico(t) {
  return (bb) => {
    for (let i = 0; i < t.length; i += 3) {
      const g = t.slice(i, i + 3);
      bb.poner(parseInt(g, 10), g.length * 3 + 1);
    }
  };
}

function alfanum(t) {
  return (bb) => {
    let i = 0;
    for (; i + 1 < t.length; i += 2) bb.poner(ALFANUM.indexOf(t[i]) * 45 + ALFANUM.indexOf(t[i + 1]), 11);
    if (i < t.length) bb.poner(ALFANUM.indexOf(t[i]), 6);
  };
}

function bufferBits() {
  const bits = [];
  return {
    bits,
    poner(valor, n) { for (let i = n - 1; i >= 0; i--) bits.push((valor >>> i) & 1); },
  };
}

function bitsSegmento(seg, v) {
  const cb = seg.bitsCuenta[v <= 9 ? 0 : v <= 26 ? 1 : 2];
  if (seg.cuenta >= (1 << cb)) return Infinity;
  const bb = bufferBits();
  seg.escribir(bb);
  return 4 + cb + bb.bits.length;
}

// ---------- Reed-Solomon en GF(256), polinomio 0x11D ----------
function mult(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function divisorRS(grado) {
  const r = new Array(grado).fill(0);
  r[grado - 1] = 1;
  let raiz = 1;
  for (let i = 0; i < grado; i++) {
    for (let j = 0; j < r.length; j++) {
      r[j] = mult(r[j], raiz);
      if (j + 1 < r.length) r[j] ^= r[j + 1];
    }
    raiz = mult(raiz, 0x02);
  }
  return r;
}

function restoRS(datos, divisor) {
  const r = divisor.map(() => 0);
  for (const b of datos) {
    const f = b ^ r.shift();
    r.push(0);
    divisor.forEach((c, i) => { r[i] ^= mult(c, f); });
  }
  return r;
}

function intercalarConECC(datos, v, nivel) {
  const nb = BLOQUES[nivel][v];
  const eccLen = ECC_POR_BLOQUE[nivel][v];
  const crudos = Math.floor(modulosCrudos(v) / 8);
  const cortos = nb - (crudos % nb);
  const largoCorto = Math.floor(crudos / nb);
  const div = divisorRS(eccLen);
  const bloques = [];
  for (let i = 0, k = 0; i < nb; i++) {
    const dat = datos.slice(k, k + largoCorto - eccLen + (i < cortos ? 0 : 1));
    k += dat.length;
    const ecc = restoRS(dat, div);
    if (i < cortos) dat.push(0);
    bloques.push(dat.concat(ecc));
  }
  const res = [];
  for (let i = 0; i < bloques[0].length; i++) {
    for (let j = 0; j < bloques.length; j++) {
      if (i !== largoCorto - eccLen || j >= cortos) res.push(bloques[j][i]);
    }
  }
  return res;
}

// ---------- matriz ----------
function posicionesAlineacion(v) {
  if (v === 1) return [];
  const tam = v * 4 + 17;
  const n = Math.floor(v / 7) + 2;
  const paso = v === 32 ? 26 : Math.ceil((v * 4 + 4) / (n * 2 - 2)) * 2;
  const r = [6];
  for (let p = tam - 7; r.length < n; p -= paso) r.splice(1, 0, p);
  return r;
}

function construir(v, nivel, codewords, mascaraPedida) {
  const tam = v * 4 + 17;
  const m = new Uint8Array(tam * tam);
  const fn = new Uint8Array(tam * tam);
  const poner = (x, y, oscuro) => { m[y * tam + x] = oscuro ? 1 : 0; fn[y * tam + x] = 1; };

  for (let i = 0; i < tam; i++) { poner(6, i, i % 2 === 0); poner(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [tam - 4, 3], [3, tam - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= tam || y >= tam) continue;
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        poner(x, y, d !== 2 && d !== 4);
      }
    }
  }
  const al = posicionesAlineacion(v);
  const u = al.length - 1;
  for (let i = 0; i <= u; i++) {
    for (let j = 0; j <= u; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === u) || (i === u && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) poner(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
  ponerFormato(m, fn, tam, nivel, 0, poner);
  if (v >= 7) {
    let r = v;
    for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
    const bits = (v << 12) | r;
    for (let i = 0; i < 18; i++) {
      const b = (bits >>> i) & 1;
      const a = tam - 11 + (i % 3), c = Math.floor(i / 3);
      poner(a, c, b); poner(c, a, b);
    }
  }

  // Datos en zigzag.
  let i = 0;
  const total = codewords.length * 8;
  for (let der = tam - 1; der >= 1; der -= 2) {
    if (der === 6) der = 5;
    for (let vert = 0; vert < tam; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = der - j;
        const arriba = ((der + 1) & 2) === 0;
        const y = arriba ? tam - 1 - vert : vert;
        if (!fn[y * tam + x] && i < total) {
          m[y * tam + x] = (codewords[i >>> 3] >>> (7 - (i & 7))) & 1;
          i++;
        }
      }
    }
  }

  let mejor = mascaraPedida;
  if (mejor < 0) {
    let menor = Infinity;
    for (let k = 0; k < 8; k++) {
      aplicarMascara(m, fn, tam, k);
      ponerFormato(m, fn, tam, nivel, k, poner);
      const p = penalizacion(m, tam);
      if (p < menor) { menor = p; mejor = k; }
      aplicarMascara(m, fn, tam, k);
    }
  }
  aplicarMascara(m, fn, tam, mejor);
  ponerFormato(m, fn, tam, nivel, mejor, poner);
  return { tam, modulos: m, mascara: mejor };
}

function ponerFormato(m, fn, tam, nivel, mascara, poner) {
  const datos = (BITS_FORMATO[nivel] << 3) | mascara;
  let r = datos;
  for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
  const bits = ((datos << 10) | r) ^ 0x5412;
  const b = (i) => (bits >>> i) & 1;
  for (let i = 0; i <= 5; i++) poner(8, i, b(i));
  poner(8, 7, b(6)); poner(8, 8, b(7)); poner(7, 8, b(8));
  for (let i = 9; i < 15; i++) poner(14 - i, 8, b(i));
  for (let i = 0; i < 8; i++) poner(tam - 1 - i, 8, b(i));
  for (let i = 8; i < 15; i++) poner(8, tam - 15 + i, b(i));
  poner(8, tam - 8, 1);
}

function aplicarMascara(m, fn, tam, k) {
  for (let y = 0; y < tam; y++) {
    for (let x = 0; x < tam; x++) {
      if (fn[y * tam + x]) continue;
      let inv;
      switch (k) {
        case 0: inv = (x + y) % 2 === 0; break;
        case 1: inv = y % 2 === 0; break;
        case 2: inv = x % 3 === 0; break;
        case 3: inv = (x + y) % 3 === 0; break;
        case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
        case 5: inv = ((x * y) % 2) + ((x * y) % 3) === 0; break;
        case 6: inv = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        default: inv = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
      }
      if (inv) m[y * tam + x] ^= 1;
    }
  }
}

function penalizacion(m, tam) {
  let p = 0;
  const at = (x, y) => m[y * tam + x];
  const patron = [1, 0, 1, 1, 1, 0, 1];
  for (let pasada = 0; pasada < 2; pasada++) {
    for (let a = 0; a < tam; a++) {
      let corrida = 1;
      const lin = new Array(tam);
      for (let b = 0; b < tam; b++) lin[b] = pasada ? at(a, b) : at(b, a);
      for (let b = 1; b <= tam; b++) {
        if (b < tam && lin[b] === lin[b - 1]) corrida++;
        else { if (corrida >= 5) p += 3 + corrida - 5; corrida = 1; }
      }
      for (let b = 0; b + 7 <= tam; b++) {
        let ok = true;
        for (let k = 0; k < 7; k++) if (lin[b + k] !== patron[k]) { ok = false; break; }
        if (!ok) continue;
        const blancoAntes = b >= 4 && !lin[b - 1] && !lin[b - 2] && !lin[b - 3] && !lin[b - 4];
        const blancoDespues = b + 11 <= tam && !lin[b + 7] && !lin[b + 8] && !lin[b + 9] && !lin[b + 10];
        if (blancoAntes || blancoDespues) p += 40;
      }
    }
  }
  for (let y = 0; y + 1 < tam; y++) {
    for (let x = 0; x + 1 < tam; x++) {
      const c = at(x, y);
      if (c === at(x + 1, y) && c === at(x, y + 1) && c === at(x + 1, y + 1)) p += 3;
    }
  }
  let oscuros = 0;
  for (let i = 0; i < m.length; i++) oscuros += m[i];
  const total = tam * tam;
  const k = Math.ceil(Math.abs(oscuros * 20 - total * 10) / total) - 1;
  p += Math.max(0, k) * 10;
  return p;
}

export class QRDemasiadoLargo extends Error {}

export function generarQR(texto, { nivel = 'M', versionMin = 1, mascara = -1 } = {}) {
  const ecl = NIVELES[nivel] ?? 1;
  const seg = segmento(String(texto));
  let v = Math.max(1, Math.min(40, versionMin));
  let usados;
  for (; ; v++) {
    if (v > 40) throw new QRDemasiadoLargo('Texto demasiado largo para un QR');
    usados = bitsSegmento(seg, v);
    if (usados <= codewordsDatos(v, ecl) * 8) break;
  }
  const cap = codewordsDatos(v, ecl) * 8;
  const bb = bufferBits();
  bb.poner(seg.modo, 4);
  bb.poner(seg.cuenta, seg.bitsCuenta[v <= 9 ? 0 : v <= 26 ? 1 : 2]);
  seg.escribir(bb);
  bb.poner(0, Math.min(4, cap - bb.bits.length));
  bb.poner(0, (8 - (bb.bits.length % 8)) % 8);
  for (let rel = 0xec; bb.bits.length < cap; rel ^= 0xec ^ 0x11) bb.poner(rel, 8);
  const datos = [];
  for (let i = 0; i < bb.bits.length; i += 8) {
    let b = 0;
    for (let k = 0; k < 8; k++) b = (b << 1) | bb.bits[i + k];
    datos.push(b);
  }
  const cw = intercalarConECC(datos, v, ecl);
  const r = construir(v, ecl, cw, mascara);
  return { tam: r.tam, version: v, nivel, mascara: r.mascara, modulos: r.modulos };
}
