/**
 * L'arbre de décision du joueur « humain » (docs/coach-joueur/ARBRE-DECISION-2026-10-25.md et
 * CHANTIER-ARBRE-2026-10-25.md) — TEMPS 1, étapes 1 et 2.
 *
 * Chaque question est une fonction NOMMÉE qui PRODUIT des candidats `{ coup, raison, noeud }` (coup en UCI, raison en
 * français de joueur de club, noeud = « 1a »…« 2e »). Un générateur ne rend JAMAIS de score : les règles chiffrées
 * (compte sur une case, matériel) servent à produire le coup et à le dire, jamais à décider — c'est l'étape 4 (la
 * recherche restreinte aux candidats) qui départage (règle 1 du contrat).
 *
 * Les questions qui regardent plus loin qu'un coup (1b « menace-t-il mat », 1f « s'il jouait deux fois », 2a « ai-je un
 * mat ») ne refont pas de recherche ici : elles reçoivent une `sonde` déjà calculée par le joueur (réutilisant
 * `Recherche.menace`, coup nul, budget 60 000, précision du pilote), ce qui les laisse testables hors ligne.
 */
import { Chess } from 'chess.js';
import { buildAttackMap, other, sq as caseNom } from '../../positional/attack-map.js';
import { gainEchange } from '../en-prise.mjs';
import { DEPART } from './echiquier.mjs';
import { structuresEtendues, instancierEtendu, distanceEtendue, NOUVELLES_STRUCTURES } from './structures-etendues.mjs';
import { instancier } from '../plans-structures.mjs';
import { estLevier, suivre, libelle } from '../plan-distance.mjs';
import { LIVRE as LIVRE_FR } from '../../livres/francaise.js';
import { LIVRE as LIVRE_IT } from '../../livres/italienne.js';
import { LIVRE as LIVRE_ES } from '../../livres/espagnole.js';

const distance = distanceEtendue;
const LIVRES = new Map();
for (const L of [LIVRE_FR, LIVRE_IT, LIVRE_ES]) for (const e of L) if (!LIVRES.has(e.coups)) LIVRES.set(e.coups, e);

const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const NOM = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const FEM = new Set(['tour', 'dame', 'pièce']);
export const maPiece = (t) => { const n = NOM[t] ?? 'pièce'; return `${FEM.has(n) ? 'ma' : 'mon'} ${n}`; };
export const saPiece = (t) => { const n = NOM[t] ?? 'pièce'; return `${FEM.has(n) ? 'sa' : 'son'} ${n}`; };

const uciDe = (m) => m.from + m.to + (m.promotion ?? '');
const coupsLegaux = (fen) => new Chess(fen).moves({ verbose: true });
/** La FEN après un coup verbeux (chess.js). */
const apres = (fen, m) => { const c = new Chess(fen); c.move({ from: m.from, to: m.to, promotion: m.promotion }); return c.fen(); };
/** Matériel net (en pions) du point de vue de `camp`. */
function materiel(fen, camp) { let s = 0; for (const ch of fen.split(' ')[0]) { const l = ch.toLowerCase(); if (!VAL[l]) continue; s += (ch === ch.toUpperCase() ? 'w' : 'b') === camp ? VAL[l] : -VAL[l]; } return s; }

/** Les pièces de `camp` (pions et roi exclus) EN PRISE par mini-échange, la plus grosse d'abord : [{ square, type, gain }]. */
export function piecesEnPrise(fen, camp) {
  const map = buildAttackMap(fen), out = [];
  for (const p of map.pieces) if (p.color === camp && p.type !== 'k') { const g = gainEchange(map, p.square, camp); if (g > 0) out.push({ square: p.square, type: p.type, gain: g }); }
  return out.sort((a, b) => b.gain - a.gain || VAL[b.type] - VAL[a.type]);
}

/* ====================================================================== étape 1 : ses menaces ====================================================================== */

/** 1a — Suis-je en échec ? Alors seulement les coups légaux (prendre, s'interposer, fuir). */
export function echec({ fen }) {
  const chess = new Chess(fen);
  if (!chess.inCheck()) return [];
  return chess.moves({ verbose: true }).map((m) => ({ coup: uciDe(m), raison: 'je suis en échec : je dois parer', noeud: '1a' }));
}

/** 1b — Menace-t-il mat (en 1 ou 2) ? Toute parade qui enlève le mat (parade par test, sonde réutilisant `menace`). */
export function menaceMat({ fen, sonde }) {
  if (!sonde?.menace?.mat || typeof sonde.paree !== 'function') return [];
  const out = [];
  for (const m of coupsLegaux(fen)) { const u = uciDe(m); if (sonde.paree(u)) out.push({ coup: u, raison: 'il menace mat : j\'enlève le mat', noeud: '1b' }); }
  return out;
}

