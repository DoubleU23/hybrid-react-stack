import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid, // MUI v6 standard, or use your local Grid import
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
  Stack,
  TextField,
  TextareaAutosize
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'date'

export interface SelectOption {
  value: string | number
  label: string
}

export interface FieldConfig<T> {
  name: keyof T
  label: string
  type: FieldType
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number }
  options?: SelectOption[] // Required for 'select' type
  selectProps?: Partial<SelectProps>
}

export interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string | undefined>>
}

export interface AbstractFormProps<T> {
  formState: FormState<T>
  fields: FieldConfig<T>[]
  onFieldChange: (name: keyof T, value: any) => void
  onSubmit: (values: T) => Promise<void> | void
  onReset?: (values: T) => void
  submitButtonLabel: string
  backButtonPath?: string
  defaultBackButtonPath?: string
}

export default function AbstractForm<T extends Record<string, any>>(props: AbstractFormProps<T>) {
  const {
    formState,
    fields,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
    defaultBackButtonPath = '/',
  } = props

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

  const handleChange = React.useCallback(
    (name: keyof T, value: any) => {
      onFieldChange(name, value)
    },
    [onFieldChange],
  )

  const handleReset = React.useCallback(() => {
    if (onReset) onReset(formValues)
  }, [formValues, onReset])

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? defaultBackButtonPath)
  }, [navigate, backButtonPath, defaultBackButtonPath])

  const renderField = (field: FieldConfig<T>) => {
    const value = formValues[field.name]
    const errorText = formErrors[field.name]
    const hasError = !!errorText

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextField
            value={value ?? ''}
            onChange={e => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            name={String(field.name)}
            label={field.label}
            error={hasError}
            helperText={errorText ?? ' '}
            fullWidth
          />
        )
       case 'textarea':
        return (
          <TextareaAutosize
            name={String(field.name)}
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua."
            minRows={5}
            style={{minHeight: '300px'}}
          />
        )
      case 'checkbox':
        return (
          <FormControl component='fieldset'>
            <FormControlLabel
              name={String(field.name)}
              control={
                <Checkbox size='large' checked={!!value} onChange={(e, checked) => handleChange(field.name, checked)} />
              }
              label={field.label}
            />
            <FormHelperText error={hasError}>{errorText ?? ' '}</FormHelperText>
          </FormControl>
        )

      case 'select':
        return (
          <FormControl error={hasError} fullWidth>
            <InputLabel id={`${String(field.name)}-label`}>{field.label}</InputLabel>
            <Select
              value={value ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              labelId={`$String(field.name)-label`}
              name={String(field.name)}
              label={field.label}
              fullWidth
              {...field.selectProps}
            >
              {field.options?.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errorText ?? ' '}</FormHelperText>
          </FormControl>
        )

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={value ? dayjs(value) : null}
              onChange={(date: Dayjs | null) => {
                if (date?.isValid()) {
                  handleChange(field.name, date.toISOString())
                } else {
                  handleChange(field.name, null)
                }
              }}
              label={field.label}
              slotProps={{
                textField: {
                  name: String(field.name),
                  error: hasError,
                  helperText: errorText ?? ' ',
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        )

      default:
        return null
    }
  }

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
          {fields.map(field => (
            <Grid key={String(field.name)} size={field.gridSize ?? { xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
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
