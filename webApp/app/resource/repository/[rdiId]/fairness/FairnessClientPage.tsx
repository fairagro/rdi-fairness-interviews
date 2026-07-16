// app/resource/repository/[rdiId]/fairness/FairnessClientPage.tsx
'use client';

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { FairnessTable } from "@/app/page";
import FairnessBarChart from "./FairnessBarChart";

interface FairnessClientPageProps {
  rdiId: string;
}

interface ApiResponse {
  "@context": string | any[];
  "@type": string;
  identifier: string;
  name: string;
  metadataStandard: string;
  fairnessAssessment: {
    "@type": string;
    name: string;
    description: string;
    findability?: any;
    accessibility?: any;
    interoperability?: any;
    reusability?: any;
    [key: string]: any; 
  };
}

/**
 * Strips out schema metadata definitions (type, display_name, description, etc.)
 * leaving exclusively the core evaluation pillars and metrics for components to consume.
 */
function cleanFairnessData(rawAssessment: any) {
  if (!rawAssessment) return null;

  const targetPillars = ['findability', 'accessibility', 'interoperability', 'reusability'];
  const metadataKeys = ['description', 'display_name', 'title', 'type'];
  const cleaned: Record<string, any> = {};

  targetPillars.forEach((pillarKey) => {
    const pillarData = rawAssessment[pillarKey];
    if (pillarData && typeof pillarData === 'object') {
      const cleanedPillar: Record<string, any> = {};

      Object.entries(pillarData).forEach(([key, field]) => {
        // Skip metadata keys to avoid breaking charts or tables
        if (metadataKeys.includes(key)) return;
        cleanedPillar[key] = field;
      });

      cleaned[pillarKey] = cleanedPillar;
    }
  });

  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

export default function FairnessClientPage({ rdiId }: FairnessClientPageProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFairnessData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/resource/repository/${rdiId}/fairness`);
        
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Repository profiling info not found' : 'Failed to parse API data');
        }
        
        const payload = await res.json();
        setData(payload);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchFairnessData();
  }, [rdiId]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#0f9884' }} />
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">{error || 'Data could not be loaded'}</Typography>
        <Button component={Link} href={`/resource/repository/${rdiId}`} sx={{ mt: 2 }} variant="outlined">
          Return to Profile
        </Button>
      </Container>
    );
  }

  const pageTitle = data.name; 
  // Clean the payload right here before handing it down
  const fairnessMetrics = cleanFairnessData(data.fairnessAssessment);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        href={`/resource/repository/${rdiId}`}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: '#0f9884', borderColor: '#0f9884', '&:hover': { borderColor: '#0d8271' } }}
        variant="outlined"
      >
        Back to Repository Profile
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: '#222', mb: 1 }}>
            {pageTitle}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#666' }}>
            Detailed Evaluation Matrix & FAIR Pillar Chart Analysis
          </Typography>
        </Box>

        {/* Chart Visualization Row */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
            Pillar Compliance Metrics
          </Typography>
          {fairnessMetrics ? (
            <FairnessBarChart fairnessData={fairnessMetrics} />
          ) : (
            <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
              No quantitative visualization metrics available.
            </Typography>
          )}
        </Box>

        {/* Structural Tabular Matrix Breakdown */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
            Detailed Assessment Breakdown
          </Typography>
          {fairnessMetrics ? (
            <FairnessTable fairness={fairnessMetrics} />
          ) : (
            <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
              No quantitative fairness documentation provided for this infrastructure repository.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}