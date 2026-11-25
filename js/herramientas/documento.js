// Herramienta «documento» de Avelina: formatos de negocio que se llenan sobre la hoja.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// modos: recibo, recibo-renta, recibo-honorarios, nota-remision, nota-venta, cotizacion (por defecto),
//        orden-compra, orden-servicio, lista-precios
// Sale en PDF carta vectorial y en PNG. Nada sale del equipo: lo guardado vive en localStorage.

import {
  h, textos as unirTextos, avisar, descargar, estado, lienzoABlob, PIE, opcionesChip, boton, asegurarEstilos,
  nombreArchivo, selectorColor, leerImagen, contraste,
} from './_comun.js';
import { pdf, lienzoDeVarias, imagen, encajar, partir, ancho, recortar, CARTA } from './_pdf.js';
import { importeEnLetra } from './documento-letra.js';

export { importeEnLetra };
const ID = 'documento';

const PAGO = ['Efectivo', 'Transferencia', 'Tarjeta de débito', 'Tarjeta de crédito', 'Depósito', 'Cheque'];

// Cada modo: tipo de cuerpo, quién recibe, campos propios y firmas.
export const MODOS = {
  recibo: {
    titulo: 'Recibo de pago', tipo: 'monto', quien: 'Recibí de', quienPh: 'Nombre de quien paga',
    extras: [['concepto', 'Por concepto de', 'area', 'Ejemplo: anticipo del pedido 0142'], ['formaPago', 'Forma de pago', 'pago']],
    firmas: ['Recibí'],
  },
  'recibo-renta': {
    titulo: 'Recibo de renta', tipo: 'monto', quien: 'Recibí de', quienPh: 'Nombre de quien renta', negocioPh: 'Nombre del arrendador',
    extras: [['inmueble', 'Inmueble', 'area', 'Calle, número, colonia y ciudad'], ['periodo', 'Mes que paga', 'texto', 'Noviembre de 2026'],
      ['formaPago', 'Forma de pago', 'pago']],
    firmas: ['Arrendador'],
  },
  'recibo-honorarios': {
    titulo: 'Recibo de honorarios', tipo: 'partidas', sinCant: true, iva: 'aparte', ret: true, quien: 'Cliente',
    extras: [['formaPago', 'Forma de pago', 'pago']], firmas: ['Recibí'],
  },
  'nota-remision': {
    titulo: 'Nota de remisión', tipo: 'partidas', iva: 'sin', quien: 'Cliente',
    extras: [['entregarEn', 'Entregar en', 'texto', 'Domicilio de entrega']], firmas: ['Entregó', 'Recibí de conformidad'],
  },
  'nota-venta': {
    titulo: 'Nota de venta', tipo: 'partidas', iva: 'incluido', quien: 'Cliente',
    extras: [['formaPago', 'Forma de pago', 'pago']], firmas: ['Atendió', 'Cliente'],
  },
  cotizacion: {
    titulo: 'Cotización', tipo: 'partidas', iva: 'aparte', quien: 'Cliente',
    extras: [['vigencia', 'Vigencia', 'dias', 'Días, por ejemplo 15'], ['entrega', 'Tiempo de entrega', 'texto', '10 días hábiles']],
    notasPh: 'Ejemplo: anticipo del 50% para empezar y el resto al entregar.', firmas: ['Atentamente'],
  },
  'orden-compra': {
    titulo: 'Orden de compra', tipo: 'partidas', iva: 'aparte', quien: 'Proveedor', quienPh: 'Nombre del proveedor',
    extras: [['fechaEntrega', 'Fecha de entrega', 'fecha'], ['lugarEntrega', 'Lugar de entrega', 'texto', 'Almacén o domicilio'],
      ['condPago', 'Condiciones de pago', 'texto', 'Ejemplo: 30 días de crédito']],
    firmas: ['Autorizó', 'Proveedor'],
  },
  'orden-servicio': {
    titulo: 'Orden de servicio', tipo: 'partidas', iva: 'incluido', quien: 'Cliente',
    extras: [['equipo', 'Equipo o servicio', 'texto', 'Ejemplo: lavadora'], ['marca', 'Marca y modelo', 'texto'],
      ['serie', 'Número de serie', 'texto'], ['fechaEntrega', 'Entrega estimada', 'fecha'],
      ['falla', 'Falla reportada o trabajo pedido', 'area', 'Lo que dice el cliente']],
    notasPh: 'Ejemplo: garantía de 30 días en mano de obra.', conceptos: 'Refacciones y mano de obra',
    firmas: ['Técnico', 'Cliente'],
  },
  'lista-precios': {
    titulo: 'Lista de precios', tipo: 'lista', iva: 'incluido', quien: null, sinFolio: true,
    extras: [['vigenteHasta', 'Precios válidos hasta', 'fecha']], firmas: [],
  },
};

