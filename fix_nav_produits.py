# -*- coding: utf-8 -*-
# fix_nav_produits.py
# Ajoute "Accueil" dans le nav des pages produits (qui avaient Accueil seulement dans le breadcrumb)

import os, re

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'

def read(p):
    with open(p, 'r', encoding='utf-8') as f: return f.read()

def write(p, c):
    with open(p, 'w', encoding='utf-8') as f: f.write(c)
    print('OK: ' + os.path.relpath(p, BASE))

for dirpath, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in {'node_modules', '.git', 'api'}]
    for fname in files:
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fname)
        html = read(fpath)
        if '<ul class="nav-links">' not in html:
            continue

        # Check specifically if Accueil is in the nav-links (not just anywhere)
        nav_match = re.search(r'<ul class="nav-links">([\s\S]*?)</ul>', html)
        if not nav_match:
            continue
        nav_content = nav_match.group(1)
        if '>Accueil<' in nav_content:
            print('  (nav OK) ' + os.path.relpath(fpath, BASE))
            continue

        # Determine path prefix based on depth
        relpath = os.path.relpath(fpath, BASE)
        depth = len(relpath.split(os.sep))
        prefix = '../' if depth > 1 else ''

        # --- Desktop nav: insert before first <li> inside ul.nav-links
        html = re.sub(
            r'(<ul class="nav-links">\s*\n?\s*)<li>',
            r'\g<1><li><a href="' + prefix + r'index">Accueil</a></li>\n    <li>',
            html, count=1
        )

        # --- Mobile nav: insert as first child of .mobile-nav
        # Check if mobile-nav exists and doesn't have Accueil
        mob_match = re.search(r'<div class="mobile-nav" id="mobileNav">([\s\S]*?)</div>', html)
        if mob_match and '>Accueil<' not in mob_match.group(1):
            html = re.sub(
                r'(<div class="mobile-nav" id="mobileNav">)',
                r'\g<1>\n  <a href="' + prefix + r'index" onclick="closeMobileNav()">Accueil</a>',
                html, count=1
            )

        write(fpath, html)

print('Termine !')
