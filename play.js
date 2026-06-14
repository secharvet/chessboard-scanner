/**
 * Jouer contre Stockfish — chess.js + WASM (vendor dans l'image Docker).
 */

import { Chess } from '/vendor/chess.js';
import { renderPlayBoard, bindPlayBoardInput } from './play-board.js';
import { getEngineMove, engineReady } from './stockfish-client.js';
import {
  buildAnalysisPipeline,
  buildConseil,
} from './eval-fr.js';
import { buildAllFacts } from './positional/index.js';
import { interpretFacts } from './positional/interpreter.js';
import { parseFenPieces } from './positional/fen-board.js';
import { bindMentorPanel } from './mentor-ui.js';

const $board = document.getElementById('playBoard');
const $status = document.getElementById('playStatus');
const $engineRaw = document.getElementById('engineRaw');
const $engineChessJs = document.getElementById('engineChessJs');
const $engineHuman = document.getElementById('engineHuman');
const $engineConseil = document.getElementById('engineConseil');
const $engineDebug = document.getElementById('engineDebug');
const $btnEngineDebug = document.getElementById('btnEngineDebug');
const $engineModeHint = document.getElementById('engineModeHint');
const $engine = document.getElementById('engineStatus');
const $color = document.getElementById('playerColor');
const $level = document.getElementById('engineLevel');
const $btnNew = document.getElementById('btnNewGame');
const $btnUndo = document.getElementById('btnUndo');
const $btnRedo = document.getElementById('btnRedo');
const $promoModal = document.getElementById('promoModal');
const $promoChoices = document.getElementById('promoChoices');
const $bootError = document.getElementById('bootError');
const $boardTheme = document.getElementById('boardTheme');
const $btnHeatmap = document.getElementById('btnHeatmap');
const $capturedWhite = document.getElementById('capturedByWhite');
const $capturedBlack = document.getElementById('capturedByBlack');
const $posFacts = document.getElementById('posFacts');
const $layoutPlay = document.querySelector('.layout--play');
/** @type {ReturnType<typeof bindMentorPanel> | null} */
let mentorPanel = null;

const BOARD_THEME_KEY = 'chess-play-board-theme';
const ENGINE_DEBUG_KEY = 'chess-engine-debug';
const HEATMAP_KEY = 'chess-play-heatmap';
let boardTheme = localStorage.getItem(BOARD_THEME_KEY) || 'classic';
let debugMode = localStorage.getItem(ENGINE_DEBUG_KEY) === '1';
let showHeatmap = localStorage.getItem(HEATMAP_KEY) === '1';

let lastFenAnalyzed = null;
let lastTrace = null;
let lastPipeline = null;
let previousFen = null;
let dragFrom = null;

/** @type {Chess} */
let game = new Chess();
let orientation = 'white';
let selected = null;
let targets = [];
let lastMove = null;
let thinking = false;
let playerColor = 'w';
let engineGeneration = 0;
let playerMovedThisCycle = false;

let historyPast = [];
let historyFuture = [];
let pendingPromotion = null;


const PROMO_PIECES = [
  { code: 'q', label: 'Dame', type: 'Q' },
  { code: 'r', label: 'Tour', type: 'R' },
  { code: 'b', label: 'Fou', type: 'B' },
  { code: 'n', label: 'Cavalier', type: 'N' },
];

function showError(msg) {
  if ($bootError) {
    $bootError.hidden = false;
    $bootError.textContent = msg;
  }
}

function traceFromEngineResult(result) {
  return {
    rawLines: result.rawLines ?? [],
    depthChain: result.depthChain ?? [],
    bestmove: result.bestmove ?? null,
    finalScore: result.score ?? result.finalScore ?? null,
    multiPv: result.multiPv ?? [],
  };
}

function setTrace(fenAnalyzed, trace) {
  lastFenAnalyzed = fenAnalyzed;
  lastTrace = trace;
  lastPipeline = buildAnalysisPipeline(fenAnalyzed, trace);
  refreshAnalysisUI();
}

