# -*- coding: utf-8 -*-
# fix_stars_position.py
# Met les etoiles EN-DESSOUS du titre partout
# 1. Cartes collection (collection-siwak + collection-gants + nos-packs + index)
#    : product-stars vient apres product-name (pas avant)
# 2. Pages produit : product-stars vient apres <h1>, pas avant

import os, re

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'

def read(p):
    with open(p, 'r', encoding='utf-8') as f: return f.read()
def write(p, c):
    with open(p, 'w', encoding='utf-8') as f: f.write(c)
    print('OK: ' + os.path.relpath(p, BASE))

# ─────────────────────────────────────────────────────────────
# 1. CARTES PRODUIT (collection-siwak, collection-gants,
#    nos-packs, index.html)
#    Swap : product-stars AVANT product-name -> APRES
# ─────────────────────────────────────────────────────────────
print('=== 1. Cartes collection : etoiles sous le titre ===')

CARD_FILES = [
    os.path.join(BASE, 'collection-siwak.html'),
    os.path.join(BASE, 'collection-gants.html'),
    os.path.join(BASE, 'nos-packs.html'),
    os.path.join(BASE, 'index.html'),
]

for fpath in CARD_FILES:
    html = read(fpath)
    changed = False

    # Pattern: product-stars juste avant product-name dans product-info
    # On capture les deux divs et on les echange
    def swap_stars_name(m):
        stars_div = m.group(1)   # la div .product-stars
        gap       = m.group(2)   # espaces entre les deux
        name_div  = m.group(3)   # la div .product-name
        return name_div + '\n' + gap + stars_div

    new_html = re.sub(
        r'(<div class="product-stars">[^<]*(?:<span>[^<]*</span>)?[^<]*</div>)'
        r'(\n\s+)'
        r'(<div class="product-name">)',
        swap_stars_name,
        html
    )
    if new_html != html:
        changed = True
        html = new_html

    if changed:
        write(fpath, html)
    else:
        print('  (pas de changement) ' + os.path.relpath(fpath, BASE))

# ─────────────────────────────────────────────────────────────
# 2. PAGES PRODUIT : product-stars doit etre APRES <h1>
#    (annuler fix_hero_stars qui les avait mis avant)
# ─────────────────────────────────────────────────────────────
print('\n=== 2. Pages produit : etoiles sous le h1 ===')

PRODUITS = os.path.join(BASE, 'produits')
for fname in sorted(os.listdir(PRODUITS)):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(PRODUITS, fname)
    html  = read(fpath)

    # Cherche le pattern: product-stars AVANT h1 -> swap pour mettre APRES
    # Pattern A (multi-ligne avec spans) :
    #   <div class="product-stars">\n      <span...>\n      <span...>\n    </div>\n    <h1...>...</h1>
    pattern_a = (
        r'(\s+)(<div class="product-stars">\s*\n'
        r'\s+<span class="stars">[\s\S]*?</span>\s*\n'
        r'\s+<span class="stars-count">[^<]*</span>\s*\n'
        r'\s+</div>)\s*\n'
        r'(\s+)(<h1 class="product-title">[\s\S]*?</h1>)'
    )
    m = re.search(pattern_a, html)
    if m and html.index(m.group(0)) < html.find('</h1>') + 1:
        # Stars sont avant h1 -> les mettre apres
        stars_block = m.group(2).strip()
        h1_block    = m.group(4).strip()
        indent      = m.group(3)
        replacement = '\n    ' + h1_block + '\n    ' + stars_block
        html = html.replace(m.group(0), replacement, 1)
        write(fpath, html)
        print('  moved below h1: ' + fname)
        continue

    # Verifie si stars sont deja apres h1 (pas besoin de changer)
    h1_pos    = html.find('<h1 class="product-title">')
    stars_pos = html.find('<div class="product-stars">', h1_pos) if h1_pos > -1 else -1
    price_pos = html.find('product-price-wrap', h1_pos)          if h1_pos > -1 else -1

    if h1_pos > -1 and stars_pos > -1 and stars_pos < price_pos:
        print('  (deja sous h1) ' + fname)
    else:
        print('  WARN - verifier manuellement: ' + fname)

print('\nTermine !')
