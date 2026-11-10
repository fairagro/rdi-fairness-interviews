"""
FAIR metric values derived from re3data records (registry-derived profiles).

Revision of 2026-11-05 (manuscript revision, Reviewer 2 #8, Reviewer 3 #3/#4):

Scoring policy for every metric
-------------------------------
  True            the re3data element that carries the evidence is present and satisfies the rule
                  (compliance supported by evidence)
  False           the element is present but does not satisfy the rule, or carries an explicit
                  negative value such as pidSystem = "none" (non-compliance supported by evidence)
  None            the element is absent from the record, or the metric is not represented in the
                  re3data schema at all  ->  "not assessed": the cell stays empty and the metric is
                  excluded from every denominator. Absence of evidence is never scored as non-compliance.
  NOT_APPLICABLE  conditional metric that does not apply to the repository (authentication type for a
                  repository that uses no authentication for data access); excluded from denominators.

Provenance classes (source_type)
--------------------------------
  re3data-native    the value is read from a re3data element whose meaning coincides with the metric
                    (pidSystem, metadataStandard, api, databaseAccess, dataAccess, dataLicense,
                    citationGuidelineURL)
  re3data-inferred  the value is a heuristic on a present element (count of standards, keyword match,
                    API type); the heuristic is stated in `rule`
  fairagro-novel    the property is not represented in the re3data schema; only an operator interview
                    can provide it. Always None here.

Earlier versions of this module scored several metrics as False when the relevant element was simply
absent (retrieval protocol, metadata availability, provenance, ...) and inferred four properties from
elements that do not carry them (the registry's own subject classification, the length of the
description). Those rules were removed; see the manuscript's Supplementary Table 5.
"""

from typing import Dict, List, Tuple, Any, Optional, Union

# Third assessment state, written literally into the CSV and the JSON records.
NOT_APPLICABLE = "not applicable"

# re3data dataAccessRestriction values that document an authentication/authorisation
# procedure with a named, standard mechanism (registered account, institutional login).
NAMED_AUTH_RESTRICTIONS = {"registration", "institutional membership"}

# re3data apiType values that denote a standardised retrieval protocol.
STANDARD_API_TYPES = {"rest", "oai-pmh", "ftp", "sparql", "soap", "opendap", "netcdf", "sword", "ogc"}

# Keywords in a metadata standard's name that imply a formal, machine-readable representation.
FORMAL_REPRESENTATION_KEYWORDS = ("rdf", "owl", "xml", "json", "schema", "data cube", "skos")


