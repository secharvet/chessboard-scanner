// Le veto de défense en OBSERVATEUR sur le lot 1 bis (docs/plans/REGROUPEMENT-2026-10-21.md § 4) — lecture seule, aucun
// moteur : combien de fois l'attaque est « arrivée » au trait du coach, et combien de pas de plan joués le veto aurait
// interdits, dans les parties perdues (< −2) et les autres. Usage (racine) : node scripts/plans/observer-veto.mjs
import fs from 'node:fs';
import { Chess } from 'chess.js';
import { attaqueRoi, vetoDefense } from '../../coach/zone-roi.mjs';
import { trouverDepart, fenDepart } from './departs.mjs';
const BASE = process.env.LOT ?? '/home/ubuntu/chess-dev/reports/plans/epreuve-1bis';
const PAS = new Set(['progressant', 'forcé-progressant', 'dernière chance']);
const t = {}; const parDep = {};
for (const mot of fs.readdirSync(BASE).filter((d) => d.startsWith('bin-'))) for (const d of fs.readdirSync(`${BASE}/${mot}`)) {
  for (const g of JSON.parse(fs.readFileSync(`${BASE}/${mot}/${d}/parties.json`))) {
    const perdue = (g.resultat.eval ?? 0) < -200 ? 'perdues' : 'autres';
    const c = new Chess(fenDepart(trouverDepart(g.depart))); const J = new Map(g.journal.map((j) => [j.ply, j]));
    const x = (t[perdue] ??= { parties: 0, avecAttaque: 0, coups: 0, arrivee: 0, pas: 0, vetos: 0, partiesVeto: 0 }); x.parties++;
    const y = (parDep[`${g.depart} ${g.camp}`] ??= { parties: 0, avecAttaque: 0, vetos: 0, perduesVeto: 0, perdues: 0 }); y.parties++; if (perdue === 'perdues') y.perdues++;
    let att = false, veto = false;
    g.sans.forEach((san, ply) => {
      const j = J.get(ply);
      if (j && c.turn() === g.camp) {
        x.coups++; const a = attaqueRoi(c.fen(), g.camp);
        if (a?.arrivee) { x.arrivee++; att = true; }
        if (PAS.has(j.classe)) { x.pas++; if (vetoDefense(c.fen(), g.camp, san)) { x.vetos++; veto = true; } }
      }
      c.move(san);
    });
    if (att) { x.avecAttaque++; y.avecAttaque++; } if (veto) { x.partiesVeto++; y.vetos++; if (perdue === 'perdues') y.perduesVeto++; }
  }
}
const pc = (n, d) => `${((100 * n) / d).toFixed(1).replace('.', ',')} %`;
for (const [k, x] of Object.entries(t)) console.log(`${k} : ${x.parties} parties ; attaque arrivée dans ${x.avecAttaque} (${pc(x.avecAttaque, x.parties)}), sur ${pc(x.arrivee, x.coups)} des coups du coach ; ${x.vetos} pas vetoés sur ${x.pas} pas joués, dans ${x.partiesVeto} parties (${pc(x.partiesVeto, x.parties)})`);
console.log('\ndépart-camp : parties avec attaque arrivée | parties avec un pas vetoé | dont perdues / perdues');
for (const [k, y] of Object.entries(parDep).sort()) console.log(`  ${k.padEnd(24)} ${y.avecAttaque}/${y.parties} | ${y.vetos} | ${y.perduesVeto}/${y.perdues}`);