/** 1c — Une de mes pièces est-elle en prise (la plus grosse d'abord) ? La sauver : fuir, prendre l'attaquant, l'échanger, défendre, s'interposer. */
export function pieceEnPrise({ fen, camp }) {
  const enPrise = piecesEnPrise(fen, camp);
  if (!enPrise.length) return [];
  const cible = enPrise[0]; // la plus grosse ; les suivantes seront reprises au coup d'après si besoin
  const attaquants = buildAttackMap(fen).attackersOf(cible.square, other(camp)).map((p) => p.square);
  const nom = maPiece(cible.type), out = [];
  for (const m of coupsLegaux(fen)) {
    const u = uciDe(m), map2 = buildAttackMap(apres(fen, m));
    let raison = null, famille = null;
    if (m.from === cible.square) {
      // la pièce elle-même bouge : fuir, prendre l'attaquant, ou s'échanger (prendre une pièce, même reprise, si le bilan tient)
      const encore = map2.at[m.to];
      const perte = encore && encore.color === camp ? gainEchange(map2, m.to, camp) : VAL[cible.type];
      const gagne = m.captured ? VAL[m.captured] : 0;
      if (gagne - perte < 0) continue; // fuite vers une case en prise, ou échange perdant
      if (attaquants.includes(m.to)) { raison = `je prends ${saPiece(m.captured)} qui attaquait ${nom}`; famille = 'prendre'; }
      else if (m.captured) { raison = `${nom} est attaqué : je l'échange contre ${saPiece(m.captured)}`; famille = 'echange'; }
      else { raison = `je mets ${nom} à l'abri en ${m.to}`; famille = 'fuir'; }
    } else {
      // une autre pièce joue : prendre l'attaquant, s'interposer, ou ajouter un défenseur
      const encore = map2.at[cible.square];
      if (!encore || encore.color !== camp || gainEchange(map2, cible.square, camp) > 0) continue; // toujours en prise → pas une parade
      if (attaquants.includes(m.to)) { raison = `je prends ${saPiece(m.captured)} qui attaquait ${nom}`; famille = 'prendre'; }
      else { raison = `je défends ${nom} en ${cible.square}`; famille = 'defendre'; }
    }
    out.push({ coup: u, raison, noeud: '1c', famille });
  }
  return out;
}

/** 1d — Ma dernière rangée est-elle faible (mat du couloir) ? Un trou d'aération, ou une pièce qui couvre. */
export function derniereRangee({ fen, camp }) {
  const map = buildAttackMap(fen);
  const rangRoi = camp === 'w' ? 1 : 8, devant = camp === 'w' ? 2 : 7;
  const roi = map.pieces.find((p) => p.type === 'k' && p.color === camp);
  if (!roi || roi.rank !== rangRoi) return [];
  // Pas d'aération : toutes les cases devant le roi (même colonne ± 1) sont occupées par mes pions.
  const devantRoi = [-1, 0, 1].map((d) => roi.fileIdx + d).filter((f) => f >= 0 && f < 8).map((f) => caseNom(f, devant));
  const bouche = devantRoi.every((s) => { const p = map.at[s]; return p && p.color === camp && p.type === 'p'; });
  if (!bouche) return [];
  // Une pièce lourde adverse peut-elle venir sur ma dernière rangée ? (déjà dessus, ou colonne ouverte/semi vers le roi)
  const lourdes = map.pieces.filter((p) => p.color === other(camp) && (p.type === 'r' || p.type === 'q'));
  const menaceCouloir = lourdes.some((L) => L.rank === rangRoi || !map.pieces.some((x) => x.type === 'p' && x.color === camp && x.fileIdx === L.fileIdx));
  if (!menaceCouloir) return [];
  const out = [];
  for (const m of coupsLegaux(fen)) {
    const u = uciDe(m);
    // aération : un pion devant le roi qui avance et ouvre une case de fuite au roi
    if (m.piece === 'p' && devantRoi.includes(m.from)) out.push({ coup: u, raison: 'ma dernière rangée est fragile : je m\'aère', noeud: '1d' });
    // couverture : une tour ou une dame qui vient tenir la dernière rangée
    else if ((m.piece === 'r' || m.piece === 'q') && m.to[1] === String(rangRoi)) out.push({ coup: u, raison: 'ma dernière rangée est fragile : je la couvre', noeud: '1d' });
  }
  return out;
}

/** 1e — Une pièce à moi est-elle clouée sur mon roi (ou alignée avec ma dame) ? La déclouer, rompre l'alignement. */
export function clouage({ fen, camp }) {
  const map = buildAttackMap(fen);
  const roi = map.pieces.find((p) => p.type === 'k' && p.color === camp);
  const dame = map.pieces.find((p) => p.type === 'q' && p.color === camp);
  const sliders = map.pieces.filter((p) => p.color === other(camp) && (p.type === 'b' || p.type === 'r' || p.type === 'q'));
  const DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]], DROIT = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const dirs = (t) => (t === 'b' ? DIAG : t === 'r' ? DROIT : [...DIAG, ...DROIT]);
  const cloues = []; // { piece (mienne), pinner (square), derriere ('roi'|'dame') }
  for (const S of sliders) for (const [df, dr] of dirs(S.type)) {
    const vus = map.piecesOnRay({ fileIdx: S.fileIdx, rank: S.rank }, [df, dr], 2);
    if (vus.length < 2) continue;
    const [P, derriere] = vus;
    if (P.color !== camp) continue;
    if (roi && derriere.square === roi.square) cloues.push({ piece: P, pinner: S.square, derriere: 'roi' });
    else if (dame && derriere.square === dame.square && P.type !== 'q') cloues.push({ piece: P, pinner: S.square, derriere: 'dame' });
  }
  if (!cloues.length) return [];
  const out = [], vus = new Set();
  const ajoute = (u, raison) => { if (!vus.has(u)) { vus.add(u); out.push({ coup: u, raison, noeud: '1e' }); } };
  for (const c of cloues) {
    const nom = maPiece(c.piece.type);
    for (const m of coupsLegaux(fen)) {
      const u = uciDe(m);
      if (m.to === c.pinner) ajoute(u, `${nom} est clouée sur mon ${c.derriere} : je prends le cloueur`);
      else if (m.from === c.piece.square) ajoute(u, `je décloue ${nom}`); // chess.js n'autorise une pièce clouée au roi que le long du clou
      else if (c.derriere === 'dame' && m.piece === 'q') ajoute(u, 'je romps l\'alignement de ma dame');
      else if (c.derriere === 'roi' && m.piece === 'k') ajoute(u, 'je sors mon roi du clou');
    }
  }
  return out;
}

