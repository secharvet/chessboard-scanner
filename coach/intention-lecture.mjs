/**
 * De la prévision à l'intention (8 octobre 2026, étage 2). Le lecteur (modèle brut) prédit, pour chaque camp, les cases de
 * départ et d'arrivée des prochains coups. Ici on relie ces cases à des coups LÉGAUX de la position et on décrit, mécaniquement,
 * ce que chaque coup ferait : prise, échec, pièces attaquées (et si elles sont défendues), levier de pion, approche du roi.
 * Aucune règle ne choisit le plan : c'est le modèle qui désigne les cases ; le code ne fait que lire l'échiquier.
 */
import { Chess } from 'chess.js';
import { pieceRef } from './brief.mjs';

const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const NOM = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const LE = { p: 'le pion', n: 'le cavalier', b: 'le fou', r: 'la tour', q: 'la dame', k: 'le roi' };
const SQ = (s) => [s.charCodeAt(0) - 97, Number(s[1]) - 1];
const dist = (a, b) => { const [x1, y1] = SQ(a); const [x2, y2] = SQ(b); return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)); };

/** Position où `color` est au trait (si ce n'est pas le cas : on retourne le trait, sans prise en passant). */
function withTurn(fen, color) {
  const parts = fen.split(' '); if (parts[1] === color) return new Chess(fen);
  parts[1] = color; parts[3] = '-'; try { return new Chess(parts.join(' ')); } catch { return null; }
}
function attackersOf(c, square, byColor) {
  try { return c.attackers(square, byColor); } catch { return []; }
}
function kingSquare(c, color) { const b = c.board(); for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const p = b[r][f]; if (p && p.type === 'k' && p.color === color) return 'abcdefgh'[f] + (8 - r); } return null; }

