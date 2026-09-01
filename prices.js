/**
 * PRICES.JS — Source unique des prix
 * Pour modifier un prix : changer uniquement ici, tout le site se met à jour automatiquement.
 */
const PRICES = {
  'gant-corps': {
    current: '15,99€',
    old: '24,99€',
    schema: '15.99'
  },
  'gant-visage': {
    current: '9,99€',
    old: '14,99€',
    schema: '9.99'
  },
  'pack-1an-full-body': {
    current: '21,99€',
    old: '39,99€',
    schema: '21.99'
  },
  'pack-siwak-complet': {
    current: '15,99€',
    old: '31,99€',
    schema: '15.99'
  },
  'brosse-siwak': {
    current: '7,99€',
    old: '15,99€',
    schema: '7.99'
  },
  'dentifrice-siwak': {
    current: '4,99€',
    old: '7,99€',
    schema: '4.99'
  },
  'tetes-recharges': {
    current: '3,99€',
    old: '8,99€',
    schema: '3.99'
  },
  'pack-tetes-x3': {
    current: '12,99€',
    old: '14,99€',
    schema: '12.99'
  },
  'pack-dentifrice-3m': {
    current: '24,99€',
    old: '29,99€',
    schema: '24.99'
  },
  'chouchou-soie': {
    current: '3,99€',
    old: '8,99€',
    schema: '3.99'
  }
};

/* ── Helpers ────────────────────────────────────────────────────────── */
function _parsePrice(str) {
  if (!str) return 0;
  return parseFloat(String(str).replace(',', '.').replace('€', '').trim()) || 0;
}

function _calcPromo(current, old) {
  var c = _parsePrice(current);
  var o = _parsePrice(old);
  if (!c || !o || o <= c) return null;
  return '−' + Math.round((1 - c / o) * 100) + '%';
}

/* Injecte prix+barré+% dans un conteneur.
   Crée les éléments manquants si besoin. */
function _inject(container, p, opts) {
  opts = opts || {};
  var mainSel  = opts.main  || '.price-main, .price-current, .pack-price-main';
  var oldSel   = opts.old   || '.price-crossed, .price-old, .pack-price-old';
  var promoSel = opts.promo || '.price-promo, .pack-promo';

  var mainEl  = container.querySelector(mainSel);
  var oldEl   = container.querySelector(oldSel);
  var promoEl = container.querySelector(promoSel);

  var promo = _calcPromo(p.current, p.old);

  if (mainEl) mainEl.textContent = p.current;

  /* Prix barré */
  if (p.old) {
    if (!oldEl && mainEl) {
      /* Créer l'élément s'il n'existe pas */
      oldEl = document.createElement('span');
      oldEl.className = opts.oldClass || 'price-crossed';
      mainEl.insertAdjacentElement('afterend', oldEl);
    }
    if (oldEl) oldEl.textContent = p.old;
  } else if (oldEl) {
    oldEl.textContent = '';
  }

  /* Badge % réduction */
  if (promo) {
    if (!promoEl && oldEl) {
      promoEl = document.createElement('span');
      promoEl.className = opts.promoClass || 'price-promo';
      oldEl.insertAdjacentElement('afterend', promoEl);
    }
    if (promoEl) promoEl.textContent = promo;
  } else if (promoEl) {
    promoEl.textContent = '';
    promoEl.style.display = 'none';
  }
}

/* ── Injection au chargement ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* 1. Cartes produits dans des liens <a href="…/produits/slug"> */
  document.querySelectorAll('a[href*="produits/"]').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var slug = href.replace(/.*produits[\/\\]/, '').replace(/[?#].*/, '').replace(/\.html$/, '');
    var p = PRICES[slug];
    if (!p) return;
    _inject(link, p, { oldClass: 'price-old', promoClass: 'price-promo' });
  });

  /* 2. Boutons addToCart hors lien (collection-gants, nos-packs…) */
  document.querySelectorAll('[onclick*="addToCart"]').forEach(function (btn) {
    var m = (btn.getAttribute('onclick') || '').match(/addToCart\(['"](\S+?)['"]/);
    if (!m) return;
    var p = PRICES[m[1]];
    if (!p) return;
    var container = btn.closest('.product-bottom, .pack-price-row, .product-card, .pack-card, .product-price');
    if (!container) container = btn.parentElement;
    if (!container) return;
    _inject(container, p, { oldClass: 'price-old', promoClass: 'price-promo' });
  });

  /* 3. Page produit elle-même (.price-main / .price-crossed) */
  (function () {
    var slug = window.location.pathname.split('/').pop().replace(/\.html$/, '');
    var p = PRICES[slug];
    if (!p) return;
    var wrap = document.querySelector('.product-price-wrap');
    if (!wrap) return;
    _inject(wrap, p, { oldClass: 'price-crossed', promoClass: 'price-promo' });
  })();

  /* 4. Orb-prices sur l'accueil */
  document.querySelectorAll('.orb').forEach(function (orb) {
    var label = (orb.querySelector('.orb-label') || {}).textContent || '';
    var priceEl = orb.querySelector('.orb-price');
    if (!priceEl) return;
    if (label.includes('Gant')) priceEl.textContent = PRICES['gant-corps'].current;
    if (label.includes('Pack 1 an')) priceEl.textContent = PRICES['pack-1an-full-body'].current;
  });

  /* 5. JSON-LD schema sur les pages produits */
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) {
    try {
      var data = JSON.parse(s.textContent);
      if (data['@type'] === 'Product' && data.offers) {
        var slug = (window.location.pathname.split('/').pop() || '').replace(/\.html$/, '');
        var p = PRICES[slug];
        if (p && data.offers.price) {
          data.offers.price = p.schema;
          s.textContent = JSON.stringify(data, null, 2);
        }
      }
    } catch (e) {}
  });
});
