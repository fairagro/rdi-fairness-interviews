"use client";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "#f5f5f5",
        borderTop: "3px solid #6abf5c",
        py: 2,
        px: 2,
        mt: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} FAIRagro &mdash; Powered by Open Science
      </Typography>
    </Box>
  );
}