function refreshAnalysisUI() {
  $layoutPlay?.classList.toggle('debug-on', debugMode);

  if ($btnEngineDebug) {
    $btnEngineDebug.setAttribute('aria-pressed', debugMode ? 'true' : 'false');
    $btnEngineDebug.textContent = debugMode ? 'Debug ✓' : 'Debug';
  }
  if ($engineModeHint) {
    $engineModeHint.textContent = debugMode
      ? 'Pipeline debug (§1–6)'
      : 'Conseil';
  }

  if (debugMode) {
    if ($engineConseil) $engineConseil.hidden = true;
    if ($engineDebug) $engineDebug.hidden = false;
    if (lastPipeline && lastFenAnalyzed) {
      if ($engineRaw) $engineRaw.textContent = lastPipeline.raw || '—';
      if ($engineChessJs) $engineChessJs.textContent = lastPipeline.chessJs || '—';
      if ($engineHuman) $engineHuman.textContent = lastPipeline.human || '—';
    }
    if ($posFacts) {
      $posFacts.textContent = '—';
    }
  } else {
    if ($engineDebug) $engineDebug.hidden = true;
    if ($engineConseil) $engineConseil.hidden = false;
    if ($engineConseil) {
      const text =
        buildConseil(lastFenAnalyzed, lastTrace, {
          thinking,
          playerTurn: isPlayerTurn() && !game.isGameOver(),
        }) ?? conseilIdleText();
      $engineConseil.textContent = text;
    }
  }
}

function conseilIdleText() {
  if (thinking) return 'Le moteur réfléchit…';
  if (isPlayerTurn() && !game.isGameOver()) return 'À toi de jouer.';
  return 'Glisse une pièce ou clique pièce puis case.';
}

function showAnalysisIdle(message) {
  lastFenAnalyzed = null;
  lastTrace = null;
  lastPipeline = null;
  if ($engineConseil && !debugMode) {
    $engineConseil.hidden = false;
    $engineConseil.textContent = message;
  }
  if ($engineDebug) $engineDebug.hidden = !debugMode;
  if (debugMode) {
    if ($engineRaw) $engineRaw.textContent = '—';
    if ($engineChessJs) $engineChessJs.textContent = '—';
    if ($engineHuman) $engineHuman.textContent = message;
    if ($posFacts) $posFacts.textContent = '—';
  }
}

function depthForLevel() {
  return Math.min(18, Math.max(4, Number($level?.value ?? 8)));
}

function isPlayerTurn() {
  return game.turn() === playerColor;
}

function snapshot() {
  return { fen: game.fen(), lastMove: lastMove ? { ...lastMove } : null };
}

function loadSnapshot(snap) {
  game.load(snap.fen);
  lastMove = snap.lastMove;
}

function pushHistory() {
  historyPast.push(snapshot());
  historyFuture = [];
  updateNavButtons();
}

function updateNavButtons() {
  if ($btnUndo) $btnUndo.disabled = thinking || historyPast.length <= 1;
  if ($btnRedo) $btnRedo.disabled = thinking || historyFuture.length === 0;
  mentorPanel?.updateButton();
}

function playerSideLabel() {
  return playerColor === 'w' ? 'white' : 'black';
}

function defaultMentorQuestion() {
  return playerColor === 'w'
    ? 'Quel plan pour les blancs ?'
    : 'Quel plan pour les noirs ?';
}

function refreshPositionPanel() {
  try {
    const facts = buildAllFacts(game.fen());
    const text = facts.length
      ? interpretFacts(facts)
      : 'Aucun fait positionnel détecté.';
    const el = document.getElementById('positionalPanel');
    if (el) {
      el.textContent = '';
      el.appendChild(highlightSquares(text));
    }
  } catch (e) {
    console.error('Position panel:', e);
  }
}

function highlightSquares(text) {
  const frag = document.createDocumentFragment();
  const html = text.replace(
    /(?<![a-z<>/])([a-h][1-8])(?![a-z<>])/g,
    '<span class="sq-link" data-sq="$1">$1</span>',
  );
  const div = document.createElement('div');
  div.innerHTML = html;
  while (div.firstChild) frag.appendChild(div.firstChild);
  return frag;
}

function computeTargets(from) {
  return game.moves({ square: from, verbose: true }).map((m) => m.to);
}

function needsPromotion(from, to) {
  const p = game.get(from);
  if (!p || p.type !== 'p') return false;
  const rank = to[1];
  return (p.color === 'w' && rank === '8') || (p.color === 'b' && rank === '1');
}

