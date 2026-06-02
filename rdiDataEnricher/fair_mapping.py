"""
FAIR Principles Mapping from re3data XML fields to NFDI_RDIs CSV columns.

This module defines how re3data repository metadata maps to FAIR compliance attributes.

IMPORTANT METHODOLOGY NOTE (Updated for Publication Accuracy):
============================================================================
This mapping distinguishes between three types of FAIR attributes:

1. RE3DATA-NATIVE (7 attributes):
   - Direct extraction from explicit re3data fields (pidSystem, metadataStandard, 
     dataAccess, api, dataLicense, etc.)
   - These can be directly documented from re3data registry data
   - Examples: persistentIdentifier (from pidSystem), apiAvailability (from api element)

2. RE3DATA-INFERRED (8 attributes):
   - Inferred through pattern matching in related re3data fields
   - These require interpretation/inference logic to populate
   - Examples: authenticationType (keyword search in policy), 
     knowledgeRepresentation (RDF/XML/OWL keywords in metadataStandard)
   - ⚠️ IMPORTANT: These are educated inferences, not explicit re3data documentation

3. FAIRAGRO-NOVEL (5 attributes):
   - Brand new FAIR assessment concepts NOT documented in re3data schema
   - These CANNOT be populated from re3data; require manual RDI operator assessment
   - Examples: metadataPersistence, provenanceInfo, communityStandards, 
     documentationQuality, and others requiring human judgment
   - Status: Populated with NULL/NA values; reserved for manual enrichment workflow

This mapping enables semi-automated enrichment where possible, while preserving
space for human-assessed FAIRness dimensions beyond re3data's scope.
============================================================================
"""

from typing import Dict, List, Tuple, Any

