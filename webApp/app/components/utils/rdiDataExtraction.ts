export interface Rdi {
  id?: string;
  FAIRness?: {
    Findability?: number;
    Accessibility?: number;
    Interoperability?: number;
    Reusability?: number;
    [key: string]: any;
  };
  raw: any;
}

export function extractCitationField(fields: any[], typeName: string) {
  const field = fields.find(f => f.typeName === typeName);
  return field ? field.value : undefined;
}

export function extractCitationDescription(fields: any[]) {
  const field = fields.find(f => f.typeName === 'dsDescription');
  if (field && Array.isArray(field.value) && field.value[0]?.dsDescriptionValue?.value) {
    return field.value[0].dsDescriptionValue.value;
  }
  return '';
}

export function extractFairness(raw: any) {
  const fairagroBlock = raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  if (!fairagroBlock) return undefined;
  const fairagroDataField = fairagroBlock.fields?.find((f: any) => f.typeName === 'MDS_fairagro.fairagroData');
  return fairagroDataField?.value?.FAIRness?.value;
}

export function extractRdiDisplayData(rdi: any) {
  const citationFields = rdi.raw?.datasetVersion?.metadataBlocks?.citation?.fields || [];
  return {
    title: extractCitationField(citationFields, 'title') || rdi.id,
    description: extractCitationDescription(citationFields),
    subject: extractCitationField(citationFields, 'subject') || [],
    FAIRness: extractFairness(rdi.raw),
  };
}

export function extractCollections(raw: any) {
  const fairagroBlock = raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  if (!fairagroBlock || !Array.isArray(fairagroBlock.fields)) return [];
  const collectionsField = fairagroBlock.fields.find((f: any) => f.typeName === 'MDS_fairagro.collections');
  if (!collectionsField || !collectionsField.value) return [];
  const entries = collectionsField.value.collectionEntries?.value || collectionsField.value.collectionEntries;
  if (!entries) return [];
  const entryArr = Array.isArray(entries) ? entries : [entries];
  return entryArr.map((entry: any) => entry.name?.value).filter(Boolean);
}

export function extractDatasetSearchId(raw: any) {
  const fairagroBlock = raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  const targetField = fairagroBlock?.fields?.find(
    (f: any) => f.typeName === 'MDS_fairagro.collections'
  );
  const datasetsSearchCollectionId = targetField?.value?.collectionEntries?.value?.[0]?.datasetsSearchCollectionId?.value;
  return datasetsSearchCollectionId || ''; 
}



export function extractRepositoryUrl(raw: any): string | undefined {
  const fairagroBlock = raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  if (fairagroBlock && Array.isArray(fairagroBlock.fields)) {
    const re3DataField = fairagroBlock.fields.find((f: any) => f.typeName === 'MDS_fairagro.re3Data');
    if (re3DataField && re3DataField.value && typeof re3DataField.value === 'object') {
      return re3DataField.value.repositoryURL?.value;
    }
  }
  return undefined;
}
