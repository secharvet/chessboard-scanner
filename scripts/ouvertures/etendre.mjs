/**
 * Prolonger un livre d'ouverture (8 octobre 2026) : pour chaque position atteinte par un coup du livre mais absente du livre,
 * le moteur donne les coups bons (≤ 0,4 du meilleur) et mauvais (≥ 0,5 de perte) parmi les douze premiers, Fable rédige
 * l'entrée (sens du dernier coup, menace, plan avec pourquoi, fautes avec pourquoi) dans le style du livre, le moteur
 * revérifie, et l'entrée est enregistrée comme brouillon « IA, à relire ». Reprise possible (le JSON est relu au départ).
 *   node scripts/ouvertures/etendre.mjs coach/openings/francaise.mjs data/ouvertures/francaise-ext.json [--max 120] [--prof-principal 20] [--prof-variante 16] [--depth 16]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { Chess } from 'chess.js';
import { UciEngine } from '../../coach/uci-engine.mjs';
import { complete, llmConfig } from '../../coach/llm.mjs';
import { toFrenchSan } from '../../coach/notation.mjs';
const args = process.argv.slice(2); const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const [IN, OUT] = args.filter((a) => !a.startsWith('--') && !/^\d+$/.test(a));
const MAX = Number(opt('--max', 120)); const PP = Number(opt('--prof-principal', 20)); const PV = Number(opt('--prof-variante', 16)); const DEPTH = Number(opt('--depth', 16));
const { LIVRE, OUVERTURE } = await import('../../' + IN);
const ext = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : [];
const cfg = llmConfig({ ...process.env, LLM_PROVIDER: 'claude-cli', LLM_MODEL: 'fable' });
const engine = new UciEngine({ threads: 2, hashMb: 128 }); await engine.start();
const cle = (c) => c.fen().split(' ').slice(0, 4).join(' ');
const cp = (s) => (s.type === 'mate' ? (s.value > 0 ? 10000 : -10000) : s.value);
const tout = () => [...LIVRE, ...ext];
const index = () => { const m = new Map(); for (const e of tout()) { const c = new Chess(); for (const s of e.coups.split(' ')) c.move(s); m.set(cle(c), e); } return m; };
const ligneFr = (coups) => coups.split(' ').map((s, i) => (i % 2 === 0 ? `${i / 2 + 1}.` : '') + toFrenchSan(s)).join(' ');

function manquants() {
  const idx = index(); const out = [];
  for (const e of tout()) {
    const n = e.coups.split(' ').length;
    (e.plan ?? []).forEach((p, i) => {
      if (p.porte) return; // porte vers une autre ouverture : on ne la prolonge pas ici
      if (i === 0 ? n + 1 > PP : n + 1 > PV) return;
      if (i > 0 && n >= 12) return; // au-delà du 6e coup, on ne suit plus que la ligne principale
      const c = new Chess(); for (const s of e.coups.split(' ')) c.move(s); try { c.move(p.san); } catch { return; }
      if (!idx.has(cle(c))) out.push({ coups: `${e.coups} ${p.san}`, principal: i === 0, parent: e });
    });
  }
  out.sort((a, b) => (b.principal - a.principal) || (a.coups.length - b.coups.length)); return out;
}

async function ecrire(m) {
  const c = new Chess(); for (const s of m.coups.split(' ')) c.move(s);
  const lines = await engine.analyze(c.fen(), { depth: DEPTH, multipv: 12 });
  const cands = lines.map((l) => { const t = new Chess(c.fen()); const mv = t.move({ from: l.pv[0].slice(0, 2), to: l.pv[0].slice(2, 4), promotion: l.pv[0][4] }); return { san: mv.san, cp: cp(l.score), pv: l.pv.slice(0, 4) }; });
  if (!cands.length) return null;
  const best = cands[0].cp; const bons = cands.filter((x) => best - x.cp <= 40); const mauvais = cands.filter((x) => best - x.cp >= 50);
  const trait = c.turn() === 'w' ? 'Blancs' : 'Noirs'; const dernier = m.coups.split(' ').at(-1); const quiADonne = c.turn() === 'w' ? 'Noirs' : 'Blancs';
  const parentPourquoi = (m.parent.plan ?? []).find((p) => p.san === dernier)?.pourquoi ?? '';
  const user = `Ouverture : ${OUVERTURE}. Ligne jouée : ${ligneFr(m.coups)}. Le dernier coup (${toFrenchSan(dernier)}, par les ${quiADonne}) avait été recommandé avec ce commentaire : « ${parentPourquoi} ». Trait aux ${trait}.
Coups jugés BONS par Stockfish (à ≤ 0,4 pion du meilleur), avec l'évaluation en centièmes de pion du point de vue des ${trait} : ${bons.map((x) => `${toFrenchSan(x.san)} (${x.cp})`).join(', ')}.
Coups naturels mais MAUVAIS (perdent ≥ 0,5 pion) : ${mauvais.length ? mauvais.map((x) => `${toFrenchSan(x.san)} (${x.cp}, suite ${x.pv.join(' ')})`).join(', ') : 'aucun parmi les douze premiers'}.
Écris l'entrée de cette position pour un livre destiné à des débutants en français, dans ce style (phrases courtes, concrètes, qui disent le POURQUOI) :
- "sens" : ce que cherche le dernier coup joué, à la troisième personne, sans répéter le coup (exemple : "défend e4 en développant : le cavalier regarde d5 et e4").
- "menace" : la menace concrète créée par ce coup, ou null.
- "nom" : le nom de la variante si cette position en a un (sinon null).
- "plan" : 2 ou 3 coups parmi les BONS (notation anglaise SAN exacte : ${bons.map((x) => x.san).join(', ')}), le principal d'abord, chacun avec "pourquoi" (ce qu'il fait, ce qu'il prépare, ce qu'il laisse à l'adversaire).
- "erreurs" : 1 ou 2 coups parmi les MAUVAIS (SAN exacte : ${mauvais.map((x) => x.san).join(', ') || 'aucun'}) qu'un débutant pourrait jouer, chacun avec "pourquoi" (ce qui est puni et comment) ; [] s'il n'y en a pas de naturel.
Réponds UNIQUEMENT par un objet JSON : {"nom": …, "sens": "…", "menace": …, "plan": [{"san": "…", "pourquoi": "…"}], "erreurs": [{"san": "…", "pourquoi": "…"}]}.`;
  let text; try { text = await complete({ system: 'Tu es un professeur d\'échecs qui écrit un livre d\'ouvertures pour débutants, en français, précis et concret. JSON strict.', user }, cfg, { think: 'low', maxTokens: 900, temperature: 0.3 }); } catch (e) { console.error(`Fable : ${e.message}`); return null; }
  let j; try { j = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); } catch { console.error('JSON illisible'); return null; }
  const okSan = new Set(bons.map((x) => x.san)); const badSan = new Set(mauvais.map((x) => x.san));
  const plan = (j.plan ?? []).filter((p) => p?.san && okSan.has(p.san) && p.pourquoi).slice(0, 3);
  const erreurs = (j.erreurs ?? []).filter((p) => p?.san && badSan.has(p.san) && p.pourquoi).slice(0, 2);
  if (!plan.length) { console.error(`plan vide ou non vérifié pour ${m.coups}`); return null; }
  return { coups: m.coups, nom: j.nom || undefined, sens: String(j.sens || '').trim(), menace: j.menace ? String(j.menace).trim() : undefined, plan, erreurs: erreurs.length ? erreurs : undefined, auteur: 'brouillon IA (Fable), vérifié au moteur, à relire', date: new Date().toISOString().slice(0, 10), evalBest: best };
}

let n = 0;
while (n < MAX) {
  const liste = manquants(); if (!liste.length) break;
  const m = liste[0]; const e = await ecrire(m);
  if (!e) { ext.push({ coups: m.coups, sens: '', plan: [], auteur: 'échec de rédaction', date: new Date().toISOString().slice(0, 10) }); }
  else { ext.push(e); console.error(`${++n}. ${ligneFr(e.coups)} ${e.nom ? '[' + e.nom + '] ' : ''}→ plan ${e.plan.map((p) => toFrenchSan(p.san)).join(' / ')}${e.erreurs ? ' ; fautes ' + e.erreurs.map((x) => toFrenchSan(x.san)).join(' / ') : ''}`); }
  writeFileSync(OUT, JSON.stringify(ext, null, 1));
}
engine.stop();
console.error(`TERMINÉ ${n} positions écrites, ${ext.length} dans ${OUT} ; restent ${manquants().length} manquantes`);
