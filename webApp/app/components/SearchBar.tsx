import React from "react";
import { Box, Button, TextField } from "@mui/material";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  hasActiveFilters,
  onClearFilters,
}: SearchBarProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: 800, mb: 2 }}>
        <TextField
          label="Search RDIs"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          size="medium"
          fullWidth
          slotProps={{
            input: {
              style: { color: 'var(--fairagro-dark-text)' }
            }
          }}
        />
        {hasActiveFilters && (
          <Button onClick={onClearFilters} variant="outlined" sx={{ borderColor: 'var(--fairagro-primary-green)', color: 'var(--fairagro-primary-green)', '&:hover': { backgroundColor: 'var(--fairagro-green-5)', borderColor: 'var(--fairagro-teal)' } }}>Clear all</Button>
        )}
      </Box>
    </Box>
  );
}
