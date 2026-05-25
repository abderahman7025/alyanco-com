// ── STOCK MANAGEMENT ────────────────────────────────────────────
const PACK_COMPOSITIONS = {
  'pack-siwak-complet':  [{ id: 'brosse-siwak', qty: 1 }, { id: 'tetes-recharges', qty: 1 }, { id: 'dentifrice-siwak', qty: 1 }],
  'pack-1an-full-body':  [{ id: 'gant-corps', qty: 1 }, { id: 'gant-visage', qty: 1 }],
  'pack-tetes-x3':       [{ id: 'tetes-recharges', qty: 3 }],
  'pack-dentifrice-3m':  [{ id: 'dentifrice-siwak', qty: 3 }]
};

async function decrementStock(items) {
  const { KV_REST_API_URL: url, KV_REST_API_TOKEN: token } = process.env;
  if (!url || !token || !items?.length) return;

  // Flatten: compute how many units to deduct from each individual product
  const decrements = {};
  for (const item of items) {
    const comp = PACK_COMPOSITIONS[item.id];
    if (comp) {
      // Pack → decrement its component products
      for (const c of comp) {
        decrements[c.id] = (decrements[c.id] || 0) + c.qty * item.qty;
      }
    } else {
      // Individual product
      decrements[item.id] = (decrements[item.id] || 0) + item.qty;
    }
  }

  // Fire all decrements in parallel (atomic DECRBY via Vercel KV REST)
  await Promise.all(
    Object.entries(decrements).map(([pid, amt]) =>
      fetch(`${url}/decrby/${encodeURIComponent('stock:' + pid)}/${amt}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(e => console.error(`Stock decrement failed for ${pid}:`, e))
    )
  );
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const brevoKey = process.env.BREVO_API_KEY;
  const scPublic = process.env.SENDCLOUD_PUBLIC_KEY;
  const scSecret = process.env.SENDCLOUD_SECRET_KEY;

  if (!brevoKey) return res.status(500).json({ error: 'BREVO_API_KEY not configured' });

  const {
    email, prenom, nom, tel,
    orderNumber, items, total, shippingCost,
    shipping, adresse, cp, ville, pays, totalWeight, relayPoint,
    promoCode
  } = req.body;

  if (!email || !orderNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ── FORMAT HELPERS ──────────────────────────────────────────────
  const fmt = (n) => parseFloat(n).toFixed(2).replace('.', ',') + ' €';
  const shippingLabel = shipping === 'colissimo' ? 'Colissimo — 48h' : 'Mondial Relay — 72h';
  const shippingLineTxt = parseFloat(shippingCost) === 0 ? 'Offerte' : fmt(shippingCost);
  const shippingLineHtml = parseFloat(shippingCost) === 0
    ? '<span style="color:#B8975A;font-weight:500;">Offerte</span>'
    : fmt(shippingCost);

  // ── SENDCLOUD — CRÉATION DU COLIS & ÉTIQUETTE ──────────────────
  // IDs des méthodes d'expédition Sendcloud. Si ça ne colle pas avec votre compte,
  // vérifiez vos méthodes disponibles via GET /api/v2/shipping_methods
  const SC_METHOD = { 'mondial-relay': 8, 'colissimo': 26 };

  let labelUrl        = null;
  let sendcloudId     = null;
  let sendcloudError  = null;
  let trackingNumber  = null;
  let trackingUrl     = null;

  if (scPublic && scSecret) {
    try {
      const weightKg = totalWeight
        ? Math.max(0.01, totalWeight / 1000).toFixed(3)
        : '0.200';
      const methodId = SC_METHOD[shipping] || 8;
      const auth = Buffer.from(`${scPublic}:${scSecret}`).toString('base64');

      const scRes = await fetch('https://panel.sendcloud.sc/api/v2/parcels', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parcel: {
            name:        `${prenom} ${nom}`,
            // Pour Mondial Relay : livraison au point relais, pas au domicile
            address:     (shipping === 'mondial-relay' && relayPoint) ? relayPoint.adresse : adresse,
            city:        (shipping === 'mondial-relay' && relayPoint) ? relayPoint.ville   : ville,
            postal_code: (shipping === 'mondial-relay' && relayPoint) ? relayPoint.cp      : cp,
            country:     { iso_2: pays || 'FR' },
            email:       email,
            telephone:   tel || '',
            weight:      weightKg,
            order_number: orderNumber,
            shipment:    { id: methodId },
            // ID du point relais (obligatoire pour Mondial Relay)
            ...(shipping === 'mondial-relay' && relayPoint ? { to_service_point: relayPoint.id } : {}),
            request_label: true
          }
        })
      });

      const scData = await scRes.json();

      if (scRes.ok && scData.parcel) {
        sendcloudId    = scData.parcel.id;
        trackingNumber = scData.parcel.tracking_number || null;
        trackingUrl    = scData.parcel.tracking_url    || null;
        const label = scData.parcel.label;
        if (label) {
          labelUrl = (label.normal_printer  && label.normal_printer[0])
                  || (label.label_printer   && label.label_printer[0])
                  || null;
        }
      } else {
        sendcloudError = JSON.stringify(scData).slice(0, 400);
        console.error('Sendcloud error:', scData);
      }
    } catch (err) {
      sendcloudError = err.message;
      console.error('Sendcloud fetch error:', err);
    }
  }

  // ── EMAIL CLIENT — HTML ─────────────────────────────────────────
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
      <td style="padding:14px 0;border-bottom:1px solid #F0E8DF;vertical-align:middle;text-align:right;
                 font-family:Georgia,serif;font-size:16px;color:#1C1612;white-space:nowrap;">
        ${fmt(item.total)}
      </td>
    </tr>`).join('');

  const customerHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation de commande ${orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-weight:300;color:#1C1612;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  Merci ${prenom} ! Votre commande ${orderNumber} a bien été confirmée. ✦ ALYA &amp; CO.
</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6F1;min-height:100vh;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;">

      <!-- HEADER -->
      <tr>
        <td style="background:#1C1612;padding:40px 48px;text-align:center;">
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;letter-spacing:0.15em;color:#FAF6F1;margin-bottom:8px;">ALYA &amp; CO.</div>
          <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#B8975A;">Bien-être &nbsp;✦&nbsp; Satisfaction &nbsp;✦&nbsp; Sourire</div>
        </td>
      </tr>
      <tr><td style="background:#B8975A;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

      <!-- HERO -->
      <tr>
        <td style="padding:48px 48px 32px;text-align:center;background:#FAF6F1;">
          <div style="width:64px;height:64px;background:#B8975A;border-radius:50%;margin:0 auto 24px;
                      font-size:28px;line-height:64px;text-align:center;color:#FFFFFF;">✓</div>
          <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#1C1612;margin:0 0 12px;line-height:1.2;">
            Merci, <em style="color:#B8975A;">${prenom} !</em>
          </h1>
          <p style="font-size:15px;color:#6B5B4E;margin:0 0 20px;line-height:1.7;">
            Votre commande a bien été confirmée.<br>Nous la préparons avec soin.
          </p>
          <div style="display:inline-block;background:rgba(184,151,90,0.1);border:1px solid rgba(184,151,90,0.3);
                      color:#B8975A;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;padding:10px 24px;">
            ${orderNumber}
          </div>
        </td>
      </tr>

      <tr><td style="padding:0 48px;"><div style="height:1px;background:#F0E8DF;"></div></td></tr>

      <!-- ARTICLES -->
      <tr>
        <td style="padding:32px 48px;">
          <h2 style="font-family:Georgia,serif;font-size:18px;font-weight:400;color:#1C1612;margin:0 0 20px;letter-spacing:0.05em;">
            Votre commande
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${itemsRows}
            <tr>
              <td style="padding:12px 0 6px;font-size:13px;color:#6B5B4E;">Sous-total</td>
              <td style="padding:12px 0 6px;font-size:13px;color:#6B5B4E;text-align:right;">${fmt(total - parseFloat(shippingCost))}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#6B5B4E;">${shippingLabel}</td>
              <td style="padding:6px 0;font-size:13px;text-align:right;">${shippingLineHtml}</td>
            </tr>
            <tr>
              <td style="padding:16px 0 0;border-top:1px solid #EAD1BF;font-family:Georgia,serif;font-size:20px;color:#1C1612;font-weight:400;">Total payé</td>
              <td style="padding:16px 0 0;border-top:1px solid #EAD1BF;font-family:Georgia,serif;font-size:20px;color:#B8975A;text-align:right;font-weight:400;">${fmt(total)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr><td style="padding:0 48px;"><div style="height:1px;background:#F0E8DF;"></div></td></tr>

      <!-- LIVRAISON -->
      <tr>
        <td style="padding:32px 48px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="50%" style="padding-right:16px;vertical-align:top;">
                <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#B8975A;margin-bottom:12px;">Adresse de livraison</div>
                <div style="font-size:14px;color:#1C1612;line-height:1.8;">
                  <strong>${prenom} ${nom}</strong><br>${adresse}<br>${cp} ${ville}<br>France
                </div>
              </td>
              <td width="50%" style="padding-left:16px;vertical-align:top;border-left:1px solid #F0E8DF;">
                <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#B8975A;margin-bottom:12px;">Mode d'expédition</div>
                <div style="font-size:14px;color:#1C1612;line-height:1.8;">
                  <strong>${shippingLabel}</strong><br>Expédition sous 24–48h<br>
                  <span style="color:#6B5B4E;font-size:12px;">Un email de suivi vous sera envoyé dès le départ de votre colis.</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- SUIVI -->
      ${trackingNumber ? `
      <tr><td style="padding:0 48px;"><div style="height:1px;background:#F0E8DF;"></div></td></tr>
      <tr>
        <td style="padding:32px 48px;text-align:center;background:#FAF6F1;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#B8975A;margin-bottom:16px;">
            Suivi de votre colis
          </div>
          <div style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.08em;color:#1C1612;margin-bottom:8px;">
            ${trackingNumber}
          </div>
          <p style="font-size:12px;color:#A8958A;margin:0 0 20px;line-height:1.6;">
            Le suivi sera actif dès la prise en charge par le transporteur (sous 24h).
          </p>
          ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;padding:13px 32px;background:transparent;
               border:1px solid #B8975A;color:#B8975A;font-size:11px;letter-spacing:0.15em;
               text-transform:uppercase;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">
            Suivre mon colis →
          </a>` : ''}
        </td>
      </tr>` : ''}

      <!-- CTA -->
      <tr>
        <td style="padding:8px 48px 40px;text-align:center;">
          <a href="https://alyanco.com" style="display:inline-block;padding:16px 40px;background:#1C1612;color:#FAF6F1;
                   font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">
            Retour à la boutique
          </a>
        </td>
      </tr>

      <tr><td style="background:#B8975A;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#1C1612;padding:32px 48px;text-align:center;">
          <div style="font-family:Georgia,serif;font-size:16px;color:#FAF6F1;margin-bottom:8px;letter-spacing:0.1em;">ALYA &amp; CO.</div>
          <div style="font-size:11px;color:#6B5B4E;margin-bottom:16px;line-height:1.8;">
            Des questions ? <a href="mailto:contact@alyanco.com" style="color:#B8975A;text-decoration:none;">contact@alyanco.com</a>
          </div>
          <div style="font-size:10px;color:#4A3F38;letter-spacing:0.1em;">
            © 2026 ALYA &amp; CO. — Tous droits réservés
            &nbsp;·&nbsp;<a href="https://alyanco.com/cgv" style="color:#4A3F38;text-decoration:none;">CGV</a>
            &nbsp;·&nbsp;<a href="https://alyanco.com/mentions-legales" style="color:#4A3F38;text-decoration:none;">Mentions légales</a>
          </div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  // ── EMAIL MARCHAND — HTML ───────────────────────────────────────
  const itemsList = (items || [])
    .map(i => `<tr>
      <td style="padding:6px 0;font-size:14px;color:#1C1612;border-bottom:1px solid #F0E8DF;">${i.name} × ${i.qty}</td>
      <td style="padding:6px 0;font-size:14px;color:#1C1612;text-align:right;border-bottom:1px solid #F0E8DF;white-space:nowrap;">${fmt(i.total)}</td>
    </tr>`)
    .join('');

  // QR code scannable depuis le téléphone (locker Mondial Relay)
  const qrCodeUrl = trackingNumber
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(trackingNumber)}`
    : null;

  const labelBlock = labelUrl
    ? `<table cellpadding="0" cellspacing="0" border="0" width="100%">
         <tr>
           ${qrCodeUrl ? `<td style="width:140px;padding-right:24px;vertical-align:middle;">
             <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#B8975A;margin-bottom:8px;text-align:center;">QR Code locker</div>
             <img src="${qrCodeUrl}" width="130" height="130" alt="QR Code ${trackingNumber}"
               style="display:block;border:1px solid #F0E8DF;">
             <div style="font-size:10px;color:#A8958A;margin-top:6px;text-align:center;word-break:break-all;">${trackingNumber}</div>
           </td>` : ''}
           <td style="vertical-align:middle;">
             <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#B8975A;margin-bottom:12px;">Étiquette PDF</div>
             <a href="${labelUrl}" style="display:inline-block;padding:14px 24px;background:#1C1612;color:#FAF6F1;
                text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.04em;">
               📦 Télécharger l'étiquette
             </a>
             <p style="font-size:11px;color:#A8958A;margin:10px 0 0;">ID Sendcloud : ${sendcloudId}</p>
           </td>
         </tr>
       </table>`
    : `<div style="background:#FFF3F3;border:1px solid #FFB3B3;padding:14px 18px;margin-top:8px;">
         <strong style="color:#c0392b;">⚠️ Étiquette non générée automatiquement</strong><br>
         <span style="font-size:13px;color:#666;">Créer le colis manuellement sur
           <a href="https://panel.sendcloud.sc" style="color:#c0392b;">panel.sendcloud.sc</a>
         </span>
         ${sendcloudError ? `<br><small style="color:#999;">Détail : ${sendcloudError}</small>` : ''}
       </div>`;

  const now = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const merchantHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Commande ${orderNumber}</title></head>
<body style="margin:0;padding:32px;background:#FAF6F1;font-family:Helvetica,Arial,sans-serif;color:#1C1612;">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-top:4px solid #B8975A;">

    <div style="padding:32px 40px 0;">
      <h1 style="font-size:22px;margin:0 0 6px;font-weight:700;">
        🛍️ Nouvelle commande &nbsp;<span style="color:#B8975A;">${orderNumber}</span>
      </h1>
      <p style="font-size:13px;color:#A8958A;margin:0 0 28px;">${now}</p>

      <hr style="border:none;border-top:1px solid #F0E8DF;margin:0 0 24px;">

      <!-- Client -->
      <h2 style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#B8975A;margin:0 0 14px;">Client</h2>
      <p style="margin:0 0 4px;font-size:14px;"><strong>${prenom} ${nom}</strong></p>
      <p style="margin:0 0 4px;font-size:14px;">📧 <a href="mailto:${email}" style="color:#1C1612;">${email}</a></p>
      <p style="margin:0 0 4px;font-size:14px;">📱 ${tel || '—'}</p>
      <p style="margin:0 0 24px;font-size:14px;">📍 ${adresse}, ${cp} ${ville} (${pays || 'FR'})</p>

      <hr style="border:none;border-top:1px solid #F0E8DF;margin:0 0 24px;">

      <!-- Articles -->
      <h2 style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#B8975A;margin:0 0 14px;">Articles</h2>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
        ${itemsList}
        <tr>
          <td style="padding:8px 0 4px;font-size:13px;color:#6B5B4E;">Livraison — ${shippingLabel}</td>
          <td style="padding:8px 0 4px;font-size:13px;color:#6B5B4E;text-align:right;">${shippingLineTxt}</td>
        </tr>
        <tr>
          <td style="padding:10px 0 0;border-top:2px solid #B8975A;font-size:18px;font-weight:700;color:#1C1612;">TOTAL</td>
          <td style="padding:10px 0 0;border-top:2px solid #B8975A;font-size:18px;font-weight:700;color:#B8975A;text-align:right;">${fmt(total)}</td>
        </tr>
      </table>

      <hr style="border:none;border-top:1px solid #F0E8DF;margin:0 0 24px;">

      <!-- Étiquette -->
      <h2 style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#B8975A;margin:0 0 14px;">Étiquette d'expédition</h2>
      ${labelBlock}
    </div>

    <div style="padding:24px 40px;background:#1C1612;margin-top:32px;text-align:center;">
      <span style="font-family:Georgia,serif;font-size:14px;color:#FAF6F1;letter-spacing:.12em;">ALYA &amp; CO.</span>
      &nbsp;·&nbsp;
      <a href="https://panel.sendcloud.sc" style="font-size:12px;color:#B8975A;text-decoration:none;">Sendcloud</a>
    </div>
  </div>
</body>
</html>`;

  // ── ENVOI VIA BREVO ─────────────────────────────────────────────
  const brevoSend = async (to, toName, subject, html) => {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        sender:      { name: 'ALYA & CO.', email: 'contact@alyanco.com' },
        to:          [{ email: to, name: toName }],
        subject,
        htmlContent: html
      })
    });
    if (!r.ok) console.error('Brevo error:', await r.text());
    return r.ok;
  };

  try {
    // Email client
    await brevoSend(email, `${prenom} ${nom}`,
      `Confirmation de commande ${orderNumber} — ALYA & CO.`,
      customerHtml
    );

    // Email marchand (avec étiquette Sendcloud)
    await brevoSend('contact@alyanco.com', 'ALYA & CO. Admin',
      `🛍️ ${orderNumber} — ${prenom} ${nom} — ${fmt(total)}`,
      merchantHtml
    );

    // Ajout du client dans la liste Brevo "Clients" (#4)
    try {
      const brevoAttrs = { PRENOM: prenom, NOM: nom, SMS: tel || '' };
      // Marquer le code promo comme utilisé pour cet email
      if (promoCode) brevoAttrs.PROMO_USED = promoCode.toUpperCase();
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
        body: JSON.stringify({
          email,
          updateEnabled: true,
          listIds: [4],
          attributes: brevoAttrs
        })
      });
    } catch (e) { console.error('Brevo contact add error:', e); }

    // Retrait de la liste "Abandons Paniers" (#2) — commande passée, plus abandonné
    try {
      await fetch('https://api.brevo.com/v3/contacts/lists/2/contacts/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
        body: JSON.stringify({ emails: [email] })
      });
    } catch (e) { console.error('Brevo remove from list #2 error:', e); }

    // Décrémentation du stock après commande confirmée
    await decrementStock(items);

    return res.status(200).json({ success: true, orderNumber, labelUrl, sendcloudId });

  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
