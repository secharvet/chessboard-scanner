/**
 * La recherche du coach joueur : alpha-bêta en approfondissement itératif, quiescence sur les prises, table de
 * transposition, coups « killers », prolongation sur échec. Budget fixe en nombre de positions visitées et un seul fil :
 * même position, même coup, toujours (docs/coach-joueur/CHANTIERS-2026-10-24.md, page 1).
 *
 * Elle rend, pour la trace, les candidats de la racine avec un score EXACT pour les meilleurs (re-recherche à fenêtre
 * ouverte), leur ligne principale, la profondeur atteinte et le nombre de positions visitées. Répétition et règle des
 * 50 coups valent 0 dans la recherche (antithèse de l'Expert, § 2.5).
 */
import { Echiquier, CAPTURE, PROMOTION, EN_PASSANT, de, vers, drapeaux, promotion, type, uci } from './echiquier.mjs';
import { evaluer, VALEUR_MG } from './evaluation.mjs';

export const INFINI = 100000, MAT = 30000;
const MAX_PLY = 64;
const TT_BITS = 20, TT_TAILLE = 1 << TT_BITS, TT_MASQUE = TT_TAILLE - 1;
const EXACT = 1, BORNE_INF = 2, BORNE_SUP = 3;

export class Recherche {
  constructor({ budget = 400000, candidatsExacts = 4 } = {}) {
    this.budget = budget; this.candidatsExacts = candidatsExacts;
    this.ttHi = new Int32Array(TT_TAILLE); this.ttLo = new Int32Array(TT_TAILLE); this.ttScore = new Int32Array(TT_TAILLE);
    this.ttCoup = new Int32Array(TT_TAILLE); this.ttProf = new Int8Array(TT_TAILLE); this.ttFlag = new Uint8Array(TT_TAILLE);
    this.coups = Array.from({ length: MAX_PLY + 8 }, () => new Int32Array(256));
    this.notes = Array.from({ length: MAX_PLY + 8 }, () => new Int32Array(256));
    this.killers = Array.from({ length: MAX_PLY + 8 }, () => [0, 0]);
    this.pv = Array.from({ length: MAX_PLY + 8 }, () => new Int32Array(MAX_PLY + 8));
    this.pvLen = new Int32Array(MAX_PLY + 8);
  }

  viderTable() { this.ttFlag.fill(0); }

