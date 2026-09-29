"""
Tests contrefactuels, notation (docs/PLANS-ET-CONCEPTS.md, §6 bis, test 3).

Pour chaque triplet (position positive, variante « tuer », variante « neutre ») produit par
scripts/counterfactuals.mjs, les modèles sauvés par train-plans.py notent les trois positions.
Un modèle qui a compris le concept : baisse nettement sur « tuer » (Δ ≤ -0,10), bouge peu sur « neutre » (|Δ| < 0,05).
On rapporte, par concept et par modèle, la part des triplets qui vérifient chacune des deux conditions.

  ~/laya-venv/bin/python scripts/score-counterfactuals.py data/datasets/contrefactuels.jsonl [--models data/datasets]
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import torch

sys.path.insert(0, str(Path(__file__).parent))
from train_plans_lib import PlanNet, board_planes, facts_vector  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('triplets')
    ap.add_argument('--models', default='data/datasets')
    a = ap.parse_args()
    rows = [json.loads(l) for l in open(a.triplets, encoding='utf8') if l.strip()]
    by = {}
    for r in rows:
        by.setdefault(r['concept'], []).append(r)
    for concept, items in by.items():
        path = Path(a.models) / f'plan-{concept}.pt'
        if not path.exists():
            print(f'{concept}: pas de modèle ({path})')
            continue
        ck = torch.load(path, weights_only=False)
        keys, mean, scale = ck['keys'], np.array(ck['mean'], dtype=np.float32), np.array(ck['scale'], dtype=np.float32)
        nets = {}
        for name, use_facts in (('cnn', False), ('cnn+f', True)):
            net = PlanNet(2 * len(keys) if use_facts else 0)
            net.load_state_dict(ck[name])
            net.eval()
            nets[name] = net

        def score(net, fen, facts, side):
            b = torch.from_numpy(board_planes(fen, side)[None])
            f = torch.from_numpy(((facts_vector(facts, keys, side, r.get('elo')) - mean) / scale).astype(np.float32)[None])
            with torch.no_grad():
                return float(torch.sigmoid(net(b, f))[0])

        print(f'\n== {concept} : {len(items)} triplets')
        for name, net in nets.items():
            d_kill, d_neut = [], []
            for r in items:
                p0 = score(net, r['fen'], r['facts'], r['side'])
                d_kill.append(score(net, r['kill'], r['factsKill'], r['side']) - p0)
                d_neut.append(score(net, r['neutral'], r['factsNeutral'], r['side']) - p0)
            d_kill, d_neut = np.array(d_kill), np.array(d_neut)
            ok_kill = float((d_kill <= -0.10).mean())
            ok_neut = float((np.abs(d_neut) < 0.05).mean())
            print(f'   {name:6s} tuer : Δ moyen {d_kill.mean():+.3f}, baisse nette dans {ok_kill:.0%} des cas'
                  f' | neutre : Δ moyen {d_neut.mean():+.3f}, stable dans {ok_neut:.0%} des cas')


if __name__ == '__main__':
    main()
