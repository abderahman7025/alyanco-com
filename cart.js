// ALYA & CO. — Système de panier (localStorage)

const CART_KEY = 'alyanco_cart';

const PRODUCTS = {
  // poids en grammes (produit + emballage)
  'brosse-siwak':       { name: 'Brosse à dents Siwak Rechargeable',       price: 12.99, oldPrice: 15.99, weight: 200, image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Design-sans_titre_20250111_120704_0000.png' },
  'tetes-recharges':    { name: 'Têtes-recharges Siwak Bio',                price: 6.99,  oldPrice: 8.99,  weight: 80,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/IMG-20250111-WA0004.jpg' },
  'dentifrice-siwak':   { name: 'Dentifrice Siwak en Poudre',               price: 5.99,  oldPrice: 7.99,  weight: 150, image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/IMG-20250111-WA0005.jpg' },
  'pack-siwak-complet': { name: 'Pack Brosse Siwak Complet',                price: 24.99, oldPrice: 32.99, weight: 430, image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Packcomplet.jpg' },
  'gant-corps':         { name: 'Gant Exfoliant Corps — Soie de Mûrier',    price: 21.59, oldPrice: 35.99, weight: 100, image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_3.png' },
  'gant-visage':        { name: 'Gant Exfoliant Visage — Soie de Mûrier',   price: 13.19, oldPrice: 21.99, weight: 80,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_5.png' },
  'pack-1an-full-body': { name: 'Pack 1 An Full Body',                      price: 29.99, oldPrice: 57.98, weight: 280, image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_2.png' },
  'chouchou-soie':      { name: 'Chouchou Soie de Mûrier',                  price: 5.39,  oldPrice: 8.99,  weight: 40,  image: 'https://cdn.shopify.com/s/files/1/0779/8259/7466/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_7.png' },
  'pack-tetes-x3':      { name: 'Pack Têtes-recharges Siwak Bio X3',        price: 17.99, oldPrice: 26.99, weight: 200, image: 'https://www.alyanco.com/cdn/shop/files/Untitled_Project_5.jpg?v=1738509064' },
  'pack-dentifrice-3m': { name: 'Pack Dentifrices Siwak en Poudre (3mois)', price: 15.99, oldPrice: 23.99, weight: 400, image: 'https://www.alyanco.com/cdn/shop/files/Copie_de_Copie_de_93_1000_x_1333_px_1000_x_1000_px_12.png?v=1738506846' },
};

// Grille tarifaire Mondial Relay 2026 (France métropolitaine)
// [poids max en grammes, tarif en €]
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

function getCartTotalWeight() {
  return getCartItems().reduce(function(sum, i) {
    var p = PRODUCTS[i.id];
    return sum + (p ? p.weight * i.qty : 0);
  }, 0);
}

function getShippingCost() {
  var subtotal = getCartSubtotal();
  if (subtotal >= 45) return 0; // livraison offerte
  var weight = getCartTotalWeight();
  for (var j = 0; j < MONDIAL_RELAY_TARIFS.length; j++) {
    if (weight <= MONDIAL_RELAY_TARIFS[j][0]) return MONDIAL_RELAY_TARIFS[j][1];
  }
  return MONDIAL_RELAY_TARIFS[MONDIAL_RELAY_TARIFS.length - 1][1]; // > 30kg
}

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch(e) { return []; }
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
  showCartNotification(PRODUCTS[productId].name);
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
  return getCart().map(function(item) {
    var p = PRODUCTS[item.id];
    if (!p) return null;
    return { id: item.id, qty: item.qty, name: p.name, price: p.price, oldPrice: p.oldPrice, image: p.image, total: p.price * item.qty };
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

function showCartNotification(name) {
  var existing = document.querySelector('.cart-notif');
  if (existing) existing.remove();
  var n = document.createElement('div');
  n.className = 'cart-notif';
  // Detect if we're in produits/ subfolder
  var prefix = window.location.pathname.indexOf('/produits/') !== -1 ? '../' : '';
  n.innerHTML = '<div class="cart-notif-inner"><span class="cart-notif-check">✓</span><div class="cart-notif-text"><strong>' + name + '</strong><span>Ajouté au panier</span></div><a href="' + prefix + 'cart" class="cart-notif-btn">Voir le panier</a></div>';
  document.body.appendChild(n);
  setTimeout(function(){ n.classList.add('show'); }, 10);
  setTimeout(function(){ n.classList.remove('show'); setTimeout(function(){ n.remove(); }, 400); }, 3000);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
