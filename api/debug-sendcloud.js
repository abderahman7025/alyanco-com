// FICHIER TEMPORAIRE — À SUPPRIMER APRÈS UTILISATION
export default async function handler(req, res) {
  const secret = req.query.secret;
  if (secret !== process.env.STOCK_ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const pub = process.env.SENDCLOUD_PUBLIC_KEY;
  const sec = process.env.SENDCLOUD_SECRET_KEY;
  const auth = Buffer.from(`${pub}:${sec}`).toString('base64');

  const r = await fetch('https://panel.sendcloud.sc/api/v2/shipping_methods?to_country=FR', {
    headers: { Authorization: `Basic ${auth}` }
  });
  const data = await r.json();

  const methods = (data.shipping_methods || []).map(m => ({
    id: m.id,
    name: m.name,
    carrier: m.carrier
  }));

  return res.status(200).json(methods);
}
