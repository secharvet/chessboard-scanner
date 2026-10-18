#!/usr/bin/env bash
# Étape 2 : le test à deux demi-coups v2, une position par processus (un fil, déterministe), pour un moteur donné.
#   scripts/plans/etape2.sh <binaire-stockfish> <filtre.json de référence> [parallélisme=3] [profondeur=18]
# Sorties : reports/plans/etape2/<moteur>-p<prof>/preparatoire-<position>.{md,json,log}, puis le JSON fusionné et TERMINÉ.
set -euo pipefail
MOTEUR=$1; JSON=$2; PAR=${3:-3}; PROF=${4:-18}
[ -x "$MOTEUR" ] || { echo "moteur introuvable : $MOTEUR" >&2; exit 1; }
[ -f "$JSON" ] || { echo "json introuvable : $JSON" >&2; exit 1; }
NOM=$(basename "$(dirname "$MOTEUR")")-$(basename "$MOTEUR")
OUT=reports/plans/etape2/$NOM-p$PROF; mkdir -p "$OUT"
IDS=$(node -e "import('./scripts/plans/positions-filtre.mjs').then((m) => console.log(m.POSITIONS.map((p) => p.id).join(' ')))")
export STOCKFISH_PATH=$MOTEUR COACH_DETERMINISTIC=1
echo "$(date -u +%FT%TZ) début : $MOTEUR, profondeur $PROF, $PAR processus → $OUT"
printf '%s\n' $IDS | xargs -P "$PAR" -I{} sh -c "nice -n 19 node scripts/plans/preparatoire.mjs --depth $PROF --in $JSON --seulement {} --out $OUT/preparatoire-{}.md > $OUT/preparatoire-{}.log 2>&1" || true
node -e "const fs=require('fs');const a=[];for(const f of fs.readdirSync('$OUT').filter((x)=>/^preparatoire-.*\.json$/.test(x)))a.push(...JSON.parse(fs.readFileSync('$OUT/'+f,'utf8')));fs.writeFileSync('$OUT/preparatoire.json',JSON.stringify(a,null,1));console.log(a.length+' lignes')"
ECHECS=$({ grep -l -E "Error|TypeError|délai dépassé" "$OUT"/*.log 2>/dev/null || true; } | wc -l)
[ "$ECHECS" -gt 0 ] && grep -l -E "Error|TypeError|délai dépassé" "$OUT"/*.log | sed "s/^/ÉCHEC : /"
echo "$(date -u +%FT%TZ) TERMINÉ $OUT ($ECHECS échec(s))" | tee "$OUT/TERMINE"
