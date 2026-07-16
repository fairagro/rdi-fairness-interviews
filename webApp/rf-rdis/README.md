# rf-rdis

A TypeScript package providing programmatic access to FAIRagro RDI dataset JSON files.

## Installation

Install via npm (after publishing):

```
npm install rf-rdis
```

## Usage


Import and use in your TypeScript/JavaScript project:

```ts
import { getAllRdis, getRdiById, searchRdis, getFairnessById } from 'rf-rdis';

// Get all RDI records
const all = getAllRdis();

// Get a single RDI by its ID
const one = getRdiById('RFId001202604272');

// Search RDIs by a predicate
const found = searchRdis(rdi => rdi.generalInfo?.title?.includes('Soil'));

// Get the FAIRness object for a given RDI ID
const fairness = getFairnessById('RFId001202604272');
console.log(fairness);
```


## API
- `getAllRdis(): Rdi[]` — Returns all RDI objects
- `getRdiById(id: string): Rdi | undefined` — Returns a single RDI by its ID
- `searchRdis(predicate: (rdi: Rdi) => boolean): Rdi[]` — Returns RDIs matching a predicate
- `getFairnessById(id: string): any | undefined` — Returns the FAIRness object for a given RDI ID

## Data
All RDI JSON files are located in the `data/` directory and are loaded at runtime. Each file is named by its RDI ID (e.g., `RFId001202604272.json`).

## Development
- Build the package: `npm run build`
- TypeScript sources are in `src/`
- Output is in `dist/`

## Author
Ata Ul Haleem (<ataulhaleem@gmail.com>)

## License
MIT