/** 1f — S'il jouait deux fois de suite, que gagnerait-il ? La parade = tout coup après lequel sa suite ne gagne plus (test). */
export function deuxCoups({ fen, camp, sonde }) {
  if (!sonde?.menace || sonde.menace.mat || typeof sonde.paree !== 'function') return []; // le mat, c'est 1b
  const perte = sonde.menace.perte ?? 'du matériel';
  const map = buildAttackMap(fen), out = [];
  for (const m of coupsLegaux(fen)) {
    const u = uciDe(m); if (!sonde.paree(u)) continue;
    // famille de la parade (pour l'ordre du radar, pas un score) : prendre, fuir (le roi ou une pièce attaquée s'écarte), contre (échec), défendre
    const famille = m.captured ? 'prendre' : m.piece === 'k' ? 'fuir' : new Chess(apres(fen, m)).inCheck() ? 'contre' : map.attackersOf(m.from, other(camp)).length ? 'fuir' : 'defendre';
    out.push({ coup: u, raison: `s'il jouait deux fois il gagnerait ${perte} : je pare`, noeud: '1f', famille });
  }
  return out;
}

export function etape1(ctx) {
  return [...echec(ctx), ...menaceMat(ctx), ...pieceEnPrise(ctx), ...derniereRangee(ctx), ...clouage(ctx), ...deuxCoups(ctx)];
}

/* ====================================================================== étape 2 : mes coups forcés ====================================================================== */

/** 2a — Ai-je un mat (en 1 à 3) ? Le mat (sonde : courte recherche de mat pour moi). */
export function monMat({ sonde }) {
  if (!sonde?.monMat?.coup) return [];
  return [{ coup: sonde.monMat.coup, raison: 'j\'ai un mat', noeud: '2a' }];
}

/** Le meilleur matériel que je gagne en UNE prise depuis `fen` (SEE sur chaque case), 0 si rien. Mon trait supposé. */
function meilleurGainImmediat(fen, camp) {
  const map = buildAttackMap(fen); let best = 0;
  for (const m of coupsLegaux(fen)) { if (!m.captured) continue; const g = gainEchange(map, m.to, other(camp)); if (g > best) best = g; }
  return best;
}

/**
 * 2b — Une prise OU un échec qui gagne du matériel, le plus gros d'abord. Les prises : compte sur la case (SEE). Les
 * échecs qui gagnent (fourchette par échec, échec à la découverte, roi attiré) : on garde l'échec après lequel, quelle
 * que soit sa réponse légale, je gagne du matériel compté au coup suivant.
 */
export function priseGagnante({ fen, camp }) {
  const map = buildAttackMap(fen), out = [], vus = new Set();
  // (a) les prises qui gagnent (SEE sur la case)
  for (const m of coupsLegaux(fen)) {
    if (!m.captured) continue;
    if (gainEchange(map, m.to, other(camp)) > 0) { const u = uciDe(m); vus.add(u); out.push({ coup: u, raison: `je prends ${saPiece(m.captured)} en ${m.to} et je gagne du matériel`, noeud: '2b', _poids: VAL[m.captured] }); }
  }
  // (b) les échecs qui gagnent : je gagne du matériel quelle que soit sa réponse
  for (const m of coupsLegaux(fen)) {
    const u = uciDe(m); if (vus.has(u)) continue;
    const fenApres = apres(fen, m), apresCh = new Chess(fenApres);
    if (!apresCh.inCheck()) continue; // pas un échec
    const reponses = apresCh.moves({ verbose: true });
    if (!reponses.length) continue; // mat : c'est 2a
    if (!reponses.every((rep) => { const c = new Chess(fenApres); c.move({ from: rep.from, to: rep.to, promotion: rep.promotion }); return meilleurGainImmediat(c.fen(), camp) > 0; })) continue;
    // nommer : le motif et la pièce gagnée
    const map2 = buildAttackMap(fenApres), moi = map2.at[m.to];
    const donneEchec = moi && (map2.attacks.get(moi) ?? []).some((s) => map2.at[s]?.type === 'k' && map2.at[s]?.color === other(camp));
    const cible = moi ? (map2.attacks.get(moi) ?? []).map((s) => map2.at[s]).filter((q) => q && q.color === other(camp) && q.type !== 'k').sort((a, b) => VAL[b.type] - VAL[a.type])[0] : null;
    const raison = !donneEchec ? `échec à la découverte : je gagne ${cible ? saPiece(cible.type) : 'du matériel'}`
      : cible ? `fourchette : son roi et ${saPiece(cible.type)}` : 'échec qui gagne du matériel';
    out.push({ coup: u, raison, noeud: '2b', _poids: cible ? VAL[cible.type] : 2 });
  }
  return out.sort((a, b) => b._poids - a._poids).map(({ _poids, ...c }) => c); // le plus gros gain d'abord
}

/** 2c — Avant de reprendre : ai-je mieux qu'une reprise (un coup intermédiaire) ? */
export function intermede({ fen, camp, dernier }) {
  if (!dernier?.prise || !dernier.case) return [];
  const legaux = coupsLegaux(fen);
  const reprise = legaux.some((m) => m.to === dernier.case && m.captured); // une reprise existe-t-elle ?
  if (!reprise) return [];
  const map = buildAttackMap(fen), out = [];
  for (const m of legaux) {
    if (m.to === dernier.case && m.captured) continue; // la reprise elle-même n'est pas un intermédiaire
    const estEchec = new Chess(apres(fen, m)).inCheck();
    const gagne = m.captured && gainEchange(map, m.to, other(camp)) > 0;
    if (estEchec || gagne) out.push({ coup: uciDe(m), raison: `avant de reprendre, ${m.san} d'abord (un coup intermédiaire)`, noeud: '2c' });
  }
  return out;
}

/**
 * 2d — A-t-il des pièces non défendues ? Puis-je en attaquer deux à la fois (double attaque), ou une qu'il ne peut pas
 * sauver ? Deux cas distincts : pièce NON DÉFENDUE (attaque simple), et pièce DÉFENDUE mais attaquée par PLUS PETIT
 * (menace réelle, car l'attaquant vaut moins). On ne dit jamais « non défendue » d'une pièce défendue (le vérificateur le contrôle).
 */
