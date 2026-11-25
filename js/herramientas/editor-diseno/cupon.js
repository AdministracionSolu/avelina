// Diseños de arranque: cupón de descuento (impreso con hoja de corte o para redes).
import { enLinea } from './_piezas.js';

const campos = [
  { id: 'oferta', etiqueta: 'Descuento o regalo', ayuda: '20%, 2×1, $100…' },
  { id: 'descripcion', etiqueta: 'En qué aplica' },
  { id: 'condiciones', etiqueta: 'Condiciones', tipo: 'area', filas: 2 },
  { id: 'vigencia', etiqueta: 'Vigencia' },
  { id: 'codigo', etiqueta: 'Código o folio (opcional)' },
  { id: 'negocio', etiqueta: 'Nombre del negocio' },
  { id: 'whatsapp', etiqueta: 'WhatsApp o teléfono', tipo: 'tel' },
  { id: 'direccion', etiqueta: 'Dirección' },
];

export default {
  archivo: 'cupon',
  formatos: [
    { id: '16x7', nombre: '16 × 7 cm', ancho: 160, alto: 70, u: 'mm' },
    { id: '9x5', nombre: '9 × 5 cm', ancho: 90, alto: 50, u: 'mm' },
    { id: 'redes', nombre: 'Para redes 1080 × 1080', ancho: 1080, alto: 1080, u: 'px' },
  ],
  campos,
  campoNombre: 'negocio',
  imagenes: ['logo'],
  qr: false,
  hoja: true,
  // Folio consecutivo opcional: va en el campo «codigo» de cada cupón (No. 0001, No. 0002…).
  folio: { campo: 'codigo', cifras: 4, prefijo: 'No. ' },
  disenos: [
    {
      id: 'talon', nombre: 'Con talón',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFF7EC', tinta: '#1E1B18', acento: '#E4572E', suave: '#E4572E' },
      ejemplo: { oferta: '20%', descripcion: 'de descuento en tu siguiente corte', condiciones: 'Válido de lunes a jueves. No acumulable con otras promociones.', vigencia: 'Vence el 31 de diciembre', codigo: 'BARBA20', negocio: 'Barbería El Patrón', whatsapp: '81 2290 1874' },
      dibujar(k) {
        const { W, H, u, p } = k;
        const cuadrado = !k.horizontal;
        const claro = k.oscuro(p.suave) ? '#FFFFFF' : '#1E1B18';
        if (cuadrado) {
          const m = u * 9;
          const corte = H * 0.58;
          const el = [k.R(0, 0, W, corte, p.suave),
            k.L(m, corte, W - m, corte, p.fondo, u * 0.6, { guiones: [u * 2, u * 1.6] })];
          el.push(k.T('negocio', { x: m, y: m, w: W - 2 * m, tam: u * 4, fuente: 'extra', mayus: true, espaciado: 160, color: claro, maxLineas: 1 }));
          el.push(k.T('oferta', { x: m - u, y: corte - u * 8, vy: 'abajo', w: W - 2 * m, tam: u * 34, fuente: 'titulo', color: claro, maxLineas: 1 }));
          el.push(k.T('descripcion', { x: m, y: corte + u * 7, w: W - 2 * m, tam: u * 6, fuente: 'extra', maxLineas: 2 }));
          el.push(k.T('condiciones', { x: m, y: corte + u * 22, w: W * 0.62, tam: u * 3.4, maxLineas: 3, color: k.mezclar(p.tinta, p.fondo, 0.35) }));
          el.push(k.T('vigencia', { x: m, y: H - m, vy: 'abajo', w: W * 0.6, tam: u * 3.8, fuente: 'extra', color: p.acento, maxLineas: 1 }));
          el.push(k.T('codigo', { x: W * 0.6, y: H - m, vy: 'abajo', w: W * 0.4 - m, tam: u * 6, fuente: 'titulo', alin: 'der', maxLineas: 1 }));
          return [{ el }];
        }
        const talon = W * 0.3, m = u * 7;
        const el = [k.R(W - talon, 0, talon, H, p.suave),
          k.L(W - talon, u * 4, W - talon, H - u * 4, p.fondo, u * 0.8, { guiones: [u * 2.4, u * 2] })];
        el.push(k.T('negocio', { x: m, y: m, w: W - talon - 2 * m, tam: u * 5, fuente: 'extra', mayus: true, espaciado: 120, color: p.acento, maxLineas: 1 }));
        el.push(k.T('descripcion', { x: m, y: m + u * 12, w: W - talon - 2 * m, tam: u * 9, fuente: 'extra', maxLineas: 2, interlinea: 1.08 }));
        el.push(k.T('condiciones', { x: m, y: H - m - u * 9, vy: 'abajo', w: W - talon - 2 * m, tam: u * 4, maxLineas: 2, color: k.mezclar(p.tinta, p.fondo, 0.35) }));
        el.push(enLinea(k, ['vigencia', 'whatsapp'], { x: m, y: H - m, vy: 'abajo', w: W - talon - 2 * m, tam: u * 4.2, fuente: 'extra', maxLineas: 1 }));
        el.push(k.T('oferta', { x: W - talon + u * 4, y: H * 0.46, vy: 'centro', w: talon - u * 8, tam: u * 36, fuente: 'titulo', alin: 'centro', color: claro, maxLineas: 1 }));
        el.push(k.T('codigo', { x: W - talon + u * 4, y: H - m, vy: 'abajo', w: talon - u * 8, tam: u * 5, fuente: 'extra', alin: 'centro', color: claro, maxLineas: 1, espaciado: 80 }));
        return [{ el }];
      },
    },
    {
      id: 'marco', nombre: 'Marco punteado',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFFFFF', tinta: '#2D2A26', acento: '#2F6E5A', suave: '#EAF3EF' },
      ejemplo: { oferta: '2 × 1', descripcion: 'en pasteles individuales', condiciones: 'Presenta este cupón en caja. Uno por persona.', vigencia: 'Válido hasta el 15 de enero', negocio: 'Pastelería Bonaterra', whatsapp: '222 316 4088', direccion: 'Av. Juárez 2915, Puebla' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 10;
        const el = [k.R(0, 0, W, H, p.suave), k.R(u * 4, u * 4, W - u * 8, H - u * 8, p.fondo, { borde: p.acento, grosor: u * 0.6, guiones: [u * 2.2, u * 1.6], radio: u * 3 })];
        const cx = W / 2, w = W - 2 * m;
        el.push(k.logo ? k.I('logo', cx - u * 14, m - u * 2, u * 28, u * 12) : k.T('negocio', { x: m, y: m, w, tam: u * 4.4, fuente: 'extra', alin: 'centro', mayus: true, espaciado: 200, color: p.acento, maxLineas: 1 }));
        el.push(k.T('oferta', { x: m, y: H * 0.42, vy: 'centro', w, tam: u * (k.horizontal ? 26 : 28), fuente: 'titulo', alin: 'centro', maxLineas: 1 }));
        el.push(k.T('descripcion', { x: m, y: H * 0.42 + u * (k.horizontal ? 15 : 18), w, tam: u * 6, alin: 'centro', maxLineas: 2 }));
        el.push(k.T('condiciones', { x: m, y: H - m - u * 8, vy: 'abajo', w, tam: u * 3.4, alin: 'centro', maxLineas: 2, color: k.mezclar(p.tinta, p.fondo, 0.4) }));
        el.push(enLinea(k, ['vigencia', 'whatsapp', 'direccion'], { x: m, y: H - m, vy: 'abajo', w, tam: u * 3.6, fuente: 'extra', alin: 'centro', color: p.acento, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'bloque', nombre: 'Número grande',
      fuentes: { titulo: 'bigshoulders', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#101820', tinta: '#F2F2F2', acento: '#FEE715', suave: '#1B2631' },
      ejemplo: { oferta: '$100', descripcion: 'menos en tu primer servicio de lavado', condiciones: 'En compras desde $350. Sólo autos y camionetas.', vigencia: 'Hasta el 30 de noviembre', codigo: 'LAVA100', negocio: 'Autolavado Brillo Total', whatsapp: '33 1902 7731' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const el = [];
        const iz = k.horizontal ? W * 0.48 : W - 2 * m;
        el.push(k.T('oferta', { x: m - u, y: k.horizontal ? H * 0.5 : m, vy: k.horizontal ? 'centro' : 'arriba', w: iz, tam: u * (k.horizontal ? 60 : 44), fuente: 'titulo', color: p.acento, maxLineas: 1 }));
        const x = k.horizontal ? W * 0.52 : m, w = k.horizontal ? W * 0.48 - m : W - 2 * m;
        const bloque = [
          k.T('negocio', { x, w, tam: u * 4, fuente: 'extra', mayus: true, espaciado: 120, color: p.acento, maxLineas: 1, sep: u * 4 }),
          k.T('descripcion', { x, w, tam: u * 7, fuente: 'extra', maxLineas: 3, interlinea: 1.08, sep: u * 4 }),
          k.T('condiciones', { x, w, tam: u * 3.6, maxLineas: 3, color: k.mezclar(p.tinta, p.fondo, 0.35), sep: u * 4 }),
        ];
        k.flujo(k.horizontal ? m : H * 0.45, bloque);
        el.push(...bloque);
        el.push(k.T('vigencia', { x, y: H - m, vy: 'abajo', w: w * 0.6, tam: u * 3.8, fuente: 'extra', maxLineas: 2 }));
        el.push(k.T('codigo', { x: x + w * 0.5, y: H - m, vy: 'abajo', w: w * 0.5, tam: u * 6, fuente: 'titulo', alin: 'der', color: p.acento, maxLineas: 1 }));
        return [{ el }];
      },
    },
    {
      id: 'suave', nombre: 'Delicado',
      fuentes: { titulo: 'instrument-it', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#F6E9E4', tinta: '#4B2E2B', acento: '#B76E79', suave: '#EFD9D2' },
      ejemplo: { oferta: 'Gelish de regalo', descripcion: 'en tu primer set de uñas acrílicas', condiciones: 'Agenda tu cita por WhatsApp y menciona este cupón.', vigencia: 'Vigente todo diciembre', negocio: 'Studio Uñas Mía', whatsapp: '55 6120 3398' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 9;
        const el = [k.E(k.horizontal ? W - H * 0.9 : W * 0.15, k.horizontal ? -H * 0.25 : -W * 0.25, k.horizontal ? H * 1.2 : W * 0.95, k.horizontal ? H * 1.2 : W * 0.95, p.suave)];
        const w = k.horizontal ? W * 0.62 : W - 2 * m;
        const bloque = [
          k.T('negocio', { x: m, w, tam: u * 4, fuente: 'extra', mayus: true, espaciado: 220, color: p.acento, maxLineas: 1, sep: u * 5 }),
          k.T('oferta', { x: m, w, tam: u * (k.horizontal ? 15 : 16), fuente: 'titulo', maxLineas: 2, interlinea: 1, sep: u * 4 }),
          k.T('descripcion', { x: m, w, tam: u * 5, maxLineas: 2, sep: u * 4 }),
        ];
        k.flujo(m, bloque);
        el.push(...bloque);
        el.push(k.T('condiciones', { x: m, y: H - m - u * 8, vy: 'abajo', w, tam: u * 3.4, maxLineas: 2 }));
        el.push(enLinea(k, ['vigencia', 'whatsapp'], { x: m, y: H - m, vy: 'abajo', w, tam: u * 3.6, fuente: 'extra', color: p.acento, maxLineas: 1 }));
        el.push(k.logo ? k.I('logo', W - m - u * 24, H - m - u * 24, u * 24, u * 24) : null);
        return [{ el }];
      },
    },
    {
      id: 'boleto', nombre: 'Boleto',
      fuentes: { titulo: 'alfa', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F3E9D2', tinta: '#2B2A28', acento: '#C1121F', suave: '#2B2A28' },
      ejemplo: { oferta: 'Refresco gratis', descripcion: 'en la compra de una orden de 5 tacos', condiciones: 'Válido en sucursal. Presenta el cupón al ordenar.', vigencia: 'Hasta el 20 de diciembre', codigo: 'Nº 0457', negocio: 'Taquería Los Compadres', whatsapp: '461 128 7720' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 9;
        const r = u * 6;
        const el = [k.R(0, 0, W, H, p.suave)];
        el.push(k.R(u * 3, u * 3, W - u * 6, H - u * 6, p.fondo, { radio: u * 2 }));
        el.push(k.E(-r, H / 2 - r, 2 * r, 2 * r, p.suave), k.E(W - r, H / 2 - r, 2 * r, 2 * r, p.suave));
        const w = W - 2 * m;
        el.push(k.T('negocio', { x: m, y: m, w: w * 0.7, tam: u * 4, fuente: 'extra', mayus: true, espaciado: 100, maxLineas: 1 }));
        el.push(k.T('codigo', { x: m + w * 0.6, y: m, w: w * 0.4, tam: u * 4, fuente: 'extra', alin: 'der', color: p.acento, maxLineas: 1 }));
        el.push(k.L(m, m + u * 7, W - m, m + u * 7, p.tinta, u * 0.3));
        el.push(k.T('oferta', { x: m, y: H * 0.47, vy: 'centro', w, tam: u * (k.horizontal ? 15 : 14), fuente: 'titulo', alin: 'centro', color: p.acento, maxLineas: 2, interlinea: 1 }));
        el.push(k.T('descripcion', { x: m, y: H * 0.47 + u * (k.horizontal ? 13 : 18), w, tam: u * 4.6, alin: 'centro', maxLineas: 2 }));
        el.push(k.L(m, H - m - u * 9, W - m, H - m - u * 9, p.tinta, u * 0.3));
        el.push(enLinea(k, ['vigencia', 'condiciones'], { x: m, y: H - m, vy: 'abajo', w, tam: u * 3.3, alin: 'centro', maxLineas: 2 }));
        return [{ el }];
      },
    },
  ],
};
