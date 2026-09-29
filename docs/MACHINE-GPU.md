# Machine d'entraînement (GPU) : installation et répartition

Le VPS garde le site, le coach et l'étiquetage (Stockfish, processeur) ; la machine GPU prend l'entraînement,
les contrefactuels et l'émergence lourde. Même dépôt, mêmes scripts ; `scripts/train-plans.py` utilise CUDA
s'il est présent.

## Installation (Linux, une fois)

```bash
# 1. Code
git clone https://github.com/secharvet/chessboard-scanner.git && cd chessboard-scanner
git checkout coach-grounded && npm ci

# 2. Python (venv) : torch CUDA + scikit-learn
python3 -m venv ~/plans-venv && ~/plans-venv/bin/pip install --upgrade pip
# torch depuis l'index PyTorch (cet index ne contient QUE torch) : cu128 pour une RTX 50xx (Blackwell, torch ≥ 2.7),
# cu124 suffit pour une RTX 30xx/40xx ; `nvidia-smi` indique la version CUDA du pilote.
~/plans-venv/bin/pip install torch --index-url https://download.pytorch.org/whl/cu128
# le reste depuis PyPI (index par défaut)
~/plans-venv/bin/pip install scikit-learn numpy
~/plans-venv/bin/python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"

# 3. Données depuis le VPS (≈ 1,4 Go ; les étiquettes grossissent chaque nuit)
rsync -avz --progress ubuntu@VPS:chessboard-scanner/data/labels/   data/labels/
rsync -avz --progress ubuntu@VPS:chessboard-scanner/data/datasets/ data/datasets/
rsync -avz --progress ubuntu@VPS:chessboard-scanner/data/lichess/  data/lichess/   # PGN, facultatif

# 4. Stockfish (seulement pour étiqueter ou vérifier sur cette machine)
sudo apt install stockfish   # ou le binaire officiel dans /usr/local/bin/stockfish
```

## Utilisation

```bash
# Jeu de données depuis les étiquettes (Node, sans moteur)
node scripts/build-dataset.mjs data/labels/human-2013-01.s*.jsonl --out data/datasets/humains-v2.jsonl

# Entraînement (tous les concepts d'un coup : la mémoire GPU suffit ; sur le VPS, un concept par processus)
~/plans-venv/bin/python scripts/train-plans.py data/datasets/humains-v2.jsonl --epochs 10 --threads 8 --out reports/train-plans.json

# Contrefactuels
node scripts/counterfactuals.mjs data/datasets/humains-v2.jsonl --out data/datasets/contrefactuels.jsonl --max 400
~/plans-venv/bin/python scripts/score-counterfactuals.py data/datasets/contrefactuels.jsonl

# Grille par Elo, émergence avec le catalogue
node scripts/human-grid.mjs data/labels/human-*.jsonl --out reports/grille-elo.md
node scripts/emergence-humain.mjs data/labels/human-*.jsonl --min 150 --out reports/emergence-humain.md
```

Les modèles produits (`data/datasets/plan-*.pt`, `plan-*-faits.pkl`) reviennent sur le VPS par `rsync` dans l'autre
sens pour servir le coach.
