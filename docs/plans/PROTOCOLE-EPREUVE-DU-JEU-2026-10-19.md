# L'épreuve du jeu — protocole (une page, écrite avant le code)

19 octobre 2026. Go de l'auteur. Ordre arrêté : ce protocole, relu reposé → le code → les parties → le rapport.
Réécrit le 19 octobre à 2 h sur la relecture reposée du Grand Expert (GE), relayée par l'auteur : la mesure primaire
choisie une heure plus tôt (somme des retards coup par coup) contredisait le résultat central du 18 octobre — un plan se
paie à sa réalisation, pas à chacun de ses pas — et l'épreuve aurait échoué pour une raison de mesure. Deux bras ajoutés
(coach-livre, coach-prix). Amendé auparavant sur relecture de l'Expert (enchaînement après réalisation, lot du coût / lot de la couverture, « hors
de prix » opérationnel, dix départs d'ouverture, N effectif, barème, nulles par répétition, garde-fou de l'exécutant) et du
Dev chef (coût primaire = somme des retards par coup, témoin en secondaire, définitions opérationnelles du § 5 bis, module
partagé du coup contraint, plafond de la dernière chance). Tirage côté coach : non (l'Expert) — la théorie exécutée au mieux. Suite du
rapport du faisceau (`RAPPORT-FAISCEAU-2026-10-18.md`, § 9).

## 1. La question

**La théorie du coach, exécutée par quelqu'un qui calcule, coûte-t-elle quelque chose ?** Le faisceau a donné un prix à un
plan sur quinze coups depuis des positions choisies pour leur stabilité ; une partie entière traverse deux ou trois
structures, et les désaccords entre réseaux, qui tranchent sur une position, se moyennent sur une population de parties.
L'épreuve du jeu est la version statistique de la question du faisceau.

## 2. Les joueurs — et les deux bras

**Quel coach passe l'épreuve ?** Deux bras, parce que leur différence est la valeur ajoutée du projet :
- **le coach-livre** : à chaque adoption, il suit le plan canonique de la structure courante dans la table — le livre,
  exécuté au mieux. Il sera facturé pour la découverte d'hier (le plan de la structure n'est pas le plan de la position :
  b4-b5 à la Carlsbad quand Ce5 est gratuit). Seul, il teste une théorie que personne ne conteste ;
- **le coach-prix** : à chaque adoption, il fait tourner le faisceau sur les deux ou trois instances de la structure courante
  (horizon dix coups, largeur deux, pour tenir le coût) et suit la moins chère — c'est le professeur machine qu'on prétend
  construire. Si le coût de calcul l'impose, le coach-prix tourne sur le lot 1 à un seul camp (cent parties).
La **différence de coût entre les deux bras** est la seule mesure qui réponde à « est-ce que ça sert d'aller plus loin ».

Les joueurs d'une partie :

- **Le coach** (l'un des deux bras) : à chaque coup, il tient le plan en cours ; à chaque **adoption**, il en choisit un selon son bras — coach-livre : — le **plan canonique de la structure courante** pour son camp (table
  `coach/plans-structures.mjs`, première instance ; la seconde si la première est **sans objet ou bloquée** — jugé par la
  distance, statiquement). Quand la structure **bascule**, il change de plan au coup suivant (règle de bascule du
  faisceau). Quand un plan est **réalisé** (distance 0, verrouillé), il **enchaîne** : l'instance suivante de la même
  structure, puis le plan de service (la colonne que le plan a ouverte), noté « enchaînement » — le coach ne se tait pas
  après son premier succès. Quand l'exécutant n'a trouvé **aucun progressant admissible pendant k + 1 = 3 coups**, le plan
  est tenu pour « hors de prix » en jeu et le coach passe à l'instance suivante (c'est le compteur du faisceau, lu comme
  observation). Quand aucune structure n'est reconnue, il garde le dernier plan tant qu'il est **jouable** (distance finie,
  cible existante), sinon il laisse jouer librement et le note : un coup libre coûte zéro par construction, il ne mesure rien.
