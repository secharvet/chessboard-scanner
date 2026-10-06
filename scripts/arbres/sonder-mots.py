#!/usr/bin/env python3
"""Sonde des mots des maîtres (nuit du 6 au 7 octobre 2026) : le vecteur de la fenêtre qui se termine par un coup commenté
sait-il de quoi parle le commentateur ? Thèmes multi-étiquettes (17 thèmes stratégiques), validation croisée PAR ÉTUDE
(5 plis : une étude, donc un annotateur, n'est jamais à la fois en apprentissage et en test), AUC par thème.
Témoins : vecteurs au hasard ; traits triviaux (numéro du coup, camp, matériel, nombre de pièces, roques) ; sac de grains
de la fenêtre si --grains ; combinaison brut + triviaux.

  python3 scripts/arbres/sonder-mots.py --emb data/brut2/annotes --themes data/reference/annotes/themes-lexique.jsonl \
      --coups data/reference/annotes/coups.jsonl --plateaux data/plateaux/annotes.bin [--grains 'data/grains/annotes.s*.jsonl' --vocab ...] --out x.json
"""
import argparse, json, sys, os, glob
import numpy as np, torch, torch.nn.functional as F
sys.path.insert(0, os.path.dirname(__file__))
THEMES = ['attaque_roi', 'defense_roi', 'colonne_ouverte', 'structure_pions', 'case_faible_avant_poste', 'echange_pieces', 'developpement', 'centre_espace', 'levier_rupture', 'prophylaxie', 'manoeuvre', 'initiative_pression', 'tactique', 'finale', 'materiel', 'blocus', 'aile_dame']
REC = 72; VAL = {1: 1, 2: 3, 3: 3, 4: 5, 5: 9, 6: 0}

def auc(p, t):
    order = np.argsort(p); ranks = np.empty_like(order, dtype=np.float64); ranks[order] = np.arange(1, len(p) + 1)
    n1 = t.sum(); n0 = len(t) - n1; return float((ranks[t == 1].sum() - n1 * (n1 + 1) / 2) / (n1 * n0))

def fit_predict(Xtr, Ytr, Xte, dev, hidden=128, epochs=40):
    mu = Xtr.mean(0); sd = Xtr.std(0) + 1e-6; Xtr = torch.from_numpy((Xtr - mu) / sd).float().to(dev); Xte = torch.from_numpy((Xte - mu) / sd).float().to(dev); Ytr = torch.from_numpy(Ytr).float().to(dev)
    net = (torch.nn.Sequential(torch.nn.Linear(Xtr.shape[1], hidden), torch.nn.GELU(), torch.nn.Dropout(0.3), torch.nn.Linear(hidden, Ytr.shape[1])) if hidden else torch.nn.Linear(Xtr.shape[1], Ytr.shape[1])).to(dev)
    opt = torch.optim.AdamW(net.parameters(), lr=1e-3, weight_decay=1e-2)
    for ep in range(epochs):
        perm = torch.randperm(len(Xtr), device=dev)
        for s in range(0, len(perm), 256):
            b = perm[s:s + 256]; loss = F.binary_cross_entropy_with_logits(net(Xtr[b]), Ytr[b]); opt.zero_grad(); loss.backward(); opt.step()
    net.eval()
    with torch.no_grad(): return torch.sigmoid(net(Xte)).cpu().numpy()

