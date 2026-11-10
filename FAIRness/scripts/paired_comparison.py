#!/usr/bin/env python3
"""Paired comparison of interview-based (board-coded) and re3data-derived FAIRness profiles.

For every interviewed repository that also has a re3data record, the registry-derived profile is
generated independently with the enrichment pipeline (rdiDataEnricher, replayed from
enrichment_cache.json) and compared metric by metric with the board-coded interview profile in
the input CSV. Written for the revision of the methodology paper (Reviewer 1 C9, Reviewer 2 #4/#5).

Run from resources/data/data_fairagro:  python3 FAIRness/scripts/paired_comparison.py
Outputs (FAIRness/results/): paired_pairs.csv, paired_by_metric.csv, paired_summary.md
"""
import logging, sys
from pathlib import Path
import numpy as np, pandas as pd
logging.disable(logging.CRITICAL)
ROOT = Path(__file__).resolve().parents[2]          # resources/data/data_fairagro
sys.path.insert(0, str(ROOT))
from rdiDataEnricher.search_and_enrich_data import Re3DataEnricher      # noqa: E402
from rdiDataEnricher.fair_mapping import infer_fair_value, get_fair_fields, FAIR_MAPPING, NOT_APPLICABLE  # noqa: E402

INPUT = ROOT / "NFDI_RDIs_List_Ata - NFDI_RDIs.csv"
ENRICHED = ROOT / "NFDI-RDIs List - NFDI_RDIs_enriched.csv"
OUT = ROOT / "FAIRness" / "results"
PILLARS = ["findability", "accessibility", "interoperability", "reusability"]

def board(v):
    s = str(v).strip().lower()
    return True if s in ("yes", "true", "1") else False if s in ("no", "false", "0") else NOT_APPLICABLE if s == "not applicable" else None

def category(b, g):
    if b is None: return "not coded by board"
    if g is None: return "not assessable from registry"
    if b == NOT_APPLICABLE and g == NOT_APPLICABLE: return "agree (not applicable)"
    if b == NOT_APPLICABLE or g == NOT_APPLICABLE: return "applicability differs"
    if b == g: return "agree (met)" if b else "agree (not met)"
    return "registry not met, operator met" if b else "registry met, operator not met"

def pillar_score(values):
    v = [x for x in values if x in (True, False)]
    return 5 * sum(v) / len(v) if v else np.nan

