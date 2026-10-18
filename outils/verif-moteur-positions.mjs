// Évaluations Stockfish ciblées pour la relecture d'un livre d'ouverture.
// Usage : node outils/verif-moteur-positions.mjs <tests.mjs>
// <tests.mjs> exporte TESTS = [{ nom, moves: 'SAN depuis le départ', cands: ['coups à forcer'] }, …]
// Pour chaque test : MultiPV 4 à la profondeur choisie, puis évaluation de chaque candidat forcé
// (score rendu du point de vue du camp au trait de la position de départ).
// Repères utilisés pour l'Espagnole : plan = à moins de ~0,3 du meilleur coup ; faute = au moins 0,3
// d'écart (idéalement bien plus) ; toujours vérifier que la réfutation citée dans le « pourquoi »
// est bien le meilleur coup de la réponse.
import { spawn } from 'node:child_process';
import { Chess } from '../vendor/chess.js';

const SF = process.env.STOCKFISH_PATH || '/usr/local/bin/stockfish';
const DEPTH = Number(process.env.PROFONDEUR || 20);
// Un fil par défaut : à 3-4 fils les notes bougent de 5/17/49 cp (méd./90e/max) et le meilleur
// coup change 11 fois sur 35 (nuit de stabilité du 18 octobre 2026) — les verdicts limites
// n'ont de sens qu'en déterministe. FILS=4 pour une passe exploratoire rapide, jamais pour trancher.
const FILS = Number(process.env.FILS || 1);

const chemin = process.argv[2];
if (!chemin) { console.error('Usage : node outils/verif-moteur-positions.mjs <tests.mjs>'); process.exit(2); }
const { TESTS } = await import(new URL(chemin, `file://${process.cwd()}/`).href);

function fenOf(moves) {
  const c = new Chess();
  for (const m of moves.split(/\s+/)) c.move(m);
  return c.fen();
}
function pvSan(fen, pv) {
  try {
    const c = new Chess(fen);
    return pv.split(' ').map(u => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san).join(' ');
  } catch { return pv; }
}

class Engine {
  constructor() {
    this.p = spawn(SF);
    this.buf = '';
    this.p.stdout.on('data', d => { this.buf += d; this.onData && this.onData(); });
    this.p.stdin.write(`uci\nsetoption name Threads value ${FILS}\nsetoption name Hash value 256\n`);
  }
  send(s) { this.p.stdin.write(s + '\n'); }
  wait(regex) {
    return new Promise(res => {
      const check = () => { const m = this.buf.match(regex); if (m) { this.onData = null; res(m); } };
      this.onData = check; check();
    });
  }
  async analyse(fen, multipv = 4) {
    this.buf = '';
    this.send(`setoption name MultiPV value ${multipv}`);
    this.send(`position fen ${fen}`);
    this.send(`go depth ${DEPTH}`);
    await this.wait(/bestmove (\S+)/);
    const lines = [];
    for (const l of this.buf.split('\n')) {
      const m = l.match(new RegExp(`depth ${DEPTH} .*multipv (\\d+) score (cp|mate) (-?\\d+).* pv (\\S+)((?: \\S+){0,5})`));
      if (m) lines[+m[1] - 1] = { score: m[2] === 'mate' ? (m[3] > 0 ? 9999 : -9999) : +m[3], pv: (m[4] + m[5]).trim() };
    }
    return lines.filter(Boolean);
  }
}

const eng = new Engine();
await new Promise(r => setTimeout(r, 300));
for (const t of TESTS) {
  const fen = fenOf(t.moves);
  console.log(`\n=== ${t.nom}\n  au trait: ${fen.split(' ')[1]}`);
  for (const l of await eng.analyse(fen)) {
    console.log(`  top: ${l.score > 0 ? '+' : ''}${(l.score / 100).toFixed(2)}  ${pvSan(fen, l.pv)}`);
  }
  for (const cand of t.cands || []) {
    const c = new Chess(fen);
    try { c.move(cand); } catch { console.log(`  cand ${cand}: ILLÉGAL`); continue; }
    const r = await eng.analyse(c.fen(), 1);
    console.log(`  cand ${cand}: ${-r[0].score > 0 ? '+' : ''}${(-r[0].score / 100).toFixed(2)}  réponse: ${pvSan(c.fen(), r[0].pv)}`);
  }
}
eng.p.kill();
console.log('\nFini.');
