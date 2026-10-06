#!/usr/bin/env python3
"""Base vectorielle et arbres remarquables (6 octobre 2026).

  python3 scripts/arbres/index.py data/arbres/windows data/arbres/model --out data/arbres/arbres --k 2000
Fait :
  - un index FAISS des vecteurs de fenêtres (recherche des plus proches) ;
  - un regroupement en k groupes (k-moyennes) ;
  - pour chaque groupe : soutien (fenêtres, parties, joueurs distincts par Elo+résultat faute d'identité), compacité,
    PRÉVISIBILITÉ des suites (concentration des traits d'avenir), traits de nœud les plus sur-représentés,
    exemples (partie lichess, demi-coup) ;
  - un inventaire JSON trié : les groupes remarquables d'abord (soutien large, suites prévisibles, traits saillants).
"""
import argparse, json, sys, collections
import numpy as np
import faiss

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('prefix'); ap.add_argument('model'); ap.add_argument('--out', required=True)
    ap.add_argument('--k', type=int, default=2000); ap.add_argument('--min-games', type=int, default=200)
    ap.add_argument('--examples', type=int, default=6)
    ap.add_argument('--grains', nargs='*', default=[], help='fichiers de grains, pour joindre les coups des exemples')
    a = ap.parse_args()
    E = np.load(a.model + '.emb.npy').astype(np.float32); N, D = E.shape
    z = np.load(a.prefix + '.npz'); X = z['X']; Y = z['Y']
    vocab = json.load(open(a.prefix + '.vocab.json')); vx = vocab['x']; vy = vocab['y']
    meta = [json.loads(l) for l in open(a.prefix + '.meta.jsonl')]
    faiss.normalize_L2(E)
    index = faiss.IndexFlatIP(D); index.add(E); faiss.write_index(index, a.out + '.faiss')
    print(f'index : {N} vecteurs de dimension {D}', file=sys.stderr)
    km = faiss.Kmeans(D, a.k, niter=25, seed=1, spherical=True, verbose=False); km.train(E)
    _, lab = km.index.search(E, 1); lab = lab[:, 0]
    np.save(a.out + '.labels.npy', lab)
    # statistiques globales des traits (pour la sur-représentation)
    Xf = X.reshape(N, -1)
    glob_x = np.zeros(len(vx));
    for j in range(len(vx)): pass
    # comptage vectorisé des traits présents par fenêtre (présence, pas multiplicité)
    pres = np.zeros((N, len(vx)), dtype=np.uint8)
    rows = np.repeat(np.arange(N), Xf.shape[1]); pres[rows, Xf.reshape(-1)] = 1; pres[:, 0] = 0
    glob_x = pres.mean(0) + 1e-6; glob_y = Y.mean(0) + 1e-6
    groups = []
    games = np.array([m[0] for m in meta])
    for c in range(a.k):
        idx = np.where(lab == c)[0]
        if len(idx) < 30: continue
        g = games[idx]; n_games = len(set(g))
        if n_games < a.min_games: continue
        cen = E[idx].mean(0); cen /= np.linalg.norm(cen) + 1e-9
        compact = float((E[idx] @ cen).mean())
        py = Y[idx].mean(0); px = pres[idx].mean(0)
        # prévisibilité des suites : traits d'avenir très fréquents dans le groupe et bien plus que globalement
        lift_y = py / glob_y; sal_y = [(vy[j], float(py[j]), float(lift_y[j])) for j in np.argsort(-py * np.log(lift_y + 1e-9)) if py[j] >= 0.4 and lift_y[j] >= 1.5][:8]
        lift_x = px / glob_x; sal_x = [(vx[j], float(px[j]), float(lift_x[j])) for j in np.argsort(-px * np.log(lift_x + 1e-9)) if px[j] >= 0.5 and lift_x[j] >= 1.5][:12]
        previs = float(sum(p for _, p, _ in sal_y)) if sal_y else 0.0
        ex = [meta[i] for i in idx[np.argsort(-(E[idx] @ cen))][:a.examples]]
        groups.append({'groupe': int(c), 'fenetres': int(len(idx)), 'parties': n_games, 'compacite': compact, 'previsibilite': previs,
                       'traits': sal_x, 'avenir': sal_y, 'exemples': ex,
                       'score': float(np.log1p(n_games) * (0.5 + previs) * (0.5 + compact))})
    groups.sort(key=lambda g: -g['score'])
    # Coups des exemples (fenêtre + suite), lus dans les grains, pour le nommage et la lecture humaine
    if a.grains:
        import glob as _g
        want = {m[0] for g in groups[:200] for m in g['exemples']}
        sans = {}
        for pat in a.grains:
            for fn in sorted(_g.glob(pat)):
                with open(fn) as fh:
                    for line in fh:
                        j = line.index('"id":'); gid = line[j + 6:line.index('"', j + 6)]
                        if gid in want: rec = json.loads(line); sans[gid] = [n['san'] for n in rec['nodes']]
        W = vocab['window']
        for g in groups[:200]:
            g['exemples_coups'] = [{'id': m[0], 'fin': m[1], 'camp': m[2], 'fenetre': ' '.join(sans.get(m[0], [])[max(0, m[1] - W):m[1]]), 'suite': ' '.join(sans.get(m[0], [])[m[1]:m[1] + 10])} for m in g['exemples']]
    json.dump({'n': N, 'k': a.k, 'groupes': groups}, open(a.out + '.inventaire.json', 'w'), ensure_ascii=False, indent=1)
    cover = sum(g['fenetres'] for g in groups) / N
    print(f'TERMINÉ {len(groups)} groupes avec ≥ {a.min_games} parties ; couverture des fenêtres : {cover:.1%}', file=sys.stderr)
    for g in groups[:10]:
        print(f"groupe {g['groupe']} : {g['parties']} parties, prévisibilité {g['previsibilite']:.2f}, traits {[t for t,_,_ in g['traits'][:5]]}, avenir {[t for t,_,_ in g['avenir'][:4]]}", file=sys.stderr)

if __name__ == '__main__':
    main()
