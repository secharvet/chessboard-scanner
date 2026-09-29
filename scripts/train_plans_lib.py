"""Briques partagées par train-plans.py et score-counterfactuals.py : codage de l'échiquier, des faits, réseau."""

import numpy as np
from torch import nn
import torch

PIECES = 'PNBRQKpnbrqk'


def board_planes(fen, side):
    """18 plans 8x8 vus du camp `side` : 6 pièces à moi, 6 à l'adversaire, trait, 4 roques (moi, lui), 1 constant.
    Pour les Noirs, l'échiquier est retourné : « ma » première rangée est en bas."""
    parts = fen.split()
    x = np.zeros((18, 8, 8), dtype=np.float32)
    for r, row in enumerate(parts[0].split('/')):
        f = 0
        for ch in row:
            if ch.isdigit():
                f += int(ch)
                continue
            rank = 7 - r
            idx = PIECES.index(ch)
            white = idx < 6
            mine = white == (side == 'w')
            rr = rank if side == 'w' else 7 - rank
            x[(idx % 6) + (0 if mine else 6), rr, f] = 1
            f += 1
    x[12] = 1.0 if parts[1] == side else 0.0
    c = parts[2]
    own, opp = ('KQ', 'kq') if side == 'w' else ('kq', 'KQ')
    for i, ch in enumerate(own + opp):
        x[13 + i] = 1.0 if ch in c else 0.0
    x[17] = 1.0
    return x


def facts_vector(facts, keys, side, elo=None):
    """Faits du moteur de règles comptés par identifiant : [à moi ou sans camp | à l'adversaire], puis le niveau
    du joueur qui agit (Elo / 1000, 1,5 si inconnu) : le plan naturel dépend du niveau (§2, grille mesurée)."""
    kidx = {k: i for i, k in enumerate(keys)}
    v = np.zeros(2 * len(keys) + 1, dtype=np.float32)
    for k, n in facts.items():
        fid, col = k.split('|')
        if fid not in kidx:
            continue
        off = 0 if col in (side, '-') else len(keys)
        v[kidx[fid] + off] += n
    v[-1] = (elo / 1000.0) if elo else 1.5
    return v


class PlanNet(nn.Module):
    """Petit réseau : 3 convolutions 3x3, puis une tête ; les faits (optionnels) rejoignent la tête."""

    def __init__(self, n_facts=0, ch=48):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(18, ch, 3, padding=1), nn.ReLU(),
            nn.Conv2d(ch, ch, 3, padding=1), nn.ReLU(),
            nn.Conv2d(ch, ch, 3, padding=1), nn.ReLU(),
        )
        self.n_facts = n_facts
        self.head = nn.Sequential(nn.Linear(ch * 64 + n_facts, 128), nn.ReLU(), nn.Dropout(0.2), nn.Linear(128, 1))

    def forward(self, board, facts=None):
        z = self.conv(board).flatten(1)
        if self.n_facts:
            z = torch.cat([z, facts], 1)
        return self.head(z).squeeze(1)
