#!/bin/bash
# Installation sur un pod RunPod (image PyTorch) pour l'entraînement brut à l'échelle (7 octobre 2026).
# Lancé depuis le VPS : bash scripts/arbres/pod-installer.sh <hôte> <port>
# - copie les scripts, rapatrie les plateaux depuis DENEB vers /workspace/data/plateaux, installe faiss-cpu.
set -e
H=$1; P=$2; S="ssh -i $HOME/.ssh/id_ed25519_deneb -o StrictHostKeyChecking=accept-new -p $P root@$H"
$S 'mkdir -p /workspace/chess/scripts/arbres /workspace/data/plateaux /workspace/data/grains /workspace/logs; nvidia-smi --query-gpu=name,memory.total --format=csv,noheader; python3 -c "import torch;print(torch.__version__, torch.cuda.is_available())"; nproc; free -g | head -2; df -h /workspace | tail -1'
scp -i $HOME/.ssh/id_ed25519_deneb -P $P -q scripts/arbres/train-brut.py scripts/arbres/sonder.py scripts/arbres/sonder-mots.py scripts/arbres/dataset.py scripts/arbres/index-brut.py root@$H:/workspace/chess/scripts/arbres/
$S 'pip -q install faiss-cpu 2>&1 | tail -1; echo pip ok'
echo "installation OK ; données : à rapatrier depuis DENEB (voir pod-donnees.sh)"
