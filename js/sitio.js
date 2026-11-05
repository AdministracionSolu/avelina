// Cuadros de música
document.querySelectorAll('.cuadro .cara').forEach(b => b.addEventListener('click', () => {
  const c = b.closest('.cuadro'), d = c.querySelector('.dorso');
  document.querySelectorAll('.cuadro.volteado').forEach(o => { if (o !== c) { o.classList.remove('volteado'); o.querySelector('.dorso').inert = true; o.querySelector('.cara').setAttribute('aria-expanded', 'false'); } });
  const v = c.classList.toggle('volteado'); d.inert = !v; b.setAttribute('aria-expanded', v);
}));
document.querySelectorAll('.dorso').forEach(d => d.addEventListener('click', e => {
  if (e.target.tagName === 'A') return;
  const c = d.closest('.cuadro'); c.classList.remove('volteado'); d.inert = true; c.querySelector('.cara').setAttribute('aria-expanded', 'false');
}));
// Video: YouTube solo se carga al darle play
document.querySelectorAll('.lite').forEach(b => b.addEventListener('click', () => {
  const f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1&rel=0';
  f.title = b.getAttribute('aria-label'); f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
  b.replaceWith(f);
}));
// Carta de la libreta
document.querySelectorAll('[data-abre]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.abre).showModal()));
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
// Cartas: solo agradece si Supabase confirmó que guardó el correo
document.querySelectorAll('.sobre').forEach(f => f.addEventListener('submit', async e => {
  e.preventDefault();
  const aviso = f.querySelector('.aviso-form'), b = f.querySelector('button'), datos = new FormData(f);
  if (datos.get('sitio')) return;
  b.disabled = true; aviso.textContent = '';
  try {
    const r = await fetch(f.dataset.destino, {
      method: 'POST',
      headers: { apikey: f.dataset.llave, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ correo: datos.get('correo').trim(), idioma: f.dataset.idioma })
    });
    if (!r.ok && r.status !== 409) throw new Error(r.status); // 409: ese correo ya estaba en la lista
    f.classList.add('enviado'); aviso.textContent = f.dataset.ok;
  } catch { aviso.textContent = f.dataset.error; b.disabled = false; }
}));
// Álbum
const vista = document.createElement('dialog'); vista.className = 'vista';
vista.addEventListener('click', () => vista.close());
document.body.append(vista);
document.querySelectorAll('[data-grande]').forEach(b => b.addEventListener('click', () => {
  const i = new Image(); i.src = b.dataset.grande; i.alt = b.querySelector('img').alt; vista.replaceChildren(i); vista.showModal();
}));
// La paloma acompaña el recorrido
const ave = document.querySelector('.companera');
if (ave && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let pend = false;
  const mueve = () => {
    pend = false;
    const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
    const y = 50 + (p - .5) * (innerHeight - 240), x = Math.sin(p * 18) * 14, r = Math.cos(p * 18) * 9;
    ave.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
  };
  addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(mueve); } }, { passive: true });
  addEventListener('resize', mueve); mueve();
}