export const TEXTOS = {
  diseno: 'Diseño',
  disenos: { clasico: 'Clásico', franja: 'Franja de color', sobrio: 'Sobrio' },
  color: 'Color',
  iva: 'IVA',
  ivas: { aparte: 'Se suma 16% aparte', incluido: 'Precios con IVA incluido', sin: 'Sin IVA' },
  hojaEtiqueta: 'Formato para llenar',
  subirLogo: 'Subir logo',
  cambiarLogo: 'Cambiar logo',
  quitarLogo: 'Quitar logo',
  negocioPh: 'Nombre de tu negocio',
  negocioDatosPh: 'RFC, dirección, teléfono y correo',
  negocioDatos: 'Datos de tu negocio',
  titulo: 'Título del documento',
  folio: 'Folio',
  lugarPh: 'Ciudad',
  lugar: 'Lugar',
  fecha: 'Fecha',
  clienteDatosPh: 'Dirección, teléfono o RFC (opcional)',
  clienteDatos: 'Datos de contacto',
  cant: 'Cant.', desc: 'Descripción', precio: 'Precio unitario', importe: 'Importe', clave: 'Clave', precioLista: 'Precio',
  descPh: 'Producto o servicio',
  agregar: 'Agregar renglón',
  quitar: (n) => `Quitar renglón ${n}`,
  suma: 'Suma', subtotal: 'Subtotal', descuento: 'Descuento', ivaLinea: 'IVA 16%', total: 'Total',
  retIsr: 'Retención ISR 10%', retIva: 'Retención IVA', retenciones: 'Retener ISR e IVA (cliente persona moral)',
  conLetra: 'Importe con letra',
  incluyeIva: 'Los precios ya incluyen IVA.',
  masIva: 'Los precios no incluyen IVA.',
  buenoPor: 'Bueno por',
  monto: 'Cantidad recibida',
  laCantidad: 'la cantidad de',
  notas: 'Notas y condiciones',
  notasPh: 'Escribe aquí tus condiciones o notas',
  firmaPh: 'Firma aquí con el dedo o el ratón',
  firmaNombre: 'Nombre de quien firma',
  borrarFirma: 'Borrar firma',
  vigenciaHasta: (d, f) => `${d} días, hasta el ${f}`,
  pdf: 'Descargar PDF',
  png: 'Descargar imagen',
  nuevo: 'Documento nuevo',
  descargado: (f) => `Listo. Revisa tus descargas. El siguiente folio será ${f}.`,
  descargadoLista: 'Listo. Revisa tus descargas.',
  aviso: 'Este documento no es un comprobante fiscal (CFDI). Si tu cliente pide factura, emítela con tu proveedor de facturación.',
  guardado: 'Tus datos se guardan sólo en este navegador para la próxima vez.',
  borrarDatos: 'Borrar mis datos de este equipo',
  borrados: 'Listo. Se borraron tus datos de este equipo.',
  pagina: (a, b) => `Página ${a} de ${b}`,
  continua: 'continúa',
  logoMal: 'No se pudo abrir esa imagen. Prueba con PNG o JPG.',
};

