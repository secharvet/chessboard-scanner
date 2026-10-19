/**
 * Les départs de l'épreuve du jeu (docs/plans/PROTOCOLE-EPREUVE-DU-JEU-2026-10-19.md, § 3).
 *   lot 1 — le coût : les dix positions du panel (positions-filtre.mjs), le coach joue chaque camp ;
 *   lot 2 — la couverture : dix positions d'ouverture au 8e coup, dans les livres, choisies par l'Expert pour étager la
 *           reconnaissance de structure.
 * Chaque départ : { id, lot, nom, coups } ; `fenDepart` rejoue les coups (et vérifie leur légalité au chargement).
 */
import { Chess } from 'chess.js';
import { POSITIONS } from './positions-filtre.mjs';

export const LOT2 = [
  { id: 'l2-fr-avance', nom: 'Française d\'avance, 8…Cf5 (CHAINE_E5 dès le départ)', coups: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O cxd4 cxd4 Nf5' },
  { id: 'l2-fr-steinitz', nom: 'Française Steinitz, 8…b5', coups: 'e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 a6 Qd2 b5' },
  { id: 'l2-fr-winawer', nom: 'Française Winawer, 8.Fd3', coups: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Nf3 Bd7 Bd3' },
  { id: 'l2-fr-tarrasch-ouvert', nom: 'Française Tarrasch ouvert, 8…Cge7 (PDI noir)', coups: 'e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nc6 Bb5 Bd6 dxc5 Bxc5 O-O Nge7' },
  { id: 'l2-fr-echange', nom: 'Française d\'échange, 8…Cbd7', coups: 'e4 e6 d4 d5 exd5 exd5 Nf3 Bd6 Bd3 Nf6 O-O O-O Bg5 Bg4 Nbd2 Nbd7' },
  { id: 'l2-it-pianissimo', nom: 'Italienne pianissimo, 8…Fa7', coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7' },
  { id: 'l2-it-centre', nom: 'Italienne du centre, 9…Cxd5 (la ligne du livre accouche d\'un PDI blanc)', coups: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5' },
  { id: 'l2-esp-fermee', nom: 'Espagnole fermée, 8…O-O', coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O' },
  { id: 'l2-esp-berlin', nom: 'Espagnole berlinoise, 8…Rxd8 (finale sans dames, majorité)', coups: 'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8' },
  { id: 'l2-esp-steinitz-differee', nom: 'Espagnole Steinitz différée, 8.Te1', coups: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Bd7 d4 Nf6 O-O Be7 Re1' },
];

export const DEPARTS = [
  ...POSITIONS.map((p) => ({ id: p.id, lot: 1, nom: p.nom, coups: p.coups, fen: p.fen })),
  ...LOT2.map((d) => ({ ...d, lot: 2 })),
];

/** La position de départ (FEN) ; lance si un coup est illégal. */
export function fenDepart(d) {
  const c = new Chess();
  if (d.fen) c.load(d.fen); else for (const san of d.coups.split(/\s+/)) { if (!c.move(san)) throw new Error(`${d.id} : coup illégal ${san}`); }
  return c.fen();
}
export const trouverDepart = (id) => DEPARTS.find((d) => d.id === id) ?? null;

for (const d of DEPARTS) fenDepart(d); // légalité vérifiée au chargement
const ids = DEPARTS.map((d) => d.id); if (new Set(ids).size !== ids.length) throw new Error('identifiants de départ en double');
