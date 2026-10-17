/**
 * Importe les livres statiques (livres/<id>.js + punitions) dans la base : ouvertures, positions, coups proposés,
 * et une explication publiée de l'auteur « IA (brouillon) » par position (les punitions deviennent des séquences).
 * Rejouable : les positions/coups existants sont conservés, les explications IA déjà présentes ne sont pas dupliquées.
 *   podman exec chess-api node scripts/db/importer-livres.mjs
 */
import { Chess } from 'chess.js';
import { pool } from '../../coach/db.mjs';
import { LIVRES } from '../../livres/index.js';
const IA = '00000000-0000-0000-0000-000000000001';
const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');
const c0 = await pool.connect();
try {
  for (const L of LIVRES) {
    const { LIVRE, OUVERTURE } = await import('../../livres/' + L.module.replace('./livres/', ''));
    const { PUNITIONS } = await import('../../livres/' + L.punitions.replace('./livres/', '')).catch(() => ({ PUNITIONS: {} }));
    await c0.query('insert into openings (id, nom, signature, ordre) values ($1,$2,$3,$4) on conflict (id) do update set nom = excluded.nom, signature = excluded.signature', [L.id, OUVERTURE, L.signature, LIVRES.indexOf(L)]);
    // 1. positions (y compris la racine vide, pour accrocher le premier coup)
    const posId = new Map(); // coups -> id
    const upsertPos = async (coups) => {
      if (posId.has(coups)) return posId.get(coups);
      const c = new Chess(); const list = coups ? coups.split(' ') : []; for (const s of list) c.move(s);
      const parent = list.length ? await upsertPos(list.slice(0, -1).join(' ')) : null;
      const r = await c0.query(`insert into positions (opening_id, fen_key, coups, ply, parent_id) values ($1,$2,$3,$4,$5)
        on conflict (opening_id, fen_key) do update set coups = case when length(positions.coups) <= length(excluded.coups) then positions.coups else excluded.coups end returning id`, [L.id, cle(c), coups, list.length, parent]);
      posId.set(coups, r.rows[0].id); return r.rows[0].id;
    };
    const entries = [...LIVRE].sort((a, b) => a.coups.split(' ').length - b.coups.split(' ').length);
    for (const e of entries) await upsertPos(e.coups);
    // 2. coups proposés + explications IA
    let nMoves = 0, nExpl = 0;
    for (const e of entries) {
      const pid = posId.get(e.coups); const coupsContent = [];
      const ajouter = async (san, kind, ord, porte) => {
        const c = new Chess(); for (const s of e.coups.split(' ')) c.move(s); let m; try { m = c.move(san); } catch { return null; }
        const to = porte ? null : (posId.get(`${e.coups} ${san}`.trim()) ?? (await c0.query('select id from positions where opening_id=$1 and fen_key=$2', [L.id, cle(c)])).rows[0]?.id ?? null);
        const r = await c0.query(`insert into moves (position_id, san, kind, ord, to_position_id, porte_opening_id, created_by) values ($1,$2,$3,$4,$5,$6,$7)
          on conflict (position_id, san) do update set ord = excluded.ord returning id`, [pid, m.san, kind, ord, to, porte ?? null, IA]);
        nMoves++; return r.rows[0].id;
      };
      let ord = 0;
      for (const [i, p] of (e.plan ?? []).entries()) {
        const id = await ajouter(p.san, p.porte ? 'porte' : (i === 0 ? 'principal' : 'variante'), ord++, p.porte && LIVRES.some((x) => x.id === p.porte) ? p.porte : null);
        if (id) coupsContent.push({ move_id: id, pourquoi: p.pourquoi ?? '', annotations: [] });
      }
      for (const x of e.erreurs ?? []) {
        const id = await ajouter(x.san, 'faute', ord++, null); if (!id) continue;
        const pun = PUNITIONS[`${e.coups} ${x.san}`];
        coupsContent.push({ move_id: id, pourquoi: x.pourquoi ?? '', annotations: [], sequence: pun ? { pas: pun.ligne.map((san) => ({ san, phrase: '', annotations: [] })), eval: { avant: pun.evalAvant, apres: pun.evalApres, perte: pun.perte, mat: pun.mat }, origine: 'moteur' } : undefined });
      }
      const deja = await c0.query('select id from explanations where position_id=$1 and author_id=$2 and status=$3', [pid, IA, 'publie']);
      if (deja.rows.length) continue;
      const content = { nom: e.nom ?? null, sens: e.sens ?? '', menace: e.menace ?? null, schema: e.schema ?? null, annotations: [], coups: coupsContent, origine: e.auteur ?? 'brouillon IA' };
      await c0.query(`insert into explanations (position_id, author_id, version, status, content, published_at) values ($1,$2,1,'publie',$3, now())`, [pid, IA, JSON.stringify(content)]); nExpl++;
    }
    // référence par défaut : l'IA, tant qu'aucun professeur n'est désigné
    await c0.query('insert into reference (opening_id, position_id, author_id) values ($1, null, $2) on conflict do nothing', [L.id, IA]);
    console.error(`${L.id} : ${posId.size} positions, ${nMoves} coups, ${nExpl} explications IA`);
  }
} finally { c0.release(); await pool.end(); }