// ---------- números, fechas y folio ----------
export const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
export const pesos = (v) => MXN.format(v);
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function fechaLarga(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${+m[3]} de ${MESES[+m[2] - 1]} de ${m[1]}` : '';
}
function hoyIso(mas = 0) {
  const d = new Date();
  d.setDate(d.getDate() + mas);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function sumarDias(iso, dias) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  const d = new Date(+m[1], +m[2] - 1, +m[3] + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
// 0001 → 0002, 2026-099 → 2026-100. Sin números, lo deja igual.
export function siguienteFolio(f) {
  const m = /^(.*?)(\d+)(\D*)$/.exec(String(f || ''));
  if (!m) return f || '0001';
  const n = String(+m[2] + 1).padStart(m[2].length, '0');
  return m[1] + n + m[3];
}

// Cálculo en centavos para que subtotal + IVA cuadre siempre con el total.
export function calcular({ partidas = [], iva = 'aparte', desc = '', descTipo = '%', ret = false, sinCant = false }) {
  const c = (v) => Math.round(v * 100);
  let suma = 0;
  for (const p of partidas) {
    const pr = num(p.precio);
    const cant = sinCant ? 1 : String(p.cant ?? '').trim() === '' ? (pr ? 1 : 0) : num(p.cant);
    suma += Math.round(cant * pr * 100);
  }
  let d = descTipo === '%' ? Math.round(suma * Math.min(100, Math.max(0, num(desc))) / 100) : c(Math.max(0, num(desc)));
  d = Math.min(d, suma);
  const neto = suma - d;
  let sub = neto, imp = 0, total = neto;
  if (iva === 'aparte') { imp = Math.round(neto * 0.16); total = neto + imp; }
  else if (iva === 'incluido') { sub = Math.round(neto / 1.16); imp = neto - sub; }
  let rIsr = 0, rIva = 0;
  if (ret) { rIsr = Math.round(sub * 0.1); rIva = Math.round(imp * 2 / 3); total -= rIsr + rIva; }
  const p = (v) => v / 100;
  return { suma: p(suma), descuento: p(d), subtotal: p(sub), iva: p(imp), retIsr: p(rIsr), retIva: p(rIva), total: p(total) };
}

const importeDe = (p, sinCant) => {
  const pr = num(p.precio);
  const cant = sinCant ? 1 : String(p.cant ?? '').trim() === '' ? (pr ? 1 : 0) : num(p.cant);
  return Math.round(cant * pr * 100) / 100;
};
const conMayuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- guardado en el equipo ----------
const CLAVE = 'avelina-doc-';
function leer(k) { try { return JSON.parse(localStorage.getItem(CLAVE + k) || 'null'); } catch (e) { return null; } }
function guardar(k, v) { try { localStorage.setItem(CLAVE + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
function borrar(k) { try { localStorage.removeItem(CLAVE + k); } catch (e) { /* sin acceso */ } }

// ---------- maquetación en puntos (carta) ----------
// Devuelve una lista de escenas (páginas) para _pdf.js.
export function maquetar(st, cfg, t, im = {}) {
  const W = CARTA.w, H = CARTA.h, M = 44, ANCHO = W - 2 * M, LIM = H - 56;
  const ac = st.color || '#1F3A5F', tinta = '#1A1A1A', gris = '#6B6B6B', suave = '#DADADA';
  const sobreAc = contraste(ac, '#FFFFFF') >= 3 ? '#FFFFFF' : '#1A1A1A';
  const banda = st.estilo === 'franja', centro = st.estilo === 'sobrio';
  const paginas = [];
  let pz, y;
  const T = (x, yy, s, f, tam, color = tinta, ancla = 'i') => pz.push({ t: 'texto', x, y: yy, s, f, tam, color, ancla });
  const L = (x1, y1, x2, y2, color = suave, grosor = 0.7) => pz.push({ t: 'linea', x1, y1, x2, y2, color, grosor });
  const R = (x, yy, w, hh, relleno, extra = {}) => pz.push({ t: 'rect', x, y: yy, w, h: hh, relleno, ...extra });
  const parrafo = (s, x, w, f, tam, color, lh, ancla = 'i') => {
    for (const r of partir(s, f, tam, w)) { y += lh; T(ancla === 'd' ? x + w : ancla === 'c' ? x + w / 2 : x, y, r, f, tam, color, ancla); }
  };
  const etiqueta = (s, x, color = ac) => T(x, y, s.toUpperCase(), 'hb', 7.5, color);
  const blanco = (x, w) => L(x, y + 3, x + w, y + 3, '#9A9A9A', 0.6);
  const medir = (fn) => { const g = pz, gy = y; pz = []; y = 0; fn(); const alto = y; pz = g; y = gy; return alto; };

  function cabecera() {
    const fechaTxt = [st.lugar, fechaLarga(st.fecha)].filter(Boolean).join(', a ');
    const folioTxt = cfg.sinFolio ? '' : `${t.folio} ${st.folio || ''}`.trim();
    if (banda) R(0, 0, W, 112, ac);
    const c1 = banda ? sobreAc : tinta, c2 = banda ? sobreAc : gris, cT = banda ? sobreAc : ac;
    if (centro) {
      y = 40;
      if (im.logo) {
        const e = encajar(im.logo, W / 2 - 80, y, 160, 56);
        pz.push({ t: 'img', ...e, im: im.logo });
        y += 56 + 6;
      }
      y += 16;
      if (st.negocio) T(W / 2, y, st.negocio, 'hb', 15, c1, 'c');
      if (st.negocioDatos) parrafo(st.negocioDatos.replace(/\n+/g, ' · '), M + 40, ANCHO - 80, 'h', 8.5, c2, 11.5, 'c');
      y += 26;
      T(W / 2, y, st.titulo, 'hb', 17, cT, 'c');
      y += 15;
      T(W / 2, y, [folioTxt, fechaTxt].filter(Boolean).join('  ·  '), 'h', 9, gris, 'c');
      y += 12;
      L(M, y, W - M, y, suave, 0.7);
      return y + 22;
    }
    const top = banda ? 26 : 40;
    let x = M;
    if (im.logo) {
      const caja = { w: 120, h: 60 };
      if (banda) R(M - 6, top - 6, caja.w + 12, caja.h + 12, '#FFFFFF', { radio: 4 });
      const e = encajar(im.logo, M, top, caja.w, caja.h, banda ? 'c' : 'i');
      pz.push({ t: 'img', ...e, im: im.logo });
      x = (banda ? M + caja.w + 6 : e.x + e.w) + 16;
    }
    const derW = 190, izqW = W - M - derW - 16 - x;
    y = top + 14;
    if (st.negocio) for (const r of partir(st.negocio, 'hb', 14, izqW).slice(0, 2)) { T(x, y, r, 'hb', 14, c1); y += 16; }
    else y += 2;
    y -= 6;
    if (st.negocioDatos) parrafo(st.negocioDatos, x, izqW, 'h', 8.5, c2, 11);
    const yIzq = Math.max(y, im.logo ? top + 60 : 0);
    y = top + 16;
    for (const r of partir(st.titulo || '', 'hb', 18, derW)) { T(W - M, y, r, 'hb', 18, cT, 'd'); y += 20; }
    if (folioTxt) T(W - M, y, folioTxt, 'hb', 10, c1, 'd'); else y -= 12;
    if (fechaTxt) { y += 4; parrafo(fechaTxt, W - M - derW, derW, 'h', 9, c2, 12, 'd'); }
    y = Math.max(yIzq, y);
    if (banda) return Math.max(y, 112) + 30;
    y += 14;
    L(M, y, W - M, y, ac, 1.4);
    return y + 24;
  }

  function nuevaPagina(primera) {
    pz = [];
    paginas.push({ w: W, h: H, piezas: pz });
    if (primera) { y = cabecera(); return; }
    y = 40;
    T(M, y, `${st.titulo} ${cfg.sinFolio ? '' : st.folio || ''} · ${t.continua}`.replace('  ', ' '), 'hb', 10, ac);
    if (st.negocio) T(W - M, y, st.negocio, 'h', 9, gris, 'd');
    y += 26;
  }
  nuevaPagina(true);

  // Cliente y datos propios del modo
  const cortos = cfg.extras.filter((e) => e[2] !== 'area'), largos = cfg.extras.filter((e) => e[2] === 'area');
  const valorExtra = ([k, , tipo]) => {
    const v = (st.extras[k] || '').trim();
    if (tipo === 'fecha') return fechaLarga(v);
    if (tipo === 'dias') return v ? t.vigenciaHasta(num(v), fechaLarga(sumarDias(st.fecha, num(v)))) : '';
    return v;
  };
  const y0 = y;
  const izqW = cfg.quien ? ANCHO * 0.52 : 0, derX = M + (cfg.quien ? izqW + 24 : 0), derW = W - M - derX;
  if (cfg.quien) {
    etiqueta(cfg.quien, M);
    y += 16;
    if (st.cliente) for (const r of partir(st.cliente, 'hb', 11.5, izqW)) { T(M, y, r, 'hb', 11.5); y += 14; }
    else { blanco(M, izqW); y += 14; }
    y -= 4;
    if (st.clienteDatos) parrafo(st.clienteDatos, M, izqW, 'h', 9, gris, 12);
  }
  const yIzq = y;
  y = y0;
  for (const e of cortos) {
    const v = valorExtra(e);
    T(derX, y, e[1], 'h', 8, gris);
    const rs = v ? partir(v, 'h', 9.5, derW - 112) : [];
    rs.forEach((r, k) => T(derX + 112, y + k * 12, r, 'h', 9.5));
    if (!v) blanco(derX + 112, derW - 112);
    y += 15 + Math.max(0, rs.length - 1) * 12;
  }
  y = Math.max(yIzq, y) + 10;
  for (const e of largos) {
    y += 12;
    etiqueta(e[1], M);
    const v = valorExtra(e);
    if (v) parrafo(v, M, ANCHO, 'h', 10, tinta, 13);
    else { y += 16; blanco(M, ANCHO); }
    y += 6;
  }

  const cuentas = calcular({ ...st, sinCant: cfg.sinCant });
  const letra = conMayuscula(importeEnLetra(cfg.tipo === 'monto' ? num(st.monto) : cuentas.total));

  // Cierre: totales, letra, notas y firmas. Se mide antes para saber si cabe.
  function totales() {
    if (cfg.tipo === 'lista') {
      const nota = st.iva === 'incluido' ? t.incluyeIva : st.iva === 'aparte' ? t.masIva : '';
      if (nota) { y += 14; T(M, y, nota, 'h', 9, gris); }
      return;
    }
    const filas = [];
    const c = cuentas;
    if (c.descuento) filas.push([t.suma, c.suma], [t.descuento + (st.descTipo === '%' ? ` ${num(st.desc)}%` : ''), -c.descuento]);
    if (st.iva !== 'sin') filas.push([t.subtotal, c.subtotal], [t.ivaLinea, c.iva]);
    else if (!c.descuento) filas.push([t.subtotal, c.subtotal]);
    if (st.ret && cfg.ret) { filas.push([t.retIsr, -c.retIsr]); if (st.iva !== 'sin') filas.push([t.retIva, -c.retIva]); }
    const tw = 220, tx = W - M - tw;
    const yT = y + 4;
    y = yT;
    const vacio = !c.suma;
    for (const [k, v] of filas) {
      y += 16;
      T(tx + 10, y, k, 'h', 9.5, gris);
      if (vacio) L(W - M - 100, y + 3, W - M - 10, y + 3, '#9A9A9A', 0.6);
      else T(W - M - 10, y, pesos(v), 'h', 10, tinta, 'd');
    }
    y += 10;
    const linea = centro || vacio;
    R(tx, y, tw, 26, linea ? null : ac, linea ? { trazo: ac, grosor: 1 } : {});
    T(tx + 10, y + 17, t.total, 'hb', 11, linea ? ac : sobreAc);
    if (!vacio) T(W - M - 10, y + 17, pesos(c.total), 'hb', 12.5, centro ? ac : sobreAc, 'd');
    const yFin = y + 26;
    y = yT + 16;
    const lw = ANCHO - tw - 30;
    etiqueta(t.conLetra, M);
    if (vacio) { y += 18; blanco(M, lw); y += 18; blanco(M, lw); } else parrafo(`(${letra})`, M, lw, 'h', 9.5, tinta, 13);
    if (st.iva === 'incluido') { y += 4; parrafo(t.incluyeIva, M, lw, 'h', 8.5, gris, 12); }
    y = Math.max(y, yFin);
  }
  function notas() {
    if (!(st.notas || '').trim()) return;
    y += 24;
    etiqueta(t.notas, M);
    parrafo(st.notas, M, ANCHO, 'h', 9, tinta, 12.5);
  }
  function firmas() {
    const n = cfg.firmas.length;
    if (!n) return;
    y += 64;
    const fw = 190, hueco = n === 1 ? 0 : (ANCHO - n * fw) / (n - 1);
    cfg.firmas.forEach((lab, i) => {
      const x = n === 1 ? W / 2 - fw / 2 : M + i * (fw + hueco);
      if (i === 0 && im.firma) {
        const e = encajar(im.firma, x + 10, y - 54, fw - 20, 50);
        pz.push({ t: 'img', ...e, im: im.firma });
      }
      L(x, y, x + fw, y, tinta, 0.8);
      if (i === 0 && st.firmaNombre) T(x + fw / 2, y + 13, recortar(st.firmaNombre, 'h', 9.5, fw), 'h', 9.5, tinta, 'c');
      T(x + fw / 2, y + (i === 0 && st.firmaNombre ? 25 : 13), lab, 'h', 8, gris, 'c');
    });
    y += 26;
  }
  const cierre = () => { totales(); notas(); firmas(); };

  if (cfg.tipo === 'monto') {
    const monto = num(st.monto);
    const bw = 200, bx = W - M - bw;
    y += 10;
    const yB = y;
    R(bx, y, bw, 44, null, { trazo: ac, grosor: 1.2, radio: 4 });
    T(bx + 12, y + 17, t.buenoPor.toUpperCase(), 'hb', 7.5, ac);
    T(bx + bw - 12, y + 33, monto ? pesos(monto) : '', 'hb', 16, tinta, 'd');
    y += 12;
    etiqueta(t.conLetra, M);
    if (monto) parrafo(`(${letra})`, M, ANCHO - bw - 30, 'h', 10.5, tinta, 14);
    else { y += 18; blanco(M, ANCHO - bw - 30); }
    y = Math.max(y, yB + 44);
    notas();
    firmas();
  } else {
    // Tabla de partidas
    const sinCant = cfg.sinCant, lista = cfg.tipo === 'lista';
    const cols = lista
      ? [['clave', t.clave, 70, 'i'], ['desc', t.desc, ANCHO - 70 - 100, 'i'], ['precio', t.precioLista, 100, 'd']]
      : sinCant
        ? [['desc', cfg.conceptos || t.desc, ANCHO - 110, 'i'], ['importe', t.importe, 110, 'd']]
        : [['cant', t.cant, 50, 'c'], ['desc', cfg.conceptos || t.desc, ANCHO - 50 - 92 - 96, 'i'], ['precio', t.precio, 92, 'd'], ['importe', t.importe, 96, 'd']];
    let x = M;
    for (const c of cols) { c.x = x; x += c[2]; }
    const posX = (c) => (c[3] === 'd' ? c.x + c[2] - 8 : c[3] === 'c' ? c.x + c[2] / 2 : c.x + 8);
    const encabezado = () => {
      if (centro) { L(M, y + 22, W - M, y + 22, ac, 1); }
      else R(M, y, ANCHO, 22, ac);
      for (const c of cols) T(posX(c), y + 14.5, c[1], 'hb', 8.5, centro ? ac : sobreAc, c[3]);
      y += 22;
    };
    encabezado();
    const conTexto = st.partidas.filter((p) => (p.desc || '').trim() || num(p.precio) || (p.clave || '').trim());
    const enBlanco = !conTexto.length;
    const filas = enBlanco ? Array.from({ length: lista ? 18 : 10 }, () => null) : conTexto;
    const altoCierre = medir(cierre);
    filas.forEach((p, i) => {
      const dW = cols.find((c) => c[0] === 'desc')[2] - 16;
      const renglones = p ? partir(p.desc || '', 'h', 9.5, dW) : [''];
      const alto = Math.max(22, renglones.length * 12.5 + 10);
      if (y + alto > LIM) { nuevaPagina(false); encabezado(); }
      if (p) {
        for (const c of cols) {
          if (c[0] === 'desc') renglones.forEach((r, k) => T(posX(c), y + 15 + k * 12.5, r, 'h', 9.5));
          else {
            const v = c[0] === 'cant' ? (p.cant || (num(p.precio) ? '1' : ''))
              : c[0] === 'clave' ? p.clave
                : c[0] === 'precio' ? (num(p.precio) || p.precio ? pesos(num(p.precio)) : '')
                  : pesos(importeDe(p, sinCant));
            T(posX(c), y + 15, recortar(v, 'h', 9.5, c[2] - 12), 'h', 9.5, tinta, c[3]);
          }
        }
      }
      y += alto;
      L(M, y, W - M, y, suave, 0.6);
    });
    if (y + altoCierre > LIM) nuevaPagina(false);
    cierre();
  }

  // Pie y número de página
  paginas.forEach((p, i) => {
    p.piezas.push({ t: 'texto', x: W / 2, y: H - 22, s: PIE, f: 'h', tam: 7, color: '#8C8C8C', ancla: 'c' });
    if (paginas.length > 1) p.piezas.push({ t: 'texto', x: W - M, y: H - 22, s: t.pagina(i + 1, paginas.length), f: 'h', tam: 7, color: '#8C8C8C', ancla: 'd' });
  });
  return paginas;
}

// ---------- herramienta ----------
export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const modo = MODOS[opciones.modo] ? opciones.modo : 'cotizacion';
  const cfg = MODOS[modo];

  const negocioGuardado = leer('negocio') || {};
  const borrador = leer('borrador-' + modo) || {};
  const folioGuardado = leer('folio-' + modo);
  const vacio = () => ({
    cliente: '', clienteDatos: '', extras: {}, partidas: [{}, {}, {}].map(() => ({ cant: '', desc: '', precio: '', clave: '' })),
    desc: '', descTipo: '%', ret: false, monto: '', notas: '',
  });
  const st = Object.assign({
    negocio: '', negocioDatos: '', logo: null, color: '#1F3A5F', estilo: 'clasico', firmaNombre: '', lugar: '', firma: null,
    titulo: cfg.titulo, iva: cfg.iva || 'sin',
  }, negocioGuardado, vacio(), borrador);
  st.fecha = hoyIso();
  st.folio = borrador.folio || folioGuardado || '0001';
  if (!st.titulo) st.titulo = cfg.titulo;

  const im = { logo: null, firma: null };
  const cargar = (url, k) => new Promise((ok) => {
    im[k + 'Url'] = url || null;
    if (!url) { im[k] = null; ok(); return; }
    const i = new Image();
    i.onload = () => { if (im[k + 'Url'] === url) im[k] = imagen(i, { maxPx: k === 'logo' ? 700 : 600 }); ok(); };
    i.onerror = () => { im[k] = null; ok(); };
    i.src = url;
  });
  let listas = Promise.all([cargar(st.logo, 'logo'), cargar(st.firma, 'firma')]);

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-una adoc', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  let tGuardar, pendiente = null;
  function persistir() {
    clearTimeout(tGuardar);
    tGuardar = setTimeout(pendiente = () => {
      pendiente = null;
      const { negocio, negocioDatos, logo, color, estilo, firmaNombre, lugar, firma } = st;
      if (!guardar('negocio', { negocio, negocioDatos, logo, color, estilo, firmaNombre, lugar, firma })) {
        guardar('negocio', { negocio, negocioDatos, color, estilo, firmaNombre, lugar });
      }
      const { cliente, clienteDatos, extras, partidas, desc, descTipo, ret, monto, notas, titulo, folio, iva } = st;
      guardar('borrador-' + modo, { cliente, clienteDatos, extras, partidas, desc, descTipo, ret, monto, notas, titulo, folio, iva });
    }, 400);
  }
  const vaciar = () => { if (pendiente) { clearTimeout(tGuardar); pendiente(); } };
  addEventListener('pagehide', vaciar);
  document.addEventListener('visibilitychange', vaciar);

  // Opciones de arriba
  const chipsDiseno = opcionesChip('diseno', t.diseno, Object.entries(t.disenos), st.estilo, (v) => { st.estilo = v; pintarHoja(); persistir(); });
  const color = selectorColor(t.color, st.color, (v) => { st.color = v; hoja.style.setProperty('--adoc-ac', v); persistir(); });
  const chipsIva = cfg.tipo === 'monto' ? null : opcionesChip('iva', t.iva, Object.entries(t.ivas), st.iva, (v) => { st.iva = v; recalcular(); persistir(); });
  raiz.append(h('div', { class: 'ah-columna adoc-opciones' }, chipsDiseno, h('div', { class: 'adoc-fila-op' }, color, chipsIva)));

  // La hoja
  const hoja = h('div', { class: 'adoc-hoja', role: 'group', 'aria-label': t.hojaEtiqueta });
  hoja.style.setProperty('--adoc-ac', st.color);
  const vista = h('div', { class: 'ah-vista' }, hoja);
  raiz.append(vista);

  // Campo que escribe en st (o en st.extras) y guarda.
  function entrada(ruta, ph, etq, { area = false, clase = '', tipo = 'text', modoTeclado, lista } = {}) {
    const [a, b] = ruta.split('.');
    const leerV = () => (b ? st[a][b] : st[a]) ?? '';
    const el = area
      ? h('textarea', { class: 'adoc-in ' + clase, rows: 1, placeholder: ph, 'aria-label': etq, spellcheck: true })
      : h('input', { type: tipo, class: 'adoc-in ' + clase, placeholder: ph, 'aria-label': etq, autocomplete: 'off', inputmode: modoTeclado, list: lista });
    el.value = leerV();
    el.addEventListener('input', () => {
      if (b) st[a][b] = el.value; else st[a] = el.value;
      if (area) crecer(el);
      recalcular();
      persistir();
    });
    if (area) requestAnimationFrame(() => crecer(el));
    return el;
  }
  const crecer = (el) => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; };
  const idPago = 'adoc-pago-' + Math.random().toString(36).slice(2, 8);

  let calc = {};
  function pintarHoja() {
    hoja.textContent = '';
    hoja.className = 'adoc-hoja adoc-' + st.estilo;
    calc = {};
    // Cabecera
    const logoCaja = h('div', { class: 'adoc-logo' });
    const archivo = h('input', { type: 'file', accept: 'image/*', hidden: true });
    archivo.addEventListener('change', async () => {
      const f = archivo.files[0];
      if (!f) return;
      try {
        const { img } = await leerImagen(f);
        const k = Math.min(1, 700 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        st.logo = c.toDataURL('image/png');
        listas = cargar(st.logo, 'logo');
        await listas;
        persistir();
        pintarHoja();
      } catch (e) { est.decir(t.logoMal, 5000); }
    });
    if (st.logo) {
      logoCaja.append(h('img', { src: st.logo, alt: '' }),
        h('div', { class: 'adoc-logo-acc' },
          boton(t.cambiarLogo, () => archivo.click(), 'ah-liga adoc-liga'),
          boton(t.quitarLogo, () => { st.logo = null; im.logo = null; persistir(); pintarHoja(); }, 'ah-liga adoc-liga')));
    } else logoCaja.append(boton(t.subirLogo, () => archivo.click(), 'adoc-subir'));
    logoCaja.append(archivo);

    const negocio = h('div', { class: 'adoc-negocio' }, logoCaja,
      h('div', { class: 'adoc-negocio-datos' },
        entrada('negocio', cfg.negocioPh || t.negocioPh, cfg.negocioPh || t.negocioPh, { clase: 'adoc-grande' }),
        entrada('negocioDatos', t.negocioDatosPh, t.negocioDatos, { area: true, clase: 'adoc-chico' })));
    const docu = h('div', { class: 'adoc-docu' },
      entrada('titulo', cfg.titulo, t.titulo, { clase: 'adoc-titulo' }),
      cfg.sinFolio ? null : h('label', { class: 'adoc-folio' }, h('span', { text: t.folio }), entrada('folio', '0001', t.folio, { clase: 'adoc-folio-in' })),
      h('div', { class: 'adoc-fecha' }, entrada('lugar', t.lugarPh, t.lugar, { clase: 'adoc-lugar' }),
        entrada('fecha', '', t.fecha, { tipo: 'date', clase: 'adoc-fecha-in' })));
    hoja.append(h('div', { class: 'adoc-cab' }, negocio, docu));

    // Cliente y extras
    const bloque = h('div', { class: 'adoc-bloque' + (cfg.quien ? '' : ' adoc-sin-quien') });
    if (cfg.quien) {
      bloque.append(h('div', { class: 'adoc-quien' },
        h('span', { class: 'adoc-etq', text: cfg.quien }),
        entrada('cliente', cfg.quienPh || 'Nombre o empresa', cfg.quien, { clase: 'adoc-medio' }),
        entrada('clienteDatos', t.clienteDatosPh, t.clienteDatos, { area: true, clase: 'adoc-chico' })));
    }
    const ext = h('div', { class: 'adoc-extras' });
    for (const [k, etq, tipo, ph] of cfg.extras) {
      const el = entrada('extras.' + k, ph || '', etq, {
        area: tipo === 'area', tipo: tipo === 'fecha' ? 'date' : 'text', modoTeclado: tipo === 'dias' ? 'numeric' : undefined,
        lista: tipo === 'pago' ? idPago : undefined,
      });
      const caja = h('label', { class: 'adoc-extra' + (tipo === 'area' ? ' adoc-extra-largo' : '') }, h('span', { class: 'adoc-etq2', text: etq }), el);
      if (tipo === 'dias') { calc.vigencia = h('span', { class: 'adoc-calc' }); caja.append(calc.vigencia); }
      ext.append(caja);
    }
    ext.append(h('datalist', { id: idPago }, PAGO.map((p) => h('option', { value: p }))));
    bloque.append(ext);
    hoja.append(bloque);

    if (cfg.tipo === 'monto') {
      calc.monto = h('div', { class: 'adoc-bueno' },
        h('span', { class: 'adoc-etq', text: t.buenoPor }),
        h('span', { class: 'adoc-signo', text: '$' }),
        entrada('monto', '0.00', t.monto, { clase: 'adoc-monto', modoTeclado: 'decimal' }));
      hoja.append(calc.monto);
    } else hoja.append(tablaPartidas());

    // Letra, totales y notas
    calc.letra = h('p', { class: 'adoc-letra', 'aria-live': 'polite' });
    if (cfg.tipo !== 'lista') hoja.append(h('div', { class: 'adoc-cierre' }, h('div', { class: 'adoc-letra-caja' }, h('span', { class: 'adoc-etq', text: t.conLetra }), calc.letra), cfg.tipo === 'monto' ? null : totalesHtml()));
    else { calc.ivaNota = h('p', { class: 'adoc-nota-iva' }); hoja.append(calc.ivaNota); }
    hoja.append(h('label', { class: 'adoc-notas' }, h('span', { class: 'adoc-etq', text: t.notas }),
      entrada('notas', cfg.notasPh || t.notasPh, t.notas, { area: true })));
    if (cfg.firmas.length) hoja.append(firmasHtml());
    hoja.append(h('p', { class: 'adoc-pie', text: PIE }));
    recalcular();
  }

  function tablaPartidas() {
    const lista = cfg.tipo === 'lista', sinCant = cfg.sinCant;
    const tipoCols = lista ? 'adoc-cols-lista' : sinCant ? 'adoc-cols-sc' : 'adoc-cols';
    const cab = h('div', { class: 'adoc-tcab ' + tipoCols, 'aria-hidden': 'true' },
      lista ? h('span', { text: t.clave }) : sinCant ? null : h('span', { text: t.cant }),
      h('span', { text: cfg.conceptos || t.desc }),
      h('span', { text: lista ? t.precioLista : sinCant ? t.importe : t.precio }),
      lista || sinCant ? null : h('span', { text: t.importe }), h('span'));
    const cuerpo = h('div', { class: 'adoc-tcuerpo' });
    calc.importes = [];
    const fila = (p, i) => {
      const campoP = (k, ph, etq, o = {}) => {
        const el = h('input', { type: 'text', class: 'adoc-in adoc-c-' + k, placeholder: ph, 'aria-label': `${etq}, renglón ${i + 1}`, autocomplete: 'off', inputmode: o.tec });
        el.value = p[k] || '';
        el.addEventListener('input', () => { p[k] = el.value; recalcular(); persistir(); });
        return el;
      };
      const desc = h('textarea', { class: 'adoc-in adoc-c-desc', rows: 1, placeholder: t.descPh, 'aria-label': `${t.desc}, renglón ${i + 1}` });
      desc.value = p.desc || '';
      desc.addEventListener('input', () => { p.desc = desc.value; crecer(desc); recalcular(); persistir(); });
      requestAnimationFrame(() => crecer(desc));
      const imp = h('span', { class: 'adoc-c-imp' });
      calc.importes.push([imp, p]);
      return h('div', { class: 'adoc-tfila ' + tipoCols },
        lista ? campoP('clave', 'A-01', t.clave) : sinCant ? null : campoP('cant', t.cant, t.cant, { tec: 'decimal' }),
        desc,
        campoP('precio', lista ? t.precioLista : sinCant ? t.importe : 'Precio', lista ? t.precioLista : sinCant ? t.importe : t.precio, { tec: 'decimal' }),
        lista || sinCant ? null : imp,
        h('button', { type: 'button', class: 'adoc-quitar', 'aria-label': t.quitar(i + 1), text: '×', onclick: () => {
          st.partidas.splice(i, 1);
          if (!st.partidas.length) st.partidas.push({ cant: '', desc: '', precio: '', clave: '' });
          pintarFilas(); recalcular(); persistir();
        } }));
    };
    const pintarFilas = () => {
      cuerpo.textContent = '';
      calc.importes = [];
      st.partidas.forEach((p, i) => cuerpo.append(fila(p, i)));
    };
    pintarFilas();
    const agregar = boton('+ ' + t.agregar, () => {
      st.partidas.push({ cant: '', desc: '', precio: '', clave: '' });
      pintarFilas(); recalcular(); persistir();
      cuerpo.lastChild.querySelector('textarea').focus();
    }, 'adoc-agregar');
    return h('div', { class: 'adoc-tabla' }, cab, cuerpo, agregar);
  }

  function totalesHtml() {
    const fila = (k, etq) => { calc[k] = h('span', { class: 'adoc-num' }); return h('div', { class: 'adoc-tot-fila', 'data-k': k }, h('span', { text: etq }), calc[k]); };
    const descIn = entrada('desc', '0', t.descuento, { clase: 'adoc-desc', modoTeclado: 'decimal' });
    const descTipo = h('select', { class: 'adoc-in adoc-desc-tipo', 'aria-label': t.descuento },
      h('option', { value: '%', text: '%' }), h('option', { value: '$', text: '$' }));
    descTipo.value = st.descTipo;
    descTipo.addEventListener('change', () => { st.descTipo = descTipo.value; recalcular(); persistir(); });
    calc.descMonto = h('span', { class: 'adoc-num' });
    const caja = h('div', { class: 'adoc-totales' },
      fila('suma', t.suma),
      h('div', { class: 'adoc-tot-fila adoc-tot-desc' }, h('span', { text: t.descuento }), h('span', { class: 'adoc-desc-in' }, descIn, descTipo), calc.descMonto),
      fila('subtotal', t.subtotal), fila('iva', t.ivaLinea), fila('retIsr', t.retIsr), fila('retIva', t.retIva),
      h('div', { class: 'adoc-tot-fila adoc-tot-total' }, h('span', { text: t.total }), calc.total = h('span', { class: 'adoc-num' })));
    if (cfg.ret) {
      const chk = h('input', { type: 'checkbox', checked: st.ret });
      chk.addEventListener('change', () => { st.ret = chk.checked; recalcular(); persistir(); });
      caja.append(h('label', { class: 'adoc-ret' }, chk, h('span', { text: t.retenciones })));
    }
    return caja;
  }

  function firmasHtml() {
    const caja = h('div', { class: 'adoc-firmas' });
    cfg.firmas.forEach((lab, i) => {
      const f = h('div', { class: 'adoc-firma' });
      if (i === 0) {
        const lien = h('canvas', { class: 'adoc-pad', width: 520, height: 160, 'aria-label': t.firmaPh, role: 'img' });
        const ph = h('span', { class: 'adoc-pad-ph', text: t.firmaPh, hidden: !!st.firma });
        const ctx = lien.getContext('2d');
        if (st.firma) { const i2 = new Image(); i2.onload = () => ctx.drawImage(i2, 0, 0, lien.width, lien.height); i2.src = st.firma; }
        let pintando = false, ult = null, cambio = false;
        const pos = (e) => { const r = lien.getBoundingClientRect(); return [(e.clientX - r.left) * lien.width / r.width, (e.clientY - r.top) * lien.height / r.height]; };
        lien.addEventListener('pointerdown', (e) => { pintando = true; ult = pos(e); lien.setPointerCapture(e.pointerId); ph.hidden = true; e.preventDefault(); });
        lien.addEventListener('pointermove', (e) => {
          if (!pintando) return;
          const p = pos(e);
          ctx.strokeStyle = '#111'; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath(); ctx.moveTo(...ult); ctx.lineTo(...p); ctx.stroke();
          ult = p; cambio = true;
        });
        const fin = () => {
          if (!pintando) return;
          pintando = false;
          if (cambio) { st.firma = lien.toDataURL('image/png'); listas = cargar(st.firma, 'firma'); persistir(); }
        };
        lien.addEventListener('pointerup', fin);
        lien.addEventListener('pointercancel', fin);
        f.append(h('div', { class: 'adoc-pad-caja' }, lien, ph),
          boton(t.borrarFirma, () => { ctx.clearRect(0, 0, lien.width, lien.height); st.firma = null; im.firma = null; ph.hidden = false; persistir(); }, 'ah-liga adoc-liga'));
      }
      f.append(h('div', { class: 'adoc-linea' }));
      if (i === 0) f.append(entrada('firmaNombre', t.firmaNombre, t.firmaNombre, { clase: 'adoc-centro' }));
      f.append(h('span', { class: 'adoc-etq2 adoc-centro', text: lab }));
      caja.append(f);
    });
    return caja;
  }

  function recalcular() {
    const c = calcular({ ...st, sinCant: cfg.sinCant });
    if (calc.importes) for (const [el, p] of calc.importes) el.textContent = importeDe(p, cfg.sinCant) ? pesos(importeDe(p, cfg.sinCant)) : '';
    if (calc.vigencia) {
      const d = num(st.extras.vigencia);
      calc.vigencia.textContent = d ? `Hasta el ${fechaLarga(sumarDias(st.fecha, d))}` : '';
    }
    if (calc.ivaNota) calc.ivaNota.textContent = st.iva === 'incluido' ? t.incluyeIva : st.iva === 'aparte' ? t.masIva : '';
    const total = cfg.tipo === 'monto' ? num(st.monto) : c.total;
    if (calc.letra) calc.letra.textContent = total ? `(${conMayuscula(importeEnLetra(total))})` : '';
    if (!calc.total) return;
    const mostrar = (k, v, ver) => { calc[k].textContent = pesos(v); calc[k].parentNode.hidden = !ver; };
    mostrar('suma', c.suma, c.descuento > 0);
    calc.descMonto.textContent = c.descuento ? '−' + pesos(c.descuento) : '';
    mostrar('subtotal', c.subtotal, true);
    mostrar('iva', c.iva, st.iva !== 'sin');
    mostrar('retIsr', -c.retIsr, st.ret && cfg.ret);
    mostrar('retIva', -c.retIva, st.ret && cfg.ret && st.iva !== 'sin');
    calc.total.textContent = pesos(c.total);
  }

  // Acciones
  const est = estado();
  const escenas = async () => {
    await listas;
    for (const k of ['logo', 'firma']) if ((st[k] || null) !== im[k + 'Url']) await cargar(st[k], k);
    return maquetar(st, cfg, t, im);
  };
  const base = () => `${nombreArchivo(st.titulo || cfg.titulo)}-${nombreArchivo(st.folio || '')}`;
  function avanzarFolio() {
    if (cfg.tipo === 'lista') return t.descargadoLista;
    const sig = siguienteFolio(st.folio);
    guardar('folio-' + modo, sig);
    return t.descargado(sig);
  }
  async function pdfBlob() { return pdf(await escenas(), { titulo: `${st.titulo} ${st.folio}`.trim(), autor: st.negocio }); }
  async function pngBlob() { return lienzoABlob(lienzoDeVarias(await escenas(), 2)); }
  const bPdf = boton(t.pdf, async () => {
    descargar(await pdfBlob(), base() + '.pdf');
    est.decir(avanzarFolio(), 6000);
    avisar(contenedor, ID, 'descargar');
  });
  const bPng = boton(t.png, async () => {
    descargar(await pngBlob(), base() + '.png');
    est.decir(avanzarFolio(), 6000);
    avisar(contenedor, ID, 'descargar');
  }, 'ah-boton ah-boton-2');
  const bNuevo = boton(t.nuevo, () => {
    Object.assign(st, vacio());
    st.folio = leer('folio-' + modo) || siguienteFolio(st.folio);
    st.fecha = hoyIso();
    persistir();
    pintarHoja();
    hoja.querySelector('.adoc-in').focus();
  }, 'ah-boton ah-boton-2');
  const bBorrar = boton(t.borrarDatos, () => {
    borrar('negocio'); borrar('borrador-' + modo); borrar('folio-' + modo);
    Object.assign(st, { negocio: '', negocioDatos: '', logo: null, firmaNombre: '', lugar: '', firma: null, folio: '0001' }, vacio());
    im.logo = im.firma = null;
    clearTimeout(tGuardar); pendiente = null;
    pintarHoja();
    est.decir(t.borrados);
  }, 'ah-liga');

  raiz.append(h('div', { class: 'ah-columna ah-columna-2 adoc-acciones' },
    h('div', { class: 'ah-acciones' }, bPdf, bPng, bNuevo), est,
    h('p', { class: 'ah-nota', text: t.aviso }),
    h('p', { class: 'ah-nota', text: t.guardado }), bBorrar));

  pintarHoja();
  raiz.adoc = { st, cfg, calcular: () => calcular({ ...st, sinCant: cfg.sinCant }), escenas, pdfBlob, pngBlob, repintar: pintarHoja, listas: () => listas };
  return { destruir() { vaciar(); removeEventListener('pagehide', vaciar); document.removeEventListener('visibilitychange', vaciar); contenedor.textContent = ''; } };
}

function cssPropio() {
  if (document.querySelector('link[data-adoc-css], link[href*="herramientas/documento.css"]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/documento.css', import.meta.url).href;
  l.dataset.adocCss = '1';
  document.head.appendChild(l);
}
