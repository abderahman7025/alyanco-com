// ALYA & CO. — Système de panier (localStorage)

const CART_KEY = 'alyanco_cart';

/* ── Noms produits traduits ── */
var PRODUCT_NAMES = {
  fr: {
    'brosse-siwak':       'Brosse à dents Siwak Rechargeable',
    'tetes-recharges':    'Têtes-recharges Siwak Bio',
    'dentifrice-siwak':   'Dentifrice Siwak en Poudre',
    'pack-siwak-complet': 'Pack Brosse Siwak Complet',
    'gant-corps':         'Gant Exfoliant Corps — Soie de Mûrier',
    'gant-visage':        'Gant Exfoliant Visage — Soie de Mûrier',
    'pack-1an-full-body': 'Pack 1 An Full Body',
    'chouchou-soie':      'Chouchou Soie de Mûrier',
    'pack-tetes-x3':      'Pack Têtes-recharges Siwak Bio ×3',
    'pack-dentifrice-3m': 'Pack Dentifrices Siwak en Poudre (3 mois)'
  },
  en: {
    'brosse-siwak':       'Rechargeable Siwak Toothbrush',
    'tetes-recharges':    'Siwak Bio Replacement Heads',
    'dentifrice-siwak':   'Siwak Powder Toothpaste',
    'pack-siwak-complet': 'Complete Siwak Brush Pack',
    'gant-corps':         'Body Exfoliating Glove — Mulberry Silk',
    'gant-visage':        'Face Exfoliating Glove — Mulberry Silk',
    'pack-1an-full-body': '1-Year Full Body Pack',
    'chouchou-soie':      'Mulberry Silk Hair Scrunchie',
    'pack-tetes-x3':      'Siwak Bio Replacement Heads ×3',
    'pack-dentifrice-3m': 'Siwak Powder Toothpaste Pack (3 months)'
  },
  nl: {
    'brosse-siwak':       'Oplaadbare Siwak Tandenborstel',
    'tetes-recharges':    'Siwak Bio Opzetborstels',
    'dentifrice-siwak':   'Siwak Tandenpoets in Poedervorm',
    'pack-siwak-complet': 'Compleet Siwak Borstel Pakket',
    'gant-corps':         'Lichaam Exfoliërende Handschoen — Moerbeizijde',
    'gant-visage':        'Gezicht Exfoliërende Handschoen — Moerbeizijde',
    'pack-1an-full-body': '1 Jaar Full Body Pakket',
    'chouchou-soie':      'Moerbeizijden Haarelastiek',
    'pack-tetes-x3':      'Siwak Bio Opzetborstels Pakket ×3',
    'pack-dentifrice-3m': 'Siwak Tandenpoets Pakket (3 maanden)'
  },
  de: {
    'brosse-siwak':       'Wiederaufladbare Siwak-Zahnbürste',
    'tetes-recharges':    'Bio-Siwak-Ersatzköpfe',
    'dentifrice-siwak':   'Siwak-Zahnpulver',
    'pack-siwak-complet': 'Komplettes Siwak-Zahnbürsten-Set',
    'gant-corps':         'Körper-Peeling-Handschuh — Maulbeerseide',
    'gant-visage':        'Gesichts-Peeling-Handschuh — Maulbeerseide',
    'pack-1an-full-body': '1-Jahres Full-Body-Set',
    'chouchou-soie':      'Maulbeerseide Haargummi',
    'pack-tetes-x3':      'Bio-Siwak-Ersatzköpfe Set ×3',
    'pack-dentifrice-3m': 'Siwak-Zahnpulver Set (3 Monate)'
  },
  it: {
    'brosse-siwak':       'Spazzolino Siwak Ricaricabile',
    'tetes-recharges':    'Testine Siwak Bio di Ricambio',
    'dentifrice-siwak':   'Dentifricio Siwak in Polvere',
    'pack-siwak-complet': 'Pack Spazzolino Siwak Completo',
    'gant-corps':         'Guanto Esfoliante Corpo — Seta di Gelso',
    'gant-visage':        'Guanto Esfoliante Viso — Seta di Gelso',
    'pack-1an-full-body': 'Pack 1 Anno Full Body',
    'chouchou-soie':      'Elastico per Capelli in Seta di Gelso',
    'pack-tetes-x3':      'Pack Testine Siwak Bio di Ricambio ×3',
    'pack-dentifrice-3m': 'Pack Dentifrici Siwak in Polvere (3 mesi)'
  },
  pt: {
    'brosse-siwak':       'Escova de Dentes Siwak Recarregável',
    'tetes-recharges':    'Cabeças de Substituição Siwak Bio',
    'dentifrice-siwak':   'Dentífrico Siwak em Pó',
    'pack-siwak-complet': 'Pack Escova Siwak Completo',
    'gant-corps':         'Luva Esfoliante Corpo — Seda de Amoreira',
    'gant-visage':        'Luva Esfoliante Rosto — Seda de Amoreira',
    'pack-1an-full-body': 'Pack 1 Ano Full Body',
    'chouchou-soie':      'Elástico de Seda de Amoreira',
    'pack-tetes-x3':      'Pack Cabeças de Substituição Siwak Bio ×3',
    'pack-dentifrice-3m': 'Pack Dentífricos Siwak em Pó (3 meses)'
  },
  es: {
    'brosse-siwak':       'Cepillo de Dientes Siwak Recargable',
    'tetes-recharges':    'Cabezales de Recambio Siwak Bio',
    'dentifrice-siwak':   'Dentífrico Siwak en Polvo',
    'pack-siwak-complet': 'Pack Cepillo Siwak Completo',
    'gant-corps':         'Guante Exfoliante Cuerpo — Seda de Morera',
    'gant-visage':        'Guante Exfoliante Rostro — Seda de Morera',
    'pack-1an-full-body': 'Pack 1 Año Full Body',
    'chouchou-soie':      'Coletero de Seda de Morera',
    'pack-tetes-x3':      'Pack Cabezales de Recambio Siwak Bio ×3',
    'pack-dentifrice-3m': 'Pack Dentífricos Siwak en Polvo (3 meses)'
  }
};

