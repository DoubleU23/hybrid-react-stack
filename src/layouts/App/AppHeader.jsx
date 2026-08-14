import { NavLink } from 'react-router'
import AppRoutes from "../../routes"
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/react';

export default function AppHeader(params) {
    return (
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
    )
}