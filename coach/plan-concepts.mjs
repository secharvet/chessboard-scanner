/**
 * Concepts de plan (docs/PLANS-ET-CONCEPTS.md) : états buts vérifiables, par camp, et leur apparition
 * le long d'une suite de coups. Partagé par le générateur d'étiquettes et les planches de contrôle.
 */

import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';
import { squareColor } from '../positional/attack-map.js';

// ── Concepts (états buts vérifiables, par camp) ──
// Chaque détecteur reçoit les faits d'une position et renvoie les couleurs pour lesquelles le concept est vrai.
const has = (facts, id, color) => facts.some((t) => t.id === id && t.params.color === color);
const WEAK_PAWN = new Set(['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE']);
export const CONCEPTS = {
  tour_colonne: (facts, color) => has(facts, 'TOUR_COLONNE_OUVERTE', color),
  cavalier_avant_poste: (facts, color) => has(facts, 'CAVALIER_AVANT_POSTE', color),
  // Blocage : un cavalier ou un fou installé juste devant un pion adverse isolé, arriéré, faible ou passé.
  blocage: (facts, color, board) => facts.some((t) => {
    if (!WEAK_PAWN.has(t.id) || t.params.color === color || typeof t.params.square !== 'string') return false;
    const sq = t.params.square;
    const front = `${sq[0]}${Number(sq[1]) + (t.params.color === 'w' ? 1 : -1)}`;
    const p = board.get(front);
    return Boolean(p && p.color === color && (p.type === 'n' || p.type === 'b'));
  }),
};
export const COLORS = ['w', 'b'];
/**
 * Un concept compte s'il TIENT au moins HOLD demi-coups après son apparition (ou jusqu'au bout de la suite si
 * elle s'arrête avant). Remplace « encore présent en fin de suite » : un cavalier installé en d5 puis échangé
 * dix demi-coups plus loin a bien réalisé le plan (test d'horizon, Sicilienne Pélikan), et les suites
 * prolongées à 48 demi-coups rendraient la condition de fin de suite presque impossible.
 */
export const HOLD = 6;

/** Colonnes ouvertes ou semi-ouvertes POUR `color`. */
const openFiles = (facts, color) => new Set(facts
  .filter((t) => t.id === 'COLONNE_OUVERTE' || (t.id === 'COLONNE_SEMI_OUVERTE' && t.params.color === color))
  .map((t) => String(t.params.file)));

/**
 * Le coup `m` (joué par `color`) réalise-t-il DÉLIBÉRÉMENT le concept ? Un plan s'exécute par un coup
 * calme de la pièce concernée : une colonne qui s'ouvre sous une tour immobile, ou un blocage né d'une
 * série d'échanges, ne sont pas des plans (relecture des planches, septembre 2026).
 */
const AGENT = {
  tour_colonne: (m, snap, color) => m.piece === 'r' && snap.facts.some((t) => t.id === 'TOUR_COLONNE_OUVERTE' && t.params.color === color && t.params.square === m.to),
  cavalier_avant_poste: (m, snap, color) => m.piece === 'n' && snap.facts.some((t) => t.id === 'CAVALIER_AVANT_POSTE' && t.params.color === color && t.params.square === m.to),
  blocage: (m, snap, color) => (m.piece === 'n' || m.piece === 'b') && snap.facts.some((t) => {
    if (!WEAK_PAWN.has(t.id) || t.params.color === color || typeof t.params.square !== 'string') return false;
    return `${t.params.square[0]}${Number(t.params.square[1]) + (t.params.color === 'w' ? 1 : -1)}` === m.to;
  }),
};

/**
 * Déroule une suite et renvoie, pour chaque concept et chaque camp, le demi-coup d'apparition (ou -1).
 * Apparition = absent au départ, réalisé par un coup CALME et DÉLIBÉRÉ du camp (voir AGENT), et tenu
 * au moins HOLD demi-coups.
 * Rupture de pions : une POUSSÉE de pion du camp (pas une prise) qui attaque un pion adverse (levier),
 * suivie d'une nouvelle colonne ouverte ou semi-ouverte pour ce camp, qui tient, et qui transforme la
 * position (tour du camp dessus plus loin, ou faiblesse adverse ou pion passé nouveaux et qui tiennent).
 * Attribuée au seul camp qui pousse.
 */
