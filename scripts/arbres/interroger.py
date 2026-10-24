#!/usr/bin/env python3
"""Interroger les arbres : une suite de coups en entrée, les arbres les plus proches pour chaque camp en sortie.

  python3 scripts/arbres/interroger.py --moves "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 b4 cxd4 cxd4 Nf5 Bb2 Bd7 Be2 Rc8" \
      --prefix data/arbres3/windows --model data/arbres3/model.pt --arbres data/arbres3/arbres [--noms data/arbres3/noms.json] [--k 3]

Étapes : grains (node scripts/grains.mjs, les mêmes que pour l'entraînement) → traits relationnels avec le vocabulaire du
modèle → vecteur → arbres les plus proches (centres) et fenêtres voisines (FAISS). Vu du camp qui vient de jouer, puis de
l'autre camp (sa dernière fenêtre, un demi-coup plus tôt).
"""
import argparse, json, os, subprocess, sys, tempfile
import numpy as np, torch
sys.path.insert(0, os.path.dirname(__file__))
from train import Encoder
from dataset import node_feats, K

ap = argparse.ArgumentParser()
ap.add_argument('--moves', required=True); ap.add_argument('--prefix', required=True); ap.add_argument('--model', required=True); ap.add_argument('--arbres', required=True)
ap.add_argument('--noms', default=''); ap.add_argument('--k', type=int, default=3); ap.add_argument('--json', action='store_true')
a = ap.parse_args()
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
vocab = json.load(open(a.prefix + '.vocab.json')); ix = {t: i for i, t in enumerate(vocab['x'])}; W = vocab['window']
# grains de la partie donnée
js = f"""import {{ grains }} from '{root}/scripts/grains.mjs'; import {{ Chess }} from 'chess.js';
const c = new Chess(); const uci = []; for (const s of {json.dumps(a.moves.split())}) {{ const m = c.move(s); uci.push(m.from + m.to + (m.promotion ?? '')); }}
console.log(JSON.stringify(grains(uci, {{ id: 'requete' }})));"""
with tempfile.NamedTemporaryFile('w', suffix='.mjs', delete=False, dir=root) as fh: fh.write(js); tmp = fh.name
try: g = json.loads(subprocess.check_output(['node', tmp], cwd=root, text=True))
finally: os.unlink(tmp)
nodes = g['nodes']
if len(nodes) < W: sys.exit(f'il faut au moins {W} demi-coups (reçu {len(nodes)})')
ck = torch.load(a.model, map_location='cpu'); m = Encoder(ck['n_tok'], ck['W'], ck['dim'], ck['layers'], n_out=ck['n_out']); m.load_state_dict(ck['state']); m.eval()
C = np.load(a.arbres + '.centres.npy').astype(np.float32); C /= np.linalg.norm(C, axis=1, keepdims=True) + 1e-9
try: f2a = np.load(a.arbres + '.fin2arbre.npy')
except FileNotFoundError: f2a = None
inv = json.load(open(a.arbres + '.inventaire.json')); byg = {g_['groupe']: g_ for g_ in inv['groupes']}
noms = json.load(open(a.noms)) if a.noms and os.path.exists(a.noms) else {}
vy = vocab['y']
def fenetre(end):
    win = nodes[end - W:end]; me = win[-1]['s']
    toks = np.zeros((1, W, K), dtype=np.int64)
    for j, nd in enumerate(win):
        ids = [ix[t] for t in node_feats(nd, me) if t in ix][:K]; toks[0, j, :len(ids)] = ids
    with torch.no_grad(): h, logits, _ = m(torch.from_numpy(toks))
    h = h[0].numpy(); h /= np.linalg.norm(h) + 1e-9
    sim = C @ h; order = np.argsort(-sim)[:50]
    arbres = []
    for fin in order:
        ar = int(f2a[fin]) if f2a is not None else int(fin)
        if any(x['arbre'] == ar for x in arbres): continue
        gg = byg.get(ar); nm = noms.get(str(ar), {})
        arbres.append({'arbre': ar, 'cos': float(sim[fin]), 'nom': nm.get('nom'), 'sens': nm.get('sens'), 'parties': gg['parties'] if gg else None,
                       'suite': [t for t, _, _ in (gg['avenir'] if gg else [])][:5], 'traits': [t for t, _, _ in (gg['traits'] if gg else [])][:6]})
        if len(arbres) >= a.k: break
    p = torch.sigmoid(logits[0]).numpy(); top = np.argsort(-p)[:6]
    return {'camp': me, 'fin': end, 'coups': ' '.join(n['san'] for n in win), 'arbres': arbres, 'avenir_predit': [(vy[j], round(float(p[j]), 2)) for j in top]}
res = {'moi': fenetre(len(nodes)), 'lui': fenetre(len(nodes) - 1)}
if a.json: print(json.dumps(res, ensure_ascii=False, indent=1)); sys.exit()
for who, r in res.items():
    camp = 'Blancs' if r['camp'] == 'w' else 'Noirs'
    print(f"\n=== {'Le camp qui vient de jouer' if who == 'moi' else 'L’autre camp'} ({camp}), fenêtre : {r['coups']}")
    for x in r['arbres']:
        print(f"  arbre {x['arbre']} (cos {x['cos']:.2f}, {x['parties']} parties) : {x['nom'] or '—'}")
        if x['sens']: print(f"      {x['sens']}")
        print(f"      suite habituelle : {', '.join(x['suite'])}")
    print(f"  avenir prédit : {', '.join(f'{t} {p}' for t, p in r['avenir_predit'])}")
