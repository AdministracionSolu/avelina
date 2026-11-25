// Diseños de arranque: letrero de se vende, se renta o se traspasa.
import { renglones } from './_piezas.js';

const campos = [
  { id: 'titular', etiqueta: 'Letrero', tipo: 'select', lista: [['Se vende', 'Se vende'], ['Se renta', 'Se renta'], ['Se traspasa', 'Se traspasa'], ['Se vende o se renta', 'Se vende o se renta'], ['Disponible', 'Disponible']] },
  { id: 'que', etiqueta: 'Qué es', ayuda: 'Casa, terreno, local, auto…' },
  { id: 'detalles', etiqueta: 'Detalles (uno por renglón)', tipo: 'area', filas: 3 },
  { id: 'precio', etiqueta: 'Precio (opcional)' },
  { id: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
  { id: 'nota', etiqueta: 'Nota', ayuda: 'Por ejemplo: trato directo con el dueño.' },
  { id: 'negocio', etiqueta: 'Inmobiliaria o nombre (opcional)' },
];

const detallesEnLinea = (k) => renglones(k.d.detalles).join('  ·  ');

export default {
  archivo: 'letrero-se-vende',
  formatos: [
    { id: 'carta-h', nombre: 'Carta horizontal', ancho: 279.4, alto: 215.9, u: 'mm' },
    { id: '90x60', nombre: '90 × 60 cm', ancho: 900, alto: 600, u: 'mm' },
    { id: 'tabloide-h', nombre: 'Tabloide horizontal', ancho: 431.8, alto: 279.4, u: 'mm' },
  ],
  campos,
  imagenes: ['logo', 'foto'],
  qr: true,
  disenos: [
    {
      id: 'clasico', nombre: 'Clásico',
      fuentes: { titulo: 'anton', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFFFFF', tinta: '#111111', acento: '#D3201F', suave: '#F2F2F2' },
      ejemplo: { titular: 'Se vende', que: 'Casa', detalles: '3 recámaras\n2 baños\nCochera para 2 autos', telefono: '442 187 3390', nota: 'Trato directo con el dueño', precio: '' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const el = [k.R(u * 3, u * 3, W - u * 6, H - u * 6, null, { borde: p.acento, grosor: u * 2 })];
        el.push(k.T('titular', { x: m, y: m + u * 2, w: W - 2 * m, tam: u * 34, fuente: 'titulo', mayus: true, alin: 'centro', color: p.acento, maxLineas: 1 }));
        el.push(k.T('que', { x: m, y: u * 47, w: W - 2 * m, tam: u * 9, fuente: 'extra', alin: 'centro', mayus: true, maxLineas: 1 }));
        el.push(k.X(detallesEnLinea(k), { x: m, y: u * 59, w: W - 2 * m, tam: u * 5, alin: 'centro', id: 'detalles', campo: 'detalles', maxLineas: 2 }));
        el.push(k.T('precio', { x: m, y: u * 68, w: W - 2 * m, tam: u * 6, fuente: 'extra', alin: 'centro', color: p.acento, maxLineas: 1 }));
        const qr = k.Q(W - m - u * 18, H - m - u * 18, u * 18);
        el.push(k.T('telefono', { x: m + (qr ? u * 20 : 0), y: H - m - u * 3, vy: 'abajo', w: W - 2 * m - (qr ? u * 40 : 0), tam: u * 20, fuente: 'titulo', alin: 'centro', maxLineas: 1 }), qr);
        el.push(k.T('nota', { x: m, y: H - m - u * 26, vy: 'abajo', w: W - 2 * m, tam: u * 4, alin: 'centro', maxLineas: 1, color: k.mezclar(p.tinta, p.fondo, 0.35) }));
        return [{ el }];
      },
    },
    {
      id: 'amarillo', nombre: 'Amarillo',
      fuentes: { titulo: 'archivo-angosta', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#FFD400', tinta: '#111111', acento: '#111111', suave: '#111111' },
      ejemplo: { titular: 'Se renta', que: 'Local comercial', detalles: '60 m²\nBaño propio\nCortina eléctrica', precio: '$9,500 al mes', telefono: '55 3018 7742', nota: '' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const banda = H * 0.3;
        const claro = k.oscuro(p.acento) ? p.fondo : '#FFFFFF';
        const el = [k.R(0, H - banda, W, banda, p.acento)];
        el.push(k.T('titular', { x: m - u, y: m, w: W - 2 * m, tam: u * 40, fuente: 'titulo', mayus: true, maxLineas: 1, interlinea: 0.9 }));
        el.push(k.T('que', { x: m, y: u * 46, w: W * 0.6, tam: u * 8, fuente: 'extra', maxLineas: 2 }));
        let y = u * 46;
        for (const d of renglones(k.d.detalles)) { el.push(k.X(d, { x: W * 0.66, y, w: W * 0.34 - m, tam: u * 4.4, id: 'detalles', campo: 'detalles', maxLineas: 1 })); y += u * 6.5; }
        el.push(k.T('precio', { x: m, y: H - banda - u * 5, vy: 'abajo', w: W * 0.6, tam: u * 6, fuente: 'extra', maxLineas: 1 }));
        const qr = k.Q(W - m - u * 20, H - banda + (banda - u * 20) / 2, u * 20, { sobre: p.acento });
        el.push(k.T('telefono', { x: m, y: H - banda / 2, vy: 'centro', w: W - 2 * m - (qr ? u * 24 : 0), tam: u * 20, fuente: 'titulo', color: claro, maxLineas: 1 }), qr);
        return [{ el }];
      },
    },
    {
      id: 'inmobiliaria', nombre: 'Inmobiliaria',
      fuentes: { titulo: 'outfit-600', texto: 'outfit-300', extra: 'outfit-600' },
      paleta: { fondo: '#16324F', tinta: '#FFFFFF', acento: '#E0B75A', suave: '#FFFFFF' },
      ejemplo: { titular: 'Se vende', que: 'Terreno de 250 m²', detalles: 'Escrituras en regla\nServicios en la calle\nA 5 minutos del centro', precio: '$1,150,000', telefono: '614 299 1834', negocio: 'Grupo Inmobiliario Norte', nota: 'Aceptamos crédito Infonavit' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 8;
        const panel = W * 0.36;
        const el = [k.R(W - panel, 0, panel, H, p.suave)];
        if (k.foto) el.push(k.I('foto', W - panel, 0, panel, H * 0.5));
        const bloque = [
          k.T('titular', { x: m, w: W - panel - 2 * m, tam: u * 20, fuente: 'titulo', maxLineas: 1, color: p.acento, sep: u * 6 }),
          k.T('que', { x: m, w: W - panel - 2 * m, tam: u * 7, fuente: 'extra', maxLineas: 2, sep: u * 6 }),
        ];
        let y = k.flujo(m, bloque);
        el.push(...bloque);
        for (const d of renglones(k.d.detalles)) { el.push(k.R(m, y + u * 1.2, u * 1.6, u * 1.6, p.acento, { id: 'detalles' }), k.X(d, { x: m + u * 4, y, w: W - panel - 2 * m - u * 4, tam: u * 4, id: 'detalles', campo: 'detalles', maxLineas: 1 })); y += u * 6.5; }
        el.push(k.T('nota', { x: m, y: H - m, vy: 'abajo', w: W - panel - 2 * m, tam: u * 3.4, maxLineas: 2, color: k.mezclar(p.tinta, p.fondo, 0.3) }));
        const tx = W - panel + u * 6, tw = panel - u * 12, oscuro = k.oscuro(p.suave) ? '#FFFFFF' : p.fondo;
        el.push(k.logo ? k.I('logo', tx, k.foto ? H * 0.5 + u * 5 : m, tw, u * 14, { ax: 0 }) : k.T('negocio', { x: tx, y: k.foto ? H * 0.5 + u * 6 : m + u * 2, w: tw, tam: u * 4, fuente: 'extra', color: oscuro, maxLineas: 2 }));
        el.push(k.T('precio', { x: tx, y: H * 0.68, vy: 'abajo', w: tw, tam: u * 8, fuente: 'titulo', color: oscuro, maxLineas: 1 }));
        const qr = k.Q(tx, H * 0.7, u * 14, { sobre: p.suave });
        el.push(k.T('telefono', { x: tx, y: H - m, vy: 'abajo', w: tw, tam: u * 8, fuente: 'titulo', color: oscuro, maxLineas: 1 }), qr);
        return [{ el }];
      },
    },
    {
      id: 'auto', nombre: 'Auto',
      fuentes: { titulo: 'bigshoulders', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#F4F4F2', tinta: '#141414', acento: '#0B6E4F', suave: '#141414' },
      ejemplo: { titular: 'Se vende', que: 'Nissan Versa 2019', detalles: 'Estándar · 78,000 km\nFactura original\nTenencias pagadas', precio: '$168,000', telefono: '477 330 2156', nota: 'Acepto auto a cuenta' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 7;
        const claro = k.oscuro(p.suave) ? '#FFFFFF' : '#141414';
        const el = [k.R(0, 0, W, u * 30, p.suave)];
        el.push(k.T('titular', { x: m, y: u * 15, vy: 'centro', w: W * 0.5, tam: u * 18, fuente: 'titulo', mayus: true, color: claro, maxLineas: 1 }));
        el.push(k.T('precio', { x: W * 0.45, y: u * 15, vy: 'centro', w: W * 0.55 - m, tam: u * 14, fuente: 'titulo', alin: 'der', color: p.acento === p.suave ? claro : (k.oscuro(p.suave) ? '#FFFFFF' : p.acento), maxLineas: 1 }));
        el.push(k.T('que', { x: m, y: u * 40, w: W - 2 * m, tam: u * 12, fuente: 'titulo', mayus: true, maxLineas: 1 }));
        const bloque = [
          k.X(renglones(k.d.detalles).join('\n'), { x: m, w: W * 0.55, tam: u * 4.4, id: 'detalles', campo: 'detalles', maxLineas: 4, interlinea: 1.35, sep: u * 3 }),
          k.T('nota', { x: m, w: W * 0.55, tam: u * 4, fuente: 'extra', color: p.acento, maxLineas: 1 }),
        ];
        k.flujo(u * 55, bloque);
        el.push(...bloque);
        if (k.foto) el.push(k.I('foto', W * 0.6, u * 55, W * 0.4 - m, H - u * 55 - m - u * 24));
        const qr = k.Q(W - m - u * 18, H - m - u * 18, u * 18);
        el.push(k.T('telefono', { x: m, y: H - m, vy: 'abajo', w: W - 2 * m - (qr ? u * 22 : 0), tam: u * 16, fuente: 'titulo', maxLineas: 1 }), qr);
        return [{ el }];
      },
    },
    {
      id: 'minimo', nombre: 'Blanco y negro',
      fuentes: { titulo: 'fraunces', texto: 'archivo-400', extra: 'archivo-700' },
      paleta: { fondo: '#111111', tinta: '#F5F2EC', acento: '#F5F2EC', suave: '#2A2A2A' },
      ejemplo: { titular: 'Se traspasa', que: 'Estética equipada', detalles: '4 sillas de corte\n2 lavacabezas\nClientela de 6 años', precio: '', telefono: '33 1477 9020', nota: 'Pregunta por Rocío' },
      dibujar(k) {
        const { W, H, u, p } = k, m = u * 9;
        const el = [];
        el.push(k.T('titular', { x: m, y: m, w: W - 2 * m, tam: u * 24, fuente: 'titulo', maxLineas: 1 }));
        el.push(k.L(m, u * 40, W - m, u * 40, k.mezclar(p.tinta, p.fondo, 0.6), u * 0.3));
        el.push(k.T('que', { x: m, y: u * 47, w: W * 0.55, tam: u * 7, fuente: 'extra', maxLineas: 2 }));
        el.push(k.X(renglones(k.d.detalles).join('\n'), { x: W * 0.6, y: u * 47, w: W * 0.4 - m, tam: u * 4.2, id: 'detalles', campo: 'detalles', maxLineas: 5, interlinea: 1.4 }));
        el.push(k.T('precio', { x: m, y: u * 62, w: W * 0.55, tam: u * 6, maxLineas: 1, color: p.acento }));
        const qr = k.Q(W - m - u * 16, H - m - u * 16, u * 16, { sobre: p.fondo });
        el.push(k.T('nota', { x: m, y: H - m - u * 20, vy: 'abajo', w: W - 2 * m, tam: u * 4, maxLineas: 1, color: k.mezclar(p.tinta, p.fondo, 0.4) }));
        el.push(k.T('telefono', { x: m, y: H - m, vy: 'abajo', w: W - 2 * m - (qr ? u * 20 : 0), tam: u * 14, fuente: 'titulo', maxLineas: 1 }), qr);
        return [{ el }];
      },
    },
  ],
};
