// api/validate-promo.js — Validation code promo par adresse email via Brevo
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code } = req.body || {};
  const upperCode = (code || '').trim().toUpperCase();

  // Codes valides et leurs réductions
  const CODES = {
    'ALYA10': { discount: 0.10, label: '-10%' }
  };

  if (!CODES[upperCode]) {
    return res.status(200).json({ valid: false, reason: 'Code invalide.' });
  }

  if (!email || !email.includes('@')) {
    return res.status(200).json({ valid: false, reason: 'Veuillez renseigner votre email avant d\'appliquer le code.' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    // Pas de clé Brevo configurée — on laisse passer (fail open)
    return res.status(200).json({ valid: true, ...CODES[upperCode] });
  }

  try {
    // Vérifier si le contact existe et a déjà utilisé ce code
    const r = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' }
    });

    if (r.status === 404) {
      // Contact inconnu = première commande = code valide
      return res.status(200).json({ valid: true, ...CODES[upperCode] });
    }

    if (!r.ok) {
      // Erreur Brevo → fail open (on ne bloque pas le client)
      console.error('Brevo check error:', r.status);
      return res.status(200).json({ valid: true, ...CODES[upperCode] });
    }

    const contact = await r.json();
    const usedCodes = (contact.attributes?.PROMO_USED || '').toUpperCase();

    if (usedCodes.includes(upperCode)) {
      return res.status(200).json({
        valid: false,
        reason: 'Ce code a déjà été utilisé avec cette adresse email.'
      });
    }

    // Code non encore utilisé par cet email
    return res.status(200).json({ valid: true, ...CODES[upperCode] });

  } catch (err) {
    console.error('validate-promo error:', err);
    // Erreur réseau → fail open
    return res.status(200).json({ valid: true, ...CODES[upperCode] });
  }
}
