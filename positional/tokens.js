/**
 * Jetons positionnels — Module 1.1 (structure de pions).
 */

/** @typedef {'fact'|'delta'} TokenKind */

/**
 * @typedef {Object} PositionalToken
 * @property {string} id
 * @property {TokenKind} kind
 * @property {Record<string, string | number | boolean>} params
 */

/** @param {string} id @param {Record<string, string | number | boolean>} params */
export function token(id, params = {}) {
  return { id, kind: 'fact', params };
}

/** @param {PositionalToken} t */
export function tokenKey(t) {
  const parts = Object.keys(t.params)
    .sort()
    .map((k) => `${k}=${t.params[k]}`);
  return `${t.id}|${parts.join('|')}`;
}

/**
 * @param {PositionalToken[]} tokens
 * @param {string} id
 * @param {Record<string, string | number | boolean>} [params]
 */
export function findToken(tokens, id, params = {}) {
  return tokens.find((t) => {
    if (t.id !== id) return false;
    for (const [k, v] of Object.entries(params)) {
      if (t.params[k] !== v) return false;
    }
    return true;
  });
}

/** @param {PositionalToken[]} tokens */
export function sortTokens(tokens) {
  return [...tokens].sort((a, b) => tokenKey(a).localeCompare(tokenKey(b)));
}
