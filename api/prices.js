// api/prices.js — Prix en vigueur, lus par toutes les pages du site.
// GET /api/prices            → script : window.ALYA_PRICES = {...}
// GET /api/prices?format=json → JSON (page admin)
import { getPrices } from './_prices.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const prices = await getPrices();

  // Cache CDN 30 s : un changement fait dans l'admin est visible en moins d'une minute
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');

  if (req.query.format === 'json') {
    return res.status(200).json(prices);
  }
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  return res.status(200).send('window.ALYA_PRICES=' + JSON.stringify(prices) + ';');
}
