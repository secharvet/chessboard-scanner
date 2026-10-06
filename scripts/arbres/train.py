#!/usr/bin/env python3
"""Encodeur d'arbres (6 octobre 2026) : un petit transformeur lit une fenêtre de W nœuds (traits relationnels) et
produit un vecteur de D nombres. Il est entraîné à :
  1. prédire l'AVENIR de la fenêtre (faits des F demi-coups suivants) : deux chemins vers le même avenir se rapprochent ;
  2. rapprocher deux fenêtres voisines de la même partie, éloigner celles de parties différentes (InfoNCE).
Témoin : --control affaiblit l'entrée aux seuls coups (camp, pièce, prise, zone) pour mesurer ce que les grains apportent.

  python3 scripts/arbres/train.py data/arbres/windows --out data/arbres/model --epochs 4 --dim 128
Sortie : <out>.pt (poids), <out>.emb.npy (vecteurs de toutes les fenêtres), <out>.report.json
"""
import argparse, json, math, time, sys
import numpy as np
import torch, torch.nn as nn, torch.nn.functional as Fn

def load(prefix, control=False):
    z = np.load(prefix + '.npz'); X = z['X']; Y = z['Y']
    vocab = json.load(open(prefix + '.vocab.json'))
    if control:
        keep = np.array([t.split(':')[0] in ('<pad>', 'side', 'pc', 'cap', 'chk', 'cas', 'zt') for t in vocab['x']])
        mask = keep[X]
        X = np.where(mask, X, 0)
    meta = [json.loads(l) for l in open(prefix + '.meta.jsonl')]
    return X, Y, vocab, meta

