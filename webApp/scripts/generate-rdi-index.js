// This script generates a static index.json file listing all RDI IDs for use in static export
// Run this script before next export to keep the index up to date
const fs = require('fs');
const path = require('path');

const repoDir = path.join(__dirname, '../../resource/repository');
const outFile = path.join(repoDir, 'index.json');

const ids = fs.readdirSync(repoDir)
  .filter(name => /^RFId\d+/.test(name) && fs.statSync(path.join(repoDir, name)).isDirectory());

fs.writeFileSync(outFile, JSON.stringify(ids, null, 2));
console.log(`Wrote ${ids.length} RDI IDs to ${outFile}`);
