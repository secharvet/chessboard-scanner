# À lire en premier — la journée du 18 octobre, en une page et sans jargon

Écrit pour l'auteur, pas pour les agents. Les deux rapports (`RAPPORT-FILTRE-2026-10-18.md`, `RAPPORT-FAISCEAU-2026-10-18.md`)
contiennent les preuves ; cette page dit ce qu'on a fait, ce qu'on a trouvé, et ce qui reste.

## La question du matin

Le coach IA avait été fermé le 8 octobre parce qu'il ne savait pas choisir un plan : il récitait des généralités. L'idée
reprise ce matin, discutée avec le GM : **ne plus demander au logiciel de choisir le plan, mais de lui donner un prix.** On
prend une position et un plan connu (par exemple « l'attaque de minorité » dans la structure Carlsbad), on force Stockfish
à suivre ce plan pendant quinze coups — à chaque coup il n'a le droit de jouer que ce qui fait avancer le plan ou le
prépare —, l'adversaire joue librement, et à la fin on compare avec ce que Stockfish aurait fait tout seul. Zéro : le plan
est ce qu'il voulait de toute façon. Un demi-pion : le plan coûte un demi-pion. Coupé : le plan ne passe pas sans perdre du
matériel. Et on note le coup où le plan se réalise.

## Ce qu'il a fallu construire avant (la journée)

1. **Savoir ce qu'est « un pas vers le plan »** sans écrire de règle d'échecs. On a écrit une *distance* : combien de mes coups
   me séparent de la réalisation du plan (poussées de pion restantes, chemin d'une pièce, pions à retirer d'une colonne…),
   avec deux subtilités trouvées par relecture : une tour derrière son pion le soutient déjà (rayon X), et un pion bloqué
   par sa propre dame ne s'écarte pas. Un coup est un pas s'il fait baisser cette distance. Vérifié à l'œil sur dix positions
   classiques : a3 et Tb1 préparent bien b4-b5, Dd3 prépare bien Ce5, et les coups prématurés sont bien facturés par le moteur.
2. **Mesurer le bruit.** Combien les chiffres bougent quand on change de profondeur ou de moteur. Réponse : 25 centièmes de
   pion, et une leçon chère : nos scripts tournaient à plusieurs fils, ce qui rendait tout irreproductible — « un fil pour
   mesurer, les fils pour jouer » est maintenant écrit en tête du dépôt. Deux machines, même binaire, un fil : identique au
   centième de pion.
3. **Un test intermédiaire** (jouer un coup, la réponse adverse, et remesurer) qui a produit la première phrase de coach à la
   fois mécanique et juste : « **Fg5 se joue avant …h6, après c'est fermé** » — sortie des deux moteurs, sans règle écrite.
4. **Le faisceau** lui-même, avec un critère de réussite écrit avant la première ligne de code, relu par l'Expert (le sens
   échiquéen) et le Dev chef (la mécanique) avant la passe définitive — treize correctifs, dont un biais qui aurait fait
   passer des artefacts pour des contradictions du livre.

## Ce que le faisceau a donné

- Sur dix positions et trente-cinq plans, à profondeur 18 : **six positions sur dix** où le plan « du livre » est le moins cher
  ou à égalité ; sur les quatre autres, l'Expert a tranché à profondeur 30 : **trois fois le faisceau avait raison contre la
  désignation du livre** (dans la Carlsbad, Ce5 et b4-b5 sont *tous deux* des plans ; dans l'Espagnole sans dames, installer un
  cavalier en d5 vaut mieux que pousser e5 tout de suite ; dans l'avance, b4 est gratuit mais Fe3 après dxc5 l'est aussi),
  et **une fois la mesure s'était trompée** (un prix pris au milieu d'une ligne tactique, 1,3 pion d'erreur — correctif connu).
- Par la règle écrite d'avance, **le critère passe : neuf sur dix**. Mais il passe grâce à la clause de profondeur 30, pas
  grâce à la passe seule, et le rapport le dit.
- La vraie leçon : **le livre parle du plan de la structure, le faisceau mesure le plan de la position**, et l'écart entre les
  deux, c'est le moment — « le plan de cette structure est b4-b5, le plan de ce coup est Ce5, et b4-b5 revient quinze
  demi-coups plus tard pour un demi-pion ». Aucun livre ne dit ça position par position.
- La limite dure : **deux moteurs ne donnent le même prix qu'une fois sur deux** sur quinze coups. Un prix ne s'annoncera
  qu'à deux voix.

## Ta question du soir, et pourquoi elle compte

« Si l'adversaire transforme la structure en cours de route — je préparais une Carlsbad, dix coups plus tard c'est un pion
isolé — est-ce que la mesure dit bêtement "plan échoué" ? » Réponse : à moitié. Si le pion que le plan visait disparaît, elle
dit « sans objet », pas « échoué » ; et elle voit quand un coup sert un autre plan de la liste. Mais **la liste des plans est
figée au départ** : les plans de la nouvelle structure n'y sont pas. Le détecteur de structures existe (c'est la perception
d'octobre), il n'est pas branché ; et nommer le plan de l'adversaire (« les Noirs ont transformé la structure par …c5,
l'attaque de minorité est morte à ce coup-là ») n'est pas écrit. **Sur une partie entière, c'est la condition d'existence de
la prochaine étape** — avant toute épreuve du jeu, pas après.

## Ce qui reste, et qui attend ton go à froid

1. Trois retouches avant toute suite : le prix pris à un point calme après la réalisation ; l'horizon à vingt coups pour les
   plans de structure ; **le détecteur de bascule de structure** (ta question).
2. Puis l'épreuve du jeu : le coach choisit, Stockfish exécute sous contrainte, Stockfish libre en face, sur des parties
   entières — la théorie coûte-t-elle quelque chose ? Puis Maia : un joueur artificiel de 1500 guidé par le coach contre
   lui-même — le coach rend-il un élève meilleur ?
3. Trois positions à montrer à Marc en premier : celles où la grammaire a corrigé le livre.

Rien ne démarre sans ton mot. Et les chantiers de la plateforme (« ordinateur », couleurs d'échiquier, les deux refontes,
l'éventail dont tu as la maquette) sont là où tu les as laissés.
