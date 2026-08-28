/**
 * PRICES.JS — Source unique des prix
 * Pour modifier un prix : changer uniquement ici, tout le site se met à jour automatiquement.
 */
const PRICES = {
  'gant-corps': {
    current: '24,99€',
    old: null,
    promo: null,
    schema: '24.99'
  },
  'gant-visage': {
    current: '14,99€',
    old: null,
    promo: null,
    schema: '14.99'
  },
  'pack-1an-full-body': {
    current: '29,99€',
    old: '39,99€',
    promo: '−25%',
    schema: '29.99'
  },
  'pack-siwak-complet': {
    current: '24,99€',
    old: '32,99€',
    promo: '−30%',
    schema: '24.99'
  },
  'brosse-siwak': {
    current: '12,99€',
    old: null,
    promo: null,
    schema: '12.99'
  },
  'dentifrice-siwak': {
    current: '9,99€',
    old: null,
    promo: null,
    schema: '9.99'
  },
  'tetes-recharges': {
    current: '4,99€',
    old: null,
    promo: null,
    schema: '4.99'
  },
  'pack-tetes-x3': {
    current: '12,99€',
    old: '14,99€',
    promo: '−15%',
    schema: '12.99'
  },
  'pack-dentifrice-3m': {
    current: '24,99€',
    old: '29,99€',
    promo: '−15%',
    schema: '24.99'
  },
  'chouchou-soie': {
    current: '5,39€',
    old: '8,99€',
    promo: null,
    schema: '5.39'
  }
};

/**
 * Met à jour tous les prix sur la page au chargement.
 * Fonctionne en trouvant les liens produits et les boutons addToCart.
 */
document.addEventListener('DOMContentLoaded', function () {

  // 1. Cartes produits : <a href="produits/gant-corps"> ou <a href="../produits/gant-corps">
  document.querySelectorAll('a[href*="produits/"], a[href*="produits\\\\"]').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var slug = href.replace(/.*produits[\/\\]/, '').replace(/[?#].*/, '').replace(/\.html$/, '');
    var p = PRICES[slug];
    if (!p) return;

    var curr = link.querySelector('.price-current, .price-main, .pack-price-main');
    var old  = link.querySelector('.price-old, .price-crossed, .pack-price-old');
    var promo = link.querySelector('.price-promo, .pack-promo');

    if (curr) curr.textContent = p.current;
    if (old)  old.textContent  = p.old || '';
    if (promo && p.promo) promo.textContent = p.promo;
  });

  // 2. Boutons addToCart hors lien (collection-gants, nos-packs, etc.)
  document.querySelectorAll('[onclick*="addToCart"]').forEach(function (btn) {
    var m = (btn.getAttribute('onclick') || '').match(/addToCart\(['"]([\w-]+)['"]/);
    if (!m) return;
    var p = PRICES[m[1]];
    if (!p) return;

    // Chercher la zone de prix la plus proche
    var container = btn.closest('.product-bottom, .pack-price-row, .product-card, .pack-card');
    if (!container) return;

    var curr  = container.querySelector('.price-current, .pack-price-main');
    var old   = container.querySelector('.price-old, .pack-price-old');
    var promo = container.querySelector('.price-promo, .pack-promo');

    if (curr) curr.textContent = p.current;
    if (old)  old.textContent  = p.old || '';
    if (promo && p.promo) promo.textContent = p.promo;
  });

  // 3. Orb-prices sur l'accueil (bulles décoratives)
  document.querySelectorAll('.orb').forEach(function (orb) {
    var label = (orb.querySelector('.orb-label') || {}).textContent || '';
    var priceEl = orb.querySelector('.orb-price');
    if (!priceEl) return;
    if (label.includes('Gant')) priceEl.textContent = PRICES['gant-corps'].current;
    if (label.includes('Pack 1 an') || label.includes('Pack 1 an')) priceEl.textContent = PRICES['pack-1an-full-body'].current;
  });

  // 4. JSON-LD schema sur les pages produits
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
