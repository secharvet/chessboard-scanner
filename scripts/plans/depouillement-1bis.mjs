// Dépouillement du lot 1 bis (cahier CAHIER-LOT-1-BIS-2026-10-20 § 7-8) — lecture seule des parties.json.
// Chaque partie neuve est appariée à la MÊME partie (départ, camp, numéro) du lot 1, même bras, et au témoin du lot 1.
// Usage (racine du dépôt) : node scripts/plans/depouillement-1bis.mjs
import fs from 'node:fs';
const NEUF = 'reports/plans/epreuve-1bis'; const LOT1 = 'reports/plans/epreuve';
const MOTEURS = { 'SF 19': 'bin-stockfish-p18', 'SF 17.1': 'bin-stockfish-17.1-p18' };
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN; };
const moy = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const q = (a, p) => [...a].sort((x, y) => x - y)[Math.floor(p * (a.length - 1))];
const f = (c) => (c / 100).toFixed(2).replace('.', ',').replace(/^-/, '−').replace(/^(\d)/, '+$1');
const pc = (n, d) => `${((100 * n) / d).toFixed(1).replace('.', ',')} %`;
const cle = (x) => `${x.depart}|${x.camp}|${x.numero}`;
const fin = (x) => x.resultat.eval ?? 0;
const perdu = (x) => fin(x) < -200;
const lire = (D) => fs.readdirSync(D).filter((d) => d.startsWith('partie-')).flatMap((d) => JSON.parse(fs.readFileSync(`${D}/${d}/parties.json`)));
const compte = (a) => { const o = {}; for (const v of a) o[v] = (o[v] ?? 0) + 1; return o; };
const evts = (x, re) => x.journal.reduce((s, j) => s + (j.evts ?? []).filter((e) => re.test(typeof e === 'string' ? e : JSON.stringify(e))).length, 0);
const retards = (x) => x.journal.reduce((s, j) => s + Math.max(0, j.retard ?? 0), 0);
const crit = {};

