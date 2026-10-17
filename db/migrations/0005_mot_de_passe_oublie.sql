-- Récupération du mot de passe par courriel : jeton signé, à usage unique, expire au bout d'une heure (17 oct. 2026).
-- Table minimale : la vérification se fait par `token` (long et aléatoire), on connaît le `user_id` à la création.
create table if not exists password_reset (
  token text primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  ip inet
);
create index if not exists password_reset_user on password_reset (user_id);
