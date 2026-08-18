import { Outlet } from 'react-router'
import './Root.css'

// In Core 3 importieren wir alles aus '@clerk/react'
import { ClerkProvider, useAuth } from '@clerk/react'
import { dark } from '@clerk/ui/themes'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useNavigate } from 'react-router-dom'

// import { ClerkProvider } from '@clerk/react-router';
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
          <Outlet />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </div>
  )
}

export default Root
