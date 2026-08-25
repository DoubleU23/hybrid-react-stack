import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { UserObject } from 'convex/schema'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  apiFetchUserByClerkId,
  apiPushUserUpdate,
  getOne as getEmployee,
  validate as validateUser,
} from '../../apiCalls/users'
import PageContainer from '../../components/admin/PageContainer'
import UserForm, { type FormFieldValue, type UserFormState } from '../../components/admin/UserForm'
import useNotifications from '../../hooks/useNotifications/useNotifications'

function EmployeeEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<UserFormState['values']>
  onSubmit: (formValues: Partial<UserFormState['values']>) => Promise<void>
}) {
  const { userId } = useParams()
  const navigate = useNavigate()

  const notifications = useNotifications()

  const [formState, setFormState] = React.useState<UserFormState>(() => ({
    values: initialValues,
    errors: {},
  }))
  const formValues = formState.values
  const formErrors = formState.errors

  const setFormValues = React.useCallback((newFormValues: Partial<UserFormState['values']>) => {
    setFormState(previousState => ({
      ...previousState,
      values: newFormValues,
    }))
  }, [])

  const setFormErrors = React.useCallback((newFormErrors: Partial<UserFormState['errors']>) => {
    setFormState(previousState => ({
      ...previousState,
      errors: newFormErrors,
    }))
  }, [])

  const handleFormFieldChange = React.useCallback(
    (name: keyof UserFormState['values'], value: FormFieldValue) => {
      const validateField = async (values: Partial<UserFormState['values']>) => {
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
      formState={formState}
      // onFieldChange={()=>{return null}}
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

  const handleSubmit = React.useCallback(
    async (formValues: Partial<UserFormState['values']>) => {
      console.log('formValues :>> ', formValues)
      // const userData = Partial<Omit<UserObject, 'id'>>
      const updatedData = await apiPushUserUpdate(formValues)
      setUser(updatedData)
    },
    [userId],
  )

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

    return user ? <EmployeeEditForm initialValues={user} onSubmit={handleSubmit} /> : null
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
