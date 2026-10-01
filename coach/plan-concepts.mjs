/**
 * Concepts de plan (docs/PLANS-ET-CONCEPTS.md) : états buts vérifiables, par camp, et leur apparition
 * le long d'une suite de coups. Partagé par le générateur d'étiquettes et les planches de contrôle.
 */

import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';
import { squareColor } from '../positional/attack-map.js';
import { detectAtoms } from './atoms.mjs';
import { CONCEPT_LIST } from './concept-list.mjs';

// ── Concepts (états buts vérifiables, par camp) ──
// Chaque détecteur reçoit les faits d'une position et renvoie les couleurs pour lesquelles le concept est vrai.
const has = (facts, id, color, pred = () => true) => facts.some((t) => t.id === id && t.params.color === color && pred(t));
const WEAK_PAWN = new Set(['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE']);
const myRooks = (board, color) => board.board().flat().filter((p) => p && p.type === 'r' && p.color === color);
const relRank = (sq, color) => (color === 'w' ? Number(sq[1]) : 9 - Number(sq[1]));
const CENTRAL = new Set(['d4', 'e4', 'd5', 'e5']);
/** Un pion adverse peut-il (encore) venir attaquer `sq` : pion adverse sur une colonne voisine, devant la case (vu de lui) ? */
const pawnCanAttack = (board, sq, color) => {
  const opp = color === 'w' ? 'b' : 'w';
  const f = sq.charCodeAt(0) - 97;
  const r = Number(sq[1]);
  return board.board().flat().some((p) => p && p.type === 'p' && p.color === opp && Math.abs((p.square.charCodeAt(0) - 97) - f) === 1
    && (opp === 'w' ? Number(p.square[1]) < r : Number(p.square[1]) > r));
};
export const CONCEPTS = {
  tour_colonne: (facts, color) => has(facts, 'TOUR_COLONNE_OUVERTE', color),
  cavalier_avant_poste: (facts, color) => has(facts, 'CAVALIER_AVANT_POSTE', color),
  // ── Lot 1 du catalogue (docs/CATALOGUE-CONCEPTS.md, 1er octobre) : pièces lourdes et pion passé ──
  // A2 Doublement des tours : deux de mes tours sur une même colonne ouverte ou semi-ouverte pour moi.
  doublement_tours: (facts, color, board) => {
    const rooks = myRooks(board, color);
    return rooks.some((a) => rooks.some((b) => b !== a && b.square[0] === a.square[0]
      && facts.some((t) => (t.id === 'COLONNE_OUVERTE' || (t.id === 'COLONNE_SEMI_OUVERTE' && t.params.color === color)) && String(t.params.file) === a.square[0])));
  },
  // A3 Tour à la 7e rangée (le moteur de règles exige roi adverse à la 8e ou pions adverses à la 7e).
  tour_septieme: (facts, color) => has(facts, 'TOUR_7E', color, (t) => t.params.type === 'r'),
  // A4 Tour derrière mon pion passé, sur sa colonne.
  tour_derriere_passe: (facts, color, board) => facts.some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === color
    && myRooks(board, color).some((r) => r.square[0] === t.params.square[0] && relRank(r.square, color) < relRank(t.params.square, color))),
  // A6 Dame centralisée : sur d4/e4/d5/e5, hors de portée des pions adverses.
  dame_centralisee: (facts, color, board) => board.board().flat().some((p) => p && p.type === 'q' && p.color === color && CENTRAL.has(p.square) && !pawnCanAttack(board, p.square, color)),
  // A7 Colonne disputée gagnée : je contrôle une colonne ouverte (CONTROLE_COLONNE).
  colonne_controlee: (facts, color) => has(facts, 'CONTROLE_COLONNE', color),
  // C4 Pion passé créé (nouveau par rapport au départ : vérifié par le cadre « absent au départ »).
  pion_passe: (facts, color) => has(facts, 'PION_PASSE', color) || has(facts, 'PION_PASSE_PROTEGE', color),
  // C6 Pion passé protégé.
  pion_passe_protege: (facts, color) => has(facts, 'PION_PASSE_PROTEGE', color),
  // C5 Pion passé poussé : un pion passé à moi a atteint la 6e rangée (vue de moi) : le cadre exige l'apparition par mon coup.
  pion_passe_avance: (facts, color) => facts.some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === color && relRank(t.params.square, color) >= 6),
  // ── Lot 1, deuxième fournée : développement, centre, roi, espace ──
  // E1 Développement : avance de développement (au moins deux pièces d'écart), gagnée par une sortie de pièce.
  developpement: (facts, color) => has(facts, 'DEVELOPPEMENT', color),
  // E2 Prendre le centre : contrôle du centre, gagné par un pion central.
  centre: (facts, color) => has(facts, 'CONTROLE_CENTRE', color),
  // D1 Roi à l'abri : roi roqué (case de roque, vue de mon camp) derrière un bouclier intact.
  roi_abri: (facts, color, board) => {
    const k = board.board().flat().find((p) => p && p.type === 'k' && p.color === color);
    return Boolean(k) && relRank(k.square, color) === 1 && 'abcgh'.includes(k.square[0]) && has(facts, 'PIONS_ROI_BOUCLIER', color);
  },
  // D10 Roi actif en finale : en finale, mon roi hors de sa première rangée, au centre ou dans le camp adverse.
  roi_actif: (facts, color, board) => {
    if (!facts.some((t) => t.id === 'PHASE' && t.params.phase === 'finale')) return false;
    const k = board.board().flat().find((p) => p && p.type === 'k' && p.color === color);
    return Boolean(k) && (relRank(k.square, color) >= 4 || ('cdef'.includes(k.square[0]) && relRank(k.square, color) >= 3));
  },
  // C14 Gain d'espace.
  gain_espace: (facts, color) => has(facts, 'AVANTAGE_ESPACE', color),
  // C8 Pion passé éloigné : en finale, mon pion passé sur l'aile opposée au roi adverse.
  pion_passe_eloigne: (facts, color, board) => {
    if (!facts.some((t) => t.id === 'PHASE' && t.params.phase === 'finale')) return false;
    const opp = color === 'w' ? 'b' : 'w';
    const k = board.board().flat().find((p) => p && p.type === 'k' && p.color === opp);
    if (!k) return false;
    const kf = k.square.charCodeAt(0) - 97;
    return facts.some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === color && Math.abs(t.params.square.charCodeAt(0) - 97 - kf) >= 4);
  },
  // C9 Fixation : l'adversaire se retrouve avec un mauvais fou (ses pions fixés sur la couleur de son fou), par ma poussée de pion.
  fixation_mauvais_fou: (facts, color) => has(facts, 'FOU_MAUVAIS', color === 'w' ? 'b' : 'w'),
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
  // Lot 1 : le coup calme de la pièce concernée réalise l'état.
  doublement_tours: (m, snap, color) => m.piece === 'r' && myRooks(snap.board, color).some((r) => r.square !== m.to && r.square[0] === m.to[0]),
  tour_septieme: (m, snap, color) => m.piece === 'r' && snap.facts.some((t) => t.id === 'TOUR_7E' && t.params.color === color && t.params.square === m.to),
  tour_derriere_passe: (m, snap, color) => m.piece === 'r' && snap.facts.some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === color && t.params.square[0] === m.to[0] && relRank(m.to, color) < relRank(t.params.square, color)),
  dame_centralisee: (m, snap, color) => m.piece === 'q' && CENTRAL.has(m.to),
  colonne_controlee: (m, snap, color) => (m.piece === 'r' || m.piece === 'q') && snap.facts.some((t) => t.id === 'CONTROLE_COLONNE' && t.params.color === color && String(t.params.file) === m.to[0]),
  pion_passe: (m, snap, color) => m.piece === 'p' && snap.facts.some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === color && t.params.square === m.to),
  pion_passe_protege: (m, snap, color) => m.piece === 'p' && snap.facts.some((t) => t.id === 'PION_PASSE_PROTEGE' && t.params.color === color),
  pion_passe_avance: (m, snap, color) => m.piece === 'p' && relRank(m.to, color) >= 6 && snap.facts.some((t) => (t.id === 'PION_PASSE' || t.id === 'PION_PASSE_PROTEGE') && t.params.color === color && t.params.square === m.to),
  developpement: (m, snap, color) => (m.piece === 'n' || m.piece === 'b') && relRank(m.from, color) === 1,
  centre: (m, snap, color) => m.piece === 'p' && CENTRAL.has(m.to),
  roi_abri: (m) => m.san.startsWith('O-O'),
  roi_actif: (m) => m.piece === 'k',
  gain_espace: (m, snap, color) => m.piece === 'p' && relRank(m.to, color) >= 5,
  pion_passe_eloigne: (m) => m.piece === 'p',
  fixation_mauvais_fou: (m) => m.piece === 'p',
};
/** Tous les concepts étiquetés : coach/concept-list.mjs (sans dépendance) ; vérifié ici contre les états buts codés. */
export { CONCEPT_LIST };
for (const k of Object.keys(CONCEPTS)) if (!CONCEPT_LIST.includes(k)) throw new Error(`concept ${k} absent de coach/concept-list.mjs`);

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
  const leverFiles = { w: [], b: [] }; // colonne (0-7) de chaque levier, même index que levers
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
      if (attacks) { levers[m.color].push(i); leverFiles[m.color].push(m.to.charCodeAt(0) - 97); }
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
        // Ni prise ni échec : un échec force la réponse, ce n'est pas l'exécution calme d'un plan (planche #14 du
        // 30 septembre : « blocage » réalisé par …Cc3+, qui attaque aussi la tour).
        ply = timeline.findIndex((snap, i) => moves[i].color === color && !moves[i].captured && !moves[i].san.includes('+')
          && AGENT[name](moves[i], snap, color) && holds(i, ok));
      }
      out[`${name}_${color}`] = ply;
      // Avant-poste : l'adversaire peut-il encore échanger le cavalier (fou de la couleur, cavalier) ?
      if (name === 'cavalier_avant_poste' && ply >= 0) {
        const t = timeline[ply].facts.find((f) => f.id === 'CAVALIER_AVANT_POSTE' && f.params.color === color && f.params.square === moves[ply].to);
        out[`cavalier_avant_poste_echangeable_${color}`] = t ? Boolean(t.params.echangeable) : null;
        out[`cavalier_avant_poste_rangee_${color}`] = t?.params.rangee ?? null;
        out[`cavalier_avant_poste_colonne_${color}`] = t?.params.colonne ?? null;
      }
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
    // Pour l'explication : la colonne ouverte, et LE levier qui l'a ouverte (le dernier, avant l'ouverture, sur
    // cette colonne ou une voisine) ; à défaut le premier levier du camp.
    const fileIdx = ply >= 0 ? fresh[0].charCodeAt(0) - 97 : -1;
    const near = ply >= 0 ? levers[color].map((l, k) => [l, leverFiles[color][k]]).filter(([l, f]) => l <= ply && Math.abs(f - fileIdx) <= 1) : [];
    out[`rupture_levier_${color}`] = ply >= 0 ? (near.at(-1)?.[0] ?? levers[color][0]) : -1;
    out[`rupture_colonne_${color}`] = ply >= 0 ? fresh[0] : null;
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
    let weakness = null;
    for (let i = 0; i < timeline.length && ply < 0; i++) {
      const fresh = timeline[i].facts.filter((t) => t.params.color === opp).map((t) => [weakKey(t), t])
        .filter(([k]) => k && !had.has(k) && holds(i, (s) => s.facts.some((u) => u.params.color === opp && weakKey(u) === k)));
      if (!fresh.length) continue;
      const m = moves[i];
      const prev = moves[i - 1];
      const t = fresh[0][1];
      const wFile = (t.params.file ?? t.params.square?.[0] ?? String(t.params.files ?? '')[0] ?? '').charCodeAt(0) - 97;
      // Le moyen doit être lié à la faiblesse : la reprise de pion qui la crée, ou un levier voisin de sa colonne.
      const lever = levers[color].map((l, k) => [l, leverFiles[color][k]]).filter(([l, f]) => l <= i && (wFile < 0 || Math.abs(f - wFile) <= 1)).at(-1);
      // Échange : la reprise de pion doit créer la faiblesse, donc être sur sa colonne ou une voisine (planche #25 du
      // 30 septembre : reprise …dxe4 créditée d'un pion arriéré en b7, sans rapport).
      const nearFile = (sq) => wFile < 0 || Math.abs(sq.charCodeAt(0) - 97 - wFile) <= 1;
      if (m.color === opp && m.piece === 'p' && m.captured && m.captured !== 'p' && prev?.color === color && prev.captured
        && (nearFile(m.from) || nearFile(m.to))) means = 'echange';
      else if (lever) means = 'poussee';
      else continue; // faiblesse sans moyen identifiable du camp : pas un plan de ce type
      ply = i;
      out[`affaiblir_levier_${color}`] = means === 'poussee' ? lever[0] : -1;
      weakness = { id: t.id, square: t.params.square ?? null, file: t.params.file ?? null };
      const file = t.params.file ?? t.params.square?.[0] ?? String(t.params.files ?? '')[0];
      wing = file && 'efgh'.includes(file) ? 'roi' : file ? 'dame' : null;
    }
    out[`affaiblir_${color}`] = ply;
    out[`affaiblir_moyen_${color}`] = means;
    out[`affaiblir_faiblesse_${color}`] = weakness;
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
    // Étage 3, exploitation : après l'échange, une de mes pièces (pas un pion) s'installe sur un des trous de
    // cette couleur, ou mon fou de cette couleur ou ma dame donne échec. Demi-coup, ou -1 (pas encore dans la suite).
    let exploit = -1;
    if (ply >= 0) {
      const holesOf = (snap) => new Set(snap.facts.filter((t) => t.id === 'COMPLEXE_FAIBLE' && t.params.color === opp && t.params.shade === shadeOut)
        .flatMap((t) => String(t.params.squares).split(',')));
      exploit = timeline.findIndex((snap, i) => i > ply && moves[i].color === color && (
        (moves[i].piece !== 'p' && holesOf(snap).has(moves[i].to))
        || (moves[i].san.includes('+') && (moves[i].piece === 'q' || moves[i].piece === 'b') && squareColor(moves[i].to) === shadeOut)));
    }
    out[`dominer_exploite_${color}`] = exploit;
  }
  // ── Recettes (§3 bis) : moyen → déséquilibre → exploitation, sur les atomes et les faits ──
  const { atoms } = detectAtoms(fen, pv.slice(0, PLIES), PLIES);
  out.atomes = atoms;
  for (const color of COLORS) {
    const opp = color === 'w' ? 'b' : 'w';
    const has = (snap, id, col, pred = () => true) => snap.facts.some((t) => t.id === id && t.params.color === col && pred(t));
    // Attaque de minorité : structure Carlsbad du camp au départ ; levier du camp sur la colonne b (b4-b5 ou b5-b4)
    // ; puis pion c adverse faible (isolé ou arriéré) ou colonne b ouverte pour le camp, et ça tient ; exploitation :
    // une tour du camp sur la colonne b ou c.
    let ply = -1;
    let exploit = -1;
    if (has(start, 'STRUCTURE', color, (t) => t.params.name === 'CARLSBAD')) {
      const lever = atoms.find((a) => a.kind === 'levier' && a.side === color && a.file === 'b');
      if (lever) {
        const weak = (snap) => snap.facts.some((t) => (t.id === 'PION_ISOLE' || t.id === 'PION_ARRIERE' || t.id === 'PION_FAIBLE') && t.params.color === opp && String(t.params.square ?? '')[0] === 'c')
          || snap.facts.some((t) => t.id === 'COLONNE_OUVERTE' && String(t.params.file) === 'b')
          || snap.facts.some((t) => t.id === 'COLONNE_SEMI_OUVERTE' && t.params.color === color && String(t.params.file) === 'b');
        ply = timeline.findIndex((snap, i) => i >= lever.ply && weak(snap) && holds(i, weak));
        if (ply >= 0) exploit = timeline.findIndex((snap, i) => i > ply && moves[i].color === color && moves[i].piece === 'r' && 'bc'.includes(moves[i].to[0]));
      }
    }
    out[`attaque_minorite_${color}`] = ply;
    out[`attaque_minorite_exploite_${color}`] = exploit;

    // Attaque à la baïonnette : l'adversaire a roqué petit derrière un fianchetto (pion g6 ou g3) ; levier du camp
    // sur la colonne h (h4-h5 ou h5-h4) ; puis bouclier du roi adverse affaibli, et ça tient ; exploitation : dame ou
    // tour du camp sur la colonne h, ou échange du fou de fianchetto.
    ply = -1; exploit = -1;
    const kingSq = start.board.board().flat().find((p) => p && p.type === 'k' && p.color === opp)?.square;
    const fianchetto = kingSq && 'gh'.includes(kingSq[0]) && start.board.get(opp === 'w' ? 'g3' : 'g6')?.type === 'p';
    if (fianchetto) {
      const lever = atoms.find((a) => a.kind === 'levier' && a.side === color && a.file === 'h');
      if (lever) {
        const broken = (snap) => has(snap, 'PIONS_ROI_AFFAIBLI', opp);
        ply = timeline.findIndex((snap, i) => i >= lever.ply && broken(snap) && holds(i, broken));
        if (ply >= 0) exploit = timeline.findIndex((snap, i) => i > ply && moves[i].color === color && ((moves[i].piece === 'q' || moves[i].piece === 'r') && moves[i].to[0] === 'h'));
      }
    }
    out[`baionnette_${color}`] = ply;
    out[`baionnette_exploite_${color}`] = exploit;
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
 * `r` : { fen, evals, pvs } ; `lines` : scanLine de chaque suite ; `override` : { maxPly, consensus }.
 *   maxPly : le coach borne l'horizon à ce qu'il peut raconter maintenant.
 *   consensus : quand AUCUNE suite n'est nettement moins bonne (coups qui se valent, cas fréquent en direct),
 *   le concept est le plan s'il apparaît dans TOUTES les suites équivalentes (des ordres de coups différents
 *   qui mènent au même état but renforcent l'étiquette, §4) ; sinon ambigu.
 */
export function planLabel(r, lines, concept, side, override = {}) {
  const k = `${concept}_${side}`;
  const p = lines[0][k];
  if (!(p >= 0)) return 0;
  const rule = CONTRAST[concept] ?? CONTRAST.default;
  const tempo = rule.tempo;
  const maxPly = Math.min(rule.maxPly, override.maxPly ?? Infinity);
  if (p >= maxPly) return null;
  const worse = lines.slice(1).filter((_, i) => r.evals[0] - r.evals[i + 1] >= GAP);
  if (!worse.length) {
    const others = lines.slice(1);
    if (!override.consensus || !others.length || !others.every((l) => l[k] >= 0)) return null;
  } else if (worse.some((l) => l[k] >= 0 && (!tempo || l[k] < p + tempo))) return null;
  return quietReason(r.fen, r.pvs[0], p, concept) ? null : 1;
}
