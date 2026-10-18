# Le filtre de compatibilité des plans et le test à deux demi-coups

Rapport du 18 octobre 2026 — pilote, avec la relecture de la session Expert échecs. Pièces : `reports/plans/filtre.md`
(tableau du filtre, 35 plans), `reports/plans/preparatoire.md` (test à deux demi-coups, 35 lignes), `coach/plan-distance.mjs`
(définitions), `scripts/plans/{positions-filtre,filtre,preparatoire}.mjs`, `tests/plan-distance.test.js` (7 tests),
`docs/JOURNAL-PLANS.md` (entrée du 18 octobre).

## 0. Résumé

- **Question** : peut-on écrire, sans jugement d'échecs codé en dur, une définition de « ce coup est un pas vers ce plan » qui
  reconnaisse les coups préparatoires (Tb1 avant b4-b5, a3 avant b4, Dd3 avant Ce5) sans accepter n'importe quoi ?
- **Méthode** : une fonction de potentiel par famille de plan (la *distance* à la réalisation, en nombre de mes coups),
  le progrès = la distance baisse après mon coup. Tous les coups légaux de dix positions sont notés par Stockfish 19
  (profondeur 18, un fil, reproductible) ; on lit, plan par plan, quels coups progressent et à quel prix. Puis un second
  test, proposé par l'Expert : jouer le meilleur coup *non* progressant, la réponse adverse, et mesurer si le pas du plan
  vaut mieux qu'avant (préparatoire) ou pareil (préférence).
- **Résultat principal** : la distance capture la **préparation positionnelle** — soutien d'une case, pièce à écarter,
  colonne à ouvrir — et le moteur facture le reste. Sur les cas-tests annoncés à l'avance, elle fait ce qu'on voulait :
  Tab1 et a3 préparent b4-b5 (Carlsbad), b4 et Cd3 préparent c5 (Mar del Plata), Ff4 sert à la fois e5 et l'échange des
  fous (Espagnole), et les coups prématurés (e4 à −3,70, Cbd2 à −0,71, f4 à −0,78) sont progressants *et* chers, ce qui est
  la bonne lecture.
- **Ce qui n'est pas obtenu** : un seuil sur l'écart moteur ne sépare pas « le moteur préfère autre chose » de « le moteur
  prépare ça » (distribution continue, sans creux) ; le test à deux demi-coups sépare bien les deux dans sa moitié haute
  (5 préparatoires nets, 17 préférences), mais sa moitié basse (12 « nuit au plan ») mélange quatre choses différentes, dont
  deux tiennent à la mesure et non au plan. Les deux trous trouvés dans la distance ont été corrigés ; trois limites sont
  identifiées et non corrigées (§5).
- **Rien de ceci n'est un coach** : c'est une mesure sur dix positions, sans recherche. Elle dit que la direction est
  saine et où elle casse ; elle ne dit pas encore si le prix d'un plan sur quinze coups sera juste.

## 1. La question

