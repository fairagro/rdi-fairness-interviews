"use client";
import React, { useState, useMemo, useRef } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { getAllRdis } from "rf-rdis";
import CardLegend from "./components/CardLegend";
import FilterSidebar from "./components/FilterSidebar";
import SearchBar from "./components/SearchBar";
import PaginationControls from "./components/PaginationControls";
import RdiCard from "./components/RdiCard";
import { Rdi } from "./components/utils/rdiDataExtraction";
import { getUniqueDomains, getUniqueSubjects, getUniqueCollections, filterRdis } from "./components/utils/filterUtils";

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Cache all RDIs in a ref on first render
  const allRdisRef = useRef<Rdi[] | null>(null);
  if (allRdisRef.current === null) {
    allRdisRef.current = getAllRdis().filter((rdi: Rdi) => typeof rdi.id === "string" && rdi.id);
  }
  const allRdis = allRdisRef.current;

  const domains = useMemo(
    () => getUniqueDomains(allRdis).filter((d): d is string => typeof d === "string"),
    [allRdis]
  );
  const subjects = useMemo(() => getUniqueSubjects(allRdis), [allRdis]);
  const collections = useMemo(() => getUniqueCollections(allRdis), [allRdis]);

  const filteredRdis = useMemo(() => {
    return filterRdis(allRdis, selectedDomains, selectedSubjects, selectedCollections, searchQuery);
  }, [selectedDomains, selectedSubjects, selectedCollections, searchQuery, allRdis]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRdis.length / ITEMS_PER_PAGE);
  const paginatedRdis = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRdis.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredRdis, currentPage]);

  // Reset to first page when filters/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedDomains, selectedSubjects, selectedCollections, searchQuery]);

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]);
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
  };

  const handleCollectionToggle = (collection: string) => {
    setSelectedCollections(prev => prev.includes(collection) ? prev.filter(c => c !== collection) : [...prev, collection]);
  };

  const clearAllFilters = () => {
    setSelectedDomains([]);
    setSelectedSubjects([]);
    setSelectedCollections([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedDomains.length > 0 || selectedSubjects.length > 0 || selectedCollections.length > 0 || searchQuery !== '';

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'var(--fairagro-primary-green)' }}>
            FAIRagro RDI Inventory
          </Typography>
        </Box>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Sidebar - Filters */}
          <FilterSidebar
            domains={domains}
            subjects={subjects}
            collections={collections}
            selectedDomains={selectedDomains}
            selectedSubjects={selectedSubjects}
            selectedCollections={selectedCollections}
            allRdis={allRdis}
            onDomainToggle={handleDomainToggle}
            onSubjectToggle={handleSubjectToggle}
            onCollectionToggle={handleCollectionToggle}
            onClearFilters={clearAllFilters}
          />

          {/* Main Content - RDI List with Pagination */}
          <Box sx={{ flex: 1 }}>
            <CardLegend />
            <Grid container spacing={2}>
              {paginatedRdis.map((rdi: Rdi) => (
                <Box key={rdi.id || rdi.raw?.datasetVersion?.persistentId || Math.random()} sx={{ width: '100%', mb: 2 }}>
                  <RdiCard rdi={rdi} />
                </Box>
              ))}
            </Grid>

            {/* Pagination Controls */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNextClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}



export { default as FairnessTable } from "./components/FairnessTable";