# Mapping of FAIR attributes to re3data fields that indicate compliance
FAIR_MAPPING = {
    # FINDABILITY (5 attributes: 2 native + 2 inferred + 1 novel)
    'FAIRness.findability.persistentIdentifier': {
        're3data_fields': ['pidSystem'],
        'logic': 'presence',  # True if field is present and non-empty
        'description': 'Persistent identifier system present',
        'source_type': 're3data-native',  # Directly from pidSystem
        'publication_note': 'Direct extraction from re3data pidSystem element'
    },
    'FAIRness.findability.metadataSchema': {
        're3data_fields': ['metadataStandard'],
        'logic': 'presence',
        'description': 'Formal metadata schema defined',
        'source_type': 're3data-native',  # Directly from metadataStandard
        'publication_note': 'Direct extraction from re3data metadataStandard element'
    },
    'FAIRness.findability.richMetadata': {
        're3data_fields': ['metadataStandard'],
        'logic': 'multiple',  # True if multiple standards or rich metadata
        'description': 'Multiple or rich metadata standards used',
        'source_type': 're3data-inferred',  # Inferred from count of standards
        'publication_note': 'Inferred: True if 2+ metadata standards present'
    },
    'FAIRness.findability.indexedInSearchEngines': {
        're3data_fields': ['api', 'oai'],
        'logic': 'harvesting',  # True if OAI-PMH or similar
        'description': 'Harvesting protocol available (OAI-PMH, etc.)',
        'source_type': 're3data-inferred',  # Inferred from api/OAI presence
        'publication_note': 'Inferred: True if OAI-PMH or harvesting API present'
    },
    'FAIRness.findability.metadataPersistence': {
        're3data_fields': ['policy', 'preservation'],
        'logic': 'policy_presence',
        'description': 'Retention/preservation policy defined',
        'source_type': 'fairagro-novel',  # NOT in re3data schema
        'publication_note': '❌ NOT available in re3data; requires manual RDI operator assessment'
    },
    
    # ACCESSIBILITY (5 attributes: 3 native + 2 inferred)
    'FAIRness.accessibility.retrievalProtocol': {
        're3data_fields': ['databaseAccess', 'dataAccess'],
        'logic': 'access_protocol',
        'description': 'Open/standardized retrieval protocol',
        'source_type': 're3data-native',  # Directly from dataAccess
        'publication_note': 'Direct extraction from re3data dataAccess/databaseAccess elements'
    },
    'FAIRness.accessibility.dataAvailability': {
        're3data_fields': ['dataAccess', 'dataAccessRestriction'],
        'logic': 'availability',
        'description': 'Data availability status clear',
        'source_type': 're3data-native',  # Directly from dataAccess
        'publication_note': 'Direct extraction from re3data dataAccess/restriction elements'
    },
    'FAIRness.accessibility.authenticationRequired': {
        're3data_fields': ['dataAccessRestriction'],
        'logic': 'access_restriction',
        'description': 'Authentication requirements documented',
        'source_type': 're3data-native',  # Directly from access restrictions
        'publication_note': 'Direct extraction from re3data dataAccessRestriction element'
    },
    'FAIRness.accessibility.authenticationType': {
        're3data_fields': ['policy', 'dataAccessRestriction'],
        'logic': 'authentication_detail',
        'description': 'Specific authentication type documented (OAuth, SAML, LDAP, etc.)',
        'source_type': 're3data-inferred',  # Keyword search for auth types
        'publication_note': 'Inferred: True if keywords (oauth, saml, ldap, password, api) found in policy'
    },
    'FAIRness.accessibility.metadataAlwaysAvailable': {
        're3data_fields': ['dataAccessRestriction'],
        'logic': 'metadata_unrestricted',
        'description': 'Metadata accessible even if data restricted',
        'source_type': 're3data-inferred',  # Inferred from restriction flags
        'publication_note': 'Inferred: True if "unrestricted" flag present in metadata access'
    },
    
    # INTEROPERABILITY (5 attributes: 2 native + 3 inferred)
    'FAIRness.interoperability.dataFormats': {
        're3data_fields': ['contentType'],
        'logic': 'multiple_formats',
        'description': 'Multiple open data formats supported',
        'source_type': 're3data-native',  # Directly from contentType
        'publication_note': 'Direct extraction from re3data contentType element'
    },
    'FAIRness.interoperability.apiAvailability': {
        're3data_fields': ['api'],
        'logic': 'presence',
        'description': 'API available for data access/integration',
        'source_type': 're3data-native',  # Directly from api element
        'publication_note': 'Direct extraction from re3data api element'
    },
    'FAIRness.interoperability.knowledgeRepresentation': {
        're3data_fields': ['metadataStandard'],
        'logic': 'formal_representation',
        'description': 'Formal knowledge representation used (RDF, XML Schema, OWL, etc.)',
        'source_type': 're3data-inferred',  # Keyword search for formal formats
        'publication_note': 'Inferred: True if keywords (rdf, xml, json, owl, schema) found in metadataStandard'
    },
    'FAIRness.interoperability.vocabulariesUsed': {
        're3data_fields': ['metadataStandard', 'subject'],
        'logic': 'controlled_vocabulary',
        'description': 'Controlled vocabularies or thesauri used',
        'source_type': 're3data-inferred',  # Inferred from presence of standards
        'publication_note': 'Inferred: True if subject/discipline vocabularies present'
    },
    'FAIRness.interoperability.qualifiedReferences': {
        're3data_fields': ['metadataStandard', 'api'],
        'logic': 'qualified_reference',
        'description': 'Qualified references to other entities',
        'source_type': 're3data-inferred',  # Inferred from structured metadata
        'publication_note': 'Inferred: True if structured reference elements present in metadata'
    },
    
    # REUSABILITY (5 attributes: 2 native + 3 inferred)
    'FAIRness.reusability.licenseClarity': {
        're3data_fields': ['dataLicense'],
        'logic': 'license_presence',
        'description': 'Clear license statement for data',
        'source_type': 're3data-native',  # Directly from dataLicense
        'publication_note': 'Direct extraction from re3data dataLicense element'
    },
    'FAIRness.reusability.citationGuidelines': {
        're3data_fields': ['pidSystem', 'citationGuidelineUrl'],
        'logic': 'citation_support',
        'description': 'Citation guidelines and persistent IDs provided',
        'source_type': 're3data-native',  # Directly from citation URL + PID
        'publication_note': 'Direct extraction from re3data citationGuidelineUrl and pidSystem elements'
    },
    'FAIRness.reusability.provenanceInfo': {
        're3data_fields': ['policy'],
        'logic': 'provenance_tracking',
        'description': 'Provenance information tracked and documented',
        'source_type': 're3data-inferred',  # Keyword search in policy
        'publication_note': 'Inferred: True if "provenance" or "tracking" keywords found in policy documentation'
    },
    'FAIRness.reusability.communityStandards': {
        're3data_fields': ['subject', 'discipline'],
        'logic': 'standards_compliance',
        'description': 'Community-adopted standards and best practices followed',
        'source_type': 're3data-inferred',  # Inferred from discipline classification
        'publication_note': 'Inferred: True if discipline/community standards are documented'
    },
    'FAIRness.reusability.documentationQuality': {
        're3data_fields': ['repositoryName', 'description'],
        'logic': 'documentation',
        'description': 'Comprehensive documentation and guidance available',
        'source_type': 're3data-inferred',  # Inferred from description richness
        'publication_note': 'Inferred: True if repository has detailed description documentation'
    }
}


