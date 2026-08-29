import { styled } from '@mui/material/styles';

// Create a scoped styling container
const MuiTypoClassesWrapper = styled('div')(({ theme }) => ({
  // Scope standard headings
  // '& h3': { ...theme.typography.h3, margin: '16px 0' },
  '& h4': { ...theme.typography.h4, margin: '14px 0' },
  '& h5': { ...theme.typography.h5, margin: '12px 0' },
  '& h6': { ...theme.typography.h6, margin: '12px 0' },

  // Explicitly map the missing editor spans to matching MUI theme typographies
  '& .MuiTypography-subtitle1': {
    display: 'inline-block',
    ...theme.typography.subtitle1,
  },
  '& .MuiTypography-subtitle2': {
    display: 'inline-block',
    ...theme.typography.subtitle2,
  },
  '& .MuiTypography-body1': {
    ...theme.typography.body1,
  },
  '& .MuiTypography-body2': {
    ...theme.typography.body2,
  },
  '& .MuiTypography-caption': {
    ...theme.typography.caption,
  },
  '& .MuiTypography-button': {
    ...theme.typography.button,
  },
}));

export default MuiTypoClassesWrapper