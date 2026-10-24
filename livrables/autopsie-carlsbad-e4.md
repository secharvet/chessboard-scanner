# Autopsie de la division Carlsbad e4 — relecture d'échecs de l'Expert

Date : 19 octobre 2026. Objet : la division « continuer / adopter » du plan rupture e→e4 (position carlsbad du panel,
Blancs au trait après 10…Cf8), re-passe `orion-v4-coupe` du 19 octobre (hash vidé, SF 19, prof. 18, un fil), demandée
par le pilote après le drapeau « Dc2→d3 en cours 4,73 » de la veille.

Méthode : lecture des rapports `orion-v4-coupe` et `orion-v4-sans-coupe` (faisceau-carlsbad.md + JSON), puis treize
sondes moteur ciblées sur les nœuds litigieux — Stockfish 19 sur Orion (deneb, `~/bin/stockfish` via SSH), un fil,
table vidée avant chaque recherche, profondeur 18 (la profondeur de la mesure). Fichiers de test dans le scratchpad
de ma session (`tests-autopsie-carlsbad-e4.mjs`, `tests-autopsie-coupes.mjs`). Scores du point de vue du camp au trait.

## Verdict d'ensemble

**La division est juste sur l'échiquier, et le drapeau d'hier est clos.** La lecture « e4 se paie à la poussée, puis
la PDI se joue au prix normal, et d5 est le plan dans la PDI » tient. Le −4,3 de la veille venait bien de la référence
prise à la racine (biais documenté) et du prix du transfert mesuré à travers une case d3 empoisonnée ; avec les
correctifs (lignes stockées, référence depuis la bascule), le même objet mesure +0,54 — un chiffre sain, et la
vraie histoire d'échecs apparaît.

## Question 1 — « e4 coûte à la poussée, la PDI se joue gratis, d5 est le plan » : oui

- **Au nœud de la poussée** (après h3 a5 Tad1 Ch5′ Fxe7 Txe7′) : meilleur coup a3 +0,49, e4 forcé +0,30 — e4 concède
  0,19 à prof. 18 table vide. La dernière chance l'avait chiffré 0,65 à prof. 14 : même signe, même décision (≤ 1,0,
  on joue) ; le chiffre affiché est le plus prudent des deux. Le prix au calme +0,68 (référence faisceau libre) est sur
  l'échelle enveloppe — plus haut, comme attendu, et comparable seulement aux autres prix du faisceau (F1).
- **À la bascule** (après dxe4) : Fxe4 est le meilleur coup du moteur (−0,01 en MultiPV, +0,25 en recherche forcée —
  écart de parité pair/impair, normal). « Continuer : −0,03 depuis la bascule » est cohérent : la rupture est réalisée,
  il ne reste rien à payer.
- **Dans la PDI** (après Fxe4 Cf4′) : d5 forcé +0,23 contre meilleur coup Dd2 +0,20 — d5 est ex æquo au bruit près.
  « Adopter rupture d→d5 : c'est le plan +0,11 » est conforme à l'échiquier.
- **Le transfert Dc2→d3 à +0,54, tempo 24** est la vraie trouvaille : le cavalier f4 couvre d3, donc la batterie ne
  peut pas se jouer en direct — la ligne retenue fait le détour Dc1–e3 puis ne pose Dd3 qu'au 24e demi-coup. Ma table
  dit « batterie avant la rupture d5 » pour le camp PDI ; ici la mesure inverse l'ordre pour une raison de position
  (Cf4 empoisonne d3). Ce n'est pas une correction de la table, c'est un cas d'école à montrer (dossier Marc) : la
  règle générale et son exception motivée.

## Question 2 — les concessions à +8,40 / +7,98 : inoffensives, et mal racontées

Ce ne sont **pas** des « tactiques laissées par une réponse ouverte ». Vérifié sur pièce :

- après Fxe4 Cf4′ Tfe1 Dc7′ **Te3 Fe6′** : meilleur coup g3 **+0,28** — aucune tactique à +8 n'existe. En revanche le
  seul progressant direct du transfert, **Dd3??, vaut −8,04** (Cxd3 gagne la dame) → concession 8,32 ≈ le 8,40 enregistré
  (décision à 14).
- après **Db1 h6′** : meilleur coup d5 **+0,27**, **Dd3?? −7,72** (Cxd3 encore) → 7,99 ≈ le 7,98 enregistré.

Le chiffre est donc le prix du propre coup du plan, pas une bévue adverse ; la branche est coupée, pas tarifée : rien
ne fuit dans les prix. Et les marques ′ sont saines : Fe6 est réellement ex æquo (voire meilleur) partout où je l'ai
contrôlé — pas de trou dans le crible des réponses ouvertes, donc pas de risque pour le tirage de l'adversaire dans
les parties.

**Recommandation (affichage seulement)** : stocker dans `coupesListe` le SAN du progressant refusé —
« concession 8,40 (Dd3??) ». Le coup est connu au moment de la coupe, ça ne coûte rien, et ça évite au lecteur (GE
compris) la mélecture « l'adversaire a laissé une tactique ». La coupe raconte alors la bonne histoire d'échecs :
« le plan ne peut plus avancer qu'en donnant la dame ».

## Question 3 — les coupes du faisceau principal (6,09 et 1,75) : même mécanique, confirmée

- **6,09 après h3 Fe6′ a3 C6d7′** : après …C6d7, le fou g5 est en prise (…Fxg5 menace) ; les parades Ff4 +0,46 /
  Fxe7 +0,43 sont les meilleurs coups, et **e4?? vaut −5,73** (e4 ignore la menace, Fxg5 suit) → écart 6,19 ≈ 6,09.
  Au passage, c'est une illustration parfaite du « forcé d'abord » du GE : le nœud exigeait une parade, le progressant
  qui passe outre coûte une pièce.
- **1,75 après h3 a5 Ce5 Fe6′** : meilleur coup Tae1 +0,58, **e4 prématuré vaut −2,06** (dxe4 et le complexe d4/Ce5
  se défait) → écart 2,64 à prof. 18 ; le 1,75 enregistré vient de la recherche de dernière chance à prof. 14 — même
  décision (> 1,0, on coupe), chiffre moins creusé.

Dans les deux cas la coupe dit juste : « ici, pousser e4 est une faute, le plan attend ». La recommandation du SAN
dans la liste des coupes vaut aussi pour celles-ci.

## Notes de mesure (sans conséquence sur les verdicts)

1. Les concessions des coups « dernière chance » sont décidées et enregistrées à prof. 14, imprimées à côté de prix
   mesurés à 18 (0,65 vs 0,19 ici ; 1,75 vs 2,64). Les décisions sont les mêmes ; si on veut des colonnes homogènes,
   re-mesurer la concession affichée à 18 comme on le fait déjà pour le retard.
2. Écart de parité MultiPV parent / recherche forcée enfant (Fxe4 : −0,01 vs +0,25) : connu, sous le plancher de peu ;
   la référence faisceau libre aux mêmes demi-coups l'annule dans les prix (F1).
3. `orion-v4-coupe` et `orion-v4-sans-coupe` donnent des chiffres identiques sur cette position (mêmes prix, mêmes
   deux coupes, même division 0,54/0,11) : la coupe cumulée n'a rien changé au résultat, elle n'économise que du
   calcul — c'est exactement ce qu'on voulait d'un garde-fou.

## Ce qui reste

Rien sur cette position : drapeau clos, division endossée. La recommandation « SAN du progressant refusé » est à la
main du pilote, après le lot (pas de retouche pendant les parties).