export function scanLine(fen, pv, PLIES = 48) {
  const c = new Chess(fen);
  const start = { facts: buildAllFacts(fen), board: new Chess(fen) };
  const timeline = [];
  const moves = [];
  const levers = { w: [], b: [] };
  for (const [i, u] of pv.slice(0, PLIES).entries()) {
    let m;
    try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    moves.push(m);
    if (m.piece === 'p' && !m.captured) {
      const dir = m.color === 'w' ? 1 : -1;
      const f = m.to.charCodeAt(0);
      const attacks = [-1, 1].some((d) => {
        const p = c.get(`${String.fromCharCode(f + d)}${Number(m.to[1]) + dir}`);
        return p && p.type === 'p' && p.color !== m.color;
      });
      if (attacks) levers[m.color].push(i);
    }
    timeline.push({ facts: buildAllFacts(c.fen()), board: new Chess(c.fen()) });
  }
  const out = {};
  if (!timeline.length) return out;
  /** La condition est-elle vraie du demi-coup i jusqu'à i + HOLD (ou jusqu'au bout de la suite) ? */
  const holds = (i, pred) => timeline.slice(i, i + HOLD + 1).every(pred);
  for (const [name, test] of Object.entries(CONCEPTS)) {
    for (const color of COLORS) {
      let ply = -1;
      const ok = (snap) => test(snap.facts, color, snap.board);
      if (!ok(start)) {
        ply = timeline.findIndex((snap, i) => moves[i].color === color && !moves[i].captured
          && AGENT[name](moves[i], snap, color) && holds(i, ok));
      }
      out[`${name}_${color}`] = ply;
    }
  }
  for (const color of COLORS) {
    const before = openFiles(start.facts, color);
    const opp = color === 'w' ? 'b' : 'w';
    let ply = -1;
    // Première colonne nouvelle (pour ce camp) qui reste ouverte au moins HOLD demi-coups.
    let fresh = [];
    const opened = timeline.findIndex((snap, i) => {
      fresh = [...openFiles(snap.facts, color)].filter((f) => !before.has(f) && holds(i, (s) => openFiles(s.facts, color).has(f)));
      return fresh.length > 0;
    });
    if (opened >= 0 && levers[color].length) {
      const later = timeline.slice(opened);
      const rookUses = later.some((snap) => snap.board.board().flat().some((p) => p && p.type === 'r' && p.color === color && fresh.includes(p.square[0])));
      const key = (t) => `${t.id}|${t.params.color}|${String(t.params.square ?? '')[0]}`;
      const had = new Set(start.facts.map(key));
      const isStructural = (t) => !had.has(key(t))
        && ((['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE'].includes(t.id) && t.params.color === opp)
          || (t.id === 'PION_PASSE' && t.params.color === color));
      const structural = later.some((snap, j) => snap.facts.some((t) => isStructural(t)
        && holds(opened + j, (s) => s.facts.some((u) => key(u) === key(t)))));
      // Le levier doit venir du camp ET précéder l'ouverture ; l'autre camp, qui la subit, n'est pas crédité.
      const firstLever = levers[color][0] ?? Infinity;
      const oppLever = levers[opp][0] ?? Infinity;
      if (firstLever <= opened && firstLever < oppLever && (rookUses || structural)) ply = opened;
    }
    out[`rupture_${color}`] = ply;
  }

  // Affaiblir la structure adverse (plan à étages : MOYEN → DÉSÉQUILIBRE) : une faiblesse nouvelle
  // apparaît chez l'adversaire dans la suite calme et tient au moins HOLD demi-coups. Moyen : « échange »
  // (le camp prend une pièce, l'adversaire reprend avec un pion) ou « poussée » (levier de pion du camp). On note aussi si
  // l'adversaire pouvait encore roquer du côté affaibli (« avant le roque » : on lui enlève son abri).
  const weakKey = (t) => (t.id === 'DOUBLON' ? `D|${t.params.color}|${t.params.file}`
    : t.id === 'PION_ISOLE' || t.id === 'PION_ARRIERE' ? `${t.id}|${t.params.color}|${t.params.square[0]}`
      : t.id === 'PIONS_ROI_AFFAIBLI' ? `K|${t.params.color}` : null);
  const castling = fen.split(' ')[2] ?? '-';
  for (const color of COLORS) {
    const opp = color === 'w' ? 'b' : 'w';
    const had = new Set(start.facts.filter((t) => t.params.color === opp).map(weakKey).filter(Boolean));
    let ply = -1;
    let means = null;
    let wing = null;
    for (let i = 0; i < timeline.length && ply < 0; i++) {
      const fresh = timeline[i].facts.filter((t) => t.params.color === opp).map((t) => [weakKey(t), t])
        .filter(([k]) => k && !had.has(k) && holds(i, (s) => s.facts.some((u) => u.params.color === opp && weakKey(u) === k)));
      if (!fresh.length) continue;
      const m = moves[i];
      const prev = moves[i - 1];
      if (m.color === opp && m.piece === 'p' && m.captured && m.captured !== 'p' && prev?.color === color && prev.captured) means = 'echange';
      else if (levers[color].some((l) => l <= i)) means = 'poussee';
      else continue; // faiblesse sans moyen identifiable du camp : pas un plan de ce type
      ply = i;
      const t = fresh[0][1];
      const file = t.params.file ?? t.params.square?.[0] ?? String(t.params.files ?? '')[0];
      wing = file && 'efgh'.includes(file) ? 'roi' : file ? 'dame' : null;
    }
    out[`affaiblir_${color}`] = ply;
    out[`affaiblir_moyen_${color}`] = means;
    // L'adversaire pouvait-il encore roquer de ce côté au départ ?
    const rights = opp === 'w' ? { roi: 'K', dame: 'Q' } : { roi: 'k', dame: 'q' };
    out[`affaiblir_avant_roque_${color}`] = ply >= 0 && wing ? castling.includes(rights[wing]) : false;
  }

  // Dominer une couleur (plan à étages) : le camp PREND le fou adverse de la couleur S sur laquelle l'adversaire
  // est faible (au moins deux trous de cette couleur), en gardant son propre fou de S. Le fait COMPLEXE_FAIBLE
  // adverse « avec fou ennemi » apparaît à l'instant où son fou disparaît, et doit tenir HOLD demi-coups. Le
  // moyen est un échange (la suite calme l'admet) ; l'exploitation (pièces et attaque sur S) viendra ensuite.
  // Agentivité : c'est MOI qui provoque l'échange. Ma prise du fou compte si elle n'est pas une reprise, ou si
  // elle reprend un échange que j'ai offert (mon coup précédent a posé la pièce que son fou vient de prendre :
  // Cf6+ Fxf6 Dxf6). Reprendre après que l'adversaire a lui-même donné son fou n'est pas mon plan.
  for (const color of COLORS) {
    const opp = color === 'w' ? 'b' : 'w';
    const dominated = (snap, shade) => snap.facts.some((t) => t.id === 'COMPLEXE_FAIBLE' && t.params.color === opp && t.params.shade === shade && t.params.enemyBishop);
    const offered = (i) => moves[i - 1]?.captured && moves[i - 1].to === moves[i].to
      && moves[i - 1].piece === 'b' && moves[i - 2]?.color === color && !moves[i - 2].captured && moves[i - 2].to === moves[i].to;
    const recapture = (i) => Boolean(moves[i - 1]?.captured && moves[i - 1].to === moves[i].to);
    let ply = -1;
    let shadeOut = null;
    for (let i = 0; i < moves.length && ply < 0; i++) {
      const m = moves[i];
      if (m.color !== color || m.captured !== 'b') continue;
      if (recapture(i) && !offered(i)) continue;
      const shade = squareColor(m.to);
      if (dominated(start, shade)) continue; // déjà établi au départ
      if (holds(i, (s) => dominated(s, shade))) { ply = i; shadeOut = shade; }
    }
    out[`dominer_${color}`] = ply;
    out[`dominer_couleur_${color}`] = shadeOut;
  }
  return out;
}

