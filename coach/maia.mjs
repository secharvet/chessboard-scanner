/**
 * Maia-1500 (lc0, UCI via child_process) — la politique seule, à 1 nœud : la probabilité qu'un joueur de 1500 joue
 * chaque coup. Une seule instance, requêtes sérialisées. Protocole : docs/plans/PROTOCOLE-MAIA-2026-10-21.md § 4.1, § 7 bis.
 *
 * Reproductibilité (Dev chef, § 7 bis) : processeur seul (backend eigen, un fil), binaire et poids épinglés par empreinte,
 * aucun aléa côté lc0 (1 nœud, pas de bruit, température 0) ; le tirage est le nôtre (`tirer`). Température de politique
 * 1,0 : la probabilité apprise par le réseau, pas la version aplatie par défaut de lc0 (1,36). « ucinewgame » avant
 * chaque position : rien ne passe d'une position à l'autre.
 */

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { createHash } from 'node:crypto';

const DOSSIER = process.env.MAIA_DIR ?? `${process.env.HOME}/bin/maia`;
export const MAIA = Object.freeze({
  lc0: `${DOSSIER}/lc0-0.31.2-eigen`,
  poids: `${DOSSIER}/maia-1500.pb.gz`,
  empreinteLc0: '65343fe7a7df698096c0b637290fd55cbd40246c35355410a4a465a3f63f4e41',
  empreintePoids: '35ab6f20421d59e1df3b17c5a5016947af4c6761368ef84044a9a9c7619a9a00',
  seuil: 0.05, // coups probables : P ≥ 5 % …
  auPlus: 5, // … au plus 5 (Expert, § 4.1)
});

export class Maia {
  constructor(opts = {}) {
    this.lc0 = opts.lc0 ?? MAIA.lc0;
    this.poids = opts.poids ?? MAIA.poids;
    this.proc = null;
    this.onLine = null;
    this.queue = Promise.resolve();
  }

  async start() {
    if (this.proc) return;
    this.proc = spawn(this.lc0, [], { stdio: ['pipe', 'pipe', 'ignore'] });
    this.proc.on('exit', () => { this.proc = null; });
    this.proc.on('error', (e) => { console.error(`[maia] ${this.lc0} : ${e.message}`); this.proc = null; });
    createInterface({ input: this.proc.stdout }).on('line', (line) => this.onLine?.(line));
    await this.#attendre('uci', (l) => l === 'uciok');
    for (const [k, v] of [['WeightsFile', this.poids], ['Backend', 'eigen'], ['Threads', 1], ['VerboseMoveStats', 'true'],
      ['SmartPruningFactor', 0], ['Temperature', 0], ['PolicyTemperature', 1.0]]) this.#envoyer(`setoption name ${k} value ${v}`);
    await this.#attendre('isready', (l) => l === 'readyok');
  }

  stop() { this.proc?.stdin?.write('quit\n'); this.proc = null; }

  /**
   * La politique de Maia dans la position : [{ uci, p }] trié par probabilité décroissante, puis ordre UCI (départage
   * fixe, § 7 bis.4). p en fraction (lc0 l'imprime au centième de pour cent).
   */
  politique(fen) {
    const run = async () => {
      await this.start();
      this.#envoyer('ucinewgame');
      this.#envoyer(`position fen ${fen}`);
      const coups = [];
      await this.#attendre('go nodes 1', (l) => {
        const m = /^info string (\S+)\s+\(\d+\s*\).*\(P:\s*([\d.]+)%\)/.exec(l);
        if (m && m[1] !== 'node') coups.push({ uci: m[1], p: Number(m[2]) / 100 });
        return l.startsWith('bestmove');
      });
      return coups.sort((a, b) => b.p - a.p || (a.uci < b.uci ? -1 : 1));
    };
    const r = this.queue.then(run, run);
    this.queue = r.catch(() => {});
    return r;
  }

  #envoyer(cmd) { this.proc.stdin.write(`${cmd}\n`); }

  #attendre(cmd, fini, delaiMs = 30000) {
    return new Promise((resolve, reject) => {
      // Un délai = lc0 mort : fatal (le flux n'est pas purgé, la partie est à jeter ; Dev chef).
      const t = setTimeout(() => { this.onLine = null; this.proc?.kill(); this.proc = null; reject(new Error(`maia : délai dépassé (${cmd}), fatal`)); }, delaiMs);
      this.onLine = (l) => { if (fini(l)) { clearTimeout(t); this.onLine = null; resolve(); } };
      this.#envoyer(cmd);
    });
  }
}

/** Les coups probables (§ 4.1) : P ≥ seuil, au plus `auPlus`, dans l'ordre de la politique. Et la masse gardée. */
export function probables(pol, seuil = MAIA.seuil, auPlus = MAIA.auPlus) {
  const coups = pol.filter((c) => c.p >= seuil).slice(0, auPlus);
  return { coups, masse: coups.reduce((s, c) => s + c.p, 0) };
}

/**
 * Tirage reproductible indexé par la position (§ 7 bis.3) : graine = hash(FEN, graine de partie), pas un flux qui
 * avance coup après coup — deux parties qui passent par la même position y tirent le même coup. Tirage au prorata de p
 * parmi `coups` (déjà dans un ordre fixe).
 */
export function tirer(coups, fen, graine) {
  if (!coups.length) return null;
  const h = createHash('sha256').update(`${fen}|${graine}`).digest();
  const u = h.readUInt32BE(0) / 2 ** 32;
  const total = coups.reduce((s, c) => s + c.p, 0);
  let acc = 0;
  for (const c of coups) { acc += c.p / total; if (u < acc) return c; }
  return coups[coups.length - 1];
}
