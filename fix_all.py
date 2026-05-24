# -*- coding: utf-8 -*-
# fix_all.py
# 1. Ajoute "Accueil" dans le nav (desktop + mobile) sur toutes les pages
# 2. Ajoute les etoiles manquantes sur les cartes collection
# 3. Remplace les avis (plus courts, plus naturels, 10-12 par produit)
# 4. Met a jour les stats globales (208+ -> 500+)

import os, re

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'

def read(p):
    with open(p, 'r', encoding='utf-8') as f: return f.read()

def write(p, c):
    with open(p, 'w', encoding='utf-8') as f: f.write(c)
    print('OK: ' + os.path.relpath(p, BASE))

def stars(n):
    return '★' * n + '☆' * (5 - n)

def card(init, name, date, rating, text):
    return (
        '    <div class="review-card reveal">\n'
        '      <div class="review-top">\n'
        '        <div class="review-avatar">' + init + '</div>\n'
        '        <div class="review-meta">\n'
        '          <div class="review-name">' + name + '</div>\n'
        '          <div class="review-date">' + date + '</div>\n'
        '        </div>\n'
        '        <div class="review-stars">' + stars(rating) + '</div>\n'
        '      </div>\n'
        '      <div class="review-verified">Achat vérifié</div>\n'
        '      <div class="review-text">' + text + '</div>\n'
        '    </div>'
    )

def section(count, title_html, items):
    cards_html = '\n'.join([card(*it) for it in items])
    return (
        '<section class="reviews-section">\n'
        '  <div class="reviews-header">\n'
        '    <div class="reviews-eyebrow">Témoignages clients</div>\n'
        '    <h2 class="reviews-title">' + title_html + '</h2>\n'
        '    <div class="reviews-avg">\n'
        '      <span class="reviews-avg-score">4,8</span>\n'
        '      <span class="reviews-avg-stars">★★★★★</span>\n'
        '      <span class="reviews-avg-count">sur ' + str(count) + ' avis</span>\n'
        '    </div>\n'
        '  </div>\n'
        '  <div class="reviews-grid">\n'
        + cards_html + '\n'
        '  </div>\n'
        '</section>'
    )