FAIR_MAPPING = {
    # FINDABILITY
    'FAIRness.findability.persistentIdentifier': {
        're3data_fields': ['pidSystem'], 'logic': 'pid_system', 'source_type': 're3data-native',
        'description': 'Persistent identifiers assigned to datasets',
        'rule': 'met if pidSystem names at least one identifier system other than "none" (DOI, hdl, URN, ARK, PURL, IGSN, other); '
                'not met if pidSystem is "none"; not assessed if the element is absent',
    },
    'FAIRness.findability.metadataSchema': {
        're3data_fields': ['metadataStandard'], 'logic': 'standard_present', 'source_type': 're3data-native',
        'description': 'Formal or standard metadata schema used',
        'rule': 'met if at least one metadataStandard is named; not met if the only value is "none"; not assessed if the element is absent',
    },
    'FAIRness.findability.richMetadata': {
        're3data_fields': ['metadataStandard'], 'logic': 'standard_count', 'source_type': 're3data-inferred',
        'description': 'Rich descriptive metadata (proxy: more than one metadata standard)',
        'rule': 'met if two or more metadataStandard elements are named; not met if exactly one; not assessed if the element is absent',
    },
    'FAIRness.findability.indexedInSearchEngines': {
        're3data_fields': ['api'], 'logic': 'harvesting_api', 'source_type': 're3data-inferred',
        'description': 'Metadata harvestable by discovery services (proxy: OAI-PMH interface)',
        'rule': 'met if an api element of type OAI-PMH is listed; not met if api elements are listed but none is OAI-PMH; not assessed if no api element',
    },
    'FAIRness.findability.metadataPersistence': {
        're3data_fields': [], 'logic': 'not_represented', 'source_type': 'fairagro-novel',
        'description': 'Metadata guaranteed to remain available after the data are gone',
        'rule': 'not represented in the re3data schema; always not assessed',
    },

    # ACCESSIBILITY
    'FAIRness.accessibility.retrievalProtocol': {
        're3data_fields': ['api'], 'logic': 'standard_api', 'source_type': 're3data-native',
        'description': 'Standardised protocol for data retrieval',
        'rule': 'met if an api element of a standard type is listed (REST, OAI-PMH, FTP, SPARQL, SOAP, OPeNDAP, NetCDF, SWORD, OGC); '
                'not met if api elements are listed but all are of type "other"; not assessed if no api element',
    },
    'FAIRness.accessibility.dataAvailability': {
        're3data_fields': ['dataAccessEntries'], 'logic': 'data_access_documented', 'source_type': 're3data-native',
        'description': 'Data retrievable through a documented open or controlled mechanism',
        'rule': 'met if a dataAccess type open, embargoed or restricted is documented; not met if the only type is closed; not assessed if no dataAccess element',
    },
    'FAIRness.accessibility.authenticationRequired': {
        're3data_fields': ['dataAccessEntries'], 'logic': 'access_regime', 'source_type': 're3data-native',
        'description': 'Access regime appropriate to the data (RDA-A1.2-01D, conditional)',
        'rule': 'met if an open or embargoed dataAccess type is documented, or a restricted type carries a registration or '
                'institutional-membership restriction; not assessed if only restricted or closed tiers without a documented procedure exist',
    },
    'FAIRness.accessibility.authenticationType': {
        're3data_fields': ['dataAccessEntries'], 'logic': 'authentication_mechanism', 'source_type': 're3data-native',
        'description': 'Named standard authentication mechanism where authentication is used',
        'rule': 'met if a restricted or closed tier carries a registration or institutional-membership restriction; '
                'not applicable if no restricted or closed tier exists; not assessed if such a tier exists but the mechanism is not named',
    },
    'FAIRness.accessibility.metadataAlwaysAvailable': {
        're3data_fields': ['databaseAccess'], 'logic': 'database_open', 'source_type': 're3data-native',
        'description': 'Metadata accessible irrespective of data access restrictions',
        'rule': 'met if databaseAccess type is open; not met if restricted or closed; not assessed if the element is absent',
    },

    # INTEROPERABILITY
    'FAIRness.interoperability.dataFormats': {
        're3data_fields': ['contentType'], 'logic': 'content_type_count', 'source_type': 're3data-inferred',
        'description': 'Standardised data formats (proxy: more than one content type)',
        'rule': 'met if two or more contentType elements are listed; not met if exactly one; not assessed if the element is absent',
    },
    'FAIRness.interoperability.apiAvailability': {
        're3data_fields': ['api'], 'logic': 'api_present', 'source_type': 're3data-native',
        'description': 'Dedicated API for data access',
        'rule': 'met if at least one api element is listed; not assessed if the element is absent',
    },
    'FAIRness.interoperability.knowledgeRepresentation': {
        're3data_fields': ['metadataStandard'], 'logic': 'formal_representation', 'source_type': 're3data-inferred',
        'description': 'Formal, machine-readable knowledge representation (proxy: name of a listed standard)',
        'rule': 'met if a named metadataStandard implies a formal representation (name contains RDF, OWL, XML, JSON, Schema, Data Cube or SKOS); '
                'not met if standards are named but none does; not assessed if the element is absent',
    },
    'FAIRness.interoperability.vocabulariesUsed': {
        're3data_fields': [], 'logic': 'not_represented', 'source_type': 'fairagro-novel',
        'description': 'Controlled vocabularies enforced at submission',
        'rule': 'not represented in the re3data schema (the registry records its own subject classification, not the repository\'s vocabularies); always not assessed',
    },
    'FAIRness.interoperability.qualifiedReferences': {
        're3data_fields': [], 'logic': 'not_represented', 'source_type': 'fairagro-novel',
        'description': 'Qualified references validated at submission',
        'rule': 'not represented in the re3data schema; always not assessed',
    },

    # REUSABILITY
    'FAIRness.reusability.licenseClarity': {
        're3data_fields': ['dataLicense'], 'logic': 'license_present', 'source_type': 're3data-native',
        'description': 'Clear reuse licence for the data',
        'rule': 'met if at least one dataLicense is named; not met if the only value is "none"; not assessed if the element is absent',
    },
    'FAIRness.reusability.citationGuidelines': {
        're3data_fields': ['citationGuidelineUrl'], 'logic': 'citation_url', 'source_type': 're3data-native',
        'description': 'Explicit guidance on how to cite data',
        'rule': 'met if a citationGuidelineURL is given; not assessed if the element is absent',
    },
    'FAIRness.reusability.provenanceInfo': {
        're3data_fields': [], 'logic': 'not_represented', 'source_type': 'fairagro-novel',
        'description': 'Provenance information tracked and documented',
        'rule': 'not represented in the re3data schema (policy documents are listed by name only); always not assessed',
    },
    'FAIRness.reusability.communityStandards': {
        're3data_fields': [], 'logic': 'not_represented', 'source_type': 'fairagro-novel',
        'description': 'Data comply with community-adopted standards',
        'rule': 'not represented in the re3data schema; always not assessed (the metadataStandard element documents metadata '
                'standards, RDA-R1.3-01M, which metric 4 already reads; it carries no information on the standards the data follow, RDA-R1.3-01D)',
    },
    'FAIRness.reusability.documentationQuality': {
        're3data_fields': [], 'logic': 'not_represented', 'source_type': 'fairagro-novel',
        'description': 'User documentation of the repository',
        'rule': 'not represented in the re3data schema; always not assessed',
    },
}


