# Antithèse : « candidats nommés » (thèse du pilote, itération 1/3) — Expert échecs, 24 octobre 2026

Je suis d'accord avec le principe : le coup doit avoir sa raison **avant** d'être choisi. Je reprends les quatre points
ouverts, puis j'ajoute deux réserves que la thèse ne traite pas.

## (a) Les raisons génératrices : ce que dit un entraîneur

Un entraîneur de club apprend à regarder, dans cet ordre : **échecs, prises, menaces**, puis « que veut-il faire ? »,
puis « quelle est ma pire pièce ? ». La liste de la thèse en a l'essentiel. Il lui manque trois familles, et deux règles
sont à préciser.

**Trois familles à ajouter :**
1. **Prophylaxie : « ce qu'il veut faire »** (Nimzowitsch, Dvoretsky). C'est le meilleur coup adverse si je passais,
   quand ce coup n'est **pas** une menace de matériel : un clouage (…Fg4), un levier (…e5), une case d'entrée (…Cg4).
   Le candidat est le coup qui le rend mauvais. La raison n'est retenue que si, après mon coup, son coup coûte à
   l'adversaire au moins 50 cp de plus à ses propres yeux. Phrase : « Il voulait jouer …Fg4 : après h3, ce coup ne
   marche plus. » C'est la famille la plus utile à un 1500, celle que les débutants ignorent. Elle coûte une recherche
   du coup nul, qu'on fait déjà pour la menace. Exemple pris chez nous : 12.Fh6 rend le petit roque noir illégal (f8
   attaqué, vu dans la traque 3), c'est de la prophylaxie contre « roquer ».
2. **Reprendre.** C'est le coup le plus fréquent au club, et il n'entre pas dans « prises qui gagnent du matériel » :
   on ne gagne rien, on rétablit l'équilibre. Il faut l'écrire dans le radar, avec la règle de référence qu'on a déjà
   (le matériel avant sa prise). Sinon, le trou du générateur s'ouvrira dès le premier échange.
3. **Simplifier quand je suis devant.** Échanger des pièces quand j'ai du matériel en plus, c'est la première règle de
   finale qu'on enseigne. Le candidat est une prise qui échange une pièce de même valeur quand mon avance est d'un pion
   ou plus. Phrase : « J'ai un pion de plus : chaque échange me rapproche d'une finale gagnée. »

**Deux règles à préciser :**
- **La parade se trouve par un test, pas par un modèle.** Une parade n'est pas seulement fuir, défendre ou interposer.
  À 16.Fb5+, l'échec ne gagne rien, mais il pare …Txg2+ en déviant le fou (…Fd7). Le radar de la thèse (« échecs qui
  mènent à un gain ») ne l'engendrerait pas. Règle : est une parade tout coup légal après lequel la ligne de la menace
  ne gagne plus de matériel compté. Il faut une recherche courte pour chaque coup légal. C'est cher, mais seulement
  quand une menace existe.
- **« Pièce adverse à attaquer »** ne compte que si c'est une **menace réelle** : l'adversaire passant, la prise gagne
  du matériel compté. C'est la règle déjà adoptée (« attaque » contre « contester »). Sinon le candidat existe, mais sa
  raison est « je lui propose l'échange », pas « j'attaque ».
- **« Ma pire pièce »** demande une définition qu'un joueur reconnaît, pas un terme de placement renommé. Je propose :
  au plus deux cases sûres, ou un fou gêné par ses propres pions fixés sur sa couleur, ou une mineure encore sur sa case
  de départ après le coup 10. Le candidat est le coup qui lui donne le plus de cases sûres, ou qui la rapproche d'un
  avant-poste (`maneuvers.mjs` le calcule déjà). Sinon, on retrouvera « une meilleure case », la phrase que le débrief
  condamne.

**Le plafond de 5.** Avec la priorité « radar d'abord », une position tactique remplit les 5 places de prises, et il ne
reste plus de place pour le coup calme qui était juste. Dans l'ouverture, ce sont le livre et le développement qui
remplissent tout. Je propose : le radar **hors plafond** (toutes les prises qui gagnent, toutes les reprises, toutes les
parades), puis **au plus 3** coups pour les autres familles, un par famille d'abord. En pratique, on aura entre 3 et 8
candidats.

## (b) La recherche non restreinte sous la racine : juste

C'est juste, et ce n'est pas une trahison. Un humain choisit **ses** candidats, puis cherche la meilleure réponse de
l'adversaire, pas celle qui l'arrange. Kotov ne dit rien d'autre : l'arbre des candidats est le mien, les réponses
sont celles de l'adversaire. Restreindre l'adversaire, c'est jouer de l'espoir, et c'est la première cause de bévue au
club. Ce qui reste fidèle, c'est la raison du coup. Ce qui doit être vrai, c'est la réfutation.

Deux précisions :
- Sous la racine, mes propres coups sont aussi non restreints, et c'est juste aussi. « Je joue Cf3 parce qu'il défend
  e5 » reste vrai même si la ligne trouve ensuite une prise que je n'ai pas nommée.
