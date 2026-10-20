#!/usr/bin/env bash
# Lot 1 bis de l'épreuve du jeu (cahier CAHIER-LOT-1-BIS-2026-10-20 § 7) : 1 200 parties, un fil, déterministe. Le
# témoin n'est pas rejoué (identique au lot 1, contrôlé le 20 oct.).
#   SF 19   : livre A, prix A, livre B, prix B   (20 départs-camps × 4 × 10 = 800 parties)
#   SF 17.1 : livre A, livre B                   (20 départs-camps × 2 × 10 = 400 parties)
#   scripts/plans/epreuve-1bis.sh [parallélisme=3] [bras…]   bras = sf19:livre:A … sf171:livre:B, défaut = les six
# Partage entre machines : chacune reçoit sa liste de bras (moteurs identiques à l'octet, identité VPS / Orion contrôlée).
# Moteurs : S19 et S17 dans l'environnement, sinon ceux du VPS. Reprenable : un (départ, camp, bras, règles) dont le
# parties.json existe déjà est sauté ; rien n'est purgé.
# Sorties : reports/plans/epreuve-1bis/<moteur>-p18/partie-<départ>-<camp>-<bras>-<A|B>/parties.{json,md,log}, TERMINÉ.
set -euo pipefail
PAR=${1:-3}; shift $(( $# < 1 ? $# : 1 ))
BRAS=${*:-"sf19:livre:A sf19:prix:A sf19:livre:B sf19:prix:B sf171:livre:A sf171:livre:B"}
S19=${S19:-/usr/local/bin/stockfish}; S17=${S17:-/home/ubuntu/bin/stockfish-17.1}
for m in $S19 $S17; do [ -x "$m" ] || { echo "moteur introuvable : $m" >&2; exit 1; }; done
BASE=reports/plans/epreuve-1bis; mkdir -p "$BASE"; rm -f "$BASE/TERMINE"
IDS=$(node -e "import('./scripts/plans/departs.mjs').then((m) => console.log(m.DEPARTS.filter((d) => d.lot === 1).map((d) => d.id).join(' ')))")
export COACH_DETERMINISTIC=1
TACHES=$(for spec in $BRAS; do IFS=: read -r mot b r <<< "$spec"
  case $mot in sf19) bin=$S19; nom=bin-stockfish-p18;; sf171) bin=$S17; nom=bin-stockfish-17.1-p18;; *) echo "bras inconnu : $spec" >&2; exit 1;; esac
  for id in $IDS; do for camp in w b; do echo "$bin $nom $b $r $id $camp"; done; done; done)
ATTENDUS=$(echo "$TACHES" | wc -l)
echo "$(date -u +%FT%TZ) début : lot 1 bis [$BRAS], $ATTENDUS processus par $PAR → $BASE"
echo "$TACHES" | xargs -P "$PAR" -L 1 sh -c 'mot=$0; nom=$1; b=$2; r=$3; id=$4; camp=$5; d='"$BASE"'/$nom/partie-$id-$camp-$b-$r
  [ -s "$d/parties.json" ] && exit 0; mkdir -p "$d"
  STOCKFISH_PATH=$mot nice -n 19 node scripts/plans/partie.mjs --depart $id --camp $camp --bras $b --regles $r --out "$d" > "$d/parties.log" 2>&1
  echo "$(date -u +%FT%TZ) fini $nom $id $camp $b $r"' || true
PRODUITS=0; ERREURS=0
while read -r _ nom b r id camp; do d=$BASE/$nom/partie-$id-$camp-$b-$r
  [ -s "$d/parties.json" ] && PRODUITS=$((PRODUITS + 1))
  grep -q -E "Error|délai dépassé" "$d/parties.log" 2>/dev/null && { echo "ÉCHEC : $d"; ERREURS=$((ERREURS + 1)); }
done <<< "$TACHES"
echo "$(date -u +%FT%TZ) TERMINÉ $BASE [$BRAS] : $PRODUITS/$ATTENDUS processus ($((ERREURS + ATTENDUS - PRODUITS)) échec(s))" | tee "$BASE/TERMINE"
