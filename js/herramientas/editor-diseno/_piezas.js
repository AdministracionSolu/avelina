// Piezas que comparten varios modos del editor (listas, renglones, datos de contacto en una línea).

export const renglones = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);

// Lista con marca propia: cuadrito, raya, punto o número.
export function lista(k, o) {
  const out = [];
  let y = o.y;
  const campo = o.campo || 'detalles';
  renglones(o.texto ?? k.d[campo]).forEach((txt, i) => {
    const num = o.marca === 'numero';
    const hueco = o.marca === 'nada' ? 0 : o.tam * (num ? 2.2 : 1.4);
    const el = k.X(txt, { x: o.x + hueco, y, w: o.w - hueco, tam: o.tam, color: o.color, fuente: o.fuente || 'texto', maxLineas: o.maxLineas || 3, id: campo, campo, interlinea: 1.22, alin: o.alin });
    const m = k.medir(el);
    const capY = y + (k.medir(k.X('H', { x: 0, y: 0, tam: m.tam, fuente: el.fuente })).alto) / 2;
    if (num) out.push(k.X(String(i + 1).padStart(2, '0'), { x: o.x, y: y + m.tam * 0.09, tam: m.tam * 0.82, color: o.colorMarca, fuente: 'extra', id: campo }));
    else if (o.marca === 'raya') out.push(k.R(o.x, capY - m.tam * 0.06, m.tam * 0.8, m.tam * 0.12, o.colorMarca, { id: campo }));
    else if (o.marca === 'punto') out.push(k.E(o.x, capY - m.tam * 0.18, m.tam * 0.36, m.tam * 0.36, o.colorMarca, { id: campo }));
    else if (o.marca !== 'nada') out.push(k.R(o.x, capY - m.tam * 0.2, m.tam * 0.4, m.tam * 0.4, o.colorMarca, { id: campo }));
    out.push(el);
    y += m.h + (o.sep ?? o.tam * 0.7);
  });
  return { el: out, y };
}

// «33 1234 5678 · Calle 5 de Mayo 12» en una o dos líneas.
export function enLinea(k, campos, o) {
  const txt = campos.map((c) => k.d[c]).filter((v) => v && String(v).trim()).map((v) => String(v).replace(/\n/g, ', ')).join(o.sep || '  ·  ');
  return k.X(txt, Object.assign({ id: campos.find((c) => k.d[c]) || campos[0], campo: campos.find((c) => k.d[c]), maxLineas: 2 }, o));
}

// Separa «Día | horas» o «Día · horas» o «Día: horas».
export function partir(txt) {
  const m = String(txt).split(/\s*(?:\||·|:(?!\d))\s*/);
  return m.length > 1 ? [m[0], m.slice(1).join(' · ')] : [m[0], ''];
}

export const iniciales = (s) => String(s || '').split(/\s+/).filter((w) => w.length > 2 || /^[A-ZÁÉÍÓÚÑ0-9]/.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
