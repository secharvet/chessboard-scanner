#!/bin/bash
# Nuit du 2 au 3 octobre 2026 (DENEB éteint à 23 h) : attend la fin du recalcul réparti, recolle les morceaux sur les
# deux machines (DENEB encore allumé), puis lance sur le VPS SEUL le jugement moteur des plans qui ont bougé
# (2 fils, priorité basse, reprise possible demain sur DENEB). Journal : reports/chaine-nuit-vps.log.
set -u
cd "$(dirname "$0")/.."
echo "[$(TZ=Europe/Paris date +%H:%M)] attente du recalcul (reports/rescan-v3.log)"
scripts/attendre.sh --journal reports/rescan-v3.log --marque "tout terminé" --max 110 || { echo "ÉCHEC : recalcul non terminé avant l'extinction de DENEB"; echo TERMINÉ; exit 1; }
echo "[$(TZ=Europe/Paris date +%H:%M)] recollage (VPS puis DENEB)"
scripts/recoller-v3.sh 2>&1 | tail -40 || { echo "ÉCHEC : recollage"; echo TERMINÉ; exit 1; }
echo "[$(TZ=Europe/Paris date +%H:%M)] jugement moteur sur le VPS, 2 fils, priorité basse (reprise par plan)"
nice -n 10 node scripts/juge-plans.mjs data/labels/human-2013-01.s{0,1,2,3}.v3.jsonl data/labels/human-2016-01f.s{0,1,2,3}.v3.jsonl --workers 2 --depth 12 2>&1 | while read -r l; do echo "[$(TZ=Europe/Paris date +%H:%M)] $l"; done
echo "[$(TZ=Europe/Paris date +%H:%M)] jugement : fin sur le VPS"
echo TERMINÉ
