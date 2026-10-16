# Quadlet — plateforme échecs

Unités déclaratives pour systemd --user (rootless Podman). Chaque fois qu'un fichier change ici, le copier dans
`~/.config/containers/systemd/` puis `systemctl --user daemon-reload`.

| Fichier | Rôle |
|---|---|
| `chess.network` | réseau privé entre les conteneurs (`systemd-chess`) |
| `chess-db.volume` | volume persistant des données Postgres |
| `chess-db.container` | Postgres 16, schéma initial dans `db/schema.sql` (exécuté une seule fois, au premier démarrage sur un volume vide) |
| `chess-api.container` | API Node (`coach/server.mjs`) : dépôt entier monté en volume, `node --watch` → éditer un fichier redémarre le process tout seul, **aucun rebuild d'image jamais nécessaire** pour du JS |

Secret (non commité) : `db/.env.db` — identifiants Postgres, généré une fois (`chmod 600`).

Démarrage au boot : automatique, géré par Quadlet lui-même via `[Install] WantedBy=default.target` dans les fichiers
`.container` (pas de `systemctl enable` possible ni nécessaire sur des unités générées).

Commandes utiles :
```
systemctl --user status chess-api chess-db
podman logs -f chess-api     # journal temps réel (voit les redémarrages de node --watch)
podman exec -it chess-db psql -U chess
```

Contrôle de bout en bout : `curl http://127.0.0.1:8000/db-health` (API → réseau Podman → Postgres).

Le site statique (nginx, `docker/web/`) n'a pas été touché : il continue de joindre l'API via `host.containers.internal:8000`,
exactement comme avant quand l'API tournait sans conteneur. Le faire rejoindre le réseau `chess` est une étape séparée,
volontairement pas faite aujourd'hui pour ne pas mélanger deux changements sur le site qui est en service.
