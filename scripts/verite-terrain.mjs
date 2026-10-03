/**
 * Vérité de terrain des plans (1er octobre 2026, étape 2 décidée avec l'auteur) : pour chaque concept, des planches
 * à faire juger par un humain, en deux lots :
 *   - des POSITIFS stricts : plan réalisé par une suite calme, tôt (avant le 12e demi-coup), BIEN JOUÉ (jugement
 *     d'exécution : perte moyenne ≤ 10, pire coup ≤ 20), dans une partie de test ;
 *   - des PIÈGES : la même apparence sans le concept, obtenue en relâchant la clause qui l'exclut exprès (tour sur une
 *     colonne qui n'est pas ouverte ; cavalier dans le camp adverse sur une case qu'un pion peut chasser ; pièce devant
 *     un pion qui n'est pas faible ; levier qui n'ouvre rien ; échange repris par un pion sans faiblesse nouvelle ;
 *     prise du fou adverse sans complexe faible).
 * Si l'humain dit « présent » sur un piège ou « absent » sur un positif, c'est la définition qui est en cause.
 *
 *   node scripts/verite-terrain.mjs data/labels/human-2013-01.s0.v2.jsonl [--per 5] [--seed 1] [--out reports/verite-terrain.json]
 */

import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { crc32 } from 'node:zlib';
import { Chess } from 'chess.js';
import { buildAllFacts } from '../positional/index.js';
import { toFrenchSan } from '../coach/notation.mjs';
import { blocked, scanLine } from '../coach/plan-concepts.mjs';
import { squareColor } from '../positional/attack-map.js';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const IN = args.find((a) => !a.startsWith('--') && a.endsWith('.jsonl'));
const PER = Number(opt('--per', 5));
const OUT = opt('--out', 'reports/verite-terrain.json');
let seed = Number(opt('--seed', 1));
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const POOL = Number(opt('--pool', 25)); // candidats gardés avant tirage
const CONCEPTS = ['tour_colonne', 'cavalier_avant_poste', 'blocage', 'rupture', 'affaiblir', 'dominer'];
const lot = IN.split('/').pop().replace(/^human-/, '').replace(/\.s\d+.*$/, '');
const juge = new Map();
const jf = IN.replace(/(\.v\d+)?\.jsonl$/, '.juge.jsonl');
if (existsSync(jf)) for (const l of readFileSync(jf, 'utf8').split('\n')) { if (!l) continue; try { const j = JSON.parse(l); juge.set(`${j.game}:${j.ply}`, j.plans); } catch { /* */ } }

const pos = Object.fromEntries(CONCEPTS.map((c) => [c, []]));
const trap = Object.fromEntries(CONCEPTS.map((c) => [c, []]));
const full = () => CONCEPTS.every((c) => pos[c].length >= POOL && trap[c].length >= POOL);
const has = (facts, id, color, pred = () => true) => facts.some((t) => t.id === id && t.params.color === color && pred(t));
// Coup surligné d'une planche positive : le coup d'INITIATIVE du camp, jamais la reprise adverse (vérité de terrain du
// 2 octobre) : le levier pour la rupture, la prise qui force la reprise de pion pour l'affaiblissement.
const initiative = (r, p) => {
  if (p.concept !== 'rupture' && p.concept !== 'affaiblir') return p.appear;
  const scan = scanLine(r.fen, r.played, r.played.length);
  const k = p.concept === 'rupture' ? scan[`rupture_levier_${p.side}`] : (scan[`affaiblir_levier_${p.side}`] >= 0 ? scan[`affaiblir_levier_${p.side}`] : scan[`affaiblir_${p.side}`]);
  return typeof k === 'number' && k >= 0 ? k : p.appear;
};
const front = (sq, color) => `${sq[0]}${Number(sq[1]) + (color === 'w' ? 1 : -1)}`;

const seenGame = new Set(); // une planche par partie et par concept : deux fenêtres voisines montrent le même coup
function sample(r, side, ply, extra) {
  const c = new Chess(r.fen);
  const sans = [];
  for (const u of r.played.slice(0, 12)) { try { sans.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; } }
  return { fen: r.fen, side, ply, moves: sans, elo: r.elo?.[side] ?? null, lot, game: r.game, position: r.ply, ...extra };
}

