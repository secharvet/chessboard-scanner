/**
 * Lecteur d'ouvertures — front + bibliothèque PGN servie par Docker (/pgn/).
 */

import { Chess, CommentType } from 'https://esm.unpkg.com/@jackstenglein/chess@2.2.18?target=es2022';
import { activePaletteCodes, drawablesFromCommentDiag, PALETTE } from './board-drawables.js';
import {
  buildBoardDrawables,
  drawablesFromCommentText,
  drawablesFromLastMove,
} from './comment-drawables.js';
import { renderFenBoard } from './board-view.js';
import { renderPgnGraph } from './pgn-graph.js';
import { bindMentorPanel } from './mentor-ui.js';

const $commentary = document.getElementById('commentary');
const $statusFen = document.getElementById('statusFen');
const $statusPath = document.getElementById('statusPath');
const $board = document.getElementById('board');
const $boardLegend = document.getElementById('boardLegend');
const $pgnGraph = document.getElementById('pgnGraph');
const $bootError = document.getElementById('bootError');
const $catalogTypeSelect = document.getElementById('catalogTypeSelect');
const $openingSelect = document.getElementById('openingSelect');
const $studySelect = document.getElementById('studySelect');
const $chapterSelect = document.getElementById('chapterSelect');
const $versionSelect = document.getElementById('versionSelect');

/** @type {Array<{id: string, title: string, file: string, augmentedFile?: string}>} */
let catalogOpenings = [];

/** @type {Array<{id: string, studyId: string, title: string, author?: string, chapters: Array<{id: string, title: string, file: string}>}>} */
let catalogStudies = [];

const $btnStart = document.getElementById('btnStart');
const $btnPrev = document.getElementById('btnPrev');
const $btnNext = document.getElementById('btnNext');
const $btnEnd = document.getElementById('btnEnd');
const $branchMenu = document.getElementById('branchMenu');
/** @type {ReturnType<typeof bindMentorPanel> | null} */
let mentorPanel = null;

/** @type {import('@jackstenglein/chess').Chess | null} */
let chess = null;

/** @type {{ setCurrent: (move: object | null) => void, setPreview: (move: object | null | undefined) => void, destroy: () => void } | null} */
let pgnGraphApi = null;

/** Coup survolé dans le graphe (aperçu) — undefined = pas d'aperçu actif. */
let graphPreviewMove = undefined;

/** Préfixe URL des PGN une fois détecté (Podman ou serveur de dev). */
let pgnBaseUrl = '/pgn/';

function showBootError(err) {
  console.error(err);
  if ($bootError) {
    $bootError.hidden = false;
    $bootError.textContent =
      "Impossible d'initialiser l'application : " + (err?.message ?? String(err));
  }
}

function formatMoveNumber(move) {
  if (!move) return '';
  const fullmove = Math.ceil(move.ply / 2);
  const side = move.ply % 2 === 1 ? '.' : '…';
  return `${fullmove}${side}`;
}

