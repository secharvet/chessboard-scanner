/**
 * Profil de style d'un joueur, mesuré sur ses coups (pas sur des étiquettes) :
 * chaque trait a une définition opérationnelle calculée avec les outils de perception.
 *
 * On ignore l'ouverture (coups 1-8 : la théorie ne dit rien du style) et on s'arrête au coup 60.
 * Les traits sont des taux « pour 100 coups » du joueur (ou des moyennes), agrégés sur ses parties.
 */

import { Chess } from 'chess.js';
import { scanTactics } from './threats.mjs';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const FILES = 'abcdefgh';

/** Définition lisible de chaque trait (sert au rapport et au portrait rédigé). */
export const TRAITS = {
  menaces: { label: 'coups qui créent une menace', unit: '/100 coups', family: 'agressivité' },
  echecs: { label: 'échecs donnés', unit: '/100 coups', family: 'agressivité' },
  sacrifices: { label: 'sacrifices (matériel donné et non récupéré 4 demi-coups plus tard)', unit: '/100 coups', family: 'agressivité' },
  proximite_roi: { label: 'pièces à 3 cases ou moins du roi adverse', unit: 'pièces en moyenne', family: 'agressivité' },
  assaut_pions: { label: 'poussées de pions vers le roi adverse', unit: '/100 coups', family: 'agressivité' },
  parades: { label: 'coups qui font disparaître une menace adverse', unit: '/100 coups', family: 'prudence' },
  retraits: { label: 'retraits de pièces', unit: '/100 coups', family: 'prudence' },
  echanges: { label: 'échanges à valeur égale initiés', unit: '/100 coups', family: 'simplification' },
  prises: { label: 'prises', unit: '/100 coups', family: 'simplification' },
  fou_pour_cavalier: { label: 'échanges fou contre cavalier initiés (on cède le fou)', unit: '/partie', family: 'pièces mineures' },
  cavalier_pour_fou: { label: 'échanges cavalier contre fou initiés (on gagne la paire)', unit: '/partie', family: 'pièces mineures' },
  paire_de_fous: { label: 'part des coups avec la paire de fous', unit: '%', family: 'pièces mineures' },
  espace: { label: 'pions avancés (5e rangée ou plus)', unit: 'pions en moyenne', family: 'espace' },
};

const rel = (rank, c) => (c === 'w' ? rank : 9 - rank);
const cheb = (a, b) => Math.max(Math.abs(FILES.indexOf(a[0]) - FILES.indexOf(b[0])), Math.abs(Number(a[1]) - Number(b[1])));

function materialFor(board, color) {
  let m = 0;
  for (const row of board) for (const p of row) if (p) m += (p.color === color ? 1 : -1) * VALUE[p.type];
  return m;
}

/**
 * Compteurs bruts d'une partie pour le camp `color`.
 * @param {string[]} sans  coups de la partie (notation anglaise)
 * @param {'w'|'b'} color
 */
