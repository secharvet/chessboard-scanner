/** Nommage des arbres remarquables par le LLM (Fable en ligne de commande), hors ligne, par lots, vérifié par les comptes.
 *   node scripts/arbres/nommer.mjs data/arbres/arbres.inventaire.json data/arbres/noms.json [--top 50] [--from 0]
 * Le LLM reçoit les traits saillants, ce qui suit d'habitude, et six exemples (coups de la fenêtre et suite) ; il doit
 * répondre par un nom court, une phrase de sens, et les deux traits sur lesquels il s'appuie ; ces traits doivent figurer
 * dans la liste fournie (sinon le nom est marqué « non vérifié »). */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { complete, llmConfig } from '../../coach/llm.mjs';
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const [inFile, outFile] = args.filter((x) => !x.startsWith('--') && !/^\d+$/.test(x));
const TOP = Number(opt('--top', 50)); const FROM = Number(opt('--from', 0));
// Fournisseur : DeepSeek par défaut (demande de l'auteur du 6 octobre : garder le quota de Fable) ; --provider claude-cli pour Fable.
// Par défaut Groq (gpt-oss-120b, gratuit) ; --provider nvidia --model meta/muse-glimmer-30b en secours ; --provider claude-cli pour Fable.
const provider = opt('--provider', process.env.GROQ_API_KEY ? 'groq' : 'nvidia');
const cfg = llmConfig({ ...process.env, LLM_PROVIDER: provider, LLM_MODEL: opt('--model', provider === 'groq' ? 'openai/gpt-oss-120b' : provider === 'nvidia' ? 'meta/muse-glimmer-30b' : provider === 'claude-cli' ? 'fable' : (process.env.LLM_MODEL || '')) });
const inv = JSON.parse(readFileSync(inFile, 'utf8'));
const noms = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : {};
const FR = { fa: 'apparaît', fl: 'disparaît', at: 'atome', ef: 'effet', pl: 'plan', tg: 'vise', zt: 'zone d’arrivée', dk: 'pression sur le roi', dz: 'contrôle de zone', kz: 'cases de sa zone roi que je contrôle', cas: 'roque', chk: 'échec', cap: 'prise', pc: 'pièce', side: 'camp', mat: 'matériel' };
const lis = (t) => `${FR[t.split(':')[0]] ?? t.split(':')[0]} ${t.split(':').slice(1).join(':').replace(':me', ' (moi)').replace(':him', ' (lui)').replace(/^me:/, 'moi ').replace(/^him:/, 'lui ')}`;
let erreurs = 0;
await (async () => {
for (const [r, g] of inv.groupes.slice(FROM, TOP).entries()) { // eslint-disable-line no-await-in-loop
  if (noms[g.groupe]) continue;
  if (erreurs >= 3) break;
  const traits = g.traits.map(([t, p, l]) => `- ${lis(t)} (dans ${Math.round(p * 100)} % des fenêtres, ${l.toFixed(1)} fois plus qu’ailleurs)`).join('\n');
  const avenir = g.avenir.map(([t, p, l]) => `- ${lis(t)} (${Math.round(p * 100)} %, ${l.toFixed(1)}×)`).join('\n');
  const ex = (g.exemples_coups ?? []).map((e) => `- partie ${e.id}, demi-coup ${e.fin}, vu des ${e.camp === 'w' ? 'Blancs' : 'Noirs'} : fenêtre « ${e.fenetre} », suite « ${e.suite} »`).join('\n');
  const prompt = `Tu es un maître d'échecs et un pédagogue. Voici un groupe de ${g.fenetres} fenêtres de seize demi-coups, tirées de ${g.parties} parties de joueurs 2400+, que l'ordinateur a regroupées parce qu'elles se ressemblent et mènent au même type de suite. « moi » est le camp qui vient de jouer, « lui » l'adversaire. Les zones : 0 côté de son roi, 1 centre, 2 côté de mon roi (+3 dans son camp).
Traits nettement plus fréquents dans ce groupe qu'ailleurs :
${traits}
Ce qui suit d'habitude dans les dix demi-coups suivants :
${avenir}
Exemples :
${ex}
Question : quelle idée stratégique ou tactique ces fenêtres ont-elles en commun ? Réponds en JSON strict, sans rien d'autre : {"phase": "ouverture|milieu|finale", "nom": "trois à six mots", "sens": "une phrase en français courant pour un débutant, ce que le camp cherche et ce que l'adversaire doit craindre", "preuves": ["deux ou trois traits de la liste ci-dessus, recopiés tels quels"], "confiance": "haute|moyenne|basse"}. Si les fenêtres n'ont rien de commun de reconnaissable, réponds {"nom": "pas d'idée commune", "sens": "", "preuves": [], "confiance": "basse"}.`;
  let text;
  try { text = await complete({ system: 'Tu es un maître d\'échecs et un pédagogue. Tu réponds en JSON strict.', user: prompt }, cfg, { think: 'low', maxTokens: 700, temperature: 0.2 }); erreurs = 0; }
  catch (e) { erreurs++; console.log(`${r + FROM + 1}. groupe ${g.groupe} : ERREUR ${e.message.slice(0, 80)}`); continue; }
  let j = null; try { j = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); } catch { j = { nom: 'réponse illisible', sens: text.trim().slice(0, 200), preuves: [], confiance: 'basse' }; }
  const mots = new Set([...g.traits, ...g.avenir].flatMap(([t]) => lis(t).toLowerCase().match(/[a-zéèêàçô_]{4,}/g) ?? []));
  j.verifie = (j.preuves ?? []).some((p) => (String(p).toLowerCase().match(/[a-zéèêàçô_]{4,}/g) ?? []).filter((m) => mots.has(m)).length >= 2);
  noms[g.groupe] = j;
  writeFileSync(outFile, JSON.stringify(noms, null, 1));
  console.log(`${r + FROM + 1}. groupe ${g.groupe} (${g.parties} parties) : ${j.nom} [${j.confiance}${j.verifie ? ', vérifié' : ''}]`);
}
})();