- **L'exécutant** : Stockfish 19, profondeur 18, un fil, **contraint** par le plan du coach exactement comme dans le
  faisceau — parmi ses quatre meilleurs coups, il joue le meilleur *progressant* ; sinon un *forcé* ou le *roque* ; sinon,
  à compteur plein (k = 2), la *dernière chance* (le meilleur progressant hors MultiPV s'il coûte ≤ 1,0) ; sinon le meilleur
  coup libre, noté « intendance ». Il ne choisit jamais un plan ; il paie celui du coach. **À savoir en lisant les coûts** :
  la concession à 1,0 est son seul garde-fou tactique — c'est voulu, c'est le prix qu'on mesure —, donc le coach peut lui
  imposer jusqu'à un pion de retard à *chaque* coup, et c'est le coût final qui jugera si la théorie en abuse.
- **L'adversaire** : Stockfish 19 libre, même profondeur, même fil.

## 3. Le dispositif

- **Lot 1 — le coût** : les dix positions du panel, les deux camps (le coach joue une fois les Blancs, une fois les Noirs) :
  vingt départs à structures connues. **C'est sur ce lot que le critère se lit.**
- **Lot 2 — la couverture** : dix positions d'ouverture au 8e coup, dans les livres, lignes calmes, choisies par l'Expert
  pour étager la reconnaissance de structure — Française d'avance (1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Cc6 5.Cf3 Fd7 6.Fe2 Cge7
  7.O-O cxd4 8.cxd4 Cf5 : CHAINE_E5 dès le départ), Steinitz (3.Cc3 Cf6 4.e5 Cfd7 5.f4 c5 6.Cf3 Cc6 7.Fe3 a6 8.Dd2 b5),
  Winawer (3.Cc3 Fb4 4.e5 c5 5.a3 Fxc3+ 6.bxc3 Ce7 7.Cf3 Fd7 8.Fd3), Tarrasch ouvert (3.Cd2 c5 4.exd5 exd5 5.Cgf3 Cc6 6.Fb5
  Fd6 7.dxc5 Fxc5 8.O-O Cge7 : PDI noir), échange (3.exd5 exd5 4.Cf3 Fd6 5.Fd3 Cf6 6.O-O O-O 7.Fg5 Fg4 8.Cbd2 Cbd7) ;
  Italienne pianissimo (4.c3 Cf6 5.d3 d6 6.O-O O-O 7.Te1 a6 8.Fb3 Fa7) et Italienne du centre (4.c3 Cf6 5.d4 exd4 6.cxd4
  Fb4+ 7.Fd2 Fxd2+ 8.Cbxd2 d5 9.exd5 Cxd5 : la ligne du livre accouche d'un PDI blanc — le meilleur test de bascule depuis
  l'ouverture) ; Espagnole fermée (jusqu'à 8.c3 O-O), berlinoise (3…Cf6 4.O-O Cxe4 5.d4 Cd6 6.Fxc6 dxc6 7.dxe5 Cf5 8.Dxd8+
  Rxd8 : finale sans dames, majorité) et Steinitz différée (4.Fa4 d6 5.c3 Fd7 6.d4 Cf6 7.O-O Fe7 8.Te1). Ce lot ne mesure
  pas un coût : il mesure **au bout de combien de coups une partie de livre entre dans une structure de la table, et
  combien de coups se jouent sous plan** — la carte des trous de la table. Pour chaque partie des deux lots, la **part de
  coups sous plan** est publiée : elle conditionne la lecture du coût.
- **Population** : pour chaque départ, **dix parties** : l'adversaire tire sa réponse parmi ses deux meilleures quand elles
  sont ex æquo (≤ 25 cp), au hasard d'une graine fixée par partie (reproductible) ; sinon il joue la meilleure. **Jamais de
  tirage côté coach** : on mesure la théorie exécutée au mieux, la variance vient de l'adversaire. Les parties **distinctes**
  sont comptées (empreinte de la suite de coups) et le **N effectif** par départ publié ; si N < 5, la fenêtre d'ex æquo
  est élargie à 40 cp **côté adversaire seulement**. Vingt départs × dix parties = deux cents parties contraintes au lot 1,
  autant au lot 2.
- **Témoin** : les mêmes départs, mêmes graines, **sans coach** (Stockfish libre des deux côtés) — c'est la référence,
  comme le faisceau libre l'était pour le prix. L'appariement par graine est approximatif (les ex æquo ne tombent pas aux
  mêmes coups dans les deux parties) : c'est un bruit que la médiane absorbe, et le coût est aussi donné contre la
  **moyenne des témoins du même départ**.
- **Fin de partie** : mat, nulle, ou le **40e coup** (80 demi-coups). Barème : mat ± 10 (la borne), nulle 0, sinon
  l'évaluation finale à profondeur 18 bornée à ± 10. Les **nulles par répétition des parties contraintes sont comptées à
  part** : un exécutant à compteur plein qui tricote est un plan qui tourne en rond — un signal de théorie, pas du bruit.
