// Generador de postales: lo que se escribe se queda en el teléfono (nada se manda a ningún servidor).
(() => {
  const gen = document.querySelector('.postal-gen');
  // «Usar esta carta»: pasa la carta de ejemplo al generador
  document.querySelectorAll('[data-usar]').forEach(b => b.addEventListener('click', () => {
    if (!gen) return;
    const fig = b.closest('.f-carta'), f = gen.querySelector('form');
    const ps = [...fig.querySelectorAll('p:not(.para):not(.firma)')].map(p => p.textContent.trim());
    f.texto.value = ps.join('\n\n');
    const para = fig.querySelector('.para'); if (para) f.para.value = para.textContent.replace(/,\s*$/, '');
    f.dispatchEvent(new Event('input')); gen.scrollIntoView({ behavior: 'smooth', block: 'start' }); f.texto.focus({ preventScroll: true });
  }));
  if (!gen) return;
  const f = gen.querySelector('form'), v = gen.querySelector('.pg-vista');
  const pinta = () => {
    v.querySelector('.pg-para').textContent = f.para.value ? f.para.value + ',' : '';
    const t = v.querySelector('.pg-texto'); t.replaceChildren(...f.texto.value.split(/\n\s*\n/).filter(Boolean).map(x => { const p = document.createElement('p'); p.textContent = x; return p; }));
    v.querySelector('.pg-firma').textContent = f.firma.value;
    const msg = [f.para.value && f.para.value + ',', f.texto.value, f.firma.value].filter(Boolean).join('\n\n');
    gen.querySelector('.pg-whatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
    return msg;
  };
  f.addEventListener('input', pinta); pinta();
  gen.querySelector('.pg-copiar').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText(pinta()); e.target.textContent = 'Copiado'; } catch { e.target.textContent = 'No se pudo copiar'; }
    setTimeout(() => (e.target.textContent = 'Copiar el texto'), 2200);
  });
  const carga = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = s; });
  gen.querySelector('.pg-imagen').addEventListener('click', async () => {
    await document.fonts.load('italic 400 40px Newsreader'); await document.fonts.load('500 40px Newsreader');
    const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    x.fillStyle = '#f6efdf'; x.fillRect(0, 0, W, H);
    const papel = await carga('/img/calido/papel-postal.webp');
    if (papel) { x.fillStyle = x.createPattern(papel, 'repeat'); x.fillRect(0, 0, W, H); }
    const timbre = await carga('/img/calido/timbre-sol.webp');
    if (timbre) { x.save(); x.translate(930, 120); x.rotate(0.05); x.drawImage(timbre, -70, -84, 140, 168); x.restore(); }
    x.fillStyle = '#1c356d'; let y = 160; const izq = 90, ancho = W - 180;
    x.font = '500 46px Newsreader, Georgia, serif'; if (f.para.value) { x.fillText(f.para.value + ',', izq, y); y += 90; }
    x.font = 'italic 400 42px Newsreader, Georgia, serif';
    const renglones = [];
    f.texto.value.split(/\n\s*\n/).filter(Boolean).forEach(par => {
      let l = ''; par.replace(/\s+/g, ' ').split(' ').forEach(w => { const p = l ? l + ' ' + w : w; if (x.measureText(p).width > ancho) { renglones.push(l); l = w; } else l = p; });
      renglones.push(l, '');
    });
    let alto = 62; if (renglones.length * alto > H - y - 200) { const k = (H - y - 200) / (renglones.length * alto); alto *= k; x.font = `italic 400 ${Math.floor(42 * k)}px Newsreader, Georgia, serif`; }
    renglones.forEach(r => { x.fillText(r, izq, y); y += alto; });
    x.font = '500 44px Newsreader, Georgia, serif'; x.textAlign = 'right'; if (f.firma.value) x.fillText(f.firma.value, W - izq, Math.min(y + 30, H - 110));
    x.textAlign = 'center'; x.font = 'italic 400 26px Newsreader, Georgia, serif'; x.globalAlpha = .6; x.fillText('avelina.com.mx', W / 2, H - 50);
    const a = document.createElement('a'); a.download = 'carta.png'; a.href = c.toDataURL('image/png'); a.click();
  });
})();
