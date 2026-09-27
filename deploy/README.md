# Mise en ligne

État actuel du serveur (voir aussi docs/ARCHITECTURE.md §10) :

| Élément | Mise en place |
|---|---|
| Serveur du coach | service systemd utilisateur `chess-coach.service` (copie : `deploy/chess-coach.service`), `loginctl enable-linger`, redémarrage automatique |
| Site (nginx, Podman) | conteneur `restart: unless-stopped` + `podman-restart.service` (utilisateur) |
| Port 8000 (API du coach) | **fermé depuis l'extérieur** : `iptables -A INPUT -p tcp --dport 8000 -i lo -j ACCEPT` puis `-j DROP`, sauvegardé par `netfilter-persistent` |
| Abus / coûts | limite de requêtes par visiteur (`COACH_RATE_MAX`, `COACH_RATE_WINDOW_S`) et d'analyses simultanées (`COACH_MAX_CONCURRENT`) |
| **HTTPS** | **Caddy** (`/etc/caddy/Caddyfile`, copie : `deploy/Caddyfile`), certificat Let's Encrypt automatique, redirection http → https ; adresse provisoire **https://162-19-25-49.sslip.io** |
| Port 6400 (site) | **fermé depuis l'extérieur** (même règle que le 8000) : tout passe par Caddy ; nginx reprend l'adresse du visiteur (`real_ip_header X-Real-IP`) |

Reste à faire :
1. **Nom de domaine** définitif : enregistrement A → 162.19.25.49, puis remplacer `162-19-25-49.sslip.io` par le domaine dans `/etc/caddy/Caddyfile` et `sudo systemctl reload caddy` (le certificat suit tout seul).
2. **Image de production** (`make start`) plutôt que le mode dev qui monte tout le dépôt.
3. **Régénérer les clés** DeepSeek, Groq et le jeton GitHub (passés dans une conversation) ; `.env` en `chmod 600`.
4. Surveiller la consommation DeepSeek (tableau de bord du fournisseur) et les journaux : `journalctl --user -u chess-coach -f`.

Commandes :
```bash
systemctl --user status chess-coach        # état du coach
systemctl --user restart chess-coach       # après une modification de coach/ ou .env
journalctl --user -u chess-coach -f        # journal
sudo iptables -L INPUT -v -n | grep 8000   # règles et compteurs du pare-feu
```