for (const [m, nom] of Object.entries(MOTEURS)) {
  const neuf = lire(`${NEUF}/${nom}`); const lot1 = lire(`${LOT1}/${nom}`);
  const T = new Map(lot1.filter((x) => x.bras === 'temoin').map((x) => [cle(x), x]));
  console.log(`\n## ${m} : ${neuf.length} parties`);
  for (const b of ['livre', 'prix']) for (const r of ['A', 'B']) {
    const g = neuf.filter((x) => x.bras === b && x.regles === r); if (!g.length) continue;
    const V = new Map(lot1.filter((x) => x.bras === b).map((x) => [cle(x), x])); const v = g.map((x) => V.get(cle(x))); const t = g.map((x) => T.get(cle(x)));
    const c = g.map((x) => x.cout).filter((x) => x != null); const cv = v.map((x) => x.cout).filter((x) => x != null);
    const chg = g.map((x, i) => [x, v[i]]).filter(([x, y]) => x.sans.join() !== y.sans.join());
    const seg = g.flatMap((x) => x.segments);
    const k = `${b} ${r}`; (crit[k] ??= {})[m] = { med: med(c), moy: moy(c), perdues: g.filter(perdu).length, n: g.length };
    console.log(`\n### ${k} (${g.length} parties)`);
    console.log(`couverture ${pc(c.length, g.length)} [lot 1 ${pc(cv.length, g.length)}] | coût méd./moy. ${f(med(c))} / ${f(moy(c))} [lot 1 ${f(med(cv))} / ${f(moy(cv))}] | p90 ${f(q(c, 0.9))} [${f(q(cv, 0.9))}]`);
    console.log(`perdues ${g.filter(perdu).length} (${pc(g.filter(perdu).length, g.length)}) [lot 1 ${v.filter(perdu).length} ; témoin ${t.filter(perdu).length}] : ${JSON.stringify(compte(g.filter(perdu).map((x) => `${x.depart} ${x.camp}`)))}`);
    console.log(`éval. finale − lot 1 ${f(moy(g.map((x, i) => fin(x) - fin(v[i]))))} | − témoin ${f(moy(g.map((x, i) => fin(x) - fin(t[i]))))} [lot 1 − témoin ${f(moy(v.map((x, i) => fin(x) - fin(t[i]))))}]`);
    console.log(`sous plan moy. ${pc(moy(g.map((x) => x.partSousPlan)) * 100, 100)} [${pc(moy(v.map((x) => x.partSousPlan)) * 100, 100)}] | retards payés/partie ${moy(g.map(retards)).toFixed(0)} cp [${moy(v.map(retards)).toFixed(0)}]`);
    console.log(`parties identiques au lot 1 ${g.length - chg.length}/${g.length} ; changées ${chg.length} : mieux ${chg.filter(([x, y]) => fin(x) - fin(y) > 50).length}, pire ${chg.filter(([x, y]) => fin(x) - fin(y) < -50).length}`);
    console.log(`fins de plan ${JSON.stringify(compte(seg.map((s) => s.raison)))}`);
    console.log(`événements : refus ${g.reduce((s, x) => s + evts(x, /^"?refus/), 0)}, sauvetages ${g.reduce((s, x) => s + evts(x, /sauvetage/), 0)}, dernières chances refusées ${g.reduce((s, x) => s + evts(x, /dernière chance refusée/), 0)}, reprises ${g.reduce((s, x) => s + evts(x, /reprise/), 0)}`);
    console.log(`coups nouveaux ${JSON.stringify(compte(g.flatMap((x) => x.journal.map((j) => j.classe)).filter((k) => /attente|dernière/.test(k))))} | attente sans plan, cumul/partie moy. ${moy(g.map((x) => x.sansPlanCumul ?? 0)).toFixed(0)} cp`);
    const dif = g.map((x) => new Set(x.segments.map((s) => s.plan)).size); const du = seg.map((s) => s.plies);
    console.log(`plans par partie ${moy(dif).toFixed(1)} ${JSON.stringify(compte(dif))} ; durée d'un plan (demi-coups) quartiles ${q(du, 0.25)} / ${q(du, 0.5)} / ${q(du, 0.75)} ; adoption médiane ply ${med(seg.map((s) => s.plyAdoption))}`);
    const tr = {}; for (const x of g) for (const j of x.journal) { const s = Math.max(0, Math.floor((j.ply - 1) / 10)); (tr[s] ??= [0, 0])[0]++; if (j.plan && j.classe !== 'libre') tr[s][1]++; }
    console.log(`sous plan par tranche de 10 demi-coups : ${Object.entries(tr).map(([s, [n, p]]) => `${s * 10 + 1}-${s * 10 + 10} ${Math.round((100 * p) / n)} %`).join(' | ')}`);
  }
  for (const r of ['A', 'B']) {
    const L = new Map(neuf.filter((x) => x.bras === 'livre' && x.regles === r).map((x) => [cle(x), x])); const d = [];
    for (const p of neuf.filter((x) => x.bras === 'prix' && x.regles === r)) { const l = L.get(cle(p)); if (l && l.cout != null && p.cout != null) d.push(p.cout - l.cout); }
    if (d.length) console.log(`\nprix − livre apparié, règles ${r} (n=${d.length}) : moyenne ${f(moy(d))}, médiane ${f(med(d))}, prix moins cher ${d.filter((x) => x < 0).length}, plus cher ${d.filter((x) => x > 0).length}`);
  }
}
console.log('\n## Critère (médiane ≤ +0,25, moyenne ≤ +0,50, perdues ≤ 3 sur 100, aux moteurs joués)');
for (const [k, ms] of Object.entries(crit)) console.log(`${k} : ${Object.entries(ms).map(([m, x]) => `${m} ${f(x.med)} / ${f(x.moy)} / ${pc(x.perdues, x.n)} ${x.med <= 25 && x.moy <= 50 && x.perdues / x.n <= 0.03 ? 'passe' : 'NE PASSE PAS'}`).join(' ; ')}`);
