# Le filtre de compatibilité des plans et le test à deux demi-coups

Rapport du 18 octobre 2026 — pilote, avec la relecture de la session Expert échecs. Pièces : `ANNEXE-A-filtre-2026-10-18.md`
(tableau du filtre, 35 plans), `ANNEXE-B-preparatoire-2026-10-18.md` (test à deux demi-coups, 35 lignes) — copies figées de
`reports/plans/{filtre,preparatoire}.md` —, `coach/plan-distance.mjs`
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
| kid-mar-del-plata | Est-indienne, après 12…g5 | B | c→c5, Ce1→d3, colonne c, Cc3→b5 | b4 : « coup préparatoire de c5, pas un plan » (relecture relayée par l'auteur) ; a4-a5 : a5 n'attaque aucun pion — sorti par la règle `estLevier`, endossée par l'Expert (« c'est de la restriction, …b6 ») |
| espagnole-echange | Espagnole d'échange sans dames, après 10…Fe6 | B | poussée f4 ET e5, e→e5, Cb1→d5, Fc1×Ff8 | — (Fc1×Ff8 ajouté sur son chiffrage : « le meilleur coup est Ff4, l'échange débloque la rupture ») |
| fr-avance-noirs | Française d'avance, après 6.Fe2 | N | Cg8→f5, Fc8×Fe2, f→f6, colonne c | — (colonne c ajoutée après la première passe, § 4.2) |
| fr-avance-blancs | Française d'avance, après 5…Db6 | B | b→b4, Ff1→e2, Fc1→e3, Cb1→b3 (**piège voulu**) | Fd3 : « gambit Milner-Barry, fait débat » ; b5 : « pas canonique dans cette structure » |
| fr-tarrasch-ferme | Tarrasch fermée, après 11.O-O | N | colonne c, Cf6→e4, e→e5 | — |
| fr-tarrasch-ouvert | Tarrasch ouverte, pion isolé noir, après 10…O-O | B | Cb3→d4, Fc1×Ce7, Fb5×Cc6, Fb5→d3 | c4 : « à double tranchant, après …dxc4 la faiblesse disparaît » |
| fr-echange | Française d'échange, après 6…O-O | B | c→c4, colonne e, Fc1→g5 | — |

Les FEN et les coups sont dans le tableau ; les deux FEN contestées (Espagnole, Tarrasch ouvert) ont été rejouées et
confirmées par l'Expert. Deux voix ont relu : la session Expert échecs par le canal direct, et une relecture relayée par
l'auteur dans le chat ; quand elles ont divergé (…Cc5 au hérisson), la seconde a tranché le retrait, la première l'a confirmé.

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

### 4.5 Relecture de l'Expert après le rapport : six retours, et le bilan relu sans relancer le moteur

L'Expert a lu le rapport et le tableau du test en entier. Ses six retours, du plus important au moindre, avec ce que
chacun change :

