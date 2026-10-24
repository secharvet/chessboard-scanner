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

## 25 octobre 2026, soir
- V0 en ligne (coach-grounded a8def8e puis 7c1825c) : `partie.html?partie=2026-10-24-maia-w-01` et `…-b-02`. Le conteneur
  web a dû être redémarré (nginx.conf remplacé par git, l'ancien inode restait monté).
- Première traque de l'Expert (w-01) : 20 fidèles sur 25, cinq infidèles toutes sur le compte du matériel → trois règles
  de parole (référence du gain = l'échiquier avec l'exception de la reprise ; matériel nommé par sa composition ; E0 = score
  de M quand la quiescence aberre). Seconde traque (w-01 + b-02) : 72 fidèles sur 86 (84 %), six causes (pièce nommée,
  coup qui attaque, terme sans rapport, motif, gain fictif, « seul coup ») → toutes corrigées, mêmes coups.
- Contre Stockfish bridé 1500 : 0-1 (2 bévues / 50). Contre Stockfish 19 pleine force (profondeur 12) : 0-1 (4 bévues / 72).
- Les structures n'étaient pas lues (jeton `id: 'STRUCTURE'`, `params`) : corrigé ; démonstration Carlsbad contre Stockfish
  1500 : « Je prends un plan : rupture b→b5 », trois phrases de plan ; partie perdue. Étiquetée hors critère.
- Sébastien : « enrichir le répertoire plutôt que contraindre le joueur ». Expert : grammaire enrichie, sept structures
  (pion passé, roi au centre, majorité, une colonne ouverte, finale, Rubinstein, centre ouvert) avec règles de reconnaissance
  et plans canoniques ; branchée dans `coach/joueur/structures-etendues.mjs` (70c1c63). Le livre (5.Cxf6+) corrigé dans la base.
- Restent : la série de 100 parties contre Maia-1500 (Dev chef, script de série), la lecture humaine des 20 coups (mode
  « lecture » de la page), le rapport final au GE.

## 26 octobre 2026, nuit
- Troisième relecture de l'Expert (récits 7e2a0fc) : 40 fidèles sur 48 ; sa règle ROI_AU_CENTRE était fausse (colonne sans pion
  adverse → colonne sans pion À MOI). Série de 100 arrêtée après 4 parties (archivées hors critère), corrigée, **relancée de
  zéro sur le commit figé 4d5e252** à 21 h 26 Paris, fin estimée ~0 h 45. Le code du coach ne bouge plus pendant la série.
- **À faire après la série (parole seulement, aucun coup ne change)** : la menace retenue doit être, parmi les candidats
  exacts du coup nul, celui dont la ligne gagne le plus de matériel compté (ou mate), pas le meilleur coup adverse à ses yeux
  (cas 16.Fb5+ : …Ce7 −5,87 retenu, …Txg2+ −6,04 ignoré alors qu'il gagne g2 avec échec).
