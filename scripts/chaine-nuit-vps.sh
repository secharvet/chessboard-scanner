#!/bin/bash
# Nuit du 2 au 3 octobre 2026 (DENEB éteint à 23 h) : attend la fin du recalcul réparti, recolle les morceaux sur les
# deux machines (DENEB encore allumé), puis lance sur le VPS SEUL le jugement moteur des plans qui ont bougé
# (4 fils, coach arrêté la nuit, reprise possible demain sur DENEB). Journal : reports/chaine-nuit-vps.log.
set -u
cd "$(dirname "$0")/.."
echo "[$(TZ=Europe/Paris date +%H:%M)] attente du recalcul (reports/rescan-v3.log)"
scripts/attendre.sh --journal reports/rescan-v3.log --marque "tout terminé" --max 110 || { echo "ÉCHEC : recalcul non terminé avant l'extinction de DENEB"; echo TERMINÉ; exit 1; }
echo "[$(TZ=Europe/Paris date +%H:%M)] recollage (VPS puis DENEB)"
scripts/recoller-v3.sh 2>&1 | tail -40 || { echo "ÉCHEC : recollage"; echo TERMINÉ; exit 1; }
# « Full power » (accord de l'auteur, 21 h 20) : le coach en ligne est arrêté pour la nuit, 4 fils à priorité normale ;
# le coach est relancé par une minuterie à 7 h 30 Paris quoi qu'il arrive, et à la fin de la chaîne.
systemctl --user stop chess-coach.service && echo "[$(TZ=Europe/Paris date +%H:%M)] coach en ligne arrêté pour la nuit"
systemd-run --user --on-calendar="2026-10-03 05:30:00 UTC" --unit=reveil-coach systemctl --user start chess-coach.service 2>&1 | tail -1
echo "[$(TZ=Europe/Paris date +%H:%M)] jugement moteur sur le VPS, 4 fils (reprise par plan)"
node scripts/juge-plans.mjs data/labels/human-2013-01.s{0,1,2,3}.v3.jsonl data/labels/human-2016-01f.s{0,1,2,3}.v3.jsonl --workers 4 --depth 12 2>&1 | while read -r l; do echo "[$(TZ=Europe/Paris date +%H:%M)] $l"; done
systemctl --user start chess-coach.service
echo "[$(TZ=Europe/Paris date +%H:%M)] jugement : fin sur le VPS"
echo TERMINÉ
