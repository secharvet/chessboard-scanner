# Le joueur « humain » : l'arbre de décision — proposition

25 octobre 2026. Version finale (itération 3 sur 3) : thèse du pilote (`ARBRE-DECISION-THESE-2026-10-25.md`),
antithèse de l'Expert (`livrables/antithese-arbre-decision.md`, bf4ed68), avis du GE transmis par Sébastien, réponses de
l'Expert. Rien n'est codé ; proposition pour Sébastien.

## L'idée en trois lignes

Avant tout calcul, le coach se pose les questions d'un joueur de club, dans l'ordre d'un joueur de club. Chaque question
qui reçoit « oui » produit un ou deux coups **avec leur raison**. Puis il compare ces quelques coups par son propre calcul
court, élague, vérifie, et joue. La phrase est le chemin suivi dans l'arbre, plus ce qui a départagé.

## L'arbre

**0. Lire son dernier coup.** Ce qu'il attaque maintenant, ce qu'il découvre, ce qu'il a cessé de défendre. Compte du
matériel (1-3-3-5-9). Où sont les deux rois.

**1. Regarder d'abord ce qu'il menace** (la faute n° 1 à 1500 : ne pas voir sa menace).

| | Question | Coups produits |
|---|---|---|
| 1a | Suis-je en échec ? | Seulement les coups légaux : prendre, s'interposer, fuir. |
| 1b | Menace-t-il mat (en 1 ou 2) ? | Toute parade qui enlève le mat. |
| 1c | Une de mes pièces est-elle en prise (non défendue, ou attaquée par moins gros), la plus grosse d'abord ? | La sauver : fuir, défendre, s'interposer, ou contre-attaquer plus gros. |
| 1d | Ma dernière rangée est-elle faible (mat du couloir) ? | Un trou d'aération, ou une pièce qui couvre. |
| 1e | Une pièce à moi est-elle clouée, ou alignée avec mon roi ou ma dame ? | La déclouer, rompre l'alignement. |
| 1f | S'il jouait deux fois de suite, que gagnerait-il ? (fourchette, promotion, attaque de mat…) | La parade = tout coup après lequel sa suite ne gagne plus (c'est un test, pas un modèle). |

**2. Regarder ensuite ce que je peux forcer** (mes échecs, prises, menaces).

| | Question | Coups produits |
|---|---|---|
| 2a | Ai-je un mat (en 1 à 3) ? | Le mat. |
| 2b | Ai-je une prise ou un échec qui gagne du matériel, le plus gros d'abord ? | La prise ou l'échec. |
| 2c | Avant de reprendre : ai-je mieux qu'une reprise (un coup intermédiaire) ? | L'intermédiaire. |
| 2d | A-t-il des pièces non défendues ? Puis-je en attaquer deux à la fois, ou une qu'il ne peut pas sauver ? | La menace à créer. |
| 2e | Ai-je une tactique nommée (clouage, enfilade, déviation, surcharge, pièce enfermée) ? | Le coup du motif. |

**Règle d'or des étapes 1 et 2 : une seule liste, classée par le bilan net.** On ne choisit pas « parer » parce que
c'est l'étape 1 : on choisit le coup dont *ce que je gagne moins ce qu'il me gagne* est le meilleur, **après sa meilleure
réponse**. Seules exceptions : en échec, les coups légaux ; mon mat avant tout ; parer son mat juste après. Sinon l'arbre
enseigne les deux fautes de club : le coup désespéré et le coup intermédiaire oublié.

**3. Rien de forcé : quel est mon plan ?**

À **chaque** nœud de cette étape, la question d'abord : **« Que veut-il faire ? »** On passe l'étape 3 pour lui (ses
trois regards, ses cibles chez moi, le plan du catalogue pour sa structure). Son meilleur coup « s'il jouait deux fois »
sert de confirmation : s'il est un pas de ce plan, on le nomme (« Il veut jouer …c5 pour attaquer d4 ») ; sinon c'est de
la tactique (étape 1) ou il n'y a rien à nommer, et on ne dit rien. Le coup de **prophylaxie** est celui qui allonge le
chemin de son plan, ou qui lui enlève sa cible.

*3a — Où en est la partie ?*
- Ouverture : développer la pièce qui ne l'est pas, roquer, le centre. Le livre tant qu'on y est. Les règles (« ne pas
  rejouer une pièce », « pas la dame trop tôt ») **départagent, mais n'éliminent jamais** un coup (sinon on écarte une
  reprise comme 4.Cxe4).