export function pieceNonDefendue({ fen, camp }) {
  const out = [];
  for (const m of coupsLegaux(fen)) {
    const map2 = buildAttackMap(apres(fen, m));
    const moi = map2.at[m.to]; if (!moi) continue;
    if (gainEchange(map2, m.to, camp) > 0) continue; // mon coup ne doit pas se pendre lui-même
    const vise = (map2.attacks.get(moi) ?? []).map((s) => map2.at[s]).filter((q) => q && q.color === other(camp) && q.type !== 'k');
    const gagnables = [];
    for (const q of vise) {
      const defendu = map2.isDefended(q.square, other(camp), moi);
      if (!defendu && VAL[q.type] >= 3) gagnables.push({ q, kind: 'libre' });            // pièce non défendue qui vaut la peine
      else if (defendu && VAL[moi.type] < VAL[q.type]) gagnables.push({ q, kind: 'petit' }); // défendue, mais attaquée par plus petit
    }
    if (!gagnables.length) continue;
    gagnables.sort((a, b) => VAL[b.q.type] - VAL[a.q.type]);
    if (gagnables.length >= 2) {
      const [a, b] = gagnables;
      out.push({ coup: uciDe(m), raison: `double attaque sur ${saPiece(a.q.type)} en ${a.q.square} et ${saPiece(b.q.type)} en ${b.q.square}`, noeud: '2d' });
    } else {
      const { q, kind } = gagnables[0];
      const raison = kind === 'libre'
        ? `j'attaque ${saPiece(q.type)} en ${q.square}, non défendue`
        : `j'attaque ${saPiece(q.type)} en ${q.square} avec ${maPiece(moi.type)}`;
      out.push({ coup: uciDe(m), raison, noeud: '2d' });
    }
  }
  return out;
}

/** 2e — Une tactique nommée créée en un coup : clouage ou enfilade (déviation/surcharge/pièce enfermée → temps 2). */
export function tactiqueNommee({ fen, camp }) {
  const DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]], DROIT = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const dirs = (t) => (t === 'b' ? DIAG : t === 'r' ? DROIT : t === 'q' ? [...DIAG, ...DROIT] : []);
  const out = [], vus = new Set();
  for (const m of coupsLegaux(fen)) {
    const d = dirs(m.piece); if (!d.length) continue; // seules les pièces à distance clouent ou enfilent
    const fenApres = apres(fen, m), map2 = buildAttackMap(fenApres);
    const moi = map2.at[m.to]; if (!moi) continue;
    if (gainEchange(map2, m.to, camp) > 0) continue; // un coup qui se pend n'est pas une tactique
    for (const [df, dr] of d) {
      const vu = map2.piecesOnRay({ fileIdx: moi.fileIdx, rank: moi.rank }, [df, dr], 2);
      if (vu.length < 2) continue;
      const [av, arr] = vu;
      if (av.color !== other(camp) || arr.color !== other(camp)) continue;
      if (av.type === 'p') continue; // clouer ou enfiler un PION n'est pas une tactique nommée exploitable
      const u = uciDe(m); if (vus.has(u)) continue;
      // clouage : la pièce devant (av) vaut MOINS que celle derrière (arr) — la bouger coûterait la pièce de derrière.
      // enfilade : la pièce devant vaut PLUS — elle doit s'écarter et découvre celle de derrière. Un pion derrière ne compte pas.
      if (arr.type === 'k') { vus.add(u); out.push({ coup: u, raison: `je cloue ${saPiece(av.type)} en ${av.square} sur son roi`, noeud: '2e' }); }
      else if (arr.type !== 'p' && VAL[av.type] < VAL[arr.type]) { vus.add(u); out.push({ coup: u, raison: `je cloue ${saPiece(av.type)} en ${av.square} sur ${saPiece(arr.type)}`, noeud: '2e' }); }
      else if (arr.type !== 'p' && VAL[av.type] > VAL[arr.type]) { vus.add(u); out.push({ coup: u, raison: `enfilade : ${saPiece(av.type)} en ${av.square} et ${saPiece(arr.type)} derrière`, noeud: '2e' }); }
    }
  }
  return out;
}

/**
 * 2f — Et si je jouais deux fois de suite ? Le coup qui crée une menace que l'adversaire doit parer : je menace mat, je
 * menace une fourchette / un échec qui gagne, ou je menace une de ses pièces. C'est `menace()` retourné vers MON camp (je
 * joue, il passe, je gagne) — la sonde le calcule dans le joueur (comme 1f). Le candidat est le PREMIER coup de ma ligne.
 */
export function deuxCoupsMoi({ sonde }) {
  const mm = sonde?.mesMenaces;
  if (!mm?.length) return [];
  return mm.map((t) => ({ coup: t.coup, raison: t.raison, noeud: '2f' }));
}

export function etape2(ctx) {
  return [...monMat(ctx), ...priseGagnante(ctx), ...intermede(ctx), ...pieceNonDefendue(ctx), ...tactiqueNommee(ctx), ...deuxCoupsMoi(ctx)];
}

/* ====================================================================== étape 3 (réduite pour le temps 1) ====================================================================== */
/* Pas encore les cibles (3c) ni l'attaque du roi (3d) : c'est le taux de trous qui dira s'il les faut. Quatre sources :
   le livre tant qu'on y est, ma pire pièce, la prophylaxie (par menace() au coup nul), les plans du catalogue existants. */

