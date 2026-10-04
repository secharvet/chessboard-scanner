#!/usr/bin/env python3
"""Page HTML des désaccords de Fable sur une série de planches.
   planches-fable-page.py <résultats.json> <sortie.html> <titre> <url de la page des planches> <phrase d'intro>"""
import json, html, sys
res, out, titre, url, intro = sys.argv[1:6]
rows = json.load(open(res))
att = lambda r: 'oui' if r['programme'] == 'positif' else 'non'
valid = [r for r in rows if r['fable'] in ('oui', 'non', 'pas sûr')]
dis = [r for r in valid if r['fable'] != att(r)]
by = {}
for r in valid: b = by.setdefault(r['concept'], [0, 0, 0]); b[0] += 1; b[1] += r['fable'] == att(r); b[2] += r['fable'] == 'pas sûr'
NOM = {'tour_colonne': 'Tour sur colonne ouverte', 'tour_colonne_semi_ouverte': 'Tour sur colonne semi-ouverte', 'cavalier_avant_poste': 'Cavalier sur avant-poste', 'blocage': 'Blocage', 'rupture': 'Rupture', 'affaiblir': 'Affaiblir', 'dominer': 'Dominer une couleur'}
css = f'''<title>{html.escape(titre)}</title>
<style>
:root{{--bg:#f7f5ef;--fg:#1e1c18;--mut:#6b665c;--acc:#8a3b12;--card:#fffdf8;--line:#e2ddd0;--ok:#2f6b3a;--ko:#9a2a1f}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#17160f;--fg:#ece7da;--mut:#a39d8f;--acc:#e0a070;--card:#201e16;--line:#3a3729;--ok:#8fd19a;--ko:#f0917f;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#17160f;--fg:#ece7da;--mut:#a39d8f;--acc:#e0a070;--card:#201e16;--line:#3a3729;--ok:#8fd19a;--ko:#f0917f;color-scheme:dark}}
body{{background:var(--bg);color:var(--fg);font:16px/1.5 Georgia,"Source Serif 4",serif;margin:0;padding-block:24px;padding-inline:16px;max-width:880px;margin-inline:auto}}
h1{{font-size:1.6rem;margin:0 0 4px;text-wrap:balance}}h2{{font-size:1.15rem;margin:28px 0 8px;color:var(--acc)}}
p.lead{{color:var(--mut);margin:0 0 18px}}
table{{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-family:"IBM Plex Sans",system-ui,sans-serif;font-size:.95rem}}
th,td{{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left}}th{{color:var(--mut);font-weight:600}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 16px;margin:10px 0}}
.card h3{{margin:0 0 6px;font-size:1rem;font-family:"IBM Plex Sans",system-ui,sans-serif}}
.tag{{display:inline-block;padding:1px 8px;border-radius:999px;font-size:.8rem;font-family:system-ui,sans-serif;margin-right:6px}}
.p{{background:color-mix(in srgb,var(--acc) 15%,transparent)}}.f-oui{{color:var(--ok);font-weight:600}}.f-non{{color:var(--ko);font-weight:600}}.f-pas{{color:var(--mut);font-weight:600}}
ul{{margin:4px 0 0 18px;padding:0}}li{{margin:2px 0}}small{{color:var(--mut)}}
</style>'''
o = [css, f'<h1>{html.escape(titre)}</h1>', f'<p class="lead">{intro} Le numéro renvoie à la <a href="{html.escape(url)}">page des planches</a>.</p>',
     '<table><tr><th>Concept</th><th>Planches</th><th>Accord</th><th>Pas sûr</th><th>Désaccords</th></tr>']
for c, b in by.items():
    d = [r['id'].split('-')[-1] for r in dis if r['concept'] == c and r['fable'] != 'pas sûr']
    o.append(f"<tr><td>{NOM.get(c, c)}</td><td>{b[0]}</td><td>{b[1]}</td><td>{b[2]}</td><td>{', '.join(d) or '—'}</td></tr>")
N = sum(b[0] for b in by.values()); A = sum(b[1] for b in by.values())
o.append(f"<tr><th>Total</th><th>{N}</th><th>{A} ({round(100 * A / N)} %)</th><th>{sum(b[2] for b in by.values())}</th><th>{len([r for r in dis if r['fable'] != 'pas sûr'])}</th></tr></table>")
cur = None
for r in sorted(dis, key=lambda r: r['id']):
    if r['concept'] != cur: cur = r['concept']; o.append(f'<h2>{NOM.get(cur, cur)}</h2>')
    lines = [l.strip() for l in r['texte'].split('\n')[1:] if l.strip()]
    items = ''.join(f"<li>{html.escape(l.lstrip('-• ').strip())}</li>" for l in lines)
    rp = f" <small>({html.escape(r['raisonProgramme'])})</small>" if r.get('raisonProgramme') else ''
    o.append(f'<div class="card"><h3>Planche {int(r["id"].split("-")[-1])} <span class="tag p">programme : {r["programme"]}</span><span class="tag f-{"pas" if r["fable"] == "pas sûr" else r["fable"]}">Fable : {r["fable"]}</span>{rp}</h3><ul>{items}</ul></div>')
open(out, 'w').write('\n'.join(o)); print('page écrite :', len(dis), 'désaccords')