- **Mesure — le prix par plan, la mesure validée le 18 octobre, appliquée au bon segment.** La partie est une suite de
  plans, chacun de son **adoption** à son **abandon**. Au point d'adoption, on lance **le faisceau libre depuis cette
  position** sur la longueur du segment (même largeur, mêmes candidats, mêmes réponses ouvertes que le faisceau — la
  référence d'hier) ; **le prix du plan = l'écart, au point calme en fin de segment, entre la meilleure branche libre et la
  ligne jouée.** C'est la mesure qui a passé le critère, dans la partie. Le **coût d'une partie** = la somme des prix de ses
  plans. *Repli si c'est trop cher* (deux à quatre segments par partie, environ une minute de faisceau libre chacun, deux
  cents parties : une nuit de plus) : **la dérive d'évaluation au 40e coup contre la moyenne des dix témoins du même
  départ**, qui crédite la récupération, et pour laquelle le 0,25 a été calibré.
- **Journal, et mesure secondaire** : la **somme des retards coup par coup** (meilleur coup du moteur − coup joué, à la
  même notation MultiPV 4 à profondeur 18) — précieuse parce qu'elle dit *où* ça se paie, coup par coup ; **jamais le
  critère** : un plan se paie à sa réalisation, pas à chacun de ses pas (Cb3 cher au premier coup et gratuit sur quinze ; a3
  et Tb1 à 0,17 et 0,38 pour une attaque de minorité à +0,01 à profondeur 30). Par coup du coach : le plan suivi, la classe
  (P/F/R/I/D/libre), le retard, la structure courante, les bascules, les adoptions et abandons.
- **Second moteur** : la même chose avec SF 17.1 (coach exécuté et adversaire), pour l'accord.

## 4. Ce qu'on lit

1. **Le prix par plan** (adoption → abandon, par le faisceau libre du segment) : l'unité de lecture du rapport ; puis le
   coût par partie (somme des prix de ses plans) et sa dispersion (médiane, quartiles), par structure de départ, par camp ;
   et la part de coups sous plan, sans laquelle un coût ne se lit pas.
2. **La différence entre les deux bras**, coach-livre et coach-prix, plan par plan et partie par partie : la valeur ajoutée.
3. **Les bascules** : combien, lesquelles, et le coût des dix coups qui suivent (le coach a-t-il changé de plan au bon moment ?).
4. **L'accord des moteurs** sur le coût moyen.

## 5. Le critère d'arrêt (écrit avant la première partie)

> **Le coach-prix passe l'épreuve si, sur le lot 1 (les deux cents parties du panel, ou cent à un camp), le coût médian par
> partie est ≤ 0,25 (le plancher) et le coût moyen ≤ 0,50, avec les deux moteurs** — le coût étant la somme des prix de ses
> plans, chacun mesuré à sa réalisation ou à son abandon, au point calme, contre le faisceau libre du segment. Le
> coach-livre est mesuré de la même façon ; **la différence entre les deux est publiée** et c'est elle qui dit si le
> professeur machine vaut mieux que le livre exécuté au mieux. Le lot 2 ne compte pas dans le critère (ses coups
> libres dilueraient la moyenne vers zéro) : il rend la couverture. Entre 0,50 et 1,00 de moyenne : « viable mais ça coûte » — le rapport
> dit où (par structure, par plan), et l'épreuve Maia n'a pas lieu avant correction. Au-delà de 1,00 : la théorie est fausse
> quelque part ; le journal dit où, au coup près, et on ferme.

**Voie de recours**, comme pour le faisceau : un échec à la marge s'arbitre à profondeur 30 sur le segment incriminé. Le
rapport publie, à côté du prix par plan, le nombre de coups sous plan et la somme des retards du segment : c'est le journal
qui dit *où* un plan cher s'est payé. Un prix ≤ 0 se lit « le plan est ce que le moteur voulait », jamais un gain.

## 5 bis. Définitions opérationnelles (pour que le code se relise ligne à ligne — relecture du Dev chef)

1. **Structure courante** : parmi les jetons `STRUCTURE` de `buildStructureFacts` (il peut y en avoir plusieurs, un par
   couleur), celle dont le coach est **propriétaire** si elle existe ; sinon celle de l'adversaire (le coach joue
   « opponent ») ; à égalité, l'ordre fixe PDI, PIONS_PENDANTS, CARLSBAD, CHAINE_E5, CHAINE_D5, MAROCZY,
   PETIT_CENTRE_SICILIEN. Aucun jeton : pas de structure.
