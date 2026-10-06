/**
 * Corpus annoté multi-auteurs (6 octobre 2026) : études Lichess publiques dont les coups portent des commentaires.
 * 1. recherche d'études par mots-clés (pages de recherche Lichess) → identifiants ;
 * 2. téléchargement du PGN de chaque étude (API publique) ;
 * 3. comptage des commentaires de fond (hors flèches, hors « Inaccuracy/Blunder… was best », hors évaluations) ;
 * 4. on garde les études d'au moins 30 commentaires de fond ; fichier d'inventaire avec auteur, titre, comptes.
 *   node scripts/arbres/corpus-annote.mjs data/reference/annotes [--min 30] [--max-studies 400]
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
const [OUT] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const args = process.argv.slice(2); const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const MIN = Number(opt('--min', 30)); const MAXS = Number(opt('--max-studies', 400));
mkdirSync(OUT, { recursive: true });
const REQUETES = ['annotated games', 'annotated classic games', 'logical chess move by move', 'chess fundamentals capablanca', 'my system nimzowitsch', 'zurich 1953 bronstein', 'most instructive games chernev', 'alekhine best games annotated', 'fischer 60 memorable games', 'morphy annotated', 'tarrasch games annotated', 'euwe middlegame', 'reassess your chess silman', 'pawn structure chess', 'the art of attack vukovic', 'kotov think like a grandmaster', 'tal life and games', 'karpov best games annotated', 'botvinnik annotated', 'rubinstein annotated games', 'lasker manual of chess', 'steinitz annotated', 'understanding chess move by move nunn', 'chess strategy annotated', 'positional chess annotated', 'attacking chess annotated', 'instructive games annotated', 'simple chess stean', 'amateur mind silman', 'master games commented', 'parties commentées', 'partie commentée stratégie', 'commented games strategy'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ids = new Map();
for (const q of REQUETES) {
  for (const page of [1, 2]) {
    try {
      const res = await fetch(`https://lichess.org/study/search?q=${encodeURIComponent(q)}&page=${page}`, { headers: { 'User-Agent': 'coach-echecs-recherche (contact: sebastien.charvet@gmail.com)' } });
      if (!res.ok) { console.error(`${q} p${page} : HTTP ${res.status}`); await wait(2000); continue; }
      const html = await res.text();
      for (const m of html.matchAll(/href="\/study\/([A-Za-z0-9]{8})"/g)) if (!ids.has(m[1])) ids.set(m[1], q);
    } catch (e) { console.error(`${q} : ${e.message}`); }
    await wait(1200);
  }
  console.error(`${q} → ${ids.size} études distinctes`);
  if (ids.size >= MAXS) break;
}
const inventaire = [];
let n = 0;
for (const [id, requete] of ids) {
  if (++n > MAXS) break;
  const f = `${OUT}/${id}.pgn`;
  let pgn;
  if (existsSync(f)) pgn = readFileSync(f, 'utf8');
  else {
    try {
      const res = await fetch(`https://lichess.org/api/study/${id}.pgn?comments=true&variations=false&clocks=false`, { headers: { 'User-Agent': 'coach-echecs-recherche' } });
      if (res.status === 429) { console.error('429 : pause 60 s'); await wait(60000); continue; }
      if (!res.ok) { await wait(800); continue; }
      pgn = await res.text(); writeFileSync(f, pgn);
    } catch (e) { console.error(`${id} : ${e.message}`); continue; }
    await wait(900);
  }
  const chapitres = (pgn.match(/^\[Event /gm) ?? []).length;
  const coms = [...pgn.matchAll(/\{([^}]*)\}/g)].map((m) => m[1].replace(/\[%[a-z]+ [^\]]*\]/g, '').trim()).filter((c) => c.length >= 12 && !/(Inaccuracy|Mistake|Blunder|was best|Checkmate is now|^\s*[-+]?\d+\.\d+)/.test(c));
  const auteur = pgn.match(/\[StudyName "([^"]*)"\]|\[Annotator "([^"]*)"\]/)?.[1] ?? '';
  const titre = pgn.match(/\[Event "([^"]*)"\]/)?.[1]?.split(':')[0] ?? '';
  const langueFr = /\b(les|une|pour|avec|cavalier|fou|dame|tour|pion)\b/i.test(coms.slice(0, 20).join(' '));
  inventaire.push({ id, requete, titre, auteur, chapitres, commentaires: coms.length, fr: langueFr, garde: coms.length >= MIN });
  console.error(`${id} ${titre.slice(0, 40)} : ${chapitres} chap., ${coms.length} commentaires ${coms.length >= MIN ? '✓' : ''}`);
}
inventaire.sort((a, b) => b.commentaires - a.commentaires);
writeFileSync(`${OUT}/inventaire.json`, JSON.stringify(inventaire, null, 1));
const gardes = inventaire.filter((x) => x.garde);
console.error(`TERMINÉ ${inventaire.length} études lues, ${gardes.length} gardées (≥ ${MIN} commentaires), ${gardes.reduce((s, x) => s + x.commentaires, 0)} commentaires de fond`);
