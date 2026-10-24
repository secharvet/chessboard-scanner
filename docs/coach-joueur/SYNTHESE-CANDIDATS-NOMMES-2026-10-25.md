# Synthèse — le coach choisit parmi des coups qui ont une raison (piste 2)

25 octobre 2026. Thèse du pilote (message du 25 oct.) → antithèse de l'Expert (`livrables/antithese-candidats-nommes.md`,
commit 4db868b) → cette synthèse. Itération 2 sur 3. Rien n'est envoyé au Dev chef avant la lecture humaine de référence.

## Le principe (GE, 25 oct.)

Le coup choisi a sa raison **avant** d'être choisi. Le coach ne passe plus tout en revue : il propose quelques coups qui ont
chacun une raison, puis les compare par sa propre recherche courte. L'explication = la raison du coup choisi + ce que la
comparaison a montré (« si j'avais joué X, il répondait Y et je perdais Z »).

## Ce qui est retenu

**1. Les coups proposés, dans l'ordre d'un entraîneur.**
- *Radar tactique, toujours présent, hors plafond* : les prises qui gagnent du matériel ; les **reprises** (référence :
  le matériel avant sa prise) ; les **parades**, trouvées par un test — tout coup légal après lequel la ligne de sa menace
  ne gagne plus (c'est ce qui trouve 16.Fb5+ contre …Txg2+) ; les échecs qui mènent à un gain.
- *Puis trois au plus, une famille d'abord chacune* : **prophylaxie** (son meilleur coup au coup nul, quand ce n'est pas
  une menace de matériel : le coup qui le rend mauvais d'au moins 50) ; pas de plan (catalogue) ; attaquer une pièce
  (menace réelle, sinon « je lui propose l'échange ») ; développement ; **ma pire pièce** (au plus 2 cases sûres, fou gêné
  par ses pions fixés, mineure encore chez elle après le coup 10) ; **simplifier** quand j'ai au moins un pion de plus.
- Livre tant qu'on y est.

**2. La comparaison.** Recherche courte sur ces coups seulement à la racine ; en dessous, l'adversaire a tous ses coups
(sinon on joue de l'espoir). La phrase ne cite que les 2 à 4 premiers demi-coups.

**3. Le trou du générateur** (un coup non proposé est meilleur d'un pion ou plus, contrôle par la recherche actuelle à
400 000 positions) : on le joue. D'abord on essaie de le nommer ; sinon : « Mon calcul trouve mieux que mes idées : M. Si
je jouais X, … ». Chaque trou est journalisé ; au-delà de 5 % de trous, on revoit le générateur.

**4. La phrase comparative.** Seulement si l'écart est d'au moins 80 (affichage) **et** se lit sur l'échiquier (matériel
compté, mat, roque perdu) ; sinon « Les deux se valent. J'ai pris M, parce que (raison) ». Au conditionnel, un seul coup
écarté, jamais « candidat », « ligne », « réfutation », « score ». Sa suite est rejouée et vérifiée ; flèches d'une autre
couleur sur le site.

**5. La barre ne bouge pas** : ≥ 50 % contre Maia-1500, < 5 % de bévues. On accepte de perdre du niveau, pas la tactique
élémentaire.

## L'ordre des travaux

1. **Lecture humaine de référence** (en ligne : `lecture.html`) — 20 coups de la série 4d5e252 hors livre, 5 calculs,
   5 défenses, 10 coups calmes, graine 20261025, trois questions (vrai, utile, compris par un 1500). Par Sébastien ou Marc.
2. **Mesurer avant de construire** : le générateur seul, sur les 605 positions de la série. Combien de fois le coup
   actuel est-il proposé ? et le meilleur coup de Stockfish (prof. 18, un fil) ? Si le coup actuel manque plus d'une fois
   sur cinq, le niveau chutera : on revoit le générateur avant d'aller plus loin. (Une heure de moteur.)
3. Seulement ensuite : la comparaison, la phrase, puis une partie, puis la même lecture humaine sur les nouveaux récits.

## Réserve assumée

Sans structure reconnue, beaucoup de coups calmes ne diront que leur raison (« ma pire pièce, le fou c1, n'a que deux
cases ») : la comparaison ne parle que si l'écart se voit. C'est honnête ; la lecture humaine dira si ça suffit.
