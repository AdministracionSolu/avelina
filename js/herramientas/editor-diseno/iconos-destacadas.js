// Diseños de arranque: portadas para historias destacadas de Instagram.
// Cada icono es una cara; se bajan todas juntas en ZIP. Instagram recorta un círculo del centro.
import { NOMBRES_ICONO } from './_iconos.js';
import { renglones } from './_piezas.js';

const opcionesIcono = [['', 'Ninguno'], ...Object.entries(NOMBRES_ICONO).sort((a, b) => a[1].localeCompare(b[1], 'es'))];
const N = 8;
const campos = [
  ...Array.from({ length: N }, (_, i) => ({ id: 'icono' + (i + 1), etiqueta: 'Icono ' + (i + 1), tipo: 'select', lista: opcionesIcono })),
  { id: 'nombres', etiqueta: 'Nombres (uno por renglón, en el mismo orden)', tipo: 'area', filas: 4, ayuda: 'Sólo los diseños con nombre los muestran.' },
];
const base = { icono1: 'menu', icono2: 'precios', icono3: 'reloj', icono4: 'ubicacion', icono5: 'estrella', icono6: 'promo', icono7: '', icono8: '' };

// Lista de [icono, nombre] elegidos.
function elegidos(k) {
  const nombres = renglones(k.d.nombres);
  const out = [];
  for (let i = 1; i <= N; i++) { const ic = k.d['icono' + i]; if (ic) out.push([ic, nombres[out.length] || NOMBRES_ICONO[ic] || '']); }
  return out.length ? out : [['estrella', 'Opiniones']];
}

const caras = (pintar) => (k) => elegidos(k).map(([ic, nombre]) => ({ nombre, el: pintar(k, ic, nombre), fondo: undefined }));

export default {
  archivo: 'portadas-destacadas',
  formatos: [
    { id: 'historia', nombre: 'Historia 1080 × 1920', ancho: 1080, alto: 1920, u: 'px', guias: (W, H) => [{ x: W / 2 - 400, y: H / 2 - 400, w: 800, h: 800 }] },
    { id: 'cuadrado', nombre: 'Cuadrada 1080', ancho: 1080, alto: 1080, u: 'px' },
  ],
  campos,
  campoNombre: null,
  imagenes: [],
  qr: false,
  disenos: [
    {
      id: 'linea', nombre: 'Línea',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#EFE6DD', tinta: '#5B4636', acento: '#5B4636', suave: '#E3D5C6' },
      ejemplo: Object.assign({ nombres: '' }, base),
      dibujar: caras((k, ic) => { const s = 300; return [k.Ico(ic, (k.W - s) / 2, (k.H - s) / 2, s, k.p.acento, { grosor: 14 })]; }),
    },
    {
      id: 'circulo', nombre: 'Círculo lleno',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#FFFFFF', tinta: '#FFFFFF', acento: '#D8A39D', suave: '#F6E7E4' },
      ejemplo: Object.assign({}, base, { icono1: 'calendario', icono2: 'camara', icono3: 'precios', icono4: 'estrella', icono5: 'ubicacion', icono6: 'chat' }),
      dibujar: caras((k, ic) => {
        const d = 640, s = 280, cx = k.W / 2, cy = k.H / 2;
        return [k.R(0, 0, k.W, k.H, k.p.suave), k.E(cx - d / 2, cy - d / 2, d, d, k.p.acento), k.Ico(ic, cx - s / 2, cy - s / 2, s, k.p.tinta, { grosor: 15 })];
      }),
    },
    {
      id: 'anillo', nombre: 'Anillo',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#111111', tinta: '#F2F2F0', acento: '#C9A86A', suave: '#111111' },
      ejemplo: Object.assign({}, base, { icono1: 'tijeras', icono2: 'precios', icono3: 'calendario', icono4: 'camara', icono5: 'estrella', icono6: 'ubicacion' }),
      dibujar: caras((k, ic) => {
        const d = 660, s = 270, cx = k.W / 2, cy = k.H / 2;
        return [k.E(cx - d / 2, cy - d / 2, d, d, null, { borde: k.p.acento, grosor: 10 }), k.Ico(ic, cx - s / 2, cy - s / 2, s, k.p.tinta, { grosor: 13 })];
      }),
    },
    {
      id: 'nombre', nombre: 'Con nombre',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#2F4F3E', tinta: '#F4EFE6', acento: '#F4EFE6', suave: '#2F4F3E' },
      ejemplo: Object.assign({}, base, { nombres: 'Menú\nPrecios\nHorario\nCómo llegar\nOpiniones\nPromos' }),
      dibujar: caras((k, ic, nombre) => {
        const s = 230, cx = k.W / 2, cy = k.H / 2;
        return [k.Ico(ic, cx - s / 2, cy - s / 2 - 70, s, k.p.acento, { grosor: 12 }),
          k.X(nombre, { x: cx - 380, y: cy + 140, w: 760, tam: 74, fuente: 'titulo', alin: 'centro', color: k.p.tinta, maxLineas: 1, id: 'nombres', campo: 'nombres' })];
      }),
    },
    {
      id: 'letra', nombre: 'Inicial',
      fuentes: { titulo: 'instrument-it', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F3E6E8', tinta: '#7A3E48', acento: '#7A3E48', suave: '#F3E6E8' },
      ejemplo: Object.assign({}, base, { nombres: 'Menú\nPrecios\nHorario\nUbicación\nOpiniones\nPromos' }),
      dibujar: caras((k, ic, nombre) => {
        const cx = k.W / 2, cy = k.H / 2;
        const letra = (nombre || NOMBRES_ICONO[ic] || '?').trim().charAt(0).toUpperCase();
        return [k.E(cx - 330, cy - 330, 660, 660, null, { borde: k.p.acento, grosor: 5 }),
          k.X(letra, { x: cx, y: cy, vy: 'centro', alin: 'centro', tam: 420, fuente: 'titulo', color: k.p.tinta, id: 'nombres', campo: 'nombres' })];
      }),
    },
  ],
};
