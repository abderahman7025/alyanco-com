// api/set-prices.js — Enregistre les prix depuis la page admin.
// POST { secret, prices: { 'gant-corps': { price: 21.59, old: 35.99 }, ... } }
import { savePrices, sanitizePrices } from './_prices.js';
import { setCors, getClientIp, isRateLimited, checkBodySize } from './_security.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkBodySize(req, res, 20)) return;

  const ip = getClientIp(req);
  if (await isRateLimited(`sp:${ip}`, 20, 900)) {
    return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
  }

  const adminSecret = process.env.STOCK_ADMIN_SECRET;
  if (!adminSecret) return res.status(503).json({ error: 'Service non configuré' });

  const { secret, prices } = req.body || {};
  if (secret !== adminSecret) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const clean = sanitizePrices(prices);
  if (Object.keys(clean).length === 0) {
    return res.status(400).json({ error: 'Aucun prix valide (prix entre 0,50 € et 999 €, prix barré supérieur au prix).' });
  }

  try {
    const saved = await savePrices(clean);
    return res.status(200).json({ success: true, prices: saved });
  } catch (err) {
    console.error('[set-prices]', err.message);
    return res.status(500).json({ error: 'Enregistrement impossible' });
  }
}