// ── Suite calme (filtre des exemples positifs, scripts/verify-labels.mjs et build-dataset.mjs) ──
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const material = (chess) => chess.board().flat().reduce((s, p) => s + (p ? (p.color === 'w' ? 1 : -1) * VALUE[p.type] : 0), 0);

/**
 * La suite est-elle calme jusqu'à l'apparition du concept ? Renvoie la raison du rejet, ou null.
 * Le matériel est comparé aux POINTS CALMES (après un coup qui n'est pas suivi d'une prise) : une
 * rupture ou un échange décale le matériel le temps de la reprise, ce n'est pas de la tactique.
 * On vérifie jusqu'à la fin de l'échange qui fait apparaître le concept.
 */
export function quietReason(fen, pv, ply, concept) {
  const c = new Chess(fen);
  const start = material(c);
  const moves = [];
  const mat = [];
  for (const u of pv.slice(0, ply + 7)) {
    try { moves.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); } catch { break; }
    mat.push(material(c));
  }
  if (moves.length <= ply) return 'suite illisible';
  const quiet = (i) => i === moves.length - 1 || !moves[i + 1].captured;
  let endOfExchange = ply;
  while (endOfExchange < moves.length - 1 && !quiet(endOfExchange)) endOfExchange++;
  for (let i = 0; i <= endOfExchange; i++) {
    if (quiet(i) && mat[i] !== start) return 'matériel changé (tactique)';
  }
  if (concept === 'tour_colonne' && moves[ply].san.startsWith('O-O')) return 'apparaît par un roque';
  return null;
}

