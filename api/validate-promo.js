import { setCors, getClientIp, isRateLimited, isValidEmail, loadPromoCodes } from './_security.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // ── Rate limiting : 10 tentatives / 15 min par IP ─────────────
  const ip = getClientIp(req);
  if (await isRateLimited(`vp:${ip}`, 10, 900)) {
    return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' });
  }

  const { email, code } = req.body || {};
  const upperCode = (typeof code === 'string' ? code : '').trim().toUpperCase().slice(0, 20);
  const CODES = loadPromoCodes();

  if (!CODES[upperCode]) {
    return res.status(200).json({ valid: false, reason: 'Code invalide.' });
  }

  if (!isValidEmail(email)) {
    return res.status(200).json({ valid: false, reason: 'Veuillez renseigner votre email avant d\'appliquer le code.' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return res.status(200).json({ valid: true, ...CODES[upperCode] });
  }

  try {
    const r = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email.trim().toLowerCase())}`, {
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' }
    });

    if (r.status === 404) {
      // Email non trouvé dans Brevo → pas abonné à la newsletter → code refusé
      return res.status(200).json({ valid: false, reason: 'Ce code est réservé aux abonnés à notre newsletter.' });
    }

    if (!r.ok) {
      // Erreur Brevo → on refuse par sécurité
      return res.status(200).json({ valid: false, reason: 'Impossible de vérifier le code. Réessayez.' });
    }

    const contact = await r.json();

    // Vérifier que le contact est bien abonné à la liste Newsletter (#3)
    const lists = contact.listIds || [];
    if (!lists.includes(3)) {
      return res.status(200).json({ valid: false, reason: 'Ce code est réservé aux abonnés à notre newsletter.' });
    }

    const usedCodes = (contact.attributes?.PROMO_USED || '').toUpperCase();

    if (usedCodes.includes(upperCode)) {
      return res.status(200).json({ valid: false, reason: 'Ce code a déjà été utilisé avec cette adresse email.' });
    }

    return res.status(200).json({ valid: true, ...CODES[upperCode] });

  } catch (err) {
    console.error('[validate-promo]', err.message);
    return res.status(200).json({ valid: true, ...CODES[upperCode] });
  }
}
