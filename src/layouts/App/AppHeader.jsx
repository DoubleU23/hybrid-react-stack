import { NavLink } from 'react-router'
import AppRoutes from "../../routes"
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/react';


export default function AppHeader(params) {
    const AppLayoutRoutes = AppRoutes[0].children[0]
    return (
    <header className='app-header'>
        <p>Header</p>
        <nav>
        {AppLayoutRoutes.children.map(({ name, path }) => (
            <NavLink key={`NavLinkTo${name}`} to={path} className={({ isActive }) => (isActive ? ' active' : '')}>
            {name?.toUpperCase()}
            </NavLink>
        ))}
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