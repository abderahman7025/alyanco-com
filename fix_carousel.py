# -*- coding: utf-8 -*-
# fix_carousel.py
# 1. index.html : 4,7 etoile -> 4,8 etoile dans les stats hero
# 2. Toutes les pages produit :
#    a. Supprimer les dates des avis
#    b. Convertir la grille d'avis en carousel (scroll auto)
#    c. Ajouter le JS du carousel

import os, re

BASE = r'C:\Users\Abdu et Tati\Desktop\claude\alyanco_new'

def read(p):
    with open(p, 'r', encoding='utf-8') as f: return f.read()
def write(p, c):
    with open(p, 'w', encoding='utf-8') as f: f.write(c)
    print('OK: ' + os.path.relpath(p, BASE))

def stars(n):
    return '★' * n + '☆' * (5 - n)

# Construit un seul review-card (sans date)
def card_html(init, name, rating, text):
    return (
        '      <div class="review-card">\n'
        '        <div class="review-top">\n'
        '          <div class="review-avatar">' + init + '</div>\n'
        '          <div class="review-meta">\n'
        '            <div class="review-name">' + name + '</div>\n'
        '            <div class="review-stars">' + stars(rating) + '</div>\n'
        '          </div>\n'
        '        </div>\n'
        '        <div class="review-verified">Achat vérifié</div>\n'
        '        <div class="review-text">' + text + '</div>\n'
        '      </div>'
    )

# Construit la section entiere avec carousel (cartes dupliquees pour boucle infinie)
def carousel_section(count, title_html, items):
    # items = [(initials, name, date, rating, text), ...]
    cards = '\n'.join([card_html(it[0], it[1], it[3], it[4]) for it in items])
    # Duplicate for infinite loop
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
        '  <div class="reviews-track-wrap">\n'
        '    <div class="reviews-track" id="reviewsTrack">\n'
        + cards + '\n'
        + cards + '\n'  # duplicate for infinite scroll
        '    </div>\n'
        '  </div>\n'
        '</section>'
    )

NEW_CSS = '''\
/* AVIS CLIENTS */
.reviews-section { padding: 80px 0; background: var(--cream); overflow: hidden; }
@media(max-width:768px){ .reviews-section { padding: 48px 0; } }
.reviews-header { text-align: center; margin-bottom: 48px; padding: 0 24px; }
.reviews-eyebrow { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 16px; }
.reviews-eyebrow::before, .reviews-eyebrow::after { content: ''; width: 40px; height: 1px; background: var(--gold); }
.reviews-title { font-family: var(--font-serif); font-size: clamp(28px,3vw,40px); font-weight: 300; color: var(--dark); line-height: 1.2; }
.reviews-title em { font-style: italic; color: var(--gold); }
.reviews-avg { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 16px; }
.reviews-avg-score { font-family: var(--font-serif); font-size: 40px; font-weight: 500; color: var(--dark); line-height: 1; }
.reviews-avg-stars { color: var(--gold); font-size: 20px; letter-spacing: 2px; }
.reviews-avg-count { font-size: 12px; color: var(--light); }
.reviews-track-wrap { position: relative; overflow: hidden; }
.reviews-track-wrap::before, .reviews-track-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; pointer-events: none; }
.reviews-track-wrap::before { left: 0; background: linear-gradient(to right, var(--cream), transparent); }
.reviews-track-wrap::after  { right: 0; background: linear-gradient(to left, var(--cream), transparent); }
.reviews-track { display: flex; gap: 20px; width: max-content; will-change: transform; padding: 20px 0; }
.review-card { min-width: 300px; max-width: 300px; background: var(--white); border: 1px solid rgba(184,151,90,0.12); padding: 28px; display: flex; flex-direction: column; gap: 14px; flex-shrink: 0; transition: transform 0.3s, box-shadow 0.3s; }
.review-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(28,22,18,0.08); }
.review-top { display: flex; align-items: center; gap: 14px; }
.review-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--sand); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 16px; font-weight: 500; color: var(--dark); flex-shrink: 0; }
.review-meta { flex: 1; }
.review-name { font-size: 14px; font-weight: 500; color: var(--dark); }
.review-stars { color: var(--gold); font-size: 13px; letter-spacing: 1px; margin-top: 3px; }
.review-verified { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); display: flex; align-items: center; gap: 4px; }
.review-verified::before { content: '✓'; }
.review-text { font-size: 13px; color: var(--mid); line-height: 1.75; flex: 1; }'''

