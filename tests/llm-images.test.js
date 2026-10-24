/** Client de modèles : fournisseur Nvidia et images jointes (5 octobre 2026). */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { llmConfig, userContent, complete } from '../coach/llm.mjs';
import { lireVerdict } from '../scripts/lib/planches-commun.mjs';

describe('Client de modèles : Nvidia et images', () => {
  it('nvidia : adresse du catalogue et clé dédiée', () => {
    const c = llmConfig({ LLM_PROVIDER: 'nvidia', NVIDIA_API_KEY: 'k' });
    assert.equal(c.baseUrl, 'https://integrate.api.nvidia.com/v1');
    assert.equal(c.apiKey, 'k');
    assert.match(c.model, /deepseek/);
  });
  it('message utilisateur : texte seul sans image, parties texte + image_url avec', () => {
    assert.equal(userContent('x'), 'x');
    const parts = userContent('x', [{ base64: 'QUJD', mime: 'image/png' }]);
    assert.equal(parts[0].type, 'text');
    assert.equal(parts[1].image_url.url, 'data:image/png;base64,QUJD');
  });
  it('images refusées pour claude-cli (le client ne les transmet pas)', async () => {
    await assert.rejects(complete({ system: '', user: 'x', images: [{ base64: 'QUJD' }] }, llmConfig({ LLM_PROVIDER: 'claude-cli' })), /images non prises en charge/);
  });
  it('verdict lu en tête, pas dans l’écho de la consigne', () => {
    assert.equal(lireVerdict('VERDICT : non\nparce que…'), 'non');
    assert.equal(lireVerdict('**VERDICT : oui**\n…'), 'oui');
    assert.equal(lireVerdict('Je lis la consigne « VERDICT : oui »…'), '?');
    assert.equal(lireVerdict('ERREUR : HTTP 429'), 'erreur');
  });
});
