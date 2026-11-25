// Iconos de línea propios de Avelina para el editor (caja de 100 × 100, se dibujan con trazo redondo).
// Se usan para datos de contacto, horario y portadas de historias destacadas.
import { circD, arcoD, rectD, poliD, elipseD } from '../_comun-diseno.js';

const P = Math.PI;
export const ICONOS = {
  telefono: 'M30 14L42 14L48 32L39 39C44 50 50 56 61 61L68 52L86 58L86 70C86 78 80 86 70 86C42 84 16 58 14 30C14 20 22 14 30 14Z',
  whatsapp: arcoD(50, 48, 36, 0.62 * P, 2.62 * P) + 'L18 86L32 79' + 'M38 34L44 33L48 42L44 47C47 53 51 57 57 60L62 56L71 60L70 66C68 70 64 71 60 70C48 67 36 55 33 43C32 39 34 35 38 34Z',
  ubicacion: 'M50 88C50 88 22 60 22 40C22 24 35 12 50 12C65 12 78 24 78 40C78 60 50 88 50 88Z' + circD(50, 40, 10),
  correo: rectD(12, 24, 76, 52, 6) + 'M14 28L50 54L86 28',
  web: circD(50, 50, 36) + 'M14 50L86 50' + elipseD(34, 14, 32, 72) + 'M20 30L80 30M20 70L80 70',
  reloj: circD(50, 50, 36) + 'M50 28L50 50L64 60',
  calendario: rectD(14, 20, 72, 66, 6) + 'M14 38L86 38M32 12L32 26M68 12L68 26M30 54L36 54M47 54L53 54M64 54L70 54M30 70L36 70M47 70L53 70',
  instagram: rectD(16, 16, 68, 68, 18) + circD(50, 50, 16) + circD(69, 31, 1.5),
  facebook: 'M58 86L58 54L70 54L72 40L58 40L58 32C58 28 60 26 64 26L72 26L72 14L60 14C48 14 44 22 44 32L44 40L32 40L32 54L44 54L44 86',
  menu: circD(50, 52, 21) + circD(50, 52, 12) + 'M13 16L13 34C13 39 19 41 19 46L19 86M25 16L25 34C25 39 19 41 19 46M19 16L19 36' + 'M83 86L83 16C77 22 75 34 75 46L83 50',
  precios: 'M50 12L86 12L86 48L48 86L14 52Z' + circD(70, 28, 5),
  estrella: poliD(Array.from({ length: 10 }, (_, i) => { const a = -P / 2 + (i * P) / 5; const r = i % 2 ? 16 : 38; return [50 + r * Math.cos(a), 54 + r * Math.sin(a)]; })),
  promo: 'M24 76L76 24' + circD(30, 30, 10) + circD(70, 70, 10),
  envio: rectD(10, 30, 50, 38, 3) + 'M60 42L76 42L88 56L88 68L60 68' + circD(28, 72, 8) + circD(72, 72, 8),
  camara: rectD(12, 28, 76, 54, 8) + 'M34 28L40 18L60 18L66 28' + circD(50, 55, 14),
  corazon: 'M50 82C50 82 14 60 14 36C14 24 23 16 33 16C41 16 47 21 50 28C53 21 59 16 67 16C77 16 86 24 86 36C86 60 50 82 50 82Z',
  pregunta: circD(50, 50, 36) + 'M38 40C38 32 44 28 50 28C57 28 62 33 62 39C62 47 50 48 50 58M50 70L50 71',
  bolsa: 'M20 34L80 34L76 86L24 86Z' + 'M36 44L36 28C36 20 42 14 50 14C58 14 64 20 64 28L64 44',
  tijeras: circD(28, 72, 12) + circD(72, 72, 12) + 'M36 63L72 14M64 63L28 14',
  diente: 'M30 16C20 16 14 26 16 38C18 50 24 56 26 70C28 84 34 88 38 82C42 76 42 62 50 62C58 62 58 76 62 82C66 88 72 84 74 70C76 56 82 50 84 38C86 26 80 16 70 16C62 16 58 22 50 22C42 22 38 16 30 16Z',
  huella: elipseD(32, 48, 36, 32) + elipseD(16, 30, 14, 18) + elipseD(34, 14, 14, 20) + elipseD(52, 14, 14, 20) + elipseD(70, 30, 14, 18),
  taza: 'M18 34L70 34L66 76C65 82 60 86 54 86L34 86C28 86 23 82 22 76Z' + 'M70 44C80 44 86 48 86 56C86 64 80 68 68 68' + 'M34 12C30 18 38 20 34 26M50 12C46 18 54 20 50 26',
  casa: 'M14 46L50 16L86 46M24 38L24 84L76 84L76 38' + 'M42 84L42 60L58 60L58 84',
  herramienta: 'M62 14C52 14 44 22 46 34L16 64C12 68 12 76 16 80L20 84C24 88 32 88 36 84L66 54C78 56 86 48 86 38L74 46L62 42L58 30L66 18C65 15 64 14 62 14Z',
  regalo: rectD(14, 34, 72, 16) + rectD(20, 50, 60, 36) + 'M50 34L50 86' + 'M50 34C44 22 30 16 28 24C26 32 40 34 50 34C60 34 74 32 72 24C70 16 56 22 50 34',
  pesa: 'M30 50L70 50' + rectD(18, 32, 12, 36, 3) + rectD(70, 32, 12, 36, 3) + 'M10 42L10 58M90 42L90 58',
  flor: circD(50, 42, 8) + circD(50, 22, 12) + circD(69, 36, 12) + circD(62, 58, 12) + circD(38, 58, 12) + circD(31, 36, 12) + 'M50 70L50 90',
  mapa: 'M12 24L36 14L64 26L88 16L88 76L64 86L36 74L12 84Z' + 'M36 14L36 74M64 26L64 86',
  chat: 'M16 22C16 18 18 16 22 16L78 16C82 16 84 18 84 22L84 62C84 66 82 68 78 68L40 68L24 84L24 68L22 68C18 68 16 66 16 62Z' + 'M32 36L68 36M32 50L56 50',
};

// Nombres visibles para las listas.
export const NOMBRES_ICONO = {
  menu: 'Menú', precios: 'Precios', reloj: 'Horario', ubicacion: 'Ubicación', estrella: 'Opiniones',
  promo: 'Promociones', envio: 'Envíos', telefono: 'Teléfono', whatsapp: 'WhatsApp', camara: 'Trabajos',
  corazon: 'Favoritos', pregunta: 'Preguntas', bolsa: 'Tienda', calendario: 'Citas', tijeras: 'Cortes',
  diente: 'Consultorio', huella: 'Mascotas', taza: 'Café', casa: 'Inmuebles', herramienta: 'Servicios',
  regalo: 'Regalos', pesa: 'Entrenos', flor: 'Flores', mapa: 'Cómo llegar', chat: 'Contacto',
  correo: 'Correo', web: 'Página', instagram: 'Instagram', facebook: 'Facebook',
};
