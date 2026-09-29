"""
Premiers réseaux de plans et leurs références (docs/PLANS-ET-CONCEPTS.md, §5, §6, §6 bis).

Pour chaque concept, un modèle « mon plan » : chaque position donne deux exemples, un par camp, vus du camp
concerné (échiquier retourné pour les Noirs, pièces du camp dans les 6 premiers plans, faits « à moi » et
« à l'adversaire »). Quatre modèles comparés sur des parties jamais vues (découpage par partie) :

  logreg   régression logistique sur les faits du moteur de règles (règles linéaires) ;
  arbres   arbres de décision à gradient sur les mêmes faits : la VRAIE référence du §6 bis ;
  cnn      petit réseau convolutif, échiquier seul ;
  cnn+f    le même, avec les faits en entrée.

Critère du §6 bis : le réseau doit battre les arbres (AUC). Sinon, on garde règles + arbres.

  ~/laya-venv/bin/python scripts/train-plans.py data/datasets/plans-v1.jsonl [--concepts rupture,tour_colonne]
      [--epochs 8] [--threads 2] [--out reports/train-plans.json]
"""

import argparse
import json
import os
import pickle
import zlib

import numpy as np
import torch
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
from torch import nn
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from train_plans_lib import PlanNet, board_planes, facts_vector  # noqa: E402

def load(path, concepts):
    recs = [json.loads(l) for l in open(path, encoding='utf8') if l.strip()]
    keys = sorted({k.split('|')[0] for r in recs for k in r['facts']})
    data = {c: {'fen': [], 'side': [], 'y': [], 'facts': [], 'split': [], 'eval': []} for c in concepts}
    for r in recs:
        # Découpage par partie (pas de fuite d'une position à la voisine) : 80 % entraînement, 10 % validation, 10 % test.
        h = zlib.crc32(str(r['game']).encode()) % 10
        split = 'test' if h == 0 else 'val' if h == 1 else 'train'
        for c in concepts:
            for side in 'wb':
                y = r['y'].get(f'{c}_{side}')
                if y is None:
                    continue
                elo = (r.get('elo') or {}).get(side) if isinstance(r.get('elo'), dict) else r.get('elo')
                v = facts_vector(r['facts'], keys, side, elo)
                d = data[c]
                d['fen'].append(r['fen'])
                d['side'].append(side)
                d['y'].append(y)
                d['facts'].append(v)
                d['split'].append(split)
                d['eval'].append(r['eval'] if side == 'w' else -r['eval'])
    return data, keys


def train_net(Xb, Xf, y, split, use_facts, epochs, seed=0):
    torch.manual_seed(seed)
    tr, va = split == 'train', split == 'val'
    net = PlanNet(Xf.shape[1] if use_facts else 0).to(DEVICE)
    opt = torch.optim.AdamW(net.parameters(), lr=1e-3, weight_decay=1e-4)
    pos = max(1.0, float((y[tr] == 0).sum()) / max(1, (y[tr] == 1).sum()))
    loss_fn = nn.BCEWithLogitsLoss(pos_weight=torch.tensor(min(pos, 50.0), device=DEVICE))
    B = torch.from_numpy(Xb)  # uint8, converti en flottants par lot
    F = torch.from_numpy(Xf)
    Y = torch.from_numpy(y.astype(np.float32))
    idx_tr = np.where(tr)[0]
    best, best_state = -1, None
    for _ in range(epochs):
        net.train()
        np.random.shuffle(idx_tr)
        for i in range(0, len(idx_tr), 256):
            b = idx_tr[i:i + 256]
            opt.zero_grad()
            loss = loss_fn(net(B[b].float().to(DEVICE), F[b].to(DEVICE)), Y[b].to(DEVICE))
            loss.backward()
            opt.step()
        p = predict(net, B, F, np.where(va)[0])
        auc = roc_auc_score(y[va], p) if len(set(y[va])) > 1 else 0
        if auc > best:
            best, best_state = auc, {k: v.detach().clone() for k, v in net.state_dict().items()}
    net.load_state_dict(best_state)
    return net


def predict(net, B, F, idx):
    net.eval()
    out = []
    with torch.no_grad():
        for i in range(0, len(idx), 2048):
            b = idx[i:i + 2048]
            out.append(torch.sigmoid(net(B[b].float().to(DEVICE), F[b].to(DEVICE))).cpu().numpy())
    return np.concatenate(out) if out else np.zeros(0)


