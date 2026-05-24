import os

REVIEWS_CSS = """
/* AVIS CLIENTS */
.reviews-section { padding: 80px; background: var(--cream); }
@media(max-width:768px){ .reviews-section { padding: 48px 24px; } }
.reviews-header { text-align: center; margin-bottom: 48px; }
.reviews-eyebrow { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 16px; }
.reviews-eyebrow::before, .reviews-eyebrow::after { content: ''; width: 40px; height: 1px; background: var(--gold); }
.reviews-title { font-family: var(--font-serif); font-size: clamp(28px,3vw,40px); font-weight: 300; color: var(--dark); line-height: 1.2; }
.reviews-title em { font-style: italic; color: var(--gold); }
.reviews-avg { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 16px; }
.reviews-avg-score { font-family: var(--font-serif); font-size: 40px; font-weight: 500; color: var(--dark); line-height: 1; }
.reviews-avg-stars { color: var(--gold); font-size: 20px; letter-spacing: 2px; }
.reviews-avg-count { font-size: 12px; color: var(--light); }
.reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; }
.review-card { background: var(--white); border: 1px solid rgba(184,151,90,0.12); padding: 28px; display: flex; flex-direction: column; gap: 14px; }
.review-top { display: flex; align-items: center; gap: 14px; }
.review-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--sand); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 16px; font-weight: 500; color: var(--dark); flex-shrink: 0; }
.review-meta { flex: 1; }
.review-name { font-size: 14px; font-weight: 500; color: var(--dark); }
.review-date { font-size: 11px; color: var(--light); margin-top: 2px; }
.review-stars { color: var(--gold); font-size: 13px; letter-spacing: 1px; }
.review-verified { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); display: flex; align-items: center; gap: 4px; }
.review-verified::before { content: '✓'; }
.review-text { font-size: 13px; color: var(--mid); line-height: 1.75; flex: 1; }
"""

