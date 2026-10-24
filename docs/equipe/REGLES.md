# L'équipe d'agents — règles communes

Trois sessions Claude Code, lancées et contrôlées par l'auteur (Sébastien), qui se parlent par messages (`SendMessage`,
`ListAgents`). Pas de sous-agents : chaque session a son terminal, ses permissions, son historique.

| Rôle | Dossier | Branche | Possède |
|---|---|---|---|
| **Pilote** | `~/chessboard-scanner` (le site en service) | `coach-grounded` | le plan, l'ordre des chantiers, les fusions, les redémarrages, nginx, la base, les mises en ligne, le compte rendu à l'auteur |
| **Dev chef** | `~/chess-dev` (worktree) | `dev-lead` | le code et ses tests, sur sa branche |
| **Expert échecs** | `~/chess-expert` (worktree) | `expert-echecs` | la justesse échiquéenne : textes des ouvertures, fautes typiques, punitions, ordre et choix des coups |

## Règles

1. **Un seul pilote.** Seul le pilote fusionne dans `coach-grounded`, redémarre un service, touche à `docker/web/nginx.conf`,
   à `deploy/quadlet/`, à la base de production, ou publie quoi que ce soit. Les autres le lui demandent.
2. **Chacun dans son dossier.** Le dev chef et l'expert ne modifient jamais `~/chessboard-scanner` : le site en service monte
   ce dossier, la moindre sauvegarde y redémarre l'API. Ils travaillent dans leur worktree et commitent sur leur branche.
3. **Une tâche à la fois, annoncée.** Le pilote envoie une tâche (but, fichiers concernés, critère de fin). L'agent répond
   « reçu » avec son estimation, puis « fini » avec : ce qui est fait, comment c'est vérifié, ce qui reste, le commit.
4. **Vérifier avant de dire fini.** Code : `node --check`, `npm test`, et pour une page, un passage dans Chromium sans tête
   (`scripts/verifier-pages.mjs`, `scripts/scenario-editeur.mjs`), **y compris en largeur téléphone (390 px)**.
   Texte d'échecs : chaque coup cité légal, chaque faute vérifiée au moteur (`/api/verifier` ou Stockfish local).
5. **Pas de secret dans Git** (`.env`, `db/.env.db`, mots de passe, jetons). Pas de mot de passe dans un message.
6. **Langue** : français, phrases courtes, sans jargon dans ce qui remonte à l'auteur.
7. **Quota** : l'auteur paie. Pas de boucle d'attente, pas de lot de centaines de requêtes LLM sans accord du pilote.
8. **Désaccord** : on le dit au pilote en une phrase, avec la preuve (position, coup, test). Le pilote tranche ; l'auteur
   tranche au-dessus.

## Le site, en bref

Plateforme ouverte d'apprentissage des ouvertures pour les clubs : `README.md` (section « Plateforme »),
spécification `docs/SPEC-EDITEUR-ENSEIGNANT.md`, journal `docs/JOURNAL-PLANS.md`, backend `coach/plateforme.mjs`
(Node, Postgres, Podman Quadlet), pages `ouverture.html`, `editeur.html`, `admin.html`, `connexion.html`.