/** Effets d'un coup `m` (verbose) joué par `color` dans `c` (c est au trait pour color). */
function effets(c, m, color) {
  const other = color === 'w' ? 'b' : 'w'; const t = new Chess(c.fen()); t.move(m.san);
  const out = { san: m.san, piece: m.piece, to: m.to, prise: m.captured ? NOM[m.captured] : null, echec: /[+#]/.test(m.san), mat: m.san.includes('#'), attaque: [], levier: false, roi: 0, ouvre: false };
  // pièces adverses attaquées par la pièce arrivée (hors roi), avec défense
  const board = t.board();
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
    const p = board[r][f]; if (!p || p.color !== other || p.type === 'k') continue;
    const sq = 'abcdefgh'[f] + (8 - r);
    if (!attackersOf(t, sq, color).includes(m.to)) continue;
    const def = attackersOf(t, sq, other).length; const gagnant = def === 0 || VAL[p.type] > VAL[m.piece];
    if (gagnant) out.attaque.push({ type: p.type, sq, defendu: def > 0 });
    if (p.type === 'p' && m.piece === 'p') out.levier = true;
  }
  const k = kingSquare(t, other); if (k) out.roi = dist(m.to, k);
  // mobilité gagnée par les tours/dame du camp sur la colonne du pion avancé (ouverture)
  if (m.piece === 'p' && m.captured) out.ouvre = true;
  return out;
}

function phrase(e, color, toi) {
  const qui = toi ? 'tu' : 'il'; const bits = [];
  if (e.mat) return `${e.san} serait mat.`;
  if (e.prise) bits.push(`prend ${e.prise === 'pion' ? 'un pion' : 'le ' + e.prise}`);
  if (e.echec) bits.push('donne échec');
  const att = e.attaque.filter((a) => !a.defendu).slice(0, 2); const att2 = e.attaque.filter((a) => a.defendu).slice(0, 1);
  if (att.length) bits.push(`attaque ${att.map((a) => `${NOM[a.type]} ${a.sq} non défendu${a.type === 'r' || a.type === 'q' ? 'e' : ''}`).join(' et ')}`);
  else if (att2.length) bits.push(`attaque ${att2.map((a) => `${NOM[a.type]} ${a.sq}`).join(' et ')}`);
  if (e.levier) bits.push('fait levier contre la chaîne de pions');
  if (!bits.length && e.roi <= 2 && e.piece !== 'k') bits.push(`s'approche du roi (${e.roi === 1 ? 'au contact' : 'à deux cases'})`);
  if (!bits.length) return '';
  return `${toi ? 'Toi' : 'Lui'} : ${e.san} ${bits.join(', ')}.`;
}

/**
 * @param {string} fen position courante (après le dernier coup joué) ; @param {object} l lecture du modèle ({attendu, depart} par couleur)
 * @param {'w'|'b'} toi couleur du joueur conseillé
 * @returns {{ texte: string, pourToi: object[], pourLui: object[], menaces: string[] }}
 */
export function expliquerLecture(fen, l, toi) {
  if (!l || l.tropTot || !l.attendu || !l.depart) return { texte: '', pourToi: [], pourLui: [], menaces: [] };
  const res = { texte: '', pourToi: [], pourLui: [], menaces: [] }; const phrases = [];
  for (const color of ['w', 'b']) {
    const c = withTurn(fen, color); if (!c) continue;
    const pTo = Object.fromEntries((l.attendu[color] ?? []).map((x) => [x.case, x.p])); const pFrom = Object.fromEntries((l.depart[color] ?? []).map((x) => [x.case, x.p]));
    let cands = [];
    for (const m of c.moves({ verbose: true })) {
      const score = (pTo[m.to] ?? 0.02) * (pFrom[m.from] ?? 0.02); if (score < 0.02) continue;
      cands.push({ score, m });
    }
    cands.sort((a, b) => b.score - a.score); cands = cands.slice(0, 3).map((x) => ({ score: x.score, ...effets(c, x.m, color) }));
    const est = color === toi; (est ? res.pourToi : res.pourLui).push(...cands);
    let dit = false;
    for (const e of cands) { const ph = phrase(e, color, est); if (ph) { phrases.push({ score: e.score, ph }); dit = true; if (!est && (e.attaque.some((a) => !a.defendu) || e.mat || e.echec)) res.menaces.push(ph); break; } }
    if (!dit && cands.length) {
      // pas d'effet immédiat : on dit au moins quelle pièce le modèle attend, et vers où
      const e = cands[0]; const alt = cands.slice(1).map((x) => x.san).filter((x) => x !== e.san).slice(0, 1);
      phrases.push({ score: e.score * 0.8, ph: `${est ? 'Toi' : 'Lui'} : d'après des parties semblables, c'est surtout ${LE[e.piece]} qui devrait bouger (${e.san}${alt.length ? ' ou ' + alt[0] : ''}), sans menace immédiate.` });
    }
  }
  // Intention d'ensemble : si les cases prévues d'un camp convergent vers le roi adverse, ou vers une aile, on le dit,
  // en s'appuyant sur les thèmes lus (attaque du roi, aile dame, levier) ; sinon on se tait.
  const th = Object.fromEntries((l.themes ?? []).map((t) => [t.theme, t.p]));
  const base = new Chess(fen);
  for (const color of ['w', 'b']) {
    const est = color === toi; const other = color === 'w' ? 'b' : 'w'; const k = kingSquare(base, other);
    const top = (l.attendu[color] ?? []).filter((x) => x.p >= 0.3).slice(0, 4); if (top.length < 2) continue;
    const pres = k ? top.filter((x) => dist(x.case, k) <= 2).length : 0;
    const files = top.map((x) => x.case.charCodeAt(0) - 97); const aileD = files.filter((f) => f <= 2).length; const aileR = files.filter((f) => f >= 5).length;
    const liste = (pred) => top.filter(pred).slice(0, 3).map((x) => x.case).join(', ');
    let ph = '';
    if (pres >= 2 && (th.attaque_roi ?? 0) >= 0.3) { const cases = liste((x) => dist(x.case, k) <= 2); ph = est ? `Intention pour toi : les parties semblables continuent par une attaque contre son roi (cases ${cases}).` : `Intention adverse : d'après les parties semblables, il prépare une attaque contre ton roi (cases ${cases}) ; surveille ton abri.`; }
    else if (aileD >= 3 && (th.aile_dame ?? 0) >= 0.25) { const cases = liste((x) => x.case.charCodeAt(0) - 97 <= 2); ph = est ? `Intention pour toi : le jeu se poursuit à l'aile dame (${cases}).` : `Intention adverse : il va pousser à l'aile dame (${cases}).`; }
    else if (aileR >= 3) { const cases = liste((x) => x.case.charCodeAt(0) - 97 >= 5); ph = est ? `Intention pour toi : les coups attendus se concentrent à l'aile roi (${cases}).` : `Intention adverse : ses coups attendus se concentrent à l'aile roi (${cases}).`; }
    if (ph) res.intentions = [...(res.intentions ?? []), ph];
  }
  phrases.sort((a, b) => b.score - a.score);
  res.texte = [...(res.intentions ?? []), ...phrases.map((x) => x.ph)].join(' ');
  return res;
}
