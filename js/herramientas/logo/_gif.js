// Codificador GIF propio (LZW) para el logo animado. Sin dependencias.
// gifAnimado(cuadros RGBA[], ancho, alto, retraso en centésimas, colores base[], avance(q)) → Blob

function hex(c) { const n = parseInt(String(c).replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

// Paleta: el fondo y, para cada color del logo, su escala hacia el fondo (los bordes suavizados caen ahí).
function paleta(colores) {
  const base = colores.map(hex);
  const fondo = base[0];
  const pal = [fondo];
  const otros = base.slice(1).filter((c, i, a) => a.findIndex((d) => d.join() === c.join()) === i && c.join() !== fondo.join());
  const pasos = Math.max(2, Math.floor(254 / Math.max(1, otros.length)));
  for (const c of otros) for (let i = 1; i <= pasos && pal.length < 256; i++) { const t = i / pasos; pal.push(fondo.map((v, j) => Math.round(v + (c[j] - v) * t))); }
  while (pal.length < 256) pal.push([0, 0, 0]);
  return pal;
}

function lzw(indices, minBits) {
  const salida = [];
  let actual = 0, nBits = 0;
  const poner = (codigo, bits) => { actual |= codigo << nBits; nBits += bits; while (nBits >= 8) { salida.push(actual & 255); actual >>>= 8; nBits -= 8; } };
  const limpiar = 1 << minBits, finCod = limpiar + 1;
  let tam = minBits + 1, sig = finCod + 1;
  let dic = new Map();
  poner(limpiar, tam);
  let w = indices[0];
  for (let i = 1; i < indices.length; i++) {
    const k = indices[i];
    const clave = w * 4096 + k;
    const c = dic.get(clave);
    if (c !== undefined) { w = c; continue; }
    poner(w, tam);
    if (sig < 4096) { dic.set(clave, sig++); if (sig > (1 << tam) && tam < 12) tam++; }
    else { poner(limpiar, tam); dic = new Map(); tam = minBits + 1; sig = finCod + 1; }
    w = k;
  }
  poner(w, tam);
  poner(finCod, tam);
  if (nBits > 0) salida.push(actual & 255);
  return salida;
}

export async function gifAnimado(cuadros, W, H, retraso, colores, avance) {
  const pal = paleta(colores);
  const cache = new Map();
  const cerca = (r, g, b) => {
    const k = (r << 16) | (g << 8) | b;
    let i = cache.get(k);
    if (i !== undefined) return i;
    let mejor = 0, d0 = Infinity;
    for (let j = 0; j < pal.length; j++) { const p = pal[j]; const d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2; if (d < d0) { d0 = d; mejor = j; if (!d) break; } }
    cache.set(k, mejor);
    return mejor;
  };
  const b = [];
  const txt = (s) => { for (const c of s) b.push(c.charCodeAt(0)); };
  const u16 = (v) => b.push(v & 255, (v >> 8) & 255);
  txt('GIF89a'); u16(W); u16(H); b.push(0xf7, 0, 0);
  for (const c of pal) b.push(c[0], c[1], c[2]);
  b.push(0x21, 0xff, 11); txt('NETSCAPE2.0'); b.push(3, 1, 0, 0, 0);
  const idx = new Uint8Array(W * H);
  for (let f = 0; f < cuadros.length; f++) {
    const px = cuadros[f];
    for (let i = 0, j = 0; i < idx.length; i++, j += 4) idx[i] = cerca(px[j], px[j + 1], px[j + 2]);
    const ultimo = f === cuadros.length - 1;
    b.push(0x21, 0xf9, 4, 0); u16(ultimo ? 180 : retraso); b.push(0, 0);
    b.push(0x2c); u16(0); u16(0); u16(W); u16(H); b.push(0);
    b.push(8);
    const datos = lzw(idx, 8);
    for (let i = 0; i < datos.length; i += 255) { const n = Math.min(255, datos.length - i); b.push(n); for (let k = 0; k < n; k++) b.push(datos[i + k]); }
    b.push(0);
    if (avance) avance((f + 1) / cuadros.length);
    if (f % 4 === 0) await new Promise((ok) => setTimeout(ok, 0));
  }
  b.push(0x3b);
  return new Blob([new Uint8Array(b)], { type: 'image/gif' });
}
