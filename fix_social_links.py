# -*- coding: utf-8 -*-
import os, glob

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'

IG  = 'https://www.instagram.com/alyanco'
FB  = 'https://www.facebook.com/Alyanco'
# TikTok : handle pas encore fourni, on garde # pour l'instant

files = glob.glob(os.path.join(BASE, '**', '*.html'), recursive=True)

total = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # ── 1. Corriger les mauvais handles "alyanco.com" ──────────────────────
    content = content.replace(
        'href="https://www.instagram.com/alyanco.com"',
        f'href="{IG}"'
    )
    content = content.replace(
        '>@alyanco.com<',
        '>@alyanco<'
    )
    # TikTok handle erroné : on vide pour l'instant
    content = content.replace(
        'href="https://www.tiktok.com/@alyanco.com"',
        'href="#"'
    )

    # ── 2. Injecter les vrais liens dans les placeholders href="#" ──────────
    # Facebook : >f< ou >F<
    content = content.replace(
        'href="#" class="footer-social">f<',
        f'href="{FB}" target="_blank" aria-label="Facebook" class="footer-social">f<'
    )
    # Instagram : >in<
    content = content.replace(
        'href="#" class="footer-social">in<',
        f'href="{IG}" target="_blank" aria-label="Instagram" class="footer-social">in<'
    )

    # ── 3. Cas index.html et brosse-siwak.html (attributs sur lignes séparées)
    # Pattern multi-ligne avec aria-label absent
    import re
    # Facebook sans target
    content = re.sub(
        r'<a href="#" class="footer-social">f</a>',
        f'<a href="{FB}" target="_blank" aria-label="Facebook" class="footer-social">f</a>',
        content
    )
    content = re.sub(
        r'<a href="#" class="footer-social">in</a>',
        f'<a href="{IG}" target="_blank" aria-label="Instagram" class="footer-social">in</a>',
        content
    )

    # ── 4. contact.html : social-link (pas footer-social)
    content = content.replace(
        'href="https://www.instagram.com/alyanco" target="_blank" aria-label="Instagram" class="footer-social"',
        f'href="{IG}" target="_blank" aria-label="Instagram" class="footer-social"'
    )

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        total += 1
        print(f'OK : {os.path.relpath(path, BASE)}')

print(f'\n{total} fichier(s) mis a jour.')
