/**
 * L'échiquier du coach joueur (docs/coach-joueur/CHANTIERS-2026-10-24.md, page 1).
 *
 * Représentation 0x88 : 128 cases, l'index d'une case vaut rangée × 16 + colonne, une case hors échiquier a le bit 0x88.
 * Un coup est un entier : from | to << 7 | promotion << 14 | drapeaux << 17. Les coups sont générés pseudo-légaux, puis
 * filtrés par « mon roi est-il en prise après le coup ». Coup joué / coup repris par une pile d'annulation. Clé de Zobrist
 * en deux entiers de 32 bits (table de transposition, répétitions).
 *
 * Ce module ne connaît ni la notation SAN ni l'évaluation : il ne fait que les règles. Il est vérifié par le comptage
 * exhaustif des coups (perft) sur les positions de référence (tests/joueur-echiquier.test.js).
 */

export const VIDE = 0, PION = 1, CAVALIER = 2, FOU = 3, TOUR = 4, DAME = 5, ROI = 6;
export const BLANC = 0, NOIR = 8;
export const type = (p) => p & 7;
export const couleur = (p) => p & 8;

export const CAPTURE = 1, DOUBLE = 2, EN_PASSANT = 4, ROQUE = 8, PROMOTION = 16;
export const de = (m) => m & 127;
export const vers = (m) => (m >> 7) & 127;
export const promotion = (m) => (m >> 14) & 7;
export const drapeaux = (m) => m >> 17;
const coup = (from, to, promo = 0, flags = 0) => from | (to << 7) | (promo << 14) | (flags << 17);

export const case88 = (file, rank) => rank * 16 + file;
export const colonne = (sq) => sq & 7;
export const rangee = (sq) => sq >> 4;
export const horsJeu = (sq) => (sq & 0x88) !== 0;
export const nomCase = (sq) => 'abcdefgh'[sq & 7] + (1 + (sq >> 4));
export const caseDepuisNom = (s) => case88(s.charCodeAt(0) - 97, s.charCodeAt(1) - 49);

const LETTRES = { p: PION, n: CAVALIER, b: FOU, r: TOUR, q: DAME, k: ROI };
const LETTRE_DE = ['', 'p', 'n', 'b', 'r', 'q', 'k'];
const PAS_CAVALIER = [-33, -31, -18, -14, 14, 18, 31, 33];
const PAS_ROI = [-17, -16, -15, -1, 1, 15, 16, 17];
const PAS_FOU = [-17, -15, 15, 17];
const PAS_TOUR = [-16, -1, 1, 16];

const ROQUE_BR = 1, ROQUE_BD = 2, ROQUE_NR = 4, ROQUE_ND = 8; // blancs roi/dame, noirs roi/dame
const MASQUE_ROQUE = new Uint8Array(128).fill(15);
MASQUE_ROQUE[4] = 12; MASQUE_ROQUE[0] = 13; MASQUE_ROQUE[7] = 14;
MASQUE_ROQUE[116] = 3; MASQUE_ROQUE[112] = 7; MASQUE_ROQUE[119] = 11;

// Zobrist : générateur déterministe (xorshift), mêmes clés à chaque lancement.
let graine = 0x9e3779b9 | 0;
const alea32 = () => { graine ^= graine << 13; graine ^= graine >>> 17; graine ^= graine << 5; return graine | 0; };
const Z_PIECE = Array.from({ length: 16 }, () => new Int32Array(128).map(alea32));
const Z_PIECE_HI = Array.from({ length: 16 }, () => new Int32Array(128).map(alea32));
const Z_TRAIT = alea32(), Z_TRAIT_HI = alea32();
const Z_ROQUE = new Int32Array(16).map(alea32), Z_ROQUE_HI = new Int32Array(16).map(alea32);
const Z_EP = new Int32Array(8).map(alea32), Z_EP_HI = new Int32Array(8).map(alea32);

