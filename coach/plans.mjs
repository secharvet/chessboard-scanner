/**
 * Plans VÉRIFIÉS pour le coach (docs/PLANS-ET-CONCEPTS.md) : à partir des suites du moteur déjà calculées
 * pour la position, on relève pour chaque camp les concepts qui sont LE plan (planLabel : dans la meilleure
 * suite, tôt, par des coups calmes, et pas dans les suites nettement moins bonnes), et on les écrit en
 * français, par le code. Aucun LLM. Sert au mode fiche : « Ton plan » et « il veut … ».
 */

import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';
import { planLabel, scanLine } from './plan-concepts.mjs';
import { toFrenchSan } from './notation.mjs';

const CONCEPTS = ['rupture', 'affaiblir', 'dominer', 'cavalier_avant_poste', 'blocage', 'tour_colonne'];
const toCp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 - s.value : -10000 - s.value) : s.value);
const NAME = { n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi', p: 'pion' };

/** Coups de la suite (chess.js), et FEN après chaque demi-coup. */
function replay(fen, pv) {
  const c = new Chess(fen);
  const moves = [];
  const fens = [];
  for (const u of pv) {
    try { moves.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); } catch { break; }
    fens.push(c.fen());
  }
  return { moves, fens };
}

/**
 * @param {{ fen: string, lines: { pv: string[], score: { type: string, value: number } }[], plies?: number, maxPly?: number }} input
 *   lines : suites du moteur (de préférence prolongées à `plies` demi-coups), la meilleure en premier.
 *   maxPly : le plan doit apparaître dans les maxPly premiers demi-coups (le coach parle du présent).
 * @returns {{ w: Plan[], b: Plan[] }} plans par camp, le plus tôt d'abord
 */
export function detectPlans({ fen, lines, plies = 24, maxPly = 12 }) {
  const out = { w: [], b: [] };
  if (!lines?.length || lines[0].score.type === 'mate') return out; // position tactique : pas de plan à raconter
  const r = { fen, evals: lines.map((l) => toCp(l.score)), pvs: lines.map((l) => l.pv.slice(0, plies)) };
  const scans = r.pvs.map((pv) => scanLine(fen, pv, plies));
  const best = replay(fen, r.pvs[0]);
  for (const side of ['w', 'b']) {
    for (const concept of CONCEPTS) {
      if (planLabel(r, scans, concept, side, { maxPly, consensus: true }) !== 1) continue;
      const plan = describe(concept, side, scans[0], best, fen);
      if (plan) out[side].push(plan);
    }
    out[side].sort((a, b) => a.ply - b.ply);
  }
  return out;
}

/** Détails lisibles d'un plan : coups en notation française, cases, faiblesse créée. */
function describe(concept, side, scan, best, fen) {
  const ply = scan[`${concept}_${side}`];
  const m = best.moves[ply];
  if (!m) return null;
  const san = (i) => (best.moves[i] ? toFrenchSan(best.moves[i].san) : null);
  const plan = { concept, side, ply, move: san(ply), to: m.to, pieceRefs: [] };
  const opp = side === 'w' ? 'b' : 'w';
  switch (concept) {
    case 'tour_colonne': {
      const open = buildAllFacts(best.fens[ply]).some((t) => t.id === 'COLONNE_OUVERTE' && String(t.params.file) === m.to[0]);
      Object.assign(plan, { file: m.to[0], open });
      plan.pieceRefs.push(['r', side, m.to]);
      break;
    }
    case 'cavalier_avant_poste':
      plan.pieceRefs.push(['n', side, m.to]);
      break;
    case 'blocage': {
      const pawn = `${m.to[0]}${Number(m.to[1]) + (opp === 'w' ? -1 : 1)}`;
      Object.assign(plan, { piece: m.piece, pawn });
      plan.pieceRefs.push([m.piece, side, m.to], ['p', opp, pawn]);
      break;
    }
    case 'rupture': {
      const lever = scan[`rupture_levier_${side}`];
      Object.assign(plan, { lever: san(lever), leverPly: lever, file: scan[`rupture_colonne_${side}`] });
      break;
    }
    case 'affaiblir': {
      const means = scan[`affaiblir_moyen_${side}`];
      const w = scan[`affaiblir_faiblesse_${side}`];
      // Le coup qui crée la faiblesse : ma prise qui force la reprise de pion (échange), ou le levier lié.
      const leverPly = scan[`affaiblir_levier_${side}`] ?? -1;
      Object.assign(plan, { means, weakness: w, beforeCastle: scan[`affaiblir_avant_roque_${side}`], move: san(means === 'poussee' && leverPly >= 0 ? leverPly : ply) ?? plan.move });
      if (w?.square) plan.pieceRefs.push(['p', opp, w.square]);
      break;
    }
    case 'dominer': {
      const ex = scan[`dominer_exploite_${side}`];
      Object.assign(plan, { shade: scan[`dominer_couleur_${side}`], exploit: ex >= 0 ? san(ex) : null });
      break;
    }
    default:
      return null;
  }
  return plan;
}

