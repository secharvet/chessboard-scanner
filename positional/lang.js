/**
 * Langue des faits produits pour le LLM : français (défaut, affichage du site) ou anglais
 * (COACH_LANG=en côté serveur : le LLM raisonne dans la langue où il a appris les échecs).
 * Lue à chaque appel ; dans le navigateur, pas de `process` → français.
 */

/** @returns {'fr' | 'en'} */
export function factLang() {
  return globalThis.process?.env?.COACH_LANG === 'en' ? 'en' : 'fr';
}

/**
 * Choisit la version de la phrase selon la langue des faits.
 * @template T
 * @param {T} fr @param {T} en
 * @returns {T}
 */
export function tr(fr, en) {
  return factLang() === 'en' ? en : fr;
}
