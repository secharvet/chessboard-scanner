# Antithèse : l'arbre de décision du joueur « humain » (thèse du pilote 1a32b53, itération 1/3) — Expert échecs, 25 octobre 2026

L'arbre est le bon. C'est la méthode qu'on enseigne au club : lire son coup, ses menaces, mes coups forts, le plan,
comparer, vérifier. Je ne propose pas d'autre arbre. Mon contre-pied porte sur **quatre endroits où l'arbre, appliqué à
la lettre, ferait jouer faux**, puis sur les cinq questions.

## Les quatre endroits où l'arbre jouerait faux

### 1. On ne décide pas par le camp, on décide par le bilan net
L'arbre lit dans l'ordre « ses menaces » puis « mes coups forts ». C'est juste **pour regarder**. Mais **pour choisir**,
l'ordre de priorité ne doit pas suivre le camp : il doit suivre le **bilan net**, ce que je gagne moins ce qu'il me
gagne. Le désespéré (ma pièce est perdue, je la vends le plus cher possible) et le coup intermédiaire (avant de
reprendre, un échec ou une menace plus grosse) sont exactement les deux fautes d'un 1500. Un arbre qui pare d'abord,
puis regarde ses propres coups, enseigne ces deux fautes.

Règle : l'étape 1 et l'étape 2 produisent ensemble une seule liste. On la classe par grandeur :
1. Je suis en échec : seuls les coups légaux.
2. J'ai un mat.
3. Je pare son mat.
4. Le reste au bilan net de matériel compté, après sa meilleure réponse.

Il faut un nœud explicite **« avant de reprendre : ai-je mieux ? »** (le coup intermédiaire). C'est le premier qui
manque.

### 2. « En prise » demande un compte qui sait les clouages
Le compte des prises et reprises sur une case (2b, 1c, 1d) est ce que fait un joueur. Mais le compte simple se trompe
dès qu'un défenseur est cloué, surchargé, ou soutenu en rayon X. Un humain y pense quand il calcule, pas quand il compte.
Règle : le **compte** sert à engendrer le candidat et à dire la phrase (« il l'attaque deux fois, je la défends une
fois »). C'est la **recherche courte avec quiescence** qui décide. Si les deux ne sont pas d'accord, on ne dit pas « je
compte », on dit ce que la ligne montre. Sinon, le coach donnera de faux comptes avec assurance.

### 3. Le tableau Steinitz-Lasker oublie le cas où je suis moins bien en matériel
« Mieux en matériel : simplifier », c'est juste. Mais le cas inverse manque : **moins bien en matériel**, on fait le
contraire. On garde les pièces, on évite les échanges, on complique, on cherche l'attaque. Ce n'est pas « défendre ».
Et il manque surtout **la distinction de Dorfman**, que la thèse cite mais n'utilise pas :
- **un avantage dynamique** (développement, initiative, roi adverse au centre) se périme : il faut agir maintenant,
  ouvrir le jeu ;
- **un avantage statique** (structure, mauvais fou, case forte) ne se périme pas : on joue lentement et on évite les
  complications.

C'est la ligne du tableau qui décide « forcer ou calmer ». C'est aussi la règle d'ouverture la plus utile à un
débutant : « en avance de développement, ouvre le centre ». Avec une précaution que nous avons déjà mesurée (w-01 après
8…c5, prof. 18) : O-O vaut +1,24, la rupture d5 tout de suite vaut −1,19. On met d'abord **son** roi à l'abri, ensuite
on ouvre.

Le tableau corrigé :

| Situation | Conduite |
|---|---|
| Mieux en matériel | Échanger les pièces (pas les pions), consolider, ne rien compliquer |
| Moins bien en matériel | Garder les pièces, compliquer, attaquer le roi ou créer un pion passé |
| Mieux, avantage dynamique (développement, roi adverse au centre) | Agir tout de suite : ouvrir le centre, une fois mon roi à l'abri |
| Mieux, avantage statique (structure, case forte, mauvais fou adverse) | Jouer lentement : améliorer, fixer la faiblesse, prophylaxie |
| Moins bien en position | Échanger ses meilleures pièces, consolider le point faible, chercher une menace |
| Égal | Pire pièce, prophylaxie, levier là où je suis mieux |

### 4. Les règles d'ouverture ne servent pas à élaguer
« Ne pas rejouer une pièce », « ne pas sortir la dame » : ces règles ne doivent **jamais élaguer** un candidat. Elles
servent seulement à départager, et à engendrer des candidats (développer). Sinon l'arbre écarte 4.Cxe4 (pièce rejouée)
ou une reprise de dame. Elles ont leurs exceptions dès qu'il y a une prise, et l'étape 1 passe avant elles.

## Les cinq questions

**Q1. L'ordre des étapes 1 et 2.**
Heisman commence par « que fait son dernier coup ? » (toutes ses menaces), puis passe aux candidats, avec les échecs,
prises et menaces des deux camps. Pour un 1500, je garde donc **ses menaces d'abord pour regarder**. La faute
typique à ce niveau, c'est de ne pas voir ce qu'il menace. Mais **on choisit par le bilan net** (point 1 ci-dessus). La
phrase suit l'ordre de lecture : « Il menace …Cxe4. J'ai mieux : …, et je gagne … ».

