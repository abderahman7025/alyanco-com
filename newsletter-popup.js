(function () {
  var KEY = 'alya_nl_done';
  if (localStorage.getItem(KEY)) return;

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
        '<button class="nl-close" onclick="nlClose()" aria-label="Fermer">&times;</button>' +
        '<div class="nl-eyebrow">Offre exclusive</div>' +
        '<h2 class="nl-title">Un cadeau<br><em>pour vous</em></h2>' +
        '<p class="nl-sub">Inscrivez-vous et recevez <strong>-10%</strong> sur votre<br>première commande — livraison offerte dès 45€.</p>' +
        '<div id="nlForm">' +
          '<form class="nl-form" onsubmit="nlSubmit(event)">' +
            '<input id="nlEmail" class="nl-input" type="email" placeholder="Votre adresse e-mail" required autocomplete="email">' +
            '<button type="submit" class="nl-btn">J\'obtiens mon -10%</button>' +
          '</form>' +
          '<button class="nl-skip" onclick="nlClose()">Non merci, je paye plein tarif</button>' +
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
        '<p style="color:#6B5B4E;font-size:14px;margin-bottom:4px;">Votre code de réduction :</p>' +
        '<div class="nl-code-wrap"><span class="nl-code">ALYA10</span></div>' +
        '<p class="nl-code-hint">Copiez ce code et appliquez-le lors de votre commande.<br>Valable sur votre premier achat, non cumulable.</p>' +
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
