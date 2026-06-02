import pandas as pd
import httpx
import json
import time
from typing import Dict, Any, Optional, List
from urllib.parse import urlparse
import re

class DataEnricher:
    def try_fetch_metadata(self, url: str) -> dict:
        """
        Stub for fetching metadata from a URL. Returns None.
        TODO: Implement actual metadata fetching logic.
        """
        return None
    
    def infer_from_name(self, name: str) -> Dict[str, str]:
        """
        Stub for inferring type/domain from the infrastructure name. Returns empty dict.
        TODO: Implement actual inference logic.
        """
        return {}

    def enrich_from_urls(self, sample_size: int = None) -> int:
        print("\n" + "="*80)
        print("URL-BASED DATA ENRICHMENT")
        print("="*80)
        # Use the real column name for re3dataIdentifier
        missing = self.df[self.df['generalInfo.re3dataIdentifier'].isna()].index.tolist()
        if sample_size:
            missing = missing[:sample_size]
        print(f"\nAnalyzing URLs of {len(missing)} missing infrastructures...\n")
        enriched_count = 0
        for i, row_idx in enumerate(missing, 1):
            name = self.df.at[row_idx, 'generalInfo.name'] if 'generalInfo.name' in self.df.columns else None
            url = self.df.at[row_idx, 'generalInfo.url'] if 'generalInfo.url' in self.df.columns else self.df.at[row_idx, 'generalInfo.NFDI_link'] if 'generalInfo.NFDI_link' in self.df.columns else None
            print(f"[{i}/{len(missing)}] {str(name)[:50]}")
            improvements = []
            if pd.notna(url):
                url_info = self.infer_from_url(url)
                if 'provider_inferred' in url_info and 'generalInfo.provider' in self.df.columns and pd.isna(self.df.at[row_idx, 'generalInfo.provider']):
                    self.df.at[row_idx, 'generalInfo.provider'] = url_info['provider_inferred']
                    improvements.append('provider')
                if 'type_inferred' in url_info and 'generalInfo.RDItype' in self.df.columns and pd.isna(self.df.at[row_idx, 'generalInfo.RDItype']):
                    self.df.at[row_idx, 'generalInfo.RDItype'] = url_info['type_inferred']
                    improvements.append('type')
                if 'domain_inferred' in url_info and 'generalInfo.domain' in self.df.columns and pd.isna(self.df.at[row_idx, 'generalInfo.domain']):
                    self.df.at[row_idx, 'generalInfo.domain'] = url_info['domain_inferred']
                    improvements.append('domain')
            name_info = self.infer_from_name(name)
            if 'type_inferred' in name_info and 'generalInfo.RDItype' in self.df.columns and pd.isna(self.df.at[row_idx, 'generalInfo.RDItype']):
                self.df.at[row_idx, 'generalInfo.RDItype'] = name_info['type_inferred']
                if 'type' not in improvements:
                    improvements.append('type')
            if 'domain_inferred' in name_info and 'generalInfo.domain' in self.df.columns and pd.isna(self.df.at[row_idx, 'generalInfo.domain']):
                self.df.at[row_idx, 'generalInfo.domain'] = name_info['domain_inferred']
                if 'domain' not in improvements:
                    improvements.append('domain')
            if pd.notna(url) and i % 5 == 0:
                print(f"    ↓ Fetching metadata from {str(url)[:50]}...")
                url_meta = self.try_fetch_metadata(url)
                if url_meta:
                    if 'description' in url_meta and 'generalInfo.description' in self.df.columns and pd.isna(self.df.at[row_idx, 'generalInfo.description']):
                        self.df.at[row_idx, 'generalInfo.description'] = url_meta['description'][:200]
                        improvements.append('description')
                    print(f"      ✓ Got metadata")
            if improvements:
                print(f"    → Enriched: {', '.join(improvements)}")
                enriched_count += 1
            else:
                print(f"    ○ No improvements possible")
            time.sleep(0.2)
        print("\n" + "="*80)
        print(f"URL ENRICHMENT COMPLETE - {enriched_count}/{len(missing)} improved")
        print("="*80)
        return enriched_count

    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.original_df = self.df.copy()
        self.enrichment_log = []
        print(f"✓ Using provided DataFrame with {len(self.df)} infrastructure records")

    def add_manual_mappings(self, mappings_file: str = 'manual_enrichment.json') -> int:
        try:
            with open(mappings_file, 'r') as f:
                mappings = json.load(f)
        except FileNotFoundError:
            print(f"\nNo manual mappings file found ({mappings_file})")
            return 0
        print(f"\n✓ Loading manual enrichment from {mappings_file}")
        count = 0
        for name, fields in mappings.items():
            matches = self.df[self.df['generalInfo.name'] == name] if 'generalInfo.name' in self.df.columns else pd.DataFrame()
            if not matches.empty:
                row_idx = matches.index[0]
                for field, value in fields.items():
                    if field in self.df.columns and pd.isna(self.df.at[row_idx, field]):
                        self.df.at[row_idx, field] = value
                        count += 1
        return count

    def infer_from_url(self, url: str) -> Dict[str, str]:
        if not url or not isinstance(url, str):
            return {}
        info = {}
        try:
            parsed = urlparse(url)
            domain = parsed.netloc
            parts = domain.replace('www.', '').split('.')
            if 'leibniz' in domain.lower() or 'zalf' in domain.lower():
                info['provider_inferred'] = 'Leibniz Centre for Agricultural Landscape Research'
            elif 'dwd' in domain.lower():
                info['provider_inferred'] = 'German Weather Service'
            elif 'gfz' in domain.lower():
                info['provider_inferred'] = 'German Research Centre for Geosciences'
            elif 'awi' in domain.lower():
                info['provider_inferred'] = 'Alfred Wegener Institute'
            elif 'ncbi' in domain.lower() or 'nih' in domain.lower():
                info['provider_inferred'] = 'National Center for Biotechnology Information'
            elif 'zenodo' in domain.lower():
                info['provider_inferred'] = 'CERN'
            if 'database' in domain.lower() or 'db' in domain.lower():
                info['type_inferred'] = 'Database'
            elif 'repository' in domain.lower() or 'repo' in domain.lower():
                info['type_inferred'] = 'Repository'
        except Exception:
            pass
        return info
