// api/_prices.js — Source unique des prix ALYA & CO.
// Les prix modifiés depuis l'admin sont stockés dans Redis (clé "prices").
// Sans modification, ce sont les prix par défaut ci-dessous qui s'appliquent.

export const DEFAULT_PRICES = {
  'brosse-siwak':       { price: 12.99, old: 15.99 },
  'tetes-recharges':    { price:  6.99, old:  8.99 },
  'dentifrice-siwak':   { price:  5.99, old:  7.99 },
  'pack-siwak-complet': { price: 24.99, old: 32.99 },
  'gant-corps':         { price: 21.59, old: 35.99 },
  'gant-visage':        { price: 13.19, old: 21.99 },
  'pack-1an-full-body': { price: 29.99, old: 57.98 },
  'chouchou-soie':      { price:  5.39, old:  8.99 },
  'pack-tetes-x3':      { price: 17.99, old: 26.99 },
  'pack-dentifrice-3m': { price: 15.99, old: 23.99 },
  'sac-cadeau':         { price:  1.39, old: null  },
};

function redisEnv() {
  return {
    url:   process.env.upstash_redis_rest_KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL,
    token: process.env.upstash_redis_rest_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  };
}

const round2 = n => Math.round(n * 100) / 100;

// Vérifie et nettoie un objet de prix. Ignore les produits inconnus et les valeurs invalides.
export function sanitizePrices(input) {
  const out = {};
  if (!input || typeof input !== 'object') return out;
  for (const id of Object.keys(DEFAULT_PRICES)) {
    const p = input[id];
    if (!p || typeof p !== 'object') continue;
    const price = Number(p.price);
    if (!Number.isFinite(price) || price < 0.5 || price > 999) continue;
    let old = p.old === null || p.old === undefined || p.old === '' ? null : Number(p.old);
    if (old !== null && (!Number.isFinite(old) || old <= price || old > 9999)) old = null;
    out[id] = { price: round2(price), old: old === null ? null : round2(old) };
  }
  return out;
}

// Prix en vigueur = défauts + modifications enregistrées dans Redis.
export async function getPrices() {
  const merged = JSON.parse(JSON.stringify(DEFAULT_PRICES));
  const { url, token } = redisEnv();
  if (!url || !token) return merged;
  try {
    const r = await fetch(`${url}/get/prices`, { headers: { Authorization: `Bearer ${token}` } });
    const { result } = await r.json();
    if (result) Object.assign(merged, sanitizePrices(JSON.parse(result)));
  } catch (e) {
    console.error('[prices] lecture Redis impossible:', e.message);
  }
  return merged;
}

export async function savePrices(prices) {
  const { url, token } = redisEnv();
  if (!url || !token) throw new Error('Redis non configuré');
  const clean = sanitizePrices(prices);
  const current = await getPrices();
  const next = { ...current, ...clean };
  const r = await fetch(`${url}/set/prices`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(next),
  });
  if (!r.ok) throw new Error('Enregistrement Redis échoué');
  return next;
}