2. **Bascule** : la structure courante change (apparition, disparition ou remplacement) entre deux coups du coach ; prise
   en compte **au coup suivant du coach**, qui adopte la première instance de la nouvelle structure.
3. **Sans objet / bloqué** : distance infinie (`estLevier` faux, cible disparue, chemin barré) — jugé statiquement au
   moment du choix. **Hors de prix en jeu** : trois coups consécutifs du coach sans progressant admissible (k + 1).
   **Jouable** : distance finie et cible existante.
4. **Adoption** : le premier coup du coach joué sous un plan. **Abandon** : bascule, réalisation (distance 0, puis
   enchaînement), hors de prix en jeu, sans objet. Le coût par plan = la somme des retards des coups entre les deux.
5. **Graine** : une par (départ, numéro de partie), générateur `mulberry32` amorcé par une empreinte de la suite de
   coups du départ et du numéro ; elle ne tire que **côté adversaire** (réponses ex æquo ≤ 25 cp, 40 si N < 5). Même
   graine pour SF 19 et SF 17.1.
6. **Témoin** : sans coach, il n'est apparié à la partie contrainte qu'au premier coup ; au-delà, c'est une partie
   différente. Il ne sert qu'à la mesure secondaire.
7. **Déterminisme** : un fil (`COACH_DETERMINISTIC=1`), profondeur 18, hachage 256 Mo, deux parties fraîches identiques
   vérifiées avant la passe ; cache de notation par processus, clé = position (les dix parties d'un départ partagent
   leur préfixe).
8. **Fin de partie** : `isGameOver` de chess.js (mat, pat, répétition, cinquante coups, matériel) ou le 80e demi-coup ;
   l'éval finale est prise du point de vue du coach. **Retard d'un coup** : il sort de la **même notation MultiPV 4 à
   profondeur 18 qui a servi au choix** (meilleur − joué), jamais d'une re-notation. **Dernière chance** : la notation de
   tous les coups légaux qui la *décide* se fait à profondeur 14 (plafond de coût) ; son retard, lui, est mesuré à 18
   comme les autres — meilleur de la MultiPV 4 moins la valeur du coup joué, lue dans la réponse adverse à 18.
9. **Code** : la logique d'un coup contraint (classer les quatre candidats, choisir, dernière chance) est **extraite du
   faisceau dans un module partagé** (`coach/coup-contraint.mjs`), testée, appelée par le faisceau *et* par le pilote de
   partie — pas de copie, sinon les deux divergent. Lanceur sur la matrice départs × graines, à partir de `faisceau.sh`.

## 6. Ce qui est interdit, ce qui est différé

Interdit : changer la table des structures, le plancher, l'horizon ou les départs après la première partie ; mesurer à
plusieurs fils ; lire un prix de plan sans son faisceau libre de segment (ou, en repli, une partie sans la moyenne des
témoins de son départ). La concession à 1,0 par coup reste le seul garde-fou de l'exécutant : acceptable avec une mesure à
la réalisation, qui laisse la récupération parler — elle aurait été ruineuse avec un cumul. Différé, documenté : le modificateur « roques opposés » (la course des
pions prime) ; la « fenêtre suspendue » (clouage) ; Maia (épreuve 2 : le même coach guidant un Maia-1500 contre lui-même —
seulement si l'épreuve 1 passe).

## 7. Coût et calendrier

Par partie contrainte : ~40 coups du coach × (MultiPV 4 + réponse) ≈ 6 à 10 min à un fil ; par segment, un faisceau libre
≈ 1 min ; pour le coach-prix, un faisceau par instance à chaque adoption (horizon 10, largeur 2) ≈ 3 à 5 min par adoption.
Coach-livre, deux cents parties + témoins : une nuit sur Orion à **six** positions en parallèle (douze processus, deux
cœurs libres — un `node` et un Stockfish par partie). Coach-prix, cent parties : une à deux nuits de plus. Les deux moteurs
doublent. **Trois à quatre nuits en tout.** Code : un à deux soirs (le
faisceau fournit la contrainte, la table la bascule, `nuit-stabilite.sh` le lanceur). Relecture du code par l'Expert et le
Dev chef avant la première partie, comme pour le faisceau. Rapport dans la forme des deux précédents, avec une page à lire
en premier.
