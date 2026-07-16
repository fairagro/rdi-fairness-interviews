'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Paper, Chip, Link as MuiLink } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DocumentIcon from '@mui/icons-material/Description';
import { getIconComponent } from '@/app/components/utils/iconMap';
import HelpIcon from '@mui/icons-material/Help';

interface IndicatorClientProps {
  indicator: any;
}

export default function IndicatorClient({ indicator }: IndicatorClientProps) {
  const router = useRouter();

  const Icon = getIconComponent(indicator.icon);

  const pillarColors: Record<string, string> = {
    FINDABILITY: '#6abf5c',
    ACCESSIBILITY: '#0f9884',
    INTEROPERABILITY: '#f26e5f',
    REUSABILITY: '#973442',
  };

  const pillarBgColors: Record<string, string> = {
    FINDABILITY: '#e1f2df',
    ACCESSIBILITY: '#e0f7f6',
    INTEROPERABILITY: '#fde8e3',
    REUSABILITY: '#f5e5e7',
  };

  const pillarColor = pillarColors[indicator.pillar] || '#a8a9ad';
  const pillarBgColor = pillarBgColors[indicator.pillar] || '#f5f5f5';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{
          mb: 3,
          color: '#0f9884',
          borderColor: '#0f9884',
          '&:hover': {
            backgroundColor: '#e0f7f6',
            borderColor: '#0f9884',
          },
        }}
      >
        Back to Dashboard
      </Button>

      {/* Main Content Card */}
      <Paper
        sx={{
          p: 4,
          borderTop: `5px solid ${pillarColor}`,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Pillar Badge */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={indicator.pillar}
            sx={{
              backgroundColor: pillarBgColor,
              color: pillarColor,
              fontWeight: 'bold',
              fontSize: '0.875rem',
            }}
          />
        </Box>

        {/* Icon and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Icon sx={{ fontSize: 48, color: pillarColor }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#222' }}>
              {indicator.label}
            </Typography>
            {indicator.rdaCode !== 'N/A' && (
              <Typography variant="body2" sx={{ color: '#666', fontFamily: 'monospace', mt: 0.5 }}>
                RDA Indicator: <strong>{indicator.rdaCode}</strong>
              </Typography>
            )}
          </Box>
        </Box>

        {/* Description */}
        <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ color: '#999', textTransform: 'uppercase', mb: 1 }}>
            Assessment Question
          </Typography>
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.7, fontSize: '1.1rem' }}>
            {indicator.description}
          </Typography>
        </Box>

        {/* Definition */}
        {indicator.definition && (
          <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ color: '#999', textTransform: 'uppercase', mb: 1 }}>
              Definition
            </Typography>
            <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.7 }}>
              {indicator.definition}
            </Typography>
          </Box>
        )}

        {/* RDA Information */}
        {indicator.rdaCode !== 'N/A' && (
          <Box sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderLeft: `4px solid ${pillarColor}`, borderRadius: '4px' }}>
            <Typography variant="subtitle2" sx={{ color: '#666', textTransform: 'uppercase', mb: 1 }}>
              RDA Classification
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', fontFamily: 'monospace' }}>
              <strong>{indicator.rdaCode}</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', mt: 1, display: 'block' }}>
              {indicator.rdaCode.includes('M') && 'M = Mandatory'}
              {indicator.rdaCode.includes('D') && (indicator.rdaCode.includes('M') ? ' | ' : '')}
              {indicator.rdaCode.includes('D') && 'D = Dataset-level'}
            </Typography>
          </Box>
        )}

        {/* Citation */}
        <Box sx={{ p: 3, backgroundColor: pillarBgColor, borderRadius: '4px', borderLeft: `4px solid ${pillarColor}` }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <DocumentIcon sx={{ color: pillarColor, mt: 0.5, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 'bold', mb: 0.5 }}>
                Citation
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                RDA FAIR Data Maturity Model: Specification and Guidelines v1.0
              </Typography>
              <MuiLink
                href="/FAIR Data Maturity Model_ specification and guidelines_v1.00.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: pillarColor,
                  fontWeight: '500',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                📄 View Full Document
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
