import { setCors, getClientIp, isRateLimited, isValidEmail, sanitize } from './_security.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // ── Rate limiting : 5 / 15 min par IP ────────────────────────
  const ip = getClientIp(req);
  if (await isRateLimited(`ac:${ip}`, 5, 900)) {
    return res.status(429).json({ error: 'Trop de requêtes.' });
  }

  const { email, cartItems, total, lang } = req.body || {};

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return res.status(500).end();

  // Sanitiser le contenu du panier avant envoi
  const cartText = (Array.isArray(cartItems) ? cartItems : [])
    .slice(0, 20) // max 20 items
    .map(i => `${sanitize(String(i.name || ''), 80)} ×${parseInt(i.qty, 10) || 1}`)
    .join(', ');

  const totalNum = Math.max(0, Math.min(parseFloat(total) || 0, 9999));
  const safeLang = ['fr', 'en', 'de', 'es', 'it', 'nl', 'pt'].includes(lang) ? lang : 'fr';

  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        updateEnabled: true,
        listIds: [2],
        attributes: {
          PANIER_CONTENU: cartText,
          PANIER_TOTAL: totalNum.toFixed(2),
          LANGUE: safeLang
        }
      })
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[abandon-cart]', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
