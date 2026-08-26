import AbstractForm from "src/components/mui/AbstractForm";
import type { FormState, FieldConfig } from "src/components/mui/AbstractForm";
   export interface ArticleValues {
    title: string | null
    subtitle: string | null
    author: string | null
    created_at: number | null
    text: string | null
    img_url: string | null
    }

    export type ArticleFormState  = {
    values: ArticleValues,
    errors: Partial<Record<keyof ArticleValues, string | null | undefined>>
    }
    export interface ArticlesFormProps {
    formState: FormState<ArticleValues>;
    onFieldChange: (name: keyof ArticleValues, value: any) => void
    onSubmit: (values: ArticleValues) => Promise<void> | void
    onReset?: (values: ArticleValues) => void
    submitButtonLabel: string
    backButtonPath?: string
    }

    export type ValidationResult = { issues: { message: string; path: (keyof ArticleValues)[] }[] }


    export function validateUser(article: Partial<ArticleValues>): ValidationResult {
    let issues: ValidationResult['issues'] = []

    if (!article.title) {
        issues = [...issues, { message: 'Username is required', path: ['title'] }]
    }

    if (article.subtitle ) {
        issues = [...issues, { message: 'First Name must not be under 3 chars ', path: ['subtitle'] }]
    }

    // if (!employee.age) {
    //   issues = [...issues, { message: 'Age is required', path: ['age'] }];
    // } else if (employee.age < 18) {
    //   issues = [...issues, { message: 'Age must be at least 18', path: ['age'] }];
    // }

    if (!article.created_at) {
        issues = [...issues, { message: 'Join date is required', path: ['created_at'] }]
    }

    if (!article.author) {
        issues = [...issues, { message: 'author is required', path: ['author'] }]
    }

    return { issues }
    }

    const articleFields: FieldConfig<ArticleValues>[] = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'subtitle', label: 'subtitle', type: 'text' },
    { name: 'text', label: 'subtitle', type: 'textarea' },
    { name: 'author', label: 'author', type: 'text' },
    { name: 'created_at', label: 'Created at', type: 'date' },
    { name: 'img_url', label: 'Image', type: 'checkbox' },
    ]

export default function ArticleForm(props: ArticlesFormProps) {
    return <AbstractForm<ArticleValues> {...props} fields={articleFields} defaultBackButtonPath='/articles' />
}
