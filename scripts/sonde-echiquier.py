"""
Sonde « échiquier seul » (docs/PLANS-ET-CONCEPTS.md, §9, prochaines étapes DENEB n° 2).

Le réseau échiquier seul ne sert pas la production : il sert de sonde des lacunes du moteur de règles.
Là où il bat nettement les arbres (qui ne voient QUE les faits des règles), c'est que l'échiquier porte
un signal que les faits ne portent pas. Ce script rejoue exactement le découpage de train-plans.py,
note chaque exemple de test avec le réseau échiquier seul (`plan-*.pt`, tête cnn) et les arbres
(`plan-*-faits.pkl`), et sort, par concept, les POSITIFS de test où le réseau est très confiant
(rang ≥ --rang-cnn) et les arbres nettement moins (écart de rangs ≥ --ecart). Les scores bruts des deux
modèles ne sont pas comparables (calibrations différentes) : tout se fait en rangs sur le jeu de test.

  ~/plans-venv/bin/python scripts/sonde-echiquier.py data/datasets/humains-v2.jsonl \
      [--models data/datasets] [--rang-cnn 0.85] [--ecart 0.35] [--max 50] [--out reports/sonde-echiquier.json]

La sortie (JSON) alimente scripts/sonde-boards.mjs (planches) et donne, par concept, la comparaison des
faits entre ces positifs « vus par l'échiquier seul » et les positifs que les deux modèles attrapent.
"""

import argparse
import json
import pickle
import sys
import zlib
from pathlib import Path

import numpy as np
import torch

sys.path.insert(0, str(Path(__file__).parent))
from train_plans_lib import PlanNet, board_planes, facts_vector  # noqa: E402

CONCEPTS = 'tour_colonne,rupture,affaiblir,blocage,cavalier_avant_poste,dominer,baionnette'


def ranks(x):
    """Rang de chaque valeur dans [0, 1] (1 = score le plus haut du jeu de test)."""
    order = np.argsort(np.argsort(x))
    return order / max(1, len(x) - 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dataset')
    ap.add_argument('--models', default='data/datasets')
    ap.add_argument('--concepts', default=CONCEPTS)
    ap.add_argument('--rang-cnn', type=float, default=0.85, dest='rang_cnn')
    ap.add_argument('--ecart', type=float, default=0.35)
    ap.add_argument('--max', type=int, default=50)
    ap.add_argument('--split', default='val', choices=['val', 'test'])
    ap.add_argument('--out', default='reports/sonde-echiquier.json')
    a = ap.parse_args()
    concepts = a.concepts.split(',')

    recs = [json.loads(l) for l in open(a.dataset, encoding='utf8') if l.strip()]
    # Découpage par partie de train-plans.py. Décision du 29 septembre (test contaminé) : la sonde tourne
    # par défaut sur la VALIDATION (h == 1), jamais sur le test (h == 0) ; --split test reste possible pour
    # reproduire les anciennes mesures, en le disant.
    h = {'val': 1, 'test': 0}[a.split]
    recs = [r for r in recs if zlib.crc32(str(r['game']).encode()) % 10 == h]
    print(f'{len(recs)} enregistrements ({a.split})')

    out = {}
    for c in concepts:
        pkl = Path(a.models) / f'plan-{c}-faits.pkl'
        pt = Path(a.models) / f'plan-{c}.pt'
        if not (pkl.exists() and pt.exists()):
            print(f'{c} : modèles absents, sauté')
            continue
        faits = pickle.load(open(pkl, 'rb'))
        gb, keys = faits['arbres'], faits['keys']
        ck = torch.load(pt, weights_only=False)
        net = PlanNet(0)  # échiquier seul : pas de faits en entrée
        net.load_state_dict(ck['cnn'])
        net.eval()

        rows = []
        for r in recs:
            for side in 'wb':
                y = r['y'].get(f'{c}_{side}')
                if y is None:
                    continue
                rows.append((r, side, y))
        y = np.array([t[2] for t in rows])
        elo = [((t[0].get('elo') or {}).get(t[1]) if isinstance(t[0].get('elo'), dict) else t[0].get('elo')) for t in rows]
        Xf = np.stack([facts_vector(t[0]['facts'], keys, t[1], e) for t, e in zip(rows, elo)])
        p_gb = gb.predict_proba(Xf)[:, 1]
        Xb = np.stack([board_planes(t[0]['fen'], t[1]) for t in rows])
        p_nn = []
        with torch.no_grad():
            for i in range(0, len(Xb), 2048):
                b = torch.from_numpy(Xb[i:i + 2048]).float()
                p_nn.append(torch.sigmoid(net(b)).numpy())
        p_nn = np.concatenate(p_nn)
        r_nn, r_gb = ranks(p_nn), ranks(p_gb)

        sel = np.where((y == 1) & (r_nn >= a.rang_cnn) & (r_nn - r_gb >= a.ecart))[0]
        sel = sel[np.argsort(-(r_nn[sel] - r_gb[sel]))][:a.max]
        both = np.where((y == 1) & (r_nn >= a.rang_cnn) & (r_gb >= a.rang_cnn))[0]
        npos = int(y.sum())
        print(f'\n== {c} : {npos} positifs de test, {len(sel)} vus par l\'échiquier seul et ratés par les arbres, '
              f'{len(both)} attrapés par les deux')

        # Quels faits distinguent ces positions de celles que les deux modèles attrapent ?
        diffs = []
        if len(sel) and len(both):
            f_sel, f_both = Xf[sel].mean(0), Xf[both].mean(0)
            names = [f'{k}|moi' for k in keys] + [f'{k}|lui' for k in keys] + ['elo']
            for i in np.argsort(-np.abs(f_sel - f_both))[:12]:
                diffs.append({'fait': names[i], 'sonde': round(float(f_sel[i]), 2), 'les_deux': round(float(f_both[i]), 2)})
                print(f"   {names[i]:38s} sonde {f_sel[i]:5.2f}  les-deux {f_both[i]:5.2f}")

        out[c] = {
            'positifs_test': npos, 'sonde': len(sel), 'les_deux': len(both),
            'faits_differents': diffs,
            'exemples': [{
                'fen': rows[i][0]['fen'], 'side': rows[i][1], 'game': rows[i][0]['game'], 'ply': rows[i][0]['ply'],
                'elo': elo[i], 'p_cnn': round(float(p_nn[i]), 3), 'p_arbres': round(float(p_gb[i]), 3),
                'rang_cnn': round(float(r_nn[i]), 3), 'rang_arbres': round(float(r_gb[i]), 3),
                'facts': {k: v for k, v in rows[i][0]['facts'].items()},
            } for i in sel],
        }

    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    json.dump(out, open(a.out, 'w'), ensure_ascii=False, indent=1)
    print(f'\nSonde : {a.out}')


if __name__ == '__main__':
    main()
