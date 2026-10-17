-- Code ECO et nom officiel de la variante, par position (objectif, indépendant de l'auteur du texte).
-- Renseignés par scripts/db/nommer-eco.mjs à partir du référentiel public db/eco/*.tsv (lichess-org/chess-openings, CC0).
alter table positions add column if not exists eco text;
alter table positions add column if not exists nom_eco text;
