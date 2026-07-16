import React from "react";
import { Box, Button, Checkbox, Chip, Divider, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material";
import { Rdi } from './utils/rdiDataExtraction';

interface FilterSidebarProps {
  domains: string[];
  subjects: string[];
  collections: string[];
  selectedDomains: string[];
  selectedSubjects: string[];
  selectedCollections: string[];
  allRdis: Rdi[];
  onDomainToggle: (domain: string) => void;
  onSubjectToggle: (subject: string) => void;
  onCollectionToggle: (collection: string) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  domains,
  subjects,
  collections,
  selectedDomains,
  selectedSubjects,
  selectedCollections,
  allRdis,
  onDomainToggle,
  onSubjectToggle,
  onCollectionToggle,
  onClearFilters,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedDomains.length > 0 || selectedSubjects.length > 0 || selectedCollections.length > 0;

  return (
    <Paper sx={{ width: 280, flexShrink: 0, p: 2, height: 'fit-content', position: 'sticky', top: 88, borderLeft: '5px solid var(--fairagro-primary-green)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--fairagro-primary-green)' }}>Filters</Typography>
        {hasActiveFilters && (
          <Button onClick={onClearFilters} sx={{ p: 0, minWidth: 0, color: 'var(--fairagro-teal)', textTransform: 'none', fontSize: 14, fontWeight: 400, background: 'none', boxShadow: 'none', '&:hover': { textDecoration: 'underline', background: 'none', color: 'var(--fairagro-primary-green)' } }}>
            Clear all
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Domain Filter */}
      <Box sx={{ mb: 3 }}>
        <FormGroup>
          {domains.map(domain => (
            <FormControlLabel
              key={domain}
              control={
                <Checkbox
                  checked={selectedDomains.includes(domain)}
                  onChange={() => onDomainToggle(domain)}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body2">{domain}</Typography>
                  <Chip label={allRdis.filter((rdi: Rdi) => rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro?.fields?.find((f: any) => f.typeName === 'MDS_fairagro.domain')?.value === domain).length} size="small" sx={{ height: 18, fontSize: '0.7rem' }} />
                </Box>
              }
            />
          ))}
        </FormGroup>
      </Box>

      {/* Subject Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'var(--fairagro-primary-green)' }} gutterBottom>Subject</Typography>
        <FormGroup>
          {subjects.map(subject => (
            <FormControlLabel
              key={subject}
              control={
                <Checkbox
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => onSubjectToggle(subject)}
                  size="small"
                />
              }
              label={<Typography variant="body2">{subject}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Collections Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'var(--fairagro-primary-green)' }} gutterBottom>Collections</Typography>
        <FormGroup>
          {collections.map(collection => (
            <FormControlLabel
              key={collection}
              control={
                <Checkbox
                  checked={selectedCollections.includes(collection)}
                  onChange={() => onCollectionToggle(collection)}
                  size="small"
                />
              }
              label={<Typography variant="body2">{collection}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </Paper>
  );
}
