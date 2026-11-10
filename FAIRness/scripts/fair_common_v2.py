"""Shared loader for the revised (unknown-aware) figure scripts.

Scoring rule (revision, Reviewer 1 C2 / Reviewer 3 C3):
  yes/true -> 1, no/false -> 0, anything else (blank, 'na', free text) -> None = not assessed.
  A pillar score for one repository is 5 * met / assessed over that pillar's indicators;
  indicators without evidence are excluded from the denominator, never counted as 0.
Cohorts are built exactly as in plot_radar.py / plot_bar.py (survey = rows of file 1 with any
FAIR value; fallback = rows of file 2 with an r3d identifier that are not in the survey set).
"""
import csv
PILLARS = ["findability", "accessibility", "interoperability", "reusability"]

def load(path):
    with open(path, newline="", encoding="utf-8-sig") as fh:
        return list(csv.DictReader(fh))

def state(v):
    s = (v or "").strip().lower()
    if s in ("yes", "true", "1", "1.0"): return 1
    if s in ("no", "false", "0", "0.0"): return 0
    return None

def fair_columns(rows):
    return [c for c in rows[0] if c.startswith("FAIRness.") and c.split(".")[1] in PILLARS]

def cohorts(f1, f2):
    rows1, rows2 = load(f1), load(f2)
    cols = fair_columns(rows1)
    survey = [r for r in rows1 if any(state(r[c]) == 1 for c in cols)]
    sv_ids = {r["RFID"].strip().lower() for r in survey
              if r["generalInfo.re3dataIdentifier"].strip().lower().startswith("r3d")}
    fallback = [r for r in rows2
                if r["generalInfo.re3dataIdentifier"].strip().lower().startswith("r3d")
                and r["RFID"].strip().lower() not in sv_ids]
    return survey, fallback, cols

def pillar_score(row, cols, pillar):
    vals = [state(row[c]) for c in cols if f".{pillar}." in c]
    k = [v for v in vals if v is not None]
    return (5.0 * sum(k) / len(k), len(k)) if k else (None, 0)

def cohort_pillar_means(rows, cols):
    out = {}
    for p in PILLARS:
        s = [pillar_score(r, cols, p)[0] for r in rows]
        s = [x for x in s if x is not None]
        out[p] = sum(s) / len(s) if s else None
    return out

def indicator_rate(rows, col):
    k = [state(r[col]) for r in rows if state(r[col]) is not None]
    return (100.0 * sum(k) / len(k) if k else None, len(k), len(rows))
