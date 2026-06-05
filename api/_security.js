// api/_security.js — Utilitaires de sécurité partagés ALYA & CO.

const ALLOWED_ORIGIN = 'https://alyanco.com';
const ALLOWED_ORIGIN_WWW = 'https://www.alyanco.com';

// ── CORS strict ───────────────────────────────────────────────────
export function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (origin === ALLOWED_ORIGIN || origin === ALLOWED_ORIGIN_WWW) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN_WWW);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

// ── Validation email robuste ──────────────────────────────────────
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/;
export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim()) && email.length <= 320;
}

// ── Rate limiting via Upstash Redis ──────────────────────────────
// Retourne true si la limite est dépassée, false si OK
export async function isRateLimited(key, maxRequests, windowSeconds) {
  const url   = process.env.upstash_redis_rest_KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL;
  const token = process.env.upstash_redis_rest_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return false; // fail open si Redis non configuré

  try {
    const rlKey = `rl:${key}`;

    // INCR atomique
    const incrRes = await fetch(`${url}/incr/${encodeURIComponent(rlKey)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const { result: count } = await incrRes.json();

    // Si c'est le premier appel de la fenêtre, poser l'expiration
    if (count === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(rlKey)}/${windowSeconds}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    return count > maxRequests;
  } catch (e) {
    console.error('[security] Rate limit check failed:', e.message);
    return false; // fail open
  }
}

// ── Obtenir l'IP du client ────────────────────────────────────────
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// ── Sanitiser une chaîne (supprimer HTML/scripts) ─────────────────
export function sanitize(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .slice(0, maxLen)
    .replace(/[<>]/g, '')
    .trim();
}

// ── Prix côté serveur des produits (source de vérité) ────────────
export const SERVER_PRICES = {
  'brosse-siwak':       12.99,
  'tetes-recharges':     6.99,
  'dentifrice-siwak':    5.99,
  'pack-siwak-complet': 24.99,
  'gant-corps':         21.59,
  'gant-visage':        13.19,
  'pack-1an-full-body': 29.99,
  'chouchou-soie':       5.39,
  'pack-tetes-x3':      17.99,
  'pack-dentifrice-3m': 15.99,
  'sac-cadeau':          1.39,
};

// ── Grilles de frais de livraison (identique à cart.js) ──────────
const MR_TARIFS = [
  [150,4.59],[250,4.99],[500,5.49],[1000,5.99],
  [2000,6.99],[5000,8.49],[10000,11.49],[20000,14.99],[30000,19.99]
];
const COL_TARIFS = [
  [250,6.30],[500,6.75],[750,7.60],[1000,8.05],[2000,8.95],
  [5000,12.25],[10000,17.30],[15000,21.25],[20000,24.75],[25000,28.50],[30000,32.25]
];
const PRODUCT_WEIGHTS = {
  'brosse-siwak':60,'tetes-recharges':10,'dentifrice-siwak':75,'pack-siwak-complet':320,
  'gant-corps':63,'gant-visage':18,'pack-1an-full-body':81,'chouchou-soie':15,
  'pack-tetes-x3':30,'pack-dentifrice-3m':225,'sac-cadeau':30
};

function shippingCost(carrier, weightG) {
  const tarifs = carrier === 'colissimo' ? COL_TARIFS : MR_TARIFS;
  for (const [maxW, price] of tarifs) {
    if (weightG <= maxW) return price;
  }
  return tarifs[tarifs.length - 1][1];
}

// ── Calculer le total attendu côté serveur ────────────────────────
// Retourne { subtotal, shipping, total, valid: true } ou { valid: false }
export function computeExpectedTotal(items, carrier, promoRate) {
  if (!Array.isArray(items) || items.length === 0) return { valid: false };

  let subtotal = 0;
  let totalWeightG = 0;

  for (const item of items) {
    const price = SERVER_PRICES[item.id];
    if (!price) return { valid: false }; // produit inconnu
    const qty = parseInt(item.qty, 10);
    if (!qty || qty < 1 || qty > 99) return { valid: false };
    subtotal += price * qty;
    totalWeightG += (PRODUCT_WEIGHTS[item.id] || 50) * qty;
  }

  // Appliquer le code promo (max 50% de réduction)
  const rate = Math.min(Math.max(parseFloat(promoRate) || 0, 0), 0.5);
  const discountedSubtotal = Math.round(subtotal * (1 - rate) * 100) / 100;

  // Mondial Relay gratuit dès 45€ (avant promo)
  const isMondialRelay = carrier !== 'colissimo';
  const freeShipping = isMondialRelay && discountedSubtotal >= 45;
  const shipping = freeShipping ? 0 : shippingCost(carrier, totalWeightG);

  const total = Math.round((discountedSubtotal + shipping) * 100) / 100;
  return { subtotal: discountedSubtotal, shipping, total, valid: true };
}
