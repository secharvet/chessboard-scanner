# Le faisceau : le prix et le tempo d'un plan imposé au moteur sur quinze coups

Rapport du 18 octobre 2026 (soir) — pilote, avec les relectures de la session Expert échecs (sémantique) et de la session
Dev chef (mécanique). Suite directe du rapport du filtre (`RAPPORT-FILTRE-2026-10-18.md`) et du cahier des charges écrit
avant le code (`FAISCEAU-CRITERE-2026-10-18.md`). Pièces : annexes X (passe SF 19), Y (passe SF 17.1), Z (accord des deux
moteurs), ZZ (passe à référence gloutonne, gardée comme témoin du biais) ; code `scripts/plans/faisceau.mjs`,
`faisceau.sh`, `accord-faisceau.mjs`, `coach/en-prise.mjs` ; journal `docs/JOURNAL-PLANS.md`.

> **Verdict (18 octobre, 23 h 55) : le critère passe — 9 positions sur 10 par la clause de profondeur 30 (6 à 18 +
> 3 contradictions confirmées), plans longs canoniques 8 sur 10 — avec trois drapeaux (une limite, une « à la merci de la
> réponse », un échec de mesure du prix). § 8. La suite (l'épreuve du jeu) reste soumise à un go à part, après relecture
> à froid, et aux deux retouches du § 6 bis.**

## 0. Résumé

- **Ce qu'on a construit** : la recherche contrainte dessinée le 18 octobre à midi — à chaque coup à nous, les quatre
  meilleurs coups du moteur, classés par la distance du plan (progressant / forcé / roque / intendance), un compteur qui
  coupe la branche quand le moteur préfère autre chose trois coups de suite, l'adversaire libre, largeur quatre, horizon
  quinze coups, et le **prix** (écart d'évaluation avec le jeu libre au même demi-coup) et le **tempo** (le demi-coup où
  le plan se réalise). Les sorties sont les quatre phrases du matin plus le vocabulaire du § 11 du rapport du filtre.
- **Ce que les relectures ont corrigé avant la passe définitive** : un biais de sélection qui croissait avec le tempo (la
  référence était un chemin glouton, le faisceau un optimiseur) — remplacé par un **faisceau libre** de même largeur ; la
  **tenure** (un transfert n'est réalisé que si la pièce tient après la réponse) ; les plans frères suivis en profondeur ;
  « à la merci de la réponse » restreint aux branches jumelles ; la **branche de la dernière chance** (un pas hors MultiPV
  reçoit son prix au lieu d'un « jamais urgent » muet) ; les réalisations soumises au même tri de largeur que les branches
  vivantes ; les prix bornés aux mats. Treize correctifs sur deux relectures, comme pour le test à deux demi-coups.
- **Ce que la passe définitive donne** (profondeur 18, un fil, déterministe, 35 plans, deux moteurs) : SF 19 — 18 « c'est
  le plan », 14 « viable mais ça coûte », 3 « en cours à l'horizon », **plus aucun prix négatif** ; plans longs canoniques
  réalisés à prix ≤ 1,0 : 8 sur 10 (SF 19), 5 sur 10 (SF 17.1). Critère : **6 positions sur 10** avec chaque moteur, quatre
  contradictions du livre côté SF 19 dont **deux communes aux deux moteurs** (Carlsbad : l'attaque de minorité coûte 0,46 à
  1,62 là où Ce5 est gratuit ; Tarrasch fermée : la colonne c coûte 0,84 à 1,92 là où …e5 est gratuit). Accord des moteurs
  sur quinze coups : 18 plans sur 35 annoncés, 14 désaccords, 3 contestés.
- **Ce qui est acquis quoi qu'il arrive** : l'instrument tourne de bout en bout, à un fil, reproductible, en une demi-heure
  par moteur ; ses prix sont lisibles coup par coup avec la classe de chaque coup et le plan frère servi ; et sa première
  passe a produit une leçon que le filtre ne pouvait pas donner — **le bon moment d'un plan** (Cb3 après dxc5, quand le
  piège a disparu). Ce qu'il ne fait pas : départager deux plans à moins de 0,3 l'un de l'autre sur quinze coups quand les
  deux moteurs ne s'accordent pas, et c'est la majorité des positions calmes.

## 1. La question

Le filtre (rapport précédent) a montré que la grammaire reconnaît la préparation positionnelle et que le test à deux
demi-coups mesure un pas de préparation — pas plus. La question d'origine, celle du 18 octobre à midi, restait entière :
**un plan a-t-il un prix sur quinze coups ?** Un plan qui coûte 0,1 par coup pendant dix coups vaut 1,0 en bout de ligne,
quatre planchers, là où aucun de ses pas ne sortait de la bande grise (§ 9 du rapport du filtre). Le faisceau est la seule
mesure qui accumule.

## 2. La méthode (cahier des charges `FAISCEAU-CRITERE-2026-10-18.md`, écrit avant le code)

À chaque coup à nous : MultiPV 4, profondeur 18, un fil. Chaque candidat est classé par la distance du plan
(`coach/plan-distance.mjs`) : **progressant** (compteur à zéro), **forcé** (prise à jouer, échec, pièce en prise au
mini-échange, ou coup qui bat le second de plus d'un pion ; neutre), **roque** (neutre), **intendance** (compte 1, coupe à
k = 2). Un progressant qui vaut plus d'un pion de moins que le meilleur coup est une **concession**, refusée. Quand une
branche va être coupée, la **dernière chance** : tous les coups légaux notés une fois, le meilleur progressant hors MultiPV
joué s'il coûte ≤ 1,0, sinon coupe « sans concession » avec le chiffre. L'adversaire joue sa meilleure réponse, et la
seconde quand elle est **ex æquo** (≤ 25 cp). Largeur 4. Horizon 15 coups. **Référence : le faisceau libre** — mêmes
candidats, même largeur, mêmes réponses ouvertes, sans plan ni compteur — dont la meilleure branche au demi-coup n donne la
référence du prix. **Tenure** : transfert, échange, colonne réalisés seulement si la distance reste à 0 après la réponse.

Sorties : prix, tempo, et la phrase — **c'est le plan** (réalisé, prix ≤ 25 cp) / **viable mais ça coûte** / **pas
réalisable sans concession** / **jamais urgent ici** / **en cours à l'horizon** ; « limite » (prix dans ]25 ; 50], tempo à
un coup de l'horizon, ou dernière chance refusée à moins de 25 cp de la borne) ; par coup, la classe et le plan frère servi ;
« à la merci de la réponse » (branches jumelles d'une réponse ex æquo aux prix de signes opposés) ; et l'accord des deux
moteurs (annoncé / désaccord / contesté au-delà d'un pion). Un fil pour mesurer ; reproductibilité vérifiée (deux passes
fraîches identiques) avant chaque passe.

**Le critère d'arrêt**, écrit avant la première ligne et amendé par l'Expert avant la passe : sur les positions éligibles,
≥ 70 % où **aucun plan non canonique réalisé ne bat le meilleur plan canonique réalisé de plus de 25 cp** (égalité = réussite),
ou bien la contradiction est **confirmée à profondeur 30** ; et au moins la moitié des plans longs canoniques réalisés dans
l'horizon à prix ≤ 1,0. Plafond : deux semaines de soirées. Si non : « on écrit pourquoi et on ferme ».

## 3. Le panel et les plans canoniques

Les dix positions et 35 plans du filtre. Canoniques désignés avant la passe et validés par l'Expert (deux corrections de
sa part : Panov → Dd3 seul, « la batterie est *le* plan de cette position » ; Française d'échange → c4 seul, « casser la
symétrie », avec l'avertissement que le faisceau y contredirait sans doute le livre) : Carlsbad b4-b5 ; hérisson …b5 et …d5 ;
Mar del Plata c5 ; Espagnole « f4 puis e5 » et e5 ; avance noirs …Cf5 et l'échange du mauvais fou ; avance blancs a3-b4 ;
Tarrasch fermée colonne c ; Tarrasch ouvert Cd4 et Fg5×e7. Dix positions éligibles. Piège évité à l'écriture : « le moins
cher des plans longs est canonique » était vrai par construction dans cinq positions à un seul plan long.

## 4. Les deux relectures avant la passe, et la passe témoin

Une première passe (SF 17.1, référence gloutonne — annexe ZZ) a servi de matière aux relecteurs et n'entre pas dans le
décompte. Elle donnait 6/10 avec des prix négatifs jusqu'à −1,51 et trois « contradictions » : d5 devant Dd3 (Panov), Cb3
devant b4 (avance blancs), …Ce4 devant la colonne c (Tarrasch fermée).

**L'Expert (sémantique), sept constats.** (1) Le biais de sélection est réel et **croît avec le tempo** : un plan réalisé au
coup 15 a eu quinze fois « max de quatre branches » pour accumuler de l'optimisme, un plan réalisé au coup 1 aucune — et
les trois contradictions avaient toutes le motif « tardif bat précoce ». Remède : un faisceau libre de même largeur comme
référence ; ne jamais lire un prix négatif comme un gain. (2) Aucune contradiction à arbitrer sur des chiffres biaisés ;
mais Cb3 après dxc5 n'est pas une contradiction : **le faisceau apprend le bon moment du même plan** — la tension dissoute,
le piège …cxd4 n'existe plus. (3) « À la merci » sur toutes les branches réalisées mesurait la diversité du faisceau, pas la
dépendance à la réponse : jumelles seulement. (4) L'ordre des opérations : référence → repasse → décompte → profondeur 30 →
clause ; le gel porte sur la passe définitive, les amendements d'avant-passe sont légaux. (5) **Tenure** : un transfert
comptait réalisé quand la pièce touchait la case, même chassée au coup suivant. (6) Les plans frères n'étaient pas suivis en
profondeur (« Tad1 [Dd1→d3] » six coups après le départ de la dame). (7) Au crédit : la dernière chance fait son travail,
et « Dxb2 progressant pour l'échange du mauvais fou » est la définition du mur qui travaille (la dame quitte b6, le pion b7
redevient mobile).

**Le Dev chef (mécanique), dix constats.** Le prix comparait bien des évaluations au même demi-coup et du même point de
vue ; le biais venait de l'argmin sur un ensemble de réalisations **non borné par la largeur** contre une référence unique ;
remède appliqué : les réalisations passent par le même tri de largeur. Coût réel des progressants refusés (plus de 1,00
placebo) ; prix bornés à ± 10 pions (scores de mat) ; garde d'unicité des libellés remontée dans le fichier des positions
(le faisceau ne passait pas par `filtre.mjs`) ; fusion tolérante aux JSON tronqués ; échecs comptés par positions
manquantes. Réserve laissée pour la lecture : **l'instantané du prix est pris au demi-coup de la réalisation, pas à un point
calme** — sur une position où prix et phrase ne concordent que grâce à un demi-coup tactique, se méfier avant de conclure.

## 5. Résultats de la passe définitive (profondeur 18, un fil ; annexes X, Y, Z)

| | SF 19 (Orion, 29 min) | SF 17.1 (Orion, 29 min) |
|---|---|---|
| c'est le plan / viable mais ça coûte / en cours / sans concession / jamais urgent | 18 / 14 / 3 / 0 / 0 | 18 / 14 / 0 / 1 / 2 |
| prix négatifs | 1 (−0,17) | 0 |
| plans longs canoniques réalisés à prix ≤ 1,0 | **8 / 10** | 5 / 10 |
| critère : positions réussies (sur 10 éligibles) | **6** | **6** |
| contradictions du livre (> 25 cp) | Carlsbad, Espagnole, avance blancs, Tarrasch fermée | Carlsbad, hérisson, Tarrasch fermée, échange |

**Identité entre machines** : la même passe SF 19 a tourné sur le VPS (trois processus, 1 h 30) et sur Orion (dix processus, 29 min), même binaire, un fil : **35 plans sur 35 identiques** — phrase, prix, tempo, ligne retenue. Le faisceau est déterministe de bout en bout.

**Accord des deux moteurs** (annexe Z) : 18 plans sur 35 annoncés avec la même phrase et moins d'un pion d'écart, 14
désaccords, 3 contestés (e4-e5 de l'Espagnole : +1,31 au 25e contre +0,10 au 3e ; …b5 du hérisson : −0,17 contre +1,08 ;
…Ce4 du Tarrasch fermé : en cours +3,28 contre +1,13). Sur quinze coups, deux réseaux ne donnent pas le même prix dans un
cas sur deux — c'est l'axe « moteur » de la nuit de stabilité, amplifié par l'horizon.

**Position par position (SF 19).**
- *Carlsbad* : Ce5 « c'est le plan » +0,00 au 6e ; **b4-b5 « viable mais ça coûte » +0,46 au 15e**, par deux dernières
  chances (a3 à 0,17, Tb1 à 0,38) — le moteur n'avait jamais ces coups dans son top 4 ; e3-e4 « c'est le plan » +0,16. SF
  17.1 : b5 au 27e à +1,62. **Contradiction commune.**
- *Pion isolé (Panov)* : Dd3 +0,07 au 2e, Ce5 +0,25 au 4e, d5 +0,69 au 13e — réussi, et le biais de la passe témoin
  (d5 −0,48 devant Dd3) a disparu avec la référence symétrique.
- *Hérisson* : …b5 −0,17 au 15e, colonne c +0,01 au 2e, …d5 +0,60 — réussi chez SF 19 ; SF 17.1 donne …b5 à +1,08 et
  contredit (« le hérisson joue Tc8 d'abord », point de veille de l'Expert).
- *Mar del Plata* : c5 +0,16 au 3e (après b4), Cb5 +0,07, Cd3 +0,01 — réussi, égalité dans le plancher.
- *Espagnole d'échange* : Cd5 +0,00 au 12e ; **e4-e5 +1,31 au 25e** ; la conjonction « f4 puis e5 » en cours à +0,98.
  Contradiction chez SF 19 seulement (SF 17.1 : e5 +0,10 au 3e) — contesté entre moteurs.
- *Avance, Noirs* : …Cf5 +0,00 au 8e, échange du mauvais fou +0,42 au 8e, …f6 et colonne c plus chers — réussi.
- *Avance, Blancs* : Fe3 +0,00 au 6e (après dxc5), **b4 +0,30 au 5e** — cinq centipions au-dessus du plancher, bande
  grise ; Cb3 +1,04 au 18e (le piège du test redevient cher ici). Contradiction à un cheveu, SF 19 seulement.
- *Tarrasch fermée* : …e5 +0,00 au 3e (après O-O Fg5) ; **colonne c +0,84 au 22e au bout d'une ligne tactique**
  (…Fxh2+, …Dxd5…) — la réserve du Dev chef s'applique ; …Ce4 en cours à +3,28. **Contradiction commune** (SF 17.1 :
  colonne c +1,92).
- *Tarrasch ouvert* : Cd4 +0,00 au 6e, Fd3 +0,00, Fg5×e7 +0,76, Fxc6 +1,26 — réussi.
- *Échange* : c4 +0,00 au 7e, Fg5 +0,00, colonne e +0,05 — réussi chez SF 19 (SF 17.1 : c4 +0,28, limite).

## 6. Ce que la passe montre, indépendamment du verdict

1. **Les prix sont devenus lisibles.** Avec la référence symétrique, plus de prix négatif significatif, et le zéro a un
   sens exact : « la ligne du plan est une branche du jeu libre ». 18 plans sur 35 sont dans ce cas pour chaque moteur.
2. **La dernière chance est la pièce qui manquait.** Sans elle, l'attaque de minorité de la Carlsbad sortait « jamais
   urgent » ; avec elle, elle se réalise au 15e demi-coup pour 0,46, par deux pas que le moteur ne classait pas dans son
   top 4 (a3, Tb1). C'est le prix du plan, chiffré, et le coup par coup dit où il se paie.
3. **Le tempo est une information en soi.** Les plans canoniques réalisés tard (b5 au 15e ou au 27e, e5 au 25e, colonne c
   au 22e) sont exactement ceux que le critère compte en contradiction : le faisceau dit « ce plan existe, mais il n'est
   pas le premier à jouer ici », ce que le livre, qui parle de la structure et pas de la position, ne dit pas.
4. **Deux moteurs sur quinze coups divergent souvent** (14 désaccords sur 35) : c'est la limite dure, et la règle des
   deux moteurs reste la condition d'un verdict annonçable.
5. **La passe témoin a eu une utilité** : sans elle, le biais « tardif bat précoce » ne se serait pas vu, et les trois
   « contradictions » de la première lecture auraient été arbitrées à profondeur 30 pour rien.

## 6 bis. Ce que le critère mesure vraiment (relecture relayée par l'auteur, 18 octobre, 23 h 30)

Les quatre contradictions ne sont pas de même nature. L'avance côté blanc (b4 +0,30 contre Fe3 0 après dxc5) est à cinq
centipions du plancher, dans la bande grise par construction — et c'est le même enseignement que Cb3 : Fe3 valait −1,22 à
la racine et zéro après dxc5, **le faisceau apprend le bon moment du même coup**. L'Espagnole est un contesté entre moteurs.
Les deux qui comptent, communes aux deux moteurs, disent la même chose : **le plan canonique est le plan de la structure,
le plan gratuit est le plan de la position, et l'écart entre les deux est du tempo.** Dans la Carlsbad, Ce5 au 6e à zéro et
b5 au 15e à 0,46, c'est ce que les maîtres jouent — Ce5 et f4 d'abord, ou Tab1-b4 d'abord, les deux sont dans les livres.
Dans le Tarrasch fermé, …e5 gratuit au 3e après O-O Fg5, et la colonne c à 0,84 au bout d'une ligne tactique où la réserve
du Dev chef s'applique entièrement (le prix est pris au 22e demi-coup au milieu de …Fxh2+ et …Dxd5, pas à un point calme).

Conséquence à écrire quel que soit le verdict : **le critère mesure autant la désignation des canoniques que l'instrument.**
« Le plan de la structure » et « le plan à jouer maintenant » ne sont pas la même chose ; le livre parle du premier, le
faisceau mesure le second, et le critère les confond. La règle interdit de retoucher le panel après la passe, et elle a
raison : Ce5 n'est pas requalifié en canonique pour passer. Le critère s'applique tel qu'il est écrit, et deux des quatre
échecs sont consignés comme des cas où le faisceau a dit quelque chose de plus fin que la question posée. Le tempo n'était
pas dans le critère, et c'est lui qui porte la leçon : « le plan de cette structure est b5, le plan de ce coup est Ce5, et
b5 revient quinze demi-coups plus tard pour un demi-pion » — aucun livre ne dit ça position par position, et c'est une
phrase de professeur.

La limite dure est l'accord des moteurs : un cas sur deux sur quinze coups, et la divergence des réseaux se compose avec
l'horizon. Pour le professeur machine : un prix ne s'annonce qu'à deux voix, et la moitié des plans d'une position calme
n'auront pas de prix annonçable. C'est un argument de plus pour **l'épreuve du jeu** plutôt que pour le verdict par
position : sur une population de parties les désaccords entre réseaux se moyennent, sur une position ils tranchent ; le
critère de ce soir est une mesure ponctuelle, et les mesures ponctuelles de ce panel sont au bord du bruit depuis le matin.

Deux choses à faire **avant toute épreuve du jeu, et pas pour rejouer le critère, qui est gelé** : le prix pris à un point
calme après la réalisation (même logique qu'au test à deux demi-coups — le Tarrasch montre que l'instantané au tempo peut
mentir) ; et l'horizon à vingt coups pour les plans de structure (b5 au 27e, e5 au 25e chez SF 17.1 : quinze est à la
lisière).

