"""
Laya comme contrôleur de phrases : chaque phrase du coach est-elle appuyée par les faits ?

Jeu de test tiré des rapports du banc (reports/coach-eval-*.md) :
  - phrases FAUSSES : celles que le relecteur a classées « grave » ;
  - phrases JUSTES  : phrases (avec une case) des réponses notées 10/10 sans aucune remarque.
Pour chaque phrase, on donne à Laya les faits du contexte qui parlent des mêmes cases.

  ~/laya-venv/bin/python scripts/laya-check.py reports/coach-eval-*.md
"""

import glob
import random
import re
import sys
import time

from laya import Router

SQUARE = re.compile(r"(?<![a-zA-Z])([a-h][1-8])(?![0-9])")


def blocks(md):
    for b in re.split(r"\n(?=## \d+\. )", md)[1:]:
        body = b.split("\n### grounded\n", 1)
        if len(body) < 2:
            continue
        body = body[1]
        ctx = re.search(r"<summary>Contexte envoyé</summary>\n\n```\n(.*?)\n```", body, re.S)
        if not ctx:
            continue
        facts = [l for l in ctx.group(1).split("\n") if l.startswith("- [")]
        note = re.search(r"^Relecteur : (\d+)/10", body, re.M)
        graves = re.findall(r"^- \*\*grave\*\* — « (.*?) » :", body, re.M)
        minors = re.findall(r"^- \*\*mineure\*\*", body, re.M)
        lines = body.split("\n")
        i = next((k for k, l in enumerate(lines) if l.startswith("Relecteur :")), 0) + 1
        while i < len(lines) and (lines[i].startswith("- ") or not lines[i].strip()):
            i += 1
        end = next((k for k in range(i, len(lines)) if lines[k].startswith("<details>")), len(lines))
        advice = "\n".join(lines[i:end])
        yield {"facts": facts, "note": int(note.group(1)) if note else None, "graves": graves, "minors": len(minors), "advice": advice}


def sentences(text):
    text = re.sub(r"\*\*[^*]+\*\*\s*—\s*", "", text)
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n", text) if len(s.strip()) > 25]


def related_facts(facts, sentence, cap=14):
    sqs = set(SQUARE.findall(sentence))
    words = {w.lower() for w in re.findall(r"[A-Za-zÀ-ÿ]{5,}", sentence)}
    scored = []
    for f in facts:
        s = len(sqs & set(SQUARE.findall(f))) * 3 + len(words & {w.lower() for w in re.findall(r"[A-Za-zÀ-ÿ]{5,}", f)})
        if s:
            scored.append((s, f))
    scored.sort(key=lambda x: -x[0])
    return [f for _, f in scored[:cap]]


items = []
for path in sys.argv[1:]:
    for b in blocks(open(path, encoding="utf8").read()):
        for g in b["graves"]:
            items.append((0, g, related_facts(b["facts"], g)))
        if b["note"] == 10 and not b["graves"] and not b["minors"]:
            for s in sentences(b["advice"]):
                if SQUARE.search(s):
                    items.append((1, s, related_facts(b["facts"], s)))

random.seed(1)
bad = [x for x in items if x[0] == 0]
good = random.sample([x for x in items if x[0] == 1], min(len(bad) * 2, len([x for x in items if x[0] == 1])))
data = bad + good
print(f"{len(bad)} phrases fausses, {len(good)} phrases justes")

router = Router(preload=True)
QUESTIONS = {
    "supported": {
        "type": "noul",
        "instructions": "Is the coach's sentence fully supported by the facts listed, with no contradiction "
                        "(right piece owner, right piece, right cause and consequence)?",
    }
}
scores = []
t0 = time.time()
for label, sentence, facts in data:
    state = "Faits vérifiés :\n" + "\n".join(facts) + "\n\nPhrase du coach : " + sentence
    r = router.predict(state, QUESTIONS)
    p = r["answers"]["supported"]["noul"]
    scores.append((label, p, sentence))
dt = (time.time() - t0) / max(1, len(data))

good_p = [p for l, p, _ in scores if l == 1]
bad_p = [p for l, p, _ in scores if l == 0]
# AUC : probabilité qu'une phrase juste reçoive un score plus haut qu'une phrase fausse.
pairs = [(g > b) + 0.5 * (g == b) for g in good_p for b in bad_p]
auc = sum(pairs) / len(pairs)
print(f"moyenne P(appuyée) : justes {sum(good_p) / len(good_p):.3f}, fausses {sum(bad_p) / len(bad_p):.3f}")
print(f"AUC {auc:.3f} (0.5 = hasard, 1 = parfait) — {dt * 1000:.0f} ms par phrase sur CPU")
for thr in (0.3, 0.5, 0.7):
    caught = sum(p < thr for p in bad_p)
    false_alarm = sum(p < thr for p in good_p)
    print(f"seuil {thr} : fausses attrapées {caught}/{len(bad_p)}, fausses alertes {false_alarm}/{len(good_p)}")
print("\nExemples (phrases fausses, score) :")
for l, p, s in sorted(scores, key=lambda x: x[1])[:0] + [x for x in scores if x[0] == 0][:8]:
    print(f"  {p:.2f}  {s[:110]}")