// ── Étiquette « ce concept est le plan » (docs/PLANS-ET-CONCEPTS.md, §4 et §9) ──
/**
 * Contraste par concept. `tempo: 0` = contraste strict : le concept n'apparaît pas dans les suites au moins
 * 0,3 pion moins bonnes. `tempo: N` = contraste de tempo : dans ces suites, il est absent OU apparaît au moins
 * N demi-coups plus tard ; et `maxPly` borne le prix (le concept doit apparaître tôt, sinon l'écart d'évaluation
 * ne lui est pas attribuable). Relecture des planches tempo, septembre 2026 : le tempo n'apporte que du bruit
 * pour la tour sur colonne (développement ordinaire), il tient pour l'affaiblissement (5 justes sur 8).
 */
export const CONTRAST = {
  default: { tempo: 0, maxPly: Infinity },
  affaiblir: { tempo: 8, maxPly: 10 },
  // Un échange de fous se décide tôt ; tard dans la suite, l'écart d'évaluation ne lui est pas attribuable.
  dominer: { tempo: 0, maxPly: 12 },
};
export const GAP = 30;

/**
 * 1 : le concept est le plan de `side` (dans la meilleure suite, calme, contraste réussi) ;
 * 0 : il n'apparaît pas dans la meilleure suite ;
 * null : ambigu (apparaît sans contraste, ou par une suite tactique, ou trop tard) : à exclure.
 * `r` : { fen, evals, pvs } ; `lines` : scanLine de chaque suite.
 */
export function planLabel(r, lines, concept, side) {
  const k = `${concept}_${side}`;
  const p = lines[0][k];
  if (!(p >= 0)) return 0;
  const { tempo, maxPly } = CONTRAST[concept] ?? CONTRAST.default;
  if (p >= maxPly) return null;
  const worse = lines.slice(1).filter((_, i) => r.evals[0] - r.evals[i + 1] >= GAP);
  if (!worse.length || worse.some((l) => l[k] >= 0 && (!tempo || l[k] < p + tempo))) return null;
  return quietReason(r.fen, r.pvs[0], p, concept) ? null : 1;
}
