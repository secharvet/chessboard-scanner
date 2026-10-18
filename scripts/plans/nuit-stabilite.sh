#!/usr/bin/env bash
# Nuit de stabilité des plans : le tableau du filtre et le test à deux demi-coups, une position par processus
# (un fil, déterministe), au plus PAR processus à la fois, priorité minimale. Écrit la marque TERMINÉ à la fin.
#
#   scripts/plans/nuit-stabilite.sh <binaire-stockfish> <profondeur> <filtre.json de référence> [parallélisme=12]
#
# Sorties : reports/plans/stabilite/<moteur>-p<prof>/{filtre,preparatoire}-<position>.{md,json,log}
# Le JSON de référence est le tableau à profondeur 18 : il fixe, pour chaque plan, le coup M que le test rejoue.
set -euo pipefail
MOTEUR=$1; PROF=$2; JSON=$3; PAR=${4:-12}
[ -x "$MOTEUR" ] || { echo "moteur introuvable : $MOTEUR" >&2; exit 1; }
[ -f "$JSON" ] || { echo "json introuvable : $JSON" >&2; exit 1; }
NOM=$(basename "$(dirname "$MOTEUR")")-$(basename "$MOTEUR")
OUT=reports/plans/stabilite/$NOM-p$PROF
mkdir -p "$OUT"
IDS=$(node -e "import('./scripts/plans/positions-filtre.mjs').then((m) => console.log(m.POSITIONS.map((p) => p.id).join(' ')))")
export STOCKFISH_PATH=$MOTEUR COACH_DETERMINISTIC=1
echo "$(date -u +%FT%TZ) début : $MOTEUR, profondeur $PROF, $PAR processus → $OUT"
printf '%s\n' $IDS | xargs -P "$PAR" -I{} sh -c "nice -n 19 node scripts/plans/filtre.mjs --depth $PROF --seulement {} --out $OUT/filtre-{}.md > $OUT/filtre-{}.log 2>&1" || true
echo "$(date -u +%FT%TZ) tableau fini"
printf '%s\n' $IDS | xargs -P "$PAR" -I{} sh -c "nice -n 19 node scripts/plans/preparatoire.mjs --depth $PROF --in $JSON --seulement {} --out $OUT/preparatoire-{}.md > $OUT/preparatoire-{}.log 2>&1" || true
echo "$(date -u +%FT%TZ) test fini"
ECHECS=$({ grep -l -E "Error|TypeError|délai dépassé" "$OUT"/*.log 2>/dev/null || true; } | wc -l)
[ "$ECHECS" -gt 0 ] && grep -l -E "Error|TypeError|délai dépassé" "$OUT"/*.log | sed "s/^/ÉCHEC : /"
echo "TERMINÉ $OUT ($ECHECS échec(s))" | tee "$OUT/TERMINE"
