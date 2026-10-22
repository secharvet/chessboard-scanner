#!/usr/bin/env bash
# Attaque de roi, 22 oct. (docs/plans/SEUILS-ATTAQUE-ROI-2026-10-21.md) : un fil, déterministe, SF 19, profondeur 18.
#   scripts/plans/epreuve-attaque.sh observation [parallélisme=8]
#     200 parties neuves, graines 11-20, 20 départs-camps, bras livre, règles A ; les candidats tournent ensuite en
#     observateur (scripts/plans/observer-attaque.mjs), rien n'est interdit pendant le jeu.
#   scripts/plans/epreuve-attaque.sh panov [parallélisme=3]
#     Panov coach Noirs (REGROUPEMENT § 5) : A n° 11-50 (n° 1-10 existent au lot 1 bis) et AV (A + veto) n° 1-50.
# Moteur : S19 dans l'environnement, sinon /usr/local/bin/stockfish. Reprenable : un processus dont le parties.json existe
# est sauté ; rien n'est purgé. Sortie : reports/plans/epreuve-attaque/<lot>/…, marque TERMINE.
set -euo pipefail
LOT=${1:?observation ou panov}; PAR=${2:-}
S19=${S19:-/usr/local/bin/stockfish}; [ -x "$S19" ] || { echo "moteur introuvable : $S19" >&2; exit 1; }
seq_virg() { seq -s, "$1" "$2"; }
case $LOT in
  observation) PAR=${PAR:-8}
    IDS=$(node -e "import('./scripts/plans/departs.mjs').then((m) => console.log(m.DEPARTS.filter((d) => d.lot === 1).map((d) => d.id).join(' ')))")
    TACHES=$(for id in $IDS; do for camp in w b; do echo "A $id $camp $(seq_virg 11 20) $id-$camp-livre-A"; done; done);;
  panov) PAR=${PAR:-3}
    TACHES=$(for i in 1 2 3 4; do echo "A iqp-panov b $(seq_virg $((i * 10 + 1)) $((i * 10 + 10))) A-$((i * 10 + 1))"; done
             for i in 0 1 2 3 4; do echo "AV iqp-panov b $(seq_virg $((i * 10 + 1)) $((i * 10 + 10))) AV-$((i * 10 + 1))"; done);;
  *) echo "lot inconnu : $LOT" >&2; exit 1;;
esac
BASE=reports/plans/epreuve-attaque/$LOT/bin-stockfish-p18; mkdir -p "$BASE"; rm -f "$BASE/../TERMINE"
export COACH_DETERMINISTIC=1
ATTENDUS=$(echo "$TACHES" | wc -l)
echo "$(date -u +%FT%TZ) début : attaque de roi, lot $LOT, $ATTENDUS processus par $PAR → $BASE"
echo "$TACHES" | xargs -P "$PAR" -L 1 sh -c 'r=$0; id=$1; camp=$2; num=$3; tag=$4; d='"$BASE"'/partie-$tag
  [ -s "$d/parties.json" ] && exit 0; mkdir -p "$d"
  STOCKFISH_PATH='"$S19"' nice -n 19 node scripts/plans/partie.mjs --depart $id --camp $camp --bras livre --regles $r --numeros $num --out "$d" > "$d/parties.log" 2>&1
  echo "$(date -u +%FT%TZ) fini $tag"' || true
PRODUITS=0; ERREURS=0
while read -r _ _ _ _ tag; do d=$BASE/partie-$tag
  [ -s "$d/parties.json" ] && PRODUITS=$((PRODUITS + 1))
  grep -q -E "Error|délai dépassé" "$d/parties.log" 2>/dev/null && { echo "ÉCHEC : $d"; ERREURS=$((ERREURS + 1)); }
done <<< "$TACHES"
echo "$(date -u +%FT%TZ) TERMINÉ $BASE : $PRODUITS/$ATTENDUS processus ($((ERREURS + ATTENDUS - PRODUITS)) échec(s))" | tee "$BASE/../TERMINE"
