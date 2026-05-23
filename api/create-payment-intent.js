export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });

  const { amount, orderNumber } = req.body;
  if (!amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Convert euros to cents (Stripe uses smallest currency unit)
  const amountCents = Math.round(parseFloat(amount) * 100);

  const params = new URLSearchParams();
  params.append('amount', String(amountCents));
  params.append('currency', 'eur');
  params.append('payment_method_types[]', 'card');
  if (orderNumber) params.append('metadata[orderNumber]', orderNumber);

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

    if (!response.ok) {
      console.error('Stripe error:', data.error);
      return res.status(400).json({ error: data.error?.message || 'Erreur Stripe' });
    }

    return res.status(200).json({ clientSecret: data.client_secret });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
