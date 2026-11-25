// Herramienta «visor-cfdi» de Avelina: abre el XML de un CFDI 4.0 o 3.3 y lo muestra legible.
// montar(contenedor, { modo, idioma: 'es-MX', textos })
// El archivo se lee en el navegador y no sale del equipo. Baja una representación en PDF del XML.

import {
  h, textos as unirTextos, avisar, descargar, estado, PIE, boton, asegurarEstilos, nombreArchivo,
} from './_comun.js';
import { pdf, partir, recortar, modulos, CARTA } from './_pdf.js';
import { generarQR } from './_qr-codificador.js';
import { importeEnLetra } from './documento-letra.js';

const ID = 'visor-cfdi';

export const TEXTOS = {
  soltar: 'Arrastra aquí el XML de tu factura',
  elegir: 'Elegir archivo XML',
  privado: 'El archivo se abre en tu navegador. No se sube a ningún servidor.',
  archivos: 'Archivos abiertos',
  errXml: (n) => `«${n}» no es un XML válido.`,
  errCfdi: (n) => `«${n}» no es un CFDI. Revisa que sea el XML de la factura y no otro archivo.`,
  emisor: 'Emisor', receptor: 'Receptor', rfc: 'RFC', regimen: 'Régimen fiscal', domicilio: 'Código postal',
  uso: 'Uso del CFDI', tipo: 'Tipo', serieFolio: 'Serie y folio', fecha: 'Fecha de emisión', lugar: 'Lugar de expedición',
  formaPago: 'Forma de pago', metodoPago: 'Método de pago', moneda: 'Moneda', tipoCambio: 'Tipo de cambio',
  condiciones: 'Condiciones de pago', exportacion: 'Exportación', version: 'Versión',
  conceptos: 'Conceptos',
  cols: ['Cant.', 'Unidad', 'Clave', 'Descripción', 'Valor unitario', 'Importe'],
  subtotal: 'Subtotal', descuento: 'Descuento', total: 'Total',
  trasladados: 'Impuestos trasladados', retenidos: 'Impuestos retenidos',
  conLetra: 'Importe con letra',
  timbre: 'Timbre fiscal digital',
  uuid: 'Folio fiscal (UUID)', fechaTimbrado: 'Fecha de certificación', certSat: 'Certificado del SAT',
  certEmisor: 'Certificado del emisor', provCert: 'RFC del proveedor de certificación',
  selloCfd: 'Sello digital del CFDI', selloSat: 'Sello digital del SAT', cadena: 'Cadena original del complemento de certificación digital del SAT',
  sinTimbre: 'Este XML no trae timbre fiscal. Un CFDI sin timbre no es válido ante el SAT.',
  relacionados: 'CFDI relacionados',
  pagos: 'Pagos recibidos', pagoCols: ['Fecha de pago', 'Forma', 'Monto', 'Documento', 'Parcialidad', 'Pagado', 'Saldo'],
  complementos: 'Otros complementos',
  sellos: 'Sellos y cadena original',
  pdf: 'Descargar PDF',
  verificar: 'Verificar en el SAT',
  descargado: 'Listo. Revisa tus descargas.',
  representacion: 'Representación impresa de un CFDI hecha a partir de su XML. El comprobante fiscal es el archivo XML.',
  nota: 'El PDF es una representación del XML. El comprobante fiscal válido es el archivo XML.',
  verificarNota: 'La liga del SAT abre su página de verificación con los datos de esta factura.',
};

