-- Schéma initial (9 octobre 2026) : juste de quoi prouver la chaîne API ↔ Postgres et préparer les comptes.
-- Le schéma des textes d'ouverture versionnés par enseignant n'est PAS fait ici : à discuter et écrire à part.

create extension if not exists pgcrypto;  -- gen_random_uuid()

create table if not exists schema_migrations (
  version     text primary key,
  applied_at  timestamptz not null default now()
);

create type user_role as enum ('apprenant', 'enseignant', 'admin');

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,
  display_name  text not null,
  role          user_role not null default 'apprenant',
  created_at    timestamptz not null default now()
);

insert into schema_migrations (version) values ('0001_init')
  on conflict (version) do nothing;