export function profileGame(sans, color, { from = 9, to = 60 } = {}) {
  const c = new Chess();
  const counts = Object.fromEntries(Object.keys(TRAITS).map((k) => [k, 0]));
  let moves = 0;
  const opp = color === 'w' ? 'b' : 'w';

  for (let i = 0; i < sans.length; i++) {
    const before = c.fen();
    const moveNo = Math.floor(i / 2) + 1;
    let m;
    try { m = c.move(sans[i]); } catch { break; }
    if (m.color !== color || moveNo < from) continue;
    if (moveNo > to) break;
    moves++;
    const after = c.fen();
    const board = c.board();

    if (/[+#]/.test(m.san)) counts.echecs++;
    if (m.captured) counts.prises++;

    // Menace créée : une menace grave (gain ≥ 1, mat, fourchette, découverte) qui n'existait pas.
    const key = (t) => t.san;
    const mine = (f) => scanTactics(f, color, 6).filter((t) => t.severity >= 8);
    const was = new Set(mine(before).map(key));
    if (mine(after).some((t) => !was.has(key(t)))) counts.menaces++;

    // Parade : une menace adverse grave présente avant disparaît après le coup.
    const theirs = (f) => scanTactics(f, opp, 6).filter((t) => t.severity >= 11);
    const threatsBefore = theirs(before);
    if (threatsBefore.length) {
      const still = new Set(theirs(after).map(key));
      if (threatsBefore.some((t) => !still.has(key(t)))) counts.parades++;
    }

    // Retrait : une pièce recule.
    if (m.piece !== 'p' && m.piece !== 'k' && rel(Number(m.to[1]), color) < rel(Number(m.from[1]), color)) counts.retraits++;

    // Proximité du roi adverse et assaut de pions.
    const enemyKing = board.flat().find((p) => p && p.type === 'k' && p.color === opp);
    if (enemyKing) {
      counts.proximite_roi += board.flat().filter(
        (p) => p && p.color === color && !['p', 'k'].includes(p.type) && cheb(p.square, enemyKing.square) <= 3,
      ).length;
      if (m.piece === 'p' && Math.abs(FILES.indexOf(m.to[0]) - FILES.indexOf(enemyKing.square[0])) <= 2
        && rel(Number(m.to[1]), color) >= 4) counts.assaut_pions++;
    }

    // Échanges initiés (prise reprise aussitôt), et fou contre cavalier.
    const next = sans[i + 1] ? new Chess(after) : null;
    let recaptured = false;
    if (next && m.captured) {
      try { recaptured = next.move(sans[i + 1])?.to === m.to; } catch { /* fin */ }
    }
    if (m.captured && recaptured && VALUE[m.captured] === VALUE[m.piece]) {
      counts.echanges++;
      if (m.piece === 'b' && m.captured === 'n') counts.fou_pour_cavalier++;
      if (m.piece === 'n' && m.captured === 'b') counts.cavalier_pour_fou++;
    }

    // Sacrifice : matériel perdu juste après le coup (la pièce est prise) et toujours pas récupéré
    // 4 demi-coups plus tard.
    if (sans[i + 1]) {
      const look = new Chess(before);
      const start = materialFor(look.board(), color);
      look.move(sans[i]);
      let ok = true;
      const plies = [];
      for (let k = 1; k <= 4 && sans[i + k]; k++) {
        try { look.move(sans[i + k]); plies.push(materialFor(look.board(), color) - start); } catch { ok = false; break; }
      }
      if (ok && plies.length >= 2 && plies[0] <= -2 && plies.at(-1) <= -2) counts.sacrifices++;
    }

    const mineOnBoard = board.flat().filter((p) => p && p.color === color);
    if (mineOnBoard.filter((p) => p.type === 'b').length >= 2) counts.paire_de_fous++;
    counts.espace += mineOnBoard.filter((p) => p.type === 'p' && rel(Number(p.square[1]), color) >= 5).length;
  }
  return { moves, counts };
}

/**
 * Agrège les parties : pour chaque trait, moyenne par partie (normalisée) et erreur type.
 * @param {{ moves: number, counts: Record<string, number> }[]} games
 */
export function aggregate(games) {
  const usable = games.filter((g) => g.moves >= 10);
  const out = {};
  for (const [k, def] of Object.entries(TRAITS)) {
    const vals = usable.map((g) => {
      const v = g.counts[k];
      if (def.unit === '/100 coups') return (100 * v) / g.moves;
      if (def.unit === '%') return (100 * v) / g.moves;
      if (def.unit === '/partie') return v;
      return v / g.moves; // moyennes par coup
    });
    const n = vals.length;
    const mean = vals.reduce((a, b) => a + b, 0) / Math.max(1, n);
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, n - 1));
    out[k] = { mean, se: sd / Math.sqrt(Math.max(1, n)), n };
  }
  return { games: usable.length, moves: usable.reduce((a, g) => a + g.moves, 0), traits: out };
}

/** Découpe un fichier PGN multi-parties et renvoie { tags, sans } par partie. */
export function splitPgn(text) {
  return text.split(/\n(?=\[Event )/).map((chunk) => {
    const tags = Object.fromEntries([...chunk.matchAll(/^\[(\w+) "([^"]*)"\]/gm)].map((m) => [m[1], m[2]]));
    const c = new Chess();
    try { c.loadPgn(chunk); } catch { return null; }
    return { tags, sans: c.history() };
  }).filter(Boolean);
}