## 7. Limites, honnêtement

- L'instantané du prix est pris au tempo, pas à un point calme (Dev chef) : la colonne c du Tarrasch fermé en est le cas.
- L'horizon de 15 coups est à la lisière pour les plans de structure (minorité, majorité) : tempo 25-27 chez SF 17.1.
- Le clouage relatif (« fenêtre suspendue ») n'est pas branché (`threats.mjs`), ni le défenseur cloué dans le mini-échange.
- Les canoniques sont une hypothèse (…Cc5 au hérisson, colonne c du Tarrasch fermé peut-être incomplète).
- Un fil, profondeur 18 : la profondeur 30 n'a été réservée qu'aux arbitrages.

## 8. Le verdict du critère

**Les arbitrages à profondeur 30** (Expert échecs, SF 19, un fil ; prix à 30 = éval de la racine − éval de la fin de la
ligne contrainte, point de vue du camp qui plane ; les huit lignes rejouées et légales avant mesure ; racines à 30 :
Carlsbad +0,40, Espagnole +0,17, avance +0,28, Tarrasch fermée −0,38 vue noire) :

| position | canonique : fin, prix à 30 | rival : fin, prix à 30 | écart | verdict |
|---|---|---|---|---|
| Carlsbad | b4-b5 : +0,39, **+0,01** (l'attaque de minorité est gratuite à 30 ; le +0,46 de la passe 18 s'évapore) | Ce5 : +0,69, −0,29 | 0,30 | **confirmée, limite** (cinq centipions au-dessus de la barre) |
| Espagnole d'échange | e4-e5 : −0,03, +0,20 (jouable, sous le plancher) | Cd5 : +0,56 (Ce2 ! garde les pièces), −0,39 | 0,59 | **confirmée, nette** |
| Avance, Blancs | b4 : +0,38, −0,10 (b4 est gratuit ; le +0,30 de la passe 18 était la bande grise) | Fe3 : +0,90, −0,62 — mais ce +0,90 vient de la réponse …Cxe5 de la passe 18, que la 30 juge douteuse (le pion e5 est empoisonné) | 0,52 | **confirmée, à la merci de la réponse** |
| Tarrasch fermée | colonne c : +0,11 vue noire (les Noirs sont mieux au bout de la ligne tactique), **−0,49** | …e5 : −0,24, −0,14 | le canonique est moins cher de 0,35 | **infirmée, et renversée** : la « contradiction » de la passe 18 était un artefact de l'instantané pris en pleine ligne tactique — 0,84 annoncé contre −0,49 réel, **1,3 pion d'erreur de snapshot** (la réserve du Dev chef, chiffrée) |

