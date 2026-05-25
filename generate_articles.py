# -*- coding: utf-8 -*-
import os

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new\blog'

CSS = """<style>
:root{--cream:#FAF6F1;--warm:#F2E8DD;--sand:#EAD1BF;--gold:#B8975A;--gold-light:#D4B896;--dark:#1C1612;--mid:#6B5B4E;--light:#A8958A;--white:#FFFFFF;--font-serif:'Cormorant Garamond',Georgia,serif;--font-sans:'Jost',sans-serif;--ease:cubic-bezier(0.25,0.46,0.45,0.94);}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--cream);color:var(--dark);font-family:var(--font-sans);font-weight:300;overflow-x:hidden;}
.announcement{background:var(--dark);color:var(--sand);padding:10px 0;overflow:hidden;}
.announcement-track{display:flex;width:max-content;animation:ticker 20s linear infinite;}
.announcement-item{font-size:11px;letter-spacing:.18em;text-transform:uppercase;padding:0 60px;display:flex;align-items:center;gap:12px;white-space:nowrap;flex-shrink:0;}
.announcement-item::before{content:'✦';color:var(--gold);font-size:8px;}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
nav{position:sticky;top:0;z-index:90;padding:0 60px;height:72px;display:flex;align-items:center;justify-content:space-between;background:rgba(250,246,241,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(184,151,90,0.12);}
.nav-logo{font-family:var(--font-serif);font-size:22px;font-weight:500;letter-spacing:.12em;color:var(--dark);text-decoration:none;}
.nav-links{display:flex;gap:40px;list-style:none;}
.nav-links a{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--mid);text-decoration:none;transition:color .3s;}
.nav-links a:hover{color:var(--dark);}
.nav-right{display:flex;align-items:center;gap:24px;}
.nav-cart{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--dark);text-decoration:none;display:flex;align-items:center;gap:8px;position:relative;}
.cart-badge{background:var(--gold);color:#fff;font-size:9px;width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;position:absolute;top:-8px;right:-12px;}
.menu-toggle{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;background:none;border:none;}
.menu-toggle span{display:block;width:22px;height:1.5px;background:var(--dark);}
.mobile-nav{display:none;position:fixed;top:72px;left:0;right:0;background:rgba(250,246,241,0.98);backdrop-filter:blur(20px);z-index:89;padding:24px;border-bottom:1px solid rgba(184,151,90,0.15);flex-direction:column;}
.mobile-nav.open{display:flex;}
.mobile-nav a{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--dark);text-decoration:none;padding:16px 0;border-bottom:1px solid rgba(184,151,90,0.1);}
.breadcrumb{padding:20px 80px;font-size:12px;color:var(--light);display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(184,151,90,0.1);}
.breadcrumb a{color:var(--light);text-decoration:none;transition:color .3s;}
.breadcrumb a:hover{color:var(--gold);}
.breadcrumb span{color:var(--gold);}
.article-hero{padding:60px 80px 0;max-width:860px;margin:0 auto;}
.article-category{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;display:flex;align-items:center;gap:12px;}
.article-category::before{content:'';width:32px;height:1px;background:var(--gold);}
.article-h1{font-family:var(--font-serif);font-size:clamp(36px,4.5vw,60px);font-weight:400;color:var(--dark);line-height:1.1;margin-bottom:24px;}
.article-h1 em{font-style:italic;color:var(--gold);}
.article-meta{display:flex;align-items:center;gap:24px;font-size:12px;color:var(--light);letter-spacing:.08em;margin-bottom:40px;padding-bottom:32px;border-bottom:1px solid rgba(184,151,90,0.15);}
.article-meta-sep{width:4px;height:4px;background:var(--gold);border-radius:50%;}
.article-cover{width:100%;height:420px;overflow:hidden;margin-bottom:60px;}
.article-cover img{width:100%;height:100%;object-fit:cover;}
.article-layout{max-width:860px;margin:0 auto;padding:0 80px 80px;display:grid;grid-template-columns:1fr 280px;gap:80px;align-items:start;}
article{min-width:0;}
article h2{font-family:var(--font-serif);font-size:28px;font-weight:400;color:var(--dark);margin:48px 0 16px;line-height:1.3;}
article h3{font-family:var(--font-serif);font-size:20px;font-weight:400;color:var(--dark);margin:32px 0 12px;}
article p{font-size:15px;line-height:1.9;color:var(--mid);margin-bottom:20px;}
article strong{color:var(--dark);font-weight:500;}
article ul,article ol{padding-left:24px;margin-bottom:20px;}
article li{font-size:15px;line-height:1.9;color:var(--mid);margin-bottom:8px;}
article blockquote{border-left:3px solid var(--gold);padding:20px 28px;margin:32px 0;background:var(--warm);font-family:var(--font-serif);font-size:20px;font-style:italic;color:var(--dark);line-height:1.6;}
.highlight-box{background:var(--warm);border:1px solid rgba(184,151,90,0.2);padding:28px 32px;margin:32px 0;}
.highlight-box-title{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;}
.highlight-box p{margin-bottom:0;font-size:14px;}
.fact-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:32px 0;}
.fact-item{background:var(--warm);padding:20px 24px;border:1px solid rgba(184,151,90,0.1);}
.fact-number{font-family:var(--font-serif);font-size:36px;color:var(--gold);margin-bottom:4px;}
.fact-label{font-size:12px;color:var(--mid);line-height:1.5;}
.article-sidebar{position:sticky;top:100px;}
.sidebar-toc{background:var(--warm);padding:28px;border:1px solid rgba(184,151,90,0.15);margin-bottom:24px;}
.sidebar-toc-title{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;}
.sidebar-toc ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:10px;}
.sidebar-toc li a{font-size:12px;color:var(--mid);text-decoration:none;transition:color .3s;display:flex;align-items:flex-start;gap:8px;line-height:1.5;}
.sidebar-toc li a::before{content:'—';color:var(--gold);flex-shrink:0;font-size:10px;margin-top:2px;}
.sidebar-toc li a:hover{color:var(--dark);}
.sidebar-product{background:var(--dark);padding:28px;text-align:center;}
.sidebar-product-label{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;}
.sidebar-product-name{font-family:var(--font-serif);font-size:18px;color:var(--cream);margin-bottom:8px;line-height:1.3;}
.sidebar-product-price{font-size:14px;color:var(--gold-light);margin-bottom:20px;}
.sidebar-product-btn{display:block;padding:13px 20px;background:var(--gold);color:var(--dark);font-size:10px;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:background .3s;font-weight:500;}
.sidebar-product-btn:hover{background:var(--gold-light);}
.article-cta{background:var(--dark);padding:80px;text-align:center;}
.cta-eyebrow{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;}
.cta-title{font-family:var(--font-serif);font-size:clamp(28px,3.5vw,48px);font-weight:300;color:var(--cream);margin-bottom:16px;}
.cta-title em{font-style:italic;color:var(--gold-light);}
.cta-sub{font-size:14px;color:var(--light);margin-bottom:40px;line-height:1.8;max-width:500px;margin-left:auto;margin-right:auto;}
.cta-btn{display:inline-block;padding:18px 48px;background:var(--gold);color:var(--dark);font-size:11px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;transition:background .3s;font-weight:500;}
.cta-btn:hover{background:var(--gold-light);}
.related-section{padding:80px;background:var(--warm);}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px;}
.related-card{background:var(--cream);border:1px solid rgba(184,151,90,0.1);overflow:hidden;text-decoration:none;color:inherit;display:block;transition:transform .3s,box-shadow .3s;}
.related-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(28,22,18,0.1);}
.related-img{height:160px;overflow:hidden;}
.related-img img{width:100%;height:100%;object-fit:cover;}
.related-body{padding:20px 24px;}
.related-cat{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;}
.related-title{font-family:var(--font-serif);font-size:17px;font-weight:400;color:var(--dark);line-height:1.4;margin-bottom:8px;}
.related-read{font-size:10px;color:var(--light);letter-spacing:.1em;}
.footer-socials{display:flex;gap:16px;}
.footer-social{width:40px;height:40px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;color:var(--light);text-decoration:none;font-size:14px;transition:all .3s;}
.footer-social:hover{border-color:var(--gold);color:var(--gold);}
footer{background:var(--dark);color:var(--cream);padding:60px 80px 40px;}
.footer-top{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:60px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:32px;}
.footer-logo{font-family:var(--font-serif);font-size:24px;color:var(--cream);margin-bottom:12px;}
.footer-tagline{font-family:var(--font-serif);font-style:italic;font-size:14px;color:var(--light);line-height:1.7;margin-bottom:20px;}
.footer-col-title{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;}
.footer-links{list-style:none;display:flex;flex-direction:column;gap:10px;}
.footer-links a{font-size:13px;color:var(--light);text-decoration:none;transition:color .3s;}
.footer-links a:hover{color:var(--cream);}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--light);}
.footer-legal{display:flex;gap:24px;}
.footer-legal a{font-size:12px;color:var(--light);text-decoration:none;}
@media(max-width:600px){
  nav{padding:0 20px;}.nav-links{display:none;}.menu-toggle{display:flex;}
  .breadcrumb,.article-hero,.article-layout,.article-cta,.related-section,footer{padding-left:20px;padding-right:20px;}
  .article-layout{grid-template-columns:1fr;}.article-sidebar{position:static;}
  .related-grid{grid-template-columns:1fr;}
  .footer-top{grid-template-columns:1fr;gap:32px;}
  .footer-bottom{flex-direction:column;gap:12px;text-align:center;}
  .fact-grid{grid-template-columns:1fr;}
}
</style>"""

