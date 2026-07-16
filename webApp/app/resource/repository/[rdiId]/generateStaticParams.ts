import { getAllRdis } from 'rf-rdis';

// Fixed: Changed from "export default" to a named "export"
export function generateStaticParams() {
  // Return all RDI IDs for static generation
  return getAllRdis().map(rdi => ({ rdiId: rdi.id }));
}