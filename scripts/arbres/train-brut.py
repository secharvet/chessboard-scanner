#!/usr/bin/env python3
"""Étage 1 (6 octobre 2026) : apprendre sur l'échiquier BRUT, sans aucune étiquette en entrée.

Entrée : les plateaux (scripts/plateaux.mjs) : 72 octets par demi-coup, 64 codes de pièces + trait + roque + coup joué.
Fenêtre : W demi-coups de positions brutes, vue du camp qui vient de jouer (l'échiquier est retourné pour les Noirs, les
pièces recolorées : « moi » est toujours en bas). Le modèle :
  - encode chaque position (plongement pièce × case + trait + roque + coup joué from/to) → vecteur de position ;
  - un transformeur sur la séquence des W positions → vecteur de fenêtre h ;
  - objectifs : (1) prédire le PROCHAIN coup (case de départ et case d'arrivée, 64 + 64 classes), (2) voisinage temporel
    (InfoNCE avec la fenêtre suivante de la même partie). Aucune étiquette humaine, aucun détecteur.
Sorties : poids, vecteurs de toutes les fenêtres (pour FAISS, k-moyennes, sondes), rapport (précision du prochain coup
contre la fréquence, perte).

  python3 scripts/arbres/train-brut.py 'data/plateaux/*.bin' --out data/brut/model --window 16 --stride 2 --start 10 --epochs 2
"""
import argparse, glob, json, math, sys, time, os, zlib
import numpy as np, torch, torch.nn as nn, torch.nn.functional as F

REC = 72
def load_games(patterns, max_games=0, min_plies=30, max_per_file=0):
    games = []
    for pat in patterns:
        for fn in sorted(glob.glob(pat)):
            idx = [json.loads(l) for l in open(fn + '.idx.jsonl')]
            if max_per_file: idx = idx[:max_per_file]
            with open(fn, 'rb') as fh:
                for g in idx:
                    fh.seek(g['off']); raw = np.frombuffer(fh.read(REC * g['n']), dtype=np.uint8).reshape(g['n'], REC)
                    if g['n'] >= min_plies: games.append((g['id'], raw))
                    if max_games and len(games) >= max_games: return games
    return games

