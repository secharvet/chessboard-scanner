/**
 * La grammaire enrichie du coach joueur : les sept structures de l'Expert (livrables/grammaire-enrichie.md, 25 octobre
 * 2026) ajoutées aux sept structures de positional/structures.js, avec leurs plans canoniques.
 *
 * Une structure = { name, color (le camp propriétaire), params }. Les rangées sont RELATIVES au camp (la 4e rangée des
 * Noirs est la 5e de l'échiquier). Les plans sont des instances des familles de coach/plan-distance.mjs (poussee, rupture,
 * transfert, colonne), écrits ici côté propriétaire puis mis en miroir.
 *
 * Ce module ne touche pas positional/ : les anciennes structures sont reprises telles quelles par buildStructureFacts.
 */
import { Chess } from 'chess.js';
import { buildStructureFacts } from '../../positional/structures.js';
import { distance } from '../plan-distance.mjs';

const FILES = 'abcdefgh';
const rel = (sq, color) => (color === 'w' ? Number(sq[1]) : 9 - Number(sq[1])); // rangée relative 1..8
const caseRel = (file, rangRel, color) => `${file}${color === 'w' ? rangRel : 9 - rangRel}`; // case depuis une rangée relative
const VAL = { p: 0, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Inventaire d'une position : pièces par camp, pions par colonne, numéro de coup. */
function lire(fen) {
  const c = new Chess(fen);
  const pieces = { w: [], b: [] };
  for (const row of c.board()) for (const p of row) if (p) pieces[p.color].push({ type: p.type, square: p.square, file: p.square[0], rank: Number(p.square[1]) });
  const pions = { w: pieces.w.filter((p) => p.type === 'p'), b: pieces.b.filter((p) => p.type === 'p') };
  const npm = { w: pieces.w.reduce((s, p) => s + VAL[p.type], 0), b: pieces.b.reduce((s, p) => s + VAL[p.type], 0) };
  const roi = { w: pieces.w.find((p) => p.type === 'k')?.square, b: pieces.b.find((p) => p.type === 'k')?.square };
  const coup = Number(fen.split(' ')[5] ?? 1);
  const roques = fen.split(' ')[2] ?? '-';
  return { c, pieces, pions, npm, roi, coup, roques, fen };
}

const other = (s) => (s === 'w' ? 'b' : 'w');
/** Un pion passé : aucun pion adverse devant lui, sur sa colonne ni sur les deux voisines. */
function estPasse(p, color, pionsEux) {
  const f = FILES.indexOf(p.file);
  return !pionsEux.some((q) => Math.abs(FILES.indexOf(q.file) - f) <= 1 && (color === 'w' ? q.rank > p.rank : q.rank < p.rank));
}
const estFinale = (L) => !L.pieces.w.some((p) => p.type === 'q') && !L.pieces.b.some((p) => p.type === 'q') && L.npm.w <= 8 && L.npm.b <= 8;
/** Roi roqué : sur sa première rangée, colonnes a-c ou g-h, et plus aucun droit de roque. */
const roiRoque = (L, color) => { const k = L.roi[color]; if (!k) return false; const droits = color === 'w' ? /[KQ]/ : /[kq]/; return rel(k, color) === 1 && 'abcgh'.includes(k[0]) && !droits.test(L.roques); };

/**
 * Les structures reconnues dans la position, anciennes et nouvelles.
 * @returns {{ name: string, color: 'w'|'b', params: object }[]}
 */
export function structuresEtendues(fen) {
  const L = lire(fen);
  const out = buildStructureFacts(fen).filter((t) => t.id === 'STRUCTURE' && t.params?.name).map((t) => ({ name: t.params.name, color: t.params.color, params: {} }));
  const finale = estFinale(L);
  for (const color of ['w', 'b']) {
    const eux = other(color), mes = L.pions[color], ses = L.pions[eux];
    // 1. PION_PASSE : à la 4e rangée relative ou plus loin ; en finale, à toute rangée. On garde le plus avancé.
    const passes = mes.filter((p) => estPasse(p, color, ses) && (finale || rel(p.square, color) >= 4)).sort((a, b) => rel(b.square, color) - rel(a.square, color));
    if (passes.length) out.push({ name: 'PION_PASSE', color, params: { pion: passes[0].square } });
    // 2. ROI_AU_CENTRE : son roi sur c-f à sa 1re ou 2e rangée, dames présentes, coup 8 passé, colonne d ou e sans pion à lui, ET mon roi roqué.
    const kLui = L.roi[eux];
    if (kLui && 'cdef'.includes(kLui[0]) && rel(kLui, eux) <= 2 && L.pieces[color].some((p) => p.type === 'q') && L.coup > 8 && roiRoque(L, color)) {
      const sansPionLui = (f) => !ses.some((p) => p.file === f);
      if (sansPionLui('e') || sansPionLui('d')) out.push({ name: 'ROI_AU_CENTRE', color, params: { colonne: sansPionLui('e') ? 'e' : 'd', levier: mes.some((p) => p.file === 'd') ? 'd' : mes.some((p) => p.file === 'e') ? 'e' : null } });
    }
    // 3. MAJORITE : plus de pions sur une aile et pas plus sur l'autre, après le coup 12.
    if (L.coup > 12) {
      const aile = (ps, dame) => ps.filter((p) => (FILES.indexOf(p.file) <= 3) === dame).length;
      for (const [nomAile, dame] of [['dame', true], ['roi', false]]) {
        if (aile(mes, dame) > aile(ses, dame) && aile(mes, !dame) <= aile(ses, !dame)) {
          const candidats = mes.filter((p) => (FILES.indexOf(p.file) <= 3) === dame);
          const devant = (p) => ses.filter((q) => q.file === p.file && (color === 'w' ? q.rank > p.rank : q.rank < p.rank)).length;
          const libres = candidats.filter((p) => devant(p) === 0);
          const choix = (libres.length ? libres : candidats).sort((a, b) => devant(a) - devant(b) || rel(b.square, color) - rel(a.square, color))[0];
          if (choix) out.push({ name: 'MAJORITE', color, params: { aile: nomAile, candidat: choix.square } });
        }
      }
    }
    // 6. RUBINSTEIN : moi d4 (relatif) sans pion e ; lui e6 (sa 3e) sans pion d.
    if (mes.some((p) => p.file === 'd' && rel(p.square, color) === 4) && !mes.some((p) => p.file === 'e') && ses.some((p) => p.file === 'e' && rel(p.square, eux) === 3) && !ses.some((p) => p.file === 'd')) out.push({ name: 'RUBINSTEIN', color, params: {} });
  }
  // 4. UNE_COLONNE_OUVERTE : exactement une colonne sans aucun pion, une tour au moins de chaque côté (les deux camps).
  const ouvertes = [...FILES].filter((f) => !L.pions.w.some((p) => p.file === f) && !L.pions.b.some((p) => p.file === f));
  if (ouvertes.length === 1 && L.pieces.w.some((p) => p.type === 'r') && L.pieces.b.some((p) => p.type === 'r')) for (const color of ['w', 'b']) out.push({ name: 'UNE_COLONNE_OUVERTE', color, params: { colonne: ouvertes[0] } });
  // 5. FINALE : pas de dames, au plus tour + mineure hors pions de chaque côté (les deux camps).
  if (finale) for (const color of ['w', 'b']) out.push({ name: 'FINALE', color, params: {} });
  // 7. CENTRE_OUVERT : aucun pion sur les colonnes d et e, des deux côtés (les deux camps).
  if (!L.pions.w.some((p) => 'de'.includes(p.file)) && !L.pions.b.some((p) => 'de'.includes(p.file))) for (const color of ['w', 'b']) out.push({ name: 'CENTRE_OUVERT', color, params: {} });
  return out;
}

/** La pièce de ce type, à `side`, la plus proche de la cible (par la distance du plan) ; null si aucune ne peut y aller. */
function plusProche(fen, side, type, vers, L) {
  let best = null, bd = Infinity;
  for (const p of L.pieces[side].filter((x) => x.type === type)) { const d = distance(fen, side, { famille: 'transfert', de: p.square, vers }).d; if (d < bd) { bd = d; best = p.square; } }
  return best ? { famille: 'transfert', de: best, vers } : null;
}
const caseDevant = (pion, color) => `${pion[0]}${Number(pion[1]) + (color === 'w' ? 1 : -1)}`;
const caseDerriere = (pion, color) => `${pion[0]}${Number(pion[1]) - (color === 'w' ? 1 : -1)}`;

/**
 * Les plans canoniques du camp `side` pour une structure étendue (les sept anciennes passent par coach/plans-structures.mjs).
 * @returns {{ plan: object, pourquoi: string, role: 'owner'|'opponent' }[]}
 */
export function instancierEtendu(fen, side, tok) {
  const L = lire(fen), owner = tok.color, role = owner === side ? 'owner' : 'opponent', P = tok.params ?? {};
  const out = [];
  const pousse = (plan, pourquoi) => { if (plan) out.push({ plan, pourquoi, role }); };
  switch (tok.name) {
    case 'PION_PASSE': {
      const pion = P.pion; if (!pion) break;
      if (role === 'owner') {
        pousse({ famille: 'poussee', pion: pion[0], cible: caseRel(pion[0], 8, owner) }, 'un pion passé doit avancer : chaque pas rapproche la dame et fixe une pièce adverse');
        pousse(plusProche(fen, side, 'r', caseDerriere(pion, owner), L), 'la tour derrière le pion passé : elle gagne en force à chaque pas du pion (règle de Tarrasch)');
      } else {
        pousse(plusProche(fen, side, 'n', caseDevant(pion, owner), L), 'le blocus : le cavalier bloque sans perdre ses cases, c\'est le meilleur bloqueur');
        pousse(plusProche(fen, side, 'r', caseDerriere(pion, owner), L), 'la tour derrière le pion passé, même adverse : de là, elle le suit jusqu\'au bout');
      }
      break;
    }
    case 'ROI_AU_CENTRE': {
      if (role === 'owner') {
        pousse({ famille: 'colonne', colonne: P.colonne ?? 'e' }, 'une tour en face du roi qui n\'a pas roqué : il ne pourra plus roquer, ni rester');
        if (P.levier) pousse({ famille: 'rupture', pion: P.levier, cible: caseRel(P.levier, 5, owner) }, 'ouvrir le centre pendant que son roi y est encore ; seulement après le roque');
      } else {
        const k = L.roi[side]; if (k) pousse({ famille: 'transfert', de: k, vers: caseRel('g', 1, side) }, 'mettre le roi à l\'abri d\'abord : tant qu\'il est au centre, chaque colonne qui s\'ouvre est pour l\'adversaire');
      }
      break;
    }
    case 'MAJORITE': {
      const cand = P.candidat; if (!cand) break;
      if (role === 'owner') {
        pousse({ famille: 'poussee', pion: cand[0], cible: caseRel(cand[0], 5, owner) }, 'le candidat avance en premier, les autres le soutiennent : c\'est ainsi qu\'une majorité fait un pion passé');
        if (estFinale(L)) pousse(plusProche(fen, side, 'k', caseRel(P.aile === 'dame' ? 'd' : 'e', 3, owner), L), 'en finale, le roi soutient la majorité ; deux contre un ne s\'arrête pas sans lui');
      } else pousse(plusProche(fen, side, 'n', caseDevant(cand, owner), L), 'bloquer le candidat, et la majorité ne peut plus rien produire');
      break;
    }
    case 'UNE_COLONNE_OUVERTE': {
      const f = P.colonne; if (!f) break;
      pousse({ famille: 'colonne', colonne: f }, 'la seule colonne ouverte appartient à qui l\'occupe en premier : y doubler les tours');
      pousse(plusProche(fen, side, 'r', caseRel(f, 7, side), L), 'le but de la colonne : la septième rangée, d\'où la tour attaque les pions restés chez eux');
      break;
    }
    case 'FINALE': {
      const k = L.roi[side]; if (!k) break;
      const vers = ['e4', 'd4', 'e5', 'd5'].sort((a, b) => (Math.abs(FILES.indexOf(a[0]) - FILES.indexOf(k[0])) + Math.abs(Number(a[1]) - Number(k[1]))) - (Math.abs(FILES.indexOf(b[0]) - FILES.indexOf(k[0])) + Math.abs(Number(b[1]) - Number(k[1]))))[0];
      pousse({ famille: 'transfert', de: k, vers }, 'en finale, le roi est une pièce forte : au centre, il touche les deux ailes');
      break;
    }
    case 'RUBINSTEIN': {
      if (role === 'owner') {
        pousse(plusProche(fen, side, 'n', caseRel('e', 5, owner), L), 'l\'avant-poste que d4 garantit, d\'où le cavalier gêne tout le jeu adverse');
        pousse({ famille: 'poussee', pion: 'c', cible: caseRel('c', 4, owner) }, 'de l\'espace à l\'aile dame, et la case d5 enlevée aux pièces adverses');
      } else {
        pousse({ famille: 'rupture', pion: 'c', cible: caseRel('c', 5, side) }, 'la libération : attaquer d4');
        pousse({ famille: 'rupture', pion: 'e', cible: caseRel('e', 5, side) }, 'l\'autre libération ; elle demande une préparation');
      }
      break;
    }
    case 'CENTRE_OUVERT': {
      pousse({ famille: 'colonne', colonne: 'd' }, 'les colonnes centrales sont les routes du jeu : les tours y vont avant les pions');
      pousse({ famille: 'colonne', colonne: 'e' }, 'idem ; celle des deux qui est en face du roi adverse d\'abord');
      break;
    }
    default: break;
  }
  return out;
}

export const NOUVELLES_STRUCTURES = new Set(['PION_PASSE', 'ROI_AU_CENTRE', 'MAJORITE', 'UNE_COLONNE_OUVERTE', 'FINALE', 'RUBINSTEIN', 'CENTRE_OUVERT']);
