import { setCors, getClientIp, isRateLimited, isValidEmail } from './_security.js';

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

  // Codes valides — lus depuis les variables d'environnement (priorité)
  // sinon fallback sur le code hardcodé
  const CODES = {};
  const envCodes = process.env.PROMO_CODES;
  if (envCodes) {
    try {
      // Format attendu : JSON {"ALYA10":{"discount":0.10,"label":"-10%"}}
      Object.assign(CODES, JSON.parse(envCodes));
    } catch { /* ignore */ }
  }
  // Fallback si pas de variable d'env
  if (Object.keys(CODES).length === 0) {
    CODES['ALYA10'] = { discount: 0.10, label: '-10%' };
  }

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
      return res.status(200).json({ valid: true, ...CODES[upperCode] });
    }

    if (!r.ok) {
      return res.status(200).json({ valid: true, ...CODES[upperCode] });
    }

    const contact = await r.json();
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
