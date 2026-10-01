/**
 * Panneau coach — appel au serveur coach/ (Stockfish + règles + LLM).
 */

import { askGroqMentor, checkMentorHealth } from './mentor-client.js';
import { renderMentorMarkdown } from './mentor-markdown.js';
import { bindBoardLinks, linkifyChess } from './board-links.js';

const MOBILE = '(max-width: 900px)';

const COACH_LABEL = 'Coach ancré';

/**
 * @param {{
 *   root?: Document | HTMLElement,
 *   getPayload: () => { fen: string, side: 'white' | 'black', moves: string[] },
 *   canAsk: () => boolean,
 *   defaultQuestion: () => string,
 *   idleMessage: string,
 *   board?: () => HTMLElement | null,
 *   getOrientation?: () => 'white' | 'black',
 * }} options
 */
export function bindMentorPanel(options) {
  const root = options.root ?? document;
  const $btn = root.querySelector('#btnAskMentor');
  const $question = root.querySelector('#mentorQuestion');
  const $panel = root.querySelector('#mentorPanel-groq');
  const $status = root.querySelector('#mentorStatus');

  // Cases et coups de la réponse reliés à l'échiquier (survol / toucher).
  if ($panel && options.board) {
    bindBoardLinks($panel, {
      board: options.board,
      getFen: () => options.getPayload().fen,
      getOrientation: options.getOrientation,
    });
  }

  // Sur téléphone : la réponse s'ouvre en panneau fixé en bas de l'écran, sous l'échiquier.
  const $close = document.createElement('button');
  $close.type = 'button';
  $close.className = 'mentor-sheet__close';
  $close.setAttribute('aria-label', 'Fermer la réponse du coach');
  $close.textContent = '✕';
  $close.addEventListener('click', () => closeSheet());

  function openSheet() {
    if (!$panel || !window.matchMedia(MOBILE).matches) return;
    const board = options.board?.();
    board?.scrollIntoView({ block: 'start', behavior: 'instant' });
    const top = board ? Math.max(board.getBoundingClientRect().bottom + 4, window.innerHeight * 0.35) : window.innerHeight * 0.4;
    $panel.style.setProperty('--sheet-top', `${Math.round(Math.min(top, window.innerHeight - 180))}px`);
    $panel.classList.add('mentor-sheet');
    if (!$close.isConnected) $panel.prepend($close);
  }

  function closeSheet() {
    $panel?.classList.remove('mentor-sheet');
    $close.remove();
  }

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
    linkifyChess($panel);
    $panel.scrollTop = 0;
    openSheet();
    const overflow = $panel.scrollHeight > $panel.clientHeight + 4;
    $panel.title = overflow
      ? `${content.length} caractères — faites défiler pour lire la suite`
      : '';
  }

  // ── Indices par paliers ──
  const $hint = document.createElement('button');
  $hint.type = 'button';
  $hint.id = 'btnMentorHint';
  $hint.className = 'btn mentor-hint';
  $hint.addEventListener('click', () => {
    if (!cache || cache.error) return;
    cache.level += 1;
    renderCurrent();
  });

  // Jugement du coup précédent (mode joueur) : affiché en tête du conseil suivant.
  /** @type {string | null} */
  let verdict = null;

  function renderCurrent() {
    if (!cache || cache.error) return;
    const hints = cache.hints ?? [];
    let text;
    if (!cache.idea || cache.level > hints.length) text = cache.text;
    else text = [cache.idea, ...hints.slice(0, cache.level)].join('\n\n');
    renderPanel(verdict ? `**Ton coup** — ${verdict}\n\n**Maintenant** — ${text}` : text);
    const done = !cache.idea || cache.level > hints.length;
    if (!done && $panel) {
      $hint.textContent = cache.level < hints.length ? `Indice (${cache.level + 1}/${hints.length + 1})` : 'Montrer le coup';
      $panel.append($hint);
    } else {
      $hint.remove();
    }
  }

  function showCached() {
    if (cache?.error) renderPanel(cache.text, { error: true });
    else if (cache?.text) renderCurrent();
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
      const { advice, problems, idea, hints } = await askGroqMentor({
        ...base,
        question,
        signal: abort.signal,
      });
      // Par défaut, l'IDÉE (sans le coup) ; le bouton « Indice » donne la pièce, puis la case, puis la fiche complète.
      cache = { text: advice, idea, hints, level: idea ? 0 : 99 };
      renderCurrent();
      if ($status) {
        $status.textContent = problems.length
          ? `${COACH_LABEL} · ⚠ ${problems.length} affirmation(s) non vérifiée(s)`
          : `${COACH_LABEL} · ✓ sources vérifiées`;
        $status.title = problems.join('\n');
      }
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
    ask,
    /** Le joueur vient de jouer : l'ancien conseil (position précédente) et l'ancien jugement ne valent plus. */
    newTurn() {
      cancel();
      cache = null;
      verdict = null;
      renderPanel('Le coach regarde ton coup…', { plain: true });
    },
    /** Jugement du dernier coup joué (texte) ; null pour l'effacer. Réaffiche le panneau s'il y a un conseil. */
    setVerdict(text) {
      verdict = text;
      if (cache && !cache.error) renderCurrent();
      else if (text) renderPanel(`**Ton coup** — ${text}`);
    },
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