def cv(X, Y, folds, dev, name, hidden=128):
    P = np.zeros_like(Y, dtype=np.float32)
    for f in range(5):
        te = folds == f; tr = ~te
        P[te] = fit_predict(X[tr], Y[tr], X[te], dev, hidden)
    res = {}
    for j, th in enumerate(THEMES):
        if Y[:, j].sum() >= 30: res[th] = auc(P[:, j], Y[:, j])
    m = float(np.mean(list(res.values()))); print(f'{name}: AUC moyenne {m:.3f} sur {len(res)} thèmes', file=sys.stderr)
    return {'auc_moyenne': m, 'par_theme': res}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--emb', required=True, nargs='+'); ap.add_argument('--themes', required=True); ap.add_argument('--coups', required=True); ap.add_argument('--plateaux', required=True)
    ap.add_argument('--grains', default=''); ap.add_argument('--vocab', default=''); ap.add_argument('--out', required=True); ap.add_argument('--hidden', type=int, default=128)
    a = ap.parse_args(); dev = 'cuda' if torch.cuda.is_available() else 'cpu'; torch.manual_seed(0); np.random.seed(0)
    labels = {}
    for l in open(a.themes):
        j = json.loads(l); th = [t for t in j['themes'] if t in THEMES]
        if th: labels[(j['id'], j['ply'] + 1)] = th
    print(f'{len(labels)} coups commentés avec au moins un thème stratégique', file=sys.stderr)
    # traits triviaux depuis les plateaux
    idx = {g['id']: g for g in (json.loads(l) for l in open(a.plateaux + '.idx.jsonl'))}; fh = open(a.plateaux, 'rb')
    def trivial(gid, end):
        g = idx[gid]; fh.seek(g['off'] + REC * (end - 1)); b = np.frombuffer(fh.read(REC), dtype=np.uint8)
        board = b[:64]; w = sum(VAL[c] for c in board if 1 <= c <= 6); bl = sum(VAL[c - 6] for c in board if 7 <= c <= 12)
        return [end, b[64], w, bl, w - bl, (board > 0).sum(), ((board >= 1) & (board <= 6)).sum(), b[65] & 3, (b[65] >> 2) & 3, b[68] > 0, b[69]]
    out = {'n': 0, 'modeles': {}}
    keys = None; TRIV = None; Y = None; folds = None; studies = None
    for pref in a.emb:
        meta = [tuple(json.loads(l)[:2]) for l in open(pref + '.meta.jsonl')]; pos = {m: i for i, m in enumerate(meta)}
        if keys is None:
            keys = [k for k in labels if k in pos]; studies = np.array([k[0].split('_')[0] for k in keys]); us = sorted(set(studies)); rng = np.random.default_rng(0); perm = rng.permutation(len(us)); fold_of = {s: perm[i] % 5 for i, s in enumerate(us)}
            folds = np.array([fold_of[s] for s in studies]); Y = np.array([[1 if t in labels[k] else 0 for t in THEMES] for k in keys], dtype=np.float32); TRIV = np.array([trivial(*k) for k in keys], dtype=np.float32)
            out['n'] = len(keys); out['etudes'] = len(us); out['positifs'] = {t: int(Y[:, j].sum()) for j, t in enumerate(THEMES)}
            print(f'{len(keys)} coups joints, {len(us)} études', file=sys.stderr)
            out['modeles']['hasard'] = cv(rng.standard_normal((len(keys), 128)).astype(np.float32), Y, folds, dev, 'vecteurs au hasard', a.hidden)
            out['modeles']['triviaux'] = cv(TRIV, Y, folds, dev, 'traits triviaux (coup, camp, matériel, roques)', a.hidden)
        E = np.load(pref + '.emb.npy'); X = np.stack([E[pos[k]] for k in keys]).astype(np.float32); nm = pref.split('/')[-2]
        out['modeles'][nm] = cv(X, Y, folds, dev, f'espace {nm}', a.hidden)
        out['modeles'][nm + '+triviaux'] = cv(np.concatenate([X, TRIV], 1), Y, folds, dev, f'espace {nm} + triviaux', a.hidden)
    if a.grains and a.vocab:
        from dataset import node_feats
        vx = json.load(open(a.vocab))['x']; ix = {t: i for i, t in enumerate(vx)}; W = 16; want = {k[0] for k in keys}; bags = {}
        for fn in sorted(glob.glob(a.grains)):
            for l in open(fn):
                gid = l[7:l.index('"', 7)]
                if gid not in want: continue
                nodes = json.loads(l)['nodes']
                for k in keys:
                    if k[0] != gid or k[1] > len(nodes): continue
                    me = nodes[k[1] - 1]['s']; bag = np.zeros(len(vx), dtype=np.float32)
                    for nd in nodes[max(0, k[1] - W):k[1]]:
                        for t in node_feats(nd, me):
                            if t in ix: bag[ix[t]] = 1
                    bag[0] = 0; bags[k] = bag
        sel = np.array([i for i, k in enumerate(keys) if k in bags])
        if len(sel) > 500:
            B = np.stack([bags[keys[i]] for i in sel]); out['modeles']['sac_de_grains'] = cv(B, Y[sel], folds[sel], dev, f'sac de grains ({len(sel)} coups)', a.hidden)
            E = np.load(a.emb[0] + '.emb.npy'); meta = [tuple(json.loads(l)[:2]) for l in open(a.emb[0] + '.meta.jsonl')]; pos = {m: i for i, m in enumerate(meta)}
            X0 = np.stack([E[pos[keys[i]]] for i in sel]).astype(np.float32)
            out['modeles'][a.emb[0].split('/')[-2] + '_memes_coups'] = cv(X0, Y[sel], folds[sel], dev, f'espace {a.emb[0].split("/")[-2]}, mêmes coups', a.hidden)
            out['modeles'][a.emb[0].split('/')[-2] + '+sac'] = cv(np.concatenate([X0, B], 1), Y[sel], folds[sel], dev, 'espace + sac de grains', a.hidden)
    json.dump(out, open(a.out, 'w'), indent=1, ensure_ascii=False); print(f'TERMINÉ → {a.out}', file=sys.stderr)

if __name__ == '__main__': main()
