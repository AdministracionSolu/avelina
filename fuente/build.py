#!/usr/bin/env python3
"""Genera todo el sitio. Uso: python3 fuente/build.py  (desde la raíz del repo).
Para agregar un video o una entrada del diario, edita VIDEOS. Para cambiar el video
de presentación, cambia PRESENTACION."""
import html, json, os, re
TRAZO = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "trazo.json")))
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://avelina.com.mx"
PRESENTACION = "rmZBT6yQDr4"
DM = "https://ig.me/m/avelinaa.mar"
CORREO = "amartinetmolina@gmail.com"
YT = "https://www.youtube.com/@AvelinaMartinetMolina"
# Dónde se guardan los correos de las cartas. La llave es la publicable de Supabase:
# es pública por diseño y la tabla solo permite agregar. La secreta nunca va aquí.
CARTAS_DESTINO = "https://bgnonjbkowraazdepexx.supabase.co/rest/v1/cartas_avelina"
CARTAS_LLAVE = "sb_publishable_wSmKdiLmLPUJu9QUlLXasA_RiSUNbIY"
REDES = [("Instagram", "@avelinaa.mar", "https://www.instagram.com/avelinaa.mar/", "ave"),
         ("TikTok", "@avelinamm7", "https://www.tiktok.com/@avelinamm7", "estrella"),
         ("YouTube", "@AvelinaMartinetMolina", YT, "ola")]

# Sus palabras tal como están en YouTube. tipo: h = horizontal, v = vertical.
# mia=1 lo pone en «Mis canciones» y en «Mis letras». musica=1 sin mia lo pone en Covers.
VIDEOS = [
 dict(id="YaefwL4A84s", t="Country girl", f="2026-06-30", tipo="h", txt="I'm learning English, and this is the first song: Country Girl. Thanks for listening!", mia=1, pared=1),
 dict(id="0uXa3gwRLWg", t="El arte del fallo y sacar un álbum completo en mi verano :)", f="2026-06-25", tipo="h", txt="QUE EMOCIÓN", pared=1),
 dict(id="Rye2ZEMsCfk", t="Uploading covers while I learn English and learn to sing", f="2026-06-22", tipo="h", txt="I hope you enjoy it, I enjoyed it because it was fun to make :)"),
 dict(id="rmZBT6yQDr4", t="Improvisando (Intentando componer una canción antes de dormir)", f="2026-06-13", tipo="h", txt="Holi amigos, ya me quería dormir, pero tomé un rato la guitarra, estoy terminando el semestre y estoy bien cansada, dormí dos horas", mia=1, pared=1),
 dict(id="iyS3ojI88Zc", t="Vlog: Creando mi primer sencillo :)", f="2025-09-28", tipo="h", txt="", pared=1),
 dict(id="anBe-FCImC4", t="corazón", f="2025-09-07", tipo="v", txt="", musica=1),
 dict(id="suRrMCKqzBU", t="Dos almas", f="2025-09-02", tipo="v", txt="", musica=1, pared=1),
 dict(id="uRt5VXAh1xo", t="Valentina", f="2025-09-01", tipo="v", txt="", musica=1, pared=1),
 dict(id="Q__mG3J91r4", t="me encantaaaa esa canción", f="2025-08-26", tipo="v", txt="", musica=1),
 dict(id="Yj5FoBnK1v4", t="estrellas y mar", f="2025-07-23", tipo="v", txt="", musica=1, pared=1),
 dict(id="FVlC9LQvT9w", t="Renunciación", f="2025-07-21", tipo="v", txt="", musica=1, pared=1),
 dict(id="aaX3qIqqdbk", t="Eso y más", f="2025-07-19", tipo="v", txt="", musica=1),
]
# Baúl de mi alma: (archivo, texto alterno en español, en inglés). Para agregar algo, guarda
# img/fotos/<archivo>.webp y <archivo>-chica.webp y súmalo aquí.
BAUL = [("libreta", "Página de la libreta de Avelina, escrita a mano, con un corazón dibujado en pluma que tiene ojos y llora", "A handwritten page from Avelina's notebook with a pen drawing of a crying heart with eyes"),
        ("pared", "Avelina con su guitarra frente a una pared iluminada por el atardecer, con su sombra y la de un árbol", "Avelina with her guitar against a wall lit by the sunset, with her shadow and a tree's"),
        ("rostro", "Dibujo de un rostro en pluma roja sobre una hoja de cuaderno rayada", "A face drawn in red pen on lined notebook paper"),
        ("perfil", "Avelina de perfil abrazando su guitarra de madera", "Avelina in profile holding her wooden guitar"),
        ("guitarra", "Manos de Avelina tocando una guitarra negra junto a una mesa de madera", "Avelina's hands playing a black guitar beside a wooden table"),
        ("risa", "Avelina riendo con su guitarra en la luz de la tarde", "Avelina laughing with her guitar in the afternoon light"),
        ("puerta", "Avelina recargada en el marco de una puerta con luz de jardín", "Avelina leaning on a door frame in garden light"),
        ("saludo", "Avelina con la mano en el cabello y su guitarra, frente a la pared dorada", "Avelina with a hand in her hair and her guitar, against the golden wall"),
        ("vestido", "Vestido durazno girando en movimiento sobre el pasto", "A peach dress twirling over the grass"),
        ("casa", "Avelina en cuclillas en un camino de piedra frente a una casa", "Avelina crouching on a stone path in front of a house"),
        ("botas", "Botas y pantalón de mezclilla sobre un piso de madera brillante", "Boots and flared jeans on a shiny wooden floor")]
