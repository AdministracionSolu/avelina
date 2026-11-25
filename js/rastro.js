/*
 * De dónde llega la gente y qué recorre (25-nov-2026). Mismo motor que SignSolú y Makatea
 * (solufirmas/src/lib/atribucion.ts y navegacion.ts), en un solo archivo sin dependencias para
 * pilsi.art (SPA y páginas estáticas) y avelina.com.mx (estático). Lo mismo vive copiado en
 * pilsi/public/rastro.js: si cambias uno, cambia el otro.
 *
 *   <script src="/rastro.js" data-sitio="pilsi" defer></script>
 *
 * - Primer toque de la visita (canal ya interpretado, referrer, UTM, landing, ?c=) en sessionStorage:
 *   leer document.referrer al enviar un formulario NO sirve, para entonces dice el sitio mismo.
 * - atribucion_eventos: la visita (una por pestaña), clics a WhatsApp, descargas y conversiones.
 * - navegacion: cada página, cada clic con su texto y el tiempo visible con el scroll.
 * - window.pilsiRastro: atribucion(), visitante(), conversion(evento, detalle) para los formularios.
 * Nunca guarda lo que se escribe en un campo. Sólo INSERT con la llave publicable. Si falla, el sitio sigue.
 */
(function () {
  if (typeof window === "undefined" || window.pilsiRastro) return;
  var yo = document.currentScript;
  var SITIO = (yo && yo.dataset.sitio) || "avelina";
  var URL_BASE = "https://bgnonjbkowraazdepexx.supabase.co";
  var LLAVE = "sb_publishable_wSmKdiLmLPUJu9QUlLXasA_RiSUNbIY";
  var ROBOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse|pingdom|monitor|motor-organico|puppeteer|playwright|python-requests|curl\//i;
  var robot = !!(navigator.webdriver || ROBOT.test(navigator.userAgent));
  var L_ATR = "atribucion_v1", L_VISITA_EV = "atribucion_visita_v1", L_VISITANTE = "nav_visitante_v1", L_VISITA = "nav_visita_v1";

  function canalDe(ref, p) {
    var f = p.get("utm_source");
    if (f) { var m = p.get("utm_medium"); return m ? f + " · " + m : f; }
    if (p.get("gclid")) return "Google Ads";
    if (p.get("fbclid")) return "anuncio de Meta";
    var c = p.get("c") || "";
    if (/^li-/.test(c)) return "LinkedIn";
    if (/^(ig|insta)-/.test(c)) return "Instagram";
    if (/^(tt|tiktok)-/.test(c)) return "TikTok";
    if (/^(yt|youtube)-/.test(c)) return "YouTube";
    if (/^wa-/.test(c)) return "WhatsApp";
    if (!ref) return "directo o liga pegada";
    var host;
    try { host = new URL(ref).hostname.replace(/^www\./, ""); } catch (e) { return "directo o liga pegada"; }
    if (host === location.hostname.replace(/^www\./, "")) return "navegación interna";
    var conocidos = [
      [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$|(^|\.)perplexity\.(ai|com)$|(^|\.)claude\.(ai|com)$|^gemini\.google\.com$|(^|\.)copilot\.microsoft\.com$|(^|\.)grok\.com$|^meta\.ai$|^duck\.ai$|(^|\.)deepseek\.com$/, "un asistente de IA"],
      [/^(google\.|.*\.google\.)/, "búsqueda de Google"],
      [/^(bing\.|duckduckgo\.|search\.yahoo\.|ecosia\.|search\.brave\.)/, "otro buscador"],
      [/(^|\.)linkedin\.com$|^lnkd\.in$/, "LinkedIn"],
      [/(^|\.)facebook\.com$|^fb\.me$|^l\.facebook\.com$/, "Facebook"],
      [/(^|\.)instagram\.com$|^l\.instagram\.com$/, "Instagram"],
      [/(^|\.)tiktok\.com$/, "TikTok"],
      [/(^|\.)whatsapp\.com$|^wa\.me$/, "WhatsApp"],
      [/(^|\.)x\.com$|(^|\.)twitter\.com$|^t\.co$/, "X"],
      [/(^|\.)youtube\.com$|^youtu\.be$/, "YouTube"],
      [/(^|\.)substack\.com$/, "Substack"],
      [/(^|\.)mail\.google\.com$|(^|\.)outlook\./, "una liga en un correo"],
      [/(^|\.)pilsi\.art$/, "pilsi.art"],
      [/(^|\.)avelina\.com\.mx$/, "avelina.com.mx"],
    ];
    for (var i = 0; i < conocidos.length; i++) if (conocidos[i][0].test(host)) return conocidos[i][1];
    return host;
  }

  function capturar() {
    var p = new URLSearchParams(location.search), ref = document.referrer || null;
    return {
      canal: canalDe(ref, p), referrer: ref,
      utm_source: p.get("utm_source"), utm_medium: p.get("utm_medium"), utm_campaign: p.get("utm_campaign"),
      utm_term: p.get("utm_term"), utm_content: p.get("utm_content"), gclid: p.get("gclid"), fbclid: p.get("fbclid"),
      marca: p.get("c"), landing: location.pathname + location.search, primera_visita: new Date().toISOString(), sitio: SITIO,
    };
  }
  function leer(alm, k) { try { return alm.getItem(k); } catch (e) { return null; } }
  function poner(alm, k, v) { try { alm.setItem(k, v); } catch (e) {} }
  function id() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = (Math.random() * 16) | 0; return (c === "x" ? r : (r & 3) | 8).toString(16); });
  }
  function leerOCrear(alm, k) { var v = leer(alm, k); if (v) return v; v = id(); poner(alm, k, v); return v; }

  if (!leer(sessionStorage, L_ATR)) poner(sessionStorage, L_ATR, JSON.stringify(capturar()));
  function atribucion() { try { return JSON.parse(leer(sessionStorage, L_ATR)) || capturar(); } catch (e) { return capturar(); } }
  var visitante = leerOCrear(localStorage, L_VISITANTE);
  var visita = leerOCrear(sessionStorage, L_VISITA);

  var corta = function (s, n) { return s == null ? null : String(s).slice(0, n); };
  function insertar(tabla, cuerpo) {
    if (robot) return;
    try {
      fetch(URL_BASE + "/rest/v1/" + tabla, {
        method: "POST", keepalive: true,
        headers: { "Content-Type": "application/json", apikey: LLAVE, Authorization: "Bearer " + LLAVE, Prefer: "return=minimal" },
        body: JSON.stringify(cuerpo),
      }).catch(function () {});
    } catch (e) {}
  }
  function evento(nombre, detalle) {
    var a = atribucion();
    insertar("atribucion_eventos", {
      sitio: SITIO, evento: nombre, detalle: corta(detalle, 300), visitante: visitante,
      canal: corta(a.canal, 120), referrer: corta(a.referrer, 500), utm_source: corta(a.utm_source, 120),
      utm_medium: corta(a.utm_medium, 120), utm_campaign: corta(a.utm_campaign, 200), utm_term: corta(a.utm_term, 200),
      utm_content: corta(a.utm_content, 200), gclid: corta(a.gclid, 200), fbclid: corta(a.fbclid, 200),
      marca: corta(a.marca, 80), landing: corta(a.landing, 500), ruta: corta(location.pathname + location.search, 500),
      user_agent: corta(navigator.userAgent, 300),
    });
  }

  // La visita: una por pestaña.
  if (!leer(sessionStorage, L_VISITA_EV)) { poner(sessionStorage, L_VISITA_EV, "1"); setTimeout(function () { evento("visita"); }, 1500); }

  // Navegación: páginas, clics y tiempo visible.
  var UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
  function limpia(r) {
    return ((r.split(/[?#]/)[0] || "/").replace(UUID, ":id").split("/").map(function (t) {
      return t.length >= 16 && /^[A-Za-z0-9_]+$/.test(t) && /\d/.test(t) ? ":token" : t;
    }).join("/")).slice(0, 300);
  }
  function nav(ev, d) {
    insertar("navegacion", {
      sitio: SITIO, visitante: visitante, visita: visita, evento: ev, ruta: d.ruta, titulo: corta(d.titulo, 160),
      detalle: corta(d.detalle, 200), ms: d.ms == null ? null : d.ms, scroll: d.scroll == null ? null : d.scroll,
      ancho: Math.min(innerWidth || 0, 32000), canal: corta(atribucion().canal, 120), user_agent: corta(navigator.userAgent, 300),
    });
  }
  var rutaActual = "", visibleDesde = 0, acumulado = 0, scrollMax = 0, pendiente = null;
  function medirScroll() {
    var d = document.documentElement, alto = d.scrollHeight - innerHeight;
    var pct = alto > 0 ? Math.round(((scrollY || d.scrollTop) / alto) * 100) : 100;
    if (pct > scrollMax) scrollMax = Math.min(pct, 100);
  }
  function cerrarTiempo() {
    if (!rutaActual) return;
    if (visibleDesde) acumulado += Date.now() - visibleDesde;
    visibleDesde = document.visibilityState === "visible" ? Date.now() : 0;
    if (acumulado >= 500) nav("tiempo", { ruta: rutaActual, ms: Math.min(acumulado, 86400000), scroll: scrollMax });
    acumulado = 0;
  }
  function mandarPagina() { if (!pendiente) return; clearTimeout(pendiente.t); nav("pagina", { ruta: pendiente.ruta, titulo: document.title }); pendiente = null; }
  function cambio() {
    var r = limpia(location.pathname);
    if (r === rutaActual) return;
    mandarPagina(); cerrarTiempo();
    rutaActual = r; acumulado = 0; scrollMax = 0;
    visibleDesde = document.visibilityState === "visible" ? Date.now() : 0;
    pendiente = { ruta: r, t: setTimeout(mandarPagina, 1500) };
  }
  if (!robot) {
    ["pushState", "replaceState"].forEach(function (m) {
      var o = history[m];
      history[m] = function () { var x = o.apply(this, arguments); setTimeout(cambio, 0); return x; };
    });
    addEventListener("popstate", function () { setTimeout(cambio, 0); });
    addEventListener("scroll", medirScroll, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") { mandarPagina(); cerrarTiempo(); }
      else visibleDesde = Date.now();
    });
    addEventListener("pagehide", function () { mandarPagina(); cerrarTiempo(); });
    cambio();
  }

  // Clics: a WhatsApp, descargas y cualquier botón o liga (con su texto, nunca lo escrito en un campo).
  var DESCARGA = /\.(pdf|docx|xlsx|zip)(?:[?#]|$)/i;
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("a[href],button,[role=button]") : null;
    if (!el) return;
    var href = el.getAttribute("href") || "";
    var abs = href ? new URL(href, location.href).href : "";
    if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(abs)) evento("clic_whatsapp", abs);
    else if (DESCARGA.test(abs)) evento("descarga", new URL(abs).pathname);
    var texto = (el.getAttribute("aria-label") || el.getAttribute("title") || el.innerText || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
    nav("clic", { ruta: rutaActual || limpia(location.pathname), detalle: (texto + (abs ? " → " + limpia(new URL(abs).pathname) : "")).slice(0, 200) });
  }, { capture: true, passive: true });

  window.pilsiRastro = {
    atribucion: atribucion,
    visitante: function () { return visitante; },
    /** Para cada formulario que convierte: alta, demo, solicitud, suscripcion, carta, taller, comunidad. */
    conversion: function (nombre, detalle) { evento(nombre, detalle); },
  };
})();
