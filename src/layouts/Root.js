import { Outlet } from 'react-router'
import AppRoutes from '../routes'
import './Root.css'

import { useNavigate } from 'react-router-dom';

// In Core 3 importieren wir alles aus '@clerk/react'
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/react';

const CLERK_KEY = process.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

/* interface childrenAttributes {
    name: string
    path: string
} */

function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <div id='root-wrapper'>
        <Outlet />
      </div>
    </ClerkProvider>
  )
}

export default App;