# -*- coding: utf-8 -*-
import os

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'

# ── 1. checkout.html — remplacer applyPromo() par version API ──────────────
CHECKOUT = os.path.join(BASE, 'checkout.html')
with open(CHECKOUT, 'r', encoding='utf-8') as f:
    co = f.read()

OLD_FN = (
    "function applyPromo() {\n"
    "  var code = (document.getElementById('promoInput').value || '').trim().toUpperCase();\n"
    "  var msg = document.getElementById('promoMsg');\n"
    "  var inp = document.getElementById('promoInput');\n"
    "  var btn = document.getElementById('promoBtn');\n"
    "  var CODES = { 'ALYA10': 0.10 };\n"
    "  if (!code) { msg.textContent = 'Veuillez entrer un code.'; msg.className = 'promo-msg err'; return; }\n"
    "  if (!CODES[code]) { msg.textContent = 'Code invalide.'; msg.className = 'promo-msg err'; return; }\n"
    "  var rate = CODES[code];\n"
    "  promoDiscount = Math.round(subtotal * rate * 100) / 100;\n"
    "  localStorage.setItem('alyanco_promo', JSON.stringify({code: code, rate: rate}));\n"
    "  inp.disabled = true;\n"
    "  btn.disabled = true;\n"
    "  msg.textContent = '\\u2713 Code appliqu\\u00e9 \\u2014 -' + Math.round(rate*100) + '% sur votre commande !';\n"
    "  msg.className = 'promo-msg ok';\n"
    "  // Recalculer le total affich\\u00e9\n"
    "  var currentCarrier = getSelectedCarrier();\n"
    "  if (currentCarrier) setSelectedCarrier(currentCarrier);\n"
    "}\n"
)

NEW_FN = (
    "async function applyPromo() {\n"
    "  var code = (document.getElementById('promoInput').value || '').trim().toUpperCase();\n"
    "  var email = (document.querySelector('input[name=\"email\"]') || {}).value || '';\n"
    "  var msg = document.getElementById('promoMsg');\n"
    "  var inp = document.getElementById('promoInput');\n"
    "  var btn = document.getElementById('promoBtn');\n"
    "  if (!code) { msg.textContent = 'Veuillez entrer un code.'; msg.className = 'promo-msg err'; return; }\n"
    "  if (!email || !email.includes('@')) {\n"
    "    msg.textContent = 'Veuillez d\\'abord renseigner votre adresse email.';\n"
    "    msg.className = 'promo-msg err'; return;\n"
    "  }\n"
    "  btn.textContent = '...'; btn.disabled = true;\n"
    "  try {\n"
    "    var r = await fetch('/api/validate-promo', {\n"
    "      method: 'POST',\n"
    "      headers: {'Content-Type': 'application/json'},\n"
    "      body: JSON.stringify({email: email, code: code})\n"
    "    });\n"
    "    var data = await r.json();\n"
    "    if (data.valid) {\n"
    "      var rate = data.discount;\n"
    "      promoDiscount = Math.round(subtotal * rate * 100) / 100;\n"
    "      localStorage.setItem('alyanco_promo', JSON.stringify({code: code, rate: rate, email: email}));\n"
    "      inp.disabled = true; btn.disabled = true;\n"
    "      msg.textContent = '\\u2713 Code appliqu\\u00e9 \\u2014 -' + Math.round(rate*100) + '% sur votre commande !';\n"
    "      msg.className = 'promo-msg ok';\n"
    "      var currentCarrier = getSelectedCarrier();\n"
    "      if (currentCarrier) setSelectedCarrier(currentCarrier);\n"
    "    } else {\n"
    "      msg.textContent = data.reason || 'Code invalide.';\n"
    "      msg.className = 'promo-msg err';\n"
    "      btn.textContent = 'Appliquer'; btn.disabled = false;\n"
    "    }\n"
    "  } catch(err) {\n"
    "    msg.textContent = 'Erreur de connexion. R\\u00e9essayez.';\n"
    "    msg.className = 'promo-msg err';\n"
    "    btn.textContent = 'Appliquer'; btn.disabled = false;\n"
    "  }\n"
    "}\n"
)

if OLD_FN in co:
    co = co.replace(OLD_FN, NEW_FN)
    print('OK: checkout.html - applyPromo remplace')
else:
    print('WARN: checkout.html - pattern applyPromo non trouve')

with open(CHECKOUT, 'w', encoding='utf-8') as f:
    f.write(co)

# ── 2. paiement.html — passer promoCode a send-order ──────────────────────
PAIEMENT = os.path.join(BASE, 'paiement.html')
with open(PAIEMENT, 'r', encoding='utf-8') as f:
    pa = f.read()

OLD_SEND = (
    "      email: delivery.email, prenom: delivery.prenom, nom: delivery.nom,\n"
    "      tel: delivery.tel || '', orderNumber: orderNum, items: items, total: total,\n"
    "      shippingCost: shippingCost, shipping: delivery.shipping,\n"
    "      adresse: delivery.adresse, cp: delivery.cp, ville: delivery.ville,\n"
    "      pays: delivery.pays || 'FR', totalWeight: getCartTotalWeight(),\n"
    "      relayPoint: delivery.relayPoint || null"
)

NEW_SEND = (
    "      email: delivery.email, prenom: delivery.prenom, nom: delivery.nom,\n"
    "      tel: delivery.tel || '', orderNumber: orderNum, items: items, total: total,\n"
    "      shippingCost: shippingCost, shipping: delivery.shipping,\n"
    "      adresse: delivery.adresse, cp: delivery.cp, ville: delivery.ville,\n"
    "      pays: delivery.pays || 'FR', totalWeight: getCartTotalWeight(),\n"
    "      relayPoint: delivery.relayPoint || null,\n"
    "      promoCode: _promo ? _promo.code : null"
)

if OLD_SEND in pa:
    pa = pa.replace(OLD_SEND, NEW_SEND)
    print('OK: paiement.html - promoCode ajoute au send-order')
else:
    print('WARN: paiement.html - pattern send-order non trouve')

with open(PAIEMENT, 'w', encoding='utf-8') as f:
    f.write(pa)

print('\nTermine.')
