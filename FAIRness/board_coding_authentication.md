# Board coding sheet: authentication metrics (Reviewer 1 C4, Reviewer 2 C3, Reviewer 3 C2)

Status: APPLIED to both CSVs on 2026-11-03 (backups *.bak-20261103-preC4.csv). Board decisions: rule accepted; CCDC metric 8 = 1 (licence-key/login tier counts as protected data access); PhenoRoam included (spreadsheet exists), all 20 answers coded; RADAR4Chem coded compliant on all metrics per email, metric 8 not applicable.

Pipeline (2026-11-03): the rule is implemented in `rdiDataEnricher/fair_mapping.py` (`infer_authentication`, fed by the `dataAccessEntries` that `search_and_enrich_data.py` now keeps from re3data), `run_enrichment.py` preserves the literal `not applicable` typed by the board, and `0003_2_integrate_fairagroData.py` writes it into the records (and no longer fabricates False/True for metrics without evidence). Re-running the pipeline reproduces the hand-coded enriched CSV except that three registry repositories with a restricted tier but no documented mechanism are now **not assessed** (empty) rather than `not applicable`: Health Study Hub and nmrXiv on metric 8, ICSD on metrics 7 and 8. Figures 2 and 3 are unchanged (both states are excluded from the denominator). Records regenerated into `resources/data/3_dataverse_datasets_final` and `resources/rf-rdis/data` (package version 1.1.0, not yet published).

## Proposed rule

Metric 7 `authenticationRequired` (RDA-A1.2-01D). Scored criterion: *access regime appropriate to the data*.

- 1 = data declared open is retrievable without authentication, and/or restricted, embargoed or controlled data are reachable through an authentication and authorisation procedure.
- 0 = authentication is demanded for data declared open, or restricted data exist with no authentication/authorisation procedure (informal request only).
- not assessed = no evidence (also when the repository is closed: metric 10 covers that).

Metric 8 `authenticationType` (sub-item of RDA-A1.2-01D). Scored criterion: *where authentication is used for data access, the mechanism is standard and documented*.

- applicable only if authentication is used for data access (restricted/controlled tiers or per-dataset restriction). Deposit-only authentication does not make it applicable.
- 1 = a named standard mechanism (OAuth/OIDC, ORCID, SAML/Shibboleth, institutional login, registered account, API token, licence key).
- 0 = authentication is used for data access but the mechanism is unnamed or ad hoc.
- not assessed = no authentication for data access (fully open), or no evidence.

## Interviewed repositories (operator claims verbatim in the spreadsheets)

| Repository | Current coding (req / type) | Proposed (req / type) | Rationale |
|---|---|---|---|
| BonaRes Repository | No / Yes | 1 / 1 | Open by default; controlled tier uses federated identity (ORCID). |
| EDI Data Portal | No / Yes | 1 / n/a | Open data, no authentication needed; OAuth mentioned only as a plan. |
| Zenodo | Yes / Yes | 1 / 1 | Public, restricted and embargoed files; local account or OAuth providers. |
| ZB MED Suchportal Lebenswissenschaften | No / Yes | 1 / 1 | Tiered access; institutional login, Dataverse accounts, tokens. |
| Edaphobase | No / No | 1 / 1 | Partial open access; full access after registration (account). |
| OpenAgrar | No / Yes | 1 / 1 | Open by default; closed-access data via access keys and login. |
| Open Data Server | No / No | 1 / n/a | Open data, no authentication. |
| Thünen Atlas | No / No | 1 / n/a | Open data, no authentication. |
| BacDive - Bacterial Diversity Database | No / No | 1 / n/a | Open data, no authentication. |
| PANGAEA | No / No | 1 / n/a | Open data, no authentication. |
| RADAR4Chem | No / No | ? / ? | Answers received by email: board to code from the email (currently No / No). |
| Cambridge Structural Database | No / No | 1 / 1 | Datasets download without authentication; enriched-entry access uses login / licence key (board to confirm that this tier counts as data access). |
| iochem-BD | No / No | 1 / n/a | Open data, no authentication. |
| EUDATA B2SHARE | No / Yes | 1 / 1 | Open access; restricted records and deposit via B2ACCESS. |

## re3data cohort (rule applied to re3data dataAccess / dataAccessRestriction)

Legend: 1 = met; n/a = not applicable (no restricted or closed tier, so authentication is not used for data access); — = not assessed (a restricted tier exists but the registry does not name the mechanism, or fee-based access only).

| Repository | re3data access types | restrictions | Coding (req / type) |
|---|---|---|---|
| GFZ Data Services | embargoed, open | - | 1 / n/a |
| Plant Genomics and Phenomics Research Data Repository | open | - | 1 / n/a |
| Ensembl Plants | open | - | 1 / n/a |
| NCBI | open | - | 1 / n/a |
| PUBLISSO Repository for Life Sciences | open | - | 1 / n/a |
| Dryad | embargoed, open | - | 1 / n/a |
| German genebank of vine (UC NICEPLANTS) | open | - | 1 / n/a |
| TERENO | embargoed, open, restricted | registration | 1 / 1 |
| Climate Data Center | open, restricted, restricted | feeRequired, registration | 1 / 1 |
| Plant Biotechnology Information Primary Database | restricted | registration | 1 / 1 |
| The European Nucleotide Archive (ENA) | open | - | 1 / n/a |
| Biological Collection Access Service for Europe | open | - | 1 / n/a |
| European Soil Data Centre  | open, restricted | registration | 1 / 1 |
| Tierseuchennachrichtensystem | open | - | 1 / n/a |
| RAKIP-Web Model Repository | open | - | 1 / n/a |
| BioImage Archive | open | - | 1 / n/a |
| Image Data Resource | open | - | 1 / n/a |
| Electron Microscopy Public Image Archive | open | - | 1 / n/a |
| Preclinical Image Dataset Repository | open | - | 1 / n/a |
| German Human Genome-Phenome Archive | restricted | registration | 1 / 1 |
| ARChive | embargoed, open, restricted | registration, registration | 1 / 1 |
| Health Study Hub | open, restricted | feeRequired | 1 / — |
| Chemotion Repository  | open | - | 1 / n/a |
| MassBank Eurpe | open | - | 1 / n/a |
| nmrXiv | open, restricted | other | 1 / — |
| STRENDA DB | open, restricted | registration | 1 / 1 |
| Suprabank | embargoed, open, restricted | registration | 1 / 1 |
| Inorganic Crystal Structure Database | restricted | feeRequired | — / — |
| NOMAD | embargoed, open, restricted | registration | 1 / 1 |
| Repo4Cat | open | - | 1 / n/a |
| DaKS | embargoed, open | - | 1 / n/a |

## Effect on Figure 2 (Accessibility, 0-5, unknown-aware scoring)

- interviews: 3.50 -> 4.93 (n=15, with PhenoRoam)
- re3data cohort: 1.00 -> 2.62
- landscape baseline: 1.78 -> 3.37 (n=46)

Note: in the re3data cohort, retrieval protocol and metadata-always-available are 0/31 because the current inference rules in fair_mapping.py never match re3data's vocabulary (access types are open/restricted/closed, not protocol names). That is a separate fix (Reviewer 3 C3/C4).
