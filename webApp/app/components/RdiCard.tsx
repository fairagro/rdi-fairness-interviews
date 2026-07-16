import React from "react";
import { Box, Card, CardContent, Chip, Divider, Typography, Button } from "@mui/material";
import FairnessGrid from './FairnessGrid';
import { extractRdiDisplayData, extractCollections, extractRepositoryUrl, Rdi, extractDatasetSearchId } from './utils/rdiDataExtraction';
import LaunchIcon from '@mui/icons-material/Launch'; // Optional: nice to have for external links

export default function RdiCard({ rdi }: { rdi: Rdi }) {
  const { title, description, FAIRness } = extractRdiDisplayData(rdi);
  const collections = extractCollections(rdi.raw);
  const identifier = rdi.id || 'unknown';
  const url = extractRepositoryUrl(rdi.raw);

  // Safely extract the collection ID check path (adjust if different on your rdi object)
  const collectionId = extractDatasetSearchId(rdi.raw);
  console.log('extractDatasetSearchId', collectionId)

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 2, minWidth: 900, maxWidth: 900, width: '100%', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', borderTop: '4px solid var(--fairagro-teal)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <a
            href={`resource/repository/${identifier}`}
            title={title}
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: 'var(--fairagro-teal)', transition: 'color 0.2s', '&:hover': { color: 'var(--fairagro-primary-green)' } }}
            >
              {title}
            </Typography>
          </a>
          <Typography variant="body2" color="text.secondary">
            <b>({identifier})</b> 
          </Typography>
        </Box>
        {url && (
          <Typography variant="body2" sx={{ color: 'var(--fairagro-teal)', mb: 1, wordBreak: 'break-all' }}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fairagro-teal)', textDecoration: 'none' }}>{url}</a>
          </Typography>
        )}
        {description && <Typography variant="body2" sx={{ mb: 1, textAlign: 'justify' }}>{description}</Typography>}
        
        {/* Container for Collections & the Right-aligned Button */}
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left Side: Collections List */}
          {collections.length > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'bold', mr: 1, color: 'var(--fairagro-primary-green)' }}>
                Collections:
              </Typography>
              {collections.map((c: string) => (
                <Chip key={c} label={c} size="small" sx={{ backgroundColor: 'var(--fairagro-green-5)', color: 'var(--fairagro-dark-text)', fontWeight: 500 }} />
              ))}
            </Box>
          ) : (
            <Box /> /* Empty placeholder to maintain flex alignment if collections are empty but button exists */
          )}

          {/* Right Side: Conditional View Dataset Button */}
          {collectionId && collectionId.trim() !== "" && (
            <Button
              variant="outlined"
              size="small"
              href={`https://datasets.search-hub.fairagro.net/collection/${collectionId}`}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<LaunchIcon />}
              sx={{ 
                color: 'var(--fairagro-teal)', 
                borderColor: 'var(--fairagro-teal)',
                '&:hover': {
                  borderColor: 'var(--fairagro-primary-green)',
                  color: 'var(--fairagro-primary-green)',
                }
              }}
            >
              View Dataset
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />
        <FairnessGrid fairnessData={FAIRness} />
      </CardContent>
    </Card>
  );
}