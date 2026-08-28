import { Outlet } from 'react-router'
import AppFooter from '../AppFooter'
import AppHeader from './AppHeader'
import './App.css'

function App() {
  return (
    <>
      <AppHeader />
      <div id='app-wrapper'>
        <Outlet />
      </div>
      <AppFooter />
    </>
  )
}

export default App
