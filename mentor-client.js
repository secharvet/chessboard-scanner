/**
 * Client HTTP du serveur coach — POST /api/chess/mentor/groq (chemin conservé pour compatibilité)
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
 * @returns {Promise<{ advice: string, problems: string[], revised: boolean }>}
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
    return {
      lecture: data.lecture ?? null,
      lectureTexte: data.lectureTexte ?? '',
      advice, problems: data.problems ?? [], revised: Boolean(data.revised),
      // Idée sans le coup et indices par paliers (fiche du code) ; absents avec l'ancien coach à LLM.
      idea: typeof data.idea === 'string' && data.idea.trim() ? data.idea : null,
      hints: Array.isArray(data.hints) ? data.hints : [],
    };
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

/**
 * Jugement du coup joué : fen AVANT le coup, coup en UCI (e2e4). Renvoie { text, category, loss, best } ou null.
 * @param {{ fen: string, move: string, signal?: AbortSignal }} payload
 */
export async function judgePlayedMove(payload) {
  const base = getMentorApiBase();
  try {
    const res = await fetch(`${base}/api/chess/mentor/judge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen: payload.fen, move: payload.move }),
      signal: payload.signal,
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.ok ? data : null;
  } catch {
    return null;
  }
}