1. **La prophylaxie adverse (nature 2) est une information, pas un défaut** : « Fd3 …h6 puis Fg5 hxg5 » dit que Fg5 se
   joue *avant* …h6 — le plan est **périssable**, la fenêtre se ferme. Sortie proposée : quand Δ même pas < −plancher parce
   que la réponse adverse attaque ou contrôle la case du pas (lisible sur la carte d'attaques avant/après), non pas
   « M nuit » mais « le plan n'attend pas ». À terme, un drapeau *urgent* sur « c'est le plan ». *Demande du code.*
2. **Trancher le statut sur le meilleur pas** (nature 4), garder Δ même pas comme colonne « le chemin a changé » : le test
   mesure la vie du *plan*. *Relu ci-dessous sans relancer.*
3. **L'échange est réalisé quand les deux pièces suivies disparaissent l'une contre l'autre** (prise directe ou reprise,
   quel que soit l'initiateur) ; cible disparue autrement = plan sans objet. Couvre Txe7 et le cas symétrique. *Code.*
4. **Viabilité : 0,3**, le seuil déjà en vigueur pour les livres — « préparatoire » = Δ > plancher *et* retard après ≤ 0,3 ;
   sinon « moins mauvais mais toujours pas réalisable ». Un seul vocabulaire de seuils dans le projet. *Relu ci-dessous.*
5. **Deux réponses adverses** (MultiPV 2, garder le pire Δ) pour tout verdict à moins de deux planchers du bord : un
   préparatoire doit l'être contre toute bonne défense. Point calme par `threats.mjs`, borné à 2-3 résolutions. *Code et moteur.*
6. **Attribution** (§ 3) : les exclusions b4 et a4-a5 de la Mar del Plata sortent de la relecture relayée et de la règle
   `estLevier`, endossées par l'Expert, qui ne les avait pas formulées. *Corrigé dans le tableau du § 3.*

**Bilan relu selon les points 2 et 4, à partir des mêmes mesures** (statut sur le meilleur pas, plancher 15 cp,
viabilité 30 cp) : **4 préparatoires, 2 « moins mauvais mais pas réalisable », 18 préférences, 10 nuit au plan, 1 cible
disparue.** Ce que la relecture change, et ce qu'elle révèle :
- Deux « nuit » passent en préférence (colonne c de l'avance noirs par …Fd7, …e5 du Tarrasch fermé par …Cg4) : le plan
  vit par un autre pas, M ne lui a pas nui.
- **Le cas d'école est rétrogradé** : Dd3 → Ce5 (Panov) a Δ +1,29 mais un retard après de 0,84, donc « moins mauvais mais
  toujours pas réalisable » au seuil de 0,3 ; de même Dd3 → d5 (0,31, à un centipion du seuil). Lecture honnête : *une*
  préparation ne suffit pas, Ce5 demande Dd3 *et* autre chose (Tad1, Fb3…), et le test à deux demi-coups ne mesure qu'un
  pas de préparation. C'est précisément ce que la recherche en faisceau mesurerait, et ce que ce test ne peut pas faire.
- …d5 au hérisson passe « préparatoire » par le meilleur pas (…Dc5 à 0,09) alors que d5 lui-même reste à 2,78 : ici
  les points 2 et 4 se contredisent — le meilleur pas est viable, le pas de la racine ne l'est pas. Les deux colonnes
  restent nécessaires, et le vocabulaire des sorties devra distinguer « le plan vit » de « ce pas-là se joue ».

**Le vocabulaire qui règle les deux cas (réponse de l'Expert) : deux axes que le mot « préparatoire » confondait.**
- *Axe 1, l'effet du coup M sur le plan* (Δ sur le meilleur pas) : **prépare / neutre / nuit / ferme la fenêtre**. Une
  propriété du coup.
- *Axe 2, l'état du plan après M et la réponse* : **mûr** (la réalisation elle-même est viable, retard ≤ 0,3) /
  **en préparation** (un pas viable existe, pas la réalisation) / **injouable** (aucun pas viable) / **sans objet** /
  **bloqué**. Une propriété du plan.

Relus ainsi : « Dd3 *prépare* Ce5 (Δ +1,29) ; le plan est *en préparation*, pas mûr (0,84) — une préparation ne suffit
pas. » C'est la vérité d'échecs : le Ce5 du pion isolé demande Dd3 *plus* une tour en e1 ou d1 ; la théorie dit la même
chose que la mesure, et savoir si deux ou trois préparations cumulées suffisent est la question du faisceau. Le cas
d'école n'est pas rétrogradé, il est raconté plus honnêtement. Et « …Tab8 est *neutre* pour …d5 ; le plan est *en
préparation* (…Dc5 viable à 0,09) ; sa réalisation reste *injouable* (2,78). » Pour les valeurs à un centipion du seuil
(Dd3 → d5, 0,31) : une **bande grise de ± plancher autour de 0,3**, verdict « limite », à retester à profondeur 24 — la
pratique déjà en vigueur pour les fautes des livres ; le jour de la variance 18/24, la bande héritera du bon chiffre.

### 4.6 Troisième relecture (relayée par l'auteur) : trois points qui réordonnent la suite

1. **La stabilité d'abord, aucun code avant.** Un verdict qui change de signe avec le nombre de fils n'est pas un verdict,
   et le plancher de 15 cp est à la limite du bruit mesuré : h3 → Ce5 (+0,28), g4 → Cb5 (+0,14), …Tab8 → …b5 (+0,03) sont
   peut-être du signal, peut-être pas, et ce tableau ne permet pas de le savoir. Précision pour la nuit elle-même : il y a
   **deux instabilités de nature différente**. L'une est continue — ±0,10 sur les notes entre passes — et c'est elle que la
   variance 18/24 et entre moteurs chiffrera (le plancher). L'autre est **discrète** : le basculement de Cbd2 (+0,71 →
   −0,14) vient d'un changement de *réponse adverse* (…c4 puis …a5, à égalité à profondeur 18), un saut de ligne entière que
   la variance ne décrit pas. La nuit doit donc produire deux chiffres : la variance des notes, et la fréquence à laquelle
   le meilleur coup, la meilleure réponse et l'ordre des écarts **changent d'identité** entre 18 et 24 et entre moteurs. Elle
   ne demande aucun code (`--depth 24` sur les deux scripts, `STOCKFISH_PATH=/usr/games/stockfish` pour le second moteur) ;
   une heure pour le tableau, cinq à six pour le test, un fil.
2. **Le roque n'est pas neutre.** Les données le disent : O-O prépare …Ce4 (+0,77 au point calme) et nuit à …e5 sur le
   même pas — le roque est un coup de plan comme un autre, et c'est une des lignes les plus intéressantes du test. « Roque
   neutre par règle » ne vaut que comme raccourci du compteur du faisceau, où rejouer le test à chaque nœud coûterait trop ;
   **il ne remonte jamais dans la narration** : le coach dit ce que la mesure a dit, jamais ce que le raccourci a supposé.
3. **Deux préférences, deux leçons.** Dix-sept préférences sur trente-cinq, la sortie dominante du futur coach — mais la
   colonne « sert » y distingue « le moteur préfère un coup d'intendance » (h3) de « le moteur préfère un **plan frère** »
   (Ff4 qui sert e5 et l'échange, cxd4 qui ouvre la colonne c). La seconde est précisément la comparaison de plans voulue au
   départ, celle qui transforme une préférence en choix. « Sert un plan frère » est la troisième information, à côté des
   deux axes du § 4.5.

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
| **1. Stabilité 18/24 et deux moteurs, déterministe — aucun code avant** | le plancher « nettement » (variance des notes) et la part des verdicts qui changent d'identité (meilleur coup, meilleure réponse, ordre des écarts) ; tout ce qui suit est paramétré par ces deux chiffres | une nuit de moteur, zéro code |
| 2. Test à deux demi-coups propre : point calme par menaces (borné), échange réalisé l'une contre l'autre, statut sur le meilleur pas + viabilité 0,3 avec bande grise, « le plan n'attend pas », deux réponses adverses pour les verdicts serrés, « sert un plan frère » en sortie | les natures 2 à 4 du « nuit au plan » ; les retours des deux relectures (§ 4.5, § 4.6) | une demi-journée de code, une heure de moteur |
| 3. Panel avec menaces (fautes vérifiées des livres, offre de l'Expert) | la clause « forcé », qui n'a rien eu à trancher ici | 10 positions, une heure de moteur |
| 4. Recherche en faisceau (compteur : forcé et roque neutres *comme raccourci seulement*, k ≈ 2 ; les deux axes et le plan frère en sorties) | le prix et le tempo d'un plan sur quinze coups — la question d'origine | plusieurs jours de code, une nuit par panel ; Deneb utile |

Rien de cette suite ne démarre sans le go de l'auteur.

## 7. La nuit de stabilité (18 octobre, soir) — résultats

> **Erratum (18 octobre, 21 h 30).** Les passes ci-dessous, et celles du § 4, ont été annoncées « déterministes, un fil » :
> c'était faux. `filtre.mjs` et `preparatoire.mjs` fixaient le nombre de fils du moteur en dur (3 et 2), ce qui écrasait le
> réglage `COACH_DETERMINISTIC=1` du lanceur. Découvert par la vérification de déterminisme VPS / Orion (même binaire, même
> profondeur : notes différentes, médiane 4 cp, max 39, 13 statuts du test sur 35 changés), confirmé par deux passes
> fraîches identiques sur le VPS (18 coups sur 21 différents à 3 fils ; **0 sur 24 à un fil** après correction). Les
> chiffres de variance ci-dessous incluent donc le bruit des fils (~4 cp de médiane, 14 au 90e centile) ; les conclusions
> qualitatives (la réponse adverse comme source des basculements, l'écart entre réseaux) tiennent, les chiffres sont
> refaits en vrai déterministe au § 8. Sur Orion, 10 processus à 3 fils ont tourné au lieu de 10 à un fil : la règle des 12
> processus a été respectée à la lettre, pas en charge réelle.

Go de l'auteur sur l'étape 1 du § 6, sans code de test : les deux scripts relancés tels quels, un fil, déterministe, une
position par processus (`scripts/plans/nuit-stabilite.sh`), et un comparateur (`scripts/plans/comparer-stabilite.mjs`).
Trois passes sur le VPS : SF 19 à profondeur 24 (tableau 26 min, test 34 min), SF 17.1 (paquet Ubuntu) à 18, puis SF 17.1
à 24 ; Orion (le poste de l'auteur) a reçu SF 17.1 à 24 et la reproduction de SF 19 à 24 pour vérifier le déterminisme
entre machines. Pièces : annexes C à F. Référence : les passes du § 4 (SF 19, profondeur 18).

**Axe profondeur (SF 19, 18 → 24 ; annexes C et D).**
- *Variance des notes* sur les 230 mêmes coups : médiane **6 cp**, 75e centile 12, 90e centile **19**, max 44. Le plancher
  de 15 cp pris au jugé est sous le 90e centile : **le plancher mesuré est ~20 cp.**
- *Mécanique* : distances identiques 35/35 (géométrie pure) ; meilleur coup progressant identique 34/35.
- *Le moteur hésite où il hésite* : le meilleur coup de la position change dans 3 positions sur 10 (hérisson Tab8 → Tac8,
  Mar del Plata g4 → a4, Française d'échange Fg5 → h3), toutes des têtes plates à 0,05 près ; 6 écarts sur 35 changent de
  signe au plancher ; mais **l'ordre des écarts tient (Spearman 0,95)**.
- *Le test à deux demi-coups n'est pas stable tel qu'écrit, et la cause est isolée* : sur les **22 lignes où la réponse
  adverse est la même** aux deux profondeurs, **aucun statut ne change** ; sur les **14 lignes où la réponse change**
  (…g6 → …a5, …Tc8 → …Fa6, …Cde2 → …De2, …a5 → …c4, Ff4 → Fg5), **9 statuts changent** et les Δ sautent de plusieurs pions
  (Ff4 …Fa6 puis Dd3 : 0,00 → −8,60 ; …Ce4 après O-O Fg5 au lieu de O-O Ff4 : +0,77 → −7,60). Le bruit n'est pas dans les
  notes, il est dans **l'identité de la réponse adverse**. Mesurer sur les deux meilleures réponses et garder le pire Δ
  (point 5 de l'Expert) n'est pas une amélioration : c'est la condition d'existence du test. Les sauts à −8 sont des pièces
  qui pendent après la réponse : le point calme par menaces reste nécessaire.

**Axe moteur (profondeur 18, SF 19 → SF 17.1 ; annexes E et F).**
- *Variance des notes* : médiane 6, 75e centile 12, **90e centile 25, max 368** (un désaccord tactique isolé). Un second
  moteur, c'est un second réseau d'évaluation : la queue est plus lourde qu'entre deux profondeurs du même moteur.
- *Test* : 10 statuts sur 35 changent, et cette fois **7 avec la même suite jouée** — les deux moteurs évaluent la même
  ligne à 0,3-1,0 près (e4 Carlsbad après h3 g6 : −0,19 → +0,79 ; les trois plans de la Mar del Plata après g4 h5 : −0,3 à
  −0,6). La frontière préférence / nuit au plan à ±20 cp est franchie par le seul changement de réseau. Conséquence : un
  statut n'est annonçable que s'il tient sur les deux moteurs (la « règle des deux moteurs » déjà en vigueur pour les plans
  vérifiés du coach) ; ici, 25 lignes sur 35.

**Ce que la nuit tranche.** (1) Plancher : 20 cp pour un moteur, et les verdicts à moins de 40 cp du bord sont « limite ».
(2) Le tableau du filtre est stable là où il compte (ordre des écarts, pas progressants, distances) ; son instabilité est
celle du moteur entre coups équivalents, et c'est une sortie (« plusieurs coups utiles, aucun plan urgent »), pas un défaut.
(3) Le test à deux demi-coups doit être réécrit avant d'être lu : deux réponses adverses (pire Δ), point calme par menaces,
accord des deux moteurs. Sans ces trois conditions, 9 à 10 verdicts sur 35 sont du bruit ; avec la seule première, 22 sur 22
ont tenu. C'est le cahier des charges de l'étape 2 du § 6.

**Complément (passe 3, SF 17.1 à 24, calculée sur Orion ; annexes G à J).** Les deux axes se croisent et confirment :
- *Profondeur, pour le second moteur (SF 17.1, 18 → 24)* : variance des notes médiane 5, 90e centile 16, max 47 — le plancher
  de 20 cp tient pour les deux moteurs. Test : **30 lignes à réponse identique, 2 statuts changent ; 6 lignes à réponse
  changée, 2 changent.** Même diagnostic que pour SF 19 : à réponse constante le test tient.
- *Moteur, à profondeur 24 (SF 19 → SF 17.1)* : variance médiane 9, 90e centile **36**, max 365 ; 11 statuts sur 35
  changent, dont **6 à réponse identique** — l'écart entre réseaux (0,3 à 1,0 sur une même ligne) reste la plus grosse source
  de désaccord, et elle ne se réduit pas avec la profondeur. Ordre des écarts : Spearman 0,93.
- *Le meilleur coup de la position* change beaucoup entre moteurs (22/35) et entre profondeurs pour SF 17.1 (23/35) : les
  têtes sont plates dans ce panel calme ; le meilleur coup *progressant*, lui, ne change presque jamais (1 à 2/35).
Déterminisme entre machines (même binaire SF 19, un fil, VPS contre Orion) : en cours, résultat attendu identique au
centipion ; consigné dès réception.

## 8. Chiffres définitifs, déterministe contre déterministe (18 octobre, 18 h 30)

Après correction des scripts (un fil, `COACH_DETERMINISTIC=1` respecté ; vérifié : deux passes fraîches identiques,
0 différence sur 24 coups), trois passes refaites sur le VPS, trois processus à un fil : SF 19 à 18 (la référence), SF 19 à
24, SF 17.1 à 18. Les mêmes coups M pour le test dans les trois (ceux du tableau du § 4). Annexes K à P. Les chiffres du
§ 7 restent comme témoins de ce que mesurent des passes à plusieurs fils ; ceux-ci les remplacent.

| axe | notes : médiane / 90e / max (cp) | meilleur coup changé | signe de l'écart changé | Spearman des écarts | test : statuts changés à réponse identique | … à réponse changée |
|---|---|---|---|---|---|---|
| **bruit des fils** seul (3 fils → 1 fil, SF 19, p18) | 5 / 17 / 49 | 11/35 | 6/35 | 0,96 | — | — |
| bruit des fils seul (p24) | 6 / 13 / 49 | 11/35 | 4/35 | 0,93 | — | — |
| **profondeur** 18 → 24, SF 19 | 8 / **25** / 46 | 8/35 | 6/35 | **0,95** | **3/24** | **9/12** |
| **moteur** SF 19 → SF 17.1, p18 | 7 / 26 / **363** | 15/35 | **11/35** | **0,85** | 3/25 | 6/11 |
| moteur SF 19 → SF 17.1, p24 (Orion) | 9 / 24 / 380 | 10/35 | 2/35 | 0,94 | 4/24 | 9/12 |
| profondeur 18 → 24, SF 17.1 (Orion) | 5 / 14 / 37 | 14/35 | 5/35 | 0,94 | 1/31 | 4/5 |
| **déterminisme** VPS → Orion (SF 19, p24, un fil) | **0 / 0 / 0** | **0/35** | **0/35** | **1,00** | **0/35** | — |

**Ce que les chiffres propres disent.**
1. **Plancher : 25 cp** (90e centile de l'axe profondeur, net du bruit des fils), et non 15 ni 20. Les verdicts à moins de
   50 cp du bord sont « limite ».
2. **Le bruit des fils est du même ordre que l'effet de la profondeur** (17 contre 25 au 90e centile) : toute comparaison
   faite à plusieurs fils mesure d'abord les fils. Règle : un fil, toujours, pour mesurer ; les fils servent à jouer.
3. **La mécanique ne bouge pas** : distances 35/35, meilleur coup progressant 32-33/35, ordre des écarts 0,95 en
   profondeur. Le classement des plans tient.
4. **Le test à deux demi-coups** : à réponse adverse identique, 3 statuts sur 24 changent avec la profondeur (ce sont de
   vrais déplacements d'évaluation autour du plancher) ; quand la réponse change, 9 sur 12. La réponse unique reste la
   première cause de basculement ; la seconde est le plancher trop bas. Cahier des charges inchangé : deux réponses (pire
   Δ), point calme par menaces, plancher 25, et l'accord des deux moteurs.
5. **Le second moteur est l'axe le plus dur** : même médiane, mais une queue lourde (363 cp : un désaccord tactique franc),
   11 signes d'écart sur 35 changent, Spearman 0,85. Deux réseaux ne classent pas les plans de la même façon dans un plan
   sur trois quand l'écart est petit. La règle des deux moteurs n'est pas une précaution : sans elle, un tiers des petits
   écarts n'ont pas de signe.
6. **Déterminisme entre machines : établi.** Même binaire, un fil, VPS contre Orion (i5-14400F) : 0 différence au centipion
   sur 230 coups et 35 plans, 0 statut du test changé, Spearman 1,00 (annexe Q). Tout ce qui bougeait entre passes avant la
   correction était les fils. Les passes 24 du second moteur et l'axe profondeur de SF 17.1 (Orion, annexes R-T) confirment
   le tableau : à réponse identique le test tient (1/31 et 4/24), à réponse changée il bascule (4/5 et 9/12) ; entre réseaux,
   la queue reste lourde (380 cp) à profondeur 24 comme à 18.

## 9. Lecture de la nuit (relecture relayée par l'auteur) — ce qu'elle a tranché de plus que prévu

**Le plan est un objet plus stable que le coup.** Entre les deux moteurs, à profondeur égale et un fil, le *meilleur coup
de la position* change dans 15 cas sur 35 (et 11 sur 35 par le seul bruit des fils) ; le *meilleur coup progressant* du
plan change dans 2 cas sur 35 ; la *distance* ne bouge jamais, 35 sur 35, sur tous les axes. Deux réseaux qui ne sont pas
d'accord sur ce qu'il faut jouer sont d'accord sur ce qui fait avancer b4-b5. La grammaire est ce qui ne tremble pas quand
le moteur tremble — c'est l'argument des briques, mesuré.

**Les sauts du test ne sont pas tous du bruit.** Les réponses qui font basculer un statut sont de deux natures, et la
carte d'attaques les sépare mécaniquement : *Ff4 …Fa6* (le fou prend a6-f1, Dd3 pend la dame), *O-O Fg5* (le cavalier f6
est cloué, …Ce4 n'existe plus), *Fd3 …h6* (Fg5 devient une gaffe) — la réponse **attaque ou contrôle la case du pas**, et le
−8 dit « ce plan n'attend pas, la prochaine réponse le ferme » ; à l'inverse *…Cde2 / …De2* au hérisson ou *…g6 / …a5* à la
Carlsbad sont des réponses équivalentes sur une tête plate — là, c'est de la variance. Cahier des charges de l'étape 2,
dans cet ordre : (1) classer la réponse adverse par la carte d'attaques de la case du pas, avant/après ; (2) deux réponses,
le pire Δ comme garde-fou ; si la réponse qui donne le pire touche la case du pas, verdict **« ferme la fenêtre »** (plan
périssable, la sortie la plus utile du coach), sinon variance. Le minimum sur les réponses donne l'urgence, l'identité de la
réponse donne l'explication.

**Ce que le plancher implique.** À 25 cp de plancher et 50 de bande, sur un panel calme où presque tout le signal est à
moins de 0,5 du meilleur coup, un test à un pas travaille à deux fois le bruit au mieux et dira souvent « limite ». Ce n'est
pas un défaut du test, c'est la limite de toute mesure à un pas — et le plus solide argument pour le faisceau : sur quinze
coups, le prix d'un plan s'accumule linéairement, le bruit comme une racine carrée ; un plan qui coûte 0,1 par coup pendant
dix coups vaut 1,0 en bout de ligne, quatre planchers, là où aucun de ses pas ne sortait de la bande grise.

**Second moteur, vocabulaire.** Entre 0,3 et 1,0 d'écart entre réseaux sur une même ligne, l'accord des deux est la
condition d'un verdict (un tiers des petits écarts sans signe, c'est le chiffre qui la justifie). Au-delà d'un pion, ce n'est
pas du bruit à absorber : c'est un désaccord tactique, à trancher une fois à profondeur 30, et le coach peut le dire tel
quel — « contesté entre moteurs » est une phrase qui a un sens pour un élève.

**Règle écrite en tête du dépôt** : un fil pour mesurer, les fils pour jouer (CLAUDE.md).

## 10. L'étape 2 : le test à deux demi-coups réécrit, relu, mesuré (18 octobre, 20 h)

**Ce qui a été fait.** Go de l'auteur (« lance tout »). `scripts/plans/preparatoire.mjs` réécrit selon le cahier des charges
des § 6 et § 9 : deux réponses adverses et le pire Δ ; point calme (prise, échec, pièce en prise, coup forcé) ; la pire
réponse classée par la carte d'attaques de la case du pas ; deux axes ; plancher 25, bande 50, viabilité 0,3 ; « sert un
plan frère » ; accord des deux moteurs (`accord-moteurs.mjs`) ; lanceur `etape2.sh` (une position par processus, un fil).
Puis, à la demande de l'auteur, **relecture du code par deux pairs avant la passe définitive** : l'Expert échecs
(sémantique) et le Dev chef (mécanique).

**Ce que les relectures ont corrigé** (toutes appliquées, commits `51a3d41` → `87e83d8`).
- *Expert* : pièce en prise par **mini-échange** sur la case (valeurs croissantes) au lieu du surnombre brut ; « ferme la
  fenêtre » réservé au **pion** adverse qui prend le contrôle de la case du pas (irréversible) ou au pas devenu illégal —
  une pièce qui vient viser n'est que « plus cher » ; « déplacé par M » distingué de « bloqué par M » ; point calme strict
  (l'échec se prolonge toujours ; si la ligne reste tactique après la borne : « pas de point calme », **sans Δ**) ; axe 2 :
  **mûr / en préparation / se paie (0,3–1,0) / hors de prix (> 1,0) / bloqué / sans objet** — « injouable » surclamait.
- *Dev chef* (21 constats, 9 corrigés) : `suivre` ignorait **la tour au roque** (un plan « tour vers d8 » réalisé par O-O-O
  sortait bloqué ; test ajouté) ; deux plans de même libellé dans une position **s'écrasaient en silence** dans toutes les
  comparaisons (garde ajoutée) ; une position en échec **avortait toute la nuit** sans TERMINÉ (les lanceurs continuent et
  comptent les échecs) ; coup unique = forcé ; « même pas » rapproché par cases et non par SAN ; gardes et messages. Il a
  aussi confirmé ce qui tenait : perspective des notes cohérente de bout en bout, caches sûrs, troncature à 5 sans effet.
- *Trouvés par les passes elles-mêmes* : le pas ne suivait pas sa pièce quand M la déplaçait ; la légalité du pas était
  testée avec le trait à l'adversaire ; `grep` sans résultat tuait le lanceur sous `pipefail`.

**Résultats (profondeur 18, un fil, mêmes coups M que le § 4 ; annexes U, V, W).**

| | SF 19 | SF 17.1 |
|---|---|---|
| axe 1 : prépare / neutre / nuit / **ferme la fenêtre** | 3 / 18 / 12 / **2** | 6 / 16 / 11 / **2** |
| « limite » (25 < Δ ≤ 50) | 7 | 6 |
| axe 2 : mûr / en préparation / se paie / hors de prix | 7 / 9 / 10 / 9 | 7 / 10 / 7 / 11 |
| lignes prolongées jusqu'au point calme · mesurées en pleine tactique | 12 · 0 | — · 0 |
| Δ même pas renseigné | 32/35 | — |

**Accord des deux moteurs : 21 lignes sur 35 annoncées sur les deux axes, 4 sur l'axe 1 seul, 8 désaccords, 2 contestés.**
Les annoncées : 7 « neutre · en préparation », 5 « nuit · hors de prix », 4 « neutre · mûr », 2 « neutre · se paie »,
**2 « ferme la fenêtre · hors de prix »**, 1 « nuit · se paie ». Les 8 désaccords sont tous des Δ entre −0,7 et +0,6, à
cheval sur le plancher — le tiers de petits écarts sans signe annoncé par la nuit. Les 2 contestés (effets opposés et plus
d'un pion) : e3-e4 à la Carlsbad après h3 (nuit −0,54 contre prépare +1,24) et …d5 au hérisson après …Tab8 (−1,25 contre
+0,98) — à trancher une fois à profondeur 30, et le coach peut dire « contesté entre moteurs ».

**Les lignes qui comptent.**
- **Les deux fenêtres qui se ferment** sont les mêmes sur les deux moteurs : Fd3 puis **…h6** contre Fg5×e7 (Tarrasch
  ouvert), Te1 puis **…h6** contre Fg5 (Française d'échange) — « le pion h6 contrôle g5 (0 → 1 attaquant) ». C'est la
  sortie la plus utile du coach, et elle est mécanique.
- **Dd3 prépare Ce5** sur les deux moteurs (Δ +1,29 / +1,10) ; l'état après diffère d'un dixième autour de la borne de
  1,0 (« se paie » 0,84 contre « hors de prix » 1,10) — annoncé sur l'axe 1 seul. Dd3 prépare aussi d5 (+0,47 / +0,62).
- **Le roque prépare …e5** (Tarrasch fermée, +0,36 sur les deux) — mesuré, pas décrété ; la réponse Ff4 qui vient viser
  e5 est une pièce : « plus cher, pas fermé ».
- **Les 22 « injouables » d'hier soir** sont devenus 10 « se paie » + 9 « hors de prix » (SF 19) : le plan n'est pas mort,
  il n'est pas gratuit — la vérité des positions calmes.

**Ce que l'étape 2 tranche.** Le test réécrit est **stable à réponse constante et lisible** : zéro ligne mesurée en pleine
tactique, 60 % des lignes annonçables par les deux moteurs, les fenêtres qui se ferment identifiées sans règle d'échecs
codée. Ce qu'il ne fait pas, et ne fera pas : départager les plans d'un panel calme à moins de 0,5 du meilleur coup —
8 désaccords sur 35 sont là, et c'est l'argument du faisceau (§ 9). Reste à brancher `threats.mjs` pour le clouage relatif
et le défenseur cloué (constats de l'Expert, différés), et à retester les 2 contestés à profondeur 30.

**Complément : les deux contestés tranchés à profondeur 30 (Expert échecs, SF 19, un fil, retard du pas par recherche
complète sur le pas forcé ; verdict sur la pire des deux meilleures réponses).**
- *Carlsbad, e3-e4 après 11.h3* : **nuit, Δ −1,74** — SF 19 avait le bon signe. Racine : h3 +0,40, e4 −3,28, retard
  3,68. Après h3 …a6 (meilleure réponse) : e4 −4,96 (dxe4 Fxf6 **exf3 !**, l'intermezzo prend le cavalier), retard 5,42,
  Δ −1,74. Mais après h3 **…Fe6** (réponse ex æquo) : e4 −0,74, retard 1,03, **Δ +2,65**. Quatre pions et demi d'écart
  entre deux réponses strictement égales : le « prépare +1,24 » de SF 17.1 n'était pas du bruit de note, c'était l'autre
  réponse. Validation la plus brutale de la règle « pire des deux » — et une règle de forme : **un verdict contesté donne
  toujours les Δ par réponse**, jamais un seul chiffre.
- *Hérisson, …d6-d5 après 15…Tab8* : **prépare, limite, Δ +0,38** — SF 17.1 avait le bon signe. Racine : retard de …d5
  4,19. Après Tab8 Te1 : 1,99 (Δ +2,20) ; après Tab8 h3 (pire) : 3,81 (Δ +0,38, dans la bande ]25 ; 50]). Réserves : tête
  des réponses blanches plate (Te1, h3, De2, Tf1 en 0,11), et la réponse de la passe 18 (De2) n'est plus dans les deux
  premières à 30. L'axe 2 ne change pas d'avis : d5 reste **hors de prix** (3,81). Phrase : « Tab8 rapproche …d5, qui reste
  hors de prix » — le plan vit par sa préparation, pas par sa poussée, comme la vitrine Dd3.
- Anecdote : à la racine du hérisson à profondeur 30, le meilleur coup est **…Cc5** (−0,13) — le coup écarté des plans
  « sans débat ». Il reste conditionnel comme plan ; l'ironie méritait d'être notée.
- Pour la prochaine révision du test : bande « limite » sur l'axe 2 aussi (1,0 ± 0,25, retest à prof. 24), et les Δ par
  réponse affichés pour toute ligne contestée.

## 11. Lecture de clôture (relecture relayée par l'auteur, 18 octobre, 21 h 30)

**Ce que l'étape 2 produit, et qui n'existait pas ce matin** : une phrase de coach à la fois mécanique et utile —
« **Fg5 se joue avant …h6, après c'est fermé** ». Elle sort des deux moteurs à l'identique, sur deux positions différentes,
avec sa raison lisible dans la carte d'attaques (0 → 1 attaquant sur g5), et aucune règle d'échecs n'a été écrite pour
l'obtenir. Premier énoncé falsifiable du projet, tombé juste.

**Une sortie de plus, que le cas Carlsbad impose : « à la merci de la réponse ».** Quatre pions et demi d'écart entre
deux réponses strictement égales à la racine (…a6 et …Fe6) : le sort du plan e4 ne dépend pas du plan mais d'un intermezzo
à dix-sept demi-coups que seul le calcul voit. Le verdict honnête n'est ni « nuit » ni « prépare ». Règle : quand les deux
meilleures réponses donnent des Δ de signe opposé au-delà du plancher, le plan est **instable par nature** — sortie
distincte de « contesté entre moteurs » (désaccord entre juges) : ici c'est un désaccord entre défenses, et pour un élève
la leçon est plus importante : ce plan-là ne se décide pas à la racine.

**« Fenêtre suspendue ».** « Ferme la fenêtre » réservé au pion est juste. Mais O-O Fg5 contre …Ce4 (−7,52, « nuit, hors
de prix ») est un **clouage** : …Ce4 n'existe plus tant que le clouage tient, et il tient jusqu'à …Fe7 ou …h6 — ni fermé,
ni seulement plus cher : *suspendu*, réversible au prix d'un tempo. C'est le constat différé sur `threats.mjs`, à mettre
**avant les autres** : le clouage est la prophylaxie par pièce la plus fréquente, et « fenêtre suspendue » vaut « fenêtre
fermée » comme phrase de coach.

**Le hérisson n'est pas une anecdote.** …Cc5, écarté du panel « sans débat » parce que conditionnel, est le meilleur coup à
profondeur 30 : la première fois que la mesure contredit le livre — exactement ce qu'on attendait d'elle à midi, un
professeur de plus qui peut dire aux autres qu'ils se trompent. Conséquence : **le panel canonique est une hypothèse, pas
une vérité terrain**, et les désaccords entre la grammaire et le livre sont les positions à montrer à Marc en premier.

**La suite, dans l'ordre, et pas plus.** Ne plus polir le test à deux demi-coups : 60 % de lignes annonçables sur un panel
calme est son plafond par construction (§ 9), et les 8 désaccords restants sont des désaccords de réseau sur des lignes
identiques que personne ne tranchera à un pas. Deux retouches seulement : le clouage dans `threats.mjs` (change le
vocabulaire) et la bande « limite » sur l'axe 2 (cosmétique) — après quoi **l'instrument est fini**. Puis les deux étapes
qui mesurent autre chose : le **panel avec menaces** (la clause « forcé » n'a toujours rien eu à trancher ; une heure de
moteur), puis le **faisceau**, seul endroit où les plans longs sortent du bruit. Exigence posée avant d'en écrire une
ligne : **ses sorties sont exactement le vocabulaire stabilisé aujourd'hui** — les deux axes, fenêtre fermée ou suspendue,
plan frère, contesté entre moteurs, à la merci de la réponse — avec le prix et le tempo en plus. Ce vocabulaire est devenu,
sans qu'on l'ait cherché, la grammaire des phrases du coach ; c'était la question du matin.
