(function () {
  var GA_ID  = 'G-FL7S62N6GC';
  var ADS_ID = 'AW-17586286447';
  var FB_ID  = '520134214238349';
  var KEY    = 'alya_cookie_consent';

  var consent = localStorage.getItem(KEY);
  if (consent === 'accepted') loadAnalytics();
  if (!consent) document.addEventListener('DOMContentLoaded', showBanner);

  function loadAnalytics() {
    // GA4 + Google Ads
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
    gtag('config', ADS_ID);
    // Meta Pixel
    !function(f,b,e,v,n,t,s2){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s2=b.getElementsByTagName(e)[0];s2.parentNode.insertBefore(t,s2)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', FB_ID);
    fbq('track', 'PageView');
  }

  function showBanner() {
    var css = document.createElement('style');
    css.textContent = [
      '#cookieBanner{position:fixed;bottom:0;left:0;right:0;z-index:99990;',
      'background:#1C1612;color:#EAD1BF;padding:18px 40px;',
      'display:flex;align-items:center;justify-content:space-between;gap:24px;',
      'font-family:"Jost",sans-serif;font-size:13px;font-weight:300;line-height:1.6;',
      'transform:translateY(100%);transition:transform 0.45s cubic-bezier(0.16,1,0.3,1);}',
      '#cookieBanner.visible{transform:translateY(0);}',
      '#cookieBanner p{margin:0;flex:1;color:#A8958A;}',
      '#cookieBanner p a{color:#B8975A;text-decoration:underline;}',
      '#cookieBanner p strong{color:#EAD1BF;font-weight:400;}',
      '.ck-btns{display:flex;gap:12px;flex-shrink:0;align-items:center;flex-wrap:wrap;}',
      '.ck-accept{background:#B8975A;color:#fff;border:none;padding:10px 22px;',
      'font-family:"Jost",sans-serif;font-size:11px;letter-spacing:0.14em;',
      'text-transform:uppercase;cursor:pointer;transition:background 0.3s;}',
      '.ck-accept:hover{background:#9a7d47;}',
      '.ck-refuse{background:none;border:none;color:#A8958A;font-family:"Jost",sans-serif;',
      'font-size:11px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;',
      'padding:10px 4px;text-decoration:underline;transition:color 0.3s;}',
      '.ck-refuse:hover{color:#EAD1BF;}',
      '@media(max-width:600px){#cookieBanner{flex-direction:column;align-items:flex-start;padding:20px 20px;gap:16px;}.ck-btns{width:100%;}}'
    ].join('');
    document.head.appendChild(css);

    var el = document.createElement('div');
    el.id = 'cookieBanner';
    el.innerHTML =
      '<p><strong>Ce site utilise des cookies</strong> analytiques et publicitaires ' +
      '(Google Analytics, Meta Pixel) pour mesurer ses performances. ' +
      'Vous pouvez accepter ou refuser leur utilisation. ' +
      '<a href="/cgv">En savoir plus</a></p>' +
      '<div class="ck-btns">' +
      '<button class="ck-accept" onclick="cookieAccept()">Tout accepter</button>' +
      '<button class="ck-refuse" onclick="cookieRefuse()">Refuser</button>' +
      '</div>';
    document.body.appendChild(el);
    setTimeout(function(){ el.classList.add('visible'); }, 80);
  }

  function hideBanner() {
    var el = document.getElementById('cookieBanner');
    if (!el) return;
    el.style.transform = 'translateY(100%)';
    setTimeout(function(){ el.remove(); }, 450);
    // Signal newsletter popup it can open
    window._cookieDone = true;
  }

  window.cookieAccept = function() {
    localStorage.setItem(KEY, 'accepted');
    loadAnalytics();
    hideBanner();
  };
  window.cookieRefuse = function() {
    localStorage.setItem(KEY, 'refused');
    hideBanner();
  };
})();