**Décompte, clause appliquée telle qu'écrite** : 6 réussies à profondeur 18 + 3 contradictions confirmées à 30 = **9
positions sur 10** ; plans longs canoniques réalisés à prix ≤ 1,0 : 8 sur 10. **Le critère passe**, au-dessus des 70 %,
avec trois drapeaux honnêtes :
- *Carlsbad* : limite, à cinq centipions de la barre, et la dérive d'évaluation entre deux tempos différents ne menace que
  cette position ;
- *Avance, Blancs* : la confirmation tient à une réponse que la profondeur 30 juge douteuse — « à la merci de la réponse » ;
- *Tarrasch fermée* : reste en échec, mais **échec de la mesure du prix** (instantané tactique), pas du plan ni du livre ;
  le correctif est connu (prix au point calme) et il est la première des deux retouches d'avant l'épreuve du jeu (§ 6 bis).

**Ce que le verdict dit, et ce qu'il ne dit pas.** Il dit que sur ce panel, en profondeur, la mesure ne contredit pas la
théorie — et que quand elle la contredit, c'est pour la préciser : Ce5 *et* b4-b5 sont des plans de la Carlsbad (les deux
sont dans les livres, la désignation « b4-b5 seul » était trop étroite) ; dans l'Espagnole sans dames avec …c4 joué,
l'installation Cd5 vaut mieux que la poussée immédiate, e5 restant correct ; dans l'avance, b4 est gratuit et la mesure a
trouvé encore mieux. Trois « cas Marc » : des positions où la grammaire a quelque chose à dire au livre, à montrer en
premier. Il ne dit pas que le prix à profondeur 18 est fiable à mieux que la bande grise (§ 6 bis, § 7) : deux des quatre
arbitrages ont déplacé le prix de plus d'un demi-pion, et un l'a renversé. **Le critère passe sur la clause, pas sur la
passe à 18 seule** — c'est exactement pour cela que la clause avait été écrite.