/** 3 livre — le coup du répertoire tant qu'on y est, avec le « sens » écrit au livre pour raison. */
export function livre({ fen, depart = DEPART, historique = [] }) {
  const chess = new Chess(depart);
  for (const u of historique) { try { chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { return []; } }
  // le livre ne vaut que si l'historique rejoué TOMBE sur la position courante (sinon on n'est pas dans la ligne du répertoire)
  if (chess.fen().split(' ').slice(0, 4).join(' ') !== fen.split(' ').slice(0, 4).join(' ')) return [];
  const cle = chess.history().join(' ');
  let entree = LIVRES.get(cle);
  if (!entree && cle === '' && chess.fen() === DEPART && LIVRES.has('e4')) entree = { plan: [{ san: 'e4', pourquoi: LIVRES.get('e4').sens ?? 'le début de mon répertoire' }] };
  if (!entree?.plan?.length) return [];
  const L = entree.plan[0];
  const legal = chess.moves({ verbose: true }).find((m) => m.san === L.san);
  return legal ? [{ coup: uciDe(legal), raison: L.pourquoi ?? 'le livre', noeud: '3L' }] : [];
}

/** 3 pire pièce — ma pièce la moins active (≤ 2 cases utiles), ou une mineure encore chez elle après le coup 10, vers une meilleure case. */
export function pirePiece({ fen, camp }) {
  const map = buildAttackMap(fen);
  const miennes = map.pieces.filter((p) => p.color === camp && p.type !== 'p' && p.type !== 'k');
  if (!miennes.length) return [];
  const coup = Number(fen.split(' ')[5] ?? 1), rangHome = camp === 'w' ? 1 : 8;
  let cible = null;
  const mineuresChezElles = miennes.filter((p) => (p.type === 'n' || p.type === 'b') && p.rank === rangHome);
  if (coup >= 10 && mineuresChezElles.length) cible = mineuresChezElles.sort((a, b) => map.mobility(a) - map.mobility(b))[0];
  else { const parMob = miennes.map((p) => ({ p, m: map.mobility(p) })).sort((a, b) => a.m - b.m); if (parMob[0]?.m <= 2) cible = parMob[0].p; }
  if (!cible) return [];
  const mobAvant = map.mobility(cible), chezElle = cible.rank === rangHome, out = [];
  for (const m of coupsLegaux(fen)) {
    if (m.from !== cible.square) continue;
    const map2 = buildAttackMap(apres(fen, m)), bougee = map2.at[m.to];
    if (!bougee || gainEchange(map2, m.to, camp) > 0) continue; // ne pas jeter la pièce en l'améliorant
    if (map2.mobility(bougee) > mobAvant || (chezElle && m.to[1] !== String(rangHome))) out.push({ coup: uciDe(m), raison: `ma pire pièce est ${maPiece(cible.type)} en ${cible.square} : je l'active en ${m.to}`, noeud: '3P' });
  }
  return out;
}

/** 3 prophylaxie — son meilleur coup au coup nul quand ce n'est pas une menace de matériel : le coup qui le gêne (sonde). */
export function prophylaxie({ fen, sonde }) {
  const pr = sonde?.prophylaxie;
  if (!pr || typeof pr.paree !== 'function') return [];
  const out = [];
  for (const m of coupsLegaux(fen)) { const u = uciDe(m); if (pr.paree(u)) out.push({ coup: u, raison: pr.idee ? `je l'empêche de ${pr.idee}` : 'prophylaxie : je gêne son idée', noeud: '3Y' }); }
  return out;
}

/** 3 plans du catalogue — pour chaque structure reconnue, le coup qui avance le plus un plan existant (levier, distance finie). */
export function plansCatalogue({ fen, camp }) {
  const structures = structuresEtendues(fen);
  if (!structures.length) return [];
  const legaux = coupsLegaux(fen), out = [], vus = new Set();
  for (const s of structures) {
    const insts = NOUVELLES_STRUCTURES.has(s.name) ? instancierEtendu(fen, camp, s) : instancier(fen, camp, s.name, s.color);
    for (const inst of insts) {
      if (!estLevier(fen, camp, inst.plan)) continue;
      const d0 = distance(fen, camp, inst.plan).d;
      if (!(d0 > 0) || !Number.isFinite(d0)) continue;
      let meilleur = null;
      for (const m of legaux) { let dA; try { dA = distance(apres(fen, m), camp, suivre(inst.plan, m)).d; } catch { continue; } if (dA < d0 && (!meilleur || dA < meilleur.dA)) meilleur = { m, dA }; }
      if (meilleur) { const u = uciDe(meilleur.m); if (!vus.has(u)) { vus.add(u); out.push({ coup: u, raison: `j'avance mon plan : ${libelle(inst.plan, fen)}`, noeud: '3C' }); } }
    }
  }
  return out;
}

/**
 * 3 développement (doctrine 3a) — en ouverture : sortir une mineure encore chez elle (case sûre, vers le centre), roquer
 * (mettre le roi à l'abri), prendre le centre avec un pion d ou e sur sa 4e. Les règles d'ouverture (ne pas rejouer une
 * pièce, pas la dame trop tôt) DÉPARTAGENT au calcul, elles n'éliminent jamais : le générateur ne fait que produire —
 * d'ailleurs « sortir une mineure chez elle » est un premier développement (pas un re-coup) et ne sort pas la dame.
 */
export function developpement({ fen, camp }) {
  const map = buildAttackMap(fen);
  const rangHome = camp === 'w' ? 1 : 8, rang4 = camp === 'w' ? 4 : 5;
  const coup = Number(fen.split(' ')[5] ?? 1);
  const mineuresHome = map.pieces.filter((p) => p.color === camp && (p.type === 'n' || p.type === 'b') && p.rank === rangHome);
  const out = [], vus = new Set();
  const ajoute = (u, raison) => { if (!vus.has(u)) { vus.add(u); out.push({ coup: u, raison, noeud: '3D' }); } };
  const sur = (m) => gainEchange(buildAttackMap(apres(fen, m)), m.to, camp) <= 0; // la pièce n'est pas en prise après le coup
  for (const m of coupsLegaux(fen)) {
    const u = uciDe(m);
    if (m.flags.includes('k') || m.flags.includes('q')) { ajoute(u, 'je mets mon roi à l\'abri'); continue; } // roquer : toujours produit quand c'est légal
    if (coup > 20) continue; // le reste du développement n'a de sens qu'en ouverture
    if ((m.piece === 'n' || m.piece === 'b') && m.from[1] === String(rangHome) && mineuresHome.length && sur(m)) { ajoute(u, `je sors ${maPiece(m.piece)}`); continue; }
    if (coup <= 12 && m.piece === 'p' && (m.from[0] === 'd' || m.from[0] === 'e') && m.to[1] === String(rang4) && sur(m)) ajoute(u, 'je prends le centre');
  }
  return out;
}

/** Un pion de `camp` est-il passé (aucun pion adverse devant sur sa colonne ni les voisines) ? */
function estPionPasse(map, p, camp) {
  if (p.type !== 'p') return false;
  for (const q of map.pieces) {
    if (q.type !== 'p' || q.color === camp) continue;
    if (Math.abs(q.fileIdx - p.fileIdx) <= 1 && (camp === 'w' ? q.rank > p.rank : q.rank < p.rank)) return false;
  }
  return true;
}

/**
 * 3d — Est-ce que j'attaque son roi ? Zone = les cases autour de son roi et la rangée devant. A = mes pièces (hors pions
 * et roi) qui attaquent la zone ou peuvent l'attaquer en un coup ; D = ses défenseurs (hors pions et roi).
 *
 * Trois sortes de candidats, chacune sa porte (le calcul départage ensuite) :
 *  - la PRISE ou l'ÉCHEC dans la zone (y compris un sacrifice) : produit dès que ma dame est là et mon roi à l'abri, MÊME
 *    sans ligne ouverte et même si le compte de matériel est perdant — c'est la correction de l'Expert (Fxg7+ de w-08) :
 *    si l'arbre ne propose pas le sacrifice, le calcul ne le voit jamais ; la règle le propose, le calcul décide ;
 *  - la PIÈCE de plus qui entre dans la zone : quand j'ai au moins autant d'attaquants que de défenseurs (A ≥ D + 1) et
 *    un accès (colonne sans pion à moi, ou crochet …h6/…g6) ;
 *  - le LEVIER de pion contre son roi : quand il y a un accès.
 * Dans tous les cas, ma dame sur l'échiquier et les trois refus : mon roi pas à l'abri, retard de développement, ou centre
 * ouvert devant un roi adverse resté au centre. (Note Dev chef : le seuil littéral « A − D ≥ 2 » du brief refuse les
 * exemples listés — w-23 A−D=1, w-17 A−D<0, w-08 sans ligne — je l'ai assoupli comme ci-dessus et je le signale au pilote.)
 */
export function attaqueDuRoi({ fen, camp }) {
  const map = buildAttackMap(fen);
  const adv = other(camp);
  const roiAdv = map.pieces.find((p) => p.type === 'k' && p.color === adv);
  const roiMoi = map.pieces.find((p) => p.type === 'k' && p.color === camp);
  if (!roiAdv || !roiMoi) return [];
  if (!map.pieces.some((p) => p.type === 'q' && p.color === camp)) return []; // sans ma dame, pas d'attaque (règle)
  const vers = camp === 'w' ? -1 : 1; // de son roi vers moi (la rangée « devant »)
  const zone = new Set();
  for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) { const f = roiAdv.fileIdx + df, r = roiAdv.rank + dr; if (f >= 0 && f < 8 && r >= 1 && r <= 8) zone.add(caseNom(f, r)); }
  for (let df = -1; df <= 1; df++) { const f = roiAdv.fileIdx + df, r = roiAdv.rank + 2 * vers; if (f >= 0 && f < 8 && r >= 1 && r <= 8) zone.add(caseNom(f, r)); }
  // A : mes pièces (hors pion/roi) qui attaquent la zone, ou peuvent l'attaquer en un coup ; D : ses défenseurs de la zone
  const attaqueZone = (sqArr, fenP) => { const mm = buildAttackMap(fenP); return (mm.attacks.get(mm.at[sqArr]) ?? []).some((s) => zone.has(s)); };
  let A = 0;
  for (const p of map.pieces) {
    if (p.color !== camp || p.type === 'p' || p.type === 'k') continue;
    if ((map.attacks.get(p) ?? []).some((s) => zone.has(s))) { A++; continue; }
    if (coupsLegaux(fen).some((m) => m.from === p.square && attaqueZone(m.to, apres(fen, m)))) A++;
  }
  let D = 0;
  for (const p of map.pieces) { if (p.color !== adv || p.type === 'p' || p.type === 'k') continue; if ((map.attacks.get(p) ?? []).some((s) => zone.has(s))) D++; }
  // accès : une colonne du roi (ou voisine) sans pion à moi, ou un crochet (son pion de roque avancé)
  const colonnes = [roiAdv.fileIdx - 1, roiAdv.fileIdx, roiAdv.fileIdx + 1].filter((f) => f >= 0 && f < 8);
  const ligneOuverte = colonnes.some((f) => !map.pieces.some((p) => p.type === 'p' && p.color === camp && p.fileIdx === f));
  const rangHome = adv === 'w' ? 2 : 7;
  const crochet = map.pieces.some((p) => p.type === 'p' && p.color === adv && Math.abs(p.fileIdx - roiAdv.fileIdx) <= 1 && p.rank !== rangHome); // pion de roque avancé (ou manquant → colonne couverte par ligneOuverte)
  const acces = ligneOuverte || crochet;
  // refus 1 : mon roi n'est pas à l'abri (encore sur sa colonne de départ, ou deux défenseurs adverses sur ma propre zone)
  if (roiMoi.fileIdx === 4 && roiMoi.rank === (camp === 'w' ? 1 : 8)) return [];
  const zoneMoi = new Set();
  for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) { const f = roiMoi.fileIdx + df, r = roiMoi.rank + dr; if (f >= 0 && f < 8 && r >= 1 && r <= 8) zoneMoi.add(caseNom(f, r)); }
  let contreMoi = 0; for (const p of map.pieces) { if (p.color !== adv || p.type === 'p' || p.type === 'k') continue; if ((map.attacks.get(p) ?? []).some((s) => zoneMoi.has(s))) contreMoi++; }
  if (contreMoi >= 2) return [];
  // refus 2 : retard de développement (mes mineures chez elles, deux de plus que les siennes)
  const home = (c) => map.pieces.filter((p) => (p.type === 'n' || p.type === 'b') && p.color === c && p.rank === (c === 'w' ? 1 : 8)).length;
  if (home(camp) - home(adv) >= 2) return [];
  // refus 3 : le centre est ouvert (pas de pion sur d/e) ET son roi est resté au centre (colonnes d/e) → il y joue
  const pionsCentre = map.pieces.filter((p) => p.type === 'p' && (p.fileIdx === 3 || p.fileIdx === 4)).length;
  if (pionsCentre === 0 && (roiAdv.fileIdx === 3 || roiAdv.fileIdx === 4)) return [];
  // --- les candidats ---
  const out = [], vus = new Set();
  const ligneDite = ligneOuverte ? 'la colonne est ouverte' : crochet ? 'son pion de roque est avancé' : 'j\'ouvre son roi';
  const detail = `${A} pièces contre ${D}, ${ligneDite}`;
  const ajoute = (u) => { if (!vus.has(u)) { vus.add(u); out.push({ coup: u, raison: `j'attaque son roi : ${detail}`, noeud: '3d' }); } };
  const fidx = (sq) => sq.charCodeAt(0) - 97;
  const fort = A - D >= 2; // nettement plus d'attaquants que de défenseurs : le sacrifice vaut d'être proposé
  const presence = A - D >= 1; // au moins autant d'attaquants que de défenseurs : une vraie attaque
  const dir = camp === 'w' ? 1 : -1;
  for (const m of coupsLegaux(fen)) {
    const u = uciDe(m), fenApres = apres(fen, m), map2 = buildAttackMap(fenApres), bougee = map2.at[m.to];
    const estEchec = new Chess(fenApres).inCheck();
    // (1) prise ou échec dans la zone, SACRIFICE compris : quand l'attaque est nette (A−D ≥ 2), MÊME si ça perd le compte
    //     et sans accès — c'est lui qui l'ouvre (correction de l'Expert : sinon le calcul ne voit jamais le sacrifice).
    if (fort && ((m.captured && zone.has(m.to)) || (estEchec && (zone.has(m.to) || colonnes.includes(fidx(m.to)))))) { ajoute(u); continue; }
    // (2) la pièce de plus qui entre dans la zone ou la vise de plus près (avec un accès, A ≥ D + 1) — un sacrifice
    //     d'installation (la pièce va sur une case tenue, type Ch5) y entre aussi, le calcul tranche
    const entre = bougee && bougee.type !== 'p' && (zone.has(m.to) || (map2.attacks.get(bougee) ?? []).some((s) => zone.has(s)));
    if (acces && presence && entre) { ajoute(u); continue; }
    // (3) le levier de pion : une poussée qui met en contact mon pion avec un de ses pions de roque (colonne du roi ou voisine)
    if (acces && m.piece === 'p') {
      const f = fidx(m.to), r = Number(m.to[1]);
      for (const nf of [f - 1, f + 1]) { if (nf < 0 || nf > 7) continue; const q = map2.at[caseNom(nf, r + dir)]; if (q && q.type === 'p' && q.color === adv && colonnes.includes(nf)) { ajoute(u); break; } }
    }
  }
  return out;
}