// ---------- catálogos del SAT (los más usados) ----------
const CAT = {
  tipo: { I: 'Ingreso', E: 'Egreso', T: 'Traslado', N: 'Nómina', P: 'Pago' },
  metodo: { PUE: 'Pago en una sola exhibición', PPD: 'Pago en parcialidades o diferido' },
  forma: {
    '01': 'Efectivo', '02': 'Cheque nominativo', '03': 'Transferencia electrónica de fondos', '04': 'Tarjeta de crédito',
    '05': 'Monedero electrónico', '06': 'Dinero electrónico', '08': 'Vales de despensa', '12': 'Dación en pago',
    '13': 'Pago por subrogación', '14': 'Pago por consignación', '15': 'Condonación', '17': 'Compensación', '23': 'Novación',
    '24': 'Confusión', '25': 'Remisión de deuda', '26': 'Prescripción o caducidad', '27': 'A satisfacción del acreedor',
    '28': 'Tarjeta de débito', '29': 'Tarjeta de servicios', '30': 'Aplicación de anticipos', '31': 'Intermediario pagos', '99': 'Por definir',
  },
  uso: {
    G01: 'Adquisición de mercancías', G02: 'Devoluciones, descuentos o bonificaciones', G03: 'Gastos en general',
    I01: 'Construcciones', I02: 'Mobiliario y equipo de oficina por inversiones', I03: 'Equipo de transporte',
    I04: 'Equipo de cómputo y accesorios', I05: 'Dados, troqueles, moldes, matrices y herramental', I06: 'Comunicaciones telefónicas',
    I07: 'Comunicaciones satelitales', I08: 'Otra maquinaria y equipo', D01: 'Honorarios médicos, dentales y gastos hospitalarios',
    D02: 'Gastos médicos por incapacidad o discapacidad', D03: 'Gastos funerales', D04: 'Donativos',
    D05: 'Intereses reales por créditos hipotecarios (casa habitación)', D06: 'Aportaciones voluntarias al SAR',
    D07: 'Primas por seguros de gastos médicos', D08: 'Gastos de transportación escolar obligatoria',
    D09: 'Depósitos en cuentas para el ahorro y planes de pensiones', D10: 'Pagos por servicios educativos (colegiaturas)',
    S01: 'Sin efectos fiscales', CP01: 'Pagos', CN01: 'Nómina', P01: 'Por definir',
  },
  regimen: {
    601: 'General de Ley Personas Morales', 603: 'Personas Morales con Fines no Lucrativos',
    605: 'Sueldos y Salarios e Ingresos Asimilados a Salarios', 606: 'Arrendamiento',
    607: 'Régimen de Enajenación o Adquisición de Bienes', 608: 'Demás ingresos',
    610: 'Residentes en el Extranjero sin Establecimiento Permanente en México', 611: 'Ingresos por Dividendos (socios y accionistas)',
    612: 'Personas Físicas con Actividades Empresariales y Profesionales', 614: 'Ingresos por intereses',
    615: 'Régimen de los ingresos por obtención de premios', 616: 'Sin obligaciones fiscales',
    620: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos', 621: 'Incorporación Fiscal',
    622: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras', 623: 'Opcional para Grupos de Sociedades', 624: 'Coordinados',
    625: 'Actividades Empresariales con ingresos a través de Plataformas Tecnológicas', 626: 'Régimen Simplificado de Confianza',
  },
  impuesto: { '001': 'ISR', '002': 'IVA', '003': 'IEPS' },
  objeto: { '01': 'No objeto de impuesto', '02': 'Sí objeto de impuesto', '03': 'Sí objeto, no obligado al desglose', '04': 'Sí objeto, no causa impuesto', '05': 'Sí objeto, IVA crédito PODEBI' },
  exportacion: { '01': 'No aplica', '02': 'Definitiva con clave A1', '03': 'Temporal', '04': 'Definitiva con clave distinta a A1' },
  relacion: {
    '01': 'Nota de crédito de los documentos relacionados', '02': 'Nota de débito de los documentos relacionados',
    '03': 'Devolución de mercancía sobre facturas o traslados previos', '04': 'Sustitución de los CFDI previos',
    '05': 'Traslados de mercancías facturados previamente', '06': 'Factura generada por los traslados previos',
    '07': 'CFDI por aplicación de anticipo',
  },
};
const conNombre = (cat, v) => (v ? (CAT[cat][v] ? `${v} · ${CAT[cat][v]}` : v) : '');

// ---------- lectura ----------
const hijos = (el, nombre) => (el ? [...el.children].filter((c) => c.localName === nombre) : []);
const hijo = (el, nombre) => hijos(el, nombre)[0] || null;
const atr = (el, n) => (el && el.getAttribute(n)) || '';
const impuestosDe = (el) => {
  const imp = hijo(el, 'Impuestos');
  const lista = (grupo, uno) => hijos(hijo(imp, grupo), uno).map((x) => ({
    base: atr(x, 'Base'), impuesto: atr(x, 'Impuesto'), factor: atr(x, 'TipoFactor'), tasa: atr(x, 'TasaOCuota'), importe: atr(x, 'Importe'),
  }));
  return {
    traslados: lista('Traslados', 'Traslado'), retenciones: lista('Retenciones', 'Retencion'),
    totalTrasladados: atr(imp, 'TotalImpuestosTrasladados'), totalRetenidos: atr(imp, 'TotalImpuestosRetenidos'),
  };
};

