import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
  Stack,
  TextareaAutosize,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid' // Empfohlen für MUI v6
import { styled } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import HeadingExtension from '@tiptap/extension-heading'
import LinkExtension from '@tiptap/extension-link'
import Text from '@tiptap/extension-text'
import { TextStyleKit } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { RichTextEditorRef } from 'mui-tiptap'
import {
  FontSize,
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonBold,
  MenuButtonEditLink,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontSize,
  MenuSelectHeading,
  RichTextEditor,
  TableBubbleMenu,
} from 'mui-tiptap'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import InputFileUpload from './InputFileUpload'
import MuiTypographyClass from './MuiTipTapTypographyClass'

const ThemeBoundEditorWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  '& .tiptap.ProseMirror': {  
    '& .MuiTypography-h3': {
      ...theme.typography.h3,
    },
    '& .MuiTypography-h4': {
      ...theme.typography.h4,
    },
    '& .MuiTypography-h5': {
      ...theme.typography.h5,
    },
    '& .MuiTypography-subtitle1': {
      ...theme.typography.subtitle1,
    },
    '& .MuiTypography-subtitle2': {
      ...theme.typography.subtitle2,
    },
    '& .MuiTypography-button': {
      ...theme.typography.button
    },
    '& .MuiTypography-caption': {
      ...theme.typography.caption,
    },
    '& .MuiTypography-body1': {
      ...theme.typography.body1,
    },
    '& .MuiTypography-body2': {
      ...theme.typography.body2,
    },
  },
}))

export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'date' | 'file'

export interface SelectOption {
  value: string | number
  label: string
}

export interface FieldConfig<T> {
  name: keyof T
  label: string
  type: FieldType
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number }
  options?: SelectOption[]
  selectProps?: Partial<SelectProps>
  addProps?: object
}

export interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string | undefined>>
}

export interface AbstractFormProps<T> {
  formState: FormState<T>
  fields: FieldConfig<T>[]
  onFieldChange: (name: keyof T, value: any) => void
  onSubmit: () => Promise<void> | void
  onReset?: () => void
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
        // 1. Check if the rich text editor instance is mounted
        if (rteRef.current?.editor) {
          // 2. Extract the absolute latest HTML value directly from the editor
          const currentRichTextContent = rteRef.current.editor.getHTML()

          // 3. Force-sync it to your state right before onSubmit runs
          // Replace "content" with whatever your textarea field's 'name' property is (e.g., 'body', 'description')
          onFieldChange('text' as keyof T, currentRichTextContent)
        }

        // 4. Run your submit payload safely
        await onSubmit()
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, onFieldChange],
  )

  const handleChange = React.useCallback(
    (name: keyof T, value: any) => {
      onFieldChange(name, value)
    },
    [onFieldChange],
  )

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? defaultBackButtonPath)
  }, [navigate, backButtonPath, defaultBackButtonPath])

  const rteRef = useRef<RichTextEditorRef>(null)

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
            {...field.addProps}
          />
        )
      case 'textarea':
        return (
          <ThemeBoundEditorWrapper>
            <RichTextEditor
              className='RichTextEditor'
              ref={rteRef}
              extensions={[
                StarterKit.configure({ heading: false }),
                LinkBubbleMenuHandler,
                TextStyleKit,
                MuiTypographyClass,
                HeadingExtension.configure({ levels: [3, 4, 5, 6] }),
              ]}
              content={value ?? ''}
              onUpdate={({ editor }) => {
                handleChange(field.name, editor.getHTML())
              }}
              renderControls={editor => {
                const activeAttrs = editor?.getAttributes('muiTypographyClass')
                const currentVal = activeAttrs?.class ?? ''

                return (
                  <MenuControlsContainer>
                    <MenuSelectHeading />
                    <MenuDivider />

                    {/* Standard MUI Select styled seamlessly to mimic mui-tiptap controls */}
                    <Select
                      size='small'
                      value={currentVal}
                      displayEmpty
                      onChange={e => {
                        const selectedValue = e.target.value as string
                        if (!selectedValue) {
                          editor?.commands.unsetMuiClass()
                        } else {
                          editor?.commands.setMuiClass(selectedValue)
                        }
                      }}
                      sx={{
                        height: 28,
                        minWidth: 110,
                        fontSize: '0.875rem',
                        marginRight: 1,
                        backgroundColor: 'transparent',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                        '.MuiSelect-select': { py: 0, px: 1 },
                      }}
                    >
                      <MenuItem value=''>Normal</MenuItem>
                      <MenuItem value=''>normal</MenuItem>
                      <MenuItem value='MuiTypography-body1'>body1</MenuItem>
                      <MenuItem value='MuiTypography-body2'>body2</MenuItem>
                      <MenuItem value='MuiTypography-subtitle1'>subtitle1</MenuItem>
                      <MenuItem value='MuiTypography-subtitle2'>subtitle2</MenuItem>
                      <MenuItem value='MuiTypography-caption'>small</MenuItem>
                      <MenuItem value='MuiTypography-button'>capitalized</MenuItem>
                    </Select>

                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonEditLink />
                  </MenuControlsContainer>
                )
              }}
            >
              {() => (
                <>
                  <LinkBubbleMenu />
                  <TableBubbleMenu />
                </>
              )}
            </RichTextEditor>
          </ThemeBoundEditorWrapper>
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
              defaultValue={value}
              disabled={value === 'admin'}
              onChange={e => handleChange(field.name, e.target.value)}
              labelId={`${String(field.name)}-label`}
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
              {...field.addProps}
            />
          </LocalizationProvider>
        )
      case 'file': {
        const fileValue = value as File | FileList | null
        const displayName = fileValue
          ? fileValue instanceof FileList
            ? `${fileValue.length} files selected`
            : (fileValue as File).name
          : 'No file chosen'

        return (
          <FormControl error={hasError} fullWidth>
            <InputFileUpload
              fieldName={String(field.name)}
              label={field.label}
              onFieldChange={(name, val) => handleChange(name, val)}
              {...field.addProps}
            />
            <FormHelperText error={hasError}>{hasError ? errorText : displayName}</FormHelperText>
          </FormControl>
        )
      }
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
      onReset={onReset}
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
