#!/bin/bash
# Attente FIABLE et BORNÉE de la fin d'un travail long, à la place des boucles « until » écrites à la main.
#
#   scripts/attendre.sh --unit <service systemd --user>   [--deneb] [--max <minutes>]
#   scripts/attendre.sh --journal <fichier> [--marque TERMINÉ] [--deneb] [--max <minutes>]
#
# Règles (après trois boucles infinies le 30 septembre 2026) :
#  - la fin d'un travail se lit dans l'état de son service systemd (`is-active` devient inactive/failed) ou dans une
#    MARQUE écrite par le travail lui-même dans son journal ; jamais en cherchant le nom d'un processus (pgrep -f
#    trouve la commande qui le cherche) ;
#  - l'attente est TOUJOURS bornée (--max, 240 minutes par défaut) : au-delà, on sort en le disant ;
#  - sortie 0 = terminé, 1 = délai dépassé, 2 = mauvais usage. Le dernier état est affiché.
UNIT=""; JOURNAL=""; MARQUE="TERMINÉ"; MAX=240; HOST=""
while [ $# -gt 0 ]; do
  case "$1" in
    --unit) UNIT="$2"; shift 2;;
    --journal) JOURNAL="$2"; shift 2;;
    --marque) MARQUE="$2"; shift 2;;
    --deneb) HOST="deneb"; shift;;
    --max) MAX="$2"; shift 2;;
    *) echo "argument inconnu : $1"; exit 2;;
  esac
done
[ -z "$UNIT$JOURNAL" ] && { echo "usage : --unit <service> | --journal <fichier> [--marque M] [--deneb] [--max min]"; exit 2; }
run() { if [ -n "$HOST" ]; then ssh -o BatchMode=yes -o ConnectTimeout=10 "$HOST" "$1"; else bash -c "$1"; fi; }
fini() {
  if [ -n "$UNIT" ]; then
    etat=$(run "systemctl --user is-active $UNIT 2>/dev/null"); [ "$etat" != "active" ] && [ "$etat" != "activating" ]
  else
    run "grep -q '$MARQUE' '$JOURNAL' 2>/dev/null"
  fi
}
debut=$(date +%s)
while ! fini; do
  if [ $(( ($(date +%s) - debut) / 60 )) -ge "$MAX" ]; then
    echo "délai dépassé ($MAX min) : ${UNIT:-$JOURNAL} n'est pas terminé"; exit 1
  fi
  sleep 60
done
echo "terminé : ${UNIT:-$JOURNAL} ($(( ($(date +%s) - debut) / 60 )) min d'attente)"
[ -n "$UNIT" ] && run "systemctl --user is-active $UNIT 2>/dev/null; systemctl --user show $UNIT -p Result --value 2>/dev/null"
exit 0
