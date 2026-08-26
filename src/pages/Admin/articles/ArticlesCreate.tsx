import { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Box, CircularProgress } from '@mui/material'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@convex/api' // Matches your workspace structure

import PageContainer from 'src/components/mui/PageContainer'
import useNotifications from 'src/hooks/useNotifications/useNotifications'
import ArticleForm, { type ArticleValues } from './ArticleForm'
import type { ArticleObject, UserObject } from "../../../../convex/schema"
import { useAuth } from '@clerk/react'

//  type ArticleObject = Doc<"articles">

// Default empty form template schema matching target typing

export default function ArticleCreate() {
 const navigate = useNavigate()
  const notifications = useNotifications()
  const createArticle =  useMutation(api.articles.createArticle)
const {userId} = useAuth()
const user = useQuery(api.users.getUserByClerkUserId, {clerk_user_id: userId})
console.log('userquery :>> ', user);

  const handleSubmit = useCallback(
    async (formValues: ArticleValues) => {
      try {
        await createArticle({
          article: formValues as ArticleObject
        })

        notifications.show('Article successfully created.', {
          severity: 'success',
          autoHideDuration: 3000,
        })

        navigate('/admin/articles')
      } catch (createError) {
        console.error('Mutation failed:', createError)
        notifications.show(`Failed to save Article. Reason: ${(createError as Error).message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        })
      }
    },
    [createArticle, navigate, notifications]
  )

  if (user === undefined) {
    return (
      <PageContainer title="User Not Found" breadcrumbs={[{ title: 'Users', path: '/admin/users' }]}>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }
const initialArticleValues: ArticleValues = {
  title: '',
  subtitle: '',
  author: user.username,
  created_at: Date.now(), // Sets modern timestamp automatically on load
  text: '',
  img_url: '',
}

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
          onSubmit={(e) => {console.log('submit :>> '); handleSubmit(e)}}
          submitButtonLabel="Create Article"
          backButtonPath="/admin/articles"
        />
      </Box>
    </PageContainer>
  )
}