LETRA = """Every time I pick up my guitar
and write a new song,
I wonder if anyone
will listen to me.

Every time I go back to my hometown
and see where I came from,
I wonder if I'll ever
be more than this

I don't belong in the city.
I belong to the countryside.

I'm a country girl trying to be a singer,
with fewer chances, but maybe more heart.
Learning how the world sounds
without horses and birds in the yard

I'm a daughter of the wind, wandering through New York,
the youngest of the family, miles away from home
It won't be long before I tell them I made it,
while I'm posting covers, the Grammys call my name

Every time I write to my mom
I ask her how she is
I wonder if I can help her
with all her pain"""

RUTAS = {"inicio": ("", "en/"), "musica": ("musica/", "en/music/"), "videos": ("videos/", "en/videos/"),
         "diario": ("diario/", "en/diary/"), "letras": ("letras/", "en/lyrics/"), "baul": ("baul/", "en/keepsakes/"),
         "quien": ("quien-soy/", "en/about/"), "contacto": ("contacto/", "en/contact/"), "privacidad": ("privacidad/", "en/privacy/")}
T = {
 "es": dict(html="es", otra="EN", otra_nombre="Read in English", nav=[("musica","Música"),("videos","Videos"),("diario","Diario"),("letras","Mis letras"),("baul","Baúl"),("quien","Quién soy"),("contacto","Contacto")],
  menu="Menú", quien="cantautora · nacida en sonora, foránea en mty", frase="canto lo que escribo",
  desc="Avelina, cantautora nacida en Sonora y foránea en Monterrey. Canto lo que escribo.",
  ver_videos="Ver videos", leer_diario="Mis canciones",
  hola="Hola, soy Avelina", hola_txt="Nací en un pueblo pequeño de Sonora y hoy soy foránea en Monterrey. Mis canciones nacen improvisando, sola con mi guitarra.", mas_quien="Conóceme",
  play="Reproducir video", libreta="Una página de la libreta", leer="Leer la página", libreta_pie="Country girl, junio de 2026", cerrar="Cerrar", nota_carta="Estoy aprendiendo inglés y esta es la primera canción.",
  musica="Música", mias="Mis canciones", mias_txt="Así se escucha en vivo", covers="Covers", musica_txt="Toca un cuadro para descubrirla.", descubre="Escuchar en YouTube", avisame="Avísame cuando salga", toca_ave="Lo que viene", voltea="Ver",
  pared="La pared", pared_txt="Cada marco te lleva directo al video.", todos="Todos en YouTube", ver="Ver en YouTube", ver_pared="Ver toda la pared",
  diario="Diario", diario_sub="Solo en línea", diario_txt="Casi siempre estoy grabando. Aquí se va quedando lo que escribo y lo que canto, con su fecha.", diario_mas="Abrir el diario", meses_t="Meses",
  letras="Mis letras", letras_txt="Lo que escribo, y cómo suena cuando lo canto.", baul="Baúl de mi alma", baul_txt="Lo que voy guardando: dibujos, páginas de mi libreta y fotos.", baul_btn="Abrir el baúl", abrir="Ver foto",
  quien_t="Quién soy", bio=["Nací en un pueblo pequeño de Sonora, en una familia de campo, caballos y vacas. Hoy soy foránea en Monterrey.", "La guitarra me acompaña desde niña. Mis momentos favoritos son cuando estoy sola con ella, improvisando y dejando salir lo que siento sin pensarlo demasiado."],
  cartas="Cartas de una foránea", cartas_txt="Cuando haya canción nueva, te escribo antes que a nadie.", cartas_btn="Quiero las cartas", cartas_label="Tu correo", cartas_ph="tu@correo.com", cartas_pie="Solo uso tu correo para mandarte las cartas.", cartas_ok="Ya vas en camino a la lista. Te escribo pronto.", cartas_error="No se pudo enviar. Inténtalo otra vez.", cartas_para="Para:", priv_t="Aviso de privacidad", priv=[("Quién soy","Avelina Martinet Molina es la responsable de los datos de este sitio."),("Qué guardo","Solo tu correo, si te apuntas a las cartas."),("Para qué","Para escribirte sobre mi música. No lo vendo ni lo comparto con nadie."),("Dónde se guarda","En una base de datos de Supabase a mi nombre, con servidores en Estados Unidos."),("Cómo salir de la lista","Escríbeme a amartinetmolina@gmail.com o por Instagram a @avelinaa.mar y borro tu correo."),("Videos","YouTube solo se carga si le das play a un video en esta página. Este sitio no usa cookies propias.")], priv_fecha="Actualizado el 5 de noviembre de 2026",
  redes="Donde me encuentras", contacto_t="Contacto", contacto_txt="Para hablar de música, colaboraciones o presentaciones, escríbeme. Yo te contesto.", contacto_btn="Escribirme un correo", contacto_ig="O por Instagram",
  no_hay="Esta página se fue volando", no_hay_btn="Volver al inicio", ave_t="Ir a las cartas", meses="enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split()),
 "en": dict(html="en", otra="ES", otra_nombre="Leer en español", nav=[("musica","Music"),("videos","Videos"),("diario","Diary"),("letras","My lyrics"),("baul","Keepsakes"),("quien","About"),("contacto","Contact")],
  menu="Menu", quien="singer-songwriter · born in sonora, far from home in monterrey", frase="i sing what i write",
  desc="Avelina, singer-songwriter born in Sonora, Mexico, living in Monterrey. I sing what I write.",
  ver_videos="Watch videos", leer_diario="My songs",
  hola="Hi, I'm Avelina", hola_txt="I was born in a small town in Sonora and now live far from home in Monterrey. My songs begin as improvisations, alone with my guitar.", mas_quien="Get to know me",
  play="Play video", libreta="A page from the notebook", leer="Read the page", libreta_pie="Country girl, June 2026", cerrar="Close", nota_carta="I'm learning English, and this is the first song.",
  musica="Music", mias="My songs", mias_txt="This is how it sounds live", covers="Covers", musica_txt="Tap a square to find one.", descubre="Listen on YouTube", avisame="Tell me when it's out", toca_ave="What's next", voltea="See",
  pared="The wall", pared_txt="Every frame takes you straight to the video.", todos="All on YouTube", ver="Watch on YouTube", ver_pared="See the whole wall",
  diario="Diary", diario_sub="Only online", diario_txt="I am almost always filming. What I write and sing stays here, with its date.", diario_mas="Open the diary", meses_t="Months",
  letras="My lyrics", letras_txt="What I write, and how it sounds when I sing it.", baul="Keepsakes of my soul", baul_txt="What I keep: drawings, pages from my notebook and photos.", baul_btn="Open the chest", abrir="See photo",
  quien_t="About", bio=["I was born in a small town in Sonora, Mexico, in a family of fields, horses and cows. Now I live far from home in Monterrey.", "The guitar has been with me since I was little. My favorite moments are alone with it, improvising and letting out what I feel without overthinking."],
  cartas="Letters from far from home", cartas_txt="When there is a new song, I will write to you before anyone else.", cartas_btn="I want the letters", cartas_label="Your email", cartas_ph="you@email.com", cartas_pie="I only use your email to send you the letters.", cartas_ok="You are on your way to the list. I will write soon.", cartas_error="It could not be sent. Please try again.", cartas_para="To:", priv_t="Privacy notice", priv=[("Who I am","Avelina Martinet Molina is responsible for the data on this site."),("What I keep","Only your email, if you sign up for the letters."),("What for","To write to you about my music. I do not sell it or share it with anyone."),("Where it is kept","In a Supabase database under my name, with servers in the United States."),("How to leave the list","Write to me at amartinetmolina@gmail.com or on Instagram at @avelinaa.mar and I will delete your email."),("Videos","YouTube only loads if you press play on a video on this page. This site uses no cookies of its own.")], priv_fecha="Updated November 5, 2026",
  redes="Where to find me", contacto_t="Contact", contacto_txt="To talk about music, collaborations or shows, write to me. I will answer you.", contacto_btn="Send me an email", contacto_ig="Or on Instagram",
  no_hay="This page flew away", no_hay_btn="Back to home", ave_t="Go to the letters", meses="January February March April May June July August September October November December".split()),
}
e = html.escape
def version(ruta):
    import hashlib
    return hashlib.sha1(open(os.path.join(RAIZ, ruta), "rb").read()).hexdigest()[:8]
V_CSS, V_JS = version("css/sitio.css"), version("js/sitio.js")
def url(l, k): return "/" + RUTAS[k][0 if l == "es" else 1]
def yt(i): return f"https://www.youtube.com/watch?v={i}"
def fecha(l, f):
    y, m, d = map(int, f.split("-")); mes = T[l]["meses"][m-1]
    return f"{d} de {mes} de {y}" if l == "es" else f"{mes} {d}, {y}"
def mes(l, f):
    y, m, _ = map(int, f.split("-")); mes_ = T[l]["meses"][m-1]
    return f"{mes_} {y}"
SIMBOLOS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="ola" viewBox="0 0 64 28"><path d="M3 18c7-10 13-10 20 0s13 10 20 0 12-9 18-1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
<symbol id="estrella" viewBox="0 0 40 40"><path d="M20 3l4 12.5L37 20l-13 4.500L20 37l-4-12.500L3 20l13-4.500z" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linejoin="round"/></symbol>
<symbol id="ave" viewBox="0 0 56 36"><path d="M4 23c9-9 16-9 22-3 5-10 14-14 26-10-8 3-12 8-15 14-9 4-21 3-33-1z" fill="none" stroke="currentColor" stroke-width="2.300" stroke-linejoin="round"/></symbol>
</defs></svg>'''
def ic(n, c=""): return f'<svg class="ic {c}" aria-hidden="true"><use href="#{n}"/></svg>'

def marco(l, v, carga="lazy"):
    return f'''<a class="obra {'obra-v' if v['tipo']=='v' else ''}" href="{yt(v['id'])}" target="_blank" rel="noopener">
<span class="marco"><img src="/img/videos/{v['id']}.webp" alt="" loading="{carga}"><span class="play" aria-hidden="true"></span></span>
<span class="cedula"><b>{e(v['t'])}</b><i>{fecha(l, v['f'])}</i></span></a>'''
def pared(l, vs): return '<div class="pared">' + "".join(marco(l, v) for v in vs) + "</div>"

def mosaico(l, t):
    colores = "cielo azul crema vino naranja noche rosa verde".split()
    canciones = [v for v in VIDEOS if v.get("musica") and not v.get("mia")]
    celdas, extras, i = [], [("ave", url(l, "contacto") + "#cartas", t["avisame"]), ("estrella", url(l, "diario"), t["diario"]), ("ola", url(l, "videos"), t["pared"])], 0
    for n, v in enumerate(canciones):
        c = colores[n % 8]
        celdas.append(f'''<div class="cuadro c-{c}"><div class="giro">
<button class="cara" type="button" aria-expanded="false"><span>{e(v['t'] if len(v['t'])<34 else v['t'].split(' (')[0])}</span></button>
<div class="dorso" inert><img src="/img/videos/{v['id']}.webp" alt="" loading="lazy"><a href="{yt(v['id'])}" target="_blank" rel="noopener">{t['descubre']}</a></div>
</div></div>''')
        if n in (1, 3, 5) and extras:
            s, h, x = extras.pop(0); c2 = colores[(n + 3) % 8]
            celdas.append(f'<a class="cuadro cuadro-dib c-{c2}" href="{h}">{ic(s)}<span>{x}</span></a>')
    return '<div class="mosaico">' + "".join(celdas) + "</div>"

def reproductor(t, v):
    return f'''<div class="marco marco-grande"><button class="lite" type="button" data-id="{v['id']}" aria-label="{t['play']}: {e(v['t'])}"><img src="/img/videos/{v['id']}.webp" alt="" loading="lazy"><span class="play" aria-hidden="true"></span></button></div>'''
def video_presentacion(t): return reproductor(t, next(x for x in VIDEOS if x["id"] == PRESENTACION))
def mis_canciones(l, t):
    c = "".join(f'''<figure>{reproductor(t, v)}<figcaption class="cedula"><b>{e(v['t'].split(' (')[0])}</b><i>{fecha(l, v['f'])}</i></figcaption></figure>''' for v in VIDEOS if v.get("mia"))
    return f'<div class="mias">{c}</div>'
def firma():
    return f'''<svg class="firma" viewBox="0 50 {TRAZO["w"]} 400" role="img" aria-label="Avelina"><defs><mask id="borda" maskUnits="userSpaceOnUse" x="-20" y="-20" width="{TRAZO['w']+40}" height="{TRAZO['h']+40}"><path class="aguja" pathLength="1" d="{TRAZO['ruta']}"/><path class="aguja aguja-2" pathLength="1" d="{TRAZO['punto']}"/></mask></defs><image href="/img/marca/avelina-hilo.webp" width="{TRAZO['w']}" height="{TRAZO['h']}" mask="url(#borda)"/></svg>'''

def cartas(t):
    l = t["html"]
    return f'''<section class="cartas" id="cartas"><div class="ancho">
<h2>{t['cartas']}</h2><p class="lead">{t['cartas_txt']}</p>
<form class="sobre" data-destino="{CARTAS_DESTINO}" data-llave="{CARTAS_LLAVE}" data-idioma="{l}" data-ok="{t['cartas_ok']}" data-error="{t['cartas_error']}">
<span class="timbre" aria-hidden="true"><img src="/img/marca/paloma-1.png" alt=""></span>
<label for="correo-cartas">{t['cartas_label']}</label>
<div class="renglon"><span aria-hidden="true">{t['cartas_para']}</span><input id="correo-cartas" type="email" name="correo" required autocomplete="email" inputmode="email" placeholder="{t['cartas_ph']}"></div>
<input class="trampa" type="text" name="sitio" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="boton" type="submit">{t['cartas_btn']}</button>
<p class="aviso-form" role="status"></p></form>
<p class="pie">{t['cartas_pie']} <a href="{url(l,'privacidad')}">{t['priv_t']}</a></p></div></section>'''
def redes(t):
    c = "".join(f'<a class="red" href="{h}" target="_blank" rel="noopener">{ic(i)}<b>{n}</b><span>{u}</span></a>' for n, u, h, i in REDES)
    return f'<section class="cielo redes"><div class="ancho"><h2>{t["redes"]}</h2><div class="fila-redes">{c}</div></div></section>'

def diario_lista(l, t, vs, agrupar=True):
    out, actual = [], None
    for v in vs:
        m = mes(l, v["f"])
        if agrupar and m != actual:
            if actual: out.append("</div>")
            actual = m; out.append(f'<h2 class="mes" id="m-{v["f"][:7]}">{m}</h2><div class="entradas">')
        txt = f'<p lang="{"en" if re.search(r"\b(I|the|and)\b", v["txt"]) else "es"}">{e(v["txt"])}</p>' if v["txt"] else ""
        out.append(f'''<a class="entrada" href="{yt(v['id'])}" target="_blank" rel="noopener"><img src="/img/videos/{v['id']}.webp" alt="" loading="lazy"><span><time datetime="{v['f']}">{fecha(l, v['f'])}</time><b>{e(v['t'])}</b>{txt}</span></a>''')
    if agrupar: out.append("</div>")
    return "".join(out)

def foto(l, f, clase=""):
    n, es_, en_ = f; alt = es_ if l == "es" else en_
    return f'<button class="foto {clase}" type="button" data-grande="/img/fotos/{n}.webp" aria-label="{T[l]["abrir"]}: {e(alt)}"><img src="/img/fotos/{n}-chica.webp" alt="{e(alt)}" loading="lazy"></button>'

def pagina(l, clave, titulo, cuerpo, ruta_es=None, ruta_en=None, ld=""):
    t = T[l]; otro = "en" if l == "es" else "es"
    es_r, en_r = RUTAS[clave] if clave in RUTAS else (ruta_es, ruta_en)
    mi = es_r if l == "es" else en_r; alt = en_r if l == "es" else es_r
    nav = "".join(f'<a href="{url(l,k)}"{" aria-current=page" if k==clave else ""}>{n}</a>' for k, n in t["nav"])
    full = "Avelina · " + ("cantautora" if l == "es" else "singer-songwriter") if clave == "inicio" else f"{titulo} · Avelina"
    return f'''<!doctype html>
<html lang="{t['html']}"><head><meta charset="utf-8"><script>if(location.protocol==="http:"&&location.hostname==="avelina.com.mx")location.replace("https://avelina.com.mx"+location.pathname+location.search+location.hash)</script><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(full)}</title><meta name="description" content="{e(t['desc'])}">
<meta property="og:title" content="{e(full)}"><meta property="og:description" content="{e(t['desc'])}"><meta property="og:image" content="{BASE}/img/compartir.jpg"><meta property="og:url" content="{BASE}/{mi}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#5a0f1a"><link rel="icon" href="/img/favicon.png"><link rel="canonical" href="{BASE}/{mi}">
<link rel="alternate" hreflang="es" href="{BASE}/{es_r}"><link rel="alternate" hreflang="en" href="{BASE}/{en_r}">
<link rel="preload" href="/fonts/sedgwickave-regular.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/css/sitio.css?v={V_CSS}">{ld}
<script src="/js/sitio.js?v={V_JS}" defer></script></head>
<body class="p-{clave}">{SIMBOLOS}
<header class="barra"><a class="logo" href="{url(l,'inicio')}"><img src="/img/marca/avelina-hilo-crema.webp" alt="Avelina" width="1200" height="425"></a>
<details class="menu"><summary>{t['menu']}</summary><nav>{nav}</nav></details>
<nav class="nav-ancho" aria-label="{t['menu']}">{nav}</nav>
<a class="idioma" href="/{alt}" hreflang="{otro}" lang="{otro}" aria-label="{t['otra_nombre']}">{t['otra']}</a></header>
<main>{cuerpo}</main>
<footer><div class="ancho"><img src="/img/marca/avelina-hilo-crema.webp" alt="" width="1200" height="425" loading="lazy"><p>{t['frase']}</p>
<nav>{"".join(f'<a href="{h}" target="_blank" rel="noopener">{n}</a>' for n,u,h,i in REDES)}</nav><small>© 2026 Avelina Martinet Molina · <a href="{url(l,'privacidad')}">{t['priv_t']}</a></small></div></footer>
<a class="companera" href="{url(l,'contacto')}#cartas" aria-label="{t['ave_t']}" title="{t['ave_t']}"><img src="/img/marca/paloma-1.png" alt=""></a>
</body></html>
'''
def cabeza(titulo, sub=""):
    s = f'<p class="lead">{sub}</p>' if sub else ""
    return f'<div class="cabeza"><h1>{titulo}</h1>{s}</div>'

def inicio(l):
    t = T[l]; pv = [v for v in VIDEOS if v.get("pared") and not v.get("mia")][:4]
    ld = '<script type="application/ld+json">' + json.dumps({"@context":"https://schema.org","@type":"MusicGroup","name":"Avelina","alternateName":"Avelina Martinet Molina","genre":"cantautora","url":BASE+"/","image":BASE+"/img/compartir.jpg","description":T["es"]["desc"],"sameAs":[r[2] for r in REDES]}, ensure_ascii=False) + "</script>"
    c = f'''<section class="portada"><div class="manta">
