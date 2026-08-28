import { api } from '@convex/api'
import { useMutation } from 'convex/react'
import { useCallback, useEffect, useState } from 'react'
import type { ArticleObject } from '../../../../convex/schema'
import type { FieldConfig, FormState } from '../../../components/mui/AbstractForm'
import AbstractForm from '../../../components/mui/AbstractForm'
// Nutze den offiziell generierten Datenbank-Typen für Konsistenz

// Lokaler Formular-Typ, der temporär Datei-Objekte im UI-State erlaubt
export interface ArticleFormValues extends Omit<ArticleObject, 'img_url'> {
  img_url: string | File | FileList | null
}

export type ValidationResult = { issues: { message: string; path: (keyof ArticleFormValues)[] }[] }

export function validateArticle(article: Partial<ArticleFormValues>): ValidationResult {
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

const articleFields: FieldConfig<ArticleFormValues>[] = [
  { name: 'title', label: 'Title', type: 'text', gridSize: { xs: 12, sm: 6 } },
  { name: 'subtitle', label: 'Subtitle', type: 'text', gridSize: { xs: 12, sm: 6 } },
  { name: 'author', label: 'Author', type: 'text', gridSize: { xs: 12, sm: 6 }, addProps: { disabled: true } },
  { name: 'created_at', label: 'Created At', type: 'date', gridSize: { xs: 12, sm: 6 } },
  { name: 'img_url', label: 'Upload Article Image', type: 'file', gridSize: { xs: 12 } },
  { name: 'text', label: 'Article Content', type: 'textarea', gridSize: { xs: 12 }, addProps: { multiline: true } },
]

export interface ArticleFormProps {
  initialValues: ArticleObject
  onSubmit: (values: ArticleObject) => Promise<void> | void
  submitButtonLabel: string
  backButtonPath?: string
}

export default function ArticleForm({ initialValues, onSubmit, submitButtonLabel, backButtonPath }: ArticleFormProps) {
  const [formState, setFormState] = useState<FormState<ArticleFormValues>>({
    values: initialValues as any,
    errors: {},
  })

  useEffect(() => {
    setFormState({ values: initialValues as any, errors: {} })
  }, [initialValues])

  const generateUploadUrl = useMutation(api.files.generateFileUploadUrl)

  const handleFieldChange = useCallback((name: keyof ArticleFormValues, value: any) => {
    setFormState(prev => {
      let cleanValue = value

      if (name === 'created_at' && value) {
        const parsed = Date.parse(value)
        if (!isNaN(parsed)) {
          cleanValue = parsed
        }
      }

      const nextValues = { ...prev.values, [name]: cleanValue }
      const { issues } = validateArticle(nextValues)
      const fieldIssue = issues.find(issue => issue.path[0] === name)

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
    setFormState({ values: initialValues as any, errors: {} })
  }, [initialValues])

  const handleSubmit = useCallback(async () => {
    const currentValues = formState.values
    const { issues } = validateArticle(currentValues)

    if (issues && issues.length > 0) {
      const nextErrors = Object.fromEntries(issues.map(issue => [issue.path[0], issue.message])) as Partial<
        Record<keyof ArticleFormValues, string>
      >

      setFormState(prev => ({ ...prev, errors: nextErrors }))
      return
    }

    setFormState(prev => ({ ...prev, errors: {} }))

    try {
      let finalImgUrl: string | null = typeof currentValues.img_url === 'string' ? currentValues.img_url : null

      if (currentValues.img_url instanceof FileList || currentValues.img_url instanceof File) {
        const targetFile = currentValues.img_url instanceof FileList ? currentValues.img_url[0] : currentValues.img_url

        if (targetFile) {
          const uploadUrl = await generateUploadUrl()

          const result = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': targetFile.type },
            body: targetFile,
          })

          if (!result.ok) {
            throw new Error('Failed to push file binary to Convex storage container.')
          }

          const { storageId } = await result.json()
          finalImgUrl = storageId
        }
      }

      const finalizedPayload: ArticleObject = {
        ...currentValues,
        img_url: finalImgUrl,
      } as ArticleObject

      await onSubmit(finalizedPayload)
    } catch (uploadError) {
      console.error('File storage upload error:', uploadError)

      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          img_url: `Upload failed: ${(uploadError as Error).message}`,
        },
      }))
    }
  }, [formState.values, generateUploadUrl, onSubmit])

  return (
    <AbstractForm<ArticleFormValues>
      formState={formState}
      fields={articleFields as any}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitButtonLabel={submitButtonLabel}
      backButtonPath={backButtonPath}
      defaultBackButtonPath='/admin/articles'
    />
  )
}