/**
 * 3A — Toujours un coup d'amélioration (fin de l'étape 3, demande de Sébastien : aucun coup sans idée). Produit TOUJOURS
 * au moins un coup : (1) la pièce la moins active (dame et tours comprises) vers une meilleure case ; (2) le pion passé qui
 * avance ou la pièce qui le soutient ; (3) sinon un coup d'attente qui ne change ni le matériel ni la sécurité.
 */
export function amelioration({ fen, camp }) {
  const map = buildAttackMap(fen);
  const out = [], vus = new Set();
  const ajoute = (u, raison) => { if (!vus.has(u)) { vus.add(u); out.push({ coup: u, raison, noeud: '3A' }); } };
  const sur = (m) => gainEchange(buildAttackMap(apres(fen, m)), m.to, camp) <= 0;
  const rangRoi = camp === 'w' ? 1 : 8;
  // (1) la pièce (dame et tours comprises) la moins active → une case où elle respire plus
  const miennes = map.pieces.filter((p) => p.color === camp && p.type !== 'p' && p.type !== 'k');
  if (miennes.length) {
    const cible = miennes.map((p) => ({ p, m: map.mobility(p) })).sort((a, b) => a.m - b.m)[0].p;
    const mobAvant = map.mobility(cible);
    for (const m of coupsLegaux(fen)) {
      if (m.from !== cible.square) continue;
      const map2 = buildAttackMap(apres(fen, m)), bougee = map2.at[m.to];
      if (!bougee || gainEchange(map2, m.to, camp) > 0) continue;
      if (map2.mobility(bougee) > mobAvant) ajoute(uciDe(m), `rien ne presse : j'améliore ${maPiece(cible.type)} en ${m.to}`);
    }
  }
  // (2) le pion passé qui avance (sans se perdre), ou une pièce qui le soutient par-derrière
  const passes = map.pieces.filter((p) => p.color === camp && estPionPasse(map, p, camp));
  for (const m of coupsLegaux(fen)) {
    if (m.piece !== 'p') continue;
    const dep = passes.find((p) => p.square === m.from);
    if (dep && m.to[0] === m.from[0] && sur(m)) ajoute(uciDe(m), 'j\'avance mon pion passé');
  }
  // (3) un coup d'attente : un coup sûr qui ne prend rien et ne jette rien (seulement si rien de mieux n'a été produit)
  if (!out.length) {
    for (const m of coupsLegaux(fen)) {
      if (m.captured || !sur(m)) continue;
      if (m.piece === 'k' && m.to[1] !== String(rangRoi)) continue; // ne pas promener le roi
      ajoute(uciDe(m), 'j\'attends : ce coup ne change rien'); break;
    }
  }
  if (!out.length) { const m = coupsLegaux(fen)[0]; if (m) ajoute(uciDe(m), 'j\'attends : ce coup ne change rien'); } // garantie : au moins un coup
  return out;
}

