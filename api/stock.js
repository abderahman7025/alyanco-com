// api/stock.js — Public GET endpoint for product stock
// GET /api/stock?id=brosse-siwak → { id, stock, status }
// GET /api/stock                 → all products { pid: { stock, status } }

const INDIVIDUAL_IDS = [
  'brosse-siwak', 'tetes-recharges', 'dentifrice-siwak',
  'gant-corps', 'gant-visage', 'chouchou-soie'
];

const PACK_COMPOSITIONS = {
  'pack-siwak-complet':  [{ id: 'brosse-siwak', qty: 1 }, { id: 'tetes-recharges', qty: 1 }, { id: 'dentifrice-siwak', qty: 1 }],
  'pack-1an-full-body':  [{ id: 'gant-corps', qty: 1 }, { id: 'gant-visage', qty: 1 }],
  'pack-tetes-x3':       [{ id: 'tetes-recharges', qty: 3 }],
  'pack-dentifrice-3m':  [{ id: 'dentifrice-siwak', qty: 3 }]
};

const ALL_IDS = [
  ...INDIVIDUAL_IDS,
  'pack-siwak-complet', 'pack-1an-full-body', 'pack-tetes-x3', 'pack-dentifrice-3m'
];

function stockStatus(stock) {
  if (stock <= 0)  return 'rupture';
  if (stock <= 4)  return 'critique';
  if (stock <= 10) return 'faible';
  return 'ok';
}

async function kvGet(key, url, token) {
  const r = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) return null;
  const data = await r.json();
  return data.result !== null ? parseInt(data.result, 10) : null;
}

// cache avoids re-fetching the same individual stock in a single request
async function getStock(id, url, token, cache) {
  const comp = PACK_COMPOSITIONS[id];
  if (comp) {
    const stocks = await Promise.all(
      comp.map(async c => {
        if (cache[c.id] === undefined) {
          cache[c.id] = (await kvGet(`stock:${c.id}`, url, token)) ?? 0;
        }
        return Math.floor(cache[c.id] / c.qty);
      })
    );
    return Math.min(...stocks);
  }
  if (cache[id] === undefined) {
    cache[id] = (await kvGet(`stock:${id}`, url, token)) ?? 0;
  }
  return cache[id];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

  const url   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(503).json({ error: 'Stock service not configured' });

  const id    = req.query.id;
  const cache = {};

  try {
    if (id) {
      if (!ALL_IDS.includes(id)) return res.status(400).json({ error: 'Unknown product id' });
      const stock = await getStock(id, url, token, cache);
      return res.status(200).json({ id, stock, status: stockStatus(stock) });
    }

    // Return all stocks in one call
    const result = {};
    await Promise.all(
      ALL_IDS.map(async pid => {
        const stock = await getStock(pid, url, token, cache);
        result[pid] = { stock, status: stockStatus(stock) };
      })
    );
    return res.status(200).json(result);

  } catch (err) {
    console.error('Stock read error:', err);
    return res.status(500).json({ error: err.message });
  }
}