def infer_authentication(entries: List[Dict[str, Any]]) -> Tuple[Optional[bool], Optional[Union[bool, str]]]:
    """
    Conditional authentication rule for registry-derived profiles (RDA-A1.2-01D).

    `entries` is the list of re3data <dataAccess> elements as {'type': str, 'restrictions': [str]}
    (built by Re3DataEnricher.parse_repository_xml as 'dataAccessEntries').

    Returns (metric 7 'authenticationRequired', metric 8 'authenticationType'):
      metric 7: True  - an open or embargoed data-access type exists (open data need no
                        authentication), or a restricted type carries a registration /
                        institutional-membership restriction (protected data reachable through
                        an authentication and authorisation procedure);
                None  - no data-access entry, or only restricted/closed tiers whose procedure
                        is not documented (fee, other, unspecified): not assessed.
      metric 8: True  - a registration / institutional-membership restriction is documented
                        (named standard mechanism);
                NOT_APPLICABLE - no restricted or closed tier: authentication is not used for
                        data access, so the metric is not applicable (excluded from the denominator);
                None  - a restricted/closed tier exists but the mechanism is not named: not assessed.
    """
    types = {str(e.get('type', '')).strip().lower() for e in entries if e.get('type')}
    restrictions = {str(r).strip().lower() for e in entries for r in e.get('restrictions', []) if str(r).strip()}
    if not types:
        return None, None
    has_open = bool(types & {'open', 'embargoed'})
    has_protected = bool(types & {'restricted', 'closed'})
    named_mechanism = bool(restrictions & NAMED_AUTH_RESTRICTIONS)

    if named_mechanism and has_protected:
        metric7: Optional[bool] = True
    elif has_open:
        metric7 = True
    else:
        metric7 = None

    if not has_protected:
        metric8: Optional[Union[bool, str]] = NOT_APPLICABLE
    elif named_mechanism:
        metric8 = True
    else:
        metric8 = None
    return metric7, metric8


def _as_list(val: Any) -> List[Any]:
    if val is None:
        return []
    if isinstance(val, list):
        return [v for v in val if v not in (None, '', {}, [])]
    if isinstance(val, dict):
        return [val] if val else []
    return [val] if str(val).strip() else []


def _texts(val: Any) -> List[str]:
    """Flatten a re3data element (str / dict with 'text' / list of either) into its text values."""
    out = []
    for item in _as_list(val):
        if isinstance(item, dict):
            t = item.get('text', '')
            if isinstance(t, str) and t.strip():
                out.append(t.strip())
            else:
                for v in item.values():
                    if isinstance(v, str) and v.strip() and v is not t:
                        out.append(v.strip())
        else:
            out.append(str(item).strip())
    return [o for o in out if o]