Le coach IA a été clos le 8 octobre parce que l'étage « formuler le plan » ne produisait que des généralités. Le
diagnostic posé avec l'Expert : on demandait au LLM de la pondération en contexte — choisir *le* plan parmi des plans
plausibles — ce qu'il ne sait pas faire, alors que percevoir (étage 1) et traduire un plan en coups vérifiés (étage 3)
marchaient. La proposition : ne plus choisir mais **arbitrer** — imposer chaque plan candidat au moteur et le chiffrer
(son *prix*, l'évaluation finale contre la ligne libre ; son *tempo*, le coup où il se réalise), pour aboutir à quatre
phrases : *c'est le plan* / *viable mais ça coûte* / *pas réalisable sans concession* / *jamais urgent ici*.

Ce que nous avions déjà (`plans.mjs`, `train-plans.py`, 0,68 AUC) lisait le plan **dans** les coups du moteur. Imposer un
plan demande l'inverse : savoir *a priori* si un coup est un pas vers lui. C'est le **filtre de compatibilité**, et c'est
le seul objet de ce rapport. Il a été construit, montré à l'Expert avant d'être codé (deux objections fermes intégrées
avant la première passe), puis jugé sur un tableau.

## 2. Méthode

### 2.1 Les familles et leurs distances (`coach/plan-distance.mjs`)

Un plan est une instance paramétrée d'une famille. Sa **distance** est un entier, en **nombre de mes coups** (y compris ceux
des pièces à moi qui doivent s'écarter), calculé sur la position seule : 0 = réalisé, ∞ = bloqué par l'adversaire. La
**sécurité des cases n'entre jamais dans la distance** : c'est le moteur qui la facture.

| famille | paramètres | distance |
|---|---|---|
| `rupture` | pion (colonne), cible (case) | Σ sur les poussées restantes de [1 + déficit(case)] ; déficit = max(0, attaquants adverses − mes défenseurs), calculé **avec le pion avançant retiré** (sa tour derrière lui le soutient par rayon X, une pièce adverse derrière lui l'attaque de même) ; +1 par pièce à moi sur le chemin ; ∞ si une pièce adverse bloque ; le double pas compte une poussée, la case sautée ne compte que les pions adverses (prise en passant). Une rupture **vise un pion** : depuis la cible, le pion attaque un pion adverse (`estLevier`, vérifié à la racine). |
| `poussee` | idem | même arithmétique, sans cible exigée : la poussée de soutien ou d'espace (f3-f4 avant e4-e5). |
| `transfert` | de, vers | plus court chemin de la pièce (Dijkstra sur ses déplacements) : case vide 1, case occupée par une pièce à moi 1 + 1 (elle s'écarte ; un rayon continue derrière elle), pièce adverse = mur, arrivée adverse = ∞. **Un pion à moi ne s'écarte que s'il peut bouger** ; sinon il est un mur. |
| `echange` | mienne (pièce suivie), cible (pièce suivie) | chemin jusqu'à une case d'où ma pièce attaque la cible, plus 1 pour la prise ; 0 si la cible a disparu. |
| `colonne` | lettre | mes pions sur la colonne (1 chacun) + chemin de ma tour la plus proche vers une case de la colonne. |
| `et` | plans | conjonction : la somme (la batterie, « f4 puis e5 »). |

Un plan réalisé reste réalisé (`verrouiller`). Les pièces suivies changent de case avec les coups des deux camps
(`suivre`) : si le Fe2 va en d3, « échanger le mauvais fou » survit.

### 2.2 La règle de compatibilité et le tableau (`scripts/plans/filtre.mjs`)

Un coup est **progressant** pour un plan si la distance baisse après lui, **l'adversaire immobile**. Pour chaque position,
tous les coups légaux sont notés (MultiPV = nombre de coups, profondeur 18) ; pour chaque plan, le tableau donne la
distance décomposée, les coups progressants avec leur note et leur **retard** sur le meilleur coup, le meilleur coup non
progressant, et l'**écart** (meilleur non progressant − meilleur progressant : négatif, le meilleur coup du moteur progresse ;
positif, le moteur préfère ne pas progresser). Pour ce dernier, une colonne dit s'il **sert un autre plan listé** de la même
position (suggestion de l'Expert). La distribution des écarts est donnée en fin de tableau.

### 2.3 Le test à deux demi-coups (`scripts/plans/preparatoire.mjs`)

Définition proposée par l'Expert pour remplacer un seuil : un coup non progressant M est **préparatoire** pour le plan P si,
après M et la meilleure réponse adverse, le pas de P vaut *nettement* mieux qu'avant ; **préférence** si rien ne change ;
**nuit au plan** s'il vaut moins. On compare des **retards** sur le meilleur coup de la position (la base bouge après deux
demi-coups), pas des notes absolues. Deux précautions apprises à la première passe : (1) si après M et la réponse le
meilleur coup est une prise ou une parade d'échec, on le joue avec sa réponse avant de mesurer (**point calme**), sinon le
test accuse M de ce que la réponse adverse a créé ; (2) Δ est donné sur le **même pas** qu'à la racine (c'est lui qui
décide du statut) *et* sur le meilleur pas après, parce que quand le meilleur pas change d'identité, Δ mesure autre chose.

### 2.4 Moteur, profondeur, plancher

Stockfish 19 natif (`/usr/local/bin/stockfish`), profondeur 18, **un fil** (`COACH_DETERMINISTIC=1`) pour les deux passes
finales — deux passes à trois fils avaient déplacé les notes de ±0,10 et fait tourner le meilleur coup quand la tête est
plate (Tc1, a4, g4 à 0,06 près sur la Mar del Plata). Le plancher « nettement » du test est **provisoire, 15 centipions** ;
l'Expert propose de le tirer de la variance 18/24 d'une même évaluation, qui sortira du test de stabilité, non fait.
Coût : le tableau, une trentaine de secondes par position ; le test, une trentaine de minutes pour 35 lignes.

## 3. Le panel

Dix positions, au trait du camp qui plane ; cinq canoniques, cinq tirées des schémas du livre de la Française. Chaque plan
est une instance des familles ci-dessus. Relecture de l'Expert : plans écartés avec sa raison.

| id | position | trait | plans retenus | écartés |
|---|---|---|---|---|
| carlsbad | Gambit dame refusé, échange, après 10…Cf8 | B | b→b5, e→e4, Cf3→e5 | — |
| iqp-panov | Caro-Kann Panov, pion isolé d4, après 12…Fb7 | B | d→d5, Cf3→e5, Dd1→d3 | — |
| herisson | Anglaise, hérisson, après 15.Tac1 | N | …b5, …d5, colonne c | …Cc5 : « thématique mais conditionnel, dépend du dispositif blanc » |
| kid-mar-del-plata | Est-indienne, après 12…g5 | B | c→c5, Ce1→d3, colonne c, Cc3→b5 | b4 : « coup préparatoire de c5, pas un plan » ; a4-a5 : « a5 n'attaque aucun pion, c'est de la restriction » |
| espagnole-echange | Espagnole d'échange sans dames, après 10…Fe6 | B | poussée f4 ET e5, e→e5, Cb1→d5, Fc1×Ff8 | — (Fc1×Ff8 ajouté sur son chiffrage : « le meilleur coup est Ff4, l'échange débloque la rupture ») |
| fr-avance-noirs | Française d'avance, après 6.Fe2 | N | Cg8→f5, Fc8×Fe2, f→f6, colonne c | — (colonne c ajoutée après la première passe, § 4.2) |
| fr-avance-blancs | Française d'avance, après 5…Db6 | B | b→b4, Ff1→e2, Fc1→e3, Cb1→b3 (**piège voulu**) | Fd3 : « gambit Milner-Barry, fait débat » ; b5 : « pas canonique dans cette structure » |
| fr-tarrasch-ferme | Tarrasch fermée, après 11.O-O | N | colonne c, Cf6→e4, e→e5 | — |
| fr-tarrasch-ouvert | Tarrasch ouverte, pion isolé noir, après 10…O-O | B | Cb3→d4, Fc1×Ce7, Fb5×Cc6, Fb5→d3 | c4 : « à double tranchant, après …dxc4 la faiblesse disparaît » |
| fr-echange | Française d'échange, après 6…O-O | B | c→c4, colonne e, Fc1→g5 | — |

