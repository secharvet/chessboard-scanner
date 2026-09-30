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

/** Le plan le plus probable d'un camp, si sa probabilité passe le seuil ; le score retenu est celui des arbres. */
export function topIntention(byConcept, { min = 0.35, exclude = [] } = {}) {
  if (!byConcept) return null;
  const best = Object.entries(byConcept)
    .filter(([c]) => !exclude.includes(c))
    .map(([concept, p]) => ({ concept, p: p.arbres ?? p.reseau ?? 0 }))
    .sort((a, b) => b.p - a.p)[0];
  return best && best.p >= min ? best : null;
}
