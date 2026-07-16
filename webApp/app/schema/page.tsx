import React from "react";
import fs from "fs";
import path from "path";
import { Container, Box, Typography, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SchemaRecursiveRenderer from "./SchemaRecursiveRenderer"; // See below

export default async function SchemaDocumentationPage() {
  // Read the schema file directly from the public directory
  const filePath = path.join(process.cwd(), "public", "MDS_FAIRagro_RDI_schema.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const schema = JSON.parse(fileContent);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>{schema.title}</Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>{schema.description}</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Property</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(schema.properties).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell sx={{ verticalAlign: "top", fontWeight: "bold" }}>{key}</TableCell>
                <TableCell>
                  {/* Pass the data to the Client Component for recursion */}
                  <SchemaRecursiveRenderer name={key} prop={value as any} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}