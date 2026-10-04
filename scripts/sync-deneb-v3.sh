#!/bin/bash
# 4 octobre 2026 : met DENEB au niveau du VPS après la nuit de calcul : morceaux manquants, recollage v3, jugements.
set -u
cd "$(dirname "$0")/.."
R='~/dev/chessboard/chessboard-scanner'
echo "[$(TZ=Europe/Paris date +%H:%M)] morceaux du VPS → DENEB"
for f in reports/rescan-v3/*.v3.jsonl; do ssh -n deneb "test -s $R/$f" 2>/dev/null || { scp -q "$f" "deneb:$R/$f" && echo "  copié $(basename $f)"; }; done
echo "[$(TZ=Europe/Paris date +%H:%M)] recollage sur DENEB"
ssh -n deneb "cd $R && for f in human-2013-01.s0 human-2013-01.s1 human-2013-01.s2 human-2013-01.s3 human-2016-01f.s0 human-2016-01f.s1 human-2016-01f.s2 human-2016-01f.s3; do cat \$(ls reports/rescan-v3/\$f.c*.v3.jsonl | sort) > data/labels/\$f.v3.jsonl; echo \"  \$f : \$(wc -l < data/labels/\$f.v3.jsonl) lignes\"; done"
echo "[$(TZ=Europe/Paris date +%H:%M)] jugements VPS → DENEB"
rsync -a --info=progress2 data/labels/human-2013-01.s{0,1,2,3}.juge.jsonl data/labels/human-2016-01f.s{0,1,2,3}.juge.jsonl deneb:dev/chessboard/chessboard-scanner/data/labels/ 2>&1 | tail -2
ssh -n deneb "cd $R && wc -l data/labels/*.juge.jsonl | tail -1 && md5sum data/labels/human-2016-01f.s3.juge.jsonl" ; md5sum data/labels/human-2016-01f.s3.juge.jsonl
echo "[$(TZ=Europe/Paris date +%H:%M)] stats du recalcul"
mkdir -p reports/rescan-v3/stats; scp -q "deneb:$R/reports/rescan-v3/*.stats.json" reports/rescan-v3/stats/ 2>/dev/null; cp reports/rescan-v3/*.stats.json reports/rescan-v3/stats/ 2>/dev/null; ls reports/rescan-v3/stats | wc -l
echo TERMINÉ