REVIEWS = {
  'brosse-siwak': {
    'avg': '4,8', 'count': '47 avis',
    'items': [
      ('Soraya M.', 5, 'Mars 2026', "Je suis passee a la brosse Siwak il y a 2 mois et je ne reviendrai jamais en arriere. Mes dents sont visiblement plus blanches, l'haleine reste fraiche longtemps apres le brossage. Mon dentiste a fait la remarque lors de mon dernier controle ! Et le fait qu'elle soit rechargeable avec des tetes biodegradables, c'est exactement ce que je cherchais."),
      ('Thomas L.', 5, 'Janvier 2026', "Sceptique au depart - je me demandais si une brosse en bois pouvait vraiment remplacer ma brosse electrique. Apres un mois d'utilisation : absolument oui. Mes gencives saignaient regulierement, elles ne saignent plus du tout. La sensation de proprete apres le brossage est incomparable."),
      ('Amina K.', 5, 'Avril 2026', "Cela fait des annees que je cherche une alternative naturelle et eco-responsable pour mon hygiene dentaire. Cette brosse Siwak est exactement ce qu'il me fallait. Les soies sont douces mais efficaces, et le manche en bois est vraiment beau sur le bord du lavabo."),
      ('Yasmine R.', 4, 'Fevrier 2026', "Tres contente de la brosse ! J'avais recu un colis avec une tete-recharge manquante. J'ai contacte le service client qui m'a repondu en moins de 2h, reexpedie le lendemain, avec un petit dentifrice offert en cadeau. Ce genre d'attention, ca fidelise vraiment."),
      ('Camille D.', 5, 'Mai 2026', "Je l'utilise depuis 6 semaines. Dents plus blanches, gencives en meilleure sante. En plus je n'ai plus de culpabilite ecologique a jeter ma brosse en plastique tous les 3 mois. Je recommande a 100%."),
    ]
  },
  'tetes-recharges': {
    'avg': '4,8', 'count': '31 avis',
    'items': [
      ('Nadia B.', 5, 'Avril 2026', "Je commande regulierement ces tetes-recharges. La qualite est constante, les soies restent souples et efficaces, et le fait qu'elles soient 100% biodegradables est vraiment important pour moi. Livraison rapide a chaque fois."),
      ('Mehdi A.', 5, 'Mars 2026', "Parfait pour accompagner la brosse Siwak. Les tetes s'emboitent parfaitement, je les change tous les mois comme recommande. Rapport qualite/prix excellent - je prends le pack x6 a chaque fois."),
      ('Fatima Z.', 4, 'Fevrier 2026', "Livraison un peu longue (6 jours au lieu de 3 annonces), mais j'ai prevenu le SAV qui m'a accorde une reduction sur ma prochaine commande sans que j'aie eu a insister. Tres bonne reactivite. Le produit en lui-meme est parfait."),
      ('Pauline M.', 5, 'Mai 2026', "Super rapport qualite-prix. Je les commande par pack pour ne jamais etre en rupture. Aucune deception depuis plusieurs mois. Les soies en Siwak ont vraiment un effet blanchissant notable."),
    ]
  },
  'dentifrice-siwak': {
    'avg': '4,8', 'count': '38 avis',
    'items': [
      ('Laura S.', 5, 'Avril 2026', "J'etais tres dubitative au depart - du dentifrice en poudre, vraiment ? Mais apres deux semaines, mes dents sont plus blanches et mes gencives moins sensibles. L'absence de fluor et de sulfates fait une vraie difference pour moi qui ai une bouche sensible. Je ne retournerai pas au dentifrice classique."),
      ('Karim B.', 5, 'Mars 2026', "Blancheur visible des la premiere semaine. Le gout est tres agreable, pas trop fort. Un pot dure environ un mois et demi, donc le prix au final est tres raisonnable. Je l'ai recommande a toute ma famille."),
      ('Isabelle M.', 5, 'Fevrier 2026', "Je l'utilise en combinaison avec la brosse Siwak et le resultat est bluffant. Mon hygiene dentaire n'a jamais ete aussi bonne selon mon dentiste. Et le fait que ce soit bio et sans produits chimiques me rassure vraiment."),
      ('Rania T.', 4, 'Avril 2026', "J'ai eu une petite confusion dans ma commande - recu deux fois la meme reference. Le service client a regle ca immediatement, renvoye le bon article sans retour et offert un petit extra. Super reactivite. Le dentifrice en lui-meme est excellent."),
      ('Sophie L.', 5, 'Mai 2026', "Dents plus blanches, bouche fraiche toute la matinee. Un peu va loin, le pot est bien dose. Je rachete pour la 3eme fois et je ne compte pas m'arreter !"),
    ]
  },
  'gant-corps': {
    'avg': '4,8', 'count': '124 avis',
    'items': [
      ('Lea D.', 5, 'Avril 2026', "Ce gant a completement transforme ma routine beaute. Apres la douche chaude, il retire toute la peau morte en douceur - sans douleur, sans rougeur. Ma peau est incroyablement douce depuis. Je ne comprends pas pourquoi je n'ai pas decouvert ce produit plus tot."),
      ('Samira K.', 5, 'Mars 2026', "Certifie OEKO TEX, soie de murier veritable - on sent la qualite des le premier contact. Le gommage est parfait, ni trop agressif ni insuffisant. Ma peau absorbe bien mieux la creme apres. Je l'utilise une fois par semaine."),
      ('Julie M.', 5, 'Janvier 2026', "J'offre ce gant a toutes mes amies. C'est vraiment le meilleur gommage que j'ai essaye. Pas de grains abrasifs, juste la soie qui fait le travail en douceur. Ma peau est plus lumineuse et les poils incarnes ont presque disparu."),
      ('Aicha B.', 4, 'Mai 2026', "J'ai commande le gant corps mais il m'est arrive legerement humide dans le packaging. J'ai contacte ALYA & CO. qui m'ont envoye un nouveau gant le lendemain sans poser de questions. Ce genre de SAV, c'est rare. Le gant est parfait."),
      ('Charlotte R.', 5, 'Avril 2026', "J'avais des zones rugueuses sur les coudes et sous les bras que rien n'arrivait a adoucir. Depuis 3 semaines avec le gant soie, la peau est lisse et douce. Resultat bluffant. La qualite de la soie est vraiment premium."),
    ]
  },
  'gant-visage': {
    'avg': '4,9', 'count': '84 avis',
    'items': [
      ('Emma P.', 5, 'Mai 2026', "Ce gant est une revelation pour ma peau sensible. J'avais essaye des gommages classiques qui me laissaient rouge et irritee. Avec le gant soie, rien de tout ca - ma peau est douce et lumineuse sans aucune irritation. Je l'utilise deux fois par semaine."),
      ('Nour A.', 5, 'Mars 2026', "Je n'aurais jamais pense qu'un gant pouvait faire une telle difference sur le visage. Mes pores semblent moins visibles, ma peau est plus lisse et le maquillage tient bien mieux depuis. Je ne jure plus que par ce produit."),
      ('Mathilde G.', 5, 'Fevrier 2026', "Je l'utilise apres un bain chaud, le resultat est extraordinaire. La soie est tellement douce que je ne ressens aucune irritation meme sur mes zones sensibles. Ma peau brille de sante."),
      ('Hana S.', 4, 'Avril 2026', "Premiere commande, j'avais une question sur la taille du gant avant d'acheter. Le service client m'a repondu en quelques heures avec tous les details et des conseils d'utilisation. Le gant est parfait pour le visage, tres delicat et efficace."),
    ]
  },
  'pack-siwak-complet': {
    'avg': '4,8', 'count': '52 avis',
    'items': [
      ('Vincent M.', 5, 'Avril 2026', "Le pack complet est vraiment le meilleur moyen de demarrer avec Siwak. Tout est inclus, c'est economique, et la qualite est au rendez-vous. Ma femme a commence a l'utiliser aussi apres avoir vu mes resultats. On est convertis !"),
      ('Leila S.', 5, 'Mars 2026', "Je voulais essayer le Siwak depuis longtemps. Ce pack etait parfait pour commencer - brosse + tetes + dentifrice, tout pour demarrer. Resultats visibles en 3 semaines. Dents plus blanches, gencives en bien meilleure sante."),
      ('Marie-Claire D.', 5, 'Janvier 2026', "Cadeau pour mon mari qui avait des problemes de gencives. En moins d'un mois, elles saignent beaucoup moins. On est vraiment surpris par l'efficacite. On va commander le pack dentifrice 3 mois en plus."),
      ('Ali K.', 4, 'Mai 2026', "J'avais recu un pack sans le dentifrice. Apres un email au SAV, ils ont reexpedie le dentifrice le jour meme et m'ont offert des tetes-recharges supplementaires. Je suis bluff par la reactivite. Le pack vaut vraiment son prix."),
    ]
  },
  'pack-1an-full-body': {
    'avg': '4,9', 'count': '67 avis',
    'items': [
      ('Melissa V.', 5, 'Mars 2026', "Le meilleur investissement beaute de l'annee ! Corps + visage, parfaitement pense. En quelques semaines ma peau est totalement transformee. Je fais ca le dimanche soir, c'est devenu mon rituel bien-etre. Les meilleurs gants que j'ai utilises."),
      ('Sandra B.', 5, 'Fevrier 2026', "J'hesitais entre les deux gants separement ou le pack. J'ai bien fait de prendre le pack - corps et visage, c'est complementaire et le prix est imbattable. Ma peau n'a jamais ete aussi belle."),
      ('Karima M.', 5, 'Avril 2026', "Cadeau parfait - j'en ai pris un pour moi et un pour ma mere. On est toutes les deux conquises. La qualite de la soie est visible, les certifications OEKO TEX rassurent vraiment."),
      ('Oceane L.', 4, 'Mai 2026', "Le colis avait ete un peu abime par le transporteur a la livraison. Les gants etaient en parfait etat a l'interieur. J'ai quand meme signale ca a ALYA & CO. qui ont offert un code de reduction pour ma prochaine commande. Service client vraiment au top !"),
    ]
  },
  'pack-tetes-x3': {
    'avg': '4,8', 'count': '29 avis',
    'items': [
      ('Aurelie F.', 5, 'Avril 2026', "J'achete ce pack regulierement pour avoir du stock d'avance. La qualite est constante, les boites bien emballees, la livraison rapide. Le meilleur rapport qualite/prix pour les tetes-recharges Siwak."),
      ('Brahim T.', 5, 'Mars 2026', "Je commande ce pack depuis plusieurs mois. Les tetes sont parfaites, se montent facilement sur la brosse. Le bois de Siwak est vraiment efficace - mes dents n'ont jamais ete aussi blanches avec un brossage aussi naturel."),
      ('Chloe M.', 4, 'Mai 2026', "Petite erreur dans la preparation de ma commande - une boite sur trois manquait. Le SAV a immediatement reexpedie et offert en plus une boite gratuite en geste commercial. Tres touchee par cette attention. Le produit est excellent."),
    ]
  },
  'pack-dentifrice-3m': {
    'avg': '4,8', 'count': '22 avis',
    'items': [
      ('Margot L.', 5, 'Avril 2026', "Le pack 3 mois est vraiment economique. Le dentifrice en poudre est une vraie revelation - mes dents sont plus blanches en 2 semaines. Sans fluor, sans sulfates, sans mauvaise conscience. Je ne reviendrai jamais au dentifrice classique."),
      ('Youssef B.', 5, 'Mars 2026', "3 pots pour 3 mois d'hygiene bucco-dentaire naturelle. Le rapport qualite/prix est excellent. Effet blanchissant visible, haleine fraiche toute la matinee. Je recommande vraiment."),
      ('Laure D.', 4, 'Mai 2026', "J'ai eu une confusion a la commande - recu le pack tetes au lieu du pack dentifrice. Un email au SAV et tout a ete arrange en 24h avec un envoi prioritaire. Tres satisfaite de la reactivite. Le dentifrice est top !"),
    ]
  },
  'chouchou-soie': {
    'avg': '4,8', 'count': '41 avis',
    'items': [
      ('Ines B.', 5, 'Mai 2026', "Un accessoire qu'on ne pensait pas indispensable mais qu'on ne peut plus lacher ! La soie est tellement douce sur les cheveux - fini les marques et les noeuds au reveil. J'en ai commande 3 pour en avoir partout."),
      ('Priya M.', 5, 'Mars 2026', "Je l'utilise la nuit pour attacher mes cheveux. Depuis, beaucoup moins de casse et de frisottis. La qualite de la soie est vraiment la, rien a voir avec les chouchous elastiques classiques. Petit prix pour un grand benefice !"),
      ('Lucie F.', 5, 'Fevrier 2026', "Parfait pour les cheveux colores et fragiles comme les miens. Depuis ce chouchou soie, mes cheveux cassent beaucoup moins. Un vrai plus dans ma routine capillaire. Je le recommande a toutes !"),
      ('Zara K.', 4, 'Avril 2026', "J'avais commande 2 chouchous et un seul etait dans le colis. Le service client a arrange ca immediatement, expedie le lendemain avec un petit mot sympa. Vraiment appreciable comme reactivite."),
    ]
  },
}

