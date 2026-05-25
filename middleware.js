// middleware.js — Protection HTTP Basic Auth sur /admin/*
// Le navigateur affiche une fenêtre login natif avant même de charger la page

export const config = {
  matcher: ['/admin/:path*']
};

export default function middleware(req) {
  const auth = req.headers.get('Authorization') || '';

  if (auth.startsWith('Basic ')) {
    try {
      // atob disponible dans l'Edge runtime de Vercel
      const decoded = atob(auth.slice(6));
      const colon   = decoded.indexOf(':');
      const pwd     = colon >= 0 ? decoded.slice(colon + 1) : decoded;

      if (pwd === process.env.STOCK_ADMIN_SECRET) {
        return; // ✅ Accès autorisé
      }
    } catch (_) { /* credentials malformés → refus */ }
  }

  // ❌ Refus — le navigateur affiche une popup login
  return new Response('Accès non autorisé', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="ALYA & CO. Administration"',
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
