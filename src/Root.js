import { NavLink, Outlet } from 'react-router'
import AppRoutes from './routes'
import './pages/App.css'

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
      <div id='app-wrapper'>
        <header className='app-header'>
          <p>Header</p>
          <nav>
            {AppRoutes[0].children.map(({ name, path }) => (
              <NavLink key={`NavLinkTo${name}`} to={path} className={({ isActive }) => (isActive ? ' active' : '')}>
                {name?.toUpperCase()}
              </NavLink>
            ))}
            <NavLink key={'NavLinkToABC'} to={'abc'} className={({ isActive }) => (isActive ? ' active' : '')}>
              {'ABC'}
            </NavLink>
          </nav>

          {/* Core 3 Standard: Bedingtes Rendern über die "when"-Prop von <Show> */}
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton />
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </header>
        <Outlet />
      </div>
    </ClerkProvider>
  )
}

export default App;