def stars_html(n):
    return chr(9733) * n + chr(9734) * (5 - n)

def initials(name):
    parts = name.split()
    return parts[0][0] + (parts[1][0] if len(parts) > 1 else '')

def make_reviews_html(product_id):
    data = REVIEWS[product_id]
    items_html = ''
    for name, stars, date, text in data['items']:
        inits = initials(name)
        items_html += f'''
    <div class="review-card reveal">
      <div class="review-top">
        <div class="review-avatar">{inits}</div>
        <div class="review-meta">
          <div class="review-name">{name}</div>
          <div class="review-date">{date}</div>
        </div>
        <div class="review-stars">{stars_html(stars)}</div>
      </div>
      <div class="review-verified">Achat verifie</div>
      <div class="review-text">{text}</div>
    </div>'''

    return f'''
<section class="reviews-section">
  <div class="reviews-header">
    <div class="reviews-eyebrow">Temoignages clients</div>
    <h2 class="reviews-title">Ils ont adopte<br><em>la routine naturelle</em></h2>
    <div class="reviews-avg">
      <span class="reviews-avg-score">{data['avg']}</span>
      <span class="reviews-avg-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
      <span class="reviews-avg-count">sur {data['count']}</span>
    </div>
  </div>
  <div class="reviews-grid">{items_html}
  </div>
</section>'''

