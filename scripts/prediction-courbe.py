"""
Courbe de prédiction le long de la partie (1er octobre 2026, demande de l'auteur) : sur des parties JAMAIS VUES à
l'entraînement (découpage par partie, 10 % de test), les modèles v4 prédisent à chaque position le plan que le camp
au trait va entreprendre ; on compare à ce que la partie a réellement fait dans les 24 demi-coups suivants.

Deux chiffres, par distance à la réalisation : le RAPPEL (quand un plan se réalise d demi-coups plus tard, le modèle
l'annonçait-il déjà ?) et la PRÉCISION (quand le modèle annonce un plan, se réalise-t-il ?). Loin de l'engagement,
le modèle a le droit de se tromper ; près, il devrait voir.

  ~/plans-venv/bin/python scripts/prediction-courbe.py [--dataset data/datasets/humains-v4-juge.jsonl]
        [--models data/datasets] [--suffix -v4] [--out reports/prediction-courbe.json] [--md reports/prediction-courbe.md]
"""

import argparse
import importlib.util
import json
import sys
import zlib
from pathlib import Path

import numpy as np
import torch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from train_plans_lib import board_planes, facts_vector  # noqa: E402

spec = importlib.util.spec_from_file_location('intentions_server', ROOT / 'coach' / 'intentions-server.py')
srv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(srv)

BUCKETS = [(0, 1, '0-1'), (2, 3, '2-3'), (4, 5, '4-5'), (6, 7, '6-7'), (8, 11, '8-11'), (12, 23, '12-23')]
ELO = [(0, 1200, '< 1200'), (1200, 1600, '1200-1600'), (1600, 2000, '1600-2000'), (2000, 9999, '2000 +')]
THRESH = 0.5
MARGIN = 0.1


def bucket(d):
    for lo, hi, name in BUCKETS:
        if lo <= d <= hi:
            return name
    return None


def elo_bracket(e):
    for lo, hi, name in ELO:
        if e is not None and lo <= e < hi:
            return name
    return 'inconnu'