export const DEPART = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class Echiquier {
  constructor(fen = DEPART) {
    this.cases = new Int8Array(128);
    this.rois = [0, 0]; // [blanc, noir] : case du roi
    this.pile = []; // annulations : {m, prise, roque, ep, demi, lo, hi}
    this.historique = []; // clés (lo) depuis le début, pour les répétitions
    this.chargerFen(fen);
  }

  chargerFen(fen) {
    const [pos, trait, roque, ep, demi, numero] = fen.trim().split(/\s+/);
    this.cases.fill(VIDE);
    let rank = 7, file = 0;
    for (const c of pos) {
      if (c === '/') { rank--; file = 0; continue; }
      if (c >= '1' && c <= '8') { file += +c; continue; }
      const p = LETTRES[c.toLowerCase()] | (c === c.toLowerCase() ? NOIR : BLANC);
      this.cases[case88(file, rank)] = p;
      if (type(p) === ROI) this.rois[couleur(p) >> 3] = case88(file, rank);
      file++;
    }
    this.trait = trait === 'b' ? NOIR : BLANC;
    this.roque = 0;
    if (roque && roque !== '-') { if (roque.includes('K')) this.roque |= ROQUE_BR; if (roque.includes('Q')) this.roque |= ROQUE_BD; if (roque.includes('k')) this.roque |= ROQUE_NR; if (roque.includes('q')) this.roque |= ROQUE_ND; }
    this.ep = ep && ep !== '-' ? caseDepuisNom(ep) : -1;
    this.demi = demi ? +demi : 0;
    this.numero = numero ? +numero : 1;
    this.pile.length = 0;
    this.#recalculerCle();
    this.historique = [this.lo];
  }

  fen() {
    let s = '';
    for (let rank = 7; rank >= 0; rank--) {
      let vide = 0;
      for (let file = 0; file < 8; file++) {
        const p = this.cases[case88(file, rank)];
        if (!p) { vide++; continue; }
        if (vide) { s += vide; vide = 0; }
        const l = LETTRE_DE[type(p)]; s += couleur(p) === BLANC ? l.toUpperCase() : l;
      }
      if (vide) s += vide;
      if (rank) s += '/';
    }
    const r = (this.roque & ROQUE_BR ? 'K' : '') + (this.roque & ROQUE_BD ? 'Q' : '') + (this.roque & ROQUE_NR ? 'k' : '') + (this.roque & ROQUE_ND ? 'q' : '');
    return `${s} ${this.trait === BLANC ? 'w' : 'b'} ${r || '-'} ${this.ep >= 0 ? nomCase(this.ep) : '-'} ${this.demi} ${this.numero}`;
  }

  #recalculerCle() {
    let lo = 0, hi = 0;
    for (let sq = 0; sq < 128; sq++) { if (horsJeu(sq)) continue; const p = this.cases[sq]; if (p) { lo ^= Z_PIECE[p][sq]; hi ^= Z_PIECE_HI[p][sq]; } }
    if (this.trait === NOIR) { lo ^= Z_TRAIT; hi ^= Z_TRAIT_HI; }
    lo ^= Z_ROQUE[this.roque]; hi ^= Z_ROQUE_HI[this.roque];
    if (this.ep >= 0) { lo ^= Z_EP[colonne(this.ep)]; hi ^= Z_EP_HI[colonne(this.ep)]; }
    this.lo = lo; this.hi = hi;
  }

  /** La case `sq` est-elle attaquée par le camp `par` ? */
  attaquee(sq, par) {
    const c = this.cases;
    // pions
    if (par === BLANC) { if (!horsJeu(sq - 15) && c[sq - 15] === (PION | BLANC)) return true; if (!horsJeu(sq - 17) && c[sq - 17] === (PION | BLANC)) return true; }
    else { if (!horsJeu(sq + 15) && c[sq + 15] === (PION | NOIR)) return true; if (!horsJeu(sq + 17) && c[sq + 17] === (PION | NOIR)) return true; }
    const N = CAVALIER | par, K = ROI | par, B = FOU | par, R = TOUR | par, Q = DAME | par;
    for (const d of PAS_CAVALIER) { const t = sq + d; if (!horsJeu(t) && c[t] === N) return true; }
    for (const d of PAS_ROI) { const t = sq + d; if (!horsJeu(t) && c[t] === K) return true; }
    for (const d of PAS_FOU) { let t = sq + d; while (!horsJeu(t)) { const p = c[t]; if (p) { if (p === B || p === Q) return true; break; } t += d; } }
    for (const d of PAS_TOUR) { let t = sq + d; while (!horsJeu(t)) { const p = c[t]; if (p) { if (p === R || p === Q) return true; break; } t += d; } }
    return false;
  }

  enEchec(camp = this.trait) { return this.attaquee(this.rois[camp >> 3], camp ^ NOIR); }

  /** Coups pseudo-légaux du trait, écrits dans `liste` à partir de `n` ; rend le nouveau compte. */
  genererPseudo(liste, n = 0, prisesSeules = false) {
    const c = this.cases, nous = this.trait, eux = nous ^ NOIR;
    const avant = nous === BLANC ? 16 : -16, rangDepart = nous === BLANC ? 1 : 6, rangPromo = nous === BLANC ? 7 : 0;
    for (let sq = 0; sq < 128; sq++) {
      if (horsJeu(sq)) { sq += 7; continue; }
      const p = c[sq]; if (!p || couleur(p) !== nous) continue;
      const t = type(p);
      if (t === PION) {
        const un = sq + avant;
        if (!prisesSeules && !c[un]) {
          if (rangee(un) === rangPromo) { for (const pr of [DAME, CAVALIER, TOUR, FOU]) liste[n++] = coup(sq, un, pr, PROMOTION); }
          else { liste[n++] = coup(sq, un); if (rangee(sq) === rangDepart && !c[un + avant]) liste[n++] = coup(sq, un + avant, 0, DOUBLE); }
        } else if (prisesSeules && !c[un] && rangee(un) === rangPromo) liste[n++] = coup(sq, un, DAME, PROMOTION);
        for (const d of [avant - 1, avant + 1]) {
          const to = sq + d; if (horsJeu(to)) continue;
          const q = c[to];
          if (q && couleur(q) === eux) {
            if (rangee(to) === rangPromo) { for (const pr of [DAME, CAVALIER, TOUR, FOU]) liste[n++] = coup(sq, to, pr, PROMOTION | CAPTURE); }
            else liste[n++] = coup(sq, to, 0, CAPTURE);
          } else if (to === this.ep) liste[n++] = coup(sq, to, 0, EN_PASSANT | CAPTURE);
        }
      } else if (t === CAVALIER || t === ROI) {
        for (const d of (t === CAVALIER ? PAS_CAVALIER : PAS_ROI)) {
          const to = sq + d; if (horsJeu(to)) continue;
          const q = c[to];
          if (!q) { if (!prisesSeules) liste[n++] = coup(sq, to); }
          else if (couleur(q) === eux) liste[n++] = coup(sq, to, 0, CAPTURE);
        }
      } else {
        const pas = t === FOU ? PAS_FOU : t === TOUR ? PAS_TOUR : PAS_ROI;
        for (const d of pas) {
          let to = sq + d;
          while (!horsJeu(to)) {
            const q = c[to];
            if (!q) { if (!prisesSeules) liste[n++] = coup(sq, to); }
            else { if (couleur(q) === eux) liste[n++] = coup(sq, to, 0, CAPTURE); break; }
            to += d;
          }
        }
      }
    }
    if (!prisesSeules) {
      const roi = this.rois[nous >> 3];
      if (nous === BLANC && roi === 4) {
        if ((this.roque & ROQUE_BR) && !c[5] && !c[6] && c[7] === (TOUR | BLANC) && !this.attaquee(4, NOIR) && !this.attaquee(5, NOIR) && !this.attaquee(6, NOIR)) liste[n++] = coup(4, 6, 0, ROQUE);
        if ((this.roque & ROQUE_BD) && !c[3] && !c[2] && !c[1] && c[0] === (TOUR | BLANC) && !this.attaquee(4, NOIR) && !this.attaquee(3, NOIR) && !this.attaquee(2, NOIR)) liste[n++] = coup(4, 2, 0, ROQUE);
      } else if (nous === NOIR && roi === 116) {
        if ((this.roque & ROQUE_NR) && !c[117] && !c[118] && c[119] === (TOUR | NOIR) && !this.attaquee(116, BLANC) && !this.attaquee(117, BLANC) && !this.attaquee(118, BLANC)) liste[n++] = coup(116, 118, 0, ROQUE);
        if ((this.roque & ROQUE_ND) && !c[115] && !c[114] && !c[113] && c[112] === (TOUR | NOIR) && !this.attaquee(116, BLANC) && !this.attaquee(115, BLANC) && !this.attaquee(114, BLANC)) liste[n++] = coup(116, 114, 0, ROQUE);
      }
    }
    return n;
  }

  /** Les coups légaux du trait (tableau neuf : racine, tests, interface). */
  coups() {
    const buf = new Int32Array(256), n = this.genererPseudo(buf), out = [];
    for (let i = 0; i < n; i++) { if (this.jouer(buf[i])) { out.push(buf[i]); this.reprendre(); } }
    return out;
  }

  /**
   * Joue le coup ; rend false (et ne laisse rien) si le coup laisse notre roi en prise. Met à jour la clé, les droits de
   * roque, la case en passant, le compteur des 50 coups, la pile et l'historique.
   */
  jouer(m) {
    const c = this.cases, from = de(m), to = vers(m), fl = drapeaux(m), nous = this.trait, eux = nous ^ NOIR;
    const p = c[from]; let prise = c[to];
    this.pile.push({ m, prise, roque: this.roque, ep: this.ep, demi: this.demi, lo: this.lo, hi: this.hi, roi: this.rois[nous >> 3] });
    let lo = this.lo, hi = this.hi;
    if (this.ep >= 0) { lo ^= Z_EP[colonne(this.ep)]; hi ^= Z_EP_HI[colonne(this.ep)]; }
    lo ^= Z_ROQUE[this.roque]; hi ^= Z_ROQUE_HI[this.roque];
    if (fl & EN_PASSANT) { const cap = to + (nous === BLANC ? -16 : 16); prise = c[cap]; c[cap] = VIDE; lo ^= Z_PIECE[prise][cap]; hi ^= Z_PIECE_HI[prise][cap]; this.pile[this.pile.length - 1].prise = prise; }
    else if (prise) { lo ^= Z_PIECE[prise][to]; hi ^= Z_PIECE_HI[prise][to]; }
    c[from] = VIDE; lo ^= Z_PIECE[p][from]; hi ^= Z_PIECE_HI[p][from];
    const arrive = (fl & PROMOTION) ? (promotion(m) | nous) : p;
    c[to] = arrive; lo ^= Z_PIECE[arrive][to]; hi ^= Z_PIECE_HI[arrive][to];
    if (fl & ROQUE) {
      const [rf, rt] = to === 6 ? [7, 5] : to === 2 ? [0, 3] : to === 118 ? [119, 117] : [112, 115];
      const r = c[rf]; c[rf] = VIDE; c[rt] = r; lo ^= Z_PIECE[r][rf] ^ Z_PIECE[r][rt]; hi ^= Z_PIECE_HI[r][rf] ^ Z_PIECE_HI[r][rt];
    }
    if (type(p) === ROI) this.rois[nous >> 3] = to;
    this.roque &= MASQUE_ROQUE[from] & MASQUE_ROQUE[to];
    lo ^= Z_ROQUE[this.roque]; hi ^= Z_ROQUE_HI[this.roque];
    this.ep = (fl & DOUBLE) ? from + (nous === BLANC ? 16 : -16) : -1;
    if (this.ep >= 0) { lo ^= Z_EP[colonne(this.ep)]; hi ^= Z_EP_HI[colonne(this.ep)]; }
    this.demi = (prise || type(p) === PION) ? 0 : this.demi + 1;
    if (nous === NOIR) this.numero++;
    this.trait = eux; lo ^= Z_TRAIT; hi ^= Z_TRAIT_HI;
    this.lo = lo; this.hi = hi;
    if (this.attaquee(this.rois[nous >> 3], eux)) { this.reprendre(); return false; }
    this.historique.push(lo); this.pile[this.pile.length - 1].hist = true;
    return true;
  }

  reprendre() {
    const u = this.pile.pop(), c = this.cases, m = u.m, from = de(m), to = vers(m), fl = drapeaux(m);
    const eux = this.trait, nous = eux ^ NOIR;
    if (u.hist) this.historique.pop();
    const p = (fl & PROMOTION) ? (PION | nous) : c[to];
    c[from] = p; c[to] = VIDE;
    if (fl & EN_PASSANT) c[to + (nous === BLANC ? -16 : 16)] = u.prise; else if (u.prise) c[to] = u.prise;
    if (fl & ROQUE) { const [rf, rt] = to === 6 ? [7, 5] : to === 2 ? [0, 3] : to === 118 ? [119, 117] : [112, 115]; c[rf] = c[rt]; c[rt] = VIDE; }
    this.rois[nous >> 3] = u.roi;
    this.roque = u.roque; this.ep = u.ep; this.demi = u.demi; this.lo = u.lo; this.hi = u.hi;
    if (nous === NOIR) this.numero--;
    this.trait = nous;
  }

  /** Coup nul (pour la menace adverse et l'élagage) : on passe le trait. Jamais en échec. */
  jouerNul() {
    this.pile.push({ m: 0, prise: 0, roque: this.roque, ep: this.ep, demi: this.demi, lo: this.lo, hi: this.hi, roi: this.rois[this.trait >> 3], nul: true });
    if (this.ep >= 0) { this.lo ^= Z_EP[colonne(this.ep)]; this.hi ^= Z_EP_HI[colonne(this.ep)]; }
    this.ep = -1; this.trait ^= NOIR; this.lo ^= Z_TRAIT; this.hi ^= Z_TRAIT_HI; this.demi++;
    this.historique.push(this.lo);
  }

  reprendreNul() {
    const u = this.pile.pop();
    this.historique.pop();
    this.roque = u.roque; this.ep = u.ep; this.demi = u.demi; this.lo = u.lo; this.hi = u.hi; this.trait ^= NOIR;
  }

  /** Nombre de fois où la position courante est déjà apparue (depuis le début de l'historique). */
  repetitions() {
    let n = 0;
    for (let i = this.historique.length - 2; i >= 0; i--) if (this.historique[i] === this.lo) n++;
    return n;
  }

  materielInsuffisant() {
    let mineurs = 0, fousB = 0, fousN = 0;
    for (let sq = 0; sq < 128; sq++) {
      if (horsJeu(sq)) { sq += 7; continue; }
      const t = type(this.cases[sq]); if (!t || t === ROI) continue;
      if (t === PION || t === TOUR || t === DAME) return false;
      mineurs++;
      if (t === FOU) { if (((sq >> 4) + (sq & 7)) & 1) fousB++; else fousN++; }
    }
    if (mineurs <= 1) return true;
    return mineurs === fousB + fousN && (fousB === 0 || fousN === 0); // fous tous de même couleur
  }

  /** Fin de partie ? rend null, ou {resultat: '1-0'|'0-1'|'1/2-1/2', raison}. */
  fin() {
    if (!this.coups().length) return this.enEchec() ? { resultat: this.trait === BLANC ? '0-1' : '1-0', raison: 'mat' } : { resultat: '1/2-1/2', raison: 'pat' };
    if (this.demi >= 100) return { resultat: '1/2-1/2', raison: 'cinquante coups' };
    if (this.repetitions() >= 2) return { resultat: '1/2-1/2', raison: 'triple répétition' };
    if (this.materielInsuffisant()) return { resultat: '1/2-1/2', raison: 'matériel insuffisant' };
    return null;
  }

  /** Comptage exhaustif des coups (vérification des règles). */
  perft(prof) {
    if (prof === 0) return 1;
    const buf = new Int32Array(256), n = this.genererPseudo(buf);
    let total = 0;
    for (let i = 0; i < n; i++) { if (!this.jouer(buf[i])) continue; total += prof === 1 ? 1 : this.perft(prof - 1); this.reprendre(); }
    return total;
  }

  coupDepuisUci(uci) {
    const from = caseDepuisNom(uci.slice(0, 2)), to = caseDepuisNom(uci.slice(2, 4)), pr = uci[4] ? LETTRES[uci[4]] : 0;
    return this.coups().find((m) => de(m) === from && vers(m) === to && promotion(m) === pr) ?? null;
  }
}

export const uci = (m) => nomCase(de(m)) + nomCase(vers(m)) + (promotion(m) ? LETTRE_DE[promotion(m)] : '');
