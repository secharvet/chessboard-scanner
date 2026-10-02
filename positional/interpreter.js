/**
 * Interpréteur positionnel — classification pondérée + rédaction en français.
 *
 * Hiérarchie :
 *   10 — Critique (matériel, sécurité roi)
 *   8  — Haute (pions passés, faiblesses structure)
 *   6  — Moyenne (avant-postes, colonnes + tours, espace)
 *   4  — Info (développement, structure pions, pièces mineures)
 *   2  — Neutre (confort, roque effectué)
 */

import { STRUCTURES } from './structures.js';
import { factLang, tr } from './lang.js';

/** @typedef {import('./tokens.js').PositionalToken} PosToken */
/** @typedef {{ weight: number, label: string }} Priority */

/** @type {Record<string, Priority>} */
const PRIORITY = {
  // ── Critique (10) ──
  AVANTAGE_MATERIEL: { weight: 10, label: 'CRITIQUE' },
  ROI_AU_CENTRE:     { weight: 10, label: 'CRITIQUE' },
  PIONS_ROI_AFFAIBLI:{ weight: 10, label: 'CRITIQUE' },

  // ── Haute (8) ──
  PION_PASSE:        { weight: 8, label: 'HAUTE' },
  PION_PASSE_PROTEGE:{ weight: 8, label: 'HAUTE' },
  PION_ISOLE:        { weight: 8, label: 'HAUTE' },
  PION_ARRIERE:      { weight: 8, label: 'HAUTE' },
  PION_FAIBLE:       { weight: 8, label: 'HAUTE' },

  // ── Moyenne (6) ──
  AVANT_POSTE:             { weight: 6, label: 'MOYENNE' },
  CAVALIER_AVANT_POSTE:    { weight: 6, label: 'MOYENNE' },
  COLONNE_OUVERTE:         { weight: 6, label: 'MOYENNE' },
  COLONNE_SEMI_OUVERTE:    { weight: 6, label: 'MOYENNE' },
  TOUR_COLONNE_OUVERTE:    { weight: 6, label: 'MOYENNE' },
  AVANTAGE_ESPACE:         { weight: 6, label: 'MOYENNE' },
  CASE_FAIBLE:             { weight: 6, label: 'MOYENNE' },

  // ── Info (4) ──
  PIECE_NON_DEVELOPPEE: { weight: 4, label: 'INFO' },
  DAME_SORTIE_TOT:      { weight: 4, label: 'INFO' },
  NOMBRE_ILOTS_BLANC:   { weight: 4, label: 'INFO' },
  NOMBRE_ILOTS_NOIR:    { weight: 4, label: 'INFO' },
  MAJORITE_AILE_DAME:   { weight: 4, label: 'INFO' },
  MAJORITE_AILE_ROI:    { weight: 4, label: 'INFO' },
  DOUBLON:              { weight: 4, label: 'INFO' },
  CHAINE_PIONS:         { weight: 4, label: 'INFO' },
  PION_ARRIERE_DOUBLE:  { weight: 4, label: 'INFO' },
  PAIRE_FOUS:           { weight: 4, label: 'INFO' },
  FOU_BON:              { weight: 4, label: 'INFO' },
  FOU_MAUVAIS:          { weight: 4, label: 'INFO' },

  // ── Neutre (2) ──
  EGALITE_MATERIEL:    { weight: 2, label: 'NEUTRE' },

  // ── Structures (6) ──
  STRUCTURE:           { weight: 6, label: 'MOYENNE' },
  ROQUES_OPPOSES:      { weight: 6, label: 'MOYENNE' },

  // ── Contexte (1) ──
  PHASE:               { weight: 1, label: 'CONTEXTE' },
  ROQUE_PETIT:         { weight: 2, label: 'NEUTRE' },
  ROQUE_GRAND:         { weight: 2, label: 'NEUTRE' },
  PIONS_ROI_BOUCLIER:  { weight: 2, label: 'NEUTRE' },

  // ── Module 6 — Tactique (8-10) ──
  PIECE_MENACEE:       { weight: 8, label: 'HAUTE' },
  CLOUAGE:             { weight: 8, label: 'HAUTE' },
  CLOUAGE_RELATIF:     { weight: 7, label: 'HAUTE' },
  FOURCHETTE:          { weight: 8, label: 'HAUTE' },
  ENFILADE:            { weight: 8, label: 'HAUTE' },
  DECOUVERTE_POSSIBLE: { weight: 7, label: 'HAUTE' },
  SURCHARGE:           { weight: 7, label: 'HAUTE' },
  PIECE_PIEGEE:        { weight: 9, label: 'HAUTE' },
  RANGEE_FAIBLE:       { weight: 6, label: 'MOYENNE' },

  // ── Déséquilibres (4-7) ──
  COMPLEXE_FAIBLE:     { weight: 7, label: 'HAUTE' },
  CONTROLE_COLONNE:    { weight: 6, label: 'MOYENNE' },
  CASE_ENTREE:         { weight: 5, label: 'MOYENNE' },
  TOUR_7E:             { weight: 7, label: 'HAUTE' },
  ACTIVITE:            { weight: 6, label: 'MOYENNE' },
  PIECE_PASSIVE:       { weight: 5, label: 'MOYENNE' },
  CONTROLE_CENTRE:     { weight: 5, label: 'MOYENNE' },
  CENTRE:              { weight: 5, label: 'MOYENNE' },
  FOU_CONTRE_CAVALIER: { weight: 5, label: 'MOYENNE' },
  DEVELOPPEMENT:       { weight: 6, label: 'MOYENNE' },
};