Les FEN et les coups sont dans le tableau ; les deux FEN contestées (Espagnole, Tarrasch ouvert) ont été rejouées et
confirmées par l'Expert.

## 4. Résultats

### 4.1 Le tableau du filtre : les cas-tests, un par un

Les cas-tests ont été annoncés **avant** la passe (dans la grammaire montrée à l'Expert, et dans ses réponses). Notes du
point de vue du camp au trait ; entre parenthèses, le retard sur le meilleur coup.

**Carlsbad, b4-b5 (le cas-test du rayon X).** Distance 3 : b4 (poussée 1 + déficit 1 : le Fe7 attaque b4, rien ne le
défend), b5 (poussée 1 ; c6 attaque, Cc3 et le pion a4 virtuel défendent). Progressants : a3 +0,33 (−0,16), **Tab1 +0,33
(−0,16)**, Tfb1 +0,21 (−0,28), b4 −0,49 (−0,98). Argument : a3 défend b4 par le pion, Tab1 le défend par rayon X à travers
b2 ; tous deux font tomber le déficit — c'est ce que la théorie appelle « préparer l'attaque de minorité », et la mesure le
retrouve sans le savoir. b4 immédiat progresse davantage (distance 1) mais le moteur le facture 0,98 : « progressant mais ça
coûte ». Sans la transparence du pion, Tab1 ne comptait pas ; c'est l'objection de l'Expert, et le test unitaire l'encode.

**Carlsbad, e3-e4.** Distance 1, déficit 0 (d5 et Cf6 attaquent e4, Cc3 et Fd3 le défendent). Le moteur : −3,21 (−3,70).
Argument : après e4 dxe4 Cxe4 Cxe4 Fxe4, …Fxg5 — le Fg5 tombe. La distance ne le voit pas et **ne doit pas** le voir : la
préparation tactique est l'affaire du moteur. C'est la coupure géométrie / sécurité, et elle est respectée.

**Mar del Plata, c4-c5.** Distance 2 (c5 : d6 et Cd7 attaquent, le pion d5 défend : déficit 1). Progressants : **b4 +0,32
(−0,04), Cd3 +0,25 (−0,11)**, c5 −0,54 (−0,90). Argument : b4 et Cd3 ajoutent un défenseur à c5, exactement les deux
préparations de la théorie ; c5 tout de suite se heurte à …dxc5 et coûte 0,90. Phrase du coach : « c5 est le plan, pas
maintenant, après b4 ou Cd3 ». Tc1 (+0,34, −0,02) n'est pas progressant pour c5 : il prépare la **colonne que c5
ouvrira**, un second ordre invisible à la distance de rupture ; listé comme plan `colonne c`, il est attrapé (écart +0,02).

**Espagnole d'échange, f4 puis e5.** Distance 3 (f4 : 1 ; e5 : 1 + déficit 1, f6 attaque, rien ne défend). Meilleur coup
du moteur **Ff4 +0,07, progressant pour e5** (il défend e5) **et pour l'échange des fous** (Fc1-f4-d6×f8), écart −0,06 sur
les deux : « c'est le plan ». f4 immédiat : −0,71 (−0,78), progressant mais cher — …Fd6 cloue le pion sur place (chiffre
de l'Expert, retrouvé). C'est le cas d'école qu'il avait annoncé : l'échange débloque la rupture, et un seul coup sert deux
plans.

**Française d'avance, Blancs, le piège.** 6.Cbd2 est une faute (…cxd4 ! coupe la défense Dd1-d4 ; −0,35, retard 0,71).
Il est bien classé **progressant pour Cb1-d2-b3, à −0,71** : la mécanique ne cache pas un piège, elle le montre avec son
prix. a3 est le meilleur coup (+0,36) et progresse b4 (déficit 2 → 1) : écart −0,08, « c'est le plan ». Fe3 : −1,22, …Dxb2.

**Pion isolé (Panov).** Dd3 est le meilleur coup (+0,59) et réalise la batterie : « c'est le plan ». Ce5 : −1,54 (−2,13) ;
d5 : −0,84 (−1,43) ; Fb3 −0,19 prépare d5 (ajoute un défenseur). Les trois plans du pion isolé sont présents, un seul est
mûr : c'est la bonne réponse, et c'est le test à deux demi-coups qui dira *pourquoi* Ce5 attend (§ 4.3).

**Hérisson.** …b5 : distance 3 (déficit 2 : c4, Cc3 et le Fg2 par rayon X contre le seul Fb7) ; …Dc5 −0,23 (−0,12) le
prépare ; …b5 tout de suite −2,20. …d5 : −3,76. …Tac8 : −0,14 (−0,03). Le hérisson est le cas « tout attend » : le
moteur veut …Tab8 (−0,11), ni plan ni parade, et aucun plan n'est mûr.

**Poussées et coups prématurés, tous facturés** : e4 Carlsbad −3,70, …d5 hérisson −3,65, Ce5 Panov −2,13, Fe3 −1,58,
…Ce4 Tarrasch −0,77, …f6 avance −0,53, …e5 Tarrasch −0,40. Le sens est le même pour une poussée et pour un coup de pièce :
**le meilleur coup progressant du plan est lui-même mauvais ici** — plan prématuré ou réfuté dans cette position.

### 4.2 Les deux trous trouvés, et ce que la liste des plans fait au tableau

1. **Le rayon X** (Expert, sur la définition, avant la passe) : sans pion transparent, Tb1 n'était jamais un progrès. Corrigé.
2. **Le pion immobile** (trouvé par le tableau) : « échanger le mauvais fou » n'avait *aucun* coup progressant, parce que
   le Fc8 passait par une route fantôme c8-a6 derrière un pion b7 bloqué par sa propre dame. Corrigé : un pion à moi qui ne
   peut pas bouger est un mur ; …Fd7 et …Ca5 progressent, distance 4 (…Fd7, …Ca5, …Fb5, ×e2). Choix conservateur,
   documenté : bloqué par ma propre pièce *mobile* serait en théorie une cascade +2.

Et un principe que le tableau a démontré : **un meilleur coup non progressant récurrent sans étiquette est d'abord un plan
absent de la liste**. cxd4 (trois fois, avance noirs) ouvre la colonne c ; Fd3 (Tarrasch ouvert) est le transfert
Fb5→d3. Listés, ils deviennent « c'est le plan » (écarts −0,05 et −0,02). Ce qui reste d'intendance vraie : h3 (quatre
fois) et le roque (trois). Décision de l'Expert pour la suite : roque neutre par règle, h3 compté et absorbé par k ≈ 2.

### 4.3 La distribution des écarts

Sur 35 plans : 7 écarts ≤ 0 (le meilleur coup progresse), 6 dans ]0 ; 0,10], 7 dans ]0,10 ; 0,25], 6 dans ]0,25 ; 0,50],
5 dans ]0,50 ; 1,00], 4 au-delà. **Continue, sans creux** : c'est la mauvaise nouvelle annoncée par l'Expert, un seuil x sur
l'écart n'a pas de bonne valeur. Le tableau dit pourquoi : h3 contre Tab1 (+0,16) est une préférence, Dd3 contre Ce5
(+2,13) est une préparation, O-O contre …Fd7 (+0,36) est entre les deux — la grandeur de l'écart mesure la préférence du
moteur, pas la relation du coup au plan. **Aucun cas « forcé »** non plus : dix positions calmes, aucune menace sur
l'échiquier, la clause « parade » n'a rien eu à trancher.

