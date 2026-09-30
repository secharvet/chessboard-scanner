/**
 * Client du service local « intentions » (coach/intentions-server.py) : pour une position, ce que les joueurs de ce
 * niveau entreprennent ici, et ce que l'adversaire prépare probablement. Le modèle PROPOSE ; le coach vérifie
 * (coach/plans.mjs) et le code explique. Activé par COACH_INTENTIONS=1 ; en cas d'absence ou de lenteur du service,
 * le coach s'en passe (null), jamais d'erreur visible.
 */

const URL = process.env.INTENTIONS_URL ?? 'http://127.0.0.1:8001/intentions';
const TIMEOUT_MS = Number(process.env.INTENTIONS_TIMEOUT_MS ?? 600);

/** Faits comptés par « identifiant|couleur », comme dans scripts/build-dataset.mjs. */
export function countFacts(facts) {
  const out = {};
  for (const t of facts) {
    const k = `${t.id}|${t.params.color ?? '-'}`;
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

/**
 * @param {{ fen: string, facts: object[], elo?: { w?: number, b?: number } }} input
 * @returns {Promise<{ w: Record<string, {arbres: number, reseau?: number}>, b: Record<string, {arbres: number, reseau?: number}> } | null>}
 */
export async function predictIntentions({ fen, facts, elo }) {
  if (process.env.COACH_INTENTIONS !== '1') return null;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
      body: JSON.stringify({ fen, facts: countFacts(facts), elo }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.w && data.b ? { w: data.w, b: data.b } : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Le plan le plus probable d'un camp. Les probabilités des arbres sont entraînées avec des classes rééquilibrées :
 * elles CLASSENT bien mais ne sont pas calibrées (0,6 ne veut pas dire « 60 % des cas ») ; on ne les affiche donc
 * jamais comme des pourcentages, et on exige une marge nette sur le second pour parler. Les recettes à précondition
 * (baïonnette, attaque de minorité) sont exclues tant qu'elles ne sont pas calibrées : leur rareté rend les
 * probabilités rééquilibrées peu fiables.
 */
const NOT_YET = ['baionnette', 'attaque_minorite'];

/**
 * Les ingrédients du plan sont-ils là pour `side` ? Le modèle classe sans vérifier la matière (dans une finale de
 * pions il a proposé « une tour sur la colonne ouverte ») : on ne propose un plan que si ses ingrédients sont
 * présents, mêmes dénominateurs que la grille conditionnelle (scripts/human-grid-cond.mjs).
 * `facts` : jetons du moteur de règles ; `pieces` : { r, n, b } = nombre de tours, cavaliers, fous du camp.
 */
export function ingredientsPresent(concept, facts, side, pieces) {
  const opp = side === 'w' ? 'b' : 'w';
  const has = (id, color) => facts.some((t) => t.id === id && (color === '-' ? t.params.color === undefined : t.params.color === color));
  switch (concept) {
    case 'tour_colonne': return pieces.r > 0 && (has('COLONNE_OUVERTE', '-') || has('COLONNE_SEMI_OUVERTE', side));
    case 'rupture': return has('LEVIER_DISPONIBLE', side);
    case 'cavalier_avant_poste': return pieces.n > 0 && has('ROUTE_CAVALIER', side);
    case 'blocage': return pieces.n + pieces.b > 0 && (has('ROUTE_CAVALIER', side) || ['PION_ISOLE', 'PION_ARRIERE', 'PION_FAIBLE', 'PION_PASSE'].some((id) => has(id, opp)));
    case 'affaiblir': return has('ECHANGE_ABIMANT', side) || has('LEVIER_DISPONIBLE', side);
    case 'dominer': return pieces.b > 0 && (has('COMPLEXE_FAIBLE', opp) || has('CASE_FAIBLE', opp));
    default: return true;
  }
}

/** Nombre de tours, cavaliers, fous d'un camp, lu dans le FEN. */
export function pieceCounts(fen, side) {
  const board = fen.split(' ')[0];
  const pick = (ch) => (board.match(new RegExp(side === 'w' ? ch.toUpperCase() : ch.toLowerCase(), 'g')) ?? []).length;
  return { r: pick('r'), n: pick('n'), b: pick('b') };
}

export function topIntention(byConcept, { min = 0.5, margin = 0.1, exclude = [], facts = null, fen = null, side = null } = {}) {
  if (!byConcept) return null;
  const pieces = fen && side ? pieceCounts(fen, side) : null;
  const ranked = Object.entries(byConcept)
    .filter(([c]) => !exclude.includes(c) && !NOT_YET.includes(c))
    .filter(([c]) => !facts || !pieces || ingredientsPresent(c, facts, side, pieces))
    .map(([concept, p]) => ({ concept, p: p.arbres ?? p.reseau ?? 0 }))
    .sort((a, b) => b.p - a.p);
  const [best, second] = ranked;
  if (!best || best.p < min) return null;
  if (second && best.p - second.p < margin) return null;
  return best;
}