product_files = {
    'brosse-siwak':      'produits/brosse-siwak.html',
    'tetes-recharges':   'produits/tetes-recharges.html',
    'dentifrice-siwak':  'produits/dentifrice-siwak.html',
    'gant-corps':        'produits/gant-corps.html',
    'gant-visage':       'produits/gant-visage.html',
    'pack-siwak-complet':'produits/pack-siwak-complet.html',
    'pack-1an-full-body':'produits/pack-1an-full-body.html',
    'pack-tetes-x3':     'produits/pack-tetes-x3.html',
    'pack-dentifrice-3m':'produits/pack-dentifrice-3m.html',
    'chouchou-soie':     'produits/chouchou-soie.html',
}

updated = []
for pid, fpath in product_files.items():
    content = open(fpath, encoding='utf-8').read()
    if 'reviews-section' in content:
        print(f'SKIP {fpath} (already has reviews)')
        continue
    content = content.replace('</style>', REVIEWS_CSS + '</style>', 1)
    reviews_html = make_reviews_html(pid)
    content = content.replace('<footer', reviews_html + '\n<footer', 1)
    open(fpath, 'w', encoding='utf-8').write(content)
    updated.append(fpath)
    print(f'OK {fpath}')

print(f'Done: {len(updated)} files updated')
