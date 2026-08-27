import { api } from "@convex/api";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Divider, Grid, Paper, Typography } from "@mui/material";
import { useQuery } from "convex/react";
import { ArticleObject } from "convex/schema";
import { useNavigate, useParams } from "react-router";
import PageContainer from "src/components/mui/PageContainer";
import ImageBox from "src/components/mui/ImageBox";

interface ArticleDbQuery extends ArticleObject {
    _id: string
}


export default function ArticleList(params:object) {
const naigate = useNavigate()
const {articleId} = useParams()
const article = useQuery(api.articles.getArticleById, {articleId})

    const showArticle = (articleId:string) => {
        naigate(`/articles/${articleId}`)
    }


console.log('article :>> ', article);
if (!article)
    return (
        <PageContainer title="Articles" breadcrumbs={[{title: 'Home', path: '/'}, {title: 'Articles', path: '/articles'}]}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
        </PageContainer>
    )

    return (
        <PageContainer maxWidth="lg" title={article.title} breadcrumbs={[{title: 'Home', path: '/'}, {title: 'Articles', path: '/articles'}]}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, md: 6, lg: 12 }} key={articleId}>
                        <Typography variant='h6' sx={{ mb: 1 }}>{article.subtitle}</Typography>
                        <Divider  sx={{ mb: 5 }} />
                        <ImageBox src={article.img_url} height="200px" width= '100%' />
                        <Typography variant='body1'>
                            {article.text}
                        </Typography>
                    </Grid>
                </Grid>
        </PageContainer>
    )

}