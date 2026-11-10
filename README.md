# RDI Fairness Interviews

## 🔄 Site Migration

This repository's content has been moved to a new location with improved features and performance.

### 📍 New Location

**Visit the new platform:** [https://rdi-fairness-interviews.vercel.app/](https://rdi-fairness-interviews.vercel.app/)

---

## About

The RDI Fairness Interviews project is part of the **FAIRagro** initiative, focused on exploring fairness in research data infrastructure through comprehensive interviews and research.

---

## Contact

If you have any questions or need further information, please don't hesitate to reach out:

📧 **Email:** [a.haleem@fz-juelich.de](mailto:a.haleem@fz-juelich.de)

**Team:** FAIRagro Team

---

*Thank you for your interest in our research!*

## Data, rules and scripts behind the FAIRness methodology paper (revision, November 2026)

- `NFDI_RDIs_List_Ata - NFDI_RDIs.csv` – the hand-curated inventory (77 entries) with the board-coded interview values of the 15 interviewed repositories (`Yes` / `No` / `not applicable` in the `FAIRness.*` columns).
- `NFDI-RDIs List - NFDI_RDIs_enriched.csv` – the same inventory after registry enrichment: empty FAIR cells of repositories with a re3data record are filled from the record (`True` / `False`; an empty cell means *not assessed*); `FAIRness.assessmentMethod` (`interview` / `re3data`) and, for registry-derived profiles, `FAIRness.assessmentDate` record the provenance of every profile.
- `rdiDataEnricher/fair_mapping.py` – the rule for every metric, including the conditional authentication rule and the policy that an absent re3data element yields *not assessed*, never non-compliance (Supplementary Table 5 of the paper).
- `enrichment_cache.json` – the re3data API responses used for the paper, so that the enrichment replays deterministically: `python3 run_enrichment_cached.py` (no network needed; `run_enrichment.py` fetches the repository listing live).
- `FAIRness/board_coding_authentication.md` – the editorial board's coding sheet for the two authentication metrics.
- `FAIRness/interviews/` – the completed operator questionnaires; `FAIRness/data/` – the two CSVs as used for the figures.
- `FAIRness/scripts/plot_radar_v2.py`, `plot_bar_v2.py`, `fair_common_v2.py` – Figures 2 and 3 (unknown-aware scoring: pillar score = 5 × metrics met / metrics assessed); outputs in `FAIRness/results/`.
- `FAIRness/scripts/paired_comparison.py` – the paired comparison of interview and registry profiles for the 14 repositories with both sources (Supplementary Table 3); outputs `FAIRness/results/paired_pairs.csv`, `paired_by_metric.csv`, `paired_summary.md`.

### Reproducing the figures

```
pip install pandas httpx lxml matplotlib
python3 run_enrichment_cached.py
cp "NFDI_RDIs_List_Ata - NFDI_RDIs.csv" "NFDI-RDIs List - NFDI_RDIs_enriched.csv" FAIRness/data/
python3 FAIRness/scripts/plot_radar_v2.py && python3 FAIRness/scripts/plot_bar_v2.py
python3 FAIRness/scripts/paired_comparison.py
```

The JSON records consumed by RepoFinder and published as the `rf-rdis` npm package are generated from the enriched CSV by the Dataverse integration scripts of the RepoFinder project.
