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
    return { demiCoup: l.demi_coup, camp: l.camp, themes: l.themes, arbres: l.arbres, attendu: l.attendu ?? null };
  } catch { return null; } finally { clearTimeout(timer); }
}

/** Thèmes qui disent quelque chose par eux-mêmes ; « manœuvre », « tactique », « initiative » restent muets sans contenu. */
const CONCRETS = new Set(['attaque_roi', 'defense_roi', 'colonne_ouverte', 'structure_pions', 'case_faible_avant_poste', 'echange_pieces', 'developpement', 'centre_espace', 'levier_rupture', 'prophylaxie', 'blocus', 'aile_dame', 'finale', 'materiel']);
const zone = (sq) => { const f = sq.charCodeAt(0) - 97; return f <= 2 ? 'aile dame' : f >= 5 ? 'aile roi' : 'centre'; };

/** Texte court pour la fiche : cases attendues des deux camps, thèmes concrets, phrase de l'arbre. */
export function texteLecture(l) {
  if (!l || l.tropTot) return '';
  const parts = [];
  if (l.attendu?.w && l.attendu?.b) {
    const top = (arr) => arr.filter((c) => c.p >= 0.25).slice(0, 3);
    const w = top(l.attendu.w); const b = top(l.attendu.b);
    const dire = (camp, arr) => arr.length ? `${camp} vers ${arr.map((c) => c.case).join(', ')} (${[...new Set(arr.map((c) => zone(c.case)))].join(' et ')})` : '';
    const d = [dire('les Blancs', w), dire('les Noirs', b)].filter(Boolean);
    if (d.length) parts.push(`D'après des milliers de parties semblables, les prochains coups iront plutôt : ${d.join(' ; ')}.`);
  }
  const th = l.themes.filter((t) => CONCRETS.has(t.theme) && t.p >= 0.2 && (t.x >= 1.5 || t.p >= 0.5)).slice(0, 2).map((t) => `${t.libelle} (${Math.round(t.p * 100)} %)`);
  if (th.length) parts.push(`Thèmes du moment : ${th.join(', ')}.`);
  const a = l.arbres.find((x) => x.nom && x.sens);
  if (a && a.sim >= 0.4) parts.push(`Séquence proche de « ${a.nom} » : ${a.sens.replace(/\s+/g, ' ').slice(0, 180)}${a.sens.length > 180 ? '…' : ''}`);
  return parts.join(' ');
}