def _api_types(re3data_dict: Dict[str, Any]) -> Optional[List[str]]:
    """Lower-cased apiType values, or None if the record carries no api element."""
    if 'api' not in re3data_dict or not _as_list(re3data_dict.get('api')):
        return None
    types = []
    for item in _as_list(re3data_dict.get('api')):
        if isinstance(item, dict):
            t = item.get('apiType', '')
            if isinstance(t, dict):
                t = t.get('text', '')
            types.append(str(t).strip().lower())
        else:
            types.append(str(item).strip().lower())
    return types


def _standard_names(re3data_dict: Dict[str, Any]) -> Optional[List[str]]:
    """Names of the listed metadata standards, or None if the record carries no metadataStandard element."""
    if 'metadataStandard' not in re3data_dict or not _as_list(re3data_dict.get('metadataStandard')):
        return None
    names = re3data_dict.get('metadataStandardNames')
    if not names:
        names = _texts(re3data_dict.get('metadataStandard'))
    return [str(n).strip() for n in names if str(n).strip()]


def infer_fair_value(field_name: str, re3data_dict: Dict[str, Any]) -> Optional[Union[bool, str]]:
    """
    Registry-derived value of one metric (see module docstring for the policy).

    Returns True / False / None (not assessed) / NOT_APPLICABLE.
    """
    if field_name not in FAIR_MAPPING:
        return None
    logic = FAIR_MAPPING[field_name]['logic']

    if logic == 'not_represented':
        return None

    if logic == 'pid_system':
        vals = [v.lower() for v in _texts(re3data_dict.get('pidSystem'))]
        if not vals:
            return None
        return any(v != 'none' for v in vals)

    if logic == 'standard_present':
        names = _standard_names(re3data_dict)
        if names is None:
            return None
        return any(n.lower() != 'none' for n in names)

    if logic == 'standard_count':
        names = _standard_names(re3data_dict)
        if names is None:
            return None
        return len([n for n in names if n.lower() != 'none']) >= 2

    if logic == 'formal_representation':
        names = _standard_names(re3data_dict)
        if names is None:
            return None
        return any(k in n.lower() for n in names for k in FORMAL_REPRESENTATION_KEYWORDS)

    if logic == 'harvesting_api':
        types = _api_types(re3data_dict)
        if types is None:
            return None
        return any('oai' in t for t in types)

    if logic == 'standard_api':
        types = _api_types(re3data_dict)
        if types is None:
            return None
        return any(t in STANDARD_API_TYPES or t.startswith('oai') for t in types)

    if logic == 'api_present':
        types = _api_types(re3data_dict)
        return None if types is None else True

    if logic == 'data_access_documented':
        entries = re3data_dict.get('dataAccessEntries') or []
        types = {str(e.get('type', '')).strip().lower() for e in entries if e.get('type')}
        if not types:
            return None
        return bool(types & {'open', 'embargoed', 'restricted'})

    if logic == 'access_regime':
        return infer_authentication(re3data_dict.get('dataAccessEntries') or [])[0]

    if logic == 'authentication_mechanism':
        return infer_authentication(re3data_dict.get('dataAccessEntries') or [])[1]

    if logic == 'database_open':
        vals = [v.lower() for v in _texts(re3data_dict.get('databaseAccess'))]
        if not vals:
            return None
        return 'open' in vals

    if logic == 'content_type_count':
        vals = _texts(re3data_dict.get('contentType'))
        if not vals:
            return None
        return len(vals) >= 2

    if logic == 'license_present':
        vals = [v.lower() for v in _texts(re3data_dict.get('dataLicense'))]
        if not vals:
            return None
        return any(v != 'none' for v in vals)

    if logic == 'citation_url':
        vals = _texts(re3data_dict.get('citationGuidelineUrl', re3data_dict.get('citationGuidelineURL')))
        return True if vals else None

    return None


def get_fair_fields() -> List[str]:
    """All FAIR metric field names, in CSV column order."""
    return list(FAIR_MAPPING.keys())


def get_fair_summary() -> Dict[str, List[str]]:
    """FAIR metric field names grouped by principle."""
    summary = {'findability': [], 'accessibility': [], 'interoperability': [], 'reusability': []}
    for field_name in FAIR_MAPPING.keys():
        summary[field_name.split('.')[1]].append(field_name)
    return summary
