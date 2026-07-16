import indicators from '@/public/indicators.json';
import IndicatorClient from './client';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export async function generateStaticParams() {
  return indicators.map((ind: any) => ({
    key: ind.key,
  }));
}

export default async function IndicatorPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const indicator = indicators.find((ind: any) => ind.key === key);

  if (!indicator) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#973442', mb: 2 }}>
          Indicator Not Found
        </Typography>
        <Button variant="contained" startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
      </Box>
    );
  }

  return <IndicatorClient indicator={indicator} />;
}
