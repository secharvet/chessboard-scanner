#!/bin/bash
# Chaîne v6 sur DENEB (2 octobre 2026, carte blanche de l'auteur) : à lancer quand les 24 morceaux recalculés
# (`.v3.jsonl`, règles du 2 octobre) sont recollés dans data/labels. Étapes, chacune marquée dans le journal :
#   1. jugement moteur des plans ajoutés ou déplacés (juge-plans, reprise par plan, 14 fils) ;
#   2. jeu de données v6 « réalisé et bien joué » (plans périmés rejugés inclus) ;
#   3. modèles v6 (8 concepts dont tour_colonne_semi_ouverte) ;
#   4. courbes de prédiction v5 et v6 sur le jeu v6 ;
#   5. inventaire de couverture des coups calmes avec les règles du 2 octobre (parties de test du lot 2016 s0).
#   setsid nohup bash scripts/pipeline-v6.sh > reports/pipeline-v6.log 2>&1 < /dev/null &
set -u
cd "$(dirname "$0")/.."
PY=~/plans-venv/bin/python
LABELS=(data/labels/human-2013-01.s{0,1,2,3} data/labels/human-2016-01f.s{0,1,2,3})
for b in "${LABELS[@]}"; do [ -s "$b.v3.jsonl" ] || { echo "ÉCHEC : $b.v3.jsonl absent"; echo TERMINÉ; exit 1; }; done
echo "[$(date +%H:%M)] ÉTAPE 1 : jugement moteur des plans recalculés"
node scripts/juge-plans.mjs "${LABELS[@]/%/.v3.jsonl}" --depth 12 2>&1 | tail -12
echo "[$(date +%H:%M)] ÉTAPE 1 TERMINÉE"
echo "[$(date +%H:%M)] ÉTAPE 2 : jeu de données v6"
node scripts/build-dataset.mjs "${LABELS[@]/%/.v3.jsonl}" --juge --out data/datasets/humains-v6-juge.jsonl 2>&1 | tail -6
wc -l data/datasets/humains-v6-juge.jsonl
echo "[$(date +%H:%M)] ÉTAPE 2 TERMINÉE"
echo "[$(date +%H:%M)] ÉTAPE 3 : modèles v6"
$PY scripts/train-plans.py data/datasets/humains-v6-juge.jsonl --suffix=-v6 --epochs 10 --bootstrap 200 --out reports/train-plans-v6-juge.json 2>&1 | grep -v Warning | tail -40
echo "[$(date +%H:%M)] ÉTAPE 3 TERMINÉE"
echo "[$(date +%H:%M)] ÉTAPE 4 : courbes v5 et v6 sur le jeu v6"
$PY scripts/prediction-courbe.py --dataset data/datasets/humains-v6-juge.jsonl --suffix=-v5 --out reports/prediction-courbe-v5-sur-v6.json --md reports/prediction-courbe-v5-sur-v6.md 2>&1 | grep "^\[courbe\]" | tail -3
$PY scripts/prediction-courbe.py --dataset data/datasets/humains-v6-juge.jsonl --suffix=-v6 --out reports/prediction-courbe-v6.json --md reports/prediction-courbe-v6.md 2>&1 | grep "^\[courbe\]" | tail -3
echo "[$(date +%H:%M)] ÉTAPE 4 TERMINÉE"
echo "[$(date +%H:%M)] ÉTAPE 5 : inventaire de couverture (règles du 2 octobre)"
node scripts/inventaire-coups.mjs data/labels/human-2016-01f.s0.v3.jsonl --out reports/inventaire-2016-s0-v3.json 2>&1 | tail -2
node scripts/inventaire-coups.mjs --merge reports/inventaire-2016-s0-v3.json --md reports/inventaire-coups-6.md 2>&1 | tail -2
echo "[$(date +%H:%M)] ÉTAPE 5 TERMINÉE"
echo TERMINÉ
