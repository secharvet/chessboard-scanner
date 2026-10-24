#!/usr/bin/env python3
"""Page du POC « coach d'ouverture » : deux parties rejouées, fiche AVANT / APRÈS à chaque coup de l'élève, notes de lecture.
   python3 scripts/poc-ouverture-page.py reports/poc-ouverture-notes.json <sortie.html>"""
import json, html, sys, re
notes = json.load(open(sys.argv[1]))
out = sys.argv[2]
def esc(x): return html.escape(str(x))
def lichess(fen): return 'https://lichess.org/analysis/' + fen.replace(' ', '_')
def hl(t):
    t = esc(t)
    t = re.sub(r'(Ouverture : [^.]+\.)', r'<b>\1</b>', t)
    t = re.sub(r'(Son [A-Za-z…]+[a-h1-8x+#=O\-]* [^.]+\.)', r'<span class=i>\1</span>', t)
    t = re.sub(r'(Maintenant : [^.]+\.|Ton plan : [^.]+\.)', r'<span class=p>\1</span>', t)
    t = re.sub(r'(Il a quitté la théorie[^.]*\.|Tu as quitté la théorie[^.]*\.)', r'<span class=d>\1</span>', t)
    return t
sections = []
tot = {'coups': 0, 'ouverture': 0, 'intention': 0, 'ecart': 0, 'plan': 0, 'conseil_diff': 0}
for g in notes['parties']:
    d = json.load(open(g['json']))
    pgn = d['pgn'].split('\n\n')[-1].strip()
    rows = []
    for c in d['coups']:
        n = c['n']; note = g['notes'].get(str(n), '')
        verdict = g['verdicts'].get(str(n), '')
        tot['coups'] += 1
        if c['ouverture']: tot['ouverture'] += 1
        if 'Son ' in c['apres'] and 'Ouverture' in c['apres']: tot['intention'] += 1
        if 'quitté la théorie' in c['apres']: tot['ecart'] += 1
        if 'Maintenant :' in c['apres'] or 'Ton plan :' in c['apres']: tot['plan'] += 1
        rows.append(f"<tr class='{verdict}'><td class=mv><a href='{lichess(c['fen'])}' target=_blank>{n}</a><br><span class=n>{esc(' '.join(c['derniers']))}</span><br>joué {esc(c['joue'])}<br>perte {c['perte']}</td><td>{esc(c['avant'])}</td><td>{hl(c['apres'])}</td><td>{esc(note)}</td></tr>")
    sections.append(f"<h2>{esc(g['titre'])}</h2><p class=n>{esc(pgn)}</p><div class=tw><table><thead><tr><th>Coup</th><th>Avant (coach actuel)</th><th>Après (coach d'ouverture)</th><th>Lecture</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div>")
style = open('/tmp/claude-1000/-home-ubuntu-ruche/d5c15aa3-2d27-4c63-97f7-1047dd23cc38/scratchpad/recit-opera.html').read().split('<style>')[1].split('</style>')[0]
page = f"""<title>POC coach d'ouverture</title>
<style>{style}
td{{font-size:.88rem;vertical-align:top}} td:nth-child(2),td:nth-child(3){{min-width:30ch;max-width:52ch}} .mv{{white-space:nowrap;font-weight:bold}} .mv a{{color:inherit}}
.i{{background:var(--S);padding:0 2px}} .p{{background:var(--M);padding:0 2px}} .d{{background:var(--T);padding:0 2px}}
tr.bon td:nth-child(4){{border-left:4px solid #4a4}} tr.moyen td:nth-child(4){{border-left:4px solid #ca3}} tr.faux td:nth-child(4){{border-left:4px solid #c44}}
</style>
<h1>POC coach d'ouverture</h1>
<p>{esc(notes['intro'])}</p>
<div class=kpi><div><b>{tot['coups']}</b>coups de l'élève</div><div><b>{tot['ouverture']}</b>avec le coach d'ouverture</div><div><b>{tot['intention']}</b>sens du coup adverse donné</div><div><b>{tot['plan']}</b>plan nommé avec le coup</div><div><b>{tot['ecart']}</b>sorties de théorie expliquées</div></div>
<h2>Ce que le POC montre</h2><ul>{''.join(f'<li>{esc(x)}</li>' for x in notes['constats'])}</ul>
<h2>Ce qui ne va pas encore</h2><ul>{''.join(f'<li>{esc(x)}</li>' for x in notes['defauts'])}</ul>
{''.join(sections)}
<p class=n>Légende : <span class=i>sens du coup adverse</span> · <span class=p>plan et coup conseillé</span> · <span class=d>sortie de théorie</span>. Bord vert : lecture juste et utile ; orange : juste mais plat ou verbeux ; rouge : faux ou trompeur. Les positions s'ouvrent sur lichess.</p>
"""
open(out, 'w').write(page)
print('page écrite', out, tot)
