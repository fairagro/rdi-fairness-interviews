import pandas as pd
import httpx
import json
import time
from typing import Dict, Any, Optional, List, Tuple
from lxml import etree
import urllib.parse
from .fair_mapping import infer_fair_value, get_fair_fields
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Re3DataEnricher:
    """Enriches RDI records using re3data.org API."""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.original_df = self.df.copy()
        self.cache_file = 'enrichment_cache.json'
        self.api_cache = {}
        self.load_cache()
        self.BASE_URL = "https://www.re3data.org/api/beta/repositories"
        self.all_repos = {}
        self.namespaces = {"r3d": "http://www.re3data.org/schema/2-2"}
        msg = f"✓ Using provided DataFrame with {len(self.df)} infrastructure records"
        logger.info(msg)
        print(msg)

    def load_cache(self):
        """Load API response cache."""
        try:
            with open(self.cache_file, 'r') as f:
                self.api_cache = json.load(f)
                msg = f"✓ Loaded cache with {len(self.api_cache)} entries"
                logger.info(msg)
                print(msg)
        except FileNotFoundError:
            self.api_cache = {}

    def save_cache(self):
        """Save API response cache."""
        with open(self.cache_file, 'w') as f:
            json.dump(self.api_cache, f, indent=2)

    def fetch_repository_listing(self) -> Dict[str, str]:
        """
        Fetch list of all repositories from re3data API.
        Returns dict mapping repo ID to actual repository URL.
        Uses XPath to extract href attributes from listing XML (matching working approach).
        """
        msg = "Fetching repository listing from re3data API..."
        logger.info(msg)
        print(msg)
        try:
            response = httpx.get(self.BASE_URL, timeout=60)
            response.raise_for_status()
            tree = etree.fromstring(response.content)
            
            # Extract all href attributes from the XML - these are the actual repo URLs
            all_repos = {}
            for href in tree.xpath("//@href"):
                # Extract repo ID from the URL (last component)
                repo_id = href.split('/')[-1]
                # Map repo ID to the full repository URL
                all_repos[repo_id] = href
            
            msg = f"✓ Found {len(all_repos)} repositories in re3data"
            logger.info(msg)
            print(msg)
            self.all_repos = all_repos
            return all_repos
        except httpx.RequestError as e:
            msg = f"✗ Error fetching repository listing: {e}"
            logger.error(msg)
            print(msg)
            return {}
        except Exception as e:
            msg = f"✗ Error parsing repository listing: {e}"
            logger.error(msg)
            print(msg)
            return {}

    def search_by_identifier(self, identifier: str) -> Optional[str]:
        """
        Search for repository by re3data identifier (e.g., 'r3d100012345').
        Returns the repository ID if found.
        """
        if not identifier or not str(identifier).startswith('r3d'):
            return None
        
        repo_id = str(identifier).strip()
        if repo_id in self.all_repos:
            return repo_id
        
        return None

    def search_by_name(self, name: str) -> Optional[str]:
        """
        Search for repository by name in re3data.
        Uses fuzzy matching to find best match.
        """
        if not name or not isinstance(name, str):
            return None
        
        name = name.strip().lower()
        if not name:
            return None
        
        # First try to find exact or close match in all_repos metadata
        for repo_id, repo_url in self.all_repos.items():
            try:
                if repo_id in self.api_cache:
                    repo_data = self.api_cache[repo_id]
                else:
                    repo_data = self.fetch_repository_xml(repo_id)
                    if not repo_data:
                        continue
                
                # Extract repository name from XML
                repo_name = self._extract_repository_name(repo_data)
                if repo_name and name in repo_name.lower():
                    return repo_id
            except Exception as e:
                logger.debug(f"Error searching {repo_id}: {e}")
                continue
        
        return None

    def fetch_repository_xml(self, repo_id: str) -> Optional[str]:
        """
        Fetch repository XML from re3data API using the actual URL from listing.
        Uses cache to avoid repeated requests.
        Uses the URL extracted from the listing, not a constructed URL.
        """
        if not repo_id:
            return None
        
        # Check cache first
        if repo_id in self.api_cache:
            cached = self.api_cache[repo_id]
            # If cached value is None (404), return None
            if cached is None:
                return None
            return cached
        
        # Get the actual URL from the listing
        if repo_id not in self.all_repos:
            logger.warning(f"Repository {repo_id} not in listing")
            return None
        
        url = self.all_repos[repo_id]
        
        try:
            response = httpx.get(url, timeout=30, follow_redirects=True)
            response.raise_for_status()
            xml_content = response.text
            
            # Cache the result
            self.api_cache[repo_id] = xml_content
            self.save_cache()
            
            return xml_content
        except httpx.HTTPStatusError as e:
            logger.warning(f"HTTP {e.response.status_code} fetching {repo_id} from {url}")
            # Cache the failure to avoid repeated attempts
            self.api_cache[repo_id] = None
            self.save_cache()
            return None
        except httpx.RequestError as e:
            logger.warning(f"Connection error fetching {repo_id}: {e}")
            return None

    def _extract_repository_name(self, xml_content: str) -> Optional[str]:
        """Extract repository name from XML content."""
        try:
            if isinstance(xml_content, str):
                root = etree.fromstring(xml_content.encode('utf-8') if isinstance(xml_content, str) else xml_content)
            else:
                root = etree.fromstring(xml_content)
            
            name_elem = root.xpath(".//r3d:repositoryName", namespaces=self.namespaces)
            if name_elem:
                return name_elem[0].text
            return None
        except Exception as e:
            logger.debug(f"Error extracting repository name: {e}")
            return None

    def parse_repository_xml(self, xml_content: str) -> Dict[str, Any]:
        """
        Parse re3data XML and extract key fields.
        Returns dictionary of extracted fields.
        """
        try:
            if isinstance(xml_content, str):
                root = etree.fromstring(xml_content.encode('utf-8'))
            else:
                root = etree.fromstring(xml_content)
            
            repo_info = {}
            
            # Extract simple string fields
            simple_fields = [
                'repositoryName', 'description', 'repositoryURL',
                'startDate', 'lastUpdate', 'orgIdentifier', 'missionStatementURL',
                'repositoryContact', 'entryDate'
            ]
            
            for field in simple_fields:
                elements = root.xpath(f".//r3d:{field}", namespaces=self.namespaces)
                if elements:
                    values = [e.text for e in elements if e.text]
                    if len(values) == 1:
                        repo_info[field] = values[0]
                    elif len(values) > 1:
                        repo_info[field] = values
            
            # Extract complex fields (arrays)
            complex_fields = {
                'institution': ['institutionName', 'institutionCountry', 'institutionType'],
                'policy': ['policyName', 'policyURL'],
                'pidSystem': ['name', 'policies'],
                'metadataStandard': ['metadataStandardName', 'metadataStandardURL'],
                'api': ['apiType', 'apiURL', 'apiDocu'],
                'dataAccess': ['type', 'accessRestriction'],
                'dataAccessRestriction': None,  # Use as-is
                'dataLicense': ['licenseName', 'licenseURL'],
                'subject': None,  # Use as-is (list of values)
                'contentType': None,  # Use as-is (list of values)
                'providerType': None,  # Use as-is (list of values)
            }
            
            for field_name, subfields in complex_fields.items():
                elements = root.xpath(f".//r3d:{field_name}", namespaces=self.namespaces)
                if elements:
                    if subfields is None:
                        # For list-type fields, just collect text values
                        values = [e.text for e in elements if e.text]
                        if values:
                            repo_info[field_name] = values if len(values) > 1 else values[0]
                    else:
                        # For complex fields with subfields
                        items = []
                        for elem in elements:
                            item = {}
                            for subfield in subfields:
                                sub_elem = elem.find(f"r3d:{subfield}", namespaces=self.namespaces)
                                if sub_elem is not None and sub_elem.text:
                                    item[subfield] = sub_elem.text
                            if item:
                                items.append(item)
                        if items:
                            repo_info[field_name] = items if len(items) > 1 else items[0]
            
            return repo_info
        except Exception as e:
            logger.error(f"Error parsing repository XML: {e}")
            return {}

    def fill_row_from_repo_data(
        self, 
        row_idx: int, 
        repo_data: Dict[str, Any],
        repo_id: str
    ) -> int:
        """
        Fill FAIR fields in a row based on re3data repository data.
        Only updates cells that are currently NA/empty.
        
        Returns: Number of fields updated
        """
        filled_count = 0
        fair_fields = get_fair_fields()
        
        for fair_field in fair_fields:
            # Skip if field already has a value
            if pd.notna(self.df.at[row_idx, fair_field]):
                continue
            
            # Infer FAIR value from re3data
            fair_value = infer_fair_value(fair_field, repo_data)
            
            if fair_value is not None:
                self.df.at[row_idx, fair_field] = fair_value
                filled_count += 1
        
        # Also store the re3data identifier if we found one
        if pd.isna(self.df.at[row_idx, 'generalInfo.re3dataIdentifier']):
            self.df.at[row_idx, 'generalInfo.re3dataIdentifier'] = repo_id
            filled_count += 1
        
        return filled_count

    def enrich_data(self, sample_size: int = None, verbose: bool = True) -> Dict[str, Any]:
        """
        Search for and enrich infrastructure data with re3data information.
        
        Args:
            sample_size: Limit to N rows (for testing)
            verbose: Show detailed output
        
        Returns:
            Dictionary with enrichment statistics
        """
        logger.info("\n" + "="*80)
        logger.info("DATA ENRICHMENT WITH RE3DATA")
        logger.info("="*80)
        # Console output still shown via handlers
        print("\n" + "="*80)
        print("DATA ENRICHMENT WITH RE3DATA")
        print("="*80)
        
        # Fetch repository listing
        self.fetch_repository_listing()
        
        # Ensure FAIR columns exist
        fair_fields = get_fair_fields()
        for field in fair_fields:
            if field not in self.df.columns:
                self.df[field] = pd.NA
        
        # Find records to enrich
        rows_to_process = list(range(len(self.df)))
        if sample_size:
            rows_to_process = rows_to_process[:sample_size]
        
        logger.info(f"\nProcessing {len(rows_to_process)} infrastructure records...\n")
        msg = f"\nProcessing {len(rows_to_process)} infrastructure records...\n"
        print(msg)
        
        # Track results
        found_count = 0
        enriched_count = 0
        failed_count = 0
        stats = {
            'total': len(rows_to_process),
            'found_in_re3data': 0,
            'enriched': 0,
            'not_found': 0,
            'errors': 0,
            'field_updates': {},
            'records': {}
        }
        
        for i, row_idx in enumerate(rows_to_process, 1):
            try:
                rdi_name = self.df.at[row_idx, 'generalInfo.name']
                re3data_id = self.df.at[row_idx, 'generalInfo.re3dataIdentifier']
                
                msg = f"[{i}/{len(rows_to_process)}] {rdi_name[:60]:<60}"
                logger.info(msg)
                print(f"[{i}/{len(rows_to_process)}] {rdi_name[:60]:<60}", end=" ")
                
                # Try to find repository
                repo_id = None
                
                # First try exact re3data identifier
                if pd.notna(re3data_id) and str(re3data_id).startswith('r3d'):
                    repo_id = self.search_by_identifier(str(re3data_id))
                
                # Fall back to name-based search
                if not repo_id:
                    repo_id = self.search_by_name(rdi_name)
                
                if not repo_id:
                    msg = "✗ Not found"
                    logger.info(msg)
                    print(msg)
                    stats['not_found'] += 1
                    continue
                
                # Fetch repository XML
                xml_content = self.fetch_repository_xml(repo_id)
                if not xml_content:
                    msg = "✗ Failed to fetch XML"
                    logger.warning(msg)
                    print(msg)
                    stats['errors'] += 1
                    continue
                
                # Parse XML
                repo_data = self.parse_repository_xml(xml_content)
                if not repo_data:
                    msg = "✗ Failed to parse XML"
                    logger.warning(msg)
                    print(msg)
                    stats['errors'] += 1
                    continue
                
                # Fill row with enriched data
                num_fields = self.fill_row_from_repo_data(row_idx, repo_data, repo_id)
                
                if num_fields > 0:
                    msg = f"✓ Enriched ({num_fields} fields)"
                    logger.info(msg)
                    print(msg)
                    enriched_count += 1
                    found_count += 1
                    stats['enriched'] += 1
                else:
                    msg = f"✓ Found (no new fields)"
                    logger.info(msg)
                    print(msg)
                    found_count += 1
                    stats['found_in_re3data'] += 1
                
                # Track record-level stats
                stats['records'][rdi_name] = {
                    're3data_id': repo_id,
                    'fields_updated': num_fields
                }
                
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                msg = f"✗ Error: {str(e)[:40]}"
                logger.error(msg)
                print(msg)
                stats['errors'] += 1
                failed_count += 1
                logger.error(f"Error processing row {row_idx}: {e}")
        
        # Summary
        logger.info("\n" + "="*80)
        logger.info("ENRICHMENT COMPLETE")
        logger.info("="*80)
        logger.info(f"Total processed:        {stats['total']}")
        logger.info(f"Found in re3data:       {found_count}")
        logger.info(f"Successfully enriched:  {enriched_count}")
        logger.info(f"Not found:              {stats['not_found']}")
        logger.info(f"Errors:                 {stats['errors']}")
        logger.info("="*80 + "\n")
        
        print("\n" + "="*80)
        print("ENRICHMENT COMPLETE")
        print("="*80)
        print(f"Total processed:        {stats['total']}")
        print(f"Found in re3data:       {found_count}")
        print(f"Successfully enriched:  {enriched_count}")
        print(f"Not found:              {stats['not_found']}")
        print(f"Errors:                 {stats['errors']}")
        print("="*80 + "\n")
        
        return stats

