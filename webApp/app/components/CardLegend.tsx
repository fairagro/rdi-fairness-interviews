import React from "react";
import { Box, Typography } from "@mui/material";

export default function CardLegend() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, ml: 1, bgcolor: 'var(--fairagro-green-5)', borderRadius: 1, px: 2, py: 1, width: 'fit-content', border: '2px solid var(--fairagro-primary-green)' }}>
      <Box sx={{ width: 18, height: 18, bgcolor: 'var(--fairagro-primary-green)', borderRadius: 0.5, border: '1px solid var(--fairagro-dark-text)' }} />
      <Typography variant="caption" sx={{ mr: 1, fontWeight: 500 }}>Criteria met</Typography>
      <Box sx={{ width: 18, height: 18, bgcolor: 'var(--fairagro-accent-red)', borderRadius: 0.5, border: '1px solid var(--fairagro-dark-text)' }} />
      <Typography variant="caption" sx={{ mr: 1, fontWeight: 500 }}>Criteria not met</Typography>
      <Box sx={{ width: 18, height: 18, bgcolor: 'var(--fairagro-gray)', borderRadius: 0.5, border: '1px solid var(--fairagro-dark-text)' }} />
      <Typography variant="caption" sx={{ fontWeight: 500 }}>Unknown</Typography>
    </Box>
  );
}
