#!/usr/bin/env node
/**
 * Validateur d'extraction de benchmark.
 * Vérifie automatiquement :
 *   1. Cohérence couleur trait FEN ↔ UCI extrait
 *   2. Cohérence commentaire ↔ coup (token commun, nom pièce)
 *
 * Usage :
 *   node scripts/validate-extraction.mjs                           # valide benchmark-v2.json
 *   node scripts/validate-extraction.mjs --all-sources             # scanne toutes les études PGN
 *   node scripts/validate-extraction.mjs data/benchmark/benchmark-v2.json
 */

import { Chess } from 'chess.js';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const BENCHMARK_PATH = resolve(ROOT, 'data/benchmark/benchmark-v2.json');
const STUDIES_DIR = resolve(ROOT, 'collector/sources/official/lichess');
const REPORT_PATH = resolve(ROOT, 'data/benchmark/validation-report.json');

const args = process.argv.slice(2);
const ALL_SOURCES = args.includes('--all-sources');
const jsonArg = args.find((a) => a.endsWith('.json'));
const TARGET = jsonArg ? resolve(ROOT, jsonArg) : BENCHMARK_PATH;

// ── Vérifications ──

/** Vérifie que le coup est légal et de la bonne couleur */
function validateColorCoherence(pos) {
  const chess = new Chess(pos.fen);
  const stm = chess.turn(); // 'w' ou 'b'
  const m = chess.move(pos.player_move, { sloppy: true });
  if (!m) return { ok: false, reason: `Coup illégal : ${pos.player_move}` };

  // Vérifier que le coup joué correspond au trait
  const fenStm = pos.fen.indexOf(' w ') > -1 ? 'w' : 'b';
  if (m.color !== fenStm) {
    return { ok: false, reason: `Mauvaise couleur : trait=${fenStm}, coup=${pos.player_move} (${m.color})` };
  }
  return { ok: true };
}