def auc(y, p):
    y = np.asarray(y)
    p = np.asarray(p)
    if y.sum() == 0 or y.sum() == len(y):
        return None
    order = np.argsort(p)
    ranks = np.empty(len(p), dtype=np.float64)
    ranks[order] = np.arange(1, len(p) + 1)
    npos = y.sum()
    return float((ranks[y == 1].sum() - npos * (npos + 1) / 2) / (npos * (len(y) - npos)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dataset', default='data/datasets/humains-v4-juge.jsonl')
    ap.add_argument('--models', default='data/datasets')
    ap.add_argument('--suffix', default='-v4')
    ap.add_argument('--out', default='reports/prediction-courbe.json')
    ap.add_argument('--md', default='reports/prediction-courbe.md')
    ap.add_argument('--max', type=int, default=0)
    a = ap.parse_args()

    concepts = srv.load_models(a.models, a.suffix)
    print(f'[courbe] modèles : {", ".join(concepts)}', flush=True)
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    for m in srv.MODELS.values():
        if m['net'] is not None:
            m['net'].to(device)

    # 1. Lecture du jeu de test (parties jamais vues : même découpage que train-plans.py).
    recs = []
    n_all = 0
    with open(a.dataset) as fh:
        for line in fh:
            n_all += 1
            if n_all % 100000 == 0:
                print(f'[courbe] {n_all} lignes lues, {len(recs)} de test', flush=True)
            # Filtre rapide avant de décoder : l'identifiant de partie est en tête de ligne.
            gid = line[9:line.index('"', 9)] if line.startswith('{"game":"') else None
            if gid is not None and zlib.crc32(gid.encode()) % 10 != 0:
                continue
            r = json.loads(line)
            if zlib.crc32(str(r['game']).encode()) % 10 != 0:
                continue
            recs.append(r)
            if a.max and len(recs) >= a.max:
                break
    print(f'[courbe] {len(recs)} positions de test sur {n_all}', flush=True)

    # 2. Prédictions, par concept, en lots.
    sides = [r['fen'].split()[1] for r in recs]
    elos = [(r.get('elo') or {}).get(s) for r, s in zip(recs, sides)]
    planes = None
    probs = {}  # concept -> {'arbres': np.array, 'reseau': np.array}
    for c in concepts:
        m = srv.MODELS[c]
        X = np.stack([facts_vector(r['facts'], m['keys'], s, e if m['elo'] else None) for r, s, e in zip(recs, sides, elos)])
        if not m['elo']:
            X = X[:, :-1]
        pa = m['arbres'].predict_proba(X)[:, 1].astype(np.float32)
        out = {'arbres': pa}
        if m['net'] is not None:
            if planes is None:
                planes = np.stack([board_planes(r['fen'], s) for r, s in zip(recs, sides)])
                print('[courbe] échiquiers codés', flush=True)
            Xs = ((X - m['mean']) / m['scale']).astype(np.float32)
            pr = np.zeros(len(recs), dtype=np.float32)
            with torch.no_grad():
                for i in range(0, len(recs), 4096):
                    b = torch.from_numpy(planes[i:i + 4096].astype(np.float32)).to(device)
                    f = torch.from_numpy(Xs[i:i + 4096]).to(device)
                    pr[i:i + 4096] = torch.sigmoid(m['net'](b, f)).cpu().numpy()
            out['reseau'] = pr
        probs[c] = out
        print(f'[courbe] {c} prédit', flush=True)

    # 3. Vérité : plan réalisé par le camp au trait dans les 24 demi-coups (suite calme), distance = demi-coup d'apparition.
    truth = []  # par position : {concept: appear}
    for r, s in zip(recs, sides):
        t = {}
        for c in concepts:
            tr = (r.get('traj') or {}).get(f'{c}_{s}')
            if tr and tr.get('quiet') and tr.get('appear') is not None:
                t[c] = int(tr['appear'])
        truth.append(t)

    results = {'n_test': len(recs), 'n_total': n_all, 'models': {}}
    for kind in ('arbres', 'reseau'):
        if any(kind not in probs[c] for c in concepts):
            continue
        P = np.stack([probs[c][kind] for c in concepts], axis=1)  # n × C
        # Rappel par distance (par concept et global) : p_c ≥ seuil quand le plan c se réalise à distance d.
        recall = {name: {'n': 0, 'hit': 0, 'psum': 0.0} for _, _, name in BUCKETS}
        recall_c = {c: {name: {'n': 0, 'hit': 0} for _, _, name in BUCKETS} for c in concepts}
        for i, t in enumerate(truth):
            for c, d in t.items():
                b = bucket(d)
                if b is None:
                    continue
                p = float(P[i, concepts.index(c)])
                recall[b]['n'] += 1
                recall[b]['psum'] += p
                recall_c[c][b]['n'] += 1
                if p >= THRESH:
                    recall[b]['hit'] += 1
                    recall_c[c][b]['hit'] += 1
        # Précision de l'annonce (règle de production : meilleur concept, p ≥ 0,5, marge 0,1 sur le second).
        order = np.argsort(-P, axis=1)
        top = order[:, 0]
        second = order[:, 1] if P.shape[1] > 1 else top
        ptop = P[np.arange(len(P)), top]
        psec = P[np.arange(len(P)), second]
        announced = (ptop >= THRESH) & (ptop - psec >= MARGIN)
        prec = {'n': 0, 'realised': 0, 'by_distance': {name: 0 for _, _, name in BUCKETS}, 'by_elo': {}}
        prec_c = {c: {'n': 0, 'realised': 0} for c in concepts}
        for i in np.where(announced)[0]:
            c = concepts[top[i]]
            prec['n'] += 1
            prec_c[c]['n'] += 1
            eb = elo_bracket(elos[i])
            prec['by_elo'].setdefault(eb, {'n': 0, 'realised': 0})
            prec['by_elo'][eb]['n'] += 1
            if c in truth[i]:
                prec['realised'] += 1
                prec_c[c]['realised'] += 1
                prec['by_elo'][eb]['realised'] += 1
                b = bucket(truth[i][c])
                if b:
                    prec['by_distance'][b] += 1
        # Repères : taux de base (part des positions où le concept se réalise), AUC sur y (réalisé tôt et bien joué).
        base = {c: float(np.mean([c in t for t in truth])) for c in concepts}
        aucs = {}
        for j, c in enumerate(concepts):
            ys, ps = [], []
            for i, r in enumerate(recs):
                v = (r.get('y') or {}).get(f'{c}_{sides[i]}')
                if v in (0, 1):
                    ys.append(v)
                    ps.append(P[i, j])
            aucs[c] = auc(ys, ps)
        covered = float(np.mean([len(t) > 0 for t in truth]))
        # Seuil d'annonce par concept (1er octobre, étape 3) : précision et rappel de « p_c ≥ t » pour t de 0,50 à 0,95,
        # et le premier seuil qui atteint 60 % de précision (vérité : le plan se réalise, suite calme, 24 demi-coups).
        sweep = {}
        for j, c in enumerate(concepts):
            yc = np.array([c in t for t in truth])
            rows = []
            for t in np.arange(0.5, 0.96, 0.05):
                ann = P[:, j] >= t
                n = int(ann.sum())
                prec = float((yc & ann).sum() / n) if n else None
                rec = float((yc & ann).sum() / yc.sum()) if yc.sum() else None
                rows.append({'t': round(float(t), 2), 'annonces': n, 'taux': float(ann.mean()), 'precision': prec, 'rappel': rec})
            first60 = next((r for r in rows if r['precision'] is not None and r['precision'] >= 0.6), None)
            sweep[c] = {'rows': rows, 'seuil_60': first60}
        results['models'][kind] = {
            'recall_by_distance': {k: {'n': v['n'], 'recall': (v['hit'] / v['n']) if v['n'] else None, 'p_mean': (v['psum'] / v['n']) if v['n'] else None} for k, v in recall.items()},
            'recall_by_concept': {c: {k: {'n': v['n'], 'recall': (v['hit'] / v['n']) if v['n'] else None} for k, v in d.items()} for c, d in recall_c.items()},
            'announced': int(announced.sum()), 'announced_rate': float(announced.mean()),
            'precision': (prec['realised'] / prec['n']) if prec['n'] else None,
            'precision_by_concept': {c: {'n': v['n'], 'precision': (v['realised'] / v['n']) if v['n'] else None} for c, v in prec_c.items()},
            'precision_by_elo': {k: {'n': v['n'], 'precision': (v['realised'] / v['n']) if v['n'] else None} for k, v in prec['by_elo'].items()},
            'realised_by_distance': prec['by_distance'],
            'base_rate': base, 'auc_test': aucs, 'coverage_any_plan': covered, 'seuils': sweep,
        }
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    json.dump(results, open(a.out, 'w'), indent=1)

    # 4. Rapport lisible.
    pct = lambda x: '—' if x is None else f'{100 * x:.1f} %'
    md = [f'# Courbe de prédiction le long de la partie — {len(recs)} positions de test (parties jamais vues) sur {n_all}', '',
          'Modèles v4 (plans réalisés et bien joués, Elo en entrée), appliqués au camp au trait. Vérité : le plan se réalise',
          '(suite calme) dans les 24 demi-coups suivants ; distance = demi-coup d\'apparition (0 = le coup qui vient).', '',
          f'Règle d\'annonce (production) : meilleur concept, probabilité ≥ {THRESH}, marge ≥ {MARGIN} sur le second.', '']
    for kind, R in results['models'].items():
        md += [f'## {kind}', '', f'- Positions où au moins un plan se réalise ensuite : {pct(R["coverage_any_plan"])}.',
               f'- Le modèle annonce un plan sur {pct(R["announced_rate"])} des positions ({R["announced"]}) ; **précision : {pct(R["precision"])}** '
               f'(part des annonces qui se réalisent dans les 24 demi-coups).', '',
               '### Rappel selon la distance à la réalisation (le plan se réalise à d demi-coups : le modèle l\'annonçait-il ?)', '',
               '| Distance (demi-coups) | Plans réalisés | Annoncés (p ≥ 0,5) | Probabilité moyenne |', '|---|---|---|---|']
        for k, v in R['recall_by_distance'].items():
            md.append(f'| {k} | {v["n"]} | **{pct(v["recall"])}** | {v["p_mean"]:.2f} |' if v['n'] else f'| {k} | 0 | — | — |')
        md += ['', '### Par concept', '', '| Concept | Taux de base | AUC (test) | Annonces | Précision | Rappel 0-3 | Rappel 4-7 | Rappel 8-23 |', '|---|---|---|---|---|---|---|---|']
        for c in concepts:
            rc = R['recall_by_concept'][c]
            def agg(names):
                n = sum(rc[x]['n'] for x in names)
                h = sum((rc[x]['recall'] or 0) * rc[x]['n'] for x in names)
                return (h / n) if n else None
            pc = R['precision_by_concept'][c]
            md.append(f'| {c} | {pct(R["base_rate"][c])} | {R["auc_test"][c]:.3f} | {pc["n"]} | {pct(pc["precision"])} | {pct(agg(["0-1", "2-3"]))} | {pct(agg(["4-5", "6-7"]))} | {pct(agg(["8-11", "12-23"]))} |'
                      if R['auc_test'][c] is not None else f'| {c} | {pct(R["base_rate"][c])} | — | {pc["n"]} | {pct(pc["precision"])} | | | |')
        md += ['', '### Précision des annonces par niveau du joueur', '', '| Elo | Annonces | Précision |', '|---|---|---|']
        for k, v in sorted(R['precision_by_elo'].items()):
            md.append(f'| {k} | {v["n"]} | {pct(v["precision"])} |')
        md += ['', '### Seuil d\'annonce par concept (précision cible 60 %)', '', '| Concept | Taux de base | Seuil pour 60 % | Annonces à ce seuil (part des positions) | Rappel à ce seuil | Précision à 0,5 | Précision à 0,9 |', '|---|---|---|---|---|---|---|']
        for c in concepts:
            sw = R['seuils'][c]
            f = sw['seuil_60']
            r50 = sw['rows'][0]
            r90 = next((r for r in sw['rows'] if abs(r['t'] - 0.9) < 1e-6), None)
            md.append(f"| {c} | {pct(R['base_rate'][c])} | {f['t'] if f else 'jamais'} | {(str(f['annonces']) + ' (' + pct(f['taux']) + ')') if f else '—'} | {pct(f['rappel']) if f else '—'} | {pct(r50['precision'])} | {pct(r90['precision']) if r90 else '—'} |")
        md += ['', '### Quand une annonce se réalise, à quelle distance ?', '', '| Distance | Annonces réalisées |', '|---|---|']
        for k, v in R['realised_by_distance'].items():
            md.append(f'| {k} | {v} |')
        md.append('')
    Path(a.md).write_text('\n'.join(md))
    print('\n'.join(md))
    print('TERMINÉ', flush=True)


if __name__ == '__main__':
    main()
