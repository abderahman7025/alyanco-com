(function () {
  var KEY = 'alya_nl_done';
  if (localStorage.getItem(KEY)) return;

  /* ── Traductions ── */
  var lang = localStorage.getItem('alya_lang') || 'fr';
  var NLT = {
    fr: { ey:'Offre exclusive', title:'Un cadeau<br><em>pour vous</em>', sub:'Inscrivez-vous et recevez <strong>-10%</strong> sur votre<br>première commande — livraison offerte dès 45€.', ph:'Votre adresse e-mail', btn:"J'obtiens mon -10%", skip:'Non merci, je paye plein tarif', close:'Fermer', code_lbl:'Votre code de réduction :', code_hint:'Copiez ce code et appliquez-le lors de votre commande.<br>Valable sur votre premier achat, non cumulable.' },
    en: { ey:'Exclusive offer', title:'A gift<br><em>for you</em>', sub:'Sign up and get <strong>-10%</strong> off your<br>first order — free shipping from €45.', ph:'Your email address', btn:'Get my -10%', skip:"No thanks, I'll pay full price", close:'Close', code_lbl:'Your discount code:', code_hint:'Copy this code and apply it at checkout.<br>Valid on your first purchase, non-cumulative.' },
    nl: { ey:'Exclusief aanbod', title:'Een cadeau<br><em>voor u</em>', sub:'Schrijf u in en ontvang <strong>-10%</strong> op uw<br>eerste bestelling — gratis verzending vanaf €45.', ph:'Uw e-mailadres', btn:'Mijn -10% krijgen', skip:'Nee bedankt, ik betaal de volle prijs', close:'Sluiten', code_lbl:'Uw kortingscode:', code_hint:'Kopieer deze code en pas hem toe bij het afrekenen.<br>Geldig op uw eerste aankoop, niet cumuleerbaar.' },
    de: { ey:'Exklusives Angebot', title:'Ein Geschenk<br><em>für Sie</em>', sub:'Melden Sie sich an und erhalten Sie <strong>-10%</strong> auf Ihre<br>erste Bestellung — kostenloser Versand ab €45.', ph:'Ihre E-Mail-Adresse', btn:'Meine -10% erhalten', skip:'Nein danke, ich zahle den vollen Preis', close:'Schließen', code_lbl:'Ihr Rabattcode:', code_hint:'Kopieren Sie diesen Code und wenden Sie ihn beim Checkout an.<br>Gültig für Ihren ersten Kauf, nicht kombinierbar.' },
    it: { ey:'Offerta esclusiva', title:'Un regalo<br><em>per te</em>', sub:'Iscriviti e ricevi <strong>-10%</strong> sul tuo<br>primo ordine — spedizione gratuita da €45.', ph:'Il tuo indirizzo e-mail', btn:'Ottengo il mio -10%', skip:'No grazie, pago prezzo pieno', close:'Chiudi', code_lbl:'Il tuo codice sconto:', code_hint:'Copia questo codice e applicalo al momento del pagamento.<br>Valido sul tuo primo acquisto, non cumulabile.' },
    pt: { ey:'Oferta exclusiva', title:'Um presente<br><em>para si</em>', sub:'Inscreva-se e receba <strong>-10%</strong> na sua<br>primeira encomenda — entrega grátis a partir de €45.', ph:'O seu endereço de e-mail', btn:'Obter o meu -10%', skip:'Não obrigado, pago preço cheio', close:'Fechar', code_lbl:'O seu código de desconto:', code_hint:'Copie este código e aplique-o no checkout.<br>Válido na sua primeira compra, não acumulável.' },
    es: { ey:'Oferta exclusiva', title:'Un regalo<br><em>para ti</em>', sub:'Regístrate y obtén <strong>-10%</strong> en tu<br>primer pedido — envío gratis desde €45.', ph:'Tu dirección de correo electrónico', btn:'Obtener mi -10%', skip:'No gracias, pago precio completo', close:'Cerrar', code_lbl:'Tu código de descuento:', code_hint:'Copia este código y aplícalo al momento del pago.<br>Válido en tu primera compra, no acumulable.' }
  };
  var t = NLT[lang] || NLT.fr;

  // Attendre 7s — si banner cookie visible, attendre qu'il soit fermé
  function tryShow() {
    var banner = document.getElementById('cookieBanner');
    if (banner && !window._cookieDone) {
      setTimeout(tryShow, 2000);
      return;
    }
    showPopup();
  }
  setTimeout(tryShow, 7000);

  function showPopup() {
    var css = document.createElement('style');
    css.textContent = [
      '#nlOverlay{position:fixed;inset:0;z-index:99980;background:rgba(28,22,18,0.6);',
      'display:flex;align-items:center;justify-content:center;padding:20px;',
      'opacity:0;transition:opacity 0.4s;}',
      '#nlOverlay.visible{opacity:1;}',
      '.nl-card{background:#FAF6F1;max-width:480px;width:100%;padding:52px 48px;',
      'position:relative;transform:translateY(20px);opacity:0;',
      'transition:transform 0.45s cubic-bezier(0.16,1,0.3,1),opacity 0.45s;',
      'text-align:center;}',
      '#nlOverlay.visible .nl-card{transform:translateY(0);opacity:1;}',
      '.nl-close{position:absolute;top:16px;right:20px;background:none;border:none;',
      'font-size:20px;color:#A8958A;cursor:pointer;line-height:1;padding:4px;',
      'transition:color 0.3s;font-family:"Jost",sans-serif;}',
      '.nl-close:hover{color:#1C1612;}',
      '.nl-eyebrow{font-family:"Jost",sans-serif;font-size:10px;letter-spacing:0.3em;',
      'text-transform:uppercase;color:#B8975A;margin-bottom:16px;}',
      '.nl-title{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(30px,5vw,42px);',
      'font-weight:300;line-height:1.15;color:#1C1612;margin-bottom:10px;}',
      '.nl-title em{font-style:italic;color:#B8975A;}',
      '.nl-sub{font-family:"Jost",sans-serif;font-size:13px;color:#6B5B4E;',
      'font-weight:300;line-height:1.7;margin-bottom:32px;}',
      '.nl-form{display:flex;flex-direction:column;gap:12px;}',
      '.nl-input{width:100%;padding:14px 18px;border:1px solid rgba(184,151,90,0.3);',
      'background:#fff;font-family:"Jost",sans-serif;font-size:14px;color:#1C1612;',
      'outline:none;transition:border-color 0.3s;}',
      '.nl-input:focus{border-color:#B8975A;}',
      '.nl-input::placeholder{color:#A8958A;}',
      '.nl-btn{background:#1C1612;color:#FAF6F1;border:none;padding:15px;',
      'font-family:"Jost",sans-serif;font-size:11px;letter-spacing:0.18em;',
      'text-transform:uppercase;cursor:pointer;transition:background 0.3s;}',
      '.nl-btn:hover{background:#B8975A;}',
      '.nl-skip{display:block;margin-top:14px;font-family:"Jost",sans-serif;',
      'font-size:11px;color:#A8958A;letter-spacing:0.08em;cursor:pointer;',
      'background:none;border:none;text-decoration:underline;width:100%;text-align:center;}',
      '.nl-skip:hover{color:#1C1612;}',
      '.nl-success{text-align:center;padding:8px 0;}',
      '.nl-code-wrap{margin:20px 0;}',
      '.nl-code{display:inline-block;background:#1C1612;color:#B8975A;',
      'font-family:"Cormorant Garamond",Georgia,serif;font-size:28px;font-weight:500;',
      'letter-spacing:0.2em;padding:14px 28px;}',
      '.nl-code-hint{font-size:13px;color:#6B5B4E;margin-top:12px;line-height:1.6;}',
      '@media(max-width:480px){.nl-card{padding:40px 28px;}}'
    ].join('');
    document.head.appendChild(css);

    var el = document.createElement('div');
    el.id = 'nlOverlay';
    el.innerHTML =
      '<div class="nl-card">' +
        '<button class="nl-close" onclick="nlClose()" aria-label="' + t.close + '">&times;</button>' +
        '<div class="nl-eyebrow">' + t.ey + '</div>' +
        '<h2 class="nl-title">' + t.title + '</h2>' +
        '<p class="nl-sub">' + t.sub + '</p>' +
        '<div id="nlForm">' +
          '<form class="nl-form" onsubmit="nlSubmit(event)">' +
            '<input id="nlEmail" class="nl-input" type="email" placeholder="' + t.ph + '" required autocomplete="email">' +
            '<button type="submit" class="nl-btn">' + t.btn + '</button>' +
          '</form>' +
          '<button class="nl-skip" onclick="nlClose()">' + t.skip + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(el);
    el.addEventListener('click', function(e){ if(e.target === el) nlClose(); });
    setTimeout(function(){ el.classList.add('visible'); }, 30);
  }

  window.nlClose = function() {
    localStorage.setItem(KEY, '1');
    var el = document.getElementById('nlOverlay');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(function(){ el.remove(); }, 400);
  };

  window.nlSubmit = function(e) {
    e.preventDefault();
    var email = (document.getElementById('nlEmail') || {}).value || '';
    if (!email.trim()) return;
    localStorage.setItem(KEY, '1');

    // Afficher le code immédiatement
    document.getElementById('nlForm').innerHTML =
      '<div class="nl-success">' +
        '<p style="color:#6B5B4E;font-size:14px;margin-bottom:4px;">' + t.code_lbl + '</p>' +
        '<div class="nl-code-wrap"><span class="nl-code">ALYA10</span></div>' +
        '<p class="nl-code-hint">' + t.code_hint + '</p>' +
      '</div>';

    // Enregistrer l'email en arrière-plan
    fetch('/api/newsletter', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email.trim(), source: 'popup'})
    }).catch(function(){});

    setTimeout(window.nlClose, 6000);
  };
})();
