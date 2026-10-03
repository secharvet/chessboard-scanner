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
/** Mes pièces (ni pion ni roi) qui attaquent au moins une case de la zone du roi adverse (roi + huit voisines). */
export const zoneAttackers = (board, color) => {
  const opp = color === 'w' ? 'b' : 'w';
  const k = board.board().flat().find((p) => p && p.type === 'k' && p.color === opp);
  if (!k) return 0;
  const f = k.square.charCodeAt(0), r = Number(k.square[1]);
  const set = new Set();
  for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
    const ff = f + df, rr = r + dr;
    if (ff < 97 || ff > 104 || rr < 1 || rr > 8) continue;
    for (const a of board.attackers(String.fromCharCode(ff) + rr, color)) { const p = board.get(a); if (p && p.type !== 'p' && p.type !== 'k') set.add(a); }
  }
  return set.size;
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
  // ── Lot 1, troisième fournée : structure, pièces, roi, prophylaxie ──
  // C7 Avance de la majorité : sur l'aile où j'ai plus de pions, mon pion le plus avancé a atteint la 5e rangée.
  majorite_avance: (facts, color, board) => ['MAJORITE_AILE_DAME', 'MAJORITE_AILE_ROI'].some((id) => has(facts, id, color)
    && board.board().flat().some((p) => p && p.type === 'p' && p.color === color && (id === 'MAJORITE_AILE_DAME' ? 'abcd' : 'efgh').includes(p.square[0]) && relRank(p.square, color) >= 5)),
  // B10 Surprotection : un de mes pions centraux (d/e, 4e-6e rangée) défendu par au moins trois de mes pièces.
  surprotection: (facts, color, board) => board.board().flat().some((p) => p && p.type === 'p' && p.color === color && 'de'.includes(p.square[0]) && relRank(p.square, color) >= 4
    && board.attackers(p.square, color).length >= 3),
  // C12 Pion dame isolé poussé : j'ai la structure PDI et mon pion d a atteint la 5e rangée.
  pdi_poussee: (facts, color, board) => has(facts, 'STRUCTURE', color, (t) => t.params.name === 'PDI')
    && board.board().flat().some((p) => p && p.type === 'p' && p.color === color && p.square[0] === 'd' && relRank(p.square, color) >= 5),
  // D3 Tempête de pions sur roques opposés : roques opposés, et un de mes pions sur l'aile du roi adverse a atteint la 5e rangée.
  tempete_roques_opposes: (facts, color, board) => {
    if (!facts.some((t) => t.id === 'ROQUES_OPPOSES')) return false;
    const opp = color === 'w' ? 'b' : 'w';
    const k = board.board().flat().find((p) => p && p.type === 'k' && p.color === opp);
    if (!k) return false;
    const wing = k.square[0] <= 'c' ? 'abc' : k.square[0] >= 'f' ? 'fgh' : null;
    return Boolean(wing) && board.board().flat().some((p) => p && p.type === 'p' && p.color === color && wing.includes(p.square[0]) && relRank(p.square, color) >= 5);
  },
  // D6 Attaque du roi : au moins trois de mes pièces (ni pion ni roi) attaquent une case de la zone du roi adverse
  // (le roi et ses huit voisines). Mesure du 2 octobre sur 3 000 positions de test : l'ancien état (trois pièces à
  // distance ≤ 2 du roi) n'apparaissait calmement que 8 fois, celui-ci 219 fois dont 52 tenues six demi-coups.
  attaque_roi_pieces: (facts, color, board) => zoneAttackers(board, color) >= 3,
  // E12 Pièce passive réactivée : je n'ai plus de pièce passive (le cadre exige qu'il y en ait eu une au départ).
  piece_reactivee: (facts, color) => !has(facts, 'PIECE_PASSIVE', color),
  // E11 Prophylaxie : l'adversaire n'a plus de levier disponible (il en avait au départ) après mon coup calme.
  prophylaxie_levier: (facts, color) => !has(facts, 'LEVIER_DISPONIBLE', color === 'w' ? 'b' : 'w'),
  // ── Lot 1, quatrième fournée : les sacrifices (l'état but n'apparaît qu'après la prise adverse : DELAY = 2) ──
  // E9 Gambit : dans l'ouverture, un pion de moins contre une avance de développement, le centre ou un roi adverse au centre.
  gambit: (facts, color) => {
    const opp = color === 'w' ? 'b' : 'w';
    return facts.some((t) => t.id === 'PHASE' && t.params.phase === 'ouverture')
      && has(facts, 'AVANTAGE_MATERIEL', opp, (t) => t.params.score === 1)
      && (has(facts, 'DEVELOPPEMENT', color) || has(facts, 'CONTROLE_CENTRE', color) || has(facts, 'ROI_AU_CENTRE', opp, (t) => !t.params.canCastle));
  },
  // E8 Sacrifice positionnel de pion (milieu, finale) : un pion de moins contre un déséquilibre durable à moi.
  sacrifice_pion: (facts, color) => {
    const opp = color === 'w' ? 'b' : 'w';
    return !facts.some((t) => t.id === 'PHASE' && t.params.phase === 'ouverture')
      && has(facts, 'AVANTAGE_MATERIEL', opp, (t) => t.params.score === 1)
      && (has(facts, 'PION_PASSE', color) || has(facts, 'PION_PASSE_PROTEGE', color) || has(facts, 'CAVALIER_AVANT_POSTE', color)
        || has(facts, 'TOUR_COLONNE_OUVERTE', color) || has(facts, 'COMPLEXE_FAIBLE', opp) || has(facts, 'ROI_AU_CENTRE', opp, (t) => !t.params.canCastle));
  },
  // E10 Sacrifice de qualité : deux points de moins contre la paire de fous, un avant-poste ou un complexe faible adverse.
  sacrifice_qualite: (facts, color) => {
    const opp = color === 'w' ? 'b' : 'w';
    return has(facts, 'AVANTAGE_MATERIEL', opp, (t) => t.params.score === 2)
      && (has(facts, 'PAIRE_FOUS', color) || has(facts, 'CAVALIER_AVANT_POSTE', color) || has(facts, 'COMPLEXE_FAIBLE', opp) || has(facts, 'PION_PASSE_PROTEGE', color));
  },
  // D8 Regroupement défensif : au moins deux de mes pièces près de mon roi alors que des pièces adverses rôdent.
  regroupement_defensif: (facts, color, board) => {
    const opp = color === 'w' ? 'b' : 'w';
    const k = board.board().flat().find((p) => p && p.type === 'k' && p.color === color);
    if (!k) return false;
    const d = (a, b) => Math.max(Math.abs(a.charCodeAt(0) - b.charCodeAt(0)), Math.abs(Number(a[1]) - Number(b[1])));
    const raiders = board.board().flat().filter((p) => p && p.color === opp && p.type !== 'p' && p.type !== 'k' && d(p.square, k.square) <= 3).length;
    const guards = board.board().flat().filter((p) => p && p.color === color && p.type !== 'p' && p.type !== 'k' && d(p.square, k.square) <= 2).length;
    return raiders >= 2 && guards >= 2;
  },
  // Blocage : un cavalier ou un fou installé juste devant un pion adverse que ses pions ne pourront plus chasser
  // (le pion bloqué n'a plus de pion voisin derrière ou à sa hauteur : isolé, arriéré, base de chaîne, doublé de
  // tête) ou devant un pion passé. Vérité de terrain du 1er octobre : « la case devant un pion faible est à l'abri
  // de ce pion ; la pièce bloqueuse s'y installe à l'abri d'une poussée frontale ».
  blocage: (facts, color, board) => board.board().flat().some((p) => p && p.type === 'p' && p.color !== color
    && blocked(facts, board, p.square, p.color, color)),
};
/** `sq` porte un pion adverse (couleur `pc`) ; ma pièce mineure est devant lui et aucun pion adverse ne pourra la chasser. */
export const blocked = (facts, board, sq, pc, color) => {
  const front = `${sq[0]}${Number(sq[1]) + (pc === 'w' ? 1 : -1)}`;
  const b = board.get(front);
  if (!b || b.color !== color || (b.type !== 'n' && b.type !== 'b')) return false;
  return !pawnCanAttack(board, front, color) || has(facts, 'PION_PASSE', pc, (t) => t.params.square === sq);
};
export const blockadeTarget = (board, sq, color) => {
  const pc = color === 'w' ? 'b' : 'w';
  const pawnSq = `${sq[0]}${Number(sq[1]) + (pc === 'w' ? -1 : 1)}`;
  const p = board.get(pawnSq);
  return p && p.type === 'p' && p.color === pc ? pawnSq : null;
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
  blocage: (m, snap, color) => {
    if (m.piece !== 'n' && m.piece !== 'b') return false;
    const pawnSq = blockadeTarget(snap.board, m.to, color);
    return Boolean(pawnSq) && blocked(snap.facts, snap.board, pawnSq, color === 'w' ? 'b' : 'w', color);
  },
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
  majorite_avance: (m, snap, color) => m.piece === 'p' && relRank(m.to, color) >= 5,
  surprotection: (m, snap, color) => m.piece !== 'p' && m.piece !== 'k' && snap.board.board().flat().some((p) => p && p.type === 'p' && p.color === color && 'de'.includes(p.square[0]) && snap.board.attackers(p.square, color).includes(m.to)),
  pdi_poussee: (m, snap, color) => m.piece === 'p' && m.from[0] === 'd' && relRank(m.to, color) >= 5,
  tempete_roques_opposes: (m, snap, color) => m.piece === 'p' && relRank(m.to, color) >= 5,
  attaque_roi_pieces: (m) => m.piece !== 'p' && m.piece !== 'k',
  piece_reactivee: (m) => m.piece !== 'p' && m.piece !== 'k',
  // Prophylaxie : seulement si c'est MON coup qui retire le levier (atome restriction), pas un hasard de la position.
  prophylaxie_levier: (m, snap, color, i, atoms) => atoms.some((a) => a.kind === 'restriction' && a.side === color && a.ply === i),
  // Sacrifices : mon coup calme offre le matériel, l'atome « perte » le constate dans les demi-coups qui suivent.
  gambit: (m, snap, color, i, atoms) => m.piece === 'p' && atoms.some((a) => a.kind === 'perte' && a.side === color && a.ply >= i && a.ply <= i + 3),
  sacrifice_pion: (m, snap, color, i, atoms) => m.piece !== 'k' && atoms.some((a) => a.kind === 'perte' && a.side === color && a.pawns === 1 && a.ply >= i && a.ply <= i + 3),
  sacrifice_qualite: (m, snap, color, i, atoms) => m.piece === 'r' && atoms.some((a) => a.kind === 'perte' && a.side === color && a.pawns === 2 && a.ply >= i && a.ply <= i + 3),
  regroupement_defensif: (m, snap, color, i, atoms) => atoms.some((a) => a.kind === 'regroupement' && a.side === color && a.ply === i),
};
/** Décalage entre mon coup (l'agent) et l'état but : 2 demi-coups pour un sacrifice (il faut que l'adversaire prenne). */
const DELAY = { gambit: 2, sacrifice_pion: 2, sacrifice_qualite: 2 };
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
  // Atomes (moyens) : calculés d'abord, car certains agents en ont besoin (prophylaxie = atome restriction).
  const { atoms } = detectAtoms(fen, pv.slice(0, PLIES), PLIES);
  /** La condition est-elle vraie du demi-coup i jusqu'à i + HOLD (ou jusqu'au bout de la suite) ? */
  const holds = (i, pred) => timeline.slice(i, i + HOLD + 1).every(pred);
  for (const [name, test] of Object.entries(CONCEPTS)) {
    for (const color of COLORS) {
      let ply = -1;
      const ok = (snap) => test(snap.facts, color, snap.board);
      if (!ok(start)) {
        // Ni prise ni échec : un échec force la réponse, ce n'est pas l'exécution calme d'un plan (planche #14 du
        // 30 septembre : « blocage » réalisé par …Cc3+, qui attaque aussi la tour).
        const delay = DELAY[name] ?? 0;
        ply = timeline.findIndex((snap, i) => moves[i].color === color && !moves[i].captured && !moves[i].san.includes('+')
          && i + delay < timeline.length && AGENT[name](moves[i], snap, color, i, atoms) && holds(i + delay, ok));
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
  // Rupture, en deux étages (Kmoch ; décision de l'auteur du 2 octobre 2026). Le LEVIER est le moyen : poussée de
  // pion du camp qui attaque un pion adverse. La RUPTURE RÉALISÉE est le levier résolu par une prise de pion (l'un des
  // deux pions prend l'autre) qui ouvre ou semi-ouvre une colonne nouvelle, pour l'un ou l'autre camp, et qui tient.
  // Autres issues du levier : contourné (un des deux pions avance), dissous (une pièce prend l'un des pions : à part,
  // souvent un sacrifice de rupture), tension (rien dans la suite). On enregistre quelle colonne s'ouvre et pour qui ;
  // l'évaluation appartient à l'étage du déséquilibre. Le plan est attribué au camp qui a poussé et daté au levier
  // (l'initiative), jamais à la reprise.
  for (const color of COLORS) {
    const opp = color === 'w' ? 'b' : 'w';
    const dir = color === 'w' ? 1 : -1;
    const recs = levers[color].map((L) => {
      const S = moves[L].to;
      const targets = [-1, 1].map((d) => `${String.fromCharCode(S.charCodeAt(0) + d)}${Number(S[1]) + dir}`)
        .filter((sq) => { const q = timeline[L].board.get(sq); return q && q.type === 'p' && q.color === opp; });
      const rec = { levier: L, issue: 'tension', at: -1, colonne: null, colonneAdverse: null, tour: false };
      for (let i = L + 1; i < moves.length; i++) {
        const x = moves[i];
        if (x.piece === 'p' && x.captured === 'p' && ((x.from === S && targets.includes(x.to)) || (targets.includes(x.from) && x.to === S))) { rec.issue = 'prise'; rec.at = i; break; }
        if (x.piece === 'p' && !x.captured && (x.from === S || targets.includes(x.from))) { rec.issue = 'contournee'; rec.at = i; break; }
        if (x.captured && (x.to === S || targets.includes(x.to))) { rec.issue = 'dissoute'; rec.at = i; break; }
      }
      if (rec.issue === 'prise') {
        const prior = L > 0 ? timeline[L - 1].facts : start.facts;
        const before = { me: openFiles(prior, color), his: openFiles(prior, opp) };
        // La colonne nouvelle se lit à la FIN de l'échange (après les reprises sur la même case), pas au milieu :
        // après d5 exd5, la colonne e est semi-ouverte pour lui un demi-coup, puis ouverte pour les deux après exd5.
        let end = rec.at;
        while (end + 1 < moves.length && moves[end + 1].captured && moves[end + 1].to === moves[end].to) end++;
        rec.fin = end;
        rec.colonne = [...openFiles(timeline[end].facts, color)].find((f) => !before.me.has(f) && holds(end, (s) => openFiles(s.facts, color).has(f))) ?? null;
        rec.colonneAdverse = [...openFiles(timeline[end].facts, opp)].find((f) => !before.his.has(f) && holds(end, (s) => openFiles(s.facts, opp).has(f))) ?? null;
        if (rec.colonne) rec.tour = timeline.slice(end).some((snap) => snap.board.board().flat().some((q) => q && q.type === 'r' && q.color === color && q.square[0] === rec.colonne));
      }
      return rec;
    });
    const done = recs.find((r) => r.issue === 'prise' && (r.colonne || r.colonneAdverse));
    out[`rupture_${color}`] = done ? done.levier : -1;
    out[`rupture_levier_${color}`] = done ? done.levier : -1;
    out[`rupture_prise_${color}`] = done ? done.at : -1;
    out[`rupture_colonne_${color}`] = done?.colonne ?? null;
    out[`rupture_colonne_adverse_${color}`] = done?.colonneAdverse ?? null;
    out[`rupture_tour_${color}`] = Boolean(done?.tour);
    out[`rupture_leviers_${color}`] = recs;
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
      // Le plan est daté au coup du camp qui prend l'initiative, jamais à la reprise adverse (vérité de terrain du
      // 2 octobre : les cinq planches positives surlignaient la reprise de pion de l'adversaire, refusées toutes les
      // cinq ; l'auteur : « la reprise est la réponse forcée, elle ne porte pas le plan »).
      ply = means === 'echange' ? i - 1 : i;
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

  // Dominer une couleur (plan à étages ; règles de l'auteur, vérité de terrain du 2 octobre, 2 justes sur 10 avant) :
  //  1. la position se juge une fois l'échange TERMINÉ (plus de prise sur la case dans les deux demi-coups qui
  //     suivent, échanges intercalés compris) ;
  //  2. après l'échange, j'ai encore un fou de la couleur S et l'adversaire n'en a plus ;
  //  3. c'est MOI qui prends son fou : ma prise n'est pas une reprise, sauf si elle reprend une pièce que j'ai
  //     offerte (Cd6+ Fxd6 exd6) ; le plan est alors daté à l'offre, l'initiative ; une prise forcée par un échec
  //     adverse n'est pas mon plan ;
  //  4. mon fou conservé n'est pas un mauvais fou (fait FOU_MAUVAIS, ou au moins trois quarts de mes pions sur sa couleur) ;
  //  5. il est encore sur l'échiquier au bout de la tenue ;
  //  et le complexe de cases S adverse est faible (COMPLEXE_FAIBLE « avec fou ennemi »), apparu avec l'échange et tenu.
  for (const color of COLORS) {
    const opp = color === 'w' ? 'b' : 'w';
    const dominated = (snap, shade) => snap.facts.some((t) => t.id === 'COMPLEXE_FAIBLE' && t.params.color === opp && t.params.shade === shade && t.params.enemyBishop);
    const offered = (i) => moves[i - 1]?.captured && moves[i - 1].to === moves[i].to
      && moves[i - 1].piece === 'b' && moves[i - 2]?.color === color && !moves[i - 2].captured && moves[i - 2].to === moves[i].to;
    const recapture = (i) => Boolean(moves[i - 1]?.captured && moves[i - 1].to === moves[i].to);
    const forcedByCheck = (i) => Boolean(moves[i - 1]?.san.includes('+'));
    const bishopsOf = (board, c, shade) => board.board().flat().filter((q) => q && q.type === 'b' && q.color === c && squareColor(q.square) === shade);
    const pawnsOnShade = (board, c, shade) => { const ps = board.board().flat().filter((q) => q && q.type === 'p' && q.color === c); return ps.length ? ps.filter((q) => squareColor(q.square) === shade).length / ps.length : 0; };
    let ply = -1;
    let shadeOut = null;
    for (let i = 0; i < moves.length && ply < 0; i++) {
      const m = moves[i];
      if (m.color !== color || m.captured !== 'b') continue;
      if (recapture(i) && !offered(i)) continue;
      if (forcedByCheck(i)) continue;
      const shade = squareColor(m.to);
      if (dominated(start, shade)) continue; // déjà établi au départ
      // Règle 1 : fin de l'échange sur cette case.
      let end = i;
      while (end + 2 < moves.length && (moves[end + 1].captured || moves[end + 2].captured) && (moves[end + 1].to === m.to || moves[end + 2].to === m.to)) end += (moves[end + 1].captured && moves[end + 1].to === m.to) ? 1 : 2;
      const after = timeline[end].board;
      // Règles 2, 4, 5.
      const mine = bishopsOf(after, color, shade);
      if (!mine.length || bishopsOf(after, opp, shade).length) continue;
      // Règle 4 : le fait FOU_MAUVAIS (pions centraux fixés sur sa couleur), ou presque tous mes pions sur sa couleur.
      // Le seuil « la moitié » proposé par l'auteur rejetait sa propre planche 6 (4 pions blancs sur 7 en cases claires).
      const bad = timeline[end].facts.some((t) => t.id === 'FOU_MAUVAIS' && t.params.color === color && mine.some((q) => q.square === t.params.square));
      if (bad || pawnsOnShade(after, color, shade) >= 0.75) continue;
      const last = timeline[Math.min(end + HOLD, timeline.length - 1)].board;
      if (!bishopsOf(last, color, shade).length) continue;
      if (holds(end, (s) => dominated(s, shade))) { ply = offered(i) ? i - 2 : i; shadeOut = shade; }
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
