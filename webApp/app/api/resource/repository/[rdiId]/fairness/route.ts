// app/api/resource/repository/[rdiId]/fairness/route.ts
import { NextResponse } from 'next/server';
import { getRdiById, getAllRdis } from 'rf-rdis';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllRdis().map((rdi) => ({
    rdiId: rdi.id,
  }));
}

function extractCitationField(fields: any[], typeName: string) {
  const field = fields.find(f => f.typeName === typeName);
  return field ? field.value : undefined;
}

function extractFairness(raw: any) {
  const fairagroBlock = raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  if (!fairagroBlock) return undefined;
  const fairagroDataField = fairagroBlock.fields?.find((f: any) => f.typeName === 'MDS_fairagro.fairagroData');
  return fairagroDataField?.value?.FAIRness?.value;
}

/**
 * Reads the schema file and pulls only the FAIRness property definition block
 */
function getFairnessSchemaBlock(): any {
  try {
    const filePath = path.join(process.cwd(), 'public', 'MDS_FAIRagro_RDI_schema.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const schema = JSON.parse(fileContent);
    
    // Target only the FAIRness schema section
    return schema?.properties?.fairagroData?.properties?.FAIRness || null;
  } catch (error) {
    console.error('Failed to parse FAIRness metadata block schema:', error);
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
    return null; // Fallback default for unexpected placeholder states
  }

  if (type === 'number') {
    const num = Number(rawValue);
    return isNaN(num) ? null : num;
  }

  return rawValue;
}

/**
 * Transforms raw compound data payload into semantic JSON-LD structures with schema definitions
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
            "additional_information": subSchema?.additional_information || "",
            "placeholder": subSchema?.placeholder || "",
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
        "additional_information": schemaNode?.additional_information || "",
        "placeholder": schemaNode?.placeholder || "",
        "type": targetType
      };
    }
  }

  return serializedLd;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rdiId: string }> }
) {
  try {
    const { rdiId } = await params;
    const rdi = getRdiById(rdiId);

    if (!rdi) {
      return NextResponse.json({ error: 'Repository RDI not found' }, { status: 404 });
    }

    const citationFields = rdi.raw?.datasetVersion?.metadataBlocks?.citation?.fields || [];
    const title = extractCitationField(citationFields, 'title') || rdi.id;
    const fairnessRawData = extractFairness(rdi.raw);
    
    // Resolve context using exclusively the FAIRness block definitions
    const fairnessSchema = getFairnessSchemaBlock();
    const cleanFairnessLd = conceptualizeFairnessData(fairnessRawData, fairnessSchema);

    // Modernized schema arrangement with context mappings for extension fields
const jsonLd = {
  "@context": [
    "https://schema.org",
    {
      // Point this directly to your own upcoming schema documentation space
      "fairagro": "https://rdi-fairness-interviews.vercel.app/schema/",
      "fairnessAssessment": "fairagro:fairnessAssessment",
      "metadataStandard": "fairagro:metadataStandard"
    }
  ],
  "@type": "DataRepository",
  "@id": `https://rdi-fairness-interviews.vercel.app/api/resource/repository/${rdiId}/fairness`,
  "url": `https://rdi-fairness-interviews.vercel.app/resource/repository/${rdiId}`,
  "identifier": rdiId,
  "name": title,
  // This can now point to your local schema definition page too!
  "metadataStandard": "https://rdi-fairness-interviews.vercel.app/schema",
  "fairnessAssessment": {
    "@type": "CreativeWork",
    "name": "FAIRness Assessment",
    "description": fairnessSchema?.description || "FAIR Principles implementation assessment",
    ...cleanFairnessLd
  }
};

    return new NextResponse(JSON.stringify(jsonLd), {
      status: 200,
      headers: { 'Content-Type': 'application/ld+json' },
    });
  } catch (error) {
    console.error('API Context Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}