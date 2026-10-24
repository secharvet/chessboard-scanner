#!/usr/bin/env node
/**
 * L'examinateur (docs/coach-joueur/CHANTIERS-2026-10-24.md, page 3) : Stockfish 19, un fil, profondeur 18, APRÈS la partie,
 * jamais pendant. Pour chaque coup du coach, l'évaluation avant et après de SON point de vue, et un verdict.
 *
 *   node scripts/joueur/examiner.mjs parties/<id>.json
 *
 * Verdict (règle écrite avant, jamais retouchée) : bévue = plus de 100 centipions perdus, SAUF
 *   - un mat conservé (mat en N devenu mat en N + k : l'issue ne change pas) ;
 *   - une position déjà décidée (au-delà de ± 500 avant ET après, même camp devant) : la perte est un « gâchis de
 *     conversion », comptée à part ;
 *   - un coup unique légal.
 * Faute = entre 50 et 100 perdus, notée à part. Taux publié par phase.
 *
 * Phase par le matériel (écrite ici et au doc) :
 *   - FINALE : plus de dame sur l'échiquier, OU matériel hors pions ≤ deux tours (10) par camp.
 *   - sinon OUVERTURE : au 10e coup ou avant, OU développement non fini (un camp a encore ≥ 2 mineures sur leur case de départ).
 *   - sinon MILIEU.
 *
 * Scores en centièmes de pion, du point de vue du coach ; un mat est encodé ± (100000 − N), N = demi-coups jusqu'au mat.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';

export const MATE_BASE = 100000;
const VALEUR = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Un score moteur ({type, value}, côté trait) ramené au point de vue du coach (`pov` = +1 si le trait est le coach, sinon −1). */
export function cpPourCoach(score, pov) {
  const v = score.type === 'mate' ? (score.value > 0 ? MATE_BASE - score.value : -MATE_BASE - score.value) : score.value;
  return pov * v;
}

const estMat = (v) => Math.abs(v) >= MATE_BASE - 1000;
const signe = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);

/**
 * Le verdict d'un coup du coach à partir des évaluations (point de vue du coach, centipions) avant et après, et du nombre
 * de coups légaux de la position de départ.
 * @returns {{ verdict: 'ok'|'faute'|'bevue'|'exclu', raison: string }}
 */
export function juger(avant, apres, legal) {
  const perte = avant - apres;
  if (legal <= 1) return { verdict: 'exclu', raison: 'coup unique' };
  if (estMat(avant) && estMat(apres) && signe(avant) === signe(apres)) return { verdict: 'exclu', raison: 'mat conservé' };
  if (Math.abs(avant) > 500 && Math.abs(apres) > 500 && signe(avant) === signe(apres) && perte > 100) return { verdict: 'exclu', raison: 'gâchis de conversion' };
  if (perte > 100) return { verdict: 'bevue', raison: `${perte} perdus` };
  if (perte > 50) return { verdict: 'faute', raison: `${perte} perdus` };
  return { verdict: 'ok', raison: '' };
}

/** La phase de la position (voir l'en-tête). `chess` = un Chess sur cette position. */
export function phaseDe(chess) {
  let dames = 0, horsPionsB = 0, horsPionsN = 0;
  for (const rangee of chess.board()) for (const p of rangee) {
    if (!p) continue;
    if (p.type === 'q') dames++;
    if (p.type !== 'p' && p.type !== 'k') { if (p.color === 'w') horsPionsB += VALEUR[p.type]; else horsPionsN += VALEUR[p.type]; }
  }
  if (dames === 0 || (horsPionsB <= 10 && horsPionsN <= 10)) return 'finale';
  const surCase = (cases, couleur) => cases.filter((s) => { const p = chess.get(s); return p && p.color === couleur && (p.type === 'n' || p.type === 'b'); }).length;
  const devNonFini = surCase(['b1', 'g1', 'c1', 'f1'], 'w') >= 2 || surCase(['b8', 'g8', 'c8', 'f8'], 'b') >= 2;
  if (chess.moveNumber() <= 10 || devNonFini) return 'ouverture';
  return 'milieu';
}

