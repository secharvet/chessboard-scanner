/**
 * Connexion Postgres (9 octobre 2026). Le client `pg` lit seul PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT
 * (passés au conteneur par db/.env.db) : aucune configuration à donner ici.
 */
import pg from 'pg';
export const pool = new pg.Pool({ max: 5 });