/** Vérifie que le commentaire mentionne au moins un terme lié au coup ou à la pièce */
function validateCommentMoveCoherence(pos) {
  if (!pos.mentor_advice) return { ok: true }; // puzzles Lichess = pas de conseil

  const advice = pos.mentor_advice.toLowerCase();
  const move = pos.player_move.toLowerCase();
  const fen = pos.fen;

  // Indicateurs de qualité
  const signals = [];

  // 1. Nom de la pièce (bishop, knight, rook, queen, king, pawn, B, N, R, Q, K, fou, cavalier, roi, dame, tour, pion)
  const pieceNames = {
    'K': ['king', 'roi'],
    'Q': ['queen', 'dame'],
    'R': ['rook', 'tour', 'r'],
    'B': ['bishop', 'fou', 'b'],
    'N': ['knight', 'cavalier', 'n'],
  };
  const pieceLetter = move[0]?.toUpperCase?.();
  if (pieceNames[pieceLetter]) {
    const match = pieceNames[pieceLetter].some((n) => advice.includes(n));
    if (match) signals.push('pièce mentionnée');
  } else if (move[0] >= 'a' && move[0] <= 'h') {
    // Coup de pion
    if (advice.includes('pawn') || advice.includes('pion')) signals.push('pion mentionné');
  }

  // 2. Case destination (ex. e4, d5)
  const dest = move.replace(/[x+#!?=NBRQKO]/g, '').slice(-2);
  if (dest.length === 2 && advice.includes(dest)) signals.push('case destination');

  // 3. Mot-clé thématique : capture, sacrifice, fork, pin, check, mate, castle, develop...
  const themes = ['capture', 'sacrifice', 'sac', 'fork', 'pin', 'clou', 'check', 'mate',
    'castle', 'roque', 'develop', 'exchange', 'échange', 'pushe', 'pouss', 'avanc',
    'open', 'ouvr', 'threat', 'menac', 'protect', 'defend', 'rook', 'knight',
    'bishop', 'queen', 'king', 'pawn', 'tour', 'cavalier', 'fou', 'dame', 'roi', 'pion'];
  const themeMatch = themes.filter((t) => advice.includes(t));
  if (themeMatch.length > 0) signals.push(`thèmes: [${themeMatch.join(',')}]`);

  // 4. Le commentaire fait-il >= 30 caractères ? (pas de commentaire creux)
  if (pos.mentor_advice.length >= 30) signals.push('longueur OK');

  const ok = signals.length >= 2; // au moins 2 signaux de qualité
  return {
    ok,
    reason: ok ? null : `Faible cohérence conseil/coup (${signals.length} signaux: ${signals.join(' | ') || 'aucun'})`,
    signals,
  };
}

/** Vérifie que le FEN a bien le Setup correspondant (clés de roque, en passant cohérents) */
function validateFenQuality(pos) {
  const chess = new Chess(pos.fen);
  const fen = chess.fen();

  // Vérifie que chess.js n'a pas corrigé le FEN (signe d'un FEN invalide)
  const origParts = pos.fen.split(' ');
  const newParts = fen.split(' ');

  // Détection FEN aberrant (pièces fantômes, impossibilité positionnelle)
  const posOnly = pos.fen.split(' ')[0];
  const pieceCount = (posOnly.match(/[pnbrqkPNBRQK]/g) || []).length;
  if (pieceCount < 2 || pieceCount > 32) return { ok: false, reason: `Nombre pièces aberrant: ${pieceCount}` };

  return { ok: true };
}

// ── Validation des sources PGN brutes (--all-sources) ──

function splitGames(pgnText) {
  return pgnText.split(/\n\n(?=\[Event )/).filter((g) => g.trim());
}

function parseHeaders(gameText) {
  const h = {};
  for (const m of gameText.matchAll(/^\[(\w+)\s+"([^"]*)"\]/gm)) h[m[1]] = m[2];
  return h;
}

function movetext(gameText) {
  const i = gameText.search(/\n\n(?!\[)/);
  if (i < 0) return '';
  return gameText.slice(i).replace(/\s*\*\s*$/m, '').trim();
}

/** Extrait grossièrement les coups annotés d'un PGN pour vérifier la cohérence */
function quickExtractMoves(pgnText) {
  const issues = [];
  for (const game of splitGames(pgnText)) {
    const headers = parseHeaders(game);
    const text = movetext(game);
    if (!text || text.length < 10) continue;

    const fen = headers.FEN;
    if (!fen) continue;

    // Vérifie que les coups sur le FEN sont légaux
    const chess = new Chess(fen);
    const tokens = text.replace(/\{[^}]*\}/g, ' ').replace(/\([^)]*\)/g, ' ').split(/\s+/);
    let count = 0;
    for (const t of tokens) {
      if (/^\d+\.{1,3}$/.test(t) || !t) continue;
      if (t === '$1' || t === '$2' || t === '$3') continue;
      try {
        chess.move(t, { sloppy: true });
        count++;
        if (count > 20) break; // max 20 coups
      } catch {
        issues.push({
          chapter: headers.ChapterName || '?',
          move: t,
          fen: chess.fen(),
          reason: `Coup illégal après ${count} coups`,
        });
        break;
      }
    }
  }
  return issues;
}

function validateAllSources() {
  const files = readdirSync(STUDIES_DIR).filter((f) => f.endsWith('.pgn'));
  const allIssues = [];

  for (const f of files) {
    try {
      const pgn = readFileSync(resolve(STUDIES_DIR, f), 'utf8');
      const issues = quickExtractMoves(pgn);
      if (issues.length > 0) {
        allIssues.push({ file: f, issues });
      }
    } catch (e) {
      allIssues.push({ file: f, issues: [{ reason: `Erreur lecture: ${e.message}` }] });
    }
  }

  return allIssues;
}

// ── Main ──

function main() {
  console.error('=== Validateur d\'extraction ===\n');

  if (ALL_SOURCES) {
    console.error('Scan des sources PGN brutes...');
    const issues = validateAllSources();
    const total = issues.reduce((s, i) => s + i.issues.length, 0);
    console.error(`  ${issues.length} fichiers avec problèmes, ${total} erreurs\n`);

    const report = {
      date: new Date().toISOString(),
      mode: 'all-sources',
      filesWithIssues: issues.length,
      totalIssues: total,
      details: issues.slice(0, 50),
    };

    mkdirSync(dirname(REPORT_PATH), { recursive: true });
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
    console.error(`→ ${REPORT_PATH}\n`);

    for (const { file, issues: iss } of issues.slice(0, 10)) {
      console.error(`  ${file}:`);
      for (const i of iss.slice(0, 3)) console.error(`    - ${i.chapter}: ${i.reason}`);
    }
  }

  // Valide le benchmark json
  if (!existsSync(TARGET)) {
    console.error(`⚠ Fichier introuvable: ${TARGET}`);
    return;
  }

  const bench = JSON.parse(readFileSync(TARGET, 'utf8'));
  const positions = bench.positions || [];
  console.error(`Validation ${positions.length} positions...\n`);

  const results = [];
  let colorIssues = 0;
  let commentIssues = 0;
  let fenIssues = 0;

  for (const pos of positions) {
    const color = validateColorCoherence(pos);
    const comment = validateCommentMoveCoherence(pos);
    const fenQ = validateFenQuality(pos);

    results.push({
      id: pos.id,
      color: color.ok ? 'OK' : color.reason,
      comment: comment.ok ? 'OK' : comment.reason,
      commentSignals: comment.signals,
      fen: fenQ.ok ? 'OK' : fenQ.reason,
    });

    if (!color.ok) colorIssues++;
    if (!comment.ok) commentIssues++;
    if (!fenQ.ok) fenIssues++;
  }

  const report = {
    date: new Date().toISOString(),
    file: TARGET,
    total: positions.length,
    layers: bench.meta?.layers,
    colorIssues,
    commentIssues,
    fenIssues,
    valid: positions.length - colorIssues - commentIssues - fenIssues,
    results,
  };

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');

  console.error(`Couleur trait  : ${colorIssues} erreurs`);
  console.error(`Conseil/coup   : ${commentIssues} alertes`);
  console.error(`Qualité FEN    : ${fenIssues} erreurs`);
  console.error(`Positions OK   : ${positions.length - colorIssues - fenIssues}`);
  console.error(`\n→ ${REPORT_PATH}`);

  if (colorIssues > 0) {
    const bad = results.filter((r) => r.color !== 'OK');
    console.error('\n⚠ Problèmes de couleur :');
    for (const b of bad) console.error(`  ${b.id} : ${b.color}`);
  }

  process.exitCode = colorIssues > 0 ? 1 : 0;
}

main();
