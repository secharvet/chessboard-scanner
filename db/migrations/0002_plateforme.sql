-- Plateforme d'apprentissage (16 octobre 2026) : arbre des ouvertures, explications versionnées, sessions, invitations.
alter table users add column if not exists club text;
alter table users add column if not exists email_verified_at timestamptz;
alter table users add column if not exists licence_acceptee_at timestamptz;

create table if not exists openings (
  id         text primary key,            -- 'francaise', 'italienne'
  nom        text not null,
  signature  text not null,               -- premiers coups caractéristiques, SAN anglais
  ordre      int  not null default 0
);

create table if not exists positions (
  id          bigserial primary key,
  opening_id  text   not null references openings(id),
  fen_key     text   not null,            -- FEN sans compteurs (4 champs)
  coups       text   not null,            -- ligne canonique, SAN anglais séparés par des espaces
  ply         int    not null,
  parent_id   bigint references positions(id),
  unique (opening_id, fen_key)
);
create index if not exists positions_coups on positions (opening_id, coups);

do $$ begin create type move_kind as enum ('principal', 'variante', 'faute', 'porte'); exception when duplicate_object then null; end $$;

create table if not exists moves (
  id                bigserial primary key,
  position_id       bigint    not null references positions(id) on delete cascade,
  san               text      not null,
  kind              move_kind not null,
  ord               int       not null default 0,
  to_position_id    bigint references positions(id),
  porte_opening_id  text   references openings(id),
  created_by        uuid   references users(id),
  created_at        timestamptz not null default now(),
  unique (position_id, san)
);

do $$ begin create type expl_status as enum ('brouillon', 'publie', 'archive'); exception when duplicate_object then null; end $$;

create table if not exists explanations (
  id            bigserial primary key,
  position_id   bigint      not null references positions(id) on delete cascade,
  author_id     uuid        not null references users(id),
  version       int         not null,
  status        expl_status not null default 'brouillon',
  based_on_id   bigint references explanations(id),
  content       jsonb       not null,
  engine_check  jsonb,
  video_url     text,
  created_at    timestamptz not null default now(),
  published_at  timestamptz,
  unique (position_id, author_id, version)
);
create unique index if not exists explanations_une_publiee on explanations (position_id, author_id) where status = 'publie';
create index if not exists explanations_position on explanations (position_id, status);

create table if not exists remarks (
  id              bigserial primary key,
  explanation_id  bigint not null references explanations(id) on delete cascade,
  author_id       uuid   not null references users(id),
  texte           text   not null,
  created_at      timestamptz not null default now()
);

create table if not exists reference (
  opening_id   text   not null references openings(id),
  position_id  bigint references positions(id),
  author_id    uuid   not null references users(id)
);
create unique index if not exists reference_unique on reference (opening_id, coalesce(position_id, 0));

create table if not exists sessions (
  id          text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  user_agent  text
);
create index if not exists sessions_user on sessions (user_id);

create table if not exists invitations (
  token       text primary key,
  email       text not null,
  role        user_role not null,
  club        text,
  invited_by  uuid references users(id),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  used_at     timestamptz
);

-- auteur système des brouillons générés
insert into users (id, email, password_hash, display_name, role)
  values ('00000000-0000-0000-0000-000000000001', 'ia@plateforme.local', '!', 'IA (brouillon)', 'enseignant')
  on conflict (email) do nothing;

insert into schema_migrations (version) values ('0002_plateforme') on conflict (version) do nothing;