function sanitizeText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(text) {
  return (text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function sideToMoveLabel() {
  if (!chess) return 'white';
  return chess.fen().split(' ')[1] === 'w' ? 'white' : 'black';
}

function defaultMentorQuestion() {
  return sideToMoveLabel() === 'white'
    ? 'Quel plan pour les blancs ?'
    : 'Quel plan pour les noirs ?';
}

function sanHistoryToCurrent() {
  const moves = [];
  let m = chess?.currentMove() ?? null;
  while (m) {
    moves.push(m.san);
    m = m.previous;
  }
  moves.reverse();
  return moves;
}

function currentPathLabel() {
  const m = chess.currentMove();
  if (!m) return 'Début de partie';

  const parts = [];
  let cur = m;
  let guard = 0;
  while (cur && guard++ < 5000) {
    parts.push(`${formatMoveNumber(cur)} ${cur.san}`);
    cur = cur.previous;
  }
  parts.reverse();
  return parts.join('  ');
}

function updateStatus() {
  $statusFen.textContent = chess.fen();
  $statusPath.textContent = currentPathLabel();
  mentorPanel?.setQuestionPlaceholder();
}

function getCurrentCommentText(move) {
  const after = sanitizeText(chess.getComment(CommentType.After, move));
  const before = sanitizeText(chess.getComment(CommentType.Before, move));
  return after || before || '';
}

function getDrawablesForMove(move) {
  const diag = move?.commentDiag ?? (!move ? chess.pgn?.gameComment : null) ?? null;
  return buildBoardDrawables(
    drawablesFromCommentDiag(diag),
    drawablesFromCommentText(getCurrentCommentText(move), { move }),
    drawablesFromLastMove(move),
  );
}

function getCurrentDrawables() {
  return getDrawablesForMove(chess.currentMove());
}

function fenAndDrawablesAtMove(move) {
  const saved = chess.currentMove();
  chess.seek(move ?? null);
  const fen = chess.fen();
  const drawables = getDrawablesForMove(chess.currentMove());
  chess.seek(saved);
  return { fen, drawables };
}

function updateBoardLegend(drawables) {
  if (!$boardLegend) return;
  const active = new Set(activePaletteCodes(drawables));
  const order = ['M', 'G', 'R', 'Y', 'B'];
  $boardLegend.innerHTML = order
    .map((code) => {
      const item = PALETTE[code];
      if (!item) return '';
      const on = active.has(code);
      return `<span class="board-legend__item${on ? ' board-legend__item--on' : ''}" title="${escapeHtml(item.label)}">
        <span class="board-legend__swatch board-legend__swatch--${code}"></span>
        <span class="board-legend__label">${escapeHtml(item.label)}</span>
      </span>`;
    })
    .join('');
}

function updateBoard() {
  const previewing = graphPreviewMove !== undefined;
  const { fen, drawables } = previewing
    ? fenAndDrawablesAtMove(graphPreviewMove)
    : { fen: chess.fen(), drawables: getCurrentDrawables() };
  renderFenBoard($board, fen, {
    orientation: 'white',
    drawables,
  });
  updateBoardLegend(drawables);
}

function updateCommentary() {
  const m = chess.currentMove();
  const after = sanitizeText(chess.getComment(CommentType.After, m));
  const before = sanitizeText(chess.getComment(CommentType.Before, m));

  if (!m && !after && !before) {
    $commentary.innerHTML =
      `<div class="commentary__empty">Début de partie. Clique sur <strong>Suivant</strong> ou choisis un coup dans l'arbre.</div>`;
    return;
  }

  const meta = m ? `${formatMoveNumber(m)} ${m.san}` : 'Avant le premier coup';
  const body = after || before || '— Aucun commentaire pour ce coup —';

  $commentary.innerHTML = `
    <div class="commentary__box">
      <div class="commentary__meta"><span>${escapeHtml(meta)}</span></div>
      <div>${escapeHtml(body)}</div>
    </div>
  `;
}

function isBranchPoint(move) {
  const next = chess.nextMove(move);
  return !!(next?.variations?.length);
}

function getBranchOptions(move) {
  const next = chess.nextMove(move);
  if (!next) return [];

  const options = [{ move: next }];

  for (let i = 0; i < (next.variations || []).length; i++) {
    const v = next.variations[i];
    if (!v?.length) continue;
    options.push({ move: v[0] });
  }
  return options;
}

function showBranchMenu(move) {
  const options = getBranchOptions(move);
  if (options.length <= 1) {
    $branchMenu.hidden = true;
    $branchMenu.innerHTML = '';
    return false;
  }

  $branchMenu.innerHTML = '';
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'branch-btn';
    btn.type = 'button';
    btn.textContent = opt.move?.san || '?';
    btn.addEventListener('click', () => {
      chess.seek(opt.move);
      $branchMenu.hidden = true;
      $branchMenu.innerHTML = '';
      refreshUI();
    });
    $branchMenu.appendChild(btn);
  }

  $branchMenu.hidden = false;
  return true;
}

function hideBranchMenu() {
  $branchMenu.hidden = true;
  $branchMenu.innerHTML = '';
}

function seek(moveOrNull) {
  chess.seek(moveOrNull);
  refreshUI();
}

function seekStart() {
  seek(null);
}

function seekPrev() {
  const cur = chess.currentMove();
  if (!cur) return;
  seek(chess.previousMove(cur));
}

function seekNext() {
  const cur = chess.currentMove();
  if (showBranchMenu(cur)) return;

  const next = chess.nextMove(cur);
  if (!next) return;
  seek(next);
}

function seekEnd() {
  let cur = chess.currentMove();
  let guard = 0;
  while (guard++ < 2000) {
    const next = chess.nextMove(cur);
    if (!next) break;
    if (next.variations?.length) break;
    cur = next;
  }
  seek(cur);
  showBranchMenu(cur);
}

function updateNavButtons() {
  const cur = chess.currentMove();
  const next = chess.nextMove(cur);
  $btnStart.disabled = !cur;
  $btnPrev.disabled = !cur;
  $btnNext.disabled = !next && !isBranchPoint(cur);
  $btnEnd.disabled = !next;
}

function onGraphPreview(move) {
  if (!chess) return;
  graphPreviewMove = move;
  pgnGraphApi?.setPreview(move);
  updateBoard();
}

function onGraphPreviewEnd() {
  if (!chess || graphPreviewMove === undefined) return;
  graphPreviewMove = undefined;
  pgnGraphApi?.setPreview(undefined);
  updateBoard();
}

function onGraphSelect(move) {
  if (!chess) return;
  graphPreviewMove = undefined;
  chess.seek(move ?? null);
  hideBranchMenu();
  updateBoard();
  updateStatus();
  updateCommentary();
  updateNavButtons();
  pgnGraphApi?.setPreview(undefined);
  pgnGraphApi?.setCurrent(move);
}

function renderGraph() {
  if (!$pgnGraph || !chess) return;
  pgnGraphApi?.destroy?.();
  graphPreviewMove = undefined;
  pgnGraphApi = renderPgnGraph($pgnGraph, chess, {
    currentMove: chess.currentMove(),
    onPreview: onGraphPreview,
    onPreviewEnd: onGraphPreviewEnd,
    onSelect: onGraphSelect,
  });
}

function refreshUI() {
  updateBoard();
  updateStatus();
  updateCommentary();
  renderGraph();
  updateNavButtons();
  mentorPanel?.updateButton();
}

function wireControls() {
  $btnStart.addEventListener('click', seekStart);
  $btnPrev.addEventListener('click', seekPrev);
  $btnNext.addEventListener('click', seekNext);
  $btnEnd.addEventListener('click', seekEnd);
}

async function fetchCatalog() {
  const candidates = [
    { catalog: '/pgn/catalog.json', base: '/pgn/' },
    { catalog: 'data/pgn/catalog.json', base: 'data/pgn/' },
  ];

  for (const { catalog, base } of candidates) {
    try {
      const res = await fetch(catalog);
      if (res.ok) {
        pgnBaseUrl = base;
        return res.json();
      }
    } catch {
      /* essai suivant */
    }
  }

  throw new Error(
    'Catalogue PGN introuvable. Exécute ./scripts/collect-pgn.sh puis ouvre http://localhost:8080 (Podman).',
  );
}

async function fetchPgnText(filename) {
  const url = `${pgnBaseUrl}${encodeURIComponent(filename)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fichier PGN introuvable : ${filename} (${res.status})`);
  }
  return res.text();
}

