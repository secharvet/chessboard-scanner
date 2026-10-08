/**
 * Punitions des fautes typiques d'un livre d'ouverture (8 octobre 2026) : pour chaque position du livre qui liste des
 * `erreurs`, on joue la faute et on demande au moteur la meilleure suite (6 demi-coups), avec l'évaluation avant la faute et
 * au bout de la punition. Sortie : un module servi par le site, `livres/<nom>-punitions.js`.
 *   node scripts/ouvertures/punitions.mjs coach/openings/francaise.mjs livres/francaise-punitions.js [--depth 18]
 */
import { writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
const [IN, OUT] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DEPTH = Number(process.argv.includes('--depth') ? process.argv[process.argv.indexOf('--depth') + 1] : 18);
const { LIVRE } = await import('../../' + IN);
const engine = new UciEngine({ threads: 2, hashMb: 128 }); await engine.start();
const cp = (s, pov) => (s.type === 'mate' ? (s.value > 0 ? 10000 : -10000) : s.value) * pov;
const out = {}; let n = 0;
for (const e of LIVRE) {
  for (const err of e.erreurs ?? []) {
    const c = new Chess(); for (const s of e.coups.split(' ')) c.move(s);
    const fautif = c.turn(); // camp qui commet la faute
    const [avant] = await engine.analyze(c.fen(), { depth: DEPTH, multipv: 1 });
    let m; try { m = c.move(err.san); } catch { console.error(`faute illisible : ${e.coups} ${err.san}`); continue; }
    const [best] = await engine.analyze(c.fen(), { depth: DEPTH, multipv: 1 });
    const ligne = []; const t = new Chess(c.fen());
    for (const u of best.pv.slice(0, 6)) { const mv = t.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); if (!mv) break; ligne.push(mv.san); }
    const [fin] = t.isGameOver() ? [] : await engine.analyze(t.fen(), { depth: Math.max(10, DEPTH - 6), multipv: 1 });
    // évaluations du point de vue du FAUTIF : avant la faute, après la punition (mat ou partie finie : on prend la ligne du moteur)
    const evalAvant = avant ? cp(avant.score, 1) : 0; const evalApres = fin ? cp(fin.score, t.turn() === fautif ? 1 : -1) : (t.isCheckmate() ? (t.turn() === fautif ? -10000 : 10000) : cp(best.score, -1));
    out[`${e.coups} ${err.san}`] = { coups: e.coups, faute: m.san, fautif, ligne, evalAvant, evalApres, perte: evalAvant - evalApres, mat: best.score.type === 'mate' };
    console.error(`${e.coups} ${m.san} → ${ligne.join(' ')} (${evalAvant} → ${evalApres}, perte ${evalAvant - evalApres})`); n++;
  }
}
engine.stop();
writeFileSync(OUT, `// Généré par scripts/ouvertures/punitions.mjs (Stockfish, profondeur ${DEPTH}) le ${new Date().toISOString().slice(0, 10)}. Ne pas éditer à la main.\nexport const PUNITIONS = ${JSON.stringify(out, null, 1)};\n`);
console.error(`TERMINÉ ${n} punitions → ${OUT}`);
