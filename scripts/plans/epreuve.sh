#!/usr/bin/env bash
# L'épreuve du jeu, un processus par (départ × camp × bras), un fil, déterministe.
#   scripts/plans/epreuve.sh <binaire-stockfish> [parallélisme=3] [lot=1] [bras="livre prix temoin"] [options partie.mjs…]
# Sorties : reports/plans/epreuve/<moteur>-p<prof>/partie-<départ>-<camp>-<bras>/parties.{json,md,log}, TERMINÉ.
set -euo pipefail
MOTEUR=$1; PAR=${2:-3}; LOT=${3:-1}; BRAS=${4:-"livre prix temoin"}; shift $(( $# < 4 ? $# : 4 ))
[ -x "$MOTEUR" ] || { echo "moteur introuvable : $MOTEUR" >&2; exit 1; }
PROF=18; for ((i = 1; i <= $#; i++)); do [ "${!i}" = "--depth" ] && { j=$((i + 1)); PROF=${!j}; }; done
NOM=$(basename "$(dirname "$MOTEUR")")-$(basename "$MOTEUR")
OUT=reports/plans/epreuve/$NOM-p$PROF
[ -d "$OUT" ] && { echo "purge de $OUT (passe précédente)"; rm -rf "$OUT"; }; mkdir -p "$OUT"
IDS=$(node -e "import('./scripts/plans/departs.mjs').then((m) => console.log(m.DEPARTS.filter((d) => d.lot === $LOT).map((d) => d.id).join(' ')))")
export STOCKFISH_PATH=$MOTEUR COACH_DETERMINISTIC=1
TACHES=$(for id in $IDS; do for camp in w b; do for b in $BRAS; do echo "$id $camp $b"; done; done; done)
echo "$(date -u +%FT%TZ) début : $MOTEUR, lot $LOT, bras [$BRAS], $(echo "$TACHES" | wc -l) processus par $PAR → $OUT ($*)"
echo "$TACHES" | xargs -P "$PAR" -L 1 sh -c 'id=$0; camp=$1; b=$2; shift 2; d='"$OUT"'/partie-$id-$camp-$b; mkdir -p "$d"; nice -n 19 node scripts/plans/partie.mjs --depart $id --camp $camp --bras $b --out "$d" '"$*"' > "$d/parties.log" 2>&1' || true
ECHECS=$({ grep -l -E "Error|délai dépassé" "$OUT"/partie-*/parties.log 2>/dev/null || true; } | wc -l)
ATTENDUS=$(echo "$TACHES" | wc -l); PRODUITS=$(ls "$OUT"/partie-*/parties.json 2>/dev/null | wc -l)
[ "$PRODUITS" -lt "$ATTENDUS" ] && { echo "ÉCHEC : $((ATTENDUS - PRODUITS)) processus sans JSON"; ECHECS=$((ECHECS + ATTENDUS - PRODUITS)); }
{ grep -l -E "Error|délai dépassé" "$OUT"/partie-*/parties.log 2>/dev/null || true; } | sed "s/^/ÉCHEC : /"
echo "$(date -u +%FT%TZ) TERMINÉ $OUT ($ECHECS échec(s))" | tee "$OUT/TERMINE"
