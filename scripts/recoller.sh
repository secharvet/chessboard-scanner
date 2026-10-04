#!/bin/bash
# Recolle les 24 morceaux recalculés (reports/rescan-<V>/*.<V>.jsonl, V=v3 par défaut) en 8 fichiers data/labels/*.<V>.jsonl, sur le VPS
# puis sur DENEB (les morceaux faits sur le VPS y sont copiés d'abord), et additionne les statistiques.
set -eu
V=${V:-v3}  # version des étiquettes (v3, v4…)
cd "$(dirname "$0")/.."
# Chemin distant NON développé localement (le foyer de DENEB n'est pas celui du VPS : échec du scp le 2 octobre au soir).
R='~/dev/chessboard/chessboard-scanner'
for f in human-2013-01.s0 human-2013-01.s1 human-2013-01.s2 human-2013-01.s3 human-2016-01f.s0 human-2016-01f.s1 human-2016-01f.s2 human-2016-01f.s3; do
  n=$(ls reports/rescan-${V}/$f.c*.${V}.jsonl | wc -l); [ "$n" -ge 2 ] || { echo "ÉCHEC : morceaux manquants pour $f"; exit 1; }
  cat $(ls reports/rescan-${V}/$f.c*.${V}.jsonl | sort) > data/labels/$f.${V}.jsonl
  src=$(wc -l < data/labels/$f.jsonl); dst=$(wc -l < data/labels/$f.${V}.jsonl)
  [ "$src" -eq "$dst" ] || { echo "ÉCHEC : $f : $src lignes à l'origine, $dst recollées"; exit 1; }
  echo "$f : $dst lignes"
done
# Morceaux faits sur le VPS → DENEB, puis recollage là-bas.
for f in reports/rescan-${V}/*.${V}.jsonl; do
  ssh -n deneb "test -s $R/$f" 2>/dev/null || scp -q "$f" "deneb:$R/$f"
done
ssh -n deneb "cd $R && for f in human-2013-01.s0 human-2013-01.s1 human-2013-01.s2 human-2013-01.s3 human-2016-01f.s0 human-2016-01f.s1 human-2016-01f.s2 human-2016-01f.s3; do cat \$(ls reports/rescan-${V}/\$f.c*.${V}.jsonl | sort) > data/labels/\$f.${V}.jsonl; echo \"deneb \$f : \$(wc -l < data/labels/\$f.${V}.jsonl) lignes\"; done"
# Statistiques (stats.json de chaque morceau : DENEB puis VPS).
mkdir -p reports/rescan-${V}/stats
scp -q "deneb:$R/reports/rescan-${V}/*.stats.json" reports/rescan-${V}/stats/ 2>/dev/null || true
cp reports/rescan-${V}/*.stats.json reports/rescan-${V}/stats/ 2>/dev/null || true
python3 - <<'PY'
import json, glob
tot={'records':0,'kept':0,'removed':0,'moved':0,'added':0}; by={}
for f in glob.glob('reports/rescan-${V}/stats/*.stats.json'):
    d=json.load(open(f))
    for k in tot: tot[k]+=d.get(k,0)
    for c,v in d.get('byConcept',{}).items():
        b=by.setdefault(c,{'kept':0,'removed':0,'moved':0,'added':0})
        for k in b: b[k]+=v.get(k,0)
print('total', tot)
for c,v in sorted(by.items(), key=lambda x:-(x[1]['kept']+x[1]['added'])): print(f"{c:28} gardés {v['kept']:7} retirés {v['removed']:6} déplacés {v['moved']:6} ajoutés {v['added']:7}")
json.dump({'total':tot,'byConcept':by}, open('reports/rescan-${V}/stats-total.json','w'), indent=1)
PY
echo "RECOLLÉ"
