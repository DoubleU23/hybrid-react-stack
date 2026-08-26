import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { api } from "@convex/api";
import Box from '@mui/material/Box'
import { Button, CircularProgress, Divider, Grid, Typography, Stack, Paper } from "@mui/material";
import { useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router";
import PageContainer from "src/components/mui/PageContainer";
import dayjs from "dayjs";

export default function ArticleShow(params:any) {
    const navigate = useNavigate()
    const {articleId} = useParams()
    const article = useQuery(api.articles.getArticleById, {articleId})
    console.log('article :>> ', article);

const handleBack = () => {
    navigate('/admin/articles')
}
const handleUserEdit = () => {
    navigate(`/articles/${articleId}/edit`)
}

    if(article === undefined) {
        return (
            <PageContainer>
                <CircularProgress />
            </PageContainer>
        )
    }

    return (
        <PageContainer title={`Show Article - ${article.title}`} breadcrumbs={[{title: 'Dashboard', path: "/admin"}, {title: 'Articles', path: "/admin/articles"}]}>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>title</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {article.title}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Subtitle</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {article.subtitle}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Created at</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                 {dayjs(article.created_at).format('MMMM D, YYYY')}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant='overline'>Created By</Typography>
              <Typography variant='body1' sx={{ mb: 1 }}>
                {article.author}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant='overline'>Image URL</Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                {article.img_url  /* TODO: add modal for preview */ }
                </Typography>
            </Paper>
        </Box>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Paper sx={{ px: 2, py: 3 }}>
                <Typography variant='overline'>Text</Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                {article.text}
                </Typography>
            </Paper>
        </Box>
        <Stack direction='row' spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back
          </Button>
          <Stack direction='row' spacing={2}>
            <Button variant='contained' startIcon={<EditIcon />} onClick={handleUserEdit}>
              Edit
            </Button>
            {/* <Button variant='contained' color='error' startIcon={<DeleteIcon />} onClick={() => handleUserDelete(article.username)}>
              Delete
            </Button> */}
          </Stack>
          </Stack>
      </Box>
        </PageContainer>

    )
}