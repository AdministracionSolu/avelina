// Herramienta «paleta» de Avelina: paletas de colores con HEX, RGB y nombre.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// modos de generador: generador (por defecto), complementarios, analogos, triada, monocromatico, imagen
// modos de color: azul, cafe, gris, beige, naranja, tierra, lila, amarillo, blanco, elegante, frios, calidos,
//                 pastel, verde, rojo, rosa, morado, negro

import {
  h, textos as unirTextos, avisar, descargar, copiar, estado, lienzoABlob, leerImagen, PIE, boton,
  asegurarEstilos, selectorColor, hexARgb, rgbAHex, normalizarHex, luminancia, opcionesChip, nombreArchivo,
} from './_comun.js';

const ID = 'paleta';

export const TEXTOS = {
  desde: 'Arma tu paleta',
  desdeColor: 'Desde un color',
  desdeImagen: 'Desde una imagen',
  base: 'Color base',
  azar: 'Otro color al azar',
  generadas: 'Combinaciones de tu color',
  curadasNota: 'Toca un color para copiar su código HEX.',
  propia: 'Arma la tuya desde un color',
  imagen: 'Sube una foto o tu logo',
  imagenAyuda: 'JPG, PNG o WebP. Tu archivo no sale de tu equipo.',
  imagenElegir: 'Elegir imagen',
  imagenSoltar: 'O suéltala aquí.',
  imagenPaleta: 'Colores de tu imagen',
  imagenError: 'No se pudo leer esa imagen. Prueba con JPG o PNG.',
  armonias: {
    complementarios: ['Complementarios', 'Tu color y su opuesto en el círculo. Dan contraste para botones y avisos.'],
    analogos: ['Análogos', 'Colores vecinos. Se ven tranquilos y van bien en fondos.'],
    triada: ['Tríada', 'Tres colores a la misma distancia. Dan variedad sin pelearse.'],
    monocromatico: ['Monocromático', 'Un solo tono, de oscuro a claro. Ordena una página sin esfuerzo.'],
    dividida: ['Complementarios divididos', 'Tu color y los dos vecinos de su opuesto. Contraste más suave.'],
  },
  png: 'PNG',
  css: 'CSS',
  pngEtiqueta: (n) => `Descargar ${n} en PNG`,
  cssEtiqueta: (n) => `Descargar ${n} como variables CSS`,
  copiado: (x) => `Copiado ${x}.`,
  noCopiado: 'No se pudo copiar. Selecciona el código y cópialo.',
  descargado: 'Listo. Revisa tus descargas.',
  copiarColor: (nombre, hex) => `Copiar ${nombre} ${hex}`,
  titulos: {
    azul: 'Paletas de color azul', cafe: 'Paletas de color café', gris: 'Paletas de color gris', beige: 'Paletas de color beige',
    naranja: 'Paletas de color naranja', tierra: 'Paletas de colores tierra', lila: 'Paletas de color lila',
    amarillo: 'Paletas de color amarillo', blanco: 'Paletas con blanco', elegante: 'Paletas de colores elegantes',
    frios: 'Paletas de colores fríos', calidos: 'Paletas de colores cálidos', pastel: 'Paletas de colores pastel',
    verde: 'Paletas de color verde', rojo: 'Paletas de color rojo', rosa: 'Paletas de color rosa', morado: 'Paletas de color morado',
    negro: 'Paletas con negro',
  },
};

