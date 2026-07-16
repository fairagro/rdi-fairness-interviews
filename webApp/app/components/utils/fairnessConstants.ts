// Icon definitions are now managed in iconMap.ts
// Indicators data with FAIR Data Maturity Model mappings

export const FAIRNESS_CRITERIA = [
  { 
    key: '1', 
    label: 'Persistent Identifier',
    icon: 'InfoIcon',
    rdaCode: 'RDA-F1-01D',
    pillar: 'FINDABILITY',
    description: 'Does your service assign persistent identifiers to datasets?'
  },
  { 
    key: '2', 
    label: 'Rich Metadata',
    icon: 'PublicIcon',
    rdaCode: 'RDA-F2-01M',
    pillar: 'FINDABILITY',
    description: 'Does your service provide rich metadata?'
  },
  { 
    key: '3', 
    label: 'Indexed In Search Engines',
    icon: 'SearchIcon',
    rdaCode: 'RDA-F4-01M',
    pillar: 'FINDABILITY',
    description: 'Is your metadata indexed in major search engines?'
  },
  { 
    key: '4', 
    label: 'Metadata Schema',
    icon: 'SchemaIcon',
    rdaCode: 'N/A',
    pillar: 'FINDABILITY',
    description: 'Does your database use formal or standard metadata schemas?'
  },
  { 
    key: '5', 
    label: 'Metadata Persistence',
    icon: 'StorageIcon',
    rdaCode: 'RDA-F1-01M',
    pillar: 'FINDABILITY',
    description: 'Is your metadata persistently available over time?'
  },
  
  { 
    key: '6', 
    label: 'Retrieval Protocol',
    icon: 'CloudDownloadIcon',
    rdaCode: 'RDA-A1-04D',
    pillar: 'ACCESSIBILITY',
    description: 'Is there a standard protocol available for data retrieval?'
  },
  { 
    key: '7', 
    label: 'Authentication Required',
    icon: 'LockIcon',
    rdaCode: 'RDA-A1.2-02D',
    pillar: 'ACCESSIBILITY',
    description: 'Does your database require authentication for data access?'
  },
  { 
    key: '8', 
    label: 'Authentication Type',
    icon: 'VpnKeyIcon',
    rdaCode: 'RDA-A1-04D',
    pillar: 'ACCESSIBILITY',
    description: 'If yes, what type of authentication is used?'
  },
  { 
    key: '9', 
    label: 'Metadata Always Available',
    icon: 'EventAvailableIcon',
    rdaCode: 'RDA-A2-01M',
    pillar: 'ACCESSIBILITY',
    description: 'Is metadata always accessible, even if the data is restricted?'
  },
  { 
    key: '10', 
    label: 'Data Availability',
    icon: 'CloudDoneIcon',
    rdaCode: 'RDA-A1.1-01D',
    pillar: 'ACCESSIBILITY',
    description: 'Is the actual data accessible (open or controlled access)?'
  },
  
  { 
    key: '11', 
    label: 'Knowledge Representation',
    icon: 'HubIcon',
    rdaCode: 'RDA-I1-02M/D',
    pillar: 'INTEROPERABILITY',
    description: 'Do you use formal knowledge representation (e.g., ontologies, RDF)?'
  },
  { 
    key: '12', 
    label: 'Vocabularies Used',
    icon: 'LibraryBooksIcon',
    rdaCode: 'RDA-I2-02M/D',
    pillar: 'INTEROPERABILITY',
    description: 'Do you enforce the use of controlled vocabularies for data submission?'
  },
  { 
    key: '13', 
    label: 'Qualified References',
    icon: 'LinkIcon',
    rdaCode: 'RDA-I3-03M/D',
    pillar: 'INTEROPERABILITY',
    description: 'Do you validate and qualify references (e.g., external IDs) before data submission?'
  },
  { 
    key: '14', 
    label: 'Api Availability',
    icon: 'ApiIcon',
    rdaCode: 'RDA-A1-05D',
    pillar: 'INTEROPERABILITY',
    description: 'Do you provide a dedicated API for data access?'
  },
  { 
    key: '15', 
    label: 'Data Formats',
    icon: 'InsertDriveFileIcon',
    rdaCode: 'RDA-I1-01M',
    pillar: 'INTEROPERABILITY',
    description: 'Do you use standardized data formats in your database or API?'
  },
  
  { 
    key: '16', 
    label: 'License Clarity',
    icon: 'GavelIcon',
    rdaCode: 'RDA-R1.1-01M',
    pillar: 'REUSABILITY',
    description: 'Does your database clearly state licenses for data reuse?'
  },
  { 
    key: '17', 
    label: 'Provenance Info',
    icon: 'HistoryEduIcon',
    rdaCode: 'RDA-R1.2-01M',
    pillar: 'REUSABILITY',
    description: 'Do you provide provenance information?'
  },
  { 
    key: '18', 
    label: 'Community Standards',
    icon: 'GroupsIcon',
    rdaCode: 'RDA-R1.3-01D',
    pillar: 'REUSABILITY',
    description: 'Do your data formats adhere to community standards?'
  },
  { 
    key: '19', 
    label: 'Documentation Quality',
    icon: 'DescriptionIcon',
    rdaCode: 'N/A',
    pillar: 'REUSABILITY',
    description: 'Do you provide documentation for using your database?'
  },
  { 
    key: '20', 
    label: 'Citation Guidelines',
    icon: 'FormatQuoteIcon',
    rdaCode: 'N/A',
    pillar: 'REUSABILITY',
    description: 'Have you clearly stated citation guidelines?'
  },
];