- Structure reconnue (pion isolé, Carlsbad, chaîne, majorité, colonne ouverte…) : le plan du catalogue.
- Finale : le roi devient une pièce ; le pion passé ; la course de pions (règle du carré, tempos) ; la tour derrière le
  pion passé ; les livres de finale.

*3b — Qui est mieux ? Trois regards, dans l'ordre, sans aucun score :*
1. **Le matériel compté** (1-3-3-5-9, paire de fous + ½). Un point d'écart = mieux en matériel.
2. **Les rois** : qui ne peut plus roquer, pions de roque avancés ou manquants, pièces adverses près du roi.
3. **Le bilan** (Silman), ligne par ligne, « moi / lui / égal », sur des faits nommés : pièces développées, pion isolé,
   doublé ou arriéré, mauvais fou, colonne ouverte tenue, case forte, espace. Deux lignes de plus pour moi sans ligne de
   roi contre moi = mieux en position.

Le score du calcul reste caché, en garde-fou : s'il contredit ce bilan d'un pion ou plus, le coach ne dit pas « je suis
mieux ».

*3c — Contre quoi je joue ? (la cible, Nimzowitsch avant Silman)*
Un plan se joue contre quelque chose. Les cibles qu'un entraîneur nomme, avec le critère qui se compte et la manière :

| Cible chez lui | On la reconnaît à | On joue contre en |
|---|---|---|
| Pion isolé | aucun pion à lui sur les colonnes voisines | bloquer la case devant (un cavalier de préférence), l'attaquer de face avec une tour, échanger les pièces |
| Pion arriéré | ses voisins plus avancés, la case devant tenue par un de mes pions, colonne semi-ouverte pour moi | **fixer** (tenir ou occuper la case devant), puis doubler les tours |
| Pions doublés ou pendants | deux pions sur une colonne ; c et d sans voisins | attaquer de face pour les forcer à avancer, puis bloquer |
| Case faible | sa 3ᵉ à 5ᵉ rangée, qu'aucun de ses pions ne peut plus couvrir | y installer un cavalier, échanger son fou de cette couleur |
| Roi au centre | pas roqué après le coup 10, ou roque impossible | ouvrir le centre par un levier, une tour sur la colonne du roi, l'empêcher de roquer |
| Dernière rangée | aucune case de fuite, un seul défenseur | doubler sur la rangée, dévier le défenseur |
| Pièce enfermée | au plus 2 cases sûres | lui prendre ses cases, l'attaquer, ne jamais l'échanger |
| Mauvais fou | ses pions centraux fixés sur la couleur du fou | ne pas l'échanger, échanger ses bonnes pièces, jouer sur l'autre couleur |

Quatre verbes : **attaquer** (plus d'attaquants que de défenseurs), **fixer**, **échanger le défenseur**, **bloquer**.
On choisit la cible où l'écart entre mes attaquants possibles et ses défenseurs est le plus grand. En finale, principe
des deux faiblesses : une seule cible ne suffit pas, on en crée une deuxième sur l'autre aile.

*3d — Est-ce que j'attaque son roi ? (une décision, pas seulement une défense)*
Zone de son roi : les cases autour, plus la rangée devant. **A** = mes pièces (ni pions ni roi) qui attaquent la zone ou
peuvent l'attaquer en un coup ; **D** = ses pièces qui la défendent.
- **J'attaque si** : A − D ≥ 2, ma dame est sur l'échiquier, **et** au moins une ligne ouverte vers son roi (colonne sans
  pion à moi, diagonale ouverte) **ou** un pion de roque avancé ou manquant (…h6, …g6 sont des crochets pour un levier).
- **Je n'attaque pas si** (une seule suffit) : mon roi n'est pas à l'abri (pas roqué, ou le même compte chez moi donne
  ≥ 2 pour lui) ; le centre n'est pas fermé et il peut y jouer (« une attaque sur l'aile se combat au centre ») ; je suis
  en retard de développement.
- **Comment** : amener une pièce de plus, ou échanger son défenseur (le cavalier f6, le fou du roque) ; roques opposés →
  lancer les pions vers son roi ; rois du même côté → attaquer avec les pièces, pas avec les pions de mon roque. Le
  sacrifice ne vient que du calcul (étape 2), jamais de la règle.

*3e — Donc quelle conduite ?*

