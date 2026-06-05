import { setCors, getClientIp, isRateLimited, isValidEmail } from './_security.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Rate limiting : 3 inscriptions / heure par IP ─────────────
  const ip = getClientIp(req);
  if (await isRateLimited(`nl:${ip}`, 3, 3600)) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez plus tard.' });
  }

  const { email } = req.body || {};
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return res.status(500).json({ error: 'Configuration manquante' });

  const safeEmail = email.trim().toLowerCase();

  try {
    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({ email: safeEmail, updateEnabled: true, listIds: [3] })
    });

    const data = await r.json().catch(() => ({}));
    const ok = r.status === 201 || r.status === 204 || data.code === 'duplicate_parameter';
    if (!ok) {
      console.error('[newsletter] Brevo error:', data);
      return res.status(500).json({ error: 'Erreur inscription' });
    }

    // Email de bienvenue
    const welcomeHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:Helvetica,Arial,sans-serif;font-weight:300;color:#1C1612;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6F1;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#FFFFFF;">
      <tr><td style="background:#1C1612;padding:36px 48px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:26px;font-weight:400;letter-spacing:0.15em;color:#FAF6F1;margin-bottom:6px;">ALYA &amp; CO.</div>
        <div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#B8975A;">Bien-être &nbsp;✦&nbsp; Satisfaction &nbsp;✦&nbsp; Sourire</div>
      </td></tr>
      <tr><td style="background:#B8975A;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:48px 48px 36px;text-align:center;background:#FAF6F1;">
        <div style="font-size:40px;margin-bottom:20px;">🌿</div>
        <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:400;color:#1C1612;margin:0 0 16px;line-height:1.25;">
          Bienvenue dans la famille<br><em style="color:#B8975A;">ALYA &amp; CO.</em>
        </h1>
        <p style="font-size:15px;color:#6B5B4E;margin:0 0 8px;line-height:1.8;">
          Merci de nous faire confiance.<br>
          Vous faites maintenant partie d'une communauté qui choisit le naturel, le soin et l'authenticité.
        </p>
      </td></tr>
      <tr><td style="padding:0 48px;"><div style="height:1px;background:#F0E8DF;"></div></td></tr>
      <tr><td style="padding:36px 48px;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#B8975A;margin:0 0 24px;text-align:center;">Ce qui vous attend</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="33%" style="text-align:center;padding:0 12px;vertical-align:top;">
              <div style="font-size:28px;margin-bottom:10px;">✨</div>
              <div style="font-size:12px;font-weight:600;color:#1C1612;margin-bottom:6px;">Nouveautés en avant-première</div>
              <div style="font-size:12px;color:#A8958A;line-height:1.6;">Découvrez nos nouvelles collections avant tout le monde</div>
            </td>
            <td width="33%" style="text-align:center;padding:0 12px;vertical-align:top;">
              <div style="font-size:28px;margin-bottom:10px;">🎁</div>
              <div style="font-size:12px;font-weight:600;color:#1C1612;margin-bottom:6px;">Offres exclusives</div>
              <div style="font-size:12px;color:#A8958A;line-height:1.6;">Promotions réservées à nos abonnés newsletter</div>
            </td>
            <td width="33%" style="text-align:center;padding:0 12px;vertical-align:top;">
              <div style="font-size:28px;margin-bottom:10px;">🌱</div>
              <div style="font-size:12px;font-weight:600;color:#1C1612;margin-bottom:6px;">Conseils bien-être</div>
              <div style="font-size:12px;color:#A8958A;line-height:1.6;">Routines naturelles, astuces beauté et bien-être</div>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 48px;"><div style="height:1px;background:#F0E8DF;"></div></td></tr>
      <tr><td style="padding:36px 48px;text-align:center;">
        <a href="https://alyanco.com" style="display:inline-block;padding:16px 44px;background:#1C1612;color:#FAF6F1;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;">
          Découvrir la boutique
        </a>
      </td></tr>
      <tr><td style="background:#B8975A;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="background:#1C1612;padding:28px 48px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:15px;color:#FAF6F1;margin-bottom:8px;letter-spacing:0.1em;">ALYA &amp; CO.</div>
        <div style="font-size:10px;color:#4A3F38;line-height:1.8;">
          <a href="https://alyanco.com/mentions-legales" style="color:#4A3F38;text-decoration:none;">Se désinscrire</a>
          &nbsp;·&nbsp;
          <a href="https://alyanco.com/mentions-legales" style="color:#4A3F38;text-decoration:none;">Mentions légales</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        sender:      { name: 'ALYA & CO.', email: 'contact@alyanco.com' },
        to:          [{ email: safeEmail }],
        subject:     'Bienvenue dans la famille ALYA & CO. 🌿',
        htmlContent: welcomeHtml
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[newsletter]', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
