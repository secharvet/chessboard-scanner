#!/usr/bin/env bash
# Lance (ou rattache) les deux agents de l'équipe dans tmux, chacun dans son worktree avec son rôle.
#   bash scripts/equipe/lancer.sh            # lance « expert » et « dev » s'ils ne tournent pas
#   tmux attach -t expert   /   tmux attach -t dev      # pour les voir et répondre à leurs demandes de permission
# Rôles et règles : docs/equipe/REGLES.md, docs/equipe/expert.md, docs/equipe/dev.md
set -euo pipefail
REPO=/home/ubuntu/chessboard-scanner
lancer() { # session dossier nom fichier-de-rôle [modèle]
  local s=$1 dir=$2 nom=$3 role=$4 modele=${5:-}
  local flagmodele=""; [ -n "$modele" ] && flagmodele="--model $modele"
  if tmux has-session -t "$s" 2>/dev/null; then echo "« $s » tourne déjà : tmux attach -t $s"; return; fi
  [ -d "$dir" ] || { echo "dossier absent : $dir (créer le worktree d'abord)"; exit 1; }
  tmux new-session -d -s "$s" -c "$dir" "claude --name '$nom' --remote-control '$nom' $flagmodele --append-system-prompt-file '$REPO/$role'"
  echo "« $s » lancé dans $dir ${modele:+(modèle $modele) }: tmux attach -t $s"
}
# Modèle par agent : le dev chef sur Sonnet (rapide, suffisant pour le front) ; l'expert sur le modèle par défaut.
lancer expert /home/ubuntu/chess-expert "Expert échecs" docs/equipe/expert.md
lancer dev    /home/ubuntu/chess-dev    "Dev chef"      docs/equipe/dev.md sonnet
