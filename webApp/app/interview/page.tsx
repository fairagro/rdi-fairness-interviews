"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { FAIRNESS_CRITERIA } from "@/app/components/utils/fairnessConstants";
// Imported the dynamic icon mapper utility
import { getIconComponent } from "@/app/components/utils/iconMap";

export default function InterviewPage() {
  const pillarColors: Record<string, string> = {
    FINDABILITY: "#6abf5c",
    ACCESSIBILITY: "#0f9884",
    INTEROPERABILITY: "#f26e5f",
    REUSABILITY: "#973442",
  };

  const pillarBgColors: Record<string, string> = {
    FINDABILITY: "#e1f2df",
    ACCESSIBILITY: "#e0f7f6",
    INTEROPERABILITY: "#fde8e3",
    REUSABILITY: "#f5e5e7",
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", color: "#222", mb: 1 }}
        >
          RDI Manager Interview Questions
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.7 }}>
          This table presents the results of{" "}
          {
            <Link
              href={`/downloads`}
              style={{
                textDecoration: "underline",
                color: "#0f9884",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              interviews conducted with Research Data Infrastructure (RDI)
              managers
            </Link>
          }
          . Each row represents one fairness criterion assessed during the
          interview, mapped to the RDA FAIR Data Maturity Model.
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ backgroundColor: "#f9f9f9" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", color: "#333", width: "5%" }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#333", width: "22%" }} // Slightly expanded column width for the icon room
              >
                Criterion
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#333", width: "15%" }}
              >
                FAIR Pillar
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#333", width: "10%" }}
              >
                RDA Code
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#333", width: "48%" }}
              >
                Assessment Question
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {FAIRNESS_CRITERIA.map((criterion) => {
              // Extract and resolve the specific icon component for this row
              const Icon = getIconComponent(criterion.icon || "HelpIcon");
              // Match the icon's color to the designated FAIR Pillar theme color
              const iconColor = pillarColors[criterion.pillar] || "#a8a9ad";

              return (
                <TableRow
                  key={criterion.key}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <TableCell sx={{ fontWeight: "600", color: "#333" }}>
                    {criterion.key}
                  </TableCell>
                  
                  {/* Criterion Cell: Side-by-side icon and name link alignment */}
                  <TableCell sx={{ color: "#333", fontWeight: "500" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Icon sx={{ color: iconColor, fontSize: 20, flexShrink: 0 }} />
                      <Link
                        href={`/indicator/${criterion.key}`}
                        style={{
                          textDecoration: "underline",
                          color: "#0f9884",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.7")
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        {criterion.label}
                      </Link>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={criterion.pillar}
                      sx={{
                        backgroundColor:
                          pillarBgColors[criterion.pillar] || "#f5f5f5",
                        color: pillarColors[criterion.pillar] || "#a8a9ad",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "monospace",
                      color: "#555",
                      fontSize: "0.875rem",
                    }}
                  >
                    {criterion.rdaCode}
                  </TableCell>
                  <TableCell sx={{ color: "#666", lineHeight: 1.6 }}>
                    {criterion.description}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: "#f9f9f9",
          borderLeft: "4px solid #6abf5c",
          borderRadius: "4px",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 1,
            textTransform: "uppercase",
          }}
        >
          About This Assessment
        </Typography>
        <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
          These 20 criteria were developed based on the RDA FAIR Data Maturity
          Model and represent key aspects of fairness in Research Data
          Infrastructure. They are organized into four FAIR pillars:
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
          }}
        >
          {Object.entries(pillarColors).map(([pillar, color]) => (
            <Box
              key={pillar}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: color,
                  borderRadius: "4px",
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: "600", color: "#333" }}
              >
                {pillar}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}