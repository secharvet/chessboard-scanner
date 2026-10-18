#!/usr/bin/env bash
# Le faisceau, une position par processus (un fil, déterministe), puis la fusion et le critère.
#   scripts/plans/faisceau.sh <binaire-stockfish> [parallélisme=3] [profondeur=18] [options faisceau.mjs…]
# Sorties : reports/plans/faisceau/<moteur>-p<prof>/faisceau-<position>.{md,json,log}, faisceau.md fusionné, TERMINÉ.
set -euo pipefail
MOTEUR=$1; PAR=${2:-3}; PROF=${3:-18}; shift $(( $# < 3 ? $# : 3 ))
[ -x "$MOTEUR" ] || { echo "moteur introuvable : $MOTEUR" >&2; exit 1; }
NOM=$(basename "$(dirname "$MOTEUR")")-$(basename "$MOTEUR")
OUT=reports/plans/faisceau/$NOM-p$PROF; mkdir -p "$OUT"
IDS=$(node -e "import('./scripts/plans/positions-filtre.mjs').then((m) => console.log(m.POSITIONS.map((p) => p.id).join(' ')))")
export STOCKFISH_PATH=$MOTEUR COACH_DETERMINISTIC=1
echo "$(date -u +%FT%TZ) début : $MOTEUR, profondeur $PROF, $PAR processus → $OUT ($*)"
printf '%s\n' $IDS | xargs -P "$PAR" -I{} sh -c "nice -n 19 node scripts/plans/faisceau.mjs --depth $PROF --seulement {} --out $OUT/faisceau-{}.md $* > $OUT/faisceau-{}.log 2>&1" || true
node scripts/plans/faisceau.mjs --depth "$PROF" --fusion "$OUT" --out "$OUT/faisceau.md" $*
ECHECS=$({ grep -l -E "Error|délai dépassé" "$OUT"/*.log 2>/dev/null || true; } | wc -l)
ATTENDUS=$(echo $IDS | wc -w); PRODUITS=$(ls "$OUT"/faisceau-*.json 2>/dev/null | wc -l)
[ "$PRODUITS" -lt "$ATTENDUS" ] && { echo "ÉCHEC : $((ATTENDUS - PRODUITS)) position(s) sans JSON"; ECHECS=$((ECHECS + ATTENDUS - PRODUITS)); }
{ grep -l -E "Error|délai dépassé" "$OUT"/*.log 2>/dev/null || true; } | sed "s/^/ÉCHEC : /"
echo "$(date -u +%FT%TZ) TERMINÉ $OUT ($ECHECS échec(s))" | tee "$OUT/TERMINE"
