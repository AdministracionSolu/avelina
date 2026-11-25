// Herramienta «texto-legal» de Avelina: aviso de privacidad, términos y condiciones y política de devoluciones.
// montar(contenedor, { modo: 'aviso-privacidad' | 'terminos' | 'devoluciones', idioma: 'es-MX', textos })
// Formulario corto → texto completo para copiar, bajar en PDF o en HTML. Sin red. Lo escrito se guarda en el equipo.
// Fuentes leídas en diputados.gob.mx (texto vigente consultado el 12-nov-2026):
//   LFPDPPP nueva, DOF 20-03-2025, última reforma DOF 14-11-2025: arts. 2, 7, 8, 15, 16, 18, 28, 31, 34, 36, 39, 40.
//   LFPC, última reforma DOF 12-12-2025: arts. 7, 7 BIS, 51, 53, 56, 76 BIS, 77, 92, 92 BIS, 92 TER, 93.

import { h, campo, textos as unirTextos, avisar, copiar, descargar, estado, boton, asegurarEstilos, opcionesChip, nombreArchivo, PIE } from './_comun.js';
import { pdf, partir, CARTA } from './_pdf.js';

const ID = 'texto-legal';
const LEY_DATOS = 'Ley Federal de Protección de Datos Personales en Posesión de los Particulares';
const LEY_CONSUMIDOR = 'Ley Federal de Protección al Consumidor';
const AUTORIDAD = 'Secretaría Anticorrupción y Buen Gobierno';
const HUECO = '⁣';

export const TEXTOS = {
  aviso: 'Es un modelo. Revísalo con tu abogado antes de publicarlo.',
  datosNegocio: 'Datos de tu negocio',
  nombre: 'Nombre del negocio o razón social',
  nombreEjemplo: 'Pollos Ramírez',
  domicilio: 'Domicilio',
  domicilioEjemplo: 'Av. Juárez 120, Centro, 63000 Tepic, Nayarit',
  correo: 'Correo de contacto',
  correoEjemplo: 'hola@tunegocio.mx',
  telefono: 'Teléfono o WhatsApp (opcional)',
  telefonoEjemplo: '311 123 4567',
  sitio: 'Tu página (opcional)',
  sitioEjemplo: 'www.tunegocio.mx',
  falta: 'Para copiar o bajar llena',
  copiarTexto: 'Copiar texto',
  copiarHtml: 'Copiar HTML',
  bajarPdf: 'Bajar PDF',
  bajarHtml: 'Bajar HTML',
  copiado: 'Copiado.',
  copiadoHtml: 'HTML copiado. Pégalo en el editor de tu página en modo código.',
  noCopiado: 'No se pudo copiar. Selecciona el texto y cópialo.',
  vista: 'Vista del texto',
  // aviso de privacidad
  version: 'Versión',
  versiones: { integral: 'Integral', simplificado: 'Simplificado' },
  versionAyuda: 'El integral va en tu página. El simplificado va donde pides datos, como un formulario, con liga al integral.',
  urlAviso: 'Dónde publicarás el aviso integral (opcional)',
  urlAvisoAyuda: 'Si lo dejas vacío usamos tu página con /aviso-de-privacidad.',
  queDatos: 'Datos que pides',
  datos: {
    domicilio: 'Domicilio de entrega',
    fiscales: 'Datos fiscales para facturar',
    pago: 'Datos de pago',
    salud: 'Datos de salud (por ejemplo, alergias o padecimientos)',
    navegacion: 'Datos de navegación (cookies)',
  },
  paraQue: 'Para qué los usas',
  fines: {
    ventas: 'Vender y entregar pedidos',
    citas: 'Agendar citas o servicios',
    cotizaciones: 'Responder dudas y cotizaciones',
    facturacion: 'Facturar',
    garantias: 'Atender cambios, devoluciones y garantías',
  },
  secundarios: 'Usos extra (el cliente puede negarse)',
  fines2: { promociones: 'Mandar promociones y novedades', encuestas: 'Encuestas de satisfacción' },
  transfiere: 'Compartes datos con otras empresas para sus propios fines',
  // términos
  tipoSitio: 'Tu página',
  tipos: { tienda: 'Tienda con pago en línea', pedidos: 'Pedidos por WhatsApp o teléfono', servicios: 'Servicios o citas', informativo: 'Sólo informativa' },
  pagos: 'Formas de pago',
  formasPago: { tarjeta: 'Tarjeta de crédito o débito', transferencia: 'Transferencia', efectivo: 'Efectivo al entregar', tiendas: 'Pago en tiendas de conveniencia' },
  cobertura: 'A dónde entregas (opcional)',
  coberturaEjemplo: 'Toda la República',
  plazo: 'Días hábiles para entregar',
  recurrentes: 'Cobras suscripciones o pagos automáticos',
  jurisdiccion: 'Ciudad y estado para resolver controversias (opcional)',
  jurisdiccionEjemplo: 'Tepic, Nayarit',
  // devoluciones
  diasGusto: 'Días para cambios por gusto',
  diasGustoAyuda: 'Pon 0 si no aceptas cambios por gusto. Los defectos siempre se atienden.',
  queOfreces: 'En cambios por gusto ofreces',
  ofertas: { cambio: 'Cambio por otro producto', vale: 'Saldo a favor', reembolso: 'Reembolso' },
  condiciones: 'Condiciones del cambio por gusto',
  conds: { etiquetas: 'Sin uso y con etiquetas', empaque: 'En su empaque original', ticket: 'Con ticket o comprobante' },
  excluidos: 'No aplica cambio por gusto en',
  excl: { perecederos: 'Alimentos y perecederos', intimos: 'Ropa interior y trajes de baño', medida: 'Productos personalizados o a la medida', higiene: 'Artículos de higiene personal abiertos', digitales: 'Productos digitales ya entregados' },
  envioGusto: 'El envío de un cambio por gusto lo paga',
  pagaEnvio: { cliente: 'El cliente', negocio: 'El negocio' },
  enLinea: 'Vendes en línea o a distancia',
  garantia: 'Días de garantía que das (opcional)',
  garantiaAyuda: 'Si das garantía, la ley pide al menos 90 días.',
  serviciosTambien: 'También das servicios',
  titulos: { 'aviso-privacidad': 'Aviso de privacidad', terminos: 'Términos y condiciones', devoluciones: 'Política de cambios y devoluciones' },
  actualizado: 'Última actualización',
};

