/**
 * Panneau coach Groq — appel API llm-factory (openai/gpt-oss-120b).
 */

import { askGroqMentor, checkMentorHealth } from './mentor-client.js';
import { renderMentorMarkdown } from './mentor-markdown.js';

const COACH_LABEL = 'Groq · GPT-OSS 120B';

/**
 * @param {{
 *   root?: Document | HTMLElement,
 *   getPayload: () => { fen: string, side: 'white' | 'black', moves: string[] },
 *   canAsk: () => boolean,
 *   defaultQuestion: () => string,
 *   idleMessage: string,
 * }} options
 */
export function bindMentorPanel(options) {
  const root = options.root ?? document;
  const $btn = root.querySelector('#btnAskMentor');
  const $question = root.querySelector('#mentorQuestion');
  const $panel = root.querySelector('#mentorPanel-groq');
  const $status = root.querySelector('#mentorStatus');

  /** @type {{ text: string, error?: boolean } | null} */
  let cache = null;
  /** @type {AbortController | null} */
  let abort = null;
  let busy = false;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderPanel(content, { loading = false, error = false, plain = false } = {}) {
    if (!$panel) return;
    if (loading) {
      $panel.classList.remove('mentor-advice--error');
      $panel.innerHTML = '<p class="mentor-md__p">Le coach rédige…</p>';
      return;
    }
    if (error) {
      $panel.classList.add('mentor-advice--error');
      $panel.innerHTML = `<p class="mentor-md__p">${escapeHtml(content)}</p>`;
      return;
    }
    $panel.classList.remove('mentor-advice--error');
    if (plain) {
      $panel.textContent = content;
      $panel.title = '';
      return;
    }
    $panel.innerHTML = renderMentorMarkdown(content);
    $panel.scrollTop = 0;
    const overflow = $panel.scrollHeight > $panel.clientHeight + 4;
    $panel.title = overflow
      ? `${content.length} caractères — faites défiler pour lire la suite`
      : '';
  }

  function showCached() {
    if (cache?.error) renderPanel(cache.text, { error: true });
    else if (cache?.text) renderPanel(cache.text);
    else renderPanel(options.idleMessage, { plain: true });
  }

  function updateButton() {
    if (!$btn) return;
    $btn.disabled = busy || !options.canAsk();
  }

  function cancel() {
    abort?.abort();
    abort = null;
    busy = false;
    updateButton();
  }

  function reset(message) {
    cancel();
    cache = null;
    if ($question) {
      $question.value = '';
      $question.placeholder = options.defaultQuestion();
    }
    renderPanel(message ?? options.idleMessage, { plain: true });
    if ($status) $status.textContent = COACH_LABEL;
  }

  async function ask() {
    if (busy || !options.canAsk()) return;

    cancel();
    abort = new AbortController();
    busy = true;
    updateButton();
    renderPanel('', { loading: true });
    if ($status) $status.textContent = 'Requête…';

    const question = ($question?.value || '').trim() || options.defaultQuestion();
    const base = options.getPayload();

    try {
      const advice = await askGroqMentor({
        ...base,
        question,
        signal: abort.signal,
      });
      cache = { text: advice };
      renderPanel(advice);
      if ($status) $status.textContent = `${COACH_LABEL} · ${advice.length} car.`;
    } catch (e) {
      if (e?.name === 'AbortError') return;
      const msg = e?.message ?? String(e);
      cache = { text: msg, error: true };
      renderPanel(msg, { error: true });
      if ($status) $status.textContent = 'Erreur';
    } finally {
      busy = false;
      abort = null;
      updateButton();
    }
  }

  $btn?.addEventListener('click', () => void ask());
  showCached();

  return {
    reset,
    cancel,
    updateButton,
    setQuestionPlaceholder() {
      if ($question) $question.placeholder = options.defaultQuestion();
    },
    async checkHealth() {
      const ok = await checkMentorHealth();
      if ($status) $status.textContent = ok ? `${COACH_LABEL} · prêt` : 'API hors ligne';
      return ok;
    },
    isBusy: () => busy,
  };
}
