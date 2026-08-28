import { api } from '@convex/api'
import styled from '@emotion/styled'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import type { ButtonProps } from '@mui/material'
import {
  Avatar,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import Box from '@mui/material/Box'
import { useQuery } from 'convex/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PageContainer from 'src/components/mui/PageContainer'
export default function ArticleShow(params: any) {
  const navigate = useNavigate()
  const { articleId } = useParams()
  const article = useQuery(api.articles.getArticleById, { articleId })
  console.log('article :>> ', article)

  const handleBack = () => {
    navigate('/admin/articles')
  }
  const handleUserEdit = () => {
    navigate(`/articles/${articleId}/edit`)
  }

  const handleImgPreview = () => {
    setDialogOpen(!dialogOpen)
  }

  const [dialogOpen, setDialogOpen] = useState(false)

  if (article === undefined) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    )
  }

  const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: '100%',
    width: '100%',
    '&:hover, &.Mui-focusVisible': {
      zIndex: 1,
      '& .MuiImageBackdrop-root': {
        opacity: 0.15,
      },
      '& .MuiImageMarked-root': {
        opacity: 0,
      },
      '& .MuiTypography-root': {
        border: '4px solid currentColor',
      },
    },
  }))

  return (
    <PageContainer
      title={`Show Article - ${article.title}`}
      breadcrumbs={[
        { title: 'Dashboard', path: '/admin' },
        { title: 'Articles', path: '/admin/articles' },
      ]}
    >
      <Grid sx={{ flexGrow: 1, width: '100%' }}>
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
        <Grid container spacing={2} sx={{ minHeight: '400px' }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant='overline'>Text</Typography>
            <Typography variant='body1' sx={{ mb: 1 }}>
              {article.text}
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: article.text }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ px: 0 }}>
            <Typography variant='overline'>Image URL</Typography>
            {article.img_url ? (
              <ImageButton
                focusRipple
                key={'img_thumbnail'}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: 0,
                }}
                onClick={handleImgPreview}
              >
                <img src={article.img_url} />
                {/* <ImageSrc style={{ backgroundImage: `url(${article.img_url})` }} /> */}
              </ImageButton>
            ) : (
              'no image uploaded'
            )}
          </Grid>
          {/* ---------- */}

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
        </Grid>

        <Dialog onClose={handleImgPreview} open={dialogOpen}>
          <DialogTitle>Image Preview</DialogTitle>
          <DialogContent>
            <Box
              component='img'
              src={article.img_url}
              alt='Asset Preview Presentation'
              sx={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 1,
                boxShadow: '0px 8px 24px rgba(0,0,0,0.5)',
              }}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    </PageContainer>
  )
}
