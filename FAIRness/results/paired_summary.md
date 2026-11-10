# Paired comparison: interview (board-coded) vs re3data-derived profiles

Repositories with both sources: 14 (of 15 interviewed); pairs: 280

## Categories (all pairs)
category
agree (met)                       134
not assessable from registry      121
registry not met, operator met     11
registry met, operator not met      4
agree (not met)                     4
applicability differs               3
agree (not applicable)              3

Pairs assessed by both sources: 156; agreement 141 (90.4%); registry not met while operator met: 11 (7.1%); registry met while operator not met: 4 (2.6%)

- re3data-inferred: 40 pairs, agreement 70.0%, registry-not-met/operator-met 25.0%
- re3data-native: 116 pairs, agreement 97.4%, registry-not-met/operator-met 0.9%

Excluding retrievalProtocol and metadataAlwaysAvailable (vocabulary mismatch of the inference rules): 131 pairs, agreement 88.5%

## Pillar scores, 5 x (met / assessed), mean over repositories

| pillar | operator (paired, n=14) | registry (paired, n=14) | registry-only cohort (n=31) |
|---|---|---|---|
| findability | 4.57 | 3.18 | 2.44 |
| accessibility | 5.00 | 5.00 | 4.84 |
| interoperability | 4.07 | 4.52 | 4.66 |
| reusability | 4.64 | 5.00 | 5.00 |

## Per metric

          pillar                  metric provenance  assessable_from_registry  assessed_by_both  agree  registry_not_met_operator_met  registry_met_operator_not_met  applicability_differs operator_met registry_met  agreement_pct
     findability    persistentIdentifier     native                        13                13     12                              1                              0                      0        12/14        11/13           92.0
     findability          metadataSchema     native                         9                 9      9                              0                              0                      0        14/14          9/9          100.0
     findability            richMetadata   inferred                         9                 9      5                              4                              0                      0        14/14          5/9           56.0
     findability  indexedInSearchEngines   inferred                        11                11      7                              3                              1                      0        11/14         6/11           64.0
     findability     metadataPersistence      novel                         0                 0      0                              0                              0                      0        13/14          0/0            NaN
   accessibility       retrievalProtocol     native                        11                11     11                              0                              0                      0        14/14        11/11          100.0
   accessibility        dataAvailability     native                        14                14     14                              0                              0                      0        14/14        14/14          100.0
   accessibility  authenticationRequired     native                        14                14     14                              0                              0                      0        14/14        14/14          100.0
   accessibility      authenticationType     native                        11                 8      8                              0                              0                      3          7/7          8/8          100.0
   accessibility metadataAlwaysAvailable     native                        14                14     14                              0                              0                      0        14/14        14/14          100.0
interoperability             dataFormats   inferred                        11                11     10                              0                              1                      0        13/14        11/11           91.0
interoperability         apiAvailability     native                        11                11     10                              0                              1                      0        13/14        11/11           91.0
interoperability knowledgeRepresentation   inferred                         9                 9      6                              3                              0                      0        10/14          5/9           67.0
interoperability        vocabulariesUsed      novel                         0                 0      0                              0                              0                      0        11/14          0/0            NaN
interoperability     qualifiedReferences      novel                         0                 0      0                              0                              0                      0        10/14          0/0            NaN
     reusability          licenseClarity     native                        14                14     14                              0                              0                      0        14/14        14/14          100.0
     reusability      citationGuidelines     native                         8                 8      7                              0                              1                      0        13/14          8/8           88.0
     reusability          provenanceInfo      novel                         0                 0      0                              0                              0                      0        12/14          0/0            NaN
     reusability      communityStandards      novel                         0                 0      0                              0                              0                      0        13/14          0/0            NaN
     reusability    documentationQuality      novel                         0                 0      0                              0                              0                      0        13/14          0/0            NaN
