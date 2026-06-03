/**
 * stock-display.js — Affichage du badge de disponibilité produit
 * Pré-requis :
 *   - <body data-product-id="brosse-siwak"> (ou autre id produit)
 *   - <div id="stock-badge"></div> dans la section .product-ctas
 */
(function () {
  'use strict';

  /* ── STYLES ─────────────────────────────────────────────────────── */
  var css = [
    '#stock-badge { margin-bottom: 14px; min-height: 0; transition: opacity .3s; }',
    '.stock-pill {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 7px;',
    '  font-size: 13px;',
    '  font-weight: 500;',
    '  padding: 8px 16px;',
    '  border-radius: 4px;',
    '  letter-spacing: 0.03em;',
    '  line-height: 1;',
    '}',
    '.stock-pill.faible {',
    '  background: rgba(200, 110, 20, 0.09);',
    '  color: #b05e0a;',
    '  border: 1px solid rgba(200, 110, 20, 0.25);',
    '}',
    '.stock-pill.critique {',
    '  background: rgba(190, 40, 40, 0.07);',
    '  color: #a82020;',
    '  border: 1px solid rgba(190, 40, 40, 0.2);',
    '}',
    '.stock-pill.rupture {',
    '  background: rgba(110, 110, 110, 0.07);',
    '  color: #888;',
    '  border: 1px solid rgba(110, 110, 110, 0.18);',
    '}',
    /* Disable ATC buttons on rupture */
    '.stock-rupture .btn-atc,',
    '.stock-rupture .btn-primary {',
    '  opacity: 0.4 !important;',
    '  cursor: not-allowed !important;',
    '  pointer-events: none !important;',
    '}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── TRADUCTIONS ─────────────────────────────────────────────────── */
  var lang = localStorage.getItem('alya_lang') || 'fr';
  var ST = {
    fr: { low: '📦 Plus que {n} exemplaire{s} disponible{s}', urgent: '⚠ Plus que {n} exemplaire{s} disponible{s} !', out: '⊘ Rupture de stock', out_btn: 'Rupture de stock' },
    en: { low: '📦 Only {n} item{s} left in stock', urgent: '⚠ Only {n} item{s} left!', out: '⊘ Out of stock', out_btn: 'Out of stock' },
    de: { low: '📦 Nur noch {n} Exemplar{s} verfügbar', urgent: '⚠ Nur noch {n} Exemplar{s} verfügbar!', out: '⊘ Nicht vorrätig', out_btn: 'Nicht vorrätig' },
    es: { low: '📦 Solo quedan {n} unidad{s}', urgent: '⚠ ¡Solo quedan {n} unidad{s}!', out: '⊘ Sin existencias', out_btn: 'Sin existencias' },
    it: { low: '📦 Solo {n} articolo{s} disponibile{s}', urgent: '⚠ Solo {n} articolo{s} disponibile{s}!', out: '⊘ Esaurito', out_btn: 'Esaurito' },
    nl: { low: '📦 Nog maar {n} exemplaar{s} beschikbaar', urgent: '⚠ Nog maar {n} exemplaar{s} beschikbaar!', out: '⊘ Uitverkocht', out_btn: 'Uitverkocht' },
    pt: { low: '📦 Apenas {n} unidade{s} disponível{s}', urgent: '⚠ Apenas {n} unidade{s} disponível{s}!', out: '⊘ Esgotado', out_btn: 'Esgotado' }
  };
  var s = ST[lang] || ST.fr;

  function stockTxt(tpl, n) {
    var plural = n > 1 ? 's' : '';
    return tpl.replace(/\{n\}/g, n).replace(/\{s\}/g, plural);
  }

  /* ── INIT ────────────────────────────────────────────────────────── */
  var productId = document.body.getAttribute('data-product-id');
  if (!productId) return;

  var badge = document.getElementById('stock-badge');
  if (!badge) return;

  /* ── FETCH ───────────────────────────────────────────────────────── */
  fetch('/api/stock?id=' + encodeURIComponent(productId))
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;

      var status = data.status;
      var stock  = data.stock;
      var html   = '';

      if (status === 'faible') {
        html = '<span class="stock-pill faible">' + stockTxt(s.low, stock) + '</span>';

      } else if (status === 'critique') {
        html = '<span class="stock-pill critique">' + stockTxt(s.urgent, stock) + '</span>';

      } else if (status === 'rupture') {
        html = '<span class="stock-pill rupture">' + s.out + '</span>';
        document.body.classList.add('stock-rupture');
        document.querySelectorAll('.btn-atc').forEach(function (btn) {
          btn.disabled    = true;
          btn.textContent = s.out_btn;
        });
      }

      badge.innerHTML = html;
    })
    .catch(function () {
      // Fail silently — stock badge is a nice-to-have, not critical
    });
})();
