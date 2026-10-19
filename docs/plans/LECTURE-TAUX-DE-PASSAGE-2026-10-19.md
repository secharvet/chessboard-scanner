# Lecture d'échecs de la matrice des taux de passage — Expert

Date : 19 octobre 2026. Objet : `docs/plans/TAUX-DE-PASSAGE-2026-10-19.md` (6 tirages, prof. 17/18/19 × table
vidée/gardée, même code, un fil, SF 19) — critère passé dans 2 tirages sur 6. Demande du pilote : lecture des trois
positions à échec répété. Sondes neuves : Stockfish 19 sur Orion (deneb), un fil, table vide, **prof. 30**, scores du
point de vue du camp au trait (fichiers `tests-herisson-p30.mjs`, `tests-frechange-p30.mjs` dans mon scratchpad).

## 1. Espagnole d'échange, 0/6 — j'endosse : arbitrage confirmé, pas une victime du bruit

Direction constante dans les six tirages (e5 de +0,87 à +4,66 ou irréalisable ; Cb1→d5 et Fc1×Ff8 autour de zéro),
conforme à mon arbitrage prof. 30 d'hier (Cd5 −0,39 contre e5 +0,20). Et le « attendu » du panel l'avait écrit AVANT
la mesure : « f4 immédiat vaut −0,65 (…Fd6 ! cloue le pion) et le meilleur coup est Ff4 — l'échange des fous de cases
noires débloque la rupture ». Formulation que je propose pour le GE : le livre n'a pas tort sur la boussole (faire
valoir la majorité f4+e5, c'est tout l'intérêt de la position blanche), la désignation canonique a retenu **la
destination sans la route** (Fxf8 d'abord, Cd5 ensuite, la rupture quand elle est payable). Pas un cas de bruit : un
cas de désignation.

## 2. Hérisson, 2/6 — ni « le livre a tort » ni « l'horizon est aveugle » : la désignation était trop étroite

Sonde prof. 30 à la racine (Noirs après 15.Tac1) :

| coup | éval (Noirs) | lecture |
|---|---|---|
| **…Tac8** | **−0,10 — meilleur coup du moteur** | le progressant de la colonne c est littéralement le premier coup de l'échiquier |
| …Tab8, …Tad8, …h6 | −0,18 à −0,20 | tout le peloton prépare |
| …b5 immédiat | **−2,70** | la rupture non préparée coûte 2,6 pions (cxb5 et c'est fini) |
| …d5 immédiat | **−3,98** | pire encore (cxd5 exd5 Cxd5) |

Le livre lui-même dit « les deux ruptures …b5 et …d5, **préparées longtemps** ; …Tc8 est le préparatif classique » —
c'est le texte du `attendu` du panel. L'horizon voit donc juste : dans les tirages où le faisceau prépare bien, b5
descend à +0,03/+0,18/+0,30 (le plan mûrit) ; où il force tôt, +1,23/+1,36 (le prix de l'impréparation). Et la
colonne c est stable à ~0,00 dans les six tirages — c'est le premier chapitre de tout cours sur le hérisson. La seule
erreur est à nous : le canon n'a gardé que les deux ruptures. **La colonne c doit entrer au canon du hérisson** —
c'était mon point de veille du premier jour (« veille hérisson colonne c vs …b5 »), pas une rustine d'après-matrice.
Pédagogie en prime : le hérisson est LA structure où enseigner « prépare avant de pousser », et le moteur chiffre la
punition de la poussée crue à 2,6-4 pions.

## 3. Échange française, 2/6 — le canon disait c4 seul, et je l'avais annoncé comme le cas-test

Sonde prof. 30 à la racine (Blancs après 6…O-O) : **Fg5 est le meilleur coup du moteur** (+0,12 ; +0,10 en recherche
forcée) ; c4 immédiat vaut −0,13, soit 0,25 de concession — le bas de la fourchette de la matrice (+0,20 à +0,89) et
pile mon « limite +0,28 » de la passe à 18. Le livre joue d'ailleurs Fg5 lui-même au 7e coup (mon départ lot 2
`l2-fr-echange`). Histoire d'échecs : dans la structure symétrique, Fg5 et la colonne e sont quasi gratuits parce que
symétriques ; c4 est **le seul plan qui demande quelque chose** (créer le déséquilibre), et son prix de 0,2-0,9 est
le droit d'entrée pour jouer le gain, pas une réfutation. Verdict : désignation trop étroite (c4 seul — je l'avais
choisi sciemment comme cas probable de la clause contre le livre, et annoncé cet échec). Fg5 entre au canon ; c4 y
reste avec sa vraie étiquette, « viable mais ça coûte un peu ».

## 4. Lecture d'ensemble de la matrice (pour le § 6)

1. **L'ordre des plans est bien plus stable que les prix.** Le plan le moins cher est le même dans les six tirages
   sur l'essentiel du panel (hérisson colonne c 6/6, espagnole Cd5/Fxf8 6/6 devant les ruptures, échange française
   Fg5 ~6/6, iqp Dd3 6/6, KID c5 ~6/6…) ; quand il change, c'est entre ex æquo à moins du plancher. La vraie
   exception est le Tarrasch fermé, qui churne réellement (colonne c / Ce4 / e5 selon le tirage). C'est le résultat
   d'hier — « le plan est plus stable que le coup » — un étage au-dessus : la PHRASE est plus stable que le PRIX.
