#!/usr/bin/env python3
"""Base vectorielle et arbres remarquables de l'espace BRUT (6 octobre 2026, étage 1 → 2).

Les vecteurs viennent du modèle brut (aucune étiquette en entrée). Pour LIRE les groupes, on joint les grains des parties
qui en ont (lots 2021-02) : traits de nœud sur-représentés, faits d'avenir concentrés, exemples avec les coups. Les
grains ne servent donc qu'à la lecture a posteriori, pas à la construction de l'espace. Même format d'inventaire que
index.py (nommer.mjs, inventaire-page.py s'appliquent tels quels).

  python3 scripts/arbres/index-brut.py data/brut/model --grains 'data/grains/elite-2021-02.s*.jsonl' \
      --vocab data/arbres3/windows.vocab.json --out data/brut/arbres --k 2000 --k2 200
"""
import argparse, json, sys, os, glob
import numpy as np, faiss
sys.path.insert(0, os.path.dirname(__file__)); from dataset import node_feats, future_feats

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('brut'); ap.add_argument('--grains', required=True); ap.add_argument('--vocab', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--k', type=int, default=2000); ap.add_argument('--k2', type=int, default=0); ap.add_argument('--min-games', type=int, default=200)
    ap.add_argument('--examples', type=int, default=6); ap.add_argument('--future', type=int, default=10); ap.add_argument('--train-sample', type=int, default=2000000)
    a = ap.parse_args()
    E = np.load(a.brut + '.emb.npy').astype(np.float32); N, D = E.shape; faiss.normalize_L2(E)
    meta = [json.loads(l) for l in open(a.brut + '.meta.jsonl')]; W = 16
    index = faiss.IndexFlatIP(D); index.add(E); faiss.write_index(index, a.out + '.faiss'); print(f'index : {N} vecteurs de dimension {D}', file=sys.stderr)
    rng = np.random.default_rng(1); samp = E if N <= a.train_sample else E[rng.choice(N, a.train_sample, replace=False)]
    km = faiss.Kmeans(D, a.k, niter=25, seed=1, spherical=True); km.train(samp)
    _, lab = km.index.search(E, 1); lab = lab[:, 0]; k = a.k
    if a.k2:
        cents = km.centroids.copy(); faiss.normalize_L2(cents); sizes = np.bincount(lab, minlength=a.k).astype(np.float32)
        rep = np.repeat(np.arange(a.k), np.maximum(1, (sizes / sizes.mean() * 4).astype(int)))
        km2 = faiss.Kmeans(D, a.k2, niter=40, seed=2, spherical=True); km2.train(cents[rep]); _, l2 = km2.index.search(cents, 1); lab = l2[lab, 0]; k = a.k2
        np.save(a.out + '.centres2.npy', km2.centroids); np.save(a.out + '.fin2arbre.npy', l2[:, 0]); print(f'second niveau : {a.k2} arbres', file=sys.stderr)
    np.save(a.out + '.labels.npy', lab); np.save(a.out + '.centres.npy', km.centroids)
    # Lecture : grains joints par (partie, fin)
    vocab = json.load(open(a.vocab)); vx = vocab['x']; vy = vocab['y']; ix = {t: i for i, t in enumerate(vx)}; iy = {t: i for i, t in enumerate(vy)}
    want = {}
    for i, m in enumerate(meta): want.setdefault(m[0], []).append(i)
    rows, PX, PY, sans = [], [], [], {}
    for fn in sorted(glob.glob(a.grains)):
        for l in open(fn):
            gid = l[7:l.index('"', 7)]
            if gid not in want: continue
            nodes = json.loads(l)['nodes']; sans[gid] = [n['san'] for n in nodes]
            for i in want[gid]:
                end, me = meta[i][1], meta[i][2]
                if end + a.future > len(nodes): continue
                px = np.zeros(len(vx), dtype=np.uint8); py = np.zeros(len(vy), dtype=np.uint8)
                for nd in nodes[end - W:end]:
                    for t in node_feats(nd, me):
                        if t in ix: px[ix[t]] = 1
                for t in future_feats(nodes[end:end + a.future], me):
                    if t in iy: py[iy[t]] = 1
                rows.append(i); PX.append(px); PY.append(py)
    rows = np.array(rows); PX = np.stack(PX); PY = np.stack(PY); PX[:, 0] = 0
    print(f'lecture : {len(rows)} fenêtres jointes aux grains', file=sys.stderr)
    glob_x = PX.mean(0) + 1e-6; glob_y = PY.mean(0) + 1e-6
    games = np.array([m[0] for m in meta]); sub_lab = lab[rows]; groups = []
    for c in range(k):
        idx = np.where(lab == c)[0]
        if len(idx) < 30: continue
        n_games = len(set(games[idx]))
        if n_games < a.min_games: continue
        cen = E[idx].mean(0); cen /= np.linalg.norm(cen) + 1e-9; compact = float((E[idx] @ cen).mean())
        s = np.where(sub_lab == c)[0]
        if len(s) < 10: continue
        py = PY[s].mean(0); px = PX[s].mean(0)
        lift_y = py / glob_y; sal_y = [(vy[j], float(py[j]), float(lift_y[j])) for j in np.argsort(-py * np.log(lift_y + 1e-9)) if py[j] >= 0.4 and lift_y[j] >= 1.5][:8]
        lift_x = px / glob_x; sal_x = [(vx[j], float(px[j]), float(lift_x[j])) for j in np.argsort(-px * np.log(lift_x + 1e-9)) if px[j] >= 0.5 and lift_x[j] >= 1.5][:12]
        previs = float(sum(p for _, p, _ in sal_y)) if sal_y else 0.0
        ex_rows = rows[s[np.argsort(-(E[rows[s]] @ cen))][:a.examples]]; ex = [meta[i] for i in ex_rows]
        groups.append({'groupe': int(c), 'fenetres': int(len(idx)), 'parties': n_games, 'lues': int(len(s)), 'compacite': compact, 'previsibilite': previs, 'traits': sal_x, 'avenir': sal_y, 'exemples': ex,
                       'exemples_coups': [{'id': m[0], 'fin': m[1], 'camp': m[2], 'fenetre': ' '.join(sans[m[0]][max(0, m[1] - W):m[1]]), 'suite': ' '.join(sans[m[0]][m[1]:m[1] + 10])} for m in ex],
                       'score': float(np.log1p(n_games) * (0.5 + previs) * (0.5 + compact))})
    groups.sort(key=lambda g: -g['score'])
    json.dump({'n': N, 'k': k, 'groupes': groups}, open(a.out + '.inventaire.json', 'w'), ensure_ascii=False, indent=1)
    cover = sum(g['fenetres'] for g in groups) / N
    print(f'TERMINÉ {len(groups)} groupes avec ≥ {a.min_games} parties ; couverture : {cover:.1%}', file=sys.stderr)
    for g in groups[:10]: print(f"groupe {g['groupe']} : {g['parties']} parties, prévisibilité {g['previsibilite']:.2f}, traits {[t for t,_,_ in g['traits'][:5]]}, avenir {[t for t,_,_ in g['avenir'][:4]]}", file=sys.stderr)

if __name__ == '__main__': main()
