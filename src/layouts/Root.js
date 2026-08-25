import { Outlet } from 'react-router'
import './Root.css'

// In Core 3 importieren wir alles aus '@clerk/react'
import { ClerkProvider, useAuth } from '@clerk/react'
import { dark } from '@clerk/ui/themes'
import { ThemeProvider } from '@mui/material/styles'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useNavigate } from 'react-router-dom'
import muiTheme from './theme/muiTheme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'

const CLERK_KEY = process.env.PUBLIC_CLERK_PUBLISHABLE_KEY

if (!CLERK_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

const convex = new ConvexReactClient(process.env.CONVEX_URL)
/* interface childrenAttributes {
    name: string
    path: string
} */

function Root() {
  const navigate = useNavigate()

  return (
    <div id='root-wrapper'>

      <ClerkProvider
        appearance={{
          baseTheme: dark,
          theme: dark,
        }}
        publishableKey={CLERK_KEY}
        routerPush={to => navigate(to)}
        routerReplace={to => navigate(to, { replace: true })}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
          <Outlet />
          </ThemeProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </div>
  )
}

export default Root
