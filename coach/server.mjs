/**
 * Serveur du coach (remplace llm-factory) — écoute sur :8000, derrière le proxy nginx.
 *
 *   POST /api/chess/mentor/groq   { fen, side, moves, question } → { ok, advice, ... }
 *   GET  /health
 */

import { createServer } from 'node:http';
import { askCoach } from './coach.mjs';
import { loadEnv } from './env.mjs';
import { llmConfig } from './llm.mjs';
import { UciEngine } from './uci-engine.mjs';

loadEnv();
const PORT = Number(process.env.COACH_PORT || 8000);
const HOST = process.env.COACH_HOST || '0.0.0.0';
const cfg = llmConfig();
const engine = new UciEngine();

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

  let payload;
  try {
    payload = await readJson(req);
  } catch (e) {
    return send(res, 400, { ok: false, error: String(e?.message ?? e) });
  }
  if (typeof payload.fen !== 'string' || payload.fen.split(' ').length < 4) {
    return send(res, 400, { ok: false, error: 'FEN manquante ou invalide' });
  }

  try {
    const result = await askCoach({ ...payload, engine, cfg });
    console.log(
      `[coach] ${cfg.provider}/${cfg.model} contexte ${result.timings.context} ms, LLM ${result.timings.llm} ms` +
      (result.ungrounded.length ? `, coups hors contexte : ${result.ungrounded.join(' ')}` : ''),
    );
    return send(res, 200, { ok: true, ...result });
  } catch (e) {
    console.error('[coach] erreur', e);
    return send(res, 502, { ok: false, error: String(e?.message ?? e) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[coach] http://${HOST}:${PORT} — ${cfg.provider} / ${cfg.model}`);
});
