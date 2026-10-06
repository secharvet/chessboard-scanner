#!/usr/bin/env python3
"""Jeu de données des arbres (6 octobre 2026).

Lit les grains bicolores (scripts/grains.mjs) et fabrique des fenêtres de W demi-coups, chacune avec :
  - les traits RELATIONNELS de chaque nœud, relatifs au camp qui joue (moi / lui), sans case exacte ;
  - l'AVENIR : les faits produits dans les F demi-coups suivants (par qui), la pression sur les rois, le matériel.
Le modèle apprend à prédire l'avenir depuis la fenêtre : deux chemins différents vers le même avenir se ressemblent.

  python3 scripts/arbres/dataset.py data/grains/*.jsonl --out data/arbres/windows --window 16 --future 10 --start 10
Sortie : <out>.npz (tokens int16 [N, W, K], futures uint8 [N, T], meta) et <out>.vocab.json
"""
import argparse, json, glob, sys, os
import numpy as np

K = 40  # traits par nœud (identifiants dans le vocabulaire, 0 = vide)
# Faits qui clignotent à chaque coup (« possible », « disponible », activité) : ils ne décrivent pas ce que le coup fait.
VOLATILE = ('DECOUVERTE_POSSIBLE', 'LEVIER_DISPONIBLE', 'ROUTE_CAVALIER', 'AVANT_POSTE_POSSIBLE', 'CASE_ENTREE', 'ACTIVITE', 'MOYENNE', 'CONTROLE_CENTRE', 'CONTROLE_COLONNE', 'PRIORITY', 'NOMBRE_ILOTS_BLANC', 'NOMBRE_ILOTS_NOIR')
def stable(tag): return not tag.split(':')[0] in VOLATILE

def rel(tag, me):
    """':w'/':b' → ':me'/':him' relatif au camp `me`."""
    if tag.endswith(':w') or tag.endswith(':b'):
        return tag[:-2] + (':me' if tag[-1] == me else ':him')
    return tag

def node_feats(n, me):
    """Traits d'un nœud, vus du camp `me` (le joueur dont on décrit la fenêtre). Sans case exacte."""
    who = 'me' if n['s'] == me else 'him'
    f = [f'side:{who}', f'pc:{who}:{n["pc"]}']
    if n.get('cap'): f.append(f'cap:{who}:{n["cap"]}')
    if n.get('chk'): f.append(f'chk:{who}')
    if n.get('cas'): f.append(f'cas:{who}:{n["cas"]}')
    # zone d'arrivée relative aux rois : vue du joueur qui joue ; si c'est lui, on retourne la zone pour la voir de moi
    zt = n.get('zt', 1)
    if who == 'him':
        wing, half = zt % 3, zt // 3
        zt = (2 - wing) + 3 * (1 - half)  # son « côté de mon roi » est mon « côté de son roi », son camp est mon camp adverse
    f.append(f'zt:{who}:{zt}')
    for t in n.get('tg', []): f.append(f'tg:{who}:{t}')
    for e in n.get('ef', []): f.append(f'ef:{who}:{e}')
    for a in n.get('at', []): f.append(f'at:{who}:{a}')
    for p in n.get('pl', []): f.append(f'pl:{rel(p, me)}')
    for a in n.get('fa', []):
        if stable(a): f.append(f'fa:{rel(a, me)}')
    for a in n.get('fl', []):
        if stable(a): f.append(f'fl:{rel(a, me)}')
    dk = n.get('dk', 0)
    if dk >= 2: f.append(f'dk:{who}:+')
    elif dk <= -2: f.append(f'dk:{who}:-')
    kz = n.get('kz', 0)
    f.append(f'kz:{who}:{min(kz, 6)}')
    dz = n.get('dz', [0] * 6)
    for j, v in enumerate(dz):
        if v >= 2: f.append(f'dz:{who}:{j}:+')
        elif v <= -2: f.append(f'dz:{who}:{j}:-')
    return f

