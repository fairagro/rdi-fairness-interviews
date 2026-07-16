export function normalizeFairnessValue(val: any): 'yes' | 'no' | 'unknown' {
  if (val === undefined || val === null) return 'unknown';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'unknown';
    return normalizeFairnessValue(val[0]);
  }
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    if (v === 'yes' || v === 'true' || v === 'True') return 'yes';
    if (v === 'no' || v === 'false' || v === 'False') return 'no';
    if (v === 'na' || v === '') return 'unknown';
  }
  if (typeof val === 'boolean') return val ? 'yes' : 'no';
  return 'unknown';
}

export function getFairnessValuesInOrder(fairnessData: any): (string | undefined | null | boolean | number | object)[] {
  if (!fairnessData) return Array(20).fill(undefined);
  const getValues = (pillar: any) => {
    if (!pillar || typeof pillar !== 'object' || !pillar.value) return [];
    return Object.values(pillar.value).map((attr: any) => attr && typeof attr === 'object' && 'value' in attr ? attr.value : undefined);
  };
  return [
    ...getValues(fairnessData.findability),
    ...getValues(fairnessData.accessibility),
    ...getValues(fairnessData.interoperability),
    ...getValues(fairnessData.reusability),
  ].slice(0, 20);
}

export function getFairnessColor(norm: 'yes' | 'no' | 'unknown'): string {
  if (norm === 'yes') return '#6abf5c';
  if (norm === 'no') return '#f26e5f';
  return '#a8a9ad';
}

export function displayValue(val: any): string {
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'boolean') return val ? 'yes' : 'no';
  if (typeof val === 'string') return val;
  return JSON.stringify(val);
}
