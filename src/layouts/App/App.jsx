import { Outlet } from 'react-router'
import AppFooter from '../AppFooter'
import AppHeader from './AppHeader'
import './App.css'
import MuiTypoClassesWrapper from '../../components/mui/MuiTypoClassesWrapper'



function App() {
  return (
    <>
      <AppHeader />
        <Outlet />
      <AppFooter />
    </>
  )
}

export default App
