#!/bin/bash
# 4 octobre 2026 : attend la mise à niveau de DENEB (sync-deneb-v3, marque TERMINÉ) puis lance la chaîne v6 sur DENEB
# à pleine puissance (accord de l'auteur : « toute la puissance est disponible »). Journal : reports/chaine-jour-v6.log.
set -u
cd "$(dirname "$0")/.."
scripts/attendre.sh --journal reports/sync-deneb-v3.log --marque TERMINÉ --max 90 || { echo "ÉCHEC : synchronisation non terminée"; echo TERMINÉ; exit 1; }
echo "[$(TZ=Europe/Paris date +%H:%M)] chaîne v6 lancée sur DENEB"
ssh -n deneb "cd ~/dev/chessboard/chessboard-scanner; setsid nohup bash scripts/pipeline-v6.sh > reports/pipeline-v6.log 2>&1 < /dev/null & sleep 0.3; echo lancé"
echo TERMINÉ
