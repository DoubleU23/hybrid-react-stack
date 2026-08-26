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

export type UserFormState  = {
  values: UserValues,
  errors: Partial<Record<keyof UserValues, string | null | undefined>>
}
export interface UserFormProps {
  formState: FormState<UserValues>;
  onFieldChange: (name: keyof UserValues, value: any) => void
  onSubmit: (values: UserValues) => Promise<void> | void
  onReset?: (values: UserValues) => void
  submitButtonLabel: string
  backButtonPath?: string
}

export type ValidationResult = { issues: { message: string; path: (keyof UserValues)[] }[] }


export function validateUser(user: Partial<UserValues>): ValidationResult {
  let issues: ValidationResult['issues'] = []

  if (!user.username) {
    issues = [...issues, { message: 'Username is required', path: ['username'] }]
  }

  if (user.first_name && user.first_name.length <= 3) {
    issues = [...issues, { message: 'First Name must not be under 3 chars ', path: ['first_name'] }]
  }

  // if (!employee.age) {
  //   issues = [...issues, { message: 'Age is required', path: ['age'] }];
  // } else if (employee.age < 18) {
  //   issues = [...issues, { message: 'Age must be at least 18', path: ['age'] }];
  // }

  if (!user.created_at) {
    issues = [...issues, { message: 'Join date is required', path: ['created_at'] }]
  }

  if (!user.role) {
    issues = [...issues, { message: 'Role is required', path: ['role'] }]
  } else if (!['user', 'admin'].includes(user.role)) {
    issues = [...issues, { message: 'Role must be "user or admin"', path: ['role'] }]
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
    selectProps: { defaultValue: 'user' },
    options: [
      { value: 'admin', label: 'admin' },
      { value: 'user', label: 'user' },
    ],
  },
  { name: 'created_at', label: 'Join date', type: 'date' },
  { name: 'isFullTime', label: 'Full-time', type: 'checkbox' },
]

export default function UserForm(props: UserFormProps) {
  return <AbstractForm<UserValues> {...props} fields={userFields} defaultBackButtonPath='/users' />
}
