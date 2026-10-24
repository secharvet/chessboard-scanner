# Coach joueur : journal de la dernière reprise

Heures de Paris. Une entrée par étape franchie ; les chiffres sont ceux des fichiers de parties ou des journaux d'essai.

## 24 octobre 2026, soir
- Lignes du GE reçues, carte blanche de Sébastien jusqu'à la V0, règle « thèse, antithèse, synthèse » (3 tours au plus),
  silence jusqu'à la V0. Thèse écrite (`CHANTIERS-2026-10-24.md` v1), antithèse de l'Expert (branche expert-echecs,
  `livrables/antithese-coach-joueur.md`), synthèse v2 confirmée au troisième tour.
- Échiquier 0x88 (`coach/joueur/echiquier.mjs`), perft exact sur les six positions de référence, 1,36 M positions/s.
- Poids de SF 11 classique relus dans la source publique et consignés (`SF11-CLASSIQUE.md`).

## 25 octobre 2026, nuit
- Évaluation à termes nommés (`evaluation.mjs`, ~90 000 positions/s), recherche alpha-bêta à budget fixe avec candidats
  exacts et menace par coup nul (`recherche.mjs`), décision livre / plan / menace et trace (`joueur.mjs`), parole par les
  gabarits de l'Expert (`parole.mjs`, `gabarits-parole.json`).
- Dev chef (branche joueur-dev) : arène `scripts/joueur/partie.mjs`, examinateur `scripts/joueur/examiner.mjs`, lecteur
  `partie.html`, `scripts/joueur/rejouer-v0.sh`, vérification Chromium à 1440 et 390 px.
- **Première partie réelle** (coach Blancs contre Maia-1500, graine 1, budget 400 000) : **1-0, mat en 49 demi-coups,
  0 bévue sur 25 coups à l'examen (SF 19, profondeur 18), 3 fautes, 3,4 s par coup, 100 % des coups avec une phrase.**
- Quatre parties du coach contre lui-même (budget 60 000, ~80 s chacune) pour relire les phrases. Défauts corrigés :
  une prise ou un échec n'est jamais « un coup d'attente » ; la reprise, l'échange, l'échec paré ou donné, la pièce
  sauvée sont dits ; le point de comparaison E0 est l'évaluation posée par la quiescence (le gain se lit contre
  l'échiquier tel qu'il est) ; « perdu » exige une position vraiment mauvaise ; la pièce nommée est celle dont le terme a
  bougé ; sans terme simple, le coach dit « je suis mieux qu'avec les autres coups, sans qu'une seule raison le résume ».
  Sept gabarits mécaniques ajoutés par le pilote (section `pilote` du JSON), à valider par l'Expert à la traque.
- Limite vue et laissée telle quelle : à faible budget (profondeur 4), le coach refuse parfois le coup du livre de la
  Française (4…Fe7) parce qu'il croit voir mieux ; c'est sa règle (perte > 50 à ses yeux), dite dans la phrase.

## À faire avant de prévenir Sébastien (V0)
- Rejouer la V0 sur le coach corrigé (Dev chef), examen, lecture des alertes.
- Traque de l'Expert sur cette partie (phrases infidèles).
- Fusion joueur-dev → dev-lead, Dockerfile (partie.html / .css / .js), déploiement (coach-grounded), `parties/` servi.
