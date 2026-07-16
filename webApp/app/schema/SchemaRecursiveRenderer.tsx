"use client";

import React, { useState } from "react";
import { Box, Typography, Chip, IconButton, Collapse } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function SchemaRecursiveRenderer({ name, prop }: { name: string; prop: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine if this node has nested properties (Object or Array of Objects)
  const nestedProperties = prop.properties 
    ? prop.properties 
    : (prop.items?.properties ? prop.items.properties : null);

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {nestedProperties && (
          <IconButton size="small" onClick={() => setIsOpen(!isOpen)} sx={{ p: 0 }}>
            {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        )}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {prop.display_name || name} <small>({prop.type})</small>
        </Typography>
      </Box>

      {prop.description && (
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", ml: nestedProperties ? 3 : 0 }}>
          {prop.description}
        </Typography>
      )}

      {/* RECURSION: If children exist, render them recursively */}
      {nestedProperties && (
        <Collapse in={isOpen}>
          <Box sx={{ ml: 4, mt: 1, pl: 2, borderLeft: "2px solid #eee" }}>
            {Object.entries(nestedProperties).map(([childKey, childValue]) => (
              <SchemaRecursiveRenderer key={childKey} name={childKey} prop={childValue} />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}