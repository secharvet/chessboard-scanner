#!/usr/bin/env python3
"""Plonge de nouvelles fenêtres avec un modèle entraîné et les affecte aux arbres.
   python3 scripts/arbres/plonger.py <prefix_fenetres> <model.pt> <arbres_prefix> --out <sortie.npz>
   Sortie : vecteurs h, numéro d'arbre, cosinus au centre, pour chaque fenêtre (ordre de <prefix>.meta.jsonl)."""
import argparse, json, numpy as np, torch, sys
sys.path.insert(0, __import__('os').path.dirname(__file__))
from train import Encoder
ap = argparse.ArgumentParser(); ap.add_argument('prefix'); ap.add_argument('model'); ap.add_argument('arbres'); ap.add_argument('--out', required=True)
a = ap.parse_args()
z = np.load(a.prefix + '.npz'); X = torch.from_numpy(z['X'].astype(np.int64))
ck = torch.load(a.model, map_location='cpu')
m = Encoder(ck['n_tok'], ck['W'], ck['dim'], ck['layers'], n_out=ck['n_out']); m.load_state_dict(ck['state']); m.eval()
dev = 'cuda' if torch.cuda.is_available() else 'cpu'; m.to(dev)
H = []
with torch.no_grad():
    for s in range(0, len(X), 2048): h, _, _ = m(X[s:s + 2048].to(dev)); H.append(h.cpu().numpy())
H = np.concatenate(H).astype(np.float32); H /= np.linalg.norm(H, axis=1, keepdims=True) + 1e-9
C = np.load(a.arbres + '.centres.npy').astype(np.float32); C /= np.linalg.norm(C, axis=1, keepdims=True) + 1e-9
sim = H @ C.T; fin = sim.argmax(1); cos = sim.max(1)
try: f2a = np.load(a.arbres + '.fin2arbre.npy'); arbre = f2a[fin]
except FileNotFoundError: arbre = fin
np.savez(a.out, H=H, fin=fin, arbre=arbre, cos=cos)
json.dump({'arbre': arbre.tolist(), 'cos': [round(float(c), 4) for c in cos]}, open(a.out.replace('.npz', '') + '.json', 'w'))
print(f'{len(H)} fenêtres plongées → {a.out}', file=sys.stderr)
