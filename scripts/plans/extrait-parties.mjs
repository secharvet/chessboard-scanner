// Extrait de lecture pour l'Expert : les parties perdues (éval finale < −2 côté coach) d'un départ-camp, aux deux moteurs,
// avec, pour chaque coup du coach sous plan, le plan, la classe, le retard et les candidats du moteur. Lecture seule.
// Usage : node scripts/plans/extrait-parties.mjs <départ> <camp> [bras=livre] > extrait.md
import fs from 'node:fs';
import { Chess } from 'chess.js';
import { DEPARTS, fenDepart } from './departs.mjs';

const [depart, camp, bras = 'livre'] = process.argv.slice(2);
const MOTEURS = { 'SF 19': 'reports/plans/epreuve/bin-stockfish-p18', 'SF 17.1': 'reports/plans/epreuve/bin-stockfish-17.1-p18' };
const f = (c) => (c == null ? '—' : (c / 100).toFixed(2).replace('.', ',').replace(/^-/, '−').replace(/^(\d)/, '+$1'));
const lire = (D, b) => { const p = `${D}/partie-${depart}-${camp}-${b}/parties.json`; return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : []; };
const d = DEPARTS.find((x) => x.id === depart);
const fen0 = fenDepart(d);
console.log(`# ${d.nom} — coach ${camp === 'w' ? 'Blancs' : 'Noirs'}, bras ${bras}, parties perdues\n\nDépart : ${d.coups}\nFEN : \`${fen0}\`\n`);
console.log('Lecture : coût = somme des prix des plans (pions rendus au faisceau libre). Retard = ce que le coup contraint perd sur le meilleur coup libre (cp). Candidats = évaluation moteur côté coach.\n');
for (const [m, D] of Object.entries(MOTEURS)) {
  const gs = lire(D, bras); const tem = new Map(lire(D, 'temoin').map((g) => [g.numero, g])); const autre = new Map(lire(D, bras === 'livre' ? 'prix' : 'livre').map((g) => [g.numero, g]));
  const perdues = gs.filter((g) => (g.resultat.eval ?? 0) < -200);
  console.log(`\n## ${m} : ${perdues.length} perdues sur ${gs.length} (n° ${perdues.map((g) => g.numero).join(', ')})`);
  for (const g of perdues) {
    const t = tem.get(g.numero); const a = autre.get(g.numero);
    console.log(`\n### ${m}, partie n° ${g.numero} — fin ${f(g.resultat.eval)} (${g.resultat.type}), coût ${f(g.cout)}, sous plan ${Math.round(100 * g.partSousPlan)} % | même graine : témoin fin ${f(t?.resultat.eval)}, autre bras fin ${f(a?.resultat.eval)}`);
    const ch = new Chess(fen0); const parts = [];
    g.sans.forEach((san, i) => { const n = ch.moveNumber(); const w = ch.turn() === 'w'; ch.move(san); parts.push(w ? `${n}.${san}` : (i === 0 ? `${n}…${san}` : san)); });
    console.log(`\nCoups : ${parts.join(' ')}\n`);
    console.log('Plans : ' + g.segments.map((s) => `${s.plan} [${s.origine}] ply ${s.plyAdoption}→${s.plyAbandon ?? 'fin'} ${s.raison}, prix ${f(s.prix)}`).join(' ; ') + '\n');
    console.log('| ply | coup | plan | classe | retard | candidats |\n|---|---|---|---|---|---|');
    for (const j of g.journal) if (j.plan || j.retard > 0) console.log(`| ${j.ply} | ${j.san} | ${j.plan ?? '—'} | ${j.classe} | ${j.retard} | ${j.cands ?? ''} |`);
  }
}
