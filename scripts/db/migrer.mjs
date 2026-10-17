/** Applique les migrations db/migrations/*.sql pas encore enregistrées dans schema_migrations (chacune dans sa transaction).
 *   node scripts/db/migrer.mjs   (variables PG* dans l'environnement, cf. db/.env.db) */
import { readdirSync, readFileSync } from 'node:fs';
import { pool } from '../../coach/db.mjs';
const faites = new Set((await pool.query('select version from schema_migrations')).rows.map((r) => r.version));
for (const f of readdirSync('db/migrations').filter((x) => x.endsWith('.sql')).sort()) {
  const version = f.replace(/\.sql$/, '');
  if (faites.has(version)) continue;
  const sql = readFileSync(`db/migrations/${f}`, 'utf8'); const c = await pool.connect();
  try {
    if (/alter type .* add value/i.test(sql)) { await c.query(sql); await c.query('insert into schema_migrations (version) values ($1) on conflict do nothing', [version]); } // hors transaction
    else { await c.query('begin'); await c.query(sql); await c.query('insert into schema_migrations (version) values ($1) on conflict do nothing', [version]); await c.query('commit'); }
    console.error(`migration ${version} appliquée`);
  } catch (e) { try { await c.query('rollback'); } catch {} console.error(`migration ${version} : ${e.message}`); process.exit(1); }
  finally { c.release(); }
}
await pool.end(); console.error('migrations à jour');