- La phrase ne doit citer que les **deux à quatre premiers demi-coups** de la ligne. Au-delà, un 1500 ne suit plus.
  Si la conséquence (le matériel compté) n'arrive qu'après le 4e demi-coup, on ne fait pas de comparaison. On dit
  seulement la raison du coup choisi.

## (c) Le trou du générateur : le jouer, et le dire franchement

Le seuil d'un pion est celui de la bévue chez l'examinateur. C'est voulu : refuser ce coup, c'est **fabriquer une bévue
de ses propres yeux**. On accepte de perdre du niveau, pas de la tactique élémentaire (point 5 de la thèse). Je joue
donc le coup, mais en trois temps :

1. **Essayer de le nommer après coup**, avec les mêmes familles et un test un cran plus profond. Exemple : une prise
   qui gagne au 3e demi-coup, ou un coup calme qui crée une menace double. Si une famille le reconnaît, avec une raison
   **vérifiée**, c'est un candidat oublié : on le journalise comme « trou », on le joue avec sa raison, et on corrige le
   générateur.
2. **S'il reste sans nom**, on le joue et on le dit honnêtement : « Mon calcul trouve mieux que mes idées : {M}. Si je
   jouais {meilleur candidat}, {réfutation}. » Pas de « je n'avais pas vu » : le coach l'a vu, puisqu'il le joue. Le
   lecteur apprend quand même quelque chose, puisque la réfutation du candidat naturel est la leçon.
3. **Compter ces trous.** S'ils dépassent 5 % des coups, c'est le générateur qui est en cause, pas la règle.

Le seuil d'un pion est en **cp d'affichage** (règle × 100 / 213). La recherche de contrôle est la recherche actuelle à
400 000 positions. On paie donc deux recherches par coup, ce qui est acceptable pour une V1.

## (d) La phrase comparative : seuil et mots

**Seuil.** On compare seulement si l'écart est d'au moins **80 cp d'affichage**, comme notre règle de gain, **et** si la
réfutation se lit sur l'échiquier : matériel compté au bout de la ligne, un mat, ou un roque devenu impossible.
Une réfutation purement positionnelle (« il a plus de cases ») ne se vérifie pas à 1500 : on ne la dit pas. En dessous
du seuil : « Les deux se valent. J'ai pris {M}, parce que {raison}. »

**Mots.** On emploie le conditionnel, qui est le français naturel d'un club :
- « J'ai pensé à Cc3. Mais il répondait …Fb4, et je perdais le pion e4. Avec Cf3, rien de tel. »
- « Si je prenais en d5, il reprenait du cavalier et sa dame entrait en a5 : je perdais le fou. »

On n'emploie jamais « candidat », « ligne », « réfutation », « note », « score » ni « évaluation ». **Un seul** coup
écarté par phrase : le meilleur des écartés, ou, s'il est plus instructif, le coup naturel (une prise ou un échec).
Les flèches du coup écarté sont d'une autre couleur que celles du coup joué.

**Fidélité.** Le coup écarté doit vraiment avoir été cherché à la racine, et la réfutation est sa ligne principale
rejouée. Pas de comparaison avec un coup que le coach n'a pas regardé.

## Deux réserves que la thèse ne traite pas

1. **Mesurer avant de construire (moteur, pas de LLM).** Il faut faire passer le générateur seul, sans recherche
   restreinte, sur les 605 positions de la série. On compte :
   - combien de fois le coup actuel (400 000 positions) est parmi les candidats ;
   - combien de fois le meilleur coup de Stockfish y est (prof. 18) ;
   - combien de fois un trou de plus d'un pion apparaît.
   Si le coup actuel est absent plus d'une fois sur cinq, le niveau va chuter et le point 5 de la thèse tombe. Ça coûte
   une heure de calcul, et on le sait avant d'écrire la recherche restreinte. Je peux faire le côté Stockfish de cette
   mesure dès que le générateur existe.
2. **Le danger des mots creux revient par la famille « amélioration ».** Le débrief l'établit : sans structure reconnue,
   pas de plan. Le générateur sera donc le plus souvent radar + développement + « pire pièce ». La vraie valeur pour un
   élève, c'est la **comparaison** (piste 1), et elle ne parle que si l'écart se voit sur l'échiquier. Il faut s'attendre
   à ce que la plupart des coups calmes disent seulement leur raison, sans comparaison. C'est honnête. La lecture humaine
   dira si c'est assez.

## Sur la mesure humaine (point 6)

D'accord, et avant tout le reste. Je propose trois questions par coup, pas deux : **vrai / faux**, **utile / creux**, et
**un 1500 comprend-il ?** (oui / non). La troisième question sépare « juste mais savant » de « juste et clair », ce que
les deux premières ne font pas. Les 20 coups doivent être tirés au sort par sorte : environ 5 calculs, 5 défenses et
10 coups calmes. Sinon, les coups calmes, où le problème se trouve, seront sous-représentés.
