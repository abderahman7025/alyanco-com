// api/abandon-cart.js — Capture panier abandonné → Brevo liste #2
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, cartItems, total, lang } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email invalide' });

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return res.status(500).end();

  const cartText = (cartItems || []).map(i => `${i.name} ×${i.qty}`).join(', ');

  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: [2],
        attributes: {
          PANIER_CONTENU: cartText,
          PANIER_TOTAL: String(parseFloat(total || 0).toFixed(2)),
          LANGUE: lang || 'fr'
        }
      })
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Abandon cart error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
