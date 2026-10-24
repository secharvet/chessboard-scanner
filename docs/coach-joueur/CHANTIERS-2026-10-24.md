# Le coach joueur : trois chantiers (synthèse pilote + Expert, 24 octobre 2026, nuit)

**Version 2 = la synthèse.** Thèse du pilote (v1), antithèse de l'Expert (`~/chess-expert/livrables/antithese-coach-joueur.md`,
commits ed7a3d6 et 2fee9b1), relecture, synthèse confirmée au troisième tour. C'est la seule version qui part au Dev
chef. Trois pages, une par chantier. Le but des deux semaines : une V0 qui joue une partie entière, seule, et qui explique
chacun de ses coups ; la partie se regarde sur le site.

**Unités, pour toute la suite.** L'évaluation reprend les nombres de Stockfish 11 classique en unités internes (pion = 128
au milieu de jeu, 213 en finale). **Toutes les bornes de ce document sont en centièmes de pion affichés** : conversion
interne × 100 / 213, comme la sortie UCI de SF 11. Plan 10 / 30, livre 50, abandon 100, « se valent » 10, examinateur
100 et ± 500 : tous en centipions affichés.

---

## Page 1 — Le cerveau de verre (le joueur)

**Ce que c'est.** Un programme d'échecs à nous, petit et lisible, qui choisit ses coups par une évaluation faite de termes
nommés et une recherche courte. Chaque terme est un nombre qu'on peut lire et traduire en phrase. Le coup choisi est celui
dont la somme des termes, au bout de la ligne calculée, est la meilleure. L'explication est la lecture de cette somme.

**Son propre échiquier.** Fait : `coach/joueur/echiquier.mjs`, règles vérifiées par comptage exhaustif sur les six
positions de référence publiques (perft), 1,36 million de positions par seconde (la bibliothèque du site en fait 5 000).

