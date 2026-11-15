// Afinador con el micrófono del navegador. El sonido no sale del teléfono: se analiza aquí mismo.
(() => {
  const NOTAS = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
  const LETRAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let ctx;
  const audio = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());

  // Autocorrelación con el primer pico claro: aguanta bien las cuerdas graves (bajo, bajo quinto).
  function tono(buf, sr) {
    const n = buf.length; let rms = 0;
    for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
    if (Math.sqrt(rms / n) < 0.01) return -1;
    const max = Math.floor(sr / 35), min = Math.floor(sr / 1400), c = new Float32Array(max + 2);
    for (let l = min; l <= max + 1; l++) { let s = 0; for (let i = 0; i < n - l; i++) s += buf[i] * buf[i + l]; c[l] = s; }
    let mejor = -1, valor = 0;
    for (let l = min + 1; l <= max; l++) if (c[l] > c[l - 1] && c[l] >= c[l + 1] && c[l] > valor) { valor = c[l]; mejor = l; }
    if (mejor < 0) return -1;
    // el primer pico que llegue al 90% del mayor evita saltar una octava abajo
    for (let l = min + 1; l < mejor; l++) if (c[l] > c[l - 1] && c[l] >= c[l + 1] && c[l] > 0.9 * valor) { mejor = l; break; }
    const a = c[mejor - 1], b = c[mejor], d = c[mejor + 1], p = (a - d) / (2 * (a - 2 * b + d)) || 0;
    return sr / (mejor + p);
  }

  document.querySelectorAll('.afinador').forEach(af => {
    const nota = af.querySelector('.af-nota'), hz = af.querySelector('.af-hz'), aguja = af.querySelector('.af-aguja');
    const cuerdas = [...af.querySelectorAll('.cuerda')], btn = af.querySelector('.af-escuchar');
    let corriendo = false, stream;
    const muestra = (f) => {
      const midi = 69 + 12 * Math.log2(f / 440), r = Math.round(midi), cents = Math.round((midi - r) * 100);
      const i = ((r % 12) + 12) % 12;
      // si hay cuerdas, se compara contra la más cercana; si no, contra la nota cromática
      let meta = null, dif = cents;
      if (cuerdas.length) {
        meta = cuerdas.reduce((m, c) => Math.abs(Math.log2(f / c.dataset.f)) < Math.abs(Math.log2(f / m.dataset.f)) ? c : m);
        dif = Math.round(1200 * Math.log2(f / meta.dataset.f));
        cuerdas.forEach(c => c.classList.toggle('activa', c === meta));
      }
      const ok = Math.abs(dif) <= 5, lim = Math.max(-50, Math.min(50, dif));
      nota.textContent = meta && Math.abs(dif) < 300 ? meta.dataset.n : `${NOTAS[i]} (${LETRAS[i]})`;
      hz.textContent = `${f.toFixed(1)} Hz · ${ok ? 'afinada' : dif < 0 ? 'aprieta un poco (sube)' : 'afloja un poco (baja)'}`;
      aguja.style.left = (50 + lim) + '%'; af.classList.toggle('ok', ok);
    };
    btn.addEventListener('click', async () => {
      if (corriendo) { corriendo = false; stream && stream.getTracks().forEach(t => t.stop()); btn.textContent = 'Encender el micrófono'; return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      } catch { hz.textContent = 'Sin permiso del micrófono. Puedes afinar de oído con los botones de abajo.'; return; }
      const a = audio(); await a.resume();
      const src = a.createMediaStreamSource(stream), an = a.createAnalyser(); an.fftSize = 4096; src.connect(an);
      const buf = new Float32Array(an.fftSize); corriendo = true; btn.textContent = 'Apagar el micrófono'; hz.textContent = 'Toca una cuerda al aire';
      let suave = 0;
      const ciclo = () => {
        if (!corriendo) return;
        an.getFloatTimeDomainData(buf); const f = tono(buf, a.sampleRate);
        if (f > 0) { suave = suave && Math.abs(Math.log2(f / suave)) < 0.05 ? suave * 0.7 + f * 0.3 : f; muestra(suave); }
        requestAnimationFrame(ciclo);
      };
      ciclo();
    });
    // nota de referencia: cuerda pulsada que se apaga sola
    cuerdas.forEach(c => c.addEventListener('click', () => {
      const a = audio(), t = a.currentTime, o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
      o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = c.dataset.f; o2.frequency.value = c.dataset.f * 2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      o.connect(g); o2.connect(g); g.connect(a.destination); o.start(t); o2.start(t); o.stop(t + 2.7); o2.stop(t + 2.7);
      cuerdas.forEach(x => x.classList.toggle('activa', x === c));
      if (!corriendo) { nota.textContent = c.dataset.n; hz.textContent = `${(+c.dataset.f).toFixed(2)} Hz · escucha y compara`; }
    }));
  });
})();
