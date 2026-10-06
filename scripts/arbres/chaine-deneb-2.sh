#!/bin/bash
# Seconde passe : milieu de jeu seulement (fenêtres finissant avant le 80e demi-coup, chaque camp ≥ 14 points),
# parties DENEB + VPS, 2000 groupes fins regroupés en 300 arbres. Priorité minimale, 4 fils CPU.
cd ~/dev/chessboard/chessboard-scanner; source ~/plans-venv/bin/activate; export OMP_NUM_THREADS=4
nice -n 19 python3 scripts/arbres/dataset.py 'data/grains/elite-*.jsonl' --out data/arbres2/windows --max-end 80 --min-material 14 > logs/arbres2-dataset.log 2>&1
nice -n 19 python3 scripts/arbres/train.py data/arbres2/windows --out data/arbres2/model --epochs 4 --batch 512 --dim 128 --layers 4 > logs/arbres2-train.log 2>&1
nice -n 19 python3 scripts/arbres/train.py data/arbres2/windows --out data/arbres2/temoin --epochs 4 --batch 512 --dim 128 --layers 4 --control > logs/arbres2-temoin.log 2>&1
nice -n 19 python3 scripts/arbres/index.py data/arbres2/windows data/arbres2/model --out data/arbres2/arbres --k 2000 --k2 300 --min-games 300 --grains 'data/grains/elite-*.jsonl' > logs/arbres2-index.log 2>&1
echo "TERMINÉ $(date +%H:%M)" > logs/arbres2-chaine.done