function getOpeningById(id) {
  return catalogOpenings.find((o) => o.id === id);
}

function getStudyById(id) {
  return catalogStudies.find((s) => s.id === id);
}

function isStudyCatalogMode() {
  return $catalogTypeSelect?.value === 'studies';
}

function updateCatalogTypeLabels(stats = {}) {
  if (!$catalogTypeSelect) return;
  const openingCount = stats.openingCount ?? catalogOpenings.length;
  const studyCount = stats.studyCount ?? catalogStudies.length;
  const chapterCount = stats.chapterCount ?? catalogStudies.reduce((n, s) => n + (s.chapters?.length ?? 0), 0);
  for (const opt of $catalogTypeSelect.options) {
    if (opt.value === 'openings') {
      opt.textContent = `Ouvertures classiques (${openingCount})`;
    } else if (opt.value === 'studies') {
      opt.textContent = `Études Lichess (${studyCount} · ${chapterCount} ch.)`;
    }
  }
}

function setCatalogMode(mode) {
  const studies = mode === 'studies';
  if ($openingSelect) $openingSelect.hidden = studies;
  if ($studySelect) $studySelect.hidden = !studies;
  if ($chapterSelect) $chapterSelect.hidden = !studies;
  if ($versionSelect) $versionSelect.hidden = studies;
}

function populateStudySelect() {
  if (!$studySelect) return;
  $studySelect.innerHTML = '';
  for (const study of catalogStudies) {
    const opt = document.createElement('option');
    opt.value = study.id;
    const author = study.author ? `${study.author} — ` : '';
    const chapters = study.chapterCount ?? study.chapters?.length ?? 0;
    opt.textContent = `${author}${study.title} (${chapters} ch.)`;
    $studySelect.appendChild(opt);
  }
}

function populateChapterSelect(study) {
  if (!$chapterSelect) return;
  $chapterSelect.innerHTML = '';
  if (!study?.chapters?.length) return;
  for (const chapter of study.chapters) {
    const opt = document.createElement('option');
    opt.value = chapter.id;
    const plies = chapter.plies != null ? ` — ${chapter.plies} coups` : '';
    opt.textContent = `${chapter.title}${plies}`;
    $chapterSelect.appendChild(opt);
  }
}

function updateVersionSelect(opening) {
  const hasAugmented = Boolean(opening?.augmentedFile);
  $versionSelect.disabled = !hasAugmented;
  $versionSelect.innerHTML = '<option value="original">Originale</option>';
  if (hasAugmented) {
    const opt = document.createElement('option');
    opt.value = 'augmented';
    opt.textContent = 'Commentée';
    $versionSelect.appendChild(opt);
  }
}

function resolvePgnFilename(opening) {
  if ($versionSelect.value === 'augmented' && opening?.augmentedFile) {
    return opening.augmentedFile;
  }
  return opening.file;
}

