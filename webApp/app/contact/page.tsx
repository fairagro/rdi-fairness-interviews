import { Box, Typography, Paper, Link as MuiLink } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import FeedbackIcon from '@mui/icons-material/Feedback';
import WarningIcon from '@mui/icons-material/Warning';

export default function ContactPage() {
  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#222', mb: 1 }}>
        Contact & Feedback
      </Typography>
      <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
        We value your input and would love to hear from you. Whether you have suggestions, found a bug, or want to contribute to improving the FAIRagro platform.
      </Typography>

      {/* Community Engagement Section */}
      <Paper sx={{ p: 4, backgroundColor: '#e0f7f6', borderLeft: '5px solid #0f9884', borderRadius: '8px', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FeedbackIcon sx={{ color: '#0f9884' }} />
          Community Engagement
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8, mb: 3 }}>
          As the platform is being developed for the community, it must meet the needs and requirements of the community. To ensure this, we are working closely with domain experts within the {' '}
          <MuiLink 
            href="https://fairagro.net/en" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ color: '#0f9884', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}
          >
            FAIRagro project
          </MuiLink>
          , especially the FAIRagro Use Cases, who represent the community of interest.
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
          We invite everyone to suggest features, ideas, or requirements and report bugs to the development team. You can do this by:
        </Typography>
        <Box component="ul" sx={{ color: '#333', mt: 2, mb: 2, pl: 3 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>Using the feedback box on the right side of the screen</Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>Sending an email to the contact below</Typography>
          <Typography component="li" variant="body2">Reaching out through the FAIRagro project channels</Typography>
        </Box>
      </Paper>

      {/* Direct Contact Section */}
      <Paper sx={{ p: 4, backgroundColor: '#e1f2df', borderLeft: '5px solid #6abf5c', borderRadius: '8px', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon sx={{ color: '#6abf5c' }} />
          Get in Touch
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}>
          For direct inquiries, feedback, or to report issues, please contact:
        </Typography>
        <Box sx={{ 
          p: 2.5, 
          backgroundColor: 'white', 
          borderRadius: '4px', 
          border: '2px solid #6abf5c',
          mb: 2
        }}>
          <MuiLink
            href="mailto:a.haleem@fz-juelich.de"
            sx={{
              color: '#6abf5c',
              fontWeight: '600',
              fontSize: '1.1rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            a.haleem@fz-juelich.de
          </MuiLink>
        </Box>
        <Typography variant="body2" sx={{ color: '#555' }}>
          We typically respond to inquiries within 2-3 business days.
        </Typography>
      </Paper>

      {/* FAIRness Assessment Disclaimer */}
      <Paper sx={{ p: 4, backgroundColor: '#fde8e3', borderLeft: '5px solid #f26e5f', borderRadius: '8px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#f26e5f' }} />
          FAIRness Assessment Notice
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8, mb: 2 }}>
          The FAIRness assessments displayed on this platform are based on information provided during interviews and from publicly available metadata sources. These assessments represent a point-in-time evaluation.
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
          <strong>If you believe that:</strong>
        </Typography>
        <Box component="ul" sx={{ color: '#333', mt: 2, mb: 3, pl: 3 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>Your infrastructure's FAIRness has improved since the assessment</Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>Information in your assessment is incorrect or outdated</Typography>
          <Typography component="li" variant="body2">The assessment does not accurately reflect your current practices</Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
          Please reach out to us at <strong>a.haleem@fz-juelich.de</strong> with details about the changes or corrections needed. We will be happy to review and update your assessment accordingly.
        </Typography>
      </Paper>
    </Box>
  );
}