function refreshBoard() {
  renderPlayBoard($board, {
    fen: game.fen(),
    orientation,
    boardTheme,
    targets,
    lastMove,
    dragFrom,
    showHeatmap,
  });

  let status = game.turn() === 'w' ? 'Trait aux Blancs' : 'Trait aux Noirs';
  if (game.isGameOver()) {
    if (game.isCheckmate()) status += ' — Échec et mat';
    else if (game.isStalemate()) status += ' — Pat';
    else if (game.isDraw()) status += ' — Nulle';
  }
  if (thinking) status += ' — Stockfish réfléchit';
  $status.textContent = status;
  updateNavButtons();
  renderCaptured();

  if (previousFen === game.fen()) return;
  previousFen = game.fen();
  refreshPositionPanel();
}

function applyMove(from, to, promotion) {
  const m = game.move({ from, to, promotion: promotion || undefined });
  if (!m) return false;
  lastMove = { from, to };
  selected = null;
  targets = [];
  refreshBoard();
  return true;
}

function showPromotionModal(from, to) {
  pendingPromotion = { from, to };
  if (!$promoModal || !$promoChoices) return;

  const color = playerColor;
  $promoChoices.innerHTML = '';
  for (const p of PROMO_PIECES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'promo-modal__btn';
    btn.title = p.label;
    const img = document.createElement('img');
    img.src = `./assets/pieces/${color}${p.type}.png`;
    img.alt = p.label;
    img.draggable = false;
    const span = document.createElement('span');
    span.textContent = p.label;
    btn.appendChild(img);
    btn.appendChild(span);
    btn.addEventListener('click', () => confirmPromotion(p.code));
    $promoChoices.appendChild(btn);
  }
  $promoModal.hidden = false;
}

function hidePromotionModal() {
  pendingPromotion = null;
  if ($promoModal) $promoModal.hidden = true;
}

function confirmPromotion(pieceCode) {
  if (!pendingPromotion) return;
  const { from, to } = pendingPromotion;
  hidePromotionModal();
  pushHistory();
  if (applyMove(from, to, pieceCode)) {
    playerMovedThisCycle = true;
    void engineReply();
  } else {
    historyPast.pop();
  }
}

function canInteract() {
  return !thinking && isPlayerTurn() && !game.isGameOver() && !pendingPromotion;
}

function playMove(from, to) {
  if (!targets.includes(to)) return false;
  if (needsPromotion(from, to)) {
    showPromotionModal(from, to);
    return true;
  }
  pushHistory();
  if (applyMove(from, to)) {
    playerMovedThisCycle = true;
    void engineReply();
    return true;
  }
  historyPast.pop();
  return false;
}

function onSquareClick(sq) {
  if (!canInteract()) return;

  if (selected && targets.includes(sq)) {
    playMove(selected, sq);
    return;
  }

  const piece = game.get(sq);
  if (piece && piece.color === playerColor) {
    selected = sq;
    targets = computeTargets(sq);
  } else {
    selected = null;
    targets = [];
  }
  refreshBoard();
}

function onDragStart(from) {
  dragFrom = from;
  selected = from;
  targets = computeTargets(from);
  refreshBoard();
}

function onDrop(from, to) {
  dragFrom = null;
  if (!canInteract()) return;
  selected = from;
  targets = computeTargets(from);
  if (targets.includes(to)) playMove(from, to);
  else {
    selected = null;
    targets = [];
    refreshBoard();
  }
}

function onDragCancel() {
  dragFrom = null;
  selected = null;
  targets = [];
  refreshBoard();
}

async function engineReply() {
  if (game.isGameOver() || isPlayerTurn()) return;

  const hadPlayerMove = playerMovedThisCycle;
  const gen = ++engineGeneration;
  const fenBefore = game.fen();
  thinking = true;
  $engine.textContent = 'Stockfish réfléchit…';
  lastFenAnalyzed = fenBefore;
  lastTrace = { rawLines: [], depthChain: [], bestmove: null, finalScore: null, multiPv: [] };
  refreshAnalysisUI();
  updateNavButtons();
  refreshBoard();

  try {
    const result = await getEngineMove(fenBefore, {
      depth: depthForLevel(),
      onProgress: (partial) => {
        if (gen !== engineGeneration) return;
        setTrace(fenBefore, traceFromEngineResult(partial));
      },
    });
    if (gen !== engineGeneration) return;

    const trace = traceFromEngineResult(result);
    setTrace(fenBefore, trace);

    if (result.bestmove && result.bestmove.length >= 4) {
      pushHistory();
      const from = result.bestmove.slice(0, 2);
      const to = result.bestmove.slice(2, 4);
      const promo = result.bestmove[4];
      if (!applyMove(from, to, promo || 'q')) {
        historyPast.pop();
      }
    }
  } catch (e) {
    if (gen === engineGeneration) {
      console.error(e);
      showAnalysisIdle('Erreur moteur : ' + (e?.message ?? String(e)));
    }
  } finally {
    if (gen === engineGeneration) {
      thinking = false;
      $engine.textContent = 'Moteur prêt';
      refreshAnalysisUI();
      refreshBoard();
      if (hadPlayerMove) {
        playerMovedThisCycle = false;
      }
    }
  }
}

