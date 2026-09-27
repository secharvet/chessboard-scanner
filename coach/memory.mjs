/**
 * Mémoire d'expérience du joueur LLM : un carnet de leçons tirées de ses erreurs,
 * retrouvées par SITUATION SIMILAIRE (signature calculée par le code), jamais par position exacte.
 *
 * Signature d'une leçon :
 *   situation   phase, structure, sécurité des rois, déséquilibres présents
 *   coup        type du coup fautif (échec, prise, sortie de dame, poussée de pion devant le roi…)
 *   punition    motif de la réfutation (fourchette, découverte, clouage, coup intermédiaire…)
 *
 * Stockage : memory/lessons.json (lisible et modifiable à la main).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Chess } from 'chess.js';
import { buildAllFacts, detectPhase } from '../positional/index.js';
import { lineMotifs } from './motifs.mjs';
import { scanTactics } from './threats.mjs';

export const MEMORY_PATH = process.env.COACH_MEMORY
  ?? fileURLToPath(new URL('../memory/lessons.json', import.meta.url));

// ── Signatures ──

/** Tags de situation, du point de vue de `side`. */
export function situationTags(fen, side) {
  const tags = new Set([`phase:${detectPhase(fen)}`]);
  const who = (c) => (c === side ? 'moi' : 'adv');
  for (const f of buildAllFacts(fen)) {
    const p = f.params;
    switch (f.id) {
      case 'STRUCTURE': tags.add(`structure:${p.name}:${who(p.color)}`); break;
      case 'ROQUES_OPPOSES': tags.add('roques_opposes'); break;
      case 'CENTRE': tags.add(`centre:${p.type}`); break;
      case 'ROI_AU_CENTRE': tags.add(`roi_au_centre:${who(p.color)}`); break;
      case 'PIONS_ROI_AFFAIBLI': tags.add(`bouclier_affaibli:${who(p.color)}`); break;
      case 'RANGEE_FAIBLE': tags.add(`rangee_faible:${who(p.color)}`); break;
      case 'COMPLEXE_FAIBLE': tags.add(`complexe_faible:${who(p.color)}`); break;
      case 'DEVELOPPEMENT': tags.add(`avance_developpement:${who(p.color)}`); break;
      case 'PIECE_MENACEE': tags.add(`piece_en_prise:${who(p.color)}`); break;
      case 'CLOUAGE': case 'CLOUAGE_RELATIF': tags.add(`clouage_subi:${who(p.color)}`); break;
      case 'DECOUVERTE_POSSIBLE': tags.add(`decouverte_possible:${who(p.color)}`); break;
      case 'SURCHARGE': tags.add(`surcharge:${who(p.color)}`); break;
      case 'DAME_SORTIE_TOT': tags.add(`dame_sortie_tot:${who(p.color)}`); break;
      case 'PAIRE_FOUS': tags.add(`paire_fous:${who(p.color)}`); break;
      case 'FOU_CONTRE_CAVALIER': tags.add('fou_contre_cavalier'); break;
      case 'COLONNE_OUVERTE': tags.add('colonne_ouverte'); break;
      default: break;
    }
  }
  // Menaces en cours (ce que chaque camp gagnerait s'il jouait maintenant).
  for (const [c, who] of [[side === 'w' ? 'b' : 'w', 'adv'], [side, 'moi']]) {
    for (const t of scanTactics(fen, c, 4)) {
      if (t.severity >= 100) tags.add(`menace_mat:${who}`);
      else if (t.severity >= 10) tags.add(`menace_gain:${who}`);
      else if (/fourchette/.test(t.text)) tags.add(`menace_fourchette:${who}`);
      else if (/découverte/.test(t.text)) tags.add(`menace_decouverte:${who}`);
    }
  }
  return [...tags];
}

const PIECE = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };

