import { Outlet } from 'react-router'
import AppRoutes from '../routes'
import './Root.css'
import {dark} from '@clerk/ui/themes'
import { useNavigate } from 'react-router-dom';


// In Core 3 importieren wir alles aus '@clerk/react'
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/react';
// import { ClerkProvider } from '@clerk/react-router';
const CLERK_KEY = process.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

/* interface childrenAttributes {
    name: string
    path: string
} */

function Root() {
  const navigate = useNavigate();

  return (
    <div id='root-wrapper'>
        <ClerkProvider
          appearance={{
            baseTheme: dark,  
            theme: dark,
          }}
          publishableKey={CLERK_KEY}
          routerPush={(to) => navigate(to)}
          routerReplace={(to) => navigate(to, { replace: true })}
        >
        <Outlet />
        </ClerkProvider>
      </div>
  )
}

export default Root;