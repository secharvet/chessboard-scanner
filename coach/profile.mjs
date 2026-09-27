/**
 * Profil de style d'un joueur, mesuré sur ses coups (pas sur des étiquettes) :
 * chaque trait a une définition opérationnelle calculée avec les outils de perception.
 *
 * On ignore l'ouverture (coups 1-8 : la théorie ne dit rien du style) et on s'arrête au coup 60.
 * Les traits sont des taux « pour 100 coups » du joueur (ou des moyennes), agrégés sur ses parties.
 */

import { Chess } from 'chess.js';
import { scanTactics } from './threats.mjs';
import { findManeuvers } from './maneuvers.mjs';
import { buildAttackMap } from '../positional/attack-map.js';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const FILES = 'abcdefgh';

/** Définition lisible de chaque trait (sert au rapport et au portrait rédigé). */
export const TRAITS = {
  menaces: { label: 'coups qui créent une menace', unit: '/100 coups', family: 'agressivité' },
  echecs: { label: 'échecs donnés', unit: '/100 coups', family: 'agressivité' },
  sacrifices: { label: 'sacrifices (matériel donné et non récupéré 4 demi-coups plus tard)', unit: '/100 coups', family: 'agressivité' },
  sacrifices_sains: { label: 'sacrifices sains (Stockfish : évaluation ≥ −1 malgré le matériel donné)', unit: '/100 coups', family: 'agressivité' },
  proximite_roi: { label: 'pièces à 3 cases ou moins du roi adverse', unit: 'pièces en moyenne', family: 'agressivité' },
  assaut_pions: { label: "poussées de pions d'attaque (roques opposés, ou pion qui touche le roque adverse)", unit: '/100 coups', family: 'agressivité' },
  reactions: { label: 'réactions : coups qui font disparaître une menace adverse existante', unit: '/100 coups', family: 'tactique' },
  prophylaxie_plans: { label: "prophylaxie de plans : coup calme qui réduit les manœuvres et ruptures adverses", unit: '% des coups calmes', family: 'prudence' },
  options_adverses: { label: "options tactiques laissées à l'adversaire après le coup", unit: 'options en moyenne', family: 'prudence' },
  materiel_20_40: { label: 'pièces (hors pions) restant sur l\'échiquier, coups 20 à 40', unit: 'points en moyenne', family: 'simplification' },
  dames_echangees: { label: 'dames échangées avant le coup 30 (échange initié par le joueur)', unit: '/partie', family: 'simplification' },
  pions_devant_son_roi: { label: 'poussées de pions devant son propre roi roqué', unit: '/100 coups', family: 'prudence' },
  restriction: { label: 'restriction : mobilité adverse retirée par le coup', unit: 'cases en moyenne', family: 'prudence' },
  retraits: { label: 'retraits de pièces', unit: '/100 coups', family: 'prudence' },
  echanges: { label: 'échanges à valeur égale initiés', unit: '/100 coups', family: 'simplification' },
  prises: { label: 'prises', unit: '/100 coups', family: 'simplification' },
  fou_pour_cavalier: { label: 'échanges fou contre cavalier initiés (on cède le fou)', unit: '/partie', family: 'pièces mineures' },
  cavalier_pour_fou: { label: 'échanges cavalier contre fou initiés (on gagne la paire)', unit: '/partie', family: 'pièces mineures' },
  paire_de_fous: { label: 'part des coups avec la paire de fous', unit: '%', family: 'pièces mineures' },
  espace: { label: 'pions avancés (5e rangée ou plus)', unit: 'pions en moyenne', family: 'espace' },
};

const rel = (rank, c) => (c === 'w' ? rank : 9 - rank);

