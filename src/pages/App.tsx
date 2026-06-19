import { NavLink, Outlet } from 'react-router'
import AppRoutes from './routes'
import './App.css'

function App() {
  return (
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
      </header>
      <Outlet />
    </div>
  )
}

export default App