CAROUSEL_JS = '''\
// ── REVIEWS CAROUSEL ──
(function() {
  var track = document.getElementById('reviewsTrack');
  if (!track) return;
  var x = 0, paused = false;
  track.addEventListener('mouseenter', function() { paused = true; });
  track.addEventListener('mouseleave', function() { paused = false; });
  function tick() {
    if (!paused) {
      x += 0.5;
      var half = track.scrollWidth / 2;
      if (x >= half) x -= half;
      track.style.transform = 'translateX(' + (-x) + 'px)';
    }
    requestAnimationFrame(tick);
  }
  tick();
})();'''

# ─────────────────────────────────────────────────────────────
# DONNEES AVIS
# ─────────────────────────────────────────────────────────────
REVIEWS = {
    'brosse-siwak': (47, 'Ils ont adopté<br><em>la routine naturelle</em>', [
        ('SM', 'Sophie M.',     '', 5, 'Mes dents n\'ont jamais été aussi blanches. Je ne reviens plus en arrière !'),
        ('ML', 'Marie L.',      '', 5, 'Superbe concept rechargeable. Zéro plastique et tellement efficace.'),
        ('ED', 'Emma D.',       '', 5, 'Haleine fraîche toute la journée. Vraiment bluffant.'),
        ('CR', 'Camille R.',    '', 5, 'Mon dentiste a remarqué la différence ! 100 % naturel, c\'est parfait.'),
        ('LB', 'Léa B.',        '', 5, 'Très satisfaite. Livrée rapidement, bien emballée.'),
        ('IH', 'Inès H.',       '', 5, 'Super produit ! Je n\'utilise plus ma brosse électrique.'),
        ('CF', 'Clara F.',      '', 4, 'Belle brosse, un peu de temps pour s\'y habituer mais le résultat est là.'),
        ('AP', 'Amandine P.',   '', 5, 'J\'achète maintenant pour toute la famille !'),
        ('NK', 'Nadia K.',      '', 5, 'Les têtes biodégradables, c\'est exactement ce que je cherchais.'),
        ('JC', 'Julie C.',      '', 4, 'Colis incomplet à la réception. Le SAV a répondu en 2h et renvoyé le lendemain. Bravo !'),
        ('FT', 'Fatima T.',     '', 5, 'Un vrai coup de cœur. Ça change vraiment des brosses classiques.'),
        ('HM', 'Hugo M.',       '', 5, 'Cadeau pour ma femme, elle ne jure plus que par ça.'),
    ]),
    'tetes-recharges': (31, 'Toujours<br><em>bien équipés</em>', [
        ('MC', 'Marie-Claire D.', '', 5, 'Se vissent parfaitement sur la brosse. Aucun problème.'),
        ('SL', 'Sonia L.',        '', 5, 'Super rapport qualité/prix pour un pack de 3.'),
        ('AM', 'Anaïs M.',        '', 5, 'Biodégradable et efficace. Que demander de plus ?'),
        ('TP', 'Thomas P.',       '', 4, 'Bien, même si j\'aurais aimé un pack de 5.'),
        ('KB', 'Karine B.',       '', 5, 'Je recommande. Livraison ultra rapide.'),
        ('NR', 'Nadia R.',        '', 5, 'Parfait pour recharger sans racheter toute la brosse.'),
        ('EV', 'Emilie V.',       '', 5, 'Les soies sont douces et efficaces. Très satisfaite.'),
        ('LC', 'Lola C.',         '', 5, 'Idéal en cadeau avec la brosse.'),
        ('CF', 'Camille F.',      '', 4, 'Bien. J\'attends de voir la durabilité sur la durée.'),
        ('SH', 'Sandra H.',       '', 5, 'Commande arrivée en 2 jours. Impeccable !'),
    ]),
    'dentifrice-siwak': (26, 'Un sourire<br><em>vraiment naturel</em>', [
        ('LM', 'Lucie M.',     '', 5, 'La poudre était étrange au début, mais après 2 semaines mes dents sont top !'),
        ('SB', 'Sarah B.',     '', 5, 'Naturel, sans produit chimique. Enfin un dentifrice sain.'),
        ('JL', 'Jade L.',      '', 5, 'Mes dents sont plus blanches. Fini les dentifrices classiques.'),
        ('MD', 'Marion D.',    '', 4, 'Goût différent, il faut s\'y habituer. Mais le résultat blancheur est réel.'),
        ('ER', 'Emilie R.',    '', 5, 'Super produit naturel ! Je l\'ai commandé en lot.'),
        ('CM', 'Clara M.',     '', 5, 'Rapide à livrer, bien emballé. Conforme.'),
        ('AV', 'Ambre V.',     '', 5, 'Mon haleine reste fraîche des heures. Vraiment efficace.'),
        ('CP', 'Charlotte P.', '', 5, 'Sans fluor, sans SLS. Exactement ce que je cherchais.'),
        ('EN', 'Elisa N.',     '', 4, 'Bien. J\'aurais aimé une contenance plus grande.'),
        ('ZT', 'Zoé T.',       '', 5, 'Je recommande vivement ! Mes gencives ne saignent plus.'),
    ]),
    'gant-corps': (208, 'Une peau<br><em>transformée</em>', [
        ('LH', 'Leila H.',   '', 5, 'Un seul passage et la peau est ultra douce. Magique !'),
        ('SP', 'Sandra P.',  '', 5, 'Aussi efficace avec juste de l\'eau ! Je n\'arrive pas à y croire.'),
        ('FR', 'Fatima R.',  '', 5, 'La soie de mûrier c\'est d\'une douceur... Rien à voir avec un kessa classique.'),
        ('IM', 'Inès M.',    '', 5, 'Résultats visibles dès la 1ère utilisation. Conquise !'),
        ('NB', 'Noémie B.',  '', 5, 'Peau satinée, sans rougeur. Parfait pour les peaux sensibles.'),
        ('YD', 'Yasmine D.', '', 4, 'Très bien. Ça valait vraiment l\'attente.'),
        ('KL', 'Kadi L.',    '', 5, 'Plus d\'acné dans le dos depuis 3 semaines. C\'est fou !'),
        ('AC', 'Amina C.',   '', 5, 'Je l\'offre à toutes mes amies. Elles adorent.'),
        ('ST', 'Sofia T.',   '', 5, 'Gommage parfait. Ma peau n\'a jamais été aussi lisse.'),
        ('LM', 'Laura M.',   '', 4, 'Très bien. J\'aurais aimé un mode d\'emploi plus détaillé.'),
        ('NV', 'Nadia V.',   '', 5, 'Certifié OEKO TEX, c\'est rassurant. Produit de qualité.'),
        ('CP', 'Cécile P.',  '', 5, 'Coup de cœur absolu. Je rachèterai sans hésiter.'),
    ]),
    'gant-visage': (64, 'Un teint<br><em>lumineux</em>', [
        ('EL', 'Emma L.',    '', 5, 'Mon visage est ultra propre sans aucun produit. Juste de l\'eau !'),
        ('PB', 'Pauline B.', '', 5, 'Anti-acné pour de vrai. J\'ai vu la différence en 3 séances.'),
        ('CR', 'Chloé R.',   '', 5, 'Ultra doux, aucune rougeur. Et ça gomme vraiment efficacement.'),
        ('LM', 'Lena M.',    '', 5, 'Mes points noirs ont disparu. Je ne m\'en sépare plus.'),
        ('SD', 'Sonia D.',   '', 4, 'Très bien. Je conseille de commencer doucement.'),
        ('NP', 'Nadège P.',  '', 5, 'Le meilleur gommage visage que j\'ai testé. Et j\'en ai testé beaucoup !'),
        ('RK', 'Rania K.',   '', 5, 'Peau lumineuse et nette. Vraiment impressionnant.'),
        ('MV', 'Manon V.',   '', 5, 'Mon teint est plus uniforme depuis. Fantastique.'),
        ('LC', 'Léa C.',     '', 5, 'Parfait pour ma peau sensible. Aucune irritation.'),
        ('MH', 'Marine H.',  '', 4, 'Bien ! J\'utilise 1 fois par semaine, ça me convient parfaitement.'),
    ]),
    'pack-siwak-complet': (38, 'Le kit parfait<br><em>pour démarrer</em>', [
        ('ML', 'Mathilde L.', '', 5, 'Le pack idéal pour se lancer. Tout est inclus, livraison rapide.'),
        ('EB', 'Elise B.',    '', 5, 'Super valeur ! J\'aurais dû commander ça dès le début.'),
        ('NP', 'Nina P.',     '', 5, 'Cadeau parfait pour initier un proche au naturel.'),
        ('LD', 'Laure D.',    '', 5, 'Le dentifrice en poudre est une révélation. Merci pour ce pack !'),
        ('CV', 'Camille V.',  '', 4, 'Belle boîte d\'emballage. Économies réelles vs achat séparé.'),
        ('AM', 'Ambre M.',    '', 5, 'Reçu en 48h. Parfait. Je re-commande.'),
        ('LR', 'Louise R.',   '', 5, 'Se brosser les dents devient presque un plaisir avec ce pack.'),
        ('TC', 'Tiphaine C.', '', 5, 'Je l\'ai offert à ma sœur et elle est conquise. Super cadeau.'),
        ('CH', 'Céline H.',   '', 4, 'Très bon pack. Manque peut-être une petite notice.'),
        ('JN', 'Julie N.',    '', 5, 'Qualité au rendez-vous. Je recommande !'),
    ]),
    'pack-1an-full-body': (42, 'Un an de beauté<br><em>naturelle</em>', [
        ('MB', 'Malika B.',  '', 5, 'Un an de gommage prévu, c\'est le calcul malin ! Le prix est vraiment bien.'),
        ('SL', 'Sara L.',    '', 5, 'Peau douce de la tête aux pieds. Corps + visage, c\'est parfait.'),
        ('NM', 'Nora M.',    '', 5, 'Je ne reviendrai jamais aux scrubs classiques. Plus jamais !'),
        ('HD', 'Hawa D.',    '', 4, 'Très bien. Livraison un peu longue mais ça valait l\'attente.'),
        ('RP', 'Reem P.',    '', 5, 'Le meilleur investissement beauté que j\'ai fait.'),
        ('LV', 'Lola V.',    '', 5, 'Peau lisse et lumineuse. Mon mari me fait des compliments !'),
        ('IR', 'Inès R.',    '', 5, 'J\'ai reçu un petit mot manuscrit dans le colis. Adorable.'),
        ('FC', 'Farah C.',   '', 5, 'Abordable, efficace, naturel. Que demander de plus ?'),
        ('AH', 'Aïcha H.',   '', 5, 'Je l\'ai pris pour moi et ma fille. On est toutes les deux ravies.'),
        ('SP', 'Sofia P.',   '', 4, 'Très bon rapport qualité prix. Je commanderai encore.'),
    ]),
    'pack-tetes-x3': (28, 'Toujours<br><em>bien équipés</em>', [
        ('EM', 'Elise M.',   '', 5, 'Le prix au lot est vraiment avantageux. Je commande toujours par 3.'),
        ('LP', 'Lucie P.',   '', 5, 'Super pratique d\'avoir du stock. Les têtes durent bien.'),
        ('CD', 'Charlotte D.', '', 5, 'Compatible parfaitement avec la brosse. Aucun souci.'),
        ('AL', 'Anaïs L.',   '', 5, 'Biodégradable, c\'est ce que j\'aime. Je rachète sans hésiter.'),
        ('MV', 'Marion V.',  '', 4, 'Bien. J\'aurais préféré un pack de 5 mais le rapport qualité-prix est là.'),
        ('SC', 'Sophie C.',  '', 5, 'Livraison en 2 jours. Impeccable !'),
        ('AH', 'Amélie H.',  '', 5, 'Se vissent parfaitement. Aucune fuite, aucun souci.'),
        ('VR', 'Vanessa R.', '', 5, 'Je recommande pour toute la famille.'),
        ('LB', 'Léa B.',     '', 4, 'Bien. J\'attends de voir si elles durent les 2 mois annoncés.'),
        ('FN', 'Fanny N.',   '', 5, 'Qualité au top. Je suis cliente depuis le début.'),
    ]),
    'pack-dentifrice-3m': (22, '3 mois de sourire<br><em>naturel</em>', [
        ('IM', 'Isabelle M.',   '', 5, '3 mois d\'avance, c\'est malin. Le prix est très correct.'),
        ('VP', 'Valérie P.',    '', 5, 'Après 3 mois, mes dents sont vraiment plus blanches.'),
        ('ND', 'Nathalie D.',   '', 5, 'Sans produit chimique pour toute la famille. On adore.'),
        ('CL', 'Christine L.',  '', 4, 'La poudre demande un temps d\'adaptation mais ça vaut le coup.'),
        ('AB', 'Anne-Sophie B.', '', 5, 'Livraison rapide, emballage soigné. Parfait.'),
        ('DR', 'Dominique R.',  '', 5, 'Je ne m\'en sépare plus. Mes gencives sont beaucoup mieux.'),
        ('PV', 'Patricia V.',   '', 5, 'Rapport qualité-prix excellent pour ce lot de 3.'),
        ('CH', 'Corinne H.',    '', 5, 'Naturel et efficace. Mon mari a commencé à en utiliser aussi !'),
        ('BC', 'Brigitte C.',   '', 4, 'Bien. J\'aurais aimé que la poudre soit un peu plus fine.'),
        ('SN', 'Sylvie N.',     '', 5, 'Toujours satisfaite de mes commandes chez ALYA & CO.'),
    ]),
    'chouchou-soie': (19, 'Des cheveux<br><em>protégés</em>', [
        ('ML', 'Mia L.',      '', 5, 'Mes cheveux sont tellement plus doux depuis que je l\'utilise !'),
        ('DB', 'Diane B.',    '', 5, 'Fini les traces, fini la casse. Ce chouchou est parfait.'),
        ('YM', 'Yasmine M.',  '', 5, 'Livraison ultra rapide. Produit comme décrit. Je rachète.'),
        ('AP', 'Alicia P.',   '', 5, 'Idéal pour la nuit. Mes cheveux ne cassent plus !'),
        ('JD', 'Juliette D.', '', 4, 'Joli et efficace. Un peu petit pour mes cheveux épais, sinon parfait.'),
        ('OR', 'Océane R.',   '', 5, 'La soie de mûrier c\'est une autre dimension. Mes cheveux adorent !'),
        ('EV', 'Elina V.',    '', 5, 'Super cadeau pour une amie. Elle était ravie !'),
        ('CH', 'Camille H.',  '', 5, 'Anti-frisottis réellement. Je suis bluffée.'),
        ('AC', 'Agathe C.',   '', 5, 'Raffiné et durable. Fini les élastiques qui cassent les cheveux.'),
        ('PN', 'Priya N.',    '', 4, 'Très bien. J\'en ai commandé 3 pour en avoir partout.'),
    ]),
}

