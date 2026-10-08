/**
 * Client du lecteur (scripts/arbres/lecteur.py serveur) : pour la partie en cours (coups depuis le début), ce que le modèle
 * appris sur l'échiquier brut voit dans les 40 derniers demi-coups : thèmes des maîtres (probabilités) et arbres voisins nommés.
 * Activé par COACH_LECTEUR=1 ; silencieux si le service est absent ou lent (jamais bloquant). Aucune décision : il PROPOSE.
 */
import { Chess } from 'chess.js';
import { plateaux } from '../scripts/plateaux.mjs';
const URL = process.env.LECTEUR_URL ?? 'http://127.0.0.1:8002/lecture';
const TIMEOUT_MS = Number(process.env.LECTEUR_TIMEOUT_MS ?? 1500);

/** @param {string[]} moves coups SAN (ou UCI) depuis la position initiale */
export async function lireLaPartie(moves) {
  if (process.env.COACH_LECTEUR !== '1' || !Array.isArray(moves) || !moves.length) return null;
  const c = new Chess(); const uci = [];
  for (const m of moves) { let mv; try { mv = /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(m) ? c.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] }) : c.move(m); } catch { return null; } uci.push(mv.from + mv.to + (mv.promotion ?? '')); }
  const rows = plateaux(uci); if (!rows.length) return null;
  const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plateaux: Buffer.concat(rows).toString('base64') }), signal: ctrl.signal });
    if (!res.ok) return null;
    const j = await res.json(); if (!j.ok) return null;
    if (j.trop_tot) return { tropTot: true, demiCoups: j.demi_coups, fenetre: j.fenetre };
    const l = j.lectures?.[0]; if (!l) return null;
    return { demiCoup: l.demi_coup, camp: l.camp, themes: l.themes, arbres: l.arbres };
  } catch { return null; } finally { clearTimeout(timer); }
}

/** Texte court pour la fiche : thèmes saillants (× ≥ 1,3 ou p ≥ 0,5) et le premier arbre nommé. */
export function texteLecture(l) {
  if (!l || l.tropTot) return '';
  const th = l.themes.filter((t) => t.x >= 1.3 || t.p >= 0.5).slice(0, 3).map((t) => `${t.libelle} (${Math.round(t.p * 100)} %)`);
  const a = l.arbres.find((x) => x.nom);
  const parts = [];
  if (th.length) parts.push(`Dans les derniers coups, je vois surtout : ${th.join(', ')}.`);
  if (a) parts.push(`La séquence ressemble à « ${a.nom} » (${a.parties.toLocaleString('fr-FR')} parties).`);
  return parts.join(' ');
}
