# -*- coding: utf-8 -*-
# fix_stars_below.py — corrige les pages produit avec etoiles mal placees

import os, re

BASE     = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'
PRODUITS = os.path.join(BASE, 'produits')

def read(p):
    with open(p, 'r', encoding='utf-8') as f: return f.read()
def write(p, c):
    with open(p, 'w', encoding='utf-8') as f: f.write(c)
    print('OK: ' + os.path.basename(p))

# Fichiers qui ont les etoiles AVANT le h1 (a cause de fix_hero_stars.py)
# avec indentation irreguliere
TARGETS = [
    'chouchou-soie.html',
    'dentifrice-siwak.html',
    'gant-visage.html',
    'pack-1an-full-body.html',
    'pack-dentifrice-3m.html',
    'pack-siwak-complet.html',
    'pack-tetes-x3.html',
    'tetes-recharges.html',
]

for fname in TARGETS:
    fpath = os.path.join(PRODUITS, fname)
    html  = read(fpath)

    # Pattern permissif : capture le bloc product-stars (avec n'importe quelle indentation)
    # suivi du h1 (avec n'importe quelle indentation)
    pattern = (
        r'(\s*<div class="product-stars">\s*\n'        # ouvre product-stars
        r'\s*<span class="stars">[\s\S]*?</span>\s*\n' # span stars
        r'\s*<span class="stars-count">[^<]*</span>\s*\n' # span count
        r'\s*</div>)\s*\n'                              # ferme product-stars
        r'\s*(<h1 class="product-title">[\s\S]*?</h1>)' # h1
    )

    m = re.search(pattern, html)
    if not m:
        print('  WARN pattern non trouve: ' + fname)
        continue

    stars_block = m.group(1).strip()
    h1_block    = m.group(2).strip()

    # Remplace par : h1 D'ABORD, etoiles APRES (bien indentes)
    replacement = (
        '\n    ' + h1_block +
        '\n    ' + stars_block
    )
    html = html.replace(m.group(0), replacement, 1)
    write(fpath, html)

print('\nTermine !')
