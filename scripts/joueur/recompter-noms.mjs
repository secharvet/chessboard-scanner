#!/usr/bin/env node
/**
 * RECOMPTAGE INDÉPENDANT DES NOMS (le second étage de l'honnêteté, FERMER-L-ARBRE § seuils) : pour chaque position nommée
 * par la table (lignes de table-noeuds.mjs), on revérifie l'affirmation du nœud avec un code ÉCRIT À PART, qui ne lit
 * rien de arbre.mjs : chess.js seulement, des définitions simples et explicites. Un désaccord = un nom à relire ; le taux
 * de désaccords par nœud est le « taux de noms faux » mécanique. Les nœuds qui affirment un calcul (mat, menace, gain au
 * bout d'une ligne) ne se recomptent pas statiquement : ils sont comptés « non recomptables » et publiés comme tels.
 *
 *   node scripts/joueur/recompter-noms.mjs reports/table-2000-v2/lignes-*.jsonl
 */
import { readFileSync } from 'node:fs';
import { Chess } from 'chess.js';

const V = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const CENTRE = new Set(['d4', 'e4', 'd5', 'e5']);
const DEPART_PIECES = { w: { n: ['b1', 'g1'], b: ['c1', 'f1'], r: ['a1', 'h1'], q: ['d1'] }, b: { n: ['b8', 'g8'], b: ['c8', 'f8'], r: ['a8', 'h8'], q: ['d8'] } };
const autre = (c) => (c === 'w' ? 'b' : 'w');
const sq = (f, r) => (f >= 0 && f < 8 && r >= 1 && r <= 8 ? String.fromCharCode(97 + f) + r : null);
const fileOf = (s) => s.charCodeAt(0) - 97, rankOf = (s) => Number(s[1]);

function jouer(fen, uci) { const c = new Chess(fen); const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); return { c, m }; }
function pieces(c, color) { const out = []; for (const row of c.board()) for (const p of row) if (p && p.color === color) out.push(p); return out; }
function attaquants(c, square, byColor) { try { return c.attackers(square, byColor); } catch { return []; } }
function minVal(c, squares) { let v = Infinity; for (const s of squares) { const p = c.get(s); if (p) v = Math.min(v, V[p.type]); } return v; }
/** Mes pièces « en prise » au sens simple : attaquée par moins cher, ou attaquée et non défendue (roi exclu). */
function enPrise(c, color) {
  const out = [];
  for (const p of pieces(c, color)) {
    if (p.type === 'k') continue;
    const att = attaquants(c, p.square, autre(color)); if (!att.length) continue;
    const def = attaquants(c, p.square, color);
    if (minVal(c, att) < V[p.type] || !def.length) out.push(p.square);
  }
  return out;
}
/** Coups légaux d'une pièce donnée, dans une position où c'est (ou non) à elle de jouer : on force le trait. */
function mobilite(fen, square) {
  const parts = fen.split(' '); const c0 = new Chess(fen); const p = c0.get(square); if (!p) return 0;
  parts[1] = p.color; parts[3] = '-'; let c; try { c = new Chess(parts.join(' ')); } catch { return 0; }
  try { return c.moves({ square, verbose: true }).length; } catch { return 0; }
}
function pionsAdversesAttaquent(c, square, color) { // la case est-elle attaquable par un pion adverse (présent ou qui pourrait avancer) ?
  const f = fileOf(square), r = rankOf(square), dir = color === 'w' ? 1 : -1; // les pions adverses viennent d'en face
  for (const df of [-1, 1]) for (let rr = r + dir; rr >= 1 && rr <= 8; rr += dir) { const s = sq(f + df, rr); if (!s) break; const p = c.get(s); if (p && p.type === 'p' && p.color === autre(color)) return true; if (p && p.type === 'p') break; }
  return false;
}

