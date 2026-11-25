// Símbolos propios de Avelina para el creador de logos. Caja de 100 × 100, figuras rellenas.
// Dibujados con geometría simple (círculos, arcos, polígonos); «par» = huecos por regla par-impar.
import { circD, rectD, poliD, arcoD, elipseD } from '../_comun-diseno.js';

const P = Math.PI;
const rot = (pts, a, cx = 50, cy = 50) => pts.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);
const estrella = (n, r1, r2, cx = 50, cy = 50, a0 = -P / 2) => poliD(Array.from({ length: n * 2 }, (_, i) => { const a = a0 + (i * P) / n; const r = i % 2 ? r2 : r1; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }));
const anillo = (cx, cy, r1, r2) => circD(cx, cy, r1) + circD(cx, cy, r2);
// Sector de anillo de a0 a a1 (radianes).
const sector = (cx, cy, r1, r2, a0, a1) => arcoD(cx, cy, r1, a0, a1) + arcoD(cx, cy, r2, a1, a0, false) + 'Z';
const rayos = (n, r1, r2, ancho, cx = 50, cy = 50) => Array.from({ length: n }, (_, i) => poliD(rot([[cx - ancho / 2, cy - r2], [cx + ancho / 2, cy - r2], [cx + ancho / 2, cy - r1], [cx - ancho / 2, cy - r1]], (i * 2 * P) / n, cx, cy))).join('');

