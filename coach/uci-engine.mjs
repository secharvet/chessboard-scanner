/**
 * Stockfish natif (UCI via child_process) — une seule instance, requêtes sérialisées.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createInterface } from 'node:readline';

/**
 * @typedef {{ type: 'cp' | 'mate', value: number }} Score  // point de vue du camp au trait
 * @typedef {{ multipv: number, depth: number, score: Score, pv: string[] }} EngineLine
 */

export class UciEngine {
  /** @param {{ path?: string, threads?: number, hashMb?: number }} [opts] */
  constructor(opts = {}) {
    // Le binaire officiel (/usr/local/bin, compilé BMI2/AVX2) est 1,8 fois plus rapide que le paquet Ubuntu (SSE2).
    this.path = opts.path ?? process.env.STOCKFISH_PATH ?? ['/usr/local/bin/stockfish', '/usr/games/stockfish'].find(existsSync) ?? 'stockfish';
    /** Nom annoncé par le moteur (« Stockfish 19 »), connu après start(). */
    this.name = null;
    this.threads = opts.threads ?? 2;
    this.hashMb = opts.hashMb ?? 128;
    /** @type {import('node:child_process').ChildProcess | null} */
    this.proc = null;
    /** @type {((line: string) => void) | null} */
    this.onLine = null;
    this.queue = Promise.resolve();
  }

  async start() {
    if (this.proc) return;
    this.proc = spawn(this.path, [], { stdio: ['pipe', 'pipe', 'inherit'] });
    this.proc.on('exit', () => { this.proc = null; });
    createInterface({ input: this.proc.stdout }).on('line', (line) => this.onLine?.(line));
    await this.#waitFor('uci', (l) => { if (l.startsWith('id name ')) this.name = l.slice(8); return l === 'uciok'; });
    this.#send(`setoption name Threads value ${this.threads}`);
    this.#send(`setoption name Hash value ${this.hashMb}`);
    // « ucinewgame » une seule fois : la table de hachage est conservée entre les analyses, si bien que les
    // analyses suivantes d'une même fiche (menace, préparations, prolongements) réutilisent le travail de la
    // première au lieu de repartir de zéro. La table est indexée par position : aucun risque de mélange.
    this.#send('ucinewgame');
    await this.#waitFor('isready', (l) => l === 'readyok');
    this.multipv = null;
  }

  stop() {
    this.proc?.stdin?.write('quit\n');
    this.proc = null;
  }

  /**
   * @param {string} fen
   * @param {{ depth?: number, multipv?: number }} [opts]
   * @returns {Promise<EngineLine[]>}
   */
  analyze(fen, opts = {}) {
    const run = async () => {
      await this.start();
      const multipv = opts.multipv ?? 3;
      const depth = opts.depth ?? 16;
      if (multipv !== this.multipv) {
        this.#send(`setoption name MultiPV value ${multipv}`);
        await this.#waitFor('isready', (l) => l === 'readyok');
        this.multipv = multipv;
      }

      /** @type {Map<number, EngineLine>} */
      const lines = new Map();
      await this.#waitFor(`position fen ${fen}\ngo depth ${depth}`, (l) => {
        if (l.startsWith('info ') && l.includes(' pv ')) {
          const parsed = parseInfo(l);
          if (parsed) lines.set(parsed.multipv, parsed);
        }
        return l.startsWith('bestmove');
      });
      return [...lines.values()].sort((a, b) => a.multipv - b.multipv);
    };
    const p = this.queue.then(run, run);
    this.queue = p.catch(() => {});
    return p;
  }

  /** @param {string} cmd */
  #send(cmd) {
    if (!this.proc?.stdin) throw new Error('Stockfish non démarré');
    this.proc.stdin.write(`${cmd}\n`);
  }

  /**
   * @param {string} cmd
   * @param {(line: string) => boolean} done
   * @param {number} [timeoutMs]
   */
  #waitFor(cmd, done, timeoutMs = 60_000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.onLine = null;
        reject(new Error(`Stockfish : délai dépassé (${cmd.split('\n').pop()})`));
      }, timeoutMs);
      this.onLine = (line) => {
        if (done(line)) {
          clearTimeout(timer);
          this.onLine = null;
          resolve(undefined);
        }
      };
      for (const c of cmd.split('\n')) this.#send(c);
    });
  }
}

/** @param {string} line @returns {EngineLine | null} */
function parseInfo(line) {
  const depth = line.match(/\bdepth (\d+)/)?.[1];
  const multipv = line.match(/\bmultipv (\d+)/)?.[1] ?? '1';
  const cp = line.match(/\bscore cp (-?\d+)/)?.[1];
  const mate = line.match(/\bscore mate (-?\d+)/)?.[1];
  const pv = line.match(/\bpv (.+)$/)?.[1];
  if (!depth || !pv || (cp == null && mate == null)) return null;
  return {
    multipv: Number(multipv),
    depth: Number(depth),
    score: mate != null ? { type: 'mate', value: Number(mate) } : { type: 'cp', value: Number(cp) },
    pv: pv.trim().split(/\s+/),
  };
}
