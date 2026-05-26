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
  showCartNotification(productId);
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

function showCartNotification(productId) {
  var lang = localStorage.getItem('alya_lang') || 'fr';
  var nt = CART_NOTIF_T[lang] || CART_NOTIF_T.fr;
  var names = PRODUCT_NAMES[lang] || PRODUCT_NAMES.fr;
  var name = names[productId] || (PRODUCTS[productId] ? PRODUCTS[productId].name : productId);
  var existing = document.querySelector('.cart-notif');
  if (existing) existing.remove();
  var n = document.createElement('div');
  n.className = 'cart-notif';
  // Detect if we're in produits/ subfolder
  var prefix = window.location.pathname.indexOf('/produits/') !== -1 ? '../' : '';
  n.innerHTML = '<div class="cart-notif-inner"><span class="cart-notif-check">✓</span><div class="cart-notif-text"><strong>' + name + '</strong><span>' + nt.added + '</span></div><a href="' + prefix + 'cart" class="cart-notif-btn">' + nt.view + '</a></div>';
  document.body.appendChild(n);
  setTimeout(function(){ n.classList.add('show'); }, 10);
  setTimeout(function(){ n.classList.remove('show'); setTimeout(function(){ n.remove(); }, 400); }, 3000);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