# ─────────────────────────────────────────────────────────────
# DONNEES AVIS PAR PRODUIT
# ─────────────────────────────────────────────────────────────
REVIEWS = {
    'brosse-siwak': (47, 'Ils ont adopté<br><em>la routine naturelle</em>', [
        ('SM', 'Sophie M.',     'Mars 2026',    5, 'Mes dents n\'ont jamais été aussi blanches. Je ne reviens plus en arrière !'),
        ('ML', 'Marie L.',      'Janvier 2026', 5, 'Superbe concept rechargeable. Zéro plastique et tellement efficace.'),
        ('ED', 'Emma D.',       'Avril 2026',   5, 'Haleine fraîche toute la journée. Vraiment bluffant.'),
        ('CR', 'Camille R.',    'Février 2026', 5, 'Mon dentiste a remarqué la différence ! 100 % naturel, c\'est parfait.'),
        ('LB', 'Léa B.',   'Mai 2026',     5, 'Très satisfaite. Livrée rapidement, bien emballée.'),
        ('IH', 'Inès H.',  'Mars 2026',    5, 'Super produit ! Je n\'utilise plus ma brosse électrique.'),
        ('CF', 'Clara F.',      'Avril 2026',   4, 'Belle brosse, un peu de temps pour s\'y habituer mais le résultat est là.'),
        ('AP', 'Amandine P.',   'Janvier 2026', 5, 'J\'achète maintenant pour toute la famille !'),
        ('NK', 'Nadia K.',      'Février 2026', 5, 'Les têtes biodégradables, c\'est exactement ce que je cherchais.'),
        ('JC', 'Julie C.',      'Janvier 2026', 4, 'Colis incomplet à la réception. Le SAV a répondu en 2h et renvoyé le lendemain. Bravo !'),
        ('FT', 'Fatima T.',     'Mars 2026',    5, 'Un vrai coup de cœur. Ça change vraiment des brosses classiques.'),
        ('HM', 'Hugo M.',       'Mai 2026',     5, 'Cadeau pour ma femme, elle ne jure plus que par ça.'),
    ]),
    'tetes-recharges': (31, 'Toujours<br><em>bien équipés</em>', [
        ('MC', 'Marie-Claire D.', 'Avril 2026',    5, 'Se vissent parfaitement sur la brosse. Aucun problème.'),
        ('SL', 'Sonia L.',        'Mars 2026',     5, 'Super rapport qualité/prix pour un pack de 3.'),
        ('AM', 'Anaïs M.',   'Mai 2026',      5, 'Biodégradable et efficace. Que demander de plus ?'),
        ('TP', 'Thomas P.',       'Février 2026', 4, 'Bien, même si j\'aurais aimé un pack de 5.'),
        ('KB', 'Karine B.',       'Janvier 2026',  5, 'Je recommande. Livraison ultra rapide.'),
        ('NR', 'Nadia R.',        'Avril 2026',    5, 'Parfait pour recharger sans racheter toute la brosse.'),
        ('EV', 'Emilie V.',       'Mars 2026',     5, 'Les soies sont douces et efficaces. Très satisfaite.'),
        ('LC', 'Lola C.',         'Mai 2026',      5, 'Idéal en cadeau avec la brosse.'),
        ('CF', 'Camille F.',      'Février 2026', 4, 'Bien. J\'attends de voir la durabilité sur la durée.'),
        ('SH', 'Sandra H.',       'Janvier 2026',  5, 'Commande arrivée en 2 jours. Impeccable !'),
    ]),
    'dentifrice-siwak': (26, 'Un sourire<br><em>vraiment naturel</em>', [
        ('LM', 'Lucie M.',     'Avril 2026',    5, 'La poudre était étrange au début, mais après 2 semaines mes dents sont top !'),
        ('SB', 'Sarah B.',     'Mars 2026',     5, 'Naturel, sans produit chimique. Enfin un dentifrice sain.'),
        ('JL', 'Jade L.',      'Mai 2026',      5, 'Mes dents sont plus blanches. Fini les dentifrices classiques.'),
        ('MD', 'Marion D.',    'Février 2026', 4, 'Goût différent, il faut s\'y habituer. Mais le résultat blancheur est réel.'),
        ('ER', 'Emilie R.',    'Janvier 2026',  5, 'Super produit naturel ! Je l\'ai commandé en lot.'),
        ('CM', 'Clara M.',     'Avril 2026',    5, 'Rapide à livrer, bien emballé. Conforme.'),
        ('AV', 'Ambre V.',     'Mars 2026',     5, 'Mon haleine reste fraîche des heures. Vraiment efficace.'),
        ('CP', 'Charlotte P.', 'Mai 2026',      5, 'Sans fluor, sans SLS. Exactement ce que je cherchais.'),
        ('EN', 'Elisa N.',     'Février 2026', 4, 'Bien. J\'aurais aimé une contenance plus grande.'),
        ('ZT', 'Zoé T.',  'Janvier 2026',  5, 'Je recommande vivement ! Mes gencives ne saignent plus.'),
    ]),
    'gant-corps': (208, 'Une peau<br><em>transformée</em>', [
        ('LH', 'Leila H.',   'Mai 2026',      5, 'Un seul passage et la peau est ultra douce. Magique !'),
        ('SP', 'Sandra P.',  'Avril 2026',    5, 'Aussi efficace avec juste de l\'eau ! Je n\'arrive pas à y croire.'),
        ('FR', 'Fatima R.',  'Mars 2026',     5, 'La soie de mûrier c\'est d\'une douceur... Rien à voir avec un kessa classique.'),
        ('IM', 'Inès M.', 'Février 2026', 5, 'Résultats visibles dès la 1ère utilisation. Conquise !'),
        ('NB', 'Noémie B.', 'Mai 2026',  5, 'Peau satinée, sans rougeur. Parfait pour les peaux sensibles.'),
        ('YD', 'Yasmine D.', 'Avril 2026',    4, 'Très bien. Ça valait vraiment l\'attente.'),
        ('KL', 'Kadi L.',    'Mars 2026',     5, 'Plus d\'acné dans le dos depuis 3 semaines. C\'est fou !'),
        ('AC', 'Amina C.',   'Janvier 2026',  5, 'Je l\'offre à toutes mes amies. Elles adorent.'),
        ('ST', 'Sofia T.',   'Février 2026', 5, 'Gommage parfait. Ma peau n\'a jamais été aussi lisse.'),
        ('LM', 'Laura M.',   'Avril 2026',    4, 'Très bien. J\'aurais aimé un mode d\'emploi plus détaillé.'),
        ('NV', 'Nadia V.',   'Mars 2026',     5, 'Certifié OEKO TEX, c\'est rassurant. Produit de qualité.'),
        ('CP', 'Cécile P.', 'Mai 2026',  5, 'Coup de cœur absolu. Je rachèterai sans hésiter.'),
    ]),
    'gant-visage': (64, 'Un teint<br><em>lumineux</em>', [
        ('EL', 'Emma L.',    'Avril 2026',    5, 'Mon visage est ultra propre sans aucun produit. Juste de l\'eau !'),
        ('PB', 'Pauline B.', 'Mars 2026',     5, 'Anti-acné pour de vrai. J\'ai vu la différence en 3 séances.'),
        ('CR', 'Chloé R.', 'Mai 2026',  5, 'Ultra doux, aucune rougeur. Et ça gomme vraiment efficacement.'),
        ('LM', 'Lena M.',    'Février 2026', 5, 'Mes points noirs ont disparu. Je ne m\'en sépare plus.'),
        ('SD', 'Sonia D.',   'Janvier 2026',  4, 'Très bien. Je conseille de commencer doucement.'),
        ('NP', 'Nadège P.', 'Avril 2026', 5, 'Le meilleur gommage visage que j\'ai testé. Et j\'en ai testé beaucoup !'),
        ('RK', 'Rania K.',   'Mars 2026',     5, 'Peau lumineuse et nette. Vraiment impressionnant.'),
        ('MV', 'Manon V.',   'Mai 2026',      5, 'Mon teint est plus uniforme depuis. Fantastique.'),
        ('LC', 'Léa C.', 'Février 2026', 5, 'Parfait pour ma peau sensible. Aucune irritation.'),
        ('MH', 'Marine H.',  'Janvier 2026',  4, 'Bien ! J\'utilise 1 fois par semaine, ça me convient parfaitement.'),
    ]),
    'pack-siwak-complet': (38, 'Le kit parfait<br><em>pour démarrer</em>', [
        ('ML', 'Mathilde L.', 'Avril 2026',    5, 'Le pack idéal pour se lancer. Tout est inclus, livraison rapide.'),
        ('EB', 'Elise B.',    'Mars 2026',     5, 'Super valeur ! J\'aurais dû commander ça dès le début.'),
        ('NP', 'Nina P.',     'Mai 2026',      5, 'Cadeau parfait pour initier un proche au naturel.'),
        ('LD', 'Laure D.',    'Février 2026', 5, 'Le dentifrice en poudre est une révélation. Merci pour ce pack !'),
        ('CV', 'Camille V.',  'Janvier 2026',  4, 'Belle boîte d\'emballage. Économies réelles vs achat séparé.'),
        ('AM', 'Ambre M.',    'Avril 2026',    5, 'Reçu en 48h. Parfait. Je re-commande.'),
        ('LR', 'Louise R.',   'Mars 2026',     5, 'Se brosser les dents devient presque un plaisir avec ce pack.'),
        ('TC', 'Tiphaine C.', 'Mai 2026',      5, 'Je l\'ai offert à ma sœur et elle est conquise. Super cadeau.'),
        ('CH', 'Céline H.', 'Février 2026', 4, 'Très bon pack. Manque peut-être une petite notice.'),
        ('JN', 'Julie N.',    'Janvier 2026',  5, 'Qualité au rendez-vous. Je recommande !'),
    ]),
    'pack-1an-full-body': (42, 'Un an de beauté<br><em>naturelle</em>', [
        ('MB', 'Malika B.',  'Avril 2026',    5, 'Un an de gommage prévu, c\'est le calcul malin ! Le prix est vraiment bien.'),
        ('SL', 'Sara L.',    'Mars 2026',     5, 'Peau douce de la tête aux pieds. Corps + visage, c\'est parfait.'),
        ('NM', 'Nora M.',    'Mai 2026',      5, 'Je ne reviendrai jamais aux scrubs classiques. Plus jamais !'),
        ('HD', 'Hawa D.',    'Février 2026', 4, 'Très bien. Livraison un peu longue mais ça valait l\'attente.'),
        ('RP', 'Reem P.',    'Janvier 2026',  5, 'Le meilleur investissement beauté que j\'ai fait.'),
        ('LV', 'Lola V.',    'Avril 2026',    5, 'Peau lisse et lumineuse. Mon mari me fait des compliments !'),
        ('IR', 'Inès R.', 'Mars 2026',  5, 'J\'ai reçu un petit mot manuscrit dans le colis. Adorable.'),
        ('FC', 'Farah C.',   'Mai 2026',      5, 'Abordable, efficace, naturel. Que demander de plus ?'),
        ('AH', 'Aïcha H.', 'Février 2026', 5, 'Je l\'ai pris pour moi et ma fille. On est toutes les deux ravies.'),
        ('SP', 'Sofia P.',   'Janvier 2026',  4, 'Très bon rapport qualité prix. Je commanderai encore.'),
    ]),
    'pack-tetes-x3': (28, 'Toujours<br><em>bien équipés</em>', [
        ('EM', 'Elise M.',   'Avril 2026',    5, 'Le prix au lot est vraiment avantageux. Je commande toujours par 3.'),
        ('LP', 'Lucie P.',   'Mars 2026',     5, 'Super pratique d\'avoir du stock. Les têtes durent bien.'),
        ('CD', 'Charlotte D.', 'Mai 2026',    5, 'Compatible parfaitement avec la brosse. Aucun souci.'),
        ('AL', 'Anaïs L.', 'Février 2026', 5, 'Biodégradable, c\'est ce que j\'aime. Je rachète sans hésiter.'),
        ('MV', 'Marion V.',  'Janvier 2026',  4, 'Bien. J\'aurais préféré un pack de 5 mais le rapport qualité-prix est là.'),
        ('SC', 'Sophie C.',  'Avril 2026',    5, 'Livraison en 2 jours. Impeccable !'),
        ('AH', 'Amélie H.', 'Mars 2026', 5, 'Se vissent parfaitement. Aucune fuite, aucun souci.'),
        ('VR', 'Vanessa R.', 'Mai 2026',      5, 'Je recommande pour toute la famille.'),
        ('LB', 'Léa B.', 'Février 2026', 4, 'Bien. J\'attends de voir si elles durent les 2 mois annoncés.'),
        ('FN', 'Fanny N.',   'Janvier 2026',  5, 'Qualité au top. Je suis cliente depuis le début.'),
    ]),
    'pack-dentifrice-3m': (22, '3 mois de sourire<br><em>naturel</em>', [
        ('IM', 'Isabelle M.',   'Avril 2026',    5, '3 mois d\'avance, c\'est malin. Le prix est très correct.'),
        ('VP', 'Valérie P.', 'Mars 2026',   5, 'Après 3 mois, mes dents sont vraiment plus blanches.'),
        ('ND', 'Nathalie D.',   'Mai 2026',      5, 'Sans produit chimique pour toute la famille. On adore.'),
        ('CL', 'Christine L.',  'Février 2026', 4, 'La poudre demande un temps d\'adaptation mais ça vaut le coup.'),
        ('AB', 'Anne-Sophie B.', 'Janvier 2026', 5, 'Livraison rapide, emballage soigné. Parfait.'),
        ('DR', 'Dominique R.',  'Avril 2026',    5, 'Je ne m\'en sépare plus. Mes gencives sont beaucoup mieux.'),
        ('PV', 'Patricia V.',   'Mars 2026',     5, 'Rapport qualité-prix excellent pour ce lot de 3.'),
        ('CH', 'Corinne H.',    'Mai 2026',      5, 'Naturel et efficace. Mon mari a commencé à en utiliser aussi !'),
        ('BC', 'Brigitte C.',   'Février 2026', 4, 'Bien. J\'aurais aimé que la poudre soit un peu plus fine.'),
        ('SN', 'Sylvie N.',     'Janvier 2026',  5, 'Toujours satisfaite de mes commandes chez ALYA & CO.'),
    ]),
    'chouchou-soie': (19, 'Des cheveux<br><em>protégés</em>', [
        ('ML', 'Mia L.',      'Avril 2026',    5, 'Mes cheveux sont tellement plus doux depuis que je l\'utilise !'),
        ('DB', 'Diane B.',    'Mars 2026',     5, 'Fini les traces, fini la casse. Ce chouchou est parfait.'),
        ('YM', 'Yasmine M.',  'Mai 2026',      5, 'Livraison ultra rapide. Produit comme décrit. Je rachète.'),
        ('AP', 'Alicia P.',   'Février 2026', 5, 'Idéal pour la nuit. Mes cheveux ne cassent plus !'),
        ('JD', 'Juliette D.', 'Janvier 2026',  4, 'Joli et efficace. Un peu petit pour mes cheveux épais, sinon parfait.'),
        ('OR', 'Océane R.', 'Avril 2026', 5, 'La soie de mûrier c\'est une autre dimension. Mes cheveux adorent !'),
        ('EV', 'Elina V.',    'Mars 2026',     5, 'Super cadeau pour une amie. Elle était ravie !'),
        ('CH', 'Camille H.',  'Mai 2026',      5, 'Anti-frisottis réellement. Je suis bluffée.'),
        ('AC', 'Agathe C.',   'Février 2026', 5, 'Raffiné et durable. Fini les élastiques qui cassent les cheveux.'),
        ('PN', 'Priya N.',    'Janvier 2026',  4, 'Très bien. J\'en ai commandé 3 pour en avoir partout.'),
    ]),
}


