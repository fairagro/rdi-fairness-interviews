import { Box, Typography, Link as MuiLink } from "@mui/material";

export default function AboutPage() {
  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#222', mb: 3 }}>
        About the FAIRagro Search Hub
      </Typography>

      <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8, mb: 3 }}>
        The FAIRagro Search Hub brings together datasets and repositories from all across the different areas of agrosystem research (mainly plants, soil and environment). The aim is to foster the implementation of the FAIR principles (Findability, Accessibility, Interoperability and Reusability) in the agricultural research domain. The FAIRagro Search Hub is not a repository itself, but harmonises metadata from many associated research data infrastructures (RDIs) such as{' '}
        <MuiLink 
          href="https://maps.bonares.de/mapapps/resources/apps/bonares/index.html?lang=en" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ color: '#0f9884', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}
        >
          BonaRes
        </MuiLink>
        , {' '}
        <MuiLink 
          href="https://www.openagrar.de/content/index.xml" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ color: '#0f9884', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}
        >
          OpenAgrar
        </MuiLink>
        , and {' '}
        <MuiLink 
          href="https://edal-pgp.ipk-gatersleben.de/" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ color: '#0f9884', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}
        >
          e!DAL
        </MuiLink>
        . The metadata are automatically harvested by the FAIRagro Middleware and transformed into a standardised metadata schema. For Repositories, it facilitates the discovery of trusted research data repositories by leveraging metadata harvested from re3data.org as well as metadata curated by Data Steward and Service Center (DSSC).
      </Typography>

      <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
        The FAIRagro Search Hub provides various search and filter functions, e.g. based on crop species or soil type. Additional options are currently under development.
      </Typography>
    </Box>
  );
}
