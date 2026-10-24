/**
 * Connexion Postgres (9 octobre 2026). Le client `pg` lit seul PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT
 * (passés au conteneur par db/.env.db) : aucune configuration à donner ici.
 */
import pg from 'pg';
// bigint (bigserial) → Number : nos identifiants restent très en dessous de 2^53, et le JSON vers le navigateur reste numérique
pg.types.setTypeParser(20, (v) => Number(v));
export const pool = new pg.Pool({ max: 5 });