// Devuelve { ok, error?, ...datos } a partir del texto del XML.
export function leerCfdi(texto) {
  let doc;
  try { doc = new DOMParser().parseFromString(String(texto).replace(/^﻿/, ''), 'application/xml'); } catch (e) { return { ok: false, error: 'xml' }; }
  if (!doc || doc.getElementsByTagName('parsererror').length) return { ok: false, error: 'xml' };
  const c = doc.documentElement;
  if (!c || c.localName !== 'Comprobante' || !/sat\.gob\.mx\/cfd\/[34]/.test(c.namespaceURI || '')) return { ok: false, error: 'cfdi' };
  const A = (n) => atr(c, n);
  const em = hijo(c, 'Emisor'), re = hijo(c, 'Receptor');
  const comp = hijo(c, 'Complemento');
  const tfd = comp ? [...comp.getElementsByTagNameNS('*', 'TimbreFiscalDigital')][0] : null;
  const pagos = comp ? [...comp.getElementsByTagNameNS('*', 'Pago')].filter((p) => /pagos/i.test(p.namespaceURI)).map((p) => ({
    fecha: atr(p, 'FechaPago'), forma: atr(p, 'FormaDePagoP'), moneda: atr(p, 'MonedaP'), monto: atr(p, 'Monto'),
    docs: hijos(p, 'DoctoRelacionado').map((d) => ({
      id: atr(d, 'IdDocumento'), serie: atr(d, 'Serie'), folio: atr(d, 'Folio'), parcialidad: atr(d, 'NumParcialidad'),
      anterior: atr(d, 'ImpSaldoAnt'), pagado: atr(d, 'ImpPagado'), saldo: atr(d, 'ImpSaldoInsoluto'),
    })),
  })) : [];
  const otros = comp ? [...comp.children].map((x) => x.localName).filter((n) => n !== 'TimbreFiscalDigital' && n !== 'Pagos') : [];
  const relacionados = hijos(c, 'CfdiRelacionados').map((r) => ({ tipo: atr(r, 'TipoRelacion'), uuids: hijos(r, 'CfdiRelacionado').map((x) => atr(x, 'UUID')) }));
  return {
    ok: true,
    version: A('Version') || A('version'), serie: A('Serie'), folio: A('Folio'), fecha: A('Fecha'), tipo: A('TipoDeComprobante'),
    lugar: A('LugarExpedicion'), formaPago: A('FormaPago'), metodoPago: A('MetodoPago'), moneda: A('Moneda'), tipoCambio: A('TipoCambio'),
    condiciones: A('CondicionesDePago'), exportacion: A('Exportacion'), subtotal: A('SubTotal'), descuento: A('Descuento'), total: A('Total'),
    sello: A('Sello'), noCertificado: A('NoCertificado'),
    emisor: { rfc: atr(em, 'Rfc'), nombre: atr(em, 'Nombre'), regimen: atr(em, 'RegimenFiscal') },
    receptor: {
      rfc: atr(re, 'Rfc'), nombre: atr(re, 'Nombre'), uso: atr(re, 'UsoCFDI'), domicilio: atr(re, 'DomicilioFiscalReceptor'),
      regimen: atr(re, 'RegimenFiscalReceptor'),
    },
    conceptos: hijos(hijo(c, 'Conceptos'), 'Concepto').map((x) => ({
      clave: atr(x, 'ClaveProdServ'), id: atr(x, 'NoIdentificacion'), cantidad: atr(x, 'Cantidad'), claveUnidad: atr(x, 'ClaveUnidad'),
      unidad: atr(x, 'Unidad'), descripcion: atr(x, 'Descripcion'), valorUnitario: atr(x, 'ValorUnitario'), importe: atr(x, 'Importe'),
      descuento: atr(x, 'Descuento'), objeto: atr(x, 'ObjetoImp'), impuestos: impuestosDe(x),
    })),
    impuestos: impuestosDe(c),
    relacionados, pagos, otros,
    timbre: tfd ? {
      uuid: atr(tfd, 'UUID'), fecha: atr(tfd, 'FechaTimbrado'), rfcProv: atr(tfd, 'RfcProvCertif'), leyenda: atr(tfd, 'Leyenda'),
      selloCfd: atr(tfd, 'SelloCFD'), noCertSat: atr(tfd, 'NoCertificadoSAT'), selloSat: atr(tfd, 'SelloSAT'), version: atr(tfd, 'Version'),
    } : null,
  };
}

export function cadenaTimbre(t) {
  if (!t) return '';
  return '||' + [t.version || '1.1', t.uuid, t.fecha, t.rfcProv, t.leyenda, t.selloCfd, t.noCertSat].filter((x) => x !== '').join('|') + '||';
}
export function ligaSat(d) {
  if (!d.timbre) return '';
  return 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=' + encodeURIComponent(d.timbre.uuid) +
    '&re=' + encodeURIComponent(d.emisor.rfc) + '&rr=' + encodeURIComponent(d.receptor.rfc) + '&tt=' + encodeURIComponent(d.total) +
    '&fe=' + encodeURIComponent((d.sello || '').slice(-8));
}