Reproductible : l'outil de l'Expert, profondeur 30, un fil ; fichier de tests sur sa branche.

## 8 bis. La question de l'auteur : le catalogue et la bascule de structure (19 octobre, 0 h 30)

« Si l'adversaire transforme la structure en cours de ligne — on préparait une Carlsbad, dix coups plus tard c'est un pion
isolé —, la mesure dit-elle "plan échoué" ? » Vérifié contre le code : **à moitié.** Ce qui existe : si le pion visé par un
levier disparaît, le plan sort « sans objet » (b4 après cxd4 cxd4) ; chaque coup de la ligne porte le plan frère qu'il
sert, on voit donc le moteur glisser d'un plan à l'autre. Ce qui n'existe pas : **la liste des plans est figée à la racine**
(trois ou quatre par position, choisis à la main) ; le détecteur de structures (`positional/structures.js`, l'étage 1
d'octobre) **n'est pas branché sur le faisceau** ; et le plan de l'adversaire n'est pas nommé — la famille « restriction »,
l'opposé de notre distance, n'est pas écrite.

Il faudrait donc, avant toute épreuve du jeu sur une partie entière (qui traverse deux ou trois structures) : (1) relire la
structure le long de la ligne ; (2) une règle de bascule — quand la structure change, le prix mesuré jusque-là est le prix du
plan *jusqu'à la transformation*, le faisceau se divise (continuer l'ancien plan / adopter le plan canonique de la nouvelle
structure) et le coach compare les deux prix (« ici il fallait renoncer à b5 et passer au blocus ») ; (3) nommer la
transformation comme le plan adverse (« les Noirs ont transformé la structure par …c5, l'attaque de minorité est morte à ce
coup-là »). Sur quinze coups depuis des positions choisies pour leur stabilité, on pouvait s'en passer ; **sur une partie,
non.** C'est la condition d'existence de la prochaine étape, posée par l'auteur.