export function etape3(ctx) {
  return [...livre(ctx), ...developpement(ctx), ...plansCatalogue(ctx), ...attaqueDuRoi(ctx), ...pirePiece(ctx), ...prophylaxie(ctx)];
}

/* ====================================================================== assemblage ====================================================================== */

/** L'ORDRE de l'arbre : un coup produit par plusieurs nœuds garde le nœud le plus HAUT (sa raison), toutes raisons retenues. */
export const ORDRE = ['1a', '1b', '1c', '1d', '1e', '1f', '2a', '2b', '2c', '2d', '2e', '2f', '3L', '3D', '3C', '3d', '3P', '3Y', '3A'];

/**
 * Produit les candidats de l'arbre (étapes 1, 2, 3 réduite) pour une position, dédoublonnés par coup (nœud le plus haut
 * gardé), chaque candidat portant toutes ses raisons et le nœud retenu.
 * @returns {{ coup, noeud, raison, raisons: {noeud, raison}[] }[]}
 */
export function candidats(ctx) {
  let bruts = [...etape1(ctx), ...etape2(ctx), ...etape3(ctx)];
  if (!bruts.length) bruts = amelioration(ctx); // 3A en dernier recours : aucune autre question n'a produit → « toujours un coup d'amélioration » (l'arbre n'est jamais vide)
  const parCoup = new Map();
  for (const c of bruts) {
    const e = parCoup.get(c.coup) ?? { coup: c.coup, raisons: [] };
    e.raisons.push({ noeud: c.noeud, raison: c.raison, famille: c.famille });
    parCoup.set(c.coup, e);
  }
  const out = [];
  for (const e of parCoup.values()) {
    e.raisons.sort((a, b) => ORDRE.indexOf(a.noeud) - ORDRE.indexOf(b.noeud));
    out.push({ coup: e.coup, noeud: e.raisons[0].noeud, raison: e.raisons[0].raison, famille: e.raisons[0].famille, raisons: e.raisons });
  }
  // dans l'ordre de l'arbre (le radar d'abord), pour la lisibilité du radar
  return out.sort((a, b) => ORDRE.indexOf(a.noeud) - ORDRE.indexOf(b.noeud));
}