**L'évaluation : douze termes nommés, aux poids de SF 11 classique** (`docs/coach-joueur/SF11-CLASSIQUE.md`, rien d'inventé),
chacun en version milieu de jeu et finale, mélangées selon le matériel restant.
1. **Matériel** (pion 128/213, cavalier 781/854, fou 825/915, tour 1276/1380, dame 2538/2682).
2. **Placement** : les tables case par case de SF 11.
3. **Pions** : isolé, doublé, arriéré, lié, faible non opposé.
4. **Pion passé** : bonus par rangée, distance des deux rois à la case devant, chemin libre.
5. **Mobilité** des cavaliers, fous, tours, dames (cases sûres).
6. **Avant-poste** (cavalier et fou), mineure derrière un pion.
7. **Tours** : colonne ouverte ou semi-ouverte, tour enfermée.
8. **Fous** : paire, fou gêné par ses pions, grande diagonale.
9. **Sécurité du roi** : abri et tempête de pions (tables SF 11), et le **danger du roi** dans la forme de SF 11 : attaquants
   × poids (cavalier 81, fou 52, tour 44, dame 10), cases faibles de la zone du roi, échecs sûrs, pièces clouées, **− 873
   quand l'adversaire n'a pas de dame**, **− 100 quand notre cavalier défend à côté du roi** (c'est le Cf6 de la Panov), le
   tout au carré au-delà de 100. On ne reprend ni la mobilité adverse ni l'attaque de flanc.
10. **Menaces** : pièces en l'air, pièces attaquées par une mineure, une tour, un pion sûr.
11. **Développement** (ouverture, tant que les deux camps ont la plupart de leurs pièces) : mineures non sorties, droit de
    roquer perdu, dame sortie avant les mineures. Sans lui, à 5 demi-coups : sorties de dame, prise du pion b2, roi au centre.
12. **Espace** (milieu de jeu).
Plus trois règles de jeu, elles aussi des termes :
- **Échanger quand on mène** : bonus aux échanges de pièces (pas de pions) pour le camp qui a l'avantage matériel.
- **Plan** (notre grammaire, `coach/plan-distance.mjs`, `coach/plans-structures.mjs`, `positional/structures.js`) :
  valeur = (distance du plan à la racine − distance au bout de la ligne) × 10, **plafonnée à ± 30** ; une distance qui
  augmente compte en négatif. Le plan ne décide jamais contre la tactique, il départage les coups calmes.
  **Adoption** : à chaque coup, la structure est reconnue ; si elle n'a pas changé, le plan adopté reste ; sinon, ou sans
  plan, les plans connus de la structure sont instanciés et le coach adopte celui dont le pas le moins cher à ses yeux est
  à moins de 30 de son meilleur coup (égalité : l'ordre du catalogue). Il quitte le plan quand la distance atteint 0
  (réalisé), quand le plan est sans objet (pièce ou cible disparue), ou quand le **cumul de ses propres coûts dépasse 100** ;
  alors il le dit (« j'abandonne le plan, trop cher »). Le cumul sert à la phrase, pas de garde-fou : la protection, ce
  sont le plafond et le danger du roi.
- **Finales** : forcer le mat contre le roi seul (roi adverse au bord, le nôtre qui s'approche) ; règle du carré en finale
  de pions ; roi et pion contre roi par les cases critiques (exception des colonnes a et h), vérifiées contre une table de
  toutes les positions que nous générons (oracle de test, pas dans l'évaluation) ; facteurs de nulle : matériel
  insuffisant, fous de couleurs opposées, sans pions moins d'une tour d'avance ne gagne pas. **Répétition et 50 coups dans
  la recherche, valeur 0.** Ni Lucena, ni Philidor, ni tables de finales en V0 ; fou et cavalier contre roi : hors champ.

**Le livre d'ouverture : une règle, pas un bonus.** Dans une position d'un de nos trois livres, le coach joue le coup du
livre (c'est son répertoire appris, donc « ses coups »), **sauf si sa propre recherche y voit une perte de plus de 50** ;
alors il joue son coup et dit ce qu'il a vu. La phrase du livre est celle écrite dans le livre.

**La recherche.** Approfondissement itératif, alpha-bêta, quiescence (prises, promotions, échecs au premier pli), ordre des
coups (table, prises par valeur, « killers »), table de transposition, prolongation sur échec. **Budget fixe en nombre de
positions** (400 000 au départ) et un seul fil : même position, même coup, toujours. Profondeur attendue : 5 à 7 demi-coups
au milieu de jeu, 10 et plus en finale.

**La trace, qui sert à parler.** Pour chaque coup : l'évaluation avant le coup ; les candidats de la racine avec leur score
et leur ligne ; le détail des termes juste après le coup (après quiescence) et au bout de la ligne ; la menace adverse (ce
qu'il ferait si on passait : recherche courte avec le trait à lui, **jamais en finale de pions**), et sa revérification
après le coup joué ; les motifs tactiques nommés sur notre propre ligne, dans ses 4 premiers demi-coups
(`coach/motifs.mjs` : fourchette, clouage, déviation, surcharge, intermezzo, défenseur unique, schéma de mat).

**Fermé d'avance.** Pas de réseau, pas d'apprentissage, pas d'évaluation de Stockfish dans le choix du coup.

---

## Page 2 — La parole (l'explication)

**Règle d'or.** La phrase n'est pas un commentaire : c'est la trace du calcul mise en français de club. Chaque phrase dit
**le coup, la raison, et le coup qu'il a battu** (ou « se valent »). Si la phrase ne peut pas être produite depuis la
trace, c'est un échec compté.

**Trois valeurs comparées** : l'évaluation avant le coup (E0), la note du coup joué M, la note du meilleur autre coup R.
Si M monte au-dessus de E0 : c'est un gain. Si M tient E0 et que R s'effondre : M est **le seul coup**, c'est une défense,
et on nomme ce que R permettait.

**Les quatre sortes, dans cet ordre de priorité, le premier qui s'applique gagne :**
1. **Calcul** : l'écart entre M et R vient du **matériel** ou d'un **mat** au bout des lignes (ou M est un gain net). Phrase :
   « Je joue M : après [la ligne], je gagne [une pièce / la qualité / c'est mat]. Motif : fourchette. »
2. **Défense** : il existe une menace adverse que R laisse et que M pare (revérifiée après M), ou le danger du roi est ce
   qui sépare M de R, ou M est le seul coup. Phrase : « Mon roi d'abord : M garde f2 ; sans ça, [la menace]. » La défense
   passe **avant** le plan : c'est le piège « plan par peur ».
3. **Plan** : M fait progresser le plan adopté (ou c'est le coup du livre) et rien de tactique ne sépare M de R. Phrase :
   « Plan : attaque de minorité. b4 prépare b5 pour échanger en c6 et laisser un pion c faible. » En ouverture, la raison du
   livre, telle qu'écrite.
4. **Amélioration en attendant** : aucun des trois. On nomme le terme qui a fait la différence : « Rien de forcé. Le cavalier
   a plus de cases depuis d2. » Quand tous les termes sont minuscules : « Rien de mieux qu'un coup d'attente : h3 ne change
   rien et ne gâte rien. »

**Six règles d'honnêteté (Expert), toutes appliquées :**
1. Un terme n'est cité que s'il est **déjà présent juste après M** et **encore au bout de la ligne** (pas d'accident de feuille).
2. Gain ou seul coup : par les trois valeurs, jamais « je gagne » quand en vérité « R perdait ».
3. Priorité écrite : calcul > défense > plan > amélioration.
4. La menace vue vient du coup nul ; pas en finale de pions (zugzwang) ; « après M ce n'est plus possible » est revérifié.
5. Motif seulement dans les 3-4 premiers demi-coups de la ligne, et si le gain arrive dans la ligne.
6. Si R est à moins de 10 de M : « M et R se valent, j'ai pris M », pas « M bat R ». Aucune destination (« vers e4 ») qui ne
   soit dans la ligne. Français de club : « le cavalier a plus de cases », jamais « mobilité +3 ».

**Toujours dire ce qu'on a vu.** Si la menace adverse existe, elle est nommée même dans une phrase de plan : « (je vois
…Cxe4 ; après M ce n'est plus possible). »

**Comment c'est fait.** Des gabarits de phrases (écrits par l'Expert), un par sorte et par terme, en français, notation du
projet (`coach/notation.mjs`). Aucun LLM dans la V0.

**Ce qui est stocké pour chaque coup** (le contrat du lecteur et de l'examinateur, page 3).

---

## Page 3 — L'épreuve et le lecteur

**La première mesure : une partie.** Le coach joue une partie entière contre Maia-1500, jusqu'au bout (mat, pat,
répétition, 50 coups, matériel insuffisant). On la regarde sur le site. C'est la V0 ; Sébastien est prévenu à ce moment-là.

**Variété des parties (règle écrite avant).** Le coach est déterministe. Maia **tire dans sa politique pendant ses 8
premiers coups** (graine publiée, une par partie), puis joue son coup préféré : tirer toute la partie la ferait jouer
nettement sous 1500 et rendrait le seuil trop facile.

**L'examinateur.** Stockfish 19, un fil, profondeur 18, après la partie, jamais pendant : évaluation avant et après chaque
coup du coach, de son point de vue. **Bévue = plus de 100 perdus**, sauf : un mat en N devenu mat en N + k ; une position
au-delà de ± 500 avant et après sans changement d'issue (comptée à part en « gâchis de conversion ») ; un coup unique
légal. Fautes entre 50 et 100 notées à part. **Taux publié par phase** (ouverture, milieu, finale). Règle jamais retouchée.

**Les trois chiffres** : score du coach ; part de bévues ; part de coups avec phrase (doit être 100 %).

**La série, après la V0.** 100 parties contre Maia-1500 (50 Blancs, 50 Noirs, graines 1 à 50), intervalle ± 10 points ;
puis 100 contre Stockfish bridé (force limitée à 1500 par son réglage UCI), pour information. Durée estimée 3 à 6 heures
sur le VPS à un fil ; taille et heure de fin annoncées avant le lancement.

**La lecture humaine.** Vingt coups tirés au sort sur la série (graine publiée), lus par Sébastien ou Marc dans le lecteur,
examinateur caché : la phrase correspond-elle au coup, apprend-elle quelque chose. Seuil : 15 sur 20 fidèles.

**Les cinq conditions, vérifiables sans rapport** : (1) la partie est jouée du premier au dernier coup par le coach, le
fichier ne contient aucun appel au moteur avant la fin ; (2) score ≥ 50 % sur les 100 parties contre Maia-1500 ;
(3) bévues < 5 % ; (4) phrases = 100 % ; (5) 15 sur 20 fidèles. Une manque : on écrit pourquoi, on ferme.

**Le lecteur, sur le site.** Une page `partie.html` : l'échiquier, la liste des coups, et à chaque coup du coach sa phrase
avec une pastille (plan / amélioration / défense / calcul). Un bouton « pourquoi » montre la trace : la ligne calculée, le
coup battu, les termes qui ont compté, la menace vue. Le verdict de l'examinateur est caché par défaut et s'affiche sur
demande. La page sait tirer vingt coups au sort et recueillir les deux oui / non du lecteur, puis copier le résultat.

### Le contrat : le fichier d'une partie (`parties/<id>.json`)
```json
{ "version": 1, "id": "2026-10-25-maia-w-01", "depart": "<fen>",
  "coach": { "camp": "w", "budget": 400000, "code": "<commit>" },
  "adversaire": { "nom": "maia-1500", "graine": 1, "tirage": "8 premiers coups" },
  "coups": [ { "ply": 1, "camp": "w", "san": "e4", "uci": "e2e4", "fenAvant": "<fen>", "coach": true,
      "sorte": "plan|amelioration|defense|calcul|livre", "phrase": "…",
      "score": 23, "evalAvant": 18, "battu": { "san": "d4", "score": 19, "ecart": 4, "seValent": true },
      "ligne": ["e4", "e5", "Cf3"], "ligneBattu": ["d4", "d5"],
      "termes": [ { "nom": "développement", "apres": 12, "bout": 15 } ],
      "menace": { "ligne": ["…Cxe4"], "gain": 100, "pareeApres": true } ,
      "motif": "fourchette", "plan": { "nom": "rupture b→b5", "distance": 2, "cumul": 20 },
      "profondeur": 6, "noeuds": 400000 } ],
  "resultat": "1-0", "raison": "mat", "plies": 71,
  "examen": null }
```
Les coups de l'adversaire ont `coach: false` et seulement `san`, `uci`, `fenAvant`. L'examinateur ajoute, pour chaque coup du
coach, `examen: { avant, apres, perte, verdict: "ok|faute|bevue|exclu", raison, phase }` et en tête `examen: { moteur,
profondeur, bevues, fautes, exclus, coups, parPhase }`. Les scores sont en centipions affichés, du point de vue du coach.

### Qui fait quoi
- **Pilote** : `coach/joueur/` (échiquier fait ; évaluation, recherche, trace, plan, livre, parole), la classe
  `Joueur` : `choisir(fen, contexte) → l'enregistrement du coup ci-dessus`.
- **Dev chef** (après cette synthèse, en parallèle, contre une version factice de `Joueur` qui joue un coup légal au hasard
  avec une phrase bidon) : `scripts/joueur/partie.mjs` (l'arène : coach contre Maia-1500 via `coach/maia.mjs` avec le tirage
  des 8 premiers coups, ou contre Stockfish bridé via `coach/uci-engine.mjs` ; écrit `parties/<id>.json` ; jamais un coup
  du moteur pour le coach, vérifié par un test) ; `scripts/joueur/examiner.mjs` (SF 19, un fil, profondeur 18, les règles
  ci-dessus) ; la page `partie.html` + `partie.js` + `partie.css` (lecteur, pastilles, « pourquoi », examen caché, tirage de
  20 coups, formulaire oui / non, copie du résultat) ; tests.
- **Expert** : les gabarits de phrases par sorte et par terme (français de club), puis la traque des phrases infidèles sur
  les premières parties, avant la lecture humaine.

**Calendrier visé.** Jours 1–3 : évaluation, recherche, une partie complète jouée sans phrase. Jours 4–6 : la parole, le
lecteur, la V0 (prévenir Sébastien). Jours 7–10 : la série, l'examinateur, les corrections de fidélité. Jours 11–14 : la
lecture humaine, le rapport final au GE.
