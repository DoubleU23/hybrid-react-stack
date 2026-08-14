import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import './App.css'

function App() {
  return (
    <div id='app-wrapper'>
      <AppHeader />
      <Outlet />
    </div>
  )
}

export default App
