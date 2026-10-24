# Le coach joueur : trois chantiers (thèse du pilote, 24 octobre 2026, soir)

Version 1, écrite avant toute ligne de code, soumise à l'Expert (thèse → antithèse → synthèse, trois itérations au
plus). Trois pages, une par chantier. Le but des deux semaines : une V0 qui joue une partie entière, seule, et qui
explique chacun de ses coups ; la partie se regarde sur le site.

---

## Page 1 — Le cerveau de verre (le joueur)

**Ce que c'est.** Un programme d'échecs à nous, petit et lisible, qui choisit ses coups par une évaluation faite de termes
nommés et une recherche courte. Chaque terme est un nombre qu'on peut lire et traduire en phrase. Le coup choisi est celui
dont la somme des termes, au bout de la ligne calculée, est la meilleure. L'explication est la lecture de cette somme.

**Pourquoi un programme à nous, et pas la bibliothèque du site.** La bibliothèque du site (chess.js) calcule 5 000
positions par seconde. Pour voir une fourchette à trois coups, il en faut des centaines de milliers. Le coach a donc son
propre échiquier (génération des coups, coup joué / coup repris), vérifié contre chess.js sur des milliers de positions
(comptage exhaustif des coups, « perft »). Objectif : 300 000 positions par seconde au moins.

**L'évaluation : les termes, dans l'ordre de l'évaluation classique de Stockfish (d'avant 2020).** Chaque terme vaut pour
le milieu de jeu et pour la finale, avec un mélange progressif selon le matériel restant (« tapered »).
1. **Matériel** : pion 1, cavalier 3,2, fou 3,3, tour 5, dame 9 (valeurs classiques arrondies ; paire de fous +0,3).
2. **Placement** (tables case par case) : un cavalier au centre vaut plus qu'au bord, un roi roqué vaut plus au milieu de
   jeu, un roi au centre vaut plus en finale.
3. **Pions** : isolé, doublé, arriéré, lié, passé (bonus croissant avec la rangée ; en finale, distance des deux rois et
   « règle du carré »).
4. **Pièces** : mobilité (cases sûres atteignables), avant-poste pour cavalier et fou, tour sur colonne ouverte ou
   semi-ouverte, tour sur la 7e, fou gêné par ses propres pions, pièce enfermée.
5. **Sécurité du roi** : abri de pions devant le roi, colonnes ouvertes près du roi, et un « danger du roi » = somme pondérée
   des pièces adverses qui attaquent la zone du roi (poids cavalier 1, fou 1, tour 2, dame 4), réduit par les défenseurs.
6. **Menaces** : pièces en prise ou attaquées par un pion, pièce clouée.
7. **Espace** (milieu de jeu) : cases du camp adverse contrôlées derrière nos pions.
8. **Finales** : mat du roi seul (« mop-up » : pousser le roi adverse au bord, rapprocher le nôtre), opposition, règle du
   carré, pion passé soutenu par le roi, matériel insuffisant, fous de couleurs opposées (nulle probable).
9. **Plan** (notre grammaire) : la structure est reconnue (Carlsbad, pion isolé, chaîne e5, etc.) ; les plans connus de
   cette structure sont instanciés ; un coup qui rapproche le plan adopté reçoit un bonus plafonné (30 centièmes). C'est
   un terme comme les autres : le plan ne décide jamais contre la tactique, il départage les coups calmes.
10. **Livre** (ouverture) : si la position est dans un de nos trois livres, un coup du livre reçoit un bonus (20
    centièmes) et sa raison écrite dans le livre devient la phrase. La recherche vérifie quand même le coup : s'il perd
    plus de 50 centièmes à ses propres yeux, le coach joue son propre coup et le dit.
Les poids partent de ceux de Stockfish classique quand ils sont simples, arrondis sinon ; la table des poids est publiée.

**« Savoir s'arrêter ».** À chaque coup de plan, le coach note ce qu'il lui coûte selon sa propre évaluation (l'écart avec son
meilleur coup hors plan). Quand le cumul dépasse un pion, le plan est abandonné et il le dit. Ce sont ses coûts, pas ceux
de Stockfish.

