// Herramienta «whatsapp-link» de Avelina: liga wa.me con mensaje y su QR.
// montar(contenedor, { modo: 'link' | 'qr', idioma: 'es-MX', textos })

import { vistaQR, TEXTOS as TEXTOS_QR } from './qr.js';
import {
  h, campo, textos as unirTextos, avisar, copiar, estado, boton, asegurarEstilos,
  numeroWhatsApp, ligaWhatsApp,
} from './_comun.js';

const ID = 'whatsapp-link';

export const TEXTOS = {
  lada: 'Lada',
  ladaAyuda: 'México es 52.',
  numero: 'Tu número de WhatsApp',
  numeroAyuda: '10 dígitos, con o sin espacios.',
  numeroEjemplo: '33 1234 5678',
  numeroMal: 'Revisa el número. En México son 10 dígitos.',
  numeroMalOtro: 'Revisa el número y la lada.',
  mensaje: 'Mensaje que ya va escrito (opcional)',
  mensajeEjemplo: 'Hola, vi tu página y quiero información',
  mensajeAyuda: 'Quien abra la liga lo verá listo para mandar. Lo puede cambiar.',
  ligaTitulo: 'Tu liga',
  ligaVacia: 'Escribe tu número y aquí sale tu liga.',
  copiar: 'Copiar liga',
  copiado: 'Liga copiada.',
  noCopiado: 'No se pudo copiar. Selecciona la liga y cópiala.',
  probar: 'Probar liga',
  qrTitulo: 'QR de tu liga',
  usos: 'Pégala en tu Instagram, en tu Facebook o en tu página. Imprime el QR en tu mostrador.',
};

export function montar(contenedor, opciones = {}) {
  asegurarEstilos();
  const t = unirTextos(TEXTOS, opciones);
  const tq = Object.assign({}, TEXTOS_QR, (opciones.textos && opciones.textos.qr) || {});
  const modo = opciones.modo === 'qr' ? 'qr' : 'link';
  const datos = { lada: '52', numero: '', mensaje: '' };

  contenedor.textContent = '';
  const raiz = h('div', { class: 'ah ah-wa', lang: opciones.idioma || 'es-MX' });
  contenedor.append(raiz);

  const lada = h('input', { type: 'text', class: 'ah-input', inputmode: 'numeric', maxlength: 4, autocomplete: 'off', value: datos.lada });
  const numero = h('input', { type: 'tel', class: 'ah-input', inputmode: 'tel', autocomplete: 'tel-national', placeholder: t.numeroEjemplo });
  const mensaje = h('textarea', { class: 'ah-input', rows: 4, placeholder: t.mensajeEjemplo });
  const error = h('p', { class: 'ah-error', hidden: true });
  for (const [el, k] of [[lada, 'lada'], [numero, 'numero'], [mensaje, 'mensaje']]) {
    el.addEventListener('input', () => { datos[k] = el.value; actualizar(); });
  }
  const campoLada = campo(t.lada, lada, t.ladaAyuda);
  campoLada.classList.add('ah-campo-lada');

  const salida = h('p', { class: 'ah-salida', 'aria-live': 'polite' });
  const est = estado();
  let liga = '';
  const bCopiar = boton(t.copiar, async () => {
    if (!liga) return;
    const ok = await copiar(liga);
    est.decir(ok ? t.copiado : t.noCopiado);
    if (ok) avisar(contenedor, ID, 'copiar');
  });
  const bProbar = h('a', { class: 'ah-boton ah-boton-2', target: '_blank', rel: 'noopener', text: t.probar });

  const qr = vistaQR(contenedor, { herramienta: ID, textos: tq, nombre: 'qr-whatsapp' });

  const bloqueLiga = h('div', { class: 'ah-vista' },
    h('h3', { class: 'ah-titulo-vista', text: t.ligaTitulo }), salida,
    h('div', { class: 'ah-acciones' }, bCopiar, bProbar), est,
    h('p', { class: 'ah-nota', text: t.usos }));
  const bloqueQr = h('div', { class: 'ah-vista' }, h('h3', { class: 'ah-titulo-vista', text: t.qrTitulo }), qr.el);

  const columna = h('div', { class: 'ah-columna' },
    h('div', { class: 'ah-fila ah-fila-lada' }, campoLada, campo(t.numero, numero, t.numeroAyuda)),
    error,
    campo(t.mensaje, mensaje, t.mensajeAyuda));
  const derecha = h('div', { class: 'ah-vista' }, ...(modo === 'qr' ? [bloqueQr, bloqueLiga] : [bloqueLiga, bloqueQr]));
  derecha.style.gap = '36px';
  raiz.append(columna, derecha);

  function actualizar() {
    const n = numeroWhatsApp(datos.lada, datos.numero);
    const hay = datos.numero.replace(/\D/g, '').length > 0;
    liga = hay && n.valido ? ligaWhatsApp(n.completo, datos.mensaje) : '';
    error.hidden = !hay || n.valido;
    error.textContent = n.completo.startsWith('52') && (datos.lada || '52').replace(/\D/g, '') === '52' ? t.numeroMal : t.numeroMalOtro;
    numero.setAttribute('aria-invalid', String(hay && !n.valido));
    salida.textContent = liga || t.ligaVacia;
    salida.classList.toggle('ah-nota', !liga);
    bCopiar.disabled = !liga;
    if (liga) bProbar.href = liga; else bProbar.removeAttribute('href');
    bProbar.setAttribute('aria-disabled', String(!liga));
    qr.actualizar(liga, 'qr-whatsapp-' + (n.local || ''));
  }
  actualizar();
  return { destruir() { contenedor.textContent = ''; } };
}