export const SIMBOLOS = {
  // ---- abstractos ----
  'circulo-partido': { n: 'Círculo partido', d: arcoD(50, 50, 42, P * 0.06, P * 0.94) + 'Z' + arcoD(50, 50, 42, P * 1.06, P * 1.94) + 'Z' },
  arcos: { n: 'Arcos', d: sector(20, 80, 60, 50, -P / 2, 0) + sector(20, 80, 42, 32, -P / 2, 0) + sector(20, 80, 24, 14, -P / 2, 0), par: true },
  rombo: { n: 'Rombo', d: poliD([[50, 6], [94, 50], [50, 94], [6, 50]]) + poliD([[50, 30], [70, 50], [50, 70], [30, 50]]), par: true },
  hojas: { n: 'Hojas', d: 'M50 8C78 28 78 72 50 92C22 72 22 28 50 8Z' + 'M8 50C28 22 72 22 92 50C72 78 28 78 8 50Z', par: true },
  bloques: { n: 'Bloques', d: rectD(10, 12, 56, 20, 3) + rectD(22, 40, 56, 20, 3) + rectD(34, 68, 56, 20, 3) },
  sol: { n: 'Sol', d: circD(50, 50, 20) + rayos(12, 28, 44, 6) },
  onda: { n: 'Ondas', d: 'M6 40C22 26 38 26 50 40C62 54 78 54 94 40L94 54C78 68 62 68 50 54C38 40 22 40 6 54Z' + 'M6 66C22 52 38 52 50 66C62 80 78 80 94 66L94 80C78 94 62 94 50 80C38 66 22 66 6 80Z' + circD(50, 18, 9) },
  destello: { n: 'Destello', d: 'M50 4C53 34 66 47 96 50C66 53 53 66 50 96C47 66 34 53 4 50C34 47 47 34 50 4Z' },
  'anillo-punto': { n: 'Anillo', d: anillo(50, 50, 44, 32) + circD(50, 50, 14), par: true },
  triangulos: { n: 'Triángulos', d: poliD([[8, 88], [38, 30], [68, 88]]) + poliD([[42, 88], [66, 42], [92, 88]]) },
  // ---- comida ----
  taco: { n: 'Taco', d: arcoD(50, 62, 42, P, 2 * P) + 'L92 66L8 66Z' + circD(28, 30, 8) + circD(46, 24, 9) + circD(64, 28, 8) + circD(78, 40, 6) },
  cubiertos: { n: 'Cubiertos', d: rectD(20, 8, 4, 30, 2) + rectD(28, 8, 4, 30, 2) + rectD(36, 8, 4, 30, 2) + 'M18 34L42 34L42 40C42 46 36 48 34 50L34 92L26 92L26 50C24 48 18 46 18 40Z' + 'M66 8C80 14 82 34 80 52L74 52L74 92L66 92Z' },
  cloche: { n: 'Campana', d: 'M12 70C12 46 28 30 50 30C72 30 88 46 88 70Z' + circD(50, 22, 6) + rectD(4, 74, 92, 8, 4) },
  chile: { n: 'Chile', d: 'M60 30C78 32 86 48 80 64C72 84 46 94 14 90C40 84 52 72 56 56C58 46 54 38 60 30Z' + 'M60 32C62 22 68 14 78 10L82 16C74 18 70 24 70 32Z' + 'M52 34C56 26 66 24 72 30C64 30 58 32 52 34Z' },
  taza: { n: 'Taza', d: 'M14 40L72 40L68 78C67 86 60 92 52 92L34 92C26 92 19 86 18 78Z' + 'M70 48C82 46 92 52 90 62C88 72 78 76 66 74L67 66C76 67 82 64 82 60C82 55 76 54 69 56Z' + 'M30 8C24 16 36 20 30 32L36 32C42 20 30 16 36 8Z' + 'M48 8C42 16 54 20 48 32L54 32C60 20 48 16 54 8Z' },
  grano: { n: 'Grano de café', d: elipseD(18, 6, 64, 88) + 'M50 8C34 30 66 60 50 92C64 74 40 44 56 10Z', par: true },
  concha: {
    n: 'Concha', par: true,
    d: arcoD(50, 64, 44, P, 2 * P) + 'L94 72L6 72Z' + rectD(6, 76, 88, 12, 6) +
      [[28, 40], [50, 32], [72, 40], [38, 54], [62, 54], [50, 46]].map(([x, y]) => poliD([[x - 9, y], [x, y - 5], [x + 9, y], [x, y + 5]])).join(''),
  },
  pizza: { n: 'Pizza', d: 'M10 18C36 6 64 6 90 18L50 94Z' + circD(36, 30, 6) + circD(62, 32, 6) + circD(50, 54, 6), par: true },
  pez: { n: 'Pez', d: 'M6 50C22 26 52 22 74 40L92 24L88 50L92 76L74 60C52 78 22 74 6 50Z' + circD(26, 46, 4), par: true },
  helado: { n: 'Helado', d: circD(50, 32, 24) + poliD([[28, 46], [72, 46], [50, 96]]) },
  pastel: { n: 'Pastel', d: rectD(14, 50, 72, 40, 4) + rectD(24, 28, 52, 20, 4) + rectD(48, 8, 4, 16, 2) + elipseD(45, 2, 10, 10) },
  olla: { n: 'Olla de barro', d: 'M22 34C10 44 10 74 26 86C34 92 66 92 74 86C90 74 90 44 78 34Z' + rectD(28, 22, 44, 10, 4) + 'M12 46C4 46 4 58 14 58L15 52C10 52 10 50 13 50Z' + 'M88 46C96 46 96 58 86 58L85 52C90 52 90 50 87 50Z' },
  // ---- belleza ----
  tijeras: { n: 'Tijeras', d: anillo(28, 76, 15, 8) + anillo(72, 76, 15, 8) + poliD([[34, 63], [40, 67], [78, 10], [72, 8]]) + poliD([[66, 63], [60, 67], [22, 10], [28, 8]]), par: true },
  peine: { n: 'Peine', d: rectD(8, 30, 84, 14, 4) + Array.from({ length: 9 }, (_, i) => rectD(12 + i * 9, 44, 5, 30, 2)).join('') },
  una: { n: 'Esmalte', par: true, d: rectD(38, 6, 24, 28, 3) + rectD(32, 34, 36, 8, 2) + rectD(20, 42, 60, 52, 12) + rectD(29, 52, 7, 30, 3.5) },
  gota: { n: 'Gota', d: 'M50 6C64 30 80 46 80 64C80 82 66 94 50 94C34 94 20 82 20 64C20 46 36 30 50 6Z' },
  flor: { n: 'Flor', d: Array.from({ length: 5 }, (_, i) => { const a = -P / 2 + (i * 2 * P) / 5; return circD(50 + 30 * Math.cos(a), 52 + 30 * Math.sin(a), 16); }).join('') + circD(50, 52, 11) },
  navaja: { n: 'Navaja', d: 'M12 64L56 20C60 16 66 16 70 20L74 24L28 70Z' + rectD(24, 66, 66, 14, 7) },
  poste: { n: 'Poste de barbería', d: rectD(34, 4, 32, 10, 4) + rectD(34, 86, 32, 10, 4) + 'M38 16L62 16L62 26L38 44Z' + 'M38 52L62 34L62 54L38 72Z' + 'M38 80L62 62L62 84L38 84Z' },
  bigote: { n: 'Bigote', d: 'M50 44C44 34 30 32 22 40C16 46 12 54 4 54C10 66 24 70 36 64C44 60 48 54 50 50C52 54 56 60 64 64C76 70 90 66 96 54C88 54 84 46 78 40C70 32 56 34 50 44Z' },
  // ---- carnicería ----
  res: { n: 'Res', d: 'M30 28L70 28L66 74C64 86 36 86 34 74Z' + 'M30 30C18 28 8 20 6 8C16 16 24 18 32 18Z' + 'M70 30C82 28 92 20 94 8C84 16 76 18 68 18Z' + 'M22 34L8 42L24 46Z' + 'M78 34L92 42L76 46Z' + circD(42, 70, 3) + circD(58, 70, 3), par: true },
  cuchillo: { n: 'Cuchillo', d: 'M10 18L74 18L74 58L22 58C14 58 10 52 10 46Z' + circD(62, 30, 5) + rectD(74, 30, 18, 16, 3), par: true },
  // ---- construcción y transporte ----
  casa: { n: 'Casa', d: poliD([[50, 8], [94, 46], [82, 46], [82, 92], [18, 92], [18, 46], [6, 46]]) + rectD(42, 62, 16, 30), par: true },
  edificios: { n: 'Edificios', d: rectD(8, 40, 24, 52) + rectD(38, 10, 24, 82) + rectD(68, 28, 24, 64) },
  ladrillos: { n: 'Ladrillos', d: [12, 32, 52, 72].map((y, f) => (f % 2 ? [[6, 11], [21, 26], [51, 26], [81, 11]] : [[6, 26], [36, 26], [66, 26]]).map(([x, w]) => rectD(x, y, w, 16, 2)).join('')).join('') },
  casco: { n: 'Casco', par: true, d: 'M12 66C12 40 28 24 50 24C72 24 88 40 88 66Z' + rectD(4, 68, 92, 10, 5) + rectD(44, 30, 12, 32, 3) },
  grua: { n: 'Grúa', d: rectD(22, 20, 10, 74) + rectD(6, 16, 86, 8) + poliD([[32, 24], [32, 12], [44, 24]]) + rectD(76, 24, 3, 30) + rectD(70, 54, 16, 12, 2) + rectD(12, 88, 30, 6) },
  camion: { n: 'Camión', d: rectD(4, 24, 60, 46, 3) + 'M66 36L84 36L96 52L96 70L66 70Z' + circD(24, 76, 10) + circD(78, 76, 10) + circD(24, 76, 4) + circD(78, 76, 4), par: true },
  flecha: { n: 'Flechas', d: poliD([[6, 20], [30, 20], [56, 50], [30, 80], [6, 80], [32, 50]]) + poliD([[44, 20], [68, 20], [94, 50], [68, 80], [44, 80], [70, 50]]) },
  carretera: { n: 'Carretera', d: poliD([[40, 8], [60, 8], [94, 92], [6, 92]]) + rectD(47, 20, 6, 12) + rectD(46, 42, 8, 16) + rectD(45, 68, 10, 18), par: true },
  // ---- deportes ----
  balon: { n: 'Balón', par: true, d: circD(50, 50, 45) + poliD(Array.from({ length: 5 }, (_, i) => [50 + 15 * Math.cos(-P / 2 + (i * 2 * P) / 5), 50 + 15 * Math.sin(-P / 2 + (i * 2 * P) / 5)])) + Array.from({ length: 5 }, (_, i) => { const a = -P / 2 + P / 5 + (i * 2 * P) / 5; const cx = 50 + 32 * Math.cos(a), cy = 50 + 32 * Math.sin(a); return poliD(Array.from({ length: 5 }, (_, j) => [cx + 8 * Math.cos(a + (j * 2 * P) / 5), cy + 8 * Math.sin(a + (j * 2 * P) / 5)])); }).join('') },
  pesa: { n: 'Pesa', d: rectD(4, 34, 12, 32, 3) + rectD(18, 22, 14, 56, 3) + rectD(32, 44, 36, 12) + rectD(68, 22, 14, 56, 3) + rectD(84, 34, 12, 32, 3) },
  // ---- ropa ----
  gancho: { n: 'Gancho', d: 'M47 30C47 22 43 18 43 14C43 8 57 8 57 14L51 14C51 12 49 12 49 14C49 18 53 22 53 30L94 70C96 72 95 76 92 76L8 76C5 76 4 72 6 70Z' + poliD([[50, 40], [80, 68], [20, 68]]), par: true },
  playera: { n: 'Playera', d: 'M34 10C38 18 62 18 66 10L94 24L84 44L74 38L74 92L26 92L26 38L16 44L6 24Z' },
  aguja: { n: 'Aguja e hilo', d: 'M70 6L76 12L26 92L20 90Z' + elipseD(64, 10, 6, 12) + 'M70 26C90 34 92 58 70 64C52 68 40 80 52 94L46 94C34 78 48 62 66 58C82 54 82 38 66 32Z', par: true },
  boton: { n: 'Botón', d: circD(50, 50, 44) + circD(50, 50, 34) + circD(40, 40, 6) + circD(60, 40, 6) + circD(40, 60, 6) + circD(60, 60, 6), par: true },
  // ---- salud y servicios ----
  diente: { n: 'Diente', d: 'M30 10C18 10 10 22 14 36C17 50 22 56 24 72C26 88 32 94 38 88C44 80 42 64 50 64C58 64 56 80 62 88C68 94 74 88 76 72C78 56 83 50 86 36C90 22 82 10 70 10C62 10 58 16 50 16C42 16 38 10 30 10Z' },
  cruz: { n: 'Cruz', d: 'M36 8L64 8L64 36L92 36L92 64L64 64L64 92L36 92L36 64L8 64L8 36L36 36Z' },
  corazon: { n: 'Corazón', d: 'M50 88C50 88 8 62 8 34C8 20 18 10 30 10C40 10 46 16 50 24C54 16 60 10 70 10C82 10 92 20 92 34C92 62 50 88 50 88Z' },
  huella: { n: 'Huella', d: 'M50 50C64 50 78 64 78 78C78 88 68 92 60 88C54 86 46 86 40 88C32 92 22 88 22 78C22 64 36 50 50 50Z' + elipseD(8, 30, 16, 22) + elipseD(28, 8, 16, 24) + elipseD(56, 8, 16, 24) + elipseD(76, 30, 16, 22) },
  llave: { n: 'Llave', d: 'M64 6C50 6 40 18 42 32L8 66C3 71 3 79 8 84L16 92C21 97 29 97 34 92L68 58C82 60 94 50 94 36L80 46L64 42L60 26L74 12C71 8 68 6 64 6Z' },
  engrane: { n: 'Engrane', d: rayos(8, 30, 46, 14) + circD(50, 50, 34) + circD(50, 50, 13), par: true },
  rayo: { n: 'Rayo', d: poliD([[58, 4], [16, 56], [44, 56], [36, 96], [84, 40], [54, 40]]) },
  'gota-agua': { n: 'Gota de agua', d: 'M50 6C64 30 80 46 80 64C80 82 66 94 50 94C34 94 20 82 20 64C20 46 36 30 50 6Z' + 'M36 62C36 72 42 80 52 82L52 76C46 74 42 70 42 62Z', par: true },
  balanza: { n: 'Balanza', d: rectD(47, 10, 6, 76) + rectD(28, 86, 44, 6, 3) + rectD(14, 20, 72, 5, 2) + 'M6 56L22 26L38 56C34 64 10 64 6 56Z' + 'M62 56L78 26L94 56C90 64 66 64 62 56Z' },
  columna: { n: 'Columna', d: poliD([[50, 6], [92, 24], [8, 24]]) + rectD(14, 28, 72, 6) + rectD(20, 38, 10, 42) + rectD(45, 38, 10, 42) + rectD(70, 38, 10, 42) + rectD(8, 84, 84, 8) },
  grafica: { n: 'Gráfica', d: rectD(10, 60, 18, 32, 2) + rectD(36, 40, 18, 52, 2) + rectD(62, 18, 18, 74, 2) + poliD([[8, 44], [36, 20], [52, 30], [82, 4], [86, 9], [53, 38], [37, 28], [12, 50]]) },
  libro: { n: 'Libro', d: 'M50 22C40 14 22 12 6 16L6 84C22 80 40 82 50 90Z' + 'M50 22C60 14 78 12 94 16L94 84C78 80 60 82 50 90Z' + 'M47 24L53 24L53 88L47 88Z', par: true },
  hoja: { n: 'Hoja', d: 'M12 88C10 50 34 12 90 10C90 64 56 90 12 88Z' + 'M16 84C34 62 52 44 72 28L74 31C54 48 36 66 20 88Z', par: true },
  'casa-llave': { n: 'Casa y llave', d: poliD([[50, 6], [94, 42], [84, 42], [84, 94], [16, 94], [16, 42], [6, 42]]) + circD(50, 52, 12) + rectD(46, 58, 8, 26), par: true },
  camara: { n: 'Cámara', d: rectD(6, 26, 88, 62, 10) + rectD(32, 14, 36, 16, 4) + circD(50, 57, 22) + circD(50, 57, 12), par: true },
  nota: { n: 'Nota musical', d: elipseD(10, 68, 30, 22) + rectD(34, 14, 6, 66) + elipseD(56, 58, 30, 22) + rectD(80, 6, 6, 64) + poliD([[34, 14], [86, 4], [86, 18], [34, 28]]) },
  diamante: { n: 'Diamante', d: poliD([[24, 12], [76, 12], [94, 36], [50, 92], [6, 36]]) + poliD([[30, 36], [70, 36], [50, 78]]) + poliD([[34, 18], [66, 18], [56, 30], [44, 30]]), par: true },
  burbujas: { n: 'Burbujas', d: anillo(36, 58, 28, 20) + anillo(72, 30, 18, 12) + circD(78, 74, 10), par: true },
  toldo: { n: 'Toldo', d: rectD(6, 10, 88, 8, 2) + [0, 1, 2, 3].map((i) => 'M' + (6 + i * 22) + ' 20L' + (28 + i * 22) + ' 20L' + (28 + i * 22) + ' 38C' + (28 + i * 22) + ' 48 ' + (6 + i * 22) + ' 48 ' + (6 + i * 22) + ' 38Z').join('') + rectD(12, 52, 76, 40, 2) + rectD(40, 62, 20, 30), par: true },
  avion: { n: 'Avión', d: 'M46 6C50 2 54 2 54 10L54 38L94 58L94 68L54 56L54 80L66 88L66 96L50 90L34 96L34 88L46 80L46 56L6 68L6 58L46 38L46 10Z' },
  chip: { n: 'Corchetes', d: 'M30 14L38 22L14 50L38 78L30 86L-2 50Z' + 'M70 14L102 50L70 86L62 78L86 50L62 22Z' + poliD([[56, 10], [64, 12], [44, 90], [36, 88]]) },
  estrella: { n: 'Estrella', d: estrella(5, 46, 20) },
  escudo: { n: 'Escudo', d: 'M50 4L90 16C90 54 76 80 50 96C24 80 10 54 10 16Z' },
  luna: { n: 'Luna', d: circD(50, 50, 44) + circD(66, 40, 36), par: true },
};