| Situation | Conduite | Coups produits |
|---|---|---|
| Mieux en matériel | Simplifier | Échanger les pièces (pas les pions), consolider. |
| Moins bien en matériel | Compliquer | Garder les pièces, chercher la menace, éviter les échanges. |
| Mieux en **dynamique** (développement, son roi au centre) : ça se périme | Agir maintenant | Ouvrir le jeu, mon roi à l'abri d'abord, amener une pièce de plus ; si 3d dit oui, l'attaque du roi. |
| Mieux en **statique** (structure, case forte, son mauvais fou) : ça ne se périme pas | Jouer lentement | Jouer contre la cible (3c), fixer la faiblesse, empêcher son contre-jeu. |
| Moins bien en position | Défendre sans concéder, chercher le contre-jeu | Consolider le point faible, échanger la pièce qui attaque. |
| Égal | Améliorer | Jouer contre sa pire faiblesse (3c) s'il en a une ; sinon **ma pire pièce** (au plus 2 cases utiles, fou gêné par ses pions fixés, mineure encore chez elle après le coup 10) vers une meilleure case ; la **prophylaxie** (voir le haut de l'étape 3) ; un levier de pion ; l'échange de ma mauvaise pièce contre sa bonne. |
| Perdu de toute façon | Poser le plus de problèmes | Pas la parade qui perd lentement : le coup qui lui demande le plus de précision. |

**4. Comparer** (Kotov). Trois à cinq coups au plus, chacun avec sa raison. Pour chacun : sa meilleure réponse (ses
échecs, prises, menaces d'abord), puis le bilan net. On élague : un coup dont la réponse coûte du matériel est écarté
**avec sa réfutation** ; entre les survivants, le meilleur bilan ; à égalité, la raison la plus haute dans l'arbre.

**5. Vérifier avant de jouer** (Heisman). On repose les questions de l'étape 1 sur la position **après** mon coup, plus :
« la pièce que je déplace défendait-elle quelque chose ? ». Si ça coince, retour à l'étape 4 avec le coup suivant.

**6. Dire.** Une seule question dite par coup : celle du nœud qui a produit le coup. Plus ce qui a départagé, au
conditionnel : « J'ai pensé à Cc3. Mais il répondait …Fb4, et je perdais le pion e4. Avec Cf3, rien de tel. » Jamais
« score », « ligne », « candidat ».

## Deux points qui dépendent du calcul

- **Le compte sur une case** (prises et reprises) se trompe dès qu'un défenseur est cloué ou surchargé. Il sert à
  *produire* le coup et à *dire* la phrase ; c'est le calcul court qui *décide*. S'ils ne sont pas d'accord, le coach ne
  dit pas « je compte ».
- **La profondeur : choix B** (GE, Expert, pilote). Le calcul actuel, mais **seulement sur les coups produits par
  l'arbre** ; la phrase limitée à 4 demi-coups dans le calme, 8 dans le forcé (ce qu'un 1500 calcule vraiment). L'humain
  est dans le choix des coups et dans ce qu'on en dit, pas dans la faiblesse du calcul : « un coach qui calcule mal exprès
  n'enseigne rien ».

## Ce que ça change par rapport au coach actuel

Aujourd'hui : le coach calcule **tous** les coups, choisit le meilleur score, puis cherche des mots. Demain : il ne
calcule que les 3 à 5 coups que l'arbre a produits, chacun avec sa raison **avant** le calcul. Le calcul départage, il ne
choisit plus. Un coup que l'arbre n'a pas produit mais que le calcul complet trouve meilleur d'au moins un pion
(affichage) que tous les candidats est joué et journalisé comme un **trou de l'arbre** : c'est l'arbre qu'on corrige,
pas le coup.

## Le premier chiffre publié : le taux de trous, par étape

C'est la mesure exacte de « simpliste » (GE) : **moins de 5 %, l'arbre suffit pour le niveau visé ; 20 %, il est trop
pauvre.** Les seuils valent pour le total et pour chaque étape. Le coup du trou repasse après coup dans les mêmes
questions, dans l'ordre de l'arbre, et tombe dans une de trois classes :
1. **Coup coupé** : une question le reconnaît, mais ne l'avait pas produit (plafond de 3, seuil, ordre) → un réglage.
2. **Coup pas reconnu avant** : la même question le voit après coup, pas avant (une menace qui n'apparaît qu'à 3
   demi-coups) → un défaut de la question.
3. **Sans nom** : aucune question ne le reconnaît → une **branche manquante**. C'est le chiffre qui compte.

Deux tableaux : (i) par étape où l'arbre se trouvait (celle qui a produit le coup joué) : trous / coups ; (ii) par classe
et par étape à laquelle le trou appartient. Pas d'attribution « au nœud le plus proche » : elle cacherait la cause.

La barre ne bouge pas : au moins 50 % contre Maia-1500, moins de 5 % de bévues. On accepte de perdre du niveau, pas la
tactique de base (étapes 1 et 2).