### 4.4 Le test à deux demi-coups

35 lignes, un M par plan. Bilan : **5 préparatoires, 17 préférences, 12 « nuit au plan », 1 cible disparue** ; 5 mesures
prolongées jusqu'au point calme.

**Préparatoires (Δ sur le même pas > 0,15).**
- Dd3 → Ce5 (Panov) : retard de Ce5 **2,13 → 0,84**, Δ +1,29. Après Dd3 g6, Ce5 n'est plus une faute. C'est le cas
  d'école : Dd3 est « préparatoire » par mesure, là où la carte d'attaques ne voit rien (le déficit de e5 est nul avant
  comme après). La préparation tactique, invisible à la distance, est visible au test.
- Dd3 → Fb3 (d5, Panov) : 0,78 → 0,31, Δ +0,47. Même coup, second plan servi.
- **O-O → …Ce4** (Tarrasch fermée) : 0,77 → 0,00, Δ +0,77, mesuré au point calme après O-O Ff4 Fxf4 Cxf4. Le roque est
  préparatoire pour …Ce4 — **mesuré, pas décrété**. (Le même roque sort « nuit » pour …e5 sur le même pas, § ci-dessous.)
- …Tab8 → …d5 (hérisson) : 3,65 → 2,78, Δ +0,87 — mais d5 reste très mauvais (2,78). Le statut « préparatoire » est ici
  trop généreux : le test devrait exiger que le pas devienne *viable*, pas seulement moins mauvais.
