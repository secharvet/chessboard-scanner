#!/usr/bin/env python3
"""Le lecteur (8 octobre 2026) : modèle brut à l'échelle + sonde des thèmes des maîtres + arbres nommés, sur une partie.

  entraîner la sonde (une fois) :
    python3 scripts/arbres/lecteur.py entrainer --emb data/brut-x/annotes --themes data/reference/annotes/themes-fable.jsonl --out data/brut-x/lecteur-sonde.pt
  lire une partie :
    python3 scripts/arbres/lecteur.py lire partie.bin --model data/brut-x/model.pt --sonde data/brut-x/lecteur-sonde.pt \
        --arbres data/brut-x/arbres --noms data/brut-x/noms.json [--from 40] [--json sortie.json]
Pour chaque demi-coup à partir du 40e : thèmes probables (probabilité calibrée sur les parties annotées, rapport à la fréquence
de base), les trois arbres les plus proches avec leur nom, et les faits d'avenir les plus probables si --avenir (non fourni ici).
Tout est local : pas d'appel à un LLM.
"""
import argparse, json, sys, os
import numpy as np, torch, torch.nn.functional as F
sys.path.insert(0, os.path.dirname(__file__))
THEMES = ['attaque_roi', 'defense_roi', 'colonne_ouverte', 'structure_pions', 'case_faible_avant_poste', 'echange_pieces', 'developpement', 'centre_espace', 'levier_rupture', 'prophylaxie', 'manoeuvre', 'initiative_pression', 'tactique', 'finale', 'materiel', 'blocus', 'aile_dame']
LIBELLE = {'attaque_roi': 'attaque du roi', 'defense_roi': 'défense du roi', 'colonne_ouverte': 'colonne ouverte', 'structure_pions': 'structure de pions', 'case_faible_avant_poste': 'case faible / avant-poste', 'echange_pieces': 'échange de pièces', 'developpement': 'développement', 'centre_espace': 'centre et espace', 'levier_rupture': 'levier / rupture', 'prophylaxie': 'prophylaxie', 'manoeuvre': 'manœuvre', 'initiative_pression': 'initiative / pression', 'tactique': 'tactique', 'finale': 'finale', 'materiel': 'matériel', 'blocus': 'blocus', 'aile_dame': 'aile dame'}
REC = 72

def entrainer(a):
    labels = {}
    for l in open(a.themes):
        j = json.loads(l); th = [t for t in j['themes'] if t in THEMES]
        if th: labels[(j['id'], j['ply'] + 1)] = th
    meta = [tuple(json.loads(l)[:2]) for l in open(a.emb + '.meta.jsonl')]; E = np.load(a.emb + '.emb.npy')
    keys = [(i, k) for i, k in enumerate(meta) if k in labels]
    X = np.stack([E[i] for i, _ in keys]).astype(np.float32); Y = np.array([[1 if t in labels[k] else 0 for t in THEMES] for _, k in keys], dtype=np.float32)
    mu = X.mean(0); sd = X.std(0) + 1e-6; Xn = torch.from_numpy((X - mu) / sd); Yt = torch.from_numpy(Y)
    torch.manual_seed(0); net = torch.nn.Sequential(torch.nn.Linear(X.shape[1], a.hidden), torch.nn.GELU(), torch.nn.Dropout(0.3), torch.nn.Linear(a.hidden, len(THEMES)))
    opt = torch.optim.AdamW(net.parameters(), lr=1e-3, weight_decay=1e-2)
    for ep in range(a.epochs):
        perm = torch.randperm(len(Xn))
        for s in range(0, len(perm), 256):
            b = perm[s:s + 256]; loss = F.binary_cross_entropy_with_logits(net(Xn[b]), Yt[b]); opt.zero_grad(); loss.backward(); opt.step()
    net.eval()
    torch.save({'state': net.state_dict(), 'mu': mu, 'sd': sd, 'hidden': a.hidden, 'base': Y.mean(0), 'n': len(keys)}, a.out)
    print(f'sonde entraînée sur {len(keys)} coups commentés → {a.out}', file=sys.stderr)