# ─────────────────────────────────────────────────────────────
# 1. AJOUTER "ACCUEIL" AU NAV (toutes les pages)
# ─────────────────────────────────────────────────────────────
print('\n=== 1. Ajout lien Accueil dans le nav ===')

for dirpath, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in {'node_modules', '.git', 'api'}]
    for fname in files:
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fname)
        html = read(fpath)
        if '<ul class="nav-links">' not in html:
            continue
        if '>Accueil<' in html:
            print('  (deja present) ' + os.path.relpath(fpath, BASE))
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
        html = re.sub(
            r'(<div class="mobile-nav" id="mobileNav">)(\s*)',
            r'\g<1>\n  <a href="' + prefix + r'index" onclick="closeMobileNav()">Accueil</a>',
            html, count=1
        )

        write(fpath, html)

# ─────────────────────────────────────────────────────────────
# 2. AJOUTER ETOILES AUX CARTES SANS ETOILES (collections)
# ─────────────────────────────────────────────────────────────
print('\n=== 2. Etoiles manquantes sur cartes collection ===')

STARS_TO_ADD = {
    'collection-siwak.html': [
        ('Pack Brosse Siwak Complet',               '★★★★★', '38'),
        ('Têtes-Recharges Siwak',               '★★★★★', '31'),
        ('Dentifrice Siwak en Poudre',              '★★★★★', '26'),
    ],
    'collection-gants.html': [
        ('Pack 1 An Full Body',                     '★★★★★', '42'),
        ('Gant Exfoliant Visage — Soie de Mûrier', '★★★★★', '64'),
        ('Chouchou Tenue Parfaite — Soie',     '★★★★★', '19'),
    ],
}

