import { setCors, getClientIp, isRateLimited, computeExpectedTotal, checkBodySize } from './_security.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  if (!checkBodySize(req, res, 20)) return;

  // ── Rate limiting : 8 PaymentIntents / 10 min par IP ──────────
  const ip = getClientIp(req);
  if (await isRateLimited(`pi:${ip}`, 8, 600)) {
    return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'Configuration manquante' });

  const { amount, orderNumber, delivery, totalWeight, items, carrier, promoRate } = req.body || {};

  // ── Vérification du montant côté serveur ──────────────────────
  // Si les items sont fournis, on recalcule le montant exact
  if (items && Array.isArray(items)) {
    const expected = computeExpectedTotal(items, carrier || 'mondial-relay', promoRate || 0);
    if (!expected.valid) {
      return res.status(400).json({ error: 'Panier invalide.' });
    }

    const clientAmount = parseFloat(amount);
    const diff = Math.abs(clientAmount - expected.total);

    // Tolérance de 0.02€ pour les arrondis flottants
    if (diff > 0.02) {
      console.warn(`[security] Montant suspect: client=${clientAmount} attendu=${expected.total} IP=${ip}`);
      return res.status(400).json({ error: 'Montant invalide.' });
    }

    // Utiliser le montant calculé côté serveur (jamais le montant client)
    const amountCents = Math.round(expected.total * 100);

    return await createIntent(res, secretKey, amountCents, orderNumber, delivery, totalWeight);
  }

  // Fallback si pas d'items (rétrocompatibilité)
  const clientAmount = parseFloat(amount);
  if (!amount || isNaN(clientAmount) || clientAmount <= 0 || clientAmount > 9999) {
    return res.status(400).json({ error: 'Montant invalide.' });
  }
  const amountCents = Math.round(clientAmount * 100);
  return await createIntent(res, secretKey, amountCents, orderNumber, delivery, totalWeight);
}

async function createIntent(res, secretKey, amountCents, orderNumber, delivery, totalWeight) {
  const params = new URLSearchParams();
  params.append('amount', String(amountCents));
  params.append('currency', 'eur');
  params.append('payment_method_types[]', 'card');

  if (orderNumber) params.append('metadata[orderNumber]', orderNumber);
  if (totalWeight) params.append('metadata[totalWeight]', String(totalWeight));

  if (delivery) {
    const fields = ['email', 'prenom', 'nom', 'tel', 'adresse', 'cp', 'ville', 'pays', 'shipping'];
    for (const f of fields) {
      if (delivery[f]) params.append(`metadata[${f}]`, String(delivery[f]).slice(0, 500));
    }
    params.append('metadata[shippingCost]', String(delivery.shippingCost || 0));
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.error?.message || 'Erreur paiement' });
    return res.status(200).json({ clientSecret: data.client_secret });
  } catch (err) {
    console.error('[create-payment-intent]', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
