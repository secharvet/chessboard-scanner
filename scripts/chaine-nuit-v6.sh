#!/bin/bash
# Nuit du 2 au 3 octobre 2026 : attend la fin du recalcul réparti (marque « tout terminé »), recolle les morceaux sur
# les deux machines, puis lance la chaîne v6 sur DENEB. Journal : reports/chaine-nuit-v6.log. Attente bornée.
set -u
cd "$(dirname "$0")/.."
echo "[$(TZ=Europe/Paris date +%H:%M)] attente du recalcul (reports/rescan-v3.log)"
scripts/attendre.sh --journal reports/rescan-v3.log --marque "tout terminé" --max 150 || { echo "ÉCHEC : recalcul non terminé"; echo TERMINÉ; exit 1; }
echo "[$(TZ=Europe/Paris date +%H:%M)] recollage"
scripts/recoller-v3.sh 2>&1 | tail -40 || { echo "ÉCHEC : recollage"; echo TERMINÉ; exit 1; }
echo "[$(TZ=Europe/Paris date +%H:%M)] chaîne v6 lancée sur DENEB (reports/pipeline-v6.log là-bas)"
ssh -n deneb "cd ~/dev/chessboard/chessboard-scanner; git pull -q origin coach-grounded; setsid nohup nice -n 10 bash scripts/pipeline-v6.sh > reports/pipeline-v6.log 2>&1 < /dev/null & sleep 0.3; echo lancé"
echo TERMINÉ
