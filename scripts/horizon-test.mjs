/**
 * Test de rupture n°1 — l'horizon (docs/PLANS-ET-CONCEPTS.md, §6 bis). Des positions fermées ou
 * structurelles classiques, dont le plan est connu des manuels : le concept attendu apparaît-il dans la
 * meilleure suite de Stockfish à 24 demi-coups au plus (réglage du générateur ; les suites de Stockfish à profondeur 16 font en pratique 17 demi-coups en médiane) ? Sinon, à 48 demi-coups en
 * prolongeant la suite (Stockfish relancé depuis la dernière position) ?
 *
 *   node scripts/horizon-test.mjs [--depth 16]
 *
 * Échec du test : les plans attendus manquent à 24 demi-coups ET à 48. Réussite partielle : ils n'apparaissent
 * qu'à 48 (il faut prolonger les suites dans le générateur).
 */

import { Chess } from 'chess.js';
import { scanLine } from '../coach/plan-concepts.mjs';
import { toFrenchSan } from '../coach/notation.mjs';
import { UciEngine } from '../coach/uci-engine.mjs';
import { extendPv } from '../coach/extend-line.mjs';

const args = process.argv.slice(2);
const DEPTH = Number(args.includes('--depth') ? args[args.indexOf('--depth') + 1] : 16);

// Positions construites par les coups (plus sûr qu'un FEN tapé à la main), et plan attendu selon les manuels.
const CASES = [
  { name: 'Est-Indienne, Mar del Plata', moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Nd3',
    expect: ['rupture_b'], plan: 'Noirs : rupture f5 puis charge à l\'aile roi (f4, g5-g4) ; Blancs : rupture c5 à l\'aile dame' },
  { name: 'Est-Indienne, Mar del Plata (Blancs)', moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Nd3 f5',
    expect: ['rupture_w'], plan: 'Blancs : c5 (levier contre d6) pour ouvrir la colonne c' },
  { name: 'Française avance', moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 c4',
    expect: ['rupture_b'], plan: 'Noirs : rupture f6 contre la pointe e5 (la chaîne est bloquée à l\'aile dame)' },
  { name: 'Carlsbad, attaque de minorité', moves: 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 Be7 e3 c6 Bd3 Nbd7 Qc2 O-O Nf3 Re8 O-O Nf8 Rab1 Ng6',
    expect: ['rupture_w', 'affaiblir_w'], plan: 'Blancs : b4-b5 puis bxc6, pion c6 ou d5 faible, colonne c ouverte' },
  { name: 'Sicilienne Pelikan, case d5', moves: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6',
    expect: ['cavalier_avant_poste_w'], plan: 'Blancs : cavalier installé en d5, case trouée par les pions noirs' },
  { name: 'Tarrasch, pion isolé d5', moves: 'd4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O',
    expect: ['blocage_w'], plan: 'Blancs : bloquer le pion isolé d5 par une pièce en d4' },
  { name: 'Slave, variante d\'échange', moves: 'd4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 Nf3 Nc6 Bf4 Bf5 e3 e6 Bd3 Bxd3 Qxd3 Bd6 O-O O-O',
    expect: ['tour_colonne_w'], plan: 'Blancs : prendre la colonne c ouverte avec les tours' },
  { name: 'Hollandaise Stonewall', moves: 'd4 f5 g3 Nf6 Bg2 e6 Nf3 d5 O-O Bd6 c4 c6 b3 Qe7',
    expect: ['cavalier_avant_poste_w'], plan: 'Blancs : cavalier en e5, case que les pions noirs ne peuvent plus chasser' },
  { name: 'Najdorf, structure e5', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5 Nb3 Be7 O-O O-O Be3 Be6',
    expect: ['rupture_b'], plan: 'Noirs : rupture d5 qui libère le pion arriéré d6' },
  { name: 'Rossolimo, pions doublés', moves: 'e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 Re1',
    expect: ['affaiblir_w'], plan: 'Blancs : Fxc6 pour doubler les pions noirs' },
  { name: 'Grünfeld, échange', moves: 'd4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 Nc6 Be3 O-O O-O',
    expect: ['tour_colonne_b'], plan: 'Noirs : pression sur d4, tour sur la colonne d ou c' },
  { name: 'Benoni moderne', moves: 'd4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O O-O Re8 Nd2',
    expect: ['rupture_b'], plan: 'Noirs : a6 et b5, jeu à l\'aile dame ; Blancs : f4 et e5' },
];

const engine = new UciEngine({ threads: 1 });
const san = (fen, pv) => {
  const c = new Chess(fen);
  const out = [];
  for (const u of pv) { try { out.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; } }
  return out.join(' ');
};
const endFen = (fen, pv) => {
  const c = new Chess(fen);
  for (const u of pv) { try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; } }
  return c.fen();
};
const found = (scan) => Object.entries(scan).filter(([k, v]) => typeof v === 'number' && v >= 0 && !k.includes('moyen')).map(([k, v]) => `${k}@${v + 1}`);

let hits24 = 0;
let hits48 = 0;
let total = 0;
for (const cs of CASES) {
  const c = new Chess();
  let ok = true;
  for (const m of cs.moves.split(' ')) { try { c.move(m); } catch { ok = false; console.log(`${cs.name} : coup illégal ${m}`); break; } }
  if (!ok) continue;
  const fen = c.fen();
  const [best] = await engine.analyze(fen, { depth: DEPTH, multipv: 1 });
  const pv24 = best.pv.slice(0, 24);
  // Prolongation : Stockfish relancé depuis la dernière position de la suite (coach/extend-line.mjs).
  const pv48 = await extendPv(engine, fen, best.pv, { plies: 48, depth: DEPTH });
  const s24 = scanLine(fen, pv24, 24);
  const s48 = scanLine(fen, pv48, 48);
  console.log(`\n## ${cs.name}  (éval ${(best.score.value / 100).toFixed(2)}, trait aux ${c.turn() === 'w' ? 'Blancs' : 'Noirs'})`);
  console.log(`Plan attendu : ${cs.plan}`);
  console.log(`Suite (24) : ${san(fen, pv24)}`);
  console.log(`Prolongée  : ${san(endFen(fen, pv24), pv48.slice(pv24.length))}`);
  console.log(`Concepts à 24 : ${found(s24).join(', ') || 'aucun'}`);
  console.log(`Concepts à 48 : ${found(s48).join(', ') || 'aucun'}`);
  for (const k of cs.expect) {
    total++;
    if (s24[k] >= 0) hits24++;
    if (s48[k] >= 0) hits48++;
    console.log(`  attendu ${k} : ${s24[k] >= 0 ? `trouvé à 24 (demi-coup ${s24[k] + 1})` : s48[k] >= 0 ? `trouvé seulement à 48 (demi-coup ${s48[k] + 1})` : 'MANQUÉ'}`);
  }
}
engine.stop();
console.log(`\nBilan : plans attendus trouvés à 24 demi-coups ${hits24}/${total}, à 48 demi-coups ${hits48}/${total}`);
