/**
 * Serveur du coach (remplace llm-factory) — écoute sur :8000, derrière le proxy nginx.
 *
 *   POST /api/chess/mentor/groq   { fen, side, moves, question } → { ok, advice, ... }
 *   GET  /health
 */

import { appendFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { askCoach } from './coach.mjs';
import { loadEnv } from './env.mjs';
import { llmConfig } from './llm.mjs';
import { UciEngine } from './uci-engine.mjs';

loadEnv();
const PORT = Number(process.env.COACH_PORT || 8000);
const HOST = process.env.COACH_HOST || '0.0.0.0';
// Journal des consultations (une ligne JSON par réponse) : réponse affichée ET réponse d'origine du LLM
// (en mode anglais, avant traduction), pour relire plus tard d'où vient une erreur. Pas d'IP ici.
const ANSWER_LOG = process.env.COACH_ANSWER_LOG || 'logs/coach-answers.jsonl';
async function logAnswer(payload, result) {
  const entry = {
    at: new Date().toISOString(), lang: process.env.COACH_LANG || 'fr', answer: process.env.COACH_ANSWER || null,
    model: `${cfg.provider}/${cfg.model}`, fen: payload.fen, side: payload.side, moves: payload.moves ?? [], question: payload.question,
    advice: result.advice, adviceWorking: result.adviceWorking ?? null, adviceCited: result.adviceCited ?? null,
    problems: result.problems, revised: result.revised, timings: result.timings,
  };
  try {
    await mkdir(ANSWER_LOG.replace(/\/[^/]*$/, ''), { recursive: true });
    await appendFile(ANSWER_LOG, `${JSON.stringify(entry)}\n`);
  } catch (e) {
    console.error('[coach] journal impossible', e.message);
  }
}
const cfg = llmConfig();
const engine = new UciEngine();

// Protection d'un service public : requêtes par visiteur et analyses simultanées limitées.
const RATE_MAX = Number(process.env.COACH_RATE_MAX || 12); // requêtes par fenêtre et par visiteur
const RATE_WINDOW_MS = Number(process.env.COACH_RATE_WINDOW_S || 600) * 1000;
const MAX_CONCURRENT = Number(process.env.COACH_MAX_CONCURRENT || 2);
/** @type {Map<string, number[]>} */
const hits = new Map();
let running = 0;

/** Adresse du visiteur : en-tête X-Real-IP posé par nginx, sinon l'adresse de la connexion. */
function clientIp(req) {
  return String(req.headers['x-real-ip'] || req.socket.remoteAddress || '?');
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_MAX) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

/** @param {import('node:http').ServerResponse} res @param {number} status @param {unknown} body */
function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

/** @param {import('node:http').IncomingMessage} req */
async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 100_000) throw new Error('Requête trop volumineuse');
  }
  return JSON.parse(body || '{}');
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method === 'GET' && url.pathname === '/health') {
    return send(res, 200, { ok: true, provider: cfg.provider, model: cfg.model });
  }
  if (req.method !== 'POST' || !url.pathname.startsWith('/api/chess/mentor/')) {
    return send(res, 404, { ok: false, error: 'Not found' });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return send(res, 429, { ok: false, error: `Trop de questions : ${RATE_MAX} par ${Math.round(RATE_WINDOW_MS / 60000)} minutes. Réessaie un peu plus tard.` });
  }
  if (running >= MAX_CONCURRENT) {
    return send(res, 503, { ok: false, error: 'Le coach est très sollicité, réessaie dans quelques secondes.' });
  }

  let payload;
  try {
    payload = await readJson(req);
  } catch (e) {
    return send(res, 400, { ok: false, error: String(e?.message ?? e) });
  }
  if (typeof payload.fen !== 'string' || payload.fen.split(' ').length < 4) {
    return send(res, 400, { ok: false, error: 'FEN manquante ou invalide' });
  }

  running++;
  try {
    const result = await askCoach({ ...payload, engine, cfg });
    console.log(
      `[coach] ${ip} via ${req.socket.remoteAddress} — ${cfg.provider}/${cfg.model} contexte ${result.timings.context} ms, LLM ${result.timings.llm} ms` +
      (result.ungrounded.length ? `, coups hors contexte : ${result.ungrounded.join(' ')}` : ''),
    );
    await logAnswer(payload, result);
    return send(res, 200, { ok: true, ...result });
  } catch (e) {
    console.error('[coach] erreur', e);
    return send(res, 502, { ok: false, error: String(e?.message ?? e) });
  } finally {
    running--;
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[coach] http://${HOST}:${PORT} — ${cfg.provider} / ${cfg.model}`);
});