function undoMove() {
  if (thinking || historyPast.length <= 1) return;
  mentorPanel?.cancel();
  engineGeneration++;
  hidePromotionModal();
  selected = null;
  targets = [];

  historyFuture.push(snapshot());
  historyPast.pop();
  loadSnapshot(historyPast[historyPast.length - 1]);
  previousFen = historyPast.length >= 2 ? historyPast[historyPast.length - 2].fen : null;
  refreshBoard();
  showAnalysisIdle('Coup annulé. Tu peux rejouer ou utiliser « Refaire ».');
}

function redoMove() {
  if (thinking || historyFuture.length === 0) return;
  mentorPanel?.cancel();
  engineGeneration++;
  hidePromotionModal();
  selected = null;
  targets = [];

  const next = historyFuture.pop();
  historyPast.push(next);
  loadSnapshot(next);
  refreshBoard();

  if (!isPlayerTurn() && !game.isGameOver()) {
    void engineReply();
  }
}

function resetHistory() {
  historyPast = [snapshot()];
  historyFuture = [];
  updateNavButtons();
}

function renderCaptured() {
  const pieces = parseFenPieces(game.fen()).pieces;
  const initial = { w: { q: 1, r: 2, b: 2, n: 2, p: 8 }, b: { q: 1, r: 2, b: 2, n: 2, p: 8 } };
  const current = { w: /** @type {Record<string,number>} */ ({}), b: /** @type {Record<string,number>} */ ({}) };
  for (const p of pieces) {
    current[p.color][p.type] = (current[p.color][p.type] || 0) + 1;
  }

  const order = ['q', 'r', 'b', 'n', 'p'];
  const containers = { w: $capturedBlack, b: $capturedWhite };

  for (const color of /** @type {const} */ (['w', 'b'])) {
    const container = containers[color];
    if (!container) continue;
    container.innerHTML = '';

    for (const type of order) {
      const missing = (initial[color][type] || 0) - (current[color][type] || 0);
      for (let i = 0; i < missing; i++) {
        const img = document.createElement('img');
        img.className = 'captured__piece';
        img.src = `./assets/pieces/${color === 'w' ? 'b' : 'w'}${type.toUpperCase()}.png`;
        img.alt = type;
        img.draggable = false;
        container.appendChild(img);
      }
    }
  }
}

function newGame() {
  engineGeneration++;
  game = new Chess();
  playerColor = $color?.value === 'b' ? 'b' : 'w';
  orientation = playerColor === 'w' ? 'white' : 'black';
  selected = null;
  targets = [];
  lastMove = null;
  thinking = false;
  playerMovedThisCycle = false;
  hidePromotionModal();
  resetHistory();
  previousFen = null;
  showAnalysisIdle(
    'Nouvelle partie. Glisse une pièce ou clique pièce puis case. Promotion : choix de la pièce.',
  );
  mentorPanel?.reset();
  refreshBoard();
  if (!isPlayerTurn()) void engineReply();
}

function bindTitleCollapse() {
  for (const toggle of document.querySelectorAll('[data-collapse]')) {
    const panel = document.getElementById(toggle.getAttribute('data-collapse') ?? '');
    if (!panel) continue;
    const sync = () => {
      const open = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.classList.toggle('is-collapsed', !open);
    };
    sync();
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
      sync();
    });
  }
}

