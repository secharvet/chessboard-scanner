/**
 * L'évaluation du coach joueur : une boîte de verre (docs/coach-joueur/CHANTIERS-2026-10-24.md, page 1).
 *
 * Douze termes nommés, chacun en version milieu de jeu et finale, aux poids de Stockfish 11 classique
 * (docs/coach-joueur/SF11-CLASSIQUE.md : rien d'inventé sauf les termes « maison » marqués comme tels : développement,
 * échanger quand on mène, finales élémentaires). Unités internes de SF 11 (pion 128 au milieu, 213 en finale) ;
 * `enCentipions` convertit pour l'affichage (× 100 / 213, comme la sortie UCI de SF 11).
 *
 * `evaluer(ech)` rend le score du point de vue du trait (rapide, pour la recherche : aucune allocation dans le chemin
 * chaud, tampons de module). `evaluerDetail(ech)` rend en plus la liste des termes, par camp, pour la trace et la parole :
 * c'est la même fonction, avec un collecteur.
 */
import { BLANC, NOIR, PION, CAVALIER, FOU, TOUR, DAME, ROI, type, couleur, horsJeu, colonne, rangee, nomCase } from './echiquier.mjs';

// ---- Valeurs et tables (SF 11) ------------------------------------------------------------------------------------
export const VALEUR_MG = [0, 128, 781, 825, 1276, 2538, 0];
export const VALEUR_EG = [0, 213, 854, 915, 1380, 2682, 0];
const LIMITE_MILIEU = 15258, LIMITE_FINALE = 3915, TEMPO = 28;

