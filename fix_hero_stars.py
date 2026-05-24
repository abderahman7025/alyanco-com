# -*- coding: utf-8 -*-
# fix_hero_stars.py
# Deplace / ajoute les etoiles AU DESSUS du titre h1 sur toutes les pages produit

import os, re

BASE    = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'
PRODUITS = os.path.join(BASE, 'produits')

def read(p):
    with open(p, 'r', encoding='utf-8') as f: return f.read()
def write(p, c):
    with open(p, 'w', encoding='utf-8') as f: f.write(c)
    print('OK: ' + os.path.basename(p))

# Review counts per product (already set in previous script)
COUNTS = {
    'brosse-siwak':      47,
    'gant-corps':       208,
    'chouchou-soie':     19,
    'dentifrice-siwak':  26,
    'gant-visage':       64,
    'pack-1an-full-body':42,
    'pack-dentifrice-3m':22,
    'pack-siwak-complet':38,
    'pack-tetes-x3':     28,
    'tetes-recharges':   31,
}

# CSS a ajouter pour les pages sans .product-stars
STARS_CSS = (
    '.product-stars { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }\n'
    '.stars { color: var(--gold); font-size: 15px; letter-spacing: 2px; }\n'
    '.stars-count { font-size: 12px; color: var(--light); }\n'
)

for fname in os.listdir(PRODUITS):
    if not fname.endswith('.html'):
        continue
    key = fname.replace('.html', '')
    if key not in COUNTS:
        print('  skip: ' + fname)
        continue

    fpath  = os.path.join(PRODUITS, fname)
    html   = read(fpath)
    count  = COUNTS[key]

    # HTML pour les etoiles (format standard)
    new_stars = (
        '    <div class="product-stars">\n'
        '      <span class="stars">★★★★★</span>\n'
        '      <span class="stars-count">4,8/5 — ' + str(count) + ' avis</span>\n'
        '    </div>\n'
    )

    if key in ('brosse-siwak', 'gant-corps'):
        # --- Cas 1 : etoiles deja presentes APRES le h1 -> les deplacer AVANT ---
        # Trouve le bloc h1 + product-stars qui suit
        pattern = (
            r'(<h1 class="product-title">[\s\S]*?</h1>)\n'
            r'(\s*<div class="product-stars">[\s\S]*?</div>)'
        )
        m = re.search(pattern, html)
        if m:
            h1_block    = m.group(1)
            stars_block = m.group(2).strip()
            # Met a jour 4,9 -> 4,8 si besoin
            stars_block = stars_block.replace('4,9/5', '4,8/5')
            replacement = '    ' + stars_block + '\n    ' + h1_block
            html = html.replace(m.group(0), replacement, 1)
            print('  moved stars above h1: ' + fname)
        else:
            print('  WARN pattern not found: ' + fname)
    else:
        # --- Cas 2 : pas d'etoiles dans le hero -> ajouter avant le h1 ---

        # a. Ajouter le CSS si manquant
        if '.product-stars' not in html:
            # Insere juste avant .product-title {
            html = html.replace(
                '.product-title {',
                STARS_CSS + '.product-title {',
                1
            )

        # b. Ajouter le HTML avant le h1 (uniquement si pas deja present avant h1)
        h1_pattern = r'(<h1 class="product-title">)'
        # Verifie qu'il n'y a pas deja product-stars juste avant
        pre_h1 = re.search(r'([\s\S]{0,200})<h1 class="product-title">', html)
        if pre_h1 and 'product-stars' in pre_h1.group(1):
            print('  already above h1: ' + fname)
            continue
        html = re.sub(h1_pattern, new_stars + r'\1', html, count=1)
        print('  added stars above h1: ' + fname)

    write(fpath, html)

print('\nTermine !')