**Q2. « Je suis mieux » sans score.**
Un joueur décide en trois regards, dans cet ordre. Chacun est un critère vérifiable, pas un score :
1. **Le matériel compté** (1-3-3-5-9). Un point d'écart ou plus, c'est « mieux en matériel ». Avec la paire de fous à
   +½, c'est tout.
2. **Les rois.** Lequel ne peut plus roquer, lequel a des pions de roque avancés ou manquants, de quel côté sont les
   pièces adverses près du roi.
3. **Le reste** (Silman), chaque ligne « pour moi / pour lui / égal » sur des faits nommables :
   - développement : écart d'au moins 2 pièces mineures ou plus dans l'ouverture ;
   - pions faibles : isolé, doublé, arriéré sur une colonne semi-ouverte ;
   - mauvais fou ;
   - colonne ouverte tenue ;
   - case forte occupée ;
   - espace.

« Mieux en position », c'est au moins deux lignes de plus pour moi que pour lui, sans ligne de roi contre moi. Le
score de la recherche reste caché. Il sert seulement de **garde-fou** : si le bilan dit « mieux » et que le score dit
« moins bien » d'un pion ou plus, on ne dit pas « je suis mieux ». Chaque phrase doit rester vraie.

**Q3. Le nombre de questions.**
Dix questions (1a à 1e, 2a à 2e) suffisent pour une machine. Pour un humain, c'est la liste de Heisman, ni trop ni trop
peu. Deux fusions : 1c avec 1d (« une pièce à moi en prise, la plus grosse d'abord ») et 2b avec 2c, car c'est la
grandeur qui ordonne, pas le type de pièce. Trois ajouts, typiques du club :
- **1f. Ma dernière rangée est-elle faible ?** Le mat du couloir est la tactique perdante la plus fréquente à 1500.
  La parade préventive, c'est un trou d'aération (h3, …h6), dit comme tel.
- **1g. Une pièce à moi est-elle clouée, ou sur la même ligne que mon roi ou ma dame ?** C'est un clouage ou une
  enfilade à venir.
- **2f. Ses pièces non défendues.** « Une pièce non défendue finit par tomber » (Nunn). C'est la source principale des
  menaces à créer (2d).

Et le nœud **« avant de reprendre »** (point 1). Une seule question est dite par coup : celle du nœud qui a produit le
coup. Les dix autres restent silencieuses.

**Q4. La profondeur réelle.**
De Groot a montré qu'un joueur de club et un maître calculent à des profondeurs proches. Ce qui les sépare, c'est le
choix des candidats. Un 1500 calcule en pratique :
- dans le calme, **2 coups de chaque camp** (4 demi-coups) ;
- dans le forcé, **jusqu'à 8 demi-coups**, tant que chaque coup à moi est un échec, une prise ou une menace de mat, et
  que ses réponses sont forcées (au plus deux coups légaux, ou une reprise). `forcing.mjs` le fait déjà.

Au bout, on fait un compte de prises (la quiescence). Mais ici, un choix revient à Sébastien, parce qu'il change le
niveau :
- **Option A, calcul humain borné** (4 demi-coups dans le calme, 8 dans le forcé) : fidèle à la lettre, mais nettement
  plus faible. Je m'attends à un jeu d'environ 1200 à 1400, et à plus de bévues que les 5 % visés.
- **Option B, recherche actuelle restreinte aux candidats à la racine** : l'arbre décide quoi regarder et donne la
  raison, la recherche calcule chaque candidat proprement (« calculer une fois, proprement », Kotov). La phrase ne cite
  que les 4 premiers demi-coups, ou les 8 du forcé.

Je recommande **B**. Le joueur humain est dans le choix des candidats et dans la phrase, et la profondeur de calcul ne
se voit pas dans ce qu'il dit. On peut mesurer A comme variante sur les 605 positions, sans rien jouer.

**Q5. Ce qui manque.**
- **Les échanges** : quelle pièce échanger (garder ses bonnes pièces, échanger ses mauvaises et ses meilleures à lui),
  et comment reprendre (vers le centre, sans doubler ses pions sans raison).
- **La course de pions en finale** : compter les tempos et la règle du carré, avant d'en pousser un.
- **La position qui va mal** : quand le bilan net est perdu de toute façon, choisir la ligne qui laisse le plus de
  problèmes à l'adversaire, pas la parade qui perd lentement. C'est rare, mais sinon l'arbre défend une position perdue.
- **L'étape 5 est le même test que l'étape 1** (la menace par le coup nul, après mon coup). Il faut y ajouter une seule
  question, « ma pièce déplacée défendait-elle quelque chose ? », c'est-à-dire le défenseur retiré. Pas une machinerie
  nouvelle.

## Sur l'abandon de la lecture humaine
C'est la décision de Sébastien, je la prends. Le critère « 15 sur 20 explications jugées fidèles par un humain » tombe
avec elle. Il faut le remplacer, sinon rien ne vérifie le sens des phrases. Je propose deux choses :
- **mes traques** : relecture coup par coup d'une partie entière à chaque version, comme les traques 1 à 3, en comptant
  les phrases fidèles ;
- **les gardes automatiques**, déjà en place (phrases remplies seulement depuis la trace, matériel recompté).

## Vérifications
- Aucune position nouvelle n'est citée.
- Le seul chiffre (w-01 après 8…c5 : O-O +1,24, d5 −1,19) vient de `grammaire-enrichie.md`. Il a été mesuré avec
  Stockfish 19, un fil, table vidée, profondeur 18.
- Les sources sont citées pour leur thèse, pas pour un coup.
