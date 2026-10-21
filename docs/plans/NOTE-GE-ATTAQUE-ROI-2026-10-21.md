# Pour le GE : pourquoi « une distance pour l'atome regroupement » ne marche pas telle quelle (21 octobre 2026)

Ta proposition (réponse au rapport du lot 1 bis, § 7.2) : donner une distance à l'atome regroupement, pour que le coach
voie arriver une attaque de roi, et la vérifier sur la Panov coach Noirs, 50 parties, avant de la verser dans le coach qui
guidera Maia. Voici ce que l'essai a montré, avant toute partie jouée. Détail : `REGROUPEMENT-2026-10-21.md`.

## 1. Le cas à guérir

Lot 1 bis, SF 19 : la Panov coach Noirs perd 4 parties sur 10 dans chaque bras ; c'est presque toute la queue. La lecture
de l'Expert : le coach joue …Cd5 (le blocus, LE plan du livre) au moment où les Blancs ont Dd3 + Fh6 contre le roque ;
le cavalier f6 était le seul défenseur de g8 et h7 ; l'attaque passe.

## 2. Premier obstacle : la distance de proximité ne voit pas cette attaque

L'atome regroupement existant compte les pièces adverses à distance ≤ 3 du roi. Dans les positions de faute, il ne voit
que Fh6 : la dame d3 attaque de loin (diagonale vers h7) et lui échappe. Une « distance » construite sur la proximité ne
peut donc pas annoncer cette attaque.

## 3. Ce que l'Expert a mis à la place

- **Attaque arrivée** : au moins deux pièces adverses (dame comprise, ni pion ni roi) attaquent la zone du roi (trois
  colonnes, sa rangée et deux devant), dont une **au contact** (une case voisine du roi).
- **Remède : un veto, pas un plan de défense.** Sous attaque arrivée, un pas de plan qui baisse les défenses autour du
  roi est interdit ; le plan est suspendu, pas abandonné, et reprend quand l'attaque retombe. Pas de plan « regrouper »
  adopté : la défense que préfère le moteur dans ces positions n'est pas un regroupement (prof. 30 : Cg4 −0,86 en tête,
  Ff8 « regroupement » −1,75, pire que Cd5).
- Sur les six positions de Cd5 lues par l'Expert, ça trie juste : allumé dans les quatre fautes, éteint dans le Cd5 bon ;
  le veto interdit Cd5 exactement là.

**Mais ce critère a été trouvé sur ces six positions mêmes.** D'où un test écrit d'avance : le faire tourner en
observateur (sans jouer) sur les 1 200 parties du lot 1 bis.

## 4. Le test d'avance a échoué

1. **Le prédicat seul est un épouvantail** : « attaque arrivée » s'allume dans 91,5 % des parties non perdues (un quart
   des coups du coach). Deux pièces qui regardent la zone dont une au contact, c'est presque toujours vrai.
2. **Le veto (ce qui agit) n'est sélectif qu'après deux retouches venues des données** :
   - un coup qui *coupe* l'attaque n'est pas vetoé (Carlsbad Noirs : Cf6-e4 bouche la diagonale du Fd3 ; sans la retouche,
     54 parties sur 60 vetoées) — de doctrine (l'interposition), mais trouvée en regardant ;
   - un coup *forcé* (parade, reprise) ne se vetoe jamais — conformité à ta règle « le forcé d'abord », pas un ajustement.
   Après les deux : un pas vetoé dans 4,7 % des parties non perdues contre 20,5 % des perdues ; Panov Noirs, 7 parties
   touchées dont 6 perdues — les vrais coupables. **Ces chiffres sont des contrôles de cohérence, plus une preuve.**
3. **Collatéral non résolu : Tarrasch ouvert, coach Noirs, 19 parties touchées (2 perdues)**, presque toutes en
   interdisant …Dd6, la batterie propre des Noirs, contre une « attaque » blanche de deux fous sans dame. L'Expert refuse
   d'ajouter une troisième condition trouvée sur ces mêmes parties (l'erreur des repoussoirs). Une seule idée, écrite
   avant d'être mesurée, testable seulement sur des parties neuves : **pas d'attaque de roi sans la dame adverse**.

## 5. Ce que nous proposons

- Tester quand même le veto **sur la Panov seule** : coach Noirs, SF 19, A + veto contre A, 50 parties aux mêmes graines,
  veto sans les coups forcés. Critère écrit d'avance : parties perdues en A et sauvées avec le veto contre l'inverse
  (comptées en paires) ; coût apparié ≤ +0,10 ; chaque nouvelle défaite où le veto a agi relue une par une ; le prédicat
  « dame » en observateur sur ces 50 parties neuves.
- Même s'il passe, **ne pas le généraliser** aux autres départs sur ces preuves, et **ne pas le verser** dans le coach qui
  guidera Maia sans une mesure sur parties neuves.
- État : le veto est codé derrière une option (`--regles AV`). Contrôle fait : sans l'option, cinq parties des lots 1 et
  1 bis rejouées identiques ; avec l'option, sur la seule Panov n° 1 (SF 19), le veto interdit la dernière chance Cd5
  (défenses du roi 5 → 3) et la partie finit à +0,01 au lieu de −9,98. Une partie, une anecdote : rien d'autre n'est joué.

## 6. Questions

1. Le test Panov seul, avec un veto qu'on sait non généralisable, vaut-il les 50 parties ? Ou faut-il d'abord une
   définition de l'attaque qui passe un test hors échantillon (par exemple la condition « dame » sur des parties neuves) ?
2. Ta « distance » visait à voir l'attaque **avant** qu'elle arrive. L'Expert montre que déclencher à un coup du contact
   aurait interdit le seul bon Cd5 des neuf parties (le Ff4-h6 est toujours à un coup). Faut-il abandonner l'anticipation
   et ne garder que l'attaque présente ?
3. Faut-il retenir l'enseignement général : un plan du livre peut être juste et son moment faux, et le moment se lit
   dans la sécurité du roi plutôt que dans le plan lui-même ?
