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

def load(path, concepts, drop=()):
    recs = [json.loads(l) for l in open(path, encoding='utf8') if l.strip()]
    keys = sorted({k.split('|')[0] for r in recs for k in r['facts']} - set(drop))
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


def train_net(Xb, Xf, y, split, use_facts, epochs, seed=0, large=False):
    torch.manual_seed(seed)
    tr, va = split == 'train', split == 'val'
    net = PlanNet(Xf.shape[1] if use_facts else 0, ch=96 if large else 48, hidden=256 if large else 128).to(DEVICE)
    opt = torch.optim.AdamW(net.parameters(), lr=1e-3, weight_decay=1e-4)
    pos = max(1.0, float((y[tr] == 0).sum()) / max(1, (y[tr] == 1).sum()))
    loss_fn = nn.BCEWithLogitsLoss(pos_weight=torch.tensor(min(pos, 50.0), device=DEVICE))
    # Tout sur le dispositif une fois pour toutes (uint8 : 630 000 échiquiers = 725 Mo) : sur GPU, plus de copie par lot.
    B = torch.from_numpy(Xb).to(DEVICE)
    F = torch.from_numpy(Xf).to(DEVICE)
    Y = torch.from_numpy(y.astype(np.float32)).to(DEVICE)
    BATCH = 1024 if DEVICE.type == 'cuda' else 256
    idx_tr = np.where(tr)[0]
    best, best_state = -1, None
    for _ in range(epochs):
        net.train()
        np.random.shuffle(idx_tr)
        for i in range(0, len(idx_tr), BATCH):
            b = idx_tr[i:i + BATCH]
            opt.zero_grad()
            loss = loss_fn(net(B[b].float(), F[b]), Y[b])
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
            out.append(torch.sigmoid(net(B[b].float(), F[b])).cpu().numpy())
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
    ap.add_argument('--large', action='store_true', help='réseaux plus larges (96 canaux, tête 256)')
    ap.add_argument('--drop-facts', default='', dest='drop_facts',
                    help='identifiants de faits à retirer du vecteur (ablation), séparés par des virgules')
    ap.add_argument('--seeds', type=int, default=1, help='graines pour les réseaux (moyenne ± écart-type)')
    ap.add_argument('--bootstrap', type=int, default=0, help='rééchantillonnages du test pour les IC à 95 %% des AUC')
    a = ap.parse_args()
    torch.set_num_threads(a.threads)
    concepts = a.concepts.split(',')
    data, keys = load(a.dataset, concepts, [f for f in a.drop_facts.split(',') if f])
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
        # Graines multiples (décision du 29 septembre : ±0,01 d'erreur-type avec 900 positifs) : les AUC des
        # réseaux sont rapportées en moyenne ± écart-type ; les modèles sauvés sont ceux de la graine 0.
        idx = np.where(te)[0]
        Bd, Sd = torch.from_numpy(Xb).to(DEVICE), torch.from_numpy(Xs).to(DEVICE)
        nets = {'cnn': [], 'cnn+f': []}
        net_preds = {'cnn': [], 'cnn+f': []}
        for seed in range(a.seeds):
            nets['cnn'].append(train_net(Xb, Xs, y, split, False, a.epochs, seed=seed, large=a.large))
            nets['cnn+f'].append(train_net(Xb, Xs, y, split, True, a.epochs, seed=seed, large=a.large))
            for name in nets:
                net_preds[name].append(predict(nets[name][-1], Bd, Sd, idx))
        cnn, cnnf = nets['cnn'][0], nets['cnn+f'][0]
        del Bd, Sd
        preds = {
            'logreg': lr.predict_proba(Xs[te])[:, 1],
            'arbres': gb.predict_proba(Xf[te])[:, 1],
            'cnn': net_preds['cnn'][0],
            'cnn+f': net_preds['cnn+f'][0],
        }
        yte = y[te]
        for name, p in preds.items():
            auc = roc_auc_score(yte, p)
            ap_ = average_precision_score(yte, p)
            res[name] = {'auc': round(float(auc), 4), 'ap': round(float(ap_), 4)}
            if name in net_preds and a.seeds > 1:
                aucs = [roc_auc_score(yte, q) for q in net_preds[name]]
                res[name]['auc'] = round(float(np.mean(aucs)), 4)
                res[name]['auc_sd'] = round(float(np.std(aucs)), 4)
            print(f'   {name:7s} AUC {res[name]["auc"]:.3f}'
                  + (f' ± {res[name]["auc_sd"]:.3f}' if 'auc_sd' in res[name] else '')
                  + f'   précision moyenne {ap_:.3f}')
        # Bootstrap apparié sur le test : IC à 95 % de l'AUC des arbres, du réseau + faits, et de leur ÉCART
        # (le même rééchantillon note les deux modèles : c'est l'écart qui a un sens statistique).
        if a.bootstrap:
            rng_b = np.random.default_rng(1)
            b_gb, b_nn, b_diff = [], [], []
            p_gb, p_nn = preds['arbres'], preds['cnn+f']
            for _ in range(a.bootstrap):
                s = rng_b.integers(0, len(yte), len(yte))
                if len(set(yte[s])) < 2:
                    continue
                ag, an = roc_auc_score(yte[s], p_gb[s]), roc_auc_score(yte[s], p_nn[s])
                b_gb.append(ag)
                b_nn.append(an)
                b_diff.append(an - ag)
            ci = lambda v: [round(float(np.percentile(v, q)), 4) for q in (2.5, 97.5)]
            res['ic95'] = {'arbres': ci(b_gb), 'cnn+f': ci(b_nn), 'ecart': ci(b_diff)}
            print(f"   IC95 arbres {res['ic95']['arbres']}  cnn+f {res['ic95']['cnn+f']}  écart {res['ic95']['ecart']}")
        # Précision au seuil d'exploitation (seuil qui maximise F1 sur la VALIDATION, mesuré sur le test)
        # et calibration (ECE, 10 paniers) : les métriques produit de la décision du 29 septembre.
        va_idx = np.where(split == 'val')[0]
        for name, p_all in (('arbres', gb.predict_proba(Xf)[:, 1]), ('cnn+f', None)):
            if p_all is None:
                Bd2, Sd2 = torch.from_numpy(Xb).to(DEVICE), torch.from_numpy(Xs).to(DEVICE)
                p_va, p_te = predict(cnnf, Bd2, Sd2, va_idx), preds['cnn+f']
                del Bd2, Sd2
            else:
                p_va, p_te = p_all[va_idx], p_all[te]
            yv = y[va_idx]
            best_f1, seuil = -1, 0.5
            for t in np.linspace(0.05, 0.95, 19):
                pr = (p_va >= t)
                tp = int((pr & (yv == 1)).sum())
                if not tp:
                    continue
                f1 = 2 * tp / (2 * tp + int((pr & (yv == 0)).sum()) + int(((~pr) & (yv == 1)).sum()))
                if f1 > best_f1:
                    best_f1, seuil = f1, t
            pr = (p_te >= seuil)
            prec = float((yte[pr] == 1).mean()) if pr.any() else None
            rapp = float(pr[yte == 1].mean())
            bins = np.clip((p_te * 10).astype(int), 0, 9)
            ece = float(sum(abs(p_te[bins == b].mean() - (yte[bins == b] == 1).mean()) * (bins == b).sum()
                            for b in range(10) if (bins == b).any()) / len(yte))
            res[name]['seuil'] = round(float(seuil), 2)
            res[name]['precision_seuil'] = round(prec, 3) if prec is not None else None
            res[name]['rappel_seuil'] = round(rapp, 3)
            res[name]['ece'] = round(ece, 4)
            print(f'   {name:7s} seuil {seuil:.2f} : précision {prec if prec is None else round(prec, 3)}, rappel {rapp:.3f}, ECE {ece:.4f}')
        best_net = max(res['cnn']['auc'], res['cnn+f']['auc'])
        res['verdict'] = 'réseau > arbres (+0,02 ou plus)' if best_net >= res['arbres']['auc'] + 0.02 else 'réseau ne bat pas les arbres'
        print(f'   -> {res["verdict"]}')
        results[c] = res
        torch.save({'cnn': {k: v.cpu() for k, v in cnn.state_dict().items()}, 'cnn+f': {k: v.cpu() for k, v in cnnf.state_dict().items()}, 'keys': keys, 'elo_feature': True, 'large': a.large,
                    'mean': scaler.mean_.tolist(), 'scale': scaler.scale_.tolist()}, f'data/datasets/plan-{c}.pt')
        # Les modèles sur les faits (arbres, règle linéaire) servent le coach (coach/intentions-server.py).
        with open(f'data/datasets/plan-{c}-faits.pkl', 'wb') as fh:
            pickle.dump({'arbres': gb, 'logreg': lr, 'scaler': scaler, 'keys': keys, 'elo_feature': True, 'auc': res}, fh)
    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)  # reports/ n'est pas dans le dépôt
    json.dump(results, open(a.out, 'w'), ensure_ascii=False, indent=2)
    print(f'\nRésultats : {a.out}')


if __name__ == '__main__':
    main()
