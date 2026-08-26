import { useCallback, useState, useEffect } from 'react'
import type { FieldConfig, FormState } from 'src/components/mui/AbstractForm'
import AbstractForm from 'src/components/mui/AbstractForm'

export interface ArticleValues {
  title: string | null
  subtitle: string | null
  author: string | null
  created_at: number | null // Handled as unix timestamp or standard number
  text: string | null
  img_url: string | null
}

export type ValidationResult = { issues: { message: string; path: (keyof ArticleValues)[] }[] }

export function validateArticle(article: Partial<ArticleValues>): ValidationResult {
  let issues: ValidationResult['issues'] = []

  if (!article.title) {
    issues = [...issues, { message: 'Title is required', path: ['title'] }]
  }

  if (article.subtitle && article.subtitle.length < 3) {
    issues = [...issues, { message: 'Subtitle must be at least 3 characters', path: ['subtitle'] }]
  }

  if (!article.created_at) {
    issues = [...issues, { message: 'Creation date is required', path: ['created_at'] }]
  }

  if (!article.author) {
    issues = [...issues, { message: 'Author is required', path: ['author'] }]
  }

  if (!article.text) {
    issues = [...issues, { message: 'Content text is required', path: ['text'] }]
  }

  return { issues }
}

const articleFields: FieldConfig<ArticleValues>[] = [
  { name: 'title', label: 'Title', type: 'text', gridSize: { xs: 12, sm: 6 } },
  { name: 'subtitle', label: 'Subtitle', type: 'text', gridSize: { xs: 12, sm: 6 } },
  { name: 'author', label: 'Author', type: 'text', gridSize: { xs: 12, sm: 6 }, addProps: {slotProps: {htmlInput: {disabled: true}}} },
  { name: 'created_at', label: 'Created At', type: 'date', gridSize: { xs: 12, sm: 6 } },
  { name: 'img_url', label: 'Image URL', type: 'text', gridSize: { xs: 12 } }, // Changed from checkbox to text
  { name: 'text', label: 'Article Content', type: 'textarea', gridSize: { xs: 12 } },
]

export interface ArticleFormProps {
  initialValues: ArticleValues
  onSubmit: (values: ArticleValues) => Promise<void> | void
  submitButtonLabel: string
  backButtonPath?: string
}

export default function ArticleForm({
  initialValues,
  onSubmit,
  submitButtonLabel,
  backButtonPath,
}: ArticleFormProps) {

  // Localized atomic state to eliminate race-conditions and stale validation loops
  const [formState, setFormState] = useState<FormState<ArticleValues>>({
    values: initialValues,
    errors: {},
  })

  // Synchronizes internal fields if defaults reset or map asynchronously later
  useEffect(() => {
    setFormState({ values: initialValues, errors: {} })
  }, [initialValues])

  // Contextual live checking mapped to individual controls
  const handleFieldChange = useCallback((name: keyof ArticleValues, value: any) => {
    setFormState((prev) => {
      // Convert ISO Date strings to numeric Timestamps for Convex/State match if necessary
      let cleanValue = value
      if (name === 'created_at' && value) {
        cleanValue = Date.parse(value) // converts string to primitive number timestamp
      }

      const nextValues = { ...prev.values, [name]: cleanValue }
      const { issues } = validateArticle(nextValues)
      const fieldIssue = issues.find((issue) => issue.path[0] === name)

      return {
        values: nextValues,
        errors: {
          ...prev.errors,
          [name]: fieldIssue ? fieldIssue.message : undefined,
        },
      }
    })
  }, [])

  const handleReset = useCallback(() => {
    setFormState({ values: initialValues, errors: {} })
  }, [initialValues])

  const handleSubmit = useCallback(async () => {
    const currentValues = formState.values
    const { issues } = validateArticle(currentValues)

    if (issues && issues.length > 0) {
         console.log("❌ Form validation failed! Issues found:", issues)
      const nextErrors = Object.fromEntries(
        issues.map((issue) => [issue.path[0], issue.message])
      ) as Partial<Record<keyof ArticleValues, string>>

      setFormState((prev) => ({ ...prev, errors: nextErrors }))
      return
    }

    setFormState((prev) => ({ ...prev, errors: {} }))
    await onSubmit(currentValues)
  }, [formState.values, onSubmit])

  return (
    <AbstractForm<ArticleValues>
      formState={formState}
      fields={articleFields}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitButtonLabel={submitButtonLabel}
      backButtonPath={backButtonPath}
      defaultBackButtonPath="/admin/articles"
    />
  )
}