- h3 → Ce5 (Carlsbad) : 0,28 → 0,00, Δ +0,28, à la limite du plancher.

**Préférences (17).** h3 pour b4-b5, g4 pour c5 et Tc1, Te1 pour Fg5, Fe3 pour e5 et l'échange, cxd4 pour …Cf5, …Tab8
pour …b5 et …Tc8, Fd3 pour Cbd4 : le pas du plan vaut après ce qu'il valait avant (|Δ| ≤ 0,14). C'est la lecture « le
plan va bien, le moteur a juste un autre coup utile » — et pour un apprenant, c'est la leçon.

**« Nuit au plan » (12) — quatre natures, dont deux tiennent à la mesure.**
1. *Rétrogradation réelle après un échange* : cxd4 cxd4 puis …Fd7 (0,24 → 0,56), …f6 (0,53 → 0,99) ; a3 a5 puis Fe2
   (0,08 → 0,35). Après l'échange ou la fixation, un autre plan passe devant. Lecture juste.
2. *Prophylaxie adverse contre le plan* : Fd2 **…Fg4** puis Fd3 (0,00 → 0,26) ; Fd3 **…h6** puis Fg5 (0,14 → 6,57 : Fg5
   hxg5 est une gaffe). La réponse adverse *restreint* le plan ; de son point de vue, c'est son propre plan (la famille
   « restriction » que l'Expert propose, l'opposé de ma distance). Le test l'attribue à tort à M.
3. *Parade pendante non détectée* : Ff4 **…c4** attaque le Cb3 ; Cc3 passe de 0,11 à 5,35 et f4 disparaît. Mon point calme
   ne regarde que les prises et les échecs ; une pièce attaquée n'est ni l'un ni l'autre. Défaut de mesure, pas de plan.
