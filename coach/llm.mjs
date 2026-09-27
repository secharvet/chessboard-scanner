/**
 * Fournisseurs LLM : claude-cli (abonnement local), deepseek / openai-compatible, anthropic.
 *
 * Variables d'environnement :
 *   LLM_PROVIDER   claude-cli | deepseek | groq | openai | anthropic   (défaut : claude-cli)
 *   LLM_MODEL      ex. sonnet, deepseek-flash, claude-sonnet-5
 *   LLM_API_KEY    clé API (sauf claude-cli) ; GROQ_API_KEY prioritaire pour groq
 *   LLM_BASE_URL   pour un endpoint compatible OpenAI
 *   LLM_EFFORT     claude-cli : low | medium | high | max (optionnel)
 *
 * complete(prompt, cfg, { think }) règle la réflexion quand le fournisseur le permet :
 *   think = false | 'none' → désactivée ; 'low' | 'high' | 'max' → niveau d'effort ; true → défaut du modèle.
 * DeepSeek (doc « Thinking Mode ») : reasoning_effort ET thinking {type: enabled|disabled} ensemble.
 */

import { spawn } from 'node:child_process';

const DEFAULTS = {
  'claude-cli': { model: 'sonnet' },
  deepseek: { model: 'deepseek-flash', baseUrl: 'https://api.deepseek.com' },
  groq: { model: 'openai/gpt-oss-120b', baseUrl: 'https://api.groq.com/openai/v1' },
  openai: { model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
  anthropic: { model: 'claude-sonnet-5', baseUrl: 'https://api.anthropic.com' },
};

export function llmConfig(env = process.env) {
  const provider = env.LLM_PROVIDER || 'claude-cli';
  const d = DEFAULTS[provider];
  if (!d) throw new Error(`LLM_PROVIDER inconnu : ${provider}`);
  return {
    provider,
    model: env.LLM_MODEL || d.model,
    apiKey: (provider === 'groq' ? env.GROQ_API_KEY : '') || env.LLM_API_KEY || '',
    baseUrl: env.LLM_BASE_URL || d.baseUrl,
    effort: env.LLM_EFFORT || '',
  };
}

/**
 * @param {{ system: string, user: string }} prompt
 * @param {ReturnType<typeof llmConfig>} cfg
 * @returns {Promise<string>}
 */
export async function complete(prompt, cfg = llmConfig(), opts = {}) {
  switch (cfg.provider) {
    case 'claude-cli':
      return claudeCli(prompt, opts.think === false || opts.think === 'none' || opts.think === 'low' ? { ...cfg, effort: 'low' } : cfg);
    case 'anthropic':
      return anthropic(prompt, cfg);
    default:
      return openAiCompatible(prompt, cfg, opts);
  }
}

/** Claude Code en mode non interactif, sans outils ni configuration locale. */
function claudeCli({ system, user }, cfg) {
  const args = [
    '-p', '--output-format', 'json', '--model', cfg.model,
    '--system-prompt', system,
    '--tools', '', '--no-session-persistence', '--strict-mcp-config', '--setting-sources', '',
    ...(cfg.effort ? ['--effort', cfg.effort] : []),
  ];
  return new Promise((resolve, reject) => {
    const proc = spawn(process.env.CLAUDE_BIN || 'claude', args, {
      cwd: '/tmp', stdio: ['pipe', 'pipe', 'pipe'],
    });
    let out = '';
    let err = '';
    const timer = setTimeout(() => proc.kill('SIGTERM'), 180_000);
    proc.stdout.on('data', (b) => { out += b; });
    proc.stderr.on('data', (b) => { err += b; });
    proc.on('error', reject);
    proc.on('close', (code) => {
      clearTimeout(timer);
      try {
        const json = JSON.parse(out);
        if (json.is_error) return reject(new Error(json.result || 'claude-cli : erreur'));
        resolve(String(json.result ?? '').trim());
      } catch {
        reject(new Error(`claude-cli (code ${code}) : ${(err || out).slice(0, 400)}`));
      }
    });
    proc.stdin.end(user);
  });
}

async function openAiCompatible(prompt, cfg, opts = {}) {
  // Limite de débit (429) ou panne passagère (5xx) : on attend le délai annoncé et on réessaie.
  for (let attempt = 0; ; attempt++) {
    try {
      return await openAiOnce(prompt, cfg, opts);
    } catch (e) {
      const status = e.status ?? 0;
      if (attempt >= 6 || !(status === 429 || status >= 500)) throw e;
      const wait = e.retryAfter ?? Math.min(60, 5 * 2 ** attempt);
      console.error(`[llm] ${cfg.provider} ${status} : nouvel essai dans ${wait.toFixed(0)} s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  }
}

async function openAiOnce({ system, user }, cfg, opts = {}) {
  if (!cfg.apiKey) throw new Error(`LLM_API_KEY manquante pour ${cfg.provider}`);
  const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.3, // ignorée par DeepSeek en mode réflexion
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      ...thinkingParams(cfg, opts.think),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`${cfg.provider} HTTP ${res.status} : ${data?.error?.message ?? ''}`);
    err.status = res.status;
    // Délai : en-tête retry-after, ou « try again in 12.5s » dans le message.
    const header = Number(res.headers.get('retry-after'));
    const inMsg = String(data?.error?.message ?? '').match(/try again in ([\d.]+)(ms|s|m)/i);
    err.retryAfter = Number.isFinite(header) && header > 0 ? header
      : inMsg ? Number(inMsg[1]) * (inMsg[2] === 'ms' ? 0.001 : inMsg[2] === 'm' ? 60 : 1) + 1 : undefined;
    throw err;
  }
  return String(data.choices?.[0]?.message?.content ?? '').trim();
}

/** Paramètres de réflexion propres au fournisseur. */
function thinkingParams(cfg, think) {
  const off = think === false || think === 'none';
  const level = typeof think === 'string' && think !== 'none' ? think : null;
  if (cfg.provider === 'deepseek') {
    if (off) return { thinking: { type: 'disabled' } };
    return level ? { thinking: { type: 'enabled' }, reasoning_effort: level } : {};
  }
  if (cfg.provider === 'groq' && /gpt-oss/.test(cfg.model)) {
    return { reasoning_effort: off || level === 'low' ? 'low' : level === 'max' ? 'high' : 'medium' };
  }
  return {};
}

async function anthropic({ system, user }, cfg) {
  if (!cfg.apiKey) throw new Error('LLM_API_KEY manquante pour anthropic');
  const res = await fetch(`${cfg.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`anthropic HTTP ${res.status} : ${data?.error?.message ?? ''}`);
  return data.content?.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
}
