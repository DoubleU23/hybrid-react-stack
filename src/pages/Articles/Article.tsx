import { api } from '@convex/api'
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  /*   Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Paper, */
  Typography,
} from '@mui/material'
import { useQuery } from 'convex/react'
import { useNavigate, useParams } from 'react-router'
import ImageBox from 'src/components/mui/ImageBox'
import PageContainer from 'src/components/mui/PageContainer'
import type { ArticleObject } from '../../../convex/schema'

export default function ArticleList(params: object) {
  const naigate = useNavigate()
  const { articleId } = useParams()
  const article = useQuery(api.articles.getArticleById, { articleId })

  const showArticle = (articleId: string) => {
    naigate(`/articles/${articleId}`)
  }

  console.log('article :>> ', article)
  if (!article)
    return (
      <PageContainer
        title='Articles'
        breadcrumbs={[
          { title: 'Home', path: '/' },
          { title: 'Articles', path: '/articles' },
        ]}
      >
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )

  return (
    <PageContainer
      maxWidth='lg'
      title={article.title}
      breadcrumbs={[
        { title: 'Home', path: '/' },
        { title: 'Articles', path: '/articles' },
      ]}
    >
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }} key={articleId}>
          <Typography variant='h6' sx={{ mb: 1 }}>
            {article.subtitle}
          </Typography>
          <Divider sx={{ mb: 5 }} />
          <ImageBox src={article.img_url || 'https://placehold.co/1150x300'} height='300px' width='100%' />
          <div dangerouslySetInnerHTML={{ __html: article.text }} />
        </Grid>
      </Grid>
    </PageContainer>
  )
}