<h1>{firma()}</h1>
<div class="manta-foto"><img src="/img/fotos/pared.webp" alt="" fetchpriority="high" width="578" height="863"></div>
<div class="texto-portada"><p class="quien">{t['quien']}</p><p class="frase">{t['frase']}</p>
<p class="acciones"><a class="boton" href="{url(l,'musica')}">{t['leer_diario']}</a><a class="boton boton-linea" href="{url(l,'videos')}">{t['ver_videos']}</a></p></div></div></section>
<section class="lino hola"><div class="ancho dos"><div>{video_presentacion(t)}</div><div><h2>{t['hola']}</h2><p class="lead">{t['hola_txt']}</p><a class="enlace" href="{url(l,'quien')}">{t['mas_quien']}</a></div></div></section>
<section class="mar"><div class="ancho"><h2>{t['mias']}</h2><p class="lead">{t['mias_txt']}</p>{mis_canciones(l, t)}</div></section>
<section class="cielo"><div class="ancho"><h2>{t['covers']}</h2><p class="lead">{t['musica_txt']}</p>{mosaico(l, t)}</div></section>
<section class="muro"><div class="ancho"><h2>{t['pared']}</h2><p class="lead">{t['pared_txt']}</p>{pared(l, pv)}<p class="centro"><a class="boton boton-oro" href="{url(l,'videos')}">{t['ver_pared']}</a></p></div></section>
<section class="papel libreta"><div class="ancho dos"><div class="hoja"><p lang="en">I'm a country girl trying to be a singer,<br>with fewer chances, but maybe more heart.</p><small>{t['libreta_pie']}</small></div><div><h2>{t['letras']}</h2><p class="lead">{t['letras_txt']}</p><a class="boton" href="{url(l,'letras')}">{t['leer']}</a></div></div></section>
<section class="lino"><div class="ancho"><h2>{t['diario']}</h2><p class="sub">{t['diario_sub']}</p>{diario_lista(l, t, VIDEOS[:3], False)}<p class="centro"><a class="boton" href="{url(l,'diario')}">{t['diario_mas']}</a></p></div></section>
<section class="muro baul-portada"><div class="ancho"><h2>{t['baul']}</h2><p class="lead">{t['baul_txt']}</p><div class="baul baul-corto">{"".join(foto(l, f) for f in BAUL[:4])}</div><p class="centro"><a class="boton boton-oro" href="{url(l,'baul')}">{t['baul_btn']}</a></p></div></section>
{cartas(t)}{redes(t)}'''
    return pagina(l, "inicio", "Avelina", c, ld=ld)

def paginas(l):
    t = T[l]; out = {}
    out["musica"] = pagina(l, "musica", t["musica"], f'<section class="mar primera"><div class="ancho">{cabeza(t["mias"], t["mias_txt"])}{mis_canciones(l, t)}</div></section><section class="cielo"><div class="ancho"><h2>{t["covers"]}</h2><p class="lead">{t["musica_txt"]}</p>{mosaico(l,t)}</div></section>{cartas(t)}')
    pv = [v for v in VIDEOS if v.get("pared")]
    out["videos"] = pagina(l, "videos", t["pared"], f'<section class="muro primera"><div class="ancho">{cabeza(t["pared"], t["pared_txt"])}{pared(l,pv)}<p class="centro"><a class="boton boton-oro" href="{YT}" target="_blank" rel="noopener">{t["todos"]}</a></p></div></section>{cartas(t)}')
    meses = []
    for v in VIDEOS:
        if v["f"][:7] not in [m[0] for m in meses]: meses.append((v["f"][:7], mes(l, v["f"])))
    idx = "".join(f'<a href="#m-{k}">{n}</a>' for k, n in meses)
    out["diario"] = pagina(l, "diario", t["diario"], f'<section class="lino primera"><div class="ancho">{cabeza(t["diario"], t["diario_txt"])}<p class="sub">{t["diario_sub"]}</p><div class="archivo"><nav aria-label="{t["meses_t"]}">{idx}</nav><div>{diario_lista(l,t,VIDEOS)}</div></div></div></section>{cartas(t)}')
    out["letras"] = pagina(l, "letras", t["letras"], f'''<section class="papel primera"><div class="ancho">{cabeza(t["letras"], t["letras_txt"])}<div class="dos dos-letra"><div class="hoja hoja-larga"><h2>Country girl</h2><pre lang="en">{e(LETRA)}</pre></div><div class="columna-videos">{mis_canciones(l, t)}</div></div></div></section>''')
    out["baul"] = pagina(l, "baul", t["baul"], f'''<section class="muro primera"><div class="ancho">{cabeza(t["baul"], t["baul_txt"])}<div class="baul">{"".join(foto(l, f) for f in BAUL)}</div></div></section>''')
    bio = "".join(f"<p>{p}</p>" for p in t["bio"])
    out["quien"] = pagina(l, "quien", t["quien_t"], f'<section class="lino primera"><div class="ancho">{cabeza(t["hola"])}<div class="presentacion">{video_presentacion(t)}</div><div class="bio">{bio}</div></div></section>{redes(t)}')
    out["contacto"] = pagina(l, "contacto", t["contacto_t"], f'<section class="lino primera"><div class="ancho centro">{cabeza(t["contacto_t"], t["contacto_txt"])}<a class="boton" href="mailto:{CORREO}">{t["contacto_btn"]}</a><p class="correo"><a href="mailto:{CORREO}">{CORREO}</a></p><p><a class="enlace" href="{DM}" target="_blank" rel="noopener">{t["contacto_ig"]}</a></p></div></section>{cartas(t)}{redes(t)}')
    secc = "".join(f"<h2>{a}</h2><p>{b}</p>" for a, b in t["priv"])
    out["privacidad"] = pagina(l, "privacidad", t["priv_t"], f'<section class="lino primera"><div class="ancho legal">{cabeza(t["priv_t"])}{secc}<p class="sub">{t["priv_fecha"]}</p></div></section>')
    return out

def escribe(ruta, txt):
    p = os.path.join(RAIZ, ruta); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, "w", encoding="utf-8").write(txt)
for l in ("es", "en"):
    r = 0 if l == "es" else 1
    escribe(RUTAS["inicio"][r] + "index.html", inicio(l))
    for k, h in paginas(l).items(): escribe(RUTAS[k][r] + "index.html", h)
escribe("404.html", pagina("es", "404", T["es"]["no_hay"], f'<section class="lino primera"><div class="ancho centro">{cabeza(T["es"]["no_hay"])}<a class="boton" href="/">{T["es"]["no_hay_btn"]}</a></div></section>', "", "en/"))
for viejo, nuevo in (("album/", "letras/"), ("en/album/", "en/lyrics/")):
    escribe(viejo + "index.html", f'<!doctype html><meta charset="utf-8"><title>Avelina</title><link rel="canonical" href="{BASE}/{nuevo}"><meta http-equiv="refresh" content="0; url=/{nuevo}"><a href="/{nuevo}">Avelina</a>\n')
urls = "".join(f"<url><loc>{BASE}/{r}</loc></url>" for par in RUTAS.values() for r in par)
escribe("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
escribe("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n")
print("listo")