// Placement : rangées 1 → 8, colonnes a → d (miroir e → h) ; pions : colonnes a → h, rangées 2 → 7. [mg, eg] à plat.
const T = (rows) => rows.map((r) => Int16Array.from(r.flat()));
const PSQT = {
  [CAVALIER]: T([[-175, -96, -92, -65, -74, -49, -73, -21], [-77, -67, -41, -54, -27, -18, -15, 8], [-61, -40, -17, -27, 6, -8, 12, 29], [-35, -35, 8, -2, 40, 13, 49, 28], [-34, -45, 13, -16, 44, 9, 51, 39], [-9, -51, 22, -44, 58, -16, 53, 17], [-67, -69, -27, -50, 4, -51, 37, 12], [-201, -100, -83, -88, -56, -56, -26, -17]]),
  [FOU]: T([[-53, -57, -5, -30, -8, -37, -23, -12], [-15, -37, 8, -13, 19, -17, 4, 1], [-7, -16, 21, -1, -5, -2, 17, 10], [-5, -20, 11, -6, 25, 0, 39, 17], [-12, -17, 29, -1, 22, -14, 31, 15], [-16, -30, 6, 6, 1, 4, 11, 6], [-17, -31, -14, -20, 5, -1, 0, 1], [-48, -46, 1, -42, -14, -37, -23, -24]]),
  [TOUR]: T([[-31, -9, -20, -13, -14, -10, -5, -9], [-21, -12, -13, -9, -8, -1, 6, -2], [-25, 6, -11, -8, -1, -2, 3, -6], [-13, -6, -5, 1, -4, -9, -6, 7], [-27, -5, -15, 8, -4, 7, 3, -6], [-22, 6, -2, 1, 6, -7, 12, 10], [-2, 4, 12, 5, 16, 20, 18, -5], [-17, 18, -19, 0, -1, 19, 9, 13]]),
  [DAME]: T([[3, -69, -5, -57, -5, -47, 4, -26], [-3, -55, 5, -31, 8, -22, 12, -4], [-3, -39, 6, -18, 13, -9, 7, 3], [4, -23, 5, -3, 9, 13, 8, 24], [0, -29, 14, -6, 12, 9, 5, 21], [-4, -38, 10, -18, 6, -12, 8, 1], [-5, -50, 6, -27, 10, -24, 8, -8], [-2, -75, -2, -52, 1, -43, -2, -36]]),
  [ROI]: T([[271, 1, 327, 45, 271, 85, 198, 76], [278, 53, 303, 100, 234, 133, 179, 135], [195, 88, 258, 130, 169, 169, 120, 175], [164, 103, 190, 156, 138, 172, 98, 172], [154, 96, 179, 166, 105, 199, 70, 199], [123, 92, 145, 172, 81, 184, 31, 191], [88, 47, 120, 121, 65, 116, 33, 131], [59, 11, 89, 59, 45, 73, -1, 78]]),
};
const PSQT_PION = T([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, -10, 3, -6, 10, 10, 19, 0, 16, 14, 19, 7, 7, -5, -5, -19], [-9, -10, -15, -10, 11, -10, 15, 4, 32, 4, 22, 3, 5, -6, -22, -4],
  [-8, 6, -23, -2, 6, -8, 20, -4, 40, -13, 17, -12, 4, -10, -12, -9], [13, 9, 0, 4, -13, 3, 1, -12, 11, -12, -2, -6, -13, 13, 5, 8],
  [-5, 28, -12, 20, -7, 21, 22, 28, -8, 30, -5, 7, -15, 6, -18, 13], [-7, 0, 7, -11, -3, 12, -13, 21, 5, 25, -16, 19, 10, 4, -8, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
const MOBILITE = {
  [CAVALIER]: Int16Array.from([-62, -81, -53, -56, -12, -30, -4, -14, 3, 8, 13, 15, 22, 23, 28, 27, 33, 33]),
  [FOU]: Int16Array.from([-48, -59, -20, -23, 16, -3, 26, 13, 38, 24, 51, 42, 55, 54, 63, 57, 63, 65, 68, 73, 81, 78, 81, 86, 91, 88, 98, 97]),
  [TOUR]: Int16Array.from([-58, -76, -27, -18, -15, 28, -10, 55, -5, 69, -2, 82, 9, 112, 16, 118, 30, 132, 29, 142, 32, 155, 38, 165, 46, 166, 48, 169, 58, 171]),
  [DAME]: Int16Array.from([-39, -36, -21, -15, 3, 8, 3, 18, 14, 34, 22, 54, 28, 61, 41, 73, 43, 79, 48, 92, 56, 94, 60, 104, 60, 113, 66, 120, 67, 123, 70, 126, 71, 133, 73, 136, 79, 140, 88, 143, 88, 148, 99, 166, 102, 170, 102, 175, 106, 184, 109, 191, 113, 206, 116, 212]),
};
const ISOLE_MG = 5, ISOLE_EG = 15, ARRIERE_MG = 9, ARRIERE_EG = 24, DOUBLE_MG = 11, DOUBLE_EG = 56, FNO_MG = 13, FNO_EG = 27;
const LIE = [0, 7, 8, 12, 29, 48, 86];
const PASSE_MG = [0, 10, 17, 15, 62, 168, 276], PASSE_EG = [0, 28, 33, 41, 72, 177, 260], PASSE_COL_MG = 11, PASSE_COL_EG = 8;
const AVANT_POSTE_MG = 30, AVANT_POSTE_EG = 21, DERRIERE_PION_MG = 18, DERRIERE_PION_EG = 3;
const TOUR_SEMI_MG = 21, TOUR_SEMI_EG = 4, TOUR_OUV_MG = 47, TOUR_OUV_EG = 25, TOUR_ENF_MG = 52, TOUR_ENF_EG = 10;
const PAIRE_FOUS = 90; // material.cpp : QuadraticOurs[BISHOP_PAIR][BISHOP_PAIR] = 1438 / 16
const FOU_PIONS_MG = 3, FOU_PIONS_EG = 7, GRANDE_DIAG_MG = 45;
const MENACE_MINEURE = [[0, 0], [6, 32], [59, 41], [79, 56], [90, 119], [79, 161]];
const MENACE_TOUR = [[0, 0], [3, 44], [38, 71], [38, 61], [0, 38], [51, 38]];
const MENACE_ROI_MG = 24, MENACE_ROI_EG = 89, EN_L_AIR_MG = 69, EN_L_AIR_EG = 36, PION_SUR_MG = 173, PION_SUR_EG = 94;
const ABRI = [[-6, 81, 93, 58, 39, 18, 25], [-43, 61, 35, -49, -29, -11, -63], [-10, 75, 23, -2, 32, 3, -45], [-39, -13, -29, -52, -48, -67, -166]];
const TEMPETE = [[85, -289, -166, 97, 50, 45, 50], [46, -25, 122, 45, 37, -10, 20], [-6, 51, 168, 34, -2, -22, -14], [-15, -11, 101, 4, 11, -15, -29]];
const TEMPETE_BLOQUEE = 82;
const POIDS_ATTAQUE_ROI = [0, 0, 81, 52, 44, 10, 0];
const ECHEC_SUR = [0, 0, 790, 635, 1080, 780, 0];
const SEUIL_ESPACE = 12222;
// Termes « maison » (pas dans SF 11 ; demandés par l'Expert, antithèse § 1-2) : milieu de jeu seulement.
const MAISON = { mineureNonSortie: 15, dameSortieTot: 25, roqueManque: 35 };

const PAS_CAVALIER = [-33, -31, -18, -14, 14, 18, 31, 33], PAS_ROI = [-17, -16, -15, -1, 1, 15, 16, 17];
const PAS_FOU = [-17, -15, 15, 17], PAS_TOUR = [-16, -1, 1, 16];
export const NOMS = ['', 'pion', 'cavalier', 'fou', 'tour', 'dame', 'roi'];

export const enCentipions = (interne) => Math.round(interne * 100 / 213);

// ---- Tampons de module (aucune allocation pendant l'évaluation) ---------------------------------------------------------
const attN = [new Uint8Array(128), new Uint8Array(128)]; // nombre d'attaques par case
const attM = [new Uint8Array(128), new Uint8Array(128)]; // masque des types attaquants (1 << type)
const attPion = [new Uint8Array(128), new Uint8Array(128)];
const anneau = [new Uint8Array(128), new Uint8Array(128)]; // zone du roi du camp k
const voisin = [new Uint8Array(128), new Uint8Array(128)]; // cases adjacentes au roi du camp k
const pcs = [[], []]; for (const k of [0, 1]) for (let t = 0; t <= ROI; t++) pcs[k][t] = new Uint8Array(10);
const npcs = [new Uint8Array(7), new Uint8Array(7)];
const pionsCol = [new Uint8Array(8), new Uint8Array(8)], pMin = [new Int8Array(8), new Int8Array(8)], pMax = [new Int8Array(8), new Int8Array(8)];
const kAttaquants = [0, 0], kPoids = [0, 0], kAttaques = [0, 0]; // attaque du roi adverse par le camp k
const npm = [0, 0];
let mg0 = 0, eg0 = 0, mg1 = 0, eg1 = 0, DETAIL = null;

const rangRel = (sq, k) => (k ? 7 - rangee(sq) : rangee(sq));
const distRoi = (a, b) => Math.max(Math.abs(colonne(a) - colonne(b)), Math.abs(rangee(a) - rangee(b)));
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);

function noter(k, nom, mg, eg, t, sq, texte) {
  if (k) { mg1 += mg; eg1 += eg; } else { mg0 += mg; eg0 += eg; }
  if (DETAIL && (mg || eg)) DETAIL.termes.push({ nom, camp: k ? 'b' : 'w', mg, eg, quoi: texte ?? (t ? `${NOMS[t]} ${nomCase(sq)}` : sq >= 0 ? nomCase(sq) : '') });
}

/** Inventaire, zones des rois, cartes d'attaque et statistiques d'attaque du roi, en une passe. */
function preparer(ech) {
  const c = ech.cases;
  for (const k of [0, 1]) {
    attN[k].fill(0); attM[k].fill(0); attPion[k].fill(0); anneau[k].fill(0); voisin[k].fill(0); npcs[k].fill(0);
    pionsCol[k].fill(0); pMin[k].fill(9); pMax[k].fill(-1); kAttaquants[k] = kPoids[k] = kAttaques[k] = 0; npm[k] = 0;
    const roi = ech.rois[k], cf = clamp(colonne(roi), 1, 6), cr = clamp(rangee(roi), 1, 6);
    for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) anneau[k][(cr + dr) * 16 + cf + df] = 1;
    for (let i = 0; i < 8; i++) { const s = roi + PAS_ROI[i]; if (!horsJeu(s)) voisin[k][s] = 1; }
  }
  for (let sq = 0; sq < 128; sq++) {
    if (horsJeu(sq)) { sq += 7; continue; }
    const p = c[sq]; if (!p) continue;
    const t = type(p), k = couleur(p) >> 3, e = 1 - k, bit = 1 << t;
    pcs[k][t][npcs[k][t]++] = sq;
    if (t === PION) {
      const f = colonne(sq), r = rangRel(sq, k); pionsCol[k][f]++; if (r < pMin[k][f]) pMin[k][f] = r; if (r > pMax[k][f]) pMax[k][f] = r;
      const av = k ? -16 : 16;
      let s = sq + av - 1; if (!horsJeu(s)) { attN[k][s]++; attM[k][s] |= bit; attPion[k][s] = 1; }
      s = sq + av + 1; if (!horsJeu(s)) { attN[k][s]++; attM[k][s] |= bit; attPion[k][s] = 1; }
      continue;
    }
    if (t !== ROI) npm[k] += VALEUR_MG[t];
    let touche = 0;
    if (t === CAVALIER || t === ROI) {
      const pas = t === CAVALIER ? PAS_CAVALIER : PAS_ROI;
      for (let i = 0; i < 8; i++) { const s = sq + pas[i]; if (horsJeu(s)) continue; attN[k][s]++; attM[k][s] |= bit; if (t !== ROI) { if (anneau[e][s]) touche = 1; if (voisin[e][s]) kAttaques[k]++; } }
    } else {
      const pas = t === FOU ? PAS_FOU : t === TOUR ? PAS_TOUR : PAS_ROI, n = pas.length;
      for (let i = 0; i < n; i++) { const d = pas[i]; let s = sq + d; while (!horsJeu(s)) { attN[k][s]++; attM[k][s] |= bit; if (anneau[e][s]) touche = 1; if (voisin[e][s]) kAttaques[k]++; if (c[s]) break; s += d; } }
    }
    if (touche) { kAttaquants[k]++; kPoids[k] += POIDS_ATTAQUE_ROI[t]; }
  }
}

