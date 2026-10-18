# Le faisceau : le prix et le tempo d'un plan imposé au moteur sur quinze coups

Rapport du 18 octobre 2026 (soir) — pilote, avec les relectures de la session Expert échecs (sémantique) et de la session
Dev chef (mécanique). Suite directe du rapport du filtre (`RAPPORT-FILTRE-2026-10-18.md`) et du cahier des charges écrit
avant le code (`FAISCEAU-CRITERE-2026-10-18.md`). Pièces : annexes X (passe SF 19), Y (passe SF 17.1), Z (accord des deux
moteurs), ZZ (passe à référence gloutonne, gardée comme témoin du biais) ; code `scripts/plans/faisceau.mjs`,
`faisceau.sh`, `accord-faisceau.mjs`, `coach/en-prise.mjs` ; journal `docs/JOURNAL-PLANS.md`.

> **État au moment de l'écriture (18 octobre, 23 h) : le verdict du critère n'est pas rendu.** Le décompte à profondeur 18
> donne 6 positions sur 10 avec chacun des deux moteurs, sous la barre des 70 % ; la clause prévue avant la passe — une
> contradiction du livre confirmée à profondeur 30 vaut réussite — est en cours d'arbitrage par l'Expert sur les quatre
> contradictions de SF 19. Une seule confirmée fait 7 sur 10. Le § 8 sera complété par ses chiffres ; rien d'autre ne
> bougera.

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

*À compléter par les arbitrages à profondeur 30 de l'Expert sur les quatre contradictions de SF 19 (Carlsbad, Espagnole,
avance blancs, Tarrasch fermée). Décompte au 18 octobre, 23 h : 6 réussies sur 10 ; une contradiction confirmée suffit à
atteindre 7.*

## 9. La suite, selon le verdict

- **Si le critère passe** : l'épreuve du jeu — le faisceau étendu à la partie entière (le coach choisit, le moteur exécute
  sous contrainte, le moteur libre en face ; coût par partie de suivre la théorie), puis Maia (le même coach guidant un
  Maia-1500 contre lui-même). Avant d'en écrire une ligne : les sorties parlent exactement le vocabulaire stabilisé le 18
  octobre, plus prix et tempo.
- **Si le critère échoue** : ce rapport dit pourquoi — le prix d'un plan sur quinze coups existe et se lit, mais il ne
  départage pas des plans à moins de 0,3 l'un de l'autre dans des positions calmes, et deux moteurs n'y donnent pas le même
  chiffre un cas sur deux ; et le critère a mesuré la désignation des canoniques autant que l'instrument (§ 6 bis). On
  ferme, en gardant l'instrument et le vocabulaire — et l'auteur relit ce rapport **à froid, dans quelques jours**, pour
  décider si l'épreuve du jeu mérite un go à part. Ce n'est pas le soir même qu'on tranche cela ; c'est le cahier des
  charges qui le dit.
