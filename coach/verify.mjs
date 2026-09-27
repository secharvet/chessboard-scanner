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

/** Concepts : regex dans la phrase du coach → regex attendue dans la source citée. */
const CONCEPTS = [
  ['clou', /clou/i],
  ['fourchette|double attaque', /fourchette|attaque .*et|cibles/i],
  ['enfilade', /enfilade/i],
  ['découverte', /découverte|démasque/i],
  ['surcharg', /surcharg|seule à défendre/i],
  ['piégé', /piégée?/i],
  ['dernière rangée|rangée faible', /dernière rangée/i],
  ['colonne', /colonne/i],
  ['avant-poste', /avant-poste/i],
  ['case faible|trou', /case faible|trou|complexe/i],
  ['complexe', /complexe/i],
  ['pion passé', /passé/i],
  ['isolé|PDI', /isolé|PDI/i],
  ['arriéré', /arriéré/i],
  ['doublé|doublon', /doublon|doublé/i],
  ['7e rangée|septième', /7e rangée/i],
  ['paire de fous', /paire de fous/i],
  ['mauvais fou', /mauvais fou/i],
  ['bon fou', /bon fou/i],
  ['en prise|non défendu', /en prise|non défendue?/i],
  ['mat\\b|mater', /\bmat\b/i],
  ['sacrifi', /sacrifice/i],
  ['coup intermédiaire', /intermédiaire/i],
  ['majorité', /majorité/i],
  ['française', /française|chaîne/i],
  ['carlsbad', /carlsbad/i],
  ['maroczy', /maroczy/i],
  ['est-indienne', /est-indienne|chaîne/i],
  ['pions pendants', /pendants/i],
  ['structure', /structure/i],
  ['développement', /développ/i],
];

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
      // figurer dans une source qui porte cette notion ET cette case.
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