// ---------- nombres de colores ----------
const NOMBRES = ('Negro 000000|Carbón 2B2B2B|Grafito 3A3F45|Gris oscuro 4D4D4D|Gris 808080|Gris plata C0C0C0|Gris perla D9D9D6|' +
  'Blanco humo F5F5F5|Blanco FFFFFF|Hueso F2EEE7|Marfil FFFFF0|Crema F6EEDC|Beige D8C3A5|Arena C2B280|Caqui C3B091|Lino E8DED1|' +
  'Vainilla F3E5AB|Champaña F7E7CE|Topo 8B7D6B|Café 6F4E37|Chocolate 3B2416|Café claro A47551|Moka 4A3B31|Canela C17F45|' +
  'Caramelo C68E3F|Avellana 8E7351|Madera 8B5E3C|Terracota C8734F|Barro 6E4B32|Óxido A0522D|Ladrillo 9C4A2F|Cobre B87333|' +
  'Bronce CD7F32|Dorado D4AF37|Oro viejo B8975A|Mostaza C9A227|Miel D99A3D|Ámbar FFBF00|Amarillo FFD500|Amarillo limón FFF44F|' +
  'Amarillo pastel FDFD96|Durazno FFCBA4|Salmón FA8072|Coral FF7F50|Naranja FF8C00|Mandarina F28C28|Naranja quemado CC5803|' +
  'Calabaza E2711D|Rojo D62828|Rojo tomate E63946|Carmín 960018|Vino 6A1B29|Guinda 5E0B15|Cereza A4133C|Frambuesa D1495B|' +
  'Rosa F4A6B8|Rosa palo E8C7C8|Rosa mexicano E4007C|Fucsia FF00A0|Rosa chicle FFAFCC|Malva C49BBB|Ciruela 6A2C70|' +
  'Berenjena 52354F|Morado 5A189A|Uva 5B2A86|Violeta 7F4FC9|Lila B39DDB|Lavanda D9D2E9|Índigo 262C6B|Azul marino 0B1F3A|' +
  'Azul noche 0B132B|Azul rey 2350A8|Azul 1F6FB2|Azul acero 4F7CAC|Azul cielo 87CEEB|Azul bebé A9D6E5|Azul hielo E9F5FA|' +
  'Celeste 8ECAE6|Azul petróleo 0B3C49|Turquesa 189AB4|Cian 00B7C7|Aguamarina 75E6DA|Verde agua 94D2BD|Menta B8E0D2|' +
  'Verde menta 6CC4A1|Verde esmeralda 1F8A5B|Verde 2E9E44|Verde bosque 1B4332|Verde botella 0B3B24|Verde olivo 606C38|' +
  'Salvia A3B18A|Verde limón A7C957|Verde pistache B5D99C|Verde musgo 4F5D2F|Gris azulado 5D6D7E|Gris cálido 8C847C|' +
  'Azul grisáceo 778DA9|Rosa durazno FFD8BE|Vino tinto 3B0D11|Verde pino 163832').split('|').map((x) => {
  const i = x.lastIndexOf(' ');
  return [x.slice(0, i), aLab(hexARgb(x.slice(i + 1)))];
});

function aLab([r, g, b]) {
  const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const R = f(r), G = f(g), B = f(b);
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const k = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * k(Y) - 16, 500 * (k(X) - k(Y)), 200 * (k(Y) - k(Z))];
}

export function nombreColor(hex) {
  const lab = aLab(hexARgb(hex));
  let mejor = '', d = Infinity;
  for (const [n, l] of NOMBRES) {
    const e = (l[0] - lab[0]) ** 2 + (l[1] - lab[1]) ** 2 + (l[2] - lab[2]) ** 2;
    if (e < d) { d = e; mejor = n; }
  }
  return mejor;
}

// ---------- HSL ----------
function aHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  let hh = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    hh = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    hh *= 60;
  }
  return [hh, s * 100, l * 100];
}