// ── Rédaction ──

/** Nom des pièces (masculin, pour « cavalier noir cloué »). */
const PIECE_FR = { p: 'Pion', n: 'Cavalier', b: 'Fou', r: 'Tour', q: 'Dame', k: 'Roi' };

/**
 * « le fou blanc en d3 », « la tour noire en a8 » — ou « la pièce en d3 » si le type est inconnu.
 * @param {string | undefined} type @param {string} color @param {string} square
 */
export function namedPiece(type, color, square) {
  return factLang() === 'en' ? namedPieceEn(type, color, square) : namedPieceFr(type, color, square);
}

/** @param {string | undefined} type @param {string} color @param {string} square */
function namedPieceFr(type, color, square) {
  if (!type || !PIECE_FR[type]) return `la pièce en ${square}`;
  const fem = type === 'q' || type === 'r';
  const col = color === 'w' ? (fem ? 'blanche' : 'blanc') : (fem ? 'noire' : 'noir');
  return `${fem ? 'la' : 'le'} ${PIECE_FR[type].toLowerCase()} ${col} en ${square}`;
}

/** Cibles d'une fourchette : « la tour noire en d1 et la dame noire en h1 ». */
function namedTargets(p, victimColor) {
  const sqs = String(p.targets ?? '').split(',').filter(Boolean);
  const types = String(p.targetTypes ?? '').split(',');
  if (!sqs.length) return 'deux cibles';
  const names = sqs.map((s, i) => namedPieceFr(types[i], victimColor, s));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} et ${names.at(-1)}` : names[0];
}

/** @param {string} c */
function colorLabel(c) {
  return c === 'w' ? 'blancs' : 'noirs';
}

/** @param {string} c */
function colorCap(c) {
  return c === 'w' ? 'Blancs' : 'Noirs';
}

/** @param {PosToken} t */
function renderTokenFr(t) {
  const p = t.params;

  switch (t.id) {
    case 'AVANTAGE_MATERIEL':
      return `Avantage matériel ${colorLabel(/** @type {string} */ (p.color))} (+${p.score}).`;

    case 'EGALITE_MATERIEL':
      return `Matériel égal.`;

    case 'ROI_AU_CENTRE':
      return p.canCastle === false
        ? `Roi ${colorLabel(/** @type {string} */ (p.color))} au centre et privé de roque : il faut l'abriter autrement.`
        : `Roi ${colorLabel(/** @type {string} */ (p.color))} encore au centre — roquer est prioritaire.`;

    case 'PIONS_ROI_AFFAIBLI':
      return `Bouclier de pions affaibli devant le roi ${colorLabel(/** @type {string} */ (p.color))}${p.files ? ` (colonne ${p.files} sans pion protecteur)` : ''}.`;

    case 'STRUCTURE':
      return `Structure : ${STRUCTURES[/** @type {string} */ (p.name)]?.label ?? p.name} (${colorLabel(/** @type {string} */ (p.color))}).`;

    case 'ROQUES_OPPOSES':
      return p.white
        ? `Roques opposés : roi blanc à l'aile ${p.white}, roi noir à l'aile ${p.black}. Chaque camp attaque du côté du roi adverse : les Blancs à l'aile ${p.black}, les Noirs à l'aile ${p.white}.`
        : `Roques opposés.`;

    case 'CLOUAGE_RELATIF':
      return `Clouage relatif : ${namedPieceFr(/** @type {string} */ (p.type), /** @type {string} */ (p.color), /** @type {string} */ (p.square))} est cloué par ${namedPieceFr(/** @type {string} */ (p.byType), p.color === 'w' ? 'b' : 'w', /** @type {string} */ (p.by))} : s'il bouge, ${namedPieceFr(/** @type {string} */ (p.behindType), /** @type {string} */ (p.color), /** @type {string} */ (p.behind))}, plus chère, est prise.`;

    case 'ENFILADE':
      {
        const opp = p.color === 'w' ? 'b' : 'w';
        return `Enfilade pour les ${colorLabel(/** @type {string} */ (p.color))} : ${namedPieceFr(/** @type {string} */ (p.type), /** @type {string} */ (p.color), /** @type {string} */ (p.square))} attaque ${namedPieceFr(/** @type {string} */ (p.frontType), opp, /** @type {string} */ (p.front))}, qui en bougeant découvrira ${namedPieceFr(/** @type {string} */ (p.backType), opp, /** @type {string} */ (p.back))}.`;
      }

    case 'DECOUVERTE_POSSIBLE':
      return `${p.check ? 'Échec à la découverte possible' : 'Attaque à la découverte possible'} pour les ${colorLabel(/** @type {string} */ (p.color))} : déplacer ${namedPieceFr(/** @type {string} */ (p.moverType), /** @type {string} */ (p.color), /** @type {string} */ (p.mover))} démasque ${namedPieceFr(/** @type {string} */ (p.sliderType), /** @type {string} */ (p.color), /** @type {string} */ (p.slider))} sur ${namedPieceFr(/** @type {string} */ (p.targetType), p.color === 'w' ? 'b' : 'w', /** @type {string} */ (p.target))}.`;

    case 'SURCHARGE':
      return `Pièce surchargée ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (${p.type}) : seule à défendre ${p.defends}.`;

    case 'PIECE_PIEGEE':
      return `Pièce ${colorLabel(/** @type {string} */ (p.color))} piégée en ${p.square} (${p.type}) : menacée et sans case de fuite sûre.`;

    case 'RANGEE_FAIBLE':
      return `Dernière rangée faible chez les ${colorLabel(/** @type {string} */ (p.color))} : le roi en ${p.king} n'a pas de case de fuite${p.guarded ? ' (une seule pièce lourde garde la rangée)' : ''}.`;

    case 'COMPLEXE_FAIBLE':
      return `Complexe de cases ${p.shade} affaibli chez les ${colorLabel(/** @type {string} */ (p.color))} (${p.squares}) : plus de fou de cette couleur pour les défendre${p.enemyBishop ? ", et l'adversaire a encore le sien" : ''}.`;

    case 'CONTROLE_COLONNE':
      return `Les ${colorLabel(/** @type {string} */ (p.color))} contrôlent la colonne ${p.file}${p.doubled ? ' (pièces lourdes doublées)' : ''}.`;

    case 'CASE_ENTREE':
      return `Case d'entrée pour les ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (colonne ${p.file}).`;

    case 'TOUR_7E':
      return `${p.type === 'q' ? 'Dame' : 'Tour'} ${colorLabel(/** @type {string} */ (p.color))} en 7e rangée (${p.square}).`;

    case 'ACTIVITE':
      return `Pièces ${colorLabel(/** @type {string} */ (p.color))} nettement plus actives (mobilité ${p.mine} contre ${p.theirs}).`;

    case 'PIECE_PASSIVE':
      return `Pièce ${colorLabel(/** @type {string} */ (p.color))} passive en ${p.square} (${p.type}) : presque aucune case.`;

    case 'CONTROLE_CENTRE':
      return `Les ${colorLabel(/** @type {string} */ (p.color))} contrôlent mieux le centre (d4, d5, e4, e5).`;

    case 'CENTRE':
      return `Centre ${p.type}.`;

    case 'FOU_CONTRE_CAVALIER':
      return `Fou contre cavalier : fou aux ${colorLabel(/** @type {string} */ (p.bishop))}, cavalier aux ${colorLabel(/** @type {string} */ (p.knight))}.`;

    case 'DEVELOPPEMENT':
      return `Avance de développement des ${colorLabel(/** @type {string} */ (p.color))} (${p.lead} pièce(s) de plus en jeu).`;

    case 'PHASE':
      return `Phase de jeu : ${p.phase}.`;

    case 'PION_PASSE':
      return `Pion passé ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_PASSE_PROTEGE':
      return `Pion passé protégé ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_ISOLE':
      return `Pion isolé ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_ARRIERE':
      return `Pion arriéré ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PION_FAIBLE':
      return `Pion faible (isolé et arriéré) ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'AVANT_POSTE':
      return `Avant-poste pour les ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'AVANT_POSTE_POSSIBLE':
      return `Avant-poste possible pour les ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (un pion peut encore venir le soutenir).`;

    case 'CAVALIER_AVANT_POSTE':
      return `Cavalier ${colorLabel(/** @type {string} */ (p.color))} sur avant-poste en ${p.square}.`;

    case 'COLONNE_OUVERTE':
      return `Colonne ${p.file} ouverte.`;

    case 'COLONNE_SEMI_OUVERTE':
      return `Colonne ${p.file} semi-ouverte pour les ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'TOUR_COLONNE_OUVERTE':
      return `Tour ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} sur colonne ouverte/semi-ouverte.`;

    case 'AVANTAGE_ESPACE':
      return `Avantage d'espace pour les ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'CASE_FAIBLE':
      return `Case faible ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'PIECE_NON_DEVELOPPEE':
      return `Pièce non développée ${colorLabel(/** @type {string} */ (p.color))} en ${p.square} (${p.type}).`;

    case 'DAME_SORTIE_TOT':
      return `Dame ${colorLabel(/** @type {string} */ (p.color))} sortie trop tôt, pièces mineures encore au départ.`;

    case 'NOMBRE_ILOTS_BLANC':
      return `Ilots blancs : ${p.count}.`;

    case 'NOMBRE_ILOTS_NOIR':
      return `Ilots noirs : ${p.count}.`;

    case 'MAJORITE_AILE_DAME':
      return `Majorité ${colorLabel(/** @type {string} */ (p.color))} à l'aile dame.`;

    case 'MAJORITE_AILE_ROI':
      return `Majorité ${colorLabel(/** @type {string} */ (p.color))} à l'aile roi.`;

    case 'DOUBLON':
      return `Doublon ${colorLabel(/** @type {string} */ (p.color))} en colonne ${p.file}.`;

    case 'CHAINE_PIONS':
      return `Chaîne de pions ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'PION_ARRIERE_DOUBLE':
      return `Deux pions arriérés côte à côte chez les ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'PAIRE_FOUS':
      return `Paire de fous ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'FOU_BON':
      return `Bon fou ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'FOU_MAUVAIS':
      return `Mauvais fou ${colorLabel(/** @type {string} */ (p.color))} en ${p.square}.`;

    case 'ROQUE_PETIT':
      return `Petit roque ${colorLabel(/** @type {string} */ (p.color))} effectué.`;

    case 'ROQUE_GRAND':
      return `Grand roque ${colorLabel(/** @type {string} */ (p.color))} effectué.`;

    case 'PIONS_ROI_BOUCLIER':
      return `Bouclier de pions intact devant le roi ${colorLabel(/** @type {string} */ (p.color))}.`;

    case 'PIECE_MENACEE': {
      // Nommer la pièce (« ta dame en b6 », pas « ta pièce ») : c'est ce qui parle à un débutant.
      const name = PIECE_FR[/** @type {string} */ (p.type)] ?? 'Pièce';
      const fem = p.type === 'q' || p.type === 'r';
      const col = p.color === 'w' ? (fem ? 'blanche' : 'blanc') : (fem ? 'noire' : 'noir');
      return `${name} ${col} en prise en ${p.square} (${p.defended === false ? `non ${fem ? 'défendue' : 'défendu'}` : `${fem ? 'attaquée' : 'attaqué'} par une pièce de moindre valeur`}).`;
    }

    case 'CLOUAGE': {
      // Sans ambiguïté : QUI est cloué, et PAR QUI (« clouage noirs » se lisait « clouage des Noirs »).
      const pinned = /** @type {string} */ (p.color);
      const by = p.by ? ` par ${namedPieceFr(/** @type {string} */ (p.byType), pinned === 'w' ? 'b' : 'w', /** @type {string} */ (p.by))}` : '';
      return `${PIECE_FR[/** @type {string} */ (p.type)] ?? 'Pièce'} ${pinned === 'w' ? 'blanc' : 'noir'} en ${p.square} cloué contre son roi${by} (il ne peut pas bouger).`;
    }

    case 'FOURCHETTE':
      return `Fourchette ${colorLabel(/** @type {string} */ (p.color))} : ${namedPieceFr(/** @type {string} */ (p.type), /** @type {string} */ (p.color), /** @type {string} */ (p.square))} attaque en même temps ${namedTargets(p, p.color === 'w' ? 'b' : 'w')}.`;

    default:
      return `${t.id}: ${JSON.stringify(p)}`;
  }
}