const dinero = (v, moneda) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toLocaleString('es-MX', { style: 'currency', currency: /^[A-Z]{3}$/.test(moneda) && moneda !== 'XXX' ? moneda : 'MXN', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, maximumFractionDigits: 6 });
};
const cantidad = (v) => (v === '' ? '' : Number(v).toLocaleString('es-MX', { maximumFractionDigits: 6 }));
const tasa = (x) => (x.factor === 'Exento' ? 'Exento' : x.factor === 'Cuota' ? `cuota ${x.tasa}` : `${+(Number(x.tasa) * 100).toFixed(4)}%`);
const fechaHora = (s) => (s || '').replace('T', ' ');
const nombreImp = (x) => CAT.impuesto[x.impuesto] || x.impuesto;
const letraDe = (d) => (d.moneda === 'XXX' || d.total === '' ? '' : (s => `(${s.charAt(0).toUpperCase() + s.slice(1)})`)(importeEnLetra(d.total, d.moneda)));

// ---------- PDF ----------
export function maquetarCfdi(d, t = TEXTOS, qr = null) {
  const W = CARTA.w, H = CARTA.h, M = 36, AN = W - 2 * M, LIM = H - 48;
  const ac = '#1F3A5F', tinta = '#1A1A1A', gris = '#666666', raya = '#D9D9D9';
  const pag = [];
  let pz, y;
  const T = (x, yy, s, f = 'h', tam = 8, color = tinta, ancla = 'i') => pz.push({ t: 'texto', x, y: yy, s, f, tam, color, ancla });
  const L = (yy, color = raya, g = 0.6) => pz.push({ t: 'linea', x1: M, y1: yy, x2: W - M, y2: yy, color, grosor: g });
  const nueva = () => { pz = []; pag.push({ w: W, h: H, piezas: pz }); y = M; };
  const cabe = (alto) => { if (y + alto > LIM) { nueva(); y += 6; } };
  const etiqueta = (s, x = M) => T(x, y, s.toUpperCase(), 'hb', 6.8, ac);
  const par = (x, w, etq, val) => {
    if (!val) return 0;
    T(x, y, etq, 'h', 6.8, gris);
    const rs = partir(val, 'h', 8, w - 92);
    rs.forEach((r, i) => T(x + 92, y + i * 10, r));
    return rs.length * 10 + 2;
  };
  const m = d.moneda;
  nueva();
  // Cabecera
  T(M, y + 12, recortar(d.emisor.nombre || d.emisor.rfc, 'hb', 13, AN - 190), 'hb', 13);
  T(M, y + 26, `${t.rfc} ${d.emisor.rfc}`, 'h', 8.5, gris);
  if (d.emisor.regimen) T(M, y + 37, recortar(`${t.regimen} ${conNombre('regimen', d.emisor.regimen)}`, 'h', 7.5, AN - 190), 'h', 7.5, gris);
  T(W - M, y + 12, `CFDI ${CAT.tipo[d.tipo] || d.tipo} · ${t.version} ${d.version}`, 'hb', 10, ac, 'd');
  T(W - M, y + 25, [d.serie, d.folio].filter(Boolean).join('-') ? `${t.serieFolio} ${[d.serie, d.folio].filter(Boolean).join('-')}` : '', 'h', 8.5, tinta, 'd');
  T(W - M, y + 37, `${t.fecha} ${fechaHora(d.fecha)}`, 'h', 7.5, gris, 'd');
  y += 48;
  L(y, ac, 1.2);
  y += 16;
  // Receptor y datos del comprobante
  const y0 = y, mitad = AN / 2 - 10, x2 = M + AN / 2 + 10;
  etiqueta(t.receptor);
  y += 12;
  for (const [e, v] of [['Nombre', d.receptor.nombre], [t.rfc, d.receptor.rfc], [t.domicilio, d.receptor.domicilio],
    [t.regimen, conNombre('regimen', d.receptor.regimen)], [t.uso, conNombre('uso', d.receptor.uso)]]) y += par(M, mitad, e, v);
  const yA = y;
  y = y0;
  etiqueta('Comprobante', x2);
  y += 12;
  for (const [e, v] of [[t.lugar, d.lugar], [t.formaPago, conNombre('forma', d.formaPago)], [t.metodoPago, conNombre('metodo', d.metodoPago)],
    [t.moneda, d.moneda + (d.tipoCambio && d.tipoCambio !== '1' ? ` · ${t.tipoCambio} ${d.tipoCambio}` : '')], [t.condiciones, d.condiciones],
    [t.exportacion, conNombre('exportacion', d.exportacion)]]) y += par(x2, mitad, e, v);
  y = Math.max(y, yA) + 8;
  for (const r of d.relacionados) {
    etiqueta(t.relacionados); y += 11;
    y += par(M, AN, 'Tipo de relación', conNombre('relacion', r.tipo));
    y += par(M, AN, 'UUID', r.uuids.join(', '));
    y += 4;
  }
  // Conceptos
  const cols = [[40, 'd'], [50, 'i'], [58, 'i'], [AN - 40 - 50 - 58 - 80 - 80, 'i'], [80, 'd'], [80, 'd']];
  let x = M;
  for (const c of cols) { c.x = x; x += c[0]; }
  const px = (c) => (c[1] === 'd' ? c.x + c[0] - 5 : c.x + 5);
  const cabeza = () => {
    pz.push({ t: 'rect', x: M, y, w: AN, h: 16, relleno: ac });
    cols.forEach((c, i) => T(px(c), y + 11, t.cols[i], 'hb', 7, '#FFFFFF', c[1]));
    y += 16;
  };
  y += 6;
  cabe(40);
  cabeza();
  for (const k of d.conceptos) {
    const dw = cols[3][0] - 10;
    const desc = partir(k.descripcion, 'h', 7.8, dw);
    const extra = [];
    if (k.id) extra.push(`No. ident. ${k.id}`);
    if (k.objeto) extra.push(`Objeto: ${conNombre('objeto', k.objeto)}`);
    if (k.descuento && Number(k.descuento)) extra.push(`Descuento ${dinero(k.descuento, m)}`);
    for (const x2i of k.impuestos.traslados) extra.push(`Traslado ${nombreImp(x2i)} ${tasa(x2i)} base ${dinero(x2i.base, m)}: ${dinero(x2i.importe, m)}`);
    for (const x2i of k.impuestos.retenciones) extra.push(`Retención ${nombreImp(x2i)} ${x2i.tasa ? tasa(x2i) : ''}: ${dinero(x2i.importe, m)}`.replace('  ', ' '));
    const ex = extra.flatMap((s) => partir(s, 'h', 6.6, dw));
    const alto = desc.length * 9.5 + ex.length * 8.2 + 8;
    if (y + alto > LIM) { nueva(); cabeza(); }
    const yb = y + 10;
    T(px(cols[0]), yb, cantidad(k.cantidad), 'h', 7.8, tinta, 'd');
    T(px(cols[1]), yb, recortar(k.claveUnidad + (k.unidad ? ' ' + k.unidad : ''), 'h', 7, cols[1][0] - 8), 'h', 7);
    T(px(cols[2]), yb, k.clave, 'h', 7);
    desc.forEach((r, i) => T(px(cols[3]), yb + i * 9.5, r, 'h', 7.8));
    ex.forEach((r, i) => T(px(cols[3]), yb + desc.length * 9.5 + i * 8.2 - 1, r, 'h', 6.6, gris));
    T(px(cols[4]), yb, dinero(k.valorUnitario, m), 'h', 7.8, tinta, 'd');
    T(px(cols[5]), yb, dinero(k.importe, m), 'h', 7.8, tinta, 'd');
    y += alto;
    L(y);
  }
  // Pagos (complemento de pago)
  if (d.pagos.length) {
    y += 14; cabe(40); etiqueta(t.pagos); y += 6;
    for (const p of d.pagos) for (const doc of (p.docs.length ? p.docs : [{}])) {
      y += 11; cabe(12);
      const fila = [fechaHora(p.fecha), conNombre('forma', p.forma), dinero(p.monto, p.moneda), [doc.serie, doc.folio].filter(Boolean).join('-') || (doc.id || '').slice(0, 13),
        doc.parcialidad || '', dinero(doc.pagado, p.moneda), dinero(doc.saldo, p.moneda)];
      const xs = [0, 90, 210, 280, 370, 420, 490];
      fila.forEach((v, i) => T(M + xs[i], y, recortar(v || '', 'h', 7.2, (xs[i + 1] || AN) - xs[i] - 6), 'h', 7.2));
    }
    y += 6;
    L(y);
    y += 8;
  }
  // Totales e impuestos
  y += 12;
  const filas = [[t.subtotal, d.subtotal]];
  if (d.descuento && Number(d.descuento)) filas.push([t.descuento, '-' + d.descuento]);
  for (const x3 of d.impuestos.traslados) filas.push([`${nombreImp(x3)} trasladado ${tasa(x3)}`, x3.importe]);
  for (const x3 of d.impuestos.retenciones) filas.push([`${nombreImp(x3)} retenido`, '-' + x3.importe]);
  const altoTot = filas.length * 12 + 30;
  cabe(altoTot + 10);
  const tx = W - M - 220, yT = y;
  for (const [e, v] of filas) { T(tx, y, e, 'h', 8, gris); T(W - M, y, v.startsWith('-') ? '-' + dinero(v.slice(1), m) : dinero(v, m), 'h', 8.5, tinta, 'd'); y += 12; }
  pz.push({ t: 'rect', x: tx - 6, y: y - 4, w: 226, h: 20, relleno: ac });
  T(tx, y + 9.5, t.total, 'hb', 9.5, '#FFFFFF');
  T(W - M - 4, y + 9.5, dinero(d.total, m), 'hb', 10, '#FFFFFF', 'd');
  const yFin = y + 20;
  y = yT;
  if (letraDe(d)) {
    etiqueta(t.conLetra);
    partir(letraDe(d), 'h', 8, AN - 250).forEach((r) => { y += 11; T(M, y, r, 'h', 8); });
  }
  y = Math.max(y, yFin) + 16;
  if (d.otros.length) { y += par(M, AN, t.complementos, d.otros.join(', ')); y += 4; }
  // Timbre, sellos y QR
  if (d.timbre) {
    const lado = 92;
    const sellos = [[t.selloCfd, d.timbre.selloCfd || d.sello], [t.selloSat, d.timbre.selloSat], [t.cadena, cadenaTimbre(d.timbre)]];
    const anchoS = AN - lado - 14;
    const lineas = sellos.map(([, v]) => partir(v, 'h', 5.8, anchoS));
    const alto = 64 + lineas.reduce((a, l) => a + l.length * 7 + 14, 0);
    cabe(Math.min(alto, LIM - M - 10));
    L(y - 6, ac, 0.8);
    y += 6;
    const yq = y;
    if (qr) pz.push(...modulos(qr, M, yq, lado));
    const sx = M + lado + 14;
    etiqueta(t.timbre, sx); y += 11;
    for (const [e, v] of [[t.uuid, d.timbre.uuid], [t.fechaTimbrado, fechaHora(d.timbre.fecha)], [t.certSat, d.timbre.noCertSat],
      [t.certEmisor, d.noCertificado], [t.provCert, d.timbre.rfcProv]]) {
      if (!v) continue;
      T(sx, y, e, 'h', 6.8, gris); T(sx + 150, y, v, e === t.uuid ? 'hb' : 'h', 8); y += 10;
    }
    y += 6;
    sellos.forEach(([e], i) => {
      if (y + 20 > LIM) { nueva(); }
      T(sx, y, e, 'hb', 6.5, gris); y += 8;
      for (const r of lineas[i]) { if (y > LIM) nueva(); T(sx, y, r, 'h', 5.8, '#444444'); y += 7; }
      y += 6;
    });
    y = Math.max(y, yq + lado + 8);
  } else {
    cabe(20);
    T(M, y, t.sinTimbre, 'hb', 8.5, '#9B2C2C'); y += 14;
  }
  pag.forEach((p, i) => {
    p.piezas.push({ t: 'texto', x: M, y: H - 26, s: t.representacion, f: 'h', tam: 6.8, color: gris });
    p.piezas.push({ t: 'texto', x: W / 2, y: H - 14, s: PIE, f: 'h', tam: 6.5, color: '#8C8C8C', ancla: 'c' });
    p.piezas.push({ t: 'texto', x: W - M, y: H - 26, s: `${i + 1} / ${pag.length}`, f: 'h', tam: 6.8, color: gris, ancla: 'd' });
  });
  return pag;
}

