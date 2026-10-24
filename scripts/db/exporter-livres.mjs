/**
 * Exporte la base vers les fichiers statiques livres/<id>.js (repli hors ligne de l'assistant, et sauvegarde lisible).
 * Pour chaque position : les coups proposés de l'arbre et le texte de l'auteur de référence (sinon de l'IA).
 *   podman exec chess-api node scripts/db/exporter-livres.mjs
 */
import { writeFileSync } from 'node:fs';
import { pool } from '../../coach/db.mjs';
const { rows: livres } = await pool.query('select * from openings order by ordre');
for (const L of livres) {
  const { rows: ref } = await pool.query('select author_id from reference where opening_id = $1 and position_id is null', [L.id]);
  const auteur = ref[0]?.author_id ?? '00000000-0000-0000-0000-000000000001';
  const { rows } = await pool.query(`select p.coups, p.id,
      (select json_agg(json_build_object('id', m.id, 'san', m.san, 'kind', m.kind, 'ord', m.ord, 'porte', m.porte_opening_id) order by m.ord, m.id) from moves m where m.position_id = p.id) as coups_arbre,
      (select e.content from explanations e where e.position_id = p.id and e.status = 'publie' and e.author_id = $2 limit 1) as texte,
      (select u.display_name from explanations e join users u on u.id = e.author_id where e.position_id = p.id and e.status = 'publie' and e.author_id = $2 limit 1) as auteur
    from positions p where p.opening_id = $1 and p.ply > 0 order by p.ply, p.coups`, [L.id, auteur]);
  const LIVRE = [];
  for (const r of rows) {
    const t = r.texte ?? {}; const parId = new Map((t.coups ?? []).map((c) => [Number(c.move_id), c]));
    const plan = []; const erreurs = [];
    for (const m of r.coups_arbre ?? []) {
      const c = parId.get(Number(m.id)); const item = { san: m.san, pourquoi: c?.pourquoi ?? '' };
      if (m.porte) item.porte = m.porte;
      if (m.kind === 'faute') erreurs.push(item); else plan.push(item);
    }
    LIVRE.push({ coups: r.coups, nom: t.nom ?? undefined, sens: t.sens ?? '', menace: t.menace ?? undefined, plan, erreurs: erreurs.length ? erreurs : undefined, schema: t.schema ?? undefined, auteur: r.auteur ?? undefined });
  }
  const src = `// Exporté de la base par scripts/db/exporter-livres.mjs le ${new Date().toISOString().slice(0, 10)} : ${LIVRE.length} positions, auteur de référence. Ne pas éditer à la main.
export const OUVERTURE = ${JSON.stringify(L.nom)};
export const LIVRE = ${JSON.stringify(LIVRE, null, 1)};
export function positionsDuLivre(Chess) {
  const out = new Map();
  for (const e of LIVRE) { const c = new Chess(); for (const san of e.coups.split(' ')) c.move(san); out.set(c.fen().split(' ').slice(0, 4).join(' '), e); }
  return out;
}
`;
  writeFileSync(`livres/${L.id}.js`, src); console.error(`livres/${L.id}.js : ${LIVRE.length} positions (auteur ${auteur.slice(0, 8)})`);
}
await pool.end();
