import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent, type SelectProps } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { UserObject } from 'convex/schema'
import dayjs, { type Dayjs } from 'dayjs'
import * as React from 'react'
import { useNavigate } from 'react-router'
export interface UserFormState {
  values: Partial<Omit<Omit<UserObject, '_id'>, '_creationTime'>>
  errors: Partial<Record<keyof UserFormState['values'], string>>
}

export type FormFieldValue = string | string[] | number | boolean | File | null

export interface UserFormProps {
  formState: UserFormState
  onFieldChange: (name: keyof UserFormState['values'], value: FormFieldValue) => void
  onSubmit: (formValues: Partial<UserFormState['values']>) => Promise<void>
  onReset?: (formValues: Partial<UserFormState['values']>) => void
  submitButtonLabel: string
  backButtonPath?: string
}

const apiFetchUserByClerkId = async () => {
  const response = await fetch('https://dynamic-stingray-365.eu-west-1.convex.site/api/getUsersPaginated', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  console.log(data) // Outputs: "Success!"
  return data
}

export default function UserForm(props: UserFormProps) {
  const { formState, onFieldChange, onSubmit, onReset, submitButtonLabel, backButtonPath } = props

  const formValues = formState.values
  const formErrors = formState.errors

  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      setIsSubmitting(true)
      try {
        await onSubmit(formValues)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formValues, onSubmit],
  )

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(event.target.name as keyof UserFormState['values'], event.target.value)
    },
    [onFieldChange],
  )

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(event.target.name as keyof UserFormState['values'], Number(event.target.value))
    },
    [onFieldChange],
  )

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof UserFormState['values'], checked)
    },
    [onFieldChange],
  )

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof UserFormState['values']) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null)
      } else if (formValues[fieldName]) {
        onFieldChange(fieldName, null)
      }
    },
    [formValues, onFieldChange],
  )

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(event.target.name as keyof UserFormState['values'], event.target.value)
    },
    [onFieldChange],
  )

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues)
    }
  }, [formValues, onReset])

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/users')
  }, [navigate, backButtonPath])

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      noValidate
      autoComplete='off'
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.first_name ?? ''}
              onChange={handleTextFieldChange}
              name='first_name'
              label='First Name'
              error={!!formErrors.first_name}
              helperText={formErrors.first_name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.last_name ?? ''}
              onChange={handleTextFieldChange}
              name='last_name'
              label='Last Name'
              error={!!formErrors.last_name}
              helperText={formErrors.last_name ?? ' '}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.username ?? ''}
              onChange={handleTextFieldChange}
              name='username'
              label='Username'
              error={!!formErrors.username}
              helperText={formErrors.username ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.role} fullWidth>
              <InputLabel id='employee-role-label'>Role</InputLabel>
              <Select
                value={formValues.role ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId='employee-role-label'
                name='role'
                label='Role'
                defaultValue='user'
                fullWidth
              >
                <MenuItem value='admin'>admin</MenuItem>
                <MenuItem value='user'>user</MenuItem>
              </Select>
              <FormHelperText>{formErrors.role ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        {/*  <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.created_at ? dayjs(formValues.created_at) : null}
                onChange={handleDateFieldChange('created_at')}
                name='created_at'
                label='Join date'
                slotProps={{
                  textField: {
                    error: !!formErrors.created_at,
                    helperText: formErrors.created_at ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid> */}

        {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name='isFullTime'
                control={
                  <Checkbox
                    size='large'
                    checked={formValues.isFullTime ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label='Full-time'
              />
              <FormHelperText error={!!formErrors.isFullTime}>{formErrors.isFullTime ?? ' '}</FormHelperText>
            </FormControl>
          </Grid> */}
      </FormGroup>
      <Stack direction='row' spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Button type='submit' variant='contained' size='large' loading={isSubmitting}>
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  )
}
