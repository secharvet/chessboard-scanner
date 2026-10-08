#!/usr/bin/env python3
"""Le modèle comme joueur (8 octobre 2026) : à chaque coup, le coup légal le plus probable d'après les têtes « prochain coup »
(aucun calcul), contre Stockfish bridé (UCI_LimitStrength). Les 16 premiers demi-coups viennent d'une partie humaine tirée au
sort dans le corpus (même ouverture pour les deux camps, couleurs alternées). Mesure le niveau du modèle, pas sa qualité de
lecteur ; sert de repère.
  ~/lecteur-venv/bin/python scripts/arbres/joueur.py --elos 1320,1500,1800,2100 --parties 20 --out data/brut-x/joueur.json
"""
import argparse, json, random, sys, os, time
import numpy as np, chess, chess.engine
sys.path.insert(0, os.path.dirname(__file__)); sys.argv_backup = sys.argv
import importlib; lec = importlib.import_module('lecteur')

def ouvertures(pgn_path, n, plies=16, seed=1):
    """Les 16 premiers demi-coups de n parties humaines, prises parmi les 400 premières du fichier, tirées au sort."""
    import chess.pgn
    rng = random.Random(seed); pool = []
    with open(pgn_path) as fh:
        while len(pool) < 400:
            g = chess.pgn.read_game(fh)
            if g is None: break
            sans = []; b = g.board()
            for mv in g.mainline_moves():
                sans.append(b.san(mv)); b.push(mv)
                if len(sans) >= plies: break
            if len(sans) >= plies and not b.is_game_over(): pool.append(sans)
    return rng.sample(pool, min(n, len(pool)))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--elos', default='1320,1500,1800'); ap.add_argument('--parties', type=int, default=10); ap.add_argument('--movetime', type=float, default=0.05)
    ap.add_argument('--pgn', default='data/elite/lichess_elite_2021-02.pgn'); ap.add_argument('--out', required=True); ap.add_argument('--stockfish', default='/usr/local/bin/stockfish')
    a = ap.parse_args()
    L = lec.Lecteur('data/brut-x/model.pt', 'data/brut-x/lecteur-sonde.pt', '', ''); L2 = lec.Lecteur('data/brut3/model.pt', 'data/brut3/lecteur-sonde.pt', '', '')
    ouv = ouvertures(a.pgn, a.parties); print(f'{len(ouv)} ouvertures', file=sys.stderr)
    eng = chess.engine.SimpleEngine.popen_uci(a.stockfish); res = {}
    for elo in [int(e) for e in a.elos.split(',')]:
        eng.configure({'UCI_LimitStrength': True, 'UCI_Elo': elo}); score = 0; n = 0; det = []
        for gi, o in enumerate(ouv):
            raw, board = lec.plateaux_depuis(moves_san=o); moi = chess.WHITE if gi % 2 == 0 else chess.BLACK; sans = list(o)
            while not board.is_game_over(claim_draw=True) and len(sans) < 200:
                if board.turn == moi:
                    M = L if len(raw) >= L.W else L2; c = lec.coup_probable(M, raw, board, 1)
                    mv = chess.Move.from_uci(c[0]['uci']) if c else random.choice(list(board.legal_moves))
                else:
                    mv = eng.play(board, chess.engine.Limit(time=a.movetime)).move
                san = board.san(mv); cap = board.piece_at(mv.to_square); is_cap = cap is not None or board.is_en_passant(mv)
                board.push(mv); r = lec.rangee(board, mv); r[68] = (cap.piece_type if cap else (1 if is_cap else 0)); r[69] = 2 if board.is_checkmate() else (1 if board.is_check() else 0)
                raw = np.concatenate([raw, r[None]]); sans.append(san)
            r_ = board.result(claim_draw=True); pts = 0.5 if r_ == '1/2-1/2' else (1.0 if (r_ == '1-0') == (moi == chess.WHITE) else 0.0)
            score += pts; n += 1; det.append({'couleur': 'w' if moi == chess.WHITE else 'b', 'resultat': r_, 'points': pts, 'demi_coups': len(sans), 'coups': ' '.join(sans)})
            print(f'Elo {elo} partie {gi + 1}/{len(ouv)} : {r_} ({"blancs" if moi == chess.WHITE else "noirs"}, {len(sans)} demi-coups) — total {score}/{n}', file=sys.stderr)
        res[str(elo)] = {'points': score, 'parties': n, 'score': score / n, 'detail': det}
    eng.quit(); json.dump(res, open(a.out, 'w'), ensure_ascii=False, indent=1)
    print('TERMINÉ ' + ', '.join(f'Elo {k} : {v["points"]}/{v["parties"]}' for k, v in res.items()), file=sys.stderr)

if __name__ == '__main__': main()
