// Utility to load all RDI JSONs from /resource/repository for static export
export async function fetchAllRdis(): Promise<any[]> {
  // This assumes the static site is hosted at the root and /resource/repository/[id]/[id].txt is accessible
  // You may want to cache this in production
  const indexRes = await fetch('/resource/repository/index.json');
  if (!indexRes.ok) throw new Error('Failed to load RDI index');
  const index: string[] = await indexRes.json();
  // index is an array of RDI IDs
  const rdiPromises = index.map(async (id) => {
    const res = await fetch(`/resource/repository/${id}/${id}.txt`);
    if (!res.ok) return null;
    try {
      return { id, raw: await res.json() };
    } catch {
      return null;
    }
  });
  const rdis = await Promise.all(rdiPromises);
  return rdis.filter(Boolean);
}

// Utility to fetch a single RDI by id
export async function fetchRdiById(id: string): Promise<any | null> {
  try {
    const res = await fetch(`/resource/repository/${id}/${id}.txt`);
    if (!res.ok) return null;
    return { id, raw: await res.json() };
  } catch {
    return null;
  }
}
