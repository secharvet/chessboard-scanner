# À lire en premier — l'épreuve du jeu, en une page et sans jargon

Écrit pour l'auteur. Les preuves sont dans `RAPPORT-EPREUVE-DU-JEU-2026-10-20.md`.

## La question

Si un élève applique à la lettre les plans du livre, est-ce qu'il y perd quelque chose par rapport à un champion qui joue
comme il veut ? On a joué des parties entières : le coach reconnaît la structure et dicte le plan du livre, Stockfish
l'exécute du mieux qu'il peut, un autre Stockfish joue en face librement. À chaque plan, on mesure ce qu'il a coûté par
rapport à ce que le champion aurait joué seul. La barre, fixée avant la première partie : **un quart de pion par partie
en médiane, un demi-pion en moyenne, et ça doit tenir avec deux versions de Stockfish.**

## La réponse

**Ça passe, avec les deux moteurs.** Douze cents parties (six cents par moteur). Suivre le livre coûte un dixième de pion par
partie en médiane, un quart en moyenne ; les deux moteurs donnent la même moyenne au centième près. **La théorie des plans,
appliquée correctement, ne coûte presque rien.**

Trois réserves, dans l'ordre d'importance :

1. **Le coach qui « choisit son plan au prix » ne fait pas mieux que celui qui suit le livre.** Il joue la même partie neuf
   fois sur dix. Le professeur machine n'ajoute rien au livre, sur ce lot.
2. **Une partie sur quinze tourne mal sous le coach, une sur cent sans lui.** C'est presque toujours au même endroit : quand
   le coach joue les Noirs dans la Française d'avance et dans la Panov, c'est-à-dire le camp qui subit la structure. Le
   coupable le plus fréquent : les ruptures …f6 et …f5 contre la chaîne e5, qui coûtent chacune un quart de pion mais
   reviennent souvent. L'Expert doit lire ces parties coup par coup pour savoir si le livre a tort ou si le coach s'accroche.
3. **Le coach ne parle qu'un coup sur cinq.** Le reste du temps il reconnaît la structure mais n'a plus de plan à proposer.
   Le critère passe sur ce qu'il dit, pas sur ce qu'il tait.

Et une leçon : **partie par partie, les deux moteurs ne sont pas d'accord** (une fois sur deux, ils ne disent même pas si le
plan a coûté ou rapporté). Sur deux cents parties, ils disent exactement la même chose. Le coach pourra dire « ce plan coûte
en moyenne un quart de pion dans cette structure », jamais « ce plan t'a coûté 0,4 dans cette partie ».

## Ce que ça ne dit pas encore

- Si le résultat tient quand on secoue l'instrument (autres graines, autre profondeur) : c'est le lot de perturbation,
  spécifié, en attente de l'accord du GE. Le faisceau, lui, avait passé sur un tirage et pas sous secousse.
- Si le coach rend un élève meilleur : on a mesuré la théorie avec un exécutant parfait. L'élève de 1500, c'est l'épreuve
  Maia.

## Ce qui attend ton go

1. Les deux positions à problème chez l'Expert (lecture seule, aucun calcul long).
2. Le lot de perturbation, après accord du GE.
3. Puis : retouches de l'instrument, plan de service après abandon, épreuve Maia, et plus tard la vitrine Lichess.