/** L'évaluation d'une position du point de vue de `camp` (centipions, mat encodé). Positions finies : évaluées sans moteur. */
export async function evaluer(engine, fen, camp, depth = 18) {
  const chess = new Chess(fen);
  if (chess.isCheckmate()) return chess.turn() === camp ? -MATE_BASE : MATE_BASE; // le trait est maté
  if (chess.isGameOver()) return 0; // pat, nulle
  const [ligne] = await engine.analyze(fen, { depth, multipv: 1 });
  if (!ligne) throw new Error(`le moteur n'a rien rendu sur ${fen}`);
  return cpPourCoach(ligne.score, chess.turn() === camp ? 1 : -1);
}

/** Examine une partie (objet du contrat) : remplit `coup.examen` par coup du coach et l'en-tête `partie.examen`. */
export async function examiner(engine, partie, depth = 18) {
  const camp = partie.coach.camp;
  const phases = { ouverture: { coups: 0, bevues: 0, fautes: 0, exclus: 0 }, milieu: { coups: 0, bevues: 0, fautes: 0, exclus: 0 }, finale: { coups: 0, bevues: 0, fautes: 0, exclus: 0 } };
  let bevues = 0, fautes = 0, exclus = 0, gachis = 0, nCoach = 0;
  for (const coup of partie.coups) {
    if (!coup.coach) continue;
    nCoach++;
    const chessAvant = new Chess(coup.fenAvant);
    const legal = chessAvant.moves().length;
    const avant = await evaluer(engine, coup.fenAvant, camp, depth);
    const apres2 = new Chess(coup.fenAvant);
    apres2.move({ from: coup.uci.slice(0, 2), to: coup.uci.slice(2, 4), promotion: coup.uci[4] || undefined });
    const apres = await evaluer(engine, apres2.fen(), camp, depth);
    const { verdict, raison } = juger(avant, apres, legal);
    const phase = phaseDe(chessAvant);
    coup.examen = { avant, apres, perte: avant - apres, verdict, raison, phase };
    const ph = phases[phase]; ph.coups++;
    if (verdict === 'bevue') { bevues++; ph.bevues++; }
    else if (verdict === 'faute') { fautes++; ph.fautes++; }
    else if (verdict === 'exclu') { exclus++; ph.exclus++; if (raison === 'gâchis de conversion') gachis++; }
  }
  partie.examen = {
    moteur: engine.name, profondeur: depth, coups: nCoach,
    bevues, fautes, exclus, gachis,
    tauxBevues: nCoach ? bevues / nCoach : null,
    parPhase: phases,
    note: 'scores en centièmes de pion, du point de vue du coach ; mat encodé ± (100000 − N)',
  };
  return partie;
}

/* ------------------------------------------------------------------ CLI ------------------------------------------------------------------ */

async function main() {
  const chemin = process.argv[2];
  if (!chemin) { console.error('usage : node scripts/joueur/examiner.mjs parties/<id>.json'); process.exit(2); }
  process.env.COACH_DETERMINISTIC = '1'; // un fil, table vidée avant chaque recherche (mesure reproductible)
  const { UciEngine } = await import('../../coach/uci-engine.mjs');
  const engine = new UciEngine({ path: process.env.STOCKFISH_PATH ?? '/usr/local/bin/stockfish', threads: 1 });
  await engine.start();
  if (!/^Stockfish 1[9-9]|^Stockfish [2-9]/.test(engine.name ?? '')) console.error(`[examinateur] attention : moteur « ${engine.name} » (on attend Stockfish 19)`);

  const partie = JSON.parse(readFileSync(chemin, 'utf8'));
  console.error(`examen : ${partie.id} — ${partie.coups.filter((c) => c.coach).length} coups du coach, ${engine.name}, prof. 18…`);
  await examiner(engine, partie);
  engine.stop();

  writeFileSync(chemin, JSON.stringify(partie, null, 1));
  const e = partie.examen;
  const pc = (n) => (e.coups ? `${((100 * n) / e.coups).toFixed(1).replace('.', ',')} %` : '—');
  console.error(`  bévues ${e.bevues} (${pc(e.bevues)}), fautes ${e.fautes} (${pc(e.fautes)}), exclus ${e.exclus} (dont gâchis ${e.gachis})`);
  for (const [nom, ph] of Object.entries(e.parPhase)) if (ph.coups) console.error(`  ${nom} : ${ph.coups} coups, ${ph.bevues} bévues, ${ph.fautes} fautes`);
  console.error(`  écrit : ${chemin}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((err) => { console.error(err); process.exit(1); });
