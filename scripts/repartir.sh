#!/bin/bash
# Répartit un travail « un processus par fichier » entre DENEB et le VPS (1er octobre 2026, demande de l'auteur :
# « quand il y a pas mal de calculs CPU, il faut partager »). Au prorata des cœurs : 4 fichiers sur 5 à DENEB
# (16 fils), 1 sur 5 au VPS (4 fils, dont un gardé au coach : les processus locaux tournent en nice 10).
#
#   scripts/repartir.sh --cmd 'node scripts/rescan-labels.mjs {in} --out {out}' --out-dir reports/x --suffix .json \
#        [--part-deneb 4 --part-vps 1] [--max 240] fichier1 fichier2 …
#
# {in} = le fichier d'entrée (il doit exister sur la machine qui le traite, même chemin relatif au dépôt) ;
# {out} = <out-dir>/<nom du fichier sans extension><suffix> ; le journal est <out>.log. Le travail doit écrire la
# marque « TERMINÉ » sur sa sortie standard à la fin. Les sorties de DENEB sont rapatriées dans <out-dir> à la fin.
# Attente bornée (--max minutes), état toutes les 5 minutes. Sortie 0 = tout terminé, 1 = délai dépassé.
set -u
cd "$(dirname "$0")/.."
CMD=""; OUT_DIR="reports/repartir"; SUFFIX=".json"; PART_DENEB=4; PART_VPS=1; MAX=240
# Plafonds de travaux SIMULTANÉS par machine (4 octobre 2026 : DENEB est l'ordinateur principal de l'auteur, « laisse
# 2 cœurs libres sinon je freeze ») : au-delà, les travaux attendent leur tour dans une file.
CAP_DENEB=${CAP_DENEB:-14}; CAP_VPS=${CAP_VPS:-3}
FILES=()
while [ $# -gt 0 ]; do
  case "$1" in
    --cmd) CMD="$2"; shift 2;;
    --out-dir) OUT_DIR="$2"; shift 2;;
    --suffix) SUFFIX="$2"; shift 2;;
    --part-deneb) PART_DENEB="$2"; shift 2;;
    --part-vps) PART_VPS="$2"; shift 2;;
    --max) MAX="$2"; shift 2;;
    *) FILES+=("$1"); shift;;
  esac
done
[ -n "$CMD" ] && [ ${#FILES[@]} -gt 0 ] || { echo "usage : repartir.sh --cmd '…{in}…{out}…' fichiers…"; exit 2; }
REMOTE_DIR=$(ssh deneb 'cd ~/dev/chessboard/chessboard-scanner && pwd')
mkdir -p "$OUT_DIR"
ssh deneb "mkdir -p '$REMOTE_DIR/$OUT_DIR'"

declare -a WHERE OUTS
cycle=$((PART_DENEB + PART_VPS))
for i in "${!FILES[@]}"; do
  f="${FILES[$i]}"
  base=$(basename "$f"); base="${base%.*}"
  out="$OUT_DIR/$base$SUFFIX"
  OUTS[$i]="$out"
  cmd="${CMD//\{in\}/$f}"; cmd="${cmd//\{out\}/$out}"
  if [ $((i % cycle)) -lt "$PART_DENEB" ]; then WHERE[$i]=deneb; else WHERE[$i]=vps; fi
  CMDS[$i]="$cmd"
done


finished() {  # 0 si le journal $2 sur la machine $1 porte la marque
  if [ "$1" = deneb ]; then ssh deneb "grep -q TERMINÉ '$REMOTE_DIR/$2' 2>/dev/null"; else grep -q TERMINÉ "$2" 2>/dev/null; fi
}

running() {  # nombre de travaux lancés et non terminés sur la machine $1
  local n=0
  for j in "${!FILES[@]}"; do [ "${WHERE[$j]}" = "$1" ] && [ "${STARTED[$j]:-0}" = 1 ] && ! finished "$1" "${OUTS[$j]}.log" && n=$((n + 1)); done
  echo $n
}
launch() {  # lance le travail $1 sur sa machine
  local i=$1 cmd="${CMDS[$i]}" out="${OUTS[$i]}"
  if [ "${WHERE[$i]}" = deneb ]; then
    # ssh -n et une commande après le « & » : sinon ssh attend la fin du travail distant (constaté le 1er octobre).
    # « cd … ; … & » et non « cd … && … & » : avec &&, c'est un sous-shell entier qui passe en arrière-plan, et il garde
    # la sortie de ssh ouverte jusqu'à la fin du travail (lancements en série constatés le 1er octobre, 15 h 40).
    ssh -n deneb "cd '$REMOTE_DIR'; setsid nohup nice -n 10 bash -c '$cmd' > '$out.log' 2>&1 < /dev/null & sleep 0.3; echo lancé" > /dev/null
  else
    setsid nohup nice -n 10 bash -c "$cmd" > "$out.log" 2>&1 < /dev/null &
  fi
  STARTED[$i]=1
  echo "$(TZ=Europe/Paris date +%H:%M) lancé sur ${WHERE[$i]} : ${FILES[$i]} → $out"
}
declare -a CMDS STARTED
for minute in $(seq 0 "$MAX"); do
  # File d'attente : lancer ce qui peut l'être sous les plafonds.
  for i in "${!FILES[@]}"; do
    [ "${STARTED[$i]:-0}" = 1 ] && continue
    if [ "${WHERE[$i]}" = deneb ]; then cap=$CAP_DENEB; else cap=$CAP_VPS; fi
    [ "$(running "${WHERE[$i]}")" -lt "$cap" ] && launch "$i"
  done
  done_n=0
  for i in "${!FILES[@]}"; do [ "${STARTED[$i]:-0}" = 1 ] && finished "${WHERE[$i]}" "${OUTS[$i]}.log" && done_n=$((done_n + 1)); done
  if [ "$done_n" -eq ${#FILES[@]} ]; then break; fi
  if [ $((minute % 5)) -eq 0 ]; then echo "$(TZ=Europe/Paris date +%H:%M) $done_n/${#FILES[@]} terminés"; fi
  sleep 60
done
if [ "$done_n" -ne ${#FILES[@]} ]; then echo "délai dépassé ($MAX min) : $done_n/${#FILES[@]} terminés"; exit 1; fi
for i in "${!FILES[@]}"; do
  [ "${WHERE[$i]}" = deneb ] && scp -q "deneb:$REMOTE_DIR/${OUTS[$i]}" "deneb:$REMOTE_DIR/${OUTS[$i]}.log" "$OUT_DIR/"
done
echo "$(TZ=Europe/Paris date +%H:%M) tout terminé ; sorties dans $OUT_DIR"