4. *Changement d'identité du pas* : Ch6 Fxh6 gxh6 Dd2 puis cxd4 (0,00 → 0,47) mais …Fd7 (0,00) progresse la colonne c
   autrement ; O-O Ff4 Fxf4 Cxf4 puis …e5 (0,40 → 2,39) mais …Cg4 (0,07) la prépare. Le plan est vivant par un autre pas ;
   Δ sur le même pas dit « nuit », Δ sur le meilleur pas dit « rien ». Les deux colonnes sont nécessaires.

**Cible disparue (1)** : b4 après Fe2 cxd4 cxd4 : plus de pion c5 à attaquer, la rupture n'a plus d'objet. Sortie propre.

## 5. Ce qui est démontré, ce qui ne l'est pas, les limites

**Démontré sur dix positions.**
- La distance reconnaît la préparation *positionnelle* (soutien, écart, ouverture de colonne) sans rien savoir des
  ouvertures : les cas-tests annoncés passent, et deux définitions fausses ont été trouvées et corrigées par la méthode
  elle-même (objection sur la grammaire, puis une ligne « aucun coup progressant » dans le tableau).
- La coupure « géométrie à la distance, sécurité au moteur » tient : les coups prématurés sont progressants et chers, les
  pièges aussi (Cbd2), sans qu'aucune règle d'échecs ne soit codée.
- La colonne « sert un autre plan » est la bonne loupe : quand le moteur refuse un plan, c'est presque toujours qu'il en
  sert un frère du catalogue (Dd3 contre Ce5, Ff4 contre f4), et un coup récurrent sans étiquette est un plan manquant.
- Le test à deux demi-coups sépare préparation et préférence dans sa moitié haute, et il voit la préparation *tactique*
  que la distance ne voit pas (Dd3 avant Ce5 ; le roque avant …Ce4).

**Non démontré.**
- Qu'un *prix* sur quinze coups soit juste : aucune recherche n'a été faite, tout est à la profondeur 1 ou 3.
- Que la clause « forcé » fonctionne : aucune menace dans le panel.
- Que la méthode résiste à des positions hors des structures classiques.

**Limites identifiées, non corrigées.**
1. *Second ordre* : Tc1 prépare la colonne que c5 ouvrira ; seule la famille `colonne` listée à côté l'attrape. Règle
   pratique : lister `colonne` partout où une colonne peut s'ouvrir.
2. *Échange réalisé par une autre pièce* : Txe7 compte comme réalisation de Fc1×Ce7 (la cible disparaît) ; il faut exiger
   la prise par la pièce suivie, ou un échange de valeur égale.
3. *Point calme incomplet* : une pièce attaquée n'est pas détectée ; brancher `coach/threats.mjs` (gains à un coup pour
   l'adversaire) avant de mesurer.
4. *Dépendance à une seule réponse* : entre la passe à trois fils et la passe à un fil, la réponse à a3 est passée de …c4
   à …a5, et le verdict sur Cbd2 de « préparatoire +0,71 » à « préférence −0,14 ». Une réponse en MultiPV 2, ou la
   profondeur 22, est nécessaire pour les arbitrages serrés.
5. *Statut « préparatoire » trop généreux* quand le pas reste mauvais (…d5 hérisson, 2,78 après) : exiger la viabilité.
6. *Plancher provisoire* (15 cp) : à remplacer par la variance 18/24.
7. *Déficit sans discernement* : Txe6 et Te5 comptent comme défenseurs de d5. Inoffensif ici (le moteur facture), réglé
   par construction dans un faisceau qui ne prend que la tête du MultiPV.

## 6. Suite possible — chaque étape avec son go

| étape | ce qu'elle tranche | coût |
|---|---|---|
| Point calme par menaces + prise par la pièce suivie + viabilité exigée | les natures 2 à 4 du « nuit au plan » ; un test à deux demi-coups propre | une demi-journée de code, 30 min de moteur |
| Panel avec menaces (fautes vérifiées des livres, offre de l'Expert) | la clause « forcé » et x, qui n'ont rien eu à trancher ici | 10 positions, une heure de moteur |
| Stabilité 18/24 et deux moteurs, déterministe | le plancher « nettement » ; si les ordres tournent, tout le reste est du bruit | une nuit |
| Recherche en faisceau (compteur : forcé et roque neutres, k ≈ 2 ; quatre sorties) | le prix et le tempo d'un plan sur quinze coups — la question d'origine | plusieurs jours de code, une nuit par panel ; Deneb utile |

Rien de cette suite ne démarre sans le go de l'auteur.