const WEAK = (w, who) => {
  const pos = who === 'me' ? 'lui' : 'toi';
  if (!w) return '';
  if (w.id === 'PION_ISOLE') return `un pion isolé en ${w.square}`;
  if (w.id === 'PION_ARRIERE') return `un pion arriéré en ${w.square}`;
  if (w.id === 'DOUBLON') return `des pions doublés sur la colonne ${w.file}`;
  if (w.id === 'PIONS_ROI_AFFAIBLI') return pos === 'lui' ? 'un roi sans abri de pions' : 'un roi sans abri de pions';
  return 'une faiblesse durable';
};

/**
 * Phrase du plan, écrite par le code. `who` = 'me' (le plan de l'élève, tutoiement) ou 'opp' (le plan de
 * l'adversaire, à la troisième personne, complément de « il veut … »).
 */
export function planSentence(p, who = 'me') {
  const me = who === 'me';
  switch (p.concept) {
    case 'tour_colonne':
      return me ? `amène ta tour en ${p.to} : la colonne ${p.file} est ${p.open ? 'ouverte' : 'semi-ouverte'}`
        : `mettre sa tour en ${p.to}, sur la colonne ${p.file} ${p.open ? 'ouverte' : 'semi-ouverte'}`;
    case 'cavalier_avant_poste':
      return me ? `installe ton cavalier en ${p.to}, un avant-poste que ses pions ne pourront plus chasser`
        : `installer son cavalier en ${p.to}, un avant-poste`;
    case 'blocage':
      return me ? `bloque son pion ${p.pawn} avec ton ${NAME[p.piece]} en ${p.to}`
        : `bloquer ton pion ${p.pawn} avec son ${NAME[p.piece]} en ${p.to}`;
    case 'rupture':
      return me ? `prépare la rupture ${p.lever}${p.file ? ` : elle ouvre la colonne ${p.file}` : ''}`
        : `jouer la rupture ${p.lever}${p.file ? ` pour ouvrir la colonne ${p.file}` : ''}`;
    case 'affaiblir': {
      const how = p.means === 'echange' ? `l'échange ${p.move}` : `la poussée ${p.move}`;
      const w = WEAK(p.weakness, who);
      return me ? `affaiblis sa structure par ${how}${w ? ` : il lui restera ${w}` : ''}${p.beforeCastle ? ', avant même son roque de ce côté' : ''}`
        : `affaiblir ta structure par ${how}${w ? ` (${w} pour toi)` : ''}`;
    }
    case 'dominer':
      return me ? `échange son fou des cases ${p.shade} par ${p.move} en gardant le tien : il est faible sur ces cases${p.exploit ? `, puis ${p.exploit}` : ''}`
        : `échanger ton fou des cases ${p.shade} par ${p.move} pour dominer ces cases`;
    default:
      return '';
  }
}