let records = 0;
for await (const line of createInterface({ input: createReadStream(IN), crlfDelay: Infinity })) {
  if (!line) continue;
  const r = JSON.parse(line);
  if (crc32(`${lot}:${r.game}`) % 10 !== 0) continue;
  records++;
  if (full()) break;
  if (records % 2000 === 0) console.log(`${records} positions… positifs ${CONCEPTS.map((c) => pos[c].length).join('/')} pièges ${CONCEPTS.map((c) => trap[c].length).join('/')}`);
  const jp = juge.get(`${r.game}:${r.ply}`) ?? [];
  // Positifs stricts.
  for (const p of r.plans ?? []) {
    if (!CONCEPTS.includes(p.concept) || !p.quiet || p.stale || !(p.appear < 12)) continue;
    const j = jp.find((x) => x.concept === p.concept && x.side === p.side);
    if (!j || typeof j.perteMoyenne !== 'number' || j.perteMoyenne > 10 || j.pertePire > 20) continue;
    if (pos[p.concept].length < POOL && !seenGame.has(`${p.concept}:${r.game}`)) { seenGame.add(`${p.concept}:${r.game}`); pos[p.concept].push(sample(r, p.side, initiative(r, p), { kind: 'positif', perteMoyenne: j.perteMoyenne, pertePire: j.pertePire })); }
  }
  // Pièges : rejouer les 12 premiers demi-coups.
  const realised = new Set((r.plans ?? []).filter((p) => p.quiet).map((p) => `${p.concept}_${p.side}`));
  let scanR = null; // analyse de la suite jouée, calculée au besoin (pièges de rupture)
  const c = new Chess(r.fen);
  let cacheFen = null;
  let cacheFacts = null;
  const factsOf = (fen) => { if (fen !== cacheFen) { cacheFen = fen; cacheFacts = buildAllFacts(fen); } return cacheFacts; };
  for (let i = 0; i < Math.min(12, r.played.length); i++) {
    const u = r.played[i];
    const fenBefore = c.fen();
    let m;
    try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    const side = m.color;
    const opp = side === 'w' ? 'b' : 'w';
    const rel = side === 'w' ? Number(m.to[1]) : 9 - Number(m.to[1]);
    // Faits calculés seulement quand un piège est possible (vitesse : 12 positions par enregistrement sinon).
    const needAfter = (m.piece === 'r') || (m.piece === 'n' && rel >= 4) || (m.piece === 'n' || m.piece === 'b') || m.captured === 'b';
    const factsAfter = needAfter ? factsOf(c.fen()) : [];
    const factsBefore = m.piece === 'r' ? buildAllFacts(fenBefore) : [];
    // Levier : poussée de pion (pas une prise) qui attaque un pion adverse.
    const dir = side === 'w' ? 1 : -1;
    const isLever = m.piece === 'p' && !m.captured && [-1, 1].some((d) => { const q = c.get(`${String.fromCharCode(m.to.charCodeAt(0) + d)}${Number(m.to[1]) + dir}`); return q && q.type === 'p' && q.color === opp; });
    if (m.captured || m.san.includes('+')) {
      // dominer : prise du fou adverse (pas une reprise) sans complexe faible.
      if (m.captured === 'b' && !realised.has(`dominer_${side}`) && trap.dominer.length < POOL
        && !has(factsAfter, 'COMPLEXE_FAIBLE', opp, (t) => t.params.enemyBishop)) {
        const prev = r.played[i - 1];
        if (!(prev && prev.slice(2, 4) === m.to)) {
          // Raison lue sur la position une fois l'échange terminé (règles de l'auteur du 2 octobre).
          const shade = squareColor(m.to);
          const d2 = new Chess(c.fen()); let k = i + 1; const nx = r.played.slice(i + 1, i + 3);
          for (const u of nx) { try { const mm = d2.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); if (!(mm.captured && mm.to === m.to)) break; } catch { break; } }
          const myB = d2.board().flat().some((q) => q && q.type === 'b' && q.color === side && squareColor(q.square) === shade);
          const hisB = d2.board().flat().some((q) => q && q.type === 'b' && q.color === opp && squareColor(q.square) === shade);
          const raison = !myB ? `prend le fou adverse, mais une fois l'échange terminé ce camp n'a plus de fou de cases ${shade} non plus : simple échange de fous`
            : hisB ? `prend un fou adverse, mais l'adversaire garde un fou de cases ${shade}` : `prend le fou adverse en gardant le sien, mais aucun complexe de cases ${shade} faible n'apparaît chez l'adversaire`;
          trap.dominer.push(sample(r, side, i, { kind: 'piège', raison }));
        }
      }
      continue;
    }
    if (m.piece === 'r' && !realised.has(`tour_colonne_${side}`) && trap.tour_colonne.length < POOL
      && !has(factsAfter, 'TOUR_COLONNE_OUVERTE', side, (t) => t.params.square === m.to)
      && factsBefore.some((t) => t.id === 'TOUR_COLONNE_OUVERTE' || t.id === 'COLONNE_OUVERTE' || t.id === 'COLONNE_SEMI_OUVERTE')) {
      trap.tour_colonne.push(sample(r, side, i, { kind: 'piège', raison: `la tour va en ${m.to}, sur une colonne qui n'est pas ouverte pour ce camp` }));
    }
    if (m.piece === 'n' && rel >= 4 && !realised.has(`cavalier_avant_poste_${side}`) && trap.cavalier_avant_poste.length < POOL
      && !has(factsAfter, 'CAVALIER_AVANT_POSTE', side, (t) => t.params.square === m.to)) {
      trap.cavalier_avant_poste.push(sample(r, side, i, { kind: 'piège', raison: `le cavalier s'installe en ${m.to}, dans le camp adverse, mais un pion adverse peut encore le chasser (ou la case n'est pas soutenue)` }));
    }
    if ((m.piece === 'n' || m.piece === 'b') && !realised.has(`blocage_${side}`) && trap.blocage.length < POOL) {
      const behind = c.get(front(m.to, side));
      if (behind && behind.type === 'p' && behind.color === opp && !blocked(factsAfter, c, front(m.to, side), opp, side)) {
        trap.blocage.push(sample(r, side, i, { kind: 'piège', raison: `la pièce se place devant le pion ${front(m.to, side)}, mais un pion adverse peut encore la chasser` }));
      }
    }
    if (isLever && !realised.has(`rupture_${side}`) && trap.rupture.length < POOL) {
      scanR ??= scanLine(r.fen, r.played, r.played.length);
      const rec = (scanR[`rupture_leviers_${side}`] ?? []).find((x) => x.levier === i);
      const ISSUE = { contournee: 'le pion attaqué avance et contourne le levier : la position se ferme', dissoute: 'une pièce prend l\'un des deux pions : échange ou sacrifice, pas une rupture de pions', tension: 'la tension est maintenue, aucun des deux pions ne prend dans la suite', prise: 'les pions se prennent mais aucune colonne nouvelle ne s\'ouvre' };
      trap.rupture.push(sample(r, side, i, { kind: 'piège', raison: `levier ${toFrenchSan(m.san)} : ${ISSUE[rec?.issue] ?? ISSUE.tension}` }));
    }
  }
  // affaiblir : échange repris par un pion adverse (ma prise puis sa reprise de pion) sans faiblesse nouvelle.
  for (let i = 0; i + 1 < Math.min(12, r.played.length); i++) {
    const d = new Chess(r.fen);
    let ok = true;
    const ms = [];
    for (const u of r.played.slice(0, i + 2)) { try { ms.push(d.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); } catch { ok = false; break; } }
    if (!ok) break;
    const a = ms[i];
    const b = ms[i + 1];
    if (a.captured && b.captured && b.piece === 'p' && b.to === a.to && b.captured !== 'p' && !realised.has(`affaiblir_${a.color}`) && trap.affaiblir.length < POOL) {
      trap.affaiblir.push(sample(r, a.color, i, { kind: 'piège', raison: `${toFrenchSan(a.san)} ${toFrenchSan(b.san)} : l'adversaire reprend avec un pion, mais aucune faiblesse nouvelle ne tient ensuite` }));
      break;
    }
  }
}

// Pièges : même règle, une partie au plus par concept.
for (const c of CONCEPTS) { const seen = new Set(); trap[c] = trap[c].filter((t) => { if (seen.has(t.game)) return false; seen.add(t.game); return true; }); }
const pick = (arr) => { const a = [...arr]; const out = []; while (a.length && out.length < PER) out.push(a.splice(Math.floor(rand() * a.length), 1)[0]); return out; };
const result = { records, concepts: Object.fromEntries(CONCEPTS.map((c) => [c, { positifs: pick(pos[c]), pieges: pick(trap[c]), pools: { positifs: pos[c].length, pieges: trap[c].length } }])) };
writeFileSync(OUT, JSON.stringify(result, null, 1));
for (const c of CONCEPTS) console.log(c.padEnd(22), `positifs ${pos[c].length} → ${result.concepts[c].positifs.length}`, `pièges ${trap[c].length} → ${result.concepts[c].pieges.length}`);
console.log(`${records} positions de test lues ; écrit : ${OUT}`);
