/**
 * Recalcule les étiquettes de plans humains avec la version COURANTE des règles (coach/plan-concepts.mjs), sans
 * moteur : chaque enregistrement garde les 24 demi-coups joués (`played`). Sert après une correction de définition
 * (1er octobre : un échec n'est pas un coup de plan ; « affaiblir » par échange lié à la colonne de la reprise).
 *
 * Pour chaque plan : inchangé (on garde évaluations et jugement), supprimé (la nouvelle règle ne le voit plus),
 * déplacé (apparition à un autre demi-coup : trajectoire et jugement périmés, marqué `stale`), ou nouveau (`stale`).
 *
 *   node scripts/rescan-labels.mjs data/labels/human-2013-01.s0.jsonl [--out <fichier>.v2.jsonl]
 * Écrit aussi <sortie>.stats.json et la marque « TERMINÉ » sur la sortie standard.
 */

import { createReadStream, writeFileSync, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { scanLine, quietReason } from '../coach/plan-concepts.mjs';

const args = process.argv.slice(2);
const IN = args[0];
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : IN.replace(/\.jsonl$/, '.v2.jsonl');
// Tranche d'enregistrements [--skip, --skip + --limit) : pour répartir un même fichier sur plusieurs processus ou
// machines (1er octobre : reprise du recalcul 2016 en quinze morceaux, DENEB et VPS).
const SKIP = Number(args.includes('--skip') ? args[args.indexOf('--skip') + 1] : 0);
const LIMIT = Number(args.includes('--limit') ? args[args.indexOf('--limit') + 1] : Infinity);
let index = -1;
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer', 'attaque_minorite', 'baionnette'];
const stats = { records: 0, kept: 0, removed: 0, moved: 0, added: 0, byConcept: {} };
const bump = (c, k) => { stats[k]++; (stats.byConcept[c] ??= { kept: 0, removed: 0, moved: 0, added: 0 })[k]++; };
const out = createWriteStream(OUT);
const t0 = Date.now();

for await (const line of createInterface({ input: createReadStream(IN), crlfDelay: Infinity })) {
  if (!line) continue;
  index++;
  if (index < SKIP) continue;
  if (index >= SKIP + LIMIT) break;
  const r = JSON.parse(line);
  stats.records++;
  const scan = scanLine(r.fen, r.played, r.played.length);
  const fresh = [];
  for (const c of CONCEPTS) for (const side of ['w', 'b']) {
    const p = scan[`${c}_${side}`];
    if (p >= 0) fresh.push({ concept: c, side, appear: p });
  }
  const plans = [];
  for (const old of r.plans) {
    const now = fresh.find((f) => f.concept === old.concept && f.side === old.side);
    if (!now) { bump(old.concept, 'removed'); continue; }
    if (now.appear === old.appear) { bump(old.concept, 'kept'); plans.push(old); continue; }
    bump(old.concept, 'moved');
    const q = quietReason(r.fen, r.played, now.appear, now.concept);
    plans.push({ concept: now.concept, side: now.side, appear: now.appear, quiet: q === null, quietReason: q, stale: true, oldAppear: old.appear });
  }
  for (const f of fresh) {
    if (r.plans.some((o) => o.concept === f.concept && o.side === f.side)) continue;
    bump(f.concept, 'added');
    const q = quietReason(r.fen, r.played, f.appear, f.concept);
    plans.push({ ...f, quiet: q === null, quietReason: q, stale: true });
  }
  out.write(`${JSON.stringify({ ...r, plans, rules: '2026-10-01' })}\n`);
  if (stats.records % 20000 === 0) console.log(`${stats.records} enregistrements, ${Math.round((Date.now() - t0) / 1000)} s`);
}
out.end();
writeFileSync(`${OUT}.stats.json`, JSON.stringify(stats, null, 1));
console.log(JSON.stringify(stats));
console.log('TERMINÉ');