**La recherche.** Approfondissement itératif, alpha-bêta, recherche de quiescence (prises, promotions, échecs au premier
pli), ordre des coups (coup de la table, prises par valeur, « killers »), table de transposition, prolongation sur échec.
**Budget fixe en nombre de positions** (par exemple 400 000) et un seul fil : même position, même coup, toujours. Profondeur
attendue : 5 à 7 demi-coups au milieu de jeu, 10 et plus en finale.

**La trace, qui sert à parler.** Pour chaque coup : les candidats de la racine avec leur score, la ligne principale de
chacun, le détail des termes au bout de cette ligne, la menace adverse (ce que l'adversaire ferait si on passait : une
recherche courte avec le trait à lui), et les motifs tactiques nommés sur notre propre ligne (fourchette, clouage,
déviation, surcharge, intermezzo, défenseur unique, schéma de mat : le module existant `coach/motifs.mjs`).

**Ce qui est fermé d'avance.** Pas de réseau, pas d'apprentissage, pas d'évaluation de Stockfish dans le choix du coup.

---

## Page 2 — La parole (l'explication)

**Règle d'or.** La phrase n'est pas un commentaire : c'est la trace du calcul mise en français. Chaque phrase dit **le coup,
la raison, et le coup qu'il a battu**. Si le coach ne peut pas produire la phrase depuis la trace, c'est un échec compté.