// ---------- vista en pantalla ----------
function svgQR(q) {
  let s = '';
  for (const [x, y, w] of modulos(q, 0, 0, q.tam)[0].lista) s += `M${x} ${y}h${w}v1h-${w}z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${q.tam + 4} ${q.tam + 4}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${q.tam + 4}" height="${q.tam + 4}" fill="#fff"/><path d="${s}"/></svg>`;
}

function vistaHtml(d, t) {
  const m = d.moneda;
  const dl = (pares) => h('dl', { class: 'acfdi-dl' }, pares.filter(([, v]) => v).flatMap(([e, v]) => [h('dt', { text: e }), h('dd', { text: v })]));
  const tabla = (cols, filas, clase) => h('div', { class: 'acfdi-tabla-caja' }, h('table', { class: 'acfdi-tabla ' + (clase || '') },
    h('thead', {}, h('tr', {}, cols.map((c) => h('th', { scope: 'col', text: c })))),
    h('tbody', {}, filas.map((f) => h('tr', {}, f.map((v) => (v instanceof Node ? h('td', {}, v) : h('td', { text: v }))))))));
  const folio = [d.serie, d.folio].filter(Boolean).join('-');
  const partes = [
    h('div', { class: 'acfdi-cab' },
      h('div', {}, h('p', { class: 'acfdi-emisor', text: d.emisor.nombre || d.emisor.rfc }),
        h('p', { class: 'acfdi-gris', text: `${t.rfc} ${d.emisor.rfc}${d.emisor.regimen ? ' · ' + conNombre('regimen', d.emisor.regimen) : ''}` })),
      h('div', { class: 'acfdi-tipo' }, h('p', { text: `CFDI ${CAT.tipo[d.tipo] || d.tipo} · ${t.version} ${d.version}` }),
        folio ? h('p', { class: 'acfdi-gris', text: `${t.serieFolio} ${folio}` }) : null,
        h('p', { class: 'acfdi-gris', text: fechaHora(d.fecha) }))),
    h('div', { class: 'acfdi-dos' },
      h('section', {}, h('h4', { text: t.receptor }), dl([['Nombre', d.receptor.nombre], [t.rfc, d.receptor.rfc], [t.domicilio, d.receptor.domicilio],
        [t.regimen, conNombre('regimen', d.receptor.regimen)], [t.uso, conNombre('uso', d.receptor.uso)]])),
      h('section', {}, h('h4', { text: 'Comprobante' }), dl([[t.lugar, d.lugar], [t.formaPago, conNombre('forma', d.formaPago)],
        [t.metodoPago, conNombre('metodo', d.metodoPago)], [t.moneda, d.moneda + (d.tipoCambio && d.tipoCambio !== '1' ? ` · ${d.tipoCambio}` : '')],
        [t.condiciones, d.condiciones], [t.exportacion, conNombre('exportacion', d.exportacion)]]))),
  ];
  for (const r of d.relacionados) partes.push(h('section', {}, h('h4', { text: t.relacionados }), dl([['Tipo de relación', conNombre('relacion', r.tipo)], ['UUID', r.uuids.join(', ')]])));
  partes.push(h('section', {}, h('h4', { text: `${t.conceptos} (${d.conceptos.length})` }),
    tabla(t.cols, d.conceptos.map((k) => {
      const imp = [...k.impuestos.traslados.map((x) => `Traslado ${nombreImp(x)} ${tasa(x)}: ${dinero(x.importe, m)}`),
        ...k.impuestos.retenciones.map((x) => `Retención ${nombreImp(x)}: ${dinero(x.importe, m)}`)];
      return [cantidad(k.cantidad), [k.claveUnidad, k.unidad].filter(Boolean).join(' '), k.clave,
        h('span', {}, k.descripcion, ...imp.map((s) => h('small', { text: s }))), dinero(k.valorUnitario, m), dinero(k.importe, m)];
    }))));
  if (d.pagos.length) {
    partes.push(h('section', {}, h('h4', { text: t.pagos }), tabla(t.pagoCols, d.pagos.flatMap((p) => (p.docs.length ? p.docs : [{}]).map((doc) => [
      fechaHora(p.fecha), conNombre('forma', p.forma), dinero(p.monto, p.moneda), [doc.serie, doc.folio].filter(Boolean).join('-') || doc.id || '',
      doc.parcialidad || '', dinero(doc.pagado, p.moneda), dinero(doc.saldo, p.moneda)])))));
  }
  const tot = [[t.subtotal, dinero(d.subtotal, m)]];
  if (d.descuento && Number(d.descuento)) tot.push([t.descuento, '-' + dinero(d.descuento, m)]);
  for (const x of d.impuestos.traslados) tot.push([`${nombreImp(x)} trasladado ${tasa(x)}`, dinero(x.importe, m)]);
  for (const x of d.impuestos.retenciones) tot.push([`${nombreImp(x)} retenido`, '-' + dinero(x.importe, m)]);
  partes.push(h('div', { class: 'acfdi-dos acfdi-cierre' },
    h('div', {}, letraDe(d) ? h('h4', { text: t.conLetra }) : null, letraDe(d) ? h('p', { text: letraDe(d) }) : null,
      d.otros.length ? h('p', { class: 'acfdi-gris', text: `${t.complementos}: ${d.otros.join(', ')}` }) : null),
    h('div', { class: 'acfdi-totales' }, tot.map(([e, v]) => h('p', {}, h('span', { text: e }), h('span', { text: v }))),
      h('p', { class: 'acfdi-total' }, h('span', { text: t.total }), h('span', { text: dinero(d.total, m) })))));
  if (d.timbre) {
    const q = ligaSat(d) ? generarQR(ligaSat(d), { nivel: 'M' }) : null;
    const qrEl = h('div', { class: 'acfdi-qr', role: 'img', 'aria-label': t.verificar });
    if (q) qrEl.innerHTML = svgQR(q);
    partes.push(h('section', { class: 'acfdi-timbre' }, qrEl,
      h('div', {}, h('h4', { text: t.timbre }), dl([[t.uuid, d.timbre.uuid], [t.fechaTimbrado, fechaHora(d.timbre.fecha)],
        [t.certSat, d.timbre.noCertSat], [t.certEmisor, d.noCertificado], [t.provCert, d.timbre.rfcProv]]),
      h('details', { class: 'acfdi-sellos' }, h('summary', { text: t.sellos }),
        dl([[t.selloCfd, d.timbre.selloCfd || d.sello], [t.selloSat, d.timbre.selloSat], [t.cadena, cadenaTimbre(d.timbre)]])))));
  } else partes.push(h('p', { class: 'acfdi-alerta', text: t.sinTimbre }));
  return h('article', { class: 'acfdi-hoja' }, partes);
}

