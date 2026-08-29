import { api } from '@convex/api'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { useQuery} from 'convex/react'
import { useNavigate } from 'react-router'
import type { ArticleObject } from '../../../convex/schema'
import PageContainer from '../../components/mui/PageContainer'

export default function ArticleList(params: object) {
  const naigate = useNavigate()
  const articles = useQuery(api.articles.getArticles)

  const showArticle = (articleId: string) => {
    naigate(`/articles/${articleId}`)
  }

  console.log('articles :>> ', articles)
  if (!articles)
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
      title='Articles'
      breadcrumbs={[{ title: 'Home', path: '/' }]}
    >
      <Grid container spacing={3} sx={{ width: '100%' }}>
        {articles.map(({ title, subtitle, author, img_url, text, _id }: ArticleObject, index: number) => {
          return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} sx={{}} key={_id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => showArticle(_id || '')}  
              >
                <CardActionArea
                  sx={{
                    flexGrow: 1, // Zwingt die ActionArea, den gesamten restlichen Platz einzunehmen
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'flex-start',
                  }}
                >
                  <CardMedia
                    component='img'
                    height='140'
                    image={img_url || 'https://placehold.co/400x200'}
                    alt={subtitle}
                  />
                  <CardContent sx={{ minHeight: '100%' }}>
                    <Typography variant='h5' component='div'>
                      {title}
                    </Typography>
                    <Typography gutterBottom variant='h6' sx={{ m:0, color: 'text.secondary' }}>
                      {subtitle.substring(0, 200) + '...'}<br/>
                      </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      {text.substring(0, 200) + '...'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ position: 'relative', bottom: 0 }}>
                  <Button size='small' color='primary' onClick={() => showArticle(_id || '')}>
                    Read Article
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </PageContainer>
  )
}