class Encoder(nn.Module):
    def __init__(self, n_tok, W, dim=128, layers=4, heads=4, n_out=0):
        super().__init__()
        self.tok = nn.EmbeddingBag(n_tok, dim, mode='sum', padding_idx=0)
        self.pos = nn.Parameter(torch.zeros(1, W, dim))
        self.cls = nn.Parameter(torch.zeros(1, 1, dim))
        enc = nn.TransformerEncoderLayer(dim, heads, dim * 4, dropout=0.1, batch_first=True, norm_first=True)
        self.tr = nn.TransformerEncoder(enc, layers)
        self.norm = nn.LayerNorm(dim)
        self.head = nn.Linear(dim, n_out)
        self.proj = nn.Sequential(nn.Linear(dim, dim), nn.GELU(), nn.Linear(dim, dim))
        nn.init.normal_(self.pos, std=0.02); nn.init.normal_(self.cls, std=0.02)
    def forward(self, x):  # x : [B, W, K] ids
        B, W, K = x.shape
        e = self.tok(x.reshape(B * W, K)).reshape(B, W, -1) + self.pos
        e = torch.cat([self.cls.expand(B, -1, -1), e], 1)
        h = self.norm(self.tr(e))[:, 0]
        return h, self.head(h), Fn.normalize(self.proj(h), dim=-1)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('prefix'); ap.add_argument('--out', required=True)
    ap.add_argument('--epochs', type=int, default=4); ap.add_argument('--batch', type=int, default=512)
    ap.add_argument('--dim', type=int, default=128); ap.add_argument('--layers', type=int, default=4)
    ap.add_argument('--lr', type=float, default=3e-4); ap.add_argument('--control', action='store_true')
    ap.add_argument('--tau', type=float, default=0.1); ap.add_argument('--max', type=int, default=0)
    a = ap.parse_args()
    X, Y, vocab, meta = load(a.prefix, a.control)
    if a.max: X, Y, meta = X[:a.max], Y[:a.max], meta[:a.max]
    N, W, K = X.shape
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f'{N} fenêtres, W={W}, K={K}, vocab {len(vocab["x"])}, avenir {Y.shape[1]}, {dev}', file=sys.stderr)
    # voisins temporels : même partie, fenêtre suivante (stride) ; l'index de meta est trié par partie puis par fin
    game = np.array([m[0] for m in meta]); nxt = np.arange(N) + 1
    nxt[-1] = N - 1
    same = np.concatenate([game[1:] == game[:-1], [False]])
    nxt = np.where(same, nxt, np.arange(N))  # sans voisin : lui-même (le terme contrastif devient neutre)
    # découpage apprentissage / validation par partie (10 %)
    h = np.array([hash(g) % 10 for g in game]); val = h == 0; tr = ~val
    Xt = torch.from_numpy(X.astype(np.int64)); Yt = torch.from_numpy(Y.astype(np.float32))
    pos_w = torch.clamp((Yt[tr].shape[0] - Yt[tr].sum(0)) / (Yt[tr].sum(0) + 1), 1, 20).to(dev)  # classes rares
    model = Encoder(len(vocab['x']), W, a.dim, a.layers, n_out=Y.shape[1]).to(dev)
    opt = torch.optim.AdamW(model.parameters(), lr=a.lr, weight_decay=0.01)
    idx_tr = np.where(tr)[0]; idx_val = np.where(val)[0]
    steps = a.epochs * math.ceil(len(idx_tr) / a.batch); sched = torch.optim.lr_scheduler.OneCycleLR(opt, a.lr, total_steps=steps)
    # témoin de prédiction : la fréquence de chaque trait d'avenir (meilleure constante)
    base = Yt[tr].mean(0).clamp(1e-4, 1 - 1e-4)
    def bce(logits, y): return Fn.binary_cross_entropy_with_logits(logits, y, pos_weight=pos_w)
    t0 = time.time(); report = {'control': a.control, 'epochs': []}
    for ep in range(a.epochs):
        model.train(); np.random.shuffle(idx_tr); tot = 0; nb = 0
        for s in range(0, len(idx_tr), a.batch):
            b = idx_tr[s:s + a.batch]; x = Xt[b].to(dev); y = Yt[b].to(dev); x2 = Xt[nxt[b]].to(dev)
            _, logits, z1 = model(x); _, _, z2 = model(x2)
            loss_fut = bce(logits, y)
            sim = z1 @ z2.T / a.tau; labels = torch.arange(len(b), device=dev)
            loss_nce = (Fn.cross_entropy(sim, labels) + Fn.cross_entropy(sim.T, labels)) / 2
            loss = loss_fut + 0.5 * loss_nce
            opt.zero_grad(); loss.backward(); torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0); opt.step(); sched.step()
            tot += loss.item(); nb += 1
            if nb % 200 == 0: print(f'ep {ep + 1} pas {nb} perte {tot / nb:.3f} ({(time.time() - t0) / 60:.1f} min)', file=sys.stderr)
        # validation : perte BCE du modèle contre la constante, et AUC moyenne par trait
        model.eval(); vl = 0; vb = 0; vbase = 0; preds = []; ys = []
        with torch.no_grad():
            for s in range(0, len(idx_val), 2048):
                b = idx_val[s:s + 2048]; x = Xt[b].to(dev); y = Yt[b].to(dev)
                _, logits, _ = model(x)
                vl += Fn.binary_cross_entropy_with_logits(logits, y, reduction='sum').item()
                vbase += Fn.binary_cross_entropy(base.to(dev).expand_as(y), y, reduction='sum').item()
                vb += y.numel(); preds.append(torch.sigmoid(logits).cpu()); ys.append(y.cpu())
        P = torch.cat(preds).numpy(); T = torch.cat(ys).numpy()
        aucs = []
        for j in range(T.shape[1]):
            t = T[:, j]; p = P[:, j]
            if t.sum() < 20 or (1 - t).sum() < 20: continue
            order = np.argsort(p); ranks = np.empty_like(order, dtype=np.float64); ranks[order] = np.arange(1, len(p) + 1)
            n1 = t.sum(); n0 = len(t) - n1; aucs.append((ranks[t == 1].sum() - n1 * (n1 + 1) / 2) / (n1 * n0))
        e = {'epoch': ep + 1, 'perte_val': vl / vb, 'perte_constante': vbase / vb, 'auc_moyenne': float(np.mean(aucs)), 'n_traits_auc': len(aucs), 'minutes': (time.time() - t0) / 60}
        report['epochs'].append(e); print(json.dumps(e), file=sys.stderr)
    torch.save({'state': model.state_dict(), 'dim': a.dim, 'layers': a.layers, 'W': W, 'n_tok': len(vocab['x']), 'n_out': Y.shape[1], 'control': a.control}, a.out + '.pt')
    # vecteurs de toutes les fenêtres
    model.eval(); embs = []
    with torch.no_grad():
        for s in range(0, N, 4096):
            h, _, _ = model(Xt[s:s + 4096].to(dev)); embs.append(h.cpu().numpy().astype(np.float32))
    E = np.concatenate(embs); np.save(a.out + '.emb.npy', E)
    json.dump(report, open(a.out + '.report.json', 'w'), indent=1)
    print(f'TERMINÉ vecteurs {E.shape} → {a.out}.emb.npy', file=sys.stderr)

if __name__ == '__main__':
    main()
