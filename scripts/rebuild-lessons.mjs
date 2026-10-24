/**
 * Recalcule les signatures (situation, coup, punition) des leçons du carnet à partir de leur
 * premier exemple — utile quand la façon de calculer les signatures évolue.
 *   node scripts/rebuild-lessons.mjs
 */

import { Chess } from 'chess.js';
import { loadLessons, moveTags, saveLessons, situationTags } from '../coach/memory.mjs';
import { fromFrenchSan } from '../coach/notation.mjs';

const lessons = loadLessons();
for (const l of lessons) {
  const ex = l.examples?.[0];
  if (!ex?.fen || !ex.coup) continue;
  const side = ex.fen.split(' ')[1];
  const san = new Chess(ex.fen).move(fromFrenchSan(ex.coup))?.san;
  if (!san) continue;
  const before = l.move.join(',');
  l.situation = situationTags(ex.fen, side);
  l.move = moveTags(ex.fen, san);
  console.log(`${l.titre} : coup [${before}] → [${l.move.join(',')}]`);
}
saveLessons(lessons);