/** Tags décrivant le coup joué (pas les cases : le TYPE de coup). */
export function moveTags(fen, san) {
  const c = new Chess(fen);
  let m;
  try { m = c.move(san); } catch { return []; }
  const side = m.color;
  const tags = new Set([`piece:${PIECE[m.piece]}`]);
  if (/[+#]/.test(m.san)) tags.add('echec');
  if (m.captured) tags.add(m.captured === m.piece ? 'echange' : 'prise');
  if (m.san.startsWith('O-O')) tags.add('roque');
  const up = side === 'w' ? 1 : -1;
  const dr = (Number(m.to[1]) - Number(m.from[1])) * up;
  if (m.piece !== 'p' && dr < 0) tags.add('retrait');
  if (m.piece !== 'p' && dr > 0) tags.add('avancee');
  if (m.piece === 'q' && detectPhase(fen) === 'ouverture') tags.add('sortie_dame_ouverture');
  // Pion avancé devant son propre roi roqué.
  const king = c.board().flat().find((p) => p && p.type === 'k' && p.color === side);
  if (m.piece === 'p' && king && Math.abs(king.square.charCodeAt(0) - m.from.charCodeAt(0)) <= 1
    && (king.square[0] >= 'f' || king.square[0] <= 'c')) tags.add('pion_devant_roi');
  // La pièce qui bouge défendait-elle son roi (case voisine du roi) ?
  if (king && m.piece !== 'k' && m.piece !== 'p') {
    const near = (s) => Math.abs(s.charCodeAt(0) - king.square.charCodeAt(0)) <= 1 && Math.abs(Number(s[1]) - Number(king.square[1])) <= 1;
    if (near(m.from) && !near(m.to)) tags.add('quitte_roi');
  }
  // Le coup laisse-t-il subsister une menace grave qui existait déjà ?
  const opp = side === 'w' ? 'b' : 'w';
  const severe = (f) => scanTactics(f, opp, 6).filter((t) => t.severity >= 10);
  const before = severe(fen);
  const still = new Set(severe(c.fen()).map((t) => t.san));
  const ignored = before.filter((t) => still.has(t.san));
  if (ignored.length) tags.add(ignored.some((t) => t.severity >= 100) ? 'ignore_menace_mat' : 'ignore_menace');
  return [...tags];
}

/** Tags du motif qui a puni le coup (d'après la réfutation). */
export function punishmentTags(fenAfter, refutationUci) {
  const tags = new Set();
  for (const step of lineMotifs(fenAfter, refutationUci, 3)) {
    for (const motif of step.motifs) {
      const key = motif.split(/[ (:]/)[0]
        .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      if (['fourchette', 'clouage', 'enfilade', 'attaque', 'echec', 'coup', 'sacrifice', 'elimine', 'piege', 'promotion', 'gain'].includes(key)) {
        tags.add(motif.startsWith('coup intermédiaire') ? 'coup_intermediaire'
          : motif.startsWith('attaque à la découverte') || motif.startsWith('échec à la découverte') ? 'decouverte'
            : motif.startsWith('échec et mat') ? 'mat'
              : motif.startsWith('échec double') ? 'echec_double'
                : motif.startsWith('élimine') ? 'deviation'
                  : key);
      }
    }
  }
  return [...tags];
}

// ── Carnet ──

export function loadLessons(path = MEMORY_PATH) {
  if (!existsSync(path)) return [];
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return []; }
}

export function saveLessons(lessons, path = MEMORY_PATH) {
  mkdirSync(dirname(path), { recursive: true });
  // Oubli : leçon unique, souvent rappelée, jamais utile.
  const kept = lessons.filter((l) => !(l.count <= 1 && (l.recalled ?? 0) >= 8 && (l.helped ?? 0) === 0));
  writeFileSync(path, `${JSON.stringify(kept, null, 2)}\n`);
  return kept;
}

/** Poids d'un tag : la NATURE du coup compte plus que la pièce ou la direction. */
const weight = (t) => (t.startsWith('piece:') || t === 'avancee' || t === 'retrait' ? 0.25 : 1);

/** Recouvrement pondéré (Jaccard) de deux ensembles de tags. */
const overlap = (a, b) => {
  if (!a.length || !b.length) return 0;
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  let union = 0;
  for (const t of new Set([...a, ...b])) {
    union += weight(t);
    if (A.has(t) && B.has(t)) inter += weight(t);
  }
  return inter / union;
};

/** Le coup partage-t-il au moins un tag de NATURE (poids plein) avec la leçon ? */
const sharesNature = (a, b) => a.some((t) => weight(t) === 1 && b.includes(t));

/**
 * Leçons les plus proches d'une situation (et éventuellement d'un coup envisagé).
 * @returns {{ lesson: object, score: number }[]}
 */
export function recall(lessons, { situation, move = null }, { k = 3, min = 0.25 } = {}) {
  return lessons
    .map((l) => {
      const s = overlap(l.situation, situation);
      const mv = move ? overlap(l.move, move) : 0;
      // Plus une erreur s'est répétée, plus elle remonte facilement.
      const weight = 1 + Math.min(0.5, 0.1 * ((l.count ?? 1) - 1));
      return { lesson: l, score: (move ? 0.4 * s + 0.6 * mv : s) * weight };
    })
    .filter((r) => r.score >= min)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/** Leçon suffisamment proche pour déclencher « attends, ça me rappelle… » sur un coup envisagé. */
export function remindsOf(lessons, situation, move) {
  // Il faut que la NATURE du coup corresponde (pas seulement la pièce ou la situation).
  const candidates = recall(lessons, { situation, move }, { k: 5, min: 0.3 })
    .filter((r) => sharesNature(r.lesson.move, move) && overlap(r.lesson.move, move) >= 0.33);
  return candidates[0] ?? null;
}

/** Leçon existante de même nature (même type de coup, même punition, situation proche). */
export function findSimilar(lessons, draft) {
  return lessons.find(
    (l) => overlap(l.move, draft.move) >= 0.6
      && overlap(l.punishment, draft.punishment) >= 0.5
      && overlap(l.situation, draft.situation) >= 0.4,
  ) ?? null;
}
