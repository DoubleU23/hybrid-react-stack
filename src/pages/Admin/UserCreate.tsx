import type { UserObject } from 'convex/schema'
import * as React from 'react'
import { useNavigate } from 'react-router'
import { createOne as createEmployee, validate as validateEmployee } from '../../apiCalls/users'
import PageContainer from '../../components/admin/PageContainer'
import UserForm, { type FormFieldValue, type UserFormState } from '../../components/admin/UserForm'
import useNotifications from '../../hooks/useNotifications/useNotifications'

const INITIAL_FORM_VALUES: Partial<UserFormState['values']> = {
  role: 'user',
  // isFullTime: true,
}

export default function EmployeeCreate() {
  const navigate = useNavigate()

  const notifications = useNotifications()

  const [formState, setFormState] = React.useState<UserFormState>(() => ({
    values: INITIAL_FORM_VALUES,
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
        const { issues } = validateEmployee(values)
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
    setFormValues(INITIAL_FORM_VALUES)
  }, [setFormValues])

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateEmployee(formValues)
    if (issues && issues.length > 0) {
      setFormErrors(Object.fromEntries(issues.map(issue => [issue.path?.[0], issue.message])))
      return
    }
    setFormErrors({})

    try {
      await createEmployee(formValues as Omit<UserObject, 'id'>)
      notifications.show('Employee created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      })

      navigate('/admin/employees')
    } catch (createError) {
      notifications.show(`Failed to create employee. Reason: ${(createError as Error).message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      })
      throw createError
    }
  }, [formValues, navigate, notifications, setFormErrors])

  return (
    <PageContainer title='New User' breadcrumbs={[{ title: 'Employees', path: '/admin/employees' }, { title: 'New' }]}>
      <UserForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel='Create'
        backButtonPath='/admin/users'
      />
    </PageContainer>
  )
}
