/**
 * Analyse d'après-partie : pour chaque erreur, le LLM comprend ce qui s'est passé et
 * écrit une leçon générale ; le code calcule la signature et range la leçon dans le carnet
 * (fusion avec une leçon semblable si elle existe).
 */

import { Chess } from 'chess.js';
import { complete } from './llm.mjs';
import { findSimilar, loadLessons, moveTags, punishmentTags, saveLessons, situationTags } from './memory.mjs';
import { toFrenchSan } from './notation.mjs';
import { buildAllFacts } from '../positional/index.js';
import { buildBalance } from '../positional/balance.js';

const REVIEW_SYSTEM = `Tu es un joueur d'échecs qui analyse sa propre partie après coup, comme dans un carnet d'entraînement.
Pour une erreur, on te donne la situation, ton coup, ce que tu pensais (plan, raison), la réfutation trouvée par l'ordinateur et la cause de l'erreur.
Écris une LEÇON réutilisable dans d'autres parties :
- générale : pas de cases précises ni de coups précis, mais le type de situation et le type de coup ;
- actionnable : ce qu'il faut vérifier ou éviter la prochaine fois ;
- honnête sur la cause (tu n'as pas vu, ou tu as vu mais ignoré parce que tu étais focalisé sur ton plan).
Réponds UNIQUEMENT en JSON : {"titre": "5 à 8 mots", "lecon": "1 à 2 phrases", "signal": "le signe qui aurait dû t'alerter, 1 phrase"}`;

const MERGE_SYSTEM = `Tu fusionnes deux leçons d'échecs de même nature, tirées de deux erreurs semblables, en UNE leçon plus générale et plus solide.
Réponds UNIQUEMENT en JSON : {"titre": "5 à 8 mots", "lecon": "1 à 2 phrases", "signal": "1 phrase"}`;

const parse = (raw) => JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? 'null');

/**
 * @param {{
 *   fenBefore: string, san: string, fenAfter: string, plan?: string, raison?: string,
 *   refutationUci: string[], cause: string, loss: number,
 * }} mistake
 * @param {ReturnType<import('./llm.mjs').llmConfig>} cfg
 * @returns {Promise<{ action: 'ajoutée' | 'fusionnée', lesson: object }>}
 */
export async function learnFromMistake(mistake, cfg) {
  const side = mistake.fenBefore.split(' ')[1];
  const draft = {
    situation: situationTags(mistake.fenBefore, side),
    move: moveTags(mistake.fenBefore, mistake.san),
    punishment: punishmentTags(mistake.fenAfter, mistake.refutationUci),
  };

  const c = new Chess(mistake.fenAfter);
  const ref = [];
  for (const u of mistake.refutationUci.slice(0, 6)) {
    try { ref.push(toFrenchSan(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)); } catch { break; }
  }
  const b = buildBalance(buildAllFacts(mistake.fenBefore));
  const opp = side === 'w' ? 'b' : 'w';
  const user = `Situation avant ton coup :
- Tes faiblesses : ${b[side].weaknesses.slice(0, 6).join(' ; ') || '(aucune notable)'}
- Atouts adverses : ${b[opp].assets.slice(0, 6).join(' ; ') || '(aucun notable)'}
- Signature : ${draft.situation.join(', ')}
Ton coup : ${toFrenchSan(mistake.san)} (type : ${draft.move.join(', ')})
Ton plan : ${mistake.plan ?? ''}
Ta raison : ${mistake.raison ?? ''}
Réfutation de l'ordinateur : ${ref.join(' ')} (motifs : ${draft.punishment.join(', ') || 'positionnel'})
Coût : environ ${(mistake.loss / 100).toFixed(1)} pion(s)
Cause : ${mistake.cause}`;

  const written = parse(await complete({ system: REVIEW_SYSTEM, user }, cfg));
  const example = { fen: mistake.fenBefore, coup: toFrenchSan(mistake.san), refutation: ref.join(' '), perte: mistake.loss };

  const lessons = loadLessons();
  const similar = findSimilar(lessons, draft);
  if (similar) {
    const merged = parse(await complete({
      system: MERGE_SYSTEM,
      user: `Leçon existante (${similar.count} erreur(s)) : ${similar.titre} — ${similar.lecon} (signal : ${similar.signal})\nNouvelle leçon : ${written.titre} — ${written.lecon} (signal : ${written.signal})`,
    }, cfg)) ?? written;
    Object.assign(similar, merged, {
      count: (similar.count ?? 1) + 1,
      situation: [...new Set([...similar.situation, ...draft.situation])],
      examples: [...(similar.examples ?? []), example].slice(-3),
      cause: mistake.cause,
      updatedAt: new Date().toISOString(),
    });
    saveLessons(lessons);
    return { action: 'fusionnée', lesson: similar };
  }

  const lesson = {
    id: `L${Date.now().toString(36)}`,
    ...written,
    ...draft,
    cause: mistake.cause,
    count: 1,
    recalled: 0,
    helped: 0,
    examples: [example],
    createdAt: new Date().toISOString(),
  };
  lessons.push(lesson);
  saveLessons(lessons);
  return { action: 'ajoutée', lesson };
}

/** Met à jour les compteurs d'une leçon rappelée (utile ou non). */
export function markRecall(id, helped) {
  const lessons = loadLessons();
  const l = lessons.find((x) => x.id === id);
  if (!l) return;
  l.recalled = (l.recalled ?? 0) + 1;
  if (helped) l.helped = (l.helped ?? 0) + 1;
  saveLessons(lessons);
}