// ---------- herramienta ----------
export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-una acfdi', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const abiertos = [];
  let actual = -1;
  const est = estado();
  const errores = h('div', { class: 'acfdi-errores', 'aria-live': 'polite' });
  const entrada = h('input', { type: 'file', accept: '.xml,text/xml,application/xml', multiple: true, class: 'ah-archivo', 'aria-label': t.elegir });
  const zona = h('div', { class: 'ah-soltar acfdi-zona' },
    h('p', { class: 'acfdi-soltar', text: t.soltar }), entrada, h('p', { class: 'ah-nota', text: t.privado }));
  const lista = h('div', { class: 'acfdi-lista', hidden: true });
  const vista = h('div', { class: 'acfdi-vista' });
  const bPdf = boton(t.pdf, () => {
    const a = abiertos[actual];
    if (!a) return;
    descargar(pdfDe(a.datos), `${nombreArchivo(a.nombre.replace(/\.xml$/i, ''))}.pdf`);
    est.decir(t.descargado);
    avisar(contenedor, ID, 'descargar');
  });
  const bSat = h('a', { class: 'ah-boton ah-boton-2', target: '_blank', rel: 'noopener', text: t.verificar });
  const acciones = h('div', { class: 'acfdi-acciones', hidden: true },
    h('div', { class: 'ah-acciones' }, bPdf, bSat), est, h('p', { class: 'ah-nota', text: t.nota }), h('p', { class: 'ah-nota', text: t.verificarNota }));

  function pdfDe(d) {
    let qr = null;
    try { qr = d.timbre ? generarQR(ligaSat(d), { nivel: 'M' }) : null; } catch (e) { qr = null; }
    return pdf(maquetarCfdi(d, t, qr), { titulo: `CFDI ${d.timbre ? d.timbre.uuid : d.folio}`, autor: d.emisor.nombre });
  }

  function mostrar(i) {
    actual = i;
    const a = abiertos[i];
    vista.textContent = '';
    vista.append(vistaHtml(a.datos, t));
    const liga = ligaSat(a.datos);
    bSat.hidden = !liga;
    if (liga) bSat.href = liga;
    acciones.hidden = false;
    lista.hidden = abiertos.length < 2;
    lista.textContent = '';
    if (abiertos.length > 1) {
      lista.append(h('p', { class: 'ah-etiqueta', text: t.archivos }), h('div', { class: 'ah-acciones' }, abiertos.map((x, k) =>
        h('button', { type: 'button', class: 'ah-boton ah-boton-2 acfdi-archivo', 'aria-pressed': String(k === i), text: x.nombre, onclick: () => mostrar(k) }))));
    }
  }

  async function abrir(archivos) {
    errores.textContent = '';
    const antes = abiertos.length;
    for (const f of archivos) {
      const texto = await f.text();
      const datos = leerCfdi(texto);
      if (!datos.ok) { errores.append(h('p', { class: 'ah-error', text: datos.error === 'xml' ? t.errXml(f.name) : t.errCfdi(f.name) })); continue; }
      abiertos.push({ nombre: f.name, datos });
    }
    if (abiertos.length > antes) { mostrar(antes); avisar(contenedor, ID, 'leer'); }
  }
  entrada.addEventListener('change', () => { abrir([...entrada.files]); entrada.value = ''; });
  zona.addEventListener('dragover', (e) => { e.preventDefault(); zona.classList.add('ah-encima'); });
  zona.addEventListener('dragleave', () => zona.classList.remove('ah-encima'));
  zona.addEventListener('drop', (e) => { e.preventDefault(); zona.classList.remove('ah-encima'); abrir([...e.dataTransfer.files]); });

  raiz.append(h('div', { class: 'ah-columna' }, zona, errores, lista), h('div', { class: 'ah-vista' }, vista, acciones));
  raiz.acfdi = { abrir, abiertos, pdfDe, actual: () => abiertos[actual] };
  return { destruir() { contenedor.textContent = ''; } };
}

function cssPropio() {
  if (document.querySelector('link[data-acfdi-css], link[href*="herramientas/visor-cfdi.css"]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/visor-cfdi.css', import.meta.url).href;
  l.dataset.acfdiCss = '1';
  document.head.appendChild(l);
}
