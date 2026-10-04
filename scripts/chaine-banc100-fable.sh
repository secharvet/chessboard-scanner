#!/bin/bash
# 4 octobre 2026 : banc de cent fiches regénéré avec le coach du jour, puis relu par Fable, une fiche à la fois.
set -u
cd "$(dirname "$0")/.."
echo "[$(TZ=Europe/Paris date +%H:%M)] regénération des 100 fiches (mode déterministe)"
COACH_MODE=brief COACH_REPHRASE=0 COACH_DETERMINISTIC=1 node scripts/coach-timing.mjs --positions reports/banc-reel-60.json --out reports/timing-banc100-b.json 2>&1 | tail -3
echo "[$(TZ=Europe/Paris date +%H:%M)] images et relecture par Fable"
node scripts/fiches-fable.mjs reports/timing-banc100-b.json /tmp/claude-1000/-home-ubuntu-ruche/d5c15aa3-2d27-4c63-97f7-1047dd23cc38/scratchpad/fiches100 reports/fiches-fable-banc100.json 2>&1 | tail -4
echo "[$(TZ=Europe/Paris date +%H:%M)] fini"
echo TERMINÉ
