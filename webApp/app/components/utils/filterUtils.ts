import { Rdi, extractCollections } from './rdiDataExtraction';

export function getUniqueDomains(rdis: Rdi[]): (string | undefined)[] {
  return Array.from(new Set(rdis.map(rdi => rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro?.fields?.find((f: any) => f.typeName === 'MDS_fairagro.domain')?.value).filter(Boolean)));
}

export function getUniqueSubjects(rdis: Rdi[]): string[] {
  const subjects = rdis.flatMap(rdi => {
    const citationFields = rdi.raw?.datasetVersion?.metadataBlocks?.citation?.fields || [];
    const subjectField = citationFields.find((f: any) => f.typeName === 'subject');
    return subjectField && Array.isArray(subjectField.value) ? subjectField.value : [];
  });
  return Array.from(new Set(subjects)).filter(Boolean) as string[];
}

export function getUniqueCollections(rdis: Rdi[]): string[] {
  const collections = rdis.flatMap(rdi => {
    return extractCollections(rdi.raw);
  });
  return Array.from(new Set(collections)).filter(Boolean) as string[];
}

export function filterRdis(
  rdis: Rdi[],
  selectedDomains: string[],
  selectedSubjects: string[],
  selectedCollections: string[],
  searchQuery: string
): Rdi[] {
  return rdis.filter((rdi: Rdi) => {
    const domain = rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro?.fields?.find((f: any) => f.typeName === 'MDS_fairagro.domain')?.value;
    const citationFields = rdi.raw?.datasetVersion?.metadataBlocks?.citation?.fields || [];
    const subjectField = citationFields.find((f: any) => f.typeName === 'subject');
    const rdiSubjects = subjectField && Array.isArray(subjectField.value) ? subjectField.value : [];
    const rdiCollections = extractCollections(rdi.raw);
    const title = citationFields.find((f: any) => f.typeName === 'title')?.value || rdi.id;

    const searchable = [
      title,
      rdi.id,
      ...rdiSubjects,
      ...rdiCollections,
      ...Object.values(rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro?.fields || {}).flatMap((f: any) => {
        if (typeof f.value === 'string') return [f.value];
        if (Array.isArray(f.value)) return f.value;
        if (typeof f.value === 'object' && f.value !== null) return Object.values(f.value).map((v: any) => typeof v === 'string' ? v : '');
        return [];
      }),
      ...Object.values(rdi.raw?.datasetVersion?.metadataBlocks?.citation?.fields || {}).flatMap((f: any) => {
        if (typeof f.value === 'string') return [f.value];
        if (Array.isArray(f.value)) return f.value;
        if (typeof f.value === 'object' && f.value !== null) return Object.values(f.value).map((v: any) => typeof v === 'string' ? v : '');
        return [];
      })
    ].join(' ').toLowerCase();

    const matchesDomain = selectedDomains.length === 0 || (domain && selectedDomains.includes(domain));
    const matchesSubject = selectedSubjects.length === 0 || rdiSubjects.some((s: string) => selectedSubjects.includes(s));
    const matchesCollection = selectedCollections.length === 0 || rdiCollections.some((c: string) => selectedCollections.includes(c));
    const matchesSearch = searchQuery === '' || searchable.includes(searchQuery.toLowerCase());

    return matchesDomain && matchesSubject && matchesCollection && matchesSearch;
  });
}
