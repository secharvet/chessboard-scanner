// Dépouillement de l'épreuve du jeu, lot 1, aux deux moteurs (RELECTURE § 9) — lecture seule des parties.json.
import fs from 'node:fs';
const RACINE = 'reports/plans/epreuve'; // lancé depuis la racine du dépôt
const MOTEURS = { 'SF 19': `${RACINE}/bin-stockfish-p18`, 'SF 17.1': `${RACINE}/bin-stockfish-17.1-p18` };
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN; };
const moy = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const p90 = (a) => [...a].sort((x, y) => x - y)[Math.floor(0.9 * a.length)];
const f = (c) => (c / 100).toFixed(2).replace('.', ',').replace(/^-/, '−').replace(/^(\d)/, '+$1');
const pc = (n, d) => `${Math.round((100 * n) / d)} %`;
const fins = (g) => { const e = g.map((x) => x.resultat.eval ?? 0); return `${pc(e.filter((v) => v > 50).length, e.length)} / ${pc(e.filter((v) => v < -50).length, e.length)} / ${pc(e.filter((v) => v < -200).length, e.length)}`; };
const cle = (x) => `${x.depart}|${x.camp}|${x.numero}`;

const lots = {};
for (const [m, D] of Object.entries(MOTEURS)) {
  const gs = [];
  for (const d of fs.readdirSync(D).filter((d) => d.startsWith('partie-'))) gs.push(...JSON.parse(fs.readFileSync(`${D}/${d}/parties.json`)));
  lots[m] = gs;
  console.log(`\n## ${m} : ${gs.length} parties, ${new Set(gs.map((g) => g.depart + g.camp)).size} départs-camps`);
  console.log('bras    | coût méd | moy   | p90   | sous plan méd | fin mieux / moins bien / perdu | répét. | sans plan table épuisée (méd/partie) | bascules | gratuits (lisant 0)');
  for (const b of ['livre', 'prix']) {
    const g = gs.filter((x) => x.bras === b); const c = g.map((x) => x.cout).filter((x) => x != null); console.log(`  (${b} : ${g.length - c.length} parties sans aucun plan, coût non défini, hors médiane)`);
    const sp = g.map((x) => x.partSousPlan); const rep = g.filter((x) => /répétition/.test(x.resultat.type)).length;
    const epuise = g.map((x) => x.journal.filter((j) => j.classe === 'libre' && !j.plan && j.structure).length);
    const basc = g.reduce((s, x) => s + x.journal.reduce((t, j) => t + (j.evts ?? []).filter((e) => (e.type ?? e) === 'bascule' || JSON.stringify(e).includes('bascule')).length, 0), 0);
    const grat = g.flatMap((x) => x.segments ?? []).filter((s) => s.gratuit);
    console.log(`${b.padEnd(7)} | ${f(med(c))}    | ${f(moy(c))} | ${f(p90(c))} | ${pc(med(sp) * 100, 100)}          | ${fins(g)}               | ${rep}     | ${med(epuise)}                                   | ${basc}       | ${grat.length} (${grat.filter((s) => s.prix === 0).length})`);
  }
  console.log(`témoin  | fin mieux / moins bien / perdu ${fins(gs.filter((x) => x.bras === 'temoin'))}`);
  const P = new Map(gs.filter((x) => x.bras === 'prix').map((x) => [cle(x), x])); const d = []; let meme = 0;
  for (const l of gs.filter((x) => x.bras === 'livre')) { const p = P.get(cle(l)); if (p && p.cout != null && l.cout != null) { d.push(p.cout - l.cout); if (p.cout === l.cout) meme++; } }
  console.log(`prix − livre apparié (n=${d.length}) : médiane ${f(med(d))}, moyenne ${f(moy(d))}, même coût ${meme}, prix moins cher ${d.filter((x) => x < 0).length}, plus cher ${d.filter((x) => x > 0).length}`);
  const cr = gs.filter((x) => x.bras !== 'temoin' && x.cout != null); const dr = cr.map((x) => x.retards - x.cout);
  console.log(`Σ retards − prix ligne (n=${cr.length}) : médiane ${f(med(dr))}, |écart| médian ${f(med(dr.map(Math.abs)))}, à 25 cp près ${pc(dr.filter((x) => Math.abs(x) <= 25).length, dr.length)}`);
  const by = {}; for (const x of gs.filter((x) => x.bras === 'livre')) (by[`${x.depart} ${x.camp}`] ??= []).push(x);
  console.log('départ-camp (livre) : coût médian | perdues (< −2) | répétitions');
  for (const [k, v] of Object.entries(by).sort()) console.log(`  ${k.padEnd(24)} ${f(med(v.map((x) => x.cout).filter((x) => x != null)))} (${v.filter((x) => x.cout == null).length} sans plan) | ${v.filter((x) => (x.resultat.eval ?? 0) < -200).length}/${v.length} | ${v.filter((x) => /répétition/.test(x.resultat.type)).length}`);
}
// Accord entre moteurs, partie par partie (mêmes graines)
console.log('\n## SF 19 contre SF 17.1, même partie (mêmes graines)');
for (const b of ['livre', 'prix']) {
  const A = new Map(lots['SF 19'].filter((x) => x.bras === b).map((x) => [cle(x), x])); const e = []; let memeSigne = 0;
  for (const x of lots['SF 17.1'].filter((x) => x.bras === b)) { const a = A.get(cle(x)); if (a && a.cout != null && x.cout != null) { e.push(x.cout - a.cout); if (Math.sign(x.cout) === Math.sign(a.cout)) memeSigne++; } }
  console.log(`${b} (n=${e.length}) : SF 17.1 − SF 19 médiane ${f(med(e))}, |écart| médian ${f(med(e.map(Math.abs)))}, même signe ${pc(memeSigne, e.length)}`);
}
console.log('\n## Critère (médiane ≤ +0,25 et moyenne ≤ +0,50, aux deux moteurs)');
for (const b of ['livre', 'prix']) {
  const r = Object.entries(lots).map(([m, gs]) => { const c = gs.filter((x) => x.bras === b).map((x) => x.cout).filter((x) => x != null); return { m, ok: med(c) <= 25 && moy(c) <= 50, s: `${f(med(c))} / ${f(moy(c))}` }; });
  console.log(`${b} : ${r.map((x) => `${x.m} ${x.s} ${x.ok ? 'passe' : 'NE PASSE PAS'}`).join(' ; ')} → ${r.every((x) => x.ok) ? 'PASSE' : 'NE PASSE PAS'}`);
}