/* ---------------- les affirmations, une fonction par nœud ; true = confirmé, false = infirmé, null = non recomptable ---------------- */
const CLAIMS = {
  '1a': (fen) => new Chess(fen).inCheck(),
  '1c': (fen, uci, camp) => { // une de mes pièces était en prise, et mon coup s'en occupe (elle bouge, prend l'attaquant, ou n'est plus en prise après)
    const c0 = new Chess(fen); const avant = enPrise(c0, camp); if (!avant.length) return false;
    const { c, m } = jouer(fen, uci); if (!m) return false;
    if (avant.includes(m.from)) return true;
    if (m.captured && avant.some((s) => attaquants(c0, s, autre(camp)).includes(m.to))) return true;
    const apres = enPrise(c, camp); return avant.some((s) => !apres.includes(s));
  },
  '3D': (fen, uci) => { const { m } = jouer(fen, uci); if (!m) return false; if (m.flags.includes('k') || m.flags.includes('q')) return true; const d = DEPART_PIECES[m.color][m.piece]; return !!d && d.includes(m.from); },
  '3p': (fen, uci, camp, famille) => {
    const { c, m } = jouer(fen, uci); if (!m || m.piece !== 'p' || m.captured) return false;
    const c0 = new Chess(fen);
    const tests = {
      centre: () => CENTRE.has(m.to) || [...CENTRE].some((s) => { const p = c.get(s); return p && p.color === camp && p.type === 'p' && attaquants(c, s, camp).includes(m.to); }),
      ouvrir: () => Object.entries(DEPART_PIECES[camp]).some(([t, cases]) => cases.some((s) => { const p = c0.get(s); return p && p.color === camp && p.type === t && mobilite(c.fen(), s) > mobilite(fen, s); })),
      chasser: () => { const f = fileOf(m.to), r = rankOf(m.to), dir = camp === 'w' ? 1 : -1; return [-1, 1].some((df) => { const s = sq(f + df, r + dir); if (!s) return false; const p = c.get(s); if (p && p.color !== camp && p.type !== 'p') return true; if (p) return false; const adv = new Chess(c.fen()); return adv.moves({ verbose: true }).some((x) => x.to === s && (x.piece === 'n' || x.piece === 'b')); }); },
      espace: () => { const r = rankOf(m.to); const loin = camp === 'w' ? r >= 4 : r <= 5; const f = fileOf(m.to), dir = camp === 'w' ? 1 : -1; const contact = [-1, 1].some((df) => { const s = sq(f + df, r + dir); const p = s && c.get(s); return p && p.type === 'p' && p.color !== camp; }); return loin && (r >= 5 || r <= 4 ? true : contact) || contact; },
      abri: () => { const k = pieces(c, camp).find((p) => p.type === 'k'); if (!k) return false; const roque = (camp === 'w' ? rankOf(k.square) === 1 : rankOf(k.square) === 8) && (fileOf(k.square) >= 5 || fileOf(k.square) <= 2); return roque && Math.abs(fileOf(m.to) - fileOf(k.square)) <= 1 && Math.abs(rankOf(m.to) - rankOf(k.square)) <= 2; },
    };
    if (famille && tests[famille]) return tests[famille]();
    return Object.values(tests).some((t) => t());
  },
  '3u': (fen, uci, camp) => { // la tour va sur une colonne ouverte/semi-ouverte, la 7e, double une tour, ou attaque un pion non défendu par un pion
    const { c, m } = jouer(fen, uci); if (!m || m.piece !== 'r') return false;
    const f = fileOf(m.to); let mesPions = 0, sesPions = 0; for (let r = 1; r <= 8; r++) { const p = c.get(sq(f, r)); if (p && p.type === 'p') { if (p.color === camp) mesPions++; else sesPions++; } }
    if (mesPions === 0 && fileOf(m.from) !== f) return true; // ouverte ou semi-ouverte, et la tour change de colonne
    if (rankOf(m.to) === (camp === 'w' ? 7 : 2)) return true;
    const autreTour = pieces(c, camp).find((p) => p.type === 'r' && p.square !== m.to); if (autreTour && (fileOf(autreTour.square) === f || rankOf(autreTour.square) === rankOf(m.to)) && attaquants(c, autreTour.square, camp).includes(m.to)) return true;
    return c.moves({ square: m.to, verbose: true }).some((x) => x.captured === 'p' && !attaquants(c, x.to, autre(camp)).some((s) => c.get(s)?.type === 'p'));
  },
  '3t': (fen, uci) => { const { m } = jouer(fen, uci); return !!m && m.piece === 'p' && m.captured === 'p'; },
  '3e': (fen, uci, camp) => { const { c, m } = jouer(fen, uci); if (!m || !m.captured || m.captured === 'p') return false; return V[m.captured] === V[m.piece] || attaquants(c, m.to, autre(camp)).length > 0; },
  '3k': (fen, uci, camp) => { const { c, m } = jouer(fen, uci); if (!m || m.piece !== 'k' || m.flags.includes('k') || m.flags.includes('q')) return false; const lourds = pieces(c, 'w').concat(pieces(c, 'b')).filter((p) => p.type !== 'p' && p.type !== 'k').length; if (lourds <= 6) { const pions = pieces(c, 'w').concat(pieces(c, 'b')).filter((p) => p.type === 'p'); const d = (s) => Math.min(...pions.map((p) => Math.max(Math.abs(fileOf(p.square) - fileOf(s)), Math.abs(rankOf(p.square) - rankOf(s))))); return pions.length > 0 && d(m.to) < d(m.from) || mobilite(c.fen(), m.to) > mobilite(fen, m.from); } return mobilite(c.fen(), m.to) >= mobilite(fen, m.from); },
  '3m': (fen, uci, camp) => { const { c, m } = jouer(fen, uci); if (!m || m.piece === 'p' || m.piece === 'k' || m.captured) return false; const avantPost = attaquants(c, m.to, camp).some((s) => c.get(s)?.type === 'p') && !pionsAdversesAttaquent(c, m.to, camp); return mobilite(c.fen(), m.to) > mobilite(fen, m.from) + 1 && !pionsAdversesAttaquent(c, m.to, camp) || avantPost; },
  '3r': (fen, uci, camp) => { const { c, m } = jouer(fen, uci); if (!m || m.piece === 'p' || m.piece === 'k' || m.captured) return false; if (mobilite(c.fen(), m.to) > mobilite(fen, m.from)) return false; const parts = c.fen().split(' '); parts[1] = camp; parts[3] = '-'; let c2; try { c2 = new Chess(parts.join(' ')); } catch { return false; } return c2.moves({ verbose: true }).some((x) => x.to === m.from && x.from !== m.to && x.piece !== 'k'); },
  '2b': (fen, uci, camp) => { const { c, m } = jouer(fen, uci); if (!m) return false; if (m.captured) { const rep = attaquants(c, m.to, autre(camp)); return !rep.length || V[m.captured] > V[m.piece] || (V[m.captured] >= V[m.piece] && attaquants(c, m.to, camp).length >= rep.length); } return c.inCheck() ? null : false; },
};
const NON_RECOMPTABLES = new Set(['1b', '1d', '1e', '1f', '2a', '2c', '2d', '2e', '2f', '3L', '3C', '3d', '3P', '3Y', '3A', '3s']);