NAV = """<div class="announcement"><div class="announcement-track"><div class="announcement-item">Livraison Mondial Relay 72h OFFERTE dès 45€</div><div class="announcement-item">100% Naturel · Bio · Éco-Responsable</div><div class="announcement-item">Certifié OEKO TEX® Standard 100</div><div class="announcement-item">Plus de 500 avis ⭐ 4,8/5</div><div class="announcement-item">Livraison Mondial Relay 72h OFFERTE dès 45€</div><div class="announcement-item">100% Naturel · Bio · Éco-Responsable</div><div class="announcement-item">Certifié OEKO TEX® Standard 100</div><div class="announcement-item">Plus de 500 avis ⭐ 4,8/5</div></div></div>
<nav>
  <a href="../index" class="nav-logo">ALYA &amp; CO.</a>
  <ul class="nav-links">
    <li><a href="../index">Accueil</a></li>
    <li><a href="../collection-siwak">Brosse Siwak</a></li>
    <li><a href="../collection-gants">Gants Exfoliants</a></li>
    <li><a href="../nos-packs">Nos Packs</a></li>
    <li><a href="../notre-histoire">Notre Histoire</a></li>
    <li><a href="../blog">Blog</a></li>
    <li><a href="../contact">Contact</a></li>
  </ul>
  <div class="nav-right">
    <a href="../cart" class="nav-cart"><span style="font-size:18px">○</span> Panier<span class="cart-badge" id="cartBadge" style="display:none"></span></a>
    <button class="menu-toggle" id="menuToggle" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="mobile-nav" id="mobileNav">
  <a href="../index">Accueil</a>
  <a href="../collection-siwak">Brosse Siwak</a>
  <a href="../collection-gants">Gants Exfoliants</a>
  <a href="../nos-packs">Nos Packs</a>
  <a href="../notre-histoire">Notre Histoire</a>
  <a href="../blog">Blog</a>
  <a href="../contact">Contact</a>
</div>"""

FOOTER = """<footer>
  <div class="footer-top">
    <div>
      <div class="footer-logo">ALYA &amp; CO.</div>
      <div class="footer-tagline">"Bien-être, satisfaction, sourire."<br>Votre beauté naturelle, notre passion.</div>
      <div class="footer-socials">
        <a href="https://www.facebook.com/profile.php?id=61566346535440" target="_blank" aria-label="Facebook" class="footer-social">f</a>
        <a href="https://www.instagram.com/alyanco" target="_blank" aria-label="Instagram" class="footer-social">in</a>
        <a href="#" class="footer-social">tt</a>
      </div>
    </div>
    <div><div class="footer-col-title">Produits</div><ul class="footer-links"><li><a href="../produits/brosse-siwak">Brosse Siwak rechargeable</a></li><li><a href="../produits/tetes-recharges">Têtes-recharges</a></li><li><a href="../produits/dentifrice-siwak">Dentifrice Siwak</a></li><li><a href="../produits/gant-corps">Gant exfoliant corps</a></li><li><a href="../produits/gant-visage">Gant exfoliant visage</a></li></ul></div>
    <div><div class="footer-col-title">Informations</div><ul class="footer-links"><li><a href="../livraison">Livraison</a></li><li><a href="../contact">Nous contacter</a></li><li><a href="../notre-histoire">Notre histoire</a></li><li><a href="../blog">Blog &amp; conseils</a></li><li><a href="../cgv">CGV</a></li></ul></div>
    <div><div class="footer-col-title">Contact</div><ul class="footer-links"><li><a href="mailto:contact@alyanco.com">contact@alyanco.com</a></li></ul></div>
  </div>
  <div class="footer-bottom"><div class="footer-copy">© 2025 ALYA &amp; CO. Tous droits réservés.</div><div class="footer-legal"><a href="../cgv">CGV</a><a href="../mentions-legales">Mentions légales</a></div></div>
</footer>
<script src="../cart.js?v=5"></script>
<script src="/newsletter-popup.js"></script>
<script>
const menuToggle=document.getElementById('menuToggle'),mobileNav=document.getElementById('mobileNav');
menuToggle.addEventListener('click',()=>mobileNav.classList.toggle('open'));
const badge=document.getElementById('cartBadge');
if(badge){const c=typeof getCartCount==='function'?getCartCount():0;if(c>0){badge.textContent=c;badge.style.display='flex';}}
</script>"""

def make_article(slug, title, meta_desc, category, h1_html, breadcrumb, read_time, img_url, img_alt, content_html, toc_items, sidebar_product_name, sidebar_product_price, sidebar_product_url, cta_title, cta_sub, cta_btn_text, cta_btn_url, related):
    toc_html = '\n'.join(f'<li><a href="#{k}">{v}</a></li>' for k, v in toc_items)
    related_html = ''
    for r in related:
        related_html += f'''<a href="{r['url']}" class="related-card">
      <div class="related-img"><img src="{r['img']}" alt="{r['alt']}" loading="lazy" onerror="this.parentElement.style.background='var(--sand)'"></div>
      <div class="related-body"><div class="related-cat">{r['cat']}</div><div class="related-title">{r['title']}</div><div class="related-read">{r['time']}</div></div>
    </a>'''

    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — ALYA &amp; CO.</title>
<meta name="description" content="{meta_desc}">
<link rel="canonical" href="https://www.alyanco.com/blog/{slug}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="/cookies.js"></script>
{CSS}
</head>
<body>
{NAV}
<div class="breadcrumb">
  <a href="../index">Accueil</a><span>›</span>
  <a href="../blog">Blog</a><span>›</span>
  {breadcrumb}
</div>
<div class="article-hero">
  <div class="article-category">{category}</div>
  <h1 class="article-h1">{h1_html}</h1>
  <div class="article-meta">
    <span>Mai 2025</span>
    <span class="article-meta-sep"></span>
    <span>{read_time}</span>
    <span class="article-meta-sep"></span>
    <span>Par l'équipe ALYA &amp; CO.</span>
  </div>
</div>
<div style="max-width:860px;margin:0 auto;padding:0 80px;">
  <div class="article-cover">
    <img src="{img_url}" alt="{img_alt}" loading="lazy" onerror="this.parentElement.style.background='var(--sand)'">
  </div>
</div>
<div class="article-layout">
  <article>
{content_html}
  </article>
  <aside class="article-sidebar">
    <div class="sidebar-toc">
      <div class="sidebar-toc-title">Dans cet article</div>
      <ul>{toc_html}</ul>
    </div>
    <div class="sidebar-product">
      <div class="sidebar-product-label">Produit associé</div>
      <div class="sidebar-product-name">{sidebar_product_name}</div>
      <div class="sidebar-product-price">{sidebar_product_price}</div>
      <a href="{sidebar_product_url}" class="sidebar-product-btn">Découvrir →</a>
    </div>
  </aside>
