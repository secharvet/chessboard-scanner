/** Banc de cent milieux (2 octobre 2026) : les 40 positions du banc + 60 positions de parties de test, tous niveaux. */
import { readFileSync } from 'node:fs';
import { EVAL_POSITIONS as MILIEUX } from './eval-positions-milieux.mjs';
const reelles = JSON.parse(readFileSync(new URL('../reports/banc-reel-60.json', import.meta.url), 'utf8'));
export const EVAL_POSITIONS = [...MILIEUX, ...reelles.map((p) => ({ ...p, concept: 'reel', themes: [] }))];
