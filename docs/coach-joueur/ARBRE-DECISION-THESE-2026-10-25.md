# Arbre de décision du joueur « humain » — thèse du pilote

25 octobre 2026. Demande de Sébastien : « un joueur humain : dans une position donnée, on évalue d'abord ses menaces, puis
mes attaques, puis on élimine et on élague en estimant chaque option ; un arbre de décision, basé sur la théorie du jeu
d'échecs ». Itération 1 sur 3 (thèse → antithèse de l'Expert → synthèse). Rien n'est codé.

## Sur quoi l'arbre s'appuie

- **de Groot (1946), Kotov (*Pensez comme un grand maître*, 1971)** : le joueur ne regarde que quelques coups candidats,
  trouvés avant tout calcul, puis calcule chacun une fois, proprement (« l'arbre de variantes »).
- **Heisman (*Real Chess*)** : à chaque coup, dans cet ordre, **ses** échecs, prises et menaces, puis **mes** échecs,
  prises et menaces ; et avant de jouer, la vérification de sécurité (« après mon coup, que peut-il me faire ? »).
- **Steinitz / Lasker** : celui qui est mieux doit attaquer là où il est mieux ; celui qui est moins bien doit défendre et
  chercher le contre-jeu ; à égalité, on améliore.
- **Nimzowitsch** : la prophylaxie — demander d'abord « que veut-il faire ? » et l'en empêcher.
- **Silman (*Reassess Your Chess*)** : le bilan des déséquilibres (matériel, sécurité des rois, structure de pions, pièces
  mineures, espace, colonnes ouvertes, développement/initiative) désigne le plan.
- **Dorfman (*La Méthode*)** : qui est mieux « statiquement » décide s'il faut forcer le jeu ou le calmer.
- **Finales** : les livres (Averbakh, Dvoretsky) ; le roi devient une pièce, le pion passé est la question centrale.

## L'arbre

Chaque nœud **produit des coups candidats avec leur raison**, il ne décide pas seul : un contre-coup plus fort qu'une
parade peut battre la parade. L'ordre des branches est un ordre de **priorité**, pas d'arrêt. À la fin, tous les candidats
retenus passent par la comparaison (étape 4) et par la vérification de sécurité (étape 5).

### Étape 0 — Lire son dernier coup
Qu'a-t-il changé ? Une pièce qui bouge attaque de nouvelles cases, en découvre d'autres, en abandonne (ce qu'elle défendait).
Compte du matériel. Position des deux rois. Pièces non défendues des deux camps. *(C'est la lecture, pas encore un choix.)*

### Étape 1 — SUIS-JE EN DANGER ? (ses menaces, les plus graves d'abord)
| | Question | Si oui → candidats |
|---|---|---|
| 1a | Suis-je en échec ? | Seuls les coups légaux : prendre la pièce qui fait échec, s'interposer, fuir du roi. |
| 1b | Menace-t-il mat (en 1, en 2) ? | Toute parade qui enlève le mat. Priorité absolue. |
| 1c | Une pièce lourde (dame, tour) est-elle en prise, ou attaquée par une pièce de moindre valeur ? | La sauver (fuir, défendre, s'interposer, contre-attaquer plus gros). |
| 1d | Une pièce mineure ou un pion est-il en prise sans défense suffisante ? | Idem. |
| 1e | Prépare-t-il une tactique (fourchette, clouage, enfilade, promotion, attaque de mat) ? — *réponse : ce qu'il jouerait si je passais mon tour, et ce que ça lui gagne* | La parade : tout coup après lequel **sa ligne ne gagne plus** (test, pas modèle). |

Règle : à toute menace, on ajoute aussi les **contre-menaces plus fortes** (étape 2) : un échec, un mat, une prise plus
grosse que ce qu'il menace. On ne pare pas une menace de pion quand on a un mat.

### Étape 2 — AI-JE UN COUP FORT ? (mes coups forcés : échecs, prises, menaces)
| | Question | Si oui → candidats |
|---|---|---|
| 2a | Ai-je un mat (en 1, en 2, en 3) ? | Le mat. Fin. |
| 2b | Ai-je une prise qui gagne du matériel ? (pièce lourde d'abord ; compte des prises/reprises sur la case) | La prise. |
| 2c | Ai-je un échec qui gagne (fourchette du roi et d'une pièce, échec à la découverte, roi attiré) ? | L'échec. |
| 2d | Puis-je créer une menace qu'il ne peut parer sans concession (double attaque, attaque d'une pièce non défendue, pion qui avance vers la promotion, attaque du roi quand il est mal protégé) ? | La menace. |
| 2e | Ai-je une tactique nommée (clouage, enfilade, surcharge, déviation, pièce enfermée) ? | Le coup du motif. |

Chaque candidat de l'étape 2 est **vérifié** : sa meilleure réponse (ses échecs, prises, menaces) ne doit pas annuler
le gain. Un gain qui ne survit pas à sa meilleure réponse n'est pas un gain.

### Étape 3 — RIEN DE FORCÉ : QUEL EST MON PLAN ?
On n'arrive ici que si les étapes 1 et 2 n'ont pas donné de candidat qui s'impose (ou pour compléter la liste).

**3a — Où en est la partie ?**
- *Ouverture* (pièces encore chez elles) : développer la pièce qui ne l'est pas, roquer, prendre le centre, ne pas
  rejouer une pièce déjà jouée, ne pas sortir la dame trop tôt. Le livre tant qu'on y est.
- *Structure reconnue* (pion isolé, Carlsbad, chaîne, majorité, colonne ouverte…) : le plan du catalogue.
- *Finale* (dames échangées, peu de pièces) : activer le roi, créer ou pousser un pion passé, bloquer le sien, mettre la
  tour derrière le pion passé, les règles des livres de finale.

**3b — Qui est mieux, et en quoi ?** (le bilan des déséquilibres, chaque ligne « pour moi / pour lui / égal »)
matériel · sécurité des rois · structure de pions · pièces mineures (bon fou / mauvais fou / cavalier bien posté) · espace
· colonnes et diagonales ouvertes · développement et initiative.

**3c — Donc :**
| Situation | Conduite | Candidats |
|---|---|---|
| Je suis mieux en matériel | Simplifier, éviter les complications | Échanger les pièces (pas les pions), consolider. |
| Je suis mieux en position | Attaquer là où je suis mieux | Le coup qui exploite le déséquilibre (ouvrir la colonne, pousser le levier, amener une pièce de plus sur le roi). |
| Je suis moins bien | Défendre, ne rien concéder, chercher le contre-jeu | Consolider le point faible, échanger la pièce qui attaque, chercher une menace. |
| Égal, rien à forcer | Améliorer | **Ma pire pièce** (celle qui a le moins de cases utiles) vers une meilleure case ; **prophylaxie** : « que veut-il faire ? » et l'en empêcher ; un pion levier qui ouvre le jeu là où je suis mieux. |

### Étape 4 — COMPARER (Kotov)
Trois à cinq candidats au plus, chacun avec sa raison. Pour chacun : **sa** meilleure réponse (ses échecs, prises,
menaces d'abord), quelques demi-coups, et une estimation (matériel, puis bilan). On élague : un candidat dont la réponse
coûte du matériel est écarté avec sa réfutation ; entre les survivants, le plus fort ; à égalité, celui dont la raison
est la plus haute dans l'arbre (parer > gagner > plan > améliorer).

### Étape 5 — VÉRIFIER AVANT DE JOUER (Heisman)
Après le coup choisi : a-t-il un échec, une prise, une menace que je n'avais pas vue ? Ma pièce déplacée défendait-elle
quelque chose ? Si oui, retour à l'étape 4 avec le candidat suivant.

### Étape 6 — DIRE
La phrase = la raison du candidat (le nœud de l'arbre qui l'a produit) + ce qui a départagé (« j'ai pensé à X, mais il
répondait Y et je perdais Z »). La phrase n'est plus une traduction du score : elle est le chemin suivi dans l'arbre.

## Ce qui existe déjà et ce qui manque (pour l'Expert, pas pour le Dev chef)

Existe : la menace par le coup nul (1e), la recherche courte avec quiescence (compte des prises, 2b et étape 4),
le livre, les structures et plans du catalogue (3a), les termes du bilan (3b), la vérification des phrases.
Manque : 1a–1d comme questions explicites (aujourd'hui noyées dans la recherche), la recherche de mat courte (2a),
le compte de prises/reprises sur une case (2b), les menaces à créer (2d), les motifs nommés (2e), le bilan « qui est
mieux » qui décide de la conduite (3c), la pire pièce et la prophylaxie, l'étape 5 comme étape séparée, et surtout la
**génération des candidats avant le calcul** au lieu du calcul de tous les coups.

## Questions à l'Expert

1. L'ordre des étapes 1 et 2 : un entraîneur fait-il « ses menaces » avant « mes coups forts », ou l'inverse (Heisman
   met ses propres échecs/prises/menaces d'abord) ? Quel ordre pour un 1500 ?
2. L'étape 3c : le tableau Steinitz/Lasker est-il juste et suffisant ? Comment un joueur décide-t-il « je suis mieux »
   sans un score ?
3. Les questions de l'étape 1 et 2 sont-elles les bonnes, ni trop (un humain n'en pose pas vingt) ni trop peu ?
4. Dans la comparaison, combien de demi-coups un joueur de club calcule-t-il vraiment ? 2 à 4 ? Plus dans le forcé ?
5. Ce que l'arbre ne couvre pas et qu'un entraîneur poserait.