/** Plans disponibles pour `side` : manœuvres sûres + ruptures de pions (poussée qui attaque un pion adverse). */
function opponentPlans(fen, side) {
  const p = fen.split(' ');
  if (p[1] !== side) { p[1] = side; p[3] = '-'; }
  let c;
  try { c = new Chess(p.join(' ')); } catch { return 0; }
  const breaks = c.moves({ verbose: true }).filter((m) => {
    if (m.piece !== 'p' || m.captured) return false;
    const df = side === 'w' ? 1 : -1;
    return [-1, 1].some((d) => {
      const f = FILES[FILES.indexOf(m.to[0]) + d];
      const t = f && c.get(`${f}${Number(m.to[1]) + df}`);
      return t && t.type === 'p' && t.color !== side;
    });
  }).length;
  return findManeuvers(c.fen(), side, { max: 20 }).length + breaks;
}
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
export async function profileGame(sans, color, { from = 9, to = 60, engine = null } = {}) {
  const c = new Chess();
  const counts = Object.fromEntries(Object.keys(TRAITS).map((k) => [k, 0]));
  let moves = 0;
  let quietTested = 0;
  let midMoves = 0;
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

    // Réaction : une menace adverse grave présente avant disparaît après le coup.
    const theirs = (f) => scanTactics(f, opp, 6).filter((t) => t.severity >= 11);
    const threatsBefore = theirs(before);
    if (threatsBefore.length) {
      const still = new Set(theirs(after).map(key));
      if (threatsBefore.some((t) => !still.has(key(t)))) counts.reactions++;
    }

    // Restriction : mobilité des pièces adverses (hors roi et pions) retirée par le coup.
    const oppMobility = (f) => {
      const map = buildAttackMap(f);
      return map.pieces.filter((p) => p.color === opp && !['k', 'p'].includes(p.type)).reduce((a, p) => a + map.mobility(p), 0);
    };
    counts.restriction += oppMobility(before) - oppMobility(after);

    // Prophylaxie de plans : coup calme, sans menace immédiate, qui réduit les manœuvres sûres
    // et les ruptures de pions disponibles pour l'adversaire.
    const quiet = !m.captured && !/[+#]/.test(m.san) && !threatsBefore.length;
    if (quiet) {
      quietTested++;
      if (opponentPlans(after, opp) < opponentPlans(before, opp)) counts.prophylaxie_plans++;
    }

    // Options tactiques laissées à l'adversaire (toutes menaces, même mineures).
    counts.options_adverses += scanTactics(after, opp, 20).length;

    // Pion poussé devant son propre roi (roqué sur une aile).
    const myKingNow = board.flat().find((p) => p && p.type === 'k' && p.color === color);
    if (m.piece === 'p' && myKingNow && (FILES.indexOf(myKingNow.square[0]) >= 5 || FILES.indexOf(myKingNow.square[0]) <= 2)
      && Math.abs(FILES.indexOf(m.from[0]) - FILES.indexOf(myKingNow.square[0])) <= 1) counts.pions_devant_son_roi++;

    // Simplification : matériel (hors pions) sur l'échiquier entre les coups 20 et 40.
    if (moveNo >= 20 && moveNo <= 40) {
      counts.materiel_20_40 += board.flat().filter((p) => p && !['p', 'k'].includes(p.type)).reduce((a, p) => a + VALUE[p.type], 0);
      midMoves++;
    }
    if (m.captured === 'q' && m.piece === 'q' && moveNo < 30) counts.dames_echangees++;

    // Retrait : une pièce recule.
    if (m.piece !== 'p' && m.piece !== 'k' && rel(Number(m.to[1]), color) < rel(Number(m.from[1]), color)) counts.retraits++;

    // Proximité du roi adverse et assaut de pions.
    const enemyKing = board.flat().find((p) => p && p.type === 'k' && p.color === opp);
    if (enemyKing) {
      counts.proximite_roi += board.flat().filter(
        (p) => p && p.color === color && !['p', 'k'].includes(p.type) && cheb(p.square, enemyKing.square) <= 3,
      ).length;
      // Assaut : pion qui avance sur l'aile du roi adverse quand les roques sont opposés,
      // ou pion qui, après le coup, touche une case voisine du roi adverse ou un pion de son bouclier.
      if (m.piece === 'p') {
        const myKing = board.flat().find((p) => p && p.type === 'k' && p.color === color);
        const wing = (k) => (FILES.indexOf(k.square[0]) >= 5 ? 'roi' : FILES.indexOf(k.square[0]) <= 2 ? 'dame' : 'centre');
        const opposite = myKing && wing(myKing) !== 'centre' && wing(enemyKing) !== 'centre' && wing(myKing) !== wing(enemyKing);
        const onKingWing = Math.abs(FILES.indexOf(m.to[0]) - FILES.indexOf(enemyKing.square[0])) <= 2;
        const df = color === 'w' ? 1 : -1;
        const hits = [-1, 1].map((d) => `${FILES[FILES.indexOf(m.to[0]) + d] ?? ''}${Number(m.to[1]) + df}`)
          .filter((sq) => sq.length === 2);
        const touches = hits.some((sq) => cheb(sq, enemyKing.square) <= 1
          || board.flat().some((p) => p && p.square === sq && p.type === 'p' && p.color === opp && cheb(sq, enemyKing.square) <= 2));
        if ((opposite && onKingWing) || touches) counts.assaut_pions++;
      }
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
      if (ok && plies.length >= 2 && plies[0] <= -2 && plies.at(-1) <= -2) {
        counts.sacrifices++;
        if (engine) {
          const [l] = await engine.analyze(look.fen(), { depth: 10, multipv: 1 });
          if (l) {
            const cp = l.score.type === 'mate' ? (l.score.value > 0 ? 10000 : -10000) : l.score.value;
            const forMe = look.turn() === color ? cp : -cp;
            if (forMe >= -100) counts.sacrifices_sains++;
          }
        }
      }
    }

    const mineOnBoard = board.flat().filter((p) => p && p.color === color);
    if (mineOnBoard.filter((p) => p.type === 'b').length >= 2) counts.paire_de_fous++;
    counts.espace += mineOnBoard.filter((p) => p.type === 'p' && rel(Number(p.square[1]), color) >= 5).length;
  }
  return { moves, counts, quietTested, midMoves };
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
      if (def.unit === '% des coups calmes') return g.quietTested ? (100 * v) / g.quietTested : null;
      if (k === 'materiel_20_40') return g.midMoves ? v / g.midMoves : null;
      if (def.unit === '/partie') return v;
      return v / g.moves; // moyennes par coup
    });
    vals.splice(0, vals.length, ...vals.filter((v) => v != null));
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
