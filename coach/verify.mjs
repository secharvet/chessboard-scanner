/**
 * Vérification des affirmations du coach par leurs citations ([F7], [L1], [E1]…).
 *
 * Règles mécaniques (aucune connaissance échiquéenne ici, seulement de la cohérence) :
 *   1. une citation doit exister dans le contexte ;
 *   2. une phrase qui nomme une case ou un concept tactique/stratégique doit citer une source ;
 *   3. chaque case nommée doit apparaître dans une des sources citées ;
 *   4. chaque concept nommé (clouage, colonne, case faible…) doit apparaître dans une des sources citées.
 */

const CITE_RE = /\[((?:[A-Z]\d+[a-z]?[+\-mt]?\d*)(?:\s*[,;]\s*[A-Z]\d+[a-z]?[+\-mt]?\d*)*)\]/g; // ex. [L1i-2], [L1t1], [F7]
const SQUARE_RE = /(?<![a-zA-Z])([a-h][1-8])(?![0-9])/g;

/**
 * Concepts : regex dans la phrase du coach → regex attendue dans la source citée.
 * Français ET anglais des deux côtés : la réponse peut être dans une langue et les faits dans
 * l'autre (COACH_LANG=en avec réponse en français).
 */
const CONCEPTS = [
  ['clou|\\bpin(?:s|ned|ning)?\\b', /clou|\bpin/i],
  ['fourchette|double attaque|\\bfork|double attack', /fourchette|attaque .*et|cibles|fork|at the same time|attacks .* and/i],
  ['enfilade|skewer', /enfilade|skewer/i],
  ['découverte|discover', /découverte|démasque|discover|unmask/i],
  ['surcharg|overload', /surcharg|seule à défendre|overload|only defender/i],
  ['piégé|trapped', /piégée?|trapped/i],
  ['dernière rangée|rangée faible|back rank|back-rank', /dernière rangée|back rank/i],
  ['colonne|\\bfile\\b', /colonne|\bfile\b/i],
  ['avant-poste|outpost', /avant-poste|outpost/i],
  ['case faible|\\btrous?\\b|weak square|\\bhole', /case faible|trou|complexe|weak square|hole|complex/i],
  ['complexe|complex', /complexe|complex/i],
  ['pion passé|passed pawn|\\bpasser', /passé|passed/i],
  ['isolé|isolated', /isolé|isolated/i],
  // « Pion dame isolé » est une STRUCTURE (pion d isolé avec des pièces) : il faut un fait [S] qui la nomme.
  ['pion dame isolé|PDI|isolated queen|IQP|isolani', /pion[- ]dame isolé|PDI|isolated queen|IQP/i],
  ['arriéré|backward', /arriéré|backward/i],
  ['doublé|doublon|doubled', /doublon|doublé|doubled/i],
  ['7e rangée|septième|7th rank|seventh rank', /7e rangée|7th rank/i],
  ['paire de fous|bishop pair|two bishops', /paire de fous|bishop pair/i],
  ['mauvais fou|bad bishop', /mauvais fou|bad bishop/i],
  ['bon fou|good bishop', /bon fou|good bishop/i],
  ['en prise|non défendu|hanging|undefended', /en prise|non défendue?|hanging|undefended/i],
  // « matériel » n'est pas « mat » (pour \\b, « é » n'est pas une lettre) : fin de mot explicite.
  ['\\bmat(?![a-zà-ÿ])|\\bmater\\b|\\bmate\\b|checkmate|\\bmating\\b', /\bmat(?![a-zà-ÿ])|\bmate\b|checkmate/i],
  ['sacrifi', /sacrific/i],
  ['coup intermédiaire|in-between|zwischenzug|intermezzo', /intermédiaire|in-between/i],
  ['majorité|majority', /majorité|majority/i],
  ['française|french structure', /française|chaîne|french|chain/i],
  ['carlsbad', /carlsbad/i],
  ['maroczy', /maroczy/i],
  ['est-indienne|king.s indian', /est-indienne|chaîne|king.s indian|chain/i],
  ['pions pendants|hanging pawns', /pendants|hanging pawns/i],
  ['structure', /structure/i],
  ['développement|develop', /développ|develop/i],
];

