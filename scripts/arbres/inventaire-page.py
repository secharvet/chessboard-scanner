#!/usr/bin/env python3
"""Page de l'inventaire des arbres remarquables.
   python3 scripts/arbres/inventaire-page.py data/arbres/arbres.inventaire.json <sortie.html> [--noms data/arbres/noms.json] [--rapport data/arbres/model.report.json] [--temoin data/arbres/temoin.report.json] [--top 50]"""
import json, html, sys, argparse
ap = argparse.ArgumentParser(); ap.add_argument('inv'); ap.add_argument('out'); ap.add_argument('--noms', default=''); ap.add_argument('--rapport', default=''); ap.add_argument('--temoin', default=''); ap.add_argument('--top', type=int, default=50); ap.add_argument('--titre', default="Les arbres remarquables")
a = ap.parse_args()
inv = json.load(open(a.inv)); noms = json.load(open(a.noms)) if a.noms else {}
rap = json.load(open(a.rapport)) if a.rapport else None; tem = json.load(open(a.temoin)) if a.temoin else None
esc = lambda x: html.escape(str(x))
FR = {'fa': 'apparaît', 'fl': 'disparaît', 'at': 'atome', 'ef': 'effet', 'pl': 'plan', 'tg': 'vise', 'zt': 'zone', 'dk': 'pression roi', 'dz': 'contrôle', 'kz': 'zone roi', 'cas': 'roque', 'chk': 'échec', 'cap': 'prise', 'pc': 'pièce', 'side': 'camp', 'mat': 'matériel'}
def trait(t):
    k = t.split(':')[0]; rest = ':'.join(t.split(':')[1:]).replace(':me', ' (moi)').replace(':him', ' (lui)').replace('me:', 'moi ').replace('him:', 'lui ')
    return f"<span class=tr title='{esc(t)}'>{esc(FR.get(k, k))} {esc(rest)}</span>"
rows = []
for r, g in enumerate(inv['groupes'][:a.top], 1):
    nom = noms.get(str(g['groupe']), {})
    import re as _re
    def lien(m):
        gid = str(m[0]); return f"<a href='https://lichess.org/{esc(gid)}#{int(m[1])}' target=_blank>{esc(gid)}#{int(m[1])}</a>" if _re.fullmatch(r'[A-Za-z0-9]{8}', gid) else f"partie {esc(gid)} #{int(m[1])}"
    ex = ' · '.join(lien(m) for m in g['exemples'][:6])
    coups = g.get('exemples_coups', [])[:3]
    if coups: ex += '<div class=n>' + '<br>'.join(f"{esc(c['fenetre'])} <b>‖</b> {esc(c['suite'])}" for c in coups) + '</div>'
    rows.append(f"<tr><td class=num>{r}</td><td><b>{esc(nom.get('nom', '—'))}</b><div class=n>{esc(nom.get('sens', ''))}</div></td><td class=num>{g['parties']}<br><span class=n>{g['fenetres']} fenêtres</span></td><td class=num>{g['previsibilite']:.2f}</td><td>{' '.join(trait(t) for t,_,_ in g['traits'][:8])}</td><td>{' '.join(trait(t) for t,_,_ in g['avenir'][:6])}</td><td class=ex>{ex}</td></tr>")
def rapport(rp, titre):
    if not rp: return ''
    e = rp['epochs'][-1]
    return f"<div><b>{esc(titre)}</b> : perte {e['perte_val']:.3f} contre {e['perte_constante']:.3f} pour la constante ; AUC moyenne {e['auc_moyenne']:.3f} sur {e['n_traits_auc']} traits d'avenir.</div>"
style = open('/tmp/claude-1000/-home-ubuntu-ruche/d5c15aa3-2d27-4c63-97f7-1047dd23cc38/scratchpad/recit-opera.html').read().split('<style>')[1].split('</style>')[0] if __import__('os').path.exists('/tmp/claude-1000/-home-ubuntu-ruche/d5c15aa3-2d27-4c63-97f7-1047dd23cc38/scratchpad/recit-opera.html') else ''
page = f"""<title>{esc(a.titre)}</title>
<style>{style}
td{{font-size:.86rem;vertical-align:top}} .num{{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}} .ex{{font-size:.8em;max-width:26ch}}
.tr{{display:inline-block;background:var(--S);border-radius:4px;padding:0 5px;margin:1px;font:12px system-ui,sans-serif}}
</style>
<h1>{esc(a.titre)}</h1>
<p>Arbres trouvés sans règle écrite : chaque fenêtre de seize demi-coups de parties humaines (Lichess Elite, 2400 et plus) est décrite par des grains relationnels, plongée dans un espace vectoriel appris à prédire la suite, puis regroupée. Un groupe est remarquable s'il réunit beaucoup de parties, si ses fenêtres se ressemblent, et si ses suites sont prévisibles. Les traits affichés sont ceux qui sont nettement plus fréquents dans le groupe qu'ailleurs. Vus du camp qui vient de jouer : « moi » et « lui ».</p>
<div class=kpi><div><b>{inv['n']}</b>fenêtres</div><div><b>{inv['k']}</b>groupes formés</div><div><b>{len(inv['groupes'])}</b>groupes assez soutenus</div><div><b>{a.top}</b>montrés</div></div>
{rapport(rap, 'Modèle (grains relationnels)')}{rapport(tem, 'Témoin (coups seuls)')}
<div class=tw><table><thead><tr><th>#</th><th>Nom proposé</th><th>Parties</th><th>Prévisibilité</th><th>Traits saillants de la fenêtre</th><th>Ce qui suit d'habitude</th><th>Exemples</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div>
"""
open(a.out, 'w').write(page); print('page', a.out, len(rows), 'groupes')
