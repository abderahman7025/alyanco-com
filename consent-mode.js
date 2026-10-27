/* ══ MODE CONSENTEMENT GOOGLE (v2, avancé) ═══════════════════════════════
   Chargé AVANT Google Tag Manager sur chaque page : il pose l'état du
   consentement avant que la moindre balise ne parte.

   - Visiteur qui a déjà répondu au bandeau : on applique sa réponse.
   - Visiteur qui n'a pas encore répondu : refus par défaut en Europe
     (EEE), au Royaume-Uni et en Suisse ; accord par défaut ailleurs.

   Mode « avancé » : quand le consentement est refusé, les balises Google
   envoient quand même des signaux SANS cookie (pas d'identifiant), et
   Google estime les conversions manquantes (« modélisation »).
   Meta et Clarity, eux, attendent l'accord (réglé dans GTM).
   Le bandeau (cookies.js) met l'état à jour quand le visiteur clique. */
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var choix = null;
  try { choix = localStorage.getItem('alya_cookie_consent'); } catch (e) {}

  function etat(oui) {
    var v = oui ? 'granted' : 'denied';
    return {
      ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v,
      functionality_storage: 'granted', security_storage: 'granted'
    };
  }

  if (choix === 'accepted' || choix === 'refused') {
    gtag('consent', 'default', etat(choix === 'accepted'));
  } else {
    gtag('consent', 'default', etat(true));
    var refus = etat(false);
    refus.region = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT',
      'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];
    refus.wait_for_update = 500;
    gtag('consent', 'default', refus);
  }
  /* Sans accord : pas d'identifiant publicitaire dans les envois, et
     l'identifiant de clic suit l'URL au lieu d'un cookie. */
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
})();
