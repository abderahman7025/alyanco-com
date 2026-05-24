# -*- coding: utf-8 -*-
# fix_collection_cards.py
# Remet les cartes collection dans l'ordre correct :
# product-name EN PREMIER, product-stars EN DESSOUS
# (annule le swap casse de fix_stars_position.py)

import os, re

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'

def read(p):
    with open(p, 'r', encoding='utf-8') as f: return f.read()
def write(p, c):
    with open(p, 'w', encoding='utf-8') as f: f.write(c)
    print('OK: ' + os.path.relpath(p, BASE))

# ── Donnees etoiles par produit ──────────────────────────────
STARS_DATA = {
    # collection-siwak
    'Pack Brosse Siwak Complet':            ('★★★★★', '38'),
    'Brosse à dents Siwak Rechargeable': ('★★★★★', '47'),
    'Têtes-Recharges Siwak':           ('★★★★★', '31'),
    'Dentifrice Siwak en Poudre':           ('★★★★★', '26'),
    # collection-gants
    'Pack 1 An Full Body':                  ('★★★★★', '42'),
    'Gant Exfoliant Corps — Soie de Mûrier': ('★★★★★', '208'),
    'Gant Exfoliant Visage — Soie de Mûrier':('★★★★★', '64'),
    'Chouchou Tenue Parfaite — Soie':  ('★★★★★', '19'),
    # index.html
    'Brosse à dents Siwak Rechargeable': ('★★★★★', '47'),
    'Gant Exfoliant Corps — Soie de Mûrier': ('★★★★★', '208'),
}

FILES = [
    os.path.join(BASE, 'collection-siwak.html'),
    os.path.join(BASE, 'collection-gants.html'),
    os.path.join(BASE, 'index.html'),
]

for fpath in FILES:
    html = read(fpath)
    original = html

    # 1. Reparer le HTML casse : product-name ouvert sans contenu + etoiles a l'interieur
    # Pattern broken: <div class="product-name">\n\n<div class="product-stars">...</div>NAME</div>
    html = re.sub(
        r'<div class="product-name">\s*\n\s*\n?\s*'
        r'(<div class="product-stars">.*?</div>)'
        r'([^<]+)</div>',
        lambda m: (
            '<div class="product-name">' + m.group(2).strip() + '</div>\n        '
            + m.group(1)
        ),
        html,
        flags=re.DOTALL
    )

    # 2. Si les etoiles sont encore avant product-name (cas non-casse),
    #    les mettre apres avec un regex plus precis
    # Pattern propre : stars-div\n  name-div-complete
    html = re.sub(
        r'(<div class="product-stars">(?:[^<]|<span[^>]*>[^<]*</span>)*</div>)'
        r'\n(\s+)'
        r'(<div class="product-name">([^<]*)</div>)',
        r'\3\n\2\1',
        html
    )

    if html != original:
        write(fpath, html)
    else:
        print('  (pas de changement) ' + os.path.relpath(fpath, BASE))

print('\nTermine !')
