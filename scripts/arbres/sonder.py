#!/usr/bin/env python3
"""Étage 2, première sonde (6 octobre 2026) : l'espace appris sur l'échiquier brut contient-il les faits d'avenir ?

On prend les vecteurs du modèle brut (figés), on les joint par (partie, demi-coup) aux grains des mêmes parties, on
calcule les mêmes 141 traits d'avenir que pour le modèle à grains (future_feats, F = 10), et on apprend une simple couche
linéaire (sonde) vecteur → traits d'avenir sur 90 % des parties ; AUC moyenne par trait sur les 10 % restants, exactement
comme train.py. Même sonde, en option, sur les vecteurs du modèle à grains pour les mêmes fenêtres (--grains-model), avec
cette réserve : ce modèle a vu la plupart de ces parties à l'entraînement.

  python3 scripts/arbres/sonder.py --brut data/brut/model --grains 'data/grains/elite-2021-02.s*.jsonl' \
      --vocab data/arbres3/windows.vocab.json --grains-model data/arbres3 --out data/brut/sonde.json
"""
import argparse, glob, json, sys, os, zlib, time
import numpy as np, torch, torch.nn.functional as F
sys.path.insert(0, os.path.dirname(__file__)); from dataset import future_feats

def auc_mean(P, T):
    aucs = []
    for j in range(T.shape[1]):
        t = T[:, j]; p = P[:, j]
        if t.sum() < 20 or (1 - t).sum() < 20: continue
        order = np.argsort(p); ranks = np.empty_like(order, dtype=np.float64); ranks[order] = np.arange(1, len(p) + 1)
        n1 = t.sum(); n0 = len(t) - n1; aucs.append((ranks[t == 1].sum() - n1 * (n1 + 1) / 2) / (n1 * n0))
    return float(np.mean(aucs)), len(aucs), aucs

def probe(X, Y, tr, va, dev, epochs=8, name=''):
    mu = X[tr].mean(0); sd = X[tr].std(0) + 1e-6; Xn = torch.from_numpy((X - mu) / sd).float(); Yt = torch.from_numpy(Y).float()
    lin = torch.nn.Linear(X.shape[1], Y.shape[1]).to(dev); opt = torch.optim.AdamW(lin.parameters(), lr=3e-3, weight_decay=1e-4)
    base = Yt[tr].mean(0).clamp(1e-4, 1 - 1e-4)
    for ep in range(epochs):
        perm = np.random.permutation(tr)
        for s in range(0, len(perm), 4096):
            b = perm[s:s + 4096]; loss = F.binary_cross_entropy_with_logits(lin(Xn[b].to(dev)), Yt[b].to(dev)); opt.zero_grad(); loss.backward(); opt.step()
    with torch.no_grad():
        P = torch.cat([torch.sigmoid(lin(Xn[va[s:s + 8192]].to(dev))).cpu() for s in range(0, len(va), 8192)]).numpy(); T = Y[va]
        vl = F.binary_cross_entropy(torch.from_numpy(P), torch.from_numpy(T).float()).item(); vb = F.binary_cross_entropy(base.expand_as(torch.from_numpy(T)), torch.from_numpy(T).float()).item()
    m, n, aucs = auc_mean(P, T)
    print(f'{name}: AUC moyenne {m:.3f} sur {n} traits ; perte {vl:.4f} vs constante {vb:.4f}', file=sys.stderr)
    return {'auc_moyenne': m, 'n_traits_auc': n, 'perte_val': vl, 'perte_constante': vb, 'aucs': aucs}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--brut', required=True); ap.add_argument('--grains', required=True); ap.add_argument('--vocab', required=True)
    ap.add_argument('--grains-model', default=''); ap.add_argument('--future', type=int, default=10); ap.add_argument('--out', required=True); ap.add_argument('--epochs', type=int, default=8)
    a = ap.parse_args(); dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    vocab_y = json.load(open(a.vocab))['y']; iy = {t: i for i, t in enumerate(vocab_y)}
    meta = [json.loads(l) for l in open(a.brut + '.meta.jsonl')]; E = np.load(a.brut + '.emb.npy', mmap_mode='r')
    want = {}; 
    for i, (gid, end, me) in enumerate(meta): want.setdefault(gid, []).append((i, end, me))
    rows, Y, gids = [], [], []
    for fn in sorted(glob.glob(a.grains)):
        for l in open(fn):
            gid = l[7:l.index('"', 7)]
            if gid not in want: continue
            nodes = json.loads(l)['nodes']
            for i, end, me in want[gid]:
                if end + a.future > len(nodes): continue
                y = np.zeros(len(vocab_y), dtype=np.uint8)
                for t in future_feats(nodes[end:end + a.future], me):
                    if t in iy: y[iy[t]] = 1
                rows.append(i); Y.append(y); gids.append(gid)
    rows = np.array(rows); Y = np.stack(Y); gids = np.array(gids)
    print(f'{len(rows)} fenêtres jointes sur {len(meta)} ({len(set(gids))} parties)', file=sys.stderr)
    h = np.array([zlib.crc32(g.encode()) % 10 for g in gids]); va = np.where(h == 0)[0]; tr = np.where(h != 0)[0]
    X = np.asarray(E[rows]); report = {'fenetres': int(len(rows)), 'parties': len(set(gids)), 'traits': vocab_y}
    report['brut'] = probe(X, Y, tr, va, dev, a.epochs, 'sonde sur le modèle brut')
    rng = np.random.default_rng(0); report['hasard'] = probe(rng.standard_normal(X.shape).astype(np.float32), Y, tr, va, dev, 2, 'sonde sur des vecteurs au hasard (témoin)')
    if a.grains_model:
        gm = {}; 
        for i, l in enumerate(open(a.grains_model + '/windows.meta.jsonl')):
            m = json.loads(l); gm[(m[0], m[1])] = i
        GE = np.load(a.grains_model + '/model.emb.npy', mmap_mode='r')
        sel = [j for j, r in enumerate(rows) if (meta[r][0], meta[r][1]) in gm]
        if len(sel) > 1000:
            sel = np.array(sel); Xg = np.asarray(GE[[gm[(meta[rows[j]][0], meta[rows[j]][1])] for j in sel]]); Yg = Y[sel]; hg = h[sel]
            report['grains_modele'] = probe(Xg, Yg, np.where(hg != 0)[0], np.where(hg == 0)[0], dev, a.epochs, f'sonde sur le modèle à grains ({len(sel)} fenêtres communes, parties vues à l\'entraînement pour la plupart)')
            report['brut_memes_fenetres'] = probe(X[sel], Yg, np.where(hg != 0)[0], np.where(hg == 0)[0], dev, a.epochs, 'sonde sur le modèle brut, mêmes fenêtres')
        else: print(f'jointure avec le modèle à grains : {len(sel)} fenêtres seulement', file=sys.stderr)
    json.dump(report, open(a.out, 'w'), indent=1, ensure_ascii=False); print(f'TERMINÉ → {a.out}', file=sys.stderr)

if __name__ == '__main__': main()
