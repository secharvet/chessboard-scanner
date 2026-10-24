#!/usr/bin/env python3
"""Thèmes par lexique (anglais + français), premier étalon rapide avant Fable. Sortie : themes-lexique.jsonl {id, ply, themes}."""
import json, re, sys, collections
DIR = sys.argv[1] if len(sys.argv) > 1 else 'data/reference/annotes'
LEX = {
 'attaque_roi': r"\b(attack(ing|s)? (on|against) the king|king ?side attack|mating|mate\b|checkmate|sacrifice[sd]? on|open(ing)? (the )?(h|g)-?file|attaque (du|sur le|contre le) roi|mat\b|attaque à l'aile roi)",
 'defense_roi': r"\b(king safety|defen[cs]e of the king|protect(s|ing)? (the|his|my) king|shelter|escape square|luft|sécurité du roi|défen(dre|se) (le|du) roi|abri)",
 'colonne_ouverte': r"\b(open file|half-open file|semi-open file|the [a-h]-file|seventh rank|7th rank|rook on the|rooks? to the|doubl(e|ing) rooks|colonne (ouverte|semi-ouverte|[a-h])|septième rangée|long diagonal|grande diagonale)",
 'structure_pions': r"\b(pawn structure|isolated|isolani|doubled pawns?|backward pawn|passed pawn|pawn majority|pawn chain|pawn islands?|hanging pawns|weak pawns?|structure de pions|pion (isolé|doublé|arriéré|passé)|majorité|chaîne de pions)",
 'case_faible_avant_poste': r"\b(weak square|outpost|hole|strong square|weakness on|weak(ness)? of the [a-h][1-8] square|case faible|avant-poste|trou)",
 'echange_pieces': r"\b(exchange|trade|swap|bad bishop|good bishop|bishop pair|two bishops|knight (vs|versus|against) bishop|simplif|échange|mauvais fou|bon fou|paire de fous|simplifi)",
 'developpement': r"\b(develop|tempo|tempi|castl(e|es|ing) (early|quickly|first)|lead in development|undeveloped|développ|roque(r)? (vite|tôt)|temps)",
 'centre_espace': r"\b(cent(er|re)|space advantage|cramped|more space|central|espace|centre)",
 'levier_rupture': r"\b(pawn break|break(ing)? (with|through|open)|lever|the (push|advance) [a-h][1-8]|opening (up )?the (position|game|lines)|rupture|levier|poussée)",
 'prophylaxie': r"\b(prophyla|prevent(s|ing)?|stop(s|ping)? (the|black'?s|white'?s)|restrain|restrict|takes? away|deny|empêch|prévenir|interdi)",
 'manoeuvre': r"\b(man(o)?euvr|reroute|re-?route|regroup|transfer|relocat|bring(s|ing)? the (knight|bishop|rook|queen) to|redeploy|manœuvr|regroup|transf)",
 'initiative_pression': r"\b(initiative|pressure|activ(e|ity)|forcing|keeps? the pressure|pression|initiative|activité)",
 'tactique': r"\b(fork|pin(ned|ning)?|skewer|discovered|double attack|combination|tactic|zwischenzug|in-between|threat(en|s|ening)? (to )?(win|mate)|fourchette|clou|découverte|combinaison|tactique)",
 'finale': r"\b(endgame|ending|king activity|active king|opposition|zugzwang|finale|roi actif)",
 'materiel': r"\b(wins? (a|the|two) (pawn|piece|exchange)|material|a pawn (up|down)|pawn up|compensation|matériel|gagne (un|le) pion|pion de plus)",
 'blocus': r"\b(blockad|block(s|ed|ing)? the|bloqu|blocus)",
 'aile_dame': r"\b(queen ?side|minority attack|aile dame|attaque de minorité)",
}
RX = {k: re.compile(v, re.I) for k, v in LEX.items()}
rows = [json.loads(l) for l in open(f'{DIR}/coups.jsonl')]
n = 0; cnt = collections.Counter(); out = open(f'{DIR}/themes-lexique.jsonl', 'w')
for r in rows:
    for c in r['commentaires']:
        if c['ply'] < 15: continue
        th = [k for k, rx in RX.items() if rx.search(c['text'])]
        out.write(json.dumps({'id': r['id'], 'ply': c['ply'], 'themes': th}) + '\n'); n += 1
        for k in th: cnt[k] += 1
        if not th: cnt['(aucun)'] += 1
print(n, 'commentaires ;', dict(cnt.most_common()))