const fichiers = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!fichiers.length) { console.error('usage : node scripts/joueur/recompter-noms.mjs <lignes.jsonl...>'); process.exit(2); }
const stats = {}; const exemples = {}; let total = 0, nommes = 0;
for (const f of fichiers) for (const l of readFileSync(f, 'utf8').split('\n').filter(Boolean).map((x) => JSON.parse(x))) {
  total++; if (!l.noeud) continue; nommes++;
  const s = (stats[l.noeud] = stats[l.noeud] ?? { nommes: 0, confirmes: 0, infirmes: 0, nonRecomptables: 0 }); s.nommes++;
  if (NON_RECOMPTABLES.has(l.noeud) || !CLAIMS[l.noeud]) { s.nonRecomptables++; continue; }
  let v; try { v = CLAIMS[l.noeud](l.fen, l.uci, l.camp, l.famille); } catch (e) { v = null; }
  if (v === null) s.nonRecomptables++; else if (v) s.confirmes++; else { s.infirmes++; (exemples[l.noeud] = exemples[l.noeud] ?? []).length < 6 && exemples[l.noeud].push(`${l.san} (${l.partie} c.${Math.ceil(l.ply / 2)}${l.famille ? ', ' + l.famille : ''})`); }
}
let rc = 0, inf = 0, nr = 0; for (const s of Object.values(stats)) { rc += s.confirmes + s.infirmes; inf += s.infirmes; nr += s.nonRecomptables; }
console.log(`\n=== RECOMPTAGE INDÉPENDANT — ${total} positions, ${nommes} nommées : ${rc} recomptées, ${inf} infirmées (${rc ? (100 * inf / rc).toFixed(1) : '—'} % de noms contestés), ${nr} non recomptables statiquement (${(100 * nr / nommes).toFixed(1)} % des nommées) ===\n`);
console.log('| nœud | nommés | confirmés | infirmés | taux contesté | non recomptables |');
console.log('|---|---|---|---|---|---|');
for (const [n, s] of Object.entries(stats).sort((a, b) => b[1].nommes - a[1].nommes)) console.log(`| ${n} | ${s.nommes} | ${s.confirmes} | ${s.infirmes} | ${s.confirmes + s.infirmes ? (100 * s.infirmes / (s.confirmes + s.infirmes)).toFixed(1) + ' %' : '—'} | ${s.nonRecomptables} |`);
for (const [n, ex] of Object.entries(exemples)) console.log(`  ${n} infirmés, exemples : ${ex.join(' · ')}`);
