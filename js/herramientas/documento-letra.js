// Importe con letra al estilo de los documentos mexicanos: «un mil quinientos pesos 00/100 M.N.».
// Se usa en documento y en visor-cfdi. Sin red, sin dependencias.

const U = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece',
  'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiún', 'veintidós', 'veintitrés',
  'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const D = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const C = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos',
  'ochocientos', 'novecientos'];

function cientos(n) {
  if (n === 100) return 'cien';
  const c = Math.floor(n / 100), r = n % 100;
  const dec = r < 30 ? U[r] : D[Math.floor(r / 10)] + (r % 10 ? ' y ' + U[r % 10] : '');
  return [C[c], dec].filter(Boolean).join(' ');
}

// Entero a palabras. 1,000 es «un mil», como en cheques y facturas.
export function enteroEnLetra(n) {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'cero';
  const partes = [];
  const millones = Math.floor(n / 1e6), miles = Math.floor(n / 1000) % 1000, resto = n % 1000;
  if (millones) partes.push(millones === 1 ? 'un millón' : enteroEnLetra(millones) + ' millones');
  if (miles) partes.push(cientos(miles) + ' mil');
  if (resto) partes.push(cientos(resto));
  return partes.join(' ');
}

const MONEDAS = {
  MXN: ['peso', 'pesos', 'M.N.'],
  USD: ['dólar', 'dólares', 'USD'],
  EUR: ['euro', 'euros', 'EUR'],
};

export function importeEnLetra(monto, moneda = 'MXN') {
  const centavos = Math.round(Math.abs(Number(monto) || 0) * 100);
  const entero = Math.floor(centavos / 100), cent = String(centavos % 100).padStart(2, '0');
  const m = MONEDAS[moneda] || [moneda, moneda, moneda];
  const de = entero >= 1e6 && entero % 1e6 === 0 ? 'de ' : '';
  return `${enteroEnLetra(entero)} ${de}${entero === 1 ? m[0] : m[1]} ${cent}/100 ${m[2]}`;
}
