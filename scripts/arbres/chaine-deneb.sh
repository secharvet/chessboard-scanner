#!/bin/bash
# Chaîne DENEB : fenêtres → modèle → témoin → index → inventaire. Priorité minimale, 4 fils CPU, GPU pour l'entraînement.
cd ~/dev/chessboard/chessboard-scanner; source ~/plans-venv/bin/activate
export OMP_NUM_THREADS=4 MKL_NUM_THREADS=4
mkdir -p data/arbres logs
nice -n 19 python3 scripts/arbres/dataset.py 'data/grains/elite-*.jsonl' --out data/arbres/windows > logs/arbres-dataset.log 2>&1
nice -n 19 python3 scripts/arbres/train.py data/arbres/windows --out data/arbres/model --epochs 4 --batch 512 --dim 128 --layers 4 > logs/arbres-train.log 2>&1
nice -n 19 python3 scripts/arbres/train.py data/arbres/windows --out data/arbres/temoin --epochs 4 --batch 512 --dim 128 --layers 4 --control > logs/arbres-temoin.log 2>&1
nice -n 19 python3 scripts/arbres/index.py data/arbres/windows data/arbres/model --out data/arbres/arbres --k 2000 --min-games 200 --grains 'data/grains/elite-*.jsonl' > logs/arbres-index.log 2>&1
echo "TERMINÉ $(date +%H:%M)" > logs/arbres-chaine.done
