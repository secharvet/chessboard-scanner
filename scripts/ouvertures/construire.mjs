/** Assemble le livre servi par le site : base (coach/openings/<nom>.mjs) + prolongements (data/ouvertures/<nom>-ext.json).
 *   node scripts/ouvertures/construire.mjs francaise   → livres/francaise.js */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const nom = process.argv[2] ?? 'francaise';
const { LIVRE, OUVERTURE } = await import(`../../coach/openings/${nom}.mjs`);
const extPath = `data/ouvertures/${nom}-ext.json`;
const ext = existsSync(extPath) ? JSON.parse(readFileSync(extPath, 'utf8')).filter((e) => e.plan?.length) : [];
const base = LIVRE.map((e) => ({ ...e, auteur: e.auteur ?? 'livre du 6 octobre 2026 (IA, vérifié au moteur), à relire' }));
const vus = new Set(base.map((e) => e.coups)); const ajout = ext.filter((e) => !vus.has(e.coups));
const src = `// Généré par scripts/ouvertures/construire.mjs : ${base.length} positions du livre + ${ajout.length} prolongements. Ne pas éditer à la main.
export const OUVERTURE = ${JSON.stringify(OUVERTURE)};
export const LIVRE = ${JSON.stringify([...base, ...ajout], null, 1)};
export function positionsDuLivre(Chess) {
  const out = new Map();
  for (const e of LIVRE) { const c = new Chess(); for (const san of e.coups.split(' ')) c.move(san); out.set(c.fen().split(' ').slice(0, 4).join(' '), e); }
  return out;
}
`;
writeFileSync(`livres/${nom}.js`, src); console.error(`livres/${nom}.js : ${base.length} + ${ajout.length} positions`);
