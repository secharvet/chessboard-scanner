/**
 * Mots de l'étage STRATÉGIE (1er octobre 2026, décision de l'auteur : « gravir chaque étage d'abstraction »).
 *
 * Un mot de stratégie n'est pas un coup : c'est une ORIENTATION que plusieurs coups d'un même camp dessinent sur
 * une fenêtre (12 demi-coups par défaut). Chaque mot est un agrégat de moyens (coach/atoms.mjs), de coups et de
 * faits, vérifiable : on garde les coups qui le prouvent (`preuves`).
 *   attaque_aile_roi    au moins 3 de mes coups vers la zone du roi adverse (pièces à distance ≤ 2 du roi, poussées de
 *                       pion sur son aile, menaces ou pressions sur une pièce de sa zone)
 *   attaque_aile_dame   au moins 3 de mes coups sur l'aile dame (colonnes a-c) alors que le roi adverse n'y est pas
 *   jeu_au_centre       au moins 3 coups centraux (case d'arrivée dans c3-f6, levier sur c-f, centralisation)
 *   consolidation       au moins 3 moyens défensifs (soutien, restriction, regroupement, fermeture, pièce sauvée ou
 *                       protégée) et pas plus d'un moyen offensif
 *   simplification      au moins 2 échanges que j'engage alors que j'ai l'avantage matériel
 *   course_roques_opposes  roques opposés, et au moins 2 poussées de pion sur l'aile du roi adverse
 *   poussee_pion_passe  j'ai un pion passé et je le pousse au moins 2 fois
 * Un camp peut porter plusieurs mots sur la même fenêtre ; `dominant` est celui qui a le plus de preuves.
 */

import { Chess } from 'chess.js';
import { detectAtoms } from './atoms.mjs';
import { buildAllFacts } from '../positional/index.js';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const fileOf = (sq) => sq.charCodeAt(0) - 97;
const rankOf = (sq) => Number(sq[1]);
const dist = (a, b) => Math.max(Math.abs(fileOf(a) - fileOf(b)), Math.abs(rankOf(a) - rankOf(b)));
const central = (sq) => fileOf(sq) >= 2 && fileOf(sq) <= 5 && rankOf(sq) >= 3 && rankOf(sq) <= 6;
const wingOf = (sq) => (fileOf(sq) <= 2 ? 'dame' : fileOf(sq) >= 5 ? 'roi' : 'centre');
const material = (c, color) => c.board().flat().reduce((s, p) => s + (p && p.type !== 'k' ? (p.color === color ? 1 : -1) * VALUE[p.type] : 0), 0);
const MIN = { attaque_aile_roi: 3, attaque_aile_dame: 3, jeu_au_centre: 2, consolidation: 3, simplification: 2, course_roques_opposes: 2, poussee_pion_passe: 2 };
const DEFENSIVE = new Set(['soutien', 'restriction', 'regroupement', 'fermeture']);
const OFFENSIVE = new Set(['menace', 'pression', 'levier', 'espace', 'septieme']);

/**
 * @param {string} fen
 * @param {string[]} pv  coups UCI joués
 * @param {{ plies?: number }} [opts]
 * @returns {{ w: Word[], b: Word[], dominant: { w: string|null, b: string|null } }}
 * @typedef {{ kind: string, side: 'w'|'b', preuves: string[], n: number }} Word
 */