def future_feats(nodes, me):
    """Ce que les F demi-coups suivants produisent, vu de `me`."""
    f = set()
    cap = {'me': 0, 'him': 0}
    for n in nodes:
        who = 'me' if n['s'] == me else 'him'
        for a in n.get('fa', []):
            if stable(a): f.add(f'fa:{rel(a, me)}')
        for p in n.get('pl', []): f.add(f'pl:{rel(p, me)}')
        for a in n.get('at', []):
            if a in ('levier', 'echange', 'roque', 'manoeuvre', 'espace', 'doublement', 'septieme'): f.add(f'at:{who}:{a}')
        for t in n.get('tg', []): f.add(f'tg:{who}:{t}')
        if n.get('cas'): f.add(f'cas:{who}')
        if n.get('chk'): f.add(f'chk:{who}')
        if n.get('cap'): cap[who] += {'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9}.get(n['cap'], 0)
        if n.get('dk', 0) >= 2: f.add(f'dk:{who}:+')
    if cap['me'] - cap['him'] >= 2: f.add('mat:me+')
    if cap['him'] - cap['me'] >= 2: f.add('mat:him+')
    return f

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('inputs', nargs='+')
    ap.add_argument('--out', required=True)
    ap.add_argument('--window', type=int, default=16)
    ap.add_argument('--future', type=int, default=10)
    ap.add_argument('--start', type=int, default=10)
    ap.add_argument('--stride', type=int, default=2)
    ap.add_argument('--max-games', type=int, default=0)
    ap.add_argument('--min-count', type=int, default=20, help='un trait vu moins de N fois est ignoré')
    ap.add_argument('--max-end', type=int, default=0, help='dernier demi-coup admis pour la fin d\'une fenêtre (0 = pas de borne)')
    ap.add_argument('--min-material', type=int, default=0, help='matériel minimal (pions) de chaque camp à la fin de la fenêtre : 14 écarte les finales')
    a = ap.parse_args()
    files = [f for pat in a.inputs for f in sorted(glob.glob(pat))]
    W, F = a.window, a.future
    # Passe 1 : comptes du vocabulaire (traits des nœuds et de l'avenir)
    cnt_x, cnt_y = {}, {}
    games = 0
    def iter_games():
        for fn in files:
            with open(fn) as fh:
                for line in fh:
                    try: yield json.loads(line)
                    except json.JSONDecodeError: continue  # dernière ligne d'un lot encore en cours d'écriture
    for g in iter_games():
        games += 1
        if a.max_games and games > a.max_games: break
        for me in ('w', 'b'):
            for n in g['nodes']:
                for t in node_feats(n, me): cnt_x[t] = cnt_x.get(t, 0) + 1
        for me in ('w', 'b'):
            for t in future_feats(g['nodes'][:F], me): cnt_y[t] = cnt_y.get(t, 0) + 1
    vocab_x = ['<pad>'] + sorted(t for t, c in cnt_x.items() if c >= a.min_count)
    vocab_y = sorted(t for t, c in cnt_y.items() if c >= a.min_count)
    ix = {t: i for i, t in enumerate(vocab_x)}; iy = {t: i for i, t in enumerate(vocab_y)}
    print(f'{games} parties ; vocabulaire : {len(vocab_x)} traits de nœud, {len(vocab_y)} traits d\'avenir', file=sys.stderr)
    # Passe 2 : fenêtres
    X, Y, META = [], [], []
    games = 0
    for g in iter_games():
        games += 1
        if a.max_games and games > a.max_games: break
        nodes = g['nodes']; n = len(nodes)
        # matériel restant par camp après chaque demi-coup, estimé par les prises (39 au départ)
        VAL = {'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9}
        mat = {'w': 39, 'b': 39}; mat_after = []
        for nd in nodes:
            if nd.get('cap'): mat['b' if nd['s'] == 'w' else 'w'] -= VAL.get(nd['cap'], 0)
            mat_after.append(min(mat['w'], mat['b']))
        for end in range(a.start + W, n - F + 1, a.stride):
            if a.max_end and end > a.max_end: break
            if a.min_material and mat_after[end - 1] < a.min_material: break
            win = nodes[end - W:end]; fut = nodes[end:end + F]
            me = win[-1]['s']  # la fenêtre est vue du camp qui vient de jouer
            toks = np.zeros((W, K), dtype=np.int16)
            for j, nd in enumerate(win):
                ids = [ix[t] for t in node_feats(nd, me) if t in ix][:K]
                toks[j, :len(ids)] = ids
            y = np.zeros(len(vocab_y), dtype=np.uint8)
            for t in future_feats(fut, me):
                if t in iy: y[iy[t]] = 1
            X.append(toks); Y.append(y)
            META.append((g.get('id', ''), end, me, g.get('we', 0), g.get('be', 0), g.get('eco', '') or ''))
        if games % 5000 == 0: print(f'{games} parties, {len(X)} fenêtres', file=sys.stderr)
    X = np.stack(X); Y = np.stack(Y)
    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
    np.savez_compressed(a.out + '.npz', X=X, Y=Y)
    with open(a.out + '.meta.jsonl', 'w') as fh:
        for m in META: fh.write(json.dumps(m) + '\n')
    json.dump({'x': vocab_x, 'y': vocab_y, 'window': W, 'future': F, 'K': K}, open(a.out + '.vocab.json', 'w'), ensure_ascii=False)
    print(f'TERMINÉ {X.shape[0]} fenêtres, X {X.shape}, Y {Y.shape} → {a.out}.npz', file=sys.stderr)

if __name__ == '__main__':
    main()