2. **Le bruit vit dans les plans longs.** Les 8/35 plans à phrase stable sont tous courts et bon marché ; les
   ruptures longues portent toute l'étendue (+1,33 à +6,47), parce que leur prix dépend du chemin de réalisation que
   la profondeur et la table font bifurquer. Cohérent avec « un plan se paie à sa réalisation ».
3. **Les trois échecs répétés sont tous le même défaut — désignation trop étroite — et chaque correction est
   justifiée INDÉPENDAMMENT de la matrice** : les `attendus` du panel (écrits avant), ma veille du premier jour
   (colonne c hérisson), mon annonce du cas fr-échange, mes arbitrages prof. 30 (espagnole hier, les deux sondes
   ci-dessus aujourd'hui). Si Sébastien ouvre les désignations, il faut le dire au GE dans cet ordre-là — on précise
   le canon sur pièces justificatives antérieures, on ne le retaille pas pour faire passer le critère — puis relancer
   `taux-de-passage.mjs` avec les précisions (le recomptage est mécanique, il appartient au script ; j'ai tenté une
   reproduction depuis le tableau et je ne retombe pas sur la règle par case officielle, donc je ne publie pas de
   chiffre maison). Mon attente d'échecs : espagnole, hérisson et échange française passent alors presque partout, et
   l'instabilité résiduelle se concentre sur le Tarrasch fermé et les cases « aucun canonique » (réalisation des
   longs), qui sont un autre problème que les désignations.

## 5. Addendum (même jour) — repoussoirs hors livre pour les positions devenues inéligibles

Le recomptage du pilote (sans toucher au canon, décision de Sébastien) montre un effet que je n'avais pas anticipé et
que je reconnais : préciser une désignation ne fait pas passer la position, **elle la retire du compte** — une fois
tous les plans bon marché au canon, le critère n'a plus de contraste. Pour que l'Espagnole et le hérisson restent
éligibles, il leur faut un plan hors livre plausible — un repoussoir honnête qu'un joueur de club tenterait. Candidats
sondés (SF 19 sur Orion, un fil, table vide, prof. 24, premier coup du plan — le faisceau tarifera le plan entier) :

**Espagnole d'échange (Blancs)** — meilleur coup Ff4 +0,02 :
- **transfert Rg1→e3 (la marche du roi)** : Rf2 vaut −0,08 (0,10 de concession). C'est LE réflexe de club en finale
  sans dames (« le roi au centre ») et le livre ne le nomme pas ; honnête, jouable, et pédagogiquement riche (le bon
  instinct, la question est le moment). À condition que la famille transfert accepte le roi ; sinon :
- **transfert Fc1→e3** : +0,01, ex æquo du meilleur — le « bon développement générique », l'hypothèse nulle idéale
  (le critère teste alors : les plans du livre ne sont pas battus par du développement quelconque).
- **poussée a2→a4** en option : −0,06, fixer a6, plausible.
- **REJETÉ : colonne d** (mon premier réflexe) : Td1 est déjà sur la colonne (plan quasi réalisé d'office, sans
  contraste) et le doublement naïf Td2 vaut **−1,11** (…Fd6 !) — un épouvantail, pas un repoussoir.

**Hérisson (Noirs)** — meilleur coup …Tac8 −0,16 :
- **transfert Cd7→e5 (le cavalier au poste de rêve)** : −0,17, **ex æquo du meilleur coup**. Exactement ce qu'un
  joueur de club joue « parce qu'un cavalier en e5 c'est beau ». Repoussoir exigeant : s'il fait jeu égal avec la
  colonne c dans un tirage, la clause d'égalité (≤ 25 cp = réussite) couvre ; s'il la bat franchement quelque part,
  le critère échoue honnêtement — c'est son travail.
- **poussée h7→h5** en second : −0,28 (0,12 de concession), le geste d'aile paresseux, jouable sans être bon marché.

Mise en garde d'ordre : ces ajouts sont des instruments du critère (des contrastes), pas des plans à enseigner — ils
ne doivent PAS entrer dans les livres ni dans la table des structures. Et l'ordre des événements doit rester visible
pour le GE : inéligibilité constatée d'abord, repoussoirs proposés ensuite, sondés avant d'être inscrits.

## Ce qui reste

Décision d'ouvrir ou non les désignations : Sébastien. Recomptage avec précisions : le script du dev-lead. Tarrasch
fermé : la seule position que je qualifierais d'instable en soi — candidate à un arbitrage prof. 30 dédié si elle
reste le point dur après recomptage.