</div>
<div class="article-cta">
  <div class="cta-eyebrow">ALYA &amp; CO.</div>
  <h2 class="cta-title">{cta_title}</h2>
  <p class="cta-sub">{cta_sub}</p>
  <a href="{cta_btn_url}" class="cta-btn">{cta_btn_text}</a>
</div>
<section class="related-section">
  <div style="max-width:1200px;margin:0 auto;">
    <div style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;">Continuer la lecture</div>
    <h2 style="font-family:var(--font-serif);font-size:clamp(28px,3vw,40px);font-weight:400;color:var(--dark);margin-bottom:0;">Articles <em style="font-style:italic;color:var(--gold)">recommandés</em></h2>
    <div class="related-grid" style="margin-top:40px;">{related_html}</div>
  </div>
</section>
{FOOTER}
</body>
</html>'''

# ── PHOTOS Unsplash ────────────────────────────────────────────────────────────
IMGS = {
    'siwak7':     'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=900&q=80&auto=format&fit=crop',
    'exfol':      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=80&auto=format&fit=crop',
    'kbeauty':    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=80&auto=format&fit=crop',
    'routine':    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&auto=format&fit=crop',
    'sensible':   'https://images.unsplash.com/photo-1556228720-da25f15e37af?w=900&q=80&auto=format&fit=crop',
    'dents':      'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=900&q=80&auto=format&fit=crop',
    'eco':        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80&auto=format&fit=crop',
}

RELATED_SIWAK = [
    {'url':'siwak-science-oms','img':'https://www.alyanco.com/cdn/shop/files/20250216-123456_0000.png','alt':'Siwak OMS','cat':'Siwak & Dents','title':'Le Siwak : ce que dit vraiment la science reconnue par l\'OMS','time':'8 min de lecture'},
    {'url':'dents-blanches-naturel','img':IMGS['dents'],'alt':'Dents blanches naturellement','cat':'Siwak & Dents','title':'Dents blanches sans peroxyde : les méthodes naturelles qui fonctionnent','time':'3 min de lecture'},
    {'url':'exfoliation-erreurs','img':IMGS['exfol'],'alt':'Exfoliation erreurs','cat':'Soie & Peau','title':'Exfoliation : les erreurs que tout le monde fait','time':'5 min de lecture'},
]
RELATED_PEAU = [
    {'url':'exfoliation-erreurs','img':IMGS['exfol'],'alt':'Erreurs exfoliation','cat':'Soie & Peau','title':'Exfoliation : les erreurs que tout le monde fait','time':'5 min de lecture'},
    {'url':'peau-sensible-exfoliation','img':IMGS['sensible'],'alt':'Peau sensible','cat':'Soie & Peau','title':'Peau sensible : les 5 règles d\'or pour une exfoliation sans irritation','time':'5 min de lecture'},
    {'url':'soie-murier-superieure-gants','img':'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_3.png','alt':'Soie de mûrier','cat':'Soie & Peau','title':'Pourquoi la soie de mûrier est supérieure à tous les autres gants exfoliants','time':'5 min de lecture'},
]
RELATED_ECO = [
    {'url':'zero-dechet-salle-de-bain','img':IMGS['eco'],'alt':'Zéro déchet','cat':'Éco-responsabilité','title':'Zéro déchet dans sa salle de bain : le guide complet','time':'4 min de lecture'},
    {'url':'siwak-7-proprietes','img':IMGS['siwak7'],'alt':'Siwak propriétés','cat':'Siwak & Dents','title':'7 propriétés méconnues du bois de Siwak','time':'6 min de lecture'},
    {'url':'routine-beaute-naturelle','img':IMGS['routine'],'alt':'Routine naturelle','cat':'Routines','title':'Ma routine beauté 100% naturelle : 5 gestes simples','time':'4 min de lecture'},
]

# ── ARTICLE 1 : 7 propriétés Siwak ────────────────────────────────────────────
art1 = make_article(
    slug='siwak-7-proprietes',
    title='7 propriétés méconnues du bois de Siwak pour votre santé bucco-dentaire',
    meta_desc='Antibactérien, anti-inflammatoire, reminéralisant... Le Siwak (Salvadora persica) regorge de bienfaits scientifiquement prouvés. Découvrez les 7 propriétés qui en font la brosse naturelle la plus complète au monde.',
    category='Siwak & Dents',
    h1_html='7 propriétés méconnues<br>du bois de <em>Siwak</em>',
    breadcrumb='Siwak & Propriétés',
    read_time='6 min de lecture',
    img_url=IMGS['siwak7'],
    img_alt='Bois de Siwak naturel - propriétés bucco-dentaires',
    toc_items=[
        ('antibact','1. Antibactérien naturel'),
        ('inflam','2. Anti-inflammatoire'),
        ('remin','3. Reminéralisant'),
        ('deodorant','4. Déodorant buccal'),
        ('antiplaque','5. Anti-plaque'),
        ('gencives','6. Protège les gencives'),
        ('eco','7. Éco-responsable'),
    ],
    sidebar_product_name='Brosse Siwak Rechargeable',
    sidebar_product_price='12,99 €',
    sidebar_product_url='../produits/brosse-siwak',
    cta_title='Essayez la brosse<br><em>Siwak ALYA & CO.</em>',
    cta_sub='Toutes ces propriétés dans une brosse rechargeable, élégante et éco-responsable. Plus de 400 études. Une seule brosse.',
    cta_btn_text='Découvrir la brosse Siwak',
    cta_btn_url='../produits/brosse-siwak',
    related=RELATED_SIWAK,
    content_html="""    <p>Le Siwak est bien plus qu'une simple branche. Derrière cet outil millénaire se cache une pharmacopée naturelle d'une richesse exceptionnelle. Plus de <strong>400 études scientifiques</strong> publiées dans des revues médicales internationales ont analysé ses composés actifs. Voici les 7 propriétés qui font du bois de Siwak la brosse à dents la plus complète — et la plus naturelle — qui existe.</p>

    <div class="fact-grid">
      <div class="fact-item"><div class="fact-number">19+</div><div class="fact-label">composés actifs identifiés dans le bois de Siwak</div></div>
      <div class="fact-item"><div class="fact-number">400+</div><div class="fact-label">études scientifiques publiées</div></div>
      <div class="fact-item"><div class="fact-number">1986</div><div class="fact-label">recommandation officielle de l'OMS</div></div>
      <div class="fact-item"><div class="fact-number">7000</div><div class="fact-label">ans d'utilisation documentée</div></div>
    </div>

    <h2 id="antibact">1. 🦠 Un antibactérien naturel d'exception</h2>
    <p>Le Siwak contient de la <strong>salvadorine</strong> et de la <strong>triméthylamine</strong>, deux composés aux puissantes propriétés antibactériennes. Ces substances inhibent naturellement la prolifération des bactéries responsables des caries (<em>Streptococcus mutans</em>) et des maladies parodontales.</p>
    <p>Une étude publiée dans le <em>Journal of Ethnopharmacology</em> a montré que l'extrait de Siwak réduit la croissance bactérienne de plus de 60% comparé à un placebo. En pratique, cela signifie moins de plaque, moins de caries, des gencives plus saines.</p>

    <blockquote>Le Siwak présente une activité antibactérienne supérieure à de nombreux dentifrices commerciaux contre les principales bactéries bucco-dentaires.<br><small>— Journal of Ethnopharmacology, 2015</small></blockquote>

    <h2 id="inflam">2. 🌿 Anti-inflammatoire pour des gencives apaisées</h2>
    <p>Les <strong>tanins</strong> et les <strong>flavonoïdes</strong> présents dans le bois de Siwak exercent une action anti-inflammatoire directe sur les gencives. Ils réduisent les rougeurs, les saignements et l'irritation gingival — des symptômes souvent associés à la gingivite légère à modérée.</p>
    <p>Si vous avez les gencives sensibles qui saignent lors du brossage, le passage au Siwak peut faire une différence notable en quelques semaines d'utilisation régulière.</p>

    <h2 id="remin">3. 💎 Reminéralisant grâce au fluorure naturel</h2>
    <p>Contrairement à une idée reçue, le Siwak contient du <strong>fluorure naturel</strong> — le même minéral que l'on retrouve dans les dentifrices conventionnels, mais sous une forme organique que le corps assimile progressivement. Ce fluorure renforce l'émail dentaire, le rend plus résistant aux acides alimentaires et prévient les caries.</p>
    <p>La <strong>silice</strong> contenue dans le bois agit en parallèle comme un abrasif doux, polissant l'émail sans l'abîmer — contrairement aux dentifrices blanchissants agressifs.</p>

    <div class="highlight-box">
      <div class="highlight-box-title">✦ Le saviez-vous ?</div>
      <p>Le Siwak contient également du calcium, du phosphore et du magnésium — trois minéraux essentiels à la reminéralisation de l'émail et à la solidité des dents.</p>
    </div>

    <h2 id="deodorant">4. 🌸 Déodorant buccal durable</h2>
    <p>L'huile essentielle naturellement présente dans le Siwak lui confère une <strong>légère odeur de menthe sauvage et de bois</strong>, qui laisse l'haleine fraîche sans recourir à des arômes artificiels. Plus important : en éliminant les bactéries responsables des mauvaises odeurs buccales, le Siwak traite la cause plutôt que de masquer le symptôme.</p>
    <p>L'effet se distingue clairement des chewing-gums ou bains de bouche qui ne font que couvrir temporairement les odeurs.</p>

    <h2 id="antiplaque">5. 🧹 Anti-plaque mécanique et chimique</h2>
    <p>Le bois de Siwak agit sur deux niveaux simultanément. D'abord mécaniquement : ses <strong>fibres naturelles</strong>, lorsqu'elles sont mâchées et écartées, forment une brosse douce et précise qui nettoie les espaces interdentaires difficilement accessibles. Ensuite chimiquement : ses composés actifs dissolvent la plaque bactérienne en perturbant sa structure biofilm.</p>
    <p>C'est cette double action qui lui a valu la reconnaissance de l'OMS en 1986 comme outil d'hygiène bucco-dentaire efficace et accessible.</p>

    <h2 id="gencives">6. 🛡️ Protège et raffermit les gencives</h2>
    <p>Les <strong>résines astringentes</strong> du Siwak ont un effet raffermissant sur les tissus gingivaux. En stimulant la circulation sanguine locale lors du massage des gencives, le Siwak favorise leur tonicité et leur résistance aux agressions. Des études ont montré une réduction significative de l'indice gingival chez des utilisateurs réguliers après 4 semaines d'utilisation quotidienne.</p>

    <h2 id="eco">7. 🌍 Éco-responsable et zéro déchet</h2>
    <p>En France, <strong>plus d'un milliard de brosses à dents en plastique</strong> sont jetées chaque année — et la quasi-totalité finit en décharge ou dans les océans, mettant entre 400 et 500 ans à se dégrader. Le Siwak, lui, est 100% biodégradable, cultivé sans pesticides et ne génère aucun déchet plastique.</p>
    <p>La brosse rechargeable ALYA & CO. va encore plus loin : seule la tête se remplace, réduisant les déchets de 80% par rapport à une brosse classique. Un geste pour votre santé, et pour la planète.</p>
"""
)

# ── ARTICLE 2 : Exfoliation erreurs ───────────────────────────────────────────
art2 = make_article(
    slug='exfoliation-erreurs',
    title='Exfoliation : les erreurs que tout le monde fait (et comment les éviter)',
    meta_desc='Trop souvent, trop fort, avec des produits agressifs... L\'exfoliation mal pratiquée abîme la peau au lieu de la sublimer. Découvrez les erreurs les plus courantes et comment s\'exfolier correctement avec un gant en soie de mûrier.',
    category='Soie & Peau',
    h1_html='Exfoliation : les erreurs<br>que tout le monde fait <em>(et comment les éviter)</em>',
    breadcrumb='Exfoliation & Erreurs',
    read_time='5 min de lecture',
    img_url=IMGS['exfol'],
    img_alt='Exfoliation peau - gant soie de mûrier ALYA & CO.',
    toc_items=[
        ('frequence','1. Trop souvent'),
        ('force','2. Trop fort'),
        ('produits','3. Mauvais produits'),
        ('timing','4. Mauvais moment'),
        ('apres','5. Oublier l\'après'),
        ('solution','La bonne méthode'),
    ],
    sidebar_product_name='Gant Exfoliant Corps\nSoie de Mûrier',
    sidebar_product_price='21,59 €',
    sidebar_product_url='../produits/gant-corps',
    cta_title='Le gant qui ne fait <em>aucune erreur</em>',
    cta_sub='Le gant en soie de mûrier ALYA & CO. exfolie en douceur, sans abimer la peau. Idéal même pour les peaux sensibles. Certifié OEKO TEX®.',
    cta_btn_text='Découvrir le gant exfoliant',
    cta_btn_url='../produits/gant-corps',
    related=RELATED_PEAU,
    content_html="""    <p>L'exfoliation est l'un des gestes les plus mal maîtrisés de la routine beauté. Trop agressive, trop fréquente, ou avec les mauvais outils, elle peut paradoxalement <strong>abîmer la peau</strong> qu'on cherche à sublimer : rougeurs, irritations, assèchement, vieillissement prématuré... Voici les 5 erreurs les plus courantes et, surtout, comment les corriger.</p>

    <h2 id="frequence">❌ Erreur n°1 : Exfolier trop souvent</h2>
    <p>C'est l'erreur numéro un. Beaucoup pensent que plus on s'exfolie, plus la peau sera lisse. C'est faux. La peau a besoin de temps pour se régénérer. La couche cornée — cette barrière protectrice superficielle — se renouvelle naturellement en <strong>28 à 30 jours</strong>. Si on l'attaque trop souvent, on fragilise cette barrière, on expose la peau aux UV et aux bactéries, et on provoque une production excessive de sébum en réaction.</p>
    <p><strong>La bonne fréquence :</strong> 1 à 2 fois par semaine maximum pour la plupart des peaux. Les peaux sensibles : 1 fois par semaine ou tous les 10 jours.</p>

    <h2 id="force">❌ Erreur n°2 : Frotter trop fort</h2>
    <p>Un gant exfoliant n'est pas une éponge à récurer. Frotter avec force n'enlève pas plus de cellules mortes — cela <strong>irrite et micro-abrase</strong> la peau saine, provoque des rougeurs persistantes et peut même entraîner des télangiectasies (petits vaisseaux apparents). La pression doit être douce, les mouvements circulaires et lents.</p>

    <blockquote>La peau n'a pas besoin de violence pour se renouveler. Elle a besoin de douceur et de régularité.<br><small>— ALYA & CO.</small></blockquote>

    <h2 id="produits">❌ Erreur n°3 : Utiliser des produits trop agressifs</h2>
    <p>Les gommages avec des granules de plastique (microbilles), des éclats de noix de coco ou d'abricot présentent des bords irréguliers qui créent des micro-coupures invisibles à l'œil nu. Ces micro-traumatismes répétés accélèrent le vieillissement cutané et perturbent le microbiome de la peau.</p>
    <p>La <strong>soie de mûrier</strong> est l'alternative idéale : ses fibres naturelles et lisses exfolient mécaniquement sans jamais créer de lésions. C'est pour cette raison qu'elle est recommandée même pour les peaux sensibles et les personnes atteintes d'eczéma léger.</p>

    <div class="highlight-box">
      <div class="highlight-box-title">✦ Soie de mûrier vs gommages agressifs</div>
      <p>Contrairement aux gommages au sel, au sucre ou aux microbilles, la soie de mûrier n'irrite pas, ne dessèche pas et ne pollue pas les océans. Elle exfolie en profondeur par simple friction mécanique, sans aucun produit chimique ajouté.</p>
    </div>

    <h2 id="timing">❌ Erreur n°4 : Exfolier au mauvais moment</h2>
    <p>S'exfolier le matin expose la peau fraîchement renouvelée aux agressions de la journée : UV, pollution, froid... L'idéal est d'exfolier <strong>le soir</strong>, après une douche ou un bain chaud qui a ouvert les pores. La peau peut ensuite se régénérer pendant la nuit, le moment où elle est naturellement la plus active.</p>
    <p>À éviter absolument : s'exfolier avant une exposition prolongée au soleil, sur une peau avec des coupures ou une inflammation, ou juste avant d'appliquer des produits acides (AHA, BHA, rétinol).</p>

    <h2 id="apres">❌ Erreur n°5 : Négliger l'après-exfoliation</h2>
    <p>Après l'exfoliation, la peau est propre, lisse... et vulnérable. Les pores sont dilatés, la barrière cutanée temporairement fragilisée. Ne pas hydrater immédiatement après est une erreur qui prive la peau du soin dont elle a besoin au moment le plus crucial.</p>
    <p>Appliquez <strong>dans les 3 minutes</strong> suivant la douche (avant que la peau ne sèche complètement) un soin hydratant ou une huile végétale. C'est dans cette fenêtre que la peau absorbe le mieux les actifs.</p>

    <h2 id="solution">✅ La bonne méthode avec le gant soie de mûrier</h2>
    <ul>
      <li>Humidifiez le gant à l'eau tiède (pas bouillante)</li>
      <li>Appliquez sur peau mouillée, mouvements circulaires doux</li>
      <li>Commencez par les jambes et remontez vers le cœur</li>
      <li>Évitez le contour des yeux et les zones irritées</li>
      <li>Rincez à l'eau tiède, puis fraîche pour refermer les pores</li>
      <li>Hydratez immédiatement après séchage</li>
      <li>Lavez le gant après chaque utilisation, séchez à l'air libre</li>
    </ul>
"""
)

# ── ARTICLE 3 : Routine K-beauty éco ──────────────────────────────────────────
art3 = make_article(
    slug='routine-kbeauty-eco',
    title='Routine beauté coréenne adaptée aux produits naturels : la méthode K-beauty éco',
    meta_desc='La K-beauty mise sur la douceur, la naturalité et la régularité plutôt que sur la quantité de produits. Découvrez comment adopter une routine beauté coréenne éco-responsable avec des produits 100% naturels.',
    category='Routines',
    h1_html='La méthode<br><em>K-beauty éco</em>',
    breadcrumb='K-beauty & Naturel',
    read_time='7 min de lecture',
    img_url=IMGS['kbeauty'],
    img_alt='Routine beauté coréenne naturelle K-beauty',
    toc_items=[
        ('principe','Les principes K-beauty'),
        ('double','Le double nettoyage naturel'),
        ('exfol','L\'exfoliation douce'),
        ('hydrat','L\'hydratation en couches'),
        ('protect','La protection'),
        ('routine','La routine complète'),
    ],
    sidebar_product_name='Pack 1 an Full Body\nSoie de Mûrier',
    sidebar_product_price='29,99 €',
    sidebar_product_url='../produits/pack-1an-full-body',
    cta_title='Commencez votre routine<br><em>beauté naturelle</em>',
    cta_sub='Les gants en soie de mûrier ALYA & CO. sont l\'outil parfait pour une routine K-beauty éco : doux, naturels, certifiés OEKO TEX® et fabriqués de manière éthique.',
    cta_btn_text='Découvrir nos gants',
    cta_btn_url='../collection-gants',
    related=RELATED_PEAU,
    content_html="""    <p>La K-beauty — abréviation de <em>Korean Beauty</em> — est bien plus qu'une tendance : c'est une philosophie de soin qui place la <strong>santé de la peau avant son apparence</strong>. Contrairement aux routines occidentales souvent agressives et chargées en produits chimiques, l'approche coréenne privilégie la douceur, la régularité et des ingrédients naturels. Voici comment l'adapter pour une routine 100% éco-responsable.</p>

    <h2 id="principe">Les grands principes de la K-beauty</h2>
    <p>Avant de parler de produits, il faut comprendre la philosophie. La K-beauty repose sur <strong>quatre piliers fondamentaux</strong> :</p>
    <ul>
      <li><strong>La prévention avant la correction</strong> : prendre soin de sa peau au quotidien plutôt que de chercher à réparer les dégâts</li>
      <li><strong>La douceur</strong> : ne jamais agresser la peau, même lors de l'exfoliation ou du nettoyage</li>
      <li><strong>La régularité</strong> : une routine simple et constante vaut mieux qu'un traitement intensif occasionnel</li>
      <li><strong>L'hydratation en profondeur</strong> : une peau bien hydratée est une peau saine, lumineuse et résistante</li>
    </ul>

    <h2 id="double">Le double nettoyage naturel</h2>
    <p>Le double nettoyage est la base de toute routine K-beauty. Il se fait en deux étapes distinctes :</p>
    <p><strong>Première étape — nettoyage à l'huile :</strong> une huile végétale (argan, jojoba, chanvre) appliquée sur peau sèche dissout le maquillage, le sébum et les polluants gras. Elle respecte le film hydrolipidique naturel de la peau.</p>
    <p><strong>Deuxième étape — nettoyant doux :</strong> un gel nettoyant aqueux à base de plantes retire les impuretés hydrosolubles restantes sans assécher. Cherchez des formules sans sulfates (SLS/SLES) et sans parfums synthétiques.</p>

    <h2 id="exfol">L'exfoliation douce : 1 à 2 fois par semaine</h2>
    <p>En K-beauty, l'exfoliation est douce, ciblée et jamais quotidienne. L'outil phare de l'exfoliation naturelle ? Le <strong>gant en soie de mûrier</strong>. Ses fibres de soie naturelle éliminent les cellules mortes par simple friction mécanique, sans aucun produit chimique, sans irriter et sans altérer le microbiome cutané.</p>
    <p>Résultat : une peau lisse, lumineuse, prête à absorber les soins qui suivent. Les Coréennes l'appellent le "Italy towel" ou "exfoliating mitt" — en soie naturelle, c'est encore mieux.</p>

    <div class="highlight-box">
      <div class="highlight-box-title">✦ Astuce K-beauty</div>
      <p>Après l'exfoliation au gant soie de mûrier, appliquez immédiatement une essence ou un sérum hydratant. La peau venait d'être préparée et absorbe les actifs 3 à 4 fois plus efficacement.</p>
    </div>

    <h2 id="hydrat">L'hydratation en couches (layering)</h2>
    <p>Le <em>layering</em> est la technique coréenne d'application de soins en couches fines et successives. Chaque couche est légère, absorbée avant la suivante :</p>
    <ol>
      <li><strong>Toner/brume florale</strong> : prépare et rééquilibre le pH de la peau</li>
      <li><strong>Essence</strong> : premier niveau d'hydratation active</li>
      <li><strong>Sérum ou ampoule</strong> : actifs concentrés (vitamine C, acide hyaluronique naturel, niacinamide)</li>
      <li><strong>Crème hydratante légère</strong> : scelle l'hydratation</li>
      <li><strong>Huile végétale (le soir)</strong> : nourrit et répare pendant la nuit</li>
    </ol>

    <h2 id="protect">La protection solaire — l'étape la plus importante</h2>
    <p>Les Coréennes ne sortent jamais sans SPF. La protection solaire est considérée comme <strong>l'anti-âge le plus efficace</strong> qui existe, bien avant les sérums et crèmes. En K-beauty naturelle, on choisit des filtres minéraux (dioxyde de titane, oxyde de zinc) plutôt que des filtres chimiques controversés.</p>

    <h2 id="routine">La routine K-beauty naturelle complète</h2>
    <p><strong>Le matin (5 min) :</strong> nettoyant doux → toner → sérum → crème légère → SPF</p>
    <p><strong>Le soir (10 min) :</strong> double nettoyage → exfoliation soie de mûrier (2x/semaine) → toner → essence → sérum → crème riche ou huile végétale</p>
    <p>Simple, naturelle, efficace. La K-beauty éco, c'est prendre soin de soi en prenant soin de la planète.</p>
"""
)

# ── ARTICLE 4 : Routine beauté naturelle ──────────────────────────────────────
art4 = make_article(
    slug='routine-beaute-naturelle',
    title='Ma routine beauté 100% naturelle : 5 gestes simples pour une peau lumineuse',
    meta_desc='Une peau lumineuse ne nécessite pas des dizaines de produits. Découvrez 5 gestes simples, naturels et accessibles pour transformer votre peau en quelques semaines. Sans chimie, sans compromis.',
    category='Routines',
    h1_html='5 gestes simples pour<br>une peau <em>lumineuse</em>',
    breadcrumb='Routine Beauté Naturelle',
    read_time='4 min de lecture',
    img_url=IMGS['routine'],
    img_alt='Routine beauté naturelle - soins visage',
    toc_items=[
        ('nettoyage','1. Nettoyer en douceur'),
        ('exfoliation','2. Exfolier une fois par semaine'),
        ('hydratation','3. Hydrater généreusement'),
        ('sommeil','4. Soigner son sommeil'),
        ('alimentation','5. Nourrir de l\'intérieur'),
    ],
    sidebar_product_name='Gant Exfoliant Visage\nSoie de Mûrier',
    sidebar_product_price='13,19 €',
    sidebar_product_url='../produits/gant-visage',
    cta_title='Le geste qui change tout :<br><em>l\'exfoliation à la soie</em>',
    cta_sub='Une fois par semaine, le gant en soie de mûrier ALYA & CO. révèle une peau neuve, lumineuse, prête à absorber vos soins. Simple. Naturel. Efficace.',
    cta_btn_text='Découvrir le gant visage',
    cta_btn_url='../produits/gant-visage',
    related=RELATED_PEAU,
    content_html="""    <p>La peau lumineuse n'est pas une question de génétique ou de portefeuille. C'est avant tout une question de <strong>régularité et de bons gestes</strong>. Voici une routine épurée, 100% naturelle, que n'importe qui peut adopter dès ce soir.</p>

    <div class="fact-grid">
      <div class="fact-item"><div class="fact-number">28j</div><div class="fact-label">le cycle naturel de renouvellement de la peau</div></div>
      <div class="fact-item"><div class="fact-number">3min</div><div class="fact-label">la fenêtre d'hydratation idéale après la douche</div></div>
      <div class="fact-item"><div class="fact-number">2×</div><div class="fact-label">la fréquence idéale d'exfoliation par semaine</div></div>
      <div class="fact-item"><div class="fact-number">8h</div><div class="fact-label">de sommeil pour une peau réparée</div></div>
    </div>

    <h2 id="nettoyage">1. 🧴 Nettoyer en douceur, matin et soir</h2>
    <p>Le nettoyage est la base de toute bonne peau. Mais attention : sur-nettoyer ou utiliser des produits trop agressifs détruisent le microbiome cutané naturel et déclenchent une surproduction de sébum. Choisissez un <strong>nettoyant doux, sans sulfates</strong>, adapté à votre type de peau.</p>
    <p>Le matin : une eau micellaire ou un simple rinçage à l'eau tiède suffisent — la peau n'a pas besoin d'un nettoyage intensif au réveil. Le soir : un nettoyant plus complet pour retirer les résidus de la journée (pollution, sébum, maquillage).</p>

    <h2 id="exfoliation">2. ✨ Exfolier une fois par semaine avec un gant en soie</h2>
    <p>C'est le geste transformateur. <strong>Une fois par semaine</strong>, passez le gant en soie de mûrier sur votre visage mouillé, en mouvements circulaires doux pendant 1 à 2 minutes. Vous retirerez les cellules mortes accumulées qui ternissent le teint et bouchent les pores.</p>
    <p>Résultat immédiat : une peau plus lisse, plus lumineuse, et une meilleure absorption de vos soins. La soie de mûrier est si douce qu'elle convient même aux peaux sensibles — contrairement aux gommages grains ou aux AHA chimiques.</p>

    <blockquote>Une peau bien exfoliée absorbe les soins 3 à 4 fois mieux qu'une peau non préparée. C'est l'investissement le plus rentable de votre routine.<br><small>— ALYA & CO.</small></blockquote>

    <h2 id="hydratation">3. 💧 Hydrater généreusement, systématiquement</h2>
    <p>L'hydratation est l'étape que l'on bâcle le plus souvent. Pourtant, une peau bien hydratée rebondit, éclaire le teint, résiste mieux aux agressions et vieillit plus lentement. La règle d'or : appliquer son hydratant <strong>dans les 3 minutes après la douche</strong>, sur peau encore légèrement humide.</p>
    <p>Pour le visage : alternez entre un sérum à l'acide hyaluronique (matin) et une crème riche aux actifs naturels (soir). Pour le corps : une huile végétale pure (argan, rose musquée, amande douce) suffit et pénètre mieux que la plupart des laits.</p>

    <h2 id="sommeil">4. 🌙 Soigner son sommeil : le meilleur soin de nuit</h2>
    <p>Entre 22h et 2h du matin, la peau est en <strong>mode réparation maximal</strong>. Elle produit du collagène, renouvelle ses cellules, élimine les toxines accumulées. Un sommeil de mauvaise qualité ou insuffisant se lit directement sur le teint le lendemain : teint terne, cernes, manque d'éclat.</p>
    <p>Conseils pratiques : couchez-vous avant 23h, dormez dans une pièce fraîche et aérée, utilisez une taie d'oreiller en soie (elle évite les marques et les frottements qui créent des rides).</p>

    <h2 id="alimentation">5. 🥗 Nourrir la peau de l'intérieur</h2>
    <p>Aucune crème ne compense une mauvaise alimentation. La peau reflète directement ce que vous mangez. Les aliments qui font briller le teint : les <strong>oméga-3</strong> (poissons gras, noix, graines de lin), la <strong>vitamine C</strong> (agrumes, kiwi, poivron rouge), le <strong>zinc</strong> (graines de courge, légumineuses), et surtout l'eau — minimum 1,5 litre par jour.</p>
    <p>À réduire : le sucre raffiné (principal facteur de glycation cutanée), l'alcool et les produits ultra-transformés, qui oxydent et ternissent le teint.</p>
"""
)

# ── ARTICLE 5 : Peau sensible ─────────────────────────────────────────────────
art5 = make_article(
    slug='peau-sensible-exfoliation',
    title='Peau sensible : les 5 règles d\'or pour une exfoliation sans irritation',
    meta_desc='La peau sensible peut et doit être exfoliée — mais avec les bons outils et la bonne méthode. Découvrez les 5 règles essentielles pour exfolier sans irriter, et pourquoi la soie de mûrier est l\'alliée des peaux réactives.',
    category='Soie & Peau',
    h1_html='Peau sensible :<br>les 5 règles d\'or de <em>l\'exfoliation</em>',
    breadcrumb='Peau Sensible & Exfoliation',
    read_time='5 min de lecture',
    img_url=IMGS['sensible'],
    img_alt='Peau sensible - exfoliation douce soie de mûrier',
    toc_items=[
        ('frequence','Règle 1 : Fréquence réduite'),
        ('outil','Règle 2 : Outil adapté'),
        ('temperature','Règle 3 : Température de l\'eau'),
        ('pression','Règle 4 : Pression minimale'),
        ('apres','Règle 5 : Soin post-exfoliation'),
    ],
    sidebar_product_name='Gant Exfoliant Corps\nSoie de Mûrier',
    sidebar_product_price='21,59 €',
    sidebar_product_url='../produits/gant-corps',
    cta_title='Exfoliez en toute sécurité,<br>même avec une <em>peau sensible</em>',
    cta_sub='Le gant en soie de mûrier ALYA & CO. est le seul outil d\'exfoliation recommandé pour les peaux sensibles et réactives. Certifié OEKO TEX®, sans aucun produit chimique.',
    cta_btn_text='Voir le gant soie de mûrier',
    cta_btn_url='../produits/gant-corps',
    related=RELATED_PEAU,
    content_html="""    <p>Avoir la peau sensible ne signifie pas renoncer à l'exfoliation. Cela signifie simplement <strong>adapter sa méthode</strong>. Une peau sensible non exfoliée accumule des cellules mortes, devient terne et absorbe moins bien les soins. En revanche, une exfoliation inadaptée peut provoquer des irritations, des rougeurs et aggraver la réactivité cutanée. Voici les 5 règles d'or pour exfolier intelligemment.</p>

    <h2 id="frequence">Règle 1 🗓️ : Réduire la fréquence</h2>
    <p>Pour une peau normale, on recommande 1 à 2 exfoliations par semaine. Pour une peau sensible, on descend à <strong>une fois tous les 7 à 10 jours</strong>. Cette fréquence permet d'éliminer les cellules mortes accumulées sans surcharger la barrière cutanée ni provoquer d'inflammation.</p>
    <p>Si votre peau réagit (rougeurs, tiraillements) après une exfoliation, espacez encore davantage et vérifiez votre technique et votre outil.</p>

    <h2 id="outil">Règle 2 🧤 : Choisir le bon outil — et un seul</h2>
    <p>Pour les peaux sensibles, l'outil d'exfoliation est décisif. Bannissez les éponges loofahs (qui hébergent des bactéries), les gants synthétiques (trop agressifs), les gommages avec grains (bords irréguliers qui créent des micro-coupures) et les AHA concentrés (acides chimiques potentiellement irritants).</p>
    <p>L'outil de référence pour les peaux sensibles : le <strong>gant en soie de mûrier</strong>. Ses fibres naturelles, lisses et souples, exfolient mécaniquement en douceur. Elles ne créent aucune lésion, ne perturbent pas le microbiome cutané et n'irritent pas les peaux réactives. La soie de mûrier est d'ailleurs utilisée dans les spas dermatologiques coréens et japonais pour les peaux les plus fragiles.</p>

    <blockquote>La soie de mûrier est l'un des rares matériaux naturels dont la structure protéique est compatible avec celle de la peau humaine. Elle exfolie sans agresser.<br><small>— ALYA & CO.</small></blockquote>

    <div class="highlight-box">
      <div class="highlight-box-title">✦ Peau sensible ou peau réactive ?</div>
      <p>La peau sensible réagit aux stimuli extérieurs (friction, froid, chaleur). La peau réactive réagit aux ingrédients (parfums, alcool, conservateurs). Les deux bénéficient de l'exfoliation à la soie de mûrier — sans produit chimique ajouté.</p>
    </div>

    <h2 id="temperature">Règle 3 🌡️ : Surveiller la température de l'eau</h2>
    <p>L'eau trop chaude dilate les vaisseaux sanguins et aggrave la réactivité des peaux sensibles. Pour l'exfoliation, utilisez une <strong>eau tiède</strong> (environ 35°C). Après l'exfoliation, un rinçage à l'eau fraîche (pas froide) aide à refermer les pores et à calmer l'éventuelle légère rougeur post-exfoliation.</p>

    <h2 id="pression">Règle 4 🤲 : Pression minimale, efficacité maximale</h2>
    <p>Avec la soie de mûrier, la pression n'est pas l'alliée de l'efficacité — c'est son ennemie. <strong>Appuyez très légèrement</strong>, laissez le gant travailler. Les fibres de soie font leur travail par simple contact et friction douce. Des mouvements circulaires, amples et réguliers sur peau mouillée suffisent.</p>
    <p>Testez d'abord sur une petite zone (avant-bras, jambe) pour évaluer la réaction de votre peau avant de passer au visage ou aux zones plus réactives.</p>

    <h2 id="apres">Règle 5 💆 : Le soin post-exfoliation, étape non négociable</h2>
    <p>Après chaque exfoliation, la peau sensible a besoin d'un soin apaisant immédiat. Appliquez dès la sortie de la douche :</p>
    <ul>
      <li>Un <strong>lait ou huile végétale apaisante</strong> : aloe vera, calendula, camomille, huile de rose musquée</li>
      <li>Évitez les actifs potentiellement irritants les 24h suivantes : rétinol, vitamine C concentrée, acides</li>
      <li>Si rougeur persistante : gel d'aloe vera pur au réfrigérateur — effet calmant immédiat</li>
    </ul>
    <p>En respectant ces 5 règles, même la peau la plus sensible peut bénéficier d'une exfoliation régulière et révéler un teint lumineux et uniforme.</p>
"""
)

# ── ARTICLE 6 : Dents blanches naturel ────────────────────────────────────────
art6 = make_article(
    slug='dents-blanches-naturel',
    title='Dents blanches sans peroxyde : les méthodes naturelles qui fonctionnent vraiment',
    meta_desc='Blanchissement au charbon, huile de coco, Siwak, bicarbonate... Quelles méthodes naturelles sont réellement efficaces pour avoir des dents blanches ? La réponse scientifique, sans compromis.',
    category='Siwak & Dents',
    h1_html='Dents blanches sans peroxyde :<br>ce qui <em>fonctionne vraiment</em>',
    breadcrumb='Dents Blanches Naturelles',
    read_time='3 min de lecture',
    img_url=IMGS['dents'],
    img_alt='Dents blanches naturelles - sourire sain',
    toc_items=[
        ('siwak','Le Siwak'),
        ('charbon','Charbon actif'),
        ('bicarbonate','Bicarbonate de soude'),
        ('huile','Bain d\'huile'),
        ('alimentaire','Alimentation'),
    ],
    sidebar_product_name='Pack Brosse Siwak Complet',
    sidebar_product_price='24,99 €',
    sidebar_product_url='../produits/pack-siwak-complet',
    cta_title='Le sourire naturel<br>commence par le <em>Siwak</em>',
    cta_sub='Brosse Siwak + têtes recharges + dentifrice en poudre : tout ce qu\'il faut pour blanchir naturellement et durablement, sans peroxyde ni produits chimiques.',
    cta_btn_text='Découvrir le Pack Siwak',
    cta_btn_url='../produits/pack-siwak-complet',
    related=RELATED_SIWAK,
    content_html="""    <p>Le marché du blanchiment dentaire pèse plusieurs milliards d'euros, mais beaucoup de produits utilisent du peroxyde d'hydrogène — efficace mais potentiellement irritant pour les gencives et l'émail sur le long terme. Existe-t-il des alternatives naturelles réellement efficaces ? La réponse est <strong>oui — avec des nuances importantes</strong>.</p>

    <h2 id="siwak">⭐ Le Siwak : l'option la plus complète</h2>
    <p>Le Siwak est sans doute la méthode naturelle de blanchiment la plus complète. Son mécanisme d'action est double :</p>
    <ul>
      <li>La <strong>silice</strong> présente dans le bois agit comme un abrasif très doux qui polit l'émail et élimine les taches superficielles (thé, café, tabac) sans l'abimer</li>
      <li>Ses composés antibactériens empêchent la formation de plaque, principale responsable du jaunissement</li>
    </ul>
    <p>Résultat : des dents progressivement plus blanches et surtout plus <em>saines</em> — une combinaison qu'aucun kit de blanchiment chimique ne peut offrir. L'effet est moins spectaculaire qu'un blanchiment au peroxyde, mais durable et sans risque pour l'émail.</p>

    <div class="highlight-box">
      <div class="highlight-box-title">✦ Ce que dit la science</div>
      <p>Une étude comparative de 2014 a montré que l'utilisation régulière du Siwak réduit la coloration extrinsèque des dents de manière comparable aux dentifrices blanchissants du commerce, sans les effets secondaires de sensibilité.</p>
    </div>

    <h2 id="charbon">🖤 Charbon actif : efficace mais à utiliser avec précaution</h2>
    <p>Le charbon actif est très à la mode. Il est réel que ses propriétés absorbantes lui permettent de capturer certaines molécules colorantes. Cependant : le charbon est <strong>abrasif</strong>, et son utilisation trop fréquente peut rayer l'émail à long terme. À utiliser maximum une fois par semaine, pas plus.</p>
    <p>Le charbon <strong>ne blanchit pas</strong> à proprement parler : il absorbe les taches superficielles sans agir sur la couleur intrinsèque de la dent. Ne vous attendez pas à retrouver des dents blanches si elles sont naturellement ivoire.</p>

    <h2 id="bicarbonate">🧂 Bicarbonate de soude : avec modération</h2>
    <p>Le bicarbonate est légèrement abrasif et alcalin — il neutralise les acides qui favorisent le dépôt de taches. Son efficacité pour enlever les taches superficielles est réelle. Mais comme le charbon, son abrasivité impose de ne pas l'utiliser plus d'une fois tous les 15 jours sur l'émail.</p>
    <p>Mélangez une pincée avec votre dentifrice naturel, brossez pendant 2 minutes, rincez abondamment. Évitez si vous avez des gencives sensibles ou des restaurations dentaires (plombages, couronnes).</p>

    <h2 id="huile">🥥 Bain d'huile (oil pulling) : les effets réels</h2>
    <p>L'oil pulling (gargarisme à l'huile de coco pendant 15-20 min) est une pratique ayurvédique ancienne. Les études montrent qu'il <strong>réduit les bactéries buccales</strong> et améliore la santé des gencives — ce qui aide indirectement à prévenir les taches liées à la plaque. Son effet blanchissant direct est en revanche modeste.</p>
    <p>C'est néanmoins un complément utile dans une routine d'hygiène bucco-dentaire naturelle, surtout pour les personnes qui souffrent de gingivite ou de mauvaise haleine.</p>

    <h2 id="alimentaire">🍓 Alimentation : éviter les taches, c'est déjà blanchir</h2>
    <p>Le meilleur blanchiment naturel reste préventif. Les principaux aliments qui tachent les dents : thé, café, vin rouge, cola, betterave, sauce tomate. Une astuce simple : rincez-vous la bouche à l'eau après consommation, et attendez 30 minutes avant de vous brosser les dents (les acides ramollissent temporairement l'émail).</p>
    <p>À l'inverse, certains aliments aident à maintenir la blancheur : les <strong>pommes</strong> (abrasif naturel doux et stimulant salivaire), le <strong>fromage</strong> (reminéralisant, hausse le pH buccal) et les <strong>crudités croquantes</strong>.</p>
"""
)

# ── ARTICLE 7 : Empreinte carbone beauté ──────────────────────────────────────
art7 = make_article(
    slug='empreinte-carbone-beaute',
    title='Comment réduire son empreinte carbone dans sa routine beauté quotidienne ?',
    meta_desc='La beauté durable est possible. Découvrez comment réduire significativement votre empreinte carbone dans votre routine beauté, des petits gestes du quotidien aux alternatives naturelles qui font vraiment la différence.',
    category='Éco-responsabilité',
    h1_html='Réduire son empreinte carbone<br>dans sa routine <em>beauté</em>',
    breadcrumb='Empreinte Carbone & Beauté',
    read_time='3 min de lecture',
    img_url=IMGS['eco'],
    img_alt='Beauté naturelle éco-responsable zéro déchet',
    toc_items=[
        ('chiffres','Les chiffres qui font réfléchir'),
        ('emballages','Réduire les emballages'),
        ('produits','Choisir des produits concentrés'),
        ('rechargeable','Opter pour le rechargeable'),
        ('naturels','Privilégier les ingrédients naturels'),
    ],
    sidebar_product_name='Pack Brosse Siwak Complet',
    sidebar_product_price='24,99 €',
    sidebar_product_url='../produits/pack-siwak-complet',
    cta_title='La beauté éco-responsable,<br>c\'est <em>maintenant</em>',
    cta_sub='ALYA & CO. propose des alternatives 100% naturelles, rechargeables et biodégradables à vos produits d\'hygiène quotidiens. Un geste pour vous, un geste pour la planète.',
    cta_btn_text='Découvrir nos produits',
    cta_btn_url='../index',
    related=RELATED_ECO,
    content_html="""    <p>L'industrie cosmétique génère chaque année <strong>plus de 120 milliards d'emballages plastiques</strong> dans le monde. En France, la routine beauté d'une personne représente en moyenne 7 à 12 kg de déchets plastiques par an. Bonne nouvelle : quelques changements simples peuvent réduire cette empreinte de manière significative.</p>

    <h2 id="chiffres">📊 Les chiffres qui font réfléchir</h2>
    <div class="fact-grid">
      <div class="fact-item"><div class="fact-number">120Md</div><div class="fact-label">emballages cosmétiques produits chaque année dans le monde</div></div>
      <div class="fact-item"><div class="fact-number">1Md+</div><div class="fact-label">brosses à dents plastiques jetées en France chaque année</div></div>
      <div class="fact-item"><div class="fact-number">400ans</div><div class="fact-label">durée de dégradation d'une brosse à dents en plastique</div></div>
      <div class="fact-item"><div class="fact-number">80%</div><div class="fact-label">de réduction des déchets avec des produits rechargeables</div></div>
    </div>

    <h2 id="emballages">📦 Réduire les emballages : le premier pas</h2>
    <p>L'emballage représente en moyenne <strong>30 à 40% de l'empreinte carbone</strong> d'un produit cosmétique. Pour réduire cet impact :</p>
    <ul>
      <li>Achetez en <strong>grands formats</strong> ou en recharges quand c'est possible</li>
      <li>Privilégiez les marques qui utilisent du verre, de l'aluminium ou du carton recyclé</li>
      <li>Évitez les emballages multiples (boîte dans une boîte dans un sachet...)</li>
      <li>Choisissez les solides (shampoings, savons, dentifrices) : pas d'emballage plastique, formule concentrée</li>
    </ul>

    <h2 id="produits">🌿 Choisir des produits concentrés et multifonctions</h2>
    <p>Un produit concentré, c'est moins d'eau transportée, moins d'emballage, moins de CO2. L'huile végétale pure est l'exemple parfait : elle hydrate le corps, le visage, les cheveux et les ongles — quatre produits en un, dans un seul flacon en verre réutilisable.</p>
    <p>Le <strong>dentifrice Siwak en poudre</strong> ALYA & CO. illustre ce principe : pas d'eau, pas de tube plastique, formule concentrée en actifs naturels, conditionnée en verre. Son empreinte carbone est 70% inférieure à un dentifrice classique en tube.</p>

    <h2 id="rechargeable">🔄 Opter pour le rechargeable : le geste le plus impactant</h2>
    <p>Le passage au rechargeable est <strong>le geste individuel le plus efficace</strong> en termes de réduction des déchets. Une brosse à dents rechargeable avec têtes interchangeables génère 80% moins de plastique qu'une brosse classique sur 3 ans d'utilisation.</p>
    <p>Le gant en soie de mûrier s'inscrit dans la même logique : un seul gant dure 6 à 12 mois avec un entretien minimal, remplaçant des dizaines de gommages en sachets individuels.</p>

    <blockquote>Chaque achat est un vote. Choisir des produits rechargeables et naturels, c'est choisir quel type d'industrie on veut soutenir.<br><small>— ALYA & CO.</small></blockquote>

    <h2 id="naturels">🌱 Privilégier les ingrédients naturels et biodégradables</h2>
    <p>Les ingrédients synthétiques sont produits à partir de pétrochimie (une ressource fossile non renouvelable) et certains ne sont pas biodégradables — ils persistent dans les eaux et les écosystèmes. Les ingrédients naturels certifiés bio, eux, se dégradent naturellement et sont produits sans pesticides.</p>
    <p>Lors de vos achats, cherchez les certifications : <strong>ECOCERT, COSMOS Organic, OEKO TEX®</strong> (pour les textiles comme les gants en soie) — elles garantissent que les ingrédients et les procédés de fabrication respectent des critères environnementaux stricts.</p>
    <p>Adopter une routine beauté éco-responsable ne demande pas de sacrifice. Souvent, les produits naturels et rechargeables sont plus efficaces, plus sains pour la peau, et plus économiques sur le long terme. C'est un alignement rare entre ce qui est bon pour vous et ce qui est bon pour la planète.</p>
"""
)

# ── Écriture des fichiers ──────────────────────────────────────────────────────
articles = [
    ('siwak-7-proprietes.html', art1),
    ('exfoliation-erreurs.html', art2),
    ('routine-kbeauty-eco.html', art3),
    ('routine-beaute-naturelle.html', art4),
    ('peau-sensible-exfoliation.html', art5),
    ('dents-blanches-naturel.html', art6),
    ('empreinte-carbone-beaute.html', art7),
]

for filename, content in articles:
    path = os.path.join(BASE, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'OK : blog/{filename}')

print(f'\n{len(articles)} articles créés.')
