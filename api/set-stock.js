// api/set-stock.js — Admin POST endpoint for managing stock
// Requires header or body field: secret === process.env.STOCK_ADMIN_SECRET
//
// POST /api/set-stock { secret, id, stock }              → set one product
// POST /api/set-stock { secret, batch: [{id,stock},...] } → set multiple
// POST /api/set-stock { secret, init: true }             → reset to defaults

const INDIVIDUAL_IDS = [
  'brosse-siwak', 'tetes-recharges', 'dentifrice-siwak',
  'gant-corps', 'gant-visage', 'chouchou-soie'
];

const DEFAULTS = {
  'brosse-siwak':    900,
  'tetes-recharges': 900,
  'dentifrice-siwak':900,
  'gant-corps':      400,
  'gant-visage':     150,
  'chouchou-soie':    80
};

async function kvSet(key, value, url, token) {
  const r = await fetch(`${url}/set/${encodeURIComponent(key)}/${Math.round(value)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`KV set failed for ${key}: ${body}`);
  }
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.alyanco.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const adminSecret = process.env.STOCK_ADMIN_SECRET;
  const url         = process.env.upstash_redis_rest_KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL;
  const token       = process.env.upstash_redis_rest_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!adminSecret || !url || !token) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const { secret, id, stock, init, batch } = req.body || {};

  if (secret !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // ── INIT: reset all to defaults ────────────────────────────────
    if (init) {
      await Promise.all(
        Object.entries(DEFAULTS).map(([pid, qty]) => kvSet(`stock:${pid}`, qty, url, token))
      );
      return res.status(200).json({ success: true, initialized: DEFAULTS });
    }

    // ── BATCH: [{ id, stock }, ...] ────────────────────────────────
    if (batch && Array.isArray(batch)) {
      const results = {};
      await Promise.all(
        batch.map(async ({ id: pid, stock: qty }) => {
          if (!INDIVIDUAL_IDS.includes(pid)) throw new Error(`Unknown product: ${pid}`);
          if (typeof qty !== 'number' || qty < 0) throw new Error(`Invalid stock value for ${pid}`);
          await kvSet(`stock:${pid}`, qty, url, token);
          results[pid] = Math.round(qty);
        })
      );
      return res.status(200).json({ success: true, updated: results });
    }

    // ── SINGLE ─────────────────────────────────────────────────────
    if (!id) return res.status(400).json({ error: 'Missing id or init flag' });
    if (!INDIVIDUAL_IDS.includes(id)) return res.status(400).json({ error: `Unknown product id: ${id}` });
    if (typeof stock !== 'number' || stock < 0) return res.status(400).json({ error: 'stock must be a non-negative number' });

    await kvSet(`stock:${id}`, stock, url, token);
    return res.status(200).json({ success: true, id, stock: Math.round(stock) });

  } catch (err) {
    console.error('Set-stock error:', err);
    return res.status(500).json({ error: err.message });
  }
}
