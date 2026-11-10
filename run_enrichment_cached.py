#!/usr/bin/env python3
"""Deterministic replay of run_enrichment.py from enrichment_cache.json, without the live re3data listing.

run_enrichment.py fetches the re3data repository listing live and then resolves every repository from
the cached API responses. When the listing endpoint is unavailable, this wrapper builds the listing
from the cache (every cached re3data id) and runs the unmodified run_enrichment.py in that state, so the
output is identical to an online run as long as the cache is complete.

Run from resources/data/data_fairagro:  python3 run_enrichment_cached.py
"""
import runpy
import rdiDataEnricher.search_and_enrich_data as m


def _listing_from_cache(self):
    self.all_repos = {k: f"{self.BASE_URL}/{k}" for k in self.api_cache if str(k).startswith("r3d")}
    print(f"✓ Repository listing rebuilt from cache: {len(self.all_repos)} repositories")
    return self.all_repos


m.Re3DataEnricher.fetch_repository_listing = _listing_from_cache
runpy.run_path("run_enrichment.py", run_name="__main__")
