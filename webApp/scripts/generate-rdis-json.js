// scripts/generate-rdis-json.js
// Script to generate a lightweight, optimized rdis.json for static frontend use

const fs = require('fs');
const path = require('path');
const { getAllRdis } = require('rf-rdis');

// Only keep the fields actually used by the frontend
function slimRdi(rdi) {
  return {
    id: rdi.id,
    FAIRness: rdi.FAIRness,
    raw: {
      datasetVersion: {
        metadataBlocks: {
          citation: rdi.raw?.datasetVersion?.metadataBlocks?.citation,
          MDS_fairagro: rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro,
        },
      },
    },
  };
}

function main() {
  const allRdis = getAllRdis();
  // Only keep RDIs with a string id
  const filtered = allRdis.filter(rdi => typeof rdi.id === 'string' && rdi.id);
  // Slim down each RDI for performance
  const slimmed = filtered.map(slimRdi);
  // Write to public/rdis.json
  const outPath = path.join(__dirname, '../public/rdis.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(slimmed, null, 2));
  console.log(`Wrote ${slimmed.length} RDIs to ${outPath}`);
}

main();
