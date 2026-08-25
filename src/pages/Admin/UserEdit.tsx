import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { UserObject } from 'convex/schema'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import { apiFetchUserByClerkId, apiPushUserUpdate } from '../../apiCalls/users'
import PageContainer from '../../components/admin/PageContainer'
import type { UserValues } from '../../components/admin/UserForm'
// Import the new abstracted UserForm component and types
import UserForm, { validateUser } from '../../components/admin/UserForm'
import type { FormState } from '../../components/mui/AbstractForm'
import useNotifications from '../../hooks/useNotifications/useNotifications'

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

  // 1. Fixed error mapping with 'as any' and corrected 'formValues' reference to 'initialValues'
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
      throw editError
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

export default function EmployeeEdit() {
  const { userId } = useParams()

  const [user, setUser] = React.useState<UserObject | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const loadData = React.useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      const userData = await apiFetchUserByClerkId(userId || '')
      setUser(userData)
    } catch (showDataError) {
      setError(showDataError as Error)
    }
    setIsLoading(false)
  }, [userId])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleSubmit = React.useCallback(async (formValues: Partial<UserValues>) => {
    console.log('formValues :>> ', formValues)
    // delete formValues._id
    // delete formValues._creationTime
    const updatedData = await apiPushUserUpdate(formValues)
    setUser(updatedData)
  }, [])

  const renderEdit = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity='error'>{error.message}</Alert>
        </Box>
      )
    }

    return user ? <UserEditForm initialValues={user as UserValues} onSubmit={handleSubmit} /> : null
  }, [isLoading, error, user, handleSubmit])

  return (
    <PageContainer
      title={`Edit User "${user?.username}"`}
      breadcrumbs={[
        { title: 'Users', path: '/admin/users' },
        { title: `${user?.username}`, path: `/admin/user/${userId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  )
}
