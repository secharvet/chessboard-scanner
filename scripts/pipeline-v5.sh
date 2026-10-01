#!/bin/bash
# Chaîne v5 sur DENEB (1er octobre 2026) : attend la fin du recalcul des étiquettes (marques TERMINÉ), construit le
# jeu de données « réalisé et bien joué » sur les étiquettes corrigées, entraîne les modèles v5, puis trace la courbe
# de prédiction pour v4 et v5 sur les mêmes parties de test. Chaque étape écrit une marque dans le journal.
#   setsid nohup bash scripts/pipeline-v5.sh > reports/pipeline-v5.log 2>&1 < /dev/null &
set -u
cd "$(dirname "$0")/.."
PY=~/plans-venv/bin/python
LABELS=(data/labels/human-2013-01.s{0,1,2,3} data/labels/human-2016-01f.s{0,1,2,3})
echo "[$(date +%H:%M)] attente du recalcul des étiquettes"
for i in $(seq 1 240); do
  done_n=0
  for b in "${LABELS[@]}"; do grep -q TERMINÉ "$b.rescan.log" 2>/dev/null && done_n=$((done_n + 1)); done
  [ "$done_n" -eq 8 ] && break
  sleep 60
done
[ "$done_n" -eq 8 ] || { echo "ÉCHEC : recalcul non terminé après 4 h"; echo TERMINÉ; exit 1; }
echo "[$(date +%H:%M)] ÉTAPE 1 TERMINÉE : étiquettes recalculées"
echo "[$(date +%H:%M)] construction du jeu de données v5"
node scripts/build-dataset.mjs "${LABELS[@]/%/.v2.jsonl}" --juge --out data/datasets/humains-v5-juge.jsonl 2>&1 | tail -5
wc -l data/datasets/humains-v5-juge.jsonl
echo "[$(date +%H:%M)] ÉTAPE 2 TERMINÉE : jeu de données"
echo "[$(date +%H:%M)] entraînement v5"
$PY scripts/train-plans.py data/datasets/humains-v5-juge.jsonl --suffix=-v5 --epochs 10 --bootstrap 200 --out reports/train-plans-v5-juge.json 2>&1 | grep -v Warning | tail -40
echo "[$(date +%H:%M)] ÉTAPE 3 TERMINÉE : modèles v5"
echo "[$(date +%H:%M)] courbes de prédiction v4 et v5 sur le jeu v5"
$PY scripts/prediction-courbe.py --dataset data/datasets/humains-v5-juge.jsonl --suffix=-v4 --out reports/prediction-courbe-v4-sur-v5.json --md reports/prediction-courbe-v4-sur-v5.md 2>&1 | grep "^\[courbe\]" | tail -2
$PY scripts/prediction-courbe.py --dataset data/datasets/humains-v5-juge.jsonl --suffix=-v5 --out reports/prediction-courbe-v5.json --md reports/prediction-courbe-v5.md 2>&1 | grep "^\[courbe\]" | tail -2
echo "[$(date +%H:%M)] ÉTAPE 4 TERMINÉE : courbes"
echo TERMINÉ
