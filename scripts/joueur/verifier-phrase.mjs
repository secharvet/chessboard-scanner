#!/usr/bin/env node
/**
 * Le harnais qui VÉRIFIE les phrases comparatives du joueur-arbre (demande du GE, CHANTIER-ARBRE-2026-10-25).
 *
 * Pour chaque coup du coach qui DIT un coup écarté (« j'ai pensé à X, mais … je perdais Y »), on rejoue la ligne de ce
 * coup écarté depuis la position, on compte le matériel au bout, et on contrôle que ce que la phrase annonce (une perte
 * de matériel, ou que c'était perdu / mat) est bien ce que la ligne montre. Un désaccord = une alerte, comme
 * l'examinateur pour les menaces non parées. Aucun moteur : on ne fait que rejouer et compter (hors ligne).
 *
 *   node scripts/joueur/verifier-phrase.mjs parties/<id>.json
 *
 * Rend 0 si tout concorde, 1 s'il y a au moins une alerte (et les liste).
 */
import { readFileSync } from 'node:fs';
import { Chess } from 'chess.js';

const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Matériel net (en pions) du point de vue de `camp` dans une FEN. */
function materiel(fen, camp) { let s = 0; for (const ch of fen.split(' ')[0]) { const l = ch.toLowerCase(); if (!VAL[l]) continue; s += (ch === ch.toUpperCase() ? 'w' : 'b') === camp ? VAL[l] : -VAL[l]; } return s; }

/** Rejoue une ligne UCI depuis une FEN ; rend la FEN au bout et si la ligne finit par un mat. */
function rejouer(fen, pvUci) {
  const c = new Chess(fen);
  for (const u of pvUci ?? []) { try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; } }
  return { fen: c.fen(), mat: c.isCheckmate() };
}

/** Vérifie les phrases comparatives d'une partie. Rend la liste des alertes (chaîne par coup fautif). */
export function verifierPhrases(partie) {
  const camp = partie.coach?.camp ?? 'w';
  const alertes = [];
  for (const coup of partie.coups ?? []) {
    if (!coup.coach || !coup.ecarte) continue;
    const e = coup.ecarte;
    const repere = `${coup.ply}. ${coup.san} (écarté ${e.san})`;
    // Sans ligne UCI de l'écarté, on ne peut pas rejouer : on le signale (le joueur doit la fournir).
    if (!Array.isArray(e.pvUci) || !e.pvUci.length) { alertes.push(`${repere} : pas de ligne à vérifier pour le coup écarté`); continue; }
    const avant = materiel(coup.fenAvant, camp);
    const bout = rejouer(coup.fenAvant, e.pvUci);
    const delta = materiel(bout.fen, camp) - avant; // ce que le coach GAGNE dans la ligne de l'écarté (négatif = il perd)
    const annonceMat = !!e.mat || /\bmat\b|perdu/i.test(e.perte ?? '') || /\bmat\b|c'était perdu/i.test(coup.phrase ?? '');
    if (annonceMat) {
      if (!bout.mat && delta >= 0) alertes.push(`${repere} : la phrase annonce « c'était perdu / mat » mais la ligne ne le montre pas (Δmatériel ${delta}, mat ${bout.mat})`);
    } else {
      // la phrase annonce une PERTE de matériel : la ligne du coup écarté doit faire perdre du matériel au coach
      if (delta >= 0) alertes.push(`${repere} : la phrase annonce « je perdais ${e.perte} » mais la ligne ne perd rien (Δmatériel ${delta})`);
    }
  }
  return alertes;
}

function main() {
  const chemin = process.argv[2];
  if (!chemin) { console.error('usage : node scripts/joueur/verifier-phrase.mjs parties/<id>.json'); process.exit(2); }
  const partie = JSON.parse(readFileSync(chemin, 'utf8'));
  const alertes = verifierPhrases(partie);
  const n = (partie.coups ?? []).filter((c) => c.coach && c.ecarte).length;
  if (!alertes.length) { console.log(`✓ ${n} phrase(s) comparative(s) vérifiée(s), aucune alerte`); process.exit(0); }
  console.log(`✗ ${alertes.length} alerte(s) sur ${n} phrase(s) comparative(s) :`);
  for (const a of alertes) console.log(`   ${a}`);
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