# Retournement pour les Noirs : la case (f, r) devient (f, 7-r) et les couleurs s'échangent (1-6 ↔ 7-12).
FLIP = np.array([(7 - s // 8) * 8 + s % 8 for s in range(64)])
SWAP = np.array([0, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6], dtype=np.uint8)
def oriented(raw):
    """Deux lectures de chaque demi-coup, [n, 70] uint8 : vue des Blancs (telle quelle) et vue des Noirs (échiquier retourné,
    couleurs échangées, trait relatif, droits de roque échangés). Colonnes : 64 cases, trait, roque, from, to, prise, échec."""
    n = len(raw); w = np.zeros((n, 70), dtype=np.uint8); b = np.zeros((n, 70), dtype=np.uint8)
    w[:, :64] = raw[:, :64]; w[:, 64:70] = raw[:, 64:70]
    b[:, :64] = SWAP[raw[:, :64][:, FLIP]]; b[:, 64] = raw[:, 64] ^ 1; c = raw[:, 65]; b[:, 65] = ((c >> 2) & 3) | ((c & 3) << 2)
    b[:, 66] = FLIP[raw[:, 66]]; b[:, 67] = FLIP[raw[:, 67]]; b[:, 68:70] = raw[:, 68:70]
    return w, b

class Plies:
    """Toutes les parties bout à bout : PW/PB [total, 70] (deux orientations), offsets par partie."""
    def __init__(self, games):
        self.ids = [g for g, _ in games]; lens = np.array([len(r) for _, r in games]); self.off = np.concatenate([[0], np.cumsum(lens)]); self.len = lens
        W_, B_ = zip(*(oriented(r) for _, r in games)); self.PW = np.concatenate(W_); self.PB = np.concatenate(B_)
    def batch(self, gi, end, W, H=0):
        """gi, end : tableaux [B]. Fenêtre = demi-coups [end-W, end) de la partie, vue du camp qui vient de jouer (le demi-coup
        end-1) ; cible = coup joué au demi-coup end, dans la même orientation."""
        g = self.off[gi] + end; last = g - 1
        me_black = (self.PW[last, 64] == 0)  # après mon coup, le trait est à l'autre : trait blanc ⇒ je suis noir
        idx = g[:, None] - W + np.arange(W)[None, :]
        x = np.where(me_black[:, None, None], self.PB[idx], self.PW[idx]).astype(np.int64)
        gq = np.minimum(g, len(self.PW) - 1); nxt = np.where(me_black[:, None], self.PB[gq], self.PW[gq])
        hz = None
        if H:
            # horizon : les H demi-coups suivants (bornés à la fin de la partie) ; cibles multi-étiquettes [B, 256] :
            # cases d'arrivée de mes coups (64), cases d'arrivée des siens (64), cases de départ des miens (64), des siens (64)
            lim = (self.off[gi] + self.len[gi])[:, None]; fi = g[:, None] + np.arange(H)[None, :]; ok = fi < lim; fi = np.minimum(fi, lim - 1)
            fut = np.where(me_black[:, None, None], self.PB[fi], self.PW[fi]); mine = (np.arange(H)[None, :] % 2 == 0) & ok; his = (np.arange(H)[None, :] % 2 == 1) & ok
            hz = np.zeros((len(gi), 256), dtype=np.float32); r = np.arange(len(gi))[:, None].repeat(H, 1)
            hz[r[mine], fut[..., 67][mine]] = 1; hz[r[his], 64 + fut[..., 67][his]] = 1; hz[r[mine], 128 + fut[..., 66][mine]] = 1; hz[r[his], 192 + fut[..., 66][his]] = 1
        return x, nxt[:, 66].astype(np.int64), nxt[:, 67].astype(np.int64), hz

class Brut(nn.Module):
    def __init__(self, W, dim=128, layers=4, heads=4):
        super().__init__()
        self.piece = nn.Embedding(13, 32); self.square = nn.Parameter(torch.zeros(64, 32))
        self.turn = nn.Embedding(2, dim); self.cast = nn.Embedding(16, dim); self.emb_fr = nn.Embedding(64, dim); self.emb_to = nn.Embedding(64, dim); self.cap = nn.Embedding(7, dim); self.chk = nn.Embedding(3, dim)
        self.board_proj = nn.Sequential(nn.Linear(64 * 32, 512), nn.GELU(), nn.Linear(512, dim))
        self.pos = nn.Parameter(torch.zeros(1, W + 1, dim)); self.cls = nn.Parameter(torch.zeros(1, 1, dim))
        enc = nn.TransformerEncoderLayer(dim, heads, dim * 4, dropout=0.1, batch_first=True, norm_first=True)
        self.tr = nn.TransformerEncoder(enc, layers); self.norm = nn.LayerNorm(dim)
        self.head_from = nn.Linear(dim, 64); self.head_to = nn.Linear(dim, 64); self.head_hz = nn.Linear(dim, 256)
        self.proj = nn.Sequential(nn.Linear(dim, dim), nn.GELU(), nn.Linear(dim, dim))
        for p in (self.square, self.pos, self.cls): nn.init.normal_(p, std=0.02)
    def forward(self, x):  # x : [B, W, 70]
        B, W, _ = x.shape
        b = self.piece(x[..., :64]) + self.square  # [B, W, 64, 32]
        e = self.board_proj(b.reshape(B, W, -1)) + self.turn(x[..., 64]) + self.cast(x[..., 65]) + self.emb_fr(x[..., 66]) + self.emb_to(x[..., 67]) + self.cap(x[..., 68]) + self.chk(x[..., 69])
        e = torch.cat([self.cls.expand(B, -1, -1), e], 1) + self.pos
        h = self.norm(self.tr(e))[:, 0]
        return h, self.head_from(h), self.head_to(h), F.normalize(self.proj(h), dim=-1), self.head_hz(h)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('inputs', nargs='+'); ap.add_argument('--out', required=True)
    ap.add_argument('--window', type=int, default=16); ap.add_argument('--stride', type=int, default=2); ap.add_argument('--start', type=int, default=10)
    ap.add_argument('--epochs', type=int, default=2); ap.add_argument('--batch', type=int, default=256); ap.add_argument('--dim', type=int, default=128); ap.add_argument('--layers', type=int, default=4)
    ap.add_argument('--lr', type=float, default=3e-4); ap.add_argument('--max-games', type=int, default=0); ap.add_argument('--max-end', type=int, default=80); ap.add_argument('--tau', type=float, default=0.1)
    ap.add_argument('--horizon', type=int, default=0, help='H > 0 : prédire aussi les cases jouées des H prochains demi-coups (regard plus loin que le coup suivant)')
    ap.add_argument('--nce-gap', type=int, default=1, help='la fenêtre voisine pour InfoNCE est la G-ième suivante de la même partie (1 = la suivante)')
    ap.add_argument('--w-move', type=float, default=1.0, help='poids de la perte du prochain coup')
    ap.add_argument('--embed', default='', help='ne pas entraîner : charger ce modèle (.pt) et plonger les fenêtres des entrées (sonde croisée entre corpus)')
    ap.add_argument('--max-per-file', type=int, default=0, help='ne lire que les N premières parties de chaque fichier')
    ap.add_argument('--min-plies', type=int, default=30)
    ap.add_argument('--resume', action='store_true', help='reprendre depuis <out>.ckpt.pt si présent (sauvegarde à chaque époque)')
    ap.add_argument('--amp', action='store_true', help='précision mixte bf16 (H100, A100)')
    ap.add_argument('--heads', type=int, default=4)
    a = ap.parse_args()
    games = load_games(a.inputs, a.max_games, min_plies=a.min_plies, max_per_file=a.max_per_file); P = Plies(games); print(f'{len(P.PW)} demi-coups chargés ({P.PW.nbytes * 2 / 1e9:.1f} Go)', file=sys.stderr)
    W = a.window
    # index des fenêtres : (partie, fin) ; la cible « prochain coup » exige end < n
    index = np.array([(gi, end) for gi, (_, raw) in enumerate(games) for end in range(a.start + W, min(len(raw) + (1 if a.embed else 0), a.max_end + 1), a.stride) if end < len(raw) + (1 if a.embed else 0)], dtype=np.int64)
    IG, IE = index[:, 0], index[:, 1]; del games
    N = len(index); print(f'{len(P.ids)} parties, {N} fenêtres', file=sys.stderr)
    gid = IG; h = np.array([zlib.crc32(str(P.ids[g]).encode()) % 10 for g in range(len(P.ids))]); val = h[IG] == 0
    G = a.nce_gap; nxt_idx = np.minimum(np.arange(N) + G, N - 1); same = gid[nxt_idx] == gid; nxt_idx = np.where(same, nxt_idx, np.arange(N))
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    if a.embed:
        ck = torch.load(a.embed, map_location=dev); a.dim = ck['dim']; a.layers = ck['layers']; a.heads = ck.get('heads', 4); assert ck['W'] == W
    torch.backends.cuda.matmul.allow_tf32 = True; torch.backends.cudnn.allow_tf32 = True
    model = Brut(W, a.dim, a.layers, a.heads).to(dev); opt = torch.optim.AdamW(model.parameters(), lr=a.lr, weight_decay=0.01)
    if a.embed: model.load_state_dict(ck['state'], strict=False); a.epochs = 0; print(f'plongement avec {a.embed}', file=sys.stderr)
    idx_tr = np.where(~val)[0]; idx_val = np.where(val)[0]
    steps = max(1, a.epochs) * math.ceil(len(idx_tr) / a.batch); sched = torch.optim.lr_scheduler.OneCycleLR(opt, a.lr, total_steps=steps)
    start_ep = 0; ck_path = a.out + '.ckpt.pt'
    if a.resume and os.path.exists(ck_path):
        ck = torch.load(ck_path, map_location=dev); model.load_state_dict(ck['state']); opt.load_state_dict(ck['opt']); start_ep = ck['epoch']; report = ck.get('report', {'epochs': [], 'games': len(P.ids), 'windows': N})
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            for _ in range(start_ep * math.ceil(len(idx_tr) / a.batch)): sched.step()  # avance le planificateur jusqu'au point de reprise
        print(f'reprise après l\'époque {start_ep}', file=sys.stderr)
    import threading, queue
    def prefetch(ids_all, bs, with_next):
        # un fil prépare les lots numpy pendant que le GPU calcule
        q = queue.Queue(maxsize=6)
        def work():
            for s in range(0, len(ids_all), bs):
                b = ids_all[s:s + bs]; x, f, t, hz = P.batch(IG[b], IE[b], W, a.horizon)
                x2 = P.batch(IG[nxt_idx[b]], IE[nxt_idx[b]], W, 0)[0] if with_next else None
                q.put((x, f, t, hz, x2))
            q.put(None)
        threading.Thread(target=work, daemon=True).start()
        while True:
            item = q.get()
            if item is None: return
            x, f, t, hz, x2 = item
            yield (torch.from_numpy(x).to(dev, non_blocking=True), torch.from_numpy(f).to(dev), torch.from_numpy(t).to(dev), (torch.from_numpy(hz).to(dev) if hz is not None else None), (torch.from_numpy(x2).to(dev, non_blocking=True) if x2 is not None else None))
    def batch(ids):
        x, f, t, hz = P.batch(IG[ids], IE[ids], W, a.horizon)
        return torch.from_numpy(x).to(dev), torch.from_numpy(f).to(dev), torch.from_numpy(t).to(dev), (torch.from_numpy(hz).to(dev) if hz is not None else None)
    # témoin : fréquence des cases de départ / d'arrivée
    t0 = time.time()
    if not (a.resume and start_ep): report = {'epochs': [], 'games': len(P.ids), 'windows': N}
    for ep in range(start_ep, a.epochs):
        model.train(); np.random.seed(ep); np.random.shuffle(idx_tr); tot = 0; nb = 0
        for x, fr, to, hz, x2 in prefetch(idx_tr, a.batch, True):
            with torch.autocast('cuda', dtype=torch.bfloat16, enabled=a.amp and dev == 'cuda'):
                h1, lf, lt, z1, lh = model(x); _, _, _, z2, _ = model(x2)
                loss_move = a.w_move * (F.cross_entropy(lf.float(), fr) + F.cross_entropy(lt.float(), to))
                if hz is not None: loss_move = loss_move + 4.0 * F.binary_cross_entropy_with_logits(lh.float(), hz)
                sim = z1.float() @ z2.float().T / a.tau; lab = torch.arange(len(fr), device=dev)
                loss_nce = (F.cross_entropy(sim, lab) + F.cross_entropy(sim.T, lab)) / 2
                loss = loss_move + 0.5 * loss_nce
            opt.zero_grad(); loss.backward(); torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0); opt.step(); sched.step()
            tot += loss.item(); nb += 1
            if nb % 200 == 0: print(f'ep {ep + 1} pas {nb}/{math.ceil(len(idx_tr) / a.batch)} perte {tot / nb:.3f} ({(time.time() - t0) / 60:.1f} min)', file=sys.stderr)
        model.eval(); ok_fr = ok_to = ok_both = n = 0
        with torch.no_grad():
            for s in range(0, len(idx_val), 1024):
                b = idx_val[s:s + 1024]; x, fr, to, _ = batch(b); _, lf, lt, _, _ = model(x)
                pf = lf.argmax(1); pt = lt.argmax(1); ok_fr += (pf == fr).sum().item(); ok_to += (pt == to).sum().item(); ok_both += ((pf == fr) & (pt == to)).sum().item(); n += len(b)
        e = {'epoch': ep + 1, 'prochain_coup_case_depart': ok_fr / n, 'prochain_coup_case_arrivee': ok_to / n, 'prochain_coup_exact': ok_both / n, 'minutes': (time.time() - t0) / 60}
        report['epochs'].append(e); print(json.dumps(e), file=sys.stderr)
        os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
        torch.save({'state': model.state_dict(), 'opt': opt.state_dict(), 'sched': sched.state_dict(), 'epoch': ep + 1, 'W': W, 'dim': a.dim, 'layers': a.layers, 'heads': a.heads, 'horizon': a.horizon, 'report': report}, ck_path)
    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
    if not a.embed: torch.save({'state': model.state_dict(), 'W': W, 'dim': a.dim, 'layers': a.layers, 'heads': a.heads, 'horizon': a.horizon}, a.out + '.pt')
    model.eval(); embs = []
    with torch.no_grad():
        for x, _, _, _, _ in prefetch(np.arange(N), 2048, False):
            with torch.autocast('cuda', dtype=torch.bfloat16, enabled=a.amp and dev == 'cuda'):
                hh, _, _, _, _ = model(x)
            embs.append(hh.float().cpu().numpy())
    E = np.concatenate(embs); np.save(a.out + '.emb.npy', E)
    with open(a.out + '.meta.jsonl', 'w') as fh:
        for gi, end in index: fh.write(json.dumps([P.ids[gi], int(end), 'b' if P.PW[P.off[gi] + end - 1, 64] == 0 else 'w']) + '\n')
    json.dump(report, open(a.out + '.report.json', 'w'), indent=1)
    print(f'TERMINÉ vecteurs {E.shape} → {a.out}.emb.npy', file=sys.stderr)

if __name__ == '__main__':
    main()
