import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import { Button, CircularProgress, Divider, Grid, Typography, Stack, Paper } from "@mui/material";
import PageContainer from 'src/components/mui/PageContainer';
import { useNavigate } from 'react-router';
import ArticleForm from './ArticleForm';


export default function ArticleCreate() {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate('/admin/articles')
    }

    return (
    <PageContainer title={'Create Article'} breadcrumbs={[{title: 'Dashboard', path: "/admin"}, {title: 'Articles', path: "/admin/articles"}]}>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>title</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                asdf
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Subtitle</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                asdf
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Created at</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                 asdf
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Created By</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                asdf
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Paper sx={{ px: 2, pb: 5 }}>
                <Typography variant='overline'>Image URL</Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                asdf
                </Typography>
            </Paper>
        </Box>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Paper sx={{ px: 2, pb: 5 }}>
                <Typography variant='overline'>Text</Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                asdf
                </Typography>
            </Paper>
        </Box>
        <Stack direction='row' spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back
          </Button>
          </Stack>
      </Box>
        </PageContainer>
    )
}