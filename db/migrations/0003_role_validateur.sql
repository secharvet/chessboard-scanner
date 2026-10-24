-- Rôle validateur (décision du 16 octobre) : seul, car ALTER TYPE ... ADD VALUE ne peut pas être utilisé dans la même transaction.
alter type user_role add value if not exists 'validateur';
insert into schema_migrations (version) values ('0003_role_validateur') on conflict (version) do nothing;
