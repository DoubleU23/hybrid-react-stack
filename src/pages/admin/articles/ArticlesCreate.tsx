import * as React from 'react'
import { useNavigate } from 'react-router'
import { Box } from '@mui/material'
import { useMutation } from 'convex/react'
import { api } from '@convex/api'

import PageContainer from 'src/components/mui/PageContainer'
import useNotifications from 'src/hooks/useNotifications/useNotifications'
import ArticleForm, { type ArticleObject } from './ArticleForm'
import { useAuth } from '@clerk/react'
import { useQuery } from 'convex/react'
import {CircularProgress} from '@mui/material'


export default function ArticleCreate() {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const {userId} = useAuth()
  const user = useQuery(api.users.getUserByClerkUserId, {clerk_user_id: userId})
  const createArticle = useMutation(api.articles.createArticle)

  const handleSubmit = React.useCallback(
    async (formValues: ArticleObject) => {
      try {
        await createArticle({
          article: formValues,
        })

        notifications.show('Article successfully created.', {
          severity: 'success',
          autoHideDuration: 3000,
        })

        navigate('/admin/articles')
      } catch (createError) {
        console.error('Convex transaction rejected:', createError)
        notifications.show(`Failed to save Article. Reason: ${(createError as Error).message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        })
      }
    },
    [createArticle, navigate, notifications]
  )


  if(!user)
    return (
      <PageContainer title="Loading Articles..." breadcrumbs={[{ title: 'Users', path: '/admin/users' }]}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
  )

const initialArticleValues: ArticleObject = {
  title: '',
  subtitle: '',
  author: user.username,
  created_at: Date.now(),
  text: '',
  img_url: null,
} as any

  return (
    <PageContainer
      title="Create New Article"
      breadcrumbs={[
        { title: 'Articles', path: '/admin/articles' },
        { title: 'Create' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, p: 2 }}>
        <ArticleForm
          initialValues={initialArticleValues}
          onSubmit={handleSubmit}
          submitButtonLabel="Create Article"
          backButtonPath="/admin/articles"
        />
      </Box>
    </PageContainer>
  )
}