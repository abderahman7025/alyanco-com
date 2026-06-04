/* ================================================================
   ALYA & CO. — Moteur i18n
   FR (défaut HTML) | EN | NL | IT | PT | ES | DE
   Architecture : chargement dynamique du fichier langue
   ================================================================ */
(function () {
  'use strict';

  var LANG_LABELS = { fr:'Français', en:'English', nl:'Nederlands', it:'Italiano', pt:'Português', es:'Español', de:'Deutsch' };
  var LANG_FLAGS  = { fr:'🇫🇷', en:'🇬🇧', nl:'🇳🇱', it:'🇮🇹', pt:'🇵🇹', es:'🇪🇸', de:'🇩🇪' };
  /* Codes ISO 3166-1 alpha-2 pour flagcdn.com */
  var LANG_FLAG_CC = { fr:'fr', en:'gb', nl:'nl', it:'it', pt:'pt', es:'es', de:'de' };
  function langFlag(cc, w) {
    w = w || 20;
    var h = Math.round(w * 3 / 4);
    /* flagcdn.com : taille minimale disponible = w20 */
    var srcW = w < 20 ? 20 : w;
    return '<img src="https://flagcdn.com/w' + srcW + '/' + LANG_FLAG_CC[cc] + '.png" width="' + w + '" height="' + h + '" alt="" loading="eager" style="display:inline-block;vertical-align:middle;border-radius:2px;">';
  }

  /* ── HELPERS ── */
  function getLang()  { return localStorage.getItem('alya_lang') || 'fr'; }
  function setLang(l) { localStorage.setItem('alya_lang', l); location.reload(); }
  function qs(s)   { return document.querySelector(s); }
  function qsa(s)  { return document.querySelectorAll(s); }
  function set(sel, text, asHtml) {
    var e = qs(sel); if (!e) return;
    if (asHtml) e.innerHTML = text; else e.textContent = text;
  }
  function setIn(container, sel, text, asHtml) {
    if (!container || !text) return;
    var e = container.querySelector(sel); if (!e) return;
    if (asHtml) e.innerHTML = text; else e.textContent = text;
  }
  function setAll(sel, text, asHtml) {
    qsa(sel).forEach(function(e){
      if (asHtml) e.innerHTML = text; else e.textContent = text;
    });
  }
  function replaceTextNode(el, search, replacement) {
    if (!el) return;
    el.childNodes.forEach(function(n){
      if (n.nodeType === 3 && n.textContent.indexOf(search) !== -1)
        n.textContent = n.textContent.replace(search, replacement);
    });
  }
  function getPageId() {
    var p = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    var parts = p.split('/').filter(Boolean);
    if (!parts.length || parts[parts.length-1] === 'index') return 'home';
    return parts[parts.length-1];
  }

  /* ================================================================
     CSS DU SÉLECTEUR
     ================================================================ */
  function injectCSS() {
    if (document.getElementById('alya-i18n-css')) return;
    var s = document.createElement('style');
    s.id = 'alya-i18n-css';
    s.textContent = [
      '.lang-sel{position:relative;display:inline-flex;align-items:center;}',
      '.lang-btn{display:flex;align-items:center;gap:5px;background:none;border:1px solid rgba(184,151,90,.28);',
      'padding:5px 11px;cursor:pointer;font-family:inherit;font-size:10px;font-weight:500;',
      'letter-spacing:.18em;text-transform:uppercase;color:var(--mid,#6B5B4E);transition:all .3s;}',
      '.lang-btn:hover{border-color:var(--gold,#B8975A);color:var(--dark,#1C1612);}',
      '.lang-drop{display:none;position:absolute;top:calc(100% + 8px);right:0;',
      'background:var(--cream,#FAF6F1);border:1px solid rgba(184,151,90,.2);',
      'box-shadow:0 16px 48px rgba(28,22,18,.13);min-width:152px;z-index:300;flex-direction:column;}',
      '.lang-sel.open .lang-drop{display:flex;}',
      '.lang-opt{display:flex;align-items:center;gap:9px;padding:10px 14px;background:none;border:none;',
      'border-bottom:1px solid rgba(184,151,90,.08);font-family:inherit;font-size:11px;font-weight:400;',
      'letter-spacing:.1em;color:var(--mid,#6B5B4E);cursor:pointer;text-align:left;transition:all .2s;width:100%;}',
      '.lang-opt:last-child{border-bottom:none;}',
      '.lang-opt:hover{background:var(--warm,#F2E8DD);color:var(--dark,#1C1612);}',
      '.lang-opt.active{color:var(--gold,#B8975A);font-weight:500;}',
      '.mob-langs{display:flex;flex-wrap:wrap;gap:7px;padding:14px 0 4px;',
      'border-top:1px solid rgba(184,151,90,.12);margin-top:6px;}',
      '.mob-lang-btn{background:none;border:1px solid rgba(184,151,90,.28);padding:5px 10px;',
      'font-family:inherit;font-size:10px;letter-spacing:.12em;text-transform:uppercase;',
      'color:var(--mid,#6B5B4E);cursor:pointer;transition:all .25s;}',
      '.mob-lang-btn.active,.mob-lang-btn:hover{border-color:var(--gold,#B8975A);color:var(--gold,#B8975A);}',
      /* Nav : grid 3 colonnes — logo gauche | liens centrés | droite */
      'nav{display:grid!important;grid-template-columns:1fr auto 1fr!important;align-items:center!important;}',
      '.nav-logo{white-space:nowrap!important;}',
      '.nav-links{justify-self:center!important;}',
      '.nav-right{justify-self:end!important;}',
      /* Icône panier SVG */
      '.nav-cart-icon{display:inline-flex;align-items:center;vertical-align:middle;}',
      '.nav-cart-icon svg{display:block;}',
      /* Mobile : logo prend tout l'espace, texte "Panier" masqué */
      '@media(max-width:768px){',
        'nav{grid-template-columns:1fr auto!important;}',
        '.nav-logo{font-size:20px!important;letter-spacing:.08em!important;}',
        '.nav-cart-text{display:none!important;}',
        '.nav-cart{gap:4px!important;}',
      '}',
      /* Curseur custom masqué sur mobile / écrans tactiles */
      '@media(hover:none),(pointer:coarse){',
        '.cursor-dot,.cursor-ring{display:none!important;}',
        'body{cursor:auto!important;}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ================================================================
     UPGRADE ICÔNE PANIER + FIX MOBILE LOGO
     ================================================================ */
  function upgradeNavCart() {
    var navCart = qs('.nav-cart');
    if (!navCart || navCart.dataset.upgraded) return;
    navCart.dataset.upgraded = '1';
    /* Remplace ○ par un SVG sac de courses */
    var cartIcon = navCart.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.className = 'nav-cart-icon';
      cartIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>';
    }
    /* Enveloppe le texte "Panier" dans un span masquable */
    Array.from(navCart.childNodes).forEach(function(n) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        var sp = document.createElement('span');
        sp.className = 'nav-cart-text';
        sp.textContent = n.textContent;
        navCart.replaceChild(sp, n);
      }
    });
  }

  /* ================================================================
     INJECTION DU SÉLECTEUR DANS LA NAV
     ================================================================ */
  function injectSelector(currentLang) {
    if (qs('.lang-sel')) return; // déjà injecté
    var navRight = qs('.nav-right');
    if (!navRight) return;

    var wrap = document.createElement('div');
    wrap.className = 'lang-sel';

    var btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.setAttribute('aria-label', 'Language / Langue');
    btn.innerHTML = langFlag(currentLang, 20) + ' <span>' + currentLang.toUpperCase() + '</span><span style="font-size:8px;margin-left:2px">▾</span>';

    var drop = document.createElement('div');
    drop.className = 'lang-drop';

    Object.keys(LANG_LABELS).forEach(function(l){
      var opt = document.createElement('button');
      opt.className = 'lang-opt' + (l === currentLang ? ' active' : '');
      opt.innerHTML = langFlag(l, 20) + ' ' + LANG_LABELS[l];
      opt.addEventListener('click', function(){ setLang(l); });
      drop.appendChild(opt);
    });

    wrap.appendChild(btn);
    wrap.appendChild(drop);

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', function(){ wrap.classList.remove('open'); });

    var toggle = qs('.menu-toggle');
    navRight.insertBefore(wrap, toggle || null);

    /* Mobile nav */
    var mobileNav = qs('.mobile-nav');
    if (mobileNav) {
      var mobWrap = document.createElement('div');
      mobWrap.className = 'mob-langs';
      Object.keys(LANG_LABELS).forEach(function(l){
        var mb = document.createElement('button');
        mb.className = 'mob-lang-btn' + (l === currentLang ? ' active' : '');
        mb.innerHTML = langFlag(l, 16) + ' ' + l.toUpperCase();
        mb.addEventListener('click', function(){ setLang(l); });
        mobWrap.appendChild(mb);
      });
      mobileNav.appendChild(mobWrap);
    }
  }

  /* ================================================================
     APPLICATION DES TRADUCTIONS COMMUNES
     ================================================================ */
  function applyCommon(t) {
    /* Barre d'annonce */
    var items = qsa('.announcement-item');
    items.forEach(function(el, i){ el.textContent = t.announce[i % t.announce.length]; });

    /* Nav desktop */
    setAll('.nav-links a[href$="index"]',           t.nav_home);
    setAll('.nav-links a[href$="collection-siwak"]', t.nav_siwak);
    setAll('.nav-links a[href$="collection-gants"]', t.nav_gants);
    setAll('.nav-links a[href$="nos-packs"]',        t.nav_packs);
    setAll('.nav-links a[href$="notre-histoire"]',   t.nav_histoire);
    setAll('.nav-links a[href$="blog"]',             t.nav_blog);
    setAll('.nav-links a[href$="contact"]',          t.nav_contact);
    var cartTxt = qs('.nav-cart-text');
    if (cartTxt) cartTxt.textContent = ' ' + t.nav_cart;
    else replaceTextNode(qs('.nav-cart'), 'Panier', t.nav_cart);

    /* Nav mobile */
    qsa('.mobile-nav a').forEach(function(a){
      var h = a.getAttribute('href') || '';
      if      (h.indexOf('index') !== -1)            a.textContent = t.nav_home;
      else if (h.indexOf('collection-siwak') !== -1) a.textContent = t.nav_siwak;
      else if (h.indexOf('collection-gants') !== -1) a.textContent = t.nav_gants;
      else if (h.indexOf('nos-packs') !== -1)        a.textContent = t.nav_packs;
      else if (h.indexOf('notre-histoire') !== -1)   a.textContent = t.nav_histoire;
      else if (h.indexOf('/blog') !== -1 || h === 'blog') a.textContent = t.nav_blog;
      else if (h.indexOf('contact') !== -1 && a.textContent.indexOf('○') === -1) a.textContent = t.nav_contact;
    });

    /* Footer colonnes */
    var fcols = qsa('.footer-col-title');
    if (fcols[0]) fcols[0].textContent = t.footer_products;
    if (fcols[1]) fcols[1].textContent = t.footer_info;
    if (fcols[2]) fcols[2].textContent = t.footer_contact_col;

    /* Footer textes */
    var tagline = qs('.footer-tagline'); if (tagline) tagline.innerHTML = t.footer_tagline;
    var copy    = qs('.footer-copy');    if (copy)    copy.textContent  = t.footer_copy;

    /* Footer liens produits */
    setAll('footer a[href$="brosse-siwak"]',      t.footer_brosse);
    setAll('footer a[href$="tetes-recharges"]',   t.footer_tetes);
    setAll('footer a[href$="dentifrice-siwak"]',  t.footer_dent);
    setAll('footer a[href$="gant-corps"]',        t.footer_gc);
    setAll('footer a[href$="gant-visage"]',       t.footer_gv);
    setAll('footer a[href$="pack-1an-full-body"]', t.footer_pack1an);

    /* Footer liens info */
    setAll('footer a[href$="notre-histoire"]',    t.footer_histoire);
    setAll('footer a[href$="livraison"]',         t.footer_livraison);
    setAll('footer a[href$="blog"]',              t.footer_blog);
    setAll('footer a[href$="cgv"]',               t.footer_cgv);
    setAll('footer a[href$="mentions-legales"]',  t.footer_mentions);
    qsa('footer .footer-links a[href$="contact"]').forEach(function(a){ a.textContent = t.footer_nous; });
    qsa('footer .footer-links a[href$="faq"]').forEach(function(a){ a.textContent = 'FAQ'; });

    /* Footer réponse sous 24h */
    qsa('footer .footer-links li').forEach(function(li){
      if (li.textContent.indexOf('Réponse') !== -1) li.innerHTML = t.footer_response;
    });

    /* Footer barre légale */
    var legal = qsa('.footer-legal a');
    if (legal[0]) legal[0].textContent = t.footer_legal_cgv;
    if (legal[1]) legal[1].textContent = t.footer_legal_conf;
    if (legal[2]) legal[2].textContent = t.footer_legal_mentions;

    /* HTML lang */
    document.documentElement.lang = t._lang || 'fr';

    /* Textes décoratifs "Soie" */
    if (t.word_silk) {
      var decorSoie = qs('#decor-soie');
      if (decorSoie) decorSoie.textContent = t.word_silk;
    }

    /* Mot "avis" dans les étoiles des cartes produit */
    if (t._lang && t._lang !== 'fr' && t.word_reviews) {
      function translateAvis() {
        qsa('.product-stars span, .stars-count, .reviews-avg-count').forEach(function(el) {
          if (el.textContent.indexOf('avis') !== -1) {
            el.textContent = el.textContent.replace(/avis/gi, t.word_reviews);
          }
        });
      }
      translateAvis();
      /* Rappel après que les handlers de page aient éventuellement modifié le DOM */
      setTimeout(translateAvis, 200);
    }
  }

  /* ================================================================
     APPLICATION DES TRADUCTIONS PAR PAGE
     ================================================================ */
  function applyPage(t, page) {
    var p = t.pages && t.pages[page];

    /* ── Pages produit ── */
    if (p && p.eyebrow) set('.product-eyebrow', p.eyebrow);
    if (p && p.title)   set('.product-title', p.title, true);
    if (p && p.desc)    set('.product-description', p.desc, true);
    if (p && p.bullets) {
      var lis = qsa('.product-bullets li');
      p.bullets.forEach(function(txt, i){ if (lis[i]) lis[i].textContent = txt; });
    }
    setAll('.btn-atc', t.btn_atc);
    setAll('.product-ctas .btn-outline', t.btn_back);
    setAll('.review-verified', t.verified);

    /* ── FAQ ── */
    if (page === 'faq' && t.faq) applyFaq(t);

    /* ── Contact ── */
    if (page === 'contact' && t.contact) applyContact(t);

    /* ── Notre histoire ── */
    if (page === 'notre-histoire' && t.histoire) applyHistoire(t);

    /* ── Livraison ── */
    if (page === 'livraison' && t.livraison) applyLivraison(t);

    /* ── Chouchou soie ── */
    if (page === 'chouchou-soie' && t.chouchou_page) applyChouchouSoie(t);

    /* ── Collection Siwak ── */
    if (page === 'collection-siwak' && t.col_siwak) applyColSiwak(t);

    /* ── Collection Gants ── */
    if (page === 'collection-gants' && t.col_gants) applyColGants(t);

    /* ── Nos packs ── */
    if (page === 'nos-packs' && t.nos_packs) applyNosPacks(t);

    /* ── Blog index ── */
    if (page === 'blog' && t.blog) applyBlog(t);

    /* ── Blog articles ── */
    if (t.blog_articles && t.blog_articles[page]) applyBlogArticle(t, page);

    /* ── Panier ── */
    if (page === 'cart') applyCart(t);

    /* ── Checkout / paiement ── */
    if (page === 'checkout' || page === 'paiement') applyCheckout(t);

    /* ── Page home ── */
    if (page === 'home') applyHome(t);

    /* ── Pages produit génériques ── */
    var productPageIds = [
      'brosse-siwak','tetes-recharges','dentifrice-siwak',
      'gant-corps','gant-visage',
      'pack-1an-full-body','pack-siwak-complet','pack-tetes-x3','pack-dentifrice-3m'
    ];
    if (productPageIds.indexOf(page) !== -1) applyProductPage(t, page);
  }

  /* ================================================================
     PAGES PRODUIT GÉNÉRIQUES
     ================================================================ */
  function applyProductPage(t, page) {
    var pd = t.product_pages && t.product_pages[page]; if (!pd) return;

    /* Breadcrumb dernier noeud texte */
    var bc = qs('.breadcrumb');
    if (bc && pd.breadcrumb) {
      var bcLast = bc.lastChild;
      while (bcLast && bcLast.nodeType !== 3) bcLast = bcLast.previousSibling;
      if (bcLast && bcLast.nodeType === 3) bcLast.textContent = pd.breadcrumb;
    }

    /* Nombre d'avis */
    if (pd.stars_count) set('.stars-count', pd.stars_count);

    /* Section description */
    var ds = qs('.product-description-section');
    if (ds) {
      var ey = ds.querySelector('.section-eyebrow'); if (ey && pd.desc_eyebrow) ey.textContent = pd.desc_eyebrow;
      var h2 = ds.querySelector('.section-title');   if (h2 && pd.desc_title)   h2.innerHTML = pd.desc_title;
      var ps = ds.querySelectorAll('.desc-col:first-child p');
      (pd.desc_paragraphs || []).forEach(function(txt, i){ if (ps[i]) ps[i].textContent = txt; });
      var h3 = ds.querySelector('h3'); if (h3 && pd.specs_title) h3.textContent = pd.specs_title;
      var specs = ds.querySelectorAll('.desc-specs li');
      (pd.specs || []).forEach(function(sp, i) {
        if (!specs[i]) return;
        var span = specs[i].querySelector('span');
        var tn = specs[i].childNodes[0];
        if (tn && tn.nodeType === 3) tn.textContent = sp[0] + ' ';
        if (span) span.textContent = sp[1];
      });
    }

    /* Section FAQ */
    var fs = qs('.faq-section');
    if (fs) {
      var fEy = fs.querySelector('.section-header .section-eyebrow'); if (fEy && pd.faq_eyebrow) fEy.textContent = pd.faq_eyebrow;
      var fTi = fs.querySelector('.section-header .section-title');   if (fTi && pd.faq_title)   fTi.innerHTML = pd.faq_title;
      var items = fs.querySelectorAll('.faq-item');
      (pd.faq || []).forEach(function(qa, i) {
        if (!items[i]) return;
        var q = items[i].querySelector('.faq-question span:first-child');
        var a = items[i].querySelector('.faq-answer p');
        if (q) q.textContent = qa[0];
        if (a) a.textContent = qa[1];
      });
    }

    /* Section produits liés */
    var rs = qs('.related-section');
    if (rs) {
      var rEy = rs.querySelector('.section-eyebrow'); if (rEy && pd.related_eyebrow) rEy.textContent = pd.related_eyebrow;
      var rTi = rs.querySelector('.section-title');   if (rTi && pd.related_title)   rTi.innerHTML = pd.related_title;
      var cards = rs.querySelectorAll('.product-card');
      (pd.related || []).forEach(function(rel, i) {
        if (!cards[i]) return;
        var nm  = cards[i].querySelector('.product-name');       if (nm  && rel[0]) nm.textContent  = rel[0];
        var ds2 = cards[i].querySelector('.product-desc-short'); if (ds2 && rel[1]) ds2.textContent = rel[1];
      });
    }

    /* Newsletter */
    var nl = qs('.newsletter-section');
    if (nl) {
      var nEy = nl.querySelector('.section-eyebrow'); if (nEy && pd.nl_eyebrow) nEy.textContent = pd.nl_eyebrow;
      var nTi = nl.querySelector('.newsletter-title'); if (nTi && pd.nl_title)  nTi.innerHTML = pd.nl_title;
      var nSb = nl.querySelector('.newsletter-sub');   if (nSb && pd.nl_sub)    nSb.textContent = pd.nl_sub;
      var nIn = nl.querySelector('.newsletter-input'); if (nIn && pd.nl_ph)     nIn.placeholder = pd.nl_ph;
      var nBt = nl.querySelector('.newsletter-btn');   if (nBt && pd.nl_btn)    nBt.textContent = pd.nl_btn;
    }

    /* Section avis */
    var rv = qs('.reviews-section');
    if (rv) {
      var rvEy = rv.querySelector('.reviews-eyebrow'); if (rvEy && pd.reviews_eyebrow) rvEy.textContent = pd.reviews_eyebrow;
      var rvTi = rv.querySelector('.reviews-title');   if (rvTi && pd.reviews_title)   rvTi.innerHTML = pd.reviews_title;
    }

    /* Sliders avant/après */
    if (pd.ba_before) qsa('.ba-label-before').forEach(function(el){ el.textContent = pd.ba_before; });
    if (pd.ba_after)  qsa('.ba-label-after').forEach(function(el){ el.textContent = pd.ba_after; });
    if (pd.ba_tabs) {
      var tabs = qsa('.ba-tab');
      pd.ba_tabs.forEach(function(txt, i){ if (tabs[i]) tabs[i].textContent = txt; });
    }
    if (pd.ba_captions) {
      var caps = qsa('.ba-caption');
      pd.ba_captions.forEach(function(html, i){ if (caps[i]) caps[i].innerHTML = html; });
    }
    /* Section titre avant/après */
    if (pd.ba_section_eyebrow) set('.ba-section .section-eyebrow', pd.ba_section_eyebrow);
    if (pd.ba_section_title)   set('.ba-section .section-title', pd.ba_section_title, true);
    if (pd.ba_intro)           set('.ba-intro', pd.ba_intro);

    /* Bundle upsell */
    if (pd.upsell_badge)  { var ub = qs('#upsell-badge');  if (ub) ub.textContent = pd.upsell_badge; }
    if (pd.upsell_title)  { var ut = qs('#upsell-title');  if (ut) ut.textContent = pd.upsell_title; }
    if (pd.upsell_desc)   { var ud = qs('#upsell-desc');   if (ud) ud.textContent = pd.upsell_desc; }
    if (pd.upsell_saving) { var us = qs('#upsell-saving'); if (us) us.textContent = pd.upsell_saving; }
    if (pd.upsell_btn)    { var ubtn = qs('#upsell-btn');  if (ubtn) ubtn.textContent = pd.upsell_btn; }

    /* Section contenu du pack */
    if (pd.pack_contents_title) set('.pack-contents-title', pd.pack_contents_title);
    if (pd.pack_items) {
      var items = qsa('.pack-item');
      pd.pack_items.forEach(function(item, i) {
        if (!items[i]) return;
        var nm = items[i].querySelector('.pack-item-name');
        var pr = items[i].querySelector('.pack-item-price');
        if (nm && item[0]) nm.textContent = item[0];
        if (pr && item[1]) pr.textContent = item[1];
      });
    }
  }

  function applyChouchouSoie(t) {
    var c = t.chouchou_page; if (!c) return;

    /* Breadcrumb dernier élément */
    var bc = qs('.breadcrumb');
    if (bc && bc.lastChild && bc.lastChild.nodeType === 3) bc.lastChild.textContent = c.breadcrumb;

    /* Nombre d'avis */
    set('.stars-count', c.stars_count);

    /* Section description */
    var ds = qs('.product-description-section');
    if (ds) {
      var ey = ds.querySelector('.section-eyebrow'); if (ey) ey.textContent = c.desc_eyebrow;
      var h2 = ds.querySelector('.section-title');   if (h2) h2.innerHTML = c.desc_title;
      var ps = ds.querySelectorAll('.desc-col:first-child p');
      (c.desc_paragraphs || []).forEach(function(txt, i){ if (ps[i]) ps[i].textContent = txt; });
      var h3 = ds.querySelector('h3'); if (h3) h3.textContent = c.specs_title;
      var specs = ds.querySelectorAll('.desc-specs li');
      (c.specs || []).forEach(function(sp, i) {
        if (!specs[i]) return;
        var span = specs[i].querySelector('span');
        var tn = specs[i].childNodes[0];
        if (tn && tn.nodeType === 3) tn.textContent = sp[0] + ' ';
        if (span) span.textContent = sp[1];
      });
    }

    /* Section FAQ */
    var fs = qs('.faq-section');
    if (fs) {
      var fEy = fs.querySelector('.section-header .section-eyebrow'); if (fEy) fEy.textContent = c.faq_eyebrow;
      var fTi = fs.querySelector('.section-header .section-title');   if (fTi) fTi.innerHTML = c.faq_title;
      var items = fs.querySelectorAll('.faq-item');
      (c.faq || []).forEach(function(qa, i) {
        if (!items[i]) return;
        var q = items[i].querySelector('.faq-question span:first-child');
        var a = items[i].querySelector('.faq-answer p');
        if (q) q.textContent = qa[0];
        if (a) a.textContent = qa[1];
      });
    }

    /* Section produits liés */
    var rs = qs('.related-section');
    if (rs) {
      var rEy = rs.querySelector('.section-eyebrow'); if (rEy) rEy.textContent = c.related_eyebrow;
      var rTi = rs.querySelector('.section-title');   if (rTi) rTi.innerHTML = c.related_title;
      var cards = rs.querySelectorAll('.product-card');
      (c.related || []).forEach(function(rel, i) {
        if (!cards[i]) return;
        var nm = cards[i].querySelector('.product-name');       if (nm) nm.textContent = rel[0];
        var ds2 = cards[i].querySelector('.product-desc-short'); if (ds2) ds2.textContent = rel[1];
      });
    }

    /* Newsletter */
    var nl = qs('.newsletter-section');
    if (nl) {
      var nEy = nl.querySelector('.section-eyebrow'); if (nEy) nEy.textContent = c.nl_eyebrow;
      var nTi = nl.querySelector('.newsletter-title'); if (nTi) nTi.innerHTML = c.nl_title;
      var nSb = nl.querySelector('.newsletter-sub');   if (nSb) nSb.textContent = c.nl_sub;
      var nIn = nl.querySelector('.newsletter-input'); if (nIn) nIn.placeholder = c.nl_ph;
      var nBt = nl.querySelector('.newsletter-btn');   if (nBt) nBt.textContent = c.nl_btn;
    }

    /* Section avis */
    var rv = qs('.reviews-section');
    if (rv) {
      var rEy2 = rv.querySelector('.reviews-eyebrow'); if (rEy2) rEy2.textContent = c.reviews_eyebrow;
      var rTi2 = rv.querySelector('.reviews-title');   if (rTi2) rTi2.innerHTML = c.reviews_title;
    }
  }

  function applyHome(t) {
    if (!t.home) return;
    var h = t.home;

    /* ── Hero ── */
    set('.hero-badge', h.badge);
    /* Titre hero (3 spans : "Bien-être, / satisfaction, / sourire.") */
    var titleSpans = qsa('.hero-title span');
    if (titleSpans[0] && h.title1) titleSpans[0].textContent = h.title1;
    if (titleSpans[1] && h.title2) titleSpans[1].textContent = h.title2;
    if (titleSpans[2] && h.title3) titleSpans[2].textContent = h.title3;
    /* Bulles flottantes (orbs) */
    var orbLabels = qsa('.orb .orb-label');
    if (orbLabels[0] && h.orb1) replaceTextNode(orbLabels[0], 'Brosse Siwak', h.orb1);
    if (orbLabels[1] && h.orb2) replaceTextNode(orbLabels[1], 'Gant Soie',   h.orb2);
    if (orbLabels[2] && h.orb3) replaceTextNode(orbLabels[2], 'Pack 1 an',   h.orb3);
    if (orbLabels[3] && h.orb4) orbLabels[3].textContent = h.orb4;
    set('.hero-sub', h.sub);
    var heroBtns = qsa('.hero-ctas a');
    if (heroBtns[0]) heroBtns[0].textContent = h.discover;
    if (heroBtns[1]) heroBtns[1].textContent = h.story;
    var statLabels = qsa('.stat-label');
    if (statLabels[0]) statLabels[0].textContent = h.stat_avis;
    if (statLabels[1]) statLabels[1].textContent = h.stat_note;
    if (statLabels[2]) statLabels[2].textContent = h.stat_naturel;

    /* ── Section Siwak ── */
    var siwakSec = qs('#siwak');
    if (siwakSec && h.siwak_ey) {
      setIn(siwakSec, '.section-eyebrow', h.siwak_ey);
      setIn(siwakSec, '.section-title',   h.siwak_title, true);
      setIn(siwakSec, '.section-sub',     h.siwak_sub);
      var sk = siwakSec.querySelectorAll('.product-card');
      [['siwak_p1_name','siwak_p1_desc'],['siwak_p2_name','siwak_p2_desc'],
       ['siwak_p3_name','siwak_p3_desc'],['siwak_p4_name','siwak_p4_desc']
      ].forEach(function(pair, i) {
        if (!sk[i]) return;
        var n = sk[i].querySelector('.product-name'), d = sk[i].querySelector('.product-desc');
        if (n && h[pair[0]]) n.textContent = h[pair[0]];
        if (d && h[pair[1]]) d.textContent = h[pair[1]];
      });
    }

    /* ── Story Siwak (#histoire) ── */
    var histSec = qs('#histoire');
    if (histSec && h.story1_ey) {
      setIn(histSec, '.story-eyebrow', h.story1_ey);
      setIn(histSec, '.story-title',   h.story1_title, true);
      var htx = histSec.querySelectorAll('.story-text');
      if (htx[0] && h.story1_p1) htx[0].textContent = h.story1_p1;
      if (htx[1] && h.story1_p2) htx[1].textContent = h.story1_p2;
      var hl = histSec.querySelector('.story-link');
      if (hl && h.story1_link) hl.textContent = h.story1_link;
    }

    /* ── Section Gants ── */
    var gantsSec = qs('#gants');
    if (gantsSec && h.gants_ey) {
      setIn(gantsSec, '.section-eyebrow', h.gants_ey);
      setIn(gantsSec, '.section-title',   h.gants_title, true);
      setIn(gantsSec, '.section-sub',     h.gants_sub);
      var gk = gantsSec.querySelectorAll('.product-card');
      [['gants_p1_name','gants_p1_desc'],['gants_p2_name','gants_p2_desc'],
       ['gants_p3_name','gants_p3_desc'],['gants_p4_name','gants_p4_desc']
      ].forEach(function(pair, i) {
        if (!gk[i]) return;
        var n = gk[i].querySelector('.product-name'), d = gk[i].querySelector('.product-desc');
        if (n && h[pair[0]]) n.textContent = h[pair[0]];
        if (d && h[pair[1]]) d.textContent = h[pair[1]];
      });
    }

    /* ── Story Gants (.story-section.reverse) ── */
    var revSec = qs('.story-section.reverse');
    if (revSec && h.story2_ey) {
      setIn(revSec, '.story-eyebrow', h.story2_ey);
      setIn(revSec, '.story-title',   h.story2_title, true);
      var gtx = revSec.querySelectorAll('.story-text');
      if (gtx[0] && h.story2_p1) gtx[0].textContent = h.story2_p1;
      if (gtx[1] && h.story2_p2) gtx[1].textContent = h.story2_p2;
      var gl = revSec.querySelector('.story-link');
      if (gl && h.story2_link) gl.textContent = h.story2_link;
    }

    /* ── Section Valeurs ── */
    var valSec = qs('.values-section');
    if (valSec && h.values_ey) {
      setIn(valSec, '.section-eyebrow', h.values_ey);
      setIn(valSec, '.section-title',   h.values_title, true);
      var vc = valSec.querySelectorAll('.value-card');
      [['val1_title','val1_text'],['val2_title','val2_text'],
       ['val3_title','val3_text'],['val4_title','val4_text']
      ].forEach(function(pair, i) {
        if (!vc[i]) return;
        var ti = vc[i].querySelector('.value-title'), tx = vc[i].querySelector('.value-text');
        if (ti && h[pair[0]]) ti.textContent = h[pair[0]];
        if (tx && h[pair[1]]) tx.textContent = h[pair[1]];
      });
    }

    /* ── Section Témoignages ── */
    var testSec = qs('.testimonials-section');
    if (testSec && h.test_ey) {
      setIn(testSec, '.section-eyebrow', h.test_ey);
      setIn(testSec, '.section-title',   h.test_title, true);
      setIn(testSec, '.section-sub',     h.test_sub);
    }

    /* ── Section Newsletter ── */
    var nlSec = qs('.newsletter-section');
    if (nlSec && h.nl_title) {
      setIn(nlSec, '.section-eyebrow',  h.nl_ey);
      setIn(nlSec, '.newsletter-title', h.nl_title, true);
      setIn(nlSec, '.newsletter-sub',   h.nl_sub, true);
      var nlInp = nlSec.querySelector('.newsletter-input');
      if (nlInp && h.nl_ph) nlInp.placeholder = h.nl_ph;
      setIn(nlSec, '.newsletter-btn',  h.nl_btn);
      setIn(nlSec, '.newsletter-note', h.nl_note);
    }
  }

  function applyFaq(t) {
    var f = t.faq;
    set('.faq-eyebrow', f.eyebrow);
    set('.faq-title', f.title, true);
    set('.faq-sub', f.sub);
    var inp = qs('#faqSearch'); if (inp) inp.placeholder = f.search_ph;
    set('.faq-sidebar-title', f.sidebar_title);
    /* Boutons catégorie sidebar */
    var navItems = qsa('.faq-nav-item');
    var catKeys = ['cat_siwak','cat_gants','cat_livraison','cat_paiement'];
    navItems.forEach(function(btn, i){
      var dot = btn.querySelector('.faq-nav-dot');
      if (catKeys[i] && f[catKeys[i]]) {
        btn.textContent = '';
        if (dot) btn.appendChild(dot);
        btn.appendChild(document.createTextNode(f[catKeys[i]]));
      }
    });
    /* Titres catégorie */
    var catTitles = qsa('.faq-category-title');
    var titleKeys = ['cat1_title','cat2_title','cat3_title','cat4_title'];
    catTitles.forEach(function(el, i){
      if (titleKeys[i] && f[titleKeys[i]]) el.innerHTML = f[titleKeys[i]];
    });
    /* Étiquettes catégorie (Collection / Logistique / Sécurité) */
    var catLabels = qsa('.faq-category-label');
    var labelKeys = ['cat1_label','cat2_label','cat3_label','cat4_label'];
    catLabels.forEach(function(el, i){ if (labelKeys[i] && f[labelKeys[i]]) el.textContent = f[labelKeys[i]]; });
    /* Questions & réponses */
    var qTexts = qsa('.faq-question-text');
    var aTexts = qsa('.faq-answer-text');
    var qKeys = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15','q16','q17','q18','q19'];
    var aKeys = ['a1','a2','a3','a4','a5','a6','a7','a8','a9','a10','a11','a12','a13','a14','a15','a16','a17','a18','a19'];
    qTexts.forEach(function(el, i){ if (qKeys[i] && f[qKeys[i]]) el.textContent = f[qKeys[i]]; });
    aTexts.forEach(function(el, i){ if (aKeys[i] && f[aKeys[i]]) el.innerHTML = f[aKeys[i]]; });
    /* Section "Aucun résultat" */
    set('.faq-no-results-title', f.no_results);
    /* CTA */
    set('.faq-cta-eyebrow', f.cta_eyebrow);
    set('.faq-cta-title', f.cta_title, true);
    set('.faq-cta-sub', f.cta_sub);
    set('.faq-cta-link', f.cta_link);
    /* Contact page FAQ aussi */
    applyContactFaq(t);
  }

  function applyContactFaq(t) {
    var f = t.faq;
    if (!f) return;
    /* FAQ dans la page contact (.faq-section) */
    var faqQBtns = qsa('.faq-section .faq-question');
    var faqAInners = qsa('.faq-section .faq-answer-inner');
    var cqKeys = ['cq1','cq2','cq3','cq4','cq5','cq6','cq7','cq8'];
    var caKeys = ['ca1','ca2','ca3','ca4','ca5','ca6','ca7','ca8'];
    faqQBtns.forEach(function(btn, i){
      var icon = btn.querySelector('.faq-icon');
      if (cqKeys[i] && f[cqKeys[i]]) {
        btn.textContent = f[cqKeys[i]];
        if (icon) { icon.textContent = '+'; btn.appendChild(icon); }
      }
    });
    faqAInners.forEach(function(el, i){ if (caKeys[i] && f[caKeys[i]]) el.innerHTML = f[caKeys[i]]; });
  }

  function applyContact(t) {
    var c = t.contact;
    set('.contact-eyebrow', c.eyebrow);
    set('.contact-title', c.title, true);
    set('.contact-sub', c.sub);
    /* Cartes contact */
    var cardLabels = qsa('.contact-card-label');
    var cardNotes  = qsa('.contact-card-note');
    if (cardLabels[0]) cardLabels[0].textContent = c.card1_label;
    if (cardNotes[0])  cardNotes[0].textContent  = c.card1_note;
    if (cardLabels[1]) cardLabels[1].textContent = c.card2_label;
    if (cardNotes[1])  cardNotes[1].textContent  = c.card2_note;
    /* Promesse de réponse */
    set('.response-promise-title', c.promise_title);
    set('.response-promise-text', c.promise_text);
    /* Formulaire */
    set('.form-section-eyebrow', c.form_eyebrow);
    set('.form-title', c.form_title, true);
    /* Labels */
    var labels = qsa('.form-label');
    var lkeys = ['lbl_prenom','lbl_nom','lbl_email','lbl_objet','lbl_commande','lbl_message'];
    labels.forEach(function(el, i){ if (lkeys[i] && c[lkeys[i]]) el.textContent = c[lkeys[i]]; });
    /* Placeholders */
    var inpF = qs('#firstName'); if (inpF) inpF.placeholder = c.ph_prenom;
    var inpL = qs('#lastName');  if (inpL) inpL.placeholder = c.ph_nom;
    var inpE = qs('#email');     if (inpE) inpE.placeholder = c.ph_email;
    var inpO = qs('#orderNumber'); if (inpO) inpO.placeholder = c.ph_commande;
    var inpM = qs('#message');   if (inpM) inpM.placeholder = c.ph_message;
    /* Select sujet */
    var sel = qs('#subject'); if (sel) {
      var opts = sel.options;
      var optKeys = ['opt_select','opt_commande','opt_produit','opt_conseil','opt_partenariat','opt_autre'];
      for (var i=0; i < opts.length && i < optKeys.length; i++) {
        if (c[optKeys[i]]) opts[i].text = c[optKeys[i]];
      }
    }
    /* Bouton submit */
    set('.form-submit', c.submit);
    set('.form-note', c.form_note);
    /* FAQ sur page contact */
    set('.faq-eyebrow', c.faq_eyebrow);
    set('.faq-title', c.faq_title, true);
  }

  function applyHistoire(t) {
    var h = t.histoire;
    set('.story-eyebrow', h.eyebrow);
    set('.story-hero-title', h.title, true);
    set('.story-hero-sub', h.sub);
    /* Sections */
    var secEy = qsa('.story-section .section-eyebrow');
    var secTi = qsa('.story-section .section-title');
    var secTx = qsa('.story-section .section-text');
    var skeys = ['s1_eyebrow','s2_eyebrow'];
    var tikeys = ['s1_title','s2_title'];
    secEy.forEach(function(el, i){ if (skeys[i] && h[skeys[i]]) el.textContent = h[skeys[i]]; });
    secTi.forEach(function(el, i){ if (tikeys[i] && h[tikeys[i]]) el.innerHTML = h[tikeys[i]]; });
    /* Textes section (4 paragraphes) */
    var txkeys = ['s1_p1','s1_p2','s2_p1','s2_p2'];
    secTx.forEach(function(el, i){ if (txkeys[i] && h[txkeys[i]]) el.textContent = h[txkeys[i]]; });
    /* Timeline */
    set('.tl-eyebrow', h.tl_eyebrow);
    set('.tl-title', h.tl_title, true);
    var tlTitles = qsa('.tl-title-text');
    var tlTexts  = qsa('.tl-text');
    var tlTiKeys = ['tl1_title','tl2_title','tl3_title','tl4_title'];
    var tlTxKeys = ['tl1_text','tl2_text','tl3_text','tl4_text'];
    tlTitles.forEach(function(el, i){ if (tlTiKeys[i] && h[tlTiKeys[i]]) el.textContent = h[tlTiKeys[i]]; });
    tlTexts.forEach(function(el, i){ if (tlTxKeys[i] && h[tlTxKeys[i]]) el.textContent = h[tlTxKeys[i]]; });
    /* Valeurs */
    var valTitles = qsa('.value-title');
    var valTexts  = qsa('.value-text');
    var vtkeys = ['v1_title','v2_title','v3_title','v4_title'];
    var vxkeys = ['v1_text','v2_text','v3_text','v4_text'];
    valTitles.forEach(function(el, i){ if (vtkeys[i] && h[vtkeys[i]]) el.textContent = h[vtkeys[i]]; });
    valTexts.forEach(function(el, i){ if (vxkeys[i] && h[vxkeys[i]]) el.textContent = h[vxkeys[i]]; });
    /* CTA */
    set('.cta-title', h.cta_title, true);
    set('.cta-sub', h.cta_sub);
    var ctaBtns = qsa('.cta-buttons a');
    if (ctaBtns[0]) ctaBtns[0].textContent = h.cta_btn1;
    if (ctaBtns[1]) ctaBtns[1].textContent = h.cta_btn2;
  }

  function applyLivraison(t) {
    var l = t.livraison;
    set('.page-eyebrow', l.eyebrow);
    set('.page-title', l.title, true);
    set('.page-sub', l.sub);
    /* Cartes info */
    var infoTi = qsa('.info-title');
    var infoTx = qsa('.info-text');
    var itikeys = ['i1_title','i2_title','i3_title'];
    var itxkeys = ['i1_text','i2_text','i3_text'];
    infoTi.forEach(function(el, i){ if (itikeys[i] && l[itikeys[i]]) el.textContent = l[itikeys[i]]; });
    infoTx.forEach(function(el, i){ if (itxkeys[i] && l[itxkeys[i]]) el.textContent = l[itxkeys[i]]; });
    /* Tableau livraison */
    set('.section-eyebrow', l.table_eyebrow);
    set('.section-title', l.table_title, true);
    /* Carrier */
    set('.carrier-badge', l.recommended);
    var carrierDescs = qsa('.carrier-desc');
    var ckeys = ['mr_desc','colissimo_desc','intl_desc'];
    carrierDescs.forEach(function(el, i){ if (ckeys[i] && l[ckeys[i]]) el.textContent = l[ckeys[i]]; });
    /* Note FDP offerts */
    set('.free-shipping-note', l.free_note);
  }

  function applyColSiwak(t) {
    var c = t.col_siwak;
    set('.collection-eyebrow', c.eyebrow);
    set('.collection-title', c.title, true);
    set('.collection-sub', c.sub);
    /* Stats */
    var statLabels = qsa('.stat-label');
    ['stat1','stat2','stat3'].forEach(function(k, i){ if (c[k] && statLabels[i]) statLabels[i].textContent = c[k]; });
    /* Product cards */
    var cards = qsa('.product-card');
    [['p1_name','p1_desc'],['p2_name','p2_desc'],['p3_name','p3_desc'],['p4_name','p4_desc']
    ].forEach(function(pair, i) {
      if (!cards[i]) return;
      var n = cards[i].querySelector('.product-name'), d = cards[i].querySelector('.product-desc');
      if (n && c[pair[0]]) n.textContent = c[pair[0]];
      if (d && c[pair[1]]) d.textContent = c[pair[1]];
    });
    /* Strip histoire */
    set('.story-eyebrow', c.story_eyebrow);
    set('.story-title', c.story_title, true);
    set('.story-text', c.story_text, true);
    /* Newsletter (scoped pour éviter les conflits) */
    var nlSec = qs('.newsletter-section');
    if (nlSec) {
      setIn(nlSec, '.section-eyebrow', c.nl_ey || c.join_eyebrow);
      setIn(nlSec, '.newsletter-title', c.nl_title, true);
      setIn(nlSec, '.newsletter-sub',   c.nl_sub);
      var nlInp = nlSec.querySelector('.newsletter-input');
      if (nlInp && c.nl_ph) nlInp.placeholder = c.nl_ph;
      setIn(nlSec, '.newsletter-btn', c.nl_btn);
    }
  }

  function applyColGants(t) {
    var c = t.col_gants;
    set('.collection-eyebrow', c.eyebrow);
    set('.collection-title', c.title, true);
    set('.collection-sub', c.sub);
    /* Stats */
    var statLabels = qsa('.stat-label');
    ['stat1','stat2','stat3'].forEach(function(k, i){ if (c[k] && statLabels[i]) statLabels[i].textContent = c[k]; });
    /* En-tête section produits */
    var prodSec = qs('.products-section');
    if (prodSec) {
      setIn(prodSec, '.section-eyebrow', c.prod_eyebrow);
      setIn(prodSec, '.section-title',   c.prod_title, true);
      /* Product cards */
      var cards = prodSec.querySelectorAll('.product-card');
      [['p1_name','p1_desc'],['p2_name','p2_desc'],['p3_name','p3_desc'],['p4_name','p4_desc']
      ].forEach(function(pair, i) {
        if (!cards[i]) return;
        var n = cards[i].querySelector('.product-name'), d = cards[i].querySelector('.product-desc');
        if (n && c[pair[0]]) n.textContent = c[pair[0]];
        if (d && c[pair[1]]) d.textContent = c[pair[1]];
      });
    }
    /* Strip histoire */
    set('.story-eyebrow', c.story_eyebrow);
    set('.story-title', c.story_title, true);
    set('.story-text', c.story_text, true);
    /* Newsletter (scoped) */
    var nlSec = qs('.newsletter-section');
    if (nlSec) {
      setIn(nlSec, '.section-eyebrow', c.nl_ey || c.join_eyebrow);
      setIn(nlSec, '.newsletter-title', c.nl_title, true);
      setIn(nlSec, '.newsletter-sub',   c.nl_sub);
      var nlInp = nlSec.querySelector('.newsletter-input');
      if (nlInp && c.nl_ph) nlInp.placeholder = c.nl_ph;
      setIn(nlSec, '.newsletter-btn', c.nl_btn);
    }
  }

  function applyNosPacks(t) {
    var c = t.nos_packs;
    if (!c) return;
    set('.collection-eyebrow', c.eyebrow);
    set('.collection-title', c.title, true);
    set('.collection-sub', c.sub);
    /* En-tête + cards section packs */
    var packsSec = qs('.packs-section');
    if (packsSec) {
      setIn(packsSec, '.section-eyebrow', c.packs_ey);
      setIn(packsSec, '.section-title',   c.packs_title, true);
      var pcards = packsSec.querySelectorAll('.pack-card');
      [['p1_name','p1_desc'],['p2_name','p2_desc'],['p3_name','p3_desc'],['p4_name','p4_desc']
      ].forEach(function(pair, i) {
        if (!pcards[i]) return;
        var n = pcards[i].querySelector('.pack-name'), d = pcards[i].querySelector('.pack-desc');
        if (n && c[pair[0]]) n.textContent = c[pair[0]];
        if (d && c[pair[1]]) d.textContent = c[pair[1]];
        if (c.btn_view) {
          var bv = pcards[i].querySelector('.btn-view-pack');
          if (bv) bv.textContent = c.btn_view;
        }
      });
    }
    /* Newsletter (scoped) */
    var nlSec = qs('.newsletter-section');
    if (nlSec) {
      setIn(nlSec, '.section-eyebrow', c.nl_ey);
      setIn(nlSec, '.newsletter-title', c.nl_title, true);
      setIn(nlSec, '.newsletter-sub',   c.nl_sub);
      var nlInp = nlSec.querySelector('.newsletter-input');
      if (nlInp && c.nl_ph) nlInp.placeholder = c.nl_ph;
      setIn(nlSec, '.newsletter-btn', c.nl_btn);
    }
  }

  function applyBlog(t) {
    var b = t.blog;
    if (!b) return;
    set('.blog-eyebrow', b.eyebrow);
    set('.blog-title', b.title, true);
    set('.blog-sub', b.sub);
    set('.blog-search input', b.search_ph);
  }

  function applyBlogArticle(t, page) {
    var a = t.blog_articles[page];
    if (!a) return;
    /* Titre article */
    set('.article-title, h1.article-title', a.title, true);
    /* Intro / premier paragraphe */
    if (a.intro) set('.article-intro, .article-lead', a.intro);
    /* CTA article */
    set('.article-cta .cta-eyebrow', a.cta_eyebrow);
    set('.article-cta .cta-title', a.cta_title, true);
    set('.article-cta .cta-sub', a.cta_sub);
    set('.article-cta .cta-btn', a.cta_btn);
    /* Sidebar */
    set('.sidebar-product-label', t.sidebar_product_label);
    set('.sidebar-product-btn', t.sidebar_discover);
    /* Breadcrumb */
    var bc = qs('.breadcrumb');
    if (bc && a.breadcrumb) {
      /* Remplace le titre dans le dernier segment */
      var spans = bc.querySelectorAll('span');
      var lastText = bc.lastChild;
      if (lastText && lastText.nodeType === 3) lastText.textContent = a.breadcrumb;
    }
    /* "Continuer la lecture" */
    set('.related-section > div:first-child', t.continue_reading);
    set('.related-section > div:nth-child(2)', t.recommended_title, true);
    /* Note langue si contenu partiel */
    if (a.lang_notice) {
      var notice = document.createElement('div');
      notice.style.cssText = 'background:rgba(184,151,90,.1);border-left:3px solid var(--gold,#B8975A);padding:12px 20px;margin:20px 0;font-size:13px;color:var(--mid,#6B5B4E);font-style:italic;';
      notice.textContent = a.lang_notice;
      var article = qs('article') || qs('.article-body');
      if (article) article.insertBefore(notice, article.firstChild);
    }
  }

  function applyCart(t) {
    var c = t.cart;
    if (!c) return;
    set('.page-title', c.title, true);
    /* Progress steps */
    var steps = qsa('.progress-step span:last-child');
    if (steps[0]) steps[0].textContent = c.step_cart;
    if (steps[1]) steps[1].textContent = c.step_shipping;
    if (steps[2]) steps[2].textContent = c.step_payment;
    /* Le contenu du panier est rendu dynamiquement par cart.js.
       On expose window.ALYA_CART_T pour que renderCart() puisse l'utiliser */
    window.ALYA_CART_T = c;
    /* MutationObserver pour ré-appliquer après le rendu JS */
    var cartSection = qs('#cartSection');
    if (cartSection) {
      var obs = new MutationObserver(function(){ translateCartHTML(c); });
      obs.observe(cartSection, { childList: true, subtree: false });
      /* Appliquer aussi immédiatement au cas où déjà rendu */
      translateCartHTML(c);
    }
  }

  function translateCartHTML(c) {
    /* Traduit les chaînes générées dynamiquement par cart.js */
    var sect = qs('#cartSection');
    if (!sect || !sect.innerHTML) return;
    /* Boutons continuer / commander */
    setAll('.cart-actions a:first-child', c.continue_shopping);
    setAll('.cart-actions a:last-child', c.place_order);
    /* En-têtes tableau */
    var headers = qsa('.cart-items-header span');
    var hkeys = ['hdr_product','hdr_qty','hdr_total'];
    headers.forEach(function(el, i){ if (hkeys[i] && c[hkeys[i]]) el.textContent = c[hkeys[i]]; });
    /* Résumé commande */
    set('.summary-title', c.summary_title);
    /* Prix "/ unité" */
    qsa('.cart-item-price-unit').forEach(function(el){
      el.innerHTML = el.innerHTML.replace('/ unité', c.per_unit || '/ unit');
    });
    /* Sélecteur transporteur */
    set('.carrier-label', c.carrier_label);
    /* Textes livraison */
    var fdbEl = qs('.free-delivery-bar strong');
    if (fdbEl && fdbEl.textContent.indexOf('Livraison') !== -1) fdbEl.textContent = c.free_shipping_reached;
    /* Lignes récapitulatif */
    var summLines = qsa('.summary-line span:first-child');
    summLines.forEach(function(el){
      if (el.textContent === 'Sous-total') el.textContent = c.subtotal;
      if (el.textContent === 'Livraison') el.textContent = c.shipping;
      if (el.textContent === 'Total')     el.textContent = c.total;
    });
    /* Bouton commander */
    set('a[href="checkout"].btn-primary', c.order_btn);
    /* Panier vide */
    set('.cart-empty-title', c.empty_title);
    set('.cart-empty-sub', c.empty_sub);
    set('.cart-empty .btn-primary', c.empty_btn);
    /* Trust icon paiement */
    setAll('.trust-icon', c.secure_payment);
    /* Livraison offerte */
    qsa('.carrier-price.free').forEach(function(el){ el.textContent = c.free_label; });
  }

  function applyCheckout(t) {
    if (!t.checkout) return;
    var c = t.checkout;
    set('.page-title', c.title, true);
    /* Progress */
    var steps = qsa('.progress-step span:last-child');
    if (steps[0]) steps[0].textContent = c.step_cart;
    if (steps[1]) steps[1].textContent = c.step_shipping;
    if (steps[2]) steps[2].textContent = c.step_payment;
  }

  /* ================================================================
     POINT D'ENTRÉE PRINCIPAL
     ================================================================ */
  function applyTranslations(t) {
    if (!t) return;
    applyCommon(t);
    var page = getPageId();
    applyPage(t, page);
  }

  function loadAndApply(lang) {
    /* Charge le fichier de traduction de la langue, puis applique */
    var key = 'ALYA_T_' + lang.toUpperCase();
    if (window[key]) {
      applyTranslations(window[key]);
      return;
    }
    var s = document.createElement('script');
    s.src = '/js/i18n-' + lang + '.js?v=2';
    s.onload = function() {
      if (window[key]) applyTranslations(window[key]);
    };
    s.onerror = function() { console.warn('[ALYA i18n] Impossible de charger', lang); };
    document.head.appendChild(s);
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function(){
    injectCSS();
    upgradeNavCart();
    var lang = getLang();
    injectSelector(lang);
    if (lang !== 'fr') loadAndApply(lang);
  });

})();
