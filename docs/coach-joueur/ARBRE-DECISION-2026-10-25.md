# Le joueur « humain » : l'arbre de décision — proposition

25 octobre 2026. Synthèse de la thèse du pilote (`ARBRE-DECISION-THESE-2026-10-25.md`) et de l'antithèse de l'Expert
(`livrables/antithese-arbre-decision.md`, bf4ed68). Itération 2 sur 3. Rien n'est codé ; proposition pour Sébastien.

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

*3c — Donc quelle conduite ?*

| Situation | Conduite | Coups produits |
|---|---|---|
| Mieux en matériel | Simplifier | Échanger les pièces (pas les pions), consolider. |
| Moins bien en matériel | Compliquer | Garder les pièces, chercher la menace, éviter les échanges. |
| Mieux en **dynamique** (développement, son roi au centre) : ça se périme | Agir maintenant | Ouvrir le jeu, mon roi à l'abri d'abord, amener une pièce de plus. |
| Mieux en **statique** (structure, case forte, son mauvais fou) : ça ne se périme pas | Jouer lentement | Améliorer, fixer la faiblesse, empêcher son contre-jeu. |
| Moins bien en position | Défendre sans concéder, chercher le contre-jeu | Consolider le point faible, échanger la pièce qui attaque. |
| Égal | Améliorer | **Ma pire pièce** (au plus 2 cases utiles, fou gêné par ses pions fixés, mineure encore chez elle après le coup 10) vers une meilleure case ; **prophylaxie** : « que veut-il faire ? », l'en empêcher ; un levier de pion ; l'échange de ma mauvaise pièce contre sa bonne. |
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
- **La profondeur.** Un 1500 calcule 4 demi-coups dans le calme, jusqu'à 8 dans le forcé. Deux choix pour Sébastien :
  - **A** : le calcul lui-même borné à 4 / 8 demi-coups — fidèle à l'humain, mais plus faible (environ 1200-1400) ;
  - **B** : le calcul actuel, mais **seulement sur les coups produits par l'arbre**, et la phrase limitée à 4 (ou 8)
    demi-coups — l'humain est dans le choix des candidats et dans la phrase, pas dans la force du calcul.
  Le pilote et l'Expert recommandent **B**.

## Ce que ça change par rapport au coach actuel

Aujourd'hui : le coach calcule **tous** les coups, choisit le meilleur score, puis cherche des mots. Demain : il ne
calcule que les 3 à 5 coups que l'arbre a produits, chacun avec sa raison **avant** le calcul. Le calcul départage, il ne
choisit plus. Un coup que l'arbre n'a pas produit mais que le calcul trouve bien meilleur (un pion ou plus) est joué et
journalisé comme un **trou de l'arbre** : c'est l'arbre qu'on corrige, pas le coup.

La barre ne bouge pas : au moins 50 % contre Maia-1500, moins de 5 % de bévues. On accepte de perdre du niveau, pas la
tactique de base (étapes 1 et 2).