def lire(a):
    from importlib import import_module
    tb = import_module('train-brut'); Brut, Plies = tb.Brut, tb.Plies
    ck = torch.load(a.model, map_location='cpu'); W = ck['W']
    model = Brut(W, ck['dim'], ck['layers'], ck.get('heads', 4)); model.load_state_dict(ck['state'], strict=False); model.eval()
    raw = np.fromfile(a.partie, dtype=np.uint8).reshape(-1, REC); n = len(raw)
    san = json.load(open(a.partie + '.san.json')) if os.path.exists(a.partie + '.san.json') else [str(i + 1) for i in range(n)]
    P = Plies([('p', raw)])
    sk = torch.load(a.sonde, map_location='cpu', weights_only=False)
    net = torch.nn.Sequential(torch.nn.Linear(ck['dim'], sk['hidden']), torch.nn.GELU(), torch.nn.Dropout(0.3), torch.nn.Linear(sk['hidden'], len(THEMES))); net.load_state_dict(sk['state']); net.eval()
    base = sk['base']
    cent = np.load(a.arbres + '.centres2.npy') if os.path.exists(a.arbres + '.centres2.npy') else np.load(a.arbres + '.centres.npy'); cent = cent / (np.linalg.norm(cent, axis=1, keepdims=True) + 1e-9)
    groupes = json.load(open(a.arbres + '.inventaire.json'))['groupes'] if os.path.exists(a.arbres + '.inventaire.json') else []
    inv = {g['groupe']: g for g in groupes}; noms = {}
    if a.noms:
        nn_ = json.load(open(a.noms)); items = nn_ if isinstance(nn_, list) else list(nn_.values())
        for i, x in enumerate(items):  # les noms suivent l'ordre de l'inventaire (nommer.mjs), sauf si le groupe est indiqué
            g = int(x['groupe']) if 'groupe' in x else (groupes[i]['groupe'] if i < len(groupes) else None)
            if g is not None: noms[g] = x
    out = []
    ends = list(range(max(W, a.start), n + 1))
    with torch.no_grad():
        for end in ends:
            x, _, _, _ = P.batch(np.array([0]), np.array([end]), W, 0)
            h, _, _, _, _ = model(torch.from_numpy(x)); h = h[0]
            z = (h.numpy() - sk['mu']) / sk['sd']; p = torch.sigmoid(net(torch.from_numpy(z).float()[None]))[0].numpy()
            lift = p / (base + 1e-6)
            order = np.argsort(-p); themes = [(THEMES[j], float(p[j]), float(lift[j])) for j in order[:4]]
            v = h.numpy() / (np.linalg.norm(h.numpy()) + 1e-9); sims = cent @ v; top = np.argsort(-sims)[:3]
            arbres = [(int(c), float(sims[c]), noms.get(int(c), {}).get('nom', ''), noms.get(int(c), {}).get('phase', ''), inv.get(int(c), {}).get('parties', 0)) for c in top]
            me = 'Blancs' if (end - 1) % 2 == 0 else 'Noirs'
            out.append({'demi_coup': end, 'coup': san[end - 1] if end - 1 < len(san) else '', 'camp': me, 'themes': themes, 'arbres': arbres})
    for r in out:
        th = ', '.join(f"{LIBELLE[t]} {p:.0%} (×{l:.1f})" for t, p, l in r['themes'] if l >= a.lift or p >= 0.5)
        ar = ' | '.join(f"{nm or 'arbre ' + str(c)} ({s:.2f})" for c, s, nm, ph, np_ in r['arbres'][:2])
        print(f"{(r['demi_coup'] + 1) // 2}{'.' if r['camp'] == 'Blancs' else '...'} {r['coup']:7s} {th}   ⟶ {ar}")
    if a.json: json.dump(out, open(a.json, 'w'), ensure_ascii=False, indent=1)

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest='cmd', required=True)
    e = sub.add_parser('entrainer'); e.add_argument('--emb', required=True); e.add_argument('--themes', required=True); e.add_argument('--out', required=True); e.add_argument('--hidden', type=int, default=128); e.add_argument('--epochs', type=int, default=40)
    l = sub.add_parser('lire'); l.add_argument('partie'); l.add_argument('--model', required=True); l.add_argument('--sonde', required=True); l.add_argument('--arbres', required=True); l.add_argument('--noms', default=''); l.add_argument('--start', type=int, default=40); l.add_argument('--lift', type=float, default=1.3); l.add_argument('--json', default='')
    a = ap.parse_args(); entrainer(a) if a.cmd == 'entrainer' else lire(a)
