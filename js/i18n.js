/* ================================================================
   ALYA & CO. — Système multilingue
   Langues : FR (défaut) | EN | NL | IT | PT | ES | DE
   Architecture : sélecteur dans la nav + localStorage + rechargement
   ================================================================ */
(function () {
  'use strict';

  var LANG_LABELS = { fr:'Français', en:'English', nl:'Nederlands', it:'Italiano', pt:'Português', es:'Español', de:'Deutsch' };
  var LANG_FLAGS  = { fr:'🇫🇷', en:'🇬🇧', nl:'🇳🇱', it:'🇮🇹', pt:'🇵🇹', es:'🇪🇸', de:'🇩🇪' };

  /* ── HELPERS ── */
  function getLang()  { return localStorage.getItem('alya_lang') || 'fr'; }
  function setLang(l) { localStorage.setItem('alya_lang', l); location.reload(); }
  function qs(s)   { return document.querySelector(s); }
  function qsa(s)  { return document.querySelectorAll(s); }
  function set(sel, text, asHtml) {
    var e = qs(sel); if (!e) return;
    if (asHtml) e.innerHTML = text; else e.textContent = text;
  }
  function setAll(sel, text) { qsa(sel).forEach(function(e){ e.textContent = text; }); }
  function replaceTextNode(el, search, replacement) {
    if (!el) return;
    el.childNodes.forEach(function(n){
      if (n.nodeType === 3 && n.textContent.indexOf(search) !== -1)
        n.textContent = n.textContent.replace(search, replacement);
    });
  }
  function getPageId() {
    var p = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    var parts = p.split('/').filter(Boolean);
    if (!parts.length || parts[parts.length-1] === 'index') return 'home';
    return parts[parts.length-1];
  }

  /* ================================================================
     TRANSLATIONS
     ================================================================ */
  var T = {

    /* ── ENGLISH ── */
    en: {
      announce: [
        'Free Mondial Relay 72h delivery from €45*',
        '100% Natural · Organic · Eco-Friendly',
        'OEKO TEX® Standard 100 Certified',
        'Over 500 reviews ⭐ 4.8/5'
      ],
      nav_home:'Home', nav_siwak:'Siwak Toothbrush', nav_gants:'Exfoliating Gloves',
      nav_packs:'Our Bundles', nav_histoire:'Our Story', nav_blog:'Blog',
      nav_contact:'Contact', nav_cart:'Cart',
      footer_products:'Products', footer_info:'Information', footer_contact_col:'Contact',
      footer_tagline:'"Wellness, satisfaction, smile."<br>Your natural beauty, our passion.',
      footer_copy:'© 2025 ALYA & CO. All rights reserved.',
      footer_brosse:'Rechargeable Siwak Toothbrush', footer_tetes:'Siwak Replacement Heads',
      footer_dent:'Siwak Powder Toothpaste', footer_gc:'Body Exfoliating Glove',
      footer_gv:'Face Exfoliating Glove', footer_pack1an:'1 Year Full Body Bundle',
      footer_histoire:'Our Story', footer_faq:'FAQ', footer_nous:'Contact Us',
      footer_livraison:'Shipping', footer_blog:'Blog & Tips', footer_cgv:'T&Cs',
      footer_mentions:'Legal Notice', footer_response:'Reply within 24h<br>Monday to Friday',
      footer_legal_cgv:'T&Cs', footer_legal_conf:'Privacy', footer_legal_mentions:'Legal Notice',
      btn_atc:'Add to Cart', btn_back:'← Back to Collection', verified:'Verified Purchase',
      hero_badge:'Natural Beauty · Pure · Eco',
      hero_sub:'Natural skincare that respects your skin and our planet. Ancestral Siwak and mulberry silk, united for your daily wellness.',
      hero_discover:'Discover', hero_story:'Our Story',
      stat_avis:'Customer Reviews', stat_note:'Average Rating', stat_naturel:'Natural',
      pages: {
        'brosse-siwak':{ eyebrow:'Siwak Collection', title:'Toothbrush<br><em>Rechargeable Siwak</em>', desc:'The first 100% natural rechargeable toothbrush. Made from Salvadora persica wood (Siwak), recognized by the WHO as superior to a conventional brush. Includes 3 biodegradable screw-on replacement heads.', bullets:['Naturally antibacterial — no chemicals','Whitening without harsh chemicals','Biodegradable — zero plastic waste','Suitable for the whole family','Mondial Relay 72h delivery'] },
        'tetes-recharges':{ eyebrow:'Siwak Collection', title:'Replacement Heads<br><em>Siwak</em>', desc:'Pack of 3 100% natural replacement heads made from Siwak wood (Salvadora persica). Compatible exclusively with the ALYA & CO. toothbrush. Biodegradable, zero plastic waste — replace only the head every 3 months.', bullets:['100% natural — Salvadora persica wood','Biodegradable — zero plastic','Compatible with ALYA & CO. brush','Pack of 3 heads (9 months of use)','Mondial Relay 72h delivery'] },
        'dentifrice-siwak':{ eyebrow:'Siwak Collection', title:'Siwak Toothpaste<br><em>in Powder</em>', desc:'Organic powder toothpaste, fluoride-free, sulfate-free, preservative-free. Based on natural Siwak extract (Salvadora persica). Natural whitening visible from 2 weeks of regular use. 100% natural, organic certified.', bullets:['Organic certified — no synthetic additives','Fluoride-free · Sulfate-free · Preservative-free','Natural whitening from 2 weeks','Pure antibacterial Siwak extract','Mondial Relay 72h delivery'] },
        'pack-siwak-complet':{ eyebrow:'Our Bundles — Bestseller', title:'Complete Siwak<br><em>Toothbrush Bundle</em>', desc:'The complete kit to start your natural oral hygiene. Everything you need, bundled together at a great price. Save 30% compared to buying the products separately.', bullets:['Save 30% vs separate purchase (value €25.97)','All included — ideal to start with Siwak','Perfect natural eco-friendly gift','Mondial Relay 72h delivery'] },
        'gant-corps':{ eyebrow:'Gloves Collection · OEKO TEX®', title:'Body Exfoliating Glove<br><em>Mulberry Silk</em>', desc:'The world\'s most effective exfoliating glove. In pure mulberry silk, OEKO TEX® Standard 100 certified. Eliminates 100% of dead cells in one pass. No chemicals, just warm water.', bullets:['Pure mulberry silk — the softest in the world','OEKO TEX® Standard 100 Certified','100% dead cells eliminated from the 1st use','Hypoallergenic — all skin types, including sensitive','No chemicals — just warm water','Mondial Relay 72h delivery'] },
        'gant-visage':{ eyebrow:'Gloves Collection · OEKO TEX®', title:'Face Exfoliating Glove<br><em>Mulberry Silk</em>', desc:'Specially designed for the delicate skin of the face. In pure mulberry silk, ultra-soft and hypoallergenic. OEKO TEX® certified. Effective against acne, blackheads and dull skin — without any harsh chemicals.', bullets:['Ultra-soft mulberry silk — for the face','Hypoallergenic — sensitive and acne-prone skin','OEKO TEX® Standard 100 Certified','Effective against acne and blackheads','No chemicals — lukewarm water only','Mondial Relay 72h delivery'] },
        'pack-1an-full-body':{ eyebrow:'Our Bundles — Bestseller', title:'Full Year<br><em>Full Body Bundle</em>', desc:'The complete solution for perfect skin all year long. Body and face, everything is covered. ALYA & CO.\'s most popular bundle — save almost 50% compared to buying separately.', bullets:['Save 48% vs separate purchase (value €57.98)','Body + face — complete beauty routine','Both OEKO TEX® Standard 100 certified','Visible results from the 1st use','Mondial Relay 72h delivery'] },
        'chouchou-soie':{ eyebrow:'Gloves Collection · Accessories', title:'Silk Hair Tie<br><em>Perfect Hold — Silk</em>', desc:'Hair tie in pure mulberry silk. Protects your hair, prevents breakage, knots and frizz. Perfect hold all day. Gentle on your hair, resistant to wear, elegant every day.', bullets:['Pure mulberry silk — the softest','Protects against breakage and knots','Reduces frizz and static electricity','Durable — resistant to daily wear','Elegant — premium finish','Mondial Relay 72h delivery'] },
        'pack-dentifrice-3m':{ eyebrow:'Our Bundles — Siwak', title:'3-Month Toothpaste Bundle<br><em>Siwak Powder</em>', desc:'Three months of natural whitening with 3 jars of organic Siwak powder toothpaste. Fluoride-free, SLS-free, paraben-free. The healthy and natural dental routine, stocked for the whole season.', bullets:['3 jars = approx. 3 months of use','Natural whitening visible from 2 weeks','Naturally antibacterial thanks to Siwak','Fluoride-free, SLS-free, paraben-free','Mondial Relay 72h delivery'] },
        'pack-tetes-x3':{ eyebrow:'Our Bundles — Siwak', title:'Replacement Heads Bundle<br><em>Organic Siwak X3</em>', desc:'18 organic Siwak replacement heads for months of natural oral hygiene. 100% biodegradable, easily screwed onto your rechargeable Siwak toothbrush. Save 33% vs buying individually.', bullets:['18 heads = over 18 months of hygiene','Organic Siwak, authentic 100% natural Arak wood','Biodegradable — zero plastic','Compatible with the rechargeable Siwak brush','Mondial Relay 72h delivery'] }
      }
    },

    /* ── DUTCH ── */
    nl: {
      announce: [
        'Gratis Mondial Relay 72h levering vanaf €45*',
        '100% Natuurlijk · Biologisch · Milieuvriendelijk',
        'OEKO TEX® Standaard 100 Gecertificeerd',
        'Meer dan 500 reviews ⭐ 4,8/5'
      ],
      nav_home:'Startpagina', nav_siwak:'Siwak Tandenborstel', nav_gants:'Exfoliërende Handschoenen',
      nav_packs:'Onze Pakketten', nav_histoire:'Ons Verhaal', nav_blog:'Blog',
      nav_contact:'Contact', nav_cart:'Winkelwagen',
      footer_products:'Producten', footer_info:'Informatie', footer_contact_col:'Contact',
      footer_tagline:'"Welzijn, tevredenheid, glimlach."<br>Jouw natuurlijke schoonheid, onze passie.',
      footer_copy:'© 2025 ALYA & CO. Alle rechten voorbehouden.',
      footer_brosse:'Oplaadbare Siwak Tandenborstel', footer_tetes:'Siwak Vervangende Koppen',
      footer_dent:'Siwak Tandpasta in Poedervorm', footer_gc:'Lichaam Exfoliërende Handschoen',
      footer_gv:'Gezicht Exfoliërende Handschoen', footer_pack1an:'1 Jaar Full Body Pakket',
      footer_histoire:'Ons Verhaal', footer_faq:'FAQ', footer_nous:'Neem Contact Op',
      footer_livraison:'Verzending', footer_blog:'Blog & Tips', footer_cgv:'Algemene Voorwaarden',
      footer_mentions:'Juridische Kennisgeving', footer_response:'Reactie binnen 24u<br>Maandag t/m vrijdag',
      footer_legal_cgv:'Algemene Voorwaarden', footer_legal_conf:'Privacy', footer_legal_mentions:'Juridische Kennisgeving',
      btn_atc:'Toevoegen aan winkelwagen', btn_back:'← Terug naar collectie', verified:'Geverifieerde aankoop',
      hero_badge:'Natuurlijke Schoonheid · Puur · Eco',
      hero_sub:'Natuurlijke huidverzorging die uw huid en onze planeet respecteert. Ancestrale Siwak en moerbeizijde, verenigd voor uw dagelijks welzijn.',
      hero_discover:'Ontdekken', hero_story:'Ons Verhaal',
      stat_avis:'Klantbeoordelingen', stat_note:'Gemiddelde beoordeling', stat_naturel:'Natuurlijk',
      pages: {
        'brosse-siwak':{ eyebrow:'Siwak Collectie', title:'Tandenborstel<br><em>Oplaadbare Siwak</em>', desc:'De eerste 100% natuurlijke oplaadbare tandenborstel. Gemaakt van Salvadora persica-hout (Siwak), erkend door de WHO als superieur aan een gewone borstel. Inclusief 3 biologisch afbreekbare schroefbare vervangende koppen.', bullets:['Natuurlijk antibacterieel — geen chemicaliën','Blekend zonder agressieve chemicaliën','Biologisch afbreekbaar — nul plastic afval','Geschikt voor het hele gezin','Mondial Relay 72h levering'] },
        'tetes-recharges':{ eyebrow:'Siwak Collectie', title:'Vervangende Koppen<br><em>Siwak</em>', desc:'Pak van 3 100% natuurlijke vervangende koppen in Siwak-hout (Salvadora persica). Exclusief compatibel met de ALYA & CO. tandenborstel. Biologisch afbreekbaar, nul plastic afval — vervang alleen de kop elke 3 maanden.', bullets:['100% natuurlijk — Salvadora persica-hout','Biologisch afbreekbaar — nul plastic','Compatibel met ALYA & CO. borstel','Pak van 3 koppen (9 maanden gebruik)','Mondial Relay 72h levering'] },
        'dentifrice-siwak':{ eyebrow:'Siwak Collectie', title:'Siwak Tandpasta<br><em>in Poedervorm</em>', desc:'Biologische tandpasta in poedervorm, fluoridevrij, sulfaatvrij, conserveermiddelvrij. Op basis van natuurlijk Siwak-extract (Salvadora persica). Natuurlijke blekende werking zichtbaar na 2 weken regelmatig gebruik. 100% natuurlijk, biologisch gecertificeerd.', bullets:['Biologisch gecertificeerd — geen synthetische additieven','Fluoridevrij · Sulfaatvrij · Conserveermiddelvrij','Natuurlijke blekende werking na 2 weken','Puur antibacterieel Siwak-extract','Mondial Relay 72h levering'] },
        'pack-siwak-complet':{ eyebrow:'Onze Pakketten — Bestseller', title:'Compleet Siwak<br><em>Tandenborstel Pakket</em>', desc:'De complete kit om te beginnen met uw natuurlijke mondhygiëne. Alles wat u nodig heeft, gebundeld tegen een geweldige prijs. Bespaar 30% ten opzichte van apart kopen.', bullets:['Bespaar 30% vs apart kopen (waarde €25,97)','Alles inbegrepen — ideaal om te starten met Siwak','Perfect natuurlijk eco-vriendelijk cadeau','Mondial Relay 72h levering'] },
        'gant-corps':{ eyebrow:'Handschoen Collectie · OEKO TEX®', title:'Lichaam Exfoliërende Handschoen<br><em>Moerbeizijde</em>', desc:'De meest effectieve exfoliërende handschoen ter wereld. Van pure moerbeizijde, OEKO TEX® Standaard 100 gecertificeerd. Elimineert 100% van dode huidcellen in één beweging. Geen chemicaliën, alleen warm water.', bullets:['Pure moerbeizijde — de zachtste ter wereld','OEKO TEX® Standaard 100 Gecertificeerd','100% dode huidcellen geëlimineerd vanaf het 1e gebruik','Hypoallergeen — alle huidtypes, ook gevoelig','Geen chemicaliën — alleen warm water','Mondial Relay 72h levering'] },
        'gant-visage':{ eyebrow:'Handschoen Collectie · OEKO TEX®', title:'Gezicht Exfoliërende Handschoen<br><em>Moerbeizijde</em>', desc:'Speciaal ontworpen voor de gevoelige huid van het gezicht. Van pure moerbeizijde, ultra-zacht en hypoallergeen. OEKO TEX® gecertificeerd. Effectief tegen acne, mee-eters en een vale huid — zonder agressieve chemicaliën.', bullets:['Ultra-zachte moerbeizijde — speciaal voor het gezicht','Hypoallergeen — gevoelige en acne-gevoelige huid','OEKO TEX® Standaard 100 Gecertificeerd','Effectief tegen acne en mee-eters','Geen chemicaliën — alleen lauw water','Mondial Relay 72h levering'] },
        'pack-1an-full-body':{ eyebrow:'Onze Pakketten — Bestseller', title:'Volledig Jaar<br><em>Full Body Pakket</em>', desc:'De complete oplossing voor een perfecte huid het hele jaar door. Lichaam en gezicht, alles is gedekt. Het populairste pakket van ALYA & CO. — bespaar bijna 50% ten opzichte van apart kopen.', bullets:['Bespaar 48% vs apart kopen (waarde €57,98)','Lichaam + gezicht — complete schoonheidsroutine','Beide OEKO TEX® Standaard 100 gecertificeerd','Zichtbare resultaten al bij het 1e gebruik','Mondial Relay 72h levering'] },
        'chouchou-soie':{ eyebrow:'Handschoen Collectie · Accessoires', title:'Zijden Haarelastiek<br><em>Perfecte Grip — Zijde</em>', desc:'Haarelastiek in pure moerbeizijde. Beschermt je haar, voorkomt breuk, klitten en kroezen. Perfecte grip de hele dag. Zacht voor je haar, slijtvast, elegant elke dag.', bullets:['Pure moerbeizijde — de zachtste','Beschermt tegen breuk en klitten','Vermindert kroezen en statische elektriciteit','Duurzaam — slijtvast bij dagelijks gebruik','Elegant — premium afwerking','Mondial Relay 72h levering'] },
        'pack-dentifrice-3m':{ eyebrow:'Onze Pakketten — Siwak', title:'3-Maanden Tandpasta Pakket<br><em>Siwak Poeder</em>', desc:'Drie maanden natuurlijke blekende werking met 3 potten biologische Siwak-tandpasta in poedervorm. Fluoridevrij, SLS-vrij, parabeenvrij. De gezonde en natuurlijke tandroutine, voor het hele seizoen op voorraad.', bullets:['3 potten = ca. 3 maanden gebruik','Natuurlijke blekende werking zichtbaar na 2 weken','Natuurlijk antibacterieel dankzij Siwak','Fluoridevrij, SLS-vrij, parabeenvrij','Mondial Relay 72h levering'] },
        'pack-tetes-x3':{ eyebrow:'Onze Pakketten — Siwak', title:'Vervangende Koppen Pakket<br><em>Biologische Siwak X3</em>', desc:'18 biologische Siwak-vervangende koppen voor maanden natuurlijke mondhygiëne. 100% biologisch afbreekbaar, eenvoudig op uw oplaadbare Siwak-tandenborstel geschroefd. Bespaar 33% vs losse aankoop.', bullets:['18 koppen = meer dan 18 maanden hygiëne','Biologische Siwak, authentiek 100% natuurlijk Arak-hout','Biologisch afbreekbaar — nul plastic','Compatibel met de oplaadbare Siwak-borstel','Mondial Relay 72h levering'] }
      }
    },

    /* ── ITALIAN ── */
    it: {
      announce: [
        'Consegna gratuita Mondial Relay 72h da €45*',
        '100% Naturale · Bio · Ecologico',
        'Certificato OEKO TEX® Standard 100',
        'Più di 500 recensioni ⭐ 4,8/5'
      ],
      nav_home:'Home', nav_siwak:'Spazzolino Siwak', nav_gants:'Guanti Esfolianti',
      nav_packs:'I Nostri Pack', nav_histoire:'La Nostra Storia', nav_blog:'Blog',
      nav_contact:'Contatti', nav_cart:'Carrello',
      footer_products:'Prodotti', footer_info:'Informazioni', footer_contact_col:'Contatti',
      footer_tagline:'"Benessere, soddisfazione, sorriso."<br>La tua bellezza naturale, la nostra passione.',
      footer_copy:'© 2025 ALYA & CO. Tutti i diritti riservati.',
      footer_brosse:'Spazzolino Siwak Ricaricabile', footer_tetes:'Testine di Ricambio Siwak',
      footer_dent:'Dentifricio Siwak in Polvere', footer_gc:'Guanto Esfoliante Corpo',
      footer_gv:'Guanto Esfoliante Viso', footer_pack1an:'Kit Full Body 1 Anno',
      footer_histoire:'La Nostra Storia', footer_faq:'FAQ', footer_nous:'Contattaci',
      footer_livraison:'Spedizione', footer_blog:'Blog & Consigli', footer_cgv:'Termini e Condizioni',
      footer_mentions:'Note Legali', footer_response:'Risposta entro 24h<br>Da lunedì a venerdì',
      footer_legal_cgv:'Termini e Condizioni', footer_legal_conf:'Privacy', footer_legal_mentions:'Note Legali',
      btn_atc:'Aggiungi al carrello', btn_back:'← Torna alla collezione', verified:'Acquisto verificato',
      hero_badge:'Bellezza Naturale · Pura · Eco',
      hero_sub:'Cosmetici naturali che rispettano la tua pelle e il nostro pianeta. Siwak ancestrale e seta di gelso, uniti per il tuo benessere quotidiano.',
      hero_discover:'Scopri', hero_story:'La Nostra Storia',
      stat_avis:'Recensioni clienti', stat_note:'Valutazione media', stat_naturel:'Naturale',
      pages: {
        'brosse-siwak':{ eyebrow:'Collezione Siwak', title:'Spazzolino<br><em>Siwak Ricaricabile</em>', desc:'Il primo spazzolino ricaricabile 100% naturale. Realizzato in legno di Salvadora persica (Siwak), riconosciuto dall\'OMS come superiore a uno spazzolino classico. Include 3 testine biodegradabili a vite.', bullets:['Naturalmente antibatterico — nessun prodotto chimico','Sbiancante senza agenti chimici aggressivi','Biodegradabile — zero rifiuti plastici','Adatto a tutta la famiglia','Consegna Mondial Relay 72h'] },
        'tetes-recharges':{ eyebrow:'Collezione Siwak', title:'Testine di Ricambio<br><em>Siwak</em>', desc:'Confezione di 3 testine di ricambio 100% naturali in legno di Siwak (Salvadora persica). Compatibili esclusivamente con lo spazzolino ALYA & CO. Biodegradabili, zero rifiuti plastici — sostituire solo la testina ogni 3 mesi.', bullets:['100% naturale — legno di Salvadora persica','Biodegradabile — zero plastica','Compatibile con lo spazzolino ALYA & CO.','Confezione da 3 testine (9 mesi di uso)','Consegna Mondial Relay 72h'] },
        'dentifrice-siwak':{ eyebrow:'Collezione Siwak', title:'Dentifricio Siwak<br><em>in Polvere</em>', desc:'Dentifricio in polvere biologico, senza fluoro, senza solfati, senza conservanti. A base di estratto naturale di Siwak (Salvadora persica). Sbiancatura naturale visibile dopo 2 settimane di utilizzo regolare. 100% naturale, certificato bio.', bullets:['Certificato biologico — nessun additivo sintetico','Senza fluoro · Senza solfati · Senza conservanti','Sbiancatura naturale dopo 2 settimane','Estratto puro di Siwak antibatterico','Consegna Mondial Relay 72h'] },
        'pack-siwak-complet':{ eyebrow:'I Nostri Pack — Bestseller', title:'Kit Completo<br><em>Spazzolino Siwak</em>', desc:'Il kit completo per iniziare la tua igiene orale naturale. Tutto ciò di cui hai bisogno, raggruppato in un unico pack conveniente. Risparmia il 30% rispetto all\'acquisto separato.', bullets:['Risparmia il 30% vs acquisto separato (valore €25,97)','Tutto incluso — ideale per iniziare con il Siwak','Perfetto regalo naturale ed eco-responsabile','Consegna Mondial Relay 72h'] },
        'gant-corps':{ eyebrow:'Collezione Guanti · OEKO TEX®', title:'Guanto Esfoliante Corpo<br><em>Seta di Gelso</em>', desc:'Il guanto esfoliante più efficace al mondo. In pura seta di gelso, certificato OEKO TEX® Standard 100. Elimina il 100% delle cellule morte in un solo passaggio. Nessun prodotto chimico, solo acqua calda.', bullets:['Pura seta di gelso — la più morbida al mondo','Certificato OEKO TEX® Standard 100','100% cellule morte eliminate dal 1° utilizzo','Ipoallergenico — tutti i tipi di pelle, anche sensibile','Nessun prodotto chimico — solo acqua calda','Consegna Mondial Relay 72h'] },
        'gant-visage':{ eyebrow:'Collezione Guanti · OEKO TEX®', title:'Guanto Esfoliante Viso<br><em>Seta di Gelso</em>', desc:'Appositamente progettato per la pelle delicata del viso. In pura seta di gelso, ultra-morbido e ipoallergenico. Certificato OEKO TEX®. Efficace contro l\'acne, i punti neri e la pelle spenta — senza prodotti chimici aggressivi.', bullets:['Seta di gelso ultra-morbida — speciale per il viso','Ipoallergenico — pelle sensibile e con acne','Certificato OEKO TEX® Standard 100','Efficace contro l\'acne e i punti neri','Nessun prodotto chimico — solo acqua tiepida','Consegna Mondial Relay 72h'] },
        'pack-1an-full-body':{ eyebrow:'I Nostri Pack — Bestseller', title:'Un Anno Intero<br><em>Full Body</em>', desc:'La soluzione completa per una pelle perfetta tutto l\'anno. Corpo e viso, tutto è coperto. Il pack più popolare di ALYA & CO. — risparmia quasi il 50% rispetto all\'acquisto separato.', bullets:['Risparmia il 48% vs acquisto separato (valore €57,98)','Corpo + viso — routine di bellezza completa','Entrambi certificati OEKO TEX® Standard 100','Risultati visibili già dal 1° utilizzo','Consegna Mondial Relay 72h'] },
        'chouchou-soie':{ eyebrow:'Collezione Guanti · Accessori', title:'Elastico per Capelli<br><em>Tenuta Perfetta — Seta</em>', desc:'Elastico in pura seta di gelso. Protegge i capelli, evita rotture, nodi e crespo. Tenuta perfetta per tutta la giornata. Delicato sui capelli, resistente all\'usura, elegante ogni giorno.', bullets:['Pura seta di gelso — la più morbida','Protegge da rotture e nodi','Riduce il crespo e l\'elettricità statica','Durevole — resistente all\'uso quotidiano','Elegante — rifinitura premium','Consegna Mondial Relay 72h'] },
        'pack-dentifrice-3m':{ eyebrow:'I Nostri Pack — Siwak', title:'Kit Dentifricio 3 Mesi<br><em>Siwak in Polvere</em>', desc:'Tre mesi di sbiancatura naturale con 3 barattoli di dentifricio biologico in polvere al Siwak. Senza fluoro, senza SLS, senza parabeni. La routine dentale sana e naturale, con scorta per tutta la stagione.', bullets:['3 barattoli = circa 3 mesi di utilizzo','Sbiancatura naturale visibile dopo 2 settimane','Naturalmente antibatterico grazie al Siwak','Senza fluoro, senza SLS, senza parabeni','Consegna Mondial Relay 72h'] },
        'pack-tetes-x3':{ eyebrow:'I Nostri Pack — Siwak', title:'Kit Testine di Ricambio<br><em>Siwak Bio X3</em>', desc:'18 testine di ricambio in Siwak biologico per mesi di igiene orale naturale. 100% biodegradabili, da avvitare facilmente sul tuo spazzolino Siwak ricaricabile. Risparmia il 33% vs acquisto unitario.', bullets:['18 testine = oltre 18 mesi di igiene','Siwak biologico, legno Arak autentico 100% naturale','Biodegradabile — zero plastica','Compatibile con lo spazzolino Siwak ricaricabile','Consegna Mondial Relay 72h'] }
      }
    },

    /* ── PORTUGUESE ── */
    pt: {
      announce: [
        'Entrega gratuita Mondial Relay 72h a partir de €45*',
        '100% Natural · Bio · Eco-Responsável',
        'Certificado OEKO TEX® Standard 100',
        'Mais de 500 avaliações ⭐ 4,8/5'
      ],
      nav_home:'Início', nav_siwak:'Escova Siwak', nav_gants:'Luvas Esfoliantes',
      nav_packs:'Nossos Packs', nav_histoire:'Nossa História', nav_blog:'Blog',
      nav_contact:'Contato', nav_cart:'Carrinho',
      footer_products:'Produtos', footer_info:'Informações', footer_contact_col:'Contato',
      footer_tagline:'"Bem-estar, satisfação, sorriso."<br>Sua beleza natural, nossa paixão.',
      footer_copy:'© 2025 ALYA & CO. Todos os direitos reservados.',
      footer_brosse:'Escova de Dentes Siwak Recarregável', footer_tetes:'Cabeças de Reposição Siwak',
      footer_dent:'Pasta de Dentes Siwak em Pó', footer_gc:'Luva Esfoliante para o Corpo',
      footer_gv:'Luva Esfoliante para o Rosto', footer_pack1an:'Pack Full Body 1 Ano',
      footer_histoire:'Nossa História', footer_faq:'FAQ', footer_nous:'Contacte-nos',
      footer_livraison:'Envio', footer_blog:'Blog & Dicas', footer_cgv:'Termos e Condições',
      footer_mentions:'Avisos Legais', footer_response:'Resposta em 24h<br>De segunda a sexta',
      footer_legal_cgv:'Termos e Condições', footer_legal_conf:'Privacidade', footer_legal_mentions:'Avisos Legais',
      btn_atc:'Adicionar ao carrinho', btn_back:'← Voltar à coleção', verified:'Compra verificada',
      hero_badge:'Beleza Natural · Pura · Eco',
      hero_sub:'Cuidados naturais que respeitam a sua pele e o nosso planeta. Siwak ancestral e seda de amoreira, unidos para o seu bem-estar quotidiano.',
      hero_discover:'Descobrir', hero_story:'Nossa História',
      stat_avis:'Avaliações de clientes', stat_note:'Avaliação média', stat_naturel:'Natural',
      pages: {
        'brosse-siwak':{ eyebrow:'Coleção Siwak', title:'Escova de Dentes<br><em>Siwak Recarregável</em>', desc:'A primeira escova de dentes recarregável 100% natural. Feita com madeira de Salvadora persica (Siwak), reconhecida pela OMS como superior a uma escova comum. Inclui 3 cabeças de reposição biodegradáveis de encaixe.', bullets:['Naturalmente antibacteriana — sem produtos químicos','Branqueadora sem agentes químicos agressivos','Biodegradável — zero resíduos plásticos','Adequada para toda a família','Entrega Mondial Relay 72h'] },
        'tetes-recharges':{ eyebrow:'Coleção Siwak', title:'Cabeças de Reposição<br><em>Siwak</em>', desc:'Pack de 3 cabeças de reposição 100% naturais em madeira de Siwak (Salvadora persica). Compatíveis exclusivamente com a escova ALYA & CO. Biodegradáveis, zero resíduos plásticos — substitua apenas a cabeça a cada 3 meses.', bullets:['100% natural — madeira de Salvadora persica','Biodegradável — zero plástico','Compatível com a escova ALYA & CO.','Pack de 3 cabeças (9 meses de uso)','Entrega Mondial Relay 72h'] },
        'dentifrice-siwak':{ eyebrow:'Coleção Siwak', title:'Pasta de Dentes Siwak<br><em>em Pó</em>', desc:'Pasta de dentes em pó orgânica, sem flúor, sem sulfatos, sem conservantes. À base de extrato natural de Siwak (Salvadora persica). Branqueamento natural visível após 2 semanas de uso regular. 100% natural, certificada biológica.', bullets:['Certificada biológica — sem aditivos sintéticos','Sem flúor · Sem sulfatos · Sem conservantes','Branqueamento natural após 2 semanas','Extrato puro de Siwak antibacteriano','Entrega Mondial Relay 72h'] },
        'pack-siwak-complet':{ eyebrow:'Nossos Packs — Bestseller', title:'Kit Completo<br><em>Escova Siwak</em>', desc:'O kit completo para começar a sua higiene oral natural. Tudo o que precisa, reunido num único pack vantajoso. Poupe 30% em comparação com a compra separada.', bullets:['Poupe 30% vs compra separada (valor €25,97)','Tudo incluído — ideal para começar com o Siwak','Presente natural e eco-responsável perfeito','Entrega Mondial Relay 72h'] },
        'gant-corps':{ eyebrow:'Coleção Luvas · OEKO TEX®', title:'Luva Esfoliante para o Corpo<br><em>Seda de Amoreira</em>', desc:'A luva esfoliante mais eficaz do mundo. Em seda de amoreira pura, certificada OEKO TEX® Standard 100. Elimina 100% das células mortas numa só passagem. Sem produtos químicos, apenas água morna.', bullets:['Seda de amoreira pura — a mais suave do mundo','Certificada OEKO TEX® Standard 100','100% células mortas eliminadas desde o 1º uso','Hipoalergénica — todos os tipos de pele, incluindo sensível','Sem produtos químicos — apenas água morna','Entrega Mondial Relay 72h'] },
        'gant-visage':{ eyebrow:'Coleção Luvas · OEKO TEX®', title:'Luva Esfoliante para o Rosto<br><em>Seda de Amoreira</em>', desc:'Especialmente desenvolvida para a pele delicada do rosto. Em seda de amoreira pura, ultra-suave e hipoalergénica. Certificada OEKO TEX®. Eficaz contra a acne, os cravos e a pele opaca — sem produtos químicos agressivos.', bullets:['Seda de amoreira ultra-suave — especial para o rosto','Hipoalergénica — pele sensível e com tendência acneica','Certificada OEKO TEX® Standard 100','Eficaz contra a acne e os cravos','Sem produtos químicos — só água morna','Entrega Mondial Relay 72h'] },
        'pack-1an-full-body':{ eyebrow:'Nossos Packs — Bestseller', title:'Um Ano Completo<br><em>Full Body</em>', desc:'A solução completa para uma pele perfeita durante todo o ano. Corpo e rosto, tudo coberto. O pack mais popular da ALYA & CO. — poupe quase 50% em relação à compra separada.', bullets:['Poupe 48% vs compra separada (valor €57,98)','Corpo + rosto — rotina de beleza completa','Ambos certificados OEKO TEX® Standard 100','Resultados visíveis desde o 1º uso','Entrega Mondial Relay 72h'] },
        'chouchou-soie':{ eyebrow:'Coleção Luvas · Acessórios', title:'Elástico de Seda<br><em>Fixação Perfeita — Seda</em>', desc:'Elástico em seda de amoreira pura. Protege o seu cabelo, evita a quebra, os nós e o frizz. Fixação perfeita durante todo o dia. Suave para o cabelo, resistente ao desgaste, elegante no dia a dia.', bullets:['Seda de amoreira pura — a mais suave','Protege contra quebra e nós','Reduz o frizz e a eletricidade estática','Durável — resistente ao uso diário','Elegante — acabamento premium','Entrega Mondial Relay 72h'] },
        'pack-dentifrice-3m':{ eyebrow:'Nossos Packs — Siwak', title:'Pack de Pasta de Dentes 3 Meses<br><em>Siwak em Pó</em>', desc:'Três meses de branqueamento natural com 3 frascos de pasta de dentes orgânica em pó de Siwak. Sem flúor, sem SLS, sem parabenos. A rotina dental saudável e natural, com stock para toda a temporada.', bullets:['3 frascos = aprox. 3 meses de uso','Branqueamento natural visível após 2 semanas','Naturalmente antibacteriano graças ao Siwak','Sem flúor, sem SLS, sem parabenos','Entrega Mondial Relay 72h'] },
        'pack-tetes-x3':{ eyebrow:'Nossos Packs — Siwak', title:'Pack de Cabeças de Reposição<br><em>Siwak Bio X3</em>', desc:'18 cabeças de reposição de Siwak orgânico para meses de higiene oral natural. 100% biodegradáveis, facilmente encaixadas na sua escova de dentes Siwak recarregável. Poupe 33% vs compra individual.', bullets:['18 cabeças = mais de 18 meses de higiene','Siwak orgânico, madeira Arak autêntica 100% natural','Biodegradável — zero plástico','Compatível com a escova Siwak recarregável','Entrega Mondial Relay 72h'] }
      }
    },

    /* ── SPANISH ── */
    es: {
      announce: [
        'Envío gratuito Mondial Relay 72h desde €45*',
        '100% Natural · Bio · Eco-Responsable',
        'Certificado OEKO TEX® Standard 100',
        'Más de 500 reseñas ⭐ 4,8/5'
      ],
      nav_home:'Inicio', nav_siwak:'Cepillo Siwak', nav_gants:'Guantes Exfoliantes',
      nav_packs:'Nuestros Packs', nav_histoire:'Nuestra Historia', nav_blog:'Blog',
      nav_contact:'Contacto', nav_cart:'Carrito',
      footer_products:'Productos', footer_info:'Información', footer_contact_col:'Contacto',
      footer_tagline:'"Bienestar, satisfacción, sonrisa."<br>Tu belleza natural, nuestra pasión.',
      footer_copy:'© 2025 ALYA & CO. Todos los derechos reservados.',
      footer_brosse:'Cepillo de Dientes Siwak Recargable', footer_tetes:'Cabezales de Recambio Siwak',
      footer_dent:'Dentífrico Siwak en Polvo', footer_gc:'Guante Exfoliante Corporal',
      footer_gv:'Guante Exfoliante Facial', footer_pack1an:'Pack Full Body 1 Año',
      footer_histoire:'Nuestra Historia', footer_faq:'FAQ', footer_nous:'Contáctanos',
      footer_livraison:'Envío', footer_blog:'Blog & Consejos', footer_cgv:'T&C',
      footer_mentions:'Aviso Legal', footer_response:'Respuesta en 24h<br>De lunes a viernes',
      footer_legal_cgv:'T&C', footer_legal_conf:'Privacidad', footer_legal_mentions:'Aviso Legal',
      btn_atc:'Añadir al carrito', btn_back:'← Volver a la colección', verified:'Compra verificada',
      hero_badge:'Belleza Natural · Pura · Eco',
      hero_sub:'Cuidados naturales que respetan tu piel y nuestro planeta. Siwak ancestral y seda de morera, unidos para tu bienestar diario.',
      hero_discover:'Descubrir', hero_story:'Nuestra Historia',
      stat_avis:'Reseñas de clientes', stat_note:'Valoración media', stat_naturel:'Natural',
      pages: {
        'brosse-siwak':{ eyebrow:'Colección Siwak', title:'Cepillo de Dientes<br><em>Siwak Recargable</em>', desc:'El primer cepillo de dientes recargable 100% natural. Fabricado con madera de Salvadora persica (Siwak), reconocido por la OMS como superior a un cepillo convencional. Incluye 3 cabezales biodegradables de rosca.', bullets:['Naturalmente antibacteriano — sin productos químicos','Blanqueador sin agentes químicos agresivos','Biodegradable — cero residuos plásticos','Apto para toda la familia','Entrega Mondial Relay 72h'] },
        'tetes-recharges':{ eyebrow:'Colección Siwak', title:'Cabezales de Recambio<br><em>Siwak</em>', desc:'Pack de 3 cabezales de recambio 100% naturales en madera de Siwak (Salvadora persica). Compatibles exclusivamente con el cepillo ALYA & CO. Biodegradables, cero residuos plásticos — cambia solo el cabezal cada 3 meses.', bullets:['100% natural — madera de Salvadora persica','Biodegradable — cero plástico','Compatible con el cepillo ALYA & CO.','Pack de 3 cabezales (9 meses de uso)','Entrega Mondial Relay 72h'] },
        'dentifrice-siwak':{ eyebrow:'Colección Siwak', title:'Dentífrico Siwak<br><em>en Polvo</em>', desc:'Dentífrico en polvo orgánico, sin flúor, sin sulfatos, sin conservantes. A base de extracto natural de Siwak (Salvadora persica). Blanqueamiento natural visible desde 2 semanas de uso regular. 100% natural, certificado bio.', bullets:['Certificado bio — sin aditivos sintéticos','Sin flúor · Sin sulfatos · Sin conservantes','Blanqueamiento natural desde 2 semanas','Extracto puro de Siwak antibacteriano','Entrega Mondial Relay 72h'] },
        'pack-siwak-complet':{ eyebrow:'Nuestros Packs — Bestseller', title:'Kit Completo<br><em>Cepillo Siwak</em>', desc:'El kit completo para comenzar tu higiene bucal natural. Todo lo que necesitas, reunido en un único pack ventajoso. Ahorra un 30% frente a la compra por separado.', bullets:['Ahorra un 30% vs compra separada (valor €25,97)','Todo incluido — ideal para empezar con el Siwak','Regalo natural y eco-responsable perfecto','Entrega Mondial Relay 72h'] },
        'gant-corps':{ eyebrow:'Colección Guantes · OEKO TEX®', title:'Guante Exfoliante Corporal<br><em>Seda de Morera</em>', desc:'El guante exfoliante más eficaz del mundo. En pura seda de morera, certificado OEKO TEX® Standard 100. Elimina el 100% de las células muertas en un solo pase. Sin productos químicos, solo agua caliente.', bullets:['Pura seda de morera — la más suave del mundo','Certificado OEKO TEX® Standard 100','100% células muertas eliminadas desde el 1er uso','Hipoalergénico — todos los tipos de piel, incluida la sensible','Sin productos químicos — solo agua caliente','Entrega Mondial Relay 72h'] },
        'gant-visage':{ eyebrow:'Colección Guantes · OEKO TEX®', title:'Guante Exfoliante Facial<br><em>Seda de Morera</em>', desc:'Especialmente diseñado para la piel delicada del rostro. En pura seda de morera, ultra-suave e hipoalergénico. Certificado OEKO TEX®. Eficaz contra el acné, los puntos negros y la piel opaca — sin productos químicos agresivos.', bullets:['Seda de morera ultra-suave — especial para el rostro','Hipoalergénico — pieles sensibles y con tendencia acneica','Certificado OEKO TEX® Standard 100','Eficaz contra el acné y los puntos negros','Sin productos químicos — solo agua templada','Entrega Mondial Relay 72h'] },
        'pack-1an-full-body':{ eyebrow:'Nuestros Packs — Bestseller', title:'Un Año Completo<br><em>Full Body</em>', desc:'La solución completa para una piel perfecta durante todo el año. Cuerpo y rostro, todo está cubierto. El pack más popular de ALYA & CO. — ahorra casi un 50% frente a la compra por separado.', bullets:['Ahorra un 48% vs compra separada (valor €57,98)','Cuerpo + rostro — rutina de belleza completa','Ambos certificados OEKO TEX® Standard 100','Resultados visibles desde el 1er uso','Entrega Mondial Relay 72h'] },
        'chouchou-soie':{ eyebrow:'Colección Guantes · Accesorios', title:'Goma para el Cabello de Seda<br><em>Sujeción Perfecta — Seda</em>', desc:'Goma para el cabello en pura seda de morera. Protege tu cabello, evita la rotura, los nudos y el encrespamiento. Sujeción perfecta todo el día. Suave para tu cabello, resistente al desgaste, elegante cada día.', bullets:['Pura seda de morera — la más suave','Protege contra la rotura y los nudos','Reduce el encrespamiento y la electricidad estática','Duradera — resistente al uso diario','Elegante — acabado premium','Entrega Mondial Relay 72h'] },
        'pack-dentifrice-3m':{ eyebrow:'Nuestros Packs — Siwak', title:'Pack Dentífrico 3 Meses<br><em>Siwak en Polvo</em>', desc:'Tres meses de blanqueamiento natural con 3 botes de dentífrico en polvo orgánico al Siwak. Sin flúor, sin SLS, sin parabenos. La rutina dental sana y natural, con stock para toda la temporada.', bullets:['3 botes = aprox. 3 meses de uso','Blanqueamiento natural visible desde 2 semanas','Naturalmente antibacteriano gracias al Siwak','Sin flúor, sin SLS, sin parabenos','Entrega Mondial Relay 72h'] },
        'pack-tetes-x3':{ eyebrow:'Nuestros Packs — Siwak', title:'Pack Cabezales de Recambio<br><em>Siwak Bio X3</em>', desc:'18 cabezales de recambio de Siwak orgánico para meses de higiene bucal natural. 100% biodegradables, fácilmente enroscados en tu cepillo Siwak recargable. Ahorra un 33% vs compra individual.', bullets:['18 cabezales = más de 18 meses de higiene','Siwak orgánico, madera Arak auténtica 100% natural','Biodegradable — cero plástico','Compatible con el cepillo Siwak recargable','Entrega Mondial Relay 72h'] }
      }
    },

    /* ── GERMAN ── */
    de: {
      announce: [
        'Kostenloser Mondial Relay 72h-Versand ab €45*',
        '100% Natürlich · Bio · Umweltfreundlich',
        'OEKO TEX® Standard 100 Zertifiziert',
        'Über 500 Bewertungen ⭐ 4,8/5'
      ],
      nav_home:'Startseite', nav_siwak:'Siwak-Zahnbürste', nav_gants:'Peeling-Handschuhe',
      nav_packs:'Unsere Pakete', nav_histoire:'Unsere Geschichte', nav_blog:'Blog',
      nav_contact:'Kontakt', nav_cart:'Warenkorb',
      footer_products:'Produkte', footer_info:'Informationen', footer_contact_col:'Kontakt',
      footer_tagline:'"Wohlbefinden, Zufriedenheit, Lächeln."<br>Ihre natürliche Schönheit, unsere Leidenschaft.',
      footer_copy:'© 2025 ALYA & CO. Alle Rechte vorbehalten.',
      footer_brosse:'Wiederaufladbare Siwak-Zahnbürste', footer_tetes:'Siwak-Ersatzköpfe',
      footer_dent:'Siwak-Zahnpulver', footer_gc:'Körper-Peeling-Handschuh',
      footer_gv:'Gesichts-Peeling-Handschuh', footer_pack1an:'1 Jahr Full Body Paket',
      footer_histoire:'Unsere Geschichte', footer_faq:'FAQ', footer_nous:'Kontaktiere uns',
      footer_livraison:'Versand', footer_blog:'Blog & Tipps', footer_cgv:'AGB',
      footer_mentions:'Impressum', footer_response:'Antwort innerhalb von 24h<br>Montag bis Freitag',
      footer_legal_cgv:'AGB', footer_legal_conf:'Datenschutz', footer_legal_mentions:'Impressum',
      btn_atc:'In den Warenkorb', btn_back:'← Zurück zur Kollektion', verified:'Verifizierter Kauf',
      hero_badge:'Natürliche Schönheit · Rein · Eco',
      hero_sub:'Natürliche Pflege, die Ihre Haut und unseren Planeten respektiert. Ancestraler Siwak und Maulbeerseide, vereint für Ihr tägliches Wohlbefinden.',
      hero_discover:'Entdecken', hero_story:'Unsere Geschichte',
      stat_avis:'Kundenbewertungen', stat_note:'Durchschnittsbewertung', stat_naturel:'Natürlich',
      pages: {
        'brosse-siwak':{ eyebrow:'Siwak Kollektion', title:'Zahnbürste<br><em>Wiederaufladbare Siwak</em>', desc:'Die erste 100% natürliche wiederaufladbare Zahnbürste. Aus Salvadora-persica-Holz (Siwak) gefertigt, von der WHO als überlegen gegenüber einer herkömmlichen Bürste anerkannt. Enthält 3 biologisch abbaubare Schrauber-Ersatzköpfe.', bullets:['Natürlich antibakteriell — keine Chemikalien','Bleichend ohne aggressive Chemikalien','Biologisch abbaubar — kein Plastikmüll','Für die ganze Familie geeignet','Mondial Relay 72h Lieferung'] },
        'tetes-recharges':{ eyebrow:'Siwak Kollektion', title:'Ersatzköpfe<br><em>Siwak</em>', desc:'3er-Pack 100% natürliche Ersatzköpfe aus Siwak-Holz (Salvadora persica). Ausschließlich kompatibel mit der ALYA & CO. Zahnbürste. Biologisch abbaubar, kein Plastikmüll — ersetze nur den Kopf alle 3 Monate.', bullets:['100% natürlich — Salvadora-persica-Holz','Biologisch abbaubar — kein Plastik','Kompatibel mit der ALYA & CO. Bürste','3er-Pack Köpfe (9 Monate Nutzung)','Mondial Relay 72h Lieferung'] },
        'dentifrice-siwak':{ eyebrow:'Siwak Kollektion', title:'Siwak-Zahnpasta<br><em>als Pulver</em>', desc:'Biologisches Zahnpulver, fluoridfrei, sulfatfrei, konservierungsmittelfrei. Auf Basis von natürlichem Siwak-Extrakt (Salvadora persica). Natürliche Aufhellung sichtbar nach 2 Wochen regelmäßiger Anwendung. 100% natürlich, bio-zertifiziert.', bullets:['Bio-zertifiziert — keine synthetischen Zusätze','Fluoridfrei · Sulfatfrei · Konservierungsmittelfrei','Natürliche Aufhellung nach 2 Wochen','Reiner antibakterieller Siwak-Extrakt','Mondial Relay 72h Lieferung'] },
        'pack-siwak-complet':{ eyebrow:'Unsere Pakete — Bestseller', title:'Vollständiges Siwak<br><em>Zahnbürsten-Paket</em>', desc:'Das komplette Kit für den Start Ihrer natürlichen Mundhygiene. Alles, was Sie brauchen, zu einem großartigen Preis gebündelt. Sparen Sie 30% gegenüber dem Einzelkauf.', bullets:['30% Ersparnis vs. Einzelkauf (Wert €25,97)','Alles inklusive — ideal für den Einstieg mit Siwak','Perfektes natürliches, umweltfreundliches Geschenk','Mondial Relay 72h Lieferung'] },
        'gant-corps':{ eyebrow:'Handschuh-Kollektion · OEKO TEX®', title:'Körper-Peeling-Handschuh<br><em>Maulbeerseide</em>', desc:'Der effektivste Peeling-Handschuh der Welt. Aus reiner Maulbeerseide, OEKO TEX® Standard 100 zertifiziert. Entfernt 100% der abgestorbenen Zellen in einem Durchgang. Ohne Chemikalien, nur warmes Wasser.', bullets:['Reine Maulbeerseide — die weichste der Welt','OEKO TEX® Standard 100 Zertifiziert','100% abgestorbene Zellen ab dem 1. Gebrauch entfernt','Hypoallergen — alle Hauttypen, auch empfindliche','Keine Chemikalien — nur warmes Wasser','Mondial Relay 72h Lieferung'] },
        'gant-visage':{ eyebrow:'Handschuh-Kollektion · OEKO TEX®', title:'Gesichts-Peeling-Handschuh<br><em>Maulbeerseide</em>', desc:'Speziell für die empfindliche Haut des Gesichts entwickelt. Aus reiner Maulbeerseide, ultra-weich und hypoallergen. OEKO TEX® zertifiziert. Wirksam gegen Akne, Mitesser und fahle Haut — ohne aggressive Chemikalien.', bullets:['Ultra-weiche Maulbeerseide — speziell für das Gesicht','Hypoallergen — empfindliche und zu Akne neigende Haut','OEKO TEX® Standard 100 Zertifiziert','Wirksam gegen Akne und Mitesser','Keine Chemikalien — nur lauwarmes Wasser','Mondial Relay 72h Lieferung'] },
        'pack-1an-full-body':{ eyebrow:'Unsere Pakete — Bestseller', title:'Ein ganzes Jahr<br><em>Full Body</em>', desc:'Die komplette Lösung für perfekte Haut das ganze Jahr über. Körper und Gesicht, alles abgedeckt. Das beliebteste Paket von ALYA & CO. — sparen Sie fast 50% gegenüber dem Einzelkauf.', bullets:['48% Ersparnis vs. Einzelkauf (Wert €57,98)','Körper + Gesicht — komplette Schönheitsroutine','Beide OEKO TEX® Standard 100 zertifiziert','Sichtbare Ergebnisse ab dem 1. Gebrauch','Mondial Relay 72h Lieferung'] },
        'chouchou-soie':{ eyebrow:'Handschuh-Kollektion · Zubehör', title:'Seiden-Haargummi<br><em>Perfekter Halt — Seide</em>', desc:'Haargummi aus reiner Maulbeerseide. Schützt Ihr Haar, verhindert Bruch, Knoten und Frizz. Perfekter Halt den ganzen Tag. Sanft zu Ihrem Haar, verschleißfest, täglich elegant.', bullets:['Reine Maulbeerseide — die weichste','Schützt vor Bruch und Knoten','Reduziert Frizz und statische Elektrizität','Langlebig — verschleißfest bei täglichem Gebrauch','Elegant — Premium-Finish','Mondial Relay 72h Lieferung'] },
        'pack-dentifrice-3m':{ eyebrow:'Unsere Pakete — Siwak', title:'3-Monats-Zahnpasta-Paket<br><em>Siwak-Pulver</em>', desc:'Drei Monate natürliche Aufhellung mit 3 Gläsern Bio-Siwak-Zahnpulver. Fluoridfrei, SLS-frei, parabenenfrei. Die gesunde und natürliche Zahnpflegeroutine, für die gesamte Saison bevorratet.', bullets:['3 Gläser = ca. 3 Monate Nutzung','Natürliche Aufhellung nach 2 Wochen sichtbar','Natürlich antibakteriell dank Siwak','Fluoridfrei, SLS-frei, parabenenfrei','Mondial Relay 72h Lieferung'] },
        'pack-tetes-x3':{ eyebrow:'Unsere Pakete — Siwak', title:'Ersatzköpfe-Paket<br><em>Bio-Siwak X3</em>', desc:'18 Bio-Siwak-Ersatzköpfe für Monate natürlicher Mundhygiene. 100% biologisch abbaubar, einfach auf Ihre wiederaufladbare Siwak-Zahnbürste geschraubt. Sparen Sie 33% vs. Einzelkauf.', bullets:['18 Köpfe = über 18 Monate Hygiene','Bio-Siwak, authentisches 100% natürliches Arak-Holz','Biologisch abbaubar — kein Plastik','Kompatibel mit der wiederaufladbaren Siwak-Bürste','Mondial Relay 72h Lieferung'] }
      }
    }

  }; /* end T */

  /* ================================================================
     APPLY COMMON UI
     ================================================================ */
  function applyCommon(t) {
    /* Announcement bar */
    var items = qsa('.announcement-item');
    items.forEach(function(el, i){ el.textContent = t.announce[i % t.announce.length]; });

    /* Desktop nav */
    setAll('.nav-links a[href$="index"]',          t.nav_home);
    setAll('.nav-links a[href$="collection-siwak"]',t.nav_siwak);
    setAll('.nav-links a[href$="collection-gants"]',t.nav_gants);
    setAll('.nav-links a[href$="nos-packs"]',       t.nav_packs);
    setAll('.nav-links a[href$="notre-histoire"]',  t.nav_histoire);
    setAll('.nav-links a[href$="blog"]',            t.nav_blog);
    setAll('.nav-links a[href$="contact"]',         t.nav_contact);
    replaceTextNode(qs('.nav-cart'), 'Panier', t.nav_cart);

    /* Mobile nav */
    qsa('.mobile-nav a').forEach(function(a){
      var h = a.getAttribute('href') || '';
      if      (h.indexOf('index') !== -1)           a.textContent = t.nav_home;
      else if (h.indexOf('collection-siwak') !== -1) a.textContent = t.nav_siwak;
      else if (h.indexOf('collection-gants') !== -1) a.textContent = t.nav_gants;
      else if (h.indexOf('nos-packs') !== -1)        a.textContent = t.nav_packs;
      else if (h.indexOf('notre-histoire') !== -1)   a.textContent = t.nav_histoire;
      else if (h.indexOf('blog') !== -1 && h.indexOf('blog/') === -1) a.textContent = t.nav_blog;
      else if (h.indexOf('contact') !== -1 && a.textContent.indexOf('○') === -1) a.textContent = t.nav_contact;
    });

    /* Footer column titles */
    var fcols = qsa('.footer-col-title');
    if (fcols[0]) fcols[0].textContent = t.footer_products;
    if (fcols[1]) fcols[1].textContent = t.footer_info;
    if (fcols[2]) fcols[2].textContent = t.footer_contact_col;

    /* Footer tagline & copy */
    var tagline = qs('.footer-tagline'); if (tagline) tagline.innerHTML = t.footer_tagline;
    var copy    = qs('.footer-copy');    if (copy)    copy.textContent  = t.footer_copy;

    /* Footer product links */
    setAll('footer a[href$="brosse-siwak"]',     t.footer_brosse);
    setAll('footer a[href$="tetes-recharges"]',  t.footer_tetes);
    setAll('footer a[href$="dentifrice-siwak"]', t.footer_dent);
    setAll('footer a[href$="gant-corps"]',       t.footer_gc);
    setAll('footer a[href$="gant-visage"]',      t.footer_gv);
    setAll('footer a[href$="pack-1an-full-body"]',t.footer_pack1an);

    /* Footer info links */
    setAll('footer a[href$="notre-histoire"]',   t.footer_histoire);
    setAll('footer a[href$="faq"]',              t.footer_faq);
    setAll('footer a[href$="livraison"]',        t.footer_livraison);
    setAll('footer a[href$="blog"]',             t.footer_blog);
    setAll('footer a[href$="cgv"]',              t.footer_cgv);
    setAll('footer a[href$="mentions-legales"]', t.footer_mentions);
    /* "Nous contacter" — all footer links pointing to contact */
    qsa('footer .footer-links a[href$="contact"]').forEach(function(a){ a.textContent = t.footer_nous; });

    /* Footer response time */
    qsa('footer .footer-links li').forEach(function(li){
      if (li.textContent.indexOf('Réponse') !== -1) li.innerHTML = t.footer_response;
    });

    /* Footer legal bar */
    var legal = qsa('.footer-legal a');
    if (legal[0]) legal[0].textContent = t.footer_legal_cgv;
    if (legal[1]) legal[1].textContent = t.footer_legal_conf;
    if (legal[2]) legal[2].textContent = t.footer_legal_mentions;
  }

  /* ================================================================
     APPLY PAGE-SPECIFIC (product pages)
     ================================================================ */
  function applyPage(p) {
    if (!p) return;
    if (p.eyebrow) set('.product-eyebrow', p.eyebrow, false);
    if (p.title)   set('.product-title',   p.title,   true);
    if (p.desc)    set('.product-description', p.desc, true);
    if (p.bullets) {
      var lis = qsa('.product-bullets li');
      p.bullets.forEach(function(txt, i){ if (lis[i]) lis[i].textContent = txt; });
    }
    /* Buttons */
    qsa('.btn-primary.btn-atc').forEach(function(b){ b.textContent = T[getLang()].btn_atc; });
    qsa('.product-ctas .btn-outline').forEach(function(a){ a.textContent = T[getLang()].btn_back; });
    /* Verified badge */
    setAll('.review-verified', T[getLang()].verified);
  }

  /* Home page extras */
  function applyHome(t) {
    set('.hero-badge', t.hero_badge);
    set('.hero-sub',   t.hero_sub);
    var heroBtns = qsa('.hero-ctas a');
    if (heroBtns[0]) heroBtns[0].textContent = t.hero_discover;
    if (heroBtns[1]) heroBtns[1].textContent = t.hero_story;
    var statLabels = qsa('.stat-label');
    if (statLabels[0]) statLabels[0].textContent = t.stat_avis;
    if (statLabels[1]) statLabels[1].textContent = t.stat_note;
    if (statLabels[2]) statLabels[2].textContent = t.stat_naturel;
  }

  /* ================================================================
     MAIN APPLY
     ================================================================ */
  function applyTranslations(lang) {
    if (lang === 'fr') return; /* FR = default HTML, nothing to do */
    var t = T[lang]; if (!t) return;
    applyCommon(t);
    var page = getPageId();
    if (t.pages && t.pages[page]) applyPage(t.pages[page]);
    if (page === 'home' || page === 'index') applyHome(t);
    document.documentElement.lang = lang;
  }

  /* ================================================================
     LANGUAGE SELECTOR INJECTION
     ================================================================ */
  function injectCSS() {
    var s = document.createElement('style');
    s.textContent = [
      '.lang-sel{position:relative;display:inline-flex;align-items:center;}',
      '.lang-btn{display:flex;align-items:center;gap:5px;background:none;border:1px solid rgba(184,151,90,.28);',
      'padding:5px 11px;cursor:pointer;font-family:inherit;font-size:10px;font-weight:500;',
      'letter-spacing:.18em;text-transform:uppercase;color:var(--mid,#6B5B4E);transition:all .3s;}',
      '.lang-btn:hover{border-color:var(--gold,#B8975A);color:var(--dark,#1C1612);}',
      '.lang-drop{display:none;position:absolute;top:calc(100% + 8px);right:0;',
      'background:var(--cream,#FAF6F1);border:1px solid rgba(184,151,90,.2);',
      'box-shadow:0 16px 48px rgba(28,22,18,.13);min-width:152px;z-index:300;flex-direction:column;}',
      '.lang-sel.open .lang-drop{display:flex;}',
      '.lang-opt{display:flex;align-items:center;gap:9px;padding:10px 14px;background:none;border:none;',
      'border-bottom:1px solid rgba(184,151,90,.08);font-family:inherit;font-size:11px;font-weight:400;',
      'letter-spacing:.1em;color:var(--mid,#6B5B4E);cursor:pointer;text-align:left;transition:all .2s;width:100%;}',
      '.lang-opt:last-child{border-bottom:none;}',
      '.lang-opt:hover{background:var(--warm,#F2E8DD);color:var(--dark,#1C1612);}',
      '.lang-opt.active{color:var(--gold,#B8975A);font-weight:500;}',
      '.mob-langs{display:flex;flex-wrap:wrap;gap:7px;padding:14px 0 4px;',
      'border-top:1px solid rgba(184,151,90,.12);margin-top:6px;}',
      '.mob-lang-btn{background:none;border:1px solid rgba(184,151,90,.28);padding:5px 10px;',
      'font-family:inherit;font-size:10px;letter-spacing:.12em;text-transform:uppercase;',
      'color:var(--mid,#6B5B4E);cursor:pointer;transition:all .25s;}',
      '.mob-lang-btn.active,.mob-lang-btn:hover{border-color:var(--gold,#B8975A);color:var(--gold,#B8975A);}'
    ].join('');
    document.head.appendChild(s);
  }

  function injectSelector(currentLang) {
    var navRight = qs('.nav-right');
    if (!navRight) return;

    /* Build desktop selector */
    var wrap = document.createElement('div');
    wrap.className = 'lang-sel';

    var btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.setAttribute('aria-label', 'Choisir la langue');
    btn.innerHTML = '<span>' + LANG_FLAGS[currentLang] + '</span><span>' + currentLang.toUpperCase() + '</span><span style="font-size:8px">▾</span>';

    var drop = document.createElement('div');
    drop.className = 'lang-drop';

    Object.keys(LANG_LABELS).forEach(function(l){
      var opt = document.createElement('button');
      opt.className = 'lang-opt' + (l === currentLang ? ' active' : '');
      opt.innerHTML = LANG_FLAGS[l] + ' ' + LANG_LABELS[l];
      opt.addEventListener('click', function(){ setLang(l); });
      drop.appendChild(opt);
    });

    wrap.appendChild(btn);
    wrap.appendChild(drop);

    /* Toggle on button click */
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', function(){ wrap.classList.remove('open'); });

    /* Insert before menu-toggle */
    var toggle = qs('.menu-toggle');
    navRight.insertBefore(wrap, toggle || null);

    /* Mobile nav: add language buttons at bottom */
    var mobileNav = qs('.mobile-nav');
    if (mobileNav) {
      var mobWrap = document.createElement('div');
      mobWrap.className = 'mob-langs';
      Object.keys(LANG_LABELS).forEach(function(l){
        var mb = document.createElement('button');
        mb.className = 'mob-lang-btn' + (l === currentLang ? ' active' : '');
        mb.textContent = LANG_FLAGS[l] + ' ' + l.toUpperCase();
        mb.addEventListener('click', function(){ setLang(l); });
        mobWrap.appendChild(mb);
      });
      mobileNav.appendChild(mobWrap);
    }
  }

  /* ================================================================
     INIT
     ================================================================ */
  document.addEventListener('DOMContentLoaded', function(){
    injectCSS();
    var lang = getLang();
    injectSelector(lang);
    applyTranslations(lang);
  });

})();
