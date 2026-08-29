import { api } from '@convex/api'
import { Box, CircularProgress } from '@mui/material'
import { useMutation, useQuery } from 'convex/react'
import { useNavigate, useParams } from 'react-router'
import PageContainer from 'src/components/mui/PageContainer'
import type { ArticleObject } from '../../../../convex/schema'
import ArticleForm from './ArticleForm'

export default function ArticlesEdit(params: any) {
    const navigate = useNavigate()
  const { articleId } = useParams()
  const article = useQuery(api.articles.getArticleById, { articleId })
 const updateArticle = useMutation(api.articles.updateArticle)

 if (!article)
    return (
      <PageContainer title='Loading Articles...'>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )

 // 2. Double Check: If the article text key is blank but exists on the item data payload
  const initialArticleValues: ArticleObject = {
    ...article
  }
//   interface ArticleUpdateObject extends ArticleObject {
//     _creationTime: number
//   }

const handleSubmit = async (finalizedPayload:ArticleObject) => {
    const {_creationTime, _id, ...payload} = finalizedPayload as any
    console.log('submit payload :>> ', payload);
    try {
    // 1. You MUST await the useMutation invocation promise
    const result = await updateArticle({
      _id,
      article: payload
    });

    navigate(`/admin/articles/${_id}/show`)

  } catch (error) {
    console.error(`Failed to save: ${error instanceof Error ? error.message : String(error)}`);
  }
}

  return (
    <PageContainer title={`Edit - "${article.title}"`}>
      <Box sx={{ display: 'flex', flex: 1, p: 2 }}>
        <ArticleForm
          key={article._id}
          initialValues={initialArticleValues}
          onSubmit={handleSubmit}
          submitButtonLabel='Save Changes'
          backButtonPath={`/admin/articles/${articleId}/show`}
        />
      </Box>
    </PageContainer>
  )
}