// ── Rédaction anglaise (COACH_LANG=en) ──

/** Nom anglais des pièces (minuscules). */
const PIECE_EN = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

/** Paramètres codés en français → anglais (phase, nuance de cases, type de centre, aile). */
const PARAM_EN = {
  ouverture: 'opening', milieu: 'middlegame', finale: 'endgame',
  claires: 'light', noires: 'dark',
  fermé: 'closed', ouvert: 'open',
  roi: 'kingside', dame: 'queenside',
};

/** Libellés de priorité (titres de `interpretFacts`). */
const PRIORITY_LABEL_EN = {
  CRITIQUE: 'CRITICAL', HAUTE: 'HIGH', MOYENNE: 'MEDIUM', INFO: 'INFO',
  NEUTRE: 'NEUTRAL', CONTEXTE: 'CONTEXT', INCONNU: 'UNKNOWN',
};

/** @param {unknown} v */
const paramEn = (v) => PARAM_EN[/** @type {string} */ (v)] ?? String(v);

/** @param {string} s */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** « the white bishop on d3 », ou « the piece on d3 » si le type est inconnu. */
function namedPieceEn(type, color, square) {
  if (!type || !PIECE_EN[type]) return `the piece on ${square}`;
  return `the ${color === 'w' ? 'white' : 'black'} ${PIECE_EN[type]} on ${square}`;
}

