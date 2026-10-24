/**
 * Un `Joueur` factice (docs/coach-joueur/CHANTIERS-2026-10-24.md, « qui fait quoi ») : il joue un coup légal au hasard,
 * reproductible par une graine, et remplit tous les champs du contrat page 3 avec une phrase bidon. Il n'évalue rien et
 * n'appelle aucun moteur — c'est le point : le Dev chef construit l'arène, l'examinateur et le lecteur CONTRE cette classe,
 * pendant que le pilote écrit le vrai cerveau. Le vrai `Joueur` expose la même interface :
 *
 *   new Joueur({ camp: 'w'|'b', budget: 400000, code: '<commit>' })
 *   async choisir(fen, contexte) → l'enregistrement de coup du contrat (page 3)
 *
 * `contexte` ne contient QUE { camp, ply, budget } — jamais un moteur ni une évaluation (principe 2 du GE).
 */
import { Chess } from 'chess.js';
import { createHash } from 'node:crypto';

/** Tirage reproductible indexé par la position (comme `coach/maia.mjs`) : hash(fen|graine) → [0,1[. */
function alea(fen, graine) {
  const h = createHash('sha256').update(`${fen}|${graine}`).digest();
  return h.readUInt32BE(0) / 2 ** 32;
}

export class Joueur {
  constructor({ camp = 'w', budget = 400000, code = 'factice', graine = 1 } = {}) {
    this.camp = camp;
    this.budget = budget;
    this.code = code;
    this.graine = graine;
  }

  /**
   * Un coup légal, choisi par la graine, avec les champs du contrat. Aucune lecture de moteur : `contexte` est ignoré
   * au-delà de `ply`, et la classe ne reçoit ni éval ni ligne de Stockfish.
   * @returns l'enregistrement de coup (page 3), ou null si la position est finie.
   */
  async choisir(fen, contexte = {}) {
    const jeu = new Chess(fen);
    const coups = jeu.moves({ verbose: true });
    if (!coups.length) return null;
    const u = alea(fen, this.graine);
    const i = Math.min(coups.length - 1, Math.floor(u * coups.length));
    const choisi = coups[i];
    const battu = coups.find((m) => m !== choisi) ?? null;
    const uciDe = (m) => m.from + m.to + (m.promotion ?? '');
    const sorte = ['plan', 'amelioration', 'defense', 'calcul', 'livre'][Math.floor(alea(fen, this.graine + 1) * 5)];
    return {
      ply: contexte.ply ?? jeu.moveNumber() * 2 - (jeu.turn() === 'w' ? 1 : 0),
      camp: jeu.turn(),
      san: choisi.san,
      uci: uciDe(choisi),
      fenAvant: fen,
      coach: true,
      sorte,
      phrase: `(factice) je joue ${choisi.san}${battu ? `, de préférence à ${battu.san}` : ''} — rien de vérifié ici.`,
      score: 0,
      evalAvant: 0,
      battu: battu ? { san: battu.san, score: 0, ecart: 0, seValent: true } : null,
      ligne: [choisi.san],
      ligneBattu: battu ? [battu.san] : [],
      termes: [{ nom: 'bidon', apres: 0, bout: 0 }],
      menace: null,
      motif: null,
      plan: sorte === 'plan' ? { nom: 'plan bidon', distance: 0, cumul: 0 } : null,
      profondeur: 1,
      noeuds: 0,
    };
  }
}
