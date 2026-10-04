#!/bin/bash
# Après-midi du 4 octobre 2026 (les deux machines à pleine puissance, accord de l'auteur) : étiquettes v4 avec les règles
# du 4 octobre, jugement des plans qui ont bougé réparti (2016 sur DENEB, 2013 sur le VPS), échange des jugements,
# jeu + modèles v7 sur DENEB, troisième série de planches et verdicts de Fable sur le VPS. Journal : reports/chaine-jour-v7.log.
set -u
cd "$(dirname "$0")/.."
R='~/dev/chessboard/chessboard-scanner'
log() { echo "[$(TZ=Europe/Paris date +%H:%M)] $*"; }
log "ÉTAPE 1 : recalcul des étiquettes v4 (24 morceaux, DENEB 4/5, VPS 1/5)"
mkdir -p reports/rescan-v4
scripts/repartir.sh --cmd 'node scripts/rescan-labels.mjs {in} --out {out}' --out-dir reports/rescan-v4 --suffix .v4.jsonl --max 150 data/labels/chunks/*.jsonl 2>&1 | tail -3 || { log "ÉCHEC : recalcul"; echo TERMINÉ; exit 1; }
log "ÉTAPE 2 : recollage v4 sur les deux machines"
V=v4 scripts/recoller.sh 2>&1 | tail -14 || { log "ÉCHEC : recollage"; echo TERMINÉ; exit 1; }
log "ÉTAPE 3 : jugement moteur des plans qui ont bougé : 2016 sur DENEB (14 fils), 2013 sur le VPS (4 fils)"
ssh -n deneb "cd $R; setsid nohup node scripts/juge-plans.mjs data/labels/human-2016-01f.s{0,1,2,3}.v4.jsonl --workers 14 --depth 12 > reports/juge-v4-deneb.log 2>&1 < /dev/null & sleep 0.3; echo lancé"
node scripts/juge-plans.mjs data/labels/human-2013-01.s{0,1,2,3}.v4.jsonl --workers 4 --depth 12 > reports/juge-v4-vps.log 2>&1
log "jugement 2013 fini sur le VPS ; attente de DENEB"
for i in $(seq 1 300); do ssh -n deneb "grep -q '^Terminé' $R/reports/juge-v4-deneb.log 2>/dev/null" && break; sleep 60; done
ssh -n deneb "grep -q '^Terminé' $R/reports/juge-v4-deneb.log" || { log "ÉCHEC : jugement DENEB non terminé"; echo TERMINÉ; exit 1; }
log "ÉTAPE 4 : échange des jugements (2013 → DENEB, 2016 → VPS)"
rsync -a data/labels/human-2013-01.s{0,1,2,3}.juge.jsonl deneb:dev/chessboard/chessboard-scanner/data/labels/
rsync -a deneb:dev/chessboard/chessboard-scanner/data/labels/human-2016-01f.s{0,1,2,3}.juge.jsonl data/labels/
log "ÉTAPE 5 : jeu et modèles v7 sur DENEB ; en parallèle, troisième série de planches et Fable sur le VPS"
ssh -n deneb "cd $R; setsid nohup bash -c 'node scripts/build-dataset.mjs data/labels/human-2013-01.s{0,1,2,3}.v4.jsonl data/labels/human-2016-01f.s{0,1,2,3}.v4.jsonl --juge --out data/datasets/humains-v7-juge.jsonl 2>&1 | tail -10; ~/plans-venv/bin/python scripts/train-plans.py data/datasets/humains-v7-juge.jsonl --suffix=-v7 --epochs 10 --bootstrap 200 --out reports/train-plans-v7-juge.json 2>&1 | grep -v Warning | tail -30; ~/plans-venv/bin/python scripts/prediction-courbe.py --dataset data/datasets/humains-v7-juge.jsonl --suffix=-v7 --out reports/prediction-courbe-v7.json --md reports/prediction-courbe-v7.md 2>&1 | tail -3; node scripts/inventaire-coups.mjs data/labels/human-2016-01f.s0.v4.jsonl --out reports/inventaire-2016-s0-v4.json 2>&1 | tail -1; node scripts/inventaire-coups.mjs --merge reports/inventaire-2016-s0-v4.json --md reports/inventaire-coups-7.md 2>&1 | tail -1; echo TERMINÉ' > reports/pipeline-v7.log 2>&1 < /dev/null & sleep 0.3; echo lancé"
rm -f reports/verite-terrain-3-cle.json
node scripts/verite-terrain.mjs data/labels/human-2016-01f.s1.v4.jsonl --per 5 --seed 3 --out reports/verite-terrain-3.json 2>&1 | tail -9
S=/tmp/claude-1000/-home-ubuntu-ruche/d5c15aa3-2d27-4c63-97f7-1047dd23cc38/scratchpad
node scripts/verite-terrain-page.mjs --in reports/verite-terrain-3.json --cle reports/verite-terrain-3-cle.json --collection verdicts3 --serie "série 3" --out $S/verite-terrain-3.html | tail -1
mkdir -p $S/planches3
ids=$(python3 -c "import json; print(' '.join(sorted(json.load(open('reports/verite-terrain-3-cle.json')).keys())))")
node scripts/planches-captures.mjs $S/verite-terrain-3.html $S/planches3 $ids 2>&1 | tail -1
node scripts/planches-fable.mjs $S/planches3 reports/verite-terrain-3-cle.json reports/verite-terrain-3.json reports/fable-planches-serie3.json $ids > reports/fable-planches-serie3.log 2>&1
node scripts/planches-fable-bilan.mjs reports/fable-planches-serie3.json reports/fable-planches-serie3.md | head -12
log "série 3 : planches et verdicts de Fable prêts"
echo TERMINÉ
