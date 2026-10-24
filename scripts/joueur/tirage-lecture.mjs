#!/usr/bin/env node
/**
 * Le tirage de la lecture humaine (condition 5 de l'épreuve : « ≥ 15 explications sur 20 jugées fidèles par un humain ») :
 * N coups du coach tirés au sort, graine affichée, dans les parties d'un dossier. Les coups du livre sont exclus (leur phrase
 * est celle du livre, pas un raisonnement du coach) ; les coups sans phrase restent (une absence de phrase compte faux).
 * Tirage par sorte (avis de l'Expert, 25 oct.) : 5 calculs, 5 défenses, 10 coups calmes (amélioration, plan, finale), pour
 * que les coups calmes — le cœur de la question « explique-t-il comme un joueur ? » — ne soient pas noyés.
 * Sortie : un fichier JSON lu par lecture.html (position avant le coup, coup joué, phrase, et de quoi retrouver le coup).
 *
 *   node scripts/joueur/tirage-lecture.mjs <dossier des parties> --graine 20261025 > parties/lecture-<date>.json
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Chess } from '../../vendor/chess.js';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dossier = args[0];
if (!dossier) { console.error('usage : node scripts/joueur/tirage-lecture.mjs <dossier> --graine N [--n 20]'); process.exit(2); }
const GRAINE = Number(opt('--graine', 20261025));
const STRATES = [{ nom: 'calcul', n: 5, sortes: ['calcul'] }, { nom: 'défense', n: 5, sortes: ['defense'] }, { nom: 'calme', n: 10, sortes: ['amelioration', 'plan', 'finale'] }];

const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const fichiers = readdirSync(dossier).filter((f) => f.endsWith('.json') && f !== 'index.json').sort();
const urne = [];
let nParties = 0;
for (const f of fichiers) {
  const p = JSON.parse(readFileSync(join(dossier, f), 'utf8'));
  if (!Array.isArray(p.coups)) continue; // fichiers de bilan du dossier
  nParties++;
  const jeu = new Chess(p.depart);
  for (const c of p.coups) {
    const fenAvant = jeu.fen();
    jeu.move({ from: c.uci.slice(0, 2), to: c.uci.slice(2, 4), promotion: c.uci[4] || undefined });
    if (c.coach && c.sorte !== 'livre') urne.push({ partie: p.id, code: p.coach.code, ply: c.ply, camp: c.camp, san: c.san, uci: c.uci, fenAvant, phrase: c.phrase ?? null, sorte: c.sorte });
  }
}
const rng = mulberry32(GRAINE);
const coups = [], strates = {};
for (const st of STRATES) {
  const pot = urne.filter((c) => st.sortes.includes(c.sorte));
  for (let i = pot.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [pot[i], pot[j]] = [pot[j], pot[i]]; }
  coups.push(...pot.slice(0, st.n).map((c) => ({ ...c, strate: st.nom })));
  strates[st.nom] = { tires: Math.min(st.n, pot.length), sur: pot.length };
}
// Ordre de lecture mélangé (sinon les cinq calculs arrivent ensemble et la strate se devine)
for (let i = coups.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [coups[i], coups[j]] = [coups[j], coups[i]]; }
process.stdout.write(JSON.stringify({ graine: GRAINE, source: dossier.replace(/.*\//, ''), parties: nParties, urne: urne.length, strates, coups }, null, 1) + '\n');
console.error(`tirage : ${coups.length} coups sur ${urne.length} (hors livre), ${nParties} parties, graine ${GRAINE} — ` + Object.entries(strates).map(([k, v]) => `${k} ${v.tires}/${v.sur}`).join(', '));
