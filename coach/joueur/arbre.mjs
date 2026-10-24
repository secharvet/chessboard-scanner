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
    let raison = null;
    if (m.from === cible.square) {
      // la pièce elle-même bouge : fuir, prendre l'attaquant, ou s'échanger (prendre une pièce, même reprise, si le bilan tient)
      const encore = map2.at[m.to];
      const perte = encore && encore.color === camp ? gainEchange(map2, m.to, camp) : VAL[cible.type];
      const gagne = m.captured ? VAL[m.captured] : 0;
      if (gagne - perte < 0) continue; // fuite vers une case en prise, ou échange perdant
      if (attaquants.includes(m.to)) raison = `je prends ${saPiece(m.captured)} qui attaquait ${nom}`;
      else if (m.captured) raison = `${nom} est attaqué : je l'échange contre ${saPiece(m.captured)}`;
      else raison = `je mets ${nom} à l'abri en ${m.to}`;
    } else {
      // une autre pièce joue : prendre l'attaquant, s'interposer, ou ajouter un défenseur
      const encore = map2.at[cible.square];
      if (!encore || encore.color !== camp || gainEchange(map2, cible.square, camp) > 0) continue; // toujours en prise → pas une parade
      raison = attaquants.includes(m.to) ? `je prends ${saPiece(m.captured)} qui attaquait ${nom}` : `je défends ${nom} en ${cible.square}`;
    }
    out.push({ coup: u, raison, noeud: '1c' });
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
export function deuxCoups({ fen, sonde }) {
  if (!sonde?.menace || sonde.menace.mat || typeof sonde.paree !== 'function') return []; // le mat, c'est 1b
  const perte = sonde.menace.perte ?? 'du matériel';
  const out = [];
  for (const m of coupsLegaux(fen)) { const u = uciDe(m); if (sonde.paree(u)) out.push({ coup: u, raison: `s'il jouait deux fois il gagnerait ${perte} : je pare`, noeud: '1f' }); }
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

/** 2b — Une prise (ou un échec) qui gagne du matériel, le plus gros d'abord (compte sur la case). */
export function priseGagnante({ fen, camp }) {
  const map = buildAttackMap(fen), out = [];
  for (const m of coupsLegaux(fen)) {
    if (!m.captured) continue;
    const g = gainEchange(map, m.to, other(camp)); // gain pour moi si j'ouvre les prises sur sa pièce en m.to
    if (g > 0) out.push({ coup: uciDe(m), raison: `je prends ${saPiece(m.captured)} en ${m.to} et je gagne du matériel`, noeud: '2b', _poids: VAL[m.captured] });
  }
  return out.sort((a, b) => b._poids - a._poids).map(({ _poids, ...c }) => c); // la plus grosse prise d'abord
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

export function etape2(ctx) {
  return [...monMat(ctx), ...priseGagnante(ctx), ...intermede(ctx), ...pieceNonDefendue(ctx), ...tactiqueNommee(ctx)];
}

/* ====================================================================== assemblage ====================================================================== */

/** L'ORDRE de l'arbre : un coup produit par plusieurs nœuds garde le nœud le plus HAUT (sa raison), toutes raisons retenues. */
export const ORDRE = ['1a', '1b', '1c', '1d', '1e', '1f', '2a', '2b', '2c', '2d', '2e'];

/**
 * Produit les candidats du radar (étapes 1 et 2) pour une position, dédoublonnés par coup (nœud le plus haut gardé),
 * chaque candidat portant toutes ses raisons et le nœud retenu. L'étape 3 (réduite) s'ajoutera après la mi-chemin.
 * @returns {{ coup, noeud, raison, raisons: {noeud, raison}[] }[]}
 */
export function candidats(ctx) {
  const bruts = [...etape1(ctx), ...etape2(ctx)];
  const parCoup = new Map();
  for (const c of bruts) {
    const e = parCoup.get(c.coup) ?? { coup: c.coup, raisons: [] };
    e.raisons.push({ noeud: c.noeud, raison: c.raison });
    parCoup.set(c.coup, e);
  }
  const out = [];
  for (const e of parCoup.values()) {
    e.raisons.sort((a, b) => ORDRE.indexOf(a.noeud) - ORDRE.indexOf(b.noeud));
    out.push({ coup: e.coup, noeud: e.raisons[0].noeud, raison: e.raisons[0].raison, raisons: e.raisons });
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
  const radar = cands.filter((c) => c.noeud[0] === '1');
  const dejaRadar = new Set(radar.map((c) => c.coup));
  const reste = cands.filter((c) => c.noeud[0] !== '1' && !dejaRadar.has(c.coup));
  const parFamille = new Map();
  for (const c of reste) { const f = parFamille.get(c.noeud) ?? []; f.push(c); parFamille.set(c.noeud, f); }
  const familles = [...parFamille.keys()].sort((a, b) => ORDRE.indexOf(a) - ORDRE.indexOf(b));
  const choisis = [];
  // un tour par famille d'abord (le premier de chacune), puis on complète famille par famille, jusqu'au plafond
  for (let tour = 0; choisis.length < plafond; tour++) {
    let ajoute = false;
    for (const f of familles) { const liste = parFamille.get(f); if (liste[tour] && choisis.length < plafond) { choisis.push(liste[tour]); ajoute = true; } }
    if (!ajoute) break;
  }
  return [...radar, ...choisis];
}
