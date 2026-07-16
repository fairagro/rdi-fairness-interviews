"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Link as MuiLink,
  Stack,
  Divider,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Table,
  TableContainer,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import TableChartIcon from "@mui/icons-material/TableChart";

interface Resource {
  title: string;
  description: string;
  icon: typeof DescriptionIcon; // the component type
  /** path relative to the `public/` folder */
  filename: string;
}

interface InterviewFile {
  title: string;
  rfid: string;
  dateOfArrival: string; // ISO date string – you can later parse it with `Date`
  filename: string; // path inside `public/`
}

export default function DownloadsPage() {
  // 1. Static General Download Resources
  const downloadResources: Resource[] = [
    {
      title: "FAIRness Interview Form",
      description:
        "The comprehensive survey form used to assess the FAIRness of Research Data Infrastructures. This form contains all 20 fairness criteria used during RDI manager interviews.",
      icon: DescriptionIcon,
      filename: "FAIRness_form.pdf",
    },
    {
      title: "FAIR Data Maturity Model",
      description:
        "The official RDA FAIR Data Maturity Model specification and guidelines (v1.0). This document provides detailed definitions and frameworks for assessing data fairness.",
      icon: DescriptionIcon,
      filename:
        "FAIR Data Maturity Model_ specification and guidelines_v1.00.pdf",
    },
  ];

  // 2. Static Interview Spreadsheets Array
  const interviewFiles: InterviewFile[] = [
    {
      title: "BacDive",
      rfid: "RFId003202604272",
      dateOfArrival: "2026-05-18",
      filename: "interviews/FAIRnessForm_FAIRagro_BacDive.xlsx",
    },
    {
      title: "BonaRes Repository",
      rfid: "RFId001202604272",
      dateOfArrival: "2026-05-06",
      filename: "interviews/FAIRnessForm_FAIRagro_BonaRes_Repository.xlsx",
    },
    {
      title: "CCDC",
      rfid: "RFId017202604272",
      dateOfArrival: "2026-05-22",
      filename: "interviews/FAIRnessForm_FAIRagro_CCDC_20260522.xlsx",
    },
    {
      title: "DWD OpenData",
      rfid: "RFId024202604272",
      dateOfArrival: "2026-05-20",
      filename: "interviews/FAIRnessForm_FAIRagro_DWD_OpenData.xlsx",
    },
    {
      title: "Edaphobase",
      rfid: "RFId011202604272",
      dateOfArrival: "2026-04-16",
      filename: "interviews/FAIRnessForm_FAIRagro_Edaphobase.xlsx",
    },
    {
      title: "FAIRagro EDI",
      rfid: "RFId003202604272",
      dateOfArrival: "2026-05-26",
      filename: "interviews/FAIRnessForm_FAIRagro-EDI.xlsx",
    },
    {
      title: "ioChem BD",
      rfid: "RFId072202604272",
      dateOfArrival: "2026-05-06",
      filename: "interviews/FAIRnessForm_FAIRagro_ioChem-BD.xlsx",
    },
    {
      title: "OpenAgrar",
      rfid: "RFId014202604272",
      dateOfArrival: "2026-04-23",
      filename: "interviews/FAIRnessForm_FAIRagro_OpenAgrar.xlsx",
    },
    {
      title: "PANGAEA",
      rfid: "RFId062202604272",
      dateOfArrival: "2026-04-16",
      filename: "interviews/FAIRnessForm_FAIRagro_PANGAEA.xlsx",
    },
    {
      title: "PhenoRoam",
      rfid: "RFId022202604272",
      dateOfArrival: "2026-04-27",
      filename: "interviews/FAIRnessForm_FAIRagro_PhenoRoam.xlsx",
    },
    {
      title: "Thuenen Atlas",
      rfid: "RFId033202604272",
      dateOfArrival: "2026-04-23",
      filename: "interviews/FAIRnessForm_FAIRagro_Thuenen-Atlas.xlsx",
    },
    {
      title: "ZB MED LifeData",
      rfid: "RFId009202604272",
      dateOfArrival: "2026-05-13",
      filename: "interviews/FAIRnessForm_FAIRagro_ZB MED_LifeData.xlsx",
    },
    {
      title: "Zenodo",
      rfid: "RFId007202604272",
      dateOfArrival: "2026-05-21",
      filename: "interviews/FAIRnessForm_FAIRagro_Zenodo.xlsx",
    },
        {
      title: "EUDAT B2SHARE",
      rfid: "RFId073202604272",
      dateOfArrival: "2026-06-17",
      filename: "interviews/FAIRnessForm_FAIRagro_EUDAT_B2SHARE.xlsx",
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h3"
        sx={{ fontWeight: "bold", color: "#222", mb: 1 }}
      >
        Downloads & Resources
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
        Access important documents, forms, and resources for assessing and
        improving FAIR Data practices.
      </Typography>

      {/* General Download Resources Section — Unified Horizontal Rows Layout */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DownloadIcon sx={{ color: "#6abf5c" }} />
          Downloadable Resources
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: "8px",
            overflow: "hidden",
            borderColor: "#e0e0e0",
          }}
        >
          <Stack divider={<Divider flexItem />}>
            {downloadResources.map((resource, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafdfa",
                  "&:hover": { backgroundColor: "#f6fbf5" },
                }}
              >
                {/* Left Side: Icon, Title & Sub-Text */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <resource.icon
                    sx={{ fontSize: 28, color: "#6abf5c", mt: 0.25 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#333", mb: 0.5 }}
                    >
                      {resource.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", lineHeight: 1.5 }}
                    >
                      {resource.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Side: Aligned Download Button */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  href={`/${resource.filename}`}
                  download
                  sx={{
                    borderColor: "#6abf5c",
                    color: "#6abf5c",
                    whiteSpace: "nowrap",
                    height: "fit-content",
                    "&:hover": {
                      borderColor: "#5aa050",
                      backgroundColor: "rgba(106, 191, 92, 0.08)",
                    },
                  }}
                >
                  Download
                </Button>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Interview Spreadsheets List Layout */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TableChartIcon sx={{ color: "#0f9884" }} />
          Interview Spreadsheets
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: "8px", borderColor: "#e0e0e0" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#fcfcfc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Infrastructure
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Arrival Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interviewFiles.map((file, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:hover": { backgroundColor: "#f4faf3" } }}
                >
                  <TableCell>
                    <Link
                      href={`/resource/repository/${file.rfid}/fairness`}
                      style={{
                        textDecoration: "none",
                        color: "#0f9884",
                        fontWeight: "bold",
                      }}
                    >
                      {file.title}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ color: "#666" }}>{file.rfid}</TableCell>
                  <TableCell sx={{ color: "#666" }}>
                    {file.dateOfArrival}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      href={`/${file.filename}`}
                      download
                      sx={{ borderColor: "#0f9884", color: "#0f9884" }}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Update FAIRness Section */}
      <Paper
        sx={{
          p: 4,
          backgroundColor: "#e1f2df",
          borderLeft: "5px solid #6abf5c",
          borderRadius: "8px",
          mb: 5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EmailIcon sx={{ color: "#6abf5c" }} />
          Update Your FAIRness Assessment
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#555", lineHeight: 1.8, mb: 3 }}
        >
          If you would like to update or submit a new FAIRness assessment for
          your Research Data Infrastructure, we would be delighted to hear from
          you! Please download the interview form above, complete it with
          information about your RDI, and send it to us along with any
          additional documentation or context.
        </Typography>
        <Box
          sx={{
            p: 2.5,
            backgroundColor: "white",
            borderRadius: "4px",
            border: "2px solid #0f9884",
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "#666", textTransform: "uppercase", mb: 1 }}
          >
            Contact Us
          </Typography>
          <MuiLink
            href="mailto:a.haleem@fz-juelich.de"
            sx={{
              color: "#0f9884",
              fontWeight: "600",
              fontSize: "1.1rem",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            a.haleem@fz-juelich.de
          </MuiLink>
        </Box>
        <Typography variant="body2" sx={{ color: "#555", fontStyle: "italic" }}>
          Please include the completed interview form as an attachment and
          provide any additional context about your infrastructure that might be
          helpful for our assessment.
        </Typography>
      </Paper>
    </Box>
  );
}
