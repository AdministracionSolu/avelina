// «Feliz cumpleaños» en letra bonita: se dibuja en el teléfono y se guarda como imagen.
(() => {
  const g = document.querySelector('.letra-gen'); if (!g) return;
  const f = g.querySelector('form'), c = g.querySelector('canvas'), x = c.getContext('2d');
  const PAPEL = { crema: ['#f6efdf', '#1c356d', '#8e2420'], noche: ['#1c356d', '#ffedb7', '#eda6ac'], durazno: ['#f6d5bf', '#5b201d', '#1c356d'] };
  const letra = new FontFace('Oooh Baby', 'url(/fonts/oooh-baby.ttf)');
  const ajusta = (t, max, base) => { let s = base; do { x.font = `${s}px "Oooh Baby", cursive`; s -= 4; } while (x.measureText(t).width > max && s > 40); };
  const pinta = () => {
    const [fondo, tinta, acento] = PAPEL[f.papel.value] || PAPEL.crema, W = c.width;
    x.fillStyle = fondo; x.fillRect(0, 0, W, W);
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = tinta;
    const t = f.texto.value.trim() || 'Feliz cumpleaños', n = f.nombre.value.trim();
    const ps = t.split(' '), mitad = Math.ceil(ps.length / 2), l1 = ps.length > 2 ? ps.slice(0, mitad).join(' ') : t, l2 = ps.length > 2 ? ps.slice(mitad).join(' ') : '';
    ajusta(l1, W - 160, 190); x.fillText(l1, W / 2, n ? 360 : 430);
    if (l2) { ajusta(l2, W - 160, 190); x.fillText(l2, W / 2, n ? 560 : 640); }
    if (n) { x.fillStyle = acento; ajusta(n, W - 200, 210); x.fillText(n, W / 2, l2 ? 790 : 640); }
    x.fillStyle = tinta; x.globalAlpha = .55; x.font = 'italic 26px Newsreader, Georgia, serif'; x.fillText('avelina.com.mx', W / 2, W - 60); x.globalAlpha = 1;
  };
  letra.load().then(l => { document.fonts.add(l); pinta(); }).catch(pinta);
  f.addEventListener('input', pinta); pinta();
  g.querySelector('.lg-imagen').addEventListener('click', () => { const a = document.createElement('a'); a.download = 'feliz-cumpleanos.png'; a.href = c.toDataURL('image/png'); a.click(); });
})();
