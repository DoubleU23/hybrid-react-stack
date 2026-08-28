import { api } from '@convex/api'
import { Alert, Box, CircularProgress } from '@mui/material'
import { useMutation, useQuery } from 'convex/react'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import PageContainer from '../../../components/mui/PageContainer'
import useNotifications from '../../../hooks/useNotifications/useNotifications'
import type {UserValues} from './UserForm'
import UserForm from './UserForm'

// 1. Die Edit-Wrapper-Komponente kümmert sich NUR noch um Notifications und Redirects
function UserEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: UserValues
  onSubmit: (formValues: UserValues) => Promise<void>
}) {
  const { userId } = useParams()
  const navigate = useNavigate()
  const notifications = useNotifications()

  const handleFormSubmit = React.useCallback(
    async (formValues: UserValues) => {
      try {
        await onSubmit(formValues)
        notifications.show('User successfully edited.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
        navigate('/admin/users')
      } catch (editError) {
        notifications.show(`Failed to edit User. Reason: ${(editError as Error).message}`, {
          severity: 'error',
          autoHideDuration: 3000,
        })
      }
    },
    [navigate, notifications, onSubmit],
  )

  return (
    <UserForm
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      submitButtonLabel='Save'
      backButtonPath={`/admin/user/${userId}`}
    />
  )
}

// 2. Haupt-Export für die Routing-Page
export default function EmployeeEdit() {
  const { userId } = useParams()
  const user = useQuery(api.users.getUserByClerkUserId, { clerk_user_id: userId || '' })
  const updateUser = useMutation(api.users.updateUserByClerkId)

  const handleSubmit = React.useCallback(
    async (formValues: UserValues) => {
      await updateUser({
        clerk_user_id: userId || '',
        user: formValues as any,
      })
    },
    [userId, updateUser],
  )

  if (user === undefined) {
    return (
      <PageContainer
        title='Loading User...'
        breadcrumbs={[{ title: 'Users', path: '/admin/users' }, { title: 'Edit' }]}
      >
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  if (user === null || user.length === 0) {
    return (
      <PageContainer title='User Not Found' breadcrumbs={[{ title: 'Users', path: '/admin/users' }, { title: 'Edit' }]}>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Alert severity='error'>Could not find user with the provided ID.</Alert>
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`Edit User "${user.username}"`}
      breadcrumbs={[
        { title: 'Users', path: '/admin/users' },
        { title: `${user.username}`, path: `/admin/user/${userId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <UserEditForm initialValues={user as UserValues} onSubmit={handleSubmit} />
      </Box>
    </PageContainer>
  )
}
