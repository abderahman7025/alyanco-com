// api/stripe-webhook.js — Webhook Stripe pour vérification côté serveur
// Configure dans Stripe Dashboard → Developers → Webhooks
// URL : https://alyanco.com/api/stripe-webhook
// Événements à écouter : payment_intent.succeeded, payment_intent.payment_failed

export const config = {
  api: { bodyParser: false } // IMPORTANT : ne pas parser le body pour la vérification de signature
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripeKey     = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return res.status(503).json({ error: 'Webhook non configuré' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) return res.status(400).json({ error: 'Signature manquante' });

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    return res.status(400).json({ error: 'Impossible de lire le body' });
  }

  // ── Vérification de la signature Stripe ──────────────────────
  let event;
  try {
    // Vérification manuelle sans SDK (pour Vercel Edge)
    const parts = signature.split(',');
    const tPart = parts.find(p => p.startsWith('t='));
    const v1Part = parts.find(p => p.startsWith('v1='));
    if (!tPart || !v1Part) throw new Error('Signature invalide');

    const timestamp = tPart.slice(2);
    const expectedSig = v1Part.slice(3);

    // Vérifier que l'event n'est pas trop vieux (5 min)
    const tsNum = parseInt(timestamp, 10);
    if (Date.now() / 1000 - tsNum > 300) throw new Error('Event expiré');

    // Recalculer la signature HMAC-SHA256
    const { createHmac } = await import('crypto');
    const payload = `${timestamp}.${rawBody.toString()}`;
    const computedSig = createHmac('sha256', webhookSecret).update(payload).digest('hex');

    if (computedSig !== expectedSig) throw new Error('Signature incorrecte');

    event = JSON.parse(rawBody.toString());
  } catch (err) {
    console.error('[stripe-webhook] Signature invalide:', err.message);
    return res.status(400).json({ error: 'Webhook invalide' });
  }

  // ── Traitement des événements ─────────────────────────────────
  const redisUrl   = process.env.upstash_redis_rest_KV_REST_API_URL   || process.env.KV_REST_API_URL;
  const redisToken = process.env.upstash_redis_rest_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    console.log(`[stripe-webhook] Paiement confirmé: ${pi.id} — ${pi.amount / 100}€ — ${pi.metadata?.orderNumber || '?'}`);

    // Marquer le PI comme vérifié par Stripe (source de confiance)
    if (redisUrl && redisToken) {
      const key = `pi_stripe_ok:${pi.id}`;
      await fetch(`${redisUrl}/set/${encodeURIComponent(key)}/1/ex/2592000`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${redisToken}` }
      }).catch(() => {});
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    console.warn(`[stripe-webhook] Paiement échoué: ${pi.id} — ${pi.last_payment_error?.message || '?'}`);
  }

  return res.status(200).json({ received: true });
}
