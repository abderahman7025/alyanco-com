// api/newsletter.js — Inscription newsletter via Brevo
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return res.status(500).json({ error: 'Configuration manquante' });

  try {
    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: [3]
      })
    });

    // 201 = créé, 204 = mis à jour, duplicate = déjà inscrit
    if (r.status === 201 || r.status === 204) {
      return res.status(200).json({ success: true });
    }
    const data = await r.json().catch(() => ({}));
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true }); // Déjà inscrit = OK
    }
    console.error('Brevo newsletter error:', data);
    return res.status(500).json({ error: 'Erreur inscription' });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