/** « white knight » / « black piece » (sans article). */
function pieceEn(type, color) {
  return `${color === 'w' ? 'white' : 'black'} ${PIECE_EN[type] ?? 'piece'}`;
}

/** Camp : « White » / « Black ». */
function sideEn(c) {
  return c === 'w' ? 'White' : 'Black';
}

/** « a, b and c » à partir d'une liste. */
function listEn(items) {
  return items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : (items[0] ?? '');
}

/** Cibles d'une fourchette : « the black rook on d1 and the black queen on h1 ». */
function namedTargetsEn(p, victimColor) {
  const sqs = String(p.targets ?? '').split(',').filter(Boolean);
  const types = String(p.targetTypes ?? '').split(',');
  if (!sqs.length) return 'two targets';
  return listEn(sqs.map((s, i) => namedPieceEn(types[i], victimColor, s)));
}

/** @param {PosToken} t */
export function renderToken(t) {
  return factLang() === 'en' ? renderTokenEn(t) : renderTokenFr(t);
}

/** @param {PosToken} t */
function renderTokenEn(t) {
  const p = /** @type {Record<string, any>} */ (t.params);
  const side = sideEn(p.color);
  const opp = p.color === 'w' ? 'b' : 'w';

  switch (t.id) {
    case 'AVANTAGE_MATERIEL':
      return `Material advantage for ${side} (+${p.score}).`;

    case 'EGALITE_MATERIEL':
      return `Material is equal.`;

    case 'ROI_AU_CENTRE':
      return p.canCastle === false
        ? `The ${side.toLowerCase()} king is in the center and can no longer castle: it must find shelter another way.`
        : `The ${side.toLowerCase()} king is still in the center: castling is a priority.`;

    case 'PIONS_ROI_AFFAIBLI': {
      const files = String(p.files ?? '').split(',').filter(Boolean);
      const detail = !files.length ? ''
        : files.length === 1 ? ` (no protecting pawn on the ${files[0]}-file)`
          : ` (no protecting pawn on the ${listEn(files)} files)`;
      return `Weakened pawn shield in front of the ${side.toLowerCase()} king${detail}.`;
    }

    case 'STRUCTURE':
      return `Structure: ${STRUCTURES[p.name]?.label ?? p.name} (${side}).`;

    case 'ROQUES_OPPOSES':
      return p.white
        ? `Opposite-side castling: white king on the ${paramEn(p.white)}, black king on the ${paramEn(p.black)}. Each side attacks toward the enemy king: White on the ${paramEn(p.black)}, Black on the ${paramEn(p.white)}.`
        : `Opposite-side castling.`;

    case 'CLOUAGE_RELATIF':
      return `Relative pin: ${namedPieceEn(p.type, p.color, p.square)} is pinned by ${namedPieceEn(p.byType, opp, p.by)}: if it moves, ${namedPieceEn(p.behindType, p.color, p.behind)}, worth more, is taken.`;

    case 'ENFILADE':
      return `Skewer for ${side}: ${namedPieceEn(p.type, p.color, p.square)} attacks ${namedPieceEn(p.frontType, opp, p.front)}, which, when it moves, will expose ${namedPieceEn(p.backType, opp, p.back)}.`;

    case 'DECOUVERTE_POSSIBLE':
      return `${p.check ? 'Discovered check' : 'Discovered attack'} available for ${side}: moving ${namedPieceEn(p.moverType, p.color, p.mover)} unmasks ${namedPieceEn(p.sliderType, p.color, p.slider)} against ${namedPieceEn(p.targetType, opp, p.target)}.`;

    case 'SURCHARGE':
      return `Overloaded ${pieceEn(p.type, p.color)} on ${p.square}: it is the only defender of ${listEn(String(p.defends ?? '').split(',').filter(Boolean))}.`;

    case 'PIECE_PIEGEE':
      return `Trapped ${pieceEn(p.type, p.color)} on ${p.square}: attacked and with no safe escape square.`;

    case 'RANGEE_FAIBLE':
      return `Weak back rank for ${side}: the king on ${p.king} has no escape square${p.guarded ? ' (only one heavy piece guards the rank)' : ''}.`;

    case 'COMPLEXE_FAIBLE':
      return `Weakened ${paramEn(p.shade)}-square complex for ${side} (${p.squares}): no bishop of that color left to defend it${p.enemyBishop ? ', while the opponent still has theirs' : ''}.`;

    case 'CONTROLE_COLONNE':
      return `${side} controls the ${p.file}-file${p.doubled ? ' (heavy pieces doubled)' : ''}.`;

    case 'CASE_ENTREE':
      return `Entry square for ${side} on ${p.square} (${p.file}-file).`;

    case 'TOUR_7E':
      return `${side} ${p.type === 'q' ? 'queen' : 'rook'} on the 7th rank (${p.square}).`;

    case 'ACTIVITE':
      return `${side}'s pieces are clearly more active (mobility ${p.mine} vs ${p.theirs}).`;

    case 'PIECE_PASSIVE':
      return `Passive ${pieceEn(p.type, p.color)} on ${p.square}: it has almost no squares.`;

    case 'CONTROLE_CENTRE':
      return `${side} controls the center better (d4, d5, e4, e5).`;

    case 'CENTRE':
      return `${cap(paramEn(p.type))} center.`;

    case 'FOU_CONTRE_CAVALIER':
      return `Bishop vs knight: ${sideEn(p.bishop)} has the bishop, ${sideEn(p.knight)} has the knight.`;

    case 'DEVELOPPEMENT':
      return `${side} leads in development (${p.lead} more ${Number(p.lead) === 1 ? 'piece' : 'pieces'} in play).`;

    case 'PHASE':
      return `Game phase: ${paramEn(p.phase)}.`;

    case 'PION_PASSE':
      return `${side} passed pawn on ${p.square}.`;

    case 'PION_PASSE_PROTEGE':
      return `${side} protected passed pawn on ${p.square}.`;

    case 'PION_ISOLE':
      return `${side} isolated pawn on ${p.square}.`;

    case 'PION_ARRIERE':
      return `${side} backward pawn on ${p.square}.`;

    case 'PION_FAIBLE':
      return `${side} weak pawn (isolated and backward) on ${p.square}.`;

    case 'AVANT_POSTE':
      return `Outpost for ${side} on ${p.square}.`;

    case 'AVANT_POSTE_POSSIBLE':
      return `Possible outpost for ${p.color === 'w' ? 'White' : 'Black'} on ${p.square} (a pawn can still come to support it).`;

    case 'CAVALIER_AVANT_POSTE':
      return `${side} knight on an outpost on ${p.square}.`;

    case 'COLONNE_OUVERTE':
      return `Open ${p.file}-file.`;

    case 'COLONNE_SEMI_OUVERTE':
      return `Half-open ${p.file}-file for ${side}.`;

    case 'TOUR_COLONNE_OUVERTE':
      return `${side} rook on ${p.square} on an open/half-open file.`;

    case 'AVANTAGE_ESPACE':
      return `Space advantage for ${side}.`;

    case 'CASE_FAIBLE':
      return `Weak square (hole) in ${side}'s camp on ${p.square}.`;

    case 'PIECE_NON_DEVELOPPEE':
      return `Undeveloped ${pieceEn(p.type, p.color)} on ${p.square}.`;

    case 'DAME_SORTIE_TOT':
      return `${side} queen developed too early, minor pieces still on their starting squares.`;

    case 'NOMBRE_ILOTS_BLANC':
      return `White pawn islands: ${p.count}.`;

    case 'NOMBRE_ILOTS_NOIR':
      return `Black pawn islands: ${p.count}.`;

    case 'MAJORITE_AILE_DAME':
      return `${side} queenside pawn majority.`;

    case 'MAJORITE_AILE_ROI':
      return `${side} kingside pawn majority.`;

    case 'DOUBLON':
      return `${side} doubled pawns on the ${p.file}-file.`;

    case 'CHAINE_PIONS':
      return `${side} pawn chain.`;

    case 'PION_ARRIERE_DOUBLE':
      return `Two adjacent backward pawns for ${side}.`;

    case 'PAIRE_FOUS':
      return `${side} has the bishop pair.`;

    case 'FOU_BON':
      return `${side} good bishop on ${p.square}.`;

    case 'FOU_MAUVAIS':
      return `${side} bad bishop on ${p.square}.`;

    case 'ROQUE_PETIT':
      return `${side} has castled kingside.`;

    case 'ROQUE_GRAND':
      return `${side} has castled queenside.`;

    case 'PIONS_ROI_BOUCLIER':
      return `Pawn shield intact in front of the ${side.toLowerCase()} king.`;

    case 'PIECE_MENACEE':
      return `${cap(pieceEn(p.type, p.color))} hanging on ${p.square} (${p.defended === false ? 'undefended' : 'attacked by a lower-value piece'}).`;

    case 'CLOUAGE': {
      const by = p.by ? ` by ${namedPieceEn(p.byType, opp, p.by)}` : '';
      return `${cap(pieceEn(p.type, p.color))} on ${p.square} pinned to its king${by} (it cannot move).`;
    }

    case 'FOURCHETTE':
      return `Fork by ${side}: ${namedPieceEn(p.type, p.color, p.square)} attacks ${namedTargetsEn(p, opp)} at the same time.`;

    default:
      return `${t.id}: ${JSON.stringify(p)}`;
  }
}

