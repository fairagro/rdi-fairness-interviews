import React from "react";
import { getRdiById, getAllRdis } from "rf-rdis";
import {
  Box,
  Container,
  Typography,
  Chip,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import { FairnessTable } from "@/app/page";

import Link from "next/link";
import AssessmentIcon from "@mui/icons-material/Assessment"; 
import fs from 'fs';
import path from 'path';

function extractCitationField(fields: any[], typeName: string) {
  const field = fields.find((f) => f.typeName === typeName);
  return field ? field.value : undefined;
}

function extractCitationDescription(fields: any[]) {
  const field = fields.find((f) => f.typeName === "dsDescription");
  if (
    field &&
    Array.isArray(field.value) &&
    field.value[0]?.dsDescriptionValue?.value
  ) {
    return field.value[0].dsDescriptionValue.value;
  }
  return "";
}

function extractFairness(raw: any) {
  const fairagroBlock = raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  if (!fairagroBlock) return undefined;
  const fairagroDataField = fairagroBlock.fields?.find(
    (f: any) => f.typeName === "MDS_fairagro.fairagroData",
  );
  return fairagroDataField?.value?.FAIRness?.value;
}

/**
 * Reads the local schema definition file for the FAIRness block mappings
 */
function getFairnessSchemaBlock(): any {
  try {
    const filePath = path.join(process.cwd(), 'public', 'MDS_FAIRagro_RDI_schema.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const schema = JSON.parse(fileContent);
    return schema?.properties?.fairagroData?.properties?.FAIRness || null;
  } catch (error) {
    console.error('Failed to parse FAIRness block schema:', error);
    return null;
  }
}

/**
 * Normalizes values to explicit boolean primitives, numbers, or null based on schema definition
 */
function toBooleanValue(rawValue: any, type: string): boolean | number | string | null {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return null;
  }

  if (type === 'boolean') {
    const cleanStr = String(rawValue).trim().toLowerCase();
    if (cleanStr === 'yes' || cleanStr === 'true') return true;
    if (cleanStr === 'no' || cleanStr === 'false') return false;
    if (cleanStr === 'missing' || cleanStr === 'none' || cleanStr === 'unknown') return null;
    return null; 
  }

  if (type === 'number') {
    const num = Number(rawValue);
    return isNaN(num) ? null : num;
  }

  return rawValue;
}

/**
 * Transforms direct database compound payload maps into flat structures matching 
 * the exact configuration blocks required by the upgraded table view layers
 */
function conceptualizeFairnessData(rawFairness: any, fairnessSchema: any) {
  if (!rawFairness) return null;

  const serializedLd: Record<string, any> = {};
  const schemaProps = fairnessSchema?.properties || {};

  for (const key in rawFairness) {
    const rawNode = rawFairness[key];
    const schemaNode = schemaProps[key];

    if (!rawNode) continue;

    if (rawNode.typeClass === 'compound' && rawNode.value) {
      const pillarGroup: Record<string, any> = {
        "description": schemaNode?.description || "",
        "display_name": schemaNode?.display_name || "",
        "title": schemaNode?.title || "",
        "type": schemaNode?.type || "object"
      };

      for (const subKey in rawNode.value) {
        const subNode = rawNode.value[subKey];
        const subSchema = schemaNode?.properties?.[subKey];
        const targetType = subSchema?.type || "string";

        if (subNode) {
          pillarGroup[subKey] = {
            "value": toBooleanValue(subNode.value, targetType),
            "description": subSchema?.description || "",
            "display_name": subSchema?.display_name || "",
            "title": subSchema?.title || "",
            "type": targetType
          };
        }
      }
      serializedLd[key] = pillarGroup;
    } else {
      const targetType = schemaNode?.type || "string";
      serializedLd[key] = {
        "value": toBooleanValue(rawNode.value, targetType),
        "description": schemaNode?.description || "",
        "display_name": schemaNode?.display_name || "",
        "title": schemaNode?.title || "",
        "type": targetType
      };
    }
  }

  return serializedLd;
}

function extractRdiDisplayData(rdi: any) {
  const citationFields =
    rdi.raw?.datasetVersion?.metadataBlocks?.citation?.fields || [];
  return {
    title: extractCitationField(citationFields, "title") || rdi.id,
    description: extractCitationDescription(citationFields),
    subject: extractCitationField(citationFields, "subject") || [],
    FAIRness: extractFairness(rdi.raw),
  };
}

export function generateStaticParams() {
  return getAllRdis().map((rdi) => ({ rdiId: rdi.id }));
}

interface PageProps {
  params: Promise<{ rdiId: string }>;
}

export default async function RdiDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rdiId = Array.isArray(resolvedParams.rdiId)
    ? resolvedParams.rdiId[0]
    : resolvedParams.rdiId;
  const rdi = getRdiById(rdiId);

  if (!rdi) {
    return (
      <Container>
        <Typography variant="h5">RDI not found</Typography>
      </Container>
    );
  }

  const { title, description, subject, FAIRness: rawFairness } = extractRdiDisplayData(rdi);

  const fairnessSchema = getFairnessSchemaBlock();
  const cleanFairness = conceptualizeFairnessData(rawFairness, fairnessSchema);

  const fairagroBlock = rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  const re3DataField = fairagroBlock?.fields?.find(
    (f: any) => f.typeName === "MDS_fairagro.re3Data",
  );
  const re3Data =
    re3DataField &&
    typeof re3DataField.value === "object" &&
    re3DataField.value !== null &&
    !Array.isArray(re3DataField.value)
      ? re3DataField.value as any
      : undefined;
  
  const orgIdentifier = re3Data?.orgIdentifier?.value;
  const isRe3Data =
    typeof orgIdentifier === "string" && orgIdentifier.startsWith("r3d");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{ p: 4, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
            mb: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#222",
              flex: 1,
              minWidth: "300px",
            }}
          >
            {title}
          </Typography>

          {/* RSC Boundary Safe Wrapper Strategy */}
          <Link 
            href={`/resource/repository/${rdiId}/fairness`} 
            style={{ textDecoration: 'none' }}
          >
            <Button
              component="span"
              variant="outlined"
              startIcon={<AssessmentIcon />}
              sx={{
                color: "#0f9884",
                borderColor: "#0f9884",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 0.8,
                "&:hover": {
                  borderColor: "#0d8271",
                  backgroundColor: "rgba(15, 152, 132, 0.04)",
                },
              }}
            >
              Analyze FAIRness
            </Button>
          </Link>
        </Box>

        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "#333", lineHeight: 1.6 }}
        >
          {description}
        </Typography>

        {subject && subject.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#555", fontWeight: 600 }}
            >
              Subject:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {subject.map((s: string) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  sx={{ bgcolor: "#f0f2f5", color: "#444" }}
                />
              ))}
            </Box>
          </Box>
        )}

        {isRe3Data &&
          re3Data && (
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: "bold" }}>
                re3data.org Profile
              </Typography>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  mb: 2,
                  borderCollapse: "collapse",
                  background: "#fafafa",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <tbody>
                  {(() => {
                    const renderRow = (label: string, value: any) => (
                      <tr key={label}>
                        <td
                          style={{
                            fontWeight: 500,
                            padding: "8px 12px",
                            borderBottom: "1px solid #eee",
                            width: 220,
                            color: "#555",
                          }}
                        >
                          {label}
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            borderBottom: "1px solid #eee",
                            color: "#222",
                          }}
                        >
                          {value}
                        </td>
                      </tr>
                    );
                    const rows: any[] = [];
                    const addRow = (label: string, val: any) => {
                      if (val === undefined || val === null || val === "")
                        return;
                      if (Array.isArray(val)) {
                        if (val.length === 0) return;
                        rows.push(renderRow(label, val.join(", ")));
                      } else {
                        rows.push(renderRow(label, val));
                      }
                    };

                    addRow("Repository Name", re3Data?.repositoryName?.value);
                    addRow(
                      "Repository URL",
                      re3Data?.repositoryURL?.value ? (
                        <a
                          href={re3Data?.repositoryURL?.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#0f9884" }}
                        >
                          {re3Data?.repositoryURL?.value}
                        </a>
                      ) : undefined,
                    );
                    addRow("re3data.org ID", orgIdentifier);
                    addRow("Description", re3Data?.description?.value);
                    addRow("Contact", re3Data?.repositoryContact?.value);
                    addRow("Start Date", re3Data?.startDate?.value);
                    addRow("Size", re3Data?.size?.value);
                    addRow("Content Types", re3Data?.contentType?.value);
                    addRow("Languages", re3Data?.repositoryLanguage?.value);
                    addRow("Keywords", re3Data?.keyword?.value);
                    addRow(
                      "Mission Statement URL",
                      re3Data?.missionStatementURL?.value ? (
                        <a
                          href={re3Data?.missionStatementURL?.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#0f9884" }}
                        >
                          {re3Data?.missionStatementURL?.value}
                        </a>
                      ) : undefined,
                    );
                    addRow("Provider Type", re3Data?.providerType?.value);
                    addRow("Type", re3Data?.type?.value);
                    addRow("Versioning", re3Data?.versioning?.value);
                    addRow("PID System", re3Data?.pidSystem?.value);
                    addRow(
                      "Citation Guideline URL",
                      re3Data?.citationGuidelineURL?.value ? (
                        <a
                          href={re3Data?.citationGuidelineURL?.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#0f9884" }}
                        >
                          {re3Data?.citationGuidelineURL?.value}
                        </a>
                      ) : undefined,
                    );
                    addRow("Enhanced Publication", re3Data?.enhancedPublication?.value);
                    addRow("Quality Management", re3Data?.qualityManagement?.value);
                    addRow("Certificate", re3Data?.certificate?.value);
                    addRow("Remarks", re3Data?.remarks?.value);
                    addRow("Entry Date", re3Data?.entryDate?.value);
                    addRow("Last Update", re3Data?.lastUpdate?.value);

                    if (
                      Array.isArray(re3Data?.institution?.value) &&
                      re3Data?.institution?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Institution(s)",
                          re3Data?.institution?.value.map(
                            (inst: any, idx: number) => (
                              <div key={idx} style={{ marginBottom: 4 }}>
                                <b>{inst.institutionName?.value}</b>
                                {inst.institutionType?.value
                                  ? ` (${inst.institutionType.value})`
                                  : ""}
                                <br />
                                {inst.institutionCountry?.value && (
                                  <>
                                    Country: {inst.institutionCountry.value}
                                    <br />
                                  </>
                                )}
                                {Array.isArray(inst.institutionAdditionalName?.value) &&
                                  inst.institutionAdditionalName.value.length > 0 && (
                                    <>
                                      Additional:{" "}
                                      {inst.institutionAdditionalName.value.join(", ")}
                                      <br />
                                    </>
                                  )}
                                {Array.isArray(inst.responsibilityType?.value) &&
                                  inst.responsibilityType.value.length > 0 && (
                                    <>
                                      Responsibility:{" "}
                                      {inst.responsibilityType.value.join(", ")}
                                      <br />
                                    </>
                                  )}
                                {inst.institutionURL?.value && (
                                  <>
                                    URL:{" "}
                                    <a
                                      href={inst.institutionURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#0f9884" }}
                                    >
                                      {inst.institutionURL.value}
                                    </a>
                                    <br />
                                  </>
                                )}
                                {Array.isArray(inst.institutionIdentifier?.value) &&
                                  inst.institutionIdentifier.value.length > 0 && (
                                    <>
                                      Identifier:{" "}
                                      {inst.institutionIdentifier.value.join(", ")}
                                    </>
                                  )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.policy?.value) &&
                      re3Data?.policy?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Policy(s)",
                          re3Data?.policy?.value.map(
                            (pol: any, idx: number) => (
                              <div key={idx} style={{ marginBottom: 4 }}>
                                <b>{pol.policyName?.value}</b>
                                {pol.policyURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={pol.policyURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#0f9884" }}
                                    >
                                      {pol.policyURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.databaseAccess?.value) &&
                      re3Data?.databaseAccess?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Database Access",
                          re3Data?.databaseAccess?.value.map(
                            (da: any, idx: number) => (
                              <div key={idx}>
                                {da.databaseAccessType?.value}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.databaseLicense?.value) &&
                      re3Data?.databaseLicense?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Database License",
                          re3Data?.databaseLicense?.value.map(
                            (dl: any, idx: number) => (
                              <div key={idx}>
                                <b>{dl.databaseLicenseName?.value}</b>
                                {dl.databaseLicenseURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={dl.databaseLicenseURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#0f9884" }}
                                    >
                                      {dl.databaseLicenseURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataAccess?.value) &&
                      re3Data?.dataAccess?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data Access",
                          re3Data?.dataAccess?.value.map(
                            (da: any, idx: number) => (
                              <div key={idx}>{da.dataAccessType?.value}</div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataLicense?.value) &&
                      re3Data?.dataLicense?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data License",
                          re3Data?.dataLicense?.value.map(
                            (dl: any, idx: number) => (
                              <div key={idx}>
                                <b>{dl.dataLicenseName?.value}</b>
                                {dl.dataLicenseURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={dl.dataLicenseURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#0f9884" }}
                                    >
                                      {dl.dataLicenseURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataUpload?.value) &&
                      re3Data?.dataUpload?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data Upload",
                          re3Data?.dataUpload?.value.map(
                            (du: any, idx: number) => (
                              <div key={idx}>
                                <b>{du.dataUploadType?.value}</b>
                                {Array.isArray(du.dataUploadRestriction?.value) &&
                                  du.dataUploadRestriction.value.length > 0 && (
                                    <>
                                      {" "}
                                      (Restriction:{" "}
                                      {du.dataUploadRestriction.value.join(", ")}
                                      )
                                    </>
                                  )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataUploadLicense?.value) &&
                      re3Data?.dataUploadLicense?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data Upload License",
                          re3Data?.dataUploadLicense?.value.map(
                            (dul: any, idx: number) => (
                              <div key={idx}>
                                <b>{dul.dataUploadLicenseName?.value}</b>
                                {dul.dataUploadLicenseURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={dul.dataUploadLicenseURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#0f9884" }}
                                    >
                                      {dul.dataUploadLicenseURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.metadataStandard?.value) &&
                      re3Data?.metadataStandard?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Metadata Standard(s)",
                          re3Data?.metadataStandard?.value.map(
                            (ms: any, idx: number) => (
                              <div key={idx}>
                                <b>{ms.metadataStandardName?.value}</b>
                                {ms.metadataStandardURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={ms.metadataStandardURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#0f9884" }}
                                    >
                                      {ms.metadataStandardURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    return rows;
                  })()}
                </tbody>
              </Box>
            </Box>
          )}

        <Divider sx={{ my: 3 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
        >
          FAIRness Assessment Matrix
        </Typography>
        <FairnessTable fairness={cleanFairness} />
      </Paper>
    </Container>
  );
}