NEG_PER_POS = 5
# GPU si présent (machine d'entraînement), sinon processeur (VPS) : même script, mêmes résultats.
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dataset')
    ap.add_argument('--concepts', default='tour_colonne,rupture,affaiblir,blocage,cavalier_avant_poste,dominer,baionnette')
    ap.add_argument('--epochs', type=int, default=8)
    ap.add_argument('--threads', type=int, default=2)
    ap.add_argument('--out', default='reports/train-plans.json')
    a = ap.parse_args()
    torch.set_num_threads(a.threads)
    concepts = a.concepts.split(',')
    data, keys = load(a.dataset, concepts)
    results = {}
    rng = np.random.default_rng(0)
    for c in concepts:
        d = data.pop(c)  # libéré après ce concept : la mémoire est la contrainte (7,7 Go, tueur OOM le 29 septembre)
        y = np.array(d['y'])
        split = np.array(d['split'])
        # Entraînement : tous les positifs, au plus NEG_PER_POS négatifs par positif (tirage fixe) ; validation et
        # test restent complets pour des mesures honnêtes.
        pos_tr = np.where((split == 'train') & (y == 1))[0]
        neg_tr = np.where((split == 'train') & (y == 0))[0]
        keep = rng.choice(neg_tr, size=min(len(neg_tr), max(NEG_PER_POS * len(pos_tr), 20000)), replace=False)
        drop = np.setdiff1d(neg_tr, keep)
        split[drop] = 'ignore'
        Xf = np.stack(d['facts']) if d['facts'] else np.zeros((0, 2 * len(keys) + 1), dtype=np.float32)
        te, tr = split == 'test', split == 'train'
        npos = {s: int(y[split == s].sum()) for s in ('train', 'val', 'test')}
        print(f'\n== {c} : {len(y)} exemples, positifs {npos}')
        if min(npos.values()) < 20:
            print('   trop peu de positifs, concept sauté')
            continue
        res = {'n': len(y), 'positifs': npos}
        scaler = StandardScaler().fit(Xf[tr])
        Xs = scaler.transform(Xf).astype(np.float32)
        lr = LogisticRegression(max_iter=2000, class_weight='balanced').fit(Xs[tr], y[tr])
        gb = HistGradientBoostingClassifier(max_iter=300, learning_rate=0.08, class_weight='balanced').fit(Xf[tr], y[tr])
        Xb = np.stack([board_planes(f, s) for f, s in zip(d['fen'], d['side'])])  # uint8
        cnn = train_net(Xb, Xs, y, split, False, a.epochs)
        cnnf = train_net(Xb, Xs, y, split, True, a.epochs)
        idx = np.where(te)[0]
        preds = {
            'logreg': lr.predict_proba(Xs[te])[:, 1],
            'arbres': gb.predict_proba(Xf[te])[:, 1],
            'cnn': predict(cnn, torch.from_numpy(Xb), torch.from_numpy(Xs), idx),
            'cnn+f': predict(cnnf, torch.from_numpy(Xb), torch.from_numpy(Xs), idx),
        }
        for name, p in preds.items():
            auc = roc_auc_score(y[te], p)
            ap_ = average_precision_score(y[te], p)
            res[name] = {'auc': round(float(auc), 4), 'ap': round(float(ap_), 4)}
            print(f'   {name:7s} AUC {auc:.3f}   précision moyenne {ap_:.3f}')
        best_net = max(res['cnn']['auc'], res['cnn+f']['auc'])
        res['verdict'] = 'réseau > arbres (+0,02 ou plus)' if best_net >= res['arbres']['auc'] + 0.02 else 'réseau ne bat pas les arbres'
        print(f'   -> {res["verdict"]}')
        results[c] = res
        torch.save({'cnn': {k: v.cpu() for k, v in cnn.state_dict().items()}, 'cnn+f': {k: v.cpu() for k, v in cnnf.state_dict().items()}, 'keys': keys, 'elo_feature': True,
                    'mean': scaler.mean_.tolist(), 'scale': scaler.scale_.tolist()}, f'data/datasets/plan-{c}.pt')
        # Les modèles sur les faits (arbres, règle linéaire) servent le coach (coach/intentions-server.py).
        with open(f'data/datasets/plan-{c}-faits.pkl', 'wb') as fh:
            pickle.dump({'arbres': gb, 'logreg': lr, 'scaler': scaler, 'keys': keys, 'elo_feature': True, 'auc': res}, fh)
    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)  # reports/ n'est pas dans le dépôt
    json.dump(results, open(a.out, 'w'), ensure_ascii=False, indent=2)
    print(f'\nRésultats : {a.out}')


if __name__ == '__main__':
    main()