// Giro → símbolos sugeridos (el primero es el más típico).
export const GIROS = [
  ['taqueria', 'Taquería', ['taco', 'chile', 'olla', 'cubiertos']],
  ['restaurante', 'Restaurante o fonda', ['cubiertos', 'olla', 'cloche', 'chile']],
  ['cafeteria', 'Cafetería', ['taza', 'grano', 'hojas']],
  ['panaderia', 'Panadería', ['concha', 'pastel', 'sol']],
  ['pasteleria', 'Pastelería o repostería', ['pastel', 'concha', 'corazon']],
  ['pizzeria', 'Pizzería', ['pizza', 'cubiertos']],
  ['mariscos', 'Mariscos', ['pez', 'onda']],
  ['heladeria', 'Heladería o paletería', ['helado', 'sol']],
  ['carniceria', 'Carnicería', ['res', 'cuchillo', 'estrella']],
  ['estetica', 'Estética o salón de belleza', ['tijeras', 'peine', 'flor']],
  ['unas', 'Uñas', ['una', 'gota', 'flor', 'destello']],
  ['barberia', 'Barbería', ['poste', 'navaja', 'bigote', 'tijeras']],
  ['ropa', 'Tienda de ropa o boutique', ['gancho', 'aguja', 'boton']],
  ['camisetas', 'Camisetas y estampado', ['playera', 'boton', 'estrella']],
  ['constructora', 'Constructora', ['casa', 'edificios', 'casco', 'ladrillos', 'grua']],
  ['inmobiliaria', 'Inmobiliaria', ['casa-llave', 'casa', 'edificios']],
  ['transporte', 'Transporte o fletes', ['camion', 'flecha', 'carretera']],
  ['futbol', 'Equipo de fútbol', ['balon', 'estrella', 'escudo']],
  ['gimnasio', 'Gimnasio', ['pesa', 'rayo', 'flecha']],
  ['dental', 'Consultorio dental', ['diente', 'destello']],
  ['medico', 'Consultorio médico o farmacia', ['cruz', 'corazon']],
  ['veterinaria', 'Veterinaria o estética canina', ['huella', 'corazon']],
  ['ferreteria', 'Ferretería', ['llave', 'engrane', 'casa']],
  ['taller', 'Taller mecánico', ['engrane', 'llave']],
  ['electricista', 'Electricista', ['rayo', 'engrane']],
  ['plomeria', 'Plomería', ['gota-agua', 'llave']],
  ['abogados', 'Despacho de abogados', ['balanza', 'columna']],
  ['contador', 'Contador o despacho contable', ['grafica', 'columna', 'bloques']],
  ['escuela', 'Escuela o clases', ['libro', 'estrella', 'sol']],
  ['jardineria', 'Jardinería o vivero', ['hoja', 'hojas', 'flor']],
  ['floreria', 'Florería', ['flor', 'hoja']],
  ['fotografia', 'Fotografía', ['camara', 'anillo-punto']],
  ['musica', 'Música o eventos', ['nota', 'estrella']],
  ['joyeria', 'Joyería', ['diamante', 'destello']],
  ['lavanderia', 'Lavandería o limpieza', ['burbujas', 'gota']],
  ['tienda', 'Tienda o abarrotes', ['toldo', 'casa']],
  ['viajes', 'Agencia de viajes', ['avion', 'sol']],
  ['tecnologia', 'Tecnología o diseño', ['chip', 'bloques', 'arcos']],
  ['otro', 'Otro giro', ['circulo-partido', 'arcos', 'rombo', 'hojas', 'destello', 'triangulos']],
];

export const ABSTRACTOS = ['circulo-partido', 'arcos', 'rombo', 'hojas', 'bloques', 'sol', 'onda', 'destello', 'anillo-punto', 'triangulos', 'luna', 'estrella'];