function deHsl(hh, s, l) {
  hh = ((hh % 360) + 360) % 360; s = Math.max(0, Math.min(100, s)) / 100; l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((hh / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = hh < 60 ? [c, x, 0] : hh < 120 ? [x, c, 0] : hh < 180 ? [0, c, x] : hh < 240 ? [0, x, c] : hh < 300 ? [x, 0, c] : [c, 0, x];
  return rgbAHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

export function armonia(tipo, base) {
  const [hh, s, l] = aHsl(hexARgb(base));
  const b = normalizarHex(base);
  switch (tipo) {
    case 'analogos': return [deHsl(hh - 40, s, l), deHsl(hh - 20, s, l), b, deHsl(hh + 20, s, l), deHsl(hh + 40, s, l)];
    case 'triada': return [deHsl(hh, s * 0.6, 14), b, deHsl(hh + 120, s, l), deHsl(hh + 240, s, l), deHsl(hh, s * 0.3, 95)];
    case 'monocromatico': return [12, 28, null, 72, 92].map((x) => (x == null ? b : deHsl(hh, s, x)))
      .sort((p, q) => luminancia(hexARgb(p)) - luminancia(hexARgb(q)));
    case 'dividida': return [deHsl(hh, s * 0.5, 15), b, deHsl(hh + 150, s, l), deHsl(hh + 210, s, l), deHsl(hh, s * 0.35, 94)];
    default: return [deHsl(hh, s, Math.max(8, l - 25)), b, deHsl(hh, s * 0.4, 93), deHsl(hh + 180, s, l), deHsl(hh + 180, s, Math.max(8, l - 22))];
  }
}

// ---------- paletas curadas ----------
const CURADAS = {
  azul: ['1E4E8C', 'Azul marino clásico 0B1F3A 1E4E8C 4F7CAC A9C4E0 F2F5F9', 'Mar y arena 12355B 2E86AB A3CEF1 F1E9DA E4C590',
    'Azul cielo 0A2342 2C7DA0 61A5C2 A9D6E5 E9F5FA', 'Azul y naranja 0D3B66 1F6FB2 F4F1EA F79D2B E2620F',
    'Índigo nocturno 10142E 262C6B 4B4FA6 8D90D6 D8D9F2', 'Turquesa fresco 05445E 189AB4 75E6DA D4F1F4 F7FBFC'],
  cafe: ['6F4E37', 'Café de olla 2B1B12 5A3A22 8B5E3C C69C72 EFE3D3', 'Chocolate y crema 3B2416 6F4E37 A47551 D9BFA0 F6EEE3',
    'Café con leche 4B3426 7F5539 B08968 DDB892 EDE0D4', 'Madera y verde 3E2C1C 7A5230 B58B5A 8A9A5B E9E4D4',
    'Canela 5C3317 8E5A2E C17F45 E3B07D F8E7D2', 'Moka moderno 1E1B18 4A3B31 8C7462 CDBBA7 F4F0EB'],
  gris: ['6B7280', 'Grafito 1F2328 3A3F45 6B7280 A9AFB7 E7E9EC', 'Gris cálido 2E2A27 57514B 8C847C C2BBB3 F0EDEA',
    'Gris y amarillo 2B2D31 5B5F66 A0A4AA E9EAEC F2C230', 'Gris azulado 1C2833 34495E 5D6D7E AEB6BF EBEDEF',
    'Concreto 3D3D3D 6E6E6E 9E9E9E CFCFCF F5F5F5', 'Gris y coral 2F3437 6C757D CED4DA F8F9FA E76F51'],
  beige: ['D8C3A5', 'Beige natural 8E7F6A B9A68A D8C3A5 EAE0D0 F7F3EC', 'Lino 5E5346 A39382 CDBFAE E8DED1 FAF7F2',
    'Beige y verde olivo 4F5D2F 8A9A5B D8C3A5 EDE3D1 F8F4EC', 'Arena y negro 1B1B1B 5C554B B8A88A E4D8C3 F6F1E7',
    'Beige y terracota A0522D C97B5A E2C2A4 F0E3D3 FBF7F1', 'Vainilla 6B5B45 C9B79C E6D5B8 F3E9D7 FFFBF4'],
  naranja: ['F28C28', 'Naranja vivo 7A2E0B C2410C F28C28 FDBA74 FFF1E6', 'Mandarina y azul 0F3D5E 1F6F8B F4F1EA F7A541 E85D04',
    'Atardecer 3D1E6D 8E3B8F E4572E F3A712 F9E2AE', 'Naranja quemado 4A1F0E 8C3B12 CC5803 E2711D FFB627',
    'Durazno E76F51 F4A261 F8C291 FCE1C8 FFF6EE', 'Naranja y gris 2D3033 5C6166 D9D9D9 FF8C42 FFF3E9'],
  tierra: ['A0522D', 'Barro 3B2A20 6E4B32 A0522D C98E5A EBD9C1', 'Desierto 5B3A29 8C5A3C C2956B E0C097 F4E7D3',
    'Terracota y salvia 9C4A2F C8734F E8C3A0 A3B18A 588157', 'Otoño 582F0E 7F4F24 936639 A68A64 B6AD90',
    'Cerámica 7D3C2B B5653F D9A066 EADBC8 F7F1E8', 'Tierra y bosque 2F3E2E 4F6F52 A0522D D2A679 F2E8DA'],
  lila: ['B39DDB', 'Lila suave 4B3869 7E5BA6 B39DDB DCCEF2 F6F1FC', 'Lavanda 5B4B8A 8E7CC3 B4A7D6 D9D2E9 F3F0F9',
    'Lila y menta 4A3F6B 9D8BC9 E2DAF5 BDE8D6 6CC4A1', 'Lila y gris 2E2B35 6B6577 B8B2C4 DCD3EC A98BD4',
    'Malva 5E3A58 8F5E86 C49BBB E6CFE0 F8F0F5', 'Lila y amarillo 3F2E63 7A5AB5 C7B6EA F7F2FF F2C94C'],
  amarillo: ['F2C230', 'Amarillo sol 6B4E00 B88A00 F2C230 F9E07F FFF8DC', 'Mostaza 3C3A2E 7A6A26 C9A227 E6C65C F6EDC6',
    'Amarillo y negro 111111 333333 F5C518 FFE580 FFFBEA', 'Limón y verde 2D6A4F 52B788 D8F3DC FFE66D FFD000',
    'Amarillo y azul 0B2545 13315C 8DA9C4 EEF4ED F4C430', 'Miel 6F4518 A0662B D99A3D F2C26B FBE7B5'],
  blanco: ['F7F7F5', 'Blanco roto 2B2B2B 8A8A86 DAD8D2 EFEDE8 FAF9F6', 'Blanco y madera 3E2C1C A47551 E8DCCB F5F1EA FFFFFF',
    'Blanco y azul 0B3954 087E8B BFD7EA F0F6FA FFFFFF', 'Hueso 514A40 9E968A E3DDD3 F2EEE7 FBF9F5',
    'Nieve y negro 0B0B0B 3D3D3D CFCFCF EFEFEF FCFCFC', 'Blanco y verde 1B4332 40916C D8F3DC F1F8F4 FFFFFF'],
  elegante: ['1C1C1C', 'Negro y oro 0E0E0E 1C1C1C B8975A D9C49A F5EFE3', 'Azul noche y plata 0B132B 1C2541 3A506B C0C6CF F2F4F7',
    'Vino y crema 3B0D11 6A1B29 A44A3F E8D5C4 F7F1EA', 'Verde esmeralda 0B2B26 163832 235347 8EB69B DAF1DE',
    'Carbón y rosa palo 222222 4A4A4A C9ADA7 E8D6CF F7F1EE', 'Marfil y negro 121212 2F2F2F 8C8C8C E6E1D6 FAF8F3'],
  frios: ['2C7DA0', 'Hielo 023047 219EBC 8ECAE6 CDEDF6 F4FBFE', 'Bosque frío 0B3C49 31708E 5085A5 8FC1E3 F7F9FB',
    'Verde agua 004E64 00A5CF 25A18E 7AE582 9FFFCB', 'Lavanda fría 22223B 4A4E69 9A8C98 C9ADA7 F2E9E4',
    'Menta y azul 0F4C5C 2A9D8F 94D2BD E9F5F2 FFFFFF', 'Glaciar 1B263B 415A77 778DA9 E0E1DD F8F9FA'],
  calidos: ['E76F51', 'Brasas 6A040F 9D0208 D00000 E85D04 FAA307', 'Terracota cálido 264653 2A9D8F E9C46A F4A261 E76F51',
    'Durazno y vino 5F0F40 9A031E E36414 FB8B24 FCE5CD', 'Canela y mostaza 7F4F24 B5651D E09F3E F2CC8F FFF3E0',
    'Coral 8C2F39 D1495B EDAE49 F7D08A FFF5E1', 'Atardecer suave 6D597A B56576 E56B6F EAAC8B FFE5D9'],
  pastel: ['F8C8DC', 'Pastel clásico FFADAD FFD6A5 FDFFB6 CAFFBF A0C4FF', 'Algodón CDB4DB FFC8DD FFAFCC BDE0FE A2D2FF',
    'Menta y durazno B8E0D2 D6EADF EAC4D5 FFD8BE FFF1E6', 'Pastel suave F1E4F3 F4D8CD EDB8B8 C5DECD DDEDEA',
    'Helado FBE7C6 B4F8C8 A0E7E5 FFAEBC FFF5F7', 'Lila pastel 957DAD D291BC E0BBE4 FEC8D8 FFDFD3'],
  verde: ['2D6A4F', 'Verde bosque 081C15 1B4332 2D6A4F 74C69D D8F3DC', 'Salvia 3A4A3F 6B8F71 A3B18A DAD7CD F4F3EE',
    'Verde olivo 283618 606C38 A3A380 FEFAE0 DDA15E', 'Verde menta 0B6E4F 08A045 6BBF59 CDEAC0 F3FAF0',
    'Verde y madera 344E41 588157 A3B18A B08968 EDE0D4', 'Verde limón 386641 6A994E A7C957 F2E8CF BC4749'],
  rojo: ['C1121F', 'Rojo clásico 3D0A0E 780000 C1121F F28482 FDF0D5', 'Rojo y azul 003049 669BBC FDF0D5 C1121F 780000',
    'Rojo cereza 590D22 A4133C FF4D6D FFB3C1 FFF0F3', 'Rojo y gris 212529 495057 ADB5BD F8F9FA D62828',
    'Tomate 9B2226 AE2012 E63946 F1FAEE A8DADC', 'Rojo y crema 6A040F 9D0208 DC2F02 F4E3C1 FFF8EC'],
  rosa: ['F4A6B8', 'Rosa palo 6D4C51 B5838D E5989B FFB4A2 FFE5EC', 'Rosa mexicano 4A0E2E A3195B E4007C F7A8C8 FDEAF2',
    'Rosa y verde 2F5233 94C973 FFF4F2 F7B9C4 E07A95', 'Rosa y gris 2E2E2E 6C6C6C D6D6D6 F8D7DD E8909C',
    'Rosa empolvado 8E5572 BC96A6 E8C7C8 F5E1DA FBF4F1', 'Rosa y dorado 3B2C35 C9A66B EFD9B4 F2C1CB FFF2F4'],
  morado: ['5A189A', 'Morado intenso 10002B 3C096C 5A189A 9D4EDD E0AAFF', 'Ciruela 3C1642 6A2C70 B83B5E F08A5D F9ED69',
    'Morado y rosa 231942 5E548E 9F86C0 BE95C4 E0B1CB', 'Uva 2D0A31 5B2A86 9A79B9 D3C4E3 F5F0FA',
    'Morado y amarillo 2E1760 3423A6 7180B9 DFF3E4 F7B32B', 'Berenjena 2B1D2F 52354F 8C5383 C79DC1 F2E6F0'],
  negro: ['111111', 'Negro y blanco 000000 1C1C1C 5A5A5A D9D9D9 FFFFFF', 'Negro y rojo 0B0B0B 1F1F1F 3A3A3A E63946 F1FAEE',
    'Negro y verde 0D0D0D 1E2A23 2D6A4F 95D5B2 F1F8F3', 'Negro y beige 121212 2B2B2B A68A64 E6D5B8 F7F1E5',
    'Carbón azulado 0D1321 1D2D44 3E5C76 748CAB F0EBD8', 'Negro y naranja 0F0F0F 262626 F77F00 FCBF49 EAE2B7'],
};

const ALIAS = { marron: 'cafe', 'café': 'cafe', frio: 'frios', 'fríos': 'frios', calido: 'calidos', 'cálidos': 'calidos', blancos: 'blanco',
  elegantes: 'elegante', amarilla: 'amarillo', pasteles: 'pastel', morada: 'morado', roja: 'rojo', verdes: 'verde', grises: 'gris', negra: 'negro' };

export const MODOS_COLOR = Object.keys(CURADAS);

export function paletasDe(color) {
  const c = CURADAS[ALIAS[color] || color];
  if (!c) return null;
  return {
    semilla: '#' + c[0],
    paletas: c.slice(1).map((linea) => {
      const partes = linea.split(' ');
      const hexes = partes.filter((p) => /^[0-9A-F]{6}$/.test(p));
      return { nombre: partes.slice(0, partes.length - hexes.length).join(' '), colores: hexes.map((x) => '#' + x) };
    }),
  };
}

// ---------- extraer colores de una imagen (k-medias en el equipo) ----------
export function extraerColores(imagen, k = 6) {
  const lado = 120;
  const esc = Math.min(1, lado / Math.max(imagen.width, imagen.height));
  const w = Math.max(1, Math.round(imagen.width * esc)), hh = Math.max(1, Math.round(imagen.height * esc));
  const c = document.createElement('canvas');
  c.width = w; c.height = hh;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imagen, 0, 0, w, hh);
  const d = ctx.getImageData(0, 0, w, hh).data;
  const px = [];
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) px.push([d[i], d[i + 1], d[i + 2]]);
  if (!px.length) return [];
  const dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  // Semillas: el promedio y luego el punto más lejano de las que ya hay (determinista).
  const prom = [0, 1, 2].map((j) => px.reduce((s, p) => s + p[j], 0) / px.length);
  const centros = [prom];
  while (centros.length < Math.min(k, px.length)) {
    let mejor = null, md = -1;
    for (let i = 0; i < px.length; i += 3) {
      const m = Math.min(...centros.map((cc) => dist(cc, px[i])));
      if (m > md) { md = m; mejor = px[i]; }
    }
    if (md <= 0) break;
    centros.push(mejor.slice());
  }
  let cuentas = [];
  for (let it = 0; it < 12; it++) {
    const suma = centros.map(() => [0, 0, 0]);
    cuentas = centros.map(() => 0);
    for (const p of px) {
      let j = 0, md = Infinity;
      for (let q = 0; q < centros.length; q++) { const e = dist(centros[q], p); if (e < md) { md = e; j = q; } }
      suma[j][0] += p[0]; suma[j][1] += p[1]; suma[j][2] += p[2]; cuentas[j]++;
    }
    centros.forEach((cc, j) => { if (cuentas[j]) for (let z = 0; z < 3; z++) cc[z] = suma[j][z] / cuentas[j]; });
  }
  return centros.map((cc, j) => ({ hex: rgbAHex(...cc), n: cuentas[j] }))
    .filter((x) => x.n > 0).sort((a, b) => b.n - a.n).map((x) => x.hex)
    .filter((x, i, arr) => arr.indexOf(x) === i);
}

// ---------- archivos ----------
export function cssDePaleta(nombre, colores) {
  const slug = nombreArchivo(nombre);
  return `/* Paleta «${nombre}» · ${PIE} */\n:root {\n` +
    colores.map((c, i) => `  --${slug}-${i + 1}: ${c}; /* ${nombreColor(c)} · rgb(${hexARgb(c).join(', ')}) */`).join('\n') + '\n}\n';
}

export function lienzoDePaleta(nombre, colores) {
  const W = 1500, alto = 620, datos = 190, pie = 70;
  const c = document.createElement('canvas');
  c.width = W; c.height = alto + datos + pie;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, c.width, c.height);
  const ancho = W / colores.length;
  const fuente = '"Helvetica Neue", Arial, sans-serif';
  colores.forEach((col, i) => {
    const x = Math.round(i * ancho), x2 = Math.round((i + 1) * ancho);
    ctx.fillStyle = col;
    ctx.fillRect(x, 0, x2 - x, alto);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#111111';
    ctx.font = `600 34px ${fuente}`;
    ctx.fillText(col, x + 24, alto + 62);
    ctx.font = `26px ${fuente}`;
    ctx.fillStyle = '#4d4d4d';
    ctx.fillText(`rgb ${hexARgb(col).join(', ')}`, x + 24, alto + 106);
    ctx.fillText(nombreColor(col), x + 24, alto + 146);
  });
  ctx.fillStyle = '#8c8c8c';
  ctx.font = `22px ${fuente}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(PIE, W / 2, c.height - pie / 2);
  return c;
}

// ---------- herramienta ----------
export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  const t = unirTextos(TEXTOS, opciones);
  t.titulos = Object.assign({}, TEXTOS.titulos, (opciones.textos && opciones.textos.titulos) || {});
  t.armonias = Object.assign({}, TEXTOS.armonias, (opciones.textos && opciones.textos.armonias) || {});
  const modo = String(opciones.modo || 'generador').toLowerCase();
  const claveColor = CURADAS[ALIAS[modo] || modo] ? (ALIAS[modo] || modo) : null;
  const curadas = claveColor ? paletasDe(claveColor) : null;
  const ordenArmonias = ['complementarios', 'analogos', 'triada', 'monocromatico', 'dividida'];
  if (ordenArmonias.includes(modo)) ordenArmonias.sort((a, b) => (a === modo ? -1 : b === modo ? 1 : 0));

  let base = curadas ? curadas.semilla : '#1F6FB2';
  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-paleta', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);
  const est = estado();

  function bloquePaleta(nombre, colores, nota, nivel = 'h3') {
    const tiras = h('div', { class: 'ah-tiras', role: 'list' }, colores.map((col) => {
      const nom = nombreColor(col);
      const rgb = hexARgb(col).join(', ');
      return h('button', {
        type: 'button', class: 'ah-tira', role: 'listitem', 'aria-label': t.copiarColor(nom, col),
        onclick: async () => {
          const ok = await copiar(col);
          est.decir(ok ? t.copiado(col) : t.noCopiado);
          if (ok) avisar(contenedor, ID, 'copiar');
        },
      }, h('span', { class: 'ah-tira-color', style: `background:${col}` }),
      h('span', { class: 'ah-tira-datos' }, h('b', { text: col }), h('span', { text: `rgb ${rgb}` }), h('span', { text: nom })));
    }));
    const bPng = boton(t.png, async () => {
      descargar(await lienzoABlob(lienzoDePaleta(nombre, colores)), `paleta-${nombreArchivo(nombre)}.png`);
      est.decir(t.descargado);
      avisar(contenedor, ID, 'descargar');
    }, 'ah-boton ah-boton-2');
    bPng.setAttribute('aria-label', t.pngEtiqueta(nombre));
    const bCss = boton(t.css, () => {
      descargar(new Blob([cssDePaleta(nombre, colores)], { type: 'text/css' }), `paleta-${nombreArchivo(nombre)}.css`);
      est.decir(t.descargado);
      avisar(contenedor, ID, 'descargar');
    }, 'ah-boton ah-boton-2');
    bCss.setAttribute('aria-label', t.cssEtiqueta(nombre));
    return h('section', { class: 'ah-paleta-bloque' },
      h('div', { class: 'ah-paleta-cabeza' }, h(nivel, { text: nombre }), h('div', { class: 'ah-acciones' }, bPng, bCss),
        nota ? h('p', { text: nota }) : null),
      tiras);
  }

  // Generador desde un color
  const listaArmonias = h('div', { class: 'ah-paletas' });
  function pintarArmonias() {
    listaArmonias.textContent = '';
    for (const a of ordenArmonias) {
      const [nom, nota] = t.armonias[a];
      listaArmonias.append(bloquePaleta(nom, armonia(a, base), nota));
    }
  }
  let tempo;
  const selector = selectorColor(t.base, base, (v) => { base = v; clearTimeout(tempo); tempo = setTimeout(pintarArmonias, 60); });
  const bAzar = boton(t.azar, () => {
    base = deHsl(Math.random() * 360, 45 + Math.random() * 40, 35 + Math.random() * 25);
    selector.fijar(base);
    pintarArmonias();
  }, 'ah-boton ah-boton-2');
  const generador = h('div', { class: 'ah-paletas' },
    h('div', { class: 'ah-paleta-arriba' }, selector, h('div', { class: 'ah-acciones' }, bAzar)),
    listaArmonias);

  // Desde una imagen
  const archivo = h('input', { type: 'file', accept: 'image/*', class: 'ah-archivo', id: 'ah-img-' + Math.random().toString(36).slice(2, 8) });
  const previa = h('img', { class: 'ah-imagen-previa', alt: '', hidden: true });
  const resultadoImg = h('div', { class: 'ah-paletas' });
  const errImg = h('p', { class: 'ah-error', hidden: true, text: t.imagenError });
  async function usarArchivo(f) {
    if (!f) return;
    try {
      const { img, url } = await leerImagen(f);
      previa.src = url;
      previa.hidden = false;
      errImg.hidden = true;
      const cols = extraerColores(img, 6);
      resultadoImg.textContent = '';
      resultadoImg.append(bloquePaleta(t.imagenPaleta, cols, t.curadasNota));
      if (cols[0]) { base = cols[0]; selector.fijar(base); pintarArmonias(); }
    } catch (e) { errImg.hidden = false; }
  }
  archivo.addEventListener('change', () => usarArchivo(archivo.files && archivo.files[0]));
  const zona = h('div', { class: 'ah-soltar' },
    h('label', { class: 'ah-etiqueta', for: archivo.id, text: t.imagen }), archivo,
    h('p', { class: 'ah-ayuda', text: t.imagenAyuda + ' ' + t.imagenSoltar }), errImg, previa);
  zona.addEventListener('dragover', (e) => { e.preventDefault(); zona.classList.add('ah-encima'); });
  zona.addEventListener('dragleave', () => zona.classList.remove('ah-encima'));
  zona.addEventListener('drop', (e) => {
    e.preventDefault();
    zona.classList.remove('ah-encima');
    usarArchivo(e.dataTransfer.files && e.dataTransfer.files[0]);
  });
  const desdeImagen = h('div', { class: 'ah-paletas' }, zona, resultadoImg);

  if (curadas) {
    raiz.append(
      h('div', { class: 'ah-paletas' },
        h('div', { class: 'ah-paleta-cabeza' }, h('h2', { class: 'ah-titulo-vista', text: t.titulos[claveColor] }), h('p', { text: t.curadasNota })),
        ...curadas.paletas.map((p) => bloquePaleta(p.nombre, p.colores))),
      est,
      h('div', { class: 'ah-paletas' }, h('h2', { class: 'ah-titulo-vista', text: t.propia }), generador));
  } else {
    const conImagen = modo === 'imagen';
    const chips = opcionesChip('desde', t.desde, [['color', t.desdeColor], ['imagen', t.desdeImagen]], conImagen ? 'imagen' : 'color', (v) => {
      generador.hidden = v !== 'color';
      desdeImagen.hidden = v !== 'imagen';
    });
    generador.hidden = conImagen;
    desdeImagen.hidden = !conImagen;
    raiz.append(chips, desdeImagen, generador, est);
  }
  // El estado queda pegado abajo en pantalla para que se vea al copiar.
  est.classList.add('ah-estado-fijo');
  pintarArmonias();
  return { destruir() { contenedor.textContent = ''; } };
}
