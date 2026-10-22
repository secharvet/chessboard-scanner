// La nuit d'observation de l'attaque de roi (docs/plans/SEUILS-ATTAQUE-ROI-2026-10-21.md) — lecture seule, aucun moteur :
// sur les parties neuves (graines 11-20, règles A), les deux candidats en observateur, rien n'est interdit.
//   candidat 1 : veto de l'Expert (coach/zone-roi.mjs vetoDefense) + la dame adverse parmi les attaquants
//   candidat 2 : pression graduée du GE (allumePression : S ≥ 4, tendance ≥ +2 sur quatre demi-coups, D baisse d'au moins 1)
// Allumé = au moins un pas de plan joué (progressant ou dernière chance) que le candidat aurait arrêté. Perdue = éval < −2.
// Usage (racine) : LOT=reports/plans/epreuve-attaque node scripts/plans/observer-attaque.mjs
import fs from 'node:fs';
import { Chess } from 'chess.js';
import { vetoDefense, pressionRoi, allumePression } from '../../coach/zone-roi.mjs';
import { trouverDepart } from './departs.mjs';
const BASE = process.env.LOT ?? 'reports/plans/epreuve-attaque';
const PAS = new Set(['progressant', 'dernière chance']); // une parade ou une reprise ne s'allume jamais
const CANDS = ['dame', 'pression'];
const t = { perdues: {}, autres: {} }; const parDep = {}; const details = [];
for (const k of Object.keys(t)) t[k] = { parties: 0, pas: 0, ...Object.fromEntries(CANDS.map((c) => [c, 0])) };
for (const mot of fs.readdirSync(BASE).filter((d) => d.startsWith('bin-'))) for (const d of fs.readdirSync(`${BASE}/${mot}`)) {
  const f = `${BASE}/${mot}/${d}/parties.json`; if (!fs.existsSync(f)) continue;
  for (const g of JSON.parse(fs.readFileSync(f))) {
    const perdue = (g.resultat.eval ?? 0) < -200 ? 'perdues' : 'autres', x = t[perdue]; x.parties++;
    const y = (parDep[`${g.depart} ${g.camp}`] ??= { parties: 0, perdues: 0, ...Object.fromEntries(CANDS.map((c) => [c, 0])), perduesDame: 0, perduesPression: 0 });
    y.parties++; if (perdue === 'perdues') y.perdues++;
    // L'historique de S remonte dans les coups du départ (« quatre demi-coups plus tôt » existe dès le premier coup).
    const dep = trouverDepart(g.depart), c = new Chess(), S = [];
    const coups = [...(dep.coups ? dep.coups.split(/\s+/) : []), ...g.sans], debut = dep.coups ? coups.length - g.sans.length : 0;
    if (dep.fen) c.load(dep.fen);
    const J = new Map(g.journal.map((j) => [j.ply, j])); const allume = { dame: false, pression: false };
    coups.forEach((san, i) => {
      S.push(pressionRoi(c.fen(), g.camp)?.S ?? null);
      const ply = i - debut, j = ply >= 0 ? J.get(ply) : null;
      if (j && c.turn() === g.camp && PAS.has(j.classe)) {
        x.pas++;
        const v = vetoDefense(c.fen(), g.camp, san);
        if (v && v.attaquants.some((a) => a.startsWith('Q'))) { allume.dame = true; details.push(`dame     ${g.depart} ${g.camp} n° ${g.numero} ply ${ply} ${san} (défenses ${v.avant} → ${v.apres}, attaquants ${v.attaquants.join(' ')})${perdue === 'perdues' ? ' PERDUE' : ''}`); }
        const p = i >= 4 ? allumePression(c.fen(), g.camp, san, S[i - 4]) : null;
        if (p) { allume.pression = true; details.push(`pression ${g.depart} ${g.camp} n° ${g.numero} ply ${ply} ${san} (S ${p.S}, tendance +${p.tendance}, D ${p.D} → ${p.Dapres})${perdue === 'perdues' ? ' PERDUE' : ''}`); }
      }
      c.move(san);
    });
    for (const k of CANDS) if (allume[k]) { x[k]++; y[k]++; if (perdue === 'perdues') y[k === 'dame' ? 'perduesDame' : 'perduesPression']++; }
  }
}
const pc = (n, d) => (d ? `${((100 * n) / d).toFixed(1).replace('.', ',')} %` : '—');
const A = t.autres, P = t.perdues;
console.log(`${A.parties + P.parties} parties : ${A.parties} non perdues, ${P.parties} perdues ; pas de plan joués : ${A.pas + P.pas}\n`);
console.log('seuils (écrits avant) : non perdues allumées < 5 % ; perdues allumées > 20 % ; Tarrasch ouvert (deux camps) ≤ 2 parties\n');
for (const k of CANDS) {
  const tar = (parDep['fr-tarrasch-ouvert w']?.[k] ?? 0) + (parDep['fr-tarrasch-ouvert b']?.[k] ?? 0);
  const ok = [A[k] / (A.parties || 1) < 0.05, P.parties > 0 && P[k] / P.parties > 0.2, tar <= 2];
  console.log(`candidat ${k.padEnd(8)} : non perdues ${A[k]}/${A.parties} (${pc(A[k], A.parties)}) ${ok[0] ? 'oui' : 'NON'} ; perdues ${P[k]}/${P.parties} (${pc(P[k], P.parties)}) ${ok[1] ? 'oui' : 'NON'} ; Tarrasch ouvert ${tar} ${ok[2] ? 'oui' : 'NON'} → ${ok.every(Boolean) ? 'PASSE' : 'échoue'}`);
}
console.log('\ndépart-camp : parties | perdues | dame (dont perdues) | pression (dont perdues)');
for (const [k, y] of Object.entries(parDep).sort()) console.log(`  ${k.padEnd(24)} ${y.parties} | ${y.perdues} | ${y.dame} (${y.perduesDame}) | ${y.pression} (${y.perduesPression})`);
console.log('\nchaque allumage :'); for (const l of details) console.log(`  ${l}`);