// ---------- utilidades ----------
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function fechaLarga(d = new Date()) { return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; }
const limpio = (s, max = 200) => String(s ?? '').replace(/[\u0000-\u001f⁣<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const sinPunto = (s) => s.replace(/[.\s]+$/, '');
function lista(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' y ' + items[items.length - 1];
}
function sitioUrl(s) {
  s = limpio(s, 120).replace(/\s/g, '');
  if (!s) return '';
  return /^https?:\/\//i.test(s) ? s : 'https://' + s;
}
const sinProtocolo = (u) => u.replace(/^https?:\/\//i, '').replace(/\/$/, '');

// Valor de un campo. Si falta y es obligatorio, deja una marca que la vista pinta resaltada.
function dato(st, k, etiqueta, obligatorio = true) {
  const v = limpio(st[k]);
  if (v) return v;
  return obligatorio ? HUECO + etiqueta + HUECO : '';
}

// ---------- contenido ----------
// Bloques: { h1 }, { h2 }, { p }, { ul: [] }. Cada texto es una cadena plana.
function contacto(st, t) {
  const partes = [`el correo ${dato(st, 'correo', t.correo)}`];
  const tel = limpio(st.telefono, 40);
  if (tel) partes.push(`el teléfono ${tel}`);
  return lista(partes);
}

export function avisoIntegral(st, t, hoy) {
  const N = dato(st, 'nombre', t.nombre), D = dato(st, 'domicilio', t.domicilio), C = dato(st, 'correo', t.correo);
  const d = st.datos || {}, f = st.fines || {}, f2 = st.fines2 || {};
  const b = [{ h1: t.titulos['aviso-privacidad'] }, { p: `${t.actualizado}: ${hoy}.` }];
  b.push({ h2: 'Quién es responsable de tus datos' });
  b.push({ p: `${N}, con domicilio en ${sinPunto(D)}, es responsable del tratamiento de tus datos personales. Puedes contactarnos por ${contacto(st, t)}.` });

  b.push({ h2: 'Qué datos personales usamos' });
  const usados = ['Nombre, teléfono y correo electrónico'];
  if (d.domicilio) usados.push('Domicilio para la entrega de pedidos o la prestación del servicio');
  if (d.fiscales) usados.push('Datos fiscales para emitir tu factura, como RFC, régimen fiscal, código postal y uso del comprobante');
  if (d.pago) usados.push('Datos de pago, como la referencia de tu pago o los últimos dígitos de tu tarjeta');
  if (d.navegacion) usados.push('Datos de navegación en nuestra página, como dirección IP, tipo de navegador y páginas visitadas');
  if (d.salud) usados.push('Datos de salud que nos compartas para darte un servicio seguro, como alergias o padecimientos');
  b.push({ ul: usados });
  if (d.salud) {
    b.push({ p: 'Los datos de salud son datos personales sensibles. Sólo los usamos con tu consentimiento expreso y por escrito, que te pediremos antes de tratarlos con tu firma autógrafa o electrónica.' });
  } else {
    b.push({ p: 'No pedimos datos personales sensibles.' });
  }
  if (d.pago) b.push({ p: 'Para usar tus datos de pago te pedimos tu consentimiento expreso. No guardamos el número completo de tu tarjeta. El cobro lo procesa el banco o la plataforma de pago.' });

  b.push({ h2: 'Para qué usamos tus datos' });
  b.push({ p: 'Usamos tus datos para estas finalidades, que son necesarias para darte el servicio que nos pides.' });
  const prim = [];
  if (f.ventas) prim.push('Procesar tus pedidos, cobrarlos y entregarlos');
  if (f.citas) prim.push('Agendar, confirmar y darte seguimiento a tus citas o servicios');
  if (f.cotizaciones) prim.push('Responder tus dudas y enviarte cotizaciones');
  if (f.facturacion) prim.push('Emitir tus facturas');
  if (f.garantias) prim.push('Atender cambios, devoluciones, garantías, quejas y aclaraciones');
  if (!prim.length) prim.push('Atender tus solicitudes y darte el servicio que nos pides');
  b.push({ ul: prim });
  const sec = [];
  if (f2.promociones) sec.push('Enviarte promociones, novedades y avisos de nuestros productos o servicios');
  if (f2.encuestas) sec.push('Pedirte tu opinión sobre la calidad de nuestro servicio');
  if (sec.length) {
    b.push({ p: 'Además, con tu consentimiento, usamos tus datos para estas finalidades que no son necesarias para el servicio.' });
    b.push({ ul: sec });
    b.push({ p: `Si no quieres que usemos tus datos para estas finalidades, escríbenos a ${C} en cualquier momento. Tu negativa no afecta el servicio que nos pides.` });
  }

  b.push({ h2: 'Con quién compartimos tus datos' });
  if (st.transfiere) {
    b.push({ p: `Podemos compartir tus datos con empresas que los usan para sus propios fines, sólo si nos das tu consentimiento. Le daremos a conocer este aviso a quien los reciba, y esa empresa asumirá las mismas obligaciones que nosotros. Si no aceptas esta transferencia, escríbenos a ${C}.` });
  } else {
    b.push({ p: 'No vendemos ni compartimos tus datos con terceros para que los usen en sus propios fines.' });
  }
  b.push({ p: `Para cumplir tu pedido podemos compartir lo necesario con quienes nos ayudan a hacerlo, como empresas de paquetería o de cobro. También podemos transferir tus datos sin tu consentimiento en los casos del artículo 36 de la ${LEY_DATOS}, por ejemplo cuando lo pida una autoridad.` });

  b.push({ h2: 'Cómo limitar el uso de tus datos' });
  b.push({ p: `Puedes pedirnos que dejemos de enviarte promociones o que limitemos el uso de tus datos escribiendo a ${C}. Te responderemos por el mismo medio.` });

  b.push({ h2: 'Tus derechos de acceso, rectificación, cancelación y oposición' });
  b.push({ p: 'Tienes derecho a saber qué datos tenemos de ti y cómo los usamos (acceso), a corregirlos si están mal (rectificación), a pedir que los borremos (cancelación) y a oponerte a su uso (oposición). Estos se conocen como derechos ARCO.' });
  b.push({ p: `Nuestra persona encargada de datos personales atiende estas solicitudes. Para ejercerlos, envía tu solicitud a ${C} con lo siguiente.` });
  b.push({ ul: [
    'Tu nombre y un medio para responderte',
    'Una identificación tuya o, si eres representante, la que acredite tu representación',
    'Qué datos y qué derecho quieres ejercer, descritos con claridad',
    'Cualquier documento que nos ayude a ubicar tus datos',
  ] });
  b.push({ p: 'Te diremos si tu solicitud procede en un plazo máximo de 20 días hábiles desde que la recibamos. Si procede, la haremos efectiva dentro de los 15 días hábiles siguientes. Estos plazos pueden ampliarse una sola vez por un periodo igual cuando el caso lo justifique.' });
  b.push({ p: 'Ejercer estos derechos es gratuito. Sólo podríamos cobrarte el costo de reproducción, copias o envío.' });
  b.push({ p: `También puedes revocar en cualquier momento el consentimiento que nos diste, escribiendo a ${C}. La revocación no tiene efectos hacia atrás. En algunos casos no podremos atenderla de inmediato porque la ley nos obliga a conservar ciertos datos.` });

  if (d.navegacion) {
    b.push({ h2: 'Cookies y tecnologías parecidas' });
    b.push({ p: 'Nuestra página usa cookies para recordar tus preferencias y saber cómo se usa el sitio. Puedes borrarlas o bloquearlas desde la configuración de tu navegador. Algunas partes de la página podrían no funcionar bien sin ellas.' });
  }

  b.push({ h2: 'Cómo cuidamos tus datos' });
  b.push({ p: 'Mantenemos medidas de seguridad administrativas, técnicas y físicas para proteger tus datos contra daño, pérdida, alteración o uso no autorizado. Quienes los manejan en nuestro negocio guardan confidencialidad.' });

  b.push({ h2: 'Cambios a este aviso' });
  const donde = avisoUrl(st);
  b.push({ p: `Si cambiamos este aviso, publicaremos la versión nueva ${donde ? 'en ' + sinProtocolo(donde) : 'en nuestro establecimiento'} con su fecha de actualización.${donde ? '' : ` También te la enviaremos si nos la pides en ${C}.`}` });

  b.push({ h2: 'Autoridad' });
  b.push({ p: `Este aviso se rige por la ${LEY_DATOS}. Si crees que no atendimos bien tu solicitud, puedes acudir a la ${AUTORIDAD}, autoridad encargada de aplicar esa ley.` });
  return b;
}

function avisoUrl(st) {
  const u = limpio(st.urlAviso, 160).replace(/\s/g, '');
  if (u) return /^https?:\/\//i.test(u) ? u : 'https://' + u;
  const s = sitioUrl(st.sitio);
  return s ? s.replace(/\/$/, '') + '/aviso-de-privacidad' : '';
}

export function avisoSimplificado(st, t, hoy) {
  const N = dato(st, 'nombre', t.nombre), D = dato(st, 'domicilio', t.domicilio), C = dato(st, 'correo', t.correo);
  const d = st.datos || {}, f = st.fines || {}, f2 = st.fines2 || {};
  const datos = ['nombre', 'teléfono', 'correo'];
  if (d.domicilio) datos.push('domicilio de entrega');
  if (d.fiscales) datos.push('datos fiscales');
  if (d.pago) datos.push('datos de pago');
  if (d.navegacion) datos.push('datos de navegación');
  if (d.salud) datos.push('datos de salud, que son sensibles');
  const fines = [];
  if (f.ventas) fines.push('procesar y entregar tus pedidos');
  if (f.citas) fines.push('agendar tus citas o servicios');
  if (f.cotizaciones) fines.push('responder tus dudas y cotizaciones');
  if (f.facturacion) fines.push('facturar');
  if (f.garantias) fines.push('atender cambios y garantías');
  if (!fines.length) fines.push('atender tus solicitudes');
  const sec = [];
  if (f2.promociones) sec.push('enviarte promociones');
  if (f2.encuestas) sec.push('pedirte tu opinión');
  const b = [{ h1: t.titulos['aviso-privacidad'] + ' simplificado' }];
  b.push({ p: `${N}, con domicilio en ${sinPunto(D)}, es responsable de tus datos personales.` });
  b.push({ p: `Usamos tu ${lista(datos)} para ${lista(fines)}.` });
  if (sec.length) b.push({ p: `Con tu consentimiento también los usamos para ${lista(sec)}. Si no lo quieres, escríbenos a ${C}.` });
  b.push({ p: st.transfiere
    ? `Podemos compartir tus datos con otras empresas para sus propios fines sólo si lo aceptas. Puedes negarte escribiendo a ${C}.`
    : 'No compartimos tus datos con terceros para sus propios fines.' });
  b.push({ p: `Para limitar el uso de tus datos o ejercer tus derechos de acceso, rectificación, cancelación y oposición, escríbenos a ${C}.` });
  const donde = avisoUrl(st);
  b.push({ p: donde ? `Consulta el aviso de privacidad integral en ${sinProtocolo(donde)}.` : `Pide el aviso de privacidad integral en ${C} o en nuestro domicilio.` });
  b.push({ p: `${t.actualizado}: ${hoy}.` });
  return b;
}

export function terminos(st, t, hoy) {
  const N = dato(st, 'nombre', t.nombre), D = dato(st, 'domicilio', t.domicilio), C = dato(st, 'correo', t.correo);
  const s = sitioUrl(st.sitio);
  const sitio = s ? sinProtocolo(s) : 'nuestra página';
  const tipo = st.tipo || 'tienda';
  const vende = tipo === 'tienda' || tipo === 'pedidos';
  const b = [{ h1: t.titulos.terminos }, { p: `${t.actualizado}: ${hoy}.` }];
  b.push({ h2: 'Quiénes somos' });
  b.push({ p: `${s ? 'La página ' + sitio : 'Esta página'} es de ${N}, con domicilio en ${sinPunto(D)}. Para dudas, aclaraciones o quejas puedes escribirnos o llamarnos por ${contacto(st, t)}.` });
  b.push({ h2: 'Aceptación' });
  b.push({ p: `Al usar ${sitio}${vende ? ' o hacer un pedido' : tipo === 'servicios' ? ' o agendar un servicio' : ''} aceptas estos términos. Si no estás de acuerdo con ellos, te pedimos no usar la página.` });
  b.push({ h2: 'Uso de la página' });
  b.push({ p: 'Te pedimos usar la página de buena fe. No está permitido usarla para fines ilegales, intentar dañarla ni dar datos falsos.' });

  if (tipo !== 'informativo') {
    b.push({ h2: tipo === 'servicios' ? 'Servicios y precios' : 'Productos y precios' });
    b.push({ p: 'Los precios están en pesos mexicanos. El precio que te mostramos es el total a pagar, con impuestos y cargos incluidos. El costo de envío, si lo hay, te lo decimos antes de que confirmes.' });
    b.push({ p: `Respetamos el precio, las condiciones y las promociones que te ofrecimos al momento de tu ${tipo === 'servicios' ? 'reservación' : 'pedido'}. Las fotos son ilustrativas y buscamos que muestren el producto o servicio como es.` });
    b.push({ h2: tipo === 'servicios' ? 'Reservaciones y pagos' : 'Pedidos y pagos' });
    if (tipo === 'tienda') b.push({ p: 'Antes de pagar puedes revisar tu pedido, las cantidades y el total. Tu pedido queda confirmado cuando recibimos el pago. Te enviamos un comprobante por correo o mensaje.' });
    else if (tipo === 'pedidos') b.push({ p: 'Los pedidos se hacen por mensaje o por teléfono. Antes de confirmar te decimos el total, la forma de pago y la fecha de entrega. Tu pedido queda confirmado cuando lo aceptas.' });
    else b.push({ p: 'Al agendar te decimos el precio, la fecha y lo que incluye el servicio. Si necesitas cambiar o cancelar tu cita, avísanos con anticipación por los medios de contacto de esta página.' });
    const fp = Object.entries(t.formasPago).filter(([k]) => st.pagos && st.pagos[k]).map(([, v]) => v.toLowerCase());
    if (fp.length) b.push({ p: `Aceptamos ${lista(fp)}.` });
    if (st.pagos && st.pagos.tarjeta) b.push({ p: 'Los pagos con tarjeta los procesa el banco o la plataforma de pago. No guardamos el número completo de tu tarjeta.' });
  }

  if (vende) {
    b.push({ h2: 'Envíos y entregas' });
    const cob = limpio(st.cobertura, 80);
    const dias = Math.max(1, Math.min(60, parseInt(st.plazo, 10) || 5));
    b.push({ p: `${cob ? `Entregamos en ${sinPunto(cob)}. ` : ''}La fecha aproximada de entrega es de ${dias} días hábiles después de confirmar tu pedido. Antes de confirmar te informamos el precio, el costo de envío y, si aplica, el del seguro.` });
    b.push({ p: 'Si tu paquete llega dañado o incompleto, avísanos pronto con fotos para resolverlo.' });
    b.push({ h2: 'Cambios, devoluciones y garantías' });
    b.push({ p: `Las compras hechas fuera de nuestro establecimiento, como las de esta página, se perfeccionan a los cinco días hábiles de la entrega. En ese plazo puedes revocar tu compra sin responsabilidad, como marca el artículo 56 de la ${LEY_CONSUMIDOR}. Te devolvemos lo que pagaste y el flete y seguro de la devolución corren por tu cuenta. Esto no aplica a perecederos recibidos y pagados de contado.` });
    b.push({ p: `Si el producto llega con defecto o no es lo que te ofrecimos, puedes elegir que lo cambiemos o te devolvamos tu dinero, además de una bonificación, conforme a los artículos 92 y 92 TER de la misma ley. Los detalles están en nuestra política de cambios y devoluciones.` });
  }

  if (st.recurrentes) {
    b.push({ h2: 'Suscripciones y cobros automáticos' });
    b.push({ p: 'Si contratas una suscripción, te decimos de forma clara cada cuánto se cobra, el monto y la fecha de cobro. El cobro automático sólo se hace con tu consentimiento expreso.' });
    b.push({ p: `Si tu suscripción se renueva sola, te avisamos al menos cinco días naturales antes, y puedes cancelarla sin penalización. También puedes cancelar en cualquier momento escribiendo a ${C}, como marca el artículo 76 BIS de la ${LEY_CONSUMIDOR}.` });
  }

  b.push({ h2: 'Datos personales' });
  b.push({ p: 'Usamos tus datos sólo como lo explica nuestro aviso de privacidad. Tratamos con confidencialidad la información que nos das y no la pasamos a otros proveedores sin tu autorización.' });
  b.push({ h2: 'Contenido de la página' });
  b.push({ p: `Los textos, fotos, logotipos y diseños de esta página son de ${N} o se usan con permiso. No puedes copiarlos para fines comerciales sin nuestra autorización por escrito.` });
  b.push({ h2: 'Ligas a otros sitios' });
  b.push({ p: 'La página puede tener ligas a sitios de otras personas, como redes sociales o mapas. No controlamos esos sitios y te recomendamos leer sus propios términos.' });
  b.push({ h2: 'Quejas' });
  b.push({ p: `Si tienes una queja, escríbenos a ${C} y te responderemos lo antes posible. También puedes acudir a la Procuraduría Federal del Consumidor.` });
  b.push({ h2: 'Cambios a estos términos' });
  b.push({ p: 'Podemos actualizar estos términos. La versión vigente es la publicada en la página con su fecha. Los pedidos ya confirmados se rigen por los términos vigentes cuando los hiciste.' });
  b.push({ h2: 'Ley aplicable' });
  const ciudad = limpio(st.jurisdiccion, 80);
  b.push({ p: `Estos términos se rigen por las leyes de México, en especial la ${LEY_CONSUMIDOR}. Para resolver cualquier controversia, las partes se someten a los tribunales competentes de ${ciudad ? sinPunto(ciudad) : 'nuestro domicilio'}, sin perjuicio de tu derecho a acudir a la Procuraduría Federal del Consumidor.` });
  return b;
}

export function devoluciones(st, t, hoy) {
  const N = dato(st, 'nombre', t.nombre), C = dato(st, 'correo', t.correo), D = dato(st, 'domicilio', t.domicilio);
  const dias = Math.max(0, Math.min(365, parseInt(st.diasGusto, 10) || 0));
  const b = [{ h1: t.titulos.devoluciones }, { p: `${t.actualizado}: ${hoy}.` }];
  b.push({ p: `Esta política explica cómo hacer un cambio o una devolución en ${N}. Tus derechos como consumidor no cambian por ella.` });

  b.push({ h2: 'Cambios por gusto' });
  if (dias > 0) {
    const of = Object.entries(t.ofertas).filter(([k]) => st.ofertas && st.ofertas[k]).map(([, v]) => v.toLowerCase());
    b.push({ p: `Si el producto no te convenció, tienes ${dias} días naturales desde que lo recibiste para cambiarlo.${of.length ? ` Te ofrecemos ${lista(of)}.` : ''}` });
    const cond = [];
    if (st.conds && st.conds.etiquetas) cond.push('sin uso, con sus etiquetas');
    if (st.conds && st.conds.empaque) cond.push('en su empaque original');
    if (st.conds && st.conds.ticket) cond.push('con tu ticket o comprobante de compra');
    if (cond.length) b.push({ p: `El producto debe estar ${lista(cond)}.` });
    const ex = Object.entries(t.excl).filter(([k]) => st.excl && st.excl[k]).map(([, v]) => v);
    if (ex.length) {
      b.push({ p: 'Por higiene o por su naturaleza, no aceptamos cambios por gusto en estos productos.' });
      b.push({ ul: ex });
      b.push({ p: 'Si alguno de ellos llega con defecto, sí lo atendemos como se explica abajo.' });
    }
    if (st.enLinea) b.push({ p: st.envioGusto === 'negocio' ? 'Nosotros pagamos el envío de los cambios por gusto.' : 'El envío de un cambio por gusto corre por tu cuenta.' });
  } else {
    b.push({ p: 'No aceptamos cambios por gusto. Revisa bien tu compra antes de pagar. Los productos con defecto sí los atendemos como se explica abajo.' });
  }

  if (st.enLinea) {
    b.push({ h2: 'Compras en línea o a distancia' });
    b.push({ p: `Si compraste por internet, por teléfono o por mensaje, tienes cinco días hábiles desde que recibes el producto para revocar tu compra sin dar razones, como marcan los artículos 51 y 56 de la ${LEY_CONSUMIDOR}. Avísanos por escrito a ${C} o regresa el producto.` });
    b.push({ p: 'Te devolvemos lo que pagaste. El flete y el seguro de esa devolución corren por tu cuenta. Esto no aplica a perecederos que recibiste y pagaste de contado.' });
  }

  b.push({ h2: 'Productos con defecto o distintos a lo ofrecido' });
  b.push({ p: `Si el producto tiene un defecto, no corresponde a la calidad o a las características con que te lo ofrecimos, o la cantidad es menor a la indicada, puedes elegir entre el cambio por uno nuevo igual o la devolución de lo que pagaste. Además te damos una bonificación de al menos 20% del precio pagado, como marcan los artículos 92 y 92 TER de la ${LEY_CONSUMIDOR}.` });
  b.push({ p: 'Puedes reclamar dentro de los dos meses siguientes a que recibiste el producto, siempre que no se haya alterado por mal uso. Resolvemos tu reclamación en un plazo máximo de 15 días desde que la recibimos.' });
  b.push({ p: 'Te devolvemos el dinero por la misma forma de pago con la que compraste, salvo que aceptes otra al momento de la devolución.' });
  if (st.enLinea) b.push({ p: 'Si el producto tiene defecto o lo reparamos por garantía, nosotros pagamos el envío.' });

  const g = parseInt(st.garantia, 10);
  if (g > 0) {
    const dg = Math.max(90, Math.min(3650, g));
    b.push({ h2: 'Garantía' });
    b.push({ p: `Nuestros productos tienen una garantía de ${dg} días naturales desde la entrega. Cubre defectos de fabricación y no cubre el daño por mal uso, golpes o accidentes.` });
    b.push({ p: `Para hacerla válida, escríbenos a ${C} con tu comprobante y una descripción del problema.` });
  }

  if (st.serviciosTambien) {
    b.push({ h2: 'Servicios' });
    b.push({ p: `Si un servicio no se presta o se presta de forma deficiente por causas nuestras, tienes derecho a una bonificación o compensación de al menos 20% del precio pagado, conforme a los artículos 92 BIS y 92 TER de la ${LEY_CONSUMIDOR}.` });
  }

  b.push({ h2: 'Cómo pedir un cambio o una devolución' });
  b.push({ ol: [
    `Escríbenos a ${C}${limpio(st.telefono, 40) ? ` o al ${limpio(st.telefono, 40)}` : ''} con tu nombre y tu número de pedido o ticket.`,
    'Cuéntanos qué pasó y, si hay un defecto, mándanos fotos.',
    'Te decimos cómo regresar el producto y en cuánto tiempo recibes tu cambio o tu dinero.',
  ] });
  b.push({ p: `También puedes acudir a nuestro domicilio en ${sinPunto(D)}. Si no quedas conforme, puedes acudir a la Procuraduría Federal del Consumidor.` });
  return b;
}

export function armar(modo, st, t, hoy = fechaLarga()) {
  if (modo === 'terminos') return terminos(st, t, hoy);
  if (modo === 'devoluciones') return devoluciones(st, t, hoy);
  return st.version === 'simplificado' ? avisoSimplificado(st, t, hoy) : avisoIntegral(st, t, hoy);
}

// Campos que faltan: si hay alguno, no se copia ni se baja.
export function faltantes(bloques) {
  const set = new Set();
  const re = new RegExp(HUECO + '([^' + HUECO + ']+)' + HUECO, 'g');
  for (const x of bloques) for (const s of [x.h1, x.h2, x.p, ...(x.ul || []), ...(x.ol || [])]) {
    if (s) for (const m of String(s).matchAll(re)) set.add(m[1]);
  }
  return [...set];
}

// ---------- salidas ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function aTexto(bloques) {
  const out = [];
  for (const x of bloques) {
    if (x.h1) out.push(x.h1.toUpperCase(), '');
    else if (x.h2) out.push(x.h2, '');
    else if (x.p) out.push(x.p, '');
    else if (x.ul) out.push(...x.ul.map((s) => '- ' + s), '');
    else if (x.ol) out.push(...x.ol.map((s, i) => `${i + 1}. ${s}`), '');
  }
  return out.join('\n').trim() + '\n';
}
export function aHtml(bloques) {
  const out = [];
  for (const x of bloques) {
    if (x.h1) out.push(`<h1>${esc(x.h1)}</h1>`);
    else if (x.h2) out.push(`<h2>${esc(x.h2)}</h2>`);
    else if (x.p) out.push(`<p>${esc(x.p)}</p>`);
    else if (x.ul) out.push('<ul>\n' + x.ul.map((s) => `  <li>${esc(s)}</li>`).join('\n') + '\n</ul>');
    else if (x.ol) out.push('<ol>\n' + x.ol.map((s) => `  <li>${esc(s)}</li>`).join('\n') + '\n</ol>');
  }
  return out.join('\n');
}
export function documentoHtml(bloques, titulo) {
  return `<!doctype html>\n<html lang="es-MX">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${esc(titulo)}</title>\n` +
    '<style>body{font:16px/1.6 Georgia,"Times New Roman",serif;color:#1a1a1a;max-width:720px;margin:40px auto;padding:0 20px}h1{font-size:28px;line-height:1.2}h2{font-size:19px;margin-top:32px}</style>\n' +
    `</head>\n<body>\n${aHtml(bloques)}\n</body>\n</html>\n`;
}

// PDF carta: títulos en negrita, renglones partidos con _pdf.js y pie gris en cada hoja.
export function aPdf(bloques, titulo) {
  const W = CARTA.w, H = CARTA.h, M = 64, ANCHO = W - 2 * M, LIM = H - 70;
  const escenas = [];
  let e, y;
  const nueva = () => { e = { w: W, h: H, piezas: [] }; escenas.push(e); y = M; };
  nueva();
  const renglones = (s, f, tam, lh, x = M, ancho = ANCHO, antes = 0, pref = '') => {
    const rs = partir(s, f, tam, ancho);
    if (y + antes + lh > LIM) nueva(); else y += antes;
    rs.forEach((r, i) => {
      if (y + lh > LIM) nueva();
      if (i === 0 && pref) e.piezas.push({ t: 'texto', x: x - 14, y: y + tam, s: pref, f: 'h', tam, color: '#1a1a1a' });
      e.piezas.push({ t: 'texto', x, y: y + tam, s: r, f, tam, color: '#1a1a1a' });
      y += lh;
    });
  };
  for (const x of bloques) {
    if (x.h1) renglones(x.h1, 'hb', 20, 26, M, ANCHO, 0);
    else if (x.h2) { if (y + 60 > LIM) nueva(); renglones(x.h2, 'hb', 12.5, 17, M, ANCHO, 12); y += 3; }
    else if (x.p) { renglones(x.p, 'h', 10.5, 15, M, ANCHO, 0); y += 7; }
    else if (x.ul || x.ol) {
      (x.ul || x.ol).forEach((s, i) => renglones(s, 'h', 10.5, 15, M + 16, ANCHO - 16, 0, x.ul ? '•' : `${i + 1}.`));
      y += 7;
    }
  }
  escenas.forEach((es, i) => {
    es.piezas.push({ t: 'texto', x: M, y: H - 36, s: PIE, f: 'h', tam: 8, color: '#8c8c8c' });
    es.piezas.push({ t: 'texto', x: W - M, y: H - 36, s: `${i + 1} de ${escenas.length}`, f: 'h', tam: 8, color: '#8c8c8c', ancla: 'd' });
  });
  return pdf(escenas, { titulo });
}

// ---------- interfaz ----------
const CLAVE = 'avelina:texto-legal:';
function leer(k) { try { return JSON.parse(localStorage.getItem(CLAVE + k) || 'null'); } catch (e) { return null; } }
function guardar(k, v) { try { localStorage.setItem(CLAVE + k, JSON.stringify(v)); } catch (e) { /* sin acceso */ } }

function cssPropio() {
  if (document.querySelector('link[data-ah-css-texto-legal]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../../css/herramientas/texto-legal.css', import.meta.url).href;
  l.setAttribute('data-ah-css-texto-legal', '1');
  document.head.appendChild(l);
}

export const PREDETERMINADO = {
  version: 'integral', urlAviso: '',
  datos: { domicilio: true, fiscales: false, pago: false, salud: false, navegacion: true },
  fines: { ventas: true, citas: false, cotizaciones: true, facturacion: false, garantias: true },
  fines2: { promociones: true, encuestas: false }, transfiere: false,
  tipo: 'tienda', pagos: { tarjeta: true, transferencia: true, efectivo: false, tiendas: false }, cobertura: '', plazo: '5', recurrentes: false, jurisdiccion: '',
  diasGusto: '30', ofertas: { cambio: true, vale: true, reembolso: false }, conds: { etiquetas: true, empaque: false, ticket: true },
  excl: { perecederos: false, intimos: false, medida: true, higiene: false, digitales: false }, envioGusto: 'cliente', enLinea: true, garantia: '', serviciosTambien: false,
};

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  cssPropio();
  const t = unirTextos(TEXTOS, opciones);
  const modo = ['aviso-privacidad', 'terminos', 'devoluciones'].includes(opciones.modo) ? opciones.modo : 'aviso-privacidad';
  const base = JSON.parse(JSON.stringify(PREDETERMINADO));
  const st = Object.assign(base, { nombre: '', domicilio: '', correo: '', telefono: '', sitio: '' }, leer('negocio') || {}, leer(modo) || {});
  for (const k of ['datos', 'fines', 'fines2', 'pagos', 'ofertas', 'conds', 'excl']) st[k] = Object.assign({}, PREDETERMINADO[k], st[k] || {});

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah atl', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  let tGuardar;
  function cambio() {
    pintar();
    clearTimeout(tGuardar);
    tGuardar = setTimeout(() => {
      const { nombre, domicilio, correo, telefono, sitio } = st;
      guardar('negocio', { nombre, domicilio, correo, telefono, sitio });
      const propio = {};
      for (const k of Object.keys(PREDETERMINADO)) propio[k] = st[k];
      guardar(modo, propio);
    }, 400);
  }
  function texto(k, etiqueta, ph, { tipo = 'text', ayuda, auto, max = 160, modoTeclado } = {}) {
    const el = h('input', { type: tipo, class: 'ah-input', placeholder: ph || '', autocomplete: auto || 'off', maxlength: max, inputmode: modoTeclado, value: st[k] || '' });
    el.addEventListener('input', () => { st[k] = el.value; cambio(); });
    return campo(etiqueta, el, ayuda);
  }
  function casillas(grupo, etiqueta, opcionesT) {
    const fs = h('fieldset', { class: 'ah-chips atl-casillas' }, h('legend', { class: 'ah-etiqueta', text: etiqueta }));
    for (const [k, v] of Object.entries(opcionesT)) {
      const c = h('input', { type: 'checkbox', checked: !!st[grupo][k] });
      c.addEventListener('change', () => { st[grupo][k] = c.checked; cambio(); });
      fs.append(h('label', { class: 'ah-check' }, c, h('span', { text: v })));
    }
    return fs;
  }
  function casilla(k, etiqueta) {
    const c = h('input', { type: 'checkbox', checked: !!st[k] });
    c.addEventListener('change', () => { st[k] = c.checked; cambio(); });
    return h('label', { class: 'ah-check' }, c, h('span', { text: etiqueta }));
  }

  const col = h('div', { class: 'ah-columna' });
  col.append(h('h3', { class: 'ah-titulo-vista', text: t.datosNegocio }),
    texto('nombre', t.nombre, t.nombreEjemplo, { auto: 'organization', max: 120 }),
    texto('domicilio', t.domicilio, t.domicilioEjemplo, { auto: 'street-address', max: 200 }),
    h('div', { class: 'ah-fila' }, texto('correo', t.correo, t.correoEjemplo, { tipo: 'email', auto: 'email', max: 120 }),
      texto('telefono', t.telefono, t.telefonoEjemplo, { tipo: 'tel', auto: 'tel', max: 40 })),
    texto('sitio', t.sitio, t.sitioEjemplo, { auto: 'url', max: 120, modoTeclado: 'url' }));

  if (modo === 'aviso-privacidad') {
    const chips = opcionesChip('version', t.version, Object.entries(t.versiones), st.version, (v) => { st.version = v; cambio(); });
    col.append(chips, h('p', { class: 'ah-ayuda', text: t.versionAyuda }),
      casillas('datos', t.queDatos, t.datos), casillas('fines', t.paraQue, t.fines), casillas('fines2', t.secundarios, t.fines2),
      casilla('transfiere', t.transfiere),
      texto('urlAviso', t.urlAviso, '', { ayuda: t.urlAvisoAyuda, max: 160, modoTeclado: 'url' }));
  } else if (modo === 'terminos') {
    col.append(opcionesChip('tipo', t.tipoSitio, Object.entries(t.tipos), st.tipo, (v) => { st.tipo = v; cambio(); }),
      casillas('pagos', t.pagos, t.formasPago),
      h('div', { class: 'ah-fila' }, texto('cobertura', t.cobertura, t.coberturaEjemplo, { max: 80 }),
        texto('plazo', t.plazo, '5', { tipo: 'number', max: 2, modoTeclado: 'numeric' })),
      casilla('recurrentes', t.recurrentes),
      texto('jurisdiccion', t.jurisdiccion, t.jurisdiccionEjemplo, { max: 80 }));
  } else {
    col.append(texto('diasGusto', t.diasGusto, '30', { tipo: 'number', ayuda: t.diasGustoAyuda, max: 3, modoTeclado: 'numeric' }),
      casillas('ofertas', t.queOfreces, t.ofertas), casillas('conds', t.condiciones, t.conds), casillas('excl', t.excluidos, t.excl),
      casilla('enLinea', t.enLinea),
      opcionesChip('envio', t.envioGusto, Object.entries(t.pagaEnvio), st.envioGusto, (v) => { st.envioGusto = v; cambio(); }),
      texto('garantia', t.garantia, '90', { tipo: 'number', ayuda: t.garantiaAyuda, max: 4, modoTeclado: 'numeric' }),
      casilla('serviciosTambien', t.serviciosTambien));
  }
  raiz.append(col);

  const est = estado();
  const falta = h('p', { class: 'ah-error', hidden: true });
  const hoja = h('article', { class: 'atl-hoja', 'aria-label': t.vista, tabindex: '0' });
  let bloques = [];
  const titulo = () => (modo === 'aviso-privacidad' && st.version === 'simplificado' ? t.titulos[modo] + ' simplificado' : t.titulos[modo]);
  const archivo = () => nombreArchivo(titulo()) + (limpio(st.nombre) ? '-' + nombreArchivo(limpio(st.nombre)) : '');
  const bCopiarT = boton(t.copiarTexto, async () => {
    const ok = await copiar(aTexto(bloques));
    est.decir(ok ? t.copiado : t.noCopiado);
    if (ok) avisar(contenedor, ID, 'copiar');
  });
  const bCopiarH = boton(t.copiarHtml, async () => {
    const ok = await copiar(aHtml(bloques));
    est.decir(ok ? t.copiadoHtml : t.noCopiado, 5000);
    if (ok) avisar(contenedor, ID, 'copiar');
  }, 'ah-boton ah-boton-2');
  const bPdf = boton(t.bajarPdf, () => { descargar(aPdf(bloques, titulo()), archivo() + '.pdf'); avisar(contenedor, ID, 'descargar'); }, 'ah-boton ah-boton-2');
  const bHtml = boton(t.bajarHtml, () => {
    descargar(new Blob([documentoHtml(bloques, titulo())], { type: 'text/html;charset=utf-8' }), archivo() + '.html');
    avisar(contenedor, ID, 'descargar');
  }, 'ah-boton ah-boton-2');
  raiz.append(h('div', { class: 'ah-vista atl-vista' },
    h('p', { class: 'ah-nota atl-aviso', text: t.aviso }),
    h('div', { class: 'ah-acciones' }, bCopiarT, bCopiarH, bPdf, bHtml), falta, est, hoja));

  function pintarTexto(el, s) {
    const partes = String(s).split(HUECO);
    partes.forEach((p, i) => { if (p) el.append(i % 2 ? h('mark', { class: 'atl-falta', text: p }) : p); });
    return el;
  }
  function pintar() {
    bloques = armar(modo, st, t);
    hoja.textContent = '';
    for (const x of bloques) {
      if (x.h1) hoja.append(pintarTexto(h('h3', { class: 'atl-h1' }), x.h1));
      else if (x.h2) hoja.append(pintarTexto(h('h4', { class: 'atl-h2' }), x.h2));
      else if (x.p) hoja.append(pintarTexto(h('p'), x.p));
      else if (x.ul || x.ol) {
        const l = h(x.ul ? 'ul' : 'ol');
        for (const s of x.ul || x.ol) l.append(pintarTexto(h('li'), s));
        hoja.append(l);
      }
    }
    const f = faltantes(bloques);
    falta.hidden = !f.length;
    falta.textContent = f.length ? `${t.falta}: ${lista(f.map((x) => x.toLowerCase()))}.` : '';
    for (const b of [bCopiarT, bCopiarH, bPdf, bHtml]) b.disabled = f.length > 0;
  }
  pintar();
  return { destruir() { contenedor.textContent = ''; }, bloques: () => bloques };
}