## 9. La suite — l'ordre arrêté par l'auteur (19 octobre, 2 h)

1. **Le verdict** (§ 8) — rendu.
2. **La lecture à froid** du rapport par l'auteur, dans quelques jours.
3. Si c'est oui : **le protocole de l'épreuve du jeu sur une page**, écrit puis relu reposé — c'est lui qui ouvre l'épreuve,
   pas le code.
4. **Le détecteur de bascule** — codé dans la nuit (détection, coup qui transforme, prix jusqu'à la bascule, division
   « continuer / adopter » avec la table structure → plans canoniques de l'Expert, `coach/plans-structures.mjs`) ; il
   attend le protocole pour servir.
5. **Les parties.**

Techniquement prêt dans une semaine de soirées ; méthodologiquement, le jour où le protocole est écrit et lu reposé.

## 9 bis. La suite, selon le verdict (écrit avant l'ordre ci-dessus)

- **Le critère passe (§ 8).** Avant toute suite, **trois** retouches : le prix au point calme, l'horizon à vingt coups pour les plans de structure, et le **détecteur de bascule de structure** (§ 8 bis). Puis la suite prévue, l'épreuve du jeu — le faisceau étendu à la partie entière (le coach choisit, le moteur exécute
  sous contrainte, le moteur libre en face ; coût par partie de suivre la théorie), puis Maia (le même coach guidant un
  Maia-1500 contre lui-même). Avant d'en écrire une ligne : les sorties parlent exactement le vocabulaire stabilisé le 18
  octobre, plus prix et tempo.
- **Si le critère échoue** : ce rapport dit pourquoi — le prix d'un plan sur quinze coups existe et se lit, mais il ne
  départage pas des plans à moins de 0,3 l'un de l'autre dans des positions calmes, et deux moteurs n'y donnent pas le même
  chiffre un cas sur deux ; et le critère a mesuré la désignation des canoniques autant que l'instrument (§ 6 bis). On
  ferme, en gardant l'instrument et le vocabulaire — et l'auteur relit ce rapport **à froid, dans quelques jours**, pour
  décider si l'épreuve du jeu mérite un go à part. Ce n'est pas le soir même qu'on tranche cela ; c'est le cahier des
  charges qui le dit.

## 10. L'effet des retouches (passe de contrôle, 19 octobre, 0 h 40 ; annexes AA, AB, AC)

Même panel, mêmes réglages, un fil, Orion (26 + 27 min, 0 échec), avec les trois retouches : prix pris à un point calme
après la réalisation (prix brut gardé), horizon vingt pour rupture / poussée / conjonction, bascule de structure détectée et
nommée. **Ce n'est pas un nouveau verdict — le critère est gelé sur la passe du § 5 et les arbitrages du § 8** ; c'est la
mesure de ce que les retouches changent, pour la lecture à froid.

| | SF 19 retouché | SF 17.1 retouché | (rappel § 5 : SF 19 / SF 17.1) |
|---|---|---|---|
| c'est le plan / viable / en cours / sans concession / jamais urgent | 14 / 15 / 2 / 2 / 2 | 13 / 14 / 2 / 4 / 2 | 18 / 14 / 3 / 0 / 0 · 18 / 14 / 0 / 1 / 2 |
| positions où le canonique n'est pas battu de plus de 25 cp (décompte à 18, à titre indicatif) | **7 / 10** | **7 / 10** | 6 / 10 · 6 / 10 |
| lignes où le prix au point calme diffère du prix brut de plus de 25 cp | 8 / 35 | 3 / 35 | — |
| lignes sans point calme après prolongation | 3 | 1 | — |
| bascules de structure détectées le long de la ligne retenue | 13 / 35 | 13 / 35 | — |
| accord des deux moteurs (annoncé / désaccord / contesté) | 18 / 14 / 3 | | 18 / 14 / 3 |

**Ce que le point calme a changé.** Le cas qui motivait la retouche est réparé chez SF 19 : la colonne c du Tarrasch fermé,
« +0,84 au 22e en pleine tactique » (§ 8 : −0,49 réel à 30), sort maintenant **« c'est le plan », −0,04 au 18e** — le point
calme a fait au 18e ce que la profondeur 30 avait fait. Chez SF 17.1 elle reste chère (+1,82 au 28e) : désaccord de réseau,
pas de mesure. Huit lignes sur 35 bougent de plus de 25 cp chez SF 19 — l'instantané au tempo n'était pas un détail.

**Ce que l'horizon vingt a changé.** Il n'a pas sauvé l'attaque de minorité : chez SF 19 elle reste « en cours » à vingt
coups (bascule au 26e demi-coup, la structure se dissout par fxe5), chez SF 17.1 elle se réalise au 23e à +1,51. Lecture :
dans *cette* Carlsbad, b4-b5 n'est pas le plan du moment, et quinze coups de plus ne le rendent pas gratuit — la profondeur
30 (§ 8) disait +0,01 pour une réalisation au 15e ; les deux mesures ne se contredisent pas, elles mesurent des lignes
différentes. L'Espagnole bascule dans l'autre sens chez SF 19 : e4-e5 passe de « viable +1,31 au 25e » à « pas réalisable
sans concession ». Les plans de structure à long tempo restent **la zone la moins stable de l'instrument** — c'est là que
l'épreuve du jeu, statistique, remplacera le verdict par position.

**Ce que la bascule montre.** Treize lignes sur 35 traversent une transformation de structure avant la réalisation, nommée
avec le coup qui la cause : dans l'avance française, **cxd4 dissout la chaîne** au 4e demi-coup (CHAINE_E5 → rien) ; dans le
Tarrasch fermé, **dxe5 donne aux Noirs un pion isolé** (→ PDI noir) ; au hérisson, cxb5 fait passer du Maroczy au petit
centre sicilien. La **division** « continuer / adopter le plan canonique de la nouvelle structure » (table de l'Expert,
`coach/plans-structures.mjs`) est codée et vérifiée à profondeur réduite, mais **n'a pas tourné dans cette passe** (Orion
avait tiré le dépôt avant ce commit) : elle attend le protocole, comme l'ordre du § 9 le prévoit.

**Décompte indicatif.** À profondeur 18, les retouches font passer le décompte brut de 6 à **7 sur 10 avec chaque
moteur**, mais pas sur les mêmes positions : la Française d'échange devient la contradiction commune (c4 +0,36 / +0,29
contre Fg5 ou la colonne e — celle que l'Expert annonçait dès la désignation) ; le Tarrasch fermé est réparé chez SF 19 ; la
Carlsbad et l'Espagnole changent de visage. Rien de cela ne modifie le verdict du § 8 ; tout cela confirme sa lecture : la
mesure est fine là où le tempo est court, instable là où il est long, et l'accord des moteurs reste la limite dure.