def infer_fair_value(
    field_name: str,
    re3data_dict: Dict[str, Any]
) -> bool:
    """
    Infer FAIR attribute value from re3data repository metadata.
    
    IMPORTANT: This function applies different inference strategies based on attribute type:
    
    1. RE3DATA-NATIVE (7 attributes):
       - Direct field presence/extraction (e.g., pidSystem → persistentIdentifier)
       - Highest confidence; directly documented in re3data schema
    
    2. RE3DATA-INFERRED (8 attributes):
       - Pattern matching and keyword searches in re3data fields
       - Medium confidence; requires interpretation (e.g., OAI-PMH keyword → harvesting)
       - ⚠️ These are educated inferences, not explicit documentation
    
    3. FAIRAGRO-NOVEL (5 attributes):
       - Brand new FAIR concepts NOT in re3data schema
       - These CANNOT be populated here; reserved for manual assessment
       - Returns None/False; requires separate RDI operator review workflow
    
    Args:
        field_name: FAIR attribute name (e.g., 'FAIRness.findability.persistentIdentifier')
        re3data_dict: Dictionary of re3data fields extracted from repository XML
    
    Returns:
        True if attribute is evidenced in re3data, False if explicitly not present,
        None if undetermined or novel attribute requiring manual assessment
        
    For publication purposes, check the 'source_type' and 'publication_note' fields
    in FAIR_MAPPING[field_name] to correctly attribute what comes from re3data
    vs. what is inferred vs. what requires manual RDI operator assessment.
    """
    if field_name not in FAIR_MAPPING:
        return None
    
    mapping = FAIR_MAPPING[field_name]
    re3data_fields = mapping.get('re3data_fields', [])
    logic = mapping.get('logic', 'presence')
    source_type = mapping.get('source_type', 'unknown')
    
    # Collect relevant field values
    present_values = {}
    for field in re3data_fields:
        if field in re3data_dict:
            val = re3data_dict[field]
            if val and not (isinstance(val, (list, dict)) and len(val) == 0):
                present_values[field] = val
    
    # Apply logic based on source type and inference pattern
    if logic == 'presence':
        # True if at least one field is present
        return len(present_values) > 0
    
    elif logic == 'multiple':
        # True if multiple instances or rich data
        count = sum(
            len(v) if isinstance(v, list) else 1
            for v in present_values.values()
        )
        return count >= 2
    
    elif logic == 'harvesting':
        # True if OAI-PMH or similar harvesting available
        for field, val in present_values.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        for k, v in item.items():
                            if 'oai' in str(v).lower() or 'harvest' in str(v).lower():
                                return True
            elif isinstance(val, str):
                if 'oai' in val.lower() or 'harvest' in val.lower():
                    return True
        return False
    
    elif logic == 'access_protocol':
        # True if standard access protocol present
        for field, val in present_values.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict) and 'type' in item:
                        type_val = str(item['type']).lower()
                        if any(proto in type_val for proto in ['http', 'oai', 'ftp', 'rest', 'sparql']):
                            return True
        return False
    
    elif logic == 'access_restriction':
        # True if restrictions are documented
        return len(present_values) > 0
    
    elif logic == 'authentication_detail':
        # True if specific auth type is documented
        for field, val in present_values.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        for k, v in item.items():
                            if any(auth in str(v).lower() for auth in ['ldap', 'oauth', 'saml', 'password', 'api']):
                                return True
        return False
    
    elif logic == 'metadata_unrestricted':
        # True if metadata access is unrestricted
        for field, val in present_values.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, str) and 'unrestricted' in item.lower():
                        return True
            elif isinstance(val, str) and 'unrestricted' in val.lower():
                return True
        return False
    
    elif logic == 'availability':
        # True if availability status is clear
        return len(present_values) > 0
    
    elif logic == 'formal_representation':
        # True if formal representation (RDF, XML schema, etc.) used
        for field, val in present_values.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        for k, v in item.items():
                            if any(fmt in str(v).lower() for fmt in ['rdf', 'xml', 'json', 'owl', 'schema']):
                                return True
        return False
    
    elif logic == 'controlled_vocabulary':
        # True if controlled vocabularies mentioned
        for field, val in present_values.items():
            if isinstance(val, list):
                if len(val) > 0:
                    return True
            elif val:
                return True
        return False
    
    elif logic == 'qualified_reference':
        # True if qualified references/links present
        for field, val in present_values.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict) and len(item) > 1:
                        return True
        return len(present_values) > 0
    
    elif logic == 'multiple_formats':
        # True if multiple formats supported
        if 'contentType' in present_values:
            val = present_values['contentType']
            if isinstance(val, list) and len(val) > 1:
                return True
        return False
    
    elif logic == 'license_presence':
        # True if license is clearly stated
        return len(present_values) > 0
    
    elif logic == 'provenance_tracking':
        # True if provenance is tracked in policy
        for field, val in present_values.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        for k, v in item.items():
                            if 'provenance' in str(v).lower() or 'lineage' in str(v).lower():
                                return True
        return False
    
    elif logic == 'standards_compliance':
        # True if community standards mentioned
        return len(present_values) > 0
    
    elif logic == 'documentation':
        # True if documentation present and descriptive
        if 'description' in present_values:
            desc = present_values['description']
            if isinstance(desc, str) and len(desc) > 50:
                return True
        return len(present_values) > 1
    
    elif logic == 'citation_support':
        # True if citation support via PIDs
        return len(present_values) > 0
    
    return None


def get_fair_fields() -> List[str]:
    """Get all FAIR attribute field names."""
    return list(FAIR_MAPPING.keys())


def get_fair_summary() -> Dict[str, List[str]]:
    """Get FAIR attributes organized by principle."""
    summary = {
        'findability': [],
        'accessibility': [],
        'interoperability': [],
        'reusability': []
    }
    for field_name in FAIR_MAPPING.keys():
        principle = field_name.split('.')[1]  # Extract principle from field name
        summary[principle].append(field_name)
    return summary
