import * as React from 'react'
import type { FieldConfig, FormState } from '../../../components/mui/AbstractForm'
import AbstractForm from '../../../components/mui/AbstractForm'

export interface UserValues {
  first_name: string | null
  last_name: string | null
  username: string | null
  role: 'admin' | 'user' | ''
  created_at?: string | null
  isFullTime?: boolean
}

export type ValidationResult = { issues: { message: string; path: (keyof UserValues)[] }[] }

export function validateUser(user: Partial<UserValues>): ValidationResult {
  let issues: ValidationResult['issues'] = []

  if (!user.username) {
    issues = [...issues, { message: 'Username is required', path: ['username'] }]
  }
  if (user.first_name && user.first_name.length <= 3) {
    issues = [...issues, { message: 'First Name must be longer than 3 chars', path: ['first_name'] }]
  }
  if (!user.created_at) {
    issues = [...issues, { message: 'Join date is required', path: ['created_at'] }]
  }
  if (!user.role) {
    issues = [...issues, { message: 'Role is required', path: ['role'] }]
  } else if (!['user', 'admin'].includes(user.role)) {
    issues = [...issues, { message: 'Role must be "user" or "admin"', path: ['role'] }]
  }

  return { issues }
}

const userFields: FieldConfig<UserValues>[] = [
  { name: 'first_name', label: 'First Name', type: 'text' },
  { name: 'last_name', label: 'Last Name', type: 'text' },
  { name: 'username', label: 'Username', type: 'text' },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'admin', label: 'admin' },
      { value: 'user', label: 'user' },
    ],
  },
  { name: 'created_at', label: 'Join date', type: 'date' },]

// Externe Schnittstelle für Edit / Create Pages
export interface UserFormProps {
  initialValues: UserValues
  onSubmit: (values: UserValues) => Promise<void> | void
  submitButtonLabel: string
  backButtonPath?: string
}

export default function UserForm({
  initialValues,
  onSubmit,
  submitButtonLabel,
  backButtonPath,
}: UserFormProps) {

  // Lokaler State für Werte und Fehler vereint (verhindert asynchrone Stale-State Bugs)
  const [formState, setFormState] = React.useState<FormState<UserValues>>({
    values: initialValues,
    errors: {},
  })

  // Synchronisiert State, falls sich initialValues extern ändern (z.B. nach async Fetch)
  React.useEffect(() => {
    setFormState({ values: initialValues, errors: {} })
  }, [initialValues])

  // Live-Validierung beim Tippen (isoliert auf das geänderte Feld)
  const handleFieldChange = React.useCallback((name: keyof UserValues, value: any) => {
    setFormState((prev) => {
      const nextValues = { ...prev.values, [name]: value }
      const { issues } = validateUser(nextValues)
      const fieldIssue = issues.find((issue) => issue.path?.[0] === name)

      return {
        values: nextValues,
        errors: {
          ...prev.errors,
          [name]: fieldIssue ? fieldIssue.message : undefined,
        },
      }
    })
  }, [])

  const handleReset = React.useCallback(() => {
    setFormState({ values: initialValues, errors: {} })
  }, [initialValues])

  const handleSubmit = React.useCallback(async () => {
    const currentValues = formState.values
    const { issues } = validateUser(currentValues)

    // Gesamtes Formular vor dem Abschicken validieren
    if (issues && issues.length > 0) {
      const nextErrors = Object.fromEntries(
        issues.map((issue) => [issue.path?.[0], issue.message])
      ) as Partial<Record<keyof UserValues, string>>

      setFormState((prev) => ({ ...prev, errors: nextErrors }))
      return
    }

    setFormState((prev) => ({ ...prev, errors: {} }))
    await onSubmit(currentValues)
  }, [formState.values, onSubmit])

  return (
    <AbstractForm<UserValues>
      formState={formState}
      fields={userFields}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitButtonLabel={submitButtonLabel}
      backButtonPath={backButtonPath}
      defaultBackButtonPath="/admin/users"
    />
  )
}