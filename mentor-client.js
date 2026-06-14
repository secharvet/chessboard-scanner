/**
 * Client HTTP llm-factory — POST /api/chess/mentor/groq
 */

const GROQ_TIMEOUT_MS = 120_000;

/** @returns {string} */
export function getMentorApiBase() {
  const fromWindow = typeof window !== 'undefined' && window.CHESS_MENTOR_API;
  if (fromWindow) return String(fromWindow).replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://127.0.0.1:8000';
}

/**
 * @param {{
 *   fen: string,
 *   side: 'white' | 'black',
 *   moves?: string[],
 *   question?: string,
 *   signal?: AbortSignal,
 * }} payload
 * @returns {Promise<string>}
 */
export async function askGroqMentor(payload) {
  const base = getMentorApiBase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  if (payload.signal) {
    payload.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(`${base}/api/chess/mentor/groq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fen: payload.fen,
        side: payload.side,
        moves: payload.moves ?? [],
        question: payload.question ?? '',
      }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      const msg = data.error || `HTTP ${res.status}`;
      console.error('[mentor/groq] HTTP', res.status, msg);
      if (res.status === 400) throw new Error(`Requête invalide : ${msg}`);
      if (res.status === 502) throw new Error(`Service mentor indisponible : ${msg}`);
      throw new Error(msg);
    }

    const advice = data.advice;
    if (advice == null || String(advice).trim() === '') {
      throw new Error('Réponse vide du serveur (groq).');
    }
    return advice;
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new Error(
        `Requête mentor annulée ou délai dépassé (${Math.round(GROQ_TIMEOUT_MS / 1000)} s).`,
      );
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

/** @returns {Promise<boolean>} */
export async function checkMentorHealth() {
  try {
    const base = getMentorApiBase();
    const healthUrl = base.includes('127.0.0.1:8000')
      ? `${base}/health`
      : `${base}/llm-factory-health`;
    const res = await fetch(healthUrl, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
