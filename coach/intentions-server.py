"""
Service local « intentions » (docs/PLANS-ET-CONCEPTS.md, §5 « du modèle à l'explication », §9 priorité 4).

Charge les modèles entraînés sur les plans humains (data/datasets/plan-<concept>-faits.pkl : arbres et régression
sur les faits ; plan-<concept>.pt : réseau échiquier + faits) et répond au coach, pour une position, la probabilité que
chaque camp entreprenne chaque plan, à son niveau. Le coach fournit les faits (moteur de règles, comptés par
« identifiant|couleur ») et l'Elo de chaque camp ; ici on ne fait que vectoriser et prédire. Aucune décision : le
modèle PROPOSE, le coach VÉRIFIE avec le moteur, le code EXPLIQUE.

  ~/laya-venv/bin/python coach/intentions-server.py [--port 8001] [--models data/datasets]

  POST /intentions  {"fen": "...", "facts": {"ID|w": n, ...}, "elo": {"w": 1500, "b": 1500}}
  → {"w": {"rupture": {"arbres": 0.31, "reseau": 0.28}, ...}, "b": {...}, "concepts": [...]}
  GET  /health → {"ok": true, "concepts": [...]}

Écoute seulement sur 127.0.0.1 : jamais exposé.
"""

import argparse
import glob
import json
import pickle
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import numpy as np
import torch

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'scripts'))
from train_plans_lib import PlanNet, board_planes, facts_vector  # noqa: E402

torch.set_num_threads(1)
MODELS = {}


def load_models(folder, suffix=''):
    for f in sorted(glob.glob(f'{folder}/plan-*{suffix}-faits.pkl')):
        concept = Path(f).name[len('plan-'):-len(f'{suffix}-faits.pkl')]
        if '-' in concept:  # autres variantes (-large, -v3…) : pas celles demandées
            continue
        m = pickle.load(open(f, 'rb'))
        entry = {'arbres': m['arbres'], 'scaler': m['scaler'], 'keys': m['keys'], 'elo': bool(m.get('elo_feature')), 'net': None}
        pt = Path(f'{folder}/plan-{concept}{suffix}.pt')
        if pt.exists():
            ck = torch.load(pt, weights_only=False)
            n_facts = 2 * len(ck['keys']) + (1 if ck.get('elo_feature') else 0)
            large = bool(ck.get('large'))
            net = PlanNet(n_facts, ch=96 if large else 48, hidden=256 if large else 128)
            net.load_state_dict(ck['cnn+f'])
            net.eval()
            entry['net'] = net
            entry['mean'] = np.array(ck['mean'], dtype=np.float32)
            entry['scale'] = np.array(ck['scale'], dtype=np.float32)
        MODELS[concept] = entry
    return list(MODELS)


def predict(fen, facts, elo):
    out = {'w': {}, 'b': {}}
    for side in ('w', 'b'):
        e = (elo or {}).get(side)
        planes = None
        for concept, m in MODELS.items():
            v = facts_vector(facts, m['keys'], side, e if m['elo'] else None)
            if not m['elo']:
                v = v[:-1]
            p_arbres = float(m['arbres'].predict_proba(v[None])[0, 1])
            res = {'arbres': round(p_arbres, 4)}
            if m['net'] is not None:
                if planes is None:
                    planes = torch.from_numpy(board_planes(fen, side)[None].astype(np.float32))
                x = torch.from_numpy(((v - m['mean']) / m['scale']).astype(np.float32)[None])
                with torch.no_grad():
                    res['reseau'] = round(float(torch.sigmoid(m['net'](planes, x))[0]), 4)
            out[side][concept] = res
    out['concepts'] = list(MODELS)
    return out


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):  # silencieux
        pass

    def _send(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/health':
            return self._send(200, {'ok': True, 'concepts': list(MODELS)})
        return self._send(404, {'error': 'inconnu'})

    def do_POST(self):
        if self.path != '/intentions':
            return self._send(404, {'error': 'inconnu'})
        try:
            n = int(self.headers.get('Content-Length', '0'))
            req = json.loads(self.rfile.read(n) or b'{}')
            return self._send(200, predict(req['fen'], req.get('facts') or {}, req.get('elo')))
        except Exception as exc:  # noqa: BLE001 — on renvoie l'erreur au coach, qui se passe des intentions
            return self._send(400, {'error': str(exc)})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=8001)
    ap.add_argument('--models', default='data/datasets')
    ap.add_argument('--suffix', default='', help='suffixe des fichiers de modèles (ex. -v4)')
    a = ap.parse_args()
    concepts = load_models(a.models, a.suffix)
    print(f'[intentions] {len(concepts)} concepts : {", ".join(concepts)} — http://127.0.0.1:{a.port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', a.port), Handler).serve_forever()


if __name__ == '__main__':
    main()
