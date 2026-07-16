"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Box, Link as MuiLink } from "@mui/material";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR, render a clean structural fallback with identical sizing 
  // to avoid jumping layouts and clear style mismatch hydration errors.
  if (!mounted) {
    return (
      <header 
        style={{ 
          width: "100%", 
          height: "57px", // Matches exactly the total py, border, and image height 
          backgroundColor: "white", 
          borderBottom: "1px solid #e0e0e0", 
          borderTop: "4px solid #6abf5c" 
        }} 
      />
    );
  }

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
        borderTop: "4px solid #6abf5c",
        py: 1,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <MuiLink
          href="https://fairagro.net/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none", cursor: "pointer", '&:hover': { opacity: 0.8 } }}
        >
          <img
            src="/fairagro.png"
            alt="FAIRagro Logo"
            style={{ height: 40, width: "auto", marginRight: 12 }}
          />
        </MuiLink>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <MuiLink component={NextLink} href="/" underline="hover" color="inherit" sx={{ fontWeight: 500, color: '#0f9884', '&:hover': { color: '#6abf5c' } }}>
          Home
        </MuiLink>
        <MuiLink component={NextLink} href="/interview" underline="hover" color="inherit" sx={{ fontWeight: 500, color: '#0f9884', '&:hover': { color: '#6abf5c' } }}>
          Interview
        </MuiLink>
        <MuiLink component={NextLink} href="/downloads" underline="hover" color="inherit" sx={{ fontWeight: 500, color: '#0f9884', '&:hover': { color: '#6abf5c' } }}>
          Downloads
        </MuiLink>
        <MuiLink component={NextLink} href="/about" underline="hover" color="inherit" sx={{ fontWeight: 500, color: '#0f9884', '&:hover': { color: '#6abf5c' } }}>
          About
        </MuiLink>
        <MuiLink component={NextLink} href="/contact" underline="hover" color="inherit" sx={{ fontWeight: 500, color: '#0f9884', '&:hover': { color: '#6abf5c' } }}>
          Contact
        </MuiLink>
      </Box>
    </Box>
  );
}