def main():
    import os; os.chdir(ROOT)      # the enricher reads enrichment_cache.json relative to cwd
    inp = pd.read_csv(INPUT, dtype=str)
    fair = get_fair_fields()
    survey = inp[inp[fair].notna().any(axis=1)]
    paired = survey[survey["generalInfo.re3dataIdentifier"].astype(str).str.startswith("r3d")]
    enricher = Re3DataEnricher(inp.copy())
    rows = []
    for _, r in paired.iterrows():
        rid = r["generalInfo.re3dataIdentifier"].strip()
        xml = enricher.fetch_repository_xml(rid)
        if xml is None:
            print("no cached re3data record for", r["generalInfo.name"], rid); continue
        data = enricher.parse_repository_xml(xml)
        for f in fair:
            b, g = board(r[f]), infer_fair_value(f, data)
            rows.append({"repository": r["generalInfo.name"], "RFID": r["RFID"], "re3data": rid, "pillar": f.split(".")[1],
                         "metric": f.split(".")[2], "provenance": FAIR_MAPPING[f]["source_type"],
                         "operator": b, "registry": g, "category": category(b, g)})
    df = pd.DataFrame(rows)
    OUT.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUT / "paired_pairs.csv", index=False)
    n_repo = df.repository.nunique()

    # per metric
    recs = []
    for f in fair:
        m = f.split(".")[2]; sub = df[df.metric == m]
        both = sub[sub.category.str.startswith(("agree", "registry"))]
        op = [x for x in sub.operator if x in (True, False)]; rg = [x for x in sub.registry if x in (True, False)]
        recs.append({"pillar": f.split(".")[1], "metric": m, "provenance": FAIR_MAPPING[f]["source_type"].replace("re3data-", "").replace("fairagro-", ""),
                     "assessable_from_registry": int((sub.category != "not assessable from registry").sum()),
                     "assessed_by_both": len(both),
                     "agree": int(both.category.str.startswith("agree").sum()),
                     "registry_not_met_operator_met": int((sub.category == "registry not met, operator met").sum()),
                     "registry_met_operator_not_met": int((sub.category == "registry met, operator not met").sum()),
                     "applicability_differs": int((sub.category == "applicability differs").sum()),
                     "operator_met": f"{sum(op)}/{len(op)}", "registry_met": f"{sum(rg)}/{len(rg)}" if rg else "0/0"})
    bym = pd.DataFrame(recs)
    bym["agreement_pct"] = (100 * bym.agree / bym.assessed_by_both.replace(0, np.nan)).round(0)
    bym.to_csv(OUT / "paired_by_metric.csv", index=False)

    # summaries
    both = df[df.category.str.startswith(("agree", "registry"))]
    lines = [f"# Paired comparison: interview (board-coded) vs re3data-derived profiles", "",
             f"Repositories with both sources: {n_repo} (of {len(survey)} interviewed); pairs: {len(df)}", "",
             "## Categories (all pairs)", df.category.value_counts().to_string(), "",
             f"Pairs assessed by both sources: {len(both)}; agreement {both.category.str.startswith('agree').sum()} ({100*both.category.str.startswith('agree').mean():.1f}%); "
             f"registry not met while operator met: {(both.category=='registry not met, operator met').sum()} ({100*(both.category=='registry not met, operator met').mean():.1f}%); "
             f"registry met while operator not met: {(both.category=='registry met, operator not met').sum()} ({100*(both.category=='registry met, operator not met').mean():.1f}%)", ""]
    for prov, sub in both.groupby(df.provenance):
        lines.append(f"- {prov}: {len(sub)} pairs, agreement {100*sub.category.str.startswith('agree').mean():.1f}%, registry-not-met/operator-met {100*(sub.category=='registry not met, operator met').mean():.1f}%")
    excl = both[~both.metric.isin(["retrievalProtocol", "metadataAlwaysAvailable"])]
    lines += ["", f"Excluding retrievalProtocol and metadataAlwaysAvailable (vocabulary mismatch of the inference rules): {len(excl)} pairs, agreement {100*excl.category.str.startswith('agree').mean():.1f}%", ""]
    # paired pillar scores + unpaired registry cohort for comparison
    enr = pd.read_csv(ENRICHED, dtype=str)
    reg_only = enr[~enr.RFID.isin(survey.RFID) & enr[fair].notna().any(axis=1)]
    def enr_val(v):
        s = str(v).strip().lower(); return True if s == "true" else False if s == "false" else None
    lines += ["## Pillar scores, 5 x (met / assessed), mean over repositories", "", "| pillar | operator (paired, n=%d) | registry (paired, n=%d) | registry-only cohort (n=%d) |" % (n_repo, n_repo, len(reg_only)), "|---|---|---|---|"]
    for p in PILLARS:
        op = [pillar_score(s.operator) for _, s in df[df.pillar == p].groupby("repository")]
        rg = [pillar_score(s.registry) for _, s in df[df.pillar == p].groupby("repository")]
        cols = [f for f in fair if f".{p}." in f]
        ro = [pillar_score([enr_val(r[c]) for c in cols]) for _, r in reg_only.iterrows()]
        lines.append(f"| {p} | {np.nanmean(op):.2f} | {np.nanmean(rg):.2f} | {np.nanmean(ro):.2f} |")
    lines += ["", "## Per metric", "", bym.to_string(index=False)]
    (OUT / "paired_summary.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))

if __name__ == "__main__":
    main()