# ─────────────────────────────────────────────────────────────
# 1. INDEX.HTML : 4,7 etoile -> 4,8 etoile
# ─────────────────────────────────────────────────────────────
print('=== 1. Fix index.html stat 4,7 -> 4,8 ===')
fpath = os.path.join(BASE, 'index.html')
html = read(fpath)
html = html.replace('<div class="stat-num">4,7★</div>', '<div class="stat-num">4,8★</div>')
write(fpath, html)

# ─────────────────────────────────────────────────────────────
# 2. PAGES PRODUIT : carousel + pas de dates
# ─────────────────────────────────────────────────────────────
print('\n=== 2. Conversion carousel sur les pages produit ===')

produits_dir = os.path.join(BASE, 'produits')
for fname in os.listdir(produits_dir):
    if not fname.endswith('.html'):
        continue
    key = fname.replace('.html', '')
    if key not in REVIEWS:
        print('  Pas de donnees: ' + key)
        continue

    fpath = os.path.join(produits_dir, fname)
    html = read(fpath)

    # --- a. Mise a jour CSS ---
    html = re.sub(
        r'/\* AVIS CLIENTS \*/[\s\S]*?\.review-text \{[^}]+\}',
        NEW_CSS,
        html
    )

    # --- b. Remplacement de la section HTML ---
    count, title_html, items = REVIEWS[key]
    new_section = carousel_section(count, title_html, items)
    html = re.sub(
        r'<section class="reviews-section">[\s\S]*?</section>\s*(?=<footer)',
        new_section + '\n',
        html
    )

    # --- c. Ajout du JS carousel avant </body> ---
    if 'reviewsTrack' in html and CAROUSEL_JS not in html:
        html = html.replace('</body>', '<script>\n' + CAROUSEL_JS + '\n</script>\n</body>')

    write(fpath, html)

print('\nTermine !')
