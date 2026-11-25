// Diseños del motor «menu». Se cargan bajo demanda. Sólo datos: menu.js los dibuja.
// Fuentes: h (Helvetica), hb, hi, t (Times), tb, ti, tbi.
// cabecera: centro | izquierda | banda · seccion: lineas | banda | mayus | subrayado
// precio: puntos | derecha | junto · foto: cuadro | circulo

export const DISENOS = [
  {
    id: 'clasico', nombre: 'Clásico',
    fondo: '#FBF7EF', tinta: '#2A2420', suave: '#8A7F74', acento: '#7A2E2A',
    fTitulo: 'tb', fSub: 'ti', fSeccion: 'tb', fPlato: 'tb', fDesc: 'ti', fPrecio: 'tb',
    cabecera: 'centro', seccion: 'lineas', precio: 'puntos', foto: 'circulo', marco: 'doble', columnas: 2,
  },
  {
    id: 'pizarron', nombre: 'Pizarrón',
    fondo: '#1F2523', tinta: '#F1EDE4', suave: '#A9B0AA', acento: '#E8C468',
    fTitulo: 'hb', fSub: 'h', fSeccion: 'hb', fPlato: 'hb', fDesc: 'h', fPrecio: 'hb',
    cabecera: 'centro', seccion: 'mayus', precio: 'derecha', foto: 'cuadro', marco: 'simple', columnas: 2,
  },
  {
    id: 'moderno', nombre: 'Moderno',
    fondo: '#FFFFFF', tinta: '#161616', suave: '#6E6E6E', acento: '#D2462E',
    fTitulo: 'hb', fSub: 'h', fSeccion: 'hb', fPlato: 'hb', fDesc: 'h', fPrecio: 'hb',
    cabecera: 'banda', seccion: 'banda', precio: 'derecha', foto: 'cuadro', marco: '', columnas: 2,
  },
  {
    id: 'cafeteria', nombre: 'Cafetería',
    fondo: '#F4ECE1', tinta: '#3B2A20', suave: '#8C7462', acento: '#B5562F',
    fTitulo: 'tbi', fSub: 'h', fSeccion: 'tbi', fPlato: 'hb', fDesc: 'h', fPrecio: 'hb',
    cabecera: 'centro', seccion: 'subrayado', precio: 'junto', foto: 'circulo', marco: '', columnas: 2,
  },
  {
    id: 'taqueria', nombre: 'Taquería',
    fondo: '#FFFFFF', tinta: '#1C1C1C', suave: '#666666', acento: '#B8322A', acento2: '#1E7B4F',
    fTitulo: 'hb', fSub: 'hb', fSeccion: 'hb', fPlato: 'hb', fDesc: 'h', fPrecio: 'hb',
    cabecera: 'izquierda', seccion: 'mayus', precio: 'puntos', foto: 'cuadro', marco: 'franjas', columnas: 2,
  },
  {
    id: 'sobrio', nombre: 'Sobrio',
    fondo: '#FFFFFF', tinta: '#111111', suave: '#777777', acento: '#111111',
    fTitulo: 't', fSub: 'h', fSeccion: 'h', fPlato: 't', fDesc: 'h', fPrecio: 't',
    cabecera: 'centro', seccion: 'lineas', precio: 'derecha', foto: 'cuadro', marco: '', columnas: 2,
  },
];
