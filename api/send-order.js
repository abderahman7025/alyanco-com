export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'BREVO_API_KEY not configured' });

  const { email, prenom, nom, orderNumber, items, total, shippingCost, shipping, adresse, cp, ville } = req.body;

  if (!email || !orderNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Format helpers
  const fmt = (n) => parseFloat(n).toFixed(2).replace('.', ',') + ' €';
  const shippingLabel = shipping === 'colissimo' ? 'Colissimo — 48h' : 'Mondial Relay — 72h';
  const shippingLine = parseFloat(shippingCost) === 0
    ? '<span style="color:#B8975A;font-weight:500;">Offerte</span>'
    : fmt(shippingCost);

  // Build items rows
  const itemsRows = (items || []).map(item => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #F0E8DF;vertical-align:middle;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:16px;vertical-align:middle;">
              <img src="${item.image}" alt="${item.name}" width="60" height="60"
                style="width:60px;height:60px;object-fit:cover;display:block;background:#EAD1BF;">
            </td>
            <td style="vertical-align:middle;">
              <div style="font-family:Georgia,serif;font-size:15px;color:#1C1612;margin-bottom:4px;">${item.name}</div>
              <div style="font-size:12px;color:#A8958A;letter-spacing:0.1em;">Quantité : ${item.qty}</div>
            </td>
          </tr>
        </table>
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #F0E8DF;vertical-align:middle;text-align:right;font-family:Georgia,serif;font-size:16px;color:#1C1612;white-space:nowrap;">${fmt(item.total)}</td>
    </tr>
  `).join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation de commande ${orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-weight:300;color:#1C1612;">

<!-- Preheader text (hidden, shown in inbox preview) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  Merci ${prenom} ! Votre commande ${orderNumber} a bien été confirmée. ✦ ALYA &amp; CO.
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6F1;min-height:100vh;">
  <tr>
    <td align="center" style="padding:40px 20px;">

      <!-- Container -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;">

        <!-- HEADER -->
        <tr>
          <td style="background:#1C1612;padding:40px 48px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;letter-spacing:0.15em;color:#FAF6F1;margin-bottom:8px;">
              ALYA &amp; CO.
            </div>
            <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#B8975A;">
              Bien-être &nbsp;✦&nbsp; Satisfaction &nbsp;✦&nbsp; Sourire
            </div>
          </td>
        </tr>

        <!-- GOLD LINE -->
        <tr><td style="background:#B8975A;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- HERO MESSAGE -->
        <tr>
          <td style="padding:48px 48px 32px;text-align:center;background:#FAF6F1;">
            <div style="width:64px;height:64px;background:#B8975A;border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;text-align:center;color:#FFFFFF;">
              ✓
            </div>
            <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#1C1612;margin:0 0 12px;line-height:1.2;">
              Merci, <em style="color:#B8975A;">${prenom} !</em>
            </h1>
            <p style="font-size:15px;color:#6B5B4E;margin:0 0 20px;line-height:1.7;">
              Votre commande a bien été confirmée.<br>
              Nous la préparons avec soin.
            </p>
            <div style="display:inline-block;background:rgba(184,151,90,0.1);border:1px solid rgba(184,151,90,0.3);color:#B8975A;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;padding:10px 24px;">
              ${orderNumber}
            </div>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:#F0E8DF;"></div></td></tr>

        <!-- ORDER ITEMS -->
        <tr>
          <td style="padding:32px 48px;">
            <h2 style="font-family:Georgia,serif;font-size:18px;font-weight:400;color:#1C1612;margin:0 0 20px;letter-spacing:0.05em;">
              Votre commande
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${itemsRows}
              <!-- Sous-total -->
              <tr>
                <td style="padding:12px 0 6px;font-size:13px;color:#6B5B4E;">Sous-total</td>
                <td style="padding:12px 0 6px;font-size:13px;color:#6B5B4E;text-align:right;">${fmt(total - parseFloat(shippingCost))}</td>
              </tr>
              <!-- Livraison -->
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6B5B4E;">${shippingLabel}</td>
                <td style="padding:6px 0;font-size:13px;text-align:right;">${shippingLine}</td>
              </tr>
              <!-- Total -->
              <tr>
                <td style="padding:16px 0 0;border-top:1px solid #EAD1BF;font-family:Georgia,serif;font-size:20px;color:#1C1612;font-weight:400;">Total payé</td>
                <td style="padding:16px 0 0;border-top:1px solid #EAD1BF;font-family:Georgia,serif;font-size:20px;color:#B8975A;text-align:right;font-weight:400;">${fmt(total)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:#F0E8DF;"></div></td></tr>

        <!-- DELIVERY INFO -->
        <tr>
          <td style="padding:32px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" style="padding-right:16px;vertical-align:top;">
                  <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#B8975A;margin-bottom:12px;">Adresse de livraison</div>
                  <div style="font-size:14px;color:#1C1612;line-height:1.8;">
                    <strong>${prenom} ${nom}</strong><br>
                    ${adresse}<br>
                    ${cp} ${ville}<br>
                    France
                  </div>
                </td>
                <td width="50%" style="padding-left:16px;vertical-align:top;border-left:1px solid #F0E8DF;">
                  <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#B8975A;margin-bottom:12px;">Mode d'expédition</div>
                  <div style="font-size:14px;color:#1C1612;line-height:1.8;">
                    <strong>${shippingLabel}</strong><br>
                    Expédition sous 24–48h<br>
                    <span style="color:#6B5B4E;font-size:12px;">Un email de suivi vous sera envoyé dès le départ de votre colis.</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:8px 48px 40px;text-align:center;">
            <a href="https://alyanco.fr" style="display:inline-block;padding:16px 40px;background:#1C1612;color:#FAF6F1;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">
              Retour à la boutique
            </a>
          </td>
        </tr>

        <!-- GOLD LINE -->
        <tr><td style="background:#B8975A;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#1C1612;padding:32px 48px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:16px;color:#FAF6F1;margin-bottom:8px;letter-spacing:0.1em;">
              ALYA &amp; CO.
            </div>
            <div style="font-size:11px;color:#6B5B4E;margin-bottom:16px;line-height:1.8;">
              Des questions ? Contactez-nous à <a href="mailto:contact@alyanco.fr" style="color:#B8975A;text-decoration:none;">contact@alyanco.fr</a>
            </div>
            <div style="font-size:10px;color:#4A3F38;letter-spacing:0.1em;">
              © 2025 ALYA &amp; CO. — Tous droits réservés
              &nbsp;·&nbsp; <a href="https://alyanco.fr/cgv" style="color:#4A3F38;text-decoration:none;">CGV</a>
              &nbsp;·&nbsp; <a href="https://alyanco.fr/mentions-legales" style="color:#4A3F38;text-decoration:none;">Mentions légales</a>
            </div>
          </td>
        </tr>

      </table>
      <!-- END Container -->

    </td>
  </tr>
</table>

</body>
</html>`;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: {
          name: 'ALYA & CO.',
          email: 'contact@alyanco.fr'
        },
        to: [{
          email: email,
          name: prenom + ' ' + nom
        }],
        subject: `Confirmation de commande ${orderNumber} — ALYA & CO.`,
        htmlContent: htmlContent
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true, orderNumber });
    } else {
      const errorBody = await response.text();
      console.error('Brevo error:', errorBody);
      return res.status(500).json({ error: 'Failed to send email', details: errorBody });
    }
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
