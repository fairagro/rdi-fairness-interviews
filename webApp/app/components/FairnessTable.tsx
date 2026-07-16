'use client';

import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

interface FairnessTableProps {
  fairness: any; // Expects the flattened `fairnessAssessment` object
}

export default function FairnessTable({ fairness }: FairnessTableProps) {
  if (!fairness) return <Typography sx={{ p: 2 }}>No FAIRness data available.</Typography>;

  const pillars = [
    { key: 'findability', label: 'Findability' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'interoperability', label: 'Interoperability' },
    { key: 'reusability', label: 'Reusability' },
  ];

  // Map primitive data states to their targeted presentation colors
  const getColor = (val: any) => {
    if (val === true || val === 'yes') return '#6abf5c'; // Compliance Green
    if (val === false || val === 'no') return '#f26e5f'; // Warning Red
    if (val === null || val === undefined || val === 'na') return '#a8a9ad'; // Missing Gray
    return undefined;
  };

  // Safe translation layer preventing React from hiding raw boolean values in the DOM
  const renderValue = (val: any) => {
    if (val === true) return 'Yes';
    if (val === false) return 'No';
    if (val === null || val === undefined) return 'Missing';
    return String(val);
  };

  // List of structural metadata properties to exclude from metric data rows
  const reservedKeys = ['description', 'display_name', 'title', 'type'];

  return (
    <TableContainer component={Paper} sx={{ my: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Pillar</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>Criterion</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pillars.map(pillar => {
            const pillarObj = fairness[pillar.key];
            if (!pillarObj) return null;

            // Filter out structural property descriptors so they don't break row heights
            const criteriaEntries = Object.entries(pillarObj).filter(
              ([key]) => !reservedKeys.includes(key)
            );
            
            return criteriaEntries.map(([critKey, critObj]: [string, any], idx) => {
              const val = critObj?.value;
              
              // Use the rich title from your schema, falling back to camelCase parsing if missing
              const criterionLabel = critObj?.title || critKey.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

              return (
                <TableRow 
                  key={`${pillar.key}-${critKey}`}
                  sx={{ '&:hover': { bgcolor: '#fdfdfd' } }}
                >
                  {/* Dynamically group rows by the strict length of clean metric criteria items */}
                  {idx === 0 && (
                    <TableCell 
                      rowSpan={criteriaEntries.length} 
                      sx={{ 
                        fontWeight: 'bold', 
                        background: '#f7f9f8', 
                        verticalAlign: 'top', 
                        pt: 1.5,
                        borderRight: '1px solid #e0e0e0'
                      }}
                    >
                      {pillar.label}
                    </TableCell>
                  )}
                  <TableCell>{criterionLabel}</TableCell>
                  <TableCell sx={{ color: getColor(val), fontWeight: 'bold' }}>
                    {renderValue(val)}
                  </TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}