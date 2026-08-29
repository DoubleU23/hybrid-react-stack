import type { ThemeOptions } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import * as React from 'react'
import MuiTypoClassesWrapper from '../../components/mui/MuiTypoClassesWrapper'
import { dataDisplayCustomizations } from './customizations/dataDisplay'
import { feedbackCustomizations } from './customizations/feedback'
import { inputsCustomizations } from './customizations/inputs'
import { navigationCustomizations } from './customizations/navigation'
import { surfacesCustomizations } from './customizations/surfaces'
import { colorSchemes, shadows, shape, typography } from './themePrimitives'

interface AppThemeProps {
  children: React.ReactNode
  disableCustomTheme?: boolean
  themeComponents?: ThemeOptions['components']
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props

  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
          },
          colorSchemes,
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        })
  }, [disableCustomTheme, themeComponents])

  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>
  }

  // Wrapping the multi-line JSX output in parentheses resolves the parser error
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <MuiTypoClassesWrapper>{children}</MuiTypoClassesWrapper>
    </ThemeProvider>
  )
}
