import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import PageContainer from '../../../components/admin/PageContainer'
import type { UserValues } from './UserForm'
import UserForm, { validateUser } from './UserForm'
import type { FormState } from '../../../components/mui/AbstractForm'
import useNotifications from '../../../hooks/useNotifications/useNotifications'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@convex/api'

// ==========================================
// 1. Define UserEditForm first
// ==========================================
function UserEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: UserValues
  onSubmit: (formValues: Partial<UserValues>) => Promise<void>
}) {
  const { userId } = useParams()
  const navigate = useNavigate()
  const notifications = useNotifications()

  const [formState, setFormState] = React.useState<FormState<Partial<UserValues>>>(() => ({
    values: initialValues,
    errors: {} as any,
  }))
  const formValues = formState.values
  const formErrors = formState.errors

  const setFormValues = React.useCallback((newFormValues: Partial<UserValues>) => {
    setFormState((previousState: any) => ({
      ...previousState,
      values: newFormValues,
    }))
  }, [])

  const setFormErrors = React.useCallback((newFormErrors: Record<string, string | undefined>) => {
    setFormState((previousState: any) => ({
      ...previousState,
      errors: newFormErrors as Record<keyof Partial<UserValues>, string | undefined>,
    }))
  }, [])

  const handleFormFieldChange = React.useCallback(
    (name: keyof UserValues, value: any) => {
      const validateField = async (values: Partial<UserValues>) => {
        const { issues } = validateUser(values)
        setFormErrors({
          ...formErrors,
          [name]: issues?.find(issue => issue.path?.[0] === name)?.message,
        })
      }

      const newFormValues = { ...formValues, [name]: value }
      setFormValues(newFormValues)
      validateField(newFormValues)
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  )

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues)
  }, [initialValues, setFormValues])

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateUser(formValues)
    if (issues && issues.length > 0) {
      setFormErrors(Object.fromEntries(issues.map(issue => [issue.path?.[0], issue.message])))
      return
    }
    setFormErrors({})

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
  }, [formValues, navigate, notifications, onSubmit, setFormErrors])

  return (
    <UserForm
      formState={formState as any}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel='Save'
      backButtonPath={`/admin/user/${userId}`}
    />
  )
}

// ==========================================
// 2. Define and Export EmployeeEdit
// ==========================================
export default function EmployeeEdit() {
  const { userId } = useParams()
  const [isLoading, setIsLoding] = useState(true)
  let userQuery = useQuery(api.users.getUserByClerkUserId, { clerk_user_id: userId || "" })
// const user = userResponse[0]
console.log('user from query:>> ', userQuery );
  const updateUser = useMutation(api.users.updateUserByClerkId)

  const handleSubmit = React.useCallback(async (formValues: Partial<UserValues>) => {
    try {
      await updateUser({
        clerk_user_id: userId || "",
        user: formValues as any
      })
    } catch (mutationError) {
      console.error("Mutation failed:", mutationError)
      throw mutationError
    }
  }, [userId, updateUser])

  if (userQuery === undefined) {
    return (
      <PageContainer title="Loading User..." breadcrumbs={[{ title: 'Users', path: '/admin/users' }, { title: 'Edit' }]}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', m: 1 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  if (userQuery === null) {
    return (
      <PageContainer title="User Not Found" breadcrumbs={[{ title: 'Users', path: '/admin/users' }, { title: 'Edit' }]}>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Alert severity='error'>Could not find user with the provided ID.</Alert>
        </Box>
      </PageContainer>
    )
  }

const user = userQuery[0]

  return (
    <PageContainer
      title={`Edit User "${user.username}"`}
      breadcrumbs={[
        { title: 'Users', path: '/admin/users' },
        { title: `${user.username}`, path: `/admin/user/${userId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>
        <UserEditForm initialValues={user as UserValues} onSubmit={handleSubmit} />
      </Box>
    </PageContainer>
  )
}