// ── API publique ──

/** @param {PosToken} t */
export function tokenWeight(t) {
  return PRIORITY[t.id]?.weight ?? 0;
}

/**
 * Interprétation complète — utilisée par l'affichage positionnel.
 * @param {PosToken[]} facts
 * @returns {string}
 */
export function interpretFacts(facts) {
  if (!facts.length) return tr('Aucun fait positionnel détecté.', 'No positional facts detected.');

  // Grouper par poids décroissant
  const groups = new Map();
  for (const f of facts) {
    const prio = PRIORITY[f.id] ?? { weight: 0, label: 'INCONNU' };
    const list = groups.get(prio.weight) || [];
    list.push(f);
    groups.set(prio.weight, list);
  }

  const sortedWeights = [...groups.keys()].sort((a, b) => b - a);
  const lines = [];

  for (const weight of sortedWeights) {
    const group = groups.get(weight) || [];
    const dedup = new Set();
    const uniqueTokens = [];
    for (const f of group) {
      const text = renderToken(f);
      if (!dedup.has(text)) {
        dedup.add(text);
        uniqueTokens.push(f);
      }
    }
    const label = PRIORITY[uniqueTokens[0]?.id]?.label ?? 'INCONNU';
    const shown = tr(label, PRIORITY_LABEL_EN[label] ?? label);
    const prefix = weight >= 8 ? '##' : weight >= 6 ? '###' : '-';
    lines.push(`\n${prefix} ${shown}`);
    for (const f of uniqueTokens) {
      lines.push(`  ${renderToken(f)}`);
    }
  }

  return lines.join('\n').trim();
}

/**
 * Conseil rapide (3 faits prioritaires) — utilisé par buildConseil.
 * @param {PosToken[]} facts
 * @param {number} [topN=3]
 * @returns {string | null}
 */
export function topAdvice(facts, topN = 3) {
  if (!facts.length) return null;

  const sorted = [...facts].sort(
    (a, b) => (PRIORITY[b.id]?.weight ?? 0) - (PRIORITY[a.id]?.weight ?? 0),
  );

  const seen = new Set();
  const top = [];
  for (const f of sorted) {
    const text = renderToken(f);
    if (!seen.has(text)) {
      seen.add(text);
      top.push(text);
      if (top.length >= topN) break;
    }
  }

  return top.join(' ');
}
