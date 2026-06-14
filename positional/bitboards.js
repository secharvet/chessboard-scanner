/**
 * Convertisseur FEN → bitboards pour réseaux de neurones.
 *
 * Représentation :
 *   - 12 plans 8×8 (une par type+ couleur : P,N,B,R,Q,K,p,n,b,r,q,k)
 *   - 1 plan  trait (tout à 1 si blanc, 0 si noir)
 *   - 4 plans roques (K, Q, k, q)
 *   - 1 plan en passant
 *   → Total : 18 plans × 64 = 1152 entrées spatiales
 *
 * Usage :
 *   import { fenToBitboards } from './bb.js';
 *   const { planes, flat } = fenToBitboards('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
 */

// Ordre canonique des pièces (12 plans)
const PIECE_ORDER = ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];

// Mapping pièce → index de plan
const PIECE_TO_PLANE = Object.fromEntries(PIECE_ORDER.map((p, i) => [p, i]));

// Conversion fichier → rangée (0-7) → index 0-63
// a1=0, b1=1, ..., h1=7, a2=8, ..., h8=63
function squareIndex(file, rank) {
  return rank * 8 + file;
}

/**
 * Parse un FEN en ses composantes.
 * @param {string} fen
 * @returns {{ placement: string, active: 'w'|'b', castling: string, enPassant: string }}
 */
function parseFen(fen) {
  const parts = fen.split(' ');
  return {
    placement: parts[0],
    active: parts[1] || 'w',
    castling: parts[2] || '-',
    enPassant: parts[3] || '-',
  };
}

/**
 * Convertit un FEN en 18 plans 8×8.
 * @param {string} fen
 * @returns {{ planes: number[][][], flat: Float32Array, shape: [18, 8, 8] }}
 */
export function fenToBitboards(fen) {
  const { placement, active, castling, enPassant } = parseFen(fen);

  // 18 plans de 8×8
  const planes = [];
  for (let p = 0; p < 18; p++) {
    const plane = [];
    for (let r = 0; r < 8; r++) {
      plane.push(new Array(8).fill(0));
    }
    planes.push(plane);
  }

  // Remplir les pièces (plans 0-11)
  const rows = placement.split('/');
  for (let rank = 0; rank < 8; rank++) {
    const row = rows[7 - rank]; // FEN: rang 8 en premier → rank 7 dans notre tableau
    let file = 0;
    for (const ch of row) {
      if (ch >= '1' && ch <= '8') {
        file += parseInt(ch, 10);
      } else {
        const planeIdx = PIECE_TO_PLANE[ch];
        if (planeIdx !== undefined) {
          planes[planeIdx][rank][file] = 1;
        }
        file++;
      }
    }
  }

  // Plan 12 : trait (tout à 1 si blancs, 0 si noirs)
  if (active === 'w') {
    for (let r = 0; r < 8; r++)
      for (let f = 0; f < 8; f++)
        planes[12][r][f] = 1;
  }

  // Plans 13-16 : droits de roque (K, Q, k, q)
  if (castling.includes('K')) fillPlane(planes[13]);
  if (castling.includes('Q')) fillPlane(planes[14]);
  if (castling.includes('k')) fillPlane(planes[15]);
  if (castling.includes('q')) fillPlane(planes[16]);

  // Plan 17 : case en passant
  if (enPassant !== '-') {
    const file = enPassant.charCodeAt(0) - 97; // a=0..h=7
    const rank = parseInt(enPassant[1], 10) - 1; // 1..8 → 0..7
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      planes[17][rank][file] = 1;
    }
  }

  // Aplatir en Float32
  const flat = new Float32Array(18 * 64);
  let idx = 0;
  for (let p = 0; p < 18; p++) {
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        flat[idx++] = planes[p][r][f];
      }
    }
  }

  return { planes, flat, shape: [18, 8, 8] };
}

function fillPlane(plane) {
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++)
      plane[r][f] = 1;
}

/**
 * Version chaîne compacte pour sérialisation.
 * Chaque plan encodé en hex (16 caractères par rangée = 128 chars par plan).
 */
export function bitboardsToHex(planes) {
  let hex = '';
  for (let p = 0; p < 18; p++) {
    for (let r = 0; r < 8; r++) {
      let byte = 0;
      for (let f = 0; f < 8; f++) {
        if (planes[p][r][f]) byte |= (1 << f);
      }
      hex += byte.toString(16).padStart(2, '0');
    }
  }
  return hex;
}

/**
 * Inverse : hex → Float32Array flat
 */
export function hexToBitboardsFlat(hex) {
  const flat = new Float32Array(18 * 64);
  let idx = 0;
  for (let p = 0; p < 18; p++) {
    for (let r = 0; r < 8; r++) {
      const byte = parseInt(hex.substr((p * 8 + r) * 2, 2), 16);
      for (let f = 0; f < 8; f++) {
        flat[idx++] = (byte >> f) & 1;
      }
    }
  }
  return flat;
}