// ---- L'évaluation ---------------------------------------------------------------------------------------------------
/**
 * @param {import('./echiquier.mjs').Echiquier} ech
 * @param {object} [detail]  si fourni, reçoit `termes` : [{ nom, camp: 'w'|'b', mg, eg, quoi }]
 * @returns {number} score interne du point de vue du trait
 */
export function evaluer(ech, detail = null) {
  DETAIL = detail; mg0 = eg0 = mg1 = eg1 = 0;
  preparer(ech);
  const c = ech.cases;
  const npmTotal = npm[0] + npm[1];
  const phase = clamp(npmTotal, LIMITE_FINALE, LIMITE_MILIEU);
  const ouverture = clamp((npmTotal - 11000) / (LIMITE_MILIEU - 11000), 0, 1);

  for (let k = 0; k < 2; k++) {
    const e = 1 - k, moi = k ? NOIR : BLANC, lui = moi ^ NOIR, avant = k ? -16 : 16;
    const roi = ech.rois[k], roiEux = ech.rois[e], P = pcs[k], N = npcs[k];
    const pionMoi = PION | moi;
    const leurRang = (f) => (pionsCol[e][f] ? 7 - pMax[e][f] : 0); // rang relatif à nous du pion adverse le plus proche

    // 1. Matériel, 2. Placement
    for (let t = PION; t <= ROI; t++) for (let i = 0; i < N[t]; i++) {
      const sq = P[t][i], r = rangRel(sq, k), f = colonne(sq);
      if (t !== ROI) noter(k, 'matériel', VALEUR_MG[t], VALEUR_EG[t], t, sq);
      if (t === PION) noter(k, 'placement', PSQT_PION[r][2 * f], PSQT_PION[r][2 * f + 1], t, sq);
      else { const ff = f < 4 ? f : 7 - f; noter(k, 'placement', PSQT[t][r][2 * ff], PSQT[t][r][2 * ff + 1], t, sq); }
    }

    // 3. Pions, 4. Pions passés
    for (let i = 0; i < N[PION]; i++) {
      const sq = P[PION][i], f = colonne(sq), r = rangRel(sq, k);
      const g1 = f - 1, g2 = f + 1;
      const voisins = (g1 >= 0 && pionsCol[k][g1]) || (g2 < 8 && pionsCol[k][g2]);
      const voisinsDerriere = (g1 >= 0 && pionsCol[k][g1] && pMin[k][g1] <= r) || (g2 < 8 && pionsCol[k][g2] && pMin[k][g2] <= r);
      const oppose = pionsCol[e][f] && leurRang(f) > r;
      const s1 = sq - avant - 1, s2 = sq - avant + 1;
      const soutiens = (!horsJeu(s1) && c[s1] === pionMoi ? 1 : 0) + (!horsJeu(s2) && c[s2] === pionMoi ? 1 : 0);
      const phalange = (!horsJeu(sq - 1) && c[sq - 1] === pionMoi) || (!horsJeu(sq + 1) && c[sq + 1] === pionMoi);
      const double = !horsJeu(sq - avant) && c[sq - avant] === pionMoi;
      const passe = !oppose && !(g1 >= 0 && pionsCol[e][g1] && leurRang(g1) > r) && !(g2 < 8 && pionsCol[e][g2] && leurRang(g2) > r);
      if (soutiens || phalange) { const v = LIE[r] * (2 + (phalange ? 1 : 0) - (oppose ? 1 : 0)) + 21 * soutiens; noter(k, 'pion lié', v, Math.trunc(v * (r - 2) / 4), PION, sq); }
      else if (!voisins) noter(k, 'pion isolé', -ISOLE_MG - (oppose ? 0 : FNO_MG), -ISOLE_EG - (oppose ? 0 : FNO_EG), PION, sq);
      else if (!voisinsDerriere && !horsJeu(sq + avant) && attPion[e][sq + avant]) noter(k, 'pion arriéré', -ARRIERE_MG - (oppose ? 0 : FNO_MG), -ARRIERE_EG - (oppose ? 0 : FNO_EG), PION, sq);
      if (double && !soutiens) noter(k, 'pion doublé', -DOUBLE_MG, -DOUBLE_EG, PION, sq);
      if (passe && r >= 1) {
        let bmg = PASSE_MG[r], beg = PASSE_EG[r];
        if (r > 2) {
          const w = 5 * r - 13, bloc = sq + avant;
          beg += (Math.trunc(Math.min(distRoi(roiEux, bloc), 5) * 19 / 4) - Math.min(distRoi(roi, bloc), 5) * 2) * w;
          if (r !== 6) beg -= Math.min(distRoi(roi, bloc + avant), 5) * w;
          if (!c[bloc]) {
            let sur = true, blocSur = true;
            for (let s = bloc; !horsJeu(s); s += avant) if (attN[e][s]) { sur = false; if (s === bloc) blocSur = false; }
            const kk = (sur ? 35 : blocSur ? 9 : 0) + (attN[k][bloc] ? 5 : 0);
            bmg += kk * w; beg += kk * w;
          }
        }
        const col = f < 4 ? f : 7 - f;
        noter(k, 'pion passé', bmg - PASSE_COL_MG * col, beg - PASSE_COL_EG * col, PION, sq);
      }
    }

    // 5-8. Pièces
    if (N[FOU] >= 2) noter(k, 'paire de fous', PAIRE_FOUS, PAIRE_FOUS, 0, -1);
    for (let t = CAVALIER; t <= DAME; t++) for (let i = 0; i < N[t]; i++) {
      const sq = P[t][i], f = colonne(sq), r = rangRel(sq, k);
      let mob = 0;
      if (t === CAVALIER) { for (let j = 0; j < 8; j++) { const s = sq + PAS_CAVALIER[j]; if (horsJeu(s)) continue; const q = c[s]; if (!attPion[e][s] && q !== pionMoi && q !== (ROI | moi) && q !== (DAME | moi)) mob++; } }
      else { const pas = t === FOU ? PAS_FOU : t === TOUR ? PAS_TOUR : PAS_ROI, n = pas.length; for (let j = 0; j < n; j++) { let s = sq + pas[j]; while (!horsJeu(s)) { const q = c[s]; if (!attPion[e][s] && q !== pionMoi && q !== (ROI | moi) && q !== (DAME | moi)) mob++; if (q) break; s += pas[j]; } } }
      const M = MOBILITE[t], mi = Math.min(mob, (M.length >> 1) - 1);
      noter(k, 'mobilité', M[2 * mi], M[2 * mi + 1], t, sq);
      if (t === CAVALIER || t === FOU) {
        if (r >= 3 && r <= 5 && attPion[k][sq] && !(f > 0 && pionsCol[e][f - 1] && leurRang(f - 1) > r) && !(f < 7 && pionsCol[e][f + 1] && leurRang(f + 1) > r)) {
          const m = t === CAVALIER ? 2 : 1; noter(k, 'avant-poste', AVANT_POSTE_MG * m, AVANT_POSTE_EG * m, t, sq);
        }
        if (!horsJeu(sq + avant) && type(c[sq + avant]) === PION) noter(k, 'mineure derrière un pion', DERRIERE_PION_MG, DERRIERE_PION_EG, t, sq);
        if (t === FOU) {
          const couleurCase = (f + rangee(sq)) & 1;
          let memes = 0, bloques = 0;
          for (let j = 0; j < N[PION]; j++) { const s = P[PION][j]; if (((colonne(s) + rangee(s)) & 1) === couleurCase) memes++; if (colonne(s) >= 2 && colonne(s) <= 5 && c[s + avant]) bloques++; }
          if (memes) noter(k, 'fou gêné par ses pions', -FOU_PIONS_MG * memes * (1 + bloques), -FOU_PIONS_EG * memes * (1 + bloques), t, sq);
          const rg = rangee(sq);
          if ((f === rg || f + rg === 7) && r <= 2) {
            const a = f === rg ? 0x33 : 0x34, b = f === rg ? 0x44 : 0x43;
            if (type(c[a]) !== PION && type(c[b]) !== PION) noter(k, 'grande diagonale', GRANDE_DIAG_MG, 0, t, sq);
          }
        }
      }
      if (t === TOUR) {
        if (!pionsCol[k][f]) { if (pionsCol[e][f]) noter(k, 'tour sur colonne semi-ouverte', TOUR_SEMI_MG, TOUR_SEMI_EG, t, sq); else noter(k, 'tour sur colonne ouverte', TOUR_OUV_MG, TOUR_OUV_EG, t, sq); }
        else if (mob <= 3 && r === 0 && rangRel(roi, k) === 0) {
          const fr = colonne(roi);
          if ((fr < 4) === (f < fr)) { const m = (ech.roque & (k ? 12 : 3)) ? 1 : 2; noter(k, 'tour enfermée', -TOUR_ENF_MG * m, -TOUR_ENF_EG * m, t, sq); }
        }
      }
    }

    // 9. Sécurité du roi : abri et tempête, puis danger
    const droitR = k ? (ech.roque & 4) : (ech.roque & 1), droitD = k ? (ech.roque & 8) : (ech.roque & 2);
    const abriSur = (ksq) => {
      let b = 5, be = 5;
      const centre = clamp(colonne(ksq), 1, 6);
      for (let f = centre - 1; f <= centre + 1; f++) {
        const d = f < 4 ? f : 7 - f, notre = pionsCol[k][f] ? pMin[k][f] : 0, leur = leurRang(f);
        b += ABRI[d][notre];
        if (notre && notre === leur - 1) { if (leur === 2) { b -= TEMPETE_BLOQUEE; be -= TEMPETE_BLOQUEE; } }
        else b -= TEMPETE[d][leur];
      }
      return be * 65536 + (b & 0xffff); // paire tassée : (be << 16) | (b non signé 16 bits)
    };
    const depaquer = (v) => [(v & 0xffff) << 16 >> 16, Math.floor(v / 65536)];
    let [abMg, abEg] = depaquer(abriSur(roi));
    if (droitR) { const [x, y] = depaquer(abriSur(k ? 118 : 6)); if (x > abMg) { abMg = x; abEg = y; } }
    if (droitD) { const [x, y] = depaquer(abriSur(k ? 114 : 2)); if (x > abMg) { abMg = x; abEg = y; } }
    let distPion = N[PION] ? 8 : 0;
    for (let i = 0; i < N[PION]; i++) { const d = distRoi(roi, P[PION][i]); if (d < distPion) distPion = d; }
    abEg -= 16 * distPion;
    noter(k, 'abri du roi', abMg, abEg, 0, roi);
    {
      let faibles = 0;
      for (let s = 0; s < 128; s++) { if (horsJeu(s)) { s += 7; continue; } if (anneau[k][s] && attN[e][s] && attN[k][s] < 2 && (!attN[k][s] || !(attM[k][s] & ~((1 << ROI) | (1 << DAME))))) faibles++; }
      let danger = kAttaquants[e] * kPoids[e] + 185 * faibles + 69 * kAttaques[e];
      // échecs : cases d'où une pièce adverse donnerait échec, sûres ou non
      let nonSurs = 0;
      const sur = (s) => attN[k][s] === 0 || (attN[e][s] >= 2 && anneau[k][s] && attN[k][s] < 2);
      let echecT = 0, echecD = 0, echecF = 0, echecC = 0, nsT = 0, nsD = 0, nsF = 0, nsC = 0; // 1 = possible, 2 = sûr
      for (let j = 0; j < 4; j++) {
        let s = roi + PAS_TOUR[j];
        while (!horsJeu(s)) { const q = c[s]; if (q && couleur(q) === lui) break; if (!q || couleur(q) === moi) { if (!q) { if (attM[e][s] & (1 << TOUR)) { if (sur(s)) echecT = 2; else { echecT |= 1; nsT++; } } if (attM[e][s] & (1 << DAME)) { if (sur(s)) echecD = 2; else { echecD |= 1; nsD++; } } } } if (q) break; s += PAS_TOUR[j]; }
        s = roi + PAS_FOU[j];
        while (!horsJeu(s)) { const q = c[s]; if (q && couleur(q) === lui) break; if (!q) { if (attM[e][s] & (1 << FOU)) { if (sur(s)) echecF = 2; else { echecF |= 1; nsF++; } } if (attM[e][s] & (1 << DAME)) { if (sur(s)) echecD = 2; else { echecD |= 1; nsD++; } } } if (q) break; s += PAS_FOU[j]; }
      }
      for (let j = 0; j < 8; j++) { const s = roi + PAS_CAVALIER[j]; if (horsJeu(s) || (c[s] && couleur(c[s]) === lui)) continue; if (attM[e][s] & (1 << CAVALIER)) { if (sur(s)) echecC = 2; else { echecC |= 1; nsC++; } } }
      if (echecT === 2) danger += ECHEC_SUR[TOUR]; else nonSurs += nsT;
      if (echecD === 2) danger += ECHEC_SUR[DAME]; else nonSurs += nsD;
      if (echecF === 2) danger += ECHEC_SUR[FOU]; else nonSurs += nsF;
      if (echecC === 2) danger += ECHEC_SUR[CAVALIER]; else nonSurs += nsC;
      danger += 148 * nonSurs;
      let cloues = 0;
      for (let j = 0; j < 8; j++) {
        const d = PAS_ROI[j], diag = (d % 16 !== 0 && Math.abs(d) !== 1);
        let s = roi + d, premiere = 0;
        while (!horsJeu(s)) { const q = c[s]; if (q) { if (!premiere) { if (couleur(q) !== moi) break; premiere = 1; } else { const tq = type(q); if (couleur(q) === lui && (tq === DAME || tq === (diag ? FOU : TOUR))) cloues++; break; } } s += d; }
      }
      danger += 98 * cloues;
      let cavalierDefend = 0;
      for (let j = 0; j < 8; j++) { const s = roi + PAS_ROI[j]; if (!horsJeu(s) && (attM[k][s] & (1 << CAVALIER))) { cavalierDefend = 1; break; } }
      danger += -873 * (npcs[e][DAME] ? 0 : 1) - 100 * cavalierDefend - Math.trunc(6 * abMg / 8) + 37;
      if (danger > 100) noter(k, 'danger du roi', -Math.trunc(danger * danger / 4096), -Math.trunc(danger / 16), 0, roi, DETAIL ? `${nomCase(roi)} : ${kAttaquants[e]} attaquant(s), ${faibles} case(s) faible(s)` : undefined);
    }

    // 10. Menaces sur les pièces adverses
    for (let t = PION; t <= DAME; t++) for (let i = 0; i < npcs[e][t]; i++) {
      const sq = pcs[e][t][i];
      if (!attN[k][sq]) continue;
      const bienProtegee = attPion[e][sq] || (attN[e][sq] >= 2 && attN[k][sq] < 2);
      if (!bienProtegee) {
        if (attM[k][sq] & ((1 << CAVALIER) | (1 << FOU))) noter(k, 'menace par une mineure', MENACE_MINEURE[t][0], MENACE_MINEURE[t][1], t, sq);
        if (attM[k][sq] & (1 << TOUR)) noter(k, 'menace par une tour', MENACE_TOUR[t][0], MENACE_TOUR[t][1], t, sq);
        if (t !== PION && (attM[k][sq] & (1 << ROI))) noter(k, 'menace par le roi', MENACE_ROI_MG, MENACE_ROI_EG, t, sq);
        if (!attN[e][sq] || (t !== PION && attN[k][sq] >= 2)) noter(k, 'pièce en l\'air', EN_L_AIR_MG, EN_L_AIR_EG, t, sq);
      }
      if (t !== PION && attPion[k][sq]) {
        const s1 = sq - avant - 1, s2 = sq - avant + 1;
        const surS = (s) => !horsJeu(s) && c[s] === pionMoi && (!attN[e][s] || attN[k][s]);
        if (surS(s1) || surS(s2)) noter(k, 'attaquée par un pion sûr', PION_SUR_MG, PION_SUR_EG, t, sq);
      }
    }

    // 11. Développement (maison), tant que c'est l'ouverture
    if (ouverture > 0) {
      const r0 = k ? 112 : 0;
      let nonSorties = 0;
      for (const f of [1, 2, 5, 6]) { const p = c[r0 + f]; if (p && couleur(p) === moi && (type(p) === CAVALIER || type(p) === FOU)) nonSorties++; }
      if (nonSorties) noter(k, 'développement', -Math.round(MAISON.mineureNonSortie * nonSorties * ouverture), 0, 0, -1, DETAIL ? `${nonSorties} mineure(s) pas sortie(s)` : undefined);
      if (nonSorties >= 2 && N[DAME] && rangRel(P[DAME][0], k) >= 2) noter(k, 'dame sortie tôt', -Math.round(MAISON.dameSortieTot * ouverture), 0, DAME, P[DAME][0]);
      const aRoque = rangRel(roi, k) === 0 && (colonne(roi) >= 6 || colonne(roi) <= 2);
      if (!aRoque && !droitR && !droitD && npcs[e][DAME]) noter(k, 'roque manqué', -Math.round(MAISON.roqueManque * ouverture), 0, ROI, roi);
    }

    // 12. Espace (milieu de jeu)
    if (npmTotal > SEUIL_ESPACE) {
      let bonus = 0;
      for (let f = 2; f <= 5; f++) for (let r = 1; r <= 3; r++) {
        const sq = k ? (7 - r) * 16 + f : r * 16 + f;
        if (c[sq] === pionMoi || attPion[e][sq] || (attN[e][sq] && !attN[k][sq])) continue;
        bonus++;
        let derriere = false; for (let s = sq - avant; !horsJeu(s); s -= avant) if (c[s] === pionMoi) { derriere = true; break; }
        if (derriere && !attN[e][sq]) bonus++;
      }
      let nb = -1; for (let t = PION; t <= ROI; t++) nb += N[t];
      noter(k, 'espace', Math.trunc(bonus * nb * nb / 16), 0, 0, -1, DETAIL ? `${bonus} case(s)` : undefined);
    }
  }

  // Règles de jeu (maison) : échanger quand on mène ; finales élémentaires
  const mat0 = npm[0] + npcs[0][PION] * VALEUR_MG[PION], mat1 = npm[1] + npcs[1][PION] * VALEUR_MG[PION];
  const fort = mat0 >= mat1 ? 0 : 1, faible = 1 - fort, avance = Math.abs(mat0 - mat1);
  if (avance >= 2 * VALEUR_MG[PION] && npmTotal < LIMITE_MILIEU) {
    const v = Math.trunc(Math.min(avance, 1000) * (1 - npmTotal / LIMITE_MILIEU) / 4);
    noter(fort, 'échanger quand on mène', v, v, 0, -1, DETAIL ? 'avantage matériel' : undefined);
  }
  if (!npm[faible] && !npcs[faible][PION] && npm[fort] >= VALEUR_MG[TOUR]) {
    const rk = ech.rois[fort], rl = ech.rois[faible];
    const bord = Math.max(Math.abs(2 * colonne(rl) - 7), Math.abs(2 * rangee(rl) - 7)); // 1 au centre … 7 au bord
    const v = 60 * bord + 40 * (14 - distRoi(rk, rl)); // maison : ~28 cp par rang vers le bord, ~19 cp par pas de notre roi
    noter(fort, 'mat forcé : roi au bord, le nôtre s\'approche', 0, v, ROI, rl);
  }

  // Phase, facteur d'échelle, total du point de vue du trait
  let sf = 64;
  const fB = pcs[0][FOU], fN = pcs[1][FOU];
  const opposes = npcs[0][FOU] === 1 && npcs[1][FOU] === 1 && (((colonne(fB[0]) + rangee(fB[0])) & 1) !== ((colonne(fN[0]) + rangee(fN[0])) & 1));
  if (opposes && npmTotal === 2 * VALEUR_MG[FOU]) sf = 22;
  else if (opposes) sf = Math.min(sf, 36 + 2 * npcs[fort][PION]);
  else if (!npcs[0][PION] && !npcs[1][PION] && avance < VALEUR_MG[TOUR] && !npcs[fort][DAME]) sf = 8; // sans pions, moins d'une tour d'avance ne gagne pas
  else sf = Math.min(sf, 36 + 7 * npcs[fort][PION]);
  sf = Math.max(0, sf - Math.trunc((ech.demi - 12) / 4));
  const mgT = mg0 - mg1, egT = eg0 - eg1;
  const p128 = Math.trunc((phase - LIMITE_FINALE) * 128 / (LIMITE_MILIEU - LIMITE_FINALE));
  let v = Math.trunc((mgT * p128 + Math.trunc(egT * (128 - p128) * sf / 64)) / 128);
  v = (ech.trait === BLANC ? v : -v) + TEMPO;
  if (detail) { detail.blancs = { mg: mg0, eg: eg0 }; detail.noirs = { mg: mg1, eg: eg1 }; detail.phase = p128; detail.sf = sf; detail.total = v; detail.totalBlancs = ech.trait === BLANC ? v : -v; }
  DETAIL = null;
  return v;
}

export function evaluerDetail(ech) { const d = { termes: [] }; evaluer(ech, d); return d; }

/** Valeur d'un terme tassée en un seul nombre (milieu / finale selon la phase), en unités internes, pour la trace. */
export const valeurTerme = (t, phase128) => Math.round((t.mg * phase128 + t.eg * (128 - phase128)) / 128);