function populateOpeningSelect(openings) {
  catalogOpenings = openings;
  $openingSelect.innerHTML = '';
  for (const opening of openings) {
    const opt = document.createElement('option');
    opt.value = opening.id;
    const plies = opening.plies != null ? `${opening.plies} demi-coups` : '';
    const aug = opening.augmentedFile ? ' • commentée dispo' : '';
    opt.textContent = plies ? `${opening.title} — ${plies}${aug}` : opening.title;
    $openingSelect.appendChild(opt);
  }
}

async function loadCurrentOpening() {
  if (isStudyCatalogMode()) {
    await loadCurrentStudyChapter();
    return;
  }
  const opening = getOpeningById($openingSelect.value);
  if (!opening) {
    throw new Error('Ouverture introuvable dans le catalogue.');
  }
  await loadOpeningFile(resolvePgnFilename(opening));
}

async function loadCurrentStudyChapter() {
  const study = getStudyById($studySelect?.value);
  if (!study) {
    throw new Error('Étude introuvable dans le catalogue.');
  }
  const chapter = study.chapters?.find((c) => c.id === $chapterSelect?.value) ?? study.chapters?.[0];
  if (!chapter?.file) {
    throw new Error('Chapitre introuvable dans cette étude.');
  }
  await loadOpeningFile(chapter.file);
}

function loadPgnText(pgnText) {
  mentorPanel?.cancel();
  chess = new Chess({ pgn: pgnText });
  chess.seek(null, true);
  if (!chess.history()?.length) {
    throw new Error(
      'PGN non chargé : coup illégal ou notation ambiguë (ex. deux cavaliers pouvant aller sur la même case). ' +
        'Le catalogue peut afficher un nombre de coups, mais le moteur rejette la ligne.',
    );
  }
  hideBranchMenu();
  mentorPanel?.reset();
  refreshUI();
}

async function loadOpeningFile(filename) {
  const text = await fetchPgnText(filename);
  loadPgnText(text);
}

async function init() {
  wireControls();
  mentorPanel = bindMentorPanel({
    getPayload: () => ({
      fen: chess.fen(),
      side: sideToMoveLabel(),
      moves: sanHistoryToCurrent(),
    }),
    canAsk: () => Boolean(chess) && !mentorPanel?.isBusy(),
    defaultQuestion: defaultMentorQuestion,
    idleMessage:
      'Navigue dans la variante puis demande un plan pour la position affichée.',
  });
  $openingSelect.disabled = true;
  $versionSelect.disabled = true;
  if ($studySelect) $studySelect.disabled = true;
  if ($chapterSelect) $chapterSelect.disabled = true;

  const catalog = await fetchCatalog();
  catalogOpenings = catalog.openings ?? [];
  catalogStudies = catalog.studies ?? [];

  if (!catalogOpenings.length && !catalogStudies.length) {
    throw new Error('Le catalogue est vide. Exécute ./scripts/collect-pgn.sh');
  }

  updateCatalogTypeLabels(catalog.stats);
  populateOpeningSelect(catalogOpenings);
  populateStudySelect();

  $openingSelect.disabled = false;
  if ($studySelect) $studySelect.disabled = false;
  if ($chapterSelect) $chapterSelect.disabled = false;

  if (catalogStudies.length) {
    $catalogTypeSelect.value = 'studies';
  } else if (catalogOpenings.length) {
    $catalogTypeSelect.value = 'openings';
  }

  setCatalogMode($catalogTypeSelect.value);
  if ($catalogTypeSelect.value === 'studies') {
    const firstStudy = getStudyById($studySelect.value) ?? catalogStudies[0];
    populateChapterSelect(firstStudy);
  } else {
    updateVersionSelect(getOpeningById($openingSelect.value));
  }

  $catalogTypeSelect?.addEventListener('change', () => {
    setCatalogMode($catalogTypeSelect.value);
    if (isStudyCatalogMode()) {
      populateChapterSelect(getStudyById($studySelect.value));
    } else {
      updateVersionSelect(getOpeningById($openingSelect.value));
    }
    loadCurrentOpening().catch(showBootError);
  });

  $openingSelect.addEventListener('change', () => {
    updateVersionSelect(getOpeningById($openingSelect.value));
    $versionSelect.value = 'original';
    loadCurrentOpening().catch(showBootError);
  });

  $studySelect?.addEventListener('change', () => {
    populateChapterSelect(getStudyById($studySelect.value));
    loadCurrentOpening().catch(showBootError);
  });

  $chapterSelect?.addEventListener('change', () => {
    loadCurrentOpening().catch(showBootError);
  });

  $versionSelect.addEventListener('change', () => {
    loadCurrentOpening().catch(showBootError);
  });

  await loadCurrentOpening();

  mentorPanel.setQuestionPlaceholder();
  await mentorPanel.checkHealth();
  mentorPanel.updateButton();
}

init().catch(showBootError);