  // ---- table de transposition ----
  #ttLire(ech) { const i = ech.lo & TT_MASQUE; return this.ttFlag[i] && this.ttHi[i] === ech.hi && this.ttLo[i] === ech.lo ? i : -1; }
  #ttEcrire(ech, prof, score, flag, coup) {
    const i = ech.lo & TT_MASQUE;
    if (this.ttFlag[i] && this.ttHi[i] === ech.hi && this.ttLo[i] === ech.lo && this.ttProf[i] > prof && flag !== EXACT) return;
    this.ttHi[i] = ech.hi; this.ttLo[i] = ech.lo; this.ttScore[i] = score; this.ttFlag[i] = flag; this.ttProf[i] = prof; this.ttCoup[i] = coup;
  }

  // ---- ordre des coups ----
  #noterCoups(ech, liste, notes, n, ply, coupTT) {
    const c = ech.cases;
    for (let i = 0; i < n; i++) {
      const m = liste[i], fl = drapeaux(m);
      let s = 0;
      if (m === coupTT) s = 1000000;
      else if (fl & CAPTURE) { const victime = (fl & EN_PASSANT) ? 1 : type(c[vers(m)]); s = 100000 + VALEUR_MG[victime] * 8 - VALEUR_MG[type(c[de(m)])] / 16; }
      else if (fl & PROMOTION) s = 90000 + VALEUR_MG[promotion(m)];
      else if (m === this.killers[ply][0]) s = 80000; else if (m === this.killers[ply][1]) s = 79000;
      notes[i] = s;
    }
  }
  #prochain(liste, notes, n, i) { // sélection : amène en i le meilleur des restants
    let b = i; for (let j = i + 1; j < n; j++) if (notes[j] > notes[b]) b = j;
    if (b !== i) { const m = liste[i]; liste[i] = liste[b]; liste[b] = m; const s = notes[i]; notes[i] = notes[b]; notes[b] = s; }
    return liste[i];
  }

  // ---- quiescence ----
  #quiescence(ech, alpha, beta, ply) {
    this.pvLen[ply] = 0; // la ligne principale continue dans la quiescence : les prises qui suivent font partie de la preuve
    this.noeuds++;
    if (this.noeuds > this.budget && this.profondeurEnCours > 1) this.arret = true;
    const statique = evaluer(ech);
    if (statique >= beta) return statique;
    if (statique > alpha) alpha = statique;
    if (ply >= MAX_PLY) return statique;
    const liste = this.coups[ply], notes = this.notes[ply];
    const n = ech.genererPseudo(liste, 0, true);
    this.#noterCoups(ech, liste, notes, n, ply, 0);
    let meilleur = statique;
    for (let i = 0; i < n; i++) {
      const m = this.#prochain(liste, notes, n, i);
      if (!ech.jouer(m)) continue;
      const v = -this.#quiescence(ech, -beta, -alpha, ply + 1);
      ech.reprendre();
      if (this.arret) return meilleur;
      if (v > meilleur) {
        meilleur = v;
        if (v > alpha) {
          alpha = v;
          this.pv[ply][0] = m; for (let j = 0; j < this.pvLen[ply + 1]; j++) this.pv[ply][j + 1] = this.pv[ply + 1][j]; this.pvLen[ply] = this.pvLen[ply + 1] + 1;
          if (v >= beta) return v;
        }
      }
    }
    return meilleur;
  }

  // ---- alpha-bêta ----
  #alphabeta(ech, prof, alpha, beta, ply) {
    this.pvLen[ply] = 0;
    if (ply > 0 && (ech.repetitions() >= 1 || ech.demi >= 100)) return 0;
    const enEchec = ech.enEchec();
    if (enEchec && ply < MAX_PLY - 1) prof++;
    if (prof <= 0) return this.#quiescence(ech, alpha, beta, ply);
    this.noeuds++;
    if (this.noeuds > this.budget && this.profondeurEnCours > 1) this.arret = true;
    const alpha0 = alpha;
    let coupTT = 0;
    const i = this.#ttLire(ech);
    if (i >= 0) {
      coupTT = this.ttCoup[i];
      if (ply > 0 && this.ttProf[i] >= prof) {
        const s = this.ttScore[i], f = this.ttFlag[i];
        if (f === EXACT) return s;
        if (f === BORNE_INF && s >= beta) return s;
        if (f === BORNE_SUP && s <= alpha) return s;
      }
    }
    const liste = this.coups[ply], notes = this.notes[ply];
    const n = ech.genererPseudo(liste, 0, false);
    this.#noterCoups(ech, liste, notes, n, ply, coupTT);
    let meilleur = -INFINI, meilleurCoup = 0, legaux = 0;
    for (let k = 0; k < n; k++) {
      const m = this.#prochain(liste, notes, n, k);
      if (!ech.jouer(m)) continue;
      legaux++;
      const v = -this.#alphabeta(ech, prof - 1, -beta, -alpha, ply + 1);
      ech.reprendre();
      if (this.arret) return meilleur;
      if (v > meilleur) {
        meilleur = v; meilleurCoup = m;
        if (v > alpha) {
          alpha = v;
          this.pv[ply][0] = m; for (let j = 0; j < this.pvLen[ply + 1]; j++) this.pv[ply][j + 1] = this.pv[ply + 1][j]; this.pvLen[ply] = this.pvLen[ply + 1] + 1;
          if (v >= beta) {
            if (!(drapeaux(m) & CAPTURE)) { const kl = this.killers[ply]; if (kl[0] !== m) { kl[1] = kl[0]; kl[0] = m; } }
            break;
          }
        }
      }
    }
    if (!legaux) return enEchec ? -MAT + ply : 0;
    this.#ttEcrire(ech, prof, meilleur, meilleur <= alpha0 ? BORNE_SUP : meilleur >= beta ? BORNE_INF : EXACT, meilleurCoup);
    return meilleur;
  }

  /**
   * Choisit un coup. Rend { coup, score, pv: [coups], profondeur, noeuds, candidats: [{ coup, score, pv, exact }] }
   * (scores internes du point de vue du trait ; les `candidatsExacts` meilleurs ont un score exact).
   */
  chercher(ech, { budget = this.budget, profondeurMax = MAX_PLY - 2 } = {}) {
    this.budget = budget; this.noeuds = 0; this.arret = false;
    this.viderTable(); // même position, même coup, quel que soit le chemin : rien ne survit d'un coup à l'autre
    for (const kl of this.killers) { kl[0] = 0; kl[1] = 0; }
    const racine = ech.coups();
    if (!racine.length) return { coup: 0, score: ech.enEchec() ? -MAT : 0, pv: [], profondeur: 0, noeuds: 0, candidats: [] };
    let candidats = racine.map((m) => ({ coup: m, score: -INFINI, pv: [m], exact: false }));
    let profondeur = 0;
    for (let prof = 1; prof <= profondeurMax; prof++) {
      if (prof > 1 && this.noeuds > budget / 2) break; // une itération coûte deux à trois fois la précédente : on ne la commence que si elle a une chance de finir
      this.profondeurEnCours = prof; this.budget = budget;
      const essai = candidats.map((c) => ({ ...c, score: -INFINI, exact: false }));
      const nOuverts = Math.min(this.candidatsExacts, essai.length);
      let alpha = -INFINI, fini = true;
      for (let k = 0; k < essai.length; k++) {
        const cand = essai[k];
        // Les meilleurs de l'itération précédente sont cherchés à fenêtre ouverte : leur score est exact d'emblée.
        const ouvert = k < nOuverts;
        ech.jouer(cand.coup);
        let v = -this.#alphabeta(ech, prof - 1, -INFINI, ouvert ? INFINI : -alpha, 1);
        const pv = [cand.coup, ...Array.from(this.pv[1].subarray(0, this.pvLen[1]))];
        ech.reprendre();
        if (this.arret) { fini = false; break; }
        cand.score = v; cand.pv = pv; cand.exact = ouvert || v > alpha;
        if (v > alpha) alpha = v;
      }
      if (!fini) break;
      essai.sort((a, b) => b.score - a.score);
      // Scores exacts pour les meilleurs candidats (fenêtre ouverte), pour la comparaison M / R de la parole. Une borne
      // supérieure est optimiste et remonte dans le tri : on recommence jusqu'à ce que les premiers soient tous exacts.
      const nExacts = Math.min(this.candidatsExacts, essai.length);
      this.budget = budget * 2; // la re-recherche a droit à une rallonge : un R exact vaut ce prix
      for (let tours = 0; tours < 3 * nExacts && !this.arret; tours++) {
        const k = essai.findIndex((cand, i) => i < nExacts && !cand.exact);
        if (k < 0) break;
        const cand = essai[k];
        ech.jouer(cand.coup);
        const v = -this.#alphabeta(ech, prof - 1, -INFINI, INFINI, 1);
        const pv = [cand.coup, ...Array.from(this.pv[1].subarray(0, this.pvLen[1]))];
        ech.reprendre();
        if (this.arret) break;
        cand.score = v; cand.pv = pv; cand.exact = true;
        essai.sort((a, b) => b.score - a.score);
      }
      candidats = essai; profondeur = prof;
      if (this.arret) break; // la re-recherche a dépassé le budget : on garde l'ordre de cette profondeur
      if (Math.abs(candidats[0].score) >= MAT - MAX_PLY) break; // mat trouvé
    }
    const m = candidats[0];
    return { coup: m.coup, score: m.score, pv: m.pv, profondeur, noeuds: this.noeuds, candidats };
  }

  /** Score exact d'un coup donné à une profondeur donnée (fenêtre ouverte) : { score, pv }. Pour le coup du livre. */
  noterCoup(ech, coup, { prof = 4, budget = this.budget } = {}) {
    this.budget = budget; this.noeuds = 0; this.arret = false; this.profondeurEnCours = 1;
    ech.jouer(coup);
    const v = -this.#alphabeta(ech, Math.max(0, prof - 1), -INFINI, INFINI, 1);
    const pv = [coup, ...Array.from(this.pv[1].subarray(0, this.pvLen[1]))];
    ech.reprendre();
    return { score: v, pv, noeuds: this.noeuds };
  }

  /**
   * La menace adverse : ce que l'adversaire ferait si l'on passait (coup nul), recherche courte. Rend
   * { score, pv } du point de vue de l'adversaire, ou null si l'on est en échec (le coup nul n'a pas de sens).
   */
  menace(ech, { budget = 60000, profondeurMax = 4 } = {}) {
    if (ech.enEchec()) return null;
    ech.jouerNul();
    const r = this.chercher(ech, { budget, profondeurMax });
    ech.reprendreNul();
    return r.coup ? { score: r.score, pv: r.pv, profondeur: r.profondeur } : null;
  }
}

export const pvEnUci = (pv) => pv.map(uci);
