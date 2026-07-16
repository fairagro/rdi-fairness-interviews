import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPreviousClick,
  onNextClick,
}: PaginationControlsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
      <Button
        variant="outlined"
        onClick={onPreviousClick}
        disabled={currentPage === 1}
        sx={{ borderColor: 'var(--fairagro-teal)', color: 'var(--fairagro-teal)', '&:hover': { backgroundColor: 'var(--fairagro-teal-5)' } }}
      >
        Previous
      </Button>
      <Typography variant="body2" sx={{ mx: 2 }}>
        Page {currentPage} of {totalPages}
      </Typography>
      <Button
        variant="outlined"
        onClick={onNextClick}
        disabled={currentPage === totalPages || totalPages === 0}
        sx={{ borderColor: 'var(--fairagro-teal)', color: 'var(--fairagro-teal)', '&:hover': { backgroundColor: 'var(--fairagro-teal-5)' } }}
      >
        Next
      </Button>
    </Box>
  );
}
