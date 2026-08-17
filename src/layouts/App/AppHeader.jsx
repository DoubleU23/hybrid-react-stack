// import AppRoutes from "../../routes"
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { NavLink } from 'react-router'

// {AppLayoutRoutes.children.map(({ name, path }) => (
//     <NavLink key={`NavLinkTo${name}`} to={path} className={({ isActive }) => (isActive ? ' active' : '')}>
//     {name?.toUpperCase()}
//     </NavLink>
// ))}

export default function AppHeader(params) {
  // const AppLayoutRoutes = AppRoutes[0].children[0]
  return (
    <header id='appHeader'>
      <div id="logo">Header</div>
      <nav>
        <NavLink to='/' end className={({ isActive }) => (isActive ? ' active' : '')}>
          HOME
        </NavLink>
        <NavLink to='/abc' className={({ isActive }) => (isActive ? ' active' : '')}>
          ABC
        </NavLink>
        <div id='userNav'>
          <Show
            fallback={
              <div>
                <NavLink to='/login' className={({ isActive }) => (isActive ? ' active' : '')}>
                  LOGIN
                </NavLink>
                <NavLink to='/register' className={({ isActive }) => (isActive ? ' active' : '')}>
                  Register
                </NavLink>
              </div>
            }
            when='signed-in'
          >
            <UserButton userProfileMode='navigation' and userProfileUrl='/profile'/>
          </Show>
        </div>
      </nav>
    </header>
  )
}