/**
 * Les candidats à COMPARER à l'étape 4 : le radar (étape 1, « 1x ») HORS PLAFOND ; le reste (étapes 2, et 3 plus tard)
 * limité à `plafond` (3 par défaut), une famille (= un nœud) d'abord chacune, dans l'ordre de l'arbre. Un coup déjà au
 * radar n'est pas recompté. (Contrat, étape 4.)
 */
export function selectionner(cands, plafond = 3) {
  const radarBrut = cands.filter((c) => c.noeud[0] === '1');
  let radar = radarBrut;
  // Le radar reste hors plafond, mais 1c et 1f (pièce en prise, « s'il jouait deux fois ») produisent toutes les parades :
  // si le radar dépasse 6, on ne garde pour 1c/1f que DEUX parades de chaque famille (prendre, fuir, défendre,
  // s'interposer, contre-attaquer), dans l'ordre de l'arbre. Pas de coupe en dessous de sept. Ce n'est pas un choix par
  // score, c'est un ordre de famille (la mesure du 25 oct. a montré qu'une seule parade par famille coupait le bon coup).
  if (radar.length > 6) {
    const compte = new Map();
    radar = radar.filter((c) => {
      if ((c.noeud !== '1c' && c.noeud !== '1f') || !c.famille) return true;
      const cle = `${c.noeud}:${c.famille}`, n = compte.get(cle) ?? 0;
      if (n >= 2) return false; compte.set(cle, n + 1); return true;
    });
  }
  const dejaRadar = new Set(radar.map((c) => c.coup));
  const reste = cands.filter((c) => c.noeud[0] !== '1' && !dejaRadar.has(c.coup));
  // Quand l'étape 1 n'a rien produit (pas de radar), on compare un candidat de plus des étapes 2-3 : plafond 4.
  const plaf = radarBrut.length === 0 ? Math.max(plafond, 4) : plafond;
  const parFamille = new Map();
  for (const c of reste) { const f = parFamille.get(c.noeud) ?? []; f.push(c); parFamille.set(c.noeud, f); }
  const familles = [...parFamille.keys()].sort((a, b) => ORDRE.indexOf(a) - ORDRE.indexOf(b));
  const choisis = [];
  // un tour par famille d'abord (le premier de chacune), puis on complète famille par famille, jusqu'au plafond
  for (let tour = 0; choisis.length < plaf; tour++) {
    let ajoute = false;
    for (const f of familles) { const liste = parFamille.get(f); if (liste[tour] && choisis.length < plaf) { choisis.push(liste[tour]); ajoute = true; } }
    if (!ajoute) break;
  }
  return [...radar, ...choisis];
}