async function init() {
  bindTitleCollapse();

  // Hover sur un nom de case → illumination sur l'échiquier
  const positionPanel = document.getElementById('positionalPanel');
  positionPanel?.addEventListener('mouseover', (e) => {
    const link = /** @type {HTMLElement | null} */ (e.target)?.closest?.('.sq-link');
    if (!link) return;
    const sq = link.dataset.sq;
    if (!sq) return;
    const cell = document.querySelector(`#playBoard [data-square="${sq}"]`);
    if (cell) cell.classList.add('fen-board__sq--glow');
  });
  positionPanel?.addEventListener('mouseout', (e) => {
    const link = /** @type {HTMLElement | null} */ (e.target)?.closest?.('.sq-link');
    if (!link) return;
    const sq = link.dataset.sq;
    if (!sq) return;
    const cell = document.querySelector(`#playBoard [data-square="${sq}"]`);
    if (cell) cell.classList.remove('fen-board__sq--glow');
  });
  positionPanel?.addEventListener('mouseleave', () => {
    for (const cell of document.querySelectorAll('#playBoard .fen-board__sq--glow')) {
      cell.classList.remove('fen-board__sq--glow');
    }
  });

  $btnEngineDebug?.addEventListener('click', () => {
    debugMode = !debugMode;
    localStorage.setItem(ENGINE_DEBUG_KEY, debugMode ? '1' : '0');
    refreshAnalysisUI();
  });

  if ($btnHeatmap) {
    $btnHeatmap.setAttribute('aria-pressed', showHeatmap ? 'true' : 'false');
    $btnHeatmap.addEventListener('click', () => {
      showHeatmap = !showHeatmap;
      localStorage.setItem(HEATMAP_KEY, showHeatmap ? '1' : '0');
      $btnHeatmap.setAttribute('aria-pressed', showHeatmap ? 'true' : 'false');
      try {
        refreshBoard();
      } catch (e) {
        showHeatmap = false;
        localStorage.setItem(HEATMAP_KEY, '0');
        $btnHeatmap.setAttribute('aria-pressed', 'false');
        console.error(e);
        $status.textContent = e?.message ?? String(e);
      }
    });
  }

  if ($boardTheme) {
    if ([...$boardTheme.options].some((o) => o.value === boardTheme)) {
      $boardTheme.value = boardTheme;
    }
    $boardTheme.addEventListener('change', () => {
      boardTheme = $boardTheme.value;
      localStorage.setItem(BOARD_THEME_KEY, boardTheme);
      refreshBoard();
    });
  }

  bindPlayBoardInput($board, {
    canInteract,
    playerColor: () => playerColor,
    getPiece: (sq) => game.get(sq),
    onSquareClick,
    onDragStart,
    onDrop,
    onDragCancel,
  });

  $btnNew?.addEventListener('click', newGame);
  $btnUndo?.addEventListener('click', undoMove);
  $btnRedo?.addEventListener('click', redoMove);
  $color?.addEventListener('change', newGame);
  mentorPanel = bindMentorPanel({
    getPayload: () => ({
      fen: game.fen(),
      side: playerSideLabel(),
      moves: game.history(),
    }),
    canAsk: () =>
      isPlayerTurn() && !game.isGameOver() && !thinking && !mentorPanel?.isBusy(),
    defaultQuestion: defaultMentorQuestion,
    idleMessage:
      'Pose une question ou clique « Demander au coach » à ton tour de jeu.',
  });

  $promoModal?.addEventListener('click', (e) => {
    if (e.target === $promoModal) hidePromotionModal();
  });

  game = new Chess();
  playerColor = $color?.value === 'b' ? 'b' : 'w';
  orientation = playerColor === 'w' ? 'white' : 'black';
  resetHistory();
  refreshBoard();
  refreshPositionPanel();

  $engine.textContent = 'Chargement de Stockfish…';
  const ok = await engineReady();
  if (!ok) {
    showError(
      'Stockfish introuvable. Reconstruis l\'image web : podman compose -f compose.yaml build web',
    );
    showAnalysisIdle(
      'Échiquier actif en mode local ; le moteur est indisponible. Rebuild : podman compose -f compose.yaml build web',
    );
    return;
  }
  $engine.textContent = 'Moteur prêt';
  showAnalysisIdle(conseilIdleText());
  refreshAnalysisUI();

  mentorPanel.setQuestionPlaceholder();
  await mentorPanel.checkHealth();
  mentorPanel.updateButton();

  if (!isPlayerTurn()) void engineReply();
}

init().catch((e) => showError(e?.message ?? String(e)));