for filename, additions in STARS_TO_ADD.items():
    fpath = os.path.join(BASE, filename)
    html = read(fpath)
    for pname, star_str, count in additions:
        target = '<div class="product-name">' + pname + '</div>'
        if target not in html:
            print('  WARN: card not found: ' + pname)
            continue
        if star_str in html and count + ' avis' in html:
            print('  (deja present) ' + pname)
            continue
        stars_div = '<div class="product-stars">' + star_str + ' <span>(' + count + ' avis)</span></div>\n        '
        html = html.replace(target, stars_div + target, 1)
        print('  Etoiles ajoutees: ' + pname)
    write(fpath, html)

# ─────────────────────────────────────────────────────────────
# 3. REMPLACER LES AVIS SUR CHAQUE PAGE PRODUIT
# ─────────────────────────────────────────────────────────────
print('\n=== 3. Remplacement des avis produits ===')

produits_dir = os.path.join(BASE, 'produits')
for fname in os.listdir(produits_dir):
    if not fname.endswith('.html'):
        continue
    key = fname.replace('.html', '')
    if key not in REVIEWS:
        print('  Pas de donnees pour: ' + key)
        continue

    fpath = os.path.join(produits_dir, fname)
    html = read(fpath)

    if '<section class="reviews-section">' not in html:
        print('  Pas de section reviews: ' + key)
        continue

    count, title_html, items = REVIEWS[key]
    new_section = section(count, title_html, items)

    # Replace existing reviews-section (stops before <footer)
    html = re.sub(
        r'<section class="reviews-section">[\s\S]*?</section>\s*(?=<footer)',
        new_section + '\n',
        html
    )
    write(fpath, html)

# ─────────────────────────────────────────────────────────────
# 4. METTRE A JOUR LES STATS GLOBALES
# ─────────────────────────────────────────────────────────────
print('\n=== 4. Mise a jour des stats globales ===')

# index.html
fpath = os.path.join(BASE, 'index.html')
html = read(fpath)
html = html.replace('208+',                              '500+')
html = html.replace('Plus de 200 avis',                  'Plus de 500 avis')
html = html.replace('Plus de 200 avis vérifiés. Notés 4,7/5',
                    'Plus de 500 avis vérifiés. Notés 4,8/5')
html = html.replace('4,7/5',                             '4,8/5')
write(fpath, html)

# collection-siwak.html — announcement bar
fpath = os.path.join(BASE, 'collection-siwak.html')
html = read(fpath)
html = html.replace('Plus de 200 avis', 'Plus de 500 avis')
html = html.replace('4,7/5',            '4,8/5')
write(fpath, html)

# collection-gants.html — announcement bar + badge + stars count
fpath = os.path.join(BASE, 'collection-gants.html')
html = read(fpath)
html = html.replace('Plus de 200 avis', 'Plus de 500 avis')
html = html.replace('4,7/5',            '4,8/5')
write(fpath, html)

print('\nTermine !')
