// Le second pilote Maia (GE, 22 oct.) — lecture seule : par départ et par bras, partie par partie (longueur, raison de fin,
// score de l'élève, éval au 30e demi-coup), puis la tranche sous plan appariée par graine (guidé − libre), et la mesure
// directe « un 1500 trouve-t-il le coup du plan » : à chaque coup sous plan, le meilleur pas légal est-il parmi les coups
// probables (≥ 5 %, cinq au plus) ? Usage : node scripts/plans/depouillement-pilote-maia.mjs <dossier du pilote>
import fs from 'node:fs';
const BASE = process.argv[2] ?? 'reports/plans/maia/pilote-2';
const TRANCHE = 30; // demi-coups après le départ : la fenêtre du coach (GE)
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };
const moy = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const f2 = (x) => (x == null ? '—' : (x / 100).toFixed(2).replace('.', ','));
const pc = (n, d) => (d ? `${Math.round((100 * n) / d)} %` : '—');
const lots = {};
for (const d of fs.readdirSync(BASE)) { const f = `${BASE}/${d}/parties.json`; if (fs.existsSync(f)) for (const g of JSON.parse(fs.readFileSync(f))) ((lots[g.depart] ??= {})[g.bras] ??= []).push(g); }
for (const [dep, bras] of Object.entries(lots)) {
  const camp = (bras.GA ?? bras.GS)?.[0]?.camp ?? 'w';
  const pdv = (evB) => (camp === 'w' ? evB : -evB); // point de vue de l'élève guidé (aussi pour le libre, même couleur)
  const tranche = (g) => pdv(g.journal.find((j) => j.ply === TRANCHE)?.evalB ?? g.resultat.evalB ?? 0);
  console.log(`\n═══ ${dep}, élève ${camp === 'w' ? 'Blancs' : 'Noirs'} ═══`);
  for (const [b, G] of Object.entries(bras).sort()) {
    G.sort((x, y) => x.numero - y.numero);
    const score = G.reduce((s, g) => s + (g.resultat.gagnant == null ? 0.5 : g.resultat.gagnant === camp ? 1 : 0), 0);
    const fins = {}; for (const g of G) fins[g.resultat.type] = (fins[g.resultat.type] ?? 0) + 1;
    const moi = (j) => j.joueur === camp;
    const ch = G.map((g) => g.journal.filter((j) => moi(j) && j.change).length), so = G.flatMap((g) => g.journal.filter((j) => moi(j) && j.souffle));
    console.log(`\n${b} : ${G.length} parties, score de l'élève ${score}/${G.length}, longueur médiane ${med(G.map((g) => g.plies))} demi-coups, fins ${JSON.stringify(fins)}`);
    console.log(`  éval au ${TRANCHE}e demi-coup (élève) : médiane ${f2(med(G.map(tranche)))}, moyenne ${f2(moy(G.map(tranche)))}`);
    if (b !== 'LL') console.log(`  coups changés par partie : médiane ${med(ch)} (${ch.join(' ')}) ; soufflés ${so.length}, probabilité Maia médiane ${so.length ? `${(100 * med(so.map((j) => j.p))).toFixed(1)} %` : '—'}`);
    const sous = G.flatMap((g) => g.journal.filter((j) => moi(j) && j.pasLegaux)), avec = sous.filter((j) => j.pasLegaux.length);
    const trouve = avec.filter((j) => j.pasLegaux.some((p) => p.p >= 0.05)).length;
    console.log(`  « un 1500 trouve-t-il le coup » : ${sous.length} coups sous plan, ${avec.length} avec un pas légal ; un pas parmi les probables (≥ 5 %) dans ${trouve} (${pc(trouve, avec.length)}) ; meilleur pas, probabilité médiane ${avec.length ? `${(100 * med(avec.map((j) => Math.max(...j.pasLegaux.map((p) => p.p))))).toFixed(1)} %` : '—'}`);
    const parPlan = {}; for (const j of avec) { const x = (parPlan[j.plan] ??= { n: 0, t: 0, best: [] }); x.n++; if (j.pasLegaux.some((p) => p.p >= 0.05)) x.t++; x.best.push(Math.max(...j.pasLegaux.map((p) => p.p))); }
    for (const [pl, x] of Object.entries(parPlan).sort((a, c) => c[1].n - a[1].n)) console.log(`    ${pl.padEnd(28)} ${x.n} coups, pas probable dans ${pc(x.t, x.n)}, meilleur pas médian ${(100 * med(x.best)).toFixed(1)} %`);
    console.log('  n° | demi-coups | fin | gagnant | éval 30e | changés | soufflés | plans (raison)');
    for (const g of G) console.log(`  ${String(g.numero).padStart(2)} | ${String(g.plies).padStart(3)} | ${g.resultat.type} | ${g.resultat.gagnant ?? 'nul'} | ${f2(tranche(g))} | ${g.journal.filter((j) => moi(j) && j.change).length} | ${g.journal.filter((j) => moi(j) && j.souffle).length} | ${(g.segments[camp] ?? []).map((s) => `${s.plan} (${s.raison})`).join(' ; ')}`);
  }
  // La tranche sous plan, appariée par graine : guidé − libre.
  for (const b of ['GA', 'GS']) if (bras[b] && bras.LL) {
    const L = new Map(bras.LL.map((g) => [g.numero, g])), d = bras[b].filter((g) => L.has(g.numero)).map((g) => tranche(g) - tranche(L.get(g.numero)));
    console.log(`\n${b} − LL au ${TRANCHE}e demi-coup, apparié (${d.length} paires) : médiane ${f2(med(d))}, moyenne ${f2(moy(d))}, guidé mieux ${d.filter((x) => x > 0).length}, pareil ${d.filter((x) => x === 0).length}, moins bien ${d.filter((x) => x < 0).length}`);
  }
}