/* ── Traductions notification panier ── */
var CART_NOTIF_T = {
  fr: { added: 'Ajouté au panier',           view: 'Voir le panier' },
  en: { added: 'Added to cart',              view: 'View cart' },
  nl: { added: 'Toegevoegd aan winkelwagen', view: 'Winkelwagen bekijken' },
  de: { added: 'In den Warenkorb gelegt',    view: 'Warenkorb ansehen' },
  it: { added: 'Aggiunto al carrello',       view: 'Vedi carrello' },
  pt: { added: 'Adicionado ao carrinho',     view: 'Ver carrinho' },
  es: { added: 'Añadido al carrito',         view: 'Ver carrito' }
};

const PRODUCTS = {
  // poids réels en grammes (source : Shopify)
  'brosse-siwak':       { name: 'Brosse à dents Siwak Rechargeable',       price: 12.99, oldPrice: 15.99, weight: 60,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Design-sans_titre_20250111_120704_0000.png' },
  'tetes-recharges':    { name: 'Têtes-recharges Siwak Bio',                price: 6.99,  oldPrice: 8.99,  weight: 10,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/IMG-20250111-WA0004.jpg' },
  'dentifrice-siwak':   { name: 'Dentifrice Siwak en Poudre',               price: 5.99,  oldPrice: 7.99,  weight: 75,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/IMG-20250111-WA0005.jpg' },
  'pack-siwak-complet': { name: 'Pack Brosse Siwak Complet',                price: 24.99, oldPrice: 32.99, weight: 320, image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Packcomplet.jpg' },
  'gant-corps':         { name: 'Gant Exfoliant Corps — Soie de Mûrier',    price: 21.59, oldPrice: 35.99, weight: 63,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_3.png' },
  'gant-visage':        { name: 'Gant Exfoliant Visage — Soie de Mûrier',   price: 13.19, oldPrice: 21.99, weight: 18,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_5.png' },
  'pack-1an-full-body': { name: 'Pack 1 An Full Body',                      price: 29.99, oldPrice: 57.98, weight: 81,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_2.png' },
  'chouchou-soie':      { name: 'Chouchou Soie de Mûrier',                  price: 5.39,  oldPrice: 8.99,  weight: 15,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_7.png' },
  'pack-tetes-x3':      { name: 'Pack Têtes-recharges Siwak Bio X3',        price: 17.99, oldPrice: 26.99, weight: 30,  image: '/images/pack-tetes.jpg' },
  'pack-dentifrice-3m': { name: 'Pack Dentifrices Siwak en Poudre (3mois)', price: 15.99, oldPrice: 23.99, weight: 225, image: '/images/pack-dentifrice.png' },
  'sac-cadeau':         { name: 'Sac cadeau ALYA & CO.',                    price: 1.39,  weight: 30,   image: '/images/sac-cadeau.jpg' },
};

// Grille Mondial Relay 2026 — France métropolitaine [poids max g, tarif €]
var MONDIAL_RELAY_TARIFS = [
  [150,   3.59],
  [250,   3.99],
  [500,   4.49],
  [1000,  5.19],
  [2000,  6.19],
  [5000,  7.79],
  [10000, 10.39],
  [20000, 13.99],
  [30000, 18.69],
];

// Grille Colissimo domicile 2026 — France métropolitaine [poids max g, tarif €]
var COLISSIMO_TARIFS = [
  [250,   6.30],
  [500,   6.75],
  [750,   7.60],
  [1000,  8.05],
  [2000,  8.95],
  [5000,  12.25],
  [10000, 17.30],
  [15000, 21.25],
  [20000, 24.75],
  [25000, 28.50],
  [30000, 32.25],
];

function getCartTotalWeight() {
  return getCartItems().reduce(function(sum, i) {
    var p = PRODUCTS[i.id];
    return sum + (p ? p.weight * i.qty : 0);
  }, 0);
}

function getSelectedCarrier() {
  return localStorage.getItem('alyanco_carrier') || 'mondial-relay';
}

function setSelectedCarrier(carrier) {
  localStorage.setItem('alyanco_carrier', carrier);
}

function getShippingCost(carrier) {
  carrier = carrier || getSelectedCarrier();
  var subtotal = getCartSubtotal();
  var weight = getCartTotalWeight();
  // Livraison offerte dès 45€ UNIQUEMENT pour Mondial Relay
  if (carrier === 'mondial-relay' && subtotal >= 45) return 0;
  var grid = carrier === 'colissimo' ? COLISSIMO_TARIFS : MONDIAL_RELAY_TARIFS;
  for (var j = 0; j < grid.length; j++) {
    if (weight <= grid[j][0]) return grid[j][1];
  }
  return grid[grid.length - 1][1];
}

function getCart() {
  try {
    var raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    // Nettoyer les IDs qui n'existent plus dans PRODUCTS
    var clean = raw.filter(function(i){ return i && i.id && PRODUCTS[i.id]; });
    if (clean.length !== raw.length) {
      localStorage.setItem(CART_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty) {
  qty = qty || 1;
  if (!PRODUCTS[productId]) return;
  const cart = getCart();
  const existing = cart.find(function(i){ return i.id === productId; });
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: productId, qty: qty }); }
  saveCart(cart);
  openCartDrawer();
}

function removeFromCart(productId) {
  saveCart(getCart().filter(function(i){ return i.id !== productId; }));
}

function setQty(productId, qty) {
  var cart = getCart();
  var item = cart.find(function(i){ return i.id === productId; });
  if (item) { item.qty = Math.max(1, parseInt(qty) || 1); saveCart(cart); }
}

function getCartItems() {
  var lang = localStorage.getItem('alya_lang') || 'fr';
  var names = PRODUCT_NAMES[lang] || PRODUCT_NAMES.fr;
  return getCart().map(function(item) {
    var p = PRODUCTS[item.id];
    if (!p) return null;
    var name = names[item.id] || p.name;
    return { id: item.id, qty: item.qty, name: name, price: p.price, oldPrice: p.oldPrice, image: p.image, total: p.price * item.qty };
  }).filter(Boolean);
}

function getCartSubtotal() {
  return getCartItems().reduce(function(sum, i){ return sum + i.total; }, 0);
}

function getCartCount() {
  return getCart().reduce(function(sum, i){ return sum + i.qty; }, 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  var count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(function(badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

/* ── Mini-panier drawer ── */

function _injectDrawerCSS() {
  if (document.getElementById('cart-drawer-css')) return;
  var s = document.createElement('style');
  s.id = 'cart-drawer-css';
  s.textContent = [
    '.drawer-overlay{position:fixed;inset:0;background:rgba(28,22,18,0.5);z-index:9998;opacity:0;pointer-events:none;transition:opacity .35s;}',
    '.drawer-overlay.open{opacity:1;pointer-events:auto;}',
    '.cart-drawer{position:fixed;top:0;right:0;bottom:0;width:420px;max-width:100vw;background:var(--cream,#FAF6F1);z-index:9999;transform:translateX(100%);transition:transform .4s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,0.15);}',
    '.cart-drawer.open{transform:translateX(0);}',
    '.drawer-header{display:flex;align-items:center;justify-content:space-between;padding:24px 28px;border-bottom:1px solid rgba(184,151,90,0.15);flex-shrink:0;}',
    '.drawer-title{font-family:var(--font-serif,Georgia,serif);font-size:20px;font-weight:400;color:var(--dark,#1C1612);}',
    '.drawer-count{font-size:12px;color:var(--light,#A8958A);margin-left:8px;}',
    '.drawer-close{background:none;border:none;cursor:pointer;font-size:20px;color:var(--mid,#6B5B4E);padding:4px 0 4px 8px;line-height:1;}',
    '.drawer-close:hover{color:var(--dark,#1C1612);}',
    '.drawer-items{flex:1;overflow-y:auto;padding:16px 28px;}',
    '.drawer-empty{text-align:center;padding:60px 0;color:var(--light,#A8958A);font-size:14px;}',
    '.drawer-item{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid rgba(184,151,90,0.1);}',
    '.drawer-item:last-child{border-bottom:none;}',
    '.drawer-item-img{width:68px;height:68px;object-fit:contain;background:var(--warm,#F2E8DD);flex-shrink:0;}',
    '.drawer-item-info{flex:1;min-width:0;}',
    '.drawer-item-name{font-size:12px;color:var(--dark,#1C1612);font-weight:400;margin-bottom:5px;line-height:1.4;}',
    '.drawer-item-price{font-family:var(--font-serif,Georgia,serif);font-size:16px;color:var(--gold,#B8975A);}',
    '.drawer-item-controls{display:flex;align-items:center;gap:8px;margin-top:8px;}',
    '.drawer-qty-btn{width:26px;height:26px;border:1px solid rgba(184,151,90,0.35);background:none;cursor:pointer;font-size:15px;color:var(--dark,#1C1612);display:flex;align-items:center;justify-content:center;transition:all .2s;line-height:1;}',
    '.drawer-qty-btn:hover{border-color:var(--dark,#1C1612);background:var(--dark,#1C1612);color:#fff;}',
    '.drawer-qty{font-size:13px;color:var(--dark,#1C1612);min-width:18px;text-align:center;}',
    '.drawer-remove{margin-left:auto;background:none;border:none;cursor:pointer;font-size:10px;color:var(--light,#A8958A);letter-spacing:.1em;text-transform:uppercase;padding:0;}',
    '.drawer-remove:hover{color:var(--dark,#1C1612);}',
    '.drawer-footer{padding:18px 28px 24px;border-top:1px solid rgba(184,151,90,0.15);flex-shrink:0;}',
    '.drawer-subtotal{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;}',
    '.drawer-subtotal-label{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mid,#6B5B4E);}',
    '.drawer-subtotal-amount{font-family:var(--font-serif,Georgia,serif);font-size:22px;color:var(--dark,#1C1612);}',
    '.drawer-shipping-note{font-size:11px;color:var(--light,#A8958A);margin-bottom:16px;text-align:center;}',
    '.drawer-cta{display:block;width:100%;padding:15px;background:var(--dark,#1C1612);color:var(--cream,#FAF6F1);text-align:center;font-size:11px;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;border:1px solid var(--dark,#1C1612);transition:all .3s;margin-bottom:10px;box-sizing:border-box;}',
    '.drawer-cta:hover{background:transparent;color:var(--dark,#1C1612);}',
    '.drawer-continue{display:block;width:100%;padding:8px;background:none;border:none;cursor:pointer;font-size:11px;color:var(--light,#A8958A);letter-spacing:.12em;text-transform:uppercase;text-align:center;}',
    '.drawer-continue:hover{color:var(--dark,#1C1612);}',
    '@media(max-width:600px){.cart-drawer{width:100vw;}}'
  ].join('');
  document.head.appendChild(s);
}

function _getCartHref() {
  return window.location.pathname.indexOf('/produits/') !== -1 ? '../cart' : '/cart';
}

function _renderDrawerItems() {
  var items = getCartItems();
  var container = document.querySelector('.drawer-items');
  var footer = document.querySelector('.drawer-footer');
  var countEl = document.querySelector('.drawer-count');
  if (!container) return;

  var total = getCartCount();
  if (countEl) countEl.textContent = total > 0 ? '(' + total + ')' : '';

  if (items.length === 0) {
    container.innerHTML = '<p class="drawer-empty">Votre panier est vide</p>';
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = '';

  container.innerHTML = items.map(function(item) {
    var priceStr = item.price.toFixed(2).replace('.', ',') + ' €';
    return '<div class="drawer-item">' +
      '<img class="drawer-item-img" src="' + item.image + '" alt="" loading="lazy">' +
      '<div class="drawer-item-info">' +
        '<div class="drawer-item-name">' + item.name + '</div>' +
        '<div class="drawer-item-price">' + priceStr + '</div>' +
        '<div class="drawer-item-controls">' +
          '<button class="drawer-qty-btn" onclick="drawerQty(\'' + item.id + '\',-1)">−</button>' +
          '<span class="drawer-qty">' + item.qty + '</span>' +
          '<button class="drawer-qty-btn" onclick="drawerQty(\'' + item.id + '\',1)">+</button>' +
          '<button class="drawer-remove" onclick="drawerRemove(\'' + item.id + '\')">Retirer</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  var subtotal = getCartSubtotal();
  var amountEl = document.querySelector('.drawer-subtotal-amount');
  if (amountEl) amountEl.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';

  var noteEl = document.querySelector('.drawer-shipping-note');
  if (noteEl) {
    if (subtotal >= 45) {
      noteEl.textContent = '✓ Livraison Mondial Relay offerte';
      noteEl.style.color = '#4a7c59';
    } else {
      var rem = (45 - subtotal).toFixed(2).replace('.', ',');
      noteEl.textContent = 'Plus que ' + rem + ' € pour la livraison offerte';
      noteEl.style.color = '';
    }
  }
}

function drawerQty(id, delta) {
  var items = getCart();
  var item = items.find(function(i){ return i.id === id; });
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(items);
  _renderDrawerItems();
}

function drawerRemove(id) {
  removeFromCart(id);
  _renderDrawerItems();
}

function _handleDrawerKey(e) {
  if (e.key === 'Escape') closeCartDrawer();
}

function openCartDrawer() {
  _injectDrawerCSS();

  var overlay = document.querySelector('.drawer-overlay');
  var drawer = document.querySelector('.cart-drawer');

  if (!drawer) {
    overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.addEventListener('click', closeCartDrawer);
    document.body.appendChild(overlay);

    drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.innerHTML =
      '<div class="drawer-header">' +
        '<div><span class="drawer-title">Mon Panier</span><span class="drawer-count"></span></div>' +
        '<button class="drawer-close" onclick="closeCartDrawer()">✕</button>' +
      '</div>' +
      '<div class="drawer-items"></div>' +
      '<div class="drawer-footer">' +
        '<div class="drawer-subtotal">' +
          '<span class="drawer-subtotal-label">Sous-total</span>' +
          '<span class="drawer-subtotal-amount"></span>' +
        '</div>' +
        '<p class="drawer-shipping-note"></p>' +
        '<a href="' + _getCartHref() + '" class="drawer-cta">Commander →</a>' +
        '<button class="drawer-continue" onclick="closeCartDrawer()">Continuer mes achats</button>' +
      '</div>';
    document.body.appendChild(drawer);
  }

  _renderDrawerItems();

  requestAnimationFrame(function() {
    overlay.classList.add('open');
    drawer.classList.add('open');
  });

  document.addEventListener('keydown', _handleDrawerKey);
}

function closeCartDrawer() {
  var overlay = document.querySelector('.drawer-overlay');
  var drawer = document.querySelector('.cart-drawer');
  if (overlay) overlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
  document.removeEventListener('keydown', _handleDrawerKey);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
