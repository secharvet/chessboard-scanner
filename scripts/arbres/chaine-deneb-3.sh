#!/bin/bash
# Passe 3 : phase durcie (≥ 20 points par camp, fin ≤ 70e demi-coup), échecs répétés écartés (> 2 par camp), 200 arbres ; plus l'échelle 40.
cd ~/dev/chessboard/chessboard-scanner; source ~/plans-venv/bin/activate; export OMP_NUM_THREADS=4
mkdir -p data/arbres3 data/arbres40
nice -n 19 python3 scripts/arbres/dataset.py 'data/grains/elite-*.jsonl' --out data/arbres3/windows --max-end 70 --min-material 20 --max-checks 2 > logs/arbres3-dataset.log 2>&1
nice -n 19 python3 scripts/arbres/train.py data/arbres3/windows --out data/arbres3/model --epochs 4 --batch 512 --dim 128 --layers 4 > logs/arbres3-train.log 2>&1
nice -n 19 python3 scripts/arbres/train.py data/arbres3/windows --out data/arbres3/temoin --epochs 4 --batch 512 --dim 128 --layers 4 --control > logs/arbres3-temoin.log 2>&1
nice -n 19 python3 scripts/arbres/index.py data/arbres3/windows data/arbres3/model --out data/arbres3/arbres --k 2000 --k2 200 --min-games 300 --grains 'data/grains/elite-*.jsonl' > logs/arbres3-index.log 2>&1
nice -n 19 python3 scripts/arbres/dataset.py 'data/grains/elite-*.jsonl' --out data/arbres40/windows --window 40 --stride 4 --max-end 80 --min-material 20 --max-checks 3 > logs/arbres40-dataset.log 2>&1
nice -n 19 python3 scripts/arbres/train.py data/arbres40/windows --out data/arbres40/model --epochs 3 --batch 256 --dim 128 --layers 4 > logs/arbres40-train.log 2>&1
nice -n 19 python3 scripts/arbres/index.py data/arbres40/windows data/arbres40/model --out data/arbres40/arbres --k 1500 --k2 150 --min-games 300 --grains 'data/grains/elite-*.jsonl' > logs/arbres40-index.log 2>&1
echo "TERMINÉ $(date +%H:%M)" > logs/arbres3-chaine.done