**Les quatre sortes, et comment la trace choisit.** On compare le coup joué M au meilleur autre coup R :
1. **Calcul** (« ici c'est tactique ») : l'écart entre M et R vient surtout du **matériel** ou d'un **mat** au bout des
   lignes, ou bien M pare une menace adverse concrète. Phrase : « Je joue M : après [la ligne, en notation française],
   [je gagne une pièce / il doit rendre la qualité / c'est mat]. Motif : fourchette. Sinon, R laissait [ce que la menace
   faisait]. »
2. **Défense** (« ton roi d'abord ») : la menace adverse vise notre roi, ou le terme « danger du roi » est celui qui sépare M
   de R. Phrase : « Mon roi d'abord : M ferme la colonne h / garde f2 ; sans ça, [la menace]. »
3. **Plan** : M fait progresser le plan adopté (le terme plan ou le livre est ce qui sépare M de R, et rien de tactique ne
   les sépare). Phrase : « Plan : attaque de minorité. b4 prépare b5 pour échanger en c6 et laisser un pion c faible.
   Plutôt que R, qui ne sert à rien de précis ici. » En ouverture, la raison du livre, telle qu'elle est écrite.
4. **Amélioration en attendant** : aucun des trois cas. On nomme le terme qui a fait la différence : « Rien de forcé. Le
   cavalier va en d2 vers e4, une meilleure case (mobilité +3). » Et quand tous les termes sont minuscules : « Rien de
   mieux qu'un coup d'attente : h3 ne change rien et ne gâte rien. »

**Toujours dire ce qu'on a vu.** Si la menace adverse existe (il gagnerait du matériel si on passait), elle est nommée même
quand la phrase est de sorte plan : « (je vois …Cxe4 ; après M ce n'est plus possible). »

**Comment c'est fait.** Des gabarits de phrases, un par sorte et par terme, en français, avec la notation du projet
(`coach/notation.mjs`). Aucun LLM dans la V0. Si plus tard un LLM met en forme, il ne reçoit que la trace vérifiée et ne
peut citer aucun coup qui n'y figure pas (la garde `coach/guard.mjs` existe déjà).

**Ce qui est stocké pour chaque coup.** La sorte, la phrase, le coup battu, l'écart, les deux lignes, les termes qui ont
compté (nom, valeur), la menace vue, le motif. C'est ce que le lecteur affiche quand on clique « pourquoi ».

**Fidélité : comment on la mesurera.** Un humain lit vingt coups tirés au sort et dit : la phrase correspond-elle au coup
(oui / non), apprend-elle quelque chose (oui / non). Les pièges que je connais déjà et que la relecture de l'Expert doit
traquer : une phrase de plan sur un coup joué en fait par peur d'une menace ; une « amélioration » qui est en vérité un coup
forcé ; un motif nommé sur une ligne que l'adversaire ne jouerait pas.

---

## Page 3 — L'épreuve et le lecteur

**La première mesure : une partie.** Le coach joue une partie entière contre Maia-1500 (le réseau qu'on a déjà, à un
nœud, qui joue comme un joueur de 1500 tirant ses coups selon ses habitudes). Elle est jouée jusqu'au bout : mat, pat,
nulle par répétition ou par la règle des 50 coups. On la regarde sur le site. C'est la V0 ; Sébastien est prévenu à ce
moment-là, pas avant.

**Le lecteur, sur le site.** Une page `partie.html` : l'échiquier, la liste des coups, et à chaque coup du coach sa phrase
avec une pastille (plan / amélioration / défense / calcul). Un bouton « pourquoi » montre la trace : la ligne calculée,
le coup battu, les termes qui ont compté. Le verdict de l'examinateur est caché par défaut (pour que le lecteur humain juge
la phrase sans être influencé) et s'affiche sur demande. La page sait aussi tirer vingt coups au sort et recueillir les deux
oui / non du lecteur, puis copier le résultat.

**L'examinateur.** Stockfish 19, un fil, profondeur 18, après la partie, jamais pendant : pour chaque coup du coach,
l'évaluation avant et après, du point de vue du coach. **Bévue = plus de 100 centièmes perdus.** (On note aussi les fautes
entre 50 et 100, à part, pour information.) Règle écrite avant la première partie, jamais retouchée.

**Les trois chiffres**, calculés sur chaque série de parties : le score du coach (victoires + demi-nulles, sur le total) ;
la part de bévues (coups du coach jugés bévue / coups du coach) ; la part de coups avec phrase (doit être 100 %).

**La série, après la V0.** Pour tenir « au moins 50 % contre Maia-1500 » avec un intervalle honnête : **100 parties**
(50 avec les Blancs, 50 avec les Noirs, graines fixées), intervalle ± 10 points ; puis 100 parties contre Stockfish bridé
(force limitée à 1500 par son réglage UCI), pour information. Durée estimée : 1 à 3 secondes par coup du coach, Maia
instantané, soit 3 à 6 heures pour 100 parties sur le VPS, à un fil. Taille et heure de fin annoncées avant le lancement.

**La lecture humaine.** Vingt coups tirés au sort sur la série (graine publiée), lus par Sébastien ou Marc dans le lecteur,
examinateur caché. Seuil : 15 phrases fidèles sur 20.

**Les cinq conditions, vérifiables sans rapport** : (1) la partie est jouée du premier au dernier coup par le coach, le
journal de la partie ne contient aucun appel au moteur avant la fin ; (2) score ≥ 50 % sur les 100 parties contre
Maia-1500 ; (3) bévues < 5 % ; (4) phrases = 100 % ; (5) 15 sur 20 fidèles. Une manque : on écrit pourquoi, on ferme.

**Qui fait quoi.** Le pilote écrit le cœur (échiquier, évaluation, recherche, trace) pour que tout tienne ensemble. Le Dev
chef, après synthèse : les tests exhaustifs de l'échiquier, l'arène (coach contre Maia, contre Stockfish bridé), l'examinateur,
la page du lecteur. L'Expert : les poids et les termes qui ont un sens d'échecs, la liste des connaissances de finale à
avoir au minimum, les gabarits de phrases, et la traque des phrases infidèles avant la lecture humaine.

**Calendrier visé.** Jours 1–3 : échiquier, évaluation, recherche, une partie complète jouée sans phrase. Jours 4–6 :
la parole, le lecteur, la V0 (prévenir Sébastien). Jours 7–10 : la série, l'examinateur, les corrections de fidélité.
Jours 11–14 : la lecture humaine, le rapport final au GE.