export function detectStrategy(fen, pv, { plies = 12 } = {}) {
  const { atoms, moves, boards } = detectAtoms(fen, pv.slice(0, plies), plies);
  const start = new Chess(fen);
  const facts0 = buildAllFacts(fen);
  const out = { w: [], b: [] };
  for (const side of ['w', 'b']) {
    const opp = side === 'w' ? 'b' : 'w';
    const kingAt = (c, color) => c.board().flat().find((p) => p && p.type === 'k' && p.color === color)?.square;
    const myMoves = moves.map((m, i) => [m, i]).filter(([m]) => m.color === side);
    const atomAt = (i) => atoms.filter((a) => a.side === side && a.ply === i);
    const ev = { attaque_aile_roi: [], attaque_aile_dame: [], jeu_au_centre: [], consolidation: [], simplification: [], course_roques_opposes: [], poussee_pion_passe: [] };
    let offensive = 0;
    const matStart = material(start, side);
    const opposite = facts0.some((t) => t.id === 'ROQUES_OPPOSES');
    for (const [m, i] of myMoves) {
      const before = i === 0 ? start : boards[i - 1];
      const ek = kingAt(before, opp);
      const kinds = atomAt(i).map((a) => a.kind);
      const san = m.san;
      const relRank = side === 'w' ? rankOf(m.to) : 9 - rankOf(m.to);
      // Attaque à l'aile roi : vers la zone du roi adverse.
      if (ek) {
        // Une pièce qui s'installe dans la zone du roi adverse, DANS SON CAMP (pas un développement près d'un roi resté au centre).
        const toward = m.piece !== 'p' && m.piece !== 'k' && dist(m.to, ek) <= 2 && relRank >= 5;
        const pawnOnWing = m.piece === 'p' && wingOf(m.to) === wingOf(ek) && wingOf(ek) !== 'centre' && Math.abs(fileOf(m.to) - fileOf(ek)) <= 2;
        const hitsZone = atomAt(i).some((a) => (a.kind === 'menace' || a.kind === 'pression') && a.cible && dist(a.cible, ek) <= 2);
        if (toward || pawnOnWing || hitsZone) ev.attaque_aile_roi.push(san);
        if (opposite && m.piece === 'p' && wingOf(ek) !== 'centre' && wingOf(m.to) === wingOf(ek)) ev.course_roques_opposes.push(san);
        // Aile dame : coups sur a-c quand le roi adverse n'y est pas.
        if (wingOf(ek) !== 'dame' && fileOf(m.to) <= 2 && (m.piece === 'p' || kinds.some((k) => OFFENSIVE.has(k)) || m.piece === 'r')) ev.attaque_aile_dame.push(san);
      }
      // Centre.
      // Centre : des PIONS sur d/e, des leviers sur c-f, des manœuvres qui s'installent au centre ; pas n'importe quelle
      // pièce qui passe par là (essai sur 300 fenêtres : 34 % des camps « jouaient au centre »).
      const centralPawn = m.piece === 'p' && fileOf(m.to) >= 2 && fileOf(m.to) <= 5 && relRank >= 4 && !m.captured;
      const centralLever = kinds.includes('levier') && fileOf(m.to) >= 2 && fileOf(m.to) <= 5;
      const centralManoeuvre = atomAt(i).some((a) => (a.kind === 'manoeuvre' || a.kind === 'espace') && central(a.to ?? a.square ?? m.to));
      if (centralPawn || centralLever || centralManoeuvre) ev.jeu_au_centre.push(san);
      // Consolidation.
      if (kinds.some((k) => DEFENSIVE.has(k))) ev.consolidation.push(san);
      if (kinds.some((k) => OFFENSIVE.has(k))) offensive++;
      // Simplification : j'engage un échange en ayant l'avantage matériel.
      if (kinds.includes('echange') && matStart >= 1) ev.simplification.push(san);
      // Pion passé poussé.
      if (m.piece === 'p' && buildAllFacts(before.fen()).some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === side && t.params.square === m.from)) ev.poussee_pion_passe.push(san);
    }
    if (offensive > 1) ev.consolidation = [];
    for (const [kind, preuves] of Object.entries(ev)) {
      if (preuves.length >= MIN[kind]) out[side].push({ kind, side, preuves, n: preuves.length });
    }
    out[side].sort((a, b) => b.n - a.n);
  }
  return { ...out, dominant: { w: out.w[0]?.kind ?? null, b: out.b[0]?.kind ?? null } };
}
