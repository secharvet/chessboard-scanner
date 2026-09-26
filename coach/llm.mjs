/**
 * Fournisseurs LLM : claude-cli (abonnement local), deepseek / openai-compatible, anthropic.
 *
 * Variables d'environnement :
 *   LLM_PROVIDER   claude-cli | deepseek | openai | anthropic   (défaut : claude-cli)
 *   LLM_MODEL      ex. sonnet, deepseek-flash, claude-sonnet-5
 *   LLM_API_KEY    clé API (sauf claude-cli)
 *   LLM_BASE_URL   pour un endpoint compatible OpenAI
 */

import { spawn } from 'node:child_process';

const DEFAULTS = {
  'claude-cli': { model: 'sonnet' },
  deepseek: { model: 'deepseek-flash', baseUrl: 'https://api.deepseek.com' },
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
    apiKey: env.LLM_API_KEY || '',
    baseUrl: env.LLM_BASE_URL || d.baseUrl,
  };
}

/**
 * @param {{ system: string, user: string }} prompt
 * @param {ReturnType<typeof llmConfig>} cfg
 * @returns {Promise<string>}
 */
export async function complete(prompt, cfg = llmConfig()) {
  switch (cfg.provider) {
    case 'claude-cli':
      return claudeCli(prompt, cfg);
    case 'anthropic':
      return anthropic(prompt, cfg);
    default:
      return openAiCompatible(prompt, cfg);
  }
}

/** Claude Code en mode non interactif, sans outils ni configuration locale. */
function claudeCli({ system, user }, cfg) {
  const args = [
    '-p', '--output-format', 'json', '--model', cfg.model,
    '--system-prompt', system,
    '--tools', '', '--no-session-persistence', '--strict-mcp-config', '--setting-sources', '',
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

async function openAiCompatible({ system, user }, cfg) {
  if (!cfg.apiKey) throw new Error(`LLM_API_KEY manquante pour ${cfg.provider}`);
  const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.3,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${cfg.provider} HTTP ${res.status} : ${data?.error?.message ?? ''}`);
  return String(data.choices?.[0]?.message?.content ?? '').trim();
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
