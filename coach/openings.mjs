/**
 * Reconnaissance de l'ouverture d'une partie à partir de ses coups, avec la liste publique
 * lichess-org/chess-openings (domaine public) : correspondance du plus long préfixe de coups.
 * Données : data/openings/{a..e}.tsv (scripts/fetch-openings.sh).
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../data/openings/', import.meta.url));
let table = null;

function load() {
  if (table) return table;
  table = new Map();
  for (const x of ['a', 'b', 'c', 'd', 'e']) {
    const f = `${DIR}${x}.tsv`;
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, 'utf8').split('\n').slice(1)) {
      const [eco, name, pgn] = line.split('\t');
      if (!pgn) continue;
      const key = pgn.replace(/\d+\.\s*/g, '').trim().split(/\s+/).join(' ');
      if (!table.has(key)) table.set(key, { eco, name });
    }
  }
  return table;
}

/**
 * @param {string[]} sans  coups de la partie (notation anglaise)
 * @returns {{ eco: string, name: string, plies: number } | null}
 */
export function identifyOpening(sans) {
  const t = load();
  if (!t.size) return null;
  for (let n = Math.min(sans.length, 30); n > 0; n--) {
    const hit = t.get(sans.slice(0, n).join(' '));
    if (hit) return { ...hit, plies: n };
  }
  return null;
}