/** Notions qui qualifient une case précise (contrôle case par case). */
const SQUARE_BOUND = /isolé|arriéré|doublé|passé|avant-poste|case faible|clou|piégé|complexe|isolated|backward|doubled|passed|outpost|weak square|\bpin|trapped|complex/i;

/** @param {string} text */
export function splitSentences(text) {
  return text
    .replace(/\n+/g, ' \n ')
    .split(/(?<=[.!?])\s+|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * @param {string} answer  réponse brute du LLM (avec citations)
 * @param {Record<string, string>} facts  identifiant → texte du fait
 * @returns {{ problems: string[], cited: number, sentences: number }}
 */
export function verifyCitations(answer, facts) {
  const problems = [];
  let citedSentences = 0;
  const sentences = splitSentences(answer);

  for (const sentence of sentences) {
    const ids = [...sentence.matchAll(CITE_RE)].flatMap((m) => m[1].split(/\s*[,;]\s*/));
    const bare = sentence.replace(CITE_RE, '').replace(/\*\*/g, '');
    if (ids.length) citedSentences++;

    const unknown = ids.filter((id) => !(id in facts));
    for (const id of unknown) problems.push(`Citation inexistante [${id}] dans : « ${bare.trim()} »`);

    const sources = ids.filter((id) => id in facts).map((id) => facts[id]).join(' ');
    const squares = [...new Set([...bare.matchAll(SQUARE_RE)].map((m) => m[1]))];
    const concepts = CONCEPTS.filter(([re]) => new RegExp(re, 'i').test(bare));

    if (!ids.length) {
      if (squares.length || concepts.length) {
        problems.push(`Affirmation sans source : « ${bare.trim()} »`);
      }
      continue;
    }
    for (const s of squares) {
      if (!sources.includes(s)) problems.push(`Case ${s} absente des sources citées (${ids.join(', ')}) : « ${bare.trim()} »`);
    }
    for (const [word, expected] of concepts) {
      if (!expected.test(sources)) {
        problems.push(`Notion « ${word.split('|')[0]} » absente des sources citées (${ids.join(', ')}) : « ${bare.trim()} »`);
        continue;
      }
      // Les cases qui SUIVENT la notion dans la proposition (« isolés en a7, c7 et c6 ») doivent chacune
      // figurer dans une source qui porte cette notion ET cette case — seulement pour les notions
      // qui qualifient une case (pas « mat » ni « en prise », suivis d'autres idées).
      if (!SQUARE_BOUND.test(word)) continue;
      const at = bare.search(new RegExp(word, 'i'));
      if (at < 0) continue;
      // Portée : jusqu'à la ponctuation forte ou jusqu'à la notion suivante (« clouage en c3, … case faible en c5 »).
      let clause = bare.slice(at).split(/[.;:!?]/)[0];
      const firstLen = (clause.match(new RegExp(word, 'i'))?.[0].length) ?? 0;
      let cut = clause.length;
      for (const [other] of CONCEPTS) {
        if (other === word) continue;
        const m = clause.slice(firstLen).search(new RegExp(other, 'i'));
        if (m >= 0) cut = Math.min(cut, m + firstLen);
      }
      clause = clause.slice(0, cut);
      const factsWithConcept = ids.filter((id) => id in facts && expected.test(facts[id])).map((id) => facts[id]);
      for (const sq of new Set([...clause.matchAll(SQUARE_RE)].map((m) => m[1]))) {
        if (!factsWithConcept.some((f) => f.includes(sq))) {
          problems.push(`Case ${sq} présentée comme « ${word.split('|')[0]} » sans source qui le dise : « ${bare.trim()} »`);
        }
      }
    }
  }
  return { problems, cited: citedSentences, sentences: sentences.length };
}

/** Retire les citations avant affichage. @param {string} answer */
export function stripCitations(answer) {
  return answer.replace(/\s*\[[A-Z]\d[^\]]*\]/g, '').replace(/[ \t]+([.,;:!?])/g, '$1');
}
