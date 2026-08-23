import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import './App.css'

function App() {
  return (
    <>
      <AppHeader />
    <div id='app-wrapper'>
      <Outlet />
    </div>
    </>
  )
}

export default App
